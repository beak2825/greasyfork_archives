// ==UserScript==
// @name         Mobile Video Controller
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Floating video control panel: skip and speed for HTML5 video on all sites (mobile iOS/Android)
// @author       ChatGPT
// @match        *://*/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533226/Mobile%20Video%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/533226/Mobile%20Video%20Controller.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Store video elements we have already processed
    const processedVideos = new WeakSet();

    // Main function to initialize controls for a video
    function initVideoControls(video) {
        if (processedVideos.has(video)) return;
        processedVideos.add(video);

        // Create panel container
        const panel = document.createElement('div');
        panel.style.position = 'absolute';
        panel.style.display = 'inline-flex';
        panel.style.flexWrap = 'wrap';
        panel.style.alignItems = 'center';
        panel.style.background = 'rgba(0, 0, 0, 0.3)';
        panel.style.borderRadius = '5px';
        panel.style.padding = '5px';
        panel.style.zIndex = 9999;
        panel.style.color = 'white';
        panel.style.fontSize = '14px';
        panel.id = 'tmc-panel-' + Math.random().toString(36).substr(2, 5);

        // Create hide/toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.innerText = '✕';
        toggleBtn.title = 'Toggle controls';
        styleButton(toggleBtn);
        toggleBtn.style.fontSize = '16px';
        toggleBtn.style.marginRight = '5px';
        panel.appendChild(toggleBtn);

        // Container for main controls (so we can hide it)
        const controlsContainer = document.createElement('div');
        controlsContainer.style.display = 'flex';
        controlsContainer.style.alignItems = 'center';
        controlsContainer.id = 'tmc-controls';

        panel.appendChild(controlsContainer);

        // Function to create a control button
        function createControl(text, title, clickHandler) {
            const btn = document.createElement('button');
            btn.innerHTML = text;
            btn.title = title;
            styleButton(btn);
            btn.addEventListener('click', clickHandler);
            return btn;
        }

        // Utility for styling each button
        function styleButton(btn) {
            btn.style.minWidth = '30px';
            btn.style.minHeight = '30px';
            btn.style.margin = '2px';
            btn.style.padding = '5px';
            btn.style.border = 'none';
            btn.style.background = 'rgba(0,0,0,0.5)';
            btn.style.color = 'white';
            btn.style.borderRadius = '3px';
            btn.style.cursor = 'pointer';
        }

        // Skip functions
        function skipVideo(seconds) {
            if (!isNaN(video.duration)) {
                video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
            }
        }

        // Create skip controls
        const skipBack10m = createControl('⏪10m', 'Rewind 10 minutes', () => skipVideo(-600));
        const skipBack1m  = createControl('⏪1m',  'Rewind 1 minute', () => skipVideo(-60));
        const skipBack10s = createControl('⏪10s', 'Rewind 10 seconds', () => skipVideo(-10));
        const skipFwd10s  = createControl('10s⏩', 'Forward 10 seconds', () => skipVideo(10));
        const skipFwd1m   = createControl('1m⏩',  'Forward 1 minute', () => skipVideo(60));
        const skipFwd10m  = createControl('10m⏩', 'Forward 10 minutes', () => skipVideo(600));

        // Append skip controls (backward then speed then forward)
        controlsContainer.appendChild(skipBack10m);
        controlsContainer.appendChild(skipBack1m);
        controlsContainer.appendChild(skipBack10s);

        // Speed control toggle
        const speedToggle = document.createElement('button');
        speedToggle.innerText = '1x ▼';
        speedToggle.title = 'Playback speed';
        styleButton(speedToggle);
        controlsContainer.appendChild(speedToggle);

        // Speed options container (hidden by default)
        const speedList = document.createElement('div');
        speedList.style.position = 'absolute';
        speedList.style.top = '100%';
        speedList.style.left = '0';
        speedList.style.background = 'rgba(0, 0, 0, 0.5)';
        speedList.style.borderRadius = '3px';
        speedList.style.padding = '5px';
        speedList.style.display = 'none';
        speedList.style.flexDirection = 'column';
        speedList.style.gap = '3px';
        panel.appendChild(speedList);

        // Available speed values
        const speedValues = ['1x', '1.25x', '1.5x', '1.75x', '2x', '2.5x', '3x', '4x', '5x'];
        speedValues.forEach(val => {
            const btn = document.createElement('button');
            btn.innerText = val;
            btn.style.minWidth = '50px';
            btn.style.margin = '2px';
            btn.style.padding = '4px';
            btn.style.border = 'none';
            btn.style.background = 'rgba(255,255,255,0.1)';
            btn.style.color = 'white';
            btn.style.borderRadius = '3px';
            btn.style.cursor = 'pointer';
            btn.title = 'Set speed to ' + val;
            btn.addEventListener('click', () => {
                video.playbackRate = parseFloat(val);
                speedToggle.innerText = val + ' ▼';
                speedList.style.display = 'none';
            });
            speedList.appendChild(btn);
        });

        // Speed toggle click event (show/hide list)
        speedToggle.addEventListener('click', () => {
            if (speedList.style.display === 'none') {
                speedList.style.display = 'flex';
                speedToggle.innerText = speedToggle.innerText.replace('▼', '▲');
            } else {
                speedList.style.display = 'none';
                speedToggle.innerText = speedToggle.innerText.replace('▲', '▼');
            }
        });

        // Append skip forward controls
        controlsContainer.appendChild(skipFwd10s);
        controlsContainer.appendChild(skipFwd1m);
        controlsContainer.appendChild(skipFwd10m);

        // Toggle hide/show panel
        let panelHidden = false;
        toggleBtn.addEventListener('click', () => {
            panelHidden = !panelHidden;
            if (panelHidden) {
                controlsContainer.style.display = 'none';
                toggleBtn.innerText = '☰'; // Show menu icon to expand
                panel.style.width = 'auto';
            } else {
                controlsContainer.style.display = 'flex';
                toggleBtn.innerText = '✕';
            }
        });

        // Append panel to document
        document.body.appendChild(panel);

        // Position update function
        function updatePosition() {
            const rect = video.getBoundingClientRect();
            panel.style.left = window.scrollX + rect.left + 'px';
            panel.style.top = window.scrollY + rect.top + 'px';
        }
        updatePosition();

        // Update position on scroll/resize
        window.addEventListener('scroll', updatePosition);
        window.addEventListener('resize', updatePosition);

        // If video changes size or moved (like fullscreen), observe and update
        new ResizeObserver(updatePosition).observe(video);
    }

    // Process all existing videos
    function processVideos() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            initVideoControls(video);
        });
    }

    // Observe DOM for new video elements
    const mo = new MutationObserver(mutations => {
        for (let mutation of mutations) {
            for (let node of mutation.addedNodes) {
                if (node.tagName === 'VIDEO') {
                    initVideoControls(node);
                } else if (node.querySelectorAll) {
                    const vids = node.querySelectorAll('video');
                    vids.forEach(v => initVideoControls(v));
                }
            }
        }
    });

    mo.observe(document.documentElement, { childList: true, subtree: true });

    // Run on DOM ready and after delays
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(processVideos, 500);
    } else {
        window.addEventListener('DOMContentLoaded', processVideos);
    }
})();

