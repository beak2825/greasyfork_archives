// ==UserScript==
// @name         DropGalaxy Auto Skip
// @namespace    http://tampermonkey.net/
// @version      1.7.2
// @description  Auto skip ads and auto download on DropGalaxy
// @author       kleptomaniac14
// @match        https://dropgalaxy.com/*
// @match        https://dropgalaxy.co/*
// @match        https://financemonk.net/*
// @icon         https://www.google.com/s2/favicons?domain=dropgalaxy.com
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @license      GNU GPLv2
// @downloadURL https://update.greasyfork.org/scripts/492017/DropGalaxy%20Auto%20Skip.user.js
// @updateURL https://update.greasyfork.org/scripts/492017/DropGalaxy%20Auto%20Skip.meta.js
// ==/UserScript==

// Setting esversion to 11 to use optional chaining.
/* jshint esversion: 11 */

(function () {
  "use strict";

  // Constants
  const MAX_IDENTIFICATION_RETRIES = 3;
  const STORAGE_SCRIPT_KEY = "dg_auto_skip_config";
  const STORAGE_CACHE_KEY = "dg_auto_skip_cache";
  const DG_AUTO_SKIP_CONFIG = {
    fallbackDlProvider: "vikingfile", // 'vikingfile, 'gofile
    // Provider to use in case DDL is not available.
    cacheDlLinks: false,
    cacheExpiry: "1week", // '1hour', '1day', '1week', '1month', 'forever'
    alertCaptchaAvailable: false, // Alert when CAPTCHA is available
  };

  // Global Variables
  let intervalId = null;
  let identificationRetries = 0;
  let config = {};
  let cache = {};
  let currentPageLinks = null; // Store current page links for toggle button
  let shouldStopScript = false;

  // Utils
  const log = (message, ...rest) =>
    console.log(
      `[DropGalaxy Auto Skip] [ID: ${intervalId}] ${message}`,
      ...rest
    );

  const getFileMetadata = () => {
    const filename = document.getElementsByTagName("h1")?.[0]?.innerText;
    const fileSize =
      document.getElementsByClassName("fa-hdd")?.[0]?.parentElement
        ?.children?.[1]?.innerText;
    const reportAbuseHref =
      document.getElementsByClassName("fa-flag")?.[0]?.parentElement
        ?.children?.[1]?.href;

    let fileId = null;
    if (reportAbuseHref) {
      const url = new URL(reportAbuseHref);
      fileId = url.searchParams.get("id");
    }

    return { filename, fileSize, fileId };
  };

  const validateCache = () => {
    const now = Date.now();
    const eightHours = 8 * 60 * 60 * 1000;

    Object.keys(cache).forEach((fileId) => {
      const entry = cache[fileId];

      if (entry?.expiry && entry.expiry < now) {
        delete cache[fileId];
      } else if (entry?.createdAt && now - entry.createdAt > eightHours) {
        // Remove the DDL link after 8 hours, keep mirrors if any
        if (entry.urls) {
          entry.urls.ddl = "";
        }
      }
    });
  };

  const loadConfig = async () => {
    const configString = await GM.getValue(STORAGE_SCRIPT_KEY);

    try {
      config = JSON.parse(configString);
    } catch (error) {
      log("Error parsing config, using default", error);
      config = DG_AUTO_SKIP_CONFIG;
    }

    if (!config || typeof config !== "object") {
      config = DG_AUTO_SKIP_CONFIG;
    }
  };

  const loadCache = async () => {
    const cacheString = await GM.getValue(STORAGE_CACHE_KEY);

    try {
      cache = JSON.parse(cacheString);
    } catch (error) {
      log("Error parsing cache, starting fresh", error);
      cache = {};
    }
    if (!cache || typeof cache !== "object") {
      cache = {};
    }

    validateCache();
  };

  const saveCache = async ({ fileId, filename, fileSize, links }) => {
    if (!Array.isArray(links) || links.length === 0) return;

    // For each link, extract their domain, identify if it is DDL or alternative
    // and save to cache with expiry
    const now = Date.now();
    const urls = {
      ddl: "",
      vikingfile: "",
      gofile: "",
    };

    links.forEach((link) => {
      const url = new URL(link);
      const domain = url.hostname;

      if (domain.includes("a2zupload")) {
        urls.ddl = link;
      } else if (domain.includes("vikingfile")) {
        urls.vikingfile = link;
      } else if (domain.includes("gofile")) {
        urls.gofile = link;
      }
    });

    const expiry = (() => {
      switch (config.cacheExpiry) {
        case "1hour":
          return now + 3600 * 1000;
        case "1day":
          return now + 24 * 3600 * 1000;
        case "1week":
          return now + 7 * 24 * 3600 * 1000;
        case "1month":
          return now + 30 * 24 * 3600 * 1000;
        case "forever":
          return null;
      }
    })();

    cache[fileId] = { filename, fileSize, urls, expiry, createdAt: now };

    validateCache();

    await GM.setValue(STORAGE_CACHE_KEY, JSON.stringify(cache));
    log("Cache saved");
  };

  const handleSaveConfig = async (newConfig) => {
    await GM.setValue(STORAGE_SCRIPT_KEY, JSON.stringify(newConfig));
    config = newConfig;
    log("Settings saved");
  };

  const handleResetConfig = async () => {
    if (confirm("Reset settings?")) {
      await GM.deleteValue(STORAGE_SCRIPT_KEY);
      log("Settings reset");
    }
  };

  const checkCachedFile = () => {
    const { fileId } = getFileMetadata();

    const hasValidURLs = Object.values(cache[fileId]?.urls ?? {}).some(
      (url) => url
    );

    if (hasValidURLs) {
      shouldStopScript = true;
      showModalWithLinks(cache[fileId].urls);
      return true;
    }

    return false;
  };

  const showModalWithLinks = async (urls) => {
    // Store links globally for toggle button
    currentPageLinks = urls;

    // Check if modal already exists, if so remove it (toggle behavior)
    const existingModal = document.getElementById("dg-links-modal");
    if (existingModal) {
      existingModal.remove();
      return; // Exit to toggle off
    }

    // Create modal
    const modal = document.createElement("div");
    modal.id = "dg-links-modal";
    modal.style.cssText = `
            position: fixed; top: 70px; right: 20px; left: 20px; width: auto; max-width: 320px;
            background: var(--bg-color, #ffffff); border: 1px solid var(--border-color, #ddd); border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 9999999999; padding: 0; color: var(--text-color, #000000);
        `;

    // Adjust for desktop (wider screens)
    if (window.innerWidth > 600) {
      modal.style.left = "auto";
      modal.style.width = "320px";
    }

    const modalContent = document.createElement("div");
    modalContent.style.cssText = `
            background: var(--bg-color, #ffffff); padding: 20px; border-radius: 8px; position: relative;
            color: var(--text-color, #000000);
        `;

    // Close button
    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "×";
    closeBtn.style.cssText = `
            position: absolute; top: 5px; right: 10px; background: none; border: none; font-size: 18px; cursor: pointer; color: var(--text-muted, #999999);
        `;
    closeBtn.onclick = () => {
      modal.remove();
      // Show links button again when modal is closed
      if (currentPageLinks) {
        window.toggleLinksButton(true);
      }
    };

    // Title
    const title = document.createElement("h3");
    title.textContent = "Available Download Links";
    title.style.cssText =
      "margin: 0 0 15px 0; font-size: 16px; color: var(--text-color, #000000);";

    // File info section
    const { fileId } = getFileMetadata();
    const cachedFile = cache[fileId];

    if (cachedFile && (cachedFile?.filename || cachedFile?.fileSize)) {
      const fileInfo = document.createElement("div");
      fileInfo.style.cssText =
        "background: var(--input-bg, #f8f9fa); padding: 10px; border-radius: 5px; margin-bottom: 15px; border: 1px solid var(--border-color, #ddd);";

      if (cachedFile?.filename) {
        const filename = document.createElement("div");
        filename.textContent = `File: ${cachedFile.filename}`;
        filename.style.cssText =
          "font-weight: bold; color: var(--text-color, #000000); margin-bottom: 5px; word-break: break-word;";
        fileInfo.appendChild(filename);
      }

      if (cachedFile?.fileSize) {
        const fileSize = document.createElement("div");
        fileSize.textContent = `Size: ${cachedFile.fileSize}`;
        fileSize.style.cssText =
          "color: var(--text-muted, #666666); font-size: 12px;";
        fileInfo.appendChild(fileSize);
      }

      modalContent.appendChild(fileInfo);
    }

    // Links list
    const linksList = document.createElement("div");
    linksList.style.cssText =
      "display: flex; flex-direction: column; gap: 10px; margin-bottom: 10px;";

    // Add links
    if (urls.ddl) {
      const a = document.createElement("a");
      a.href = urls.ddl;
      a.textContent = "Direct Download Link";
      a.target = "_blank";
      a.style.cssText =
        "background: #22a76d; color: white; padding: 10px; border-radius: 5px; text-align: center; text-decoration: none; font-weight: bold;";
      linksList.appendChild(a);
    }

    if (urls.vikingfile) {
      const a = document.createElement("a");
      a.href = urls.vikingfile;
      a.textContent = "VikingFile Mirror";
      a.target = "_blank";
      a.style.cssText =
        "background: #007bff; color: white; padding: 10px; border-radius: 5px; text-align: center; text-decoration: none; font-weight: bold;";
      linksList.appendChild(a);
    }

    if (urls.gofile) {
      const a = document.createElement("a");
      a.href = urls.gofile;
      a.textContent = "GoFile Mirror";
      a.target = "_blank";
      a.style.cssText =
        "background: #6c757d; color: white; padding: 10px; border-radius: 5px; text-align: center; text-decoration: none; font-weight: bold;";
      linksList.appendChild(a);
    }

    // Show message if no links are available
    if (!urls.ddl && !urls.vikingfile && !urls.gofile) {
      const noLinks = document.createElement("div");
      noLinks.textContent = "No links available.";
      noLinks.style.cssText =
        "color: var(--text-muted, #999999); text-align: center; padding: 10px;";
      linksList.appendChild(noLinks);
    }

    // Remove From Cache button click handler
    const handleRemoveFromCache = async (e) => {
      e.stopPropagation();
      const { fileId } = getFileMetadata();
      if (!fileId) return;

      if (cache && cache[fileId]) {
        delete cache[fileId];
        try {
          await GM.setValue(STORAGE_CACHE_KEY, JSON.stringify(cache));
          log(`Removed ${fileId} from cache`);
        } catch (err) {
          log("Error saving cache after removal", err);
        }
      }

      // Close modal and restart page watcher
      modal.remove();
      shouldStopScript = false;
      if (typeof startPageWatcher === "function") startPageWatcher();
    };

    // Remove From Cache button
    const removeBtn = document.createElement("button");
    removeBtn.innerText = "Remove From Cache";
    removeBtn.style.cssText = `
            background: #dc3545; color: white; padding: 8px; border-radius: 5px; text-align: center; border: none; cursor: pointer; font-weight: bold; width: 100%; margin-top: 8px;
        `;
    removeBtn.onclick = handleRemoveFromCache;

    // Assemble modal
    modalContent.appendChild(closeBtn);
    modalContent.appendChild(title);
    modalContent.appendChild(linksList);
    modalContent.appendChild(removeBtn);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Close on outside click
    setTimeout(() => {
      document.addEventListener("click", function clickHandler(e) {
        if (!modal.contains(e.target)) {
          modal.remove();
          document.removeEventListener("click", clickHandler);
        }
      });
    }, 100);
  };

  const showCacheBrowser = async () => {
    // Check if modal already exists, if so remove it (toggle behavior)
    const existingModal = document.getElementById("dg-cache-browser-modal");
    if (existingModal) {
      existingModal.remove();
      return;
    }

    // Create modal
    const modal = document.createElement("div");
    modal.id = "dg-cache-browser-modal";
    modal.style.cssText = `
      position: fixed; top: 70px; right: 20px; left: 20px; width: auto; max-width: 500px; max-height: 70vh;
      background: var(--bg-color, #ffffff); border: 1px solid var(--border-color, #ddd); border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 9999999999; padding: 0; color: var(--text-color, #000000);
      display: flex; flex-direction: column;
    `;

    // Adjust for desktop (wider screens)
    if (window.innerWidth > 600) {
      modal.style.left = "auto";
      modal.style.width = "500px";
    }

    const modalContent = document.createElement("div");
    modalContent.style.cssText = `
      background: var(--bg-color, #ffffff); padding: 20px; border-radius: 8px; position: relative;
      color: var(--text-color, #000000); display: flex; flex-direction: column; max-height: 70vh;
    `;

    // Close button
    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "×";
    closeBtn.style.cssText = `
      position: absolute; top: 5px; right: 10px; background: none; border: none; font-size: 18px; cursor: pointer; color: var(--text-muted, #999999);
    `;
    closeBtn.onclick = () => modal.remove();

    // Title
    const title = document.createElement("h3");
    title.textContent = "Cached Files";
    title.style.cssText =
      "margin: 0 0 15px 0; font-size: 16px; color: var(--text-color, #000000);";

    // Search box
    const searchBox = document.createElement("input");
    searchBox.type = "text";
    searchBox.placeholder = "Search files...";
    searchBox.style.cssText = `
      width: 100%; padding: 8px; margin-bottom: 15px; border: 1px solid var(--border-color, #ddd);
      border-radius: 4px; background: var(--input-bg, #ffffff); color: var(--text-color, #000000);
      font-size: 12px;
    `;

    // Files container
    const filesContainer = document.createElement("div");
    filesContainer.style.cssText = `
      flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px;
    `;

    // Function to render files
    const renderFiles = (searchTerm = "") => {
      filesContainer.innerHTML = "";
      const cacheEntries = Object.entries(cache);

      if (cacheEntries.length === 0) {
        const emptyMsg = document.createElement("div");
        emptyMsg.textContent = "No cached files.";
        emptyMsg.style.cssText =
          "text-align: center; color: var(--text-muted, #999999); padding: 20px;";
        filesContainer.appendChild(emptyMsg);
        return;
      }

      const filteredEntries = cacheEntries.filter(([fileId, data]) => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
          data.filename?.toLowerCase().includes(term) ||
          data.fileSize?.toLowerCase().includes(term) ||
          fileId.toLowerCase().includes(term)
        );
      });

      if (filteredEntries.length === 0) {
        const noResults = document.createElement("div");
        noResults.textContent = "No files match your search.";
        noResults.style.cssText =
          "text-align: center; color: var(--text-muted, #999999); padding: 20px;";
        filesContainer.appendChild(noResults);
        return;
      }

      filteredEntries.forEach(([fileId, data]) => {
        const fileCard = document.createElement("div");
        fileCard.style.cssText = `
          background: var(--input-bg, #f8f9fa); padding: 12px; border-radius: 5px;
          border: 1px solid var(--border-color, #ddd); cursor: pointer;
          transition: background 0.2s;
        `;
        fileCard.onmouseenter = () =>
          (fileCard.style.background = "var(--border-color, #e9ecef)");
        fileCard.onmouseleave = () =>
          (fileCard.style.background = "var(--input-bg, #f8f9fa)");

        // Filename
        const filename = document.createElement("div");
        filename.textContent = data.filename || "Unknown File";
        filename.style.cssText =
          "font-weight: bold; color: var(--text-color, #000000); margin-bottom: 5px; word-break: break-word; font-size: 13px;";

        // File size
        const fileSize = document.createElement("div");
        fileSize.textContent = `Size: ${data.fileSize || "Unknown"}`;
        fileSize.style.cssText =
          "color: var(--text-muted, #666666); font-size: 11px; margin-bottom: 8px;";

        // Links row
        const linksRow = document.createElement("div");
        linksRow.style.cssText =
          "display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 8px;";

        // Add link buttons
        if (data.urls?.ddl) {
          const ddlBtn = document.createElement("a");
          ddlBtn.href = data.urls.ddl;
          ddlBtn.textContent = "DDL";
          ddlBtn.target = "_blank";
          ddlBtn.style.cssText =
            "background: #22a76d; color: white; padding: 4px 8px; border-radius: 3px; text-decoration: none; font-size: 10px; font-weight: bold;";
          linksRow.appendChild(ddlBtn);
        }

        if (data.urls?.vikingfile) {
          const vikingBtn = document.createElement("a");
          vikingBtn.href = data.urls.vikingfile;
          vikingBtn.textContent = "Viking";
          vikingBtn.target = "_blank";
          vikingBtn.style.cssText =
            "background: #007bff; color: white; padding: 4px 8px; border-radius: 3px; text-decoration: none; font-size: 10px; font-weight: bold;";
          linksRow.appendChild(vikingBtn);
        }

        if (data.urls?.gofile) {
          const gofileBtn = document.createElement("a");
          gofileBtn.href = data.urls.gofile;
          gofileBtn.textContent = "GoFile";
          gofileBtn.target = "_blank";
          gofileBtn.style.cssText =
            "background: #6c757d; color: white; padding: 4px 8px; border-radius: 3px; text-decoration: none; font-size: 10px; font-weight: bold;";
          linksRow.appendChild(gofileBtn);
        }

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.style.cssText =
          "background: #dc3545; color: white; padding: 4px 8px; border-radius: 3px; border: none; cursor: pointer; font-size: 10px; font-weight: bold;";
        deleteBtn.onclick = async (e) => {
          e.stopPropagation();
          if (confirm(`Delete cached file: ${data.filename}?`)) {
            delete cache[fileId];
            await GM.setValue(STORAGE_CACHE_KEY, JSON.stringify(cache));
            log(`Deleted ${fileId} from cache`);
            renderFiles(searchBox.value);
          }
        };
        linksRow.appendChild(deleteBtn);

        fileCard.appendChild(filename);
        fileCard.appendChild(fileSize);
        fileCard.appendChild(linksRow);
        filesContainer.appendChild(fileCard);
      });
    };

    // Search box event
    searchBox.oninput = () => renderFiles(searchBox.value);

    // Clear All button
    const clearAllBtn = document.createElement("button");
    clearAllBtn.textContent = "Clear All Cache";
    clearAllBtn.style.cssText = `
      background: #dc3545; color: white; padding: 8px; border-radius: 5px; text-align: center;
      border: none; cursor: pointer; font-weight: bold; width: 100%; margin-top: 10px; font-size: 12px;
    `;
    clearAllBtn.onclick = async () => {
      if (confirm("Are you sure you want to clear all cached files?")) {
        cache = {};
        await GM.setValue(STORAGE_CACHE_KEY, JSON.stringify(cache));
        log("Cache cleared");
        renderFiles();
      }
    };

    // Assemble modal
    modalContent.appendChild(closeBtn);
    modalContent.appendChild(title);
    modalContent.appendChild(searchBox);
    modalContent.appendChild(filesContainer);
    modalContent.appendChild(clearAllBtn);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Initial render
    renderFiles();

    // Close on outside click
    setTimeout(() => {
      document.addEventListener("click", function clickHandler(e) {
        if (!modal.contains(e.target) && e.target.id !== "cache-browser-btn") {
          modal.remove();
          document.removeEventListener("click", clickHandler);
        }
      });
    }, 100);
  };

  const showSettingsUI = () => {
    // Create floating settings button
    const settingsBtn = document.createElement("button");
    settingsBtn.innerHTML = "⚙️";
    settingsBtn.title = "Settings";
    settingsBtn.style.cssText = `
        position: fixed; top: 20px; right: 20px; width: 40px; height: 40px;
        border-radius: 50%; background: #22a76d; border: none; color: white;
        cursor: pointer; z-index: 9999999999; font-size: 16px;
    `;

    // Create floating links button
    const linksBtn = document.createElement("button");
    linksBtn.innerHTML = "🔗";
    linksBtn.title = "Download Links";
    linksBtn.style.cssText = `
        position: fixed; top: 20px; right: 120px; width: 40px; height: 40px;
        border-radius: 50%; background: #007bff; border: none; color: white;
        cursor: pointer; z-index: 9999999999; font-size: 16px; display: none;
    `;

    // Links button click handler
    linksBtn.onclick = () => {
      if (currentPageLinks) {
        showModalWithLinks(currentPageLinks);
      }
    };

    // Create floating cache browser button
    const cacheBtn = document.createElement("button");
    cacheBtn.id = "cache-browser-btn";
    cacheBtn.innerHTML = "📦";
    cacheBtn.title = "Cache Browser";
    cacheBtn.style.cssText = `
        position: fixed; top: 20px; right: 70px; width: 40px; height: 40px;
        border-radius: 50%; background: #6c757d; border: none; color: white;
        cursor: pointer; z-index: 9999999999; font-size: 16px;
    `;

    // Cache button click handler
    cacheBtn.onclick = () => showCacheBrowser();

    // Function to show/hide links button based on availability
    window.toggleLinksButton = (show = false) => {
      linksBtn.style.display = show ? "block" : "none";
    };

    // Create modal
    const modal = document.createElement("div");
    modal.style.cssText = `
        display: none; position: fixed; top: 70px; right: 20px; width: 280px;
        background: var(--bg-color, #ffffff); border: 1px solid var(--border-color, #ddd); border-radius: 8px; 
        box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 9999999999; padding: 0;
        color: var(--text-color, #000000);
    `;

    const modalContent = document.createElement("div");
    modalContent.style.cssText = `
        background: var(--bg-color, #ffffff); padding: 20px; border-radius: 8px; position: relative;
        color: var(--text-color, #000000);
    `;

    modalContent.innerHTML = `
        <button id="close-btn" style="position: absolute; top: 5px; right: 10px; background: none; border: none; font-size: 18px; cursor: pointer; color: var(--text-muted, #999999);">×</button>
        <h3 style="margin: 0 0 15px 0; font-size: 16px; color: var(--text-color, #000000);">Settings</h3>
        <label style="display: block; margin-bottom: 10px; color: var(--text-color, #000000);">
            Fallback DL Provider:
            <select id="provider-select" style="width: 100%; margin-top: 5px; padding: 5px; font-size: 12px; background: var(--input-bg, #ffffff); color: var(--text-color, #000000); border: 1px solid var(--border-color, #ddd);">
                <option value="">None</option>
                <option value="vikingfile">VikingFile</option>
                <option value="gofile">GoFile</option>
            </select>
            <small style="color: var(--text-muted, #666666); font-size: 10px; display: block; margin-top: 3px;">Provider to use in case DDL is not available.</small>
        </label>
        <div style="display: block; margin-bottom: 10px;">
            <label id="cache-label" style="cursor: pointer; font-size: 12px; color: var(--text-color, #000000);">
                <input type="checkbox" id="cache-toggle" style="margin-right: 6px; transform: scale(0.9);"> Cache Links
            </label>
            <small id="cache-helper" style="color: var(--text-muted, #666666); font-size: 10px; display: block; margin-top: 3px; margin-left: 16px; cursor: pointer;">Save the Direct Links if visiting the same link again.</small>
        </div>
        <div style="display: block; margin-bottom: 10px;">
            <label id="captcha-alert-label" style="cursor: pointer; font-size: 12px; color: var(--text-color, #000000);">
                <input type="checkbox" id="captcha-alert-toggle" style="margin-right: 6px; transform: scale(0.9);"> Alert Captcha Available
            </label>
            <small id="captcha-alert-helper" style="color: var(--text-muted, #666666); font-size: 10px; display: block; margin-top: 3px; margin-left: 16px; cursor: pointer;">Show alert when CAPTCHA is available for solving.</small>
        </div>
        <label style="display: block; margin-bottom: 15px; font-size: 12px; color: var(--text-color, #000000);">
            Cache Expiry:
            <select id="expiry-select" style="width: 100%; margin-top: 5px; padding: 5px; font-size: 12px; background: var(--input-bg, #ffffff); color: var(--text-color, #000000); border: 1px solid var(--border-color, #ddd);">
                <option value="1hour">1 Hour</option>
                <option value="1day">1 Day</option>
                <option value="1week">1 Week</option>
                <option value="1month">1 Month</option>
                <option value="forever">Forever</option>
            </select>
        </label>
        <div style="display: flex; gap: 8px;">
            <button id="save-btn" style="background: #22a76d; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 11px; flex: 1;">Save</button>
            <button id="reset-btn" style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 11px; flex: 1;">Reset</button>
        </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(settingsBtn);
    document.body.appendChild(linksBtn);
    document.body.appendChild(cacheBtn);
    document.body.appendChild(modal);

    // Setup theme detection and CSS custom properties
    const setupTheme = () => {
      const isDarkTheme = () => {
        // Check if the page has a dark background
        const bodyBg = getComputedStyle(document.body).backgroundColor;
        const docBg = getComputedStyle(
          document.documentElement
        ).backgroundColor;

        // Check if body or html has dark background
        const rgbValues = bodyBg.match(/\d+/g) ||
          docBg.match(/\d+/g) || [255, 255, 255];
        const brightness =
          (parseInt(rgbValues[0]) * 299 +
            parseInt(rgbValues[1]) * 587 +
            parseInt(rgbValues[2]) * 114) /
          1000;

        // Also check for common dark theme indicators
        const isDark =
          brightness < 128 ||
          document.body.classList.contains("dark") ||
          document.body.classList.contains("dark-theme") ||
          document.documentElement.classList.contains("dark") ||
          document.documentElement.classList.contains("dark-theme");

        return isDark;
      };

      // Set CSS custom properties based on theme
      const root = document.documentElement;
      if (isDarkTheme()) {
        root.style.setProperty("--bg-color", "#2d2d2d");
        root.style.setProperty("--text-color", "#ffffff");
        root.style.setProperty("--text-muted", "#cccccc");
        root.style.setProperty("--input-bg", "#404040");
        root.style.setProperty("--border-color", "#555555");
      } else {
        root.style.setProperty("--bg-color", "#ffffff");
        root.style.setProperty("--text-color", "#000000");
        root.style.setProperty("--text-muted", "#666666");
        root.style.setProperty("--input-bg", "#ffffff");
        root.style.setProperty("--border-color", "#dddddd");
      }
    };

    setupTheme();

    // Add checkbox change handler after modal is created
    const addCheckboxHandler = () => {
      const checkbox = modal.querySelector("#cache-toggle");
      const expirySelect = modal.querySelector("#expiry-select");
      const cacheLabel = modal.querySelector("#cache-label");
      const cacheHelper = modal.querySelector("#cache-helper");
      const captchaAlertCheckbox = modal.querySelector("#captcha-alert-toggle");
      const captchaAlertLabel = modal.querySelector("#captcha-alert-label");
      const captchaAlertHelper = modal.querySelector("#captcha-alert-helper");

      if (checkbox && expirySelect) {
        const toggleCheckbox = () => {
          checkbox.checked = !checkbox.checked;
          expirySelect.disabled = !checkbox.checked;
          expirySelect.style.opacity = checkbox.checked ? "1" : "0.5";
        };

        // Checkbox change event
        checkbox.onchange = () => {
          expirySelect.disabled = !checkbox.checked;
          expirySelect.style.opacity = checkbox.checked ? "1" : "0.5";
        };

        // Label click event (this handles the text "Cache Links")
        if (cacheLabel) {
          cacheLabel.onclick = (e) => {
            // Only toggle if we didn't click directly on the checkbox
            if (e.target !== checkbox) {
              toggleCheckbox();
              e.preventDefault();
              e.stopPropagation();
            }
          };
        }

        // Helper text click event
        if (cacheHelper) {
          cacheHelper.onclick = (e) => {
            toggleCheckbox();
            e.preventDefault();
            e.stopPropagation();
          };
        }
      }

      // Captcha alert checkbox handlers
      if (captchaAlertCheckbox) {
        const toggleCaptchaAlert = () => {
          captchaAlertCheckbox.checked = !captchaAlertCheckbox.checked;
        };

        // Label click event
        if (captchaAlertLabel) {
          captchaAlertLabel.onclick = (e) => {
            if (e.target !== captchaAlertCheckbox) {
              toggleCaptchaAlert();
              e.preventDefault();
              e.stopPropagation();
            }
          };
        }

        // Helper text click event
        if (captchaAlertHelper) {
          captchaAlertHelper.onclick = (e) => {
            toggleCaptchaAlert();
            e.preventDefault();
            e.stopPropagation();
          };
        }
      }
    };

    // Event handlers
    settingsBtn.onclick = async () => {
      // Load current settings
      const configString = await GM.getValue(STORAGE_SCRIPT_KEY);
      let config = DG_AUTO_SKIP_CONFIG;
      if (configString) {
        try {
          config = {
            ...DG_AUTO_SKIP_CONFIG,
            ...JSON.parse(configString),
          };
        } catch (e) {
          log("Error loading settings");
        }
      }

      modal.querySelector("#provider-select").value =
        config.fallbackDlProvider || "";
      modal.querySelector("#cache-toggle").checked =
        config.cacheDlLinks || false;
      modal.querySelector("#expiry-select").value =
        config.cacheExpiry || "1week";
      modal.querySelector("#captcha-alert-toggle").checked =
        config.alertCaptchaAvailable || false;

      // Update expiry dropdown state based on checkbox
      const updateExpiryState = () => {
        const checkbox = modal.querySelector("#cache-toggle");
        const expirySelect = modal.querySelector("#expiry-select");
        expirySelect.disabled = !checkbox.checked;
        expirySelect.style.opacity = checkbox.checked ? "1" : "0.5";
      };

      updateExpiryState();
      modal.style.display = "block";

      // Add checkbox handler after modal is displayed
      addCheckboxHandler();
    };

    // Save Handler
    modal.querySelector("#save-btn").onclick = () => {
      const newConfig = {
        fallbackDlProvider:
          modal.querySelector("#provider-select").value || null,
        cacheDlLinks: modal.querySelector("#cache-toggle").checked,
        cacheExpiry: modal.querySelector("#expiry-select").value || "1week",
        alertCaptchaAvailable: modal.querySelector("#captcha-alert-toggle")
          .checked,
      };
      handleSaveConfig(newConfig);
      modal.style.display = "none";
    };

    // Reset Handler
    modal.querySelector("#reset-btn").onclick = () => handleResetConfig();

    // Close Handler
    modal.querySelector("#close-btn").onclick = () =>
      (modal.style.display = "none");

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!settingsBtn.contains(e.target) && !modal.contains(e.target)) {
        modal.style.display = "none";
      }
    });
  };

  // One Time Setup
  loadConfig();
  loadCache();
  showSettingsUI();
  log("DropGalaxy Script Loaded");

  // Page Handlers
  const handlePage1 = () => {
    log("Handling Page 1");

    if (checkCachedFile()) {
      return;
    }

    // Click on Download Button
    const downloadBtn = document.getElementById("method_free");
    downloadBtn?.click();
  };

  const handlePage3 = () => {
    log("Handling Page 3");

    // Click on Download Button
    const downloadForm = document.getElementById("dllink");
    const url = downloadForm?.action;

    const externalLinksContainer = document.getElementById("ppdlinks");
    const externalLinks = [];
    externalLinksContainer?.childNodes?.forEach((element) => {
      if (element?.tagName === "A") {
        externalLinks.push(element.href);
      }
    });

    const { filename, fileSize, fileId } = getFileMetadata();

    saveCache({
      fileId,
      filename,
      fileSize,
      links: [...externalLinks, url],
    });

    // Add element to show the DDL
    const ddlElement = document.createElement("a");
    ddlElement.href = url;
    ddlElement.innerText = "Direct Download Link";
    ddlElement.className = "btn btn-block btn-lg btn-primary";
    ddlElement.style =
      "background: #22a76d; color: white; margin-bottom: 20px; padding-inline: 0; border: none;";

    downloadForm?.appendChild(ddlElement);

    // Open DDL in current tab
    window.location.assign(url);
  };

  const handlePage2 = () => {
    log("Handling Page 2");

    if (checkCachedFile()) {
      return;
    }

    const falseDownloadBtn = document.getElementById("downloadbtn");
    const tokenStatus = document.getElementById("tokennstatus");
    const countdown = document.getElementById("countdown");
    let isUserAlerted = false;

    // Keep clicking until enabled
    const downloadIntervalId = setInterval(() => {
      const isCaptchaAvailable =
        tokenStatus?.innerText === "click on- verify you are human...";
      log("Waiting for user to solve CAPTCHA...");

      // Alert if CAPTCHA is available and setting is enabled
      if (
        isCaptchaAvailable &&
        config.alertCaptchaAvailable &&
        !isUserAlerted
      ) {
        log("CAPTCHA is available, alerting user");
        alert("CAPTCHA is available! Please solve it.");
        isUserAlerted = true;
      }

      if (
        // If download button is enabled and CAPTCHA is solved, submit the form
        tokenStatus?.innerText === "ready! click on create download link" &&
        falseDownloadBtn?.disabled === false
      ) {
        log("Download Button Enabled, submitting form");
        // downloadBtn.click();
        document.getElementById("ff1")?.submit();
        clearInterval(downloadIntervalId);
      }
    }, 500);
  };

  const handlePage = (pageWatcherIntervalId) => {
    const page1Identifier = document.getElementById("method_free");
    const page2Identifier = document.getElementById("countdown");
    const page3Identifier = document.getElementById("dllink");

    const adblockPageIdentifier = document.querySelector(
      "body > div.container.pt-5.page.message > div > div > div"
    );
    const isAdblockPage =
      adblockPageIdentifier?.innerText === "\nAdblock Detected!";

    // If page is recognized, clear the interval to stop checking
    if (
      pageWatcherIntervalId &&
      (page1Identifier || page2Identifier || page3Identifier || isAdblockPage)
    ) {
      log("Page Identified, stopping page watcher");
      clearInterval(pageWatcherIntervalId);
      // identificationRetries = 0;
      // no need to reset retries, as it will be reset on next page load
    }

    if (page1Identifier) {
      handlePage1();
    } else if (page2Identifier) {
      handlePage2();
    } else if (page3Identifier) {
      handlePage3();
    } else if (isAdblockPage) {
      // handleAdblockPage();
      // Not implemented
    } else if (MAX_IDENTIFICATION_RETRIES > identificationRetries) {
      log("Unknown Page or Waiting for identification");
      identificationRetries++;
    } else {
      log("Max Identification Retries Reached, Stopping Page Watcher");
      clearInterval(pageWatcherIntervalId);
    }
  };

  // Keep checking the page as soon as it loads
  const startPageWatcher = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    intervalId = setInterval(() => {
      if (shouldStopScript) {
        clearInterval(intervalId);
        return;
      }
      handlePage(intervalId);
    }, 500);
  };

  // Start watcher initially
  startPageWatcher();
})();
