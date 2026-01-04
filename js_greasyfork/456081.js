// ==UserScript==
// @name         Remove OZON ads
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes Ozon market ads
// @license      MIT
// @author       litoy.post@ya.ru
// @match        *://www.ozon.ru/category/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ozon.ru
// @grant        none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/456081/Remove%20OZON%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/456081/Remove%20OZON%20ads.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function removeAds() {
        await sleep(3000);
        var els = document.getElementsByTagName("div");
        for(var i=0; i<els.length; ++i) {
            if(els[i].style.backgroundColor == "var(--ozCtrlMarketingPale)") {
                els[i].style.display = 'none'
            }
        }
    }

    removeAds();

})();
