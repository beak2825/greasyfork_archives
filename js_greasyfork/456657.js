// ==UserScript==
// @name         TradingView title fixer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Stops the title changes on the Chrome browser tab on TradingView.
// @author       You
// @match        https://www.tradingview.com/chart/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tradingview.com
// @grant        none
// @run-at       document-idle
// @noframes
// @license mit
// @downloadURL https://update.greasyfork.org/scripts/456657/TradingView%20title%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/456657/TradingView%20title%20fixer.meta.js
// ==/UserScript==

try {
    window.originalTitle = document.title; // save for future
    Object.defineProperty(document, 'title', {
        get: function() {return originalTitle},
        set: function() {}
    });
} catch (e) {}
