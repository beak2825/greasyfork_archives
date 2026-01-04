// ==UserScript==
// @name         GitHub PR review keyboard shortcut
// @version      0.3
// @description  Mark file as "viewed" on GitHub PR UI when hovering and pressing 'Escape' key
// @match        https://github.com/*
// @author       dvdvdmt, nbolton
// @source       https://github.com/nbolton/github-review-shortcut
// @namespace    https://github.com/nbolton/github-review-shortcut
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543958/GitHub%20PR%20review%20keyboard%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/543958/GitHub%20PR%20review%20keyboard%20shortcut.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.disposeMarkAsViewedByEscape) {
        window.disposeMarkAsViewedByEscape();
    }

    window.disposeMarkAsViewedByEscape = start();

    function start() {
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown);
    }

    function markFileAsViewed() {
        console.debug("Marking file as viewed");

        const fileElement = document.querySelector(`div[role="region"][id^="diff-"]:hover`);
        if (!fileElement){
            console.warn("No file element under cursor");
            return;
        }

        console.debug("File element found:", fileElement);
        console.debug("Finding buttons")
        const buttons = [...fileElement.querySelectorAll('button')];
        if (buttons.length === 0) {
            console.warn("No buttons found in file element");
            return;
        }

        console.debug("Buttons found:", buttons);

        const checkboxes = buttons.filter(btn => btn.textContent.trim() === 'Viewed');
        console.debug("Checkboxes found:", checkboxes);
        if (checkboxes.length > 1) {
            // Usually happens when the wrong DOM element is selected earlier on.
            throw new Error("More than one checkbox found");
        }
        else if (checkboxes.length === 0) {
            throw new Error("No checkbox found");
        }

        const checkbox = checkboxes[0];
        console.debug("Clicking checkbox:", checkbox);
        checkbox.click();
    }

    function handleKeyDown() {
        if (event.key === 'Escape') {
            markFileAsViewed();
        }
    }

})();