// ==UserScript==
// @name         Buyee Package Information Image Inserter
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Adds product images to the package information shipping tab for mercari and yahoo auctions. Midokuni update: Works for Storage and Paypay Flea Market and Consolidations
// @author       Midokuni
// @match        https://buyee.jp/mybaggages/*
// @icon         https://www.google.com/s2/favicons?domain=buyee.jp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491935/Buyee%20Package%20Information%20Image%20Inserter.user.js
// @updateURL https://update.greasyfork.org/scripts/491935/Buyee%20Package%20Information%20Image%20Inserter.meta.js
// ==/UserScript==
var firstRun = 1;
var currentURL = window.location;
(function() {
  'use strict';
  (new MutationObserver(pageObserve)).observe(document, {
    childList: true,
    subtree: true
  });
})();

// observe for page to actually load, fuck webapps
function pageObserve(changes, observer) {
  if (currentURL != window.location) {
    currentURL = window.location;
    firstRun = 1;
  }
  if (firstRun == 1 && document.querySelectorAll("ul#luggageInfo_collection li.luggageInfo")) {
    firstRun = 0;
    document.querySelectorAll("ul#luggageInfo_collection li.luggageInfo").forEach(orderContainer => {
      addImages(orderContainer);
    })
  }
}

function addImage(container) {
  let url = container.querySelector("td:nth-child(3) a").href;
  fetch(url)
    .then(function(response) {
      return response.text()
    })
    .then(function(html) {
      let div = document.createElement("div");
      div.innerHTML = html;
      let imagehref = "";
      if (url.includes("mercari")) {
        imagehref = div.querySelector("div.mercari__imageContainer img").getAttribute("data-src");
      } else if (url.includes("yahoo") || url.includes("paypayfleamarket")) {
        imagehref = div.querySelector("ul.slides li a").href;
      }

      if (imagehref != "") {
        let newImg = document.createElement("img");
        newImg.setAttribute("src", imagehref);
        newImg.setAttribute("style", "max-height: 20vh; max-width: 100%");

        let header = container.querySelector("td:nth-child(3)");
		  
        header.appendChild(document.createElement("br"));
        header.appendChild(newImg);
      }
    })
    .catch(function(err) {
      console.log('Failed to fetch page: ', err);
    });
}

function addImages(orderContainer) {
  const containers = orderContainer.querySelectorAll("table.luggageInfo_order tbody tr:nth-child(n+2)");
  for (const container of containers) {
    addImage(container);
  }
}