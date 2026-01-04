// ==UserScript==
// @name         lanza.me bypass
// @namespace    https://greasyfork.org/users/980489
// @version      1.0
// @description  bypass lanza.me shortlink
// @author       Rust1667
// @match        https://lanza.me/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484487/lanzame%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/484487/lanzame%20bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract the link from the specified selector
    function getRedirectLink() {
        var button = document.querySelector('#botonGo');
        if (button) {
            return button.getAttribute('href');
        }
        return null;
    }

    // Function to redirect the page
    function redirectPage() {
        var redirectLink = getRedirectLink();
        if (redirectLink) {
            window.location.href = redirectLink;
        }
    }

    // Check if the page matches the specified pattern
    if (window.location.href.startsWith('https://lanza.me/')) {
        // Redirect the page when it's fully loaded
        window.addEventListener('load', redirectPage);
    }
})();
