// ==UserScript==
// @name         YouTube Live Chat @ Icon Handle To Input (Ultra Reliable, Esc+Delay Fix)
// @namespace    http://tampermonkey.net/
// @version      1.53
// @description  Adds @ icon next to each username in popout chat; click it to write the user's handle in the chat input (handles chat mode switch, scrolling, all cases)
// @match        https://www.youtube.com/live_chat*
// @grant        GM_xmlhttpRequest
// @connect      youtube.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534212/YouTube%20Live%20Chat%20%40%20Icon%20Handle%20To%20Input%20%28Ultra%20Reliable%2C%20Esc%2BDelay%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534212/YouTube%20Live%20Chat%20%40%20Icon%20Handle%20To%20Input%20%28Ultra%20Reliable%2C%20Esc%2BDelay%20Fix%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const handleCache = {};
    let lastMenuChannelLink = null;

    function fetchHandle(channelId, callback) {
        if (handleCache[channelId]) {
            callback(handleCache[channelId]);
            return;
        }
        const url = `https://www.youtube.com/channel/${channelId}/about`;
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                const html = response.responseText;
                const handleMatch = html.match(/www\.youtube\.com\/(@[A-Za-z0-9\-_]+)/);
                if (handleMatch && handleMatch[1]) {
                    handleCache[channelId] = handleMatch[1];
                    callback(handleMatch[1]);
                } else {
                    callback(null);
                }
            }
        });
    }

    function getMenuUsername() {
        const menu = document.querySelector('ytd-menu-popup-renderer[role="menu"]');
        if (menu) {
            const goToChannelItem = menu.querySelector('a[href*="/channel/"]');
            if (goToChannelItem) {
                return goToChannelItem.textContent.trim();
            }
        }
        return null;
    }

    function pressEscape() {
        const escEvent = new KeyboardEvent('keydown', {
            key: 'Escape',
            keyCode: 27,
            which: 27,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(escEvent);
    }

    function getChannelIdFromMenu(messageNode, expectedAuthor, callback) {
        pressEscape(); // Close any open menu
        setTimeout(() => {
            const menuBtn = messageNode.querySelector('#menu #menu-button button');
            if (!menuBtn) {
                callback(null);
                return;
            }
            menuBtn.click();

            // Wait a bit longer for the menu to update after click
            setTimeout(() => {
                let attempts = 0;
                function tryExtract() {
                    const menu = document.querySelector('ytd-menu-popup-renderer[role="menu"]');
                    if (menu) {
                        const channelLink = menu.querySelector('a[href*="/channel/"]');
                        const menuUsername = getMenuUsername();
                        if (channelLink) {
                            if (
                                channelLink.href !== lastMenuChannelLink ||
                                (menuUsername && menuUsername.toLowerCase() === expectedAuthor.toLowerCase()) ||
                                attempts > 3
                            ) {
                                lastMenuChannelLink = channelLink.href;
                                const match = channelLink.href.match(/\/channel\/([A-Za-z0-9_\-]+)/);
                                if (match) {
                                    pressEscape(); // Close menu after extracting
                                    callback(match[1]);
                                    return;
                                }
                            }
                        }
                    }
                    if (++attempts < 40) {
                        setTimeout(tryExtract, 50);
                    } else {
                        pressEscape();
                        callback(null);
                    }
                }
                tryExtract();
            }, 200); // <-- This delay is important for menu DOM update!
        }, 250); // <-- Increased delay after Escape for reliability
    }

    function writeHandleToInput(handle) {
        const inputDiv = document.querySelector('div#input[contenteditable]');
        if (inputDiv) {
            inputDiv.focus();
            document.execCommand('insertText', false, handle + ' ');
        } else {
            alert('Chat input not found!');
        }
    }

    function addAtIcons() {
        document.querySelectorAll('yt-live-chat-text-message-renderer').forEach(msg => {
            const authorSpan = msg.querySelector('#author-name');
            if (authorSpan && !authorSpan.dataset.atIconAdded) {
                const atIcon = document.createElement('span');
                atIcon.textContent = ' @';
                atIcon.title = 'Click to insert handle into chat input';
                atIcon.style.cursor = 'pointer';
                atIcon.style.color = '#e53935';
                atIcon.style.background = '#fff';
                atIcon.style.fontWeight = 'bold';
                atIcon.style.marginLeft = '6px';
                atIcon.style.marginRight = '2px';
                atIcon.style.userSelect = 'none';
                atIcon.style.borderRadius = '50%';
                atIcon.style.padding = '2px 6px 2px 6px';
                atIcon.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                atIcon.style.display = 'inline-block';
                atIcon.style.border = '1px solid #e53935';

                atIcon.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const expectedAuthor = authorSpan.childNodes[0].nodeValue.trim();
                    getChannelIdFromMenu(msg, expectedAuthor, function(channelId) {
                        if (channelId) {
                            fetchHandle(channelId, function(handle) {
                                if (handle) {
                                    writeHandleToInput(handle);
                                } else {
                                    alert('No handle found for channel: ' + channelId);
                                }
                            });
                        } else {
                            alert('Could not extract channel ID.');
                        }
                    });
                });

                authorSpan.appendChild(atIcon);
                authorSpan.dataset.atIconAdded = 'true';
            }
        });
    }

    setInterval(addAtIcons, 1000);

    function observeChatContainer() {
        const chatContainer = document.querySelector('yt-live-chat-item-list-renderer #items');
        if (chatContainer) {
            const observer = new MutationObserver(() => addAtIcons());
            observer.observe(chatContainer, { childList: true, subtree: true });
        }
    }

    function observeChatPanel() {
        const chatPanel = document.querySelector('yt-live-chat-item-list-renderer');
        if (chatPanel) {
            const panelObserver = new MutationObserver(() => {
                setTimeout(() => {
                    addAtIcons();
                    observeChatContainer();
                }, 100);
            });
            panelObserver.observe(chatPanel, { childList: true, subtree: false });
            observeChatContainer();
        } else {
            setTimeout(observeChatPanel, 500);
        }
    }

    addAtIcons();
    observeChatPanel();
})();
