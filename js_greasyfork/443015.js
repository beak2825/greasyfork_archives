// ==UserScript==
// @name         John Lewis dynamic favicon supporting dark mode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Dark mode rules, okay!
// @author       Beazley
// @license      GNU GPLv3
// @match        https://*.johnlewis.com/*
// @icon         data:image/svg+xml;utf-8,%3Csvg viewBox='0 0 144 92' xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle%3E:root %7Bfill: %23000;%7D@media (prefers-color-scheme:dark)%7B:root %7Bfill: %23fff;%7D%7D%3C/style%3E%3Crect x='52' width='92' height='92'%3E%3C/rect%3E%3Crect x='33' width='13' height='92'%3E%3C/rect%3E%3Crect x='16' width='8' height='92'%3E%3C/rect%3E%3Crect width='4' height='92'%3E%3C/rect%3E%3C/svg%3E
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443015/John%20Lewis%20dynamic%20favicon%20supporting%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/443015/John%20Lewis%20dynamic%20favicon%20supporting%20dark%20mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const svg = "data:image/svg+xml;utf-8,%3Csvg viewBox='0 0 144 92' xmlns='http://www.w3.org/2000/svg'%3E%3Cstyle%3E:root %7Bfill: %23000;%7D@media (prefers-color-scheme:dark)%7B:root %7Bfill: %23fff;%7D%7D%3C/style%3E%3Crect x='52' width='92' height='92'%3E%3C/rect%3E%3Crect x='33' width='13' height='92'%3E%3C/rect%3E%3Crect x='16' width='8' height='92'%3E%3C/rect%3E%3Crect width='4' height='92'%3E%3C/rect%3E%3C/svg%3E"
    let link = document.querySelectorAll("link[rel~='icon']")

    if (link.length > 0) {
        link.forEach(l => l.href = svg)
    } else {
        link = document.createElement("link")
        link.rel = "shortcut icon"
        link.type = "image/svg+xml"
        link.href = svg
        document.getElementsByTagName("head")[0].appendChild(link)
    }
})();