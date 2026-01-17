// ==UserScript==
// @name         CDN & Server Info Displayer (UI Overhaul)
// @name:en      CDN & Server Info Displayer (UI Overhaul)
// @namespace    http://tampermonkey.net/
// @version      7.53.0
// @description  [v7.53.0] 新增知道创宇加速乐CDN检测支持,修复Fastly误判问题。智能DNS选择: 根据用户IP所在地区自动选择最优DNS服务器(中国大陆使用阿里DNS,其他地区使用Google DNS),解决国内外CDN分流和DNS污染问题,支持VPN分流场景实时切换。
// @description:en [v7.53.0] Added KnowSec JiaSuLe CDN detection support, fixed Fastly false positive issue. Smart DNS Selection: Automatically choose optimal DNS server based on user's IP location (Alibaba DNS for mainland China, Google DNS for other regions), solving CDN geo-routing and DNS pollution issues, with real-time switching support for VPN split tunneling.
// @author       Zhou Sulong
// @license      MIT
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_getResourceText
// @resource     cdn_rules https://raw.githubusercontent.com/zhousulong/cdn-server-info-userscript/main/cdn_rules.json?v=7.53.0
// @connect      dns.alidns.com
// @connect      dns.google
// @connect      1.1.1.1
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/538977/CDN%20%20Server%20Info%20Displayer%20%28UI%20Overhaul%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538977/CDN%20%20Server%20Info%20Displayer%20%28UI%20Overhaul%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Configuration ---
    const config = {
        initialPosition: { bottom: '20px', right: '20px' },
        initial_delay: 2500,
        retry_delay: 7000,
        max_retries: 4,
        excludePatterns: [
            /\/wp-admin/i,
            /\/wp-login\.php/i,
            /(\/|&)pay(pal|ment)/i,
            /\/checkout|\/billing/i,
            /\/login|\/signin|\/auth/i,
            /\/phpmyadmin/i,
            /(\/ads\/|ad_id=|advertisement)/i,
            /doubleclick\.net/i,
        ],
        // Default settings
        settings: {
            theme: 'auto', // 'auto', 'dark' or 'light'
            panelPosition: 'bottom-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right'
            showExtraInfo: true,
            excludedUrls: [],
        },
        // Initial position for custom placement
        initialPosition: {
            bottom: '20px',
            right: '20px'
        }
    };

    window.cdnScriptStatus = window.cdnScriptStatus || {};

    // --- Core Info Parsing Functions ---
    function getCacheStatus(h) {
        const headersToCheck = [
            h.get('mpulse_cdn_cache'),    // Akamai mPulse (reliable with fetch)
            h.get('eo-cache-status'), // Prioritize specific headers
            h.get('hascache'), // Kestrel-based CDN
            h.get('x-cache'),
            h.get('x-bdcdn-cache-status'),
            h.get('x-response-cache'),
            h.get('x-qc-cache'),
            h.get('x-cache-lookup'),
            h.get('cache-status'),
            h.get('x-cache-status'),
            h.get('x-edge-cache-status'),
            h.get('x-sucuri-cache'),
            h.get('x-vercel-cache'),
            h.get('cf-cache-status'),
            h.get('cdn-cache'),
            h.get('bunny-cache-state'),
            h.get('x-site-cache-status'),
            h.get('x-litespeed-cache'),
            h.get('x-lsadc-cache'),
        ];
        for (const value of headersToCheck) {
            if (!value) continue;
            const firstValue = value.split(',')[0].trim();
            const upperVal = firstValue.toUpperCase();
            if (upperVal.includes('HIT')) return 'HIT';
            if (upperVal.includes('MISS')) return 'MISS';
            if (upperVal.includes('BYPASS')) return 'BYPASS';
            if (upperVal.includes('DYNAMIC')) return 'DYNAMIC';
        }
        if (parseInt(h.get('age'), 10) > 0) return 'HIT (inferred)';
        return 'N/A';
    }


    // CDN Providers Configuration
    // --- Rule Loading & Custom Handlers ---
    let cdnRules = {};

    // Custom handlers for complex extraction logic that can't be easily JSON-ified
    const customHandlers = {
        'Akamai': {
            getInfo: (h, rule) => {
                let cache = 'N/A';

                // Priority 1: Check server-timing cdn-cache (modern Akamai)
                const serverTiming = h.get('server-timing');
                if (serverTiming) {
                    const cdnCacheMatch = serverTiming.match(/cdn-cache;\s*desc=([^,;]+)/i);
                    if (cdnCacheMatch && cdnCacheMatch[1]) {
                        cache = cdnCacheMatch[1].trim().toUpperCase();
                    }
                }

                // Priority 2: Check x-ak-cache (Akamai specific)
                if (cache === 'N/A') {
                    const xAkCache = h.get('x-ak-cache');
                    if (xAkCache) {
                        const status = xAkCache.toUpperCase();
                        if (status.includes('HIT')) {
                            cache = 'HIT';
                        } else if (status.includes('MISS')) {
                            cache = 'MISS';
                        } else if (status.includes('ERROR')) {
                            cache = 'ERROR';
                        }
                    }
                }

                // Priority 3: Check x-tzla-edge-cache-hit (Tesla specific)
                if (cache === 'N/A') {
                    const tzlaHit = h.get('x-tzla-edge-cache-hit');
                    if (tzlaHit) {
                        cache = tzlaHit.toUpperCase().includes('HIT') ? 'HIT' : 'MISS';
                    }
                }

                // Priority 4: Check x-age header
                if (cache === 'N/A') {
                    const xAge = h.get('x-age');
                    if (xAge !== null) {
                        const age = parseInt(xAge);
                        if (age === 0) {
                            cache = 'MISS';
                        } else if (age > 0) {
                            cache = 'HIT';
                        }
                    }
                }

                // Fallback to generic cache status
                if (cache === 'N/A') {
                    cache = getCacheStatus(h);
                }

                let pop = 'N/A';

                // Try multiple POP extraction strategies
                // Strategy 1: x-tzla-edge-server (Tesla's Akamai)
                const tzlaServer = h.get('x-tzla-edge-server');
                if (tzlaServer) {
                    // Extract from "sjc38p1tegvr67.teslamotors.com" -> "SJC"
                    const match = tzlaServer.match(/^([a-z]{3})\d+/i);
                    if (match && match[1]) {
                        pop = match[1].toUpperCase();
                    }
                }

                // Strategy 2: x-served-by (standard Akamai)
                if (pop === 'N/A') {
                    const servedBy = h.get('x-served-by');
                    if (servedBy) {
                        const match = servedBy.match(/cache-([a-z0-9]+)-/i);
                        if (match && match[1]) pop = match[1].toUpperCase();
                    }
                }

                // Strategy 3: EdgeScape geo headers (fallback for location info)
                if (pop === 'N/A') {
                    const country = h.get('x-visitor-country');
                    const continent = h.get('x-visitor-continent');
                    if (country) {
                        // Use country code as POP indicator (e.g., "JP", "US", "CN")
                        pop = country.toUpperCase();
                        // Add continent info if available for better context
                        if (continent) {
                            pop = `${continent.toUpperCase()}-${pop}`;
                        }
                    }
                }

                // Extract request ID if available
                let requestId = h.get('x-request-id') || h.get('x-akamai-request-id') || h.get('x-cache-uuid') || h.get('x-reference-error');

                // Fallback: extract from server-timing (Akamai's ak_p)
                if (!requestId) {
                    const serverTiming = h.get('server-timing');
                    if (serverTiming) {
                        const akMatch = serverTiming.match(/ak_p;\s*desc="?([^;"]+)"?/i);
                        if (akMatch) requestId = akMatch[1];
                    }
                }

                const extra = requestId ? `Req-ID: ${requestId}` : 'Detected via Akamai header/cookie';

                return {
                    provider: 'Akamai',
                    cache: cache,
                    pop: pop,
                    extra: extra,
                };
            }
        },
        'Tencent Cloud': { // Updated name
            getInfo: (h, rule) => {
                let cache = 'N/A';
                const eoCache = h.get('eo-cache-status');
                const nwsLookup = h.get('x-cache-lookup');
                if (eoCache) {
                    cache = eoCache.toUpperCase();
                } else if (nwsLookup) {
                    const firstPart = nwsLookup.split(',')[0].trim();
                    cache = firstPart.replace('Cache ', '').toUpperCase();
                } else {
                    cache = getCacheStatus(h);
                }
                const logUuid = h.get('eo-log-uuid') || h.get('x-nws-log-uuid') || 'N/A';
                return {
                    provider: 'Tencent Cloud',
                    cache: cache,
                    pop: 'N/A',
                    extra: `Log-UUID: ${logUuid}`,
                };
            }
        },
        'Kingsoft Cloud CDN': {
            getInfo: (h, rule) => {
                let cache = 'N/A';
                const cacheStatus = h.get('x-cache-status');
                if (cacheStatus) {
                    const match = cacheStatus.match(/^([A-Z]+)\s+from/i);
                    if (match) cache = match[1].toUpperCase();
                }
                if (cache === 'N/A') cache = getCacheStatus(h);

                let pop = 'N/A';
                if (cacheStatus) {
                    // Extract from "KS-CLOUD-YANC-MP-16-05" -> "YANC"
                    const match = cacheStatus.match(/KS-CLOUD-([A-Z]{2,6})-\w+/i);
                    if (match) {
                        pop = match[1].toUpperCase();
                    }
                }

                if (pop === 'N/A') {
                    const via = h.get('x-link-via');
                    if (via) {
                        // Extract from "ntct13:443;yancmp16:80;" -> "NTCT13"
                        const match = via.match(/([^:;]+):/);
                        if (match) pop = match[1].toUpperCase();
                    }
                }

                const requestId = h.get('x-cdn-request-id') || h.get('x-kss-request-id') || 'N/A';

                return {
                    provider: 'Kingsoft Cloud CDN',
                    cache: cache,
                    pop: pop,
                    extra: `Req-ID: ${requestId}`,
                };
            }
        },
        'Gcore': {
            getInfo: (h, rule) => {
                let cache = h.get('cache') || 'N/A';
                if (cache === 'N/A') cache = getCacheStatus(h);
                else cache = cache.toUpperCase();

                const traceparent = h.get('traceparent') || h.get('x-id') || 'N/A';

                return {
                    provider: 'Gcore',
                    cache: cache,
                    pop: 'N/A',
                    extra: `ID: ${traceparent.split('-')[1] || traceparent}`,
                };
            }
        },
        'BytePlus CDN': {
            getInfo: (h, rule) => {
                let cache = 'N/A';
                // Parse from server-timing: cdn-cache;desc=miss
                const serverTiming = h.get('server-timing');
                if (serverTiming) {
                    const match = serverTiming.match(/cdn-cache;desc=([^,]+)/);
                    if (match) cache = match[1].toUpperCase();
                }
                if (cache === 'N/A') cache = getCacheStatus(h);

                // BytePlus CDN doesn't have standard airport codes, skip POP
                let pop = 'N/A';

                const requestId = h.get('x-cdn-request-id') || h.get('x-tt-trace-id') || 'N/A';

                return {
                    provider: 'BytePlus CDN',
                    cache: cache,
                    pop: pop,
                    extra: `Req-ID: ${requestId}`,
                };
            }
        },
        'CDNetworks': {
            getInfo: (h, rule) => {
                let cache = getCacheStatus(h);

                let pop = 'N/A';
                // Prioritize x-via as it contains more detailed POP info
                const via = h.get('x-via') || h.get('via');

                console.log('[CDNetworks] via:', via);
                console.log('[CDNetworks] x-via:', h.get('x-via'));

                if (via) {
                    // Try to extract alphabetic codes first (e.g., PS-FOC, PS-NTG)
                    // Avoid pure numeric codes like CS-000
                    const regex = /(PS|CS)-([A-Z0-9]{3})-/g;
                    let match;
                    while ((match = regex.exec(via)) !== null) {
                        const code = match[2];
                        console.log('[CDNetworks] Found:', code, 'HasLetter:', /[A-Z]/.test(code));
                        // Only accept codes that contain at least one letter
                        if (/[A-Z]/.test(code)) {
                            pop = code.toUpperCase();
                            console.log('[CDNetworks] Selected POP:', pop);
                            break;
                        }
                    }
                }

                // If not found in via, try x-px header or x-ws-request-id
                if (pop === 'N/A') {
                    const altHeaders = [h.get('x-px'), h.get('x-ws-request-id')];
                    for (const val of altHeaders) {
                        if (val) {
                            const regex = /(PS|CS)-([A-Z0-9]{3})-/g;
                            let match;
                            while ((match = regex.exec(val)) !== null) {
                                const code = match[2];
                                if (/[A-Z]/.test(code)) {
                                    pop = code.toUpperCase();
                                    break;
                                }
                            }
                            if (pop !== 'N/A') break;
                        }
                    }
                }

                const requestId = h.get('x-ws-request-id') || 'N/A';

                return {
                    provider: 'CDNetworks',
                    cache: cache,
                    pop: pop,
                    extra: `Req-ID: ${requestId}`,
                };
            }
        },
        'State Cloud CDN': {
            getInfo: (h, rule) => {
                let cache = 'N/A';
                const ctlStatus = h.get('ctl-cache-status');
                if (ctlStatus) {
                    const match = ctlStatus.match(/^(HIT|MISS|EXPIRED|UPDATING)/i);
                    if (match) cache = match[0].toUpperCase();
                }
                if (cache === 'N/A') cache = getCacheStatus(h);

                let pop = 'N/A';
                if (ctlStatus) {
                    // Extract from "HIT from zj-wenzhou8-ca08" -> "ZJ-WENZHOU"
                    const match = ctlStatus.match(/from ([a-z0-9-]+)/i);
                    if (match) {
                        const parts = match[1].split('-');
                        pop = (parts[0] + (parts[1] ? '-' + parts[1].replace(/\d+$/, '') : '')).toUpperCase();
                    }
                }

                const requestId = h.get('x-ct-request-id') || h.get('request-id') || 'N/A';

                return {
                    provider: 'State Cloud CDN',
                    cache: cache,
                    pop: pop,
                    extra: `Req-ID: ${requestId}`,
                };
            }
        },
        'Adobe Experience Manager': {
            getInfo: (h, rule) => {
                let cache = getCacheStatus(h);
                let pop = 'N/A';
                const dispatcher = h.get('x-dispatcher');
                if (dispatcher) {
                    // Extract region like "euwest1" from "dispatcher2euwest1-b80"
                    const match = dispatcher.match(/dispatcher\d+([a-z0-9]+)-/i);
                    if (match) pop = match[1].toUpperCase();
                }
                const vhost = h.get('x-vhost') || 'N/A';
                return {
                    provider: 'Adobe Experience Manager',
                    cache: cache,
                    pop: pop,
                    extra: `Vhost: ${vhost}`,
                };
            }
        },
        'QRATOR': {
            getInfo: (h, rule) => {
                // Check for x-nextjs-cache first, then fallback to generic cache status
                let cache = h.get('x-nextjs-cache') || getCacheStatus(h);
                if (cache) cache = cache.toUpperCase();

                const instance = h.get('x-app-instance-ing') || 'N/A';

                return {
                    provider: 'QRATOR',
                    cache: cache,
                    pop: 'N/A',
                    extra: `Instance: ${instance}`,
                };
            }
        },
        'Huawei Cloud CDN': {
            getInfo: (h, rule) => {
                let cache = 'N/A';
                const xHCache = h.get('x-h-cache-status');
                const xCacheStatus = h.get('x-cache-status');

                if (xHCache) {
                    cache = xHCache.toUpperCase();
                } else if (xCacheStatus) {
                    cache = xCacheStatus.toUpperCase();
                } else if (h.get('nginx-hit') === '1') {
                    cache = 'HIT';
                } else {
                    cache = getCacheStatus(h);
                }

                let pop = 'N/A';
                const via = h.get('via');
                if (via) {
                    const match = via.match(/(?:HCDN|CHN)-([a-zA-Z0-9]+)/);
                    if (match) {
                        const loc = match[1];
                        const compound = loc.match(/^([A-Z]{2})([a-z]+)/);
                        if (compound) {
                            pop = (compound[1] + '-' + compound[2]).toUpperCase();
                        } else {
                            pop = loc.toUpperCase();
                        }
                    }
                }

                // Extract x-ccdn-req-id (format: x-ccdn-req-id-46b1)
                let requestId = 'N/A';
                for (const [key, value] of h.entries()) {
                    if (key.startsWith('x-ccdn-req-id')) {
                        requestId = value;
                        break;
                    }
                }
                if (requestId === 'N/A') {
                    requestId = h.get('x-obs-request-id') || h.get('x-hw-request-id') || 'N/A';
                }

                return {
                    provider: 'Huawei Cloud CDN',
                    cache: cache,
                    pop: pop,
                    extra: `Req-ID: ${requestId}`,
                };
            }
        },
        'Baidu Cloud CDN': {
            getInfo: (h, rule) => {
                let cache = 'N/A';
                const ohcCacheHit = h.get('ohc-cache-hit');
                const xCacheStatus = h.get('x-cache-status');

                if (ohcCacheHit) {
                    cache = 'HIT';
                } else if (xCacheStatus) {
                    cache = xCacheStatus.toUpperCase();
                } else {
                    cache = getCacheStatus(h);
                }

                let pop = 'N/A';
                if (ohcCacheHit) {
                    const popMatch = ohcCacheHit.match(/([a-z]+\d+)/i);
                    if (popMatch && popMatch[1]) {
                        pop = popMatch[1].toUpperCase();
                    }
                }

                const requestId = h.get('x-bce-request-id') || h.get('x-life-unique-id') || 'N/A';

                return {
                    provider: 'Baidu Cloud CDN',
                    cache: cache,
                    pop: pop,
                    extra: `Req-ID: ${requestId}`,
                };
            }
        },
        'KnowSec JiaSuLe': {
            getInfo: (h, rule) => {
                let cache = 'N/A';
                const bkdCache = h.get('x-bkd-cache');
                if (bkdCache) {
                    cache = bkdCache.toUpperCase();
                } else {
                    cache = getCacheStatus(h);
                }


                // x-via-jsl contains node hash (e.g., "8b19e79,-"), not geographic location
                // So we don't extract POP from it
                const viaJsl = h.get('x-via-jsl');

                return {
                    provider: 'KnowSec JiaSuLe',
                    cache: cache,
                    pop: 'N/A',
                    extra: viaJsl ? `Via-JSL: ${viaJsl}` : 'N/A',
                };
            }
        },

        'ByteDance CDN': {
            getInfo: (h, rule) => {
                let cache = 'N/A';

                // Priority 1: x-bdcdn-cache-status
                const bdcdnCache = h.get('x-bdcdn-cache-status');
                if (bdcdnCache) {
                    cache = bdcdnCache.replace('TCP_', '').toUpperCase();
                } else {
                    // Priority 2: x-response-cache
                    const responseCache = h.get('x-response-cache');
                    if (responseCache) {
                        cache = responseCache.replace('edge_', '').toUpperCase();
                    } else {
                        // Priority 3: server-timing
                        const serverTiming = h.get('server-timing');
                        if (serverTiming) {
                            const match = serverTiming.match(/cdn-cache;desc=([^,]+)/);
                            if (match) cache = match[1].toUpperCase();
                        }
                    }
                }

                // Fallback to x-tt-trace-tag or generic
                if (cache === 'N/A') {
                    const ttTrace = h.get('x-tt-trace-tag');
                    if (ttTrace) {
                        const match = ttTrace.match(/cdn-cache=([^;]+)/);
                        if (match) cache = match[1].toUpperCase();
                    }
                }
                if (cache === 'N/A') cache = getCacheStatus(h);

                let pop = 'N/A';
                const viaHeader = h.get('via');
                if (viaHeader) {
                    // Try to extract from "cache17.jswuxi-ct32" -> "JSWUXI"
                    let match = viaHeader.match(/cache\d+\.([a-z]+)/i);
                    if (match && match[1]) {
                        pop = match[1].toUpperCase();
                    } else {
                        // Fallback: Extract from "live4.cn7594[899,0]" or "ens-live7.cn8685" -> "CN"
                        match = viaHeader.match(/(?:ens-)?live\d+\.(cn\d+)/i);
                        if (match && match[1]) {
                            pop = 'CN';
                        }
                    }
                }

                const traceId = h.get('x-tt-trace-id') || h.get('x-tt-logid') || h.get('x-tos-request-id') || 'N/A';

                return {
                    provider: 'ByteDance CDN',
                    cache: cache,
                    pop: pop,
                    extra: `Trace-ID: ${traceId}`,
                };
            }
        },
        'Netlify': {
            getInfo: (h, rule) => {
                let pop = 'N/A';
                const serverTiming = h.get('server-timing');
                if (serverTiming) {
                    const match = serverTiming.match(/dc;desc="?([^",]+)"?/);
                    if (match && match[1]) {
                        pop = match[1].toUpperCase();
                    }
                }
                return {
                    provider: 'Netlify',
                    cache: getCacheStatus(h),
                    pop: pop,
                    extra: `Req-ID: ${h.get('x-nf-request-id') || 'N/A'}`,
                };
            }
        },
        'BunnyCDN': {
            getInfo: (h, rule) => {
                let cache = 'N/A';
                const cdnCache = h.get('cdn-cache');
                if (cdnCache) {
                    cache = cdnCache.toUpperCase();
                } else {
                    cache = getCacheStatus(h);
                }

                let pop = 'N/A';
                const server = h.get('server');
                if (server) {
                    // Extract POP from server header like "BunnyCDN-LA1-912" -> "LA1"
                    const match = server.match(/BunnyCDN-([A-Z0-9]+)-/i);
                    if (match && match[1]) {
                        pop = match[1].toUpperCase();
                    }
                }

                const requestId = h.get('cdn-requestid') || 'N/A';

                return {
                    provider: 'BunnyCDN',
                    cache: cache,
                    pop: pop,
                    extra: `Req-ID: ${requestId}`,
                };
            }
        },
        'Medianova': {
            getInfo: (h, rule) => {
                let cache = 'N/A';
                const cacheStatus = h.get('x-cache-status');
                if (cacheStatus) {
                    // Parse format like "Edge : HIT," or "Edge : MISS,"
                    const match = cacheStatus.match(/Edge\s*:\s*([A-Z]+)/i);
                    if (match && match[1]) {
                        cache = match[1].toUpperCase();
                    }
                } else {
                    cache = getCacheStatus(h);
                }

                let pop = 'N/A';
                const edgeLocation = h.get('x-edge-location');
                if (edgeLocation) {
                    // Extract POP from format like "SG-378" -> "SG"
                    const match = edgeLocation.match(/^([A-Z]{2,3})-/i);
                    if (match && match[1]) {
                        pop = match[1].toUpperCase();
                    }
                }

                const requestId = h.get('x-mnrequest-id') || 'N/A';

                return {
                    provider: 'Medianova',
                    cache: cache,
                    pop: pop,
                    extra: `Req-ID: ${requestId}`,
                };
            }
        },
        'CacheFly': {
            getInfo: (h, rule) => {
                let cache = 'N/A';
                // x-cf3: H = HIT, M = MISS
                const cf3 = h.get('x-cf3');
                if (cf3) {
                    if (cf3.toUpperCase() === 'H') {
                        cache = 'HIT';
                    } else if (cf3.toUpperCase() === 'M') {
                        cache = 'MISS';
                    }
                } else {
                    cache = getCacheStatus(h);
                }

                let pop = 'N/A';
                const cf1 = h.get('x-cf1');
                if (cf1) {
                    // Extract POP from format like "28787:fP.tko2:co:1765918716:cacheN.tko2-01:M"
                    // Looking for pattern like "tko2" or "cache location"
                    const match = cf1.match(/\.([a-z]{3,4}\d*)[:\-\.]/i);
                    if (match && match[1]) {
                        pop = match[1].toUpperCase();
                    }
                }

                const requestId = h.get('x-cf-reqid') || 'N/A';
                const age = h.get('cf4age') || 'N/A';

                return {
                    provider: 'CacheFly',
                    cache: cache,
                    pop: pop,
                    extra: `Req-ID: ${requestId}, Age: ${age}s`,
                };
            }
        },
        'SwiftServe CDN': {
            getInfo: (h, rule) => {
                let cache = 'N/A';
                let pop = 'N/A';

                // Parse x-cache header: "HIT from da010.vn17.swiftserve.com:443"
                const xCache = h.get('x-cache');
                if (xCache) {
                    // Extract cache status
                    if (xCache.toUpperCase().includes('HIT')) {
                        cache = 'HIT';
                    } else if (xCache.toUpperCase().includes('MISS')) {
                        cache = 'MISS';
                    }

                    // Extract POP from domain: da010.vn17.swiftserve.com -> VN17
                    const match = xCache.match(/from\s+([a-z0-9]+)\.([a-z0-9]+)\.swiftserve\.com/i);
                    if (match && match[2]) {
                        pop = match[2].toUpperCase();
                    }
                }

                // Fallback to generic cache status if not found
                if (cache === 'N/A') {
                    cache = getCacheStatus(h);
                }

                return {
                    provider: 'SwiftServe CDN',
                    cache: cache,
                    pop: pop,
                    extra: 'Detected via x-cache header',
                };
            }
        },
        'SiteGround': {
            getInfo: (h, rule) => {
                let cache = 'N/A';

                // Extract cache status from x-proxy-cache header
                const proxyCache = h.get('x-proxy-cache');
                if (proxyCache) {
                    cache = proxyCache.toUpperCase();
                } else {
                    cache = getCacheStatus(h);
                }

                let pop = 'N/A';
                // Extract POP from x-ce header: "asia-northeast1-zp5x" -> "ASIA-NORTHEAST1"
                const xCe = h.get('x-ce');
                if (xCe) {
                    // Remove the trailing hash part (e.g., "-zp5x")
                    const match = xCe.match(/^([a-z]+-[a-z]+\d+)/i);
                    if (match && match[1]) {
                        pop = match[1].toUpperCase();
                    }
                }

                const requestId = h.get('x-proxy-cache-info') || 'N/A';

                return {
                    provider: 'SiteGround',
                    cache: cache,
                    pop: pop,
                    extra: `Cache-Info: ${requestId}`,
                };
            }
        },
        'StackPath': {
            getInfo: (h, rule) => {
                let cache = 'N/A';

                // Priority 1: x-cdn-cache-status (StackCDN)
                const cdnCache = h.get('x-cdn-cache-status');
                if (cdnCache) {
                    cache = cdnCache.toUpperCase();
                } else {
                    // Priority 2: x-scp-cache-status (newer StackPath)
                    const scpCache = h.get('x-scp-cache-status');
                    if (scpCache) {
                        cache = scpCache.toUpperCase();
                    } else {
                        // Priority 3: x-proxy-cache (older configs)
                        const proxyCache = h.get('x-proxy-cache');
                        if (proxyCache) {
                            cache = proxyCache.toUpperCase();
                        } else {
                            cache = getCacheStatus(h);
                        }
                    }
                }

                let pop = 'N/A';

                // Priority 1: x-via (StackCDN) - e.g., "NRT1"
                const xVia = h.get('x-via');
                if (xVia) {
                    pop = xVia.toUpperCase();
                } else {
                    // Priority 2: x-scp-served-by (newer StackPath)
                    const servedBy = h.get('x-scp-served-by');
                    if (servedBy) {
                        const match = servedBy.match(/([A-Z]{3,4})/i);
                        if (match && match[1]) {
                            pop = match[1].toUpperCase();
                        }
                    }
                }

                // Extra info: show origin cache status if available
                const originCache = h.get('x-origin-cache-status');
                const cacheInfo = h.get('x-proxy-cache-info');

                let extra = 'Detected via StackCDN/StackPath headers';
                if (originCache) {
                    extra = `Origin: ${originCache}`;
                } else if (cacheInfo && cacheInfo !== 'N/A') {
                    extra = `Cache-Info: ${cacheInfo}`;
                }

                return {
                    provider: 'StackPath',
                    cache: cache,
                    pop: pop,
                    extra: extra,
                };
            }
        }
    };

    function loadRules() {
        try {
            const rulesText = GM_getResourceText('cdn_rules');
            if (rulesText) {
                cdnRules = JSON.parse(rulesText);
                console.log('[CDN Info] Loaded rules from resource');
            } else {
                console.warn('[CDN Info] No cdn_rules resource found');
            }
        } catch (e) {
            console.error('[CDN Info] Failed to load rules:', e);
        }
    }

    // Generic Info Extractor
    function genericGetInfo(h, rule, providerName) {
        let pop = 'N/A';
        if (rule.pop_header) {
            const val = h.get(rule.pop_header);
            if (val) {
                if (rule.pop_regex) {
                    const match = val.match(new RegExp(rule.pop_regex, 'i'));
                    if (match && match[1]) pop = match[1].toUpperCase();
                } else {
                    // Default heuristic - extract airport code from value
                    // First try to match letters at the start
                    const letterMatch = val.trim().match(/^([A-Z]+)/i);
                    if (letterMatch && letterMatch[1].length >= 3) {
                        // If we have 3+ letters at start, use first 3-4
                        pop = letterMatch[1].substring(0, Math.min(4, letterMatch[1].length)).toUpperCase();
                    } else {
                        // For hyphenated formats like "AS-JP-HND-HYBRID", find the 3-4 letter part
                        const parts = val.trim().split(/[-_]/);
                        for (const part of parts) {
                            const partMatch = part.match(/^([A-Z]+)$/i);
                            if (partMatch && partMatch[1].length >= 3 && partMatch[1].length <= 4) {
                                pop = partMatch[1].toUpperCase();
                                break;
                            }
                        }
                        // If still not found, use first part
                        if (pop === 'N/A' && parts.length > 0) {
                            pop = parts[0].toUpperCase();
                        }
                    }
                }
            }
        }

        let extra = 'N/A';
        if (rule.id_header) {
            extra = `${rule.id_header}: ${h.get(rule.id_header) || 'N/A'}`;
        }

        return {
            provider: providerName,
            cache: getCacheStatus(h),
            pop: pop,
            extra: extra
        };
    }

    // --- Extended Information Functions ---
    function getServerInfo(h) {
        const server = h.get('server');
        if (!server) return 'N/A';

        // Clean up server string: handle cases like "AkamaiGHost; opt=..." or "nginx/1.2.3"
        return server.split(';')[0].trim();
    }

    function getConnectionInfo(response) {
        // Get TLS version from response if available
        // Note: This is not directly available in fetch API, but we can infer from other headers
        const protocol = response.url.startsWith('https') ? 'HTTPS' : 'HTTP';
        return protocol;
    }

    function getAdditionalInfo(h) {
        // Get content type
        const contentType = h.get('content-type');
        if (!contentType) return '';

        // Extract just the MIME type
        const mimeType = contentType.split(';')[0].trim();
        return `Type: ${mimeType}`;
    }

    // Enhanced parseInfo function with Scoring System
    function parseInfo(response) {
        if (Object.keys(cdnRules).length === 0) loadRules();

        const h = response.headers;
        const lowerCaseHeaders = new Map();
        for (const [key, value] of h.entries()) {
            lowerCaseHeaders.set(key.toLowerCase(), value);
        }

        const candidates = [];

        for (const [name, rule] of Object.entries(cdnRules)) {
            let score = 0;
            // 1. Header Checks
            // - Exact Key Match: +20
            // - Regex Value Match: +30
            if (rule.headers) {
                for (const [header, val] of Object.entries(rule.headers)) {
                    if (lowerCaseHeaders.has(header)) {
                        if (val === null) {
                            score += 20;
                        } else {
                            if (new RegExp(val, 'i').test(lowerCaseHeaders.get(header))) {
                                score += 30;
                            }
                        }
                    }
                }
            }

            // 2. ID Header Check (Strong Signal) -> +50
            if (rule.id_header && lowerCaseHeaders.has(rule.id_header)) {
                score += 50;
            }

            // 3. Server Header Check -> +10 (or +50 for unique signatures)
            if (rule.server) {
                const server = lowerCaseHeaders.get('server');
                if (server && new RegExp(rule.server, 'i').test(server)) {
                    // Unique server signatures get higher weight (+50)
                    // These are exclusive to specific CDNs and should almost guarantee a win against generic headers
                    const uniqueServers = [
                        'TLB', 'Byte-nginx', 'AkamaiGHost', 'cloudflare',
                        'Lego Server', 'edgeone', 'CloudWAF', 'SLT-MID', // Tencent
                        'ESA', // Alibaba
                        'yunjiasu', 'JSP3', // Baidu
                        'EdgeNext', 'ChinaCache',
                        'MNCDN',
                        'CFS', // CacheFly
                        'ECS', 'ECAcc', // Edgio
                        'PWS', 'ChinaNetCenter', // Wangsu
                        'BunnyCDN',
                        'keycdn',
                        'stackpath',
                        'HuaweiCloud',
                        'CDN77',
                        'Netlify',
                        'HiNetCDN',
                        'QRATOR'
                    ];
                    const isUnique = uniqueServers.some(sig => new RegExp(sig, 'i').test(rule.server));
                    score += isUnique ? 50 : 10;
                }
            }

            // 4. Via Header Check -> +10
            if (rule.via) {
                const via = lowerCaseHeaders.get('via');
                if (via && new RegExp(rule.via, 'i').test(via)) {
                    score += 10;
                }
            }

            // 5. Cookie Check -> +20
            if (rule.cookies) {
                const cookie = lowerCaseHeaders.get('set-cookie') || '';
                for (const [cName, cVal] of Object.entries(rule.cookies)) {
                    if (cookie.includes(cName)) {
                        if (cVal === null || cookie.includes(cVal)) {
                            score += 20;
                        }
                    }
                }
            }

            // 6. Custom Logic Match -> +20
            if (rule.custom_check_logic === 'check_aws_compat') {
                if (lowerCaseHeaders.has('x-amz-cf-id')) {
                    const via = lowerCaseHeaders.get('via') || '';
                    if (!via.includes('cloudfront.net')) {
                        score += 20;
                    }
                }
            }

            if (score > 0) {
                // Add base priority from rules
                score += (rule.priority || 0);

                const handler = customHandlers[name] ? customHandlers[name].getInfo : genericGetInfo;
                candidates.push({
                    ...handler(lowerCaseHeaders, rule, name),
                    score: score,
                });
            }
        }

        if (candidates.length > 0) {
            // Sort by score descending
            candidates.sort((a, b) => b.score - a.score);
            const winner = candidates[0];

            // Console log for debugging the scoring decision
            if (candidates.length > 1) {
                console.log(`[CDN Scoring] Winner: ${winner.provider} (${winner.score}) vs Runner-up: ${candidates[1].provider} (${candidates[1].score})`);
            }

            // Add extended information
            winner.server = getServerInfo(lowerCaseHeaders);
            if (winner.server === 'N/A' && winner.provider) {
                winner.server = winner.provider; // Intelligent fallback check
            }
            winner.connection = getConnectionInfo(response);
            winner.additional = getAdditionalInfo(lowerCaseHeaders);

            return winner;
        }

        // Fallback: No CDN detected, check if server header exists
        const server = lowerCaseHeaders.get('server');
        const result = {
            provider: server || 'Unknown',
            cache: getCacheStatus(lowerCaseHeaders),
            pop: 'N/A',
            extra: server ? 'No CDN detected' : 'No server header found',
            server: getServerInfo(lowerCaseHeaders),
            connection: getConnectionInfo(response),
            additional: getAdditionalInfo(lowerCaseHeaders),
        };
        return result;
    }

    // --- Icons & Assets ---
    const cdnIcons = {
        'CDNetworks': `<svg viewBox="0 0 41.6 42.65"><path fill="currentColor" fill-opacity="0.95" d="M32.28,17.54c-.04,1.27-.26,2.53-.65,3.74-.74,2.28-1.92,4.39-3.47,6.21-.19.23-.39.46-.59.66-3.22,3.49-7.22,5.4-10.62,5.3-1.53,0-3.01-.53-4.2-1.5-1.63-1.49-2.51-3.63-2.4-5.83,3.66-.82,6.93-2.87,9.26-5.81,1.58-1.86,2.78-4.01,3.53-6.33.15-.72.85-1.19,1.57-1.04.21.04.41.13.57.27.44.26,1.91,1.17,3.6,2.22.3-1.47.36-2.98.17-4.47.3.17.58.36.84.58,1.67,1.53,2.55,3.74,2.39,6"/><path fill="currentColor" fill-opacity="0.7" d="M14.48,16.01c4.4-5.24,10.67-7.34,14.57-5.05.19,1.49.13,3-.17,4.47-1.69-1.05-3.16-2-3.6-2.22-.57-.46-1.41-.37-1.87.2-.13.17-.23.36-.27.57-.75,2.32-1.95,4.47-3.53,6.33-2.33,2.94-5.6,4.99-9.26,5.81.19-3.74,1.64-7.31,4.13-10.11"/><path fill="currentColor" fill-opacity="0.6" d="M.04,24.46H.04c-.12,5.42,2.2,10.61,6.31,14.15,7.66,6.43,19.6,5,27.69-2.93.54-.48.59-1.31.11-1.85-.09-.1-.2-.19-.32-.26-.28-.24-1.46-1.3-2.76-2.43s-3-2.63-3.42-2.95h-.05c-.8-.7-2.01-.64-2.75.12-2.25,2.23-4.93,3.99-7.87,5.18-4.81,1.88-9.66,1.64-13-1.17C.99,29.84-.21,25.76.29,21.33c0-.09,0-.19,0-.28v-.05l.12-.76c-.27,1.39-.41,2.8-.41,4.22h.04Z"/><path fill="currentColor" fill-opacity="0.8" d="M23.78,0c-2.98.04-5.92.68-8.64,1.9h-.08c-.26.12-.51.23-.76.36s-.63.31-.94.48c-.31.17-.46.25-.7.38l-.37.23c-.24.14-.49.3-.74.47-.46.3-.92.61-1.36,1-.24.17-.46.36-.69.54-.47.38-.93.79-1.39,1.22-.18.16-.36.34-.53.51-.13.12-.25.25-.36.38C12.91,1.77,20.85.3,25.62,4.3c1.97,1.7,3.2,4.1,3.43,6.69.19,1.49.13,3-.17,4.47-.11.66-.26,1.31-.46,1.94-.24.94.17,1.92,1,2.41l2.18,1.5c1.22.84,2.73,1.84,4,2.72s2.44,1.63,2.79,1.85c1.17.71,1.85,0,2-.47,2.64-7.93.96-16.34-5.04-21.38C32.16,1.42,28.16,0,24.04.03l-.26-.03Z"/></svg>`,
        'Kingsoft Cloud CDN': `<svg viewBox="0 0 1545 1542"><path fill="currentColor" fill-rule="evenodd" d="M1083.4,683.3c-6.27-.67-12.67-1-19.2-1-39,0-74.4,14.3-102,38,13.3-27.6,20.7-58.7,20.7-91.2-.33-13.13-1.67-25.93-4-38.4-18.2-97.6-103.9-171.5-206.9-171.5s-188.7,73.9-206.9,171.5c-2,12.3-3.5,25.1-3.5,38.4,0,32.5,7.4,63.6,20.7,91.2-27.6-23.7-63.5-38-102.5-38-6.53,0-12.77.33-18.7,1-78.3,9.4-138.9,75.9-138.9,156.2,0,87.2,70.4,157.6,157.6,157.6,56.2,0,105.5-29.5,133.6-73.9,3.27-5.27,6.2-10.83,8.8-16.7,9.9-20.2,15.3-42.9,15.3-67,0-16.8-3-33-7.9-48.3,16.8,6.4,31.1,17.2,41.4,31l3.9,5.9c12.4-17.7,29.1-32,48.3-41.3,16.8-7.9,35-12.4,54.7-12.4,40.4,0,75.9,19.3,99,48.8l6.9,9.9c28.1,39.9,77.9,110.8,78.4,111.8,21.2,29.1,55.2,49.3,94.1,51.7l7.9.5h0c87.2,0,157.6-70.4,157.6-157.6,0-80.3-60.1-146.8-138.4-156.2Z"/><path fill="currentColor" fill-rule="evenodd" d="M772.2.5C345.4.5.4,344.9.4,771s345,770.5,771.8,770.5h0c426.9,0,771.9-344.4,771.9-770.5S1199.1.5,772.2.5ZM1074.5,1102.6l-10.3.4c-73.4,0-139.5-34.9-181.3-88.6l-116.8-166.5c-11.8-14.3-29.1-23.2-48.8-23.2-13.8,0-26.1,4.4-36.4,11.3l184.7,264.1c17.3,24.1,45.3,39.4,76.9,39.4,13.8,0,27.1-3,39.4-8.4-21.7,25.2-52.2,42.9-86.7,48.8-7.93,1.33-16.17,2-24.7,2-48.7,0-92.1-24.2-119.2-61.1l-74.4-106.4c-48.3,54.2-118.7,88.6-197.1,88.6-145.3,0-263.6-117.7-263.6-263.5s107.4-252.3,243.9-262.1c24.7-150.3,155.2-264.6,311.9-264.6s287.2,114.3,311.9,264.6h0c136.5,9.8,244.4,123.6,244.4,262.1s-112.9,257.6-253.8,263.1Z"/></svg>`,
        'State Cloud CDN': `<svg viewBox="0 0 44.54 27"><path fill="currentColor" fill-rule="evenodd" d="M28.78,3.64c3.49-.7,7.01,1.15,8.33,4.4h0c4.27,1.06,7.43,4.84,7.43,9.34,0,5.32-4.41,9.63-9.86,9.63-4.11,0-7.62-2.46-9.1-5.94-.45-1.06-.72-2.22-.74-3.43h-2.49c-.17,0-.26-.21-.14-.32l5.07-4.95c.09-.09.25-.09.34,0l5.07,4.96c.12.12.04.32-.14.32h-2.63c.09.61.28,1.21.6,1.78,1.44,2.55,4.75,3.45,7.34,1.96,2.26-1.3,3.21-4.12,2.18-6.48-1.08-2.47-3.81-3.63-6.28-2.97.51-1.61-.17-3.4-1.74-4.26-1.56-.86-3.49-.49-4.62.78h0s0,0,0,0c-1.26-2.93-4.38-4.83-7.78-4.43-3.66.42-6.39,3.37-6.59,6.84-1.83-.96-4.13-.99-6.08.24-2.17,1.37-3.2,4.03-2.48,6.46.78,2.65,3.2,4.24,5.74,4.24h13.28c.1,0,.19.06.23.16.62,1.42,1.52,2.69,2.63,3.76.1.09.03.26-.1.26H10.23s0,0,0,0h0C4.57,25.95,0,21.47,0,15.96,0,10.45,4.58,5.98,10.22,5.98h.02C12.14,2.43,15.96,0,20.35,0c3.34,0,6.35,1.41,8.44,3.64Z"/></svg>`,
        'Adobe Experience Manager': `<svg viewBox="0 0 24 21.24"><path fill="currentColor" d="M14.24,21.24l-1.74-4.85h-4.38l3.68-9.26,5.58,14.11h6.63L15.15,0h-6.25L0,21.24h14.24Z"/></svg>`,
        'Huawei Cloud CDN': `<svg viewBox="0 0 36.45 27.36"><path fill="currentColor" fill-rule="evenodd" d="M4.47,14.49c2.78,2.7,9.51,6.11,11.07,6.88.02,0,.1.04.15-.03,0,0,.06-.05.03-.13h0C11.44,11.89,5.58,4.82,5.58,4.82c0,0-3.19,3.01-2.96,6.03.12,2.28,1.85,3.63,1.85,3.63Z"/><path fill="currentColor" fill-rule="evenodd" d="M14.65,23.65c-.03-.1-.14-.1-.14-.1h0l-11.21.39c1.22,2.16,3.26,3.84,5.4,3.32,1.47-.37,4.81-2.68,5.9-3.46h0c.09-.08.05-.14.05-.14Z"/><path fill="currentColor" fill-rule="evenodd" d="M4.16,22.26c1.08.44,2.14.47,2.14.47.17.03,6.66,0,8.4,0,.07,0,.12-.07.12-.07.05-.09-.04-.17-.04-.17h0C9.86,19.17.32,14.09.32,14.09c-.87,2.67.3,4.82.3,4.82,1.21,2.56,3.53,3.34,3.53,3.34Z"/><path fill="currentColor" fill-rule="evenodd" d="M33.14,23.94l-11.22-.39h0s-.1,0-.13.09c0,0-.03.1.04.15h0c1.08.76,4.32,3.03,5.89,3.47,0,0,2.9.98,5.41-3.33Z"/><path fill="currentColor" fill-rule="evenodd" d="M20.74,21.16s-.05.11.03.18c0,0,.08.05.15,0h0c1.6-.8,8.28-4.18,11.05-6.86,0,0,1.75-1.4,1.85-3.65.2-3.13-2.96-6.02-2.96-6.02,0,0-5.84,7.04-10.12,16.33h0Z"/><path fill="currentColor" fill-rule="evenodd" d="M19.18,20.32c0,.1.09.13.09.13.11.04.16-.06.16-.06h0c1.08-1.55,5.92-8.7,6.9-13.05,0,0,.54-2.11.02-3.54,0,0-.74-2.73-3.7-3.44,0,0-.85-.22-1.77-.34h0s-3.32,4.25-1.7,20.32h0Z"/><path fill="currentColor" fill-rule="evenodd" d="M17.01,20.4c.07.07.13.04.13.04.12-.04.11-.14.11-.14h0C18.87,4.25,15.56,0,15.56,0c-.48.04-1.8.34-1.8.34-2.97.76-3.67,3.44-3.67,3.44-.54,1.69.02,3.54.02,3.54.99,4.38,5.85,11.57,6.9,13.08Z"/><path fill="currentColor" fill-rule="evenodd" d="M36.13,14.08s-9.52,5.09-14.44,8.4h0s-.09.05-.05.16c0,0,.04.08.12.08h0c1.77,0,8.44,0,8.61-.02,0,0,.86-.04,1.93-.44,0,0,2.38-.75,3.6-3.43,0,0,1.09-2.2.24-4.75Z"/></svg>`,
        'Gcore': `<svg viewBox="0 0 100.15 116"><path fill="currentColor" fill-rule="evenodd" d="M100.15,57.6c0,31.81-25.79,57.6-57.6,57.6-12.35.02-24.38-3.95-34.3-11.32,1.64.92,3.33,1.75,5.07,2.5,6.59,2.84,13.69,4.31,20.87,4.31,27.72-.01,50.76-21.36,52.88-49,.14-1.26.22-2.52.24-3.78,0-1.61-.13-3.47-.3-5.17-.01-.16-.02-.33-.03-.49,0-.19-.01-.38-.03-.56l-.05.05c-.24-2.21-.49-3.91-.49-3.91h-41.8l-3.25,6.08-7.46,14.1h31.58c-1.17,3.49-2.91,6.77-5.17,9.68-6.22,8.15-15.89,12.92-26.14,12.92-3.87,0-7.71-.7-11.34-2.04C9.85,83.81,1.2,71.44,1.19,57.6c0-18.23,14.77-33,33-33.01,6.99-.01,13.81,2.21,19.45,6.34l4.33-8.11,5.16-9.75c-8.61-5.61-18.67-8.59-28.95-8.58-9.02,0-17.88,2.3-25.76,6.68C17.98,4.16,29.78,0,42.55,0c31.81,0,57.6,25.79,57.6,57.6h0Z"/></svg>`,
        'Cloudflare': `<svg viewBox="0 0 256 116" preserveAspectRatio="xMidYMid"><path fill="currentColor" d="m202.357 49.394-5.311-2.124C172.085 103.434 72.786 69.289 66.81 85.997c-.996 11.286 54.227 2.146 93.706 4.059 12.039.583 18.076 9.671 12.964 24.484l10.069.031c11.615-36.209 48.683-17.73 50.232-29.68-2.545-7.857-42.601 0-31.425-35.497Z"/><path fill="currentColor" d="M176.332 108.348c1.593-5.31 1.062-10.622-1.593-13.809-2.656-3.187-6.374-5.31-11.154-5.842L71.17 87.634c-.531 0-1.062-.53-1.593-.53-.531-.532-.531-1.063 0-1.594.531-1.062 1.062-1.594 2.124-1.594l92.946-1.062c11.154-.53 22.839-9.56 27.087-20.182l5.312-13.809c0-.532.531-1.063 0-1.594C191.203 20.182 166.772 0 138.091 0 111.535 0 88.697 16.995 80.73 40.896c-5.311-3.718-11.684-5.843-19.12-5.31-12.747 1.061-22.838 11.683-24.432 24.43-.531 3.187 0 6.374.532 9.56C16.996 70.107 0 87.103 0 108.348c0 2.124 0 3.718.531 5.842 0 1.063 1.062 1.594 1.594 1.594h170.489c1.062 0 2.125-.53 2.125-1.594l1.593-5.842Z"/><path fill="currentColor" d="M205.544 48.863h-2.656c-.531 0-1.062.53-1.593 1.062l-3.718 12.747c-1.593 5.31-1.062 10.623 1.594 13.809 2.655 3.187 6.373 5.31 11.153 5.843l19.652 1.062c.53 0 1.062.53 1.593.53.53.532.53 1.063 0 1.594-.531 1.063-1.062 1.594-2.125 1.594l-20.182 1.062c-11.154.53-22.838 9.56-27.087 20.182l-1.063 4.78c-.531.532 0 1.594 1.063 1.594h70.108c1.062 0 1.593-.531 1.593-1.593 1.062-4.25 2.124-9.03 2.124-13.81 0-27.618-22.838-50.456-50.456-50.456"/></svg>`,
        'Vercel': `<svg viewBox="0 0 256 222" preserveAspectRatio="xMidYMid"><path fill="currentColor" d="m128 0 128 221.705H0z"/></svg>`,
        'CloudFront': `<svg xml:space="preserve" viewBox="0 0 304 182"><path fill="currentColor" d="m86 66 2 9c0 3 1 5 3 8v2l-1 3-7 4-2 1-3-1-4-5-3-6c-8 9-18 14-29 14-9 0-16-3-20-8-5-4-8-11-8-19s3-15 9-20c6-6 14-8 25-8a79 79 0 0 1 22 3v-7c0-8-2-13-5-16-3-4-8-5-16-5l-11 1a80 80 0 0 0-14 5h-2c-1 0-2-1-2-3v-5l1-3c0-1 1-2 3-2l12-5 16-2c12 0 20 3 26 8 5 6 8 14 8 25v32zM46 82l10-2c4-1 7-4 10-7l3-6 1-9v-4a84 84 0 0 0-19-2c-6 0-11 1-15 4-3 2-4 6-4 11s1 8 3 11c3 2 6 4 11 4zm80 10-4-1-2-3-23-78-1-4 2-2h10l4 1 2 4 17 66 15-66 2-4 4-1h8l4 1 2 4 16 67 17-67 2-4 4-1h9c2 0 3 1 3 2v2l-1 2-24 78-2 4-4 1h-9l-4-1-1-4-16-65-15 64-2 4-4 1h-9zm129 3a66 66 0 0 1-27-6l-3-3-1-2v-5c0-2 1-3 2-3h2l3 1a54 54 0 0 0 23 5c6 0 11-2 14-4 4-2 5-5 5-9l-2-7-10-5-15-5c-7-2-13-6-16-10a24 24 0 0 1 5-34l10-5a44 44 0 0 1 20-2 110 110 0 0 1 12 3l4 2 3 2 1 4v4c0 3-1 4-2 4l-4-2c-6-2-12-3-19-3-6 0-11 0-14 2s-4 5-4 9c0 3 1 5 3 7s5 4 11 6l14 4c7 3 12 6 15 10s5 9 5 14l-3 12-7 8c-3 3-7 5-11 6l-14 2z"/><path d="M274 144A220 220 0 0 1 4 124c-4-3-1-6 2-4a300 300 0 0 0 263 16c5-2 10 4 5 8z" fill="currentColor" fill-opacity="0.5"/><path d="M287 128c-4-5-28-3-38-1-4 0-4-3-1-5 19-13 50-9 53-5 4 5-1 36-18 51-3 2-6 1-5-2 5-10 13-33 9-38z" fill="currentColor" fill-opacity="0.5"/></svg>`,
        'Netlify': `<svg viewBox="0 0 256 226" preserveAspectRatio="xMidYMid"><path fill="currentColor" d="M69.181 188.087h-2.417l-12.065-12.065v-2.417l18.444-18.444h12.778l1.704 1.704v12.778zM54.699 51.628v-2.417l12.065-12.065h2.417L87.625 55.59v12.778l-1.704 1.704H73.143z"/><path fill="currentColor" d="M160.906 149.198h-17.552l-1.466-1.466v-41.089c0-7.31-2.873-12.976-11.689-13.174-4.537-.119-9.727 0-15.274.218l-.833.852v53.173l-1.466 1.466H95.074l-1.466-1.466v-70.19l1.466-1.467h39.503c15.354 0 27.795 12.441 27.795 27.795v43.882l-1.466 1.466Z"/><path fill="currentColor" d="M71.677 122.889H1.466L0 121.423V103.83l1.466-1.466h70.211l1.466 1.466v17.593zM254.534 122.889h-70.211l-1.466-1.466V103.83l1.466-1.466h70.211L256 103.83v17.593zM117.876 54.124V1.466L119.342 0h17.593l1.466 1.466v52.658l-1.466 1.466h-17.593zM117.876 223.787v-52.658l1.466-1.466h17.593l1.466 1.466v52.658l-1.466 1.465h-17.593z"/></svg>`,
        'Nginx': `<svg viewBox="0 0 24.52 28"><path fill="currentColor" d="M24.1,6.77c-3.62-2.08-7.24-4.16-10.86-6.25-.31-.19-.64-.37-.97-.53h-.07c-.34.16-.65.35-.97.53C7.62,2.62,4,4.7.39,6.77c-.25.12-.41.39-.39.67v13.16c-.01.28.14.55.4.67,3.85,2.22,7.7,4.43,11.55,6.64.21.12.47.11.66-.04,3.85-2.21,7.7-4.43,11.55-6.64.18-.12.31-.3.36-.51,0-4.39,0-8.78,0-13.16.04-.32-.13-.64-.41-.79ZM19.23,19.52c-.07.68-.58,1.24-1.25,1.37-.94.2-1.92-.1-2.6-.78-2.4-2.85-4.79-5.71-7.18-8.57,0,2.62,0,5.24,0,7.86,0,.52-.26,1-.68,1.29-.65.43-1.51.34-2.06-.21-.28-.29-.44-.68-.43-1.09v-10.86c.03-.78.63-1.42,1.4-1.51,1.01-.15,2.02.25,2.65,1.05,2.34,2.78,4.65,5.57,7,8.33-.02-2.66,0-5.32,0-7.98.07-.77.67-1.37,1.44-1.44.87-.08,1.64.57,1.71,1.44,0,3.69,0,7.39,0,11.08Z"/></svg>`,
        'Akamai': `<svg viewBox="0 0 46.1 50"><path fill="currentColor" d="M25.42,48.9c1.18.36,1.13,1.1-.17,1.1-13.94,0-25.25-11.19-25.25-25S11.31,0,25.25,0c1.29,0,1.58.69.5,1.01C15.26,4.04,7.6,13.64,7.6,25s7.5,20.75,17.82,23.9M12.39,30.86c-.07-.67-.1-1.35-.1-2.04,0-10.96,8.91-19.85,19.9-19.85,10.39,0,13.51,4.63,13.89,4.32.42-.33-3.77-9.5-15.97-9.5-10.99,0-19.9,8.88-19.9,19.85,0,2.54.48,4.95,1.34,7.18.37.93.93.94.84.04ZM20.72,16.55c5.17-2.25,11.67-2.32,18.05-.09,4.29,1.49,6.77,3.62,6.98,3.54.34-.15-2.49-4.62-7.61-6.56-6.19-2.34-12.86-1.12-17.72,2.69-.53.42-.33.7.3.43Z"/></svg>`,
        'Fastly': `<svg viewBox="0 0 1389.3 1580.9"><path fill="currentColor" d="M755,864.2c1.9,6.2,3,12.8,3,19.7,0,36.2-28.6,65.5-63.8,65.5s-63.7-29.3-63.7-65.5,28.5-65.6,63.7-65.6c7.4,0,14.4,1.4,21,3.8l130.5-113.8,25.7,25.7-116.4,130.2Z"/><path fill="currentColor" d="M524.2,0v85.8h.8v1.5h40.4v115.1h.9v.3C244,262.8,0,545.3,0,885.1c0,253,135.3,474.3,337.5,595.7v.9c104.4,62.9,226.8,99.2,357.6,99.2,383.4,0,694.2-310.9,694.2-694.3,0-253.5-135.8-475-338.6-596.2v-1.1c-68.7-41.2-145.3-70.9-226.8-86.3v-115.7h41.2V1.5h-.8V0h-340.1ZM673.9,529.1v38.3h1v1.5h40.5v-39.8c180.3,10.5,324.7,154.8,335.4,335.1h-40.5v40.5h40.5v2c-1.3,22-4.4,43.5-9.5,64.2-2.3,9.3-5,18.4-8,27.3-.7,2.1-1.3,4.1-2,6.1-2.3,6.7-5.1,13.2-7.8,19.6-1.7,4.1-3.3,8.3-5.2,12.3s-4,7.8-6,11.7c-3.2,6.2-6.4,12.5-9.9,18.5-.8,1.3-1.6,2.5-2.4,3.8-59.4,97.3-164,164-284.6,170.8v-38.1h-1v-1.5h-40.5v39.6c-180.2-10.5-324.5-154.6-335.3-334.8h40.4v-40.5h-.5v-3h-40c2-33.5,8.6-65.7,19.2-96,.1-.5.3-.9.4-1.3,2.8-7.9,6.1-15.6,9.4-23.2,1.2-2.8,2.3-5.7,3.6-8.5,2.2-4.8,4.8-9.4,7.3-14.1,2.8-5.4,5.5-10.7,8.5-15.9,1-1.7,2.1-3.3,3.2-5,59.5-96.6,163.6-162.8,283.8-169.6h0Z"/></svg>`,
        'Tencent': `<svg viewBox="0 0 541.04 390"><path fill="currentColor" d="M468.46,318.5c-8.7,8.7-26.1,21.7-56.5,21.7h-187c56.5-54.1,104.4-99.6,108.8-104,8.3-8.4,17-16.3,26.1-23.8,21.8-19.5,39.1-21.7,54.4-21.7,21.7,0,39.1,8.7,54.4,21.6,30.3,28.2,30.3,78.1-.2,106.2ZM505.46,177.6c-23-24.8-55.3-39-89.2-39-30.4,0-56.5,10.9-80.5,28.2-8.8,8.7-21.8,17.3-32.7,30.3-8.7,8.7-195.7,190.7-195.7,190.7,10.9,2.2,23.9,2.2,34.8,2.2h237.1c17.4,0,30.5,0,43.5-2.2,30-2.2,58.3-14.4,80.5-34.7,50-47.6,50-127.7,2.2-175.5h0Z"/><path fill="currentColor" d="M200.96,164.6c-23.9-17.3-47.9-26-76.1-26-33.9,0-66.2,14.2-89.2,39-48.4,49.7-47.4,129.2,2.2,177.7,21.7,19.5,43.5,30.3,69.6,32.5l50-47.7h-28.3c-28.3-2.1-45.7-10.8-56.5-21.6-30-29.6-30.9-77.6-2.2-108.3,15.2-15.2,32.6-21.7,54.4-21.7,13.1,0,32.6,2.1,52.2,21.6,8.7,8.7,32.6,26,41.3,34.7h2.1l32.6-32.5v-2.2c-15.1-15.1-39-34.6-52.1-45.5"/><path fill="currentColor" d="M429.36,110.5C404.66,44.2,341.36.1,270.56,0,185.76,0,118.36,62.8,105.26,140.8c6.5,0,13.1-2.1,21.8-2.1s19.6,2.1,28.3,2.1c10.9-54.2,58.7-93.2,115.3-93.2,47.8,0,89.2,28.2,108.7,69.3,0,0,2.2,2.2,2.2,0,15.1-2.1,32.5-6.4,47.8-6.4h0"/></svg>`,
        'Alibaba': `<svg viewBox="0 0 120.2 75"><rect fill="currentColor" x="40.1" y="32.8" width="40.1" height="9"/><path fill="currentColor" d="M100.2,0h-26.5l6.4,9.1,19.4,5.9c3.6,1.1,5.9,4.5,5.8,8h0v29h0c0,3.6-2.3,6.9-5.8,8l-19.3,5.9-6.5,9.1h26.5c11.1,0,20-9,20-20V20c.1-11-8.9-20-20-20"/><path fill="currentColor" d="M20,0h26.5l-6.4,9.1-19.3,5.9c-3.6,1.1-5.9,4.5-5.8,8h0v29h0c0,3.6,2.3,6.9,5.8,8l19.3,5.9,6.4,9.1h-26.5c-11,0-20-9-20-20V20C0,9,9,0,20,0"/></svg>`,
        'ByteDance': `<svg viewBox="0 0 285 240"><path fill="currentColor" d="M0 11l49.5 14.3v198.2L0 237.8zM78.2 112.3l48.4 12.1v106.8l-48.4 9.9zM160.7 91.4l45.2-12.1v131l-45.2-13.2zM235.6 0l49.5 14.3v222.4l-49.5 12.1z"/></svg>`,
        'Microsoft Azure CDN': `<svg viewBox="0 0 88 82.92"><path fill="currentColor" d="M29.34,0h26.04l-27.03,80.1c-.57,1.68-2.16,2.82-3.94,2.81H4.15C1.86,82.92,0,81.07,0,78.78c0-.46.07-.91.22-1.34L25.4,2.84C25.97,1.15,27.55,0,29.34.01h0Z"/><path fill="currentColor" d="M67.17,53.72H25.88c-1.05,0-1.91.85-1.91,1.91,0,.53.22,1.04.61,1.4l26.53,24.76c.77.72,1.79,1.13,2.85,1.13h23.38l-10.17-29.2Z"/><path fill="currentColor" d="M29.34,0c-1.81,0-3.41,1.16-3.95,2.88L.25,77.38c-.77,2.15.34,4.52,2.5,5.3.45.16.93.25,1.41.24h20.79c1.57-.28,2.87-1.39,3.4-2.9l5.02-14.78,17.91,16.7c.75.62,1.69.96,2.67.97h23.29l-10.22-29.19h-29.78L55.47.01h-26.13Z"/><path fill="currentColor" d="M62.6,2.82C62.03,1.13,60.45,0,58.67,0h-29.02c1.78,0,3.36,1.13,3.93,2.82l25.18,74.62c.73,2.17-.43,4.53-2.6,5.26-.43.14-.88.22-1.33.22h29.02c2.29,0,4.15-1.86,4.15-4.15,0-.45-.07-.9-.22-1.33L62.6,2.82Z"/></svg>`,
        'BytePlus': `<svg viewBox="0 0 23.92 18.78"><path fill="currentColor" d="M14.74 7.79c-.09.08-.23.07-.31-.02-.04-.04-.06-.1-.05-.16V.22c0-.19-.23-.29-.36-.17L5.18 7.55c-.09.08-.23.07-.3-.02-.04-.04-.06-.1-.05-.15V2.25c0-.15-.12-.26-.26-.26H.26c-.15 0-.26.12-.26.26v16.05c0 .19.23.29.36.17l8.83-7.5c.09-.08.23-.07.3.02.04.04.06.1.05.15v7.41c0 .18.23.29.36.17l8.83-7.5c.09-.08.23-.07.3.02.04.04.06.1.05.15v5.13c0 .15.12.26.27.26h4.29c.15 0 .27-.12.27-.26V.46c0-.19-.23-.29-.36-.17l-8.82 7.5z"/></svg>`,
        'Google': `<svg viewBox="0 0 32.7 26.42"><path fill="currentColor" d="M20.8,7.22h1l2.8-2.8.2-1.2C19.4-1.48,11.3-.98,6.7,4.32c-1.3,1.5-2.2,3.2-2.8,5.1.3-.1.7-.2,1-.1l5.7-.9s.3-.5.4-.5c2.5-2.8,6.8-3.1,9.7-.7,0,0,.1,0,.1,0Z"/><path fill="currentColor" d="M28.7,9.42c-.7-2.4-2-4.6-3.9-6.2l-4,4c1.7,1.4,2.7,3.5,2.6,5.6v.7c2,0,3.6,1.6,3.6,3.6s-1.6,3.6-3.6,3.6h-7.1l-.7.7v4.3l.7.7h7.1c5.1,0,9.3-4.1,9.3-9.2,0-3.1-1.5-6-4.1-7.7l.1-.1Z"/><path fill="currentColor" d="M9.2,26.32h7.1v-5.7h-7.1c-.5,0-1-.1-1.5-.3l-1,.3-2.9,2.9-.2,1c1.6,1.2,3.6,1.9,5.6,1.9v-.1Z"/><path fill="currentColor" d="M9.2,7.82C4.1,7.82,0,12.02,0,17.12c0,2.9,1.4,5.5,3.6,7.3l4.1-4.1c-1.8-.8-2.6-2.9-1.8-4.7s2.9-2.6,4.7-1.8c.8.4,1.4,1,1.8,1.8l4.1-4.1c-1.8-2.3-4.5-3.6-7.4-3.6l.1-.1Z"/></svg>`,
        'QUIC': `<svg viewBox="0 0 64 32"><path fill="currentColor" d="M61.3 7.6c-2.5-3.3-6.2-5.5-10.3-6-.7-.1-1.4-.2-2.1-.2-2.6 0-5 .6-7.3 1.8-.4.2-.8.4-1.1.7h-.1l-1.3.9-.4.3.3.4 3.3 4.3.3.4.4-.3 1-.7c.2-.1.4-.2.6-.3 1.3-.7 2.8-1.1 4.3-1.1.4 0 .8 0 1.2.1 2.5.3 4.6 1.6 6.1 3.6 1.5 2 2.1 4.4 1.8 6.8-.6 4.6-4.6 8-9.2 8-.4 0-.8 0-1.2-.1-1.9-.3-3.7-1.1-5.1-2.4-.2-.2-.3-.3-.5-.5L29.8 7.3l-.8-1v.1l-.5-.7-.2-.2c-.3-.4-.6-.7-1-1-2.5-2.3-5.6-3.8-9-4.2-.7-.1-1.5-.2-2.2-.2C8.2 0 1.2 6.1.2 14.1c-.6 4.3.6 8.6 3.2 12 2.6 3.5 6.5 5.7 10.8 6.3.7.1 1.5.2 2.2.2 2.7 0 5.2-.6 7.6-1.9.1 0 .2-.1.3-.2l.1-.1.5-.3-.4-.5-3.3-4.3-.2-.3-.4.2c-1.3.6-2.8.9-4.2.9-.4 0-.9 0-1.3-.1-5.4-.7-9.2-5.7-8.5-11.1.7-4.9 4.9-8.6 9.8-8.6.4 0 .9 0 1.3.1 2.1.3 3.9 1.2 5.5 2.6.2.2.3.3.5.5l9.6 12.6.8 1v-.1l3.1 4.1.2.2c.3.3.6.7.9 1 2.4 2.2 5.4 3.7 8.6 4.1.7.1 1.4.1 2.1.1 7.8 0 14.4-5.8 15.5-13.5.6-4.1-.5-8.2-3.1-11.5z"/><path fill="currentColor" fill-opacity="0.6" d="M34.7 29.2l-.2-.2-6.2-8.2c-.3-.3-.6-.6-.9-.9-2.3-2.2-5.2-3.6-8.3-4-.3 0-.6-.1-.9-.1h-.5l2.3 3s.1.1.2.2l6.2 8.2c.3.3.6.6.9.9 2.3 2.2 5.2 3.6 8.3 4 .3 0 .6.1.9.1h.5l-2.3-3z"/></svg>`,
        'Bunny': `<svg viewBox="0 0 38 43"><path fill="currentColor" d="M21 6.9l9.9 5.4L21.8 0c-1.5 2-1.8 4.6-.8 6.9M16.5 26.7c1.2 0 2.3 1 2.3 2.2 0 1.2-1 2.3-2.2 2.3-1.2 0-2.3-1-2.3-2.2 0-.6.2-1.2.7-1.6.4-.4 1-.7 1.6-.7M9.7 1.8l27.6 15c.5.2.8.7.8 1.2s-.3 1-.8 1.2c-2.1 1.3-4.4 2.2-6.8 2.6l-5.8 11.8s-1.8 4.1-6.8 2.6c2.1-2.1 4.6-4 4.6-7.2s-2.7-6.1-6.1-6.1-6.1 2.7-6.1 6.1c0 4.2 4.2 6 6.5 8.9 1 1.5.9 3.5-.3 4.8-2.9-2.8-8.4-7.6-10.7-10.8-1.3-1.6-1.9-3.5-2-5.6.2-4.4 3.2-8.2 7.4-9.5 1.3-.4 2.6-.5 3.9-.5 1.8.1 3.6.7 5.2 1.6 2.5 1.4 3.6 1.1 5.3-.4 1-.8 2.1-3.5.4-4.1-.6-.2-1.1-.3-1.7-.4-3.1-.6-8.6-1.2-10.7-2.3-3.2-1.8-5.4-5.4-4.1-9M22.6 29c1.3-6.7-5.6-13.2-10.8-12.2l.4-.1c-.3.1-.6.1-.8.2-4.2 1.3-7.2 5.1-7.4 9.5 0 2 .7 4 2 5.6 2.3 3.1 7.8 7.9 10.7 10.8 1.2-1.3 1.4-3.3.3-4.8-2.4-2.9-6.5-4.7-6.5-8.9 0-3.4 2.7-6.1 6.1-6.1s6.1 2.7 6.1 6.1M9.7 1.8l21 11.4.6.3c.5.4 1 1.2.4 2.6-1 2.2-5 4.2-9.6 2.6 1.4.4 2.4-.1 3.7-1.1 1-.8 2.1-3.5.4-4.1-.6-.2-1.1-.3-1.7-.4-3.1-.6-8.6-1.2-10.7-2.3-3.2-1.8-5.3-5.4-4.1-9M9.7 1.8c2.2 8 15.4 8.7 22 12L9.7 1.8zM16.9 37.9c-2.3-2.9-6.5-4.7-6.5-8.9 0-3.1 2.3-5.6 5.3-6-4.8 0-8.7 3.9-8.8 8.8 0 .6.1 1.2.2 1.8 1.9 2.2 4.7 4.7 7 6.9.9.9 1.8 1.7 2.4 2.3.6-.7.9-1.5 1-2.4.1-.9-.2-1.7-.7-2.4M22.5 29.7v-.7c1.3-6.7-5.6-13.2-10.8-12.2 1.1-.3 2.3-.4 3.4-.3 6.9.3 8.8 7.6 7.3 13.2M2.3 14.8c1.3 0 2.3 1 2.3 2.3v2.3H2.3c-1.3 0-2.3-1-2.3-2.3s1-2.3 2.3-2.3"/></svg>`,
        'KeyCDN': `<svg viewBox="0 0 41.4 39.8"><path fill="currentColor" d="M4 32.1c.4 0 .8.1 1.2.2l4.8-4.7.2.2c.3.3.5.7.8 1l.1.1.2.2.1.1.1.1.1.1.1.1.1.1.1.1a12.9 12.9 0 0 0 8 3.1 13 13 0 0 0 6.9-1.8l.4.4c.4.5.9.9 1.3 1.4a15.2 15.2 0 0 1-8.6 2.4 15.2 15.2 0 0 1-9.4-3.6l-3.1 3.1a3.9 3.9 0 1 1-3.7-2.8h.1zm29.6-20a15.2 15.2 0 0 1 2.2 8.3 15.2 15.2 0 0 1-3.8 9.7l1.9 2a2.4 2.4 0 0 1 2.1.7 2.4 2.4 0 0 1-.1 3.4 2.4 2.4 0 0 1-3.4-.1 2.4 2.4 0 0 1-.6-2.1l-3.4-3.6-.2-.2.2-.2a12 12 0 0 0 1.6-1.5 12.8 12.8 0 0 0 3.2-8.2 12.8 12.8 0 0 0-1.6-6.6zM6.6 3.1c.7 0 1.3.3 1.8.7.4.6.6 1.3.6 2.1l3.7 3.9-.2.2c-.6.5-1.1 1-1.6 1.5a12.9 12.9 0 0 0-1.7 14.8l-1.8 1.7a15.1 15.1 0 0 1-2.2-8.4c.1-3.6 1.5-7 3.8-9.7l-2-2.1a2.4 2.4 0 0 1-2.1-.7 2.4 2.4 0 0 1 .1-3.4 2.4 2.4 0 0 1 1.4-.6h.2zM37.5 0a3.9 3.9 0 1 1-1.2 7.6l-5.3 5-.2-.2c-.3-.4-.6-.7-.9-1.1l-.1-.1-.2-.2-.3-.3-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1a12.9 12.9 0 0 0-8-3c-2.4-.1-4.8.5-6.9 1.8l-1.7-1.8A15.2 15.2 0 0 1 21 4a15.2 15.2 0 0 1 9.4 3.6l3.5-3.3A3.9 3.9 0 0 1 37.5 0z"/><path fill="currentColor" fill-opacity="0.7" d="M20.6 8.6c.4 0 .9 0 1.3.1 6.3.8 10.7 6.5 9.9 12.7-.8 6.3-6.5 10.7-12.7 9.9-6.3-.8-10.7-6.5-9.9-12.7.7-5.8 5.6-10 11.4-10zm-.2 4.9c-2.5.2-4.4 2.1-4.4 4.7 0 1.8.8 3 2.2 4l.4.2-.9 4.1h5.9l-.9-4.1c1.6-.8 2.5-2.4 2.6-4.2 0-2.6-2.1-4.6-4.7-4.7z"/></svg>`,
        'StackPath': `<svg viewBox="0 0 390.25 150"><path fill="currentColor" d="M59.73,0C34.98,0,3.72,11.52,3.72,41.02c0,20.75,9.8,33.46,54.3,47.46,18.5,6.5,23.24,11,23.24,20.75,0,16.25-20.25,15.28-20.75,15.28-21.75,0-27.49-9.79-27.49-23.54H.26l-.24.78c-.75,33.5,30.25,48.24,60.5,48.24,32,0,54.74-14.52,54.74-41.02,0-22.75-13-37-50-48-22-7.75-27.73-11.48-27.73-19.73s7.48-15.77,21.73-15.77c15,0,22.27,9.03,22.27,19.78h32.76l.24-.78C115.02,23.48,98.48,0,59.73,0ZM140.25,1.12v147.75h34.52v-50.73h21c32.25,0,56.98-17.04,56.98-48.54,0-27-19.73-48.49-56.98-48.49h-55.52ZM295.52,1.12l-51.27,147.75h31.98L328.72,1.12h-33.2ZM357,1.12l-51.27,147.75h32.03L390.25,1.12h-33.25ZM174.77,27.39h21c18.25,0,22.75,13.21,22.75,22.46s-4.5,22.02-22.75,22.02h-21V27.39Z"/></svg>`,
        'Apache': `<svg viewBox="0 0 74 146"><path fill="currentColor" d="M63.1 1.4c-2.3 1.3-6.1 5.1-10.6 10.6l4.2 7.8c2.9-4.2 5.9-7.9 8.9-11.1l.3-.4c-.1.1-.2.3-.3.4-1 1.1-3.9 4.5-8.4 11.2 4.3-.2 10.8-1.1 16.2-2 1.6-8.9-1.6-12.9-1.6-12.9S67.8-1.3 63.1 1.4M44.4 40c1.3-2.4 2.6-4.7 3.8-6.9 1.3-2.3 2.7-4.6 4.1-6.8l.2-.4c1.4-2.1 2.7-4.2 4.1-6.2l-4.2-7.8c-.3.4-.6.8-.9 1.2-1.2 1.5-2.4 3.1-3.7 4.8-1.4 1.9-2.9 4-4.4 6.1-1.4 2-2.8 4.1-4.2 6.2-1.2 1.8-2.4 3.7-3.6 5.6l5.4 10.6c1.2-2.3 2.3-4.6 3.5-6.8M19.7 99.8c-.7 2-1.4 4-2.2 6l-.3.9c-.5 1.4-.9 2.6-1.9 5.4 1.6.7 2.9 2.6 4.1 4.8-.1-2.2-1.1-4.3-2.8-6 7.9.4 14.7-1.6 18.1-7.3.3-.5.6-1 .9-1.6-1.6 2-3.6 2.9-7.3 2.7h-.1c5.5-2.4 8.2-4.8 10.6-8.6.6-.9 1.1-1.9 1.7-3-4.8 4.9-10.3 6.3-16.2 5.2l-4.4.5c-.1.4-.3.7-.4 1.1M21.8 90.1c.9-2.4 1.9-4.9 2.9-7.4 1-2.4 1.9-4.8 3-7.2s2-4.8 3.1-7.2c1.1-2.5 2.2-4.9 3.3-7.3 1.1-2.4 2.2-4.8 3.4-7.2.4-.9.8-1.7 1.2-2.6.7-1.5 1.4-2.9 2.2-4.4l.1-.2-5.4-10.6c-.1.1-.2.3-.3.4-1.3 2.1-2.5 4.2-3.8 6.3-1.3 2.2-2.5 4.4-3.7 6.6-1 1.9-2 3.8-3 5.7-.2.4-.4.8-.6 1.2-1.2 2.4-2.2 4.7-3.2 7-1.1 2.5-2.1 5-2.9 7.3-.6 1.5-1.1 3-1.5 4.4-.4 1.2-.7 2.4-1.1 3.6-.8 2.8-1.5 5.6-2.1 8.5l5.5 10.7c.7-1.9 1.5-3.9 2.2-5.8.2-.6.4-1.1.6-1.7M13.4 87.3c-.7 3.4-1.2 6.8-1.4 10.2v.4c-1.7-2.7-6.3-5.3-6.2-5.3 3.3 4.7 5.7 9.4 6.1 13.9-1.7.4-4.1-.2-6.9-1.2 2.9 2.6 5 3.4 5.9 3.6-2.7.2-5.4 2-8.2 4 4.1-1.6 7.3-2.3 9.7-1.8-3.7 10.5-7.5 22-11.2 34.3 1.2-.3 1.8-1.1 2.2-2.1.7-2.2 5.1-16.8 12-35.9.2-.5.4-1.1.6-1.6l.2-.5c.7-2 1.5-4.1 2.3-6.2.2-.5.4-1 .5-1.4v-.1l-5.5-10.7v.4M41.7 47.6c-.2.3-.3.6-.5 1-.5 1-1 1.9-1.4 3-.5 1.1-1.1 2.2-1.6 3.3-.3.6-.5 1.2-.8 1.7-.8 1.8-1.6 3.6-2.5 5.4-1 2.3-2.1 4.7-3.1 7.2-1 2.4-2 4.8-3.1 7.3-1 2.4-2 4.9-3 7.4-.9 2.3-1.8 4.6-2.7 7-.1.1-.1.2-.1.3-.9 2.4-1.8 4.8-2.8 7.4l-.1.2 4.4-.5c-.1 0-.2 0-.3-.1 5.2-.6 12.2-4.5 16.7-9.4 2.1-2.2 4-4.8 5.7-7.9 1.3-2.3 2.5-4.8 3.7-7.6 1-2.4 2-5.1 2.9-7.9-1.2.6-2.6 1.1-4.1 1.4-.3.1-.5.1-.8.2s-.6.1-.8.1c4.9-1.9 8-5.5 10.2-9.9-1.3.9-3.4 2-5.9 2.6-.3.1-.7.1-1 .2-.1 0-.2 0-.3 0 1.7-.7 3.1-1.5 4.4-2.4.3-.2.5-.4.8-.6.4-.3.7-.7 1.1-1 .2-.2.4-.5.6-.7.5-.6.9-1.2 1.4-1.9.1-.2.3-.4.4-.6.2-.3.3-.6.5-.9.7-1.4 1.2-2.6 1.7-3.6.2-.5.4-1 .6-1.5.1-.2.1-.4.2-.5.2-.5.3-1 .4-1.4.2-.6.3-1.1.3-1.4-.2.1-.4.3-.6.4-1.5.9-4 1.7-6 2l4-.4-4 .4h-.1c-.2 0-.4.1-.6.1l.1-.1-13.7 1.5v.1M57.2 19.9c-1.2 1.9-2.6 4-4 6.4l-.2.4c-1.2 2.1-2.6 4.4-4 6.9-1.2 2.2-2.4 4.5-3.7 7-1.1 2.2-2.3 4.5-3.5 6.9l13.7-1.5c4-1.8 5.8-3.5 7.5-5.9.5-.7.9-1.4 1.4-2.1 1.4-2.2 2.8-4.6 4-7 1.2-2.3 2.3-4.6 3.1-6.7.5-1.3.9-2.5 1.2-3.6.3-1 .5-1.9.6-2.7-5.3.9-11.9 1.8-16.2 2"/><path fill="currentColor" fill-opacity="0.6" d="M50.6 60.1c.1 0 .2 0 .3 0-.1 0-.2 0-.3 0"/></svg>`,
        'LiteSpeed': `<svg viewBox="0 0 364 457"><path fill="currentColor" d="M359.7 221.9l-103.2-103.2c-.4-.4-1-.7-1.6-.7h-.1c-.7 0-1.3.4-1.7.9l-44 55.8c-.7.9-.6 2.2.2 3l47.4 47.4c1.7 1.7 2.6 4 2.6 6.4 0 2.4-1 4.6-2.6 6.3l-13.7 13.7c-.8.8-.9 2-.3 2.9 3.4 5.1 9 13.5 9.5 14.5 1.7 3.4 2.3 12.2-2.8 16l-107.8 82.8c-.6.4-.9 1.1-.9 1.8v83.7c0 1.6 0 2.5 1.3 3.2.3.2.7.2 1 .2.9 0 1.3-.4 2.2-1.3l1.8-1.8c1.6-1.6 212.7-212.5 212.7-212.5 5.2-5.3 5.2-13.9 0-19.1M222.5 1l-.1-.1-.1-.2c-.4-.5-1-.8-1.7-.8h-.1c-.6 0-1.2.2-1.6.7L4 215.7c-2.6 2.5-4 5.9-4 9.6s1.4 7 4 9.5l103.2 103.2c.4.4 1 .7 1.6.7h.1c.7 0 1.3-.4 1.7-.9l44-55.8c.7-.9.6-2.2-.2-3l-47.5-47.4c-1.7-1.7-2.6-3.9-2.6-6.3 0-2.4.9-4.7 2.6-6.3l13.7-13.8c.8-.8.9-2 .3-2.9l-9.4-13.5c-3.8-5.4-2.6-13 2.6-17l107.9-82.8c.6-.4.9-1.1.9-1.8V1.5c0-.5-.2-1-.5-1.4"/><path fill="currentColor" fill-opacity="0.7" d="M241.5 267.4l-119.4-77.6 52.8 75.8c1.1 1.7 1 4.7-.2 6.4l-94.5 119.9c-1.7 2.2-3.1 4.5-1.9 7 .6 1.3 2.2 2.3 3.7 2.4 1.9 0 3.3-.8 5.3-2.3l151.9-116.6c4.7-3.6 4.5-12.1 2.5-15M285.4 57.7c-.7-1.5-2.3-2.5-4-2.5-1.5 0-2.9.6-5 2.3L124.5 174.2c-4.8 3.7-5.9 10.7-2.4 15.7l119.4 77.6c-1.7-2.5-52.3-75.8-52.8-76.5-1.1-1.6-1.1-4.8.2-6.4l94.5-120v-.1c1.5-2 3.1-4.3 1.9-6.8"/></svg>`,
        'OpenResty': `<svg viewBox="0 0 91 93"><path fill="currentColor" d="M4.6 45.4c12.6.3 17 .9 26.3 1.8 5.1 10.4 4.9 8.2 7.1 20.5-8.3-9.5-20.9-19.5-33.8-22.3M6 0c11.1 5.7 38.8 24.2 46.4 27.9 4-1 9.8-3.6 17.8-.5-8.9 1-16.5 10.9-25.4 17.7C36.8 24.8 23.4 13.1 17.6 6.9M.2 26.6c15.4 3.1 20.6 4.9 31.7 8 7.1 14.9 5.1 21.9 3.6 31.3C28.3 48.7 15.2 32.8 0 26.6M6.2.1c8.9 5.2 20.7 21 25.6 34 1.8 5.2 4.5 17.7 3.6 31.8 1.6 8.9 12.9 34.4 38.3 23.4-12.9 0-19.2-4.9-25.9-15.9-.4-.3-6.7-18.5-3.1-28.4C36.3 16.9 12.9 3.1 6 0M69.3 82.6c10.3 0 18.5-7 20.5-18.2.1-.7 1.6 8.3-8.2 19.3-.7.7-6.7 1.6-12.1-1M76.5 43c2.2 1.6 3.6 2.9 4.9 4.4 1.3 1-.9-3.6-1.3-4.2.7-3.4-1.4-8.5-1.7-8.6-1.6-1.6-30 9.4-20.2 35.4-.9-21.9 9.3-26 18.2-27.1M73.8 89.3c3.1-1.3 5.1-3.6 7.8-5.7.1-.1-18.1 2.5-23.4-13.7-1.8-2.9-8.3-26.7 20.1-35.5-1.3-2.9-6.7-6.6-8.1-7.1C61.3 28.4 51.3 33.4 45 44.5c-5 9-2.4 46.6 28.8 44.8M76 37.2c.7 0 1.3.7 1.3 1.6s-.6 1.6-1.3 1.6-1.3-.7-1.3-1.6.6-1.6 1.3-1.6"/></svg>`,
        'EdgeNext': `<svg viewBox="0 0 159.81 128.06"><path fill="currentColor" d="M101.87 110.4c13.2 13.3 34.7 13.3 48 0s13.2-34.7 0-48-34.7-13.2-48 0l-42 41.9c-8 8-20 9.6-29.6 4.8l34.4-34.4 6.3-6.3c3.1-3.1 3.1-8.2 0-11.3-1.9-1.9-4-3.6-6.2-5.1-16.2-10.9-38.3-9.2-52.6 5.1S-3.83 93.5 7.07 109.7c1.5 2.2 3.2 4.3 5.1 6.2s4 3.6 6.2 5.1c15.4 10.4 36.3 9.3 50.6-3.2l20.2-20.1 12.7 12.7ZM23.57 68.1c8-8 20-9.6 29.6-4.8l-34.3 34.5c-4.9-9.6-3.3-21.7 4.7-29.7ZM138.47 99c-7 7-18.3 7-25.3 0l-12.7-12.7 12.7-12.6c7-7 18.3-7 25.3 0s7 18.3 0 25.3Z"/><path fill="currentColor" fill-opacity="0.7" d="M88.27 53.2c7.5-8.4 17.7-14.2 29.3-16.1C116.87 16.5 99.97 0 79.17 0c-17.9 0-32.9 12.3-37.1 28.8 19.1.3 35.9 9.9 46.2 24.4Z"/><path fill="currentColor" fill-opacity="0.5" d="M59.87 68.1c2 2 3.5 4.2 4.8 6.6l-34.4 34.4c-2.4-1.2-4.6-2.8-6.6-4.8s-3.6-4.2-4.8-6.6l34.4-34.4c2.4 1.2 4.6 2.8 6.6 4.8Z"/><path fill="currentColor" fill-opacity="0.6" d="M100.47 86.3l-11.4 11.3 12.8 12.8 11.3-11.4-12.7-12.7Z"/></svg>`,
        'Imperva': `<svg viewBox="0 0 56.5 60.11"><rect fill="currentColor" x="48.35" y="51.29" width="8.14" height="8.82"/><rect fill="currentColor" width="8.14" height="8.82"/><path fill="currentColor" fill-rule="evenodd" d="M46.66,13.23c6.16,0,9.83,4.63,9.83,11.95v21.14h-8.3v-19.26c0-3.48-1.4-5.79-4.28-5.79-2.14,0-4.08,1.45-4.62,4.2v20.85h-8.36v-19.26c0-3.48-1.34-5.79-4.22-5.79-2.14,0-4.15,1.45-4.68,4.2v20.85h-8.3V13.96h8.3v2.68c1.47-2.03,4.22-3.4,7.56-3.4,3.55,0,6.36,1.74,8.03,4.13,1.94-2.32,4.82-4.13,9.03-4.13Z"/><rect fill="currentColor" y="13.79" width="8.14" height="32.54"/></svg>`,
        'Medianova': `<svg viewBox="0 0 157.46 172.69"><path fill="currentColor" fill-rule="evenodd" d="M58.79 56.27l-.22.22L0 22.27V0h25.92l32.87 56.27ZM30.51 108.69l11.85-11.85L0 44.3v-6.66l63.82 37.74 13.42-13.41L40.59 0h7.87l50.24 40.5 12.29-12.3L74.4 0h83.06l-22.5 172.69h-61.95c-48.95.01-73.01-14.41-73.01-53.09v-50.48l30.51 39.57Z"/></svg>`,
        'Angie': `<svg viewBox="0 0 53.2 68.4"><polygon fill="currentColor" points="53.2 30.9 37.5 30.9 37.5 0 30.9 0 30.9 26.2 12.4 7.7 7.7 12.4 26.2 30.9 0 30.9 0 37.5 26.2 37.5 7.7 56.1 12.4 60.8 30.9 42.2 30.9 68.4 37.5 68.4 37.5 37.5 53.2 37.5 53.2 30.9"/></svg>`,
        'QRATOR': `<svg viewBox="0 0 26.37 26.58"><path fill="currentColor" d="M20.99,26.58c-2.98,0-5.39-2.45-5.39-5.43s2.43-5.43,5.39-5.43,5.39,2.45,5.39,5.43-2.41,5.43-5.39,5.43ZM20.99,16.54c-2.51,0-4.58,2.06-4.58,4.61s2.04,4.61,4.58,4.61,4.58-2.06,4.58-4.61-2.06-4.61-4.58-4.61Z"/><path fill="currentColor" d="M12.98,26.18C5.83,26.18,0,20.32,0,13.09S5.81,0,12.98,0s12.98,5.86,12.98,13.09-5.83,13.09-12.98,13.09ZM12.98.84C6.28.84.83,6.33.83,13.09s5.45,12.25,12.15,12.25,12.15-5.49,12.15-12.25S19.69.84,12.98.84Z"/><path fill="currentColor" fill-opacity="0.5" d="M12.86.6C6.39.86.66,6.46.66,13.05s5.77,12.14,12.24,12.4l-.04-24.85Z"/><path fill="currentColor" fill-opacity="0.3" d="M12.86.6c-.4.02-3.3.49-3.3.49l3.3,14.1V.6Z"/></svg>`,
        'CacheFly': `<svg viewBox="0 0 181.57 186"><path fill="currentColor" d="M102.47 25.64l-1.61 16.66 17.58-10.09 18.84 12.2L180.83 0l-98.67 5.8 18.19 16.04 58.6-16.04-56.49 19.84h0ZM66.66 33.93l-20.11-2.34 1.84-15.93 20.11 2.34-1.84 15.93h0ZM85.81 54.84l-20.03-2.69 1.8-18.23 20.07 2.72-1.84 18.19ZM63.82 67.89l-19.99-2.23 1.92-16.04 20.03 2.26-1.96 16ZM67.01 91.38l-14.97-1.81 1.5-13.85 14.97 1.88-1.5 13.78h0ZM25.98 101.81l-15.04-1.57 1.46-11.47 15.01 1.65s-1.42 11.4-1.42 11.4ZM39.68 122.73l-15.01-1.61 1.38-11.47 15.04 1.65-1.42 11.44Z"/><path fill="currentColor" d="M26.25 130.56l-12.59-1.3 1.19-9.13 12.55 1.27-1.15 9.17ZM53.27 99.2l-14.93-1.84 1.53-13.82 14.89 1.88s-1.5 13.78-1.5 13.78ZM116.13 65.28l-17.46-1.92 1.65-13.74 17.5 1.92s-1.69 13.74-1.69 13.74ZM91.8 70.5l-15.08-1.65 1.34-11.4 15.08 1.69-1.34 11.36h0ZM23.49 146.22l-12.55-1.34 1.19-9.1 12.55 1.38s-1.19 9.06-1.19 9.06ZM28.97 164.48l-12.51-1.34 1.11-9.1 12.59 1.34-1.19 9.1h0ZM51 177.53l-9.9-1.15 1.07-9.29 9.86 1.19-1.04 9.25ZM67.43 180.14l-9.86-1.15 1-9.29 9.94 1.19s-1.07 9.25-1.08 9.25ZM75.91 172.31l-7.41-.84.77-6.99 7.45.92-.81 6.91h0ZM89.65 185.36l-7.49-.85.81-6.99 7.41.92-.73 6.91h0ZM108.8 180.14l-7.41-.85.81-6.99 7.41.92-.81 6.91ZM117.28 167.09l-4.95-.58.54-4.64 4.95.58s-.54 4.64-.54 4.64ZM42.87 156.65l-9.98-1.23 1-9.21 9.94 1.23-.96 9.21h0Z"/><path fill="currentColor" d="M51.08 161.87l-9.98-.88 1-6.95 9.94.96-.96 6.87h0ZM12.55 135.78l-12.55-1.34 1.11-9.1 12.55 1.38-1.11 9.06h0ZM12.55 107.03l-12.55-1.3 1.11-9.13 12.55 1.38-1.11 9.06h0ZM36.84 78.33l-14.89-1.8 1.5-13.85 14.89 1.8s-1.5 13.85-1.5 13.85Z"/></svg>`,
        'Baidu Cloud CDN': `<svg viewBox="0 0 10 11"><path fill="currentColor" fill-rule="evenodd" d="M3.4,5.4c.5-.9,2-1.5,3.1.1.8,1.1,2.1,2.2,2.1,2.2,0,0,1,.8.4,2.3-.6,1.5-2.8.8-3,.7h0s-.9-.3-1.9,0c-1,.2-1.9.1-1.9.1h0c-.2,0-1.2,0-1.5-1.5-.3-1.5,1.2-2.3,1.3-2.5.1-.1.9-.7,1.4-1.5ZM3.9,6.2v1h-.8s-.8,0-1.1,1c0,.6,0,1,.1,1.1,0,0,.3.5,1,.7h1.5v-3.8s-.7,0-.7,0ZM5.7,7.3h-.7v2s0,.5.7.7h1.8v-2.7h-.8v2h-.7s-.2,0-.3-.2v-1.8ZM3.9,7.9v1.5h-.6s-.4,0-.6-.5c0-.2,0-.5,0-.6,0-.1.2-.3.5-.4h.7ZM8.7,3.3c1,0,1.3,1,1.3,1.4s.1,1.8-1.2,1.8c-1.3,0-1.4-.9-1.4-1.5s.1-1.7,1.2-1.7ZM1.1,2.5c.8,0,1.3.8,1.4,1.3,0,.3.2,1.7-1,2C.3,6.1,0,4.7,0,4c0,0,.1-1.4,1.1-1.5ZM5.6,1.8c0-.7.8-1.7,1.5-1.5.6.1,1.2,1,1.1,1.7-.1.7-.7,1.7-1.5,1.5-.9-.1-1.1-.9-1-1.7ZM3.7,0c.7,0,1.2.8,1.2,1.7s-.5,1.7-1.2,1.7-1.2-.8-1.2-1.7.5-1.7,1.2-1.7Z"/></svg>`,
        'BelugaCDN': `<svg viewBox="0 0 92.85 53.27"><path fill="currentColor" d="M90.29,27.11c.16-2.35-.01-4.7-.5-7-1.8-9.1-6.8-15.5-15.8-18.5C68.49-.12,62.65-.46,56.99.61c-6,1-11.5,3.4-15.6,8l-8.3,9.5c-2.6,3.1-5.1,6.3-8.4,8.7-4,2.9-7.7,1.8-9.7-2.8.82.53,1.74.91,2.7,1.1,4,.1,8.6-5.4,8-9.2,0-.11,0-.22-.03-.33-.17-.92-1.05-1.54-1.97-1.37-1.02,0-2.03.17-3,.5-1.62.61-3.3,1.07-5,1.4-1.26.01-2.38.81-2.8,2-.42-1.19-1.54-1.99-2.8-2-1.02-.09-2.02-.29-3-.6-1.3-.49-2.64-.89-4-1.2-2.4-.3-3.4.8-3,3,.4,1.83,1.22,3.54,2.4,5,2.48,3.17,5.85,3.79,9.41,1.45.06.99.33,1.96.79,2.85,2.01,3.93,4.72,7.45,8,10.4,7.3,6.6,15.9,11,25.3,14,7.21,2.48,14.96,2.93,22.4,1.3,7.2-1.74,13.89-5.17,19.5-10,1.59-1.34,3.09-2.77,4.5-4.3h-1.2l-15.7,1.5c-5.32.43-10.68.43-16,0-1.51-.07-3-.41-4.4-1-.5-.2-.5-.5-.5-1s.6-.5,1-.2c.63.32,1.3.56,2,.7,2.55.39,5.13.52,7.7.4,9,0,18-1,27-1.6.9-.2.5-.6.3-1-1.73-2.55-2.54-5.62-2.3-8.7ZM53.49,37.01c-1.27,0-2.3-1.03-2.3-2.3s1.03-2.3,2.3-2.3c1.25.05,2.25,1.05,2.3,2.3,0,1.27-1.03,2.3-2.3,2.3Z"/></svg>`,
        'BaishanCloud': `<svg viewBox="0 0 73.3 73.4" xmlns="http://www.w3.org/2000/svg"><g><polygon fill="currentColor" fill-opacity="0.9" points="59.6 73.4 73.3 73.4 46.6 0 26.7 0 0 73.4 13.7 73.4 32.1 22.9 41.2 22.9 59.6 73.4"/><polygon fill="currentColor" fill-opacity="0.7" points="39.7 50.4 33.5 50.4 25.2 73.4 48.1 73.4 39.7 50.4"/></g></svg>`,
        'HiNet CDN': `<svg viewBox="0 0 117.7 60.02"><g><g><g><g><polygon fill="currentColor" fill-opacity="0.7" points="62.6 37.1 66.6 37.1 66.6 40.5 62.6 40.5 62.6 37.1 62.6 37.1 62.6 37.1 62.6 37.1"/><polygon fill="currentColor" fill-opacity="0.7" points="67.2 40.8 71.1 40.8 71.1 44.3 67.2 44.3 67.2 40.8 67.2 40.8 67.2 40.8 67.2 40.8"/><polygon fill="currentColor" fill-opacity="0.7" points="71.1 25.4 75 25.4 75 28.8 71.1 28.8 71.1 25.4 71.1 25.4 71.1 25.4 71.1 25.4"/><polygon fill="currentColor" fill-opacity="0.7" points="78.9 17.7 82.7 17.7 82.7 21.1 78.9 21.1 78.9 17.7 78.9 17.7 78.9 17.7 78.9 17.7"/><polygon fill="currentColor" fill-opacity="0.7" points="75 13.8 78.8 13.8 78.8 17.2 75 17.2 75 13.8 75 13.8 75 13.8 75 13.8"/></g><path fill="currentColor" fill-opacity="0.7" d="M88.2,4.1S86,.1,77,0c0,0-12.5.6-25,10.8,0,0-3,2.2-6.8,5.9-1.7,1.6-3.4,3.2-4.4,4.6h.1c-2.2,2.6-4.5,5.6-6.5,8.8h-.1l-.2.5h0c-1.1,1.8-1.9,3.6-2.8,5.6h0s-5.7,12.7-.2,19.9c0,0,3.7,5,13.5,3.7,0,0,12.2-1.5,21.8-9.6h0v-5.2h-4v-3.9h-3.9v-4.7h3.8v-4.2h4.1v-6.9h-4v-4.5h4.6v3.8h3.7v-3.7h4.1v-3.1h-4.1v-4.7h3.7v-3.4h4.6v3.4h4.1v4.2h7.4c-.1-.1,2.3-8.3-2.3-13.2h0Z"/></g></g><g><polygon fill="currentColor" points="19.7 21 19.7 28.2 7.7 28.2 7.7 21 0 21 0 39.8 7.7 39.8 7.7 31.8 19.7 31.8 19.7 39.8 27.4 39.8 27.4 21 19.7 21 19.7 21 19.7 21 19.7 21"/><polygon fill="currentColor" points="33.2 26 33.2 39.8 40.6 39.8 40.6 26 33.2 26 33.2 26 33.2 26 33.2 26"/><polygon fill="currentColor" points="66.2 21 66.2 32.4 53.7 21 46.3 21 46.3 39.8 53.6 39.8 53.7 28.7 66 39.8 73.6 39.8 73.6 21 66.2 21 66.2 21 66.2 21 66.2 21"/><path fill="currentColor" d="M89.6,40.1h.3c2.7,0,5.1-.4,7-1.1,1.8-.7,3.1-1.6,3.9-3h0l.2-.2-.6-.1-6.3-.6-.6-.1-.2.2h0c-.2.5-.5.9-.9,1.2-.6.3-1.4.6-2.5.6-.1,0-.2,0-.3-.1h0v3.2h0ZM89.6,34.2h11.5v-.2h0c0-2.4-.7-4.2-2.3-5.6-2-1.7-5.1-2.6-9.2-2.6h0v3.2h.1c1.3,0,2.3.2,3,.6.7.5,1.1,1.1,1.1,1.9h-4.2v2.7h0ZM89.2,25.7h.3v3.2h0c-1.2,0-2.3.2-3,.8-.7.4-1.1,1-1.2,1.8h4.2v2.7h-4.3c.1.7.5,1.4,1.2,1.8.8.6,1.8.9,3.1.9h0v3.2h0c-1.9,0-3.4-.2-4.8-.5-2.6-.6-4.4-1.5-5.6-2.9-.5-.6-1-1.2-1.2-1.9s-.2-1.3-.2-1.8c0-2,.8-3.7,2.6-5,2.2-1.5,5.2-2.3,8.9-2.3Z"/><path fill="currentColor" d="M117.7,39.2l-.5-2.7-.1-.3-.6.1h-.4c-.5.2-.8.2-1.1.2h0c-.2,0-.6.1-1,.1-1,0-1-.2-1-.3-.1-.4-.2-1-.2-2h0v-5h4.3v-3.3h-4.3v-5.1h-7.5v5.1h-2.9v3.3h2.9v5.5h0c0,1.1.1,1.9.2,2.4.1.5.4.9.8,1.4.5.5,1.3.8,2.6,1.2,1,.2,2.1.3,3.3.3.5,0,1.2-.1,2.3-.2,1.2,0,2.2-.2,2.9-.4h0l.3-.1v-.2h0Z"/><circle fill="currentColor" fill-opacity="0.5" cx="36.7" cy="20.8" r="4"/></g></g></svg>`,
        'JD Cloud': `<svg viewBox="0 0 297.46 177"><path fill="currentColor" d="M294.73,66.51s.01,0,.02.01c-2.95-12.52-16.87-45.02-49.46-58.72-32.29-13.57-63.79-9.61-94.92,13.27-27.45,20.17-38.37,40.49-55.93,57.93-21,20.86-36.75,27.88-49.24,32.6-5.97,2.26-13.04,4.18-20.25,5.52-.55-2.81-.83-5.66-.83-8.52,0-24.43,19.8-44.23,44.23-44.23,8.28,0,16.39,2.32,23.41,6.71,5.63-6,10.61-12.2,15.78-18.45-30.9-21.66-73.5-14.17-95.16,16.72C4.32,80.85,0,94.56,0,108.6c0,3.52.27,7.03.81,10.51,0,0,0,0,0,0,1.3,8.33,4.13,16.36,8.35,23.66.02,0,.03,0,.05,0-.02.01-.04.03-.05.04,12.2,21.15,34.76,34.18,59.18,34.18,45.55,0,69.52-23.43,69.52-23.43-7.34-5.12-16.9-18.74-16.9-18.74-25.42,20.09-52.62,18-52.62,18-11.91.01-23.32-4.8-31.63-13.33-.05,0-.12,0-.17,0,20.39-4.63,35.87-13.25,47-20.03,13.69-8.35,34.29-29.38,45.1-43,17.37-21.86,40-42.77,60.69-49.33,28.9-9.15,57,3.65,70.62,21.73.03.04.08.08.14.13-5.97-1.26-12.08-1.94-18.25-1.99-22.61,0-45.25,8.81-61.18,24.5-11.59,11.4-17.23,20.65-30.08,36.06,4.83,7.36,10.57,14.07,17.08,20,1.66-2.42,11-15.64,18-24.93,9-11.82,18.14-21.27,32-26.74,17.63-7.09,36.79-5.87,52.85,2.12,1.58,3.68,2.57,8.72,2.4,16.64-3.22,35.73-33.55,58.29-63.75,58.29-32.68,0-55.69-23.52-69.53-49.8-3.27-6.21-5.64-13.14-7.87-19.14-4.37,5.94-13.58,15.63-18.27,20.14,2.84,8,6.55,15.67,11.06,22.86,3.69,5.75,13,18.76,26.31,29.06,12.1,9.33,23.71,15.06,36.84,18.33,22.18,5.33,45.55,2.03,65.39-9.22,23.42-13.42,40.01-37.98,43.37-63.61,0,0,.01.02.02.02,1.74-11.7,1.13-23.62-1.76-35.07Z"/></svg>`,
        'Qiniu Cloud': `<svg viewBox="0 0 30.02 20"><path fill="currentColor" d="M30.02.06c-.4-.13-.84-.05-1.16.22-4.73,5.58-12.34,7.79-19.32,5.58-.45-1.63-.77-2.79-.77-2.79-.24-.67-.93-1.07-1.64-.94l.36,2.95C5.06,3.97,2.89,2.33,1.16.28.84.02.4-.07,0,.06c1.44,3.83,4.28,6.97,7.96,8.78l1,8.07s.45,3.09,3.34,3.09h6.19c2.89,0,3.34-3.09,3.34-3.09l.7-5.78c-1.88-.15-3.06,1.16-3.44,2.46-.63,2.18-.63,2.32-.75,2.71-.17.47-.59.8-1.09.87h-3.72c-.5-.07-.91-.4-1.09-.87-.16-.49-.98-3.43-1.81-6.39C18.66,12.17,27.09,7.9,30.01.09c0,0,0-.03,0-.03Z"/></svg>`,
        'OVHcloud CDN': `<svg viewBox="0 0 78.18 47.18"><path fill="currentColor" fill-rule="evenodd" d="M73.14,2.69c7.89,14.22,6.41,31.79-3.74,44.49h-21.44l6.6-11.67h-8.73l10.29-18.13h8.78l8.24-14.67v-.02ZM30.8,47.18H8.94C-1.41,34.52-2.91,16.81,5.15,2.59l14.18,24.63L34.96,0h23l-27.15,47.16h0v.02Z"/></svg>`,
        'CDN77': `<svg viewBox="0 0 54.29 63.72"><path fill="currentColor" fill-opacity="0.95" d="M27.15,0C12.15,0,0,12.23,0,27.31s27.15,36.41,27.15,36.41c0,0,27.15-21.33,27.15-36.41,0-15.08-12.15-27.31-27.15-27.31"/><path fill="currentColor" fill-opacity="0.6" d="M27.15,9.75c-9.14,0-16.55,7.45-16.55,16.65s7.41,16.65,16.55,16.65,16.55-7.45,16.55-16.65-7.41-16.65-16.55-16.65"/><path fill="currentColor" fill-opacity="0.95" d="M27.14,18.89c-4.12,0-7.46,3.36-7.46,7.51s3.34,7.51,7.46,7.51,7.47-3.36,7.47-7.51-3.34-7.51-7.47-7.51"/></svg>`,
    };

    // --- Region Detection Logic ---
    /**
     * 检测用户当前IP所在地区
     * 使用Cloudflare trace API,快速且可靠
     * 不缓存结果,支持VPN分流场景实时切换
     * @returns {Promise<string>} 国家代码 (如 'CN', 'US', 'JP' 等)
     */
    async function getUserRegion() {
        try {
            const result = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://1.1.1.1/cdn-cgi/trace",
                    timeout: 3000, // 3秒超时
                    onload: function (response) {
                        if (response.status === 200) {
                            resolve(response.responseText);
                        } else {
                            reject(new Error(`Status: ${response.status}`));
                        }
                    },
                    onerror: reject,
                    ontimeout: reject
                });
            });

            // 解析返回的文本格式: loc=CN
            const match = result.match(/loc=([A-Z]{2})/);
            if (match && match[1]) {
                const region = match[1];
                console.log(`[CDN Region] Detected user region: ${region}`);
                return region;
            }

            console.warn('[CDN Region] Could not parse region from Cloudflare trace');
            return 'UNKNOWN';
        } catch (e) {
            console.warn('[CDN Region] Failed to detect region:', e);
            // 降级方案: 使用浏览器语言推断
            const lang = navigator.language || navigator.userLanguage;
            if (lang.startsWith('zh-CN')) {
                console.log('[CDN Region] Fallback to CN based on browser language');
                return 'CN';
            }
            console.log('[CDN Region] Fallback to UNKNOWN');
            return 'UNKNOWN';
        }
    }

    // --- DNS Detection Logic ---
    const dnsCache = new Map(); // Cache results to avoid redundant requests

    async function checkDNS(domain) {
        if (!domain) {
            console.log('[CDN DNS] Skipped: no domain');
            return null;
        }
        if (dnsCache.has(domain)) {
            console.log('[CDN DNS] Using cached result for', domain);
            return dnsCache.get(domain);
        }

        console.log('[CDN DNS] Starting DNS lookup for', domain);

        // 检测用户当前所在地区 (每次都检测,不缓存,支持VPN切换)
        const userRegion = await getUserRegion();

        // 根据地区选择DNS服务器
        let dohProviders;
        if (userRegion === 'CN') {
            // 中国大陆: 优先使用阿里DNS,备用Google DNS
            dohProviders = [
                `https://dns.alidns.com/resolve?name=${domain}&type=CNAME`,
                `https://dns.google/resolve?name=${domain}&type=CNAME`
            ];
            console.log('[CDN DNS] Using Alibaba DNS (primary) for CN region');
        } else {
            // 其他地区: 优先使用Google DNS,备用阿里DNS
            dohProviders = [
                `https://dns.google/resolve?name=${domain}&type=CNAME`,
                `https://dns.alidns.com/resolve?name=${domain}&type=CNAME`
            ];
            console.log(`[CDN DNS] Using Google DNS (primary) for ${userRegion} region`);
        }

        for (const url of dohProviders) {
            try {
                const result = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        onload: function (response) {
                            if (response.status === 200) {
                                try {
                                    resolve(JSON.parse(response.responseText));
                                } catch (e) { reject(e); }
                            } else {
                                reject(new Error(response.statusText));
                            }
                        },
                        onerror: reject,
                        ontimeout: reject
                    });
                });

                if (result && result.Answer) {
                    const candidates = [];
                    const foundCnames = [];

                    for (const record of result.Answer) {
                        const cname = record.data;
                        if (!cname) continue;

                        // Check against rules
                        // Remove trailing dot if present
                        const cleanCname = cname.endsWith('.') ? cname.slice(0, -1) : cname;
                        foundCnames.push(cleanCname);

                        for (const [providerName, rule] of Object.entries(cdnRules)) {
                            if (rule.cnames && Array.isArray(rule.cnames)) {
                                for (const pattern of rule.cnames) {
                                    // 改进的匹配逻辑：检查域名标签或后缀，而不是简单的子字符串
                                    const cnameLabels = cleanCname.toLowerCase().split('.');
                                    const patternLower = pattern.toLowerCase();

                                    // 方法1: 检查 pattern 是否是某个完整的域名标签
                                    const isLabel = cnameLabels.includes(patternLower);

                                    // 方法2: 检查 pattern 是否是域名后缀（支持多级域名）
                                    const isSuffix = cleanCname.toLowerCase().endsWith('.' + patternLower) ||
                                        cleanCname.toLowerCase() === patternLower;

                                    if (isLabel || isSuffix) {
                                        candidates.push({
                                            provider: providerName,
                                            cname: cleanCname,
                                            priority: rule.priority || 0
                                        });
                                        break; // 找到匹配后跳出当前 provider 的循环
                                    }
                                }
                            }
                        }
                    }

                    // If multiple matches, choose the one with highest priority
                    if (candidates.length > 0) {
                        candidates.sort((a, b) => b.priority - a.priority);
                        const winner = candidates[0];
                        console.log(`[CDN DNS] Confirmed ${winner.provider} via CNAME: ${winner.cname} (Priority: ${winner.priority})`);
                        if (candidates.length > 1) {
                            console.log(`[CDN DNS] Runner-up: ${candidates[1].provider} (Priority: ${candidates[1].priority})`);
                        }
                        const match = { provider: winner.provider, cname: winner.cname };
                        dnsCache.set(domain, match);
                        return match;
                    } else if (foundCnames.length > 0) {
                        // Found CNAME but no matching CDN - still return the CNAME for display
                        console.log(`[CDN DNS] Found CNAME(s) but no matching CDN: ${foundCnames.join(', ')}`);
                        const match = { provider: null, cname: foundCnames[0] };
                        dnsCache.set(domain, match);
                        return match;
                    }
                }
            } catch (e) {
                console.warn(`[CDN DNS] Failed to query ${url}:`, e);
                // Continue to next provider
            }
        }

        console.log('[CDN DNS] No CNAME found for', domain);
        dnsCache.set(domain, null);
        return null;
    }

    // Update the panel if DNS detection finds a better result
    function updatePanelWithDNS(dnsResult, currentInfo) {
        if (!dnsResult) return;

        const panel = document.getElementById('cdn-info-host-enhanced');
        if (!panel || !panel.shadowRoot) return;

        // Find the provider value element (first info-line's info-value)
        const firstInfoLine = panel.shadowRoot.querySelector('.info-line');
        if (!firstInfoLine) return;

        const providerValue = firstInfoLine.querySelector('.info-value');
        if (!providerValue) return;

        if (dnsResult.provider && dnsResult.provider !== currentInfo.provider) {
            // DNS result differs from header detection - SILENTLY OVERRIDE
            console.log(`[CDN DNS] ⚠️ Correcting provider from ${currentInfo.provider} to ${dnsResult.provider}`);

            // Update provider text
            providerValue.textContent = dnsResult.provider;
            providerValue.title = `Detected via DNS: ${dnsResult.cname}`;

            // Update watermark to match new provider
            let watermark = panel.shadowRoot.querySelector('.cdn-watermark');

            // Find the icon for the new provider
            let iconKey = Object.keys(cdnIcons).find(key => key === dnsResult.provider);
            if (!iconKey) {
                iconKey = Object.keys(cdnIcons).find(key => {
                    const providerLower = dnsResult.provider.toLowerCase();
                    const keyLower = key.toLowerCase();
                    return providerLower.includes(keyLower) || keyLower.includes(providerLower);
                });
            }

            if (iconKey) {
                const iconSvg = cdnIcons[iconKey];
                if (watermark) {
                    // Update existing watermark
                    watermark.innerHTML = iconSvg;
                    console.log('[CDN DNS] Updated existing watermark icon');
                } else {
                    // Create new watermark element
                    watermark = document.createElement('div');
                    watermark.className = 'cdn-watermark';
                    watermark.innerHTML = iconSvg;
                    const panelElement = panel.shadowRoot.querySelector('#cdn-info-panel-enhanced');
                    if (panelElement) {
                        panelElement.insertBefore(watermark, panelElement.firstChild);
                        console.log('[CDN DNS] Created new watermark icon');
                    }
                }
            } else {
                // No matching icon found
                if (watermark) {
                    watermark.innerHTML = '';
                }
                console.log('[CDN DNS] No icon found for:', dnsResult.provider);
            }

            // Add DNS status at bottom
            addDNSStatus(panel, `DNS: ${dnsResult.cname}`);
        } else {
            // No provider match or provider matches - just show CNAME
            if (dnsResult.provider) {
                console.log(`[CDN DNS] ✓ Confirmed ${dnsResult.provider} via CNAME: ${dnsResult.cname}`);
            } else {
                console.log(`[CDN DNS] Found CNAME but no CDN match: ${dnsResult.cname}`);
            }
            addDNSStatus(panel, `DNS: ${dnsResult.cname}`);
        }
    }

    // Helper function to add DNS status line at bottom
    function addDNSStatus(panel, statusText) {
        if (!panel || !panel.shadowRoot) return;

        // Check if status already exists
        let statusLine = panel.shadowRoot.querySelector('.dns-status');
        if (!statusLine) {
            statusLine = document.createElement('div');
            statusLine.className = 'dns-status';
            panel.shadowRoot.querySelector('#cdn-info-panel-enhanced').appendChild(statusLine);
        }

        const prefix = "DNS: ";
        let value = statusText;
        if (statusText.startsWith(prefix)) {
            value = statusText.substring(prefix.length);
        }

        statusLine.innerHTML = `<span class="dns-label">DNS:</span><span class="dns-value" title="${value}">${value}</span>`;
    }

    // --- UI & Execution Functions ---

    // Detect if the current page is using dark or light theme
    function detectPageTheme() {
        try {
            // Method 1: Check data-theme or data-bs-theme attributes (common in modern sites)
            const htmlTheme = document.documentElement.getAttribute('data-theme') ||
                document.documentElement.getAttribute('data-bs-theme') ||
                document.documentElement.getAttribute('data-color-mode');
            if (htmlTheme) {
                if (htmlTheme.toLowerCase().includes('dark')) return 'dark';
                if (htmlTheme.toLowerCase().includes('light')) return 'light';
            }

            const bodyTheme = document.body?.getAttribute('data-theme') ||
                document.body?.getAttribute('data-bs-theme') ||
                document.body?.getAttribute('data-color-mode');
            if (bodyTheme) {
                if (bodyTheme.toLowerCase().includes('dark')) return 'dark';
                if (bodyTheme.toLowerCase().includes('light')) return 'light';
            }

            // Method 2: Check class names for dark/light keywords
            const htmlClass = document.documentElement.className || '';
            const bodyClass = document.body?.className || '';
            const combinedClasses = (htmlClass + ' ' + bodyClass).toLowerCase();

            if (combinedClasses.includes('dark-mode') || combinedClasses.includes('dark-theme') ||
                combinedClasses.includes(' dark ') || combinedClasses.startsWith('dark ') ||
                combinedClasses.endsWith(' dark')) {
                return 'dark';
            }
            if (combinedClasses.includes('light-mode') || combinedClasses.includes('light-theme') ||
                combinedClasses.includes(' light ') || combinedClasses.startsWith('light ') ||
                combinedClasses.endsWith(' light')) {
                return 'light';
            }

            // Method 3: Check color-scheme CSS property
            const colorScheme = getComputedStyle(document.documentElement).colorScheme;
            if (colorScheme && colorScheme.includes('dark')) return 'dark';
            if (colorScheme && colorScheme.includes('light')) return 'light';

            // Method 4: Analyze background color brightness
            const bgColor = getComputedStyle(document.body).backgroundColor;
            if (bgColor && bgColor !== 'transparent' && bgColor !== 'rgba(0, 0, 0, 0)') {
                const brightness = calculateBrightness(bgColor);
                // Lower threshold for better dark detection
                return brightness < 100 ? 'dark' : 'light';
            }

            // Fallback to html element
            const htmlBg = getComputedStyle(document.documentElement).backgroundColor;
            if (htmlBg && htmlBg !== 'transparent' && htmlBg !== 'rgba(0, 0, 0, 0)') {
                const brightness = calculateBrightness(htmlBg);
                return brightness < 100 ? 'dark' : 'light';
            }

            return null; // Cannot determine
        } catch (e) {
            console.warn('[CDN Detector] Error detecting page theme:', e);
            return null;
        }
    }

    // Calculate brightness from RGB color string
    function calculateBrightness(color) {
        const rgb = color.match(/\d+/g);
        if (!rgb || rgb.length < 3) return 255; // Default to light
        const [r, g, b] = rgb.map(Number);
        // Standard brightness formula
        return (r * 299 + g * 587 + b * 114) / 1000;
    }

    function getPanelCSS() {
        // Simple light/dark theme (no auto mode)
        const isDarkTheme = config.settings.theme === 'dark';
        console.log('[CDN Detector] Panel theme:', config.settings.theme);

        // Ultra-premium aesthetic: deeper blacks, cleaner whites
        const materialBase = isDarkTheme
            ? 'rgba(15, 15, 15, 0.65)'  // Dark mode: darker, slightly less transparent for legibility
            : 'rgba(255, 255, 255, 0.65)'; // Light mode: milky white

        const surfaceGradient = isDarkTheme
            ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 100%)'
            : 'linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 100%)';

        const borderColor = isDarkTheme
            ? 'rgba(255, 255, 255, 0.12)' // Crisp border in dark
            : 'rgba(0, 0, 0, 0.08)';

        const textColor = isDarkTheme ? '#FFFFFF' : '#000000';
        const labelColor = isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)';

        // Specific font stacks
        const uiFont = '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        const monoFont = '"SF Mono", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", monospace';

        // Colors & Shadows
        const backdropFilter = 'blur(24px) saturate(180%)'; // Balanced blur
        const boxShadow = isDarkTheme
            ? '0 12px 32px rgba(0, 0, 0, 0.4), 0 4px 8px rgba(0, 0, 0, 0.2)'
            : '0 12px 32px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.05)';

        const greenColor = isDarkTheme ? '#4ADE80' : '#16A34A'; // Slightly muted green
        const redColor = '#EF4444';
        const blueColor = '#3B82F6';

        return `
        /* Safe CSS Reset for Shadow DOM */
        :host {
            all: initial;
            position: fixed;
            z-index: 2147483647;
            ${getPositionCSS()}
            font-family: ${uiFont};
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            /* Prevent font scaling issues */
            text-size-adjust: 100%;
        }

        /* Reset inherited properties specifically for our container */
        #cdn-info-panel-enhanced {
            all: unset; /* Clear inherited styles on container */
            position: relative;
            box-sizing: border-box;
            width: 252px; /* Optimal width for compact display */
            padding: 14px 16px;
            border-radius: 14px;
            background-color: ${materialBase};
            backdrop-filter: ${backdropFilter};
            -webkit-backdrop-filter: ${backdropFilter};
            border: 1px solid ${borderColor};
            box-shadow: ${boxShadow};
            cursor: move;
            user-select: none;
            transition: all 0.3s ease;
            color: ${textColor};
            display: flex;
            flex-direction: column;
            gap: 10px;
            overflow: hidden;
            
            /* Explicitly define inherited properties to stop leakage */
            line-height: 1.5;
            font-size: 14px;
            font-style: normal;
            font-weight: normal;
            text-align: left;
            text-decoration: none;
            text-transform: none;
        }

        /* Ensure all children use border-box */
        #cdn-info-panel-enhanced * {
            box-sizing: border-box;
        }

        /* Subtle top highlight */
        #cdn-info-panel-enhanced::after {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            border-radius: 14px;
            background: ${surfaceGradient};
            pointer-events: none;
            z-index: 1;
        }

        #cdn-info-panel-enhanced > *:not(.cdn-watermark) { position: relative; z-index: 2; }

        /* --- Buttons (Hidden by default) --- */
        button.icon-btn {
            position: absolute !important;
            top: 14px !important;
            width: 18px !important;
            height: 18px !important;
            border-radius: 50% !important;
            background: transparent !important;
            color: ${textColor} !important;
            border: none !important;
            outline: none !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            opacity: 0 !important;
            transition: opacity 0.2s ease, transform 0.2s ease !important;
            z-index: 100 !important;
            padding: 0 !important;
            margin: 0 !important;
            -webkit-appearance: none !important;
            appearance: none !important;
            line-height: 1 !important;
        }

        button.close-btn { right: 12px !important; font-size: 16px !important; font-weight: 300 !important; line-height: 18px !important; }
        button.theme-btn { right: 36px !important; font-size: 12px !important; line-height: 18px !important; }

        #cdn-info-panel-enhanced:hover button.icon-btn { opacity: 0.5 !important; }
        button.icon-btn:hover { opacity: 1 !important; transform: scale(1.1); }

        /* --- Content Typography --- */
        .panel-header {
            display: block;
            font-family: ${uiFont};
            font-size: 10px;
            font-weight: 700;
            color: ${isDarkTheme ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'};
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin: 0 0 2px 0;
            padding-left: 2px;
            line-height: 1.4;
        }

        .info-lines-container {
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin: 0;
            padding: 0;
        }

        .info-line {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin: 0;
            padding: 0;
            border: none;
            line-height: normal;
        }

        .info-label {
            display: inline-block;
            font-family: ${uiFont};
            font-size: 11px;
            font-weight: 500;
            color: ${isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'};
            letter-spacing: 0px;
            flex-shrink: 0; /* Protect label from squeezing */
            margin-right: 8px;
            width: 42px; /* Fixed width for labels */
        }

        .info-value {
            display: inline-block;
            font-family: ${monoFont}; /* Mono for data */
            font-size: 11px;
            font-weight: 500;
            color: ${textColor};
            text-align: right;
            opacity: 0.95;
            flex: 1; /* Occupy all remaining space */
            min-width: 0; /* Enable truncation in flex item */
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            letter-spacing: -0.2px;
        }

        .cache-HIT { color: ${greenColor} !important; }
        .cache-MISS { color: ${redColor} !important; }
        .cache-BYPASS, .cache-DYNAMIC { color: ${blueColor} !important; }
        
        /* Watermark Styles */
        .cdn-watermark {
            position: absolute;
            top: 8px;
            left: 75%;
            bottom: 8px;
            max-width: 45%;
            opacity: 1;
            pointer-events: none;
            z-index: 0;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            transform: translateX(-50%);
            color: ${isDarkTheme ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)'};
        }
        .cdn-watermark svg {
            height: 100%;
            width: auto;
            fill: currentColor;
            display: block;
        }

        /* DNS Status Line */
        /* DNS Status Line */
        .dns-status {
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: ${monoFont};
            font-size: 9px;
            color: ${isDarkTheme ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'};
            margin-top: 1px;
            padding-top: 1px;
            border-top: 1px solid ${isDarkTheme ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
            letter-spacing: 0.3px;
            opacity: 0.8;
            line-height: normal;
            width: 100%;
        }
        
        .dns-label {
            white-space: nowrap;
            flex-shrink: 0;
            margin-right: 4px;
        }

        .dns-value {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: left;
            flex: 1;
            min-width: 0;
        }
        
        
        /* Settings panel styles */
        #settings-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 320px;
            padding: 24px;
            border-radius: 24px;
            background-color: ${materialBase};
            backdrop-filter: ${backdropFilter};
            -webkit-backdrop-filter: ${backdropFilter};
            box-shadow: ${boxShadow};
            z-index: 2147483648;
            font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
            color: ${textColor};
            overflow: hidden;
            /* Simple sleek border for settings panel too */
            border: 1px solid ${borderColor};
        }
        #settings-panel::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 24px;
            background: ${surfaceGradient};
            pointer-events: none;
            z-index: 1;
        }
        #settings-panel > * {
            position: relative;
            z-index: 2;
        }
            #settings-panel h3 {
                margin-top: 0;
                color: ${textColor};
                text-align: center;
                font-size: 14px;
                font-weight: 600;
            }
            .setting-item {
                margin-bottom: 12px;
            }
            .setting-item label {
                display: block;
                margin-bottom: 4px;
                color: ${labelColor};
                font-weight: 500;
                font-size: 12px;
            }
            .setting-item select, .setting-item input {
                width: 100%;
                padding: 8px 12px;
                border-radius: 12px;
                border: 1px solid ${isDarkTheme ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'};
                background: ${isDarkTheme ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.6)'};
                color: ${textColor};
                font-size: 13px;
                box-sizing: border-box;
                transition: all 0.2s;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
            }
            .setting-item select:focus, .setting-item input:focus {
                outline: none;
                border-color: ${blueColor};
                background: ${isDarkTheme ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.8)'};
            }
            .setting-buttons {
                display: flex;
                justify-content: space-between;
                margin-top: 16px;
            }
            .setting-btn {
                padding: 10px 16px;
                border-radius: 12px;
                border: none;
                cursor: pointer;
                font-weight: 600;
                font-size: 13px;
                flex: 1;
                margin: 0 6px;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
            }
            .setting-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            .setting-btn:active {
                transform: translateY(0);
            }
            .save-btn {
                background: ${blueColor};
                color: white;
            }
            .cancel-btn {
                background: ${isDarkTheme ? 'rgba(120, 120, 128, 0.3)' : 'rgba(120, 120, 128, 0.2)'};
                color: ${textColor};
            }
        `;
    }

    function getPositionCSS() {
        switch (config.settings.panelPosition) {
            case 'top-left':
                return 'top: 20px; left: 20px;';
            case 'top-right':
                return 'top: 20px; right: 20px;';
            case 'bottom-left':
                return 'bottom: 20px; left: 20px;';
            case 'bottom-right':
            default:
                return `bottom: ${config.initialPosition.bottom}; right: ${config.initialPosition.right};`;
        }
    }

    function createSettingsPanel() {
        // Remove existing settings panel if present
        const existingPanel = document.getElementById('cdn-settings-panel');
        if (existingPanel) existingPanel.remove();

        const panel = document.createElement('div');
        panel.id = 'cdn-settings-panel';
        document.body.appendChild(panel);

        const shadowRoot = panel.attachShadow({ mode: 'open' });
        const styleEl = document.createElement('style');
        styleEl.textContent = getPanelCSS();
        shadowRoot.appendChild(styleEl);

        const settingsPanel = document.createElement('div');
        settingsPanel.id = 'settings-panel';
        settingsPanel.innerHTML = `
            <h3>CDN Info Display Settings</h3>
            <div class="setting-item">
                <label for="theme">Theme</label>
                <select id="theme">
                    <option value="auto" ${config.settings.theme === 'auto' || !config.settings.theme ? 'selected' : ''}>Auto (System)</option>
                    <option value="dark" ${config.settings.theme === 'dark' ? 'selected' : ''}>Dark</option>
                    <option value="light" ${config.settings.theme === 'light' ? 'selected' : ''}>Light</option>
                </select>
            </div>
            <div class="setting-item">
                <label for="panelPosition">Panel Position</label>
                <select id="panelPosition">
                    <option value="top-left" ${config.settings.panelPosition === 'top-left' ? 'selected' : ''}>Top Left</option>
                    <option value="top-right" ${config.settings.panelPosition === 'top-right' ? 'selected' : ''}>Top Right</option>
                    <option value="bottom-left" ${config.settings.panelPosition === 'bottom-left' ? 'selected' : ''}>Bottom Left</option>
                    <option value="bottom-right" ${config.settings.panelPosition === 'bottom-right' ? 'selected' : ''}>Bottom Right</option>
                </select>
            </div>
            <div class="setting-item">
                <label for="showExtraInfo">
                    <input type="checkbox" id="showExtraInfo" ${config.settings.showExtraInfo ? 'checked' : ''}>
                    Show Extra Information
                </label>
            </div>
            <div class="setting-buttons">
                <button class="setting-btn cancel-btn">Cancel</button>
                <button class="setting-btn save-btn">Save</button>
            </div>
        `;
        shadowRoot.appendChild(settingsPanel);

        // Add event listeners
        shadowRoot.querySelector('.cancel-btn').addEventListener('click', () => {
            panel.remove();
        });

        shadowRoot.querySelector('.save-btn').addEventListener('click', () => {
            // Save settings
            config.settings.theme = shadowRoot.querySelector('#theme').value;
            config.settings.panelPosition = shadowRoot.querySelector('#panelPosition').value;
            config.settings.showExtraInfo = shadowRoot.querySelector('#showExtraInfo').checked;

            // Save to GM storage if available
            if (typeof GM_setValue !== 'undefined') {
                GM_setValue('cdnInfoSettings', JSON.stringify(config.settings));
            }

            // Close panel
            panel.remove();

            // Re-render info panel with new settings
            const infoPanel = document.getElementById('cdn-info-host-enhanced');
            if (infoPanel) {
                infoPanel.remove();
                // Re-run execution to show updated panel
                runExecution(config.max_retries);
            }
        });
    }

    function createDisplayPanel(info) {
        if (!info || document.getElementById('cdn-info-host-enhanced')) return;
        const host = document.createElement('div');
        host.id = 'cdn-info-host-enhanced';
        document.body.appendChild(host);

        const shadowRoot = host.attachShadow({ mode: 'open' });
        const styleEl = document.createElement('style');

        try {
            styleEl.textContent = getPanelCSS();
        } catch (e) {
            console.error('Final CSS generation failed:', e);
            styleEl.textContent = '';
        }

        shadowRoot.appendChild(styleEl);

        const panel = document.createElement('div');
        panel.id = 'cdn-info-panel-enhanced';

        const cacheStatus = info.cache.toUpperCase();
        const cacheClass = 'cache-' + cacheStatus.split(' ')[0];

        const providerLabel =
            info.provider.includes('CDN') ||
                info.provider.includes('Cloud') ||
                info.provider.includes('Edge') ||
                info.provider === 'Imperva' ||
                info.provider === 'Fastly' ||
                info.provider === 'Vercel' ||
                info.provider === 'Netlify' ||
                info.provider === 'Akamai' ||
                info.provider === 'SiteGround'
                ? 'CDN'
                : 'Server';

        // Use full provider name - let CSS handle truncation
        const displayProvider = info.provider;

        // Build panel content with new structure
        // Determine current theme for icon display
        const currentTheme = config.settings.theme === 'light' ? 'light' : 'dark';

        // SVG icons (Lucide style)
        const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>`;
        const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>`;

        const themeIcon = currentTheme === 'light' ? sunIcon : moonIcon;

        // Find watermark icon based on CDN provider
        let watermarkSvg = '';
        console.log('[CDN Icon] Looking for icon for provider:', info.provider);

        if (cdnIcons[info.provider]) {
            // Exact match
            watermarkSvg = cdnIcons[info.provider];
            console.log('[CDN Icon] Found exact match');
        } else {
            // Fuzzy match: try multiple strategies
            // Strategy 1: Check if provider name contains any icon key
            let iconKey = Object.keys(cdnIcons).find(key => info.provider.includes(key));

            // Strategy 2: Check if any icon key is contained in provider name (reverse check)
            if (!iconKey) {
                iconKey = Object.keys(cdnIcons).find(key => {
                    // Case-insensitive partial match
                    const providerLower = info.provider.toLowerCase();
                    const keyLower = key.toLowerCase();
                    return providerLower.includes(keyLower) || keyLower.includes(providerLower);
                });
            }

            if (iconKey) {
                watermarkSvg = cdnIcons[iconKey];
                console.log('[CDN Icon] Found fuzzy match:', iconKey);
            } else {
                console.log('[CDN Icon] No icon found for:', info.provider);
            }
        }
        const watermarkHtml = watermarkSvg ? `<div class="cdn-watermark">${watermarkSvg}</div>` : '';

        let panelContent = `
            ${watermarkHtml}
            <button class="icon-btn close-btn" title="Close">×</button>
            <button class="icon-btn theme-btn" title="Toggle Theme">${themeIcon}</button>
            <div class="panel-header">CDN & Server Info</div>
            
            <div class="info-lines-container">
                <div class="info-line">
                    <span class="info-label">${providerLabel}</span>
                    <span class="info-value" title="${info.provider}">${displayProvider}</span>
                </div>
                <div class="info-line">
                    <span class="info-label">Cache</span>
                    <span class="info-value ${cacheClass}">${cacheStatus}</span>
                </div>
        `;

        // Add POP location if available and not N/A
        if (info.pop && info.pop !== 'N/A') {
            let displayPop = info.pop;
            if (displayPop.length > 18) {
                displayPop = displayPop.substring(0, 15) + '...';
            }
            panelContent += `
                <div class="info-line">
                    <span class="info-label">POP</span>
                    <span class="info-value" title="${info.pop}">${displayPop}</span>
                </div>
            `;
        }


        // Trigger generic DNS check for current domain
        checkDNS(window.location.hostname).then(dnsResult => {
            updatePanelWithDNS(dnsResult, info);
        });

        // Auto-hide logic (if enabled)
        // Removed as per request to keep it minimal

        panelContent += `</div>`; // Close info-lines-container

        panel.innerHTML = panelContent;
        shadowRoot.appendChild(panel);

        shadowRoot.querySelector('.close-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            host.remove();
        });

        shadowRoot.querySelector('.theme-btn').addEventListener('click', (e) => {
            e.stopPropagation();

            // Toggle between light and dark only
            config.settings.theme = config.settings.theme === 'light' ? 'dark' : 'light';

            // Save settings
            if (typeof GM_setValue !== 'undefined') {
                GM_setValue('cdnInfoSettings', JSON.stringify(config.settings));
            }

            // Update icon immediately with SVG
            const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>`;
            const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>`;
            const newIcon = config.settings.theme === 'light' ? sunIcon : moonIcon;
            shadowRoot.querySelector('.theme-btn').innerHTML = newIcon;

            // Update styles by replacing the style element
            const newStyleEl = document.createElement('style');
            try {
                newStyleEl.textContent = getPanelCSS();
                const oldStyle = shadowRoot.querySelector('style');
                if (oldStyle) {
                    shadowRoot.replaceChild(newStyleEl, oldStyle);
                }
            } catch (e) {
                console.error('Failed to update theme:', e);
            }
        });


        makeDraggable(host);
    }

    function makeDraggable(element) {
        let isDragging = false,
            startX = 0,
            startY = 0,
            elementX = 0,
            elementY = 0;
        const dragTarget = element.shadowRoot.querySelector('#cdn-info-panel-enhanced');
        dragTarget.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('close-btn')) return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = element.getBoundingClientRect();
            elementX = rect.left;
            elementY = rect.top;
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);
        });
        function drag(e) {
            if (!isDragging) return;
            e.preventDefault();
            const newX = elementX + e.clientX - startX;
            const newY = elementY + e.clientY - startY;
            const maxX = window.innerWidth - element.offsetWidth;
            const maxY = window.innerHeight - element.offsetHeight;
            element.style.left = `${Math.max(0, Math.min(newX, maxX))}px`;
            element.style.top = `${Math.max(0, Math.min(newY, maxY))}px`;
            element.style.right = 'auto';
            element.style.bottom = 'auto';
        }
        function dragEnd() {
            isDragging = false;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', dragEnd);
        }
    }

    function shouldExcludePage() {
        const url = window.location.href.toLowerCase();
        if (config.excludePatterns.some((pattern) => pattern.test(url))) {
            console.log('[CDN Detector] Excluded by URL pattern.');
            return true;
        }
        return false;
    }

    async function runExecution(retriesLeft) {
        const currentHref = window.location.href;
        const status = window.cdnScriptStatus;
        if (
            status[currentHref] === 'succeeded' ||
            shouldExcludePage() ||
            document.getElementById('cdn-info-host-enhanced')
        )
            return;
        console.log(`[CDN Detector] Attempting to fetch headers... Retries left: ${retriesLeft}`);
        try {
            let response = await fetch(currentHref, {
                method: 'HEAD',
                cache: 'no-store',
                redirect: 'follow',
                headers: {
                    'User-Agent': navigator.userAgent,
                    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                },
            });

            // If HEAD returns 403, try GET as some CDNs block HEAD requests
            if (response.status === 403 || response.status === 405) {
                console.log(`[CDN Detector] HEAD returned ${response.status}, retrying with GET...`);
                response = await fetch(currentHref, {
                    method: 'GET',
                    cache: 'no-store',
                    redirect: 'follow',
                    headers: {
                        'User-Agent': navigator.userAgent,
                        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    },
                });
            }

            const info = parseInfo(response);
            if (info) {
                createDisplayPanel(info);
                status[currentHref] = 'succeeded';
                console.log('[CDN Detector] Success:', info);
            } else {
                throw new Error('No server info found.');
            }
        } catch (error) {
            console.warn(
                `[CDN Detector] Fetch failed: ${error.message}. This often indicates an active security challenge.`
            );
            status[currentHref] = 'retrying';
            if (retriesLeft > 0) {
                console.log(`[CDN Detector] Retrying in ${config.retry_delay / 1000} seconds...`);
                setTimeout(() => runExecution(retriesLeft - 1), config.retry_delay);
            } else {
                console.error('[CDN Detector] Max retries reached. Aborting for this page.');
                status[currentHref] = 'failed';
            }
        }
    }

    function loadUserSettings() {
        // Load settings from GM storage if available
        if (typeof GM_getValue !== 'undefined') {
            try {
                const savedSettings = GM_getValue('cdnInfoSettings');
                if (savedSettings) {
                    const parsed = JSON.parse(savedSettings);
                    config.settings = { ...config.settings, ...parsed };
                    console.log('[CDN Detector] Loaded saved settings:', config.settings);

                    // Always re-detect and apply page theme on load
                    const pageTheme = detectPageTheme();
                    if (pageTheme) {
                        config.settings.theme = pageTheme;
                        console.log('[CDN Detector] Applied page theme:', pageTheme);
                        GM_setValue('cdnInfoSettings', JSON.stringify(config.settings));
                    } else if (config.settings.theme !== 'light' && config.settings.theme !== 'dark') {
                        // Fallback if page theme can't be detected and saved theme is invalid
                        config.settings.theme = 'light';
                        GM_setValue('cdnInfoSettings', JSON.stringify(config.settings));
                    }
                } else {
                    console.log('[CDN Detector] No saved settings, using defaults:', config.settings);
                    // If no settings, initialize theme based on page theme or default to light
                    const pageTheme = detectPageTheme();
                    config.settings.theme = pageTheme || 'light';
                    GM_setValue('cdnInfoSettings', JSON.stringify(config.settings));
                }
            } catch (e) {
                console.warn('[CDN Detector] Failed to load user settings:', e);
            }
        } else {
            console.log('[CDN Detector] GM_getValue not available, using defaults');
        }
    }

    function main() {
        // Load user settings
        loadUserSettings();

        setTimeout(() => runExecution(config.max_retries), config.initial_delay);
        let lastUrl = window.location.href;
        const observer = new MutationObserver(() => {
            if (window.location.href !== lastUrl) {
                console.log('[CDN Detector] URL changed (SPA), resetting...');
                lastUrl = window.location.href;
                const oldPanel = document.getElementById('cdn-info-host-enhanced');
                if (oldPanel) oldPanel.remove();
                setTimeout(() => runExecution(config.max_retries), config.initial_delay);
            }
        });
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
        } else {
            new MutationObserver((__, obs) => {
                if (document.body) {
                    observer.observe(document.body, { childList: true, subtree: true });
                    obs.disconnect();
                }
            }).observe(document.documentElement, { childList: true });
        }

        // Listen for system theme changes
        const themeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        themeMediaQuery.addEventListener('change', (e) => {
            // Only update if using auto theme
            if (config.settings.theme === 'auto' || !config.settings.theme) {
                console.log('[CDN Detector] System theme changed, updating panel...');
                const oldPanel = document.getElementById('cdn-info-host-enhanced');
                if (oldPanel) {
                    oldPanel.remove();
                    setTimeout(() => runExecution(config.max_retries), 100);
                }
            }
        });

        // Listen for page theme changes (class/style changes on html/body)
        let lastPageTheme = detectPageTheme();
        console.log('[CDN Detector] Initial page theme detected:', lastPageTheme);
        let themeCheckTimeout;

        const pageThemeObserver = new MutationObserver((mutations) => {
            // Debounce: only check after 300ms of no changes
            clearTimeout(themeCheckTimeout);
            themeCheckTimeout = setTimeout(() => {
                if (config.settings.theme === 'auto' || !config.settings.theme) {
                    const currentPageTheme = detectPageTheme();
                    console.log('[CDN Detector] Theme check - Last:', lastPageTheme, 'Current:', currentPageTheme);

                    if (currentPageTheme && currentPageTheme !== lastPageTheme) {
                        console.log(`[CDN Detector] Page theme changed: ${lastPageTheme} -> ${currentPageTheme}`);
                        lastPageTheme = currentPageTheme;

                        const oldPanel = document.getElementById('cdn-info-host-enhanced');
                        if (oldPanel) {
                            oldPanel.remove();
                            setTimeout(() => runExecution(config.max_retries), 100);
                        }
                    }
                }
            }, 300);
        });

        // Observe both html and body for attribute changes
        if (document.documentElement) {
            pageThemeObserver.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['class', 'style', 'data-theme', 'data-color-scheme']
            });
        }
        if (document.body) {
            pageThemeObserver.observe(document.body, {
                attributes: true,
                attributeFilter: ['class', 'style', 'data-theme', 'data-color-scheme']
            });
        }
    }

    main();
})();
