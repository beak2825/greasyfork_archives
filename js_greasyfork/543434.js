// ==UserScript==
// @name         Pixeldrain SRT Subtitle Injector
// @namespace    http://tampermonkey.net/
// @version      2.3.2
// @license MIT
// @description  Injects local SRT/VTT files as fully styled, native <track> elements. Works with direct player bypass.
// @author       medy17
// @match        *://pixeldrain.com/u/*
// @match        *://pixeldrain.com/l/*
// @icon         https://pixeldrain.com/res/img/pixeldrain_196.png
// @resource     NetflixSans https://github.com/skb10x/Netflix-Sans-FONT-CSS-FontFace/raw/refs/heads/main/Netflix%20Sans%20Medium.ttf
// @grant        unsafeWindow
// @grant        GM_getResourceURL
// @downloadURL https://update.greasyfork.org/scripts/543434/Pixeldrain%20SRT%20Subtitle%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/543434/Pixeldrain%20SRT%20Subtitle%20Injector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let video = null;
    let uiInitialized = false;
    let activeSubtitleTrack = null;
    let activeBlobUrl = null;

    // Variables for direct player support
    let preloadedSubtitles = null;
    let preloadedFileName = null;
    let isDirectPlayerMode = false;

    function srtToVtt(srtText) {
        return 'WEBVTT\n\n' + srtText
            .replace(/\r\n/g, '\n')
            .replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2');
    }

    function clearSubtitles() {
        if (activeSubtitleTrack && activeSubtitleTrack.parentNode) {
            activeSubtitleTrack.parentNode.removeChild(activeSubtitleTrack);
            activeSubtitleTrack = null;
        }
        if (activeBlobUrl) {
            URL.revokeObjectURL(activeBlobUrl);
            activeBlobUrl = null;
        }
    }

    function injectSubtitles(subtitleText, targetVideo = null) {
        const videoElement = targetVideo || video;
        if (!videoElement) {
            console.log("SRT Injector: No video element available for subtitle injection");
            return;
        }

        // Clear existing subtitles from the target video
        const existingTracks = videoElement.querySelectorAll('track[label="Local (Custom)"]');
        existingTracks.forEach(track => track.remove());

        // Revoke old blob URL if it exists
        if (activeBlobUrl) {
            URL.revokeObjectURL(activeBlobUrl);
        }

        const vttText = srtToVtt(subtitleText);
        const subtitleBlob = new Blob([vttText], { type: 'text/vtt' });
        activeBlobUrl = URL.createObjectURL(subtitleBlob);

        const track = document.createElement('track');
        track.kind = 'subtitles';
        track.label = 'Local (Custom)';
        track.srclang = 'en';
        track.src = activeBlobUrl;
        track.default = true;

        activeSubtitleTrack = track;
        videoElement.appendChild(track);

        // Enable the track
        if (videoElement.textTracks && videoElement.textTracks.length > 0) {
            for (let i = 0; i < videoElement.textTracks.length; i++) {
                if (videoElement.textTracks[i].label === 'Local (Custom)') {
                    videoElement.textTracks[i].mode = 'showing';
                    break;
                }
            }
        }

        console.log("SRT Injector: Subtitles injected successfully");
    }

    function preloadSubtitles(subtitleText, fileName) {
        preloadedSubtitles = subtitleText;
        preloadedFileName = fileName;
        console.log(`SRT Injector: Subtitles preloaded from "${fileName}"`);
    }

    function injectCustomStyles() {
        const fontURL = GM_getResourceURL('NetflixSans');
        const style = document.createElement('style');
        style.textContent = `
          @font-face {
            font-family: 'Netflix Sans';
            src: url('${fontURL}') format('truetype');
          }

          /* Target the native subtitle track text - regular video */
          video::cue {
            font-family: 'Netflix Sans', Arial, sans-serif !important;
            font-size: 75% !important;
            background-color: transparent !important;
            text-shadow: 0 2px 5px rgba(0,0,0,0.9) !important;

            color: white !important;
          }

          /* Enhanced styling for modal context with higher z-index */
          .modal video::cue,
          .pd-player-scope video::cue {
            font-family: 'Netflix Sans', Arial, sans-serif !important;
            font-size: 75% !important;
            color: white !important;
            background-color: transparent !important;
            text-shadow: 0 2px 8px rgba(0,0,0,1) !important;
            z-index: 2147483647 !important;
            position: relative !important;
          }

          /* Ensure subtitle container has proper z-index in modals */
          .modal video::-webkit-media-text-track-display,
          .pd-player-scope video::-webkit-media-text-track-display {
            z-index: 2147483647 !important;
            position: relative !important;
          }

          /* Firefox subtitle container */
          .modal video::cue-region,
          .pd-player-scope video::cue-region {
            z-index: 2147483647 !important;
          }
            /* Toast notifications */
            .srt-toast {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 2147483647;
                padding: 12px 20px;
                border-radius: 6px;
                color: white;
                font-family: system-ui, sans-serif;
                font-size: 14px;
                font-weight: 500;
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.3s ease-in-out;
                max-width: 350px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            }

            .srt-toast.show {
                opacity: 1;
                transform: translateX(0);
            }

            .srt-toast-success {
                background-color: #198754;
            }

            .srt-toast-info {
                background-color: #0dcaf0;
            }
        `;
        document.head.appendChild(style);
    }

    function watchForDirectPlayerModal() {
        const modalObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const modal = node.querySelector('#pd-direct-player-modal') ||
                                     (node.id === 'pd-direct-player-modal' ? node : null);

                        if (modal) {
                            console.log("SRT Injector: Direct player modal detected");

                            // Multiple attempts to find and inject into the video
                            const attemptInjection = (attempt = 0) => {
                                const modalVideo = modal.querySelector('video');
                                if (modalVideo && preloadedSubtitles) {
                                    console.log("SRT Injector: Injecting preloaded subtitles into direct player");
                                    injectSubtitles(preloadedSubtitles, modalVideo);
                                } else if (attempt < 5) {
                                    // Retry up to 5 times with increasing delays
                                    setTimeout(() => attemptInjection(attempt + 1), 500 * (attempt + 1));
                                }
                            };

                            attemptInjection();
                        }
                    }
                });
            });
        });

        modalObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function detectPlayerMode() {
        // Wait 2 seconds and check if we have a video element
        setTimeout(() => {
            const mainVideo = document.querySelector('video');
            if (!mainVideo) {
                console.log("SRT Injector: No video detected after 2 seconds - assuming direct player mode");
                isDirectPlayerMode = true;
            } else {
                console.log("SRT Injector: Main video detected - normal mode");
                video = mainVideo;
                isDirectPlayerMode = false;

                // Set up video event listeners for normal mode
                video.addEventListener('loadstart', clearSubtitles);
            }
        }, 2000);
    }

    // ---- UI Integration and Initialization Logic ----
    function setupUI() {
        const toolbar = document.querySelector('.toolbar');
        const templateButton = document.querySelector('.toolbar_button');
        const separatorTemplate = document.querySelector('.toolbar .separator');

        if (!toolbar || !templateButton || !separatorTemplate) {
            return;
        }

        uiInitialized = true;
        console.log("SRT/VTT Overlay: UI Initialized. Injecting custom styles.");

        // Inject enhanced styles for both normal and modal contexts
        injectCustomStyles();

        // Start detection and modal watching
        detectPlayerMode();
        watchForDirectPlayerModal();

        // --- Set up the hidden file input ---
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.srt,.vtt';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);

        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const subtitleText = e.target.result;

                    // Always preload subtitles for flexibility
                    preloadSubtitles(subtitleText, file.name);

                    // If we have a current video and not in direct player mode, also inject immediately
                    if (video && !isDirectPlayerMode) {
                        injectSubtitles(subtitleText);
                        showToast(`Loaded subtitles from "${file.name}".`, 'success');
                    } else {
                        showToast(`Subtitles from "${file.name}" preloaded for direct player.`, 'info');
                    }
                };
                reader.readAsText(file);
            }
        });

        // --- Create and inject the button into the toolbar ---
        const srtButton = templateButton.cloneNode(true);
        srtButton.removeAttribute('href');
        srtButton.removeAttribute('title');
        srtButton.querySelector('i').textContent = 'subtitles';
        srtButton.querySelector('span').textContent = 'Load Subs';

        srtButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            fileInput.click();
        });

        const newSeparator = separatorTemplate.cloneNode(true);
        separatorTemplate.parentNode.insertBefore(newSeparator, separatorTemplate.nextSibling);
        newSeparator.parentNode.insertBefore(srtButton, newSeparator.nextSibling);
    }

    function showToast(message, type = 'success') {
    // Remove any existing toast
    const existingToast = document.querySelector('.srt-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `srt-toast srt-toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);

    // Hide and remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
    }

    // --- Observer to wait for the player to be ready ---
    const masterObserver = new MutationObserver((mutations, obs) => {
        if (uiInitialized) {
            obs.disconnect();
            return;
        }

        // Only need toolbar elements to initialize UI
        if (document.querySelector('.toolbar_button')) {
            setupUI();
            obs.disconnect();
        }
    });

    masterObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
})();