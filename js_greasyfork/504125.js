// ==UserScript==
// @name         Wolfplay Explore Keybind
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  This script lets you start a battle or take other actions while exploring with the space bar or enter key.
// @author       DasGurkenglas
// @match        https://wolfplaygame.com/explore.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wolfplaygame.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504125/Wolfplay%20Explore%20Keybind.user.js
// @updateURL https://update.greasyfork.org/scripts/504125/Wolfplay%20Explore%20Keybind.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("keypress", keyHandler, true);
    function keyHandler(event) {
        var arrows = document.querySelectorAll("div.arrows table tbody tr td");

        if (event.key != " " && event.key != "Enter") {
            return
        }
        event.preventDefault();

        if (document.querySelector(`a[href^='battleground.php']`) != null) {
            document.querySelector(`a[href^='battleground.php']`).click();
        } else if (document.querySelector(`.feedback a.exlporebutton`) != null) {
            document.querySelector(`.feedback a.exlporebutton`).click();
        }
    }
})();