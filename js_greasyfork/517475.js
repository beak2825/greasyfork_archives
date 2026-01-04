// ==UserScript==
// @name         Block "Zwróć kwotę" Button
// @version      1.0
// @description  Blokuje kliknięcie na przycisku "Zwróć kwotę"
// @author       Dawid
// @match        https://premiumtechpanel.sellasist.pl/admin/returns/*
// @grant        none
// @license      Proprietary
// @namespace https://greasyfork.org/users/1396754
// @downloadURL https://update.greasyfork.org/scripts/517475/Block%20%22Zwr%C3%B3%C4%87%20kwot%C4%99%22%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/517475/Block%20%22Zwr%C3%B3%C4%87%20kwot%C4%99%22%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const button = document.querySelector('.c-button.c-button--small.blue.unbind.return_price');
    if (button) {
        button.style.pointerEvents = 'none';
        button.style.opacity = '0.5';
        button.style.cursor = 'not-allowed';
    }
})();