// ==UserScript==
// @name         Instagram Ghost Mode
// @namespace    https://yasser-ghostmode.example
// @version      2.5
// @description  Ghost mode for Instagram: block story views & DM read receipts; draggable toggle with memory, lock/unlock, notifications, and keyboard shortcut
// @author       Yasser
// @license      Copyright (c) 2025 Yasser - All Rights Reserved
// @match        https://www.instagram.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547646/Instagram%20Ghost%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/547646/Instagram%20Ghost%20Mode.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- State ---
    let ghostMode = JSON.parse(localStorage.getItem('IG_GHOST_MODE_ENABLED')) || false;
    let locked = JSON.parse(localStorage.getItem('IG_GHOST_LOCKED')) || false;

    // --- Utility: Notification ---
    function showNotice(msg, color) {
        const box = document.createElement('div');
        box.innerText = msg;
        box.style.position = 'fixed';
        box.style.top = '20px';
        box.style.left = '50%';
        box.style.transform = 'translateX(-50%)';
        box.style.padding = '10px 20px';
        box.style.background = color;
        box.style.color = '#fff';
        box.style.fontWeight = 'bold';
        box.style.fontSize = '14px';
        box.style.borderRadius = '8px';
        box.style.zIndex = 2147483647;
        box.style.opacity = '0.9';
        box.style.transition = 'opacity 0.5s';
        document.body.appendChild(box);
        setTimeout(() => {
            box.style.opacity = '0';
            setTimeout(() => box.remove(), 500);
        }, 1500);
    }

    // --- Core patch: block reads/views ---
    const open = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function (method, url) {
        if (ghostMode && typeof url === 'string') {
            if (url.includes('/seen') || url.includes('/read')) {
                console.log('[GhostMode] blocked request:', url);
                return; // block story seen / message read
            }
        }
        return open.apply(this, arguments);
    };

    // --- Floating Button ---
    const btn = document.createElement('div');
    btn.id = 'ghostModeBtn';
    btn.innerText = ghostMode ? '👻' : '❌';
    btn.style.position = 'fixed';
    btn.style.background = ghostMode ? 'green' : 'red';
    btn.style.color = '#fff';
    btn.style.padding = '10px 15px';
    btn.style.fontSize = '14px';
    btn.style.fontWeight = 'bold';
    btn.style.borderRadius = '10px';
    btn.style.cursor = locked ? 'default' : 'grab';
    btn.style.zIndex = 2147483647;
    btn.style.boxShadow = '0 2px 8px rgba(0,0,0,.3)';
    btn.style.opacity = '0.5';

    // Hover effect
    btn.onmouseenter = () => { btn.style.opacity = '1'; };
    btn.onmouseleave = () => { btn.style.opacity = '0.5'; };

    // Restore saved position
    const savedPos = JSON.parse(localStorage.getItem('IG_GHOST_BTN_POS')) || null;
    if (savedPos && Number.isFinite(savedPos.x) && Number.isFinite(savedPos.y)) {
        btn.style.left = savedPos.x + 'px';
        btn.style.top = savedPos.y + 'px';
    } else {
        btn.style.bottom = '20px';
        btn.style.right = '20px';
    }
    document.body.appendChild(btn);

    // --- Dragging Logic ---
    let isDragging = false, offsetX, offsetY;

    btn.addEventListener('mousedown', e => {
        if (locked || e.button !== 0) return; // only left click drag if unlocked
        isDragging = true;
        offsetX = e.clientX - btn.offsetLeft;
        offsetY = e.clientY - btn.offsetTop;
        btn.style.cursor = 'grabbing';
        e.preventDefault();
    });

    document.addEventListener('mousemove', e => {
        if (isDragging) {
            btn.style.left = (e.clientX - offsetX) + 'px';
            btn.style.top = (e.clientY - offsetY) + 'px';
            btn.style.right = 'auto';
            btn.style.bottom = 'auto';
        }
    });

    document.addEventListener('mouseup', e => {
        if (isDragging) {
            isDragging = false;
            btn.style.cursor = 'grab';
            localStorage.setItem('IG_GHOST_BTN_POS', JSON.stringify({ x: btn.offsetLeft, y: btn.offsetTop }));
        }
    });

    // --- Left click = toggle ---
    btn.addEventListener('click', e => {
        if (isDragging || e.button !== 0) return; // ignore drag or non-left clicks
        toggleGhostMode();
    });

    // --- Right click = lock/unlock ---
    btn.addEventListener('contextmenu', e => {
        e.preventDefault();
        locked = !locked;
        localStorage.setItem('IG_GHOST_LOCKED', JSON.stringify(locked));
        btn.style.cursor = locked ? 'default' : 'grab';
        showNotice(locked ? 'Button Locked' : 'Button Unlocked', locked ? 'blue' : 'orange');
    });

    // --- Keyboard shortcut (G = toggle) ---
    document.addEventListener('keydown', e => {
        if (e.key.toLowerCase() === 'g' && !e.repeat) {
            toggleGhostMode();
        }
    });

    // --- Toggle Function ---
    function toggleGhostMode() {
        ghostMode = !ghostMode;
        localStorage.setItem('IG_GHOST_MODE_ENABLED', JSON.stringify(ghostMode));
        btn.innerText = ghostMode ? '👻' : '❌';
        btn.style.background = ghostMode ? 'green' : 'red';
        showNotice(ghostMode ? 'Ghost Mode Enabled' : 'Ghost Mode Disabled', ghostMode ? 'green' : 'red');
    }
})();
