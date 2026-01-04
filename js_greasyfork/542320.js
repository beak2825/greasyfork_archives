// ==UserScript==
// @name         Fullscreen Toggle Button
// @namespace    https://shuhaibnc.github.io
// @version      1.0
// @description  Add a fullscreen button to bottom-left corner of any webpage
// @author       ShuhaibNC
// @match        *://*/*
// @grant        none
// @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/542320/Fullscreen%20Toggle%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/542320/Fullscreen%20Toggle%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const btn = document.createElement('button');
    btn.innerText = '⛶';
    btn.title = 'Toggle Fullscreen';
    Object.assign(btn.style, {
        position: 'fixed',
        bottom: '10px',
        left: '10px',
        zIndex: 99999,
        background: '#111',
        color: '#fff',
        border: '1px solid #444',
        padding: '10px 14px',
        borderRadius: '8px',
        fontSize: '16px',
        cursor: 'pointer',
        opacity: '0.7',
        transition: 'opacity 0.3s',
    });

    btn.addEventListener('mouseenter', () => btn.style.opacity = '1');
    btn.addEventListener('mouseleave', () => btn.style.opacity = '0.7');

    btn.addEventListener('click', () => {
        const doc = document.documentElement;
        if (!document.fullscreenElement) {
            doc.requestFullscreen().catch(err => alert(`Failed: ${err.message}`));
        } else {
            document.exitFullscreen();
        }
    });

    document.body.appendChild(btn);
})();