// ==UserScript==
// @name        Furaffinity-Custom-Settings
// @namespace   Violentmonkey Scripts
// @grant       none
// @version     4.3.0
// @author      Midori Dragon
// @description Library to create Custom settings on Furaffinitiy
// @icon        https://www.furaffinity.net/themes/beta/img/banners/fa_logo.png
// @license     MIT
// @homepageURL https://greasyfork.org/scripts/475041-furaffinity-custom-settings
// @supportURL  https://greasyfork.org/scripts/475041-furaffinity-custom-settings/feedback
// ==/UserScript==
// jshint esversion: 8
(() => {
    "use strict";
    var __webpack_modules__ = {
        622: (module, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.d(__webpack_exports__, {
                A: () => __WEBPACK_DEFAULT_EXPORT__
            });
            var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601), _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__), _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314), ___CSS_LOADER_EXPORT___ = __webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
            ___CSS_LOADER_EXPORT___.push([ module.id, '.switch-cs {\n    position: relative;\n    display: inline-block;\n    width: 52px;\n    height: 28px;\n    margin: 6px 8px 6px 0;\n}\n\n.switch-cs input {\n    opacity: 0;\n    width: 0;\n    height: 0;\n}\n\n.slider-cs {\n    position: absolute;\n    cursor: pointer;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    background-color: #ccc;\n    transition: .4s;\n    border-radius: 34px;\n}\n\n.slider-cs:before {\n    position: absolute;\n    content: "";\n    height: 20px;\n    width: 20px;\n    left: 4px;\n    bottom: 4px;\n    background-color: white;\n    transition: .4s;\n    border-radius: 50%;\n}\n\ninput:checked+.slider-cs {\n    background-color: #4CAF50;\n}\n\ninput:checked+.slider-cs:before {\n    transform: translateX(26px);\n}\n\n.section-header.cs {\n    display: flex;\n    align-items: center;\n}\n\n.section-body.cs {\n    opacity: 1;\n    transition: opacity 0.3s linear;\n}\n\n.section-body.cs.collapsed {\n    opacity: 0.4;\n    pointer-events: none;\n}\n', "" ]);
            const __WEBPACK_DEFAULT_EXPORT__ = ___CSS_LOADER_EXPORT___;
        },
        314: module => {
            module.exports = function(cssWithMappingToString) {
                var list = [];
                list.toString = function toString() {
                    return this.map((function(item) {
                        var content = "", needLayer = void 0 !== item[5];
                        if (item[4]) content += "@supports (".concat(item[4], ") {");
                        if (item[2]) content += "@media ".concat(item[2], " {");
                        if (needLayer) content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
                        content += cssWithMappingToString(item);
                        if (needLayer) content += "}";
                        if (item[2]) content += "}";
                        if (item[4]) content += "}";
                        return content;
                    })).join("");
                };
                list.i = function i(modules, media, dedupe, supports, layer) {
                    if ("string" == typeof modules) modules = [ [ null, modules, void 0 ] ];
                    var alreadyImportedModules = {};
                    if (dedupe) for (var k = 0; k < this.length; k++) {
                        var id = this[k][0];
                        if (null != id) alreadyImportedModules[id] = true;
                    }
                    for (var _k = 0; _k < modules.length; _k++) {
                        var item = [].concat(modules[_k]);
                        if (!dedupe || !alreadyImportedModules[item[0]]) {
                            if (void 0 !== layer) if (void 0 === item[5]) item[5] = layer; else {
                                item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
                                item[5] = layer;
                            }
                            if (media) if (!item[2]) item[2] = media; else {
                                item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
                                item[2] = media;
                            }
                            if (supports) if (!item[4]) item[4] = "".concat(supports); else {
                                item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
                                item[4] = supports;
                            }
                            list.push(item);
                        }
                    }
                };
                return list;
            };
        },
        601: module => {
            module.exports = function(i) {
                return i[1];
            };
        },
        72: module => {
            var stylesInDOM = [];
            function getIndexByIdentifier(identifier) {
                for (var result = -1, i = 0; i < stylesInDOM.length; i++) if (stylesInDOM[i].identifier === identifier) {
                    result = i;
                    break;
                }
                return result;
            }
            function modulesToDom(list, options) {
                for (var idCountMap = {}, identifiers = [], i = 0; i < list.length; i++) {
                    var item = list[i], id = options.base ? item[0] + options.base : item[0], count = idCountMap[id] || 0, identifier = "".concat(id, " ").concat(count);
                    idCountMap[id] = count + 1;
                    var indexByIdentifier = getIndexByIdentifier(identifier), obj = {
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
                        if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) return;
                        api.update(obj = newObj);
                    } else api.remove();
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
                    for (var newLastIdentifiers = modulesToDom(newList, options), _i = 0; _i < lastIdentifiers.length; _i++) {
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
        659: module => {
            var memo = {};
            module.exports = function insertBySelector(insert, style) {
                var target = function getTarget(target) {
                    if (void 0 === memo[target]) {
                        var styleTarget = document.querySelector(target);
                        if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) try {
                            styleTarget = styleTarget.contentDocument.head;
                        } catch (e) {
                            styleTarget = null;
                        }
                        memo[target] = styleTarget;
                    }
                    return memo[target];
                }(insert);
                if (!target) throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
                target.appendChild(style);
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
        56: (module, __unused_webpack_exports, __webpack_require__) => {
            module.exports = function setAttributesWithoutAttributes(styleElement) {
                var nonce = true ? __webpack_require__.nc : 0;
                if (nonce) styleElement.setAttribute("nonce", nonce);
            };
        },
        825: module => {
            module.exports = function domAPI(options) {
                if ("undefined" == typeof document) return {
                    update: function update() {},
                    remove: function remove() {}
                };
                var styleElement = options.insertStyleElement(options);
                return {
                    update: function update(obj) {
                        !function apply(styleElement, options, obj) {
                            var css = "";
                            if (obj.supports) css += "@supports (".concat(obj.supports, ") {");
                            if (obj.media) css += "@media ".concat(obj.media, " {");
                            var needLayer = void 0 !== obj.layer;
                            if (needLayer) css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
                            css += obj.css;
                            if (needLayer) css += "}";
                            if (obj.media) css += "}";
                            if (obj.supports) css += "}";
                            var sourceMap = obj.sourceMap;
                            if (sourceMap && "undefined" != typeof btoa) css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
                            options.styleTagTransform(css, styleElement, options.options);
                        }(styleElement, options, obj);
                    },
                    remove: function remove() {
                        !function removeStyleElement(styleElement) {
                            if (null === styleElement.parentNode) return false;
                            styleElement.parentNode.removeChild(styleElement);
                        }(styleElement);
                    }
                };
            };
        },
        113: module => {
            module.exports = function styleTagTransform(css, styleElement) {
                if (styleElement.styleSheet) styleElement.styleSheet.cssText = css; else {
                    for (;styleElement.firstChild; ) styleElement.removeChild(styleElement.firstChild);
                    styleElement.appendChild(document.createTextNode(css));
                }
            };
        }
    }, __webpack_module_cache__ = {};
    function __webpack_require__(moduleId) {
        var cachedModule = __webpack_module_cache__[moduleId];
        if (void 0 !== cachedModule) return cachedModule.exports;
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
        for (var key in definition) if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key]
        });
    };
    __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
    __webpack_require__.nc = void 0;
    var LogLevel, SettingType;
    __webpack_require__.d({}, {
        xE: () => showResetButtonSetting
    });
    !function(LogLevel) {
        LogLevel[LogLevel.Error = 1] = "Error";
        LogLevel[LogLevel.Warning = 2] = "Warning";
        LogLevel[LogLevel.Info = 3] = "Info";
    }(LogLevel || (LogLevel = {}));
    class Logger {
        static log(logLevel = LogLevel.Warning, ...args) {
            if (null == window.__FF_GLOBAL_LOG_LEVEL__) window.__FF_GLOBAL_LOG_LEVEL__ = LogLevel.Error;
            if (!(logLevel > window.__FF_GLOBAL_LOG_LEVEL__)) switch (logLevel) {
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
    !function(SettingType) {
        SettingType[SettingType.Number = 0] = "Number";
        SettingType[SettingType.Boolean = 1] = "Boolean";
        SettingType[SettingType.Action = 2] = "Action";
        SettingType[SettingType.Text = 3] = "Text";
        SettingType[SettingType.Option = 4] = "Option";
    }(SettingType || (SettingType = {}));
    function makeIdCompatible(id) {
        const sanitizedString = id.replace(/[^a-zA-Z0-9-_\.]/g, "-").replace(/^-+|-+$/g, "").replace(/^-*(?=\d)/, "id-");
        return /^[0-9]/.test(sanitizedString) ? "id-" + sanitizedString : sanitizedString;
    }
    class SettingAction extends EventTarget {
        constructor(providerId, name) {
            super();
            this.description = "";
            Object.setPrototypeOf(this, SettingAction.prototype);
            this.name = name;
            this.id = providerId + "-" + makeIdCompatible(this.name);
            this.type = SettingType.Action;
            this.defaultValue = "";
            this.loadFromSyncedStorage();
            this.settingElem = this._settingInputElem = this.create();
        }
        get value() {
            var _a;
            return null !== (_a = this._settingInputElem.textContent) && void 0 !== _a ? _a : "";
        }
        set value(newValue) {
            this._settingInputElem.textContent = newValue;
        }
        get onInput() {
            return this._onInput;
        }
        set onInput(handler) {
            this._onInput = handler;
        }
        create() {
            const settingElem = document.createElement("button");
            settingElem.id = this.id;
            settingElem.type = "button";
            settingElem.className = "button standard mobile-fix";
            settingElem.textContent = this.name;
            settingElem.addEventListener("click", this.invokeInput.bind(this));
            return settingElem;
        }
        loadFromSyncedStorage() {}
        toString() {
            return `${this.name} = ${this.value}`;
        }
        invokeInput() {
            var _a;
            null === (_a = this._onInput) || void 0 === _a || _a.call(this, this._settingInputElem);
            this.dispatchEvent(new Event("input"));
        }
    }
    class GMInfo {
        static isBrowserEnvironment() {
            return "undefined" != typeof browser && void 0 !== browser.runtime || "undefined" != typeof chrome && void 0 !== chrome.runtime;
        }
        static getBrowserAPI() {
            if ("undefined" != typeof GM_info && null != GM_info) return GM_info; else if ("undefined" != typeof browser && void 0 !== browser.runtime) return browser; else if ("undefined" != typeof chrome && void 0 !== chrome.runtime) return chrome; else throw new Error("Unsupported browser for SyncedStorage.");
        }
        static get scriptName() {
            if (GMInfo.isBrowserEnvironment()) return GMInfo.getBrowserAPI().runtime.getManifest().name; else return GMInfo.getBrowserAPI().script.name;
        }
        static get scriptVersion() {
            if (GMInfo.isBrowserEnvironment()) return GMInfo.getBrowserAPI().runtime.getManifest().version; else return GMInfo.getBrowserAPI().script.version;
        }
        static get scriptDescription() {
            if (GMInfo.isBrowserEnvironment()) return GMInfo.getBrowserAPI().runtime.getManifest().description; else return GMInfo.getBrowserAPI().script.description;
        }
        static get scriptAuthor() {
            if (GMInfo.isBrowserEnvironment()) return GMInfo.getBrowserAPI().runtime.getManifest().author; else return GMInfo.getBrowserAPI().script.author;
        }
        static get scriptNamespace() {
            if (!GMInfo.isBrowserEnvironment()) return GMInfo.getBrowserAPI().script.namespace;
        }
        static get scriptSource() {
            if (!GMInfo.isBrowserEnvironment()) return GMInfo.getBrowserAPI().script.source;
        }
        static get scriptIcon() {
            if (GMInfo.isBrowserEnvironment()) {
                const manifest = GMInfo.getBrowserAPI().runtime.getManifest();
                let largestIcon = 0;
                for (const key of Object.keys(manifest.icons)) {
                    const size = parseInt(key);
                    if (size > largestIcon) largestIcon = size;
                }
                return manifest.icons[largestIcon.toString()];
            } else return GMInfo.getBrowserAPI().script.icon;
        }
        static get scriptIcon64() {
            if (GMInfo.isBrowserEnvironment()) {
                const manifest = GMInfo.getBrowserAPI().runtime.getManifest();
                return null == manifest.icons ? void 0 : manifest.icons[64];
            } else return GMInfo.getBrowserAPI().script.icon64;
        }
        static get scriptAntifeature() {
            if (!GMInfo.isBrowserEnvironment()) return GMInfo.getBrowserAPI().script.antifeature;
        }
        static get scriptOptions() {
            if (!GMInfo.isBrowserEnvironment()) return GMInfo.getBrowserAPI().script.options;
        }
        static get scriptMetaStr() {
            if (GMInfo.isBrowserEnvironment()) return JSON.stringify(GMInfo.getBrowserAPI().runtime.getManifest()); else return GMInfo.getBrowserAPI().scriptMetaStr;
        }
        static get scriptHandler() {
            if (GMInfo.isBrowserEnvironment()) return "undefined" != typeof browser ? "Firefox" : "Chrome"; else return GMInfo.getBrowserAPI().scriptHandler;
        }
        static get scriptUpdateURL() {
            if (GMInfo.isBrowserEnvironment()) return GMInfo.getBrowserAPI().runtime.getManifest().update_url; else return GMInfo.getBrowserAPI().scriptUpdateURL;
        }
        static get scriptWillUpdate() {
            if (!GMInfo.isBrowserEnvironment()) return GMInfo.getBrowserAPI().scriptWillUpdate;
        }
        static get scriptResources() {
            if (!GMInfo.isBrowserEnvironment()) return GMInfo.getBrowserAPI().scriptResources;
        }
        static get downloadMode() {
            if (!GMInfo.isBrowserEnvironment()) return GMInfo.getBrowserAPI().downloadMode;
        }
    }
    var __awaiter = function(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))((function(resolve, reject) {
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
                    return value instanceof P ? value : new P((function(resolve) {
                        resolve(value);
                    }));
                }(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        }));
    };
    class SyncedStorage {
        static setItem(key, value) {
            return __awaiter(this, void 0, void 0, (function*() {
                if (!GMInfo.isBrowserEnvironment()) {
                    Logger.logWarning("SyncedStorage is only available in browser extensions.");
                    return;
                }
                Logger.logInfo(`Setting item in synced storage: ${key}=${value}`);
                const api = GMInfo.getBrowserAPI();
                if (null != api.storage) return new Promise(((resolve, reject) => {
                    api.storage.sync.set({
                        [key]: value
                    }, (() => {
                        if (null != api.runtime.lastError) return reject(api.runtime.lastError);
                        resolve();
                    }));
                })); else Logger.logError("Unsupported storage API.");
            }));
        }
        static getItem(key) {
            return __awaiter(this, void 0, void 0, (function*() {
                if (!GMInfo.isBrowserEnvironment()) {
                    Logger.logWarning("SyncedStorage is only available in browser extensions.");
                    return;
                }
                Logger.logInfo(`Getting item from synced storage: ${key}`);
                const api = GMInfo.getBrowserAPI();
                if (null != api.storage) return new Promise(((resolve, reject) => {
                    api.storage.sync.get(key, (result => {
                        if (null != api.runtime.lastError) return reject(api.runtime.lastError);
                        resolve(result[key]);
                    }));
                })); else Logger.logError("Unsupported storage API.");
            }));
        }
        static getAllItems() {
            return __awaiter(this, void 0, void 0, (function*() {
                if (!GMInfo.isBrowserEnvironment()) {
                    Logger.logWarning("SyncedStorage is only available in browser extensions.");
                    return {};
                }
                Logger.logInfo("Getting all items from synced storage");
                const api = GMInfo.getBrowserAPI();
                if (null != api.storage) return new Promise(((resolve, reject) => {
                    api.storage.sync.get(null, (result => {
                        if (null != api.runtime.lastError) return reject(api.runtime.lastError);
                        resolve(result);
                    }));
                })); else {
                    Logger.logError("Unsupported storage API.");
                    return {};
                }
            }));
        }
        static removeItem(key) {
            return __awaiter(this, void 0, void 0, (function*() {
                if (!GMInfo.isBrowserEnvironment()) {
                    Logger.logWarning("SyncedStorage is only available in browser extensions.");
                    return;
                }
                Logger.logInfo(`Removing item from synced storage: ${key}`);
                const api = GMInfo.getBrowserAPI();
                if (null != api.storage) return new Promise(((resolve, reject) => {
                    api.storage.sync.remove(key, (() => {
                        if (null != api.runtime.lastError) return reject(api.runtime.lastError);
                        resolve();
                    }));
                })); else Logger.logError("Unsupported storage API.");
            }));
        }
    }
    class SettingBoolean extends EventTarget {
        constructor(providerId, name) {
            super();
            this.description = "";
            Object.setPrototypeOf(this, SettingBoolean.prototype);
            this.name = name;
            this.id = providerId + "-" + makeIdCompatible(this.name);
            this.type = SettingType.Boolean;
            this._defaultValue = false;
            this.loadFromSyncedStorage();
            this.settingElem = this.create();
            this._settingInputElem = this.settingElem.querySelector("input");
        }
        get value() {
            const localValue = localStorage.getItem(this.id);
            if (null == localValue) return this.defaultValue; else return "true" === localValue || "1" === localValue;
        }
        set value(newValue) {
            if (newValue === this.defaultValue) {
                localStorage.removeItem(this.id);
                SyncedStorage.removeItem(this.id);
            } else {
                localStorage.setItem(this.id, newValue.toString());
                SyncedStorage.setItem(this.id, newValue);
            }
            this._settingInputElem.checked = newValue;
            this.invokeInput(this._settingInputElem);
        }
        get defaultValue() {
            return this._defaultValue;
        }
        set defaultValue(value) {
            this._defaultValue = value;
            this.value = this.value;
        }
        get onInput() {
            return this._onInput;
        }
        set onInput(handler) {
            this._onInput = handler;
        }
        create() {
            const container = document.createElement("div"), settingElem = document.createElement("input");
            settingElem.id = this.id;
            settingElem.type = "checkbox";
            settingElem.style.cursor = "pointer";
            settingElem.style.marginRight = "4px";
            settingElem.addEventListener("change", (() => this.value = settingElem.checked));
            container.appendChild(settingElem);
            const settingElemLabel = document.createElement("label");
            settingElemLabel.textContent = this.name;
            settingElemLabel.style.cursor = "pointer";
            settingElemLabel.style.userSelect = "none";
            settingElemLabel.htmlFor = this.id;
            container.appendChild(settingElemLabel);
            return container;
        }
        loadFromSyncedStorage() {
            SyncedStorage.getItem(this.id).then((value => {
                if (null != value) localStorage.setItem(this.id, value.toString());
            }));
        }
        toString() {
            return `${this.name} = ${this.value}`;
        }
        invokeInput(elem) {
            var _a;
            null === (_a = this.onInput) || void 0 === _a || _a.call(this, elem);
            this.dispatchEvent(new CustomEvent("input", {
                detail: elem
            }));
        }
    }
    class SettingNumber extends EventTarget {
        constructor(providerId, name) {
            super();
            this.description = "";
            Object.setPrototypeOf(this, SettingNumber.prototype);
            this.name = name;
            this.id = providerId + "-" + makeIdCompatible(this.name);
            this.type = SettingType.Number;
            this._defaultValue = 0;
            this.min = 0;
            this.max = 32767;
            this.step = 1;
            this.loadFromSyncedStorage();
            this.settingElem = this._settingInputElem = this.create();
        }
        get value() {
            var _a;
            return parseInt(null !== (_a = localStorage.getItem(this.id)) && void 0 !== _a ? _a : this.defaultValue.toString()) || this.defaultValue;
        }
        set value(newValue) {
            if ((newValue = Math.min(Math.max(newValue, this.min), this.max)) === this.defaultValue) {
                localStorage.removeItem(this.id);
                SyncedStorage.removeItem(this.id);
            } else {
                localStorage.setItem(this.id, newValue.toString());
                SyncedStorage.setItem(this.id, newValue);
            }
            this._settingInputElem.value = newValue.toString();
            this.invokeInput(this._settingInputElem);
        }
        get defaultValue() {
            return this._defaultValue;
        }
        set defaultValue(value) {
            this._defaultValue = value;
            this.value = this.value;
        }
        get onInput() {
            return this._onInput;
        }
        set onInput(handler) {
            this._onInput = handler;
        }
        create() {
            const settingElem = document.createElement("input");
            settingElem.id = this.id;
            settingElem.type = "text";
            settingElem.className = "textbox";
            settingElem.addEventListener("keydown", (event => {
                const currentValue = parseInt(settingElem.value) || this.defaultValue;
                if ("ArrowUp" === event.key) this.value = Math.min(currentValue + this.step, this.max); else if ("ArrowDown" === event.key) this.value = Math.max(currentValue - this.step, this.min);
            }));
            settingElem.addEventListener("input", (() => {
                const inputValue = settingElem.value.replace(/[^0-9]/g, ""), numericValue = parseInt(inputValue) || this.defaultValue;
                this.value = Math.min(Math.max(numericValue, this.min), this.max);
            }));
            return settingElem;
        }
        loadFromSyncedStorage() {
            SyncedStorage.getItem(this.id).then((value => {
                if (null != value) localStorage.setItem(this.id, value.toString());
            }));
        }
        toString() {
            return `${this.name} = ${this.value}`;
        }
        invokeInput(elem) {
            var _a;
            null === (_a = this.onInput) || void 0 === _a || _a.call(this, elem);
            this.dispatchEvent(new CustomEvent("input", {
                detail: elem
            }));
        }
    }
    class SettingText extends EventTarget {
        constructor(providerId, name) {
            super();
            this.description = "";
            Object.setPrototypeOf(this, SettingText.prototype);
            this.name = name;
            this.id = providerId + "-" + makeIdCompatible(this.name);
            this.type = SettingType.Text;
            this._defaultValue = "";
            this.loadFromSyncedStorage();
            this.settingElem = this.create();
            this._settingInputElem = this.settingElem.querySelector("input");
            this._errorMessage = this.settingElem.querySelector(".error-message");
        }
        get value() {
            var _a;
            return null !== (_a = localStorage.getItem(this.id)) && void 0 !== _a ? _a : this.defaultValue;
        }
        set value(newValue) {
            if (null == this.verifyRegex || this.verifyRegex.test(newValue)) {
                this._errorMessage.style.display = "none";
                try {
                    if (newValue === this.defaultValue) {
                        localStorage.removeItem(this.id);
                        SyncedStorage.removeItem(this.id);
                    } else {
                        localStorage.setItem(this.id, newValue);
                        SyncedStorage.setItem(this.id, newValue);
                    }
                } catch (error) {
                    Logger.logError(error);
                }
                this._settingInputElem.value = newValue;
                this.invokeInput(this._settingInputElem);
            } else this._errorMessage.style.display = "block";
        }
        get defaultValue() {
            return this._defaultValue;
        }
        set defaultValue(value) {
            this._defaultValue = value;
            this.value = this.value;
        }
        get onInput() {
            return this._onInput;
        }
        set onInput(handler) {
            this._onInput = handler;
        }
        create() {
            const container = document.createElement("div");
            container.style.position = "relative";
            const settingElem = document.createElement("input");
            settingElem.id = this.id;
            settingElem.type = "text";
            settingElem.className = "textbox";
            settingElem.addEventListener("input", (() => {
                if (null != this.verifyRegex && !this.verifyRegex.test(settingElem.value)) this._errorMessage.style.display = "block"; else this._errorMessage.style.display = "none";
                this.value = settingElem.value;
            }));
            container.appendChild(settingElem);
            const errorMessage = document.createElement("div");
            errorMessage.className = "error-message";
            errorMessage.style.color = "red";
            errorMessage.style.display = "none";
            errorMessage.style.position = "absolute";
            errorMessage.style.top = "100%";
            errorMessage.style.left = "0";
            errorMessage.textContent = "Invalid input";
            container.appendChild(errorMessage);
            return container;
        }
        loadFromSyncedStorage() {
            SyncedStorage.getItem(this.id).then((value => {
                if (null != value) localStorage.setItem(this.id, value.toString());
            }));
        }
        toString() {
            return `${this.name} = ${this.value}`;
        }
        invokeInput(elem) {
            var _a;
            null === (_a = this.onInput) || void 0 === _a || _a.call(this, elem);
            this.dispatchEvent(new CustomEvent("input", {
                detail: elem
            }));
        }
    }
    var injectStylesIntoStyleTag = __webpack_require__(72), injectStylesIntoStyleTag_default = __webpack_require__.n(injectStylesIntoStyleTag), styleDomAPI = __webpack_require__(825), styleDomAPI_default = __webpack_require__.n(styleDomAPI), insertBySelector = __webpack_require__(659), insertBySelector_default = __webpack_require__.n(insertBySelector), setAttributesWithoutAttributes = __webpack_require__(56), setAttributesWithoutAttributes_default = __webpack_require__.n(setAttributesWithoutAttributes), insertStyleElement = __webpack_require__(540), insertStyleElement_default = __webpack_require__.n(insertStyleElement), styleTagTransform = __webpack_require__(113), styleTagTransform_default = __webpack_require__.n(styleTagTransform), Style = __webpack_require__(622), options = {};
    options.styleTagTransform = styleTagTransform_default();
    options.setAttributes = setAttributesWithoutAttributes_default();
    options.insert = insertBySelector_default().bind(null, "head");
    options.domAPI = styleDomAPI_default();
    options.insertStyleElement = insertStyleElement_default();
    injectStylesIntoStyleTag_default()(Style.A, options);
    Style.A && Style.A.locals && Style.A.locals;
    class SettingOption extends EventTarget {
        constructor(providerId, name) {
            super();
            this.description = "";
            Object.setPrototypeOf(this, SettingOption.prototype);
            this.name = name;
            this.id = providerId + "-" + makeIdCompatible(this.name);
            this.type = SettingType.Option;
            this._defaultValue = "0";
            this.loadFromSyncedStorage();
            this.settingElem = this.create();
            this._settingInputElem = this.settingElem.querySelector("select");
        }
        get value() {
            var _a;
            return null !== (_a = localStorage.getItem(this.id)) && void 0 !== _a ? _a : this.defaultValue;
        }
        set value(newValue) {
            try {
                if (newValue == this.defaultValue) {
                    localStorage.removeItem(this.id);
                    SyncedStorage.removeItem(this.id);
                } else {
                    localStorage.setItem(this.id, newValue.toString());
                    SyncedStorage.setItem(this.id, newValue.toString());
                }
            } catch (error) {
                Logger.logError(error);
            }
            this._settingInputElem.value = newValue.toString();
            this.invokeInput(this._settingInputElem);
        }
        get defaultValue() {
            return this._defaultValue;
        }
        set defaultValue(value) {
            this._defaultValue = value;
            this.value = this.value;
        }
        get options() {
            var _a;
            const options = {};
            for (const option of Array.from(this._settingInputElem.options)) options[option.value] = null !== (_a = option.textContent) && void 0 !== _a ? _a : "";
            return options;
        }
        set options(newValue) {
            const currValue = this.value;
            this._settingInputElem.innerHTML = "";
            for (const [value, text] of Object.entries(newValue)) this.addOption(value, text);
            if (Array.from(this._settingInputElem.options).some((x => x.value === currValue.toString()))) this.value = currValue; else this.value = this.defaultValue;
        }
        get onInput() {
            return this._onInput;
        }
        set onInput(handler) {
            this._onInput = handler;
        }
        addOption(value, text) {
            if (null != this._settingInputElem.options.namedItem(value.toString())) {
                Logger.logWarning(`Option with value "${value}" already exists.`);
                return;
            }
            const option = document.createElement("option");
            option.value = value.toString();
            option.textContent = text.toString();
            this._settingInputElem.options.add(option);
        }
        removeOption(value) {
            const option = this._settingInputElem.options.namedItem(value.toString());
            if (null != option) this._settingInputElem.removeChild(option); else Logger.logWarning(`Option with value "${value}" does not exist.`);
        }
        create() {
            const container = document.createElement("div");
            container.style.position = "relative";
            const settingElem = document.createElement("select");
            settingElem.id = this.id;
            settingElem.className = "styled";
            settingElem.addEventListener("change", (() => {
                this.value = settingElem.value;
            }));
            container.appendChild(settingElem);
            return container;
        }
        loadFromSyncedStorage() {
            SyncedStorage.getItem(this.id).then((value => {
                if (null != value) localStorage.setItem(this.id, value.toString());
            }));
        }
        toString() {
            return `${this.name} = ${this.value}`;
        }
        invokeInput(elem) {
            var _a;
            null === (_a = this.onInput) || void 0 === _a || _a.call(this, elem);
            this.dispatchEvent(new CustomEvent("input", {
                detail: elem
            }));
        }
    }
    var StorageWrapper_awaiter = function(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))((function(resolve, reject) {
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
                    return value instanceof P ? value : new P((function(resolve) {
                        resolve(value);
                    }));
                }(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        }));
    };
    class StorageWrapper {
        static setItemAsync(key_1, value_1) {
            return StorageWrapper_awaiter(this, arguments, void 0, (function*(key, value, retry = false) {
                try {
                    if (retry) return yield StorageWrapper.setItemAsyncWithRetry(key, value);
                    localStorage.setItem(key, value);
                    yield SyncedStorage.setItem(key, value);
                    return true;
                } catch (_a) {
                    Logger.logError(`Failed to set item in storage: ${key}=${value}`);
                    return false;
                }
            }));
        }
        static setItemAsyncWithRetry(key, value) {
            return StorageWrapper_awaiter(this, void 0, void 0, (function*() {
                return new Promise((resolve => {
                    const attemptSave = () => StorageWrapper_awaiter(this, void 0, void 0, (function*() {
                        if (yield StorageWrapper.setItemAsync(key, value)) resolve(true); else {
                            Logger.logWarning(`Failed to save item ${key}, retrying in 1000ms...`);
                            setTimeout((() => {
                                attemptSave();
                            }), 1e3);
                        }
                    }));
                    attemptSave();
                }));
            }));
        }
        static getItemAsync(key) {
            return StorageWrapper_awaiter(this, void 0, void 0, (function*() {
                try {
                    const valueLocal = localStorage.getItem(key), valueSynced = yield SyncedStorage.getItem(key);
                    if (valueSynced === valueLocal) return valueSynced; else return null != valueSynced ? valueSynced : valueLocal;
                } catch (_a) {
                    Logger.logError(`Failed to get item from storage: ${key}`);
                    return null;
                }
            }));
        }
        static removeItemAsync(key) {
            return StorageWrapper_awaiter(this, void 0, void 0, (function*() {
                try {
                    localStorage.removeItem(key);
                    yield SyncedStorage.removeItem(key);
                    return true;
                } catch (_a) {
                    Logger.logError(`Failed to remove item from storage: ${key}`);
                    return false;
                }
            }));
        }
        static getAllItemsAsync() {
            return StorageWrapper_awaiter(this, void 0, void 0, (function*() {
                try {
                    const localStorageItems = {};
                    for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (null == key) continue;
                        const value = localStorage.getItem(key);
                        localStorageItems[key] = value;
                    }
                    const syncedItems = yield SyncedStorage.getAllItems();
                    return Object.assign(Object.assign({}, localStorageItems), syncedItems);
                } catch (_a) {
                    Logger.logError("Failed to get all items from storage");
                    return {};
                }
            }));
        }
    }
    var _a, Settings_awaiter = function(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))((function(resolve, reject) {
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
                    return value instanceof P ? value : new P((function(resolve) {
                        resolve(value);
                    }));
                }(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        }));
    };
    class Settings {
        constructor(provider, headerName) {
            this.settings = {};
            this.showFeatureEnabledSetting = true;
            this._settingClassMapping = {
                [SettingType.Number]: SettingNumber,
                [SettingType.Boolean]: SettingBoolean,
                [SettingType.Action]: SettingAction,
                [SettingType.Text]: SettingText,
                [SettingType.Option]: SettingOption
            };
            this._menuName = "Extension Settings";
            this._menuNameId = makeIdCompatible("Extension Settings");
            this._provider = provider;
            this._providerId = makeIdCompatible(provider);
            this._headerName = headerName;
            this._isFeatureEnabledSetting = new SettingBoolean(this.providerId, `${headerName} Enabled`);
            this._isFeatureEnabledSetting.defaultValue = true;
            let currSettingsJson = localStorage.getItem("ff-registered-settings");
            null != currSettingsJson || (currSettingsJson = "[]");
            const currSettings = JSON.parse(currSettingsJson);
            if (!currSettings.includes(this.providerId)) {
                currSettings.push(this.providerId);
                localStorage.setItem("ff-registered-settings", JSON.stringify(currSettings));
            }
        }
        get menuName() {
            return this._menuName;
        }
        get menuNameId() {
            return this._menuNameId;
        }
        get provider() {
            return this._provider;
        }
        get providerId() {
            return this._providerId;
        }
        get headerName() {
            return this._headerName;
        }
        get isFeatureEnabled() {
            return this._isFeatureEnabledSetting.value;
        }
        newSetting(type, name) {
            const newSetting = new (0, this._settingClassMapping[type])(this.providerId, name);
            this.settings[name] = newSetting;
            return newSetting;
        }
        loadSettings() {
            try {
                this.addExSettingsMenu(this.menuName, this.provider, this.menuNameId, this.providerId);
                if (window.location.toString().includes("controls/settings")) {
                    this.addExSettingsMenuSidebar(this.menuName, this.provider, this.menuNameId, this.providerId);
                    if (window.location.toString().includes("?extension=" + this.providerId)) this.loadSettingValues(this.headerName, Object.values(this.settings));
                }
            } catch (error) {
                Logger.logError(error);
            }
        }
        exportSettings() {
            return Settings_awaiter(this, void 0, void 0, (function*() {
                try {
                    let registeredSettingsJson = localStorage.getItem("ff-registered-settings");
                    null != registeredSettingsJson || (registeredSettingsJson = "[]");
                    const registeredSettings = JSON.parse(registeredSettingsJson);
                    if (0 === registeredSettings.length) return;
                    let settings = yield StorageWrapper.getAllItemsAsync();
                    if (null == settings) return;
                    settings = Object.entries(settings).filter((([key]) => registeredSettings.some((setting => key.startsWith(setting))))).reduce(((obj, [key, value]) => {
                        obj[key] = value;
                        return obj;
                    }), {});
                    Logger.logInfo("Exporting Settings");
                    Logger.logInfo(settings);
                    if (0 === Object.keys(settings).length) return;
                    const settingsString = JSON.stringify(settings, null, 2), blob = new Blob([ settingsString ], {
                        type: "application/json"
                    }), url = URL.createObjectURL(blob), a = document.createElement("a");
                    a.href = url;
                    a.download = `${this.providerId}_settings.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                } catch (error) {
                    Logger.logError(error);
                }
            }));
        }
        importSettings(settingsJson) {
            return Settings_awaiter(this, void 0, void 0, (function*() {
                try {
                    Logger.logInfo("Importing Settings");
                    Logger.logInfo(settingsJson);
                    null != settingsJson || (settingsJson = "{}");
                    const settings = JSON.parse(settingsJson);
                    for (const [key, value] of Object.entries(settings)) yield StorageWrapper.setItemAsync(key, value);
                } catch (error) {
                    Logger.logError(error);
                }
            }));
        }
        loadSettingValues(headerName, settings) {
            var _a;
            if (0 === settings.length) return;
            if (null != document.getElementById(headerName + "_settingscontainer")) return;
            const columnPage = document.getElementById("columnpage"), content = null == columnPage ? void 0 : columnPage.querySelector('div[class="content"]');
            if (null == content) {
                Logger.logError("Failed to load settings. No content found.");
                return;
            }
            const nonExSettings = content.querySelectorAll('section:not([class="exsettings"])');
            for (const section of Array.from(null != nonExSettings ? nonExSettings : [])) null === (_a = section.parentNode) || void 0 === _a || _a.removeChild(section);
            const section = document.createElement("section");
            section.id = headerName + "_settingscontainer";
            section.className = "exsettings";
            const headerContainer = document.createElement("div");
            headerContainer.className = "section-header cs";
            const header = document.createElement("h2");
            header.textContent = headerName;
            const bodyContainer = document.createElement("div");
            bodyContainer.className = "section-body cs";
            if (this._isFeatureEnabledSetting.value) bodyContainer.classList.remove("collapsed"); else bodyContainer.classList.add("collapsed");
            if (this.showFeatureEnabledSetting) headerContainer.appendChild(this.createFeatureEnableSetting(bodyContainer));
            headerContainer.appendChild(header);
            section.appendChild(headerContainer);
            for (const setting of settings) bodyContainer.appendChild(this.createSettingContainer(setting));
            section.appendChild(bodyContainer);
            content.appendChild(section);
        }
        createFeatureEnableSetting(bodyContainer) {
            const enableFeatureSettingContainerElem = document.createElement("label");
            enableFeatureSettingContainerElem.classList.add("switch-cs");
            const enableFeatureSettingInput = document.createElement("input");
            enableFeatureSettingInput.type = "checkbox";
            enableFeatureSettingInput.id = "toggleSwitch";
            enableFeatureSettingInput.checked = this._isFeatureEnabledSetting.value;
            enableFeatureSettingInput.addEventListener("input", (() => {
                this._isFeatureEnabledSetting.value = enableFeatureSettingInput.checked;
                if (enableFeatureSettingInput.checked) bodyContainer.classList.remove("collapsed"); else bodyContainer.classList.add("collapsed");
            }));
            const enableFeatureSettingSpan = document.createElement("span");
            enableFeatureSettingSpan.classList.add("slider-cs");
            enableFeatureSettingContainerElem.appendChild(enableFeatureSettingInput);
            enableFeatureSettingContainerElem.appendChild(enableFeatureSettingSpan);
            return enableFeatureSettingContainerElem;
        }
        toString() {
            if (0 === Object.keys(this.settings).length) return `${this.menuName} has no settings.`;
            let settingsString = "(";
            Object.keys(this.settings).forEach((key => {
                if (this.settings[key].type !== SettingType.Action) settingsString += `"${this.settings[key].toString()}", `;
            }));
            settingsString = settingsString.slice(0, -2) + ")";
            return settingsString;
        }
        createSettingContainer(setting) {
            const settingContainer = document.createElement("div");
            settingContainer.className = "control-panel-item-container";
            const settingName = document.createElement("div");
            settingName.className = "control-panel-item-name";
            const settingNameText = document.createElement("h4");
            settingNameText.textContent = setting.name;
            settingName.appendChild(settingNameText);
            settingContainer.appendChild(settingName);
            const settingDesc = document.createElement("div");
            settingDesc.className = "control-panel-item-description";
            const settingDescText = document.createTextNode(setting.description);
            settingDesc.appendChild(settingDescText);
            settingContainer.appendChild(settingDesc);
            if (showResetButtonSetting.value && setting.type !== SettingType.Action) {
                settingDesc.appendChild(document.createElement("br"));
                settingDesc.appendChild(this.createSettingReset(setting));
            }
            const settingOption = document.createElement("div");
            settingOption.className = "control-panel-item-options";
            settingOption.appendChild(setting.settingElem);
            settingContainer.appendChild(settingOption);
            return settingContainer;
        }
        createSettingReset(setting) {
            const settingDescReset = document.createElement("a");
            settingDescReset.id = setting.id + "_settingreset";
            settingDescReset.textContent = "Reset this Setting";
            settingDescReset.style.cursor = "pointer";
            settingDescReset.style.color = "aqua";
            settingDescReset.style.textDecoration = "underline";
            settingDescReset.style.fontStyle = "italic";
            settingDescReset.style.fontSize = "14px";
            settingDescReset.addEventListener("click", (() => {
                setting.value = setting.defaultValue;
            }));
            return settingDescReset;
        }
        addExSettingsMenu(name, provider, nameId, providerId) {
            var _a;
            try {
                const navBar = document.querySelector('ul[class="navhideonmobile"]'), settings = null === (_a = null == navBar ? void 0 : navBar.querySelector('a[href="/controls/settings/"]')) || void 0 === _a ? void 0 : _a.parentNode;
                if (null == settings) {
                    Logger.logError(`Failed to add extension ${name} to settings menu`);
                    return;
                }
                const exSettingNamePresent = null != document.getElementById(nameId), exSettingProviderPresent = null != document.getElementById(providerId);
                if (!exSettingNamePresent) {
                    const exSettingsHeader = document.createElement("h3");
                    exSettingsHeader.id = nameId;
                    exSettingsHeader.textContent = name;
                    settings.appendChild(exSettingsHeader);
                }
                if (!exSettingProviderPresent) {
                    const currExSettings = document.createElement("a");
                    currExSettings.id = providerId;
                    currExSettings.textContent = provider;
                    currExSettings.href = "/controls/settings?extension=" + providerId;
                    currExSettings.style.cursor = "pointer";
                    settings.appendChild(currExSettings);
                }
            } catch (error) {
                Logger.logError(error);
            }
        }
        addExSettingsMenuSidebar(name, provider, nameId, providerId) {
            try {
                const settings = document.getElementById("controlpanelnav");
                if (null == settings) {
                    Logger.logError(`Failed to add extension ${name} to settings sidebar`);
                    return;
                }
                const exSettingNamePresent = null != document.getElementById(nameId + "_side"), exSettingProviderPresent = null != document.getElementById(providerId + "_side");
                if (!exSettingNamePresent) {
                    const exSettingsHeader = document.createElement("h3");
                    exSettingsHeader.id = nameId + "_side";
                    exSettingsHeader.textContent = name;
                    settings.appendChild(exSettingsHeader);
                }
                if (!exSettingProviderPresent) {
                    const currExSettings = document.createElement("a");
                    currExSettings.id = providerId + "_side";
                    currExSettings.textContent = provider;
                    currExSettings.href = "/controls/settings?extension=" + providerId;
                    currExSettings.style.cursor = "pointer";
                    settings.appendChild(currExSettings);
                    settings.appendChild(document.createElement("br"));
                }
            } catch (error) {
                Logger.logError(error);
            }
        }
    }
    Object.defineProperties(window, {
        FACustomSettings: {
            get: () => Settings
        },
        FASettingType: {
            get: () => SettingType
        }
    });
    const customSettings = new Settings("Custom Furaffinity Settings", "Global Custom Furaffinity Settings");
    customSettings.showFeatureEnabledSetting = false;
    const loggingSetting = customSettings.newSetting(window.FASettingType.Option, "Logging");
    loggingSetting.description = "Sets the logging level.";
    loggingSetting.defaultValue = LogLevel.Error;
    loggingSetting.options = {
        [LogLevel.Error]: LogLevel[LogLevel.Error],
        [LogLevel.Warning]: LogLevel[LogLevel.Warning],
        [LogLevel.Info]: LogLevel[LogLevel.Info]
    };
    loggingSetting.addEventListener("input", (() => Logger.setLogLevel(parseInt(loggingSetting.value.toString()))));
    Logger.setLogLevel(parseInt(loggingSetting.value.toString()));
    const showResetButtonSetting = customSettings.newSetting(SettingType.Boolean, "Show Reset Button");
    showResetButtonSetting.description = 'Set wether the "Reset this Setting" button is shown in other Settings.';
    showResetButtonSetting.defaultValue = true;
    const importSettingsSetting = customSettings.newSetting(SettingType.Action, "Import Settings");
    importSettingsSetting.description = "Imports the Settings from a JSON file.";
    importSettingsSetting.addEventListener("input", (() => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".json";
        fileInput.addEventListener("change", (() => {
            var _a;
            const file = null === (_a = fileInput.files) || void 0 === _a ? void 0 : _a[0];
            if (file) file.text().then((content => {
                customSettings.importSettings(content);
                location.reload();
            }));
        }));
        fileInput.click();
    }));
    const exportSettingsSetting = customSettings.newSetting(SettingType.Action, "Export Settings");
    exportSettingsSetting.description = "Exports the current Settings to a JSON file.";
    exportSettingsSetting.addEventListener("input", (() => {
        customSettings.exportSettings();
    }));
    customSettings.loadSettings();
    let color = "color: blue";
    if (null === (_a = window.matchMedia) || void 0 === _a ? void 0 : _a.call(window, "(prefers-color-scheme: dark)").matches) color = "color: aqua";
    const settingString = `GlobalSettings: ${customSettings.toString()}`;
    console.info(`%c${settingString}`, color);
})();