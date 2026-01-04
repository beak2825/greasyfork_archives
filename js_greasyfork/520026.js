// ==UserScript==
// @name         Fix the aside-hidden problem
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Fix the aside-hidden problem of react.dev
// @author       You
// @match        https://*.react.dev/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=react.dev
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520026/Fix%20the%20aside-hidden%20problem.user.js
// @updateURL https://update.greasyfork.org/scripts/520026/Fix%20the%20aside-hidden%20problem.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const aside = document.querySelector("aside");
    if(aside) {
        aside.classList.remove("hidden");
    }
    console.log("Remove successfully!")
    // Your code here...
})();