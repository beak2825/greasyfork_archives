// ==UserScript==
// @name         OpenNET Unfold Comments
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Автоматически разворачивает свернутые комментарии на opennet.ru
// @author       You
// @match        https://www.opennet.ru/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527083/OpenNET%20Unfold%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/527083/OpenNET%20Unfold%20Comments.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function unfoldComments() {
        // Find all "show" links (old and new styles)
        const showLinks = document.querySelectorAll('a[onclick*="do_show_thread"], a[onclick*="open_comments"]');

        showLinks.forEach(link => {
            // Extract necessary parameters from onclick attribute.
            const onclickAttr = link.getAttribute('onclick');

            // Use a single regular expression with named capture groups for clarity and efficiency.
            const match = onclickAttr.match(/(?:open_comments|do_show_thread0?)\((?<om>\d+)(?:,(?<omm_level>\d+)(?:,(?<depth>\d+))?)?\)/);

            if (match && match.groups) {
                const { om, omm_level, depth } = match.groups;

                // Convert to numbers only if they exist.
                const omNum = parseInt(om, 10);
                const omm_levelNum = omm_level ? parseInt(omm_level, 10) : undefined;
                const depthNum = depth ? parseInt(depth, 10) : undefined;

                // Call the appropriate function based on the extracted parameters.
                if (onclickAttr.includes('open_comments')) {
                    if (omNum !== undefined && omm_levelNum !== undefined && depthNum !== undefined) {
                        open_comments(omNum, omm_levelNum, depthNum);
                    }
                } else if (onclickAttr.includes('do_show_thread0')) {
                    if (omNum !== undefined && omm_levelNum !== undefined && depthNum !== undefined) {
                       do_show_thread0(omNum, omm_levelNum, depthNum);
                    }
                } else if (onclickAttr.includes('do_show_thread')) {
                    if (omNum !== undefined && omm_levelNum !== undefined) {
                        do_show_thread(omNum, omm_levelNum);
                    }
                }
            }
        });
    }

    function delayedUnfold() {
         // Debounce the function calls.
        if (typeof delayedUnfold.timeoutId === 'number') {
            clearTimeout(delayedUnfold.timeoutId);
        }

        delayedUnfold.timeoutId = setTimeout(() => {
                unfoldComments();
            }, 250);  // Adjust delay as needed. 250ms is a good starting point.
    }



    // Run the function initially when the document is idle.
    unfoldComments();

    // Use MutationObserver to handle dynamic content loading.
    const observer = new MutationObserver(mutations => {
        // Check if relevant nodes were added.  Target the specific elements
        // that contain comments, rather than the entire body. This drastically
        // improves performance.
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE && (node.matches('.comtree') || node.querySelector('.comtree'))) {
                        //comtree is the div class that wraps all the comments.
                        delayedUnfold();
                        return; // Exit after the first relevant mutation is found.
                    }
                }
            }
        }
    });

    // Start observing the part of the document that might contain the comments.
    // Observing the body is too broad and causes significant performance issues.
    const commentContainer = document.querySelector('.comtree'); //find the comment tree ONCE.
    if (commentContainer) {
        observer.observe(commentContainer, { childList: true, subtree: true });
    } else {
        //fallback to the body element if .comtree isn't available YET, but only search there if it exists
        //we're going to assume .comtree will be added if the body is still loading.
        observer.observe(document.body, { childList: true, subtree: true});
    }
})();