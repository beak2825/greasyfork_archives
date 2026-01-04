// ==UserScript==
// @name         Google Docs Preserve Indent
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Preserve indent on alt+enter
// @match        https://docs.google.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533693/Google%20Docs%20Preserve%20Indent.user.js
// @updateURL https://update.greasyfork.org/scripts/533693/Google%20Docs%20Preserve%20Indent.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- utility to simulate mouse events ---
    function simulateMouseEvent(type, x, y) {
        const evt = new MouseEvent(type, {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: x,
            clientY: y,
            button: 0
        });
        document.elementFromPoint(x, y)?.dispatchEvent(evt);
    }

    // --- find the indent-end handle ---
    function getIndentHandle() {
        return document.querySelector(
            '#kix-horizontal-ruler .docs-ruler-inner > div:nth-child(6) .docs-ruler-indent-end'
        );
    }

    // --- send a plain Enter keypress into the editor iframe ---
    function sendPlainEnter() {
        const iframe = document.querySelector('iframe.docs-texteventtarget-iframe');
        const win = iframe?.contentWindow || window;
        const target = iframe?.contentDocument?.body || document.body;
        const down = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true });
        const up   = new KeyboardEvent('keyup',   { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true });
        target.dispatchEvent(down);
        target.dispatchEvent(up);
    }

    // --- main preserve-indent routine ---
    function preserveIndent() {
        const handle = getIndentHandle();
        if (!handle) return;
        // capture the old "left" in px
        const initialLeft = parseFloat(getComputedStyle(handle).left);

        // insert new line
        sendPlainEnter();

        // after the new line is created, the indent handle moves;
        // wait a moment then drag it back
        setTimeout(() => {
            const h2 = getIndentHandle();
            if (!h2) return;
// compute how much the handle has shifted
            const newLeft = parseFloat(getComputedStyle(h2).left);
            const delta   = initialLeft - newLeft;

            // center of the little handle glyph
            const rect2   = h2.getBoundingClientRect();
            const originX = rect2.left + rect2.width  / 2;
            const originY = rect2.top  + rect2.height / 2;
            const targetX = originX + delta;

            simulateMouseEvent('mousedown', originX, originY);
            simulateMouseEvent('mousemove', targetX, originY);
            simulateMouseEvent('mouseup',   targetX, originY);
        }, 100);
    }

    // --- intercept Alt+Enter ---
    function handleKeydown(e) {
        if (e.altKey && !e.ctrlKey && !e.shiftKey && e.key === 'Enter') {
            e.preventDefault();
            e.stopImmediatePropagation();
            preserveIndent();
        }
    }

    // --- attach to both top window and the editor iframe ---
    function attachListeners() {
        // top‐level (for menus, etc.)
        window.addEventListener('keydown', handleKeydown, true);

        // inside the document editing iframe
        const iframe = document.querySelector('iframe.docs-texteventtarget-iframe');
        if (iframe) {
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            doc.addEventListener('keydown', handleKeydown, true);
        } else {
            // retry if iframe not yet present
            setTimeout(attachListeners, 500);
        }
    }

    // wait for overall load
    window.addEventListener('load', attachListeners);
})();
