// ==UserScript==
// @name         探索者视角
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Preview links by hovering and pressing 'F' on Discourse forums
// @author       Your Name
// @match        https://linux.do/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493229/%E6%8E%A2%E7%B4%A2%E8%80%85%E8%A7%86%E8%A7%92.user.js
// @updateURL https://update.greasyfork.org/scripts/493229/%E6%8E%A2%E7%B4%A2%E8%80%85%E8%A7%86%E8%A7%92.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const iframeContainer = document.createElement('div');
    iframeContainer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; display: none; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.5); z-index: 9999;';
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'width: 90vw; height: 80vh; border: none; background: white;';
    iframeContainer.appendChild(iframe);
    document.body.appendChild(iframeContainer);

    let currentHoveredLink = null;
    let keyDown = false;
    let longPressTimer = null;
    const longPressDuration = 500; // Time in milliseconds to qualify as a long press

    document.addEventListener('keydown', function(event) {
        if (event.key === 'F' || event.key === 'f') { // Only activate if 'F' key is pressed
            keyDown = true;
            if (currentHoveredLink) {
                iframe.src = currentHoveredLink.href;
                iframeContainer.style.display = 'flex';
            }
        }
    });

    document.addEventListener('keyup', function(event) {
        if (event.key === 'F' || event.key === 'f') { // Only deactivate if 'F' key is released
            keyDown = false;
        }
    });

    document.body.addEventListener('mousedown', function(event) {
        if (event.button === 0) { // Check if left mouse button is pressed
            const aTag = event.target.closest('a[href]');
            if (!aTag || aTag.href.startsWith('javascript:')) return;

            longPressTimer = setTimeout(() => {
                iframe.src = aTag.href;
                iframeContainer.style.display = 'flex';
            }, longPressDuration);
        }
    });

    document.body.addEventListener('mouseup', function(event) {
        clearTimeout(longPressTimer); // Cancel the timer when the mouse button is released
    });

    document.body.addEventListener('mouseover', function(event) {
        const aTag = event.target.closest('a[href]');
        if (!aTag || aTag.href.startsWith('javascript:')) return;

        currentHoveredLink = aTag; // Update currently hovered link
        if (keyDown) { // Check if 'F' key is still pressed
            iframe.src = currentHoveredLink.href;
            iframeContainer.style.display = 'flex';
        }
    }, { passive: true });

    document.body.addEventListener('mouseout', function(event) {
        if (event.target.closest('a[href]')) {
            currentHoveredLink = null; // Clear hovered link on mouseout
        }
    });

    iframeContainer.addEventListener('click', function(event) {
        if (event.target === iframeContainer) {
            iframeContainer.style.display = 'none';
            iframe.src = '';
        }
    });
})();
