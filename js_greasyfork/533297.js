// ==UserScript==
// @name        8chan Single ID Post Opacity with Thread-Specific Cross-Domain Toggle
// @namespace   https://8chan.moe
// @description Halves opacity of posts with unique labelId (based on background-color) if CHECK_UNIQUE_IDS is true, adds a circle emoji toggle after extraMenuButton to adjust opacity for all posts by ID color in the same thread (including OP), persists toggle state across 8chan.moe and 8chan.se, handles dynamically added posts, forces 100% opacity for posts with expanded images, and sets opacity to 100% on hover
// @match       https://8chan.moe/*/res/*
// @match       https://8chan.se/*/res/*
// @version     2.6
// @author      Anonymous
// @grant       GM_setValue
// @grant       GM_getValue
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/533297/8chan%20Single%20ID%20Post%20Opacity%20with%20Thread-Specific%20Cross-Domain%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/533297/8chan%20Single%20ID%20Post%20Opacity%20with%20Thread-Specific%20Cross-Domain%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Global constants
    const CHECK_UNIQUE_IDS = true; // Enable/disable unique ID opacity check
    const TRANSPARENCY_FACTOR = 0.5; // Opacity for unique or toggled posts

    // Function to extract board and thread from URL and create a domain-agnostic storage key
    function getThreadInfo() {
        const url = window.location.href;
        const regex = /https:\/\/8chan\.(moe|se)\/([^/]+)\/res\/(\d+)\.html/;
        const match = url.match(regex);
        if (match) {
            return {
                board: match[2],
                thread: match[3],
                storageKey: `toggledColors_${match[2]}_${match[3]}`
            };
        }
        return null;
    }

    // Wait for the DOM to be fully loaded
    window.addEventListener('load', function() {
        const threadInfo = getThreadInfo();
        if (!threadInfo) {
            console.error('Could not parse board and thread from URL');
            return;
        }

        const storageKey = threadInfo.storageKey;
        let toggledColors = GM_getValue(storageKey, []);
        if (!Array.isArray(toggledColors)) {
            toggledColors = [];
            GM_setValue(storageKey, toggledColors);
        }

        const colorCount = new Map();

        function updateColorCounts() {
            colorCount.clear();
            document.querySelectorAll('.labelId').forEach(label => {
                const bgColor = label.style.backgroundColor;
                if (bgColor) {
                    colorCount.set(bgColor, (colorCount.get(bgColor) || 0) + 1);
                }
            });
        }

        function createToggleIcon(container, bgColor) {
            if (container.querySelector('.opacityToggle')) return;

            const icon = document.createElement('label');
            icon.textContent = '⚪';
            icon.style.cursor = 'pointer';
            icon.style.margin = '0 2px 0 2px'; // Override inherited margin, keep 2px left/right
            icon.style.verticalAlign = 'top'; // Align top with buttons
            icon.style.display = 'inline-block'; // Match button display
            icon.style.color = toggledColors.includes(bgColor) ? '#00ff00' : '#808080';
            icon.className = 'opacityToggle glowOnHover coloredIcon';
            icon.title = 'Toggle opacity for this ID in this thread';

            // Insert icon after extraMenuButton
            const extraMenuButton = container.querySelector('.extraMenuButton');
            if (extraMenuButton) {
                extraMenuButton.insertAdjacentElement('afterend', icon);
            } else {
                // Fallback: append to container
                container.appendChild(icon);
            }

            icon.addEventListener('click', () => {
                if (toggledColors.includes(bgColor)) {
                    toggledColors = toggledColors.filter(color => color !== bgColor);
                } else {
                    toggledColors.push(bgColor);
                }
                GM_setValue(storageKey, toggledColors);

                icon.style.color = toggledColors.includes(bgColor) ? '#00ff00' : '#808080';

                document.querySelectorAll('.innerOP, .innerPost').forEach(p => {
                    const label = p.querySelector('.labelId');
                    if (label && label.style.backgroundColor === bgColor) {
                        updatePostOpacity(p);
                    }
                });
            });
        }

        function updatePostOpacity(post) {
            const labelId = post.querySelector('.labelId');
            if (labelId) {
                const bgColor = labelId.style.backgroundColor;
                if (bgColor) {
                    const figure = post.querySelector('figure');
                    if (figure && figure.classList.contains('expandedCell')) {
                        post.style.opacity = '1';
                    } else {
                        let shouldBeOpaque = toggledColors.includes(bgColor) || (CHECK_UNIQUE_IDS && colorCount.get(bgColor) === 1);
                        post.style.opacity = shouldBeOpaque ? TRANSPARENCY_FACTOR : '1';
                    }
                }
            }
        }

        function processPost(post, isOP = false) {
            const labelId = post.querySelector('.labelId');
            if (labelId) {
                const bgColor = labelId.style.backgroundColor;
                if (bgColor) {
                    updatePostOpacity(post);

                    const title = post.querySelector(isOP ? '.opHead.title' : '.postInfo.title');
                    if (title) {
                        createToggleIcon(title, bgColor);
                    }

                    // Observe figure for class changes
                    const figure = post.querySelector('figure');
                    if (figure) {
                        const observer = new MutationObserver(() => {
                            updatePostOpacity(post);
                        });
                        observer.observe(figure, { attributes: true, attributeFilter: ['class'] });
                    }

                    // Add hover event listeners
                    post.addEventListener('mouseover', () => {
                        post.style.opacity = '1';
                    });
                    post.addEventListener('mouseout', () => {
                        updatePostOpacity(post);
                    });
                }
            }
        }

        // Initial processing
        updateColorCounts();
        const opPost = document.querySelector('.innerOP');
        if (opPost) processPost(opPost, true);
        document.querySelectorAll('.innerPost').forEach(post => processPost(post, false));

        // MutationObserver for new posts
        const postsContainer = document.querySelector('.divPosts');
        if (postsContainer) {
            const observer = new MutationObserver((mutations) => {
                let newPosts = false;
                mutations.forEach(mutation => {
                    if (mutation.addedNodes.length) {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE && node.matches('.postCell')) {
                                const innerPost = node.querySelector('.innerPost');
                                if (innerPost) newPosts = true;
                            }
                        });
                    }
                });

                if (newPosts) {
                    updateColorCounts();
                    document.querySelectorAll('.innerPost').forEach(post => {
                        if (!post.style.opacity) processPost(post, false);
                    });
                }
            });

            observer.observe(postsContainer, { childList: true, subtree: true });
        }
    });
})();