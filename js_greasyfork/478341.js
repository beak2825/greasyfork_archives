// ==UserScript==
// @name         Cookie Clicker Auto Wrinkler Popper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically pops wrinklers in Cookie Clicker.
// @author       DeDeusBR
// @match        https://orteil.dashnet.org/cookieclicker/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dashnet.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478341/Cookie%20Clicker%20Auto%20Wrinkler%20Popper.user.js
// @updateURL https://update.greasyfork.org/scripts/478341/Cookie%20Clicker%20Auto%20Wrinkler%20Popper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set the interval between checking for and popping wrinklers (in milliseconds).
    const INTERVAL = 300000; // 5 minutes

    // Create a function to pop all wrinklers on the screen.
    const popAllWrinklers = function() {
        Game.CollectWrinklers();
    };

    // Start a repeating timer to check for and pop wrinklers.
    setInterval(popAllWrinklers, INTERVAL);
})();