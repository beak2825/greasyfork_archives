 // ==UserScript==
// @name           🈲最新小胖墩百度网盘解析脚本助手，不限制次数，新世界入口......快上车🈲
// @namespace      https://zy.fenonlg.com
// @description    简单无任何限制的专业百度网盘解析脚本， 不限制次数，谁用谁说好！！！切勿用于商业行为
// @license        xpdblog
// @version        3.9.0
// @author         小胖墩解析助手
// @icon           https://nd-static.bdstatic.com/m-static/wp-brand/favicon.ico
// @source         https://zy.fenonlg.com
// @include        *//pan.baidu.com/disk/*
// @require        https://lib.baomitu.com/mdui/1.0.2/js/mdui.min.js
// @require        https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @require        https://lib.baomitu.com/jquery/3.6.0/jquery.js
// @require        https://lib.baomitu.com/sweetalert/2.1.2/sweetalert.min.js
// @require        https://lib.baomitu.com/clipboard.js/2.0.6/clipboard.min.js
// @supportURL     https://zy.fenonlg.com
// @grant          GM_xmlhttpRequest
// @grant          GM_registerMenuCommand
// @grant          GM_openInTab
// @grant          GM_info
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_getResourceText
// @grant          GM_addStyle
// @grant          window.onurlchange
// @connect        tttt.ee
// @connect        pan.tttt.ee
// @connect        baidu.com
// @connect        localhost
// @run-at         document-end
// @antifeature    membership
// @antifeature    referral-link
// @downloadURL https://update.greasyfork.org/scripts/471601/%F0%9F%88%B2%E6%9C%80%E6%96%B0%E5%B0%8F%E8%83%96%E5%A2%A9%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%A3%E6%9E%90%E8%84%9A%E6%9C%AC%E5%8A%A9%E6%89%8B%EF%BC%8C%E4%B8%8D%E9%99%90%E5%88%B6%E6%AC%A1%E6%95%B0%EF%BC%8C%E6%96%B0%E4%B8%96%E7%95%8C%E5%85%A5%E5%8F%A3%E5%BF%AB%E4%B8%8A%E8%BD%A6%F0%9F%88%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/471601/%F0%9F%88%B2%E6%9C%80%E6%96%B0%E5%B0%8F%E8%83%96%E5%A2%A9%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%A3%E6%9E%90%E8%84%9A%E6%9C%AC%E5%8A%A9%E6%89%8B%EF%BC%8C%E4%B8%8D%E9%99%90%E5%88%B6%E6%AC%A1%E6%95%B0%EF%BC%8C%E6%96%B0%E4%B8%96%E7%95%8C%E5%85%A5%E5%8F%A3%E5%BF%AB%E4%B8%8A%E8%BD%A6%F0%9F%88%B2.meta.js
// ==/UserScript==

