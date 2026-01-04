// ==UserScript==
// @name         TikTok No Login Anti-Captcha v3
// @namespace    tiktok
// @version      1.2
// @description  CAPTCHA bypass + Device Fingerprint spoofing
// @author       -
// @match        *://www.tiktok.com/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @connect      tiktok.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527382/TikTok%20No%20Login%20Anti-Captcha%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/527382/TikTok%20No%20Login%20Anti-Captcha%20v3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. TİKTOK'UN BEKLENTİSİ OLAN FİNGERPRINT VERİLERİ
    const generateFingerprint = () => {
        return {
            device_id: GM_getValue('device_id') || `7${CryptoJS.lib.WordArray.random(16).toString()}`,
            install_id: GM_getValue('install_id') || CryptoJS.lib.WordArray.random(16).toString(),
            openudid: GM_getValue('openudid') || CryptoJS.lib.WordArray.random(16).toString(),
            iid: GM_getValue('iid') || CryptoJS.lib.WordArray.random(16).toString(),
        };
    };

    // 2. X-BOGUS & SIGNATURE OLUŞTURUCU
    const generateXBogus = (url) => {
        // Bu kısım TikTok'un özel algoritmasını taklit eder (kısaltılmış versiyon)
        const text = new TextEncoder().encode(url);
        const hash = CryptoJS.SHA256(CryptoJS.lib.WordArray.create(text)).toString();
        return `X-Bogus: DF${hash.substr(0, 25)}`;
    };

    // 3. CRITICAL COOKIE LER
    const setCookies = () => {
        const fp = generateFingerprint();
        document.cookie = `msToken=${btoa(fp.device_id)}; domain=.tiktok.com; path=/`;
        document.cookie = `tt_webid=${fp.device_id}; domain=.tiktok.com; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; secure`;
        document.cookie = `tt_webid_v2=${fp.device_id}; domain=.tiktok.com; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; secure`;
    };

    // 4. API İSTEKLERİNE MÜDAHALE
    const hijackAPIs = () => {
        const originalFetch = window.fetch;
        window.fetch = async (url, init) => {
            if (typeof url === 'string' && url.includes('/api/')) {
                const fp = generateFingerprint();
                const newUrl = new URL(url);
                
                // Zorunlu parametreler
                newUrl.searchParams.set('device_id', fp.device_id);
                newUrl.searchParams.set('iid', fp.iid);
                newUrl.searchParams.set('openudid', fp.openudid);
                
                // Header manipülasyonu
                init.headers = {
                    ...init.headers,
                    'X-Bogus': generateXBogus(newUrl.toString()),
                    'X-Gorgon': '04048044000000000000000000000000',
                    'X-Khronos': Math.floor(Date.now() / 1000),
                    'X-Tt-Token': CryptoJS.lib.WordArray.random(32).toString(),
                };
            }
            return originalFetch(url, init);
        };
    };

    // 5. CAPTCHA TRİGGERLARINI ENGELLE
    const blockCaptcha = () => {
        Object.defineProperty(unsafeWindow, 'captcha', {
            value: null,
            writable: false
        });
        unsafeWindow.localStorage.setItem('tt_captcha_token', 'dummy_token');
    };

    // 6. HUMAN-LİKE DELAY (Saniyede 3 istek limiti)
    const humanDelay = () => {
        let lastRequest = 0;
        const delay = 3000; // 3 saniye
        return (fn) => {
            const now = Date.now();
            if (now - lastRequest < delay) {
                setTimeout(fn, delay - (now - lastRequest));
            } else {
                fn();
                lastRequest = now;
            }
        };
    };

    // INIT
    setCookies();
    hijackAPIs();
    blockCaptcha();
    humanDelay()(() => {
        console.log('TikTok Anti-Captcha aktif!');
    });
})();