// ==UserScript==
// @name         Automatically invoke Twitter night dark mode
// @namespace    TwitterNightMode
// @version      0.2
// @description  Invokes the twitter night/dark mode layout automatically when this script is installed and active.
// @author       codingjoe
// @match        *.twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372041/Automatically%20invoke%20Twitter%20night%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/372041/Automatically%20invoke%20Twitter%20night%20dark%20mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // find html element that invokes night mode
    var nightModeToggle = document.querySelector(".nightmode-toggle");

    // if the night mode icon is showing not activated
    if (nightModeToggle.querySelector(".Icon--crescentFilled") === null) {
        // click the night mode toggle to activate it
        nightModeToggle.click();
    }
})();