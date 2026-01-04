// ==UserScript==
// @name         Fake robux
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Shows fake robux on the roblox
// @author       Sus
// @match        https://www.roblox.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546707/Fake%20robux.user.js
// @updateURL https://update.greasyfork.org/scripts/546707/Fake%20robux.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function robux() {
        let robuxElement = document.getElementById("nav-robux-amount");
        if (robuxElement) {
            robuxElement.textContent = "10K+"; // change this number as you like
        }
    }

    // running
    robux();

    // update
    setInterval(robux, 1);
})();
