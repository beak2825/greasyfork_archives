// ==UserScript==
// @name         AI Studio Status Notifier
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  Adds a running timer to the tab title during generation and provides a visual notification on completion. Refined for efficiency.
// @author       AI: Google's Gemini Model
// @match        https://aistudio.google.com/*
// @icon         https://www.gstatic.com/aistudio/ai_studio_favicon_64x64.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542711/AI%20Studio%20Status%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/542711/AI%20Studio%20Status%20Notifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Singleton Check ---
    if (window.aiStudioNotifierInitialized) {
        console.log("[AI Studio Status Notifier] Already initialized. Skipping redundant execution.");
        return;
    }
    window.aiStudioNotifierInitialized = true;

    // --- Configuration ---
    const DEBUG = false; // Set to true to enable verbose logging for debugging.
    const runButtonSelector = 'run-button button';
    const stoppableClass = 'stoppable';

    let originalTitle = document.title || "AI Studio";
    let currentState = 'ready'; // 'ready' or 'running'
    let timerInterval = null;
    let startTime = 0;

    // --- Logging ---
    function log(message, level = 'info') {
        if (DEBUG || level === 'info') { // Simplified condition
            console.log(`[AI Studio Status Notifier v1.2.0] ${message}`);
        }
    }

    // --- Notification ---
    function showVisualNotification() {
        log('Displaying visual notification.');
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100vw';
        flash.style.height = '100vh';
        flash.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        flash.style.zIndex = '99999';
        flash.style.pointerEvents = 'none';
        flash.style.transition = 'opacity 200ms ease-out';
        document.body.appendChild(flash);
        setTimeout(() => {
            flash.style.opacity = '0';
            setTimeout(() => flash.remove(), 200);
        }, 150);
    }

    // --- DOM Manipulation ---
    function setTitlePrefix(prefix) {
        const newTitle = prefix ? `${prefix} ${originalTitle}` : originalTitle;
        if (document.title !== newTitle) {
            log(`Setting tab title to: ${newTitle}`, 'debug');
            document.title = newTitle;
        }
    }

    // --- Timer Logic ---
    function startTimer() {
        if (timerInterval) clearInterval(timerInterval);
        log('Starting title timer.');
        startTime = Date.now();
        timerInterval = setInterval(() => {
            const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
            const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
            const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');
            setTitlePrefix(`Running [${minutes}:${seconds}] |`);
        }, 1000);
    }

    function stopTimer() {
        if (timerInterval) {
            log('Stopping title timer.');
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    // --- Core Logic ---
    const observerCallback = function(mutationsList, observer) {
        if (!originalTitle || originalTitle === "") {
            if (document.title && document.title !== "") {
                originalTitle = document.title;
                log(`Stable original title captured: "${originalTitle}"`);
            }
        }

        const runButton = document.querySelector(runButtonSelector);
        if (!runButton) return;

        const isStoppable = runButton.classList.contains(stoppableClass);

        if (isStoppable && currentState === 'ready') {
            log("State changing to 'running' based on run button.");
            currentState = 'running';
            startTimer();
        } else if (!isStoppable && currentState === 'running') {
            log("State changing to 'ready' based on run button.");
            currentState = 'ready';
            stopTimer();
            setTitlePrefix('Ready |');
            // MODIFICATION: Removed the redundant 'playNotification' function and call 'showVisualNotification' directly.
            showVisualNotification();
        }
    };

    // --- Initialization ---
    function initialize() {
        log('Initializing AI Studio Status Notifier v1.2.0...');
        const targetNode = document.body;
        const config = {
            attributes: true,
            attributeFilter: ['class'],
            childList: true,
            subtree: true
        };
        const observer = new MutationObserver(observerCallback);
        observer.observe(targetNode, config);
        log('Observer is now watching for run button state changes.');
    }

    if (document.readyState === 'complete') {
        initialize();
    } else {
        window.addEventListener('load', initialize);
    }
})();