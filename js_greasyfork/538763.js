// ==UserScript==
// @name         Emby Functions Enhanced
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Add buttons on top of target element to generate thumbs and open path with enhanced error handling and performance
// @author       Wayne
// @match        http://192.168.0.47:10074/*
// @grant        GM.xmlHttpRequest
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/538763/Emby%20Functions%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/538763/Emby%20Functions%20Enhanced.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Configuration
    const CONFIG = {
      EMBY_LOCAL_ENDPOINT: "http://192.168.0.47:10162/generate_thumb",
      // DOPUS_LOCAL_ENDPOINT: "http://localhost:10074/open?path=",
      DOPUS_LOCAL_ENDPOINT: "http://127.0.0.1:58000",
      TOAST_DURATION: 5000,
      REQUEST_TIMEOUT: 30000,
      RETRY_ATTEMPTS: 3,
      RETRY_DELAY: 1000
    };

    const SELECTORS = {
      VIDEO_OSD: "body > div.view.flex.flex-direction-column.page.focuscontainer-x.view-videoosd-videoosd.darkContentContainer.graphicContentContainer > div.videoOsdBottom.flex.videoOsd-nobuttonmargin.videoOsdBottom-video.videoOsdBottom-hidden.hide > div.videoOsdBottom-maincontrols > div.flex.flex-direction-row.align-items-center.justify-content-center.videoOsdPositionContainer.videoOsdPositionContainer-vertical.videoOsd-hideWithOpenTab.videoOsd-hideWhenLocked.focuscontainer-x > div.flex.align-items-center.videoOsdPositionText.flex-shrink-zero.secondaryText.videoOsd-customFont-x0",
      MEDIA_SOURCES: ".mediaSources"
    };

    // State management
    const state = {
      buttonsInserted: false,
      saveButtonAdded: false,
      currentPath: null,
      pendingRequests: new Set(),
      lastUrl: location.href
    };

    // Utility functions
    const debounce = (func, wait) => {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
      };
    };

    const throttle = (func, limit) => {
      let inThrottle;
      return function(...args) {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => { inThrottle = false; }, limit);
        }
      };
    };

    const sanitizePath = (path) => path?.trim().replace(/[<>:"|?*]/g, '_') || '';
    const validatePath = (path) => path && typeof path === 'string' && path.trim().length > 0;

    // Reset state when URL or content changes
    function resetState() {
      state.buttonsInserted = false;
      state.saveButtonAdded = false;
      state.currentPath = null;
      console.log("State reset - checking for elements...");
    }

    // Check for URL changes (SPA navigation)
    function checkUrlChange() {
      if (location.href !== state.lastUrl) {
        console.log("URL changed:", state.lastUrl, "->", location.href);
        state.lastUrl = location.href;
        resetState();
        // Small delay to let new content load
        setTimeout(() => {
          //addSaveButtonIfReady();
          insertButtons();
        }, 100);
      }
    }

    // Enhanced toast system
    function showToast(message, type = 'info', duration = CONFIG.TOAST_DURATION) {
      const typeStyles = {
        info: { background: '#333', color: '#fff' },
        success: { background: '#4CAF50', color: '#fff' },
        error: { background: '#f44336', color: '#fff' },
        warning: { background: '#ff9800', color: '#fff' }
      };

      let container = document.getElementById("userscript-toast-container");
      if (!container) {
        container = document.createElement("div");
        container.id = "userscript-toast-container";
        Object.assign(container.style, {
          position: "fixed",
          top: "20px",
          right: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          zIndex: "10000",
          pointerEvents: "none"
        });
        document.body.appendChild(container);
      }

      const toast = document.createElement("div");
      toast.textContent = message;
      Object.assign(toast.style, {
        ...typeStyles[type],
        padding: "12px 16px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        fontSize: "14px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "300px",
        wordWrap: "break-word",
        opacity: "0",
        transform: "translateX(100%)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: "auto"
      });

      container.appendChild(toast);

      // Animate in
      requestAnimationFrame(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateX(0)";
      });

      // Auto-remove
      setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(100%)";
        setTimeout(() => {
          if (toast.parentNode) {
            toast.remove();
          }
        }, 300);
      }, duration);

      return toast;
    }

    // Enhanced HTTP request with retry logic
    async function makeRequest(url, options = {}) {
      const requestId = Date.now() + Math.random();
      state.pendingRequests.add(requestId);

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT);

        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          if (response.status === 404) {
              showToast("Something Wrong!", "error");
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response;
      } catch (error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out');
        }
        throw error;
      } finally {
        state.pendingRequests.delete(requestId);
      }
    }

    async function makeRequestWithRetry(url, options = {}, maxRetries = CONFIG.RETRY_ATTEMPTS) {
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          return await makeRequest(url, options);
        } catch (error) {
          if (attempt === maxRetries) {
            throw error;
          }

          console.warn(`Request attempt ${attempt + 1} failed:`, error.message);
          await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY * (attempt + 1)));
        }
      }
    }

    // Path element finder with fallback
    function findPathElement() {
      const mediaSource = document.querySelector(SELECTORS.MEDIA_SOURCES);
      if (!mediaSource) return null;

      // Try multiple selectors as fallback
      const selectors = [
        "div:nth-child(2) > div > div:first-child",
        "div:first-child > div > div:first-child",
        "div div div:first-child"
      ];

      for (const selector of selectors) {
        const element = mediaSource.querySelector(selector);
        if (element && element.textContent?.trim()) {
          return element;
        }
      }

      return null;
    }

    // Thumbnail generation functions
    function createThumbnailHandler(mode, description) {
      return async (path) => {
        const sanitizedPath = sanitizePath(path);
        if (!validatePath(sanitizedPath)) {
          showToast("Invalid path provided", "error");
          return;
        }

        const loadingToast = showToast(`⌛ ${description} for ${sanitizedPath}...`, "info");

        try {
          const encodedPath = encodeURIComponent(sanitizedPath);
          const url = `${CONFIG.EMBY_LOCAL_ENDPOINT}?path=${encodedPath}&mode=${mode}`;

          console.log(`Generating ${mode} thumb:`, sanitizedPath);

          await makeRequestWithRetry(url);

          loadingToast.remove();
          showToast(`✅ ${description} completed successfully`, "success");
          console.log(`${mode} successfully`);

        } catch (error) {
          loadingToast.remove();
          const errorMsg = `Failed to generate ${mode} thumbnail: ${error.message}`;
          console.error(errorMsg, error);
          showToast(errorMsg, "error");
        }
      };
    }

    function sendDataToLocalServer(data, path) {
        let url = `http://127.0.0.1:58000/${path}/`
        GM.xmlHttpRequest({
            method: "POST",
            url: url,
            data: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    // Path opening function
    async function openPath(path) {
      // const sanitizedPath = sanitizePath(path);
      // if (!validatePath(sanitizedPath)) {
      //  showToast("Invalid path provided", "error");
      //  return;
      // }

      try {
        // const encodedPath = encodeURIComponent(sanitizedPath);
        const data = {
            full_path: path
        };

        sendDataToLocalServer(data, "openFolder")

        // await makeRequestWithRetry(url);


        showToast("📁 Path opened in Directory Opus", "success");
        console.log("Opened in Directory Opus");

      } catch (error) {
        const errorMsg = `Failed to open path: ${error.message}`;
        console.error(errorMsg, error);
        showToast(errorMsg, "error");
      }
    }

    // Button factory
    function createButton(label, onClick, color = "#2196F3") {
      const btn = document.createElement("button");
      btn.textContent = label;

      Object.assign(btn.style, {
        marginRight: "8px",
        marginBottom: "4px",
        padding: "8px 12px",
        borderRadius: "6px",
        backgroundColor: color,
        color: "white",
        border: "none",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "500",
        transition: "all 0.2s ease",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
      });

      // Hover effects
      btn.addEventListener("mouseenter", () => {
        btn.style.transform = "translateY(-1px)";
        btn.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
      });

      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translateY(0)";
        btn.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
      });

      btn.addEventListener("click", onClick);
      return btn;
    }

    // Main button insertion logic

    function insertButtons() {
        const target = findPathElement();
        if (!target) return;
        const pathText = target.textContent.trim();
        if (!validatePath(pathText)) return;

        // Check if buttons already exist for this path
        const existingContainer = target.parentElement.querySelector('.userscript-button-container');
        if (existingContainer && state.currentPath === pathText) return;

        // Remove existing buttons if path changed
        if (existingContainer) {
            existingContainer.remove();
        }

        state.currentPath = pathText;
        state.buttonsInserted = true;

        // todo:
        // Insert buttons using insertAdjacentHTML
        target.insertAdjacentHTML('beforeBegin', `
    <div class="userscript-button-container" style="margin-bottom: 12px; display: flex; flex-wrap: wrap; gap: 4px;">
      <button id="openPathBtn" style="background-color: #FF9800;">📁 Open Path</button>
      <button id="singleThumbBtn" style="background-color: #4CAF50;">🖼️ Single Thumb</button>
      <button id="fullThumbBtn" style="background-color: #2196F3;">🎬 Full Thumb</button>
      <button id="skipExistingBtn" style="background-color: #9C27B0;">⏭️ Skip Existing</button>
      <button id="singleTrimBtn" style="background-color: #FF6467;">📽️ Trim Single Video</button>
      <button id="fullTrimBtn" style="background-color: #E7000B;">📽️ Trim All Videos</button>
    </div>
  `);

        // Add event listeners to the newly created buttons
        const container = target.previousElementSibling;
        const openPathBtn = container.querySelector('#openPathBtn');
        const singleThumbBtn = container.querySelector('#singleThumbBtn');
        const fullThumbBtn = container.querySelector('#fullThumbBtn');
        const skipExistingBtn = container.querySelector('#skipExistingBtn');
        const singleTrimBtn = container.querySelector('#singleTrimBtn');
        const fullTrimBtn = container.querySelector('#fullTrimBtn');

        openPathBtn.addEventListener("click", () => openPath(pathText), false);
        singleThumbBtn.addEventListener("click", () => singleThumbHandler(pathText), false);
        fullThumbBtn.addEventListener("click", () => fullThumbHandler(pathText), false);
        skipExistingBtn.addEventListener("click", () => skipThumbHandler(pathText), false);
        singleTrimBtn.addEventListener("click", () => singleTrimConstHandler(pathText), false);
        fullTrimBtn.addEventListener("click", () => fullTrimConstHandler(pathText), false);

        // Create handlers
        const singleThumbHandler = createThumbnailHandler("single", "Generating single thumbnail");
        const fullThumbHandler = createThumbnailHandler("full", "Generating full thumbnail");
        const skipThumbHandler = createThumbnailHandler("skip", "Generating thumbnail (skip existing)");
        const singleTrimConstHandler = trimHandler("trim", "Trimming single video");
        const fullTrimConstHandler = trimHandler("fulltrim", "Trimming all videos");

        console.log("Buttons inserted for path:", pathText);
    }

    // --- NEW FUNCTION: showTrimInputDialog ---
    // This function creates a modal dialog to get start and end seconds from the user.
    // It uses basic inline styling, assuming your Tampermonkey script might not have external CSS.
    // It also tries to use CSS variables like --card-bg, --text-color etc., which might be
    // defined by your existing `addToastStyles` or other theme settings.
    function showTrimInputDialog(defaultStart = '', defaultEnd = '') {
        return new Promise((resolve) => {
            // Helper function to convert seconds to HH:MM:SS
            const secondsToTime = (seconds) => {
                if (!seconds) return '';
                const h = Math.floor(seconds / 3600);
                const m = Math.floor((seconds % 3600) / 60);
                const s = seconds % 60;
                return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
            };

            // Helper function to convert HH:MM:SS to seconds
            const timeToSeconds = (h, m, s) => {
                return parseInt(h || 0) * 3600 + parseInt(m || 0) * 60 + parseInt(s || 0);
            };

            // Parse default values
            const parseDefaultTime = (seconds) => {
                if (!seconds) return { h: '', m: '', s: '' };
                const h = Math.floor(seconds / 3600);
                const m = Math.floor((seconds % 3600) / 60);
                const s = seconds % 60;
                return {
                    h: String(h).padStart(2, '0'),
                    m: String(m).padStart(2, '0'),
                    s: String(s).padStart(2, '0')
                };
            };

            const defaultStartParsed = parseDefaultTime(defaultStart);
            const defaultEndParsed = parseDefaultTime(defaultEnd);

            // Create overlay (for backdrop)
            const overlay = document.createElement('div');
            overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

            // Create modal content container
            const modal = document.createElement('div');
            modal.style.cssText = `
            background-color: var(--card-bg, #2a2a2a);
            color: var(--text-color, #fff);
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            width: 400px;
            max-width: 90%;
            display: flex;
            flex-direction: column;
            gap: 15px;
            font-family: sans-serif;
        `;

            const title = document.createElement('h3');
            title.textContent = 'Enter Trim Time';
            title.style.cssText = `
            margin: 0;
            color: var(--info-color, #17a2b8);
            border-bottom: 1px solid rgba(255,255,255,0.1);
            padding-bottom: 10px;
        `;

            // Helper to create time input group
            const createTimeInput = (label, defaultValues) => {
                const container = document.createElement('div');
                container.style.cssText = `display: flex; flex-direction: column; gap: 8px;`;

                const labelEl = document.createElement('label');
                labelEl.textContent = label;
                labelEl.style.cssText = `font-size: 0.95rem;`;

                const inputContainer = document.createElement('div');
                inputContainer.style.cssText = `
                display: flex;
                align-items: center;
                gap: 8px;
            `;

                const inputStyle = `
                padding: 8px;
                border: 1px solid var(--border-color, #555);
                border-radius: 4px;
                background-color: var(--input-bg, #333);
                color: var(--text-color, #fff);
                font-size: 1.1rem;
                outline: none;
                text-align: center;
                width: 50px;
                font-family: monospace;
            `;

                // Hours input
                const hoursInput = document.createElement('input');
                hoursInput.type = 'text';
                hoursInput.placeholder = '00';
                hoursInput.maxLength = '2';
                hoursInput.value = defaultValues.h;
                hoursInput.style.cssText = inputStyle;

                // Minutes input
                const minutesInput = document.createElement('input');
                minutesInput.type = 'text';
                minutesInput.placeholder = '00';
                minutesInput.maxLength = '2';
                minutesInput.value = defaultValues.m;
                minutesInput.style.cssText = inputStyle;

                // Seconds input
                const secondsInput = document.createElement('input');
                secondsInput.type = 'text';
                secondsInput.placeholder = '00';
                secondsInput.maxLength = '2';
                secondsInput.value = defaultValues.s;
                secondsInput.style.cssText = inputStyle;

                const colon1 = document.createElement('span');
                colon1.textContent = ':';
                colon1.style.cssText = `font-size: 1.3rem; font-weight: bold;`;

                const colon2 = document.createElement('span');
                colon2.textContent = ':';
                colon2.style.cssText = `font-size: 1.3rem; font-weight: bold;`;

                // Auto-focus next input and format
                const formatAndMove = (input, nextInput, maxValue) => {
                    input.addEventListener('input', (e) => {
                        // Only allow numbers
                        e.target.value = e.target.value.replace(/[^0-9]/g, '');

                        // Auto-advance when 2 digits entered
                        if (e.target.value.length === 2 && nextInput) {
                            nextInput.focus();
                            nextInput.select();
                        }
                    });

                    input.addEventListener('blur', () => {
                        if (input.value && input.value.length === 1) {
                            input.value = '0' + input.value;
                        }
                        // Validate max value
                        if (maxValue && parseInt(input.value) > maxValue) {
                            input.value = String(maxValue).padStart(2, '0');
                        }
                    });

                    input.addEventListener('focus', () => {
                        input.style.borderColor = 'var(--info-color, #17a2b8)';
                        input.select();
                    });

                    input.addEventListener('blur', () => {
                        input.style.borderColor = 'var(--border-color, #555)';
                    });

                    // Handle backspace to move to previous field
                    input.addEventListener('keydown', (e) => {
                        if (e.key === 'Backspace' && input.value === '' && input.previousInput) {
                            input.previousInput.focus();
                            input.previousInput.select();
                        }
                    });
                };

                formatAndMove(hoursInput, minutesInput, null);
                formatAndMove(minutesInput, secondsInput, 59);
                formatAndMove(secondsInput, null, 59);

                minutesInput.previousInput = hoursInput;
                secondsInput.previousInput = minutesInput;

                inputContainer.appendChild(hoursInput);
                inputContainer.appendChild(colon1);
                inputContainer.appendChild(minutesInput);
                inputContainer.appendChild(colon2);
                inputContainer.appendChild(secondsInput);

                container.appendChild(labelEl);
                container.appendChild(inputContainer);

                return { container, hoursInput, minutesInput, secondsInput };
            };

            // Create start time input
            const startTimeInput = createTimeInput('Start Time (HH:MM:SS, optional):', defaultStartParsed);

            // Create end time input
            const endTimeInput = createTimeInput('End Time (HH:MM:SS, optional):', defaultEndParsed);

            // Button container
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = `
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 10px;
        `;

            // OK button
            const okButton = document.createElement('button');
            okButton.textContent = 'OK';
            okButton.style.cssText = `
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            background-color: var(--success-color, #28a745);
            color: #fff;
            cursor: pointer;
            font-size: 1rem;
            transition: background-color 0.2s ease;
        `;
            okButton.onmouseover = () => okButton.style.backgroundColor = 'var(--success-color-dark, #218838)';
            okButton.onmouseout = () => okButton.style.backgroundColor = 'var(--success-color, #28a745)';

            // Cancel button
            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancel';
            cancelButton.style.cssText = `
            padding: 10px 20px;
            border: 1px solid var(--border-color, #555);
            border-radius: 5px;
            background-color: var(--input-bg, #333);
            color: var(--text-color, #fff);
            cursor: pointer;
            font-size: 1rem;
            transition: background-color 0.2s ease;
        `;
            cancelButton.onmouseover = () => cancelButton.style.backgroundColor = 'var(--hover-bg, #444)';
            cancelButton.onmouseout = () => cancelButton.style.backgroundColor = 'var(--input-bg, #333)';

            // Helper to remove the dialog from DOM
            const closeDialog = () => {
                document.body.removeChild(overlay);
            };

            // Event listener for OK button
            okButton.addEventListener('click', () => {
                const startH = startTimeInput.hoursInput.value;
                const startM = startTimeInput.minutesInput.value;
                const startS = startTimeInput.secondsInput.value;

                const endH = endTimeInput.hoursInput.value;
                const endM = endTimeInput.minutesInput.value;
                const endS = endTimeInput.secondsInput.value;

                const hasStart = startH || startM || startS;
                const hasEnd = endH || endM || endS;

                if (!hasStart && !hasEnd) {
                    resolve(null);
                } else {
                    const result = {};
                    if (hasStart) {
                        result.start_sec = timeToSeconds(startH, startM, startS);
                    }
                    if (hasEnd) {
                        result.end_sec = timeToSeconds(endH, endM, endS);
                    }
                    resolve(result);
                }
                closeDialog();
            });

            // Event listener for Cancel button
            cancelButton.addEventListener('click', () => {
                resolve(null);
                closeDialog();
            });

            // Assemble the modal
            buttonContainer.appendChild(cancelButton);
            buttonContainer.appendChild(okButton);

            modal.appendChild(title);
            modal.appendChild(startTimeInput.container);
            modal.appendChild(endTimeInput.container);
            modal.appendChild(buttonContainer);

            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            startTimeInput.hoursInput.focus();
            startTimeInput.hoursInput.select();
        });
    }

    // --- MODIFIED: TrimHandler function ---
    function trimHandler(mode, description) {
        return async (path) => {
            const sanitizedPath = sanitizePath(path);
            // Assuming validatePath and showToast are defined elsewhere in your script
            if (!validatePath(sanitizedPath)) {
                showToast("Invalid path provided", "error");
                return;
            }

            // 1. Show the popup and wait for user input
            const trimSeconds = await showTrimInputDialog();

            // If the user canceled the dialog or provided no values, stop the operation
            if (trimSeconds === null) {
                showToast("Trim operation cancelled or no seconds specified.", "info");
                return;
            }

            const loadingToast = showToast(`⌛ ${description} for ${sanitizedPath}...`, "info");

            try {
                const encodedPath = encodeURIComponent(sanitizedPath);

                // 2. Use URLSearchParams to build the URL cleanly
                const urlParams = new URLSearchParams();
                urlParams.append('path', encodedPath);
                urlParams.append('mode', mode);

                // Add start_sec and end_sec if they were provided
                if (trimSeconds.start_sec !== undefined) {
                    urlParams.append('start_sec', trimSeconds.start_sec);
                }
                if (trimSeconds.end_sec !== undefined) {
                    urlParams.append('end_sec', trimSeconds.end_sec);
                }

                // Construct the final URL
                const url = `${CONFIG.EMBY_LOCAL_ENDPOINT}?${urlParams.toString()}`;

                console.log(`${mode}:`, sanitizedPath, `(Trim: ${trimSeconds.start_sec || 'N/A'}-${trimSeconds.end_sec || 'N/A'})`);

                // Assuming makeRequestWithRetry is defined elsewhere
                await makeRequestWithRetry(url);

                loadingToast.remove();
                showToast(`✅ ${description} completed successfully`, "success");
                console.log(`${mode} successfully`);

            } catch (error) {
                loadingToast.remove();
                const errorMsg = `Failed to generate ${mode} thumbnail: ${error.message}`;
                console.error(errorMsg, error);
                showToast(errorMsg, "error");
            }
        };
    }

    // Cleanup function
    function cleanup() {
      // Cancel pending requests
      state.pendingRequests.clear();

      // Remove toast container
      const toastContainer = document.getElementById("userscript-toast-container");
      if (toastContainer) {
        toastContainer.remove();
      }
    }

    // Enhanced mutation observer with better performance
    // const debouncedAddSaveButton = debounce(addSaveButtonIfReady, 100);
    const debouncedInsertButtons = debounce(insertButtons, 200);

    const observer = new MutationObserver((mutations) => {
      // Check for URL changes first
      checkUrlChange();

      let shouldCheck = false;

      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE && (
              node.matches?.(SELECTORS.VIDEO_OSD) ||
              node.matches?.(SELECTORS.MEDIA_SOURCES) ||
              node.querySelector?.(SELECTORS.VIDEO_OSD) ||
              node.querySelector?.(SELECTORS.MEDIA_SOURCES) ||
              node.classList?.contains('page') ||
              node.classList?.contains('view')
            )) {
              shouldCheck = true;
              break;
            }
          }
        }
        if (shouldCheck) break;
      }

      if (shouldCheck) {
        // debouncedAddSaveButton();
        debouncedInsertButtons();
      }
    });

    // Initialize
    function init() {
      console.log("Emby Functions Enhanced userscript initialized");

      // Initial checks
      // addSaveButtonIfReady();
      insertButtons();

      // Start observing with more comprehensive settings
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style'],
        characterData: false
      });
    }

    // Continuous checking for dynamic content
    setInterval(() => {
      checkUrlChange();
      // if (!state.saveButtonAdded) addSaveButtonIfReady();
      if (!document.querySelector('.userscript-button-container')) {
        resetState();
        insertButtons();
      }
    }, 2000);

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        resetState();
        setTimeout(init, 100);
      }
    });

    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup);

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }

  })();