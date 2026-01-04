// ==UserScript==
// @name         【哔哩哔哩】屏蔽视频PCDN地址（夜之森点子王修改）
// @version      0.3.5.3
// @description  从官方CDN加载视频
// @icon         https://static.hdslb.com/images/favicon.ico
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://www.bilibili.com/blackboard/live/live-activity-player.html*
// @match        https://live.bilibili.com/*
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @namespace    https://github.com/AkagiYui/UserScript
// @supportURL   https://github.com/AkagiYui/UserScript/issues
// @homepage     https://github.com/AkagiYui
// @author       AkagiYui
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528732/%E3%80%90%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E3%80%91%E5%B1%8F%E8%94%BD%E8%A7%86%E9%A2%91PCDN%E5%9C%B0%E5%9D%80%EF%BC%88%E5%A4%9C%E4%B9%8B%E6%A3%AE%E7%82%B9%E5%AD%90%E7%8E%8B%E4%BF%AE%E6%94%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/528732/%E3%80%90%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E3%80%91%E5%B1%8F%E8%94%BD%E8%A7%86%E9%A2%91PCDN%E5%9C%B0%E5%9D%80%EF%BC%88%E5%A4%9C%E4%B9%8B%E6%A3%AE%E7%82%B9%E5%AD%90%E7%8E%8B%E4%BF%AE%E6%94%B9%EF%BC%89.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 507:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const menu_1 = __webpack_require__(997);
const logger_1 = __webpack_require__(686);
const video_1 = __importDefault(__webpack_require__(683));
const live_1 = __importDefault(__webpack_require__(682));
const { debug, useLogger: subLogger } = (0, logger_1.useLogger)("bilibili-ban-pcdn");
const { getConfig } = (0, menu_1.useBooleanMenu)({
    blockPlayError: {
        title: "屏蔽“播放遇到问题？”提示",
        defaultValue: false,
    },
    blockBCacheCDN: {
        title: "屏蔽视频地区CDN",
        defaultValue: false,
    },
    blockLivePCDN: {
        title: "屏蔽直播PCDN",
        defaultValue: false,
    },
    keepOneUrl: {
        title: "保留至少一条播放链接",
        defaultValue: true,
    },
});
const matchUrls = {
    live: ["https://www.bilibili.com/blackboard/live/live-activity-player.html", "https://live.bilibili.com/"],
    video: ["https://www.bilibili.com/video/", "https://www.bilibili.com/list/"],
    bangumi: ["https://www.bilibili.com/bangumi/play/"],
};
const getUrlType = (url) => {
    for (const [type, patterns] of Object.entries(matchUrls)) {
        for (const pattern of patterns) {
            if (url.includes(pattern)) {
                return type;
            }
        }
    }
    return null;
};
const pageWindow = unsafeWindow;
// 屏蔽“播放遇到问题？”提示
if (getConfig("blockPlayError")) {
    const originalDefineProperty = pageWindow.Object.defineProperty;
    pageWindow.Object.defineProperty = function (target, propertyKey, descriptor) {
        if (propertyKey === "videoHasBuffered") {
            originalDefineProperty(target, "showLoadTimeoutFeedback", {
                get: () => () => {
                    debug("屏蔽“播放遇到问题？”提示");
                },
                set: () => {
                    pageWindow.Object.defineProperty = originalDefineProperty;
                },
            });
        }
        return originalDefineProperty(target, propertyKey, descriptor);
    };
}
if (getUrlType(location.href) === "video" || getUrlType(location.href) === "bangumi") {
    (0, video_1.default)(subLogger, getConfig);
}
else if (getUrlType(location.href) === "live") {
    (0, live_1.default)(subLogger, getConfig);
}


/***/ }),

