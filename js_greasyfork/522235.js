// ==UserScript==
// @name         Copy PTP Forum User Link with Advanced Settings
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Adds a button to copy PTP user link text with advanced settings for BBCode and auto-paste options.
// @author       darisk
// @match        https://passthepopcorn.me/forums.php*
// @match        https://passthepopcorn.me/torrents.php?id=*
// @match        https://passthepopcorn.me/user.php?id=*
// @icon         https://passthepopcorn.me/favicon.ico
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_openInTab
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/522235/Copy%20PTP%20Forum%20User%20Link%20with%20Advanced%20Settings.user.js
// @updateURL https://update.greasyfork.org/scripts/522235/Copy%20PTP%20Forum%20User%20Link%20with%20Advanced%20Settings.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = new URL(window.location.href);

    // Check for allowed page types
    const isViewThread = url.pathname === '/forums.php' && url.searchParams.get('action') === 'viewthread';
    const isTorrentPage = url.pathname === '/torrents.php' && url.searchParams.has('id');
    const isUserPage = url.pathname === '/user.php' && url.searchParams.has('id');

    if (!isViewThread && !isTorrentPage && !isUserPage) {
        return; // Exit if the page is not one of the allowed types
    }

    // Add logic specific to each page type
    if (isViewThread) {
        console.log('Running script on forums thread page');
    }

    if (isTorrentPage) {
        console.log('Running script on torrent page');
    }

    if (isUserPage) {
        console.log('Running script on user page');

        const usernameElement = document.querySelector('h2.page__title');
        if (!usernameElement) {
            console.error('Username element not found!');
            return;
        }

        const username = usernameElement.textContent.trim();
        const pageLink = url.href;

        const span = document.createElement('span');
        span.textContent = '📋';
        span.classList.add('copy-ptp-button');
        span.style.cursor = 'pointer';
        span.style.marginRight = '6px';
        span.style.fontSize = '16px';
        span.style.color = 'green';
        span.style.verticalAlign = 'middle';

        span.addEventListener('click', () => {
            const formattedText = settings.useBBCode
            ? `[url=${pageLink}]@${username}[/url]`
            : `@${username}`;

        GM_setClipboard(formattedText, { type: 'text/plain' });

        span.textContent = '✔';

        setTimeout(() => {
            span.textContent = '📋';
        }, 1500);
    });

    usernameElement.insertBefore(span, usernameElement.firstChild);
}

    // Default settings
    const defaultSettings = {
        useBBCode: false,
        autoPaste: false,
    };

    // Load settings
    const settings = {
        useBBCode: GM_getValue('useBBCode', defaultSettings.useBBCode),
        autoPaste: GM_getValue('autoPaste', defaultSettings.autoPaste),
    };

    // Save settings
    function saveSettings() {
        GM_setValue('useBBCode', settings.useBBCode);
        GM_setValue('autoPaste', settings.autoPaste);
    }

    // Open settings dialog
    function openSettingsDialog() {
        const dialogHTML = `
        <div id="tampermonkey-settings-dialog">
            <h2>Settings</h2>
            <label>
                <input type="checkbox" id="bbcode-toggle" ${settings.useBBCode ? 'checked' : ''}>
                Enable BBCode Mode
            </label>
            <br>
            <label>
                <input type="checkbox" id="autopaste-toggle" ${settings.autoPaste ? 'checked' : ''}>
                Enable Auto-Paste Mode
            </label>
            <br><br>
            <button id="save-settings-button">Save</button>
        </div>
        `;

        const dialogStyle = `
        #tampermonkey-settings-dialog {
            position: fixed;
            top: 15%;
            left: 80%;
            transform: translate(-50%, -50%);
            background: black;
            padding: 10px;
            border: 2px solid #888;
            border-radius: 8px;
            box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
            z-index: 9999;
        }
        #tampermonkey-settings-dialog h2 {
            margin-top: 0;
        }
        #tampermonkey-settings-dialog button {
            padding: 5px 10px;
            background: #0d12bb;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        #tampermonkey-settings-dialog button:hover {
            background: #0056b3;
        }
        `;

        GM_addStyle(dialogStyle);

        const dialogContainer = document.createElement('div');
        dialogContainer.innerHTML = dialogHTML;
        document.body.appendChild(dialogContainer);

        document.getElementById('save-settings-button').addEventListener('click', () => {
            settings.useBBCode = document.getElementById('bbcode-toggle').checked;
            settings.autoPaste = document.getElementById('autopaste-toggle').checked;
            saveSettings();
            dialogContainer.remove();
        });
    }

    GM_registerMenuCommand('Settings', openSettingsDialog);

    function createCopyButton(linkElement) {
        if (linkElement.previousSibling?.classList?.contains('copy-ptp-button')) {
            return;
        }

        const span = document.createElement('span');
        span.textContent = '📋';
        span.classList.add('copy-ptp-button');
        span.style.cursor = 'pointer';
        span.style.marginLeft = '4px';
        span.style.marginRight = '3px';
        span.style.fontSize = '12px';
        span.style.color = 'green';
        span.style.verticalAlign = 'middle';

        span.addEventListener('click', () => {
            const linkText = linkElement.textContent.trim();
            const linkHref = new URL(linkElement.getAttribute('href'), window.location.origin).href;
            const formattedText = settings.useBBCode
            ? `[url=${linkHref}]@${linkText}[/url]`
                : `@${linkText}`;

            GM_setClipboard(formattedText, { type: 'text/plain' });

            if (settings.autoPaste) {
                const textarea = document.getElementById('quickpost');
                if (textarea) {
                    textarea.value += formattedText;
                    textarea.focus();
                }
            }

            span.textContent = '✔';
            setTimeout(() => {
                span.textContent = '📋';
            }, 1500);
        });

        linkElement.parentNode.insertBefore(span, linkElement);
    }

    function processForumPosts() {
        const postHeadings = document.querySelectorAll('div.forum-post__heading');

        postHeadings.forEach(heading => {
            const usernameLink = heading.querySelector('a.username');
            if (usernameLink) {
                createCopyButton(usernameLink);
            }
        });
    }

    function observeDOM() {
        const observer = new MutationObserver(() => {
            processForumPosts();
        });

        observer.observe(document.body, { childList: true, subtree: true });

        processForumPosts();
    }

    observeDOM();
})();
