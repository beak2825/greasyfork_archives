// ==UserScript==
// @name           catalog + pods
// @version        5.0.0
// @author         k0gasa
// @description    adds all items to inventory + pods
// @match          *://www.woozworld.com/*
// @match          *://application.woozworld.com/*
// @match          *://client.woozworld.com/*
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_addValueChangeListener
// @grant          GM_xmlhttpRequest
// @grant          unsafeWindow
// @connect        k0gasa.pythonanywhere.com
// @connect        pythonanywhere.com
// @connect        localhost
// @connect        sfox.wozoworld.com
// @run-at         document-start

// @namespace https://greasyfork.org/users/1446917
// @downloadURL https://update.greasyfork.org/scripts/531441/catalog%20%2B%20pods.user.js
// @updateURL https://update.greasyfork.org/scripts/531441/catalog%20%2B%20pods.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const DEBUG = true;
    const SCRIPT_TAG = '[WW-Interceptor]';
    const INTERCEPT_XHR_URLS = [
        'wamf/KidInventory/getPaginatedContentOfType',
        'instance/changeColors'
    ];
    const INTERCEPT_WS_HOST = 'sfox.woozworld.com';
    const YOUR_SERVER_URL = 'https://k0gasa.pythonanywhere.com/ww-data';

    const CATALOG_ENABLED_KEY = 'interceptorEnabled';
    const PODS_INTERCEPTOR_ENABLED_KEY = 'podsInterceptorEnabled';
    const PODS_NUMBERS_KEY = 'podsNumbers';

    const log = (...args) => { if (DEBUG) console.log(SCRIPT_TAG, ...args); };
    const error = (...args) => console.error(SCRIPT_TAG, ...args);

    function arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    function base64ToArrayBuffer(base64) {
        try {
            const padding = '='.repeat((4 - base64.length % 4) % 4);
            const binary_string = atob(base64 + padding);
            const len = binary_string.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }
            return bytes.buffer;
        } catch (e) {
            error("Error in base64ToArrayBuffer:", e, "Input:", base64.substring(0, 50) + "...");
            return new ArrayBuffer(0);
        }
    }

    async function blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    const base64String = reader.result.split(',')[1];
                    if (base64String !== undefined) {
                         resolve(base64String);
                    } else {
                         reject(new Error("FileReader result did not contain base64 data."));
                    }
                } else {
                    reject(new Error("FileReader result is null"));
                }
            };
            reader.onerror = (err) => reject(err || new Error("FileReader error"));
            reader.readAsDataURL(blob);
        });
    }

    function base64ToBlob(base64, contentType = '') {
         try {
            const padding = '='.repeat((4 - base64.length % 4) % 4);
            const byteCharacters = atob(base64 + padding);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            return new Blob([byteArray], { type: contentType });
         } catch (e) {
             error("Error in base64ToBlob:", e);
             return new Blob();
         }
    }

    function setXHRProperties(xhr, status, statusText, response) {
        setTimeout(() => {
            log(`Setting XHR props: Status=${status}, ReadyState=4`);
            try {

                Object.defineProperty(xhr, 'readyState', { value: 4, configurable: true, /*writable: false,*/ enumerable: true });
                Object.defineProperty(xhr, 'status', { value: status, configurable: true, /*writable: false,*/ enumerable: true });
                Object.defineProperty(xhr, 'statusText', { value: statusText, configurable: true, /*writable: false,*/ enumerable: true });

                let responseTextValue = '';
                 if (response !== null && response !== undefined) {
                    Object.defineProperty(xhr, 'response', { value: response, configurable: true, /*writable: false,*/ enumerable: true });
                    try {
                        if (response instanceof ArrayBuffer) {
                             responseTextValue = new TextDecoder('utf-8', { fatal: false }).decode(response);
                        } else if (typeof response === 'string') {
                            responseTextValue = response;
                        }

                    } catch (e) {
                         log("Could not generate responseText", e);
                    }
                } else {
                     Object.defineProperty(xhr, 'response', { value: null, configurable: true, /*writable: false,*/ enumerable: true });
                }
                Object.defineProperty(xhr, 'responseText', { value: responseTextValue, configurable: true, /*writable: false,*/ enumerable: true });

                triggerXHREvents(xhr, ['readystatechange', status >= 200 && status < 300 ? 'load' : 'error', 'loadend']);
            } catch (e) {
                error("Error setting XHR properties:", e);
                 try { triggerXHREvents(xhr, ['readystatechange', 'error', 'loadend']); } catch{}
            }
        }, 0);
    }

    function setXHRResponse(xhr, status, statusText, responseDataBuffer, originalResponseType) {
        setTimeout(() => {
             try {
                let finalResponse = null;
                let responseTextValue = '';

                try {
                    if (responseDataBuffer && responseDataBuffer.byteLength > 0) {
                        responseTextValue = new TextDecoder('utf-8', { fatal: false }).decode(responseDataBuffer);
                    }

                    if (originalResponseType === '' || originalResponseType === 'text') {
                        finalResponse = responseTextValue;
                    } else if (originalResponseType === 'json') {
                        try {
                            finalResponse = responseTextValue ? JSON.parse(responseTextValue) : null;
                        } catch (e) {
                            error('Failed to parse JSON response from buffer', e);
                            finalResponse = null;

                        }
                    } else if (originalResponseType === 'blob') {
                        finalResponse = new Blob([responseDataBuffer || new ArrayBuffer(0)], {type: xhr.getResponseHeader('Content-Type') || ''});
                    } else if (originalResponseType === 'document') {
                        error('Unsupported responseType: document. Setting response to null.');
                        finalResponse = null;
                     } else {
                        finalResponse = responseDataBuffer;
                    }

                } catch (decodeError) {
                     error("Error processing/decoding response buffer:", decodeError);
                     finalResponse = responseDataBuffer;
                     status = 500;
                     statusText = "Response Processing Error";
                }

                Object.defineProperty(xhr, 'readyState', { value: 4, configurable: true, /*writable: false,*/ enumerable: true });
                Object.defineProperty(xhr, 'status', { value: status, configurable: true, /*writable: false,*/ enumerable: true });
                Object.defineProperty(xhr, 'statusText', { value: statusText, configurable: true, /*writable: false,*/ enumerable: true });
                Object.defineProperty(xhr, 'response', { value: finalResponse, configurable: true, /*writable: false,*/ enumerable: true });
                Object.defineProperty(xhr, 'responseText', { value: responseTextValue, configurable: true, /*writable: false,*/ enumerable: true });

                triggerXHREvents(xhr, ['readystatechange', status >= 200 && status < 300 ? 'load' : 'error', 'loadend']);
             } catch(e) {
                 error("Error setting XHR response:", e);
                 try { triggerXHREvents(xhr, ['readystatechange', 'error', 'loadend']); } catch {}
             }
        }, 0);
    }

    function triggerXHREvents(xhr, eventNames) {
         log('Triggering XHR events:', eventNames.join(', '));
         eventNames.forEach(eventName => {

            const event = new Event(eventName, { bubbles: false, cancelable: false });

            try {
                 if (typeof xhr[`on${eventName}`] === 'function') {
                    log(`Calling on${eventName} handler`);

                    try { xhr[`on${eventName}`](event); } catch (handlerError) { error(`Error in on${eventName} handler:`, handlerError); }
                }
                 log(`Dispatching ${eventName} event`);

                 try { xhr.dispatchEvent(event); } catch (dispatchError) { error(`Error dispatching ${eventName} event:`, dispatchError); }
             } catch (e) {

                 error(`General error during ${eventName} trigger:`, e);
             }
        });
    }

    const currentURL = window.location.href;
    log('Script running on:', currentURL);

    if (currentURL.includes('www.woozworld.com')) {
        setupMainPage();
    } else if (currentURL.includes('application.woozworld.com')) {
        log('Detected outer iframe - no action needed');
    } else if (currentURL.includes('client.woozworld.com')) {
        setupInnerIframe();
    }

    function setupMainPage() {
        function addButtonsWhenReady() {
             const navBar = document.querySelector('.socnet__navigationBar');
             if (navBar) {
                navBar.style.overflow = 'visible';

                 if (!document.getElementById('ww-catalog-toggle-container')) {
                     addCatalogToggleButton(navBar);
                 }
                 if (!document.getElementById('ww-pods-container')) {
                     addPodsDropdown(navBar);
                 }
             } else {
                log('Navigation bar not found yet, retrying...');
                setTimeout(addButtonsWhenReady, 500);
             }
        }

        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            addButtonsWhenReady();
        } else {
            window.addEventListener('DOMContentLoaded', addButtonsWhenReady);
        }
    }

    function addCatalogToggleButton(navBar) {

        if (!navBar || document.getElementById('ww-catalog-toggle-container')) return;
        const container = document.createElement('div');
        container.id = 'ww-catalog-toggle-container';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.padding = '14px 20px';
        container.style.borderRadius = '20px';
        container.style.boxShadow = '0 0px 0px rgba(0, 0, 0, 0.2)';

        const label = document.createElement('span');
        label.textContent = 'Catalog';
        label.style.color = '#ADD0DF';
        label.style.marginRight = '8px';
        label.style.fontSize = '12px';
        label.style.fontFamily = 'Lato';

        const toggleSwitch = document.createElement('div');
        toggleSwitch.id = 'ww-catalog-toggle';
        toggleSwitch.style.position = 'relative';
        toggleSwitch.style.width = '40px';
        toggleSwitch.style.height = '20px';
        toggleSwitch.style.borderRadius = '10px';
        toggleSwitch.style.cursor = 'pointer';
        toggleSwitch.style.transition = 'background-color 0.3s';

        const knob = document.createElement('div');
        knob.style.position = 'absolute';
        knob.style.width = '16px';
        knob.style.height = '16px';
        knob.style.borderRadius = '50%';
        knob.style.backgroundColor = 'white';
        knob.style.top = '2px';
        knob.style.left = '2px';
        knob.style.transition = 'left 0.3s';
        knob.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.4)';

        let catalogEnabled = GM_getValue(CATALOG_ENABLED_KEY, false);

        toggleSwitch.appendChild(knob);
        container.appendChild(label);
        container.appendChild(toggleSwitch);

        container.style.display = 'inline-flex';
        container.style.alignItems = 'center';
        navBar.appendChild(container);

        const updateCatalogToggleState = () => {
            toggleSwitch.style.backgroundColor = catalogEnabled ? '#00aa00' : '#ff0000';
            knob.style.left = catalogEnabled ? '22px' : '2px';
        };
        updateCatalogToggleState();

        toggleSwitch.addEventListener('click', () => {
            catalogEnabled = !catalogEnabled;
            GM_setValue(CATALOG_ENABLED_KEY, catalogEnabled);
            updateCatalogToggleState();
        });

    }

    function addPodsDropdown(navBar) {
        if (!navBar || document.getElementById('ww-pods-container')) return;

        const podsContainer = document.createElement('div');
        podsContainer.id = 'ww-pods-container';
        podsContainer.style.display = 'inline-flex';
        podsContainer.style.alignItems = 'center';
        podsContainer.style.marginLeft = '10px';
        podsContainer.style.zIndex = '10001';
        podsContainer.style.position = 'relative';

        const podsButton = document.createElement('button');
        podsButton.id = 'ww-pods-button';
        podsButton.style.padding = '7px 13px';
        podsButton.style.border = 'none';
        podsButton.style.borderRadius = '6px';
        podsButton.style.color = 'white';
        podsButton.style.fontSize = '12px';
        podsButton.style.fontFamily = 'Lato';
        podsButton.style.cursor = 'pointer';
        podsButton.style.transition = 'background-color 0.3s';
        podsButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        podsButton.style.minWidth = '70px';

        const dropdownPanel = document.createElement('div');
        dropdownPanel.id = 'ww-pods-dropdown';
        dropdownPanel.style.display = 'none';
        dropdownPanel.style.visibility = 'hidden';
        dropdownPanel.style.opacity = '0';
        dropdownPanel.style.position = 'fixed';
        dropdownPanel.style.backgroundColor = 'rgba(40, 40, 40, 0.95)';
        dropdownPanel.style.border = '1px solid #555';
        dropdownPanel.style.borderRadius = '8px';
        dropdownPanel.style.padding = '15px';
        dropdownPanel.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
        dropdownPanel.style.zIndex = '99999';
        dropdownPanel.style.minWidth = '180px';
        dropdownPanel.style.textAlign = 'left';
        dropdownPanel.style.transition = 'opacity 0.2s ease-in-out, visibility 0.2s ease-in-out';

        const podsInput = document.createElement('input');
        podsInput.type = 'text';
        podsInput.id = 'ww-pods-numbers';
        podsInput.placeholder = 'e.g., 12345, 67890, 13579';
        podsInput.style.display = 'block';
        podsInput.style.boxSizing = 'border-box';
        podsInput.style.width = '100%';
        podsInput.style.padding = '8px 10px';
        podsInput.style.marginBottom = '10px';
        podsInput.style.border = '1px solid #666';
        podsInput.style.borderRadius = '4px';
        podsInput.style.backgroundColor = '#f0f0f0';
        podsInput.style.color = '#333';
        dropdownPanel.appendChild(podsInput);

        const actionButton = document.createElement('button');
        actionButton.id = 'ww-pods-action-button';
        actionButton.style.padding = '8px 15px';
        actionButton.style.border = 'none';
        actionButton.style.borderRadius = '5px';
        actionButton.style.color = 'white';
        actionButton.style.cursor = 'pointer';
        actionButton.style.display = 'block';
        actionButton.style.width = '100%';
        actionButton.style.marginTop = '5px';
        actionButton.style.transition = 'background-color 0.3s';
        dropdownPanel.appendChild(actionButton);

        const footnote = document.createElement('p');
        footnote.id = 'ww-pods-footnote';
        footnote.style.fontSize = '10px';
        footnote.style.color = '#aaa';
        footnote.style.marginTop = '8px';
        footnote.style.marginBottom = '0';
        footnote.style.textAlign = 'center';
        dropdownPanel.appendChild(footnote);

        podsContainer.appendChild(podsButton);
        navBar.appendChild(podsContainer);
        document.body.appendChild(dropdownPanel);

        let podsInterceptorActive = GM_getValue(PODS_INTERCEPTOR_ENABLED_KEY, false);
        let isDropdownOpen = false;

        const updatePodsButtonState = () => {
            const currentNumbers = JSON.parse(GM_getValue(PODS_NUMBERS_KEY, '[]')).join(', ');

            if (podsInterceptorActive) {

    podsButton.style.background = 'linear-gradient(to bottom, #00c800 0%, #00c800 49%, #00aa00 50%, #00aa00 100%)';
    podsButton.style.borderRadius = '3px';
    podsButton.textContent = 'PODS ✓';

    podsInput.value = currentNumbers;
    podsInput.disabled = true;

    actionButton.textContent = 'Deactivate';
    actionButton.style.backgroundColor = '#cc3300';
    actionButton.onmouseover = () => {
        actionButton.style.backgroundColor = '#a62900';
    };
    actionButton.onmouseout = () => {
        actionButton.style.backgroundColor = '#cc3300';
    };

    footnote.textContent = 'Active. Type !buy in world';
    footnote.style.color = '#00cc00';
} else {

    podsButton.style.background = 'linear-gradient(to bottom, #e74c3c 0%, #e74c3c 49%, #c0392b 50%, #c0392b 100%)';
    podsButton.style.borderRadius = '3px';
    podsButton.textContent = isDropdownOpen ? 'PODS ⠀▼' : 'PODS ⠀►';

    podsInput.value = '';
    podsInput.disabled = false;

    actionButton.textContent = 'Activate';
    actionButton.style.backgroundColor = '#0088cc';
    actionButton.onmouseover = () => {
        actionButton.style.backgroundColor = '#006fa6';
    };
    actionButton.onmouseout = () => {
        actionButton.style.backgroundColor = '#0088cc';
    };

    footnote.textContent = ' ';
    footnote.style.color = '#aaa';
}

            actionButton.disabled = false;
            actionButton.style.cursor = 'pointer';
        };

        const hideDropdown = () => {
            dropdownPanel.style.opacity = '0';
            dropdownPanel.style.visibility = 'hidden';

            setTimeout(() => {
                 if (!isDropdownOpen) dropdownPanel.style.display = 'none';
             }, 200);
        };

        const showDropdown = () => {

             const buttonRect = podsButton.getBoundingClientRect();
             const dropdownTop = buttonRect.bottom + 5;
             const dropdownLeft = buttonRect.left;

             dropdownPanel.style.top = `${dropdownTop}px`;
             dropdownPanel.style.left = `${dropdownLeft}px`;

             dropdownPanel.style.display = 'block';

             dropdownPanel.style.setProperty('visibility', 'visible', 'important');
             dropdownPanel.style.setProperty('opacity', '1', 'important');
        }

        updatePodsButtonState();

        podsButton.addEventListener('click', (event) => {
             event.stopPropagation();
             isDropdownOpen = !isDropdownOpen;
             if (isDropdownOpen) {

                 updatePodsButtonState();
                 showDropdown();
             } else {
                 hideDropdown();
             }

             if (!podsInterceptorActive) {
                updatePodsButtonState();
             }
        });

                actionButton.addEventListener('click', () => {
             if (podsInterceptorActive) {

                 podsInterceptorActive = false;
                 GM_setValue(PODS_INTERCEPTOR_ENABLED_KEY, false);
                 GM_setValue(PODS_NUMBERS_KEY, '[]');

                 updatePodsButtonState();
                 log('PODS Interception DEACTIVATED.');
             } else {

                 const rawValue = podsInput.value.trim();
                 const numbers = rawValue.split(',').map(s => s.trim()).filter(s => /^\d+$/.test(s));

                 if (numbers.length !== 3) {
                     alert(`Please enter exactly three valid numbers separated by commas. Found ${numbers.length}.`);
                     return;
                 }

                 log('Activate button clicked with valid numbers:', numbers);
                 podsInterceptorActive = true;
                 GM_setValue(PODS_INTERCEPTOR_ENABLED_KEY, true);
                 GM_setValue(PODS_NUMBERS_KEY, JSON.stringify(numbers));

                 updatePodsButtonState();
                 log('PODS Interceptor ENABLED. Numbers stored:', numbers);
             }

        });

        document.addEventListener('click', (event) => {

            if (isDropdownOpen && !podsButton.contains(event.target) && !dropdownPanel.contains(event.target)) {
                 log('Clicked outside PODS UI, closing dropdown.');
                 isDropdownOpen = false;
                 hideDropdown();

                 if (!podsInterceptorActive) {
                    updatePodsButtonState();
                 }
            }
        });

        dropdownPanel.addEventListener('click', (event) => {
            event.stopPropagation();
        });

    }

    function setupInnerIframe() {
        if (!unsafeWindow._wwXHRInterceptorInstalled) {
            setupXHRInterception();
        } else {
        }
        if (!unsafeWindow._wwWebSocketInterceptorInstalled) {
            setupWebSocketInterception();
        } else {
             log('');
        }
    }

    function setupXHRInterception() {

        unsafeWindow._wwXHRInterceptorInstalled = true;

        const origXHROpen = unsafeWindow.XMLHttpRequest.prototype.open;
        const origXHRSend = unsafeWindow.XMLHttpRequest.prototype.send;
        const origSetRequestHeader = unsafeWindow.XMLHttpRequest.prototype.setRequestHeader;

        unsafeWindow.XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
            if (!this._wwRequestHeaders) this._wwRequestHeaders = {};
            this._wwRequestHeaders[header] = value;
            try {
                return origSetRequestHeader.apply(this, arguments);
            } catch (e) { error("Error applying original setRequestHeader:", e); return undefined; }
        };

        unsafeWindow.XMLHttpRequest.prototype.open = function(method, url, async /*, user, password*/) {
            this._wwOriginalUrl = String(url || '');
            this._wwMethod = String(method || 'GET').toUpperCase();
            this._wwIsAsync = async !== false;
            this._wwRequestHeaders = {};
             try {
                return origXHROpen.apply(this, arguments);
             } catch (e) { error("Error applying original XHR open:", e); throw e; }
        };

        unsafeWindow.XMLHttpRequest.prototype.send = function(data) {
            const url = this._wwOriginalUrl;
            const method = this._wwMethod;
            const xhr = this;

            if (!url || this._wwIsAsync === false || this._wwIsCopyRequest) {
                 try {
                    return origXHRSend.apply(this, arguments);
                 } catch (e) { error("Error applying original XHR send (bypassed):", e); setXHRProperties(xhr, 0, 'Send Error', null); return undefined; }
            }

            let shouldIntercept = false;
            let isChangeColors = false;
            let interceptType = '';
            for (const pattern of INTERCEPT_XHR_URLS) {
                try {
                    if (url.includes(pattern)) {
                        shouldIntercept = true;
                        interceptType = pattern;
                        isChangeColors = pattern === 'instance/changeColors';
                        break;
                    }
                } catch (e) { error(`Error matching URL pattern '${pattern}' with URL '${url}':`, e); }
            }

            const catalogEnabled = GM_getValue(CATALOG_ENABLED_KEY, false);

            if (shouldIntercept && catalogEnabled) {
                const originalResponseType = xhr.responseType;

                if (isChangeColors) {
                    handleChangeColorsRequest(xhr, url, method, data);
                } else {
                    handlePaginatedContentRequest(xhr, url, method, data, originalResponseType);
                }
                return;
            }

            log('XHR send: Not intercepting (Catalog disabled or URL mismatch):', url);
             try {
                return origXHRSend.apply(this, arguments);
             } catch (e) { error("Error applying original XHR send (not intercepted):", e); setXHRProperties(xhr, 0, 'Send Error', null); return undefined; }
        };
        log('XHR interception hooks installed.');
    }

     function handlePaginatedContentRequest(xhr, url, method, data, originalResponseType) {
         let dataToSend, dataFormat;
         try {
             if (data instanceof Uint8Array) { dataToSend = arrayBufferToBase64(data.buffer); dataFormat = 'base64'; }
             else if (data instanceof ArrayBuffer) { dataToSend = arrayBufferToBase64(data); dataFormat = 'base64'; }
             else if (data === null || data === undefined) { dataToSend = ''; dataFormat = 'text'; }
             else if (typeof data === 'object' && data !== null && !(data instanceof Blob)) { dataToSend = JSON.stringify(data); dataFormat = 'json'; }
             else if (typeof data === 'string') { dataToSend = data; dataFormat = 'text'; }
             else if (data instanceof Blob) { throw new Error('Blob data type not handled in getPaginatedContentOfType'); }
             else { dataToSend = String(data); dataFormat = 'text'; }
         } catch(e) { error('XHR data conversion error:', e); setXHRProperties(xhr, 500, 'Script Error', null); return; }

         let urlParams = {}; try { const urlObj = new URL(url, unsafeWindow.location.origin); urlObj.searchParams.forEach((v, k) => { urlParams[k] = v; }); } catch (e) { /* ignore */ }

         const copyRequest = new XMLHttpRequest(); copyRequest._wwIsCopyRequest = true; copyRequest.open(method, url, true); copyRequest.responseType = 'arraybuffer';
         if (xhr._wwRequestHeaders) { for (const h in xhr._wwRequestHeaders) { try {copyRequest.setRequestHeader(h, xhr._wwRequestHeaders[h]);} catch(e){ log(`Warn: Could not copy header ${h}`, e)} } }

         copyRequest.onload = function() {
             if (copyRequest.status >= 200 && copyRequest.status < 300) {
                 const originalResponse = copyRequest.response; const originalResponseBase64 = arrayBufferToBase64(originalResponse);
                 GM_xmlhttpRequest({
                     method: 'POST', url: YOUR_SERVER_URL,
                     data: JSON.stringify({ requestType: 'getPaginatedContentOfType', requestData: dataToSend, dataFormat: dataFormat, originalResponseBase64: originalResponseBase64, urlParams: urlParams, originalResponseType: originalResponseType }),
                     headers: { 'Content-Type': 'application/json', 'X-Original-URL': url, 'X-Original-Method': method },
                     responseType: 'text', timeout: 15000,
                     onload: function(serverResponse) {
                         if (serverResponse.status === 200) {
                             try {
                                 const resJson = JSON.parse(serverResponse.responseText); if (!resJson || typeof resJson.modifiedResponseBase64 !== 'string') throw new Error("Invalid server response format.");
                                 const modBuffer = base64ToArrayBuffer(resJson.modifiedResponseBase64);
                                 setXHRResponse(xhr, 200, 'OK', modBuffer, originalResponseType);
                             } catch (e) { error('Error processing server response:', e); setXHRResponse(xhr, copyRequest.status, copyRequest.statusText, originalResponse, originalResponseType); }
                         } else { log("XHR Fallback: Server error status."); setXHRResponse(xhr, copyRequest.status, copyRequest.statusText, originalResponse, originalResponseType); }
                     },
                     onerror: function(error) { error('XHR GM_XHR network error:', error); setXHRResponse(xhr, copyRequest.status, copyRequest.statusText, originalResponse, originalResponseType); },
                     ontimeout: function() { error('XHR GM_XHR timeout'); setXHRResponse(xhr, copyRequest.status, copyRequest.statusText, originalResponse, originalResponseType); }
                 });
             } else { error('XHR Original request (copy) failed:', copyRequest.status); setXHRProperties(xhr, copyRequest.status, copyRequest.statusText, copyRequest.response); }
         };
         copyRequest.onerror = function() { error('XHR Network error on copy request'); setXHRProperties(xhr, 0, 'Network Error', null); };
         copyRequest.ontimeout = function() { error('XHR Network timeout on copy request'); setXHRProperties(xhr, 0, 'Network Timeout', null); };
         copyRequest.timeout = 10000;
         try { copyRequest.send(data); } catch(e) { error("Error sending XHR copy request:", e); setXHRProperties(xhr, 0, 'Send Error', null); }
     }

    function handleChangeColorsRequest(xhr, url, method, data) {
         log('Handling changeColors request via server (Catalog)');
         let dataToSend, dataFormat;
          try {
             if (data instanceof Uint8Array) { dataToSend = arrayBufferToBase64(data.buffer); dataFormat = 'base64'; }
             else if (data instanceof ArrayBuffer) { dataToSend = arrayBufferToBase64(data); dataFormat = 'base64'; }
             else if (data === null || data === undefined) { dataToSend = ''; dataFormat = 'text'; }
             else if (typeof data === 'object' && data !== null && !(data instanceof Blob)) { dataToSend = JSON.stringify(data); dataFormat = 'json'; }
             else if (typeof data === 'string') { dataToSend = data; dataFormat = 'text'; }
             else if (data instanceof Blob) { throw new Error('Blob data type not handled in changeColors'); }
             else { dataToSend = String(data); dataFormat = 'text'; }
         } catch(e) { error('XHR data conversion error:', e); setXHRProperties(xhr, 500, 'Script Error', null); return; }

         let urlParams = {}; try { const urlObj = new URL(url, unsafeWindow.location.origin); urlObj.searchParams.forEach((v, k) => { urlParams[k] = v; }); } catch (e) { /* ignore */ }

         GM_xmlhttpRequest({
             method: 'POST', url: YOUR_SERVER_URL,
             data: JSON.stringify({ requestType: 'changeColors', requestData: dataToSend, dataFormat: dataFormat, urlParams: urlParams, originalResponseType: xhr.responseType }),
             headers: { 'Content-Type': 'application/json', 'X-Original-URL': url, 'X-Original-Method': method },
             responseType: 'text', timeout: 15000,
             onload: function(serverResponse) {
                 if (serverResponse.status === 200) {
                     try {
                         const resJson = JSON.parse(serverResponse.responseText);
                         let finalBuffer = new ArrayBuffer(0);
                         if (resJson && typeof resJson.responseDataBase64 === 'string' && resJson.responseDataBase64.length > 0) {
                              finalBuffer = base64ToArrayBuffer(resJson.responseDataBase64);
                         }
                         setXHRResponse(xhr, 200, 'OK', finalBuffer, xhr.responseType);
                     } catch (e) { error('Error processing changeColors response:', e); setXHRProperties(xhr, 502, 'Bad Gateway Response', null); }
                 } else {
                     error('XHR Server returned error for changeColors:', serverResponse.status, serverResponse.statusText);
                     setXHRProperties(xhr, serverResponse.status, serverResponse.statusText || 'Server Error', null);
                 }
             },
             onerror: function(error) {
                 error('XHR GM_XHR network error changeColors:', error);
                 setXHRProperties(xhr, 0, 'Network Error', null);
             },
             ontimeout: function() {
                 error('XHR GM_XHR timeout changeColors');
                 setXHRProperties(xhr, 0, 'Gateway Timeout', null);
             }
         });
     }

    function setupWebSocketInterception() {
        unsafeWindow._wwWebSocketInterceptorInstalled = true;

        const OriginalWebSocket = unsafeWindow.WebSocket;

        unsafeWindow.WebSocket = function(url, protocols) {
            let instance = this;

            let targetUrl;
            try { targetUrl = new URL(url); }
            catch (e) { error("Invalid WebSocket URL:", url, e); return new OriginalWebSocket(url, protocols); }

            const isTargetHost = targetUrl.hostname === INTERCEPT_WS_HOST;
            if (!isTargetHost) {
                return new OriginalWebSocket(url, protocols);
            }

            let realWebSocket;
            try {
                 realWebSocket = protocols ? new OriginalWebSocket(url, protocols) : new OriginalWebSocket(url);
            } catch (e) { error("Error creating original WebSocket instance:", e); throw e; }

            let proxiedEventHandlers = {};

            ['binaryType', 'bufferedAmount', 'extensions', 'protocol', 'readyState', 'url'].forEach(prop => {
                 Object.defineProperty(instance, prop, {
                    get: () => { try { return realWebSocket[prop]; } catch(e) { error(`Error getting WS prop '${prop}':`, e); return undefined;} },
                    set: (value) => { if (prop === 'binaryType') { try { realWebSocket[prop] = value; } catch(e) { error(`Error setting WS prop '${prop}':`, e); } } },
                    enumerable: true, configurable: true
                 });
             });

            ['open', 'message', 'close', 'error'].forEach(type => {
                 Object.defineProperty(instance, `on${type}`, {
                     get: () => proxiedEventHandlers[type] || null,
                     set: (handler) => {
                         if (proxiedEventHandlers[type] && proxiedEventHandlers[type]._wrapper) {
                             try { realWebSocket.removeEventListener(type, proxiedEventHandlers[type]._wrapper); }
                             catch(e){ error(`Error removing old WS listener for ${type}:`, e); }
                         }
                         if (typeof handler === 'function') {
                              proxiedEventHandlers[type] = handler;
                              const wrapper = (event) => {

                                  try { handler.call(instance, event); }
                                  catch(e) { error(`Error in proxied on${type} handler:`, e); try { instance.dispatchEvent(new Event('error')); } catch {} }
                              };
                              proxiedEventHandlers[type]._wrapper = wrapper;
                              try { realWebSocket.addEventListener(type, wrapper); }
                              catch(e){ error(`Error adding WS listener for ${type}:`, e); }
                         } else { proxiedEventHandlers[type] = null; }
                     },
                    enumerable: true, configurable: true
                 });
             });

            instance.addEventListener = function(type, listener, options) {
                 log(`WS addEventListener: ${type}`);
                 try { return realWebSocket.addEventListener(type, listener, options); }
                 catch(e) { error("Error in proxied WS addEventListener:", e); }
            };
            instance.removeEventListener = function(type, listener, options) {
                log(`WS removeEventListener: ${type}`);
                 try { return realWebSocket.removeEventListener(type, listener, options); }
                 catch(e) { error("Error in proxied WS removeEventListener:", e); }
            };
            instance.close = function(code, reason) {
                log('WS proxy close called');
                 try { return realWebSocket.close(code, reason); }
                 catch(e) { error("Error in proxied WS close:", e); }
            };

            instance.send = async function(data) {
                log('WS proxy send called');
                const podsEnabled = GM_getValue(PODS_INTERCEPTOR_ENABLED_KEY, false);
                log(`>>> [WS Send Check] PODS Interceptor Enabled: ${podsEnabled}`);

                if (!podsEnabled) {
                    log('WS: PODS Interceptor disabled, sending data directly.');
                    try { realWebSocket.send(data); }
                    catch (e) { error("Error sending data on real WebSocket (interceptor disabled):", e); try { instance.dispatchEvent(new Event('error')); } catch {} }
                    return;
                }

                let dataToSend, dataType;
                try {
                     if (typeof data === 'string') { dataToSend = data; dataType = 'text'; log('WS: Data is string'); }
                     else if (data instanceof ArrayBuffer) { dataToSend = arrayBufferToBase64(data); dataType = 'base64_arraybuffer'; log('WS: Data is ArrayBuffer'); }
                     else if (data instanceof Blob) { log('WS: Data is Blob, converting...'); dataToSend = await blobToBase64(data); dataType = 'base64_blob'; log('WS: Blob converted'); }
                     else { log('WS: Data type unknown, sending directly.'); realWebSocket.send(data); return; }
                 } catch (conversionError) {
                     error("Error converting WebSocket data for interception:", conversionError);
                     log("WS: Sending original data due to conversion error.");
                     try { realWebSocket.send(data); } catch (e) { error("Error sending original WS data after conversion error:", e); try { instance.dispatchEvent(new Event('error')); } catch {} }
                     return;
                 }

                log(`WS: Attempting GM_xmlhttpRequest to: ${YOUR_SERVER_URL}`);
                GM_xmlhttpRequest({
                    method: 'POST', url: YOUR_SERVER_URL,
                    data: (() => {
    let podsNumbers = [];
    let storedNumbersJson = "NOT_RETRIEVED";
    try {
        storedNumbersJson = GM_getValue(PODS_NUMBERS_KEY, 'DEFAULT_EMPTY_ARRAY');


        if (storedNumbersJson === 'DEFAULT_EMPTY_ARRAY') {
             log(`[Send Payload] GM_getValue couldn't find the key, using default.`);
        }

        podsNumbers = JSON.parse(storedNumbersJson);

        if (!Array.isArray(podsNumbers)) {
            podsNumbers = [];
        }
    } catch (e) {
        error("[WS Send Payload] Error parsing stored podsNumbers:", e);
        podsNumbers = [];
    }

    return JSON.stringify({
        requestType: 'websocketMessage',
        wsUrl: realWebSocket.url,
        messageData: dataToSend,
        dataType: dataType,
        podsNumbers: podsNumbers,
        contentType: (data instanceof Blob) ? data.type : undefined
    });
})(),
                    headers: { 'Content-Type': 'application/json' },
                    responseType: 'text', timeout: 20000,
                    onload: function(serverResponse) {
                        let finalData = data;

                        if (serverResponse.status === 200) {
                            try {
                                const responseJson = JSON.parse(serverResponse.responseText);
                                if (responseJson && responseJson.modifiedMessageData !== undefined && responseJson.dataType) {
                                    log('WS: Received processed message from server, type:', responseJson.dataType);
                                    if (responseJson.dataType === 'text') { finalData = String(responseJson.modifiedMessageData); }
                                    else if (responseJson.dataType === 'base64_arraybuffer') { finalData = base64ToArrayBuffer(responseJson.modifiedMessageData); }
                                    else if (responseJson.dataType === 'base64_blob') { finalData = base64ToBlob(responseJson.modifiedMessageData, responseJson.contentType || ''); }
                                    else { log('WS: Unknown dataType from server, using original data.'); }
                                } else { log('WS: Server response OK but invalid format or no modified data, using original data.'); }
                            } catch (e) { error('WS: Error parsing server response:', e, serverResponse.responseText); log('WS: Using original data due to server response parse error.'); }
                        } else { error('WS: Server returned error status:', serverResponse.status, serverResponse.statusText); log('WS: Using original data due to server error.'); }

                        try {
                            if (realWebSocket.readyState === OriginalWebSocket.OPEN) { realWebSocket.send(finalData); }
                            else { log('cannot send final data. State:', realWebSocket.readyState); try { instance.dispatchEvent(new Event('error')); } catch {} }
                        } catch (sendError) { error("Error sending final data on real WebSocket:", sendError); try { instance.dispatchEvent(new Event('error')); } catch {} }
                    },
                    onerror: function(error) {
                        error('WS: Error making request to server via GM_XHR:', error); log('WS: Using original data due to network error.');
                         try {
                             if (realWebSocket.readyState === OriginalWebSocket.OPEN) { realWebSocket.send(data); }
                             else { log('not OPEN after server error. State:', realWebSocket.readyState); try { instance.dispatchEvent(new Event('error')); } catch {} }
                         } catch (sendError) { error("Error sending original data after server error:", sendError); try { instance.dispatchEvent(new Event('error')); } catch {} }
                    },
                     ontimeout: function() {
                        error('WS: Timeout making request to server via GM_XHR'); log('server timeout.');
                         try {
                             if (realWebSocket.readyState === OriginalWebSocket.OPEN) { realWebSocket.send(data); }
                             else { log('not OPEN after server timeout. State:', realWebSocket.readyState); try { instance.dispatchEvent(new Event('error')); } catch {} }
                         } catch (sendError) { error("server timeout:", sendError); try { instance.dispatchEvent(new Event('error')); } catch {} }
                    }
                });
            };

            return instance;

        };

         try {
            unsafeWindow.WebSocket.prototype = OriginalWebSocket.prototype;
            Object.defineProperty(unsafeWindow.WebSocket.prototype, 'constructor', { value: unsafeWindow.WebSocket, writable: true, configurable: true, enumerable: false });
            ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'].forEach(state => {
                 if (state in OriginalWebSocket) {
                     Object.defineProperty(unsafeWindow.WebSocket, state, { value: OriginalWebSocket[state], writable: false, configurable: false, enumerable: true });
                 }
             });
         } catch (e) { error("Error setting up WebSocket prototype/statics:", e); }

    }

})();