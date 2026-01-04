// ==UserScript==
// @name         AnkiWeb Logo Link
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Makes AnkiWeb navbar brand a link to the decks page. This behavior is missing since the 2023.08.18 AnkiWeb update.
// @author       ithelor
// @match        https://ankiuser.net/study
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473420/AnkiWeb%20Logo%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/473420/AnkiWeb%20Logo%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    new MutationObserver((mutationsList) => mutationsList.forEach(({ type }) => {
        if (type === "childList") {
            const navbarBrand = document.getElementsByClassName('navbar-brand').item(0);

            if (navbarBrand.tagName === 'A') {
                return;
            }

            // remove [possibly infinite] logo animation
            document.getElementById('logo').className = ""

            const newNavbarBrand = document.createElement("a");
            newNavbarBrand.innerHTML = navbarBrand.innerHTML;
            newNavbarBrand.className = 'navbar-brand';
            newNavbarBrand.setAttribute('href', 'https://ankiweb.net/decks');

            navbarBrand.parentNode.replaceChild(newNavbarBrand, navbarBrand);
        }
    })).observe(document.body, {
        childList: true,
        subtree: true,
    });
})();