// ==UserScript==
// @name          Scrolller Camsite Remover
// @namespace    https://greasyfork.org
// @version      0.1.1
// @description  Removes Camsite links
// @author       spoogloogly
// @match        *://scrolller.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scrolller.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447617/Scrolller%20Camsite%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/447617/Scrolller%20Camsite%20Remover.meta.js
// ==/UserScript==

(new MutationObserver(check)).observe(document, {childList: true, subtree: true});

function check(changes, observer) {
    if(document.querySelector('.page-wrapper')) {
          var linkList = document.querySelectorAll ("a");
          Array.prototype.forEach.call (linkList, function (link) {
              if (link.hostname.includes("cams.scrolller.com")) {
                  //-- Block the link
                  link.style = "display: none;";
              }
          });
    }
}

