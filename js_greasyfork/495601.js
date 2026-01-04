// ==UserScript==
// @name         Expand-Gpt
// @namespace    https://github.com/neokyuubi/expand-chatgpt
// @version      0.1.3
// @description  Expand the width of the page
// @author       Neokyuubi
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/495601/Expand-Gpt.user.js
// @updateURL https://update.greasyfork.org/scripts/495601/Expand-Gpt.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to update max-width of elements
    function updateMaxWidth() {
        document.querySelectorAll('[class*="xl:max-w-[48rem]"], [class*="lg:max-w-[40rem]"]').forEach(el => el.style.maxWidth = '100%');
        document.querySelectorAll('[class*="max-w-[90%]"]').forEach(el => el.style.width = '100%');
        document.querySelectorAll('[class*="max-w-[70%]"]').forEach(el => {
            el.style.maxWidth = '97%';
            el.style.border = '2px dashed';
        });
    }

    // Initial update
    updateMaxWidth();

    // Create a MutationObserver to watch for added nodes
    const observer = new MutationObserver((mutationsList) => {
        let needsUpdate = false;
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) { // Ensure it's an element node
                        if (node.matches('[class*="xl:max-w-[48rem]"], [class*="max-w-[90%]"], [class*="max-w-[70%]"], [class*="lg:max-w-[40rem]') || 
                            node.querySelector('[class*="xl:max-w-[48rem]"], [class*="max-w-[90%]"], [class*="max-w-[70%]"], [class*="lg:max-w-[40rem]')) {
                            needsUpdate = true;
                            break;
                        }
                    }
                }
            }
            if (needsUpdate) break;
        }
        if (needsUpdate) updateMaxWidth();
    });

    // Start observing the document body for added nodes
    observer.observe(document.body, { childList: true, subtree: true });

})();
