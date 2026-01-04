// ==UserScript==
// @name        FA Embedded Image Viewer
// @namespace   Violentmonkey Scripts
// @match       *://*.furaffinity.net/*
// @require     https://update.greasyfork.org/scripts/525666/1549449/Furaffinity-Prototype-Extensions.js
// @require     https://update.greasyfork.org/scripts/483952/1672922/Furaffinity-Request-Helper.js
// @require     https://update.greasyfork.org/scripts/492931/1656707/Furaffinity-Submission-Image-Viewer.js
// @require     https://update.greasyfork.org/scripts/485827/1549457/Furaffinity-Match-List.js
// @require     https://update.greasyfork.org/scripts/485153/1549461/Furaffinity-Loading-Animations.js
// @require     https://update.greasyfork.org/scripts/476762/1549463/Furaffinity-Custom-Pages.js
// @require     https://update.greasyfork.org/scripts/475041/1617223/Furaffinity-Custom-Settings.js
// @grant       GM_info
// @version     2.5.3
// @author      Midori Dragon
// @description Embeds the clicked Image on the Current Site, so you can view it without loading the submission Page
// @icon        https://www.furaffinity.net/themes/beta/img/banners/fa_logo.png
// @license     MIT
// @homepageURL https://greasyfork.org/scripts/458971-fa-embedded-image-viewer
// @supportURL  https://greasyfork.org/scripts/458971-fa-embedded-image-viewer/feedback
// @downloadURL https://update.greasyfork.org/scripts/458971/FA%20Embedded%20Image%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/458971/FA%20Embedded%20Image%20Viewer.meta.js
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
        789: (module, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.d(__webpack_exports__, {
                A: () => __WEBPACK_DEFAULT_EXPORT__
            });
            var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
            var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
            var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
            var ___CSS_LOADER_EXPORT___ = __webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
            ___CSS_LOADER_EXPORT___.push([ module.id, "#eiv-main {\n    position: fixed;\n    width: 100vw;\n    height: 100vh;\n    max-width: 1850px;\n    z-index: 999999;\n    background: rgba(30, 33, 38, .65);\n}\n\n#eiv-background {\n    position: fixed;\n    display: flex;\n    flex-direction: column;\n    left: 50%;\n    transform: translate(-50%, 0%);\n    margin-top: 20px;\n    padding: 20px;\n    background: rgba(30, 33, 38, .90);\n    border-radius: 10px;\n}\n\n#eiv-submission-container {\n    -webkit-user-drag: none;\n}\n\n.eiv-submission-img {\n    max-width: inherit;\n    max-height: inherit;\n    border-radius: 10px;\n    user-select: none;\n}\n\n#eiv-button-container {\n    position: relative;\n    margin-top: 20px;\n    margin-bottom: 6px;\n    margin-left: 20px;\n}\n\n#eiv-button-wrapper {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n}\n\n#eiv-preview-spinner-container {\n    position: absolute;\n    top: 50%;\n    right: 0;\n    transform: translateY(-50%);\n}\n\n.eiv-button {\n    margin-left: 4px;\n    margin-right: 4px;\n    user-select: none;\n}\n\n#eiv-additional-info {\n    color: #afc6e1;\n}\n", "" ]);
            const __WEBPACK_DEFAULT_EXPORT__ = ___CSS_LOADER_EXPORT___;
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
        yr: () => closeEmbedAfterOpenSetting,
        xe: () => loadingSpinSpeedFavSetting,
        _d: () => loadingSpinSpeedSetting,
        h_: () => openInNewTabSetting,
        e2: () => previewQualitySetting,
        uL: () => requestHelper,
        pz: () => showWatchingInfoSetting
    });
    class EmbeddedHTML {
        static get html() {
            return '\n<div id="eiv-background">\n    <a id="eiv-submission-container"></a>\n    <div id="eiv-button-container">\n        <div id="eiv-button-wrapper">\n            <a id="eiv-fav-button" type="button" class="eiv-button button standard mobile-fix">⠀⠀</a>\n            <a id="eiv-download-button" type="button" class="eiv-button button standard mobile-fix">Download</a>\n            <a id="eiv-open-button" type="button" class="eiv-button button standard mobile-fix">Open</a>\n            <a id="eiv-open-gallery-button" type="button" class="eiv-button button standard mobile-fix" style="display: none;">Open Gallery</a>\n            <a id="eiv-remove-sub-button" type="button" class="eiv-button button standard mobile-fix" style="display: none;">Remove</a>\n            <a id="eiv-close-button" type="button" class="eiv-button button standard mobile-fix">Close</a>\n        </div>\n        <div id="eiv-preview-spinner-container"></div>\n    </div>\n    <div id="eiv-additional-info-container">\n        <a>by </a>\n        <a id="eiv-additional-info">unknown</a>\n        <a id="eiv-additional-info-watching"></a>\n    </div>\n</div>';
        }
    }
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
    var Style = __webpack_require__(789);
    var options = {};
    options.styleTagTransform = styleTagTransform_default();
    options.setAttributes = setAttributesWithoutAttributes_default();
    options.insert = insertBySelector_default().bind(null, "head");
    options.domAPI = styleDomAPI_default();
    options.insertStyleElement = insertStyleElement_default();
    injectStylesIntoStyleTag_default()(Style.A, options);
    Style.A && Style.A.locals && Style.A.locals;
    const string = class {
        static isNullOrWhitespace(str) {
            return null == str || "" === str.trim();
        }
        static isNullOrEmpty(str) {
            return null == str || "" === str;
        }
    };
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
    const embeddedModes = {
        watchesFavoriteViewer: "wfv-favorites"
    };
    class EmbeddedImage extends EventTarget {
        constructor(figure) {
            super();
            this.favRequestRunning = false;
            this.downloadRequestRunning = false;
            this._imageLoaded = false;
            Object.setPrototypeOf(this, EmbeddedImage.prototype);
            this.embeddedElem = document.createElement("div");
            this.createElements(figure);
            const submissionContainer = document.getElementById("eiv-submission-container");
            const previewLoadingSpinnerContainer = document.getElementById("eiv-preview-spinner-container");
            this.loadingSpinner = new window.FALoadingSpinner(submissionContainer);
            this.loadingSpinner.delay = loadingSpinSpeedSetting.value;
            this.loadingSpinner.spinnerThickness = 6;
            this.loadingSpinner.visible = true;
            this.previewLoadingSpinner = new window.FALoadingSpinner(previewLoadingSpinnerContainer);
            this.previewLoadingSpinner.delay = loadingSpinSpeedSetting.value;
            this.previewLoadingSpinner.spinnerThickness = 4;
            this.previewLoadingSpinner.size = 40;
            document.addEventListener("click", this.onDocumentClick.bind(this));
            this.fillSubDocInfos(figure);
            this.fillUserInfos(figure);
        }
        static get embeddedExists() {
            return null != document.getElementById("eiv-main");
        }
        get onRemove() {
            return this._onRemove;
        }
        set onRemove(handler) {
            this._onRemove = handler;
        }
        onDocumentClick(event) {
            if (event.target === document.documentElement) {
                this.remove();
            }
        }
        onOpenClick() {
            if (closeEmbedAfterOpenSetting.value) {
                this.remove();
            }
        }
        onRemoveSubClick(figure) {
            return __awaiter(this, void 0, void 0, function*() {
                const sid = figure.id.trimStart("sid-");
                this.remove();
                figure.remove();
                yield requestHelper.PersonalUserRequests.MessageRequests.NewSubmissions.removeSubmissions([ sid ]);
            });
        }
        invokeRemove() {
            var _a;
            null === (_a = this._onRemove) || void 0 === _a || _a.call(this);
            this.dispatchEvent(new Event("remove"));
        }
        remove() {
            var _a, _b;
            null === (_a = this.faImageViewer) || void 0 === _a || _a.destroy();
            null === (_b = this.embeddedElem.parentNode) || void 0 === _b || _b.removeChild(this.embeddedElem);
            document.removeEventListener("click", this.onDocumentClick);
            this.invokeRemove();
        }
        createElements(figure) {
            var _a, _b;
            this.embeddedElem.id = "eiv-main";
            this.embeddedElem.setAttribute("eiv-sid", figure.id.trimStart("sid-"));
            this.embeddedElem.innerHTML = EmbeddedHTML.html;
            document.getElementById("ddmenu").appendChild(this.embeddedElem);
            this.embeddedElem.addEventListener("click", event => {
                if (event.target === this.embeddedElem) {
                    this.remove();
                }
            });
            const submissionContainer = document.getElementById("eiv-submission-container");
            if (openInNewTabSetting.value) {
                submissionContainer.setAttribute("target", "_blank");
            }
            submissionContainer.addEventListener("click", this.onOpenClick.bind(this));
            const userLink = function getByLinkFromFigcaption(figcaption) {
                var _a, _b, _c;
                if (null != figcaption) {
                    const infos = figcaption.querySelectorAll("i");
                    let userLink = null;
                    for (const info of Array.from(infos)) {
                        if (null !== (_b = null === (_a = info.textContent) || void 0 === _a ? void 0 : _a.toLowerCase().includes("by")) && void 0 !== _b ? _b : false) {
                            const linkElem = null === (_c = info.parentNode) || void 0 === _c ? void 0 : _c.querySelector("a[href][title]");
                            if (linkElem) {
                                userLink = linkElem.getAttribute("href");
                            }
                        }
                    }
                    return userLink;
                }
                return null;
            }(figure.querySelector("figcaption"));
            if (null != userLink) {
                const galleryLink = userLink.trimEnd("/").replace("user", "gallery");
                const scrapsLink = userLink.trimEnd("/").replace("user", "scraps");
                if (!window.location.toString().includes(userLink) && !window.location.toString().includes(galleryLink) && !window.location.toString().includes(scrapsLink)) {
                    const openGalleryButton = document.getElementById("eiv-open-gallery-button");
                    openGalleryButton.style.display = "block";
                    openGalleryButton.setAttribute("href", galleryLink);
                    if (openInNewTabSetting.value) {
                        openGalleryButton.setAttribute("target", "_blank");
                    }
                    openGalleryButton.addEventListener("click", this.onOpenClick.bind(this));
                }
            }
            const link = null === (_a = figure.querySelector("a[href]")) || void 0 === _a ? void 0 : _a.getAttribute("href");
            const openButton = document.getElementById("eiv-open-button");
            openButton.setAttribute("href", null !== link && void 0 !== link ? link : "");
            if (openInNewTabSetting.value) {
                openButton.setAttribute("target", "_blank");
            }
            openButton.addEventListener("click", this.onOpenClick.bind(this));
            document.getElementById("eiv-close-button").addEventListener("click", this.remove.bind(this));
            const embeddedModesValues = Object.values(embeddedModes);
            if (window.location.toString().toLowerCase().includes("msg/submissions") && embeddedModesValues.every(mode => !window.location.toString().toLocaleLowerCase().includes(mode))) {
                const removeSubButton = document.getElementById("eiv-remove-sub-button");
                removeSubButton.style.display = "block";
                removeSubButton.addEventListener("click", () => {
                    this.onRemoveSubClick(figure);
                });
            }
            const additionalInfo = document.getElementById("eiv-additional-info");
            const figcaption = figure.querySelector("figcaption");
            const userElems = null === figcaption || void 0 === figcaption ? void 0 : figcaption.querySelectorAll('a[href*="user/"]');
            const byElem = null === userElems || void 0 === userElems ? void 0 : userElems[userElems.length - 1];
            if (null != byElem && null != additionalInfo) {
                additionalInfo.textContent = `${byElem.textContent}`;
                additionalInfo.setAttribute("href", null !== (_b = byElem.getAttribute("href")) && void 0 !== _b ? _b : "");
            }
            document.getElementById("eiv-preview-spinner-container").addEventListener("click", () => {
                this.previewLoadingSpinner.visible = false;
            });
        }
        fillSubDocInfos(figure) {
            return __awaiter(this, void 0, void 0, function*() {
                var _a, _b, _c;
                const sid = figure.id.split("-")[1];
                const ddmenu = document.getElementById("ddmenu");
                const doc = yield requestHelper.SubmissionRequests.getSubmissionPage(sid);
                if (null != doc) {
                    this.submissionImg = doc.getElementById("submissionImg");
                    const imgSrc = this.submissionImg.src;
                    let prevSrc = null !== (_a = this.submissionImg.getAttribute("data-preview-src")) && void 0 !== _a ? _a : void 0;
                    if (!string.isNullOrWhitespace(prevSrc)) {
                        Logger.logInfo("Preview quality @" + previewQualitySetting.value);
                        prevSrc = null === prevSrc || void 0 === prevSrc ? void 0 : prevSrc.replace("@600", "@" + previewQualitySetting.value);
                    }
                    const submissionContainer = document.getElementById("eiv-submission-container");
                    this.faImageViewer = new window.FAImageViewer(submissionContainer, imgSrc, prevSrc);
                    this.faImageViewer.faImage.imgElem.id = "eiv-submission-img";
                    this.faImageViewer.faImagePreview.imgElem.id = "eiv-preview-submission-img";
                    this.faImageViewer.faImage.imgElem.classList.add("eiv-submission-img");
                    this.faImageViewer.faImagePreview.imgElem.classList.add("eiv-submission-img");
                    this.faImageViewer.faImage.imgElem.style.maxWidth = this.faImageViewer.faImagePreview.imgElem.style.maxWidth = window.innerWidth - 40 + "px";
                    this.faImageViewer.faImage.imgElem.style.maxHeight = this.faImageViewer.faImagePreview.imgElem.style.maxHeight = window.innerHeight - ddmenu.clientHeight - 76 - 40 - 100 + "px";
                    this.faImageViewer.addEventListener("image-load-start", () => {
                        this._imageLoaded = false;
                    });
                    this.faImageViewer.addEventListener("image-load", () => {
                        this._imageLoaded = true;
                        this.loadingSpinner.visible = false;
                        this.previewLoadingSpinner.visible = false;
                    });
                    this.faImageViewer.addEventListener("preview-image-load", () => {
                        this.loadingSpinner.visible = false;
                        if (!this._imageLoaded) {
                            this.previewLoadingSpinner.visible = true;
                        }
                    });
                    this.faImageViewer.load();
                    const url = null === (_b = doc.querySelector('meta[property="og:url"]')) || void 0 === _b ? void 0 : _b.getAttribute("content");
                    submissionContainer.setAttribute("href", null !== url && void 0 !== url ? url : "");
                    const result = function getFavKey(doc) {
                        var _a, _b, _c, _d, _e, _f, _g;
                        const columnPage = doc.getElementById("columnpage");
                        const navbar = null === columnPage || void 0 === columnPage ? void 0 : columnPage.querySelector('div[class*="favorite-nav"]');
                        const buttons = null !== (_a = null === navbar || void 0 === navbar ? void 0 : navbar.querySelectorAll('a[class*="button"][href]')) && void 0 !== _a ? _a : [];
                        let favButton;
                        for (const button of Array.from(buttons)) {
                            if (null !== (_c = null === (_b = button.textContent) || void 0 === _b ? void 0 : _b.toLowerCase().includes("fav")) && void 0 !== _c ? _c : false) {
                                favButton = button;
                            }
                        }
                        if (null != favButton) {
                            return {
                                favKey: null !== (_e = null === (_d = favButton.getAttribute("href")) || void 0 === _d ? void 0 : _d.split("?key=")[1]) && void 0 !== _e ? _e : null,
                                isFav: !(null !== (_g = null === (_f = favButton.getAttribute("href")) || void 0 === _f ? void 0 : _f.toLowerCase().includes("unfav")) && void 0 !== _g ? _g : true)
                            };
                        }
                        return null;
                    }(doc);
                    const favButton = document.getElementById("eiv-fav-button");
                    if (null == result) {
                        favButton.style.display = "none";
                    } else {
                        favButton.textContent = result.isFav ? "+Fav" : "-Fav";
                        favButton.setAttribute("isFav", result.isFav.toString());
                        favButton.setAttribute("key", null !== (_c = result.favKey) && void 0 !== _c ? _c : "");
                        favButton.addEventListener("click", () => {
                            if (!this.favRequestRunning) {
                                this.doFavRequest(sid);
                            }
                        });
                    }
                    const downloadButton = document.getElementById("eiv-download-button");
                    downloadButton.addEventListener("click", () => {
                        if (this.downloadRequestRunning) {
                            return;
                        }
                        this.downloadRequestRunning = true;
                        const loadingTextSpinner = new window.FALoadingTextSpinner(downloadButton);
                        loadingTextSpinner.delay = loadingSpinSpeedFavSetting.value;
                        loadingTextSpinner.visible = true;
                        const iframe = document.createElement("iframe");
                        iframe.style.display = "none";
                        iframe.src = this.submissionImg.src + "?eiv-download";
                        iframe.addEventListener("load", () => {
                            this.downloadRequestRunning = false;
                            loadingTextSpinner.visible = false;
                            setTimeout(() => {
                                var _a;
                                return null === (_a = iframe.parentNode) || void 0 === _a ? void 0 : _a.removeChild(iframe);
                            }, 100);
                        });
                        document.body.appendChild(iframe);
                    });
                }
            });
        }
        fillUserInfos(figure) {
            return __awaiter(this, void 0, void 0, function*() {
                if (showWatchingInfoSetting.value) {
                    const additionalInfoWatching = document.getElementById("eiv-additional-info-watching");
                    const figcaption = figure.querySelector("figcaption");
                    if (null != figcaption && null != additionalInfoWatching) {
                        const userLink = function getUserFromFigcaption(figcaption) {
                            var _a, _b, _c, _d;
                            if (null != figcaption) {
                                const infos = figcaption.querySelectorAll("i");
                                let userLink = null;
                                for (const info of Array.from(infos)) {
                                    if (null !== (_b = null === (_a = info.textContent) || void 0 === _a ? void 0 : _a.toLowerCase().includes("by")) && void 0 !== _b ? _b : false) {
                                        const linkElem = null === (_c = info.parentNode) || void 0 === _c ? void 0 : _c.querySelector("a[href][title]");
                                        if (linkElem) {
                                            userLink = linkElem.getAttribute("href");
                                            userLink = null === userLink || void 0 === userLink ? void 0 : userLink.trimEnd("/");
                                            userLink = null !== (_d = null === userLink || void 0 === userLink ? void 0 : userLink.split("/").pop()) && void 0 !== _d ? _d : null;
                                        }
                                    }
                                }
                                return userLink;
                            }
                            return null;
                        }(figcaption);
                        console.log(userLink);
                        if (null != userLink) {
                            const userPage = yield requestHelper.UserRequests.getUserPage(userLink);
                            if (null != userPage) {
                                const siteContent = userPage.getElementById("site-content");
                                const navInterfaceButtons = null === siteContent || void 0 === siteContent ? void 0 : siteContent.querySelector("userpage-nav-interface-buttons");
                                if (null != navInterfaceButtons) {
                                    const watchButton = null === navInterfaceButtons || void 0 === navInterfaceButtons ? void 0 : navInterfaceButtons.querySelector('a[href^="/watch/"]');
                                    console.log(null === watchButton || void 0 === watchButton ? void 0 : watchButton.outerHTML);
                                    if (null == watchButton) {
                                        additionalInfoWatching.textContent = " (watching)";
                                    } else {
                                        additionalInfoWatching.textContent = " (not watching)";
                                    }
                                }
                            }
                        }
                    }
                }
            });
        }
        doFavRequest(sid) {
            return __awaiter(this, void 0, void 0, function*() {
                var _a, _b, _c;
                const favButton = document.getElementById("eiv-fav-button");
                this.favRequestRunning = true;
                const loadingTextSpinner = new window.FALoadingTextSpinner(favButton);
                loadingTextSpinner.delay = loadingSpinSpeedFavSetting.value;
                loadingTextSpinner.visible = true;
                let favKey = null !== (_a = favButton.getAttribute("key")) && void 0 !== _a ? _a : "";
                let isFav = "true" === favButton.getAttribute("isFav");
                if (!string.isNullOrWhitespace(favKey)) {
                    if (isFav) {
                        favKey = null !== (_b = yield requestHelper.SubmissionRequests.favSubmission(sid, favKey)) && void 0 !== _b ? _b : "";
                        loadingTextSpinner.visible = false;
                        if (!string.isNullOrWhitespace(favKey)) {
                            favButton.setAttribute("key", favKey);
                            isFav = false;
                            favButton.setAttribute("isFav", isFav.toString());
                            favButton.textContent = "-Fav";
                        } else {
                            favButton.textContent = "x";
                            setTimeout(() => favButton.textContent = "+Fav", 1e3);
                        }
                    } else {
                        favKey = null !== (_c = yield requestHelper.SubmissionRequests.unfavSubmission(sid, favKey)) && void 0 !== _c ? _c : "";
                        loadingTextSpinner.visible = false;
                        if (!string.isNullOrWhitespace(favKey)) {
                            favButton.setAttribute("key", favKey);
                            isFav = true;
                            favButton.setAttribute("isFav", isFav.toString());
                            favButton.textContent = "+Fav";
                        } else {
                            favButton.textContent = "x";
                            setTimeout(() => favButton.textContent = "-Fav", 1e3);
                        }
                    }
                    this.favRequestRunning = false;
                } else {
                    favButton.textContent = "x";
                }
            });
        }
        static addEmbeddedEventForAllFigures() {
            return __awaiter(this, void 0, void 0, function*() {
                var _a;
                const nonEmbeddedFigures = null !== (_a = document.querySelectorAll("figure:not([embedded])")) && void 0 !== _a ? _a : [];
                for (const figure of Array.from(nonEmbeddedFigures)) {
                    figure.setAttribute("embedded", "true");
                    figure.addEventListener("click", event => {
                        if (event instanceof MouseEvent && event.target instanceof HTMLElement) {
                            if (!event.ctrlKey && !event.target.id.includes("favbutton") && "checkbox" !== event.target.getAttribute("type")) {
                                if (!string.isNullOrWhitespace(event.target.getAttribute("href"))) {
                                    return;
                                }
                                event.preventDefault();
                                if (!EmbeddedImage.embeddedExists && figure instanceof HTMLElement) {
                                    new EmbeddedImage(figure);
                                }
                            }
                        }
                    });
                }
            });
        }
    }
    const customSettings = new window.FACustomSettings("Furaffinity Features Settings", "FA Embedded Image Viewer Settings");
    const openInNewTabSetting = customSettings.newSetting(window.FASettingType.Boolean, "Open in new Tab");
    openInNewTabSetting.description = "Wether to open links in a new Tab or the current one.";
    openInNewTabSetting.defaultValue = true;
    const loadingSpinSpeedFavSetting = customSettings.newSetting(window.FASettingType.Number, "Fav Loading Animation");
    loadingSpinSpeedFavSetting.description = "The duration that the loading animation, for faving a submission, takes for a full rotation in milliseconds.";
    loadingSpinSpeedFavSetting.defaultValue = 600;
    const loadingSpinSpeedSetting = customSettings.newSetting(window.FASettingType.Number, "Embedded Loading Animation");
    loadingSpinSpeedSetting.description = "The duration that the loading animation of the Embedded element to load takes for a full rotation in milliseconds.";
    loadingSpinSpeedSetting.defaultValue = 1e3;
    const closeEmbedAfterOpenSetting = customSettings.newSetting(window.FASettingType.Boolean, "Close Embed after open");
    closeEmbedAfterOpenSetting.description = "Wether to close the current embedded Submission after it is opened in a new Tab (also for open Gallery).";
    closeEmbedAfterOpenSetting.defaultValue = true;
    const previewQualitySetting = customSettings.newSetting(window.FASettingType.Option, "Preview Quality");
    previewQualitySetting.description = "The quality of the preview image. Value range is 2-6. (Higher values can be slower)";
    previewQualitySetting.defaultValue = 400;
    previewQualitySetting.options = {
        200: "Very Low",
        300: "Low",
        400: "Medium",
        500: "High",
        600: "Very High"
    };
    const showWatchingInfoSetting = customSettings.newSetting(window.FASettingType.Boolean, "Show Watching Info");
    showWatchingInfoSetting.description = "Wether to show if the user is watching the Submissions Author.";
    showWatchingInfoSetting.defaultValue = false;
    customSettings.loadSettings();
    const requestHelper = new window.FARequestHelper(2);
    if (customSettings.isFeatureEnabled) {
        const matchList = new window.FAMatchList(customSettings);
        matchList.matches = [ "net/browse", "net/user", "net/gallery", "net/search", "net/favorites", "net/scraps", "net/controls/favorites", "net/controls/submissions", "net/msg/submissions", "d.furaffinity.net" ];
        matchList.runInIFrame = true;
        if (matchList.hasMatch) {
            const page = new window.FACustomPage("d.furaffinity.net", "eiv-download");
            let pageDownload = false;
            page.addEventListener("onOpen", () => {
                !function downloadImage() {
                    let url = window.location.toString();
                    if (url.includes("?")) {
                        const parts = url.split("?");
                        url = parts[0];
                    }
                    const download = document.createElement("a");
                    download.href = url;
                    download.download = url.substring(url.lastIndexOf("/") + 1);
                    download.style.display = "none";
                    document.body.appendChild(download);
                    download.click();
                    document.body.removeChild(download);
                    window.close();
                }();
                pageDownload = true;
            });
            page.checkPageOpened();
            if (!pageDownload && !matchList.isWindowIFrame) {
                EmbeddedImage.addEmbeddedEventForAllFigures();
                window.addEventListener("ei-update-embedded", () => {
                    EmbeddedImage.addEmbeddedEventForAllFigures();
                });
            }
        }
    }
})();