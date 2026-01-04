// ==UserScript==
// @name         HTML5 音量增强器
// @match        *://*/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @version      1.0
// @author       AI
// @license MIT
// @description  Adds Up/Down arrow key volume control with boost capability (>100%) to HTML5 videos using Web Audio API and displays a tip. Based on HTML5视频播放工具.
// @namespace https://greasyfork.org/users/1186846
// @downloadURL https://update.greasyfork.org/scripts/534980/HTML5%20%E9%9F%B3%E9%87%8F%E5%A2%9E%E5%BC%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/534980/HTML5%20%E9%9F%B3%E9%87%8F%E5%A2%9E%E5%BC%BA%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const VOLUME_STEP = 0.5; // How much to change gain per key press (original script used 0.5 for gain)
    const MAX_GAIN = 6;      // Maximum volume gain (5 = 500%)
    const VIDEO_SELECTOR = 'video'; // How to find the video element. 'video' finds the first one. Adjust if needed.

    // --- Globals ---
    let v = null; // The currently controlled video element
    let $msg = null; // Tip message element (jQuery object)
    const by = document.body; // Reference to the body element

    // --- Tip Display Function (Requires jQuery) ---
    // Creates and shows a message centered on the video element
    const tip = (msg, videoEl = v) => {
        if (!videoEl || !msg) { // Don't show tip if no video or message
            if ($msg) $msg.css('opacity', 0);
            return;
        }

        // Initialize the message element if it doesn't exist
        if (!$msg) {
            $msg = $('<div/>').css({
                'position': 'fixed', // Use fixed positioning
                'z-index': 2147483647, // Max z-index to be on top
                'background': 'rgba(0,0,0,0.8)',
                'color': '#FFF',
                'font-size': '24px',
                'font-weight': 'bold',
                'padding': '12px 24px',
                'border-radius': '8px',
                'box-shadow': '0 4px 12px rgba(0,0,0,0.25)',
                'pointer-events': 'none', // Don't intercept mouse events
                'opacity': 0, // Start invisible
                'transform': 'translate(-50%, -50%)', // Center align trick
                'transition': 'opacity 0.3s', // Smooth fade
                'white-space': 'nowrap' // Prevent line breaks
            }).appendTo(by); // Add to the body
        }

        // Calculate video center position
        const rect = videoEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Update message text and position, make visible
        $msg.text(msg)
            .css({
                'left': centerX + 'px',
                'top': centerY + 'px',
                'opacity': 1
            });

        // Set timer to fade out the message
        clearTimeout($msg.timer); // Clear previous timer
        $msg.timer = setTimeout(() => {
            if ($msg) $msg.css('opacity', 0);
        }, 2000); // Fade out after 2 seconds
    };

    // --- Volume Adjustment Function (Uses Web Audio API for boosting) ---
    const adjustVolume = (n) => {
        // Attempt to find the video element if not already set or if it became invalid
        if (!v || !document.contains(v)) {
            v = document.querySelector(VIDEO_SELECTOR);
        }
        if (!v) {
           // console.log("AdjustVolume: No video element found.");
           return; // Exit if no video found
        }

        // Initialize AudioContext and GainNode if they don't exist on the video element
        if (!v.audioGainNode) {
            try {
                // Create AudioContext
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                // Create a source node from the video element
                const source = audioContext.createMediaElementSource(v);
                // Create a gain node (volume control)
                const gainNode = audioContext.createGain();
                // Connect the source to the gain node
                source.connect(gainNode);
                // Connect the gain node to the audio output (speakers)
                gainNode.connect(audioContext.destination);
                // Store the gain node on the video element for later access
                v.audioGainNode = gainNode;
                // Set the video's native volume to 1 (max) so gainNode controls the actual volume
                v.volume = 1;
                console.log("AudioContext and GainNode initialized for video.");
            } catch (e) {
                // If Web Audio API fails (e.g., protected content, browser limitations)
                console.error('Failed to initialize AudioContext/GainNode:', e);

                // Fallback to standard HTML5 volume control (max 100%)
                const currentVolume = v.volume || 0;
                 // Use smaller steps (0.1) for standard volume control as 0.5 is too coarse
                const volumeChange = n > 0 ? 0.1 : -0.1;
                const newVolume = Math.min(Math.max(currentVolume + volumeChange, 0), 1);
                v.volume = +newVolume.toFixed(2);
                tip(`Volume: ${Math.round(v.volume * 100)}%`); // Show standard volume percentage
                return; // Stop here after fallback
            }
        }

        // If AudioContext/GainNode exists, adjust the gain
        let currentGain = v.audioGainNode.gain.value;
        currentGain += n; // Apply the change (+/- VOLUME_STEP)
        // Clamp the gain between 0 and the configured MAX_GAIN
        currentGain = Math.max(0, Math.min(currentGain, MAX_GAIN));
        // Apply the new gain value
        v.audioGainNode.gain.value = +currentGain.toFixed(2);
        // Display the gain multiplier (e.g., "🔊 1.5x")
        tip(`🔊 ${currentGain.toFixed(1)}x`);
    };

    // --- Keydown Event Handler ---
    function handleVolumeKeys(e) {
        const t = e.target;
        // Ignore keys if typing in inputs, focused on editable content, or if modifier keys are pressed
        if (e.ctrlKey || e.metaKey || e.altKey || t.isContentEditable || /INPUT|TEXTAREA|SELECT/i.test(t.nodeName)) {
            return;
        }

        let action = null;
        // Check for Up Arrow (increase volume) or Down Arrow (decrease volume)
        switch (e.keyCode) {
            case 38: // Up Arrow
                action = () => adjustVolume(VOLUME_STEP);
                break;
            case 40: // Down Arrow
                action = () => adjustVolume(-VOLUME_STEP);
                break;
        }

        if (action) {
            // Try to find the video element (most relevant one might be the focused one or the first one)
            const currentVideo = document.querySelector(VIDEO_SELECTOR); // Re-check for video
            if (currentVideo) {
                v = currentVideo; // Update the global 'v' if found
                // Heuristic: Apply if the body or the video itself has focus, to avoid hijacking keys unintentionally.
                 const activeElement = document.activeElement;
                 const isVideoRelated = v.contains(activeElement) || v === activeElement;
                 const isBodyFocused = activeElement === by || activeElement === null;

                 if (isVideoRelated || isBodyFocused) {
                     e.preventDefault(); // Prevent default arrow key behavior (scrolling)
                     e.stopPropagation(); // Stop event bubbling
                     action(); // Perform the volume adjustment
                 }
            }
        }
    }

    // --- Initialization ---
    function init() {
        console.log("Initializing Standalone Volume Booster...");
        // Find the initial video element
        v = document.querySelector(VIDEO_SELECTOR);
        if (v) {
            console.log("Initial video element found:", v);
        } else {
            console.log("No video element found on initial load. Will check during key events.");
        }
        // Add the keydown listener to the document body
        by.addEventListener('keydown', handleVolumeKeys);
        console.log("Volume key listener attached to body.");
    }

    // --- Run Initialization ---
    // Wait for jQuery to be ready (if using @require) and DOM to be loaded
    if (typeof $ === 'undefined') {
        console.error("Volume Booster: jQuery is required for the volume tip display.");
        // Fallback or error handling if jQuery isn't present
    } else {
        // Run init() slightly delayed after DOM is ready
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            setTimeout(init, 500);
        } else {
            window.addEventListener('DOMContentLoaded', () => setTimeout(init, 500));
        }
    }

})();