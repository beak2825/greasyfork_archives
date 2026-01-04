// ==UserScript==
// @name         YouTube 视频比例调整
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  调整youtube视频的比例
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539991/YouTube%20%E8%A7%86%E9%A2%91%E6%AF%94%E4%BE%8B%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/539991/YouTube%20%E8%A7%86%E9%A2%91%E6%AF%94%E4%BE%8B%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const STORAGE_KEY = 'yt_aspect_ratio_ui';
    let styleEl;
    const ratios = ['16/9', '4/3', '21/9', '1/1'];

    function getRatio() {
        return localStorage.getItem(STORAGE_KEY) || '';
    }
    function setRatio(r) {
        if (r) localStorage.setItem(STORAGE_KEY, r);
        else localStorage.removeItem(STORAGE_KEY);
        applyRatio();
        updateButtons();
    }

    function getScale(ratioStr) {
        const [w, h] = ratioStr.split('/').map(Number);
        const video = document.querySelector('#movie_player video');
        if (!w || !h || !video) return null;
        const rect = video.getBoundingClientRect();
        const currentAR = rect.width / rect.height;
        const desiredAR = w / h;
        return desiredAR / currentAR;
    }

    function applyRatio() {
        if (styleEl) styleEl.remove();
        const ratio = getRatio();
        if (!ratio) return;
        const scale = getScale(ratio);
        if (!scale) return;
        styleEl = document.createElement('style');
        styleEl.textContent = `
            #movie_player video {
                transform: scaleX(${scale}) !important;
                transform-origin: center center !important;
            }
        `;
        document.head.appendChild(styleEl);
    }

    function createUI() {
        if (document.getElementById('yt-aspect-ui')) return;
        const container = document.createElement('div');
        container.id = 'yt-aspect-ui';
        Object.assign(container.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 9999,
            background: 'rgba(0,0,0,0.7)',
            padding: '6px',
            borderRadius: '8px',
            display: 'flex',
            gap: '4px',
            alignItems: 'center',
            fontFamily: 'sans-serif',
            transition: 'opacity 0.3s'
        });

        // Ratio buttons
        ratios.forEach(r => {
            const btn = document.createElement('button');
            btn.textContent = r;
            btn.dataset.r = r;
            btn.onclick = () => setRatio(r);
            styleDefault(btn);
            container.appendChild(btn);
        });

        // Reset button
        const reset = document.createElement('button');
        reset.textContent = 'Reset';
        reset.onclick = () => setRatio('');
        styleDefault(reset);
        container.appendChild(reset);

        // Hide panel button
        const hideBtn = document.createElement('button');
        hideBtn.textContent = 'Hide';
        hideBtn.id = 'yt-aspect-hide-btn';
        hideBtn.onclick = () => container.style.display = 'none';
        styleDefault(hideBtn);
        container.appendChild(hideBtn);

        document.body.appendChild(container);
        updateButtons();
        observeFullscreen(container);
    }

    function updateButtons() {
        const current = getRatio();
        document.querySelectorAll('#yt-aspect-ui button').forEach(btn => {
            if (btn.dataset.r !== undefined) {
                if (btn.dataset.r === current) styleHighlight(btn);
                else styleDefault(btn);
            }
        });
    }

    function styleDefault(el) {
        Object.assign(el.style, {
            background: '#333',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 6px',
            cursor: 'pointer',
            fontWeight: 'normal'
        });
    }

    function styleHighlight(el) {
        styleDefault(el);
        el.style.background = '#FFD700';
        el.style.color = '#000';
        el.style.fontWeight = 'bold';
    }

    function observeFullscreen(uiContainer) {
        const player = document.getElementById('movie_player');
        if (!player) return;
        const mo = new MutationObserver(() => {
            const isFS = player.classList.contains('ytp-fullscreen');
            uiContainer.style.opacity = isFS ? '0' : '1';
            uiContainer.style.pointerEvents = isFS ? 'none' : 'auto';
        });
        mo.observe(player, { attributes: true, attributeFilter: ['class'] });
    }

    function observe() {
        window.addEventListener('yt-navigate-finish', () => {
            setTimeout(() => {
                applyRatio();
                createUI();
            }, 500);
        });
        window.addEventListener('resize', applyRatio);
    }

    (function init() {
        applyRatio();
        createUI();
        observe();
    })();
})();