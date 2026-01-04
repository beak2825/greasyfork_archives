// ==UserScript==
// @name         Squabbles.io Normalize Buttons
// @namespace  https://github.com/waaamb/userscripts
// @version      0.1.2
// @description  Normalizes "circular" buttons into actual circles.
// @author       Waaamb
// @match        *://*.squabbles.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=squabbles.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468602/Squabblesio%20Normalize%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/468602/Squabblesio%20Normalize%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* Settings */
    /* These are settings variables to enable features.
    /* Keep in mind they'll be erased if the script is updated.              */

    const navbarButtonsSize = '2.5em';

    /* Currently the navbar buttons are all slightly different shapes
    /* and sizes. This function normalizes them all into circles.
    /*
    /* If buttons are added in other locations this function will have
    /* to be refactored.                                                     */

    function normalizeButtons () {
        // Select the "circular" navbar buttons.
        const navbarButtonsSelector = '.navbar .container > div:last-of-type .rounded-circle';

        let navbarButtons = document.querySelectorAll(navbarButtonsSelector);

        // ...and modify their style to be round and centered
        for (let button of navbarButtons) {
            button.style.display = 'flex';
            button.style.width = navbarButtonsSize;
            button.style.height = navbarButtonsSize;
            button.style.padding = '0';
            let buttonIcon = button.querySelector('i');
            if (buttonIcon) { buttonIcon.style.margin = 'auto'; }
        }
    }

    // Borrowed from /u/smile-eh
    const observeDOM = (fn, e = document.documentElement, config = { attributes: 1, childList: 1, subtree: 1 }) => {
        const observer = new MutationObserver(fn);
        observer.observe(e, config);
        return () => observer.disconnect();
    };

    observeDOM(normalizeButtons);
})();