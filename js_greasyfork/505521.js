// ==UserScript==
// @name         YouTube Mobile Search Auto-Click
// @namespace    Violentmonkey Scripts
// @author       Kayleigh
// @version      1.0
// @license      MIT
// @description  Auto-click the search button on YouTube mobile
// @match        https://m.youtube.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505521/YouTube%20Mobile%20Search%20Auto-Click.user.js
// @updateURL https://update.greasyfork.org/scripts/505521/YouTube%20Mobile%20Search%20Auto-Click.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function clickSearchButton() {
        var button = document.querySelector('button[aria-label="Search YouTube"]');
        if (button) {
            button.click();
        } else {
            setTimeout(clickSearchButton, 500); // retry after 500ms if button not found
        }
    }
    setTimeout(clickSearchButton, 800); // wait for page to load before first attempt
})();