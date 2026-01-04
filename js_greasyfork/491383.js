// ==UserScript==
// @name         Bilibili 优化
// @namespace    https://space.bilibili.com/8081135
// @version      0.0.1
// @description  useful tweaks for bilibili.com
// @author       Wood Cube
// @match        https://*.bilibili.com/*
// @run-at       document-body
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_notification
// @license      MIT
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/491383/Bilibili%20%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/491383/Bilibili%20%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==


// 去除特殊日期的全站黑白效果
GM_addStyle("html, body { -webkit-filter: none !important; filter: none !important; }");

// 没用的 URL 参数
const uselessUrlParams = [
    'buvid',
    'is_story_h5',
    'launch_id',
    'live_from',
    'mid',
    'session_id',
    'timestamp',
    'up_id',
    'vd_source',
    /^share/,
    /^spm/,
];

// Block WebRTC
try {
    Object.defineProperty(unsafeWindow, 'webkitRTCPeerConnection', { value: undefined, enumerable: false, writable: false });
} catch (e) { }

// 移除鸿蒙字体
window.addEventListener('load', function () {
    document.body.classList.remove('harmony-font');
})

// 修复文章区复制
if (location.href.startsWith('https://www.bilibili.com/read/cv')) {
    unsafeWindow.original.reprint = "1";
    document.querySelector('.article-holder').classList.remove("unable-reprint");
    document.querySelector('.article-holder').addEventListener('copy', e => e.stopImmediatePropagation(), true);
}

// 去 P2P CDN
Object.defineProperty(unsafeWindow, 'PCDNLoader', { value: class { }, enumerable: false, writable: false });
Object.defineProperty(unsafeWindow, 'BPP2PSDK', { value: class { on() { } }, enumerable: false, writable: false });
Object.defineProperty(unsafeWindow, 'SeederSDK', { value: class { }, enumerable: false, writable: false });
if (location.href.startsWith('https://www.bilibili.com/video/') || location.href.startsWith('https://www.bilibili.com/bangumi/play/')) {
    let cdnDomain;

    function replaceP2PUrl(url) {
        cdnDomain ||= document.head.innerHTML.match(/up[\w-]+\.bilivideo\.com/)?.[0];

        try {
            const urlObj = new URL(url);
            const hostName = urlObj.hostname;
            if (urlObj.hostname.endsWith(".mcdn.bilivideo.cn")) {
                urlObj.host = cdnDomain || 'upos-sz-mirrorcoso1.bilivideo.com';
                urlObj.port = 443;
                console.warn(`更换视频源: ${hostName} -> ${urlObj.host}`);
                return urlObj.toString();
            } else if (urlObj.hostname.endsWith(".szbdyd.com")) {
                urlObj.host = urlObj.searchParams.get('xy_usource');
                urlObj.port = 443;
                console.warn(`更换视频源: ${hostName} -> ${urlObj.host}`);
                return urlObj.toString();
            }
            return url;
        } catch (e) {
            return url;
        }
    }

    function replaceP2PUrlDeep(obj) {
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                obj[key] = replaceP2PUrl(obj[key]);
            } else if (typeof obj[key] === 'array' || typeof obj[key] === 'object') {
                replaceP2PUrlDeep(obj[key]);
            }
        }
    }

    replaceP2PUrlDeep(unsafeWindow.__playinfo__);

    (function (open) {
        unsafeWindow.XMLHttpRequest.prototype.open = function () {
            try {
                arguments[1] = replaceP2PUrl(arguments[1]);
            } finally {
                return open.apply(this, arguments);
            }
        }
    })(unsafeWindow.XMLHttpRequest.prototype.open);
}

// 去除地址栏多余参数
unsafeWindow.history.replaceState(undefined, undefined, removeTracking(location.href));
const pushState = unsafeWindow.history.pushState;
unsafeWindow.history.pushState = function (state, unused, url) {
    return pushState.apply(this, [state, unused, removeTracking(url)]);
}
const replaceState = unsafeWindow.history.replaceState;
unsafeWindow.history.replaceState = function (state, unused, url) {
    return replaceState.apply(this, [state, unused, removeTracking(url)]);
}

function removeTracking(url) {
    if (!url) return url;
    try {
        const [base, search] = url.split('?');
        if (!search) return url;
        const searchParams = new URLSearchParams('?' + search);
        const keys = Array.from(searchParams.keys());
        for (const key of keys) {
            uselessUrlParams.forEach(item => {
                if (typeof item === 'string') {
                    if (item === key) searchParams.delete(key);
                } else if (item instanceof RegExp) {
                    if (item.test(key)) searchParams.delete(key);
                }
            });
        }
        if (location.pathname === base && !searchParams.size) return;
        return [base, searchParams.toString()].filter(Boolean).join('?');
    } catch (e) {
        return url;
    }
}

// 去除 B 站 上报
!function () {
    const oldFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = function (url) {
        if (typeof url === 'string' && url.includes('data.bilibili.com'))
            return Promise.resolve(new Response());
        return oldFetch.apply(this, arguments);
    }
    const oldSend = unsafeWindow.XMLHttpRequest.prototype.open;
    unsafeWindow.XMLHttpRequest.prototype.open = function (method, url) {
        if (typeof url === 'string' && url.includes('data.bilibili.com')) {
            this.send = function () { };
            return;
        }
        return oldSend.apply(this, arguments);
    }
    unsafeWindow.navigator.sendBeacon = () => Promise.resolve();

    unsafeWindow.MReporter = {
        appear() { },
        click() { },
        tech() { },
        pv() { },
        import: { auto() { } },
    }
    const sentryHub = class { bindClient() { } }
    const fakeSentry = {
        SDK_NAME: 'sentry.javascript.browser',
        SDK_VERSION: '0.0.0',
        BrowserClient: class { },
        Hub: sentryHub,
        Integrations: { Vue: class { } },
        init() { },
        configureScope() { },
        getCurrentHub: () => new sentryHub(),
        setContext() { },
        setExtra() { },
        setExtras() { },
        setTag() { },
        setTags() { },
        setUser() { },
        wrap() { },
    }
    if (!unsafeWindow.Sentry || unsafeWindow.Sentry.SDK_VERSION !== fakeSentry.SDK_VERSION) {
        if (unsafeWindow.Sentry) { delete unsafeWindow.Sentry }
        Object.defineProperty(unsafeWindow, 'Sentry', { value: fakeSentry, enumerable: false, writable: false });
    }
    Object.defineProperty(unsafeWindow, 'ReporterPb', { value: class { click() { } custom() { } exposure() { } report() { } tech() { } pv() { } }, enumerable: false, writable: false });
}()