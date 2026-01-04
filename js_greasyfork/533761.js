// ==UserScript==
// @name        8chan.moe Mod Shortcuts
// @namespace   Violentmonkey Scripts
// @match       https://8chan.moe/mod.js?boardUri=*&threadId=*
// @match       https://8chan.moe/*/res/*
// @grant       none
// @version     1.8
// @author      Anonymous
// @license     MIT
// @description Adds a larger checkbox and ban button to each post's title bar on 8chan.moe mod.js and thread pages, hidden by default with a toggle button in the OP title bar and clickable toggle text in non-OP posts.
// @downloadURL https://update.greasyfork.org/scripts/533761/8chanmoe%20Mod%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/533761/8chanmoe%20Mod%20Shortcuts.meta.js
// ==/UserScript==

/* eslint-env browser, es6 */

(function() {
    'use strict';

    // Track toggle state (hidden by default)
    let areModShortcutsVisible = false;

    // Function to add a larger checkbox and ban button to a post
    function addModShortcuts(post) {
        const deletionCheckbox = post.querySelector('input.deletionCheckBox');
        if (!deletionCheckbox) return; // Skip if no deletion checkbox found

        // Find the postInfo or opHead div to append the new checkbox
        const postInfo = post.querySelector('.postInfo.title, .opHead.title');
        if (!postInfo) return;

        // Create a container for the large checkbox and ban button
        const modShortcutsContainer = document.createElement('span');
        modShortcutsContainer.className = 'mod-shortcuts-container';
        modShortcutsContainer.style.marginLeft = '12px';
        modShortcutsContainer.style.display = areModShortcutsVisible ? 'inline-flex' : 'none';
        modShortcutsContainer.style.verticalAlign = 'top';
        modShortcutsContainer.style.gap = '5px';

        // Create the large checkbox
        const largeCheckbox = document.createElement('input');
        largeCheckbox.type = 'checkbox';
        largeCheckbox.style.width = '48px'; // 2x larger (24px * 2 = 48px)
        largeCheckbox.style.height = '48px';
        largeCheckbox.style.border = '4px solid black'; // Thicker border
        largeCheckbox.style.cursor = 'pointer';

        // Sync the large checkbox with the original
        largeCheckbox.checked = deletionCheckbox.checked;
        largeCheckbox.addEventListener('change', () => {
            deletionCheckbox.checked = largeCheckbox.checked;
            // Trigger change event on original checkbox to ensure form functionality
            const event = new Event('change', { bubbles: true });
            deletionCheckbox.dispatchEvent(event);
        });

        // Sync the original checkbox with the large one
        deletionCheckbox.addEventListener('change', () => {
            largeCheckbox.checked = deletionCheckbox.checked;
        });

        // Create the ban button
        const banButton = document.createElement('button');
        banButton.type = 'button'; // Prevent form submission
        banButton.textContent = 'Ban';
        banButton.style.width = '48px';
        banButton.style.height = '48px';
        banButton.style.border = '4px solid black';
        banButton.style.cursor = 'pointer';
        banButton.style.backgroundColor = '#f0f0f0';
        banButton.style.borderRadius = '3px';
        banButton.style.fontSize = '14px';
        banButton.style.marginTop = '0.2em'; // Align with checkbox

        // Ban button functionality
        banButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();

            // Find the extraMenuButton for this post
            const extraMenuButton = post.querySelector('.extraMenuButton');
            if (!extraMenuButton) {
                console.log('No .extraMenuButton found for post');
                return;
            }

            // Simulate click to open the floating menu
            extraMenuButton.click();

            // Wait briefly for the menu to appear
            setTimeout(() => {
                const floatingMenu = post.querySelector('.floatingList.extraMenu');
                if (!floatingMenu) {
                    console.log('No .floatingList.extraMenu found after clicking extraMenuButton');
                    return;
                }

                // Find the "Ban" menu item
                const banItem = Array.from(floatingMenu.querySelectorAll('li')).find(li => li.textContent === 'Ban');
                if (!banItem) {
                    console.log('No "Ban" item found in extraMenu');
                    return;
                }

                // Simulate click on the Ban item
                banItem.click();
                console.log('Ban modal triggered for post');
            }, 100); // Delay to ensure menu appears
        });

        // Append checkbox and ban button to the container
        modShortcutsContainer.appendChild(largeCheckbox);
        modShortcutsContainer.appendChild(banButton);

        // Append the container to the postInfo div
        postInfo.appendChild(modShortcutsContainer);
    }

    // Function to toggle mod shortcuts and update all buttons and text
    function toggleModShortcuts() {
        areModShortcutsVisible = !areModShortcutsVisible;
        console.log(`Toggling mod shortcuts: areModShortcutsVisible=${areModShortcutsVisible}`);

        // Update all mod shortcuts visibility
        const containers = document.querySelectorAll('.mod-shortcuts-container');
        containers.forEach(container => {
            container.style.display = areModShortcutsVisible ? 'inline-flex' : 'none';
        });

        // Update OP toggle button
        const opToggleButton = document.querySelector('.toggle-shortcuts-button.op-toggle');
        if (opToggleButton) {
            opToggleButton.textContent = areModShortcutsVisible ? 'Hide Mod Shortcuts' : 'Show Mod Shortcuts';
            opToggleButton.style.backgroundColor = areModShortcutsVisible ? '#e0e0e0' : '#f0f0f0';
        }

        // Update non-OP toggle text
        const toggleTexts = document.querySelectorAll('.toggle-shortcuts-text .toggle-text-inner');
        toggleTexts.forEach(text => {
            text.textContent = areModShortcutsVisible ? 'Mod' : 'Mod';
        });
    }

    // Function to add toggle button to OP post
    function addToggleButton() {
        const opPost = document.querySelector('.innerOP');
        if (!opPost) {
            console.log('No .innerOP found for toggle button');
            return;
        }

        const opTitle = opPost.querySelector('.opHead.title, .postInfo.title');
        if (!opTitle) {
            console.log('No .opHead.title or .postInfo.title found in .innerOP');
            return;
        }

        // Remove existing toggle button to prevent duplicates
        const existingButton = opTitle.querySelector('.toggle-shortcuts-button.op-toggle');
        if (existingButton) {
            existingButton.remove();
        }

        // Create toggle button
        const toggleButton = document.createElement('button');
        toggleButton.type = 'button'; // Prevent form submission
        toggleButton.className = 'toggle-shortcuts-button op-toggle glowOnHover';
        toggleButton.textContent = areModShortcutsVisible ? 'Hide Mod Shortcuts' : 'Show Mod Shortcuts';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.marginLeft = '10px';
        toggleButton.style.padding = '6px 12px'; // Larger for OP
        toggleButton.style.border = '2px solid #ccc';
        toggleButton.style.backgroundColor = areModShortcutsVisible ? '#e0e0e0' : '#f0f0f0';
        toggleButton.style.borderRadius = '5px';
        toggleButton.style.verticalAlign = 'middle';
        toggleButton.style.fontSize = '16px'; // Larger for OP

        // Toggle functionality
        toggleButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent any default behavior
            event.stopPropagation(); // Prevent bubbling
            console.log('OP toggle button clicked');
            toggleModShortcuts();
        });

        // Append button to OP title bar
        opTitle.appendChild(toggleButton);
        console.log('OP toggle button added to OP title bar');
    }

    // Function to add clickable toggle text to non-OP posts
    function addNonOpToggleText(post) {
        const postInfo = post.querySelector('.postInfo.title');
        if (!postInfo) {
            console.log('No .postInfo.title found in non-OP post');
            return;
        }

        const spanId = postInfo.querySelector('.spanId');
        const linkSelf = postInfo.querySelector('.linkSelf');
        if (!spanId || !linkSelf) {
            console.log(`Non-OP toggle text not added: spanId=${!!spanId}, linkSelf=${!!linkSelf}`);
            return;
        }

        // Remove existing toggle text to prevent duplicates
        const existingText = postInfo.querySelector('.toggle-shortcuts-text');
        if (existingText) {
            existingText.remove();
        }

        // Create wrapper span for [text]
        const toggleTextWrapper = document.createElement('span');
        toggleTextWrapper.className = 'toggle-shortcuts-text';
        toggleTextWrapper.style.display = 'inline-block';
        toggleTextWrapper.style.marginLeft = '5px';
        toggleTextWrapper.style.marginRight = '5px';

        // Create inner clickable text
        const toggleTextInner = document.createElement('span');
        toggleTextInner.className = 'toggle-text-inner';
        toggleTextInner.textContent = areModShortcutsVisible ? 'Mod' : 'Mod';
        toggleTextInner.style.cursor = 'pointer';
        toggleTextInner.style.fontSize = '14px'; // Match header text
        toggleTextInner.style.color = '#3366cc'; // Subtle blue for clickability
        toggleTextInner.style.textDecoration = 'none'; // Clean look
        toggleTextInner.addEventListener('mouseover', () => {
            toggleTextInner.style.textDecoration = 'underline'; // Hover effect
        });
        toggleTextInner.addEventListener('mouseout', () => {
            toggleTextInner.style.textDecoration = 'none';
        });

        // Toggle functionality
        toggleTextInner.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent any default behavior
            event.stopPropagation(); // Prevent bubbling
            console.log('Non-OP toggle text clicked');
            toggleModShortcuts();
        });

        // Assemble [text]
        toggleTextWrapper.appendChild(document.createTextNode('['));
        toggleTextWrapper.appendChild(toggleTextInner);
        toggleTextWrapper.appendChild(document.createTextNode(']'));

        // Insert text between spanId and linkSelf
        linkSelf.insertAdjacentElement('beforebegin', toggleTextWrapper);
        console.log('Non-OP toggle text added between spanId and linkSelf');
    }

    // Process all posts (OP and replies)
    function processPosts() {
        // Handle OP
        const opPost = document.querySelector('.innerOP');
        if (opPost) {
            addModShortcuts(opPost);
            addToggleButton();
        }

        // Handle replies
        const replyPosts = document.querySelectorAll('.innerPost');
        replyPosts.forEach(post => {
            addModShortcuts(post);
            addNonOpToggleText(post);
        });
    }

    // Initial processing
    processPosts();

    // Observe for dynamically added posts (e.g., via auto-refresh or new replies)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if the added node is a post
                        if (node.classList.contains('innerPost')) {
                            addModShortcuts(node);
                            addNonOpToggleText(node);
                        } else if (node.classList.contains('innerOP')) {
                            addModShortcuts(node);
                            addToggleButton();
                        }
                        // Check for posts within the added node
                        node.querySelectorAll('.innerPost').forEach(post => {
                            addModShortcuts(post);
                            addNonOpToggleText(post);
                        });
                        node.querySelectorAll('.innerOP').forEach(post => {
                            addModShortcuts(post);
                            addToggleButton();
                        });
                    }
                });
            }
        });
    });

    // Observe changes in the thread list
    const threadList = document.getElementById('threadList');
    if (threadList) {
        observer.observe(threadList, {
            childList: true,
            subtree: true
        });
    } else {
        console.log('No #threadList found for MutationObserver');
    }
})();