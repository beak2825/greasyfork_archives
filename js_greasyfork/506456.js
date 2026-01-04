// ==UserScript==
// @name         KoGaMa: Export direct messages
// @namespace    github.com/deutschsimmy
// @version      1.5
// @description  Quick and simple script to export your private messages into a textfile.
// @author       ⛧ simmy
// @match        *://www.kogama.com/*
// @grant        unsafeWindow
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/506456/KoGaMa%3A%20Export%20direct%20messages.user.js
// @updateURL https://update.greasyfork.org/scripts/506456/KoGaMa%3A%20Export%20direct%20messages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let chatData = null;

    function addExportButton() {
        const targetElement = document.querySelector('.F3PyX');
        if (targetElement && !document.querySelector('.export-btn')) {
            const exportButton = document.createElement('button');
            exportButton.className = 'export-btn';
            exportButton.title = 'Export chat history to a text file. In case it does not work close and reopen the chat.';
            exportButton.style.width = '30px';
            exportButton.style.height = '30px';
            exportButton.style.background = 'url(https://i.imgur.com/hG5QwIl.gif) center center / 16px 16px no-repeat';
            exportButton.style.border = 'none';
            exportButton.style.cursor = 'pointer';
            exportButton.style.position = 'absolute';
            exportButton.style.top = '50%';
            exportButton.style.right = '37px';
            exportButton.style.transform = 'translateY(-50%)';
            targetElement.style.position = 'relative';
            targetElement.appendChild(exportButton);

            exportButton.addEventListener('click', function() {
                exportChatHistory();
            });
        }
    }

    function exportChatHistory() {
        if (chatData) {
            chatData.reverse();
            let formattedChat = chatData.map(message => {
                const timestamp = new Date(message.created).toLocaleString();
                return `[ ${timestamp} ] ${message.from_username}: ${message.message}`;
            }).join('\n');
            formattedChat = formattedChat.replace(/\n{2,}/g, '\n');
            const filename = `${chatData[0].to_profile_id}.txt`;
            const blob = new Blob([formattedChat], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = filename;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
        } else {
            console.error('No chat data found');
        }
    }
    function monitorRequests() {
        const originalOpen = unsafeWindow.XMLHttpRequest.prototype.open;
        const originalSend = unsafeWindow.XMLHttpRequest.prototype.send;

        unsafeWindow.XMLHttpRequest.prototype.open = function(method, url) {
            this._url = url;
            originalOpen.apply(this, arguments);
        };
        unsafeWindow.XMLHttpRequest.prototype.send = function(body) {
            this.addEventListener('load', function() {
                if (this._url.includes('/chat/') && this._url.includes('/history/')) {
                    const urlParts = this._url.split('/');
                    const selfId = urlParts[4];
                    const friendId = urlParts[6];

                    console.log('Detected chat history request:', selfId, friendId);

                    if (this.responseType === '' || this.responseType === 'text') {
                        chatData = JSON.parse(this.responseText).data;
                    } else if (this.responseType === 'json') {
                        chatData = this.response.data;
                    }

                    addExportButton();
                }
            });

            originalSend.apply(this, arguments);
        };
    }

    monitorRequests();

})();
