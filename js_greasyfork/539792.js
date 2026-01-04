// ==UserScript==
// @name         AlaaBotTimeSyncV13
// @namespace    http://www
// @version      13
// @description  Advanced Survey Privacy Helper
// @author       AlaaAsh
// @match        *://*/*
// @exclude      *://*.cloudflare.com/*
// @exclude      *://*.recaptcha.net/*
// @exclude      *://*.hcaptcha.com/*
// @exclude      *://*.cint.com/*
// @exclude      *://*.samplicio.us/*
// @exclude      *://*.spectrum-surveys.com/*
// @exclude      *://router*.cint.com/*
// @exclude      *://*.lucid.com/*
// @exclude      *://*.dynata.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539792/AlaaBotTimeSyncV13.user.js
// @updateURL https://update.greasyfork.org/scripts/539792/AlaaBotTimeSyncV13.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // * Silent console
    const silentConsole = {
        log: () => {},
        error: () => {},
        warn: () => {},
        info: () => {},
        debug: () => {},
    };
    Object.assign(unsafeWindow.console, silentConsole);

    // * Block anti-bot redirects
    const blockedDomainsRegex = /(botfaqtor\.ru|cloudflare\.com|recaptcha\.net|hcaptcha\.com|cint\.com|samplicio\.us|spectrum-surveys\.com|lucid\.com|dynata\.com)/i;
    const originalPushState = history.pushState;
    history.pushState = function(state, title, url) {
        if (blockedDomainsRegex.test(url)) return;
        return originalPushState.apply(this, arguments);
    };

    // * Session hash
    const sessionHash = btoa(Date.now() + Math.random().toString(36).substring(2)).substring(0, 16);
    GM_setValue('sessionHash', sessionHash);

    // * US-only geo data
    const usGeoData = [
        { country: 'United States', country_code: 'US', city: 'New York', timezone: 'America/New_York', timezone_offset: -240, language: 'en-US', zip: '10001', latitude: '40.7128', longitude: '-74.0060', ip: '192.168.1.2' },
        { country: 'United States', country_code: 'US', city: 'Los Angeles', timezone: 'America/Los_Angeles', timezone_offset: -420, language: 'en-US', zip: '90001', latitude: '34.0522', longitude: '-118.2437', ip: '172.16.100.1' },
        { country: 'United States', country_code: 'US', city: 'Chicago', timezone: 'America/Chicago', timezone_offset: -300, language: 'en-US', zip: '60601', latitude: '41.8781', longitude: '-87.6298', ip: '192.0.2.1' },
        { country: 'United States', country_code: 'US', city: 'Miami', timezone: 'America/New_York', timezone_offset: -240, language: 'en-US', zip: '33101', latitude: '25.7617', longitude: '-80.1918', ip: '192.168.1.3' },
    ];

    // * Fallback data with expanded Android User-Agents
    const fallbackData = {
        usernames: ['JohnDoe', 'JaneSmith', 'MikeJohnson', 'SarahWilliams'],
        emails: ['john.doe@example.com', 'jane.smith@example.com', 'mike.j@example.com', 'sarah.w@example.com'],
        userAgents: [
            'Mozilla/5.0 (Linux; Android 14; SM-G991U Build/UP1A.231231231; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/127.0.6533.64 Mobile Safari/537.36',
            'Mozilla/5.0 (Linux; Android 13; Pixel 6 Build/TQ3A.230901.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/126.0.6478.71 Mobile Safari/537.36',
            'Mozilla/5.0 (Linux; Android 14; SM-A546U Build/UP1A.231231231; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/127.0.6533.64 Mobile Safari/537.36',
            'Mozilla/5.0 (Linux; Android 12; SM-N975U Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/125.0.6422.113 Mobile Safari/537.36',
            'Mozilla/5.0 (Linux; Android 13; Pixel 7 Build/TD1A.220804.031; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/126.0.6478.133 Mobile Safari/537.36',
        ],
        ipAddresses: ['192.168.1.2', '172.16.100.1', '192.0.2.1', '192.168.1.3'],
        macAddresses: ['00:11:22:A3:B4:C6', '00:22:33:C6:D7:E8'],
        sessionIds: ['SID-usa789', 'SID-usa123', 'SID-usa456'],
        tabIds: ['TAB-usa789', 'TAB-usa123', 'TAB-usa456'],
        tokens: ['AUTH-usa789', 'AUTH-usa123', 'AUTH-usa456'],
        phoneNumbers: ['+1-212-555-1234', '+1-310-555-5678', '+1-312-555-9012', '+1-305-555-6789'],
        dnsServers: ['8.8.8.8', '1.1.1.1'],
        languages: ['en-US'],
        secChUa: [
            '"Google Chrome";v="127", "Chromium";v="127", "Not=A?Brand";v="8"',
            '"Google Chrome";v="126", "Chromium";v="126", "Not=A?Brand";v="8"',
            '"Google Chrome";v="125", "Chromium";v="125", "Not=A?Brand";v="8"',
        ],
        fonts: ['Roboto', 'Arial', 'Helvetica'],
        coordinates: [
            { latitude: '40.7128', longitude: '-74.0060' },
            { latitude: '34.0522', longitude: '-118.2437' },
            { latitude: '41.8781', longitude: '-87.6298' },
            { latitude: '25.7617', longitude: '-80.1918' },
        ],
        timezones: ['America/New_York', 'America/Los_Angeles', 'America/Chicago'],
        timezoneOffsets: {
            'America/New_York': -240,
            'America/Los_Angeles': -420,
            'America/Chicago': -300,
        },
    };

    const fakePlugins = [
        { name: 'PDF Viewer', filename: 'internal-pdf-viewer', description: 'Portable Document Format', mimeTypes: [{ type: 'application/pdf' }] },
        { name: 'Chrome PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai', description: 'Portable Document Format', mimeTypes: [{ type: 'application/pdf' }] },
    ];
    const fakeMimeTypes = [{ type: 'application/pdf', suffixes: 'pdf', description: 'Portable Document Format' }];

    // * Get user IP (optimized, cached, no proxy)
    async function getUserIp() {
        let cachedIp = GM_getValue('userIp_' + sessionHash, null);
        if (cachedIp) return cachedIp;

        const ipApis = [
            'https://api.ipify.org?format=json',
            'https://ipapi.co/json/',
            'https://jsonip.com/',
        ];
        const maxRetries = 3;

        for (const api of ipApis) {
            for (let attempt = 0; attempt < maxRetries; attempt++) {
                try {
                    const response = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: api,
                            headers: {
                                'User-Agent': currentUserAgent,
                                'Accept': 'application/json',
                                'Accept-Encoding': 'gzip, deflate, br',
                                'Sec-Fetch-Site': 'cross-site',
                                'Sec-Fetch-Mode': 'cors',
                                'Sec-Fetch-Dest': 'empty',
                            },
                            timeout: 8000, // Increased timeout
                            onload: function(response) {
                                try {
                                    const data = JSON.parse(response.responseText);
                                    resolve(data);
                                } catch {
                                    reject(new Error('IP parse failed'));
                                }
                            },
                            onerror: () => reject(new Error('Network error')),
                            ontimeout: () => reject(new Error('Request timed out')),
                        });
                    });
                    if (response.ip) {
                        GM_setValue('userIp_' + sessionHash, response.ip);
                        return response.ip;
                    }
                } catch (e) {
                    if (attempt === maxRetries - 1) continue;
                }
            }
        }
        const fallbackIp = getRandomItem(fallbackData.ipAddresses);
        GM_setValue('userIp_' + sessionHash, fallbackIp);
        return fallbackIp;
    }

    // * Fetch user geo-data (cached)
    async function fetchGeoData(userIp = null) {
        let cachedGeoData = GM_getValue('geoData_' + sessionHash, null);
        if (cachedGeoData && cachedGeoData.ip === userIp) return cachedGeoData;

        try {
            const ip = userIp || await getUserIp();
            const randomUsGeo = { ...getRandomItem(usGeoData), ip };
            GM_setValue('geoData_' + sessionHash, randomUsGeo);
            return randomUsGeo;
        } catch (e) {
            const fallbackGeo = { ...getRandomItem(usGeoData), ip: userIp || getRandomItem(fallbackData.ipAddresses) };
            GM_setValue('geoData_' + sessionHash, fallbackGeo);
            return fallbackGeo;
        }
    }

    // * Initialize geo data
    let geoData = getRandomItem(usGeoData);
    let currentUserAgent = getRandomItem(fallbackData.userAgents);
    GM_setValue('userAgent_' + sessionHash, currentUserAgent);
    getUserIp().then(ip => fetchGeoData(ip)).then((data) => {
        geoData = data;
        GM_setValue('geoData_' + sessionHash, geoData);
        GM_setValue('timezone', geoData.timezone);
        GM_setValue('language', 'en-US');
        spoofBrowserEnvironment();
    }).catch(() => {});

    // * Get random item
    function getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)] || 'unknown';
    }

    // * Fetch with retries (optimized, no proxy)
    async function fetchWithRetries(url, headers, retries = 2, backoff = 200) {
        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                return await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: url,
                        headers: {
                            ...headers,
                            'Sec-Fetch-Mode': 'cors',
                            'Accept-Encoding': 'gzip, deflate, br',
                        },
                        timeout: 8000,
                        onload: resolve,
                        onerror: () => reject(new Error('Network error')),
                        ontimeout: () => reject(new Error('Request timed out')),
                    });
                });
            } catch (error) {
                if (attempt < retries - 1) {
                    await new Promise(resolve => setTimeout(resolve, backoff));
                    continue;
                }
                throw error;
            }
        }
    }
    
    
    
  
 


    // تزييف TCP/IP عبر رؤوس HTTP مع دعم Cint
    async function spoofTcpIpHeaders(xhrOrFetchInit) {
        const fakeIp = await getRandomData('ip');
        const fakeZip = await getRandomData('zipCode');
        xhrOrFetchInit.headers['X-Forwarded-For'] = fakeIp;
        xhrOrFetchInit.headers['Client-IP'] = fakeIp;
        xhrOrFetchInit.headers['Via'] = `1.1 proxy-us-${Math.random().toString(36).substr(2, 5)}.net`;
        xhrOrFetchInit.headers['X-Real-IP'] = fakeIp;
        xhrOrFetchInit.headers['X-TCP-TTL'] = Math.floor(Math.random() * (128 - 64) + 64).toString();
        xhrOrFetchInit.headers['X-TCP-Window-Size'] = Math.floor(Math.random() * (65535 - 16384) + 16384).toString();
        xhrOrFetchInit.headers['X-Zip-Code'] = fakeZip;
    }

    // إعداد fakeLocalStorage لتخزين بيانات المستخدم
    const fakeLocalStorage = {
        store: {},
        getItem: function(key) {
            console.log('%cWormGPT: محاولة قراءة localStorage، مفتاح: ' + key, 'color: orange;');
            return this.store[key] || null;
        },
        setItem: function(key, value) {
            console.log('%cWormGPT: تخزين في localStorage، مفتاح: ' + key + '، قيمة: ' + value, 'color: orange;');
            this.store[key] = value.toString();
        },
        removeItem: function(key) {
            console.log('%cWormGPT: إزالة من localStorage، مفتاح: ' + key, 'color: orange;');
            delete this.store[key];
        },
        clear: function() {
            console.log('%cWormGPT: مسح localStorage!', 'color: orange;');
            this.store = {};
        }
    };

    Object.defineProperty(window, 'localStorage', {
        value: fakeLocalStorage,
        writable: false
    });

    // اعتراض document.cookie بحذر
    let originalCookies = document.cookie || '';
    let fakeCookieCache = generateFakeCookie();
    Object.defineProperty(document, 'cookie', {
        get: function() {
            console.log('%cWormGPT: تم اعتراض طلب الكوكيز! يتم حقن قيم أمريكية وهمية مع دعم Cint', 'color: red; font-weight: bold;');
            try {
                const combinedCookies = `${originalCookies ? originalCookies + ';' : ''}${fakeCookieCache}`;
                return combinedCookies;
            } catch (e) {
                console.error('%cWormGPT: خطأ في توليد الكوكيز، إرجاع الكوكيز الأصلية', 'color: red;');
                return originalCookies;
            }
        },
        set: function(value) {
            console.log('%cWormGPT: محاولة إضافة كوكي! تم تخزين القيمة', 'color: red; font-weight: bold;');
            console.log('الكوكي المحاول: ' + value);
            originalCookies = value;
            fakeCookieCache = generateFakeCookie(getUserData());
        },
        configurable: true
    });

    // تعطيل sessionStorage
    const fakeSessionStorage = {
        store: {},
        getItem: function(key) {
            console.log('%cWormGPT: محاولة قراءة sessionStorage، إرجاع null', 'color: orange;');
            return null;
        },
        setItem: function(key, value) {
            console.log('%cWormGPT: محاولة تخزين في sessionStorage، تم تجاهلها!', 'color: orange;');
            this.store[key] = value.toString();
        },
        removeItem: function(key) {
            console.log('%cWormGPT: محاولة إزالة من sessionStorage، تم تجاهلها!', 'color: orange;');
            delete this.store[key];
        },
        clear: function() {
            console.log('%cWormGPT: محاولة مسح sessionStorage، تم تجاهلها!', 'color: orange;');
            this.store = {};
        }
    };

    Object.defineProperty(window, 'sessionStorage', {
        value: fakeSessionStorage,
        writable: false
    });




    // تزييف بصمة المتصفح
    const originalCanvas = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type) {
        const context = originalCanvas.apply(this, arguments);
        if (type === '2d' || type === 'webgl') {
            const originalFillText = context.fillText;
            context.fillText = function() {
                originalFillText.apply(this, arguments);
                context.fillRect(Math.random() * 10, Math.random() * 10, 1, 1);
            };
        }
        return context;
    };

    const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function(parameter) {
        if (parameter === 37446) return 'Intel Inc.';
        if (parameter === 37445) return 'Intel Iris OpenGL Engine';
        return originalGetParameter.apply(this, arguments);
    };

    // تزييف بيانات المتصفح مع دعم Cint
    const fakeNavigator = {
        userAgent: getRandomItem(fallbackUSData.userAgents),
        platform: 'Win32',
        language: 'en-US',
        languages: ['en-US', 'en'],
        timezone: getRandomItem(fallbackUSData.timezones),
        geolocation: {
            getCurrentPosition: function(callback) {
                callback({
                    coords: {
                        latitude: 40.7128 + (Math.random() * 0.1),
                        longitude: -74.0060 + (Math.random() * 0.1)
                    }
                });
            }
        },
        cookieEnabled: true,
        hardwareConcurrency: 4,
        deviceMemory: 8,
        maxTouchPoints: 0,
        vendor: 'Google Inc.',
        webdriver: false,
        cintPanel: 'CINT-PANEL-' + Math.random().toString(36).substr(2, 12)
    };

    Object.defineProperty(window, 'navigator', {
        value: fakeNavigator,
        writable: false
    });






    
    
    

    // * Bulk fetch random user data (optimized, cached)
    async function bulkFetchRandomData() {
        let cachedData = GM_getValue('bulkData_' + sessionHash, null);
        if (cachedData) return cachedData;

        const dataTypes = ['username', 'email', 'phone', 'ip', 'mac', 'sessionId', 'tabId', 'token'];
        const results = {};
        try {
            results.username = getRandomItem(fallbackData.usernames);
            results.email = `${results.username.toLowerCase().replace(/\s+/g, '.')}@example.com`;
            results.phone = getRandomItem(fallbackData.phoneNumbers);
            results.ip = geoData.ip;
            results.mac = getRandomItem(fallbackData.macAddresses);
            const id = Math.random().toString(36).substring(2, 8);
            results.sessionId = `SID-${id}`;
            results.tabId = `TAB-${id}`;
            results.token = `AUTH-${id}`;

            GM_setValue('bulkData_' + sessionHash, results);
            for (const type of dataTypes) {
                GM_setValue(`${type}_${sessionHash}`, results[type]);
            }
            return results;
        } catch (error) {
            for (const type of dataTypes) {
                const fallback = type === 'ip' ? geoData.ip : getRandomItem(fallbackData[type] || ['unknown']);
                GM_setValue(`${type}_${sessionHash}`, fallback);
                results[type] = fallback;
            }
            GM_setValue('bulkData_' + sessionHash, results);
            return results;
        }
    }

    // * Fetch random data
    async function getRandomData(type) {
        let cachedData = GM_getValue(`${type}_${sessionHash}`, null);
        if (cachedData) return cachedData;
        const bulkData = await bulkFetchRandomData();
        return bulkData[type] || getRandomItem(fallbackData[type] || ['unknown']);
    }

    // * Pre-warm API cache
    bulkFetchRandomData().catch(() => {});

    // * Generate fake cookies (cached)
    async function generateFakeCookie() {
        let cachedCookie = GM_getValue('fakeCookie_' + sessionHash, null);
        if (cachedCookie) return cachedCookie;

        try {
            const fakeCookie = {
                sessionId: await getRandomData('sessionId'),
                tabId: await getRandomData('tabId'),
                token: await getRandomData('token'),
                username: await getRandomData('username'),
                email: await getRandomData('email'),
                timestamp: Date.now().toString(),
                deviceId: btoa(Math.random().toString(36).substring(2)).substring(0, 12),
            };
            const cookieString = `users_session=${fakeCookie.sessionId};_scid=${fakeCookie.tabId};_tt_enable_cookie=1;_ttp=${
                fakeCookie.token
            };_fbp=fb.1.${Date.now()}.${Math.floor(Math.random() * 1000000).toString()};_sctr=1%7C${Date.now()};ccid=${
                Date.now()
            }::${fakeCookie.tabId};lang=en_US;email=${encodeURIComponent(fakeCookie.email)};user=${encodeURIComponent(
                fakeCookie.username
            )};zip=${geoData.zip};device_id=${fakeCookie.deviceId};android_version=14;timezone=${encodeURIComponent(geoData.timezone)}`;
            GM_setValue('fakeCookie_' + sessionHash, cookieString);
            return cookieString;
        } catch (error) {
            const cookieString = `users_session=${encodeURIComponent(getRandomItem(fallbackData.sessionIds))};_scid=${encodeURIComponent(getRandomItem(
                fallbackData.tabIds
            ))};_tt_enable_cookie=1;_ttp=${encodeURIComponent(getRandomItem(fallbackData.tokens))};_fbp=fb.1.${Date.now()}.${Math.floor(Math.random() * 1000000).toString()};_sctr=1%7C${Date.now()};ccid=${
                Date.now()
            }::${encodeURIComponent(getRandomItem(fallbackData.tabIds))};lang=en-us;email=${encodeURIComponent(getRandomItem(fallbackData.emails))};user=${encodeURIComponent(
                getRandomItem(fallbackData.usernames
            ))};zip=${encodeURIComponent(geoData.zip)};device_id=${encodeURIComponent(btoa(Math.random().toString(36).substring(2)).substring(0, 12))};android_version=14;timezone=${encodeURIComponent(geoData.timezone)}`;
            GM_setValue('fakeCookie_' + sessionHash, cookieString);
            return cookieString;
        }
    }

    // * Cookie control
    let fakeCookie = '';
    generateFakeCookie().then((cookie) => {
        fakeCookie = cookie;
    }).catch(() => {});
    Object.defineProperty(document, 'cookie', {
        get: function() {
            return fakeCookie;
        },
        set: async function(value) {
            if (!value.includes('en-US') || !value.includes(geoData.timezone)) return false;
            fakeCookie = await generateFakeCookie();
            return true;
        },
        configurable: true,
    });

    // * Cookie wiper
    async function clearCookies() {
        try {
            const cookies = document.cookie.split(';');
            for (const cookie of cookies) {
                const name = cookie.split('=')[0].trim();
                if (!fakeCookie.includes(name) || !cookie.includes('en-US') || !cookie.includes(geoData.timezone)) {
                    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
                }
            }
            fakeCookie = await generateFakeCookie();
        } catch (error) {
            // Silent catch
        }
    }
    setInterval(clearCookies, 60 * 1000);



