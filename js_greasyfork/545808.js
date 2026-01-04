// ==UserScript==
// @name         Floating Clipboard (Draggable Fix)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Movable floating clipboard with persistent notes
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545808/Floating%20Clipboard%20%28Draggable%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545808/Floating%20Clipboard%20%28Draggable%20Fix%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const clipboard = document.createElement('div');
    clipboard.id = 'floatingClipboard';
    clipboard.style.position = 'fixed';
    clipboard.style.top = '100px';
    clipboard.style.left = '100px';
    clipboard.style.width = '250px';
    clipboard.style.height = '300px';
    clipboard.style.background = 'rgba(0,0,0,0)'; 
    clipboard.style.border = '2px solid black';
    clipboard.style.borderRadius = '10px';
    clipboard.style.zIndex = '9999';
    clipboard.style.display = 'flex';
    clipboard.style.flexDirection = 'column';
    clipboard.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';

    const header = document.createElement('div');
    header.style.height = '40px';
    header.style.background = 'black';
    header.style.borderTopLeftRadius = '10px';
    header.style.borderTopRightRadius = '10px';
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.justifyContent = 'center';
    header.style.color = 'white';
    header.style.fontWeight = 'bold';
    header.style.cursor = 'grab';
    header.style.userSelect = 'none';
    header.style.pointerEvents = 'all';
    header.innerText = '📋';
    clipboard.appendChild(header);

    const textArea = document.createElement('textarea');
    textArea.style.flex = '1';
    textArea.style.width = '100%';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.resize = 'none';
    textArea.style.background = 'rgba(255,255,255,0.9)';
    textArea.style.borderBottomLeftRadius = '10px';
    textArea.style.borderBottomRightRadius = '10px';
    textArea.value = localStorage.getItem('floatingClipboard') || '';
    clipboard.appendChild(textArea);

    textArea.addEventListener('input', () => {
        localStorage.setItem('floatingClipboard', textArea.value);
    });

    document.body.appendChild(clipboard);

    // Dragging
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - clipboard.getBoundingClientRect().left;
        offsetY = e.clientY - clipboard.getBoundingClientRect().top;
        header.style.cursor = 'grabbing';
        e.preventDefault(); // prevent text selection
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        clipboard.style.left = (e.clientX - offsetX) + 'px';
        clipboard.style.top = (e.clientY - offsetY) + 'px';
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            header.style.cursor = 'grab';
        }
    });
})();
