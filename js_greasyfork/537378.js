// ==UserScript==
// @name         TradingView Script Downloader
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Complete TradingView script downloading solution with batch processing and status tracking
// @author       You
// @match        https://www.tradingview.com/script/*
// @match        https://www.tradingview.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @run-at       document-start
// @require      https://update.greasyfork.org/scripts/528234/1596455/waitForElement.js
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/537378/TradingView%20Script%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/537378/TradingView%20Script%20Downloader.meta.js
// ==/UserScript==

(async function () {
  "use strict";

  // Global configuration
  const CONFIG = {
    targetURL: "https://pine-facade.tradingview.com/pine-facade/get/PUB",
    selectors: {
      description:
        'div[class^="layout-"] > div[class^="content-"] > div[class^="description-"]',
      sourceCodeBTN: "#code",
      username: '[class^="usernameOutline-"]',
    },
    storage: {
      processedUrls: "tv_processed_urls",
      queueUrls: "tv_queue_urls",
      currentIndex: "tv_current_index",
    },
  };

  // State variables
  let descriptionContent = "[NOT FOUND]";
  let username = "[NOT FOUND]";
  let isProcessing = false;

  // Utility functions
  function extractIdFromUrl(url) {
    try {
      console.log("[Debug] Extracting ID from URL:", url);
      const decodedUrl = new URL(decodeURIComponent(url)).pathname;
      const parts = decodedUrl.split(";");
      const extractedId = parts.length > 1 ? parts[1].split("/")[0] : null;
      console.log("[Debug] Extracted ID:", extractedId);
      return extractedId;
    } catch (e) {
      console.log("[URL Parsing Error]", e);
      return null;
    }
  }

  function sanitizeFilename(filename) {
    return filename.replace(/[<>:"\/\\|?*]/g, " ").trim();
  }

  function downloadFile(filename, content) {
    const safeFilename = sanitizeFilename(filename);
    const blob = new Blob([content], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = safeFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  }

  function saveProcessedUrl(url) {
    const processed = GM_getValue(CONFIG.storage.processedUrls, {});
    processed[url] = {
      timestamp: Date.now(),
      status: "completed",
    };
    GM_setValue(CONFIG.storage.processedUrls, processed);
  }

  function isUrlProcessed(url) {
    const processed = GM_getValue(CONFIG.storage.processedUrls, {});
    return !!processed[url];
  }

  function getQueuedUrls() {
    return GM_getValue(CONFIG.storage.queueUrls, []);
  }

  function setQueuedUrls(urls) {
    GM_setValue(CONFIG.storage.queueUrls, urls);
  }

  function getCurrentIndex() {
    return GM_getValue(CONFIG.storage.currentIndex, 0);
  }

  function setCurrentIndex(index) {
    GM_setValue(CONFIG.storage.currentIndex, index);
  }

  function clearQueue() {
    GM_setValue(CONFIG.storage.queueUrls, []);
    GM_setValue(CONFIG.storage.currentIndex, 0);
  }

  // XHR Hook for capturing script data
  function hookXHR() {
    if (window.xhrHooked) return; // Prevent multiple hooks
    window.xhrHooked = true;

    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
      this.addEventListener("load", function () {
        if (
          !(
            url?.includes(CONFIG.targetURL) &&
            this.readyState === 4 &&
            this.status === 200
          )
        ) {
          return;
        }

        try {
          const responseJSON = JSON.parse(this.responseText);
          const extractedId = extractIdFromUrl(url);

          if (responseJSON?.scriptName && extractedId) {
            console.log(
              `[Script Found] ${responseJSON.scriptName} | [URL] ${url}`
            );

            // Enhance response with additional data
            responseJSON.description = descriptionContent;
            responseJSON.username = username;
            responseJSON.url = location.href;
            responseJSON.downloadTime = new Date().toISOString();

            const fname = `${responseJSON.scriptName}-${extractedId}.json`;
            const data = JSON.stringify(responseJSON, null, 2);

            downloadFile(fname, data);
            saveProcessedUrl(location.href);

            GM_notification({
              text: `Downloaded: ${responseJSON.scriptName}`,
              timeout: 3000,
            });

            console.log("+++++++++++DOWNLOAD COMPLETE+++++++++++");

            // Process next URL in queue after a delay
            setTimeout(() => {
              processNextInQueue();
            }, 2000);
          }
        } catch (e) {
          console.log("[XHR JSON Parse Error]", e);
        }
      });

      return originalXHROpen.apply(this, [method, url, ...rest]);
    };
  }

  // Process individual script page
  async function processScriptPage() {
    const currentURL = location.href;

    if (isUrlProcessed(currentURL)) {
      console.log("URL already processed, skipping...");
      setTimeout(() => processNextInQueue(), 1000);
      return;
    }

    try {
      console.log("Getting page elements...");

      // Wait for elements with timeout
      const sourceCodeELM = await Promise.race([
        waitForElement(CONFIG.selectors.sourceCodeBTN),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 10000)
        ),
      ]);

      if (!sourceCodeELM) {
        console.log("Source code button not found!");
        setTimeout(() => processNextInQueue(), 1000);
        return;
      }

      // Get description and username
      try {
        const descriptionELM = await waitForElement(
          CONFIG.selectors.description
        );
        if (descriptionELM) {
          descriptionContent = descriptionELM.textContent.trim();
        }
      } catch (e) {
        console.log("Description element not found");
      }

      try {
        const usernameELM = await waitForElement(CONFIG.selectors.username);
        if (usernameELM) {
          username = usernameELM.textContent.trim();
        }
      } catch (e) {
        console.log("Username element not found");
      }

      // Click source code button periodically until XHR is captured
      let clickCount = 0;
      const maxClicks = 20;
      const clickInterval = setInterval(() => {
        if (clickCount >= maxClicks || isUrlProcessed(currentURL)) {
          clearInterval(clickInterval);
          if (!isUrlProcessed(currentURL)) {
            console.log("Max clicks reached, moving to next...");
            setTimeout(() => processNextInQueue(), 2000);
          }
          return;
        }

        sourceCodeELM.click();
        clickCount++;
        console.log(`Clicked source code button (${clickCount}/${maxClicks})`);
      }, 1500);
    } catch (error) {
      console.log("Error processing script page:", error);
      setTimeout(() => processNextInQueue(), 2000);
    }
  }

  // Process next URL in queue
  async function processNextInQueue() {
    const queuedUrls = getQueuedUrls();
    const currentIndex = getCurrentIndex();

    if (currentIndex >= queuedUrls.length) {
      console.log("✅ All URLs processed!");
      GM_notification({
        text: "All TradingView scripts processed!",
        timeout: 5000,
      });
      clearQueue();
      isProcessing = false;
      return;
    }

    const nextUrl = queuedUrls[currentIndex];
    console.log(
      `🔗 Processing (${currentIndex + 1}/${queuedUrls.length}): ${nextUrl}`
    );

    setCurrentIndex(currentIndex + 1);

    if (location.href !== nextUrl) {
      window.location.href = nextUrl;
    } else {
      // Already on the page, process it
      await processScriptPage();
    }
  }

  // Create batch processing modal
  function createBatchModal() {
    if (document.getElementById("tv-batch-modal")) return;

    const modal = document.createElement("div");
    modal.id = "tv-batch-modal";
    modal.innerHTML = `
      <div style="
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <div style="
          background: #1e1e1e;
          color: #ffffff;
          padding: 24px;
          border-radius: 12px;
          width: 95%;
          max-width: 800px;
          max-height: 90%;
          overflow: auto;
          box-shadow: 0 20px 60px rgba(0,0,0,0.6);
          border: 1px solid #333;
        ">
          <h2 style="margin-top:0; color: #4CAF50;">📊 TradingView Script Batch Downloader</h2>
          <p style="color: #ccc; margin-bottom: 16px;">Paste TradingView script URLs (one per line):</p>
          <textarea id="tv-links-input" placeholder="https://www.tradingview.com/script/..." style="
            width: 100%; 
            height: 300px; 
            font-size: 14px;
            background: #2d2d2d;
            color: #fff;
            border: 1px solid #555;
            border-radius: 6px;
            padding: 12px;
            font-family: monospace;
            resize: vertical;
          "></textarea>
          <div style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center;">
            <div style="color: #999; font-size: 12px;">
              <div id="tv-status">Ready to process...</div>
            </div>
            <div>
              <button id="tv-start-btn" style="
                padding: 12px 24px; 
                margin-right: 12px; 
                font-size: 14px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
              ">🚀 Start Processing</button>
              <button id="tv-cancel-btn" style="
                padding: 12px 24px; 
                font-size: 14px;
                background: #666;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
              ">❌ Cancel</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const startBtn = document.getElementById("tv-start-btn");
    const cancelBtn = document.getElementById("tv-cancel-btn");
    const input = document.getElementById("tv-links-input");
    const status = document.getElementById("tv-status");

    // Load existing queue if any
    const existingQueue = getQueuedUrls();
    if (existingQueue.length > 0) {
      input.value = existingQueue.join("\n");
      status.textContent = `Found ${existingQueue.length} URLs from previous session`;
    }

    cancelBtn.onclick = () => {
      modal.remove();
    };

    startBtn.onclick = () => {
      const baseURL = "tradingview.com/script/";
      const lines = input.value.split("\n");
      const urlSet = new Set();

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.includes(baseURL)) {
          urlSet.add(
            trimmed.startsWith("https://") ? trimmed : `https://${trimmed}`
          );
        }
      }

      const urls = [...urlSet];
      console.log(`✅ ${urls.length} unique TradingView script links found.`);

      if (urls.length === 0) {
        alert("❌ No valid TradingView script links found!");
        return;
      }

      // Save URLs to queue and start processing
      setQueuedUrls(urls);
      setCurrentIndex(0);
      isProcessing = true;

      modal.remove();

      GM_notification({
        text: `Starting batch download of ${urls.length} scripts...`,
        timeout: 3000,
      });

      processNextInQueue();
    };
  }

  // Main initialization
  async function init() {
    const currentURL = location.href;

    // Hook XHR for all pages
    hookXHR();

    // Register menu commands
    GM_registerMenuCommand("📊 Batch Download Scripts", createBatchModal);
    GM_registerMenuCommand("🗑️ Clear Processed URLs", () => {
      GM_setValue(CONFIG.storage.processedUrls, {});
      GM_notification({
        text: "Cleared processed URLs history",
        timeout: 2000,
      });
    });
    GM_registerMenuCommand("📋 Show Status", () => {
      const processed = GM_getValue(CONFIG.storage.processedUrls, {});
      const queue = getQueuedUrls();
      const currentIndex = getCurrentIndex();

      console.log("=== TradingView Downloader Status ===");
      console.log(`Processed URLs: ${Object.keys(processed).length}`);
      console.log(`Queued URLs: ${queue.length}`);
      console.log(`Current Index: ${currentIndex}`);
      console.log(`Processing: ${isProcessing}`);

      GM_notification({
        text: `Processed: ${Object.keys(processed).length} | Queue: ${
          queue.length
        }`,
        timeout: 3000,
      });
    });

    // Check if we're on a script page
    if (currentURL.includes("tradingview.com/script/")) {
      // Check if we have a queue to process
      const queuedUrls = getQueuedUrls();
      if (queuedUrls.length > 0 && isProcessing !== false) {
        console.log("Resuming queue processing...");
        await processScriptPage();
      } else if (!isUrlProcessed(currentURL)) {
        // Single page processing mode
        console.log("Processing single script page...");
        await processScriptPage();
      } else {
        console.log("Page already processed.");
        setTimeout(() => processNextInQueue(), 2000);
      }
    }

    // Auto-show modal on main TradingView pages (optional)
    if (
      currentURL === "https://www.tradingview.com/" ||
      currentURL.includes("tradingview.com/u/")
    ) {
      setTimeout(() => {
        if (
          confirm(
            "🤖 Would you like to start batch downloading TradingView scripts?"
          )
        ) {
          createBatchModal();
        }
      }, 2000);
    }
  }

  // Start the script
  await init();
})();