// * Survey Utilities Module to avoid redefinition conflicts
const SurveyUtils = SurveyUtils || {};

// * Declare global variables (only if not defined)
if (typeof currentUserAgent === 'undefined') {
    let currentUserAgent = GM_getValue('currentUserAgent', '');
    SurveyUtils.currentUserAgent = currentUserAgent;
}

// * Get random item from array (only if not defined)
if (typeof getRandomItem === 'undefined') {
    SurveyUtils.getRandomItem = function getRandomItem(array) {
        if (!Array.isArray(array) || array.length === 0) {
            console.error('[getRandomItem] Invalid or empty array');
            return null;
        }
        return array[Math.floor(Math.random() * array.length)];
    };
}

// * Generate random US IP from Comcast, T-Mobile, or Verizon (only if not defined)
if (typeof generateRandomUSIP === 'undefined') {
    SurveyUtils.generateRandomUSIP = function generateRandomUSIP() {
        const ipRanges = [
            { provider: 'Comcast', start: [73, 0, 0, 0], end: [73, 255, 255, 255] },
            { provider: 'T-Mobile', start: [172, 32, 0, 0], end: [172, 63, 255, 255] },
            { provider: 'Verizon', start: [71, 96, 0, 0], end: [71, 127, 255, 255] },
        ];
        const range = SurveyUtils.getRandomItem(ipRanges);
        if (!range) {
            console.error('[generateRandomUSIP] No valid IP range selected');
            return '0.0.0.0';
        }
        const ip = [];
        for (let i = 0; i < 4; i++) {
            const min = range.start[i];
            const max = range.end[i];
            ip.push(Math.floor(Math.random() * (max - min + 1)) + min);
        }
        const generatedIP = ip.join('.');
        console.log('[generateRandomUSIP] Generated IP:', generatedIP);
        return generatedIP;
    };
}

