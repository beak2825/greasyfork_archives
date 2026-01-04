// ==UserScript==
// @name         Copy or Share
// @namespace    http://tampermonkey.net/
// @version      2.8
// @icon         http://static.fanfou.com/favicon.ico
// @description  Copy webpage title and URL to clipboard or share to Fanfou
// @author       Jing Wang
// @license      GPL-3.0
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539561/Copy%20or%20Share.user.js
// @updateURL https://update.greasyfork.org/scripts/539561/Copy%20or%20Share.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // List of websites to exclude (blacklist)
    const blacklistedSites = [
        'https://fanfou.com/sharer/image',
        'https://co.gocheck.cn/',
        'http://mail.xynu.edu.cn/',
        'https://scholar.googleusercontent.com/',
        'https://www.frontiersin.org/',
        'http://210.43.24.43',
        'https://studio.firebase.google.com',
        'cloudworkstations.dev'
    ];

    // Check if the current page is in the blacklist
    function isBlacklistedSite() {
        return blacklistedSites.some(site => window.location.href.includes(site));
    }

    function processTitle(title) {
        // Replace "- cnBeta.COM 移动版(WAP)" with "- cnBeta"
        title = title.replace("- cnBeta.COM 移动版(WAP)", "- cnBeta");

        // Remove "(X+ 封私信)" pattern, where X can be any number
        title = title.replace(/\((\d+\+?)\s*封私信\)/g, "");

        // Remove "(X+ 封私信 / Y 条消息)" pattern, where X and Y can be any number
        title = title.replace(/\((\d+\+?)\s*封私信\s*\/\s*(\d+\+?)\s*条消息\)/g, "");

        return title.trim(); // Trim any leading or trailing whitespace
    }

    // Function to create a button with common styles
    function createButton(text, bottom) {
        let button = document.createElement('button');
        button.textContent = text;
        button.style.position = 'fixed';
        button.style.bottom = bottom;
        button.style.right = '60px';
        button.style.zIndex = '9999';
        button.style.padding = '6px';
        button.style.backgroundColor = 'transparent';
        button.style.color = '#AAAAAA';
        button.style.border = '1px solid #DDDDDD';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.width = '80px';
        button.style.fontSize = '13px';
        button.style.fontFamily = 'Microsoft Yahei';
        return button;
    }

    // Function to copy text to clipboard
    function copyToClipboard(text) {
        // Create a temporary textarea element
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed'; // Prevent scrolling to bottom
        document.body.appendChild(textarea);
        textarea.select();

        try {
            // Execute copy command
            const successful = document.execCommand('copy');
            const msg = successful ? 'Copied to clipboard' : 'Copy failed';
            console.log(msg);

            // Show a temporary notification
            showNotification(msg);
        } catch (err) {
            console.error('Copy failed:', err);
            showNotification('Copy failed');
        }

        // Clean up
        document.body.removeChild(textarea);
    }

    // Function to show a temporary notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '70px';
        notification.style.width = '165px';
        notification.style.right = '60px'; // position of the notification button
        notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        notification.style.color = 'white';
        notification.style.padding = '8px';
        notification.style.borderRadius = '4px';
        notification.style.zIndex = '10000';
        notification.style.fontSize = '12px';
        notification.style.fontFamily = 'Microsoft Yahei';
        notification.style.textAlign = 'center';
        notification.style.boxSizing = 'border-box';

        document.body.appendChild(notification);

        // Remove notification after 2 seconds
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 2000);
    }

    // Only run the script if the current site is not blacklisted
    if (!isBlacklistedSite()) {
        // Create copy button
        let copyButton = createButton('Copy', '20px');

        // Add click event listener for copy button
        copyButton.addEventListener('click', function() {
            let title = processTitle(document.title);
            let url = window.location.href;
            let copyText = `${title}\n${url}`;

            copyToClipboard(copyText);
        });

        // Create share button
        let shareButton = createButton('Share', '20px');
        shareButton.style.right = '145px';

        // Add click event listener for share button
        shareButton.addEventListener('click', function() {
            let title = processTitle(document.title);
            let url = window.location.href;
            let shareText = encodeURIComponent(title);
            let fanfouUrl = `https://fanfou.com/sharer/image?u=${encodeURIComponent(url)}&t=${shareText}`;

            // Calculate window size and position
            let width = 670;
            let height = 350;
            let left = (window.screen.width - width) / 2;
            let top = (window.screen.height - height) / 2;

            // Open a popup window without address bar and toolbar, centered on the screen
            window.open(fanfouUrl, 'fanfou_share', `width=${width},height=${height},left=${left},top=${top},location=no,menubar=no,toolbar=no,status=no,scrollbars=no,resizable=no`);
        });

        // Add buttons to the page
        document.body.appendChild(shareButton);
        document.body.appendChild(copyButton);

        // Add keyboard shortcut to toggle button visibility
        let buttonsVisible = true; // Track button visibility state

        document.addEventListener('keydown', function(event) {
            // Check for Shift + Ctrl + H
            if (event.shiftKey && event.ctrlKey && event.key === 'H') {
                event.preventDefault(); // Prevent default browser behavior

                buttonsVisible = !buttonsVisible; // Toggle state

                // Toggle visibility of both buttons
                copyButton.style.display = buttonsVisible ? 'block' : 'none';
                shareButton.style.display = buttonsVisible ? 'block' : 'none';

                // Show notification about the toggle action
                showNotification(buttonsVisible ? 'Buttons shown' : 'Buttons hidden');
            }
        });
    }
})();