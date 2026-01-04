// ==UserScript==
// @name         Overseer - Hide Requested Items
// @namespace    http://tampermonkey.net/
// @version      2024-12-18
// @description  Current "Fix" to https://github.com/sct/overseerr/issues/3681
// @author       You
// @match        https://yourdomain.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521121/Overseer%20-%20Hide%20Requested%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/521121/Overseer%20-%20Hide%20Requested%20Items.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide specific list items
    const hideListItems = () => {
        document.querySelectorAll('li').forEach(li => {
            const parentDiv = li.querySelector('div.absolute.inset-0.h-full.w-full.overflow-hidden');
            if (parentDiv) {
                const targetDiv = parentDiv.querySelector('div.absolute.left-0.right-0.flex.items-center.justify-between.p-2');
                if (targetDiv) {
                    const additionalDiv = targetDiv.querySelector('div.pointer-events-none.z-40.flex.items-center');
                    if (additionalDiv) {
                        li.style.display = 'none';
                    }
                }
            }
        });
    };

    // Function to always show a specific button div
    const showButtonDiv = () => {
        document.querySelectorAll('div.absolute.bottom-0.left-0.right-0.flex.justify-between.px-2.py-2').forEach(buttonDiv => {
            buttonDiv.style.display = ''; // Removes any previous inline style that hides the element
        });
    };

    // Initial invocation
    hideListItems();
    showButtonDiv();

    // Observe for any added nodes to apply changes dynamically
    const observer = new MutationObserver(() => {
        hideListItems();
        showButtonDiv();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();