// * Extract cpxConfig from URL (only if not defined)
if (typeof extractCpxConfig === 'undefined') {
    SurveyUtils.extractCpxConfig = function extractCpxConfig() {
        const params = new URLSearchParams(window.location.search);
        const usUserAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/128.0.0.0',
        ];

        const cpxConfig = {
            app_id: params.get('app_id') || '19793',
            ext_user_id: params.get('ext_user_id') || '601192',
            secure_hash: params.get('secure_hash') || 'c887a67ce6f86521402d154626a9a61c',
            email: params.get('email') || 'jackyflentoe@gmail.com',
            username: params.get('username') || 'jackyrobinson',
            subid_1: params.get('subid_1') || '',
            subid_2: params.get('subid_2') || '',
            profile: {
                main_info: true,
                birthday_day: '15',
                birthday_month: '06',
                birthday_year: '1998',
                gender: 'M',
                user_country_code: 'US',
                zip_code: '10001', // New York ZIP code
            },
            ip_user: SurveyUtils.generateRandomUSIP(),
            user_agent: encodeURIComponent(SurveyUtils.getRandomItem(usUserAgents) || usUserAgents[0]),
        };
        console.log('[extractCpxConfig] Config extracted:', cpxConfig);
        return cpxConfig;
    };
}

// * Spoof timezone in URL (only if not defined)
if (typeof spoofTimezoneInURL === 'undefined') {
    SurveyUtils.spoofTimezoneInURL = function spoofTimezoneInURL(url) {
        try {
            const timezone = 'America/New_York';
            const urlObj = new URL(url);
            urlObj.searchParams.set('tz', encodeURIComponent(timezone));
            return urlObj.toString();
        } catch (error) {
            console.error('[spoofTimezoneInURL] Error:', error.message);
            return url;
        }
    };
}

