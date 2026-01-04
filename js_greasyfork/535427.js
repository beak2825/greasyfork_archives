// ==UserScript==
// @name         Sticky vote panel
// @namespace    http://tampermonkey.net/
// @version      2025-01-29
// @description  Makes the vote counter on StackOverflow and StackExchange stick to the screen when scrolling.
// @author       Matronator <info@matronator.cz>
// @match        https//*.stackexchange.com/*
// @match        https://stackoverflow.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535427/Sticky%20vote%20panel.user.js
// @updateURL https://update.greasyfork.org/scripts/535427/Sticky%20vote%20panel.meta.js
// ==/UserScript==

(function() {
    const votePanels = document.querySelectorAll(".js-voting-container");
    votePanels.forEach(el => {
        el.style.position = "sticky";
        el.style.top = "80px";
    });
})();