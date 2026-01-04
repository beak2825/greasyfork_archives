// ==UserScript==
// @name         Video Speed Controller (Userscript)
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Control HTML5 video playback speed with shortcuts and an on-screen controller. Based on codebicycle/videospeed.
// @author       Based on codebicycle/videospeed, adapted by [https://github.com/codebicycle/videospeed]
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_log
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531052/Video%20Speed%20Controller%20%28Userscript%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531052/Video%20Speed%20Controller%20%28Userscript%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Start: CSS ---
    const shadowCSS = `
      :host {
        all: initial; /* Isolate from host page CSS */
      }
      #controller {
        position: fixed;
        z-index: 2147483647; /* Max possible z-index */
        top: 10px;
        left: 10px;
        background-color: rgba(0, 0, 0, 0.7);
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 3px 5px;
        transition: opacity 0.2s ease-in-out;
        font-family: sans-serif;
        font-size: 14px;
        color: white;
        cursor: pointer;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
      }
      #controller.dragging {
        cursor: grabbing;
      }
      #controller.vsc-hidden:not(.vsc-manual) {
        opacity: 0 !important; /* Override inline style if not manually hidden */
        pointer-events: none;
      }
      #controller.vsc-nosource {
        display: none !important;
      }
      #controls {
        display: flex;
        align-items: center;
        margin-left: 5px;
      }
      span.draggable {
        padding: 5px 8px;
        cursor: grab;
        user-select: none; /* Prevent text selection during drag */
      }
      button {
        background: none;
        border: none;
        color: white;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        padding: 2px 5px;
        margin: 0 1px;
        min-width: 20px;
        line-height: 1;
      }
      button:hover {
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
      }
      button.rw { /* Rewind/Advance buttons */
        font-size: 14px;
      }
      button.hideButton {
        font-size: 14px;
        padding: 2px 4px;
      }
    `;

    const settingsDialogCSS = `
        #vscSettingsDialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 2147483647; /* Above controller */
            max-height: 80vh;
            overflow-y: auto;
            padding: 20px;
            border-radius: 8px;
            font-family: sans-serif;
            font-size: 14px;
            color: #333;
            min-width: 450px;
            max-width: 90vw;
        }
        #vscSettingsDialog h3 {
            margin-top: 0;
            margin-bottom: 15px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
        }
        #vscSettingsDialog .vsc-settings-row {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            gap: 10px;
        }
        #vscSettingsDialog .vsc-settings-row label {
            flex-basis: 150px;
            flex-shrink: 0;
            text-align: right;
            font-weight: bold;
        }
         #vscSettingsDialog .vsc-settings-row label i {
            font-weight: normal;
            font-size: 0.9em;
            color: #666;
            display: block;
         }
        #vscSettingsDialog input[type="text"],
        #vscSettingsDialog input[type="number"],
        #vscSettingsDialog select,
        #vscSettingsDialog textarea {
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 3px;
            flex-grow: 1;
        }
         #vscSettingsDialog input[type="checkbox"] {
            margin-left: 5px;
         }
        #vscSettingsDialog textarea {
            min-height: 100px;
            resize: vertical;
        }
        #vscSettingsDialog .vsc-keybinding-row {
            display: grid;
            grid-template-columns: 150px 100px 80px 1fr auto;
            gap: 5px;
            margin-bottom: 5px;
            align-items: center;
        }
         #vscSettingsDialog .vsc-keybinding-row select,
         #vscSettingsDialog .vsc-keybinding-row input {
            width: 100%;
            box-sizing: border-box;
         }
        #vscSettingsDialog button {
            padding: 8px 15px;
            cursor: pointer;
            border: 1px solid #ccc;
            border-radius: 4px;
            margin-right: 5px;
        }
        #vscSettingsDialog button.vsc-save { background-color: #4CAF50; color: white; border-color: #4CAF50; }
        #vscSettingsDialog button.vsc-restore { background-color: #ff9800; color: white; border-color: #ff9800; }
        #vscSettingsDialog button.vsc-close { background-color: #f44336; color: white; border-color: #f44336;}
        #vscSettingsDialog button.vsc-remove-binding { background-color: #ddd; color: #333; border-color: #ccc; padding: 2px 5px; font-size: 12px;}
        #vscSettingsDialog .vsc-settings-actions {
            margin-top: 20px;
            text-align: right;
        }
        #vscSettingsDialog #vscStatus {
          margin-top: 10px;
          color: green;
          font-weight: bold;
        }
    `;
    // --- End: CSS ---


    var regStrip = /^[\r\t\f\v ]+|[\r\t\f\v ]+$/gm;

    var tcDefaults = {
        lastSpeed: 1.0,
        enabled: true,
        speeds: {}, // Holds speed per source URL (if rememberSpeed is on)

        rememberSpeed: false,
        forceLastSavedSpeed: false,
        audioBoolean: false, // Process <audio> tags
        startHidden: false,
        controllerOpacity: 0.3,

        keyBindings: [
            { action: "display", key: 86, value: 0, force: false, predefined: true }, // V
            { action: "slower", key: 83, value: 0.1, force: false, predefined: true }, // S
            { action: "faster", key: 68, value: 0.1, force: false, predefined: true }, // D
            { action: "rewind", key: 90, value: 10, force: false, predefined: true }, // Z
            { action: "advance", key: 88, value: 10, force: false, predefined: true }, // X
            { action: "reset", key: 82, value: 1.0, force: false, predefined: true }, // R - special handling: toggles between 1.0 and 'fast' speed
            { action: "fast", key: 71, value: 1.8, force: false, predefined: true } // G - the 'preferred' speed for reset toggle
            // Users can add more, e.g., pause, mute, mark, jump
        ],
        blacklist: `\
www.instagram.com
twitter.com
vine.co
imgur.com
teams.microsoft.com
        `.replace(regStrip, ""),
        defaultLogLevel: 4, // 1=none, 2=error, 3=warn, 4=info, 5=debug, 6=verbose+trace
        logLevel: 3 // Default level
    };

    var tc = {
        settings: {}, // Loaded settings will go here
        mediaElements: [], // Attached video/audio elements
        videoController: null, // Will hold the constructor
        coolDown: false // For ratechange event handler
    };

    /* Log levels (depends on caller specifying the correct level)
      1 - none, 2 - error, 3 - warning, 4 - info, 5 - debug, 6 - verbose+trace */
    function log(message, level) {
        const verbosity = tc.settings.logLevel || tcDefaults.logLevel;
        level = level || tc.settings.defaultLogLevel || tcDefaults.defaultLogLevel;
        if (verbosity >= level) {
            let prefix = "";
            switch(level) {
                case 2: prefix = "ERROR:"; break;
                case 3: prefix = "WARNING:"; break;
                case 4: prefix = "INFO:"; break;
                case 5: prefix = "DEBUG:"; break;
                case 6: prefix = "DEBUG(V):"; break;
            }
            if (typeof GM_log === 'function') {
                GM_log(prefix + message); // Use GM_log if available
            } else {
                console.log("VSC: " + prefix + message);
            }
            if (level === 6) console.trace();
        }
    }

     // --- KeyCode Utilities (from options.js) ---
    var keyCodeAliases = { /* ... (same as in your options.js) ... */
        0: "null", null: "null", undefined: "null", 32: "Space", 37: "Left", 38: "Up", 39: "Right", 40: "Down",
        96: "Num 0", 97: "Num 1", 98: "Num 2", 99: "Num 3", 100: "Num 4", 101: "Num 5", 102: "Num 6", 103: "Num 7", 104: "Num 8", 105: "Num 9",
        106: "Num *", 107: "Num +", 109: "Num -", 110: "Num .", 111: "Num /", 112: "F1", 113: "F2", 114: "F3", 115: "F4", 116: "F5", 117: "F6",
        118: "F7", 119: "F8", 120: "F9", 121: "F10", 122: "F11", 123: "F12", 186: ";", 188: "<", 189: "-", 187: "+", 190: ">", 191: "/",
        192: "~", 219: "[", 220: "\\", 221: "]", 222: "'", 59: ";", 61: "+", 173: "-"
    };
    var customActionsNoValues = ["pause", "muted", "mark", "jump", "display"];

    function recordKeyPress(e) { /* ... (same as in your options.js) ... */
        if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90) || keyCodeAliases[e.keyCode]) {
            e.target.value = keyCodeAliases[e.keyCode] || String.fromCharCode(e.keyCode);
            e.target.keyCode = e.keyCode;
            e.preventDefault(); e.stopPropagation();
        } else if (e.keyCode === 8) { e.target.value = ""; e.target.keyCode = null; }
        else if (e.keyCode === 27) { e.target.value = "null"; e.target.keyCode = null; }
    }
    function inputFilterNumbersOnly(e) { /* ... (same as in your options.js) ... */
        var char = String.fromCharCode(e.keyCode); if (!/[\d\.]$/.test(char) || !/^\d+(\.\d*)?$/.test(e.target.value + char)) { e.preventDefault(); e.stopPropagation(); }
    }
    function inputFocus(e) { e.target.value = ""; }
    function inputBlur(e) { e.target.value = keyCodeAliases[e.target.keyCode] || String.fromCharCode(e.target.keyCode) || 'press a key'; }
    // --- End KeyCode Utilities ---

    async function loadSettings() {
        log("Loading settings...", 5);
        const storedSettings = await GM_getValue('vscSettings', {});
        // Deep merge defaults and stored settings (simple version)
        tc.settings = { ...tcDefaults }; // Start with defaults
        for (const key in tcDefaults) {
            if (storedSettings.hasOwnProperty(key)) {
                 // Special handling for potentially complex types like keyBindings
                if (key === 'keyBindings' && Array.isArray(storedSettings[key])) {
                   tc.settings[key] = JSON.parse(JSON.stringify(storedSettings[key])); // Deep copy array
                } else if (key === 'speeds' && typeof storedSettings[key] === 'object') {
                   tc.settings[key] = { ...storedSettings[key] }; // Copy speeds object
                } else if (typeof storedSettings[key] === typeof tcDefaults[key] || storedSettings[key] == null) {
                    // Basic type match or stored is null/undefined -> use stored
                    tc.settings[key] = storedSettings[key];
                }
                // Otherwise, keep the default (type mismatch?) - could log a warning
            }
        }

        // Ensure essential structure exists (especially after updates)
        tc.settings.keyBindings = tc.settings.keyBindings || [];
        tc.settings.speeds = tc.settings.speeds || {};

        // Upgrade/Fix: Ensure 'display' keybinding exists
        if (!tc.settings.keyBindings.some(b => b.action === 'display')) {
            log("Adding missing 'display' keybinding", 3);
            tc.settings.keyBindings.push({ action: "display", key: 86, value: 0, force: false, predefined: true }); // Default V
        }

        // Convert relevant settings to correct types (GM_getValue might return strings)
        tc.settings.lastSpeed = Number(tc.settings.lastSpeed) || tcDefaults.lastSpeed;
        tc.settings.enabled = tc.settings.enabled === true; // Force boolean
        tc.settings.rememberSpeed = tc.settings.rememberSpeed === true;
        tc.settings.forceLastSavedSpeed = tc.settings.forceLastSavedSpeed === true;
        tc.settings.audioBoolean = tc.settings.audioBoolean === true;
        tc.settings.startHidden = tc.settings.startHidden === true;
        tc.settings.controllerOpacity = Number(tc.settings.controllerOpacity) || tcDefaults.controllerOpacity;
        tc.settings.logLevel = Number(tc.settings.logLevel) || tcDefaults.logLevel;
        tc.settings.blacklist = String(tc.settings.blacklist || tcDefaults.blacklist);

        // Clean up keybindings (ensure numbers)
        tc.settings.keyBindings.forEach(b => {
            b.key = Number(b.key);
            b.value = Number(b.value);
            b.force = String(b.force) === 'true'; // Force boolean from string/bool
            b.predefined = b.predefined === true;
        });

        log("Settings loaded.", 4);
        // GM_log(JSON.stringify(tc.settings, null, 2)); // Debug: Log loaded settings
    }

    async function saveSettings() {
        log("Saving settings...", 5);
        // Ensure types are correct before saving
        const settingsToSave = {
            ...tc.settings,
            lastSpeed: Number(tc.settings.lastSpeed),
            enabled: Boolean(tc.settings.enabled),
            rememberSpeed: Boolean(tc.settings.rememberSpeed),
            forceLastSavedSpeed: Boolean(tc.settings.forceLastSavedSpeed),
            audioBoolean: Boolean(tc.settings.audioBoolean),
            startHidden: Boolean(tc.settings.startHidden),
            controllerOpacity: Number(tc.settings.controllerOpacity),
            blacklist: String(tc.settings.blacklist).replace(regStrip, ""),
            logLevel: Number(tc.settings.logLevel),
            keyBindings: tc.settings.keyBindings.map(b => ({
                action: String(b.action),
                key: Number(b.key) || null, // Store null if no key
                value: Number(b.value) || 0,
                force: String(b.force), // Store as string 'true'/'false'
                predefined: Boolean(b.predefined)
            }))
            // Note: tc.settings.speeds is managed internally by the controller/ratechange,
            // but we might want to persist it IF rememberSpeed is true long-term.
            // For simplicity here, we are NOT saving the 'speeds' map. It relies on lastSpeed.
        };
        // Remove the potentially large 'speeds' map before saving general settings
        delete settingsToSave.speeds;
        delete settingsToSave.defaultLogLevel; // Don't save defaults

        await GM_setValue('vscSettings', settingsToSave);
        log("Settings saved.", 4);
    }

     function getKeyBindings(action, what = "value") {
         // Find function remains useful
         try {
             const binding = tc.settings.keyBindings.find((item) => item.action === action);
             return binding ? binding[what] : undefined; // Return undefined if not found
         } catch (e) {
             log("Error getting key binding for action '" + action + "': " + e, 2);
             return undefined;
         }
     }

     function setKeyBindings(action, value, what = "value") {
        // Find and update function remains useful
         try {
             const binding = tc.settings.keyBindings.find((item) => item.action === action);
             if (binding) {
                 binding[what] = value;
             } else {
                log("Could not find key binding for action '" + action + "' to set " + what, 3);
             }
         } catch (e) {
             log("Error setting key binding for action '" + action + "': " + e, 2);
         }
     }

    function defineVideoController() {
        // --- This function is largely the same as in inject.js ---
        // Key differences:
        // - CSS is embedded in shadowTemplate
        // - GM_addStyle is not needed here (used elsewhere for settings dialog)
        // - chrome.runtime.getURL is removed

        tc.videoController = function (target, parent) {
            if (target.vsc) { return target.vsc; }
            log("Attaching controller to: " + (target.currentSrc || target.src || target.tagName), 5);
            tc.mediaElements.push(target);

            this.video = target;
            this.parent = target.parentElement || parent;

            // --- Speed initialization logic (slightly modified) ---
            let currentSpeed = tc.settings.lastSpeed; // Start with global last speed
            if (tc.settings.rememberSpeed && tc.settings.speeds && target.currentSrc && tc.settings.speeds[target.currentSrc]) {
                // If remembering and we have a specific speed for this URL, use it
                currentSpeed = tc.settings.speeds[target.currentSrc];
                 log(`Recalling stored speed for ${target.currentSrc}: ${currentSpeed}`, 5);
            } else if (!tc.settings.rememberSpeed) {
                // If not remembering speed, always reset to 1.0 unless forced
                if (!tc.settings.forceLastSavedSpeed) {
                   currentSpeed = 1.0;
                   log("Setting speed to 1.0 (rememberSpeed false, forceLastSavedSpeed false)", 5);
                } else {
                   log(`Using last saved speed ${tc.settings.lastSpeed} (rememberSpeed false, forceLastSavedSpeed true)`, 5);
                }
            } else {
                 log(`Using global last speed ${tc.settings.lastSpeed} (rememberSpeed true, no specific URL speed)`, 5);
            }
            // --- End Speed initialization ---

            log("Applying initial playbackRate: " + currentSpeed, 4);
            target.playbackRate = currentSpeed; // Apply the determined speed


            this.div = this.initializeControls(currentSpeed); // Pass speed for initial display

            var mediaEventAction = (event) => {
                 // Simplified event action: On play/seek, re-apply the *current* speed setting.
                 // The ratechange listener handles the actual updates and persistence.
                 // This prevents sites that reset speed on play/seek from breaking things.
                 const targetSpeed = target.vsc?.speedIndicator?.textContent ? Number(target.vsc.speedIndicator.textContent) : tc.settings.lastSpeed;
                 log(`"${event.type}" event detected. Re-applying speed: ${targetSpeed}`, 5);
                 // Use setSpeed to ensure consistency and events if needed
                 setSpeed(event.target, targetSpeed);
            };

            target.addEventListener("play", this.handlePlay = mediaEventAction.bind(this));
            target.addEventListener("seeked", this.handleSeek = mediaEventAction.bind(this)); // Use 'seeked' not 'seek'

            // --- MutationObserver for src changes ---
            var observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === "attributes" && (mutation.attributeName === "src" || mutation.attributeName === "currentSrc")) {
                        log("Mutation observer: src/currentSrc changed on video element.", 5);
                        var controllerDiv = this.div; // The outer wrapper div
                        if (!mutation.target.src && !mutation.target.currentSrc) {
                            controllerDiv.classList.add("vsc-nosource");
                        } else {
                            controllerDiv.classList.remove("vsc-nosource");
                            // Optionally re-apply speed for the new source
                             let newSrcSpeed = tc.settings.lastSpeed;
                             if (tc.settings.rememberSpeed && tc.settings.speeds && mutation.target.currentSrc && tc.settings.speeds[mutation.target.currentSrc]) {
                                newSrcSpeed = tc.settings.speeds[mutation.target.currentSrc];
                             } else if (!tc.settings.rememberSpeed && !tc.settings.forceLastSavedSpeed) {
                                newSrcSpeed = 1.0;
                             }
                             log(`Applying speed ${newSrcSpeed} for new source: ${mutation.target.currentSrc}`, 4);
                             setSpeed(mutation.target, newSrcSpeed);
                        }
                    }
                });
            });
            observer.observe(target, { attributeFilter: ["src", "currentSrc"] });
            target.vscObserver = observer; // Store observer for cleanup
        };

        tc.videoController.prototype.remove = function () {
            log("Removing controller from: " + (this.video.currentSrc || this.video.src || this.video.tagName), 5);
            if (this.div) this.div.remove();
            this.video.removeEventListener("play", this.handlePlay);
            this.video.removeEventListener("seeked", this.handleSeek);
            if (this.video.vscObserver) this.video.vscObserver.disconnect();

            let idx = tc.mediaElements.indexOf(this.video);
            if (idx != -1) { tc.mediaElements.splice(idx, 1); }
            delete this.video.vscObserver;
            delete this.video.vsc; // Remove back-reference
        };

        tc.videoController.prototype.initializeControls = function (initialSpeed) {
            log("initializeControls Begin", 5);
            const document = this.video.ownerDocument;
            const speed = Number(initialSpeed).toFixed(2); // Use passed initial speed
            var top = "10px"; // Use fixed position now
            var left = "10px"; // Use fixed position now

            log("Initial speed indicator: " + speed, 5);

            var wrapper = document.createElement("div");
            wrapper.classList.add("vsc-controller"); // Outer wrapper for positioning/visibility

            if (!this.video.src && !this.video.currentSrc) { wrapper.classList.add("vsc-nosource"); }
            if (tc.settings.startHidden) { wrapper.classList.add("vsc-hidden"); }

            var shadow = wrapper.attachShadow({ mode: "open" });
            var shadowTemplate = `
                <style>
                  ${shadowCSS} /* Embed CSS here */
                </style>

                <div id="controller" style="opacity:${tc.settings.controllerOpacity}">
                  <span data-action="drag" class="draggable" title="Drag to move">${speed}</span>
                  <span id="controls">
                    <button data-action="rewind" class="rw" title="Rewind (${getKeyBindings('rewind', 'value')}s)">«</button>
                    <button data-action="slower" title="Slower (by ${getKeyBindings('slower', 'value')})">−</button>
                    <button data-action="faster" title="Faster (by ${getKeyBindings('faster', 'value')})">+</button>
                    <button data-action="advance" class="rw" title="Advance (${getKeyBindings('advance', 'value')}s)">»</button>
                    <button data-action="display" class="hideButton" title="Show/Hide Controller">×</button>
                  </span>
                </div>
              `;
            shadow.innerHTML = shadowTemplate;

            this.speedIndicator = shadow.querySelector("span.draggable"); // Correct selector
            const controllerElement = shadow.querySelector("#controller");

            // --- Event Listeners for Shadow DOM elements ---
            this.speedIndicator.addEventListener("mousedown", (e) => {
                if (e.button === 0) { // Only drag on left-click
                   runAction(e.target.dataset["action"], false, e, this.video);
                   e.stopPropagation();
                }
            }, true);

            shadow.querySelectorAll("button").forEach((button) => {
                button.addEventListener("click", (e) => {
                    const action = e.target.dataset["action"];
                    // Pass the specific video element this controller belongs to
                    runAction(action, getKeyBindings(action), e, this.video);
                    e.stopPropagation();
                }, true);
            });

            controllerElement.addEventListener("click", e => e.stopPropagation(), false);
            controllerElement.addEventListener("mousedown", e => e.stopPropagation(), false);
            // --- End Event Listeners ---

            var fragment = document.createDocumentFragment();
            fragment.appendChild(wrapper);

            // Simplified insertion: Use document.body or a high-level container.
            // The fixed positioning makes the exact parent less critical, but stacking context might matter.
            // Appending to body is usually safest for fixed elements.
             if (document.body) {
                document.body.appendChild(fragment);
             } else {
                // Fallback if body isn't ready? Unlikely with @run-at document-idle
                document.documentElement.appendChild(fragment);
             }


            return wrapper; // Return the outer wrapper
        };
    } // end defineVideoController

    function escapeStringRegExp(str) {
        const matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
        return str.replace(matchOperatorsRe, "\\$&");
    }

    function isBlacklisted() {
        let blacklisted = false;
        const lines = tc.settings.blacklist?.split("\n") || [];
        const currentHref = location.href;

        lines.forEach((match) => {
            match = match.replace(regStrip, "");
            if (match.length === 0) return;

            try {
                let regexp;
                if (match.startsWith("/") && match.endsWith("/")) {
                    // Basic regex detection (might need improvement for flags)
                    regexp = new RegExp(match.slice(1, -1));
                } else {
                    // Treat as plain string, escape for regex
                    regexp = new RegExp(escapeStringRegExp(match));
                }

                if (regexp.test(currentHref)) {
                    blacklisted = true;
                    log(`Current URL ${currentHref} matches blacklist pattern: ${match}`, 4);
                }
            } catch (err) {
                 log(`Invalid blacklist pattern: ${match}. Error: ${err}`, 2);
            }
        });
        return blacklisted;
    }

    function refreshCoolDown() {
        // log("Begin refreshCoolDown", 6); // Usually too verbose
        if (tc.coolDown) { clearTimeout(tc.coolDown); }
        tc.coolDown = setTimeout(() => { tc.coolDown = false; }, 50); // Shorter cooldown? 1000ms seems long.
        // log("End refreshCoolDown", 6);
    }

    function setupListeners() {
         // --- ratechange listener ---
        document.addEventListener("ratechange", (event) => {
            const video = event.target;
            // Ignore if no controller attached OR if cooldown active
            if (!video.vsc || tc.coolDown) {
                if (tc.coolDown) log("Rate change event blocked by cooldown", 6);
                return;
            }

            const currentRate = Number(video.playbackRate.toFixed(2));
            const lastTrackedSpeed = tc.settings.lastSpeed;
            const origin = event.detail?.origin; // Check for our custom event origin

            log(`Rate change detected. New rate: ${currentRate}, Origin: ${origin || 'browser/site'}, Forced: ${tc.settings.forceLastSavedSpeed}`, 5);

            if (tc.settings.forceLastSavedSpeed) {
                if (origin === "videoSpeedController") {
                    // Event originated from us, update everything
                    updateSpeedFromEvent(video, currentRate);
                } else {
                    // Event originated elsewhere, force speed back
                    log(`Force mode: Rate changed externally to ${currentRate}, reverting to ${lastTrackedSpeed}`, 4);
                    // Re-apply speed *without* triggering cooldown/loop
                    video.playbackRate = lastTrackedSpeed;
                    // No updateSpeedFromEvent here, as we want the UI to reflect the forced speed
                    event.stopImmediatePropagation(); // Prevent further listeners
                }
            } else {
                 // Not forcing speed, just update based on the event
                 if (video.vsc.speedIndicator && Number(video.vsc.speedIndicator.textContent) !== currentRate) {
                     updateSpeedFromEvent(video, currentRate);
                 } else if (!video.vsc.speedIndicator) {
                     log("Rate change on video without speed indicator?", 3);
                 }
            }
        }, true); // Use capture phase

        // --- keydown listener ---
        document.addEventListener("keydown", (event) => {
            const keyCode = event.keyCode;
            log("Keydown event: " + keyCode, 6);

            // Ignore if modifier keys are pressed (Alt, Ctrl, Meta, etc.)
            if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) { // Added Shift check - often used by sites
                 // Allow Shift+Key combos if needed? Maybe check specific bindings later.
                 // log("Keydown ignored due to modifier key.", 6);
                 return;
             }

            // Ignore if typing in input fields/contentEditable
            const target = event.target;
            if (target.nodeName === "INPUT" || target.nodeName === "TEXTAREA" || target.isContentEditable) {
                 log("Keydown ignored in input field.", 6);
                 return;
             }

            // Ignore if no media elements are being controlled on the page
            if (!tc.mediaElements.length) {
                 // log("Keydown ignored, no controlled media elements.", 6);
                 return;
             }

             // Find matching key binding
             const binding = tc.settings.keyBindings.find(item => item.key === keyCode);
             if (binding) {
                 log(`Matched key binding: Action=${binding.action}, Value=${binding.value}, Force=${binding.force}`, 5);
                 // Run action on ALL controlled media elements by default
                 runAction(binding.action, binding.value, event);

                 if (binding.force) {
                     log("Forcing keybind, stopping propagation.", 5);
                     event.preventDefault();
                     event.stopPropagation();
                 }
             }
        }, true); // Use capture phase
    } // end setupListeners

     function updateSpeedFromEvent(video, newSpeed) {
        if (!video.vsc) return; // Should not happen if called correctly

        newSpeed = Number(newSpeed.toFixed(2)); // Ensure 2 decimal places
        const speedIndicator = video.vsc.speedIndicator;
        const src = video.currentSrc;

        log(`Updating speed indicator to ${newSpeed}`, 5);
        if (speedIndicator) {
            speedIndicator.textContent = newSpeed.toFixed(2);
        }

        tc.settings.lastSpeed = newSpeed; // Update global last speed

        if (tc.settings.rememberSpeed && src) {
            log(`Storing speed ${newSpeed} for src: ${src}`, 5);
            tc.settings.speeds[src] = newSpeed; // Update speed for this specific source
        }

        // Persist global lastSpeed (throttled saving might be better)
        saveSettings(); // Consider debouncing this for performance

        // Blink controller momentarily
        runAction("blink", 1000, null, video); // Blink only the specific video's controller
    }

    function initializeWhenReady(doc) {
        log("initializeWhenReady called", 5);
         // Blacklist check moved here - crucial first step
         if (isBlacklisted()) {
             log("Page is blacklisted. Aborting initialization.", 4);
             return;
         }
         // Enabled check
         if (!tc.settings.enabled) {
             log("Extension is disabled. Aborting initialization.", 4);
             return;
         }

        // Wait for document readiness
        if (doc.readyState === "complete" || doc.readyState === "interactive") {
            log("Document ready, initializing now.", 5);
            initializeNow(doc);
        } else {
            log("Document not ready, adding readystatechange listener.", 5);
            doc.addEventListener('readystatechange', () => {
                if (doc.readyState === "complete") {
                    log("Document reached complete state, initializing now.", 5);
                    initializeNow(doc);
                }
            }, { once: true }); // Use once option
        }
    }

    function inIframe() {
        try { return window.self !== window.top; } catch (e) { return true; } // Assume iframe if top access fails
    }

    // Helper to find elements including shadow DOM (basic version)
    function querySelectorAllIncludingShadows(selector, root = document.body) {
        const results = Array.from(root.querySelectorAll(selector));
        const elementsWithShadow = root.querySelectorAll('*');
        elementsWithShadow.forEach(el => {
            if (el.shadowRoot) {
                results.push(...querySelectorAllIncludingShadows(selector, el.shadowRoot));
            }
        });
        return results;
    }


    var initialized = false; // Prevent multiple initializations

    function initializeNow(doc) {
        log("initializeNow Begin", 5);
        if (initialized || !doc.body || doc.body.classList.contains("vsc-initialized")) {
            log(`Initialization skipped: ${initialized ? 'already run' : !doc.body ? 'no body' : 'body flag set'}`, 5);
            return;
        }
        initialized = true; // Set flag early
        doc.body.classList.add("vsc-initialized"); // Mark as initialized

        try {
            // Define the controller constructor if it hasn't been defined yet
            // This usually happens only once for the top-level document
            if (!tc.videoController) {
                defineVideoController();
                setupListeners(); // Setup global listeners once
            }
        } catch(e) {
            log("Error defining controller or setting up listeners: " + e, 2);
            return; // Critical error, stop initialization
        }


        // --- Find and attach controllers to existing media ---
        const mediaSelector = tc.settings.audioBoolean ? 'video, audio' : 'video';
        // Use a function that can potentially pierce shadow DOM if necessary
        // const mediaTags = querySelectorAllIncludingShadows(mediaSelector, doc); // More robust but slower
        const mediaTags = doc.querySelectorAll(mediaSelector); // Standard way

        log(`Found ${mediaTags.length} initial media elements matching selector "${mediaSelector}"`, 4);
        mediaTags.forEach(media => {
            if (!media.vsc) { // Check if controller not already attached
                try {
                     media.vsc = new tc.videoController(media, media.parentElement);
                 } catch (e) {
                     log(`Error creating controller for media element: ${e}`, 2);
                 }
            }
        });

        // --- Setup MutationObserver to detect dynamically added media ---
        const observer = new MutationObserver((mutations) => {
            // Debounce or throttle observer callback if performance is an issue
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) { // Check if it's an element
                        findAndAddControllers(node, mutation.target);
                    }
                });
                mutation.removedNodes.forEach((node) => {
                     if (node.nodeType === Node.ELEMENT_NODE) {
                         findAndRemoveControllers(node);
                     }
                 });
                 // Handling attribute changes (like aria-hidden) is complex, omitted for simplicity here
                 // but could be added back if needed for specific sites like the original code did.
            });
        });

        observer.observe(doc.body || doc.documentElement, { childList: true, subtree: true });
        log("MutationObserver initialized to watch for new media elements.", 4);

        // --- Handle IFrames ---
        // Recurse into iframes only if not already in an iframe (or handle permissions)
         if (!inIframe()) { // Only the top level window should scan for iframes
             const frameTags = doc.getElementsByTagName("iframe");
             log(`Scanning ${frameTags.length} iframes.`, 5);
             Array.from(frameTags).forEach((frame) => {
                 try {
                     const childDocument = frame.contentDocument;
                     if (childDocument) {
                         // Pass the settings down? Or assume iframe runs its own instance?
                         // Running own instance is simpler for Userscripts.
                         // However, need to be careful not to double-initialize if script runs in iframe too.
                         log(`Attempting to initialize in iframe: ${frame.src || '(no src)'}`, 5);
                         initializeWhenReady(childDocument); // Recurse
                     }
                 } catch (e) {
                     // Log cross-origin iframe access error only once or at lower level
                     // log(`Cannot access contentDocument of iframe: ${frame.src || '(no src)'}. Error: ${e}`, 6);
                 }
             });
         }

        log("initializeNow End", 5);
    } // end initializeNow


    // Helper function for MutationObserver to find media in added nodes
    function findAndAddControllers(node, parent) {
        const mediaSelector = tc.settings.audioBoolean ? 'video, audio' : 'video';
        if (node.matches && node.matches(mediaSelector)) {
            if (!node.vsc) {
                 log(`Dynamically added media found: ${node.tagName}`, 5);
                 try {
                    node.vsc = new tc.videoController(node, parent);
                 } catch (e) {
                     log(`Error creating controller for dynamic media: ${e}`, 2);
                 }
             }
        } else if (node.querySelectorAll) { // Check descendants
            node.querySelectorAll(mediaSelector).forEach(media => {
                if (!media.vsc) {
                    log(`Dynamically added media found (descendant): ${media.tagName}`, 5);
                    try {
                       media.vsc = new tc.videoController(media, media.parentElement);
                    } catch (e) {
                       log(`Error creating controller for dynamic descendant media: ${e}`, 2);
                    }
                 }
            });
        }
    }

     // Helper function for MutationObserver to clean up controllers from removed nodes
    function findAndRemoveControllers(node) {
        const mediaSelector = tc.settings.audioBoolean ? 'video, audio' : 'video';
         if (node.matches && node.matches(mediaSelector)) {
             if (node.vsc) {
                 log(`Media element removed, cleaning up controller: ${node.tagName}`, 5);
                 node.vsc.remove();
             }
         } else if (node.querySelectorAll) { // Check descendants
             node.querySelectorAll(mediaSelector).forEach(media => {
                 if (media.vsc) {
                     log(`Descendant media element removed, cleaning up controller: ${media.tagName}`, 5);
                     media.vsc.remove();
                 }
             });
         }
    }

    function setSpeed(video, speed) {
        log(`setSpeed called: ${speed}`, 5);
        const speedValue = Number(speed.toFixed(2));
        if (isNaN(speedValue)) {
            log(`Invalid speed value: ${speed}`, 2);
            return;
        }

        // Use a custom event to signal the change *originated* from the controller
        // This helps the ratechange listener distinguish our changes from external ones when forceLastSavedSpeed is on.
         const eventDetail = { detail: { origin: "videoSpeedController", speed: speedValue } };
         const rateChangeEvent = new CustomEvent("ratechange", eventDetail);

        log(`Dispatching ratechange event with origin. Speed: ${speedValue}`, 6);
        video.dispatchEvent(rateChangeEvent); // Dispatch *before* setting rate if !forceLastSavedSpeed? Order matters.

        // Actually set the playback rate
        // Check if the rate is already correct to avoid unnecessary changes/event loops
        if (video.playbackRate !== speedValue) {
           video.playbackRate = speedValue;
           log(`Set video.playbackRate to: ${speedValue}`, 5);
           refreshCoolDown(); // Apply cooldown *after* setting rate
        } else {
            log(`Video.playbackRate already ${speedValue}, no change needed.`, 6);
        }

        // Update UI indicator (redundant if ratechange handler works, but safe fallback)
        if (video.vsc && video.vsc.speedIndicator) {
            video.vsc.speedIndicator.textContent = speedValue.toFixed(2);
        }
        // Update global/local speed tracking (also done in ratechange, maybe debounce?)
        tc.settings.lastSpeed = speedValue;
        if (tc.settings.rememberSpeed && video.currentSrc) {
            tc.settings.speeds[video.currentSrc] = speedValue;
        }

        // saveSettings(); // Avoid saving on every single speed change - do it in ratechange or debounced.
        log(`setSpeed finished for: ${speedValue}`, 5);
    }

    function runAction(action, value, event, specificVideo = null) {
        // log(`runAction Begin: Action=${action}, Value=${value}`, 5);

        // Determine target elements: either a specific video or all controlled elements
        const targetMedia = specificVideo ? [specificVideo] : tc.mediaElements;
        if (!targetMedia || targetMedia.length === 0) {
             log("runAction: No target media elements found.", 3);
             return;
        }

        targetMedia.forEach((v) => {
             if (!v || !v.vsc || !v.vsc.div) {
                 log(`runAction: Skipping element without valid controller. ${v ? v.tagName : 'null'}`, 6);
                 return; // Skip if controller isn't properly initialized
             }
            const controllerDiv = v.vsc.div; // The outer wrapper div

            // Show controller temporarily on most actions (except drag/blink itself)
            if (action !== 'drag' && action !== 'blink' && action !== 'display') {
                 showControllerTemporarily(controllerDiv);
            }

            // Skip action if the video source is invalid (e.g., element removed but not cleaned up yet)
            if (controllerDiv.classList.contains("vsc-nosource")) {
                 log("runAction: Skipping action on element with no source.", 6);
                 return;
            }

            try {
                switch (action) {
                    case "rewind":
                        log(`Rewind by ${value}s`, 5);
                        v.currentTime = Math.max(0, v.currentTime - value);
                        break;
                    case "advance":
                        log(`Advance by ${value}s`, 5);
                        v.currentTime = Math.min(v.duration || Infinity, v.currentTime + value);
                        break;
                    case "faster":
                        log(`Increase speed by ${value}`, 5);
                        const nextFasterSpeed = Math.min((v.playbackRate < 0.1 ? 0.0 : v.playbackRate) + value, 16);
                        setSpeed(v, nextFasterSpeed);
                        break;
                    case "slower":
                        log(`Decrease speed by ${value}`, 5);
                         const nextSlowerSpeed = Math.max(v.playbackRate - value, 0.07); // Chrome min is ~0.0625
                        setSpeed(v, nextSlowerSpeed);
                        break;
                    case "reset": // Special toggle logic
                        log("Reset/Toggle speed", 5);
                        resetSpeed(v); // Uses internal logic based on current/fast/1.0 speeds
                        break;
                    case "fast": // Set to preferred fast speed directly
                        log(`Set preferred speed to ${value}`, 5);
                        setSpeed(v, value);
                        break;
                    case "display":
                        log("Toggle controller display", 5);
                        controllerDiv.classList.toggle("vsc-hidden");
                        controllerDiv.classList.toggle("vsc-manual", controllerDiv.classList.contains("vsc-hidden")); // Mark manual hide/show
                        break;
                    case "blink":
                        log("Blink controller", 5);
                        blinkController(controllerDiv, value || 1000);
                        break;
                    case "drag":
                        if (event) handleDrag(v, event);
                        break;
                    case "pause":
                        log(v.paused ? "Play" : "Pause", 5);
                        if (v.paused) v.play(); else v.pause();
                        break;
                    case "muted":
                        log(v.muted ? "Unmute" : "Mute", 5);
                        v.muted = !v.muted;
                        break;
                    case "mark":
                        log(`Set marker at ${v.currentTime.toFixed(1)}s`, 5);
                        v.vsc.mark = v.currentTime;
                        break;
                    case "jump":
                        if (v.vsc.mark && typeof v.vsc.mark === "number") {
                            log(`Jump to marker at ${v.vsc.mark.toFixed(1)}s`, 5);
                            v.currentTime = v.vsc.mark;
                        } else {
                            log("Jump action failed: No marker set", 3);
                        }
                        break;
                    default:
                         log(`Unknown action: ${action}`, 3);
                }
            } catch (e) {
                 log(`Error executing action "${action}" on video: ${e}`, 2);
            }
        }); // end forEach media element

        // log("runAction End", 5);
    } // end runAction

     function resetSpeed(v) {
        const currentSpeed = v.playbackRate;
        const fastSpeed = getKeyBindings("fast", "value") || tcDefaults.keyBindings.find(b=>b.action==='fast').value; // Ensure fallback
        const resetSpeedTarget = 1.0; // Standard reset is always 1.0

        if (currentSpeed === resetSpeedTarget) {
            // If currently at 1.0, toggle to 'fast' speed
            log(`Toggling speed from ${resetSpeedTarget} to fast speed ${fastSpeed}`, 4);
            setSpeed(v, fastSpeed);
        } else {
            // Otherwise, reset to 1.0
            log(`Resetting speed from ${currentSpeed} to ${resetSpeedTarget}`, 4);
            setSpeed(v, resetSpeedTarget);
        }
    }

    function handleDrag(video, e) {
        const controller = video.vsc.div; // The outer wrapper
        const shadowController = controller.shadowRoot.querySelector("#controller"); // The element inside shadow DOM
        if (!controller || !shadowController) return;

        controller.classList.add("vcs-dragging"); // Use a class on the *outer* element for potential global styles
        shadowController.classList.add("dragging"); // Class within shadow DOM for styling/cursor

        const initialMouseX = e.clientX;
        const initialMouseY = e.clientY;
        // Get initial position relative to viewport
        const rect = shadowController.getBoundingClientRect();
        const initialControllerX = rect.left;
        const initialControllerY = rect.top;

        const startDragging = (moveEvent) => {
            let dx = moveEvent.clientX - initialMouseX;
            let dy = moveEvent.clientY - initialMouseY;
            // Calculate new top-left based on viewport coordinates
            let newX = initialControllerX + dx;
            let newY = initialControllerY + dy;

            // Basic boundary checks (optional)
             newX = Math.max(0, Math.min(newX, window.innerWidth - shadowController.offsetWidth));
             newY = Math.max(0, Math.min(newY, window.innerHeight - shadowController.offsetHeight));

            shadowController.style.left = newX + "px";
            shadowController.style.top = newY + "px";
            shadowController.style.right = 'auto'; // Ensure right/bottom aren't interfering
            shadowController.style.bottom = 'auto';
        };

        const stopDragging = () => {
            document.removeEventListener("mousemove", startDragging);
            document.removeEventListener("mouseup", stopDragging);
            document.removeEventListener("mouseleave", stopDragging); // In case mouse leaves window

            controller.classList.remove("vcs-dragging");
            shadowController.classList.remove("dragging");
            log(`Drag ended. Final position: left=${shadowController.style.left}, top=${shadowController.style.top}`, 5);
             // TODO: Persist the position? This would require adding properties to settings and saving/loading them.
             // For simplicity, position is not saved in this version.
        };

        // Add listeners to the document to capture mouse movements anywhere
        document.addEventListener("mousemove", startDragging);
        document.addEventListener("mouseup", stopDragging);
        document.addEventListener("mouseleave", stopDragging); // Handle mouse leaving the window
    }

    var controllerTimers = new Map(); // Use a Map to track timers per controller

    function showControllerTemporarily(controllerDiv, duration = 2000) {
        if (!controllerDiv) return;
        // log("Showing controller temporarily", 6);
        controllerDiv.classList.add("vcs-show"); // Maybe use opacity transition instead of a class?

        const existingTimer = controllerTimers.get(controllerDiv);
        if (existingTimer) clearTimeout(existingTimer);

        const timer = setTimeout(() => {
            controllerDiv.classList.remove("vcs-show");
            controllerTimers.delete(controllerDiv);
            // log("Hiding controller after timeout", 6);
        }, duration);
        controllerTimers.set(controllerDiv, timer);
    }

    function blinkController(controllerDiv, duration = 1000) {
         if (!controllerDiv) return;
         const wasHidden = controllerDiv.classList.contains("vsc-hidden");
         const existingTimer = controllerTimers.get(controllerDiv); // Use the same map as showControllerTemporarily

         if (existingTimer) clearTimeout(existingTimer);

         controllerDiv.classList.remove("vsc-hidden"); // Ensure it's visible

         const timer = setTimeout(() => {
             // Only re-hide if it was originally hidden and not manually shown
             if (wasHidden && !controllerDiv.classList.contains("vsc-manual")) {
                 controllerDiv.classList.add("vsc-hidden");
             }
             controllerTimers.delete(controllerDiv);
         }, duration);
         controllerTimers.set(controllerDiv, timer);
    }

     // --- Settings Dialog ---

     function showSettingsDialog() {
        let dialog = document.getElementById('vscSettingsDialog');
        if (dialog) {
            dialog.style.display = 'block'; // Show if already exists
            return;
        }

        GM_addStyle(settingsDialogCSS); // Inject CSS if not already done

        dialog = document.createElement('div');
        dialog.id = 'vscSettingsDialog';

        let contentHTML = `
            <h3>Video Speed Controller Settings</h3>
            <div id="vscSettingsContent">
                <h4>General</h4>
                <div class="vsc-settings-row">
                    <label for="vscEnabled">Enable Extension:</label>
                    <input type="checkbox" id="vscEnabled">
                </div>
                <div class="vsc-settings-row">
                    <label for="vscRememberSpeed">Remember Playback Speed:</label>
                    <input type="checkbox" id="vscRememberSpeed">
                </div>
                 <div class="vsc-settings-row">
                    <label for="vscForceLastSavedSpeed">Force Last Saved Speed:<br><i>Overrides website speed changes</i></label>
                    <input type="checkbox" id="vscForceLastSavedSpeed">
                </div>
                 <div class="vsc-settings-row">
                    <label for="vscAudioBoolean">Enable on Audio Elements:</label>
                    <input type="checkbox" id="vscAudioBoolean">
                </div>
                <div class="vsc-settings-row">
                    <label for="vscStartHidden">Hide Controller By Default:</label>
                    <input type="checkbox" id="vscStartHidden">
                </div>
                <div class="vsc-settings-row">
                    <label for="vscControllerOpacity">Controller Opacity (0.0-1.0):</label>
                    <input type="number" id="vscControllerOpacity" step="0.1" min="0" max="1">
                </div>

                <h4>Shortcuts</h4>
                <div id="vscKeyBindingsContainer">
                    <!-- Keybindings will be added here -->
                </div>
                <button id="vscAddBindingBtn">+ Add Shortcut</button>

                 <h4>Blacklist</h4>
                 <div class="vsc-settings-row">
                    <label for="vscBlacklist">Disabled Sites (one per line):<br><i>Plain text or /regex/</i></label>
                    <textarea id="vscBlacklist" rows="6"></textarea>
                 </div>

                 <h4>Debugging</h4>
                 <div class="vsc-settings-row">
                     <label for="vscLogLevel">Log Level:</label>
                     <select id="vscLogLevel">
                         <option value="1">1: None</option>
                         <option value="2">2: Errors</option>
                         <option value="3">3: Warnings</option>
                         <option value="4">4: Info</option>
                         <option value="5">5: Debug</option>
                         <option value="6">6: Verbose Debug</option>
                     </select>
                 </div>

            </div>
            <div id="vscStatus" style="min-height: 1em;"></div>
            <div class="vsc-settings-actions">
                <button id="vscSaveBtn" class="vsc-save">Save and Close</button>
                <button id="vscRestoreBtn" class="vsc-restore">Restore Defaults</button>
                <button id="vscCloseBtn" class="vsc-close">Close</button>
            </div>
        `;

        dialog.innerHTML = contentHTML;
        document.body.appendChild(dialog);

        // Populate dialog with current settings
        populateSettingsDialog();

        // Add event listeners for dialog elements
        dialog.querySelector('#vscSaveBtn').addEventListener('click', saveSettingsFromDialog);
        dialog.querySelector('#vscRestoreBtn').addEventListener('click', restoreDefaultSettingsInDialog);
        dialog.querySelector('#vscCloseBtn').addEventListener('click', () => dialog.remove());
        dialog.querySelector('#vscAddBindingBtn').addEventListener('click', addKeyBindingRow);

         // Event delegation for dynamic elements (key inputs, remove buttons)
         const bindingsContainer = dialog.querySelector('#vscKeyBindingsContainer');
         bindingsContainer.addEventListener('keydown', e => { if (e.target.classList.contains('vsc-binding-key')) recordKeyPress(e); });
         bindingsContainer.addEventListener('focus', e => { if (e.target.classList.contains('vsc-binding-key')) inputFocus(e); }, true);
         bindingsContainer.addEventListener('blur', e => { if (e.target.classList.contains('vsc-binding-key')) inputBlur(e); }, true);
         bindingsContainer.addEventListener('keypress', e => { if (e.target.classList.contains('vsc-binding-value')) inputFilterNumbersOnly(e); });
         bindingsContainer.addEventListener('click', e => { if (e.target.classList.contains('vsc-remove-binding')) removeKeyBindingRow(e.target); });
         bindingsContainer.addEventListener('change', e => { if (e.target.classList.contains('vsc-binding-action')) toggleValueInputDisabled(e.target); });
    }

     function populateSettingsDialog() {
        const dialog = document.getElementById('vscSettingsDialog');
        if (!dialog) return;

        dialog.querySelector('#vscEnabled').checked = tc.settings.enabled;
        dialog.querySelector('#vscRememberSpeed').checked = tc.settings.rememberSpeed;
        dialog.querySelector('#vscForceLastSavedSpeed').checked = tc.settings.forceLastSavedSpeed;
        dialog.querySelector('#vscAudioBoolean').checked = tc.settings.audioBoolean;
        dialog.querySelector('#vscStartHidden').checked = tc.settings.startHidden;
        dialog.querySelector('#vscControllerOpacity').value = tc.settings.controllerOpacity;
        dialog.querySelector('#vscBlacklist').value = tc.settings.blacklist;
        dialog.querySelector('#vscLogLevel').value = tc.settings.logLevel;

        // Populate keybindings
        const bindingsContainer = dialog.querySelector('#vscKeyBindingsContainer');
        bindingsContainer.innerHTML = ''; // Clear previous bindings
        tc.settings.keyBindings.forEach(binding => addKeyBindingRow(binding));
    }

     function addKeyBindingRow(binding = null) {
         const dialog = document.getElementById('vscSettingsDialog');
         if (!dialog) return;
         const container = dialog.querySelector('#vscKeyBindingsContainer');

         const row = document.createElement('div');
         row.className = 'vsc-keybinding-row';
         if (binding?.predefined) {
            row.dataset.predefined = true; // Mark predefined for potential styling/logic
         }

         const actionOptions = `
            <option value="display" ${binding?.action === 'display' ? 'selected' : ''}>Show/hide controller</option>
            <option value="slower" ${binding?.action === 'slower' ? 'selected' : ''}>Decrease speed</option>
            <option value="faster" ${binding?.action === 'faster' ? 'selected' : ''}>Increase speed</option>
            <option value="rewind" ${binding?.action === 'rewind' ? 'selected' : ''}>Rewind</option>
            <option value="advance" ${binding?.action === 'advance' ? 'selected' : ''}>Advance</option>
            <option value="reset" ${binding?.action === 'reset' ? 'selected' : ''}>Reset/Toggle speed</option>
            <option value="fast" ${binding?.action === 'fast' ? 'selected' : ''}>Preferred speed</option>
            <option value="muted" ${binding?.action === 'muted' ? 'selected' : ''}>Mute/Unmute</option>
            <option value="pause" ${binding?.action === 'pause' ? 'selected' : ''}>Play/Pause</option>
            <option value="mark" ${binding?.action === 'mark' ? 'selected' : ''}>Set marker</option>
            <option value="jump" ${binding?.action === 'jump' ? 'selected' : ''}>Jump to marker</option>
         `;
         const forceOptions = `
            <option value="false" ${binding?.force?.toString() === 'false' ? 'selected': ''}>Allow website keybind</option>
            <option value="true" ${binding?.force?.toString() === 'true' ? 'selected': ''}>Disable website keybind</option>
         `;

         const keyText = binding?.key ? (keyCodeAliases[binding.key] || String.fromCharCode(binding.key)) : '';
         const isValueDisabled = binding ? customActionsNoValues.includes(binding.action) : false;

         row.innerHTML = `
             <select class="vsc-binding-action" ${binding?.predefined ? 'disabled' : ''}>${actionOptions}</select>
             <input class="vsc-binding-key" type="text" value="${keyText}" placeholder="press a key">
             <input class="vsc-binding-value" type="number" step="0.1" value="${binding?.value || 0}" placeholder="value" ${isValueDisabled ? 'disabled' : ''}>
             <select class="vsc-binding-force">${forceOptions}</select>
             <button class="vsc-remove-binding" ${binding?.predefined ? 'disabled style="visibility:hidden;"' : ''} title="Remove shortcut">X</button>
         `;

         // Store the actual keycode on the input element
         const keyInput = row.querySelector('.vsc-binding-key');
         if (binding?.key) keyInput.keyCode = binding.key;

         container.appendChild(row);
     }

      function removeKeyBindingRow(button) {
         button.closest('.vsc-keybinding-row').remove();
     }

     function toggleValueInputDisabled(selectElement) {
         const valueInput = selectElement.closest('.vsc-keybinding-row').querySelector('.vsc-binding-value');
         const action = selectElement.value;
         if (customActionsNoValues.includes(action)) {
             valueInput.disabled = true;
             valueInput.value = 0; // Reset value for actions that don't use it
         } else {
             valueInput.disabled = false;
             // Optionally set a default value based on action?
             // if (action === 'slower' || action === 'faster') valueInput.value = 0.1;
             // if (action === 'rewind' || action === 'advance') valueInput.value = 10;
             // if (action === 'fast') valueInput.value = 1.8;
         }
     }

     function validateSettingsDialog() {
         // Basic validation (e.g., check regex in blacklist)
         const dialog = document.getElementById('vscSettingsDialog');
         const blacklistText = dialog.querySelector('#vscBlacklist').value;
         const status = dialog.querySelector('#vscStatus');
         let isValid = true;

         blacklistText.split('\n').forEach(match => {
            match = match.replace(regStrip, "");
            if (match.startsWith('/') && match.endsWith('/')) {
                try { new RegExp(match.slice(1, -1)); }
                catch (err) {
                    status.textContent = `Error: Invalid blacklist regex: ${match}`;
                    status.style.color = 'red';
                    isValid = false;
                }
            }
         });
         // Validate opacity
         const opacity = Number(dialog.querySelector('#vscControllerOpacity').value);
         if (isNaN(opacity) || opacity < 0 || opacity > 1) {
             status.textContent = `Error: Opacity must be between 0.0 and 1.0`;
             status.style.color = 'red';
             isValid = false;
         }

         // Validate Keybindings (ensure key is set, etc.)
         dialog.querySelectorAll('.vsc-keybinding-row').forEach((row, index) => {
            const keyInput = row.querySelector('.vsc-binding-key');
            if (!keyInput.keyCode && keyInput.value !== 'null') {
                 status.textContent = `Error: Key not set for shortcut #${index + 1}`;
                 status.style.color = 'red';
                 isValid = false;
            }
            // Check for duplicate keys?
         });


         if (isValid) {
            status.textContent = ''; // Clear error
            return true;
         }
         return false;
     }


     async function saveSettingsFromDialog() {
        const dialog = document.getElementById('vscSettingsDialog');
        if (!dialog || !validateSettingsDialog()) return;

        const status = dialog.querySelector('#vscStatus');
        status.textContent = "Saving...";
        status.style.color = 'orange';

        // Read values from dialog
        tc.settings.enabled = dialog.querySelector('#vscEnabled').checked;
        tc.settings.rememberSpeed = dialog.querySelector('#vscRememberSpeed').checked;
        tc.settings.forceLastSavedSpeed = dialog.querySelector('#vscForceLastSavedSpeed').checked;
        tc.settings.audioBoolean = dialog.querySelector('#vscAudioBoolean').checked;
        tc.settings.startHidden = dialog.querySelector('#vscStartHidden').checked;
        tc.settings.controllerOpacity = Number(dialog.querySelector('#vscControllerOpacity').value);
        tc.settings.blacklist = dialog.querySelector('#vscBlacklist').value;
        tc.settings.logLevel = Number(dialog.querySelector('#vscLogLevel').value);

        // Read keybindings
        const newBindings = [];
        dialog.querySelectorAll('.vsc-keybinding-row').forEach(row => {
            const keyInput = row.querySelector('.vsc-binding-key');
            newBindings.push({
                action: row.querySelector('.vsc-binding-action').value,
                key: keyInput.keyCode || null, // Get stored keyCode
                value: Number(row.querySelector('.vsc-binding-value').value) || 0,
                force: row.querySelector('.vsc-binding-force').value, // Store as string 'true'/'false'
                predefined: row.dataset.predefined === 'true'
            });
        });
        tc.settings.keyBindings = newBindings;

        try {
            await saveSettings(); // Use the async save function
            status.textContent = "Settings Saved! Reload page to apply some changes (e.g., blacklist, audio).";
            status.style.color = 'green';
            setTimeout(() => {
                dialog.remove(); // Close dialog after successful save
                // Dynamically update running script? (e.g., attach/detach controllers if enabled changed)
                // For simplicity, we often require a reload for major changes.
                 location.reload(); // Force reload to ensure all settings apply cleanly
            }, 1500);
        } catch (e) {
             status.textContent = "Error saving settings: " + e;
             status.style.color = 'red';
        }
    }

     async function restoreDefaultSettingsInDialog() {
        if (!confirm("Are you sure you want to restore default settings? All customizations will be lost.")) {
            return;
        }
        const dialog = document.getElementById('vscSettingsDialog');
        const status = dialog.querySelector('#vscStatus');
        status.textContent = "Restoring defaults...";
        status.style.color = 'orange';

        // Reset tc.settings to defaults
        tc.settings = JSON.parse(JSON.stringify(tcDefaults)); // Deep copy defaults

        // Repopulate the dialog with the new default settings
        populateSettingsDialog();

        status.textContent = "Defaults restored. Click Save to keep them.";
        status.style.color = 'blue';
    }

     function toggleScriptEnabled(enable) {
        log(`Setting script enabled status to: ${enable}`, 4);
        tc.settings.enabled = enable;
        saveSettings().then(() => {
            alert(`Video Speed Controller ${enable ? 'Enabled' : 'Disabled'}. Please reload the page for the change to take full effect.`);
            location.reload(); // Force reload
        });
    }


    // --- Main Execution ---

    async function main() {
        await loadSettings();

        // Register GM Menu Commands
        GM_registerMenuCommand("VSC Settings", showSettingsDialog);
        if (tc.settings.enabled) {
             GM_registerMenuCommand("Disable VSC (Reload Required)", () => toggleScriptEnabled(false));
        } else {
             GM_registerMenuCommand("Enable VSC (Reload Required)", () => toggleScriptEnabled(true));
        }
        // Add more commands? e.g. quick toggle remember speed?

        // Start initialization process if enabled and not blacklisted
        initializeWhenReady(document);
    }

    // --- Run Main ---
    main().catch(e => {
        log("Critical error during script initialization: " + e, 2);
        console.error("VSC Userscript Error:", e);
    });

})(); // End IIFE