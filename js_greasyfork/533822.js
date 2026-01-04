// ==UserScript==
// @name         MediathequeRoubaix Book Info Copier
// @namespace    http://tampermonkey.net/
// @version      2025-04-29
// @description  Add a button to copy book information from the Médiathèque de Roubaix
// @author       Tom
// @license      MIT
// @match        http*://www.mediathequederoubaix.fr/osiros/result/notice.php*
// @icon         http://www.mediathequederoubaix.fr/favicon.ico
// @grant        GM_setClipboard
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/533822/MediathequeRoubaix%20Book%20Info%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/533822/MediathequeRoubaix%20Book%20Info%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // First check if this is actually a book page by looking for key elements
    const titleElement = document.querySelector('h1');
    const authorElement = document.querySelector('.col-md-12 a b');
    const descriptionElement = document.querySelector('.col-md-12 > p');

    // Only proceed if we have the essential elements that indicate this is a book page
    if (titleElement && (authorElement || descriptionElement)) {
        // Create a button element
        const button = document.createElement('button');
        button.textContent = '📋';
        button.title = 'Copy Book Info';
        button.style.cssText = 'margin-left: 10px; padding: 5px 8px; background-color: transparent; color: #333; border: none; border-radius: 4px; cursor: pointer; vertical-align: middle; font-size: 32px; transition: background-color 0.2s;';

        // Add hover effect
        button.addEventListener('mouseover', function() {
            this.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        });
        button.addEventListener('mouseout', function() {
            this.style.backgroundColor = 'transparent';
        });

        // Add click event handler
        button.addEventListener('click', function() {
            try {
                // Extract book information
                const bookInfo = extractBookInfo();

                // Copy to clipboard (notification will be shown by the callback)
                copyToClipboard(bookInfo);
            } catch (error) {
                console.error('Error in book info extraction:', error);
                showNotification('Error: Failed to extract book information!', true);
            }
        });

        // Append the button next to the title
        titleElement.appendChild(button);
    }

    // Function to extract book information
    function extractBookInfo() {
        let title = '';
        let author = '';
        let description = '';
        let link = '';

        try {
            // Extract title (only text subelements, removing the icon and extra spaces)
            const titleElement = document.querySelector('h1');
            if (titleElement) {
                for (let node of titleElement.childNodes) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        title += node.textContent;
                    }
                }
                title = title.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
            }

            // Extract author (remove dates and extra info in parentheses)
            const authorElement = document.querySelector('.col-md-12 a b');
            if (authorElement) {
                author = authorElement.textContent.replace(/\(\d{4}-....\)/, '').trim();
            }

            // Extract description
            const descriptionElement = document.querySelector('.col-md-12 > p');
            if (descriptionElement) {
                description = descriptionElement.textContent.replaceAll("­", "").trim();
            }

            // Extract permalink
            const permalinkElement = document.getElementById('contain_permalien');
            if (permalinkElement) {
                link = permalinkElement.textContent.trim();
            }
        } catch (error) {
            console.error('Error extracting book information:', error);
        }

        // Format the extracted information
        const formattedInfo =
              `${title} - ${author}\n` +
              `[Roubaix](${link})\n` +
              `> ${description}\n`;

        return formattedInfo;
    }

    // Function to copy text to clipboard and show notification
    function copyToClipboard(text) {
        // Use GM_setClipboard with callback for notification
        GM_setClipboard(text, "text", function() {
            showNotification('Copied!');
        });
    }

    // Function to show a notification
    function showNotification(message, isError = false) {
        // Get button position to place notification next to it
        const button = document.querySelector('h1 button');
        if (!button) return;

        const buttonRect = button.getBoundingClientRect();

        const notification = document.createElement('div');
        notification.textContent = message;
        const bgColor = isError ? 'rgba(200, 50, 50, 0.8)' : 'rgba(50, 200, 50, 0.8)';
        notification.style.cssText = `
            position: absolute;
            left: ${buttonRect.right + 10}px;
            top: ${buttonRect.top}px;
            z-index: 9999;
            padding: 4px 8px;
            background-color: ${bgColor};
            color: white;
            border-radius: 4px;
            transition: opacity 0.5s;
            font-size: 14px;
        `;
        document.body.appendChild(notification);

        // Fade out
        setTimeout(function() {
            notification.style.opacity = '0';
            setTimeout(function() {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 1000);
    }
})();