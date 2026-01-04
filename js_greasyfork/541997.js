// ==UserScript==
// @name         Kasta HUB Tracknum enter
// @namespace    http://tampermonkey.net/
// @version      2025-07-08
// @description  Unlock Tracknum input
// @author       filmodeon
// @match        https://hub.kasta.ua/customer-orders/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kasta.ua
// @grant        none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/541997/Kasta%20HUB%20Tracknum%20enter.user.js
// @updateURL https://update.greasyfork.org/scripts/541997/Kasta%20HUB%20Tracknum%20enter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("Script started work")
    document.addEventListener('keydown', (event) => {
    if (event.key === 't' || event.key === 'T' || event.key === 'е' || event.key === 'Е') {
        console.log("t Press");
        const tracknum = document.querySelector('#tracking_number');
        if (tracknum) {
            tracknum.removeAttribute('disabled');
            tracknum.style.backgroundColor = 'white';
            tracknum.style.color = 'black';
            tracknum.setAttribute('placeHolder', '');
        } else {
            console.error('Элемент с ID tracking_number не найден.');
        }
    }
});
})();