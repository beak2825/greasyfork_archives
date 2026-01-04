// ==UserScript==
// @name         Cookie Clicker Infinite Cookies
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Gives you infinite cookies nonstop
// @author       Emree.el on ig
// @match        https://orteil.dashnet.org/cookieclicker/*
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/545332/Cookie%20Clicker%20Infinite%20Cookies.user.js
// @updateURL https://update.greasyfork.org/scripts/545332/Cookie%20Clicker%20Infinite%20Cookies.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Run every 50ms (adjust if you want faster/slower)
    setInterval(function(){
        try {
            Game.cookies = Infinity;
        } catch (e) {
            // Wait until Game loads
        }
    }, 50);

})();
