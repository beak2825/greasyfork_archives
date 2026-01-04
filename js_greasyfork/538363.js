// ==UserScript==
// @name         Torn Welcomer 
// @namespace    https://greasyfork.org/en/users/1469540-davrone
// @version      1.4
// @description  Welcome sound on first login
// @author       Davrone
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538363/Torn%20Welcomer.user.js
// @updateURL https://update.greasyfork.org/scripts/538363/Torn%20Welcomer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SOUND_URL = 'https://files.catbox.moe/nvlmz5.mp3';
    const SESSION_KEY = 'tornSessionActive';
    const HEARTBEAT_KEY = 'tornHeartbeat';
    const HEARTBEAT_INTERVAL = 5000; // 5 seconds
    const SESSION_TIMEOUT = 10000; // 10 seconds (longer gap means "new session")

    function shouldPlaySound() {
        try {
            const sessionActive = localStorage.getItem(SESSION_KEY);
            const lastHeartbeat = localStorage.getItem(HEARTBEAT_KEY);
            const now = Date.now();

            console.log('[Login Sound] Debug - Session active:', sessionActive);
            console.log('[Login Sound] Debug - Last heartbeat:', lastHeartbeat ? new Date(parseInt(lastHeartbeat)) : 'none');
            console.log('[Login Sound] Debug - Time since heartbeat:', lastHeartbeat ? now - parseInt(lastHeartbeat) : 'N/A');

            // Play sound only if:
            // 1. No session is marked as active, OR
            // 2. The last heartbeat is older than our timeout (meaning all tabs were closed)
            if (!sessionActive || !lastHeartbeat || (now - parseInt(lastHeartbeat)) > SESSION_TIMEOUT) {
                return true;
            }

            return false;
        } catch (error) {
            console.error('[Login Sound] Error checking localStorage:', error);
            return true;
        }
    }

    function markSessionActive() {
        try {
            localStorage.setItem(SESSION_KEY, 'true');
            localStorage.setItem(HEARTBEAT_KEY, Date.now().toString());
        } catch (error) {
            console.error('[Login Sound] Error marking session active:', error);
        }
    }

    function updateHeartbeat() {
        try {
            localStorage.setItem(HEARTBEAT_KEY, Date.now().toString());
        } catch (error) {
            console.error('[Login Sound] Error updating heartbeat:', error);
        }
    }

    function startHeartbeat() {
        // Update heartbeat immediately
        updateHeartbeat();

        // Set up interval to keep updating heartbeat
        const heartbeatInterval = setInterval(updateHeartbeat, HEARTBEAT_INTERVAL);

        // Clean up heartbeat when page becomes hidden (but keep session active)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Page is hidden, but don't clear session yet
                console.log('[Login Sound] Page hidden, heartbeat paused');
            } else {
                // Page is visible again, resume heartbeat
                console.log('[Login Sound] Page visible, heartbeat resumed');
                updateHeartbeat();
            }
        });

        // Only clear session when browser is actually closing/navigating away
        window.addEventListener('beforeunload', () => {
            // Check if this might be the last tab by seeing if heartbeat stops updating
            setTimeout(() => {
                // This won't run if browser actually closes, but will run if just navigating
                updateHeartbeat();
            }, 100);
        });
    }

    function playLoginSound() {
        console.log('[Login Sound] Setting up login sound to play on first interaction');

        // Create a function that creates and plays audio in direct response to user interaction
        function playOnInteraction(event) {
            console.log('[Login Sound] User interaction detected, playing sound now');

            // Create audio element in direct response to user event
            const audio = new Audio(SOUND_URL);
            audio.volume = 0.3;

            // Play immediately in the event handler
            audio.play().then(() => {
                console.log('[Login Sound] Sound played successfully');
            }).catch(error => {
                console.error('[Login Sound] Error playing sound:', error);
            });

            // Remove all listeners after playing
            document.removeEventListener('click', playOnInteraction);
            document.removeEventListener('keydown', playOnInteraction);
            document.removeEventListener('mousedown', playOnInteraction);
        }

        // Try to play immediately first (in case user has already interacted)
        const testAudio = new Audio(SOUND_URL);
        testAudio.volume = 0.3;
        testAudio.play().then(() => {
            console.log('[Login Sound] Sound played immediately');
        }).catch(() => {
            console.log('[Login Sound] Auto-play blocked, waiting for user interaction');
            // Set up listeners for user interaction - use mousedown instead of mousemove
            document.addEventListener('click', playOnInteraction, { once: true });
            document.addEventListener('keydown', playOnInteraction, { once: true });
            document.addEventListener('mousedown', playOnInteraction, { once: true });
        });
    }

    function init() {
        console.log('[Login Sound] Script initialized');

        // Check if we should play the sound (only if no active Torn session)
        if (shouldPlaySound()) {
            console.log('[Login Sound] No active Torn session detected, preparing to play sound');

            // Mark session as active BEFORE playing sound
            markSessionActive();

            // Wait a bit for page to settle, then play
            setTimeout(() => {
                playLoginSound();
            }, 1000);
        } else {
            console.log('[Login Sound] Torn session already active, skipping sound');
        }

        // Start the heartbeat to keep session alive
        startHeartbeat();
    }

    // Initialize when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('[Login Sound] Login sound script loaded');
})();