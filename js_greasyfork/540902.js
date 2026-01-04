// ==UserScript==
// @name         Stream Watch Timer Plus v8.3
// @namespace    http://tampermonkey.net/
// @version      8.3
// @description  Twitch overlay timer with auto-claim drops/points, draggable UI, ad muting, viewer filtering
// @author       Void
// @match        https://www.twitch.tv/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540902/Stream%20Watch%20Timer%20Plus%20v83.user.js
// @updateURL https://update.greasyfork.org/scripts/540902/Stream%20Watch%20Timer%20Plus%20v83.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const STORAGE_KEY = 'swtp';
    let total = 0, session = 0;
    let timer = null, sidebarTimer = null;
    let overlay, display;
    let dragOffset = { x: 0, y: 0 }, dragging = false;
    let dropsEnabled = false;
    const channel = location.pathname.split('/')[1]?.toLowerCase() || 'unknown';
    let followAgeText = '';
    let timerStarted = false;

    function loadTotal() {
        return parseInt(localStorage.getItem(`${STORAGE_KEY}_total_${channel}`) || '0', 10);
    }

    function saveTotal() {
        localStorage.setItem(`${STORAGE_KEY}_total_${channel}`, total);
    }

    function loadPosition() {
        const json = localStorage.getItem(`${STORAGE_KEY}_pos`);
        return json ? JSON.parse(json) : { x: 10, y: 10 };
    }

    function savePosition(x, y) {
        localStorage.setItem(`${STORAGE_KEY}_pos`, JSON.stringify({ x, y }));
    }

    function formatTime(t) {
        const h = Math.floor(t / 3600);
        const m = Math.floor((t % 3600) / 60);
        const s = t % 60;
        return h
            ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
            : `${m}:${String(s).padStart(2, '0')}`;
    }

    function detectDrops() {
        dropsEnabled = Array.from(document.querySelectorAll('[data-a-target="stream-tag"]'))
            .some(el => /drops enabled/i.test(el.textContent));
    }

    function autoClaim() {
        document.querySelector('[data-a-target="claim-drop-button"]')?.click();
        document.querySelector('[data-a-target="community-points-summary"] button')?.click();
    }

    function muteAds(video) {
        const adSelectors = ['.player-ad-overlay', '.video-ad__container', '[class*="ad-label"]', '.sponsored-pill'];
        video.muted = adSelectors.some(sel => document.querySelector(sel));
    }

    function removeBanners() {
        document.querySelectorAll('.video-ad__container, .player-ad-overlay, [data-test-selector="ad-banner"]')
            .forEach(e => e.remove());
    }

    function filterSidebar() {
        const cards = document.querySelectorAll('a[data-a-target="side-nav-card"]');
        for (const card of cards) {
            const text = card.querySelector('[data-a-target="side-nav-viewer-count"]')?.textContent?.toLowerCase();
            let count = 0;
            if (text?.includes('k')) count = parseFloat(text.replace(/,/g, '.')) * 1000;
            else count = parseInt(text?.replace(/\D/g, ''), 10);
            card.style.display = count > 20 ? 'none' : '';
        }
    }

    async function fetchFollowAge() {
        try {
            const res = await fetch(`https://api.ivr.fi/v2/twitch/user/followage/${channel}`);
            const json = await res.json();
            followAgeText = json?.followageHuman ? ` | Following for: ${json.followageHuman}` : '';
        } catch {
            followAgeText = '';
        }
    }

    function updateDisplay() {
        const dropText = dropsEnabled ? ` | 🎁 Drop in ${Math.ceil(Math.max(0, 900 - session) / 60)}m` : '';
        display.textContent = `⏱ Total: ${formatTime(total)} | Session: ${formatTime(session)}${dropText}${followAgeText}`;
    }

    function makeDraggable(el) {
        const pos = loadPosition();
        el.style.left = `${pos.x}px`;
        el.style.top = `${pos.y}px`;

        el.addEventListener('mousedown', (e) => {
            dragging = true;
            dragOffset.x = e.clientX - el.offsetLeft;
            dragOffset.y = e.clientY - el.offsetTop;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!dragging) return;
            const x = e.clientX - dragOffset.x;
            const y = e.clientY - dragOffset.y;
            el.style.left = `${x}px`;
            el.style.top = `${y}px`;
        });

        document.addEventListener('mouseup', () => {
            if (!dragging) return;
            dragging = false;
            savePosition(overlay.offsetLeft, overlay.offsetTop);
        });
    }

    function createOverlay() {
        overlay = document.createElement('div');
        overlay.id = 'watch-time-overlay';
        Object.assign(overlay.style, {
            position: 'fixed',
            left: '10px',
            top: '10px',
            background: 'rgba(0,0,0,0.85)',
            color: '#fff',
            fontFamily: 'Segoe UI, sans-serif',
            fontSize: '14px',
            fontWeight: '600',
            padding: '8px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: '99999',
            cursor: 'move',
            userSelect: 'none',
            textShadow: '0 0 3px #000',
            pointerEvents: 'auto',
            maxWidth: '350px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            boxSizing: 'border-box',
            transformOrigin: 'top left' // prevent zoom scaling glitches
        });

        display = document.createElement('span');
        display.style.flex = '1';
        overlay.appendChild(display);

        const reset = document.createElement('button');
        reset.textContent = 'Reset';
        Object.assign(reset.style, {
            fontSize: '12px',
            padding: '2px 8px',
            background: '#333',
            color: '#eee',
            border: '1px solid #555',
            borderRadius: '4px',
            cursor: 'pointer',
            flexShrink: '0'
        });
        reset.onclick = () => {
            if (confirm('Reset total and session time?')) {
                session = 0;
                total = 0;
                saveTotal();
                updateDisplay();
            }
        };

        overlay.appendChild(reset);
        makeDraggable(overlay);
        return overlay;
    }

    async function startTimer(video, container) {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        if (sidebarTimer) {
            clearInterval(sidebarTimer);
            sidebarTimer = null;
        }

        total = loadTotal();
        session = 0;
        detectDrops();
        await fetchFollowAge();

        // Remove old overlay if any
        const existingOverlay = document.getElementById('watch-time-overlay');
        if (existingOverlay) existingOverlay.remove();

        container.appendChild(createOverlay());
        updateDisplay();

        let lastTimestamp = performance.now();

        timer = setInterval(() => {
            const now = performance.now();
            const elapsedSec = (now - lastTimestamp) / 1000;
            lastTimestamp = now;

            if (video.readyState >= 2 && !video.paused && !video.ended) {
                // Add elapsed seconds, but only count full seconds
                session += elapsedSec;
                total += elapsedSec;

                // Convert to integer seconds for display and storage
                const displaySession = Math.floor(session);
                const displayTotal = Math.floor(total);

                updateDisplayWith(displayTotal, displaySession);

                if (displayTotal % 5 === 0) {
                    saveTotal(displayTotal);
                }
            }
            autoClaim();
            muteAds(video);
            removeBanners();
        }, 1000);

        sidebarTimer = setInterval(filterSidebar, 1500);
    }

    // Update display helper with explicit times
    function updateDisplayWith(totalSeconds, sessionSeconds) {
        const dropText = dropsEnabled ? ` | 🎁 Drop in ${Math.ceil(Math.max(0, 900 - sessionSeconds) / 60)}m` : '';
        display.textContent = `⏱ Total: ${formatTime(totalSeconds)} | Session: ${formatTime(sessionSeconds)}${dropText}${followAgeText}`;
    }

    function init() {
        let initialized = false;
        new MutationObserver(() => {
            if (initialized) return;
            const video = document.querySelector('video');
            const container = document.querySelector('.video-player__container') || document.querySelector('.video-player__overlay');
            if (video && container) {
                initialized = true;
                startTimer(video, container);
            }
        }).observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('load', () => setTimeout(init, 1000));
})();