/***/ 682:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports["default"] = (useLogger, getConfig) => {
    const { log, debug } = useLogger("live");
    const pageWindow = unsafeWindow;
    // 屏蔽直播P2P视频流信息
    if (getConfig("blockLivePCDN")) {
        function processPlayurlInfo(playurlInfo) {
            if (!playurlInfo)
                return;
            playurlInfo.p2p_data.m_p2p = false;
            playurlInfo.p2p_data.m_servers = null;
            playurlInfo.stream.forEach((stream) => {
                stream.format.forEach((format) => {
                    format.codec.forEach((codec) => {
                        codec.url_info = codec.url_info.filter((urlInfo) => {
                            const keep = !urlInfo.host.includes("mcdn.bilivideo");
                            debug("保留链接", keep, urlInfo.host);
                            return keep;
                        });
                    });
                });
            });
        }
        // 替换SSR属性__NEPTUNE_IS_MY_WAIFU__
        let __NEPTUNE_IS_MY_WAIFU__ = pageWindow.__NEPTUNE_IS_MY_WAIFU__;
        Object.defineProperty(pageWindow, "__NEPTUNE_IS_MY_WAIFU__", {
            get: () => __NEPTUNE_IS_MY_WAIFU__,
            set: (value) => {
                if (value.roomInitRes) {
                    log("直播房间信息", "处理前", JSON.parse(JSON.stringify(value.roomInitRes)));
                    processPlayurlInfo(value.roomInitRes.data.playurl_info?.playurl);
                    log("直播房间信息", "处理后", JSON.parse(JSON.stringify(value.roomInitRes)));
                }
                __NEPTUNE_IS_MY_WAIFU__ = value;
            },
        });
        let oldFetch = pageWindow.fetch;
        function hookFetch(url, init) {
            if (typeof url === "string") {
                if (url.includes("api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo")) {
                    log("请求直播列表");
                    return new Promise((resolve, reject) => {
                        oldFetch.apply(this, arguments).then((response) => {
                            const oldJson = response.json;
                            response.json = function () {
                                return new Promise((resolve, reject) => {
                                    oldJson.apply(this, arguments).then((result) => {
                                        log("直播列表", "fetch", "处理前", JSON.parse(JSON.stringify(result)));
                                        processPlayurlInfo(result.data.playurl_info?.playurl);
                                        log("直播列表", "fetch", "处理后", JSON.parse(JSON.stringify(result)));
                                        resolve(result);
                                    });
                                });
                            };
                            resolve(response);
                        });
                    });
                }
            }
            return oldFetch.apply(this, arguments);
        }
        // 对window.fetch挂载成我们的劫持函数hookFetch
        pageWindow.fetch = hookFetch;
        const originalXHR = pageWindow.XMLHttpRequest;
        const xhrOpen = originalXHR.prototype.open;
        originalXHR.prototype.open = function (_, url) {
            if (url.includes("api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo")) {
                log("请求直播列表");
                const getter = Object.getOwnPropertyDescriptor(originalXHR.prototype, "responseText").get;
                Object.defineProperty(this, "responseText", {
                    get: () => {
                        const response = getter.call(this);
                        const responseJson = JSON.parse(response);
                        log("直播列表", "xhr", "处理前", JSON.parse(JSON.stringify(responseJson)));
                        processPlayurlInfo(responseJson.data.playurl_info?.playurl);
                        log("直播列表", "xhr", "处理后", JSON.parse(JSON.stringify(responseJson)));
                        return JSON.stringify(responseJson);
                    },
                });
            }
            return xhrOpen.apply(this, arguments);
        };
    }
    // 未来可能考虑屏蔽出方向的P2P
};


/***/ }),

