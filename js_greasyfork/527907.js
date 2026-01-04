// ==UserScript==
// @name         Make BiliBili Great Again
// @namespace    https://www.kookxiang.com/
// @version      1.5.12.2
// @description  Useful tweaks for bilibili.com – 各项优化、去除不必要的干扰，提升体验
// @author       AAA
// @match        https://*.bilibili.com/*
// @run-at       document-body
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/527907/Make%20BiliBili%20Great%20Again.user.js
// @updateURL https://update.greasyfork.org/scripts/527907/Make%20BiliBili%20Great%20Again.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ---------------------------
    // Debug log：提前定义以便后续调用（仅在调试模式下输出）
    // ---------------------------
    const debugLog = (...args) => {
        if (unsafeWindow.__MBGA_DEBUG__) {
            console.log(...args);
        }
    };

    // ---------------------------
    // Utility: 添加样式（可选指定 id 避免重复）
    // ---------------------------
    const addStyle = (css, id) => {
        if (id && document.getElementById(id)) return;
        GM_addStyle(css);
    };

    // ---------------------------
    // 1. 去除全站滤镜效果
    // ---------------------------
    const removeSiteFilters = () => {
        addStyle("html, body { -webkit-filter: none !important; filter: none !important; }", "remove-filter-style");
    };

    // ---------------------------
    // 2. 屏蔽提示信息
    // ---------------------------
    const hideAdblockTips = () => {
        addStyle(".adblock-tips, .feed-card:has(.bili-video-card>div:empty) { display: none !important; }", "hide-adblock-tips-style");
    };

    // ---------------------------
    // 3. 定义无用 URL 参数规则
    // ---------------------------
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

    // ---------------------------
    // 4. 屏蔽 WebRTC（避免数据泄漏）
    // ---------------------------
    const blockWebRTC = () => {
        try {
            class _RTCPeerConnection {
                addEventListener() {}
                createDataChannel() {}
            }
            class _RTCDataChannel {}
            const rtcProps = { value: _RTCPeerConnection, enumerable: false, writable: false };
            Object.defineProperty(unsafeWindow, 'RTCPeerConnection', rtcProps);
            Object.defineProperty(unsafeWindow, 'webkitRTCPeerConnection', rtcProps);
            Object.defineProperty(unsafeWindow, 'RTCDataChannel', { value: _RTCDataChannel, enumerable: false, writable: false });
            Object.defineProperty(unsafeWindow, 'webkitRTCDataChannel', { value: _RTCDataChannel, enumerable: false, writable: false });
        } catch (e) {
            console.error("blockWebRTC error:", e);
        }
    };

    // ---------------------------
    // 5. 移除鸿蒙字体（恢复系统默认字体）
    // ---------------------------
    const removeFonts = () => {
        Array.from(document.querySelectorAll('link[href*="/jinkela/long/font/"]')).forEach(x => x.remove());
        addStyle("html, body { font-family: initial !important; }", "remove-font-style");
    };

    // ---------------------------
    // 6. 首页优化：隐藏部分无用内容
    // ---------------------------
    const homepageOptimization = () => {
        if (location.host === "www.bilibili.com") {
            addStyle('.feed2 .feed-card:has(a[href*="cm.bilibili.com"]), .feed2 .feed-card:has(.bili-video-card:empty) { display: none } .feed2 .container > * { margin-top: 0 !important }', "homepage-opt-style");
        }
    };

    // ---------------------------
    // 7. 动态页面优化（t.bilibili.com）
    // ---------------------------
    const dynamicPageOptimization = () => {
        if (location.host === "t.bilibili.com") {
            addStyle("html[wide] #app { display: flex; } html[wide] .bili-dyn-home--member { box-sizing: border-box;padding: 0 10px;width: 100%;flex: 1; } html[wide] .bili-dyn-content { width: initial; } html[wide] main { margin: 0 8px;flex: 1;overflow: hidden;width: initial; } #wide-mode-switch { margin-left: 0;margin-right: 20px; } .bili-dyn-list__item:has(.bili-dyn-card-goods), .bili-dyn-list__item:has(.bili-rich-text-module.goods) { display: none !important }", "dynamic-opt-style");
            if (!localStorage.WIDE_OPT_OUT) {
                document.documentElement.setAttribute('wide', 'wide');
            }
            window.addEventListener('load', () => {
                const tabContainer = document.querySelector('.bili-dyn-list-tabs__list');
                if (!tabContainer) return;
                const placeHolder = document.createElement('div');
                placeHolder.style.flex = 1;
                const switchButton = document.createElement('a');
                switchButton.id = 'wide-mode-switch';
                switchButton.className = 'bili-dyn-list-tabs__item';
                switchButton.textContent = '宽屏模式';
                switchButton.addEventListener('click', e => {
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
            });
        }
    };

    // ---------------------------
    // 8. 去广告及修改广告数据
    // ---------------------------
    const removeAds = () => {
        addStyle('.ad-report, a[href*="cm.bilibili.com"] { display: none !important; }', "remove-ad-style");
        if (unsafeWindow.__INITIAL_STATE__?.adData) {
            for (const key in unsafeWindow.__INITIAL_STATE__.adData) {
                if (!Array.isArray(unsafeWindow.__INITIAL_STATE__.adData[key])) continue;
                for (const item of unsafeWindow.__INITIAL_STATE__.adData[key]) {
                    item.name = 'B 站未来有可能会倒闭，但绝不会变质';
                    item.pic = 'https://static.hdslb.com/images/transparent.gif';
                    item.url = 'https://space.bilibili.com/208259';
                }
            }
        }
    };

    // ---------------------------
    // 9. 去除充电列表
    // ---------------------------
    const removeChargeList = () => {
        if (unsafeWindow.__INITIAL_STATE__?.elecFullInfo) {
            unsafeWindow.__INITIAL_STATE__.elecFullInfo.list = [];
        }
    };

    // ---------------------------
    // 10. 修复文章区复制限制
    // ---------------------------
    const fixArticleCopy = () => {
        if (location.href.startsWith('https://www.bilibili.com/read/cv')) {
            unsafeWindow.original.reprint = "1";
            const articleHolder = document.querySelector('.article-holder');
            if (articleHolder) {
                articleHolder.classList.remove("unable-reprint");
                articleHolder.addEventListener('copy', e => e.stopImmediatePropagation(), true);
            }
        }
    };

    // ---------------------------
    // 11. 去除 P2P CDN 相关干扰
    // ---------------------------
    const removeP2PCDN = () => {
        Object.defineProperty(unsafeWindow, 'PCDNLoader', { value: class { }, enumerable: false, writable: false });
        Object.defineProperty(unsafeWindow, 'BPP2PSDK', { value: class { on() { } }, enumerable: false, writable: false });
        Object.defineProperty(unsafeWindow, 'SeederSDK', { value: class { }, enumerable: false, writable: false });
        if (location.href.startsWith('https://www.bilibili.com/video/') || location.href.startsWith('https://www.bilibili.com/bangumi/play/')) {
            let cdnDomain;
            const replaceP2PUrl = url => {
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
            };
            const replaceP2PUrlDeep = obj => {
                for (const key in obj) {
                    if (typeof obj[key] === 'string') {
                        obj[key] = replaceP2PUrl(obj[key]);
                    } else if (typeof obj[key] === 'object') {
                        replaceP2PUrlDeep(obj[key]);
                    }
                }
            };
            replaceP2PUrlDeep(unsafeWindow.__playinfo__);

            // 重写 HTMLMediaElement 的 src setter
            (function (descriptor) {
                Object.defineProperty(unsafeWindow.HTMLMediaElement.prototype, 'src', {
                    ...descriptor,
                    set: function (value) {
                        descriptor.set.call(this, replaceP2PUrl(value));
                    },
                });
            })(Object.getOwnPropertyDescriptor(unsafeWindow.HTMLMediaElement.prototype, 'src'));

            // 重写 XMLHttpRequest 的 open 方法
            (function (open) {
                unsafeWindow.XMLHttpRequest.prototype.open = function () {
                    try {
                        arguments[1] = replaceP2PUrl(arguments[1]);
                    } finally {
                        return open.apply(this, arguments);
                    }
                };
            })(unsafeWindow.XMLHttpRequest.prototype.open);
        }
    };

    // ---------------------------
    // 12. 真·原画直播优化
    // ---------------------------
    const liveStreamTweaks = () => {
        if (location.href.startsWith('https://live.bilibili.com/')) {
            unsafeWindow.disableMcdn = true;
            unsafeWindow.disableSmtcdns = true;
            unsafeWindow.forceHighestQuality = localStorage.getItem('forceHighestQuality') === 'true';
            let recentErrors = 0;
            setInterval(() => { if (recentErrors > 0) recentErrors /= 2; }, 10000);
            const oldFetch = unsafeWindow.fetch;
            unsafeWindow.fetch = function (url) {
                try {
                    const mcdnRegexp = /[xy0-9]+\.mcdn\.bilivideo\.cn:\d+/;
                    const smtcdnsRegexp = /[\w\.]+\.smtcdns.net\/([\w\-]+\.bilivideo.com\/)/;
                    const qualityRegexp = /(live-bvc\/\d+\/live_\d+_\d+)_\w+/;
                    if (mcdnRegexp.test(arguments[0]) && unsafeWindow.disableMcdn) {
                        return Promise.reject();
                    }
                    if (smtcdnsRegexp.test(arguments[0]) && unsafeWindow.disableSmtcdns) {
                        arguments[0] = arguments[0].replace(smtcdnsRegexp, '$1');
                    }
                    if (qualityRegexp.test(arguments[0]) && unsafeWindow.forceHighestQuality) {
                        arguments[0] = arguments[0]
                            .replace(qualityRegexp, '$1')
                            .replace(/(\d+)_(mini|pro)hevc/g, '$1');
                    }
                    const promise = oldFetch.apply(this, arguments);
                    promise.then(response => {
                        if (!url.match(/\.(m3u8|m4s)/)) return;
                        if ([403, 404].includes(response.status)) recentErrors++;
                        if (recentErrors >= 5 && unsafeWindow.forceHighestQuality) {
                            recentErrors = 0;
                            unsafeWindow.forceHighestQuality = false;
                            GM_notification({ title: '最高清晰度可能不可用', text: '已为您自动切换至播放器上选择的清晰度.', timeout: 3000, silent: true });
                        }
                    });
                    return promise;
                } catch (e) { }
                return oldFetch.apply(this, arguments);
            };
            addStyle("div[data-cy=EvaRenderer_LayerWrapper]:has(.player) { z-index: 999999; } .fixedPageBackground_root { z-index: 999999 !important; }", "live-zindex-style");
            addStyle("#welcome-area-bottom-vm, .web-player-icon-roomStatus { display: none !important; }", "live-hide-style");
        }
    };

    // ---------------------------
    // 13. 视频裁切模式优化
    // ---------------------------
    const videoCropping = () => {
        if (location.href.startsWith('https://www.bilibili.com/video/')) {
            addStyle("body[video-fit] #bilibili-player video { object-fit: cover; } .bpx-player-ctrl-setting-fit-mode { display: flex;width: 100%;height: 32px;line-height: 32px; } .bpx-player-ctrl-setting-box .bui-panel-wrap, .bpx-player-ctrl-setting-box .bui-panel-item { min-height: 172px !important; }", "video-crop-style");
            let timer;
            const toggleMode = enabled => {
                if (enabled) {
                    document.body.setAttribute('video-fit', '');
                } else {
                    document.body.removeAttribute('video-fit');
                }
            };
            const injectButton = () => {
                const menuLeft = document.querySelector('.bpx-player-ctrl-setting-menu-left');
                if (!menuLeft) return;
                clearInterval(timer);
                const item = document.createElement('div');
                item.className = 'bpx-player-ctrl-setting-fit-mode bui bui-switch';
                item.innerHTML = '<input class="bui-switch-input" type="checkbox"><label class="bui-switch-label"><span class="bui-switch-name">裁切模式</span><span class="bui-switch-body"><span class="bui-switch-dot"><span></span></span></span></label>';
                menuLeft.insertBefore(item, document.querySelector('.bpx-player-ctrl-setting-more'));
                const checkbox = document.querySelector('.bpx-player-ctrl-setting-fit-mode input');
                if (checkbox) {
                    checkbox.addEventListener('change', e => toggleMode(e.target.checked));
                }
                const panelItem = document.querySelector('.bpx-player-ctrl-setting-box .bui-panel-item');
                if (panelItem) {
                    panelItem.style.height = '';
                }
            };
            timer = setInterval(injectButton, 200);
        }
    };

    // ---------------------------
    // 14. 去除地址栏多余参数
    // ---------------------------
    const removeExtraURLParams = () => {
        unsafeWindow.history.replaceState(undefined, undefined, removeTracking(location.href));
        const pushState = unsafeWindow.history.pushState;
        unsafeWindow.history.pushState = function (state, unused, url) {
            return pushState.apply(this, [state, unused, removeTracking(url)]);
        };
        const replaceState = unsafeWindow.history.replaceState;
        unsafeWindow.history.replaceState = function (state, unused, url) {
            return replaceState.apply(this, [state, unused, removeTracking(url)]);
        };
    };

    const removeTracking = url => {
        if (!url) return url;
        try {
            const urlObj = new URL(url, location.href);
            if (!urlObj.search) return url;
            const searchParams = urlObj.searchParams;
            Array.from(searchParams.keys()).forEach(key => {
                uselessUrlParams.forEach(item => {
                    if (typeof item === 'string' && item === key) {
                        searchParams.delete(key);
                    } else if (item instanceof RegExp && item.test(key)) {
                        searchParams.delete(key);
                    }
                });
            });
            urlObj.search = searchParams.toString();
            return urlObj.toString();
        } catch (e) {
            console.error("removeTracking error:", e);
            return url;
        }
    };

    // ---------------------------
    // 15. 去除 B 站上报（跟踪）功能
    // ---------------------------
    const removeReporting = () => {
        (function () {
            const oldFetch = unsafeWindow.fetch;
            unsafeWindow.fetch = function (url) {
                if (typeof url === 'string' && url.match(/(?:cm|data)\.bilibili\.com/))
                    return new Promise(() => { });
                return oldFetch.apply(this, arguments);
            };
            const oldOpen = unsafeWindow.XMLHttpRequest.prototype.open;
            unsafeWindow.XMLHttpRequest.prototype.open = function (method, url) {
                if (typeof url === 'string' && url.match(/(?:cm|data)\.bilibili\.com/)) {
                    this.send = function () { };
                }
                return oldOpen.apply(this, arguments);
            };

            unsafeWindow.navigator.sendBeacon = () => Promise.resolve();

            unsafeWindow.MReporterInstance = new Proxy(function () { }, {
                get(target, prop) {
                    debugLog(`MReporterInstance.${prop} called with`, arguments);
                    return () => { };
                }
            });

            unsafeWindow.MReporter = new Proxy(function () { }, {
                construct() {
                    return unsafeWindow.MReporterInstance;
                },
                get(target, prop) {
                    debugLog(`MReporter.${prop} called with`, arguments);
                    return () => { };
                }
            });

            const sentryHub = class { bindClient() { } };
            const fakeSentry = {
                SDK_NAME: 'sentry.javascript.browser',
                SDK_VERSION: '0.0.0',
                BrowserClient: class { },
                Hub: sentryHub,
                Integrations: {
                    Vue: class { },
                    GlobalHandlers: class { },
                    InboundFilters: class { },
                },
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
            };
            if (!unsafeWindow.Sentry || unsafeWindow.Sentry.SDK_VERSION !== fakeSentry.SDK_VERSION) {
                if (unsafeWindow.Sentry) { delete unsafeWindow.Sentry; }
                Object.defineProperty(unsafeWindow, 'Sentry', { value: fakeSentry, enumerable: false, writable: false });
            }

            unsafeWindow.ReporterPbInstance = new Proxy(function () { }, {
                get(target, prop) {
                    debugLog(`ReporterPbInstance.${prop} called with`, arguments);
                    return () => { };
                }
            });
            unsafeWindow.ReporterPb = new Proxy(function () { }, {
                construct() {
                    return unsafeWindow.ReporterPbInstance;
                },
            });

            Object.defineProperty(unsafeWindow, '__biliUserFp__', {
                get() { return { init() { }, queryUserLog() { return []; } }; },
                set() { },
            });
            Object.defineProperty(unsafeWindow, '__USER_FP_CONFIG__', { get() { return undefined; }, set() { } });
            Object.defineProperty(unsafeWindow, '__MIRROR_CONFIG__', { get() { return undefined; }, set() { } });
        })();
    };

    // ---------------------------
    // 执行各模块
    // ---------------------------
    removeSiteFilters();
    hideAdblockTips();
    blockWebRTC();
    removeFonts();
    homepageOptimization();
    dynamicPageOptimization();
    removeAds();
    removeChargeList();
    fixArticleCopy();
    removeP2PCDN();
    liveStreamTweaks();
    videoCropping();
    removeExtraURLParams();
    removeReporting();
})();
