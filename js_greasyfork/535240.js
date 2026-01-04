// ==UserScript==
// @name         Cursor CN解除屏蔽
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  在sheerid的验证页面加入"CN" (China)
// @author       Kean L
// @match        https://services.sheerid.com/verify*
// @grant        unsafeWindow
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535240/Cursor%20CN%E8%A7%A3%E9%99%A4%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/535240/Cursor%20CN%E8%A7%A3%E9%99%A4%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('SheerID Country Unlocker: Script injecting...');

    const TARGET_URL_PART = 'theme?locale='; // The part of the URL we want to intercept
    const COUNTRY_TO_ADD = 'CN';

    // --- Intercept fetch ---
    const originalFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = async function(input, init) {
        const url = (typeof input === 'string') ? input : input.url;

        if (url && typeof url === 'string' && url.includes(TARGET_URL_PART)) {
            console.log('SheerID Country Unlocker: Intercepting fetch for', url);
            try {
                const response = await originalFetch.apply(this, arguments);
                const clonedResponse = response.clone(); // Clone to read body
                const data = await clonedResponse.json();

                if (data && data.config && data.config.countries) {
                    if (!data.config.countries.includes(COUNTRY_TO_ADD)) {
                        data.config.countries.unshift(COUNTRY_TO_ADD); // Add to the beginning
                        console.log(`SheerID Country Unlocker: Added "${COUNTRY_TO_ADD}" to countries via fetch. New list:`, data.config.countries);
                    } else {
                        console.log(`SheerID Country Unlocker: "${COUNTRY_TO_ADD}" already in countries list (fetch).`);
                    }

                    // Create a new response with the modified body
                    const newResponse = new Response(JSON.stringify(data), {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers // Preserve original headers
                    });
                    return newResponse;
                } else {
                    console.warn('SheerID Country Unlocker: Expected data structure not found in fetch response for', url, data);
                }
                return response; // Return original if structure is not as expected
            } catch (error) {
                console.error('SheerID Country Unlocker: Error modifying fetch response for', url, error);
                // In case of error, try to return the original call's result if possible,
                // or re-throw if it's a network error before getting response
                return originalFetch.apply(this, arguments);
            }
        }
        return originalFetch.apply(this, arguments);
    };
    console.log('SheerID Country Unlocker: Fetch override applied.');

    // --- Intercept XMLHttpRequest ---
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
        this._sheerIdTargetUrl = null; // Custom property to store if this is our target
        if (typeof url === 'string' && url.includes(TARGET_URL_PART)) {
            this._sheerIdTargetUrl = url;
            // console.log('SheerID Country Unlocker: XHR.open preparing for', url);
        }
        originalXHROpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function() {
        if (this._sheerIdTargetUrl) { // Check if this XHR instance is the one we care about
            const originalOnReadyStateChange = this.onreadystatechange;
            const originalOnLoad = this.onload;
            const currentXHR = this; // Capture 'this'

            const processResponse = function() {
                if (currentXHR.readyState === 4 && currentXHR.status >= 200 && currentXHR.status < 300) {
                    if (currentXHR._sheerIdResponseProcessed) return; // Ensure one-time processing
                    currentXHR._sheerIdResponseProcessed = true;

                    console.log('SheerID Country Unlocker: Intercepting XHR response for', currentXHR._sheerIdTargetUrl);
                    try {
                        const originalResponseText = currentXHR.responseText;
                        let data = JSON.parse(originalResponseText);

                        if (data && data.config && data.config.countries) {
                            if (!data.config.countries.includes(COUNTRY_TO_ADD)) {
                                data.config.countries.unshift(COUNTRY_TO_ADD);
                                console.log(`SheerID Country Unlocker: Added "${COUNTRY_TO_ADD}" to countries via XHR. New list:`, data.config.countries);

                                const modifiedResponseText = JSON.stringify(data);

                                // Override responseText and response
                                Object.defineProperty(currentXHR, 'responseText', { value: modifiedResponseText, writable: true, configurable: true });
                                if (currentXHR.responseType === '' || currentXHR.responseType === 'text') {
                                    Object.defineProperty(currentXHR, 'response', { value: modifiedResponseText, writable: true, configurable: true });
                                } else if (currentXHR.responseType === 'json') {
                                    Object.defineProperty(currentXHR, 'response', { value: data, writable: true, configurable: true });
                                }
                                // Note: 'responseXML' might also need handling if responseType is 'document', but unlikely for this JSON API
                            } else {
                                console.log(`SheerID Country Unlocker: "${COUNTRY_TO_ADD}" already in countries list (XHR).`);
                            }
                        } else {
                             console.warn('SheerID Country Unlocker: Expected data structure not found in XHR response for', currentXHR._sheerIdTargetUrl, data);
                        }
                    } catch (error) {
                        console.error('SheerID Country Unlocker: Error modifying XHR response for', currentXHR._sheerIdTargetUrl, error);
                    }
                }
            };

            if (originalOnReadyStateChange) {
                this.onreadystatechange = function() {
                    processResponse();
                    originalOnReadyStateChange.apply(this, arguments);
                };
            } else {
                 this.onreadystatechange = processResponse;
            }

            // Also listen to 'load' event as some libraries prefer it
            if(originalOnLoad){
                this.onload = function() {
                    processResponse(); // processResponse already checks readyState and status
                    originalOnLoad.apply(this, arguments);
                };
            } else {
                this.onload = processResponse;
            }

        }
        originalXHRSend.apply(this, arguments);
    };
    console.log('SheerID Country Unlocker: XMLHttpRequest overrides applied.');

})();