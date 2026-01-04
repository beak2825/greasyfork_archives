// ==UserScript==
// @name         Fsm to qBittorrent
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  推送种子
// @author       LEIHOU
// @match        https://fsm.name/Torrents*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/494586/Fsm%20to%20qBittorrent.user.js
// @updateURL https://update.greasyfork.org/scripts/494586/Fsm%20to%20qBittorrent.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const qbittorrentUrl = 'http://IP:PORT';//修改替换
    const username = 'admin';//修改替换
    const password = 'adminadmin';//修改替换

    // Function to add torrent to qBittorrent
    function addToqBittorrent(url) {
        // Construct the API endpoint to add torrent
        const apiUrl = `${qbittorrentUrl}/api/v2/torrents/add`;

        // Prepare data to send
        const data = `urls=${encodeURIComponent(url)}`;

        // Prepare authentication header
        const auth = btoa(`${username}:${password}`);

        // Send request to qBittorrent API using GM_xmlhttpRequest
        GM_xmlhttpRequest({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data,
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    // Show success message
                    showMessage('Successfully added to qBittorrent!', 'green');
                } else {
                    // Show error message
                    showMessage('Failed to add to qBittorrent. Please try again.', 'red');
                }
            },
            onerror: function(error) {
                console.error('Error:', error);
                // Show error message
                showMessage('An error occurred. Please check console logs.', 'red');
            }
        });
    }

    // Function to create push download button
    function createPushDownloadButton(downloadButton) {
        const pushDownloadButton = document.createElement('button');
        pushDownloadButton.setAttribute('type', 'button');
        pushDownloadButton.setAttribute('aria-disabled', 'false');
        pushDownloadButton.classList.add('el-button', 'el-button--primary', 'is-plain', 'is-circle');
        pushDownloadButton.style.marginRight = '10px';

        const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        iconSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        iconSvg.setAttribute('viewBox', '0 0 1024 1024');

        const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        iconPath.setAttribute('fill', 'currentColor');
        iconPath.setAttribute('d', 'M104.704 685.248a64 64 0 0 0 90.496 0l316.8-316.8 316.8 316.8a64 64 0 0 0 90.496-90.496L557.248 232.704a64 64 0 0 0-90.496 0L104.704 594.752a64 64 0 0 0 0 90.496z');

        iconSvg.appendChild(iconPath);
        pushDownloadButton.appendChild(iconSvg);

        pushDownloadButton.addEventListener('click', function() {
            const downloadUrl = downloadButton.href;
            console.log('Download URL:', downloadUrl);
            addToqBittorrent(downloadUrl);
        });

        // Insert the push download button before the original download button
        downloadButton.parentNode.insertBefore(pushDownloadButton, downloadButton);
    }

    // Function to show message
    function showMessage(message, color) {
        const messageBox = document.createElement('div');
        messageBox.textContent = message;
        messageBox.style.position = 'fixed';
        messageBox.style.top = '50%';
        messageBox.style.left = '50%';
        messageBox.style.transform = 'translate(-50%, -50%)';
        messageBox.style.background = color;
        messageBox.style.color = '#fff';
        messageBox.style.padding = '10px 20px';
        messageBox.style.borderRadius = '5px';
        messageBox.style.zIndex = '9999';
        document.body.appendChild(messageBox);

        // Remove message box after 1 second
        setTimeout(function() {
            messageBox.remove();
        }, 1000);
    }

    // Function to handle mutation events
    function handleMutations(mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const downloadButton = node.querySelector('div.el-row.is-align-middle > div.el-col.el-col-2.el-col-xs-0.is-guttered.txt-right > div > div:nth-child(1) > a');
                        if (downloadButton) {
                            createPushDownloadButton(downloadButton);
                        }
                    }
                });
            }
        }
    }

    // Start observing mutations on the target node
    const targetNode = document.querySelector('#app > div > section > main > div > div.el-col.el-col-24.el-col-xs-24.el-col-sm-20.el-col-md-18.el-col-lg-18.el-col-xl-18');
    if (targetNode) {
        const observer = new MutationObserver(handleMutations);
        observer.observe(targetNode, { childList: true, subtree: true });
    } else {
        console.error('Target node not found!');
    }
})();
