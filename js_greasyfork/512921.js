// ==UserScript==
// @name         Hide Inoreader Navigation Bar on Click
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.0
// @description  Shrinks and dims Inoreader's top navigation bar. Clicking restores original size. Clicking again shrinks the navigation bar. 
// @author       Rekt
// @match        *://*.inoreader.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512921/Hide%20Inoreader%20Navigation%20Bar%20on%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/512921/Hide%20Inoreader%20Navigation%20Bar%20on%20Click.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const navBar = document.getElementById('subscriptions_buttons');
    let isNavBarExpanded = true; // Track the state of the navigation bar

    if (navBar) {
        const expandNavBar = () => {
            navBar.style.height = 'auto';
            navBar.style.overflow = 'visible';
            navBar.style.opacity = '1';
            isNavBarExpanded = true;
        };

        const minimizeNavBar = () => {
            navBar.style.height = '10px';
            navBar.style.overflow = 'hidden';
            navBar.style.opacity = '0.2';
            isNavBarExpanded = false;
        };

        document.addEventListener('click', (event) => {
            if (!event.target.closest('button, input[type="text"], img, .inno_toolbar_button_menu, .inno_toolbar_button_menu_item')) {
                if (navBar.contains(event.target)) {
                    // Toggle the navigation bar when clicking inside
                    isNavBarExpanded ? minimizeNavBar() : expandNavBar();
                } else {
                    // Automatically minimize if clicking outside the navbar/container
                    minimizeNavBar();
                }
            }
        });

        // Initialize with the navigation bar fully visible
        expandNavBar();
    }

})();