// ==UserScript==
// @name           Catalog
// @version        4.6.1
// @author         k0gasa
// @description    adds all items to inventory
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
// @run-at         document-start

// @namespace https://greasyfork.org/users/1446917
// @downloadURL https://update.greasyfork.org/scripts/530096/Catalog.user.js
// @updateURL https://update.greasyfork.org/scripts/530096/Catalog.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const DEBUG = true;
    const SCRIPT_TAG = '[WW-Interceptor]';
    const INTERCEPT_URLS = [
        'wamf/KidInventory/getPaginatedContentOfType',
        'instance/changeColors'
    ];
    const YOUR_SERVER_URL = 'https://k0gasa.pythonanywhere.com/ww-data';

    const log = (...args) => { if (DEBUG) console.log(SCRIPT_TAG, ...args); };
    const error = (...args) => console.error(SCRIPT_TAG, ...args);

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
        log('Setting up main page');
        window.addEventListener('DOMContentLoaded', addToggleButton);
        if (document.readyState === 'interactive' || document.readyState === 'complete') addToggleButton();
    }

    function addToggleButton() {
        if (document.getElementById('ww-interceptor-toggle-container')) {
            return;
        }

        const navBar = document.querySelector('.socnet__navigationBar');
        if (!navBar) {
            console.error('Navigation bar not found!');
            return; 
        }

        const container = document.createElement('div');
        container.id = 'ww-interceptor-toggle-container';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        //container.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        container.style.padding = '14px 50px';
        container.style.borderRadius = '20px';
        container.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        container.style.marginLeft = 'auto' //push it to the left



        const label = document.createElement('span');
        label.textContent = 'Catalog';
        label.style.color = '#ADD0DF';
        label.style.marginRight = '8px';
        label.style.fontSize = '12px';
        //label.style.fontWeight = 'bold';
        label.style.fontFamily = 'Lato';


        const toggleSwitch = document.createElement('div');
        toggleSwitch.id = 'ww-interceptor-toggle';
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

        const status = document.createElement('span');
        status.id = 'ww-interceptor-status';
        status.style.color = 'white';
        status.style.marginLeft = '8px';
        status.style.fontSize = '12px';
        status.style.fontWeight = 'bold';

        let enabled = GM_getValue('interceptorEnabled', false);

        toggleSwitch.appendChild(knob);
        container.appendChild(label);
        container.appendChild(toggleSwitch);
        container.appendChild(status);
        navBar.appendChild(container);

        updateToggleState();

        toggleSwitch.addEventListener('click', () => {
            enabled = !enabled;
            GM_setValue('interceptorEnabled', enabled);
            updateToggleState();
            log('Interceptor toggled to:', enabled);
        });

        function updateToggleState() {
            toggleSwitch.style.backgroundColor = enabled ? '#00aa00' : '#ff0000';
            knob.style.left = enabled ? '22px' : '2px';
            status.textContent = enabled ? '' : '';
        }

        log('Toggle switch added');
    }

    function setupInnerIframe() {
        log('Setting up inner iframe (game client)');
        setupXHRInterception();
    }

    function setupXHRInterception() {
        log('Setting up XHR interception');

        if (unsafeWindow._wwInterceptorInstalled) {
            log('XHR interception already installed');
            return;
        }

        unsafeWindow._wwInterceptorInstalled = true;

        const origXHROpen = unsafeWindow.XMLHttpRequest.prototype.open;
        const origXHRSend = unsafeWindow.XMLHttpRequest.prototype.send;
        const origSetRequestHeader = unsafeWindow.XMLHttpRequest.prototype.setRequestHeader;

        unsafeWindow.XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
            if (!this._wwRequestHeaders) this._wwRequestHeaders = {};
            this._wwRequestHeaders[header] = value;
            return origSetRequestHeader.apply(this, arguments);
        };

        unsafeWindow.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            this._wwOriginalUrl = url;
            this._wwMethod = method;
            this._wwIsAsync = async !== false;
            return origXHROpen.apply(this, arguments);
        };

        unsafeWindow.XMLHttpRequest.prototype.send = function(data) {
            const url = this._wwOriginalUrl;
            const method = this._wwMethod;
            const originalResponseType = this.responseType;
            const xhr = this; // Keep reference to the original XHR


            if (!url || this._wwIsAsync === false || this._wwIsCopyRequest) {
                return origXHRSend.apply(this, arguments);
            }

            let shouldIntercept = false;
            let isChangeColors = false;

            for (const pattern of INTERCEPT_URLS) {
                if (url.includes(pattern)) {
                    shouldIntercept = true;
                    isChangeColors = pattern === 'instance/changeColors';
                    break;
                }
            }


            const enabled = GM_getValue('interceptorEnabled', false);
            if (shouldIntercept && enabled) {
                log('Intercepting request:', url);

                
                if (isChangeColors) {
                    handleChangeColorsRequest(xhr, url, method, data);
                    return; // Skip original XHR send
                } else {
                    

                    log('Detected target URL:', url);

                    let dataToSend;
                    let dataFormat = 'raw';

                    if (data instanceof Uint8Array) {
                        const binary = Array.from(data).map(byte => String.fromCharCode(byte)).join('');
                        dataToSend = btoa(binary);
                        dataFormat = 'base64';
                        log('Converted Uint8Array to base64:', dataToSend.substring(0, 30) + '...');
                    } else if (data instanceof ArrayBuffer) {
                        dataToSend = arrayBufferToBase64(new Uint8Array(data));
                        dataFormat = 'base64';
                        log('Converted ArrayBuffer to Base64, length:', dataToSend.length);
                    } else if (data === null || data === undefined) {
                        dataToSend = '';
                        log('Data is null or undefined, sending empty string');
                    } else if (typeof data === 'object') {
                        try {
                            dataToSend = JSON.stringify(data);
                            dataFormat = 'json';
                            log('Converted object to JSON string');
                        } catch (e) {
                            log('Failed to convert object to JSON:', e);
                            return origXHRSend.apply(this, arguments); // Proceed as normal if JSON conversion fails
                        }
                    } else if (typeof data === 'string') {
                        dataToSend = data;
                        dataFormat = 'text';
                        log('Data is string, sending as is');
                    }

                    function arrayBufferToBase64(buffer) {
                        let binary = '';
                        const bytes = new Uint8Array(buffer);
                        const len = bytes.byteLength;
                        for (let i = 0; i < len; i++) {
                            binary += String.fromCharCode(bytes[i]);
                        }
                        return btoa(binary);
                    }


                    let urlParams = {};
                    try {
                        const urlObj = new URL(url, unsafeWindow.location.origin);
                        urlObj.searchParams.forEach((value, key) => {
                            urlParams[key] = value;
                        });
                    } catch (e) {
                        log('Failed to parse URL parameters:', e);
                    }


                    const copyRequest = new XMLHttpRequest();
                    copyRequest._wwIsCopyRequest = true; // Mark as a copy
                    copyRequest.open(method, url, true);
                    copyRequest.responseType = 'arraybuffer';

                    // Copy headers
                    if (this._wwRequestHeaders) {
                        for (const header in this._wwRequestHeaders) {
                            if (this._wwRequestHeaders.hasOwnProperty(header)) {
                                copyRequest.setRequestHeader(header, this._wwRequestHeaders[header]);
                            }
                        }
                    }

                    copyRequest.onload = function() {
                        log('Copy request completed, status:', copyRequest.status);

                        if (copyRequest.status === 200) {
                            const originalResponse = copyRequest.response;
                            log('Original response length:', originalResponse.byteLength);
                            const originalResponseBase64 = arrayBufferToBase64(new Uint8Array(originalResponse));

                            
                            GM_xmlhttpRequest({
                                method: 'POST',
                                url: YOUR_SERVER_URL,
                                data: JSON.stringify({
                                    requestData: dataToSend,
                                    dataFormat: dataFormat,
                                    originalResponse: originalResponseBase64,
                                    urlParams: urlParams,
                                    originalResponseType: originalResponseType,
                                    requestType: 'getPaginatedContentOfType'
                                }),
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-Original-URL': url,
                                    'X-Original-Method': method,
                                },
                                responseType: 'arraybuffer',
                                onload: function(serverResponse) {
                                    log('Server response received, status:', serverResponse.status);

                                    if (serverResponse.status === 200) {

                                        setTimeout(() => {
                                            Object.defineProperty(xhr, 'readyState', { value: 4, configurable: true, enumerable: true });
                                            Object.defineProperty(xhr, 'status', { value: 200, configurable: true, enumerable: true });
                                            Object.defineProperty(xhr, 'statusText', { value: 'OK', configurable: true, enumerable: true });

                                            if (originalResponseType === 'arraybuffer') {
                                                Object.defineProperty(xhr, 'response', { value: serverResponse.response, configurable: true, enumerable: true });
                                            } else if (originalResponseType === '' || originalResponseType === 'text') {
                                                const responseText = new TextDecoder().decode(serverResponse.response);
                                                Object.defineProperty(xhr, 'responseText', { value: responseText, configurable: true, enumerable: true });
                                                Object.defineProperty(xhr, 'response', { value: responseText, configurable: true, enumerable: true });
                                            } else if (originalResponseType === 'json') {
                                                try {
                                                    const jsonResponse = JSON.parse(new TextDecoder().decode(serverResponse.response));
                                                    Object.defineProperty(xhr, 'response', { value: jsonResponse, configurable: true, enumerable: true });
                                                } catch (e) {
                                                    error('Failed to parse JSON response from your server:', e);
                                                    Object.defineProperty(xhr, 'response', { value: serverResponse.response, configurable: true, enumerable: true });
                                                }
                                            } else if (originalResponseType === 'blob') {
                                                Object.defineProperty(xhr, 'response', { value: new Blob([serverResponse.response]), configurable: true, enumerable: true });
                                            } else {
                                                Object.defineProperty(xhr, 'response', { value: serverResponse.response, configurable: true, enumerable: true });
                                            }
                                            // Call handlers and dispatch events
                                            if (xhr.onreadystatechange) xhr.onreadystatechange(new Event('readystatechange'));
                                            if (xhr.onload) xhr.onload(new Event('load'));
                                            xhr.dispatchEvent(new Event('readystatechange'));
                                            xhr.dispatchEvent(new Event('load'));
                                            log("Successfully applied to XHR")
                                        }, 0);
                                    } else {
                                        // Server error: fallback
                                        log("Fallback")
                                        setXHRProperties(xhr, copyRequest.status, copyRequest.statusText, originalResponse);
                                        triggerXHREvents(xhr, ['readystatechange', 'load']);

                                    }
                                },
                                onerror: function(error) {
                                    log('Error making request to server:', error);

                                    log("fallback 2")
                                    setXHRProperties(xhr, copyRequest.status, copyRequest.statusText, originalResponse);
                                    triggerXHREvents(xhr, ['readystatechange', 'error']);

                                }
                            });

                        } else {
                            // Copy request failed
                            log("Failed to fetch from original")
                            setXHRProperties(xhr, copyRequest.status, copyRequest.statusText, copyRequest.response);
                            triggerXHREvents(xhr, ['readystatechange', 'error']);
                        }
                    };

                    copyRequest.onerror = function() {
                        log('Error making copy request to original server');
                        log("failed to make copy")
                        setXHRProperties(xhr, 0, 'Network Error', null); // Network error
                        triggerXHREvents(xhr, ['readystatechange', 'error']);
                    };

                    
                    copyRequest.send(data);
                    return;
                }
            }
            // --- Proceed normally for non-intercepted requests ---
            return origXHRSend.apply(this, arguments);
        };

        function handleChangeColorsRequest(xhr, url, method, data) {
            log('Handling changeColors request directly');

            let dataToSend;
            let dataFormat = 'raw';

            // Process data similar to existing code
            if (data instanceof Uint8Array) {
                const binary = Array.from(data).map(byte => String.fromCharCode(byte)).join('');
                dataToSend = btoa(binary);
                dataFormat = 'base64';
            } else if (data instanceof ArrayBuffer) {
                dataToSend = arrayBufferToBase64(new Uint8Array(data));
                dataFormat = 'base64';
            } else if (data === null || data === undefined) {
                dataToSend = '';
            } else if (typeof data === 'object') {
                try {
                    dataToSend = JSON.stringify(data);
                    dataFormat = 'json';
                } catch (e) {
                    log('Failed to convert object to JSON:', e);
                    dataToSend = "";
                    dataFormat = 'text';
                }
            } else if (typeof data === 'string') {
                dataToSend = data;
                dataFormat = 'text';
            }

            function arrayBufferToBase64(buffer) {
                let binary = '';
                const bytes = new Uint8Array(buffer);
                const len = bytes.byteLength;
                for (let i = 0; i < len; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                return btoa(binary);
            }


            // Get URL parameters
            let urlParams = {};
            try {
                const urlObj = new URL(url, unsafeWindow.location.origin);
                urlObj.searchParams.forEach((value, key) => {
                    urlParams[key] = value;
                });
            } catch (e) {
                log('Failed to parse URL parameters:', e);
            }

            
            GM_xmlhttpRequest({
                method: 'POST',
                url: YOUR_SERVER_URL,
                data: JSON.stringify({
                    requestData: dataToSend,
                    dataFormat: dataFormat,
                    urlParams: urlParams,
                    originalResponseType: xhr.responseType,
                    requestType: 'changeColors'  // Identify this request type
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'X-Original-URL': url,
                    'X-Original-Method': method,
                },
                responseType: 'arraybuffer',
                onload: function(serverResponse) {
                    log('Server response received for changeColors, status:', serverResponse.status);

                    if (serverResponse.status === 200) {
                        // Apply response to original XHR
                        setTimeout(() => {
                            Object.defineProperty(xhr, 'readyState', { value: 4, configurable: true, enumerable: true });
                            Object.defineProperty(xhr, 'status', { value: 200, configurable: true, enumerable: true });
                            Object.defineProperty(xhr, 'statusText', { value: 'OK', configurable: true, enumerable: true });

                            // Handle response based on responseType

                            if (xhr.responseType === 'arraybuffer') {
                                Object.defineProperty(xhr, 'response', { value: serverResponse.response, configurable: true, enumerable: true });
                            } else if (xhr.responseType === '' || xhr.responseType === 'text') {
                                const responseText = new TextDecoder().decode(serverResponse.response);
                                Object.defineProperty(xhr, 'responseText', { value: responseText, configurable: true, enumerable: true });
                                Object.defineProperty(xhr, 'response', { value: responseText, configurable: true, enumerable: true });
                            } else if (xhr.responseType === 'json') {
                                try {
                                    const jsonResponse = JSON.parse(new TextDecoder().decode(serverResponse.response));
                                    Object.defineProperty(xhr, 'response', { value: jsonResponse, configurable: true, enumerable: true });
                                } catch (e) {
                                    error('Failed to parse JSON response from your server:', e);
                                     Object.defineProperty(xhr, 'response', { value: serverResponse.response, configurable: true, enumerable: true}); //in case parse error, assign it anyways
                                }
                            } else if (xhr.responseType === 'blob') {
                                Object.defineProperty(xhr, 'response', { value: new Blob([serverResponse.response]), configurable: true, enumerable: true });
                            } else {
                                Object.defineProperty(xhr, 'response', { value: serverResponse.response, configurable: true, enumerable: true });
                            }

                            // Trigger events
                            if (xhr.onreadystatechange) xhr.onreadystatechange(new Event('readystatechange'));
                            if (xhr.onload) xhr.onload(new Event('load'));
                            xhr.dispatchEvent(new Event('readystatechange'));
                            xhr.dispatchEvent(new Event('load'));
                        }, 0);
                    } else {
                        // Handle error
                        setXHRProperties(xhr, serverResponse.status, 'Server Error', null);
                        triggerXHREvents(xhr, ['readystatechange', 'error']);
                    }
                },
                onerror: function(error) {
                    log('Error making request to server for changeColors:', error);
                    setXHRProperties(xhr, 0, 'Network Error', null);
                    triggerXHREvents(xhr, ['readystatechange', 'error']);
                }
            });
        }


        function setXHRProperties(xhr, status, statusText, response) {
             setTimeout(() => { 
            Object.defineProperty(xhr, 'readyState', { value: 4, configurable: true, enumerable: true });
            Object.defineProperty(xhr, 'status', { value: status, configurable: true, enumerable: true });
            Object.defineProperty(xhr, 'statusText', { value: statusText, configurable: true, enumerable: true });
            if (response) {
                Object.defineProperty(xhr, 'response', { value: response, configurable: true, enumerable: true });
            }
              // Call handlers and dispatch events.
            if (xhr.onreadystatechange) xhr.onreadystatechange(new Event('readystatechange'));
            if (xhr.onload) xhr.onload(new Event('load'));

            xhr.dispatchEvent(new Event('readystatechange'));
            xhr.dispatchEvent(new Event('load'));
             },0);
        }


        function triggerXHREvents(xhr, events) {
            events.forEach(event => {
                if (xhr[`on${event}`]) {
                    xhr[`on${event}`](new Event(event));
                }
            });
        }
        let lastState = GM_getValue('interceptorEnabled', false);
        setInterval(() => {
            const currentState = GM_getValue('interceptorEnabled', false);
            if (currentState !== lastState) {
                log('Interceptor state changed to:', currentState);
                lastState = currentState;
            }
        }, 1000);

        log('XHR interception setup complete');
    }
})();