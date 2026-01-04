// ==UserScript==
// @name         Action Tracker
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Open a preview of Google Sheet cells A1:B12 from the 'Actions' sheet with a draggable floating button that adjusts position based on screen edges
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501325/Action%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/501325/Action%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!window.location.hostname.includes('discord.com')) {
        return;
    }

    const googleSheetURL = 'https://docs.google.com/spreadsheets/d/1MhyINJvqCGAOjVOqsnMyHMM39Novbwe-ufb1d-qosEA/edit?gid=952423#gid=952423';

    const button = document.createElement('div');
    button.innerHTML = '<span style="font-size: 35px; font-weight: bold;">+</span>';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.width = '40px';
    button.style.height = '40px';
    button.style.backgroundColor = 'blue';
    button.style.color = 'white';
    button.style.borderRadius = '50%';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.cursor = 'pointer';
    button.style.zIndex = '1000';

    const iframe = document.createElement('iframe');
    iframe.src = googleSheetURL;
    iframe.style.position = 'fixed';
    iframe.style.width = '250px';
    iframe.style.height = '450px';
    iframe.style.border = '1px solid #ccc';
    iframe.style.display = 'none';
    iframe.style.zIndex = '1000';

    function adjustIframePosition() {
        const buttonRect = button.getBoundingClientRect();
        const iframeWidth = parseInt(iframe.style.width, 10);
        const iframeHeight = parseInt(iframe.style.height, 10);
        const margin = 20;

        let iframeLeft, iframeTop;

        if (buttonRect.right + iframeWidth + margin > window.innerWidth) {
            iframeLeft = buttonRect.left - iframeWidth - margin;
        } else {
            iframeLeft = buttonRect.right + margin;
        }

        if (buttonRect.bottom + iframeHeight + margin > window.innerHeight) {
            iframeTop = buttonRect.top - iframeHeight - margin;
        } else {
            iframeTop = buttonRect.bottom + margin;
        }

        iframe.style.left = `${Math.max(0, iframeLeft)}px`;
        iframe.style.top = `${Math.max(0, iframeTop)}px`;
    }

    let isDragging = false;
    let startX, startY, startRight, startBottom;

    button.addEventListener('mousedown', function(e) {
        e.preventDefault();
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startRight = parseInt(button.style.right, 10);
        startBottom = parseInt(button.style.bottom, 10);

        function mouseMoveHandler(e) {
            if (isDragging) {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                button.style.right = `${startRight - dx}px`;
                button.style.bottom = `${startBottom - dy}px`;
                adjustIframePosition();
            }
        }

        function mouseUpHandler() {
            isDragging = false;
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        }

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    });

    button.addEventListener('click', function() {
        if (iframe.style.display === 'none') {
            iframe.style.display = 'block';
            adjustIframePosition();
        } else {
            iframe.style.display = 'none';
        }
    });

    document.body.appendChild(button);
    document.body.appendChild(iframe);

})();
