// ==UserScript==
// @name         FreeBTC.info
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Automatically reloads the page every 3
// @author       Alen
// @match        https://freebtc.info/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495635/FreeBTCinfo.user.js
// @updateURL https://update.greasyfork.org/scripts/495635/FreeBTCinfo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function reloadPage() {
        location.reload();
    }


    function clickRollButton() {
        setTimeout(function() {
            document.querySelector('button.px-6.py-3.bg-gradient-to-b.from-\\[\\#3399ff\\].hover\\:from-\\[\\#66b3ff\\].to-\\[\\#004d99\\].hover\\:to-\\[\\#0066cc\\].text-white.font-bold.rounded.w-36').click();
        }, 2000);
    }


    setInterval(reloadPage, 60 * 60 * 1000);


    window.addEventListener('load', clickRollButton);
})();