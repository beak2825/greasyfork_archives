// ==UserScript==
// @name         CBA - přesměrování do správné URL
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Nahradí "squadSheets" pojmem "gameReport", odebere "&isToMatch=1" a "&isToMatch=0" z URL
// @author       Lukáš Malec
// @match        https://www.cbaleague.com/data/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513400/CBA%20-%20p%C5%99esm%C4%9Brov%C3%A1n%C3%AD%20do%20spr%C3%A1vn%C3%A9%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/513400/CBA%20-%20p%C5%99esm%C4%9Brov%C3%A1n%C3%AD%20do%20spr%C3%A1vn%C3%A9%20URL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get current URL
    let currentUrl = window.location.href;

    // Replace "squadSheets" with "gameReport"
    let newUrl = currentUrl.replace("squadSheets", "gameReport");

    // Remove "&isToMatch=1" and "&isToMatch=0" from the URL
    newUrl = newUrl.replace("&isToMatch=1", "").replace("&isToMatch=0", "");

    // Redirect to the new URL if it has been modified
    if (newUrl !== currentUrl) {
        window.location.href = newUrl;
    }
})();