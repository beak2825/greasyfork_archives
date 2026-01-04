// ==UserScript==
// @name         ChatGPT Message Tracker
// @namespace    http://tampermonkey.net/
// @version      1.4.4
// @description  Tracks and displays ChatGPT message usage based on model limits, with a toggle button to reopen the info panel. Adds support for gpt-4 model, makes model usage collapsible, and persists collapse state between page reloads.
// @author       @MartianInGreen
// @license      MIT
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508887/ChatGPT%20Message%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/508887/ChatGPT%20Message%20Tracker.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Check if we're in an artefact context
  if (window.location.href.includes('/artefact') || window.parent !== window) {
    return; // Exit early if we're in an artefact or iframe
  }

  /***********************
   * Configuration
   ***********************/

  // Define the target URL to monitor
  const TARGET_URL = "https://chatgpt.com/backend-api/conversation";

  // Define model limits and rolling window durations (in milliseconds)
  const MODEL_LIMITS = {
    "gpt-4o": {
      limit: 80,
      window: 3 * 60 * 60 * 1000, // 3 hours
      unlimited: false,
    },
    "gpt-4o-mini": {
      limit: Infinity,
      window: 3 * 60 * 60 * 1000, // 3 hours
      unlimited: true,
    },
    "o1-preview": {
      limit: 50,
      window: 7 * 24 * 60 * 60 * 1000, // 1 week
      unlimited: false,
    },
    "o1-mini": {
      limit: 50,
      window: 24 * 60 * 60 * 1000, // 1 day
      unlimited: false,
    },
    // Added gpt-4 model
    "gpt-4": {
      limit: 40,
      window: 3 * 60 * 60 * 1000, // 3 hours
      unlimited: false,
    },
  };

  // LocalStorage keys
  const STORAGE_KEY = "chatgpt_message_tracker";
  const COLLAPSE_STATE_KEY = "chatgpt_message_tracker_collapse_state";

  /***********************
   * Utility Functions
   ***********************/

  /**
   * Retrieves the stored data from localStorage.
   * @returns {Object} The stored data or an empty object.
   */
  function getStoredData() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  }

  /**
   * Saves the data to localStorage.
   * @param {Object} data The data to store.
   */
  function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  /**
   * Retrieves the collapse state from localStorage.
   * @returns {Object} The collapse state or an empty object.
   */
  function getCollapseState() {
    const state = localStorage.getItem(COLLAPSE_STATE_KEY);
    return state ? JSON.parse(state) : {};
  }

  /**
   * Saves the collapse state to localStorage.
   * @param {Object} state The state to store.
   */
  function saveCollapseState(state) {
    localStorage.setItem(COLLAPSE_STATE_KEY, JSON.stringify(state));
  }

  /**
   * Cleans up old timestamps based on the rolling window.
   * @param {Array<number>} timestamps Array of timestamp numbers.
   * @param {number} window Duration in milliseconds.
   * @returns {Array<number>} Cleaned array of timestamps.
   */
  function cleanTimestamps(timestamps, window) {
    const now = Date.now();
    return timestamps.filter((timestamp) => now - timestamp <= window);
  }

  /**
   * Formats remaining time for display.
   * @param {number} ms Milliseconds.
   * @returns {string} Formatted time string.
   */
  function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    let parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);
    return parts.join(" ");
  }

  /***********************
   * Data Tracking
   ***********************/

  // Initialize or retrieve stored data
  let usageData = getStoredData();

  /**
   * Logs a message sent using a specific model.
   * @param {string} model The model used.
   */
  function logMessage(model) {
    if (!(model in MODEL_LIMITS)) return; // Ignore unknown models

    const now = Date.now();

    // Initialize usage arrays if not present
    if (!usageData[model]) {
      usageData[model] = [];
    }

    // Log the message for the specific model
    usageData[model].push(now);

    // Clean old timestamps
    const window = MODEL_LIMITS[model].window;
    if (window > 0) {
      usageData[model] = cleanTimestamps(usageData[model], window);
    }

    // If the model is gpt-4, also log it towards gpt-4o
    if (model === "gpt-4") {
      logGpt4oMessage(now);
    }

    // Save updated data
    saveData(usageData);

    // Update UI
    updateUI();
  }

  function logGpt4oMessage(timestamp) {
    const gpt4oModel = "gpt-4o";
    if (!usageData[gpt4oModel]) {
      usageData[gpt4oModel] = [];
    }
    usageData[gpt4oModel].push(timestamp);
    const gpt4oWindow = MODEL_LIMITS[gpt4oModel].window;
    usageData[gpt4oModel] = cleanTimestamps(usageData[gpt4oModel], gpt4oWindow);
  }
  
  /***********************
   * Network Interception
   ***********************/

  /**
   * Intercepts fetch calls.
   */
  (function () {
    const originalFetch = window.fetch;
    window.fetch = function (...args) {
      const [resource, config] = args;
      if (typeof resource === "string" && resource === TARGET_URL) {
        // Clone the request to read the body
        return originalFetch.apply(this, args).then((response) => {
          if (config && config.method === "POST" && config.body) {
            try {
              const body = JSON.parse(config.body);
              let modelToLog = body.model;
          
              // Check for gizmo_interaction
              if (body.conversation_mode && body.conversation_mode.kind === "gizmo_interaction") {
                modelToLog = "gpt-4o";
              }
          
              if (modelToLog) {
                logMessage(modelToLog);
              }
            } catch (e) {
              console.error("Failed to parse fetch request body:", e);
            }
          }
          return response;
        });
      }
      return originalFetch.apply(this, args);
    };
  })();

  /**
   * Intercepts XMLHttpRequest calls.
   */
  (function () {
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (
      method,
      url,
      async,
      user,
      password
    ) {
      this._method = method;
      this._url = url;
      return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function (body) {
      if (this._url === TARGET_URL && this._method === "POST" && body) {
        try {
          const parsedBody = JSON.parse(body);
          const model = parsedBody.model;
          if (model) {
            logMessage(model);
          }
        } catch (e) {
          console.error("Failed to parse XHR request body:", e);
        }
      }
      return originalSend.apply(this, arguments);
    };
  })();

  /***********************
   * UI Creation
   ***********************/

  // Create the UI container
  const uiContainer = document.createElement("div");
  uiContainer.style.position = "fixed";
  uiContainer.style.bottom = "50px";
  uiContainer.style.right = "50px";
  uiContainer.style.width = "250px";
  uiContainer.style.maxHeight = "500px";
  uiContainer.style.overflowY = "auto";
  uiContainer.style.backgroundColor = "rgba(0, 0, 0, 0.85)";
  uiContainer.style.color = "#fff";
  uiContainer.style.padding = "15px";
  uiContainer.style.borderRadius = "8px";
  uiContainer.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
  uiContainer.style.zIndex = "1";
  uiContainer.style.fontFamily = "Arial, sans-serif";
  uiContainer.style.fontSize = "14px";
  uiContainer.style.cursor = "move";
  uiContainer.style.display = "none"; // Ensure it's visible initially
  uiContainer.style.left = "auto"; // Reset left and top to allow positioning
  uiContainer.style.top = "auto";

  // Add a header
  const header = document.createElement("div");
  header.textContent = "📊 Message Tracker";
  header.style.fontWeight = "bold";
  header.style.marginBottom = "10px";
  header.style.position = "relative";
  uiContainer.appendChild(header);

  // Add a close button
  const closeButton = document.createElement("span");
  closeButton.textContent = "✖";
  closeButton.style.position = "absolute";
  closeButton.style.top = "0";
  closeButton.style.right = "0";
  closeButton.style.cursor = "pointer";
  closeButton.title = "Close";
  closeButton.addEventListener("click", () => {
    uiContainer.style.display = "none";
    toggleButton.style.display = "block"; // Show the toggle button when panel is closed
  });
  header.appendChild(closeButton);

  // Add content area
  const content = document.createElement("div");
  uiContainer.appendChild(content);

  // Append to body
  document.body.appendChild(uiContainer);

  /**
   * Updates the UI with the current usage data.
   */
  function updateUI() {
    // Clear existing content
    content.innerHTML = "";

    const now = Date.now();

    // Retrieve collapse state
    const collapseState = getCollapseState();

    for (const [model, config] of Object.entries(MODEL_LIMITS)) {
      const modelName = model;
      const usage = usageData[model] || [];

      let used = 0;
      let remaining = config.limit;

      if (config.unlimited) {
        used = usage.length;
        remaining = "∞";
      } else {
        // Clean old timestamps
        const cleaned = cleanTimestamps(usage, config.window);
        if (cleaned.length !== usage.length) {
          usageData[model] = cleaned;
          saveData(usageData);
        }

        used = cleaned.length;
        remaining = config.limit - used;
        if (remaining < 0) remaining = 0;
      }

      // Calculate time until the oldest message falls out of the window
      let timeLeft = "N/A";
      if (
        !config.unlimited &&
        usageData[model] &&
        usageData[model].length > 0
      ) {
        const oldest = usageData[model][0];
        const elapsed = now - oldest;
        const windowDuration = config.window;
        if (elapsed < windowDuration) {
          const remainingTime = windowDuration - elapsed;
          timeLeft = formatTime(remainingTime);
        }
      }

      // Create a container for the model
      const modelContainer = document.createElement("div");
      modelContainer.style.marginBottom = "8px";
      modelContainer.style.borderBottom = "1px solid #444";
      modelContainer.style.paddingBottom = "8px";

      // Create the clickable header for collapsing
      const modelHeader = document.createElement("div");
      modelHeader.textContent = `Model: ${modelName}`;
      modelHeader.style.fontWeight = "bold";
      modelHeader.style.cursor = "pointer";
      modelHeader.style.display = "flex";
      modelHeader.style.justifyContent = "space-between";
      modelHeader.style.alignItems = "center";

      // Add an arrow indicator
      const arrow = document.createElement("span");
      arrow.textContent = collapseState[model] === false ? "▼" : "▶";
      arrow.style.transition = "transform 0.2s";
      modelHeader.appendChild(arrow);

      modelContainer.appendChild(modelHeader);

      // Create the details section
      const details = document.createElement("div");
      details.style.marginTop = "5px";

      const usageInfo = document.createElement("div");
      usageInfo.textContent = `Used: ${used} / ${
        config.unlimited ? "∞" : config.limit
      } messages`;
      details.appendChild(usageInfo);

      if (!config.unlimited) {
        const remainingInfo = document.createElement("div");
        remainingInfo.textContent = `Remaining: ${remaining} messages`;
        details.appendChild(remainingInfo);

        const timeInfo = document.createElement("div");
        timeInfo.textContent = `Time until reset: ${timeLeft}`;
        details.appendChild(timeInfo);
      }

      modelContainer.appendChild(details);
      content.appendChild(modelContainer);

      // Set initial display based on collapse state
      if (collapseState[model] === false) {
        details.style.display = "block";
        arrow.style.transform = "rotate(0deg)";
      } else {
        details.style.display = "none";
        arrow.style.transform = "rotate(-90deg)";
      }

      // Toggle functionality
      modelHeader.addEventListener("click", () => {
        if (details.style.display === "none") {
          details.style.display = "block";
          arrow.style.transform = "rotate(0deg)";
          collapseState[model] = false;
        } else {
          details.style.display = "none";
          arrow.style.transform = "rotate(-90deg)";
          collapseState[model] = true;
        }
        saveCollapseState(collapseState);
      });
    }
  }

  /***********************
   * UI Interactivity
   ***********************/

  // Make the UI draggable
  (function () {
    let isDragging = false;
    let startX, startY, initialX, initialY;

    header.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = uiContainer.getBoundingClientRect();
      initialX = rect.left;
      initialY = rect.top;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      e.preventDefault(); // Prevent text selection
    });

    function onMouseMove(e) {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      uiContainer.style.left = `${initialX + dx}px`;
      uiContainer.style.top = `${initialY + dy}px`;
      uiContainer.style.right = "auto";
      uiContainer.style.bottom = "auto";
    }

    function onMouseUp() {
      isDragging = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }
  })();

  /***********************
   * Toggle Button Creation
   ***********************/

  // Create the toggle button
  const toggleButton = document.createElement("button");
  toggleButton.textContent = "📊";
  toggleButton.style.fontSize = "10px";
  toggleButton.style.position = "fixed";
  toggleButton.style.bottom = "40px";
  toggleButton.style.right = "12px";
  toggleButton.style.width = "22px";
  toggleButton.style.height = "22px";
  toggleButton.style.backgroundColor = "#212121";
  toggleButton.style.color = "#fff";
  toggleButton.style.border = "2px solid #676767";
  toggleButton.style.borderRadius = "50%";
  toggleButton.style.cursor = "pointer";
  toggleButton.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
  toggleButton.style.zIndex = "12";
  toggleButton.style.display = "block"; // Correctly kept as hidden initially
  toggleButton.style.justifyContent = "center";
  toggleButton.style.alignItems = "center";

  toggleButton.addEventListener("click", () => {
    uiContainer.style.display = "block";
    toggleButton.style.display = "none";
  });

  document.body.appendChild(toggleButton);

  /***********************
   * Initial UI Update
   ***********************/

  updateUI();

  /***********************
   * Periodic Cleanup and UI Refresh
   ***********************/

  // Periodically clean old timestamps and refresh UI
  setInterval(() => {
    let dataChanged = false;
    const now = Date.now();

    for (const [model, config] of Object.entries(MODEL_LIMITS)) {
      if (!usageData[model]) continue;

      const cleaned = cleanTimestamps(usageData[model], config.window);
      if (cleaned.length !== usageData[model].length) {
        usageData[model] = cleaned;
        dataChanged = true;
      }
    }

    updateUI();

    if (dataChanged) {
      saveData(usageData);
    }
  }, 30 * 1000); // Every 30 seconds
})();
