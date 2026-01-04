// ==UserScript==
// @name          housingEnricherNL
// @namespace     com.parker.david
// @version       V0.0.9
// @description   A script with the goal of enriching funda.nl and pararius.nl sites with information about the listing from official sources
// @author        David Parker
// @match         https://www.funda.nl/zoeken/huur*
// @match         https://www.funda.nl/zoeken/koop*
// @match         https://www.pararius.nl/koopwoningen*
// @match         https://www.pararius.nl/huurwoningen*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=funda.nl
// @grant         GM_xmlhttpRequest
// @connect       www.ep-online.nl
// @connect       www.wozwaardeloket.nl
// @downloadURL https://update.greasyfork.org/scripts/469929/housingEnricherNL.user.js
// @updateURL https://update.greasyfork.org/scripts/469929/housingEnricherNL.meta.js
// ==/UserScript==

//switching stuff for old vs new funda
//https://stackoverflow.com/questions/48587922/using-the-same-userscript-to-run-different-code-at-different-urls

'use strict';

const labelColor = new Map([
  ['A+++', '#00A54E'],
  ['A++', '#4CB948'],
  ['A+', '#BFD72F'],
  ['A', '#FFF100'],
  ['B', '#FDB914'],
  ['C', '#F56E20'],
  ['D', "#EF1C22"],
  ['E', "#EF1C22"],
  ['F', "#EF1C22"],
  ['G', "#EF1C22"],
  [undefined, "#D8A3DD"],
]);


//debugger;

const eponline = 'https://www.ep-online.nl/Energylabel/Search'

async function Request(url, opt = {}) {
  Object.assign(opt, { url, timeout: 5000, responseType: 'json' })
  return new Promise((resolve, reject) => {
    opt.onerror = opt.ontimeout = reject
    opt.onload = resolve
    GM_xmlhttpRequest(opt)
  })
}

function extractPostcode(base) {
  var parts = base.split(' ');
  return parts[0] + parts[1];
}

function extractAddress(base) {
  if (!/\d/.test(base)) return undefined
  //get last number
  var number = base.match('\(\\d\+\)\(\?\!\.\*\\d\)')[0];
  //get last character
  var letter = base.match('\[a\-zA\-Z\]\(\?\!\.\*\[a\-zA\-Z\]\)')[0];
  // if ends with letter, return number+letter, else just number
  return (base.slice(-1) == letter) ? number + ' ' + letter : number
}

async function getToken() {
  let response = await Request(eponline, { method: 'GET' })
  let parser = new DOMParser();
  let responseDoc = parser.parseFromString(response.responseText, "text/html");
  return responseDoc.querySelector('[name="__RequestVerificationToken"]').value;
}

async function getLabel(token, address, postcode) {
  let response = await Request(eponline, {
    method: 'POST',
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data: new URLSearchParams({
      __RequestVerificationToken: token,
      SearchValue: `${postcode} ${address}`
    })
  })
  return extractLabel(response, address, postcode);
}

function extractLabel(response, address, postcode) {
  //todo: handle multi-page eponline results, one such example is "1072NK 2"
  var parser = new DOMParser();
  var responseDoc = parser.parseFromString(response.responseText, "text/html");

  var labelBlock = Array.from(responseDoc.querySelectorAll('.se-result-item-nta.se-sm-noborder'))
    .filter((doc) => {
      //empty = false, else true
      return doc.querySelector('span.sort-value-pht.text-nowrap').textContent.trim() === postcode + ' ' + address
    })[0]
  return labelBlock
}

function generateLabelSummary(node) {
  if (node === undefined)
    return { text: "issue getting label", label: undefined }

  //get the letter label
  let label = node.querySelector('[class*=bg-label-class-] > span').innerText.trim()

  // check if label is valid
  let Opnamedatum = Array.from(node.querySelectorAll('.se-item-description-nta')).filter(x => x.innerText.trim() === "Opnamedatum")[0].nextElementSibling.innerText.trim()
  if (Opnamedatum === "-") {
    return { text: "unofficial " + label, label: label }
  }

  //check if pre-2021 type label
  let energyIndex = Array.from(node.querySelectorAll('.se-item-description-nta')).filter(x => x.innerText.trim() === "EI")
  if (!!energyIndex.length) {
    return { text: "EnergyIndex: " + energyIndex[0].nextElementSibling.innerText.trim() + " (letter: " + label + ")", label: label }
  }

  // return current energy label class
  return { text: "EnergyLabel: " + label, label: label }

}

async function getWoz() {
  return "WIP"
}

async function generateWozSummary(node) {
  return node
}

