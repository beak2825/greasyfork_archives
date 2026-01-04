// ==UserScript==
// @name        FA Watches Favorites Viewer
// @namespace   Violentmonkey Scripts
// @match       *://*.furaffinity.net/*
// @require     https://update.greasyfork.org/scripts/525666/1549449/Furaffinity-Prototype-Extensions.js
// @require     https://update.greasyfork.org/scripts/483952/1672922/Furaffinity-Request-Helper.js
// @require     https://update.greasyfork.org/scripts/485827/1549457/Furaffinity-Match-List.js
// @require     https://update.greasyfork.org/scripts/528997/1549467/Furaffinity-Message-Box.js
// @require     https://update.greasyfork.org/scripts/485153/1549461/Furaffinity-Loading-Animations.js
// @require     https://update.greasyfork.org/scripts/476762/1549463/Furaffinity-Custom-Pages.js
// @require     https://update.greasyfork.org/scripts/475041/1617223/Furaffinity-Custom-Settings.js
// @grant       GM_info
// @version     3.0.15
// @author      Midori Dragon
// @description Scans the Favorites of your Watches for new Favorites and shows a Button to view these (if any where found). (Works like Submission Page)
// @icon        https://www.furaffinity.net/themes/beta/img/banners/fa_logo.png
// @license     MIT
// @homepageURL https://greasyfork.org/scripts/463464-fa-watches-favorites-viewer
// @supportURL  https://greasyfork.org/scripts/463464-fa-watches-favorites-viewer/feedback
// @downloadURL https://update.greasyfork.org/scripts/463464/FA%20Watches%20Favorites%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/463464/FA%20Watches%20Favorites%20Viewer.meta.js
// ==/UserScript==
// jshint esversion: 8
(() => {
    "use strict";
    var __webpack_modules__ = {
        56: (module, __unused_webpack_exports, __webpack_require__) => {
            module.exports = function setAttributesWithoutAttributes(styleElement) {
                var nonce = true ? __webpack_require__.nc : 0;
                if (nonce) {
                    styleElement.setAttribute("nonce", nonce);
                }
            };
        },
        72: module => {
            var stylesInDOM = [];
            function getIndexByIdentifier(identifier) {
                var result = -1;
                for (var i = 0; i < stylesInDOM.length; i++) {
                    if (stylesInDOM[i].identifier === identifier) {
                        result = i;
                        break;
                    }
                }
                return result;
            }
            function modulesToDom(list, options) {
                var idCountMap = {};
                var identifiers = [];
                for (var i = 0; i < list.length; i++) {
                    var item = list[i];
                    var id = options.base ? item[0] + options.base : item[0];
                    var count = idCountMap[id] || 0;
                    var identifier = "".concat(id, " ").concat(count);
                    idCountMap[id] = count + 1;
                    var indexByIdentifier = getIndexByIdentifier(identifier);
                    var obj = {
                        css: item[1],
                        media: item[2],
                        sourceMap: item[3],
                        supports: item[4],
                        layer: item[5]
                    };
                    if (-1 !== indexByIdentifier) {
                        stylesInDOM[indexByIdentifier].references++;
                        stylesInDOM[indexByIdentifier].updater(obj);
                    } else {
                        var updater = addElementStyle(obj, options);
                        options.byIndex = i;
                        stylesInDOM.splice(i, 0, {
                            identifier,
                            updater,
                            references: 1
                        });
                    }
                    identifiers.push(identifier);
                }
                return identifiers;
            }
            function addElementStyle(obj, options) {
                var api = options.domAPI(options);
                api.update(obj);
                return function updater(newObj) {
                    if (newObj) {
                        if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
                            return;
                        }
                        api.update(obj = newObj);
                    } else {
                        api.remove();
                    }
                };
            }
            module.exports = function(list, options) {
                var lastIdentifiers = modulesToDom(list = list || [], options = options || {});
                return function update(newList) {
                    newList = newList || [];
                    for (var i = 0; i < lastIdentifiers.length; i++) {
                        var index = getIndexByIdentifier(lastIdentifiers[i]);
                        stylesInDOM[index].references--;
                    }
                    var newLastIdentifiers = modulesToDom(newList, options);
                    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
                        var _index = getIndexByIdentifier(lastIdentifiers[_i]);
                        if (0 === stylesInDOM[_index].references) {
                            stylesInDOM[_index].updater();
                            stylesInDOM.splice(_index, 1);
                        }
                    }
                    lastIdentifiers = newLastIdentifiers;
                };
            };
        },
        113: module => {
            module.exports = function styleTagTransform(css, styleElement) {
                if (styleElement.styleSheet) {
                    styleElement.styleSheet.cssText = css;
                } else {
                    for (;styleElement.firstChild; ) {
                        styleElement.removeChild(styleElement.firstChild);
                    }
                    styleElement.appendChild(document.createTextNode(css));
                }
            };
        },
        314: module => {
            module.exports = function(cssWithMappingToString) {
                var list = [];
                list.toString = function toString() {
                    return this.map(function(item) {
                        var content = "";
                        var needLayer = "undefined" !== typeof item[5];
                        if (item[4]) {
                            content += "@supports (".concat(item[4], ") {");
                        }
                        if (item[2]) {
                            content += "@media ".concat(item[2], " {");
                        }
                        if (needLayer) {
                            content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
                        }
                        content += cssWithMappingToString(item);
                        if (needLayer) {
                            content += "}";
                        }
                        if (item[2]) {
                            content += "}";
                        }
                        if (item[4]) {
                            content += "}";
                        }
                        return content;
                    }).join("");
                };
                list.i = function i(modules, media, dedupe, supports, layer) {
                    if ("string" === typeof modules) {
                        modules = [ [ null, modules, void 0 ] ];
                    }
                    var alreadyImportedModules = {};
                    if (dedupe) {
                        for (var k = 0; k < this.length; k++) {
                            var id = this[k][0];
                            if (null != id) {
                                alreadyImportedModules[id] = true;
                            }
                        }
                    }
                    for (var _k = 0; _k < modules.length; _k++) {
                        var item = [].concat(modules[_k]);
                        if (!dedupe || !alreadyImportedModules[item[0]]) {
                            if ("undefined" !== typeof layer) {
                                if ("undefined" === typeof item[5]) {
                                    item[5] = layer;
                                } else {
                                    item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
                                    item[5] = layer;
                                }
                            }
                            if (media) {
                                if (!item[2]) {
                                    item[2] = media;
                                } else {
                                    item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
                                    item[2] = media;
                                }
                            }
                            if (supports) {
                                if (!item[4]) {
                                    item[4] = "".concat(supports);
                                } else {
                                    item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
                                    item[4] = supports;
                                }
                            }
                            list.push(item);
                        }
                    }
                };
                return list;
            };
        },
        540: module => {
            module.exports = function insertStyleElement(options) {
                var element = document.createElement("style");
                options.setAttributes(element, options.attributes);
                options.insert(element, options.options);
                return element;
            };
        },
        601: module => {
            module.exports = function(i) {
                return i[1];
            };
        },
        659: module => {
            var memo = {};
            module.exports = function insertBySelector(insert, style) {
                var target = function getTarget(target) {
                    if ("undefined" === typeof memo[target]) {
                        var styleTarget = document.querySelector(target);
                        if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
                            try {
                                styleTarget = styleTarget.contentDocument.head;
                            } catch (e) {
                                styleTarget = null;
                            }
                        }
                        memo[target] = styleTarget;
                    }
                    return memo[target];
                }(insert);
                if (!target) {
                    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
                }
                target.appendChild(style);
            };
        },
        825: module => {
            module.exports = function domAPI(options) {
                if ("undefined" === typeof document) {
                    return {
                        update: function update() {},
                        remove: function remove() {}
                    };
                }
                var styleElement = options.insertStyleElement(options);
                return {
                    update: function update(obj) {
                        !function apply(styleElement, options, obj) {
                            var css = "";
                            if (obj.supports) {
                                css += "@supports (".concat(obj.supports, ") {");
                            }
                            if (obj.media) {
                                css += "@media ".concat(obj.media, " {");
                            }
                            var needLayer = "undefined" !== typeof obj.layer;
                            if (needLayer) {
                                css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
                            }
                            css += obj.css;
                            if (needLayer) {
                                css += "}";
                            }
                            if (obj.media) {
                                css += "}";
                            }
                            if (obj.supports) {
                                css += "}";
                            }
                            var sourceMap = obj.sourceMap;
                            if (sourceMap && "undefined" !== typeof btoa) {
                                css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
                            }
                            options.styleTagTransform(css, styleElement, options.options);
                        }(styleElement, options, obj);
                    },
                    remove: function remove() {
                        !function removeStyleElement(styleElement) {
                            if (null === styleElement.parentNode) {
                                return false;
                            }
                            styleElement.parentNode.removeChild(styleElement);
                        }(styleElement);
                    }
                };
            };
        },
        978: (module, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.d(__webpack_exports__, {
                A: () => __WEBPACK_DEFAULT_EXPORT__
            });
            var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
            var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
            var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
            var ___CSS_LOADER_EXPORT___ = __webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
            ___CSS_LOADER_EXPORT___.push([ module.id, '/* Base styles */\n.message-box-overlay {\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    background-color: rgba(0, 0, 0, 0.5);\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    z-index: 9999;\n}\n\n/* Dark theme (default) */\n.message-box-container {\n    border: 1px solid #444;\n    border-radius: 5px;\n    padding: 20px;\n    max-width: 500px;\n    width: 100%;\n    font-family: Arial, sans-serif;\n    transition: background-color 0.3s, color 0.3s, border-color 0.3s, box-shadow 0.3s;\n}\n\n.message-box-header {\n    display: flex;\n    align-items: center;\n    margin-bottom: 15px;\n}\n\n.message-box-icon-container {\n    margin-right: 15px;\n    width: 32px;\n    height: 32px;\n    flex-shrink: 0;\n}\n\n.message-box-title {\n    font-size: 18px;\n    font-weight: bold;\n    margin: 0;\n    transition: color 0.3s;\n}\n\n.message-box-content {\n    margin-bottom: 20px;\n    line-height: 1.5;\n    transition: color 0.3s;\n}\n\n.message-box-button-container {\n    display: flex;\n    justify-content: flex-end;\n    gap: 10px;\n}\n\n.message-box-button {\n    padding: 8px 16px;\n    border: none;\n    border-radius: 4px;\n    cursor: pointer;\n    font-size: 14px;\n    font-weight: bold;\n    background-color: #f1efeb;\n    transition: background-color 0.2s, color 0.2s, border-color 0.2s;\n}\n\n.message-box-button:hover {\n    background-color: #e0ded8;\n}\n\n/* Theme: Dark */\nbody[class*="theme-dark"] .message-box-container {\n    background-color: #353b45;\n    border-color: #444;\n    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);\n}\n\nbody[class*="theme-dark"] .message-box-button {\n    background-color: #434b5b;\n}\n\nbody[class*="theme-dark"] .message-box-button:hover {\n    background-color: #576175;\n}\n\n/* Theme: Aurora */\nbody[class*="theme-aurora"] .message-box-container {\n    background-color: #262931;\n    border-color: #444;\n    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);\n}\n\nbody[class*="theme-aurora"] .message-box-button {\n    background-color: #65707c;\n}\n\nbody[class*="theme-aurora"] .message-box-button:hover {\n    background-color: #8692a0;\n}\n\n/* Theme: Retro */\nbody[class*="theme-retro"] .message-box-container {\n    background-color: #2e3b41;\n    border-color: #444;\n    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);\n}\n\nbody[class*="theme-retro"] .message-box-button {\n    background-color: #4c585e;\n}\n\nbody[class*="theme-retro"] .message-box-button:hover {\n    background-color: #7b909a;\n}\n\n/* Theme: Slate */\nbody[class*="theme-slate"] .message-box-container {\n    background-color: #202225;\n    border-color: #444;\n    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);\n}\n\nbody[class*="theme-slate"] .message-box-button {\n    background-color: #8c8c8c;\n}\n\nbody[class*="theme-slate"] .message-box-button:hover {\n    background-color: #b3b1b1;\n}\n\n/* Theme: Light - already defined in base styles */\nbody[class*="theme-light"] .message-box-container {\n    background-color: #f7f7f7;\n    border-color: #ccc;\n    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);\n}\n\nbody[class*="theme-light"] .message-box-button {\n    background-color: #f1efeb;\n}\n\nbody[class*="theme-light"] .message-box-button:hover {\n    background-color: #f1ede7;\n}\n', "" ]);
            const __WEBPACK_DEFAULT_EXPORT__ = ___CSS_LOADER_EXPORT___;
        },
        988: (module, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.d(__webpack_exports__, {
                A: () => __WEBPACK_DEFAULT_EXPORT__
            });
            var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
            var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
            var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
            var ___CSS_LOADER_EXPORT___ = __webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
            ___CSS_LOADER_EXPORT___.push([ module.id, ".wfv-watch-container {\n    position: relative;\n    display: inline-block;\n}\n\n.wfv-watch-container img {\n    display: block;\n    width: 100%;\n    transition: opacity 0.2s ease;\n}\n\n.wfv-watch-container .wfv-ignore-text {\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n    color: white;\n    font-size: 20px;\n    font-weight: bold;\n    opacity: 0;\n    transition: opacity 0.2s ease;\n}\n\n.wfv-watch-container:hover img {\n    opacity: 0.5;\n}\n\n.wfv-watch-container:hover .wfv-ignore-text {\n    opacity: 1;\n}\n\n.wfv-watch-container.ignored img {\n    opacity: 0.2;\n}\n\n.wfv-watch-container.ignored:hover img {\n    opacity: 0.5;\n}\n", "" ]);
            const __WEBPACK_DEFAULT_EXPORT__ = ___CSS_LOADER_EXPORT___;
        }
    };
    var __webpack_module_cache__ = {};
    function __webpack_require__(moduleId) {
        var cachedModule = __webpack_module_cache__[moduleId];
        if (void 0 !== cachedModule) {
            return cachedModule.exports;
        }
        var module = __webpack_module_cache__[moduleId] = {
            id: moduleId,
            exports: {}
        };
        __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
        return module.exports;
    }
    __webpack_require__.n = module => {
        var getter = module && module.__esModule ? () => module.default : () => module;
        __webpack_require__.d(getter, {
            a: getter
        });
        return getter;
    };
    __webpack_require__.d = (exports, definition) => {
        for (var key in definition) {
            if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
                Object.defineProperty(exports, key, {
                    enumerable: true,
                    get: definition[key]
                });
            }
        }
    };
    __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
    __webpack_require__.nc = void 0;
    __webpack_require__.d({}, {
        _d: () => loadingSpinSpeedSetting,
        f7: () => maxAmountOfScannedPagesPerWatcher,
        bJ: () => maxFavsAmountSetting,
        uL: () => requestHelper,
        rz: () => showDetailedMadeByTextSetting,
        lP: () => showDublicateFavsSetting,
        fz: () => showFavFromWatcherSetting
    });
    function getWatchesFromPage(page) {
        try {
            const watchList = [];
            const pageSectionBody = page.getElementById("columnpage").querySelector('div[class="section-body"]');
            const watches = pageSectionBody.querySelector('div[class="flex-watchlist"]').querySelectorAll('div[class="flex-item-watchlist aligncenter"]');
            for (const watch of Array.from(watches).map(elem => elem)) {
                watchList.push(watch);
            }
            return watchList;
        } catch (_a) {
            return [];
        }
    }
    var LogLevel;
    !function(LogLevel) {
        LogLevel[LogLevel.Error = 1] = "Error";
        LogLevel[LogLevel.Warning = 2] = "Warning";
        LogLevel[LogLevel.Info = 3] = "Info";
    }(LogLevel || (LogLevel = {}));
    class Logger {
        static log(logLevel = LogLevel.Warning, ...args) {
            if (null == window.__FF_GLOBAL_LOG_LEVEL__) {
                window.__FF_GLOBAL_LOG_LEVEL__ = LogLevel.Error;
            }
            if (!(logLevel > window.__FF_GLOBAL_LOG_LEVEL__)) {
                switch (logLevel) {
                  case LogLevel.Error:
                    console.error(...args);
                    break;

                  case LogLevel.Warning:
                    console.warn(...args);
                    break;

                  case LogLevel.Info:
                    console.log(...args);
                }
            }
        }
        static setLogLevel(logLevel) {
            window.__FF_GLOBAL_LOG_LEVEL__ = logLevel;
        }
        static logError(...args) {
            Logger.log(LogLevel.Error, ...args);
        }
        static logWarning(...args) {
            Logger.log(LogLevel.Warning, ...args);
        }
        static logInfo(...args) {
            Logger.log(LogLevel.Info, ...args);
        }
    }
    class GMInfo {
        static isBrowserEnvironment() {
            return "undefined" !== typeof browser && "undefined" !== typeof browser.runtime || "undefined" !== typeof chrome && "undefined" !== typeof chrome.runtime;
        }
        static getBrowserAPI() {
            if ("undefined" !== typeof GM_info && null != GM_info) {
                return GM_info;
            } else if ("undefined" !== typeof browser && "undefined" !== typeof browser.runtime) {
                return browser;
            } else if ("undefined" !== typeof chrome && "undefined" !== typeof chrome.runtime) {
                return chrome;
            } else {
                throw new Error("Unsupported browser for SyncedStorage.");
            }
        }
        static get scriptName() {
            if (GMInfo.isBrowserEnvironment()) {
                return GMInfo.getBrowserAPI().runtime.getManifest().name;
            } else {
                return GMInfo.getBrowserAPI().script.name;
            }
        }
        static get scriptVersion() {
            if (GMInfo.isBrowserEnvironment()) {
                return GMInfo.getBrowserAPI().runtime.getManifest().version;
            } else {
                return GMInfo.getBrowserAPI().script.version;
            }
        }
        static get scriptDescription() {
            if (GMInfo.isBrowserEnvironment()) {
                return GMInfo.getBrowserAPI().runtime.getManifest().description;
            } else {
                return GMInfo.getBrowserAPI().script.description;
            }
        }
        static get scriptAuthor() {
            if (GMInfo.isBrowserEnvironment()) {
                return GMInfo.getBrowserAPI().runtime.getManifest().author;
            } else {
                return GMInfo.getBrowserAPI().script.author;
            }
        }
        static get scriptNamespace() {
            if (!GMInfo.isBrowserEnvironment()) {
                return GMInfo.getBrowserAPI().script.namespace;
            }
        }
        static get scriptSource() {
            if (!GMInfo.isBrowserEnvironment()) {
                return GMInfo.getBrowserAPI().script.source;
            }
        }
        static get scriptIcon() {
            if (GMInfo.isBrowserEnvironment()) {
                const manifest = GMInfo.getBrowserAPI().runtime.getManifest();
                let largestIcon = 0;
                for (const key of Object.keys(manifest.icons)) {
                    const size = parseInt(key);
                    if (size > largestIcon) {
                        largestIcon = size;
                    }
                }
                return manifest.icons[largestIcon.toString()];
            } else {
                return GMInfo.getBrowserAPI().script.icon;
            }
        }
        static get scriptIcon64() {
            if (GMInfo.isBrowserEnvironment()) {
                const manifest = GMInfo.getBrowserAPI().runtime.getManifest();
                return null == manifest.icons ? void 0 : manifest.icons[64];
            } else {
                return GMInfo.getBrowserAPI().script.icon64;
            }
        }
        static get scriptAntifeature() {
            if (!GMInfo.isBrowserEnvironment()) {
                return GMInfo.getBrowserAPI().script.antifeature;
            }
        }
        static get scriptOptions() {
            if (!GMInfo.isBrowserEnvironment()) {
                return GMInfo.getBrowserAPI().script.options;
            }
        }
        static get scriptMetaStr() {
            if (GMInfo.isBrowserEnvironment()) {
                return JSON.stringify(GMInfo.getBrowserAPI().runtime.getManifest());
            } else {
                return GMInfo.getBrowserAPI().scriptMetaStr;
            }
        }
        static get scriptHandler() {
            if (GMInfo.isBrowserEnvironment()) {
                return "undefined" !== typeof browser ? "Firefox" : "Chrome";
            } else {
                return GMInfo.getBrowserAPI().scriptHandler;
            }
        }
        static get scriptUpdateURL() {
            if (GMInfo.isBrowserEnvironment()) {
                return GMInfo.getBrowserAPI().runtime.getManifest().update_url;
            } else {
                return GMInfo.getBrowserAPI().scriptUpdateURL;
            }
        }
        static get scriptWillUpdate() {
            if (!GMInfo.isBrowserEnvironment()) {
                return GMInfo.getBrowserAPI().scriptWillUpdate;
            }
        }
        static get scriptResources() {
            if (!GMInfo.isBrowserEnvironment()) {
                return GMInfo.getBrowserAPI().scriptResources;
            }
        }
        static get downloadMode() {
            if (!GMInfo.isBrowserEnvironment()) {
                return GMInfo.getBrowserAPI().downloadMode;
            }
        }
    }
    var __awaiter = function(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function(resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator.throw(value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : function adopt(value) {
                    return value instanceof P ? value : new P(function(resolve) {
                        resolve(value);
                    });
                }(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    class SyncedStorage {
        static setItem(key, value) {
            return __awaiter(this, void 0, void 0, function*() {
                if (!GMInfo.isBrowserEnvironment()) {
                    Logger.logWarning("SyncedStorage is only available in browser extensions.");
                    return;
                }
                Logger.logInfo(`Setting item in synced storage: ${key}=${value}`);
                const api = GMInfo.getBrowserAPI();
                if (null != api.storage) {
                    return new Promise((resolve, reject) => {
                        api.storage.sync.set({
                            [key]: value
                        }, () => {
                            if (null != api.runtime.lastError) {
                                return reject(api.runtime.lastError);
                            }
                            resolve();
                        });
                    });
                } else {
                    Logger.logError("Unsupported storage API.");
                }
            });
        }
        static getItem(key) {
            return __awaiter(this, void 0, void 0, function*() {
                if (!GMInfo.isBrowserEnvironment()) {
                    Logger.logWarning("SyncedStorage is only available in browser extensions.");
                    return;
                }
                Logger.logInfo(`Getting item from synced storage: ${key}`);
                const api = GMInfo.getBrowserAPI();
                if (null != api.storage) {
                    return new Promise((resolve, reject) => {
                        api.storage.sync.get(key, result => {
                            if (null != api.runtime.lastError) {
                                return reject(api.runtime.lastError);
                            }
                            resolve(result[key]);
                        });
                    });
                } else {
                    Logger.logError("Unsupported storage API.");
                }
            });
        }
        static getAllItems() {
            return __awaiter(this, void 0, void 0, function*() {
                if (!GMInfo.isBrowserEnvironment()) {
                    Logger.logWarning("SyncedStorage is only available in browser extensions.");
                    return {};
                }
                Logger.logInfo("Getting all items from synced storage");
                const api = GMInfo.getBrowserAPI();
                if (null != api.storage) {
                    return new Promise((resolve, reject) => {
                        api.storage.sync.get(null, result => {
                            if (null != api.runtime.lastError) {
                                return reject(api.runtime.lastError);
                            }
                            resolve(result);
                        });
                    });
                } else {
                    Logger.logError("Unsupported storage API.");
                    return {};
                }
            });
        }
        static removeItem(key) {
            return __awaiter(this, void 0, void 0, function*() {
                if (!GMInfo.isBrowserEnvironment()) {
                    Logger.logWarning("SyncedStorage is only available in browser extensions.");
                    return;
                }
                Logger.logInfo(`Removing item from synced storage: ${key}`);
                const api = GMInfo.getBrowserAPI();
                if (null != api.storage) {
                    return new Promise((resolve, reject) => {
                        api.storage.sync.remove(key, () => {
                            if (null != api.runtime.lastError) {
                                return reject(api.runtime.lastError);
                            }
                            resolve();
                        });
                    });
                } else {
                    Logger.logError("Unsupported storage API.");
                }
            });
        }
    }
    var StorageWrapper_awaiter = function(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function(resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator.throw(value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : function adopt(value) {
                    return value instanceof P ? value : new P(function(resolve) {
                        resolve(value);
                    });
                }(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    class StorageWrapper {
        static setItemAsync(key_1, value_1) {
            return StorageWrapper_awaiter(this, arguments, void 0, function*(key, value, retry = false) {
                try {
                    if (retry) {
                        return yield StorageWrapper.setItemAsyncWithRetry(key, value);
                    }
                    localStorage.setItem(key, value);
                    yield SyncedStorage.setItem(key, value);
                    return true;
                } catch (_a) {
                    Logger.logError(`Failed to set item in storage: ${key}=${value}`);
                    return false;
                }
            });
        }
        static setItemAsyncWithRetry(key, value) {
            return StorageWrapper_awaiter(this, void 0, void 0, function*() {
                return new Promise(resolve => {
                    const attemptSave = () => StorageWrapper_awaiter(this, void 0, void 0, function*() {
                        if (yield StorageWrapper.setItemAsync(key, value)) {
                            resolve(true);
                        } else {
                            Logger.logWarning(`Failed to save item ${key}, retrying in 1000ms...`);
                            setTimeout(() => {
                                attemptSave();
                            }, 1e3);
                        }
                    });
                    attemptSave();
                });
            });
        }
        static getItemAsync(key) {
            return StorageWrapper_awaiter(this, void 0, void 0, function*() {
                try {
                    const valueLocal = localStorage.getItem(key);
                    const valueSynced = yield SyncedStorage.getItem(key);
                    if (valueSynced === valueLocal) {
                        return valueSynced;
                    } else {
                        return null !== valueSynced && void 0 !== valueSynced ? valueSynced : valueLocal;
                    }
                } catch (_a) {
                    Logger.logError(`Failed to get item from storage: ${key}`);
                    return null;
                }
            });
        }
        static removeItemAsync(key) {
            return StorageWrapper_awaiter(this, void 0, void 0, function*() {
                try {
                    localStorage.removeItem(key);
                    yield SyncedStorage.removeItem(key);
                    return true;
                } catch (_a) {
                    Logger.logError(`Failed to remove item from storage: ${key}`);
                    return false;
                }
            });
        }
        static getAllItemsAsync() {
            return StorageWrapper_awaiter(this, void 0, void 0, function*() {
                try {
                    const localStorageItems = {};
                    for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (null == key) {
                            continue;
                        }
                        const value = localStorage.getItem(key);
                        localStorageItems[key] = value;
                    }
                    const syncedItems = yield SyncedStorage.getAllItems();
                    return Object.assign(Object.assign({}, localStorageItems), syncedItems);
                } catch (_a) {
                    Logger.logError("Failed to get all items from storage");
                    return {};
                }
            });
        }
    }
    var IgnoreList_awaiter = function(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function(resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator.throw(value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : function adopt(value) {
                    return value instanceof P ? value : new P(function(resolve) {
                        resolve(value);
                    });
                }(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    class IgnoreList {
        static add(username) {
            return IgnoreList_awaiter(this, void 0, void 0, function*() {
                var _a;
                const usernames = null !== (_a = yield this.getIgnoreList()) && void 0 !== _a ? _a : [];
                if (usernames.includes(username)) {
                    return;
                }
                usernames.push(username);
                const json = JSON.stringify(usernames);
                yield StorageWrapper.setItemAsync(this.id, json);
            });
        }
        static remove(username) {
            return IgnoreList_awaiter(this, void 0, void 0, function*() {
                var _a;
                const usernames = null !== (_a = yield this.getIgnoreList()) && void 0 !== _a ? _a : [];
                if (!usernames.includes(username)) {
                    return;
                }
                usernames.splice(usernames.indexOf(username), 1);
                if (0 === usernames.length) {
                    yield StorageWrapper.removeItemAsync(this.id);
                    return;
                }
                const json = JSON.stringify(usernames);
                yield StorageWrapper.setItemAsync(this.id, json);
            });
        }
        static isIgnored(username) {
            return IgnoreList_awaiter(this, void 0, void 0, function*() {
                var _a;
                const usernames = yield this.getIgnoreList();
                return null !== (_a = null === usernames || void 0 === usernames ? void 0 : usernames.includes(username)) && void 0 !== _a ? _a : false;
            });
        }
        static setIgnoreList(usernames) {
            return IgnoreList_awaiter(this, void 0, void 0, function*() {
                if (0 === usernames.length) {
                    yield StorageWrapper.removeItemAsync(this.id);
                    return;
                }
                const json = JSON.stringify(usernames);
                yield StorageWrapper.setItemAsync(this.id, json);
            });
        }
        static getIgnoreList() {
            return IgnoreList_awaiter(this, void 0, void 0, function*() {
                var _a;
                const json = null !== (_a = yield StorageWrapper.getItemAsync(this.id)) && void 0 !== _a ? _a : "[]";
                return JSON.parse(json);
            });
        }
    }
    IgnoreList.id = "wfv-ignore-list";
    var injectStylesIntoStyleTag = __webpack_require__(72);
    var injectStylesIntoStyleTag_default = __webpack_require__.n(injectStylesIntoStyleTag);
    var styleDomAPI = __webpack_require__(825);
    var styleDomAPI_default = __webpack_require__.n(styleDomAPI);
    var insertBySelector = __webpack_require__(659);
    var insertBySelector_default = __webpack_require__.n(insertBySelector);
    var setAttributesWithoutAttributes = __webpack_require__(56);
    var setAttributesWithoutAttributes_default = __webpack_require__.n(setAttributesWithoutAttributes);
    var insertStyleElement = __webpack_require__(540);
    var insertStyleElement_default = __webpack_require__.n(insertStyleElement);
    var styleTagTransform = __webpack_require__(113);
    var styleTagTransform_default = __webpack_require__.n(styleTagTransform);
    var Style = __webpack_require__(988);
    var options = {};
    options.styleTagTransform = styleTagTransform_default();
    options.setAttributes = setAttributesWithoutAttributes_default();
    options.insert = insertBySelector_default().bind(null, "head");
    options.domAPI = styleDomAPI_default();
    options.insertStyleElement = insertStyleElement_default();
    injectStylesIntoStyleTag_default()(Style.A, options);
    Style.A && Style.A.locals && Style.A.locals;
    var BuddyListManager_awaiter = function(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function(resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator.throw(value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : function adopt(value) {
                    return value instanceof P ? value : new P(function(resolve) {
                        resolve(value);
                    });
                }(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    class BuddyListManager {
        constructor() {
            this.watchList = [];
            window.dispatchEvent(new CustomEvent("ig-stop-detection"));
            const columnPage = document.getElementById("columnpage");
            this.sectionBody = columnPage.querySelector('div[class="section-body"]');
            this.sectionBody.innerHTML = "";
            this.initialize();
        }
        initialize() {
            return BuddyListManager_awaiter(this, void 0, void 0, function*() {
                var _a;
                yield this.showBuddyList();
                const buttonContainer = document.createElement("div");
                buttonContainer.id = "wfv-buddylist-button-container";
                buttonContainer.style.display = "flex";
                buttonContainer.style.justifyContent = "flex-end";
                buttonContainer.style.gap = "8px";
                const input = document.createElement("input");
                input.type = "file";
                input.accept = ".json";
                input.addEventListener("change", e => {
                    this.importBuddyList(e);
                });
                const importButton = document.createElement("button");
                importButton.id = "wfv-import-button";
                importButton.classList.add("button", "standard");
                importButton.textContent = "Import";
                importButton.addEventListener("click", () => input.click());
                buttonContainer.appendChild(importButton);
                const exportButton = document.createElement("button");
                exportButton.id = "wfv-export-button";
                exportButton.classList.add("button", "standard");
                exportButton.textContent = "Export";
                exportButton.addEventListener("click", () => {
                    this.exportBuddyList();
                });
                buttonContainer.appendChild(exportButton);
                const br = document.createElement("br");
                null === (_a = this.sectionBody.firstChild) || void 0 === _a || _a.insertBeforeThis(br);
                br.insertAfterThis(buttonContainer);
            });
        }
        showBuddyList() {
            return BuddyListManager_awaiter(this, void 0, void 0, function*() {
                const loadingSpinner = new window.FALoadingSpinner(this.sectionBody);
                loadingSpinner.delay = loadingSpinSpeedSetting.value;
                loadingSpinner.spinnerThickness = 6;
                loadingSpinner.visible = true;
                const watchesPages = yield requestHelper.PersonalUserRequests.ManageContent.getAllWatchesPages();
                const watchesToRemove = [];
                for (const watchesPage of watchesPages) {
                    const watches = getWatchesFromPage(watchesPage);
                    for (const watch of watches) {
                        if (!(yield this.editWatchElem(watch))) {
                            watchesToRemove.push(watch);
                        }
                    }
                    watchesToRemove.forEach(watch => watch.remove());
                    this.watchList.push(...watches);
                }
                loadingSpinner.visible = false;
                const flexWatchList = document.createElement("div");
                flexWatchList.classList.add("flex-watchlist");
                this.sectionBody.appendChild(document.createElement("br"));
                this.sectionBody.appendChild(flexWatchList);
                flexWatchList.append(...this.watchList);
            });
        }
        editWatchElem(watchElem) {
            return BuddyListManager_awaiter(this, void 0, void 0, function*() {
                const imgElem = watchElem.querySelector("img[alt]");
                if (null == imgElem) {
                    return false;
                }
                const username = imgElem.getAttribute("alt");
                const ignored = yield IgnoreList.isIgnored(username);
                const ignoreText = document.createElement("span");
                ignoreText.classList.add("wfv-ignore-text");
                ignoreText.addEventListener("click", () => {
                    this.handleIgnoreClick(watchElem);
                });
                imgElem.insertAfterThis(ignoreText);
                const flexItemWatchlistAvatar = watchElem.querySelector('div[class*="flex-item-watchlist-avatar"]');
                flexItemWatchlistAvatar.classList.add("wfv-watch-container");
                flexItemWatchlistAvatar.style.cursor = "pointer";
                imgElem.addEventListener("click", () => {
                    this.handleIgnoreClick(watchElem);
                });
                const hrefElements = watchElem.querySelectorAll("a[href]");
                if (null != hrefElements) {
                    for (const hrefElement of Array.from(hrefElements)) {
                        hrefElement.removeAttribute("href");
                    }
                }
                const removeElement = watchElem.querySelector('a[class*="remove-link"]');
                null === removeElement || void 0 === removeElement || removeElement.remove();
                watchElem.appendChild(document.createElement("br"));
                this.watchElemSetIgnoreStatus(watchElem, ignored);
                return true;
            });
        }
        watchElemSetIgnoreStatus(watchElem, ignored) {
            watchElem.querySelector('span[class*="wfv-ignore-text"]').textContent = ignored ? "Include" : "Ignore";
            watchElem.querySelector('div[class*="flex-item-watchlist-avatar"]').classList.toggle("ignored", ignored);
            const displayName = watchElem.querySelector('div[class*="flex-item-watchlist-controls"]').querySelector("span[title]");
            displayName.style.textDecoration = ignored ? "line-through" : "none";
            displayName.style.backgroundColor = ignored ? "rgba(255, 0, 0, 0.2)" : "transparent";
        }
        handleIgnoreClick(watchElem) {
            return BuddyListManager_awaiter(this, void 0, void 0, function*() {
                const username = watchElem.querySelector("img[alt]").getAttribute("alt");
                const ignored = yield IgnoreList.isIgnored(username);
                if (ignored) {
                    IgnoreList.remove(username);
                } else {
                    IgnoreList.add(username);
                }
                this.watchElemSetIgnoreStatus(watchElem, !ignored);
            });
        }
        importBuddyList(e) {
            return BuddyListManager_awaiter(this, void 0, void 0, function*() {
                var _a;
                const file = null === (_a = e.target.files) || void 0 === _a ? void 0 : _a[0];
                if (null != file) {
                    try {
                        const text = yield file.text();
                        const ignoreList = JSON.parse(text);
                        yield IgnoreList.setIgnoreList(ignoreList);
                        Logger.logInfo("Buddy list imported successfully");
                        window.location.reload();
                    } catch (error) {
                        Logger.logError("Failed to import buddy list", error);
                    }
                }
            });
        }
        exportBuddyList() {
            return BuddyListManager_awaiter(this, void 0, void 0, function*() {
                const ignoreList = yield IgnoreList.getIgnoreList();
                const json = JSON.stringify(ignoreList, null, 2);
                const blob = new Blob([ json ], {
                    type: "application/json"
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "wfv-excludedusers.json";
                a.click();
                URL.revokeObjectURL(url);
            });
        }
    }
    function checkTags(element) {
        var _a;
        if (!("1" === document.body.getAttribute("data-user-logged-in"))) {
            Logger.logWarning("User is not logged in, skipping tag check");
            setBlockedState(element, false);
            return;
        }
        const tagsHideMissingTags = "1" === document.body.getAttribute("data-tag-blocklist-hide-tagless");
        const tags = null === (_a = element.getAttribute("data-tags")) || void 0 === _a ? void 0 : _a.trim().split(/\s+/);
        let blockReason = "";
        if (null != tags && tags.length > 0 && "" !== tags[0]) {
            const blockedTags = function getBannedTags(tags) {
                var _a;
                const blockedTags = null !== (_a = document.body.getAttribute("data-tag-blocklist")) && void 0 !== _a ? _a : "";
                const tagsBlocklist = Array.from(blockedTags.split(" "));
                let bTags = [];
                if (null == tags || 0 === tags.length) {
                    return [];
                }
                for (const tag of tags) {
                    for (const blockedTag of tagsBlocklist) {
                        if (tag === blockedTag) {
                            bTags.push(blockedTag);
                        }
                    }
                }
                return [ ...new Set(bTags) ];
            }(tags);
            if (blockedTags.length <= 0) {
                setBlockedState(element, false);
            } else {
                setBlockedState(element, true);
                Logger.logInfo(`${element.id} blocked tags: ${blockedTags.join(", ")}`);
                blockReason = "Blocked tags:\n";
                for (const tag of blockedTags) {
                    blockReason += "• " + tag + "\n";
                }
            }
        } else {
            setBlockedState(element, tagsHideMissingTags);
            if (tagsHideMissingTags) {
                blockReason = "Content is missing tags.";
            }
        }
        if ("" !== blockReason && "submissionImg" !== element.id) {
            element.setAttribute("title", blockReason);
        }
    }
    function setBlockedState(element, isBlocked) {
        element.classList[isBlocked ? "add" : "remove"]("blocked-content");
    }
    function zero$1(buf) {
        let len = buf.length;
        for (;--len >= 0; ) {
            buf[len] = 0;
        }
    }
    const extra_lbits = new Uint8Array([ 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0 ]);
    const extra_dbits = new Uint8Array([ 0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13 ]);
    const extra_blbits = new Uint8Array([ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7 ]);
    const bl_order = new Uint8Array([ 16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15 ]);
    const static_ltree = new Array(576);
    zero$1(static_ltree);
    const static_dtree = new Array(60);
    zero$1(static_dtree);
    const _dist_code = new Array(512);
    zero$1(_dist_code);
    const _length_code = new Array(256);
    zero$1(_length_code);
    const base_length = new Array(29);
    zero$1(base_length);
    const base_dist = new Array(30);
    zero$1(base_dist);
    function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {
        this.static_tree = static_tree;
        this.extra_bits = extra_bits;
        this.extra_base = extra_base;
        this.elems = elems;
        this.max_length = max_length;
        this.has_stree = static_tree && static_tree.length;
    }
    let static_l_desc;
    let static_d_desc;
    let static_bl_desc;
    function TreeDesc(dyn_tree, stat_desc) {
        this.dyn_tree = dyn_tree;
        this.max_code = 0;
        this.stat_desc = stat_desc;
    }
    const d_code = dist => dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
    const put_short = (s, w) => {
        s.pending_buf[s.pending++] = 255 & w;
        s.pending_buf[s.pending++] = w >>> 8 & 255;
    };
    const send_bits = (s, value, length) => {
        if (s.bi_valid > 16 - length) {
            s.bi_buf |= value << s.bi_valid & 65535;
            put_short(s, s.bi_buf);
            s.bi_buf = value >> 16 - s.bi_valid;
            s.bi_valid += length - 16;
        } else {
            s.bi_buf |= value << s.bi_valid & 65535;
            s.bi_valid += length;
        }
    };
    const send_code = (s, c, tree) => {
        send_bits(s, tree[2 * c], tree[2 * c + 1]);
    };
    const bi_reverse = (code, len) => {
        let res = 0;
        do {
            res |= 1 & code;
            code >>>= 1;
            res <<= 1;
        } while (--len > 0);
        return res >>> 1;
    };
    const gen_codes = (tree, max_code, bl_count) => {
        const next_code = new Array(16);
        let code = 0;
        let bits;
        let n;
        for (bits = 1; bits <= 15; bits++) {
            code = code + bl_count[bits - 1] << 1;
            next_code[bits] = code;
        }
        for (n = 0; n <= max_code; n++) {
            let len = tree[2 * n + 1];
            if (0 !== len) {
                tree[2 * n] = bi_reverse(next_code[len]++, len);
            }
        }
    };
    const init_block = s => {
        let n;
        for (n = 0; n < 286; n++) {
            s.dyn_ltree[2 * n] = 0;
        }
        for (n = 0; n < 30; n++) {
            s.dyn_dtree[2 * n] = 0;
        }
        for (n = 0; n < 19; n++) {
            s.bl_tree[2 * n] = 0;
        }
        s.dyn_ltree[512] = 1;
        s.opt_len = s.static_len = 0;
        s.sym_next = s.matches = 0;
    };
    const bi_windup = s => {
        if (s.bi_valid > 8) {
            put_short(s, s.bi_buf);
        } else if (s.bi_valid > 0) {
            s.pending_buf[s.pending++] = s.bi_buf;
        }
        s.bi_buf = 0;
        s.bi_valid = 0;
    };
    const smaller = (tree, n, m, depth) => {
        const _n2 = 2 * n;
        const _m2 = 2 * m;
        return tree[_n2] < tree[_m2] || tree[_n2] === tree[_m2] && depth[n] <= depth[m];
    };
    const pqdownheap = (s, tree, k) => {
        const v = s.heap[k];
        let j = k << 1;
        for (;j <= s.heap_len; ) {
            if (j < s.heap_len && smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
                j++;
            }
            if (smaller(tree, v, s.heap[j], s.depth)) {
                break;
            }
            s.heap[k] = s.heap[j];
            k = j;
            j <<= 1;
        }
        s.heap[k] = v;
    };
    const compress_block = (s, ltree, dtree) => {
        let dist;
        let lc;
        let sx = 0;
        let code;
        let extra;
        if (0 !== s.sym_next) {
            do {
                dist = 255 & s.pending_buf[s.sym_buf + sx++];
                dist += (255 & s.pending_buf[s.sym_buf + sx++]) << 8;
                lc = s.pending_buf[s.sym_buf + sx++];
                if (0 === dist) {
                    send_code(s, lc, ltree);
                } else {
                    code = _length_code[lc];
                    send_code(s, code + 256 + 1, ltree);
                    extra = extra_lbits[code];
                    if (0 !== extra) {
                        lc -= base_length[code];
                        send_bits(s, lc, extra);
                    }
                    dist--;
                    code = d_code(dist);
                    send_code(s, code, dtree);
                    extra = extra_dbits[code];
                    if (0 !== extra) {
                        dist -= base_dist[code];
                        send_bits(s, dist, extra);
                    }
                }
            } while (sx < s.sym_next);
        }
        send_code(s, 256, ltree);
    };
    const build_tree = (s, desc) => {
        const tree = desc.dyn_tree;
        const stree = desc.stat_desc.static_tree;
        const has_stree = desc.stat_desc.has_stree;
        const elems = desc.stat_desc.elems;
        let n, m;
        let max_code = -1;
        let node;
        s.heap_len = 0;
        s.heap_max = 573;
        for (n = 0; n < elems; n++) {
            if (0 !== tree[2 * n]) {
                s.heap[++s.heap_len] = max_code = n;
                s.depth[n] = 0;
            } else {
                tree[2 * n + 1] = 0;
            }
        }
        for (;s.heap_len < 2; ) {
            node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
            tree[2 * node] = 1;
            s.depth[node] = 0;
            s.opt_len--;
            if (has_stree) {
                s.static_len -= stree[2 * node + 1];
            }
        }
        desc.max_code = max_code;
        for (n = s.heap_len >> 1; n >= 1; n--) {
            pqdownheap(s, tree, n);
        }
        node = elems;
        do {
            n = s.heap[1];
            s.heap[1] = s.heap[s.heap_len--];
            pqdownheap(s, tree, 1);
            m = s.heap[1];
            s.heap[--s.heap_max] = n;
            s.heap[--s.heap_max] = m;
            tree[2 * node] = tree[2 * n] + tree[2 * m];
            s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
            tree[2 * n + 1] = tree[2 * m + 1] = node;
            s.heap[1] = node++;
            pqdownheap(s, tree, 1);
        } while (s.heap_len >= 2);
        s.heap[--s.heap_max] = s.heap[1];
        ((s, desc) => {
            const tree = desc.dyn_tree;
            const max_code = desc.max_code;
            const stree = desc.stat_desc.static_tree;
            const has_stree = desc.stat_desc.has_stree;
            const extra = desc.stat_desc.extra_bits;
            const base = desc.stat_desc.extra_base;
            const max_length = desc.stat_desc.max_length;
            let h;
            let n, m;
            let bits;
            let xbits;
            let f;
            let overflow = 0;
            for (bits = 0; bits <= 15; bits++) {
                s.bl_count[bits] = 0;
            }
            tree[2 * s.heap[s.heap_max] + 1] = 0;
            for (h = s.heap_max + 1; h < 573; h++) {
                n = s.heap[h];
                bits = tree[2 * tree[2 * n + 1] + 1] + 1;
                if (bits > max_length) {
                    bits = max_length;
                    overflow++;
                }
                tree[2 * n + 1] = bits;
                if (!(n > max_code)) {
                    s.bl_count[bits]++;
                    xbits = 0;
                    if (n >= base) {
                        xbits = extra[n - base];
                    }
                    f = tree[2 * n];
                    s.opt_len += f * (bits + xbits);
                    if (has_stree) {
                        s.static_len += f * (stree[2 * n + 1] + xbits);
                    }
                }
            }
            if (0 !== overflow) {
                do {
                    bits = max_length - 1;
                    for (;0 === s.bl_count[bits]; ) {
                        bits--;
                    }
                    s.bl_count[bits]--;
                    s.bl_count[bits + 1] += 2;
                    s.bl_count[max_length]--;
                    overflow -= 2;
                } while (overflow > 0);
                for (bits = max_length; 0 !== bits; bits--) {
                    n = s.bl_count[bits];
                    for (;0 !== n; ) {
                        m = s.heap[--h];
                        if (!(m > max_code)) {
                            if (tree[2 * m + 1] !== bits) {
                                s.opt_len += (bits - tree[2 * m + 1]) * tree[2 * m];
                                tree[2 * m + 1] = bits;
                            }
                            n--;
                        }
                    }
                }
            }
        })(s, desc);
        gen_codes(tree, max_code, s.bl_count);
    };
    const scan_tree = (s, tree, max_code) => {
        let n;
        let prevlen = -1;
        let curlen;
        let nextlen = tree[1];
        let count = 0;
        let max_count = 7;
        let min_count = 4;
        if (0 === nextlen) {
            max_count = 138;
            min_count = 3;
        }
        tree[2 * (max_code + 1) + 1] = 65535;
        for (n = 0; n <= max_code; n++) {
            curlen = nextlen;
            nextlen = tree[2 * (n + 1) + 1];
            if (!(++count < max_count && curlen === nextlen)) {
                if (count < min_count) {
                    s.bl_tree[2 * curlen] += count;
                } else if (0 !== curlen) {
                    if (curlen !== prevlen) {
                        s.bl_tree[2 * curlen]++;
                    }
                    s.bl_tree[32]++;
                } else if (count <= 10) {
                    s.bl_tree[34]++;
                } else {
                    s.bl_tree[36]++;
                }
                count = 0;
                prevlen = curlen;
                if (0 === nextlen) {
                    max_count = 138;
                    min_count = 3;
                } else if (curlen === nextlen) {
                    max_count = 6;
                    min_count = 3;
                } else {
                    max_count = 7;
                    min_count = 4;
                }
            }
        }
    };
    const send_tree = (s, tree, max_code) => {
        let n;
        let prevlen = -1;
        let curlen;
        let nextlen = tree[1];
        let count = 0;
        let max_count = 7;
        let min_count = 4;
        if (0 === nextlen) {
            max_count = 138;
            min_count = 3;
        }
        for (n = 0; n <= max_code; n++) {
            curlen = nextlen;
            nextlen = tree[2 * (n + 1) + 1];
            if (!(++count < max_count && curlen === nextlen)) {
                if (count < min_count) {
                    do {
                        send_code(s, curlen, s.bl_tree);
                    } while (0 !== --count);
                } else if (0 !== curlen) {
                    if (curlen !== prevlen) {
                        send_code(s, curlen, s.bl_tree);
                        count--;
                    }
                    send_code(s, 16, s.bl_tree);
                    send_bits(s, count - 3, 2);
                } else if (count <= 10) {
                    send_code(s, 17, s.bl_tree);
                    send_bits(s, count - 3, 3);
                } else {
                    send_code(s, 18, s.bl_tree);
                    send_bits(s, count - 11, 7);
                }
                count = 0;
                prevlen = curlen;
                if (0 === nextlen) {
                    max_count = 138;
                    min_count = 3;
                } else if (curlen === nextlen) {
                    max_count = 6;
                    min_count = 3;
                } else {
                    max_count = 7;
                    min_count = 4;
                }
            }
        }
    };
    let static_init_done = false;
    const _tr_stored_block$1 = (s, buf, stored_len, last) => {
        send_bits(s, 0 + (last ? 1 : 0), 3);
        bi_windup(s);
        put_short(s, stored_len);
        put_short(s, ~stored_len);
        if (stored_len) {
            s.pending_buf.set(s.window.subarray(buf, buf + stored_len), s.pending);
        }
        s.pending += stored_len;
    };
    var _tr_flush_block_1 = (s, buf, stored_len, last) => {
        let opt_lenb, static_lenb;
        let max_blindex = 0;
        if (s.level > 0) {
            if (2 === s.strm.data_type) {
                s.strm.data_type = (s => {
                    let block_mask = 4093624447;
                    let n;
                    for (n = 0; n <= 31; n++, block_mask >>>= 1) {
                        if (1 & block_mask && 0 !== s.dyn_ltree[2 * n]) {
                            return 0;
                        }
                    }
                    if (0 !== s.dyn_ltree[18] || 0 !== s.dyn_ltree[20] || 0 !== s.dyn_ltree[26]) {
                        return 1;
                    }
                    for (n = 32; n < 256; n++) {
                        if (0 !== s.dyn_ltree[2 * n]) {
                            return 1;
                        }
                    }
                    return 0;
                })(s);
            }
            build_tree(s, s.l_desc);
            build_tree(s, s.d_desc);
            max_blindex = (s => {
                let max_blindex;
                scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
                scan_tree(s, s.dyn_dtree, s.d_desc.max_code);
                build_tree(s, s.bl_desc);
                for (max_blindex = 18; max_blindex >= 3 && 0 === s.bl_tree[2 * bl_order[max_blindex] + 1]; max_blindex--) {}
                s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
                return max_blindex;
            })(s);
            opt_lenb = s.opt_len + 3 + 7 >>> 3;
            static_lenb = s.static_len + 3 + 7 >>> 3;
            if (static_lenb <= opt_lenb) {
                opt_lenb = static_lenb;
            }
        } else {
            opt_lenb = static_lenb = stored_len + 5;
        }
        if (stored_len + 4 <= opt_lenb && -1 !== buf) {
            _tr_stored_block$1(s, buf, stored_len, last);
        } else if (4 === s.strategy || static_lenb === opt_lenb) {
            send_bits(s, 2 + (last ? 1 : 0), 3);
            compress_block(s, static_ltree, static_dtree);
        } else {
            send_bits(s, 4 + (last ? 1 : 0), 3);
            ((s, lcodes, dcodes, blcodes) => {
                let rank;
                send_bits(s, lcodes - 257, 5);
                send_bits(s, dcodes - 1, 5);
                send_bits(s, blcodes - 4, 4);
                for (rank = 0; rank < blcodes; rank++) {
                    send_bits(s, s.bl_tree[2 * bl_order[rank] + 1], 3);
                }
                send_tree(s, s.dyn_ltree, lcodes - 1);
                send_tree(s, s.dyn_dtree, dcodes - 1);
            })(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
            compress_block(s, s.dyn_ltree, s.dyn_dtree);
        }
        init_block(s);
        if (last) {
            bi_windup(s);
        }
    };
    var trees = {
        _tr_init: s => {
            if (!static_init_done) {
                (() => {
                    let n;
                    let bits;
                    let length;
                    let code;
                    let dist;
                    const bl_count = new Array(16);
                    length = 0;
                    for (code = 0; code < 28; code++) {
                        base_length[code] = length;
                        for (n = 0; n < 1 << extra_lbits[code]; n++) {
                            _length_code[length++] = code;
                        }
                    }
                    _length_code[length - 1] = code;
                    dist = 0;
                    for (code = 0; code < 16; code++) {
                        base_dist[code] = dist;
                        for (n = 0; n < 1 << extra_dbits[code]; n++) {
                            _dist_code[dist++] = code;
                        }
                    }
                    dist >>= 7;
                    for (;code < 30; code++) {
                        base_dist[code] = dist << 7;
                        for (n = 0; n < 1 << extra_dbits[code] - 7; n++) {
                            _dist_code[256 + dist++] = code;
                        }
                    }
                    for (bits = 0; bits <= 15; bits++) {
                        bl_count[bits] = 0;
                    }
                    n = 0;
                    for (;n <= 143; ) {
                        static_ltree[2 * n + 1] = 8;
                        n++;
                        bl_count[8]++;
                    }
                    for (;n <= 255; ) {
                        static_ltree[2 * n + 1] = 9;
                        n++;
                        bl_count[9]++;
                    }
                    for (;n <= 279; ) {
                        static_ltree[2 * n + 1] = 7;
                        n++;
                        bl_count[7]++;
                    }
                    for (;n <= 287; ) {
                        static_ltree[2 * n + 1] = 8;
                        n++;
                        bl_count[8]++;
                    }
                    gen_codes(static_ltree, 287, bl_count);
                    for (n = 0; n < 30; n++) {
                        static_dtree[2 * n + 1] = 5;
                        static_dtree[2 * n] = bi_reverse(n, 5);
                    }
                    static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, 257, 286, 15);
                    static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, 30, 15);
                    static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, 19, 7);
                })();
                static_init_done = true;
            }
            s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc);
            s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc);
            s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);
            s.bi_buf = 0;
            s.bi_valid = 0;
            init_block(s);
        },
        _tr_stored_block: _tr_stored_block$1,
        _tr_flush_block: _tr_flush_block_1,
        _tr_tally: (s, dist, lc) => {
            s.pending_buf[s.sym_buf + s.sym_next++] = dist;
            s.pending_buf[s.sym_buf + s.sym_next++] = dist >> 8;
            s.pending_buf[s.sym_buf + s.sym_next++] = lc;
            if (0 === dist) {
                s.dyn_ltree[2 * lc]++;
            } else {
                s.matches++;
                dist--;
                s.dyn_ltree[2 * (_length_code[lc] + 256 + 1)]++;
                s.dyn_dtree[2 * d_code(dist)]++;
            }
            return s.sym_next === s.sym_end;
        },
        _tr_align: s => {
            send_bits(s, 2, 3);
            send_code(s, 256, static_ltree);
            (s => {
                if (16 === s.bi_valid) {
                    put_short(s, s.bi_buf);
                    s.bi_buf = 0;
                    s.bi_valid = 0;
                } else if (s.bi_valid >= 8) {
                    s.pending_buf[s.pending++] = 255 & s.bi_buf;
                    s.bi_buf >>= 8;
                    s.bi_valid -= 8;
                }
            })(s);
        }
    };
    var adler32_1 = (adler, buf, len, pos) => {
        let s1 = 65535 & adler, s2 = adler >>> 16 & 65535, n = 0;
        for (;0 !== len; ) {
            n = len > 2e3 ? 2e3 : len;
            len -= n;
            do {
                s1 = s1 + buf[pos++] | 0;
                s2 = s2 + s1 | 0;
            } while (--n);
            s1 %= 65521;
            s2 %= 65521;
        }
        return s1 | s2 << 16;
    };
    const crcTable = new Uint32Array((() => {
        let c, table = [];
        for (var n = 0; n < 256; n++) {
            c = n;
            for (var k = 0; k < 8; k++) {
                c = 1 & c ? 3988292384 ^ c >>> 1 : c >>> 1;
            }
            table[n] = c;
        }
        return table;
    })());
    var crc32_1 = (crc, buf, len, pos) => {
        const t = crcTable;
        const end = pos + len;
        crc ^= -1;
        for (let i = pos; i < end; i++) {
            crc = crc >>> 8 ^ t[255 & (crc ^ buf[i])];
        }
        return -1 ^ crc;
    };
    var messages = {
        2: "need dictionary",
        1: "stream end",
        0: "",
        "-1": "file error",
        "-2": "stream error",
        "-3": "data error",
        "-4": "insufficient memory",
        "-5": "buffer error",
        "-6": "incompatible version"
    };
    var constants$2 = {
        Z_NO_FLUSH: 0,
        Z_PARTIAL_FLUSH: 1,
        Z_SYNC_FLUSH: 2,
        Z_FULL_FLUSH: 3,
        Z_FINISH: 4,
        Z_BLOCK: 5,
        Z_TREES: 6,
        Z_OK: 0,
        Z_STREAM_END: 1,
        Z_NEED_DICT: 2,
        Z_ERRNO: -1,
        Z_STREAM_ERROR: -2,
        Z_DATA_ERROR: -3,
        Z_MEM_ERROR: -4,
        Z_BUF_ERROR: -5,
        Z_NO_COMPRESSION: 0,
        Z_BEST_SPEED: 1,
        Z_BEST_COMPRESSION: 9,
        Z_DEFAULT_COMPRESSION: -1,
        Z_FILTERED: 1,
        Z_HUFFMAN_ONLY: 2,
        Z_RLE: 3,
        Z_FIXED: 4,
        Z_DEFAULT_STRATEGY: 0,
        Z_BINARY: 0,
        Z_TEXT: 1,
        Z_UNKNOWN: 2,
        Z_DEFLATED: 8
    };
    const {_tr_init, _tr_stored_block, _tr_flush_block, _tr_tally, _tr_align} = trees;
    const {Z_NO_FLUSH: Z_NO_FLUSH$2, Z_PARTIAL_FLUSH, Z_FULL_FLUSH: Z_FULL_FLUSH$1, Z_FINISH: Z_FINISH$3, Z_BLOCK: Z_BLOCK$1, Z_OK: Z_OK$3, Z_STREAM_END: Z_STREAM_END$3, Z_STREAM_ERROR: Z_STREAM_ERROR$2, Z_DATA_ERROR: Z_DATA_ERROR$2, Z_BUF_ERROR: Z_BUF_ERROR$1, Z_DEFAULT_COMPRESSION: Z_DEFAULT_COMPRESSION$1, Z_FILTERED, Z_HUFFMAN_ONLY, Z_RLE, Z_FIXED, Z_DEFAULT_STRATEGY: Z_DEFAULT_STRATEGY$1, Z_UNKNOWN, Z_DEFLATED: Z_DEFLATED$2} = constants$2;
    const err = (strm, errorCode) => {
        strm.msg = messages[errorCode];
        return errorCode;
    };
    const rank = f => 2 * f - (f > 4 ? 9 : 0);
    const zero = buf => {
        let len = buf.length;
        for (;--len >= 0; ) {
            buf[len] = 0;
        }
    };
    const slide_hash = s => {
        let n, m;
        let p;
        let wsize = s.w_size;
        n = s.hash_size;
        p = n;
        do {
            m = s.head[--p];
            s.head[p] = m >= wsize ? m - wsize : 0;
        } while (--n);
        n = wsize;
        p = n;
        do {
            m = s.prev[--p];
            s.prev[p] = m >= wsize ? m - wsize : 0;
        } while (--n);
    };
    let HASH = (s, prev, data) => (prev << s.hash_shift ^ data) & s.hash_mask;
    const flush_pending = strm => {
        const s = strm.state;
        let len = s.pending;
        if (len > strm.avail_out) {
            len = strm.avail_out;
        }
        if (0 !== len) {
            strm.output.set(s.pending_buf.subarray(s.pending_out, s.pending_out + len), strm.next_out);
            strm.next_out += len;
            s.pending_out += len;
            strm.total_out += len;
            strm.avail_out -= len;
            s.pending -= len;
            if (0 === s.pending) {
                s.pending_out = 0;
            }
        }
    };
    const flush_block_only = (s, last) => {
        _tr_flush_block(s, s.block_start >= 0 ? s.block_start : -1, s.strstart - s.block_start, last);
        s.block_start = s.strstart;
        flush_pending(s.strm);
    };
    const put_byte = (s, b) => {
        s.pending_buf[s.pending++] = b;
    };
    const putShortMSB = (s, b) => {
        s.pending_buf[s.pending++] = b >>> 8 & 255;
        s.pending_buf[s.pending++] = 255 & b;
    };
    const read_buf = (strm, buf, start, size) => {
        let len = strm.avail_in;
        if (len > size) {
            len = size;
        }
        if (0 === len) {
            return 0;
        }
        strm.avail_in -= len;
        buf.set(strm.input.subarray(strm.next_in, strm.next_in + len), start);
        if (1 === strm.state.wrap) {
            strm.adler = adler32_1(strm.adler, buf, len, start);
        } else if (2 === strm.state.wrap) {
            strm.adler = crc32_1(strm.adler, buf, len, start);
        }
        strm.next_in += len;
        strm.total_in += len;
        return len;
    };
    const longest_match = (s, cur_match) => {
        let chain_length = s.max_chain_length;
        let scan = s.strstart;
        let match;
        let len;
        let best_len = s.prev_length;
        let nice_match = s.nice_match;
        const limit = s.strstart > s.w_size - 262 ? s.strstart - (s.w_size - 262) : 0;
        const _win = s.window;
        const wmask = s.w_mask;
        const prev = s.prev;
        const strend = s.strstart + 258;
        let scan_end1 = _win[scan + best_len - 1];
        let scan_end = _win[scan + best_len];
        if (s.prev_length >= s.good_match) {
            chain_length >>= 2;
        }
        if (nice_match > s.lookahead) {
            nice_match = s.lookahead;
        }
        do {
            match = cur_match;
            if (_win[match + best_len] === scan_end && _win[match + best_len - 1] === scan_end1 && _win[match] === _win[scan] && _win[++match] === _win[scan + 1]) {
                scan += 2;
                match++;
                do {} while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && scan < strend);
                len = 258 - (strend - scan);
                scan = strend - 258;
                if (len > best_len) {
                    s.match_start = cur_match;
                    best_len = len;
                    if (len >= nice_match) {
                        break;
                    }
                    scan_end1 = _win[scan + best_len - 1];
                    scan_end = _win[scan + best_len];
                }
            }
        } while ((cur_match = prev[cur_match & wmask]) > limit && 0 !== --chain_length);
        if (best_len <= s.lookahead) {
            return best_len;
        } else {
            return s.lookahead;
        }
    };
    const fill_window = s => {
        const _w_size = s.w_size;
        let n, more, str;
        do {
            more = s.window_size - s.lookahead - s.strstart;
            if (s.strstart >= _w_size + (_w_size - 262)) {
                s.window.set(s.window.subarray(_w_size, _w_size + _w_size - more), 0);
                s.match_start -= _w_size;
                s.strstart -= _w_size;
                s.block_start -= _w_size;
                if (s.insert > s.strstart) {
                    s.insert = s.strstart;
                }
                slide_hash(s);
                more += _w_size;
            }
            if (0 === s.strm.avail_in) {
                break;
            }
            n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
            s.lookahead += n;
            if (s.lookahead + s.insert >= 3) {
                str = s.strstart - s.insert;
                s.ins_h = s.window[str];
                s.ins_h = HASH(s, s.ins_h, s.window[str + 1]);
                for (;s.insert; ) {
                    s.ins_h = HASH(s, s.ins_h, s.window[str + 3 - 1]);
                    s.prev[str & s.w_mask] = s.head[s.ins_h];
                    s.head[s.ins_h] = str;
                    str++;
                    s.insert--;
                    if (s.lookahead + s.insert < 3) {
                        break;
                    }
                }
            }
        } while (s.lookahead < 262 && 0 !== s.strm.avail_in);
    };
    const deflate_stored = (s, flush) => {
        let min_block = s.pending_buf_size - 5 > s.w_size ? s.w_size : s.pending_buf_size - 5;
        let len, left, have, last = 0;
        let used = s.strm.avail_in;
        do {
            len = 65535;
            have = s.bi_valid + 42 >> 3;
            if (s.strm.avail_out < have) {
                break;
            }
            have = s.strm.avail_out - have;
            left = s.strstart - s.block_start;
            if (len > left + s.strm.avail_in) {
                len = left + s.strm.avail_in;
            }
            if (len > have) {
                len = have;
            }
            if (len < min_block && (0 === len && flush !== Z_FINISH$3 || flush === Z_NO_FLUSH$2 || len !== left + s.strm.avail_in)) {
                break;
            }
            last = flush === Z_FINISH$3 && len === left + s.strm.avail_in ? 1 : 0;
            _tr_stored_block(s, 0, 0, last);
            s.pending_buf[s.pending - 4] = len;
            s.pending_buf[s.pending - 3] = len >> 8;
            s.pending_buf[s.pending - 2] = ~len;
            s.pending_buf[s.pending - 1] = ~len >> 8;
            flush_pending(s.strm);
            if (left) {
                if (left > len) {
                    left = len;
                }
                s.strm.output.set(s.window.subarray(s.block_start, s.block_start + left), s.strm.next_out);
                s.strm.next_out += left;
                s.strm.avail_out -= left;
                s.strm.total_out += left;
                s.block_start += left;
                len -= left;
            }
            if (len) {
                read_buf(s.strm, s.strm.output, s.strm.next_out, len);
                s.strm.next_out += len;
                s.strm.avail_out -= len;
                s.strm.total_out += len;
            }
        } while (0 === last);
        used -= s.strm.avail_in;
        if (used) {
            if (used >= s.w_size) {
                s.matches = 2;
                s.window.set(s.strm.input.subarray(s.strm.next_in - s.w_size, s.strm.next_in), 0);
                s.strstart = s.w_size;
                s.insert = s.strstart;
            } else {
                if (s.window_size - s.strstart <= used) {
                    s.strstart -= s.w_size;
                    s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
                    if (s.matches < 2) {
                        s.matches++;
                    }
                    if (s.insert > s.strstart) {
                        s.insert = s.strstart;
                    }
                }
                s.window.set(s.strm.input.subarray(s.strm.next_in - used, s.strm.next_in), s.strstart);
                s.strstart += used;
                s.insert += used > s.w_size - s.insert ? s.w_size - s.insert : used;
            }
            s.block_start = s.strstart;
        }
        if (s.high_water < s.strstart) {
            s.high_water = s.strstart;
        }
        if (last) {
            return 4;
        }
        if (flush !== Z_NO_FLUSH$2 && flush !== Z_FINISH$3 && 0 === s.strm.avail_in && s.strstart === s.block_start) {
            return 2;
        }
        have = s.window_size - s.strstart;
        if (s.strm.avail_in > have && s.block_start >= s.w_size) {
            s.block_start -= s.w_size;
            s.strstart -= s.w_size;
            s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
            if (s.matches < 2) {
                s.matches++;
            }
            have += s.w_size;
            if (s.insert > s.strstart) {
                s.insert = s.strstart;
            }
        }
        if (have > s.strm.avail_in) {
            have = s.strm.avail_in;
        }
        if (have) {
            read_buf(s.strm, s.window, s.strstart, have);
            s.strstart += have;
            s.insert += have > s.w_size - s.insert ? s.w_size - s.insert : have;
        }
        if (s.high_water < s.strstart) {
            s.high_water = s.strstart;
        }
        have = s.bi_valid + 42 >> 3;
        have = s.pending_buf_size - have > 65535 ? 65535 : s.pending_buf_size - have;
        min_block = have > s.w_size ? s.w_size : have;
        left = s.strstart - s.block_start;
        if (left >= min_block || (left || flush === Z_FINISH$3) && flush !== Z_NO_FLUSH$2 && 0 === s.strm.avail_in && left <= have) {
            len = left > have ? have : left;
            last = flush === Z_FINISH$3 && 0 === s.strm.avail_in && len === left ? 1 : 0;
            _tr_stored_block(s, s.block_start, len, last);
            s.block_start += len;
            flush_pending(s.strm);
        }
        return last ? 3 : 1;
    };
    const deflate_fast = (s, flush) => {
        let hash_head;
        let bflush;
        for (;;) {
            if (s.lookahead < 262) {
                fill_window(s);
                if (s.lookahead < 262 && flush === Z_NO_FLUSH$2) {
                    return 1;
                }
                if (0 === s.lookahead) {
                    break;
                }
            }
            hash_head = 0;
            if (s.lookahead >= 3) {
                s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + 3 - 1]);
                hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
                s.head[s.ins_h] = s.strstart;
            }
            if (0 !== hash_head && s.strstart - hash_head <= s.w_size - 262) {
                s.match_length = longest_match(s, hash_head);
            }
            if (s.match_length >= 3) {
                bflush = _tr_tally(s, s.strstart - s.match_start, s.match_length - 3);
                s.lookahead -= s.match_length;
                if (s.match_length <= s.max_lazy_match && s.lookahead >= 3) {
                    s.match_length--;
                    do {
                        s.strstart++;
                        s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + 3 - 1]);
                        hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
                        s.head[s.ins_h] = s.strstart;
                    } while (0 !== --s.match_length);
                    s.strstart++;
                } else {
                    s.strstart += s.match_length;
                    s.match_length = 0;
                    s.ins_h = s.window[s.strstart];
                    s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + 1]);
                }
            } else {
                bflush = _tr_tally(s, 0, s.window[s.strstart]);
                s.lookahead--;
                s.strstart++;
            }
            if (bflush) {
                flush_block_only(s, false);
                if (0 === s.strm.avail_out) {
                    return 1;
                }
            }
        }
        s.insert = s.strstart < 2 ? s.strstart : 2;
        if (flush === Z_FINISH$3) {
            flush_block_only(s, true);
            if (0 === s.strm.avail_out) {
                return 3;
            } else {
                return 4;
            }
        }
        if (s.sym_next) {
            flush_block_only(s, false);
            if (0 === s.strm.avail_out) {
                return 1;
            }
        }
        return 2;
    };
    const deflate_slow = (s, flush) => {
        let hash_head;
        let bflush;
        let max_insert;
        for (;;) {
            if (s.lookahead < 262) {
                fill_window(s);
                if (s.lookahead < 262 && flush === Z_NO_FLUSH$2) {
                    return 1;
                }
                if (0 === s.lookahead) {
                    break;
                }
            }
            hash_head = 0;
            if (s.lookahead >= 3) {
                s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + 3 - 1]);
                hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
                s.head[s.ins_h] = s.strstart;
            }
            s.prev_length = s.match_length;
            s.prev_match = s.match_start;
            s.match_length = 2;
            if (0 !== hash_head && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - 262) {
                s.match_length = longest_match(s, hash_head);
                if (s.match_length <= 5 && (s.strategy === Z_FILTERED || 3 === s.match_length && s.strstart - s.match_start > 4096)) {
                    s.match_length = 2;
                }
            }
            if (s.prev_length >= 3 && s.match_length <= s.prev_length) {
                max_insert = s.strstart + s.lookahead - 3;
                bflush = _tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - 3);
                s.lookahead -= s.prev_length - 1;
                s.prev_length -= 2;
                do {
                    if (++s.strstart <= max_insert) {
                        s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + 3 - 1]);
                        hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
                        s.head[s.ins_h] = s.strstart;
                    }
                } while (0 !== --s.prev_length);
                s.match_available = 0;
                s.match_length = 2;
                s.strstart++;
                if (bflush) {
                    flush_block_only(s, false);
                    if (0 === s.strm.avail_out) {
                        return 1;
                    }
                }
            } else if (s.match_available) {
                bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);
                if (bflush) {
                    flush_block_only(s, false);
                }
                s.strstart++;
                s.lookahead--;
                if (0 === s.strm.avail_out) {
                    return 1;
                }
            } else {
                s.match_available = 1;
                s.strstart++;
                s.lookahead--;
            }
        }
        if (s.match_available) {
            bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);
            s.match_available = 0;
        }
        s.insert = s.strstart < 2 ? s.strstart : 2;
        if (flush === Z_FINISH$3) {
            flush_block_only(s, true);
            if (0 === s.strm.avail_out) {
                return 3;
            } else {
                return 4;
            }
        }
        if (s.sym_next) {
            flush_block_only(s, false);
            if (0 === s.strm.avail_out) {
                return 1;
            }
        }
        return 2;
    };
    function Config(good_length, max_lazy, nice_length, max_chain, func) {
        this.good_length = good_length;
        this.max_lazy = max_lazy;
        this.nice_length = nice_length;
        this.max_chain = max_chain;
        this.func = func;
    }
    const configuration_table = [ new Config(0, 0, 0, 0, deflate_stored), new Config(4, 4, 8, 4, deflate_fast), new Config(4, 5, 16, 8, deflate_fast), new Config(4, 6, 32, 32, deflate_fast), new Config(4, 4, 16, 16, deflate_slow), new Config(8, 16, 32, 32, deflate_slow), new Config(8, 16, 128, 128, deflate_slow), new Config(8, 32, 128, 256, deflate_slow), new Config(32, 128, 258, 1024, deflate_slow), new Config(32, 258, 258, 4096, deflate_slow) ];
    function DeflateState() {
        this.strm = null;
        this.status = 0;
        this.pending_buf = null;
        this.pending_buf_size = 0;
        this.pending_out = 0;
        this.pending = 0;
        this.wrap = 0;
        this.gzhead = null;
        this.gzindex = 0;
        this.method = Z_DEFLATED$2;
        this.last_flush = -1;
        this.w_size = 0;
        this.w_bits = 0;
        this.w_mask = 0;
        this.window = null;
        this.window_size = 0;
        this.prev = null;
        this.head = null;
        this.ins_h = 0;
        this.hash_size = 0;
        this.hash_bits = 0;
        this.hash_mask = 0;
        this.hash_shift = 0;
        this.block_start = 0;
        this.match_length = 0;
        this.prev_match = 0;
        this.match_available = 0;
        this.strstart = 0;
        this.match_start = 0;
        this.lookahead = 0;
        this.prev_length = 0;
        this.max_chain_length = 0;
        this.max_lazy_match = 0;
        this.level = 0;
        this.strategy = 0;
        this.good_match = 0;
        this.nice_match = 0;
        this.dyn_ltree = new Uint16Array(1146);
        this.dyn_dtree = new Uint16Array(122);
        this.bl_tree = new Uint16Array(78);
        zero(this.dyn_ltree);
        zero(this.dyn_dtree);
        zero(this.bl_tree);
        this.l_desc = null;
        this.d_desc = null;
        this.bl_desc = null;
        this.bl_count = new Uint16Array(16);
        this.heap = new Uint16Array(573);
        zero(this.heap);
        this.heap_len = 0;
        this.heap_max = 0;
        this.depth = new Uint16Array(573);
        zero(this.depth);
        this.sym_buf = 0;
        this.lit_bufsize = 0;
        this.sym_next = 0;
        this.sym_end = 0;
        this.opt_len = 0;
        this.static_len = 0;
        this.matches = 0;
        this.insert = 0;
        this.bi_buf = 0;
        this.bi_valid = 0;
    }
    const deflateStateCheck = strm => {
        if (!strm) {
            return 1;
        }
        const s = strm.state;
        if (!s || s.strm !== strm || 42 !== s.status && 57 !== s.status && 69 !== s.status && 73 !== s.status && 91 !== s.status && 103 !== s.status && 113 !== s.status && 666 !== s.status) {
            return 1;
        } else {
            return 0;
        }
    };
    const deflateResetKeep = strm => {
        if (deflateStateCheck(strm)) {
            return err(strm, Z_STREAM_ERROR$2);
        }
        strm.total_in = strm.total_out = 0;
        strm.data_type = Z_UNKNOWN;
        const s = strm.state;
        s.pending = 0;
        s.pending_out = 0;
        if (s.wrap < 0) {
            s.wrap = -s.wrap;
        }
        s.status = 2 === s.wrap ? 57 : s.wrap ? 42 : 113;
        strm.adler = 2 === s.wrap ? 0 : 1;
        s.last_flush = -2;
        _tr_init(s);
        return Z_OK$3;
    };
    const deflateReset = strm => {
        const ret = deflateResetKeep(strm);
        if (ret === Z_OK$3) {
            (s => {
                s.window_size = 2 * s.w_size;
                zero(s.head);
                s.max_lazy_match = configuration_table[s.level].max_lazy;
                s.good_match = configuration_table[s.level].good_length;
                s.nice_match = configuration_table[s.level].nice_length;
                s.max_chain_length = configuration_table[s.level].max_chain;
                s.strstart = 0;
                s.block_start = 0;
                s.lookahead = 0;
                s.insert = 0;
                s.match_length = s.prev_length = 2;
                s.match_available = 0;
                s.ins_h = 0;
            })(strm.state);
        }
        return ret;
    };
    const deflateInit2 = (strm, level, method, windowBits, memLevel, strategy) => {
        if (!strm) {
            return Z_STREAM_ERROR$2;
        }
        let wrap = 1;
        if (level === Z_DEFAULT_COMPRESSION$1) {
            level = 6;
        }
        if (windowBits < 0) {
            wrap = 0;
            windowBits = -windowBits;
        } else if (windowBits > 15) {
            wrap = 2;
            windowBits -= 16;
        }
        if (memLevel < 1 || memLevel > 9 || method !== Z_DEFLATED$2 || windowBits < 8 || windowBits > 15 || level < 0 || level > 9 || strategy < 0 || strategy > Z_FIXED || 8 === windowBits && 1 !== wrap) {
            return err(strm, Z_STREAM_ERROR$2);
        }
        if (8 === windowBits) {
            windowBits = 9;
        }
        const s = new DeflateState;
        strm.state = s;
        s.strm = strm;
        s.status = 42;
        s.wrap = wrap;
        s.gzhead = null;
        s.w_bits = windowBits;
        s.w_size = 1 << s.w_bits;
        s.w_mask = s.w_size - 1;
        s.hash_bits = memLevel + 7;
        s.hash_size = 1 << s.hash_bits;
        s.hash_mask = s.hash_size - 1;
        s.hash_shift = ~~((s.hash_bits + 3 - 1) / 3);
        s.window = new Uint8Array(2 * s.w_size);
        s.head = new Uint16Array(s.hash_size);
        s.prev = new Uint16Array(s.w_size);
        s.lit_bufsize = 1 << memLevel + 6;
        s.pending_buf_size = 4 * s.lit_bufsize;
        s.pending_buf = new Uint8Array(s.pending_buf_size);
        s.sym_buf = s.lit_bufsize;
        s.sym_end = 3 * (s.lit_bufsize - 1);
        s.level = level;
        s.strategy = strategy;
        s.method = method;
        return deflateReset(strm);
    };
    var deflate_1$2 = {
        deflateInit: (strm, level) => deflateInit2(strm, level, Z_DEFLATED$2, 15, 8, Z_DEFAULT_STRATEGY$1),
        deflateInit2,
        deflateReset,
        deflateResetKeep,
        deflateSetHeader: (strm, head) => {
            if (deflateStateCheck(strm) || 2 !== strm.state.wrap) {
                return Z_STREAM_ERROR$2;
            }
            strm.state.gzhead = head;
            return Z_OK$3;
        },
        deflate: (strm, flush) => {
            if (deflateStateCheck(strm) || flush > Z_BLOCK$1 || flush < 0) {
                return strm ? err(strm, Z_STREAM_ERROR$2) : Z_STREAM_ERROR$2;
            }
            const s = strm.state;
            if (!strm.output || 0 !== strm.avail_in && !strm.input || 666 === s.status && flush !== Z_FINISH$3) {
                return err(strm, 0 === strm.avail_out ? Z_BUF_ERROR$1 : Z_STREAM_ERROR$2);
            }
            const old_flush = s.last_flush;
            s.last_flush = flush;
            if (0 !== s.pending) {
                flush_pending(strm);
                if (0 === strm.avail_out) {
                    s.last_flush = -1;
                    return Z_OK$3;
                }
            } else if (0 === strm.avail_in && rank(flush) <= rank(old_flush) && flush !== Z_FINISH$3) {
                return err(strm, Z_BUF_ERROR$1);
            }
            if (666 === s.status && 0 !== strm.avail_in) {
                return err(strm, Z_BUF_ERROR$1);
            }
            if (42 === s.status && 0 === s.wrap) {
                s.status = 113;
            }
            if (42 === s.status) {
                let header = Z_DEFLATED$2 + (s.w_bits - 8 << 4) << 8;
                let level_flags = -1;
                if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
                    level_flags = 0;
                } else if (s.level < 6) {
                    level_flags = 1;
                } else if (6 === s.level) {
                    level_flags = 2;
                } else {
                    level_flags = 3;
                }
                header |= level_flags << 6;
                if (0 !== s.strstart) {
                    header |= 32;
                }
                header += 31 - header % 31;
                putShortMSB(s, header);
                if (0 !== s.strstart) {
                    putShortMSB(s, strm.adler >>> 16);
                    putShortMSB(s, 65535 & strm.adler);
                }
                strm.adler = 1;
                s.status = 113;
                flush_pending(strm);
                if (0 !== s.pending) {
                    s.last_flush = -1;
                    return Z_OK$3;
                }
            }
            if (57 === s.status) {
                strm.adler = 0;
                put_byte(s, 31);
                put_byte(s, 139);
                put_byte(s, 8);
                if (!s.gzhead) {
                    put_byte(s, 0);
                    put_byte(s, 0);
                    put_byte(s, 0);
                    put_byte(s, 0);
                    put_byte(s, 0);
                    put_byte(s, 9 === s.level ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
                    put_byte(s, 3);
                    s.status = 113;
                    flush_pending(strm);
                    if (0 !== s.pending) {
                        s.last_flush = -1;
                        return Z_OK$3;
                    }
                } else {
                    put_byte(s, (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (!s.gzhead.extra ? 0 : 4) + (!s.gzhead.name ? 0 : 8) + (!s.gzhead.comment ? 0 : 16));
                    put_byte(s, 255 & s.gzhead.time);
                    put_byte(s, s.gzhead.time >> 8 & 255);
                    put_byte(s, s.gzhead.time >> 16 & 255);
                    put_byte(s, s.gzhead.time >> 24 & 255);
                    put_byte(s, 9 === s.level ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
                    put_byte(s, 255 & s.gzhead.os);
                    if (s.gzhead.extra && s.gzhead.extra.length) {
                        put_byte(s, 255 & s.gzhead.extra.length);
                        put_byte(s, s.gzhead.extra.length >> 8 & 255);
                    }
                    if (s.gzhead.hcrc) {
                        strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending, 0);
                    }
                    s.gzindex = 0;
                    s.status = 69;
                }
            }
            if (69 === s.status) {
                if (s.gzhead.extra) {
                    let beg = s.pending;
                    let left = (65535 & s.gzhead.extra.length) - s.gzindex;
                    for (;s.pending + left > s.pending_buf_size; ) {
                        let copy = s.pending_buf_size - s.pending;
                        s.pending_buf.set(s.gzhead.extra.subarray(s.gzindex, s.gzindex + copy), s.pending);
                        s.pending = s.pending_buf_size;
                        if (s.gzhead.hcrc && s.pending > beg) {
                            strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
                        }
                        s.gzindex += copy;
                        flush_pending(strm);
                        if (0 !== s.pending) {
                            s.last_flush = -1;
                            return Z_OK$3;
                        }
                        beg = 0;
                        left -= copy;
                    }
                    let gzhead_extra = new Uint8Array(s.gzhead.extra);
                    s.pending_buf.set(gzhead_extra.subarray(s.gzindex, s.gzindex + left), s.pending);
                    s.pending += left;
                    if (s.gzhead.hcrc && s.pending > beg) {
                        strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
                    }
                    s.gzindex = 0;
                }
                s.status = 73;
            }
            if (73 === s.status) {
                if (s.gzhead.name) {
                    let beg = s.pending;
                    let val;
                    do {
                        if (s.pending === s.pending_buf_size) {
                            if (s.gzhead.hcrc && s.pending > beg) {
                                strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
                            }
                            flush_pending(strm);
                            if (0 !== s.pending) {
                                s.last_flush = -1;
                                return Z_OK$3;
                            }
                            beg = 0;
                        }
                        if (s.gzindex < s.gzhead.name.length) {
                            val = 255 & s.gzhead.name.charCodeAt(s.gzindex++);
                        } else {
                            val = 0;
                        }
                        put_byte(s, val);
                    } while (0 !== val);
                    if (s.gzhead.hcrc && s.pending > beg) {
                        strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
                    }
                    s.gzindex = 0;
                }
                s.status = 91;
            }
            if (91 === s.status) {
                if (s.gzhead.comment) {
                    let beg = s.pending;
                    let val;
                    do {
                        if (s.pending === s.pending_buf_size) {
                            if (s.gzhead.hcrc && s.pending > beg) {
                                strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
                            }
                            flush_pending(strm);
                            if (0 !== s.pending) {
                                s.last_flush = -1;
                                return Z_OK$3;
                            }
                            beg = 0;
                        }
                        if (s.gzindex < s.gzhead.comment.length) {
                            val = 255 & s.gzhead.comment.charCodeAt(s.gzindex++);
                        } else {
                            val = 0;
                        }
                        put_byte(s, val);
                    } while (0 !== val);
                    if (s.gzhead.hcrc && s.pending > beg) {
                        strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
                    }
                }
                s.status = 103;
            }
            if (103 === s.status) {
                if (s.gzhead.hcrc) {
                    if (s.pending + 2 > s.pending_buf_size) {
                        flush_pending(strm);
                        if (0 !== s.pending) {
                            s.last_flush = -1;
                            return Z_OK$3;
                        }
                    }
                    put_byte(s, 255 & strm.adler);
                    put_byte(s, strm.adler >> 8 & 255);
                    strm.adler = 0;
                }
                s.status = 113;
                flush_pending(strm);
                if (0 !== s.pending) {
                    s.last_flush = -1;
                    return Z_OK$3;
                }
            }
            if (0 !== strm.avail_in || 0 !== s.lookahead || flush !== Z_NO_FLUSH$2 && 666 !== s.status) {
                let bstate = 0 === s.level ? deflate_stored(s, flush) : s.strategy === Z_HUFFMAN_ONLY ? ((s, flush) => {
                    let bflush;
                    for (;;) {
                        if (0 === s.lookahead) {
                            fill_window(s);
                            if (0 === s.lookahead) {
                                if (flush === Z_NO_FLUSH$2) {
                                    return 1;
                                }
                                break;
                            }
                        }
                        s.match_length = 0;
                        bflush = _tr_tally(s, 0, s.window[s.strstart]);
                        s.lookahead--;
                        s.strstart++;
                        if (bflush) {
                            flush_block_only(s, false);
                            if (0 === s.strm.avail_out) {
                                return 1;
                            }
                        }
                    }
                    s.insert = 0;
                    if (flush === Z_FINISH$3) {
                        flush_block_only(s, true);
                        if (0 === s.strm.avail_out) {
                            return 3;
                        } else {
                            return 4;
                        }
                    }
                    if (s.sym_next) {
                        flush_block_only(s, false);
                        if (0 === s.strm.avail_out) {
                            return 1;
                        }
                    }
                    return 2;
                })(s, flush) : s.strategy === Z_RLE ? ((s, flush) => {
                    let bflush;
                    let prev;
                    let scan, strend;
                    const _win = s.window;
                    for (;;) {
                        if (s.lookahead <= 258) {
                            fill_window(s);
                            if (s.lookahead <= 258 && flush === Z_NO_FLUSH$2) {
                                return 1;
                            }
                            if (0 === s.lookahead) {
                                break;
                            }
                        }
                        s.match_length = 0;
                        if (s.lookahead >= 3 && s.strstart > 0) {
                            scan = s.strstart - 1;
                            prev = _win[scan];
                            if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
                                strend = s.strstart + 258;
                                do {} while (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && scan < strend);
                                s.match_length = 258 - (strend - scan);
                                if (s.match_length > s.lookahead) {
                                    s.match_length = s.lookahead;
                                }
                            }
                        }
                        if (s.match_length >= 3) {
                            bflush = _tr_tally(s, 1, s.match_length - 3);
                            s.lookahead -= s.match_length;
                            s.strstart += s.match_length;
                            s.match_length = 0;
                        } else {
                            bflush = _tr_tally(s, 0, s.window[s.strstart]);
                            s.lookahead--;
                            s.strstart++;
                        }
                        if (bflush) {
                            flush_block_only(s, false);
                            if (0 === s.strm.avail_out) {
                                return 1;
                            }
                        }
                    }
                    s.insert = 0;
                    if (flush === Z_FINISH$3) {
                        flush_block_only(s, true);
                        if (0 === s.strm.avail_out) {
                            return 3;
                        } else {
                            return 4;
                        }
                    }
                    if (s.sym_next) {
                        flush_block_only(s, false);
                        if (0 === s.strm.avail_out) {
                            return 1;
                        }
                    }
                    return 2;
                })(s, flush) : configuration_table[s.level].func(s, flush);
                if (3 === bstate || 4 === bstate) {
                    s.status = 666;
                }
                if (1 === bstate || 3 === bstate) {
                    if (0 === strm.avail_out) {
                        s.last_flush = -1;
                    }
                    return Z_OK$3;
                }
                if (2 === bstate) {
                    if (flush === Z_PARTIAL_FLUSH) {
                        _tr_align(s);
                    } else if (flush !== Z_BLOCK$1) {
                        _tr_stored_block(s, 0, 0, false);
                        if (flush === Z_FULL_FLUSH$1) {
                            zero(s.head);
                            if (0 === s.lookahead) {
                                s.strstart = 0;
                                s.block_start = 0;
                                s.insert = 0;
                            }
                        }
                    }
                    flush_pending(strm);
                    if (0 === strm.avail_out) {
                        s.last_flush = -1;
                        return Z_OK$3;
                    }
                }
            }
            if (flush !== Z_FINISH$3) {
                return Z_OK$3;
            }
            if (s.wrap <= 0) {
                return Z_STREAM_END$3;
            }
            if (2 === s.wrap) {
                put_byte(s, 255 & strm.adler);
                put_byte(s, strm.adler >> 8 & 255);
                put_byte(s, strm.adler >> 16 & 255);
                put_byte(s, strm.adler >> 24 & 255);
                put_byte(s, 255 & strm.total_in);
                put_byte(s, strm.total_in >> 8 & 255);
                put_byte(s, strm.total_in >> 16 & 255);
                put_byte(s, strm.total_in >> 24 & 255);
            } else {
                putShortMSB(s, strm.adler >>> 16);
                putShortMSB(s, 65535 & strm.adler);
            }
            flush_pending(strm);
            if (s.wrap > 0) {
                s.wrap = -s.wrap;
            }
            return 0 !== s.pending ? Z_OK$3 : Z_STREAM_END$3;
        },
        deflateEnd: strm => {
            if (deflateStateCheck(strm)) {
                return Z_STREAM_ERROR$2;
            }
            const status = strm.state.status;
            strm.state = null;
            return 113 === status ? err(strm, Z_DATA_ERROR$2) : Z_OK$3;
        },
        deflateSetDictionary: (strm, dictionary) => {
            let dictLength = dictionary.length;
            if (deflateStateCheck(strm)) {
                return Z_STREAM_ERROR$2;
            }
            const s = strm.state;
            const wrap = s.wrap;
            if (2 === wrap || 1 === wrap && 42 !== s.status || s.lookahead) {
                return Z_STREAM_ERROR$2;
            }
            if (1 === wrap) {
                strm.adler = adler32_1(strm.adler, dictionary, dictLength, 0);
            }
            s.wrap = 0;
            if (dictLength >= s.w_size) {
                if (0 === wrap) {
                    zero(s.head);
                    s.strstart = 0;
                    s.block_start = 0;
                    s.insert = 0;
                }
                let tmpDict = new Uint8Array(s.w_size);
                tmpDict.set(dictionary.subarray(dictLength - s.w_size, dictLength), 0);
                dictionary = tmpDict;
                dictLength = s.w_size;
            }
            const avail = strm.avail_in;
            const next = strm.next_in;
            const input = strm.input;
            strm.avail_in = dictLength;
            strm.next_in = 0;
            strm.input = dictionary;
            fill_window(s);
            for (;s.lookahead >= 3; ) {
                let str = s.strstart;
                let n = s.lookahead - 2;
                do {
                    s.ins_h = HASH(s, s.ins_h, s.window[str + 3 - 1]);
                    s.prev[str & s.w_mask] = s.head[s.ins_h];
                    s.head[s.ins_h] = str;
                    str++;
                } while (--n);
                s.strstart = str;
                s.lookahead = 2;
                fill_window(s);
            }
            s.strstart += s.lookahead;
            s.block_start = s.strstart;
            s.insert = s.lookahead;
            s.lookahead = 0;
            s.match_length = s.prev_length = 2;
            s.match_available = 0;
            strm.next_in = next;
            strm.input = input;
            strm.avail_in = avail;
            s.wrap = wrap;
            return Z_OK$3;
        },
        deflateInfo: "pako deflate (from Nodeca project)"
    };
    const _has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
    var common_assign = function(obj) {
        const sources = Array.prototype.slice.call(arguments, 1);
        for (;sources.length; ) {
            const source = sources.shift();
            if (source) {
                if ("object" !== typeof source) {
                    throw new TypeError(source + "must be non-object");
                }
                for (const p in source) {
                    if (_has(source, p)) {
                        obj[p] = source[p];
                    }
                }
            }
        }
        return obj;
    }, common_flattenChunks = chunks => {
        let len = 0;
        for (let i = 0, l = chunks.length; i < l; i++) {
            len += chunks[i].length;
        }
        const result = new Uint8Array(len);
        for (let i = 0, pos = 0, l = chunks.length; i < l; i++) {
            let chunk = chunks[i];
            result.set(chunk, pos);
            pos += chunk.length;
        }
        return result;
    };
    let STR_APPLY_UIA_OK = true;
    try {
        String.fromCharCode.apply(null, new Uint8Array(1));
    } catch (__) {
        STR_APPLY_UIA_OK = false;
    }
    const _utf8len = new Uint8Array(256);
    for (let q = 0; q < 256; q++) {
        _utf8len[q] = q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1;
    }
    _utf8len[254] = _utf8len[254] = 1;
    var strings_string2buf = str => {
        if ("function" === typeof TextEncoder && TextEncoder.prototype.encode) {
            return (new TextEncoder).encode(str);
        }
        let buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;
        for (m_pos = 0; m_pos < str_len; m_pos++) {
            c = str.charCodeAt(m_pos);
            if (55296 === (64512 & c) && m_pos + 1 < str_len) {
                c2 = str.charCodeAt(m_pos + 1);
                if (56320 === (64512 & c2)) {
                    c = 65536 + (c - 55296 << 10) + (c2 - 56320);
                    m_pos++;
                }
            }
            buf_len += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
        }
        buf = new Uint8Array(buf_len);
        for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
            c = str.charCodeAt(m_pos);
            if (55296 === (64512 & c) && m_pos + 1 < str_len) {
                c2 = str.charCodeAt(m_pos + 1);
                if (56320 === (64512 & c2)) {
                    c = 65536 + (c - 55296 << 10) + (c2 - 56320);
                    m_pos++;
                }
            }
            if (c < 128) {
                buf[i++] = c;
            } else if (c < 2048) {
                buf[i++] = 192 | c >>> 6;
                buf[i++] = 128 | 63 & c;
            } else if (c < 65536) {
                buf[i++] = 224 | c >>> 12;
                buf[i++] = 128 | c >>> 6 & 63;
                buf[i++] = 128 | 63 & c;
            } else {
                buf[i++] = 240 | c >>> 18;
                buf[i++] = 128 | c >>> 12 & 63;
                buf[i++] = 128 | c >>> 6 & 63;
                buf[i++] = 128 | 63 & c;
            }
        }
        return buf;
    }, strings_buf2string = (buf, max) => {
        const len = max || buf.length;
        if ("function" === typeof TextDecoder && TextDecoder.prototype.decode) {
            return (new TextDecoder).decode(buf.subarray(0, max));
        }
        let i, out;
        const utf16buf = new Array(2 * len);
        for (out = 0, i = 0; i < len; ) {
            let c = buf[i++];
            if (c < 128) {
                utf16buf[out++] = c;
                continue;
            }
            let c_len = _utf8len[c];
            if (!(c_len > 4)) {
                c &= 2 === c_len ? 31 : 3 === c_len ? 15 : 7;
                for (;c_len > 1 && i < len; ) {
                    c = c << 6 | 63 & buf[i++];
                    c_len--;
                }
                if (!(c_len > 1)) {
                    if (c < 65536) {
                        utf16buf[out++] = c;
                    } else {
                        c -= 65536;
                        utf16buf[out++] = 55296 | c >> 10 & 1023;
                        utf16buf[out++] = 56320 | 1023 & c;
                    }
                } else {
                    utf16buf[out++] = 65533;
                }
            } else {
                utf16buf[out++] = 65533;
                i += c_len - 1;
            }
        }
        return ((buf, len) => {
            if (len < 65534) {
                if (buf.subarray && STR_APPLY_UIA_OK) {
                    return String.fromCharCode.apply(null, buf.length === len ? buf : buf.subarray(0, len));
                }
            }
            let result = "";
            for (let i = 0; i < len; i++) {
                result += String.fromCharCode(buf[i]);
            }
            return result;
        })(utf16buf, out);
    }, strings_utf8border = (buf, max) => {
        if ((max = max || buf.length) > buf.length) {
            max = buf.length;
        }
        let pos = max - 1;
        for (;pos >= 0 && 128 === (192 & buf[pos]); ) {
            pos--;
        }
        if (pos < 0) {
            return max;
        }
        if (0 === pos) {
            return max;
        } else {
            return pos + _utf8len[buf[pos]] > max ? pos : max;
        }
    };
    var zstream = function ZStream() {
        this.input = null;
        this.next_in = 0;
        this.avail_in = 0;
        this.total_in = 0;
        this.output = null;
        this.next_out = 0;
        this.avail_out = 0;
        this.total_out = 0;
        this.msg = "";
        this.state = null;
        this.data_type = 2;
        this.adler = 0;
    };
    const toString$1 = Object.prototype.toString;
    const {Z_NO_FLUSH: Z_NO_FLUSH$1, Z_SYNC_FLUSH, Z_FULL_FLUSH, Z_FINISH: Z_FINISH$2, Z_OK: Z_OK$2, Z_STREAM_END: Z_STREAM_END$2, Z_DEFAULT_COMPRESSION, Z_DEFAULT_STRATEGY, Z_DEFLATED: Z_DEFLATED$1} = constants$2;
    function Deflate$1(options) {
        this.options = common_assign({
            level: Z_DEFAULT_COMPRESSION,
            method: Z_DEFLATED$1,
            chunkSize: 16384,
            windowBits: 15,
            memLevel: 8,
            strategy: Z_DEFAULT_STRATEGY
        }, options || {});
        let opt = this.options;
        if (opt.raw && opt.windowBits > 0) {
            opt.windowBits = -opt.windowBits;
        } else if (opt.gzip && opt.windowBits > 0 && opt.windowBits < 16) {
            opt.windowBits += 16;
        }
        this.err = 0;
        this.msg = "";
        this.ended = false;
        this.chunks = [];
        this.strm = new zstream;
        this.strm.avail_out = 0;
        let status = deflate_1$2.deflateInit2(this.strm, opt.level, opt.method, opt.windowBits, opt.memLevel, opt.strategy);
        if (status !== Z_OK$2) {
            throw new Error(messages[status]);
        }
        if (opt.header) {
            deflate_1$2.deflateSetHeader(this.strm, opt.header);
        }
        if (opt.dictionary) {
            let dict;
            if ("string" === typeof opt.dictionary) {
                dict = strings_string2buf(opt.dictionary);
            } else if ("[object ArrayBuffer]" === toString$1.call(opt.dictionary)) {
                dict = new Uint8Array(opt.dictionary);
            } else {
                dict = opt.dictionary;
            }
            status = deflate_1$2.deflateSetDictionary(this.strm, dict);
            if (status !== Z_OK$2) {
                throw new Error(messages[status]);
            }
            this._dict_set = true;
        }
    }
    Deflate$1.prototype.push = function(data, flush_mode) {
        const strm = this.strm;
        const chunkSize = this.options.chunkSize;
        let status, _flush_mode;
        if (this.ended) {
            return false;
        }
        if (flush_mode === ~~flush_mode) {
            _flush_mode = flush_mode;
        } else {
            _flush_mode = true === flush_mode ? Z_FINISH$2 : Z_NO_FLUSH$1;
        }
        if ("string" === typeof data) {
            strm.input = strings_string2buf(data);
        } else if ("[object ArrayBuffer]" === toString$1.call(data)) {
            strm.input = new Uint8Array(data);
        } else {
            strm.input = data;
        }
        strm.next_in = 0;
        strm.avail_in = strm.input.length;
        for (;;) {
            if (0 === strm.avail_out) {
                strm.output = new Uint8Array(chunkSize);
                strm.next_out = 0;
                strm.avail_out = chunkSize;
            }
            if (_flush_mode !== Z_SYNC_FLUSH && _flush_mode !== Z_FULL_FLUSH || !(strm.avail_out <= 6)) {
                status = deflate_1$2.deflate(strm, _flush_mode);
                if (status === Z_STREAM_END$2) {
                    if (strm.next_out > 0) {
                        this.onData(strm.output.subarray(0, strm.next_out));
                    }
                    status = deflate_1$2.deflateEnd(this.strm);
                    this.onEnd(status);
                    this.ended = true;
                    return status === Z_OK$2;
                }
                if (0 !== strm.avail_out) {
                    if (!(_flush_mode > 0 && strm.next_out > 0)) {
                        if (0 === strm.avail_in) {
                            break;
                        }
                    } else {
                        this.onData(strm.output.subarray(0, strm.next_out));
                        strm.avail_out = 0;
                    }
                } else {
                    this.onData(strm.output);
                }
            } else {
                this.onData(strm.output.subarray(0, strm.next_out));
                strm.avail_out = 0;
            }
        }
        return true;
    };
    Deflate$1.prototype.onData = function(chunk) {
        this.chunks.push(chunk);
    };
    Deflate$1.prototype.onEnd = function(status) {
        if (status === Z_OK$2) {
            this.result = common_flattenChunks(this.chunks);
        }
        this.chunks = [];
        this.err = status;
        this.msg = this.strm.msg;
    };
    function deflate$1(input, options) {
        const deflator = new Deflate$1(options);
        deflator.push(input, true);
        if (deflator.err) {
            throw deflator.msg || messages[deflator.err];
        }
        return deflator.result;
    }
    var deflateRaw_1$1 = function deflateRaw$1(input, options) {
        (options = options || {}).raw = true;
        return deflate$1(input, options);
    };
    var gzip_1$1 = function gzip$1(input, options) {
        (options = options || {}).gzip = true;
        return deflate$1(input, options);
    };
    var deflate_1$1 = {
        Deflate: Deflate$1,
        deflate: deflate$1,
        deflateRaw: deflateRaw_1$1,
        gzip: gzip_1$1,
        constants: constants$2
    };
    var inffast = function inflate_fast(strm, start) {
        let _in;
        let last;
        let _out;
        let beg;
        let end;
        let dmax;
        let wsize;
        let whave;
        let wnext;
        let s_window;
        let hold;
        let bits;
        let lcode;
        let dcode;
        let lmask;
        let dmask;
        let here;
        let op;
        let len;
        let dist;
        let from;
        let from_source;
        let input, output;
        const state = strm.state;
        _in = strm.next_in;
        input = strm.input;
        last = _in + (strm.avail_in - 5);
        _out = strm.next_out;
        output = strm.output;
        beg = _out - (start - strm.avail_out);
        end = _out + (strm.avail_out - 257);
        dmax = state.dmax;
        wsize = state.wsize;
        whave = state.whave;
        wnext = state.wnext;
        s_window = state.window;
        hold = state.hold;
        bits = state.bits;
        lcode = state.lencode;
        dcode = state.distcode;
        lmask = (1 << state.lenbits) - 1;
        dmask = (1 << state.distbits) - 1;
        top: do {
            if (bits < 15) {
                hold += input[_in++] << bits;
                bits += 8;
                hold += input[_in++] << bits;
                bits += 8;
            }
            here = lcode[hold & lmask];
            dolen: for (;;) {
                op = here >>> 24;
                hold >>>= op;
                bits -= op;
                op = here >>> 16 & 255;
                if (0 === op) {
                    output[_out++] = 65535 & here;
                } else if (16 & op) {
                    len = 65535 & here;
                    op &= 15;
                    if (op) {
                        if (bits < op) {
                            hold += input[_in++] << bits;
                            bits += 8;
                        }
                        len += hold & (1 << op) - 1;
                        hold >>>= op;
                        bits -= op;
                    }
                    if (bits < 15) {
                        hold += input[_in++] << bits;
                        bits += 8;
                        hold += input[_in++] << bits;
                        bits += 8;
                    }
                    here = dcode[hold & dmask];
                    dodist: for (;;) {
                        op = here >>> 24;
                        hold >>>= op;
                        bits -= op;
                        op = here >>> 16 & 255;
                        if (16 & op) {
                            dist = 65535 & here;
                            op &= 15;
                            if (bits < op) {
                                hold += input[_in++] << bits;
                                bits += 8;
                                if (bits < op) {
                                    hold += input[_in++] << bits;
                                    bits += 8;
                                }
                            }
                            dist += hold & (1 << op) - 1;
                            if (dist > dmax) {
                                strm.msg = "invalid distance too far back";
                                state.mode = 16209;
                                break top;
                            }
                            hold >>>= op;
                            bits -= op;
                            op = _out - beg;
                            if (dist > op) {
                                op = dist - op;
                                if (op > whave) {
                                    if (state.sane) {
                                        strm.msg = "invalid distance too far back";
                                        state.mode = 16209;
                                        break top;
                                    }
                                }
                                from = 0;
                                from_source = s_window;
                                if (0 === wnext) {
                                    from += wsize - op;
                                    if (op < len) {
                                        len -= op;
                                        do {
                                            output[_out++] = s_window[from++];
                                        } while (--op);
                                        from = _out - dist;
                                        from_source = output;
                                    }
                                } else if (wnext < op) {
                                    from += wsize + wnext - op;
                                    op -= wnext;
                                    if (op < len) {
                                        len -= op;
                                        do {
                                            output[_out++] = s_window[from++];
                                        } while (--op);
                                        from = 0;
                                        if (wnext < len) {
                                            op = wnext;
                                            len -= op;
                                            do {
                                                output[_out++] = s_window[from++];
                                            } while (--op);
                                            from = _out - dist;
                                            from_source = output;
                                        }
                                    }
                                } else {
                                    from += wnext - op;
                                    if (op < len) {
                                        len -= op;
                                        do {
                                            output[_out++] = s_window[from++];
                                        } while (--op);
                                        from = _out - dist;
                                        from_source = output;
                                    }
                                }
                                for (;len > 2; ) {
                                    output[_out++] = from_source[from++];
                                    output[_out++] = from_source[from++];
                                    output[_out++] = from_source[from++];
                                    len -= 3;
                                }
                                if (len) {
                                    output[_out++] = from_source[from++];
                                    if (len > 1) {
                                        output[_out++] = from_source[from++];
                                    }
                                }
                            } else {
                                from = _out - dist;
                                do {
                                    output[_out++] = output[from++];
                                    output[_out++] = output[from++];
                                    output[_out++] = output[from++];
                                    len -= 3;
                                } while (len > 2);
                                if (len) {
                                    output[_out++] = output[from++];
                                    if (len > 1) {
                                        output[_out++] = output[from++];
                                    }
                                }
                            }
                        } else if (0 === (64 & op)) {
                            here = dcode[(65535 & here) + (hold & (1 << op) - 1)];
                            continue dodist;
                        } else {
                            strm.msg = "invalid distance code";
                            state.mode = 16209;
                            break top;
                        }
                        break;
                    }
                } else if (0 === (64 & op)) {
                    here = lcode[(65535 & here) + (hold & (1 << op) - 1)];
                    continue dolen;
                } else if (32 & op) {
                    state.mode = 16191;
                    break top;
                } else {
                    strm.msg = "invalid literal/length code";
                    state.mode = 16209;
                    break top;
                }
                break;
            }
        } while (_in < last && _out < end);
        len = bits >> 3;
        _in -= len;
        bits -= len << 3;
        hold &= (1 << bits) - 1;
        strm.next_in = _in;
        strm.next_out = _out;
        strm.avail_in = _in < last ? last - _in + 5 : 5 - (_in - last);
        strm.avail_out = _out < end ? end - _out + 257 : 257 - (_out - end);
        state.hold = hold;
        state.bits = bits;
    };
    const lbase = new Uint16Array([ 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0 ]);
    const lext = new Uint8Array([ 16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78 ]);
    const dbase = new Uint16Array([ 1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0 ]);
    const dext = new Uint8Array([ 16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64 ]);
    var inftrees = (type, lens, lens_index, codes, table, table_index, work, opts) => {
        const bits = opts.bits;
        let len = 0;
        let sym = 0;
        let min = 0, max = 0;
        let root = 0;
        let curr = 0;
        let drop = 0;
        let left = 0;
        let used = 0;
        let huff = 0;
        let incr;
        let fill;
        let low;
        let mask;
        let next;
        let base = null;
        let match;
        const count = new Uint16Array(16);
        const offs = new Uint16Array(16);
        let extra = null;
        let here_bits, here_op, here_val;
        for (len = 0; len <= 15; len++) {
            count[len] = 0;
        }
        for (sym = 0; sym < codes; sym++) {
            count[lens[lens_index + sym]]++;
        }
        root = bits;
        for (max = 15; max >= 1 && 0 === count[max]; max--) {}
        if (root > max) {
            root = max;
        }
        if (0 === max) {
            table[table_index++] = 20971520;
            table[table_index++] = 20971520;
            opts.bits = 1;
            return 0;
        }
        for (min = 1; min < max && 0 === count[min]; min++) {}
        if (root < min) {
            root = min;
        }
        left = 1;
        for (len = 1; len <= 15; len++) {
            left <<= 1;
            left -= count[len];
            if (left < 0) {
                return -1;
            }
        }
        if (left > 0 && (0 === type || 1 !== max)) {
            return -1;
        }
        offs[1] = 0;
        for (len = 1; len < 15; len++) {
            offs[len + 1] = offs[len] + count[len];
        }
        for (sym = 0; sym < codes; sym++) {
            if (0 !== lens[lens_index + sym]) {
                work[offs[lens[lens_index + sym]]++] = sym;
            }
        }
        if (0 === type) {
            base = extra = work;
            match = 20;
        } else if (1 === type) {
            base = lbase;
            extra = lext;
            match = 257;
        } else {
            base = dbase;
            extra = dext;
            match = 0;
        }
        huff = 0;
        sym = 0;
        len = min;
        next = table_index;
        curr = root;
        drop = 0;
        low = -1;
        used = 1 << root;
        mask = used - 1;
        if (1 === type && used > 852 || 2 === type && used > 592) {
            return 1;
        }
        for (;;) {
            here_bits = len - drop;
            if (work[sym] + 1 < match) {
                here_op = 0;
                here_val = work[sym];
            } else if (work[sym] >= match) {
                here_op = extra[work[sym] - match];
                here_val = base[work[sym] - match];
            } else {
                here_op = 96;
                here_val = 0;
            }
            incr = 1 << len - drop;
            fill = 1 << curr;
            min = fill;
            do {
                fill -= incr;
                table[next + (huff >> drop) + fill] = here_bits << 24 | here_op << 16 | here_val;
            } while (0 !== fill);
            incr = 1 << len - 1;
            for (;huff & incr; ) {
                incr >>= 1;
            }
            if (0 !== incr) {
                huff &= incr - 1;
                huff += incr;
            } else {
                huff = 0;
            }
            sym++;
            if (0 === --count[len]) {
                if (len === max) {
                    break;
                }
                len = lens[lens_index + work[sym]];
            }
            if (len > root && (huff & mask) !== low) {
                if (0 === drop) {
                    drop = root;
                }
                next += min;
                curr = len - drop;
                left = 1 << curr;
                for (;curr + drop < max; ) {
                    left -= count[curr + drop];
                    if (left <= 0) {
                        break;
                    }
                    curr++;
                    left <<= 1;
                }
                used += 1 << curr;
                if (1 === type && used > 852 || 2 === type && used > 592) {
                    return 1;
                }
                low = huff & mask;
                table[low] = root << 24 | curr << 16 | next - table_index;
            }
        }
        if (0 !== huff) {
            table[next + huff] = len - drop << 24 | 64 << 16;
        }
        opts.bits = root;
        return 0;
    };
    const {Z_FINISH: Z_FINISH$1, Z_BLOCK, Z_TREES, Z_OK: Z_OK$1, Z_STREAM_END: Z_STREAM_END$1, Z_NEED_DICT: Z_NEED_DICT$1, Z_STREAM_ERROR: Z_STREAM_ERROR$1, Z_DATA_ERROR: Z_DATA_ERROR$1, Z_MEM_ERROR: Z_MEM_ERROR$1, Z_BUF_ERROR, Z_DEFLATED} = constants$2;
    const BAD = 16209;
    const zswap32 = q => (q >>> 24 & 255) + (q >>> 8 & 65280) + ((65280 & q) << 8) + ((255 & q) << 24);
    function InflateState() {
        this.strm = null;
        this.mode = 0;
        this.last = false;
        this.wrap = 0;
        this.havedict = false;
        this.flags = 0;
        this.dmax = 0;
        this.check = 0;
        this.total = 0;
        this.head = null;
        this.wbits = 0;
        this.wsize = 0;
        this.whave = 0;
        this.wnext = 0;
        this.window = null;
        this.hold = 0;
        this.bits = 0;
        this.length = 0;
        this.offset = 0;
        this.extra = 0;
        this.lencode = null;
        this.distcode = null;
        this.lenbits = 0;
        this.distbits = 0;
        this.ncode = 0;
        this.nlen = 0;
        this.ndist = 0;
        this.have = 0;
        this.next = null;
        this.lens = new Uint16Array(320);
        this.work = new Uint16Array(288);
        this.lendyn = null;
        this.distdyn = null;
        this.sane = 0;
        this.back = 0;
        this.was = 0;
    }
    const inflateStateCheck = strm => {
        if (!strm) {
            return 1;
        }
        const state = strm.state;
        if (!state || state.strm !== strm || state.mode < 16180 || state.mode > 16211) {
            return 1;
        } else {
            return 0;
        }
    };
    const inflateResetKeep = strm => {
        if (inflateStateCheck(strm)) {
            return Z_STREAM_ERROR$1;
        }
        const state = strm.state;
        strm.total_in = strm.total_out = state.total = 0;
        strm.msg = "";
        if (state.wrap) {
            strm.adler = 1 & state.wrap;
        }
        state.mode = 16180;
        state.last = 0;
        state.havedict = 0;
        state.flags = -1;
        state.dmax = 32768;
        state.head = null;
        state.hold = 0;
        state.bits = 0;
        state.lencode = state.lendyn = new Int32Array(852);
        state.distcode = state.distdyn = new Int32Array(592);
        state.sane = 1;
        state.back = -1;
        return Z_OK$1;
    };
    const inflateReset = strm => {
        if (inflateStateCheck(strm)) {
            return Z_STREAM_ERROR$1;
        }
        const state = strm.state;
        state.wsize = 0;
        state.whave = 0;
        state.wnext = 0;
        return inflateResetKeep(strm);
    };
    const inflateReset2 = (strm, windowBits) => {
        let wrap;
        if (inflateStateCheck(strm)) {
            return Z_STREAM_ERROR$1;
        }
        const state = strm.state;
        if (windowBits < 0) {
            wrap = 0;
            windowBits = -windowBits;
        } else {
            wrap = 5 + (windowBits >> 4);
            if (windowBits < 48) {
                windowBits &= 15;
            }
        }
        if (windowBits && (windowBits < 8 || windowBits > 15)) {
            return Z_STREAM_ERROR$1;
        }
        if (null !== state.window && state.wbits !== windowBits) {
            state.window = null;
        }
        state.wrap = wrap;
        state.wbits = windowBits;
        return inflateReset(strm);
    };
    const inflateInit2 = (strm, windowBits) => {
        if (!strm) {
            return Z_STREAM_ERROR$1;
        }
        const state = new InflateState;
        strm.state = state;
        state.strm = strm;
        state.window = null;
        state.mode = 16180;
        const ret = inflateReset2(strm, windowBits);
        if (ret !== Z_OK$1) {
            strm.state = null;
        }
        return ret;
    };
    let virgin = true;
    let lenfix, distfix;
    const fixedtables = state => {
        if (virgin) {
            lenfix = new Int32Array(512);
            distfix = new Int32Array(32);
            let sym = 0;
            for (;sym < 144; ) {
                state.lens[sym++] = 8;
            }
            for (;sym < 256; ) {
                state.lens[sym++] = 9;
            }
            for (;sym < 280; ) {
                state.lens[sym++] = 7;
            }
            for (;sym < 288; ) {
                state.lens[sym++] = 8;
            }
            inftrees(1, state.lens, 0, 288, lenfix, 0, state.work, {
                bits: 9
            });
            sym = 0;
            for (;sym < 32; ) {
                state.lens[sym++] = 5;
            }
            inftrees(2, state.lens, 0, 32, distfix, 0, state.work, {
                bits: 5
            });
            virgin = false;
        }
        state.lencode = lenfix;
        state.lenbits = 9;
        state.distcode = distfix;
        state.distbits = 5;
    };
    const updatewindow = (strm, src, end, copy) => {
        let dist;
        const state = strm.state;
        if (null === state.window) {
            state.wsize = 1 << state.wbits;
            state.wnext = 0;
            state.whave = 0;
            state.window = new Uint8Array(state.wsize);
        }
        if (copy >= state.wsize) {
            state.window.set(src.subarray(end - state.wsize, end), 0);
            state.wnext = 0;
            state.whave = state.wsize;
        } else {
            dist = state.wsize - state.wnext;
            if (dist > copy) {
                dist = copy;
            }
            state.window.set(src.subarray(end - copy, end - copy + dist), state.wnext);
            if (copy -= dist) {
                state.window.set(src.subarray(end - copy, end), 0);
                state.wnext = copy;
                state.whave = state.wsize;
            } else {
                state.wnext += dist;
                if (state.wnext === state.wsize) {
                    state.wnext = 0;
                }
                if (state.whave < state.wsize) {
                    state.whave += dist;
                }
            }
        }
        return 0;
    };
    var inflate_1$2 = {
        inflateReset,
        inflateReset2,
        inflateResetKeep,
        inflateInit: strm => inflateInit2(strm, 15),
        inflateInit2,
        inflate: (strm, flush) => {
            let state;
            let input, output;
            let next;
            let put;
            let have, left;
            let hold;
            let bits;
            let _in, _out;
            let copy;
            let from;
            let from_source;
            let here = 0;
            let here_bits, here_op, here_val;
            let last_bits, last_op, last_val;
            let len;
            let ret;
            const hbuf = new Uint8Array(4);
            let opts;
            let n;
            const order = new Uint8Array([ 16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15 ]);
            if (inflateStateCheck(strm) || !strm.output || !strm.input && 0 !== strm.avail_in) {
                return Z_STREAM_ERROR$1;
            }
            state = strm.state;
            if (16191 === state.mode) {
                state.mode = 16192;
            }
            put = strm.next_out;
            output = strm.output;
            left = strm.avail_out;
            next = strm.next_in;
            input = strm.input;
            have = strm.avail_in;
            hold = state.hold;
            bits = state.bits;
            _in = have;
            _out = left;
            ret = Z_OK$1;
            inf_leave: for (;;) {
                switch (state.mode) {
                  case 16180:
                    if (0 === state.wrap) {
                        state.mode = 16192;
                        break;
                    }
                    for (;bits < 16; ) {
                        if (0 === have) {
                            break inf_leave;
                        }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                    }
                    if (2 & state.wrap && 35615 === hold) {
                        if (0 === state.wbits) {
                            state.wbits = 15;
                        }
                        state.check = 0;
                        hbuf[0] = 255 & hold;
                        hbuf[1] = hold >>> 8 & 255;
                        state.check = crc32_1(state.check, hbuf, 2, 0);
                        hold = 0;
                        bits = 0;
                        state.mode = 16181;
                        break;
                    }
                    if (state.head) {
                        state.head.done = false;
                    }
                    if (!(1 & state.wrap) || (((255 & hold) << 8) + (hold >> 8)) % 31) {
                        strm.msg = "incorrect header check";
                        state.mode = BAD;
                        break;
                    }
                    if ((15 & hold) !== Z_DEFLATED) {
                        strm.msg = "unknown compression method";
                        state.mode = BAD;
                        break;
                    }
                    hold >>>= 4;
                    bits -= 4;
                    len = 8 + (15 & hold);
                    if (0 === state.wbits) {
                        state.wbits = len;
                    }
                    if (len > 15 || len > state.wbits) {
                        strm.msg = "invalid window size";
                        state.mode = BAD;
                        break;
                    }
                    state.dmax = 1 << state.wbits;
                    state.flags = 0;
                    strm.adler = state.check = 1;
                    state.mode = 512 & hold ? 16189 : 16191;
                    hold = 0;
                    bits = 0;
                    break;

                  case 16181:
                    for (;bits < 16; ) {
                        if (0 === have) {
                            break inf_leave;
                        }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                    }
                    state.flags = hold;
                    if ((255 & state.flags) !== Z_DEFLATED) {
                        strm.msg = "unknown compression method";
                        state.mode = BAD;
                        break;
                    }
                    if (57344 & state.flags) {
                        strm.msg = "unknown header flags set";
                        state.mode = BAD;
                        break;
                    }
                    if (state.head) {
                        state.head.text = hold >> 8 & 1;
                    }
                    if (512 & state.flags && 4 & state.wrap) {
                        hbuf[0] = 255 & hold;
                        hbuf[1] = hold >>> 8 & 255;
                        state.check = crc32_1(state.check, hbuf, 2, 0);
                    }
                    hold = 0;
                    bits = 0;
                    state.mode = 16182;

                  case 16182:
                    for (;bits < 32; ) {
                        if (0 === have) {
                            break inf_leave;
                        }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                    }
                    if (state.head) {
                        state.head.time = hold;
                    }
                    if (512 & state.flags && 4 & state.wrap) {
                        hbuf[0] = 255 & hold;
                        hbuf[1] = hold >>> 8 & 255;
                        hbuf[2] = hold >>> 16 & 255;
                        hbuf[3] = hold >>> 24 & 255;
                        state.check = crc32_1(state.check, hbuf, 4, 0);
                    }
                    hold = 0;
                    bits = 0;
                    state.mode = 16183;

                  case 16183:
                    for (;bits < 16; ) {
                        if (0 === have) {
                            break inf_leave;
                        }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                    }
                    if (state.head) {
                        state.head.xflags = 255 & hold;
                        state.head.os = hold >> 8;
                    }
                    if (512 & state.flags && 4 & state.wrap) {
                        hbuf[0] = 255 & hold;
                        hbuf[1] = hold >>> 8 & 255;
                        state.check = crc32_1(state.check, hbuf, 2, 0);
                    }
                    hold = 0;
                    bits = 0;
                    state.mode = 16184;

                  case 16184:
                    if (1024 & state.flags) {
                        for (;bits < 16; ) {
                            if (0 === have) {
                                break inf_leave;
                            }
                            have--;
                            hold += input[next++] << bits;
                            bits += 8;
                        }
                        state.length = hold;
                        if (state.head) {
                            state.head.extra_len = hold;
                        }
                        if (512 & state.flags && 4 & state.wrap) {
                            hbuf[0] = 255 & hold;
                            hbuf[1] = hold >>> 8 & 255;
                            state.check = crc32_1(state.check, hbuf, 2, 0);
                        }
                        hold = 0;
                        bits = 0;
                    } else if (state.head) {
                        state.head.extra = null;
                    }
                    state.mode = 16185;

                  case 16185:
                    if (1024 & state.flags) {
                        copy = state.length;
                        if (copy > have) {
                            copy = have;
                        }
                        if (copy) {
                            if (state.head) {
                                len = state.head.extra_len - state.length;
                                if (!state.head.extra) {
                                    state.head.extra = new Uint8Array(state.head.extra_len);
                                }
                                state.head.extra.set(input.subarray(next, next + copy), len);
                            }
                            if (512 & state.flags && 4 & state.wrap) {
                                state.check = crc32_1(state.check, input, copy, next);
                            }
                            have -= copy;
                            next += copy;
                            state.length -= copy;
                        }
                        if (state.length) {
                            break inf_leave;
                        }
                    }
                    state.length = 0;
                    state.mode = 16186;

                  case 16186:
                    if (2048 & state.flags) {
                        if (0 === have) {
                            break inf_leave;
                        }
                        copy = 0;
                        do {
                            len = input[next + copy++];
                            if (state.head && len && state.length < 65536) {
                                state.head.name += String.fromCharCode(len);
                            }
                        } while (len && copy < have);
                        if (512 & state.flags && 4 & state.wrap) {
                            state.check = crc32_1(state.check, input, copy, next);
                        }
                        have -= copy;
                        next += copy;
                        if (len) {
                            break inf_leave;
                        }
                    } else if (state.head) {
                        state.head.name = null;
                    }
                    state.length = 0;
                    state.mode = 16187;

                  case 16187:
                    if (4096 & state.flags) {
                        if (0 === have) {
                            break inf_leave;
                        }
                        copy = 0;
                        do {
                            len = input[next + copy++];
                            if (state.head && len && state.length < 65536) {
                                state.head.comment += String.fromCharCode(len);
                            }
                        } while (len && copy < have);
                        if (512 & state.flags && 4 & state.wrap) {
                            state.check = crc32_1(state.check, input, copy, next);
                        }
                        have -= copy;
                        next += copy;
                        if (len) {
                            break inf_leave;
                        }
                    } else if (state.head) {
                        state.head.comment = null;
                    }
                    state.mode = 16188;

                  case 16188:
                    if (512 & state.flags) {
                        for (;bits < 16; ) {
                            if (0 === have) {
                                break inf_leave;
                            }
                            have--;
                            hold += input[next++] << bits;
                            bits += 8;
                        }
                        if (4 & state.wrap && hold !== (65535 & state.check)) {
                            strm.msg = "header crc mismatch";
                            state.mode = BAD;
                            break;
                        }
                        hold = 0;
                        bits = 0;
                    }
                    if (state.head) {
                        state.head.hcrc = state.flags >> 9 & 1;
                        state.head.done = true;
                    }
                    strm.adler = state.check = 0;
                    state.mode = 16191;
                    break;

                  case 16189:
                    for (;bits < 32; ) {
                        if (0 === have) {
                            break inf_leave;
                        }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                    }
                    strm.adler = state.check = zswap32(hold);
                    hold = 0;
                    bits = 0;
                    state.mode = 16190;

                  case 16190:
                    if (0 === state.havedict) {
                        strm.next_out = put;
                        strm.avail_out = left;
                        strm.next_in = next;
                        strm.avail_in = have;
                        state.hold = hold;
                        state.bits = bits;
                        return Z_NEED_DICT$1;
                    }
                    strm.adler = state.check = 1;
                    state.mode = 16191;

                  case 16191:
                    if (flush === Z_BLOCK || flush === Z_TREES) {
                        break inf_leave;
                    }

                  case 16192:
                    if (state.last) {
                        hold >>>= 7 & bits;
                        bits -= 7 & bits;
                        state.mode = 16206;
                        break;
                    }
                    for (;bits < 3; ) {
                        if (0 === have) {
                            break inf_leave;
                        }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                    }
                    state.last = 1 & hold;
                    hold >>>= 1;
                    bits -= 1;
                    switch (3 & hold) {
                      case 0:
                        state.mode = 16193;
                        break;

                      case 1:
                        fixedtables(state);
                        state.mode = 16199;
                        if (flush === Z_TREES) {
                            hold >>>= 2;
                            bits -= 2;
                            break inf_leave;
                        }
                        break;

                      case 2:
                        state.mode = 16196;
                        break;

                      case 3:
                        strm.msg = "invalid block type";
                        state.mode = BAD;
                    }
                    hold >>>= 2;
                    bits -= 2;
                    break;

                  case 16193:
                    hold >>>= 7 & bits;
                    bits -= 7 & bits;
                    for (;bits < 32; ) {
                        if (0 === have) {
                            break inf_leave;
                        }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                    }
                    if ((65535 & hold) !== (hold >>> 16 ^ 65535)) {
                        strm.msg = "invalid stored block lengths";
                        state.mode = BAD;
                        break;
                    }
                    state.length = 65535 & hold;
                    hold = 0;
                    bits = 0;
                    state.mode = 16194;
                    if (flush === Z_TREES) {
                        break inf_leave;
                    }

                  case 16194:
                    state.mode = 16195;

                  case 16195:
                    copy = state.length;
                    if (copy) {
                        if (copy > have) {
                            copy = have;
                        }
                        if (copy > left) {
                            copy = left;
                        }
                        if (0 === copy) {
                            break inf_leave;
                        }
                        output.set(input.subarray(next, next + copy), put);
                        have -= copy;
                        next += copy;
                        left -= copy;
                        put += copy;
                        state.length -= copy;
                        break;
                    }
                    state.mode = 16191;
                    break;

                  case 16196:
                    for (;bits < 14; ) {
                        if (0 === have) {
                            break inf_leave;
                        }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                    }
                    state.nlen = 257 + (31 & hold);
                    hold >>>= 5;
                    bits -= 5;
                    state.ndist = 1 + (31 & hold);
                    hold >>>= 5;
                    bits -= 5;
                    state.ncode = 4 + (15 & hold);
                    hold >>>= 4;
                    bits -= 4;
                    if (state.nlen > 286 || state.ndist > 30) {
                        strm.msg = "too many length or distance symbols";
                        state.mode = BAD;
                        break;
                    }
                    state.have = 0;
                    state.mode = 16197;

                  case 16197:
                    for (;state.have < state.ncode; ) {
                        for (;bits < 3; ) {
                            if (0 === have) {
                                break inf_leave;
                            }
                            have--;
                            hold += input[next++] << bits;
                            bits += 8;
                        }
                        state.lens[order[state.have++]] = 7 & hold;
                        hold >>>= 3;
                        bits -= 3;
                    }
                    for (;state.have < 19; ) {
                        state.lens[order[state.have++]] = 0;
                    }
                    state.lencode = state.lendyn;
                    state.lenbits = 7;
                    opts = {
                        bits: state.lenbits
                    };
                    ret = inftrees(0, state.lens, 0, 19, state.lencode, 0, state.work, opts);
                    state.lenbits = opts.bits;
                    if (ret) {
                        strm.msg = "invalid code lengths set";
                        state.mode = BAD;
                        break;
                    }
                    state.have = 0;
                    state.mode = 16198;

                  case 16198:
                    for (;state.have < state.nlen + state.ndist; ) {
                        for (;;) {
                            here = state.lencode[hold & (1 << state.lenbits) - 1];
                            here_bits = here >>> 24;
                            here_op = here >>> 16 & 255;
                            here_val = 65535 & here;
                            if (here_bits <= bits) {
                                break;
                            }
                            if (0 === have) {
                                break inf_leave;
                            }
                            have--;
                            hold += input[next++] << bits;
                            bits += 8;
                        }
                        if (here_val < 16) {
                            hold >>>= here_bits;
                            bits -= here_bits;
                            state.lens[state.have++] = here_val;
                        } else {
                            if (16 === here_val) {
                                n = here_bits + 2;
                                for (;bits < n; ) {
                                    if (0 === have) {
                                        break inf_leave;
                                    }
                                    have--;
                                    hold += input[next++] << bits;
                                    bits += 8;
                                }
                                hold >>>= here_bits;
                                bits -= here_bits;
                                if (0 === state.have) {
                                    strm.msg = "invalid bit length repeat";
                                    state.mode = BAD;
                                    break;
                                }
                                len = state.lens[state.have - 1];
                                copy = 3 + (3 & hold);
                                hold >>>= 2;
                                bits -= 2;
                            } else if (17 === here_val) {
                                n = here_bits + 3;
                                for (;bits < n; ) {
                                    if (0 === have) {
                                        break inf_leave;
                                    }
                                    have--;
                                    hold += input[next++] << bits;
                                    bits += 8;
                                }
                                hold >>>= here_bits;
                                bits -= here_bits;
                                len = 0;
                                copy = 3 + (7 & hold);
                                hold >>>= 3;
                                bits -= 3;
                            } else {
                                n = here_bits + 7;
                                for (;bits < n; ) {
                                    if (0 === have) {
                                        break inf_leave;
                                    }
                                    have--;
                                    hold += input[next++] << bits;
                                    bits += 8;
                                }
                                hold >>>= here_bits;
                                bits -= here_bits;
                                len = 0;
                                copy = 11 + (127 & hold);
                                hold >>>= 7;
                                bits -= 7;
                            }
                            if (state.have + copy > state.nlen + state.ndist) {
                                strm.msg = "invalid bit length repeat";
                                state.mode = BAD;
                                break;
                            }
                            for (;copy--; ) {
                                state.lens[state.have++] = len;
                            }
                        }
                    }
                    if (state.mode === BAD) {
                        break;
                    }
                    if (0 === state.lens[256]) {
                        strm.msg = "invalid code -- missing end-of-block";
                        state.mode = BAD;
                        break;
                    }
                    state.lenbits = 9;
                    opts = {
                        bits: state.lenbits
                    };
                    ret = inftrees(1, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
                    state.lenbits = opts.bits;
                    if (ret) {
                        strm.msg = "invalid literal/lengths set";
                        state.mode = BAD;
                        break;
                    }
                    state.distbits = 6;
                    state.distcode = state.distdyn;
                    opts = {
                        bits: state.distbits
                    };
                    ret = inftrees(2, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
                    state.distbits = opts.bits;
                    if (ret) {
                        strm.msg = "invalid distances set";
                        state.mode = BAD;
                        break;
                    }
                    state.mode = 16199;
                    if (flush === Z_TREES) {
                        break inf_leave;
                    }

                  case 16199:
                    state.mode = 16200;

                  case 16200:
                    if (have >= 6 && left >= 258) {
                        strm.next_out = put;
                        strm.avail_out = left;
                        strm.next_in = next;
                        strm.avail_in = have;
                        state.hold = hold;
                        state.bits = bits;
                        inffast(strm, _out);
                        put = strm.next_out;
                        output = strm.output;
                        left = strm.avail_out;
                        next = strm.next_in;
                        input = strm.input;
                        have = strm.avail_in;
                        hold = state.hold;
                        bits = state.bits;
                        if (16191 === state.mode) {
                            state.back = -1;
                        }
                        break;
                    }
                    state.back = 0;
                    for (;;) {
                        here = state.lencode[hold & (1 << state.lenbits) - 1];
                        here_bits = here >>> 24;
                        here_op = here >>> 16 & 255;
                        here_val = 65535 & here;
                        if (here_bits <= bits) {
                            break;
                        }
                        if (0 === have) {
                            break inf_leave;
                        }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                    }
                    if (here_op && 0 === (240 & here_op)) {
                        last_bits = here_bits;
                        last_op = here_op;
                        last_val = here_val;
                        for (;;) {
                            here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                            here_bits = here >>> 24;
                            here_op = here >>> 16 & 255;
                            here_val = 65535 & here;
                            if (last_bits + here_bits <= bits) {
                                break;
                            }
                            if (0 === have) {
                                break inf_leave;
                            }
                            have--;
                            hold += input[next++] << bits;
                            bits += 8;
                        }
                        hold >>>= last_bits;
                        bits -= last_bits;
                        state.back += last_bits;
                    }
                    hold >>>= here_bits;
                    bits -= here_bits;
                    state.back += here_bits;
                    state.length = here_val;
                    if (0 === here_op) {
                        state.mode = 16205;
                        break;
                    }
                    if (32 & here_op) {
                        state.back = -1;
                        state.mode = 16191;
                        break;
                    }
                    if (64 & here_op) {
                        strm.msg = "invalid literal/length code";
                        state.mode = BAD;
                        break;
                    }
                    state.extra = 15 & here_op;
                    state.mode = 16201;

                  case 16201:
                    if (state.extra) {
                        n = state.extra;
                        for (;bits < n; ) {
                            if (0 === have) {
                                break inf_leave;
                            }
                            have--;
                            hold += input[next++] << bits;
                            bits += 8;
                        }
                        state.length += hold & (1 << state.extra) - 1;
                        hold >>>= state.extra;
                        bits -= state.extra;
                        state.back += state.extra;
                    }
                    state.was = state.length;
                    state.mode = 16202;

                  case 16202:
                    for (;;) {
                        here = state.distcode[hold & (1 << state.distbits) - 1];
                        here_bits = here >>> 24;
                        here_op = here >>> 16 & 255;
                        here_val = 65535 & here;
                        if (here_bits <= bits) {
                            break;
                        }
                        if (0 === have) {
                            break inf_leave;
                        }
                        have--;
                        hold += input[next++] << bits;
                        bits += 8;
                    }
                    if (0 === (240 & here_op)) {
                        last_bits = here_bits;
                        last_op = here_op;
                        last_val = here_val;
                        for (;;) {
                            here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                            here_bits = here >>> 24;
                            here_op = here >>> 16 & 255;
                            here_val = 65535 & here;
                            if (last_bits + here_bits <= bits) {
                                break;
                            }
                            if (0 === have) {
                                break inf_leave;
                            }
                            have--;
                            hold += input[next++] << bits;
                            bits += 8;
                        }
                        hold >>>= last_bits;
                        bits -= last_bits;
                        state.back += last_bits;
                    }
                    hold >>>= here_bits;
                    bits -= here_bits;
                    state.back += here_bits;
                    if (64 & here_op) {
                        strm.msg = "invalid distance code";
                        state.mode = BAD;
                        break;
                    }
                    state.offset = here_val;
                    state.extra = 15 & here_op;
                    state.mode = 16203;

                  case 16203:
                    if (state.extra) {
                        n = state.extra;
                        for (;bits < n; ) {
                            if (0 === have) {
                                break inf_leave;
                            }
                            have--;
                            hold += input[next++] << bits;
                            bits += 8;
                        }
                        state.offset += hold & (1 << state.extra) - 1;
                        hold >>>= state.extra;
                        bits -= state.extra;
                        state.back += state.extra;
                    }
                    if (state.offset > state.dmax) {
                        strm.msg = "invalid distance too far back";
                        state.mode = BAD;
                        break;
                    }
                    state.mode = 16204;

                  case 16204:
                    if (0 === left) {
                        break inf_leave;
                    }
                    copy = _out - left;
                    if (state.offset > copy) {
                        copy = state.offset - copy;
                        if (copy > state.whave) {
                            if (state.sane) {
                                strm.msg = "invalid distance too far back";
                                state.mode = BAD;
                                break;
                            }
                        }
                        if (copy > state.wnext) {
                            copy -= state.wnext;
                            from = state.wsize - copy;
                        } else {
                            from = state.wnext - copy;
                        }
                        if (copy > state.length) {
                            copy = state.length;
                        }
                        from_source = state.window;
                    } else {
                        from_source = output;
                        from = put - state.offset;
                        copy = state.length;
                    }
                    if (copy > left) {
                        copy = left;
                    }
                    left -= copy;
                    state.length -= copy;
                    do {
                        output[put++] = from_source[from++];
                    } while (--copy);
                    if (0 === state.length) {
                        state.mode = 16200;
                    }
                    break;

                  case 16205:
                    if (0 === left) {
                        break inf_leave;
                    }
                    output[put++] = state.length;
                    left--;
                    state.mode = 16200;
                    break;

                  case 16206:
                    if (state.wrap) {
                        for (;bits < 32; ) {
                            if (0 === have) {
                                break inf_leave;
                            }
                            have--;
                            hold |= input[next++] << bits;
                            bits += 8;
                        }
                        _out -= left;
                        strm.total_out += _out;
                        state.total += _out;
                        if (4 & state.wrap && _out) {
                            strm.adler = state.check = state.flags ? crc32_1(state.check, output, _out, put - _out) : adler32_1(state.check, output, _out, put - _out);
                        }
                        _out = left;
                        if (4 & state.wrap && (state.flags ? hold : zswap32(hold)) !== state.check) {
                            strm.msg = "incorrect data check";
                            state.mode = BAD;
                            break;
                        }
                        hold = 0;
                        bits = 0;
                    }
                    state.mode = 16207;

                  case 16207:
                    if (state.wrap && state.flags) {
                        for (;bits < 32; ) {
                            if (0 === have) {
                                break inf_leave;
                            }
                            have--;
                            hold += input[next++] << bits;
                            bits += 8;
                        }
                        if (4 & state.wrap && hold !== (4294967295 & state.total)) {
                            strm.msg = "incorrect length check";
                            state.mode = BAD;
                            break;
                        }
                        hold = 0;
                        bits = 0;
                    }
                    state.mode = 16208;

                  case 16208:
                    ret = Z_STREAM_END$1;
                    break inf_leave;

                  case BAD:
                    ret = Z_DATA_ERROR$1;
                    break inf_leave;

                  case 16210:
                    return Z_MEM_ERROR$1;

                  default:
                    return Z_STREAM_ERROR$1;
                }
            }
            strm.next_out = put;
            strm.avail_out = left;
            strm.next_in = next;
            strm.avail_in = have;
            state.hold = hold;
            state.bits = bits;
            if (state.wsize || _out !== strm.avail_out && state.mode < BAD && (state.mode < 16206 || flush !== Z_FINISH$1)) {
                if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) {}
            }
            _in -= strm.avail_in;
            _out -= strm.avail_out;
            strm.total_in += _in;
            strm.total_out += _out;
            state.total += _out;
            if (4 & state.wrap && _out) {
                strm.adler = state.check = state.flags ? crc32_1(state.check, output, _out, strm.next_out - _out) : adler32_1(state.check, output, _out, strm.next_out - _out);
            }
            strm.data_type = state.bits + (state.last ? 64 : 0) + (16191 === state.mode ? 128 : 0) + (16199 === state.mode || 16194 === state.mode ? 256 : 0);
            if ((0 === _in && 0 === _out || flush === Z_FINISH$1) && ret === Z_OK$1) {
                ret = Z_BUF_ERROR;
            }
            return ret;
        },
        inflateEnd: strm => {
            if (inflateStateCheck(strm)) {
                return Z_STREAM_ERROR$1;
            }
            let state = strm.state;
            if (state.window) {
                state.window = null;
            }
            strm.state = null;
            return Z_OK$1;
        },
        inflateGetHeader: (strm, head) => {
            if (inflateStateCheck(strm)) {
                return Z_STREAM_ERROR$1;
            }
            const state = strm.state;
            if (0 === (2 & state.wrap)) {
                return Z_STREAM_ERROR$1;
            }
            state.head = head;
            head.done = false;
            return Z_OK$1;
        },
        inflateSetDictionary: (strm, dictionary) => {
            const dictLength = dictionary.length;
            let state;
            let dictid;
            let ret;
            if (inflateStateCheck(strm)) {
                return Z_STREAM_ERROR$1;
            }
            state = strm.state;
            if (0 !== state.wrap && 16190 !== state.mode) {
                return Z_STREAM_ERROR$1;
            }
            if (16190 === state.mode) {
                dictid = 1;
                dictid = adler32_1(dictid, dictionary, dictLength, 0);
                if (dictid !== state.check) {
                    return Z_DATA_ERROR$1;
                }
            }
            ret = updatewindow(strm, dictionary, dictLength, dictLength);
            if (ret) {
                state.mode = 16210;
                return Z_MEM_ERROR$1;
            }
            state.havedict = 1;
            return Z_OK$1;
        },
        inflateInfo: "pako inflate (from Nodeca project)"
    };
    var gzheader = function GZheader() {
        this.text = 0;
        this.time = 0;
        this.xflags = 0;
        this.os = 0;
        this.extra = null;
        this.extra_len = 0;
        this.name = "";
        this.comment = "";
        this.hcrc = 0;
        this.done = false;
    };
    const pako_esm_toString = Object.prototype.toString;
    const {Z_NO_FLUSH, Z_FINISH, Z_OK, Z_STREAM_END, Z_NEED_DICT, Z_STREAM_ERROR, Z_DATA_ERROR, Z_MEM_ERROR} = constants$2;
    function Inflate$1(options) {
        this.options = common_assign({
            chunkSize: 65536,
            windowBits: 15,
            to: ""
        }, options || {});
        const opt = this.options;
        if (opt.raw && opt.windowBits >= 0 && opt.windowBits < 16) {
            opt.windowBits = -opt.windowBits;
            if (0 === opt.windowBits) {
                opt.windowBits = -15;
            }
        }
        if (opt.windowBits >= 0 && opt.windowBits < 16 && !(options && options.windowBits)) {
            opt.windowBits += 32;
        }
        if (opt.windowBits > 15 && opt.windowBits < 48) {
            if (0 === (15 & opt.windowBits)) {
                opt.windowBits |= 15;
            }
        }
        this.err = 0;
        this.msg = "";
        this.ended = false;
        this.chunks = [];
        this.strm = new zstream;
        this.strm.avail_out = 0;
        let status = inflate_1$2.inflateInit2(this.strm, opt.windowBits);
        if (status !== Z_OK) {
            throw new Error(messages[status]);
        }
        this.header = new gzheader;
        inflate_1$2.inflateGetHeader(this.strm, this.header);
        if (opt.dictionary) {
            if ("string" === typeof opt.dictionary) {
                opt.dictionary = strings_string2buf(opt.dictionary);
            } else if ("[object ArrayBuffer]" === pako_esm_toString.call(opt.dictionary)) {
                opt.dictionary = new Uint8Array(opt.dictionary);
            }
            if (opt.raw) {
                status = inflate_1$2.inflateSetDictionary(this.strm, opt.dictionary);
                if (status !== Z_OK) {
                    throw new Error(messages[status]);
                }
            }
        }
    }
    Inflate$1.prototype.push = function(data, flush_mode) {
        const strm = this.strm;
        const chunkSize = this.options.chunkSize;
        const dictionary = this.options.dictionary;
        let status, _flush_mode, last_avail_out;
        if (this.ended) {
            return false;
        }
        if (flush_mode === ~~flush_mode) {
            _flush_mode = flush_mode;
        } else {
            _flush_mode = true === flush_mode ? Z_FINISH : Z_NO_FLUSH;
        }
        if ("[object ArrayBuffer]" === pako_esm_toString.call(data)) {
            strm.input = new Uint8Array(data);
        } else {
            strm.input = data;
        }
        strm.next_in = 0;
        strm.avail_in = strm.input.length;
        for (;;) {
            if (0 === strm.avail_out) {
                strm.output = new Uint8Array(chunkSize);
                strm.next_out = 0;
                strm.avail_out = chunkSize;
            }
            status = inflate_1$2.inflate(strm, _flush_mode);
            if (status === Z_NEED_DICT && dictionary) {
                status = inflate_1$2.inflateSetDictionary(strm, dictionary);
                if (status === Z_OK) {
                    status = inflate_1$2.inflate(strm, _flush_mode);
                } else if (status === Z_DATA_ERROR) {
                    status = Z_NEED_DICT;
                }
            }
            for (;strm.avail_in > 0 && status === Z_STREAM_END && strm.state.wrap > 0 && 0 !== data[strm.next_in]; ) {
                inflate_1$2.inflateReset(strm);
                status = inflate_1$2.inflate(strm, _flush_mode);
            }
            switch (status) {
              case Z_STREAM_ERROR:
              case Z_DATA_ERROR:
              case Z_NEED_DICT:
              case Z_MEM_ERROR:
                this.onEnd(status);
                this.ended = true;
                return false;
            }
            last_avail_out = strm.avail_out;
            if (strm.next_out) {
                if (0 === strm.avail_out || status === Z_STREAM_END) {
                    if ("string" === this.options.to) {
                        let next_out_utf8 = strings_utf8border(strm.output, strm.next_out);
                        let tail = strm.next_out - next_out_utf8;
                        let utf8str = strings_buf2string(strm.output, next_out_utf8);
                        strm.next_out = tail;
                        strm.avail_out = chunkSize - tail;
                        if (tail) {
                            strm.output.set(strm.output.subarray(next_out_utf8, next_out_utf8 + tail), 0);
                        }
                        this.onData(utf8str);
                    } else {
                        this.onData(strm.output.length === strm.next_out ? strm.output : strm.output.subarray(0, strm.next_out));
                    }
                }
            }
            if (status !== Z_OK || 0 !== last_avail_out) {
                if (status === Z_STREAM_END) {
                    status = inflate_1$2.inflateEnd(this.strm);
                    this.onEnd(status);
                    this.ended = true;
                    return true;
                }
                if (0 === strm.avail_in) {
                    break;
                }
            }
        }
        return true;
    };
    Inflate$1.prototype.onData = function(chunk) {
        this.chunks.push(chunk);
    };
    Inflate$1.prototype.onEnd = function(status) {
        if (status === Z_OK) {
            if ("string" === this.options.to) {
                this.result = this.chunks.join("");
            } else {
                this.result = common_flattenChunks(this.chunks);
            }
        }
        this.chunks = [];
        this.err = status;
        this.msg = this.strm.msg;
    };
    function inflate$1(input, options) {
        const inflator = new Inflate$1(options);
        inflator.push(input);
        if (inflator.err) {
            throw inflator.msg || messages[inflator.err];
        }
        return inflator.result;
    }
    var inflateRaw_1$1 = function inflateRaw$1(input, options) {
        (options = options || {}).raw = true;
        return inflate$1(input, options);
    };
    var inflate_1$1 = {
        Inflate: Inflate$1,
        inflate: inflate$1,
        inflateRaw: inflateRaw_1$1,
        ungzip: inflate$1,
        constants: constants$2
    };
    const {Deflate, deflate, deflateRaw, gzip} = deflate_1$1;
    const {Inflate, inflate, inflateRaw, ungzip} = inflate_1$1;
    var pako = {
        Deflate,
        deflate,
        deflateRaw,
        gzip,
        Inflate,
        inflate,
        inflateRaw,
        ungzip,
        constants: constants$2
    };
    class PakoWrapper {
        static compress(input) {
            const compressedData = pako.deflate(input);
            return this.uint8ArrayToBase64(compressedData);
        }
        static decompress(compressed) {
            const compressedUint8Array = this.base64ToUint8Array(compressed);
            return (new TextDecoder).decode(pako.inflate(compressedUint8Array));
        }
        static splitByCompressedSize(items, maxBytes) {
            const chunks = [];
            let bucket = [];
            for (const item of items) {
                bucket.push(item);
                if (this.compress(JSON.stringify(bucket)).length > maxBytes) {
                    bucket.pop();
                    if (0 === bucket.length) {
                        throw new Error(`Single figure exceeds the ${maxBytes}-byte quota (compressed).`);
                    }
                    chunks.push(this.compress(JSON.stringify(bucket)));
                    bucket = [ item ];
                }
            }
            if (bucket.length) {
                chunks.push(this.compress(JSON.stringify(bucket)));
            }
            return chunks;
        }
        static uint8ArrayToBase64(uint8Array) {
            let binary = "";
            const len = uint8Array.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(uint8Array[i]);
            }
            return btoa(binary);
        }
        static base64ToUint8Array(base64) {
            const binary = atob(base64);
            const len = binary.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binary.charCodeAt(i);
            }
            return bytes;
        }
    }
    const string = class {
        static isNullOrWhitespace(str) {
            return null == str || "" === str.trim();
        }
        static isNullOrEmpty(str) {
            return null == str || "" === str;
        }
    };
    class FAFigure {
        constructor(figure) {
            this.id = figure.id.trimStart("sid-");
            this.className = figure.className;
            this.image = new FAFigureImage(figure.querySelector("img"));
            this.figCaption = new FAFigureFigCaption(figure.querySelector("figcaption"));
        }
        ToHTMLElement() {
            const figure = document.createElement("figure");
            figure.id = `sid-${this.id}`;
            figure.className = this.className;
            figure.style.minWidth = this.image.width + 6 + "px";
            figure.style.height = this.image.height + 6 + "px";
            figure.appendChild(this.buildImageBElement());
            figure.appendChild(this.buildFigCaptionElement());
            return figure;
        }
        buildImageBElement() {
            const b = document.createElement("b");
            const u = document.createElement("u");
            const a = document.createElement("a");
            a.href = `/view/${this.id}`;
            a.appendChild(this.image.ToHTMLElement());
            const i = document.createElement("i");
            i.classList.add("hideonmobile", "hideontablet");
            i.title = "Click for description";
            a.appendChild(i);
            u.appendChild(a);
            b.appendChild(u);
            return b;
        }
        buildFigCaptionElement() {
            return this.figCaption.ToHTMLElement();
        }
        static fromJSON(jsonFigure) {
            const figure = JSON.parse(jsonFigure);
            return this.getRevivedObject(figure);
        }
        static getRevivedObject(jsonFigure) {
            const mock = this.getHTMLMock();
            const newFAFigure = Object.assign(new FAFigure(mock), jsonFigure);
            newFAFigure.image = Object.assign(new FAFigureImage(mock.querySelector("img")), jsonFigure.image);
            newFAFigure.figCaption = Object.assign(new FAFigureFigCaption(mock.querySelector("figcaption")), jsonFigure.figCaption);
            return newFAFigure;
        }
        static getHTMLMock() {
            return (new DOMParser).parseFromString('\n            <figure id="sid-00000000" class="r-general t-image u-example" style="height: 211px;">\n                <b>\n                    <u>\n                        <a href="/view/00000000/">\n                            <img data-tags="" class="" alt="" src="//t.furaffinity.net/0000000@400-0000000000.jpg" data-width="374.681" data-height="250" style="width: 307px; height: 205px;" loading="lazy" decoding="async">\n                            <i class="hideonmobile hideontablet" title="Click for description"></i>\n                        </a>\n                    </u>\n                </b>\n                <figcaption wfv-from-user="example" wfv-from-userDisplay="Example">\n                    <p>\n                        <a href="/view/00000000/" title="Some Title">Some Title</a>\n                    </p>\n                    <p>\n                        <i>by</i> <a href="/user/example/" title="Example">Example</a>\n                    </p>\n                </figcaption>\n                \n            </figure>', "text/html").body.firstElementChild;
        }
    }
    class FAFigureImage {
        constructor(image) {
            var _a;
            this.dataTags = null === (_a = image.getAttribute("data-tags")) || void 0 === _a ? void 0 : _a.split(" ");
            this.fileName = image.src.replace("t.furaffinity.net", "").replace("https://", "").trimEnd("/");
            this.dataWidth = parseInt(image.getAttribute("data-width"));
            this.dataHeight = parseInt(image.getAttribute("data-height"));
            this.width = parseInt(image.style.width.replace("px", ""));
            this.height = parseInt(image.style.height.replace("px", ""));
        }
        ToHTMLElement() {
            var _a, _b;
            const image = document.createElement("img");
            image.src = `//t.furaffinity.net/${this.fileName}`;
            image.className = "";
            image.alt = "";
            image.setAttribute("data-tags", null !== (_b = null === (_a = this.dataTags) || void 0 === _a ? void 0 : _a.join(" ")) && void 0 !== _b ? _b : "");
            image.setAttribute("data-width", this.dataWidth.toString());
            image.setAttribute("data-height", this.dataHeight.toString());
            image.style.width = `${this.width}px`;
            image.style.height = `${this.height}px`;
            image.loading = "lazy";
            image.decoding = "async";
            return image;
        }
    }
    class FAFigureFigCaption {
        constructor(figCaption) {
            var _a, _b, _c, _d;
            const aElems = figCaption.querySelectorAll("a");
            const firstAElem = aElems[0];
            const lastAElem = aElems[aElems.length - 1];
            this.id = firstAElem.href.replace("/view/", "").replace("www.furaffinity.net", "").replace("https://", "").trimEnd("/");
            this.title = null !== (_a = firstAElem.textContent) && void 0 !== _a ? _a : "";
            this.byUserId = lastAElem.href.replace("/user/", "").replace("www.furaffinity.net", "").replace("https://", "").trimEnd("/");
            this.byUsername = null !== (_b = lastAElem.textContent) && void 0 !== _b ? _b : "";
            this.fromId = null !== (_c = figCaption.getAttribute("wfv-from-user")) && void 0 !== _c ? _c : "";
            this.fromUsername = null !== (_d = figCaption.getAttribute("wfv-from-userDisplay")) && void 0 !== _d ? _d : "";
        }
        ToHTMLElement() {
            const figCaption = document.createElement("figcaption");
            const firstP = document.createElement("p");
            let fromText = "";
            let byText = "";
            if (showDetailedMadeByTextSetting.value) {
                fromText = "faved by ";
                byText = "made by ";
            } else {
                fromText = "from ";
                byText = "by ";
            }
            const a = document.createElement("a");
            a.href = `/view/${this.id}/`;
            a.title = this.title;
            a.textContent = this.title;
            firstP.appendChild(a);
            figCaption.appendChild(firstP);
            const secondP = document.createElement("p");
            const i = document.createElement("i");
            i.textContent = fromText;
            secondP.appendChild(i);
            const a2 = document.createElement("a");
            a2.href = `/user/${this.fromId}/`;
            a2.title = this.fromUsername;
            a2.textContent = this.fromUsername;
            a2.style.fontWeight = "400";
            secondP.appendChild(a2);
            figCaption.appendChild(secondP);
            const thirdP = document.createElement("p");
            const i2 = document.createElement("i");
            i2.textContent = byText;
            thirdP.appendChild(i2);
            const a3 = document.createElement("a");
            a3.href = `/user/${this.byUserId}/`;
            a3.title = this.byUsername;
            a3.textContent = this.byUsername;
            a3.style.fontWeight = "400";
            thirdP.appendChild(a3);
            figCaption.appendChild(thirdP);
            return figCaption;
        }
    }
    var FigureDataSaver_awaiter = function(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function(resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator.throw(value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : function adopt(value) {
                    return value instanceof P ? value : new P(function(resolve) {
                        resolve(value);
                    });
                }(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    class FigureDataSaver {
        static saveFigures(figures) {
            return FigureDataSaver_awaiter(this, void 0, void 0, function*() {
                try {
                    const compressedChunks = PakoWrapper.splitByCompressedSize(figures, this.maxChunkBytes);
                    if (compressedChunks.length) {
                        yield this.clear();
                    }
                    for (let i = 0; i < compressedChunks.length; i++) {
                        const key = `${this.scanResultIdPrefix}-${i + 1}`;
                        const success = yield StorageWrapper.setItemAsync(key, compressedChunks[i]);
                        Logger.logInfo(`Chunk ${i + 1}/${compressedChunks.length}: ${compressedChunks[i].length} bytes`);
                        if (!success) {
                            Logger.logError(`Failed to save chunk ${i + 1}. Aborting.`);
                            return false;
                        }
                    }
                    const success = yield StorageWrapper.setItemAsync(`${this.scanResultIdPrefix}-count`, compressedChunks.length.toString());
                    if (!success) {
                        Logger.logError("Failed to save chunk count.");
                    }
                    return success;
                } catch (error) {
                    Logger.logError(`Failed to save figures: ${error}`);
                    return false;
                }
            });
        }
        static loadFigures() {
            return FigureDataSaver_awaiter(this, void 0, void 0, function*() {
                const countStr = yield StorageWrapper.getItemAsync(`${this.scanResultIdPrefix}-count`);
                if (string.isNullOrWhitespace(countStr)) {
                    Logger.logWarning("No Chunk Count found. Trying to load figures anyway.");
                    return yield this.loadFiguresWithoutChunkCount();
                } else {
                    const count = parseInt(countStr, 10);
                    return yield this.loadFiguresByChunk(count);
                }
            });
        }
        static loadFiguresByChunk(chunkCount) {
            return FigureDataSaver_awaiter(this, void 0, void 0, function*() {
                let allFigures = [];
                for (let i = 1; i <= chunkCount; i++) {
                    const chunkKey = `${this.scanResultIdPrefix}-${i}`;
                    const compressedData = yield StorageWrapper.getItemAsync(chunkKey);
                    if (null !== compressedData && void 0 !== compressedData) {
                        const decompressed = PakoWrapper.decompress(compressedData);
                        let figures = JSON.parse(decompressed);
                        figures = figures.map(figure => FAFigure.getRevivedObject(figure));
                        allFigures = allFigures.concat(figures);
                    }
                }
                return allFigures;
            });
        }
        static loadFiguresWithoutChunkCount() {
            return FigureDataSaver_awaiter(this, void 0, void 0, function*() {
                let allFigures = [];
                let compressedData;
                let i = 1;
                do {
                    try {
                        const chunkKey = `${this.scanResultIdPrefix}-${i}`;
                        compressedData = yield StorageWrapper.getItemAsync(chunkKey);
                        if (null != compressedData) {
                            const decompressed = PakoWrapper.decompress(compressedData);
                            let figures = JSON.parse(decompressed);
                            figures = figures.map(figure => FAFigure.getRevivedObject(figure));
                            allFigures = allFigures.concat(figures);
                        }
                    } catch (error) {
                        Logger.logError(`Failed to load chunk ${i}: ${error}`);
                    }
                    i++;
                } while (null != compressedData && i <= 1e3);
                return allFigures;
            });
        }
        static clear() {
            return FigureDataSaver_awaiter(this, void 0, void 0, function*() {
                const countStr = yield StorageWrapper.getItemAsync(`${this.scanResultIdPrefix}-count`);
                if (null !== countStr && void 0 !== countStr && "" !== countStr) {
                    const count = parseInt(countStr, 10);
                    yield this.clearByChunk(count);
                } else {
                    yield this.clearWithoutChunkCount();
                }
            });
        }
        static clearByChunk(chunkCount) {
            return FigureDataSaver_awaiter(this, void 0, void 0, function*() {
                for (let i = 1; i <= chunkCount; i++) {
                    const chunkKey = `${this.scanResultIdPrefix}-${i}`;
                    yield StorageWrapper.removeItemAsync(chunkKey);
                }
                yield StorageWrapper.removeItemAsync(`${this.scanResultIdPrefix}-count`);
            });
        }
        static clearWithoutChunkCount() {
            return FigureDataSaver_awaiter(this, void 0, void 0, function*() {
                let i = 1;
                let chunkKey = `${this.scanResultIdPrefix}-${i}`;
                for (;null != (yield StorageWrapper.getItemAsync(chunkKey)) && i <= 1e3; ) {
                    yield StorageWrapper.removeItemAsync(chunkKey);
                    chunkKey = `${this.scanResultIdPrefix}-${i}`;
                    i++;
                }
                yield StorageWrapper.removeItemAsync(`${this.scanResultIdPrefix}-count`);
            });
        }
    }
    FigureDataSaver.scanResultIdPrefix = "wfv-scan-results";
    FigureDataSaver.chunkSize = 60;
    FigureDataSaver.maxChunkBytes = 7372.8;
    var WatchesFavoritesPage_awaiter = function(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function(resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator.throw(value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : function adopt(value) {
                    return value instanceof P ? value : new P(function(resolve) {
                        resolve(value);
                    });
                }(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    class WatchesFavoritesPage {
        constructor() {
            var _a;
            const standardPage = document.getElementById("standardpage");
            let galleryZero = standardPage.querySelector('section[id="gallery-0"]');
            if (null == galleryZero) {
                const messageCenterSubmissions = standardPage.querySelector('div[id="messagecenter-submissions"]');
                galleryZero = document.createElement("section");
                galleryZero.id = "gallery-0";
                galleryZero.classList.add("gallery", "messagecenter", "with-checkboxes", "s-250", "wfv-gallery");
                messageCenterSubmissions.appendChild(galleryZero);
            }
            this.gallerySection = galleryZero;
            const sectionHeader = null === (_a = standardPage.querySelector('div[class*="section-header"]')) || void 0 === _a ? void 0 : _a.parentElement;
            const headerElem = null === sectionHeader || void 0 === sectionHeader ? void 0 : sectionHeader.querySelector("h2");
            if (null != headerElem) {
                headerElem.textContent = "Watches Favorites";
            }
            const allGalleries = standardPage.querySelectorAll('section[id^="gallery-"]');
            for (const gallery of Array.from(allGalleries)) {
                const figures = gallery.querySelectorAll("figure");
                for (const figure of Array.from(figures)) {
                    figure.remove();
                }
            }
            !function hideUpToParent(child, parent, ...ignoreElements) {
                let current = child;
                for (;null != current && current !== parent; ) {
                    let parentElement = current.parentElement;
                    if (!parentElement) {
                        break;
                    }
                    Array.from(parentElement.children).forEach(childNode => {
                        if (childNode !== current && !ignoreElements.includes(childNode)) {
                            childNode.style.display = "none";
                        }
                    });
                    current = parentElement;
                }
            }(this.gallerySection, standardPage, sectionHeader);
            this.gallerySection.insertBeforeThis(document.createElement("br"));
            this.show();
        }
        show() {
            return WatchesFavoritesPage_awaiter(this, void 0, void 0, function*() {
                const loadingSpinner = new window.FALoadingSpinner(this.gallerySection);
                loadingSpinner.delay = loadingSpinSpeedSetting.value;
                loadingSpinner.spinnerThickness = 6;
                loadingSpinner.visible = true;
                const figures = yield FigureDataSaver.loadFigures();
                Logger.logInfo(`Loaded ${figures.length} figures`);
                const htmlFigures = figures.map(figure => figure.ToHTMLElement());
                this.gallerySection.append(...htmlFigures);
                window.dispatchEvent(new CustomEvent("ei-update-embedded"));
                !function checkTagsAll(doc) {
                    if (null == doc) {
                        return;
                    }
                    doc.querySelectorAll("img[data-tags]").forEach(element => checkTags(element));
                }(document);
                loadingSpinner.visible = false;
            });
        }
    }
    var LastSidList_awaiter = function(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function(resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator.throw(value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : function adopt(value) {
                    return value instanceof P ? value : new P(function(resolve) {
                        resolve(value);
                    });
                }(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    class LastSidList {
        static setSid(username, sid) {
            return LastSidList_awaiter(this, void 0, void 0, function*() {
                const sids = yield this.getSidList();
                sids[username] = sid;
                const json = JSON.stringify(sids);
                return yield StorageWrapper.setItemAsync(this.id, json);
            });
        }
        static getSid(username) {
            return LastSidList_awaiter(this, void 0, void 0, function*() {
                var _a;
                return null !== (_a = (yield this.getSidList())[username]) && void 0 !== _a ? _a : null;
            });
        }
        static clearSidList() {
            return LastSidList_awaiter(this, void 0, void 0, function*() {
                return yield StorageWrapper.removeItemAsync(this.id);
            });
        }
        static getSidList() {
            return LastSidList_awaiter(this, void 0, void 0, function*() {
                var _a;
                const json = null !== (_a = yield StorageWrapper.getItemAsync(this.id)) && void 0 !== _a ? _a : "{}";
                return JSON.parse(json);
            });
        }
    }
    LastSidList.id = "wfv-last-favs";
    var WatchFavScanner_awaiter = function(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function(resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator.throw(value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : function adopt(value) {
                    return value instanceof P ? value : new P(function(resolve) {
                        resolve(value);
                    });
                }(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    class WatchFavScanner {
        constructor(username, lastSid) {
            this.username = username;
            this.lastSid = lastSid;
        }
        scan() {
            return WatchFavScanner_awaiter(this, arguments, void 0, function*(updateLastSid = false) {
                let initSuccess = false;
                if (null == this.lastSid || -1 === this.lastSid) {
                    Logger.logWarning("No last sid given. Initializing...");
                    initSuccess = yield this.init();
                    if (!initSuccess) {
                        return [];
                    }
                }
                const userPage = yield requestHelper.UserRequests.getUserPage(this.username);
                const userpageNavHeader = null === userPage || void 0 === userPage ? void 0 : userPage.body.querySelector("userpage-nav-header");
                const userNameSpan = null === userpageNavHeader || void 0 === userpageNavHeader ? void 0 : userpageNavHeader.querySelector('span[class="js-displayName"]');
                const userDisplayName = null === userNameSpan || void 0 === userNameSpan ? void 0 : userNameSpan.textContent;
                let newFigures = (yield requestHelper.UserRequests.GalleryRequests.Favorites.getFiguresBetweenIds(this.username, -1, this.lastSid, maxAmountOfScannedPagesPerWatcher.value)).flat();
                for (const figure of newFigures) {
                    try {
                        const figCaption = figure.querySelector("figcaption");
                        null === figCaption || void 0 === figCaption || figCaption.setAttribute("wfv-from-user", this.username);
                        null === figCaption || void 0 === figCaption || figCaption.setAttribute("wfv-from-userDisplay", null !== userDisplayName && void 0 !== userDisplayName ? userDisplayName : "");
                    } catch (_a) {
                        Logger.logError(`Failed to process figure for: ${this.username}`);
                        continue;
                    }
                }
                if (!initSuccess) {
                    const lastSidIndex = newFigures.findIndex(figure => figure.id === `sid-${this.lastSid}`);
                    newFigures = newFigures.slice(0, lastSidIndex);
                }
                if (updateLastSid && 0 !== newFigures.length) {
                    this.lastSid = newFigures[0].id.trimStart("sid-");
                    if (!(yield LastSidList.setSid(this.username, this.lastSid))) {
                        Logger.logError(`Failed to save last sid for: ${this.username}`);
                        return [];
                    }
                }
                return newFigures.map(figure => new FAFigure(figure));
            });
        }
        init() {
            return WatchFavScanner_awaiter(this, void 0, void 0, function*() {
                var _a;
                const favPage = yield requestHelper.UserRequests.GalleryRequests.Favorites.getPage(this.username);
                const section = null === favPage || void 0 === favPage ? void 0 : favPage.getElementById("gallery-favorites");
                this.lastSid = null === (_a = null === section || void 0 === section ? void 0 : section.querySelector("figure")) || void 0 === _a ? void 0 : _a.id.trimStart("sid-");
                return null != this.lastSid;
            });
        }
    }
    class Semaphore {
        constructor(maxConcurrency) {
            this.maxConcurrency = maxConcurrency;
            this.currentConcurrency = 0;
            this.waitingQueue = [];
        }
        acquire() {
            return new Promise(resolve => {
                if (this.currentConcurrency < this.maxConcurrency) {
                    this.currentConcurrency++;
                    resolve();
                } else {
                    this.waitingQueue.push(resolve);
                }
            });
        }
        release() {
            if (this.waitingQueue.length > 0) {
                const nextResolve = this.waitingQueue.shift();
                if (null != nextResolve) {
                    nextResolve();
                }
            } else {
                this.currentConcurrency--;
            }
        }
    }
    var FavsScanner_awaiter = function(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function(resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator.throw(value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : function adopt(value) {
                    return value instanceof P ? value : new P(function(resolve) {
                        resolve(value);
                    });
                }(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    class FavsScanner {
        constructor() {
            this.lastFavIds = {};
            this.ignoredUsers = [];
            this.amountOperations = 0;
        }
        init() {
            return FavsScanner_awaiter(this, void 0, void 0, function*() {
                this.lastFavIds = yield LastSidList.getSidList();
                this.ignoredUsers = yield IgnoreList.getIgnoreList();
            });
        }
        scanAllUsers(callBack) {
            return FavsScanner_awaiter(this, void 0, void 0, function*() {
                yield StorageWrapper.removeItemAsync(FavsScanner.progressPercentId);
                let usernames = (yield requestHelper.PersonalUserRequests.ManageContent.getAllWatchesPages()).map(page => getWatchesFromPage(page)).flat().map(watch => {
                    var _a;
                    return null === (_a = watch.querySelector("img[alt]")) || void 0 === _a ? void 0 : _a.getAttribute("alt");
                });
                const semaphore = new Semaphore(requestHelper.maxAmountRequests);
                usernames = usernames.filter(username => !string.isNullOrWhitespace(username) && !this.ignoredUsers.includes(username));
                let figures = [];
                let percent = 0;
                let current = 0;
                const total = usernames.length;
                yield Promise.all(usernames.map(username => FavsScanner_awaiter(this, void 0, void 0, function*() {
                    yield semaphore.acquire();
                    try {
                        const userFigures = yield this.scanUser(username);
                        figures.push(...userFigures);
                        current++;
                        percent = current / total * 100;
                        yield StorageWrapper.setItemAsync(FavsScanner.progressPercentId, percent.toFixed(2));
                        null === callBack || void 0 === callBack || callBack(username, percent, userFigures);
                    } finally {
                        semaphore.release();
                    }
                })));
                figures = this.applyFigureSettings(figures);
                return figures;
            });
        }
        scanUser(username) {
            return FavsScanner_awaiter(this, void 0, void 0, function*() {
                var _a;
                if (this.amountOperations >= 80) {
                    Logger.logWarning(`Amount of operations reached 80. Stopping scan for ${username}.`);
                    return [];
                }
                const lastFavId = null === (_a = this.lastFavIds[username]) || void 0 === _a ? void 0 : _a.trimStart("sid-");
                const watchFavScanner = new WatchFavScanner(username, lastFavId);
                let figures = yield watchFavScanner.scan(true);
                if (figures.length > maxFavsAmountSetting.value) {
                    this.amountOperations++;
                    figures = figures.slice(0, maxFavsAmountSetting.value);
                }
                return figures;
            });
        }
        applyFigureSettings(figures) {
            if (!showDublicateFavsSetting.value) {
                Logger.logInfo("Removing duplicate favorites");
                const seenIds = new Set;
                figures = figures.filter(figure => {
                    if (!seenIds.has(figure.id)) {
                        seenIds.add(figure.id);
                        return true;
                    }
                    return false;
                });
            }
            if (!showFavFromWatcherSetting.value) {
                Logger.logInfo("Adding watch information to favorites");
                for (const figure of figures) {
                    try {
                        figure.figCaption.fromId = "";
                        figure.figCaption.fromUsername = "";
                    } catch (_a) {
                        Logger.logError(`Failed to get from watch for ${figure.id}`);
                    }
                }
            }
            return figures;
        }
    }
    FavsScanner.progressPercentId = "wfv-scan-progress-percent";
    var Migrate_awaiter = function(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function(resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator.throw(value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : function adopt(value) {
                    return value instanceof P ? value : new P(function(resolve) {
                        resolve(value);
                    });
                }(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    function migrate() {
        return Migrate_awaiter(this, void 0, void 0, function*() {
            yield function migrateIgnoreList() {
                return Migrate_awaiter(this, void 0, void 0, function*() {
                    var _a;
                    const oldIgnoreListJson = null !== (_a = yield StorageWrapper.getItemAsync("wfexcludedusers")) && void 0 !== _a ? _a : "[]";
                    const oldIgnoreList = JSON.parse(oldIgnoreListJson);
                    for (const username of oldIgnoreList) {
                        yield IgnoreList.add(username);
                    }
                    yield StorageWrapper.removeItemAsync("wfexcludedusers");
                });
            }();
            yield function migrateLastSidList() {
                return Migrate_awaiter(this, void 0, void 0, function*() {
                    var _a;
                    const oldLastSidListJson = null !== (_a = yield StorageWrapper.getItemAsync("wflastfavs")) && void 0 !== _a ? _a : "{}";
                    const oldLastSidList = JSON.parse(oldLastSidListJson);
                    for (const [username, sid] of Object.entries(oldLastSidList)) {
                        yield LastSidList.setSid(username, sid.trimStart("sid-"));
                    }
                    yield StorageWrapper.removeItemAsync("wflastfavs");
                });
            }();
            yield StorageWrapper.removeItemAsync("wfloadingstate");
            yield StorageWrapper.removeItemAsync("wfloading");
            yield StorageWrapper.removeItemAsync("wfcurrentfavs");
        });
    }
    function checkMigrationNeeded() {
        return Migrate_awaiter(this, void 0, void 0, function*() {
            return (yield function checkIgnoreListMigrationNeeded() {
                return Migrate_awaiter(this, void 0, void 0, function*() {
                    const oldIgnoreListJson = yield StorageWrapper.getItemAsync("wfexcludedusers");
                    return !string.isNullOrWhitespace(oldIgnoreListJson);
                });
            }()) || (yield function checkSidListMigrationNeeded() {
                return Migrate_awaiter(this, void 0, void 0, function*() {
                    const oldLastSidListJson = yield StorageWrapper.getItemAsync("wflastfavs");
                    return !string.isNullOrWhitespace(oldLastSidListJson);
                });
            }());
        });
    }
    var WatchScanButton_awaiter = function(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function(resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator.throw(value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : function adopt(value) {
                    return value instanceof P ? value : new P(function(resolve) {
                        resolve(value);
                    });
                }(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    class WatchScanButton {
        constructor() {
            const messageBar = document.getElementById("ddmenu").querySelector('ul[class*="navhideonmobile"]').querySelector('li[class*="message-bar-desktop"]');
            this.wfButton = document.createElement("a");
            this.wfButton.id = "wfButton";
            this.wfButton.className = "notification-container inline";
            this.wfButton.title = "Start a WF scan";
            this.wfButton.style.cursor = "pointer";
            this.wfButton.textContent = "WF Scan";
            this.wfButton.onclick = () => {
                this.startScan();
            };
            messageBar.appendChild(this.wfButton);
        }
        startScan() {
            return WatchScanButton_awaiter(this, void 0, void 0, function*() {
                if (yield checkMigrationNeeded()) {
                    const result = yield window.FAMessageBox.show("Watches Favorite Viewer updated.Do you want to migrate your old data?", "Confirm Migration", window.FAMessageBoxButtons.YesNoCancel, window.FAMessageBoxIcon.Question);
                    if (result === window.FADialogResult.Yes) {
                        yield migrate();
                    } else if (result === window.FADialogResult.Cancel) {
                        return;
                    }
                }
                this.wfButton.textContent = "WF: 0.00%";
                const scanner = new FavsScanner;
                yield scanner.init();
                const figures = yield scanner.scanAllUsers((username, percent, userFigures) => {
                    Logger.logInfo(`${percent}% | ${username} | ${userFigures.length}`);
                    this.wfButton.textContent = `WF: ${percent.toFixed(2)}%`;
                });
                if (0 !== figures.length) {
                    yield FigureDataSaver.saveFigures(figures);
                    this.wfButton.textContent = `${figures.length}WF`;
                    this.wfButton.onclick = null;
                    this.wfButton.href = "https://www.furaffinity.net/msg/submissions/?mode=wfv-favorites";
                } else {
                    this.wfButton.textContent = "WF Scan again";
                }
            });
        }
    }
    WatchScanButton.scanResultId = "wfv-scan-results";
    var MessageBoxButtons;
    !function(MessageBoxButtons) {
        MessageBoxButtons[MessageBoxButtons.OK = 0] = "OK";
        MessageBoxButtons[MessageBoxButtons.OKCancel = 1] = "OKCancel";
        MessageBoxButtons[MessageBoxButtons.AbortRetryIgnore = 2] = "AbortRetryIgnore";
        MessageBoxButtons[MessageBoxButtons.YesNoCancel = 3] = "YesNoCancel";
        MessageBoxButtons[MessageBoxButtons.YesNo = 4] = "YesNo";
        MessageBoxButtons[MessageBoxButtons.RetryCancel = 5] = "RetryCancel";
    }(MessageBoxButtons || (MessageBoxButtons = {}));
    var MessageBoxIcon;
    !function(MessageBoxIcon) {
        MessageBoxIcon[MessageBoxIcon.None = 0] = "None";
        MessageBoxIcon[MessageBoxIcon.Error = 16] = "Error";
        MessageBoxIcon[MessageBoxIcon.Warning = 48] = "Warning";
        MessageBoxIcon[MessageBoxIcon.Information = 64] = "Information";
        MessageBoxIcon[MessageBoxIcon.Question = 32] = "Question";
    }(MessageBoxIcon || (MessageBoxIcon = {}));
    var DialogResult;
    !function(DialogResult) {
        DialogResult[DialogResult.None = 0] = "None";
        DialogResult[DialogResult.OK = 1] = "OK";
        DialogResult[DialogResult.Cancel = 2] = "Cancel";
        DialogResult[DialogResult.Abort = 3] = "Abort";
        DialogResult[DialogResult.Retry = 4] = "Retry";
        DialogResult[DialogResult.Ignore = 5] = "Ignore";
        DialogResult[DialogResult.Yes = 6] = "Yes";
        DialogResult[DialogResult.No = 7] = "No";
    }(DialogResult || (DialogResult = {}));
    class MessageBoxIcons {
        static getIconSvg(icon) {
            switch (icon) {
              case MessageBoxIcon.Error:
                return '<svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#ff0000"><path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>';

              case MessageBoxIcon.Warning:
                return '<svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#ffcc4d"><path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z"/></svg>';

              case MessageBoxIcon.Information:
                return '<svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#2196f3"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>';

              case MessageBoxIcon.Question:
                return '<svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#2196f3"><path d="M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-154h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>';

              case MessageBoxIcon.None:
              default:
                return "";
            }
        }
    }
    var MessageBoxThemes;
    !function(MessageBoxThemes) {
        MessageBoxThemes.Dark = "dark";
        MessageBoxThemes.Aurora = "aurora";
        MessageBoxThemes.Retro = "retro";
        MessageBoxThemes.Slate = "slate";
        MessageBoxThemes.Light = "light";
    }(MessageBoxThemes || (MessageBoxThemes = {}));
    var src_styles_Style = __webpack_require__(978);
    var Style_options = {};
    Style_options.styleTagTransform = styleTagTransform_default();
    Style_options.setAttributes = setAttributesWithoutAttributes_default();
    Style_options.insert = insertBySelector_default().bind(null, "head");
    Style_options.domAPI = styleDomAPI_default();
    Style_options.insertStyleElement = insertStyleElement_default();
    injectStylesIntoStyleTag_default()(src_styles_Style.A, Style_options);
    src_styles_Style.A && src_styles_Style.A.locals && src_styles_Style.A.locals;
    var MessageBox_awaiter = function(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function(resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator.throw(value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : function adopt(value) {
                    return value instanceof P ? value : new P(function(resolve) {
                        resolve(value);
                    });
                }(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    class MessageBox {
        static getTheme() {
            return this.currentTheme;
        }
        static show(text_1) {
            return MessageBox_awaiter(this, arguments, void 0, function*(text, caption = "", buttons = MessageBoxButtons.OK, icon = MessageBoxIcon.None) {
                return new Promise(resolve => {
                    this.resolvePromise = resolve;
                    this.createMessageBox(text, caption, buttons, icon);
                });
            });
        }
        static createMessageBox(text, caption, buttons, icon) {
            this.overlay = document.createElement("div");
            this.overlay.className = "message-box-overlay";
            this.container = document.createElement("div");
            this.container.className = "message-box-container";
            const header = document.createElement("div");
            header.className = "message-box-header";
            if (icon !== MessageBoxIcon.None) {
                const iconContainer = document.createElement("div");
                iconContainer.className = "message-box-icon-container";
                iconContainer.innerHTML = MessageBoxIcons.getIconSvg(icon);
                header.appendChild(iconContainer);
            }
            if (!string.isNullOrWhitespace(caption)) {
                const title = document.createElement("h3");
                title.className = "message-box-title";
                title.textContent = caption;
                header.appendChild(title);
            }
            if (0 !== header.children.length) {
                this.container.appendChild(header);
            }
            const content = document.createElement("div");
            content.className = "message-box-content";
            content.textContent = text;
            this.container.appendChild(content);
            const buttonContainer = document.createElement("div");
            buttonContainer.className = "message-box-button-container";
            this.addButtons(buttonContainer, buttons);
            this.container.appendChild(buttonContainer);
            this.overlay.appendChild(this.container);
            document.body.appendChild(this.overlay);
        }
        static addButtons(buttonContainer, buttons) {
            switch (buttons) {
              case MessageBoxButtons.OK:
                this.createButton(buttonContainer, "OK", DialogResult.OK);
                break;

              case MessageBoxButtons.OKCancel:
                this.createButton(buttonContainer, "OK", DialogResult.OK);
                this.createButton(buttonContainer, "Cancel", DialogResult.Cancel);
                break;

              case MessageBoxButtons.AbortRetryIgnore:
                this.createButton(buttonContainer, "Abort", DialogResult.Abort);
                this.createButton(buttonContainer, "Retry", DialogResult.Retry);
                this.createButton(buttonContainer, "Ignore", DialogResult.Ignore);
                break;

              case MessageBoxButtons.YesNoCancel:
                this.createButton(buttonContainer, "Yes", DialogResult.Yes);
                this.createButton(buttonContainer, "No", DialogResult.No);
                this.createButton(buttonContainer, "Cancel", DialogResult.Cancel);
                break;

              case MessageBoxButtons.YesNo:
                this.createButton(buttonContainer, "Yes", DialogResult.Yes);
                this.createButton(buttonContainer, "No", DialogResult.No);
                break;

              case MessageBoxButtons.RetryCancel:
                this.createButton(buttonContainer, "Retry", DialogResult.Retry);
                this.createButton(buttonContainer, "Cancel", DialogResult.Cancel);
            }
        }
        static createButton(container, text, result) {
            const button = document.createElement("button");
            button.className = "message-box-button";
            button.textContent = text;
            button.addEventListener("click", () => {
                this.close(result);
            });
            container.appendChild(button);
        }
        static close(result) {
            this.result = result;
            if (null != this.overlay) {
                document.body.removeChild(this.overlay);
                this.overlay = null;
                this.container = null;
            }
            if (null != this.resolvePromise) {
                this.resolvePromise(result);
                this.resolvePromise = null;
            }
        }
    }
    MessageBox.overlay = null;
    MessageBox.container = null;
    MessageBox.result = DialogResult.None;
    MessageBox.resolvePromise = null;
    MessageBox.currentTheme = MessageBoxThemes.Light;
    class WatchesFavoritesMenuButton {
        constructor() {
            var _a;
            const ddmenu = document.getElementById("ddmenu");
            const navBar = null === ddmenu || void 0 === ddmenu ? void 0 : ddmenu.querySelector('ul[class*="navhideonmobile"]');
            const settings = null === (_a = null === navBar || void 0 === navBar ? void 0 : navBar.querySelector('a[href="/controls/settings/"]')) || void 0 === _a ? void 0 : _a.parentNode;
            const badges = null === settings || void 0 === settings ? void 0 : settings.querySelector('a[href="/controls/badges/"]');
            if (null != badges) {
                const wfButton = document.createElement("a");
                wfButton.id = "wfv-menu-button";
                wfButton.textContent = "Watches Favorites";
                wfButton.href = "https://www.furaffinity.net/msg/submissions?mode=wfv-favorites";
                badges.insertAfterThis(wfButton);
            }
        }
    }
    var src_awaiter = function(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function(resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator.throw(value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : function adopt(value) {
                    return value instanceof P ? value : new P(function(resolve) {
                        resolve(value);
                    });
                }(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    const customSettings = new window.FACustomSettings("Furaffinity Features Settings", "FA Watches Favorites Viewer Settings");
    const maxFavsAmountSetting = customSettings.newSetting(window.FASettingType.Number, "Max Favs Amount");
    maxFavsAmountSetting.description = "Sets the maximum number of Favs scanned per Watch.";
    maxFavsAmountSetting.defaultValue = 100;
    const showDublicateFavsSetting = customSettings.newSetting(window.FASettingType.Boolean, "Show Dublicate Favs");
    showDublicateFavsSetting.description = "Sets wether to show dublicate Submissions. (when multiple people Faved the same Submission)";
    showDublicateFavsSetting.defaultValue = false;
    const showFavFromWatcherSetting = customSettings.newSetting(window.FASettingType.Boolean, "Show Fav From Watcher");
    showFavFromWatcherSetting.description = "Sets wether to show from which watch the Fav comes.";
    showFavFromWatcherSetting.defaultValue = true;
    const loadingSpinSpeedSetting = customSettings.newSetting(window.FASettingType.Number, "Loading Animation Speed");
    loadingSpinSpeedSetting.description = "The duration that the loading animation of the Embedded element to load takes for a full rotation in milliseconds.";
    loadingSpinSpeedSetting.defaultValue = 1e3;
    const maxAmountOfScannedPagesPerWatcher = customSettings.newSetting(window.FASettingType.Number, "Max Amount of Scanned Pages per Watcher");
    maxAmountOfScannedPagesPerWatcher.description = "Sets the maximum number of pages scanned per Watcher.";
    maxAmountOfScannedPagesPerWatcher.defaultValue = 4;
    const showDetailedMadeByTextSetting = customSettings.newSetting(window.FASettingType.Boolean, 'Show Detailed "Made By" Text');
    showDetailedMadeByTextSetting.description = 'Sets wether to show "Made By" and "Faved by" instead of "By" and "From" text.';
    showDetailedMadeByTextSetting.defaultValue = true;
    const resetLastSeenFavsSetting = customSettings.newSetting(window.FASettingType.Action, "Reset Last Seen Favs");
    resetLastSeenFavsSetting.description = "Resets the last seen favs variable to reinitialize the Fav-Scanner.";
    resetLastSeenFavsSetting.addEventListener("input", () => {
        MessageBox.show("Are you sure you want to reset the last seen favs?", "Confirm Reset", MessageBoxButtons.YesNo, MessageBoxIcon.Question).then(result => src_awaiter(void 0, void 0, void 0, function*() {
            if (result === DialogResult.Yes) {
                yield LastSidList.clearSidList();
            }
        }));
    });
    const showIgnoreListSetting = customSettings.newSetting(window.FASettingType.Action, "Show Ignore List");
    showIgnoreListSetting.description = "Opens the Ignore List in a new Tab.";
    showIgnoreListSetting.addEventListener("input", () => {
        window.open("https://www.furaffinity.net/controls/buddylist?mode=wfv-buddylist", "_blank");
    });
    const showLastWatchesFavoritesSetting = customSettings.newSetting(window.FASettingType.Action, "Show Last Favs");
    showLastWatchesFavoritesSetting.description = "Opens the last Watches Favorites in a new Tab.";
    showLastWatchesFavoritesSetting.addEventListener("input", () => {
        window.open("https://www.furaffinity.net/msg/submissions?mode=wfv-favorites", "_blank");
    });
    customSettings.loadSettings();
    const requestHelper = new window.FARequestHelper(2);
    if (customSettings.isFeatureEnabled) {
        const matchList = new window.FAMatchList(customSettings);
        matchList.matches = [ "furaffinity.net" ];
        matchList.runInIFrame = false;
        if (matchList.hasMatch) {
            const pageBuddyListEdit = new window.FACustomPage("controls/buddylist", "mode");
            pageBuddyListEdit.addEventListener("onOpen", event => {
                if ("wfv-buddylist" === event.detail.parameterValue) {
                    new BuddyListManager;
                }
            });
            pageBuddyListEdit.checkPageOpened();
            const watchesFavoritesPage = new window.FACustomPage("net/msg/submissions", "mode");
            watchesFavoritesPage.addEventListener("onOpen", event => {
                if ("wfv-favorites" === event.detail.parameterValue) {
                    new WatchesFavoritesPage;
                }
            });
            watchesFavoritesPage.checkPageOpened();
            new WatchScanButton;
            new WatchesFavoritesMenuButton;
        }
    }
})();