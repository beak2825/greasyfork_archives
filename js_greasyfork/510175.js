// ==UserScript==
// @name         MiniWindow
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Creates a resizeable window on your current tab that displays any website you want!
// @author       iCottage
// @match        *://*/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/510175/MiniWindow.user.js
// @updateURL https://update.greasyfork.org/scripts/510175/MiniWindow.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const createWindow = (url) => {
        const win = document.createElement('div');
        win.style.width = '400px';
        win.style.height = '300px';
        win.style.position = 'fixed';
        win.style.top = '50px';
        win.style.left = '50px';
        win.style.border = '1px solid #ccc';
        win.style.backgroundColor = '#fff';
        win.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        win.style.zIndex = '10000';
        win.style.overflow = 'hidden'

        const topBar = document.createElement('div');
        topBar.style.backgroundColor = '#007BFF';
        topBar.style.color = '#fff';
        topBar.style.padding = '10px';
        topBar.style.cursor = 'move';
        topBar.style.display = 'flex';
        topBar.style.alignItems = 'center';
        topBar.style.justifyContent = 'space-between';
        topBar.style.overflow = 'hidden';

        const urlInput = document.createElement('input');
        urlInput.type = 'text';
        urlInput.value = url;
        urlInput.style.flex = '1';
        urlInput.style.border = 'none';
        urlInput.style.padding = '5px';
        urlInput.style.borderRadius = '3px';
        urlInput.style.marginRight = '10px';
        urlInput.style.outline = 'none';

        urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const newUrl = urlInput.value;
                iframe.src = newUrl.startsWith('http') ? newUrl : 'http://' + newUrl;
                title.textContent = newUrl;
            }
        });

        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.color = '#fff';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = () => win.remove();
        topBar.appendChild(urlInput);
        topBar.appendChild(closeButton);

        win.appendChild(topBar);

        const iframe = document.createElement('iframe');
        iframe.src = url.startsWith('http') ? url : 'http://' + url;
        iframe.style.width = '100%';
        iframe.style.height = 'calc(100% - 40px)';
        iframe.style.border = 'none';
        win.appendChild(iframe);

        const resizeHandle = document.createElement('div');
        resizeHandle.style.width = '15px';
        resizeHandle.style.height = '15px';
        resizeHandle.style.backgroundColor = '#ccc';
        resizeHandle.style.cursor = 'nwse-resize';
        resizeHandle.style.position = 'absolute';
        resizeHandle.style.bottom = '0';
        resizeHandle.style.right = '0';

        win.appendChild(resizeHandle);

        document.body.appendChild(win);

        let isDragging = false;
        let offsetX, offsetY;

        topBar.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - win.getBoundingClientRect().left;
            offsetY = e.clientY - win.getBoundingClientRect().top;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                win.style.left = `${e.clientX - offsetX}px`;
                win.style.top = `${e.clientY - offsetY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        let isResizing = false;

        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (isResizing) {
                const newWidth = e.clientX - win.getBoundingClientRect().left;
                const newHeight = e.clientY - win.getBoundingClientRect().top;
                if (newWidth > 150 && newHeight > 100) {
                    win.style.width = `${newWidth}px`;
                    win.style.height = `${newHeight}px`;
                    iframe.style.height = `calc(${newHeight}px - 40px)`;
                }
            }
        });

        document.addEventListener('mouseup', () => {
            isResizing = false;
        });
    };

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'E') {
            const url = prompt('Enter a full URL to load (include http:// or https://):');
            if (url) {
                createWindow(url);
            }
        }
    });
})();