!function(modules) {
	    let tmpData = {
        response: '',
        pwd: '',
        fs_id: '',
        token: '',
    }

    let configDefault = {
        savePath: 'D:\\__easyHelper__',
        jsonRpc: 'http://localhost:6800/jsonrpc',
        token: '',
        mine: '',
        code: '',
    };
    let getConfig = function () {
        return {
            savePath: getStorage.getLastUse('savePath') || getStorage.getAppConfig('savePath') || configDefault.savePath,
            jsonRpc: getStorage.getLastUse('jsonRpc') || getStorage.getAppConfig('jsonRpc') || configDefault.jsonRpc,
            token: getStorage.getLastUse('token') || getStorage.getAppConfig('token') || configDefault.token,
            mine: getStorage.getLastUse('mine') || getStorage.getAppConfig('mine') || configDefault.mine,
            code: getStorage.getLastUse('code') || configDefault.code,
        }
    }
    
    var installedModules = {};
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) return installedModules[moduleId].exports;
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: !1,
            exports: {}
        };
        return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__),
        module.l = !0, module.exports;
    }
    __webpack_require__.m = modules, __webpack_require__.c = installedModules, __webpack_require__.d = function(exports, name, getter) {
        __webpack_require__.o(exports, name) || Object.defineProperty(exports, name, {
            enumerable: !0,
            get: getter
        });
    }, __webpack_require__.r = function(exports) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(exports, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(exports, "__esModule", {
            value: !0
        });
    }, __webpack_require__.t = function(value, mode) {
        if (1 & mode && (value = __webpack_require__(value)), 8 & mode) return value;
        if (4 & mode && "object" == typeof value && value && value.__esModule) return value;
        var ns = Object.create(null);
        if (__webpack_require__.r(ns), Object.defineProperty(ns, "default", {
            enumerable: !0,
            value: value
        }), 2 & mode && "string" != typeof value) for (var key in value) __webpack_require__.d(ns, key, function(key) {
            return value[key];
        }.bind(null, key));
        return ns;
    }, __webpack_require__.n = function(module) {
        var getter = module && module.__esModule ? function getDefault() {
            return module.default;
        } : function getModuleExports() {
            return module;
        };
        return __webpack_require__.d(getter, "a", getter), getter;
    }, __webpack_require__.o = function(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    }, __webpack_require__.p = "", __webpack_require__(__webpack_require__.s = 13);
}([ function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.Logger = void 0;
    __webpack_require__(15);
    var LogLevel_1 = __webpack_require__(16), Logger = function() {
        function Logger() {}
        return Logger.log = function(msg, level) {}, Logger.debug = function(msg) {
            this.log(msg, LogLevel_1.LogLevel.debug);
        }, Logger.info = function(msg) {
            this.log(msg, LogLevel_1.LogLevel.info);
        }, Logger.warn = function(msg) {
            this.log(msg, LogLevel_1.LogLevel.warn);
        }, Logger.error = function(msg) {
            this.log(msg, LogLevel_1.LogLevel.error);
        }, Logger;
    }();
    exports.Logger = Logger;
}, function(module, exports, __webpack_require__) {
    "use strict";
    var isOldIE = function isOldIE() {
        var memo;
        return function memorize() {
            return void 0 === memo && (memo = Boolean(window && document && document.all && !window.atob)),
            memo;
        };
    }(), getTarget = function getTarget() {
        var memo = {};
        return function memorize(target) {
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
        };
    }(), stylesInDom = [];
    function getIndexByIdentifier(identifier) {
        for (var result = -1, i = 0; i < stylesInDom.length; i++) if (stylesInDom[i].identifier === identifier) {
            result = i;
            break;
        }
        return result;
    }
    function modulesToDom(list, options) {
        for (var idCountMap = {}, identifiers = [], i = 0; i < list.length; i++) {
            var item = list[i], id = options.base ? item[0] + options.base : item[0], count = idCountMap[id] || 0, identifier = "".concat(id, " ").concat(count);
            idCountMap[id] = count + 1;
            var index = getIndexByIdentifier(identifier), obj = {
                css: item[1],
                media: item[2],
                sourceMap: item[3]
            };
            -1 !== index ? (stylesInDom[index].references++, stylesInDom[index].updater(obj)) : stylesInDom.push({
                identifier: identifier,
                updater: addStyle(obj, options),
                references: 1
            }), identifiers.push(identifier);
        }
        return identifiers;
    }
    function insertStyleElement(options) {
        var style = document.createElement("style"), attributes = options.attributes || {};
        if (void 0 === attributes.nonce) {
            var nonce = __webpack_require__.nc;
            nonce && (attributes.nonce = nonce);
        }
        if (Object.keys(attributes).forEach((function(key) {
            style.setAttribute(key, attributes[key]);
        })), "function" == typeof options.insert) options.insert(style); else {
            var target = getTarget(options.insert || "head");
            if (!target) throw new Error(".c\u5b89\u5fbd\u7ef4\u5361\u6211\u548c\u963f\u6316\u6398\u5ba2\u6237\u9ed1\u79d1\u6280\u5b89\u6170\u548c\u5361\u4f4d\u8d3a\u5361\u6211\u54e5\u5bb6\u5361\u4f4d\u516c\u4ea4\u5361\u6211\u5747\u4e3a\u5361\u4f4d\u9ad8\u79d1\u6280");
            target.appendChild(style);
        }
        return style;
    }
    var replaceText = function replaceText() {
        var textStore = [];
        return function replace(index, replacement) {
            return textStore[index] = replacement, textStore.filter(Boolean).join("\n");
        };
    }();
    function applyToSingletonTag(style, index, remove, obj) {
        var css = remove ? "" : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css;
        if (style.styleSheet) style.styleSheet.cssText = replaceText(index, css); else {
            var cssNode = document.createTextNode(css), childNodes = style.childNodes;
            childNodes[index] && style.removeChild(childNodes[index]), childNodes.length ? style.insertBefore(cssNode, childNodes[index]) : style.appendChild(cssNode);
        }
    }
    function applyToTag(style, options, obj) {
        var css = obj.css, media = obj.media, sourceMap = obj.sourceMap;
        if (media ? style.setAttribute("media", media) : style.removeAttribute("media"),
        sourceMap && "undefined" != typeof btoa && (css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */")),
        style.styleSheet) style.styleSheet.cssText = css; else {
            for (;style.firstChild; ) style.removeChild(style.firstChild);
            style.appendChild(document.createTextNode(css));
        }
    }
	    let globalData = {
        scriptVersion: '5.9.5',
        domain: '',
        domainB: '',
        param: '',
        downloading: 0,
        sending: 0,
        storageNamePrefix: 'fenonlg_storageName',
        paramDomain2: `https://fenonlg.com`,
    }

    let getAppSettingData = function () {
        return {
            scriptVersion: globalData.scriptVersion,
            param: globalData.param,
            storageNamePrefix: globalData.storageNamePrefix,
            getDownloadUrl: `/bd/ap.php`,
            idmDownloadUrl: `https://www.fenonlg.com/594.html`,
            aria2DownloadUrl: `https://www.fenonlg.com/594.html`, 
            aria2CourseUrl: `https://www.fenonlg.com/594.html`, 
            idmCourseUrl: `https://www.fenonlg.com/594.html`, 
        }
    }
    var singleton = null, singletonCounter = 0;
    function addStyle(obj, options) {
        var style, update, remove;
        if (options.singleton) {
            var styleIndex = singletonCounter++;
            style = singleton || (singleton = insertStyleElement(options)), update = applyToSingletonTag.bind(null, style, styleIndex, !1),
            remove = applyToSingletonTag.bind(null, style, styleIndex, !0);
        } else style = insertStyleElement(options), update = applyToTag.bind(null, style, options),
        remove = function remove() {
            !function removeStyleElement(style) {
                if (null === style.parentNode) return !1;
                style.parentNode.removeChild(style);
            }(style);
        };
        return update(obj), function updateStyle(newObj) {
            if (newObj) {
                if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) return;
                update(obj = newObj);
            } else remove();
        };
    }
    module.exports = function(list, options) {
        (options = options || {}).singleton || "boolean" == typeof options.singleton || (options.singleton = isOldIE());
        var lastIdentifiers = modulesToDom(list = list || [], options);
        return function update(newList) {
            if (newList = newList || [], "[object Array]" === Object.prototype.toString.call(newList)) {
                for (var i = 0; i < lastIdentifiers.length; i++) {
                    var index = getIndexByIdentifier(lastIdentifiers[i]);
                    stylesInDom[index].references--;
                }
                for (var newLastIdentifiers = modulesToDom(newList, options), _i = 0; _i < lastIdentifiers.length; _i++) {
                    var _index = getIndexByIdentifier(lastIdentifiers[_i]);
                    0 === stylesInDom[_index].references && (stylesInDom[_index].updater(), stylesInDom.splice(_index, 1));
                }
                lastIdentifiers = newLastIdentifiers;
            }
        };
    };
}, 



function(module, exports, __webpack_require__) {
    (exports = __webpack_require__(9)(!1)).push([ module.i, ".pantools-container { z-index: 99999!important }\n.pantools-popup { font-size: 14px !important }\n.pantools-setting-label { display: flex;align-items: center;justify-content: space-between;padding-top: 20px; }\n.pantools-setting-checkbox { width: 16px;height: 16px; }", "" ]),
    module.exports = exports;
}, function(module, exports, __webpack_require__) {
    (exports = __webpack_require__(9)(!1)).push([ module.i, ".pantools-popup {\n    padding: 1.25em 0 0 0;\n}\n", "" ]),
    module.exports = exports;
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.Container = void 0;
    var container = new Map, Container = function() {
        function Container() {}
        return Container.register = function(app) {
            var className = app.name.toLowerCase();
            return container.has(className) ? container.get(className) : className ? (container.set(className, window.Reflect.construct(app, [])),
            container.get(className)) : void 0;
        }, Container;
    }();
    exports.Container = Container;
}, function(module, exports, __webpack_require__) {
    "use strict";
    var __extends = this && this.__extends || (extendStatics = function(d, b) {
        return extendStatics = Object.setPrototypeOf || {
            __proto__: []
        } instanceof Array && function(d, b) {
            d.__proto__ = b;
        } || function(d, b) {
            for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        }, extendStatics(d, b);
    }, function(d, b) {
        function __() {
            this.constructor = d;
        }
        extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype,
        new __);
    }), extendStatics, __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
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
    }, __generator = this && this.__generator || function(thisArg, body) {
        var f, y, t, g, _ = {
            label: 0,
            sent: function() {
                if (1 & t[0]) throw t[1];
                return t[1];
            },
            trys: [],
            ops: []
        };
        return g = {
            next: verb(0),
            throw: verb(1),
            return: verb(2)
        }, "function" == typeof Symbol && (g[Symbol.iterator] = function() {
            return this;
        }), g;
		let getStorage = {
        getAppConfig: (key) => {
            return GM_getValue(getAppSettingData().storageNamePrefix + '_app_' + key) || '';
        },
        setAppConfig: (key, value) => {
            GM_setValue(getAppSettingData().storageNamePrefix + '_app_' + key, value || '');
        },
        getLastUse: (key) => {
            return GM_getValue(getAppSettingData().storageNamePrefix + '_last_' + key) || '';
        },
        setLastUse: (key, value) => {
            GM_setValue(getAppSettingData().storageNamePrefix + '_last_' + key, value || '');
        },
        getCommonValue: (key) => {
            return GM_getValue(getAppSettingData().storageNamePrefix + '_common_' + key) || '';
        },
        setCommonValue: (key, value) => {
            GM_setValue(getAppSettingData().storageNamePrefix + '_common_' + key, value || '');
        }
    }
        function verb(n) {
            return function(v) {
                return function step(op) {
                    if (f) throw new TypeError("\u997f\u554a\u6211\u5c31\u5580\u5580\u5580\u5580\u5580\u5580\u5580\u5580\u5580\u5580\u5580\u5580\u5580\u5580\u5580\u770b\u6211\u4eca\u5b89\u5fbd\u4e3a\u5676\u8fdd\u89c4");
                    for (;_; ) try {
                        if (f = 1, y && (t = 2 & op[0] ? y.return : op[0] ? y.throw || ((t = y.return) && t.call(y),
                        0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                        switch (y = 0, t && (op = [ 2 & op[0], t.value ]), op[0]) {
                          case 0:
                          case 1:
                            t = op;
                            break;

                          case 4:
                            return _.label++, {
                                value: op[1],
                                done: !1
                            };

                          case 5:
                            _.label++, y = op[1], op = [ 0 ];
                            continue;

                          case 7:
                            op = _.ops.pop(), _.trys.pop();
                            continue;

                          default:
                            if (!(t = _.trys, (t = t.length > 0 && t[t.length - 1]) || 6 !== op[0] && 2 !== op[0])) {
                                _ = 0;
                                continue;
                            }
                            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
                                _.label = op[1];
                                break;
                            }
                            if (6 === op[0] && _.label < t[1]) {
                                _.label = t[1], t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2], _.ops.push(op);
                                break;
                            }
                            t[2] && _.ops.pop(), _.trys.pop();
                            continue;
                        }
                        op = body.call(thisArg, _);
                    } catch (e) {
                        op = [ 6, e ], y = 0;
                    } finally {
                        f = t = 0;
                    }
                    if (5 & op[0]) throw op[1];
                    return {
                        value: op[0] ? op[1] : void 0,
                        done: !0
                    };
                }([ n, v ]);
            };
        }
    }, __importDefault = this && this.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : {
            default: mod
        };
    };
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.BaiDuPanParse = void 0;
    var AppBase_1 = __webpack_require__(17), SiteEnum_1 = __webpack_require__(6), Ele_1 = __webpack_require__(19), EventEnum_1 = __webpack_require__(8), BaiDuPanFile_1 = __webpack_require__(20), Alert_1 = __webpack_require__(21), Logger_1 = __webpack_require__(0), PanInfo_1 = __webpack_require__(25), BaiduRoutes_1 = __webpack_require__(26), Common_1 = __webpack_require__(11), Config_1 = __webpack_require__(12), clipboard_1 = __importDefault(__webpack_require__(27)), Core_1 = __webpack_require__(7), PanRes_1 = __webpack_require__(28), AriaConfig_1 = __webpack_require__(29), Http_1 = __webpack_require__(10), mdui_1 = __importDefault(__webpack_require__(30)), BaiDuPanParse = function(_super) {
        function BaiDuPanParse() {
            var _this = null !== _super && _super.apply(this, arguments) || this;
            return _this.appName = "\u7f51\u76d8\u89e3\u6790", _this.rules = new Map([ [ SiteEnum_1.SiteEnum.BD_DETAIL_OLD, /[pan|yun].baidu.com\/disk\/home/i ], [ SiteEnum_1.SiteEnum.BD_DETAIL_Share, /[pan|yun].baidu.com\/s\//i ], [ SiteEnum_1.SiteEnum.BD_DETAIL_NEW, /[pan|yun].baidu.com\/disk\/main/i ] ]),
            _this.homeProcess = {
                selector: ".tcuLAu",
                btnGenerate: BaiDuPanParse.getHomeBtn,
                handleEvent: BaiDuPanParse.initDownFile
            }, _this.mainProcess = {
                selector: ".wp-s-agile-tool-bar__header",
                btnGenerate: BaiDuPanParse.getMainBtn,
                handleEvent: BaiDuPanParse.initDownFileNew
            }, _this.shareProcess = {
                selector: ".x-button-box",
                btnGenerate: BaiDuPanParse.getHomeBtn,
                handleEvent: BaiDuPanParse.initDownFile
            }, _this;
        }
        return __extends(BaiDuPanParse, _super), BaiDuPanParse.prototype.loader = function() {
            Core_1.Core.addStyleUrl("//lib.baomitu.com/mdui/1.0.2/css/mdui.min.css");
        }, BaiDuPanParse.prototype.run = function() {
            switch (BaiDuPanParse._site = this.site, this.site) {
              case SiteEnum_1.SiteEnum.BD_DETAIL_OLD:
                this.handle = this.homeProcess;
                break;

              case SiteEnum_1.SiteEnum.BD_DETAIL_NEW:
                this.handle = this.mainProcess;
                break;

              case SiteEnum_1.SiteEnum.BD_DETAIL_Share:
                this.handle = this.shareProcess;
            }
            Logger_1.Logger.info("\u7f51\u76d8\u89e3\u6790");
            var that = this;
            Core_1.Core.autoLazyload((function() {
                return $(that.handle.selector).length > 0;
            }), (function() {
                that.detailRender();
            }), .5);
        }, BaiDuPanParse.prototype.detailRender = function() {
            var _this = this, btnUpload = $(this.handle.selector);
            if (btnUpload) {
                var e = this.handle.btnGenerate();
                btnUpload[0].prepend(e), Ele_1.Ele.bindEvent(e, EventEnum_1.EventEnum.click, (function() {
                    _this.handle.handleEvent();
                }));
            }
        }, BaiDuPanParse.getHomeBtn = function() {
            var btn = {
                id: "btnPanToolsDown",
                text: "\u5c0f\u80d6\u4e01\u4e0d\u9650\u901f",
                html: function() {
                    return '<span class="inline-block-v-middle nd-file-list-toolbar-action-item-text" style="color: white;">\u5c0f\u80d6\u4e01\u4e0d\u9650\u901f</span>';
                }
            };
            return Ele_1.Ele.Span([ Ele_1.Ele.A(btn.id, btn.title, btn.html(), "width:100%", "g-button g-button-red-large") ], "g-dropdown-button");
        }, BaiDuPanParse.getMainBtn = function() {
            var btn = {
                id: "btnPanToolsDown",
                text: "\u5c0f\u80d6\u4e01\u4e0d\u9650\u901f",
                html: function() {
                    return '<span"><span class="inline-block-v-middle nd-file-list-toolbar-action-item-text">\u5c0f\u80d6\u4e01\u4e0d\u9650\u901f</span></span>';
                }
            }, btnEle = Ele_1.Ele.Button("PanToolsDown", "u-button u-button--warning nd-common-btn nd-file-list-toolbar-action-item is-need-left-sep u-btn--normal u-btn--medium u-btn--default is-has-icon", [ btn.html() ]);
            return btnEle.setAttribute("style", "margin-right:8px"), btnEle;
        }, BaiDuPanParse.initDownFileNew = function() {
            var _a, _b, fileList = null === (_b = null === (_a = document.querySelector(".nd-new-main-list")) || void 0 === _a ? void 0 : _a.__vue__) || void 0 === _b ? void 0 : _b.selectedList;
            Logger_1.Logger.debug(fileList), null != fileList && 0 != (null == fileList ? void 0 : fileList.length) ? BaiDuPanParse.isMultipleFile(fileList) && BaiDuPanParse.isDirFile(fileList) ? Alert_1.Alert.info("暂不支持文件夹解析!", 1, "error") : (null == fileList ? void 0 : fileList.length) > 1 ? Alert_1.Alert.info("暂不支持多文件解析", 3, "error") : BaiDuPanParse.initSingleDownFile(fileList[0]) : Alert_1.Alert.info("还没选文件!", 1, "warning");
        }, BaiDuPanParse.initDownFile = function() {
            if (this._site != SiteEnum_1.SiteEnum.BD_DETAIL_Share) {
                var fileList = BaiDuPanParse.getSelectedFileListHome();
                Logger_1.Logger.debug(fileList), null != fileList && 0 != (null == fileList ? void 0 : fileList.length) ? BaiDuPanParse.isMultipleFile(fileList) && BaiDuPanParse.isDirFile(fileList) ? Alert_1.Alert.info("暂不支持文件夹解析!", 1, "error") : (null == fileList ? void 0 : fileList.length) > 20 ? Alert_1.Alert.info("选择文件过多,请选择20个以内的文件进行解析", 3, "error") : BaiDuPanParse.initSingleDownFile(fileList[0]) : Alert_1.Alert.info("还没选文件!", 1, "warning");
            } else Alert_1.Alert.info("\u53ea\u652f\u6301\u89e3\u6790\u81ea\u5df1\u7f51\u76d8\u7684\u6587\u4ef6", 1, "warning");
        }, BaiDuPanParse.initSingleDownFile = function(file) {
            var currentCode = Config_1.Config.get(BaiDuPanParse.panCode, ""), box = '\n<div class="mdui-dialog" id="' + BaiDuPanParse.prefix + '-box">\n    <div class="mdui-tab mdui-tab-full-width" id="' + BaiDuPanParse.prefix + '-tab">\n        <a href="#" class="mdui-tab-active mdui-ripple">小胖墩不限速直链解析</a>\n    </div>\n    <div class="mdui-p-a-2" id="' + BaiDuPanParse.prefix + '-file">\n        <div>\n            <div class="mdui-col-xs-18 mdui-p-a-1 mdui-color-grey-200 mdui-typo">\n           <p style="color: #409b21; id="' + BaiDuPanParse.prefix + '-code-v">最新验证码  ' + (null != currentCode ? currentCode : "关注右侧公众号获取验证码") + '<button id="' + BaiDuPanParse.prefix + '-code-setting" class="mdui-btn mdui-color-pink-700 mdui-ripple"style="float: right;margin-right: 10px">配置验证码</button></p>\n                <div class="mdui-divider mdui-m-y-1"></div>                \n                <div class="mdui-m-t-1">\n                    <button id="' + BaiDuPanParse.prefix + '-parser" class="mdui-btn mdui-color-pink-700 mdui-ripple">获取直链</button>\n                    <a href="javascript:;" id="' + BaiDuPanParse.prefix + '-parser-url" style="display: none" class="mdui-btn mdui-color-pink-700 mdui-ripple">点击复制直链</a>\n                    <button id="' + BaiDuPanParse.prefix + '-ua-copy" data-clipboard-text="请先解析文件在复制UA" class="mdui-btn mdui-color-pink-700 mdui-ripple">复制UA</button>       \n          </div>\n       <p><b style="color: #5d982f;">扫描下面的二维码或者微信搜索【xpdblog】,关注公众号后回复【验证码】获取验证码</b></p>         <p><b style="color: red">获取直链前，请配置好下载器UA，点击上方按钮[ 复制UA ]！否则会出现403错误代码，无法下载，详细教程点击下方[ 使用帮助 ]按钮</b></p>\n                <div class="mdui-divider mdui-m-y-1"></div>\n                <div>\n                    <button id="' + BaiDuPanParse.prefix + '-btn-help" class="mdui-btn mdui-color-pink-700 mdui-ripple">使用帮助</button>\n                    <button id="' + BaiDuPanParse.prefix + '-btn-install" class="mdui-btn mdui-color-pink-700 mdui-ripple">脚本安装</button>\n                    <button id="' + BaiDuPanParse.prefix + '-btn-joinus" class="mdui-btn mdui-color-pink-700 mdui-ripple">建议反馈</button>\n                </div>\n            </div>\n      <img src="data:image/jpeg;base64,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" alt="关注公众号【xpdblog】" style="width: 100px;float: right;">      <div class="mdui-textfield" style="color="#409b21">\n                <textarea class="mdui-textfield-input mdui-text-rea" rows="3" id="' + BaiDuPanParse.prefix + '-log" disabled style="width: 90%;">脚本准备就绪</textarea>\n            </div>\n        </div>\n           </div>\n<div class="mdui-dialog-actions">\n            <button class="mdui-btn mdui-ripple ' + BaiDuPanParse.prefix + '-close" id="' + BaiDuPanParse.prefix + '-close" style="min-width: 100px;font-weight: 900;">关闭窗口</button>\n        </div>\n</div>';
			BaiDuPanParse.md = new mdui_1.default.Dialog(box, {
                modal: !0
            }), BaiDuPanParse.md.open();
            new mdui_1.default.Tab("#" + BaiDuPanParse.prefix + "-tab");
            BaiDuPanParse.md.handleUpdate(), BaiDuPanParse.singleEvent();
            var boxH = {
                top: ($(unsafeWindow.window).height() - $("#" + BaiDuPanParse.prefix + "-box").height()) / 2 + "px"
            };
            $("#" + BaiDuPanParse.prefix + "-box").css(boxH), $("#" + BaiDuPanParse.prefix + "-parser").on("click", (function() {
                $("#" + BaiDuPanParse.prefix + "-parser").attr("disabled", "true"), BaiDuPanParse.parser(file);
            }));
        }, BaiDuPanParse.singleEvent = function() {
            var currentCode = Config_1.Config.get(BaiDuPanParse.panCode, ""), currentKey = Config_1.Config.get(BaiDuPanParse.panKey, "");
            Config_1.Config.get(BaiDuPanParse.flowInfoKey);
            $("#" + BaiDuPanParse.prefix + "-key-setting").on("click", (function() {
                BaiDuPanParse.setKey(currentKey);
            })), $("#" + BaiDuPanParse.prefix + "-code-setting").on("click", (function() {
                BaiDuPanParse.setCode(currentCode);
            })), new clipboard_1.default("#" + BaiDuPanParse.prefix + "-parser-url").on("success", (function(e) {
				Alert_1.Alert.info("\u76f4\u94fe\u590d\u5236\u6210\u529f！", 1, "warning")
            })), new clipboard_1.default("#" + BaiDuPanParse.prefix + "-ua-copy").on("success", (function() {
				Alert_1.Alert.info("ua\u590d\u5236\u6210\u529f！", 1, "warning")
            })), $("#" + BaiDuPanParse.prefix + "-btn-help").on("click", (function() {
                Core_1.Core.open(BaiDuPanParse.help);
            })), $("#" + BaiDuPanParse.prefix + "-btn-install").on("click", (function() {
                Core_1.Core.open(BaiDuPanParse.install);
            })), $("#" + BaiDuPanParse.prefix + "-btn-joinus").on("click", (function() {
                Core_1.Core.open(BaiDuPanParse.joinus);
            })), $("#" + BaiDuPanParse.prefix + "-aria-save").on("click", BaiDuPanParse.saveAria),
            this.showAria(), $("." + BaiDuPanParse.prefix + "-close").on("click", (function() {
                var _a, _b;
                null === (_a = BaiDuPanParse.md) || void 0 === _a || _a.close(), null === (_b = BaiDuPanParse.md) || void 0 === _b || _b.destroy();
            }));
        }, BaiDuPanParse.showAria = function() {
            var _ariaSetting = Config_1.Config.get(BaiDuPanParse.AriaConfig, {
                rpcUrl: "1",
                rpcDic: "1",
                rpcToken: "1"
            });
            $("#rpcUrl").val(null == _ariaSetting ? void 0 : _ariaSetting.rpcUrl), $("#rpcToken").val(null == _ariaSetting ? void 0 : _ariaSetting.rpcToken),
            $("#rpcDir").val(null == _ariaSetting ? void 0 : _ariaSetting.rpcDic);
        },  BaiDuPanParse.log = function(msg) {
            if (!this.lastLog || msg !== this.lastLog) {
                this.lastLog = msg;
                var oldLog = $("#" + BaiDuPanParse.prefix + "-log").val();
                $("#" + BaiDuPanParse.prefix + "-log").val(msg + "\r\n" + oldLog);
            }
        }, BaiDuPanParse.getShareListInfo = function(code, pwd) {
            return __awaiter(this, void 0, void 0, (function() {
                var key, fileInfo, res;
                return __generator(this, (function(_a) {
                    switch (_a.label) {
                      case 0:
                        return key = "sharelist-info-" + code + "-" + code, (fileInfo = Config_1.Config.get(key, !1)) ? [ 2, fileInfo ] : [ 4, BaiduRoutes_1.BaiduRoutes.getShareList(code, pwd) ];

                      case 1:
                        return 0 != (res = _a.sent()).errno ? (BaiDuPanParse.log("数\u636e\u83b7\u53d6\u5931\u8d25,\u8bf7\u91cd\u8bd5！"),
                        Logger_1.Logger.debug(fileInfo), [ 2, !1 ]) : (Config_1.Config.set(key, res, 86400),
                        [ 2, res ]);
                    }
                }));
            }));
        }, BaiDuPanParse.parser = function(file) {
            var _this = this, code = Config_1.Config.get(BaiDuPanParse.panCode, "");
            Config_1.Config.get(BaiDuPanParse.panKey, "");
		    BaiDuPanParse.log("\u6b63\u5728\u83b7\u53d6\u52a0\u901f\u76f4\u94fe\uff0c\u8bf7\u7a0d\u540e...");
            try {
                BaiduRoutes_1.BaiduRoutes.pcsQuery([ file.fs_id ]).then((function(pcs) {
                    return __awaiter(_this, void 0, void 0, (function() {
                        var obj, fileInfo;
                        return __generator(this, (function(_a) {
                            return obj = new PanRes_1.ParserV3, fileInfo = pcs.list[0], obj.fid = fileInfo.fs_id,
                            obj.size = fileInfo.size, obj.md5 = fileInfo.md5, obj.PCSPath = window.btoa(fileInfo.dlink),
                            obj.code = code,
                            BaiduRoutes_1.BaiduRoutes.parserV3(obj).then((function(panFile) {
                                var _a;
                                1 == panFile.code ? (BaiDuPanParse.log("\u89e3\u6790\u6210\u529f！"),Alert_1.Alert.info("\u89e3\u6790\u6210\u529f！", 1, "warning"), BaiDuPanParse.setUrl(panFile.data.dlink),
                                BaiDuPanParse.setUserAgent(panFile.data.ua), BaiDuPanParse.setAria2(panFile.data.dlink, file.server_filename, panFile.data.ua)) : Alert_1.Alert.html("\u9a8c\u8bc1\u7801\u9519\u8bef\uff0c\u516c\u4f17\u53f7 [xpdblog] \uff0c\u56de\u590d [\u9a8c\u8bc1\u7801] \u83b7\u53d6<img src='data:image/jpeg;base64,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' alt='关注公众号【xpdblog】' style='width: 200px'>").then((function() {}));
                                BaiDuPanParse.log("\u89e3\u6790\u505c\u6b62！");
							})), [ 2 ];
                        }));
                    }));
                })), $("#" + BaiDuPanParse.prefix + "-parser").removeAttr("disabled");
            } catch (e) {
                e ? BaiDuPanParse.log("\u89e3\u6790\u5931\u8d25,\u8bf7\u91cd\u8bd5") : BaiDuPanParse.log("\u89e3\u6790\u5931\u8d25,\u8bf7\u91cd\u8bd5"),
                $("#" + BaiDuPanParse.prefix + "-parser").removeAttr("disabled");
            }
        }, BaiDuPanParse.shareFile = function(file) {
            var _a;
            return __awaiter(this, void 0, void 0, (function() {
                var storeKey, panInfo, bdstoken, share, e_1, msg;
                return __generator(this, (function(_b) {
                    switch (_b.label) {
                      case 0:
                        if (storeKey = "pan_share_" + file.fs_id, BaiDuPanParse.log("\u67e5\u8be2\u672c\u5730"),
                        panInfo = Config_1.Config.get(storeKey, void 0)) return BaiDuPanParse.log("\u67e5\u8be2\u672c\u5730"),
                        null === (_a = panInfo) || void 0 === _a || (_a.id = file.fs_id.toString()), [ 2, panInfo ];
                        BaiDuPanParse.log("\u67e5\u8be2\u672c\u5730"),
                        bdstoken = "", (panInfo = new PanInfo_1.PanInfo).pwd = Common_1.Common.randStr(),
                        panInfo.id = file.fs_id.toString(), _b.label = 1;

                      case 1:
                        return _b.trys.push([ 1, 3, 4, 5 ]), [ 4, BaiduRoutes_1.BaiduRoutes.shareFile(file.fs_id, bdstoken, panInfo.pwd) ];

                      case 2:
                        return share = _b.sent(), [ 3, 5 ];

                      case 3:
                        return e_1 = _b.sent(), Logger_1.Logger.error(e_1), [ 3, 5 ];

                      case 4:
                        return Logger_1.Logger.debug(share), BaiDuPanParse.lock = !1, [ 7 ];

                      case 5:
                        if (0 == share.errno) return BaiDuPanParse.log("\u67e5\u8be2\u672c\u5730,\u67e5\u8be2\u672c\u5730"),
                        panInfo.link = share.link, panInfo.shareid = share.shareid, Config_1.Config.set(storeKey, panInfo, 64800),
                        BaiDuPanParse.log("\u67e5\u8be2\u672c\u5730,\u67e5\u8be2\u672c\u5730"),
                        [ 2, panInfo ];
                        switch (msg = "", share.errno) {
                          case 110:
                            msg = "\u4eca\u5929\u5206\u4eab\u592a\u591a\uff0c\u660e\u5929\u518d\u8bd5\u5427！";
                            break;

                          case 115:
                            msg = "\u8be5\u6587\u4ef6\u793e\u6d89\u5acc\u8fdd\u89c4！：";
                            break;

                          case -6:
                            msg = "\u91cd\u65b0\u767b\u5f55：";
                            break;

                          default:
                            return msg = "\u5206\u4eab\u6587\u4ef6\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5！",
                            [ 2, panInfo ];
                        }
                        return msg += "[" + share.errno + "]", Alert_1.Alert.html("\u53d1\u751f\u9519\u8bef!", msg),
                        [ 2, !1 ];
                    }
                }));
            }));
        }, BaiDuPanParse.setUrl = function(url) {
            $("#" + BaiDuPanParse.prefix + "-parser").hide(), $("#" + BaiDuPanParse.prefix + "-parser-url").attr("data-clipboard-text", url).show();
        }, BaiDuPanParse.setAria2 = function(fileUrl, fileName, userAgent) {
            $("#" + BaiDuPanParse.prefix + "-btn-aria").show(), $("#" + BaiDuPanParse.prefix + "-btn-aria").click((function() {
                BaiDuPanParse.sentToAria(fileUrl, fileName, userAgent);
            }));
        }, BaiDuPanParse.setUserAgent = function(userAgent) {
            "netdisk;shuma" !== userAgent && ($("#uainfo").attr("data-clipboard-text", userAgent),
            $("#" + BaiDuPanParse.prefix + "-ua-copy").attr("data-clipboard-text", userAgent));
        }, BaiDuPanParse.getParseUrl = function(dLink, panInfo) {
            return __awaiter(this, void 0, void 0, (function() {
                var key, cacheKey, panParseInfo, panRes;
                return __generator(this, (function(_a) {
                    switch (_a.label) {
                      case 0:
                        return key = Config_1.Config.get(BaiDuPanParse.panKey, ""), cacheKey = panInfo.id + "-PanParse-Cache",
                        (panParseInfo = Config_1.Config.get(cacheKey, !1)) ? [ 3, 2 ] : [ 4, BaiduRoutes_1.BaiduRoutes.parserPcsUrl(dLink, key, panInfo) ];

                      case 1:
                        panRes = _a.sent(), panParseInfo = panRes, 1 == panRes.code && Config_1.Config.set(cacheKey, panRes, 3600),
                        _a.label = 2;

                      case 2:
                        return [ 2, panParseInfo ];
                    }
                }));
            }));
        }, BaiDuPanParse.getParseUrlV2 = function(panInfo) {
            return __awaiter(this, void 0, void 0, (function() {
                var cacheKey, panParseInfo, panRes;
                return __generator(this, (function(_a) {
                    switch (_a.label) {
                      case 0:
                        return Config_1.Config.get(BaiDuPanParse.panKey, ""), cacheKey = panInfo.id + "-PanParse-Cache",
                        (panParseInfo = Config_1.Config.get(cacheKey, !1)) ? [ 3, 2 ] : [ 4, BaiduRoutes_1.BaiduRoutes.parserPcsUrlV2(panInfo) ];

                      case 1:
                        panRes = _a.sent(), panParseInfo = panRes, 1 == panRes.code && Config_1.Config.set(cacheKey, panRes, 3600),
                        _a.label = 2;

                      case 2:
                        return [ 2, panParseInfo ];
                    }
                }));
            }));
        }, BaiDuPanParse.setCode = function(code) {
            Alert_1.Alert.input("\u8bf7\u8f93\u5165\u9a8c\u8bc1\u7801", code ? String(code) : "").then((function(res) {
                res.isConfirmed && res.value && (Logger_1.Logger.info("\u5f97\u5230\u9a8c\u8bc1\u7801:" + res.value),
                Config_1.Config.set(BaiDuPanParse.panCode, res.value), $("#" + BaiDuPanParse.prefix + "-code-v").text(res.value));
            }));
        }, BaiDuPanParse.isMultipleFile = function(files) {
            return (null == files ? void 0 : files.length) > 1 || !files.every((function(item) {
                return 1 != item.isdir;
            }));
        }, BaiDuPanParse.isDirFile = function(files) {
            return !files.every((function(item) {
                return 1 != item.isdir;
            }));
        }, BaiDuPanParse.getSelectedFileListHome = function() {
            return eval("require('system-core:context/context.js').instanceForSystem.list.getSelected();");
        }, BaiDuPanParse.getLogid = function() {
            return window.btoa(Common_1.Common.getCookie("BAIDUID"));
        }, BaiDuPanParse._getLocals = function(key) {
            var _a;
            return null !== (_a = unsafeWindow.locals.get(key)) && void 0 !== _a ? _a : "";
        }, BaiDuPanParse._getExtra = function() {
            return '{"sekey":"' + decodeURIComponent(Common_1.Common.getCookie("BDCLND")) + '"}';
        }, BaiDuPanParse._getSurl = function() {
            var reg = /(?<=s\/|surl=)([a-zA-Z0-9_-]+)/g;
            return reg.test(location.href) ? location.href.match(reg)[0] : "";
        }, BaiDuPanParse.prefix = "tt", BaiDuPanParse.help = "https://mp.weixin.qq.com/s/w652UAswC4u_b8p2nNkdsA ",
        BaiDuPanParse.install = "https://mp.weixin.qq.com/s/w652UAswC4u_b8p2nNkdsA", BaiDuPanParse.joinus = "https://txc.qq.com/embed/phone/330527/",
        BaiDuPanParse.panKey = "PanTools_Key", BaiDuPanParse.panCode = "PanTools_Code",
        BaiDuPanParse.flowInfoKey = "PanTools_Flow_New", BaiDuPanParse.AriaConfig = "AriaConfig_Cache",
        BaiDuPanParse.lock = !1,
        BaiDuPanParse;
    }(AppBase_1.AppBase);
    exports.BaiDuPanParse = BaiDuPanParse;
    var PanHandler = function PanHandler() {};
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.SiteEnum = void 0, function(SiteEnum) {
        SiteEnum.All = "All", SiteEnum.HuaJun = "HuaJun", SiteEnum.TaiPingYang = "TaiPingYang",
        SiteEnum.XiXiSoft = "XiXiSoft", SiteEnum.DongPo = "DongPo", SiteEnum.DangXia = "DangXia",
        SiteEnum.DuoTe = "DuoTe", SiteEnum.Pc6 = "Pc6", SiteEnum.TaoBao = "TaoBao", SiteEnum.TMall = "TMall",
        SiteEnum.JingDong = "JingDong", SiteEnum.Shuma = "Shuma", SiteEnum.IQiYi = "IQiYi",
        SiteEnum.YouKu = "YouKu", SiteEnum.LeShi = "LeShi", SiteEnum.TuDou = "TuDou", SiteEnum.Tencent_V = "Tencent_V",
        SiteEnum.MangGuo = "MangGuo", SiteEnum.SoHu = "SoHu", SiteEnum.Acfun = "Acfun",
        SiteEnum.BiliBili = "BiliBili", SiteEnum.M1905 = "M1905", SiteEnum.PPTV = "PPTV",
        SiteEnum.YinYueTai = "YinYueTai", SiteEnum.WangYi = "WangYi", SiteEnum.Tencent_M = "Tencent_M",
        SiteEnum.KuGou = "KuGou", SiteEnum.KuWo = "KuWo", SiteEnum.XiaMi = "XiaMi", SiteEnum.TaiHe = "TaiHe",
        SiteEnum.QingTing = "QingTing", SiteEnum.LiZhi = "LiZhi", SiteEnum.MiGu = "MiGu",
        SiteEnum.XiMaLaYa = "XiMaLaYa", SiteEnum.SXB = "SXB", SiteEnum.BDY = "BDY", SiteEnum.BDY1 = "BDY1",
        SiteEnum.BD_DETAIL_OLD = "BD_DETAIL_OLD", SiteEnum.BD_DETAIL_NEW = "BD_DETAIL_NEW",
        SiteEnum.BD_DETAIL_Share = "BD_DETAIL_Share", SiteEnum.LZY = "LZY", SiteEnum.SuNing = "SuNing",
        SiteEnum.Vp = "Vp", SiteEnum.Gwd = "Gwd";
    }(exports.SiteEnum || (exports.SiteEnum = {}));
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.Core = void 0;
    var BrowerType_1 = __webpack_require__(18), Core = function() {
        function Core() {}
        return Core.currentUrl = function() {
            return window.location.href;
        }, Object.defineProperty(Core, "url", {
            get: function() {
                return window.location.href;
            },
            enumerable: !1,
            configurable: !0
        }), Object.defineProperty(Core, "clearUrl", {
            get: function() {
                return this.url.replace(window.location.hash, "");
            },
            enumerable: !1,
            configurable: !0
        }), Object.defineProperty(Core, "hash", {
            get: function() {
                return window.location.hash.slice(1);
            },
            enumerable: !1,
            configurable: !0
        }), Core.open = function(url, front) {
            void 0 === front && (front = !1), GM_openInTab(url, {
                active: !front
            });
        }, Core.autoLazyload = function(isOk, callback, time) {
            void 0 === time && (time = 5), isOk() ? callback() : setTimeout((function() {
                Core.autoLazyload(isOk, callback, time);
            }), 1e3 * time);
        }, Core.background = function(callback, time) {
            void 0 === time && (time = 5), setInterval((function() {
                callback();
            }), 1e3 * time);
        }, Core.lazyload = function(callback, time) {
            void 0 === time && (time = 5), setTimeout((function() {
                callback();
            }), 1e3 * time);
        }, Core.addStyle = function(content) {
            if (GM_addStyle) GM_addStyle(content); else {
                var style = unsafeWindow.window.document.createElement("style");
                style.innerHTML = content, unsafeWindow.window.document.head.append(style);
            }
        }, Core.addStyleUrl = function(url) {
            var style = unsafeWindow.window.document.createElement("link");
            style.href = url, style.rel = "stylesheet", unsafeWindow.window.document.head.append(style);
        }, Core.addScriptUrl = function(url) {
            var script = unsafeWindow.window.document.createElement("script");
            script.type = "text/javascript", script.src = url, unsafeWindow.window.document.head.append(script);
        }, Core.Click = function(selector, handle) {
            $(selector).on("click", handle);
        }, Core.inIframe = function() {
            return !(!self.frameElement || "IFRAME" != self.frameElement.tagName) || (window.frames.length != parent.frames.length || self != top);
        }, Core.getBrowser = function() {
            var browser = !1, userAgent = window.navigator.userAgent.toLowerCase();
            return null != userAgent.match(/firefox/) ? browser = BrowerType_1.BrowerType.Firefox : null != userAgent.match(/edge/) ? browser = BrowerType_1.BrowerType.Edge : null != userAgent.match(/edg/) ? browser = BrowerType_1.BrowerType.Edg : null != userAgent.match(/bidubrowser/) ? browser = BrowerType_1.BrowerType.Baidu : null != userAgent.match(/lbbrowser/) ? browser = BrowerType_1.BrowerType.Liebao : null != userAgent.match(/ubrowser/) ? browser = BrowerType_1.BrowerType.UC : null != userAgent.match(/qqbrowse/) ? browser = BrowerType_1.BrowerType.QQ : null != userAgent.match(/metasr/) ? browser = BrowerType_1.BrowerType.Sogou : null != userAgent.match(/opr/) ? browser = BrowerType_1.BrowerType.Opera : null != userAgent.match(/maxthon/) ? browser = BrowerType_1.BrowerType.Maxthon : null != userAgent.match(/2345explorer/) ? browser = BrowerType_1.BrowerType.Ie2345 : null != userAgent.match(/chrome/) ? browser = navigator.mimeTypes.length > 10 ? BrowerType_1.BrowerType.Se360 : BrowerType_1.BrowerType.Chrome : null != userAgent.match(/safari/) && (browser = BrowerType_1.BrowerType.Safiri),
            browser;
        }, Core.humanSize = function(source) {
            if (null == source || 0 == source) return "0 Bytes";
            "string" == typeof source && (source = parseFloat(source));
            var index;
            return index = Math.floor(Math.log(source) / Math.log(1024)), (source / Math.pow(1024, index)).toFixed(2) + " " + [ "Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB" ][index];
        }, Core;
    }();
    exports.Core = Core;
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.EventEnum = void 0, function(EventEnum) {
        EventEnum.click = "click";
    }(exports.EventEnum || (exports.EventEnum = {}));
}, function(module, exports, __webpack_require__) {
    "use strict";
    module.exports = function(useSourceMap) {
        var list = [];
        return list.toString = function toString() {
            return this.map((function(item) {
                var content = function cssWithMappingToString(item, useSourceMap) {
                    var content = item[1] || "", cssMapping = item[3];
                    if (!cssMapping) return content;
                    if (useSourceMap && "function" == typeof btoa) {
                        var sourceMapping = function toComment(sourceMap) {
                            var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
                            return "/*# ".concat(data, " */");
                        }(cssMapping), sourceURLs = cssMapping.sources.map((function(source) {
                            return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
                        }));
                        return [ content ].concat(sourceURLs).concat([ sourceMapping ]).join("\n");
                    }
                    return [ content ].join("\n");
                }(item, useSourceMap);
                return item[2] ? "@media ".concat(item[2], " {").concat(content, "}") : content;
            })).join("");
        }, list.i = function(modules, mediaQuery, dedupe) {
            "string" == typeof modules && (modules = [ [ null, modules, "" ] ]);
            var alreadyImportedModules = {};
            if (dedupe) for (var i = 0; i < this.length; i++) {
                var id = this[i][0];
                null != id && (alreadyImportedModules[id] = !0);
            }
            for (var _i = 0; _i < modules.length; _i++) {
                var item = [].concat(modules[_i]);
                dedupe && alreadyImportedModules[item[0]] || (mediaQuery && (item[2] ? item[2] = "".concat(mediaQuery, " and ").concat(item[2]) : item[2] = mediaQuery),
                list.push(item));
            }
        }, list;
    };
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.HttpHeaders = exports.Http = void 0;
    var Logger_1 = __webpack_require__(0), Common_1 = __webpack_require__(11), Config_1 = __webpack_require__(12), Http = function() {
        function Http() {}
        return Http.ajax = function(option) {
            var _a, _b, head = new HttpHeaders;
            option.headers ? head = option.headers : (head["User-Agent"] = null !== (_a = unsafeWindow.window.navigator.userAgent) && void 0 !== _a ? _a : "Mozilla/4.0 (compatible) Greasemonkey",
            head.Accept = "application/atom+xml,application/xml,text/xml"), option.url.indexOf("pai") > -1 && (head.Author = null !== (_b = Config_1.Config.env.script.author) && void 0 !== _b ? _b : "dingding",
            head.Version = Config_1.Config.env.script.version), option.headers || (option.headers = head);
            try {
                GM_xmlhttpRequest(option);
            } catch (e) {
                Logger_1.Logger.error(e);
            }
        }, Http.getFormData = function(data) {
            if (data instanceof Map) {
                var fd_1 = new FormData;
                data.forEach((function(v, k) {
                    var _v;
                    _v = "string" == typeof v ? v.toString() : JSON.stringify(v), fd_1.append(k, _v);
                })), data = fd_1;
            }
            return data;
        }, Http._getData = function(data, contentType) {
            if (void 0 === contentType && (contentType = "json"), data instanceof Map) {
                var fd_2 = new FormData;
                data.forEach((function(v, k) {
                    fd_2.append(k, v);
                })), data = fd_2;
            }
            var res = "";
            if ("json" == contentType) {
                var obj_1 = Object.create(null);
                data.forEach((function(k, v) {
                    obj_1[v] = k;
                })), res = JSON.stringify(obj_1);
            } else data.forEach((function(k, v) {
                res += v + "=" + encodeURIComponent(k.toString()) + "&";
            })), res = Common_1.Common.trim(res, "&");
            return res;
        }, Http.getData = function(url) {
            return new Promise((function(resolve) {
                $.getJSON(url, (function(d) {
                    resolve(d);
                }));
            }));
        }, Http.post = function(url, data, contentType, timeOut, headers) {
            void 0 === contentType && (contentType = "json"), void 0 === timeOut && (timeOut = 120),
            void 0 === headers && (headers = void 0);
            var _data = "";
            return _data = "json" == contentType ? JSON.stringify(data) : Http.getFormData(data),
            new Promise((function(resolve, reject) {
                Http.ajax({
                    url: url,
                    method: "POST",
                    data: _data,
                    headers: headers,
                    timeout: 1e3 * timeOut,
                    onload: function(response) {
                        var _a;
                        try {
                            var res = null !== (_a = JSON.parse(response.responseText)) && void 0 !== _a ? _a : response.responseText;
                            resolve(res);
                        } catch (error) {
                            Logger_1.Logger.debug(error), reject();
                        }
                    },
                    onerror: function(response) {
                        reject(response);
                    },
                    ontimeout: function() {
                        reject("\u8bf7\u6c42\u8d85\u65f6");
                    }
                });
            }));
        }, Http.get = function(url, data, time_out, anonymous) {
            return void 0 === data && (data = new Map), void 0 === time_out && (time_out = 120),
            void 0 === anonymous && (anonymous = !1), new Promise((function(resolve, reject) {
                Http.ajax({
                    url: url,
                    method: "GET",
                    timeout: 1e3 * time_out,
                    anonymous: anonymous,
                    onload: function(response) {
                        var _a;
                        try {
                            var res = null !== (_a = JSON.parse(response.responseText)) && void 0 !== _a ? _a : response.responseText;
                            resolve(res);
                        } catch (error) {
                            Logger_1.Logger.debug(error), reject();
                        }
                    },
                    onerror: function(response) {
                        reject(response);
                    },
                    ontimeout: function() {
                        reject("\u8bf7\u6c42\u8d85\u65f6");
                    }
                });
            }));
        }, Http;
    }();
    exports.Http = Http;
    var HttpHeaders = function HttpHeaders() {};
    exports.HttpHeaders = HttpHeaders;
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.Common = void 0;
    var Common = function() {
        function Common() {}
        return Common.randStr = function(len) {
            void 0 === len && (len = 4);
            for (var $chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", pwd = "", i = 0; i < len; i++) pwd += $chars.charAt(Math.floor(62 * Math.random()));
            return pwd;
        }, Common.humanSize = function(fileSize) {
            return fileSize < 1024 ? fileSize + "B" : fileSize < 1048576 ? (fileSize / 1024).toFixed(2) + "KB" : fileSize < 1073741824 ? (fileSize / 1048576).toFixed(2) + "MB" : (fileSize / 1073741824).toFixed(2) + "GB";
        }, Common.trim = function(source, char) {
            return source.replace(new RegExp("^\\" + char + "+|\\" + char + "+$", "g"), "");
        }, Common.getCookie = function(key) {
            for (var arr = document.cookie.replace(/\s/g, "").split(";"), i = 0, l = arr.length; i < l; i++) {
                var tempArr = arr[i].split("=");
                if (tempArr[0] == key) return decodeURIComponent(tempArr[1]);
            }
            return "";
        }, Common;
    }();
    exports.Common = Common;
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.Config = void 0;
    var Logger_1 = __webpack_require__(0), Config = function() {
        function Config() {}
        return Object.defineProperty(Config, "env", {
            get: function() {
                return GM_info;
            },
            enumerable: !1,
            configurable: !0
        }), Config.set = function(key, v, exp) {
            void 0 === exp && (exp = -1);
            var obj = {
                key: key,
                value: v,
                exp: -1 == exp ? exp : (new Date).getTime() + 1e3 * exp
            };
            GM_setValue("pantools_" + this.encode(key), JSON.stringify(obj));
        }, Config.get = function(key, defaultValue) {
            void 0 === defaultValue && (defaultValue = !1);
            var objStr = GM_getValue("pantools_" + this.encode(key));
            if (objStr) {
                var obj = JSON.parse(objStr);
                if (-1 == obj.exp || obj.exp > (new Date).getTime()) return Logger_1.Logger.info(key + " cache true"),
                obj.value;
            }
            return Logger_1.Logger.info(key + " cache false"), defaultValue;
        }, Config.getLocalStorage = function(key, defaultValue) {
            void 0 === defaultValue && (defaultValue = !1);
            var objStr = localStorage.getItem("" + this.encode(key));
            if (objStr) {
                var obj = JSON.parse(objStr);
                if (-1 == obj.exp || obj.exp > (new Date).getTime()) return Logger_1.Logger.info(key + " storage cache true"),
                obj.value;
            }
            return Logger_1.Logger.info(key + " storage cache false"), defaultValue;
        }, Config.setLocalStorage = function(key, v, exp) {
            void 0 === exp && (exp = -1);
            var obj = {
                key: key,
                value: v,
                exp: -1 == exp ? exp : (new Date).getTime() + 1e3 * exp
            };
            localStorage.setItem("" + this.encode(key), JSON.stringify(obj));
        }, Config.decode = function(str) {
            return atob(str);
        }, Config.encode = function(str) {
            return btoa(str);
        }, Config;
    }();
    exports.Config = Config;
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var Container_1 = __webpack_require__(4), home_1 = __webpack_require__(14);
    Container_1.Container.register(home_1.PaiPaiHelper).Init();
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.PaiPaiHelper = void 0;
    var Container_1 = __webpack_require__(4), Logger_1 = __webpack_require__(0), BaiDuPanParse_1 = __webpack_require__(5), PaiPaiHelper = function() {
        function PaiPaiHelper() {
            this.plugins = new Array, this.plugins = [ Container_1.Container.register(BaiDuPanParse_1.BaiDuPanParse) ],
            Logger_1.Logger.info("container loaded");
        }
        return PaiPaiHelper.prototype.Init = function() {
            this.plugins.every((function(element) {
                return !element.linkTest() || (new Promise((function(resolve) {
                    resolve(1);
                })).then(element.Process), Logger_1.Logger.debug("element unique:" + element.unique()),
                !element.unique());
            }));
        }, PaiPaiHelper;
    }();
    exports.PaiPaiHelper = PaiPaiHelper;
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.ScriptOption = exports.ScriptInfo = exports.Env = void 0;
    var Env = function() {
        function Env() {}
        return Env.Sign = "PaiPai", Env;
    }();
    exports.Env = Env;
    var ScriptInfo = function ScriptInfo() {};
    exports.ScriptInfo = ScriptInfo;
    var ScriptOption = function ScriptOption() {};
    exports.ScriptOption = ScriptOption;
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.LogLevel = void 0, function(LogLevel) {
        LogLevel[LogLevel.debug = 0] = "debug", LogLevel[LogLevel.info = 1] = "info", LogLevel[LogLevel.warn = 2] = "warn",
        LogLevel[LogLevel.error = 3] = "error";
    }(exports.LogLevel || (exports.LogLevel = {}));
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.AppBase = void 0;
    var Logger_1 = __webpack_require__(0), SiteEnum_1 = __webpack_require__(6), Core_1 = __webpack_require__(7), AppBase = function() {
        function AppBase() {
            var _this = this;
            this._unique = !0, this.Process = function() {
                _this.loader(), _this.run();
            };
        }
        return AppBase.prototype.unique = function() {
            return this._unique;
        }, AppBase.prototype.linkTest = function(url) {
            var _this = this;
            url || (url = Core_1.Core.currentUrl());
            var flag = !1;
            return this.rules.forEach((function(v, k) {
                return v.test(url) ? (Logger_1.Logger.debug("app:" + _this.appName + "_" + SiteEnum_1.SiteEnum[k] + " test pass"),
                flag = !0, _this.site = k, !1) : (Logger_1.Logger.warn("app:" + _this.appName + " test fail"),
                !0);
            })), flag;
        }, AppBase;
    }();
    exports.AppBase = AppBase;
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.BrowerType = void 0, function(BrowerType) {
        BrowerType[BrowerType.Edge = 0] = "Edge", BrowerType[BrowerType.Edg = 1] = "Edg",
        BrowerType[BrowerType.Chrome = 2] = "Chrome", BrowerType[BrowerType.Firefox = 3] = "Firefox",
        BrowerType[BrowerType.Safiri = 4] = "Safiri", BrowerType[BrowerType.Se360 = 5] = "Se360",
        BrowerType[BrowerType.Ie2345 = 6] = "Ie2345", BrowerType[BrowerType.Baidu = 7] = "Baidu",
        BrowerType[BrowerType.Liebao = 8] = "Liebao", BrowerType[BrowerType.UC = 9] = "UC",
        BrowerType[BrowerType.QQ = 10] = "QQ", BrowerType[BrowerType.Sogou = 11] = "Sogou",
        BrowerType[BrowerType.Opera = 12] = "Opera", BrowerType[BrowerType.Maxthon = 13] = "Maxthon";
    }(exports.BrowerType || (exports.BrowerType = {}));
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.Ele = void 0;
    var EventEnum_1 = __webpack_require__(8), Ele = function() {
        function Ele() {}
        return Ele.A = function(id, title, html, css, classStr) {
            var a = document.createElement("a");
            return a.id = id, a.title = title, a.innerHTML = html, a.style.cssText = css, a.className = classStr,
            a;
        }, Ele.Span = function(childs, classStr) {
            void 0 === classStr && (classStr = "");
            var span = document.createElement("span");
            return childs.forEach((function(child) {
                child instanceof HTMLElement ? span.appendChild(child) : span.innerHTML = child;
            })), classStr && (span.className = classStr), span;
        }, Ele.Button = function(id, className, childs) {
            var btn = document.createElement("button");
            return id && (btn.id = id), className && (btn.className = className), childs.forEach((function(child) {
                child instanceof HTMLElement ? btn.appendChild(child) : btn.innerHTML = child;
            })), btn;
        }, Ele.bindEvent = function(ele, event, callback) {
            ele.addEventListener(EventEnum_1.EventEnum[event], callback);
        }, Ele;
    }();
    exports.Ele = Ele;
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.PanShareFileData = exports.PanShareXListRes = exports.PanShareListRes = exports.SignDataRes = exports.SignRes = exports.PcsRes = exports.PcsInfo = exports.BaiDuPanFile = void 0;
    var BaiDuPanFile = function BaiDuPanFile() {};
    exports.BaiDuPanFile = BaiDuPanFile;
    var PcsInfo = function PcsInfo() {};
    exports.PcsInfo = PcsInfo;
    var PcsRes = function PcsRes() {};
    exports.PcsRes = PcsRes;
    var SignRes = function SignRes() {};
    exports.SignRes = SignRes;
    var SignDataRes = function SignDataRes() {};
    exports.SignDataRes = SignDataRes;
    var PanShareListRes = function PanShareListRes() {};
    exports.PanShareListRes = PanShareListRes;
    var PanShareXListRes = function PanShareXListRes() {};
    exports.PanShareXListRes = PanShareXListRes;
    var PanShareFileData = function PanShareFileData() {};
    exports.PanShareFileData = PanShareFileData;
}, function(module, exports, __webpack_require__) {
    "use strict";
    var __importDefault = this && this.__importDefault || function(mod) {
        return mod && mod.__esModule ? mod : {
            default: mod
        };
    };
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.Alert = void 0;
    var sweetalert2_1 = __importDefault(__webpack_require__(22));
    __webpack_require__(23), __webpack_require__(24);
    var Alert = function() {
        function Alert() {}
        return Alert.confirm = function(msg, confirmTxt, cancelTxt) {
            return void 0 === confirmTxt && (confirmTxt = "\u786e\u5b9a"), void 0 === cancelTxt && (cancelTxt = "\u53d6\u6d88"),
            sweetalert2_1.default.fire({
                html: msg,
                confirmButtonText: confirmTxt,
                showConfirmButton: !0,
                showCancelButton: !0,
                cancelButtonText: cancelTxt,
                icon: "question",
                allowOutsideClick: !1,
                customClass: this.customeCss
            });
        }, Alert.info = function(msg, time, icon) {
            var _this = this;
            void 0 === time && (time = 2), void 0 === icon && (icon = "success"), null != this.tipContainer && sweetalert2_1.default.close(this.tipContainer),
            sweetalert2_1.default.fire({
                toast: !0,
                position: "top",
                showCancelButton: !1,
                showConfirmButton: !1,
                timerProgressBar: !0,
                title: msg,
                icon: icon,
                timer: 1e3 * time,
                customClass: this.customeCss
            }).then((function(a) {
                _this.tipContainer = a;
            }));
        }, Alert.input = function(msg, defValue, validator) {
            return void 0 === defValue && (defValue = ""), void 0 === validator && (validator = function(res) {
                return "" == res || null == res ? msg : null;
            }), sweetalert2_1.default.fire({
                input: "text",
                inputLabel: msg,
                inputValue: defValue,
                showCancelButton: !0,
                cancelButtonText: "\u5173\u95ed",
                confirmButtonText: "\u6dfb\u52a0",
                inputValidator: function(r) {
                    return validator(r);
                },
                customClass: this.customeCss
            });
        }, Alert.html = function(title, html, width, time) {
            return void 0 === width && (width = void 0), void 0 === time && (time = void 0),
            sweetalert2_1.default.fire({
                toast: !1,
                allowOutsideClick: !1,
                confirmButtonText: "\u5173\u95ed",
                width: width,
                title: title,
                html: html,
                timer: null == time ? time : 1e3 * time,
                customClass: this.customeCss
            });
        }, Alert.toast = function(title, html, cancel, cancelTxt, confirm, confirmTxt) {
            return void 0 === cancel && (cancel = !1), void 0 === cancelTxt && (cancelTxt = ""),
            void 0 === confirm && (confirm = !1), void 0 === confirmTxt && (confirmTxt = ""),
            sweetalert2_1.default.fire({
                toast: !0,
                position: "top",
                html: html,
                showCancelButton: cancel,
                showConfirmButton: confirm,
                title: title,
                cancelButtonText: cancelTxt,
                confirmButtonText: confirmTxt,
                customClass: this.customeCss
            });
        }, Alert.loading = function(msg, time) {
            return void 0 === msg && (msg = ""), void 0 === time && (time = void 0), sweetalert2_1.default.fire({
                title: msg,
                timer: null == time ? time : 1e3 * time,
                timerProgressBar: !0,
                allowOutsideClick: !1,
                didOpen: function() {
                    sweetalert2_1.default.showLoading();
                },
                customClass: this.customeCss
            });
        }, Alert.close = function(swal) {
            sweetalert2_1.default.close(swal);
        }, Alert.customeCss = {
            container: "pantools-container",
            popup: "pantools-popup",
            title: "pantools-title",
            closeButton: "pantools-close",
            icon: "pantools-icon",
            image: "pantools-image",
            htmlContainer: "pantools-html",
            input: "pantools-input",
            validationMessage: "pantools-validation",
            actions: "pantools-actions",
            confirmButton: "pantools-confirm",
            denyButton: "pantools-deny",
            cancelButton: "pantools-cancel",
            loader: "pantools-loader",
            footer: "pantools-footer"
        }, Alert;
    }();
    exports.Alert = Alert;
}, function(module, exports, __webpack_require__) {
    module.exports = function() {
        "use strict";
        function _typeof(obj) {
            return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
                return typeof obj;
            } : function(obj) {
                return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            }, _typeof(obj);
        }
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("\u6309\u65f6\u95f4\u543c\u543c\u543c\u543c\u543c\u543c\u543c\u543c\u543c\u543c\u543c\u543c\u543c\u543c\u543c\u543c\u5409\u6069\u54c8\u6211\u611f\u89c9egg");
        }
        function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0,
                "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        function _createClass(Constructor, protoProps, staticProps) {
            return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps),
            Constructor;
        }
        function _extends() {
            return _extends = Object.assign || function(target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i];
                    for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
                }
                return target;
            }, _extends.apply(this, arguments);
        }
        function _inherits(subClass, superClass) {
            if ("function" != typeof superClass && null !== superClass) throw new TypeError("\u963f\u8428\u98d2\u98d2\u98d2\u98d2\u98d2\u98d2\u98d2\u98d2\u98d2\u98d2\u98d2\u98d2\u8272\u5bb6\u4e2a\u5251\u9b42\u5361\u74e6\u683c\u4eac\u54c8\u4e94\u4e2a\u6fc0\u6d3b\u5de5\u5177\u4eca\u513f\u4ffa\u8ddf\u6211\u5c31\u548c");
            subClass.prototype = Object.create(superClass && superClass.prototype, {
                constructor: {
                    value: subClass,
                    writable: !0,
                    configurable: !0
                }
            }), superClass && _setPrototypeOf(subClass, superClass);
        }
        function _getPrototypeOf(o) {
            return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
                return o.__proto__ || Object.getPrototypeOf(o);
            }, _getPrototypeOf(o);
        }
        function _setPrototypeOf(o, p) {
            return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
                return o.__proto__ = p, o;
            }, _setPrototypeOf(o, p);
        }
        function _isNativeReflectConstruct() {
            if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
            if (Reflect.construct.sham) return !1;
            if ("function" == typeof Proxy) return !0;
            try {
                return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function() {}))),
                !0;
            } catch (e) {
                return !1;
            }
        }
        function _construct(Parent, args, Class) {
            return _construct = _isNativeReflectConstruct() ? Reflect.construct : function _construct(Parent, args, Class) {
                var a = [ null ];
                a.push.apply(a, args);
                var instance = new (Function.bind.apply(Parent, a));
                return Class && _setPrototypeOf(instance, Class.prototype), instance;
            }, _construct.apply(null, arguments);
        }
        function _assertThisInitialized(self) {
            if (void 0 === self) throw new ReferenceError("\u6316\u6398\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u597d\u597d\u597d\u559d\u7ea2\u9152\u53bb\u653b\u51fb\u540e\u536b\u560e\u54c8\u51e0\u4f4d\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5");
            return self;
        }
        function _possibleConstructorReturn(self, call) {
            return !call || "object" != typeof call && "function" != typeof call ? _assertThisInitialized(self) : call;
        }
        function _createSuper(Derived) {
            var hasNativeReflectConstruct = _isNativeReflectConstruct();
            return function _createSuperInternal() {
                var result, Super = _getPrototypeOf(Derived);
                if (hasNativeReflectConstruct) {
                    var NewTarget = _getPrototypeOf(this).constructor;
                    result = Reflect.construct(Super, arguments, NewTarget);
                } else result = Super.apply(this, arguments);
                return _possibleConstructorReturn(this, result);
            };
        }
		    let getFileListStat = function (fileList) {
        let fileStat = {
            file_num: 0,
            dir_num: 0
        };
        fileList.forEach(function (item) {
            if (item.isdir == 0) {
                fileStat.file_num++;
            } else {
                fileStat.dir_num++;
            }
        });
        return fileStat;
    };
        function _superPropBase(object, property) {
            for (;!Object.prototype.hasOwnProperty.call(object, property) && null !== (object = _getPrototypeOf(object)); ) ;
            return object;
        }
        function _get(target, property, receiver) {
            return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function _get(target, property, receiver) {
                var base = _superPropBase(target, property);
                if (base) {
                    var desc = Object.getOwnPropertyDescriptor(base, property);
                    return desc.get ? desc.get.call(receiver) : desc.value;
                }
            }, _get(target, property, receiver || target);
        }
        var uniqueArray = function uniqueArray(arr) {
            for (var result = [], i = 0; i < arr.length; i++) -1 === result.indexOf(arr[i]) && result.push(arr[i]);
            return result;
        }, capitalizeFirstLetter = function capitalizeFirstLetter(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }, objectValues = function objectValues(obj) {
            return Object.keys(obj).map((function(key) {
                return obj[key];
            }));
        }, toArray = function toArray(nodeList) {
            return Array.prototype.slice.call(nodeList);
        }, warn = function warn(message) {}, error = function error(message) {}, previousWarnOnceMessages = [], warnOnce = function warnOnce(message) {
            -1 === previousWarnOnceMessages.indexOf(message) && (previousWarnOnceMessages.push(message),
            warn(message));
        }, warnAboutDeprecation = function warnAboutDeprecation(deprecatedParam, useInstead) {
            warnOnce('"'.concat(deprecatedParam, '" is deprecated and will be removed in the next major release. Please use "').concat(useInstead, '" instead.'));
        }, callIfFunction = function callIfFunction(arg) {
            return "function" == typeof arg ? arg() : arg;
        }, hasToPromiseFn = function hasToPromiseFn(arg) {
            return arg && "function" == typeof arg.toPromise;
        }, asPromise = function asPromise(arg) {
            return hasToPromiseFn(arg) ? arg.toPromise() : Promise.resolve(arg);
        }, isPromise = function isPromise(arg) {
            return arg && Promise.resolve(arg) === arg;
        }, DismissReason = Object.freeze({
            cancel: "cancel",
            backdrop: "backdrop",
            close: "close",
            esc: "esc",
            timer: "timer"
        }), isJqueryElement = function isJqueryElement(elem) {
            return "object" === _typeof(elem) && elem.jquery;
        }, isElement = function isElement(elem) {
            return elem instanceof Element || isJqueryElement(elem);
        }, argsToParams = function argsToParams(args) {
            var params = {};
            return "object" !== _typeof(args[0]) || isElement(args[0]) ? [ "title", "html", "icon" ].forEach((function(name, index) {
                var arg = args[index];
                "string" == typeof arg || isElement(arg) ? params[name] = arg : void 0 !== arg && error("Unexpected type of ".concat(name, '! Expected "string" or "Element", got ').concat(_typeof(arg)));
            })) : _extends(params, args[0]), params;
        }, swalPrefix = "swal2-", prefix = function prefix(items) {
            var result = {};
            for (var i in items) result[items[i]] = swalPrefix + items[i];
            return result;
        }, swalClasses = prefix([ "container", "shown", "height-auto", "iosfix", "popup", "modal", "no-backdrop", "no-transition", "toast", "toast-shown", "show", "hide", "close", "title", "header", "content", "html-container", "actions", "confirm", "deny", "cancel", "footer", "icon", "icon-content", "image", "input", "file", "range", "select", "radio", "checkbox", "label", "textarea", "inputerror", "input-label", "validation-message", "progress-steps", "active-progress-step", "progress-step", "progress-step-line", "loader", "loading", "styled", "top", "top-start", "top-end", "top-left", "top-right", "center", "center-start", "center-end", "center-left", "center-right", "bottom", "bottom-start", "bottom-end", "bottom-left", "bottom-right", "grow-row", "grow-column", "grow-fullscreen", "rtl", "timer-progress-bar", "timer-progress-bar-container", "scrollbar-measure", "icon-success", "icon-warning", "icon-info", "icon-question", "icon-error" ]), iconTypes = prefix([ "success", "warning", "info", "question", "error" ]), getContainer = function getContainer() {
            return document.body.querySelector(".".concat(swalClasses.container));
        }, elementBySelector = function elementBySelector(selectorString) {
            var container = getContainer();
            return container ? container.querySelector(selectorString) : null;
        }, elementByClass = function elementByClass(className) {
            return elementBySelector(".".concat(className));
        }, getPopup = function getPopup() {
            return elementByClass(swalClasses.popup);
        }, getIcon = function getIcon() {
            return elementByClass(swalClasses.icon);
        }, getTitle = function getTitle() {
            return elementByClass(swalClasses.title);
        }, getContent = function getContent() {
            return elementByClass(swalClasses.content);
        }, getHtmlContainer = function getHtmlContainer() {
            return elementByClass(swalClasses["html-container"]);
        }, getImage = function getImage() {
            return elementByClass(swalClasses.image);
        }, getProgressSteps = function getProgressSteps() {
            return elementByClass(swalClasses["progress-steps"]);
        }, getValidationMessage = function getValidationMessage() {
            return elementByClass(swalClasses["validation-message"]);
        }, getConfirmButton = function getConfirmButton() {
            return elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.confirm));
        }, getDenyButton = function getDenyButton() {
            return elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.deny));
        }, getInputLabel = function getInputLabel() {
            return elementByClass(swalClasses["input-label"]);
        }, getLoader = function getLoader() {
            return elementBySelector(".".concat(swalClasses.loader));
        }, getCancelButton = function getCancelButton() {
            return elementBySelector(".".concat(swalClasses.actions, " .").concat(swalClasses.cancel));
        }, getActions = function getActions() {
            return elementByClass(swalClasses.actions);
        }, getHeader = function getHeader() {
            return elementByClass(swalClasses.header);
        }, getFooter = function getFooter() {
            return elementByClass(swalClasses.footer);
        }, getTimerProgressBar = function getTimerProgressBar() {
            return elementByClass(swalClasses["timer-progress-bar"]);
        }, getCloseButton = function getCloseButton() {
            return elementByClass(swalClasses.close);
        }, focusable = '\n  a[href],\n  area[href],\n  input:not([disabled]),\n  select:not([disabled]),\n  textarea:not([disabled]),\n  button:not([disabled]),\n  iframe,\n  object,\n  embed,\n  [tabindex="0"],\n  [contenteditable],\n  audio[controls],\n  video[controls],\n  summary\n', getFocusableElements = function getFocusableElements() {
            var focusableElementsWithTabindex = toArray(getPopup().querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])')).sort((function(a, b) {
                return (a = parseInt(a.getAttribute("tabindex"))) > (b = parseInt(b.getAttribute("tabindex"))) ? 1 : a < b ? -1 : 0;
            })), otherFocusableElements = toArray(getPopup().querySelectorAll(focusable)).filter((function(el) {
                return "-1" !== el.getAttribute("tabindex");
            }));
            return uniqueArray(focusableElementsWithTabindex.concat(otherFocusableElements)).filter((function(el) {
                return isVisible(el);
            }));
        }, isModal = function isModal() {
            return !isToast() && !document.body.classList.contains(swalClasses["no-backdrop"]);
        }, isToast = function isToast() {
            return document.body.classList.contains(swalClasses["toast-shown"]);
        }, isLoading = function isLoading() {
            return getPopup().hasAttribute("data-loading");
        }, states = {
            previousBodyPadding: null
        }, setInnerHtml = function setInnerHtml(elem, html) {
            if (elem.textContent = "", html) {
                var parsed = (new DOMParser).parseFromString(html, "text/html");
                toArray(parsed.querySelector("head").childNodes).forEach((function(child) {
                    elem.appendChild(child);
                })), toArray(parsed.querySelector("body").childNodes).forEach((function(child) {
                    elem.appendChild(child);
                }));
            }
        }, hasClass = function hasClass(elem, className) {
            if (!className) return !1;
            for (var classList = className.split(/\s+/), i = 0; i < classList.length; i++) if (!elem.classList.contains(classList[i])) return !1;
            return !0;
        }, removeCustomClasses = function removeCustomClasses(elem, params) {
            toArray(elem.classList).forEach((function(className) {
                -1 === objectValues(swalClasses).indexOf(className) && -1 === objectValues(iconTypes).indexOf(className) && -1 === objectValues(params.showClass).indexOf(className) && elem.classList.remove(className);
            }));
        }, applyCustomClass = function applyCustomClass(elem, params, className) {
            if (removeCustomClasses(elem, params), params.customClass && params.customClass[className]) {
                if ("string" != typeof params.customClass[className] && !params.customClass[className].forEach) return warn("Invalid type of customClass.".concat(className, '! Expected string or iterable object, got "').concat(_typeof(params.customClass[className]), '"'));
                addClass(elem, params.customClass[className]);
            }
        };
        function getInput(content, inputType) {
            if (!inputType) return null;
            switch (inputType) {
              case "select":
              case "textarea":
              case "file":
                return getChildByClass(content, swalClasses[inputType]);

              case "checkbox":
                return content.querySelector(".".concat(swalClasses.checkbox, " input"));

              case "radio":
                return content.querySelector(".".concat(swalClasses.radio, " input:checked")) || content.querySelector(".".concat(swalClasses.radio, " input:first-child"));

              case "range":
                return content.querySelector(".".concat(swalClasses.range, " input"));

              default:
                return getChildByClass(content, swalClasses.input);
            }
        }
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
        var oldInputVal, focusInput = function focusInput(input) {
            if (input.focus(), "file" !== input.type) {
                var val = input.value;
                input.value = "", input.value = val;
            }
        }, toggleClass = function toggleClass(target, classList, condition) {
            target && classList && ("string" == typeof classList && (classList = classList.split(/\s+/).filter(Boolean)),
            classList.forEach((function(className) {
                target.forEach ? target.forEach((function(elem) {
                    condition ? elem.classList.add(className) : elem.classList.remove(className);
                })) : condition ? target.classList.add(className) : target.classList.remove(className);
            })));
        }, addClass = function addClass(target, classList) {
            toggleClass(target, classList, !0);
        }, removeClass = function removeClass(target, classList) {
            toggleClass(target, classList, !1);
        }, getChildByClass = function getChildByClass(elem, className) {
            for (var i = 0; i < elem.childNodes.length; i++) if (hasClass(elem.childNodes[i], className)) return elem.childNodes[i];
        }, applyNumericalStyle = function applyNumericalStyle(elem, property, value) {
            value === "".concat(parseInt(value)) && (value = parseInt(value)), value || 0 === parseInt(value) ? elem.style[property] = "number" == typeof value ? "".concat(value, "px") : value : elem.style.removeProperty(property);
        }, show = function show(elem) {
            var display = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "flex";
            elem.style.display = display;
        }, hide = function hide(elem) {
            elem.style.display = "none";
        }, setStyle = function setStyle(parent, selector, property, value) {
            var el = parent.querySelector(selector);
            el && (el.style[property] = value);
        }, toggle = function toggle(elem, condition, display) {
            condition ? show(elem, display) : hide(elem);
        }, isVisible = function isVisible(elem) {
            return !(!elem || !(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length));
        }, allButtonsAreHidden = function allButtonsAreHidden() {
            return !isVisible(getConfirmButton()) && !isVisible(getDenyButton()) && !isVisible(getCancelButton());
        }, isScrollable = function isScrollable(elem) {
            return !!(elem.scrollHeight > elem.clientHeight);
        }, hasCssAnimation = function hasCssAnimation(elem) {
            var style = window.getComputedStyle(elem), animDuration = parseFloat(style.getPropertyValue("animation-duration") || "0"), transDuration = parseFloat(style.getPropertyValue("transition-duration") || "0");
            return animDuration > 0 || transDuration > 0;
        }, contains = function contains(haystack, needle) {
            if ("function" == typeof haystack.contains) return haystack.contains(needle);
        }, animateTimerProgressBar = function animateTimerProgressBar(timer) {
            var reset = arguments.length > 1 && void 0 !== arguments[1] && arguments[1], timerProgressBar = getTimerProgressBar();
            isVisible(timerProgressBar) && (reset && (timerProgressBar.style.transition = "none",
            timerProgressBar.style.width = "100%"), setTimeout((function() {
                timerProgressBar.style.transition = "width ".concat(timer / 1e3, "s linear"), timerProgressBar.style.width = "0%";
            }), 10));
        }, stopTimerProgressBar = function stopTimerProgressBar() {
            var timerProgressBar = getTimerProgressBar(), timerProgressBarWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
            timerProgressBar.style.removeProperty("transition"), timerProgressBar.style.width = "100%";
            var timerProgressBarFullWidth = parseInt(window.getComputedStyle(timerProgressBar).width), timerProgressBarPercent = parseInt(timerProgressBarWidth / timerProgressBarFullWidth * 100);
            timerProgressBar.style.removeProperty("transition"), timerProgressBar.style.width = "".concat(timerProgressBarPercent, "%");
        }, isNodeEnv = function isNodeEnv() {
            return "undefined" == typeof window || "undefined" == typeof document;
        }, sweetHTML = '\n <div aria-labelledby="'.concat(swalClasses.title, '" aria-describedby="').concat(swalClasses.content, '" class="').concat(swalClasses.popup, '" tabindex="-1">\n   <div class="').concat(swalClasses.header, '">\n     <ul class="').concat(swalClasses["progress-steps"], '"></ul>\n     <div class="').concat(swalClasses.icon, '"></div>\n     <img class="').concat(swalClasses.image, '" />\n     <h2 class="').concat(swalClasses.title, '" id="').concat(swalClasses.title, '"></h2>\n     <button type="button" class="').concat(swalClasses.close, '"></button>\n   </div>\n   <div class="').concat(swalClasses.content, '">\n     <div id="').concat(swalClasses.content, '" class="').concat(swalClasses["html-container"], '"></div>\n     <input class="').concat(swalClasses.input, '" />\n     <input type="file" class="').concat(swalClasses.file, '" />\n     <div class="').concat(swalClasses.range, '">\n       <input type="range" />\n       <output></output>\n     </div>\n     <select class="').concat(swalClasses.select, '"></select>\n     <div class="').concat(swalClasses.radio, '"></div>\n     <label for="').concat(swalClasses.checkbox, '" class="').concat(swalClasses.checkbox, '">\n       <input type="checkbox" />\n       <span class="').concat(swalClasses.label, '"></span>\n     </label>\n     <textarea class="').concat(swalClasses.textarea, '"></textarea>\n     <div class="').concat(swalClasses["validation-message"], '" id="').concat(swalClasses["validation-message"], '"></div>\n   </div>\n   <div class="').concat(swalClasses.actions, '">\n     <div class="').concat(swalClasses.loader, '"></div>\n     <button type="button" class="').concat(swalClasses.confirm, '"></button>\n     <button type="button" class="').concat(swalClasses.deny, '"></button>\n     <button type="button" class="').concat(swalClasses.cancel, '"></button>\n   </div>\n   <div class="').concat(swalClasses.footer, '"></div>\n   <div class="').concat(swalClasses["timer-progress-bar-container"], '">\n     <div class="').concat(swalClasses["timer-progress-bar"], '"></div>\n   </div>\n </div>\n').replace(/(^|\n)\s*/g, ""), resetOldContainer = function resetOldContainer() {
            var oldContainer = getContainer();
            return !!oldContainer && (oldContainer.parentNode.removeChild(oldContainer), removeClass([ document.documentElement, document.body ], [ swalClasses["no-backdrop"], swalClasses["toast-shown"], swalClasses["has-column"] ]),
            !0);
        }, resetValidationMessage = function resetValidationMessage(e) {
            Swal.isVisible() && oldInputVal !== e.target.value && Swal.resetValidationMessage(),
            oldInputVal = e.target.value;
        }, addInputChangeListeners = function addInputChangeListeners() {
            var content = getContent(), input = getChildByClass(content, swalClasses.input), file = getChildByClass(content, swalClasses.file), range = content.querySelector(".".concat(swalClasses.range, " input")), rangeOutput = content.querySelector(".".concat(swalClasses.range, " output")), select = getChildByClass(content, swalClasses.select), checkbox = content.querySelector(".".concat(swalClasses.checkbox, " input")), textarea = getChildByClass(content, swalClasses.textarea);
            input.oninput = resetValidationMessage, file.onchange = resetValidationMessage,
            select.onchange = resetValidationMessage, checkbox.onchange = resetValidationMessage,
            textarea.oninput = resetValidationMessage, range.oninput = function(e) {
                resetValidationMessage(e), rangeOutput.value = range.value;
            }, range.onchange = function(e) {
                resetValidationMessage(e), range.nextSibling.value = range.value;
            };
        }, getTarget = function getTarget(target) {
            return "string" == typeof target ? document.querySelector(target) : target;
        }, setupAccessibility = function setupAccessibility(params) {
            var popup = getPopup();
            popup.setAttribute("role", params.toast ? "alert" : "dialog"), popup.setAttribute("aria-live", params.toast ? "polite" : "assertive"),
            params.toast || popup.setAttribute("aria-modal", "true");
        }, setupRTL = function setupRTL(targetElement) {
            "rtl" === window.getComputedStyle(targetElement).direction && addClass(getContainer(), swalClasses.rtl);
        }, init = function init(params) {
            var oldContainerExisted = resetOldContainer();
            if (isNodeEnv()) error("SweetAlert2 requires document to initialize"); else {
                var container = document.createElement("div");
                container.className = swalClasses.container, oldContainerExisted && addClass(container, swalClasses["no-transition"]),
                setInnerHtml(container, sweetHTML);
                var targetElement = getTarget(params.target);
                targetElement.appendChild(container), setupAccessibility(params), setupRTL(targetElement),
                addInputChangeListeners();
            }
        }, parseHtmlToContainer = function parseHtmlToContainer(param, target) {
            param instanceof HTMLElement ? target.appendChild(param) : "object" === _typeof(param) ? handleObject(param, target) : param && setInnerHtml(target, param);
        }, handleObject = function handleObject(param, target) {
            param.jquery ? handleJqueryElem(target, param) : setInnerHtml(target, param.toString());
        }, handleJqueryElem = function handleJqueryElem(target, elem) {
            if (target.textContent = "", 0 in elem) for (var i = 0; i in elem; i++) target.appendChild(elem[i].cloneNode(!0)); else target.appendChild(elem.cloneNode(!0));
        }, animationEndEvent = function() {
            if (isNodeEnv()) return !1;
            var testEl = document.createElement("div"), transEndEventNames = {
                WebkitAnimation: "webkitAnimationEnd",
                OAnimation: "oAnimationEnd oanimationend",
                animation: "animationend"
            };
            for (var i in transEndEventNames) if (Object.prototype.hasOwnProperty.call(transEndEventNames, i) && void 0 !== testEl.style[i]) return transEndEventNames[i];
            return !1;
        }(), measureScrollbar = function measureScrollbar() {
            var scrollDiv = document.createElement("div");
            scrollDiv.className = swalClasses["scrollbar-measure"], document.body.appendChild(scrollDiv);
            var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
            return document.body.removeChild(scrollDiv), scrollbarWidth;
        }, renderActions = function renderActions(instance, params) {
            var actions = getActions(), loader = getLoader(), confirmButton = getConfirmButton(), denyButton = getDenyButton(), cancelButton = getCancelButton();
            params.showConfirmButton || params.showDenyButton || params.showCancelButton || hide(actions),
            applyCustomClass(actions, params, "actions"), renderButton(confirmButton, "confirm", params),
            renderButton(denyButton, "deny", params), renderButton(cancelButton, "cancel", params),
            handleButtonsStyling(confirmButton, denyButton, cancelButton, params), params.reverseButtons && (actions.insertBefore(cancelButton, loader),
            actions.insertBefore(denyButton, loader), actions.insertBefore(confirmButton, loader)),
            setInnerHtml(loader, params.loaderHtml), applyCustomClass(loader, params, "loader");
        };
        function handleButtonsStyling(confirmButton, denyButton, cancelButton, params) {
            if (!params.buttonsStyling) return removeClass([ confirmButton, denyButton, cancelButton ], swalClasses.styled);
            addClass([ confirmButton, denyButton, cancelButton ], swalClasses.styled), params.confirmButtonColor && (confirmButton.style.backgroundColor = params.confirmButtonColor),
            params.denyButtonColor && (denyButton.style.backgroundColor = params.denyButtonColor),
            params.cancelButtonColor && (cancelButton.style.backgroundColor = params.cancelButtonColor);
        }
        function renderButton(button, buttonType, params) {
            toggle(button, params["show".concat(capitalizeFirstLetter(buttonType), "Button")], "inline-block"),
            setInnerHtml(button, params["".concat(buttonType, "ButtonText")]), button.setAttribute("aria-label", params["".concat(buttonType, "ButtonAriaLabel")]),
            button.className = swalClasses[buttonType], applyCustomClass(button, params, "".concat(buttonType, "Button")),
            addClass(button, params["".concat(buttonType, "ButtonClass")]);
        }
        function handleBackdropParam(container, backdrop) {
            "string" == typeof backdrop ? container.style.background = backdrop : backdrop || addClass([ document.documentElement, document.body ], swalClasses["no-backdrop"]);
        }
        function handlePositionParam(container, position) {
            position in swalClasses ? addClass(container, swalClasses[position]) : (warn('The "position" parameter is not valid, defaulting to "center"'),
            addClass(container, swalClasses.center));
        }
        function handleGrowParam(container, grow) {
            if (grow && "string" == typeof grow) {
                var growClass = "grow-".concat(grow);
                growClass in swalClasses && addClass(container, swalClasses[growClass]);
            }
        }
        var renderContainer = function renderContainer(instance, params) {
            var container = getContainer();
            if (container) {
                handleBackdropParam(container, params.backdrop), !params.backdrop && params.allowOutsideClick && warn('"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`'),
                handlePositionParam(container, params.position), handleGrowParam(container, params.grow),
                applyCustomClass(container, params, "container");
                var queueStep = document.body.getAttribute("data-swal2-queue-step");
                queueStep && (container.setAttribute("data-queue-step", queueStep), document.body.removeAttribute("data-swal2-queue-step"));
            }
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
        }, privateProps = {
            promise: new WeakMap,
            innerParams: new WeakMap,
            domCache: new WeakMap
        }, inputTypes = [ "input", "file", "range", "select", "radio", "checkbox", "textarea" ], renderInput = function renderInput(instance, params) {
            var content = getContent(), innerParams = privateProps.innerParams.get(instance), rerender = !innerParams || params.input !== innerParams.input;
            inputTypes.forEach((function(inputType) {
                var inputClass = swalClasses[inputType], inputContainer = getChildByClass(content, inputClass);
                setAttributes(inputType, params.inputAttributes), inputContainer.className = inputClass,
                rerender && hide(inputContainer);
            })), params.input && (rerender && showInput(params), setCustomClass(params));
        }, showInput = function showInput(params) {
            if (!renderInputType[params.input]) return error('Unexpected type of input! Expected "text", "email", "password", "number", "tel", "select", "radio", "checkbox", "textarea", "file" or "url", got "'.concat(params.input, '"'));
            var inputContainer = getInputContainer(params.input), input = renderInputType[params.input](inputContainer, params);
            show(input), setTimeout((function() {
                focusInput(input);
            }));
        }, removeAttributes = function removeAttributes(input) {
            for (var i = 0; i < input.attributes.length; i++) {
                var attrName = input.attributes[i].name;
                -1 === [ "type", "value", "style" ].indexOf(attrName) && input.removeAttribute(attrName);
            }
        }, setAttributes = function setAttributes(inputType, inputAttributes) {
            var input = getInput(getContent(), inputType);
            if (input) for (var attr in removeAttributes(input), inputAttributes) "range" === inputType && "placeholder" === attr || input.setAttribute(attr, inputAttributes[attr]);
        }, setCustomClass = function setCustomClass(params) {
            var inputContainer = getInputContainer(params.input);
            params.customClass && addClass(inputContainer, params.customClass.input);
        }, setInputPlaceholder = function setInputPlaceholder(input, params) {
            input.placeholder && !params.inputPlaceholder || (input.placeholder = params.inputPlaceholder);
        }, setInputLabel = function setInputLabel(input, prependTo, params) {
            if (params.inputLabel) {
                input.id = swalClasses.input;
                var label = document.createElement("label"), labelClass = swalClasses["input-label"];
                label.setAttribute("for", input.id), label.className = labelClass, addClass(label, params.customClass.inputLabel),
                label.innerText = params.inputLabel, prependTo.insertAdjacentElement("beforebegin", label);
            }
        }, getInputContainer = function getInputContainer(inputType) {
            var inputClass = swalClasses[inputType] ? swalClasses[inputType] : swalClasses.input;
            return getChildByClass(getContent(), inputClass);
        }, renderInputType = {};
        renderInputType.text = renderInputType.email = renderInputType.password = renderInputType.number = renderInputType.tel = renderInputType.url = function(input, params) {
            return "string" == typeof params.inputValue || "number" == typeof params.inputValue ? input.value = params.inputValue : isPromise(params.inputValue) || warn('Unexpected type of inputValue! Expected "string", "number" or "Promise", got "'.concat(_typeof(params.inputValue), '"')),
            setInputLabel(input, input, params), setInputPlaceholder(input, params), input.type = params.input,
            input;
        }, renderInputType.file = function(input, params) {
            return setInputLabel(input, input, params), setInputPlaceholder(input, params),
            input;
        }, renderInputType.range = function(range, params) {
            var rangeInput = range.querySelector("input"), rangeOutput = range.querySelector("output");
            return rangeInput.value = params.inputValue, rangeInput.type = params.input, rangeOutput.value = params.inputValue,
            setInputLabel(rangeInput, range, params), range;
        }, renderInputType.select = function(select, params) {
            if (select.textContent = "", params.inputPlaceholder) {
                var placeholder = document.createElement("option");
                setInnerHtml(placeholder, params.inputPlaceholder), placeholder.value = "", placeholder.disabled = !0,
                placeholder.selected = !0, select.appendChild(placeholder);
            }
            return setInputLabel(select, select, params), select;
        }, renderInputType.radio = function(radio) {
            return radio.textContent = "", radio;
        }, renderInputType.checkbox = function(checkboxContainer, params) {
            var checkbox = getInput(getContent(), "checkbox");
            checkbox.value = 1, checkbox.id = swalClasses.checkbox, checkbox.checked = Boolean(params.inputValue);
            var label = checkboxContainer.querySelector("span");
            return setInnerHtml(label, params.inputPlaceholder), checkboxContainer;
        }, renderInputType.textarea = function(textarea, params) {
            textarea.value = params.inputValue, setInputPlaceholder(textarea, params), setInputLabel(textarea, textarea, params);
            var getPadding = function getPadding(el) {
                return parseInt(window.getComputedStyle(el).paddingLeft) + parseInt(window.getComputedStyle(el).paddingRight);
            };
            if ("MutationObserver" in window) {
                var initialPopupWidth = parseInt(window.getComputedStyle(getPopup()).width);
                new MutationObserver((function outputsize() {
                    var contentWidth = textarea.offsetWidth + getPadding(getPopup()) + getPadding(getContent());
                    getPopup().style.width = contentWidth > initialPopupWidth ? "".concat(contentWidth, "px") : null;
                })).observe(textarea, {
                    attributes: !0,
                    attributeFilter: [ "style" ]
                });
            }
            return textarea;
        };
        var renderContent = function renderContent(instance, params) {
            var htmlContainer = getHtmlContainer();
            applyCustomClass(htmlContainer, params, "htmlContainer"), params.html ? (parseHtmlToContainer(params.html, htmlContainer),
            show(htmlContainer, "block")) : params.text ? (htmlContainer.textContent = params.text,
            show(htmlContainer, "block")) : hide(htmlContainer), renderInput(instance, params),
            applyCustomClass(getContent(), params, "content");
        }, renderFooter = function renderFooter(instance, params) {
            var footer = getFooter();
            toggle(footer, params.footer), params.footer && parseHtmlToContainer(params.footer, footer),
            applyCustomClass(footer, params, "footer");
        }, renderCloseButton = function renderCloseButton(instance, params) {
            var closeButton = getCloseButton();
            setInnerHtml(closeButton, params.closeButtonHtml), applyCustomClass(closeButton, params, "closeButton"),
            toggle(closeButton, params.showCloseButton), closeButton.setAttribute("aria-label", params.closeButtonAriaLabel);
        }, renderIcon = function renderIcon(instance, params) {
            var innerParams = privateProps.innerParams.get(instance), icon = getIcon();
            return innerParams && params.icon === innerParams.icon ? (setContent(icon, params),
            void applyStyles(icon, params)) : params.icon || params.iconHtml ? params.icon && -1 === Object.keys(iconTypes).indexOf(params.icon) ? (error('Unknown icon! Expected "success", "error", "warning", "info" or "question", got "'.concat(params.icon, '"')),
            hide(icon)) : (show(icon), setContent(icon, params), applyStyles(icon, params),
            void addClass(icon, params.showClass.icon)) : hide(icon);
        }, applyStyles = function applyStyles(icon, params) {
            for (var iconType in iconTypes) params.icon !== iconType && removeClass(icon, iconTypes[iconType]);
            addClass(icon, iconTypes[params.icon]), setColor(icon, params), adjustSuccessIconBackgoundColor(),
            applyCustomClass(icon, params, "icon");
        }, adjustSuccessIconBackgoundColor = function adjustSuccessIconBackgoundColor() {
            for (var popup = getPopup(), popupBackgroundColor = window.getComputedStyle(popup).getPropertyValue("background-color"), successIconParts = popup.querySelectorAll("[class^=swal2-success-circular-line], .swal2-success-fix"), i = 0; i < successIconParts.length; i++) successIconParts[i].style.backgroundColor = popupBackgroundColor;
        }, setContent = function setContent(icon, params) {
            icon.textContent = "", params.iconHtml ? setInnerHtml(icon, iconContent(params.iconHtml)) : "success" === params.icon ? setInnerHtml(icon, '\n      <div class="swal2-success-circular-line-left"></div>\n      <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>\n      <div class="swal2-success-ring"></div> <div class="swal2-success-fix"></div>\n      <div class="swal2-success-circular-line-right"></div>\n    ') : "error" === params.icon ? setInnerHtml(icon, '\n      <span class="swal2-x-mark">\n        <span class="swal2-x-mark-line-left"></span>\n        <span class="swal2-x-mark-line-right"></span>\n      </span>\n    ') : setInnerHtml(icon, iconContent({
                question: "?",
                warning: "!",
                info: "i"
            }[params.icon]));
        }, setColor = function setColor(icon, params) {
            if (params.iconColor) {
                icon.style.color = params.iconColor, icon.style.borderColor = params.iconColor;
                for (var _i = 0, _arr = [ ".swal2-success-line-tip", ".swal2-success-line-long", ".swal2-x-mark-line-left", ".swal2-x-mark-line-right" ]; _i < _arr.length; _i++) {
                    var sel = _arr[_i];
                    setStyle(icon, sel, "backgroundColor", params.iconColor);
                }
                setStyle(icon, ".swal2-success-ring", "borderColor", params.iconColor);
            }
        }, iconContent = function iconContent(content) {
            return '<div class="'.concat(swalClasses["icon-content"], '">').concat(content, "</div>");
        }, renderImage = function renderImage(instance, params) {
            var image = getImage();
            if (!params.imageUrl) return hide(image);
            show(image, ""), image.setAttribute("src", params.imageUrl), image.setAttribute("alt", params.imageAlt),
            applyNumericalStyle(image, "width", params.imageWidth), applyNumericalStyle(image, "height", params.imageHeight),
            image.className = swalClasses.image, applyCustomClass(image, params, "image");
        }, currentSteps = [], queue = function queue(steps) {
            warnAboutDeprecation("Swal.queue()", "async/await");
            var Swal = this;
            currentSteps = steps;
            var resetAndResolve = function resetAndResolve(resolve, value) {
                currentSteps = [], resolve(value);
            }, queueResult = [];
            return new Promise((function(resolve) {
                !function step(i, callback) {
                    i < currentSteps.length ? (document.body.setAttribute("data-swal2-queue-step", i),
                    Swal.fire(currentSteps[i]).then((function(result) {
                        void 0 !== result.value ? (queueResult.push(result.value), step(i + 1, callback)) : resetAndResolve(resolve, {
                            dismiss: result.dismiss
                        });
                    }))) : resetAndResolve(resolve, {
                        value: queueResult
                    });
                }(0);
            }));
        }, getQueueStep = function getQueueStep() {
            return getContainer() && getContainer().getAttribute("data-queue-step");
        }, insertQueueStep = function insertQueueStep(step, index) {
            return index && index < currentSteps.length ? currentSteps.splice(index, 0, step) : currentSteps.push(step);
        }, deleteQueueStep = function deleteQueueStep(index) {
            void 0 !== currentSteps[index] && currentSteps.splice(index, 1);
        }, createStepElement = function createStepElement(step) {
            var stepEl = document.createElement("li");
            return addClass(stepEl, swalClasses["progress-step"]), setInnerHtml(stepEl, step),
            stepEl;
        }, createLineElement = function createLineElement(params) {
            var lineEl = document.createElement("li");
            return addClass(lineEl, swalClasses["progress-step-line"]), params.progressStepsDistance && (lineEl.style.width = params.progressStepsDistance),
            lineEl;
        }, renderProgressSteps = function renderProgressSteps(instance, params) {
            var progressStepsContainer = getProgressSteps();
            if (!params.progressSteps || 0 === params.progressSteps.length) return hide(progressStepsContainer);
            show(progressStepsContainer), progressStepsContainer.textContent = "";
            var currentProgressStep = parseInt(void 0 === params.currentProgressStep ? getQueueStep() : params.currentProgressStep);
            currentProgressStep >= params.progressSteps.length && warn("Invalid currentProgressStep parameter, it should be less than progressSteps.length (currentProgressStep like JS arrays starts from 0)"),
            params.progressSteps.forEach((function(step, index) {
                var stepEl = createStepElement(step);
                if (progressStepsContainer.appendChild(stepEl), index === currentProgressStep && addClass(stepEl, swalClasses["active-progress-step"]),
                index !== params.progressSteps.length - 1) {
                    var lineEl = createLineElement(params);
                    progressStepsContainer.appendChild(lineEl);
                }
            }));
        }, renderTitle = function renderTitle(instance, params) {
            var title = getTitle();
            toggle(title, params.title || params.titleText, "block"), params.title && parseHtmlToContainer(params.title, title),
            params.titleText && (title.innerText = params.titleText), applyCustomClass(title, params, "title");
        }, renderHeader = function renderHeader(instance, params) {
            var header = getHeader();
            applyCustomClass(header, params, "header"), renderProgressSteps(instance, params),
            renderIcon(instance, params), renderImage(instance, params), renderTitle(instance, params),
            renderCloseButton(instance, params);
        }, renderPopup = function renderPopup(instance, params) {
            var container = getContainer(), popup = getPopup();
            params.toast ? (applyNumericalStyle(container, "width", params.width), popup.style.width = "100%") : applyNumericalStyle(popup, "width", params.width),
            applyNumericalStyle(popup, "padding", params.padding), params.background && (popup.style.background = params.background),
            hide(getValidationMessage()), addClasses(popup, params);
        }, addClasses = function addClasses(popup, params) {
            popup.className = "".concat(swalClasses.popup, " ").concat(isVisible(popup) ? params.showClass.popup : ""),
            params.toast ? (addClass([ document.documentElement, document.body ], swalClasses["toast-shown"]),
            addClass(popup, swalClasses.toast)) : addClass(popup, swalClasses.modal), applyCustomClass(popup, params, "popup"),
            "string" == typeof params.customClass && addClass(popup, params.customClass), params.icon && addClass(popup, swalClasses["icon-".concat(params.icon)]);
        }, render = function render(instance, params) {
            renderPopup(instance, params), renderContainer(instance, params), renderHeader(instance, params),
            renderContent(instance, params), renderActions(instance, params), renderFooter(instance, params),
            "function" == typeof params.didRender ? params.didRender(getPopup()) : "function" == typeof params.onRender && params.onRender(getPopup());
        }, isVisible$1 = function isVisible$$1() {
            return isVisible(getPopup());
        }, clickConfirm = function clickConfirm() {
            return getConfirmButton() && getConfirmButton().click();
        }, clickDeny = function clickDeny() {
            return getDenyButton() && getDenyButton().click();
        }, clickCancel = function clickCancel() {
            return getCancelButton() && getCancelButton().click();
        };
        function fire() {
            for (var Swal = this, _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
            return _construct(Swal, args);
        }
        function mixin(mixinParams) {
            var MixinSwal = function(_this) {
                _inherits(MixinSwal, _this);
                var _super = _createSuper(MixinSwal);
                function MixinSwal() {
                    return _classCallCheck(this, MixinSwal), _super.apply(this, arguments);
                }
                return _createClass(MixinSwal, [ {
                    key: "_main",
                    value: function _main(params, priorityMixinParams) {
                        return _get(_getPrototypeOf(MixinSwal.prototype), "_main", this).call(this, params, _extends({}, mixinParams, priorityMixinParams));
                    }
                } ]), MixinSwal;
            }(this);
            return MixinSwal;
        }
        var showLoading = function showLoading(buttonToReplace) {
            var popup = getPopup();
            popup || Swal.fire(), popup = getPopup();
            var actions = getActions(), loader = getLoader();
            !buttonToReplace && isVisible(getConfirmButton()) && (buttonToReplace = getConfirmButton()),
            show(actions), buttonToReplace && (hide(buttonToReplace), loader.setAttribute("data-button-to-replace", buttonToReplace.className)),
            loader.parentNode.insertBefore(loader, buttonToReplace), addClass([ popup, actions ], swalClasses.loading),
            show(loader), popup.setAttribute("data-loading", !0), popup.setAttribute("aria-busy", !0),
            popup.focus();
        }, RESTORE_FOCUS_TIMEOUT = 100, globalState = {}, focusPreviousActiveElement = function focusPreviousActiveElement() {
            globalState.previousActiveElement && globalState.previousActiveElement.focus ? (globalState.previousActiveElement.focus(),
            globalState.previousActiveElement = null) : document.body && document.body.focus();
        }, restoreActiveElement = function restoreActiveElement(returnFocus) {
            return new Promise((function(resolve) {
                if (!returnFocus) return resolve();
                var x = window.scrollX, y = window.scrollY;
                globalState.restoreFocusTimeout = setTimeout((function() {
                    focusPreviousActiveElement(), resolve();
                }), RESTORE_FOCUS_TIMEOUT), void 0 !== x && void 0 !== y && window.scrollTo(x, y);
            }));
        }, getTimerLeft = function getTimerLeft() {
            return globalState.timeout && globalState.timeout.getTimerLeft();
        }, stopTimer = function stopTimer() {
            if (globalState.timeout) return stopTimerProgressBar(), globalState.timeout.stop();
        }, resumeTimer = function resumeTimer() {
            if (globalState.timeout) {
                var remaining = globalState.timeout.start();
                return animateTimerProgressBar(remaining), remaining;
            }
        }, toggleTimer = function toggleTimer() {
            var timer = globalState.timeout;
            return timer && (timer.running ? stopTimer() : resumeTimer());
        }, increaseTimer = function increaseTimer(n) {
            if (globalState.timeout) {
                var remaining = globalState.timeout.increase(n);
                return animateTimerProgressBar(remaining, !0), remaining;
            }
        }, isTimerRunning = function isTimerRunning() {
            return globalState.timeout && globalState.timeout.isRunning();
        }, bodyClickListenerAdded = !1, clickHandlers = {};
        function bindClickHandler() {
            clickHandlers[arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "data-swal-template"] = this,
            bodyClickListenerAdded || (document.body.addEventListener("click", bodyClickListener),
            bodyClickListenerAdded = !0);
        }
        var bodyClickListener = function bodyClickListener(event) {
            for (var el = event.target; el && el !== document; el = el.parentNode) for (var attr in clickHandlers) {
                var template = el.getAttribute(attr);
                if (template) return void clickHandlers[attr].fire({
                    template: template
                });
            }
        }, defaultParams = {
            title: "",
            titleText: "",
            text: "",
            html: "",
            footer: "",
            icon: void 0,
            iconColor: void 0,
            iconHtml: void 0,
            template: void 0,
            toast: !1,
            animation: !0,
            showClass: {
                popup: "swal2-show",
                backdrop: "swal2-backdrop-show",
                icon: "swal2-icon-show"
            },
            hideClass: {
                popup: "swal2-hide",
                backdrop: "swal2-backdrop-hide",
                icon: "swal2-icon-hide"
            },
            customClass: {},
            target: "body",
            backdrop: !0,
            heightAuto: !0,
            allowOutsideClick: !0,
            allowEscapeKey: !0,
            allowEnterKey: !0,
            stopKeydownPropagation: !0,
            keydownListenerCapture: !1,
            showConfirmButton: !0,
            showDenyButton: !1,
            showCancelButton: !1,
            preConfirm: void 0,
            preDeny: void 0,
            confirmButtonText: "OK",
            confirmButtonAriaLabel: "",
            confirmButtonColor: void 0,
            denyButtonText: "No",
            denyButtonAriaLabel: "",
            denyButtonColor: void 0,
            cancelButtonText: "Cancel",
            cancelButtonAriaLabel: "",
            cancelButtonColor: void 0,
            buttonsStyling: !0,
            reverseButtons: !1,
            focusConfirm: !0,
            focusDeny: !1,
            focusCancel: !1,
            returnFocus: !0,
            showCloseButton: !1,
            closeButtonHtml: "&times;",
            closeButtonAriaLabel: "Close this dialog",
            loaderHtml: "",
            showLoaderOnConfirm: !1,
            showLoaderOnDeny: !1,
            imageUrl: void 0,
            imageWidth: void 0,
            imageHeight: void 0,
            imageAlt: "",
            timer: void 0,
            timerProgressBar: !1,
            width: void 0,
            padding: void 0,
            background: void 0,
            input: void 0,
            inputPlaceholder: "",
            inputLabel: "",
            inputValue: "",
            inputOptions: {},
            inputAutoTrim: !0,
            inputAttributes: {},
            inputValidator: void 0,
            returnInputValueOnDeny: !1,
            validationMessage: void 0,
            grow: !1,
            position: "center",
            progressSteps: [],
            currentProgressStep: void 0,
            progressStepsDistance: void 0,
            onBeforeOpen: void 0,
            onOpen: void 0,
            willOpen: void 0,
            didOpen: void 0,
            onRender: void 0,
            didRender: void 0,
            onClose: void 0,
            onAfterClose: void 0,
            willClose: void 0,
            didClose: void 0,
            onDestroy: void 0,
            didDestroy: void 0,
            scrollbarPadding: !0
        }, updatableParams = [ "allowEscapeKey", "allowOutsideClick", "background", "buttonsStyling", "cancelButtonAriaLabel", "cancelButtonColor", "cancelButtonText", "closeButtonAriaLabel", "closeButtonHtml", "confirmButtonAriaLabel", "confirmButtonColor", "confirmButtonText", "currentProgressStep", "customClass", "denyButtonAriaLabel", "denyButtonColor", "denyButtonText", "didClose", "didDestroy", "footer", "hideClass", "html", "icon", "iconColor", "iconHtml", "imageAlt", "imageHeight", "imageUrl", "imageWidth", "onAfterClose", "onClose", "onDestroy", "progressSteps", "returnFocus", "reverseButtons", "showCancelButton", "showCloseButton", "showConfirmButton", "showDenyButton", "text", "title", "titleText", "willClose" ], deprecatedParams = {
            animation: 'showClass" and "hideClass',
            onBeforeOpen: "willOpen",
            onOpen: "didOpen",
            onRender: "didRender",
            onClose: "willClose",
            onAfterClose: "didClose",
            onDestroy: "didDestroy"
        }, toastIncompatibleParams = [ "allowOutsideClick", "allowEnterKey", "backdrop", "focusConfirm", "focusDeny", "focusCancel", "returnFocus", "heightAuto", "keydownListenerCapture" ], isValidParameter = function isValidParameter(paramName) {
            return Object.prototype.hasOwnProperty.call(defaultParams, paramName);
        }, isUpdatableParameter = function isUpdatableParameter(paramName) {
            return -1 !== updatableParams.indexOf(paramName);
        }, isDeprecatedParameter = function isDeprecatedParameter(paramName) {
            return deprecatedParams[paramName];
        }, checkIfParamIsValid = function checkIfParamIsValid(param) {
            isValidParameter(param) || warn('Unknown parameter "'.concat(param, '"'));
        }, checkIfToastParamIsValid = function checkIfToastParamIsValid(param) {
            -1 !== toastIncompatibleParams.indexOf(param) && warn('The parameter "'.concat(param, '" is incompatible with toasts'));
        }, checkIfParamIsDeprecated = function checkIfParamIsDeprecated(param) {
            isDeprecatedParameter(param) && warnAboutDeprecation(param, isDeprecatedParameter(param));
        }, showWarningsForParams = function showWarningsForParams(params) {
            for (var param in params) checkIfParamIsValid(param), params.toast && checkIfToastParamIsValid(param),
            checkIfParamIsDeprecated(param);
        }, staticMethods = Object.freeze({
            isValidParameter: isValidParameter,
            isUpdatableParameter: isUpdatableParameter,
            isDeprecatedParameter: isDeprecatedParameter,
            argsToParams: argsToParams,
            isVisible: isVisible$1,
            clickConfirm: clickConfirm,
            clickDeny: clickDeny,
            clickCancel: clickCancel,
            getContainer: getContainer,
            getPopup: getPopup,
            getTitle: getTitle,
            getContent: getContent,
            getHtmlContainer: getHtmlContainer,
            getImage: getImage,
            getIcon: getIcon,
            getInputLabel: getInputLabel,
            getCloseButton: getCloseButton,
            getActions: getActions,
            getConfirmButton: getConfirmButton,
            getDenyButton: getDenyButton,
            getCancelButton: getCancelButton,
            getLoader: getLoader,
            getHeader: getHeader,
            getFooter: getFooter,
            getTimerProgressBar: getTimerProgressBar,
            getFocusableElements: getFocusableElements,
            getValidationMessage: getValidationMessage,
            isLoading: isLoading,
            fire: fire,
            mixin: mixin,
            queue: queue,
            getQueueStep: getQueueStep,
            insertQueueStep: insertQueueStep,
            deleteQueueStep: deleteQueueStep,
            showLoading: showLoading,
            enableLoading: showLoading,
            getTimerLeft: getTimerLeft,
            stopTimer: stopTimer,
            resumeTimer: resumeTimer,
            toggleTimer: toggleTimer,
            increaseTimer: increaseTimer,
            isTimerRunning: isTimerRunning,
            bindClickHandler: bindClickHandler
        });
        function hideLoading() {
            if (privateProps.innerParams.get(this)) {
                var domCache = privateProps.domCache.get(this);
                hide(domCache.loader);
                var buttonToReplace = domCache.popup.getElementsByClassName(domCache.loader.getAttribute("data-button-to-replace"));
                buttonToReplace.length ? show(buttonToReplace[0], "inline-block") : allButtonsAreHidden() && hide(domCache.actions),
                removeClass([ domCache.popup, domCache.actions ], swalClasses.loading), domCache.popup.removeAttribute("aria-busy"),
                domCache.popup.removeAttribute("data-loading"), domCache.confirmButton.disabled = !1,
                domCache.denyButton.disabled = !1, domCache.cancelButton.disabled = !1;
            }
        }
        function getInput$1(instance) {
            var innerParams = privateProps.innerParams.get(instance || this), domCache = privateProps.domCache.get(instance || this);
            return domCache ? getInput(domCache.content, innerParams.input) : null;
        }
        var fixScrollbar = function fixScrollbar() {
            null === states.previousBodyPadding && document.body.scrollHeight > window.innerHeight && (states.previousBodyPadding = parseInt(window.getComputedStyle(document.body).getPropertyValue("padding-right")),
            document.body.style.paddingRight = "".concat(states.previousBodyPadding + measureScrollbar(), "px"));
        }, undoScrollbar = function undoScrollbar() {
            null !== states.previousBodyPadding && (document.body.style.paddingRight = "".concat(states.previousBodyPadding, "px"),
            states.previousBodyPadding = null);
        }, iOSfix = function iOSfix() {
            if ((/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream || "MacIntel" === navigator.platform && navigator.maxTouchPoints > 1) && !hasClass(document.body, swalClasses.iosfix)) {
                var offset = document.body.scrollTop;
                document.body.style.top = "".concat(-1 * offset, "px"), addClass(document.body, swalClasses.iosfix),
                lockBodyScroll(), addBottomPaddingForTallPopups();
            }
        }, addBottomPaddingForTallPopups = function addBottomPaddingForTallPopups() {
            if (!navigator.userAgent.match(/(CriOS|FxiOS|EdgiOS|YaBrowser|UCBrowser)/i)) {
                var bottomPanelHeight = 44;
                getPopup().scrollHeight > window.innerHeight - bottomPanelHeight && (getContainer().style.paddingBottom = "".concat(bottomPanelHeight, "px"));
            }
        }, lockBodyScroll = function lockBodyScroll() {
            var preventTouchMove, container = getContainer();
            container.ontouchstart = function(e) {
                preventTouchMove = shouldPreventTouchMove(e);
            }, container.ontouchmove = function(e) {
                preventTouchMove && (e.preventDefault(), e.stopPropagation());
            };
        }, shouldPreventTouchMove = function shouldPreventTouchMove(event) {
            var target = event.target, container = getContainer();
            return !(isStylys(event) || isZoom(event) || target !== container && (isScrollable(container) || "INPUT" === target.tagName || isScrollable(getContent()) && getContent().contains(target)));
        }, isStylys = function isStylys(event) {
            return event.touches && event.touches.length && "stylus" === event.touches[0].touchType;
        }, isZoom = function isZoom(event) {
            return event.touches && event.touches.length > 1;
        }, undoIOSfix = function undoIOSfix() {
            if (hasClass(document.body, swalClasses.iosfix)) {
                var offset = parseInt(document.body.style.top, 10);
                removeClass(document.body, swalClasses.iosfix), document.body.style.top = "", document.body.scrollTop = -1 * offset;
            }
        }, isIE11 = function isIE11() {
            return !!window.MSInputMethodContext && !!document.documentMode;
        }, fixVerticalPositionIE = function fixVerticalPositionIE() {
            var container = getContainer(), popup = getPopup();
            container.style.removeProperty("align-items"), popup.offsetTop < 0 && (container.style.alignItems = "flex-start");
        }, IEfix = function IEfix() {
            "undefined" != typeof window && isIE11() && (fixVerticalPositionIE(), window.addEventListener("resize", fixVerticalPositionIE));
        }, undoIEfix = function undoIEfix() {
            "undefined" != typeof window && isIE11() && window.removeEventListener("resize", fixVerticalPositionIE);
        }, setAriaHidden = function setAriaHidden() {
            toArray(document.body.children).forEach((function(el) {
                el === getContainer() || contains(el, getContainer()) || (el.hasAttribute("aria-hidden") && el.setAttribute("data-previous-aria-hidden", el.getAttribute("aria-hidden")),
                el.setAttribute("aria-hidden", "true"));
            }));
        }, unsetAriaHidden = function unsetAriaHidden() {
            toArray(document.body.children).forEach((function(el) {
                el.hasAttribute("data-previous-aria-hidden") ? (el.setAttribute("aria-hidden", el.getAttribute("data-previous-aria-hidden")),
                el.removeAttribute("data-previous-aria-hidden")) : el.removeAttribute("aria-hidden");
            }));
        }, privateMethods = {
            swalPromiseResolve: new WeakMap
        };
        function removePopupAndResetState(instance, container, returnFocus, didClose) {
            isToast() ? triggerDidCloseAndDispose(instance, didClose) : (restoreActiveElement(returnFocus).then((function() {
                return triggerDidCloseAndDispose(instance, didClose);
            })), globalState.keydownTarget.removeEventListener("keydown", globalState.keydownHandler, {
                capture: globalState.keydownListenerCapture
            }), globalState.keydownHandlerAdded = !1), container.parentNode && !document.body.getAttribute("data-swal2-queue-step") && container.parentNode.removeChild(container),
            isModal() && (undoScrollbar(), undoIOSfix(), undoIEfix(), unsetAriaHidden()), removeBodyClasses();
        }
        function removeBodyClasses() {
            removeClass([ document.documentElement, document.body ], [ swalClasses.shown, swalClasses["height-auto"], swalClasses["no-backdrop"], swalClasses["toast-shown"] ]);
        }
        function close(resolveValue) {
            var popup = getPopup();
            if (popup) {
                resolveValue = prepareResolveValue(resolveValue);
                var innerParams = privateProps.innerParams.get(this);
                if (innerParams && !hasClass(popup, innerParams.hideClass.popup)) {
                    var swalPromiseResolve = privateMethods.swalPromiseResolve.get(this);
                    removeClass(popup, innerParams.showClass.popup), addClass(popup, innerParams.hideClass.popup);
                    var backdrop = getContainer();
                    removeClass(backdrop, innerParams.showClass.backdrop), addClass(backdrop, innerParams.hideClass.backdrop),
                    handlePopupAnimation(this, popup, innerParams), swalPromiseResolve(resolveValue);
                }
            }
        }
        var prepareResolveValue = function prepareResolveValue(resolveValue) {
            return void 0 === resolveValue ? {
                isConfirmed: !1,
                isDenied: !1,
                isDismissed: !0
            } : _extends({
                isConfirmed: !1,
                isDenied: !1,
                isDismissed: !1
            }, resolveValue);
        }, handlePopupAnimation = function handlePopupAnimation(instance, popup, innerParams) {
            var container = getContainer(), animationIsSupported = animationEndEvent && hasCssAnimation(popup), onClose = innerParams.onClose, onAfterClose = innerParams.onAfterClose, willClose = innerParams.willClose, didClose = innerParams.didClose;
            runDidClose(popup, willClose, onClose), animationIsSupported ? animatePopup(instance, popup, container, innerParams.returnFocus, didClose || onAfterClose) : removePopupAndResetState(instance, container, innerParams.returnFocus, didClose || onAfterClose);
        }, runDidClose = function runDidClose(popup, willClose, onClose) {
            null !== willClose && "function" == typeof willClose ? willClose(popup) : null !== onClose && "function" == typeof onClose && onClose(popup);
        }, animatePopup = function animatePopup(instance, popup, container, returnFocus, didClose) {
            globalState.swalCloseEventFinishedCallback = removePopupAndResetState.bind(null, instance, container, returnFocus, didClose),
            popup.addEventListener(animationEndEvent, (function(e) {
                e.target === popup && (globalState.swalCloseEventFinishedCallback(), delete globalState.swalCloseEventFinishedCallback);
            }));
        }, triggerDidCloseAndDispose = function triggerDidCloseAndDispose(instance, didClose) {
            setTimeout((function() {
                "function" == typeof didClose && didClose(), instance._destroy();
            }));
        };
        function setButtonsDisabled(instance, buttons, disabled) {
            var domCache = privateProps.domCache.get(instance);
            buttons.forEach((function(button) {
                domCache[button].disabled = disabled;
            }));
        }
        function setInputDisabled(input, disabled) {
            if (!input) return !1;
            if ("radio" === input.type) for (var radios = input.parentNode.parentNode.querySelectorAll("input"), i = 0; i < radios.length; i++) radios[i].disabled = disabled; else input.disabled = disabled;
        }
        function enableButtons() {
            setButtonsDisabled(this, [ "confirmButton", "denyButton", "cancelButton" ], !1);
        }
        function disableButtons() {
            setButtonsDisabled(this, [ "confirmButton", "denyButton", "cancelButton" ], !0);
        }
        function enableInput() {
            return setInputDisabled(this.getInput(), !1);
        }
        function disableInput() {
            return setInputDisabled(this.getInput(), !0);
        }
        function showValidationMessage(error) {
            var domCache = privateProps.domCache.get(this), params = privateProps.innerParams.get(this);
            setInnerHtml(domCache.validationMessage, error), domCache.validationMessage.className = swalClasses["validation-message"],
            params.customClass && params.customClass.validationMessage && addClass(domCache.validationMessage, params.customClass.validationMessage),
            show(domCache.validationMessage);
            var input = this.getInput();
            input && (input.setAttribute("aria-invalid", !0), input.setAttribute("aria-describedBy", swalClasses["validation-message"]),
            focusInput(input), addClass(input, swalClasses.inputerror));
        }
        function resetValidationMessage$1() {
            var domCache = privateProps.domCache.get(this);
            domCache.validationMessage && hide(domCache.validationMessage);
            var input = this.getInput();
            input && (input.removeAttribute("aria-invalid"), input.removeAttribute("aria-describedBy"),
            removeClass(input, swalClasses.inputerror));
        }
        function getProgressSteps$1() {
            return privateProps.domCache.get(this).progressSteps;
        }
        var Timer = function() {
            function Timer(callback, delay) {
                _classCallCheck(this, Timer), this.callback = callback, this.remaining = delay,
                this.running = !1, this.start();
            }
            return _createClass(Timer, [ {
                key: "start",
                value: function start() {
                    return this.running || (this.running = !0, this.started = new Date, this.id = setTimeout(this.callback, this.remaining)),
                    this.remaining;
                }
            }, {
                key: "stop",
                value: function stop() {
                    return this.running && (this.running = !1, clearTimeout(this.id), this.remaining -= new Date - this.started),
                    this.remaining;
                }
            }, {
                key: "increase",
                value: function increase(n) {
                    var running = this.running;
                    return running && this.stop(), this.remaining += n, running && this.start(), this.remaining;
                }
            }, {
                key: "getTimerLeft",
                value: function getTimerLeft() {
                    return this.running && (this.stop(), this.start()), this.remaining;
                }
            }, {
                key: "isRunning",
                value: function isRunning() {
                    return this.running;
                }
            } ]), Timer;
        }(), defaultInputValidators = {
            email: function email(string, validationMessage) {
                return /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]{2,24}$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || "Invalid email address");
            },
            url: function url(string, validationMessage) {
                return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || "Invalid URL");
            }
        };
        function setDefaultInputValidators(params) {
            params.inputValidator || Object.keys(defaultInputValidators).forEach((function(key) {
                params.input === key && (params.inputValidator = defaultInputValidators[key]);
            }));
        }
		    let initButtonEvent = function () {
        console.log('\u6316\u6398\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u597d\u597d\u597d\u559d\u7ea2\u9152\u53bb\u653b\u51fb\u540e\u536b\u560e\u54c8\u51e0\u4f4d\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5');
        let pageType = getPageType();
        let yunData = getYunData();
        if (!yunData && pageType != 'new') {
            showLogin();
            return;
        }
        if (pageType === 'share') {
            showTipErrorSwal('\u5fc5\u987b\u5148\u8f6c\u5b58\u5230\u81ea\u5df1\u7f51\u76d8\u4e2d\uff0c\u7136\u540e\u8fdb\u5165\u7f51\u76d8\u8fdb\u884c\u4e0b\u8f7d\uff01');
            console.log('\u5fc5\u987b\u5148\u8f6c\u5b58\u5230\u81ea\u5df1\u7f51\u76d8\u4e2d');
            showShareSave();
        } else {
            let fileList = getSelectedFileList();
            let fileStat = getFileListStat(fileList);
            if (fileList.length) {
                if (fileStat.file_num > 1 || fileStat.dir_num > 0) {
                    showTipError('\u8bf7\u9009\u62e9\u4e00\u4e2a\u6587\u4ef6\u8fdb\u884c\u4e0b\u8f7d\uff08\u6682\u65f6\u4e0d\u652f\u6301\u6587\u4ef6\u5939\u548c\u591a\u6587\u4ef6\u6279\u91cf\u4e0b\u8f7d\uff09')
                }
                if (fileStat.dir_num == 0 && fileStat.file_num == 1) {
                    showDownloadDialog(fileList, fileStat);
                    setShareCompleteState();
                }
            } else {
                showTipErrorSwal('\u8bf7\u9009\u62e9\u4e00\u4e2a\u6587\u4ef6\u8fdb\u884c\u4e0b\u8f7d');
            }
        }
    };
        function validateCustomTargetElement(params) {
            (!params.target || "string" == typeof params.target && !document.querySelector(params.target) || "string" != typeof params.target && !params.target.appendChild) && (warn('Target parameter is not valid, defaulting to "body"'),
            params.target = "body");
        }
        function setParameters(params) {
            setDefaultInputValidators(params), params.showLoaderOnConfirm && !params.preConfirm && warn("showLoaderOnConfirm is set to true, but preConfirm is not defined.\nshowLoaderOnConfirm should be used together with preConfirm, see usage example:\nhttps://sweetalert2.github.io/#ajax-request"),
            params.animation = callIfFunction(params.animation), validateCustomTargetElement(params),
            "string" == typeof params.title && (params.title = params.title.split("\n").join("<br />")),
            init(params);
        }
        var swalStringParams = [ "swal-title", "swal-html", "swal-footer" ], getTemplateParams = function getTemplateParams(params) {
            var template = "string" == typeof params.template ? document.querySelector(params.template) : params.template;
            if (!template) return {};
            var templateContent = template.content || template;
            return showWarningsForElements(templateContent), _extends(getSwalParams(templateContent), getSwalButtons(templateContent), getSwalImage(templateContent), getSwalIcon(templateContent), getSwalInput(templateContent), getSwalStringParams(templateContent, swalStringParams));
        }, getSwalParams = function getSwalParams(templateContent) {
            var result = {};
            return toArray(templateContent.querySelectorAll("swal-param")).forEach((function(param) {
                showWarningsForAttributes(param, [ "name", "value" ]);
                var paramName = param.getAttribute("name"), value = param.getAttribute("value");
                "boolean" == typeof defaultParams[paramName] && "false" === value && (value = !1),
                "object" === _typeof(defaultParams[paramName]) && (value = JSON.parse(value)), result[paramName] = value;
            })), result;
        }, getSwalButtons = function getSwalButtons(templateContent) {
            var result = {};
            return toArray(templateContent.querySelectorAll("swal-button")).forEach((function(button) {
                showWarningsForAttributes(button, [ "type", "color", "aria-label" ]);
                var type = button.getAttribute("type");
                result["".concat(type, "ButtonText")] = button.innerHTML, result["show".concat(capitalizeFirstLetter(type), "Button")] = !0,
                button.hasAttribute("color") && (result["".concat(type, "ButtonColor")] = button.getAttribute("color")),
                button.hasAttribute("aria-label") && (result["".concat(type, "ButtonAriaLabel")] = button.getAttribute("aria-label"));
            })), result;
        }, getSwalImage = function getSwalImage(templateContent) {
            var result = {}, image = templateContent.querySelector("swal-image");
            return image && (showWarningsForAttributes(image, [ "src", "width", "height", "alt" ]),
            image.hasAttribute("src") && (result.imageUrl = image.getAttribute("src")), image.hasAttribute("width") && (result.imageWidth = image.getAttribute("width")),
            image.hasAttribute("height") && (result.imageHeight = image.getAttribute("height")),
            image.hasAttribute("alt") && (result.imageAlt = image.getAttribute("alt"))), result;
        }, getSwalIcon = function getSwalIcon(templateContent) {
            var result = {}, icon = templateContent.querySelector("swal-icon");
            return icon && (showWarningsForAttributes(icon, [ "type", "color" ]), icon.hasAttribute("type") && (result.icon = icon.getAttribute("type")),
            icon.hasAttribute("color") && (result.iconColor = icon.getAttribute("color")), result.iconHtml = icon.innerHTML),
            result;
        }, getSwalInput = function getSwalInput(templateContent) {
            var result = {}, input = templateContent.querySelector("swal-input");
            input && (showWarningsForAttributes(input, [ "type", "label", "placeholder", "value" ]),
            result.input = input.getAttribute("type") || "text", input.hasAttribute("label") && (result.inputLabel = input.getAttribute("label")),
            input.hasAttribute("placeholder") && (result.inputPlaceholder = input.getAttribute("placeholder")),
            input.hasAttribute("value") && (result.inputValue = input.getAttribute("value")));
            var inputOptions = templateContent.querySelectorAll("swal-input-option");
            return inputOptions.length && (result.inputOptions = {}, toArray(inputOptions).forEach((function(option) {
                showWarningsForAttributes(option, [ "value" ]);
                var optionValue = option.getAttribute("value"), optionName = option.innerHTML;
                result.inputOptions[optionValue] = optionName;
            }))), result;
        }, getSwalStringParams = function getSwalStringParams(templateContent, paramNames) {
            var result = {};
            for (var i in paramNames) {
                var paramName = paramNames[i], tag = templateContent.querySelector(paramName);
                tag && (showWarningsForAttributes(tag, []), result[paramName.replace(/^swal-/, "")] = tag.innerHTML.trim());
            }
            return result;
        }, showWarningsForElements = function showWarningsForElements(template) {
            var allowedElements = swalStringParams.concat([ "swal-param", "swal-button", "swal-image", "swal-icon", "swal-input", "swal-input-option" ]);
            toArray(template.querySelectorAll("*")).forEach((function(el) {
                if (el.parentNode === template) {
                    var tagName = el.tagName.toLowerCase();
                    -1 === allowedElements.indexOf(tagName) && warn("Unrecognized element <".concat(tagName, ">"));
                }
            }));
        }, showWarningsForAttributes = function showWarningsForAttributes(el, allowedAttributes) {
            toArray(el.attributes).forEach((function(attribute) {
                -1 === allowedAttributes.indexOf(attribute.name) && warn([ 'Unrecognized attribute "'.concat(attribute.name, '" on <').concat(el.tagName.toLowerCase(), ">."), "".concat(allowedAttributes.length ? "Allowed attributes are: ".concat(allowedAttributes.join(", ")) : "To set the value, use HTML within the element.") ]);
            }));
        }, SHOW_CLASS_TIMEOUT = 10, openPopup = function openPopup(params) {
            var container = getContainer(), popup = getPopup();
            "function" == typeof params.willOpen ? params.willOpen(popup) : "function" == typeof params.onBeforeOpen && params.onBeforeOpen(popup);
            var initialBodyOverflow = window.getComputedStyle(document.body).overflowY;
            addClasses$1(container, popup, params), setTimeout((function() {
                setScrollingVisibility(container, popup);
            }), SHOW_CLASS_TIMEOUT), isModal() && (fixScrollContainer(container, params.scrollbarPadding, initialBodyOverflow),
            setAriaHidden()), isToast() || globalState.previousActiveElement || (globalState.previousActiveElement = document.activeElement),
            runDidOpen(popup, params), removeClass(container, swalClasses["no-transition"]);
        }, runDidOpen = function runDidOpen(popup, params) {
            "function" == typeof params.didOpen ? setTimeout((function() {
                return params.didOpen(popup);
            })) : "function" == typeof params.onOpen && setTimeout((function() {
                return params.onOpen(popup);
            }));
        }, swalOpenAnimationFinished = function swalOpenAnimationFinished(event) {
            var popup = getPopup();
            if (event.target === popup) {
                var container = getContainer();
                popup.removeEventListener(animationEndEvent, swalOpenAnimationFinished), container.style.overflowY = "auto";
            }
        }, setScrollingVisibility = function setScrollingVisibility(container, popup) {
            animationEndEvent && hasCssAnimation(popup) ? (container.style.overflowY = "hidden",
            popup.addEventListener(animationEndEvent, swalOpenAnimationFinished)) : container.style.overflowY = "auto";
        }, fixScrollContainer = function fixScrollContainer(container, scrollbarPadding, initialBodyOverflow) {
            iOSfix(), IEfix(), scrollbarPadding && "hidden" !== initialBodyOverflow && fixScrollbar(),
            setTimeout((function() {
                container.scrollTop = 0;
            }));
        }, addClasses$1 = function addClasses(container, popup, params) {
            addClass(container, params.showClass.backdrop), popup.style.setProperty("opacity", "0", "important"),
            show(popup), setTimeout((function() {
                addClass(popup, params.showClass.popup), popup.style.removeProperty("opacity");
            }), SHOW_CLASS_TIMEOUT), addClass([ document.documentElement, document.body ], swalClasses.shown),
            params.heightAuto && params.backdrop && !params.toast && addClass([ document.documentElement, document.body ], swalClasses["height-auto"]);
        }, handleInputOptionsAndValue = function handleInputOptionsAndValue(instance, params) {
            "select" === params.input || "radio" === params.input ? handleInputOptions(instance, params) : -1 !== [ "text", "email", "number", "tel", "textarea" ].indexOf(params.input) && (hasToPromiseFn(params.inputValue) || isPromise(params.inputValue)) && handleInputValue(instance, params);
        }, getInputValue = function getInputValue(instance, innerParams) {
            var input = instance.getInput();
            if (!input) return null;
            switch (innerParams.input) {
              case "checkbox":
                return getCheckboxValue(input);

              case "radio":
                return getRadioValue(input);

              case "file":
                return getFileValue(input);

              default:
                return innerParams.inputAutoTrim ? input.value.trim() : input.value;
            }
        }, getCheckboxValue = function getCheckboxValue(input) {
            return input.checked ? 1 : 0;
        }, getRadioValue = function getRadioValue(input) {
            return input.checked ? input.value : null;
        }, getFileValue = function getFileValue(input) {
            return input.files.length ? null !== input.getAttribute("multiple") ? input.files : input.files[0] : null;
        }, handleInputOptions = function handleInputOptions(instance, params) {
            var content = getContent(), processInputOptions = function processInputOptions(inputOptions) {
                return populateInputOptions[params.input](content, formatInputOptions(inputOptions), params);
            };
            hasToPromiseFn(params.inputOptions) || isPromise(params.inputOptions) ? (showLoading(getConfirmButton()),
            asPromise(params.inputOptions).then((function(inputOptions) {
                instance.hideLoading(), processInputOptions(inputOptions);
            }))) : "object" === _typeof(params.inputOptions) ? processInputOptions(params.inputOptions) : error("Unexpected type of inputOptions! Expected object, Map or Promise, got ".concat(_typeof(params.inputOptions)));
        }, handleInputValue = function handleInputValue(instance, params) {
            var input = instance.getInput();
            hide(input), asPromise(params.inputValue).then((function(inputValue) {
                input.value = "number" === params.input ? parseFloat(inputValue) || 0 : "".concat(inputValue),
                show(input), input.focus(), instance.hideLoading();
            })).catch((function(err) {
                error("Error in inputValue promise: ".concat(err)), input.value = "", show(input),
                input.focus(), instance.hideLoading();
            }));
        }, populateInputOptions = {
            select: function select(content, inputOptions, params) {
                var select = getChildByClass(content, swalClasses.select), renderOption = function renderOption(parent, optionLabel, optionValue) {
                    var option = document.createElement("option");
                    option.value = optionValue, setInnerHtml(option, optionLabel), option.selected = isSelected(optionValue, params.inputValue),
                    parent.appendChild(option);
                };
                inputOptions.forEach((function(inputOption) {
                    var optionValue = inputOption[0], optionLabel = inputOption[1];
                    if (Array.isArray(optionLabel)) {
                        var optgroup = document.createElement("optgroup");
                        optgroup.label = optionValue, optgroup.disabled = !1, select.appendChild(optgroup),
                        optionLabel.forEach((function(o) {
                            return renderOption(optgroup, o[1], o[0]);
                        }));
                    } else renderOption(select, optionLabel, optionValue);
                })), select.focus();
            },
            radio: function radio(content, inputOptions, params) {
                var radio = getChildByClass(content, swalClasses.radio);
                inputOptions.forEach((function(inputOption) {
                    var radioValue = inputOption[0], radioLabel = inputOption[1], radioInput = document.createElement("input"), radioLabelElement = document.createElement("label");
                    radioInput.type = "radio", radioInput.name = swalClasses.radio, radioInput.value = radioValue,
                    isSelected(radioValue, params.inputValue) && (radioInput.checked = !0);
                    var label = document.createElement("span");
                    setInnerHtml(label, radioLabel), label.className = swalClasses.label, radioLabelElement.appendChild(radioInput),
                    radioLabelElement.appendChild(label), radio.appendChild(radioLabelElement);
                }));
                var radios = radio.querySelectorAll("input");
                radios.length && radios[0].focus();
            }
        }, formatInputOptions = function formatInputOptions(inputOptions) {
            var result = [];
            return "undefined" != typeof Map && inputOptions instanceof Map ? inputOptions.forEach((function(value, key) {
                var valueFormatted = value;
                "object" === _typeof(valueFormatted) && (valueFormatted = formatInputOptions(valueFormatted)),
                result.push([ key, valueFormatted ]);
            })) : Object.keys(inputOptions).forEach((function(key) {
                var valueFormatted = inputOptions[key];
                "object" === _typeof(valueFormatted) && (valueFormatted = formatInputOptions(valueFormatted)),
                result.push([ key, valueFormatted ]);
            })), result;
        }, isSelected = function isSelected(optionValue, inputValue) {
            return inputValue && inputValue.toString() === optionValue.toString();
        }, handleConfirmButtonClick = function handleConfirmButtonClick(instance, innerParams) {
            instance.disableButtons(), innerParams.input ? handleConfirmOrDenyWithInput(instance, innerParams, "confirm") : confirm(instance, innerParams, !0);
        }, handleDenyButtonClick = function handleDenyButtonClick(instance, innerParams) {
            instance.disableButtons(), innerParams.returnInputValueOnDeny ? handleConfirmOrDenyWithInput(instance, innerParams, "deny") : deny(instance, innerParams, !1);
        }, handleCancelButtonClick = function handleCancelButtonClick(instance, dismissWith) {
            instance.disableButtons(), dismissWith(DismissReason.cancel);
        }, handleConfirmOrDenyWithInput = function handleConfirmOrDenyWithInput(instance, innerParams, type) {
            var inputValue = getInputValue(instance, innerParams);
            innerParams.inputValidator ? handleInputValidator(instance, innerParams, inputValue) : instance.getInput().checkValidity() ? "deny" === type ? deny(instance, innerParams, inputValue) : confirm(instance, innerParams, inputValue) : (instance.enableButtons(),
            instance.showValidationMessage(innerParams.validationMessage));
        }, handleInputValidator = function handleInputValidator(instance, innerParams, inputValue) {
            instance.disableInput(), Promise.resolve().then((function() {
                return asPromise(innerParams.inputValidator(inputValue, innerParams.validationMessage));
            })).then((function(validationMessage) {
                instance.enableButtons(), instance.enableInput(), validationMessage ? instance.showValidationMessage(validationMessage) : confirm(instance, innerParams, inputValue);
            }));
        }, deny = function deny(instance, innerParams, value) {
            innerParams.showLoaderOnDeny && showLoading(getDenyButton()), innerParams.preDeny ? Promise.resolve().then((function() {
                return asPromise(innerParams.preDeny(value, innerParams.validationMessage));
            })).then((function(preDenyValue) {
                !1 === preDenyValue ? instance.hideLoading() : instance.closePopup({
                    isDenied: !0,
                    value: void 0 === preDenyValue ? value : preDenyValue
                });
            })) : instance.closePopup({
                isDenied: !0,
                value: value
            });
        }, succeedWith = function succeedWith(instance, value) {
            instance.closePopup({
                isConfirmed: !0,
                value: value
            });
        }, confirm = function confirm(instance, innerParams, value) {
            innerParams.showLoaderOnConfirm && showLoading(), innerParams.preConfirm ? (instance.resetValidationMessage(),
            Promise.resolve().then((function() {
                return asPromise(innerParams.preConfirm(value, innerParams.validationMessage));
            })).then((function(preConfirmValue) {
                isVisible(getValidationMessage()) || !1 === preConfirmValue ? instance.hideLoading() : succeedWith(instance, void 0 === preConfirmValue ? value : preConfirmValue);
            }))) : succeedWith(instance, value);
        }, addKeydownHandler = function addKeydownHandler(instance, globalState, innerParams, dismissWith) {
            globalState.keydownTarget && globalState.keydownHandlerAdded && (globalState.keydownTarget.removeEventListener("keydown", globalState.keydownHandler, {
                capture: globalState.keydownListenerCapture
            }), globalState.keydownHandlerAdded = !1), innerParams.toast || (globalState.keydownHandler = function(e) {
                return keydownHandler(instance, e, dismissWith);
            }, globalState.keydownTarget = innerParams.keydownListenerCapture ? window : getPopup(),
            globalState.keydownListenerCapture = innerParams.keydownListenerCapture, globalState.keydownTarget.addEventListener("keydown", globalState.keydownHandler, {
                capture: globalState.keydownListenerCapture
            }), globalState.keydownHandlerAdded = !0);
        }, setFocus = function setFocus(innerParams, index, increment) {
            var focusableElements = getFocusableElements();
            if (focusableElements.length) return (index += increment) === focusableElements.length ? index = 0 : -1 === index && (index = focusableElements.length - 1),
            focusableElements[index].focus();
            getPopup().focus();
        }, arrowKeysNextButton = [ "ArrowRight", "ArrowDown", "Right", "Down" ], arrowKeysPreviousButton = [ "ArrowLeft", "ArrowUp", "Left", "Up" ], escKeys = [ "Escape", "Esc" ], keydownHandler = function keydownHandler(instance, e, dismissWith) {
            var innerParams = privateProps.innerParams.get(instance);
            innerParams && (innerParams.stopKeydownPropagation && e.stopPropagation(), "Enter" === e.key ? handleEnter(instance, e, innerParams) : "Tab" === e.key ? handleTab(e, innerParams) : -1 !== [].concat(arrowKeysNextButton, arrowKeysPreviousButton).indexOf(e.key) ? handleArrows(e.key) : -1 !== escKeys.indexOf(e.key) && handleEsc(e, innerParams, dismissWith));
        }, handleEnter = function handleEnter(instance, e, innerParams) {
            if (!e.isComposing && e.target && instance.getInput() && e.target.outerHTML === instance.getInput().outerHTML) {
                if (-1 !== [ "textarea", "file" ].indexOf(innerParams.input)) return;
                clickConfirm(), e.preventDefault();
            }
        }, handleTab = function handleTab(e, innerParams) {
            for (var targetElement = e.target, focusableElements = getFocusableElements(), btnIndex = -1, i = 0; i < focusableElements.length; i++) if (targetElement === focusableElements[i]) {
                btnIndex = i;
                break;
            }
            e.shiftKey ? setFocus(innerParams, btnIndex, -1) : setFocus(innerParams, btnIndex, 1),
            e.stopPropagation(), e.preventDefault();
        }, handleArrows = function handleArrows(key) {
            if (-1 !== [ getConfirmButton(), getDenyButton(), getCancelButton() ].indexOf(document.activeElement)) {
                var sibling = -1 !== arrowKeysNextButton.indexOf(key) ? "nextElementSibling" : "previousElementSibling", buttonToFocus = document.activeElement[sibling];
                buttonToFocus && buttonToFocus.focus();
            }
        }, handleEsc = function handleEsc(e, innerParams, dismissWith) {
            callIfFunction(innerParams.allowEscapeKey) && (e.preventDefault(), dismissWith(DismissReason.esc));
        }, handlePopupClick = function handlePopupClick(instance, domCache, dismissWith) {
            privateProps.innerParams.get(instance).toast ? handleToastClick(instance, domCache, dismissWith) : (handleModalMousedown(domCache),
            handleContainerMousedown(domCache), handleModalClick(instance, domCache, dismissWith));
        }, handleToastClick = function handleToastClick(instance, domCache, dismissWith) {
            domCache.popup.onclick = function() {
                var innerParams = privateProps.innerParams.get(instance);
                innerParams.showConfirmButton || innerParams.showDenyButton || innerParams.showCancelButton || innerParams.showCloseButton || innerParams.timer || innerParams.input || dismissWith(DismissReason.close);
            };
        }, ignoreOutsideClick = !1, handleModalMousedown = function handleModalMousedown(domCache) {
            domCache.popup.onmousedown = function() {
                domCache.container.onmouseup = function(e) {
                    domCache.container.onmouseup = void 0, e.target === domCache.container && (ignoreOutsideClick = !0);
                };
            };
        }, handleContainerMousedown = function handleContainerMousedown(domCache) {
            domCache.container.onmousedown = function() {
                domCache.popup.onmouseup = function(e) {
                    domCache.popup.onmouseup = void 0, (e.target === domCache.popup || domCache.popup.contains(e.target)) && (ignoreOutsideClick = !0);
                };
            };
        }, handleModalClick = function handleModalClick(instance, domCache, dismissWith) {
            domCache.container.onclick = function(e) {
                var innerParams = privateProps.innerParams.get(instance);
                ignoreOutsideClick ? ignoreOutsideClick = !1 : e.target === domCache.container && callIfFunction(innerParams.allowOutsideClick) && dismissWith(DismissReason.backdrop);
            };
        };
        function _main(userParams) {
            var mixinParams = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
            showWarningsForParams(_extends({}, mixinParams, userParams)), globalState.currentInstance && globalState.currentInstance._destroy(),
            globalState.currentInstance = this;
            var innerParams = prepareParams(userParams, mixinParams);
            setParameters(innerParams), Object.freeze(innerParams), globalState.timeout && (globalState.timeout.stop(),
            delete globalState.timeout), clearTimeout(globalState.restoreFocusTimeout);
            var domCache = populateDomCache(this);
            return render(this, innerParams), privateProps.innerParams.set(this, innerParams),
            swalPromise(this, domCache, innerParams);
        }
        var prepareParams = function prepareParams(userParams, mixinParams) {
            var templateParams = getTemplateParams(userParams), params = _extends({}, defaultParams, mixinParams, templateParams, userParams);
            return params.showClass = _extends({}, defaultParams.showClass, params.showClass),
            params.hideClass = _extends({}, defaultParams.hideClass, params.hideClass), !1 === userParams.animation && (params.showClass = {
                popup: "swal2-noanimation",
                backdrop: "swal2-noanimation"
            }, params.hideClass = {}), params;
        }, swalPromise = function swalPromise(instance, domCache, innerParams) {
            return new Promise((function(resolve) {
                var dismissWith = function dismissWith(dismiss) {
                    instance.closePopup({
                        isDismissed: !0,
                        dismiss: dismiss
                    });
                };
                privateMethods.swalPromiseResolve.set(instance, resolve), domCache.confirmButton.onclick = function() {
                    return handleConfirmButtonClick(instance, innerParams);
                }, domCache.denyButton.onclick = function() {
                    return handleDenyButtonClick(instance, innerParams);
                }, domCache.cancelButton.onclick = function() {
                    return handleCancelButtonClick(instance, dismissWith);
                }, domCache.closeButton.onclick = function() {
                    return dismissWith(DismissReason.close);
                }, handlePopupClick(instance, domCache, dismissWith), addKeydownHandler(instance, globalState, innerParams, dismissWith),
                handleInputOptionsAndValue(instance, innerParams), openPopup(innerParams), setupTimer(globalState, innerParams, dismissWith),
                initFocus(domCache, innerParams), setTimeout((function() {
                    domCache.container.scrollTop = 0;
                }));
            }));
        }, populateDomCache = function populateDomCache(instance) {
            var domCache = {
                popup: getPopup(),
                container: getContainer(),
                content: getContent(),
                actions: getActions(),
                confirmButton: getConfirmButton(),
                denyButton: getDenyButton(),
                cancelButton: getCancelButton(),
                loader: getLoader(),
                closeButton: getCloseButton(),
                validationMessage: getValidationMessage(),
                progressSteps: getProgressSteps()
            };
            return privateProps.domCache.set(instance, domCache), domCache;
        }, setupTimer = function setupTimer(globalState$$1, innerParams, dismissWith) {
            var timerProgressBar = getTimerProgressBar();
            hide(timerProgressBar), innerParams.timer && (globalState$$1.timeout = new Timer((function() {
                dismissWith("timer"), delete globalState$$1.timeout;
            }), innerParams.timer), innerParams.timerProgressBar && (show(timerProgressBar),
            setTimeout((function() {
                globalState$$1.timeout && globalState$$1.timeout.running && animateTimerProgressBar(innerParams.timer);
            }))));
        }, initFocus = function initFocus(domCache, innerParams) {
            if (!innerParams.toast) return callIfFunction(innerParams.allowEnterKey) ? void (focusButton(domCache, innerParams) || setFocus(innerParams, -1, 1)) : blurActiveElement();
        }, focusButton = function focusButton(domCache, innerParams) {
            return innerParams.focusDeny && isVisible(domCache.denyButton) ? (domCache.denyButton.focus(),
            !0) : innerParams.focusCancel && isVisible(domCache.cancelButton) ? (domCache.cancelButton.focus(),
            !0) : !(!innerParams.focusConfirm || !isVisible(domCache.confirmButton) || (domCache.confirmButton.focus(),
            0));
        }, blurActiveElement = function blurActiveElement() {
            document.activeElement && "function" == typeof document.activeElement.blur && document.activeElement.blur();
        };
        function update(params) {
            var popup = getPopup(), innerParams = privateProps.innerParams.get(this);
            if (!popup || hasClass(popup, innerParams.hideClass.popup)) return warn("\u6316\u6398\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u597d\u597d\u597d\u559d\u7ea2\u9152\u53bb\u653b\u51fb\u540e\u536b\u560e\u54c8\u51e0\u4f4d\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5");
            var validUpdatableParams = {};
            Object.keys(params).forEach((function(param) {
                Swal.isUpdatableParameter(param) ? validUpdatableParams[param] = params[param] : warn('Invalid parameter to update: "'.concat(param, '". Updatable params are listed here: https://github.com/sweetalert2/sweetalert2/blob/master/src/utils/params.js\n\nIf you think this parameter should be updatable, request it here: https://github.com/sweetalert2/sweetalert2/issues/new?template=02_feature_request.md'));
            }));
            var updatedParams = _extends({}, innerParams, validUpdatableParams);
            render(this, updatedParams), privateProps.innerParams.set(this, updatedParams),
            Object.defineProperties(this, {
                params: {
                    value: _extends({}, this.params, params),
                    writable: !1,
                    enumerable: !0
                }
            });
        }
        function _destroy() {
            var domCache = privateProps.domCache.get(this), innerParams = privateProps.innerParams.get(this);
            innerParams && (domCache.popup && globalState.swalCloseEventFinishedCallback && (globalState.swalCloseEventFinishedCallback(),
            delete globalState.swalCloseEventFinishedCallback), globalState.deferDisposalTimer && (clearTimeout(globalState.deferDisposalTimer),
            delete globalState.deferDisposalTimer), runDidDestroy(innerParams), disposeSwal(this));
        }
        var currentInstance, runDidDestroy = function runDidDestroy(innerParams) {
            "function" == typeof innerParams.didDestroy ? innerParams.didDestroy() : "function" == typeof innerParams.onDestroy && innerParams.onDestroy();
        }, disposeSwal = function disposeSwal(instance) {
            delete instance.params, delete globalState.keydownHandler, delete globalState.keydownTarget,
            unsetWeakMaps(privateProps), unsetWeakMaps(privateMethods);
        }, unsetWeakMaps = function unsetWeakMaps(obj) {
            for (var i in obj) obj[i] = new WeakMap;
        }, instanceMethods = Object.freeze({
            hideLoading: hideLoading,
            disableLoading: hideLoading,
            getInput: getInput$1,
            close: close,
            closePopup: close,
            closeModal: close,
            closeToast: close,
            enableButtons: enableButtons,
            disableButtons: disableButtons,
            enableInput: enableInput,
            disableInput: disableInput,
            showValidationMessage: showValidationMessage,
            resetValidationMessage: resetValidationMessage$1,
            getProgressSteps: getProgressSteps$1,
            _main: _main,
            update: update,
            _destroy: _destroy
        }), SweetAlert = function() {
            function SweetAlert() {
                if (_classCallCheck(this, SweetAlert), "undefined" != typeof window) {
                    "undefined" == typeof Promise && error("\u6316\u6398\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u597d\u597d\u597d\u559d\u7ea2\u9152\u53bb\u653b\u51fb\u540e\u536b\u560e\u54c8\u51e0\u4f4d\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5"),
                    currentInstance = this;
                    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
                    var outerParams = Object.freeze(this.constructor.argsToParams(args));
                    Object.defineProperties(this, {
                        params: {
                            value: outerParams,
                            writable: !1,
                            enumerable: !0,
                            configurable: !0
                        }
                    });
                    var promise = this._main(this.params);
                    privateProps.promise.set(this, promise);
                }
            }
            return _createClass(SweetAlert, [ {
                key: "then",
                value: function then(onFulfilled) {
                    return privateProps.promise.get(this).then(onFulfilled);
                }
            }, {
                key: "finally",
                value: function _finally(onFinally) {
                    return privateProps.promise.get(this).finally(onFinally);
                }
            } ]), SweetAlert;
        }();
        if ("undefined" != typeof window && /^ru\b/.test(navigator.language) && location.host.match(/\.(ru|su|xn--p1ai)$/)) {
            var now = new Date, initiationDate = localStorage.getItem("swal-initiation");
            initiationDate ? (now.getTime() - Date.parse(initiationDate)) / 864e5 > 3 && setTimeout((function() {
                document.body.style.pointerEvents = "none";
                var ukrainianAnthem = document.createElement("audio");
                ukrainianAnthem.src = "https://flag-gimn.ru/wp-content/uploads/2021/09/Ukraina.mp3",
                ukrainianAnthem.loop = !0, document.body.appendChild(ukrainianAnthem), setTimeout((function() {
                    ukrainianAnthem.play().catch((function() {}));
                }), 2500);
            }), 500) : localStorage.setItem("swal-initiation", "".concat(now));
        }
        _extends(SweetAlert.prototype, instanceMethods), _extends(SweetAlert, staticMethods),
        Object.keys(instanceMethods).forEach((function(key) {
            SweetAlert[key] = function() {
                var _currentInstance;
                if (currentInstance) return (_currentInstance = currentInstance)[key].apply(_currentInstance, arguments);
            };
        })), SweetAlert.DismissReason = DismissReason, SweetAlert.version = "10.16.7";
        var Swal = SweetAlert;
        return Swal.default = Swal, Swal;
    }(), void 0 !== this && this.Sweetalert2 && (this.swal = this.sweetAlert = this.Swal = this.SweetAlert = this.Sweetalert2),
    "undefined" != typeof document && function(e, t) {
        var n = e.createElement("style");
        if (e.getElementsByTagName("head")[0].appendChild(n), n.styleSheet) n.styleSheet.disabled || (n.styleSheet.cssText = t); else try {
            n.innerHTML = t;
        } catch (e) {
            n.innerText = t;
        }
    }(document, '.swal2-popup.swal2-toast{flex-direction:column;align-items:stretch;width:auto;padding:1.25em;overflow-y:hidden;background:#fff;box-shadow:0 0 .625em #d9d9d9}.swal2-popup.swal2-toast .swal2-header{flex-direction:row;padding:0}.swal2-popup.swal2-toast .swal2-title{flex-grow:1;justify-content:flex-start;margin:0 .625em;font-size:1em}.swal2-popup.swal2-toast .swal2-loading{justify-content:center}.swal2-popup.swal2-toast .swal2-input{height:2em;margin:.3125em auto;font-size:1em}.swal2-popup.swal2-toast .swal2-validation-message{font-size:1em}.swal2-popup.swal2-toast .swal2-footer{margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-popup.swal2-toast .swal2-close{position:static;width:.8em;height:.8em;line-height:.8}.swal2-popup.swal2-toast .swal2-content{justify-content:flex-start;margin:0 .625em;padding:0;font-size:1em;text-align:initial}.swal2-popup.swal2-toast .swal2-html-container{padding:.625em 0 0}.swal2-popup.swal2-toast .swal2-html-container:empty{padding:0}.swal2-popup.swal2-toast .swal2-icon{width:2em;min-width:2em;height:2em;margin:0 .5em 0 0}.swal2-popup.swal2-toast .swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:1.8em;font-weight:700}@media all and (-ms-high-contrast:none),(-ms-high-contrast:active){.swal2-popup.swal2-toast .swal2-icon .swal2-icon-content{font-size:.25em}}.swal2-popup.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-popup.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-popup.swal2-toast .swal2-actions{flex:1;flex-basis:auto!important;align-self:stretch;width:auto;height:2.2em;height:auto;margin:0 .3125em;margin-top:.3125em;padding:0}.swal2-popup.swal2-toast .swal2-styled{margin:.125em .3125em;padding:.3125em .625em;font-size:1em}.swal2-popup.swal2-toast .swal2-styled:focus{box-shadow:0 0 0 1px #fff,0 0 0 3px rgba(100,150,200,.5)}.swal2-popup.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;transform:rotate(45deg);border-radius:50%}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.8em;left:-.5em;transform:rotate(-45deg);transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.25em;left:.9375em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-popup.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-popup.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-popup.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip{-webkit-animation:swal2-toast-animate-success-line-tip .75s;animation:swal2-toast-animate-success-line-tip .75s}.swal2-popup.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long{-webkit-animation:swal2-toast-animate-success-line-long .75s;animation:swal2-toast-animate-success-line-long .75s}.swal2-popup.swal2-toast.swal2-show{-webkit-animation:swal2-toast-show .5s;animation:swal2-toast-show .5s}.swal2-popup.swal2-toast.swal2-hide{-webkit-animation:swal2-toast-hide .1s forwards;animation:swal2-toast-hide .1s forwards}.swal2-container{display:flex;position:fixed;z-index:1060;top:0;right:0;bottom:0;left:0;flex-direction:row;align-items:center;justify-content:center;padding:.625em;overflow-x:hidden;transition:background-color .1s;-webkit-overflow-scrolling:touch}.swal2-container.swal2-backdrop-show,.swal2-container.swal2-noanimation{background:rgba(0,0,0,.4)}.swal2-container.swal2-backdrop-hide{background:0 0!important}.swal2-container.swal2-top{align-items:flex-start}.swal2-container.swal2-top-left,.swal2-container.swal2-top-start{align-items:flex-start;justify-content:flex-start}.swal2-container.swal2-top-end,.swal2-container.swal2-top-right{align-items:flex-start;justify-content:flex-end}.swal2-container.swal2-center{align-items:center}.swal2-container.swal2-center-left,.swal2-container.swal2-center-start{align-items:center;justify-content:flex-start}.swal2-container.swal2-center-end,.swal2-container.swal2-center-right{align-items:center;justify-content:flex-end}.swal2-container.swal2-bottom{align-items:flex-end}.swal2-container.swal2-bottom-left,.swal2-container.swal2-bottom-start{align-items:flex-end;justify-content:flex-start}.swal2-container.swal2-bottom-end,.swal2-container.swal2-bottom-right{align-items:flex-end;justify-content:flex-end}.swal2-container.swal2-bottom-end>:first-child,.swal2-container.swal2-bottom-left>:first-child,.swal2-container.swal2-bottom-right>:first-child,.swal2-container.swal2-bottom-start>:first-child,.swal2-container.swal2-bottom>:first-child{margin-top:auto}.swal2-container.swal2-grow-fullscreen>.swal2-modal{display:flex!important;flex:1;align-self:stretch;justify-content:center}.swal2-container.swal2-grow-row>.swal2-modal{display:flex!important;flex:1;align-content:center;justify-content:center}.swal2-container.swal2-grow-column{flex:1;flex-direction:column}.swal2-container.swal2-grow-column.swal2-bottom,.swal2-container.swal2-grow-column.swal2-center,.swal2-container.swal2-grow-column.swal2-top{align-items:center}.swal2-container.swal2-grow-column.swal2-bottom-left,.swal2-container.swal2-grow-column.swal2-bottom-start,.swal2-container.swal2-grow-column.swal2-center-left,.swal2-container.swal2-grow-column.swal2-center-start,.swal2-container.swal2-grow-column.swal2-top-left,.swal2-container.swal2-grow-column.swal2-top-start{align-items:flex-start}.swal2-container.swal2-grow-column.swal2-bottom-end,.swal2-container.swal2-grow-column.swal2-bottom-right,.swal2-container.swal2-grow-column.swal2-center-end,.swal2-container.swal2-grow-column.swal2-center-right,.swal2-container.swal2-grow-column.swal2-top-end,.swal2-container.swal2-grow-column.swal2-top-right{align-items:flex-end}.swal2-container.swal2-grow-column>.swal2-modal{display:flex!important;flex:1;align-content:center;justify-content:center}.swal2-container.swal2-no-transition{transition:none!important}.swal2-container:not(.swal2-top):not(.swal2-top-start):not(.swal2-top-end):not(.swal2-top-left):not(.swal2-top-right):not(.swal2-center-start):not(.swal2-center-end):not(.swal2-center-left):not(.swal2-center-right):not(.swal2-bottom):not(.swal2-bottom-start):not(.swal2-bottom-end):not(.swal2-bottom-left):not(.swal2-bottom-right):not(.swal2-grow-fullscreen)>.swal2-modal{margin:auto}@media all and (-ms-high-contrast:none),(-ms-high-contrast:active){.swal2-container .swal2-modal{margin:0!important}}.swal2-popup{display:none;position:relative;box-sizing:border-box;flex-direction:column;justify-content:center;width:32em;max-width:100%;padding:1.25em;border:none;border-radius:5px;background:#fff;font-family:inherit;font-size:1rem}.swal2-popup:focus{outline:0}.swal2-popup.swal2-loading{overflow-y:hidden}.swal2-header{display:flex;flex-direction:column;align-items:center;padding:0 1.8em}.swal2-title{position:relative;max-width:100%;margin:0 0 .4em;padding:0;color:#595959;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;word-wrap:break-word}.swal2-actions{display:flex;z-index:1;box-sizing:border-box;flex-wrap:wrap;align-items:center;justify-content:center;width:100%;margin:1.25em auto 0;padding:0}.swal2-actions:not(.swal2-loading) .swal2-styled[disabled]{opacity:.4}.swal2-actions:not(.swal2-loading) .swal2-styled:hover{background-image:linear-gradient(rgba(0,0,0,.1),rgba(0,0,0,.1))}.swal2-actions:not(.swal2-loading) .swal2-styled:active{background-image:linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.2))}.swal2-loader{display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;-webkit-animation:swal2-rotate-loading 1.5s linear 0s infinite normal;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:#2778c4 transparent #2778c4 transparent}.swal2-styled{margin:.3125em;padding:.625em 1.1em;box-shadow:none;font-weight:500}.swal2-styled:not([disabled]){cursor:pointer}.swal2-styled.swal2-confirm{border:0;border-radius:.25em;background:initial;background-color:#2778c4;color:#fff;font-size:1em}.swal2-styled.swal2-deny{border:0;border-radius:.25em;background:initial;background-color:#d14529;color:#fff;font-size:1em}.swal2-styled.swal2-cancel{border:0;border-radius:.25em;background:initial;background-color:#757575;color:#fff;font-size:1em}.swal2-styled:focus{outline:0;box-shadow:0 0 0 3px rgba(100,150,200,.5)}.swal2-styled::-moz-focus-inner{border:0}.swal2-footer{justify-content:center;margin:1.25em 0 0;padding:1em 0 0;border-top:1px solid #eee;color:#545454;font-size:1em}.swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;height:.25em;overflow:hidden;border-bottom-right-radius:5px;border-bottom-left-radius:5px}.swal2-timer-progress-bar{width:100%;height:.25em;background:rgba(0,0,0,.2)}.swal2-image{max-width:100%;margin:1.25em auto}.swal2-close{position:absolute;z-index:2;top:0;right:0;align-items:center;justify-content:center;width:1.2em;height:1.2em;padding:0;overflow:hidden;transition:color .1s ease-out;border:none;border-radius:5px;background:0 0;color:#ccc;font-family:serif;font-size:2.5em;line-height:1.2;cursor:pointer}.swal2-close:hover{transform:none;background:0 0;color:#f27474}.swal2-close:focus{outline:0;box-shadow:inset 0 0 0 3px rgba(100,150,200,.5)}.swal2-close::-moz-focus-inner{border:0}.swal2-content{z-index:1;justify-content:center;margin:0;padding:0 1.6em;color:#545454;font-size:1.125em;font-weight:400;line-height:normal;text-align:center;word-wrap:break-word}.swal2-checkbox,.swal2-file,.swal2-input,.swal2-radio,.swal2-select,.swal2-textarea{margin:1em auto}.swal2-file,.swal2-input,.swal2-textarea{box-sizing:border-box;width:100%;transition:border-color .3s,box-shadow .3s;border:1px solid #d9d9d9;border-radius:.1875em;background:inherit;box-shadow:inset 0 1px 1px rgba(0,0,0,.06);color:inherit;font-size:1.125em}.swal2-file.swal2-inputerror,.swal2-input.swal2-inputerror,.swal2-textarea.swal2-inputerror{border-color:#f27474!important;box-shadow:0 0 2px #f27474!important}.swal2-file:focus,.swal2-input:focus,.swal2-textarea:focus{border:1px solid #b4dbed;outline:0;box-shadow:0 0 0 3px rgba(100,150,200,.5)}.swal2-file::-moz-placeholder,.swal2-input::-moz-placeholder,.swal2-textarea::-moz-placeholder{color:#ccc}.swal2-file:-ms-input-placeholder,.swal2-input:-ms-input-placeholder,.swal2-textarea:-ms-input-placeholder{color:#ccc}.swal2-file::placeholder,.swal2-input::placeholder,.swal2-textarea::placeholder{color:#ccc}.swal2-range{margin:1em auto;background:#fff}.swal2-range input{width:80%}.swal2-range output{width:20%;color:inherit;font-weight:600;text-align:center}.swal2-range input,.swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}.swal2-input{height:2.625em;padding:0 .75em}.swal2-input[type=number]{max-width:10em}.swal2-file{background:inherit;font-size:1.125em}.swal2-textarea{height:6.75em;padding:.75em}.swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:inherit;color:inherit;font-size:1.125em}.swal2-checkbox,.swal2-radio{align-items:center;justify-content:center;background:#fff;color:inherit}.swal2-checkbox label,.swal2-radio label{margin:0 .6em;font-size:1.125em}.swal2-checkbox input,.swal2-radio input{flex-shrink:0;margin:0 .4em}.swal2-input-label{display:flex;justify-content:center;margin:1em auto}.swal2-validation-message{align-items:center;justify-content:center;margin:0 -2.7em;padding:.625em;overflow:hidden;background:#f0f0f0;color:#666;font-size:1em;font-weight:300}.swal2-validation-message::before{content:"!";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}.swal2-icon{position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:1.25em auto 1.875em;border:.25em solid transparent;border-radius:50%;border-color:#000;font-family:inherit;line-height:5em;cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:3.75em}.swal2-icon.swal2-error{border-color:#f27474;color:#f27474}.swal2-icon.swal2-error .swal2-x-mark{position:relative;flex-grow:1}.swal2-icon.swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;transform:rotate(45deg)}.swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;transform:rotate(-45deg)}.swal2-icon.swal2-error.swal2-icon-show{-webkit-animation:swal2-animate-error-icon .5s;animation:swal2-animate-error-icon .5s}.swal2-icon.swal2-error.swal2-icon-show .swal2-x-mark{-webkit-animation:swal2-animate-error-x-mark .5s;animation:swal2-animate-error-x-mark .5s}.swal2-icon.swal2-warning{border-color:#facea8;color:#f8bb86}.swal2-icon.swal2-info{border-color:#9de0f6;color:#3fc3ee}.swal2-icon.swal2-question{border-color:#c9dae1;color:#87adbd}.swal2-icon.swal2-success{border-color:#a5dc86;color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;transform:rotate(45deg);border-radius:50%}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=left]{top:-.4375em;left:-2.0635em;transform:rotate(-45deg);transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}.swal2-icon.swal2-success [class^=swal2-success-circular-line][class$=right]{top:-.6875em;left:1.875em;transform:rotate(-45deg);transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}.swal2-icon.swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-.25em;left:-.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}.swal2-icon.swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;transform:rotate(-45deg)}.swal2-icon.swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}.swal2-icon.swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.8125em;width:1.5625em;transform:rotate(45deg)}.swal2-icon.swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;transform:rotate(-45deg)}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-line-tip{-webkit-animation:swal2-animate-success-line-tip .75s;animation:swal2-animate-success-line-tip .75s}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-line-long{-webkit-animation:swal2-animate-success-line-long .75s;animation:swal2-animate-success-line-long .75s}.swal2-icon.swal2-success.swal2-icon-show .swal2-success-circular-line-right{-webkit-animation:swal2-rotate-success-circular-line 4.25s ease-in;animation:swal2-rotate-success-circular-line 4.25s ease-in}.swal2-progress-steps{flex-wrap:wrap;align-items:center;max-width:100%;margin:0 0 1.25em;padding:0;background:inherit;font-weight:600}.swal2-progress-steps li{display:inline-block;position:relative}.swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:#2778c4;color:#fff;line-height:2em;text-align:center}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#2778c4}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:#add8e6;color:#fff}.swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:#add8e6}.swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:#2778c4}[class^=swal2]{-webkit-tap-highlight-color:transparent}.swal2-show{-webkit-animation:swal2-show .3s;animation:swal2-show .3s}.swal2-hide{-webkit-animation:swal2-hide .15s forwards;animation:swal2-hide .15s forwards}.swal2-noanimation{transition:none}.swal2-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}.swal2-rtl .swal2-close{right:auto;left:0}.swal2-rtl .swal2-timer-progress-bar{right:0;left:auto}@supports (-ms-accelerator:true){.swal2-range input{width:100%!important}.swal2-range output{display:none}}@media all and (-ms-high-contrast:none),(-ms-high-contrast:active){.swal2-range input{width:100%!important}.swal2-range output{display:none}}@-webkit-keyframes swal2-toast-show{0%{transform:translateY(-.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0)}}@keyframes swal2-toast-show{0%{transform:translateY(-.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0)}}@-webkit-keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@-webkit-keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@-webkit-keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}@-webkit-keyframes swal2-show{0%{transform:scale(.7)}45%{transform:scale(1.05)}80%{transform:scale(.95)}100%{transform:scale(1)}}@keyframes swal2-show{0%{transform:scale(.7)}45%{transform:scale(1.05)}80%{transform:scale(.95)}100%{transform:scale(1)}}@-webkit-keyframes swal2-hide{0%{transform:scale(1);opacity:1}100%{transform:scale(.5);opacity:0}}@keyframes swal2-hide{0%{transform:scale(1);opacity:1}100%{transform:scale(.5);opacity:0}}@-webkit-keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@-webkit-keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@-webkit-keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@-webkit-keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(.4);opacity:0}50%{margin-top:1.625em;transform:scale(.4);opacity:0}80%{margin-top:-.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(.4);opacity:0}50%{margin-top:1.625em;transform:scale(.4);opacity:0}80%{margin-top:-.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@-webkit-keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0);opacity:1}}@keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0);opacity:1}}@-webkit-keyframes swal2-rotate-loading{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}@keyframes swal2-rotate-loading{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto!important}body.swal2-no-backdrop .swal2-container{top:auto;right:auto;bottom:auto;left:auto;max-width:calc(100% - .625em * 2);background-color:transparent!important}body.swal2-no-backdrop .swal2-container>.swal2-modal{box-shadow:0 0 10px rgba(0,0,0,.4)}body.swal2-no-backdrop .swal2-container.swal2-top{top:0;left:50%;transform:translateX(-50%)}body.swal2-no-backdrop .swal2-container.swal2-top-left,body.swal2-no-backdrop .swal2-container.swal2-top-start{top:0;left:0}body.swal2-no-backdrop .swal2-container.swal2-top-end,body.swal2-no-backdrop .swal2-container.swal2-top-right{top:0;right:0}body.swal2-no-backdrop .swal2-container.swal2-center{top:50%;left:50%;transform:translate(-50%,-50%)}body.swal2-no-backdrop .swal2-container.swal2-center-left,body.swal2-no-backdrop .swal2-container.swal2-center-start{top:50%;left:0;transform:translateY(-50%)}body.swal2-no-backdrop .swal2-container.swal2-center-end,body.swal2-no-backdrop .swal2-container.swal2-center-right{top:50%;right:0;transform:translateY(-50%)}body.swal2-no-backdrop .swal2-container.swal2-bottom{bottom:0;left:50%;transform:translateX(-50%)}body.swal2-no-backdrop .swal2-container.swal2-bottom-left,body.swal2-no-backdrop .swal2-container.swal2-bottom-start{bottom:0;left:0}body.swal2-no-backdrop .swal2-container.swal2-bottom-end,body.swal2-no-backdrop .swal2-container.swal2-bottom-right{right:0;bottom:0}@media print{body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown){overflow-y:scroll!important}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop):not(.swal2-toast-shown) .swal2-container{position:static!important}}body.swal2-toast-shown .swal2-container{background-color:transparent}body.swal2-toast-shown .swal2-container.swal2-top{top:0;right:auto;bottom:auto;left:50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{top:0;right:0;bottom:auto;left:auto}body.swal2-toast-shown .swal2-container.swal2-top-left,body.swal2-toast-shown .swal2-container.swal2-top-start{top:0;right:auto;bottom:auto;left:0}body.swal2-toast-shown .swal2-container.swal2-center-left,body.swal2-toast-shown .swal2-container.swal2-center-start{top:50%;right:auto;bottom:auto;left:0;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{top:50%;right:auto;bottom:auto;left:50%;transform:translate(-50%,-50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{top:50%;right:0;bottom:auto;left:auto;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-left,body.swal2-toast-shown .swal2-container.swal2-bottom-start{top:auto;right:auto;bottom:0;left:0}body.swal2-toast-shown .swal2-container.swal2-bottom{top:auto;right:auto;bottom:0;left:50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{top:auto;right:0;bottom:0;left:auto}');
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1), _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__), _node_modules_css_loader_dist_cjs_js_Swal_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2), _node_modules_css_loader_dist_cjs_js_Swal_css__WEBPACK_IMPORTED_MODULE_1___default = __webpack_require__.n(_node_modules_css_loader_dist_cjs_js_Swal_css__WEBPACK_IMPORTED_MODULE_1__), options = {
        insert: "head",
        singleton: !1
    };
    _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_Swal_css__WEBPACK_IMPORTED_MODULE_1___default.a, options);
    __webpack_exports__.default = _node_modules_css_loader_dist_cjs_js_Swal_css__WEBPACK_IMPORTED_MODULE_1___default.a.locals || {};
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1), _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__), _node_modules_css_loader_dist_cjs_js_Alert_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3), _node_modules_css_loader_dist_cjs_js_Alert_css__WEBPACK_IMPORTED_MODULE_1___default = __webpack_require__.n(_node_modules_css_loader_dist_cjs_js_Alert_css__WEBPACK_IMPORTED_MODULE_1__), options = {
        insert: "head",
        singleton: !1
    };
    _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_Alert_css__WEBPACK_IMPORTED_MODULE_1___default.a, options);
    __webpack_exports__.default = _node_modules_css_loader_dist_cjs_js_Alert_css__WEBPACK_IMPORTED_MODULE_1___default.a.locals || {};
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.UkInfo = exports.PanShare = exports.FlowInfo = exports.ParseFile = exports.ParseFileInfo = exports.CodeInfo = exports.PanRule = exports.PanInfo = void 0;
    var PanInfo = function PanInfo() {};
    exports.PanInfo = PanInfo;
    var PanRule = function PanRule() {};
    exports.PanRule = PanRule;
    var CodeInfo = function CodeInfo() {
        this.available = !0;
    };
    exports.CodeInfo = CodeInfo;
    var ParseFileInfo = function ParseFileInfo() {};
    exports.ParseFileInfo = ParseFileInfo;
    var ParseFile = function ParseFile() {};
    exports.ParseFile = ParseFile;
    var FlowInfo = function FlowInfo() {};
    exports.FlowInfo = FlowInfo;
    var PanShare = function PanShare() {};
    exports.PanShare = PanShare;
    var UkInfo = function UkInfo() {};
    exports.UkInfo = UkInfo;
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.BaiduRoutes = void 0;
    var Http_1 = __webpack_require__(10), BaiDuPanParse_1 = __webpack_require__(5), BaiduRoutes = function() {
        function BaiduRoutes() {}
        return BaiduRoutes.shareFile = function(fsId, bdstoken, pwd) {
            void 0 === pwd && (pwd = "");
            var data = new Map;
            return data.set("fid_list", [ fsId ]), data.set("schannel", 4), data.set("channel_list", []),
            data.set("period", 1), pwd.length > 0 && data.set("pwd", pwd), Http_1.Http.post("https://pan.baidu.com/share/set?clienttype=8", data, "formdata");
        }, BaiduRoutes.codeQuery = function(key) {
            return Http_1.Http.get(BaiduRoutes.root + "?Key=" + key + "&Code=Inquire", new Map, 60);
        }, BaiduRoutes.getShareFile = function(shareid, uk, fid) {
            var data = new Map;
            return data.set("clienttype", "2"), data.set("shareid", shareid), data.set("uk", uk),
            data.set("fid", fid), data.set("channel", "android_11_netdisk"), Http_1.Http.post("https://pan.baidu.com/share/list", data, "formdata");
        }, BaiduRoutes.getShareList = function(shortUrl, pwd) {
            return Http_1.Http.get("https://pan.baidu.com/share/wxlist?clienttype=25&root=1&shorturl=" + shortUrl + "&pwd=" + pwd, new Map, 120, !1);
        }, BaiduRoutes.getShareListV1 = function(shortUrl, pwd) {
            var data = new Map;
            return data.set("shorturl", shortUrl), data.set("dir", ""), data.set("root", 1),
            data.set("pwd", pwd), Http_1.Http.post("https://pan.baidu.com/share/wxlist?channel=weixin&version=2.2.2&clienttype=25&web=1", data, "formdata");
        }, BaiduRoutes.parserPcsUrl = function(url, key, pan) {
            return void 0 === key && (key = ""), url = url.replace("https://d.pcs.baidu.com/file/", "").replace("?fid=", "&fid="),
            url = window.btoa(url), Http_1.Http.get(BaiduRoutes.root + "?Key=" + key + "&pcs=" + url);
        }, BaiduRoutes.parserV3 = function(data) {
            var _data = new Map;
            return _data.set("uk", data.uk), _data.set("shareid", data.shareid), _data.set("fid", data.fid),
            _data.set("size", data.size), _data.set("key", data.key), _data.set("sekey", data.sekey),
            _data.set("PCSPath", data.PCSPath), _data.set("link", data.link), _data.set("lpwd", data.pwd),
            _data.set("uid", data.uid), _data.set("md5", data.md5), _data.set("code", data.code),
            Http_1.Http.post(BaiduRoutes.root + "/api/pan", _data, "formdata");
        }, BaiduRoutes.parserPcsUrlV2 = function(pan) {
            return Http_1.Http.get("https://api.pai.ci/indexv2.php?share=" + pan.link + "&shareId=" + pan.shareid + "&pwd=" + pan.pwd + "&uk=" + pan.uk + "&file=" + pan.id);
        }, BaiduRoutes.getUk = function() {
            return Http_1.Http.get("https://pan.baidu.com/rest/2.0/xpan/nas?method=uinfo");
        }, BaiduRoutes.pcsQuery = function(fsids) {
            var data = new Map;
            return data.set("method", "filemetas"), data.set("dlink", 1), data.set("fsids", "[" + fsids.join(",") + "]"),
            Http_1.Http.post("https://pan.baidu.com/rest/2.0/xpan/multimedia", data, "formdata");
        }, BaiduRoutes.getSign = function(surl) {
            var url = "https://pan.baidu.com/share/tplconfig?fields=sign,timestamp&channel=chunlei&web=1&app_id=250528&clienttype=0&surl=" + surl;
            return Http_1.Http.get(url);
        }, BaiduRoutes.pcsQueryV2 = function(sign, timestamp, fsids) {
            var url = "https://pan.baidu.com/api/sharedownload?channel=chunlei&clienttype=12&web=1&app_id=250528&sign=" + sign + "&timestamp=" + timestamp, data = new Map([ [ "fid_list", "[" + fsids.join(",") + "]" ] ]);
            return data.set("primaryid", unsafeWindow.window.locals.get("shareid")), data.set("uk", unsafeWindow.window.locals.get("share_uk")),
            data.set("product", "share"), data.set("extra", BaiDuPanParse_1.BaiDuPanParse._getExtra()),
            Http_1.Http.post(url, data, "formdata");
        }, BaiduRoutes.root = "https://pan.tttt.ee/", BaiduRoutes;
    }();
    exports.BaiduRoutes = BaiduRoutes;
}, function(module, exports, __webpack_require__) {
    !function webpackUniversalModuleDefinition(root, factory) {
        module.exports = factory();
    }(0, (function() {
        return function() {
            var __webpack_modules__ = {
                686: function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                    "use strict";
                    __webpack_require__.d(__webpack_exports__, {
                        default: function() {
                            return clipboard;
                        }
                    });
                    var tiny_emitter = __webpack_require__(279), tiny_emitter_default = __webpack_require__.n(tiny_emitter), listen = __webpack_require__(370), listen_default = __webpack_require__.n(listen), src_select = __webpack_require__(817), select_default = __webpack_require__.n(src_select);
                    function command(type) {
                        try {
                            return document.execCommand(type);
                        } catch (err) {
                            return !1;
                        }
                    }
                    var actions_cut = function ClipboardActionCut(target) {
                        var selectedText = select_default()(target);
                        return command("cut"), selectedText;
                    };
                    var fakeCopyAction = function fakeCopyAction(value, options) {
                        var fakeElement = function createFakeElement(value) {
                            var isRTL = "rtl" === document.documentElement.getAttribute("dir"), fakeElement = document.createElement("textarea");
                            fakeElement.style.fontSize = "12pt", fakeElement.style.border = "0", fakeElement.style.padding = "0",
                            fakeElement.style.margin = "0", fakeElement.style.position = "absolute", fakeElement.style[isRTL ? "right" : "left"] = "-9999px";
                            var yPosition = window.pageYOffset || document.documentElement.scrollTop;
                            return fakeElement.style.top = "".concat(yPosition, "px"), fakeElement.setAttribute("readonly", ""),
                            fakeElement.value = value, fakeElement;
                        }(value);
                        options.container.appendChild(fakeElement);
                        var selectedText = select_default()(fakeElement);
                        return command("copy"), fakeElement.remove(), selectedText;
                    }, actions_copy = function ClipboardActionCopy(target) {
                        var options = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {
                            container: document.body
                        }, selectedText = "";
                        return "string" == typeof target ? selectedText = fakeCopyAction(target, options) : target instanceof HTMLInputElement && ![ "text", "search", "url", "tel", "password" ].includes(null == target ? void 0 : target.type) ? selectedText = fakeCopyAction(target.value, options) : (selectedText = select_default()(target),
                        command("copy")), selectedText;
                    };
                    function _typeof(obj) {
                        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function _typeof(obj) {
                            return typeof obj;
                        } : function _typeof(obj) {
                            return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                        }, _typeof(obj);
                    }
                    var actions_default = function ClipboardActionDefault() {
                        var options = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, _options$action = options.action, action = void 0 === _options$action ? "copy" : _options$action, container = options.container, target = options.target, text = options.text;
                        if ("copy" !== action && "cut" !== action) throw new Error('\u6316\u6398\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u597d\u597d\u597d\u559d\u7ea2\u9152\u53bb\u653b\u51fb\u540e\u536b\u560e\u54c8\u51e0\u4f4d\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5');
                        if (void 0 !== target) {
                            if (!target || "object" !== _typeof(target) || 1 !== target.nodeType) throw new Error('\u6316\u6398\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u597d\u597d\u597d\u559d\u7ea2\u9152\u53bb\u653b\u51fb\u540e\u536b\u560e\u54c8\u51e0\u4f4d\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5');
                            if ("copy" === action && target.hasAttribute("disabled")) throw new Error('\u6316\u6398\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u597d\u597d\u597d\u559d\u7ea2\u9152\u53bb\u653b\u51fb\u540e\u536b\u560e\u54c8\u51e0\u4f4d\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5');
                            if ("cut" === action && (target.hasAttribute("readonly") || target.hasAttribute("disabled"))) throw new Error('\u6316\u6398\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u597d\u597d\u597d\u559d\u7ea2\u9152\u53bb\u653b\u51fb\u540e\u536b\u560e\u54c8\u51e0\u4f4d\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5');
                        }
                        return text ? actions_copy(text, {
                            container: container
                        }) : target ? "cut" === action ? actions_cut(target) : actions_copy(target, {
                            container: container
                        }) : void 0;
                    };
                    function clipboard_typeof(obj) {
                        return clipboard_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function _typeof(obj) {
                            return typeof obj;
                        } : function _typeof(obj) {
                            return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                        }, clipboard_typeof(obj);
                    }
                    function _defineProperties(target, props) {
                        for (var i = 0; i < props.length; i++) {
                            var descriptor = props[i];
                            descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0,
                            "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
                        }
                    }
                    function _setPrototypeOf(o, p) {
                        return _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
                            return o.__proto__ = p, o;
                        }, _setPrototypeOf(o, p);
                    }
                    function _createSuper(Derived) {
                        var hasNativeReflectConstruct = function _isNativeReflectConstruct() {
                            if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                            if (Reflect.construct.sham) return !1;
                            if ("function" == typeof Proxy) return !0;
                            try {
                                return Date.prototype.toString.call(Reflect.construct(Date, [], (function() {}))),
                                !0;
                            } catch (e) {
                                return !1;
                            }
                        }();
                        return function _createSuperInternal() {
                            var result, Super = _getPrototypeOf(Derived);
                            if (hasNativeReflectConstruct) {
                                var NewTarget = _getPrototypeOf(this).constructor;
                                result = Reflect.construct(Super, arguments, NewTarget);
                            } else result = Super.apply(this, arguments);
                            return function _possibleConstructorReturn(self, call) {
                                if (call && ("object" === clipboard_typeof(call) || "function" == typeof call)) return call;
                                return function _assertThisInitialized(self) {
                                    if (void 0 === self) throw new ReferenceError("\u6316\u6398\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u597d\u597d\u597d\u559d\u7ea2\u9152\u53bb\u653b\u51fb\u540e\u536b\u560e\u54c8\u51e0\u4f4d\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5");
                                    return self;
                                }(self);
                            }(this, result);
                        };
                    }
					    GM_addStyle(`
        .swal-modal {
            width: auto;
            min-width: 730px;
        }
        .swal-modal input {
            border: 1px grey solid;
        }
        #downloadDialog{
            width: 730px;
            font-size:14px;
        }

        #dialogTop{
            margin: 20px 0;
        }
        #dialogFileName{
            color: blue;
            text-decoration:underline;
        }

        #dialogMiddle{}
        #dialogLeftTips{
            text-align: left;
            margin: 0 0 10px 0px;
            color: #4c4433;
            font-size: 13px;
        }
        .dialogLeftTipsLink{
            text-align: center;
        }
        .dialogLeftTipsLink a{
            color: #06a7ff;
        }
        #dialogRight{
            width: 50%;
            float: left;
            margin-left: 15px;
        }
        #dialogContent input{
            vertical-align: middle;
        }
        #dialogRemark{
            text-align: left;
            font-size: 12px;
            margin-top: 5px;
        }
        #dialogVaptchaCode{
            display: none;
            text-align: left;
            margin-top: 5px;
            font-size: 12px;
            border: 2px solid #EDD;
        }
        #dialogVaptchaCodeInput{
            font-size: 14px;
        }
        #dialogCode{
            width: 50%;
        }
        #dialogCodeRemark{}
        #dialogQr{
            width: 265px;
            height: 265px;
            text-align: center;
        }
        #dialogClear{
            clear: both;
        }
        #dialogBottom{
            text-align: left;
            margin: 15px -20px 0 -20px;
            background: #f4c758;
            padding: 10px 0 10px 25px;
            color: #4c4433;
        }
        .btnInterface {
            width: 100%;
            height: 50px;
            background: #f00 !important;
            border-radius: 4px;
            transition: .3s;
            font-size: 25px !important;
            border: 0;
            color: #fff;
            cursor: pointer;
            text-decoration: none;
            font-family: Microsoft YaHei,SimHei,Tahoma;
            font-weight: 100;
            letter-spacing: 2px;
        }
        .btnGreen {
            background: #5cb85c !important;
        }
        #dialogQrImg{
			width: 1px;
			height: 1px;
		}
        #dialogDivSavePath{
            margin-top: 2px;
            text-align: left;
        }
        #dialogOpTips, #dialogOpTipsAria, #dialogOpTipsIdm{
            display: none;
            background: #f4c758;
            padding: 3px 14px;
            color: #4c4433;
            border-radius: 2px;
            font-weight: bold;
            text-align: left;
            margin-top: 2px;
        }
        #dialogOpButtons{
            display: none;
        }
        #dialogBtnIdm, #dialogBtnAria{
            margin-top: 15px;
        }
        #dialogAriaConfig{
            display: none;
            margin-top: 2px;
        }
        #dialogAriaConfigClick{
            color: #0098EA;
            text-decoration: underline;
            cursor:pointer;
            font-size: 12px;
            padding-left: 6px;
        }
        #dialogAriaConfig{
            font-size: 12px;
        }
        #dialogLeft{
            float: left;
            width: 47%;
        }
        .swal-footer{
            margin-top: 5px;
        }
    `);
                    function _getPrototypeOf(o) {
                        return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
                            return o.__proto__ || Object.getPrototypeOf(o);
                        }, _getPrototypeOf(o);
                    }
                    function getAttributeValue(suffix, element) {
                        var attribute = "data-clipboard-".concat(suffix);
                        if (element.hasAttribute(attribute)) return element.getAttribute(attribute);
                    }
                    var Clipboard = function(_Emitter) {
                        !function _inherits(subClass, superClass) {
                            if ("function" != typeof superClass && null !== superClass) throw new TypeError("\u6316\u6398\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u597d\u597d\u597d\u559d\u7ea2\u9152\u53bb\u653b\u51fb\u540e\u536b\u560e\u54c8\u51e0\u4f4d\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5");
                            subClass.prototype = Object.create(superClass && superClass.prototype, {
                                constructor: {
                                    value: subClass,
                                    writable: !0,
                                    configurable: !0
                                }
                            }), superClass && _setPrototypeOf(subClass, superClass);
                        }(Clipboard, _Emitter);
                        var _super = _createSuper(Clipboard);
                        function Clipboard(trigger, options) {
                            var _this;
                            return function _classCallCheck(instance, Constructor) {
                                if (!(instance instanceof Constructor)) throw new TypeError("\u6316\u6398\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u597d\u597d\u597d\u559d\u7ea2\u9152\u53bb\u653b\u51fb\u540e\u536b\u560e\u54c8\u51e0\u4f4d\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5");
                            }(this, Clipboard), (_this = _super.call(this)).resolveOptions(options), _this.listenClick(trigger),
                            _this;
                        }
                        return function _createClass(Constructor, protoProps, staticProps) {
                            return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps),
                            Constructor;
                        }(Clipboard, [ {
                            key: "resolveOptions",
                            value: function resolveOptions() {
                                var options = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                                this.action = "function" == typeof options.action ? options.action : this.defaultAction,
                                this.target = "function" == typeof options.target ? options.target : this.defaultTarget,
                                this.text = "function" == typeof options.text ? options.text : this.defaultText,
                                this.container = "object" === clipboard_typeof(options.container) ? options.container : document.body;
                            }
                        }, {
                            key: "listenClick",
                            value: function listenClick(trigger) {
                                var _this2 = this;
                                this.listener = listen_default()(trigger, "click", (function(e) {
                                    return _this2.onClick(e);
                                }));
                            }
                        }, {
                            key: "onClick",
                            value: function onClick(e) {
                                var trigger = e.delegateTarget || e.currentTarget, action = this.action(trigger) || "copy", text = actions_default({
                                    action: action,
                                    container: this.container,
                                    target: this.target(trigger),
                                    text: this.text(trigger)
                                });
                                this.emit(text ? "success" : "error", {
                                    action: action,
                                    text: text,
                                    trigger: trigger,
                                    clearSelection: function clearSelection() {
                                        trigger && trigger.focus(), window.getSelection().removeAllRanges();
                                    }
                                });
                            }
                        }, {
                            key: "defaultAction",
                            value: function defaultAction(trigger) {
                                return getAttributeValue("action", trigger);
                            }
                        }, {
                            key: "defaultTarget",
                            value: function defaultTarget(trigger) {
                                var selector = getAttributeValue("target", trigger);
                                if (selector) return document.querySelector(selector);
                            }
                        }, {
                            key: "defaultText",
                            value: function defaultText(trigger) {
                                return getAttributeValue("text", trigger);
                            }
                        }, {
                            key: "destroy",
                            value: function destroy() {
                                this.listener.destroy();
                            }
                        } ], [ {
                            key: "copy",
                            value: function copy(target) {
                                var options = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {
                                    container: document.body
                                };
                                return actions_copy(target, options);
                            }
                        }, {
                            key: "cut",
                            value: function cut(target) {
                                return actions_cut(target);
                            }
                        }, {
                            key: "isSupported",
                            value: function isSupported() {
                                var action = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [ "copy", "cut" ], actions = "string" == typeof action ? [ action ] : action, support = !!document.queryCommandSupported;
                                return actions.forEach((function(action) {
                                    support = support && !!document.queryCommandSupported(action);
                                })), support;
                            }
                        } ]), Clipboard;
                    }(tiny_emitter_default()), clipboard = Clipboard;
                },
				
                828: function(module) {
                    if ("undefined" != typeof Element && !Element.prototype.matches) {
                        var proto = Element.prototype;
                        proto.matches = proto.matchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector || proto.oMatchesSelector || proto.webkitMatchesSelector;
                    }
                    module.exports = function closest(element, selector) {
                        for (;element && 9 !== element.nodeType; ) {
                            if ("function" == typeof element.matches && element.matches(selector)) return element;
                            element = element.parentNode;
                        }
                    };
                },
                438: function(module, __unused_webpack_exports, __webpack_require__) {
                    var closest = __webpack_require__(828);
                    function _delegate(element, selector, type, callback, useCapture) {
                        var listenerFn = listener.apply(this, arguments);
                        return element.addEventListener(type, listenerFn, useCapture), {
                            destroy: function() {
                                element.removeEventListener(type, listenerFn, useCapture);
                            }
                        };
                    }
                    function listener(element, selector, type, callback) {
                        return function(e) {
                            e.delegateTarget = closest(e.target, selector), e.delegateTarget && callback.call(element, e);
                        };
                    }
                    module.exports = function delegate(elements, selector, type, callback, useCapture) {
                        return "function" == typeof elements.addEventListener ? _delegate.apply(null, arguments) : "function" == typeof type ? _delegate.bind(null, document).apply(null, arguments) : ("string" == typeof elements && (elements = document.querySelectorAll(elements)),
                        Array.prototype.map.call(elements, (function(element) {
                            return _delegate(element, selector, type, callback, useCapture);
                        })));
                    };
                },
                879: function(__unused_webpack_module, exports) {
                    exports.node = function(value) {
                        return void 0 !== value && value instanceof HTMLElement && 1 === value.nodeType;
                    }, exports.nodeList = function(value) {
                        var type = Object.prototype.toString.call(value);
                        return void 0 !== value && ("[object NodeList]" === type || "[object HTMLCollection]" === type) && "length" in value && (0 === value.length || exports.node(value[0]));
                    }, exports.string = function(value) {
                        return "string" == typeof value || value instanceof String;
                    }, exports.fn = function(value) {
                        return "[object Function]" === Object.prototype.toString.call(value);
                    };
                },
                370: function(module, __unused_webpack_exports, __webpack_require__) {
                    var is = __webpack_require__(879), delegate = __webpack_require__(438);
                    module.exports = function listen(target, type, callback) {
                        if (!target && !type && !callback) throw new Error("Missing required arguments");
                        if (!is.string(type)) throw new TypeError("Second argument must be a String");
                        if (!is.fn(callback)) throw new TypeError("Third argument must be a Function");
                        if (is.node(target)) return function listenNode(node, type, callback) {
                            return node.addEventListener(type, callback), {
                                destroy: function() {
                                    node.removeEventListener(type, callback);
                                }
                            };
                        }(target, type, callback);
                        if (is.nodeList(target)) return function listenNodeList(nodeList, type, callback) {
                            return Array.prototype.forEach.call(nodeList, (function(node) {
                                node.addEventListener(type, callback);
                            })), {
                                destroy: function() {
                                    Array.prototype.forEach.call(nodeList, (function(node) {
                                        node.removeEventListener(type, callback);
                                    }));
                                }
                            };
                        }(target, type, callback);
                        if (is.string(target)) return function listenSelector(selector, type, callback) {
                            return delegate(document.body, selector, type, callback);
                        }(target, type, callback);
                        throw new TypeError("\u6316\u6398\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u54c8\u597d\u597d\u597d\u559d\u7ea2\u9152\u53bb\u653b\u51fb\u540e\u536b\u560e\u54c8\u51e0\u4f4d\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5\u54e5");
                    };
                },
                817: function(module) {
                    module.exports = function select(element) {
                        var selectedText;
                        if ("SELECT" === element.nodeName) element.focus(), selectedText = element.value; else if ("INPUT" === element.nodeName || "TEXTAREA" === element.nodeName) {
                            var isReadOnly = element.hasAttribute("readonly");
                            isReadOnly || element.setAttribute("readonly", ""), element.select(), element.setSelectionRange(0, element.value.length),
                            isReadOnly || element.removeAttribute("readonly"), selectedText = element.value;
                        } else {
                            element.hasAttribute("contenteditable") && element.focus();
                            var selection = window.getSelection(), range = document.createRange();
                            range.selectNodeContents(element), selection.removeAllRanges(), selection.addRange(range),
                            selectedText = selection.toString();
                        }
                        return selectedText;
                    };
                },
                279: function(module) {
                    function E() {}
                    E.prototype = {
                        on: function(name, callback, ctx) {
                            var e = this.e || (this.e = {});
                            return (e[name] || (e[name] = [])).push({
                                fn: callback,
                                ctx: ctx
                            }), this;
                        },
                        once: function(name, callback, ctx) {
                            var self = this;
                            function listener() {
                                self.off(name, listener), callback.apply(ctx, arguments);
                            }
                            return listener._ = callback, this.on(name, listener, ctx);
                        },
                        emit: function(name) {
                            for (var data = [].slice.call(arguments, 1), evtArr = ((this.e || (this.e = {}))[name] || []).slice(), i = 0, len = evtArr.length; i < len; i++) evtArr[i].fn.apply(evtArr[i].ctx, data);
                            return this;
                        },
                        off: function(name, callback) {
                            var e = this.e || (this.e = {}), evts = e[name], liveEvents = [];
                            if (evts && callback) for (var i = 0, len = evts.length; i < len; i++) evts[i].fn !== callback && evts[i].fn._ !== callback && liveEvents.push(evts[i]);
                            return liveEvents.length ? e[name] = liveEvents : delete e[name], this;
                        }
                    }, module.exports = E, module.exports.TinyEmitter = E;
                }
            }, __webpack_module_cache__ = {};
            function __webpack_require__(moduleId) {
                if (__webpack_module_cache__[moduleId]) return __webpack_module_cache__[moduleId].exports;
                var module = __webpack_module_cache__[moduleId] = {
                    exports: {}
                };
                return __webpack_modules__[moduleId](module, module.exports, __webpack_require__),
                module.exports;
            }
            return __webpack_require__.n = function(module) {
                var getter = module && module.__esModule ? function() {
                    return module.default;
                } : function() {
                    return module;
                };
                return __webpack_require__.d(getter, {
                    a: getter
                }), getter;
            }, __webpack_require__.d = function(exports, definition) {
                for (var key in definition) __webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key) && Object.defineProperty(exports, key, {
                    enumerable: !0,
                    get: definition[key]
                });
            }, __webpack_require__.o = function(obj, prop) {
                return Object.prototype.hasOwnProperty.call(obj, prop);
            }, __webpack_require__(686);
        }().default;
    }));
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.ParserV3 = exports.PanResNew = exports.PanRes = void 0;
    var PanRes = function PanRes() {};
    exports.PanRes = PanRes;
    var PanResNew = function PanResNew() {};
    exports.PanResNew = PanResNew;
    var ParserV3 = function ParserV3() {};
    exports.ParserV3 = ParserV3;
}, function(module, exports, __webpack_require__) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.AriaConfig = void 0;
    var AriaConfig = function AriaConfig() {};
    exports.AriaConfig = AriaConfig;
}, function(module, exports) {
    module.exports = mdui;
} ]);