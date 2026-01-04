// ==UserScript==
// @name        Kimi AI Text-to-Speech
// @namespace   http://tampermonkey.net/
// @version     1.5
// @description Adds text-to-speech to Moonshot's Kimi AI (English voice only).
// @author      CHJ85
// @match       https://www.kimi.com/*
// @icon        data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNDMuMDYzMyAzMy4zNjIyQzQ2LjgwMzcgMzUuNDgzMiA0OS4yMDk1IDM5LjEyNSA0OS4yMDk1IDQzLjA2NjRWMzUuODU1MkM0OS4yMDk1IDMxLjY2ODUgNDYuNjA4MyAyNy45NTk0IDQyLjkwNTYgMjYuMzYxM0wzMi4wNDY0IDE5LjY3NUMyNy45NTk3IDE3LjY3NTQgMjMgMjAuOTI1NyAyMyAyNS40MjE4VjQzLjA2NjRDMjMgNDcuNTYyNSAyNy45NTk3IDUwLjYxMjcgMzIuMDQ2NCA0OC44MTI3TDM2LjM3NzYgNDcuMTcyMiIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMjMuMTk5MiAzMC4zODQ4QzIzLjE5OTIgMjUuOTM4NyAyNy4xNTg5IDIyLjg4ODYgMzEuMjQ1NyAyNC42ODg2TDM5LjU4NjIgMjguNjA1MkMzOS41ODYyIDMyLjc5MTkgMzYuOTg1IDM2LjUwMSAzMy4zMzAyIDM4LjA5OTJMMjMuMTk5MiAzMC4zODQ4WiIgZmlsbD0iYmxhY2siLz48L3N2Zz4=
// @grant       GM_xmlhttpRequest
// @connect     texttospeech.responsivevoice.org
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/543124/Kimi%20AI%20Text-to-Speech.user.js
// @updateURL https://update.greasyfork.org/scripts/543124/Kimi%20AI%20Text-to-Speech.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Kimi TTS script started (Web Audio API version).");

    // Global state to manage the currently playing audio
    let activePlayback = {
        source: null, context: null, buffer: null, startTime: 0,
        startContextTime: 0, pausedTime: 0, button: null,
        messageElement: null, isPlaying: false, stopReason: null
    };

    // Define common SVG attributes for consistency
    const svgBaseAttributes = {
        width: "28",
        height: "28",
        viewBox: "-10 -12 36 36",
    };

    // --- ICON DEFINITIONS ---
    function createAudioSVG() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        // Apply base attributes
        for (const attr in svgBaseAttributes) {
            svg.setAttribute(attr, svgBaseAttributes[attr]);
        }
        svg.classList.add("simple-button-icon", "iconify"); // Kimi style class

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("fill", "currentColor");
        path.setAttribute("d", "M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77M16.5 12c0-1.77-1-3.29-2.5-4.03v8.05c1.5-.74 2.5-2.25 2.5-4.02M3 9v6h4l5 5V4L7 9z");
        svg.appendChild(path);
        return svg;
    }

    function createPauseSVG() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        // Apply base attributes
        for (const attr in svgBaseAttributes) {
            svg.setAttribute(attr, svgBaseAttributes[attr]);
        }
        svg.classList.add("simple-button-icon", "iconify"); // Kimi style class

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("fill", "currentColor");
        path.setAttribute("d", "M14 19h4V5h-4zm-8 0h4V5H6z");
        svg.appendChild(path);
        return svg;
    }

    // Helper function to swap the icon inside a button
    function replaceButtonIcon(buttonElement, newSvgElement) {
        const currentSvg = buttonElement.querySelector('svg');
        if (currentSvg) {
            // Ensure the new SVG element inherits the necessary attributes for positioning
            for (const attr in svgBaseAttributes) {
                newSvgElement.setAttribute(attr, svgBaseAttributes[attr]);
            }
            buttonElement.replaceChild(newSvgElement, currentSvg);
        } else {
            buttonElement.appendChild(newSvgElement);
        }
    }

    // Function to create the audio button element
    function createAudioButton(messageTextElement, messageElement) {
        const button = document.createElement('div');
        button.classList.add('simple-button', 'size-small', 'kimi-tts-button');
        button.style.cursor = 'pointer'; // Ensure it has a pointer cursor

        // Set the button's background color to light gray
        button.style.backgroundColor = '#ffffff'; // Light gray background for the button itself
        // Set the icon's color to a darker shade for contrast
        button.style.color = '#767676'; // Darker gray for the icon for contrast

        button.style.overflow = 'visible';

        button.appendChild(createAudioSVG());

        button.addEventListener('click', async (e) => {
            e.stopPropagation();
            console.log("Kimi TTS button clicked!");

            const clickedButton = button;
            const clickedMessageElement = messageElement;

            // --- Handle Pause/Resume Logic ---
            if (activePlayback.messageElement === clickedMessageElement) {
                if (activePlayback.isPlaying) {
                    console.log("Pausing playback.");
                    const elapsedContextTime = activePlayback.context.currentTime - activePlayback.startContextTime;
                    activePlayback.pausedTime = activePlayback.startTime + elapsedContextTime;
                    activePlayback.stopReason = 'paused';
                    activePlayback.source.stop();
                    replaceButtonIcon(clickedButton, createAudioSVG());
                    return;
                } else if (activePlayback.pausedTime > 0 && !activePlayback.isPlaying) {
                    console.log("Resuming playback from", activePlayback.pausedTime.toFixed(3), "seconds.");

                    try {
                        const newSource = activePlayback.context.createBufferSource();
                        newSource.buffer = activePlayback.buffer;
                        newSource.connect(activePlayback.context.destination);

                        activePlayback.source = newSource;
                        activePlayback.startTime = activePlayback.pausedTime;
                        activePlayback.startContextTime = activePlayback.context.currentTime;
                        activePlayback.pausedTime = 0;
                        activePlayback.isPlaying = true;

                        newSource.onended = createOnEndedHandler(newSource, clickedButton);
                        newSource.start(0, activePlayback.startTime);
                        replaceButtonIcon(clickedButton, createPauseSVG());
                    } catch (err) {
                        console.error("Error resuming audio:", err);
                    }

                    return;
                }
            }

            // --- Handle Stop Current and Start New Playback ---
            if (activePlayback.source) {
                console.log("Stopping current playback to start new one.");
                if (activePlayback.button) {
                    replaceButtonIcon(activePlayback.button, createAudioSVG());
                }
                activePlayback.stopReason = null;
                activePlayback.source.stop();
            }

            activePlayback = { source: null, context: null, buffer: null, startTime: 0, startContextTime: 0, pausedTime: 0, button: null, messageElement: null, isPlaying: false, stopReason: null };

            console.log("Starting new playback.");
            replaceButtonIcon(clickedButton, createPauseSVG());

            const text = messageTextElement.textContent;
            const cleanedText = text.replace(/[\u200B-\u200D\uFEFF]/g, '');
            const encodedText = encodeURIComponent(cleanedText);
            const audioUrl = `https://texttospeech.responsivevoice.org/v1/text:synthesize?lang=en-GB&engine=g1&pitch=0.5&rate=0.5&volume=1&key=kvfbSITh&gender=male&text=${encodedText}`;

            try {
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({ method: "GET", url: audioUrl, responseType: "arraybuffer", onload: resolve, onerror: reject, ontimeout: reject });
                });

                if (response.status === 200) {
                    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    if (audioContext.state === 'suspended') await audioContext.resume();

                    const audioBuffer = await audioContext.decodeAudioData(response.response);
                    const source = audioContext.createBufferSource();
                    source.buffer = audioBuffer;
                    source.connect(audioContext.destination);

                    activePlayback = {
                        source, context: audioContext, buffer: audioBuffer, startTime: 0,
                        startContextTime: audioContext.currentTime, button: clickedButton,
                        messageElement: clickedMessageElement, isPlaying: true, pausedTime: 0,
                        stopReason: null
                    };

                    source.onended = createOnEndedHandler(source, clickedButton);
                    source.start(0);
                } else { throw new Error(`HTTP status ${response.status}`); }
            } catch (error) {
                console.error("Error fetching or playing audio:", error);
                replaceButtonIcon(clickedButton, createAudioSVG());
                activePlayback = { source: null, context: null, buffer: null, startTime: 0, startContextTime: 0, pausedTime: 0, button: null, messageElement: null, isPlaying: false, stopReason: null };
            }
        });
        return button;
    }

    function createOnEndedHandler(sourceNode, buttonElement) {
        return () => {
            if (activePlayback.source !== sourceNode) {
                replaceButtonIcon(buttonElement, createAudioSVG());
                return;
            }
            if (activePlayback.stopReason === 'paused') {
                activePlayback.isPlaying = false;
                activePlayback.source = null;
                activePlayback.stopReason = null;
            } else {
                replaceButtonIcon(buttonElement, createAudioSVG());
                activePlayback = { source: null, context: null, buffer: null, startTime: 0, startContextTime: 0, pausedTime: 0, button: null, messageElement: null, isPlaying: false, stopReason: null };
            }
        };
    }

    function processMessage(messageElement) {
        if (messageElement.classList.contains('kimi-audio-added')) return;

        const messageTextElement = messageElement.querySelector('.markdown');
        const actionsContainer = messageElement.querySelector('.segment-assistant-actions-content');

        if (messageTextElement && actionsContainer && messageTextElement.textContent.trim().length > 0) {
            // Ensure the actions container is fully loaded and contains expected elements
            // This check helps prevent adding buttons to incomplete message segments
            if (!actionsContainer.querySelector('[name="Like"]')) {
    // Try again after a short delay to wait for full rendering
    setTimeout(() => processMessage(messageElement), 250);
    return;
}

            const audioButton = createAudioButton(messageTextElement, messageElement);
            const divider = actionsContainer.querySelector('.actions-line');
            if (divider) {
                actionsContainer.insertBefore(audioButton, divider);
            } else {
                // Fallback if divider is not found, append to actionsContainer
                actionsContainer.appendChild(audioButton);
            }
            messageElement.classList.add('kimi-audio-added');
        }
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const messageSelector = '.segment-container';
                    if (node.matches(messageSelector)) {
                        processMessage(node);
                    }
                    // Also check for message containers within newly added nodes
                    node.querySelectorAll(messageSelector).forEach(processMessage);
                }
            });
        });
    });

    // Periodically re-scan for unprocessed message elements
    setInterval(() => {
        document.querySelectorAll('.segment-container:not(.kimi-audio-added)').forEach(processMessage);
    }, 1500); // Runs every 1.5 seconds

    // Use 'DOMContentLoaded' instead of 'load' for earlier execution,
    // as the script is set to @run-at document-start
    function initObserver() {
    const targetNode = document.body;
    if (targetNode) {
        observer.observe(targetNode, { childList: true, subtree: true });
        document.querySelectorAll('.segment-container').forEach(processMessage);
    } else {
        console.warn("Target node not found for observer!");
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initObserver);
} else {
    initObserver(); // Already loaded
}
})();
