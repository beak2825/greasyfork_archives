// ==UserScript==
// @name         亚马逊卖家大学视频下载
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  卖家大学视频下载
// @author       Yunxi
// @license       Yunxi
// @match        https://sellercentral.amazon.com/learn/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/491073/%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%8D%96%E5%AE%B6%E5%A4%A7%E5%AD%A6%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/491073/%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%8D%96%E5%AE%B6%E5%A4%A7%E5%AD%A6%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function showPopupMessage(message) {
        let messageBox = document.getElementById('customPopupMessage');
        if (!messageBox) {
            messageBox = document.createElement('div');
            messageBox.id = 'customPopupMessage';
            document.body.appendChild(messageBox);
            messageBox.style.position = 'fixed';
            messageBox.style.top = '20%';
            messageBox.style.right = '20%';
            messageBox.style.backgroundColor = '#4CAF50';
            messageBox.style.color = 'white';
            messageBox.style.padding = '20px';
            messageBox.style.borderRadius = '5px';
            messageBox.style.zIndex = '1001';
            messageBox.style.textAlign = 'center';
            messageBox.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            messageBox.style.display = 'none';
        }

        messageBox.textContent = message;
        messageBox.style.display = 'block';

        setTimeout(function() {
            messageBox.style.display = 'none';
        }, 2000);
    }

    function getDownloadFileName() {
        const titleElement = document.querySelector('h2[data-videoplayer="airy"]');
        if (titleElement) {
            return titleElement.textContent.replace(/[\x00-\x1F\x7F"*/:<>?\\|]+/g, '_') + '.mp4';
        } else {
            return 'video.mp4';
        }
    }

    function addButtonIfContentExists() {
        const videoElement = document.querySelector('div[id="airy-module-video"]');
        const titleElement = document.querySelector('h2[data-videoplayer="airy"]');
        if (videoElement && titleElement) {
            const videoLink = videoElement.getAttribute('data-src-chinese');
            if (!document.querySelector('#copyVideoLinkBtn') && videoLink) {
                addButtons(videoLink);
            }
        }
    }

    function addButtons(videoLink) {
        const copyButton = document.createElement('button');
        copyButton.id = 'copyVideoLinkBtn';
        copyButton.textContent = '复制视频链接';
        styleButton(copyButton, 'calc(50% - 30px)');

        copyButton.onclick = function() {
            navigator.clipboard.writeText(videoLink).then(() => {
                showPopupMessage('视频链接已复制!');
            }).catch(err => {
                console.error('Error copying text: ', err);
            });
        };

        const downloadButton = document.createElement('button');
        downloadButton.id = 'downloadVideoBtn';
        downloadButton.textContent = '下载视频';
        styleButton(downloadButton, 'calc(50% + 30px)');

        downloadButton.onclick = function() {
            GM_download(videoLink, getDownloadFileName());
        };

        document.body.appendChild(copyButton);
        document.body.appendChild(downloadButton);
    }

    function styleButton(button, topPosition) {
        button.style.position = 'fixed';
        button.style.right = '10px';
        button.style.top = topPosition;
        button.style.zIndex = '1000';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.padding = '10px 20px';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    }

    addButtonIfContentExists();

    const observer = new MutationObserver(addButtonIfContentExists);
    observer.observe(document.body, { childList: true, subtree: true });
})();
