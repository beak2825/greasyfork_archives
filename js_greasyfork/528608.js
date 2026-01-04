// ==UserScript==
// @name         URL in the corner with dragable layout
// @version      1.3
// @description  URL layout with drag function and double tap to copy with feedback
// @author       L.M.M
// @match        *://*/*
// @grant        none
// @namespace https://greasyfork.org/users/1437292
// @downloadURL https://update.greasyfork.org/scripts/528608/URL%20in%20the%20corner%20with%20dragable%20layout.user.js
// @updateURL https://update.greasyfork.org/scripts/528608/URL%20in%20the%20corner%20with%20dragable%20layout.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        let urlBox = document.getElementById('urlOverlay');
        if (!urlBox) {
            urlBox = document.createElement('div');
            urlBox.id = 'urlOverlay';
            urlBox.style.position = 'fixed';
            urlBox.style.bottom = '10px';
            urlBox.style.right = '10px';
            urlBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            urlBox.style.color = 'white';
            urlBox.style.padding = '5px 10px';
            urlBox.style.fontSize = '12px';
            urlBox.style.fontFamily = 'Arial, sans-serif';
            urlBox.style.zIndex = '9999';
            urlBox.style.borderRadius = '5px';
            urlBox.style.maxWidth = '50%';
            urlBox.style.wordWrap = 'break-word';
            urlBox.style.cursor = 'grab';
            urlBox.style.userSelect = 'none';
            document.body.appendChild(urlBox);
        }

        let copyFeedback = document.createElement('div');
        copyFeedback.id = 'copyFeedback';
        copyFeedback.style.position = 'fixed';
        copyFeedback.style.bottom = '35px';
        copyFeedback.style.right = '10px';
        copyFeedback.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        copyFeedback.style.color = 'white';
        copyFeedback.style.padding = '5px 10px';
        copyFeedback.style.fontSize = '12px';
        copyFeedback.style.fontFamily = 'Arial, sans-serif';
        copyFeedback.style.borderRadius = '5px';
        copyFeedback.style.zIndex = '10000';
        copyFeedback.style.display = 'none';
        copyFeedback.textContent = 'URL copied!';
        document.body.appendChild(copyFeedback);

        function updateURL() {
            urlBox.textContent = window.location.href;
        }

        function copyURL() {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(window.location.href).then(() => {
                    showCopyFeedback();
                });
            }
        }

        function showCopyFeedback() {
            copyFeedback.style.display = 'block';
            setTimeout(() => {
                copyFeedback.style.display = 'none';
            }, 1500);
        }

        let isDragging = false;
        let startX, startY, initialTop, initialLeft;
        let lastTapTime = 0;
        const doubleTapThreshold = 300;

        urlBox.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            isDragging = true;
            urlBox.style.cursor = 'grabbing';
            startX = touch.clientX;
            startY = touch.clientY;
            const rect = urlBox.getBoundingClientRect();
            initialTop = rect.top;
            initialLeft = rect.left;
        });

        urlBox.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const touch = e.touches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;
            urlBox.style.top = `${initialTop + deltaY}px`;
            urlBox.style.left = `${initialLeft + deltaX}px`;
            urlBox.style.bottom = 'auto';
            urlBox.style.right = 'auto';

            copyFeedback.style.top = `${initialTop + deltaY - 30}px`;
            copyFeedback.style.left = `${initialLeft + deltaX}px`;
            copyFeedback.style.bottom = 'auto';
            copyFeedback.style.right = 'auto';
        });

        urlBox.addEventListener('touchend', (e) => {
            if (isDragging) {
                isDragging = false;
                urlBox.style.cursor = 'grab';
                const touch = e.changedTouches[0];
                const deltaX = Math.abs(touch.clientX - startX);
                const deltaY = Math.abs(touch.clientY - startY);

                if (deltaX < 5 && deltaY < 5) {
                    const currentTime = new Date().getTime();
                    if (currentTime - lastTapTime < doubleTapThreshold) {
                        copyURL();
                    }
                    lastTapTime = currentTime;
                }
            }
        });

        updateURL();

        const observer = new MutationObserver(() => {
            if (urlBox.textContent !== window.location.href) {
                updateURL();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        window.addEventListener('popstate', updateURL);
        window.addEventListener('hashchange', updateURL);
    });
})();