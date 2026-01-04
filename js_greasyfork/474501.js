// ==UserScript==
// @name         remove alerts from snyk
// @namespace    http://tampermonkey.net/
// @version      0.4
// @license      MIT
// @description  remove dismissible alerts from snyk dashboard
// @author       kindychung@gmail.com
// @match        https://app.snyk.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=snyk.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474501/remove%20alerts%20from%20snyk.user.js
// @updateURL https://update.greasyfork.org/scripts/474501/remove%20alerts%20from%20snyk.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener("load", function() {
        setInterval(() => {
            const elems = document.querySelectorAll(".alert--dismissible, #org-alerts");
            elems.forEach(elem => {elem.style.display = "none";});
        }, 100);
    });
})();