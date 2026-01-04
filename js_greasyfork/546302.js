// ==UserScript==
// @name         Image Link Revealer
// @namespace    https://github.com/WestoNewToCoding/
// @version      1.6
// @description  Reveal image links with clean URLs and popups (no auto-copy, no duplicate popups)
// @author       Microsoft Copilot
// @match        *://*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546302/Image%20Link%20Revealer.user.js
// @updateURL https://update.greasyfork.org/scripts/546302/Image%20Link%20Revealer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const createPopup = (url, x, y) => {
        let existing = document.getElementById('image-link-popup');
        if (existing) existing.remove();

        const popup = document.createElement('div');
        popup.id = 'image-link-popup';
        Object.assign(popup.style, {
            position: 'fixed',
            left: `${x}px`,
            top: `${y}px`,
            background: '#222',
            color: '#0ff',
            padding: '10px',
            borderRadius: '8px',
            zIndex: 9999,
            fontFamily: 'monospace',
            boxShadow: '0 0 8px #000',
            maxWidth: '300px',
            maxHeight: '300px',
            overflowY: 'auto',
            overflowWrap: 'break-word',
        });

        const cleanURL = url.split('?')[0].split('&')[0];

        const img = document.createElement('img');
        img.src = cleanURL;
        img.style.maxWidth = '100%';
        img.style.display = 'block';
        img.style.marginBottom = '8px';
        popup.appendChild(img);

        const link = document.createElement('a');
        link.href = cleanURL;
        link.textContent = cleanURL;
        link.target = '_blank';
        Object.assign(link.style, {
            color: '#0ff',
            wordBreak: 'break-word',
            textDecoration: 'none',
            display: 'block'
        });
        popup.appendChild(link);

        document.body.appendChild(popup);

        document.addEventListener('click', function dismiss(e) {
            if (!popup.contains(e.target)) {
                popup.remove();
                document.removeEventListener('click', dismiss);
            }
        });
    };

    const getImageURL = (target) => {
        if (!target) return null;

        const tag = target.tagName.toLowerCase();

        if (tag === 'img') {
            return target.currentSrc || target.src || null;
        }

        if (tag === 'source') {
            return target.srcset?.split(',')[0]?.trim() || null;
        }

        const bg = window.getComputedStyle(target).backgroundImage;
        if (bg && bg !== 'none') {
            const match = bg.match(/url\(["']?(.*?)["']?\)/);
            if (match) return match[1];
        }

        return null;
    };

    // Middle click: still opens image in new tab
    document.addEventListener('mousedown', (e) => {
        if (e.button === 1) {
            const url = getImageURL(e.target);
            if (!url || url === 'about:blank') return;

            e.preventDefault();
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.target = '_blank';
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
        }
    });

    // Right click: do absolutely nothing different (normal browser menu appears)
    // Removed the popup creation on contextmenu
})();