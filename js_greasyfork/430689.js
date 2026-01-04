// ==UserScript==
// @name        Guru Spider
// @namespace   Violentmonkey Scripts
// @description This is a spider.
// @match       https://www.commercialguru.com.sg/find-commercial-properties/property-for-sale*
// @match       https://www.commercialguru.com.sg/find-commercial-properties/property-for-rent*
// @match       https://www.commercialguru.com.sg/listing/*
// @match       https://www.commercialguru.com.sg/project/*
// @match       https://www.commercialguru.com.sg/property-for-rent/*
// @match       https://www.commercialguru.com.sg/agent/*
// @match       https://www.propertyguru.com.sg/agent/*
// @version     0.0.27
// @author      fangang
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/ui@0.7
// @require     https://unpkg.com/jquery@3/dist/jquery.min.js
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/430689/Guru%20Spider.user.js
// @updateURL https://update.greasyfork.org/scripts/430689/Guru%20Spider.meta.js
// ==/UserScript==

(function () {
'use strict';

var css_248z = "body{--bg-opacity:1;background-color:#edf2f7;background-color:rgba(237,242,247,var(--bg-opacity))}";

var styles = {"panel":"style-module_panel__J9HLb","spiderui":"style-module_spiderui__1Z3Gg"};
var stylesheet=".style-module_panel__J9HLb{position:fixed;--bg-opacity:1;background-color:#fff;background-color:rgba(255,255,255,var(--bg-opacity));--text-opacity:1;color:#2d3748;color:rgba(45,55,72,var(--text-opacity));z-index:10;border-radius:.25rem;border-width:1px;--border-opacity:1;border-color:#cbd5e0;border-color:rgba(203,213,224,var(--border-opacity));padding:1rem;top:80px;right:80px}.style-module_spiderui__1Z3Gg{position:fixed;bottom:0;background:#f0eaf4;padding-top:15px;padding-bottom:15px;z-index:9999;width:100%;font-size:14px;font-style:normal;font-weight:400;line-height:22px}";

// global CSS
function spiderui() {
  return VM.createElement(VM.Fragment, null, VM.createElement("style", null, css_248z), VM.createElement("style", null, stylesheet), VM.createElement("div", {
    id: "spiderui",
    className: styles.spiderui
  }, VM.createElement("div", {
    class: "container"
  }, VM.createElement("div", {
    class: "row"
  }, VM.createElement("div", {
    class: "col-md-8"
  }, VM.createElement("div", {
    id: "message"
  }, "sdfsdfsd"), VM.createElement("div", {
    id: "message2"
  }, "Click [Request AgentCea] get agent cea ")), VM.createElement("div", {
    class: "col-md-2"
  }, VM.createElement("div", {
    class: ""
  }, VM.createElement("button", {
    id: "btnStart",
    class: "btn btn-primary"
  }, "Start Request Data"))), VM.createElement("div", {
    class: "col-md-2"
  }, VM.createElement("div", {
    class: ""
  }, VM.createElement("button", {
    id: "btnAgent",
    class: "btn btn-primary"
  }, "Request AgentCea")))))));
}

var removeCookieUi = removeCookieUi => {
  VM.observe(document.body, function () {
    let $cookieNode = $('.accept-cookies');
    if ($cookieNode.length > 0) {
      $cookieNode.remove();
      return true;
    }
  });
};

const httpUrl = 'http://collectdata-api.propnex.net';
//export const httpUrl = 'https://localhost:44398';

const getHost = function () {
  if (window.location.origin === 'https://www.commercialguru.com.sg') {
    return 'https://www.commercialguru.com.sg/find-commercial-properties';
  }
  return "https://www.propertyguru.com.sg";
};
const hdb_estates = [{
  "id": 1,
  "txt": "Ang Mo Kio"
}, {
  "id": 2,
  "txt": "Bedok"
}, {
  "id": 3,
  "txt": "Bishan"
}, {
  "id": 4,
  "txt": "Bukit Batok"
}, {
  "id": 5,
  "txt": "Bukit Merah"
}, {
  "id": 6,
  "txt": "Bukit Panjang"
}, {
  "id": 7,
  "txt": "Bukit Timah"
}, {
  "id": 8,
  "txt": "Central Area"
}, {
  "id": 9,
  "txt": "Choa Chu Kang"
}, {
  "id": 10,
  "txt": "Clementi"
}, {
  "id": 11,
  "txt": "Geylang"
}, {
  "id": 12,
  "txt": "Hougang"
}, {
  "id": 13,
  "txt": "Jurong East"
}, {
  "id": 14,
  "txt": "Jurong West"
}, {
  "id": 15,
  "txt": "Kallang/Whampoa"
}, {
  "id": 16,
  "txt": "Lim Chu Kang"
}, {
  "id": 17,
  "txt": "Marine Parade"
}, {
  "id": 18,
  "txt": "Pasir Ris"
}, {
  "id": 19,
  "txt": "Punggol"
}, {
  "id": 20,
  "txt": "Queenstown"
}, {
  "id": 21,
  "txt": "Sembawang"
}, {
  "id": 22,
  "txt": "Sengkang"
}, {
  "id": 23,
  "txt": "Serangoon"
}, {
  "id": 24,
  "txt": "Tampines"
}, {
  "id": 25,
  "txt": "Toa Payoh"
}, {
  "id": 26,
  "txt": "Woodlands"
}, {
  "id": 27,
  "txt": "Yishun"
}];
const _districts = [{
  id: "D01",
  text: "D01 Boat Quay / Raffles Place / Marina"
}, {
  id: "D02",
  text: "D02 Chinatown / Tanjong Pagar"
}, {
  id: "D03",
  text: "D03 Alexandra / Commonwealth"
}, {
  id: "D04",
  text: "Harbourfront / Telok Blangah"
}, {
  id: "D05",
  text: "D05 Buona Vista / West Coast / Clementi New Town"
}, {
  id: "D06",
  text: "D06 City Hall / Clarke Quay"
}, {
  id: "D07",
  text: "D07 Beach Road / Bugis / Rochor"
}, {
  id: "D08",
  text: "D08 Farrer Park / Serangoon Rd"
}, {
  id: "D09",
  text: "D09 Orchard / River Valley"
}, {
  id: "D10",
  text: "D10 Tanglin / Holland / Bukit Timah"
}, {
  id: "D11",
  text: "D11 Newton / Novena"
}, {
  id: "D12",
  text: "D12 Balestier / Toa Payoh"
}, {
  id: "D13",
  text: "D13 Macpherson / Potong Pasir"
}, {
  id: "D14",
  text: "D14 Eunos / Geylang / Paya Lebar"
}, {
  id: "D15",
  text: "D15 East Coast / Marine Parade"
}, {
  id: "D16",
  text: "D16 Bedok / Upper East Coast"
}, {
  id: "D17",
  text: "D17 Changi Airport / Changi Village"
}, {
  id: "D18",
  text: "D18 Pasir Ris / Tampines"
}, {
  id: "D19",
  text: "D19 Hougang / Punggol / Sengkang"
}, {
  id: "D20",
  text: "D20 Ang Mo Kio / Bishan / Thomson"
}, {
  id: "D21",
  text: "D21 Clementi Park / Upper Bukit Timah"
}, {
  id: "D22",
  text: "D22 Boon Lay / Jurong / Tuas"
}, {
  id: "D23",
  text: "D23 Dairy Farm / Bukit Panjang / Choa Chu Kang"
}, {
  id: "D24",
  text: "D24 Lim Chu Kang / Tengah"
}, {
  id: "D25",
  text: "D25 Admiralty / Woodlands"
}, {
  id: "D26",
  text: "D26 Mandai / Upper Thomson"
}, {
  id: "D27",
  text: "D27 Sembawang / Yishun"
}, {
  id: "D28",
  text: "D28 Seletar / Yio Chu Kang"
}];
const property_type_code = ['1R', '2A', '2I', '2S', '3A', '3NG', '3Am', '3NGm', '3I', '3Im', '3S', '3STD', '3PA', '4A', '4NG', '4PA', '4S', '4I', '4STD', '5A', '5I', '5PA', '5S', '6J', 'EA', 'EM', 'MG', 'TE'];
const landed_tenure = ['F', 'L103', 'L999', 'NA', 'L9999', 'L110', 'L99'];
const getHdbtUrl = function (page, listing_type, hdb_estate, freetext) {
  if (window.location.host.indexOf('commercialguru') > -1) {
    return `/${page}?market=commercial&district_code[0]=${hdb_estate}&listing_type=${getListingType()}&freetext=${freetext}&order=desc&search=true&sort=date&[object%20Object]&ajax=true`;
  }
  return `/${page}?market=residential&sort=date&order=desc&listing_type=${getListingType()}&freetext=${freetext}&hdb_estate[]=${hdb_estate}&search=true&[object%20Object]&ajax=true`;
};
const getDistrictUrl = function (page, listing_type, district, freetext) {
  if (window.location.host.indexOf('commercialguru') > -1) {
    return `/${page}?market=commercial&order=desc&sort=date&district_code[0]=${district}&listing_type=${getListingType()}&freetext=${freetext}&order=desc&search=true&sort=date&[object%20Object]&ajax=true`;
  }
  //district_code%5B0%5D=D01&freetext=D01+Boat+Quay+%2F+Raffles+Place+%2F+Marina&search=true&ajax=true
  return `/${page}?market=residential&district_code%5B0%5D=${district}&freetext=${freetext}&order=desc&search=true&sort=date&[object%20Object]&ajax=true`;
};
const getPropertyTypeUrl = function (page, listing_type, property_type_code) {
  return `/${page}?property_type=H&property_type_code%5B0%5D=${property_type_code}&search=true&[object%20Object]&ajax=true`;
};
const getLandedTenureUrl = function (page, listing_type, tenure) {
  return `/${page}?property_type=L&property_type_code%5B0%5D=BUNG&property_type_code%5B1%5D=CON&property_type_code%5B2%5D=CORN&property_type_code%5B3%5D=DETAC&property_type_code%5B4%5D=LBUNG&property_type_code%5B5%5D=LCLUS&property_type_code%5B6%5D=RLAND&property_type_code%5B7%5D=SEMI&property_type_code%5B8%5D=SHOPH&property_type_code%5B9%5D=TERRA&property_type_code%5B10%5D=TOWN&search=true&tenure%5B0%5D=${tenure}&ajax=true`;
};
const getListingType = function () {
  if (window.location.pathname.indexOf('property-for-sale') > -1) {
    return 'sale';
  } else {
    return 'rent';
  }
};

var agentEvent = agentEvent => {
  VM.observe(document.body, function () {
    $("#btnAgent").on("click", getAgents);
    return true;
  });
};
async function getAgents() {
  var {
    response
  } = await getAgent();
  var {
    agent,
    count
  } = response;
  $("#message2").text(`have ${count} use get cea`);
  if (count == 0) {
    return;
  }
  GM_setValue("agent", agent);
  unsafeWindow.location.href = "https://www.propertyguru.com.sg/agent/" + agent.number + "?scarp=true";
}
function getAgent() {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      url: `${httpUrl}/api/Agents?host=${window.location.host}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      responseType: "json",
      onload: function (res) {
        if (res.status === 200 || res.status === 201) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      onerror: function (err) {
        reject(err);
      }
    });
  });
}

var listings = listings => {
  VM.observe(document.body, async function () {
    let $node = $(".listing-pagination");
    if ($node.length > 0) {
      document.body.append(VM.m(spiderui()));
      const totalPage = $(".pagination").children().eq(-2).children().eq(0).attr("data-page");
      $("#message").text(`Find ${totalPage} Pages,click button start request`);
      $("#btnStart").on("click", async function () {
        await start();
      });
      return true;
    }
  });
};
function getPages() {
  let $node = $(".listing-pagination");
  if ($node.length > 0) {
    return $(".pagination").children().eq(-2).children().eq(0).attr("data-page");
  }
  return 0;
}
async function start() {
  await getDistrict();
  if (window.location.host.indexOf("commercialguru") == -1) {
    await getHdb();
    await getPropertyType();
    await getLandedTenure();
  }
}
async function getHdb() {
  for (let i = 0; i < hdb_estates.length; i++) {
    let item = hdb_estates[i];
    let totalPage = 1;
    let currentPage = 0;
    while (currentPage < totalPage) {
      currentPage++;
      const queryParameters = getHdbtUrl(currentPage, "sale", item.id, item.txt);
      const response = await request(queryParameters);
      $("#message").text(`Find ${totalPage} Pages,CurrentPage ${currentPage},hdb_estates(${hdb_estates.length}) name ${item.txt},${item.id}`);
      if (response.status === 200) {
        let html = await response.text();
        const $searchResultsContainer = $("#search-results-container > .search-result-inner-container");
        $searchResultsContainer[0].innerHTML = html;
        $searchResultsContainer.find("script").each(function (index, script) {
          $.globalEval(script.innerHTML);
        });
        if (totalPage == 1) {
          totalPage = getPages();
        }
        try {
          await requestListAgent();
          await requestProductDatas();
          await requestPageHtml(currentPage, totalPage, html, item.txt);
        } catch (e) {
          console.log(e);
        }
      } else {
        alert(response.status);
        if (response.status === 403) {
          currentPage = currentPage - 1;
          continue;
        }
      }
    }
  }
}
async function getDistrict() {
  for (let i = 0; i < _districts.length; i++) {
    let item = _districts[i];
    let totalPage = 1;
    let currentPage = 0;
    while (currentPage < totalPage) {
      currentPage++;
      const queryParameters = getDistrictUrl(currentPage, "sale", item.id, item.text);
      const response = await request(queryParameters);
      $("#message").text(`Find ${totalPage} Pages,CurrentPage ${currentPage}, district(${_districts.length}) name ${item.text},${item.id}`);
      if (response.status === 200) {
        let html = await response.text();
        const $searchResultsContainer = $("#search-results-container > .search-result-inner-container");
        $searchResultsContainer[0].innerHTML = html;
        $searchResultsContainer.find("script").each(function (index, script) {
          $.globalEval(script.innerHTML);
        });
        //console.log(ajaxGuruApp.listingResultsWidget.gaECListings);
        if (totalPage == 1) {
          totalPage = getPages();
        }
        try {
          await requestListAgent();
          await requestProductDatas();
          await requestPageHtml(currentPage, totalPage, html, item.id);
        } catch (e) {
          console.log(e);
        }
      } else {
        alert(response.status);
        if (response.status === 403) {
          currentPage = currentPage - 1;
          continue;
        }
      }
    }
  }
}
async function getPropertyType() {
  for (let i = 0; i < property_type_code.length; i++) {
    let totalPage = 1;
    let currentPage = 0;
    while (currentPage < totalPage) {
      currentPage++;
      const queryParameters = getPropertyTypeUrl(currentPage, "sale", property_type_code[i]);
      const response = await request(queryParameters);
      $("#message").text(`Find ${totalPage} Pages,CurrentPage ${currentPage}, district(${property_type_code.length}) name ${property_type_code[i]}`);
      if (response.status === 200) {
        let html = await response.text();
        const $searchResultsContainer = $("#search-results-container > .search-result-inner-container");
        $searchResultsContainer[0].innerHTML = html;
        $searchResultsContainer.find("script").each(function (index, script) {
          $.globalEval(script.innerHTML);
        });
        // console.log(ajaxGuruApp.listingResultsWidget.gaECListings);
        if (totalPage == 1) {
          totalPage = getPages();
        }
        try {
          await requestListAgent();
          await requestProductDatas();
          await requestPageHtml(currentPage, totalPage, html, "", property_type_code[i]);
        } catch (e) {
          console.log(e);
        }
      } else {
        alert(response.status);
        if (response.status === 403) {
          currentPage = currentPage - 1;
          continue;
        }
      }
    }
  }
}
async function getLandedTenure() {
  for (let i = 0; i < landed_tenure.length; i++) {
    let item = landed_tenure[i];
    let totalPage = 1;
    let currentPage = 0;
    while (currentPage < totalPage) {
      currentPage++;
      const queryParameters = getLandedTenureUrl(currentPage, "sale", item);
      const response = await request(queryParameters);
      $("#message").text(`Find ${totalPage} Pages,CurrentPage ${currentPage},getLandedTenure(${landed_tenure.length}) name ${item},${i}`);
      if (response.status === 200) {
        let html = await response.text();
        const $searchResultsContainer = $("#search-results-container > .search-result-inner-container");
        $searchResultsContainer[0].innerHTML = html;
        $searchResultsContainer.find("script").each(function (index, script) {
          $.globalEval(script.innerHTML);
        });
        if (totalPage == 1) {
          totalPage = getPages();
        }
        try {
          await requestListAgent();
          await requestProductDatas();
          await requestPageHtml(currentPage, totalPage, html, "", "", item);
        } catch (e) {
          console.log(e);
        }
      } else {
        alert(response.status);
        if (response.status === 403) {
          currentPage = currentPage - 1;
          continue;
        }
      }
    }
  }
}
async function request(queryParameters) {
  let url = getHost();
  if (window.location.pathname.indexOf("property-for-sale") > -1) {
    url += "/property-for-sale";
  } else {
    url += "/property-for-rent";
  }
  return await fetch(url + queryParameters, {
    headers: {
      accept: "*/*",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-ajax-search": true,
      "x-requested-with": "XMLHttpRequest"
    },
    referrerPolicy: "no-referrer-when-downgrade",
    body: null,
    method: "GET",
    mode: "cors",
    credentials: "include"
  });
}
async function requestPageHtml(page, totalPage, text, locationId, pcode, tenure = "") {
  return await new Promise((reslove, reject) => {
    if (pcode === undefined) {
      pcode = "";
    }
    var postData = JSON.stringify({
      id: 0,
      page: page,
      totalPage: totalPage,
      isAnalysis: false,
      location: locationId,
      pcode: pcode,
      spiderData: "2021-07-29T06:53:15.176Z",
      host: window.location.host,
      listingType: getListingType(),
      html: text,
      tenure: tenure
    });
    GM_xmlhttpRequest({
      url: `${httpUrl}/api/PageHtmls`,
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      responseType: "json",
      data: postData,
      onload: function (res) {
        reslove(res);
      },
      onerror: function (err) {
        reject(new Error("request error"));
      }
    });
  });
}
async function requestProductDatas() {
  var list = [];
  ajaxGuruApp.listingResultsWidget.gaECListings.forEach(item => {
    list.push({
      ...item.productData,
      id: item.productData.id.toString(),
      bathrooms: item.bathrooms == null ? 0 : item.bathrooms,
      bedrooms: item.bedrooms == null ? 0 : item.bedrooms
    });
  });
  return await new Promise((reslove, reject) => {
    GM_xmlhttpRequest({
      url: `${httpUrl}/api/PageHtmls/PostProductDatas`,
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      responseType: "json",
      data: JSON.stringify(list),
      onload: function (res) {
        if (res.status == 200 || res.status == 201) {
          reslove(res);
        } else {
          reject(new Error());
        }
      },
      onerror: function (err) {
        reject(err);
      }
    });
  });
}
async function requestListAgent() {
  var list = [];
  ajaxGuruApp.listingResultsWidget.listings.forEach(item => {
    list.push({
      id: item.id,
      listingId: item.id,
      agentId: item.agent.id,
      mobile: item.agent.mobile == null ? '' : item.agent.mobile,
      name: item.agent.name == null ? '' : item.agent.name,
      mobilePretty: item.agent.mobilePretty == null ? '' : item.agent.mobilePretty
    });
  });
  return await new Promise((reslove, reject) => {
    GM_xmlhttpRequest({
      url: `${httpUrl}/api/PageHtmls/PostListAgents`,
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      responseType: "json",
      data: JSON.stringify(list),
      onload: function (res) {
        if (res.status == 200 || res.status == 201) {
          reslove(res);
        } else {
          reject(new Error());
        }
      },
      onerror: function (err) {
        reject(err);
      }
    });
  });
}

var listing = listing => {
  GM_registerMenuCommand("Null Agents and Start", async function () {
    GM_setValue("agent", null);
    GM_setValue("startAgent", 1);
    await getAgents();
  });
  GM_registerMenuCommand("Null Agents", async function () {
    GM_setValue("agent", null);
  });
  VM.observe(document.body, async function () {
    if ((unsafeWindow.location.href.indexOf("https://www.propertyguru.com.sg/agent/") > -1 || unsafeWindow.location.href.indexOf("https://www.commercialguru.com.sg/agent/") > -1) && unsafeWindow.location.href.indexOf("agent") > -1) {
      if (GM_getValue("startAgent") !== 1) {
        return;
      }
      let agent = GM_getValue("agent");
      if (agent == null) {
        await getAgents();
      }
      agent.cea = getCea();
      if (agent.cea !== "") {
        if ($("[class='actionable-link contact-button-root']").length > 0) {
          agent.phone = $("[class='actionable-link contact-button-root']")[0].attr("href").replace("tel:", "");
        }
        GM_xmlhttpRequest({
          url: `${httpUrl}/api/Agents/${agent.id}`,
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          responseType: "json",
          data: JSON.stringify(agent),
          onload: function (res) {
            getAgents();
          },
          onerror: function (err) {
            getAgents();
          }
        });
      } else {
        getAgents();
      }
    }
  });
  function getCea() {
    const ceaNode = $("div.trait[da-id='agent-cea-no']");
    const regNode = $("div.trait[da-id='agent-agency-license-no']");
    if (ceaNode.length > 0 && regNode.length > 0) {
      const cea = ceaNode[0].textContent.replace("CEA Registration No. ", "").trim();
      const reg = regNode[0].textContent.replace("Agency License No. ", "").trim();
      return `${cea} / ${reg}`;
    }
    return "";
  }
};

(function () {

  removeCookieUi();
  listings();
  agentEvent();
  listing();
})();

})();
