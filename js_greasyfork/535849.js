// ==UserScript==
// @name         Factorio.zone Multi-Mod Uploader (v1.0 - Intercept Login Token)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license MIT
// @description  Intercepts the correct visitSecret from /api/user/login for multi-mod uploads.
// @author       You
// @match        *://factorio.zone/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/535849/Factoriozone%20Multi-Mod%20Uploader%20%28v10%20-%20Intercept%20Login%20Token%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535849/Factoriozone%20Multi-Mod%20Uploader%20%28v10%20-%20Intercept%20Login%20Token%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let outputArea = null; // Will be fetched later
    let actualVisitSecretForUpload = null; // This will store the prize!

    function appendToOutput(message, isError = false) {
        if (!outputArea) { outputArea = document.getElementById('output-area'); }
        if (outputArea) {
            const div = document.createElement('div');
            div.className = isError ? 'output-error' : 'output-info';
            div.textContent = message;
            outputArea.appendChild(div);
            outputArea.scrollTop = outputArea.scrollHeight;
        }
        const prefix = "TM MOD UPLOADER (v1.0): ";
        if (isError) { console.error(prefix + message); }
        else { console.log(prefix + message); }
    }

    appendToOutput('Script (v1.0) initializing at document-start...');

    // --- Intercept XMLHttpRequest.send ---
    const originalXHRSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(body) {
        // 'this' is the XHR instance
        if (this._url && typeof this._url === 'string' && this._url.includes('/api/user/login')) {
            appendToOutput('XHR to /api/user/login intercepted!');
            if (body && typeof body === 'string') {
                appendToOutput(`Login request body: ${body}`);
                try {
                    const params = new URLSearchParams(body);
                    const secret = params.get('visitSecret');
                    if (secret) {
                        actualVisitSecretForUpload = secret;
                        appendToOutput(`SUCCESSFULLY INTERCEPTED visitSecret for uploads: ${actualVisitSecretForUpload}`);
                        // Store it potentially in a more persistent way if needed across page reloads for some reason
                        // sessionStorage.setItem('tm_actual_visit_secret', actualVisitSecretForUpload);
                    } else {
                        appendToOutput('Could not find visitSecret in /api/user/login body.', true);
                    }
                } catch (e) {
                    appendToOutput(`Error parsing /api/user/login body: ${e}`, true);
                }
            } else {
                appendToOutput('/api/user/login request had no body or unexpected body type.', true);
            }
        }
        return originalXHRSend.apply(this, arguments);
    };

    // Need to also capture the URL when open is called, as 'this.responseURL' isn't set yet in 'send'
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url; // Store it on the XHR instance
        return originalXHROpen.apply(this, arguments);
    };
    appendToOutput('XMLHttpRequest.send and .open have been hooked.');


    async function getRealVisitSecretForUpload() {
        if (actualVisitSecretForUpload) {
            appendToOutput(`Using stored actualVisitSecret: ${actualVisitSecretForUpload}`);
            return actualVisitSecretForUpload;
        } else {
            // Fallback or warning - this should ideally not be hit if the intercept works
            appendToOutput('WARNING: actualVisitSecretForUpload not yet intercepted. Falling back to #currentToken (likely wrong).', true);
            const currentTokenElement = document.getElementById('currentToken');
            const domToken = currentTokenElement ? currentTokenElement.textContent.trim() : null;
            if (domToken) {
                appendToOutput(`Fallback DOM #currentToken value is: ${domToken}`);
                return domToken;
            }
            appendToOutput('CRITICAL: No visitSecret available for upload!', true);
            return null;
        }
    }

    async function processSelectedFiles(files, tempInputToClear) {
        if (!files || files.length === 0) {
            appendToOutput('No files selected or selection cancelled.');
            return;
        }
        appendToOutput(`Preparing to upload ${files.length} mod(s) sequentially...`);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            const visitSecretToUse = await getRealVisitSecretForUpload();
            if (!visitSecretToUse) {
                appendToOutput(`UPLOAD ABORTED for ${file.name}: Could not obtain a valid visitSecret.`, true);
                return;
            }
            // appendToOutput(`Using token "${visitSecretToUse}" for ${file.name}`); // Already logged by getRealVisitSecretForUpload

            const formData = new FormData();
            formData.append('visitSecret', visitSecretToUse);
            formData.append('file', file, file.name);
            formData.append('size', file.size.toString());

            try {
                // We use 'fetch' here, not XHR, so our XHR hook won't affect this.
                const response = await fetch('https://factorio.zone/api/mod/upload', { // Full URL for clarity
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': '*/*' }
                });
                const responseText = await response.text();
                let responseData;
                try { responseData = JSON.parse(responseText); }
                catch (e) {
                    appendToOutput(`Failed to parse JSON for ${file.name}: ${responseText}`, true);
                    responseData = { error: "Non-JSON response", details: responseText };
                }

                if (response.ok && responseData && (responseData.mod || responseData.statusCode === 200)) {
                    const modName = responseData.mod || file.name.replace(/\.zip$/i, '');
                    appendToOutput(`Successfully uploaded ${modName}. Status: ${response.status}`);
                } else {
                    appendToOutput(`Failed to upload ${file.name}. Status: ${response.status}. Response: ${responseText}`, true);
                    if (response.status === 401) {
                       appendToOutput(`Authorization failed for ${file.name}. VisitSecret "${visitSecretToUse}" was rejected.`, true);
                    }
                }
            } catch (error) {
                appendToOutput(`Network/script error uploading ${file.name}: ${error.message}`, true);
            }
        }
        appendToOutput('All selected mod upload attempts finished.');
        if (tempInputToClear) { tempInputToClear.value = null; }
    }

    function addMultiUploadButton() {
        // Wait for the DOM to be ready for button insertion
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupButtonDOM);
        } else {
            setupButtonDOM();
        }
    }

    function setupButtonDOM() {
        outputArea = document.getElementById('output-area'); // Ensure outputArea is set
        const modsControlDiv = document.querySelector('.control-item .control-label.flex-row.flex-space div:first-child');
        const existingUploadLinkContainer = document.getElementById('mods-upload-link')?.parentNode.parentNode;

        if (!modsControlDiv && !existingUploadLinkContainer && !document.getElementById('mods')) {
            appendToOutput('Could not find a suitable place to add the multi-upload button yet, will retry.', true);
            setTimeout(setupButtonDOM, 500); // Retry if critical elements aren't there
            return;
        }

        if (document.getElementById('tm-multi-upload-mods')) {
            appendToOutput('Multi-upload button already exists.');
            return; // Avoid adding multiple buttons
        }

        const newButton = document.createElement('button');
        newButton.id = 'tm-multi-upload-mods';
        newButton.textContent = 'Upload Multiple Mods (TM v1.0)';
        newButton.className = 'pure-button';
        newButton.style.marginLeft = '10px';
        newButton.title = 'Upload multiple mod .zip files sequentially using Tampermonkey';

        newButton.addEventListener('click', () => {
            appendToOutput('Tampermonkey "Upload Multiple Mods" button clicked.');
            if (!actualVisitSecretForUpload) {
                appendToOutput("CRITICAL: The correct visitSecret hasn't been intercepted yet. Please ensure the page has fully initialized (connected to WebSocket and logged in). Try reloading if this persists.", true);
                // alert("Tampermonkey script hasn't captured the necessary upload token yet. Please wait a moment or reload the page.");
                // return; // Optionally prevent upload if token isn't ready
            }

            const tempFileInput = document.createElement('input');
            tempFileInput.type = 'file';
            tempFileInput.multiple = true;
            tempFileInput.accept = '.zip';
            tempFileInput.style.display = 'none';
            tempFileInput.addEventListener('change', function handleFileSelection() {
                appendToOutput(`Files selected via Tampermonkey's input: ${this.files.length} file(s).`);
                processSelectedFiles(this.files, this);
            });
            document.body.appendChild(tempFileInput);
            tempFileInput.click();
            document.body.removeChild(tempFileInput);
            appendToOutput('Temporary file input created, clicked, and removed. Waiting for file dialog selection.');
        });

        let targetContainer = existingUploadLinkContainer || modsControlDiv?.parentNode.querySelector('.flex-row');
        if (targetContainer) {
             if (existingUploadLinkContainer) { existingUploadLinkContainer.appendChild(newButton); }
             else if (modsControlDiv?.parentNode.querySelector('.flex-row')) { modsControlDiv.parentNode.querySelector('.flex-row').appendChild(newButton); }
             else if (modsControlDiv) { modsControlDiv.parentNode.appendChild(newButton); }
            appendToOutput('New "Upload Multiple Mods (TM v1.0)" button added to the page.');
        } else {
             const modsMainDiv = document.getElementById('mods');
             if (modsMainDiv?.parentNode) {
                modsMainDiv.parentNode.insertBefore(newButton, modsMainDiv.nextSibling);
                appendToOutput('New "Upload Multiple Mods (TM v1.0)" button added (fallback placement).');
             } else {
                appendToOutput('Could not find specific place, appending to controls container (general fallback).', true);
                const controlContainer = document.querySelector('.control-container.flex-row');
                if (controlContainer) controlContainer.appendChild(newButton); else document.body.appendChild(newButton);
             }
        }
    }

    addMultiUploadButton();

})();