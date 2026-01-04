// ==UserScript==
// @name         GitZip Lite
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @namespace    https://github.com/tizee-tampermonkey-scripts/tampermonkey-gitzip-lite
// @version      1.6.3
// @description  Download selected files and folders from GitHub repositories.
// @author       tizee
// @match        https://github.com/*/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @require      https://unpkg.com/powerglitch@2.4.0/dist/powerglitch.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @connect      api.github.com
// @connect      raw.githubusercontent.com
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526002/GitZip%20Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/526002/GitZip%20Lite.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const itemCollectSelector =
    "div.js-navigation-item, table tbody tr.react-directory-row > td[class$='cell-large-screen']";
  const tokenKey = "githubApiToken";

  const { parseRepoURL, getGitURL, getInfoURL } = {
    parseRepoURL: (repoUrl) => {
      const repoExp = new RegExp(
        "^https://github.com/([^/]+)/([^/]+)(/(tree|blob)/([^/]+)(/(.*))?)?"
      );
      const matches = repoUrl.match(repoExp);

      if (!matches || matches.length === 0) return null;

      const author = matches[1];
      const project = matches[2];
      const branch = matches[5];
      const type = matches[4];
      const path = matches[7] || "";

      const rootUrl = branch
        ? `https://github.com/${author}/${project}/tree/${branch}`
        : `https://github.com/${author}/${project}`;

      if (!type && repoUrl.length - rootUrl.length > 1) {
        return null;
      }

      return {
        author,
        project,
        branch,
        type,
        path,
        inputUrl: repoUrl,
        rootUrl,
      };
    },
    getGitURL: (author, project, type, sha) => {
      if (type === "blob" || type === "tree") {
        const pluralType = type + "s";
        return `https://api.github.com/repos/${author}/${project}/git/${pluralType}/${sha}`;
      }
      return null;
    },
    getInfoURL: (author, project, path, branch) => {
      let url = `https://api.github.com/repos/${author}/${project}/contents/${path}`;
      if (branch) {
        url += `?ref=${branch}`;
      }
      return url;
    },
  };

  // --- GitZip Functions ---

  function base64toBlob(base64Data, contentType) {
    contentType = contentType || "";
    const sliceSize = 1024;
    const byteCharacters = atob(base64Data);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      const begin = sliceIndex * sliceSize;
      const end = Math.min(begin + sliceSize, bytesLength);

      const bytes = new Array(end - begin);
      for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  function callAjax(url, token) {
    return new Promise(function (resolve, reject) {
      GM_xmlhttpRequest({
        method: "GET",
        url: url,
        headers: {
          Authorization: token ? "token " + token : undefined,
          Accept: "application/json",
        },
        onload: function (response) {
          if (response.status >= 200 && response.status < 300) {
            try {
              const jsonResponse = JSON.parse(response.responseText);
              resolve({ response: jsonResponse });
            } catch (e) {
              console.debug("Error parsing JSON:", e);
              reject(e);
            }
          } else {
            console.debug("Request failed with status:", response.status);
            logMessage("ERROR", `Request failed with status: ${response.status}`);
            reject(response);
          }
        },
        onerror: function (error) {
          logMessage("ERROR", error);
          reject(error);
        },
      });
    });
  }

  // New dedicated function for binary downloads
  function downloadFile(url, token) {
    return new Promise(function (resolve, reject) {
      GM_xmlhttpRequest({
        method: "GET",
        url: url,
        responseType: "arraybuffer",
        headers: {
          Authorization: token ? "token " + token : undefined,
          Accept: "application/octet-stream",
        },
        onload: function (response) {
          if (response.status >= 200 && response.status < 300) {
            resolve(new Uint8Array(response.response));
          } else {
            reject(new Error(`Download failed: ${response.status}`));
          }
        },
        onerror: reject,
      });
    });
  }

  // --- End GitZip Functions ---

  function addCheckboxes() {
    const fileRows = document.querySelectorAll(itemCollectSelector);
    fileRows.forEach((row) => {
      if (row.querySelector(".gitziplite-check-wrap")) return;

      // Ensure the row is relatively positioned
      row.style.position = "relative";

      const checkboxContainer = document.createElement("div");
      checkboxContainer.classList.add("gitziplite-check-wrap");
      checkboxContainer.style.position = "absolute";
      checkboxContainer.style.left = "4px";
      checkboxContainer.style.top = "50%";
      checkboxContainer.style.transform = "translateY(-50%)";
      checkboxContainer.style.display = "flex";
      checkboxContainer.style.alignItems = "center";
      checkboxContainer.style.height = "100%";
      checkboxContainer.style.display = "none";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.add("gitziplite-checkbox");

      checkboxContainer.appendChild(checkbox);

      // Find the first element to insert before.  Handles both file and directory rows.
      const insertBeforeElement = row.firstChild;
      if (insertBeforeElement) {
        row.insertBefore(checkboxContainer, insertBeforeElement);
      } else {
        row.appendChild(checkboxContainer); // Fallback if no children exist
      }

      // Add event listeners for hover
      row.addEventListener("mouseenter", () => {
        checkboxContainer.style.display = "flex";
      });

      row.addEventListener("mouseleave", () => {
        if (!checkbox.checked) {
          checkboxContainer.style.display = "none";
        }
      });

      row.addEventListener("dblclick", () => {
        console.debug("double click", row, checkbox);
        if (checkbox.checked) {
          checkboxContainer.style.display = "none";
        } else {
          checkboxContainer.style.display = "flex";
        }
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event("change"));
      });

      // Add event listener for checkbox change
      checkbox.addEventListener("change", () => {
        let link;
        if (row.tagName === "TD") {
          link = row.querySelector("a[href]");
        } else {
          link = row.querySelector("a[href]");
        }

        if (link) {
          const title = link.textContent.trim();
          const command = checkbox.checked ? "SELECT" : "UNSELECT";
          logMessage(command, title);
        }
      });
    });
  }

  let logWindow;
  let logToggleButton;
  let downloadButton;
  let mainContainer;
  let stickerButton;

  // Add global styles
  GM_addStyle(`
    /* Container Styles */
    .gitziplite-container {
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        z-index: 1000;
        width: 480px;
        background-color: rgba(28, 28, 30, 0.95);
        border-radius: 16px;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
        padding: 1.25rem;
        backdrop-filter: blur(20px);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
        border: 1px solid rgba(255, 255, 255, 0.08);
        display: none; /* Hide window by default */
    }

    /* Sidebar sticker button */
    .gitziplite-sticker-button {
        position: fixed;
        right: 0;
        top: 30%;
        background-color: rgba(28, 28, 30, 0.95);
        color: white;
        border-radius: 8px 0 0 8px;
        padding: 10px;
        cursor: pointer;
        z-index: 999;
        box-shadow: -2px 0 8px rgba(0, 0, 0, 0.2);
        transition: all 0.2s ease;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-right: none;
    }

    .gitziplite-sticker-button:hover {
        background-color: rgba(40, 40, 45, 0.95);
        transform: translateX(-2px);
    }

    /* Hide button for the container */
    .gitziplite-hide-button {
        position: absolute;
        top: -14px;
        right: -14px;
        width: 28px;
        height: 28px;
        border-radius: 14px;
        background-color: rgba(28, 28, 30, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: white;
        font-size: 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s ease;
        z-index: 1001;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .gitziplite-hide-button:hover {
        background-color: rgba(40, 40, 45, 0.95);
    }

    /* Log Window Styles */
    .gitziplite-log {
        width: 100%;
        height: 16rem;
        margin-bottom: 0.75rem;
        overflow-y: auto;
        border-radius: 12px;
        background-color: rgba(0, 0, 0, 0.25);
        color: #E4E4E4;
        font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, monospace;
        font-size: 12px;
        line-height: 1.5;
        padding: 0.75rem;
        scrollbar-width: thin;
        scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        border: 1px solid rgba(255, 255, 255, 0.06);
    }

    /* Scrollbar Styles */
    .gitziplite-log::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }

    .gitziplite-log::-webkit-scrollbar-track {
        background: transparent;
    }

    .gitziplite-log::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
    }

    .gitziplite-log::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.3);
    }

    /* Log Entry Styles */
    .gitziplite-log-entry {
        padding: 0.25rem 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        opacity: 0;
        transform: translateY(10px);
        animation: gitziplite-fadeIn 0.2s ease-out forwards;
    }

    .gitziplite-log-timestamp {
        color: #8E8E93;
        min-width: 5.5rem;
        font-feature-settings: "tnum";
        font-variant-numeric: tabular-nums;
    }

    .gitziplite-log-command {
        min-width: 5rem;
        padding: 0.125rem 0.5rem;
        border-radius: 6px;
        font-weight: 500;
        text-align: center;
        backdrop-filter: blur(8px);
    }

    .gitziplite-log-content {
        color: #E4E4E4;
        flex: 1;
    }

    /* Button Container */
    .gitziplite-buttons {
        display: flex;
        gap: 0.75rem;
        justify-content: space-between;
        align-items: center;
    }

    /* Button Styles */
    .gitziplite-button {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
        font-size: 13px;
        font-weight: 510;
        padding: 0.625rem 1rem;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        border: none;
        outline: none;
        white-space: nowrap;
        user-select: none;
        position: relative;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .gitziplite-button-primary {
        background-color: #0A84FF;
        color: white;
    }

    .gitziplite-button-primary:hover {
        background-color: #007AFF;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(10, 132, 255, 0.3);
    }

    .gitziplite-button-primary:active {
        transform: translateY(0);
        background-color: #0062CC;
        box-shadow: 0 1px 2px rgba(10, 132, 255, 0.2);
    }

    .gitziplite-button-secondary {
        background-color: rgba(255, 255, 255, 0.1);
        color: #FFFFFF;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .gitziplite-button-secondary:hover {
        background-color: rgba(255, 255, 255, 0.15);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .gitziplite-button-secondary:active {
        transform: translateY(0);
        background-color: rgba(255, 255, 255, 0.05);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    /* Animation */
    @keyframes gitziplite-fadeIn {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
  `);

  function createDownloadButton() {
    // Create sticker button for the sidebar
    stickerButton = document.createElement("div");
    stickerButton.className = "gitziplite-sticker-button";
    stickerButton.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center;">
            <svg width="16" height="16" viewBox="0 0 16 16" style="margin-bottom: 8px;">
                <path fill="currentColor" d="M8 12l-4.5-4.5 1.5-1.5L7 8.25V2h2v6.25L11 6l1.5 1.5L8 12zm-6 2v-2h12v2H2z"></path>
            </svg>
            <div style="writing-mode: vertical-lr; transform: rotate(180deg); font-size: 12px; letter-spacing: 1px; margin-top: 5px;">GitZip</div>
        </div>
    `;
    stickerButton.setAttribute("title", "Show GitZip Download Window");
    stickerButton.addEventListener("click", () => {
      mainContainer.style.display = "block";
      stickerButton.style.display = "none";
    });
    document.body.appendChild(stickerButton);

    // Main container
    mainContainer = document.createElement("div");
    mainContainer.className = "gitziplite-container";

    // Hide button
    const hideButton = document.createElement("button");
    hideButton.className = "gitziplite-hide-button";
    hideButton.innerHTML = "✕";
    hideButton.setAttribute("title", "Hide Download Window");
    hideButton.addEventListener("click", () => {
      mainContainer.style.display = "none";
      stickerButton.style.display = "block";
    });
    mainContainer.appendChild(hideButton);

    // Log Window Container
    logWindow = document.createElement("div");
    logWindow.setAttribute("aria-label", "Log Window");
    logWindow.className = "gitziplite-log";
    logWindow.style.display = "none";

    // Button Container
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "gitziplite-buttons";

    // Log Toggle Button
    logToggleButton = document.createElement("button");
    logToggleButton.textContent = "Show Log";
    logToggleButton.className = "gitziplite-button gitziplite-button-secondary";
    logToggleButton.addEventListener("click", () => {
      logWindow.style.display =
        logWindow.style.display === "none" ? "block" : "none";
      logToggleButton.textContent =
        logWindow.style.display === "none" ? "Show Log" : "Hide Log";
    });

    // Download Button
    downloadButton = document.createElement("button");
    downloadButton.textContent = "Download Selected";
    downloadButton.className = "gitziplite-button gitziplite-button-primary";
    downloadButton.addEventListener("click", downloadSelected);

    // Assemble the UI
    buttonContainer.appendChild(logToggleButton);
    buttonContainer.appendChild(downloadButton);
    mainContainer.appendChild(logWindow);
    mainContainer.appendChild(buttonContainer);
    document.body.appendChild(mainContainer);

    // Hide the window by default
    mainContainer.style.display = "none";
    stickerButton.style.display = "block";
  }

  function logMessage(command, content) {
    const now = new Date();
    const timestamp = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

    const commandColors = {
      ERROR: { bg: "#FF453A20", color: "#FF453A" },
      SUCCESS: { bg: "#32D74B20", color: "#32D74B" },
      PROCESS: { bg: "#0A84FF20", color: "#0A84FF" },
      SELECT: { bg: "#FFD60A20", color: "#FFD60A" },
      UNSELECT: { bg: "#FFD60A20", color: "#FFD60A" },
      INFO: { bg: "#64D2FF20", color: "#64D2FF" },
    };

    const colorScheme =
      commandColors[command.toUpperCase()] || commandColors.INFO;

    const logEntry = document.createElement("div");
    logEntry.className = "gitziplite-log-entry";
    logEntry.innerHTML = `
        <span class="gitziplite-log-timestamp">${timestamp}</span>
        <span class="gitziplite-log-command" style="background: ${colorScheme.bg}; color: ${colorScheme.color}">
            ${command}
        </span>
        <span class="gitziplite-log-content">${content}</span>
    `;

    logWindow.appendChild(logEntry);
    logWindow.scrollTop = logWindow.scrollHeight;
  }

  /**
   * Collects selected files and folders from the DOM.
   * @returns {{files: [], folders: []}} - An object containing arrays of selected files and folders.
   */
  function collectSelectedItems() {
    const selectedFiles = [];
    const selectedFolders = [];
    const checkboxes = document.querySelectorAll(
      ".gitziplite-checkbox:checked"
    );

    checkboxes.forEach((checkbox) => {
      const row = checkbox.parentNode.parentNode; // Direct parent access
      if (!row) {
        console.warn("Could not find a parent row for a selected checkbox.");
        return; // Skip to the next checkbox
      }
      console.debug(row);
      let link;

      if (row.tagName === "TD") {
        link = row.querySelector("a[href]");
      } else {
        link = row.querySelector("a[href]");
      }

      if (link) {
        const href = link.href;
        const title = link.textContent.trim();
        const resolved = parseRepoURL(href);
        if (resolved && resolved.type === "blob") {
          selectedFiles.push({ href: href, title: title });
        } else if (resolved && resolved.type === "tree") {
          selectedFolders.push({ href: href, title: title });
        }
      }
    });

    return { files: selectedFiles, folders: selectedFolders };
  }

  /**
   * Zips the given contents and triggers a download.
   * @param {Array<{path: string, content: string}>} allContents - Array of file contents to zip.
   * @param {object} resolvedUrl - Parsed URL information of the repository.
   */
  function zipAndDownload(allContents, resolvedUrl) {
    if (allContents.length === 1) {
      // Handle single file download
      const singleItem = allContents[0];
      console.debug(singleItem);
      if (singleItem.isBinary) {
        // Create Blob directly from Uint8Array
        const blob = new Blob([singleItem.content], {
          type: "application/octet-stream",
        });
        saveAs(blob, singleItem.path);
      } else {
        // Handle base64 encoded text files
        const blob = base64toBlob(singleItem.content, "");
        saveAs(blob, singleItem.path);
      }
    } else {
      // Handle zip archive creation
      try {
        const currDate = new Date();
        const dateWithOffset = new Date(
          currDate.getTime() - currDate.getTimezoneOffset() * 60000
        );
        window.JSZip.defaults.date = dateWithOffset;

        const zip = new window.JSZip();
        allContents.forEach((item) => {
          if (item.isBinary) {
            // Add binary file as Uint8Array
            zip.file(item.path, item.content, {
              createFolders: true,
              binary: true,
              date: dateWithOffset,
            });
          } else {
            // Add base64 encoded file
            zip.file(item.path, item.content, {
              createFolders: true,
              base64: true,
              date: dateWithOffset,
            });
          }
        });

        zip.generateAsync({ type: "blob" }).then((content) => {
          saveAs(
            content,
            [resolvedUrl.project]
              .concat(resolvedUrl.path.split("/"))
              .join("-") + ".zip"
          );
        });
      } catch (error) {
        console.debug("Error zipping files:", error);
        logMessage("ERROR", "zipping files.");
      }
    }
  }

  async function downloadSelected() {
    const { files: selectedFiles, folders: selectedFolders } =
      collectSelectedItems();

    if (selectedFiles.length === 0 && selectedFolders.length === 0) {
      logMessage("ERROR", "No files or folders selected.");
      return;
    }

    const resolvedUrl = parseRepoURL(window.location.href);
    if (!resolvedUrl) {
      logMessage("ERROR", "Could not resolve repository URL.");
      return;
    }

    const githubToken = GM_getValue(tokenKey);

    const allContents = [];

    async function processFolder(folder, pathPrefix = "") {
      logMessage("PROCESS", `${folder.title}`);
      const folderResolvedUrl = parseRepoURL(folder.href);
      const apiUrl = getInfoURL(
        folderResolvedUrl.author,
        folderResolvedUrl.project,
        folderResolvedUrl.path,
        folderResolvedUrl.branch
      );

      try {
        const xmlResponse = await callAjax(apiUrl, githubToken);
        const folderContents = xmlResponse.response;

        for (const item of folderContents) {
          const itemPath = pathPrefix + "/" + item.name;
          if (item.type === "file") {
            logMessage("PROCESS", `${itemPath}`);
            const fileInfoUrl = getInfoURL(
              folderResolvedUrl.author,
              folderResolvedUrl.project,
              folderResolvedUrl.path + "/" + item.name,
              folderResolvedUrl.branch
            );
            const fileXmlResponse = await callAjax(fileInfoUrl, githubToken);
            const fileContent = fileXmlResponse.response;
            allContents.push({
              path: itemPath,
              content: fileContent.content,
            });
          } else if (item.type === "dir") {
            await processFolder(
              { href: folder.href + "/" + item.name, title: item.name },
              itemPath
            );
          }
        }
      } catch (error) {
        console.debug("Error fetching folder:", folder.title, error);
        logMessage("ERROR", `Error fetching folder: ${folder.title}`);
      }
    }

    for (const folder of selectedFolders) {
      await processFolder(folder, folder.title);
    }

    for (const file of selectedFiles) {
      logMessage("PROCESS", `${file.title}`);
      const fileResolvedUrl = parseRepoURL(file.href);
      const infoUrl = getInfoURL(
        fileResolvedUrl.author,
        fileResolvedUrl.project,
        fileResolvedUrl.path,
        fileResolvedUrl.branch
      );
      logMessage("PROCESS", `${infoUrl}`);
      console.debug(`file info url: ${infoUrl}`);
      try {
        const xmlResponse = await callAjax(infoUrl, githubToken);
        const fileContent = xmlResponse.response;

        if (fileContent.encoding === "base64" && fileContent.content) {
          allContents.push({
            path: file.title,
            content: fileContent.content,
            isBinary: false,
          });
        } else if (fileContent.download_url) {
          // Handle binary file with dedicated download function
          const binaryData = await downloadFile(
            fileContent.download_url,
            githubToken
          );
          allContents.push({
            path: file.title,
            content: binaryData,
            isBinary: true,
          });
        }
      } catch (error) {
        console.debug("Error fetching file:", file.title, error);
        logMessage("ERROR", `fetching file: ${file.title}`);
        return;
      }
    }

    zipAndDownload(allContents, resolvedUrl);
    logMessage("SUCCESS", "Download complete.");
  }

  // Register menu command for setting token
  GM_registerMenuCommand("Set GitHub API Token", () => {
    const token = prompt("Enter your GitHub API token:");
    if (token) {
      GM_setValue(tokenKey, token);
      alert("Token saved successfully!");
    }
  });

  function onDomLoaded() {
    addCheckboxes();
    createDownloadButton();
  }

  function onUrlChange() {
    addCheckboxes();
  }

  // Initialize
  onDomLoaded();
  // Glitch Animation
  PowerGlitch.glitch(logToggleButton, {
    playMode: "click",
    timing: {
      duration: 400,
      easing: "ease-in-out",
    },
    shake: {
      velocity: 20,
      amplitudeX: 0,
      amplitudeY: 0.1,
    },
  });
  PowerGlitch.glitch(downloadButton, {
    playMode: "click",
    timing: {
      duration: 400,
      easing: "ease-in-out",
    },
  });

  // Observe GitHub repository page URL changes (e.g., navigating into a new directory)
  const observer = new MutationObserver(onUrlChange);
  observer.observe(document.body, { childList: true, subtree: true });
})();
