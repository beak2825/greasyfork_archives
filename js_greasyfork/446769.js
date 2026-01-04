// ==UserScript==
// @name         Add success percentage
// @namespace    https://r13k.com/
// @version      1.0
// @description  Add success percentages to problems on CSES
// @author       Rohit Kharsan
// @match        https://cses.fi/problemset/list/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446769/Add%20success%20percentage.user.js
// @updateURL https://update.greasyfork.org/scripts/446769/Add%20success%20percentage.meta.js
// ==/UserScript==

(function() {
    'use strict';

    for (let c of document.querySelectorAll(".detail")) {
        c.innerHTML += ` | ${Math.floor(eval(c.innerHTML) * 10000) / 100}%`;
    }
})();