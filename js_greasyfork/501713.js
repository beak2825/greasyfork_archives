// ==UserScript==
// @name         Boosty Message Scanner
// @version      1.9.002
// @description  Scan messages for donations and mark posts
// @match        https://boosty.to/*
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/501713/Boosty%20Message%20Scanner.user.js
// @updateURL https://update.greasyfork.org/scripts/501713/Boosty%20Message%20Scanner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to scan messages and save donation links
    function scanMessages() {
        const messageElements = document.querySelectorAll('[class*="DialogueMessageWrapper-scss--module_root_"] [class*="DonationMessageInfo-scss--module_root_"]');
        let existingLinks = JSON.parse(localStorage.getItem('donationLinks')) || [];
        const newLinks = [];

        messageElements.forEach(element => {
            const linkElement = element.querySelector('[class*="DonationMessageInfo-scss--module_link_"]');
            if (linkElement) {
                const href = linkElement.href;
                const postId = href.split('/').pop().split('?')[0]; // Ensure no query parameters are included
                if (!existingLinks.includes(postId) && !newLinks.includes(postId)) {
                    newLinks.push(postId);
                }
            }
        });

        existingLinks = [...new Set([...existingLinks, ...newLinks])];
        localStorage.setItem('donationLinks', JSON.stringify(existingLinks));

        showAlert(newLinks, existingLinks);
    }

    // Function to add the scan button
    function addScanButton() {
        const container = document.querySelector('[class*="Publisher-scss--module_actionsLeft_"]');
        if (container && !document.querySelector('.scanMessagesButton')) {
            const scanButton = document.createElement('button');
            scanButton.innerText = 'Scan Messages';
            scanButton.className = 'scanMessagesButton';
            scanButton.style.marginLeft = '10px';
            scanButton.style.padding = '5px 10px';
            scanButton.style.backgroundColor = '#7289da';
            scanButton.style.color = 'white';
            scanButton.style.border = 'none';
            scanButton.style.borderRadius = '4px';
            scanButton.style.cursor = 'pointer';
            scanButton.onclick = scanMessages;
            container.appendChild(scanButton);
        }
    }

    // Function to mark posts with donations
    function markPosts() {
        const links = JSON.parse(localStorage.getItem('donationLinks')) || [];

        // Mark posts in BasePostHeader
        const postsBase = document.querySelectorAll('[class*="BasePostHeader-scss--module_root_"] [class*="CreatedAt-scss--module_headerLink_"]');
        postsBase.forEach(post => {
            const href = post.href || post.getAttribute('href');
            const postId = href ? href.split('/').pop().split('?')[0] : null;
            if (postId && links.includes(postId)) {
                const postHeader = post.closest('[class*="BasePostHeader-scss--module_root_"]');
                if (postHeader && !postHeader.querySelector('.markedPost')) {
                    const mark = document.createElement('span');
                    mark.innerText = '☻';
                    mark.className = 'markedPost';
                    mark.style.color = '#7289da';
                    mark.style.marginLeft = '5px';
                    mark.style.fontSize = '1.2em';
                    postHeader.querySelector('[class*="BasePostHeader-scss--module_headerLeftBlock_"]').appendChild(mark);
                }
            }
        });

        // Mark posts in PostHeaderWithAuthor
        const postsAuthor = document.querySelectorAll('[class*="PostHeaderWithAuthor-scss--module_root_"] [class*="CreatedAt-scss--module_headerLink_"]');
        postsAuthor.forEach(post => {
            const href = post.href || post.getAttribute('href');
            const postId = href ? href.split('/').pop().split('?')[0] : null;
            if (postId && links.includes(postId)) {
                const postHeader = post.closest('[class*="PostHeaderWithAuthor-scss--module_root_"]');
                if (postHeader && !postHeader.querySelector('.markedPost')) {
                    const mark = document.createElement('span');
                    mark.innerText = '☻';
                    mark.className = 'markedPost';
                    mark.style.color = '#7289da';
                    mark.style.marginLeft = '5px';
                    mark.style.fontSize = '1.2em';
                    postHeader.querySelector('[class*="PostHeaderWithAuthor-scss--module_headerLeftBlock_"]').appendChild(mark);
                }
            }
        });
    }

    // Function to show alert with buttons
    function showAlert(newLinks, existingLinks) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'customAlert';
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '50%';
        alertDiv.style.left = '50%';
        alertDiv.style.transform = 'translate(-50%, -50%)';
        alertDiv.style.backgroundColor = '#2f3136';
        alertDiv.style.padding = '20px';
        alertDiv.style.borderRadius = '8px';
        alertDiv.style.boxShadow = '0px 0px 20px rgba(0,0,0,0.5)';
        alertDiv.style.zIndex = '10000';
        alertDiv.style.color = 'white';
        alertDiv.style.minWidth = '300px';

        const message = document.createElement('p');
        message.innerText = `Found ${newLinks.length} new donation links. Total: ${existingLinks.length}`;
        message.style.marginBottom = '15px';
        alertDiv.appendChild(message);

        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.flexDirection = 'column';
        buttonsContainer.style.gap = '10px';

        const newLinksButton = document.createElement('button');
        newLinksButton.innerText = 'View New Links';
        newLinksButton.style.padding = '8px 12px';
        newLinksButton.style.backgroundColor = '#7289da';
        newLinksButton.style.color = 'white';
        newLinksButton.style.border = 'none';
        newLinksButton.style.borderRadius = '4px';
        newLinksButton.style.cursor = 'pointer';
        newLinksButton.onclick = () => {
            showNewLinks(newLinks);
        };
        buttonsContainer.appendChild(newLinksButton);

        const totalLinksButton = document.createElement('button');
        totalLinksButton.innerText = 'Edit Total Links';
        totalLinksButton.style.padding = '8px 12px';
        totalLinksButton.style.backgroundColor = '#4f545c';
        totalLinksButton.style.color = 'white';
        totalLinksButton.style.border = 'none';
        totalLinksButton.style.borderRadius = '4px';
        totalLinksButton.style.cursor = 'pointer';
        totalLinksButton.onclick = () => {
            showTotalLinks(existingLinks);
        };
        buttonsContainer.appendChild(totalLinksButton);

        const okButton = document.createElement('button');
        okButton.innerText = 'OK';
        okButton.style.padding = '8px 12px';
        okButton.style.backgroundColor = '#4f545c';
        okButton.style.color = 'white';
        okButton.style.border = 'none';
        okButton.style.borderRadius = '4px';
        okButton.style.cursor = 'pointer';
        okButton.onclick = () => {
            document.body.removeChild(alertDiv);
        };
        buttonsContainer.appendChild(okButton);

        alertDiv.appendChild(buttonsContainer);
        document.body.appendChild(alertDiv);
    }

    // Function to show new links
    function showNewLinks(newLinks) {
        const newLinksDiv = document.createElement('div');
        newLinksDiv.className = 'customNewLinks';
        newLinksDiv.style.position = 'fixed';
        newLinksDiv.style.top = '50%';
        newLinksDiv.style.left = '50%';
        newLinksDiv.style.transform = 'translate(-50%, -50%)';
        newLinksDiv.style.backgroundColor = '#2f3136';
        newLinksDiv.style.padding = '20px';
        newLinksDiv.style.borderRadius = '8px';
        newLinksDiv.style.boxShadow = '0px 0px 20px rgba(0,0,0,0.5)';
        newLinksDiv.style.zIndex = '10000';
        newLinksDiv.style.maxHeight = '80%';
        newLinksDiv.style.overflowY = 'auto';
        newLinksDiv.style.color = 'white';
        newLinksDiv.style.minWidth = '300px';

        const title = document.createElement('h3');
        title.innerText = 'New Donation Links';
        title.style.marginTop = '0';
        title.style.color = 'white';
        newLinksDiv.appendChild(title);

        if (newLinks.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.innerText = 'No new donation links found.';
            emptyMessage.style.color = '#b9bbbe';
            newLinksDiv.appendChild(emptyMessage);
        } else {
            const list = document.createElement('ul');
            list.style.paddingLeft = '20px';
            list.style.marginBottom = '15px';
            newLinks.forEach(link => {
                const listItem = document.createElement('li');
                listItem.style.marginBottom = '5px';
                const linkElement = document.createElement('a');
                linkElement.href = `https://boosty.to/posts/${link}`;
                linkElement.target = '_blank';
                linkElement.rel = 'noopener noreferrer';
                linkElement.innerText = link;
                linkElement.style.color = '#7289da';
                linkElement.style.textDecoration = 'none';
                listItem.appendChild(linkElement);
                list.appendChild(listItem);
            });
            newLinksDiv.appendChild(list);
        }

        const closeButton = document.createElement('button');
        closeButton.innerText = 'Close';
        closeButton.style.padding = '8px 12px';
        closeButton.style.backgroundColor = '#7289da';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '4px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.width = '100%';
        closeButton.onclick = () => {
            document.body.removeChild(newLinksDiv);
        };
        newLinksDiv.appendChild(closeButton);

        document.body.appendChild(newLinksDiv);
    }

    // Function to show and edit total links
    function showTotalLinks(existingLinks) {
        const totalLinksDiv = document.createElement('div');
        totalLinksDiv.className = 'customTotalLinks';
        totalLinksDiv.style.position = 'fixed';
        totalLinksDiv.style.top = '50%';
        totalLinksDiv.style.left = '50%';
        totalLinksDiv.style.transform = 'translate(-50%, -50%)';
        totalLinksDiv.style.backgroundColor = '#2f3136';
        totalLinksDiv.style.padding = '20px';
        totalLinksDiv.style.borderRadius = '8px';
        totalLinksDiv.style.boxShadow = '0px 0px 20px rgba(0,0,0,0.5)';
        totalLinksDiv.style.zIndex = '10000';
        totalLinksDiv.style.maxHeight = '80%';
        totalLinksDiv.style.overflowY = 'auto';
        totalLinksDiv.style.color = 'white';
        totalLinksDiv.style.minWidth = '400px';

        const title = document.createElement('h3');
        title.innerText = 'Edit Total Donation Links';
        title.style.marginTop = '0';
        title.style.color = 'white';
        totalLinksDiv.appendChild(title);

        const textArea = document.createElement('textarea');
        textArea.value = JSON.stringify(existingLinks, null, 2);
        textArea.style.width = '100%';
        textArea.style.height = '200px';
        textArea.style.backgroundColor = '#40444b';
        textArea.style.color = 'white';
        textArea.style.border = '1px solid #202225';
        textArea.style.borderRadius = '4px';
        textArea.style.padding = '8px';
        textArea.style.marginBottom = '15px';
        textArea.style.fontFamily = 'monospace';
        totalLinksDiv.appendChild(textArea);

        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.gap = '10px';
        buttonsContainer.style.justifyContent = 'flex-end';

        const saveButton = document.createElement('button');
        saveButton.innerText = 'Save';
        saveButton.style.padding = '8px 12px';
        saveButton.style.backgroundColor = '#7289da';
        saveButton.style.color = 'white';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '4px';
        saveButton.style.cursor = 'pointer';
        saveButton.onclick = () => {
            try {
                const newTotal = JSON.parse(textArea.value);
                if (Array.isArray(newTotal)) {
                    localStorage.setItem('donationLinks', JSON.stringify(newTotal));
                    alert('Total Donation Links updated successfully.');
                    document.body.removeChild(totalLinksDiv);
                    markPosts(); // Refresh marked posts
                } else {
                    alert('Invalid format. Please enter a valid JSON array.');
                }
            } catch (e) {
                alert('Invalid format. Please enter a valid JSON array.');
            }
        };
        buttonsContainer.appendChild(saveButton);

        const closeButton = document.createElement('button');
        closeButton.innerText = 'Close';
        closeButton.style.padding = '8px 12px';
        closeButton.style.backgroundColor = '#4f545c';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '4px';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = () => {
            document.body.removeChild(totalLinksDiv);
        };
        buttonsContainer.appendChild(closeButton);

        totalLinksDiv.appendChild(buttonsContainer);
        document.body.appendChild(totalLinksDiv);
    }

    // Initialize script
    function init() {
        if (location.pathname.includes('/app/messages')) {
            addScanButton();
        }
        markPosts();
    }

    // Run script on page load and on AJAX content load
    document.addEventListener('DOMContentLoaded', init);
    const observer = new MutationObserver(init);
    observer.observe(document.body, { childList: true, subtree: true });

})();