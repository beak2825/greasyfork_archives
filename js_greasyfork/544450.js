// ==UserScript==
// @name         Steam Screenshot Resolution Highlighter & Uploader
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Highlights Steam Community Hub screenshots that match a specific resolution and upload them
// @author       ConstanceHarm
// @match        https://steamcommunity.com/app/*/screenshots/*
// @grant        GM_xmlhttpRequest
// @connect      steamcommunity.com
// @connect      steamcdn-a.akamaihd.net
// @connect      steamuserimages-a.akamaihd.net
// @run-at       document-end
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/544450/Steam%20Screenshot%20Resolution%20Highlighter%20%20Uploader.user.js
// @updateURL https://update.greasyfork.org/scripts/544450/Steam%20Screenshot%20Resolution%20Highlighter%20%20Uploader.meta.js
// ==/UserScript==

(function() {
  "use strict";

  // Configuration - Change these values to your desired resolution
  const targetWidth = 1920;  // Your desired width in pixels
  const targetHeight = 1080; // Your desired height in pixels
  const DEBUG_MODE = false;  // Set to true to show debug features (Uguu.se upload)

  // CSS for highlighted images
  const exactMatchStyle = `
        border: 3px solid #76b900 !important;
        box-shadow: 0 0 10px #76b900 !important;
    `;

  const downscalableStyle = `
        border: 3px solid #9370DB !important;
        box-shadow: 0 0 10px #9370DB !important;
    `;

  const nonMatchStyle = `
    border: 3px solid #FF0000 !important;
    box-shadow: 0 0 10px #FF0000 !important;
`;

  const selectedStyle = `
        border: 3px solid #FFD700 !important;
        box-shadow: 0 0 15px #FFD700 !important;
        opacity: 0.8 !important;
    `;

  // Cache to avoid rechecking the same images
  const checkedImages = new Map();
  const selectedImages = new Set();

  // Upload history to track previously uploaded images to proxy (permanent storage)
  const proxyUploadHistory = new Map(); // Maps imageUrl -> {proxyUrl, timestamp, wasDownscaled}

  // Store the last successful upload URLs for copy functionality
  let lastUploadedUrls = "";

  function loadProxyUploadHistory() {
    try {
      const stored = localStorage.getItem("steam-screenshot-proxy-history");
      if (stored) {
        const parsed = JSON.parse(stored);
        for (const [key, value] of Object.entries(parsed)) {
          proxyUploadHistory.set(key, value);
        }
        console.log(`Loaded ${proxyUploadHistory.size} previous proxy uploads from history`);
      }
    } catch (error) {
      console.error("Failed to load proxy upload history:", error);
    }
  }

  // Save proxy upload history to localStorage
  function saveProxyUploadHistory() {
    try {
      const historyObj = Object.fromEntries(proxyUploadHistory);
      localStorage.setItem("steam-screenshot-proxy-history", JSON.stringify(historyObj));
    } catch (error) {
      console.error("Failed to save proxy upload history:", error);
    }
  }

  // Check if an image was previously uploaded to proxy
  function isAlreadyUploadedToProxy(imageUrl) {
    return proxyUploadHistory.has(imageUrl);
  }

  // Add an image to proxy upload history
  function addToProxyUploadHistory(imageUrl, proxyUrl, wasDownscaled = false) {
    proxyUploadHistory.set(imageUrl, {
      proxyUrl: proxyUrl,
      timestamp: Date.now(),
      wasDownscaled: wasDownscaled,
    });
    saveProxyUploadHistory();
  }

  // Logging function
  function logError(message, data) {
    console.error(message, data);
  }

  // Add a settings panel to the page
  // Add a settings panel to the page
  function addSettingsPanel() {
    const panel = document.createElement("div");
    panel.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background-color: #1b2838;
        border: 1px solid #4d4b49;
        padding: 10px;
        z-index: 9999;
        color: white;
        font-family: Arial, sans-serif;
        border-radius: 3px;
        max-width: 320px;
    `;

    const debugUploadButton = DEBUG_MODE ?
        `<button id="upload-selected" style="background-color: #FF6B35; border: none; color: white; padding: 8px 10px; cursor: pointer; width: 100%; margin-bottom: 5px; font-weight: bold;" disabled>Upload to uguu.se</button>` : "";

    const uploadButtonLabel = DEBUG_MODE ? "Upload + Proxy" : "Upload Images";

    panel.innerHTML = `
        <h3 style="margin: 0 0 10px 0; font-size: 14px;">Resolution Highlighter & Uploader</h3>
        <div style="display: flex; margin-bottom: 5px;">
            <label style="margin-right: 5px;">Width:</label>
            <input id="target-width" type="number" value="${targetWidth}" style="width: 60px;">
        </div>
        <div style="display: flex; margin-bottom: 10px;">
            <label style="margin-right: 5px;">Height:</label>
            <input id="target-height" type="number" value="${targetHeight}" style="width: 60px;">
        </div>
        <div style="font-size: 11px; margin-bottom: 8px;">
            <span style="color: #76b900;">■</span> Exact match
            <span style="color: #9370DB; margin-left: 8px;">■</span> Downscalable
            <span style="color: #FF0000; margin-left: 8px;">■</span> Non-match
            <span style="color: #FFD700; margin-left: 8px;">■</span> Selected
        </div>
        <button id="apply-resolution" style="background-color: #76b900; border: none; color: white; padding: 5px 10px; cursor: pointer; width: 100%; margin-bottom: 5px;">Apply</button>
        <div style="margin-bottom: 10px;">
            <button id="select-all" style="background-color: #4682B4; border: none; color: white; padding: 3px 8px; cursor: pointer; margin-right: 5px; font-size: 11px;">Select All</button>
            <button id="clear-selection" style="background-color: #8B0000; border: none; color: white; padding: 3px 8px; cursor: pointer; font-size: 11px;">Clear</button>
        </div>
        ${debugUploadButton}
        <button id="upload-with-proxy" style="background-color: #32CD32; border: none; color: white; padding: 8px 10px; cursor: pointer; width: 100%; margin-bottom: 10px; font-weight: bold;" disabled>${uploadButtonLabel}</button>
        <div id="copy-button-container"></div>
        <div id="selection-count" style="margin-bottom: 10px; font-size: 12px; color: #FFD700;">Selected: 0 images</div>
        <div id="status" style="margin-top: 10px; font-size: 12px;">Checking images...</div>
        <div id="match-count" style="margin-top: 5px; font-size: 12px;"></div>
        <div id="upload-status" style="margin-top: 10px; font-size: 12px; color: #FFD700; max-height: 200px; overflow-y: auto;"></div>
    `;

    document.body.appendChild(panel);

    // Add event listeners
    setupEventListeners();
  }

  function setupEventListeners() {
    // Apply button
    document.getElementById("apply-resolution").addEventListener("click", function() {
      const newWidth = parseInt(document.getElementById("target-width").value);
      const newHeight = parseInt(document.getElementById("target-height").value);

      checkedImages.clear();
      selectedImages.clear();
      updateSelectionCount();

      document.querySelectorAll("img.apphub_CardContentPreviewImage, .screenshotHolder img").forEach(img => {
        img.dataset.dimensionsChecked = "false";
      });

      document.getElementById("status").textContent = "Checking images...";
      document.getElementById("match-count").textContent = "";
      document.getElementById("upload-status").textContent = "";

      resetAllHighlights();
      highlightScreenshots(newWidth, newHeight);
    });

    // Select all button
    document.getElementById("select-all").addEventListener("click", function() {
      document.querySelectorAll(".highlighted-screenshot, .downscalable-screenshot").forEach(img => {
        const fullSizeUrl = getFullSizeImageUrl(img);
        selectedImages.add(fullSizeUrl);
        addSelectionHighlight(img);
      });
      updateSelectionCount();
    });

    // Clear selection button
    document.getElementById("clear-selection").addEventListener("click", function() {
      selectedImages.clear();
      removeAllSelectionHighlights();
      updateSelectionCount();
    });

    if (DEBUG_MODE) {
      document.getElementById("upload-selected").addEventListener("click", function() {
        if (selectedImages.size > 0) {
          uploadSelectedImages(false);
        }
      });
    }

    // Upload to uguu.se + proxy (in production, this will automatically use proxy)
    document.getElementById("upload-with-proxy").addEventListener("click", function() {
      if (selectedImages.size > 0) {
        uploadSelectedImages(true);
      }
    });

    // Add click listeners for image selection
    document.addEventListener("click", function(e) {
      const img = e.target;
      if (img.tagName === "IMG" &&
          (img.classList.contains("highlighted-screenshot") ||
              img.classList.contains("downscalable-screenshot"))) {

        e.preventDefault();
        e.stopPropagation();
        toggleImageSelection(img);
      }
    });
  }

  function toggleImageSelection(img) {
    const fullSizeUrl = getFullSizeImageUrl(img);

    if (selectedImages.has(fullSizeUrl)) {
      selectedImages.delete(fullSizeUrl);
      removeSelectionHighlight(img);
    } else {
      selectedImages.add(fullSizeUrl);
      addSelectionHighlight(img);
    }

    updateSelectionCount();
  }

  function addSelectionHighlight(img) {
    if (!img.classList.contains("selected-screenshot")) {
      img.style.cssText += selectedStyle;
      img.classList.add("selected-screenshot");
    }
  }

  function removeSelectionHighlight(img) {
    img.style.cssText = img.style.cssText.replace(selectedStyle, "");
    img.classList.remove("selected-screenshot");
  }

  function removeAllSelectionHighlights() {
    document.querySelectorAll(".selected-screenshot").forEach(img => {
      removeSelectionHighlight(img);
    });
  }

  function updateSelectionCount() {
    const countElement = document.getElementById("selection-count");
    const uploadButton = document.getElementById("upload-selected");
    const uploadProxyButton = document.getElementById("upload-with-proxy");

    countElement.textContent = `Selected: ${selectedImages.size} images`;

    const hasSelection = selectedImages.size > 0;

    // Only update uguu.se button if it exists (debug mode)
    if (uploadButton) {
      uploadButton.disabled = !hasSelection;
      uploadButton.style.opacity = hasSelection ? "1" : "0.5";
    }

    uploadProxyButton.disabled = !hasSelection;
    uploadProxyButton.style.opacity = hasSelection ? "1" : "0.5";
  }

  function showCopyButton() {
    const container = document.getElementById("copy-button-container");

    // Remove existing copy button if present
    const existingButton = document.getElementById("copy-urls-button");
    if (existingButton) {
      existingButton.remove();
    }

    const copyButton = document.createElement("button");
    copyButton.id = "copy-urls-button";
    copyButton.style.cssText = `
      background-color: #FFA500;
      border: none;
      color: white;
      padding: 8px 10px;
      cursor: pointer;
      width: 100%;
      margin-bottom: 10px;
      font-weight: bold;
    `;
    copyButton.textContent = "Copy URLs to Clipboard";

    copyButton.addEventListener("click", async function() {
      try {
        await navigator.clipboard.writeText(lastUploadedUrls);
        copyButton.textContent = "✓ Copied!";
        copyButton.style.backgroundColor = "#32cd32";
        setTimeout(() => {
          copyButton.textContent = "Copy URLs to Clipboard";
          copyButton.style.backgroundColor = "#ffa500";
        }, 2000);
      } catch (e) {
        copyButton.textContent = "✗ Failed to copy";
        copyButton.style.backgroundColor = "#ff0000";
        console.error("Failed to copy to clipboard:", e);
        setTimeout(() => {
          copyButton.textContent = "Copy URLs to Clipboard";
          copyButton.style.backgroundColor = "#ffa500";
        }, 2000);
      }
    });

    container.appendChild(copyButton);
  }

  // Use GM_xmlhttpRequest to fetch images (bypasses CSP)
  function fetchImageWithGM(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: url,
        responseType: "blob",
        onload: function(response) {
          if (response.status >= 200 && response.status < 300) {
            resolve(response.response);
          } else {
            reject(new Error(`Failed to fetch image: ${response.status}`));
          }
        },
        onerror: function(response) {
          reject(new Error("Network error while fetching image"));
        },
      });
    });
  }

  async function uploadToUguu(blob, fileName) {
    return new Promise((resolve) => {
      const formData = new FormData();
      formData.append("files[]", blob, fileName);
      GM_xmlhttpRequest({
        method: "POST",
        url: "https://uguu.se/upload",
        data: formData,
        responseType: "json",
        onload: function(response) {
          if (response.status >= 200 && response.status < 300) {
            const result = response.response;
            if (result.files?.[0]?.url) {
              const unescapedUrl = result.files[0].url.replace(/\\\//g, "/");
              resolve(unescapedUrl);
            } else {
              logError(`Invalid JSON response from uguu.se API:`, result);
              resolve(null);
            }
          } else {
            logError(`Upload HTTP error! status: ${response.status}`, response);
            resolve(null);
          }
        },
        onerror: function(response) {
          logError("Upload failed (onerror):", response);
          resolve(null);
        },
      });
    });
  }


  async function uploadToProxy(imageUrl, maxRetries = 3) {
    if (!imageUrl) return null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await new Promise((resolve, reject) => {
          const proxyUrl = `https://gazellegames.net/imgup.php?img=${encodeURIComponent(imageUrl)}`;
          GM_xmlhttpRequest({
            method: "GET",
            url: proxyUrl,
            timeout: 30000,
            ontimeout: function() {
              reject(new Error("timeout"));
            },
            onload: function(response) {
              if (response.status >= 200 && response.status < 300) {
                const proxiedUrl = response.responseText.trim();
                if (proxiedUrl && proxiedUrl.startsWith("http")) {
                  resolve(proxiedUrl);
                } else {
                  reject(new Error(`Invalid response from GGn imgup.php: ${response.responseText}`));
                }
              } else {
                reject(new Error(`GGn proxy HTTP error! status: ${response.status}`));
              }
            },
            onerror: function(response) {
              reject(new Error("GGn proxy failed (onerror)"));
            },
          });
        });

        // If we get here, the request succeeded
        return result;

      } catch (error) {
        if (error.message === "timeout" && attempt < maxRetries) {
          logError(`Proxy timeout (attempt ${attempt}/${maxRetries}) for url: ${imageUrl}. Retrying...`);
          // Wait a bit before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, attempt * 2000));
          continue;
        } else if (attempt === maxRetries) {
          // Final attempt failed
          if (error.message === "timeout") {
            logError(`Proxy timeout after ${maxRetries} attempts for url: ${imageUrl}`);
          } else {
            logError(`Proxy failed after ${maxRetries} attempts for url: ${imageUrl}`, error.message);
          }
          return null;
        } else {
          // Non-timeout error, don't retry
          logError(`Proxy failed (non-timeout error) for url: ${imageUrl}`, error.message);
          return null;
        }
      }
    }

    return null;
  }

  async function downscaleImage(blob, targetWidth, targetHeight) {
    return new Promise((resolve) => {
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      img.onload = function() {
        // Set canvas dimensions to target size
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Draw the image scaled down to the canvas
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Convert canvas to blob as JPEG with high quality
        canvas.toBlob((downscaledBlob) => {
          resolve(downscaledBlob);
        }, "image/jpeg", 0.92);
      };

      img.onerror = function() {
        console.error("Failed to load image for downscaling");
        resolve(blob); // Return original blob if downscaling fails
      };

      // Create object URL from blob to load into image
      const objectUrl = URL.createObjectURL(blob);
      img.src = objectUrl;
    });
  }

  function shouldProcessImage(imageUrl) {
    // Find the corresponding image element to check its classification
    const imgs = document.querySelectorAll("img");
    for (const img of imgs) {
      const fullSizeUrl = getFullSizeImageUrl(img);
      if (fullSizeUrl === imageUrl) {
        // Only process exact matches or downscalable images
        return img.classList.contains("highlighted-screenshot") ||
            img.classList.contains("downscalable-screenshot");
      }
    }
    return false;
  }

  // Function to check if an image should be downscaled
  function shouldDownscaleImage(imageUrl) {
    // Find the corresponding image element to check its classification
    const imgs = document.querySelectorAll("img");
    for (const img of imgs) {
      const fullSizeUrl = getFullSizeImageUrl(img);
      if (fullSizeUrl === imageUrl && img.classList.contains("downscalable-screenshot")) {
        return true;
      }
    }
    return false;
  }

  async function uploadSelectedImages(useProxy = false) {
    const uploadButton = document.getElementById("upload-selected");
    const uploadProxyButton = document.getElementById("upload-with-proxy");
    const statusElement = document.getElementById("upload-status");

    // Get target dimensions from UI
    const currentTargetWidth = parseInt(document.getElementById("target-width").value);
    const currentTargetHeight = parseInt(document.getElementById("target-height").value);

    // Filter out non-matching images before processing
    const allUrls = Array.from(selectedImages);
    const processableUrls = allUrls.filter(url => shouldProcessImage(url));
    const skippedUrls = allUrls.filter(url => !shouldProcessImage(url));

    // If using proxy, separate previously uploaded images
    let newUrls = processableUrls;
    let alreadyUploadedUrls = [];

    if (useProxy) {
      newUrls = processableUrls.filter(url => !isAlreadyUploadedToProxy(url));
      alreadyUploadedUrls = processableUrls.filter(url => isAlreadyUploadedToProxy(url));
    }

    // Show initial status including all counts
    let statusText = "";
    if (skippedUrls.length > 0) {
      statusText += `Skipping ${skippedUrls.length} non-matching images. `;
    }
    if (alreadyUploadedUrls.length > 0) {
      statusText += `Skipping ${alreadyUploadedUrls.length} already uploaded images. `;
    }
    statusText += `Processing ${newUrls.length} ${useProxy ? "new " : ""}images...`;
    statusElement.innerHTML = statusText;

    // Disable both buttons (uploadButton might not exist in production)
    if (uploadButton) {
      uploadButton.disabled = true;
      uploadButton.textContent = "Uploading...";
    }
    uploadProxyButton.disabled = true;
    uploadProxyButton.textContent = "Uploading...";

    const results = [];
    let completed = 0;

    // Process skipped images first
    skippedUrls.forEach(imageUrl => {
      results.push({
        success: false,
        originalUrl: imageUrl,
        error: "Image skipped - incorrect resolution or aspect ratio",
        wasSkipped: true,
      });
    });

    // Process already uploaded images (only when using proxy)
    if (useProxy) {
      alreadyUploadedUrls.forEach(imageUrl => {
        const historyEntry = proxyUploadHistory.get(imageUrl);
        results.push({
          success: true,
          originalUrl: imageUrl,
          finalUrl: historyEntry.proxyUrl,
          wasDownscaled: historyEntry.wasDownscaled,
          wasAlreadyUploaded: true,
        });
      });
    }

    if (newUrls.length === 0) {
      if (alreadyUploadedUrls.length > 0 && useProxy) {
        statusElement.innerHTML = "All valid images were already uploaded to proxy previously. Using cached URLs.";
      } else {
        statusElement.innerHTML = "No valid images to upload. All selected images have incorrect resolution or aspect ratio.";
      }
    } else {
      statusElement.innerHTML = `Uploading 0/${newUrls.length} ${useProxy ? "new " : ""}images...`;

      for (const imageUrl of newUrls) {
        try {
          // Fetch the image using GM_xmlhttpRequest to bypass CSP
          statusElement.innerHTML = `Fetching ${completed + 1}/${newUrls.length} from Steam...`;
          let blob = await fetchImageWithGM(imageUrl);

          // Check if this image needs to be downscaled
          const needsDownscaling = shouldDownscaleImage(imageUrl);

          if (needsDownscaling) {
            statusElement.innerHTML = `Downscaling ${completed + 1}/${newUrls.length} to ${currentTargetWidth}x${currentTargetHeight}...`;
            blob = await downscaleImage(blob, currentTargetWidth, currentTargetHeight);
          }

          const fileName = `screenshot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`;

          // Upload to uguu.se
          statusElement.innerHTML = `Uploading ${completed + 1}/${newUrls.length} to uguu.se...`;
          const uguuUrl = await uploadToUguu(blob, fileName);

          if (!uguuUrl) {
            throw new Error("uguu.se upload failed");
          }

          let finalUrl = uguuUrl;
          let proxyUrl = null;

          // If using proxy, upload the uguu URL to proxy
          if (useProxy) {
            statusElement.innerHTML = `Uploading ${completed + 1}/${newUrls.length} to proxy...`;
            proxyUrl = await uploadToProxy(uguuUrl);
            if (proxyUrl) {
              finalUrl = proxyUrl;
              // Add to proxy upload history since proxy keeps images permanently
              addToProxyUploadHistory(imageUrl, proxyUrl, needsDownscaling);
            }
          }

          results.push({
            success: true,
            originalUrl: imageUrl,
            uguuUrl: uguuUrl,
            proxyUrl: proxyUrl,
            finalUrl: finalUrl,
            wasDownscaled: needsDownscaling,
          });

          completed++;
          statusElement.innerHTML = `Uploaded ${completed}/${newUrls.length} ${useProxy ? "new " : ""}images...`;

        } catch (error) {
          console.error("Upload failed for", imageUrl, error);
          results.push({
            success: false,
            originalUrl: imageUrl,
            error: error.message,
          });
          completed++;
          statusElement.innerHTML = `Uploading ${completed}/${newUrls.length} ${useProxy ? "new " : ""}images... (${results.filter(r => !r.success && !r.wasSkipped && !r.wasAlreadyUploaded).length} failed)`;
        }
      }
    }

    // Display results
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success && !r.wasSkipped);
    const skipped = results.filter(r => r.wasSkipped);
    const alreadyUploaded = results.filter(r => r.wasAlreadyUploaded);
    const downscaled = successful.filter(r => r.wasDownscaled);

    let resultText = `Upload complete: ${successful.length}/${allUrls.length} successful`;
    if (failed.length > 0) {
      resultText += `, ${failed.length} failed`;
    }
    if (skipped.length > 0) {
      resultText += `, ${skipped.length} skipped`;
    }
    if (alreadyUploaded.length > 0) {
      resultText += ` (${alreadyUploaded.length} from cache)`;
    }
    if (downscaled.length > 0) {
      resultText += ` (${downscaled.length} downscaled)`;
    }

    // Create detailed results
    let detailedResults = resultText + "<br><br>";

    if (successful.length > 0) {
      detailedResults += "<strong>Successful uploads:</strong><br>";
      successful.forEach((result, index) => {
        const downscaleNote = result.wasDownscaled ? " (downscaled)" : "";
        const cacheNote = result.wasAlreadyUploaded ? " (cached)" : "";
        detailedResults += `${index + 1}. ${result.finalUrl}${downscaleNote}${cacheNote}<br>`;
      });

      // Automatically copy to clipboard
      try {
        await navigator.clipboard.writeText(lastUploadedUrls);
        statusElement.innerHTML += "<br><small style=\"color: #90EE90;\">✓ URLs automatically copied to clipboard!</small>";
      } catch (e) {
        statusElement.innerHTML += "<br><small style=\"color: #FF6B6B;\">✗ Auto-copy failed. Use the button below.</small>";
        console.error("Failed to auto-copy to clipboard:", e);
      }
    }

    if (skipped.length > 0) {
      detailedResults += "<br><strong>Skipped images:</strong><br>";
      skipped.forEach((result, index) => {
        detailedResults += `${index + 1}. Incorrect resolution/aspect ratio<br>`;
      });
    }

    if (failed.length > 0) {
      detailedResults += "<br><strong>Failed uploads:</strong><br>";
      failed.forEach((result, index) => {
        detailedResults += `${index + 1}. Error: ${result.error}<br>`;
      });
    }

    statusElement.innerHTML = detailedResults;

    // Store URLs and show copy button if successful
    if (successful.length > 0) {
      lastUploadedUrls = successful.map(r => r.finalUrl).join("\n");
      console.log("Final URLs:\n", lastUploadedUrls);
      console.log("Detailed results:", successful);

      // Automatically copy to clipboard
      try {
        await navigator.clipboard.writeText(lastUploadedUrls);
        statusElement.innerHTML += "<br><small style=\"color: #90EE90;\">✓ URLs automatically copied to clipboard!</small>";
      } catch (e) {
        statusElement.innerHTML += "<br><small style=\"color: #FF6B6B;\">✗ Auto-copy failed. Use the button below.</small>";
        console.error("Failed to auto-copy to clipboard:", e);
      }
      // Show the copy button
      showCopyButton();
    }

    // Re-enable buttons
    if (uploadButton) {
      uploadButton.disabled = false;
      uploadButton.textContent = "Upload to uguu.se";
    }
    uploadProxyButton.disabled = false;
    uploadProxyButton.textContent = DEBUG_MODE ? "Upload + Proxy" : "Upload Images";
  }

  // Reset all highlights and badges
  function resetAllHighlights() {
    // Remove all highlights including selection highlights
    document.querySelectorAll(".highlighted-screenshot, .downscalable-screenshot, .non-match-screenshot, .selected-screenshot").forEach(img => {
      img.style.cssText = img.style.cssText
          .replace(exactMatchStyle, "")
          .replace(downscalableStyle, "")
          .replace(nonMatchStyle, "")
          .replace(selectedStyle, "");
      img.classList.remove("highlighted-screenshot", "downscalable-screenshot", "non-match-screenshot", "selected-screenshot");
    });

    // Remove all resolution badges
    document.querySelectorAll(".resolution-badge").forEach(badge => {
      badge.remove();
    });
  }

  // Use GM_xmlhttpRequest for dimension checking too
  function loadImageDimensions(url, callback) {
    // If this is a details page URL, we need to fetch the page first
    if (url.includes("/sharedfiles/filedetails/")) {
      fetchFullSizeImageFromDetailsPage(url, callback);
      return;
    }

    // Create a temporary image element to get dimensions
    const img = new Image();
    img.onload = function() {
      callback(this.width, this.height);
    };
    img.onerror = function() {
      console.error("Failed to load image for dimensions:", url);
      callback(0, 0);
    };

    // Try to load the image normally first
    img.src = url;

    // If it fails due to CSP, we can't get dimensions easily
    // In that case, we'll assume it's valid and let the upload process handle it
    setTimeout(() => {
      if (!img.complete) {
        console.warn("Image dimension check timed out, assuming valid:", url);
        callback(1920, 1080); // Default assumption
      }
    }, 5000);
  }

  // Use GM_xmlhttpRequest for fetching detail pages
  function fetchFullSizeImageFromDetailsPage(url, callback) {
    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      onload: function(response) {
        if (response.status === 200) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(response.responseText, "text/html");
          const mainImage = doc.querySelector(".screenshotHolder img");

          if (mainImage && mainImage.src) {
            let fullImageUrl = mainImage.src;
            console.log(fullImageUrl);

            // Remove any existing imw and imh parameters
            fullImageUrl = fullImageUrl.replace(/[?&]imw=\d+/, "").replace(/[?&]imh=\d+/, "");

            // Add parameters to force maximum dimensions
            if (fullImageUrl.includes("?")) {
              fullImageUrl += "&imw=5000&imh=5000";
            } else {
              fullImageUrl += "?imw=5000&imh=5000";
            }

            // Now load this image to get dimensions
            const img = new Image();
            img.onload = function() {
              callback(this.width, this.height);
            };
            img.onerror = function() {
              console.error("Failed to load image from details page:", fullImageUrl);
              callback(0, 0);
            };
            img.src = fullImageUrl;
          } else {
            console.error("Could not find main image in details page:", url);
            callback(0, 0);
          }
        } else {
          console.error("Failed to fetch details page:", url, response.status);
          callback(0, 0);
        }
      },
      onerror: function(response) {
        console.error("Failed to fetch details page (network error):", url);
        callback(0, 0);
      },
    });
  }

  // Check and highlight screenshots
  function highlightScreenshots(width, height) {
    let matchCount = 0;
    let checkCount = 0;
    let totalImages = 0;

    // Find all thumbnail images on the page
    const screenshotImages = document.querySelectorAll("img.apphub_CardContentPreviewImage");
    totalImages += screenshotImages.length;

    // If no images found, update status
    if (totalImages === 0) {
      document.getElementById("status").textContent = "No images found on this page";
      setTimeout(() => highlightScreenshots(width, height), 1000);
      return;
    }

    // Process all apphub_CardContentPreviewImage thumbnails
    screenshotImages.forEach(img => {
      processImage(img, width, height, () => {
        matchCount++;
        updateMatchCount(matchCount, totalImages);
      }, () => {
        checkCount++;
        updateProgress(checkCount, totalImages);
      });
    });
  }

  // Process an image by finding its full-size version and checking dimensions
  function processImage(img, targetWidth, targetHeight, onMatch, onChecked) {
    // Skip if already processed in this run
    if (img.dataset.dimensionsChecked === "true") {
      onChecked();
      return;
    }

    // Find the full-size image URL
    let fullSizeUrl = getFullSizeImageUrl(img);

    // If we already checked this URL, use cached result
    if (checkedImages.has(fullSizeUrl)) {
      const result = checkedImages.get(fullSizeUrl);
      if (result.matches === "exact") {
        highlightExactMatch(img, result.width, result.height);
        onMatch();
      } else if (result.matches === "downscalable") {
        highlightDownscalable(img, result.width, result.height);
        onMatch();
      } else {
        highlightNonMatch(img, result.width, result.height);
      }
      onChecked();
      img.dataset.dimensionsChecked = "true";
      return;
    }

    // Load the full-size image to check dimensions
    loadImageDimensions(fullSizeUrl, (width, height) => {
      // Debug logging to help identify the issue
      console.log(`Image dimensions detected: ${width}x${height} for URL: ${fullSizeUrl}`);

      // Check if exact match or downscalable
      let matchType = "none";

      if (width === targetWidth && height === targetHeight) {
        matchType = "exact";
        console.log(`Exact match: ${width}x${height}`);
        highlightExactMatch(img, width, height);
        onMatch();
      } else if (width >= targetWidth && height >= targetHeight) {
        // Check if aspect ratios match for clean downscaling
        const sourceRatio = width / height;
        const targetRatio = targetWidth / targetHeight;
        const tolerance = 0.01;

        console.log(`Checking downscalable: source ratio ${sourceRatio.toFixed(4)}, target ratio ${targetRatio.toFixed(4)}, difference ${Math.abs(sourceRatio - targetRatio).toFixed(4)}`);

        if (Math.abs(sourceRatio - targetRatio) <= tolerance) {
          matchType = "downscalable";
          console.log(`Downscalable match: ${width}x${height}`);
          highlightDownscalable(img, width, height);
          onMatch();
        } else {
          console.log(`Non-match (wrong aspect ratio): ${width}x${height}`);
          highlightNonMatch(img, width, height);
        }
      } else {
        console.log(`Non-match (too small): ${width}x${height}`);
        highlightNonMatch(img, width, height);
      }

      // Store in cache
      checkedImages.set(fullSizeUrl, {
        matches: matchType,
        width: width,
        height: height,
      });

      onChecked();
      img.dataset.dimensionsChecked = "true";
    });
  }

  // Get the full-size image URL from a thumbnail
  function getFullSizeImageUrl(img) {
    // For thumbnail in screenshots grid
    if (img.classList.contains("apphub_CardContentPreviewImage")) {
      // Find the parent card and get the link to the full screenshot
      const card = img.closest(".apphub_Card");
      if (card) {
        const link = card.querySelector("a.apphub_CardContentLink");
        if (link && link.href) {
          // Store the link for later use
          img.dataset.detailUrl = link.href;

          // Modify the URL to request maximum dimensions
          let url = link.href;
          // Add parameters to force maximum dimensions
          if (url.includes("?")) {
            url += "&imw=5000&imh=5000";
          } else {
            url += "?imw=5000&imh=5000";
          }
          return url;
        }
      }
    }

    // For the main image on a details page
    if (img.closest(".screenshotHolder")) {
      // Ensure we're getting the full-size image by adding/modifying parameters
      let url = img.src;

      // Remove any existing imw and imh parameters
      url = url.replace(/[?&]imw=\d+/, "").replace(/[?&]imh=\d+/, "");

      // Add maximum dimensions parameters
      if (url.includes("?")) {
        url += "&imw=5000&imh=5000";
      } else {
        url += "?imw=5000&imh=5000";
      }

      return url;
    }

    // Fallback - try to construct full-size URL from thumbnail with max dimensions
    let url = img.src.replace(/\.resizedimage/, "");
    if (url.includes("?")) {
      url += "&imw=5000&imh=5000";
    } else {
      url += "?imw=5000&imh=5000";
    }
    return url;
  }

  // Highlight exact matching image
  function highlightExactMatch(img, width, height) {
    img.style.cssText += exactMatchStyle;
    img.classList.add("highlighted-screenshot");
    addResolutionBadge(img, width, height, "rgba(118, 185, 0, 0.8)");
  }

  // Highlight downscalable image
  function highlightDownscalable(img, width, height) {
    img.style.cssText += downscalableStyle;
    img.classList.add("downscalable-screenshot");
    addResolutionBadge(img, width, height, "rgba(147, 112, 219, 0.8)");
  }

  // Highlight non-matching image
  function highlightNonMatch(img, width, height) {
    img.style.cssText += nonMatchStyle;
    img.classList.add("non-match-screenshot");
    addResolutionBadge(img, width, height, "rgba(255, 0, 0, 0.8)");
  }

  // Add a badge to indicate the resolution
  function addResolutionBadge(img, width, height, bgColor) {
    // Remove any existing badge first
    const container = img.closest(".apphub_Card") || img.parentElement;
    if (container) {
      const existingBadge = container.querySelector(".resolution-badge");
      if (existingBadge) {
        existingBadge.remove();
      }

      const badge = document.createElement("div");
      badge.className = "resolution-badge";
      badge.style.cssText = `
                position: absolute;
                top: 5px;
                right: 5px;
                background-color: ${bgColor};
                color: white;
                padding: 3px 6px;
                border-radius: 3px;
                font-size: 12px;
                font-weight: bold;
                z-index: 100;
            `;
      badge.textContent = `${width}×${height}`;

      // Make sure container has position relative for absolute positioning of badge
      if (window.getComputedStyle(container).position === "static") {
        container.style.position = "relative";
      }
      container.appendChild(badge);
    }
  }

  function updateProgress(checked, total) {
    const statusElement = document.getElementById("status");
    if (statusElement) {
      statusElement.textContent = `Checked ${checked} of ${total} images...`;
      if (checked >= total) {
        statusElement.textContent = "All images checked";
      }
    }
  }

  function updateMatchCount(count, total) {
    const matchCountElement = document.getElementById("match-count");
    if (matchCountElement) {
      const exactMatches = document.querySelectorAll(".highlighted-screenshot").length;
      const downscalableMatches = document.querySelectorAll(".downscalable-screenshot").length;
      const nonMatches = document.querySelectorAll(".non-match-screenshot").length;

      matchCountElement.innerHTML = `Found ${count} of ${total} images:<br>` +
          `<span style="color: #76b900;">Exact matches: ${exactMatches}</span><br>` +
          `<span style="color: #9370DB;">Downscalable: ${downscalableMatches}</span><br>` +
          `<span style="color: #FF0000;">Non-matches: ${nonMatches}</span>`;
    }
  }

  // Initialize the script
  function init() {
    // Load proxy upload history first
    loadProxyUploadHistory();

    addSettingsPanel();
    highlightScreenshots(targetWidth, targetHeight);

    // Add event listener for page navigation (for AJAX-loaded content)
    const observer = new MutationObserver(debounce(() => {
      const newImages = document.querySelectorAll("img.apphub_CardContentPreviewImage:not([data-dimensions-checked=\"true\"])");

      if (newImages.length > 0) {
        const width = parseInt(document.getElementById("target-width").value);
        const height = parseInt(document.getElementById("target-height").value);
        highlightScreenshots(width, height);
      }
    }, 500));

    // Start observing for dynamically loaded content
    observer.observe(document.body, { childList: true, subtree: true });

    // Also check when scrolling as Steam may load images lazily
    window.addEventListener("scroll", debounce(() => {
      const newImages = document.querySelectorAll("img.apphub_CardContentPreviewImage:not([data-dimensions-checked=\"true\"])");

      if (newImages.length > 0) {
        const width = parseInt(document.getElementById("target-width").value);
        const height = parseInt(document.getElementById("target-height").value);
        highlightScreenshots(width, height);
      }
    }, 250));
  }

  // Debounce function to limit how often a function can run
  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  // Wait for the page to be fully loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();