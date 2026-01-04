// ==UserScript==
// @name         Edsby: Auto-Expand & Download with WakeLock
// @namespace    http://tampermonkey.net/
// @version      0.0
// @description  Auto-scrolls Edsby pages and downloads files
// @match        https://*.edsby.com/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539338/Edsby%3A%20Auto-Expand%20%20Download%20with%20WakeLock.user.js
// @updateURL https://update.greasyfork.org/scripts/539338/Edsby%3A%20Auto-Expand%20%20Download%20with%20WakeLock.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // CSS selectors
    const EXPAND_SELECTOR   = '[id="5ParentStudentActivity-body-more"]';
    const DOWNLOAD_SELECTOR = '[aria-label="Download File"]';

    // Timing (ms)
    const SCROLL_DELAY = 100;
    const INTERVAL     = 100;

    // State
    let expandRunning   = false;
    let downloadRunning = false;
    const clickedDownloadIds = new Set();

    // Audio wake-lock hack
    let audioCtx, osc, gain;
    function startWakeLock() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx) {
                osc      = audioCtx.createOscillator();
                gain     = audioCtx.createGain();
                osc.type            = 'square';
                osc.frequency.value = 1;
                gain.gain.value     = 0.001;
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start();
                console.log('[AutoScript] Wake-lock ON');
            }
        }
    }
    function stopWakeLock() {
        if (osc) { osc.stop(); osc.disconnect(); gain.disconnect(); }
        if (audioCtx) { audioCtx.close(); }
        audioCtx = osc = gain = null;
        console.log('[AutoScript] Wake-lock OFF');
    }
    function updateWakeLock() {
        if (expandRunning || downloadRunning) startWakeLock();
        else stopWakeLock();
    }

    // Build UI container
    const container = document.createElement('div');
    container.style.cssText =
        'position:fixed; top:10px; right:10px; z-index:9999; ' +
        'background: #ffffff; padding:12px; ' +
        'border:1px solid #555; border-radius:6px; ' +
        'display:flex; flex-direction:column; gap:8px; ' +
        'font-family: sans-serif; font-size:14px; color: #111; ' +
        'cursor: move; user-select: none;';

    // Make UI draggable
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        const rect = container.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;
        container.style.cursor = 'grabbing';
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        // Keep container within viewport bounds
        const containerRect = container.getBoundingClientRect();
        const maxX = window.innerWidth - containerRect.width;
        const maxY = window.innerHeight - containerRect.height;
        
        const boundedX = Math.max(0, Math.min(newX, maxX));
        const boundedY = Math.max(0, Math.min(newY, maxY));
        
        container.style.left = boundedX + 'px';
        container.style.top = boundedY + 'px';
        container.style.right = 'auto';
        container.style.bottom = 'auto';
        
        e.preventDefault();
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            container.style.cursor = 'move';
        }
    });

    // Helper to create a labeled toggle row
    function createLabeledToggle(id, labelText) {
        const row = document.createElement('div');
        row.style.cssText = 'display:flex; align-items:center; gap:10px;';

        const textLabel = document.createElement('span');
        textLabel.textContent = labelText;
        textLabel.style.cssText = 'flex-shrink:0; color:#111; font-weight:600;';

        const input = document.createElement('input');
        input.type    = 'checkbox';
        input.id      = id;
        input.style.cssText = 'opacity:0; width:0; height:0; position:absolute;';

        const switchLabel = document.createElement('label');
        switchLabel.htmlFor = id;
        switchLabel.style.cssText =
            'display:inline-block; width:48px; height:24px; ' +
            'background:#ccc; border-radius:24px; position:relative; ' +
            'cursor:pointer; transition:background 0.3s; flex-shrink:0;';

        const knob = document.createElement('span');
        knob.style.cssText =
            'position:absolute; top:2px; left:2px; width:20px; height:20px; ' +
            'background:#fff; border-radius:50%; transition:left 0.3s';
        switchLabel.appendChild(knob);

        // Change state on toggle
        input.addEventListener('change', () => {
            const on = input.checked;
            switchLabel.style.background = on ? '#28a745' : '#ccc';
            knob.style.left = on ? '26px' : '2px';
            if (id === 'autoExpandToggle') expandRunning = on;
            if (id === 'autoDownloadToggle') downloadRunning = on;
            updateWakeLock();
            console.log('[AutoScript]', id, 'set to', on);
        });

        row.appendChild(textLabel);
        row.appendChild(input);
        row.appendChild(switchLabel);
        container.appendChild(row);

        return input;
    }

    // Create toggles
    createLabeledToggle('autoExpandToggle',   'Auto-Expand Posts');
    createLabeledToggle('autoDownloadToggle', 'Auto-Download Files');
    document.body.appendChild(container);

    // Auto loop
    async function runLoop() {
        if (expandRunning) {
            window.scrollTo(0, document.body.scrollHeight);
            await new Promise(r => setTimeout(r, SCROLL_DELAY));
            
            const btn = document.querySelector(EXPAND_SELECTOR);
            if (btn) {
                btn.click();
                console.log('[AutoScript] Clicked expand button');
            } else {
                console.log('[AutoScript] No expand button found, continuing to scroll');
            }
        }
        if (downloadRunning) {
            document.querySelectorAll(DOWNLOAD_SELECTOR).forEach(el => {
                const id = el.id;
                console.log('[AutoScript] Attempting download for id:', id);
                if (id && !clickedDownloadIds.has(id)) {
                    clickedDownloadIds.add(id);
                    el.click();
                    console.log('[AutoScript] Download clicked:', id);
                }
            });
        }
        setTimeout(runLoop, INTERVAL);
    }

    // Start looping
    runLoop();
})();