/***/ 683:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const PCDN_REGEX_PATTERN = /mcdn.bilivideo.(com|cn)/;
const BCACHE_REGEX_PATTERN = /(cn-.*\.bilivideo\.(com|cn))/;
exports["default"] = (useLogger, getConfig) => {
    const { log, debug } = useLogger("video");
    const pageWindow = unsafeWindow;
    // 挑出有用的链接
    const removeSomeUrls = (allUrls) => {
        const keepOneUrl = getConfig("keepOneUrl");
        const blockBCacheCDN = getConfig("blockBCacheCDN");
        const filterUrls = (urls, pattern) => {
            return urls.filter((url) => {
                const keep = !pattern.test(url);
                debug("保留链接", keep, url);
                return keep;
            });
        };
        const applyFilter = (urls, pattern, filterName) => {
            debug(`过滤${filterName}链接`);
            const filteredUrls = filterUrls(urls, pattern);
            if (filteredUrls.length === 0) {
                debug(`仅包含${filterName}链接，${keepOneUrl ? "保留所有播放链接" : "无可用链接"}`);
                return keepOneUrl ? urls : [];
            }
            return filteredUrls;
        };
        let restUrls = applyFilter(allUrls, PCDN_REGEX_PATTERN, "PCDN");
        if (blockBCacheCDN) {
            restUrls = applyFilter(restUrls, BCACHE_REGEX_PATTERN, "自建地区CDN");
        }
        return { baseUrl: restUrls[0], backupUrls: restUrls.slice(1) };
    };
    // 处理资源数据
    const cleanPlayInfo = (playInfo) => {
        log("处理前", JSON.parse(JSON.stringify(playInfo)));
        if (playInfo.data) {
            log("非番剧视频");
            cleanNonBangumiVideo(playInfo.data);
        }
        else if (playInfo.result) {
            log("番剧视频");
            cleanBangumiVideo(playInfo.result);
        }
        log("处理后", JSON.parse(JSON.stringify(playInfo)));
    };
    const cleanNonBangumiVideo = (data) => {
        if (data.dash) {
            cleanDash(data.dash);
        }
        if (data.durl) {
            log("试看视频");
            cleanDurl(data.durl);
        }
    };
    const cleanBangumiVideo = (result) => {
        if (!result.video_info) {
            log("番剧播放列表不存在，可能是没有大会员或未承包");
            return;
        }
        const videoInfo = result.video_info;
        if (videoInfo.dash) {
            cleanDash(videoInfo.dash);
        }
        else if (videoInfo.durl || videoInfo.durls) {
            log("试看番剧");
            if (videoInfo.durl) {
                cleanDurl(videoInfo.durl);
            }
            if (videoInfo.durls) {
                videoInfo.durls.forEach((durlGroup) => cleanDurl(durlGroup.durl));
            }
        }
        else {
            log("番剧播放列表不存在，可能是没有大会员或未承包");
        }
    };
    const cleanDash = (dash) => {
        const cleanMedia = (media) => {
            const { baseUrl, backupUrls } = removeSomeUrls([media.baseUrl, ...media.backupUrl]);
            media.baseUrl = media.base_url = baseUrl;
            media.backupUrl = media.backup_url = backupUrls;
        };
        dash.video.forEach(cleanMedia);
        dash.audio?.forEach(cleanMedia); // 部分视频没有音频流
        dash.dolby?.audio && dash.dolby.audio.forEach(cleanMedia); // 杜比
        dash.flac?.audio && cleanMedia(dash.flac.audio); // Hi-Res
    };
    const cleanDurl = (durls) => {
        durls.forEach((durl) => {
            const { baseUrl, backupUrls } = removeSomeUrls([durl.url, ...durl.backup_url]);
            durl.url = baseUrl;
            durl.backup_url = backupUrls;
        });
    };
    // --- 新增逻辑：处理页面加载时的初始 __playinfo__ ---
    let initialPlayinfoProcessed = false;
    if (pageWindow.__playinfo__) {
        try {
            log("处理页面加载时的 __playinfo__ (初始值)", JSON.parse(JSON.stringify(pageWindow.__playinfo__))); // 深拷贝打印，避免后续修改影响日志
            cleanPlayInfo(pageWindow.__playinfo__); // 直接修改全局变量中的数据
            log("处理页面加载时的 __playinfo__ (处理后)", JSON.parse(JSON.stringify(pageWindow.__playinfo__)));
            initialPlayinfoProcessed = true;
        } catch (e) {
            log("处理初始 __playinfo__ 时出错:", e);
        }
    } else {
        log("脚本运行时 pageWindow.__playinfo__ 不存在");
    }
    // 播放器初始化参数
    let currentPlayinfoState = pageWindow.__playinfo__;

    Object.defineProperty(pageWindow, "__playinfo__", {
        get: () => {
            // Getter 现在可以直接返回当前状态，因为初始值已处理
            // 如果担心 B站 可能在不通过 setter 的情况下修改它，可以在这里再次调用 cleanPlayInfo，但这通常没必要
            // debug("Getter: 返回 currentPlayinfoState");
            return currentPlayinfoState;
        },
        set: (value) => {
            // Setter 处理后续的赋值（例如SPA切换视频）
            log("处理更新的 __playinfo__ (setter)", value);
            try {
                cleanPlayInfo(value); // 清理新赋的值
                currentPlayinfoState = value; // 更新闭包中的状态
            } catch (e) {
                log("处理 setter 中的 __playinfo__ 时出错:", e);
            }
        },
        configurable: true // 允许后续可能的操作，虽然通常不需要
    });
    // --- 修改 Object.defineProperty 逻辑结束 ---

    const observer = new MutationObserver((mutationsList, observer) => {
        if (typeof pageWindow.nano !== 'undefined') {
            log("Window.nano 已加载，开始 hook...");
            // 在这里执行你的 hook 代码 (例如上面的方法 1 或 2)
            const originalCreatePlayer = pageWindow.nano.createPlayer;
            // 定义我们自己的 nano.createPlayer 函数
            pageWindow.nano.createPlayer = function(config) {
                log("原始 primarySetting/config:", config);
                // 在这里修改 primarySetting 对象
                if(config.prefetch){
                    cleanPlayInfo(config.prefetch.playUrl)
                    log("修改后的 primarySetting/config:", config);
                }
                const theme = arguments[1]
                // 调用原始的 nano.createPlayer 函数，并将修改后的 primarySetting 传递给它
                return originalCreatePlayer.call(this, config, theme);
            };
            observer.disconnect(); // 停止监听
        }
    });
    observer.observe(document.documentElement || document.body, {
        childList: true,
        subtree: true
    });
    // 播放列表请求处理
    const originalXHR = pageWindow.XMLHttpRequest;
    const xhrOpen = originalXHR.prototype.open;
    originalXHR.prototype.open = function (_, url) {
        if (url.includes("api.bilibili.com/x/player/wbi/playurl")) {
            // 包括单个视频的多个(画质数量*编码数量)的url
            const avid = url.match(/avid=(\d+)/)?.[1]; // 提取出url中的avid参数
            log("请求视频列表", `av${avid}`);
            const getter = Object.getOwnPropertyDescriptor(originalXHR.prototype, "responseText").get;
            Object.defineProperty(this, "responseText", {
                get: () => {
                    const response = getter.call(this);
                    const responseJson = JSON.parse(response);
                    cleanPlayInfo(responseJson);
                    return JSON.stringify(responseJson);
                },
            });
        }
        if (url.includes("api.bilibili.com/pgc/player/web/v2/playurl")) {
            const season_id = url.match(/season_id=(\d+)/)?.[1]; // 提取出url中的season_id参数
            const ep_id = url.match(/ep_id=(\d+)/); // 提取出url中的ep_id参数
            log("请求番剧列表", `ss${season_id}`, ep_id ? `ep${ep_id[1]}` : "ep_id not found");
            const getter = Object.getOwnPropertyDescriptor(originalXHR.prototype, "responseText").get;
            Object.defineProperty(this, "responseText", {
                get: () => {
                    const response = getter.call(this);
                    const responseJson = JSON.parse(response);
                    cleanPlayInfo(responseJson);
                    return JSON.stringify(responseJson);
                },
            });
        }
        return xhrOpen.apply(this, arguments);
    };
};