// * Spoof headers for American user (only if not defined)
if (typeof getSpoofedHeaders === 'undefined') {
    SurveyUtils.getSpoofedHeaders = function getSpoofedHeaders(method) {
        const cpxConfig = SurveyUtils.extractCpxConfig();
        return {
            'User-Agent': decodeURIComponent(cpxConfig.user_agent),
            'Accept-Language': 'en-US,en;q=0.9',
            'X-Forwarded-For': cpxConfig.ip_user,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Referer': window.location.origin,
            'Origin': window.location.origin,
        };
    };
}

// * Spoof Date object for American timezone (only if not defined)
if (typeof spoofedDate === 'undefined') {
    const originalDate = Date;
    const spoofedDate = new Proxy(Date, {
        construct(target, args) {
            const date = args.length ? new originalDate(...args) : new originalDate();
            const offset = new originalDate().getTimezoneOffset() + 240; // America/New_York (UTC-4)
            date.setMinutes(date.getMinutes() - offset);
            return date;
        },
    });
    if (typeof unsafeWindow !== 'undefined') {
        unsafeWindow.Date = spoofedDate;
    } else {
        console.warn('[spoofedDate] unsafeWindow not available, Date spoofing skipped');
    }
    SurveyUtils.spoofedDate = spoofedDate;
}

