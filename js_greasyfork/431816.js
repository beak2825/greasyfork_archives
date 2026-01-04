// ==UserScript==
// @name         Steam Infinite Wishlister
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Advanced Steam Discovery Queue wishlisting: Trading Card/DLC/Owned options, Age Skip, Pause/Resume, Counters, Robustness++
// @icon         https://store.steampowered.com/favicon.ico
// @author       bernardopg
// @match        *://store.steampowered.com/app/*
// @match        *://store.steampowered.com/explore*
// @match        *://store.steampowered.com/explore/
// @match        *://store.steampowered.com/curator/*
// @match        *://steamcommunity.com/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/431816/Steam%20Infinite%20Wishlister.user.js
// @updateURL https://update.greasyfork.org/scripts/431816/Steam%20Infinite%20Wishlister.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ====================================
  // Module: Configuration
  // ====================================
  const CONFIG = {
    // Timing configuration (all values in milliseconds)
    TIMING: {
      CHECK_INTERVAL: 3500, // How often to check the current page when running the loop
      ACTION_DELAY: 1800, // Delay after performing a major action (like adding to wishlist)
      ADVANCE_DELAY: 600, // Delay before advancing to next item (1/3 of ACTION_DELAY)
      PROCESSING_RELEASE_DELAY: 900, // Delay before releasing processing lock (1/2 of ACTION_DELAY)
      QUEUE_GENERATION_DELAY: 1500, // Delay after attempting to generate a new queue
      QUEUE_LOCK_RELEASE_DELAY: 2000, // Delay before releasing queue generation lock (unused currently)
      INITIAL_START_DELAY: 1500, // Delay before starting the loop on page load
      WISHLIST_CONFIRM_TIMEOUT: 1500, // Timeout for confirming wishlist action success
      MINI_DELAY: 100, // Very small delay for minor operations
      VERSION_CHECK_INTERVAL: 86400000, // Check for updates once per day (24h)
    },

    // DOM Selectors - organized by functional area
    SELECTORS: {
      // Wishlist related selectors
      wishlist: {
        area: "#add_to_wishlist_area, .queue_wishlist_ctn", // Added queue_wishlist_ctn for explore page
        addButton:
          ".add_to_wishlist .btn_addtocart .btnv6_blue_hoverfade, .queue_wishlist_button .btnv6_blue_hoverfade", // More specific button selectors + explore page
        successIndicator: ".add_to_wishlist_area_success, .queue_btn_active", // Added queue_btn_active for explore
      },

      // Game information selectors
      gameInfo: {
        tradingCardsIndicator:
          '.game_area_details_specs a[href*="/tradingcards/"], a.trading_card_details_link[href*="/tradingcards/"]',
        title: ".apphub_AppName",
        queueRemainingText: ".queue_sub_text",
        inLibraryIndicator: ".game_area_already_owned",
        dlcIndicator: ".game_area_dlc_bubble",
        appTypeElement: ".game_details .details_block",
      },

      // Queue navigation selectors
      queueNav: {
        nextButton:
          ".btn_next_in_queue_trigger, .btn_next_in_queue .btnv6_lightblue_blue", // Added second selector for explore page
        nextForm: "#next_in_queue_form",
        ignoreButtonContainer: "#ignoreBtn", // Used mainly for the button within
        ignoreButtonInContainer: ".queue_btn_ignore",
      },

      // Queue status and management selectors
      queueStatus: {
        container: "#discovery_queue_ctn, #discovery_queue", // Added #discovery_queue for explore page
        finishedIndicator: ".discover_queue_empty", // Should be sufficient
        emptyContainer: ".discover_queue_empty",
        // Selectors for starting a queue
        startLink:
          ".discovery_queue_start_link, #discovery_queue_start_link, .discovery_queue_winter_sale_cards_header a[href*='discovery_queue'], .discovery_queue_global_header a[href*='discoveryqueue']",
        // Selectors for starting *another* queue when one finished
        startAnotherButton:
          "#refresh_queue_btn, .discover_queue_empty_refresh_btn .btnv6_lightblue_blue, .discover_queue_empty a[href*='discoveryqueue'], .begin_exploring",
      },

      // Age gate selectors
      ageGate: {
        storeContainer: "#app_agegate",
        communityTextContainer: ".agegate_text_container",
      },

      // UI selectors
      ui: {
        container: "#wishlist-looper-controls",
        statusElement: "#wl-status",
        minimizeButton: "#wl-minimize",
        processOnceButton: "#wl-process-once",
        skipButton: "#wl-skip",
        pauseButton: "#wl-pause",
        wishlistCountElement: "#wl-wishlist-count",
        requireCardsCheckbox: "#wl-require-cards",
        skipNonGamesCheckbox: "#wl-skip-non-games",
        skipOwnedCheckbox: "#wl-skip-owned",
        startButton: "#wl-start",
        stopButton: "#wl-stop",
        autoStartCheckbox: "#wl-autostart",
        autoRestartCheckbox: "#wl-autorestart",
        versionInfo: "#wl-version-info",
      },
    },

    // Storage keys
    STORAGE_KEYS: {
      AUTO_START: "wishlistLooperAutoStartV2", // Renamed to avoid conflict with old versions
      AUTO_RESTART_QUEUE: "wishlistLooperAutoRestartQueueV2",
      UI_MINIMIZED: "wishlistLooperUiMinimizedV2",
      REQUIRE_CARDS: "wishlistLooperRequireCardsV2",
      SKIP_NON_GAMES: "wishlistLooperSkipNonGamesV2",
      SKIP_OWNED: "wishlistLooperSkipOwnedV2",
      LOG_LEVEL: "wishlistLooperLogLevel", // Keep log level key generic
      SESSION_WISHLIST_COUNT: "wishlistLooperSessionCountV2",
      LAST_VERSION_CHECK: "wishlistLooperLastVersionCheck",
      // Example version check URL (replace with your actual source if hosting)
      VERSION_CHECK_URL:
        "https://raw.githubusercontent.com/bernardopg/steam-wishlist-looper/main/version.json",
    },

    // App constants
    MAX_QUEUE_RESTART_FAILURES: 5,
    CURRENT_VERSION: "2.0",
    // URL for version checking, defined in STORAGE_KEYS now for consistency
    get VERSION_CHECK_URL() {
      return GM_getValue(
        CONFIG.STORAGE_KEYS.VERSION_CHECK_URL,
        "https://raw.githubusercontent.com/bernardopg/steam-wishlist-looper/main/version.json"
      );
    },
  };

  // ====================================
  // Module: State Management
  // ====================================
  const State = {
    loop: {
      state: "Stopped", // 'Stopped', 'Running', 'Paused'
      timeoutId: null, // Holds the timeout ID for the main loop
      isProcessing: false, // Whether we're currently processing an item
      manualActionInProgress: false, // Whether a manual action is in progress
      failedQueueRestarts: 0, // Counter for failed queue restart attempts
    },

    settings: {
      autoStartEnabled: GM_getValue(CONFIG.STORAGE_KEYS.AUTO_START, false),
      autoRestartQueueEnabled: GM_getValue(
        CONFIG.STORAGE_KEYS.AUTO_RESTART_QUEUE,
        true
      ),
      uiMinimized: GM_getValue(CONFIG.STORAGE_KEYS.UI_MINIMIZED, false),
      requireTradingCards: GM_getValue(CONFIG.STORAGE_KEYS.REQUIRE_CARDS, true),
      skipNonGames: GM_getValue(CONFIG.STORAGE_KEYS.SKIP_NON_GAMES, true),
      skipOwnedGames: GM_getValue(CONFIG.STORAGE_KEYS.SKIP_OWNED, true),
      logLevel: GM_getValue(CONFIG.STORAGE_KEYS.LOG_LEVEL, 0), // 0=Info, 1=Debug, 2=Verbose
    },

    stats: {
      wishlistedThisSession: parseInt(
        sessionStorage.getItem(CONFIG.STORAGE_KEYS.SESSION_WISHLIST_COUNT) ||
          "0"
      ),
      lastVersionCheck: GM_getValue(CONFIG.STORAGE_KEYS.LAST_VERSION_CHECK, 0),
      latestVersion: null, // Stores fetched latest version
      updateUrl: null, // Stores fetched update URL
    },

    ui: {
      elements: {}, // Will hold references to UI DOM elements
    },
  };

  // ====================================
  // Module: Logging
  // ====================================
  const Logger = {
    /**
     * Log a message with a specified level
     * @param {string} message - The message to log
     * @param {number} level - The log level (0=info, 1=debug, 2=verbose)
     */
    log: function (message, level = 0) {
      if (level <= State.settings.logLevel) {
        const prefix = level === 1 ? "[DEBUG]" : level === 2 ? "[VERBOSE]" : "";
        // Avoid double prefixing if message already has it
        if (!message.startsWith("[Steam Wishlist Looper]")) {
          console.log(`[Steam Wishlist Looper]${prefix}`, message);
        } else {
          console.log(`${prefix} ${message}`); // Assume message already has script name
        }
      }
    },
  };

  // ====================================
  // Module: UI Management
  // ====================================
  const UI = {
    /**
     * Update the status text in the UI
     * @param {string} message - The status message to display
     * @param {string} statusType - The type of status (info, action, success, skipped, error, paused)
     */
    updateStatusText: function (message, statusType = "info") {
      if (!State.ui.elements.status) return;

      State.ui.elements.status.textContent = `Status: ${message}`;
      // Clear previous status classes before adding new one
      State.ui.elements.status.className =
        CONFIG.SELECTORS.ui.statusElement.substring(1); // Reset to base class

      switch (statusType) {
        case "action":
          State.ui.elements.status.classList.add("wl-status-action");
          break;
        case "success":
          State.ui.elements.status.classList.add("wl-status-success");
          break;
        case "skipped":
          State.ui.elements.status.classList.add("wl-status-skipped");
          break;
        case "error":
          State.ui.elements.status.classList.add("wl-status-error");
          break;
        case "paused":
          State.ui.elements.status.classList.add("wl-status-paused");
          break;
        case "info":
        default:
          // Keep default color (no class added)
          break;
      }

      // Reset status highlight after a delay for transient types
      if (
        statusType === "action" ||
        statusType === "success" ||
        statusType === "skipped"
      ) {
        setTimeout(() => {
          // Only remove the class if the status hasn't changed to something else critical (like error/paused)
          if (
            State.ui.elements.status &&
            State.ui.elements.status.classList.contains(
              `wl-status-${statusType}`
            )
          ) {
            State.ui.elements.status.classList.remove(
              `wl-status-${statusType}`
            );
          }
        }, 1500);
      }
    },

    /**
     * Increment the wishlist counter and update UI
     */
    incrementWishlistCounter: function () {
      State.stats.wishlistedThisSession++;
      sessionStorage.setItem(
        CONFIG.STORAGE_KEYS.SESSION_WISHLIST_COUNT,
        State.stats.wishlistedThisSession.toString()
      );

      if (State.ui.elements.wishlistCount) {
        State.ui.elements.wishlistCount.textContent =
          State.stats.wishlistedThisSession;
      }
    },

    /**
     * Toggle enabled state of manual action buttons based on current state
     */
    updateManualButtonStates: function () {
      const disableManual =
        State.loop.state === "Running" ||
        State.loop.isProcessing ||
        State.loop.manualActionInProgress;

      if (State.ui.elements.processOnce) {
        State.ui.elements.processOnce.disabled = disableManual;
      }
      if (State.ui.elements.skip) {
        State.ui.elements.skip.disabled = disableManual;
      }
    },

    /**
     * Create and add the UI controls to the page
     */
    addControls: function () {
      // Don't add controls if they already exist
      if (document.querySelector(CONFIG.SELECTORS.ui.container)) return;

      const controlDiv = document.createElement("div");
      controlDiv.id = CONFIG.SELECTORS.ui.container.substring(1);
      controlDiv.classList.toggle("wl-minimized", State.settings.uiMinimized);

      // HTML template for the controls
      controlDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; padding-bottom: 5px; border-bottom: 1px solid rgba(199, 213, 224, 0.1);">
               <strong style="color: #66c0f4; text-shadow: 1px 1px 1px #000; margin-right: auto;">Wishlist Looper</strong>
               <span title="Wishlisted this session" style="font-size: 10px; margin: 0 10px; color: #a1dd4a;">(<span id="${CONFIG.SELECTORS.ui.wishlistCountElement.substring(
                 1
               )}">${State.stats.wishlistedThisSession}</span> Added)</span>
               <button id="${CONFIG.SELECTORS.ui.minimizeButton.substring(
                 1
               )}" title="${
        State.settings.uiMinimized ? "Restore" : "Minimize"
      }" style="background: none; border: none; color: #66c0f4; font-size: 14px; cursor: pointer; padding: 0 5px; line-height: 1;">${
        State.settings.uiMinimized ? "□" : "▬"
      }</button>
            </div>
            <div class="wl-controls-body">
               <div style="margin-bottom: 5px; display: flex; align-items: center;">
                   <button id="${CONFIG.SELECTORS.ui.startButton.substring(
                     1
                   )}" title="Start/Resume automatic processing">Start</button>
                   <button id="${CONFIG.SELECTORS.ui.pauseButton.substring(
                     1
                   )}" title="Pause automatic processing" disabled>Pause</button>
                   <button id="${CONFIG.SELECTORS.ui.stopButton.substring(
                     1
                   )}" title="Stop processing and disable Auto features">Stop</button>
               </div>
               <div style="margin-bottom: 5px;">
                   <button id="${CONFIG.SELECTORS.ui.processOnceButton.substring(
                     1
                   )}" title="Process only the current item">Process Once</button>
                   <button id="${CONFIG.SELECTORS.ui.skipButton.substring(
                     1
                   )}" title="Skip the current item and advance">Skip Item</button>
               </div>
               <div id="${CONFIG.SELECTORS.ui.statusElement.substring(
                 1
               )}" class="${CONFIG.SELECTORS.ui.statusElement.substring(
        1
      )}">Status: Initializing...</div>
               <div style="margin-top: 8px; border-top: 1px solid rgba(199, 213, 224, 0.2); padding-top: 8px; font-size: 11px;">
                   <span style="display: block; margin-bottom: 4px; font-weight: bold; color: #66c0f4;">Options:</span>
                   <label title="Automatically start loop on compatible pages"><input type="checkbox" id="${CONFIG.SELECTORS.ui.autoStartCheckbox.substring(
                     1
                   )}">Auto-Start</label>
                   <label title="Automatically restart queue when finished (requires Auto-Start)" style="margin-left: 10px;"><input type="checkbox" id="${CONFIG.SELECTORS.ui.autoRestartCheckbox.substring(
                     1
                   )}">Auto-Restart</label>
                   <br>
                   <label title="Only wishlist items that have Steam Trading Cards"><input type="checkbox" id="${CONFIG.SELECTORS.ui.requireCardsCheckbox.substring(
                     1
                   )}">Require Cards</label>
                   <label title="Skip items already in your Steam library" style="margin-left: 10px;"><input type="checkbox" id="${CONFIG.SELECTORS.ui.skipOwnedCheckbox.substring(
                     1
                   )}">Skip Owned</label>
                   <br>
                   <label title="Skip items identified as DLC, Soundtracks, Demos, etc."><input type="checkbox" id="${CONFIG.SELECTORS.ui.skipNonGamesCheckbox.substring(
                     1
                   )}">Skip Non-Games</label>
               </div>
               <div id="${CONFIG.SELECTORS.ui.versionInfo.substring(
                 1
               )}" style="font-size: 9px; color: #8f98a0; margin-top: 8px; text-align: right;">v${
        CONFIG.CURRENT_VERSION
      }</div>
            </div>
        `;

      // Apply styles via GM_addStyle
      GM_addStyle(`
          #${CONFIG.SELECTORS.ui.container.substring(1)} {
            position: fixed; bottom: 10px; right: 10px; z-index: 9999;
            background: rgba(27, 40, 56, 0.9); color: #c7d5e0; padding: 10px;
            border-radius: 5px; font-family: 'Motiva Sans', sans-serif; font-size: 12px;
            border: 1px solid #000; box-shadow: 0 0 10px rgba(0,0,0,0.7);
            backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);
            transition: all 0.3s ease-in-out; width: 250px;
          }
          #${CONFIG.SELECTORS.ui.container.substring(1)}.wl-minimized {
            padding: 5px 10px; height: auto; width: auto; min-width: 150px;
          }
          #${CONFIG.SELECTORS.ui.container.substring(
            1
          )}.wl-minimized .wl-controls-body {
            display: none;
          }
          #${CONFIG.SELECTORS.ui.container.substring(1)} button {
            padding: 4px 8px; border-radius: 2px; cursor: pointer; font-size: 11px;
            margin-right: 5px; border: 1px solid; transition: filter 0.15s ease;
          }
          #${CONFIG.SELECTORS.ui.container.substring(
            1
          )} button:last-child { margin-right: 0; }
          #${CONFIG.SELECTORS.ui.container.substring(1)} button:disabled {
            background-color: #555 !important; color: #999 !important; cursor: not-allowed !important;
            border-color: #333 !important; opacity: 0.7; filter: none !important;
          }
          #${CONFIG.SELECTORS.ui.container.substring(
            1
          )} button:hover:not(:disabled) { filter: brightness(1.15); }

          #${CONFIG.SELECTORS.ui.startButton.substring(
            1
          )} { background-color: #68932f; color: white; border-color: #3a511b; }
          #${CONFIG.SELECTORS.ui.pauseButton.substring(
            1
          )} { background-color: #4a6b9d; color: white; border-color: #2a3d5e; }
          #${CONFIG.SELECTORS.ui.stopButton.substring(
            1
          )} { background-color: #a33e29; color: white; border-color: #5c2416; }
          #${CONFIG.SELECTORS.ui.processOnceButton.substring(1)},
          #${CONFIG.SELECTORS.ui.skipButton.substring(
            1
          )} { background-color: #777; color: white; border-color: #444; }

          .${CONFIG.SELECTORS.ui.statusElement.substring(
            1
          )} { /* Target by class for easier style application */
            font-size: 11px; min-height: 1.2em; padding: 4px 0; text-align: left;
            transition: color 0.3s ease, font-weight 0.3s ease; color: #c7d5e0;
          }
          .${CONFIG.SELECTORS.ui.statusElement.substring(
            1
          )}.wl-status-action { color: #66c0f4 !important; }
          .${CONFIG.SELECTORS.ui.statusElement.substring(
            1
          )}.wl-status-success { color: #a1dd4a !important; }
          .${CONFIG.SELECTORS.ui.statusElement.substring(
            1
          )}.wl-status-skipped { color: #aaa !important; }
          .${CONFIG.SELECTORS.ui.statusElement.substring(
            1
          )}.wl-status-error { color: #ff7a7a !important; font-weight: bold; }
          .${CONFIG.SELECTORS.ui.statusElement.substring(
            1
          )}.wl-status-paused { color: #e4d00a !important; font-style: italic; }

          #${CONFIG.SELECTORS.ui.container.substring(1)} label {
            display: inline-flex; align-items: center; cursor: pointer;
            font-size: 11px; vertical-align: middle; margin-bottom: 3px;
          }
          #${CONFIG.SELECTORS.ui.container.substring(
            1
          )} input[type="checkbox"] {
            margin-right: 4px; vertical-align: middle; cursor: pointer; accent-color: #66c0f4;
          }
          #${CONFIG.SELECTORS.ui.versionInfo.substring(1)}.wl-update-available {
             color: #ffa500 !important; text-decoration: underline; cursor: pointer; font-weight: bold;
          }
        `);

      // Add to document
      document.body.appendChild(controlDiv);

      // Store references to UI elements
      State.ui.elements = {
        container: controlDiv,
        startBtn: controlDiv.querySelector(CONFIG.SELECTORS.ui.startButton),
        pauseBtn: controlDiv.querySelector(CONFIG.SELECTORS.ui.pauseButton),
        stopBtn: controlDiv.querySelector(CONFIG.SELECTORS.ui.stopButton),
        processOnce: controlDiv.querySelector(
          CONFIG.SELECTORS.ui.processOnceButton
        ),
        skip: controlDiv.querySelector(CONFIG.SELECTORS.ui.skipButton),
        status: controlDiv.querySelector(CONFIG.SELECTORS.ui.statusElement),
        minimizeBtn: controlDiv.querySelector(
          CONFIG.SELECTORS.ui.minimizeButton
        ),
        wishlistCount: controlDiv.querySelector(
          CONFIG.SELECTORS.ui.wishlistCountElement
        ),
        autoStartCheckbox: controlDiv.querySelector(
          CONFIG.SELECTORS.ui.autoStartCheckbox
        ),
        autoRestartCheckbox: controlDiv.querySelector(
          CONFIG.SELECTORS.ui.autoRestartCheckbox
        ),
        requireCardsCheckbox: controlDiv.querySelector(
          CONFIG.SELECTORS.ui.requireCardsCheckbox
        ),
        skipOwnedCheckbox: controlDiv.querySelector(
          CONFIG.SELECTORS.ui.skipOwnedCheckbox
        ),
        skipNonGamesCheckbox: controlDiv.querySelector(
          CONFIG.SELECTORS.ui.skipNonGamesCheckbox
        ),
        versionInfo: controlDiv.querySelector(CONFIG.SELECTORS.ui.versionInfo),
      };

      // Add event listeners
      State.ui.elements.startBtn.addEventListener(
        "click",
        LoopController.startLoop
      );
      State.ui.elements.pauseBtn.addEventListener(
        "click",
        LoopController.pauseLoop
      );
      State.ui.elements.stopBtn.addEventListener(
        "click",
        () => LoopController.stopLoop(false) // Stop and disable auto features
      );
      State.ui.elements.processOnce.addEventListener(
        "click",
        QueueProcessor.processOnce
      );
      State.ui.elements.skip.addEventListener("click", QueueProcessor.skipItem);
      State.ui.elements.minimizeBtn.addEventListener(
        "click",
        this.toggleMinimizeUI
      );

      // Settings listeners using SettingsManager
      State.ui.elements.autoStartCheckbox.addEventListener("change", (e) =>
        SettingsManager.updateSetting(
          CONFIG.STORAGE_KEYS.AUTO_START,
          e.target.checked
        )
      );
      State.ui.elements.autoRestartCheckbox.addEventListener("change", (e) =>
        SettingsManager.updateSetting(
          CONFIG.STORAGE_KEYS.AUTO_RESTART_QUEUE,
          e.target.checked
        )
      );
      State.ui.elements.requireCardsCheckbox.addEventListener("change", (e) =>
        SettingsManager.updateSetting(
          CONFIG.STORAGE_KEYS.REQUIRE_CARDS,
          e.target.checked
        )
      );
      State.ui.elements.skipOwnedCheckbox.addEventListener("change", (e) =>
        SettingsManager.updateSetting(
          CONFIG.STORAGE_KEYS.SKIP_OWNED,
          e.target.checked
        )
      );
      State.ui.elements.skipNonGamesCheckbox.addEventListener("change", (e) =>
        SettingsManager.updateSetting(
          CONFIG.STORAGE_KEYS.SKIP_NON_GAMES,
          e.target.checked
        )
      );

      // Update UI to match current state
      this.updateUI();
    },

    /**
     * Update all UI elements to match current state
     */
    updateUI: function () {
      if (!State.ui.elements.container) return;

      const isRunning = State.loop.state === "Running";
      const isPaused = State.loop.state === "Paused";

      // Update button states
      State.ui.elements.startBtn.disabled = isRunning;
      State.ui.elements.startBtn.textContent = isPaused ? "Resume" : "Start";
      State.ui.elements.startBtn.title = isPaused
        ? "Resume automatic processing"
        : "Start automatic processing";
      State.ui.elements.pauseBtn.disabled = !isRunning;
      State.ui.elements.stopBtn.disabled = !(isRunning || isPaused);

      // Update manual action buttons based on state
      this.updateManualButtonStates();

      // Update checkboxes
      State.ui.elements.autoStartCheckbox.checked =
        State.settings.autoStartEnabled;
      State.ui.elements.autoRestartCheckbox.checked =
        State.settings.autoRestartQueueEnabled;
      State.ui.elements.requireCardsCheckbox.checked =
        State.settings.requireTradingCards;
      State.ui.elements.skipOwnedCheckbox.checked =
        State.settings.skipOwnedGames;
      State.ui.elements.skipNonGamesCheckbox.checked =
        State.settings.skipNonGames;

      // Update UI minimization state
      State.ui.elements.container.classList.toggle(
        "wl-minimized",
        State.settings.uiMinimized
      );
      State.ui.elements.minimizeBtn.innerHTML = State.settings.uiMinimized
        ? "□"
        : "▬";
      State.ui.elements.minimizeBtn.title = State.settings.uiMinimized
        ? "Restore"
        : "Minimize";

      // Update wishlist count
      if (State.ui.elements.wishlistCount) {
        State.ui.elements.wishlistCount.textContent =
          State.stats.wishlistedThisSession;
      }

      // Initial status text update if needed (avoid overwriting transient messages)
      // Check if the current status is just the base "Status: Initializing..." or empty
      const currentStatusText = State.ui.elements.status
        ? State.ui.elements.status.textContent
        : "";
      if (
        !currentStatusText ||
        currentStatusText === "Status: Initializing..."
      ) {
        if (isPaused) UI.updateStatusText("Paused", "paused");
        else if (isRunning) UI.updateStatusText("Running - Idle...");
        else UI.updateStatusText("Stopped.");
      }
    },

    /**
     * Toggle UI minimized state
     */
    toggleMinimizeUI: function () {
      State.settings.uiMinimized = !State.settings.uiMinimized;
      GM_setValue(CONFIG.STORAGE_KEYS.UI_MINIMIZED, State.settings.uiMinimized);
      UI.updateUI(); // Just call updateUI which handles the class and button text
    },

    /**
     * Update the version info element if a new version is available
     * @param {string} latestVersion - The latest version available
     * @param {string} updateUrl - The URL to the update page/script
     */
    updateVersionInfo: function (latestVersion, updateUrl) {
      if (!State.ui.elements.versionInfo) return;

      // Simple version comparison (assumes semantic versioning or similar numeric comparison)
      const isNewer =
        latestVersion &&
        latestVersion.localeCompare(CONFIG.CURRENT_VERSION, undefined, {
          numeric: true,
          sensitivity: "base",
        }) === 1;

      if (isNewer) {
        State.ui.elements.versionInfo.textContent = `v${CONFIG.CURRENT_VERSION} (Update: v${latestVersion})`;
        State.ui.elements.versionInfo.classList.add("wl-update-available");
        State.ui.elements.versionInfo.title = `New version ${latestVersion} available! Click to view.`;
        // Make clickable only if update URL is provided and valid
        if (updateUrl && updateUrl !== "#") {
          State.ui.elements.versionInfo.style.cursor = "pointer";
          // Remove previous listener before adding new one
          State.ui.elements.versionInfo.onclick = null;
          State.ui.elements.versionInfo.onclick = () => {
            window.open(updateUrl, "_blank");
          };
        } else {
          State.ui.elements.versionInfo.style.cursor = "default";
          State.ui.elements.versionInfo.onclick = null;
        }
      } else {
        State.ui.elements.versionInfo.textContent = `v${CONFIG.CURRENT_VERSION}`;
        State.ui.elements.versionInfo.classList.remove("wl-update-available");
        State.ui.elements.versionInfo.title = "";
        State.ui.elements.versionInfo.style.cursor = "default";
        State.ui.elements.versionInfo.onclick = null;
      }
    },
  };

  // ====================================
  // Module: Settings Manager
  // ====================================
  const SettingsManager = {
    /**
     * Update a setting value in state and GM storage
     * @param {string} key - The storage key from CONFIG.STORAGE_KEYS
     * @param {any} newValue - The new value for the setting
     */
    updateSetting: function (key, newValue) {
      GM_setValue(key, newValue);

      // Find the corresponding key in State.settings based on the GM key
      const stateKeyEntry = Object.entries(CONFIG.STORAGE_KEYS).find(
        ([stateName, gmKey]) => gmKey === key
      );

      if (stateKeyEntry) {
        // Convert state key from uppercase_snake_case (like AUTO_START) to camelCase (like autoStartEnabled)
        const camelCaseKey = stateKeyEntry[0]
          .toLowerCase()
          .replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
        if (camelCaseKey in State.settings) {
          State.settings[camelCaseKey] = newValue;
          Logger.log(`${camelCaseKey} updated to: ${newValue}`, 1);
        } else {
          Logger.log(
            `Warning: No matching key found in State.settings for ${camelCaseKey} (derived from ${key})`,
            0
          );
        }
      } else {
        Logger.log(
          `Warning: No CONFIG.STORAGE_KEYS entry found matching GM key ${key}`,
          0
        );
      }

      // Refresh UI to reflect changes (checkboxes, potentially behavior)
      // Avoid calling updateUI directly if this might cause rapid updates; maybe defer or be selective.
      // For checkbox changes, UI.updateUI() is generally fine.
      UI.updateUI();
    },

    /**
     * Toggles a boolean setting and saves it. Used primarily by menu commands.
     * @param {string} key - The storage key from CONFIG.STORAGE_KEYS
     * @param {boolean} currentValue - The current value to toggle
     * @returns {boolean} The new value after toggling
     */
    toggleSetting: function (key, currentValue) {
      const newValue = !currentValue;
      this.updateSetting(key, newValue); // updateSetting handles state update and logging

      // Find the state key again to return the accurate new value from the state object
      const stateKeyEntry = Object.entries(CONFIG.STORAGE_KEYS).find(
        ([stateName, gmKey]) => gmKey === key
      );
      if (stateKeyEntry) {
        const camelCaseKey = stateKeyEntry[0]
          .toLowerCase()
          .replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
        if (camelCaseKey in State.settings) {
          return State.settings[camelCaseKey];
        }
      }
      // Fallback return if state mapping fails (shouldn't happen)
      return newValue;
    },
  };

  // ====================================
  // Module: Age Verification Bypass
  // ====================================
  const AgeVerificationBypass = {
    /**
     * Initialize age verification bypass functionality
     */
    init: function () {
      // Only run on matching domains
      if (
        !window.location.hostname.includes("steampowered.com") &&
        !window.location.hostname.includes("steamcommunity.com")
      ) {
        return;
      }

      Logger.log("[Steam Age Skip] Initializing...", 1);

      try {
        // Set cookies for age verification immediately
        this.setCookies();

        // Handle based on current site using event listeners for robustness
        if (location.hostname.includes("store.steampowered.com")) {
          this.handleStoreSite();
        } else if (location.hostname.includes("steamcommunity.com")) {
          this.handleCommunitySite();
        }
      } catch (e) {
        Logger.log(`[Steam Age Skip] Error during init: ${e.message}`, 0);
      }
    },

    /**
     * Set cookies for age verification on both domains
     */
    setCookies: function () {
      const birthTimeKey = "birthtime";
      const matureContentKey = "wants_mature_content";
      const sessionMatureContentKey = "session_mature_content"; // Sometimes needed

      // Calculate a plausible birth date (e.g., >= 21 years ago for safety)
      const twentyOneYearsInSeconds = 21 * 365.25 * 24 * 60 * 60;
      const birthTimestamp = Math.floor(
        Date.now() / 1000 - twentyOneYearsInSeconds
      );

      // Use Lax for better compatibility, Secure is important
      const baseCookieOptions = `; max-age=315360000; secure; samesite=Lax`; // 10 years expiration

      // Construct cookie strings for each domain
      const storeDomain = ".store.steampowered.com";
      const communityDomain = ".steamcommunity.com";
      const genericDomain = ".steampowered.com"; // Some cookies might be set here

      const cookiesToSet = [
        { key: birthTimeKey, value: birthTimestamp },
        { key: matureContentKey, value: 1 },
        { key: sessionMatureContentKey, value: 1 }, // Often set without Max-Age
      ];

      cookiesToSet.forEach((cookie) => {
        document.cookie = `${cookie.key}=${cookie.value}; path=/; domain=${storeDomain}${baseCookieOptions}`;
        document.cookie = `${cookie.key}=${cookie.value}; path=/; domain=${communityDomain}${baseCookieOptions}`;
        document.cookie = `${cookie.key}=${cookie.value}; path=/; domain=${genericDomain}${baseCookieOptions}`;
        // Set session cookie without max-age too, just in case
        if (cookie.key === sessionMatureContentKey) {
          document.cookie = `${cookie.key}=${cookie.value}; path=/; domain=${storeDomain}; secure; samesite=Lax`;
          document.cookie = `${cookie.key}=${cookie.value}; path=/; domain=${communityDomain}; secure; samesite=Lax`;
          document.cookie = `${cookie.key}=${cookie.value}; path=/; domain=${genericDomain}; secure; samesite=Lax`;
        }
      });

      Logger.log(
        `[Steam Age Skip] Age cookies set for domains (Store, Community, Generic).`,
        1
      );
    },

    /**
     * Handle age verification on Steam store page load and dynamically
     */
    handleStoreSite: function () {
      const checkAndReload = () => {
        const ageGate = document.querySelector(
          CONFIG.SELECTORS.ageGate.storeContainer
        );
        // Added more selectors for robustness
        const ageGateOverlay = document.querySelector(
          ".agegate_birthday_desc, #agegate_box .agegate_text_container"
        );
        if (ageGate || ageGateOverlay) {
          Logger.log(
            "[Steam Age Skip] Age gate detected on store. Attempting bypass/reload...",
            0
          );

          // Attempt to click the view button first if available
          const viewButton = document.querySelector(
            "#view_product_page_btn, .btn_medium.btnv6_lightblue_blue > span"
          ); // Try common view buttons
          if (viewButton && viewButton.offsetParent) {
            // Check visibility
            Logger.log(
              "[Steam Age Skip] Found visible view button, attempting click...",
              1
            );
            viewButton.click();
            // Don't reload immediately, give click time to work and check again
            setTimeout(() => {
              const ageGateAfterClick = document.querySelector(
                CONFIG.SELECTORS.ageGate.storeContainer
              );
              const ageGateOverlayAfterClick = document.querySelector(
                ".agegate_birthday_desc, #agegate_box .agegate_text_container"
              );
              if (ageGateAfterClick || ageGateOverlayAfterClick) {
                Logger.log(
                  "[Steam Age Skip] Age gate still present after click, reloading.",
                  1
                );
                location.reload();
              } else {
                Logger.log(
                  "[Steam Age Skip] Age gate seems dismissed by click.",
                  1
                );
              }
            }, 500); // Wait 500ms
          } else {
            // If no visible button found, just reload - cookies should handle it.
            Logger.log(
              "[Steam Age Skip] No view button found or visible, relying on reload.",
              1
            );
            location.reload();
          }
          return true; // Gate found
        }
        return false; // No gate found
      };

      // Run check immediately and on DOMContentLoaded/load
      if (!checkAndReload()) {
        // If no gate initially
        window.addEventListener("DOMContentLoaded", checkAndReload, {
          once: true,
        });
        window.addEventListener("load", checkAndReload, { once: true }); // Backup check on full load
      }
    },

    /**
     * Handle age verification on Steam community page load and dynamically
     */
    handleCommunitySite: function () {
      const checkAndProceed = () => {
        const ageCheck = document.querySelector(
          CONFIG.SELECTORS.ageGate.communityTextContainer
        );
        if (ageCheck && ageCheck.offsetParent) {
          // Check visibility
          Logger.log(
            "[Steam Age Skip] Age gate detected on community. Attempting bypass...",
            0
          );
          // Try multiple strategies to bypass age gate
          if (!this.tryProceedFunction()) {
            Logger.log(
              "[Steam Age Skip] Proceed functions failed or not found. Relying on cookies/reload.",
              1
            );
            // Cookies should have been set, maybe a reload is needed if JS fails?
            // Avoid reload loops. If the function call didn't work, manual interaction might be needed.
          } else {
            Logger.log(
              "[Steam Age Skip] Proceed function called successfully (or attempted via injection).",
              1
            );
            // Function call might trigger navigation or content loading.
          }
          return true; // Gate found
        }
        return false; // No gate found
      };

      // Run check immediately and on DOMContentLoaded/load
      if (!checkAndProceed()) {
        // If no gate initially
        window.addEventListener("DOMContentLoaded", checkAndProceed, {
          once: true,
        });
        window.addEventListener("load", checkAndProceed, { once: true });
      }
    },

    /**
     * Try different methods to call the Proceed/Accept function (more robust)
     * @returns {boolean} Whether any attempt was potentially successful
     */
    tryProceedFunction: function () {
      let executed = false;
      const functionsToTry = ["Proceed", "AcceptAppHub", "ViewProductPage"]; // Add more potential function names if needed

      // Helper to log execution attempt
      const attemptExecution = (source, funcName, func) => {
        Logger.log(`[Steam Age Skip] Attempting ${source}.${funcName}()...`, 1);
        try {
          func();
          executed = true; // Mark as executed if call doesn't throw immediately
          Logger.log(` -> Call successful (no immediate error).`, 1);
          return true; // Stop trying other methods
        } catch (e) {
          Logger.log(
            ` -> Error calling ${source}.${funcName}: ${e.message}`,
            1
          );
          return false; // Continue trying other methods
        }
      };

      // 1. Try direct unsafeWindow call (GreaseMonkey/Tampermonkey standard)
      if (typeof unsafeWindow !== "undefined") {
        for (const funcName of functionsToTry) {
          if (typeof unsafeWindow[funcName] === "function") {
            if (
              attemptExecution("unsafeWindow", funcName, unsafeWindow[funcName])
            )
              return true;
          }
        }
      }

      // 2. Try direct window call (less likely due to sandboxing, but check anyway)
      if (!executed) {
        for (const funcName of functionsToTry) {
          if (typeof window[funcName] === "function") {
            if (attemptExecution("window", funcName, window[funcName]))
              return true;
          }
        }
      }

      // 3. Try wrappedJSObject (Firefox-specific)
      if (
        !executed &&
        typeof XPCNativeWrapper !== "undefined" &&
        typeof XPCNativeWrapper.unwrap === "function"
      ) {
        try {
          const unwrappedWindow = XPCNativeWrapper.unwrap(window);
          for (const funcName of functionsToTry) {
            if (typeof unwrappedWindow[funcName] === "function") {
              if (
                attemptExecution(
                  "wrappedJSObject",
                  funcName,
                  unwrappedWindow[funcName]
                )
              )
                return true;
            }
          }
        } catch (e) {
          Logger.log(` -> Error accessing wrappedJSObject: ${e.message}`, 1);
        }
      }

      // 4. Script Injection (Last resort if other methods fail)
      if (!executed) {
        Logger.log(
          "[Steam Age Skip] Direct calls failed, injecting script tag...",
          1
        );
        try {
          const script = document.createElement("script");
          let scriptContent = `"use strict"; (function() { console.log("[Steam Age Skip - Injected] Trying functions..."); var executed = false;`;
          functionsToTry.forEach((funcName) => {
            // Check if function exists before calling, prevent errors in injected script
            scriptContent += `if (!executed && typeof window.${funcName} === 'function') { console.log('[Steam Age Skip - Injected] Calling ${funcName}()'); try { window.${funcName}(); executed = true; } catch(e) { console.error('Error in injected ${funcName}:', e); } } `;
          });
          scriptContent += `if (!executed) console.log("[Steam Age Skip - Injected] No known function found or executed successfully."); })();`;
          script.textContent = scriptContent;

          const target = document.head || document.documentElement;
          if (target) {
            target.appendChild(script); // Append might be safer than prepend sometimes
            executed = true; // Assume injection itself worked, even if function inside fails silently
            Logger.log(" -> Script injected.", 1);
            // Remove script after a short delay to allow execution
            setTimeout(() => script.remove(), 100);
          } else {
            Logger.log(
              " -> Script injection failed: No target element (head/documentElement).",
              0
            );
          }
        } catch (e) {
          Logger.log(
            `[Steam Age Skip] Script injection creation failed: ${e.message}`,
            0
          );
        }
      }

      return executed; // Return true if any method was attempted (direct call) or if injection was done
    },
  };

  // ====================================
  // Module: Game Info Utilities
  // ====================================
  const GameInfoUtils = {
    /**
     * Get the app type from various indicators on the page.
     * @returns {string} The determined app type (Game, DLC, Soundtrack, Demo, Application, Video, Mod, Unknown)
     */
    getAppType: function () {
      // 1. Check DLC bubble first (most reliable for DLC)
      const dlcIndicator = document.querySelector(
        CONFIG.SELECTORS.gameInfo.dlcIndicator
      );
      if (dlcIndicator?.offsetParent) return "DLC";

      // 2. Check details block text content
      const appTypeBlock = document.querySelector(
        CONFIG.SELECTORS.gameInfo.appTypeElement
      );
      if (appTypeBlock) {
        // Use textContent for broader matching, trim and uppercase
        const detailText = appTypeBlock.textContent?.trim().toUpperCase() || "";
        if (detailText.includes("DOWNLOADABLE CONTENT")) return "DLC";
        if (detailText.includes("SOUNDTRACK")) return "Soundtrack";
        if (detailText.includes("DEMO")) return "Demo";
        if (detailText.includes("APPLICATION")) return "Application";
        if (detailText.includes("VIDEO") || detailText.includes("MOVIE"))
          return "Video"; // Added Movie
        if (detailText.includes("MOD")) return "Mod";
      }

      // 3. Check breadcrumbs for clues (e.g., "Software", "Videos")
      // Ensure robust selector for breadcrumbs
      const breadcrumbs = document.querySelectorAll(
        ".breadcrumbs .breadcrumb a, .game_title_area .blockbg a"
      );
      if (breadcrumbs.length > 0) {
        // Check all breadcrumbs, not just second-to-last
        for (const crumb of breadcrumbs) {
          const crumbText = crumb.textContent?.trim().toUpperCase();
          if (crumbText === "SOFTWARE") return "Application";
          if (crumbText === "VIDEOS" || crumbText === "VIDEO") return "Video"; // Check plural too
          if (crumbText === "SOUNDTRACKS" || crumbText === "SOUNDTRACK")
            return "Soundtrack";
          if (crumbText === "DEMOS" || crumbText === "DEMO") return "Demo";
          if (crumbText === "MODS") return "Mod";
          // Add more checks if needed (e.g., "HARDWARE"?)
        }
      }

      // 4. Check for specific demo notice elements
      const demoNotice = document.querySelector(
        ".demo_notice, .game_area_purchase_game.demo_above_purchase"
      );
      if (demoNotice?.offsetParent) return "Demo";

      // 5. Check common tags often associated with non-games (less reliable)
      // Example: document.querySelector('.app_tag[data-tagid="1774"]') // Utilities tag

      // If none of the above match, assume it's a Game
      return "Game"; // Default assumption
    },

    /**
     * Checks if the item is considered a "Non-Game" based on settings and type detection.
     * @returns {string | null} Reason string if it should be skipped as non-game, or null otherwise.
     */
    checkIfNonGame: function () {
      if (!State.settings.skipNonGames) {
        return null; // Skip check if setting is off
      }

      const appType = this.getAppType();
      // Define the list of types to skip when the setting is enabled
      const nonGameTypesToSkip = [
        "DLC",
        "Soundtrack",
        "Demo",
        "Application",
        "Video",
        "Mod",
      ];

      if (nonGameTypesToSkip.includes(appType)) {
        return `Type: ${appType}`; // Return the reason for skipping
      }

      // Additional check: Sometimes items are technically "Games" but act like DLC (e.g., Chapter Packs)
      // This requires more complex logic, perhaps checking tags or descriptions, omitted for now.

      return null; // Considered a game according to current checks
    },
  };

  // ====================================
  // Module: Queue Navigation
  // ====================================
  const QueueNavigation = {
    /**
     * Advance to the next item in the queue using the best available method.
     * Returns the method used ('Next', 'Ignore', 'FormSubmit', 'Failed')
     * @returns {Promise<string>} The method used or 'Failed'.
     */
    advanceQueue: async function () {
      let advanceMethod = "Failed"; // Default status

      // Prioritize visible Next button (check both app page and explore page selectors)
      const nextButton = document.querySelector(
        CONFIG.SELECTORS.queueNav.nextButton
      );
      if (nextButton?.offsetParent) {
        // offsetParent checks visibility
        Logger.log(" -> Found visible 'Next in Queue' button. Clicking...", 1);
        UI.updateStatusText("Navigating Next...", "action");
        nextButton.click();
        advanceMethod = "Next";
      } else {
        // Try Ignore button if Next isn't visible
        const ignoreContainer = document.getElementById(
          CONFIG.SELECTORS.queueNav.ignoreButtonContainer.substring(1)
        );
        const ignoreButton = ignoreContainer?.querySelector(
          CONFIG.SELECTORS.queueNav.ignoreButtonInContainer
        );
        if (ignoreButton?.offsetParent) {
          Logger.log(
            " -> 'Next' button not visible, found visible 'Ignore' button. Clicking...",
            1
          );
          UI.updateStatusText("Ignoring...", "action");
          ignoreButton.click();
          advanceMethod = "Ignore";
        } else {
          // Fallback to form submission if no visible buttons
          const nextForm = document.querySelector(
            CONFIG.SELECTORS.queueNav.nextForm
          );
          if (nextForm) {
            Logger.log(
              " -> No visible buttons, submitting next_in_queue_form...",
              1
            );
            UI.updateStatusText("Submitting form...", "action");
            // Ensure form submission actually navigates
            nextForm.submit();
            // Since form submission navigates away, the rest of the script execution stops here for this page load.
            advanceMethod = "FormSubmit";
            // Add a small delay to *potentially* allow navigation to start visually before script terminates
            await new Promise((resolve) =>
              setTimeout(resolve, CONFIG.TIMING.MINI_DELAY)
            );
            // NOTE: Code after submit() might not execute reliably.
          } else {
            Logger.log(
              " -> Failed to find any method to advance queue (Next/Ignore/Form).",
              0
            );
            UI.updateStatusText("Error: Cannot advance queue.", "error");
            // No change needed, advanceMethod remains 'Failed'
          }
        }
      }

      if (advanceMethod !== "Failed" && advanceMethod !== "FormSubmit") {
        Logger.log(
          ` -> Successfully advanced queue using: ${advanceMethod}`,
          1
        );
        // Add a short delay after successful click actions before the next check might happen
        await new Promise((resolve) =>
          setTimeout(resolve, CONFIG.TIMING.ADVANCE_DELAY)
        );
      } else if (advanceMethod === "FormSubmit") {
        Logger.log(
          ` -> Advanced queue using: FormSubmit (Page will reload).`,
          1
        );
        // No further delay needed as page navigation occurs.
      }

      return advanceMethod;
    },

    /**
     * Ensure queue container is visible if it seems hidden incorrectly.
     * This is less critical now with visibility checks on buttons, but kept as a safeguard.
     */
    ensureQueueVisible: function () {
      const queueContainer = document.querySelector(
        CONFIG.SELECTORS.queueStatus.container
      );
      const emptyContainer = document.querySelector(
        CONFIG.SELECTORS.queueStatus.emptyContainer
      );

      if (queueContainer) {
        // Check if the queue container is present but not visible, AND the empty message is NOT visible
        if (!queueContainer.offsetParent && !emptyContainer?.offsetParent) {
          Logger.log(
            " -> Queue container exists but seems hidden, ensuring visibility.",
            1
          );
          queueContainer.style.display = ""; // Reset potential display:none set by Steam scripts
        }
      }
    },

    /**
     * Generate a new discovery queue by finding and clicking the appropriate button/link.
     * Handles failure counting and potential loop stopping.
     * @returns {Promise<boolean>} Whether queue generation was successfully initiated.
     */
    generateNewQueue: async function () {
      Logger.log("Attempting to generate a new queue...", 1);
      UI.updateStatusText("Generating new queue...", "action");
      let generated = false;

      // Combine selectors for various start/refresh buttons/links
      const startRefreshSelectors = `${CONFIG.SELECTORS.queueStatus.startAnotherButton}, ${CONFIG.SELECTORS.queueStatus.startLink}`;
      const buttons = document.querySelectorAll(startRefreshSelectors);

      // Find the first visible and clickable button/link
      let targetButton = null;
      for (const btn of buttons) {
        // Check visibility (offsetParent) and also check if it's not disabled (common for buttons)
        if (btn.offsetParent && !btn.disabled) {
          targetButton = btn;
          break;
        }
      }

      if (targetButton) {
        Logger.log(
          ` -> Found visible & enabled button/link: '${
            targetButton.innerText?.trim() || targetButton.id || "Start Link"
          }'. Clicking...`,
          1
        );
        targetButton.click();
        generated = true;
      } else {
        // Try Steam's JS object as a fallback if no suitable button found
        Logger.log(
          " -> No visible/enabled button found. Trying DiscoveryQueue.GenerateNewQueue()...",
          1
        );
        try {
          // Check existence carefully
          if (
            typeof window.DiscoveryQueue === "object" &&
            window.DiscoveryQueue !== null &&
            typeof window.DiscoveryQueue.GenerateNewQueue === "function"
          ) {
            window.DiscoveryQueue.GenerateNewQueue();
            generated = true;
            Logger.log(
              " -> Called DiscoveryQueue.GenerateNewQueue() successfully.",
              1
            );
          } else {
            Logger.log(
              " -> DiscoveryQueue.GenerateNewQueue() not available or not a function.",
              1
            );
          }
        } catch (e) {
          Logger.log(` -> Error calling DiscoveryQueue: ${e.message}`, 0);
        }
      }

      if (!generated) {
        Logger.log(" -> Failed to find any method to generate a new queue.", 0);
        UI.updateStatusText("Queue generation failed.", "error");
        State.loop.failedQueueRestarts++; // Increment failure count immediately

        // Check failure count and stop if exceeded
        if (
          State.loop.failedQueueRestarts >= CONFIG.MAX_QUEUE_RESTART_FAILURES
        ) {
          Logger.log(
            `Queue generation failed ${State.loop.failedQueueRestarts} times. Stopping loop.`,
            0
          );
          UI.updateStatusText(
            `Restart Failed ${CONFIG.MAX_QUEUE_RESTART_FAILURES}x. Stopping.`,
            "error"
          );
          // Stop the loop but keep settings enabled, allowing manual restart later
          LoopController.stopLoop(true);
          return false; // Indicate definitive failure
        }
      } else {
        // Reset failure count on success
        State.loop.failedQueueRestarts = 0;
        Logger.log(" -> Queue generation initiated.", 1);
        // Wait after initiating generation for page to potentially update
        await new Promise((resolve) =>
          setTimeout(resolve, CONFIG.TIMING.QUEUE_GENERATION_DELAY)
        );
        // Optionally ensure queue elements are visible after delay (might help if Steam UI is slow)
        this.ensureQueueVisible();
      }

      return generated; // True if initiated, False if definitively failed after retries
    },
  };

  // ====================================
  // Module: Queue Processor
  // ====================================
  const QueueProcessor = {
    /**
     * Checks the overall queue status (finished, needs starting, error state) and handles auto-start/restart.
     * @returns {Promise<boolean>} True if processing should continue on the current item, False otherwise.
     */
    checkQueueStatusAndHandle: async function () {
      const queueEmptyContainer = document.querySelector(
        CONFIG.SELECTORS.queueStatus.emptyContainer
      );
      const isOnExplorePage = window.location.pathname.includes("/explore");
      const queueContainer = document.querySelector(
        CONFIG.SELECTORS.queueStatus.container
      );
      const isQueueVisible = queueContainer?.offsetParent; // Check if queue area is visible and in layout
      const isEmptyMessageVisible =
        queueEmptyContainer?.offsetParent &&
        queueEmptyContainer.style.display !== "none";

      // --- Case 1: Queue finished message is visible ---
      if (isEmptyMessageVisible) {
        Logger.log("Discovery Queue finished/empty message visible.");

        if (
          State.settings.autoStartEnabled &&
          State.settings.autoRestartQueueEnabled
        ) {
          Logger.log(
            "Auto-restart enabled. Attempting new queue generation..."
          );
          // generateNewQueue handles failure counting and potential loop stopping
          await QueueNavigation.generateNewQueue();
        } else {
          Logger.log(
            "Queue finished and Auto-restart disabled. Stopping loop."
          );
          UI.updateStatusText("Queue finished. Stopped.");
          LoopController.stopLoop(true); // Stop but keep settings enabled
        }
        return false; // Don't process current (non-existent) item
      }

      // --- Case 2: On explore page, but queue is not visible (needs starting) ---
      // This implies we are on /explore/ but haven't clicked "Start Queue" or it hasn't loaded yet.
      if (isOnExplorePage && !isQueueVisible) {
        Logger.log(
          "On explore page, queue container not visible or not found."
        );

        if (State.settings.autoStartEnabled) {
          Logger.log(
            "Auto-start enabled. Attempting to start/generate queue from explore page..."
          );
          // Use generateNewQueue which finds the start/refresh button
          await QueueNavigation.generateNewQueue();
        } else {
          Logger.log(
            "On explore page, queue inactive, Auto-start disabled. Stopping loop."
          );
          UI.updateStatusText("Stopped (Needs Queue Start).");
          LoopController.stopLoop(true); // Keep settings
        }
        return false; // Don't process yet, wait for queue to load after generation attempt
      }

      // --- Case 3: On an app page, check for essential navigation elements ---
      // If we're on an app page (/app/...), we expect queue navigation buttons. If they're missing, something is wrong.
      if (window.location.pathname.includes("/app/")) {
        const nextButton = document.querySelector(
          CONFIG.SELECTORS.queueNav.nextButton
        );
        const ignoreContainer = document.getElementById(
          CONFIG.SELECTORS.queueNav.ignoreButtonContainer.substring(1)
        );
        const ignoreButton = ignoreContainer?.querySelector(
          CONFIG.SELECTORS.queueNav.ignoreButtonInContainer
        );
        const nextForm = document.querySelector(
          CONFIG.SELECTORS.queueNav.nextForm
        );

        // Check if *none* of the advancement methods seem available and visible
        if (
          !nextButton?.offsetParent &&
          !ignoreButton?.offsetParent &&
          !nextForm
        ) {
          Logger.log(
            "On app page but missing visible queue navigation elements. Potential error or not a queue item?",
            0
          );
          // This could happen if navigating directly to an app page not via the queue.
          // If the loop is running, treat this as an error state for the queue.
          if (State.loop.state === "Running") {
            UI.updateStatusText("Error: Invalid queue state?", "error");
            Logger.log(
              " -> Stopping loop due to invalid state on app page.",
              0
            );
            LoopController.stopLoop(true); // Stop but keep settings
          } else {
            // If stopped/paused, just indicate the state but don't force stop
            UI.updateStatusText("Stopped (Invalid state?)");
          }
          return false; // Cannot proceed on this page
        }
      }

      // --- Case 4: On explore page WITH visible queue ---
      // Need to ensure wishlist/ignore buttons are present on the explore page itself
      if (isOnExplorePage && isQueueVisible) {
        const exploreWishlistButton = document.querySelector(
          CONFIG.SELECTORS.wishlist.addButton
        ); // Check specific explore wishlist button
        const exploreIgnoreButton = document.querySelector(
          CONFIG.SELECTORS.queueNav.ignoreButtonInContainer
        );
        const exploreNextButton = document.querySelector(
          CONFIG.SELECTORS.queueNav.nextButton
        );

        // If the core interaction buttons are missing on the explore page queue, something is wrong
        if (
          !exploreWishlistButton &&
          !exploreIgnoreButton &&
          !exploreNextButton?.offsetParent
        ) {
          Logger.log(
            "On explore page queue, but missing interaction buttons (Wishlist/Ignore/Next). Potential error.",
            0
          );
          if (State.loop.state === "Running") {
            UI.updateStatusText("Error: Invalid queue state?", "error");
            Logger.log(
              " -> Stopping loop due to invalid state on explore page.",
              0
            );
            LoopController.stopLoop(true);
          } else {
            UI.updateStatusText("Stopped (Invalid state?)");
          }
          return false;
        }
      }

      // If none of the above problematic conditions are met, assume queue is active and ready.
      State.loop.failedQueueRestarts = 0; // Reset failure counter as we seem to have a valid item/state
      return true; // Okay to proceed with processing the current item
    },

    /**
     * Process the current game/item in the queue based on settings.
     * Handles checking criteria, wishlisting or skipping, and triggers advancement if needed.
     * @param {boolean} isManualTrigger - True if triggered by "Process Once" button.
     */
    processCurrentGameItem: async function (isManualTrigger = false) {
      UI.updateStatusText("Checking page...");

      // Get game title (best effort, works on app page, fallback for explore)
      const gameTitleElement = document.querySelector(
        CONFIG.SELECTORS.gameInfo.title
      );
      // On explore page, title might be inside the queue item itself
      const exploreTitleElement = document.querySelector(
        "#discovery_queue .queue_item_title, #discovery_queue .title"
      ); // Adjust selectors if needed
      const gameTitle =
        gameTitleElement?.textContent?.trim() ||
        exploreTitleElement?.textContent?.trim() ||
        "Current Item";

      // Get queue remaining text (if available)
      const queueRemainingElement = document.querySelector(
        CONFIG.SELECTORS.gameInfo.queueRemainingText
      );
      const queueRemaining = queueRemainingElement
        ? queueRemainingElement.textContent.trim()
        : "";

      UI.updateStatusText(`Checking ${gameTitle}... ${queueRemaining}`);
      Logger.log(
        `Processing: ${gameTitle} ${
          queueRemaining ? "- " + queueRemaining : ""
        }`,
        1
      );

      // --- Check Skip Conditions ---
      let skipReason = null;

      // 1. Owned Game Check (selector works on app page, might need adjustment for explore page if structure differs)
      // Steam usually hides the wishlist button on explore if owned, relying on that might be better. See wishlist check below.
      const ownedIndicator = document.querySelector(
        CONFIG.SELECTORS.gameInfo.inLibraryIndicator
      );
      if (State.settings.skipOwnedGames && ownedIndicator?.offsetParent) {
        skipReason = "Already in Library";
        Logger.log(` -> Skipping: ${skipReason} (Indicator found).`, 1);
      }

      // 2. Non-Game Check (if not already skipped)
      if (!skipReason) {
        skipReason = GameInfoUtils.checkIfNonGame(); // Returns reason string or null
        if (skipReason)
          Logger.log(` -> Skipping: ${skipReason} (Type detected).`, 1);
      }

      // 3. Trading Card Check (if not already skipped)
      // Note: Trading card info might not be readily available on the explore page view.
      // This check primarily works on the app page.
      if (
        !skipReason &&
        State.settings.requireTradingCards &&
        window.location.pathname.includes("/app/")
      ) {
        const hasTradingCards = document.querySelector(
          CONFIG.SELECTORS.gameInfo.tradingCardsIndicator
        );
        if (!hasTradingCards) {
          skipReason = "No Trading Cards";
          Logger.log(
            ` -> Skipping: ${skipReason} (Indicator not found on app page).`,
            1
          );
        } else {
          Logger.log(` -> Has Trading Cards (App page indicator found).`, 2); // Verbose log
        }
      } else if (
        !skipReason &&
        State.settings.requireTradingCards &&
        !window.location.pathname.includes("/app/")
      ) {
        // Cannot reliably check cards on explore page, proceed cautiously or skip?
        // Current behavior: Proceed, card check only enforced on app pages.
        Logger.log(` -> Trading card check skipped (not on app page).`, 2);
      }

      // --- Perform Action (Wishlist or Skip) ---
      let actionTaken = false; // Did we actively wishlist?

      if (skipReason) {
        // Already logged skip reason above
        UI.updateStatusText(`Skipped (${skipReason})`, "skipped");
        // No wishlist action needed
      } else {
        // Eligible for wishlisting according to checks. Now check UI for wishlist button/status.
        const wishlistArea = document.querySelector(
          CONFIG.SELECTORS.wishlist.area
        );
        if (!wishlistArea) {
          // This is unexpected if queue status check passed. Log as error.
          Logger.log(
            " -> ERROR: Wishlist area not found after status check passed.",
            0
          );
          UI.updateStatusText("Error: Wishlist area missing", "error");
          skipReason = "Wishlist Area Missing"; // Treat as skipped due to error
        } else {
          const wishlistedIndicator = wishlistArea.querySelector(
            CONFIG.SELECTORS.wishlist.successIndicator
          );
          // Check visibility of success text OR if the area/button has the 'active' class (common on explore page)
          const isWishlisted =
            (wishlistedIndicator?.offsetParent &&
              wishlistedIndicator.style.display !== "none") ||
            wishlistArea.classList.contains("queue_btn_active") || // Check area class
            wishlistArea.querySelector(".queue_btn_active") !== null; // Check for child with class

          const addButton = wishlistArea.querySelector(
            CONFIG.SELECTORS.wishlist.addButton
          );
          const isAddButtonVisible =
            addButton?.offsetParent && !addButton.disabled;

          // Check if owned based on add button visibility (Steam often hides/disables it if owned)
          if (
            State.settings.skipOwnedGames &&
            !isAddButtonVisible &&
            !isWishlisted
          ) {
            // If the add button isn't visible/enabled, and it's not already wishlisted,
            // it's highly likely the item is owned or otherwise ineligible.
            skipReason = "Owned/Ineligible";
            Logger.log(
              ` -> Skipping: ${skipReason} (Wishlist button absent/disabled).`,
              1
            );
            UI.updateStatusText(`Skipped (${skipReason})`, "skipped");
          } else if (isWishlisted) {
            Logger.log(` -> Already on wishlist.`);
            UI.updateStatusText(`On Wishlist`, "info"); // Informative status
            // No action needed, not technically skipped based on criteria
          } else if (isAddButtonVisible) {
            // Okay to add!
            Logger.log(` -> Adding to wishlist...`);
            UI.updateStatusText(`Adding ${gameTitle}...`, "action");
            addButton.click(); // Perform the click
            actionTaken = true;

            // Wait for action and confirmation using combined delay/check approach
            const confirmed = await this.checkWishlistSuccessAfterAction(
              wishlistArea
            );

            if (confirmed) {
              UI.updateStatusText(`Added ${gameTitle}!`, "success");
              UI.incrementWishlistCounter();
            } else {
              // Even if confirmation failed, Steam might have processed it. Log uncertainty.
              Logger.log(
                " -> Wishlist add confirmation failed/timed out (UI didn't update). May have worked.",
                0
              );
              UI.updateStatusText(`Add Confirm Failed? ${gameTitle}`, "error");
              actionTaken = false; // Treat as failed for state purposes if UI doesn't confirm
            }
            // Add remaining delay regardless of confirmation to ensure pace
            await new Promise((resolve) =>
              setTimeout(resolve, CONFIG.TIMING.ACTION_DELAY * 0.7)
            );
          } else {
            // Should have been caught by the owned/ineligible check above, but log as fallback
            Logger.log(
              ` -> Cannot add: Wishlist button not found or not visible/enabled.`
            );
            UI.updateStatusText("Wishlist button missing?", "error");
            skipReason = "Add Button Missing"; // Treat as skipped due to error
          }
        }
      }

      // --- Advance Queue (if not manual trigger and no critical error occurred) ---
      if (!isManualTrigger) {
        Logger.log(" -> Triggering advance to next item...", 1);
        const advanceResult = await QueueNavigation.advanceQueue();
        if (advanceResult === "Failed") {
          // Stop the loop if advancing failed critically
          Logger.log(" -> Advancing failed, stopping loop.", 0);
          LoopController.stopLoop(true);
        }
        // Add a small delay after advancing completes (if not form submit) before next cycle check
        if (advanceResult !== "FormSubmit") {
          await new Promise((resolve) =>
            setTimeout(resolve, CONFIG.TIMING.MINI_DELAY)
          );
        }
      } else {
        Logger.log(
          " -> Manual trigger ('Process Once'), automatic advance skipped.",
          1
        );
        // Manual lock is released in processQueueCycle finally block
      }
    },

    /**
     * Waits for a short period then checks if the wishlist success indicator becomes visible.
     * Combines waiting and checking.
     * @param {HTMLElement} wishlistAreaElement - The wishlist area DOM element.
     * @returns {Promise<boolean>} True if success indicator found within time, false otherwise.
     */
    checkWishlistSuccessAfterAction: async function (wishlistAreaElement) {
      // Initial delay to allow Steam's backend/frontend to react
      await new Promise((resolve) =>
        setTimeout(resolve, CONFIG.TIMING.ACTION_DELAY * 0.3)
      );

      let attempts = 0;
      const maxAttempts = 8; // Check multiple times within the remaining action delay window
      const intervalTime =
        (CONFIG.TIMING.WISHLIST_CONFIRM_TIMEOUT * 0.7) / maxAttempts; // Check interval

      return new Promise((resolve) => {
        const intervalId = setInterval(() => {
          const successIndicator = wishlistAreaElement.querySelector(
            CONFIG.SELECTORS.wishlist.successIndicator
          );
          const isActive =
            wishlistAreaElement.classList.contains("queue_btn_active") ||
            wishlistAreaElement.querySelector(".queue_btn_active") !== null;

          if (
            (successIndicator?.offsetParent &&
              successIndicator.style.display !== "none") ||
            isActive
          ) {
            Logger.log(" -> Wishlist success confirmed by UI.", 1);
            clearInterval(intervalId);
            resolve(true);
          } else {
            attempts++;
            if (attempts >= maxAttempts) {
              Logger.log(" -> Wishlist success confirmation timed out.", 1);
              clearInterval(intervalId);
              resolve(false);
            }
          }
        }, intervalTime);
      });
    },

    /**
     * Main processing cycle called by the loop or manual triggers.
     * Manages locking, calls status checks, item processing, and handles errors.
     * @param {boolean} isManualTrigger - If true, skips the automatic advance step.
     */
    processQueueCycle: async function (isManualTrigger = false) {
      // Prevent overlapping automatic executions. Allow manual trigger if paused.
      if (State.loop.isProcessing && !isManualTrigger) {
        Logger.log("Cycle skipped, already processing.", 2); // Verbose log
        return;
      }
      if (State.loop.state === "Paused" && !isManualTrigger) {
        Logger.log("Cycle skipped, loop paused.", 2); // Verbose log
        return;
      }
      // Prevent multiple concurrent manual actions
      if (State.loop.manualActionInProgress && isManualTrigger) {
        Logger.log("Manual action already in progress.", 1);
        return;
      }

      // Set locks
      State.loop.isProcessing = true;
      if (isManualTrigger) {
        State.loop.manualActionInProgress = true;
        UI.updateManualButtonStates(); // Disable buttons during manual action
      }

      try {
        // 1. Check overall queue status (finished, needs starting, error?)
        const shouldProcessItem = await this.checkQueueStatusAndHandle();

        // 2. If queue status is okay, proceed to process the item if loop is running or it's manual
        if (
          shouldProcessItem &&
          (State.loop.state === "Running" || isManualTrigger)
        ) {
          // Double check state hasn't changed during checkQueueStatus async operations
          if (State.loop.state === "Running" || isManualTrigger) {
            await this.processCurrentGameItem(isManualTrigger);
          } else {
            Logger.log(
              ` -> Loop state changed to '${State.loop.state}' during status check, skipping item processing.`,
              1
            );
          }
        } else if (!shouldProcessItem) {
          Logger.log(
            " -> Queue status check indicated no item to process or action was taken (like restart).",
            1
          );
          // If status check initiated restart/stop, the loop state might already be changed.
        } else {
          // This case means shouldProcessItem was true, but loop state is neither Running nor is it a manual trigger.
          // Should only happen if paused.
          Logger.log(
            ` -> Loop state is '${State.loop.state}', skipping item processing.`,
            1
          );
        }
      } catch (error) {
        Logger.log(`ERROR during processQueueCycle: ${error.message}`, 0);
        console.error(
          "[Steam Wishlist Looper] Error details:",
          error.stack || error
        );
        UI.updateStatusText("Runtime Error!", "error");
        // Consider stopping the loop on unhandled errors to prevent repeated issues
        // LoopController.stopLoop(true);
      } finally {
        // Use a delay before releasing locks to allow UI updates and prevent overly rapid cycles
        setTimeout(() => {
          State.loop.isProcessing = false;
          if (isManualTrigger) {
            State.loop.manualActionInProgress = false;
          }
          // Update button states after action potentially completes
          UI.updateManualButtonStates();

          // Set appropriate status text based on the final loop state after processing
          if (State.loop.state === "Running") {
            // Avoid overwriting success/skipped messages immediately with Idle
            const currentStatus = State.ui.elements.status?.textContent || "";
            if (
              !currentStatus.includes("Added") &&
              !currentStatus.includes("Skipped") &&
              !currentStatus.includes("Error")
            ) {
              UI.updateStatusText("Idle...");
            }
          } else if (State.loop.state === "Paused") {
            UI.updateStatusText("Paused", "paused");
          } else {
            // Stopped
            UI.updateStatusText("Stopped.");
          }
        }, CONFIG.TIMING.PROCESSING_RELEASE_DELAY);
      }
    },

    /**
     * Manually trigger processing for the current item once. Requires loop to be Paused or Stopped.
     */
    processOnce: function () {
      if (State.loop.state === "Running") {
        Logger.log(
          "Cannot 'Process Once' while loop is running. Pause or Stop first.",
          0
        );
        UI.updateStatusText("Pause/Stop to Process Once", "info");
        return;
      }
      if (State.loop.isProcessing || State.loop.manualActionInProgress) {
        Logger.log("Cannot 'Process Once', action already in progress.", 1);
        return;
      }

      Logger.log("Manual trigger: Processing current item once...");
      UI.updateStatusText("Processing (Manual)...", "action");
      // Call processQueueCycle with manual flag true
      QueueProcessor.processQueueCycle(true);
    },

    /**
     * Manually trigger skipping the current item. Requires loop to be Paused or Stopped.
     */
    skipItem: async function () {
      if (State.loop.state === "Running") {
        Logger.log(
          "Cannot 'Skip Item' while loop is running. Pause or Stop first.",
          0
        );
        UI.updateStatusText("Pause/Stop to Skip Item", "info");
        return;
      }
      if (State.loop.isProcessing || State.loop.manualActionInProgress) {
        Logger.log("Cannot 'Skip Item', action already in progress.", 1);
        return;
      }

      Logger.log("Manual trigger: Skipping current item...");
      UI.updateStatusText("Skipping (Manual)...", "action");
      State.loop.isProcessing = true; // Lock processing during manual skip
      State.loop.manualActionInProgress = true;
      UI.updateManualButtonStates(); // Disable buttons

      try {
        // Directly call advanceQueue to move to the next item
        const advanceResult = await QueueNavigation.advanceQueue();
        if (advanceResult === "Failed") {
          UI.updateStatusText("Skip failed: Cannot advance.", "error");
        } else {
          UI.updateStatusText("Skipped (Manual)", "skipped");
          // No need to wait long after skip, just release lock below
        }
      } catch (error) {
        Logger.log(`Error during manual skip: ${error.message}`, 0);
        UI.updateStatusText("Error during skip!", "error");
      } finally {
        // Release lock after a shorter delay for skip
        setTimeout(() => {
          State.loop.isProcessing = false;
          State.loop.manualActionInProgress = false;
          UI.updateManualButtonStates(); // Re-enable buttons
          // Restore appropriate status text based on whether paused or stopped
          if (State.loop.state === "Paused") {
            UI.updateStatusText("Paused", "paused");
          } else {
            UI.updateStatusText("Stopped.");
          }
        }, CONFIG.TIMING.ADVANCE_DELAY); // Use shorter delay matching advance
      }
    },
  };

  // ====================================
  // Module: Loop Controller
  // ====================================
  const LoopController = {
    /**
     * The main loop function called repeatedly by setTimeout. Manages the cycle execution.
     */
    mainLoop: function () {
      // Strict check: Only proceed if state is 'Running' AND the timeoutId matches the current one.
      if (State.loop.state !== "Running" || !State.loop.timeoutId) {
        Logger.log(
          `Main loop called but state is '${State.loop.state}' or timeoutId is invalid. Exiting loop.`,
          1
        );
        // Ensure timeout is cleared if it somehow exists but state isn't Running
        if (State.loop.timeoutId) {
          clearTimeout(State.loop.timeoutId);
          State.loop.timeoutId = null;
        }
        return;
      }

      // Store the current timeout ID associated with this execution instance
      const currentTimeoutId = State.loop.timeoutId;

      // Call the processing cycle
      QueueProcessor.processQueueCycle(false) // false indicates automatic cycle
        .then(() => {
          // AFTER the async processQueueCycle completes or errors, check state *again*
          // Only reschedule if the state is still 'Running' AND the timeout ID hasn't been changed
          // (e.g., by a quick stop/pause action during the processing cycle)
          if (
            State.loop.state === "Running" &&
            State.loop.timeoutId === currentTimeoutId
          ) {
            // Clear previous timeout just in case (should be redundant but safe)
            clearTimeout(State.loop.timeoutId);
            // Schedule the next run using CHECK_INTERVAL
            State.loop.timeoutId = setTimeout(
              LoopController.mainLoop,
              CONFIG.TIMING.CHECK_INTERVAL
            );
            Logger.log(
              `Next check scheduled in ${
                CONFIG.TIMING.CHECK_INTERVAL / 1000
              }s.`,
              2
            ); // Verbose
          } else {
            // If state changed or timeoutId is different, don't reschedule.
            Logger.log(
              `Loop state changed to '${State.loop.state}' or timeoutId mismatch (current: ${State.loop.timeoutId}, expected: ${currentTimeoutId}) during processing. Next check cancelled.`,
              1
            );
            // If a different timeoutId exists (e.g., rapid stop/start), clear it.
            if (
              State.loop.timeoutId &&
              State.loop.timeoutId !== currentTimeoutId
            ) {
              clearTimeout(State.loop.timeoutId);
            }
            // Ensure timeoutId is null if we are not rescheduling
            State.loop.timeoutId = null;
          }
        })
        .catch((error) => {
          // Catch unexpected errors from the processQueueCycle promise chain itself
          Logger.log(
            `Unhandled error in mainLoop promise chain: ${error.message}`,
            0
          );
          console.error(
            "[Steam Wishlist Looper] mainLoop promise error:",
            error.stack || error
          );
          UI.updateStatusText("Critical Error in Loop!", "error");

          // Decide recovery: Stop the loop? Or try to reschedule?
          // Stopping might be safer on unhandled errors.
          if (
            State.loop.state === "Running" &&
            State.loop.timeoutId === currentTimeoutId
          ) {
            Logger.log(" -> Stopping loop due to critical error.", 0);
            LoopController.stopLoop(true); // Stop but keep settings
          } else {
            // Ensure timeout is cleared if state already changed
            if (State.loop.timeoutId) clearTimeout(State.loop.timeoutId);
            State.loop.timeoutId = null;
          }
        });
    },

    /**
     * Start the processing loop (or resume if paused).
     */
    startLoop: function () {
      if (State.loop.state === "Running") {
        Logger.log("Loop already running.", 1);
        return;
      }

      if (State.loop.state === "Paused") {
        LoopController.resumeLoop(); // Delegate to resume function
        return;
      }

      // --- Starting from Stopped state ---
      Logger.log("Starting loop...");
      UI.updateStatusText("Starting...");
      State.loop.state = "Running";
      State.loop.isProcessing = false; // Ensure processing lock is clear initially
      State.loop.manualActionInProgress = false; // Ensure manual lock is clear
      State.loop.failedQueueRestarts = 0; // Reset failure count on fresh start
      UI.updateUI(); // Update button states immediately

      // Clear any lingering timeout from previous states just in case
      if (State.loop.timeoutId) clearTimeout(State.loop.timeoutId);

      // Schedule the *first* cycle with a minimal delay
      State.loop.timeoutId = setTimeout(
        LoopController.mainLoop,
        CONFIG.TIMING.MINI_DELAY
      );
      // Update status after scheduling the first check
      // Set a slightly more informative initial running status
      setTimeout(() => {
        if (State.loop.state === "Running")
          UI.updateStatusText("Running - Initializing cycle...");
      }, CONFIG.TIMING.MINI_DELAY + 10);
    },

    /**
     * Pause the processing loop if it is currently running.
     */
    pauseLoop: function () {
      if (State.loop.state !== "Running") {
        Logger.log(`Loop is '${State.loop.state}', cannot pause.`, 1);
        return;
      }

      Logger.log("Pausing loop...");
      State.loop.state = "Paused";

      // Clear the *scheduled* next timeout. This stops new cycles from starting.
      if (State.loop.timeoutId) {
        clearTimeout(State.loop.timeoutId);
        State.loop.timeoutId = null;
        Logger.log(" -> Next cycle cancelled.", 1);
      }

      // Note: An ongoing 'processQueueCycle' might still be running. We don't interrupt it.
      // The 'isProcessing' flag will remain true until that cycle finishes.
      // The 'finally' block in processQueueCycle will eventually set the correct Paused status text.

      UI.updateUI(); // Update button states immediately
      UI.updateStatusText("Paused", "paused"); // Set status text explicitly
    },

    /**
     * Resume the processing loop from a paused state.
     */
    resumeLoop: function () {
      if (State.loop.state !== "Paused") {
        Logger.log(`Loop is '${State.loop.state}', cannot resume.`, 1);
        return;
      }

      Logger.log("Resuming loop...");
      State.loop.state = "Running";

      // Explicitly reset locks when resuming, assuming any previous action completed while paused.
      State.loop.isProcessing = false;
      State.loop.manualActionInProgress = false;

      UI.updateUI(); // Update button states
      UI.updateStatusText("Resuming...");

      // Clear any lingering timeout (should be null, but safety first)
      if (State.loop.timeoutId) clearTimeout(State.loop.timeoutId);

      // Schedule the next cycle almost immediately to get things going again
      State.loop.timeoutId = setTimeout(
        LoopController.mainLoop,
        CONFIG.TIMING.MINI_DELAY
      );
      setTimeout(() => {
        if (State.loop.state === "Running")
          UI.updateStatusText("Running - Resuming cycle...");
      }, CONFIG.TIMING.MINI_DELAY + 10);
    },

    /**
     * Stop the processing loop completely.
     * @param {boolean} keepSettings - If true, Auto-Start/Restart settings are NOT disabled.
     */
    stopLoop: function (keepSettings = false) {
      if (State.loop.state === "Stopped") {
        Logger.log("Loop already stopped.", 1);
        // Still ensure UI is correct for stopped state
        UI.updateUI();
        UI.updateStatusText("Stopped.");
        return;
      }

      Logger.log("Stopping loop...");
      const wasRunning = State.loop.state === "Running";
      State.loop.state = "Stopped"; // Set state immediately

      // Clear any scheduled timeout
      if (State.loop.timeoutId) {
        clearTimeout(State.loop.timeoutId);
        State.loop.timeoutId = null;
        Logger.log(" -> Next cycle cancelled.", 1);
      }

      // Reset flags - Note: isProcessing might briefly stay true if stopped mid-action,
      // but the finally block of that action will see state is 'Stopped' and won't reschedule.
      // Resetting here ensures clean state if stopped while idle.
      State.loop.isProcessing = false;
      State.loop.manualActionInProgress = false;

      // Handle Auto settings based on parameter
      if (!keepSettings) {
        Logger.log("-> Disabling Auto-Start & Auto-Restart Queue settings.", 1);
        // Use SettingsManager to update state and GM storage
        SettingsManager.updateSetting(CONFIG.STORAGE_KEYS.AUTO_START, false);
        SettingsManager.updateSetting(
          CONFIG.STORAGE_KEYS.AUTO_RESTART_QUEUE,
          false
        );
      } else {
        Logger.log("-> Keeping Auto-Start/Restart settings enabled.", 1);
      }

      // Update UI after a very brief moment to allow state change to reflect correctly
      // and potentially allow any final status message from an interrupted cycle to show briefly.
      setTimeout(() => {
        UI.updateUI();
        UI.updateStatusText("Stopped.");
      }, CONFIG.TIMING.MINI_DELAY);
    },
  };

  // ====================================
  // Module: Version Checker
  // ====================================
  const VersionChecker = {
    /**
     * Check for script updates periodically using GM_xmlhttpRequest.
     */
    checkForUpdates: function () {
      const currentTime = Date.now();
      const lastCheck = State.stats.lastVersionCheck;
      const checkInterval = CONFIG.TIMING.VERSION_CHECK_INTERVAL;

      // Only check if interval has passed
      if (currentTime - lastCheck < checkInterval) {
        Logger.log(
          `Skipping version check, last checked ${Math.round(
            (currentTime - lastCheck) / 3600000
          )} hours ago.`,
          2
        ); // Verbose
        // Still update UI in case previous check found an update and stored it in State.stats
        this.updateUIAfterCheck();
        return;
      }

      Logger.log("Checking for updates...", 1);
      const checkUrl = CONFIG.VERSION_CHECK_URL; // Get URL from config getter

      if (!checkUrl || !checkUrl.startsWith("http")) {
        Logger.log(
          "Version check URL is invalid or not configured. Skipping check.",
          0
        );
        // Update last check time anyway to prevent constant checks with bad URL
        GM_setValue(CONFIG.STORAGE_KEYS.LAST_VERSION_CHECK, currentTime);
        State.stats.lastVersionCheck = currentTime;
        return;
      }

      GM_xmlhttpRequest({
        method: "GET",
        url: checkUrl + `?ts=${currentTime}`, // Add cache-busting timestamp
        timeout: 10000, // 10 second timeout
        headers: {
          // Add headers to potentially help with caching issues
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        onload: (response) => {
          // Update last check time on success or expected failure (like 404)
          GM_setValue(CONFIG.STORAGE_KEYS.LAST_VERSION_CHECK, currentTime);
          State.stats.lastVersionCheck = currentTime;

          if (response.status === 200) {
            try {
              const data = JSON.parse(response.responseText);
              // Validate response structure
              if (data && typeof data.version === "string") {
                Logger.log(
                  `Latest version fetched: ${data.version}, Current: ${CONFIG.CURRENT_VERSION}`,
                  1
                );
                // Store latest version info in State for UI update
                State.stats.latestVersion = data.version;
                // Store update URL if provided, ensure it's a string
                State.stats.updateUrl =
                  typeof data.updateUrl === "string" ? data.updateUrl : null;
              } else {
                Logger.log(
                  "Version check response missing 'version' field or invalid format.",
                  0
                );
                State.stats.latestVersion = null; // Clear old data
                State.stats.updateUrl = null;
              }
            } catch (e) {
              Logger.log(`Error parsing version data: ${e.message}`, 0);
              State.stats.latestVersion = null;
              State.stats.updateUrl = null;
            }
          } else {
            // Log non-200 responses as errors, but don't spam if it's a persistent 404 etc.
            Logger.log(
              `Version check failed: HTTP Status ${response.status}`,
              0
            );
            State.stats.latestVersion = null;
            State.stats.updateUrl = null;
          }
          // Update UI based on fetched data (or lack thereof)
          this.updateUIAfterCheck();
        },
        onerror: (error) => {
          // Update last check time even on network errors to prevent rapid retries
          GM_setValue(CONFIG.STORAGE_KEYS.LAST_VERSION_CHECK, currentTime);
          State.stats.lastVersionCheck = currentTime;
          Logger.log(
            `Error during version check request: ${
              error.statusText || "Network Error"
            }`,
            0
          );
          // Clear potentially stale version info on error
          State.stats.latestVersion = null;
          State.stats.updateUrl = null;
          this.updateUIAfterCheck(); // Update UI to show no update available
        },
        ontimeout: () => {
          // Update last check time on timeout
          GM_setValue(CONFIG.STORAGE_KEYS.LAST_VERSION_CHECK, currentTime);
          State.stats.lastVersionCheck = currentTime;
          Logger.log("Version check timed out.", 0);
          // Clear potentially stale version info on timeout
          State.stats.latestVersion = null;
          State.stats.updateUrl = null;
          this.updateUIAfterCheck();
        },
      });
    },

    /**
     * Updates the UI version info element based on stored version check results in State.stats.
     */
    updateUIAfterCheck: function () {
      // Ensure UI elements have been created before attempting to update
      if (State.ui.elements.versionInfo) {
        UI.updateVersionInfo(State.stats.latestVersion, State.stats.updateUrl);
      } else {
        Logger.log("Version UI element not ready, skipping update display.", 2); // Verbose
      }
    },
  };

  // ====================================
  // Module: Initialization
  // ====================================
  const Initialization = {
    /**
     * Initialize the entire script: Age bypass, UI, Loop logic, Menu commands.
     */
    init: function () {
      // 1. Run Age Verification Bypass Early - runs on all matched pages
      // This needs to run before DOMContentLoaded sometimes for best effect
      AgeVerificationBypass.init();

      // 2. Skip main UI/Loop logic if running inside an iframe
      if (window.top !== window.self) {
        Logger.log(
          "Wishlist Looper running in iframe, main features skipped.",
          1
        );
        return;
      }

      // --- Top-level window initialization ---
      Logger.log(
        `Steam Infinite Wishlister v${CONFIG.CURRENT_VERSION} Initializing (Top Window)...`,
        0
      );

      // 3. Initialize main functionality once the DOM is ready
      const initializeMainComponents = () => {
        Logger.log("DOM ready, initializing main components.", 1);

        // Add UI controls (creates elements and updates based on current state)
        UI.addControls();

        // Perform initial check of page state and handle auto-start/restart logic
        this.handleInitialPageState();

        // Check for script updates (uses interval logic internally)
        VersionChecker.checkForUpdates();

        // Register userscript menu commands for easy access
        this.registerMenuCommands();

        Logger.log("Initialization complete.", 0);

        // Set initial status message if loop didn't auto-start
        if (State.loop.state === "Stopped" && State.ui.elements.status) {
          // Check if status is still 'Initializing' before setting to 'Stopped'
          if (State.ui.elements.status.textContent.includes("Initializing")) {
            UI.updateStatusText("Stopped.");
          }
        }
      };

      // Execute main initialization when the DOM is interactive or complete
      if (
        document.readyState === "complete" ||
        document.readyState === "interactive"
      ) {
        // Use setTimeout to ensure it runs after the current execution stack, allowing other scripts potentially
        setTimeout(initializeMainComponents, 0);
      } else {
        // Wait for DOMContentLoaded if the DOM isn't ready yet
        window.addEventListener("DOMContentLoaded", initializeMainComponents, {
          once: true,
        });
      }
    },

    /**
     * Checks the initial page state (URL, queue elements) and decides whether to
     * trigger auto-start or auto-restart based on user settings.
     */
    handleInitialPageState: function () {
      // Determine page context
      const isOnAppPage = window.location.pathname.includes("/app/");
      const isOnExplorePage = window.location.pathname.includes("/explore");

      // Check queue elements carefully
      const queueContainer = document.querySelector(
        CONFIG.SELECTORS.queueStatus.container
      );
      const queueEmptyContainer = document.querySelector(
        CONFIG.SELECTORS.queueStatus.emptyContainer
      );
      // Check visibility using offsetParent, which is more reliable than style checks
      const isQueueVisible = !!queueContainer?.offsetParent;
      const isEmptyMessageVisible = !!queueEmptyContainer?.offsetParent;

      Logger.log(
        `Initial Page State: App=${isOnAppPage}, Explore=${isOnExplorePage}, QueueVisible=${isQueueVisible}, EmptyMsgVisible=${isEmptyMessageVisible}, AutoStart=${State.settings.autoStartEnabled}, AutoRestart=${State.settings.autoRestartQueueEnabled}`,
        1
      );

      // Condition 1: Auto-Restart finished queue (Empty message is visible)
      if (
        State.settings.autoStartEnabled &&
        State.settings.autoRestartQueueEnabled &&
        isEmptyMessageVisible
      ) {
        Logger.log(
          "Initial state: Queue finished/empty. Auto-restarting queue...",
          0
        );
        UI.updateStatusText("Queue empty, auto-restarting...", "action");
        // Use a slight delay to ensure page scripts (like DiscoveryQueue) might be ready
        setTimeout(() => {
          QueueNavigation.generateNewQueue().then((success) => {
            if (success && State.loop.state === "Stopped") {
              // If generation was initiated and loop is stopped, maybe auto-start it now?
              // Check state again after delay in case generation fails quickly
              setTimeout(() => {
                if (State.loop.state === "Stopped") {
                  Logger.log("Queue generation initiated, starting loop.", 1);
                  LoopController.startLoop();
                }
              }, CONFIG.TIMING.QUEUE_GENERATION_DELAY + 500);
            } else if (!success) {
              Logger.log("Auto-restart failed to initiate generation.", 0);
              // generateNewQueue handles stopping after max failures
            }
          });
        }, CONFIG.TIMING.INITIAL_START_DELAY / 2); // Shorter delay for restart attempt
      }
      // Condition 2: Auto-Start on explore page where queue needs starting (Explore page, no visible queue, no empty message)
      else if (
        State.settings.autoStartEnabled &&
        isOnExplorePage &&
        !isQueueVisible &&
        !isEmptyMessageVisible
      ) {
        Logger.log(
          "Initial state: On explore page, queue needs starting. Auto-starting queue generation...",
          0
        );
        UI.updateStatusText("On explore, auto-starting queue...", "action");
        setTimeout(() => {
          QueueNavigation.generateNewQueue().then((success) => {
            if (success && State.loop.state === "Stopped") {
              // Similar to above, start loop after generation initiated
              setTimeout(() => {
                if (State.loop.state === "Stopped") {
                  Logger.log("Queue generation initiated, starting loop.", 1);
                  LoopController.startLoop();
                }
              }, CONFIG.TIMING.QUEUE_GENERATION_DELAY + 500);
            } else if (!success) {
              Logger.log(
                "Auto-start failed to initiate generation from explore.",
                0
              );
            }
          });
        }, CONFIG.TIMING.INITIAL_START_DELAY / 2);
      }
      // Condition 3: Auto-Start on a valid, active queue page (app page OR explore page with visible queue)
      else if (
        State.settings.autoStartEnabled &&
        (isOnAppPage || (isOnExplorePage && isQueueVisible))
      ) {
        // Check if essential interaction elements are present before auto-starting
        const canInteract =
          document.querySelector(CONFIG.SELECTORS.wishlist.addButton) ||
          document.querySelector(CONFIG.SELECTORS.queueNav.nextButton)
            ?.offsetParent ||
          document.querySelector(
            CONFIG.SELECTORS.queueNav.ignoreButtonInContainer
          );
        if (canInteract) {
          Logger.log(
            "Initial state: On valid & active queue page. Auto-starting loop...",
            0
          );
          // Delay start slightly to allow page scripts to fully load
          setTimeout(
            LoopController.startLoop,
            CONFIG.TIMING.INITIAL_START_DELAY
          );
        } else {
          Logger.log(
            "Initial state: On potential queue page, but interaction elements missing. Auto-start aborted.",
            1
          );
          UI.updateStatusText("Stopped (Invalid state?).");
        }
      }
      // Condition 4: No auto-start conditions met
      else {
        if (!State.settings.autoStartEnabled) {
          Logger.log("Initial state: Auto-start disabled.", 1);
        } else {
          // Log reason if auto-start is on but conditions aren't met
          if (!isOnAppPage && !isOnExplorePage) {
            Logger.log(
              `Initial state: Not on a recognised auto-start page (Path: ${window.location.pathname}).`,
              1
            );
          } else if (
            isOnExplorePage &&
            !isQueueVisible &&
            isEmptyMessageVisible
          ) {
            // Covered by case 1, but log here if somehow missed
            Logger.log(
              `Initial state: On explore page, queue empty, auto-restart disabled or failed.`,
              1
            );
          } else {
            // Other edge cases
            Logger.log(
              `Initial state: Conditions for auto-start not met (Explore=${isOnExplorePage}, QueueVisible=${isQueueVisible}, Empty=${isEmptyMessageVisible}).`,
              1
            );
          }
        }
        // Ensure UI reflects stopped state if not auto-starting
        if (
          State.loop.state === "Stopped" &&
          State.ui.elements.status &&
          State.ui.elements.status.textContent.includes("Initializing")
        ) {
          UI.updateStatusText("Stopped.");
        }
      }
    },

    /**
     * Register menu commands for userscript manager (e.g., Tampermonkey menu).
     * Dynamically updates labels based on current settings.
     */
    registerMenuCommands: function () {
      // Clear existing commands if necessary (Tampermonkey usually handles this, but good practice)
      // Note: GM_unregisterMenuCommand is not standard, so we rely on Tampermonkey's replacement behavior.

      GM_registerMenuCommand(
        "[Wishlister] Start / Resume Loop",
        LoopController.startLoop,
        "r" // Access key 'r' for Resume/Run
      );
      GM_registerMenuCommand(
        "[Wishlister] Pause Loop",
        LoopController.pauseLoop,
        "p" // Access key 'p' for Pause
      );
      GM_registerMenuCommand(
        "[Wishlister] Stop Loop (Keep Auto Settings)",
        () => LoopController.stopLoop(true), // Stop but keep settings
        "k" // Access key 'k' for Keep
      );
      GM_registerMenuCommand(
        "[Wishlister] Stop Loop & Disable Auto",
        () => LoopController.stopLoop(false), // Stop AND disable settings
        "s" // Access key 's' for Stop
      );
      GM_registerMenuCommand(
        "[Wishlister] Process Current Item Once",
        QueueProcessor.processOnce,
        "o" // Access key 'o' for Once
      );
      GM_registerMenuCommand(
        "[Wishlister] Skip Current Item",
        QueueProcessor.skipItem,
        "i" // Access key 'i' for Ignore/Item Skip
      );

      GM_registerMenuCommand("--- Wishlister Settings ---", () => {}); // Separator

      // Settings toggles with dynamic labels
      GM_registerMenuCommand(
        `[Wishlister] ${
          State.settings.autoStartEnabled ? "✅ Disable" : "⬜ Enable"
        } Auto-Start`,
        () => {
          SettingsManager.toggleSetting(
            CONFIG.STORAGE_KEYS.AUTO_START,
            State.settings.autoStartEnabled
          );
          this.registerMenuCommands(); // Re-register to update label
        }
      );
      GM_registerMenuCommand(
        `[Wishlister] ${
          State.settings.autoRestartQueueEnabled ? "✅ Disable" : "⬜ Enable"
        } Auto-Restart Queue`,
        () => {
          SettingsManager.toggleSetting(
            CONFIG.STORAGE_KEYS.AUTO_RESTART_QUEUE,
            State.settings.autoRestartQueueEnabled
          );
          this.registerMenuCommands(); // Re-register to update label
        }
      );
      GM_registerMenuCommand(
        `[Wishlister] ${
          State.settings.requireTradingCards ? "✅ Disable" : "⬜ Enable"
        } Require Trading Cards`,
        () => {
          SettingsManager.toggleSetting(
            CONFIG.STORAGE_KEYS.REQUIRE_CARDS,
            State.settings.requireTradingCards
          );
          this.registerMenuCommands(); // Re-register to update label
        }
      );
      GM_registerMenuCommand(
        `[Wishlister] ${
          State.settings.skipOwnedGames ? "✅ Disable" : "⬜ Enable"
        } Skip Owned Games`,
        () => {
          SettingsManager.toggleSetting(
            CONFIG.STORAGE_KEYS.SKIP_OWNED,
            State.settings.skipOwnedGames
          );
          this.registerMenuCommands(); // Re-register to update label
        }
      );
      GM_registerMenuCommand(
        `[Wishlister] ${
          State.settings.skipNonGames ? "✅ Disable" : "⬜ Enable"
        } Skip Non-Games (DLC, etc.)`,
        () => {
          SettingsManager.toggleSetting(
            CONFIG.STORAGE_KEYS.SKIP_NON_GAMES,
            State.settings.skipNonGames
          );
          this.registerMenuCommands(); // Re-register to update label
        }
      );
      GM_registerMenuCommand(
        `[Wishlister] ${
          State.settings.uiMinimized ? " R" : "➖ M"
        }estore/Minimize UI Panel`, // Use symbols for state
        () => {
          UI.toggleMinimizeUI(); // UI update handles button text, menu needs re-register
          this.registerMenuCommands(); // Re-register to update label
        },
        "m" // Access key 'm' for Minimize/Maximize
      );

      GM_registerMenuCommand("--- Wishlister Info ---", () => {}); // Separator

      GM_registerMenuCommand(
        "[Wishlister] Check for Updates Now",
        () => {
          // Reset last check time to force an update check immediately
          GM_setValue(CONFIG.STORAGE_KEYS.LAST_VERSION_CHECK, 0);
          State.stats.lastVersionCheck = 0; // Update state too
          VersionChecker.checkForUpdates(); // Trigger check
          if (State.ui.elements.status)
            UI.updateStatusText("Checking for updates...", "action");
        },
        "u" // Access key 'u' for Update
      );

      Logger.log("Menu commands registered/updated.", 1);
    },
  };

  // ====================================
  // Script Entry Point
  // ====================================
  Initialization.init();
})();
