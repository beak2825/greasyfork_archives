// ==UserScript==
// @name         Yodayo Chat Message Downloader
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  download logs
// @match        https://yodayo.com/tavern/chat/*
// @grant        none
// @license      unlicense
// @downloadURL https://update.greasyfork.org/scripts/503125/Yodayo%20Chat%20Message%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/503125/Yodayo%20Chat%20Message%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function downloadString(text, fileType, fileName) {
        const blob = new Blob([text], { type: fileType });

        const a = document.createElement('a');
        a.download = fileName;
        a.href = URL.createObjectURL(blob);
        a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => { URL.revokeObjectURL(a.href); }, 1500);
    }

    function createDownloadButton(targetDiv) {
        const button = document.createElement('button');
        button.innerHTML = '⬇️';
        button.style.marginLeft = '10px';
        button.style.cursor = 'pointer';

        targetDiv.appendChild(button);

        button.addEventListener('click', () => {

            const url = window.location.href;

            const id = url.split('/').slice(-2, -1)[0];

            const apiUrl = `https://api.yodayo.com/v1/chats/${id}/messages?limit=99999`;
            fetch(apiUrl, {
                method: 'GET',
                credentials: 'include'
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    const format = confirm("Do you want to download the messages in JSON format? Click 'Cancel' for plain text.");

                    if (format) {
                        const jsonString = JSON.stringify(data, null, 2);
                        const fileName = `${id}_messages.json`;
                        downloadString(jsonString, 'application/json', fileName);
                    } else {
                        const messages = data.messages.map(message => `${message.message_source}: ${message.message}`).join('\n\n\n');
                        const fileName = `${id}_messages.txt`;
                        downloadString(messages, 'text/plain', fileName);
                    }
                })
                .catch(error => {
                    console.error('Error fetching messages:', error);
                });
        });
    }

    const observer = new MutationObserver((mutations) => {
        const targetDiv = document.getElementsByClassName('flex portrait:hidden')[0];
        if (targetDiv) {
            createDownloadButton(targetDiv);
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
