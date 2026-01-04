// ==UserScript==
// @name         Canoe Logo Replace
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Replaces Canoe Logos and Menu Items with Apliqo ones for Tool Demo
// @author       F. Zahner
// @match        https://client.canoesoftware.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=canoesoftware.com
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/480847/Canoe%20Logo%20Replace.user.js
// @updateURL https://update.greasyfork.org/scripts/480847/Canoe%20Logo%20Replace.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Insert logo hide css
    (document.head || document.documentElement).insertAdjacentHTML('beforeend',
    '<style>.logo { display: none; }</style>');

    document.title = "Apliqo";

    // Wait for document load
    window.addEventListener('load', function() {
        // Select logo and replace src, then display it again
        var elem = document.querySelectorAll(".logo,.login-panel-title")[0];
        elem.firstChild.src = "https://supplyfocus.cubewise.com/assets/uploads/images/partners/_800xAUTO_fit_center-center_none/Apliqo.png";
        elem.style.setProperty("display", "block");

        // Change all favicons
        document.querySelector('head').querySelectorAll('link[rel=icon]').forEach(e => e.href = 'https://cloud.apliqo.ch:80/PG_demo/apq-c3-custom/images/apliqo_33.png');

        // Login screen
        if(window.location.href.includes('/auth/login')) {
           // Change background login image
           document.querySelector('.login-page').style.setProperty('background', '#030303 url(https://cloud.apliqo.ch:80/PG_demo/apq-c3-custom/images/loginPageBackground.jpg)');
           document.querySelector('.login-page').style.setProperty('background-size', 'cover');
        }

        // Management Panel
        if (window.location.href.includes('/frontend/dataintelligence')) {
            // Remove Canoe Connect Box
            var box = document.querySelector('.category-container').querySelectorAll('.data-intelligence-link')[3];
            document.querySelector('.category-container').removeChild(box);

            // Remove Canoe Connect Dropdown Item
            var dropdownContainer = document.querySelector('.rf-dropdown-content');
            var child;
            var query = dropdownContainer.querySelectorAll('.rf-dropdown-item');
            var nodes = [...query];
            // Find dropdown item which includes Canoe Connect in the span
            nodes.forEach(e => {
                if (e.querySelector('span').innerHTML.includes('Canoe Connect')) {
                    child = e;
                }
            });
            dropdownContainer.removeChild(child);
        }
    }, false);

})();