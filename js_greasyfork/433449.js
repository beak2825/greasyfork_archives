// ==UserScript==
// @name          ddrk低端影视助手
// @namespace     king
// @version       1.4.8
// @description   ddrk低端影视功能增强插件: 自动播放下一集,收藏功能,历史记录,去广告,小窗口播放,快进快退,下载视频
// @author        hero-king
// @supportURL    https://github.com/Funbin/ddrk-tools/issues
// @icon          https://ddys.pro/favicon-32x32.png
// @run-at        document-start
// @match         https://ddrk.me/*
// @include       *://ddys.*
// @include       *://ddys2.*
// @grant         unsafeWindow
// @grant         GM_listValues
// @grant         GM_setValue
// @grant         GM_getValue
// @require       http://code.jquery.com/jquery-3.3.1.min.js
// @require       https://cdn.staticfile.org/vue/3.2.33/vue.global.min.js
// @require       https://cdn.staticfile.org/popper.js/2.11.5/umd/popper.min.js
// @downloadURL https://update.greasyfork.org/scripts/433449/ddrk%E4%BD%8E%E7%AB%AF%E5%BD%B1%E8%A7%86%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/433449/ddrk%E4%BD%8E%E7%AB%AF%E5%BD%B1%E8%A7%86%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
/* globals $, DPlayer waitForKeyElements */
// @[ You can find all source codes in GitHub repo ]
!function() {
    "use strict";
    var __webpack_modules__ = {
        251: function(module, __webpack_exports__, __webpack_require__) {
            var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(81), _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__), _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(645), ___CSS_LOADER_EXPORT___ = __webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
            ___CSS_LOADER_EXPORT___.push([ module.id, "\n.col_list_arrow[data-v-4b74ca11]:hover {\n  background: #3b818c;\n}\n.col_list_arrow[data-v-4b74ca11]:nth-child(1) {\n  border-bottom-left-radius: 0;\n}\n.col_list_arrow[data-v-4b74ca11]:nth-child(2) {\n  border-radius: 0;\n}\n.col_list_arrow[data-v-4b74ca11]:nth-child(3) {\n  border-top-left-radius: 0;\n}\n", "" ]), 
            __webpack_exports__.Z = ___CSS_LOADER_EXPORT___;
        },
        646: function(module, __webpack_exports__, __webpack_require__) {
            var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(81), _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__), _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(645), ___CSS_LOADER_EXPORT___ = __webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
            ___CSS_LOADER_EXPORT___.push([ module.id, "\n.col_list-ul .col_item .col_item-left[data-v-0a142c44] {\n  vertical-align: middle;\n}\n.col_list-ul .col_item .col_item-left i[data-v-0a142c44] {\n  line-height: 0;\n  vertical-align: text-top;\n}\n.col_list-ul .col_item .col_item-left .col_item-tags[data-v-0a142c44] {\n  display: inline-block;\n  min-width: 23px;\n  text-align: right;\n  padding-right: 4px;\n  box-sizing: content-box;\n}\n.col_list-ul .col_item .col_item-right[data-v-0a142c44] {\n  display: flex;\n  align-items: center;\n}\n.col_list-ul .col_item .his_time[data-v-0a142c44] {\n  font-size: 12px;\n  color: #fff;\n  margin-left: 5px;\n  white-space: nowrap;\n  line-height: 1;\n}\n.col_list-ul .col_item .his_time_end[data-v-0a142c44] {\n  color: #20b2aa;\n}\n.col_list-ul .col_item .icon_top[data-v-0a142c44] {\n  display: none;\n  cursor: pointer;\n}\n.col_list-ul .col_item:hover .icon_top[data-v-0a142c44] {\n  display: inline-block;\n}\n.col_list-ul .col_item:hover .col_item-index[data-v-0a142c44] {\n  display: none;\n}\n.col_list-ul .col_item:hover .icon_top_tag[data-v-0a142c44] {\n  display: none;\n}\n", "" ]), 
            __webpack_exports__.Z = ___CSS_LOADER_EXPORT___;
        },
        419: function(module, __webpack_exports__, __webpack_require__) {
            var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(81), _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__), _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(645), ___CSS_LOADER_EXPORT___ = __webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
            ___CSS_LOADER_EXPORT___.push([ module.id, "\n.pagination-btn[data-v-40ae7db4] {\n  position: fixed;\n  top: 50%;\n  transform: translateY(-50%);\n  background: rgba(0, 0, 0, 0.5);\n  padding: 30px 0;\n  opacity: 0.5;\n  cursor: pointer;\n}\n.pagination-btn svg[data-v-40ae7db4] {\n  width: 28px;\n}\n.pagination-btn.pagination-left[data-v-40ae7db4] {\n  left: 0;\n  border-top-right-radius: 10px;\n  border-bottom-right-radius: 10px;\n  padding-right: 5px;\n}\n.pagination-btn.pagination-right[data-v-40ae7db4] {\n  right: 0;\n  border-top-left-radius: 10px;\n  border-bottom-left-radius: 10px;\n  padding-left: 5px;\n}\n.Fade-enter[data-v-40ae7db4],\n.Fade-leave-to[data-v-40ae7db4] {\n  opacity: 0;\n}\n.Fade-enter-to[data-v-40ae7db4],\n.Fade-leave[data-v-40ae7db4] {\n  opacity: 0.5;\n}\n.Fade-enter-active[data-v-40ae7db4],\n.Fade-leave-active[data-v-40ae7db4] {\n  transition: all 0.5s;\n}\n", "" ]), 
            __webpack_exports__.Z = ___CSS_LOADER_EXPORT___;
        },
        207: function(module, __webpack_exports__, __webpack_require__) {
            var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(81), _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__), _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(645), _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = __webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__), _node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(755), ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
            ___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_index_css__WEBPACK_IMPORTED_MODULE_2__.Z), 
            ___CSS_LOADER_EXPORT___.push([ module.id, "\n", "" ]), __webpack_exports__.Z = ___CSS_LOADER_EXPORT___;
        },
        647: function(module, __webpack_exports__, __webpack_require__) {
            var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(81), _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__), _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(645), ___CSS_LOADER_EXPORT___ = __webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
            ___CSS_LOADER_EXPORT___.push([ module.id, '/*! @name videojs-seek-buttons @version 2.2.1 @license Apache-2.0 */\n.video-js .vjs-seek-button {\n  font-family: "VideoJS";\n  cursor: pointer;\n  font-weight: 400;\n  font-style: normal;\n}\n.video-js .vjs-seek-button.skip-back::before,\n.video-js.vjs-v6 .vjs-seek-button.skip-back .vjs-icon-placeholder::before,\n.video-js.vjs-v7 .vjs-seek-button.skip-back .vjs-icon-placeholder::before {\n  transform: rotate(-45deg);\n  -ms-transform: rotate(-45deg);\n  -webkit-transform: rotate(-45deg);\n  content: "\\f116";\n}\n.video-js .vjs-seek-button.skip-forward::before {\n  transform: rotateY(180deg) rotate(-45deg);\n  -ms-transform: rotateY(180deg) rotate(-45deg);\n  -webkit-transform: rotateY(180deg) rotate(-45deg);\n  content: "\\f116";\n}\n.video-js.vjs-v6 .vjs-seek-button.skip-back::before,\n.video-js.vjs-v6 .vjs-seek-button.skip-forward::before,\n.video-js.vjs-v7 .vjs-seek-button.skip-back::before,\n.video-js.vjs-v7 .vjs-seek-button.skip-forward::before {\n  content: none;\n}\n.video-js.vjs-v6 .vjs-seek-button.skip-forward .vjs-icon-placeholder::before,\n.video-js.vjs-v7 .vjs-seek-button.skip-forward .vjs-icon-placeholder::before {\n  transform: scale(-1, 1) rotate(-45deg);\n  -ms-transform: scale(-1, 1) rotate(-45deg);\n  -webkit-transform: scale(-1, 1) rotate(-45deg);\n  content: "\\f116";\n}\n', "" ]), 
            __webpack_exports__.Z = ___CSS_LOADER_EXPORT___;
        },
        592: function(module, __webpack_exports__, __webpack_require__) {
            var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(81), _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__), _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(645), ___CSS_LOADER_EXPORT___ = __webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
            ___CSS_LOADER_EXPORT___.push([ module.id, "/* .cfa_popup {\n  height: 0 !important;\n}\n#iaujwnefhw,\n#kasjbgih {\n  height: 0 !important;\n  overflow: hidden !important;\n}\n\n.ddrk-tools__ad .cfa_popup {\n  height: auto !important;\n}\n\n.ddrk-tools__ad #iaujwnefhw,\n.ddrk-tools__ad #kasjbgih {\n  height: auto !important;\n  overflow: visible !important;\n} */\n\n.cfa_popup,\n.entry > div:nth-child(1),\n#iaujwnefhw > div:nth-child(1) {\n  display: none !important;\n}\n\n.ddrk-tools__ad .cfa_popup,\n.ddrk-tools__ad .entry > div:nth-child(1),\n.ddrk-tools__ad #iaujwnefhw > div:nth-child(1) {\n  display: block !important;\n}\n", "" ]), 
            __webpack_exports__.Z = ___CSS_LOADER_EXPORT___;
        },
        21: function(module, __webpack_exports__, __webpack_require__) {
            var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(81), _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__), _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(645), ___CSS_LOADER_EXPORT___ = __webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
            ___CSS_LOADER_EXPORT___.push([ module.id, ".ddrk-tools__modal {\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  text-align: right;\n}\n.btn_col-default {\n  position: absolute;\n  top: 0;\n  right: -32px;\n  width: 32px;\n  padding: 6px;\n  background-color: rgba(0, 0, 0, 0.6);\n  box-shadow: 4px 0px 8px rgba(0, 0, 0, 0.4);\n  line-height: 1;\n  user-select: none;\n}\n.btn_col-playpage {\n  position: fixed;\n  left: 20px;\n  bottom: 70px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 42px;\n  height: 42px;\n  z-index: 9999;\n  border-radius: 5%;\n  background: rgba(0, 0, 0, 0.5);\n  cursor: pointer;\n}\n.btn_download {\n  position: absolute;\n  right: 0;\n  top: 0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  cursor: pointer;\n  z-index: 1;\n}\n", "" ]), 
            __webpack_exports__.Z = ___CSS_LOADER_EXPORT___;
        },
        704: function(module, __webpack_exports__, __webpack_require__) {
            var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(81), _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__), _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(645), ___CSS_LOADER_EXPORT___ = __webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
            ___CSS_LOADER_EXPORT___.push([ module.id, ".ddrk-tools__video-window-small {\n  position: fixed !important;\n  right: 5px;\n  bottom: 10px;\n  width: 30vw !important;\n  height: 16.875vw !important;\n  padding: 0 !important;\n  z-index: 9;\n}\n.ddrk-tools__video-placeholder {\n  background: #000;\n}\n", "" ]), 
            __webpack_exports__.Z = ___CSS_LOADER_EXPORT___;
        },
        374: function(module, __webpack_exports__, __webpack_require__) {
            var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(81), _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__), _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(645), ___CSS_LOADER_EXPORT___ = __webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
            ___CSS_LOADER_EXPORT___.push([ module.id, ".ddrk-tools__video .vjs-time-control.vjs-current-time {\n  display: block;\n}\n.ddrk-tools__video .vjs-time-control.vjs-time-divider {\n  display: block;\n}\n.ddrk-tools__video .vjs-time-control.vjs-duration {\n  display: block;\n  padding-right: 1em !important;\n}\n.ddrk-tools__video .vjs-time-control.vjs-remaining-time {\n  display: none;\n}\n.ddrk-tools__video .vjs-control-bar .vjs-time-control {\n  padding-left: 1px;\n  padding-right: 1px;\n  min-width: auto;\n}\n", "" ]), 
            __webpack_exports__.Z = ___CSS_LOADER_EXPORT___;
        },
        755: function(module, __webpack_exports__, __webpack_require__) {
            var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(81), _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__), _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(645), ___CSS_LOADER_EXPORT___ = __webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
            ___CSS_LOADER_EXPORT___.push([ module.id, ".col_list {\n  position: fixed;\n  top: 50px;\n  right: 0;\n  width: 0;\n  height: auto;\n  min-height: 54px;\n  box-sizing: border-box;\n  background: #2c2c2c;\n  box-shadow: -20px 10px 60px rgba(0, 0, 0, 0.6);\n  z-index: 999;\n  transition: width 0.6s;\n}\n.col_list-active {\n  width: 300px;\n}\n.col_list-active .col_list-ul {\n  overflow: auto;\n}\n.col_list .col_list_arrow {\n  position: absolute;\n  left: -26px;\n  top: 0;\n  line-height: 0;\n  background: #008080;\n  color: #000;\n  border-top-left-radius: 8px;\n  border-bottom-left-radius: 8px;\n}\n.col_list .col_list_arrow svg{\n  width: 26px;\n  padding: 4px;\n}\n.col_list > h6 {\n  color: #aaa;\n  margin: 10px 0 5px 0;\n  text-align: center;\n  white-space: nowrap;\n}\n\n.col_list-ul::-webkit-scrollbar {\n  width: 5px;\n  height: 5px;\n}\n\n.col_list-ul::-webkit-scrollbar-thumb {\n  border-radius: 3px;\n  -moz-border-radius: 3px;\n  -webkit-border-radius: 3px;\n  background-color: #999;\n}\n\n.col_list-ul::-webkit-scrollbar-track {\n  background-color: transparent;\n}\n\n.col_list-ul {\n  width: 300px;\n  height: 300px;\n  padding: 5px 0;\n  overflow: hidden;\n  color: #20b2aa;\n}\n\n.col_list-ul .col_item {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin: 5px 0;\n  padding: 0 5px;\n  line-height: 25px;\n  border: 1px solid transparent;\n  border-left: none;\n  border-right: none;\n}\n.col_list-ul .col_item a {\n  color: #20b2aa;\n}\n.col_list-ul .col_item .icon_del {\n  display: none;\n  cursor: pointer;\n  line-height: 0;\n}\n.col_list-ul .col_item:hover {\n  /* box-shadow: 0 0 5px rgba(32, 178, 170, 0.2);\n    border-color: rgba(225, 255, 255, 0.4); */\n  background: #333;\n}\n.col_list-ul .col_item:hover .icon_del {\n  display: inline-block;\n}\n", "" ]), 
            __webpack_exports__.Z = ___CSS_LOADER_EXPORT___;
        },
        645: function(module) {
            module.exports = function(cssWithMappingToString) {
                var list = [];
                return list.toString = function toString() {
                    return this.map((function(item) {
                        var content = "", needLayer = void 0 !== item[5];
                        return item[4] && (content += "@supports (".concat(item[4], ") {")), item[2] && (content += "@media ".concat(item[2], " {")), 
                        needLayer && (content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {")), 
                        content += cssWithMappingToString(item), needLayer && (content += "}"), item[2] && (content += "}"), 
                        item[4] && (content += "}"), content;
                    })).join("");
                }, list.i = function i(modules, media, dedupe, supports, layer) {
                    "string" == typeof modules && (modules = [ [ null, modules, void 0 ] ]);
                    var alreadyImportedModules = {};
                    if (dedupe) for (var k = 0; k < this.length; k++) {
                        var id = this[k][0];
                        null != id && (alreadyImportedModules[id] = !0);
                    }
                    for (var _k = 0; _k < modules.length; _k++) {
                        var item = [].concat(modules[_k]);
                        dedupe && alreadyImportedModules[item[0]] || (void 0 !== layer && (void 0 === item[5] || (item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}")), 
                        item[5] = layer), media && (item[2] ? (item[1] = "@media ".concat(item[2], " {").concat(item[1], "}"), 
                        item[2] = media) : item[2] = media), supports && (item[4] ? (item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}"), 
                        item[4] = supports) : item[4] = "".concat(supports)), list.push(item));
                    }
                }, list;
            };
        },
        81: function(module) {
            module.exports = function(i) {
                return i[1];
            };
        },
        379: function(module) {
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
                    if (-1 !== indexByIdentifier) stylesInDOM[indexByIdentifier].references++, stylesInDOM[indexByIdentifier].updater(obj); else {
                        var updater = addElementStyle(obj, options);
                        options.byIndex = i, stylesInDOM.splice(i, 0, {
                            identifier: identifier,
                            updater: updater,
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
                        0 === stylesInDOM[_index].references && (stylesInDOM[_index].updater(), stylesInDOM.splice(_index, 1));
                    }
                    lastIdentifiers = newLastIdentifiers;
                };
            };
        },
        569: function(module) {
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
        216: function(module) {
            module.exports = function insertStyleElement(options) {
                var element = document.createElement("style");
                return options.setAttributes(element, options.attributes), options.insert(element, options.options), 
                element;
            };
        },
        565: function(module, __unused_webpack_exports, __webpack_require__) {
            module.exports = function setAttributesWithoutAttributes(styleElement) {
                var nonce = __webpack_require__.nc;
                nonce && styleElement.setAttribute("nonce", nonce);
            };
        },
        795: function(module) {
            module.exports = function domAPI(options) {
                var styleElement = options.insertStyleElement(options);
                return {
                    update: function update(obj) {
                        !function apply(styleElement, options, obj) {
                            var css = "";
                            obj.supports && (css += "@supports (".concat(obj.supports, ") {")), obj.media && (css += "@media ".concat(obj.media, " {"));
                            var needLayer = void 0 !== obj.layer;
                            needLayer && (css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {")), 
                            css += obj.css, needLayer && (css += "}"), obj.media && (css += "}"), obj.supports && (css += "}");
                            var sourceMap = obj.sourceMap;
                            sourceMap && "undefined" != typeof btoa && (css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */")), 
                            options.styleTagTransform(css, styleElement, options.options);
                        }(styleElement, options, obj);
                    },
                    remove: function remove() {
                        !function removeStyleElement(styleElement) {
                            if (null === styleElement.parentNode) return !1;
                            styleElement.parentNode.removeChild(styleElement);
                        }(styleElement);
                    }
                };
            };
        },
        589: function(module) {
            module.exports = function styleTagTransform(css, styleElement) {
                if (styleElement.styleSheet) styleElement.styleSheet.cssText = css; else {
                    for (;styleElement.firstChild; ) styleElement.removeChild(styleElement.firstChild);
                    styleElement.appendChild(document.createTextNode(css));
                }
            };
        },
        744: function(__unused_webpack_module, exports) {
            exports.Z = (sfc, props) => {
                const target = sfc.__vccOpts || sfc;
                for (const [key, val] of props) target[key] = val;
                return target;
            };
        },
        256: function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            __webpack_require__.r(__webpack_exports__);
            videojs.addLanguage("zh", {
                "Seek forward {{seconds}} seconds": "快进 {{seconds}} 秒",
                "Seek back {{seconds}} seconds": "快退 {{seconds}} 秒"
            });
            const Button = videojs.getComponent("Button"), defaults = {
                forwardIndex: 1,
                backIndex: 1
            }, registerPlugin = videojs.registerPlugin || videojs.plugin, seekButtons = function(options) {
                this.ready((() => {
                    ((player, options) => {
                        player.addClass("vjs-seek-buttons"), options.forward && options.forward > 0 && (player.controlBar.seekForward = player.controlBar.addChild("seekButton", {
                            direction: "forward",
                            seconds: options.forward
                        }, options.forwardIndex)), options.back && options.back > 0 && (player.controlBar.seekBack = player.controlBar.addChild("seekButton", {
                            direction: "back",
                            seconds: options.back
                        }, options.backIndex));
                    })(this, videojs.mergeOptions(defaults, options));
                }));
            };
            seekButtons.VERSION = "1.0";
            videojs.registerComponent("SeekButton", class extends Button {
                constructor(player, options) {
                    super(player, options), "forward" === this.options_.direction ? this.controlText(this.localize("Seek forward {{seconds}} seconds").replace("{{seconds}}", this.options_.seconds)) : "back" === this.options_.direction && this.controlText(this.localize("Seek back {{seconds}} seconds").replace("{{seconds}}", this.options_.seconds));
                }
                buildCSSClass() {
                    return `vjs-seek-button skip-${this.options_.direction} skip-${this.options_.seconds} ${super.buildCSSClass()}`;
                }
                handleClick() {
                    const now = this.player_.currentTime();
                    if ("forward" === this.options_.direction) {
                        let duration = this.player_.duration();
                        this.player_.liveTracker && this.player_.liveTracker.isLive() && (duration = this.player_.liveTracker.seekableEnd()), 
                        this.player_.currentTime(Math.min(now + this.options_.seconds, duration));
                    } else "back" === this.options_.direction && this.player_.currentTime(Math.max(0, now - this.options_.seconds));
                }
            }), registerPlugin("seekButtons", seekButtons), __webpack_exports__.default = seekButtons;
        }
    }, __webpack_module_cache__ = {};
    function __webpack_require__(moduleId) {
        var cachedModule = __webpack_module_cache__[moduleId];
        if (void 0 !== cachedModule) return cachedModule.exports;
        var module = __webpack_module_cache__[moduleId] = {
            id: moduleId,
            exports: {}
        };
        return __webpack_modules__[moduleId](module, module.exports, __webpack_require__), 
        module.exports;
    }
    __webpack_require__.n = function(module) {
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
    }, __webpack_require__.r = function(exports) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(exports, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(exports, "__esModule", {
            value: !0
        });
    }, __webpack_require__.nc = void 0, function() {
        var injectStylesIntoStyleTag = __webpack_require__(379), injectStylesIntoStyleTag_default = __webpack_require__.n(injectStylesIntoStyleTag), styleDomAPI = __webpack_require__(795), styleDomAPI_default = __webpack_require__.n(styleDomAPI), insertBySelector = __webpack_require__(569), insertBySelector_default = __webpack_require__.n(insertBySelector), setAttributesWithoutAttributes = __webpack_require__(565), setAttributesWithoutAttributes_default = __webpack_require__.n(setAttributesWithoutAttributes), insertStyleElement = __webpack_require__(216), insertStyleElement_default = __webpack_require__.n(insertStyleElement), styleTagTransform = __webpack_require__(589), styleTagTransform_default = __webpack_require__.n(styleTagTransform), ad_fix = __webpack_require__(592), options = {};
        options.styleTagTransform = styleTagTransform_default(), options.setAttributes = setAttributesWithoutAttributes_default(), 
        options.insert = insertBySelector_default().bind(null, "head"), options.domAPI = styleDomAPI_default(), 
        options.insertStyleElement = insertStyleElement_default();
        injectStylesIntoStyleTag_default()(ad_fix.Z, options), ad_fix.Z && ad_fix.Z.locals && ad_fix.Z.locals;
        var style = __webpack_require__(21), style_options = {};
        style_options.styleTagTransform = styleTagTransform_default(), style_options.setAttributes = setAttributesWithoutAttributes_default(), 
        style_options.insert = insertBySelector_default().bind(null, "head"), style_options.domAPI = styleDomAPI_default(), 
        style_options.insertStyleElement = insertStyleElement_default();
        injectStylesIntoStyleTag_default()(style.Z, style_options), style.Z && style.Z.locals && style.Z.locals;
        var video_fix = __webpack_require__(374), video_fix_options = {};
        video_fix_options.styleTagTransform = styleTagTransform_default(), video_fix_options.setAttributes = setAttributesWithoutAttributes_default(), 
        video_fix_options.insert = insertBySelector_default().bind(null, "head"), video_fix_options.domAPI = styleDomAPI_default(), 
        video_fix_options.insertStyleElement = insertStyleElement_default();
        injectStylesIntoStyleTag_default()(video_fix.Z, video_fix_options), video_fix.Z && video_fix.Z.locals && video_fix.Z.locals;
        var small_window = __webpack_require__(704), small_window_options = {};
        small_window_options.styleTagTransform = styleTagTransform_default(), small_window_options.setAttributes = setAttributesWithoutAttributes_default(), 
        small_window_options.insert = insertBySelector_default().bind(null, "head"), small_window_options.domAPI = styleDomAPI_default(), 
        small_window_options.insertStyleElement = insertStyleElement_default();
        injectStylesIntoStyleTag_default()(small_window.Z, small_window_options), small_window.Z && small_window.Z.locals && small_window.Z.locals;
        const WD = window.unsafeWindow || document.defaultView || window;
        var external_Vue_namespaceObject = Vue;
        const _hoisted_1 = [ "innerHTML" ], _hoisted_2 = [ "innerHTML" ], _hoisted_3 = [ "innerHTML" ];
        var Containervue_type_script_setup_true_lang_js = {
            name: "Container",
            setup(__props) {
                const currentHoverIcon = (0, external_Vue_namespaceObject.ref)(0);
                let timer = null;
                const showAll = (0, external_Vue_namespaceObject.ref)(!1), handleOver = () => {
                    showAll.value = !0, timer && clearTimeout(timer);
                }, handleOut = () => {
                    timer && clearTimeout(timer), timer = setTimeout((() => {
                        showAll.value = !1;
                    }), 1e3);
                };
                return (_ctx, _cache) => ((0, external_Vue_namespaceObject.openBlock)(), (0, external_Vue_namespaceObject.createElementBlock)("div", {
                    class: (0, external_Vue_namespaceObject.normalizeClass)([ "col_list", {
                        "col_list-active": showAll.value
                    } ]),
                    onMouseover: handleOver,
                    onMouseout: handleOut
                }, [ (0, external_Vue_namespaceObject.createElementVNode)("i", {
                    innerHTML: (0, external_Vue_namespaceObject.unref)('<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="32" height="32"> <path d="M856.8 82.8H386.1c-40.4-43.2-135.5-67-188.9-67-94.9 0-175.8 70.5-188.9 164.4-5.6 16-8.3 31.3-8.3 46.7v603.7c0 98.7 80.3 179.2 179.2 179.2h695.7c82 0 148.8-66.7 148.8-148.8V249.8c0-92.2-74.8-167-166.9-167z m0 30.4c60 0 110.5 39.2 128.7 93.2H627.2l-183.5-93.2h413.1z m136.6 747.7c0 65.3-53.1 118.4-118.4 118.4H179.3c-82 0.1-148.9-66.7-148.9-148.8V226.8c0-12.3 2.3-24.7 7-38l0.8-3.2c10.5-79.4 78.7-139.5 159.1-139.5 56.2 0 142.9 26.7 170.1 61.2l4.6 5.8h2.6l242.3 120.3h374.9c0.6 5.3 1.6 10.6 1.6 16.1v611.4z m0 0" fill="#000000" p-id="2983"></path> <path d="M201.3 842.6h791v27.8h-791v-27.8z m-92.9 0h30.3v30.3h-30.3v-30.3z m258-260L346.1 693.8c-1.9 10.7 2.3 21.3 11 27.8 8.8 6.5 20.1 7.4 29.8 2.5l98.7-51.6 99.5 53.6c4.3 2.3 8.9 3.4 13.5 3.4 5.7 0 11.5-1.8 16.4-5.3 8.8-6.3 13.3-16.8 11.6-27.6L608.1 586.8l81.8-78c7.8-7.5 10.7-18.6 7.5-29-3.3-10.4-12-17.8-22.7-19.5L564.5 444l-49-101.9c-4.7-9.8-14.4-15.9-25.2-16.1-9.7-0.5-20.7 5.8-25.6 15.5L415.1 441.1l-112 15.1c-10.7 1.5-19.6 8.8-23.1 19.1s-0.8 21.4 6.9 29.1l79.5 78.2z m52.8-111.3c9.2-1.2 17.2-6.9 21.5-15.3l49.2-97.2 47.2 98.3c4.1 8.4 12 14.3 21.2 15.7L666.1 489.6l-78.8 75.2c-6.7 6.4-9.9 15.7-8.4 25l18.5 108.3-97.3-52.3c-4.2-2.3-8.8-3.4-13.4-3.4-4.4 0-8.9 1-13 3.1l-97 49.7 19.6-107.3c1.7-9.2-1.3-18.6-7.9-25.1l-77.3-77 108.1-14.5z m0 0" fill="#000000" p-id="2984"></path> </svg>'),
                    class: "col_list_arrow",
                    style: {
                        top: "0"
                    },
                    onMouseenter: _cache[0] || (_cache[0] = $event => currentHoverIcon.value = 1)
                }, null, 40, _hoisted_1), (0, external_Vue_namespaceObject.createElementVNode)("i", {
                    innerHTML: (0, external_Vue_namespaceObject.unref)('<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="32" height="32"> <path d="M204.8 552.96h204.8a20.48 20.48 0 0 1 0 40.96H204.8a20.48 20.48 0 0 1 0-40.96z" p-id="4654" fill="#000000"></path> <path d="M143.36 921.6a40.96 40.96 0 0 1-40.96-40.96V143.36a40.96 40.96 0 0 1 40.96-40.96h614.4a40.96 40.96 0 0 1 40.96 40.96v327.68h40.96V143.36a81.92 81.92 0 0 0-81.92-81.92H143.36a81.92 81.92 0 0 0-81.92 81.92v737.28a81.92 81.92 0 0 0 81.92 81.92h327.68v-40.96z" p-id="4655" fill="#000000"></path> <path d="M737.28 512a225.28 225.28 0 1 0 225.28 225.28 225.28 225.28 0 0 0-225.28-225.28z m0 409.6a184.32 184.32 0 1 1 184.32-184.32 184.32 184.32 0 0 1-184.32 184.32z" p-id="4656" fill="#000000"></path> <path d="M771.2768 660.6848Q634.88 584.0896 634.88 737.28t136.6016 76.5952q136.192-76.5952-0.2048-153.1904z m-13.5168 122.88Q675.84 829.44 675.84 737.28t81.92-46.08q81.92 46.08 0 92.16zM225.28 307.2h-20.48a20.48 20.48 0 0 0 0 40.96h20.48zM696.32 307.2H266.24v40.96h430.08a20.48 20.48 0 0 0 0-40.96z" p-id="4657" fill="#000000"></path> </svg>'),
                    class: "col_list_arrow",
                    style: {
                        top: "32px"
                    },
                    onMouseenter: _cache[1] || (_cache[1] = $event => currentHoverIcon.value = 2)
                }, null, 40, _hoisted_2), (0, external_Vue_namespaceObject.createElementVNode)("i", {
                    innerHTML: (0, external_Vue_namespaceObject.unref)('<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="32" height="32"> <path d="M746.666667 469.333333H277.333333C159.509333 469.333333 64 373.824 64 256S159.509333 42.666667 277.333333 42.666667h469.333334c117.802667 0 213.333333 95.509333 213.333333 213.333333s-95.530667 213.333333-213.333333 213.333333z m0-384H277.333333a170.666667 170.666667 0 0 0 0 341.333334h469.333334a170.666667 170.666667 0 0 0 0-341.333334zM277.333333 384a128 128 0 1 1 0-256 128 128 0 0 1 0 256z m0-213.333333a85.333333 85.333333 0 1 0 0 170.666666 85.333333 85.333333 0 0 0 0-170.666666z m0 384h469.333334c117.802667 0 213.333333 95.530667 213.333333 213.333333s-95.530667 213.333333-213.333333 213.333333H277.333333C159.509333 981.333333 64 885.802667 64 768s95.509333-213.333333 213.333333-213.333333z m0 384h469.333334a170.666667 170.666667 0 0 0 0-341.333334H277.333333a170.666667 170.666667 0 0 0 0 341.333334z m469.333334-298.666667a128 128 0 0 1 0 256 128 128 0 0 1 0-256z m0 213.333333a85.333333 85.333333 0 1 0 0-170.666666 85.333333 85.333333 0 0 0 0 170.666666z" fill="#2c2c2c" p-id="12986"></path> </svg>'),
                    class: "col_list_arrow",
                    style: {
                        top: "64px"
                    },
                    onMouseenter: _cache[2] || (_cache[2] = $event => currentHoverIcon.value = 3)
                }, null, 40, _hoisted_3), (0, external_Vue_namespaceObject.renderSlot)(_ctx.$slots, "default", {
                    type: currentHoverIcon.value
                }) ], 34));
            }
        }, Containervue_type_style_index_0_id_4b74ca11_scoped_true_lang_css = __webpack_require__(251), Containervue_type_style_index_0_id_4b74ca11_scoped_true_lang_css_options = {};
        Containervue_type_style_index_0_id_4b74ca11_scoped_true_lang_css_options.styleTagTransform = styleTagTransform_default(), 
        Containervue_type_style_index_0_id_4b74ca11_scoped_true_lang_css_options.setAttributes = setAttributesWithoutAttributes_default(), 
        Containervue_type_style_index_0_id_4b74ca11_scoped_true_lang_css_options.insert = insertBySelector_default().bind(null, "head"), 
        Containervue_type_style_index_0_id_4b74ca11_scoped_true_lang_css_options.domAPI = styleDomAPI_default(), 
        Containervue_type_style_index_0_id_4b74ca11_scoped_true_lang_css_options.insertStyleElement = insertStyleElement_default();
        injectStylesIntoStyleTag_default()(Containervue_type_style_index_0_id_4b74ca11_scoped_true_lang_css.Z, Containervue_type_style_index_0_id_4b74ca11_scoped_true_lang_css_options), 
        Containervue_type_style_index_0_id_4b74ca11_scoped_true_lang_css.Z && Containervue_type_style_index_0_id_4b74ca11_scoped_true_lang_css.Z.locals && Containervue_type_style_index_0_id_4b74ca11_scoped_true_lang_css.Z.locals;
        var exportHelper = __webpack_require__(744);
        var Container = (0, exportHelper.Z)(Containervue_type_script_setup_true_lang_js, [ [ "__scopeId", "data-v-4b74ca11" ] ]);
        const Store_setValue = function(key, value) {
            window.GM_setValue ? GM_setValue(key, value) : localStorage.setItem(key, value);
        }, Store_getValue = function(key) {
            return window.GM_getValue && GM_getValue(key) || localStorage.getItem(key);
        }, DEFAULT_SETTINGS = [ {
            id: 1,
            name: "自动播放下一集",
            val: !0
        }, {
            id: 2,
            name: "点击海报打开新标签",
            val: !0
        }, {
            id: 3,
            name: "播放时提示上次观看位置",
            val: !0
        }, {
            id: 4,
            name: "开启小窗口播放(脱离可视区域时)",
            val: !0
        }, {
            id: 5,
            name: "点击下载直接跳转不再弹框",
            val: !1
        }, {
            id: 6,
            name: "上下页（集）显示",
            val: !0
        }, {
            id: 7,
            name: "播放器显示当前时间",
            val: !0
        }, {
            id: 8,
            name: "快进快退",
            val: !0
        }, {
            id: 9,
            name: "隐藏广告",
            val: !1
        } ], Settings = {
            curList: (0, external_Vue_namespaceObject.ref)([]),
            init() {
                this.curList.value = this._compareData();
            },
            _compareData() {
                const localDataStr = Store_getValue("ddrk-tools-settings");
                if (localDataStr) {
                    const localData = JSON.parse(localDataStr);
                    return DEFAULT_SETTINGS.map((item => {
                        const localItem = localData.find((ele => ele.id === item.id));
                        return localItem ? {
                            ...item,
                            val: localItem.val
                        } : item;
                    }));
                }
                return DEFAULT_SETTINGS;
            },
            getList() {
                return this.curList.value = this._compareData(), this.curList.value;
            },
            setList(list) {
                this.curList.value = list, Store_setValue("ddrk-tools-settings", JSON.stringify(list));
            },
            getValueById(id) {
                return (this.curList.value.find((item => item.id === id)) || {
                    val: !1
                }).val;
            }
        };
        var iconStarFill = '<svg viewBox="0 0 1071 1024" xmlns="http://www.w3.org/2000/svg" width="20" height="20"> <title>已收藏</title> <path d="M595.741436 18.32575a97.371215 97.371215 0 0 1 23.150006 23.563834l135.589417 195.61877a48.685607 48.685607 0 0 0 27.823824 19.401215l214.411416 55.47725a97.371215 97.371215 0 0 1 54.138395 151.850409l-143.69557 195.910885a48.685607 48.685607 0 0 0-9.420665 29.381764l2.677708 216.504896a97.371215 97.371215 0 0 1-126.533894 94.109279l-219.133919-68.817106a48.685607 48.685607 0 0 0-28.821879-0.121714l-231.402693 70.740188a97.371215 97.371215 0 0 1-125.852295-93.111224v-220.78923a48.685607 48.685607 0 0 0-8.203525-27.069198L26.801427 461.194378a97.371215 97.371215 0 0 1 55.574621-148.150304l208.301371-56.158848a48.685607 48.685607 0 0 0 26.82577-18.573559l142.332373-197.809623a97.371215 97.371215 0 0 1 135.905874-22.176294z m104.1872 535.298254c-37.926088 42.940706-89.16769 64.265002-157.49794 64.265001-68.963163 0-123.564072-21.859838-166.821234-66.090712a48.685607 48.685607 0 0 0-69.620419 68.062479c62.025464 63.437347 141.845517 95.423791 236.465995 95.423791 95.277734 0 173.320763-32.521986 230.453323-97.249501a48.685607 48.685607 0 0 0-73.004068-64.411058z" p-id="2830" fill="#008080"></path> </svg>';
        const LocalCollection = {
            playPageHref: "",
            colList: (0, external_Vue_namespaceObject.ref)([]),
            init() {
                const storeColList = JSON.parse(Store_getValue("ddrk-tools-collection") || "[]");
                this.colList.value = storeColList.map((item => ({
                    ...item,
                    href: item.href.replace(/^https:\/\/(ddrk.me|ddys.tv|ddys2.me)/, "")
                })));
                const modal = $("<a class='ddrk-tools__modal' title='ddrk助手功能: 点击打开新标签（可取消）'></a>");
                $(".post-box").length ? $(".post-box").each((function() {
                    modal.attr("href", $(this).data("href")), $(this).append(modal.clone(!0));
                })) : this.playPageHref = "/" + window.location.pathname.split("/")[1] + "/", this.reloadCollectButton(), 
                this.bindEvent();
            },
            bindEvent() {
                const self = this;
                $(".post-box").on("click", ".ddrk-tools__modal", (function(e) {
                    return console.log("opentab: ", Settings.getValueById(2)), Settings.getValueById(2) ? window.open($(this).parent().data("href")) : window.location.href = $(this).parent().data("href"), 
                    e.stopPropagation(), !1;
                })), $(".post-box").on("click", ".btn_col-default", (function(e) {
                    e.stopPropagation();
                })), $(".post-box").on("click", ".btn_col-add", (function(e) {
                    const href = $(this).parent().data("href").replace(window.location.origin, ""), name = $(this).parent().find(".post-box-title a").text();
                    self.colList.value.find((item => item.href === href)) || (self.colList.value.unshift({
                        name: name.indexOf("(") > -1 ? name.split("(")[0] : name,
                        href: href,
                        t: Date.now()
                    }), Store_setValue("ddrk-tools-collection", JSON.stringify((0, external_Vue_namespaceObject.toRaw)(self.colList.value)))), 
                    self.toggleButton($(this), 1);
                })), $(".post-box").on("click", ".btn_col-remove", (function(e) {
                    const href = $(this).parent().data("href").replace(window.location.origin, ""), index = self.colList.value.findIndex((item => item.href === href));
                    self.handleColDel(index), self.toggleButton($(this), 0);
                })), $("#ddrk-tools").on("click", ".btn_col-remove", (function(e) {
                    const index = self.colList.value.findIndex((item => item.href === self.playPageHref));
                    self.handleColDel(index), self.toggleButton($(this), 0);
                })), $("#ddrk-tools").on("click", ".btn_col-add", (function(e) {
                    const name = $(".post-title").text();
                    self.colList.value.find((item => item.href === self.playPageHref)) || (self.colList.value.unshift({
                        name: name.indexOf("(") > -1 ? name.split("(")[0] : name,
                        href: self.playPageHref,
                        t: Date.now()
                    }), Store_setValue("ddrk-tools-collection", JSON.stringify((0, external_Vue_namespaceObject.toRaw)(self.colList.value)))), 
                    self.toggleButton($(this), 1);
                }));
            },
            toggleButton(tempBtn, tag) {
                0 === tag ? (tempBtn.addClass("btn_col-add"), tempBtn.removeClass("btn_col-remove"), 
                tempBtn.html('<svg viewBox="0 0 1026 1024" xmlns="http://www.w3.org/2000/svg" width="20" height="20"> <title>收藏</title> <path d="M1019.109859 384c-11.286261-32.01113-39.713391-55.05113-74.195478-60.126609L701.69212 288.233739l-105.627826-216.019478c-15.270957-31.276522-48.261565-51.489391-84.057043-51.489391-35.706435 0-68.652522 20.21287-83.968 51.489391l-105.672348 216.041739L79.166902 323.940174c-34.504348 4.964174-62.953739 27.981913-74.24 60.17113-11.264 32.50087-2.871652 67.806609 21.882435 92.137739l178.509913 175.638261-41.405217 243.378087c-5.810087 33.925565 9.282783 68.719304 38.555826 88.687304 28.627478 19.255652 67.005217 21.370435 97.836522 5.164522l211.745391-112.39513 211.878957 112.417391c13.712696 7.234783 29.094957 11.063652 44.521739 11.063652 19.010783 0 37.420522-5.609739 53.337043-16.317217 29.139478-19.878957 44.210087-54.650435 38.4-88.576l-41.382957-243.400348 178.532174-175.638261C1022.048294 451.917913 1030.440641 416.589913 1019.109859 384zM966.062207 444.527304l-195.094261 191.955478 45.278609 266.329043c2.938435 17.096348-4.585739 34.05913-19.478261 44.232348-15.248696 10.24-35.817739 11.330783-52.045913 2.782609L512.00725 826.323478l-232.537043 123.436522c-16.406261 8.637217-36.997565 7.479652-52.045913-2.671304-15.048348-10.262261-22.572522-27.247304-19.634087-44.343652l45.30087-266.284522-195.072-191.955478c-12.377043-12.154435-16.606609-29.718261-11.063652-45.723826 5.765565-16.384 20.524522-28.182261 38.622609-30.786783l266.48487-39.112348 115.97913-237.122783c7.880348-16.11687 25.154783-26.534957 43.987478-26.534957 18.899478 0 36.173913 10.395826 44.054261 26.512696l115.95687 237.122783 266.418087 39.023304c18.075826 2.671304 32.901565 14.514087 38.64487 30.809043C982.668815 414.786783 978.43925 432.328348 966.062207 444.527304zM509.046555 376.898783c-45.590261 0-82.320696 13.913043-109.122783 41.316174-44.744348 45.746087-43.78713 112.194783-43.720348 115.021913 0.26713 12.109913 10.173217 21.726609 22.238609 21.726609 0.133565 0 0.289391 0 0.422957 0 12.265739-0.222609 22.016-10.373565 21.837913-22.639304 0-0.512-0.400696-51.066435 31.254261-83.18887 18.098087-18.387478 44.054261-27.692522 77.06713-27.692522 12.288 0 22.26087-9.97287 22.26087-22.26087S521.334555 376.898783 509.046555 376.898783z" p-id="6346" fill="#008080"></path> </svg>')) : (tempBtn.addClass("btn_col-remove"), 
                tempBtn.removeClass("btn_col-add"), tempBtn.html(iconStarFill));
            },
            refreshColList() {
                this.colList.value = JSON.parse(Store_getValue("ddrk-tools-collection") || "[]");
            },
            reloadCollectButton() {
                const self = this;
                if ($(".post-box").length) $(".post-box").each((function() {
                    let tempBtn = $(this).find(".btn_col-default");
                    tempBtn.length || (tempBtn = $(`<span class="btn_col-default btn_col-remove">${iconStarFill}</span>`), 
                    $(this).append(tempBtn));
                    const collectionUrl = $(this).data("href").replace(window.location.origin, "");
                    self.colList.value.find((item => item.href === collectionUrl)) ? self.toggleButton(tempBtn, 1) : self.toggleButton(tempBtn, 0);
                })); else {
                    let tempBtn = $(".btn_col-playpage");
                    tempBtn.length || (tempBtn = $(`<span class="btn_col-playpage btn_col-remove">${iconStarFill}</span>`), 
                    $("#ddrk-tools").append(tempBtn)), self.colList.value.find((item => item.href === this.playPageHref)) ? self.toggleButton(tempBtn, 1) : self.toggleButton(tempBtn, 0);
                }
            },
            handleColDel(index) {
                -1 !== index && (this.colList.value.splice(index, 1), Store_setValue("ddrk-tools-collection", JSON.stringify((0, 
                external_Vue_namespaceObject.toRaw)(this.colList.value))));
            }
        };
        var iconDelete = '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="16" height="16"> <title>删除</title> <path d="M202.666667 256h-42.666667a32 32 0 0 1 0-64h704a32 32 0 0 1 0 64H266.666667v565.333333a53.333333 53.333333 0 0 0 53.333333 53.333334h384a53.333333 53.333333 0 0 0 53.333333-53.333334V352a32 32 0 0 1 64 0v469.333333c0 64.8-52.533333 117.333333-117.333333 117.333334H320c-64.8 0-117.333333-52.533333-117.333333-117.333334V256z m224-106.666667a32 32 0 0 1 0-64h170.666666a32 32 0 0 1 0 64H426.666667z m-32 288a32 32 0 0 1 64 0v256a32 32 0 0 1-64 0V437.333333z m170.666666 0a32 32 0 0 1 64 0v256a32 32 0 0 1-64 0V437.333333z" p-id="2817" fill="#ffffff"></path> </svg>';
        const Collectionvue_type_script_setup_true_lang_js_hoisted_1 = {
            class: "col_list-ul"
        }, Collectionvue_type_script_setup_true_lang_js_hoisted_2 = [ "href" ], Collectionvue_type_script_setup_true_lang_js_hoisted_3 = [ "innerHTML", "onClick" ];
        var Collection = {
            name: "Collection",
            props: {
                title: {
                    type: String,
                    required: !0
                }
            },
            setup(__props) {
                const colList = (0, external_Vue_namespaceObject.computed)((() => LocalCollection.colList.value));
                document.addEventListener("visibilitychange", (async function() {
                    "visible" == document.visibilityState && (LocalCollection.refreshColList(), LocalCollection.reloadCollectButton());
                }));
                return (_ctx, _cache) => ((0, external_Vue_namespaceObject.openBlock)(), (0, external_Vue_namespaceObject.createElementBlock)(external_Vue_namespaceObject.Fragment, null, [ (0, 
                external_Vue_namespaceObject.createElementVNode)("h6", null, (0, external_Vue_namespaceObject.toDisplayString)(__props.title), 1), (0, 
                external_Vue_namespaceObject.createElementVNode)("ul", Collectionvue_type_script_setup_true_lang_js_hoisted_1, [ ((0, 
                external_Vue_namespaceObject.openBlock)(!0), (0, external_Vue_namespaceObject.createElementBlock)(external_Vue_namespaceObject.Fragment, null, (0, 
                external_Vue_namespaceObject.renderList)((0, external_Vue_namespaceObject.unref)(colList), ((item, index) => ((0, 
                external_Vue_namespaceObject.openBlock)(), (0, external_Vue_namespaceObject.createElementBlock)("li", {
                    class: "col_item",
                    key: index
                }, [ (0, external_Vue_namespaceObject.createElementVNode)("span", null, [ (0, external_Vue_namespaceObject.createTextVNode)((0, 
                external_Vue_namespaceObject.toDisplayString)(index + 1) + ". ", 1), (0, external_Vue_namespaceObject.createElementVNode)("a", {
                    href: item.href
                }, (0, external_Vue_namespaceObject.toDisplayString)(item.name), 9, Collectionvue_type_script_setup_true_lang_js_hoisted_2) ]), (0, 
                external_Vue_namespaceObject.createElementVNode)("i", {
                    class: "icon_del",
                    innerHTML: (0, external_Vue_namespaceObject.unref)(iconDelete),
                    onClick: (0, external_Vue_namespaceObject.withModifiers)(($event => (index => {
                        LocalCollection.handleColDel(index), LocalCollection.reloadCollectButton();
                    })(index)), [ "stop" ])
                }, null, 8, Collectionvue_type_script_setup_true_lang_js_hoisted_3) ])))), 128)) ]) ], 64));
            }
        };
        const Common = {
            sleep: time => new Promise((resolve => {
                setTimeout(resolve, time);
            })),
            ready: () => new Promise((resolve => {
                $(document).ready((function() {
                    resolve();
                }));
            })),
            isMobile: () => /Mobi|Android|iPhone/i.test(navigator.userAgent),
            request: ({url: url, type: type} = config) => new Promise(((resolve, reject) => {
                $.ajax({
                    url: url,
                    type: type,
                    success: function(result) {
                        resolve(result);
                    },
                    error: function(e) {
                        reject(e);
                    }
                });
            }))
        }, LocalHistory = {
            setLocalHistory(list) {
                const newList = list.filter((item => !item.deleteInfo || !(Date.now() - item.deleteInfo.t > 15552e6)));
                Store_setValue("ddrk-tools-history", JSON.stringify(newList));
            },
            async getLocalHistory() {
                let jsonList = JSON.parse(Store_getValue("ddrk-tools-history") || "[]");
                jsonList.length || Store_setValue("ddrk-tools-resume", "");
                const newhis = this.getLocalStorageData().filter((item => 0 === item.key.indexOf("videojs-resume:"))), oldhis = JSON.parse(Store_getValue("ddrk-tools-resume") || "[]"), minus = newhis.filter((newItem => !oldhis.some((oldItem => oldItem.key === newItem.key && oldItem.val === newItem.val)))), minushis = this.formatLocalData(minus), filterList = this.filterLocalData(minushis);
                let res = this.compareLocalData(jsonList, filterList);
                for (const item of res) if (!item.name && (item.errorTimes || 0) < 50) {
                    const {name: name = "", category: category} = await this.getDramaName(item.url);
                    item.name = name.indexOf("(") > -1 ? name.split("(")[0] : name, item.category = category, 
                    name || (item.errorTimes = item.errorTimes ? item.errorTimes++ : 1);
                }
                return res = res.filter((item => item.name)), Store_setValue("ddrk-tools-history", JSON.stringify(res)), 
                Store_setValue("ddrk-tools-resume", JSON.stringify(newhis)), res;
            },
            getLocalStorageData: function() {
                for (var len = localStorage.length, arr = new Array, i = 0; i < len; i++) {
                    var getKey = localStorage.key(i), getVal = localStorage.getItem(getKey);
                    arr[i] = {
                        key: getKey,
                        val: getVal
                    };
                }
                return arr;
            },
            formatLocalData: local => local.map((item => {
                const info = item.key.split("/");
                return {
                    ...item,
                    url: item.key.split(":")[1],
                    enName: info[1],
                    season: info.length > 3 && !isNaN(info[2]) ? info[2] : "",
                    ep: info.at(-1).replace("?ep=", ""),
                    t: Date.now()
                };
            })),
            filterLocalData: params => params.reduce(((res, cur) => {
                const innerItem = res.find((item => item.enName === cur.enName && item.season === cur.season));
                return innerItem ? (+cur.ep > +innerItem.ep && res.splice(res.findIndex((item => item.enName === cur.enName && item.season === cur.season)), 1, cur), 
                res) : res.concat(cur);
            }), []),
            compareLocalData(myList, updateList) {
                const unTopIndex = myList.findIndex((ele => !ele.isTop)), difference = [];
                return updateList.forEach((updateItem => {
                    const index = myList.findIndex((item => item.enName === updateItem.enName && item.season === updateItem.season));
                    if (-1 !== index) {
                        const tempItem = {
                            ...myList[index],
                            ...updateItem
                        };
                        myList[index].isTop ? myList.splice(index, 1, tempItem) : (myList.splice(index, 1), 
                        myList.splice(unTopIndex, 0, tempItem));
                    } else difference.push(updateItem);
                })), myList.splice(unTopIndex, 0, difference), [].concat.apply([], myList);
            },
            async getDramaName(url) {
                try {
                    const result = await Common.request({
                        url: `${window.location.origin}${url}`,
                        type: "get"
                    }), $result = $(result), name = $result.find(".post-title").text(), types = [];
                    return $result.find(".meta_categories .cat-links a").text((function(index, oldcontent) {
                        types.push(oldcontent);
                    })), {
                        name: name,
                        category: types.join(",")
                    };
                } catch (error) {
                    return {};
                }
            }
        };
        const Historyvue_type_script_setup_true_lang_js_hoisted_1 = {
            class: "col_list-ul"
        }, Historyvue_type_script_setup_true_lang_js_hoisted_2 = {
            class: "col_item-left"
        }, Historyvue_type_script_setup_true_lang_js_hoisted_3 = {
            class: "col_item-tags"
        }, _hoisted_4 = [ "innerHTML", "onClick" ], _hoisted_5 = [ "innerHTML", "onClick" ], _hoisted_6 = [ "innerHTML" ], _hoisted_7 = {
            key: 3,
            class: "col_item-index"
        }, _hoisted_8 = [ "href" ], _hoisted_9 = {
            class: "col_item-right"
        }, _hoisted_10 = [ "innerHTML", "onClick" ];
        var Historyvue_type_script_setup_true_lang_js = {
            name: "History",
            props: {
                title: {
                    type: String,
                    required: !0
                }
            },
            setup(__props) {
                let hisList = (0, external_Vue_namespaceObject.ref)([]);
                (0, external_Vue_namespaceObject.onBeforeMount)((() => {
                    getHis();
                })), (0, external_Vue_namespaceObject.watch)(hisList, ((newVal, oldVal) => {
                    LocalHistory.setLocalHistory((0, external_Vue_namespaceObject.toRaw)(newVal));
                }), {
                    deep: !0
                }), document.addEventListener("visibilitychange", (async function() {
                    "visible" == document.visibilityState && getHis();
                }));
                const getHis = async () => {
                    hisList.value = await LocalHistory.getLocalHistory();
                }, filterHisList = (0, external_Vue_namespaceObject.computed)((() => hisList.value.filter((item => !item.deleteInfo || (item.ep !== item.deleteInfo.ep || item.ep === item.deleteInfo.ep && item.val !== item.deleteInfo.val))))), topLength = (0, 
                external_Vue_namespaceObject.computed)((() => filterHisList.value.filter((ele => ele.isTop)).length)), formatSeason = item => item.season ? `S${item.season}` : "", formatEP = item => item.category?.includes("电影") ? "" : item.ep ? `E${item.ep}` : "", formatTimeStr = item => 215999 == +item.val ? "已看完" : 0 == +item.val ? "未观看" : formatTime(item.val), cancelTop = item => {
                    if (!item.isTop) return;
                    const hisItem = hisList.value.find((ele => ele.key === item.key));
                    let newItem = hisList.value.splice(hisList.value.findIndex((ele => ele.key === hisItem.key)), 1)[0];
                    newItem = {
                        ...newItem,
                        ...item,
                        isTop: !1
                    };
                    const unTopIndex = hisList.value.findIndex((ele => !ele.isTop));
                    hisList.value.splice(unTopIndex, 0, newItem);
                }, formatTime = time => {
                    const hour = parseInt(time / 3600) > 0 ? parseInt(time / 3600) : 0, min = parseInt((time - 3600 * hour) / 60) > 0 ? parseInt((time - 3600 * hour) / 60) : 0, sec = parseInt(time - 3600 * hour - 60 * min);
                    return `${hour > 9 ? hour : "0" + hour}:${min > 9 ? min : "0" + min}:${sec > 9 ? sec : "0" + sec}`;
                };
                return (_ctx, _cache) => ((0, external_Vue_namespaceObject.openBlock)(), (0, external_Vue_namespaceObject.createElementBlock)(external_Vue_namespaceObject.Fragment, null, [ (0, 
                external_Vue_namespaceObject.createElementVNode)("h6", null, (0, external_Vue_namespaceObject.toDisplayString)(__props.title), 1), (0, 
                external_Vue_namespaceObject.createElementVNode)("ul", Historyvue_type_script_setup_true_lang_js_hoisted_1, [ ((0, 
                external_Vue_namespaceObject.openBlock)(!0), (0, external_Vue_namespaceObject.createElementBlock)(external_Vue_namespaceObject.Fragment, null, (0, 
                external_Vue_namespaceObject.renderList)((0, external_Vue_namespaceObject.unref)(filterHisList), ((item, index) => ((0, 
                external_Vue_namespaceObject.openBlock)(), (0, external_Vue_namespaceObject.createElementBlock)("li", {
                    class: "col_item",
                    key: item.url
                }, [ (0, external_Vue_namespaceObject.createElementVNode)("span", Historyvue_type_script_setup_true_lang_js_hoisted_2, [ (0, 
                external_Vue_namespaceObject.createElementVNode)("span", Historyvue_type_script_setup_true_lang_js_hoisted_3, [ item.isTop ? ((0, 
                external_Vue_namespaceObject.openBlock)(), (0, external_Vue_namespaceObject.createElementBlock)("i", {
                    key: 0,
                    class: "icon_top",
                    innerHTML: (0, external_Vue_namespaceObject.unref)('<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="16" height="16"> <title>取消置顶</title> <path d="M189.3 115h653.4c12.1 0 22-9.9 22-22v-6c0-12.1-9.9-22-22-22H189.3c-12.1 0-22 9.9-22 22v6c0 12.1 9.9 22 22 22zM152.2 524.5c-16.1 15.5-16.5 41.4-1 57.5s41.4 16.5 57.5 1l150.5-145-57.4-57.6-149.6 144.1zM474.5 918.4c0 22.4 18.3 40.6 40.6 40.6 22.4 0 40.6-18.3 40.6-40.6V635.3l-81.3-81.6v364.7zM872.3 524.5L547.1 211.3c-7.5-9.5-19-15.6-32-15.6h-0.5c-0.8 0-1.6 0-2.4 0.1-10.9-0.6-22 3.2-30.4 11.3l-98.4 94.7 57.4 57.6 33.6-32.3v66l81.3 81.6V332.5l260.1 250.4c16.1 15.5 41.9 15.1 57.5-1 15.6-16 15.1-41.9-1-57.4zM257.1 207c-6.6-6.7-15.4-10-24.1-10-8.7 0-17.4 3.3-24 9.9-13.3 13.3-13.3 34.8-0.1 48.1l538 540c6.6 6.7 15.4 10 24.1 10 8.7 0 17.4-3.3 24-9.9 13.3-13.3 13.3-34.8 0.1-48.1l-538-540z" p-id="18070" fill="#ffffff"></path> </svg>'),
                    onClick: $event => cancelTop(item)
                }, null, 8, _hoisted_4)) : ((0, external_Vue_namespaceObject.openBlock)(), (0, external_Vue_namespaceObject.createElementBlock)("i", {
                    key: 1,
                    class: "icon_top",
                    innerHTML: (0, external_Vue_namespaceObject.unref)('<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="16" height="16"> <title>置顶</title> <path d="M555.818667 940.629333c-6.229333 56.746667-85.418667 51.669333-88.533334 0V324.693333l-272.64 263.210667c-42.752 36.778667-93.610667-22.058667-61.824-60.757333 120.704-117.034667 337.322667-326.485333 342.4-331.349334 19.968-21.674667 51.413333-22.784 72.661334 0 39.808 38.442667 334.890667 322.986667 343.808 333.226667 29.952 37.205333-18.432 92.245333-59.733334 61.226667-10.666667-9.002667-276.053333-265.514667-276.053333-265.514667l-0.085333 615.893333zM168.448 42.666667h687.104c14.336 0 21.504 8.704 21.504 26.069333 0 17.408-7.168 26.069333-21.504 26.069333H168.448c-14.336 0-21.504-8.661333-21.504-26.026666 0-17.408 7.168-26.112 21.504-26.112z" p-id="891" fill="#ffffff"></path> </svg>'),
                    onClick: $event => (item => {
                        const hisItem = hisList.value.find((ele => ele.key === item.key));
                        hisItem.isTop = !0, hisList.value.unshift(hisList.value.splice(hisList.value.findIndex((ele => ele.key === hisItem.key)), 1)[0]);
                    })(item)
                }, null, 8, _hoisted_5)), item.isTop ? ((0, external_Vue_namespaceObject.openBlock)(), 
                (0, external_Vue_namespaceObject.createElementBlock)("i", {
                    key: 2,
                    class: "icon_top_tag",
                    innerHTML: (0, external_Vue_namespaceObject.unref)('<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="16" height="16"> <path d="M320.32 704.18c14.058 14.06 14.058 36.854 0 50.913L125.864 949.547c-14.06 14.059-36.853 14.059-50.912 0-14.059-14.059-14.059-36.853 0-50.912l194.454-194.454c14.06-14.059 36.853-14.059 50.912 0z m629.906-396.904c14.818 14.818 13.897 39.112-2 52.766L717.082 558.556l0.667 2.734c27.425 114.91-4.257 237.542-87.885 325.02l-2.745 2.84-2.725 2.759c-14.036 14.195-36.941 14.26-51.057 0.144L126.447 445.162c-14.06-14.059-14.06-36.853 0-50.912 90.247-90.248 220.23-123.274 340.164-91.125l2.991 0.82 195.22-227.306c13.517-15.74 37.463-16.8 52.322-2.445z m-78.374 23.45L694.138 153.011 508.752 368.87a36 36 0 0 1-38.937 10.616l-3.106-1.086c-88.26-30.386-185.781-14.902-260.063 41.255l-2.2 1.682 392.717 392.718 0.874-1.132c54.977-71.991 71.575-166.167 44.804-252.737l-1.07-3.393a36 36 0 0 1 10.96-37.877l219.12-188.19z" p-id="15602" fill="#FA8D14"></path> </svg>')
                }, null, 8, _hoisted_6)) : ((0, external_Vue_namespaceObject.openBlock)(), (0, external_Vue_namespaceObject.createElementBlock)("span", _hoisted_7, (0, 
                external_Vue_namespaceObject.toDisplayString)(index + 1 - (0, external_Vue_namespaceObject.unref)(topLength)), 1)) ]), (0, 
                external_Vue_namespaceObject.createElementVNode)("a", {
                    href: item.url
                }, (0, external_Vue_namespaceObject.toDisplayString)(item.name) + " " + (0, external_Vue_namespaceObject.toDisplayString)(formatSeason(item)) + (0, 
                external_Vue_namespaceObject.toDisplayString)(formatEP(item)), 9, _hoisted_8) ]), (0, 
                external_Vue_namespaceObject.createElementVNode)("div", _hoisted_9, [ (0, external_Vue_namespaceObject.createElementVNode)("i", {
                    class: "icon_del",
                    innerHTML: (0, external_Vue_namespaceObject.unref)(iconDelete),
                    onClick: (0, external_Vue_namespaceObject.withModifiers)(($event => (item => {
                        item.deleteInfo = {
                            ep: item.ep,
                            val: item.val,
                            t: Date.now()
                        }, cancelTop(item);
                    })(item)), [ "stop" ])
                }, null, 8, _hoisted_10), (0, external_Vue_namespaceObject.createElementVNode)("span", {
                    class: (0, external_Vue_namespaceObject.normalizeClass)([ "his_time", {
                        his_time_end: +item.val === (0, external_Vue_namespaceObject.unref)(215999)
                    } ])
                }, (0, external_Vue_namespaceObject.toDisplayString)(formatTimeStr(item)), 3) ]) ])))), 128)) ]) ], 64));
            }
        }, Historyvue_type_style_index_0_id_0a142c44_scoped_true_lang_css = __webpack_require__(646), Historyvue_type_style_index_0_id_0a142c44_scoped_true_lang_css_options = {};
        Historyvue_type_style_index_0_id_0a142c44_scoped_true_lang_css_options.styleTagTransform = styleTagTransform_default(), 
        Historyvue_type_style_index_0_id_0a142c44_scoped_true_lang_css_options.setAttributes = setAttributesWithoutAttributes_default(), 
        Historyvue_type_style_index_0_id_0a142c44_scoped_true_lang_css_options.insert = insertBySelector_default().bind(null, "head"), 
        Historyvue_type_style_index_0_id_0a142c44_scoped_true_lang_css_options.domAPI = styleDomAPI_default(), 
        Historyvue_type_style_index_0_id_0a142c44_scoped_true_lang_css_options.insertStyleElement = insertStyleElement_default();
        injectStylesIntoStyleTag_default()(Historyvue_type_style_index_0_id_0a142c44_scoped_true_lang_css.Z, Historyvue_type_style_index_0_id_0a142c44_scoped_true_lang_css_options), 
        Historyvue_type_style_index_0_id_0a142c44_scoped_true_lang_css.Z && Historyvue_type_style_index_0_id_0a142c44_scoped_true_lang_css.Z.locals && Historyvue_type_style_index_0_id_0a142c44_scoped_true_lang_css.Z.locals;
        var History = (0, exportHelper.Z)(Historyvue_type_script_setup_true_lang_js, [ [ "__scopeId", "data-v-0a142c44" ] ]);
        const Settingsvue_type_script_setup_true_lang_js_hoisted_1 = {
            class: "col_list-ul"
        }, Settingsvue_type_script_setup_true_lang_js_hoisted_2 = {
            class: "pretty p-switch p-fill"
        }, Settingsvue_type_script_setup_true_lang_js_hoisted_3 = [ "onUpdate:modelValue" ], Settingsvue_type_script_setup_true_lang_js_hoisted_4 = (0, 
        external_Vue_namespaceObject.createElementVNode)("div", {
            class: "state p-primary"
        }, [ (0, external_Vue_namespaceObject.createElementVNode)("label") ], -1);
        var vue_Settings = {
            name: "Settings",
            props: {
                title: {
                    type: String,
                    required: !0
                }
            },
            setup(__props) {
                const settingsList = (0, external_Vue_namespaceObject.ref)(Settings.getList());
                document.addEventListener("visibilitychange", (async function() {
                    "visible" == document.visibilityState && (settingsList.value = Settings.getList());
                }));
                const handleChange = () => {
                    Settings.setList(settingsList.value);
                };
                return (_ctx, _cache) => ((0, external_Vue_namespaceObject.openBlock)(), (0, external_Vue_namespaceObject.createElementBlock)(external_Vue_namespaceObject.Fragment, null, [ (0, 
                external_Vue_namespaceObject.createElementVNode)("h6", null, (0, external_Vue_namespaceObject.toDisplayString)(__props.title), 1), (0, 
                external_Vue_namespaceObject.createElementVNode)("ul", Settingsvue_type_script_setup_true_lang_js_hoisted_1, [ ((0, 
                external_Vue_namespaceObject.openBlock)(!0), (0, external_Vue_namespaceObject.createElementBlock)(external_Vue_namespaceObject.Fragment, null, (0, 
                external_Vue_namespaceObject.renderList)(settingsList.value, ((item, index) => ((0, 
                external_Vue_namespaceObject.openBlock)(), (0, external_Vue_namespaceObject.createElementBlock)("li", {
                    class: "col_item",
                    key: index
                }, [ (0, external_Vue_namespaceObject.createElementVNode)("span", null, (0, external_Vue_namespaceObject.toDisplayString)(item.name), 1), (0, 
                external_Vue_namespaceObject.createElementVNode)("div", Settingsvue_type_script_setup_true_lang_js_hoisted_2, [ (0, 
                external_Vue_namespaceObject.withDirectives)((0, external_Vue_namespaceObject.createElementVNode)("input", {
                    type: "checkbox",
                    "onUpdate:modelValue": $event => item.val = $event,
                    onChange: handleChange
                }, null, 40, Settingsvue_type_script_setup_true_lang_js_hoisted_3), [ [ external_Vue_namespaceObject.vModelCheckbox, item.val ] ]), Settingsvue_type_script_setup_true_lang_js_hoisted_4 ]) ])))), 128)) ]) ], 64));
            }
        };
        const AutoPlayNext = {
            player: null,
            playerModel: {},
            init() {
                this.initPlayer(), this.bindEvent();
            },
            initPlayer() {
                this.player = WD.videojs?.getAllPlayers()[0], console.time("视频源数据加载完成"), this.player?.one("loadedmetadata", (e => {
                    console.log("获取资源长度完成");
                    const playerCatch = this.player.getCache();
                    playerCatch.duration >= 10 && playerCatch.duration <= 20 && this.player.currentTime(playerCatch.duration);
                })), this.player?.one("canplaythrough", (async e => {
                    console.timeEnd("视频源数据加载完成"), await Common.sleep(50), this.restoreVideoModel();
                })), this.player?.on("ended", (async () => {
                    if (console.log("ended"), console.log("autonext:", Settings.getValueById(1)), console.log("lastEp:", this.isLastEP()), 
                    Settings.getValueById(1)) {
                        if (await Common.sleep(10), this.isLastEP()) return this.setResume(215999);
                        this.handleToNext();
                    }
                }));
            },
            bindEvent() {
                $(WD.document).on("click", ".wp-playlist-tracks .wp-playlist-item", (async e => {
                    e.originalEvent && (this.getCurrentVideoModel(), await Common.sleep(50), this.initPlayer());
                })), $(WD.document).on("click", ".vjs-control.icon-angle-right", (async e => {
                    this.getCurrentVideoModel(), await Common.sleep(50), $(document.documentElement).css("overflow", "visible"), 
                    this.initPlayer(), this.handleToPlay();
                })), $(document).on("keyup", (event => {
                    var keyCode = event.keyCode || event.which || event.charCode, ctrlKey = event.ctrlKey || event.metaKey;
                    ctrlKey && 39 === keyCode && (event.preventDefault(), this.handleToNext()), ctrlKey && 37 === keyCode && (event.preventDefault(), 
                    this.handleToPrev());
                }));
            },
            getCurrentVideoModel() {
                this.playerModel = {
                    isFullscreen: this.player.isFullscreen(),
                    isInPictureInPicture: !!document.pictureInPictureElement,
                    isFullWindow: "hidden" === $(document.documentElement).css("overflow")
                };
            },
            async handleToNext() {
                this.getCurrentVideoModel(), (this.player.controlBar.getChild("NextButton") || {}).handleClick(), 
                await Common.sleep(50), $(document.documentElement).css("overflow", "visible"), 
                this.initPlayer(), this.handleToPlay();
            },
            async handleToPrev() {
                this.getCurrentVideoModel(), $(".wp-playlist-item.wp-playlist-playing").prev().trigger("click"), 
                await Common.sleep(50), $(document.documentElement).css("overflow", "visible"), 
                this.initPlayer(), this.handleToPlay();
            },
            handleToPlay() {
                this.player.resumeModal?.opened() ? this.player.resumeModal.getChild("ModalButtons").getChild("ResumeButton").el().click() : (this.player.bigPlayButton?.el().click(), 
                this.setResume(0));
            },
            async restoreVideoModel() {
                this.playerModel.isFullscreen ? $(".vjs-fullscreen-control").trigger("click") : this.playerModel.isInPictureInPicture ? $(".vjs-picture-in-picture-control").trigger("click") : this.playerModel.isFullWindow && $(".vjs-theater-mode-control-open").trigger("click");
            },
            isLastEP: () => $(".wp-playlist-item:last-child").hasClass("wp-playlist-playing"),
            setResume(value = 0) {
                localStorage.setItem(window.location.href.replace(window.location.origin, "videojs-resume:"), value);
            }
        }, Paginationvue_type_script_setup_true_lang_js_hoisted_1 = {
            class: "ddrk-tools__pagination"
        }, Paginationvue_type_script_setup_true_lang_js_hoisted_2 = [ "title" ], Paginationvue_type_script_setup_true_lang_js_hoisted_3 = [ "innerHTML" ], Paginationvue_type_script_setup_true_lang_js_hoisted_4 = [ "title" ], Paginationvue_type_script_setup_true_lang_js_hoisted_5 = [ "innerHTML" ];
        var Paginationvue_type_script_setup_true_lang_js = {
            name: "Pagination",
            setup(__props) {
                const PAGE_MAIN = {
                    prev: "上一页",
                    next: "下一页",
                    prevClick: () => {
                        $(".page-numbers.prev")[0]?.click();
                    },
                    nextClick: () => {
                        $(".page-numbers.next")[0]?.click();
                    }
                }, PAGE_PLAYER = {
                    prev: "上一集",
                    next: "下一集",
                    prevClick: () => {
                        AutoPlayNext.handleToPrev();
                    },
                    nextClick: () => {
                        AutoPlayNext.handleToNext();
                    }
                }, isShowLeft = (0, external_Vue_namespaceObject.ref)(!0), isShowRight = (0, external_Vue_namespaceObject.ref)(!0), current = (0, 
                external_Vue_namespaceObject.ref)({});
                (0, external_Vue_namespaceObject.onMounted)((() => {
                    !!$("#vjsp").length ? current.value = PAGE_PLAYER : (current.value = PAGE_MAIN, 
                    isShowLeft.value = !!$(".page-numbers.prev").length, isShowRight.value = !!$(".page-numbers.next").length), 
                    $(document).mousemove((() => fadeToggle())), Settings.getValueById(6) && fadeToggle();
                }));
                const isShow = (0, external_Vue_namespaceObject.ref)(!1);
                let timeId = -1;
                const fadeToggle = () => {
                    Settings.getValueById(6) && (isShow.value = !0, clearTimeout(timeId), timeId = setTimeout((() => {
                        isShow.value = !1;
                    }), 3e3));
                };
                return (_ctx, _cache) => ((0, external_Vue_namespaceObject.openBlock)(), (0, external_Vue_namespaceObject.createElementBlock)("div", Paginationvue_type_script_setup_true_lang_js_hoisted_1, [ (0, 
                external_Vue_namespaceObject.createVNode)(external_Vue_namespaceObject.Transition, {
                    name: "Fade"
                }, {
                    default: (0, external_Vue_namespaceObject.withCtx)((() => [ isShow.value && isShowLeft.value ? ((0, 
                    external_Vue_namespaceObject.openBlock)(), (0, external_Vue_namespaceObject.createElementBlock)("div", {
                        key: 0,
                        title: current.value.prev,
                        class: "pagination-btn pagination-left",
                        onClick: _cache[0] || (_cache[0] = (...args) => current.value.prevClick && current.value.prevClick(...args))
                    }, [ (0, external_Vue_namespaceObject.createElementVNode)("i", {
                        innerHTML: (0, external_Vue_namespaceObject.unref)('<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32"> <path d="M709.610667 85.333333c-14.933333 0-29.866667 5.802667-41.28 16.554667L273.109333 473.344a52.757333 52.757333 0 0 0 0 77.76l395.221334 371.456c22.826667 21.482667 59.776 21.482667 82.56 0a52.757333 52.757333 0 0 0 0-77.76L396.949333 512.213333 750.890667 179.626667a52.757333 52.757333 0 0 0 0-77.738667A60.522667 60.522667 0 0 0 709.610667 85.333333z" fill="#ffffff" p-id="3262"></path> </svg>')
                    }, null, 8, Paginationvue_type_script_setup_true_lang_js_hoisted_3) ], 8, Paginationvue_type_script_setup_true_lang_js_hoisted_2)) : (0, 
                    external_Vue_namespaceObject.createCommentVNode)("v-if", !0) ])),
                    _: 1
                }), (0, external_Vue_namespaceObject.createVNode)(external_Vue_namespaceObject.Transition, {
                    name: "Fade"
                }, {
                    default: (0, external_Vue_namespaceObject.withCtx)((() => [ isShow.value && isShowRight.value ? ((0, 
                    external_Vue_namespaceObject.openBlock)(), (0, external_Vue_namespaceObject.createElementBlock)("div", {
                        key: 0,
                        title: current.value.next,
                        class: "pagination-btn pagination-right",
                        onClick: _cache[1] || (_cache[1] = (...args) => current.value.nextClick && current.value.nextClick(...args))
                    }, [ (0, external_Vue_namespaceObject.createElementVNode)("i", {
                        innerHTML: (0, external_Vue_namespaceObject.unref)('<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32"> <path d="M314.389333 938.666667c14.933333 0 29.866667-5.802667 41.28-16.554667l395.221334-371.456a52.757333 52.757333 0 0 0 0-77.76L355.669333 101.44c-22.826667-21.482667-59.776-21.482667-82.56 0a52.757333 52.757333 0 0 0 0 77.76l353.941334 332.586667-353.941334 332.586666a52.757333 52.757333 0 0 0 0 77.738667 60.522667 60.522667 0 0 0 41.28 16.554667z" fill="#ffffff" p-id="2947"></path> </svg>')
                    }, null, 8, Paginationvue_type_script_setup_true_lang_js_hoisted_5) ], 8, Paginationvue_type_script_setup_true_lang_js_hoisted_4)) : (0, 
                    external_Vue_namespaceObject.createCommentVNode)("v-if", !0) ])),
                    _: 1
                }) ]));
            }
        }, Paginationvue_type_style_index_0_id_40ae7db4_scoped_true_lang_css = __webpack_require__(419), Paginationvue_type_style_index_0_id_40ae7db4_scoped_true_lang_css_options = {};
        Paginationvue_type_style_index_0_id_40ae7db4_scoped_true_lang_css_options.styleTagTransform = styleTagTransform_default(), 
        Paginationvue_type_style_index_0_id_40ae7db4_scoped_true_lang_css_options.setAttributes = setAttributesWithoutAttributes_default(), 
        Paginationvue_type_style_index_0_id_40ae7db4_scoped_true_lang_css_options.insert = insertBySelector_default().bind(null, "head"), 
        Paginationvue_type_style_index_0_id_40ae7db4_scoped_true_lang_css_options.domAPI = styleDomAPI_default(), 
        Paginationvue_type_style_index_0_id_40ae7db4_scoped_true_lang_css_options.insertStyleElement = insertStyleElement_default();
        injectStylesIntoStyleTag_default()(Paginationvue_type_style_index_0_id_40ae7db4_scoped_true_lang_css.Z, Paginationvue_type_style_index_0_id_40ae7db4_scoped_true_lang_css_options), 
        Paginationvue_type_style_index_0_id_40ae7db4_scoped_true_lang_css.Z && Paginationvue_type_style_index_0_id_40ae7db4_scoped_true_lang_css.Z.locals && Paginationvue_type_style_index_0_id_40ae7db4_scoped_true_lang_css.Z.locals;
        var Pagination = (0, exportHelper.Z)(Paginationvue_type_script_setup_true_lang_js, [ [ "__scopeId", "data-v-40ae7db4" ] ]);
        const appvue_type_script_setup_true_lang_js_hoisted_1 = {
            class: "ddrk-tools-container"
        };
        var appvue_type_script_setup_true_lang_js = {
            name: "app",
            setup: __props => (_ctx, _cache) => ((0, external_Vue_namespaceObject.openBlock)(), 
            (0, external_Vue_namespaceObject.createElementBlock)("div", appvue_type_script_setup_true_lang_js_hoisted_1, [ (0, 
            external_Vue_namespaceObject.createVNode)(Container, null, {
                default: (0, external_Vue_namespaceObject.withCtx)((({type: type}) => [ 1 === type ? ((0, 
                external_Vue_namespaceObject.openBlock)(), (0, external_Vue_namespaceObject.createBlock)(Collection, {
                    key: 0,
                    title: "收藏夹"
                })) : 2 === type ? ((0, external_Vue_namespaceObject.openBlock)(), (0, external_Vue_namespaceObject.createBlock)(History, {
                    key: 1,
                    title: "观看记录"
                })) : 3 === type ? ((0, external_Vue_namespaceObject.openBlock)(), (0, external_Vue_namespaceObject.createBlock)(vue_Settings, {
                    key: 2,
                    title: "设置"
                })) : (0, external_Vue_namespaceObject.createCommentVNode)("v-if", !0) ])),
                _: 1
            }), (0, external_Vue_namespaceObject.createVNode)(Pagination) ]))
        }, appvue_type_style_index_0_id_08e03ab6_scoped_true_lang_css = __webpack_require__(207), appvue_type_style_index_0_id_08e03ab6_scoped_true_lang_css_options = {};
        appvue_type_style_index_0_id_08e03ab6_scoped_true_lang_css_options.styleTagTransform = styleTagTransform_default(), 
        appvue_type_style_index_0_id_08e03ab6_scoped_true_lang_css_options.setAttributes = setAttributesWithoutAttributes_default(), 
        appvue_type_style_index_0_id_08e03ab6_scoped_true_lang_css_options.insert = insertBySelector_default().bind(null, "head"), 
        appvue_type_style_index_0_id_08e03ab6_scoped_true_lang_css_options.domAPI = styleDomAPI_default(), 
        appvue_type_style_index_0_id_08e03ab6_scoped_true_lang_css_options.insertStyleElement = insertStyleElement_default();
        injectStylesIntoStyleTag_default()(appvue_type_style_index_0_id_08e03ab6_scoped_true_lang_css.Z, appvue_type_style_index_0_id_08e03ab6_scoped_true_lang_css_options), 
        appvue_type_style_index_0_id_08e03ab6_scoped_true_lang_css.Z && appvue_type_style_index_0_id_08e03ab6_scoped_true_lang_css.Z.locals && appvue_type_style_index_0_id_08e03ab6_scoped_true_lang_css.Z.locals;
        var app = (0, exportHelper.Z)(appvue_type_script_setup_true_lang_js, [ [ "__scopeId", "data-v-08e03ab6" ] ]);
        const MessageBox = {
            init() {
                $("body").append('<div id="msg-box"> <div class="msg-box_wrapper"> </div> <div id="msg-arrow" data-popper-arrow></div> </div> <style>#msg-box{background-color:#fff;color:#606266;border-radius:4px;font-size:14px;box-shadow:0 0 20px rgba(0,0,0,.35);z-index:1}#msg-box .msg-box_wrapper .video-link{display:inline-block;font-size:18px;padding:5px 0}#msg-box .msg-box_btns{text-align:right;padding:5px 0}#msg-box .msg-box_btns button{padding:5px 12px;border-radius:4px;color:#409eff;background:#ecf5ff;outline:0;border:none;cursor:pointer}#msg-box .msg-box_btns button+button{margin-left:8px}#msg-box[data-popper-placement^=top]>#msg-arrow{bottom:-4px}#msg-box[data-popper-placement^=bottom]>#msg-arrow{top:-4px}#msg-box[data-popper-placement^=left]>#msg-arrow{right:-4px}#msg-box[data-popper-placement^=right]>#msg-arrow{left:-4px}#msg-arrow,#msg-arrow::before{position:absolute;width:8px;height:8px;background:inherit}#msg-arrow{visibility:hidden}#msg-arrow::before{visibility:visible;content:"";transform:rotate(45deg)}</style>');
            },
            $popover({target: target, html: html, timeout: timeout = 8e3} = config) {
                $("#msg-box .msg-box_wrapper").html(`<div style="padding: 12px">${html}</div>`);
                const popover = new Popper.createPopper(target, $("#msg-box")[0], {
                    placement: "top",
                    modifiers: [ {
                        name: "offset",
                        options: {
                            offset: [ 0, 10 ]
                        }
                    }, {
                        name: "flip",
                        options: {
                            fallbackPlacements: [ "top", "bottom" ]
                        }
                    } ]
                });
                setTimeout((() => {
                    popover.destroy(), $("#msg-box .msg-box_wrapper").html("");
                }), timeout);
            },
            $confirm({target: target, html: html, confirmText: confirmText = "确定", cancelText: cancelText = "取消", showConfirm: showConfirm = !0, showCancel: showCancel = !0, confirmCallBack: confirmCallBack, cancelCallBack: cancelCallBack} = config) {
                const btns = `<div class="msg-box_btns">\n        ${showConfirm ? `<button class="msg-box_btn-confirm">${confirmText}</button>` : ""}\n        ${showCancel ? `<button class="msg-box_btn-cancle">${cancelText}</button>` : ""}\n        \n      </div>`;
                $("#msg-box .msg-box_wrapper").html(`<div style="padding: 12px">${html + btns}</div>`);
                const popover = new Popper.createPopper(target, $("#msg-box")[0], {
                    placement: "top",
                    modifiers: [ {
                        name: "offset",
                        options: {
                            offset: [ 0, 10 ]
                        }
                    }, {
                        name: "flip",
                        options: {
                            fallbackPlacements: [ "top", "bottom" ]
                        }
                    } ]
                });
                $("#msg-box .msg-box_wrapper").on("click", ".msg-box_btn-confirm", (e => {
                    confirmCallBack?.(popover);
                })), $("#msg-box .msg-box_wrapper").on("click", ".msg-box_btn-cancle", (e => {
                    popover.destroy(), cancelCallBack?.(), $("#msg-box .msg-box_wrapper").html("");
                }));
            }
        }, WatchRecord = {
            recordData: {},
            init() {
                if (WD.videojs?.getAllPlayers()[0]) {
                    if (this.initPlayer(), this.recordData = this.getRecord(), !Settings.getValueById(3)) return;
                    const curPageInfo = this.parseUrl(), lastInfo = this.recordData[curPageInfo.enName];
                    if (lastInfo && (curPageInfo.season !== lastInfo?.season || curPageInfo.ep !== lastInfo?.ep)) {
                        const season = lastInfo.season ? `S${lastInfo.season} - ` : "", ep = lastInfo.ep ? `E${lastInfo.ep}` : "";
                        MessageBox.$popover({
                            target: $("#vjsp_html5_api")[0],
                            html: `上次观看到：<a href="${lastInfo.href.replace(/^https:\/\/(ddrk.me|ddys.tv|ddys2.me)/, "")}">${season}${ep}</a>`
                        });
                    }
                }
            },
            initPlayer() {
                const player = WD.videojs?.getAllPlayers()[0];
                player?.one("canplay", (() => this.setRecord()));
            },
            getRecord: () => JSON.parse(Store_getValue("ddrk-tools-play-record") || "{}"),
            setRecord() {
                const escData = this.parseUrl();
                (escData.ep > 1 || escData.season >= 1) && (this.recordData[escData.enName] = escData, 
                Store_setValue("ddrk-tools-play-record", JSON.stringify(this.recordData)));
            },
            parseUrl() {
                const info = window.location.pathname.split("/");
                return {
                    enName: info[1],
                    season: info.length > 3 && !isNaN(info[2]) ? info[2] : $(".post-page-numbers").text() ? "1" : "",
                    ep: new URL(location.href).searchParams.get("ep"),
                    href: window.location.href.replace(window.location.origin, "")
                };
            }
        }, PlayInSmallWindow = {
            player: null,
            isPlaying: !1,
            offsetTop: 0,
            eleHeight: 0,
            init() {
                WD.videojs?.getAllPlayers()[0] && (this.offsetTop = $(".wp-video-playlist").offset().top, 
                this.eleHeight = $("#vjsp_html5_api").height(), this.initPlayer(), this.bindEvent(), 
                $(".wp-video-playlist").prepend($('<div class="ddrk-tools__video-placeholder" ></div>')));
            },
            initPlayer() {
                this.player = WD.videojs?.getAllPlayers()[0], this.player?.on("playing", (() => {
                    this.isPlaying = !0;
                })), this.player?.on("pause", (() => {
                    this.isPlaying = !1;
                })), this.player?.on("ended", (() => {
                    this.isPlaying = !1;
                }));
            },
            bindEvent() {
                $(window).resize((() => {
                    this.offsetTop = $(".wp-video-playlist").offset().top, this.eleHeight = $(".ddrk-tools__video-placeholder").height() || $("#vjsp_html5_api").height();
                })), $(window).scroll((() => {
                    if (!this.isPlaying && !$("#vjsp").hasClass("ddrk-tools__video-window-small")) return;
                    if (this.offsetTop + .8 * this.eleHeight >= $(window).scrollTop() && this.offsetTop < $(window).scrollTop() + $(window).height()) $(".ddrk-tools__video-placeholder").css({
                        width: 0,
                        height: 0
                    }), $("#vjsp").removeClass("ddrk-tools__video-window-small"); else if (!$("#vjsp").hasClass("ddrk-tools__video-window-small")) {
                        if (!Settings.getValueById(4)) return;
                        $(".ddrk-tools__video-placeholder").css({
                            width: "100%",
                            height: $("#vjsp").outerHeight()
                        }), $("#vjsp").addClass("ddrk-tools__video-window-small");
                    }
                }));
            }
        };
        var iconDownload = '<svg class="" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="20" height="20"> <path d="M663.466667 701.866667c-17.066667-17.066667-42.666667-17.066667-59.733334 0L554.666667 750.933333V435.2c0-23.466667-19.2-42.666667-42.666667-42.666667s-42.666667 19.2-42.666667 42.666667v313.6l-46.933333-46.933333c-17.066667-17.066667-42.666667-17.066667-59.733333 0s-17.066667 42.666667 0 59.733333l121.6 121.6c6.4 8.533333 17.066667 12.8 27.733333 12.8s21.333333-4.266667 29.866667-12.8l121.6-121.6c17.066667-14.933333 17.066667-42.666667 0-59.733333z" fill="#008080" p-id="14937"></path> <path d="M812.8 388.266667C793.6 241.066667 663.466667 128 512 128S230.4 241.066667 211.2 388.266667c-102.4 19.2-179.2 113.066667-172.8 221.866666 6.4 113.066667 106.666667 200.533333 219.733333 200.533334h64c8.533333 0 10.666667-8.533333 6.4-14.933334-32-32-36.266667-85.333333-6.4-119.466666 23.466667-25.6 57.6-34.133333 89.6-25.6 4.266667 2.133333 10.666667-2.133333 10.666667-8.533334v-206.933333c0-49.066667 36.266667-85.333333 89.6-85.333333s89.6 34.133333 89.6 85.333333v206.933333c0 6.4 4.266667 10.666667 10.666667 8.533334 32-8.533333 66.133333 0 89.6 25.6 29.866667 34.133333 25.6 87.466667-6.4 119.466666-6.4 6.4-2.133333 14.933333 6.4 14.933334h64c115.2 0 213.333333-87.466667 219.733333-200.533334 6.4-108.8-70.4-202.666667-172.8-221.866666z" fill="#008080" p-id="14938"></path> </svg>';
        const Download = {
            trackList: [],
            downloadClickable: !0,
            init() {
                WD.videojs?.getAllPlayers()[0] && ($(".wp-playlist-item").length && $(".wp-playlist-item").each((function() {
                    $(this).append($(`<span class="btn_download">${iconDownload}</span>`));
                })), this.bindEvent(), this.trackList = JSON.parse($("script.wp-playlist-script").text() || "{}").tracks || []);
            },
            bindEvent() {
                const self = this;
                $(".wp-playlist-item .btn_download").on("click", (async function(e) {
                    if (e.stopPropagation(), !self.downloadClickable) return;
                    self.downloadClickable = !1, $(this).html('<svg class="dt-icon-loading" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="20" height="20"> <path d="M512 64c247.2 0 448 200.8 448 448h-64c0-212-172-384-384-384V64z m0 832c-212 0-384-172-384-384H64c0 247.2 200.8 448 448 448v-64z" p-id="7200" fill="#008080"></path> </svg> <style>.dt-icon-loading{animation:goCircel 1s linear infinite}@keyframes goCircel{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}</style>');
                    const pageCaption = $(this).parent().find(".wp-playlist-caption").text(), targetItem = self.trackList.find((item => pageCaption.includes(item.caption)));
                    let videoResult = {}, hasVtt = !0;
                    const vttUrl = `${window.location.origin}/subddr${targetItem.subsrc}`;
                    try {
                        videoResult = 4 == +targetItem.srctype ? {
                            url: `https://v.${window.location.hostname}${targetItem.src3}`
                        } : await Common.request({
                            url: `${window.location.origin}/getvddr3/video?id=${targetItem.src1}&type=json`,
                            type: "get"
                        }), hasVtt = !!await Common.request({
                            url: vttUrl,
                            type: "get"
                        });
                    } catch (error) {
                        console.log(error), hasVtt = !1;
                    } finally {
                        self.downloadClickable = !0, $(this).html(iconDownload);
                    }
                    const fileName = self.getFileName($(this));
                    if (Settings.getValueById(5)) {
                        if (!videoResult.url) return void MessageBox.$popover({
                            target: $(this)[0],
                            html: "无法获取视频链接 请重试",
                            timeout: 1e3
                        });
                        const a = document.createElement("a");
                        return a.href = videoResult.url, a.target = "_blank", a.click(), a.remove(), self.copyToBord(fileName), 
                        void (hasVtt && self.downloadVtt(vttUrl, `${fileName}.vtt`));
                    }
                    MessageBox.$confirm({
                        html: videoResult.url ? `<a id="download-video" class="video-link" href="${videoResult.url}" target="_blank">&gt视频地址&lt</a>\n              <br/>\n              ${hasVtt ? '<a id="download-vtt" class="video-link" href="javascript:void(0)">&gt点击此处下载字幕&lt</a>' : ""}\n              <br/>\n              下载方法：<br/>\n              1、建议使用IDM、FDM等软件安装其浏览器插件后，点击链接下载<br/>\n              2、右键链接另存为<br/>\n              3、右键复制链接 去其它工具下载<br/>\n              ->点击视频地址会自动复制文件名<-<br/>\n              ` : "无法获取视频链接 请重试",
                        target: $(this)[0],
                        showConfirm: !!videoResult.url,
                        confirmText: "复制文件名",
                        cancelText: "关闭",
                        confirmCallBack: popper => {
                            self.copyToBord(fileName), $(".msg-box_btn-confirm").text("复制成功");
                        }
                    }), $("#msg-box #download-video").on("mousedown", (e => (3 == e.which && self.copyToBord(fileName), 
                    1 == e.which && self.copyToBord(fileName), !1))), $("#msg-box #download-vtt").on("click", (e => {
                        self.downloadVtt(vttUrl, `${fileName}.vtt`);
                    }));
                }));
            },
            downloadVtt(url, name) {
                fetch(url).then((res => res.arrayBuffer())).then((arrayBuffer => {
                    let eAB = arrayBuffer, wordArray = CryptoJS.lib.WordArray.create(eAB.slice(16)), hexStr = Array.prototype.map.call(new Uint8Array(eAB.slice(0, 16)), (x => ("00" + x.toString(16)).slice(-2))).join(""), wordArray2 = CryptoJS.enc.Hex.parse(hexStr), jsdec = CryptoJS.AES.decrypt({
                        ciphertext: wordArray
                    }, wordArray2, {
                        iv: wordArray2,
                        mode: CryptoJS.mode.CBC
                    }), binary_string = window.atob(jsdec.toString(CryptoJS.enc.Base64)), len = binary_string.length, bytes = new Uint8Array(len);
                    for (let i = 0; i < len; i++) bytes[i] = binary_string.charCodeAt(i);
                    let blobStr = pako.ungzip(bytes.buffer, {
                        to: "string"
                    });
                    blobStr = blobStr.replaceAll("&lrm;", "");
                    const a = document.createElement("a"), objectUrl = window.URL.createObjectURL(new Blob([ blobStr ]));
                    a.download = name, a.href = objectUrl, a.click(), window.URL.revokeObjectURL(objectUrl), 
                    a.remove();
                }));
            },
            getFileName(element) {
                const current = $(element).parent(), name = $(".post-title").text(), resName = name.indexOf("(") > -1 ? name.split("(")[0] : name;
                let season = $(".post-page-numbers.current").text();
                season = season ? "S" + season : "";
                return resName + season + (0 === $(".wp-playlist-item").length ? "" : "E" + (current.index() + 1));
            },
            copyToBord(text) {
                let copy = e => {
                    e.preventDefault(), e.clipboardData.setData("text/plain", text), document.removeEventListener("copy", copy);
                };
                document.addEventListener("copy", copy), document.execCommand("Copy");
            }
        }, CurrentTime = {
            init() {
                this.refreshClass(), (0, external_Vue_namespaceObject.watch)(Settings.curList, ((newVal, oldVal) => {
                    this.refreshClass();
                }), {
                    deep: !0
                });
            },
            refreshClass() {
                Settings.getValueById(7) ? $(".wp-playlist").addClass("ddrk-tools__video") : $(".wp-playlist").removeClass("ddrk-tools__video");
            }
        }, AdFix = {
            init() {
                this.refreshClass(), (0, external_Vue_namespaceObject.watch)(Settings.curList, ((newVal, oldVal) => {
                    this.refreshClass();
                }), {
                    deep: !0
                }), Object.defineProperty(HTMLDivElement.prototype, "clientHeight", {
                    get: () => 130
                });
            },
            refreshClass() {
                Settings.getValueById(9) ? $("body").removeClass("ddrk-tools__ad") : $("body").addClass("ddrk-tools__ad");
            }
        };
        var videojs_seek_buttons = __webpack_require__(647), videojs_seek_buttons_options = {};
        videojs_seek_buttons_options.styleTagTransform = styleTagTransform_default(), videojs_seek_buttons_options.setAttributes = setAttributesWithoutAttributes_default(), 
        videojs_seek_buttons_options.insert = insertBySelector_default().bind(null, "head"), 
        videojs_seek_buttons_options.domAPI = styleDomAPI_default(), videojs_seek_buttons_options.insertStyleElement = insertStyleElement_default();
        injectStylesIntoStyleTag_default()(videojs_seek_buttons.Z, videojs_seek_buttons_options), 
        videojs_seek_buttons.Z && videojs_seek_buttons.Z.locals && videojs_seek_buttons.Z.locals;
        const OPTIONS_DEFAULT = {
            forward: 10,
            back: 10
        }, SeekButton = {
            player: null,
            enabled: !0,
            init() {
                __webpack_require__(256), this.enabled = Settings.getValueById(8), this.initPlayer(), 
                (0, external_Vue_namespaceObject.watch)(Settings.curList, ((newVal, oldVal) => {
                    this.enabled !== Settings.getValueById(8) && (this.enabled = Settings.getValueById(8), 
                    this.refreshButtons());
                }), {
                    deep: !0
                });
            },
            initPlayer() {
                this.player = WD.videojs?.getAllPlayers()[0], this.enabled && this.player?.seekButtons(OPTIONS_DEFAULT);
            },
            refreshButtons() {
                (this.player?.controlBar.children() || []).filter((item => "SeekButton" === item.name())).forEach((element => {
                    this.player?.controlBar.removeChild(element);
                })), this.enabled && this.player?.seekButtons(OPTIONS_DEFAULT);
            }
        };
        (async () => {
            console.log("\n %c ddrk-tools.js v1.4.8 \n", "color: #fadfa3; background: #030307; padding:5px 0;"), 
            $("head").append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/pretty-checkbox/3.0.3/pretty-checkbox.min.css" integrity="sha512-kz4Ae66pquz4nVE5ytJyKfPDkQyHSggaDtT1v8oLfOd8bB+ZgZXNLaxex99MNu4fdCsWmi58mhLtfGk5RgfcOw==" crossorigin="anonymous" referrerpolicy="no-referrer" />'), 
            await Common.ready();
            const html = `<li><a title="NSFW" href="${window.location.origin}/tag/nsfw/">NSFW</a></li>`;
            if ($("#menu-item-12055").after(html), $("body").append($('<div id="ddrk-tools" ></div>')), 
            window.$vueApp = (0, external_Vue_namespaceObject.createApp)(app), window.$vueApp.mount("#ddrk-tools"), 
            MessageBox.init(), Settings.init(), LocalCollection.init(), CurrentTime.init(), 
            AdFix.init(), await Common.sleep(500), AutoPlayNext.init(), WatchRecord.init(), 
            PlayInSmallWindow.init(), Download.init(), SeekButton.init(), null != history.replaceState) {
                let _replaceState = history.replaceState;
                history.replaceState = function() {
                    return setTimeout((() => {
                        console.log("history changed"), WatchRecord.initPlayer(), PlayInSmallWindow.initPlayer(), 
                        SeekButton.initPlayer(), Download.bindEvent();
                    }), 0), _replaceState.apply(history, arguments);
                };
            }
        })();
    }();
}();