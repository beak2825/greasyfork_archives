// ==UserScript==
// @name         Tumblr Block Post
// @description  Adds a button to block specific posts on Tumblr.
// @namespace    tumblr-block-post
// @match        *://www.tumblr.com/*
// @match        https://www.tumblr.com/explore/trending
// @match        https://www.tumblr.com/dashboard
// @match        https://www.tumblr.com/dashboard/hubs
// @match        https://www.tumblr.com/dashboard/following
// @match        *://*.tumblr.com/*
// @match        https://www.tumblr.com/tagged/*
// @grant        none
// @version      0.1
// @downloadURL https://update.greasyfork.org/scripts/496785/Tumblr%20Block%20Post.user.js
// @updateURL https://update.greasyfork.org/scripts/496785/Tumblr%20Block%20Post.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const meatballButtonLabel = 'Block this post';
    const excludeClass = 'postblock-done';
    const hiddenClass = 'postblock-hidden';
    const storageKey = 'postblock.blockedPostRootIDs';

    // Utility functions
    const getPostElements = () => Array.from(document.querySelectorAll('[data-id]')).filter(post => !post.classList.contains(excludeClass));
    const registerMeatballItem = ({ label, onClick }) => {
        // Add meatball item button to the UI
        getPostElements().forEach(post => {
            if (!post.querySelector('.block-post-button')) {
                const button = document.createElement('button');
                button.textContent = label;
                button.className = 'block-post-button';
                button.style.position = 'absolute';
                button.style.top = '15px';
                button.style.right = '45px';
                button.style.zIndex = 1000;
                button.style.padding = '10px';
                button.style.backgroundColor = '#3A3052';
                button.style.color = '#ffffff';
                button.style.border = 'none';
                button.style.cursor = 'pointer';
                button.addEventListener('click', onClick);
                post.appendChild(button);
            }
        });
    };

    const processPosts = async function() {
        const blockedPostRootIDs = JSON.parse(localStorage.getItem(storageKey) || '[]');
        getPostElements().forEach(postElement => {
            const postID = postElement.dataset.id;
            const rootID = postID; // Simplified for this script

            if (blockedPostRootIDs.includes(rootID)) {
                postElement.classList.add(hiddenClass);
                postElement.style.display = 'none'; // Hide the post
            } else {
                postElement.classList.remove(hiddenClass);
                postElement.style.display = ''; // Show the post
            }
        });
    };

    const onButtonClicked = async function({ currentTarget }) {
        const postElement = currentTarget.closest('[data-id]');
        const postID = postElement.dataset.id;
        const rootID = postID; // Simplified for this script

        if (currentTarget.classList.contains('confirm')) {
            blockPost(rootID);
        } else {
            const confirmButton = document.createElement('button');
            confirmButton.textContent = 'Confirm';
            confirmButton.className = 'confirm';
            confirmButton.style.position = 'absolute';
            confirmButton.style.top = '15px';
            confirmButton.style.right = '45px';
            confirmButton.style.zIndex = 1000;
            confirmButton.style.padding = '10px';
            confirmButton.style.backgroundColor = '#3A3052';
            confirmButton.style.color = '#ffffff';
            confirmButton.style.border = 'none';
            confirmButton.style.cursor = 'pointer';
            confirmButton.style.width = currentTarget.offsetWidth + 'px';
            confirmButton.style.height = currentTarget.offsetHeight + 'px';
            confirmButton.addEventListener('click', onButtonClicked);
            postElement.replaceChild(confirmButton, currentTarget);
        }
    };

    const blockPost = async rootID => {
        const blockedPostRootIDs = JSON.parse(localStorage.getItem(storageKey) || '[]');
        blockedPostRootIDs.push(rootID);
        localStorage.setItem(storageKey, JSON.stringify(blockedPostRootIDs));
        processPosts();
    };

    const main = async function() {
        registerMeatballItem({ label: meatballButtonLabel, onClick: onButtonClicked });
        processPosts();

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && node.matches('[data-id]')) {
                            registerMeatballItem({ label: meatballButtonLabel, onClick: onButtonClicked });
                        }
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };

    main();
})();