// ==UserScript==
// @name         Binance Maximize Layout
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Maximize Binance layout to full screen width
// @author       Nobakab
// @match        https://www.binance.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389744/Binance%20Maximize%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/389744/Binance%20Maximize%20Layout.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle('.foWCZq {max-width: 1500px !important;}');
    addGlobalStyle('.fwAynw {min-height: 500px !important;}');
})();