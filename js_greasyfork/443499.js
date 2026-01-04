// ==UserScript==
// @name         BWPM
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  Bilibili Web Personalized Modification
// @author       Yakabito
// @license      MIT
// @run-at       document-idle
// @match        https://www.live.bilibili.com/
// @match        *://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443499/BWPM.user.js
// @updateURL https://update.greasyfork.org/scripts/443499/BWPM.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var elementCollection;
  function loop(delay) {
    console.log("[BWPM] loop");
    var timeout = setTimeout(() => {
      elementCollection = [
        ...window.document.getElementsByClassName("live-haruna-ctnr"),
      ];
      if (elementCollection.length) {
        for (const ele of elementCollection) {
          ele.style.opacity = 0;
        }
        clearTimeout(timeout);
      } else {
        loop(delay);
      }
    }, delay);
  }
  loop(1000);
})();
