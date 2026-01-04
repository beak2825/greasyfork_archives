// ==UserScript==
// @name         StackOverflow auto expand comments
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Automatically expands all StackOverflow comments
// @author       red9350
// @match        https://stackoverflow.com/questions/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374844/StackOverflow%20auto%20expand%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/374844/StackOverflow%20auto%20expand%20comments.meta.js
// ==/UserScript==

//https://stackoverflow.com/questions/*/*
(function() {
    "use strict";

    window.onload = function() {
        // Show all comments links when logged out:
        let expandLinks = document.querySelectorAll('.js-show-link.comments-link');
        for (var i = 0; i < expandLinks.length; i++)
        {
            expandLinks[i].click();
        }

        // Show all comments links when logged in:
        expandLinks = document.querySelectorAll('.js-show-more-button');
        for (var i = 0; i < expandLinks.length; i++)
        {
            expandLinks[i].click();
        }

    };
})();