// ==UserScript==
// @name         优化Bilibili
// @namespace    http://tampermonkey.net/
// @version      1.9.9.2
// @description  优化Bilibili主页、文章和直播页面,增加禁用追踪、日志和 P2P CDN 功能
// @match        https://www.bilibili.com/
// @match        *://www.bilibili.com/read/*
// @match        *://live.bilibili.com/*
// @match        *://www.bilibili.com/video/*
// @match       *://*.bilibili.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.notification
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/503306/%E4%BC%98%E5%8C%96Bilibili.user.js
// @updateURL https://update.greasyfork.org/scripts/503306/%E4%BC%98%E5%8C%96Bilibili.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 辅助函数 Start ---
    const o$1 = ()=>{}; // 空函数
    const r = ()=>true; // 返回 true 的函数
    const e$2 = ()=>false; // 返回 false 的函数

    // 定义只读属性
    function defineReadonlyProperty(target, key, value, enumerable = true) {
        Object.defineProperty(target, key, {
            get () {
                return value;
            },
            set: o$1, // 设置为空函数，防止修改
            configurable: false,
            enumerable
        });
    }

    // 简化的 URL 匹配函数
    function createUrlMatcher(patterns) {
        return function(url) {
            if (!url) return false;
            for (const pattern of patterns) {
                if (typeof pattern === 'string') {
                if (url.includes(pattern)) {
                    return true;
                    }
                } else if (pattern instanceof RegExp) { // 允许 RegExp
                    if (pattern.test(url)) {
                        return true;
                    }
                }
            }
            return false;
        };
    }

    // 从请求信息中获取 URL
    function getUrlFromRequest(request) {
        if (typeof request === 'string') {
            return request;
        }
        if (request && 'href' in request) { // URL object
            return request.href;
        }
        if (request && 'url' in request) { // Request object
            return request.url;
        }
        console.warn('Tampermonkey Script "优化Bilibili": 无法从请求中获取 URL', request);
        return null;
    }

    // 创建 Mock 类 (简化版)
    function createMockClass(className) {
        const fakeClassInstance = new Proxy(o$1, {
            get (target, prop) {
                return (...args)=>{
                    // console.log(`Mock Call: (new ${className})[${String(prop)}] called with arguments:`, args);
                };
            }
        });
        return new Proxy(class {}, {
            construct () {
                return fakeClassInstance;
            },
            get (target, prop) {
                return (...args)=>{
                   // console.log(`Mock Call: window.${className}[${String(prop)}] called with arguments:`, args);
                };
            }
        });
    }

    // 新增：从 URL 字符串或 URL 对象获取查询参数
    function getUrlParams(url) {
        const params = {};
        let search;
        if (typeof url === 'string') {
            try {
                search = new URL(url, url.startsWith('/') ? window.location.origin : undefined).search;
            } catch (e) {
                search = url.includes('?') ? url.substring(url.indexOf('?')) : '';
            }
        } else if (url instanceof URL) {
            search = url.search;
        } else {
            return params;
        }
        const urlSearchParams = new URLSearchParams(search);
        for (const [key, value] of urlSearchParams) {
            params[key] = value;
        }
        return params;
    }

    // 新增: 强力替换mcdn URL的函数
    function forceMcdnReplace(url) {
        if (!url || typeof url !== 'string') return url;

        // 如果不包含mcdn，直接返回
        if (!url.includes('.mcdn.bilivideo')) return url;

        try {
            // 优先使用缓存中的CDN，或默认值
            const cdnHost = intelligentCdnCache.length > 0 ?
                intelligentCdnCache[0] : 'upos-sz-mirrorcos.bilivideo.com';

            // 更激进的替换模式，无需复杂匹配
            const newUrl = url.replace(/(https?:\/\/|\/\/)([\w.-]+)(\.mcdn\.bilivideo\.[a-z]+)(:[0-9]+)?(\/.*)?/i,
                (match, protocol, subdomain, domain, port, path) => {
                    const secureProtocol = (protocol === '//') ? 'https://' : 'https://';
                    return `${secureProtocol}${cdnHost}${path || ''}`;
                });

            if (newUrl !== url) {
                console.log(`[强力替换]: ${url} -> ${newUrl}`);
                return newUrl;
            }
        } catch (e) {
            console.error('[强力替换]: 处理URL出错', e, url);
        }

        return url;
    }
    // --- 辅助函数 End ---

    // --- LRU Cache (flru) Start ---
    // REMOVED - No longer needed
    // --- LRU Cache (flru) End ---

    // --- ErrorCounter Start ---
    // REMOVED - No longer needed
    // --- ErrorCounter End ---


    // --- 功能常量 Start ---
    // ** 追踪相关 **
    const TRACKING_URLS = [
        'data.bilibili.com',
        'cm.bilibili.com',
        'api.bilibili.com/x/internal/gaia-gateway/ExClimbWuzhi',
        // 添加其他可能的追踪 URL
        '/log/web',
        '//config.bilibili.com/relation/log',
        '//config.bilibili.com/player/log',
        'api.bilibili.com/x/web-interface/popular/precious', // 首页宝箱
        'api.bilibili.com/x/click-interface/click/web/h5',
        'api.bilibili.com/x/web-interface/web/report',
        'api.bilibili.com/x/click-interface/heartbeat',
        'message.bilibili.com/api/log/upload.json', // 私信日志
    ];
    const shouldBlockUrl = createUrlMatcher(TRACKING_URLS);

    const TRACKING_LOCALSTORAGE_KEYS = [
        /^web_player_config/,
        /^__LOG.*__$/,
        /^bp_video_ep_enabled_/,
        /^bili_report/,
        /^live_bf_track_/,
        'player_last_filter_play_time',
        'bilibili_player_report_log',
        'PCDN-client-peerid',
        // 添加其他可能的追踪 LocalStorage Key
    ];
     const shouldRemoveLsKey = (key) => {
        if (!key) return false;
        for (const pattern of TRACKING_LOCALSTORAGE_KEYS) {
            if (typeof pattern === 'string') {
                if (key === pattern) return true;
            } else if (pattern instanceof RegExp) {
                if (pattern.test(key)) return true;
            }
        }
        return false;
    };

    const TRACKING_IDB_NAMES = [
        'PLAYER__LOG',
        'MIRROR_TRACK_V2',
        'pbp3',
        'BILI_MIRROR_REPORT_POOL',
        'BILI_MIRROR_RESOURCE_TIME',
        'bp_nc_loader_config',
        'reporter-pb',
        'pcdn',
        'nc_loader',
        'iconify',
        // 添加其他可能的追踪 IndexedDB Name
    ];

    const USELESS_URL_PARAMS = [
        'buvid', 'is_story_h5', 'launch_id', 'live_from', 'mid',
        'session_id', 'timestamp', 'up_id', 'vd_source',
        /^share/, /^spm/, /^from/, /^seid/, /^plat_id/,
        // 添加其他可能的追踪 URL 参数
    ];

    // ** 直播增强相关 **
    const liveCdnUrlKwFilter = createUrlMatcher(['.bilivideo.', '.m3u8', '.m4s', '.flv']); // Keep for potential future use or identifying live streams
    const LIVE_ENHANCEMENT_STYLE_ID = 'my-js-live-enhancement-styles';

    // ** P2P CDN 相关 (及新 CDN 优化常量) **
    // const rBackupCdn = /(?:up|cn-)[\w-]+\.bilivideo\.com/g; // 旧的提取备用 CDN 的正则，不再主要依赖
    const isP2PCDNOriginalMatcher = createUrlMatcher([ // 保留原始 P2P 判断，用于 P2P 功能本身
        '.mcdn.bilivideo.cn',
        '.szbdyd.com'
    ]);

    const playUrlApi = 'api.bilibili.com/x/player/wbi/playurl'; // 获取播放地址的 API

    // 新增：CDN 优化相关常量 (移植自 1.txt)
    const VOD_ORIGIN_ALI = "ali";
    const VOD_ORIGIN_COS = "cos";
    const VOD_ORIGIN_HW = "hw";
    const VOD_ORIGIN_08 = "08";
    const VOD_ORIGIN_BD = "bd";

    const VOD_MIRROR_ALI = "upos-sz-mirrorali.bilivideo.com";
    const VOD_MIRROR_COS = "upos-sz-mirrorcos.bilivideo.com";
    const VOD_MIRROR_HW = "upos-sz-mirrorhw.bilivideo.com";
    const VOD_MIRROR_08 = "upos-sz-mirror08c.bilivideo.com";
    const VOD_MIRROR_BD = "upos-sz-mirrorbd.bilivideo.com";
    const VOD_MIRROR_AKAM_OVERSEAS = "upos-hz-mirrorakam.akamaized.net"; // 海外备选

    const mirrorRegex = /https?:\/\/((upos-\S+-mirror\S+)|((upos|proxy)-tf-.*))\.(bilivideo|akamaized)\.(com|net)/;
    const mCdnTfRegex = /((([0-9]{1,3}\.){3}[0-9]{1,3})|(.*\.mcdn\.bilivideo\.(com|cn|net))):[0-9]{1,5}\/v1\/resource/;

    // 假设在中国大陆，1.txt 中 isLocatedInCn 的逻辑可以后续按需实现
    const IS_LOCATED_IN_CN = true;
    let unknownOgsCache = new Set();
    // --- 功能常量 End ---

    // 从GM_getValue获取保存的状态
    let isAdRemovalEnabled = GM_getValue('bilibiliAdRemovalEnabled', false);
    let isSwiperRemovalEnabled = GM_getValue('bilibiliSwiperRemovalEnabled', false);
    let isNonVideoCardRemovalEnabled = GM_getValue('bilibiliNonVideoCardRemovalEnabled', false);
    let isCopySuffixRemovalEnabled = GM_getValue('bilibiliCopySuffixRemovalEnabled', false);
    let isTrackingLoggingDisabled = GM_getValue('bilibiliTrackingLoggingDisabled', false);
    let isLiveEnhancementEnabled = GM_getValue('bilibiliLiveEnhancementEnabled', false);
    let isP2pCdnDisabled = GM_getValue('bilibiliP2pCdnDisabled', false);
    let isHomePageOptimizationEnabled = GM_getValue('bilibiliHomePageOptimizationEnabled', false);
    let isAv1Disabled = GM_getValue('bilibiliAv1Disabled', false);
    let isForce4kEnabled = GM_getValue('bilibiliForce4kEnabled', false);

    // 保存原始函数引用
    const originalFetch = unsafeWindow.fetch;
    const originalXhrOpen = unsafeWindow.XMLHttpRequest.prototype.open;
    const originalSendBeacon = unsafeWindow.navigator.sendBeacon;
    const originalIndexedDBOpen = unsafeWindow.indexedDB?.open;
    const originalLocalStorage = unsafeWindow.localStorage;
    const originalLsSetItem = unsafeWindow.localStorage?.setItem;
    const originalLsGetItem = unsafeWindow.localStorage?.getItem;
    const originalLsRemoveItem = unsafeWindow.localStorage?.removeItem;
    const originalLsClear = unsafeWindow.localStorage?.clear;
    const originalLsKey = unsafeWindow.localStorage?.key;
    const originalHistoryPushState = unsafeWindow.history.pushState;
    const originalHistoryReplaceState = unsafeWindow.history.replaceState;

    // 新增：保存 AV1 相关原始方法
    const originalHTMLMediaElement = unsafeWindow.HTMLMediaElement;
    const originalMediaSource = unsafeWindow.MediaSource;
    const originalCanPlayType = originalHTMLMediaElement?.prototype?.canPlayType;
    const originalIsTypeSupported = originalMediaSource?.isTypeSupported;

    // 新增：保存 sessionStorage 相关原始方法
    const originalSessionStorage = unsafeWindow.sessionStorage;
    const originalSessionStorageGetItem = originalSessionStorage?.getItem;


    // --- P2P CDN 状态变量 (调整) ---
    let prevLocationHrefForCdnCache = ''; // 用于CDN缓存的href比较
    let intelligentCdnCache = []; // 新的智能 CDN 缓存池，存储优质 CDN (如 Mirror) 的 host
    const DEFAULT_MIRROR_CDN = VOD_MIRROR_COS; // 默认使用的 Mirror CDN

    // 保存 P2P/WebRTC 相关原始引用
    const originalHtmlMediaSrcDescriptor = Object.getOwnPropertyDescriptor(unsafeWindow.HTMLMediaElement.prototype, 'src');
    const originalRTCPeerConnection = unsafeWindow.RTCPeerConnection;
    const originalWebkitRTCPeerConnection = unsafeWindow.webkitRTCPeerConnection;
    const originalMozRTCPeerConnection = unsafeWindow.mozRTCPeerConnection;
    const originalRTCDataChannel = unsafeWindow.RTCDataChannel;
    const originalWebkitRTCDataChannel = unsafeWindow.webkitRTCDataChannel;
    const originalMozRTCDataChannel = unsafeWindow.mozRTCDataChannel;
    const originalRTCSessionDescription = unsafeWindow.RTCSessionDescription;
    const noopNeverResolvedPromise = ()=> new Promise(o$1);

    // --- 直播增强状态变量 ---
    // REMOVED

    // --- 新增：CDN 优化核心逻辑 (移植并适配自 1.txt) ---

    /**
     * 检查 URL 是否为 Bilibili Mirror CDN (包括 akamaized 和 tf)
     * @param {string} urlString
     * @returns {boolean}
     */
    function isVodTypeMirror(urlString) {
        if (!urlString) return false;
        return mirrorRegex.test(urlString);
    }

    /**
     * 从 'os' 参数检测是否为海外 CDN
     * @param {string} os - 'os' URL 参数值
     * @param {string} urlString - 完整 URL 字符串
     * @returns {boolean}
     */
    function detectIfOvFromOs(os, urlString) {
        if (!os) return false;
        // 检查 host 是否包含 'cn-hk-' (针对 bcache 的海外判断)
        const detectIfOvFromBCacheHost = (host) => host && host.includes("cn-hk-");
        let host;
        try { host = new URL(urlString).hostname; } catch(e) { host = ''; }

        return os.includes("ov") || os === "akam" || (os === "bcache" && detectIfOvFromBCacheHost(host));
    }

    /**
     * 根据 'og' 参数构建新的 Mirror CDN URL (JS版 buildNewBaseUrlFromOg)
     * @param {URL} uri - 原始 URL 对象
     * @param {string} [forcedOgMirrorSuffix] - 可选，强制使用的 mirror 后缀 (如 'cos', 'ali')
     * @returns {string | null} - 新的 base URL 或 null
     */
    function buildNewBaseUrlFromOgJS(uri, forcedOgMirrorSuffix = null) {
        let newBaseUrl = null;
        if (IS_LOCATED_IN_CN) { // 假设在中国
            const og = forcedOgMirrorSuffix || uri.searchParams.get("og");
            if (og) {
                let mirrorSuffix;
                switch (og) {
                    case "hw": mirrorSuffix = "08c"; break;
                    case "cos": mirrorSuffix = "cos"; break;
                    case VOD_ORIGIN_ALI: mirrorSuffix = "ali"; break;
                    case VOD_ORIGIN_BD: mirrorSuffix = "bd"; break;
                    default:
                        if (!unknownOgsCache.has(og)) {
                            unknownOgsCache.add(og);
                            console.warn(`Tampermonkey Script "优化Bilibili" [CDN Optimize]: 未知 OG 参数 "${og}"，URL: ${uri.href}。尝试默认。`);
                            if (unknownOgsCache.size > 512) unknownOgsCache.clear();
                        }
                        if (og.startsWith("ali")) mirrorSuffix = "ali";
                        else if (og.startsWith("cos")) mirrorSuffix = "cos";
                        else if (og.startsWith("hw")) mirrorSuffix = "08c";
                        else if (og.startsWith("bd")) mirrorSuffix = "bd";
                        else mirrorSuffix = "ali"; // 默认回退
                }
                newBaseUrl = `${uri.protocol}//upos-sz-mirror${mirrorSuffix}.bilivideo.com${uri.pathname}${uri.search}`;
            }
        } else { // 非中国大陆，使用 akamaized
            newBaseUrl = `${uri.protocol}//${VOD_MIRROR_AKAM_OVERSEAS}${uri.pathname}${uri.search}`;
        }
        // 1.txt 中的 HEAD 请求验证可以后续添加，如果需要
        return newBaseUrl;
    }

    /**
     * 尝试替换海外 CDN (JS版 tryReplaceOverseaCDN)
     * @param {URL} uri - 原始 URL 对象
     * @returns {string | null} - 新的 URL 或 null
     */
    function tryReplaceOverseaCDNJS(uri) {
        // if (!Settings.ReplaceOverseaCdn()) return null; // 假设总是替换

        const os = uri.searchParams.get("os");
        if (!os) return null;

        let newAuthority = null;
        if (os.startsWith(VOD_ORIGIN_ALI)) newAuthority = VOD_MIRROR_ALI;
        else if (os.startsWith(VOD_ORIGIN_COS)) newAuthority = VOD_MIRROR_COS;
        else if (os.startsWith(VOD_ORIGIN_HW)) newAuthority = VOD_MIRROR_HW;
        else if (os.startsWith(VOD_ORIGIN_08)) newAuthority = VOD_MIRROR_08;
        else if (os.startsWith(VOD_ORIGIN_BD)) newAuthority = VOD_MIRROR_BD;
        else if (os.includes("ov")) newAuthority = VOD_MIRROR_ALI; // 默认海外用 ali mirror
        else {
            console.warn(`Tampermonkey Script "优化Bilibili" [CDN Optimize]: 替换海外 CDN 时遇到未知 os: ${os}`);
        }

        if (newAuthority) {
            return `${uri.protocol}//${newAuthority}${uri.pathname}${uri.search}`;
        }
        // 如果没有特定规则匹配，尝试基于 'og' 构建
        return buildNewBaseUrlFromOgJS(uri);
    }

    /**
     * 代理 MCDN (PCDN) URL (JS版 proxyMCdn)
     * @param {string} urlString - 原始 MCDN URL
     * @param {string} [scheme="https"] - 协议
     * @returns {string | null} - 代理后的 URL 或 null
     */
    function proxyMCdnJS(urlString, scheme = "https") {
        if (IS_LOCATED_IN_CN && mCdnTfRegex.test(urlString)) {
            // 注意：原始代码中 proxy-tf-all-ws.bilivideo.com 似乎是内部或特定用途的，
            // 公网直接使用可能无效或被限制。这里需要确认一个可用的代理服务器或策略。
            // 暂时返回一个标准的 mirror CDN 作为替代 PCDN 的方案。
            // 或者，如果B站前端JS有已知的MCDN到CDN的转换逻辑，可以模拟。
            // 作为演示，我们先尝试构建一个 mirror URL
            console.log(`Tampermonkey Script "优化Bilibili" [CDN Optimize]: 尝试代理 MCDN: ${urlString}。实际代理服务器需确认。`);
            try {
                const tempUri = new URL(urlString);
                return buildNewBaseUrlFromOgJS(tempUri, VOD_ORIGIN_COS.substring(0,3)); // 尝试用 cos mirror
            } catch(e) {
                return null;
            }
            // return `${scheme}://proxy-tf-all-ws.bilivideo.com/?url=${encodeURIComponent(urlString)}`;
        }
        return null;
    }

    /**
     * 主要的 CDN 替换函数 (JS版 tryReplaceCDN)
     * @param {string} baseUrlString - 原始基础 URL
     * @param {string[]} backupUrlStrings - 备用 URL 列表
     * @param {string} [context=''] - 调用上下文日志
     * @returns {string} - 优化后的 URL，如果无法优化则返回原始 baseUrlString
     */
    function tryReplaceCDNJS(baseUrlString, backupUrlStrings = [], context = '') {
        if (!baseUrlString) return baseUrlString;

        let baseUri;
        try {
            baseUri = new URL(baseUrlString);
        } catch (e) {
            // console.warn(`Tampermonkey Script "优化Bilibili" [CDN Optimize ${context}]: 无效的 baseUrl: ${baseUrlString}`, e);
            return baseUrlString; // 无效 URL 则返回原始
        }

        const baseUriOs = baseUri.searchParams.get("os");
        // 目前主要处理点播，直播 CDN (os 为空或特定格式) 暂不深入优化，维持P2P禁用即可
        if (!baseUriOs) {
            // console.log(`Tampermonkey Script "优化Bilibili" [CDN Optimize ${context}]: URL ${baseUrlString} 无 "os" 参数，跳过深度优化。`);
            // 对于没有 'os' 参数的 P2P CDN，简单替换
            if (isP2PCDNOriginalMatcher(baseUrlString)) {
                const defaultReplacement = `${baseUri.protocol}//${DEFAULT_MIRROR_CDN}${baseUri.pathname}${baseUri.search}`;
                console.log(`Tampermonkey Script "优化Bilibili" [CDN Optimize ${context}]: 无 "os" 的 P2P URL ${baseUrlString} 替换为 ${defaultReplacement}`);
                return defaultReplacement;
            }
            return baseUrlString;
        }

        let bestUrl = baseUrlString; // 默认最佳 URL 是原始 URL

        // 1. 优先从 backupUrls 中寻找 Mirror CDN
        const mirrorBackup = backupUrlStrings.find(isVodTypeMirror);
        if (mirrorBackup) {
            let mirrorBackupUri;
            try { mirrorBackupUri = new URL(mirrorBackup); } catch(e) { /* ignore */ }

            if (mirrorBackupUri) {
                const mirrorBackupOs = mirrorBackupUri.searchParams.get("os");
                // 如果 Mirror Backup 是海外的，也尝试替换成国内 Mirror
                if (mirrorBackupOs && detectIfOvFromOs(mirrorBackupOs, mirrorBackup)) {
                    const replacedMirror = tryReplaceOverseaCDNJS(mirrorBackupUri);
                    if (replacedMirror) {
                        bestUrl = replacedMirror;
                        console.log(`Tampermonkey Script "优化Bilibili" [CDN Optimize ${context}]: 使用替换后的海外 Mirror Backup: ${bestUrl}`);
                    } else {
                        bestUrl = mirrorBackup; // 使用原始海外 Mirror
                        console.log(`Tampermonkey Script "优化Bilibili" [CDN Optimize ${context}]: 使用海外 Mirror Backup: ${bestUrl}`);
                    }
                } else {
                    bestUrl = mirrorBackup; // 国内 Mirror Backup
                    console.log(`Tampermonkey Script "优化Bilibili" [CDN Optimize ${context}]: 使用国内 Mirror Backup: ${bestUrl}`);
                }
                // 如果已经找到了最佳的 Mirror，可以提前返回
                if (isVodTypeMirror(bestUrl) && !detectIfOvFromOs(new URL(bestUrl).searchParams.get("os"), bestUrl) ) {
                     return bestUrl;
                }
            }
        }


        // 还原 bestUrl 为 baseUrlString，因为上面的 mirrorBackup 可能是海外的，需要进一步判断
        bestUrl = baseUrlString;
        let currentBestUri = baseUri; // 当前最佳 URL 对应的 URI 对象

        // 检查当前 bestUrl (可能是原始 baseUrl，也可能是上面选的 mirrorBackup)
        const currentBestUrlOs = currentBestUri.searchParams.get("os");


        // 2. 处理 upos 和 bcache (非 PCDN)
        if ((currentBestUrlOs === "upos" || currentBestUrlOs === "bcache") && !mCdnTfRegex.test(bestUrl)) {
            if (isVodTypeMirror(bestUrl)) { // 如果已经是 mirror (比如从 backup 选的)
                 // 如果是海外 mirror，尝试转国内
                if (detectIfOvFromOs(currentBestUrlOs, bestUrl)) {
                    const replaced = tryReplaceOverseaCDNJS(currentBestUri);
                    if (replaced) {
                        console.log(`Tampermonkey Script "优化Bilibili" [CDN Optimize ${context}]: upos/bcache 海外 Mirror ${bestUrl} 替换为 ${replaced}`);
                        return replaced;
                    }
                }
                return bestUrl; // 已经是国内 mirror，直接用
            }
            // 不是 mirror，尝试从 og 构建
            const builtFromOg = buildNewBaseUrlFromOgJS(currentBestUri);
            if (builtFromOg) {
                console.log(`Tampermonkey Script "优化Bilibili" [CDN Optimize ${context}]: upos/bcache ${bestUrl} 基于 OG 替换为 ${builtFromOg}`);
                return builtFromOg;
            }
        }

        // 3. 处理 MCDN (PCDN)
        else if (currentBestUrlOs === "mcdn" || mCdnTfRegex.test(bestUrl)) {
             // 如果上面已经选了 Mirror Backup 且是国内的，就用它
            if (mirrorBackup && isVodTypeMirror(mirrorBackup) && !detectIfOvFromOs(new URL(mirrorBackup).searchParams.get("os"), mirrorBackup)) {
                console.log(`Tampermonkey Script "优化Bilibili" [CDN Optimize ${context}]: MCDN ${bestUrl} 使用优先的国内 Mirror Backup ${mirrorBackup}`);
                return mirrorBackup;
            }

            // 尝试从 backupUrls 中找 upos/bcache 并用 buildNewBaseUrlFromOgJS 转换
            for (const backupStr of backupUrlStrings) {
                try {
                    const backupUri = new URL(backupStr);
                    const backupOs = backupUri.searchParams.get("os");
                    // 确保不是 /v1/resource (来自1.txt的注释)
                    if ((backupOs === "upos" || backupOs === "bcache") && !backupUri.pathname.startsWith("/v1/resource")) {
                        const built = buildNewBaseUrlFromOgJS(backupUri);
                        if (built) {
                            console.log(`Tampermonkey Script "优化Bilibili" [CDN Optimize ${context}]: MCDN ${bestUrl} 从 Backup ${backupStr} 构建得到 ${built}`);
                            return built;
                        }
                    }
                } catch (e) { /* ignore invalid backup url */ }
            }
            // 尝试代理 MCDN (目前是返回一个mirror)
            const proxied = proxyMCdnJS(bestUrl);
            if (proxied) {
                console.log(`Tampermonkey Script "优化Bilibili" [CDN Optimize ${context}]: MCDN ${bestUrl} 代理/替换为 ${proxied}`);
                return proxied;
            }
        }

        // 4. 处理普通海外 CDN
        else if (detectIfOvFromOs(currentBestUrlOs, bestUrl)) {
            const replaced = tryReplaceOverseaCDNJS(currentBestUri);
            if (replaced) {
                console.log(`Tampermonkey Script "优化Bilibili" [CDN Optimize ${context}]: 海外 CDN ${bestUrl} 替换为 ${replaced}`);
                return replaced;
            }
        }

        // 如果所有策略都未替换，且原始 URL 是 P2P 且我们希望禁用 P2P，则给一个默认 Mirror
        if (isP2PCDNOriginalMatcher(baseUrlString) && isP2pCdnDisabled) {
            const defaultReplacement = `${baseUri.protocol}//${DEFAULT_MIRROR_CDN}${baseUri.pathname}${baseUri.search}`;
             console.log(`Tampermonkey Script "优化Bilibili" [CDN Optimize ${context}]: P2P URL ${baseUrlString} 未匹配特定规则，回退至默认 Mirror: ${defaultReplacement}`);
            return defaultReplacement;
        }

        // console.log(`Tampermonkey Script "优化Bilibili" [CDN Optimize ${context}]: URL ${baseUrlString} 无优化策略命中，返回原始。`);
        return baseUrlString; // 返回原始 URL 如果没有优化策略命中
    }

    // --- 禁用追踪与日志核心逻辑 ---
    function disableTrackingAndLogging() {
        console.log('Tampermonkey Script "优化Bilibili": 尝试应用禁用追踪与日志设置:', isTrackingLoggingDisabled); // 调试信息

        if (isTrackingLoggingDisabled) {
            // 1. 覆盖全局对象和函数
            defineReadonlyProperty(unsafeWindow.navigator, 'sendBeacon', r); // 使用返回 true 的版本，避免报错，但无效果
            const SentryHub = createMockClass('SentryHub');
            const fakeSentry = {
                SDK_NAME: 'sentry.javascript.browser', SDK_VERSION: '0.0.1',
                BrowserClient: createMockClass('Sentry.BrowserClient'), Hub: SentryHub,
                Integrations: { Vue: createMockClass('Sentry.Integrations.Vue'), GlobalHandlers: createMockClass('Sentry.Integrations.GlobalHandlers'), InboundFilters: createMockClass('Sentry.Integrations.InboundFilters') },
                init: o$1, configureScope: o$1, getCurrentHub: ()=>new SentryHub(), setContext: o$1, setExtra: o$1, setExtras: o$1, setTag: o$1, setTags: o$1, setUser: o$1, wrap: o$1
            };
            defineReadonlyProperty(unsafeWindow, 'Sentry', fakeSentry);
            defineReadonlyProperty(unsafeWindow, 'MReporter', createMockClass('MReporter'));
            defineReadonlyProperty(unsafeWindow, 'ReporterPb', createMockClass('ReporterPb'));
            defineReadonlyProperty(unsafeWindow, '__biliUserFp__', { init: o$1, queryUserLog: () => [] });
            defineReadonlyProperty(unsafeWindow, '__USER_FP_CONFIG__', undefined);
            defineReadonlyProperty(unsafeWindow, '__MIRROR_CONFIG__', undefined);
            defineReadonlyProperty(unsafeWindow, 'heimdallTrack', o$1); // 屏蔽首页心跳上报

            // 2. 拦截 fetch (移至 updateNetworkInterceptors 和 masterFetchOverride)
            // 3. 拦截 XMLHttpRequest (移至 updateNetworkInterceptors 和 masterXhrOpenOverride)

            // 4. 拦截 IndexedDB
            if (originalIndexedDBOpen) {
                unsafeWindow.indexedDB.open = function(name, version) {
                    if (TRACKING_IDB_NAMES.includes(name)) {
                        console.log('Tampermonkey Script "优化Bilibili": 阻止 IndexedDB 打开:', name);
                        // 返回一个立即失败的请求
                        const dummyRequest = {};
                        setTimeout(() => {
                            const event = new Event('error', { bubbles: true });
                            Object.defineProperty(event, 'target', { value: { error: new DOMException('Blocked by userscript', 'AbortError') } });
                            if (typeof dummyRequest.onerror === 'function') {
                                dummyRequest.onerror(event);
                            }
                        }, 0);
                        return dummyRequest; // 返回一个空对象模拟 IDBOpenDBRequest
                    }
                    return originalIndexedDBOpen.apply(this, arguments);
                };
                // 尝试删除已存在的追踪数据库
                TRACKING_IDB_NAMES.forEach(name => {
                    try {
                        const req = unsafeWindow.indexedDB.deleteDatabase(name);
                         req.onsuccess = () => console.log(`Tampermonkey Script "优化Bilibili": IndexedDB ${name} 已删除 (或不存在).`);
                         req.onerror = (e) => console.warn(`Tampermonkey Script "优化Bilibili": 删除 IndexedDB ${name} 失败:`, e);
                    } catch (e) {
                        console.warn(`Tampermonkey Script "优化Bilibili": 删除 IndexedDB ${name} 时出错:`, e);
                    }
                });
            }

            // 5. 拦截 localStorage (只读，防止写入追踪数据，不影响读取正常数据)
            if (originalLsSetItem) {
                unsafeWindow.localStorage.setItem = function(key, value) {
                    if (shouldRemoveLsKey(key)) {
                        console.log('Tampermonkey Script "优化Bilibili": 阻止 localStorage 写入:', key);
                        return; // 阻止写入
                    }
                    return originalLsSetItem.apply(this, arguments);
                };
            }
             if (originalLsRemoveItem) {
                unsafeWindow.localStorage.removeItem = function(key) {
                     if (shouldRemoveLsKey(key)) {
                         console.log('Tampermonkey Script "优化Bilibili": 阻止 localStorage 删除 (但也模拟删除):', key);
                         return; // 假装删除，但不真删，防止脚本逻辑出错
                     }
                     return originalLsRemoveItem.apply(this, arguments);
                };
            }
            // 清理已存在的追踪 localStorage
            try {
                 for (let i = originalLocalStorage.length - 1; i >= 0; i--) {
                     const key = originalLsKey.call(originalLocalStorage, i);
                     if (shouldRemoveLsKey(key)) {
                         console.log('Tampermonkey Script "优化Bilibili": 清理 localStorage:', key);
                         originalLsRemoveItem.call(originalLocalStorage, key);
                     }
                 }
            } catch (e) {
                 console.warn('Tampermonkey Script "优化Bilibili": 清理 localStorage 时出错:', e);
            }


            // 6. 清理 URL 参数
            unsafeWindow.history.pushState = function(state, unused, url) {
                return originalHistoryPushState.call(this, state, unused, removeUselessUrlParams(url));
            };
            unsafeWindow.history.replaceState = function(state, unused, url) {
                return originalHistoryReplaceState.call(this, state, unused, removeUselessUrlParams(url));
            };
            // 初始清理一次当前 URL
            const currentCleanedUrl = removeUselessUrlParams(window.location.href);
            if (window.location.href !== currentCleanedUrl) {
                originalHistoryReplaceState.call(window.history, window.history.state, '', currentCleanedUrl);
                console.log('Tampermonkey Script "优化Bilibili": 初始清理 URL 参数');
            }

        } else {
            // 恢复原始函数 (如果可能且安全)
            // 注意：恢复 prototype 上的修改可能影响其他脚本，通常需要刷新页面
            // unsafeWindow.fetch = originalFetch; // 由 updateNetworkInterceptors 处理
            // unsafeWindow.XMLHttpRequest.prototype.open = originalXhrOpen; // 由 updateNetworkInterceptors 处理
            unsafeWindow.navigator.sendBeacon = originalSendBeacon;
            if (originalIndexedDBOpen) unsafeWindow.indexedDB.open = originalIndexedDBOpen;
             if (originalLsSetItem) unsafeWindow.localStorage.setItem = originalLsSetItem;
             if (originalLsRemoveItem) unsafeWindow.localStorage.removeItem = originalLsRemoveItem;
            unsafeWindow.history.pushState = originalHistoryPushState;
            unsafeWindow.history.replaceState = originalHistoryReplaceState;
            // Mock 的全局变量无法安全地"恢复"，因为原始对象可能已被修改或不存在
            console.log('Tampermonkey Script "优化Bilibili": 尝试恢复原始追踪功能 (部分功能可能需要刷新页面生效)。');
        }
        // 应用更改后更新网络拦截器
        updateNetworkInterceptors();
    }


    // --- 禁用 P2P CDN 和 WebRTC 核心逻辑 ---
    // 旧的 getCDNDomain 和 replaceP2P 不再是 CDN 优化的主要逻辑，但 replaceP2P 可能仍用于 HTMLMediaElement.src 的简单P2P替换
    // getCDNDomain 不再需要主动从 head 提取， intelligentCdnCache 将从 playUrlApi 更新
    function getFallbackCdnDomain() {
        if (intelligentCdnCache.length > 0) {
            // 优先用缓存中的 Mirror CDN
            return intelligentCdnCache[Math.floor(Math.random() * intelligentCdnCache.length)];
        }
        // console.warn('Tampermonkey Script "优化Bilibili" [CDN Fallback]: intelligentCdnCache 为空, 使用硬编码默认值.');
        return DEFAULT_MIRROR_CDN; // 默认备用 CDN
    }

    // replaceP2P 函数现在主要用于非常直接的 P2P 地址替换，例如在 HTMLMediaElement.src setter 中
    // 更复杂的 CDN 选择逻辑在 tryReplaceCDNJS 中
    function simpleReplaceP2PUrl(url, meta = '') {
        try {
            let urlString = '';
            let originalUrl = url; // 保存原始输入以在返回时保持类型
            let parsedUrl;

            if (typeof url === 'string') {
                urlString = url;
                // 增加对mcdn.bilivideo的直接处理
                if (urlString.includes('.mcdn.bilivideo')) {
                    return forceMcdnReplace(urlString);
                }
                // 原有P2P检测逻辑
                if (!isP2PCDNOriginalMatcher(urlString)) return url;
                if (urlString.startsWith('//')) urlString = (unsafeWindow.location.protocol || 'https:') + urlString;
                try { parsedUrl = new URL(urlString); } catch { return originalUrl; }
            } else if (url instanceof URL) {
                parsedUrl = url;
                urlString = url.href;
                // 增加对mcdn.bilivideo的直接处理
                if (urlString.includes('.mcdn.bilivideo')) {
                    const replaced = forceMcdnReplace(urlString);
                    if (replaced !== urlString) {
                        try {
                            return new URL(replaced);
                        } catch {
                            return originalUrl;
                        }
                    }
                }
                if (!isP2PCDNOriginalMatcher(urlString)) return url;
            } else {
                return originalUrl;
            }

            const hostname = parsedUrl.hostname;
            let replaced = false;

            if (hostname.endsWith('.mcdn.bilivideo.cn') || hostname.endsWith('.szbdyd.com')) {
                // 对于这两种已知的 P2P CDN，直接替换为智能缓存或默认的 Mirror CDN
                // .szbdyd.com 的 xy_usource 逻辑可以被更通用的 Mirror 替换覆盖
                const cdn = getFallbackCdnDomain(); // 获取一个备选的 Mirror CDN host
                parsedUrl.hostname = cdn;
                parsedUrl.protocol = 'https:'; // 强制 HTTPS
                parsedUrl.port = ''; // 清除端口号，HTTPS 默认443
                // 移除可能导致问题的特定 P2P 查询参数 (如果已知)
                // parsedUrl.searchParams.delete('xy_usource');
                console.log(`Tampermonkey Script "优化Bilibili" [Simple P2P Replace - ${meta}]: URL 替换: ${hostname} -> ${cdn}`);
                replaced = true;
            }

            return replaced ? (typeof originalUrl === 'string' ? parsedUrl.href : parsedUrl) : originalUrl;

        } catch (e) {
            console.error(`Tampermonkey Script "优化Bilibili" [Simple P2P Replace - ${meta}]: 替换 P2P URL (${url}) 时出错:`, e);
            return url instanceof URL ? url.href : url;
        }
    }


    // 应用/移除 P2P 和 WebRTC 禁用逻辑
    function disableP2pCdnAndWebRTC(disable) {
        console.log('Tampermonkey Script "优化Bilibili": 应用 P2P/WebRTC 禁用设置:', disable);
        if (disable) {
            // 1. Mock P2P 相关对象
            defineReadonlyProperty(unsafeWindow, 'PCDNLoader', class MockPCDNLoader {});
            defineReadonlyProperty(unsafeWindow, 'BPP2PSDK', class MockBPP2PSDK { on = o$1; });
            defineReadonlyProperty(unsafeWindow, 'SeederSDK', class MockSeederSDK {});

            // 2. Mock WebRTC 相关对象
             class MockDataChannel {
                close = o$1; send = o$1; addEventListener = o$1; removeEventListener = o$1;
                onbufferedamountlow = null; onclose = null; onerror = null; onmessage = null;
                toString() { return '[object RTCDataChannel]'; }
            }
             class MockRTCSessionDescription {
                type; sdp;
                constructor(init){ this.type = init?.type; this.sdp = init?.sdp || ''; }
                toJSON() { return { type: this.type, sdp: this.sdp }; }
                toString() { return '[object RTCSessionDescription]'; }
            }
             const mockedRtcSessionDescription = new MockRTCSessionDescription({ type: 'offer', sdp: '' });
             class MockRTCPeerConnection {
                close = o$1; createOffer = noopNeverResolvedPromise; setLocalDescription = o$1; setRemoteDescription = o$1;
                addEventListener = o$1; removeEventListener = o$1; addIceCandidate = o$1; setConfiguration = o$1;
                get localDescription() { return mockedRtcSessionDescription; }
                createAnswer = noopNeverResolvedPromise; onicecandidate = null; createDataChannel = ()=> new MockDataChannel();
                toString() { return '[object RTCPeerConnection]'; }
            }

             if (originalRTCPeerConnection) defineReadonlyProperty(unsafeWindow, 'RTCPeerConnection', MockRTCPeerConnection);
             if (originalWebkitRTCPeerConnection) defineReadonlyProperty(unsafeWindow, 'webkitRTCPeerConnection', MockRTCPeerConnection);
             if (originalMozRTCPeerConnection) defineReadonlyProperty(unsafeWindow, 'mozRTCPeerConnection', MockRTCPeerConnection);
             if (originalRTCDataChannel) defineReadonlyProperty(unsafeWindow, 'RTCDataChannel', MockDataChannel);
             if (originalWebkitRTCDataChannel) defineReadonlyProperty(unsafeWindow, 'webkitRTCDataChannel', MockDataChannel);
             if (originalMozRTCDataChannel) defineReadonlyProperty(unsafeWindow, 'mozRTCDataChannel', MockDataChannel);
             if (originalRTCSessionDescription) defineReadonlyProperty(unsafeWindow, 'RTCSessionDescription', MockRTCSessionDescription);


            // 3. Patch HTMLMediaElement.prototype.src
            if (originalHtmlMediaSrcDescriptor) {
                Object.defineProperty(unsafeWindow.HTMLMediaElement.prototype, 'src', {
                    ...originalHtmlMediaSrcDescriptor,
                    set (value) {
                        let newValue = value;
                        try {
                            // 当 P2P 禁用时，对于 src 的设置，我们只简单替换已知的 P2P URL
                            // 复杂的 CDN 选择在 XHR/Fetch 层面处理 PlayURL 响应
                            if (typeof value === 'string' && isP2PCDNOriginalMatcher(value)) {
                                newValue = simpleReplaceP2PUrl(value, 'HTMLMediaElement.src');
                            } else {
                                // 如果不是 P2P URL，但 P2P 禁用开启，理论上它应该是已经优化过的 URL
                                // 或者，如果它是未经优化的非P2P URL，我们在这里没有足够上下文（如backupUrls）做完整 tryReplaceCDNJS
                                // 维持原样，依赖网络拦截的优化。
                            }
                        } catch (e) {
                             console.error('Tampermonkey Script "优化Bilibili" [P2P Disable]: 处理 HTMLMediaElement.src setter 时出错', e, { value });
                        }
                        originalHtmlMediaSrcDescriptor.set?.call(this, newValue);
                    }
                });
            }
        } else {
            // 恢复原始对象/方法 (如果可能且安全)
            // ... (恢复逻辑保持不变) ...
            if (originalHtmlMediaSrcDescriptor) Object.defineProperty(unsafeWindow.HTMLMediaElement.prototype, 'src', originalHtmlMediaSrcDescriptor);
             if (originalRTCPeerConnection) unsafeWindow.RTCPeerConnection = originalRTCPeerConnection;
             if (originalWebkitRTCPeerConnection) unsafeWindow.webkitRTCPeerConnection = originalWebkitRTCPeerConnection;
             if (originalMozRTCPeerConnection) unsafeWindow.mozRTCPeerConnection = originalMozRTCPeerConnection;
             if (originalRTCDataChannel) unsafeWindow.RTCDataChannel = originalRTCDataChannel;
             if (originalWebkitRTCDataChannel) unsafeWindow.webkitRTCDataChannel = originalWebkitRTCDataChannel;
             if (originalMozRTCDataChannel) unsafeWindow.mozRTCDataChannel = originalMozRTCDataChannel;
             if (originalRTCSessionDescription) unsafeWindow.RTCSessionDescription = originalRTCSessionDescription;
            console.log('Tampermonkey Script "优化Bilibili": 尝试恢复 P2P/WebRTC 功能 (可能需要刷新页面生效)。');
        }
         // 应用更改后更新网络拦截器
        updateNetworkInterceptors();
    }

    // --- 直播增强核心逻辑 ---
    // ... (保持不变, 因为已移除了画质强制部分) ...
    function applyLiveEnhancements(enabled) {
        console.log('Tampermonkey Script "优化Bilibili": 应用直播增强设置:', enabled);
        const styleElement = document.getElementById(LIVE_ENHANCEMENT_STYLE_ID);

        if (enabled && window.location.hostname === 'live.bilibili.com') { // 只在直播页启用
            if (!styleElement) {
                const newStyle = document.createElement('style');
                newStyle.id = LIVE_ENHANCEMENT_STYLE_ID;
                newStyle.textContent = `
                    /* 修复播放器遮挡 */
                    div[data-cy=EvaRenderer_LayerWrapper]:has(.player) { z-index: 999999 !important; }
                    /* 隐藏欢迎横幅和房间状态图标 */
                    #welcome-area-bottom-vm, .web-player-icon-roomStatus { display: none !important; }
                `;
                 (document.head || document.documentElement).appendChild(newStyle);
            }
        } else {
            if (styleElement) {
                styleElement.remove();
            }
        }
        updateNetworkInterceptors();
    }

    // --- URL 参数清理 ---
    // ... (保持不变) ...
    function removeUselessUrlParams(url) {
        if (!url) return url;
        try {
            let urlObj;
            if (typeof url === 'string') {
                 try {
                     urlObj = new URL(url);
                 } catch (e) {
                     if (url.startsWith('/')) {
                         urlObj = new URL(url, window.location.origin);
                     } else {
                          console.warn('Tampermonkey Script "优化Bilibili": 无法解析 URL:', url, e);
                          return url;
                     }
                 }
            } else if (url instanceof URL) {
                urlObj = url;
            } else {
                console.warn('Tampermonkey Script "优化Bilibili": 无效的 URL 类型:', url);
                return url instanceof URL ? url.href : url; // 返回原始输入
            }

            if (!urlObj.search) return urlObj.href; // 没有参数，直接返回

            const params = urlObj.searchParams;
            const keysToRemove = [];
            for (const key of params.keys()) {
                for (const pattern of USELESS_URL_PARAMS) {
                    if (typeof pattern === 'string') {
                        if (key === pattern) {
                            keysToRemove.push(key);
                            break;
                        }
                    } else if (pattern instanceof RegExp) {
                        if (pattern.test(key)) {
                            keysToRemove.push(key);
                            break;
                        }
                    }
                }
            }

            if (keysToRemove.length > 0) {
                 keysToRemove.forEach(key => params.delete(key));
                 return urlObj.href;
            } else {
                 return urlObj.href; // 没有需要移除的参数
            }

        } catch (e) {
            console.error('Tampermonkey Script "优化Bilibili": 清理 URL 参数时出错:', e, 'URL:', url);
            return url instanceof URL ? url.href : url; // 出错时返回原始 URL
        }
    }

    // --- 网络请求拦截 (重点修改) ---

    // ** Master Fetch Override **
    async function masterFetchOverride(...fetchArgsInput) {
        let fetchArgs = [...fetchArgsInput]; // 可变副本

        // 1. CDN 优化 (Before Fetch, 主要针对直接请求媒体片段的P2P URL)
        if (isP2pCdnDisabled) {
            try {
                let input = fetchArgs[0];
                let originalInputUrl = getUrlFromRequest(input);

                // 新增：最高优先级处理 mcdn URL
                if (originalInputUrl && originalInputUrl.includes('.mcdn.bilivideo')) {
                    const replacedUrl = forceMcdnReplace(originalInputUrl);
                    if (replacedUrl !== originalInputUrl) {
                        if (typeof input === 'string' || input instanceof URL) {
                            fetchArgs[0] = replacedUrl;
                        } else if (input instanceof Request) {
                            fetchArgs[0] = new Request(replacedUrl, {
                                method: input.method, headers: input.headers, body: input.body,
                                mode: input.mode, credentials: input.credentials, cache: input.cache,
                                redirect: input.redirect, referrer: input.referrer, integrity: input.integrity,
                            });
                        }
                        console.log(`Tampermonkey Script "优化Bilibili" [Fetch MCDN]: 强力替换成功: ${originalInputUrl} -> ${replacedUrl}`);
                    }
                }

                // 原有P2P处理逻辑继续...
                if (originalInputUrl && isP2PCDNOriginalMatcher(originalInputUrl)) {
                    // ... 原有代码 ...
                }

            } catch (e) {
                console.error('Tampermonkey Script "优化Bilibili" [Fetch CDN]: 处理 Fetch URL 时出错', e);
            }
        }

        // 2. 禁用追踪 (Before Fetch)
        if (isTrackingLoggingDisabled) {
            const urlForTracking = getUrlFromRequest(fetchArgs[0]);
            if (typeof urlForTracking === 'string' && shouldBlockUrl(urlForTracking)) {
                console.log('Tampermonkey Script "优化Bilibili" [Tracking Disable]: 阻止 Fetch 请求:', urlForTracking);
                return Promise.resolve(new Response(null, { status: 204, statusText: 'No Content (Blocked by My.js)' }));
            }
        }

        // 3. 执行 Fetch
        try {
            const response = await originalFetch.apply(this, fetchArgs);

            // 4. PlayURL API 响应处理 (如果播放器用 fetch 请求 PlayURL API)
            // 通常 PlayURL API 是 XHR，但以防万一
            const responseUrl = response.url;
            if (isP2pCdnDisabled && responseUrl && responseUrl.includes(playUrlApi) && response.ok) {
                console.log('Tampermonkey Script "优化Bilibili" [Fetch CDN]: 检测到 PlayURL API 响应 (via Fetch)');
                try {
                    const responseCloneForParsing = response.clone(); // 克隆响应以读取内容
                    const jsonData = await responseCloneForParsing.json();
                    const originalJsonString = JSON.stringify(jsonData); // 保存原始JSON字符串用于比较

                    function processStreamData(streamData) {
                        if (Array.isArray(streamData)) {
                            streamData.forEach(stream => {
                                if (stream && (stream.baseUrl || stream.base_url || stream.url)) {
                                    const currentBaseUrl = stream.baseUrl || stream.base_url || stream.url;
                                    const currentBackupUrls = stream.backupUrl || stream.backup_url || [];
                                    const newUrl = tryReplaceCDNJS(currentBaseUrl, currentBackupUrls, 'Fetch PlayURL API');
                                    if (newUrl !== currentBaseUrl) {
                                        if (stream.baseUrl) stream.baseUrl = newUrl;
                                        if (stream.base_url) stream.base_url = newUrl;
                                        if (stream.url) stream.url = newUrl;
                                    }
                                    // 更新 intelligentCdnCache
                                    if (newUrl && isVodTypeMirror(newUrl)) intelligentCdnCache.push(new URL(newUrl).hostname);
                                    currentBackupUrls.forEach(bu => {
                                        if (bu && isVodTypeMirror(bu)) intelligentCdnCache.push(new URL(bu).hostname);
                                    });
                                }
                            });
                        }
                    }

                    if (jsonData?.data?.dash) {
                        processStreamData(jsonData.data.dash.video);
                        processStreamData(jsonData.data.dash.audio);
                    }
                    if (jsonData?.data?.durl) { // 处理 durl 格式
                         processStreamData(jsonData.data.durl);
                    }
                    // 去重 intelligentCdnCache
                    if (intelligentCdnCache.length > 0) {
                        intelligentCdnCache = [...new Set(intelligentCdnCache)];
                        // console.log('Tampermonkey Script "优化Bilibili" [Fetch CDN]: intelligentCdnCache 更新:', intelligentCdnCache);
                    }


                    const modifiedJsonString = JSON.stringify(jsonData);
                    if (modifiedJsonString !== originalJsonString) {
                        console.log('Tampermonkey Script "优化Bilibili" [Fetch CDN]: PlayURL API (Fetch) 响应已修改。');
                        // 返回修改后的响应。需要创建一个新的 Response 对象，因为原始 response body 已经读过（或即将被读）
                        return new Response(modifiedJsonString, {
                            status: response.status,
                            statusText: response.statusText,
                            headers: response.headers, // 保留原始头
                        });
                    }
                } catch (e) {
                     console.error('Tampermonkey Script "优化Bilibili" [Fetch CDN]: 解析或修改 PlayURL (Fetch) 响应时出错:', e);
                }
            }
            return response; // 返回最终响应

        } catch (error) {
            console.error('Tampermonkey Script "优化Bilibili": Fetch 执行出错:', error, 'URL:', getUrlFromRequest(fetchArgs[0]));
            throw error; // 重新抛出错误
        }
    }

     // ** Master XHR Open & Response Override **
     function masterXhrOpenOverride(...args) {
         let xhrArgs = [...args];
         let blockXhr = false;
         let url = xhrArgs[1]; // URL 可能为 string 或 URL object
         const originalUrlString = typeof url === 'string' ? url : (url?.toString() || '');

         // 新增：最高优先级处理 mcdn URL
         if (isP2pCdnDisabled && typeof url === 'string' && url.includes('.mcdn.bilivideo')) {
             const replacedUrl = forceMcdnReplace(url);
             if (replacedUrl !== url) {
                 xhrArgs[1] = replacedUrl;
                 url = replacedUrl;
                 console.log(`Tampermonkey Script "优化Bilibili" [XHR MCDN]: 强力替换成功: ${url}`);
             }
         }

         const isPlayUrlApiRequest = originalUrlString.includes(playUrlApi);
         const xhrInstance = this; // 保存 XHR 实例的引用
         let originalUserOnReadyStateChange = xhrInstance.onreadystatechange;

         if (isP2pCdnDisabled && isPlayUrlApiRequest) {
             // console.log(`Tampermonkey Script "优化Bilibili" [XHR CDN]: Attaching onreadystatechange for PlayURL API: ${originalUrlString}`);
             xhrInstance.onreadystatechange = function (event) {
                 if (typeof originalUserOnReadyStateChange === 'function') {
                     try {
                         originalUserOnReadyStateChange.apply(xhrInstance, arguments);
             } catch (e) {
                         console.error('Tampermonkey Script "优化Bilibili" [XHR CDN]: Error in originalUserOnReadyStateChange for PlayURL API', e);
                     }
                 }

                 if (xhrInstance.readyState === 4 && xhrInstance.status === 200 && !xhrInstance._cdnProcessed) {
                     xhrInstance._cdnProcessed = true; // 确保只处理一次
                     // console.log('Tampermonkey Script "优化Bilibili" [XHR CDN]: PlayURL API (XHR) readyState 4, status 200. Processing...');
                     try {
                         let responseTextValue = xhrInstance.responseText; // 获取此时真实的 responseText
                         if (responseTextValue) {
                             const jsonData = JSON.parse(responseTextValue);
                             const originalJsonResponseText = JSON.stringify(jsonData);

                             function processStreamData(streamData, context) {
                                 if (Array.isArray(streamData)) {
                                     streamData.forEach(stream => {
                                         if (stream && (stream.baseUrl || stream.base_url || stream.url)) {
                                             const currentBaseUrl = stream.baseUrl || stream.base_url || stream.url;
                                             const currentBackupUrls = Array.isArray(stream.backupUrl) ? stream.backupUrl :
                                                                       Array.isArray(stream.backup_url) ? stream.backup_url : [];
                                             const newUrl = tryReplaceCDNJS(currentBaseUrl, currentBackupUrls, context);
                                             if (newUrl !== currentBaseUrl) {
                                                 if (stream.baseUrl) stream.baseUrl = newUrl;
                                                 if (stream.base_url) stream.base_url = newUrl;
                                                 if (stream.url) stream.url = newUrl;
                                             }
                                             try {
                                                 if (newUrl && isVodTypeMirror(newUrl)) intelligentCdnCache.push(new URL(newUrl).hostname);
                                                 currentBackupUrls.forEach(bu => {
                                                     if (bu && isVodTypeMirror(bu)) intelligentCdnCache.push(new URL(bu).hostname);
                                                 });
                                             } catch (e) { /* ignore */ }
                                         }
                                     });
                                 }
                             }

                             if (jsonData?.data?.dash) {
                                 processStreamData(jsonData.data.dash.video, 'XHR PlayURL API - Video');
                                 processStreamData(jsonData.data.dash.audio, 'XHR PlayURL API - Audio');
                             }
                             if (jsonData?.data?.durl) {
                                 processStreamData(jsonData.data.durl, 'XHR PlayURL API - Durl');
                             }

                             if (intelligentCdnCache.length > 0) {
                                 intelligentCdnCache = [...new Set(intelligentCdnCache)];
                                 if (prevLocationHrefForCdnCache !== unsafeWindow.location.href) {
                                     prevLocationHrefForCdnCache = unsafeWindow.location.href;
                                 }
                             }

                             const modifiedJsonString = JSON.stringify(jsonData);
                             if (modifiedJsonString !== originalJsonResponseText) {
                                 // console.log('Tampermonkey Script "优化Bilibili" [XHR CDN]: PlayURL API (XHR) response JSON modified.');
                                 xhrInstance._finalResponseText = modifiedJsonString;
                                 xhrInstance._finalResponseJson = jsonData;

                                 Object.defineProperty(xhrInstance, 'responseText', {
                                     get: function() { return this._finalResponseText; },
                                     configurable: true
                                 });
                                 Object.defineProperty(xhrInstance, 'response', {
                                     get: function() {
                                         if (this.responseType === 'json' || (!this.responseType && typeof this._finalResponseJson !== 'undefined')) {
                                             return this._finalResponseJson;
                                         }
                                         return this._finalResponseText;
                                     },
                                     configurable: true
                                 });
                                 console.log('Tampermonkey Script "优化Bilibili" [XHR CDN]: responseText/response getters redefined for PlayURL API.');
                             } else {
                                //  console.log('Tampermonkey Script "优化Bilibili" [XHR CDN]: PlayURL API (XHR) response JSON not modified.');
                                  }
                              }
                          } catch (e) {
                         console.error('Tampermonkey Script "优化Bilibili" [XHR CDN]: Error processing PlayURL (XHR) response:', e, { responseText: xhrInstance.responseText_});
                     }
                 }
             };
         }

         // --- Before Open Phase (CDN 和 Tracking) ---
         if (isP2pCdnDisabled && !isPlayUrlApiRequest && typeof url === 'string' && isP2PCDNOriginalMatcher(url)) {
             try {
                 const replacedUrl = tryReplaceCDNJS(url, [], 'XHR Open P2P');
                 if (replacedUrl !== url) {
                     xhrArgs[1] = replacedUrl;
                 }
             } catch (e) {
                  console.error('Tampermonkey Script "优化Bilibili" [XHR CDN]: Error processing XHR Open URL for P2P', e, { xhrUrl: url });
             }
             url = xhrArgs[1];
         }

         // 在上面代码后添加：直接处理任何包含mcdn的URL，确保无漏网之鱼
         if (isP2pCdnDisabled && !isPlayUrlApiRequest && typeof url === 'string' && url.includes('.mcdn.bilivideo')) {
             console.log(`Tampermonkey Script "优化Bilibili" [XHR Extra]: 检测到直接的mcdn请求: ${url}`);
             try {
                 // 尝试使用默认Mirror替换
                 const cdnHost = getFallbackCdnDomain();
                 const mcdnPattern = /(https?:\/\/)([\w.-]+)(\.mcdn\.bilivideo\.[a-z]+)(.*)/i;
                 const replacedUrl = url.replace(mcdnPattern, `$1${cdnHost}$4`);

                 if (replacedUrl !== url) {
                     console.log(`Tampermonkey Script "优化Bilibili" [XHR Extra]: 已替换MCDN: ${url} -> ${replacedUrl}`);
                     xhrArgs[1] = replacedUrl;
                 }
             } catch (e) {
                 console.error('Tampermonkey Script "优化Bilibili" [XHR Extra]: 处理MCDN URL出错', e);
             }
             url = xhrArgs[1];
         }

         if (isTrackingLoggingDisabled) {
             let urlForTracking = typeof url === 'string' ? url : (url?.toString() || '');
             if (shouldBlockUrl(urlForTracking)) {
                 blockXhr = true;
             }
         }

         if (blockXhr) {
             Object.defineProperty(this, 'send', { value: o$1, writable: false, configurable: true });
             Object.defineProperty(this, 'setRequestHeader', { value: o$1, writable: false, configurable: true });
             try {
                 originalXhrOpen.call(this, xhrArgs[0], 'about:blank', ...(xhrArgs.slice(2)));
             } catch (e) { console.warn("Error blocking XHR open:", e); }
             return;
         } else {
             return originalXhrOpen.apply(this, xhrArgs);
         }
     }

    // --- 更新网络拦截器状态 ---
    function updateNetworkInterceptors() {
        // 确定是否需要拦截 fetch (追踪、P2P CDN优化)
        const needsFetchOverride = isTrackingLoggingDisabled || isP2pCdnDisabled;
        // 确定是否需要拦截 XHR (追踪、P2P CDN优化 - 因为需要处理响应)
        const needsXhrOverride = isTrackingLoggingDisabled || isP2pCdnDisabled;

        if (needsFetchOverride && unsafeWindow.fetch !== masterFetchOverride) {
            console.log('Tampermonkey Script "优化Bilibili": 应用 Fetch 拦截器');
            unsafeWindow.fetch = masterFetchOverride;
        } else if (!needsFetchOverride && unsafeWindow.fetch === masterFetchOverride) {
            console.log('Tampermonkey Script "优化Bilibili": 恢复原始 Fetch');
            unsafeWindow.fetch = originalFetch;
        }

         if (needsXhrOverride && unsafeWindow.XMLHttpRequest.prototype.open !== masterXhrOpenOverride) {
            console.log('Tampermonkey Script "优化Bilibili": 应用 XHR Open 拦截器');
            unsafeWindow.XMLHttpRequest.prototype.open = masterXhrOpenOverride;
        } else if (!needsXhrOverride && unsafeWindow.XMLHttpRequest.prototype.open === masterXhrOpenOverride) {
             console.log('Tampermonkey Script "优化Bilibili": 恢复原始 XHR Open');
             unsafeWindow.XMLHttpRequest.prototype.open = originalXhrOpen;
         }
    }
    // ---- 初始执行 功能应用 和 网络拦截更新 ----
    disableTrackingAndLogging(); // 应用追踪设置 (除网络拦截)
    disableP2pCdnAndWebRTC(isP2pCdnDisabled); // 应用 P2P/WebRTC 设置 (除网络拦截), 这会调用 updateNetworkInterceptors
    applyLiveEnhancements(isLiveEnhancementEnabled); // 应用直播设置 (除网络拦截), 这会调用 updateNetworkInterceptors
    applyAv1Disable(isAv1Disabled); // 新增：应用 AV1 禁用设置
    applyForce4k(isForce4kEnabled); // 新增：应用强制4K设置
    // updateNetworkInterceptors(); // 在上述函数内部各自调用，确保顺序正确

    // 添加：强制立即注入加速函数，特别是XMLHttpRequest拦截器
    // 不等待页面加载或其他依赖，确保最早拦截到视频请求
    (function forceEarlyInit() {
        // 立即注入视频元素拦截
        interceptVideoElements();

        // 立即给document添加早期监听，确保在页面加载过程中就能捕获视频元素
        if (document.readyState === 'loading' || document.readyState === 'interactive') {
            // 在DOM尚未完全加载时，对每个新添加的节点立即进行检查
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeName === 'VIDEO' || node.nodeName === 'AUDIO') {
                            // 即刻添加监听器
                            node.addEventListener('loadstart', () => {
                                if (node.src && node.src.includes('.mcdn.bilivideo')) {
                                    const newSrc = forceMcdnReplace(node.src);
                                    if (newSrc !== node.src) {
                                        console.log(`Tampermonkey Script "优化Bilibili" [早期DOM监听]: 替换src: ${node.src} -> ${newSrc}`);
                                        node.src = newSrc;
                                    }
                                }
                            }, true);

                            // 立即检查当前src
                            if (node.src && node.src.includes('.mcdn.bilivideo')) {
                                const newSrc = forceMcdnReplace(node.src);
                                if (newSrc !== node.src) {
                                    console.log(`Tampermonkey Script "优化Bilibili" [早期DOM监听]: 直接替换src: ${node.src} -> ${newSrc}`);
                                    node.src = newSrc;
                                }
                            }
                        }
                    });
                });
            });
            observer.observe(document, { childList: true, subtree: true });
            console.log('Tampermonkey Script "优化Bilibili": 早期DOM监听已启动');
        }

        // 强制重新应用XHR和fetch拦截
        unsafeWindow.XMLHttpRequest.prototype.open = masterXhrOpenOverride;
        unsafeWindow.fetch = masterFetchOverride;

        // 清空CDN缓存，确保总是重新替换
        prevLocationHrefForCdnCache = '';

        // 设置默认Mirror，确保即使找不到合适的镜像也能替换
        if (intelligentCdnCache.length === 0) {
            intelligentCdnCache = [
                VOD_MIRROR_COS,  // 主要CDN
                VOD_MIRROR_ALI,  // 备用CDN1
                VOD_MIRROR_08    // 备用CDN2
            ];
        }

        // 应用URL参数修改器，处理视频直链
        const urlParamHandler = function(details) {
            const url = details.url || '';
            if (url.includes('.mcdn.bilivideo')) {
                const newUrl = forceMcdnReplace(url);
                if (newUrl !== url) {
                    console.log(`Tampermonkey Script "优化Bilibili" [URL参数处理]: ${url} -> ${newUrl}`);
                    return { redirectUrl: newUrl };
                }
            }
        };

        // 监听video和iframe元素，这是从b2.js的经验中获取的
        const waitForElm = (selector) => new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });

        // 等待视频元素并监听
        waitForElm('video').then(videoEl => {
            console.log('Tampermonkey Script "优化Bilibili": 检测到视频元素，添加监听');
            videoEl.addEventListener('canplay', () => {
                if (videoEl.src && videoEl.src.includes('.mcdn.bilivideo')) {
                    const newSrc = forceMcdnReplace(videoEl.src);
                    if (newSrc !== videoEl.src) {
                        console.log(`Tampermonkey Script "优化Bilibili" [视频canplay]: 替换src: ${videoEl.src} -> ${newSrc}`);
                        videoEl.src = newSrc;
                    }
                }
            });
        });

        console.log('Tampermonkey Script "优化Bilibili": 强制提前初始化网络拦截器已完成');
    })();

    // --- UI 和页面逻辑 ---
    // ... (UI 和页面特定逻辑保持不变) ...
    function initSettingsUI() {
        if (document.readyState === 'loading' || document.readyState === 'interactive') { // 在 interactive 状态也可能需要等待
            document.addEventListener('DOMContentLoaded', createSettingsButton);
        } else {
            createSettingsButton(); // 如果 'complete' 则直接创建
        }
    }


    function createSettingsButton() {
        // 检查是否已存在，避免重复插入
        if (document.getElementById('bilibiliSettingsButton')) return;

        // 查找目标容器 - 延迟查找，确保 DOM 加载
        const paletteButtonWrap = document.querySelector('.palette-button-wrap');
        if (!paletteButtonWrap) {
            // console.warn('Tampermonkey Script "优化Bilibili": 未找到 .palette-button-wrap 容器，稍后重试。');
            // 使用 setTimeout 稍微延迟重试，给页面更多加载时间
             setTimeout(createSettingsButton, 500); // 500ms 后重试
            return;
        }
         console.log('Tampermonkey Script "优化Bilibili": 找到 .palette-button-wrap 容器。');


        // 创建设置按钮
        const settingsButton = document.createElement('div');
        settingsButton.id = 'bilibiliSettingsButton';
        settingsButton.className = 'settings-button';
        settingsButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
        `;
        settingsButton.style.cssText = `
            width: 40px;
            height: 40px;
            background: #fff;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #18191c;
            box-shadow: 0 2px 4px rgba(0,0,0,.1);
            transition: all .2s;
            position: relative; /* 改回 relative，让其在文档流中 */
            z-index: 10; /* 确保在按钮容器内可见 */
            pointer-events: auto;
             margin-bottom: 12px; /* 与其他按钮保持一致的间距 */
        `;

        // 添加悬停效果
        settingsButton.addEventListener('mouseover', function() {
            this.style.color = '#00aeec';
        });

        settingsButton.addEventListener('mouseout', function() {
            this.style.color = '#18191c';
        });

        // 创建设置面板容器
        const toggleContainer = document.createElement('div');
        toggleContainer.id = 'settingsToggleContainer';
        toggleContainer.style.cssText = `
            position: fixed;
            z-index: 100000;
            background-color: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            display: none;
            min-width: 120px;
        `;

        // 添加设置面板内容 (增加新选项)
        toggleContainer.innerHTML = `
            <label style="display: block; margin-bottom: 10px; font-size: 11px;">
                <input type="checkbox" id="adRemovalToggle" ${isAdRemovalEnabled ? 'checked' : ''}>
                移除广告
            </label>
            <label style="display: block; margin-bottom: 10px; font-size: 11px;">
                <input type="checkbox" id="swiperRemovalToggle" ${isSwiperRemovalEnabled ? 'checked' : ''}>
                移除轮播图
            </label>
            <label style="display: block; margin-bottom: 10px; font-size: 11px;">
                <input type="checkbox" id="nonVideoCardRemovalToggle" ${isNonVideoCardRemovalEnabled ? 'checked' : ''}>
                移除非视频卡片
            </label>
            <label style="display: block; margin-bottom: 10px; font-size: 11px;">
                <input type="checkbox" id="copySuffixRemovalToggle" ${isCopySuffixRemovalEnabled ? 'checked' : ''}>
                移除复制后缀
            </label>
            <label style="display: block; margin-bottom: 10px; font-size: 11px;">
                <input type="checkbox" id="trackingLoggingToggle" ${isTrackingLoggingDisabled ? 'checked' : ''}>
                禁用追踪与日志
            </label>
            <label style="display: block; margin-bottom: 10px; font-size: 11px;">
                <input type="checkbox" id="homePageOptimizationToggle" ${isHomePageOptimizationEnabled ? 'checked' : ''}>
                主页优化
            </label>
            <label style="display: block; margin-bottom: 10px; font-size: 11px;">
                <input type="checkbox" id="liveEnhancementToggle" ${isLiveEnhancementEnabled ? 'checked' : ''}>
                直播增强(实验性)
            </label>
            <label style="display: block; margin-bottom: 10px; font-size: 11px;">
                <input type="checkbox" id="p2pCdnToggle" ${isP2pCdnDisabled ? 'checked' : ''}>
                视频播放增强 (CDN优化)
            </label>
            <label style="display: block; margin-bottom: 10px; font-size: 11px;">
                <input type="checkbox" id="av1DisableToggle" ${isAv1Disabled ? 'checked' : ''}>
                禁用AV1
            </label>
            <label style="display: block; margin-bottom: 10px; font-size: 11px;">
                <input type="checkbox" id="force4kToggle" ${isForce4kEnabled ? 'checked' : ''}>
                强制启用 4K(实验性)
            </label>
        `;

        // 添加点击事件 (在捕获阶段监听)
        settingsButton.addEventListener('click', function(e) {
            console.log('Tampermonkey Script "优化Bilibili": 设置按钮被点击!'); // 更新日志
            e.preventDefault();
            e.stopPropagation(); // 阻止事件继续传播
            const container = document.getElementById('settingsToggleContainer');
            if (container) {
                const isVisible = container.style.display === 'block';
                if (isVisible) {
                    container.style.display = 'none';
                } else {
                    // 计算面板位置
                    const btnRect = settingsButton.getBoundingClientRect();
                    const panelWidthEstimate = 160; // 调整宽度以适应 "视频播放增强 (CDN优化)"
                    const gap = 10;
                    const panelHeightEstimate = 300; // 增加高度以适应新选项和更长的文本

                    let top = btnRect.top - panelHeightEstimate - gap;
                    top = Math.max(10, top);
                     // 微调：将面板稍微向上移动一点
                     top -= 10; // 将面板向上移动的距离减少

                    const horizontalOffset = 20; // 将面板向右移动20px
                    let left = btnRect.left + (btnRect.width / 2) - (panelWidthEstimate / 2) + horizontalOffset;
                    left = Math.max(10, left);
                    left = Math.min(left, window.innerWidth - panelWidthEstimate - 10);

                    container.style.top = `${top}px`;
                    container.style.left = `${left}px`;
                    container.style.display = 'block';
                }
            }
        }, true); // 捕获阶段

        // 将设置按钮插入到目标容器开头，将面板添加到页面
         // paletteButtonWrap.insertBefore(settingsButton, paletteButtonWrap.firstChild);
         paletteButtonWrap.prepend(settingsButton); // 使用 prepend 插入到最前面
        console.log('Tampermonkey Script "优化Bilibili": 设置按钮已添加到 .palette-button-wrap.'); // 更新日志
        document.body.appendChild(toggleContainer);

        // 添加点击外部关闭面板的功能
        document.addEventListener('click', function(e) {
            const container = document.getElementById('settingsToggleContainer');
            const btn = document.getElementById('bilibiliSettingsButton');
            // 确保点击的目标不是按钮本身或面板内部
            if (container && container.style.display === 'block' &&
                (!container.contains(e.target)) &&
                (!btn || !btn.contains(e.target)))
             {
                container.style.display = 'none';
            }
        });


        // 添加复选框的事件监听器
        toggleContainer.addEventListener('change', function(e) {
            if (e.target.type === 'checkbox') {
                 let needsReload = false; // 标记是否需要提示刷新
                switch(e.target.id) {
                    case 'adRemovalToggle':
                        isAdRemovalEnabled = e.target.checked;
                        GM_setValue('bilibiliAdRemovalEnabled', isAdRemovalEnabled);
                        // 主页广告移除是动态的，通常不需要刷新
                         if (window.location.pathname === '/') applyHomepageOptimizations(); // 尝试动态应用
                        break;
                    case 'swiperRemovalToggle':
                        isSwiperRemovalEnabled = e.target.checked;
                        GM_setValue('bilibiliSwiperRemovalEnabled', isSwiperRemovalEnabled);
                        needsReload = true; // 移除轮播图最好刷新
                         if (window.location.pathname === '/') applyHomepageOptimizations(); // 尝试动态应用
                        break;
                    case 'nonVideoCardRemovalToggle':
                        isNonVideoCardRemovalEnabled = e.target.checked;
                        GM_setValue('bilibiliNonVideoCardRemovalEnabled', isNonVideoCardRemovalEnabled);
                         // 非视频卡片移除是动态的，通常不需要刷新
                          if (window.location.pathname === '/') applyHomepageOptimizations(); // 尝试动态应用
                        break;
                    case 'copySuffixRemovalToggle':
                        isCopySuffixRemovalEnabled = e.target.checked;
                        GM_setValue('bilibiliCopySuffixRemovalEnabled', isCopySuffixRemovalEnabled);
                         // 复制后缀是事件监听，需要刷新才能完全应用或取消
                        needsReload = true;
                         if (window.location.pathname.startsWith('/read/')) applyArticlePageOptimizations(); // 动态应用
                        break;
                    case 'trackingLoggingToggle':
                        isTrackingLoggingDisabled = e.target.checked;
                        GM_setValue('bilibiliTrackingLoggingDisabled', isTrackingLoggingDisabled);
                        disableTrackingAndLogging(); // 立即尝试应用
                        needsReload = true; // 禁用追踪涉及底层修改，强烈建议刷新
                        break;
                    case 'homePageOptimizationToggle':
                        isHomePageOptimizationEnabled = e.target.checked;
                        GM_setValue('bilibiliHomePageOptimizationEnabled', isHomePageOptimizationEnabled);
                        // 主页优化功能保持为空，仅保存状态

                        // 根据当前页面应用相应的优化
                        if (window.location.pathname === '/') {
                            applyHomepageOptimizations(); // 主页优化
                        } else if (window.location.hostname === 't.bilibili.com') {
                            applyStoryPageOptimizations(); // 动态页优化
                        }

                        // 移除黑白滤镜在所有页面都应用
                        removeBlackWhiteFilter();

                        break;
                    // 新增：处理新选项
                    case 'liveEnhancementToggle':
                        isLiveEnhancementEnabled = e.target.checked;
                        GM_setValue('bilibiliLiveEnhancementEnabled', isLiveEnhancementEnabled);
                        // 直播增强可能需要刷新
                        applyLiveEnhancements(isLiveEnhancementEnabled); // 应用直播设置，并触发网络拦截更新
                        needsReload = true;
                        break;
                    case 'p2pCdnToggle':
                        isP2pCdnDisabled = e.target.checked;
                        GM_setValue('bilibiliP2pCdnDisabled', isP2pCdnDisabled);
                        disableP2pCdnAndWebRTC(isP2pCdnDisabled); // 应用 P2P 设置，并触发网络拦截更新
                        // 禁用 P2P 涉及网络请求拦截，强烈建议刷新
                        needsReload = true;
                        break;
                    case 'av1DisableToggle': // 新增：处理禁用AV1
                        isAv1Disabled = e.target.checked;
                        GM_setValue('bilibiliAv1Disabled', isAv1Disabled);
                        applyAv1Disable(isAv1Disabled); // 应用 AV1 禁用设置
                        needsReload = true; // 通常编码切换需要刷新
                        break;
                    case 'force4kToggle': // 新增：处理强制4K
                        isForce4kEnabled = e.target.checked;
                        GM_setValue('bilibiliForce4kEnabled', isForce4kEnabled);
                        applyForce4k(isForce4kEnabled); // 应用强制4K设置
                        needsReload = true; // 通常分辨率/UA切换需要刷新
                        break;
                }
                 if (needsReload) {
                     console.log(`Tampermonkey Script "优化Bilibili": 设置项 "${e.target.id}" 已更改，建议刷新页面以完全生效。`);
                     // 可以选择性地弹出提示
                     // GM.notification(`设置项 "${e.target.parentElement.textContent.trim()}" 已更改，建议刷新页面生效。`, 'Bilibili 优化提示');
                }
            }
        });
    }

    // --- 页面特定逻辑 ---

    // 主页功能
    function applyHomepageOptimizations() {
        console.log('Tampermonkey Script "优化Bilibili": 应用主页优化逻辑');

        // 添加CSS样式以立即隐藏非视频卡片和直播卡片
        if (isNonVideoCardRemovalEnabled) {
            let styleElement = document.getElementById('non-video-card-removal-style');
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = 'non-video-card-removal-style';
                styleElement.textContent = `
                    /* 隐藏非视频卡片 */
                    .floor-single-card,
                    .bili-topic-card,
                    .video-page-special-card-small,
                    .bili-live-card,
                    .ad-floor-card,
                    .activity-card,
                    /* 直播卡片特定选择器 */
                    .floor-card.single-card[data-v-21f11628]:has(a[href*="live.bilibili.com"]),
                    .floor-card.single-card:has(.badge svg[id*="live"]),
                    .floor-card.single-card:has(.living),
                    .floor-card.single-card:has([href*="live.bilibili.com"]),
                    div[class*="liveCard"] {
                        display: none !important;
                    }
                `;
                document.head.appendChild(styleElement);
                console.log('Tampermonkey Script "优化Bilibili": 添加了非视频卡片和直播卡片移除样式');
            }
        }

        // 应用主页优化功能（来自b3.js中的optimizeHomepage）
        if (isHomePageOptimizationEnabled) {
            let styleElement = document.getElementById('homepage-optimization-style');
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = 'homepage-optimization-style';
                styleElement.textContent = `
                    /* 首页广告去除和样式优化 */
                    .feed2 .feed-card:has(a[href*="cm.bilibili.com"]),
                    .feed2 .feed-card:has(.bili-video-card:empty) {
                        width: 1px !important;
                        height: 1px !important;
                        opacity: 0 !important;
                        pointer-events: none !important;
                        position: absolute !important;
                        padding: 0 !important;
                        margin: -1px !important;
                        overflow: hidden !important;
                        clip: rect(0, 0, 0, 0) !important;
                        white-space: nowrap !important;
                        border-width: 0 !important;
                    }

                    .feed2 .container > * {
                        margin-top: 0 !important
                    }
                `;
                document.head.appendChild(styleElement);
                console.log('Tampermonkey Script "优化Bilibili": 添加了首页优化样式');
            }
        }

        function removeAds() {
            if (!isAdRemovalEnabled) return;

            // 删除 adcard-content 下的 btn-ad
            const adcardContents = document.querySelectorAll('.adcard-content');
            adcardContents.forEach(adcard => {
                const btnAds = adcard.querySelectorAll('.btn-ad');
                btnAds.forEach(btn => btn.remove());
            });

            // 优化后的广告移除逻辑：更全面地识别并移除广告卡片及其母容器
            // 策略调整：默认移除所有 is-rcmd 卡片，但排除明确的正常推荐内容
            const rcmdVideoCards = document.querySelectorAll('.bili-video-card.is-rcmd');
            rcmdVideoCards.forEach(card => {
                // 检查是否是明确的正常推荐内容（白名单机制）
                const isNormalRecommendation = (
                    // 检查是否有明确的正常推荐标记
                    card.querySelector('.bili-video-card__info--owner') || // 有UP主信息的通常是正常推荐
                    card.querySelector('.bili-video-card__stats') || // 有播放数据的通常是正常推荐
                    card.querySelector('.bili-video-card__info--bottom') || // 有底部信息的通常是正常推荐
                    // 检查链接是否指向正常视频页面
                    (card.querySelector('a[href*="/video/"]') && !card.querySelector('a[href*="cm.bilibili.com"]')) ||
                    // 检查是否有正常的视频标题结构
                    card.querySelector('.bili-video-card__info--tit')
                );

                // 检查是否有明确的广告标记
                const hasAdMarkers = (
                    card.querySelector('.ad-report') || // 包含广告标记
                    card.querySelector('a[href*="cm.bilibili.com"]') || // 活动广告链接
                    card.hasAttribute('data-ad-id') || // 有广告ID属性
                    card.closest('[data-ad-id]') || // 父容器有广告ID
                    card.textContent.includes('广告') || // 文本包含"广告"
                    card.textContent.includes('推广') // 文本包含"推广"
                );

                // 决策逻辑：如果有广告标记，或者不是明确的正常推荐，则移除
                const shouldRemove = hasAdMarkers || !isNormalRecommendation;

                if (shouldRemove) {
                    // 获取父容器
                    const parentContainer = card.parentElement;

                    // 检查父容器是否存在
                    if (parentContainer) {
                        const containerClasses = parentContainer.className;

                        // 特殊处理：如果父容器是 bili-feed-card，直接移除
                        if (containerClasses.includes('bili-feed-card')) {
                            console.log('Tampermonkey Script "优化Bilibili": 移除 bili-video-card is-rcmd 的 bili-feed-card 母容器', {
                                cardClasses: card.className,
                                parentClasses: parentContainer.className,
                                parentTag: parentContainer.tagName,
                                hasAdMarkers: hasAdMarkers,
                                isNormalRecommendation: isNormalRecommendation,
                                reason: hasAdMarkers ? '有广告标记' : '非正常推荐结构'
                            });
                            parentContainer.remove();
                        } else if (parentContainer.tagName.toLowerCase() === 'div') {
                            // 对于其他div容器，进行安全检查
                            const isImportantContainer = containerClasses.includes('container') ||
                                                       containerClasses.includes('main') ||
                                                       containerClasses.includes('content') ||
                                                       containerClasses.includes('wrapper') ||
                                                       containerClasses.includes('layout') ||
                                                       containerClasses.includes('feed2') || // B站主要内容区域
                                                       containerClasses.includes('recommended-container'); // 推荐容器

                            if (!isImportantContainer) {
                                console.log('Tampermonkey Script "优化Bilibili": 移除广告卡片及其普通div母容器', {
                                    cardClasses: card.className,
                                    parentClasses: parentContainer.className,
                                    parentTag: parentContainer.tagName,
                                    hasAdMarkers: hasAdMarkers,
                                    isNormalRecommendation: isNormalRecommendation,
                                    reason: hasAdMarkers ? '有广告标记' : '非正常推荐结构'
                                });
                                parentContainer.remove();
                            } else {
                                // 如果父容器是重要结构，只移除广告卡片本身
                                console.log('Tampermonkey Script "优化Bilibili": 父容器为重要结构，仅移除广告卡片', {
                                    cardClasses: card.className,
                                    parentClasses: parentContainer.className,
                                    reason: hasAdMarkers ? '有广告标记' : '非正常推荐结构'
                                });
                                card.remove();
                            }
                        } else {
                            // 父容器不是div，只移除广告卡片本身
                            console.log('Tampermonkey Script "优化Bilibili": 父容器非div，仅移除广告卡片', {
                                cardClasses: card.className,
                                parentTag: parentContainer.tagName,
                                parentClasses: parentContainer.className
                            });
                            card.remove();
                        }
                    } else {
                        // 如果没有合适的父容器，直接移除广告卡片
                        console.log('Tampermonkey Script "优化Bilibili": 无合适父容器，直接移除广告卡片', {
                            cardClasses: card.className,
                            reason: hasAdMarkers ? '有广告标记' : '非正常推荐结构'
                        });
                        card.remove();
                    }
                } else {
                    // 这是正常的推荐内容，不移除
                    console.log('Tampermonkey Script "优化Bilibili": 保留正常推荐内容', {
                        cardClasses: card.className,
                        isNormalRecommendation: isNormalRecommendation,
                        hasAdMarkers: hasAdMarkers,
                        hasVideoInfo: !!card.querySelector('.bili-video-card__info--owner'),
                        hasStats: !!card.querySelector('.bili-video-card__stats'),
                        hasVideoLink: !!card.querySelector('a[href*="/video/"]')
                    });
                }
            });

            // 处理其他类型的广告（保持原有逻辑）
            const feedCards = document.querySelectorAll('.feed-card');
            feedCards.forEach(card => {
                const isAd = card.querySelector('.ad-report') || // 通用广告标记
                             card.querySelector('a[href*="cm.bilibili.com"]'); // 活动广告链接
                if (isAd) {
                    console.log('Tampermonkey Script "优化Bilibili": 移除其他类型广告 Feed Card', card);
                    card.remove();
                }
            });


            // 删除推广按钮的文字
            const flexibleRollBtns = document.querySelectorAll('.flexible-roll-btn');
            flexibleRollBtns.forEach(btn => {
                const spans = btn.querySelectorAll('span');
                spans.forEach(span => {
                     if (span.textContent.includes('广告') || span.textContent.includes('推荐')) { // 更精确判断
                        // btn.remove(); // 或直接移除按钮
                    span.remove();
                     }
                });
            });

            // 删除特定推广按钮
            const feedRollBtns = document.querySelectorAll('.feed-roll-btn');
            feedRollBtns.forEach(btn => btn.remove());

             // 移除顶部横幅广告 (可能选择器需要更新)
             const bannerAd = document.querySelector('.bili-banner .ad-report');
             if (bannerAd && bannerAd.closest('.bili-banner')) {
                 bannerAd.closest('.bili-banner').remove();
             }

             // 新增算法：处理只包含shortcut-bg的bili-feed-card
             const biliFeedCards = document.querySelectorAll('.bili-feed-card');
             biliFeedCards.forEach(card => {
                 // 获取所有子元素
                 const children = Array.from(card.children);

                 // 检查是否只有class="shortcut-bg"的子元素
                 const hasOnlyShortcutBg = children.length > 0 &&
                     children.every(child => child.classList.contains('shortcut-bg'));

                 if (hasOnlyShortcutBg) {
                     console.log('Tampermonkey Script "优化Bilibili": 移除只包含shortcut-bg的bili-feed-card', {
                         cardClasses: card.className,
                         childrenCount: children.length,
                         childrenClasses: children.map(child => child.className)
                     });
                     card.remove();
                 }
             });

             // 新增算法：处理没有其他内容的feed-card
             const feedCardsEmpty = document.querySelectorAll('.feed-card');
             feedCardsEmpty.forEach(card => {
                 // 获取所有子元素
                 const children = Array.from(card.children);

                 // 检查是否没有内容或只有空白内容
                 const isEmpty = children.length === 0 ||
                     children.every(child => {
                         // 检查子元素是否为空或只包含空白字符
                         const textContent = child.textContent?.trim() || '';
                         const hasVisibleContent = textContent.length > 0 ||
                             child.querySelector('img, video, iframe, canvas, svg') ||
                             child.querySelector('[style*="background-image"]');
                         return !hasVisibleContent;
                     });

                 if (isEmpty) {
                     console.log('Tampermonkey Script "优化Bilibili": 移除没有内容的feed-card', {
                         cardClasses: card.className,
                         childrenCount: children.length,
                         textContent: card.textContent?.trim()
                     });
                     card.remove();
                 }
             });
        }

        function removeSwiper() {
            if (!isSwiperRemovalEnabled) return;

            // 删除轮播图 - 使用 querySelectorAll 批量处理多个轮播图
            const swiperSelectors = [
                '.recommended-swipe.grid-anchor',  // 原有：推荐轮播图（带锚点）
                '.bili-banner.carousel-active',   // 原有：活动横幅轮播图
                '.recommended-swipe'              // 新增：通用推荐轮播图
            ];

            swiperSelectors.forEach(selector => {
                const swipers = document.querySelectorAll(selector);
                swipers.forEach(swiper => {
                    console.log('Tampermonkey Script "优化Bilibili": 移除轮播图', {
                        selector: selector,
                        element: swiper,
                        className: swiper.className
                    });
                    swiper.remove();
                });
            });
             // 删除特定的CSS规则 (确保只在需要时添加)
             let styleElement = document.getElementById('remove-swiper-style');
             if (!styleElement) {
                  styleElement = document.createElement('style');
                  styleElement.id = 'remove-swiper-style';
                  styleElement.textContent = `
                      /* 移除轮播图后调整布局，防止空白 (使用更通用的选择器) */
                      .feed2 .container > * { margin-top: 0 !important; }
                      /* 以下旧规则可能已不再需要或需要调整 */
                      /* .recommended-container_floor-aside .container > *:nth-child(1) { margin-top: 0 !important; } */
                      /* .recommended-container_floor-aside .container>*:nth-of-type(n + 8) { margin-top: 0 !important; } */
                      /* .recommended-container_floor-aside .container.is-version8>*:nth-of-type(n + 13) { margin-top: 0 !important; } */
                  `;
                  document.head.appendChild(styleElement);
             }
        }

        function removeNonVideoCards() {
            if (!isNonVideoCardRemovalEnabled) return;

            // 删除特定非视频卡片容器
            const nonVideoCardSelectors = [
                '.floor-single-card', // 单个卡片推广
                '.bili-topic-card', // 话题卡片
                '.video-page-special-card-small', // 小型特殊卡片
                '.bili-live-card', // 直播卡片
                '.ad-floor-card', // 明确的广告楼层
                '.activity-card', // 活动卡片
                // 添加其他非视频卡片的选择器
            ];

            nonVideoCardSelectors.forEach(selector => {
                const cards = document.querySelectorAll(selector);
                cards.forEach(card => {
                    // console.log('Tampermonkey Script "优化Bilibili": 移除非视频卡片', selector, card);
                    card.remove();
                });
            });

            // 特别处理直播卡片
            const liveCardSelectors = [
                '.floor-card.single-card', // 找到所有单卡片
                'div[class*="liveCard"]', // 任何包含liveCard的类名
            ];

            liveCardSelectors.forEach(selector => {
                const cards = document.querySelectorAll(selector);
                cards.forEach(card => {
                    // 检查是否是直播卡片
                    const isLiveCard =
                        card.querySelector('a[href*="live.bilibili.com"]') || // 链接包含直播域名
                        card.querySelector('.badge svg[id*="live"]') || // 有直播图标
                        card.querySelector('.living') || // 有"直播中"标记
                        card.textContent.includes('直播中'); // 文本包含"直播中"

                    if (isLiveCard) {
                        console.log('Tampermonkey Script "优化Bilibili": 移除主页直播卡片', card);
                        card.remove();
                    }
                });
            });

            // 针对性处理用户提到的特定直播卡片结构
            const specificLiveCards = document.querySelectorAll('div[data-v-21f11628].floor-card.single-card');
            specificLiveCards.forEach(card => {
                if (card.innerHTML.includes('live.bilibili.com') ||
                    card.querySelector('a[href*="live.bilibili.com"]') ||
                    card.querySelector('svg[id="channel-icon-live"]')) {
                    console.log('Tampermonkey Script "优化Bilibili": 移除特定结构直播卡片', card);
                    card.remove();
                }
            });
        }

         // 初始执行 (如果设置启用)
         if (isAdRemovalEnabled) removeAds();
         if (isSwiperRemovalEnabled) removeSwiper();
         if (isNonVideoCardRemovalEnabled) removeNonVideoCards();

        // 创建一个MutationObserver来监视DOM变化
        const observer = new MutationObserver((mutations) => {
            let changed = false;
            mutations.forEach((mutation) => {
                // 优化：只在添加了节点时检查
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                     // 更精确地检查添加的节点是否可能是广告或需要移除的卡片
                     for (const node of mutation.addedNodes) {
                         if (node.nodeType === Node.ELEMENT_NODE) {
                              if (node.querySelector('.ad-report, a[href*="cm.bilibili.com"]') || // 广告相关
                                   node.querySelector('.bili-video-card.is-rcmd') || // 检测所有推荐卡片（新策略）
                                   node.matches('.feed-card, .bili-feed-card, .floor-single-card, .bili-live-card, .bili-topic-card, .video-page-special-card-small, .ad-floor-card, .activity-card') || // 卡片类型（新增bili-feed-card）
                                   node.matches('.bili-video-card.is-rcmd') || // 匹配所有推荐卡片（新策略）
                                   node.classList?.contains('recommended-swipe') || node.classList?.contains('bili-banner') || // 轮播图检测
                                   node.matches('.recommended-swipe') || node.matches('.bili-banner.carousel-active') || // 精确匹配轮播图
                                   // 检查是否是直播卡片
                                   node.querySelector('a[href*="live.bilibili.com"]') ||
                                   node.querySelector('svg[id="channel-icon-live"]') ||
                                   node.textContent.includes('直播中') ||
                                   (node.hasAttribute('data-v-21f11628') && node.classList.contains('floor-card'))
                                 ) {
                                 changed = true;
                                 break;
                             }
                         }
                     }
                }
            });
             if (changed) {
                 // console.log('Tampermonkey Script "优化Bilibili": 检测到主页 DOM 变化，重新应用优化');
                 if (isAdRemovalEnabled) removeAds();
                 if (isSwiperRemovalEnabled) removeSwiper(); // Swiper 可能需要重新移除
                 if (isNonVideoCardRemovalEnabled) removeNonVideoCards();
             }
        });

        // 配置观察选项
        const config = { childList: true, subtree: true };

        // 开始观察文档体
         // 延迟启动 Observer，等待页面初步加载
         setTimeout(() => {
             if (document.body) {
        observer.observe(document.body, config);
                console.log('Tampermonkey Script "优化Bilibili": 主页 MutationObserver 已启动');
             } else {
                  console.warn('Tampermonkey Script "优化Bilibili": document.body 不存在，无法启动主页 Observer');
             }
         }, 1000); // 延迟 1 秒
    }

    // 视频页面功能
    function applyVideoPageOptimizations() {
        console.log('Tampermonkey Script "优化Bilibili": 应用视频页优化逻辑');

        if (!isAdRemovalEnabled) return;

        // 创建并添加样式
        const styleId = 'bilibili-video-ad-removal-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                /* 隐藏视频播放前广告和弹窗 */
                .bilibili-player-video-ad,
                .bilibili-player-video-popup,
                .bilibili-player-video-upgrade-popup,
                .bilibili-player-community-intro {
                    display: none !important;
                }

                /* 隐藏右侧推广广告 */
                .ad-report,
                .ad-floor-cover,
                .slide-ad,
                .video-card-ad,
                .video-page-special-card-small,
                .video-page-game-card-small,
                .video-container .pop-live-small-mode {
                    display: none !important;
                }

                /* 隐藏播放器内推广内容 */
                .player-wrapper .video-player-recommend-ad {
                    display: none !important;
                }

                /* 隐藏相关视频广告 */
                .up-card-wrap:has(.ad-info),
                .card-box:has(.ad-info),
                .recommend-video-card:has(.info-box .ad-tag) {
                    display: none !important;
                }

                /* 隐藏播放器底部推广 */
                #biliMainFooter,
                #biliMainFooter .contact-help {
                    display: none !important;
                }

                /* 隐藏右侧卡片广告 */
                .right-container .vcd {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);
        }

        // 使用DOM移除无法通过CSS隐藏的广告
        function removeVideoAds() {
            // 移除播放器预载广告
            const playerAds = document.querySelectorAll('.bilibili-player-video-ad');
            playerAds.forEach(ad => ad.remove());

            // 移除相关视频中的广告
            const relatedAds = document.querySelectorAll('.video-page-card-small .ad-tag');
            relatedAds.forEach(ad => {
                const card = ad.closest('.video-page-card-small');
                if (card) card.remove();
            });

            // 移除右侧广告卡片
            const adCards = document.querySelectorAll('.ad-report, .slide-ad, .video-card-ad');
            adCards.forEach(card => {
                const container = card.closest('.b-wrap, .card-list-item, .video-page-card-small');
                if (container) container.remove();
            });

            // 移除视频下方推广
            const bottomAds = document.querySelectorAll('.activity-m, .up-card:has(.ad-info)');
            bottomAds.forEach(ad => ad.remove());
        }

        // 初始执行一次
        removeVideoAds();

        // 创建MutationObserver来监视DOM变化
        const observer = new MutationObserver((mutations) => {
            let changed = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.querySelector('.ad-report, .ad-tag, .bilibili-player-video-ad') ||
                                node.matches('.video-card-ad, .slide-ad, .ad-report, .activity-m, .up-card')) {
                                changed = true;
                                break;
                            }
                        }
                    }
                }
            });

            if (changed) {
                // console.log('Tampermonkey Script "优化Bilibili": 检测到视频页 DOM 变化，重新应用广告移除');
                removeVideoAds();
            }
        });

        // 启动观察器
        setTimeout(() => {
            if (document.body) {
                observer.observe(document.body, { childList: true, subtree: true });
                console.log('Tampermonkey Script "优化Bilibili": 视频页 MutationObserver 已启动');
            } else {
                console.warn('Tampermonkey Script "优化Bilibili": document.body 不存在，无法启动视频页 Observer');
            }
        }, 1000);

        // 新增: 特定于视频页面的CDN替换逻辑
        if (isP2pCdnDisabled) {
            // 监听播放器初始化
            function watchForPlayer() {
                // 检查播放器是否存在并替换视频源
                const checkAndReplaceVideo = () => {
                    const videoElements = document.querySelectorAll('video');
                    videoElements.forEach(video => {
                        if (video.src && video.src.includes('.mcdn.bilivideo')) {
                            const originalSrc = video.src;
                            const newSrc = forceMcdnReplace(originalSrc);
                            if (newSrc !== originalSrc) {
                                console.log(`Tampermonkey Script "优化Bilibili" [视频页]: 替换视频src: ${originalSrc} -> ${newSrc}`);
                                video.src = newSrc;
                            }
                        }
                    });
                };

                // 立即检查一次
                checkAndReplaceVideo();

                // 每200ms检查一次，持续5秒
                let attempts = 0;
                const interval = setInterval(() => {
                    checkAndReplaceVideo();
                    attempts++;
                    if (attempts >= 25) { // 5秒后停止
                        clearInterval(interval);
                    }
                }, 200);
            }

            // 视频页面加载后检查
            if (document.readyState === 'complete') {
                watchForPlayer();
            } else {
                window.addEventListener('load', watchForPlayer);
            }

            // 监听历史状态变化 (SPA导航)
            const originalPushState = history.pushState;
            const originalReplaceState = history.replaceState;

            history.pushState = function() {
                const result = originalPushState.apply(this, arguments);
                setTimeout(watchForPlayer, 100); // 略微延迟执行
                return result;
            };

            history.replaceState = function() {
                const result = originalReplaceState.apply(this, arguments);
                setTimeout(watchForPlayer, 100);
                return result;
            };

            // 监听URL变化
            window.addEventListener('popstate', () => {
                setTimeout(watchForPlayer, 100);
            });
        }
    }

    // 文章页面功能
    function applyArticlePageOptimizations() {
         console.log('Tampermonkey Script "优化Bilibili": 应用文章页优化逻辑');
         let copyListener = null; // 用于存储事件监听器引用

         // 移除或添加文本复制后缀的监听器
         function toggleCopySuffixListener() {
             // 先移除旧的监听器（如果存在）
             if (copyListener) {
                 window.removeEventListener('copy', copyListener, true);
                 copyListener = null;
                 console.log('Tampermonkey Script "优化Bilibili": 移除旧的 copy 监听器');
             }

            if (isCopySuffixRemovalEnabled) {
                 copyListener = function(e) {
                    e.stopImmediatePropagation(); // 阻止同一元素上其他监听器以及事件传播
                     console.log('Tampermonkey Script "优化Bilibili": 阻止复制事件传播 (immediate)');
                 };
                 window.addEventListener('copy', copyListener, true); // 在捕获阶段阻止
                 console.log('Tampermonkey Script "优化Bilibili": 添加 copy 监听器 (阻止后缀)');
            } else {
                  console.log('Tampermonkey Script "优化Bilibili": 未添加 copy 监听器 (允许后缀)');
             }
        }

        // 初始应用一次
        // 需要等待 window load 吗？DOMContentLoaded 应该足够添加事件监听器
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', toggleCopySuffixListener);
        } else {
            toggleCopySuffixListener();
        }


        // 监听设置变化并重新应用 removeCopySuffix
        // 通过 change 事件处理，无需 setInterval
         const settingsContainer = document.getElementById('settingsToggleContainer');
         if (settingsContainer) {
            const toggleInput = settingsContainer.querySelector('#copySuffixRemovalToggle');
            if (toggleInput) {
                 toggleInput.addEventListener('change', (e) => {
                    isCopySuffixRemovalEnabled = e.target.checked; // 确保状态同步
                    toggleCopySuffixListener(); // 重新应用监听器
                 });
             }
         }
    }

    // --- 初始化 UI 和页面特定逻辑 ---
     initSettingsUI(); // 尝试初始化设置按钮

    // 根据当前页面 URL 应用特定逻辑
    // 使用更通用的匹配方式
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;

    if (hostname.endsWith('bilibili.com')) {
        // 在所有页面上都应用黑白滤镜移除
        removeBlackWhiteFilter();

        if (pathname === '/' && hostname === 'www.bilibili.com') { // 仅限主域名首页
             // 等待 DOM 加载完毕再应用主页优化
             if (document.readyState === 'loading' || document.readyState === 'interactive') {
                 document.addEventListener('DOMContentLoaded', applyHomepageOptimizations);
             } else {
                 applyHomepageOptimizations();
             }
        } else if (pathname.startsWith('/read/')) {
             // 文章页优化可以在脚本加载后立即应用
             applyArticlePageOptimizations();
        } else if (hostname === 'live.bilibili.com') {
             // 直播页面的特定逻辑已在 applyLiveEnhancements 中处理样式
             // applyLiveEnhancements 会在脚本开始时根据初始状态调用
             console.log('Tampermonkey Script "优化Bilibili": 检测到直播页面');
        } else if (pathname.startsWith('/video/')) {
            // 视频页面优化
            if (document.readyState === 'loading' || document.readyState === 'interactive') {
                document.addEventListener('DOMContentLoaded', applyVideoPageOptimizations);
            } else {
                applyVideoPageOptimizations();
            }
            console.log('Tampermonkey Script "优化Bilibili": 检测到视频页面');
        } else if (hostname === 't.bilibili.com') {
            // 动态页面优化
            if (document.readyState === 'loading' || document.readyState === 'interactive') {
                document.addEventListener('DOMContentLoaded', applyStoryPageOptimizations);
            } else {
                applyStoryPageOptimizations();
            }
            console.log('Tampermonkey Script "优化Bilibili": 检测到动态页面');
        }
        // 其他页面，如视频页、直播页、动态页等，只应用全局功能（如禁用追踪、设置按钮）
    }

    // 添加动态页面优化功能（来自b3.js中的optimizeStory）
    function applyStoryPageOptimizations() {
        console.log('Tampermonkey Script "优化Bilibili": 应用动态页面优化逻辑');

        if (!isHomePageOptimizationEnabled) return;

        // 添加动态页宽屏模式样式
        let styleElement = document.getElementById('story-optimization-style');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'story-optimization-style';
            styleElement.textContent = `
                /* 动态页面优化 */
                html[wide] #app { display: flex; }
                html[wide] .bili-dyn-home--member { box-sizing: border-box; padding: 0 10px; width: 100%; flex: 1; }
                html[wide] .bili-dyn-content { width: initial; }
                html[wide] main { margin: 0 8px; flex: 1; overflow: hidden; width: initial; }
                #wide-mode-switch { margin-left: 0; margin-right: 20px; }
                .bili-dyn-list__item:has(.bili-dyn-card-goods), .bili-dyn-list__item:has(.bili-rich-text-module.goods) { display: none !important }
            `;
            document.head.appendChild(styleElement);
            console.log('Tampermonkey Script "优化Bilibili": 添加了动态页面优化样式');
        }

        // 设置宽屏模式
        if (!localStorage.WIDE_OPT_OUT) {
            document.documentElement.setAttribute('wide', 'wide');
        }

        // 添加宽屏模式切换按钮
        function addWideModeSwitchButton() {
            const tabContainer = document.querySelector('.bili-dyn-list-tabs__list');
            if (!tabContainer || document.getElementById('wide-mode-switch')) return;

            const placeHolder = document.createElement('div');
            placeHolder.style.flex = '1';

            const switchButton = document.createElement('a');
            switchButton.id = 'wide-mode-switch';
            switchButton.className = 'bili-dyn-list-tabs__item';
            switchButton.textContent = '宽屏模式';
            switchButton.addEventListener('click', (e) => {
                e.preventDefault();
                if (localStorage.WIDE_OPT_OUT) {
                    localStorage.removeItem('WIDE_OPT_OUT');
                    document.documentElement.setAttribute('wide', 'wide');
                } else {
                    localStorage.setItem('WIDE_OPT_OUT', '1');
                    document.documentElement.removeAttribute('wide');
                }
            });

            tabContainer.appendChild(placeHolder);
            tabContainer.appendChild(switchButton);
            console.log('Tampermonkey Script "优化Bilibili": 添加了宽屏模式切换按钮');
        }

        // 等待页面加载完成后添加按钮
        if (document.readyState === 'complete') {
            addWideModeSwitchButton();
        } else {
            window.addEventListener('load', addWideModeSwitchButton, { once: true });
        }
    }

    // 添加移除黑白滤镜功能（来自b3.js中的removeBlackBackdropFilter）
    function removeBlackWhiteFilter() {
        if (!isHomePageOptimizationEnabled) return;

        console.log('Tampermonkey Script "优化Bilibili": 应用移除黑白滤镜');

        let styleElement = document.getElementById('remove-black-white-filter-style');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'remove-black-white-filter-style';
            styleElement.textContent = `
                /* 去除叔叔去世时的全站黑白效果 */
                html, body { -webkit-filter: none !important; filter: none !important; }
            `;
            document.head.appendChild(styleElement);
            console.log('Tampermonkey Script "优化Bilibili": 添加了移除黑白滤镜样式');
        }
    }

    // --- AV1 禁用核心逻辑 ---
    function applyAv1Disable(disable) {
        console.log('Tampermonkey Script "优化Bilibili": 应用 AV1 禁用设置:', disable); // 调试信息：应用 AV1 禁用设置

        if (disable) {
            if (originalHTMLMediaElement && originalCanPlayType) {
                originalHTMLMediaElement.prototype.canPlayType = function(type) {
                    // 确保 type 是字符串再调用 includes
                    if (type && typeof type === 'string' && type.includes('av01')) {
                        console.log('Tampermonkey Script "优化Bilibili" [AV1 Disable]: HTMLMediaElement.canPlayType 已为类型拦截:', type); // 调试信息：HTMLMediaElement.canPlayType 拦截
                        return ''; // 返回空字符串表示不支持
                    }
                    // 对于其他类型，调用原始方法
                    return originalCanPlayType.apply(this, arguments);
                };
            } else {
                console.warn('Tampermonkey Script "优化Bilibili" [AV1 Disable]: 原始 HTMLMediaElement.prototype.canPlayType 未找到或不可用。'); // 警告：原始 canPlayType 不可用
            }

            if (originalMediaSource && originalIsTypeSupported) {
                originalMediaSource.isTypeSupported = function(type) {
                    // 确保 type 是字符串再调用 includes
                    if (type && typeof type === 'string' && type.includes('av01')) {
                        console.log('Tampermonkey Script "优化Bilibili" [AV1 Disable]: MediaSource.isTypeSupported 已为类型拦截:', type); // 调试信息：MediaSource.isTypeSupported 拦截
                        return false; // 返回 false 表示不支持
                    }
                    // 对于其他类型，调用原始方法
                    return originalIsTypeSupported.apply(this, arguments);
                };
            } else {
                console.warn('Tampermonkey Script "优化Bilibili" [AV1 Disable]: 原始 MediaSource.isTypeSupported 未找到或不可用。'); // 警告：原始 isTypeSupported 不可用
            }
            if ((originalHTMLMediaElement && originalCanPlayType) || (originalMediaSource && originalIsTypeSupported)) {
               console.log('Tampermonkey Script "优化Bilibili": AV1 功能已尝试禁用 (通过拦截 canPlayType 和/或 isTypeSupported)。'); // 信息：AV1 已尝试禁用
            } else {
               console.warn('Tampermonkey Script "优化Bilibili": 未能应用 AV1 禁用，相关 API 缺失。'); // 警告：未能应用 AV1 禁用
            }
        } else {
            // 恢复原始函数
            if (originalHTMLMediaElement && originalCanPlayType) {
                originalHTMLMediaElement.prototype.canPlayType = originalCanPlayType;
            }
            if (originalMediaSource && originalIsTypeSupported) {
                originalMediaSource.isTypeSupported = originalIsTypeSupported;
            }
            console.log('Tampermonkey Script "优化Bilibili": AV1 功能已恢复/启用 (如果之前被修改)。'); // 信息：AV1 已恢复/启用
        }
    }

    // --- 强制启用 4K 核心逻辑 ---
    function applyForce4k(enable) {
        console.log('Tampermonkey 脚本 "优化Bilibili": 应用强制4K设置:', enable); // 日志：应用强制4K设置

        if (enable) {
            // 1. 设置 localStorage 项
            if (originalLsSetItem && unsafeWindow.localStorage) {
                originalLsSetItem.call(unsafeWindow.localStorage, 'bilibili_player_force_DolbyAtmos&8K&HDR', '1');
                originalLsSetItem.call(unsafeWindow.localStorage, 'bilibili_player_force_hdr', '1');
                console.log('Tampermonkey 脚本 "优化Bilibili" [强制4K]: localStorage 标志已设置。');
            } else {
                console.warn('Tampermonkey 脚本 "优化Bilibili" [强制4K]: localStorage API 或 setItem 不可用，无法设置标志。');
            }

            // 2. Hook sessionStorage.getItem
            if (unsafeWindow.sessionStorage && originalSessionStorageGetItem) {
                unsafeWindow.sessionStorage.getItem = function(key) {
                    if (key === 'enableHEVCError') {
                        console.log('Tampermonkey 脚本 "优化Bilibili" [强制4K]: sessionStorage.getItem(\'enableHEVCError\') 已拦截。');
                        return null;
                    }
                    return originalSessionStorageGetItem.apply(this, arguments);
                };
                console.log('Tampermonkey 脚本 "优化Bilibili" [强制4K]: sessionStorage.getItem 已覆写。');
            } else {
                console.warn('Tampermonkey 脚本 "优化Bilibili" [强制4K]: sessionStorage API 或 getItem 不可用，无法拦截。');
            }

            // 3. 覆盖 navigator.userAgent
            // My.js 中的 defineReadonlyProperty 将 configurable 设置为 false
            // 这意味着需要刷新才能真正恢复 UA。
            if (unsafeWindow.navigator) {
                defineReadonlyProperty(unsafeWindow.navigator, 'userAgent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Safari/605.1.15');
                console.log('Tampermonkey 脚本 "优化Bilibili" [强制4K]: navigator.userAgent 已通过 defineReadonlyProperty 修改。');
            } else {
                console.warn('Tampermonkey 脚本 "优化Bilibili" [强制4K]: unsafeWindow.navigator 不可用，无法修改 userAgent。');
            }
            console.log('Tampermonkey 脚本 "优化Bilibili": 强制4K功能已启用 (User Agent 的修改需要刷新页面才能在所有网络请求中完全生效)。');

        } else {
            // 恢复功能
            // 1. 移除 localStorage 项
            if (originalLsRemoveItem && unsafeWindow.localStorage) {
                originalLsRemoveItem.call(unsafeWindow.localStorage, 'bilibili_player_force_DolbyAtmos&8K&HDR');
                originalLsRemoveItem.call(unsafeWindow.localStorage, 'bilibili_player_force_hdr');
                console.log('Tampermonkey 脚本 "优化Bilibili" [强制4K]: localStorage 标志已移除。');
            }

            // 2. 恢复 sessionStorage.getItem
            if (unsafeWindow.sessionStorage && originalSessionStorageGetItem) {
                unsafeWindow.sessionStorage.getItem = originalSessionStorageGetItem;
                console.log('Tampermonkey 脚本 "优化Bilibili" [强制4K]: sessionStorage.getItem 已恢复。');
            }

            // 3. 恢复 navigator.userAgent
            // 由于 defineReadonlyProperty (configurable:false) 的使用，无法直接恢复。
            // 用户需要刷新页面。'needsReload = true' 会提示用户。
            if (unsafeWindow.navigator) {
                console.log('Tampermonkey 脚本 "优化Bilibili" [强制4K]: navigator.userAgent 的恢复需要刷新页面。');
            }
            console.log('Tampermonkey 脚本 "优化Bilibili": 强制4K功能已禁用 (建议刷新页面以完全恢复 User Agent)。');
        }
    }

    // 5. 添加额外的拦截层：拦截视频元素创建 (在脚本末尾初始化区域附近，大约在1860行左右)
    // 在 disableTrackingAndLogging(); 等初始化代码后添加

    // 额外添加：拦截视频元素创建
    function interceptVideoElements() {
        if (!isP2pCdnDisabled) return;

        // 使用 MutationObserver 监听视频元素
        const videoObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeName === 'VIDEO' || node.nodeName === 'AUDIO') {
                            // 监听src属性变化
                            node.addEventListener('loadstart', function() {
                                if (this.src && this.src.includes('.mcdn.bilivideo')) {
                                    const originalSrc = this.src;
                                    const newSrc = forceMcdnReplace(originalSrc);
                                    if (newSrc !== originalSrc) {
                                        console.log(`Tampermonkey Script "优化Bilibili" [DOM监听]: 替换视频src: ${originalSrc} -> ${newSrc}`);
                                        this.src = newSrc;
                                    }
                                }
                            }, true);

                            // 立即检查当前src
                            if (node.src && node.src.includes('.mcdn.bilivideo')) {
                                const originalSrc = node.src;
                                const newSrc = forceMcdnReplace(originalSrc);
                                if (newSrc !== originalSrc) {
                                    console.log(`Tampermonkey Script "优化Bilibili" [DOM监听]: 替换视频src: ${originalSrc} -> ${newSrc}`);
                                    node.src = newSrc;
                                }
                            }
                        }
                    }
                }
            }
        });

        // 开始观察
        videoObserver.observe(document, { childList: true, subtree: true });
        console.log('Tampermonkey Script "优化Bilibili": 视频元素监听器已启动');

        // 额外处理已存在的视频元素
        document.querySelectorAll('video, audio').forEach(el => {
            if (el.src && el.src.includes('.mcdn.bilivideo')) {
                const originalSrc = el.src;
                const newSrc = forceMcdnReplace(originalSrc);
                if (newSrc !== originalSrc) {
                    console.log(`Tampermonkey Script "优化Bilibili" [DOM监听]: 替换已存在视频src: ${originalSrc} -> ${newSrc}`);
                    el.src = newSrc;
                }
            }
        });
    }

    // 在初始化区域调用
    interceptVideoElements();

    // 确保默认CDN缓存不为空
    if (intelligentCdnCache.length === 0) {
        intelligentCdnCache = [DEFAULT_MIRROR_CDN];
        console.log('Tampermonkey Script "优化Bilibili": 初始化默认CDN缓存:', intelligentCdnCache);
    }

    // 在脚本开始，添加顶部即时执行的函数，确保拦截器最早生效
    (function earlyInit() {
        // 立即修补XMLHttpRequest，优先捕获所有网络请求
        if (unsafeWindow.XMLHttpRequest) {
            const origXhrOpen = unsafeWindow.XMLHttpRequest.prototype.open;
            unsafeWindow.XMLHttpRequest.prototype.open = function(...args) {
                let url = args[1];
                if (typeof url === 'string' && url.includes('.mcdn.bilivideo')) {
                    // 立即替换mcdn URL
                    const cdnHost = 'upos-sz-mirrorcos.bilivideo.com'; // 默认备选CDN
                    args[1] = url.replace(/(https?:\/\/)([\w.-]+)(\.mcdn\.bilivideo\.[a-z]+)(.*)/i, `$1${cdnHost}$4`);
                    console.log(`[earlyInit] 替换XHR mcdn URL: ${url} -> ${args[1]}`);
                }
                return origXhrOpen.apply(this, args);
            };
        }

        // 检查已有video元素并处理
        function processVideoElements() {
            document.querySelectorAll('video, audio').forEach(el => {
                if (el.src && el.src.includes('.mcdn.bilivideo')) {
                    const originalSrc = el.src;
                    const cdnHost = 'upos-sz-mirrorcos.bilivideo.com';
                    const newSrc = originalSrc.replace(/(https?:\/\/)([\w.-]+)(\.mcdn\.bilivideo\.[a-z]+)(.*)/i, `$1${cdnHost}$4`);
                    if (newSrc !== originalSrc) {
                        console.log(`[earlyInit] 替换现有视频元素src: ${originalSrc} -> ${newSrc}`);
                        el.src = newSrc;
                    }
                }

                // 监听src属性变化
                const origSrcDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'src');
                if (origSrcDescriptor && origSrcDescriptor.set) {
                    Object.defineProperty(el, 'src', {
                        set(value) {
                            if (typeof value === 'string' && value.includes('.mcdn.bilivideo')) {
                                const cdnHost = 'upos-sz-mirrorcos.bilivideo.com';
                                const newValue = value.replace(/(https?:\/\/)([\w.-]+)(\.mcdn\.bilivideo\.[a-z]+)(.*)/i, `$1${cdnHost}$4`);
                                console.log(`[earlyInit] 拦截设置视频src: ${value} -> ${newValue}`);
                                origSrcDescriptor.set.call(this, newValue);
                            } else {
                                origSrcDescriptor.set.call(this, value);
                            }
                        },
                        get: origSrcDescriptor.get,
                        configurable: true
                    });
                }
            });
        }

        // 从b2.js借鉴的等待元素出现函数
        const waitForElm = (selector) => new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body || document.documentElement, {
                childList: true,
                subtree: true
            });
        });

        // 立即处理现有元素
        if (document.readyState !== 'loading') {
            processVideoElements();
        } else {
            document.addEventListener('DOMContentLoaded', processVideoElements);
        }

        // 监听video元素创建
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeName === 'VIDEO' || node.nodeName === 'AUDIO') {
                            if (node.src && node.src.includes('.mcdn.bilivideo')) {
                                const originalSrc = node.src;
                                const cdnHost = 'upos-sz-mirrorcos.bilivideo.com';
                                const newSrc = originalSrc.replace(/(https?:\/\/)([\w.-]+)(\.mcdn\.bilivideo\.[a-z]+)(.*)/i, `$1${cdnHost}$4`);
                                if (newSrc !== originalSrc) {
                                    console.log(`[earlyInit] 替换新增视频src: ${originalSrc} -> ${newSrc}`);
                                    node.src = newSrc;
                                }
                            }
                        }
                    }
                }
            }
        });

        // 从页面开始就监听整个DOM树
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });

        // 等待视频播放器加载并处理
        waitForElm('video').then(videoEl => {
            console.log('[earlyInit] 找到视频元素，添加特殊处理');

            // 直接修补视频元素
            if (videoEl.src && videoEl.src.includes('.mcdn.bilivideo')) {
                const originalSrc = videoEl.src;
                const cdnHost = 'upos-sz-mirrorcos.bilivideo.com';
                const newSrc = originalSrc.replace(/(https?:\/\/)([\w.-]+)(\.mcdn\.bilivideo\.[a-z]+)(.*)/i, `$1${cdnHost}$4`);
                if (newSrc !== originalSrc) {
                    console.log(`[earlyInit] 替换视频播放器src: ${originalSrc} -> ${newSrc}`);
                    videoEl.src = newSrc;
                }
            }

            // 添加额外事件监听
            videoEl.addEventListener('loadstart', () => {
                if (videoEl.src && videoEl.src.includes('.mcdn.bilivideo')) {
                    const originalSrc = videoEl.src;
                    const cdnHost = 'upos-sz-mirrorcos.bilivideo.com';
                    const newSrc = originalSrc.replace(/(https?:\/\/)([\w.-]+)(\.mcdn\.bilivideo\.[a-z]+)(.*)/i, `$1${cdnHost}$4`);
                    if (newSrc !== originalSrc) {
                        console.log(`[earlyInit] loadstart事件中替换src: ${originalSrc} -> ${newSrc}`);
                        videoEl.src = newSrc;
                    }
                }
            });
        });

        console.log('[earlyInit] 初始化完成，已建立全局拦截');
    })();

    // 在主要文件开头位置添加DOM元素替换逻辑
    function injectVideoSrcOverrides() {
        // 为所有HTMLMediaElement添加src属性拦截
        const origDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'src');
        if (origDescriptor && origDescriptor.set) {
            Object.defineProperty(HTMLMediaElement.prototype, 'src', {
                set(value) {
                    if (typeof value === 'string' && value.includes('.mcdn.bilivideo')) {
                        const newValue = forceMcdnReplace(value);
                        console.log(`[全局拦截] 视频src设置: ${value} -> ${newValue}`);
                        return origDescriptor.set.call(this, newValue);
                    }
                    return origDescriptor.set.call(this, value);
                },
                get: origDescriptor.get,
                configurable: true
            });
            console.log('[全局拦截] HTMLMediaElement.src已重写');
        }

        // 监听MediaSource创建
        const origAddSourceBuffer = MediaSource.prototype.addSourceBuffer;
        MediaSource.prototype.addSourceBuffer = function(mimeType) {
            console.log(`[全局拦截] MediaSource.addSourceBuffer: ${mimeType}`);
            return origAddSourceBuffer.call(this, mimeType);
        };
    }

    // 在适当位置调用
    injectVideoSrcOverrides();
})();