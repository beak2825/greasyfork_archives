// ==UserScript==
// @name         🧠 Auto Soraaaaaa
// @namespace    http://tampermonkey.net/
// @version      5.7
// @description  Auto generate prompt list, 
// @author       Matthew M.
// @match        *://sora.com/*
// @match        *://www.sora.com/*
// @match        *://www.sora.*.com/*
// @match        *://sora.*.com/*
// @match        https://sora.chatgpt.com/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/544230/%F0%9F%A7%A0%20Auto%20Soraaaaaa.user.js
// @updateURL https://update.greasyfork.org/scripts/544230/%F0%9F%A7%A0%20Auto%20Soraaaaaa.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Global Variables ---
    let promptQueue = [];
    let originalPromptList = [];    // << NEW (from 5.7) Store original list for looping
    let totalPromptCount = 0;       // Total prompts in the *current* cycle or initial list
    let totalPromptsSentLoop = 0;   // << NEW (from 5.7) Total prompts sent since start *if* looping
    let isRunning = false;
    let isLooping = false;          // << NEW (from 5.7) Track loop checkbox state
    let isGenerating = false;       // Only relevant for Auto mode now
    let cooldownTime = 130;         // Default manual cooldown
    let autoSubmitTimeoutId = null; // For Auto mode's 1-sec delay
    let generationTimeoutId = null; // For Auto mode's 5-min generation timeout
    const GENERATION_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
    let manualTimerInterval = null; // ID for setInterval of manual mode execution
    let visualCountdownInterval = null; // ID for setInterval updating manual cooldown UI
    let selectedImageUrls = new Set();
    let isDownloading = false;
    let downloadErrors = 0;
    let isFindSimilarModeActive = false;
    let imageObserver = null;
    let completionObserver = null;
    let _generationIndicatorRemoved = false; // For Auto mode completion detection
    let _newImagesAppeared = false; // For Auto mode completion detection
    let pageOverlayElement = null;
    let originalBodyOverflow = '';
    let originalHtmlOverflow = '';
    let stylesInjected = false;
    const SCRIPT_VERSION = "5.7"; // << UPDATED (from 5.7) Version updated
    const SCRIPT_CHECKBOX_MARKER = 'data-auto-sora-cb'; // From 5.5.5
    const NATIVE_INDICATOR_SELECTOR = 'div.absolute.left-2.top-2'; // From 5.5.5


    // --- Logging Function ---
    function log(msg) {
        const now = new Date();
        const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(3, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`; // Minor fix: 3 digits for seconds padding
        console.log(`[Auto Sora v${SCRIPT_VERSION} ${timestamp}] ${msg}`);
    }

     // --- Function to remove native checkboxes (from 5.5.5) ---
     function removeNativeCheckboxes() {
        // log("Scanning and removing native checkboxes..."); // Optional: Keep if needed
        const nativeCheckboxes = document.querySelectorAll(`input.sora-image-checkbox:not([${SCRIPT_CHECKBOX_MARKER}])`);
        let removedCount = 0;
        nativeCheckboxes.forEach(checkbox => { try { checkbox.remove(); removedCount++; } catch (e) {} });
        // if (removedCount > 0) log(`Removed ${removedCount} native checkboxes.`); // Optional
    }

    // --- Function to remove native selection indicators (from 5.5.5) ---
    function removeNativeSelectionIndicators() {
        // log("Scanning and removing native selection indicators..."); // Optional
        const indicators = document.querySelectorAll(NATIVE_INDICATOR_SELECTOR);
        let removedCount = 0;
        indicators.forEach(indicator => {
            if (indicator.querySelector('div.bg-black\\/25 div.border-2')) {
                try { indicator.remove(); removedCount++; } catch (e) { log(`Error removing native indicator: ${e.message}`); }
            }
        });
        // if (removedCount > 0) log(`Removed ${removedCount} native selection indicators.`); // Optional
    }

    // --- Inject CSS ---
    function injectOverlayStyles() {
        if (stylesInjected) return;
        log("Injecting CSS..."); // Keep logging
        const style = document.createElement('style');
        style.textContent = `
            /* Overlay Styles (from 5.7) */
            @keyframes sora-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            .sora-overlay-spinner { border: 4px solid rgba(255, 255, 255, 0.2); border-top-color: #fff; border-radius: 50%; width: 40px; height: 40px; animation: sora-spin 1s linear infinite; margin-bottom: 25px; }
            .sora-overlay-text-main { color: #ffffff; font-size: 1.4em; font-weight: 500; text-shadow: 0 1px 3px rgba(0,0,0,0.4); margin-bottom: 8px; }
            .sora-overlay-text-sub { color: #e0e0e0; font-size: 0.9em; text-shadow: 0 1px 2px rgba(0,0,0,0.3); max-width: 80%; text-align: center; line-height: 1.4; }
            /* Checkbox Visibility Fix (from 5.5.5) */
            input.sora-image-checkbox[${SCRIPT_CHECKBOX_MARKER}] { opacity: 1 !important; }
        `;
        document.head.appendChild(style);
        stylesInjected = true;
         log("CSS injected."); // Keep logging
    }

    // --- Overlay & Scroll Lock Functions (Use 5.7 version - more robust logging/checks) ---
    function createOverlay() {
        if (pageOverlayElement) return;
        injectOverlayStyles();
        log("Creating page lock overlay element...");
        pageOverlayElement = document.createElement('div');
        pageOverlayElement.id = 'sora-page-overlay';
        pageOverlayElement.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background-color: rgba(0, 0, 0, 0.45); z-index: 999990;
            opacity: 0; transition: opacity 0.3s ease;
            backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px);
            display: flex; flex-direction: column; justify-content: center;
            align-items: center; text-align: center; color: white;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            /* Start hidden */
            display: none;
        `;
        pageOverlayElement.innerHTML = `
            <div class="sora-overlay-spinner"></div>
            <div class="sora-overlay-text-main">Auto Sora is running</div>
            <div class="sora-overlay-text-sub">Please access Sora on another tab to continue</div>
        `;
        document.body.appendChild(pageOverlayElement);
        log("Page lock overlay appended to body with content.");
    }

    function showOverlay() {
        if (!pageOverlayElement) createOverlay();
        // Only proceed if the overlay isn't already fully visible
        if (pageOverlayElement && pageOverlayElement.style.opacity !== '1') {
            log("Showing page lock overlay and locking scroll.");
            originalBodyOverflow = document.body.style.overflow;
            originalHtmlOverflow = document.documentElement.style.overflow;
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';

            pageOverlayElement.style.display = 'flex'; // Set display before transition
            void pageOverlayElement.offsetWidth; // Force reflow
            pageOverlayElement.style.opacity = '1';
        }
    }

    function hideOverlay() {
        // Only proceed if the overlay exists and is currently visible or fading out
        if (pageOverlayElement && pageOverlayElement.style.display !== 'none') {
            // Check if scroll is currently locked by this script
            const bodyLocked = document.body.style.overflow === 'hidden';
            const htmlLocked = document.documentElement.style.overflow === 'hidden';

            if (pageOverlayElement.style.opacity !== '0') {
                 log("Hiding page lock overlay.");
                 pageOverlayElement.style.opacity = '0';
            }

            // Unlock scroll immediately if locked
            if (bodyLocked) {
                document.body.style.overflow = originalBodyOverflow;
            }
             if (htmlLocked) {
                 document.documentElement.style.overflow = originalHtmlOverflow;
             }
             // Clear stored values only after restoring
             originalBodyOverflow = '';
             originalHtmlOverflow = '';


            // Set display to none after the transition finishes
            setTimeout(() => {
                // Check again in case hideOverlay was called multiple times quickly
                if (pageOverlayElement && pageOverlayElement.style.opacity === '0') {
                   pageOverlayElement.style.display = 'none';
                   log("Overlay display set to none.");
                }
            }, 300);
        } else {
             // Ensure scroll is unlocked even if overlay wasn't visible
             if (document.body.style.overflow === 'hidden') {
                log("Scroll was locked, unlocking as overlay hide is requested (overlay not visible).");
                document.body.style.overflow = originalBodyOverflow; // Attempt restore
                originalBodyOverflow = '';
            }
             if (document.documentElement.style.overflow === 'hidden') {
                 document.documentElement.style.overflow = originalHtmlOverflow; // Attempt restore
                 originalHtmlOverflow = '';
             }
        }
    }
    // --- End Overlay & Scroll Lock Functions ---

    // --- Utility Functions (Keep 5.7 versions - identical) ---
    function getTimestamp() { const now = new Date(); const pad = n => String(n).padStart(2, '0'); return `${pad(now.getDate())}${pad(now.getMonth() + 1)}${String(now.getFullYear()).slice(2)}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`; }
    function triggerDownload(blob, filename) { const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = filename; document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(link.href); log(`Download triggered: ${filename} (Size: ${(blob.size / 1024).toFixed(1)} KB)`); }

    // --- UI Update Functions ---
    // Use 5.5.5 version - it includes the SCRIPT_CHECKBOX_MARKER logic
    function updateImageSelection() {
        log("Updating image selections (Library/Task compatible)..."); // Modified log
        let changedCount = 0;
        let initialSelectedSize = selectedImageUrls.size;
        try {
            const filterHorizState = document.getElementById('sora-select-horizontal')?.checked ?? false;
            const filterVertState = document.getElementById('sora-select-vertical')?.checked ?? false;
            const filterSquareState = document.getElementById('sora-select-square')?.checked ?? false;
            const deselectAll = !filterHorizState && !filterVertState && !filterSquareState;
            // Combine selectors to cover both Library and Task pages
            document.querySelectorAll(`div[data-index], div[style*="top:"][style*="left:"], .group\\/tile`).forEach(gridItem => {
                const checkbox = gridItem.querySelector(`input.sora-image-checkbox[${SCRIPT_CHECKBOX_MARKER}]`);
                const img = gridItem.querySelector("img"); // General image selector within the item
                if (!checkbox || !img) return;

                // Skip task prompt tiles explicitly if they somehow got a checkbox
                const anchor = gridItem.querySelector('a');
                 if (anchor && anchor.getAttribute('href')?.startsWith('/t/task_')) {
                     return;
                 }

                let shouldBeChecked = checkbox.checked;
                const imgSrc = img.src;
                if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
                    const imgWidth = img.naturalWidth;
                    const imgHeight = img.naturalHeight;
                    const isHoriz = imgWidth > imgHeight;
                    const isVert = imgHeight > imgWidth;
                    const isSquare = Math.abs(imgWidth - imgHeight) <= 1; // Tolerance for square
                    if (deselectAll) {
                        shouldBeChecked = false;
                    } else {
                        shouldBeChecked = (filterHorizState && isHoriz) || (filterVertState && isVert) || (filterSquareState && isSquare);
                    }
                    if (checkbox.checked !== shouldBeChecked) {
                        checkbox.checked = shouldBeChecked;
                        changedCount++;
                    }
                    if (shouldBeChecked) selectedImageUrls.add(imgSrc); else selectedImageUrls.delete(imgSrc);
                } else if (!img.complete) { // If image hasn't loaded, trust the current checkbox state for the Set
                    if (checkbox.checked) selectedImageUrls.add(imgSrc); else selectedImageUrls.delete(imgSrc);
                } else { // Image loaded but failed (e.g., 0 dimensions)
                    if (checkbox.checked) { checkbox.checked = false; changedCount++; }
                    selectedImageUrls.delete(imgSrc);
                }
            });
            updateSelectedCount();
            log(`Selection updated via filters. Changed: ${changedCount}, Total: ${selectedImageUrls.size}.`);
        } catch (e) {
            log("ERROR updating image selection:"); console.error(e);
        }
    }

    // Use 5.7 version - identical but good practice
    function toggleCooldownInputState() { const autoCheckbox = document.getElementById('sora-auto-submit-checkbox'); const cooldownInput = document.getElementById('sora-cooldown-time'); const cooldownLabel = cooldownInput?.closest('div')?.querySelector('label'); if (!autoCheckbox || !cooldownInput) return; const isAuto = autoCheckbox.checked; if (isAuto) { cooldownInput.disabled = true; cooldownInput.style.opacity = '0.5'; cooldownInput.style.cursor = 'not-allowed'; if (cooldownLabel) cooldownLabel.style.opacity = '0.5'; } else { cooldownInput.disabled = false; cooldownInput.style.opacity = '1'; cooldownInput.style.cursor = 'auto'; if (cooldownLabel) cooldownLabel.style.opacity = '1'; } }

    // Use 5.7 version - includes Loop logic
    function updateStartButtonPromptCount() {
        const textarea = document.getElementById('sora-input');
        const startButton = document.getElementById('sora-start');
        const loopCheckbox = document.getElementById('sora-loop-checkbox');

        // Add checks for all elements
        if (!textarea || !startButton || !loopCheckbox) return;

        const isLoopChecked = loopCheckbox.checked;

        if (isLoopChecked) {
            startButton.textContent = `▶ Start (∞)`;
        } else {
            const prompts = textarea.value.split('\n').map(x => x.trim()).filter(Boolean);
            const count = prompts.length;
            startButton.textContent = `▶ Start (${count})`;
        }
    }

    // Use 5.7 version - identical
    function updateSelectedCount() { const count = selectedImageUrls.size; try { const btnText = document.getElementById("sora-download-text"); const btn = document.getElementById("sora-download-images"); const icon = document.getElementById("sora-download-icon"); const errorEl = document.getElementById("sora-download-error"); if (btnText && btn && !isDownloading) { btnText.textContent = `Download (${count})`; btn.disabled = (count === 0); if (icon) icon.style.display = 'inline'; if (errorEl) errorEl.textContent = ''; } else if (btn) { btn.disabled = true; } } catch (e) { log("ERROR updating selected count UI:"); console.error(e); } const btn = document.getElementById("sora-download-images"); if (btn && !isDownloading) { btn.disabled = (selectedImageUrls.size === 0); } }

    // --- UI Creation ---
    function createUI() {
        log("Creating main UI…");
        const wrapper = document.createElement("div");
        wrapper.id = "sora-auto-ui";
        wrapper.style.cssText = `
            position: fixed; bottom: 15px; left: 20px;
            background: rgba(35,35,40,.65);
            backdrop-filter: blur(10px) saturate(180%);
            -webkit-backdrop-filter: blur(10px) saturate(180%);
            padding: 20px 20px 15px 20px;
            border-radius: 16px;
            z-index: 999999;
            box-shadow: 0 8px 32px rgba(0,0,0,.37);
            width: 330px;
            font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
            border: 1px solid rgba(255,255,255,.12);
            color: #e0e0e0;
            transition: opacity .3s ease,transform .3s ease;
            opacity: 1; transform: scale(1); display: block;`;

        /* --- 5.7 innerHTML | English --- */
        wrapper.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">
            <h3 style="margin:0;font-size:17px;display:flex;align-items:center;gap:10px;color:#fff;font-weight:500;">
              <img src="https://www.svgrepo.com/show/306500/openai.svg"
                   width="22" height="22" style="filter:invert(1);" alt="OpenAI Logo">
              Auto Sora
              <span style="font-size:9px;opacity:.6;font-weight:300;margin-left:-5px;">build ${SCRIPT_VERSION}</span>
            </h3>
            <button id="sora-close"
                    style="background:rgba(80,80,80,.4);backdrop-filter:blur(5px) saturate(150%);
                           -webkit-backdrop-filter:blur(5px) saturate(150%);
                           border:1px solid rgba(255,255,255,.1);border-radius:8px;
                           padding:2px 6px;font-size:16px;color:rgba(255,255,255,.7);
                           cursor:pointer;transition:background-color .2s ease,color .2s ease,border-color .2s ease;"
                    onmouseover="this.style.backgroundColor='rgba(100,100,100,.6)';this.style.color='rgba(255,255,255,.9)';this.style.borderColor='rgba(255,255,255,.15)'"
                    onmouseout="this.style.backgroundColor='rgba(80,80,80,.4)';this.style.color='rgba(255,255,255,.7)';this.style.borderColor='rgba(255,255,255,.1)'"
                    title="Close panel">✕</button>
          </div>

          <label style="font-size:13px;color:#bdbdbd;font-weight:400;margin-bottom:5px;display:block;">
            Prompt list:
          </label>
          <textarea id="sora-input" rows="5"
                    placeholder="One prompt per line…
    Select “Loop” mode for infinite cycling."
                    style="width:100%;padding:12px;border:1px solid rgba(255,255,255,.1);
                           background:rgba(0,0,0,.25);border-radius:10px;resize:vertical;
                           font-size:12px;color:#e0e0e0;margin:0 0 12px 0;box-sizing:border-box;
                           min-height:80px;overflow-y:hidden;"></textarea>

          <!-- Cooldown / Loop / Auto -->
          <div id="sora-mode-controls"
               style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;gap:15px;">
            <div style="display:flex;align-items:center;gap:5px;">
              <label style="font-size:13px;color:#bdbdbd;white-space:nowrap;">⏱ Cooldown:</label>
              <input id="sora-cooldown-time" type="number" min="1" value="${cooldownTime}"
                     style="width:77px;padding:8px 10px;border:1px solid rgba(255,255,255,.1);
                            background:rgba(0,0,0,.25);color:#e0e0e0;border-radius:10px;font-size:14px;box-sizing:border-box;">
            </div>

            <div style="display:flex;align-items:center;gap:15px;">
              <label title="Repeat the entire prompt list indefinitely"
                     style="display:flex;align-items:center;gap:7px;font-size:13px;color:#d0d0d0;cursor:pointer;">
                <input id="sora-loop-checkbox" type="checkbox"
                       style="transform:scale(1.1);cursor:pointer;accent-color:#4a90e2;"> Loop
              </label>
              <label title="Automatically submit the next prompt one second after an image finishes (or 5 min if stuck)"
                     style="display:flex;align-items:center;gap:7px;font-size:13px;color:#d0d0d0;cursor:pointer;">
                <input id="sora-auto-submit-checkbox" type="checkbox"
                       style="transform:scale(1.1);cursor:pointer;accent-color:#4a90e2;"> Auto
              </label>
            </div>
          </div>

          <div style="display:flex;gap:10px;margin-bottom:20px;">
            <button id="sora-start"
                    style="flex:1;background:rgba(60,130,250,.5);backdrop-filter:blur(5px) saturate(150%);
                           -webkit-backdrop-filter:blur(5px) saturate(150%);
                           color:#fff;padding:10px;border:1px solid rgba(60,130,250,.6);
                           border-radius:10px;cursor:pointer;font-weight:500;
                           transition:background-color .2s ease,border-color .2s ease;">▶ Start (0)</button>
            <button id="sora-clear"
                    style="flex:1;background:rgba(80,80,80,.5);backdrop-filter:blur(5px) saturate(150%);
                           -webkit-backdrop-filter:blur(5px) saturate(150%);
                           color:#d0d0d0;padding:10px;border:1px solid rgba(255,255,255,.15);
                           border-radius:10px;cursor:pointer;transition:background-color .2s ease,border-color .2s ease;"
                    onmouseover="this.style.backgroundColor='rgba(100,100,100,.6)';this.style.borderColor='rgba(255,255,255,.2)'"
                    onmouseout="this.style.backgroundColor='rgba(80,80,80,.5)';this.style.borderColor='rgba(255,255,255,.15)'">
              🗑️ Clear
            </button>
          </div>

          <hr style="border:none;border-top:1px solid rgba(255,255,255,.1);margin:18px 0;">

          <div style="font-size:13px;color:#bdbdbd;margin-bottom:12px;">Select images to download:</div>
          <div style="display:flex;gap:18px;margin-bottom:15px;flex-wrap:wrap;">
            <label title="Only images wider than tall"
                   style="display:flex;align-items:center;gap:7px;font-size:13px;color:#d0d0d0;cursor:pointer;">
              <input id="sora-select-horizontal" type="checkbox"
                     style="transform:scale(1.1);cursor:pointer;accent-color:#4a90e2;"> Horizontal
            </label>
            <label title="Only images taller than wide"
                   style="display:flex;align-items:center;gap:7px;font-size:13px;color:#d0d0d0;cursor:pointer;">
              <input id="sora-select-vertical" type="checkbox"
                     style="transform:scale(1.1);cursor:pointer;accent-color:#4a90e2;"> Vertical
            </label>
            <label title="Only square images"
                   style="display:flex;align-items:center;gap:7px;font-size:13px;color:#d0d0d0;cursor:pointer;">
              <input id="sora-select-square" type="checkbox"
                     style="transform:scale(1.1);cursor:pointer;accent-color:#4a90e2;"> Square
            </label>
          </div>

          <hr style="border:none;border-top:1px solid rgba(255,255,255,.08);margin:18px 0;">

          <div style="font-size:13px;color:#bdbdbd;margin-bottom:10px;">Crop on load:</div>
          <div id="sora-crop-options"
               style="display:flex;flex-wrap:wrap;gap:15px;margin-bottom:15px;">
            <label style="display:flex;align-items:center;gap:5px;font-size:13px;color:#d0d0d0;cursor:pointer;">
              <input name="sora-crop-option" value="none" type="radio"
                     checked style="accent-color:#4a90e2;transform:scale(1.1);cursor:pointer;"> Original
            </label>
            <label style="display:flex;align-items:center;gap:5px;font-size:13px;color:#d0d0d0;cursor:pointer;">
              <input name="sora-crop-option" value="16:9" type="radio"
                     style="accent-color:#4a90e2;transform:scale(1.1);cursor:pointer;"> 16:9
            </label>
            <label style="display:flex;align-items:center;gap:5px;font-size:13px;color:#d0d0d0;cursor:pointer;">
              <input name="sora-crop-option" value="9:16" type="radio"
                     style="accent-color:#4a90e2;transform:scale(1.1);cursor:pointer;"> 9:16
            </label>
            <label style="display:flex;align-items:center;gap:5px;font-size:13px;color:#d0d0d0;cursor:pointer;">
              <input name="sora-crop-option" value="1:1" type="radio"
                     style="accent-color:#4a90e2;transform:scale(1.1);cursor:pointer;"> 1:1
            </label>
          </div>

          <div style="display:flex;gap:10px;margin-top:20px;align-items:stretch;">
            <button id="sora-download-images"
                    style="flex-grow:1;background:rgba(46,160,67,.5);backdrop-filter:blur(5px) saturate(150%);
                           -webkit-backdrop-filter:blur(5px) saturate(150%);
                           color:#fff;padding:11px;border:1px solid rgba(46,160,67,.6);
                           border-radius:10px;cursor:pointer;font-size:14px;font-weight:500;
                           display:flex;align-items:center;justify-content:center;gap:8px;
                           transition:background-color .2s ease,border-color .2s ease,opacity .2s ease;">
              <svg id="sora-download-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                   viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/></svg>
              <span id="sora-download-text">Download (0)</span>
            </button>
            <button id="sora-find-similar-button" title="Toggle “find similar” mode"
                    style="flex-shrink:0;background:rgba(80,80,90,.5);backdrop-filter:blur(5px) saturate(150%);
                           -webkit-backdrop-filter:blur(5px) saturate(150%);
                           color:#fff;padding:11px 14px;border:1px solid rgba(255,255,255,.15);
                           border-radius:10px;cursor:pointer;font-size:14px;display:flex;
                           align-items:center;justify-content:center;transition:background-color .2s ease,border-color .2s ease;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z"/>
              </svg>
            </button>
          </div>

          <style>
            #sora-download-images:disabled {
              background:rgba(80,80,80,.3)!important;
              border-color:rgba(255,255,255,.08)!important;
              color:rgba(255,255,255,.4)!important;
              backdrop-filter:blur(2px) saturate(100%);
              -webkit-backdrop-filter:blur(2px) saturate(100%);
              opacity:.6; cursor:not-allowed;
            }
            #sora-find-similar-button.active {
              background-color:rgba(60,130,250,.65)!important;
              border-color:rgba(60,130,250,.8)!important;
            }
          </style>

          <div id="sora-download-progress" style="display:none;"></div>
          <div id="sora-download-error"
               style="font-size:11px;color:#ff8a8a;text-align:center;margin-top:5px;font-weight:400;"></div>
        `;
        /* --- end innerHTML --- */

        document.body.appendChild(wrapper);

        // --- END 5.7 innerHTML ---

        log("Main UI elements appended to body.");

        // Event Listeners & Drag Logic (Use 5.7 version - includes interactive check)
        let isDragging = false; let offsetX, offsetY; function dragMouseDown(e) { if (pageOverlayElement && pageOverlayElement.style.display !== 'none') return; if (e.button !== 0) return; const targetTagName = e.target.tagName.toLowerCase(); const isInteractive = ['input', 'button', 'textarea', 'svg', 'span', 'label', 'img'].includes(targetTagName) || e.target.closest('button, input, textarea, a, label[style*="cursor: pointer"], img'); if (isInteractive) { return; } log("Drag mouse down started on UI panel."); isDragging = true; wrapper.style.cursor = 'grabbing'; const rect = wrapper.getBoundingClientRect(); offsetX = e.clientX - rect.left; offsetY = e.clientY - rect.top; wrapper.style.bottom = 'auto'; wrapper.style.top = `${rect.top}px`; wrapper.style.left = `${rect.left}px`; document.addEventListener('mousemove', elementDrag); document.addEventListener('mouseup', closeDragElement); e.preventDefault(); } function elementDrag(e) { if (isDragging) { e.preventDefault(); const newTop = e.clientY - offsetY; const newLeft = e.clientX - offsetX; wrapper.style.top = `${newTop}px`; wrapper.style.left = `${newLeft}px`; } } function closeDragElement() { if (isDragging) { log("Drag mouse up, ending drag."); isDragging = false; wrapper.style.cursor = 'grab'; document.removeEventListener('mousemove', elementDrag); document.removeEventListener('mouseup', closeDragElement); } } wrapper.addEventListener('mousedown', dragMouseDown); wrapper.style.cursor = 'grab';
        log("Drag listeners added to UI panel.");

        // Button/Input Listeners (Add Loop checkbox listener from 5.7)
        document.getElementById('sora-start').addEventListener('click', handleStart);
        document.getElementById('sora-clear').addEventListener('click', handleClear);
        document.getElementById('sora-close').addEventListener('click', handleClose);
        document.getElementById('sora-download-images').addEventListener('click', handleDownload);
        document.getElementById('sora-find-similar-button').addEventListener('click', toggleFindSimilarMode);
        document.getElementById('sora-select-horizontal').addEventListener('change', updateImageSelection);
        document.getElementById('sora-select-vertical').addEventListener('change', updateImageSelection);
        document.getElementById('sora-select-square').addEventListener('change', updateImageSelection);
        document.getElementById('sora-auto-submit-checkbox').addEventListener('input', toggleCooldownInputState);
        document.getElementById('sora-loop-checkbox').addEventListener('change', handleLoopToggle); // << ADDED from 5.7
        document.getElementById('sora-input').addEventListener('input', updateStartButtonPromptCount);
        log("Event listeners added to UI controls.");

        // Initial state (Use 5.7 versions - identical)
        toggleCooldownInputState();
        updateStartButtonPromptCount();
        createAuxiliaryUI(); // Creates aux UI and overlay placeholder
        log("Auxiliary UI and Overlay created.");
    }

    // Use 5.7 version - identical
    function createAuxiliaryUI() {
        log("Creating auxiliary UI (progress, cooldown, stop)...");
        const auxContainer = document.createElement('div'); auxContainer.id = 'sora-aux-controls-container';
        auxContainer.style.cssText = `position: fixed; bottom: 15px; left: 20px; z-index: 999998; display: none; align-items: center; gap: 10px; transition: opacity 0.3s ease; opacity: 1;`;
        const glassItemStyle = `background: rgba(45, 45, 50, 0.7); backdrop-filter: blur(8px) saturate(150%); -webkit-backdrop-filter: blur(8px) saturate(150%); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px; padding: 8px 14px; font-size: 13px; color: #d5d5d5; display: none; white-space: nowrap; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); transition: background-color 0.2s ease, border-color 0.2s ease;`; const progress = document.createElement('div'); progress.id = 'sora-progress'; progress.style.cssText = glassItemStyle; progress.textContent = 'Đang xử lý...'; auxContainer.appendChild(progress); const cooldownBtn = document.createElement('button'); cooldownBtn.id = 'sora-cooldown'; cooldownBtn.style.cssText = glassItemStyle + `cursor: default;`; cooldownBtn.textContent = `⏱ Cooldown: --s`; auxContainer.appendChild(cooldownBtn); const stopBtn = document.createElement('button'); stopBtn.id = 'sora-stop-button'; stopBtn.style.cssText = glassItemStyle + `background: rgba(200, 50, 60, 0.7); border-color: rgba(255, 99, 132, 0.4); color: white; cursor: pointer; font-weight: 500;`; stopBtn.textContent = '🛑 Dừng'; stopBtn.title = 'Dừng gửi prompt và lưu các prompt còn lại'; stopBtn.onclick = handleStop; stopBtn.onmouseover = function () { this.style.backgroundColor = 'rgba(220, 53, 69, 0.8)'; this.style.borderColor = 'rgba(255, 99, 132, 0.6)'; }; stopBtn.onmouseout = function () { this.style.backgroundColor = 'rgba(200, 50, 60, 0.7)'; this.style.borderColor = 'rgba(255, 99, 132, 0.4)'; }; auxContainer.appendChild(stopBtn); document.body.appendChild(auxContainer);
        const miniBtn = document.createElement('div'); miniBtn.id = 'sora-minibtn'; miniBtn.style.cssText = `position: fixed; bottom: 15px; left: 20px; width: 16px; height: 16px; background: rgba(255, 255, 255, 0.8); border-radius: 50%; cursor: pointer; z-index: 999999; box-shadow: 0 0 8px rgba(255, 255, 255, 0.5); display: none; border: 1px solid rgba(255, 255, 255, 0.3); transition: background-color 0.2s ease;`; miniBtn.onmouseover = function () { this.style.backgroundColor = 'rgba(255, 255, 255, 1)'; }; miniBtn.onmouseout = function () { this.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'; }; miniBtn.title = 'Mở lại Auto Sora'; miniBtn.onclick = handleMiniButtonClick; document.body.appendChild(miniBtn);
        log("Auxiliary UI appended to body.");
        createOverlay(); // Create overlay element now
    }

    // --- Button Handlers ---
    // Add handleLoopToggle from 5.7
    function handleLoopToggle(event) {
        log(`Loop checkbox toggled to: ${event.target.checked}. State will be read on Start.`);
        updateStartButtonPromptCount();
    }

    // Modify handleStart using 5.7 logic
    function handleStart() {
        log("Start button clicked.");
        const input = document.getElementById('sora-input').value;
        const prompts = input.split('\n').map(x => x.trim()).filter(Boolean);
        const isAuto = document.getElementById('sora-auto-submit-checkbox')?.checked ?? false;
        isLooping = document.getElementById('sora-loop-checkbox')?.checked ?? false; // << Read loop state (from 5.7)
        totalPromptsSentLoop = 0; // << Reset total loop count (from 5.7)
        let currentCooldown = cooldownTime;

        if (prompts.length === 0) {
            log("Start cancelled: No prompts entered.");
            return alert("❗ Enter at least 1 prompt.");
        }
        if (isRunning) { log("Start cancelled: Process already running."); return; }

        if (!isAuto) {
            const cooldownInputVal = parseInt(document.getElementById('sora-cooldown-time').value);
            currentCooldown = isNaN(cooldownInputVal) ? cooldownTime : Math.max(1, cooldownInputVal);
            cooldownTime = currentCooldown;
            log(`Manual mode selected. Cooldown set to ${currentCooldown}s.`);
        } else {
            log(`Auto mode selected. Manual cooldown input ignored.`);
        }

        log(`Starting process with ${prompts.length} prompts. Mode: ${isAuto ? 'Auto' : 'Manual'}. Loop: ${isLooping}.`); // << Added Loop log (from 5.7)
        promptQueue = [...prompts];
        if (isLooping) { // << Store original list if looping (from 5.7)
            originalPromptList = [...prompts];
            log(`Loop mode active. Stored ${originalPromptList.length} original prompts.`);
        } else {
            originalPromptList = [];
        }
        totalPromptCount = prompts.length; // Total for this cycle (or initial)
        isRunning = true;
        isGenerating = false;

        showOverlay();

        const mainUI = document.getElementById('sora-auto-ui');
        if (mainUI) {
            log("Hiding main UI panel.");
            mainUI.style.opacity = '0';
            mainUI.style.transform = 'scale(0.95)';
            setTimeout(() => { mainUI.style.display = 'none'; }, 300);
        }
        const miniBtn = document.getElementById('sora-minibtn');
        if (miniBtn) miniBtn.style.display = 'none';

        const auxContainer = document.getElementById('sora-aux-controls-container');
        const progressEl = document.getElementById('sora-progress');
        const cooldownEl = document.getElementById('sora-cooldown');
        const stopBtn = document.getElementById('sora-stop-button');
        if (auxContainer) auxContainer.style.display = 'flex';
        if (progressEl) progressEl.style.display = 'inline-block';
        if (cooldownEl) cooldownEl.style.display = isAuto ? 'none' : 'inline-block';
        if (stopBtn) stopBtn.style.display = 'inline-block';
        log("Auxiliary UI controls made visible.");

        updateProgress(); // Update initial progress text

        if (isAuto) {
            startAutoLoop();
        } else {
            startManualTimerLoop(currentCooldown);
        }
    }

    // Use 5.7 version - identical
    function handleClear() { log("Clear button clicked."); document.getElementById('sora-input').value = ''; updateStartButtonPromptCount(); log("Prompt input cleared and button count updated."); }
    // Use 5.7 version - identical
    function handleClose() { log("Close button clicked."); const wrapper = document.getElementById('sora-auto-ui'); if (!wrapper) return; wrapper.style.opacity = '0'; wrapper.style.transform = 'scale(0.95)'; setTimeout(() => { wrapper.style.display = 'none'; if (!isRunning) { const miniBtn = document.getElementById('sora-minibtn'); if (miniBtn) miniBtn.style.display = 'block'; log("Main UI hidden, mini button shown."); } }, 300); }
    // Use 5.7 version - identical
    function handleMiniButtonClick() { log("Mini button clicked."); if (!isRunning) { const wrapper = document.getElementById('sora-auto-ui'); const miniBtn = document.getElementById('sora-minibtn'); if (wrapper) { wrapper.style.display = 'block'; void wrapper.offsetWidth; wrapper.style.opacity = '1'; wrapper.style.transform = 'scale(1)'; log("Main UI restored."); } if (miniBtn) miniBtn.style.display = 'none'; const auxContainer = document.getElementById('sora-aux-controls-container'); if (auxContainer) auxContainer.style.display = 'none'; hideOverlay(); /* Hide overlay & unlock scroll */ } else { log("Cannot open UI while process is running."); } }

    // Modify handleStop using 5.7 logic
    function handleStop() {
        log("Stop button clicked.");
        if (!isRunning) { log("Process is not running, stop ignored."); return; }

        isRunning = false;
        isGenerating = false;
        isLooping = false; // << Reset loop state (from 5.7)
        _generationIndicatorRemoved = false;
        _newImagesAppeared = false;

        completionObserver?.disconnect();
        log("Completion observer disconnected on stop.");

        if (autoSubmitTimeoutId) { clearTimeout(autoSubmitTimeoutId); autoSubmitTimeoutId = null; log("Cleared pending auto-submit timeout on stop."); }
        if (generationTimeoutId) { clearTimeout(generationTimeoutId); generationTimeoutId = null; log("Cleared pending generation timeout on stop."); }
        if (manualTimerInterval) { clearInterval(manualTimerInterval); manualTimerInterval = null; log("Cleared manual execution timer on stop."); }
        if (visualCountdownInterval) { clearInterval(visualCountdownInterval); visualCountdownInterval = null; log("Cleared manual visual countdown timer on stop.");}

        hideOverlay();
        const cooldownBtn = document.getElementById('sora-cooldown');
        if (cooldownBtn) {
            cooldownBtn.textContent = '⏱ Cooldown: --s'; // << Updated message (from 5.7)
            cooldownBtn.style.display = 'none';
        }

        const done = totalPromptCount > 0 ? (totalPromptCount - promptQueue.length) : 0;
        const totalSentDisplay = totalPromptsSentLoop > 0 ? totalPromptsSentLoop : done; // << Use loop count if available (from 5.7)
        const progressEl = document.getElementById('sora-progress');
        if (progressEl) { progressEl.textContent = `Stopped (Total: ${totalSentDisplay})`; log(`Process stopped manually. Total sent: ${totalSentDisplay}.`); } // << Updated message (from 5.7)

        if (promptQueue.length > 0) { saveRemainingPromptsToFile(); }
        else { log("No remaining prompts to save on stop."); }
        promptQueue = [];
        originalPromptList = []; // << Reset original list (from 5.7)
        totalPromptCount = 0;    // Reset cycle count
        totalPromptsSentLoop = 0;// << Reset total loop count (from 5.7)

        setTimeout(() => {
            if (!isRunning) { // Check again
                const auxContainer = document.getElementById('sora-aux-controls-container');
                if (auxContainer) auxContainer.style.display = 'none';
                const miniBtn = document.getElementById('sora-minibtn');
                const mainUI = document.getElementById('sora-auto-ui');
                if (miniBtn && (!mainUI || mainUI.style.display === 'none')) {
                    miniBtn.style.display = 'block';
                    log("Auxiliary UI hidden, mini button shown after stop.");
                } else {
                    log("Auxiliary UI hidden after stop.");
                }
                 updateStartButtonPromptCount(); // << Reset start button text (from 5.7)
            }
        }, 4000);
    }

    // Use 5.7 version - identical
    function saveRemainingPromptsToFile() { if (!promptQueue || promptQueue.length === 0) { log("Attempted to save prompts, but queue is empty."); return; } log(`Saving ${promptQueue.length} remaining prompts to file...`); const content = promptQueue.join('\n'); const blob = new Blob([content], { type: 'text/plain;charset=utf-8' }); const filename = `AutoSora_remaining_${getTimestamp()}.txt`; try { triggerDownload(blob, filename); log("Remaining prompts file download triggered."); } catch (e) { log("ERROR triggering download for remaining prompts file:"); console.error(e); } }

    // --- Core Logic ---
    // Modify updateProgress using 5.7 logic
    function updateProgress() {
        const progressEl = document.getElementById('sora-progress');
        const auxContainer = document.getElementById('sora-aux-controls-container');
        const cooldownEl = document.getElementById('sora-cooldown');
        const stopBtn = document.getElementById('sora-stop-button');
        const isAuto = document.getElementById('sora-auto-submit-checkbox')?.checked ?? false;

        if (!progressEl || !auxContainer) { return; }

        if (isRunning) {
            let statusText;
            // --- ADDED (from 5.7): Display logic for loop mode ---
            if (isLooping) {
                statusText = `Sent: ${totalPromptsSentLoop} / ∞`; // Use infinity symbol
            } else {
                const done = totalPromptCount > 0 ? (totalPromptCount - promptQueue.length) : 0;
                statusText = `Sent: ${done} / ${totalPromptCount}`;
            }
            // --- END ADDED ---
            progressEl.textContent = statusText;

            if (auxContainer.style.display !== 'flex') auxContainer.style.display = 'flex';
            if (progressEl.style.display !== 'inline-block') progressEl.style.display = 'inline-block';
            if (cooldownEl) {
                 cooldownEl.style.display = (!isAuto) ? 'inline-block' : 'none';
            }
            if (stopBtn && stopBtn.style.display !== 'inline-block') stopBtn.style.display = 'inline-block';

        } else { // isRunning = false (Đã dừng hoặc hoàn thành)
            const done = totalPromptCount > 0 ? (totalPromptCount - promptQueue.length) : 0;
            const totalSentDisplay = totalPromptsSentLoop > 0 ? totalPromptsSentLoop : done; // << Use loop count if available (from 5.7)

            // --- UPDATED (from 5.7): Completion/Stop message logic considering looping ---
            if (totalPromptCount > 0 && done === totalPromptCount && !isLooping) { // Normal completion (not looping)
                progressEl.textContent = `Finished: ${done} / ${totalPromptCount}.`;
                log(`Finished processing all ${totalPromptCount} prompts (Loop disabled).`);
            } else if (progressEl.textContent.indexOf('Đã dừng') === -1 && progressEl.textContent.indexOf('Finished') === -1) {
                // Show stopped message if not already shown and not completed normally (or if stopped while looping)
                 progressEl.textContent = `Stopped (Total: ${totalSentDisplay})`;
                 log(`Process stopped or finished incompletely/looping. Total sent: ${totalSentDisplay}.`);
            } else if (totalPromptCount === 0 && progressEl.textContent.indexOf('Stopped') === -1) {
                 progressEl.textContent = 'Not running/Stopped.';
                 log("Progress updated: Idle/Stopped state.");
            }
            // --- END UPDATED ---

            // Hide UI phụ after delay ONLY IF NOT LOOPING (or stopped before starting)
            // --- UPDATED (from 5.7): Check loop state before hiding UI ---
            if (!isLooping || totalPromptCount == 0) {
                setTimeout(() => {
                    if (!isRunning) { // Check again
                        hideOverlay();
                        if (auxContainer) auxContainer.style.display = 'none';
                        if (cooldownEl) cooldownEl.style.display = 'none';

                        const mainUI = document.getElementById('sora-auto-ui');
                        const miniBtn = document.getElementById('sora-minibtn');
                        if (miniBtn && (!mainUI || mainUI.style.display === 'none')) {
                            miniBtn.style.display = 'block';
                            log("Auxiliary UI hidden, overlay hidden/scroll unlocked, mini button shown after completion/stop (non-loop).");
                        } else {
                             log("Auxiliary UI hidden, overlay hidden/scroll unlocked after completion/stop (non-loop).");
                        }

                        // Reset counts only on normal non-loop completion
                        if (totalPromptCount > 0 && done === totalPromptCount && !isLooping) {
                             totalPromptCount = 0;
                             totalPromptsSentLoop = 0;
                             updateStartButtonPromptCount();
                             log("Reset counts after successful completion (no loop).");
                         }
                    }
                }, 4000);
            } else {
                 log("Looping was active or ended mid-cycle. Auxiliary UI remains visible until stopped manually.");
            }
            // --- END UPDATED ---
        }
    }

    // Modify submitPrompt using 5.7 logic (mainly logging)
    function submitPrompt(prompt, isAutoMode = true) {
        if (!isRunning) {
            log("submitPrompt cancelled: Not running.");
            return;
        }
        const textarea = document.querySelector('textarea[placeholder*="Describe"], textarea.flex.w-full');
        if (!textarea) {
            log("ERROR: Prompt textarea not found. Stopping.");
            handleStop();
            return;
        }

        // << UPDATED (from 5.7): Log message includes loop state and total count >>
        log(`Submitting prompt: "${prompt.substring(0, 50)}..." (Mode: ${isAutoMode ? 'Auto' : 'Manual'}, Loop: ${isLooping}, TotalSent: ${totalPromptsSentLoop})`);

        textarea.value = prompt;
        log("Dispatching input and change events on textarea..."); // << Log from 5.7
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        textarea.dispatchEvent(new Event('change', { bubbles: true }));

        const key = Object.keys(textarea).find(k => k.startsWith("__reactProps$"));
        if (key && textarea[key]?.onChange) {
            try {
                log("Triggering React onChange..."); // << Log from 5.7
                textarea[key].onChange({ target: textarea });
            } catch (e) {
                log("ERROR triggering React onChange:"); console.error(e);
            }
        } else {
            log("WARNING: React onChange handler not found for textarea."); // << Log from 5.7
        }

        log("Waiting 600ms for submit button to enable..."); // << Log from 5.7
        setTimeout(() => {
            if (!isRunning) {
                log("Submit button click cancelled: Not running (after delay)."); // << Log from 5.7
                return;
            }
            const btn = document.querySelector('button[data-disabled="false"][class*="bg-token-bg-inverse"]');
            if (btn) {
                log("Submit button found and enabled."); // << Log from 5.7

                if (isAutoMode) {
                    log("Auto Mode: Setting flags, starting observer, clicking..."); // << Log from 5.7
                    isGenerating = true;
                    _generationIndicatorRemoved = false;
                    _newImagesAppeared = false;
                    // updateProgress called before submitPrompt in calling function

                    const gridContainer = document.querySelector('div[class*="max-w-"][class*="flex-col"]') ?? document.body;
                    if (completionObserver) {
                        try {
                            completionObserver.observe(gridContainer, { childList: true, subtree: true });
                            log(`Completion observer started observing ${gridContainer.tagName === 'BODY' ? 'document body' : 'grid container'}.`); // << Log from 5.7
                        } catch (e) {
                            log(`ERROR starting completion observer: ${e.message}`); console.error(e);
                        }
                    } else {
                        log(`ERROR: Completion observer not initialized.`); // << Log from 5.7
                    }

                    if (generationTimeoutId) { clearTimeout(generationTimeoutId); log("Cleared previous generation timeout."); } // << Log from 5.7
                    generationTimeoutId = setTimeout(() => {
                         if (!isRunning || !isGenerating) { log("Generation timeout callback fired, but state changed. Ignoring."); generationTimeoutId = null; return; } // << Log from 5.7
                         log(`ERROR: Generation TIMEOUT (${GENERATION_TIMEOUT_MS / 1000}s) reached for current prompt. Assuming failure and proceeding to next.`); // << Log from 5.7
                         isGenerating = false;
                         completionObserver?.disconnect();
                         _generationIndicatorRemoved = false;
                         _newImagesAppeared = false;
                         generationTimeoutId = null;
                         updateProgress(); // Update progress before potentially stopping or looping

                         // << UPDATED (from 5.7): Check loop before stopping on timeout >>
                         if (promptQueue.length > 0 || (isLooping && originalPromptList.length > 0)) {
                            processNextPrompt(); // Proceed if queue has items OR looping is enabled
                         } else {
                            log("Generation Timeout: Queue empty and not looping. Stopping.");
                            handleStop(); // Stop completely
                         }
                         // << END UPDATED >>
                    }, GENERATION_TIMEOUT_MS);
                    log(`Generation timeout started (${GENERATION_TIMEOUT_MS / 1000}s). ID: ${generationTimeoutId}`); // << Log from 5.7

                } else {
                    log("Manual Mode: Clicking submit button..."); // << Log from 5.7
                    // updateProgress called before submitPrompt in calling function
                }

                log("Attempting button click..."); // << Log from 5.7
                const btnKey = Object.keys(btn).find(k => k.startsWith("__reactProps$"));
                if (btnKey && btn[btnKey]?.onClick) {
                    try {
                        btn[btnKey].onClick({ bubbles: true, cancelable: true, isTrusted: true });
                        log("React onClick triggered.");
                    } catch (e) {
                        log("ERROR triggering React onClick:"); console.error(e);
                        log("Attempting standard .click() as fallback...");
                        btn.click();
                    }
                } else {
                    log("WARNING: React onClick handler not found on button. Attempting standard .click()."); // << Log from 5.7
                    btn.click();
                }

            } else {
                log("ERROR: Submit button (data-disabled='false') not found after delay. Stopping."); // << Log from 5.7
                handleStop();
            }
        }, 600);
    }

    // Modify handleGenerationComplete using 5.7 logic
    function handleGenerationComplete() { // Only used in Auto Mode
        if (!isRunning || !isGenerating) {
            log(`handleGenerationComplete called but state is not correct (running: ${isRunning}, generating: ${isGenerating}). Ignoring.`); // << Log from 5.7
            return;
        }

        if (generationTimeoutId) { clearTimeout(generationTimeoutId); log(`Generation completed before timeout. Timeout ${generationTimeoutId} cancelled.`); generationTimeoutId = null; } // << Log from 5.7
        else { log("Generation completed, but no active timeout ID found."); } // << Log from 5.7

        log("Generation complete confirmed by observer (Auto Mode). Handling next step...");
        isGenerating = false;
        completionObserver?.disconnect();
        log("Completion observer disconnected.");
        // Don't call updateProgress here, processNextPrompt will do it

        if (autoSubmitTimeoutId) { clearTimeout(autoSubmitTimeoutId); autoSubmitTimeoutId = null; }

        const isAuto = document.getElementById('sora-auto-submit-checkbox')?.checked ?? false;
        if (!isAuto) {
            log("WARNING: handleGenerationComplete triggered but checkbox indicates Manual mode. Stopping Auto logic."); // << Log from 5.7
            return;
        }

        // --- UPDATED (from 5.7): Check loop before deciding to stop ---
        if (promptQueue.length > 0 || (isLooping && originalPromptList.length > 0)) {
            log("Auto mode: Scheduling next prompt in 1 second.");
            autoSubmitTimeoutId = setTimeout(() => {
                autoSubmitTimeoutId = null;
                if (isRunning) {
                    log("Auto-submit timer fired.");
                    processNextPrompt();
                } else {
                    log("Auto-submit timer fired but process was stopped.");
                }
            }, 1000);
        } else {
            log("Auto mode: Queue empty after generation and not looping. Process finished.");
            isRunning = false;
            updateProgress(); // Update UI to final state (calls hideOverlay etc. after delay)
        }
        // --- END UPDATED ---
    }

    // Modify processNextPrompt using 5.7 logic
    function processNextPrompt() { // Only used for Auto Mode
        if (!isRunning) { log("processNextPrompt: Aborted, not running."); updateProgress(); return; }

        // << ADDED (from 5.7): Check loop state >>
        if (promptQueue.length === 0) {
            if (isLooping && originalPromptList.length > 0) {
                log("Auto Loop: Prompt queue empty. Resetting from original list.");
                promptQueue = [...originalPromptList];
                totalPromptCount = originalPromptList.length; // Reset cycle count for display
                // Don't reset totalPromptsSentLoop here
            } else {
                log("processNextPrompt: Queue is empty and not looping. Finishing run.");
                isRunning = false;
                updateProgress(); // Trigger final state update
                return;
            }
        }
        // << END ADDED >>

        if (autoSubmitTimeoutId) { clearTimeout(autoSubmitTimeoutId); autoSubmitTimeoutId = null; log("Cleared autoSubmitTimeoutId in processNextPrompt."); } // Log from 5.7
        if (generationTimeoutId) { clearTimeout(generationTimeoutId); generationTimeoutId = null; log("Cleared generationTimeoutId in processNextPrompt."); } // Log from 5.7

        totalPromptsSentLoop++; // << Increment total *before* shifting (from 5.7)
        const nextPrompt = promptQueue.shift();
        updateProgress(); // << Update progress display *before* submitting next (from 5.7)
        submitPrompt(nextPrompt, true);
    }

    // Modify startAutoLoop using 5.7 logic (logging, call order)
    function startAutoLoop() {
        if (!isRunning || (promptQueue.length === 0 && !isLooping)) { // Modified condition slightly
            log("startAutoLoop: Condition not met (not running or empty queue and not looping).");
            isRunning = false;
            updateProgress();
            return;
        }
        log(`Starting AUTO loop. Loop: ${isLooping}`); // Log from 5.7
        // updateProgress(); // Moved updateProgress call inside processNextPrompt
        processNextPrompt(); // Start the first prompt
    }

    // Modify startManualTimerLoop using 5.7 logic
    function startManualTimerLoop(intervalSeconds) {
        log(`Starting MANUAL Timer Loop with ${intervalSeconds}s interval. Loop: ${isLooping}`); // Log from 5.7
        const intervalMs = intervalSeconds * 1000;
        const cooldownBtn = document.getElementById('sora-cooldown');

        const stopManualTimer = () => {
            if (manualTimerInterval) {
                clearInterval(manualTimerInterval);
                manualTimerInterval = null;
                log("Manual execution timer cleared.");
            }
            if (visualCountdownInterval) {
                clearInterval(visualCountdownInterval);
                visualCountdownInterval = null;
                // Reset text only if not running, otherwise let the next countdown overwrite it
                if (cooldownBtn && !isRunning) cooldownBtn.textContent = `Cooldown: --s`;
                log("Manual visual countdown timer cleared.");
            }
        }

        const startVisualCountdown = (totalSeconds) => {
             if (visualCountdownInterval) clearInterval(visualCountdownInterval);

             let timeRemaining = totalSeconds;
             if (cooldownBtn && cooldownBtn.style.display !== 'none') {
                 cooldownBtn.textContent = `Cooldown: ${timeRemaining}s`;
             }

             visualCountdownInterval = setInterval(() => {
                 timeRemaining--;
                 if (cooldownBtn && cooldownBtn.style.display !== 'none') {
                     if(isRunning) { // Only update if still running
                        cooldownBtn.textContent = `Cooldown: ${Math.max(0, timeRemaining)}s`;
                     } else { // Stop countdown if main process stopped
                         clearInterval(visualCountdownInterval);
                         visualCountdownInterval = null;
                     }
                 } else if (!isRunning){ // Also stop if button is hidden and not running
                     clearInterval(visualCountdownInterval);
                     visualCountdownInterval = null;
                 }
                 if (timeRemaining <= 0) { // Stop when time reaches 0
                     clearInterval(visualCountdownInterval);
                     visualCountdownInterval = null;
                 }
             }, 1000);
             log(`Manual visual countdown started (${totalSeconds}s). ID: ${visualCountdownInterval}`); // Log from 5.7
        }

        const manualTick = () => {
            if (!isRunning) {
                log("Manual Timer Tick: Stopping - Not running.");
                stopManualTimer();
                updateProgress(); // Update to final state
                return;
            }

            // << ADDED (from 5.7): Check loop state >>
            if (promptQueue.length === 0) {
                if (isLooping && originalPromptList.length > 0) {
                    log("Manual Timer Loop: Prompt queue empty. Resetting from original list.");
                    promptQueue = [...originalPromptList];
                    totalPromptCount = originalPromptList.length; // Reset cycle count for display
                    // Fall through to submit
                } else {
                    log("Manual Timer Tick: Stopping - Queue empty and not looping.");
                    stopManualTimer();
                    isRunning = false;
                    updateProgress(); // Update to final state
                    return;
                }
            }
            // << END ADDED >>

            totalPromptsSentLoop++; // << Increment total *before* shifting (from 5.7)
            const nextPrompt = promptQueue.shift();
            updateProgress(); // << Update progress display *before* submitting next (from 5.7)
            submitPrompt(nextPrompt, false);
            startVisualCountdown(intervalSeconds); // Start next countdown *after* submitting
        };

        // --- Gửi prompt đầu tiên ---
        if (isRunning && promptQueue.length > 0) {
            log("Manual Timer: Sending initial prompt.");
            totalPromptsSentLoop++; // << Increment for the first prompt (from 5.7)
            const firstPrompt = promptQueue.shift();
            updateProgress(); // << Update progress display *before* submitting first (from 5.7)
            submitPrompt(firstPrompt, false);
            startVisualCountdown(intervalSeconds);

            // << UPDATED (from 5.7): Set interval only if more prompts OR looping >>
            if (promptQueue.length > 0 || (isLooping && originalPromptList.length > 0)) {
                manualTimerInterval = setInterval(manualTick, intervalMs);
                log(`Manual execution timer set with ID: ${manualTimerInterval} (Interval: ${intervalMs}ms)`);
            } else {
                log("Manual Timer: Only one prompt sent, not looping. Finishing run after final cooldown.");
                // Let updateProgress handle hiding UI after its delay
                setTimeout(() => {
                    if (!isRunning && promptQueue.length === 0 && !isLooping) { // Double check state
                        isRunning = false; // Ensure state is false
                        updateProgress(); // Call again to ensure UI hides if needed
                    }
                }, intervalMs + 1000); // Wait for cooldown + buffer
            }
            // << END UPDATED >>
        } else if (isRunning) { // Should not happen if handleStart checks correctly
            log("Manual Timer: Started with empty queue? Stopping.");
            isRunning = false;
            stopManualTimer();
            updateProgress();
        } else {
             log("Manual Timer: Initial state not suitable for starting timer (not running).");
             updateProgress();
        }
    }

    // --- Download Logic ---
    // Use 5.7 version - identical but more robust logging/handling
    async function handleDownload() {
        log("Download button clicked.");
        const btn = document.getElementById("sora-download-images");
        const btnText = document.getElementById("sora-download-text");
        const btnIcon = document.getElementById("sora-download-icon");
        const errorEl = document.getElementById("sora-download-error");
        if (!btn || !btnText || !btnIcon || !errorEl) { log("ERROR: Download UI elements not found."); return; }

        if (isDownloading) { log("Download stop requested."); isDownloading = false; btnText.textContent = `Stopping...`; return; }

        const urlsToDownload = Array.from(selectedImageUrls);
        if (urlsToDownload.length === 0) { log("Download skipped: No images selected."); errorEl.textContent = "No images selected."; setTimeout(() => { if (!isDownloading && errorEl) errorEl.textContent = ''; }, 3000); return; }

        isDownloading = true;
        downloadErrors = 0;
        let successfulCount = 0;
        const totalFiles = urlsToDownload.length;
        const selectedCropOption = document.querySelector('input[name="sora-crop-option"]:checked')?.value ?? 'none';
        btn.disabled = true;
        btnIcon.style.display = 'none';
        btnText.textContent = `Preparing... (0/${totalFiles})`;
        errorEl.textContent = '';
        log(`Starting download of ${totalFiles} images. Crop: ${selectedCropOption}`);

        if (totalFiles === 1) { // Single file download
            log("Processing single image download...");
            const url = urlsToDownload[0];
            btnText.textContent = `Processing 1 image...`;
            try {
                const blob = await convertWebpToPngBlob(url, selectedCropOption);
                if (blob && isDownloading) {
                    const timestamp = getTimestamp();
                    const filename = `AutoSora_${selectedCropOption}_${timestamp}.png`;
                    triggerDownload(blob, filename);
                    btnText.textContent = `Downloaded 1 image`;
                    successfulCount = 1;
                } else if (!blob && isDownloading) {
                    downloadErrors = 1;
                    errorEl.textContent = `Error processing image. Check Console.`;
                    btnText.textContent = `Error downloading image`;
                } else if (!isDownloading) {
                    errorEl.textContent = `Stopped downloading.`;
                    btnText.textContent = `Stopped downloading`;
                }
            } catch (err) {
                if (isDownloading) {
                    downloadErrors = 1;
                    log(`ERROR processing single image (${url.substring(0, 30)}...): ${err.message}`); console.error(err);
                    errorEl.textContent = `Error processing image. Check Console.`;
                    btnText.textContent = `Error downloading image`;
                } else {
                    errorEl.textContent = `Stopped downloading.`;
                    btnText.textContent = `Stopped downloading`;
                }
            } finally {
                const wasDownloading = isDownloading;
                isDownloading = false;
                if (btnIcon) btnIcon.style.display = 'inline';
                 setTimeout(() => { if (!isDownloading) updateSelectedCount(); }, 3000); // Reset UI sooner
                 log(`Single image download process finished (was downloading: ${wasDownloading}). Success: ${successfulCount}, Errors: ${downloadErrors}`);
            }
            return;
        }

        // Multiple files download (ZIP)
        log("Processing multiple images concurrently...");
        let processedImageCount = 0;
        btnText.textContent = `Processing images: 0/${totalFiles} (0%)`;

        const conversionPromises = urlsToDownload.map((url, index) => {
            return convertWebpToPngBlob(url, selectedCropOption)
                .then(blob => {
                    if (isDownloading) {
                        processedImageCount++;
                        const percentage = ((processedImageCount / totalFiles) * 100).toFixed(0);
                        btnText.textContent = `Processing images: ${processedImageCount}/${totalFiles} (${percentage}%)`;
                    }
                    return blob; // Return the blob if successful
                })
                .catch(error => {
                    if (isDownloading) {
                        processedImageCount++; // Count errors as processed too
                        const percentage = ((processedImageCount / totalFiles) * 100).toFixed(0);
                        btnText.textContent = `Processing images: ${processedImageCount}/${totalFiles} (${percentage}%)`;
                        log(`ERROR processing image ${processedImageCount}/${totalFiles}: ${error.message}`);
                    }
                    // Do not re-throw, let Promise.allSettled handle it
                    return null; // Return null to indicate failure
                });
        });

        const results = await Promise.allSettled(conversionPromises);

        if (!isDownloading) {
            log("Download stopped during image processing phase.");
            errorEl.textContent = "Stopped downloading.";
            btnText.textContent = "Stopped downloading";
            if(btnIcon) btnIcon.style.display = 'inline';
            setTimeout(() => { if (!isDownloading) updateSelectedCount(); }, 3000);
            return;
        }

        log("All image processing settled. Preparing ZIP...");
        btnText.textContent = `Processed ${totalFiles}/${totalFiles} (100%). Preparing ZIP...`;

        const zip = new JSZip();
        let zipFileCount = 0;
        results.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value) { // Check for fulfilled and non-null blob
                const blob = result.value;
                const filename = `image_${index + 1}.png`;
                zip.file(filename, blob);
                successfulCount++;
                zipFileCount++;
            } else {
                downloadErrors++;
                const reason = result.status === 'rejected' ? result.reason : 'Processing returned null';
                log(`ERROR processing image index ${index} for ZIP: ${reason instanceof Error ? reason.message : reason}`);
            }
        });

        if (!isDownloading) {
             log("Download stopped during ZIP preparation.");
             errorEl.textContent = "Stopped creating ZIP.";
             btnText.textContent = "Stopped creating ZIP";
             if(btnIcon) btnIcon.style.display = 'inline';
             setTimeout(() => { if (!isDownloading) updateSelectedCount(); }, 3000);
             return;
        }

        if (successfulCount > 0) {
            try {
                log(`Generating ZIP file with ${successfulCount} images...`);
                btnText.textContent = 'Creating ZIP file...';
                const zipBlob = await zip.generateAsync(
                    { type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } },
                    (metadata) => {
                        if (!isDownloading) throw new Error("Zip generation cancelled.");
                        btnText.textContent = `Compressing ZIP: ${metadata.percent.toFixed(0)}%`;
                    }
                );

                if (!isDownloading) {
                    log("Download stopped during ZIP generation.");
                    errorEl.textContent = "Stopped creating ZIP.";
                    btnText.textContent = "Stopped creating ZIP";
                } else {
                    const zipFilename = `AutoSora_Bulk_${getTimestamp()}.zip`;
                    triggerDownload(zipBlob, zipFilename);
                    btnText.textContent = `Downloaded ${successfulCount}/${totalFiles} images`;
                    if (downloadErrors > 0) {
                        errorEl.textContent = `There were ${downloadErrors} errors during image processing.`;
                        log(`${downloadErrors} errors occurred during image processing.`);
                    }
                    log(`ZIP download triggered for ${successfulCount} files.`);
                }
            } catch (error) {
                log("ERROR during ZIP generation or download:"); console.error(error);
                if (error.message === "Zip generation cancelled.") {
                    errorEl.textContent = "Stopped creating ZIP file.";
                    btnText.textContent = "Stopped creating ZIP";
                } else if (isDownloading){
                    errorEl.textContent = "Error creating ZIP file. Check Console.";
                    btnText.textContent = "Error creating ZIP";
                } else {
                    errorEl.textContent = "Stopped.";
                    btnText.textContent = "Stopped";
                }
            }
        } else if (isDownloading) {
            btnText.textContent = "Error processing images";
            errorEl.textContent = `Cannot process any images (${downloadErrors} errors).`;
            log("No images were successfully processed.");
        } else {
             log("Download stopped, no successful images to ZIP.");
             // UI should already reflect stopped state
        }

        const wasDownloadingMulti = isDownloading;
        isDownloading = false;
        if (btnIcon) btnIcon.style.display = 'inline';
        setTimeout(() => { if (!isDownloading) updateSelectedCount(); }, 5000); // Longer delay after ZIP
        log(`Multiple image download process finished (was downloading: ${wasDownloadingMulti}). Success: ${successfulCount}, Errors: ${downloadErrors}`);
    }

    // Use 5.7 version - identical but better logging/error handling
    async function convertWebpToPngBlob(url, cropOption = 'none') {
        const start = performance.now();
        try {
            if (!isDownloading) throw new Error("Download cancelled before fetching.");
            const response = await fetch(url, { cache: "no-store"}); // Bypass cache for freshness
            if (!response.ok) throw new Error(`Fetch failed: ${response.status} ${response.statusText} for ${url.substring(url.length - 50)}`);
            const webpBlob = await response.blob();
            if (webpBlob.size === 0) throw new Error(`Fetched blob is empty for ${url.substring(url.length - 50)}`);
            if (!isDownloading) throw new Error("Download cancelled after fetching.");

            const imgBitmap = await createImageBitmap(webpBlob);
            let sourceX = 0, sourceY = 0;
            let sourceWidth = imgBitmap.width;
            let sourceHeight = imgBitmap.height;
            let targetWidth = imgBitmap.width;
            let targetHeight = imgBitmap.height;
            const targetCanvas = document.createElement("canvas");

            if (cropOption !== 'none' && sourceWidth > 0 && sourceHeight > 0) {
                let targetRatio = 1;
                let canvasTargetWidth = sourceWidth; // Default to original size
                let canvasTargetHeight = sourceHeight;

                // Determine target ratio and potentially ideal canvas size
                switch (cropOption) {
                    case '16:9': targetRatio = 16 / 9; canvasTargetWidth = 1920; canvasTargetHeight = 1080; break;
                    case '9:16': targetRatio = 9 / 16; canvasTargetWidth = 1080; canvasTargetHeight = 1920; break;
                    case '1:1':  targetRatio = 1 / 1;  canvasTargetWidth = 1080; canvasTargetHeight = 1080; break;
                }

                const currentRatio = sourceWidth / sourceHeight;

                // Only crop if the ratio is significantly different
                if (Math.abs(currentRatio - targetRatio) >= 0.01) {
                    log(`Cropping image (${sourceWidth}x${sourceHeight}, ratio ${currentRatio.toFixed(2)}) to ${cropOption} (ratio ${targetRatio.toFixed(2)})`);
                    if (currentRatio > targetRatio) { // Image is wider than target, crop sides
                        const idealWidth = sourceHeight * targetRatio;
                        sourceX = (sourceWidth - idealWidth) / 2;
                        sourceWidth = idealWidth;
                    } else { // Image is taller than target, crop top/bottom
                        const idealHeight = sourceWidth / targetRatio;
                        sourceY = (sourceHeight - idealHeight) / 2;
                        sourceHeight = idealHeight;
                    }
                } else {
                     log(`Image already close to ${cropOption} ratio. No crop applied.`);
                }
                 // Decide target canvas size: Use specified size if cropping, else use source size
                 targetWidth = canvasTargetWidth;
                 targetHeight = canvasTargetHeight;

            } else { // 'none' or invalid source dimensions
                 targetWidth = sourceWidth;
                 targetHeight = sourceHeight;
            }

            if (targetWidth <= 0 || targetHeight <= 0 || sourceWidth <= 0 || sourceHeight <= 0 || sourceX < 0 || sourceY < 0) {
                throw new Error(`Invalid dimensions calculated (Src: ${sourceWidth}x${sourceHeight}@${sourceX},${sourceY} -> Target: ${targetWidth}x${targetHeight})`);
            }

            targetCanvas.width = targetWidth;
            targetCanvas.height = targetHeight;
            const ctx = targetCanvas.getContext("2d", { alpha: false }); // No alpha needed for PNG usually
            ctx.imageSmoothingQuality = "high";
            // Draw the (potentially cropped) source onto the target canvas (potentially resizing)
            ctx.drawImage(
                imgBitmap,
                sourceX, sourceY,       // Source rectangle top-left
                sourceWidth, sourceHeight, // Source rectangle dimensions
                0, 0,                  // Destination canvas top-left
                targetWidth, targetHeight // Destination canvas dimensions
            );

            imgBitmap.close(); // Release memory

            return new Promise((resolve, reject) => {
                if (!isDownloading) return reject(new Error("Download cancelled before blob creation."));
                targetCanvas.toBlob(blob => {
                    if (blob) {
                        if (!isDownloading) return reject(new Error("Download cancelled during blob creation."));
                        const duration = performance.now() - start;
                        log(`Image converted/cropped (${cropOption}) in ${duration.toFixed(0)}ms. Size: ${(blob.size / 1024).toFixed(1)} KB`);
                        resolve(blob);
                    } else {
                        reject(new Error("Canvas toBlob returned null."));
                    }
                }, "image/png", 0.95); // Quality setting for PNG
            });

        } catch (error) {
            const duration = performance.now() - start;
             if (error.message.includes("cancelled")) {
                 log(`Conversion cancelled for ${url.substring(url.length - 50)}...: ${error.message}`);
             } else {
                 log(`ERROR converting image ${url.substring(url.length - 50)}... in ${duration.toFixed(0)}ms: ${error.message}`);
                 console.error(`Full error for ${url}:`, error);
             }
            throw error; // Re-throw to be caught by Promise.allSettled
        }
    }
    // --- End Download Logic ---

    // --- Image Checkbox & Selection Logic ---
    // Use 5.5.5 version - it handles native checkbox removal and skipping task tiles
    function handleImageError() { log(`ERROR: Failed load for CB init: ${this.src.substring(0, 50)}...`); this.removeEventListener('error', handleImageError); }

    function insertCheckbox(img) {
        try {
            const libraryAnchor = img.closest('a');
            let containerElement;

            // --- Check if it's the task prompt tile and skip --- (from 5.5.5)
            if (libraryAnchor && libraryAnchor.getAttribute('href')?.startsWith('/t/task_')) {
                // log(`Skipping checkbox for task prompt tile: ${img.src.substring(img.src.length - 20)}`);
                return; // Do not add checkbox to this specific tile
            }
            // --- END Check ---

            // Determine container based on context (from 5.5.5)
            if (libraryAnchor) { containerElement = img.closest('div[data-index]'); }
            else { containerElement = img.closest('div[style*="top:"][style*="left:"]') ?? img.closest('.group\\/tile'); } // Covers Task page
            if (!containerElement) { /* log(`No container found for img: ${img.src.substring(0,50)}...`);*/ return; }

            // Remove native checkbox if present (from 5.5.5)
            const existingNativeCheckbox = containerElement.querySelector(`input.sora-image-checkbox:not([${SCRIPT_CHECKBOX_MARKER}])`);
            if (existingNativeCheckbox) { try { existingNativeCheckbox.remove(); } catch (e) {} }

            // Don't add if our checkbox already exists
            if (containerElement.querySelector(`input.sora-image-checkbox[${SCRIPT_CHECKBOX_MARKER}]`)) return;

            const checkbox = document.createElement("input"); checkbox.type = "checkbox"; checkbox.className = "sora-image-checkbox"; checkbox.setAttribute(SCRIPT_CHECKBOX_MARKER, 'true'); // Mark our checkbox
            Object.assign(checkbox.style, { position: "absolute", top: "8px", left: "8px", zIndex: "10", width: "18px", height: "18px", cursor: "pointer", transform: "scale(1.3)", accentColor: "#4a90e2", backgroundColor: "rgba(255,255,255,0.7)", border: "1px solid rgba(0,0,0,0.3)", borderRadius: "3px", opacity: '1' /* Ensure visibility */ });
            checkbox.title = "Select/deselect this image";

            // Function to set state based on filters (primarily for Library view where filters apply)
            const setInitialCheckboxStateBasedOnFilters = () => {
                try {
                    if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) return;
                    const filterH = document.getElementById('sora-select-horizontal')?.checked ?? false;
                    const filterV = document.getElementById('sora-select-vertical')?.checked ?? false;
                    const filterS = document.getElementById('sora-select-square')?.checked ?? false;
                    const imgW = img.naturalWidth; const imgH = img.naturalHeight;
                    let shouldBe = false;
                    const isH = imgW > imgH; const isV = imgH > imgW; const isS = Math.abs(imgW - imgH) <= 1;
                    if (!filterH && !filterV && !filterS) { shouldBe = false; }
                    else { shouldBe = (filterH && isH) || (filterV && isV) || (filterS && isS); }

                    if (checkbox.checked !== shouldBe) {
                        checkbox.checked = shouldBe;
                        // Update Set only if state actually changed
                        if (shouldBe) { selectedImageUrls.add(img.src); } else { selectedImageUrls.delete(img.src); }
                        updateSelectedCount();
                    } else {
                        // Ensure Set is consistent even if checkbox state didn't change visually
                         if (shouldBe) { if (!selectedImageUrls.has(img.src)) { selectedImageUrls.add(img.src); updateSelectedCount(); }}
                         else { if (selectedImageUrls.has(img.src)) { selectedImageUrls.delete(img.src); updateSelectedCount(); } }
                    }
                } catch (e) { log(`ERROR setInitialCheckboxStateBasedOnFilters: ${e.message}`); }
            };

            checkbox.addEventListener("change", (e) => {
                if (e.target.checked) selectedImageUrls.add(img.src);
                else selectedImageUrls.delete(img.src);
                updateSelectedCount();
            });

            const currentPos = window.getComputedStyle(containerElement).position;
            if (currentPos === 'static' || currentPos === '') containerElement.style.position = 'relative'; // Ensure relative positioning

            containerElement.insertBefore(checkbox, containerElement.firstChild);

            // Set initial state: Apply filters if possible (Library), otherwise just ensure unchecked (Task)
            if (img.complete && img.naturalWidth > 0) {
                 setInitialCheckboxStateBasedOnFilters();
            } else {
                 img.removeEventListener('load', setInitialCheckboxStateBasedOnFilters); // Remove previous listeners
                 img.removeEventListener('error', handleImageError);
                 img.addEventListener('load', setInitialCheckboxStateBasedOnFilters, { once: true });
                 img.addEventListener('error', handleImageError, { once: true });
                 // Default to unchecked until loaded, Set will be updated by listener or filter change
                 checkbox.checked = false;
            }
        } catch (e) { log(`ERROR inserting checkbox: ${e.message}`); console.error(e); }
    }

    // --- Observers ---
    // Use 5.5.5 version of imageObserver - it handles native element removal and task tile skipping
    imageObserver = new MutationObserver((mutations) => {
        let imagesToCheck = new Set();
        let nativeElementsRemoved = false;

        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) { // Check if it's an element node
                        // --- Remove native elements if they appear late --- (from 5.5.5)
                         if (node.matches && node.matches(`input.sora-image-checkbox:not([${SCRIPT_CHECKBOX_MARKER}])`)) { try { node.remove(); nativeElementsRemoved = true; } catch (e) {} }
                         else if (node.querySelectorAll) { node.querySelectorAll(`input.sora-image-checkbox:not([${SCRIPT_CHECKBOX_MARKER}])`).forEach(cb => { try { cb.remove(); nativeElementsRemoved = true; } catch (e) {} }); }
                         if (node.matches && node.matches(NATIVE_INDICATOR_SELECTOR) && node.querySelector('div.bg-black\\/25')) { try { node.remove(); nativeElementsRemoved = true; } catch (e) {} }
                         else if (node.querySelectorAll) { node.querySelectorAll(NATIVE_INDICATOR_SELECTOR).forEach(indicator => { if (indicator.querySelector('div.bg-black\\/25')) { try { indicator.remove(); nativeElementsRemoved = true; } catch (e) {} } }); }
                        // --- End native element removal ---

                         let container = null; let img = null;
                         // Check if the added node itself is a relevant container (from 5.5.5)
                         if (node.matches && (node.matches('div[data-index]') || node.matches('div[style*="top:"][style*="left:"]') || node.matches('.group\\/tile'))) {
                             container = node;
                             img = container.querySelector('img');
                         }
                         // Or check if the added node CONTAINS relevant items (from 5.5.5)
                         else if (node.querySelectorAll) {
                              // This finds items within the added node, handles cases where a batch of items is added
                              node.querySelectorAll('div[data-index], div[style*="top:"][style*="left:"], .group\\/tile').forEach(item => {
                                  const itemImg = item.querySelector('img');
                                  if (itemImg) {
                                     // Check and add logic needs to happen per item found
                                      const anchor = item.querySelector('a');
                                      if (!item.querySelector(`input.sora-image-checkbox[${SCRIPT_CHECKBOX_MARKER}]`) && !(anchor && anchor.getAttribute('href')?.startsWith('/t/task_'))) {
                                         imagesToCheck.add(itemImg);
                                      }
                                  }
                              });
                         }

                         // Process the directly added node if it was a container
                         if (container && img) {
                            const anchor = container.querySelector('a');
                             // Check if it needs a checkbox AND is not a task tile prompt
                             if (!container.querySelector(`input.sora-image-checkbox[${SCRIPT_CHECKBOX_MARKER}]`) && !(anchor && anchor.getAttribute('href')?.startsWith('/t/task_'))) {
                                imagesToCheck.add(img);
                             }
                         }
                    }
                }
            }
        }
         if (nativeElementsRemoved) { /* log("ImageObserver removed late-added native element(s)."); */ } // Optional log
        if (imagesToCheck.size > 0) {
            // log(`ImageObserver found ${imagesToCheck.size} new images potentially needing checkboxes.`);
            imagesToCheck.forEach(img => insertCheckbox(img)); // insertCheckbox handles the rest
        }
    });

    // Use 5.7 version of completionObserver - identical logic, better logging
    completionObserver = new MutationObserver((mutations) => { // Only used in Auto Mode
        if (!isGenerating || !isRunning) return; // Ignore if not in Auto generation

        let foundIndicatorRemoval = false;
        let foundNewImage = false;

        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                // Check for removal of loading indicators
                mutation.removedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.querySelector && node.querySelector('svg[class*="desktop:h-20"] circle[class*="-rotate-90"]')) {
                        // log("Completion Observer: Found removed SVG loading indicator.");
                        foundIndicatorRemoval = true;
                    } else if (node.nodeType === 1 && node.matches && node.matches('div[class*="absolute"][class*="text-token-text-secondary"]') && node.textContent.match(/^\d{1,3}%$/)) {
                         // log("Completion Observer: Found removed percentage indicator.");
                         foundIndicatorRemoval = true;
                    }
                     // Add more checks for other potential loading indicators if needed
                });

                // Check for addition of new image grid item (specifically index 0 is usually the newest)
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if ((node.matches && node.matches('div[data-index="0"]')) || (node.querySelector && node.querySelector('div[data-index="0"]'))) {
                            // log("Completion Observer: Found added new image grid item (data-index='0').");
                            foundNewImage = true;
                        }
                    }
                });
            }
        }

        // Update state flags
        if (foundIndicatorRemoval) _generationIndicatorRemoved = true;
        if (foundNewImage) _newImagesAppeared = true;

        // Check if both conditions are met to signal completion
        if (isGenerating && isRunning && _generationIndicatorRemoved && _newImagesAppeared) {
             log("CompletionObserver: Both conditions met (_generationIndicatorRemoved && _newImagesAppeared). Calling handleGenerationComplete.");
             // Reset flags immediately to prevent double calls before disconnect
             _generationIndicatorRemoved = false;
             _newImagesAppeared = false;
             handleGenerationComplete(); // Trigger the next step in Auto Mode
        }
    });

    // --- Find Similar Logic ---
    // Use 5.7 version - identical
    function toggleFindSimilarMode() {
        isFindSimilarModeActive = !isFindSimilarModeActive;
        const button = document.getElementById('sora-find-similar-button');
        if (button) {
            if (isFindSimilarModeActive) {
                button.classList.add('active');
                button.title = 'Deactivate Find Similar mode (Click on an image to find)';
                log("Find Similar mode ACTIVATED.");
                document.body.style.cursor = 'crosshair'; // Optional visual cue
            } else {
                button.classList.remove('active');
                button.title = 'Activate Find Similar mode';
                log("Find Similar mode DEACTIVATED.");
                document.body.style.cursor = 'default'; // Reset cursor
            }
        }
    }

    // Use 5.7 version - identical logic, better logging
    function handleDocumentClickForSimilar(event) {
        if (!isFindSimilarModeActive) { return; } // Only act if mode is active

        const link = event.target.closest('a');
        if (!link || !link.href) {
             // log("Find Similar: Clicked outside an image link.");
             return;
        } // Clicked outside a link

        // Regex to find sora generation IDs like "gen_..."
        const soraGenRegex = /^https?:\/\/(?:www\.)?sora(?:\.\w+)*\.com\/g\/(gen_[a-zA-Z0-9]+)/;
        const match = link.href.match(soraGenRegex);

        if (match && match[1]) {
            const genId = match[1];
            const exploreUrl = `${window.location.origin}/explore?query=${genId}`;
            log(`Find Similar Mode: Match found (${genId}). Opening with window.open: ${exploreUrl}`);

            event.preventDefault(); // Stop the default link navigation
            event.stopPropagation(); // Stop the event from bubbling up further

            window.open(exploreUrl, '_blank'); // Open the explore URL in a new tab

            // Optionally deactivate the mode after one use
            // toggleFindSimilarMode();

        } else {
            // log(`Find Similar: Clicked link (${link.href}) did not match Sora generation pattern.`);
        }
    }

    // --- Initialization ---
    // Use 5.7 version - identical but better error handling structure
    function waitForElement(selector, callback, timeout = 20000) {
        log(`Waiting for element: "${selector}" (timeout: ${timeout/1000}s)`);
        let checkCount = 0;
        const intervalTime = 500;
        const maxChecks = timeout / intervalTime;
        const interval = setInterval(() => {
            checkCount++;
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(interval);
                log(`Element found: "${selector}". Initializing script...`);
                try {
                    callback(el);
                    log("Initialization callback executed successfully.");
                } catch (e) {
                    log("FATAL ERROR during initialization callback execution:");
                    console.error(e);
                    alert("Fatal error while launching Auto Sora script. Unable to generate UI. Check Console (F12) for details.");
                }
            } else if (checkCount >= maxChecks) {
                clearInterval(interval);
                log(`ERROR: Element "${selector}" not found after ${timeout/1000} seconds. Script cannot initialize UI.`);
            alert(`Auto Sora: The required element "${selector}" to initialize UI was not found. The script may not work properly.`);
            }
        }, intervalTime);
    }

    // --- Script Entry Point ---
    log("Script starting...");
    if (typeof JSZip === 'undefined') { log("FATAL ERROR: JSZip library not loaded."); alert("Fatal error: JSZip library not loaded."); return; }
    else { log("JSZip library loaded successfully."); }

    // Use 5.5.5 waitForElement target selector and initialization logic, combined with 5.7 robustness
    waitForElement('main, div[role="dialog"]', (commonElement) => { // Target from 5.5.5
        try {
            log("Common page element found. Proceeding with initialization..."); // Log from 5.7 style

            // Initial removal of native elements (from 5.5.5)
            removeNativeCheckboxes();
            removeNativeSelectionIndicators();

            createUI(); // Creates main UI, aux UI, and overlay placeholder
            hideOverlay(); // Ensure overlay is hidden initially
            log("UI creation function finished. Initial overlay state set to hidden."); // Log from 5.7

            log("Performing initial image scan..."); // Log from 5.7
            let initialImages = 0;
             // Use combined selector from 5.5.5 to cover library and task pages
            document.querySelectorAll('div[data-index] a > img, div[style*="top:"][style*="left:"] img, .group\\/tile img').forEach(img => {
                 insertCheckbox(img); // insertCheckbox now handles skipping task prompts
                 initialImages++;
            });
            log(`Initial image scan complete. Processed ${initialImages} images.`); // Log from 5.7
            updateSelectedCount(); // Update download button count

            log("Setting up Image Observer..."); // Log from 5.7
            // Use the more comprehensive observer target selector from 5.5.5
             const observerTarget = document.querySelector(
                 '[data-testid="virtuoso-scroller"] > div, main div[class*="grid"], div[role="dialog"] div.flex.h-full.flex-col, body'
            ) ?? document.body;

            if (observerTarget) {
                // Observer callback (5.5.5 version) handles removing native elements and skipping task prompts
                imageObserver.observe(observerTarget, { childList: true, subtree: true });
                log(`Image Observer started observing ${observerTarget.tagName}${observerTarget.id ? '#'+observerTarget.id : ''}${observerTarget.className ? '.'+observerTarget.className.split(' ').join('.') : ''}.`); // Log from 5.5.5 style
            } else {
                 // Fallback logic is the same
                 log("WARNING: Could not find specific image grid container, observing document body. This might be less efficient.");
                 imageObserver.observe(document.body, { childList: true, subtree: true });
            }

            if (!completionObserver) { log("ERROR: Completion observer was not initialized correctly."); }
            else { log("Completion observer initialized (for Auto Mode)."); } // Log from 5.7

            // Add the global click listener for the "Find Similar" feature
            document.addEventListener('click', handleDocumentClickForSimilar, true); // Use capture phase
            log("Added global click listener for Find Similar mode."); // Log from 5.7
            log("Initialization complete."); // Log from 5.7

        } catch (e) { // Use more robust error handling from 5.7
            log("FATAL ERROR during script initialization after core element found:");
            console.error(e);
            alert("A fatal error occurred during Auto Sora initialization. Check Console (F12).");
        }
    });

})();