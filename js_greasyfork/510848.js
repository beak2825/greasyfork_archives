// ==UserScript==
// @name         Download ChatGPT Voice Audio
// @namespace    ViolentMonkeyScript
// @match       *://chat.openai.com/*
// @match       *://chatgpt.com/*
// @version      3.5
// @description  Adds a download button for voice audio files
// @grant        none
// @run-at       document-start
// @inject-into  page
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510848/Download%20ChatGPT%20Voice%20Audio.user.js
// @updateURL https://update.greasyfork.org/scripts/510848/Download%20ChatGPT%20Voice%20Audio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Script is running at document-start');

    let shouldStopAudioPlayback = false;
    let shouldDownloadSynthesizedAudio = false;
    let currentDownloadButton = null;

    // Save the original fetch function
    const originalFetch = window.fetch;

    // Override the fetch function
    window.fetch = function(...args) {
        const resource = args[0];
        const config = args[1];

        // Get the URL from the resource
        let url = resource instanceof Request ? resource.url : resource;

        // Check if the request URL includes 'backend-api/synthesize'
        if (typeof url === 'string' && url.includes('/backend-api/synthesize')) {
            console.log('Intercepted fetch:', url);

            if (shouldDownloadSynthesizedAudio) {
                shouldDownloadSynthesizedAudio = false; // Reset the flag

                // Extract message_id from the URL parameters
                const urlParams = new URL(url, window.location.origin);
                const messageId = urlParams.searchParams.get('message_id');

                // Generate filename
                let fileName = 'response.aac'; // Default filename
                if (messageId) {
                    const prefix = messageId.split('-')[0];
                    fileName = `${prefix}.aac`;
                }

                return originalFetch(...args)
                    .then(response => {
                        // Clone the response
                        const responseClone = response.clone();

                        // Convert response to Blob and download
                        responseClone.blob().then(blob => {
                            const objectURL = URL.createObjectURL(blob);
                            console.log('Object URL:', objectURL);

                            const a = document.createElement('a');
                            a.href = objectURL;
                            a.download = fileName;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);

                            // Revoke the object URL after download
                            URL.revokeObjectURL(objectURL);

                            // Restore the button after download
                            if (currentDownloadButton) {
                                restoreDownloadButton(currentDownloadButton);
                                currentDownloadButton = null;
                            }
                        }).catch(error => {
                            console.error('Error processing the blob:', error);
                            // Restore the button on error
                            if (currentDownloadButton) {
                                restoreDownloadButton(currentDownloadButton);
                                currentDownloadButton = null;
                            }
                        });

                        // Return the original response
                        return response;
                    })
                    .catch(error => {
                        console.error('Error fetching the response:', error);
                        // Restore the button on error
                        if (currentDownloadButton) {
                            restoreDownloadButton(currentDownloadButton);
                            currentDownloadButton = null;
                        }
                        throw error;
                    });
            } else {
                // Proceed with the fetch normally
                return originalFetch(...args);
            }
        } else {
            // For other fetch requests
            return originalFetch(...args);
        }
    };

    // Wait until the DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        waitForElements();
    });

    // Monitor 'play' events on audio elements
    document.addEventListener('play', function(e) {
        const audioElement = e.target;
        if (audioElement.tagName === 'AUDIO') {
            if (shouldStopAudioPlayback) {
                audioElement.pause();
                audioElement.currentTime = 0;
                shouldStopAudioPlayback = false;
                console.log('Audio playback stopped');
            }
        }
    }, true); // Use capture phase to catch events from all elements

    // Function to wait for the elements to be available
    function waitForElements() {
        const originalButtons = document.querySelectorAll('button[data-testid="voice-play-turn-action-button"]');
        if (originalButtons && originalButtons.length > 0) {
            console.log('Original buttons are now available');
            injectNewButtons();
            observeDOM(); // Start observing after initial buttons are injected
        } else {
            console.log('Original buttons not yet available, retrying in 500ms...');
            setTimeout(waitForElements, 500);
        }
    }

    // Function to create a tooltip element
    function createTooltip(text) {
        const tooltip = document.createElement('div');
        tooltip.setAttribute('data-radix-popper-content-wrapper', '');
        tooltip.style.position = 'fixed';
        tooltip.style.left = '0px';
        tooltip.style.top = '0px';
        tooltip.style.zIndex = '50';
        tooltip.style.minWidth = 'max-content';
        tooltip.style.willChange = 'transform';
        tooltip.style.pointerEvents = 'none'; // Add this line

        const innerTooltip = document.createElement('div');
        innerTooltip.setAttribute('data-side', 'bottom');
        innerTooltip.setAttribute('data-align', 'center');
        innerTooltip.className = 'relative z-50 shadow-xs transition-opacity px-3 py-2 rounded-lg border-white/10 dark:border bg-gray-950 max-w-xs';

        const textSpan = document.createElement('span');
        textSpan.className = 'flex items-center whitespace-pre-wrap text-center font-semibold normal-case text-gray-100 text-sm';
        textSpan.textContent = text;

        const arrow = document.createElement('span');
        arrow.style.position = 'absolute';
        arrow.style.top = '0px';
        arrow.style.transformOrigin = 'center 0px';
        arrow.style.transform = 'rotate(180deg)';
        arrow.style.left = '50.5px';

        const arrowDiv = document.createElement('div');
        arrowDiv.className = 'relative top-[-4px] h-2 w-2 rotate-45 transform shadow-xs dark:border-r dark:border-b border-white/10 bg-gray-950';

        arrow.appendChild(arrowDiv);
        innerTooltip.appendChild(textSpan);
        innerTooltip.appendChild(arrow);
        tooltip.appendChild(innerTooltip);

        return tooltip;
    }

    // Function to add tooltip functionality to a button
    function addTooltipToButton(button) {
        let tooltip = null;
        let showTimeout;

        button.addEventListener('mouseenter', () => {
            showTimeout = setTimeout(() => {
                if (!tooltip) {
                    tooltip = createTooltip('Download Audio');
                    document.body.appendChild(tooltip);
                }

                const buttonRect = button.getBoundingClientRect();
                tooltip.style.transform = `translate(${buttonRect.left + buttonRect.width / 2 - 54.5}px, ${buttonRect.bottom + 8}px)`;

                tooltip.querySelector('[data-side]').setAttribute('data-state', 'delayed-open');
            }, 300);
        });

        button.addEventListener('mouseleave', () => {
            clearTimeout(showTimeout);
            if (tooltip && tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
                tooltip = null;
            }
        });
    }

    // Modified injectNewButtons function
    function injectNewButtons() {
        const originalButtons = document.querySelectorAll('button[data-testid="voice-play-turn-action-button"]');

        console.log('Number of original buttons found:', originalButtons.length);

        originalButtons.forEach(originalButton => {
            // Get the parent span of the original button
            const originalSpan = originalButton.closest('span[data-state]');

            if (!originalSpan) {
                console.error('Parent span not found for an original button!');
                return;
            }

            // Check if the download button already exists after the original span
            if (originalSpan.nextElementSibling && originalSpan.nextElementSibling.querySelector('button.download-audio-button')) {
                return;
            }

            // Create a new span for the new button
            const newSpan = document.createElement('span');
            newSpan.className = originalSpan.className; // Copy class
            newSpan.setAttribute('data-state', originalSpan.getAttribute('data-state')); // Copy data-state

            // Create the new button as before
            const newButton = document.createElement('button');
            newButton.classList.add('rounded-lg', 'text-token-text-secondary', 'hover:bg-token-main-surface-secondary', 'download-audio-button');
            newButton.setAttribute('aria-label', 'Download Audio');
            newButton.setAttribute('data-testid', 'download-audio-button');

            const span = document.createElement('span');
            span.classList.add('flex', 'h-[30px]', 'w-[30px]', 'items-center', 'justify-center');

            // Create the SVG icon for the button
            const svgNS = 'http://www.w3.org/2000/svg';
            const svg = document.createElementNS(svgNS, 'svg');
            svg.setAttribute('width', '24');
            svg.setAttribute('height', '24');
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.classList.add('icon-md-heavy');

            const path = document.createElementNS(svgNS, 'path');
            path.setAttribute('fill-rule', 'evenodd');
            path.setAttribute('clip-rule', 'evenodd');
            path.setAttribute('d', 'M5 20H19V18H5M19 9H15V3H9V9H5L12 16L19 9Z'); // Download icon path
            path.setAttribute('fill', 'currentColor');

            svg.appendChild(path);
            span.appendChild(svg);
            newButton.appendChild(span);

            // Append the new button to the new span
            newSpan.appendChild(newButton);

            // Insert the new span after the original span
            originalSpan.insertAdjacentElement('afterend', newSpan);

            // Add tooltip functionality
            addTooltipToButton(newButton);

            addClickHandler(newButton, originalButton);
        });
    }

      function addClickHandler(newButton, originalButton) {
        newButton.addEventListener('click', function() {
            console.log('Download button clicked');
            // Set the flag to stop audio playback
            shouldStopAudioPlayback = true;

            // Save reference to the current button
            currentDownloadButton = newButton;

            // Change the button to loading state
            setButtonLoadingState(newButton);

            // Record the current timestamp
            const startTime = performance.now();

            // Set the flag to download synthesized audio
            shouldDownloadSynthesizedAudio = true;

            // Simulate click on the original 'Replay' button
            originalButton.click();

            // Attempt to capture the audio URL
            waitForAudioURL(startTime).then(function(audioURL) {
                if (audioURL) {
                    // New conversation handling
                    console.log('Captured audio URL via Performance API:', audioURL);
                    downloadAudio(audioURL);
                } else {
                    // Old conversation handling
                    console.log('Attempting to download synthesized audio');
                    // The fetch override should handle the download
                    // If not, restore the button
                    setTimeout(() => {
                        if (currentDownloadButton) {
                            restoreDownloadButton(currentDownloadButton);
                            currentDownloadButton = null;
                        }
                    }, 5000); // Adjust timeout as needed
                }
            });
        });
    }

    function setButtonLoadingState(button) {
        // Disable the button
        button.disabled = true;
        button.setAttribute('aria-label', 'Loading');
        button.setAttribute('data-testid', 'loading-download-button');

        // Clear existing content
        button.innerHTML = '';

        // Create the span inside the button
        const span = document.createElement('span');
        span.classList.add('flex', 'h-[30px]', 'w-[30px]', 'items-center', 'justify-center');

        // Create the loading spinner SVG
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke-width', '2');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');
        svg.classList.add('animate-spin', 'text-center', 'icon-md-heavy');
        svg.setAttribute('height', '1em');
        svg.setAttribute('width', '1em');

        // Add lines to the spinner SVG
        const lines = [
            { x1: 12, y1: 2, x2: 12, y2: 6 },
            { x1: 12, y1: 18, x2: 12, y2: 22 },
            { x1: 4.93, y1: 4.93, x2: 7.76, y2: 7.76 },
            { x1: 16.24, y1: 16.24, x2: 19.07, y2: 19.07 },
            { x1: 2, y1: 12, x2: 6, y2: 12 },
            { x1: 18, y1: 12, x2: 22, y2: 12 },
            { x1: 4.93, y1: 19.07, x2: 7.76, y2: 16.24 },
            { x1: 16.24, y1: 7.76, x2: 19.07, y2: 4.93 },
        ];

        lines.forEach(lineData => {
            const line = document.createElementNS(svgNS, 'line');
            line.setAttribute('x1', lineData.x1);
            line.setAttribute('y1', lineData.y1);
            line.setAttribute('x2', lineData.x2);
            line.setAttribute('y2', lineData.y2);
            svg.appendChild(line);
        });

        // Append the SVG to the span
        span.appendChild(svg);

        // Append the span to the button
        button.appendChild(span);
    }

    function restoreDownloadButton(button) {
        // Enable the button
        button.disabled = false;
        button.setAttribute('aria-label', 'Download Audio');
        button.setAttribute('data-testid', 'download-audio-button');

        // Clear existing content
        button.innerHTML = '';

        // Create the span inside the button
        const span = document.createElement('span');
        span.classList.add('flex', 'h-[30px]', 'w-[30px]', 'items-center', 'justify-center');

        // Create the SVG element (download icon)
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('width', '24');
        svg.setAttribute('height', '24');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.classList.add('icon-md-heavy');

        // Create the path element
        const path = document.createElementNS(svgNS, 'path');
        path.setAttribute('fill-rule', 'evenodd');
        path.setAttribute('clip-rule', 'evenodd');
        path.setAttribute('d', 'M5 20H19V18H5M19 9H15V3H9V9H5L12 16L19 9Z'); // Download icon path
        path.setAttribute('fill', 'currentColor');

        // Append the path to the SVG
        svg.appendChild(path);

        // Append the SVG to the span
        span.appendChild(svg);

        // Append the span to the button
        button.appendChild(span);
    }

    function downloadAudio(url) {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const objectURL = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = objectURL;
                a.download = 'audio.wav'; // Customize the filename if needed
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(objectURL);
                console.log('Audio download completed');
                if (currentDownloadButton) {
                    restoreDownloadButton(currentDownloadButton);
                    currentDownloadButton = null;
                }
            })
            .catch(error => {
                console.error('Audio download failed', error);
                if (currentDownloadButton) {
                    restoreDownloadButton(currentDownloadButton);
                    currentDownloadButton = null;
                }
            });
    }

    function waitForAudioURL(startTime, timeout = 5000) {
        return new Promise(function(resolve, reject) {
            const interval = 100;
            let elapsedTime = 0;

            const checkURL = setInterval(function() {
                const audioURL = getLatestAudioRequestURL(startTime);
                if (audioURL) {
                    clearInterval(checkURL);
                    resolve(audioURL);
                } else if (elapsedTime >= timeout) {
                    clearInterval(checkURL);
                    resolve(null);
                } else {
                    elapsedTime += interval;
                }
            }, interval);
        });
    }

    function getLatestAudioRequestURL(startTime) {
        const entries = performance.getEntriesByType('resource');
        for (let i = entries.length - 1; i >= 0; i--) {
            const entry = entries[i];
            if (entry.startTime < startTime) {
                break;
            }
            // Check for any oaiusercontent.com URL
            if (entry.name.includes('oaiusercontent.com')) {
                console.log('Captured audio URL via Performance API:', entry.name);
                return entry.name;
            }
        }
        return null;
    }

    function observeDOM() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                // Check if added nodes contain new 'Replay' buttons
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches('button[data-testid="voice-play-turn-action-button"]') ||
                            node.querySelector('button[data-testid="voice-play-turn-action-button"]')) {
                            console.log('New Replay button detected, injecting Download buttons...');
                            injectNewButtons();
                        }
                    }
                });
            });
        });

        const threadsContainer = document.body; // Adjust this selector if necessary
        if (threadsContainer) {
            observer.observe(threadsContainer, {
                childList: true,
                subtree: true
            });
            console.log('MutationObserver is now observing the DOM for changes.');
        } else {
            console.error('Threads container not found for MutationObserver!');
        }
    }

})();