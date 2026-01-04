// ==UserScript==
// @name        EasyOreno
// @namespace   Violentmonkey Scripts
// @match       https://oreno3d.com/*
// @grant       none
// @license     MIT
// @version     1.0
// @author      -
// @description Make videos on oreno3d link directly to iwara
// @downloadURL https://update.greasyfork.org/scripts/466660/EasyOreno.user.js
// @updateURL https://update.greasyfork.org/scripts/466660/EasyOreno.meta.js
// ==/UserScript==

function swapHref() {
  const mainGrid = document.querySelector("body > div.container > main > div > div.g-main-grid").querySelectorAll("article")
  const domParser = new DOMParser();

  for (var i = 0; i < mainGrid.length; i++){
    childLink = mainGrid[i].querySelector("a").getAttribute("href");

    (function(index) {
      fetch(childLink)
        .then(response => response.text())
        .then(sourceHTML => {
          const HTMLPage = domParser.parseFromString(sourceHTML, "text/html");
          iwaraLink = HTMLPage.querySelector('a[href*="' + "iwara" + '"]').href;

          mainGrid[index].querySelector("a").href = iwaraLink;
        })
        .catch(error => {
          console.error(`Error for URL ${index}:`, error);
        });
    })(i);
  }
}

try{
  swapHref();
} catch(error) {}