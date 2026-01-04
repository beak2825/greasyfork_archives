// ==UserScript==
// @name         Binance Always Advanced
// @version      0.2.1
// @description  Redirect Binance basic trade to advanced trade
// @author       thinking
// @match        *://*.binance.com/*
// @match        *://binance.com/*
// @run-at       document-start
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/38232/Binance%20Always%20Advanced.user.js
// @updateURL https://update.greasyfork.org/scripts/38232/Binance%20Always%20Advanced.meta.js
// ==/UserScript==

var pathname = window.location.pathname;

if (pathname ==="/trade.html") {
    url = window.location.href;
    url = url.replace("/trade.html", "/tradeDetail.html");
    window.location.replace(url);
}