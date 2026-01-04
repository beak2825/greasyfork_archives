// ==UserScript==
// @name         Dlink4/Clictune Bypass
// @match        http*://www.dlink4.com/*
// @grant        none
// @version      1.4.2
// @author       _darkuwu
// @description  Bypasses dlink4 links.

// @namespace https://greasyfork.org/users/246635
// @downloadURL https://update.greasyfork.org/scripts/506466/Dlink4Clictune%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/506466/Dlink4Clictune%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration: Set to false to disable auto-redirect
    const AUTO_REDIRECT = true;

    // Function to dynamically fetch the redirect URL
    function getRedirectUrl() {
        const scriptElements = document.querySelectorAll('script');
        for (let script of scriptElements) {
            if (script.innerHTML.includes('Compteur')) {
                const match = script.innerHTML.match(/<a href="([^"]+)"/);
                if (match && match[1]) {
                    return match[1];
                }
            }
        }
        return '#';
    }

    // Function to override the Compteur function and set seconde to 0
    function overrideCompteur() {
        // Set seconde to 0
        window.seconde = 0;

        // Override the Compteur function
        window.Compteur = function() {
            window.seconde = 0;
            var txt = '';
            var redirectUrl = getRedirectUrl();
            var txt2 = `<a href="${redirectUrl}" class="myButton" style="color: white;text-decoration: none;"><span class="clignoter">ACCÉDER AU LIEN</span></a>`;
            compteur.innerHTML = txt;
            compteur2.innerHTML = txt2;

            // Auto-redirect if enabled
            if (AUTO_REDIRECT) {
                window.location.href = redirectUrl;
            }
        };

        // Call the overridden function immediately
        window.Compteur();
    }

    // Wait until the page is fully loaded
    window.addEventListener('load', function() {
        // Check if jQuery is loaded and then execute the override
        if (typeof jQuery !== 'undefined') {
            jQuery(document).ready(function() {
                overrideCompteur();
            });
        } else {
            // Fallback in case jQuery is not used
            overrideCompteur();
        }
    }, false);

    // Alternatively, set the variable immediately if it's already defined
    if (typeof window.seconde !== 'undefined') {
        overrideCompteur();
    }
})();
