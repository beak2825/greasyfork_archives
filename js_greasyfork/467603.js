// ==UserScript==
// @name         Artstation get Images links to Download
// @namespace    Violentmonkey Scripts
// @version      1.0.5
// @description  Add a button to copy all image links at Artstation page for bulk download or download.
// @author       Wizzergod
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.artstation.com
// @match        https://*.artstation.*/*/*
// @exclude      https://*.artstation.*/marketplace/*
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467603/Artstation%20get%20Images%20links%20to%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/467603/Artstation%20get%20Images%20links%20to%20Download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function copyLinksToClipboard() {
        var links = Array.from(document.querySelectorAll('a[download]')).map(link => link.href);
        var linksText = links.join('\n');
        navigator.clipboard.writeText(linksText)
            .then(() => {
                showNotification('Links copied to clipboard!', 'Copy', 'Download');
            })
            .catch(error => {
                console.error('Error copying links to clipboard:', error);
            });
    }

    function downloadLinks() {
        var links = Array.from(document.querySelectorAll('a[download]')).map(link => link.href);
        links.forEach(link => {
            var anchor = document.createElement('a');
            anchor.href = link;
            anchor.download = '';
            anchor.target = '_blank';
            anchor.click();
        });
        showNotification('Downloading images...', '', '');
    }

    function showNotification(message, button1Text, button2Text) {
        var notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 10px;
            background-color: #fff;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            z-index: 9999;
        `;

        var messageElement = document.createElement('span');
        messageElement.innerText = message;
        notification.appendChild(messageElement);

        if (button1Text) {
            var button1 = document.createElement('button');
            button1.innerText = button1Text;
            button1.style.marginLeft = '10px';
            button1.addEventListener('click', function() {
                if (button1Text === 'Copy') {
                    copyLinksToClipboard();
                } else if (button1Text === 'Download') {
                    downloadLinks();
                }
                document.body.removeChild(notification);
            });
            notification.appendChild(button1);
        }

        if (button2Text) {
            var button2 = document.createElement('button');
            button2.innerText = button2Text;
            button2.style.marginLeft = '10px';
            button2.addEventListener('click', function() {
                downloadLinks();
                document.body.removeChild(notification);
            });
            notification.appendChild(button2);
        }

        document.body.appendChild(notification);

        setTimeout(function() {
            document.body.removeChild(notification);
        }, 6000);
    }

    var copyButton = document.createElement('button');
    copyButton.innerText = 'Get Links';
    copyButton.className = 'bs-btn bs-btn-primary';
    copyButton.style.cssText = `
        padding: 10px 20px 10px 16px;
        border-radius: 8px;
        display: flex;
        flex-direction: row;
        font-weight: 500;
        gap: 8px;
        justify-content: flex-start;
        line-height: 100%;
        color: black; /* Set the text color to black */
    `;

    var targetElement = document.querySelector('ul.menu-level-1-buttons.sm-gap-medium');
    var listItem = document.createElement('li');
    listItem.style.listStyle = 'none'; // Remove the dot style
    listItem.appendChild(copyButton);
    targetElement.appendChild(listItem);

    copyButton.addEventListener('click', function() {
        showNotification('Choose an action:', 'Copy', 'Download');
    });
})();
