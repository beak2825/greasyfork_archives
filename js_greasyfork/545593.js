// ==UserScript==
// @name         YouTube PIP Button (iOS Safari)
// @version      1.3
// @description  Generate PIP button on YouTube Player
// @match        https://m.youtube.com/*
// @grant        none
// @namespace    https://greasyfork.org/users/1405339
// @downloadURL https://update.greasyfork.org/scripts/545593/YouTube%20PIP%20Button%20%28iOS%20Safari%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545593/YouTube%20PIP%20Button%20%28iOS%20Safari%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const controlSelector = '.player-controls-bottom-left';

    function createPipButton(video) {
        const btn = document.createElement('button');
        const icon = document.createElement('span');
        icon.textContent = '◲';
        Object.assign(btn.style, {
            background: 'rgba(0, 0, 0, 0.3)',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            fontSize: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '6px',
            userSelect: 'none',
            textShadow: '0 0px 3px rgba(0, 0, 0, 0.5)',
        });
        Object.assign(icon.style, {
            transform: 'translateY(-2px)',
            display: 'inline-block',
        });

        btn.appendChild(icon);
        btn.classList.add('my-pip-btn');
        btn.onclick = e => {
            e.stopPropagation();
            if (!video) return;
            try {
                video.webkitPresentationMode === 'picture-in-picture'
                    ? video.webkitSetPresentationMode('inline')
                    : video.webkitSetPresentationMode('picture-in-picture');
            } catch {}
        };
        return btn;
    }

    function injectButtons() {
        const video = document.querySelector('video');
        if (!video) return;

        const roots = [document];
        const host = document.querySelector('ytp-player');
        if (host?.shadowRoot) roots.push(host.shadowRoot);

        roots.forEach(root => {
            root.querySelectorAll(controlSelector).forEach(container => {
                if (!container.querySelector('.my-pip-btn')) {
                    container.appendChild(createPipButton(video));
                }
            });
        });
    }

    new MutationObserver(injectButtons).observe(document.body, {childList: true, subtree: true});
    injectButtons();
})();