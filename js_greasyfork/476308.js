// ==UserScript==
// @name            EPVP - Click All Spoiler Button!
// @namespace       github.com/opemvbs
// @version         1.4
// @description     Clicks on all elements with the class "spoiler-button" or manually closes them via the menu command
// @author          Nawhki
// @match           *://www.elitepvpers.com/*
// @grant           GM_registerMenuCommand
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/476308/EPVP%20-%20Click%20All%20Spoiler%20Button%21.user.js
// @updateURL https://update.greasyfork.org/scripts/476308/EPVP%20-%20Click%20All%20Spoiler%20Button%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickAllSpoilerButtons() {
        const spoilerButtons = document.querySelectorAll('.spoiler-button');
        spoilerButtons.forEach(button => {
            button.click();
        });
    }

    // Register the menu command to manually click all spoiler buttons
    GM_registerMenuCommand('Manually click all spoiler buttons', clickAllSpoilerButtons);

    // Automatically click spoiler buttons on page load
    clickAllSpoilerButtons();
})();
