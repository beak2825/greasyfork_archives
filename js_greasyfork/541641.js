// ==UserScript==
// @name         CopyGlow
// @namespace    https://greasyfork.org/en/users/1451802
// @version      1.0
// @description  Show a floating highlight and "Copied!" toast when copying text.
// @author       NormalRandomPeople (https://github.com/NormalRandomPeople)
// @match        *://*/*
// @icon         https://www.svgrepo.com/show/257858/clipboard.svg
// @grant        none
// @compatible   chrome
// @compatible   firefox
// @compatible   opera
// @compatible   edge
// @compatible   brave
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541641/CopyGlow.user.js
// @updateURL https://update.greasyfork.org/scripts/541641/CopyGlow.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let overlayBoxes = [];

    function clearOverlays() {
        overlayBoxes.forEach(box => box.remove());
        overlayBoxes = [];
    }

    function createOverlayForRange(range) {
        const rects = range.getClientRects();
        for (const rect of rects) {
            const overlay = document.createElement('div');
            overlay.style.position = 'absolute';
            overlay.style.left = `${rect.left + window.scrollX}px`;
            overlay.style.top = `${rect.top + window.scrollY}px`;
            overlay.style.width = `${rect.width}px`;
            overlay.style.height = `${rect.height}px`;
            overlay.style.backgroundColor = 'rgba(255, 255, 0, 0.5)';
            overlay.style.zIndex = '2147483646';
            overlay.style.pointerEvents = 'none';
            overlay.style.borderRadius = '2px';
            overlay.style.transition = 'opacity 0.4s ease';
            document.body.appendChild(overlay);
            overlayBoxes.push(overlay);
        }

        setTimeout(() => {
            overlayBoxes.forEach(box => (box.style.opacity = '0'));
            setTimeout(clearOverlays, 400);
        }, 1600);
    }

    function showCopiedToast(x, y) {
        const toast = document.createElement('div');
        toast.textContent = 'Copied!';
        toast.style.position = 'absolute';
        toast.style.left = `${x}px`;
        toast.style.top = `${y}px`;
        toast.style.background = '#333';
        toast.style.color = '#fff';
        toast.style.padding = '4px 8px';
        toast.style.fontSize = '13px';
        toast.style.borderRadius = '4px';
        toast.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        toast.style.zIndex = '2147483647';
        toast.style.opacity = '1';
        toast.style.transition = 'opacity 0.5s ease';

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 1500);
    }

    document.addEventListener('copy', () => {
        const sel = window.getSelection();
        if (!sel.rangeCount || sel.isCollapsed) return;
        const range = sel.getRangeAt(0).cloneRange();

        setTimeout(() => {
            clearOverlays();
            createOverlayForRange(range);

            const rects = range.getClientRects();
            if (rects.length) {
                const last = rects[rects.length - 1];
                const x = last.right + window.scrollX + 5;
                const y = last.top + window.scrollY - 5;
                showCopiedToast(x, y);
            }
        }, 0);
    });
})();
