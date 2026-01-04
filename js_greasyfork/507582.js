// ==UserScript==
// @name         URL Page ID Manipulator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Parse URL and manipulate page ID. Licensed under LGPL.
// @match        *://*/*
// @license      LGPL
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507582/URL%20Page%20ID%20Manipulator.user.js
// @updateURL https://update.greasyfork.org/scripts/507582/URL%20Page%20ID%20Manipulator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 解析 URL
    function parseURL(url) {
        const regex = /^(.*?)(\d+)(\.[a-z]+)$/;
        const match = url.match(regex);
        if (match) {
            return {
                frontURL: match[1],
                pageID: parseInt(match[2]),
                backURL: match[3]
            };
        }
        return null;
    }

    // 更新页面 ID 显示
    function updatePageIDDisplay(pageID) {
        const style = document.createElement('style');
        style.textContent = `
           .page-id-display {
                position: fixed;
                bottom: 0;
                right: 0;
                font-size: 36px;
                color: orange;
            }
        `;
        document.head.appendChild(style);
        let displayElement = document.querySelector('.page-id-display');
        if (!displayElement) {
            displayElement = document.createElement('div');
            displayElement.classList.add('page-id-display');
            document.body.appendChild(displayElement);
        }
        displayElement.textContent = pageID;
    }

    // 监听按键事件
    document.addEventListener('keydown', function(event) {
        const urlData = parseURL(window.location.href);
        if (urlData) {
            if (event.ctrlKey && event.key === 'ArrowRight') {
                urlData.pageID++;
                window.location.href = urlData.frontURL + urlData.pageID + urlData.backURL;
            } else if (event.ctrlKey && event.key === 'ArrowLeft') {
                urlData.pageID--;
                window.location.href = urlData.frontURL + urlData.pageID + urlData.backURL;
            }
        }
    });

    const urlData = parseURL(window.location.href);
    if (urlData) {
        updatePageIDDisplay(urlData.pageID);
    }
})();