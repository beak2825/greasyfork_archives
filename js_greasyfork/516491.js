// ==UserScript==
// @name         center relaylinx
// @namespace    relaylinx
// @version      2024-11-09
// @description  居中Relaylinx的Logo
// @author       SilmonFish
// @match        *://app.relaylinx.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516491/center%20relaylinx.user.js
// @updateURL https://update.greasyfork.org/scripts/516491/center%20relaylinx.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function checkObj() {
        let t = setInterval(function () {
            let h2s = document.getElementsByTagName("h2");
            for (var i = 0; i < h2s.length; i++) {
                if (h2s[i].innerHTML == "Relaylinx") {
                    h2s[i].style.marginLeft = 0;
                    clearInterval(t);
                    break;
                }
            }
        }, 500);
    }
    checkObj()
})();