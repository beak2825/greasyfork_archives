// ==UserScript==
// @name         GitHub Public Badge Remover
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Remove Public badge in GutHub
// @author       eggplants
// @homepage     https://github.com/eggplants
// @match        https://*.github.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/432118/GitHub%20Public%20Badge%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/432118/GitHub%20Public%20Badge%20Remover.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function () {
    "use strict";
    const tick = () => {
        console.log("tick");
        let cnt = 0;
        document.querySelectorAll(
          `span.Label.Label--secondary.v-align-middle`
        ).forEach((e) => {
          if (e.innerText === "Public") {
            e.style = "display: none !important";
            cnt++;
          }
        });
        if(cnt<1){
            timer.remove();
        }
    };
    const timer = setInterval(tick, 100);
})();