// ==UserScript==
// @name         Cottonee's VR Clipboard
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Adds a discrete icon to the YouTube header to automatically copy video links for VR. History toggles on click.
// @author       Cottonee
// @match        *://www.youtube.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @icon         data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAABJpO3/TKfr/xgZGQMAAAAAAQECFqKxyP6vw+X/sMTl/6/E5P+htN7/scTj/36OpP9WZLv/H1R0/xhTcf9ZsOr/XLTq/xdqvf8YGBkBNz1GyrDE5f+vxOX/s8fm/zRLsv9FYN3/l6nV/7LE5P+xxOX/fIeU/yVSdP8gVHL/Xrbr/1Ow6f8HT47/ICooQ7HD5f+xxOP/r8Tj/5Giw/8bHYX/Fhp//yItmv9GYeX/ssXk/7DE5P8xPUz/IU1s/2C65/9et+b/CzRZ/6q65v+ktuf/q77l/7DD5f+xxOT/sMTl/7DE5f+yxOX/XWqg/7DE5f+vxOP/scTl/xArQP9lv+X/Zr7k/z1Ga/+Upuz/j6Pt/5mt6v+sveX/r8Tk/7DE5P+vxOT/r8Tk/6/E4/+vxOX/sMTl/7DE5f9jc7v/acHk/2Syz/+svef/lKXs/46g6/+Yqur/qLnn/6/E5P+outb/r8Tk/7DD5P+tveb/qbvm/6q95f+uweP/YHG2/2zE4/9EY43/scPl/66+5f+ouOD/p7nm/7DB5f+wxOX/mKrc/7DE5f+tv+X/obPp/5Wo7P+RpO3/mKrs/1Bpqf9rw+L/HCRV/0lCWP/Nztb/FgkB/xQNAv+nrsH/sMTl/7HE5f9Wh7z/sMPj/6a55/+Xqev/j6Ds/5Oj6/9Ha5//bcXj/0NQkv+Lmr7/AgEF/wEBAf8BAQL/T2Ke/7DE5f95stP/aout/7DF5f/KzNv/WWeM/6/C6f+qu+j/S3yo/27H4/8xTo//ssTl/zhojP+aq87/iZrO/z9Rkf9AWn7/ba/c/42nvf9ebaX/Wk9t/0I9P/8aEQP/Pjk4/02Jsf9uyuT/NmqR/7LE5f9BmNH/lqTC/3mIu/8bMlr/YL3e/3bI5P+ru9r/NESM/7fL6P8BAAD/AQEB/wAAAf9Jf5X/bs3k/2fD1f+tvuT/QKTY/6G04v+SsM3/R5Os/2zO5f960OX/mafd/7LC5f9WdJT/sMTl/7DE5f+zxej/bcDb/3DO5f9y0+f/TV6w/0qy3f9EUo//UZa6/2/R5v9u0eb/b9Dm/3CCy/+2x+b/Sn+R/6a2zP+hsd7/VKrX/1KVpv9v0Ob/cdHm/x07eP9dxOP/CVuZ/2XE1v9sz+X/bdHn/23R5v9HV6X/asHU/1GQov85XYf/d8nh/zug0/9jssT/b9Ln/3DR5v8KXaD/cNHn/xOG0v9x1Of/bdHo/4TT5v9u0+j/CBUk/3HR5v8ha5T/BVmM/3HO5P8kdaf/cdHm/wADdf+O1uf/NqLc/3bT5/9Ntt3/bdLn/3HR5/9w0ef/ac7n/wxNfv9v0eb/bM7g/3HS5/9v0eb/aMXV/wUJkP8BBZL/OAAAACAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==
// @downloadURL https://update.greasyfork.org/scripts/547407/Cottonee%27s%20VR%20Clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/547407/Cottonee%27s%20VR%20Clipboard.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // --- CONFIGURATION ---
  const MAX_HISTORY_SIZE = 10;
  const UI_TARGET_SELECTOR = "ytd-masthead #end"; // A stable target for UI injection

  // --- STATE MANAGEMENT ---
  let isEnabled = GM_getValue("isEnabled", true);
  // History now stores objects: { url: string, timestamp: number }
  let linkHistory = GM_getValue("linkHistory", []);
  let lastCopiedUrl = "";
  let isDropdownOpen = false;

  // --- UI ELEMENTS ---
  let clipboardContainer, toggleSwitch, historyList, statusMessage, iconWrapper, historyDropdown;

  /**
   * Helper function to format a timestamp into a human-readable string.
   */
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const options = {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleDateString(undefined, options);
  }

  /**
   * Transforms old history (array of strings) to new format (array of objects).
   * This handles existing users who update the script.
   */
  function migrateHistoryIfNecessary(history) {
    if (history.length === 0) return [];
    if (typeof history[0] === "string") {
      // Old format detected (array of URLs)
      console.log("Cottonee's VR Clipboard: Migrating old history format...");
      return history.map((url) => ({
        url: url,
        timestamp: Date.now(), // Use current time as a reasonable default
      }));
    }
    return history; // Already in new format
  }

  /**
   * Injects the CSS for the GUI.
   */
  function addStyles() {
    GM_addStyle(`
      #cottonees-clipboard {
        position: relative;
        display: flex;
        align-items: center;
        margin-right: 8px; /* Standard YouTube button spacing */
        font-family: 'Roboto', Arial, sans-serif;
        user-select: none;
      }
      .cc-icon-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background-color: transparent;
        border-radius: 50%;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }
      .cc-icon-wrapper:hover {
        background-color: var(--yt-spec-badge-chip-background, #3f3f3f);
      }
      /* Ensure the image fits within its wrapper */
      .cc-icon-wrapper img {
        width: 24px;
        height: 24px;
        /* Optional: Add some padding if the icon appears too large */
        /* padding: 2px; */
      }
      .cc-history-dropdown {
        display: none; /* Hidden by default, toggled by JS */
        position: absolute;
        top: 50px; /* Position below the icon */
        right: 0;
        width: 300px;
        background-color: #282828;
        border: 1px solid #4a4a4a; /* Slightly lighter border */
        border-radius: 12px;
        padding: 12px 15px; /* More generous padding */
        z-index: 9999;
        box-shadow: 0 6px 16px rgba(0,0,0,0.6); /* Enhanced shadow */
      }
      .cc-history-dropdown.open {
        display: block;
      }
      .cc-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px; /* More space */
        padding-bottom: 8px; /* Separator for header */
        border-bottom: 1px solid #4a4a4a; /* Subtle line */
      }
      .cc-title {
        font-weight: 500;
        font-size: 15px; /* Slightly larger title */
        color: #e0e0e0; /* Slightly brighter text */
      }
      .cc-status {
        font-size: 13px; /* Slightly larger status message */
        color: #d1b4ff; /* Purple for copied status! */
        height: 18px; /* Reserve space to prevent layout shifts */
        text-align: right;
        min-width: 60px; /* Ensure space for longer messages */
        font-weight: 500;
      }
      .cc-history-list {
        max-height: 220px;
        overflow-y: auto;
        padding-top: 5px; /* Space from separator */
      }
      .cc-history-list::-webkit-scrollbar {
        width: 8px;
      }
      .cc-history-list::-webkit-scrollbar-track {
        background: #383838;
        border-radius: 4px;
      }
      .cc-history-list::-webkit-scrollbar-thumb {
        background: #555;
        border-radius: 4px;
      }
      .cc-history-list::-webkit-scrollbar-thumb:hover {
        background: #666;
      }
      .cc-history-item {
        padding: 6px 6px; /* Adjusted padding for timestamp */
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        border-radius: 6px; /* Smoother corners */
        cursor: pointer;
        transition: background-color 0.2s ease, color 0.2s ease;
        color: #eeeeee; /* Brighter default text */
        display: flex; /* Use flexbox for timestamp and link */
        flex-direction: column;
        line-height: 1.3;
      }
      .cc-history-item:hover {
        background-color: #4a3070; /* Purple hover background */
        color: #ffffff; /* White text on hover for contrast */
      }
      .cc-history-list > div:not(:last-child).cc-history-item {
        margin-bottom: 4px; /* Spacing between items */
      }
      .cc-history-timestamp {
        font-size: 10px; /* Smaller timestamp */
        color: #999; /* Grey timestamp */
        margin-bottom: 2px; /* Space between timestamp and link */
      }
      .cc-history-url-text {
        flex-grow: 1;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* Toggle Switch CSS (with purple accent) */
      .cc-switch {
        position: relative;
        display: inline-block;
        width: 38px; /* Slightly wider */
        height: 22px; /* Slightly taller */
      }
      .cc-switch input { display: none; }
      .cc-slider {
        position: absolute;
        cursor: pointer;
        top: 0; left: 0; right: 0; bottom: 0;
        background-color: #666; /* Slightly darker grey when off */
        transition: .4s;
        border-radius: 22px; /* Matches height */
      }
      .cc-slider:before {
        position: absolute;
        content: "";
        height: 16px; width: 16px; /* Larger handle */
        left: 3px; bottom: 3px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
      }
      input:checked + .cc-slider { background-color: #8a2be2; } /* Vibrant purple when on */
      input:checked + .cc-slider:before { transform: translateX(16px); } /* Adjust translation for new width */
    `);
  }

  /**
   * Creates and injects the GUI into the page.
   */
  function createGUI(parentElement) {
    if (document.getElementById("cottonees-clipboard")) return; // Prevent duplicates

    clipboardContainer = document.createElement("div");
    clipboardContainer.id = "cottonees-clipboard";

    // Use an <img> tag for the ICO icon with the correct MIME type
    const iconBase64 = "data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAABJpO3/TKfr/xgZGQMAAAAAAQECFqKxyP6vw+X/sMTl/6/E5P+htN7/scTj/36OpP9WZLv/H1R0/xhTcf9ZsOr/XLTq/xdqvf8YGBkBNz1GyrDE5f+vxOX/s8fm/zRLsv9FYN3/l6nV/7LE5P+xxOX/fIeU/yVSdP8gVHL/Xrbr/1Ow6f8HT47/ICooQ7HD5f+xxOP/r8Tj/5Giw/8bHYX/Fhp//yItmv9GYeX/ssXk/7DE5P8xPUz/IU1s/2C65/9et+b/CzRZ/6q65v+ktuf/q77l/7DD5f+xxOT/sMTl/7DE5f+yxOX/XWqg/7DE5f+vxOP/scTl/xArQP9lv+X/Zr7k/z1Ga/+Upuz/j6Pt/5mt6v+sveX/r8Tk/7DE5P+vxOT/r8Tk/6/E4/+vxOX/sMTl/7DE5f9jc7v/acHk/2Syz/+svef/lKXs/46g6/+Yqur/qLnn/6/E5P+outb/r8Tk/7DD5P+tveb/qbvm/6q95f+uweP/YHG2/2zE4/9EY43/scPl/66+5f+ouOD/p7nm/7DB5f+wxOX/mKrc/7DE5f+tv+X/obPp/5Wo7P+RpO3/mKrs/1Bpqf9rw+L/HCRV/0lCWP/Nztb/FgkB/xQNAv+nrsH/sMTl/7HE5f9Wh7z/sMPj/6a55/+Xqev/j6Ds/5Oj6/9Ha5//bcXj/0NQkv+Lmr7/AgEF/wEBAf8BAQL/T2Ke/7DE5f95stP/aout/7DF5f/KzNv/WWeM/6/C6f+qu+j/S3yo/27H4/8xTo//ssTl/zhojP+aq87/iZrO/z9Rkf9AWn7/ba/c/42nvf9ebaX/Wk9t/0I9P/8aEQP/Pjk4/02Jsf9uyuT/NmqR/7LE5f9BmNH/lqTC/3mIu/8bMlr/YL3e/3bI5P+ru9r/NESM/7fL6P8BAAD/AQEB/wAAAf9Jf5X/bs3k/2fD1f+tvuT/QKTY/6G04v+SsM3/R5Os/2zO5f960OX/mafd/7LC5f9WdJT/sMTl/7DE5f+zxej/bcDb/3DO5f9y0+f/TV6w/0qy3f9EUo//UZa6/2/R5v9u0eb/b9Dm/3CCy/+2x+b/Sn+R/6a2zP+hsd7/VKrX/1KVpv9v0Ob/cdHm/x07eP9dxOP/CVuZ/2XE1v9sz+X/bdHn/23R5v9HV6X/asHU/1GQov85XYf/d8nh/zug0/9jssT/b9Ln/3DR5v8KXaD/cNHn/xOG0v9x1Of/bdHo/4TT5v9u0+j/CBUk/3HR5v8ha5T/BVmM/3HO5P8kdaf/cdHm/wADdf+O1uf/NqLc/3bT5/9Ntt3/bdLn/3HR5/9w0ef/ac7n/wxNfv9v0eb/bM7g/3HS5/9v0eb/aMXV/wUJkP8BBZL/OAAAACAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="

    clipboardContainer.innerHTML = `
      <div class="cc-icon-wrapper" title="Cottonee's VR Clipboard - Click to Toggle History">
        <img src="${iconBase64}" alt="Cottonee's VR Clipboard Icon"/>
      </div>
      <div class="cc-history-dropdown">
        <div class="cc-header">
          <span class="cc-title">Cottonee's VR Clipboard</span>
          <label class="cc-switch">
            <input type="checkbox" id="cc-toggle">
            <span class="cc-slider"></span>
          </label>
        </div>
        <div class="cc-status" id="cc-status-message"></div>
        <div class="cc-history-list" id="cc-history-list"></div>
      </div>
    `;

    parentElement.insertBefore(clipboardContainer, parentElement.firstChild);

    // Assign element references
    iconWrapper = clipboardContainer.querySelector(".cc-icon-wrapper");
    historyDropdown = clipboardContainer.querySelector(".cc-history-dropdown");
    toggleSwitch = document.getElementById("cc-toggle");
    historyList = document.getElementById("cc-history-list");
    statusMessage = document.getElementById("cc-status-message");

    // Set initial state
    toggleSwitch.checked = isEnabled;
    updateHistoryUI();

    // Event Listeners
    iconWrapper.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent document click from closing immediately
      toggleDropdown();
    });

    toggleSwitch.addEventListener("change", () => {
      isEnabled = toggleSwitch.checked;
      GM_setValue("isEnabled", isEnabled);
      showStatusMessage(isEnabled ? "Enabled" : "Disabled");
    });

    historyList.addEventListener("click", (e) => {
      // Find the closest history item to the clicked element
      const historyItem = e.target.closest(".cc-history-item");
      if (historyItem && historyItem.dataset.url) { // Ensure dataset.url exists
        // Ensure we copy the URL from the dataset
        navigator.clipboard.writeText(historyItem.dataset.url).then(() => {
          showStatusMessage("Copied!");
        });
      }
    });

    // Close dropdown if clicking outside
    document.addEventListener("click", (e) => {
      if (isDropdownOpen && !clipboardContainer.contains(e.target)) {
        closeDropdown();
      }
    });
  }

  /**
   * Toggles the visibility of the history dropdown.
   */
  function toggleDropdown() {
    isDropdownOpen = !isDropdownOpen;
    historyDropdown.classList.toggle("open", isDropdownOpen);
  }

  /**
   * Closes the history dropdown.
   */
  function closeDropdown() {
    isDropdownOpen = false;
    historyDropdown.classList.remove("open");
  }

  /**
   * Updates the history list in the UI.
   */
  function updateHistoryUI() {
    if (!historyList) return; // Ensure element exists
    historyList.innerHTML = "";
    if (linkHistory.length === 0) {
      historyList.innerHTML =
        '<div style="color:#888; font-size:12px; padding: 4px;">History is empty.</div>';
      return;
    }
    // Display newest links first
    [...linkHistory].reverse().forEach((item) => {
      // item is now { url: string, timestamp: number }
      const div = document.createElement("div");
      div.className = "cc-history-item";
      div.title = `Click to copy: ${item.url}`; // Full URL on hover tooltip
      div.dataset.url = item.url; // Store full URL for copying

      const timestampSpan = document.createElement("span");
      timestampSpan.className = "cc-history-timestamp";
      timestampSpan.textContent = formatTimestamp(item.timestamp);
      div.appendChild(timestampSpan);

      const urlSpan = document.createElement("span");
      urlSpan.className = "cc-history-url-text";
      urlSpan.textContent = item.url.replace("https://www.", ""); // Display a cleaner version
      div.appendChild(urlSpan);

      historyList.appendChild(div);
    });
  }

  /**
   * Shows a temporary message in the status area.
   */
  function showStatusMessage(message) {
    if (!statusMessage) return; // Ensure element exists
    statusMessage.textContent = message;
    setTimeout(() => {
      // Only clear if the message hasn't been replaced by a new one
      if (statusMessage.textContent === message) {
        statusMessage.textContent = "";
      }
    }, 1500);
  }

  /**
   * The main logic to check, clean, and copy the URL.
   */
  function processUrl() {
    if (!isEnabled) return;

    const currentUrl = window.location.href;
    // Only process video pages (watch?v=)
    if (!currentUrl.includes("watch?v=")) return;

    const urlObj = new URL(currentUrl);
    const videoId = urlObj.searchParams.get("v");
    if (!videoId) return;

    // Construct the clean, canonical YouTube video URL
    const cleanUrl = `https://www.youtube.com/watch?v=${videoId}`;

    // Only copy and update history if the URL is different from the last one
    if (cleanUrl !== lastCopiedUrl) {
      lastCopiedUrl = cleanUrl;

      navigator.clipboard.writeText(cleanUrl).then(() => {
        showStatusMessage("Copied!");

        const newHistoryItem = {
          url: cleanUrl,
          timestamp: Date.now(), // Store current timestamp
        };

        // Update history: remove existing entry if its URL is present, then add to end
        // Need to check by URL property now
        const existingIndex = linkHistory.findIndex((item) => item.url === cleanUrl);
        if (existingIndex > -1) {
          linkHistory.splice(existingIndex, 1);
        }
        linkHistory.push(newHistoryItem);

        // Enforce maximum history size
        if (linkHistory.length > MAX_HISTORY_SIZE) {
          linkHistory.shift(); // Remove the oldest item
        }

        GM_setValue("linkHistory", linkHistory); // Persist history
        updateHistoryUI(); // Refresh the UI display
      });
    }
  }

  /**
   * Waits for a specific element to appear in the DOM and then executes a callback.
   * Uses MutationObserver for efficiency.
   */
  function waitForElement(selector, callback) {
    // Check immediately in case the element is already there
    let targetElement = document.querySelector(selector);
    if (targetElement) {
      callback(targetElement);
      return;
    }

    const observer = new MutationObserver((mutations, obs) => {
      targetElement = document.querySelector(selector);
      if (targetElement) {
        obs.disconnect(); // Stop observing once found
        callback(targetElement);
      }
    });

    // Start observing the body for childList changes and subtree for deep changes
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // --- INITIALIZATION ---
  // Migrate history format immediately after retrieving it
  linkHistory = migrateHistoryIfNecessary(linkHistory);
  GM_setValue("linkHistory", linkHistory); // Save migrated history

  addStyles();
  waitForElement(UI_TARGET_SELECTOR, (targetElement) => {
    createGUI(targetElement);
    // Initial check for the URL on page load, with a slight delay
    // to ensure YouTube's JS has processed the initial video.
    setTimeout(processUrl, 1500);
  });

  // Listen for YouTube's custom navigation event (for SPA updates)
  window.addEventListener("yt-navigate-finish", processUrl);
})();