// ==UserScript==
// @name         探索者视角MOD (for linux.do)
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Preview links by hovering and pressing 'F' or long press, and adds preview buttons on Discourse forums like linux.do
// @author       Your Name (Modified)
// @match        https://linux.do/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520545/%E6%8E%A2%E7%B4%A2%E8%80%85%E8%A7%86%E8%A7%92MOD%20%28for%20linuxdo%29.user.js
// @updateURL https://update.greasyfork.org/scripts/520545/%E6%8E%A2%E7%B4%A2%E8%80%85%E8%A7%86%E8%A7%92MOD%20%28for%20linuxdo%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Iframe Setup ---
    const iframeContainer = document.createElement('div');
    iframeContainer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; display: none; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.7); z-index: 9999;';
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'width: 80vw; height: 80vh; border: none; background: white; box-shadow: 0 5px 15px rgba(0,0,0,0.3); border-radius: 5px;';
    iframeContainer.appendChild(iframe);
    document.body.appendChild(iframeContainer);

    // --- Hover/Keypress/Longpress Logic (Unchanged from original) ---
    let currentHoveredLink = null;
    let keyDown = false;
    let longPressTimer = null;
    const longPressDuration = 500; // ms

    document.addEventListener('keydown', function(event) {
        if (event.key === 'F' || event.key === 'f') {
            keyDown = true;
            if (currentHoveredLink) {
                iframe.src = currentHoveredLink.href;
                iframeContainer.style.display = 'flex';
            }
        }
    });

    document.addEventListener('keyup', function(event) {
        if (event.key === 'F' || event.key === 'f') {
            keyDown = false;
            // Optional: Close iframe when F is released and mouse is not over a link anymore?
            // if (!currentHoveredLink) {
            //     iframeContainer.style.display = 'none';
            //     iframe.src = 'about:blank';
            // }
        }
    });

    document.body.addEventListener('mousedown', function(event) {
        if (event.button === 0) { // Left mouse button
            const aTag = event.target.closest('a[href]');
            // Exclude javascript links and buttons/elements that might contain links but aren't primary content links
            if (!aTag || aTag.href.startsWith('javascript:') || aTag.closest('.btn, .avatar, .badge-wrapper')) return;

            clearTimeout(longPressTimer); // Clear any previous timer
            longPressTimer = setTimeout(() => {
                console.log('Long press detected on:', aTag.href);
                iframe.src = aTag.href;
                iframeContainer.style.display = 'flex';
                longPressTimer = null; // Reset timer flag
            }, longPressDuration);
        }
    });

    document.body.addEventListener('mouseup', function(event) {
        if (event.button === 0) { // Left mouse button
             clearTimeout(longPressTimer);
        }
    });

    // Prevent context menu on long press if preview opened
    document.body.addEventListener('contextmenu', function(event) {
        if (longPressTimer === null && iframeContainer.style.display === 'flex') {
           // If timer is null, it means it fired and opened the iframe
           // Check if the click originated from a link that could have triggered it
           const aTag = event.target.closest('a[href]');
            if (aTag && !aTag.href.startsWith('javascript:') && !aTag.closest('.btn, .avatar, .badge-wrapper')) {
               event.preventDefault();
           }
        }
        clearTimeout(longPressTimer); // Always clear timer on context menu
    });


    document.body.addEventListener('mouseover', function(event) {
        const aTag = event.target.closest('a[href]');
        // Exclude javascript links and buttons/elements that might contain links
         if (!aTag || aTag.href.startsWith('javascript:') || aTag.closest('.btn, .avatar, .badge-wrapper')) {
            currentHoveredLink = null; // Clear if not a valid link
            return;
        }

        currentHoveredLink = aTag;
        if (keyDown) {
            iframe.src = currentHoveredLink.href;
            iframeContainer.style.display = 'flex';
        }
    }, { passive: true });

    document.body.addEventListener('mouseout', function(event) {
        const relatedTargetIsLink = event.relatedTarget && event.relatedTarget.closest('a[href]');
        // Only clear if mouse moves out of the link *entirely*
        if (event.target.closest('a[href]') && !relatedTargetIsLink) {
             currentHoveredLink = null;
             // Optional: Close iframe if F key is up and mouse moves out?
             // if (!keyDown) {
             //    iframeContainer.style.display = 'none';
             //    iframe.src = 'about:blank';
             // }
        }
    });

    iframeContainer.addEventListener('click', function(event) {
        if (event.target === iframeContainer) { // Click on background closes it
            iframeContainer.style.display = 'none';
            iframe.src = 'about:blank'; // Stop loading/clear content
        }
    });

    // --- Preview Button Logic (MODIFIED) ---
    function addPreviewButtons() {
        // More specific selector for Discourse topic list items (usually <tr>)
        // Check common structures for the topic list table body
        const topicListBody = document.querySelector('.topic-list tbody, .latest-topic-list tbody');
        if (!topicListBody) return; // Don't proceed if the list body isn't found

        const posts = topicListBody.querySelectorAll('tr.topic-list-item');

        posts.forEach(post => {
            // Check if button already exists using a data attribute for robustness
            if (post.dataset.previewButtonAdded === 'true') {
                return;
            }

            // Find the link - common selectors for Discourse topic titles
            const link = post.querySelector('td.main-link a.title, a.topic-link, .topic-list-data a.title, a.raw-topic-link');
            if (!link || link.href.startsWith('javascript:')) {
                // console.warn('Preview Button: Could not find a valid link in:', post);
                return; // Skip if no valid link found in this row
            }

            // Find the cell containing the link to append the button to
            // Try td.main-link first, then the first available td as a fallback
            const targetCell = post.querySelector('td.main-link, .topic-list-data'); // Adjust if needed based on actual structure

            if (!targetCell) {
                 console.warn('Preview Button: Could not find target cell for link:', link.href);
                 return; // Skip if we can't find where to put the button
            }


            const button = document.createElement('button');
            button.innerHTML = '&#128269;'; // Magnifying glass emoji for preview
            //button.innerHTML = '预览'; // Magnifying glass emoji for preview
            button.title = '预览帖子 (Preview Post)'; // Tooltip
            button.className = 'btn btn-default topicpreview-btn'; // Use Discourse's button classes if possible
            // Add custom styling - adjust as needed
            button.style.cssText = `
                margin-left: 8px;
                padding: 2px 6px;
                font-size: 12px;
                line-height: 1.2;
                vertical-align: middle; /* Align with text */
                background-color: #e9e9e9;
                color: #555;
                border: 1px solid #ccc;
                border-radius: 4px;
                cursor: pointer;
                flex-shrink: 0; /* Prevent shrinking if cell is tight */
            `;

             button.addEventListener('mouseover', () => { button.style.backgroundColor = '#d0d0d0'; });
             button.addEventListener('mouseout', () => { button.style.backgroundColor = '#e9e9e9'; });


            // Button click event
            button.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent default link navigation if button is inside <a> somehow
                event.stopPropagation(); // Prevent triggering other clicks on the row/cell
                iframe.src = link.href;
                iframeContainer.style.display = 'flex';
            });

            // Append the button within the target cell
            // We append it to the cell itself, often after the main title span/link
           // targetCell.appendChild(button);
            link.insertAdjacentElement('afterend', button);

            // Mark the row as processed to prevent adding duplicate buttons
            post.dataset.previewButtonAdded = 'true';

        });
    }

    // --- Mutation Observer Setup (MODIFIED) ---

    // Function to initialize or re-initialize the observer
    function observeTopicList() {
        // Target a more stable parent, like the main content area or the specific topic list container
        // #main-outlet is common in Discourse
        // '.topic-list-container' or '.latest-topic-list' might also exist
        const targetNode = document.querySelector('#main-outlet .topic-list, #main-outlet .latest-topic-list');

        if (targetNode) {
            // console.log('Observer: Found target node:', targetNode);
            addPreviewButtons(); // Initial run for content already present

            const observer = new MutationObserver((mutationsList) => {
                // Check if new topic list items (<tr>) were added
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        let addedNodes = Array.from(mutation.addedNodes);
                        // Check if any added node is a topic item or contains one
                        if (addedNodes.some(node => node.nodeType === 1 && (node.matches('tr.topic-list-item') || node.querySelector('tr.topic-list-item')))) {
                           // console.log('Observer: Detected new topic items, running addPreviewButtons.');
                           addPreviewButtons(); // Re-run when new items are potentially added
                           break; // No need to check other mutations if we found relevant changes
                        }
                    }
                }
            });

            // Observe the target node for added/removed children (e.g., topic rows)
            // Observing subtree might be needed if rows are added deeply nested
            observer.observe(targetNode, { childList: true, subtree: true });
             console.log('Observer: Attached to', targetNode);

        } else {
            // If the target isn't found immediately, retry after a short delay
            // This handles cases where the list itself is loaded asynchronously
            // console.log('Observer: Target node not found yet, retrying...');
            setTimeout(observeTopicList, 500); // Retry after 500ms
        }
    }

    // Start the process
    // Use DOMContentLoaded or window.onload if needed, but often direct call + observer retry works
    observeTopicList();

})();