// ==UserScript==
// @name        FA Webcomic Auto Loader
// @namespace   Violentmonkey Scripts
// @match       *://*.furaffinity.net/*
// @require     https://update.greasyfork.org/scripts/525666/1549449/Furaffinity-Prototype-Extensions.js
// @require     https://update.greasyfork.org/scripts/483952/1672922/Furaffinity-Request-Helper.js
// @require     https://update.greasyfork.org/scripts/485827/1549457/Furaffinity-Match-List.js
// @require     https://update.greasyfork.org/scripts/485153/1549461/Furaffinity-Loading-Animations.js
// @require     https://update.greasyfork.org/scripts/475041/1617223/Furaffinity-Custom-Settings.js
// @grant       GM_info
// @version     2.2.8
// @author      Midori Dragon
// @description Gives you the option to load all the subsequent comic pages on a FurAffinity comic page automatically. Even for pages without given Links
// @icon        https://www.furaffinity.net/themes/beta/img/banners/fa_logo.png
// @license     MIT
// @homepageURL https://greasyfork.org/scripts/457759-fa-webcomic-auto-loader
// @supportURL  https://greasyfork.org/scripts/457759-fa-webcomic-auto-loader/feedback
// @downloadURL https://update.greasyfork.org/scripts/457759/FA%20Webcomic%20Auto%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/457759/FA%20Webcomic%20Auto%20Loader.meta.js
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
        782: (module, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.d(__webpack_exports__, {
                A: () => __WEBPACK_DEFAULT_EXPORT__
            });
            var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
            var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
            var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
            var ___CSS_LOADER_EXPORT___ = __webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
            ___CSS_LOADER_EXPORT___.push([ module.id, ".wal-lightbox-nav {\n    position: fixed;\n    left: 50%;\n    bottom: 10px;\n    transform: translateX(-50%);\n    opacity: 0.7;\n    transition: opacity 0.2s linear;\n    z-index: 100000000;\n}\n\n.wal-lightbox-nav:hover {\n    opacity: 1;\n}\n\n.wal-no-select {\n    user-select: none;\n    -webkit-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n}", "" ]);
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
        KS: () => backwardSearchSetting,
        hQ: () => customLightboxShowNavSetting,
        _d: () => loadingSpinSpeedSetting,
        WE: () => overwriteNavButtonsSetting,
        uL: () => requestHelper,
        vD: () => scriptName,
        iT: () => useCustomLightboxSetting
    });
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
    function getDocViewSid(doc) {
        let ogUrl = doc.querySelector('meta[property="og:url"]').getAttribute("content");
        if (null == ogUrl) {
            return -1;
        }
        ogUrl = ogUrl.trimEnd("/");
        return parseInt(ogUrl.split("/").pop());
    }
    const string = class {
        static isNullOrWhitespace(str) {
            return null == str || "" === str.trim();
        }
        static isNullOrEmpty(str) {
            return null == str || "" === str;
        }
    };
    class ComicNavigation {
        constructor(prevId, firstId, nextId) {
            this.prevId = -1;
            this.firstId = -1;
            this.nextId = -1;
            this.prevId = prevId;
            this.firstId = firstId;
            this.nextId = nextId;
        }
        static fromElement(elem) {
            var _a;
            const comicNav = new ComicNavigation(-1, -1, -1);
            const navElems = elem.querySelectorAll('a[href*="view"]');
            if (null == navElems || 0 === navElems.length) {
                return null;
            }
            for (const navElem of Array.from(navElems)) {
                const navText = null === (_a = null === navElem || void 0 === navElem ? void 0 : navElem.textContent) || void 0 === _a ? void 0 : _a.toLowerCase();
                if (string.isNullOrWhitespace(navText)) {
                    continue;
                }
                let idText = navElem.getAttribute("href");
                if (string.isNullOrWhitespace(idText)) {
                    continue;
                }
                const i = idText.search(/[?#]/);
                idText = -1 === i ? idText : idText.slice(0, i);
                idText = idText.trimEnd("/");
                idText = idText.split("/").pop();
                if (navText.includes("prev")) {
                    comicNav.prevId = parseInt(idText);
                } else if (navText.includes("next")) {
                    comicNav.nextId = parseInt(idText);
                } else if (navText.includes("start") || navText.includes("first")) {
                    comicNav.firstId = parseInt(idText);
                }
            }
            return comicNav;
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
    class AutoLoaderSearch {
        constructor(rootImg, rootSid, comicNav) {
            this.currImgIndex = 1;
            this.currSid = -1;
            this.rootImg = rootImg;
            this.rootSid = rootSid;
            this.currComicNav = comicNav;
        }
        search() {
            return __awaiter(this, void 0, void 0, function*() {
                var _a;
                const loadedImgs = {};
                loadedImgs[this.rootSid] = this.rootImg;
                Logger.logInfo(`${scriptName}: starting search...`);
                do {
                    try {
                        if (null == this.currComicNav) {
                            break;
                        }
                        const img = yield this.getPage(this.currComicNav.nextId);
                        if (null == img) {
                            break;
                        }
                        if (this.currSid in loadedImgs) {
                            break;
                        }
                        Logger.logInfo(`${scriptName}: found image with sid '${this.currSid}'`);
                        loadedImgs[this.currSid] = img;
                        this.currImgIndex++;
                    } catch (error) {
                        Logger.logError(error);
                        break;
                    }
                } while (-1 !== (null === (_a = this.currComicNav) || void 0 === _a ? void 0 : _a.nextId));
                Logger.logInfo(`${scriptName}: finished search. Found ${Object.keys(loadedImgs).length} images.`);
                return loadedImgs;
            });
        }
        getPage(sid) {
            return __awaiter(this, void 0, void 0, function*() {
                var _a;
                if (sid <= 0) {
                    return;
                }
                const page = yield requestHelper.SubmissionRequests.getSubmissionPage(sid);
                const img = page.getElementById("submissionImg");
                img.setAttribute("wal-index", this.currImgIndex.toString());
                img.setAttribute("wal-sid", sid.toString());
                this.currSid = getDocViewSid(page);
                const descriptionElem = null === (_a = page.getElementById("columnpage")) || void 0 === _a ? void 0 : _a.querySelector('div[class*="submission-description"]');
                if (null != descriptionElem) {
                    this.currComicNav = ComicNavigation.fromElement(descriptionElem);
                } else {
                    this.currComicNav = null;
                }
                return img;
            });
        }
    }
    function isSubmissionPageInGallery(doc) {
        const columnPage = doc.getElementById("columnpage");
        const favNav = null === columnPage || void 0 === columnPage ? void 0 : columnPage.querySelector('div[class*="favorite-nav"]');
        const mainGalleryButton = null === favNav || void 0 === favNav ? void 0 : favNav.querySelector('a[title*="submissions"]');
        if (null != mainGalleryButton && mainGalleryButton.href.includes("gallery")) {
            return true;
        } else {
            return false;
        }
    }
    function isSubmissionPageInScraps(doc) {
        const columnPage = doc.getElementById("columnpage");
        const favNav = null === columnPage || void 0 === columnPage ? void 0 : columnPage.querySelector('div[class*="favorite-nav"]');
        const mainGalleryButton = null === favNav || void 0 === favNav ? void 0 : favNav.querySelector('a[title*="submissions"]');
        if (null != mainGalleryButton && mainGalleryButton.href.includes("scraps")) {
            return true;
        } else {
            return false;
        }
    }
    function getCurrGalleryFolder() {
        const url = window.location.toString().toLowerCase();
        if (!url.includes("gallery") || !url.includes("folder")) {
            return;
        }
        const parts = url.split("/");
        const folderIdIndex = parts.indexOf("folder") + 1;
        if (folderIdIndex >= parts.length) {
            return;
        }
        const folderId = parts[folderIdIndex];
        return parseInt(folderId);
    }
    function generalizeString(inputString, textToNumbers, removeCommonPhrases, removeSpecialChars, removeNumbers, removeSpaces, removeRoman) {
        let outputString = inputString.toLowerCase();
        if (removeCommonPhrases) {
            const commonPhrases = [ "page", "part", "book", "episode" ];
            outputString = outputString.replace(new RegExp(`(?:^|\\s)(${commonPhrases.join("|")})(?:\\s|$)`, "g"), "");
        }
        if (removeRoman) {
            const roman = [ "i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi", "xii", "xiii", "xiv", "xv", "xvi", "xvii", "xviii", "xix", "xx" ];
            outputString = outputString.replace(new RegExp(`(?:^|[^a-zA-Z])(${roman.join("|")})(?:[^a-zA-Z]|$)`, "g"), "");
        }
        if (textToNumbers) {
            const numbers = {
                zero: 0,
                one: 1,
                two: 2,
                three: 3,
                four: 4,
                five: 5,
                six: 6,
                seven: 7,
                eight: 8,
                nine: 9,
                ten: 10,
                eleven: 11,
                twelve: 12,
                thirteen: 13,
                fourteen: 14,
                fifteen: 15,
                sixteen: 16,
                seventeen: 17,
                eighteen: 18,
                nineteen: 19,
                twenty: 20,
                thirty: 30,
                forty: 40,
                fifty: 50,
                sixty: 60,
                seventy: 70,
                eighty: 80,
                ninety: 90,
                hundred: 100
            };
            outputString = outputString.replace(new RegExp(Object.keys(numbers).join("|"), "gi"), match => numbers[match.toLowerCase()].toString());
        }
        if (removeSpecialChars) {
            outputString = outputString.replace(/[^a-zA-Z0-9 ]/g, "");
        }
        if (removeNumbers) {
            outputString = outputString.replace(/[^a-zA-Z ]/g, "");
        }
        if (removeSpaces) {
            outputString = outputString.replace(/\s/g, "");
        }
        return outputString;
    }
    function figureTitleIsGenerallyEqual(figure, title) {
        const figCaption = figure.querySelector("figcaption");
        const titleElem = null === figCaption || void 0 === figCaption ? void 0 : figCaption.querySelector('a[href*="view"]');
        if (null != titleElem) {
            const figTitleGeneralized = generalizeString(titleElem.title.toLowerCase(), true, true, true, true, true, true);
            const currTitleGeneralized = generalizeString(title, true, true, true, true, true, true);
            if (string.isNullOrWhitespace(figTitleGeneralized) || string.isNullOrWhitespace(currTitleGeneralized)) {
                return false;
            } else {
                return figTitleGeneralized.includes(currTitleGeneralized) || currTitleGeneralized.includes(figTitleGeneralized);
            }
        }
        return false;
    }
    function getDocUsername(doc) {
        const columnPage = doc.getElementById("columnpage");
        const submissionIdContainer = null === columnPage || void 0 === columnPage ? void 0 : columnPage.querySelector('div[class*="submission-id-container"]');
        const usernameContainer = null === submissionIdContainer || void 0 === submissionIdContainer ? void 0 : submissionIdContainer.querySelector('a[href*="user"]');
        if (null != usernameContainer) {
            let username = usernameContainer.href;
            username = username.trimEnd("/");
            username = username.split("/").pop();
            return username;
        }
    }
    var BackwardSearch_awaiter = function(thisArg, _arguments, P, generator) {
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
    class BackwardSearch {
        constructor(currSid, amount, currSubmissionPageNo) {
            this.sidToIgnore = [];
            this._currSid = currSid;
            this._amount = amount;
            this.currSubmissionPageNo = currSubmissionPageNo;
            this.sidToIgnore.push(currSid);
        }
        search() {
            return BackwardSearch_awaiter(this, void 0, void 0, function*() {
                var _a, _b;
                const isInGallery = isSubmissionPageInGallery(document);
                const isInScraps = isSubmissionPageInScraps(document);
                if (!isInGallery && !isInScraps) {
                    return {};
                }
                const columnpage = document.getElementById("columnpage");
                const submissionIdContainer = null === columnpage || void 0 === columnpage ? void 0 : columnpage.querySelector('div[class*="submission-id-container"]');
                const submissionTitle = null === submissionIdContainer || void 0 === submissionIdContainer ? void 0 : submissionIdContainer.querySelector('div[class*="submission-title"]');
                const currTitle = null === (_b = null === (_a = null === submissionTitle || void 0 === submissionTitle ? void 0 : submissionTitle.querySelector("h2")) || void 0 === _a ? void 0 : _a.querySelector("p")) || void 0 === _b ? void 0 : _b.textContent;
                if (string.isNullOrWhitespace(currTitle)) {
                    return {};
                }
                const currUsername = getDocUsername(document);
                const folderId = getCurrGalleryFolder();
                Logger.logInfo(`${scriptName}: finding submission page...`);
                if (null == this.currSubmissionPageNo || this.currSubmissionPageNo < 1) {
                    if (isInGallery) {
                        this.currSubmissionPageNo = yield requestHelper.UserRequests.GalleryRequests.Gallery.getSubmissionPageNo(currUsername, this._currSid, folderId, -1, -1);
                    } else if (isInScraps) {
                        this.currSubmissionPageNo = yield requestHelper.UserRequests.GalleryRequests.Scraps.getSubmissionPageNo(currUsername, this._currSid, -1, -1);
                    }
                }
                Logger.logInfo(`${scriptName}: found submission on page '${this.currSubmissionPageNo}'`);
                Logger.logInfo(`${scriptName}: searching figures backward...`);
                let figures = [];
                if (isInGallery) {
                    figures = yield requestHelper.UserRequests.GalleryRequests.Gallery.getFiguresInFolderBetweenPages(currUsername, folderId, this.currSubmissionPageNo, this.currSubmissionPageNo + this._amount);
                } else if (isInScraps) {
                    figures = yield requestHelper.UserRequests.GalleryRequests.Scraps.getFiguresBetweenPages(currUsername, this.currSubmissionPageNo, this.currSubmissionPageNo + this._amount);
                }
                let figuresFlattend = figures.flat();
                figuresFlattend = figuresFlattend.filter(figure => !this.sidToIgnore.includes(parseInt(figure.id.trimStart("sid-"))));
                figuresFlattend = figuresFlattend.filter(figure => figureTitleIsGenerallyEqual(figure, currTitle));
                figuresFlattend.reverse();
                Logger.logInfo(`${scriptName}: searching figures backward found '${figuresFlattend.length}' figures`);
                Logger.logInfo(`${scriptName}: loading submission pages...`);
                const result = {};
                for (let i = 0; i < figuresFlattend.length; i++) {
                    const figureSid = figuresFlattend[i].id.trimStart("sid-");
                    const subDoc = yield requestHelper.SubmissionRequests.getSubmissionPage(parseInt(figureSid));
                    const img = null === subDoc || void 0 === subDoc ? void 0 : subDoc.getElementById("submissionImg");
                    if (null != img) {
                        img.setAttribute("wal-index", (-(figuresFlattend.length - i)).toString());
                        img.setAttribute("wal-sid", figureSid);
                        result[parseInt(figureSid)] = img;
                        Logger.logInfo(`${scriptName}: loaded submission '${figureSid}' with index '${(-(figuresFlattend.length - i)).toString()}'`);
                    }
                }
                return result;
            });
        }
    }
    var ForwardSearch_awaiter = function(thisArg, _arguments, P, generator) {
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
    class ForwardSearch {
        constructor(currSid, currSubmissionPageNo) {
            this.sidToIgnore = [];
            this._currSid = currSid;
            this.currSubmissionPageNo = currSubmissionPageNo;
            this.sidToIgnore.push(currSid);
        }
        search() {
            return ForwardSearch_awaiter(this, void 0, void 0, function*() {
                var _a, _b;
                const isInGallery = isSubmissionPageInGallery(document);
                const isInScraps = isSubmissionPageInScraps(document);
                if (!isInGallery && !isInScraps) {
                    return {};
                }
                const columnpage = document.getElementById("columnpage");
                const submissionIdContainer = null === columnpage || void 0 === columnpage ? void 0 : columnpage.querySelector('div[class*="submission-id-container"]');
                const submissionTitle = null === submissionIdContainer || void 0 === submissionIdContainer ? void 0 : submissionIdContainer.querySelector('div[class*="submission-title"]');
                const currTitle = null === (_b = null === (_a = null === submissionTitle || void 0 === submissionTitle ? void 0 : submissionTitle.querySelector("h2")) || void 0 === _a ? void 0 : _a.querySelector("p")) || void 0 === _b ? void 0 : _b.textContent;
                if (string.isNullOrWhitespace(currTitle)) {
                    return {};
                }
                const currUsername = getDocUsername(document);
                const folderId = getCurrGalleryFolder();
                Logger.logInfo(`${scriptName}: finding submission page...`);
                if (null == this.currSubmissionPageNo || this.currSubmissionPageNo < 1) {
                    if (isInGallery) {
                        this.currSubmissionPageNo = yield requestHelper.UserRequests.GalleryRequests.Gallery.getSubmissionPageNo(currUsername, this._currSid, folderId, -1, -1);
                    } else if (isInScraps) {
                        this.currSubmissionPageNo = yield requestHelper.UserRequests.GalleryRequests.Scraps.getSubmissionPageNo(currUsername, this._currSid, -1, -1);
                    }
                }
                Logger.logInfo(`${scriptName}: found submission on page '${this.currSubmissionPageNo}'`);
                Logger.logInfo(`${scriptName}: searching figures forward...`);
                let figures = [];
                if (isInGallery) {
                    figures = yield requestHelper.UserRequests.GalleryRequests.Gallery.getFiguresInFolderBetweenIds(currUsername, folderId, void 0, this._currSid);
                } else if (isInScraps) {
                    figures = yield requestHelper.UserRequests.GalleryRequests.Scraps.getFiguresBetweenIds(currUsername, void 0, this._currSid);
                }
                let figuresFlattend = figures.flat();
                figuresFlattend = figuresFlattend.filter(figure => !this.sidToIgnore.includes(parseInt(figure.id.trimStart("sid-"))));
                figuresFlattend = figuresFlattend.filter(figure => figureTitleIsGenerallyEqual(figure, currTitle));
                figuresFlattend.reverse();
                Logger.logInfo(`${scriptName}: searching figures forward found '${figuresFlattend.length}' figures`);
                Logger.logInfo(`${scriptName}: loading submission pages...`);
                const result = {};
                for (let i = 0; i < figuresFlattend.length; i++) {
                    const figureSid = figuresFlattend[i].id.trimStart("sid-");
                    const subDoc = yield requestHelper.SubmissionRequests.getSubmissionPage(parseInt(figureSid));
                    const img = null === subDoc || void 0 === subDoc ? void 0 : subDoc.getElementById("submissionImg");
                    if (null != img) {
                        img.setAttribute("wal-index", (i + 1).toString());
                        img.setAttribute("wal-sid", figureSid);
                        result[parseInt(figureSid)] = img;
                        Logger.logInfo(`${scriptName}: loaded submission '${figureSid}' with index '${(i + 1).toString()}'`);
                    }
                }
                return result;
            });
        }
    }
    class LightboxHTML {
        static get html() {
            return '\n<div class="viewer-container viewer-backdrop viewer-fixed viewer-fade viewer-in hidden" tabindex="-1" touch-action="none"\n    id="viewer0" style="z-index: 999999900;" role="dialog" aria-labelledby="viewerTitle0" aria-modal="true">\n    <div class="viewer-canvas" data-viewer-action="hide">\n    </div>\n</div>';
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
    var LightboxStyle = __webpack_require__(782);
    var options = {};
    options.styleTagTransform = styleTagTransform_default();
    options.setAttributes = setAttributesWithoutAttributes_default();
    options.insert = insertBySelector_default().bind(null, "head");
    options.domAPI = styleDomAPI_default();
    options.insertStyleElement = insertStyleElement_default();
    injectStylesIntoStyleTag_default()(LightboxStyle.A, options);
    LightboxStyle.A && LightboxStyle.A.locals && LightboxStyle.A.locals;
    class Lightbox {
        constructor(orgSid, imgs) {
            this.currWalIndex = 0;
            this._imgCount = -1;
            this.initializeViewerCanvas();
            this._lightboxContainer = document.body.querySelector('div[class*="viewer-canvas"]');
            this._imgCount = Object.keys(imgs).length;
            const orgImgClone = document.getElementById("columnpage").querySelector(`img[wal-sid="${orgSid}"]`).readdToDom();
            imgs[orgSid] = orgImgClone;
            this.prepareOrgLightbox();
            this.addSubmissionToLightbox(imgs);
            if (customLightboxShowNavSetting.value) {
                this._lightboxNavContainer = this.createNavigationButtons();
                this._lightboxContainer.insertAfterThis(this._lightboxNavContainer);
            }
            this._boundHandleArrowKeys = this.handleArrowKeys.bind(this);
        }
        get isHidden() {
            var _a, _b;
            return null !== (_b = null === (_a = this._lightboxContainer.parentElement) || void 0 === _a ? void 0 : _a.classList.contains("hidden")) && void 0 !== _b ? _b : false;
        }
        set isHidden(value) {
            var _a, _b, _c, _d, _e;
            if (this.isHidden !== value) {
                if (value) {
                    window.removeEventListener("keydown", this._boundHandleArrowKeys);
                    null === (_a = this._lightboxContainer.parentElement) || void 0 === _a || _a.classList.add("hidden");
                    null === (_b = this._lightboxNavContainer) || void 0 === _b || _b.classList.add("hidden");
                    for (const child of Array.from(this._lightboxContainer.children)) {
                        child.classList.add("hidden");
                    }
                } else {
                    window.addEventListener("keydown", this._boundHandleArrowKeys);
                    null === (_c = this._lightboxContainer.children[this.currWalIndex]) || void 0 === _c || _c.classList.remove("hidden");
                    null === (_d = this._lightboxContainer.parentElement) || void 0 === _d || _d.classList.remove("hidden");
                    null === (_e = this._lightboxNavContainer) || void 0 === _e || _e.classList.remove("hidden");
                }
            }
        }
        navigateLeft() {
            if (this.currWalIndex > 0) {
                Logger.logInfo(`${scriptName}: navigating left '${this.currWalIndex} -> ${this.currWalIndex - 1}'`);
                const currImg = this._lightboxContainer.children[this.currWalIndex];
                const prevImg = this._lightboxContainer.children[this.currWalIndex - 1];
                if (null != currImg && null != prevImg) {
                    currImg.classList.add("hidden");
                    prevImg.classList.remove("hidden");
                }
                this.currWalIndex--;
            }
        }
        navigateRight() {
            if (this.currWalIndex + 1 < this._imgCount) {
                Logger.logInfo(`${scriptName}: navigating right '${this.currWalIndex} -> ${this.currWalIndex + 1}'`);
                const currImg = this._lightboxContainer.children[this.currWalIndex];
                const nextImg = this._lightboxContainer.children[this.currWalIndex + 1];
                if (null != currImg && null != nextImg) {
                    currImg.classList.add("hidden");
                    nextImg.classList.remove("hidden");
                }
                this.currWalIndex++;
            }
        }
        handleArrowKeys(event) {
            switch (event.key) {
              case "ArrowLeft":
              case "ArrowUp":
                this.navigateLeft();
                break;

              case "ArrowRight":
              case "ArrowDown":
                this.navigateRight();
            }
            event.preventDefault();
        }
        getIndexOfClickedImage(img) {
            let clickedWalIndex = img.getAttribute("wal-index");
            if (!string.isNullOrWhitespace(clickedWalIndex)) {
                this.currWalIndex = parseInt(clickedWalIndex);
                const clickedImg = this._lightboxContainer.querySelector(`img[wal-index="${this.currWalIndex}"]`);
                return null === clickedImg || void 0 === clickedImg ? void 0 : clickedImg.getIndexOfThis();
            }
        }
        prepareOrgLightbox() {
            this._lightboxContainer.innerHTML = "";
            this._lightboxContainer = this._lightboxContainer.readdToDom();
            this._lightboxContainer.addEventListener("click", () => {
                this.isHidden = true;
            });
        }
        addSubmissionToLightbox(imgs) {
            const sortedImages = Object.values(imgs).sort((a, b) => {
                var _a, _b;
                return parseInt(null !== (_a = a.getAttribute("wal-index")) && void 0 !== _a ? _a : "0") - parseInt(null !== (_b = b.getAttribute("wal-index")) && void 0 !== _b ? _b : "0");
            });
            for (const img of sortedImages) {
                img.addEventListener("click", () => {
                    var _a;
                    this.currWalIndex = null !== (_a = this.getIndexOfClickedImage(img)) && void 0 !== _a ? _a : 0;
                    this.isHidden = false;
                });
                const clone = img.cloneNode(false);
                clone.classList.add("hidden");
                clone.style.height = "100%";
                clone.style.width = "100%";
                clone.style.objectFit = "contain";
                this._lightboxContainer.appendChild(clone);
            }
        }
        createNavigationButtons() {
            const container = document.createElement("div");
            container.classList.add("wal-lightbox-nav", "hidden", "wal-no-select");
            const leftButton = document.createElement("a");
            leftButton.classList.add("button", "standard", "mobile-fix");
            leftButton.textContent = "<---";
            leftButton.style.marginRight = "4px";
            leftButton.addEventListener("click", this.navigateLeft.bind(this));
            container.appendChild(leftButton);
            const closeButton = document.createElement("a");
            closeButton.classList.add("button", "standard", "mobile-fix");
            closeButton.textContent = "Close";
            closeButton.addEventListener("click", () => {
                this.isHidden = true;
            });
            container.appendChild(closeButton);
            const rightButton = document.createElement("a");
            rightButton.classList.add("button", "standard", "mobile-fix");
            rightButton.textContent = "---\x3e";
            rightButton.style.marginLeft = "4px";
            rightButton.addEventListener("click", this.navigateRight.bind(this));
            container.appendChild(rightButton);
            return container;
        }
        initializeViewerCanvas() {
            if (!document.body.querySelector('div[class*="viewer-canvas"]')) {
                const viewerTemp = document.createElement("div");
                viewerTemp.innerHTML = LightboxHTML.html;
                const viewerContainer = viewerTemp.firstElementChild;
                document.body.appendChild(viewerContainer);
                Logger.logInfo(`${scriptName}: Created viewer canvas structure in hidden state`);
            }
        }
    }
    var AutoLoader_awaiter = function(thisArg, _arguments, P, generator) {
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
    class AutoLoader {
        constructor() {
            var _a;
            this.currComicNav = null;
            this.currSid = -1;
            this._comicNavExists = false;
            this.currSid = getDocViewSid(document);
            this.submissionImg = document.getElementById("submissionImg");
            this.submissionImg.setAttribute("wal-index", "0");
            this.submissionImg.setAttribute("wal-sid", this.currSid.toString());
            this._searchButton = document.createElement("a");
            this._searchButton.id = "wal-search-button";
            this._searchButton.classList.add("wal-button", "button", "standard", "mobile-fix");
            this._searchButton.type = "button";
            this._searchButton.style.margin = "20px 0 10px 0";
            this.submissionImg.parentNode.appendChild(document.createElement("br"));
            this.submissionImg.parentNode.appendChild(this._searchButton);
            const descriptionElem = null === (_a = document.getElementById("columnpage")) || void 0 === _a ? void 0 : _a.querySelector('div[class*="submission-description"]');
            if (null != descriptionElem) {
                this.currComicNav = ComicNavigation.fromElement(descriptionElem);
                if (null != this.currComicNav) {
                    if (-1 !== this.currComicNav.prevId || -1 !== this.currComicNav.firstId || -1 !== this.currComicNav.nextId) {
                        this._comicNavExists = true;
                        if (overwriteNavButtonsSetting.value) {
                            this.overwriteNavButtons();
                        }
                    }
                }
            }
            this.updateSearchButton(this.comicNavExists);
            const loadingSpinnerContainer = document.createElement("div");
            loadingSpinnerContainer.classList.add("wal-loading-spinner");
            loadingSpinnerContainer.style.margin = "20px 0 20px 0";
            this._loadingSpinner = new window.FALoadingSpinner(loadingSpinnerContainer);
            this._loadingSpinner.delay = loadingSpinSpeedSetting.value;
            this._loadingSpinner.spinnerThickness = 6;
            this.submissionImg.parentNode.appendChild(loadingSpinnerContainer);
        }
        get comicNavExists() {
            return this._comicNavExists;
        }
        set comicNavExists(value) {
            if (value !== this.comicNavExists) {
                this._comicNavExists = value;
                this.updateSearchButton(value);
            }
        }
        startAutoloader() {
            this.startAutoLoaderAsync();
        }
        startAutoLoaderAsync() {
            return AutoLoader_awaiter(this, void 0, void 0, function*() {
                this._loadingSpinner.visible = true;
                const autoLoader = new AutoLoaderSearch(this.submissionImg, this.currSid, this.currComicNav);
                const submissions = yield autoLoader.search();
                const submissionIds = Object.keys(submissions).map(Number);
                if (0 === submissionIds.length || 1 === submissionIds.length && submissionIds[0] === this.currSid) {
                    this.comicNavExists = false;
                } else {
                    this.addLoadedSubmissions(submissions);
                    if (useCustomLightboxSetting.value) {
                        new Lightbox(this.currSid, submissions);
                    }
                }
                this._loadingSpinner.visible = false;
            });
        }
        startSimilarSearch() {
            this.startSimilarSearchAsync();
        }
        startSimilarSearchAsync() {
            return AutoLoader_awaiter(this, void 0, void 0, function*() {
                this._loadingSpinner.visible = true;
                const forwardSearch = new ForwardSearch(this.currSid);
                const submissionsAfter = yield forwardSearch.search();
                const backwardSearch = new BackwardSearch(this.currSid, backwardSearchSetting.value, forwardSearch.currSubmissionPageNo);
                backwardSearch.sidToIgnore.push(...Object.keys(submissionsAfter).map(Number));
                const submissionsBefore = yield backwardSearch.search();
                this.addLoadedSubmissions(submissionsBefore, submissionsAfter);
                if (useCustomLightboxSetting.value) {
                    new Lightbox(this.currSid, Object.assign(Object.assign({}, submissionsBefore), submissionsAfter));
                }
                this._loadingSpinner.visible = false;
            });
        }
        addLoadedSubmissions(...imgsArr) {
            const columnpage = document.getElementById("columnpage");
            for (const imgs of imgsArr) {
                Logger.logInfo(`${scriptName}: adding '${Object.keys(imgs).length}' submissions...`);
                let prevSid = this.currSid;
                for (const sid of Object.keys(imgs).map(Number)) {
                    if (imgs[sid].getAttribute("wal-sid") === this.currSid.toString()) {
                        continue;
                    }
                    const lastImg = columnpage.querySelector(`img[wal-sid="${prevSid}"]`);
                    const lastIndex = parseInt(lastImg.getAttribute("wal-index"));
                    if (parseInt(imgs[sid].getAttribute("wal-index")) < lastIndex) {
                        lastImg.insertBeforeThis(imgs[sid]);
                        imgs[sid].insertAfterThis(document.createElement("br"));
                        imgs[sid].insertAfterThis(document.createElement("br"));
                        checkTags(imgs[sid]);
                        Logger.logInfo(`${scriptName}: added submission ${sid} before submission ${prevSid}`);
                    } else {
                        lastImg.insertAfterThis(imgs[sid]);
                        imgs[sid].insertBeforeThis(document.createElement("br"));
                        imgs[sid].insertBeforeThis(document.createElement("br"));
                        checkTags(imgs[sid]);
                        Logger.logInfo(`${scriptName}: added submission ${sid} after submission ${prevSid}`);
                    }
                    prevSid = sid;
                }
            }
        }
        overwriteNavButtons() {
            var _a, _b, _c, _d, _e, _f;
            if (!this.comicNavExists) {
                return;
            }
            const columnpage = document.getElementById("columnpage");
            const favoriteNav = null === columnpage || void 0 === columnpage ? void 0 : columnpage.querySelector('div[class*="favorite-nav"]');
            let prevButton = null === favoriteNav || void 0 === favoriteNav ? void 0 : favoriteNav.children[0];
            if (null != prevButton && -1 !== this.currComicNav.prevId) {
                if (null !== (_c = null === (_b = null === (_a = prevButton.textContent) || void 0 === _a ? void 0 : _a.toLowerCase()) || void 0 === _b ? void 0 : _b.includes("prev")) && void 0 !== _c ? _c : false) {
                    prevButton.href = `/view/${this.currComicNav.prevId}/`;
                } else {
                    const prevButtonReal = document.createElement("a");
                    prevButtonReal.href = `/view/${this.currComicNav.prevId}/`;
                    prevButtonReal.classList.add("button", "standard", "mobile-fix");
                    prevButtonReal.textContent = "Prev";
                    prevButtonReal.style.marginRight = "4px";
                    prevButton.insertBeforeThis(prevButtonReal);
                }
            }
            let nextButton = null === favoriteNav || void 0 === favoriteNav ? void 0 : favoriteNav.children[favoriteNav.children.length - 1];
            if (null != nextButton && -1 !== this.currComicNav.nextId) {
                if (null !== (_f = null === (_e = null === (_d = nextButton.textContent) || void 0 === _d ? void 0 : _d.toLowerCase()) || void 0 === _e ? void 0 : _e.includes("next")) && void 0 !== _f ? _f : false) {
                    nextButton.href = `/view/${this.currComicNav.nextId}/`;
                } else {
                    const nextButtonReal = document.createElement("a");
                    nextButtonReal.href = `/view/${this.currComicNav.nextId}/`;
                    nextButtonReal.classList.add("button", "standard", "mobile-fix");
                    nextButtonReal.textContent = "Next";
                    nextButtonReal.style.marginLeft = "4px";
                    nextButton.insertAfterThis(nextButtonReal);
                }
            }
        }
        updateSearchButton(showAutoLoader) {
            this._searchButton.style.display = "inline-block";
            this._searchButton.textContent = showAutoLoader ? "Auto load Pages" : "Search for similar Pages";
            if (showAutoLoader) {
                this._searchButton.onclick = () => {
                    this.startAutoloader();
                    this._searchButton.style.display = "none";
                };
            } else {
                this._searchButton.onclick = () => {
                    this.startSimilarSearch();
                    this._searchButton.style.display = "none";
                };
            }
        }
    }
    const scriptName = "FA Webcomic Auto Loader";
    const customSettings = new window.FACustomSettings("Furaffinity Features Settings", `${scriptName} Settings`);
    const showSearchButtonSetting = customSettings.newSetting(window.FASettingType.Boolean, "Similar Search Button");
    showSearchButtonSetting.description = "Sets wether the search for similar Pages button is show.";
    showSearchButtonSetting.defaultValue = true;
    const loadingSpinSpeedSetting = customSettings.newSetting(window.FASettingType.Number, "Loading Animation");
    loadingSpinSpeedSetting.description = "Sets the duration that the loading animation takes for a full rotation in milliseconds.";
    loadingSpinSpeedSetting.defaultValue = 1e3;
    const backwardSearchSetting = customSettings.newSetting(window.FASettingType.Number, "Backward Search Amount");
    backwardSearchSetting.description = "Sets the amount of similar pages to search backward. (More Pages take longer)";
    backwardSearchSetting.defaultValue = 3;
    const overwriteNavButtonsSetting = customSettings.newSetting(window.FASettingType.Boolean, "Overwrite Nav Buttons");
    overwriteNavButtonsSetting.description = "Sets wether the default Navigation Buttons (next/prev) are overwritten by the Auto-Loader. (Works only if comic navigation is present)";
    overwriteNavButtonsSetting.defaultValue = true;
    const useCustomLightboxSetting = customSettings.newSetting(window.FASettingType.Boolean, "Use Custom Lightbox");
    useCustomLightboxSetting.description = "Sets wether the default Lightbox (fullscreen view) is overwritten by the Auto-Loader.";
    useCustomLightboxSetting.defaultValue = true;
    const customLightboxShowNavSetting = customSettings.newSetting(window.FASettingType.Boolean, "Custom Lightbox Show Nav");
    customLightboxShowNavSetting.description = "Sets wether the Lightbox Navigation (next/prev) is shown in the Custom Lightbox.";
    customLightboxShowNavSetting.defaultValue = true;
    customSettings.loadSettings();
    const requestHelper = new window.FARequestHelper(2);
    if (customSettings.isFeatureEnabled) {
        const matchList = new window.FAMatchList(customSettings);
        matchList.matches = [ "net/view" ];
        matchList.runInIFrame = false;
        if (matchList.hasMatch) {
            new AutoLoader;
        }
    }
})();