/***/ }),

/***/ 686:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.useLogger = void 0;
const createLoggerFunction = (consoleMethod, prefix, name) => consoleMethod.bind(console, prefix, name ? `[${name}]` : "");
/**
 * 生成 Logger
 * @param name 前缀
 * @returns console.log
 */
const useLogger = (name) => {
    const prefix = "AkagiYui";
    return {
        log: createLoggerFunction(console.log, prefix, name),
        warn: createLoggerFunction(console.warn, prefix, name),
        error: createLoggerFunction(console.error, prefix, name),
        info: createLoggerFunction(console.info, prefix, name),
        debug: createLoggerFunction(console.debug, prefix, name),
        useLogger: (subName) => (0, exports.useLogger)(`${name ? name + ":" : ""}${subName}`),
    };
};
exports.useLogger = useLogger;


/***/ }),

/***/ 997:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.useBooleanMenu = void 0;
/**
 * 布尔菜单配置
 * @param configs 配置项
 * @returns 配置获取函数
 */
const useBooleanMenu = (configs) => {
    // 缓存
    const cache = {};
    // 获取配置
    const getConfig = (key) => {
        if (cache[key] !== undefined) {
            return cache[key];
        }
        let value = GM_getValue(key, configs[key].defaultValue);
        cache[key] = value;
        return value;
    };
    // 配置注册
    let menuIds = [];
    const registerMenuCommand = () => {
        menuIds.forEach((id) => {
            GM_unregisterMenuCommand(id);
        });
        menuIds = [];
        Object.entries(configs).forEach(([key, config]) => {
            let commandName = getConfig(key) ? "✅" : "❌";
            commandName += ` ${config.title}`;
            let id = GM_registerMenuCommand(commandName, () => {
                let newValue = !getConfig(key);
                let valueToSet = config.callback ? config.callback(newValue) : newValue;
                GM_setValue(key, valueToSet);
                cache[key] = valueToSet;
                registerMenuCommand();
            });
            menuIds.push(id);
        });
    };
    registerMenuCommand();
    return { getConfig };
};
exports.useBooleanMenu = useBooleanMenu;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(507);
/******/ 	
/******/ })()
;