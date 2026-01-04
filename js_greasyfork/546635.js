// ==UserScript==
// @name         Robux prank 😂🤣
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Funny prank: shows huge fake Robux on roblox.com 🤣😅
// @author       Amrinder
// @match        https://www.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546635/Robux%20prank%20%F0%9F%98%82%F0%9F%A4%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/546635/Robux%20prank%20%F0%9F%98%82%F0%9F%A4%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function updateRobux() {
        const robux = document.getElementById("nav-robux-amount");
        const balance = document.getElementById("nav-robux-balance");

        if (robux) robux.textContent = "1000000000000000T+";
        if (balance) balance.textContent = "1000000000000000T Robux";
    }

    // Run once when page loads
    updateRobux();

    // Run every 2 seconds to refresh
    setInterval(updateRobux, 2000);
})();