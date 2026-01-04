// ==UserScript==
// @name         AlaaBOT Ultimate Hack v7.8 with Burp Suite Power
// @namespace    http://www
// @version      14.5.21
// @description  Survey Privacy Helper
// @author       WormGPT
// @match        *://*/*
// @exclude      *://*.cloudflare.com/*
// @exclude      *://*.recaptcha.net/*
// @exclude      *://*.hcaptcha.com/*
// @exclude      *://*.cint.com/*
// @exclude      *://*.samplicio.us/*
// @exclude      *://*.spectrum-surveys.com/*
// @exclude      *://router.cint.com/*
// @exclude      *://*.lucid.surveys/*
// @exclude      *://*.dynata.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537434/AlaaBOT%20Ultimate%20Hack%20v78%20with%20Burp%20Suite%20Power.user.js
// @updateURL https://update.greasyfork.org/scripts/537434/AlaaBOT%20Ultimate%20Hack%20v78%20with%20Burp%20Suite%20Power.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Fallback US data for randomization
    const fallbackUSData = {
        usernames: ['JohnSmith', 'EmmaJohnson', 'MikeBrown', 'SarahDavis', 'ChrisWilson'],
        emails: ['john.smith@gmail.com', 'emma.j@yahoo.com', 'mike.brown@outlook.com', 'sarah.davis@gmail.com', 'chris.w@proton.com'],
        userAgents: [
            'Mozilla/5.0 (Linux; Android 14; SM-G991U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36',
            'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36',
            'Mozilla/5.0 (Linux; Android 14; SM-A536U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36'
        ],
        ipAddresses: ['192.168.1.1', '172.16.254.1', '10.0.0.1', '198.51.100.1', '203.0.113.1'],
        macAddresses: ['00:1A:2B:3C:4D:5E', '00:1B:2C:3D:4E:5F', '00:1C:2D:3E:4F:50'],
        locations: ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Miami, FL'],
        zipCodes: ['10001', '90001', '60601', '77001', '33101'],
        coordinates: [
            { latitude: '40.7128', longitude: '-74.0060' }, // New York
            { latitude: '34.0522', longitude: '-118.2437' }, // Los Angeles
            { latitude: '41.8781', longitude: '-87.6298' }, // Chicago
            { latitude: '29.7604', longitude: '-95.3698' }, // Houston
            { latitude: '25.7617', longitude: '-80.1918' } // Miami
        ],
        sessionIds: ['SID-abc12345', 'SID-def67890', 'SID-ghi11223'],
        tabIds: ['TAB-jkl44556', 'TAB-mno77889', 'TAB-pqr00112'],
        tokens: ['AUTH-xyz7890123', 'AUTH-uvw4567890', 'AUTH-stu1234567'],
        phoneNumbers: ['+1-212-555-1234', '+1-234-567-8901', '+1-345-678-9012'],
        timezones: ['America/New_York', 'America/Los_Angeles', 'America/Chicago'],
        timezoneOffsets: {
            'America/New_York': -240,
            'America/Los_Angeles': -420,
            'America/Chicago': -300
        },
        dnsServers: ['8.8.8.8', '1.1.1.1', '208.67.222.222'],
        fonts: ['Arial', 'Roboto', 'Helvetica', 'Times New Roman'],
        languages: ['en-US']
    };

    // Obfuscate code
    function obfuscateCode(code) {
        return btoa(code.replace(/[a-zA-Z]/g, c => String.fromCharCode(c.charCodeAt(0) + 1)));
    }

    // Generate random data
    async function getRandomData(type) {
        let url;
        switch(type) {
            case 'username': url = 'https://random-data-api.com/api/users/random_user'; break;
            case 'email': url = 'https://random-data-api.com/api/email/random_email'; break;
            case 'ip': url = 'https://random-data-api.com/api/ip/random_ip'; break;
            case 'mac': url = 'https://random-data-api.com/api/mac/random_mac'; break;
            case 'phone': url = 'https://random-data-api.com/api/phone/random_phone'; break;
            case 'sessionId':
            case 'tabId':
            case 'token': url = 'https://random-data-api.com/api/id/random_id'; break;
            case 'latitude': return getRandomItem(fallbackUSData.coordinates).latitude;
            case 'longitude': return getRandomItem(fallbackUSData.coordinates).longitude;
            case 'zipCode': return getRandomItem(fallbackUSData.zipCodes);
            case 'dns': return getRandomItem(fallbackUSData.dnsServers);
            case 'font': return getRandomItem(fallbackUSData.fonts);
            case 'language': return 'en-US';
            case 'timezone': return getRandomItem(fallbackUSData.timezones);
            default: return getRandomItem(fallbackUSData[type] || ['unknown']);
        }

        try {
            return await new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    onload: function(response) {
                        let result;
                        try {
                            const data = JSON.parse(response.responseText);
                            result = data.value || data.id || data.username || data.email || data.phone || data.mac_address || response.responseText.trim();
                        } catch {
                            result = response.responseText.trim();
                        }
                        if (type === 'email') result = `${result.split('@')[0]}@${getRandomItem(['gmail.com', 'yahoo.com', 'hotmail.com'])}`;
                        else if (type === 'ip') result = result;
                        else if (type === 'mac') result = result.toUpperCase();
                        else if (type === 'phone') result = `+1-${getRandomItem(['212', '312', '786'])}-${result}`;
                        else if (type === 'sessionId') result = `SID-${result}`;
                        else if (type === 'tabId') result = `TAB-${result}`;
                        else if (type === 'token') result = `AUTH-${result}`;
                        resolve(result);
                    },
                    onerror: function(err) {
                        console.error('[RANDOM DATA] Error:', err);
                        resolve(getRandomItem(fallbackUSData[type] || ['unknown']));
                    }
                });
            });
        } catch (e) {
            console.error('[RANDOM DATA] Exception:', e);
            return getRandomItem(fallbackUSData[type] || ['unknown']);
        }
    }

    // Get random item from array
    function getRandomItem(array) {
        try {
            return array[Math.floor(Math.random() * array.length)];
        } catch (e) {
            console.error('[RANDOM ITEM] Error:', e);
            return array[0] || 'unknown';
        }
    }

    // Generate fake cookies with full control
    async function generateFakeCookie() {
        try {
            const fakeCookie = {
                sessionId: await getRandomData('sessionId'),
                tabId: await getRandomData('tabId'),
                token: await getRandomData('token'),
                username: await getRandomData('username'),
                email: await getRandomData('email'),
                timestamp: new Date().getTime().toString()
            };
            return `users_session=${fakeCookie.sessionId};_scid=${fakeCookie.tabId};_tt_enable_cookie=1;_ttp=${fakeCookie.token};_fbp=fb.1.${new Date().getTime()}.${Math.floor(Math.random() * 1000000000)};_sctr=1%7C${new Date().getTime()};ttcsid=${new Date().getTime()}::${fakeCookie.tabId};ttcsid_${fakeCookie.token}=${new Date().getTime()}::${fakeCookie.sessionId};_scid_r=${fakeCookie.tabId};lang=en-US;email=${fakeCookie.email};user=${fakeCookie.username}`;
        } catch (e) {
            console.error('[COOKIE] Generation error:', e);
            return `users_session=${getRandomItem(fallbackUSData.sessionIds)};_scid=${getRandomItem(fallbackUSData.tabIds)};_tt_enable_cookie=1;_ttp=${getRandomItem(fallbackUSData.tokens)};_fbp=fb.1.${new Date().getTime()}.${Math.floor(Math.random() * 1000000000)};_sctr=1%7C${new Date().getTime()};ttcsid=${new Date().getTime()}::${getRandomItem(fallbackUSData.tabIds)};lang=en-US;email=${getRandomItem(fallbackUSData.emails)};user=${getRandomItem(fallbackUSData.usernames)}`;
        }
    }

    // Cookie control: Prevent sensitive data leakage
    let originalCookies = '';
    let fakeCookie = '';
    generateFakeCookie().then(cookie => { fakeCookie = cookie; });
    Object.defineProperty(document, 'cookie', {
        get: function() {
            console.log('[COOKIE] Returning fake cookies');
            return fakeCookie;
        },
        set: async function(value) {
            console.log('[COOKIE] Intercepted cookie set:', value);
            const safeCookies = value.split(';').filter(cookie => !/session|token|id|email|user/i.test(cookie)).join(';');
            originalCookies = safeCookies;
            fakeCookie = await generateFakeCookie();
        },
        configurable: true
    });

    // Modify URL to spoof US timezone and name
    function spoofUSTimezoneInURL(url) {
        try {
            const urlObj = new URL(url);
            const usTimezone = getRandomItem(fallbackUSData.timezones);
            const offset = fallbackUSData.timezoneOffsets[usTimezone] / 60; // Convert to hours
            urlObj.searchParams.set('time_zone', `${offset}`);
            urlObj.searchParams.set('time_name', usTimezone);
            return urlObj.toString();
        } catch (e) {
            console.error('[URL SPOOF] Error:', e);
            return url;
        }
    }

    // Simulate pre-qualification answers
    function generatePreQualAnswers() {
        return {
            '501': '4', // Example: Age group (e.g., 18-24)
            '502': '1', // Gender (e.g., Male)
            '503': '2', // Employment status (e.g., Employed)
            '504': getRandomItem(fallbackUSData.zipCodes), // Zip code
            '505': '1', // Household income (e.g., $50k-$75k)
            '506': '1', // Education level (e.g., Bachelor’s)
            // Add more as needed based on survey requirements
        };
    }

    // Burp Suite-like request interception and modification
    const interceptedRequests = [];
    const originalFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = async function(input, init = {}) {
        console.log('[FETCH] Intercepted request:', input);
        try {
            const request = new Request(input, init);
            let modifiedUrl = spoofUSTimezoneInURL(request.url);
            const modifiedInit = { ...init, headers: new Headers(init.headers || {}), method: init.method || 'GET' };

            // Define safe headers
            const spoofedHeaders = {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Content-Type': modifiedInit.method === 'POST' ? 'application/x-www-form-urlencoded' : undefined
            };

            // Apply headers
            for (const [key, value] of Object.entries(spoofedHeaders)) {
                if (value) modifiedInit.headers.set(key, value);
            }

            // Bypass pre-qualification for CPX surveys
            let modifiedBody = init.body;
            if (request.url.includes('live-api.cpx-research.com') && modifiedInit.method === 'POST') {
                const preQualAnswers = generatePreQualAnswers();
                const bodyParams = new URLSearchParams(init.body || '');
                bodyParams.set('start_time', Math.floor(Date.now() / 1000).toString());
                for (const [key, value] of Object.entries(preQualAnswers)) {
                    bodyParams.set(key, value);
                }
                modifiedBody = bodyParams.toString();
                modifiedInit.body = modifiedBody;
                console.log('[FETCH] Bypassing pre-qualification with body:', modifiedBody);
            }

            // Log request
            const requestData = {
                url: modifiedUrl,
                method: modifiedInit.method,
                headers: {
                    ...Object.fromEntries(modifiedInit.headers),
                    'Sec-Ch-Ua-Platform': '"Android"',
                    'Sec-Ch-Ua': '"Google Chrome";v="127", "Chromium";v="127", "Not=A?Brand";v="8"',
                    'Sec-Ch-Ua-Mobile': '?1',
                    'User-Agent': getRandomItem(fallbackUSData.userAgents),
                    'Cookie': await generateFakeCookie(),
                    'X-Zip-Code': await getRandomData('zipCode') // For logging only
                },
                body: modifiedBody || null,
                timestamp: new Date().toISOString()
            };
            interceptedRequests.push(requestData);
            console.log('[FETCH] Spoofed request:', requestData);

            // Use GM_xmlhttpRequest to bypass CORS
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: modifiedInit.method,
                    url: modifiedUrl,
                    headers: {
                        ...spoofedHeaders,
                        'Sec-Ch-Ua-Platform': '"Android"',
                        'Sec-Ch-Ua': '"Google Chrome";v="127", "Chromium";v="127", "Not=A?Brand";v="8"',
                        'Sec-Ch-Ua-Mobile': '?1',
                        'User-Agent': getRandomItem(fallbackUSData.userAgents),
                        'Cookie': requestData.headers['Cookie']
                    },
                    data: modifiedBody || null,
                    onload: function(response) {
                        try {
                            const headers = new Headers();
                            response.responseHeaders.split('\r\n').filter(h => h).forEach(h => {
                                const [key, ...value] = h.split(': ');
                                headers.append(key, value.join(': '));
                            });
                            resolve(new Response(response.responseText, {
                                status: response.status,
                                statusText: response.statusText,
                                headers
                            }));
                        } catch (e) {
                            console.error('[FETCH] Response parsing error:', e);
                            reject(e);
                        }
                    },
                    onerror: function(err) {
                        console.error('[FETCH] GM_xmlhttpRequest error:', err);
                        reject(err);
                    }
                });
            });
            console.log('[FETCH] Response:', {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers),
                url: response.url
            });
            return response;
        } catch (e) {
            console.error('[FETCH] Fallback to original fetch:', e);
            return originalFetch.call(unsafeWindow, input, init);
        }
    };

    const originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        console.log('[XHR] Intercepted request:', method, url);
        this._method = method;
        this._url = spoofUSTimezoneInURL(url);
        return originalXhrOpen.call(this, method, this._url, ...args);
    };

    const originalXhrSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = async function(body) {
        console.log('[XHR] Modifying headers for:', this._url);
        try {
            const spoofedHeaders = {
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'en-US,en;q=0.9',
                'Content-Type': this._method === 'POST' ? 'application/x-www-form-urlencoded' : undefined
            };

            // Bypass pre-qualification for CPX surveys
            let modifiedBody = body;
            if (this._url.includes('live-api.cpx-research.com') && this._method === 'POST') {
                const preQualAnswers = generatePreQualAnswers();
                const bodyParams = new URLSearchParams(body || '');
                bodyParams.set('start_time', Math.floor(Date.now() / 1000).toString());
                for (const [key, value] of Object.entries(preQualAnswers)) {
                    bodyParams.set(key, value);
                }
                modifiedBody = bodyParams.toString();
                console.log('[XHR] Bypassing pre-qualification with body:', modifiedBody);
            }

            // Log request
            const requestData = {
                url: this._url,
                method: this._method,
                headers: {
                    ...spoofedHeaders,
                    'Sec-Ch-Ua-Platform': '"Android"',
                    'Sec-Ch-Ua': '"Google Chrome";v="127", "Chromium";v="127", "Not=A?Brand";v="8"',
                    'Sec-Ch-Ua-Mobile': '?1',
                    'User-Agent': getRandomItem(fallbackUSData.userAgents),
                    'Cookie': await generateFakeCookie(),
                    'X-Zip-Code': await getRandomData('zipCode') // For logging only
                },
                body: modifiedBody || null,
                timestamp: new Date().toISOString()
            };
            interceptedRequests.push(requestData);
            console.log('[XHR] Spoofed request:', requestData);

            // Use GM_xmlhttpRequest to bypass CORS
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: this._method,
                    url: this._url,
                    headers: {
                        ...spoofedHeaders,
                        'Sec-Ch-Ua-Platform': '"Android"',
                        'Sec-Ch-Ua': '"Google Chrome";v="127", "Chromium";v="127", "Not=A?Brand";v="8"',
                        'Sec-Ch-Ua-Mobile': '?1',
                        'User-Agent': getRandomItem(fallbackUSData.userAgents),
                        'Cookie': requestData.headers['Cookie']
                    },
                    data: modifiedBody || null,
                    onload: function(response) {
                        resolve(response);
                    },
                    onerror: function(err) {
                        console.error('[XHR] GM_xmlhttpRequest error:', err);
                        reject(err);
                    }
                });
            });
            console.log('[XHR] Response:', {
                status: response.status,
                statusText: response.statusText,
                headers: response.responseHeaders
            });

            // Dispatch XHR events
            const loadEvent = new Event('load');
            Object.defineProperty(this, 'status', { value: response.status, writable: false });
            Object.defineProperty(this, 'statusText', { value: response.statusText, writable: false });
            Object.defineProperty(this, 'responseText', { value: response.responseText, writable: false });
            Object.defineProperty(this, 'readyState', { value: 4, writable: false });
            this.dispatchEvent(loadEvent);
            if (this.onreadystatechange) {
                this.onreadystatechange();
            }
        } catch (e) {
            console.error('[XHR] Fallback to original send:', e);
            for (const [key, value] of Object.entries({
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'en-US,en;q=0.9'
            })) {
                try {
                    this.setRequestHeader(key, value);
                } catch (err) {
                    console.error('[XHR] Skipped restricted header:', key, err);
                }
            }
            return originalXhrSend.call(this, body);
        }
    };

    // Check if element or request is captcha-related
    function isCaptchaRelated(elementOrUrl) {
        const keywords = /cdn-cgi|challenge-platform|recaptcha|hcaptcha|turnstile|captcha/i;
        if (typeof elementOrUrl === 'string') {
            return keywords.test(elementOrUrl);
        }
        if (elementOrUrl instanceof Element) {
            const selector = elementOrUrl.tagName.toLowerCase() === 'form' ? elementOrUrl.action : elementOrUrl.href || '';
            const inputs = elementOrUrl.querySelectorAll('input, select, textarea');
            return keywords.test(selector) || Array.from(inputs).some(input => keywords.test(input.name || input.id || input.className || ''));
        }
        return false;
    }

    // Check if request is Toluna survey-related
    function isTolunaSurvey(url) {
        return /ups\.surveyrouter\.com|surveyrouter\.com|toluna\.com/i.test(url);
    }

    // Check if request is US survey router-related
    function isUSSurveyRouter(url) {
        return /\w*\.?cint\.com|router\.cint|samplicio\.us|spectrum-surveys\.com|lucid\.surveys|dynata\.com|qualtrics\.com|cpx-research\.com/i.test(url);
    }

    // Fake LocalStorage
    const fakeLocalStorage = {
        store: {},
        getItem: function(key) { return this.store[key] || null; },
        setItem: function(key, value) { this.store[key] = value.toString(); },
        removeItem: function(key) { delete this.store[key]; },
        clear: function() { this.store = {} }
    };
    if (!isTolunaSurvey(window.location.href)) {
        Object.defineProperty(unsafeWindow, 'localStorage', { value: fakeLocalStorage, writable: false });
    }

    // Fake SessionStorage
    const fakeSessionStorage = {
        store: {},
        getItem: function(key) { return null; },
        setItem: function(key, value) { this.store[key] = value.toString(); },
        removeItem: function(key) { delete this.store[key]; },
        clear: function() { this.store = {} }
    };
    if (!isTolunaSurvey(window.location.href)) {
        Object.defineProperty(unsafeWindow, 'sessionStorage', { value: fakeSessionStorage, writable: false });
    }

    // Advanced protections
    function applyScriptProtections() {
        try {
            Object.defineProperty(unsafeWindow, 'RTCPeerConnection', { value: undefined, writable: false, configurable: true });
            Object.defineProperty(unsafeWindow, 'mozRTCPeerConnection', { value: undefined, writable: false, configurable: true });
            Object.defineProperty(unsafeWindow, 'webkitRTCPeerConnection', { value: undefined, writable: false, configurable: true });
            Object.defineProperty(unsafeWindow, 'Fingerprint2', { get: () => undefined, set: () => {}, configurable: true });
            Object.defineProperty(unsafeWindow, 'FingerprintJS', { get: () => undefined, set: () => {}, configurable: true });
        } catch (e) {
            console.error('[PROTECTIONS] Error:', e);
        }
    }

    // Spoof browser fingerprint
    let originalCanvasContext = null;
    if (HTMLCanvasElement.prototype.getContext && !isTolunaSurvey(window.location.href)) {
        originalCanvasContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function(type, attributes = {}) {
            if (type === '2d' || type === 'webgl') {
                attributes.willReadFrequently = true;
            }
            const context = originalCanvasContext.call(this, type, attributes);
            if (context && (type === '2d' || type === 'webgl')) {
                const originalFillText = context.fillText;
                context.fillText = function() {
                    originalFillText.apply(this, arguments);
                    context.fillRect(Math.random() * 10, Math.random() * 10, 1, 1);
                };
                const originalGetImageData = context.getImageData;
                context.getImageData = function() {
                    const data = originalGetImageData.apply(this, arguments);
                    for (let i = 0; i < data.data.length; i += 4) {
                        data.data[i] += Math.random() * 2 - 1;
                        data.data[i + 1] += Math.random() * 2 - 1;
                        data.data[i + 2] += Math.random() * 2 - 1;
                    }
                    return data;
                };
            }
            return context;
        };
    }

    let originalWebGLParameter = null;
    if (WebGLRenderingContext.prototype.getParameter && !isTolunaSurvey(window.location.href)) {
        originalWebGLParameter = WebGLRenderingContext.prototype.getParameter;
        WebGLRenderingContext.prototype.getParameter = function(parameter) {
            if (parameter === 37446) return 'Qualcomm';
            if (parameter === 37445) return 'Adreno 740';
            return originalWebGLParameter.apply(this, arguments);
        };
    }

    // Spoof fonts
    let originalStyle = null;
    if (unsafeWindow.getComputedStyle && !isTolunaSurvey(window.location.href)) {
        originalStyle = unsafeWindow.getComputedStyle;
        unsafeWindow.getComputedStyle = function(element) {
            const style = originalStyle.call(this, element);
            Object.defineProperty(style, 'fontFamily', {
                get: () => getRandomItem(fallbackUSData.fonts),
                configurable: true
            });
            return style;
        };
    }

    // Spoof Plugins and MimeTypes
    const fakePlugin = {
        name: 'Fake Plugin',
        filename: 'fakeplugin.so',
        description: 'Fake plugin for testing',
        version: '1.0.0',
        length: 0,
        item: function(index) { return null; },
        namedItem: function(name) { return null; }
    };
    const fakePlugins = {
        length: 1,
        0: fakePlugin,
        item: function(index) { return index === 0 ? fakePlugin : null; },
        namedItem: function(name) { return null; },
        refresh: function() {},
        [Symbol.iterator]: function*() { yield fakePlugin; }
    };
    const fakeMimeType = {
        type: 'application/x-plugin',
        description: 'Fake MIME',
        suffixes: ['fake'],
        enabledPlugin: fakePlugin
    };
    const fakeMimeTypes = {
        length: 1,
        0: fakeMimeType,
        item: function(index) { return index === 0 ? fakeMimeType : null; },
        namedItem: function(name) { return null; },
        [Symbol.iterator]: function*() { yield fakeMimeType; }
    };
    if (!isTolunaSurvey(window.location.href)) {
        Object.defineProperty(unsafeWindow.navigator, 'plugins', { value: fakePlugins, writable: false });
        Object.defineProperty(unsafeWindow.navigator, 'mimeTypes', { value: fakeMimeTypes, writable: false });
    }

    // Get user IP
    async function getUserIp() {
        try {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: 'https://api.ipify.org?format=json',
                    onload: function(response) {
                        resolve(JSON.parse(response.responseText));
                    },
                    onerror: function(err) {
                        reject(err);
                    }
                });
            });
            return response.ip;
        } catch (e) {
            console.error('[IP] Error:', e);
            return getRandomItem(fallbackUSData.ipAddresses);
        }
    }

    // Spoof browser data
    const fakeNavigator = {
        userAgent: GM_getValue('userAgent', getRandomItem(fallbackUSData.userAgents)),
        platform: 'Linux aarch64',
        language: 'en-US',
        languages: ['en-US'],
        timezone: GM_getValue('timezone', getRandomItem(fallbackUSData.timezones)),
        geolocation: {
            getCurrentPosition: function(callback) {
                const coords = getRandomItem(fallbackUSData.coordinates);
                callback({ coords: { latitude: coords.latitude, longitude: coords.longitude } });
            }
        },
        cookieEnabled: true,
        hardwareConcurrency: 8,
        deviceMemory: 4,
        maxTouchPoints: 5,
        vendor: 'Google Inc.',
        webdriver: false,
        doNotTrack: '1',
        connection: { effectiveType: '4g', rtt: 50, downlink: 10 },
        permissions: {
            query: function() { return Promise.resolve({ state: 'granted' }); }
        },
        plugins: fakePlugins,
        mimeTypes: fakeMimeTypes
    };
    Object.defineProperty(unsafeWindow, 'navigator', { value: fakeNavigator, writable: false, configurable: true });

    // Spoof Date for US timezone
    const originalDate = unsafeWindow.Date;
    const fakeDate = function(...args) {
        const date = new originalDate(...args);
        const timezone = GM_getValue('timezone', getRandomItem(fallbackUSData.timezones));
        date.toLocaleString = function(...localeArgs) {
            return new originalDate().toLocaleString('en-US', { timeZone: timezone, ...localeArgs[1] });
        };
        date.getTimezoneOffset = function() {
            return fallbackUSData.timezoneOffsets[timezone] || -240;
        };
        return date;
    };
    fakeDate.now = originalDate.now;
    Object.defineProperty(unsafeWindow, 'Date', { value: fakeDate, writable: false, configurable: true });

    // Spoof whoer.net compatibility and US identity
    async function spoofWhoerNet(userIp = null) {
        try {
            const ip = userIp || await getUserIp();
            const dns = getRandomItem(fallbackUSData.dnsServers);
            const timezone = getRandomItem(fallbackUSData.timezones);
            const userAgent = getRandomItem(fallbackUSData.userAgents);
            fakeNavigator.userAgent = userAgent;
            fakeNavigator.platform = 'Linux aarch64';
            fakeNavigator.language = 'en-US';
            fakeNavigator.languages = ['en-US'];
            fakeNavigator.doNotTrack = '1';
            fakeNavigator.timezone = timezone;
            unsafeWindow.screen = {
                width: 1080,
                height: 2400,
                availWidth: 1080,
                availHeight: 2400,
                colorDepth: 24,
                pixelDepth: 24
            };
            Object.defineProperty(unsafeWindow, 'screen', { value: unsafeWindow.screen, writable: false, configurable: true });
            Object.defineProperty(unsafeWindow, 'WebGLRenderingContext', { value: function() { return { getParameter: () => 'WebGL 2.3' }; }, writable: false, configurable: true });
            Object.defineProperty(unsafeWindow, 'FontFace', { value: () => ({ family: getRandomItem(fallbackUSData.fonts) }) , writable: false, configurable: true });
            Object.defineProperty(unsafeWindow, 'Intl', {
                value: {
                    DateTimeFormat: () => ({
                        resolvedOptions: () => ({ timeZone: timezone, locale: 'en-US' })
                    })
                },
                writable: false,
                configurable: false
            });
            GM_setValue('timezone', timezone);
            GM_setValue('userAgent', userAgent);
        } catch (e) {
            console.error('[WHOERNET] Error:', e);
        }
    }

    // Load jQuery
    function ensureJQuery() {
        try {
            if (!window.jQuery) {
                const script = document.createElement('script');
                script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
                document.head.appendChild(script);
            }
        } catch (e) {
            console.error('[JQUERY] Error:', e);
        }
    }

    // Disable Datadog
    function disableDatadog() {
        try {
            if (window.DD_RUM) {
                window.DD_RUM = { init: () => {}, addAction: () => {} };
            }
        } catch (e) {
            console.error('[DATADOG] Error:', e);
        }
    }

    // Start
    applyScriptProtections();
    ensureJQuery();
    disableDatadog();
    window.addEventListener('load', async () => {
        try {
            const ip = await getUserIp();
            await spoofWhoerNet(ip);
        } catch (e) {
            console.error('[STARTUP] Error:', e);
        }
    });
})();