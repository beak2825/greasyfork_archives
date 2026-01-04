// ==UserScript==
// @name         ComicFury Unread Tab Opener-Thingy
// @version      2024-01-29
// @description  Open unread comics in new tab
// @match        https://comicfury.com/comic.php?action=subscriptions&unread=1
// @grant        GM_openInTab
// @license      MIT
// @namespace https://greasyfork.org/users/1449124
// @downloadURL https://update.greasyfork.org/scripts/530580/ComicFury%20Unread%20Tab%20Opener-Thingy.user.js
// @updateURL https://update.greasyfork.org/scripts/530580/ComicFury%20Unread%20Tab%20Opener-Thingy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define a Set to keep track of opened links
    const openedLinks = new Set();

    // Define openWebcomicLinks globally
    window.openWebcomicLinks = function() {
        // Select all <a> elements on the page
        const links = document.querySelectorAll('a');

        // Iterate through each link
        links.forEach(link => {
            if ((link.href.includes("/goto.php?mode=wcsub&amp;wcid=") || link.href.includes("/goto.php?mode=wcsub&wcid=")) &&
                !link.href.includes('&pref=infinite')) {
                // Check if the link has not been opened before
                if (!openedLinks.has(link.href)) {
                    // Add the link to the set
                    openedLinks.add(link.href);
                    // Open the link in a new tab
                    GM_openInTab(link.href);
                }
            }
        });
    };

    // Create the button
    var button = document.createElement('button');
    button.textContent = 'Open All Links In New Tabs';
    button.addEventListener('click', openWebcomicLinks);
    button.style.marginLeft = '25px';

    // Add the button to the top of the page
    var container = document.querySelector('.col0.splitlcol.alternating-col');
    if (container) {
        container.appendChild(button);
    } else {
        console.error('Container element not found.');
    }
})();