// ==UserScript==
// @name         Buyee Package Information Image Inserter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds product images to the package information shipping tab for mercari and yahoo auctions
// @author       NO_ob
// @match        https://buyee.jp/mybaggages/shipped/1*
// @icon         https://www.google.com/s2/favicons?domain=buyee.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436547/Buyee%20Package%20Information%20Image%20Inserter.user.js
// @updateURL https://update.greasyfork.org/scripts/436547/Buyee%20Package%20Information%20Image%20Inserter.meta.js
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
      addImage(orderContainer);
    })
  }
}


function addImage(orderContainer) {
  let url = orderContainer.querySelector("table.luggageInfo_order tbody tr:nth-child(2) td:nth-child(3) a").href;
  fetch(url)
    .then(function(response) {
      return response.text()
    })
    .then(function(html) {
      let div = document.createElement("div");
      div.innerHTML = html;
      let imagehref = "";
      if (url.includes("mercari")) {
        imagehref = div.querySelector("div.imageContainer__main img").getAttribute("data-lazy");
      } else if (url.includes("yahoo")) {
        imagehref = div.querySelector("ul.slides li a").href;
      }

      if (imagehref != "") {
        let newImg = document.createElement("img");
        newImg.setAttribute("src", imagehref);
        newImg.setAttribute("style", "width:50%;");

        let header = orderContainer.querySelector("div.luggageInfo_header");
        header.insertBefore(newImg, header.firstChild);
      }
    })
    .catch(function(err) {
      console.log('Failed to fetch page: ', err);
    });
}