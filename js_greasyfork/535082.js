// ==UserScript==
// @name         Grok Message Text-to-Speech
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds text-to-speech to Grok messages (English voice only).
// @author       CHJ85
// @match        https://grok.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @connect      texttospeech.responsivevoice.org
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/535082/Grok%20Message%20Text-to-Speech.user.js
// @updateURL https://update.greasyfork.org/scripts/535082/Grok%20Message%20Text-to-Speech.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Grok TTS script started (Web Audio API version).");

    // Global state to manage the currently playing audio
    let activePlayback = {
        source: null, // The AudioBufferSourceNode
        context: null, // The AudioContext
        buffer: null, // The AudioBuffer (needed for resume)
        startTime: 0, // Position in buffer where playback started (used for resume offset)
        startContextTime: 0, // Context time when playback started (used to calculate current position)
        pausedTime: 0, // Position in buffer where playback was paused
        button: null, // Reference to the button element that started playback
        messageElement: null, // Reference to the message element containing the button
        isPlaying: false, // Simple state flag
        stopReason: null // Added flag: 'paused' or null (finished naturally/cancelled)
    };

    // Function to create the SVG icon for the audio (play) button
    function createAudioSVG() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "16");
        svg.setAttribute("height", "16");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "2");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");
        svg.classList.add("lucide", "lucide-volume-2", "size-4"); // Volume icon class

        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygon.setAttribute("points", "11 5 6 9 2 9 2 15 6 15 11 19 11 5");
        svg.appendChild(polygon);

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07");
        svg.appendChild(path);

        return svg;
    }

    // Function to create the SVG icon for the pause button
    function createPauseSVG() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "16");
        svg.setAttribute("height", "16");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "2");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");
        svg.classList.add("lucide", "lucide-pause", "size-4"); // Pause icon class

        const rect1 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect1.setAttribute("x", "6");
        rect1.setAttribute("y", "4");
        rect1.setAttribute("width", "4");
        rect1.setAttribute("height", "16");
        svg.appendChild(rect1);

        const rect2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect2.setAttribute("x", "14");
        rect2.setAttribute("y", "4");
        rect2.setAttribute("width", "4");
        rect2.setAttribute("height", "16");
        svg.appendChild(rect2);

        return svg;
    }

    // Helper function to swap the icon inside a button
    function replaceButtonIcon(buttonElement, newSvgElement) {
        const span = buttonElement.querySelector('span');
        if (span && span.firstElementChild) {
            span.replaceChild(newSvgElement, span.firstElementChild);
        }
    }

    // Function to create the audio button element
    function createAudioButton(messageTextElement, messageElement) {
        const button = document.createElement('button');

        // Copy classes for styling and visibility on hover/focus
        button.classList.add(
            'inline-flex', 'items-center', 'justify-center', 'gap-2', 'whitespace-nowrap', 'text-sm',
            'font-medium', 'leading-[normal]', 'cursor-pointer', 'focus-visible:outline-none',
            'focus-visible:ring-1', 'focus-visible:ring-ring', 'disabled:cursor-not-allowed',
            'transition-colors', 'duration-100', '[&_svg]:duration-100', '[&_svg]:pointer-events-none',
            '[&_svg]:shrink-0', '[&_svg]:-mx-0.5', 'select-none', 'text-fg-secondary',
            'hover:text-fg-primary', 'hover:bg-button-ghost-hover', 'disabled:hover:text-fg-secondary',
            'disabled:hover:bg-transparent', '[&_svg]:hover:text-fg-primary', 'h-8', 'w-8',
            'rounded-full', 'opacity-0',
            'group-focus-within:opacity-100', 'group-hover:opacity-100',
            '[.last-response_&]:opacity-100', 'disabled:opacity-0', 'group-focus-within:disabled:opacity-60',
            'group-hover:disabled:opacity-60', '[.last-response_&]:disabled:opacity-60'
        );

        button.setAttribute('type', 'button');
        button.setAttribute('aria-label', 'Listen to message');
        // Custom class for identification
        button.classList.add('grok-tts-button');

        const span = document.createElement('span');
        span.style.opacity = '1';
        span.style.transform = 'none';

        const svg = createAudioSVG(); // Start with the play icon
        span.appendChild(svg);
        button.appendChild(span);

        // Add the click event listener
        button.addEventListener('click', async () => {
            console.log("Grok TTS button clicked!");

            const clickedButton = button;
            const clickedMessageElement = messageElement; // Use the message element passed in

            // --- Handle Pause/Resume Logic ---
            // Check if this button's message is the one currently playing or paused
            if (activePlayback.messageElement === clickedMessageElement) {
                if (activePlayback.isPlaying) {
                    // This button is currently playing, so pause it
                    console.log("Pausing playback.");
                    const elapsedContextTime = activePlayback.context.currentTime - activePlayback.startContextTime;
                    activePlayback.pausedTime = activePlayback.startTime + elapsedContextTime; // Calculate pause time

                    console.log(`Paused at buffer time: ${activePlayback.pausedTime.toFixed(3)}s (elapsed context time: ${elapsedContextTime.toFixed(3)}s)`);

                    // Set stopReason BEFORE stopping
                    activePlayback.stopReason = 'paused';
                    activePlayback.source.stop(); // Stop the current source (triggers onended)
                    // isPlaying will be set to false in the onended handler if stopReason is 'paused'
                    // The icon will be changed in the onended handler if stopReason is 'paused'
                    return; // Stop here, don't proceed to start new playback
                } else if (activePlayback.pausedTime > 0) {
                    // This button was paused, resume playback from paused position
                    console.log("Resuming playback from", activePlayback.pausedTime.toFixed(3), "seconds.");
                    console.log("AudioContext state before resume:", activePlayback.context ? activePlayback.context.state : 'null');

                    // Ensure we have a context and buffer from the paused state
                    if (activePlayback.context && activePlayback.buffer) {
                        // Check context state and resume if necessary
                        if (activePlayback.context.state === 'suspended') {
                            console.log("AudioContext suspended, attempting to resume context.");
                            try {
                                await activePlayback.context.resume();
                                console.log("AudioContext resumed.");
                            } catch (e) {
                                console.error("Failed to resume AudioContext:", e);
                                // Cannot resume, reset state and icon
                                activePlayback = { source: null, context: null, buffer: null, startTime: 0, startContextTime: 0, pausedTime: 0, button: null, messageElement: null, isPlaying: false, stopReason: null };
                                replaceButtonIcon(clickedButton, createAudioSVG());
                                return; // Cannot proceed with resume
                            }
                        } else if (activePlayback.context.state !== 'running') {
                             // Handle other unexpected states if necessary, though 'suspended' is most common
                             console.warn("AudioContext in unexpected state:", activePlayback.context.state, "Resetting state.");
                             activePlayback = { source: null, context: null, buffer: null, startTime: 0, startContextTime: 0, pausedTime: 0, button: null, messageElement: null, isPlaying: false, stopReason: null };
                             replaceButtonIcon(clickedButton, createAudioSVG());
                             return;
                        }


                        // Proceed with creating and starting the source now that context is hopefully running
                        const newSource = activePlayback.context.createBufferSource();
                        newSource.buffer = activePlayback.buffer;
                        newSource.connect(activePlayback.context.destination);

                        // Update global state for resumed playback
                        activePlayback.source = newSource;
                        activePlayback.startTime = activePlayback.pausedTime; // Start from where it was paused
                        activePlayback.startContextTime = activePlayback.context.currentTime; // Record new start time
                        activePlayback.isPlaying = true;
                        activePlayback.pausedTime = 0; // Reset paused time as we are now resuming

                        // Set onended handler for the NEW source node
                        newSource.onended = () => {
                            console.log("Playback finished or stopped.");
                            // Only reset state and icon if this source is the one currently active
                            if (activePlayback.source === newSource) {
                                if (activePlayback.stopReason === 'paused') {
                                     console.log("Playback was paused, preserving state for resume.");
                                     activePlayback.stopReason = null; // Clear the reason
                                     activePlayback.source = null; // Nullify the finished source node
                                     activePlayback.isPlaying = false; // Ensure isPlaying is false after pause
                                     // Icon already changed on click
                                } else {
                                    console.log("Playback finished naturally, resetting state.");
                                    replaceButtonIcon(clickedButton, createAudioSVG());
                                    // Reset global state
                                    activePlayback = { source: null, context: null, buffer: null, startTime: 0, startContextTime: 0, pausedTime: 0, button: null, messageElement: null, isPlaying: false, stopReason: null };
                                }
                            } else {
                                console.log("Ended event for a non-current source. Ignoring state reset.");
                            }
                        };

                        try {
                            console.log(`Attempting to resume start at offset: ${activePlayback.startTime.toFixed(3)}s`);
                            // start(when, offset, duration) - start immediately (0), from calculated offset
                            newSource.start(0, activePlayback.startTime);
                            replaceButtonIcon(clickedButton, createPauseSVG()); // Change icon to pause
                            console.log("Resumed playback started.");
                        } catch (e) {
                            console.error("Error starting resumed playback:", e);
                            replaceButtonIcon(clickedButton, createAudioSVG()); // Reset icon on error
                            // Reset global state on error
                            activePlayback = { source: null, context: null, buffer: null, startTime: 0, startContextTime: 0, pausedTime: 0, button: null, messageElement: null, isPlaying: false, stopReason: null };
                        }
                    } else {
                       console.error("Could not resume: AudioContext or Buffer not available from previous state.");
                       // Reset state as we cannot resume
                       activePlayback = { source: null, context: null, buffer: null, startTime: 0, startContextTime: 0, pausedTime: 0, button: null, messageElement: null, isPlaying: false, stopReason: null };
                       replaceButtonIcon(clickedButton, createAudioSVG()); // Reset icon on error
                    }
                    return; // Stop here, playback resumed
                }
            }


            // --- Handle Stop Current and Start New Playback ---
            // If we reach here, it means we need to start new playback (either first time, clicking a different button, or resume failed)

            // Stop any currently active playback first
            if (activePlayback.source) {
                console.log("Stopping current playback to start new one.");
                // Set stopReason to null before stopping, so onended knows it's not a pause
                activePlayback.stopReason = null;
                activePlayback.source.stop();
                 // The onended handler for the OLD source will now reset the state
                // The icon of the OLD button will be reset in the onended handler
            }

            // Reset the global state immediately before starting a NEW playback cycle
            // This ensures a clean slate if the previous state was messed up or from a different message
             activePlayback = { source: null, context: null, buffer: null, startTime: 0, startContextTime: 0, pausedTime: 0, button: null, messageElement: null, isPlaying: false, stopReason: null };


            // Now, start the new playback for the clicked button
            console.log("Starting new playback.");

            // Disable the button while fetching/processing
            clickedButton.disabled = true;
             replaceButtonIcon(clickedButton, createPauseSVG()); // Assume success and show pause icon immediately


            const text = messageTextElement.textContent;
            const cleanedText = text.replace(/[\u200B-\u200D\uFEFF]/g, ''); // Remove zero-width spaces
            const encodedText = encodeURIComponent(cleanedText);
            const audioUrl = `https://texttospeech.responsivevoice.org/v1/text:synthesize?lang=en-GB&engine=g1&pitch=0.5&rate=0.5&volume=1&key=kvfbSITh&gender=male&text=${encodedText}`; // Note: Key might need proper handling if exposed/used publicly

            console.log("Generated audio URL for fetch:", audioUrl.substring(0, 200) + (audioUrl.length > 200 ? '...' : ''));

            try {
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: audioUrl,
                        responseType: "arraybuffer",
                        onload: resolve,
                        onerror: reject,
                        ontimeout: reject
                    });
                });

                clickedButton.disabled = false; // Re-enable button after fetch attempt
                console.log("GM_xmlhttpRequest onload status:", response.status);

                if (response.status === 200) {
                    const audioData = response.response;
                    console.log("Received audio data (ArrayBuffer).");

                    try {
                        // Create a new AudioContext for this playback session if one doesn't exist or is closed
                        let audioContext = activePlayback.context;
                        if (!audioContext || audioContext.state === 'closed') {
                             audioContext = new (window.AudioContext || window.webkitAudioContext)();
                             console.log("New AudioContext created.");
                        }

                         // Ensure context is running (important for first playback)
                         if (audioContext.state === 'suspended') {
                             console.log("AudioContext suspended, attempting to resume context for initial play.");
                              try {
                                 await audioContext.resume();
                                 console.log("AudioContext resumed.");
                             } catch (e) {
                                console.error("Failed to resume AudioContext for initial play:", e);
                                 // Cannot proceed, reset icon and state
                                 replaceButtonIcon(clickedButton, createAudioSVG());
                                 activePlayback = { source: null, context: null, buffer: null, startTime: 0, startContextTime: 0, pausedTime: 0, button: null, messageElement: null, isPlaying: false, stopReason: null };
                                 return; // Stop execution
                             }
                         }


                        const audioBuffer = await audioContext.decodeAudioData(audioData);
                        console.log("Audio data decoded successfully.");

                        const source = audioContext.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(audioContext.destination);

                        // Update global state BEFORE starting playback
                        activePlayback.source = source;
                        activePlayback.context = audioContext; // Store the context
                        activePlayback.buffer = audioBuffer; // Store buffer for potential resume
                        activePlayback.startTime = 0; // Starting from the beginning
                        activePlayback.startContextTime = audioContext.currentTime; // Record context time at start
                        activePlayback.button = clickedButton;
                        activePlayback.messageElement = clickedMessageElement;
                        activePlayback.isPlaying = true;
                        activePlayback.pausedTime = 0; // Ensure paused time is 0 for a new start
                        activePlayback.stopReason = null; // Ensure stop reason is null for a new start


                        // Set the onended handler for the newly created source
                        source.onended = () => {
                            console.log("Playback finished or stopped.");
                             // Only reset state and icon if this source is the one currently active
                             // and it wasn't a pause initiated stop
                            if (activePlayback.source === source) {
                                if (activePlayback.stopReason === 'paused') {
                                    console.log("Playback was paused, preserving state for resume.");
                                    activePlayback.stopReason = null; // Clear the reason
                                    activePlayback.source = null; // Nullify the finished source node
                                    activePlayback.isPlaying = false; // Ensure isPlaying is false after pause
                                    // Icon already changed on click
                                } else {
                                    console.log("Playback finished naturally, resetting state.");
                                    replaceButtonIcon(clickedButton, createAudioSVG());
                                    // Reset global state
                                    activePlayback = { source: null, context: null, buffer: null, startTime: 0, startContextTime: 0, pausedTime: 0, button: null, messageElement: null, isPlaying: false, stopReason: null };
                                }
                            } else {
                                console.log("Ended event for a non-current source. Ignoring state reset.");
                            }
                        };

                        console.log("Attempting to play audio via Web Audio API...");
                        source.start(0); // Play immediately from the beginning
                        // replaceButtonIcon(clickedButton, createPauseSVG()); // Icon changed earlier, move back here if you want to wait for success

                    } catch (audioError) {
                        console.error("Error decoding or playing audio with Web Audio API:", audioError);
                        clickedButton.disabled = false; // Re-enable button on error
                        replaceButtonIcon(clickedButton, createAudioSVG()); // Reset icon on error
                        // Reset global state on error
                        activePlayback = { source: null, context: null, buffer: null, startTime: 0, startContextTime: 0, pausedTime: 0, button: null, messageElement: null, isPlaying: false, stopReason: null };
                    }

                } else {
                    console.error(`Failed to fetch audio data: HTTP status ${response.status}`);
                    console.error("Response details:", response);
                    clickedButton.disabled = false; // Re-enable button on error
                    replaceButtonIcon(clickedButton, createAudioSVG()); // Reset icon on error
                    // Reset global state on error
                    activePlayback = { source: null, context: null, buffer: null, startTime: 0, startContextTime: 0, pausedTime: 0, button: null, messageElement: null, isPlaying: false, stopReason: null };
                }

            } catch (gmError) {
                console.error("GM_xmlhttpRequest network or timeout error:", gmError);
                clickedButton.disabled = false; // Re-enable button on error
                replaceButtonIcon(clickedButton, createAudioSVG()); // Reset icon on error
                // Reset global state on error
                activePlayback = { source: null, context: null, buffer: null, startTime: 0, startContextTime: 0, pausedTime: 0, button: null, messageElement: null, isPlaying: false, stopReason: null };
            }
        });

        return button;
    }

    // Function to process a single message container element
    function processMessage(messageElement) {
        // Check if we've already added the button to this message
        if (messageElement.classList.contains('grok-audio-added')) {
            return;
        }

        // Find the message text element (the <p> tag inside the message bubble)
        const messageTextElement = messageElement.querySelector('.message-bubble p');
        // Find the container where the action buttons are
        const actionsContainer = messageElement.querySelector('.flex.flex-row.flex-wrap > .flex.items-center.gap-\\[2px\\]');

        if (messageTextElement && actionsContainer) {
            console.log("Found message and actions, adding TTS button.");
            // Create the audio button and pass the text and message element references
            const audioButton = createAudioButton(messageTextElement, messageElement);

            if (audioButton) {
                // Append the new button to the actions container
                actionsContainer.appendChild(audioButton);

                // Mark this message element so we don't process it again
                messageElement.classList.add('grok-audio-added');
                console.log("Audio button added and message marked.");
            } else {
                console.error("Failed to create audio button element.");
            }

        } else {
             // console.log("Could not find necessary elements for message processing on a potential message element.");
        }
    }

    // Set up a MutationObserver to watch for new nodes being added to the DOM
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if the added node itself is a message container
                        if (node.matches('.relative.group.flex.flex-col')) {
                            processMessage(node);
                        }
                        // Also check if the added node contains message containers
                        node.querySelectorAll('.relative.group.flex.flex-col').forEach(processMessage);
                    }
                });
            }
        });
    });

    // Start observing the body for changes
    console.log("Starting MutationObserver on document.body");
    observer.observe(document.body, { childList: true, subtree: true });
    console.log("MutationObserver started.");


    // Also process any messages that might already be present when the script runs
    console.log("Processing existing messages on page load.");
    document.querySelectorAll('.relative.group.flex.flex-col').forEach(processMessage);
    console.log("Finished processing existing messages.");


})();