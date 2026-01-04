// ==UserScript==
// @name         Ботнадзор (botnadzor.org)
// @namespace    vk-metabot-user-js
// @description  Подсветка ботов в VK
// @version      4.1.3
// @homepageURL  https://vk.com/club187686148
// @icon         https://botnadzor.org/favicon.ico
// @match        https://*.vk.com/*
// @match        *://web.archive.org/*://*vk.com/*
// @exclude      *://queuev4.vk.com/*
// @connect      botnadzor.org
// @connect      api.botnadzor.org
// @connect      botnadzor.github.io
// @connect      *.vercel.app
// @connect      *.netlify.app
// @update       https://raw.githubusercontent.com/botnadzor/user-script/update/vk-metabot.user.js
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/464586/%D0%91%D0%BE%D1%82%D0%BD%D0%B0%D0%B4%D0%B7%D0%BE%D1%80%20%28botnadzororg%29.user.js
// @updateURL https://update.greasyfork.org/scripts/464586/%D0%91%D0%BE%D1%82%D0%BD%D0%B0%D0%B4%D0%B7%D0%BE%D1%80%20%28botnadzororg%29.meta.js
// ==/UserScript==
(() => {
    var __webpack_modules__ = {
        374: (module, __webpack_exports__, __webpack_require__) => {
            "use strict";
            __webpack_require__.d(__webpack_exports__, {
                A: () => __WEBPACK_DEFAULT_EXPORT__
            });
            var _node_modules_pnpm_css_loader_7_1_2_webpack_5_91_0_webpack_cli_5_1_4_webpack_5_91_0_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(910);
            var _node_modules_pnpm_css_loader_7_1_2_webpack_5_91_0_webpack_cli_5_1_4_webpack_5_91_0_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_pnpm_css_loader_7_1_2_webpack_5_91_0_webpack_cli_5_1_4_webpack_5_91_0_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
            var _node_modules_pnpm_css_loader_7_1_2_webpack_5_91_0_webpack_cli_5_1_4_webpack_5_91_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(255);
            var _node_modules_pnpm_css_loader_7_1_2_webpack_5_91_0_webpack_cli_5_1_4_webpack_5_91_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = __webpack_require__.n(_node_modules_pnpm_css_loader_7_1_2_webpack_5_91_0_webpack_cli_5_1_4_webpack_5_91_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
            var _node_modules_pnpm_css_loader_7_1_2_webpack_5_91_0_webpack_cli_5_1_4_webpack_5_91_0_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(158);
            var _node_modules_pnpm_css_loader_7_1_2_webpack_5_91_0_webpack_cli_5_1_4_webpack_5_91_0_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = __webpack_require__.n(_node_modules_pnpm_css_loader_7_1_2_webpack_5_91_0_webpack_cli_5_1_4_webpack_5_91_0_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
            var ___CSS_LOADER_URL_IMPORT_0___ = new URL(__webpack_require__(373), __webpack_require__.b);
            var ___CSS_LOADER_URL_IMPORT_1___ = new URL(__webpack_require__(877), __webpack_require__.b);
            var ___CSS_LOADER_EXPORT___ = _node_modules_pnpm_css_loader_7_1_2_webpack_5_91_0_webpack_cli_5_1_4_webpack_5_91_0_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_pnpm_css_loader_7_1_2_webpack_5_91_0_webpack_cli_5_1_4_webpack_5_91_0_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
            var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_pnpm_css_loader_7_1_2_webpack_5_91_0_webpack_cli_5_1_4_webpack_5_91_0_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
            var ___CSS_LOADER_URL_REPLACEMENT_1___ = _node_modules_pnpm_css_loader_7_1_2_webpack_5_91_0_webpack_cli_5_1_4_webpack_5_91_0_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___);
            ___CSS_LOADER_EXPORT___.push([ module.id, `.botnadzor-reset-color-btn{border:0;border-radius:50%;margin-left:5px;height:20px;margin-top:3px;cursor:pointer;width:20px;transition:all .2s;opacity:.6}.botnadzor-reset-color-btn:hover{opacity:.8}.botnadzor-reset-color-btn:active{opacity:1}.botnadzor-type-checkbox{display:flex;margin-bottom:2px}.botnadzor-type-checkbox__label{margin-bottom:10px;width:180px}.botnadzor-type-color{height:22px;border:0;cursor:pointer}.botnadzor-type-name{width:180px}.botnadzor-settings-modal{top:0;position:fixed;display:flex;flex-direction:column;justify-content:center;overflow:auto;z-index:1000;width:100%;height:100%}.botnadzor-settings-modal-close{position:relative;float:right;padding:15px 20px 15px 15px;width:24px;height:24px;opacity:75%;color:var(--icon_medium);cursor:pointer;outline:0}.botnadzor-settings-modal-title-wrap,.botnadzor-advanced-menu-modal-permissions-denied-title-wrap{position:relative;padding:0;background:var(--vkui--color_background_modal);color:var(--vkui--color_text_primary);border-bottom:1px solid var(--separator_common);border-radius:var(--vkui--size_border_radius_paper--regular, 8px) var(--vkui--size_border_radius_paper--regular, 8px) 0 0}.botnadzor-settings-modal-title,.botnadzor-advanced-menu-modal-permissions-denied-title{padding-left:25px;font-size:14px;color:var(--vkui--color_text_primary);height:54px;line-height:54px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.botnadzor-settings-container{width:100%;max-width:650px;box-shadow:0 2px 10px var(--black_alpha40);margin:20px auto;background:var(--vkui--color_background_modal)}.botnadzor-settings-modal-types{width:300px;flex-shrink:0;overflow-y:scroll;padding-top:5px;padding-bottom:5px}.botnadzor-settings-modal-marks{height:218px;overflow-y:scroll;padding-top:5px;padding-bottom:5px}@keyframes glowing{0%{width:40px;height:40px;box-shadow:0 0 10px #f99,0 0 5px #f99;border:2px solid #f99}50%{width:30px;height:30px;box-shadow:0 0 10px #f99,0 0 5px #f99;border:2px solid #f99}100%{width:40px;height:40px;box-shadow:0 0 10px #f99,0 0 5px #f99;border:2px solid #f99}}.botnadzor-replies-collecting-enabled-automatically{position:relative}.botnadzor-replies-collecting-enabled-automatically::after{content:"";display:block;position:absolute;top:50%;left:50%;border-radius:50%;transform:translate(-50%, -50%);animation:glowing 1s 5;user-select:none}.botnadzor-checkbox{display:flex;align-items:center;cursor:pointer;line-height:1.27em}.botnadzor-checkbox input{display:none}.botnadzor-checkbox input+.botnadzor-checkbox-view{display:block;float:left;background-image:url(${___CSS_LOADER_URL_REPLACEMENT_0___});background-position:center;background-repeat:no-repeat;margin:0 7px 0 0;width:16px;height:16px;margin-top:-1px}.botnadzor-checkbox input:checked+.botnadzor-checkbox-view{background-image:url(${___CSS_LOADER_URL_REPLACEMENT_1___})}.botnadzor-checkbox input:disabled+.botnadzor-checkbox-view{filter:contrast(0)}.botnadzor-checkbox:has(input:disabled){cursor:default}.botnadzor-checkbox:has(input:disabled:not(:checked)){opacity:.5}.botnadzor-token-field-wrapper{margin-bottom:15px}.botnadzor-token-line{position:relative;display:flex;flex-wrap:wrap;align-items:center;margin-bottom:5px;column-gap:10px}.botnadzor-token-form-line{position:relative;display:flex;align-items:center;margin-bottom:5px}.botnadzor-token-input-line{position:relative;display:flex;align-items:center;flex-wrap:wrap}.botnadzor-token-field{box-sizing:border-box;display:block;padding:6px;height:33px;width:300px;font-family:monospace;border:1px solid #000;border-radius:3px}.botnadzor-token-description{font-size:12px;color:var(--text_primary)}.botnadzor-token-btn{position:absolute;top:4px;padding:0;height:25px;width:25px;border:1px solid #000;border-radius:3px;cursor:pointer}.botnadzor-token-show-btn{right:34px}.botnadzor-token-show-btn svg{width:16px;height:16px;vertical-align:middle;color:inherit;display:inline-block;fill:var(--vkui--color_text_primary)}.botnadzor-token-clear-btn{right:4px}.botnadzor-token-error{color:red}.botnadzor-token-check-btn{box-sizing:border-box;height:33px;margin-left:5px;border:1px solid #000;border-radius:3px}.botnadzor-token-info{position:relative;top:-3px;font-size:12px}.botnadzor-settings-content,.botnadzor-advanced-menu-modal-permissions-denied-description{padding:20px 25px;line-height:19px;background:var(--vkui--color_background_modal)}.botnadzor-settings-content{height:450px}.botnadzor-settings-modal-mobile{background:var(--background_content);overflow:auto}.botnadzor-settings-modal-mobile .botnadzor-settings-container{margin-top:0;height:unset}.botnadzor-settings-modal-mobile .botnadzor-settings-content{background:var(--background_content);height:unset}.botnadzor-settings-modal-mobile .botnadzor-settings-modal-hidden-mobile{display:none}.botnadzor-settings-modal-mobile .botnadzor-token-field{width:unset}.botnadzor-settings-modal-mobile .botnadzor-settings-modal-title-wrap{border-radius:0}.botnadzor-settings-modal-checkboxes{display:flex;gap:10px;flex-wrap:wrap}.botnadzor-advanced-menu-modal{position:fixed;top:0;left:0;bottom:0;right:0;z-index:9999;transition:all .2s;display:flex;flex-wrap:nowrap;flex-direction:row;align-items:safe center;justify-content:center}.botnadzor-advanced-menu-modal-clickout-listener{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.4)}.botnadzor-advanced-menu-modal-close{display:flex;justify-content:center;align-items:center;background:var(--vkui--color_background_modal);border-radius:50px;position:absolute;right:10px;padding:10px;top:8px;height:45px;width:45px;cursor:pointer;box-sizing:border-box;transition:opacity .2s}.botnadzor-advanced-menu-modal-close:hover{background:var(--background_hover)}.botnadzor-advanced-menu-modal-content{position:relative;z-index:1;width:500px}.botnadzor-advanced-menu-modal-content-mount{height:370px}#wk_likes_content{padding:20px}.botnadzor-fan-table{width:100%;border-collapse:collapse}.botnadzor-fan-table td{padding:0;border:1px solid rgba(0,0,0,.1882352941)}.botnadzor-fan-table .botnadzor-avatar{margin-right:3px;display:flex;align-items:center}.botnadzor-fan-table .botnadzor-name{display:flex;align-items:center}.botnadzor-fan-table .botnadzor-avatar img{transition:all .2s;pointer-events:none}.botnadzor-fan-table .botnadzor-avatar:hover img{transform:scale(10)}.bot-mark-or-type{position:absolute;left:60px;bottom:5px;font-size:10px;color:#000}.botnadzor-profile-registration-date{opacity:.5;text-align:center}.botnadzor-mobile-profile-bot-info{text-align:center;z-index:12;position:relative}.botnadzor-reg-date{opacity:.5}.botnadzor-mobile-reply-line{display:inline-block}.botnadzor-desktop-fan{text-align:center;position:absolute;top:50%;transform:translateY(calc(-50% - 30px));left:0;width:100%;opacity:.7;color:#000}.botnadzor-settings-mark{display:block;margin-bottom:10px}.botnadzor-post-header{padding-bottom:5px !important;padding-top:10px !important;border-radius:10px 10px 0 0}.botnadzor-post-line-old-design{display:inline-block;margin-top:5px;margin-bottom:5px}.botnadzor-post-line{display:inline-block;margin-top:5px;margin-bottom:5px}.r .botnadzor-post-mobile-header.wi_head{padding:5px !important;padding-top:17px !important}.botnadzor-reply-form-btn{position:absolute;right:90px;background:0;border:0;top:2px;height:25px;width:25px;fill:#994168;padding:3px;cursor:pointer}.botnadzor-profile-line{margin-top:5px;margin-bottom:5px}.botnadzor-reply-actions{display:flex;align-items:center}.botnadzor-reply-mobile-actions{display:inline-flex;align-items:center;transform:translate(0, 6px)}.botnadzor-reply-action{margin-left:8px;overflow:visible;max-height:1em;height:16px;width:16px;visibility:hidden;fill:var(--vkui--color_text_primary)}@media(hover: none){.reply .botnadzor-reply-action{visibility:visible;opacity:.5}}.reply:hover .botnadzor-reply-action{visibility:visible;opacity:.5}.botnadzor-reply-action:hover{opacity:.4}.botnadzor-reply-mobile-action{margin-left:12px;overflow:visible;max-height:1em;height:21px;width:21px;opacity:.4;margin-top:-10px;fill:var(--vkui--color_text_primary)}.botnadzor-reply-mobile-friend_action{margin-left:12px;overflow:visible;max-height:1em;height:21px;width:21px;opacity:.4;fill:var(--vkui--color_text_primary)}.botnadzor-replies-collecting-description{width:21px;height:21px;fill:var(--text_link);transform:translateX(5px)}.botnadzor-reply-content-from-bot{margin-top:-2px;padding-top:2px;margin-right:-2px;padding-right:2px;margin-bottom:-5px;padding-bottom:5px;padding-left:2px}body .botnadzor-bot-bg,.vkui--vkBase--light .botnadzor-bot-bg,.vkui--vkCom--light .botnadzor-bot-bg,[scheme=vkcom_light] .botnadzor-bot-bg{background-color:var(--botLightColor) !important;border-left:3px solid color-mix(in srgb, var(--botLightColor) 80%, rgb(200, 0, 0)) !important}.vkui--vkBase--dark .botnadzor-bot-bg,.vkui--vkCom--dark .botnadzor-bot-bg,[scheme=vkcom_dark] .botnadzor-bot-bg{background-color:var(--botDarkColor) !important;border-left:3px solid var(--botDarkColor) !important}.botnadzor-reply-mark-or-type{padding-left:2px;padding-right:2px;color:var(--gray_400)}.botnadzor-mobile-friend-mark-or-type{padding-left:2px;padding-right:2px;margin-top:4px;color:var(--gray_400)}.botnadzor-user-info-wrapper{height:100%;width:100%}.botnadzor-notification{font-family:VK Sans Display,-apple-system,system-ui,Helvetica Neue,Roboto,sans-serif;position:fixed;left:50px;bottom:20px;z-index:1501;background:rgba(0,0,0,.8);width:300px;padding:16px;color:#fff;border-radius:5px}@media(max-width: 800px){.botnadzor-notification{left:10px;bottom:10px}}.botnadzor-notification-logo{display:flex;align-items:center;font-size:10px;gap:10px;margin-bottom:10px}.botnadzor-notification-close{position:absolute;right:5px;top:5px;opacity:.7;transition:all .2s;font-size:20px;font-weight:bold;display:flex;align-items:center;justify-content:center;height:25px;width:25px;cursor:pointer}.botnadzor-notification-close:hover{opacity:1}.botnadzor-notification-title{margin-bottom:10px;font-weight:bold}.botnadzor-notification-text a{color:#54abff}.botnadzor-mark-chip{padding:3px 6px;background:#000;border-radius:3px;color:#fff;margin-right:10px}.vkui--vkBase--dark .botnadzor-mark-chip,.vkui--vkCom--dark .botnadzor-mark-chip,[scheme=vkcom_dark] .botnadzor-mark-chip{background:#894646}.botnadzor-highlight-overlay{position:absolute;width:100%;height:100%;pointer-events:none;top:0;left:0;opacity:.4}.botnadzor-ib{display:inline-block}.botnadzor-flex{display:flex}.botnadzor-flex-wrap{flex-wrap:wrap}.botnadzor-w-full{width:100%}.botnadzor-tac{text-align:center}.botnadzor-mono{font-family:monospace}.botnadzor-mb-40{margin-bottom:30px}.botnadzor-mb-30{margin-bottom:30px}.botnadzor-mb-20{margin-bottom:20px}.botnadzor-mb-10{margin-bottom:10px}.botnadzor-mt-10{margin-top:10px}.botnadzor-mt-40{margin-top:40px}.botnadzor-mr-20{margin-right:20px}`, "" ]);
            const __WEBPACK_DEFAULT_EXPORT__ = ___CSS_LOADER_EXPORT___;
        },
        255: module => {
            "use strict";
            /*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/            module.exports = function(cssWithMappingToString) {
                var list = [];
                list.toString = function toString() {
                    return this.map((function(item) {
                        var content = "";
                        var needLayer = typeof item[5] !== "undefined";
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
                    })).join("");
                };
                list.i = function i(modules, media, dedupe, supports, layer) {
                    if (typeof modules === "string") {
                        modules = [ [ null, modules, undefined ] ];
                    }
                    var alreadyImportedModules = {};
                    if (dedupe) {
                        for (var k = 0; k < this.length; k++) {
                            var id = this[k][0];
                            if (id != null) {
                                alreadyImportedModules[id] = true;
                            }
                        }
                    }
                    for (var _k = 0; _k < modules.length; _k++) {
                        var item = [].concat(modules[_k]);
                        if (dedupe && alreadyImportedModules[item[0]]) {
                            continue;
                        }
                        if (typeof layer !== "undefined") {
                            if (typeof item[5] === "undefined") {
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
                };
                return list;
            };
        },
        158: module => {
            "use strict";
            module.exports = function(url, options) {
                if (!options) {
                    options = {};
                }
                if (!url) {
                    return url;
                }
                url = String(url.__esModule ? url.default : url);
                if (/^['"].*['"]$/.test(url)) {
                    url = url.slice(1, -1);
                }
                if (options.hash) {
                    url += options.hash;
                }
                if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
                    return '"'.concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), '"');
                }
                return url;
            };
        },
        910: module => {
            "use strict";
            module.exports = function(i) {
                return i[1];
            };
        },
        802: module => {
            module.exports = '<svg xmlns="http://www.w3.org/2000/svg" id="mdi-account-arrow-left-outline" viewBox="0 0 24 24"><path d="M17 18H21V16H17V14L14 17L17 20V18M11 4C8.8 4 7 5.8 7 8S8.8 12 11 12 15 10.2 15 8 13.2 4 11 4M11 6C12.1 6 13 6.9 13 8S12.1 10 11 10 9 9.1 9 8 9.9 6 11 6M11 13C8.3 13 3 14.3 3 17V20H12.5C12.2 19.4 12.1 18.8 12 18.1H4.9V17C4.9 16.4 8 14.9 11 14.9C11.5 14.9 12 15 12.5 15C12.8 14.4 13.1 13.8 13.6 13.3C12.6 13.1 11.7 13 11 13" /></svg>';
        },
        598: module => {
            module.exports = '<svg xmlns="http://www.w3.org/2000/svg" id="mdi-account-box-outline" viewBox="0 0 24 24"><path d="M19,19H5V5H19M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M16.5,16.25C16.5,14.75 13.5,14 12,14C10.5,14 7.5,14.75 7.5,16.25V17H16.5M12,12.25A2.25,2.25 0 0,0 14.25,10A2.25,2.25 0 0,0 12,7.75A2.25,2.25 0 0,0 9.75,10A2.25,2.25 0 0,0 12,12.25Z" /></svg>';
        },
        136: module => {
            module.exports = '<svg xmlns="http://www.w3.org/2000/svg" id="mdi-calendar-month-outline" viewBox="0 0 24 24"><path d="M7 11H9V13H7V11M21 5V19C21 20.11 20.11 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H6V1H8V3H16V1H18V3H19C20.11 3 21 3.9 21 5M5 7H19V5H5V7M19 19V9H5V19H19M15 13V11H17V13H15M11 13V11H13V13H11M7 15H9V17H7V15M15 17V15H17V17H15M11 17V15H13V17H11Z" /></svg>';
        },
        420: module => {
            module.exports = '<svg xmlns="http://www.w3.org/2000/svg" id="mdi-eye-outline" viewBox="0 0 24 24"><path d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z" /></svg>';
        },
        188: module => {
            module.exports = '<svg xmlns="http://www.w3.org/2000/svg" id="mdi-information-slab-box-outline" viewBox="0 0 24 24"><path d="M11 9H13V7H11V9M14 17V15H13V11H10V13H11V15H10V17H14M5 3H19C20.1 3 21 3.89 21 5V19C21 19.53 20.79 20.04 20.41 20.41C20.04 20.79 19.53 21 19 21H5C4.47 21 3.96 20.79 3.59 20.41C3.21 20.04 3 19.53 3 19V5C3 3.89 3.89 3 5 3M19 19V5H5V19H19Z" /></svg>';
        },
        852: module => {
            module.exports = '<svg xmlns="http://www.w3.org/2000/svg" id="mdi-information" viewBox="0 0 24 24"><path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg>';
        },
        707: module => {
            module.exports = '<svg xmlns="http://www.w3.org/2000/svg" id="mdi-list-box-outline" viewBox="0 0 24 24"><path d="M11 15H17V17H11V15M9 7H7V9H9V7M11 13H17V11H11V13M11 9H17V7H11V9M9 11H7V13H9V11M21 5V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5M19 5H5V19H19V5M9 15H7V17H9V15Z" /></svg>';
        },
        245: module => {
            "use strict";
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
                    if (indexByIdentifier !== -1) {
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
                var updater = function updater(newObj) {
                    if (newObj) {
                        if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
                            return;
                        }
                        api.update(obj = newObj);
                    } else {
                        api.remove();
                    }
                };
                return updater;
            }
            module.exports = function(list, options) {
                options = options || {};
                list = list || [];
                var lastIdentifiers = modulesToDom(list, options);
                return function update(newList) {
                    newList = newList || [];
                    for (var i = 0; i < lastIdentifiers.length; i++) {
                        var identifier = lastIdentifiers[i];
                        var index = getIndexByIdentifier(identifier);
                        stylesInDOM[index].references--;
                    }
                    var newLastIdentifiers = modulesToDom(newList, options);
                    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
                        var _identifier = lastIdentifiers[_i];
                        var _index = getIndexByIdentifier(_identifier);
                        if (stylesInDOM[_index].references === 0) {
                            stylesInDOM[_index].updater();
                            stylesInDOM.splice(_index, 1);
                        }
                    }
                    lastIdentifiers = newLastIdentifiers;
                };
            };
        },
        882: module => {
            "use strict";
            var memo = {};
            function getTarget(target) {
                if (typeof memo[target] === "undefined") {
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
            }
            function insertBySelector(insert, style) {
                var target = getTarget(insert);
                if (!target) {
                    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
                }
                target.appendChild(style);
            }
            module.exports = insertBySelector;
        },
        825: module => {
            "use strict";
            function insertStyleElement(options) {
                var element = document.createElement("style");
                options.setAttributes(element, options.attributes);
                options.insert(element, options.options);
                return element;
            }
            module.exports = insertStyleElement;
        },
        853: (module, __unused_webpack_exports, __webpack_require__) => {
            "use strict";
            function setAttributesWithoutAttributes(styleElement) {
                var nonce = true ? __webpack_require__.nc : 0;
                if (nonce) {
                    styleElement.setAttribute("nonce", nonce);
                }
            }
            module.exports = setAttributesWithoutAttributes;
        },
        730: module => {
            "use strict";
            function apply(styleElement, options, obj) {
                var css = "";
                if (obj.supports) {
                    css += "@supports (".concat(obj.supports, ") {");
                }
                if (obj.media) {
                    css += "@media ".concat(obj.media, " {");
                }
                var needLayer = typeof obj.layer !== "undefined";
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
                if (sourceMap && typeof btoa !== "undefined") {
                    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
                }
                options.styleTagTransform(css, styleElement, options.options);
            }
            function removeStyleElement(styleElement) {
                if (styleElement.parentNode === null) {
                    return false;
                }
                styleElement.parentNode.removeChild(styleElement);
            }
            function domAPI(options) {
                if (typeof document === "undefined") {
                    return {
                        update: function update() {},
                        remove: function remove() {}
                    };
                }
                var styleElement = options.insertStyleElement(options);
                return {
                    update: function update(obj) {
                        apply(styleElement, options, obj);
                    },
                    remove: function remove() {
                        removeStyleElement(styleElement);
                    }
                };
            }
            module.exports = domAPI;
        },
        558: module => {
            "use strict";
            function styleTagTransform(css, styleElement) {
                if (styleElement.styleSheet) {
                    styleElement.styleSheet.cssText = css;
                } else {
                    while (styleElement.firstChild) {
                        styleElement.removeChild(styleElement.firstChild);
                    }
                    styleElement.appendChild(document.createTextNode(css));
                }
            }
            module.exports = styleTagTransform;
        },
        877: module => {
            "use strict";
            module.exports = "data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M2.44%204.18C2%205.04%202%206.16%202%208.4v3.2c0%202.24%200%203.36.44%204.22a4%204%200%20001.74%201.74c.86.44%201.98.44%204.22.44h3.2c2.24%200%203.36%200%204.22-.44a4%204%200%20001.74-1.74c.44-.86.44-1.98.44-4.22V8.4c0-2.24%200-3.36-.44-4.22a4%204%200%2000-1.74-1.74C14.96%202%2013.84%202%2011.6%202H8.4c-2.24%200-3.36%200-4.22.44a4%204%200%2000-1.74%201.74zm12.2%203.8a.9.9%200%2010-1.28-1.27L8.7%2011.38%206.64%209.33a.9.9%200%2000-1.28%201.27l2.7%202.69a.9.9%200%20001.27%200l5.3-5.3z%22%20fill%3D%22%235181b8%22%2F%3E%3C%2Fsvg%3E";
        },
        373: module => {
            "use strict";
            module.exports = "data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M4.05%202.53C4.79%202.13%205.52%202%207.13%202h5.74c1.61%200%202.34.14%203.08.53.65.35%201.17.87%201.52%201.52.4.74.53%201.47.53%203.08v5.74c0%201.61-.14%202.34-.53%203.08a3.64%203.64%200%2001-1.52%201.52c-.74.4-1.47.53-3.08.53H7.13c-1.61%200-2.34-.14-3.08-.53a3.64%203.64%200%2001-1.52-1.52c-.4-.74-.53-1.47-.53-3.08V7.13c0-1.61.14-2.34.53-3.08a3.65%203.65%200%20011.52-1.52zm3.08.97c-1.53%200-1.96.14-2.38.36a2.15%202.15%200%2000-.9.9c-.21.4-.35.84-.35%202.37v5.74c0%201.53.14%201.96.36%202.38.2.39.5.69.9.9.4.21.84.35%202.37.35h5.74c1.53%200%201.96-.14%202.38-.36.39-.2.69-.5.9-.9.21-.4.35-.84.35-2.37V7.13c0-1.53-.14-1.96-.36-2.38a2.15%202.15%200%2000-.9-.9c-.4-.21-.84-.35-2.37-.35H7.13z%22%20fill%3D%22%23aeb7c2%22%2F%3E%3C%2Fsvg%3E";
        }
    };
    var __webpack_module_cache__ = {};
    function __webpack_require__(moduleId) {
        var cachedModule = __webpack_module_cache__[moduleId];
        if (cachedModule !== undefined) {
            return cachedModule.exports;
        }
        var module = __webpack_module_cache__[moduleId] = {
            id: moduleId,
            exports: {}
        };
        __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
        return module.exports;
    }
    __webpack_require__.m = __webpack_modules__;
    (() => {
        __webpack_require__.n = module => {
            var getter = module && module.__esModule ? () => module["default"] : () => module;
            __webpack_require__.d(getter, {
                a: getter
            });
            return getter;
        };
    })();
    (() => {
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
    })();
    (() => {
        __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
    })();
    (() => {
        __webpack_require__.b = document.baseURI || self.location.href;
 // undefined = chunk not loaded, null = chunk preloaded/prefetched
        // [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
                var installedChunks = {
            792: 0
        };
    })();
    (() => {
        __webpack_require__.nc = undefined;
    })();
    var __webpack_exports__ = {};
    (() => {
        "use strict";
        // EXTERNAL MODULE: ../../node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0_webpack-cli@5.1.4_webpack@5.91.0__/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
                var injectStylesIntoStyleTag = __webpack_require__(245);
        var injectStylesIntoStyleTag_default = __webpack_require__.n(injectStylesIntoStyleTag);
        // EXTERNAL MODULE: ../../node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0_webpack-cli@5.1.4_webpack@5.91.0__/node_modules/style-loader/dist/runtime/styleDomAPI.js
                var styleDomAPI = __webpack_require__(730);
        var styleDomAPI_default = __webpack_require__.n(styleDomAPI);
        // EXTERNAL MODULE: ../../node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0_webpack-cli@5.1.4_webpack@5.91.0__/node_modules/style-loader/dist/runtime/insertBySelector.js
                var insertBySelector = __webpack_require__(882);
        var insertBySelector_default = __webpack_require__.n(insertBySelector);
        // EXTERNAL MODULE: ../../node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0_webpack-cli@5.1.4_webpack@5.91.0__/node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
                var setAttributesWithoutAttributes = __webpack_require__(853);
        var setAttributesWithoutAttributes_default = __webpack_require__.n(setAttributesWithoutAttributes);
        // EXTERNAL MODULE: ../../node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0_webpack-cli@5.1.4_webpack@5.91.0__/node_modules/style-loader/dist/runtime/insertStyleElement.js
                var insertStyleElement = __webpack_require__(825);
        var insertStyleElement_default = __webpack_require__.n(insertStyleElement);
        // EXTERNAL MODULE: ../../node_modules/.pnpm/style-loader@4.0.0_webpack@5.91.0_webpack-cli@5.1.4_webpack@5.91.0__/node_modules/style-loader/dist/runtime/styleTagTransform.js
                var styleTagTransform = __webpack_require__(558);
        var styleTagTransform_default = __webpack_require__.n(styleTagTransform);
        // EXTERNAL MODULE: ../../node_modules/.pnpm/css-loader@7.1.2_webpack@5.91.0_webpack-cli@5.1.4_webpack@5.91.0__/node_modules/css-loader/dist/cjs.js!../../node_modules/.pnpm/sass-loader@14.2.1_sass@1.77.6_webpack@5.91.0_webpack-cli@5.1.4_webpack@5.91.0__/node_modules/sass-loader/dist/cjs.js!./src/style.scss
                var style = __webpack_require__(374);
        var options = {};
        options.styleTagTransform = styleTagTransform_default();
        options.setAttributes = setAttributesWithoutAttributes_default();
        options.insert = insertBySelector_default().bind(null, "head");
        options.domAPI = styleDomAPI_default();
        options.insertStyleElement = insertStyleElement_default();
        var update = injectStylesIntoStyleTag_default()(style.A, options);
        const src_style = style.A && style.A.locals ? style.A.locals : undefined;
        function advancedMenuStoreFactory(DI) {
            const state = {
                iframeEl: null
            };
            const saveModalElement = iframeEl => {
                state.iframeEl = iframeEl;
            };
            const updateMenu = async data => {
                if (!state.iframeEl?.parentElement) {
                    return;
                }
                state.iframeEl?.contentWindow?.postMessage(JSON.stringify({
                    ...data,
                    token: DI.tokenStore.state.userToken,
                    tokenLevel: DI.tokenStore.state.tokenLevel,
                    tokenPoints: DI.tokenStore.state.tokenPoints || null,
                    host: DI.host
                }), "MISSING_ENV_VAR".ADVANCED_MENU_IFRAME_SRC || `${DI.host}/script/AdvMenu/`);
            };
            return {
                saveModalElement,
                updateMenu
            };
        }
        function botCounterFactory(DI) {
            const state = {
                types: {},
                marks: {}
            };
            function fillCounters() {
                DI.config.state.types.forEach((botType => {
                    if (!state.types[botType.id]) {
                        state.types[botType.id] = 0;
                    }
                    state.types[botType.id] += 1;
                }));
                DI.config.state.marks.forEach((botMark => {
                    if (!state.marks[botMark.id]) {
                        state.marks[botMark.id] = 0;
                    }
                    state.marks[botMark.id] += 1;
                }));
            }
            function incrementBotCountByType(typeId) {
                state.types[typeId] += 1;
            }
            function incrementBotCountByMark(markId) {
                state.marks[markId] += 1;
            }
            fillCounters();
            return {
                state,
                incrementBotCountByType,
                incrementBotCountByMark
            };
        }
        /* eslint-disable @typescript-eslint/naming-convention */
        /* eslint-enable @typescript-eslint/naming-convention */
        const http = GM_xmlhttpRequest || GM && GM.xmlHttpRequest;
        if (!http) {
            throw new Error("Unable to get supported cross-origin XMLHttpRequest function.");
        }
        const gm_utils = {
            async http(options) {
                return new Promise((resolve => {
                    http({
                        url: options.url,
                        method: options.method || "GET",
                        overrideMimeType: options.mime || "application/json; charset=utf-8",
                        data: options.data,
                        async onload(response) {
                            resolve(response.responseText);
                        }
                    });
                }));
            },
            unsafeWindow,
            setStorageValue: GM_setValue,
            getStorageValue: GM_getValue,
            deleteStorageValue: GM_deleteValue
        };
        async function botListsFactory(DI) {
            let botList = [];
            async function fetchBotList() {
                const urls = [ "https://api.botnadzor.org/marking3/list", "https://botnadzor.github.io/user-script/list" ];
                for (const url of urls) {
                    try {
                        const responseText = await gm_utils.http({
                            url
                        });
                        return JSON.parse(responseText);
                    } catch (e) {}
                }
                return null;
            }
            function saveBotList(rawBotList) {
                gm_utils.setStorageValue("botHighlighterSavedBotList", JSON.stringify(rawBotList));
            }
            function saveBotListVersion() {
                gm_utils.setStorageValue("botHighlighterBotListVersion", DI.config.state.botListVersion);
            }
            async function getSavedBotList() {
                return JSON.parse(gm_utils.getStorageValue("botHighlighterSavedBotList") || "[]");
            }
            function getSavedBotListVersion() {
                return gm_utils.getStorageValue("botHighlighterBotListVersion") || "0";
            }
            async function getBotList() {
                const localBotListVersion = getSavedBotListVersion();
                if (DI.config.state.botListVersion <= localBotListVersion) {
                    return getSavedBotList();
                }
                const fetchedBotList = await fetchBotList();
                if (!fetchedBotList) {
                    return getSavedBotList();
                }
                saveBotList(fetchedBotList);
                saveBotListVersion();
                return fetchedBotList;
            }
            async function fillLists() {
                const rawBotList = await getBotList();
                botList = rawBotList.map((rawBot => {
                    DI.botCounter.incrementBotCountByType(Number(rawBot.t));
                    if (rawBot.m) {
                        DI.botCounter.incrementBotCountByMark(rawBot.m);
                    }
                    const mark = DI.config.state.marks.find((markItem => markItem.id === rawBot.m));
                    const type = DI.config.state.types.find((typeItem => typeItem.id === Number(rawBot.t)));
                    return {
                        id: Number(rawBot.i),
                        nickname: rawBot.n,
                        mark,
                        type
                    };
                }));
            }
            await fillLists();
            return botList;
        }
        const tryTo = act => {
            try {
                return act();
            } catch {}
            return undefined;
        };
        const createStorageValueMigrator = ({storageName, defaultValue, migrations = []}) => {
            const versionStorageName = `${storageName}__version__`;
            const currentVersion = migrations?.length || 0;
            const getUserValueVersion = value => {
                if (value === defaultValue) {
                    return currentVersion;
                }
                const versionInUserStorage = gm_utils.getStorageValue(versionStorageName);
                if (typeof versionInUserStorage === "undefined") {
                    return 0;
                }
                return versionInUserStorage;
            };
            const getUserValue = () => {
                const realValue = gm_utils.getStorageValue(storageName);
                const parsedValue = tryTo((() => JSON.parse(realValue)));
                const computedValue = typeof defaultValue === "object" ? parsedValue ?? defaultValue : realValue;
                return computedValue;
            };
            const set = newValue => {
                gm_utils.setStorageValue(storageName, JSON.stringify(newValue));
                gm_utils.setStorageValue(versionStorageName, currentVersion);
            };
            const get = () => {
                const userStorageValue = getUserValue();
                const appliedMigrationsCount = getUserValueVersion(userStorageValue);
                const notAppliedMigrations = migrations.slice(appliedMigrationsCount);
                const migratedValue = notAppliedMigrations.reduce(((lastRes, migration) => migration(lastRes)), userStorageValue);
                return migratedValue;
            };
            return {
                get,
                set
            };
        };
        const create_storage_value_migrator = createStorageValueMigrator;
        var EKnownStorages = function(EKnownStorages) {
            EKnownStorages["CONFIG"] = "botHighlighterSavedConfig";
            return EKnownStorages;
        }(EKnownStorages || {});
        const known_storages = EKnownStorages;
        const createIDTrueMap = array => array.reduce(((acc, it) => ({
            ...acc,
            [it]: true
        })), {});
        function processRawConfig(rawConfig) {
            const types = rawConfig.types.map((rawTypeItem => ({
                id: rawTypeItem.id,
                name: rawTypeItem.n,
                serverColor: rawTypeItem.color,
                shouldShowActions: Boolean(rawTypeItem.links),
                switchable: Boolean(rawTypeItem.disabling)
            })));
            const marks = rawConfig.mark.map((rawMarkItem => ({
                id: rawMarkItem.id,
                name: rawMarkItem.n
            })));
            return {
                botListVersion: String(rawConfig.timestamp),
                types,
                marks,
                wallsIdsWithDisabledReplyCollecting: createIDTrueMap(rawConfig.wall_skips),
                message: rawConfig.message,
                proxy: rawConfig.proxy
            };
        }
        const stateCache = create_storage_value_migrator({
            storageName: known_storages.CONFIG,
            defaultValue: {
                botListVersion: "0",
                types: [],
                marks: [],
                wallsIdsWithDisabledReplyCollecting: {},
                proxy: ""
            },
            migrations: [ s => ({
                ...s,
                wallsIdsWithDisabledReplyCollecting: {}
            }), s => ({
                ...s,
                proxy: ""
            }) ]
        });
        async function configStoreFactory(DI) {
            const state = stateCache.get();
            console.log("Botnadzor: Конфиг по умолчанию", JSON.parse(JSON.stringify(state)), gm_utils);
            async function saveState() {
                stateCache.set(state);
            }
            async function fetchConfig() {
                const lastRequest = {
                    date: Date.now()
                };
                gm_utils.setStorageValue("gosvon_config_request", JSON.stringify(lastRequest));
                const urls = [ "https://api.botnadzor.org/marking3/main", "https://botnadzor.github.io/user-script/main" ];
                let shouldUseProxyAsMainHost = false;
                for (const url of urls) {
                    try {
                        const responseText = await gm_utils.http({
                            url
                        });
                        const parsedConfig = processRawConfig(JSON.parse(responseText));
                        console.log("Botnadzor: Получен новый конфиг", parsedConfig);
                        Object.assign(state, parsedConfig);
                        saveState();
                        lastRequest.result = parsedConfig;
                        gm_utils.setStorageValue("gosvon_config_request", JSON.stringify(lastRequest));
                        if (shouldUseProxyAsMainHost) {
                            DI.host = state.proxy;
                        }
                        return;
                    } catch (e) {
                        shouldUseProxyAsMainHost = true;
                    }
                }
            }
            const initialize = async () => {
                if (hasConfigRequestInProgress()) {
                    await waitForExistingConfigRequestResult({
                        onTimeout: () => fetchConfig()
                    });
                } else {
                    await fetchConfig();
                }
            };
            await initialize();
            return {
                state
            };
        }
        const REQUEST_TIMEOUT = 2e4;
        function getLastConfigRequest() {
            try {
                return JSON.parse(gm_utils.getStorageValue("gosvon_config_request"));
            } catch {
                return undefined;
            }
        }
        function hasConfigRequestInProgress() {
            const lastConfigRequest = getLastConfigRequest();
            if (!lastConfigRequest) {
                return false;
            }
            const now = Date.now();
            const configAliveTill = lastConfigRequest.date + REQUEST_TIMEOUT;
            const isRequestTimeoutPassed = now > configAliveTill;
            return !lastConfigRequest.result && !isRequestTimeoutPassed;
        }
        function waitForExistingConfigRequestResult({onTimeout}) {
            return new Promise((resolve => {
                let timeout = null;
                const checkResultInterval = setInterval((() => {
                    const lastConfigRequest = getLastConfigRequest();
                    if (lastConfigRequest?.result) {
                        clearTimeout(timeout);
                        clearInterval(checkResultInterval);
                        resolve(lastConfigRequest.result);
                    }
                }), 100);
                timeout = setTimeout((() => {
                    clearInterval(checkResultInterval);
                    resolve(onTimeout());
                }), REQUEST_TIMEOUT);
            }));
        }
        function formatDate(date) {
            const addZero = num => num < 10 ? `0${num}` : num;
            const month = addZero(date.getMonth() + 1);
            const year = addZero(date.getFullYear());
            const day = addZero(date.getDate());
            const hour = addZero(date.getHours());
            const minute = addZero(date.getMinutes());
            const second = addZero(date.getSeconds());
            return `${day}.${month}.${year} ${hour}:${minute}:${second}`;
        }
        function registrationDatesFactory() {
            const state = {
                registrationDates: {},
                mapUserIdToWatchers: {}
            };
            const triggerRegistrationDatesWatchers = userId => {
                state.mapUserIdToWatchers[userId]?.forEach(((cb, index) => {
                    try {
                        cb(state.registrationDates[userId]);
                    } catch {
                        state.mapUserIdToWatchers[userId].splice(index, 1);
                    }
                }));
            };
            const fetchUserId = async nickname => {
                const userIdResponse = await gm_utils.http({
                    url: `https://vk.com/${nickname}`,
                    mime: "application/json; charset=windows-1251"
                });
                return userIdResponse.match(/"owner_id":(\d+)/)?.[1];
            };
            const fetchRegistrationDate = async userIdOrNickName => {
                const existingUserRegistrationDate = state.registrationDates[userIdOrNickName];
                if (existingUserRegistrationDate) {
                    return existingUserRegistrationDate;
                }
                const userId = userIdOrNickName.match(/^(id)?\d+$/) ? userIdOrNickName.replace(/^id/, "") : await fetchUserId(userIdOrNickName);
                console.log(`Botnadzor: ID пользователя ${userId}`);
                const userInfoResponse = await gm_utils.http({
                    url: `https://vk.com/foaf.php?id=${userId}`,
                    mime: "application/json; charset=windows-1251"
                });
                const matchResponseDate = userInfoResponse.match(/<ya:created dc:date="(.+)"\/>/)?.[1];
                if (!matchResponseDate) {
                    console.log(`Botnadzor: Дата регистрации не найдена ${userId}`, userInfoResponse);
                    if (userInfoResponse.match(/<ya:profileState>banned<\/ya:profileState>/)) {
                        const errorText = "Аккаунт забанен. Нельзя получить дату регистрации";
                        state.registrationDates[userIdOrNickName] = errorText;
                        triggerRegistrationDatesWatchers(userIdOrNickName);
                        return errorText;
                    }
                    const errorText = "Не удалось получить дату регистрации";
                    state.registrationDates[userIdOrNickName] = errorText;
                    triggerRegistrationDatesWatchers(userIdOrNickName);
                    return errorText;
                }
                const date = new Date(matchResponseDate);
                if (!date) {
                    return "";
                }
                const userRegistrationDate = `Дата регистрации: ${formatDate(date)}`;
                state.registrationDates[userIdOrNickName] = userRegistrationDate;
                triggerRegistrationDatesWatchers(userIdOrNickName);
                return userRegistrationDate;
            };
            const onChangeRegistrationDate = (userId, watcher) => {
                state.mapUserIdToWatchers[userId] = [ ...state.mapUserIdToWatchers[userId] || [], watcher ];
                watcher(state.registrationDates[userId]);
            };
            return {
                fetchRegistrationDate,
                onChangeRegistrationDate
            };
        }
        const constants = {
            REPLIES_SAVE_AFTER_COUNT: 500,
            MAX_REPLIES_IDS_COUNT_FOR_SAVING: 3e3
        };
        const src_constants = constants;
        function transformReplyDataForServer(replies) {
            return replies.reduce(((acc, replyData) => {
                const addedPost = acc.find((it => it.post === replyData.postId && it.wall === replyData.wallId));
                const replyDataInServerFormat = {
                    reply_id: replyData.replyId,
                    user_id: replyData.userId
                };
                if (addedPost) {
                    addedPost.comms.push(replyDataInServerFormat);
                } else {
                    const postDataInServerFormat = {
                        wall: replyData.wallId,
                        nick: replyData.wallSlug,
                        post: replyData.postId,
                        count: replyData.repliesCount,
                        comms: [ replyDataInServerFormat ]
                    };
                    acc.push(postDataInServerFormat);
                }
                return acc;
            }), []);
        }
        const STATE_KEY = "gosvonRepliesStore";
        function replyCollectorFactory(DI) {
            const savedState = gm_utils.getStorageValue(STATE_KEY);
            const state = {
                repliesForSending: savedState?.repliesForSending || [],
                latestSentRepliesIds: savedState?.latestSentRepliesIds || [],
                lastSendTime: savedState?.lastSendTime || 0
            };
            let latestSentRepliesIdsIndexed = {};
            const makeIndexedLatestSentRepliesIds = () => {
                latestSentRepliesIdsIndexed = state.latestSentRepliesIds.reduce(((acc, id) => ({
                    ...acc,
                    [id]: true
                })), {});
            };
            makeIndexedLatestSentRepliesIds();
            const saveState = () => {
                gm_utils.setStorageValue(STATE_KEY, state);
            };
            const updateLatestSentRepliesIds = sentReplies => {
                const exceedingCount = Math.max(0, state.latestSentRepliesIds.length + sentReplies.length - src_constants.MAX_REPLIES_IDS_COUNT_FOR_SAVING);
                const limitedOldLatestSentRepliesIds = state.latestSentRepliesIds.slice(exceedingCount);
                const newLatestSentRepliesIds = [ ...limitedOldLatestSentRepliesIds, ...sentReplies.map((it => it.replyId)) ];
                console.log("Botnadzor: Кеширование недавно отправленных комментариев", {
                    sentReplies,
                    MAX_REPLIES_IDS_COUNT_FOR_SAVING: src_constants.MAX_REPLIES_IDS_COUNT_FOR_SAVING,
                    needToRemoveOld: state.latestSentRepliesIds.length > src_constants.MAX_REPLIES_IDS_COUNT_FOR_SAVING,
                    currentLatestSentRepliesIds: state.latestSentRepliesIds,
                    limitedOldLatestSentRepliesIds,
                    newLatestSentRepliesIds
                });
                state.latestSentRepliesIds = newLatestSentRepliesIds;
                makeIndexedLatestSentRepliesIds();
            };
            async function sendReplies() {
                const checkShouldSend = () => {
                    const sinceLastSendTime = Date.now() - state.lastSendTime;
                    const shouldSend = state.repliesForSending.length >= src_constants.REPLIES_SAVE_AFTER_COUNT && sinceLastSendTime > 1 * 60 * 1e3 || state.repliesForSending.length > 0 && sinceLastSendTime > 10 * 60 * 1e3;
                    return shouldSend;
                };
                if (!checkShouldSend()) {
                    return;
                }
                try {
                    const sentReplies = state.repliesForSending.slice();
                    const sendingData = transformReplyDataForServer(sentReplies);
                    console.log("Botnadzor: Сохранение комментов. Запрос:", {
                        sendingData
                    });
                    const response = await gm_utils.http({
                        url: `${DI.host}/script/get.php?code=${DI.tokenStore.state.userToken}`,
                        method: "POST",
                        data: JSON.stringify(sendingData)
                    });
                    console.log("Botnadzor: Сохранение комментов. Ответ:", {
                        response
                    });
                    state.repliesForSending = state.repliesForSending.slice(sentReplies.length);
                    state.lastSendTime = Date.now().valueOf();
                    updateLatestSentRepliesIds(sentReplies);
                    saveState();
                } catch (e) {
                    console.error("Botnadzor: Сохранение комментов. Ошибка:", e);
                }
            }
            const killSwitch = () => {
                if (state.repliesForSending.length > src_constants.REPLIES_SAVE_AFTER_COUNT * 3) {
                    state.repliesForSending = [];
                    state.latestSentRepliesIds = [];
                    saveState();
                    makeIndexedLatestSentRepliesIds();
                    DI.userSettings.setIsRepliesCollectingEnabled(false);
                    throw new Error("Botnadzor: ReplyCollector. KILL_SWITCH");
                }
            };
            let debounceTimeoutId = -1;
            const add = replyData => {
                killSwitch();
                if (!DI.tokenStore.state.userToken) {
                    return;
                }
                const isReplyOnPageWithDisabledCollecting = DI.config.state.wallsIdsWithDisabledReplyCollecting[replyData.wallId];
                if (isReplyOnPageWithDisabledCollecting) {
                    console.log(`Botnadzor: Сбор комментариев отключен для страницы с ID ${replyData.wallId}`);
                    return;
                }
                const isReplyRecentlySent = latestSentRepliesIdsIndexed[replyData.replyId];
                if (isReplyRecentlySent) {
                    return;
                }
                const isReplyAlreadyAdded = state.repliesForSending.some((it => it.wallId === replyData.wallId && it.postId === replyData.postId && it.replyId === replyData.replyId && it.userId === replyData.userId));
                if (isReplyAlreadyAdded) {
                    return;
                }
                state.repliesForSending.push(replyData);
                clearTimeout(debounceTimeoutId);
                debounceTimeoutId = setTimeout((() => {
                    saveState();
                    sendReplies();
                }), 1e3);
            };
            const clearCache = () => {
                Object.assign(state, {
                    repliesForSending: [],
                    latestSentRepliesIds: []
                });
                saveState();
            };
            return {
                state,
                add,
                clearCache
            };
        }
        let ETokenPermissions = function(ETokenPermissions) {
            ETokenPermissions["CAN_OPEN_ADVANCED_MENU"] = "CAN_OPEN_ADVANCED_MENU";
            return ETokenPermissions;
        }({});
        const STORE_KEY = "gosvonTokenStore8";
        function tokenStoreFactory(DI) {
            const saved = gm_utils.getStorageValue(STORE_KEY);
            const stateWatchers = [];
            const state = {
                isTokenCheckingInProgress: false,
                errorMessage: "",
                userToken: saved?.userToken || "",
                tokenLevel: saved?.tokenLevel || null,
                tokenPoints: saved?.tokenPoints || null,
                expires: saved?.expires ? new Date(saved?.expires) : null,
                isTokenShown: false
            };
            const dispatchStateUpdate = () => {
                const getComputedPermissions = () => [ ...state.tokenLevel && state.tokenLevel > 0 || state.tokenPoints && state.tokenPoints > 0 ? [ ETokenPermissions.CAN_OPEN_ADVANCED_MENU ] : [] ];
                const getComputedStyle = () => ({
                    permissions: getComputedPermissions()
                });
                stateWatchers.forEach((it => it({
                    ...state,
                    ...getComputedStyle()
                })));
            };
            const update = updator => {
                Object.assign(state, updator(state));
                dispatchStateUpdate();
                gm_utils.setStorageValue(STORE_KEY, {
                    ...state,
                    expires: state.expires ? Number(state.expires) : null
                });
            };
            const onStateUpdate = newStateWatcher => {
                stateWatchers.push(newStateWatcher);
                dispatchStateUpdate();
            };
            const checkToken = async () => {
                const tokenField = document.querySelector(".botnadzor-token-field");
                const checkingToken = tokenField?.value || "";
                if (!tokenField || !checkingToken) {
                    return;
                }
                update((s => ({
                    ...s,
                    errorMessage: "",
                    tokenLevel: null,
                    tokenPoints: null,
                    expires: null,
                    isTokenCheckingInProgress: true
                })));
                try {
                    const responseText = await gm_utils.http({
                        url: `${DI.host}/script/?code=${checkingToken}&t=getMe`
                    });
                    console.log("Botnadzor: Проверка кода:", responseText);
                    const parsed = JSON.parse(responseText);
                    if (parsed.error) {
                        update((s => ({
                            ...s,
                            errorMessage: parsed.error
                        })));
                        DI.userSettings.setIsRepliesCollectingEnabled(false);
                        return;
                    }
                    console.log("Botnadzor: Код:", responseText);
                    if (state.userToken !== checkingToken) {
                        DI.userSettings.automaticallyEnableRepliesCollecting();
                    }
                    update((s => ({
                        ...s,
                        userToken: checkingToken,
                        tokenLevel: Number(parsed.response.access),
                        tokenPoints: Number(parsed.response.points) || null,
                        expires: new Date(Number(`${parsed.response.til}000`)),
                        isTokenShown: false
                    })));
                } catch (e) {
                    console.warn("Botnadzor: Ошибка проверки кода:", e);
                } finally {
                    update((s => ({
                        ...s,
                        isTokenCheckingInProgress: false
                    })));
                }
            };
            const toggleTokenShow = () => {
                update((s => ({
                    ...s,
                    isTokenShown: !s.isTokenShown
                })));
            };
            const autoCheckToken = () => {
                const lastCheckDate = gm_utils.getStorageValue("gosvonLastTokenAutoCheck") || 0;
                const now = Date.now().valueOf();
                const sinceLastCheck = now - lastCheckDate;
                const TWENTY_MINUTES = 20 * 6e4;
                if (sinceLastCheck < TWENTY_MINUTES) {
                    const minutesRest = Math.ceil((TWENTY_MINUTES - sinceLastCheck) / 60 / 1e3);
                    console.log(`Botnadzor: Автоматическая проверка кода возможна через: ${minutesRest} мин.`);
                    return;
                }
                console.log("Botnadzor: Автоматическая проверка кода");
                checkToken();
                gm_utils.setStorageValue("gosvonLastTokenAutoCheck", Date.now().valueOf());
            };
            const clearToken = () => {
                DI.userSettings.setIsRepliesCollectingEnabled(false);
                update((s => ({
                    ...s,
                    userToken: "",
                    tokenLevel: null,
                    tokenPoints: null,
                    expires: null
                })));
            };
            const onLayoutInjected = () => {
                dispatchStateUpdate();
                autoCheckToken();
                setInterval(autoCheckToken, 8 * 60 * 6e4);
            };
            return {
                state,
                checkToken,
                onStateUpdate,
                onLayoutInjected,
                toggleTokenShow,
                clearToken
            };
        }
        const user_settings_factory_STORE_KEY = "botHighlighterSettings";
        function userSettingsFactory(DI) {
            const saved = gm_utils.getStorageValue(user_settings_factory_STORE_KEY);
            const stateWatchers = [];
            const state = {
                disabledMarksIds: saved?.disabledMarksIds || [],
                disabledTypesIds: saved?.disabledTypesIds || [],
                customTypesColors: saved?.customTypesColors || {},
                isFansTableViewEnabled: saved?.isFansTableViewEnabled ?? false,
                isRepliesCollectingEnabled: saved?.isRepliesCollectingEnabled ?? false,
                isRepliesCollectingEnabledAutomatically: false
            };
            const mapTypeToColorApplier = {};
            const dispatchStateUpdate = () => {
                stateWatchers.forEach((it => it(state)));
            };
            const update = updator => {
                Object.assign(state, updator(state));
                dispatchStateUpdate();
                gm_utils.setStorageValue(user_settings_factory_STORE_KEY, {
                    disabledMarksIds: state.disabledMarksIds,
                    disabledTypesIds: state.disabledTypesIds,
                    customTypesColors: state.customTypesColors,
                    isFansTableViewEnabled: state.isFansTableViewEnabled,
                    isRepliesCollectingEnabled: state.isRepliesCollectingEnabled
                });
            };
            const onStateUpdate = newStateWatcher => {
                stateWatchers.push(newStateWatcher);
                dispatchStateUpdate();
            };
            const disableMark = markId => {
                state.disabledMarksIds = [ ...state.disabledMarksIds, markId ];
                update((s => ({
                    ...s,
                    disabledMarksIds: [ ...s.disabledMarksIds, markId ]
                })));
            };
            const disableType = typeId => {
                update((s => ({
                    ...s,
                    disabledTypesIds: [ ...state.disabledTypesIds, typeId ]
                })));
            };
            const enableMark = markId => {
                update((s => ({
                    ...s,
                    disabledMarksIds: s.disabledMarksIds.filter((markIdItem => markIdItem !== markId))
                })));
            };
            const setIsFansTableViewEnabled = isFansTableViewEnabled => {
                update((s => ({
                    ...s,
                    isFansTableViewEnabled
                })));
            };
            const setIsRepliesCollectingEnabled = isRepliesCollectingEnabled => {
                update((s => ({
                    ...s,
                    isRepliesCollectingEnabled
                })));
            };
            const automaticallyEnableRepliesCollecting = () => {
                update((s => ({
                    ...s,
                    isRepliesCollectingEnabled: true,
                    isRepliesCollectingEnabledAutomatically: true
                })));
            };
            const enableType = typeId => {
                update((s => ({
                    ...s,
                    disabledTypesIds: s.disabledTypesIds.filter((typeIdItem => typeIdItem !== typeId))
                })));
            };
            const triggerWatchers = typeId => {
                mapTypeToColorApplier[typeId]?.forEach(((cb, index) => {
                    try {
                        cb(state.customTypesColors[typeId]);
                    } catch {
                        mapTypeToColorApplier[typeId].splice(index, 1);
                    }
                }));
            };
            const setCustomTypeColor = (typeId, color) => {
                update((s => ({
                    ...s,
                    customTypesColors: {
                        ...s.customTypesColors,
                        [typeId]: color
                    }
                })));
                triggerWatchers(typeId);
            };
            const removeCustomTypeColor = typeId => {
                delete state.customTypesColors[typeId];
                update((s => ({
                    ...s
                })));
                triggerWatchers(typeId);
            };
            const checkIsMarkDisabled = markId => state.disabledMarksIds.includes(markId);
            const checkIsTypeDisabled = typeId => state.disabledTypesIds.includes(typeId);
            const getCustomTypeColor = typeId => state.customTypesColors[typeId];
            const onChangeCustomColor = (typeId, cb) => {
                mapTypeToColorApplier[typeId] = [ ...mapTypeToColorApplier[typeId] || [], cb ];
                cb(state.customTypesColors[typeId]);
            };
            const onLayoutInjected = () => {
                if (!DI.tokenStore.state.userToken) {
                    setIsRepliesCollectingEnabled(false);
                }
            };
            const initialize = () => {
                DI.config.state.types.forEach((typeItem => {
                    if (!typeItem.switchable) {
                        enableType(typeItem.id);
                    }
                }));
            };
            initialize();
            return {
                state,
                onStateUpdate,
                enableMark,
                enableType,
                disableMark,
                disableType,
                checkIsMarkDisabled,
                checkIsTypeDisabled,
                getCustomTypeColor,
                onChangeCustomColor,
                setCustomTypeColor,
                removeCustomTypeColor,
                setIsFansTableViewEnabled,
                setIsRepliesCollectingEnabled,
                automaticallyEnableRepliesCollecting,
                onLayoutInjected
            };
        }
        const DI = {
            botList: {},
            userSettings: {},
            config: {},
            botCounter: {},
            registrationDates: {},
            advancedMenuStore: {},
            replyCollector: {},
            tokenStore: {},
            host: "https://botnadzor.org"
        };
        async function getDIReady() {
            DI.config = await configStoreFactory(DI);
            DI.userSettings = userSettingsFactory(DI);
            DI.tokenStore = tokenStoreFactory(DI);
            if (!DI.config.state.botListVersion) {
                throw new Error("Botnadzor: Не могу получить конфигурацию");
            }
            DI.replyCollector = replyCollectorFactory(DI);
            DI.botCounter = botCounterFactory(DI);
            DI.registrationDates = registrationDatesFactory();
            DI.advancedMenuStore = advancedMenuStoreFactory(DI);
            DI.botList = await botListsFactory(DI);
            return DI;
        }
        const di = DI;
        function elementsFinderFactory() {
            const mapSelectorHandlers = {};
            let alreadyFoundElements = [];
            setInterval((() => {
                Object.entries(mapSelectorHandlers).forEach((([selector, handlers]) => {
                    const newFoundElements = [ ...document.querySelectorAll(selector) ].filter((element => !alreadyFoundElements.includes(element)));
                    newFoundElements.forEach((element => {
                        handlers.forEach((handler => {
                            handler(element);
                        }));
                    }));
                    alreadyFoundElements = [ ...alreadyFoundElements, ...newFoundElements ];
                }));
            }), 300);
            function on(selector, foundHandler) {
                if (!mapSelectorHandlers[selector]) {
                    mapSelectorHandlers[selector] = [];
                }
                mapSelectorHandlers[selector].push(foundHandler);
            }
            return {
                on
            };
        }
        const botnadzor = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAbXSURBVHgB5Zt7bFNVHMe/5967yQZjLRuPKWh5jEeMbOhfPhJL1P80PBJJ1ETLRiIaDZskGkMCm8YQ/yADMToNe9QQiKIJixFiNFAjGBNDKBhwuiEdRgyw0jLGNtreezyn60pve7u+zh3t9vljbW/vbu/vd36vc87vEpjM8s3/2dRAkR0SrSGU2CiIjVBYKKG22PPYdx5K4CegHvbhDChxS0Wyu7vV6oGJEJjA8k3X7CqwhmjS2nhBM4d4AOqSCXV275vtgmCEKcDW4LMUD2hb2Cg2sBu2wBSYMihtlotllyjLyFkBEyN4PMQPonXKirInV0XkpIBl9d4tGtA0cYLHM2oRPe2VnciSrBSwfLPPpgbVDvbWjryAeOQiaXU21iAhQ/ioq0HtNPJGeA7lA3J6Wd21BmRIRhZQXedtYSkq4x+ZSFg6bfqrvaI57fPTPZEJ38Gu7kBh0NnTVrkxnRPTUkD1Ju9pFmxqUVAQd09bxapUZ6WMAeGRLzjhObS2ur6/I9VZ4ypgaZ13RwGZvRGO6k3XWsY7IakLjOZ4uhuTAInSxj/bZxvKYqiA0TzPU93dKnCE45eL5FVGdYKhC2hB7fgkEp5jiRRuCSQooLqu30GR6wwuL7EbFUo6F+Cmz0d/kiqA4w+q8kJPp9U/dkBnAWqAzeomr/AcS7ES0llB1AIiExxe408m3zdCZwXK2FE1oNqZOnISfsUCBZIpa0x38N2iuOxVkQNjVtDEP0QVQAjZwcwfudDy6gwsmifDTH75IwjHrgHkAqVkCyIKCMcAvoY3yX0/HssSJjN/E1aASskrmGKwafNa/hpWAAGxY+qxhv9RItHfBhO4cFnFF8dGIBLvgAZB2PiehRIMqrUZr4uliW9Qw0GXWAWIRFWL7BLbcCjAub4gNLDBp6QGUxS2DWdTKCE2lhhhBkvnK/iwbjpEcu4Siys/inErSqQHlPBGJcxhZinBusemQSRzrUFhCmADb5GmWAEUj01oAgjlVKKnhybYXBUIxDeYeHeDI7nd8Yxp+tlVIChWA2IVcFPVXfL6TQ3Pf3ADN4ezu+n7KiQc2lYORb6jhOviCqEwCiuDPaLiQN9VvQ/MKpNw/xwZJ88HkQ1P1So64TlnPSEIxCPxthQI4uT5xJt74sHsjeyZh4sTf+Ncdso0hBC/RCj1QBBnL4YwEtCb+wv2ElhnZL5KMtcqwf5Qke7YJWZh//SLcwFCtT6WBtEHQQzdpjh0Qp+jS+8hWP945rXAW+tKIMUtL3X9ehtCIXCzUhhuCOTwycSb3Lq+FIur0l8pemSxklBABUIUX/0seGLFO9FkTXZBIL/3qTjym14JCpP90zfKUGVN7QrzKyV88mZZwvEDbFZ5xSc2BUqq7Ja6O60eEm5FE8fH3w7hxpDeV21zZex9fSaqZiVXQsVMggPvlLOYoa/P/vVq+PzIMMRCPFz28C+xNNgFgfRe1rDdeSthjrVyoYL9b5ejZlGiOzy6oghH37dgnlUvvMb0+N6BQfQPiJ6xUBf/O6oAQg9DMEdPBXDwp0SfXVApw7m1HC8/PQ0lLEAWs0rk3Q0laGssg2V6YmXeemQIx88ITH0RmMxO/hq1x+r6fh8Eb4rwIL79pVK8yFKhEVd8GlQ2wvdWGE9JuCt91CXa9DnE09NWsTB8j9FDhO6BYPjEpWn/ED47OmS45MBzfTLhd355yyThwafB0Saq6K8HQgpvIBBWFcay65thbHNyP05dxFz1a9i8dwAdP5i2luiPzXxRBfC9MjOsYIyvT9zGhp038P0p42JGZeZyiOX555r8OGaCz4/BhsDJo//YZ11Osjl8liJZvQiTN0hXsSzw2rOlsK8sDhc4J84F0PrdMNx/m72gQDyyKq1OqgDOkjpvA7OEFkwAc8oljLD5/cCQWYtycVBsjO8rNqxKWEY4jrxqhRXBncgfi2EIllWZd1maEhDvDsTPTd/oG0MFcB9hW8hp99vmO5RozbF+H0vSRdHe9ordLGKalhUmClbxNffum5203zHl9IzFg072Uqjb586etkrHeCek1yxd7+VNk4W1h0iIu2efgGZpTqTr2onCwZmO8Jy0N0a4KXF/Qp7D41Yqs48lo50hFkyaWHZoRF6mSOJnA9R4oa0yoydasntoyuGzaXIedZQSuOSQvDFZqhv/X3OA9xVH2utsuCvwUdfGTXMpr4Ac4dYQlNUGCbzTbOIenGSC7wmxKXxs329WV4IguCJUSbWbaxHiBI9eESbAmxDZjpODQH4yV2WM7l2qXZSQw735/PB0MiIuUhtuxiKkhmWR0cfn4xQTFpQ/Pk+oh2paH6jklouDru7WKg9M5H9k38Irwj6Z2wAAAABJRU5ErkJggg==";
        function openSettingsModal() {
            const modal = document.querySelector(".botnadzor-js-settings-modal");
            if (!modal) {
                return;
            }
            modal.style.display = "block";
        }
        function createLayoutFromString(template, vars = {}) {
            const html = Object.entries(vars).reduce(((acc, [key, value]) => acc.replace(new RegExp(`{{${key}}}`, "g"), value)), template);
            const div = document.createElement("div");
            div.innerHTML = html;
            return div.children[0];
        }
        function addDesktopSettingsModalOpenerForGuestUser() {
            const headerNavAudio = document.querySelector(".HeaderNav__audio");
            headerNavAudio?.setAttribute("style", "min-width: auto !important;");
            const topRegLink = document.querySelector("#top_reg_link");
            const newElement = createLayoutFromString(`\n    <a class="top_nav_link" style="padding-left: 1em; padding-right: 1em;">\n        <img\n          src="${botnadzor}"\n          width="20"\n          height="20"\n          style="vertical-align: middle; margin: -0.25em 0.25em auto auto;"\n        />\n      <span>Ботнадзор</span>\n    </a>\n  `);
            topRegLink?.before(newElement);
            newElement.addEventListener("click", (event => {
                event.preventDefault();
                openSettingsModal();
            }));
        }
        function addDesktopSettingsModalOpenerForGuestUserMobile() {
            const topRegLink = document.querySelector(".UnauthorizedHeader__logo");
            const newElement = createLayoutFromString(`\n    <a class="top_nav_link">\n      <img src="${botnadzor}" width="30" height="30" />\n      <span style="vertical-align: super; margin-right: 15px;">\n        Меню\n      </span>\n    </a>\n  `);
            topRegLink?.before(newElement);
            const menuLink = newElement.querySelector(".top_nav_link");
            menuLink?.addEventListener("click", (() => {
                openSettingsModal();
            }));
        }
        function addDesktopSettingsModalOpenerForLoggedInUser() {
            if (!document.querySelector(".vkuiSimpleCell")) {
                const existingMenuItems = [ ...document.querySelectorAll(".top_profile_mrow") ];
                const insertionTarget = existingMenuItems[existingMenuItems.length - 2];
                const newElement = createLayoutFromString(`\n      <a\n        class="top_profile_mrow"\n        onclick="TopMenu.select(this, event);"\n      >\n        <div class="menu_item_icon">\n          <img\n            src="${botnadzor}"\n            width="20"\n            height="20"\n          />\n        </div>\n        <span>Ботнадзор</span>\n      </a>\n    `);
                newElement.addEventListener("click", (() => {
                    openSettingsModal();
                }));
                insertionTarget?.after(newElement);
                return;
            }
            const firstMenuItem = document.querySelector(".vkuiSimpleCell");
            const newElement = createLayoutFromString(`\n    <a class="vkuiSimpleCell" style="min-height: 34px;" href="#">\n      <div class="vkuiSimpleCell__before">\n        <span class="EcoPlate_itemIcon">\n          <img src="${botnadzor}" width="20" height="20" />\n        </span>\n      </div>\n      <div class="vkuiSimpleCell__middle">\n        <div class="vkuiSimpleCell__content">\n          Ботнадзор\n        </div>\n      </div>\n    </a>\n  `);
            newElement.addEventListener("click", (() => {
                openSettingsModal();
            }));
            firstMenuItem?.before(newElement);
        }
        function addMobileSettingsModalOpener() {
            const existingMenuItems = [ ...document.querySelectorAll(".SettingsMenu__item") ];
            const firstExistingMenuItem = existingMenuItems[0];
            const newElement = createLayoutFromString(`\n    <a class="SettingsMenu__item Row" href="#">\n      <div class="Row__in">\n        <div class="SettingsMenu__itemIcon">\n          <div aria-hidden="true" class="svgIcon svgIcon-user_outline_28">\n          <img src="${botnadzor}" width="28" height="28" />\n          </div>\n        </div>\n        <div class="SettingsMenu__itemTitle">\n          Ботнадзор\n        </div>\n      </div>\n    </a>\n  `);
            newElement.addEventListener("click", (event => {
                event.preventDefault();
                openSettingsModal();
            }));
            firstExistingMenuItem.before(newElement);
        }
        function findBot(idOrNickname) {
            const matchId = String(idOrNickname).match(/^(id)?(\d{3,})$/)?.[2];
            const id = matchId && Number(matchId);
            let foundBot = null;
            if (id) {
                foundBot = di.botList.find((bot => bot.id === id));
            } else {
                foundBot = di.botList.find((bot => bot.nickname === idOrNickname));
            }
            if (!foundBot) {
                return null;
            }
            if (foundBot.mark && di.userSettings.checkIsMarkDisabled(foundBot.mark.id)) {
                return null;
            }
            if (di.userSettings.checkIsTypeDisabled(foundBot.type.id)) {
                return null;
            }
            return foundBot;
        }
        function generateRandomString() {
            let randomString = "";
            for (let i = 0; i < 10; i += 1) {
                randomString += Math.floor(Math.random() * 10);
            }
            return randomString;
        }
        /**
 * @example
 *  - vkId: 123
 *  - vkId: "123"
 *  - vkDomain: "xyz" (a.k.a. vkNickname)
 *  - vkDomain: "id123"
 */        function generateBotnadzorUrl(...args) {
            const [type, vkIdOrDomain] = args;
            const vkDomain = typeof vkIdOrDomain === "number" || vkIdOrDomain.match(/^\d+$/) ? `id${vkIdOrDomain}` : vkIdOrDomain;
            if (type === "card") {
                return `${di.host}/card/${vkDomain}?rand=${generateRandomString()}`;
            }
            return `${di.host}/${type}/${vkDomain}`;
        }
        function hightlightFan(fanEl) {
            const userID = fanEl.getAttribute("data-id");
            if (!userID) {
                return;
            }
            const bot = findBot(userID);
            if (!bot) {
                return;
            }
            const highlightOverlayEl = createLayoutFromString(`\n    <div class="botnadzor-highlight-overlay"></div>\n  `);
            fanEl.append(highlightOverlayEl);
            fanEl.style.position = "relative";
            di.userSettings.onChangeCustomColor(bot.type.id, (customUserColor => {
                highlightOverlayEl.style.background = customUserColor || bot.type.serverColor;
            }));
            const markEl = createLayoutFromString(`\n    <div\n        class="botnadzor-desktop-fan"\n        style="\n          background: ${di.userSettings.getCustomTypeColor(bot.type.id) || bot.type.serverColor};\n        "\n    >\n      (${bot.mark?.name || bot.type.name})\n    </div>\n  `);
            fanEl.appendChild(markEl);
            if (bot.type.shouldShowActions) {
                fanEl.append(createLayoutFromString(`\n        <center>\n          <i>\n            <a target='_blank' href='${generateBotnadzorUrl("account", userID)}'>\n              Комм.\n            </a>\n            <a target='_blank' href='${generateBotnadzorUrl("card", userID)}'>\n              Карт.\n            </a>\n          </i>\n        </center>\n      `));
            }
        }
        const TABLE_CLASS = "botnadzor-fan-table";
        function getOrCreateTable(fanEl) {
            let table = document.querySelector(`.${TABLE_CLASS}`);
            if (table) {
                return table;
            }
            const rows = document.querySelector(".fans_rows");
            if (rows) {
                rows.style.display = "none";
            }
            table = createLayoutFromString(`<table class="${TABLE_CLASS}"></table>`);
            fanEl.parentElement?.before(table);
            return table;
        }
        function pasteIntoTable(fanEl) {
            const table = getOrCreateTable(fanEl);
            const userID = fanEl.getAttribute("data-id") ?? "";
            const linkEl = fanEl.querySelector(".fans_fan_lnk");
            const name = linkEl?.innerText;
            const pageLink = linkEl?.href || "";
            const imageSrc = (fanEl.querySelector(".AvatarRich__img") ?? fanEl.querySelector(".fans_fan_img"))?.src;
            const bot = findBot(userID);
            const row = createLayoutFromString(`\n    <table>\n      <tbody>\n        <tr>\n          <td class="botnadzor-mono">\n            WILL BE REPLACED TO INDEX\n          </td>\n\n          <td class="botnadzor-mono botnadzor-tac">\n            ${userID}\n          </td>\n\n          <td\n            colspan="${bot ? 0 : 3}"\n          >\n            <div class="botnadzor-name">\n              <div class="botnadzor-avatar">\n                <img\n                  src="${imageSrc}"\n                  height="20"\n                />\n              </div>\n\n              <a\n                href="${pageLink}"\n                target="_blank"\n              >\n                ${name}\n              </a>\n            </div>\n          </td>\n\n          ${bot ? `\n            <td\n              class="botnadzor-tac"\n              style="\n                background: ${di.userSettings.getCustomTypeColor(bot.type.id) || bot.type.serverColor};\n              "\n            >\n              ${bot.mark?.name || bot.type.name || ""}\n            </td>\n\n            <td class="botnadzor-tac">\n              ${bot.type.shouldShowActions ? `\n                <a target='_blank' href='${generateBotnadzorUrl("account", userID)}'>\n                  Комментарии\n                </a>\n\n                <a target='_blank' href='${generateBotnadzorUrl("card", userID)}'>\n                  Карточка\n                </a>\n              ` : ""}\n            </td>\n          ` : ""}\n        </tr>\n      </tbody>\n    </table>\n  `).children[0].children[0];
            const rowWithIdLessThanCurrent = [ ...table.children ].find((rowEl => {
                const rowId = Number(rowEl.children[1]?.innerHTML.replace(/\D/g, ""));
                return rowId < Number(userID);
            }));
            if (rowWithIdLessThanCurrent) {
                rowWithIdLessThanCurrent.before(row);
            } else {
                table.append(row);
            }
            [ ...table.children ].forEach(((rowEl, index) => {
                rowEl.children[0].innerHTML = `${index + 1}.`;
            }));
        }
        function onFanFound(fanEl) {
            if (di.userSettings.state.isFansTableViewEnabled) {
                pasteIntoTable(fanEl);
            } else {
                hightlightFan(fanEl);
            }
        }
        function onFoundMobileFan(fanEl) {
            const userID = fanEl.getAttribute("href")?.substring(1);
            if (!userID) {
                return;
            }
            const bot = findBot(userID);
            if (!bot) {
                return;
            }
            const highlightOverlayEl = createLayoutFromString(`\n    <div class="botnadzor-highlight-overlay"></div>\n  `);
            fanEl.append(highlightOverlayEl);
            fanEl.style.position = "relative";
            di.userSettings.onChangeCustomColor(bot.type.id, (customUserColor => {
                highlightOverlayEl.style.background = customUserColor || bot.type.serverColor;
            }));
            if (bot.type.shouldShowActions) {
                fanEl.appendChild(createLayoutFromString(`\n      <i>\n        <a\n          target="_blank"\n          onclick="event.stopPropagation();"\n          href="${generateBotnadzorUrl("account", userID)}"\n        >\n          Комментарии\n        </a>\n        <a\n          target="_blank"\n          onclick="event.stopPropagation();"\n          href="${generateBotnadzorUrl("card", userID)}}"\n        >\n          Карточка\n        </a>\n      </i>\n    `));
            }
            fanEl.appendChild(createLayoutFromString(`\n    <div class="botnadzor-fan-mark-or-type">\n      (${bot.mark?.name || bot.type.name})\n    </div>\n  `));
        }
        function hexToRGBA(hex, alpha = 1) {
            let r = "0";
            let g = "0";
            let b = "0";
            if (hex.length === 4) {
                r = `0x${hex[1]}${hex[1]}`;
                g = `0x${hex[2]}${hex[2]}`;
                b = `0x${hex[3]}${hex[3]}`;
            } else if (hex.length === 7) {
                r = `0x${hex[1]}${hex[2]}`;
                g = `0x${hex[3]}${hex[4]}`;
                b = `0x${hex[5]}${hex[6]}`;
            }
            return `rgba(${+r},${+g},${+b},${alpha})`;
        }
        function onFoundMobilePost(mobilePostEl) {
            const wiHeadLink = mobilePostEl.querySelector(".wi_head a");
            const postHeaderEl = mobilePostEl.querySelector(".wi_head");
            const postDateContentWrapperEl = mobilePostEl.querySelector(".PostHeader__info");
            const userID = wiHeadLink?.getAttribute("href")?.match(/\/(.+)\?/)?.[1];
            const areaPostFromAuthorEl = mobilePostEl.querySelector(".pi_signed");
            const postFromAuthorEl = areaPostFromAuthorEl?.querySelector(".user");
            const postFromAuthorId = postFromAuthorEl?.getAttribute("href")?.substring(1);
            if (!userID || !postHeaderEl || !postDateContentWrapperEl) {
                return;
            }
            const checkId = postFromAuthorId || userID;
            const bot = findBot(checkId);
            if (!bot) {
                return;
            }
            const selectedHighlightArea = areaPostFromAuthorEl || postHeaderEl;
            selectedHighlightArea.classList.add("botnadzor-post-mobile-header");
            const botnadzorLinks = createLayoutFromString(`\n    <div>\n      <i class="botnadzor-reply-mark-or-type">\n        (${bot.mark?.name || bot.type.name})\n      </i>\n\n      ${bot.type.shouldShowActions ? `\n        <a target='_blank' href='${generateBotnadzorUrl("account", bot.id)}'>\n          Комментарии\n        </a>\n\n        <a target='_blank' href='${generateBotnadzorUrl("card", bot.id)}'>\n          Карточка\n        </a>\n      ` : ""}\n    </div>\n  `);
            if (postFromAuthorEl) {
                postFromAuthorEl.after(botnadzorLinks);
            } else {
                postDateContentWrapperEl.append(botnadzorLinks);
            }
            selectedHighlightArea.classList.add("botnadzor-bot-bg");
            di.userSettings.onChangeCustomColor(bot.type.id, (customUserColor => {
                selectedHighlightArea.style.setProperty("--botDarkColor", hexToRGBA(customUserColor || bot.type.serverColor, .2));
                selectedHighlightArea.style.setProperty("--botLightColor", customUserColor || bot.type.serverColor);
            }));
        }
        async function onFoundMobileProfile() {
            const idOrNickname = document.location.pathname.substring(1);
            const nameEl = document.querySelector(".ProfileInfoName");
            if (!nameEl) {
                return;
            }
            di.registrationDates.fetchRegistrationDate(idOrNickname).then((registrationDate => {
                nameEl?.after(createLayoutFromString(`\n        <div class="botnadzor-profile-registration-date">\n          ${registrationDate}\n        </div>\n      `));
            }));
            const bot = findBot(idOrNickname);
            if (!bot) {
                return;
            }
            const botnadzorLine = createLayoutFromString(`\n    <div class="botnadzor-mt-10 botnadzor-mb-10"></div>\n  `);
            const botMarkChip = createLayoutFromString(`\n    <i class="botnadzor-mark-chip">\n      (${bot.mark?.name || bot.type.name})\n    </i>\n  `);
            const botnadzorLinks = createLayoutFromString(`\n    <center>\n      <div class="botnadzor-chip-placeholder"></div>\n\n      ${bot.type.shouldShowActions ? `\n        <a target='_blank' href='${generateBotnadzorUrl("account", bot.id)}'>\n          Комментарии\n        </a>\n\n        <a target='_blank' href='${generateBotnadzorUrl("card", bot.id)}'>\n          Карточка\n        </a>\n      ` : ""}\n    </center>\n  `);
            const chipPlaceholderEl = botnadzorLinks.querySelector(".botnadzor-chip-placeholder");
            chipPlaceholderEl?.replaceWith(botMarkChip);
            botnadzorLine.append(botnadzorLinks);
            nameEl.after(botnadzorLine);
            di.userSettings.onChangeCustomColor(bot.type.id, (customUserColor => {
                botMarkChip.style.background = customUserColor || bot.type.serverColor;
            }));
        }
        // EXTERNAL MODULE: ../../node_modules/.pnpm/@mdi+svg@7.4.47/node_modules/@mdi/svg/svg/account-box-outline.svg
                var account_box_outline = __webpack_require__(598);
        var account_box_outline_default = __webpack_require__.n(account_box_outline);
        // EXTERNAL MODULE: ../../node_modules/.pnpm/@mdi+svg@7.4.47/node_modules/@mdi/svg/svg/calendar-month-outline.svg
                var calendar_month_outline = __webpack_require__(136);
        var calendar_month_outline_default = __webpack_require__.n(calendar_month_outline);
        // EXTERNAL MODULE: ../../node_modules/.pnpm/@mdi+svg@7.4.47/node_modules/@mdi/svg/svg/information-slab-box-outline.svg
                var information_slab_box_outline = __webpack_require__(188);
        var information_slab_box_outline_default = __webpack_require__.n(information_slab_box_outline);
        // EXTERNAL MODULE: ../../node_modules/.pnpm/@mdi+svg@7.4.47/node_modules/@mdi/svg/svg/list-box-outline.svg
                var list_box_outline = __webpack_require__(707);
        var list_box_outline_default = __webpack_require__.n(list_box_outline);
        function openAdvancedUserInfoModal(userIdOrNickname, replyLink, userName, userAvatar) {
            const modal = document.querySelector(".botnadzor-advanced-menu-modal");
            if (!modal) {
                return;
            }
            modal.style.pointerEvents = "unset";
            modal.style.opacity = "1";
            di.advancedMenuStore.updateMenu({
                userIdOrNickname,
                userName,
                replyLink,
                userAvatar
            });
        }
        function getAbsolutePath(relativePath) {
            const link = document.createElement("img");
            link.src = relativePath;
            return link.src;
        }
        function removeIdPrefix(userIdOrNickName) {
            return userIdOrNickName.match(/^(id)\d+$/) ? userIdOrNickName.replace(/^id/, "") : userIdOrNickName;
        }
        function saveReply(userId, replyLink) {
            if (!di.userSettings.state.isRepliesCollectingEnabled) {
                console.log("Botnadzor: Сбор комментариев отключен в настройках");
                return;
            }
            const matched = replyLink.match(/vk.com\/wall(-?\d+)_(\d+)\?reply=(\d+)/);
            if (!matched) {
                return;
            }
            const [, wallId, postId, replyId] = matched;
            const postLinkEl = document.querySelector(".wi_head a");
            if (!postLinkEl) {
                return;
            }
            const wallSlug = postLinkEl?.getAttribute("href")?.slice(1).split("?")[0];
            di.replyCollector.add({
                wallId,
                postId,
                replyId,
                userId,
                wallSlug,
                repliesCount: 0
            });
        }
        function onFoundMobileReply(replyEl) {
            const replyUserNameEl = replyEl.querySelector(".ReplyItem__name");
            const replyLinkObject = replyEl.querySelector(".item_date");
            const replyLink = replyLinkObject?.getAttribute("href");
            const authorAvatarLink = replyEl.querySelector(".Avatar__image")?.style.backgroundImage.match(/url[(]'(.+)'[)]/);
            const authorName = replyUserNameEl?.innerText;
            const highlightArea = replyEl.querySelector(".ReplyItem__content");
            if (!replyUserNameEl || !highlightArea || !replyLink) {
                return;
            }
            const userID = removeIdPrefix(replyUserNameEl.getAttribute("href").substring(1));
            const isReplyFromGroupAccount = userID.startsWith("-");
            if (isReplyFromGroupAccount) {
                return;
            }
            saveReply(userID, replyLink);
            const registrationDateEl = createLayoutFromString(`\n    <div class="botnadzor-reg-date"></div>\n  `);
            replyUserNameEl.after(registrationDateEl);
            di.registrationDates.onChangeRegistrationDate(userID, (registrationDate => {
                registrationDateEl.innerText = registrationDate || "";
            }));
            const bot = findBot(userID);
            const actionsEl = createLayoutFromString(`\n    <div class="botnadzor-reply-mobile-actions">\n    </div>\n  `);
            const authorAvatarLinkResolved = authorAvatarLink?.[1] ? getAbsolutePath(authorAvatarLink[1]) : "https://vk.com/images/camera_50.png";
            if (bot) {
                const botnadzorLinks = createLayoutFromString(`\n      <div class="botnadzor-mobile-reply-line">\n        <i class="botnadzor-reply-mark-or-type">\n         (${bot.mark?.name || bot.type.name})\n        </i>\n      </div>\n    `);
                replyUserNameEl.after(botnadzorLinks);
                highlightArea.classList.add("botnadzor-reply-content-from-bot");
                highlightArea.classList.add("botnadzor-bot-bg");
                di.userSettings.onChangeCustomColor(bot.type.id, (customUserColor => {
                    highlightArea.style.setProperty("--botDarkColor", hexToRGBA(customUserColor || bot.type.serverColor, .2));
                    highlightArea.style.setProperty("--botLightColor", customUserColor || bot.type.serverColor);
                }));
                if (bot.type.shouldShowActions) {
                    const commentsButtonEl = createLayoutFromString(`\n        <a\n        class="botnadzor-reply-mobile-action"\n        href="${generateBotnadzorUrl("account", userID)}"\n        target="blank"\n        >\n          ${list_box_outline_default()}\n        </a>\n      `);
                    actionsEl.appendChild(commentsButtonEl);
                    const cardButtonEl = createLayoutFromString(`\n        <a\n          class="botnadzor-reply-mobile-action"\n          href="${generateBotnadzorUrl("card", userID)}"\n          target="blank"\n        >\n        ${account_box_outline_default()}\n        </a>\n      `);
                    actionsEl.appendChild(cardButtonEl);
                }
            }
            const advancedMenuButtonEl = createLayoutFromString(`\n    <a\n      class="botnadzor-reply-mobile-action"\n      href="#"\n    >\n      ${information_slab_box_outline_default()}\n    </a>\n  `);
            advancedMenuButtonEl.addEventListener("click", (event => {
                event.preventDefault();
                event.stopPropagation();
                openAdvancedUserInfoModal(userID, replyLink, authorName, authorAvatarLinkResolved);
                event.preventDefault();
            }));
            actionsEl.appendChild(advancedMenuButtonEl);
            const registrationDateButtonEl = createLayoutFromString(`\n    <a class="botnadzor-reply-mobile-action" href="#">\n      ${calendar_month_outline_default()}\n    </a>\n  `);
            registrationDateButtonEl?.addEventListener("click", (event => {
                event.preventDefault();
                event.stopPropagation();
                di.registrationDates.fetchRegistrationDate(userID);
            }));
            actionsEl.appendChild(registrationDateButtonEl);
            replyLinkObject?.after(actionsEl);
            di.registrationDates.onChangeRegistrationDate(userID, (registrationDate => {
                registrationDateEl.innerText = registrationDate || "";
                if (registrationDate) {
                    registrationDateButtonEl.remove();
                }
            }));
        }
        function onFoundMobileRepost(mobilePostEl) {
            const wiHeadLink = mobilePostEl.querySelector(".pic_header a");
            const postHeaderEl = mobilePostEl.querySelector(".pic_header");
            const postHeaderDate = mobilePostEl.querySelector(".pic_desc");
            const userID = wiHeadLink?.getAttribute("class")?.match(/new(\d+)/)?.[1];
            if (!userID || !postHeaderEl || !postHeaderDate) {
                return;
            }
            const bot = findBot(userID);
            if (!bot) {
                return;
            }
            postHeaderEl.classList.add("botnadzor-post-mobile-header");
            const botnadzorLinks = createLayoutFromString(`\n    <div>\n      <i class="botnadzor-reply-mark-or-type">\n        (${bot.mark?.name || bot.type.name})\n      </i>\n\n      ${bot.type.shouldShowActions ? `\n        <a target='_blank' href='${generateBotnadzorUrl("account", bot.id)}'>\n          Комментарии\n        </a>\n\n        <a target='_blank' href='${generateBotnadzorUrl("card", bot.id)}'>\n          Карточка\n        </a>\n      ` : ""}\n    </div>\n  `);
            postHeaderDate.append(botnadzorLinks);
            postHeaderEl.classList.add("botnadzor-bot-bg");
            di.userSettings.onChangeCustomColor(bot.type.id, (customUserColor => {
                postHeaderEl.style.setProperty("--botDarkColor", hexToRGBA(customUserColor || bot.type.serverColor, .2));
                postHeaderEl.style.setProperty("--botLightColor", customUserColor || bot.type.serverColor);
            }));
        }
        function onFriendFound(friendEl) {
            const rawUserID = friendEl.getAttribute("id")?.match(/row(\d+)/)?.[1] ?? "";
            const userID = rawUserID ? Number(rawUserID) : null;
            const titleEl = friendEl.querySelector(".friends_field_title");
            if (!userID || !titleEl) {
                return;
            }
            const bot = findBot(userID);
            if (bot) {
                const botnadzorLine = createLayoutFromString(`\n      <div class='friends_field'></div>\n    `);
                const botMarkChip = createLayoutFromString(`\n      <i class="botnadzor-reply-mark-or-type">\n        (${bot.mark?.name || bot.type.name})\n      </i>\n    `);
                botnadzorLine.append(botMarkChip);
                if (bot.type.shouldShowActions) {
                    const botnadzorLinks = createLayoutFromString(`\n      <span>\n        <a target='_blank' href='${generateBotnadzorUrl("account", userID)}'>\n          Комментарии\n        </a>\n        <a target='_blank' href='${generateBotnadzorUrl("card", userID)}'>\n           Карточка\n        </a>\n        </span>\n      `);
                    botnadzorLine.append(botnadzorLinks);
                }
                titleEl.after(botnadzorLine);
                friendEl.classList.add("botnadzor-bot-bg");
                di.userSettings.onChangeCustomColor(bot.type.id, (customUserColor => {
                    friendEl.style.setProperty("--botDarkColor", hexToRGBA(customUserColor || bot.type.serverColor, .2));
                    friendEl.style.setProperty("--botLightColor", customUserColor || bot.type.serverColor);
                }));
            }
        }
        function onFriendMobileFound(friendEl) {
            const linkUserIdEl = friendEl.querySelector(".Friends__itemBody > a");
            const rawUserID = linkUserIdEl?.getAttribute("class")?.match(/unew(\d+)/)?.[1] ?? "";
            const userID = Number.parseInt(rawUserID, 10);
            if (!Number.isFinite(userID)) {
                return;
            }
            const bot = findBot(userID);
            if (bot) {
                const botnadzorLine = createLayoutFromString(`\n      <div class='botnadzor-reply-mobile-actions'></div>\n    `);
                const botMarkChip = createLayoutFromString(`\n      <i class="botnadzor-mobile-friend-mark-or-type">\n        (${bot.mark?.name || bot.type.name})\n      </i>\n    `);
                botnadzorLine.append(botMarkChip);
                if (bot.type.shouldShowActions) {
                    const commentsButtonEl = createLayoutFromString(`\n        <a\n        class="botnadzor-reply-mobile-friend_action"\n        href="${generateBotnadzorUrl("account", userID)}"\n        target="blank"\n        >\n          ${list_box_outline_default()}\n        </a>\n      `);
                    botnadzorLine.append(commentsButtonEl);
                    const cardButtonEl = createLayoutFromString(`\n        <a\n          class="botnadzor-reply-mobile-friend_action"\n          href="${generateBotnadzorUrl("card", userID)}"\n          target="blank"\n        >\n        ${account_box_outline_default()}\n        </a>\n      `);
                    botnadzorLine.append(cardButtonEl);
                }
                linkUserIdEl?.append(botnadzorLine);
                friendEl.classList.add("botnadzor-bot-bg");
                di.userSettings.onChangeCustomColor(bot.type.id, (customUserColor => {
                    friendEl.style.setProperty("--botDarkColor", hexToRGBA(customUserColor || bot.type.serverColor, .2));
                    friendEl.style.setProperty("--botLightColor", customUserColor || bot.type.serverColor);
                }));
            }
        }
        function onLikeFound(likeEl) {
            const userID = likeEl.getAttribute("href").substring(1);
            const bot = findBot(userID);
            if (!bot) {
                return;
            }
            const userAvatarEl = likeEl.querySelector(".like_tt_image");
            if (!userAvatarEl) {
                return;
            }
            userAvatarEl.style.opacity = "0.5";
            const highlightOverlayEl = createLayoutFromString(`\n    <div class="botnadzor-highlight-overlay"></div>\n  `);
            likeEl.style.position = "relative";
            likeEl.append(highlightOverlayEl);
            di.userSettings.onChangeCustomColor(bot.type.id, (customUserColor => {
                likeEl.style.background = customUserColor || bot.type.serverColor;
            }));
        }
        function onMentionTTFound(mentionEl) {
            const mentionTTName = mentionEl.querySelector(".mention_tt_name");
            if (!mentionTTName) {
                return;
            }
            const userID = mentionTTName.getAttribute("href").substring(1);
            const bot = findBot(userID);
            if (!bot) {
                return;
            }
            const mentionTTTitle = mentionEl.querySelector(".mention_tt_title");
            if (!mentionTTTitle) {
                return;
            }
            mentionTTTitle.classList.add("botnadzor-bot-bg");
            di.userSettings.onChangeCustomColor(bot.type.id, (customUserColor => {
                mentionTTTitle.style.setProperty("--botDarkColor", hexToRGBA(customUserColor || bot.type.serverColor, .2));
                mentionTTTitle.style.setProperty("--botLightColor", customUserColor || bot.type.serverColor);
            }));
            const markEl = createLayoutFromString(`\n    <i>\n      (${bot.mark?.name || bot.type.name})\n    </i>\n  `);
            mentionTTTitle.after(markEl);
            markEl.after(createLayoutFromString(`\n      <i>\n          <a target='_blank' href='${generateBotnadzorUrl("account", userID)}'>\n              Комментарии\n          </a>\n          <a target='_blank' href='${generateBotnadzorUrl("card", userID)}'>\n              Карточка\n          </a>\n      </i>\n    `));
        }
        function onNewDesignPostFound(postEl) {
            const fullPostId = postEl?.getAttribute("data-post-id");
            const [authorId, postId] = fullPostId?.split("_") ?? [];
            const postHeaderEl = postEl.querySelector(".PostHeader");
            const postHeaderTitleEl = postEl.querySelector(".PostHeaderTitle");
            const postFromAuthorEl = postEl.querySelector(".PostHeaderSubtitle > .PostHeaderSubtitle__item");
            const postFromAuthorId = postFromAuthorEl?.getAttribute("href")?.match(/vk.com\/(.+)/)?.[1];
            if (!authorId || !postId || !postHeaderTitleEl || !postHeaderEl) {
                return;
            }
            const checkId = postFromAuthorId || authorId;
            const bot = findBot(checkId);
            if (bot) {
                postHeaderEl.classList.add("botnadzor-post-header");
                const botMarkChip = createLayoutFromString(`\n      <i class="botnadzor-reply-mark-or-type">\n        (${bot.mark?.name || bot.type.name})\n      </i>\n    `);
                const botnadzorLinks = createLayoutFromString(`\n      <span>\n        ${botMarkChip.outerHTML}\n\n        ${bot.type.shouldShowActions ? `\n          <a target='_blank' href='${generateBotnadzorUrl("account", bot.id)}'>\n            Комментарии\n          </a>\n\n          <a target='_blank' href='${generateBotnadzorUrl("card", bot.id)}'>\n            Карточка\n          </a>\n        ` : ""}\n      </span>\n    `);
                if (postFromAuthorEl) {
                    postFromAuthorEl.parentElement?.after(botnadzorLinks);
                } else {
                    postHeaderTitleEl.append(botnadzorLinks);
                }
                postHeaderEl.classList.add("botnadzor-bot-bg");
                di.userSettings.onChangeCustomColor(bot.type.id, (customUserColor => {
                    postHeaderEl.style.setProperty("--botDarkColor", hexToRGBA(customUserColor || bot.type.serverColor, .2));
                    postHeaderEl.style.setProperty("--botLightColor", customUserColor || bot.type.serverColor);
                }));
            }
        }
        function onOldDesignPostFound(postEl) {
            const authorLinkEl = postEl.querySelector('a[data-post-click-type="post_owner_link"]');
            const authorId = authorLinkEl?.getAttribute("data-from-id");
            const postAuthorLineEl = postEl.querySelector(".PostHeader .post_author");
            const postHeaderEl = postEl.querySelector(".PostHeader");
            if (!authorLinkEl || !authorId || !postAuthorLineEl || !postHeaderEl) {
                return;
            }
            const bot = findBot(authorId);
            if (bot) {
                postHeaderEl.classList.add("botnadzor-post-header");
                const botnadzorLine = createLayoutFromString(`\n      <div class="botnadzor-post-line-old-design"></div>\n    `);
                const botMarkChip = createLayoutFromString(`\n      <i class="botnadzor-reply-mark-or-type">\n        (${bot.mark?.name || bot.type.name})\n      </i>\n    `);
                const botnadzorLinks = createLayoutFromString(`\n      <i>\n        ${botMarkChip.outerHTML}\n\n        <a target='_blank' href='${generateBotnadzorUrl("account", authorId)}'>\n            Комментарии\n        </a>\n        <a target='_blank' href='${generateBotnadzorUrl("card", authorId)}'>\n            Карточка\n        </a>\n      </i>\n    `);
                if (bot.type.shouldShowActions) {
                    botnadzorLine.append(botnadzorLinks);
                }
                authorLinkEl.after(botnadzorLine);
                postHeaderEl.classList.add("botnadzor-bot-bg");
                di.userSettings.onChangeCustomColor(bot.type.id, (customUserColor => {
                    postHeaderEl.style.setProperty("--botDarkColor", hexToRGBA(customUserColor || bot.type.serverColor, .2));
                    postHeaderEl.style.setProperty("--botLightColor", customUserColor || bot.type.serverColor);
                }));
            }
        }
        function onPostFound(postEl) {
            if (postEl.classList.contains("Post--redesign")) {
                onNewDesignPostFound(postEl);
            } else {
                onOldDesignPostFound(postEl);
            }
        }
        function onProfileFound(pageNameEl) {
            const idOrNickname = (() => {
                const splits = location.href.split("/");
                return splits[splits.length - 1];
            })();
            if (!idOrNickname) {
                return;
            }
            di.registrationDates.fetchRegistrationDate(idOrNickname).then((registrationDate => {
                pageNameEl?.after(createLayoutFromString(`\n        <div class="botnadzor-profile-registration-date">\n          ${registrationDate}\n        </div>\n      `));
            }));
            const bot = findBot(idOrNickname);
            if (bot) {
                const botnadzorLine = createLayoutFromString(`\n      <div class="botnadzor-profile-line"></div>\n    `);
                const botMarkChip = createLayoutFromString(`\n      <i class="botnadzor-mark-chip">\n        (${bot.mark?.name || bot.type.name})\n      </i>\n    `);
                const botnadzorLinks = createLayoutFromString(`\n      <i>\n        <a target='_blank' href='${generateBotnadzorUrl("account", idOrNickname)}'>\n            Комментарии\n        </a>\n        <a target='_blank' href='${generateBotnadzorUrl("card", idOrNickname)}'>\n            Карточка\n        </a>\n      </i>\n    `);
                botnadzorLine.append(botMarkChip);
                if (bot.type.shouldShowActions) {
                    botnadzorLine.append(botnadzorLinks);
                }
                pageNameEl.after(botnadzorLine);
                di.userSettings.onChangeCustomColor(bot.type.id, (customUserColor => {
                    botMarkChip.style.background = customUserColor || bot.type.serverColor;
                }));
            }
        }
        // EXTERNAL MODULE: ../../node_modules/.pnpm/@mdi+svg@7.4.47/node_modules/@mdi/svg/svg/account-arrow-left-outline.svg
                var account_arrow_left_outline = __webpack_require__(802);
        var account_arrow_left_outline_default = __webpack_require__.n(account_arrow_left_outline);
        function getIdFromReply(replyEl) {
            const authorLinkEl = replyEl.querySelector("a.author");
            const userID = authorLinkEl?.getAttribute("data-from-id") || undefined;
            return userID;
        }
        function findIdOfAuthorOfParentReply(formEl) {
            const potentialReply = formEl?.parentElement?.parentElement?.parentElement?.parentElement?.previousElementSibling;
            if (!potentialReply?.classList.contains("reply")) {
                return undefined;
            }
            return getIdFromReply(potentialReply);
        }
        function findIdOfAuthorFromTitle(formEl) {
            const replyId = formEl.querySelector(".reply_to_mem")?.getAttribute("onclick")?.match(/wall\.showReply\(this, '(.*)', '(.*)'/)?.[2];
            const replyEl = document.querySelector(`#post${replyId}`);
            if (!replyEl) {
                return undefined;
            }
            return getIdFromReply(replyEl);
        }
        function getWhoIReplyToId(formEl) {
            return findIdOfAuthorFromTitle(formEl) || findIdOfAuthorOfParentReply(formEl);
        }
        function onReplyFormFound(formEl) {
            const replyToEl = formEl.querySelector('input[type="hidden"]');
            const buttonsWrapperEl = formEl.querySelector(".reply_field_wrap");
            const fieldEl = formEl.querySelector(".submit_post_field");
            if (!replyToEl || !buttonsWrapperEl || !fieldEl) {
                return;
            }
            const attachBotAccountBtn = createLayoutFromString(`\n    <button\n      class="botnadzor-reply-form-btn"\n      style="\n        display: none;\n      "\n      data-title="Вы отвечаете боту, добавить его карточку?"\n      onmouseover="\n        showTitle(this, undefined, undefined, {noZIndex: true});\n      "\n    >\n      ${account_arrow_left_outline_default()}\n    </button>\n  `);
            buttonsWrapperEl.append(attachBotAccountBtn);
            let bot = null;
            const sleep = () => new Promise((resolve => {
                setTimeout(resolve);
            }));
            attachBotAccountBtn.addEventListener("click", (async () => {
                if (!bot) {
                    return;
                }
                attachBotAccountBtn.style.display = "none";
                const cardLink = generateBotnadzorUrl("card", bot.id);
                const event = new ClipboardEvent("paste", {
                    clipboardData: new DataTransfer
                });
                event.clipboardData.setData("text/plain", ` ${cardLink} `);
                fieldEl.dispatchEvent(event);
                await sleep();
                [ ...fieldEl.childNodes ].forEach((node => {
                    if (node.nodeValue) {
                        node.nodeValue = node.nodeValue.replace(cardLink, "").replace("  ", "");
                    }
                }));
                fieldEl.focus();
                await sleep();
                const range = document.createRange();
                const selection = window.getSelection();
                const textNode = fieldEl.childNodes[fieldEl.childNodes.length - 1];
                range.setStart(textNode, textNode.length);
                range.setEnd(textNode, textNode.length);
                selection?.removeAllRanges();
                selection?.addRange(range);
            }));
            let interval = -1;
            let prevUserID = "";
            const init = () => {
                if (!document.body.contains(formEl)) {
                    clearInterval(interval);
                    return;
                }
                const userID = getWhoIReplyToId(formEl);
                if (!userID || userID === prevUserID) {
                    return;
                }
                prevUserID = userID;
                bot = findBot(userID);
                if (!bot) {
                    attachBotAccountBtn.style.display = "none";
                    return;
                }
                attachBotAccountBtn.style.display = "block";
            };
            init();
            interval = setInterval(init, 500);
        }
        function highlightReplyFromBot({replyEl, bot, authorLinkEl}) {
            const botMarkChip = createLayoutFromString(`\n    <i class="botnadzor-reply-mark-or-type">\n      (${bot.mark?.name || bot.type.name})\n    </i>\n  `);
            const replyContent = replyEl.querySelector(".reply_content");
            if (!replyContent) {
                console.error("Botnadzor: Ошибка 42");
                return;
            }
            authorLinkEl.after(botMarkChip);
            replyContent.classList.add("botnadzor-reply-content-from-bot");
            replyContent.classList.add("botnadzor-bot-bg");
            di.userSettings.onChangeCustomColor(bot.type.id, (customUserColor => {
                replyContent.style.setProperty("--botDarkColor", hexToRGBA(customUserColor || bot.type.serverColor, .2));
                replyContent.style.setProperty("--botLightColor", customUserColor || bot.type.serverColor);
            }));
        }
        function findParentBySelector(el, selector) {
            let found = null;
            while (el) {
                if (el.matches(selector)) {
                    found = el;
                    break;
                }
                el = el.parentElement;
            }
            return found;
        }
        function save_reply_saveReply(replyEl, userId, replyLink) {
            if (!di.userSettings.state.isRepliesCollectingEnabled) {
                console.log("Botnadzor: Сбор комментариев отключен в настройках");
                return;
            }
            const matched = replyLink.match(/https:\/\/vk.com\/wall(-?\d+)_(\d+)\?reply=(\d+)/);
            if (!matched) {
                return;
            }
            const [, wallId, postId, replyId] = matched;
            const postEl = findParentBySelector(replyEl, ".post");
            if (!postEl) {
                return;
            }
            const repliesBtnEl = postEl?.querySelector("[data-like-button-type=comment]");
            const repliesCountAttr = repliesBtnEl?.getAttribute("data-count");
            const repliesCount = Number(repliesCountAttr);
            const authorLinkEl = postEl.querySelector('a[data-post-click-type="post_owner_link"]');
            const wallSlug = authorLinkEl?.getAttribute("href")?.slice(1);
            di.replyCollector.add({
                wallId,
                postId,
                replyId,
                userId,
                wallSlug,
                repliesCount
            });
        }
        function createReplyButton({icon, title, onclick = "", href = "#"}) {
            const isDefaultHref = href === "#";
            const wrapper = createLayoutFromString(`\n    <a\n      class="botnadzor-reply-action"\n      href="${href}"\n      ${isDefaultHref ? "" : 'target="blank"'}\n      data-title="${title}"\n      onclick="${onclick}"\n      onmouseover="\n        showTitle(this, undefined, undefined, {noZIndex: true});\n      "\n    >\n      ${icon}\n    </a>\n  `);
            return wrapper;
        }
        function onReplyFound(replyEl) {
            const authorLinkEl = replyEl.querySelector("a.author");
            const userID = authorLinkEl?.getAttribute("data-from-id");
            const replyAuthorEl = replyEl.querySelector(".reply_author");
            const lastActionLinkEL = replyEl.querySelector(".reply_link_wrap:last-child");
            const replyLink = replyEl.querySelector(".wd_lnk")?.getAttribute("href");
            const replyFooter = replyEl.querySelector(".reply_footer");
            const authorAvatarLink = replyEl.querySelector(".AvatarRich__img")?.src;
            const authorName = authorLinkEl?.innerText;
            if (!authorLinkEl || !userID || !replyAuthorEl || !authorName || !replyLink) {
                return;
            }
            const isReplyFromGroupAccount = userID.startsWith("-");
            if (isReplyFromGroupAccount) {
                return;
            }
            save_reply_saveReply(replyEl, userID, replyLink);
            const actionsEl = createLayoutFromString(`\n    <div class="botnadzor-reply-actions">\n    </div>\n  `);
            const bot = findBot(userID);
            if (bot) {
                highlightReplyFromBot({
                    replyEl,
                    bot,
                    authorLinkEl
                });
                if (bot.type.shouldShowActions) {
                    const commentsButtonEl = createReplyButton({
                        icon: list_box_outline_default(),
                        title: "Комментарии",
                        href: generateBotnadzorUrl("account", userID)
                    });
                    actionsEl.appendChild(commentsButtonEl);
                    const cardButtonEl = createReplyButton({
                        icon: account_box_outline_default(),
                        title: "Карточка",
                        href: generateBotnadzorUrl("card", userID)
                    });
                    actionsEl.appendChild(cardButtonEl);
                }
            }
            const advancedMenuButtonEl = createReplyButton({
                icon: information_slab_box_outline_default(),
                title: "Инспектор"
            });
            advancedMenuButtonEl.addEventListener("click", (event => {
                event.preventDefault();
                openAdvancedUserInfoModal(userID, replyLink, authorName, authorAvatarLink);
            }));
            actionsEl.appendChild(advancedMenuButtonEl);
            const registrationDateButtonEl = createReplyButton({
                icon: calendar_month_outline_default(),
                title: "Дата регистрации"
            });
            registrationDateButtonEl.addEventListener("click", (event => {
                event.preventDefault();
                di.registrationDates.fetchRegistrationDate(userID);
            }));
            actionsEl.appendChild(registrationDateButtonEl);
            if (lastActionLinkEL) {
                lastActionLinkEL.after(actionsEl);
            } else if (replyFooter) {
                replyFooter.append(actionsEl);
            }
            const registrationDateEl = createLayoutFromString(`\n    <div></div>\n  `);
            replyAuthorEl.append(registrationDateEl);
            di.registrationDates.onChangeRegistrationDate(userID, (registrationDate => {
                registrationDateEl.innerText = registrationDate || "";
                if (registrationDate) {
                    registrationDateButtonEl.remove();
                }
            }));
        }
        function on_repost_found_onNewDesignPostFound(postEl) {
            const fullPostId = postEl.querySelector(".published_by_date")?.getAttribute("href");
            const [authorId, postId] = fullPostId?.match(/(-?\d+_\d+)/)?.[0]?.split("_") ?? [];
            const postHeaderEl = postEl.querySelector(".copy_post_header");
            const postHeaderTitleEl = postEl.querySelector(".copy_post_author");
            const postSignedEl = postEl.querySelector(".wall_signed");
            const postSignedAuthorEl = postEl.querySelector(".wall_signed_by");
            const postSignedAuthorID = postSignedAuthorEl?.getAttribute("mention_id")?.match(/id(\d+)/)?.[0];
            if (!authorId || !postId || !postHeaderTitleEl || !postHeaderEl) {
                return;
            }
            const bot = postSignedAuthorID ? findBot(postSignedAuthorID) : findBot(authorId);
            if (bot) {
                if (!postSignedAuthorEl) {
                    postHeaderEl.classList.add("botnadzor-post-header");
                }
                const botMarkChip = createLayoutFromString(`\n      <i class="botnadzor-reply-mark-or-type">\n        (${bot.mark?.name || bot.type.name})\n      </i>\n    `);
                const botnadzorLinks = createLayoutFromString(`\n      <span>\n        ${botMarkChip.outerHTML}\n\n        ${bot.type.shouldShowActions ? `\n          <a target='_blank' href='${generateBotnadzorUrl("account", bot.id)}'>\n            Комментарии\n          </a>\n\n          <a target='_blank' href='${generateBotnadzorUrl("card", bot.id)}'>\n            Карточка\n          </a>\n        ` : ""}\n      </span>\n    `);
                if (postSignedEl) {
                    postSignedEl.append(botnadzorLinks);
                } else {
                    postHeaderTitleEl.append(botnadzorLinks);
                }
                di.userSettings.onChangeCustomColor(bot.type.id, (customUserColor => {
                    if (postSignedEl) {
                        postSignedEl.classList.add("botnadzor-bot-bg");
                        postSignedEl.style.setProperty("--botDarkColor", hexToRGBA(customUserColor || bot.type.serverColor, .2));
                        postSignedEl.style.setProperty("--botLightColor", customUserColor || bot.type.serverColor);
                    } else {
                        postHeaderEl.classList.add("botnadzor-bot-bg");
                        postHeaderEl.style.setProperty("--botDarkColor", hexToRGBA(customUserColor || bot.type.serverColor, .2));
                        postHeaderEl.style.setProperty("--botLightColor", customUserColor || bot.type.serverColor);
                    }
                }));
            }
        }
        function injectAdvancedUserInfoModal() {
            const modalEl = createLayoutFromString(`\n    <div\n      class="botnadzor-advanced-menu-modal"\n      style="\n        pointer-events: none;\n        opacity: 0;\n      "\n    >\n      <div class="botnadzor-advanced-menu-modal-clickout-listener"></div>\n\n      <div class="botnadzor-advanced-menu-modal-content">\n        <div class="botnadzor-advanced-menu-modal-content-mount"></div>\n        <div\n          class="botnadzor-advanced-menu-modal-close"\n          aria-label="Закрыть"\n          tabindex="0"\n          role="button"\n        >\n          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="https://www.w3.org/2000/svg">\n            <g id="cancel_24__Page-2" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n                <g id="cancel_24__cancel_24">\n                  <path d="M0 0h24v24H0z"></path>\n                  <path d="M18.3 5.7a.99.99 0 00-1.4 0L12 10.6 7.1 5.7a.99.99 0 00-1.4 1.4l4.9 4.9-4.9 4.9a.99.99 0 001.4 1.4l4.9-4.9 4.9 4.9a.99.99 0 001.4-1.4L13.4 12l4.9-4.9a.99.99 0 000-1.4z" id="cancel_24__Mask" fill="currentColor">\n                  </path>\n                </g>\n            </g>\n          </svg>\n        </div>\n      </div>\n    </div>\n  `);
            const contentMountEl = modalEl.querySelector(".botnadzor-advanced-menu-modal-content-mount");
            const iframeEl = createLayoutFromString(`\n    <iframe\n      src="${"MISSING_ENV_VAR".ADVANCED_MENU_IFRAME_SRC || `${di.host}/script/AdvMenu/`}"\n      width="100%"\n      height="100%"\n      frameBorder="0"\n      class="\n        botnadzor-menu-wrapper\n      "\n    ></iframe>\n  `);
            const permissionDeniedEl = createLayoutFromString(`\n    <div class="botnadzor-advanced-menu-modal-permissions-denied">\n      <div class="botnadzor-advanced-menu-modal-permissions-denied-title-wrap">\n        <div class="botnadzor-advanced-menu-modal-permissions-denied-title">\n          Ботнадзор — Инспектор\n        </div>\n      </div>\n      <div class="botnadzor-advanced-menu-modal-permissions-denied-description">\n        Чтобы открыть <a target="_blank" href="${di.host}/docs/metabot-inspector">инспектор</a>, необходимо иметь код и специальный уровень доступа, которые вы можете получить через нашего бота в&nbsp;Телеграме: <a target="_blank" href="https://t.me/botnadzor_org_bot">t.me/botnadzor_org_bot</a>.\n        <br><br>\n        Код необходимо ввести <a class="botnadzor-advanced-menu-modal-settings-link">в&nbsp;настройках&nbsp;скрипта</a>.\n      </div>\n    </div>\n  `);
            document.body.appendChild(modalEl);
            di.advancedMenuStore.saveModalElement(iframeEl);
            const clickoutListenerEl = modalEl.querySelector(".botnadzor-advanced-menu-modal-clickout-listener");
            const closeBtnEL = modalEl.querySelector(".botnadzor-advanced-menu-modal-close");
            function close() {
                modalEl.style.pointerEvents = "none";
                modalEl.style.opacity = "0";
            }
            clickoutListenerEl?.addEventListener("click", close);
            closeBtnEL?.addEventListener("click", close);
            const settingsLinkEl = permissionDeniedEl.querySelector(".botnadzor-advanced-menu-modal-settings-link");
            settingsLinkEl?.addEventListener("click", (() => {
                close();
                openSettingsModal();
            }));
            di.tokenStore.onStateUpdate((({permissions}) => {
                if (!contentMountEl || !iframeEl || !permissionDeniedEl) {
                    return;
                }
                if (permissions.includes(ETokenPermissions.CAN_OPEN_ADVANCED_MENU)) {
                    permissionDeniedEl.remove();
                    contentMountEl.appendChild(iframeEl);
                } else {
                    iframeEl.remove();
                    contentMountEl.appendChild(permissionDeniedEl);
                }
            }));
        }
        function injectNotifications() {
            if (!di.config.state.message) {
                return;
            }
            const lastClosedNotificationUnix = gm_utils.getStorageValue("gosvonLastClosedNotificationUnix") || 0;
            if (lastClosedNotificationUnix && lastClosedNotificationUnix >= di.config.state.message.unix) {
                return;
            }
            const notificationsEl = createLayoutFromString(`\n    <div class="botnadzor-notification">\n      <div class="botnadzor-notification-logo">\n        Скрипт подсветки Ботнадзор\n      </div>\n\n      <div class="botnadzor-notification-close">&times;</div>\n\n      <div class="botnadzor-notification-title">\n        ${di.config.state.message.header}\n      </div>\n\n      <div class="botnadzor-notification-text">\n        ${di.config.state.message.text}\n      </div>\n    </div>\n  `);
            const closeBtn = notificationsEl.querySelector(".botnadzor-notification-close");
            const close = () => {
                notificationsEl?.remove();
                gm_utils.setStorageValue("gosvonLastClosedNotificationUnix", di.config.state.message?.unix);
            };
            closeBtn?.addEventListener("click", close);
            setTimeout(close, 6e4);
            document.body.appendChild(notificationsEl);
        }
        // EXTERNAL MODULE: ../../node_modules/.pnpm/@mdi+svg@7.4.47/node_modules/@mdi/svg/svg/eye-outline.svg
                var eye_outline = __webpack_require__(420);
        var eye_outline_default = __webpack_require__.n(eye_outline);
        // EXTERNAL MODULE: ../../node_modules/.pnpm/@mdi+svg@7.4.47/node_modules/@mdi/svg/svg/information.svg
                var information = __webpack_require__(852);
        var information_default = __webpack_require__.n(information);
        function clearToken() {
            const tokenField = document.querySelector(".botnadzor-token-field");
            if (tokenField) {
                tokenField.value = "";
            }
            di.tokenStore.clearToken();
        }
        function closeSettingsModal() {
            const modal = document.querySelector(".botnadzor-js-settings-modal");
            if (!modal) {
                return;
            }
            modal.style.display = "none";
        }
        function isMobile() {
            return !!document.location.host.match("m.vk.com");
        }
        function changeBotFilterEnabledState(filterId, input, filterType) {
            const isEnabled = input.checked;
            if (filterType === "mark") {
                if (isEnabled) {
                    di.userSettings.enableMark(filterId);
                } else {
                    di.userSettings.disableMark(filterId);
                }
            }
            if (filterType === "type") {
                const typeId = Number(filterId);
                if (isEnabled) {
                    di.userSettings.enableType(typeId);
                } else {
                    di.userSettings.disableType(typeId);
                }
            }
        }
        function getMarksIdsUniquePrefixes() {
            return [ ...new Set(di.config.state.marks.map((markItem => markItem.id.substring(0, 2)))) ];
        }
        function splitMarksToGroups() {
            const marksIdsUniquePrefixes = getMarksIdsUniquePrefixes();
            return marksIdsUniquePrefixes.map((idPrefixItem => di.config.state.marks.filter((markItem => markItem.id.substring(0, 2) === idPrefixItem))));
        }
        function createMarksCheckboxes() {
            const marksGroups = splitMarksToGroups();
            const botCountsByMarkId = di.botCounter.state.marks;
            return marksGroups.reduce(((groupsAcc, marks, marksGroupIndex) => {
                const marksGroupCheckboxes = marks.reduce(((acc, mark) => {
                    const isEnabled = !di.userSettings.checkIsMarkDisabled(mark.id);
                    const newEl = createLayoutFromString(`\n        <label class="botnadzor-mb-10 botnadzor-checkbox">\n          <input\n            type="checkbox"\n            class="botnadzor-js-mark-checkbox"\n            ${isEnabled ? "checked" : ""}\n          />\n          <div class="botnadzor-checkbox-view"></div>\n          <div>\n            ${mark.name} (${botCountsByMarkId[mark.id]})\n          </div>\n        </label>\n      `);
                    const inputEl = newEl.querySelector(".botnadzor-js-mark-checkbox");
                    inputEl?.addEventListener("change", (e => {
                        changeBotFilterEnabledState(String(mark.id), e.target, "mark");
                    }));
                    return [ ...acc, newEl ];
                }), []);
                const newGroupEl = createLayoutFromString(`\n      <div\n        ${marksGroupIndex > 0 ? 'class="botnadzor-mt-40"' : ""}\n      >\n      </div>\n    `);
                marksGroupCheckboxes.forEach((checkbox => {
                    newGroupEl.appendChild(checkbox);
                }));
                return [ ...groupsAcc, newGroupEl ];
            }), []);
        }
        function createTypesCheckboxes() {
            return di.config.state.types.reduce(((acc, type) => {
                const isEnabled = !di.userSettings.checkIsTypeDisabled(type.id);
                const customUserColor = di.userSettings.getCustomTypeColor(type.id);
                const botCountsByTypeId = di.botCounter.state.types;
                const newEl = createLayoutFromString(`\n      <div class="botnadzor-type-checkbox">\n        <label class="botnadzor-checkbox">\n          <input\n            type="checkbox"\n            class="botnadzor-js-type-checkbox"\n            ${isEnabled ? "checked" : ""}\n            ${!type.switchable ? "disabled" : ""}\n          />\n          <div class="botnadzor-checkbox-view"></div>\n          <div class="botnadzor-type-name">\n            ${type.name} (${botCountsByTypeId[type.id]})\n          </div>\n        </label>\n\n        <label>\n          <input\n            id="botTypeColorInput_${type.id}"\n            type="color"\n            value="${customUserColor || type.serverColor}"\n            class="botnadzor-type-color"\n          />\n        </label>\n\n        <button\n          class="botnadzor-reset-color-btn"\n          onclick="\n            document.getElementById('botTypeColorInput_${type.id}').value = '${type.serverColor}'\n          "\n        >\n          &times;\n        </button>\n      </div>\n  `);
                const resetColorBtn = newEl.querySelector(".botnadzor-reset-color-btn");
                resetColorBtn?.addEventListener("click", (() => {
                    di.userSettings.removeCustomTypeColor(type.id);
                }));
                const inputEl = newEl.querySelector(".botnadzor-js-type-checkbox");
                inputEl?.addEventListener("change", (e => {
                    changeBotFilterEnabledState(String(type.id), e.target, "type");
                }));
                const colorInputEl = newEl.querySelector(".botnadzor-type-color");
                colorInputEl?.addEventListener("input", (e => {
                    di.userSettings.setCustomTypeColor(type.id, e.target.value);
                }));
                return [ ...acc, newEl ];
            }), []);
        }
        function injectSettingsModal() {
            const modalEl = createLayoutFromString(`\n    <div\n        class="\n            botnadzor-settings-modal\n            ${isMobile() ? "botnadzor-settings-modal-mobile" : ""}\n            botnadzor-js-settings-modal\n        "\n        style="display: none;"\n    >\n        <div class="botnadzor-settings-container">\n            <div class="botnadzor-settings-modal-title-wrap">\n                <div\n                    class="botnadzor-settings-modal-close"\n                    aria-label="Закрыть"\n                    tabindex="0"\n                    role="button"\n                >\n                    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="https://www.w3.org/2000/svg">\n                        <g id="cancel_24__Page-2" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n                            <g id="cancel_24__cancel_24">\n                                <path id="cancel_24__Bounds" d="M0 0h24v24H0z">\n                                </path>\n                                <path d="M18.3 5.7a.99.99 0 00-1.4 0L12 10.6 7.1 5.7a.99.99 0 00-1.4 1.4l4.9 4.9-4.9 4.9a.99.99 0 001.4 1.4l4.9-4.9 4.9 4.9a.99.99 0 001.4-1.4L13.4 12l4.9-4.9a.99.99 0 000-1.4z" id="cancel_24__Mask" fill="currentColor">\n                                </path>\n                            </g>\n                        </g>\n                    </svg>\n                </div>\n\n                <div class="botnadzor-settings-modal-title">\n                    Ботнадзор — Настройки\n                </div>\n            </div>\n\n            <div class="botnadzor-settings-content">\n                <div class="botnadzor-token-field-wrapper">\n                    <div class="botnadzor-token-line">\n                        <div class="botnadzor-token-form-line">\n                            <div class="botnadzor-token-input-line">\n                                <form>\n                                    <input\n                                        placeholder="Код доступа"\n                                        type="text"\n                                        type="password"\n                                        value="${di.tokenStore.state.userToken || ""}"\n                                        class="botnadzor-token-field"\n                                    />\n                                </form>\n                                <button class="botnadzor-token-show-btn botnadzor-token-btn">\n                                  ${eye_outline_default()}\n                                </button>\n                                <button class="botnadzor-token-clear-btn botnadzor-token-btn">\n                                    &times;\n                                </button>\n                            </div>\n\n                            <button class="botnadzor-token-check-btn">\n                                Установить код\n                            </button>\n                        </div>\n\n                        <div class="botnadzor-token-info"></div>\n                    </div>\n\n                    <div class="botnadzor-token-error"></div>\n\n                    <div class="botnadzor-token-description">\n                        Код доступа вы можете получить через нашего бота в телеграме\n                        <a target="_blank" href="https://t.me/botnadzor_org_bot">t.me/botnadzor_org_bot</a>.\n                        Дополнительные уровни доступа можно получить при подписке\n                        на регулярную поддержку проекта,\n                        а также другими способами\n                    </div>\n                </div>\n\n                <div class="botnadzor-flex botnadzor-flex-wrap botnadzor-mb-30">\n\n                    <div class="botnadzor-settings-modal-hidden-mobile botnadzor-mr-20">\n                        <label class="botnadzor-checkbox">\n                            <input\n                                type="checkbox"\n                                ${di.userSettings.state.isFansTableViewEnabled ? "checked" : ""}\n                                class="botnadzor-js-fans-table-view-checkbox"\n                            />\n\n                            <div class="botnadzor-checkbox-view"></div>\n\n                            <div>\n                                Табличный вид лайков в окне\n                            </div>\n                        </label>\n                    </div>\n\n                    <div>\n                        <label class="botnadzor-checkbox">\n                            <input\n                                type="checkbox"\n                                class="botnadzor-js-replies-collecting-checkbox"\n                                ${!di.tokenStore.state.userToken ? "disabled" : ""}\n                                ${di.userSettings.state.isRepliesCollectingEnabled && di.tokenStore.state.userToken ? "checked" : ""}\n                            />\n\n                            <div class="botnadzor-checkbox-view botnadzor-js-replies-collecting-checkbox-view"></div>\n\n                            <div>\n                                Сбор и отправка комментаторов\n                            </div>\n\n                            <a\n                                class="botnadzor-replies-collecting-description"\n                                target="_blank"\n                                href="${di.host}/docs#replies-collecting"\n                            >\n                                ${information_default()}\n                            </a>\n                        </label>\n                    </div>\n\n                </div>\n\n                <div class="botnadzor-settings-modal-checkboxes">\n\n                    <div class="botnadzor-settings-modal-types">\n                    </div>\n\n                    <div class="botnadzor-settings-modal-marks">\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n  `);
            const tokenField = modalEl.querySelector(".botnadzor-token-field");
            const checkTokenBtnEl = modalEl.querySelector(".botnadzor-token-check-btn");
            const checkTokenErrorEl = modalEl.querySelector(".botnadzor-token-error");
            const checkTokenInfoEl = modalEl.querySelector(".botnadzor-token-info");
            const repliesCollectingCheckbox = modalEl.querySelector(".botnadzor-js-replies-collecting-checkbox");
            const repliesCollectingCheckboxView = modalEl.querySelector(".botnadzor-js-replies-collecting-checkbox-view");
            const closeBtnEl = modalEl.querySelector(".botnadzor-settings-modal-close");
            const typesWrapper = modalEl.querySelector(".botnadzor-settings-modal-types");
            const marksWrapper = modalEl.querySelector(".botnadzor-settings-modal-marks");
            const tokenShowBtn = modalEl.querySelector(".botnadzor-token-show-btn");
            const tableCheckbox = modalEl.querySelector(".botnadzor-js-fans-table-view-checkbox");
            const clearTokenBtn = modalEl.querySelector(".botnadzor-token-clear-btn");
            clearTokenBtn.addEventListener("click", clearToken);
            checkTokenBtnEl.addEventListener("click", (() => {
                di.tokenStore.checkToken();
            }));
            repliesCollectingCheckbox.addEventListener("change", (() => {
                di.userSettings.setIsRepliesCollectingEnabled(repliesCollectingCheckbox.checked);
            }));
            tableCheckbox.addEventListener("change", (() => {
                di.userSettings.setIsFansTableViewEnabled(tableCheckbox.checked);
            }));
            tokenShowBtn.addEventListener("click", (() => {
                di.tokenStore.toggleTokenShow();
            }));
            createTypesCheckboxes().forEach((checkbox => {
                typesWrapper.appendChild(checkbox);
            }));
            createMarksCheckboxes().forEach((checkbox => {
                marksWrapper.appendChild(checkbox);
            }));
            closeBtnEl.addEventListener("click", (() => {
                closeSettingsModal();
            }));
            di.tokenStore.onStateUpdate((({isTokenCheckingInProgress, errorMessage, expires, tokenLevel, tokenPoints, isTokenShown}) => {
                if (!checkTokenBtnEl || !checkTokenErrorEl || !checkTokenInfoEl || !tokenField || !repliesCollectingCheckbox) {
                    return;
                }
                tokenField.type = isTokenShown ? "text" : "password";
                checkTokenBtnEl.disabled = isTokenCheckingInProgress;
                checkTokenErrorEl.innerText = errorMessage || "";
                checkTokenInfoEl.innerHTML = "";
                if (expires !== null && typeof tokenLevel !== undefined) {
                    if (tokenLevel == null) {
                        tokenLevel = 0;
                    }
                    repliesCollectingCheckbox.disabled = false;
                    const showPoints = tokenPoints && tokenPoints > 0 ? `, очки: ${tokenPoints}` : "";
                    checkTokenInfoEl.innerHTML = `\n        Уровень доступа: ${tokenLevel}${showPoints}\n        <br />\n        До: ${formatDate(expires)}\n      `;
                } else {
                    repliesCollectingCheckbox.disabled = true;
                }
            }));
            di.userSettings.onStateUpdate((({isRepliesCollectingEnabled, isRepliesCollectingEnabledAutomatically}) => {
                if (!repliesCollectingCheckbox || !repliesCollectingCheckboxView) {
                    return;
                }
                repliesCollectingCheckbox.checked = isRepliesCollectingEnabled;
                if (isRepliesCollectingEnabledAutomatically) {
                    repliesCollectingCheckboxView.classList.add("botnadzor-replies-collecting-enabled-automatically");
                }
            }));
            document.body.appendChild(modalEl);
        }
        function injectLayout() {
            injectSettingsModal();
            injectAdvancedUserInfoModal();
            injectNotifications();
        }
        async function start() {
            const DI = await getDIReady();
            if (document.readyState !== "loading") {
                injectLayout();
            } else {
                document.addEventListener("DOMContentLoaded", injectLayout);
            }
            console.log("Botnadzor: Разметка внедрена");
            Object.values(DI).forEach((it => {
                it.onLayoutInjected?.();
            }));
            const finder = elementsFinderFactory();
            finder.on("#top_profile_menu", addDesktopSettingsModalOpenerForLoggedInUser);
            finder.on("#top_reg_link", addDesktopSettingsModalOpenerForGuestUser);
            finder.on(".UnauthorizedHeader__logo", addDesktopSettingsModalOpenerForGuestUserMobile);
            finder.on(".SettingsMenu", addMobileSettingsModalOpener);
            finder.on(".reply_form", onReplyFormFound);
            finder.on(".reply", onReplyFound);
            finder.on(".post", onPostFound);
            finder.on(".wl_post", onPostFound);
            finder.on(".fans_fan_row", onFanFound);
            finder.on(".like_tt_owner", onLikeFound);
            finder.on(".OwnerPageName", onProfileFound);
            finder.on(".mention_tt", onMentionTTFound);
            finder.on(".copy_quote", on_repost_found_onNewDesignPostFound);
            finder.on(".wall_item", onFoundMobilePost);
            finder.on(".ProfileInfo__in", onFoundMobileProfile);
            finder.on(".ReplyItem", onFoundMobileReply);
            finder.on(".pcont .inline_item", onFoundMobileFan);
            finder.on(".pic_body_wrap", onFoundMobileRepost);
            finder.on(".friends_user_row", onFriendFound);
            finder.on(".Friends__item", onFriendMobileFound);
        }
        start();
    })();
})();