function applyEnrichment(nodeToEnrich, labelSummary, wozText) {
  let pLabel = document.createElement('p')
  pLabel.textContent = labelSummary.text
  pLabel.style.backgroundColor = labelColor.get(labelSummary.label)
  nodeToEnrich.after(pLabel)
  // handle pWoz
}

async function enrich(nodes) {
  let token = await getToken()

  await Promise.all(nodes.map(async (node) => {
    let labelNode = await getLabel(token, node.address, node.postcode)
    let labelSummary = generateLabelSummary(labelNode)
    let wozNodes = await getWoz(node.address, node.postcode)
    let wozSummary = generateWozSummary(wozNodes)
    applyEnrichment(node.appendNode, labelSummary, wozSummary)
  }));
}

function getNodesToEnrichPararius() {
  let searchResultBase = document.querySelectorAll('.search-list__item--listing')
  return Array.from(searchResultBase)
    .map(node => {
      let address = extractAddress(node.querySelector('.listing-search-item__link--title').textContent.trim());
      let postcode = extractPostcode(node.querySelector(".listing-search-item__sub-title\\'").textContent.trim());
      let appendNode = node.querySelector('.listing-search-item__features')
      return { appendNode: appendNode, address: address, postcode: postcode };
    })
}

function getNodesToEnrichFunda() {
  let searchResultBase = document.querySelectorAll('[data-test-id="search-result-item"]')
  return Array.from(searchResultBase)
    .map(node => {
      let address = extractAddress(node.querySelector('[data-test-id="street-name-house-number"]').textContent.trim());
      let postcode = extractPostcode(node.querySelector('[data-test-id="postal-code-city"]').textContent.trim());
      let appendNode = node.querySelector('.flex-wrap.overflow-hidden')
      return { appendNode: appendNode, address: address, postcode: postcode };
    })
}

(async () => {

  // https://stackoverflow.com/questions/48587922/using-the-same-userscript-to-run-different-code-at-different-urls
  if (/funda\.nl/.test(location.hostname)) {
    // Run code for new funda.nl
    await enrich(getNodesToEnrichFunda())
  }
  else if (/pararius\.nl/.test(location.hostname)) {
    // Run code for pararius.nl
    await enrich(getNodesToEnrichPararius())
  }
})().catch(err => {
  console.error(err);
});



// process for wozwardeloket:

//await fetch("https://api.pdok.nl/bzk/locatieserver/search/v3_1/suggest?q=2665BH%2C%20105&rows=10", {
//    "credentials": "omit",
//    "headers": {
//        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/114.0",
//        "Accept": "application/json, text/plain, */*",
//        "Accept-Language": "en-US,en;q=0.5",
//        "Sec-Fetch-Dest": "empty",
//        "Sec-Fetch-Mode": "cors",
//        "Sec-Fetch-Site": "cross-site"
//    },
//    "method": "GET",
//    "mode": "cors"
//});

//await fetch("https://api.pdok.nl/bzk/locatieserver/search/v3_1/lookup?fl=*&id=adr-8eba3e1f7fd5d73e3f3402da85f62b7c", {
//    "credentials": "omit",
//    "headers": {
//        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/114.0",
//        "Accept": "application/json, text/plain, */*",
//        "Accept-Language": "en-US,en;q=0.5",
//        "Sec-Fetch-Dest": "empty",
//        "Sec-Fetch-Mode": "cors",
//        "Sec-Fetch-Site": "cross-site"
//    },
//    "method": "GET",
//    "mode": "cors"
//});

//await fetch("https://www.wozwaardeloket.nl/wozwaardeloket-api/v1/wozwaarde/nummeraanduiding/1621200000027796", {
//    "credentials": "include",
//    "headers": {
//        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/114.0",
//        "Accept": "application/json, text/plain, */*",
//        "Accept-Language": "en-US,en;q=0.5",
//        "Sec-Fetch-Dest": "empty",
//        "Sec-Fetch-Mode": "cors",
//        "Sec-Fetch-Site": "same-origin"
//    },
//    "referrer": "https://www.wozwaardeloket.nl/",
//    "method": "GET",
//    "mode": "cors"
//});


//{
//	"properties": {
//		"identificatie": "1621010000027755",
//		"rdf_seealso": "http://bag.basisregistraties.overheid.nl/bag/id/verblijfsobject/1621010000027755",
//		"oppervlakte": 71,
//		"status": "Verblijfsobject in gebruik",
//		"gebruiksdoel": "woonfunctie",
//		"openbare_ruimte": "Dorpsstraat",
//		"huisnummer": 105,
//		"huisletter": "",
//		"toevoeging": "",
//		"postcode": "2665BH",
//		"woonplaats": "Bleiswijk",
//		"bouwjaar": 2017,
//		"pandidentificatie": "1621100000037510",
//		"pandstatus": "Pand in gebruik"
//	}
//}

