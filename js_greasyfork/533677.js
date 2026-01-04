// ==UserScript==
// @name         Widevine Download Helper++
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Displays Widevine data. Sends data to cdrm-project API via button when ready. API response copyable. Popup only on remembered sites. Scrolls. Help button. Click values to copy. Collapse/Expand. Detailed logging.
// @author       TheGuy007 (modified from cramer's EME Logger)
// @match        *://*/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      cdrm-project.com
// @downloadURL https://update.greasyfork.org/scripts/533677/Widevine%20Download%20Helper%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/533677/Widevine%20Download%20Helper%2B%2B.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    const SCRIPT_TITLE = 'Widevine Helper +++';
    const ALLOWED_SITES_KEY = 'widevineHelperAllowedSites_v1';
    const LICENSE_KEYWORDS = ['widevine', 'licence', 'license', 'getlicence', 'auth'];
    const MPD_KEYWORD = 'mpd';
    const HELP_TIMEOUT = 10000;
    const API_URL = 'https://cdrm-project.com/api/decrypt';

    const currentHostname = window.location.hostname;

    function getAllowedSites() {
        const storedSites = GM_getValue(ALLOWED_SITES_KEY, '[]');
        try {
            const sites = JSON.parse(storedSites);
            return Array.isArray(sites) ? sites : [];
        } catch (e) {
            console.error(`${SCRIPT_TITLE}: Error parsing allowed sites list. Resetting.`, e);
            GM_setValue(ALLOWED_SITES_KEY, '[]');
            return [];
        }
    }

    function addAllowedSite(hostname) {
        if (!hostname) return;
        const sites = getAllowedSites();
        if (!sites.includes(hostname)) {
            sites.push(hostname);
            GM_setValue(ALLOWED_SITES_KEY, JSON.stringify(sites));
            console.log(`${SCRIPT_TITLE}: Added "${hostname}" to allowed sites.`);
            alert(`${SCRIPT_TITLE}:\n\n"${hostname}" will now show the popup.\n(Reload page to see effect if script already exited).`);
        } else {
             console.log(`${SCRIPT_TITLE}: "${hostname}" is already in the allowed sites list.`);
             alert(`${SCRIPT_TITLE}:\n\n"${hostname}" is already remembered.`);
        }
    }

    function removeAllowedSite(hostname) {
        if (!hostname) return;
        let sites = getAllowedSites();
        if (sites.includes(hostname)) {
            sites = sites.filter(site => site !== hostname);
            GM_setValue(ALLOWED_SITES_KEY, JSON.stringify(sites));
            console.log(`${SCRIPT_TITLE}: Removed "${hostname}" from allowed sites.`);
            alert(`${SCRIPT_TITLE}:\n\n"${hostname}" will NO LONGER show the popup.\n(Reload page to see effect).`);
        } else {
            console.log(`${SCRIPT_TITLE}: "${hostname}" was not in the allowed sites list.`);
            alert(`${SCRIPT_TITLE}:\n\n"${hostname}" was not remembered.`);
        }
    }

    function isCurrentSiteAllowed() {
        const allowedSites = getAllowedSites();
        return allowedSites.includes(currentHostname);
    }

    GM_registerMenuCommand(`Remember "${currentHostname}" for Popup`, () => addAllowedSite(currentHostname));
    GM_registerMenuCommand(`Forget "${currentHostname}" for Popup`, () => removeAllowedSite(currentHostname));
    GM_registerMenuCommand("Clear All Remembered Sites", () => {
        if (confirm(`${SCRIPT_TITLE}:\n\nAre you sure you want to remove ALL remembered sites?\nThe popup will stop showing everywhere until you re-add sites.`)) {
            GM_setValue(ALLOWED_SITES_KEY, '[]');
            alert(`${SCRIPT_TITLE}:\n\nAll remembered sites cleared.`);
            console.log(`${SCRIPT_TITLE}: Cleared all allowed sites.`);
        }
    });

    if (!isCurrentSiteAllowed()) {
        console.log(`${SCRIPT_TITLE}: Current site "${currentHostname}" is not remembered. Helper inactive. Use Tampermonkey menu to add it.`);
        if (getAllowedSites().length === 0) {
            console.log(`${SCRIPT_TITLE}: No sites remembered yet. Use Tampermonkey menu -> 'Remember "${currentHostname}" for Popup' to activate here.`);
        }
        return;
    }
    console.log(`${SCRIPT_TITLE}: Current site "${currentHostname}" is allowed. Initializing...`);

    let currentPssh = 'Waiting...';
    let currentLicenseUrl = 'Waiting...';
    let currentHeaders = '{}';
    let currentMpdUrl = 'Waiting...';
    let rawHeadersObject = {};
    let licenseUrlFound = false;
    let mpdUrlFound = false;

    let popup = null;
    let popupTitleElement = null;
    let psshContainer = null;
    let licenseUrlContainer = null;
    let headersContainer = null;
    let mpdUrlContainer = null;
    let psshValueElement = null;
    let licenseUrlValueElement = null;
    let headersValueElement = null;
    let mpdUrlValueElement = null;
    let copyFeedbackElement = null;
    let copyTimeoutId = null;
    let isCollapsed = false;
    const originalTitleText = 'Widevine Helper +++';
    let helpButtonElement = null;
    let helpContentElement = null;
    let helpTimeoutId = null;
    let sendButtonElement = null;
    let apiResultElement = null;
    let isApiCallInProgress = false;

    const b64 = { encode: b => btoa(String.fromCharCode(...new Uint8Array(b))) };
    const fnproxy = (object, func) => new Proxy(object, { apply: func });
    const proxy = (object, key, func) => {
         const descriptor = Object.getOwnPropertyDescriptor(object, key);
         if (descriptor && descriptor.configurable && typeof object[key] === 'function') {
            try {
                Object.defineProperty(object, key, {
                    value: fnproxy(object[key], func),
                    writable: descriptor.writable !== undefined ? descriptor.writable : true,
                    enumerable: descriptor.enumerable !== undefined ? descriptor.enumerable : true,
                    configurable: true
                });
                return true;
            } catch (e) { console.error(`${SCRIPT_TITLE}: Failed to proxy ${key}:`, e); return false; }
         } else { return false; }
    };

    function _extractNameFromUrl(urlString) {
        if (typeof urlString !== 'string' || !urlString) return null;
        try {
            const urlObj = new URL(urlString);
            const pathnameDecoded = decodeURIComponent(urlObj.pathname);
            const pathParts = pathnameDecoded.split('/').filter(part => part.length > 0);
            return pathParts.length > 0 ? pathParts[pathParts.length - 1] : null;
        } catch (e) {
            return null;
        }
    }

    function showCopyFeedback(targetElement) {
        if (!copyFeedbackElement || !popup) return;
        if (copyTimeoutId) clearTimeout(copyTimeoutId);
        const popupRect = popup.getBoundingClientRect();
        const topPos = isCollapsed ? (window.innerHeight / 2) : (popupRect.bottom + 5);
        const leftPos = isCollapsed ? (window.innerWidth / 2) : popupRect.left;
        copyFeedbackElement.style.top = `${topPos}px`;
        copyFeedbackElement.style.left = `${leftPos}px`;
        copyFeedbackElement.textContent = 'Copied!';
        copyFeedbackElement.style.display = 'block';
        copyFeedbackElement.style.transform = isCollapsed ? 'translate(-50%, -50%)' : 'none';
        copyTimeoutId = setTimeout(() => {
            if (copyFeedbackElement) copyFeedbackElement.style.display = 'none';
            copyTimeoutId = null;
        }, 1500);
    }

    function addCopyListener(element, textToCopy) {
        if (!element || !textToCopy || typeof textToCopy !== 'string' || textToCopy.startsWith('Waiting...') || textToCopy.startsWith('[Error')) {
            element.style.cursor = 'default';
            element.style.textDecoration = 'none';
            element.title = '';
            element.onclick = null;
            return;
        }
        element.style.cursor = 'pointer';
        element.style.textDecoration = 'underline';
        element.title = 'Click to copy value';
        element.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(`${SCRIPT_TITLE}: Attempting to copy value:`, textToCopy);
            GM_setClipboard(textToCopy, 'text');
            showCopyFeedback(element);
        };
    }

     function toggleCollapse() {
        if (!popup) return;
        isCollapsed = !isCollapsed;
        popup.classList.toggle('widevine-popup-collapsed', isCollapsed);
        if (popupTitleElement) {
             if (isCollapsed) {
                 popupTitleElement.textContent = '●';
                 popupTitleElement.title = 'Click to expand Widevine Helper';
                 if (helpContentElement) helpContentElement.style.display = 'none';
                 if (apiResultElement) apiResultElement.style.display = 'none';
             } else {
                 popupTitleElement.textContent = originalTitleText;
                 popupTitleElement.title = 'Click to collapse Widevine Helper';
                 updatePopupUI();
             }
        }
        if (isCollapsed && copyFeedbackElement) {
            copyFeedbackElement.style.display = 'none';
            if (copyTimeoutId) clearTimeout(copyTimeoutId);
        }
    }

    function toggleHelpContent() {
        if (!helpContentElement) return;
        const isHidden = helpContentElement.style.display === 'none';
        helpContentElement.style.display = isHidden ? 'block' : 'none';
        if (isHidden && apiResultElement) apiResultElement.style.display = 'none';
    }

    function checkAndWaitStatus() {
        if (!helpButtonElement) return;
        const licenseMissing = typeof currentLicenseUrl !== 'string' || currentLicenseUrl.startsWith('Waiting...');
        const mpdMissing = typeof currentMpdUrl !== 'string' || currentMpdUrl.startsWith('Waiting...');
        if (licenseMissing || mpdMissing) {
            console.log(`${SCRIPT_TITLE}: ${HELP_TIMEOUT/1000}s timeout reached. License or MPD still missing. Showing help button.`);
            helpButtonElement.style.display = 'inline-block';
        }
         helpTimeoutId = null;
    }

    function maybeHideHelpButton() {
        if (!helpButtonElement || helpButtonElement.style.display === 'none') return;
        const licenseFound = typeof currentLicenseUrl === 'string' && !currentLicenseUrl.startsWith('Waiting...');
        const mpdFound = typeof currentMpdUrl === 'string' && !currentMpdUrl.startsWith('Waiting...');
        if (licenseFound && mpdFound) {
            console.log(`${SCRIPT_TITLE}: Both License and MPD found after help button was shown. Hiding help button.`);
            helpButtonElement.style.display = 'none';
             if (helpContentElement) helpContentElement.style.display = 'none';
        }
    }

    function handleApiSendClick() {
        if (isApiCallInProgress) return;
        const psshReady = typeof currentPssh === 'string' && !currentPssh.startsWith('Waiting...') && !currentPssh.startsWith('[Error');
        const licenseReady = typeof currentLicenseUrl === 'string' && !currentLicenseUrl.startsWith('Waiting...');
        const headersReady = rawHeadersObject && Object.keys(rawHeadersObject).length > 0;
        if (!psshReady || !licenseReady || !headersReady) {
            console.error(`${SCRIPT_TITLE}: API Send clicked, but data is not ready.`);
            if(apiResultElement) {
                apiResultElement.textContent = 'Error: Data not ready for API call.';
                apiResultElement.style.display = 'block';
                addCopyListener(apiResultElement, null);
            }
            return;
        }

        isApiCallInProgress = true;
        if (sendButtonElement) sendButtonElement.disabled = true;
        if (apiResultElement) {
            apiResultElement.textContent = 'Sending request to API...';
            apiResultElement.style.display = 'block';
            if (helpContentElement) helpContentElement.style.display = 'none';
            addCopyListener(apiResultElement, null);
        }

        const payload = { pssh: currentPssh, licurl: currentLicenseUrl, headers: JSON.stringify(rawHeadersObject) };
        console.log(`${SCRIPT_TITLE}: Sending API request to ${API_URL} with payload:`, payload);

        GM_xmlhttpRequest({
            method: 'POST',
            url: API_URL,
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            data: JSON.stringify(payload),
            timeout: 15000,
            onload: function(response) {
                console.log(`${SCRIPT_TITLE}: API Response Received (Status: ${response.status})`);
                let displayResultText = `API Error: Received status ${response.status}`;
                let copyableResultText = null;

                if (response.status >= 200 && response.status < 300) {
                    try {
                        const data = JSON.parse(response.responseText);
                        console.log(`${SCRIPT_TITLE}: API Response Data:`, data);
                        if (data && data.message) {
                            copyableResultText = data.message;
                            displayResultText = `API Response:\n${data.message}`;
                        } else if (response.responseText) {
                             copyableResultText = response.responseText;
                             displayResultText = `API Response (Raw):\n${response.responseText}`;
                             console.warn(`${SCRIPT_TITLE}: API response JSON parsed, but no 'message' field found.`);
                        } else {
                            displayResultText = 'API Response: Received empty successful response.';
                            console.warn(`${SCRIPT_TITLE}: API successful response, but no data.`);
                            copyableResultText = null;
                        }
                    } catch (e) {
                        console.error(`${SCRIPT_TITLE}: Error parsing API JSON response:`, e);
                        displayResultText = `API Response Error: Could not parse JSON.\nRaw: ${response.responseText}`;
                        copyableResultText = response.responseText;
                    }
                } else {
                     displayResultText = `API Error ${response.status}: ${response.statusText}\nResponse: ${response.responseText || '(No response body)'}`;
                     console.error(`${SCRIPT_TITLE}: API request failed with status ${response.status}`, response);
                     copyableResultText = response.responseText || null;
                }
                if (apiResultElement) {
                    apiResultElement.textContent = displayResultText;
                    apiResultElement.style.display = 'block';
                    addCopyListener(apiResultElement, copyableResultText);
                }
            },
            onerror: function(response) {
                console.error(`${SCRIPT_TITLE}: API Request Network Error:`, response);
                if (apiResultElement) { apiResultElement.textContent = `API Network Error: Could not connect or other error occurred. Check console (F12).`; apiResultElement.style.display = 'block'; addCopyListener(apiResultElement, null); }
            },
            ontimeout: function() {
                 console.error(`${SCRIPT_TITLE}: API Request Timed Out.`);
                 if (apiResultElement) { apiResultElement.textContent = `API Error: Request timed out (${15000/1000}s).`; apiResultElement.style.display = 'block'; addCopyListener(apiResultElement, null); }
            },
            onabort: function() { console.warn(`${SCRIPT_TITLE}: API Request Aborted.`); },
            finally: function() { isApiCallInProgress = false; if (sendButtonElement) sendButtonElement.disabled = false; }
        });
    }

    function createPopup() {
        if (popup) return;
        console.log(`${SCRIPT_TITLE}: Creating Popup UI.`);
        popup = document.createElement('div'); popup.id = 'widevine-helper-popup';
        popupTitleElement = document.createElement('div'); popupTitleElement.textContent = originalTitleText; popupTitleElement.title = 'Click to collapse Widevine Helper'; popupTitleElement.className = 'widevine-popup-title'; popupTitleElement.onclick = toggleCollapse; popup.appendChild(popupTitleElement);
        const contentArea = document.createElement('div'); contentArea.className = 'widevine-popup-content';
        psshContainer = document.createElement('div'); psshContainer.innerHTML = '<b>PSSH:</b> '; psshValueElement = document.createElement('span'); psshValueElement.textContent = currentPssh; psshContainer.appendChild(psshValueElement); contentArea.appendChild(psshContainer);
        licenseUrlContainer = document.createElement('div'); licenseUrlContainer.innerHTML = '<b>License URL:</b> '; licenseUrlValueElement = document.createElement('span'); licenseUrlValueElement.textContent = currentLicenseUrl; licenseUrlContainer.appendChild(licenseUrlValueElement); contentArea.appendChild(licenseUrlContainer);
        headersContainer = document.createElement('div'); headersContainer.innerHTML = '<b>Headers:</b> '; headersValueElement = document.createElement('span'); headersValueElement.textContent = currentHeaders; headersValueElement.style.whiteSpace = 'pre-wrap'; headersContainer.appendChild(headersValueElement); contentArea.appendChild(headersContainer);
        mpdUrlContainer = document.createElement('div'); mpdUrlContainer.innerHTML = '<b>MPD url:</b> '; mpdUrlValueElement = document.createElement('span'); mpdUrlValueElement.textContent = currentMpdUrl; mpdUrlContainer.appendChild(mpdUrlValueElement); contentArea.appendChild(mpdUrlContainer);
        popup.appendChild(contentArea);
        sendButtonElement = document.createElement('button'); sendButtonElement.id = 'widevine-send-button'; sendButtonElement.textContent = 'Send to API'; sendButtonElement.title = `Send PSSH, License URL, and Headers to ${API_URL}`; sendButtonElement.style.display = 'none'; sendButtonElement.onclick = handleApiSendClick; popup.appendChild(sendButtonElement);
        apiResultElement = document.createElement('div'); apiResultElement.id = 'widevine-api-result'; apiResultElement.style.display = 'none'; popup.appendChild(apiResultElement);
        helpButtonElement = document.createElement('span'); helpButtonElement.id = 'widevine-help-button'; helpButtonElement.textContent = '?'; helpButtonElement.title = 'Help Finding Data'; helpButtonElement.style.display = 'none'; helpButtonElement.onclick = toggleHelpContent;
        helpContentElement = document.createElement('div'); helpContentElement.id = 'widevine-help-content'; helpContentElement.style.display = 'none'; helpContentElement.innerHTML = `<p style="margin-top: 8px; border-top: 1px dashed #ccc; padding-top: 8px;"><b>Still waiting? Try manually:</b></p><ol style="margin: 0; padding-left: 20px; font-size: 11px;"><li>Press <b>F12</b> to open Developer Tools.</li><li>Go to the <b>Network</b> tab.</li><li><b>Reload</b> the page (F5 or Ctrl+R).</li><li>Filter requests:<ul><li>For <b>License URL</b>: Look for <b><code>widevine</code></b>, <b><code>license</code></b>, <b><code>licensing</code></b>, or <b><code>auth</code></b>. Right-click -> Copy -> Copy link address.</li><li>For <b>MPD URL</b>: Look for <b><code>mpd</code></b>. Copy its link address.</li><li>For <b>Headers</b>: Right-click license request -> <b>Copy</b> -> <b>Copy as fetch (Node.js)</b>. Use "Paste from Fetch" on relevant form/tool.</li></ul></li></ol>`; popup.appendChild(helpButtonElement); popup.appendChild(helpContentElement);
        copyFeedbackElement = document.createElement('div'); copyFeedbackElement.id = 'widevine-copy-feedback'; copyFeedbackElement.style.display = 'none'; if (document.body) { document.body.appendChild(copyFeedbackElement); } else { document.addEventListener('DOMContentLoaded', () => { if (document.body && !document.getElementById(copyFeedbackElement.id)) { document.body.appendChild(copyFeedbackElement); }}); }

        GM_addStyle(`
            #widevine-helper-popup { position: fixed; top: 10px; right: 10px; background-color: white; color: black; border: 1px solid #ccc; border-radius: 8px; padding: 0; z-index: 99999; font-family: sans-serif; font-size: 12px; width: 380px; max-width: 90vw; max-height: 85vh; box-shadow: 0 2px 5px rgba(0,0,0,0.2); transition: all 0.2s ease-in-out; overflow: hidden; display: flex; flex-direction: column; }
            .widevine-popup-title { font-weight: bold; padding: 8px 12px; border-bottom: 1px solid #ccc; cursor: pointer; user-select: none; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; flex-shrink: 0; }
            .widevine-popup-content { padding: 8px 12px 0 12px; overflow-y: auto; overflow-x: hidden; flex-grow: 1; }
            .widevine-popup-content > div { margin-bottom: 6px; word-break: break-all; }
            #widevine-send-button { display: none; margin: 8px 12px 5px 12px; padding: 5px 10px; font-size: 11px; cursor: pointer; background-color: #e0e0e0; border: 1px solid #bbb; border-radius: 4px; text-align: center; flex-shrink: 0; }
            #widevine-send-button:hover:not(:disabled) { background-color: #d0d0d0; }
            #widevine-send-button:disabled { cursor: wait; background-color: #f5f5f5; color: #999; border-color: #ddd; }
            #widevine-api-result { display: none; padding: 8px 12px 8px 12px; border-top: 1px solid #eee; margin-top: 0px; font-size: 11px; background-color: #f8f8f8; white-space: pre-wrap; word-break: break-all; max-height: 150px; overflow-y: auto; flex-shrink: 0; }
            #widevine-api-result[title^="Click to copy"] { text-decoration: underline; cursor: pointer; }
            #widevine-help-button { display: none; position: absolute; bottom: 5px; right: 8px; background-color: #eee; border: 1px solid #aaa; border-radius: 50%; width: 18px; height: 18px; line-height: 18px; text-align: center; font-size: 14px; font-weight: bold; color: #555; cursor: pointer; user-select: none; transition: background-color 0.2s; z-index: 1; }
            #widevine-help-button:hover { background-color: #ddd; }
            #widevine-help-content { display: none; padding: 0px 12px 8px 12px; border-top: 1px solid #eee; margin-top: 8px; flex-shrink: 0; font-size: 11px; }
            #widevine-help-content ul { margin-top: 5px; padding-left: 15px; } #widevine-help-content li { margin-bottom: 3px; } #widevine-help-content code { background-color: #f0f0f0; padding: 1px 3px; border-radius: 3px; font-size: 11px;}
            #widevine-helper-popup.widevine-popup-collapsed { width: 20px; height: 20px; padding: 0; border-radius: 50%; cursor: pointer; max-width: 20px; max-height: 20px; overflow: hidden; }
            #widevine-helper-popup.widevine-popup-collapsed > .widevine-popup-title { text-align: center; line-height: 20px; padding: 0; margin: 0; border-bottom: none; font-size: 14px; color: #555; }
            #widevine-helper-popup.widevine-popup-collapsed > .widevine-popup-content, #widevine-helper-popup.widevine-popup-collapsed > #widevine-send-button, #widevine-helper-popup.widevine-popup-collapsed > #widevine-api-result, #widevine-helper-popup.widevine-popup-collapsed > #widevine-help-button, #widevine-helper-popup.widevine-popup-collapsed > #widevine-help-content { display: none; }
            #widevine-copy-feedback { position: fixed; background-color: #28a745; color: white; padding: 5px 10px; border-radius: 4px; font-size: 11px; z-index: 100000; box-shadow: 0 1px 3px rgba(0,0,0,0.2); transform: none; transition: top 0.1s, left 0.1s, transform 0.1s; }
        `);

        if (!document.getElementById(popup.id)) { if (document.body) { document.body.appendChild(popup); console.log(`${SCRIPT_TITLE}: Popup appended to body.`); } else { console.log(`${SCRIPT_TITLE}: DOM not ready, deferring popup append.`); document.addEventListener('DOMContentLoaded', () => { if (document.body && !document.getElementById(popup.id)) { document.body.appendChild(popup); console.log(`${SCRIPT_TITLE}: Popup appended to body via DOMContentLoaded.`); }}); } } else { console.log(`${SCRIPT_TITLE}: Popup element already exists in DOM.`); }
    }

    function updatePopupUI() {
        if (!popup) { createPopup(); if (!popup) return; }
        if (!isCollapsed) {
            if (psshValueElement) { psshValueElement.textContent = currentPssh; addCopyListener(psshValueElement, currentPssh); }
            if (licenseUrlValueElement) { licenseUrlValueElement.textContent = currentLicenseUrl; addCopyListener(licenseUrlValueElement, currentLicenseUrl); }
            if (headersValueElement) { let headersDisplay = 'Waiting...'; let headersRawCopy = null; if (Object.keys(rawHeadersObject).length > 0) { try { headersDisplay = JSON.stringify(rawHeadersObject, null, 2); headersRawCopy = JSON.stringify(rawHeadersObject); } catch (e) { console.error(`${SCRIPT_TITLE}: Error stringifying headers`, e); headersDisplay = "[Error formatting headers]"; } } else { headersDisplay = 'Waiting...'; } headersValueElement.textContent = headersDisplay; addCopyListener(headersValueElement, headersRawCopy); }
            if (mpdUrlValueElement) { mpdUrlValueElement.textContent = currentMpdUrl; addCopyListener(mpdUrlValueElement, currentMpdUrl); }
        }
        const psshReady = typeof currentPssh === 'string' && !currentPssh.startsWith('Waiting...') && !currentPssh.startsWith('[Error');
        const licenseReady = typeof currentLicenseUrl === 'string' && !currentLicenseUrl.startsWith('Waiting...');
        const headersReady = rawHeadersObject && Object.keys(rawHeadersObject).length > 0;
        if (sendButtonElement) { if (psshReady && licenseReady && headersReady && !isCollapsed) { sendButtonElement.style.display = 'block'; sendButtonElement.disabled = isApiCallInProgress; } else { sendButtonElement.style.display = 'none'; } }
        if (popup) { popup.style.display = 'flex'; }
    }

    if (typeof MediaKeySession !== 'undefined') {
        proxy(MediaKeySession.prototype, 'generateRequest', async (_target, _this, _args) => {
            console.log(`${SCRIPT_TITLE}: Intercepted generateRequest`);
            const [initDataType, initData] = _args;
            if (initData) { try { currentPssh = b64.encode(initData); } catch (e) { console.error(`${SCRIPT_TITLE}: Error encoding PSSH`, e); currentPssh = "[Error encoding PSSH]"; } console.log(`${SCRIPT_TITLE}: Captured PSSH.`); }
            else { currentPssh = "[No initData provided]"; console.log(`${SCRIPT_TITLE}: generateRequest called without initData.`); }
            updatePopupUI();
            return _target.apply(_this, _args);
        });
    } else { console.warn(`${SCRIPT_TITLE}: MediaKeySession API not found.`); }

    const originalFetch = window.fetch;
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    const originalXhrSend = XMLHttpRequest.prototype.send;
    const originalXhrSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
    const xhrData = new WeakMap();

    function processLicenseRequest(url, headersObject) {
        if (licenseUrlFound || typeof url !== 'string' || !url) {
             if (licenseUrlFound && (!headersObject || Object.keys(headersObject).length === 0)) return;
        }
        if (typeof url !== 'string' || !url) return;

        const urlLower = url.toLowerCase(); const name = _extractNameFromUrl(url); const nameLower = name ? name.toLowerCase() : null;
        let matchFound = false; let matchingKeyword = null;
        for (const keyword of LICENSE_KEYWORDS) { if (urlLower.includes(keyword) || (nameLower && nameLower.includes(keyword))) { matchFound = true; matchingKeyword = keyword; break; } }

        if (matchFound) {
            const shouldUpdate = !licenseUrlFound || (headersObject && Object.keys(headersObject).length > 0 && Object.keys(rawHeadersObject).length === 0);
            if (shouldUpdate) {
                console.log(`${SCRIPT_TITLE}: Potential License Request DETECTED (keyword: '${matchingKeyword}') - Updating Data.`);
                console.log(`${SCRIPT_TITLE}:   License URL:`, url);
                licenseUrlFound = true;
                currentLicenseUrl = url;
                 if (headersObject && Object.keys(headersObject).length > 0) {
                    rawHeadersObject = headersObject;
                 } else if (!rawHeadersObject || Object.keys(rawHeadersObject).length === 0) {
                    rawHeadersObject = {};
                 }
                updatePopupUI();
                maybeHideHelpButton();
            }
        }
    }

    function processMpdRequest(url) {
        if (typeof url !== 'string' || !url) return;
        const name = _extractNameFromUrl(url); const nameLower = name ? name.toLowerCase() : null;
        if (nameLower && nameLower.includes(MPD_KEYWORD)) {
            console.log(`${SCRIPT_TITLE}: Found MPD Request (matched keyword '${MPD_KEYWORD}' in name)`);
            console.log(`${SCRIPT_TITLE}:   MPD URL:`, url);
            currentMpdUrl = url; mpdUrlFound = true;
            updatePopupUI(); maybeHideHelpButton();
        }
    }

    window.fetch = async function(...args) {
        let url = args[0] instanceof Request ? args[0].url : args[0];
        let options = args[1] || {};
        let headers = {};

        if (args[0] instanceof Request && args[0].headers) {
            try { for (const [key, value] of args[0].headers.entries()) { headers[key.toLowerCase()] = value; } }
            catch (e) { console.warn(`${SCRIPT_TITLE} (fetch): Error iterating Request headers`, e); }
        }
        if (options.headers) {
            if (options.headers instanceof Headers) {
                 try { for (const [key, value] of options.headers.entries()) { headers[key.toLowerCase()] = value; } }
                 catch (e) { console.warn(`${SCRIPT_TITLE} (fetch): Error iterating options Headers object`, e); }
            } else if (typeof options.headers === 'object' && options.headers !== null) {
                try { for (const key of Object.keys(options.headers)) { if (options.headers[key] != null) { headers[key.toLowerCase()] = String(options.headers[key]); } } }
                catch (e) { console.warn(`${SCRIPT_TITLE} (fetch): Error iterating options object headers`, e); }
            }
        }
        processLicenseRequest(url, headers);
        processMpdRequest(url);
        return originalFetch.apply(this, args);
    };

    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        if (typeof url === 'string') { xhrData.set(this, { url: url, method: method, headers: {} }); }
        else { xhrData.set(this, { url: null, method: method, headers: {} }); }
        return originalXhrOpen.apply(this, [method, url, ...rest]);
    };
    XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
        const data = xhrData.get(this);
        if (data && typeof header === 'string') { if (!data.headers) data.headers = {}; data.headers[header.toLowerCase()] = String(value); }
        return originalXhrSetRequestHeader.apply(this, [header, value]);
    };
    XMLHttpRequest.prototype.send = function(...args) {
        const data = xhrData.get(this);
        if (data && data.url) { const headersToSend = data.headers || {}; processLicenseRequest(data.url, headersToSend); processMpdRequest(data.url); }
        return originalXhrSend.apply(this, args);
    };

    updatePopupUI();
    if (helpTimeoutId) clearTimeout(helpTimeoutId);
    helpTimeoutId = setTimeout(checkAndWaitStatus, HELP_TIMEOUT);
    console.log(`${SCRIPT_TITLE}: Help button timer started (${HELP_TIMEOUT/1000}s).`);

})();