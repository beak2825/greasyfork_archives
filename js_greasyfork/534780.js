// ==UserScript==
// @name         8chan Hiding Enhancer
// @namespace    nipah-scripts-8chan
// @version      1.5.1
// @description  Hides backlinks pointing to hidden posts, prevents hover tooltips and adds strikethrough to quotelinks, and adds recursive hiding/filtering options on 8chan.moe/se. Also adds unhiding options.
// @author       nipah, Gemini
// @license      MIT
// @match        https://8chan.moe/*/res/*.html*
// @match        https://8chan.se/*/res/*.html*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/534780/8chan%20Hiding%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/534780/8chan%20Hiding%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_NAME = 'Hiding Enhancer';
    const BACKLINK_SELECTOR = '.panelBacklinks a, .altBacklinks a';
    const QUOTE_LINK_SELECTOR = '.quoteLink';
    const ALL_LINK_SELECTORS = `${BACKLINK_SELECTOR}, ${QUOTE_LINK_SELECTOR}`;
    const POST_CONTAINER_SELECTOR = '.opCell, .postCell';
    const INNER_POST_SELECTOR = '.innerOP, .innerPost'; // Selector for the inner content div
    const THREAD_CONTAINER_SELECTOR = '#divThreads'; // Container for all posts in the thread
    const HIDDEN_CLASS = 'hidden'; // Class added to the container when hidden by hiding.js
    const HIDDEN_QUOTE_CLASS = 'hidden-quote'; // Class to add to quote links for hidden posts
    const TOOLTIP_SELECTOR = '.quoteTooltip'; // Selector for the tooltip element
    const HIDE_BUTTON_SELECTOR = '.hideButton'; // Selector for the hide menu button
    const HIDE_MENU_SELECTOR = '.floatingList.extraMenu'; // Selector for the hide menu dropdown
    const LABEL_ID_SELECTOR = '.labelId'; // Selector for the post ID label
    const UNHIDE_BUTTON_SELECTOR = '.unhideButton'; // Selector for the site's unhide button

    const log = (...args) => console.log(`[${SCRIPT_NAME}]`, ...args);
    const warn = (...args) => console.warn(`[${SCRIPT_NAME}]`, ...args);
    const error = (...args) => console.error(`[${SCRIPT_NAME}]`, ...args);


    let debounceTimer = null;
    const DEBOUNCE_DELAY = 250; // ms


    /**
     * Injects custom CSS styles into the document head.
     */
    function addCustomStyles() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            .${HIDDEN_QUOTE_CLASS} {
                text-decoration: line-through !important;
            }
            /* Style for the dynamically added menu items */
            ${HIDE_MENU_SELECTOR} li[data-action^="hide-recursive"],
            ${HIDE_MENU_SELECTOR} li[data-action^="filter-id-recursive"],
            ${HIDE_MENU_SELECTOR} li[data-action="show-id"],
            ${HIDE_MENU_SELECTOR} li[data-action="show-all"] {
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
        log('Custom styles injected.');
    }

    /**
     * Extracts the target post ID from a link's href attribute.
     * Works for both backlinks and quote links.
     * @param {HTMLAnchorElement} linkElement - The link <a> element.
     * @returns {string|null} The target post ID as a string, or null if not found.
     */
    function getTargetPostIdFromLink(linkElement) {
        if (!linkElement || !linkElement.href) {
            return null;
        }
        // Match the post number after the last '#'
        const match = linkElement.href.match(/#(\d+)$/);
        // Only return numeric post ID
        return match ? match[1] : null;
    }

    /**
     * Checks if a post is currently hidden based on its ID.
     * @param {string} postId - The ID of the post to check.
     * @returns {boolean} True if the post is hidden, false otherwise.
     */
    function isPostHidden(postId) {
        if (!postId) return false;
        const postContainer = document.getElementById(postId);
        if (!postContainer) return false;

        // Check if the main container (.opCell or .postCell) is hidden (can happen with thread hiding)
        if (postContainer.classList.contains(HIDDEN_CLASS)) {
            return true;
        }

        // Check if the inner content container (.innerOP or .innerPost) is hidden (common for post hiding)
        const innerContent = postContainer.querySelector(INNER_POST_SELECTOR);
        return innerContent ? innerContent.classList.contains(HIDDEN_CLASS) : false;
    }

    /**
     * Updates the visibility or style of a single link based on its target post's hidden status.
     * Handles both backlinks and quote links.
     * @param {HTMLAnchorElement} linkElement - The link <a> element to update.
     */
    function updateLinkVisibility(linkElement) {
        const targetPostId = getTargetPostIdFromLink(linkElement);
        // Ensure it's a numeric post ID link
        if (!targetPostId) return;

        const hidden = isPostHidden(targetPostId);

        if (linkElement.classList.contains('quoteLink')) {
            // It's a quote link, apply strikethrough
            if (hidden) {
                linkElement.classList.add(HIDDEN_QUOTE_CLASS);
                // // log(`Adding strikethrough to quote link ${linkElement.href} pointing to hidden post ${targetPostId}`);
            } else {
                linkElement.classList.remove(HIDDEN_QUOTE_CLASS);
                // // log(`Removing strikethrough from quote link ${linkElement.href} pointing to visible post ${targetPostId}`);
            }
        } else {
            // It's a backlink, hide/show the element
            if (hidden) {
                linkElement.style.display = 'none';
                // // log(`Hiding backlink ${linkElement.href} pointing to hidden post ${targetPostId}`);
            } else {
                // Reset display.
                linkElement.style.display = '';
                // // log(`Showing backlink ${linkElement.href} pointing to visible post ${targetPostId}`);
            }
        }
    }

    /**
     * Iterates through all relevant links (backlinks and quote links) on the page and updates their visibility/style.
     */
    function updateAllLinks() {
        log('Updating all link visibility/style...');
        const links = document.querySelectorAll(ALL_LINK_SELECTORS);
        links.forEach(updateLinkVisibility);
        log(`Checked ${links.length} links.`);
    }

    /**
     * Debounced version of updateAllLinks.
     */
    function debouncedUpdateAllLinks() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(updateAllLinks, DEBOUNCE_DELAY);
    }

    /**
     * Overrides the site's tooltips.loadTooltip function to prevent tooltips for hidden posts.
     */
    function overrideLoadTooltip() {
        // Check if tooltips object and loadTooltip function exist
        if (typeof tooltips === 'undefined' || typeof tooltips.loadTooltip !== 'function') {
            // Not ready, try again later
            setTimeout(overrideLoadTooltip, 100);
            return;
        }

        const originalLoadTooltip = tooltips.loadTooltip;

        tooltips.loadTooltip = function(tooltip, quoteUrl, replyId, isInline) {
            // Only intercept hover tooltips (isInline is false for hover tooltips)
            if (!isInline) {
                const matches = quoteUrl.match(/\/(\w+)\/res\/(\d+)\.html\#(\d+)/);
                const targetPostId = matches ? matches[3] : null; // Post ID is the 3rd group

                if (targetPostId && isPostHidden(targetPostId)) {
                    log(`Preventing hover tooltip for quote to hidden post ${targetPostId}`);
                    // Remove the tooltip element that was just created by the site's code
                    if (tooltip && tooltip.parentNode) {
                        tooltip.parentNode.removeChild(tooltip);
                    }
                    // Clear the site's internal reference if it points to the removed tooltip
                    // This is important so tooltips.removeIfExists doesn't try to remove it again
                    if (tooltips.currentTooltip === tooltip) {
                         tooltips.currentTooltip = null;
                    }
                    // Prevent the original function from running
                    return;
                }
            }

            // If it's an inline quote OR the target post is not hidden, call the original function
            originalLoadTooltip.apply(this, arguments);
        };

        log('tooltips.loadTooltip overridden to prevent tooltips for hidden posts.');
    }

    /**
     * Implements the recursive hiding logic using the site's hiding.hidePost function.
     * Hides a specific post and all its replies recursively.
     * @param {string} startPostId - The ID of the post to start hiding from.
     */
    function hidePostAndRepliesRecursivelyUserscript(startPostId) {
        // Ensure site objects are available
        if (typeof hiding === 'undefined' || typeof hiding.hidePost !== 'function' || typeof tooltips === 'undefined' || typeof tooltips.knownPosts === 'undefined') {
            error('Site hiding or tooltips objects not available. Cannot perform recursive hide.');
            return;
        }

        const boardUri = window.location.pathname.split('/')[1]; // Get boardUri from URL

        function recursiveHide(currentPostId) {
            const postElement = document.getElementById(currentPostId);
            if (!postElement) {
                // Post element not found (might be filtered or not loaded)
                // log(`Post element ${currentPostId} not found.`);
                return;
            }

            // Check if the post already has the site's unhide button, indicating it's already hidden
            if (postElement.querySelector(UNHIDE_BUTTON_SELECTOR)) {
                 // log(`Post ${currentPostId} is already hidden (unhide button found). Skipping.`);
            } else {
                 const linkSelf = postElement.querySelector('.linkSelf');
                 if (linkSelf) {
                     log(`Hiding post ${currentPostId}`);
                     // Call the site's hidePost function
                     hiding.hidePost(linkSelf);
                 } else {
                     warn(`Could not find .linkSelf for post ${currentPostId}. Cannot hide.`);
                 }
            }

            // Find replies using the site's tooltips.knownPosts structure
            const knownPost = tooltips.knownPosts[boardUri]?.[currentPostId];

            if (!knownPost || !knownPost.added || knownPost.added.length === 0) {
                // log(`No known replies for post ${currentPostId}. Stopping recursion.`);
                return; // No replies or post not found in knownPosts
            }

            // Recursively hide replies
            knownPost.added.forEach((replyString) => {
                const [replyBoard, replyId] = replyString.split('_');

                // Only hide replies within the same board and thread
                // The site's knownPosts structure seems to only track replies within the same thread anyway
                if (replyBoard === boardUri) {
                     recursiveHide(replyId);
                }
            });
        }

        // Start the recursive hiding process
        log(`Starting recursive hide from post ${startPostId}`);
        recursiveHide(startPostId);
        log(`Finished recursive hide from post ${startPostId}`);

        // After hiding is done, trigger a link update to reflect changes
        debouncedUpdateAllLinks();
    }

    /**
     * Implements the recursive filtering logic.
     * Adds an ID filter and recursively hides replies for all posts matching that ID.
     * @param {string} targetId - The raw ID string (e.g., '0feed1') to filter by.
     * @param {string} clickedPostId - The ID of the post whose menu was clicked (used for context/logging).
     */
    function filterIdAndHideAllMatchingAndReplies(targetId, clickedPostId) {
         // Ensure site objects are available
        if (typeof settingsMenu === 'undefined' || typeof settingsMenu.createFilter !== 'function' || typeof hiding === 'undefined' || typeof hiding.hidePost !== 'function' || typeof tooltips === 'undefined' || typeof tooltips.knownPosts === 'undefined' || typeof hiding.buildPostFilterId !== 'function') {
            error('Site settingsMenu, hiding, tooltips, or hiding.buildPostFilterId objects not available. Cannot perform recursive ID filter.');
            return;
        }

        const boardUri = window.location.pathname.split('/')[1];
        const threadId = window.location.pathname.split('/')[3].split('.')[0]; // Extract thread ID from URL

        // Find the linkSelf element for the clicked post to pass to buildPostFilterId
        const clickedPostElement = document.getElementById(clickedPostId);
        let formattedFilterString = targetId; // Fallback to raw ID

        if (clickedPostElement) {
             const linkSelf = clickedPostElement.querySelector('.linkSelf');
             if (linkSelf) {
                 // Use the site's function to get the formatted ID string
                 formattedFilterString = hiding.buildPostFilterId(linkSelf, targetId);
             } else {
                 warn(`Could not find .linkSelf for clicked post ${clickedPostId}. Using raw ID for filter.`);
             }
        } else {
             warn(`Could not find clicked post element ${clickedPostId}. Using raw ID for filter.`);
        }


        log(`Applying Filter ID++ for ID: ${targetId} (formatted as "${formattedFilterString}") triggered from post ${clickedPostId})`);

        // 1. Add the ID filter using the site's function
        // Type 4 is for filtering by ID
        settingsMenu.createFilter(formattedFilterString, false, 4);
        log(`Added filter for ID: ${formattedFilterString}`);

        // Give the site's filter logic a moment to apply the 'hidden' class
        // Then find all posts with this ID and recursively hide their replies
        setTimeout(() => {
            const allPosts = document.querySelectorAll(POST_CONTAINER_SELECTOR);

            allPosts.forEach(postElement => {
                const postIdLabel = postElement.querySelector(LABEL_ID_SELECTOR);
                const currentPostId = postElement.id;

                // Check if the post matches the target ID
                if (postIdLabel && postIdLabel.textContent === targetId) {
                    log(`Found post ${currentPostId} matching ID ${targetId}. Recursively hiding its replies.`);
                    // Call the recursive hide function starting from this post.
                    // hidePostAndRepliesRecursivelyUserscript will handle hiding the post itself
                    // (if not already hidden by the filter) and its replies.
                    hidePostAndRepliesRecursivelyUserscript(currentPostId);
                }
            });

            // After hiding is done, trigger a link update to reflect changes
            // This is already handled by hidePostAndRepliesRecursivelyUserscript,
            // but calling it again here after the loop ensures all changes are caught.
            debouncedUpdateAllLinks();

        }, DEBOUNCE_DELAY + 50); // Wait slightly longer than the debounce delay
    }

    /**
     * Removes all filters associated with a specific raw ID from the site's settings.
     * @param {string} targetId - The raw ID string (e.g., '0feed1') to remove filters for.
     * @param {string} clickedPostId - The ID of the post whose menu was clicked (used for context/logging).
     */
    function removeIdFilters(targetId, clickedPostId) {
        // Ensure site objects are available
        if (typeof settingsMenu === 'undefined' || typeof settingsMenu.loadedFilters === 'undefined' || typeof hiding === 'undefined' || typeof hiding.checkFilters !== 'function' || typeof hiding.buildPostFilterId !== 'function') {
            error('Site settingsMenu, hiding, or hiding.buildPostFilterId objects not available. Cannot remove ID filters.');
            return;
        }

        const boardUri = window.location.pathname.split('/')[1];
        const threadId = window.location.pathname.split('/')[3].split('.')[0]; // Extract thread ID from URL

        // Find the linkSelf element for the clicked post to pass to buildPostFilterId
        const clickedPostElement = document.getElementById(clickedPostId);
        let formattedFilterString = targetId; // Fallback to raw ID

        if (clickedPostElement) {
             const linkSelf = clickedPostElement.querySelector('.linkSelf');
             if (linkSelf) {
                 // Use the site's function to get the formatted ID string
                 formattedFilterString = hiding.buildPostFilterId(linkSelf, targetId);
             } else {
                 warn(`Could not find .linkSelf for clicked post ${clickedPostId}. Using raw ID for filter removal check.`);
             }
        } else {
             warn(`Could not find clicked post element ${clickedPostId}. Using raw ID for filter removal check.`);
        }

        log(`Attempting to remove filters for ID: ${targetId} (formatted as "${formattedFilterString}") triggered from post ${clickedPostId})`);

        // Filter out the matching filters
        const initialFilterCount = settingsMenu.loadedFilters.length;
        settingsMenu.loadedFilters = settingsMenu.loadedFilters.filter(filter => {
            // Check if it's an ID filter (type 4 or 5) and if the filter content matches the formatted ID string
            return !( (filter.type === 4 || filter.type === 5) && filter.filter === formattedFilterString );
        });

        const removedCount = initialFilterCount - settingsMenu.loadedFilters.length;

        if (removedCount > 0) {
            log(`Removed ${removedCount} filter(s) for ID: ${formattedFilterString}`);
            // Update localStorage
            localStorage.setItem('filterData', JSON.stringify(settingsMenu.loadedFilters));
            // Trigger the site's filter update
            hiding.checkFilters();
            log('Triggered site filter update.');
        } else {
            log(`No filters found for ID: ${formattedFilterString} to remove.`);
        }

        // After removing filters, trigger a link update to reflect changes (posts might become visible)
        debouncedUpdateAllLinks();
    }

    /**
     * Removes all ID filters and manual hides for the current thread.
     */
    function showAllInThread() {
        // Ensure site objects are available
        if (typeof settingsMenu === 'undefined' || typeof settingsMenu.loadedFilters === 'undefined' || typeof hiding === 'undefined' || typeof hiding.checkFilters !== 'function' || typeof hiding.buildPostFilterId !== 'function') {
            error('Site settingsMenu, hiding, or hiding.buildPostFilterId objects not available. Cannot show all in thread.');
            return;
        }

        const boardUri = window.location.pathname.split('/')[1];
        const threadId = window.location.pathname.split('/')[3].split('.')[0]; // Extract thread ID from URL

        log(`Attempting to show all posts in thread /${boardUri}/res/${threadId}.html`);

        let filtersRemoved = 0;
        let unhideButtonsClicked = 0;

        // 1. Find and click all existing unhide buttons in the current thread
        log('Searching for and clicking existing unhide buttons...');
        const allPostsInThread = document.querySelectorAll(POST_CONTAINER_SELECTOR);
        allPostsInThread.forEach(postElement => {
            const postId = postElement.id;
            if (!postId) return; // Skip if element has no ID

            let unhideButton = null;
            if (postId === threadId) {
                // For the thread (OP), the button is the previous sibling
                unhideButton = postElement.previousElementSibling;
                if (!unhideButton || !unhideButton.matches(UNHIDE_BUTTON_SELECTOR)) {
                    unhideButton = null; // Reset if not found or doesn't match
                }
            } else {
                // For regular posts, the button is inside the post container
                unhideButton = postElement.querySelector(UNHIDE_BUTTON_SELECTOR);
            }

            if (unhideButton) {
                log(`Clicking unhide button for ${postId}`);
                unhideButton.click();
                unhideButtonsClicked++;
            }
        });
        log(`Clicked ${unhideButtonsClicked} unhide button(s).`);

        // 2. Remove ID filters specific to this thread from settingsMenu
        const initialFilterCount = settingsMenu.loadedFilters.length;
        settingsMenu.loadedFilters = settingsMenu.loadedFilters.filter(filter => {
            // Check if it's an ID filter (type 4 or 5) and if the filter content starts with the board-thread prefix
            const isThreadIdFilter = (filter.type === 4 || filter.type === 5) && filter.filter.startsWith(`${boardUri}-${threadId}-`);
            if (isThreadIdFilter) {
                filtersRemoved++;
            }
            return !isThreadIdFilter;
        });

        if (filtersRemoved > 0) {
            log(`Removed ${filtersRemoved} ID filter(s) specific to this thread.`);
            // Update localStorage for filters
            localStorage.setItem('filterData', JSON.stringify(settingsMenu.loadedFilters));
        } else {
            log('No ID filters specific to this thread found to remove.');
        }

        // 3. Trigger the site's filter update AFTER a short delay to allow button clicks to process
        //    and for the filter removal to take effect.
        setTimeout(() => {
            hiding.checkFilters();
            log('Triggered site filter update after delay.');

            // 5. Trigger userscript link update
            debouncedUpdateAllLinks();

            log('Finished "Show All" action.');
        }, 100); // 100ms delay
    }


    /**
     * Adds the custom "Hide post++", "Filter ID++", "Show ID", and "Show All" options to a hide button's menu when it appears.
     * Uses a MutationObserver to detect when the menu is added to the button.
     * @param {HTMLElement} hideButton - The hide button element.
     */
    function addCustomHideMenuOptions(hideButton) {
        // Create a new observer for each hide button
        // This observer will stay active for the lifetime of the hideButton element
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    for (const addedNode of mutation.addedNodes) {
                        // Check if the added node is the menu we're looking for
                        if (addedNode.nodeType === Node.ELEMENT_NODE && addedNode.matches(HIDE_MENU_SELECTOR)) {
                            // Check if this menu is a child of the target hideButton
                            if (hideButton.contains(addedNode)) {
                                // Menu appeared, now add the custom options if they're not already there
                                const menuUl = addedNode.querySelector('ul');
                                if (menuUl) {
                                    const postContainer = hideButton.closest(POST_CONTAINER_SELECTOR);
                                    const postId = postContainer ? postContainer.id : null;
                                    const isOP = postContainer ? postContainer.classList.contains('opCell') : false;
                                    const postIdLabel = postContainer ? postContainer.querySelector(LABEL_ID_SELECTOR) : null;
                                    const postIDText = postIdLabel ? postIdLabel.textContent : null;

                                    // Find anchor points for insertion
                                    const hidePostPlusItem = Array.from(menuUl.querySelectorAll('li')).find(li => li.textContent.trim() === 'Hide post+');
                                    const filterIdPlusItem = Array.from(menuUl.querySelectorAll('li')).find(li => li.textContent.trim() === 'Filter ID+');

                                    // Keep track of the last item we inserted after
                                    let lastInsertedAfter = null;

                                    // --- Add "Hide post++" ---
                                    // Only add for reply posts and if it doesn't exist
                                    if (!isOP && postId && !menuUl.querySelector('li[data-action="hide-recursive"]')) {
                                        const hideRecursiveItem = document.createElement('li');
                                        hideRecursiveItem.textContent = 'Hide post++';
                                        hideRecursiveItem.dataset.action = 'hide-recursive';

                                        hideRecursiveItem.addEventListener('click', (event) => {
                                            log(`'Hide post++' clicked for post ${postId}`);
                                            hidePostAndRepliesRecursivelyUserscript(postId);
                                        });

                                        // Insert after "Hide post+" if found
                                        if (hidePostPlusItem) {
                                            hidePostPlusItem.after(hideRecursiveItem);
                                            lastInsertedAfter = hideRecursiveItem;
                                            log(`Added 'Hide post++' option after 'Hide post+' for post ${postId}.`);
                                        } else {
                                            // Fallback: append to the end if "Hide post+" isn't found (shouldn't happen for replies)
                                            menuUl.appendChild(hideRecursiveItem);
                                            lastInsertedAfter = hideRecursiveItem;
                                            warn(`'Hide post+' not found for post ${postId}. Appended 'Hide post++' to end.`);
                                        }
                                    }

                                    // --- Add "Filter ID++" ---
                                    // Only add if the post has an ID and it doesn't exist
                                    if (postIDText && !menuUl.querySelector('li[data-action="filter-id-recursive"]')) {
                                        const filterIdRecursiveItem = document.createElement('li');
                                        filterIdRecursiveItem.textContent = 'Filter ID++';
                                        filterIdRecursiveItem.dataset.action = 'filter-id-recursive';

                                        filterIdRecursiveItem.addEventListener('click', (event) => {
                                            filterIdAndHideAllMatchingAndReplies(postIDText, postId);
                                        });

                                        // Insert after "Filter ID+" if it exists, otherwise after the last item we added ("Hide post++")
                                        if (filterIdPlusItem) {
                                            filterIdPlusItem.after(filterIdRecursiveItem);
                                            lastInsertedAfter = filterIdRecursiveItem;
                                            log(`Added 'Filter ID++' option after 'Filter ID+' for post ${postId}.`);
                                        } else if (lastInsertedAfter) { // If Hide post++ was added
                                            lastInsertedAfter.after(filterIdRecursiveItem);
                                            lastInsertedAfter = filterIdRecursiveItem;
                                            warn(`'Filter ID+' not found for post ${postId}. Appended 'Filter ID++' after last added item.`);
                                        } else {
                                            // Fallback: append to the end if neither "Filter ID+" nor "Hide post++" were present/added
                                            menuUl.appendChild(filterIdRecursiveItem);
                                            lastInsertedAfter = filterIdRecursiveItem;
                                            warn(`Neither 'Filter ID+' nor previous custom item found for post ${postId}. Appended 'Filter ID++' to end.`);
                                        }
                                    }

                                    // --- Add "Show ID" ---
                                    // Only add if the post has an ID and it doesn't exist
                                    if (postIDText && !menuUl.querySelector('li[data-action="show-id"]')) {
                                        const showIdItem = document.createElement('li');
                                        showIdItem.textContent = 'Show ID';
                                        showIdItem.dataset.action = 'show-id';

                                        showIdItem.addEventListener('click', (event) => {
                                            removeIdFilters(postIDText, postId);
                                            // Simulate click outside to close menu via site's logic
                                            setTimeout(() => document.body.click(), 0);
                                        });

                                        // Insert after the last item we added ("Filter ID++" or "Hide post++")
                                        if (lastInsertedAfter) {
                                            lastInsertedAfter.after(showIdItem);
                                            lastInsertedAfter = showIdItem;
                                            log(`Added 'Show ID' option after last added custom item for post ${postId}.`);
                                        } else if (filterIdPlusItem) {
                                             // Fallback if no custom items were added before this, but "Filter ID+" exists
                                             filterIdPlusItem.after(showIdItem);
                                             lastInsertedAfter = showIdItem;
                                             warn(`No previous custom item found for post ${postId}. Appended 'Show ID' after 'Filter ID+'.`);
                                        } else {
                                            // Fallback: append to the end if nothing else was added/found
                                            menuUl.appendChild(showIdItem);
                                            lastInsertedAfter = showIdItem;
                                            warn(`Neither previous custom item nor 'Filter ID+' found for post ${postId}. Appended 'Show ID' to end.`);
                                        }
                                    }

                                    // --- Add "Show All" ---
                                    // Add this option regardless of post type or ID, if it doesn't exist
                                    if (!menuUl.querySelector('li[data-action="show-all"]')) {
                                        const showAllItem = document.createElement('li');
                                        showAllItem.textContent = 'Show All';
                                        showAllItem.dataset.action = 'show-all';

                                        showAllItem.addEventListener('click', (event) => {
                                            log(`'Show All' clicked for post ${postId}`);
                                            showAllInThread();
                                            // Simulate click outside to close menu via site's logic
                                            setTimeout(() => document.body.click(), 0);
                                        });

                                        // Insert after the last item we added ("Show ID", "Filter ID++", or "Hide post++")
                                        if (lastInsertedAfter) {
                                            lastInsertedAfter.after(showAllItem);
                                        } else {
                                            // Fallback: append to the end if no other custom items were added
                                            menuUl.appendChild(showAllItem);
                                        }
                                        log(`Added 'Show All' option for post ${postId}.`);
                                    }


                                } else {
                                    warn('Could not find ul inside hide menu.');
                                }
                            }
                        }
                    }
                }
            }
        });

        // Start observing the hide button for added children (the menu appears as a child)
        observer.observe(hideButton, { childList: true });
    }

    /**
     * Finds all existing hide buttons on the page and attaches the menu observer logic.
     */
    function addCustomHideOptionsToExistingButtons() {
        const hideButtons = document.querySelectorAll(HIDE_BUTTON_SELECTOR);
        hideButtons.forEach(addCustomHideMenuOptions);
        log(`Attached menu observers to ${hideButtons.length} existing hide buttons.`);
    }


    // --- Initialization ---

    log('Initializing...');

    // Add custom CSS styles
    addCustomStyles();

    // Initial setup after a short delay to ensure site scripts are ready
    setTimeout(() => {
        updateAllLinks(); // Update links based on initial hidden posts
        overrideLoadTooltip(); // Override tooltip function
        addCustomHideOptionsToExistingButtons(); // Add menu options to posts already on the page
    }, 500);


    // Observe changes in the thread container to catch new posts or visibility changes
    const threadContainer = document.querySelector(THREAD_CONTAINER_SELECTOR);
    if (threadContainer) {
        const observer = new MutationObserver((mutationsList) => {
            let needsLinkUpdate = false;
            for (const mutation of mutationsList) {
                // Check for class changes on post containers (.opCell, .postCell) or their inner content (.innerOP, .innerPost)
                if (mutation.type === 'attributes' && mutation.attributeName === 'class' && (mutation.target.matches(POST_CONTAINER_SELECTOR) || mutation.target.matches(INNER_POST_SELECTOR))) {
                     const wasHidden = mutation.oldValue ? mutation.oldValue.includes(HIDDEN_CLASS) : false;
                     const isHidden = mutation.target.classList.contains(HIDDEN_CLASS);
                     if (wasHidden !== isHidden) {
                        const postContainer = mutation.target.closest(POST_CONTAINER_SELECTOR);
                        const postId = postContainer ? postContainer.id : 'unknown';
                        log(`Mutation: Class change on post ${postId}. Hidden: ${isHidden}. Triggering link update.`);
                        needsLinkUpdate = true;
                     }
                }
                // Check for new nodes being added
                else if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // If a post container is added directly
                            if (node.matches(POST_CONTAINER_SELECTOR)) {
                                log(`Mutation: New post container added (ID: ${node.id}). Triggering link update and adding menu observer.`);
                                needsLinkUpdate = true;
                                const hideButton = node.querySelector(HIDE_BUTTON_SELECTOR);
                                if (hideButton) {
                                    addCustomHideMenuOptions(hideButton); // Attach observer to the new hide button
                                }
                            } else {
                                // Check for post containers within the added node's subtree
                                const newPosts = node.querySelectorAll(POST_CONTAINER_SELECTOR);
                                if (newPosts.length > 0) {
                                    log(`Mutation: New posts added within subtree. Triggering link update and adding menu observers.`);
                                    needsLinkUpdate = true;
                                    newPosts.forEach(post => {
                                        const hideButton = post.querySelector(HIDE_BUTTON_SELECTOR);
                                        if (hideButton) {
                                            addCustomHideMenuOptions(hideButton); // Attach observer to new hide buttons
                                        }
                                    });
                                }
                            }
                        }
                    });
                    // Also check removed nodes in case backlinks need updating
                    mutation.removedNodes.forEach(node => {
                         if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.matches(POST_CONTAINER_SELECTOR) || node.querySelector(POST_CONTAINER_SELECTOR)) {
                                 log(`Mutation: Post removed. Triggering link update.`);
                                 needsLinkUpdate = true;
                            }
                         }
                    });
                }
            }

            if (needsLinkUpdate) {
                debouncedUpdateAllLinks();
            }
        });

        observer.observe(threadContainer, {
            attributes: true,       // Watch for attribute changes (like 'class')
            attributeFilter: ['class'], // Only care about class changes
            attributeOldValue: true,// Need old value to see if 'hidden' changed
            childList: true,        // Watch for new nodes being added or removed
            subtree: true           // Watch descendants (the posts and their inner content)
        });

        log('MutationObserver attached to thread container for link updates and new menu options.');

    } else {
        warn('Thread container not found. Links and menu options will not update automatically on dynamic changes.');
    }

})();