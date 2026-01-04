// ==UserScript==
// @name         Google Bard Dark Mode
// @namespace    https://bard.google.com/
// @version      1.0
// @description  Google Bard dark mode switcher
// @author       Babico
// @match        https://bard.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bard.google.com
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/464773/Google%20Bard%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/464773/Google%20Bard%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.classList.value = "dark-theme";
    document.body.querySelector("header").style.backgroundColor = "var(--bard-color-main-container-background)";
})();