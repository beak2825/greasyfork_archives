// ==UserScript==
// @name        Furaffinity-Message-Box
// @namespace   Violentmonkey Scripts
// @require     https://update.greasyfork.org/scripts/525666/1549449/Furaffinity-Prototype-Extensions.js
// @grant       GM_info
// @version     1.0.1
// @author      Midori Dragon
// @description Library to hold MessageBox functions for Furaffinity
// @icon        https://www.furaffinity.net/themes/beta/img/banners/fa_logo.png
// @license     MIT
// @homepageURL https://greasyfork.org/scripts/528997-furaffinity-message-box
// @supportURL  https://greasyfork.org/scripts/528997-furaffinity-message-box/feedback
// ==/UserScript==
// jshint esversion: 8
(() => {
    "use strict";
    var MessageBoxButtons, MessageBoxIcon, DialogResult, MessageBoxThemes, __webpack_modules__ = {
        978: (module, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.d(__webpack_exports__, {
                A: () => __WEBPACK_DEFAULT_EXPORT__
            });
            var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601), _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__), _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314), ___CSS_LOADER_EXPORT___ = __webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
            ___CSS_LOADER_EXPORT___.push([ module.id, '/* Base styles */\n.message-box-overlay {\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    background-color: rgba(0, 0, 0, 0.5);\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    z-index: 9999;\n}\n\n/* Dark theme (default) */\n.message-box-container {\n    border: 1px solid #444;\n    border-radius: 5px;\n    padding: 20px;\n    max-width: 500px;\n    width: 100%;\n    font-family: Arial, sans-serif;\n    transition: background-color 0.3s, color 0.3s, border-color 0.3s, box-shadow 0.3s;\n}\n\n.message-box-header {\n    display: flex;\n    align-items: center;\n    margin-bottom: 15px;\n}\n\n.message-box-icon-container {\n    margin-right: 15px;\n    width: 32px;\n    height: 32px;\n    flex-shrink: 0;\n}\n\n.message-box-title {\n    font-size: 18px;\n    font-weight: bold;\n    margin: 0;\n    transition: color 0.3s;\n}\n\n.message-box-content {\n    margin-bottom: 20px;\n    line-height: 1.5;\n    transition: color 0.3s;\n}\n\n.message-box-button-container {\n    display: flex;\n    justify-content: flex-end;\n    gap: 10px;\n}\n\n.message-box-button {\n    padding: 8px 16px;\n    border: none;\n    border-radius: 4px;\n    cursor: pointer;\n    font-size: 14px;\n    font-weight: bold;\n    background-color: #f1efeb;\n    transition: background-color 0.2s, color 0.2s, border-color 0.2s;\n}\n\n.message-box-button:hover {\n    background-color: #e0ded8;\n}\n\n/* Theme: Dark */\nbody[class*="theme-dark"] .message-box-container {\n    background-color: #353b45;\n    border-color: #444;\n    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);\n}\n\nbody[class*="theme-dark"] .message-box-button {\n    background-color: #434b5b;\n}\n\nbody[class*="theme-dark"] .message-box-button:hover {\n    background-color: #576175;\n}\n\n/* Theme: Aurora */\nbody[class*="theme-aurora"] .message-box-container {\n    background-color: #262931;\n    border-color: #444;\n    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);\n}\n\nbody[class*="theme-aurora"] .message-box-button {\n    background-color: #65707c;\n}\n\nbody[class*="theme-aurora"] .message-box-button:hover {\n    background-color: #8692a0;\n}\n\n/* Theme: Retro */\nbody[class*="theme-retro"] .message-box-container {\n    background-color: #2e3b41;\n    border-color: #444;\n    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);\n}\n\nbody[class*="theme-retro"] .message-box-button {\n    background-color: #4c585e;\n}\n\nbody[class*="theme-retro"] .message-box-button:hover {\n    background-color: #7b909a;\n}\n\n/* Theme: Slate */\nbody[class*="theme-slate"] .message-box-container {\n    background-color: #202225;\n    border-color: #444;\n    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);\n}\n\nbody[class*="theme-slate"] .message-box-button {\n    background-color: #8c8c8c;\n}\n\nbody[class*="theme-slate"] .message-box-button:hover {\n    background-color: #b3b1b1;\n}\n\n/* Theme: Light - already defined in base styles */\nbody[class*="theme-light"] .message-box-container {\n    background-color: #f7f7f7;\n    border-color: #ccc;\n    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);\n}\n\nbody[class*="theme-light"] .message-box-button {\n    background-color: #f1efeb;\n}\n\nbody[class*="theme-light"] .message-box-button:hover {\n    background-color: #f1ede7;\n}\n', "" ]);
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
    !function(MessageBoxButtons) {
        MessageBoxButtons[MessageBoxButtons.OK = 0] = "OK";
        MessageBoxButtons[MessageBoxButtons.OKCancel = 1] = "OKCancel";
        MessageBoxButtons[MessageBoxButtons.AbortRetryIgnore = 2] = "AbortRetryIgnore";
        MessageBoxButtons[MessageBoxButtons.YesNoCancel = 3] = "YesNoCancel";
        MessageBoxButtons[MessageBoxButtons.YesNo = 4] = "YesNo";
        MessageBoxButtons[MessageBoxButtons.RetryCancel = 5] = "RetryCancel";
    }(MessageBoxButtons || (MessageBoxButtons = {}));
    !function(MessageBoxIcon) {
        MessageBoxIcon[MessageBoxIcon.None = 0] = "None";
        MessageBoxIcon[MessageBoxIcon.Error = 16] = "Error";
        MessageBoxIcon[MessageBoxIcon.Warning = 48] = "Warning";
        MessageBoxIcon[MessageBoxIcon.Information = 64] = "Information";
        MessageBoxIcon[MessageBoxIcon.Question = 32] = "Question";
    }(MessageBoxIcon || (MessageBoxIcon = {}));
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
    !function(MessageBoxThemes) {
        MessageBoxThemes.Dark = "dark";
        MessageBoxThemes.Aurora = "aurora";
        MessageBoxThemes.Retro = "retro";
        MessageBoxThemes.Slate = "slate";
        MessageBoxThemes.Light = "light";
    }(MessageBoxThemes || (MessageBoxThemes = {}));
    var injectStylesIntoStyleTag = __webpack_require__(72), injectStylesIntoStyleTag_default = __webpack_require__.n(injectStylesIntoStyleTag), styleDomAPI = __webpack_require__(825), styleDomAPI_default = __webpack_require__.n(styleDomAPI), insertBySelector = __webpack_require__(659), insertBySelector_default = __webpack_require__.n(insertBySelector), setAttributesWithoutAttributes = __webpack_require__(56), setAttributesWithoutAttributes_default = __webpack_require__.n(setAttributesWithoutAttributes), insertStyleElement = __webpack_require__(540), insertStyleElement_default = __webpack_require__.n(insertStyleElement), styleTagTransform = __webpack_require__(113), styleTagTransform_default = __webpack_require__.n(styleTagTransform), Style = __webpack_require__(978), options = {};
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
    var _a, _b, _c, __awaiter = function(thisArg, _arguments, P, generator) {
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
    class MessageBox {
        static getTheme() {
            return this.currentTheme;
        }
        static show(text_1) {
            return __awaiter(this, arguments, void 0, (function*(text, caption = "", buttons = MessageBoxButtons.OK, icon = MessageBoxIcon.None) {
                return new Promise((resolve => {
                    this.resolvePromise = resolve;
                    this.createMessageBox(text, caption, buttons, icon);
                }));
            }));
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
            if (0 !== header.children.length) this.container.appendChild(header);
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
            button.addEventListener("click", (() => {
                this.close(result);
            }));
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
    Object.defineProperties(window, {
        FAMessageBox: {
            get: () => MessageBox
        },
        FAMessageBoxButtons: {
            get: () => MessageBoxButtons
        },
        FAMessageBoxIcon: {
            get: () => MessageBoxIcon
        },
        FADialogResult: {
            get: () => DialogResult
        }
    });
    let themeClassName = "dark";
    const themeStylesheets = null !== (_a = document.head.querySelectorAll('link[rel="stylesheet"][href]')) && void 0 !== _a ? _a : [];
    for (const themeStylesheet of Array.from(themeStylesheets)) {
        const themePath = null !== (_c = null === (_b = themeStylesheet.getAttribute("href")) || void 0 === _b ? void 0 : _b.toLowerCase()) && void 0 !== _c ? _c : "";
        if (themePath.includes("dark")) themeClassName = "dark"; else if (themePath.includes("aurora")) themeClassName = "aurora"; else if (themePath.includes("retro")) themeClassName = "retro"; else if (themePath.includes("slate")) themeClassName = "slate"; else if (themePath.includes("light")) themeClassName = "light";
    }
    document.body.classList.add(`theme-${themeClassName}`);
})();