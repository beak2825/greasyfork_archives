// ==UserScript==
// @name        OutLook Reader: Element Remove
// @namespace   https://github.com/mefengl
// @match       https://outlook.live.com/mail/*
// @grant       GM_registerMenuCommand
// @version     1.1
// @author      mefengl
// @description A script to remove specific elements on Outlook.com
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/500479/OutLook%20Reader%3A%20Element%20Remove.user.js
// @updateURL https://update.greasyfork.org/scripts/500479/OutLook%20Reader%3A%20Element%20Remove.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove elements
    function removeElements() {
        // header
        document.querySelector("div[tabindex='-1']")?.remove();
        // toolbar
        document.querySelector("[aria-label='Ribbon']")?.remove();
        // sidebar
        document.querySelector("#LeftRail")?.remove();
    }

    // Register menu command
    GM_registerMenuCommand('Remove Elements', removeElements);
})();