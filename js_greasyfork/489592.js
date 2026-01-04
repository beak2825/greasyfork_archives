// ==UserScript==
// @name         Powerschool hide teacher names
// @namespace    http://tampermonkey.net/
// @version      2024-03-12
// @description  For if you want to take a screenshot of your grades and don't feel like censoring your teachers names one by one
// @author       PowfuArras
// @match        *://*.powerschool.com/guardian/home.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=powerschool.com
// @grant        none
// @license      GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/489592/Powerschool%20hide%20teacher%20names.user.js
// @updateURL https://update.greasyfork.org/scripts/489592/Powerschool%20hide%20teacher%20names.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let interval = setInterval(function () {
        try {
            const elements = document.querySelectorAll(".table-element-text-align-start");
            for (let i = 0; i < 6; i++) {
                elements.forEach(o => o.removeChild(o.lastChild));
            }
            clearInterval(interval);
        } catch (error) {}
    }, 100)
})();