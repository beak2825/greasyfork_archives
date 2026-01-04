// ==UserScript==
// @name         Tumblr Manage Blocked Posts
// @description  Adds a management interface for blocked posts on Tumblr.
// @namespace    tumblr-manage-blocked-posts
// @match        *://www.tumblr.com/*
// @match        https://www.tumblr.com/explore/trending
// @match        https://www.tumblr.com/dashboard
// @match        https://www.tumblr.com/dashboard/hubs
// @match        https://www.tumblr.com/dashboard/following
// @match        *://*.tumblr.com/*
// @match        https://www.tumblr.com/tagged/*
// @grant        none
// @version      0.1
// @downloadURL https://update.greasyfork.org/scripts/497055/Tumblr%20Manage%20Blocked%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/497055/Tumblr%20Manage%20Blocked%20Posts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const storageKey = 'postblock.blockedPostRootIDs';

    const unblockPost = async rootID => {
        let blockedPostRootIDs = JSON.parse(localStorage.getItem(storageKey) || '[]');
        blockedPostRootIDs = blockedPostRootIDs.filter(id => id !== rootID);
        localStorage.setItem(storageKey, JSON.stringify(blockedPostRootIDs));
        console.log('Unblocked post ID:', rootID);
        console.log('Updated blockedPostRootIDs:', blockedPostRootIDs);
        updateBlockedPostsList();
    };

    const getPostDetails = (postElement) => {
        const blogNameElement = postElement.querySelector('a[data-user-pk]'); // Selector for blog name
        const titleElement = postElement.querySelector('h2, h3, h4'); // Adjust as necessary for post title

        const blogName = blogNameElement ? blogNameElement.innerText : 'Unknown Blog';
        const postTitle = titleElement ? titleElement.innerText : 'Untitled Post';

        return { blogName, postTitle };
    };

    const updateBlockedPostsList = () => {
        const blockedPostRootIDs = JSON.parse(localStorage.getItem(storageKey) || '[]');
        console.log('Blocked Post IDs:', blockedPostRootIDs);
        const blockedPostsList = document.querySelector('.blocked-posts-list');
        blockedPostsList.innerHTML = ''; // Clear the list

        blockedPostRootIDs.forEach(id => {
            const postElement = document.querySelector(`[data-id="${id}"]`);
            if (postElement) {
                const { blogName, postTitle } = getPostDetails(postElement);

                const postContainer = document.createElement('div');
                postContainer.style.marginBottom = '10px'; // Add some spacing between items

                const postDetails = document.createElement('div');
                postDetails.textContent = `${blogName} - ${postTitle}`;
                postDetails.style.marginBottom = '5px';
                postDetails.style.padding = '10px';
                postDetails.style.backgroundColor = '#f4f4f4';
                postDetails.style.border = '1px solid #ccc';
                postDetails.style.borderRadius = '4px';

                const unblockButton = document.createElement('button');
                unblockButton.textContent = 'Unblock';
                unblockButton.style.marginTop = '10px';
                unblockButton.style.backgroundColor = '#3A3052'; // Same color as the Manage Blocked Posts button
                unblockButton.style.color = '#ffffff';
                unblockButton.style.border = 'none';
                unblockButton.style.cursor = 'pointer';
                unblockButton.style.padding = '5px 10px';
                unblockButton.addEventListener('click', () => unblockPost(id));

                postContainer.appendChild(postDetails);
                postContainer.appendChild(unblockButton);
                blockedPostsList.appendChild(postContainer);
            } else {
                console.log('Post element not found for ID:', id);
            }
        });
    };

    const createBlockedPostsModal = () => {
        const modal = document.createElement('div');
        modal.className = 'blocked-posts-modal';
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = '#ffffff';
        modal.style.padding = '20px';
        modal.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        modal.style.zIndex = 2000;
        modal.style.maxHeight = '80%';
        modal.style.overflowY = 'auto';

        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.style.backgroundColor = 'transparent';
        closeButton.style.border = 'none';
        closeButton.style.fontSize = '18px';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', () => {
            modal.remove();
        });

        const modalTitle = document.createElement('h2');
        modalTitle.textContent = 'Blocked Posts';
        modalTitle.style.fontSize = '24px'; // Make the header larger

        const blockedPostsList = document.createElement('div');
        blockedPostsList.className = 'blocked-posts-list';

        modal.appendChild(closeButton);
        modal.appendChild(modalTitle);
        modal.appendChild(blockedPostsList);

        document.body.appendChild(modal);

        updateBlockedPostsList();
    };

    const addManageBlockedPostsButton = () => {
        let button = document.querySelector('.manage-blocked-posts-button');
        if (!button) {
            button = document.createElement('button');
            button.className = 'manage-blocked-posts-button';
            button.textContent = 'Manage Blocked Posts';
            button.style.position = 'absolute';
            button.style.bottom = '20px';
            button.style.right = '20px';
            button.style.zIndex = 1000;
            button.style.padding = '10px';
            button.style.backgroundColor = '#3A3052';
            button.style.color = '#ffffff';
            button.style.border = 'none';
            button.style.cursor = 'pointer';
            button.addEventListener('click', createBlockedPostsModal);
            document.body.appendChild(button);
        }
    };

    const toggleManageBlockedPostsButton = (show) => {
        const button = document.querySelector('.manage-blocked-posts-button');
        if (button) {
            button.style.display = show ? 'block' : 'none';
        }
    };

    const handleBodyClick = (event) => {
        const sidebar = document.querySelector('.TRX6J');
        const button = document.querySelector('.manage-blocked-posts-button');
        if (sidebar && button) {
            const isClickInsideSidebar = sidebar.contains(event.target);
            if (!isClickInsideSidebar) {
                toggleManageBlockedPostsButton(false);
            }
        }
    };

    const main = async function() {
        document.body.addEventListener('click', handleBodyClick);

        // Add an event listener to the dropdown button to trigger the blocked posts management interface
        const dropdownButton = document.querySelector('.TRX6J');
        if (dropdownButton) {
            dropdownButton.addEventListener('click', () => {
                addManageBlockedPostsButton();
                toggleManageBlockedPostsButton(true);
            });
        }
    };

    main();
})();