// ==UserScript==
// @name         メルカリマウスオーバー+
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hover to show original image (not thumbnail) on Mercari listings
// @match        https://jp.mercari.com/*
// @grant        none
// @license     adsamalu4kia
// @downloadURL https://update.greasyfork.org/scripts/544940/%E3%83%A1%E3%83%AB%E3%82%AB%E3%83%AA%E3%83%9E%E3%82%A6%E3%82%B9%E3%82%AA%E3%83%BC%E3%83%90%E3%83%BC%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/544940/%E3%83%A1%E3%83%AB%E3%82%AB%E3%83%AA%E3%83%9E%E3%82%A6%E3%82%B9%E3%82%AA%E3%83%BC%E3%83%90%E3%83%BC%2B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const preview = document.createElement('img');
    Object.assign(preview.style, {
        position: 'fixed',
        zIndex: '9999',
        maxWidth: '500px',
        maxHeight: '500px',
        border: '1px solid #ccc',
        background: '#fff',
        padding: '5px',
        boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.5)',
        display: 'none',
        pointerEvents: 'none'
    });
    document.body.appendChild(preview);

    document.addEventListener('mouseover', (ev) => {
        const img = ev.target;
        if (img.tagName === 'IMG' && img.src.includes('thumb/photos/')) {
            const newSrc = img.src
                .replace(/\/c!\/w=\d+\/thumb\/photos\//, '/item/detail/orig/photos/');
            preview.src = newSrc.split('?')[0];
            preview.style.display = 'block';
        }
    });

    document.addEventListener('mousemove', (ev) => {
        preview.style.top = (ev.clientY + 20) + 'px';
        preview.style.left = (ev.clientX + 20) + 'px';
    });

    document.addEventListener('mouseout', (ev) => {
        if (ev.target.tagName === 'IMG') {
            preview.style.display = 'none';
        }
    });
})();
