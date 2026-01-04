// ==UserScript==
// @name         VSCode Marketplace VSIX Downloader
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Adds a "Download VSIX" button to VSCode Marketplace extension pages, downloading the file as [ExtensionName][Version].vsix. Waits for dynamic content.
// @author       Your Name/Adapted from Context
// @match        https://marketplace.visualstudio.com/items?itemName=*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/537560/VSCode%20Marketplace%20VSIX%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/537560/VSCode%20Marketplace%20VSIX%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.getElementById('vsix-downloader-button')) {
        console.log('VSIX Downloader: Button already exists (initial check).');
        return;
    }

    const extensionDetails = {
        version: "",
        publisher: "",
        identifier: "",

        getDownloadUrl: function() {
            if (!this.identifier || this.identifier.split(".").length < 2) {
                 console.error("VSIX Downloader: Invalid or missing identifier for download URL. Identifier:", this.identifier);
                 return "#error-missing-info-for-url";
            }
            const publisherFromName = this.identifier.split(".")[0];
            const extensionNamePart = this.identifier.substring(publisherFromName.length + 1);

            if (!publisherFromName || !extensionNamePart || !this.version) {
                console.error("VSIX Downloader: Missing critical info for download URL. Publisher:", publisherFromName, "ExtName:", extensionNamePart, "Version:", this.version, "Full Identifier:", this.identifier);
                return "#error-missing-info-for-url";
            }

            return [
                "https://", publisherFromName, ".gallery.vsassets.io/_apis/public/gallery/publisher/",
                publisherFromName, "/extension/", extensionNamePart, "/",
                this.version, "/assetbyname/Microsoft.VisualStudio.Services.VSIXPackage"
            ].join("");
        },

        getFileName: function() {
            if (!this.identifier || !this.version || !this.identifier.includes('.')) {
                console.error("VSIX Downloader: Missing critical info or invalid identifier for filename:", this);
                return "error_unknown_extension.vsix";
            }
            // Extract extension name (part after the first dot in identifier)
            const extensionName = this.identifier.substring(this.identifier.indexOf('.') + 1);
            // Format: [title][version].vsix
            // Sanitize parts to remove characters that might be problematic in filenames,
            // though typical extension names and versions are usually fine.
            // For this version, we'll concatenate directly as requested.
            // Consider adding sanitization if issues arise with specific extension names/versions.
            const cleanExtensionName = extensionName.replace(/[^a-zA-Z0-9_.-]/g, '_'); // Basic sanitization
            const cleanVersion = this.version.replace(/[^a-zA-Z0-9_.-]/g, '_'); // Basic sanitization

            return `${cleanExtensionName}${cleanVersion}.vsix`;
        },

        getDownloadButton: function() {
            var button = document.createElement("a");
            button.id = "vsix-downloader-button";
            button.innerHTML = "Download VSIX";
            button.href = "javascript:void(0);"; // Will be handled by onclick
            button.style.fontFamily = "wf_segoe-ui, Helvetica Neue, Helvetica, Arial, Verdana";
            button.style.display = "inline-block";
            button.style.padding = "4px 8px";
            button.style.background = "darkgreen";
            button.style.color = "white";
            button.style.fontWeight = "bold";
            button.style.margin = "5px";
            button.style.borderRadius = "3px";
            button.style.textDecoration = "none";

            const downloadUrl = this.getDownloadUrl();
            const fileName = this.getFileName();

            if (downloadUrl === "#error-missing-info-for-url" || fileName === "error_unknown_extension.vsix") {
                button.innerHTML = "Error: Info Missing";
                button.style.background = "darkred";
                button.title = "Could not determine download URL or filename. Required information is missing or invalid.";
                button.onclick = (e) => {
                    e.preventDefault();
                    alert("VSIX Downloader Error: Information to construct download URL or filename is missing. The page might not have fully loaded or there's an issue fetching extension details.");
                };
                return button;
            }

            button.setAttribute("data-url", downloadUrl);
            button.setAttribute("data-filename", fileName);
            button.title = `Download ${fileName}`;

            button.onclick = function(event) {
                event.preventDefault();
                const clickedButton = event.target.closest('a'); // Ensure we get the button itself
                const effectiveDownloadUrl = clickedButton.getAttribute("data-url");
                const effectiveFileName = clickedButton.getAttribute("data-filename");

                if (effectiveDownloadUrl === "#error-missing-info-for-url") {
                    clickedButton.innerHTML = "Error: Info Missing";
                    clickedButton.style.background = "darkred";
                    alert("VSIX Downloader Error: Information to construct download URL is missing (re-check).");
                    return;
                }

                // Store original click handler to restore it later
                if (!clickedButton.hasOwnProperty('originalOnClick')) {
                    clickedButton.originalOnClick = clickedButton.onclick;
                }
                clickedButton.onclick = null; // Disable button during download
                clickedButton.innerHTML = "Downloading VSIX...";
                clickedButton.style.background = "darkorange";

                var xhr = new XMLHttpRequest();
                console.log("VSIX Downloader: Attempting to download from:", effectiveDownloadUrl, "as", effectiveFileName);
                xhr.open("GET", effectiveDownloadUrl, true);
                xhr.responseType = "blob";

                xhr.onprogress = function(progressEvent) {
                    if (progressEvent.lengthComputable) {
                        var percentComplete = (progressEvent.loaded / progressEvent.total * 100).toFixed(0);
                        clickedButton.innerHTML = "Downloading VSIX... " + percentComplete + "%";
                    }
                };

                xhr.onload = function() {
                    if (this.status === 200) {
                        var blobResponse = this.response;
                        var downloadLink = document.createElement("a");
                        downloadLink.href = window.URL.createObjectURL(blobResponse);
                        downloadLink.download = effectiveFileName;
                        document.body.appendChild(downloadLink);
                        downloadLink.click();
                        document.body.removeChild(downloadLink);
                        window.URL.revokeObjectURL(downloadLink.href);

                        clickedButton.innerHTML = "Download VSIX"; // Reset
                        clickedButton.style.background = "darkgreen";
                        if (clickedButton.originalOnClick) {
                             clickedButton.onclick = clickedButton.originalOnClick;
                        } else { // Fallback if originalOnClick somehow not set
                             const currentButtonRef = document.getElementById("vsix-downloader-button");
                             if(currentButtonRef) currentButtonRef.onclick = extensionDetails.getDownloadButton().onclick; // Re-assign a fresh handler
                        }
                    } else {
                        clickedButton.innerHTML = "Error " + this.status + ". Retry?";
                        clickedButton.style.background = "darkred";
                        alert("Error " + this.status + " error receiving the document.");
                        if (clickedButton.originalOnClick) clickedButton.onclick = clickedButton.originalOnClick;
                    }
                };
                xhr.onerror = function() {
                    clickedButton.innerHTML = "Network Error. Retry?";
                    clickedButton.style.background = "darkred";
                    alert("Error " + xhr.status + " occurred while receiving the document (XHR onerror).");
                    if (clickedButton.originalOnClick) clickedButton.onclick = clickedButton.originalOnClick;
                };
                xhr.send();
            };
            return button;
        }
    };

    const getTextFromAriaLabelledBy = (label) => {
        const cell = document.querySelector(`td[aria-labelledby='${label}']`);
        return cell ? cell.innerText.trim() : "";
    };

    function attemptAndSetup(logVerbose) {
        extensionDetails.version = "";
        extensionDetails.identifier = "";

        // --- Data Gathering ---
        let tempVersion = getTextFromAriaLabelledBy("version");
        if (tempVersion) extensionDetails.version = tempVersion;
        if (logVerbose && extensionDetails.version) console.log("VSIX Downloader: Version from aria-labelledby:", extensionDetails.version);
        else if (logVerbose && !extensionDetails.version) console.warn("VSIX Downloader: Version not found via aria-labelledby.");

        let publisherFromTableAria = getTextFromAriaLabelledBy("publisher");
        let identifierFromTableAria = getTextFromAriaLabelledBy("identifier");

        if (logVerbose && publisherFromTableAria) console.log("VSIX Downloader: Publisher from table (aria-labelledby):", publisherFromTableAria);
        if (logVerbose && identifierFromTableAria) console.log("VSIX Downloader: Identifier from table (aria-labelledby):", identifierFromTableAria);

        const urlParams = new URLSearchParams(window.location.search);
        const itemNameFromUrl = urlParams.get('itemName');

        if (itemNameFromUrl) {
            extensionDetails.identifier = itemNameFromUrl;
            if (logVerbose) console.log("VSIX Downloader: Identifier from URL (using as primary):", extensionDetails.identifier);
            if (identifierFromTableAria && identifierFromTableAria !== extensionDetails.identifier && logVerbose) {
                console.warn(`VSIX Downloader: Identifier from table ('${identifierFromTableAria}') differs from URL ('${extensionDetails.identifier}'). Prioritizing URL version.`);
            }
        } else if (identifierFromTableAria) {
            extensionDetails.identifier = identifierFromTableAria;
            if (logVerbose) console.log("VSIX Downloader: Identifier from table (aria-labelledby, URL itemName not found):", extensionDetails.identifier);
        }

        if (extensionDetails.identifier && extensionDetails.identifier.includes('.')) {
            extensionDetails.publisher = extensionDetails.identifier.split('.')[0];
            if (logVerbose) console.log("VSIX Downloader: Publisher derived from final identifier:", extensionDetails.publisher);
            if (publisherFromTableAria && publisherFromTableAria !== extensionDetails.publisher && logVerbose) {
                console.warn(`VSIX Downloader: Publisher from table (aria-labelledby '${publisherFromTableAria}') differs from identifier-derived ('${extensionDetails.publisher}'). Using identifier-derived for download URL.`);
            }
        } else if (publisherFromTableAria) {
            extensionDetails.publisher = publisherFromTableAria;
            if (logVerbose) console.log("VSIX Downloader: Publisher from table (aria-labelledby, identifier missing or not dot-separated):", extensionDetails.publisher);
        }

        if (!extensionDetails.version || !extensionDetails.publisher || !extensionDetails.identifier) {
            if (logVerbose) console.warn("VSIX Downloader: Critical details missing after specific checks. Attempting broader table scan as fallback.");
            const metadataTableRows = document.querySelectorAll(".ux-table-metadata tr");
            if (metadataTableRows.length > 0) {
                const keyMappings = { "Version": "version", "Publisher": "publisher", "Unique Identifier": "identifier" };
                for (const row of metadataTableRows) {
                    if (row.cells.length === 2) {
                        const keyText = row.cells[0].innerText.trim();
                        const valueText = row.cells[1].innerText.trim();
                        if (keyMappings.hasOwnProperty(keyText)) {
                            const detailKey = keyMappings[keyText];
                            if (!extensionDetails[detailKey] && valueText) {
                                extensionDetails[detailKey] = valueText;
                                if (logVerbose) console.log(`VSIX Downloader: Fallback table scan - found ${detailKey}: ${valueText}`);
                            }
                        }
                    }
                }
                if (extensionDetails.identifier && extensionDetails.identifier.includes('.') &&
                    (!extensionDetails.publisher || extensionDetails.publisher !== extensionDetails.identifier.split('.')[0])) {
                    extensionDetails.publisher = extensionDetails.identifier.split('.')[0];
                    if (logVerbose) console.log("VSIX Downloader: Fallback scan - Re-derived publisher from identifier:", extensionDetails.publisher);
                }
            }
        }
        // --- End Data Gathering ---

        let missingInfoForSetup = [];
        if (!extensionDetails.identifier) missingInfoForSetup.push("identifier");
        if (!extensionDetails.version) missingInfoForSetup.push("version");
        if (extensionDetails.identifier && extensionDetails.identifier.split(".").length < 2) {
             if (!missingInfoForSetup.includes("identifier")) {
                missingInfoForSetup.push("identifier format (expected publisher.extensionName)");
             }
        }

        if (missingInfoForSetup.length > 0) {
            if (logVerbose) {
                console.warn("VSIX Downloader: Waiting for critical info: " + missingInfoForSetup.join(", ") + ". Current details:", JSON.stringify(extensionDetails));
            }
            return false;
        }

        const potentialDownloadUrl = extensionDetails.getDownloadUrl();
        const potentialFileName = extensionDetails.getFileName();
        if (potentialDownloadUrl === "#error-missing-info-for-url" || potentialFileName === "error_unknown_extension.vsix") {
            if (logVerbose) {
                console.warn("VSIX Downloader: Cannot form valid download URL or filename yet. Details:", JSON.stringify(extensionDetails), "URL:", potentialDownloadUrl, "File:", potentialFileName);
            }
            return false;
        }

        const buttonInsertionPoint = document.querySelector(".vscode-moreinformation");
        let actualInsertionParent = null;
        let fallbackUsed = false;

        if (buttonInsertionPoint && buttonInsertionPoint.parentElement) {
            actualInsertionParent = buttonInsertionPoint.parentElement;
        } else {
            const fallbackPoint = document.querySelector(".gallery-banner .control-section") || document.querySelector(".gallery-banner");
            if (fallbackPoint) {
                actualInsertionParent = fallbackPoint;
                fallbackUsed = true;
            }
        }

        if (!actualInsertionParent) {
            if (logVerbose) console.warn("VSIX Downloader: Button insertion point not yet available.");
            return false;
        }

        if (document.getElementById('vsix-downloader-button')) {
            return true;
        }

        const downloadButton = extensionDetails.getDownloadButton();
        actualInsertionParent.appendChild(downloadButton);

        if (fallbackUsed) {
            console.warn("VSIX Downloader: Button added to a fallback location. Details:", JSON.stringify(extensionDetails));
        } else {
            console.log("VSIX Downloader: Button added successfully. Details:", JSON.stringify(extensionDetails));
        }
        return true;
    }

    let attempts = 0;
    const maxAttempts = 30;
    const retryInterval = 1000;

    const intervalId = setInterval(() => {
        attempts++;
        let logThisAttemptVerbose = (attempts >= maxAttempts);

        if (document.getElementById('vsix-downloader-button')) {
            clearInterval(intervalId);
            return;
        }

        if (attemptAndSetup(logThisAttemptVerbose || attempts === 1)) {
            clearInterval(intervalId);
        } else if (attempts >= maxAttempts) {
            clearInterval(intervalId);
            console.error("VSIX Downloader: Failed to add button after " + maxAttempts + " attempts. Necessary information, a valid download URL/filename, or DOM elements might not be available.");

            if (!document.getElementById('vsix-downloader-button') && !document.getElementById('vsix-downloader-error-message')) {
                let errorReason = "";
                let missingInfoStrings = [];
                if (!extensionDetails.version) missingInfoStrings.push("version");
                if (!extensionDetails.identifier) {
                    missingInfoStrings.push("identifier");
                } else if (extensionDetails.identifier.split(".").length < 2) {
                    if (!missingInfoStrings.includes("identifier")) missingInfoStrings.push("identifier format (publisher.extName)");
                }

                if (missingInfoStrings.length > 0) {
                    errorReason = `Failed to find ${missingInfoStrings.join(" and ")}.`;
                } else if (extensionDetails.getDownloadUrl() === "#error-missing-info-for-url" || extensionDetails.getFileName() === "error_unknown_extension.vsix") {
                    errorReason = `Found some details, but could not form a valid download URL or filename. (Identifier: '${extensionDetails.identifier}', Version: '${extensionDetails.version}')`;
                } else {
                    errorReason = `Timed out. Could not find insertion point or other unknown issue.`;
                }

                const errorDisplayPoint = document.querySelector(".vscode-moreinformation")?.parentElement || document.querySelector(".gallery-banner") || document.body;
                if (errorDisplayPoint) {
                    const errorMsgElement = document.createElement('div');
                    errorMsgElement.id = "vsix-downloader-error-message";
                    errorMsgElement.textContent = `VSIX Downloader: ${errorReason} Cannot add download button.`;
                    errorMsgElement.style.color = 'red';
                    errorMsgElement.style.fontWeight = 'bold';
                    errorMsgElement.style.padding = '10px';
                    errorMsgElement.style.border = '1px solid red';
                    errorMsgElement.style.marginTop = '10px';

                    if (errorDisplayPoint.firstChild && errorDisplayPoint !== document.body) {
                        errorDisplayPoint.insertBefore(errorMsgElement, errorDisplayPoint.firstChild);
                    } else {
                        errorDisplayPoint.appendChild(errorMsgElement);
                    }
                }
            }
        }
    }, retryInterval);

})();