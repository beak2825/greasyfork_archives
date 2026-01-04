// ==UserScript==
// @name         Geoguessr Fast Move
// @description  Hold Shift to move quickly, matching spacebar trick speed. Drives towards user heading direction, rather than following pano chain. Disabled in NM / NMPZ modes.
// @version      3.0
// @author       James C
// @match        *://*.geoguessr.com/*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?domain=geoguessr.com
// @grant        none
// @license      MIT
// @namespace    http://tampermonkey.net/
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/534308/Geoguessr%20Fast%20Move.user.js
// @updateURL https://update.greasyfork.org/scripts/534308/Geoguessr%20Fast%20Move.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const MOVE_ATTEMPT_DELAY_MS = 10; // Delay AFTER successful pano_changed before attempting next move. (Lower = potentially faster but might need more retries)
    const MAX_ANGLE_DIFF = 160;        // Angle tolerance for choosing next link. Higher = follows curves easier, Lower = stricter path.
    const ENABLE_LOGGING = false;     // SET TO FALSE for normal use. Set true for debugging/timing.
    const ENABLE_MANUAL_LOG_MODE = false; // SET TO FALSE for normal use. Set true + hold Ctrl to time manual moves.
    const MANUAL_LOG_KEY = 'Control'; // Key to hold for manual logging mode.
    const STUCK_RETRY_DELAY_MS = 25;  // Delay before retrying if no link OR only self-link found. (Lower = recovers faster)
    const INSTANCE_WAIT_TIMEOUT = 3000; // Max time (ms) to wait for StreetView instance on startup.
    const INSTANCE_CHECK_INTERVAL = 100; // How often (ms) to check for instance if initially missing.
    // --- End Configuration ---

    let JCStreetViewInstance = null;
    let isMoving = false;
    let previousPanoId = null;
    let googleMapsApiLoaded = false;
    let scriptStartTime = null;
    let scriptMoveCounter = 0;
    let isLoggingManual = false;
    let manualStartTime = null;
    let manualMoveCounter = 0;
    let lastLoggedManualPano = null;
    let isWaitingForInstance = false;
    let moveTimeoutId = null; // Stores setTimeout ID for next attempt

    // Logging functions
    function log(...args) { if (ENABLE_LOGGING) console.log('[FastMove]', ...args); }
    function errorLog(...args) { console.error('[FastMove]', ...args); } // Always log errors

    log("Script starting execution.");

    // --- Google Maps API Injection & Override ---
    function findAndOverrideGoogleMaps(overrider) {
        log("Setting up MutationObserver...");
        const observer = new MutationObserver((mutations, obs) => {
            const googleScript = mutations.flatMap(m => Array.from(m.addedNodes)).find(node => node.tagName === 'SCRIPT' && node.src?.startsWith('https://maps.googleapis.com/'));
            if (googleScript) {
                 log("Google Maps API script tag found:", googleScript.src);
                 const oldOnload = googleScript.onload;
                 googleScript.onload = (event) => {
                      log("Google Maps API script onload event fired.");
                      if (window.google && window.google.maps && !googleMapsApiLoaded) {
                           googleMapsApiLoaded = true; obs.disconnect(); log("MutationObserver disconnected.");
                           try { log("Calling API overrider function."); overrider(window.google); } catch (e) { errorLog("Error during override call:", e); }
                      } else if (!googleMapsApiLoaded) { log("WARNING: onload fired but maps not found yet."); }
                      if (typeof oldOnload === 'function') { try { oldOnload.call(googleScript, event); } catch (e) { errorLog("Error calling original onload:", e); } }
                 };
                 if (window.google && window.google.maps && !googleMapsApiLoaded) {
                     log("Google Maps API likely already loaded...");
                     if(googleScript.onload !== oldOnload || typeof oldOnload !== 'function') { googleScript.onload(null); } else { log("Manual trigger skipped."); }
                 } else if (!googleMapsApiLoaded) { log("API object not present yet..."); }
            }
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
    }
    function overrideStreetViewPanorama(google) {
        log("Attempting to override google.maps.StreetViewPanorama...");
        if (!google || !google.maps || !google.maps.StreetViewPanorama) { errorLog("Cannot override: google.maps.StreetViewPanorama not found!"); return; }
        const original = google.maps.StreetViewPanorama;
        google.maps.StreetViewPanorama = class CustomStreetViewPanorama extends original {
            constructor(...args) {
                log(">>> Custom StreetViewPanorama constructor CALLED.");
                super(...args);
                JCStreetViewInstance = this;
                log(">>> JCStreetViewInstance ASSIGNED:", JCStreetViewInstance ? "Success" : "Failed");
                this.addListener('pano_changed', handlePanoChange);
                this.addListener('position_changed', () => {}); // Can add logging here if needed
                log("Listeners added.");
            }
        };
        log("StreetViewPanorama overridden successfully.");
    }

    // --- Pano Change Handler (Drives the loop) ---
    function handlePanoChange() {
        const newPanoId = JCStreetViewInstance?.getPano();
        if (!newPanoId) return;

        // Log manual move if applicable
        if (ENABLE_MANUAL_LOG_MODE && isLoggingManual && newPanoId !== lastLoggedManualPano) {
            manualMoveCounter++; const elapsed = manualStartTime ? Date.now() - manualStartTime : 0;
            log(`Manual Move #${manualMoveCounter}: -> ${newPanoId} (Elapsed: ${elapsed}ms)`);
            lastLoggedManualPano = newPanoId;
        }

        // If the script is running, schedule the next move attempt
        if (isMoving) {
            log(`Pano Change Confirmed: ${newPanoId}. Scheduling next move attempt.`);
            if (moveTimeoutId) clearTimeout(moveTimeoutId);
            moveTimeoutId = setTimeout(attemptMove, MOVE_ATTEMPT_DELAY_MS);
        }
    }

    // --- Start/Stop Script Movement ---
    function startMoving() {
        if (isMoving || isLoggingManual || isWaitingForInstance) return; // Prevent multiple starts/interference
        if (!JCStreetViewInstance) {
            log("Instance not ready on Shift press. Waiting...");
            isWaitingForInstance = true;
            const waitStartTime = Date.now();
            const intervalId = setInterval(() => {
                if (!JCStreetViewInstance) { // Try DOM query as fallback
                    // Attempt to find the instance via DOM element if necessary
                    const el = document.querySelector('[class*="street-view-container_root"]'); // Example generic selector
                    if (el && el.__panorama && el.__panorama.addListener) { // Check if it looks like a pano instance
                       JCStreetViewInstance = el.__panorama;
                       log("Found instance via DOM query fallback.");
                    }
                }
                if (JCStreetViewInstance) { // Instance found!
                    clearInterval(intervalId); isWaitingForInstance = false;
                    log(`Instance ready after ${Date.now() - waitStartTime}ms.`);
                    executeStartMoving();
                } else if (Date.now() - waitStartTime > INSTANCE_WAIT_TIMEOUT) { // Timeout
                    clearInterval(intervalId); isWaitingForInstance = false;
                    errorLog(`Instance not found after ${INSTANCE_WAIT_TIMEOUT}ms timeout. Cannot start moving.`);
                }
            }, INSTANCE_CHECK_INTERVAL);
            return; // Wait for interval to succeed or fail
        }
        executeStartMoving(); // Instance was ready immediately
    }

    function executeStartMoving() {
         if (!JCStreetViewInstance) { errorLog("ExecuteStartMoving: Instance missing!"); return; } // Final safety check
        isMoving = true;
        previousPanoId = null; // Reset previous ID
        scriptMoveCounter = 0;
        scriptStartTime = Date.now();
        const initialPano = JCStreetViewInstance.getPano();
        log(`SCRIPT Movement STARTED. Time: ${scriptStartTime}. Initial Pano: ${initialPano || 'Unknown'}`);
        log("Triggering first move attempt.");
        attemptMove(); // Start the event chain
    }

    function stopMoving() {
        if (!isMoving) return; // Only stop if actually moving
        const endTime = Date.now();
        const duration = scriptStartTime ? endTime - scriptStartTime : 0;
        isMoving = false;
        if (moveTimeoutId) { // Clear any pending move attempt
            clearTimeout(moveTimeoutId);
            moveTimeoutId = null;
            log("Pending move attempt cleared.");
        }
        previousPanoId = null;
        log(`SCRIPT Movement STOPPED. Time: ${endTime}. Duration: ${duration}ms. Successful moves: ${scriptMoveCounter}.`);
        scriptStartTime = null;
    }

    // --- Core Movement Logic ---
    function attemptMove() {
        moveTimeoutId = null; // Clear ID, as we are executing this attempt

        // Check essential conditions
        if (!isMoving || !JCStreetViewInstance) { if (isMoving) stopMoving(); return; }

        try {
            const currentPano = JCStreetViewInstance.getPano();
            if (!currentPano) { log("AttemptMove: Failed to get currentPano."); scheduleRetry(); return; } // Retry if pano ID fails

            const pov = JCStreetViewInstance.getPov();
            if (!pov) { log(`AttemptMove: Failed to get POV for ${currentPano}.`); scheduleRetry(); return; } // Retry if POV fails

            if (typeof JCStreetViewInstance.getLinks !== 'function') { errorLog("getLinks not a function!"); stopMoving(); return; } // Fatal error
            const links = JCStreetViewInstance.getLinks();

            let currentHeading = pov.heading; currentHeading = (currentHeading % 360 + 360) % 360;
            let bestLink = null; let minDiff = MAX_ANGLE_DIFF;
            let foundValidLink = false;

            log(`Attempting move from ${currentPano}. Heading: ${currentHeading.toFixed(1)}`);

            if (Array.isArray(links)) {
                for (const link of links) {
                    if (!link || typeof link.pano !== 'string' || typeof link.heading !== 'number') continue;
                    // Skip immediate U-turn
                    if (link.pano === previousPanoId) { log(`  Skipping link to previous: ${link.pano}`); continue; }

                    let linkHeading = link.heading; linkHeading = (linkHeading % 360 + 360) % 360;
                    let diff = Math.abs(currentHeading - linkHeading); if (diff > 180) diff = 360 - diff;

                    if (diff < minDiff) {
                        minDiff = diff; bestLink = link;
                         log(`  Found potential link: ${link.pano} (Diff: ${minDiff.toFixed(1)})`);
                    }
                }
            } else { log(`  No links array found for ${currentPano}.`); }

            // --- Decision ---
            if (bestLink) {
                // Avoid moving to the *exact same* pano (can happen with API glitches)
                if (bestLink.pano === currentPano) {
                    log(`Script Move: Avoided self-move ${currentPano}`);
                    // Continue to retry logic below
                } else {
                    // Execute the valid move
                    log(`>>> Executing Move: ${currentPano} -> ${bestLink.pano} (Diff: ${minDiff.toFixed(1)})`);
                    scriptMoveCounter++;
                    previousPanoId = currentPano; // Record the pano we are leaving
                    JCStreetViewInstance.setPano(bestLink.pano); // Trigger the move
                    foundValidLink = true; // Mark success
                    // The handlePanoChange listener will schedule the next attempt
                }
            } else {
                log(`Script Move: No suitable link found from ${currentPano} within ${MAX_ANGLE_DIFF} degrees.`);
                // Continue to retry logic below
            }

            // Schedule a retry if no valid move was executed
            if (!foundValidLink) {
                scheduleRetry();
            }

        } catch (e) { errorLog("Error during move attempt:", e); stopMoving(); }
    }

    // Helper to schedule a retry if still moving
    function scheduleRetry() {
        if (isMoving) {
            log(`Scheduling retry attempt in ${STUCK_RETRY_DELAY_MS}ms`);
            if (moveTimeoutId) clearTimeout(moveTimeoutId); // Clear existing timeout first
            moveTimeoutId = setTimeout(attemptMove, STUCK_RETRY_DELAY_MS);
        }
    }

    // --- Manual Logging & Key Listeners ---
    function startManualLogging() { if (!ENABLE_MANUAL_LOG_MODE || isLoggingManual || isMoving) return; if (!JCStreetViewInstance) { errorLog("Instance not ready."); return; } isLoggingManual = true; manualMoveCounter = 0; manualStartTime = Date.now(); lastLoggedManualPano = JCStreetViewInstance.getPano(); log(`MANUAL Logging STARTED...`); }
    function stopManualLogging() { if (!ENABLE_MANUAL_LOG_MODE || !isLoggingManual) return; const endTime = Date.now(); const duration = manualStartTime ? endTime - manualStartTime : 0; isLoggingManual = false; log(`MANUAL Logging STOPPED. Duration: ${duration}ms. Moves: ${manualMoveCounter}.`); manualStartTime = null; lastLoggedManualPano = null; }

    function handleKeyDown(event) {
        // Ignore key presses if focused on input fields, text areas, or editable content
        const target = event.target;
        const targetTagName = target.tagName.toLowerCase();
        if (targetTagName === 'input' || targetTagName === 'textarea' || target.isContentEditable) {
            return;
        }

        // Handle Shift key for fast movement
        if (event.key === 'Shift' && !event.repeat) {
            // --- NM/NMPZ Check using 'quickplay-variant' ---
            // Read the quickplay variant from localStorage.
            const quickplayVariant = window.localStorage.getItem('quickplay-variant');

            // If variant is "1" (NM) or "2" (NMPZ), do not activate fast move.
            // Note: localStorage stores values as strings.
            if (quickplayVariant === "1" || quickplayVariant === "2") {
                log(`Shift key ignored: Movement disabled in NM/NMPZ mode (variant: ${quickplayVariant}).`);
                return; // Exit without starting movement
            }
            // Log if variant is not 0, 1, or 2 (or null), but proceed anyway as default
            if (quickplayVariant !== "0" && quickplayVariant !== null) {
                 log(`Shift key allowed: Unknown quickplay-variant '${quickplayVariant}'. Assuming moving allowed.`);
            } else if (quickplayVariant === "0") {
                 log(`Shift key allowed: Moving game detected (variant: ${quickplayVariant}).`);
            } else {
                 log(`Shift key allowed: quickplay-variant not found. Assuming moving allowed.`);
            }
            // --- End NM/NMPZ Check ---

            // If checks pass (i.e., not variant 1 or 2), start the fast movement
            startMoving();
        }
        // Handle manual logging key (if enabled)
        else if (ENABLE_MANUAL_LOG_MODE && event.key === MANUAL_LOG_KEY && !event.repeat && !isLoggingManual) {
            startManualLogging();
        }
    }

    function handleKeyUp(event) {
        // Stop fast movement when Shift key is released
        if (event.key === 'Shift') {
            stopMoving();
        }
        // Stop manual logging when its key is released (if enabled and active)
        else if (ENABLE_MANUAL_LOG_MODE && event.key === MANUAL_LOG_KEY && isLoggingManual) {
            stopManualLogging();
        }
    }

    // --- Initialization ---
    log("Attempting to find and override Google Maps API...");
    findAndOverrideGoogleMaps(overrideStreetViewPanorama);
    log("Adding keydown/keyup event listeners to window.");
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

})();