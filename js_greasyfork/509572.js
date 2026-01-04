// ==UserScript==
// @name        FreshRSS Open in Background Tab
// @namespace   https://github.com/hiroki-miya
// @version     1.0.0
// @description Open the selected link in a new background tab
// @author      hiroki-miya
// @license     MIT
// @match       https://freshrss.example.net
// @grant       GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/509572/FreshRSS%20Open%20in%20Background%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/509572/FreshRSS%20Open%20in%20Background%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Shortcut key setting(Default: ";")
    const shortcutKey = ';';

    // Function to execute when the shortcut key is pressed
    function handleShortcut(event) {
        if (event.key === shortcutKey) {
            const activeLink = document.querySelector('.current .item.titleAuthorSummaryDate a[href^="http"]');
            if (activeLink) {
                GM_openInTab(activeLink.href);
            }
        }
    }

    // Add event listener for the shortcut key
    document.addEventListener('keydown', handleShortcut);
})();
