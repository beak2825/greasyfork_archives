// ==UserScript==
// @name         GenerateWP - Unlock Unallowed Modules
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace "section-unallowed" with "section-allowed" on GenerateWP pages.
// @author       sharmanhall
// @match        https://generatewp.com/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=generatewp.com
// @downloadURL https://update.greasyfork.org/scripts/489836/GenerateWP%20-%20Unlock%20Unallowed%20Modules.user.js
// @updateURL https://update.greasyfork.org/scripts/489836/GenerateWP%20-%20Unlock%20Unallowed%20Modules.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const replaceClassName = () => {
        document.querySelectorAll('.section-unallowed').forEach((element) => {
            element.className = element.className.replace('section-unallowed', 'section-allowed');
        });
    };

    // Replace class names once upon initial load
    replaceClassName();

    // Observer for AJAX or dynamically loaded content
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) replaceClassName();
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();