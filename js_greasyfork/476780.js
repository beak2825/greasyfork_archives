// ==UserScript==
// @name         TORN │ Better Chats
// @namespace    http://tampermonkey.net/
// @version      1.4.42
// @description  Slightly changes the appearance of chats on torn.com for the better.
// @author       BOSSx [2718742]
// @match        https://www.torn.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476780/TORN%20%E2%94%82%20Better%20Chats.user.js
// @updateURL https://update.greasyfork.org/scripts/476780/TORN%20%E2%94%82%20Better%20Chats.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractUserXID() {
        const xidElement = document.querySelector('.menu-value___gLaLR');
        if (xidElement) {
            const href = xidElement.getAttribute('href');
            if (href) {
                const xidMatch = href.match(/\/profiles.php\?XID=([A-Za-z0-9]+)/);
                if (xidMatch && xidMatch[1]) {
                    return xidMatch[1];
                }
            }
        }
        return null;
    }

    const myXID = extractUserXID();

    function styleLinksInsideChatContainers() {
        const containers = document.querySelectorAll('body');
        containers.forEach(container => {
            const links = container.querySelectorAll('._overview_1pskg_893 a, ._message_1pskg_509 a');
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.includes('http')) {
                    link.style.color = '#66c2ff';
                    link.style.textDecoration = 'underline';
                } else if (href && href.includes('/profiles.php?XID=')) {
                    const xid = href.match(/XID=([A-Za-z0-9]+)/);
                    if (xid && xid[1]) {
                        if (xid[1] === myXID) {
                            link.style.color = '#80ff80';
                        } else {
                            link.style.color = '#ff4d4d';
                        }
                    }
                } else {
                    link.style.color = '#0099FF';
                    link.style.textDecoration = 'underline';
                }
            });
        });
    }

    function addMessageDividers() {
        const messageContainers = document.querySelectorAll('._message_1pskg_509');
        messageContainers.forEach(container => {
            container.style.borderTop = '1px solid #666';
            container.style.paddingTop = '5px';
        });
    }

    function addDiscordButtonToHeader() {
        const headerWrapperTop = document.querySelector('.header-wrapper-top');
        if (headerWrapperTop) {
            const discordContainer = document.createElement('div');
            discordContainer.style.position = 'absolute';
            discordContainer.style.top = '0';
            discordContainer.style.left = '5';
            discordContainer.style.zIndex = '9999';

            const discordButton = document.createElement('a');
            discordButton.href = 'https://discord.gg/N5xSNNRf8c';
            discordButton.target = '_blank';

            const discordImage = document.createElement('img');
            discordImage.src = 'https://cdn.discordapp.com/attachments/762927301108695141/1159242060348542996/discordtornlogo.png';
            discordImage.alt = 'Discord';
            discordImage.width = '72';
            discordImage.height = '72';

            discordButton.appendChild(discordImage);
            discordContainer.appendChild(discordButton);
            headerWrapperTop.appendChild(discordContainer);
        }
    }

    function checkForNewMessages() {
        styleLinksInsideChatContainers();
        addMessageDividers();
    }

    addDiscordButtonToHeader();
    setInterval(checkForNewMessages, 500);
})();
