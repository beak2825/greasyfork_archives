// ==UserScript==
// @name         eBay Seller Location Fork
// @namespace    http://tampermonkey.net/
// @version      1.2.3
// @description  Displays the registration location of eBay sellers on search results and product pages.
// @icon         https://raw.githubusercontent.com/sonofevil/eBaySellerLocationFork/main/ebaysellerlocationicon64.png
// @author       sonofevil, master131
// @license      MIT
// @match        https://www.ebay.*.*/sch/*
// @match        https://www.ebay.*/sch/*
// @match        https://www.ebay.*.*/itm/*
// @match        https://www.ebay.*/itm/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/444566/eBay%20Seller%20Location%20Fork.user.js
// @updateURL https://update.greasyfork.org/scripts/444566/eBay%20Seller%20Location%20Fork.meta.js
// ==/UserScript==

(async function() {
  'use strict';

  //HTTP request headers
  const reqhead = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/118.0',
    'Cookie': document.cookie,
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site':	'same-origin',
    'Sec-Fetch-User':	'?1',
    'TE':	'trailers',
    'Upgrade-Insecure-Requests': 1
  }

  // Inline styling for counter
  const counterStyle = "position: fixed; bottom: 10px; right: 10px; border-width: 1px; border-color: black; border-style: solid; padding: 5px; background-color: white"

  // DOM element selectors. First thing to debug when the script stops working.
  const selSrchRes = {
    entry: 'ul.srp-results > li.s-item div.s-item__info, ul.srp-results > li.s-card .su-card-container__content',
    link: '[class$="header"] a',
    info: 'span.s-item__seller-info, span.s-item__etrs, .su-card-container__attributes__secondary > :first-child',
    name: 'span.s-item__seller-info-text, span.s-item__etrs-text, .su-card-container__attributes__secondary > .s-card__attribute-row > span.su-styled-text.primary:first-child'
  }
  const selItmPage = {
    loc: '[class$="nameAndAddress"] [class$="content"] [class$="item"]:last-child',
    usrlnk: ':is(.d-stores-info-categories__container__info__section__title,.x-sellercard-atf__info__about-seller) a.ux-action[href]',
    info: 'div.ux-seller-section, div.x-sellercard-atf__info',
  }
  const selSlrPage_loc = 'section.str-about-description__seller-info > span:first-of-type > span.str-text-span.BOLD';

  //Inserts location info element into page
  function insertLocInfo(target, location) {
    //var data = JSON.parse(JSON.parse(info.responseText));
    if (target) {
      console.log("Inserting seller location...");
      var loc = document.createElement("div");
      loc.classList.add("userscript-insert", "seller-location", "location-" + location);
      loc.innerText = 'Location: ' + location.replace("HongKong", "Hong Kong");
      target.insertAdjacentElement('afterend', loc);
    }
  }

  // Creates counter container and returns counter span
  function createCounter() {
      var container = document.createElement("div");
      document.querySelector('html > body').insertAdjacentElement('afterend', container);
      const title = document.createTextNode("Seller locations:");
      container.appendChild(title);
      const br = document.createElement("br");
      container.appendChild(br);
      const counter = document.createElement("span");
      container.appendChild(counter);
      container.setAttribute ("style", counterStyle);
      return counter;
  }

  // Return document from URL (.URL attribute is wrong, but the DOM content is right)
  async function getUrlDocument(url) {
    return await fetch(url, { headers: reqhead })
      .then(response => response.text())
      .then(html => {
        var parser  = new DOMParser ();
        var redoc   = parser.parseFromString(html, "text/html");
        return redoc;
    })
      .catch(error => {
      throw new Error("Error: Failure to fetch page.");
    });
  }

  // Return location string for item doc
  async function getDocLoc(itemDoc) {
    if (await itemDoc !== undefined) {
      // Seek location on /itm/ page
      var locElem = await itemDoc.querySelector(selItmPage.loc);
      if (await locElem !== null) {
        console.log("Location found on item page.")
        // Return location string if found on /itm/ page
        return locElem.innerText;
      } else {
        console.log("Location not found on item page, checking seller info page...")
        // Get seller's user link
        var slrLnk = await itemDoc.querySelector(selItmPage.usrlnk);
        if (await slrLnk !== null) {
          console.log("Seller info URL: " + slrLnk.href + '&_tab=about')
          // Get doc from user info URL
          var infoDoc = await getUrlDocument(slrLnk.href + '&_tab=about');
          console.log(infoDoc);
          // Return location string
          if (await infoDoc !== null) {
            return await infoDoc.querySelector(selSlrPage_loc).innerText;
          } else {
            throw new Error("Failure in loading page.");
          }
        } else {
          throw new Error("Couldn't find location.")
        }
      }
    } else {
      throw new Error("Couldn't find location.")
    }
  }

  // Get doc from /itm/ URL
  async function getUrlLoc(itmUrl) {
    var doc = await getUrlDocument(itmUrl);
    return getDocLoc(doc);
  }

  async function searchResults () {
    //Saves all item links to array
    const srcResults = await document.querySelectorAll(selSrchRes.entry);
    const resNum = await srcResults.length;
    const nameList = [];
    const locaList = [];
    var counter = createCounter();
    var errCount = 0;
    counter.innerText = "0/" + resNum  + "(Err: 0)";
    var i = 0;
    for (const [index, result] of srcResults.entries()) {
      if (result) {
        try{
          let name = result.querySelector(selSrchRes.name).innerText.split(" ")[0];
          let nameIndex = nameList.indexOf(name);
          let sellInfo = result.querySelector(selSrchRes.info);
          if ( nameIndex <= 0 ) {
            nameList[i] = name;
            let itemLink = result.querySelector(selSrchRes.link);
            console.log("Checking search result for seller location: " + itemLink.href)
            let itmDoc = await getUrlDocument(itemLink.href);
            locaList[i] = await getDocLoc(itmDoc);
            console.log("Inserting location " + locaList[i])
            await insertLocInfo(sellInfo, locaList[i]);
            i++;
          } else {
            console.log("Item's seller " + name + " already known. Inserting location " + locaList[nameIndex]);
            await insertLocInfo(sellInfo, locaList[nameIndex]);
          }
        } catch(e) {
          console.log(e);
          errCount++;
        }
        counter.innerText = ( index + 1 ) + "/" + resNum + " (Err: " + errCount + ")";
      }
    }
  }

  //Search results:
  if (document.URL.includes("/sch/")) {
    searchResults();
  //Item pages
  } else if (document.URL.includes("/itm/")) {
    //Selects element with username
    var infoSection = document.querySelector(selItmPage.info);
    insertLocInfo(infoSection, await getDocLoc(document));
  }

})();