// ==UserScript==
// @name         bilibili no +1 please
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  hide bilibili live +1
// @author       Kuro1
// @match        https://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482675/bilibili%20no%20%2B1%20please.user.js
// @updateURL https://update.greasyfork.org/scripts/482675/bilibili%20no%20%2B1%20please.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function pageLoaded() {
        const checkInterval = 1000;
        setInterval(checkComboCard, checkInterval);
    }


    function checkComboCard() {
        const comboCard = document.getElementById('combo-card');
        if (comboCard) {
            console.log('Combo Card element found:', comboCard);
            comboCard.style.display = 'none';
        }
    }

    window.addEventListener('load', pageLoaded);
})();