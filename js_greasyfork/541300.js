// ==UserScript==
// @name         All Media Speed
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Use Alt + . and Alt + , to change speed by 0.1x. Overlay is styled like
// YouTube's (centered, small, subtle). Precision to 2 decimals, speed persists across reloads. Works on all videos, even dynamic ones.
// @author       GPT
// @match        *://*/*
// @grant        none
// @license     CC-BY-NC-4.0
// @downloadURL https://update.greasyfork.org/scripts/541300/All%20Media%20Speed.user.js
// @updateURL https://update.greasyfork.org/scripts/541300/All%20Media%20Speed.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STEP = 0.1;
    const MIN = 0.1;
    const MAX = 5.0;
    const STORAGE_KEY = 'videoSpeedPersistent:';
    let speed = loadSpeed();

    // --- Overlay styled like YouTube ---
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: '500',
        fontFamily: 'Arial, sans-serif',
        borderRadius: '4px',
        zIndex: '999999',
        pointerEvents: 'none',
        opacity: '0',
        transition: 'opacity 0.5s ease',
    });
    document.body.appendChild(overlay);

    let timeout;

    function round2(n) {
        return Math.round(n * 100) / 100;
    }

    function showOverlay(msg) {
        clearTimeout(timeout);
        overlay.textContent = msg;
        overlay.style.opacity = '1';
        timeout = setTimeout(() => {
            overlay.style.opacity = '0';
        }, 1500);
    }

    function saveSpeed(val) {
        localStorage.setItem(STORAGE_KEY + location.hostname, val.toFixed(2));
    }

    function loadSpeed() {
        const raw = localStorage.getItem(STORAGE_KEY + location.hostname);
        const val = parseFloat(raw);
        return !isNaN(val) ? round2(val) : 1.0;
    }

    function setSpeed(val) {
        val = Math.max(MIN, Math.min(MAX, round2(val)));
        speed = val;
        document.querySelectorAll('video').forEach(v => v.playbackRate = speed);
        saveSpeed(speed);
        showOverlay(`Speed: ${speed.toFixed(2)}x`);
    }

    function applyToNewVideos() {
        document.querySelectorAll('video').forEach(v => {
            v.playbackRate = speed;
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
            if (e.key === '.') {
                e.preventDefault();
                setSpeed(speed + STEP);
            } else if (e.key === ',') {
                e.preventDefault();
                setSpeed(speed - STEP);
            }
        }
    });

    window.addEventListener('DOMContentLoaded', () => {
        setSpeed(speed);
    });

    new MutationObserver(applyToNewVideos).observe(document.body, {
        childList: true,
        subtree: true
    });
})();
