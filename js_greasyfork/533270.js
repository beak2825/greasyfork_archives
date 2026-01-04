// ==UserScript==
// @name         8chan Toggle All Media per Post
// @namespace    sneed
// @version      1.5
// @description  Adds a [+]/[-] button to expand/collapse all media in a single post on 8chan.moe/se.
// @author       Gemini 2.5
// @license      MIT
// @match        https://8chan.moe/*/res/*.html*
// @match        https://8chan.se/*/res/*.html*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/533270/8chan%20Toggle%20All%20Media%20per%20Post.user.js
// @updateURL https://update.greasyfork.org/scripts/533270/8chan%20Toggle%20All%20Media%20per%20Post.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const EXPAND_TEXT = '[+]';
    const COLLAPSE_TEXT = '[-]';
    const BUTTON_CLASS = 'toggle-all-media-btn'; // Class for the button

    /**
     * Cleans up extra visible a.hideLink elements in a media cell after collapse.
     * @param {HTMLElement} uploadCell - The figure.uploadCell element.
     */
    function cleanupExtraHideLinks(uploadCell) {
        // We only expect one *functional* hide link per audio/video player when expanded.
        // When collapsed, there should ideally be zero *visible* hide links.
        // This function targets cells that are NOT expanded and might have leftover links.
        if (uploadCell.classList.contains('expandedCell')) {
            return; // Only clean up collapsed cells
        }

        const hideLinks = uploadCell.querySelectorAll('a.hideLink');

        if (hideLinks.length > 1) {
             // console.log(`Cleanup: Found ${hideLinks.length} hide links in a non-expanded cell. Hiding extras.`);
             // Keep the first one potentially, or just hide all visible extras
             // Let's hide all except the first one found, as the first one might be the "correct" one if any interaction happened.
             for (let i = 1; i < hideLinks.length; i++) {
                 hideLinks[i].style.display = 'none';
             }
             // Even the first one shouldn't be visible if the cell isn't expanded, based on normal behavior.
             // Let's ensure all hide links are hidden if the cell is not expanded.
             hideLinks.forEach(link => link.style.display = 'none');
        } else if (hideLinks.length === 1) {
             // If there's exactly one hide link, ensure it's hidden if the cell is not expanded
             hideLinks[0].style.display = 'none';
        }
        // If length is 0 or 1 (and handled above), nothing more needed.
    }


    /**
     * Adds a toggle button to expand/collapse all media in a post if it has multiple uploads.
     * @param {HTMLElement} postElement - The post element (.postCell or .opCell).
     */
    function addExpandToggleButton(postElement) {
        const panelUploads = postElement.querySelector('.panelUploads');

        if (!panelUploads || postElement.querySelector(`.${BUTTON_CLASS}`)) {
            return;
        }

        const uploadCells = panelUploads.querySelectorAll('.uploadCell');
        if (uploadCells.length <= 1) {
            return;
        }

        const button = document.createElement('span');
        button.textContent = EXPAND_TEXT;
        button.title = 'Toggle expand/collapse all media in this post';
        button.classList.add(BUTTON_CLASS);
        button.dataset.state = 'collapsed'; // Initial state assumes things start collapsed

        // button.style.display = 'block';
        button.style.marginBottom = '5px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '0.9em';
        button.style.fontWeight = 'bold';
        button.style.color = 'var(--link-color, blue)';
        button.style.userSelect = 'none';

        button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();

            const currentPost = event.target.closest('.postCell, .opCell');
            if (!currentPost) return;

            const currentPanelUploads = currentPost.querySelector('.panelUploads');
            if (!currentPanelUploads) return;

            const mediaItems = currentPanelUploads.querySelectorAll('.uploadCell');
            const currentState = button.dataset.state;

            if (currentState === 'collapsed') {
                // --- Action: Expand currently collapsed items ---
                mediaItems.forEach(cell => {
                    // Find items that are NOT expanded
                    if (!cell.classList.contains('expandedCell')) {
                         const link = cell.querySelector('a.imgLink');
                         if (link) {
                             // console.log('Expanding:', link.href);
                             link.click(); // Click the main link to trigger expansion
                         }
                    }
                });
                // Update state AFTER action
                button.dataset.state = 'expanded';
                button.textContent = COLLAPSE_TEXT;

            } else { // currentState === 'expanded'
                // --- Action: Collapse currently expanded items ---
                mediaItems.forEach(cell => {
                    // Find items that ARE expanded
                    if (cell.classList.contains('expandedCell')) {
                        // For expanded audio/video, the collapse button is a.hideLink
                        const hideLink = cell.querySelector('a.hideLink');
                        if (hideLink) {
                            // console.log('Collapsing (via hideLink):', cell.querySelector('a.imgLink')?.href);
                            hideLink.click(); // Click the hide link
                        } else {
                            // For expanded images, the collapse action is clicking a.imgLink again
                            const mainLink = cell.querySelector('a.imgLink');
                             if (mainLink) {
                                 // console.log('Collapsing (via imgLink):', mainLink.href);
                                 mainLink.click();
                            }
                        }
                    }
                });

                // Update state AFTER action
                button.dataset.state = 'collapsed';
                button.textContent = EXPAND_TEXT;

                // --- Cleanup: Hide any extra, visible hide links after collapse ---
                // Add a small delay to allow the native script's collapse animation/DOM changes to finish
                // before cleaning up.
                 setTimeout(() => {
                     mediaItems.forEach(cell => {
                          cleanupExtraHideLinks(cell);
                     });
                 }, 50); // 50ms delay should be sufficient
            }
        });

        const firstUploadCell = panelUploads.querySelector('.uploadCell');
        if (firstUploadCell) {
            panelUploads.insertBefore(button, firstUploadCell);
        } else {
             panelUploads.appendChild(button);
        }
    }

    /**
     * Observes the main post container for newly added posts and adds buttons to them.
     */
    function observeNewPosts() {
        const targetNode = document.querySelector('#divThreads .divPosts');
        if (!targetNode) {
            console.warn('Toggle All Media: Could not find target node for MutationObserver.');
            return;
        }

        const config = { childList: true };

        const callback = function(mutationsList, observer) {
            for(const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.matches('.postCell, .opCell')) {
                                addExpandToggleButton(node);
                            } else {
                                // Check for posts potentially nested within the added node (e.g. in a wrapper)
                                node.querySelectorAll('.postCell, .opCell').forEach(addExpandToggleButton);
                            }
                        }
                    });
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }

    // --- Main Execution ---
    document.querySelectorAll('.postCell, .opCell').forEach(addExpandToggleButton);
    requestAnimationFrame(observeNewPosts);

})();