// * Process user survey answers (only if not defined)
if (typeof generateSurveyAnswers === 'undefined') {
    SurveyUtils.generateSurveyAnswers = function generateSurveyAnswers(questionId = '') {
        const form = document.querySelector('form');
        const input = form?.querySelector(`input[name="${questionId}"], select[name="${questionId}"], textarea[name="${questionId}"], input[id*="${questionId}"]`);
        let answer = '';

        // Detect question type based on questionId and form input
        const detectQuestionType = (questionId, form) => {
            const input = form?.querySelector(`input[name="${questionId}"], select[name="${questionId}"], textarea[name="${questionId}"], input[id*="${questionId}"]`);
            if (!input) {
                if (questionId.match(/501|502|505|506|yes|no|agree|disagree/i)) return 'yesNo';
                if (questionId.match(/503|number|count|quantity|digit/i)) return 'numeric';
                if (questionId.match(/504|zip|postal/i)) return 'zip';
                if (questionId.match(/age|birth|year|dob/i)) return 'ageYear';
                if (questionId.match(/gender|sex/i)) return 'gender';
                if (questionId.match(/rating|scale|score/i)) return 'rating';
                if (questionId.match(/choice|option|select|multi|radio|check/i)) return 'multipleChoice';
                if (questionId.match(/dropdown|menu/i)) return 'dropdown';
                if (questionId.match(/email/i)) return 'email';
                if (questionId.match(/phone|tel/i)) return 'phone';
                if (questionId.match(/comment|feedback|open|text|sentence/i)) return 'openEnded';
                return 'custom';
            }

            const type = input.getAttribute('type')?.toLowerCase() || input.tagName.toLowerCase();
            if (type === 'number') return input.getAttribute('pattern')?.includes('\\d{4}') ? 'fourDigit' : 'numeric';
            if (type === 'radio' || type === 'checkbox') return 'multipleChoice';
            if (type === 'select' || type === 'select-one' || type === 'select-multiple') return 'dropdown';
            if (type === 'email') return 'email';
            if (type === 'tel') return 'phone';
            if (type === 'textarea' || questionId.match(/comment|feedback|open|sentence/i)) return 'openEnded';
            if (type === 'text') {
                if (questionId.match(/age|birth|year|dob/i)) return 'ageYear';
                if (input.getAttribute('pattern')?.includes('\\d{4}')) return 'fourDigit';
                if (input.getAttribute('maxlength') && parseInt(input.getAttribute('maxlength')) > 20) return 'openEnded';
                return 'text';
            }
            if (questionId.match(/rating|scale|score/i)) return input.max && parseInt(input.max) > 5 ? 'rating10' : 'rating';
            if (questionId.match(/age|birth|year|dob/i)) return 'ageYear';
            return 'custom';
        };

        // Validate and process user input
        const validateUserInput = (type, input, questionId) => {
            let userInput = input?.value || '';
            if (!userInput && (input?.type === 'radio' || input?.type === 'checkbox')) {
                const checked = form?.querySelector(`input[name="${questionId}"]:checked`);
                userInput = checked?.value || '';
            }

            if (!userInput) {
                return ''; // No input provided
            }

            const min = input?.getAttribute('min') ? parseInt(input.getAttribute('min')) : null;
            const max = input?.getAttribute('max') ? parseInt(input.getAttribute('max')) : null;
            const pattern = input?.getAttribute('pattern');
            const maxLength = input?.getAttribute('maxlength') ? parseInt(input.getAttribute('maxlength')) : null;

            // Validate input based on type and constraints
            if (type === 'numeric' || type === 'fourDigit' || type === 'rating' || type === 'rating10') {
                const num = parseInt(userInput);
                if (isNaN(num) || (min !== null && num < min) || (max !== null && num > max)) {
                    return ''; // Invalid number
                }
                if (type === 'fourDigit' && !/^\d{4}$/.test(userInput)) {
                    return ''; // Must be four digits
                }
            } else if (type === 'ageYear' && window.location.href.includes('app_id=19793')) {
                const inputType = input?.getAttribute('type')?.toLowerCase() || input?.tagName.toLowerCase();
                const year = parseInt(userInput);
                const currentYear = new SurveyUtils.spoofedDate().getFullYear();
                const age = currentYear - year;

                if (inputType === 'number') {
                    userInput = age.toString(); // Return age (e.g., "27" for 1998)
                } else if (inputType === 'text' && !/^\d{4}$/.test(userInput)) {
                    return null; // Invalid year format
                } else if (inputType === 'select' || type === 'dropdown') {
                    const validOption = Array.from(input?.querySelectorAll('option:not([value=""])') || [])
                        .find(opt => opt.value === userInput || opt.value.match(new RegExp(userInput, 'i')))?.value;
                    userInput = validOption || userInput;
                }
            } else if (type === 'dropdown' || type === 'multipleChoice') {
                const options = input?.tagName.toLowerCase() === 'select'
                    ? input.querySelectorAll('option:not([value=""])')
                    : form?.querySelectorAll(`input[name="${questionId}"], input[id*="${questionId}"]`);
                const validOptions = Array.from(options || [])
                    .map(opt => opt.value)
                    .filter(val => val && !val.match(/select|options|choose|default/i));
                if (!validOptions.includes(userInput) && !validOptions.some(opt => opt.toLowerCase() === userInput?.toLowerCase())) {
                    return null; // Invalid choice
                }
            } else if (type === 'text' || type === 'openEnded' || type === 'custom') {
                if (pattern && !new RegExp(pattern).test(userInput)) {
                    return null; // Pattern mismatch
                }
                if (maxLength && userInput.length > maxLength) {
                    userInput = userInput.slice(0, maxLength);
                }
            } else if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInput)) {
                return null; // Invalid email
            } else if (type === 'phone' && !/^\+?\d[\d\s-]{6,}$/.test(userInput)) {
                return null; // Invalid phone
            } else if (type === 'zip' && !/^\d{5}(-\d{4})?$/.test(userInput)) {
                return null; // Invalid zip
            }

            const cpxConfig = SurveyUtils.extractCpxConfig();
            return userInput === cpxConfig.email ? userInput : userInput;
        };

        const type = detectQuestionType(questionId, form);
        answer = validateUserInput(type, input, questionId);

        return {
            [questionId]: answer,
            client_timezone: 'America/New_York',
            client_timestamp: Math.floor(new SurveyUtils.spoofedDate().getTime() / 1000).toString(),
            language: 'en-US',
        };
    };
}













    // * Simulate human behavior (enhanced)
    function simulateHumanBehavior() {
        function randomDelay(min = 50, max = 200) {
            return new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * (max - min + 1)) + min));
        }

        async function simulateMouse() {
            const x = Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1;
            const y = Math.random() * window.innerHeight * 0.8 + window.innerHeight * 0.1;
            const moveEvent = new MouseEvent('mousemove', {
                bubbles: true,
                clientX: x,
                clientY: y,
            });
            await randomDelay();
            document.dispatchEvent(moveEvent);

            // Simulate random click
            if (Math.random() < 0.1) {
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    clientX: x,
                    clientY: y,
                });
                document.dispatchEvent(clickEvent);
            }
        }

        async function simulateTouch() {
            if (!window.Touch || !window.TouchEvent) return;
            try {
                const x = Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1;
                const y = Math.random() * window.innerHeight * 0.8 + window.innerHeight * 0.1;
                const touch = new Touch({
                    identifier: Date.now(),
                    target: document.body,
                    clientX: x,
                    clientY: y,
                    screenX: x,
                    screenY: y,
                    pageX: x,
                    pageY: y,
                    radiusX: 2.5,
                    radiusY: 2.5,
                });
                const touchStart = new TouchEvent('touchstart', {
                    bubbles: true,
                    touches: [touch],
                    targetTouches: [touch],
                    changedTouches: [touch],
                });
                await randomDelay();
                document.dispatchEvent(touchStart);

                // Simulate swipe
                if (Math.random() < 0.2) {
                    const touchEnd = new TouchEvent('touchend', {
                        bubbles: true,
                        touches: [],
                        targetTouches: [],
                        changedTouches: [touch],
                    });
                    document.dispatchEvent(touchEnd);
                }
            } catch (e) {
                // Silent catch
            }
        }

       setInterval(simulateMouse, 1500);
       setInterval(simulateTouch, 4000);
    }
  //  simulateHumanBehavior();

    // * Get spoofed headers with dynamic variation
    function getSpoofedHeaders(method = 'GET') {
        return {
            Accept: method === 'POST' ? 'application/json, text/plain, */*' : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Content-Type': method === 'POST' ? 'application/json' : undefined,
            'Sec-Ch-Ua': getRandomItem(fallbackData.secChUa),
            'Sec-Ch-Ua-Mobile': '?1',
            'Sec-Ch-Ua-Platform': '"Android"',
            'User-Agent': currentUserAgent,
            Origin: window.location.origin,
            Referer: window.location.href,
            'Sec-Fetch-Mode': method === 'POST' ? 'cors' : 'navigate',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Dest': method === 'POST' ? 'empty' : 'document',
            'Sec-Fetch-User': method === 'GET' ? '?1' : undefined,
            'X-Forwarded-For': geoData.ip,
            'X-Zip-Code': geoData.zip,
            'X-Language': 'en-US',
            'X-Device-Id': btoa(Math.random().toString(36).substring(2)).substring(0, 12),
            'X-Client-Timezone': geoData.timezone,
            'X-Client-Timestamp': Math.floor(Date.now() / 1000).toString(),
        };
    }

    // * Lock navigator state
    function lockNavigator() {
        const fakeNavigator = {
            userAgent: currentUserAgent,
            platform: 'Android',
            language: 'en-US',
            languages: ['en-US'],
            timezone: geoData.timezone,
            geolocation: {
                getCurrentPosition: function(callback) {
                    callback({
                        coords: { latitude: parseFloat(geoData.latitude), longitude: parseFloat(geoData.longitude) },
                        timestamp: Date.now(),
                    });
                },
            },
            cookieEnabled: true,
            hardwareConcurrency: 8,
            deviceMemory: 6,
            maxTouchPoints: 5,
            vendor: 'Google Inc.',
            webdriver: null,
            doNotTrack: null,
            connection: { effectiveType: '4g', rtt: 50, downlink: 10 },
            permissions: {
                query: () => Promise.resolve({ state: 'granted' }),
            },
            plugins: fakePlugins,
            mimeTypes: fakeMimeTypes,
        };

        const navigatorProxy = new Proxy(unsafeWindow.navigator, {
            get: function(target, prop) {
                return fakeNavigator[prop] || target[prop];
            },
            set: function(target, prop, value) {
                if (prop === 'languages' || prop === 'language') return true;
                target[prop] = value;
                return true;
            },
        });

        for (const prop of Object.keys(fakeNavigator)) {
            try {
                const descriptor = Object.getOwnPropertyDescriptor(unsafeWindow.navigator, prop);
                if (descriptor && !descriptor.configurable) continue;
                Object.defineProperty(unsafeWindow.navigator, prop, {
                    value: fakeNavigator[prop],
                    writable: false,
                    configurable: true,
                });
            } catch (e) {
                // Silent catch
            }
        }

        Object.defineProperty(unsafeWindow, 'navigator', {
            value: navigatorProxy,
            writable: false,
            configurable: true,
        });
    }

    // * Load jQuery
    function ensureJQuery() {
        try {
            if (!window.jQuery) {
                const script = document.createElement('script');
                script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js';
                script.async = true;
                document.head.appendChild(script);
            }
        } catch (e) {
            // Silent catch
        }
    }
    ensureJQuery();

    // * Disable Datadog
    function disableDatadog() {
        try {
            if (window.DD_RUM) {
                window.DD_RUM = { init: () => {}, addAction: () => {} };
                Object.defineProperty(window, 'DD_RUM', { value: null, writable: false, configurable: true });
            }
        } catch (e) {
            // Silent catch
        }
    }
    disableDatadog();

    // * Intercept fetch requests
    const interceptedRequests = [];
    const originalFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = async function(input, init = {}) {
        if (blockedDomainsRegex.test(input.toString())) return new Response(null, { status: 403 });
        try {
            const request = new Request(input, init);
            if (!request.url.includes('cpx-research.com') && !request.url.match(/survey|question|response|next/i)) {
                return originalFetch.call(unsafeWindow, input, init);
            }

            const modifiedUrl = spoofTimezoneInURL(request.url);
            const modifiedInit = { ...init, method: init.method || 'GET', headers: new Headers(init.headers || {}) };
            const headers = getSpoofedHeaders(modifiedInit.method);

            for (const [key, value] of Object.entries(headers)) {
                if (value) modifiedInit.headers.set(key, value);
            }

            let modifiedBody = init.body;
            if (modifiedInit.method === 'POST') {
                let bodyObj = {};
                try {
                    bodyObj = JSON.parse(modifiedBody || '{}');
                } catch {
                    bodyObj = Object.fromEntries(new URLSearchParams(modifiedBody || ''));
                }
                bodyObj.client_timezone = geoData.timezone;
                bodyObj.client_timestamp = Math.floor(Date.now() / 1000).toString();
                bodyObj.language = 'en-US';
                if (request.url.includes('live-api.cpx-research.com') || request.url.match(/survey|question|response|next/i)) {
                    const questionId = bodyObj.questionId || bodyObj.qid || Object.keys(bodyObj)[0] || 'answer';
                    Object.assign(bodyObj, generateSurveyAnswers(questionId));
                }
                modifiedBody = modifiedInit.headers.get('Content-Type')?.includes('application/json') ? JSON.stringify(bodyObj) : new URLSearchParams(bodyObj).toString();
                modifiedInit.body = modifiedBody;
            }

            const requestData = {
                url: modifiedUrl,
                method: modifiedInit.method,
                headers: {
                    ...Object.fromEntries(modifiedInit.headers),
                    Cookie: fakeCookie,
                },
                body: modifiedBody || null,
                timestamp: new Date().toISOString(),
            };
            interceptedRequests.push(requestData);

            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: modifiedInit.method,
                    url: modifiedUrl,
                    headers: {
                        ...headers,
                        Cookie: fakeCookie,
                    },
                    data: modifiedBody || null,
                    timeout: 8000,
                    onload: function(response) {
                        try {
                            const headers = new Headers();
                            response.responseHeaders.split('\n').filter(line => line.includes(': ')).forEach(line => {
                                const [key, ...value] = line.split(': ');
                                headers.append(key, value.join(': '));
                            });
                            let responseBody = response.responseText;
                            try {
                                JSON.parse(responseBody);
                            } catch {
                                // Silent catch
                            }
                            resolve(new Response(responseBody, {
                                status: response.status,
                                statusText: response.statusText,
                                headers,
                            }));
                        } catch (error) {
                            reject(error);
                        }
                    },
                    onerror: () => {
                        currentUserAgent = getRandomItem(fallbackData.userAgents);
                        GM_setValue('userAgent_' + sessionHash, currentUserAgent);
                        reject(new Error('Request failed'));
                    },
                    ontimeout: () => reject(new Error('Request timed out')),
                });
            });

            return response;
        } catch (error) {
            return originalFetch.call(unsafeWindow, input, init);
        }
    };

    // * Intercept XMLHttpRequest requests
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        if (blockedDomainsRegex.test(url)) return null;
        this._method = method;
        this._url = spoofTimezoneInURL(url);
        return originalXhrOpen.call(this, method, this._url, ...args);
    };

    const originalXhrSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = async function(body) {
        if (!this._url.includes('cpx-research.com') && !this._url.match(/survey|question|response|next/i)) {
            return originalXhrSend.call(this, body);
        }

        try {
            const headers = getSpoofedHeaders(this._method);
            let modifiedBody = body;
            if (this._method === 'POST') {
                let bodyObj = {};
                try {
                    bodyObj = JSON.parse(body || '{}');
                } catch {
                    bodyObj = Object.fromEntries(new URLSearchParams(body || ''));
                }
                bodyObj.client_timezone = geoData.timezone;
                bodyObj.client_timestamp = Math.floor(Date.now() / 1000).toString();
                bodyObj.language = 'en-US';
                if (this._url.includes('live-api.cpx-research.com') || this._url.match(/survey|question|response|next/i)) {
                    const questionId = bodyObj.questionId || bodyObj.qid || Object.keys(bodyObj)[0] || 'answer';
                    Object.assign(bodyObj, generateSurveyAnswers(questionId));
                }
                modifiedBody = headers['Content-Type']?.includes('application/json') ? JSON.stringify(bodyObj) : new URLSearchParams(bodyObj).toString();
            }

            const xhrRequestData = {
                url: this._url,
                method: this._method,
                headers: {
                    ...headers,
                    Cookie: fakeCookie,
                },
                body: modifiedBody || null,
                timestamp: new Date().toISOString(),
            };
            interceptedRequests.push(xhrRequestData);

            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: this._method,
                    url: this._url,
                    headers: {
                        ...headers,
                        Cookie: fakeCookie,
                    },
                    data: modifiedBody || null,
                    timeout: 8000,
                    onload: function(response) {
                        let responseBody = response.responseText;
                        try {
                            JSON.parse(responseBody);
                        } catch {
                            // Silent catch
                        }
                        resolve({
                            status: response.status,
                            statusText: response.statusText,
                            responseText: responseBody,
                            headers: response.responseHeaders,
                        });
                    },
                    onerror: () => {
                        currentUserAgent = getRandomItem(fallbackData.userAgents);
                        GM_setValue('userAgent_' + sessionHash, currentUserAgent);
                        reject(new Error('Request failed'));
                    },
                    ontimeout: () => reject(new Error('Request timed out')),
                });
            });

            const loadEvent = new Event('load');
            Object.defineProperty(this, 'status', { value: response.status, writable: true, configurable: true });
            Object.defineProperty(this, 'statusText', { value: response.statusText, writable: true, configurable: true });
            Object.defineProperty(this, 'responseText', { value: response.responseText, writable: true, configurable: true });
            Object.defineProperty(this, 'readyState', { value: 4, writable: true, configurable: true });
            setTimeout(() => {
                this.dispatchEvent(loadEvent);
                if (this.onreadystatechange) this.onreadystatechange();
            }, 0);
        } catch (error) {
            throw error;
        }
    };

    // * Intercept WebSocket
    const originalWebSocket = unsafeWindow.WebSocket;
    unsafeWindow.WebSocket = function(url, protocols = []) {
        if (blockedDomainsRegex.test(url)) return null;
        try {
            const modifiedUrl = spoofTimezoneInURL(url);
            const ws = new originalWebSocket(modifiedUrl, protocols);
            const originalSend = ws.send;
            ws.send = function(data) {
                try {
                    let modifiedData = data;
                    if (typeof data === 'string') {
                        const dataObj = JSON.parse(data) || {};
                        dataObj.client_timezone = geoData.timezone;
                        dataObj.client_timestamp = Math.floor(Date.now() / 1000).toString();
                        dataObj.language = 'en-US';
                        modifiedData = JSON.stringify(dataObj);
                    }
                    return originalSend.call(this, modifiedData);
                } catch (error) {
                    return originalSend.call(this, data);
                }
            };
            return ws;
        } catch (e) {
            return null;
        }
    };
    Object.defineProperty(unsafeWindow, 'WebSocket', {
        value: unsafeWindow.WebSocket,
        writable: false,
        configurable: true,
    });

    // * Intercept navigator.sendBeacon
    const originalSendBeacon = navigator.sendBeacon;
    navigator.sendBeacon = function(url, data) {
        if (blockedDomainsRegex.test(url)) return false;
        try {
            const modifiedUrl = spoofTimezoneInURL(url);
            const bodyObj = Object.fromEntries(new URLSearchParams(data || ''));
            bodyObj.client_timezone = geoData.timezone;
            bodyObj.client_language = 'en-US';
            bodyObj.client_timestamp = Math.floor(Date.now() / 1000).toString();
            if (modifiedUrl.match(/survey|question|response|next/i)) {
                const questionId = bodyObj.questionId || bodyObj.qid || 'answer';
                Object.assign(bodyObj, generateSurveyAnswers(questionId));
            }
            const modifiedData = new URLSearchParams(bodyObj).toString();
            return originalSendBeacon.call(navigator, modifiedUrl, modifiedData);
        } catch (e) {
            return originalSendBeacon.call(navigator, url, data);
        }
    };

    // * Fake Date
    const originalDate = Date;
    const FakeDate = function(...args) {
        const baseDate = args.length ? new originalDate(...args) : new originalDate();
        const date = new originalDate(baseDate.toLocaleString('en-US', { timeZone: geoData.timezone }));
        date.toLocaleString = function(locale, options = {}) {
            return new originalDate().toLocaleString('en-US', {
                timeZone: geoData.timezone,
                timeZoneName: options?.timeZoneName || 'short',
                ...options,
            });
        };
        date.toLocaleTimeString = function(locale, options) {
            return new originalDate().toLocaleTimeString('en-US', {
                timeZone: geoData.timezone,
                timeZoneName: options?.timeZoneName || 'short',
                ...options,
            });
        };
        date.toLocaleDateString = function(locale, options) {
            return new originalDate().toLocaleDateString('en-US', { timeZone: geoData.timezone, ...options });
        };
        date.getTimezoneOffset = function() {
            return geoData.timezone_offset;
        };
        date.toString = function() {
            return new originalDate().toISOString();
        };
        date.toTimeString = function() {
            return `${new originalDate().toLocaleTimeString('en-US', { timeZone: geoData.timezone })} GMT${geoData.timezone_offset >= 0 ? '+' : '-'}${Math.floor(Math.abs(geoData.timezone_offset) / 60).toString().padStart(2, '0')}${Math.abs(geoData.timezone_offset % 60).toString().padStart(2, '0')}`;
        };
        date.toDateString = function() {
            return new originalDate().toLocaleDateString('en-US', { timeZone: geoData.timezone });
        };
        return date;
    };

    Object.defineProperty(unsafeWindow, 'Date', { value: FakeDate, writable: false, configurable: true });
    unsafeWindow.Date.now = function() {
        return originalDate.now();
    };

    // * Fake Intl API
    Object.defineProperty(unsafeWindow, 'Intl', {
        value: {
            DateTimeFormat: function(locale = 'en-US', options = {}) {
                return {
                    resolvedOptions: () => ({ locale: 'en-US', timeZone: geoData.timezone }),
                    format: (date) => new originalDate(date).toLocaleString('en-US', { timeZone: geoData.timezone, ...options }),
                };
            },
            getCanonicalLocales: () => ['en-US'],
            supportedLocalesOf: () => ['en-US'],
            NumberFormat: function(locale = 'en-US') {
                return {
                    format: (num) => num.toLocaleString('en-US'),
                    resolvedOptions: () => ({ locale: 'en-US' }),
                };
            },
            Collator: function(locale = 'en-US') {
                return {
                    compare: (a, b) => a.localeCompare(b, 'en-US'),
                    resolvedOptions: () => ({ locale: 'en-US' }),
                };
            },
            PluralRules: function(locale = 'en-US') {
                return {
                    select: (n) => n === 1 ? 'one' : 'other',
                    resolvedOptions: () => ({ locale: 'en-US' }),
                };
            },
        },
        writable: false,
        configurable: true,
    });

    // * Fake performance metrics
    const originalPerformanceNow = (typeof performance !== 'undefined' && typeof performance.now === 'function') ? performance.now.bind(performance) : () => Date.now();
    Object.defineProperty(window, 'performance', {
        value: {
            now: originalPerformanceNow,
            navigationStart: originalPerformanceNow() - 1000,
            fetchStart: originalPerformanceNow() - 900,
            domLoading: originalPerformanceNow() - 800,
            domComplete: originalPerformanceNow(),
            timeOrigin: originalPerformanceNow() - 1000,
        },
        writable: false,
        configurable: true,
    });
    Object.defineProperty(window, 'performance.now', {
        value: originalPerformanceNow,
        writable: false,
        configurable: true,
    });
    Object.defineProperty(window, 'performance.timeOrigin', {
        value: originalPerformanceNow() - 1000,
        writable: true,
        configurable: false,
    });

    // * Fake WebGL
    if (typeof WebGLRenderingContext !== 'undefined' && WebGLRenderingContext.prototype.getParameter) {
        const originalWebGL = WebGLRenderingContext.prototype.getParameter;
        WebGLRenderingContext.prototype.getParameter = function(params) {
            if (params === 37446) return 'Qualcomm';
            if (params === 37445) return 'Adreno';
            if (params === 37440) return null;
            if (params === 7938) return 'WebGL';
            return originalWebGL.call(this, params);
        };
    }

    // * Fake canvas
    const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function(...args) {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = `rgba(${Math.random() * 10}, ${Math.random() * 50}, ${Math.random() * 100}, 0.02)`;
                ctx.fillRect(0, 2, canvas.width || 1, canvas.height || 1);
            }
            return originalToDataURL.call(this, ...args);
        } catch (error) {
            return originalToDataURL.call(this, args);
        }
    };

    // * Fake WebRTC
    Object.defineProperties(unsafeWindow, {
        RTCPeerConnection: { value: undefined, writable: false, configurable: true },
        webkitRTCPeerConnection: { value: undefined, writable: false, configurable: true },
        mozRTCPeerConnection: { value: undefined, writable: false, configurable: true },
        connection: { value: null, writable: false, configurable: true },
    });

    // * Fake fonts
    if (typeof unsafeWindow.getComputedStyle === 'function') {
        const originalGetStyle = unsafeWindow.getComputedStyle;
        unsafeWindow.getComputedStyle = function(element) {
            const style = originalGetStyle.call(this, element);
            Object.defineProperty(style, 'fontFamily', {
                get: () => 'Roboto',
            });
            return style;
        };
    }

    // * Fake DOM
    Object.defineProperty(document.documentElement, 'lang', { value: 'en-US', writable: false, configurable: true });
    Object.defineProperty(document, 'documentElement', { value: document.documentElement, writable: false, configurable: true });
    Object.defineProperty(document, 'contentLanguage', { value: 'en-US', writable: true, configurable: true });

    // * Additional spoofing
    function spoofBrowserEnvironment() {
        try {
            lockNavigator();
            unsafeWindow.screen = {
                width: 1080,
                height: 2340,
                availWidth: 1080,
                availHeight: 2160,
                colorDepth: 24,
                pixelDepth: 24,
            };
            Object.defineProperties(unsafeWindow, {
                screen: { value: unsafeWindow.screen, writable: false, configurable: true },
                language: { value: 'en-US', writable: false, configurable: true },
            });
            Object.defineProperty(unsafeWindow, 'FontFace', {
                value: function() {
                    return { family: 'Roboto' };
                },
                writable: false,
                configurable: true,
            });
        } catch (e) {
            // Silent catch
        }
    }

    // * Initialize
    window.addEventListener('load', () => {
        spoofBrowserEnvironment();
        lockNavigator();
        try {
            disableDatadog();
        } catch (e) {
            // Silent catch
        }
    });

    // * Periodic IP sync
    setInterval(async () => {
        try {
            const ip = await getUserIp();
            const newGeoData = await fetchGeoData(ip);
            if (newGeoData.ip !== geoData.ip || newGeoData.timezone !== geoData.timezone) {
                geoData = newGeoData;
                GM_setValue('geoData_' + sessionHash, geoData);
                GM_setValue('timezone', geoData.timezone);
                currentUserAgent = getRandomItem(fallbackData.userAgents);
                GM_setValue('userAgent_' + sessionHash, currentUserAgent);
                spoofBrowserEnvironment();
                lockNavigator();
                await clearCookies();
                fakeCookie = await generateFakeCookie();
            }
        } catch (e) {
            // Silent catch
        }
    }, 8000);
})();

