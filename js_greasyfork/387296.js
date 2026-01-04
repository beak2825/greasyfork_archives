// ==UserScript==
// @name         AcfunBlock开源代码
// @namespace    http://tampermonkey.net/
// @version      3.060
// @description  帮助你屏蔽不想看的UP主
// @author       人文情怀
// @exclude      https://www.acfun.cn/login/*
// @exclude      http://www.acfun.cn/login/*
// @match        http://www.acfun.cn/a/ac*
// @match        http://www.acfun.cn/v/list*
// @match        https://www.acfun.cn/a/ac*
// @match        http://www.acfun.cn/*
// @match        https://www.acfun.cn/*
// @match        https://www.acfun.cn/v/list*
// @match        http://www.acfun.cn/a/ac*
// @match        https://www.acfun.cn/a/ac*
// @match        http://www.acfun.cn/v/ac*
// @match        https://www.acfun.cn/v/ac*
// @match        https://www.acfun.cn/v/as*
// @match        http://www.acfun.cn/v/as*
// @connect      greasyfork.org
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_deleteValue
// @grant        GM.deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        unsafeWindow
// @run-at      document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/387296/AcfunBlock%E5%BC%80%E6%BA%90%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/387296/AcfunBlock%E5%BC%80%E6%BA%90%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==

//3.044更新以后用到了 gif.js 所以直接引用了min版本在代码, 请看gifJob和gif_js变量
//请注意3.044以后将会自动关注UP主账号,并且给UP主的最新文章投蕉作为支持。

(() => {
    "use strict";
    var __webpack_modules__ = {
        547: (module, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.d(__webpack_exports__, {
                Z: () => __WEBPACK_DEFAULT_EXPORT__
            });
            var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(81);
            var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
            var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(645);
            var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = __webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
            var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(667);
            var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = __webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
            var ___CSS_LOADER_URL_IMPORT_0___ = new URL(__webpack_require__(528), __webpack_require__.b);
            var ___CSS_LOADER_URL_IMPORT_1___ = new URL(__webpack_require__(653), __webpack_require__.b);
            var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
            var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
            var ___CSS_LOADER_URL_REPLACEMENT_1___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___);
            ___CSS_LOADER_EXPORT___.push([ module.id, '/* Colors */\r\n.c-a {\r\n    background-color: #eeeeee;\r\n}\r\n\r\n.c-b {\r\n    background-color: #D6C4C1;\r\n}\r\n\r\n.c-c {\r\n    background-color: #eee;\r\n}\r\n\r\n.c-d {\r\n    background-color: #D6C1CB;\r\n}\r\n\r\n.c-e {\r\n    background-color: #F7DEF7;\r\n}\r\n\r\n.ui-hidden {\r\n    /*display: none!important;*/\r\n    width: 0 !important;\r\n    border-width: 0 !important;\r\n}\r\n\r\n.ui-hidden a {\r\n\r\n    color: rgba(0, 0, 0, 0) !important;\r\n}\r\n\r\n.ui-hidden div {\r\n\r\n    color: rgba(0, 0, 0, 0) !important;\r\n}\r\n\r\n.ui-hidden span {\r\n\r\n    background-color: transparent;\r\n}\r\n\r\n.helper-wrap {\r\n    user-select: none;\r\n    position: fixed;\r\n    z-index: 99;\r\n    height: 230px;\r\n    min-width: 60px;\r\n    top: 500px;\r\n    left: 0px;\r\n\r\n}\r\n\r\n.helper-wrap-inner {\r\n\r\n    position: relative;\r\n    height: 100%;\r\n}\r\n\r\n.helper-wrap-inner div {\r\n    float: left;\r\n    vertical-align: top;\r\n}\r\n\r\n.helper-main {\r\n    display: inline-block;\r\n    width: 280px;\r\n    height: 100%;\r\n\r\n    position: relative;\r\n    border-radius: 0 10px 10px 0;\r\n    box-shadow: 1px 1px 5px 1px rgb(99 99 99 / 61%);\r\n    border: none;\r\n    overflow: hidden;\r\n}\r\n\r\n.ac-girl {\r\n    display: inline-block;\r\n    width: 48px;\r\n    height: 80px;\r\n    background-size: contain;\r\n    background-repeat: no-repeat;\r\n    cursor: pointer;\r\n    margin-top: 10px;\r\n}\r\n\r\n.ac-girl-hide {\r\n    transform: translateX(-100%);\r\n}\r\n\r\n.page-wrap {\r\n    height: 100%;\r\n    width: 280px;\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    background-color: inherit;\r\n    border-radius: 0 10px 10px 0;\r\n    overflow: hidden;\r\n}\r\n\r\n.go-back {\r\n    cursor: pointer;\r\n    padding: 3px;\r\n}\r\n\r\n.inactive-page {\r\n    display: none;\r\n}\r\n\r\n.menu-wrap {\r\n    text-align: center;\r\n\r\n    position: relative;\r\n    width: 100%;\r\n    height: 190px;\r\n    margin-top: 40px;\r\n\r\n    /*width: 80px;*/\r\n    /*position: absolute;*/\r\n    /*top: 50%;*/\r\n    /*left: 50%;*/\r\n    /*transform: translate(-50%, -50%);*/\r\n}\r\n\r\n.menu-column {\r\n    width: 50%;\r\n    float: left;\r\n}\r\n\r\n.sync-time {\r\n    margin-top: 20px;\r\n}\r\n\r\n.plugin-hint {\r\n    z-index: 99;\r\n    position: absolute;\r\n    top: 0;\r\n    right: 0;\r\n    cursor: pointer;\r\n    overflow: hidden;\r\n    padding: 2px;\r\n    font-weight: bold;\r\n}\r\n\r\n.plugin-menu-title {\r\n    overflow: hidden;\r\n    padding: 2px;\r\n    font-weight: bold;\r\n}\r\n\r\n.plugin-author {\r\n    position: absolute;\r\n    bottom: 0;\r\n    left: 0;\r\n    padding: 2px;\r\n    font-weight: bold;\r\n}\r\n\r\n.plugin-downloader-version {\r\n    position: absolute;\r\n    right: 20px;\r\n    bottom: 15px;\r\n    pointer-events: none;\r\n    padding: 2px;\r\n    font-weight: bold;\r\n}\r\n\r\n\r\n.plugin-version {\r\n    position: absolute;\r\n    right: 20px;\r\n    bottom: 0;\r\n    pointer-events: none;\r\n    padding: 2px;\r\n    font-weight: bold;\r\n}\r\n\r\n.menu-wrap a {\r\n    display: block;\r\n    margin: 3px 0 0px;\r\n    transition: 100ms;\r\n    cursor: pointer;\r\n}\r\n\r\n.menu-wrap a:hover {\r\n    transform: scale(1.2);\r\n}\r\n\r\n.plugin-add-ban-up {\r\n    margin: 10px;\r\n    display: block;\r\n    width: 100%;\r\n}\r\n\r\n.ban-title-input {\r\n    height: 20px;\r\n    background-color: transparent;\r\n    border-radius: 50px 0 0 50px;\r\n    font: 13px "宋体";\r\n    line-height: 13px;\r\n    text-align: center;\r\n    margin: 0 0 0 2px;\r\n    border: 1px solid #b6adad;\r\n    float: left;\r\n}\r\n\r\n.ban-title-input:focus {\r\n    background-color: rgba(255, 255, 255, 0.4);\r\n}\r\n\r\n.ban-item-submit {\r\n    border: 0px solid;\r\n    display: inline-block;\r\n    float: left;\r\n    padding: 1px;\r\n    background: darkred;\r\n    height: 22px;\r\n    color: white;\r\n    width: 40px;\r\n    border-radius: 0 50px 50px 0;\r\n}\r\n\r\n.ban-item-submit:hover {\r\n    background-color: #f1c7c7;\r\n    transition: 50ms;\r\n}\r\n\r\n.ban-item-submit:active {\r\n    background-color: #cd9072;\r\n}\r\n\r\n.banned-items {\r\n    padding: 10px;\r\n    overflow-y: auto;\r\n    overflow-x: hidden;\r\n    height: 147px;\r\n    line-height: 23px;\r\n    margin: 2px;\r\n\r\n}\r\n\r\n.ranked-item {\r\n    font-size: 8px;\r\n    word-break: keep-all;\r\n    background-color: rgba(30, 30, 155, 0.3) !important;\r\n}\r\n\r\n.banned-items::-webkit-scrollbar {\r\n    width: 10px;\r\n}\r\n\r\n.banned-items::-webkit-scrollbar-track {\r\n    background-color: #eeeeee;\r\n}\r\n\r\n.banned-items::-webkit-scrollbar-thumb {\r\n    background-color: #666666;\r\n}\r\n\r\n.banned-item {\r\n    position: relative;\r\n    display: inline-block;\r\n    height: 16px;\r\n\r\n    margin: 3px 1px 5px 1px;\r\n}\r\n\r\nspan.banned-title {\r\n    height: 16px;\r\n    float: left;\r\n    vertical-align: middle;\r\n    background-color: #f9f9f9;\r\n    font: 12px "宋体";\r\n    border-radius: 5px;\r\n    padding: 1px 5px 1px 5px;\r\n    line-height: 16px;\r\n}\r\n\r\n.banned-item button {\r\n\r\n    border: 0px solid;\r\n    display: inline-block;\r\n    float: left;\r\n    padding: 1px 5px 1px 5px;\r\n    background: rgb(163 52 52 / 70%);\r\n    height: 18px;\r\n    width: 100%;\r\n    color: white;\r\n    border-radius: 5px;\r\n    position: absolute;\r\n    left: 0;\r\n    top: 0;\r\n    cursor: pointer;\r\n    opacity: 0;\r\n    transition: 80ms ease-in;\r\n\r\n}\r\n\r\n.banned-item button:active {\r\n\r\n    background: rgba(255, 76, 76, 0.7);\r\n}\r\n\r\n.banned-item button:hover {\r\n    opacity: 1;\r\n}\r\n\r\n\r\n.about-page-content {\r\n    width: 100%;\r\n    display: block;\r\n    word-wrap: break-word;\r\n    box-sizing: border-box;\r\n    padding: 20px;\r\n    overflow-y: auto;\r\n    height: 210px;\r\n    float: none !important;\r\n}\r\n\r\n\r\n/* 过滤UI */\r\n.filter-button {\r\n\r\n    width: 15px;\r\n    height: 15px;\r\n    background-color: rgba(255, 0, 0, 1);\r\n    padding: 1.5px;\r\n    left: 0;\r\n    top: 0;\r\n    transform: translate(0, 0);\r\n    display: block;\r\n    position: fixed;\r\n    z-index: 98;\r\n    background-size: contain;\r\n    background-image: url(' + ___CSS_LOADER_URL_REPLACEMENT_0___ + ");\r\n    border-radius: 11px;\r\n    border: 2px rgb(230, 230, 230) solid;\r\n    cursor: pointer;\r\n}\r\n\r\n.smooth {\r\n    transition: 500ms ease-in-out;\r\n    -moz-transition: 500ms ease-in-out;\r\n    -o-transition: 500ms ease-in-out;\r\n    -webkit-transition: 500ms ease-in-out;\r\n}\r\n\r\n.banned-article {\r\n    padding: 0 !important;\r\n    margin: 0 !important;\r\n    height: 0 !important;\r\n    overflow: hidden;\r\n    opacity: 0;\r\n}\r\n\r\n.banned-page-item {\r\n    margin: 0;\r\n    opacity: 0;\r\n    transition: 300ms;\r\n    pointer-events: none;\r\n}\r\n\r\n.banned-page-item:hover {\r\n\r\n}\r\n\r\n.hover-show {\r\n    pointer-events: auto !important;\r\n}\r\n\r\n.hover-show:hover {\r\n    opacity: 1;\r\n}\r\n\r\n.remove {\r\n    display: none !important;\r\n}\r\n\r\n.remove-2 {\r\n    display: none !important;\r\n}\r\n\r\n.area-comment-block {\r\n    line-height: 15px;\r\n    background: url(" + ___CSS_LOADER_URL_REPLACEMENT_1___ + ') no-repeat;\r\n    background-size: 13px 13px;\r\n    background-position: 0 1px;\r\n    padding-left: 17px;\r\n    padding-right: 15px;\r\n    color: #999;\r\n    cursor: pointer;\r\n}\r\n\r\n.area-comment-block:hover {\r\n    color: red;\r\n    filter: ;\r\n}\r\n\r\n.banned-text {\r\n    font-size: 14px !important;\r\n}\r\n\r\n.unban-replier-btn {\r\n    margin: 0 10px;\r\n}\r\n\r\n.hide-avatar {\r\n    visibility: hidden;\r\n}\r\n\r\n#delete_cache {\r\n    height: 18px;\r\n    padding: 0;\r\n    line-height: 16px;\r\n    margin-left: 10px;\r\n}\r\n\r\n#lookup_cache {\r\n    height: 18px;\r\n    padding: 0 10px;\r\n    line-height: 16px;\r\n}\r\n\r\n.no-float {\r\n    float: none !important;\r\n}\r\n\r\n.lookup-cache-input {\r\n\r\n    line-height: 18px;\r\n    height: 18px;\r\n    padding: 0;\r\n    border: none;\r\n    width: 100px;\r\n    font-size: 14px;\r\n    margin: 0 10px;\r\n}\r\n\r\n#copy_replierrank {\r\n    display: inline-block;\r\n    margin-top: 3px;\r\n}\r\n\r\n#copy_keywordrank {\r\n    display: inline-block;\r\n    margin-top: 3px;\r\n}\r\n\r\n#copy_uprank {\r\n    display: inline-block;\r\n    margin-top: 3px;\r\n}\r\n\r\n/*subUI */\r\n.sub-ui-wrap {\r\n    position: fixed;\r\n    left: 0;\r\n    top: 38%;\r\n    height: 80px;\r\n    width: 30px;\r\n    z-index: 99;\r\n}\r\n\r\n.sub-ui-inner {\r\n    height: 80px;\r\n    width: 30px;\r\n    position: relative;\r\n    display: block;\r\n    overflow: hidden;\r\n}\r\n\r\n.sub-ui-banned {\r\n\r\n    background-color: rgba(253, 76, 93, 0.3);\r\n}\r\n\r\n.hide {\r\n    display: none !important;\r\n\r\n}\r\n\r\n.sub-ui-normal {\r\n\r\n    background-color: rgba(165, 253, 76, 0.3);\r\n}\r\n\r\n.sub-ui-text {\r\n    writing-mode: vertical-rl;\r\n    text-orientation: upright;\r\n    text-align: center;\r\n    box-sizing: border-box;\r\n    padding: 5px;\r\n    height: 100%;\r\n    width: 100%;\r\n    user-select: none;\r\n}\r\n\r\n.sub-ui-button {\r\n    position: absolute;\r\n    height: 100%;\r\n    width: 100%;\r\n    left: 0;\r\n    top: 0;\r\n    user-select: none;\r\n}\r\n\r\n.sub-ui-button:hover {\r\n    transform: translateX(100%);\r\n}\r\n\r\n#banUp {\r\n    color: black;\r\n}\r\n\r\n#unbanUp {\r\n    color: black;\r\n}\r\n\r\n\r\n#banUp:after {\r\n    box-sizing: border-box;\r\n    padding: 5px;\r\n    content: "屏蔽ＵＰ主";\r\n    display: block;\r\n    width: 100%;\r\n    height: 100%;\r\n    background-color: #fc7630;\r\n    transform: translateX(-100%);\r\n    position: absolute;\r\n    left: 0;\r\n    top: 0;\r\n}\r\n\r\n\r\n#unbanUp:after {\r\n    box-sizing: border-box;\r\n    padding: 5px;\r\n    content: "取消屏蔽";\r\n    display: block;\r\n    width: 100%;\r\n    height: 100%;\r\n    background-color: #83ee1a;\r\n    transform: translateX(-100%);\r\n    position: absolute;\r\n    left: 0;\r\n    top: 0;\r\n}\r\n\r\n.on-top {\r\n    z-index: 1000;\r\n}\r\n\r\n.user-tags {\r\n    vertical-align: middle;\r\n    display: inline-block;\r\n    margin: 0 20px 0 20px;\r\n    max-width: 50%;\r\n}\r\n\r\n/* TAGGING */\r\n.user-tag {\r\n    margin-top: 2px;\r\n    margin-right: 3px;\r\n    padding: 1px 4px 1px 4px;\r\n    line-height: 15px;\r\n    font-size: 8px !important;\r\n    border-style: solid;\r\n    border-width: 1px;\r\n    /*border-color: rgba(0, 0, 0, 0.4);*/\r\n    border-color: rgba(255, 0, 0, 0.4);\r\n    color: red;\r\n    user-select: none;\r\n    display: inline-block;\r\n\r\n    height: 15px;\r\n    min-width: 30px;\r\n\r\n    float: left;\r\n\r\n\r\n}\r\n\r\n.user-tag-text {\r\n\r\n    text-align: center;\r\n}\r\n\r\n.very-smooth {\r\n\r\n    transition: 200ms;\r\n    -moz-transition: 200ms;\r\n    -o-transition: 200ms;\r\n    -webkit-transition: 200ms;\r\n}\r\n\r\n\r\n.add-new-tag {\r\n\r\n    margin-top: 2px;\r\n    padding: 1px 4px 1px 4px;\r\n    line-height: 15px;\r\n    font-size: 8px !important;\r\n\r\n    border: 1px rgba(0, 0, 0, 0.25);\r\n    border-style: dashed;\r\n    user-select: none;\r\n\r\n    display: inline-block;\r\n    float: left;\r\n\r\n}\r\n\r\n.add-new-tag:hover {\r\n    background-color: rgba(0, 0, 0, 0.3);\r\n}\r\n\r\n.add-new-tag:active {\r\n    background-color: rgba(255, 255, 255, 0.3);\r\n}\r\n\r\n.tagging-ui-container {\r\n    overflow: hidden;\r\n    position: fixed;\r\n    top: 50%;\r\n    left: 50%;\r\n    height: 200px;\r\n    width: 300px;\r\n    transform: translate(-50%, -50%);\r\n\r\n    box-sizing: border-box;\r\n    padding: 10px;\r\n\r\n    -webkit-box-shadow: 2px 2px 7px 1px #787878;\r\n    box-shadow: 2px 2px 7px 1px #787878;\r\n    border-radius: 10px;\r\n    z-index: 99;\r\n    background-color: rgb(240, 240, 240);\r\n}\r\n\r\n.tagging-ui-inner {\r\n    position: relative;\r\n    height: 100%;\r\n    width: 100%;\r\n\r\n}\r\n\r\n.name-to-tag {\r\n    padding: 3px;\r\n\r\n}\r\n\r\n.tags-container {\r\n    width: 280px;\r\n    height: 130px;\r\n    background-color: rgba(255, 255, 255, 0.8);\r\n}\r\n\r\n.tagging-input-wrap {\r\n    background-color: rgb(100, 100, 100);\r\n    height: 20px;\r\n    vertical-align: top;\r\n    border-bottom: 2px rgb(200, 200, 200);\r\n    margin-bottom: 2px;\r\n}\r\n\r\n.tagging-input {\r\n    float: left;\r\n    box-sizing: border-box;\r\n    padding: 2px;\r\n    height: 20px;\r\n    width: 235px;\r\n    border: none;\r\n\r\n}\r\n\r\n.tagging-submit {\r\n    float: left;\r\n    height: 20px;\r\n    border: none;\r\n    width: 45px;\r\n    background-color: #ced9c5;\r\n}\r\n\r\n.tagging-submit:hover {\r\n    background-color: #a5f400;\r\n}\r\n\r\n.tagging-submit:active {\r\n    background-color: #d4f400;\r\n}\r\n\r\n.tagging-close-button {\r\n    position: absolute;\r\n    right: 0;\r\n    top: 0;\r\n    background-color: #a84716;\r\n    color: white;\r\n    border-radius: 0 10px 0 10px;\r\n    width: 45px;\r\n    height: 25px;\r\n    vertical-align: middle;\r\n    text-align: center;\r\n    box-sizing: border-box;\r\n    z-index: 10;\r\n    user-select: none;\r\n}\r\n\r\n.smooth-remove {\r\n    transition: 300ms ease-in-out;\r\n    opacity: 0;\r\n    pointer-events: none;\r\n\r\n}\r\n\r\n\r\n.tagging-close-button:hover {\r\n    background-color: #ffc5c5;\r\n}\r\n\r\n.tagging-close-button:active {\r\n    background-color: #ffedd4;\r\n    padding-top: 2px;\r\n\r\n}\r\n\r\n.tag-item {\r\n    display: inline-block;\r\n    background-color: #e7e1e1;\r\n    margin: 1px;\r\n    float: left;\r\n    box-sizing: border-box;\r\n    border: 1px dashed;\r\n    padding: 2px;\r\n    font-size: 8px;\r\n    user-select: none;\r\n    cursor: pointer;\r\n    height: 19px;\r\n    min-width: 30px;\r\n    position: relative;\r\n    line-height: 15px;\r\n    text-align: center;\r\n}\r\n\r\n\r\n.tag-item:before {\r\n    opacity: 0;\r\n    content: "删除";\r\n    position: absolute;\r\n    width: 100%;\r\n    text-align: center;\r\n    vertical-align: middle;\r\n    left: 0;\r\n    height: 100%;\r\n    top: 0;\r\n    line-height: 19px;\r\n}\r\n\r\n.tag-item:hover:before {\r\n    opacity: 1;\r\n    color: white;\r\n    background-color: #a84716;\r\n}\r\n\r\n\r\n/* Comment Recovery UI */\r\n\r\n\r\n.deleted-comments-container {\r\n    position: absolute;\r\n    display: block;\r\n    width: 300px;\r\n\r\n    min-height: 300px;\r\n    overflow: hidden;\r\n}\r\n\r\n.deleted-comments-inner {\r\n    position: relative;\r\n    display: block;\r\n    width: 100%;\r\n    height: 100%;\r\n\r\n}\r\n\r\n\r\n.deleted-comments-title {\r\n    box-sizing: border-box;\r\n    display: block;\r\n    font-size: 16px;\r\n    background-color: #b6adad;\r\n    padding: 3px 10px 3px 10px;\r\n}\r\n\r\n.deleted-comment-list {\r\n    height: calc(100% - 50px);\r\n    width: 100%;\r\n    overflow-y: auto;\r\n    overflow-x: hidden;\r\n}\r\n\r\n.deleted-comment {\r\n    border: 1px solid #e5e5e5;\r\n    background-color: #ffe;\r\n    display: block;\r\n}\r\n\r\n.deleted-comment img {\r\n    width: 100%;\r\n}\r\n\r\n.comment-info {\r\n    display: block;\r\n    height: 20px;\r\n    padding: 3px;\r\n}\r\n\r\n.comment-floor {\r\n    font-weight: 700;\r\n    display: inline-block;\r\n    float: left;\r\n    line-height: 14px;\r\n    padding: 3px;\r\n    height: 20px;\r\n    width: 45px;\r\n    box-sizing: border-box;\r\n    margin-right: 3px;\r\n}\r\n\r\n.comment-query-state {\r\n    display: inline-block;\r\n    float: left;\r\n    line-height: 14px;\r\n    padding: 3px;\r\n    height: 20px;\r\n    box-sizing: border-box;\r\n}\r\n\r\n.comment-content {\r\n    padding: 3px;\r\n}\r\n\r\n.hide-btn {\r\n    float: right;\r\n    font-size: 14px;\r\n    font-weight: 700;\r\n    user-select: none;\r\n}\r\n\r\n.hide-btn:hover {\r\n    color: red;\r\n}\r\n\r\n\r\n/* setting ui  check box */\r\n/* Customize the label (the container) */\r\n.cc-container {\r\n    display: block;\r\n    position: relative;\r\n    padding-left: 22px;\r\n    margin-bottom: 12px;\r\n    cursor: pointer;\r\n    font-size: 12px;\r\n    -webkit-user-select: none;\r\n    -moz-user-select: none;\r\n    -ms-user-select: none;\r\n    user-select: none;\r\n    line-height: 12px;\r\n}\r\n\r\n/* Hide the browser\'s default checkbox */\r\n.cc-container input {\r\n    position: absolute;\r\n    opacity: 0;\r\n    cursor: pointer;\r\n    height: 0;\r\n    width: 0;\r\n}\r\n\r\n/* Create a custom checkbox */\r\n.checkmark {\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    height: 12px;\r\n    width: 12px;\r\n    background-color: #848484;\r\n}\r\n\r\n/* On mouse-over, add a grey background color */\r\n.cc-container:hover input ~ .checkmark {\r\n    background-color: #ccc;\r\n}\r\n\r\n/* When the checkbox is checked, add a blue background */\r\n.cc-container input:checked ~ .checkmark {\r\n    background-color: #2196F3;\r\n}\r\n\r\n/* Create the checkmark/indicator (hidden when not checked) */\r\n.checkmark:after {\r\n    content: "";\r\n    position: absolute;\r\n    display: none;\r\n}\r\n\r\n/* Show the checkmark when checked */\r\n.cc-container input:checked ~ .checkmark:after {\r\n    display: block;\r\n}\r\n\r\n/* Style the checkmark/indicator */\r\n.cc-container .checkmark:after {\r\n    left: 4px;\r\n    top: 2px;\r\n    width: 3px;\r\n    height: 6px;\r\n    border: solid white;\r\n    border-width: 0 2px 2px 0;\r\n    -webkit-transform: rotate(45deg);\r\n    -ms-transform: rotate(45deg);\r\n    transform: rotate(45deg);\r\n}\r\n\r\n\r\n/*  UDP area */\r\n.udp-container {\r\n    position: fixed;\r\n    right: 0;\r\n    top: 0;\r\n    height: 100%;\r\n    width: 400px;\r\n    z-index: 199;\r\n    background: white;\r\n    transition: 0.4s ease-in;\r\n    box-shadow: -2px -2px 5px 0px #ddd;\r\n    overflow: hidden;\r\n}\r\n\r\n.udp-title {\r\n    height: 30px;\r\n    font-size: 16px;\r\n    padding: 5px 5px 5px 5px;\r\n    z-index: 199;\r\n    box-shadow: 0 0 2px 2px #ddd;\r\n    line-height: 30px;\r\n    position: relative;\r\n}\r\n\r\n.udp-inner {\r\n    position: relative;\r\n    height: calc(100% - 40px);\r\n    overflow-y: scroll;\r\n}\r\n\r\n.udp-item {\r\n    margin: 5px;\r\n    border-radius: 10px;\r\n    padding: 5px;\r\n    background-color: rgb(240, 240, 240);\r\n}\r\n\r\n.udp-item img {\r\n    width: 100%;\r\n}\r\n\r\n.udp-item-info {\r\n    margin-top: 4px;\r\n    display: flex;\r\n    justify-content: space-between;\r\n    background-color: #eee;\r\n    font-weight: bold;\r\n}\r\n\r\n.udp-close {\r\n    position: absolute;\r\n    top: 0;\r\n    right: 0;\r\n    height: 25px;\r\n    width: 25px;\r\n    color: white;\r\n    background-color: #a84716;\r\n    cursor: pointer;\r\n    font-size: 25px;\r\n    line-height: 25px;\r\n    text-align: center;\r\n    border-radius: 0 0 0 4px;\r\n    z-index: 299;\r\n}\r\n\r\n.udp-av {\r\n    align-self: flex-end;\r\n}\r\n\r\n.udp-hidden {\r\n    transform: translateX(100%);\r\n}\r\n\r\n.lookup-btn {\r\n    margin-top: 2px;\r\n    padding: 0px 4px 0px 4px;\r\n    line-height: 15px;\r\n    font-size: 8px !important;\r\n    border: 1px rgba(0, 0, 0, 0.25);\r\n    border-style: dashed;\r\n    user-select: none;\r\n    display: inline-block;\r\n    vertical-align: middle;\r\n    margin-right: 2px;\r\n    cursor: pointer;\r\n}\r\n\r\n.lookup-btn i {\r\n    transition: 0.2s;\r\n}\r\n\r\n.lookup-btn:hover {\r\n    background-color: rgba(35, 255, 0, 0.2);\r\n}\r\n\r\n.lookup-btn:hover i {\r\n    transform: translateY(-2px);\r\n}\r\n\r\n.lookup-btn:active i {\r\n    transform: scale(0.95);\r\n}\r\n\r\n\r\n.header-change-fix {\r\n    white-space: nowrap;\r\n    width: 90px!important;\r\n}\r\n\r\n.home-fix-suffix {\r\n    color: green;\r\n    font-weight: 700;\r\n    padding: 0 5px 0 0px;\r\n}', "" ]);
            const __WEBPACK_DEFAULT_EXPORT__ = ___CSS_LOADER_EXPORT___;
        },
        645: module => {
            module.exports = function(cssWithMappingToString) {
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
        667: module => {
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
        81: module => {
            module.exports = function(i) {
                return i[1];
            };
        },
        653: module => {
            module.exports = "data:image/png;base64,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";
        },
        528: module => {
            module.exports = "data:image/png;base64,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";
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
        __webpack_require__.g = function() {
            if (typeof globalThis === "object") return globalThis;
            try {
                return this || new Function("return this")();
            } catch (e) {
                if (typeof window === "object") return window;
            }
        }();
    })();
    (() => {
        __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
    })();
    (() => {
        __webpack_require__.b = document.baseURI || self.location.href;
        var installedChunks = {
            179: 0
        };
    })();
    var __webpack_exports__ = {};
    (() => {
        let girl64 = "data:image/png;base64,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";
        function acgirl_image(url = false) {
            if (!url) {
                return `url(${girl64})`;
            }
            return girl64;
        }
        function h() {
            let size = 28;
            let c1 = "#ff838f";
            let c2 = "#fd754c";
            let s1 = `color:${c1};font-size:30px;font-weight:900;font-family: 'Verdana', monospace;font-style:italic;`;
            let s2 = `color:${c1};font-size:24px;font-weight:900;font-family:  'Verdana', monospace;`;
            let s22 = `color:${c1};font-size:21px;font-weight:900;font-family:  'Verdana', monospace;`;
            let s3 = `color:orange;font-size:10px;font-weight:500;font-family: '黑体', monospace;`;
            let s4 = `color:red;font-size: ${size}px; background-size: contain;  display:block; height: ${size}px;background-image:` + acgirl_image() + ";background-repeat:no-repeat";
            let s5 = `color:${c1};`;
            let s52 = `color:${c2}`;
            console.log("%c  " + "%cA%ccF%cUN%c\n     网页端屏蔽插件" + "\n%c作恶者up：人文情怀\n%c有BUG请私信截图你接下来看到的所有信息", s4, s1, s2, s22, s3, s5, s52);
        }
        function header() {
            return h();
        }
        const version = "3.060";
        let logFunc = console.log;
        let errorFunc = console.error;
        let warnFunc = console.warn;
        console.clear();
        let msgBuffer = [];
        function init() {
            if (unsafeWindow && unsafeWindow.console) {
                unsafeWindow.console.log = (...args) => {
                    msgBuffer.push({
                        f: logFunc,
                        args
                    });
                };
                unsafeWindow.console.warn = (...args) => {
                    msgBuffer.push({
                        f: warnFunc,
                        args
                    });
                };
                unsafeWindow.console.error = (...args) => {
                    msgBuffer.push({
                        f: errorFunc,
                        args
                    });
                };
                unsafeWindow.addEventListener("error", (errorEvent => {
                    logFunc(errorEvent);
                }));
            }
        }
        setTimeout(init);
        function collector() {
            let worker = () => {
                if (msgBuffer.length === 0) return;
                console.groupCollapsed(`%cAcFun消息${msgBuffer.length}条`, "color:rgba(125,125,125,255)");
                msgBuffer.forEach((msg => {
                    msg.f(...msg.args);
                }));
                console.groupEnd();
                msgBuffer = [];
            };
            setInterval(worker, 5e3);
        }
        collector();
        function log_log(...args) {
            let r = [ "%c屏蔽插件消息:", "color:lightgreen;" ];
            args.forEach((a => {
                r.push(a);
            }));
            logFunc.call(this, ...r);
        }
        const server = "https://baldhumanity.top";
        class EdgeDetector {
            #left=false;
            #right=false;
            #top=false;
            #bottom=false;
            constructor(canvas, directions = [ "top", "bottom", "left", "right" ], reversed = true) {
                this.canvas = canvas;
                this.ctx = canvas.getContext("2d");
                this.width = canvas.width;
                this.height = canvas.height;
                this.imageData = this.ctx.getImageData(0, 0, this.width, this.height);
                this.data = this.imageData.data;
                this.grayscaleData = this.rgbaToGrayscale();
                this.setDirections(directions);
                this.threshold = 150;
                this.reverse = reversed;
            }
            rgbaToGrayscale() {
                const grayscaleData = new Uint8ClampedArray(this.width * this.height);
                for (let i = 0; i < this.data.length; i += 4) {
                    const avg = this.data[i] * .3 + this.data[i + 1] * .59 + this.data[i + 2] * .11;
                    grayscaleData[Math.floor(i / 4)] = avg;
                }
                return grayscaleData;
            }
            setDirections(directions) {
                this.#left = this.#right = this.#top = this.#bottom = false;
                directions.forEach((direction => {
                    if (direction === "left") this.#left = true; else if (direction === "right") this.#right = true; else if (direction === "top") this.#top = true; else if (direction === "bottom") this.#bottom = true;
                }));
            }
            detectEdges() {
                const edgeData = new Uint8ClampedArray(this.width * this.height);
                const sobelKernelX = [ [ -1, 0, 1 ], [ -2, 0, 2 ], [ -1, 0, 1 ] ];
                const sobelKernelY = [ [ -1, -2, -1 ], [ 0, 0, 0 ], [ 1, 2, 1 ] ];
                for (let y = 1; y < this.height - 1; y++) {
                    for (let x = 1; x < this.width - 1; x++) {
                        let pixelX = 0, pixelY = 0;
                        for (let row = -1; row <= 1; row++) {
                            for (let col = -1; col <= 1; col++) {
                                const pixel = this.grayscaleData[(y + row) * this.width + (x + col)];
                                pixelX += pixel * sobelKernelX[row + 1][col + 1];
                                pixelY += pixel * sobelKernelY[row + 1][col + 1];
                            }
                        }
                        const index = y * this.width + x;
                        let magnitudeX = Math.abs(pixelX);
                        let magnitudeY = Math.abs(pixelY);
                        if (this.#top && pixelY < 0 && magnitudeY > this.threshold || this.#bottom && pixelY > 0 && magnitudeY > this.threshold || this.#left && pixelX < 0 && magnitudeX > this.threshold || this.#right && pixelX > 0 && magnitudeX > this.threshold) {
                            edgeData[index] = this.reverse ? 255 : 0;
                        }
                    }
                }
                const edgeCanvas = document.createElement("canvas");
                edgeCanvas.width = this.width;
                edgeCanvas.height = this.height;
                const edgeCtx = edgeCanvas.getContext("2d");
                const outputImageData = edgeCtx.createImageData(this.width, this.height);
                for (let i = 0; i < edgeData.length; i++) {
                    outputImageData.data[i * 4] = edgeData[i];
                    outputImageData.data[i * 4 + 1] = edgeData[i];
                    outputImageData.data[i * 4 + 2] = edgeData[i];
                    outputImageData.data[i * 4 + 3] = 255;
                }
                edgeCtx.putImageData(outputImageData, 0, 0);
                return edgeCanvas;
            }
        }
        function encode(a) {
            return a;
        }
        function util_decode(a) {
            return a;
        }
        function check() {
            let unsafeWindow = window;
            if (typeof unsafeWindow.A === "undefined") {
                unsafeWindow.A = (t, m) => {
                    log_log(t, m);
                };
            }
        }
        class IndexedDBHelper {
            constructor(dbName, storeName) {
                this.dbName = dbName;
                this.storeName = storeName;
                this.db = null;
            }
            open() {
                return new Promise(((resolve, reject) => {
                    if (this.db) {
                        resolve(this.db);
                        return;
                    }
                    const request = indexedDB.open(this.dbName, 1);
                    request.onupgradeneeded = event => {
                        let db = event.target.result;
                        db.createObjectStore(this.storeName);
                    };
                    request.onsuccess = event => {
                        this.db = event.target.result;
                        resolve(this.db);
                    };
                    request.onerror = event => {
                        reject("IndexedDB error: " + event.target.errorCode);
                    };
                }));
            }
            save(key, value) {
                return new Promise(((resolve, reject) => {
                    this.open().then((db => {
                        const transaction = db.transaction([ this.storeName ], "readwrite");
                        const store = transaction.objectStore(this.storeName);
                        const request = store.put(value, key);
                        request.onsuccess = () => resolve();
                        request.onerror = event => reject("Save error: " + event.target.errorCode);
                    })).catch(reject);
                }));
            }
            load(key) {
                return new Promise(((resolve, reject) => {
                    this.open().then((db => {
                        const transaction = db.transaction([ this.storeName ]);
                        const store = transaction.objectStore(this.storeName);
                        const request = store.get(key);
                        request.onsuccess = () => resolve(request.result);
                        request.onerror = event => reject("Load error: " + event.target.errorCode);
                    })).catch(reject);
                }));
            }
            count() {
                return new Promise(((resolve, reject) => {
                    this.open().then((db => {
                        const transaction = db.transaction([ this.storeName ]);
                        const store = transaction.objectStore(this.storeName);
                        const request = store.count();
                        request.onsuccess = () => resolve(request.result);
                        request.onerror = event => reject("Load error: " + event.target.errorCode);
                    })).catch(reject);
                }));
            }
            clearAll() {
                return new Promise(((resolve, reject) => {
                    this.open().then((db => {
                        const transaction = db.transaction([ this.storeName ], "readonly");
                        const store = transaction.objectStore(this.storeName);
                        const countRequest = store.count();
                        countRequest.onsuccess = () => {
                            const count = countRequest.result;
                            const deleteTransaction = db.transaction([ this.storeName ], "readwrite");
                            const deleteStore = deleteTransaction.objectStore(this.storeName);
                            const clearRequest = deleteStore.clear();
                            clearRequest.onsuccess = () => {
                                console.log("All data cleared from the store");
                                resolve(count);
                            };
                            clearRequest.onerror = event => {
                                reject("Error in clearing store: " + event.target.errorCode);
                            };
                        };
                        countRequest.onerror = event => {
                            reject("Error in counting store items: " + event.target.errorCode);
                        };
                    })).catch(reject);
                }));
            }
        }
        const dbHelper = new IndexedDBHelper("MyTestDatabase", "keyValuePairs");
        const safeIfarme = document.createElement("iframe");
        safeIfarme.style.display = "none";
        document.body.appendChild(safeIfarme);
        const util_XMLHttpRequest = safeIfarme.contentWindow.XMLHttpRequest;
        let xhttp = typeof GM_xmlhttpRequest !== "undefined" ? GM_xmlhttpRequest : GM.xmlHttpRequest;
        function _getPage(href, callback) {
            let unsafeWindow = window;
            let xhr = new unsafeWindow.XMLHttpRequest;
            xhr.open("GET", href, true);
            xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            xhr.onload = function() {
                let html = this.responseText;
                const parser = new DOMParser;
                let doc = parser.parseFromString(html, "text/html");
                callback(doc);
            };
            xhr.send();
        }
        function _apiRequest(queryData, callback) {
            let unsafeWindow = window;
            let xhr = new unsafeWindow.XMLHttpRequest;
            let url = server + "/api";
            let str = JSON.stringify(queryData);
            str = encode(str);
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            xhr.send(str);
            xhr.onload = function() {
                let d = {};
                try {
                    d = JSON.parse(this.responseText);
                } catch (e) {
                    console.trace("ERROR failed parsing JSON string:", this.responseText);
                } finally {
                    if (callback) callback(d);
                }
            };
        }
        let pagesToDownload = [];
        let pageDownloader = function() {
            if (pagesToDownload.length > 0) {
                let data = pagesToDownload.shift();
                let link = data.link;
                let callback = data.callback;
                xhttp({
                    method: "GET",
                    url: link,
                    onload: res => {
                        const parser = new DOMParser;
                        let doc = parser.parseFromString(res.responseText, "text/html");
                        downloadCache[link] = doc;
                        callback(doc);
                    },
                    onerror: e => {
                        log_log("下载页面失败：", link);
                    }
                });
            }
        };
        function randomFilename() {
            const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            let result = "";
            for (let i = 0; i < 10; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result + ".png";
        }
        function getCurrentAcId() {
            function getLastDigits(url) {
                const result = url.match(/\d+$/);
                return result ? result[0] : null;
            }
            let href = window.location.href;
            return getLastDigits(href);
        }
        async function uploadImage(acId, imageBinary, callback = null) {
            const payload = new URLSearchParams({
                fileName: randomFilename()
            });
            let response = await fetch("https://www.acfun.cn/rest/pc-direct/image/upload/getToken", {
                method: "POST",
                body: payload
            });
            if (!response.ok) {
                console.log(`Get upload token failed with ${response.status}`);
                return null;
            }
            const data = await response.json();
            const endpointList = data.info.httpEndpointList;
            const token = data.info.token;
            const firstEndpoint = endpointList[0];
            let fragmentId = 0;
            let dataUploaded = 0;
            let total_count = Math.ceil(imageBinary.byteLength / 1024 / 1024);
            let count = 0;
            for (let i = 0; i < imageBinary.byteLength; i += 1024 * 1024) {
                const fragment = imageBinary.slice(i, i + 1024 * 1024);
                const url = `https://${firstEndpoint}/api/upload/fragment?upload_token=${token}&fragment_id=${fragmentId}`;
                response = await fetch(url, {
                    method: "POST",
                    body: fragment
                });
                if (!response.ok) {
                    log_log(`data: Upload image fragment failed with ${response.status}`);
                    return null;
                }
                fragmentId++;
                count++;
                dataUploaded += fragment.byteLength;
                if (callback) {
                    callback(count, total_count);
                }
            }
            const completeUrl = `https://${firstEndpoint}/api/upload/complete?fragment_count=${fragmentId}&upload_token=${token}`;
            response = await fetch(completeUrl, {
                method: "POST",
                payload: ""
            });
            if (!response.ok) {
                log_log(`Upload image complete failed with ${response.status}`);
                return null;
            }
            const getUrl = "https://www.acfun.cn/rest/pc-direct/image/upload/getUrlAfterUpload";
            response = await fetch(getUrl, {
                method: "POST",
                body: new URLSearchParams({
                    token,
                    bizFlag: "web-comment-text"
                })
            });
            if (!response.ok) {
                log_log(`Get image URL after upload failed with ${response.status}`);
                return null;
            }
            const finalData = await response.json();
            if (finalData.result !== 0) {
                log_log(`Get image URL after upload failed with result ${finalData.result}`);
                return null;
            }
            return finalData.url;
        }
        function removeTextNodes(element) {
            if (!element) return;
            let childNodes = element.childNodes;
            for (let i = childNodes.length - 1; i >= 0; i--) {
                let child = childNodes[i];
                if (child.nodeType === Node.TEXT_NODE) {
                    element.removeChild(child);
                } else if (child.nodeType === Node.ELEMENT_NODE) {
                    removeTextNodes(child);
                }
            }
        }
        unsafeWindow.setInterval(pageDownloader, 100);
        let downloadCache = {};
        const util = {
            removeTextNodes,
            getCurrentAcId,
            uploadImage,
            EdgeDetector,
            XMLHttpRequest: util_XMLHttpRequest,
            dbHelper,
            getCommentType() {
                let c = window.document.querySelector(".mode-container");
                let tag = c.querySelector(".active");
                let t = tag.getAttribute("data-usemode");
                return t === "FLOOR" ? "OLD" : "NEW";
            },
            success(msg) {
                check();
                unsafeWindow.A.emit("global::success", msg, 3e3);
            },
            warn(msg) {
                check();
                unsafeWindow.A.emit("global::warning", msg, 3e3);
            },
            apiRequest: _apiRequest,
            getPage: _getPage,
            downloadPage(link, callback) {
                if (downloadCache[link]) {
                    callback(downloadCache[link]);
                    return;
                }
                pagesToDownload.push({
                    link,
                    callback
                });
            }
        };
        let unsafeWindow_alt = window;
        function trimWord(d) {
            return d.replace(/(\r\n|\n|\r)/gm, "").trim();
        }
        let empty = a => typeof a === "undefined" || a === null ? () => {} : a;
        let GM_set = typeof GM_setValue === "undefined" ? function(key, value, callback, failcallback) {
            let p = GM.setValue(key, value);
            p.then(empty(callback), empty(failcallback));
        } : function(key, value, callback) {
            GM_setValue(key, value);
            empty(callback)();
        };
        let GM_get = typeof GM_getValue === "undefined" ? function(key, defaultValue, callback) {
            let p = GM.getValue(key, defaultValue);
            p.then((debug => {
                empty(callback)(debug);
            }), (() => {
                empty(callback)(defaultValue);
            }));
        } : function(key, value, callback, failcallback) {
            let res = GM_getValue(key, value);
            empty(callback)(res);
        };
        let GM_delete = typeof GM_deleteValue !== "undefined" ? function(key, callback, failcallback) {
            try {
                GM_deleteValue(key);
                callback();
            } catch (e) {
                failcallback(e);
            }
        } : typeof GM.deleteValue === "undefined" ? function(key, callback, failcallback) {
            GM_set(key, null, callback, failcallback);
        } : function(key, callback, failcallback) {
            GM.deleteValue(key).then((() => {
                empty(callback)();
            })).catch((e => {
                empty(failcallback)(e);
            }));
        };
        function cleanBanList() {
            GM_set("ACFUN_BLOCK_LIST", []);
        }
        function cleanKeyWordList() {
            GM_set("ACFUN_BLOCK_KEYWORDS", []);
        }
        function _isUsingNewCloud(callback) {
            GM_get("USE_NEW_CLOUD", false, callback);
        }
        function _setUsingNewCloud(callback) {
            GM_set("USE_NEW_CLOUD", true);
        }
        function _loadBanList_simple(callback) {
            GM_get("ACFUN_BLOCK_LIST", [], (val => {
                callback(removeDuplicate(val));
            }));
        }
        function _loadKeywords_simple(callback) {
            GM_get("ACFUN_BLOCK_KEYWORDS", [], (val => {
                callback(removeDuplicate(val));
            }));
        }
        function _loadReplyBanList_simple(callback) {
            GM_get("ACFUN_BLOCK_REPLIERS", [], (val => {
                callback(removeDuplicate(val));
            }));
        }
        function _loadBanList(callback, stringOnly = true) {
            GM_get("ACFUN_BLOCK_LIST", [], (list => {
                list = removeDuplicate(list);
                _loadGeneralSetting((setting => {
                    if (setting.useBannedUpRankList) {
                        _loadRankingData((data => {
                            let rankList = data.upRank;
                            if (stringOnly) {
                                rankList = rankList.map((x => x.item));
                            }
                            if (rankList.length) {
                                list = list.concat(rankList);
                            }
                            callback(list);
                        }));
                    } else {
                        callback(list);
                    }
                }));
            }));
        }
        function _loadKeywords(callback, stringOnly = true) {
            GM_get("ACFUN_BLOCK_KEYWORDS", [], (list => {
                list = removeDuplicate(list);
                _loadGeneralSetting((setting => {
                    if (setting.useBannedKeywordsList) {
                        _loadRankingData((data => {
                            let rankList = data.keywordRank;
                            if (stringOnly) {
                                rankList = rankList.map((x => x.item));
                            }
                            if (rankList.length) {
                                list = list.concat(rankList);
                            }
                            callback(list);
                        }));
                    } else {
                        callback(list);
                    }
                }));
            }));
        }
        function _loadReplyBanList(callback, stringOnly = true) {
            GM_get("ACFUN_BLOCK_REPLIERS", [], (list => {
                list = removeDuplicate(list);
                _loadGeneralSetting((setting => {
                    if (setting.useBannedReplierList) {
                        _loadRankingData((data => {
                            let rankList = data.replierRank;
                            if (stringOnly) {
                                rankList = rankList.map((x => x.item));
                            }
                            if (rankList.length) {
                                list = list.concat(rankList);
                            }
                            callback(list);
                        }));
                    } else {
                        callback(list);
                    }
                }));
            }));
        }
        function _updateBanList(d, callback) {
            GM_set("ACFUN_BLOCK_LIST", d, callback);
        }
        function _updateKeywords(d, callback) {
            GM_set("ACFUN_BLOCK_KEYWORDS", d, callback);
        }
        function _updateReplyBanList(d, callback) {
            GM_set("ACFUN_BLOCK_REPLIERS", d, callback);
        }
        __webpack_require__.g["usernameIDCache"] = null;
        function _getUsernameID(callback) {
            let unsafeWindow_alt = unsafeWindow;
            function retry() {
                setTimeout((() => {
                    _getUsernameID(callback);
                }), 1e3);
            }
            if (__webpack_require__.g["usernameIDCache"]) {
                empty(callback)(__webpack_require__.g["usernameIDCache"]);
                return;
            }
            if (typeof unsafeWindow_alt.user !== "undefined") {
                let name = unsafeWindow_alt.user.name;
                if (name !== "用户" && name !== "未知用户" && unsafeWindow_alt.ImSdk) {
                    let id = null;
                    try {
                        id = unsafeWindow_alt.ImSdk.instance.kernel.cache.uid.low;
                    } catch (e) {
                        console.error(e);
                    }
                    __webpack_require__.g["usernameIDCache"] = [ name, id ];
                    empty(callback)(__webpack_require__.g["usernameIDCache"]);
                } else {
                    retry();
                }
            } else {
                let ndom = unsafeWindow_alt.document.querySelector("a.fl.user-name");
                if (ndom) {
                    let name = ndom.innerText.trim();
                    if (name !== "未知用户" && unsafeWindow_alt.ImSdk) {
                        let id = null;
                        try {
                            id = unsafeWindow_alt.ImSdk.instance.kernel.cache.uid;
                        } catch (e) {}
                        __webpack_require__.g["usernameIDCache"] = [ name, id ];
                        empty(callback)(__webpack_require__.g["usernameIDCache"]);
                    } else {
                        retry();
                    }
                } else {
                    retry();
                }
            }
        }
        function _getAllTags(callback) {
            if (typeof __webpack_require__.g["cachedUserTags"] === "undefined") {
                GM_get("ALL_TAGS", {}, (v => {
                    __webpack_require__.g["cachedUserTags"] = v;
                    let cache = __webpack_require__.g["cachedUserTags"];
                    empty(callback)(cache);
                }));
            } else {
                empty(callback)(__webpack_require__.g["cachedUserTags"]);
            }
        }
        function _updateAllTags(callback) {
            __webpack_require__.g["cachedUserTags"] = __webpack_require__.g["cachedUserTags"] ? __webpack_require__.g["cachedUserTags"] : {};
            let ts = __webpack_require__.g["cachedUserTags"];
            let tsnew = {};
            for (let key in ts) {
                if (ts.hasOwnProperty(key)) {
                    if (ts[key].length > 0) {
                        tsnew[key] = ts[key];
                    }
                }
            }
            GM_set("ALL_TAGS", tsnew, (() => {
                empty(callback)();
            }));
        }
        function _addToCommentIndex(id, callback) {
            _getAllCacheIndex((ids => {
                if (ids.indexOf(id) < 0) {
                    ids.push(id);
                    ids.sort(((a, b) => a - b));
                }
                GM_set("COMMENT_CACHE_INDEX", ids, (() => {
                    empty(callback)();
                }));
            }));
        }
        function _deleteFromCommentIndex(id, callback) {
            _getAllCacheIndex((ids => {
                if (ids.indexOf(id) >= 0) {
                    let i = ids.indexOf(id);
                    ids.splice(i, 1);
                    GM_set("COMMENT_CACHE_INDEX", ids, (() => {
                        empty(callback)();
                    }));
                }
            }));
        }
        function _getAllCacheIndex(callback) {
            GM_get("COMMENT_CACHE_INDEX", [], (ids => {
                empty(callback)(ids);
            }));
        }
        function _deleteAllCacheIndex(callback) {
            GM_delete("COMMENT_CACHE_INDEX", (() => {
                empty(callback)();
            }), (() => {
                log_log("删除缓存出错！");
            }));
        }
        function _getCommentCache(id, callback) {
            let cacheId = `COMMENT_CACHE_${id}`;
            GM_get(cacheId, null, (cache => {
                empty(callback)(cache);
            }), (() => {
                empty(callback)(null);
            }));
        }
        function _saveCommentCache(id, cache, callback) {
            let cacheId = `COMMENT_CACHE_${id}`;
            GM_set(cacheId, cache, (() => {
                _addToCommentIndex(id, (() => {
                    empty(callback)();
                }));
            }), (() => {
                console.error("缓存评论失败！");
            }));
        }
        function _deleteCommentCache(id, callback) {
            let cacheId = `COMMENT_CACHE_${id}`;
            GM_delete(cacheId, (() => {
                _deleteFromCommentIndex(id, (() => {
                    empty(callback)();
                }));
            }), (() => {
                console.log("DEBUG 删除缓存失败");
            }));
        }
        function _saveUIPosition(x, y) {
            GM_set("UI_POSITION", {
                x,
                y
            });
        }
        function _loadUIPosition(callback) {
            GM_get("UI_POSITION", {
                x: 0,
                y: 500
            }, (val => {
                callback(val);
            }));
        }
        function _loadGeneralSetting(callback) {
            GM_get("GENERAL_SETTING", {
                showDeletedComment: true,
                showUserTags: true,
                showBanButton: true,
                showMouseover: true,
                autoSync: true,
                showBanStatusTag: true,
                useBannedUpRankList: false,
                useBannedKeywordsList: false,
                useBannedReplierList: false,
                disableAnimation: false,
                usePreload: true
            }, (val => {
                callback(val);
            }));
        }
        function _saveGeneralSetting(setting, callback) {
            GM_set("GENERAL_SETTING", setting, (() => {
                callback();
            }));
        }
        function _loadRankingData(callback) {
            GM_get("RANKING_DATA", {
                time: 0,
                data: null
            }, (val => {
                let timeNow = +new Date;
                let HOUR = 3600 * 1e3;
                if (timeNow - val.time > HOUR) {
                    util.apiRequest({
                        query: "rank",
                        count: 150
                    }, (data => {
                        console.log(data);
                        _cacheRankingData(data, (() => {
                            callback(data);
                        }));
                    }));
                } else {
                    callback(val.data);
                }
            }));
        }
        function _cacheRankingData(data, callback) {
            GM_set("RANKING_DATA", {
                time: +new Date,
                data
            }, (() => {
                callback();
            }));
        }
        function removeDuplicate(list = []) {
            let dict = {};
            list.forEach((item => {
                dict[item] = true;
            }));
            let newList = Object.keys(dict);
            return newList;
        }
        function _banUser(username, callback) {
            username = username.trim();
            _loadBanList_simple((list => {
                list = removeDuplicate(list);
                if (list.indexOf(username) < 0) {
                    list.push(username);
                    _updateBanList(list, (() => {
                        empty(callback)(list);
                    }));
                } else {
                    empty(callback)(list);
                }
            }));
        }
        function _banKeyword(w, callback) {
            w = w.trim();
            _loadKeywords_simple((ws => {
                ws = removeDuplicate(ws);
                if (ws.indexOf(w) < 0) {
                    ws.push(w);
                    _updateKeywords(ws, (() => {
                        empty(callback)(ws);
                    }));
                } else {
                    empty(callback)(ws);
                }
            }));
        }
        function _banReplier(username, callback) {
            username = username.trim();
            _loadReplyBanList_simple((list => {
                list = removeDuplicate(list);
                if (list.indexOf(username) < 0) {
                    list.push(username);
                    _updateReplyBanList(list, (() => {
                        empty(callback)(list);
                    }));
                } else {
                    empty(callback)(list);
                }
            }));
        }
        const js_data = {
            version,
            loadRankingData: _loadRankingData,
            loadGeneralSetting: _loadGeneralSetting,
            saveGeneralSetting: _saveGeneralSetting,
            updateBanList: _updateBanList,
            updateKeywords: _updateKeywords,
            updateReplyBanList: _updateReplyBanList,
            loadBanList: _loadBanList,
            loadReplyBanList: _loadReplyBanList,
            loadKeywords: _loadKeywords,
            copyRankBanLish: callback => {
                function addFunc(list) {
                    if (list.length > 0) {
                        let username = list.splice(0, 1)[0];
                        _banUser(username, (() => {
                            addFunc(list);
                        }));
                    } else {
                        callback();
                    }
                }
                _loadRankingData((data => {
                    let rankList = data.upRank;
                    rankList = rankList.map((x => x.item));
                    if (rankList.length) {
                        addFunc(rankList);
                    }
                }));
            },
            copyRankReplyBanList: callback => {
                function addFunc(list) {
                    if (list.length > 0) {
                        let replier = list.splice(0, 1)[0];
                        _banReplier(replier, (() => {
                            addFunc(list);
                        }));
                    } else {
                        callback();
                    }
                }
                _loadRankingData((data => {
                    let rankList = data.replierRank;
                    rankList = rankList.map((x => x.item));
                    if (rankList.length) {
                        addFunc(rankList);
                    }
                }));
            },
            copyRankKeywords: callback => {
                function addFunc(list) {
                    if (list.length > 0) {
                        let keyword = list.splice(0, 1)[0];
                        _banKeyword(keyword, (() => {
                            addFunc(list);
                        }));
                    } else {
                        callback();
                    }
                }
                _loadRankingData((data => {
                    let rankList = data.keywordRank;
                    rankList = rankList.map((x => x.item));
                    if (rankList.length) {
                        addFunc(rankList);
                    }
                }));
            },
            isUsingNewCloud: _isUsingNewCloud,
            setUsingNewCloud: _setUsingNewCloud,
            getUsernameID: _getUsernameID,
            loadUIPosition: _loadUIPosition,
            saveUIPosition: _saveUIPosition,
            getAllCacheIndex: _getAllCacheIndex,
            deleteAllCacheIndex: _deleteAllCacheIndex,
            getLocalCommentCache: _getCommentCache,
            saveCommentCache: _saveCommentCache,
            deleteCommentCache: _deleteCommentCache,
            getActiveHelpTime: function(callback) {
                let time = 0;
                GM_get("ACTIVE_HELP_TIME", time, (d => {
                    if (typeof d === "undefined" || d === null) d = 0;
                    let d2 = parseInt(d);
                    if (isNaN(d2)) d2 = 0;
                    empty(callback)(d2);
                }));
            },
            setActiveHelpTime(time, callback) {
                let t = typeof time === "undefined" ? +new Date : time;
                GM_set("ACTIVE_HELP_TIME", t, (() => {
                    empty(callback)(t);
                }));
            },
            setUpdateTime(time, callback) {
                let t = typeof time === "undefined" ? +new Date : time;
                GM_set("UPDATE_TIME", t, (() => {
                    empty(callback)(t);
                }));
            },
            getUpdateTime(callback) {
                let time = 0;
                GM_get("UPDATE_TIME", time, (d => {
                    if (typeof d === "undefined" || d === null) d = 0;
                    let d2 = parseInt(d);
                    if (isNaN(d2)) d2 = 0;
                    empty(callback)(parseInt(d2));
                }));
            },
            banUser: _banUser,
            unbanUser(username, callback) {
                username = username.trim();
                _loadBanList_simple((list => {
                    list = removeDuplicate(list);
                    let i = list.indexOf(username);
                    if (i >= 0) {
                        list.splice(i, 1);
                        _updateBanList(list, (() => {
                            empty(callback)(list);
                        }));
                    } else {
                        empty(callback)(list);
                    }
                }));
            },
            banKeyword: _banKeyword,
            unbanKeyword(w, callback) {
                w = w.trim();
                _loadKeywords_simple((ws => {
                    ws = removeDuplicate(ws);
                    let i = ws.indexOf(w);
                    if (i >= 0) {
                        ws.splice(i, 1);
                        _updateKeywords(ws, (() => {
                            empty(callback)(ws);
                        }));
                    } else {
                        empty(callback)(ws);
                    }
                }));
            },
            banReplier: _banReplier,
            unbanReplier(username, callback) {
                username = username.trim();
                _loadReplyBanList_simple((list => {
                    list = removeDuplicate(list);
                    let i = list.indexOf(username);
                    if (i >= 0) {
                        list.splice(i, 1);
                        _updateReplyBanList(list, (() => {
                            empty(callback)(list);
                        }));
                    } else {
                        empty(callback)(list);
                    }
                }));
            },
            getTags(username, callback) {
                username = username.trim();
                _getAllTags((v => {
                    let tags = v[username];
                    empty(callback)(tags ? tags : []);
                }));
            },
            removeTagForUser(username, tag, callback) {
                username = username.trim();
                _getAllTags((v => {
                    let tags = v[username];
                    tags = tags ? tags : [];
                    let i = tags.indexOf(tag);
                    if (i >= 0) {
                        tags.splice(i, 1);
                        v[username] = tags;
                    }
                    __webpack_require__.g["cachedUserTags"] = v;
                    _updateAllTags(callback);
                }));
            },
            addTagToUser(username, tag, callback) {
                username = username.trim();
                _getAllTags((v => {
                    let tags = username in v ? v[username] : [];
                    if (tags.indexOf(tag) < 0) {
                        console.log(tag, "add to ", username);
                        tags.push(tag);
                        v[username] = tags;
                    }
                    __webpack_require__.g["cachedUserTags"] = v;
                    console.log(__webpack_require__.g["cachedUserTags"]);
                    _updateAllTags(callback);
                }));
            },
            AddTagsToUser(username, newtags, callback) {
                username = username.trim();
                _getAllTags().then((v => {
                    let tags = v[username];
                    tags = tags ? tags : [];
                    newtags.forEach((t => {
                        if (tags.indexOf(t) < 0) {
                            tags.push[t];
                        }
                    }));
                    v[username] = tags;
                    __webpack_require__.g["cachedUserTags"] = v;
                    _updateAllTags(callback);
                }));
            },
            getAlltags(callback) {
                _getAllTags((v => {
                    callback(v);
                }));
            }
        };
        function getPageType() {
            let pageUrl = window.location.href.replace("/#/g", "");
            let dict1 = {
                "www.acfun.cn/v/list1/index.htm": "动画",
                "www.acfun.cn/v/list60/index.htm": "娱乐",
                "www.acfun.cn/v/list201/index.htm": "生活",
                "www.acfun.cn/v/list58/index.htm": "音乐",
                "www.acfun.cn/v/list123/index.htm": "舞蹈·偶像",
                "www.acfun.cn/v/list59/index.htm": "游戏",
                "www.acfun.cn/v/list70/index.htm": "科技",
                "www.acfun.cn/v/list68/index.htm": "影视",
                "www.acfun.cn/v/list69/index.htm": "体育",
                "www.acfun.cn/v/list125/index.htm": "鱼塘"
            };
            let dict2 = {
                "www.acfun.cn/u/3216851": "中国日报",
                "www.acfun.cn/u/9755346": "环球时报",
                "www.acfun.cn/u/14194071": "中国网",
                "www.acfun.cn/u/16591709": "法治进行时",
                "www.acfun.cn/u/14706221": "浙样红TV",
                "www.acfun.cn/u/12786860": "新青年工作室",
                "www.acfun.cn/u/16141705": "新华社现场云",
                "www.acfun.cn/u/20143211": "快手",
                "www.acfun.cn/u/13423227": "小央视频",
                "www.acfun.cn/u/30169313": "人民资讯",
                "www.acfun.cn/v/list178/index.htm": "AC正义展览区",
                "www.acfun.cn/bangumilist": "番剧列表",
                "www.acfun.cn/v/list67/index.htm": "TV动画",
                "www.acfun.cn/v/list180/index.htm": "剧场动画",
                "www.acfun.cn/v/list120/index.htm": "国产动画",
                "www.acfun.cn/v/list106/index.htm": "动画综合",
                "www.acfun.cn/v/list190/index.htm": "短片·手书·配音",
                "www.acfun.cn/v/list107/index.htm": "MAD·AMV",
                "www.acfun.cn/v/list108/index.htm": "MMD·3D",
                "www.acfun.cn/v/list207/index.htm": "虚拟偶像",
                "www.acfun.cn/v/list159/index.htm": "动画资讯",
                "www.acfun.cn/v/list133/index.htm": "COSPLAY·声优",
                "www.acfun.cn/v/list99/index.htm": "特摄",
                "www.acfun.cn/v/list212/index.htm": "番剧二创",
                "www.acfun.cn/v/list206/index.htm": "搞笑",
                "www.acfun.cn/v/list87/index.htm": "鬼畜",
                "www.acfun.cn/v/list188/index.htm": "明星",
                "www.acfun.cn/v/list86/index.htm": "生活日常",
                "www.acfun.cn/v/list88/index.htm": "萌宠",
                "www.acfun.cn/v/list89/index.htm": "美食",
                "www.acfun.cn/v/list204/index.htm": "旅行",
                "www.acfun.cn/v/list127/index.htm": "手工·绘画",
                "www.acfun.cn/v/list205/index.htm": "美妆·造型",
                "www.acfun.cn/v/list215/index.htm": "治愈系",
                "www.acfun.cn/v/list136/index.htm": "原创·翻唱",
                "www.acfun.cn/v/list137/index.htm": "演奏·乐器",
                "www.acfun.cn/v/list103/index.htm": "Vocaloid",
                "www.acfun.cn/v/list139/index.htm": "综合音乐",
                "www.acfun.cn/v/list185/index.htm": "音乐选集·电台",
                "www.acfun.cn/v/list218/index.htm": "颜值",
                "www.acfun.cn/v/list134/index.htm": "宅舞",
                "www.acfun.cn/v/list135/index.htm": "综合舞蹈",
                "www.acfun.cn/v/list129/index.htm": "偶像",
                "www.acfun.cn/v/list208/index.htm": "中国舞",
                "www.acfun.cn/v/list214/index.htm": "王者荣耀",
                "www.acfun.cn/v/list210/index.htm": "我的世界",
                "www.acfun.cn/v/list216/index.htm": "和平精英",
                "www.acfun.cn/v/list217/index.htm": "第五人格",
                "www.acfun.cn/v/list85/index.htm": "英雄联盟",
                "www.acfun.cn/v/list145/index.htm": "电子竞技",
                "www.acfun.cn/v/list186/index.htm": "网络游戏",
                "www.acfun.cn/v/list84/index.htm": "主机单机",
                "www.acfun.cn/v/list187/index.htm": "手机游戏",
                "www.acfun.cn/v/list165/index.htm": "桌游卡牌",
                "www.acfun.cn/v/list209/index.htm": "手办模玩",
                "www.acfun.cn/v/list90/index.htm": "科技制造",
                "www.acfun.cn/v/list189/index.htm": "人文科普",
                "www.acfun.cn/v/list122/index.htm": "汽车",
                "www.acfun.cn/v/list91/index.htm": "数码家电",
                "www.acfun.cn/v/list151/index.htm": "演讲·公开课",
                "www.acfun.cn/v/list149/index.htm": "广告",
                "hd.acfun.cn/s/QpdpZsjR": "放映厅",
                "www.acfun.cn/v/list219/index.htm": "影视混剪",
                "www.acfun.cn/v/list192/index.htm": "预告·花絮",
                "www.acfun.cn/v/list193/index.htm": "电影杂谈",
                "www.acfun.cn/v/list194/index.htm": "追剧社",
                "www.acfun.cn/v/list195/index.htm": "综艺show",
                "www.acfun.cn/v/list196/index.htm": "纪录片·短片",
                "www.acfun.cn/v/list152/index.htm": "综合体育",
                "www.acfun.cn/v/list94/index.htm": "足球",
                "www.acfun.cn/v/list95/index.htm": "篮球",
                "www.acfun.cn/v/list153/index.htm": "搏击健身",
                "www.acfun.cn/v/list93/index.htm": "极限竞速",
                "www.acfun.cn/v/list183/index.htm": "普法安全",
                "www.acfun.cn/v/list92/index.htm": "国防军事",
                "www.acfun.cn/v/list131/index.htm": "历史",
                "www.acfun.cn/v/list132/index.htm": "新鲜事·正能量",
                "www.acfun.cn/v/list184/index.htm": "二次元画师",
                "www.acfun.cn/v/list110/index.htm": "综合",
                "www.acfun.cn/v/list73/index.htm": "生活情感",
                "www.acfun.cn/v/list164/index.htm": "游戏",
                "www.acfun.cn/v/list74/index.htm": "动漫文化",
                "www.acfun.cn/v/list75/index.htm": "漫画·文学",
                "www.acfun.cn/v/list63/index.htm": "文章"
            };
            let videoHomes = [ "动画综合", "短片·手书·配音", "MAD·AMV", "MMD·3D", "虚拟偶像", "动画资讯", "COSPLAY·声优", "特摄", "番剧二创", "搞笑", "鬼畜", "明星", "生活日常", "萌宠", "美食", "旅行", "手工·绘画", "美妆·造型", "治愈系", "原创·翻唱", "演奏·乐器", "Vocaloid", "综合音乐", "音乐选集·电台", "颜值", "宅舞", "综合舞蹈", "偶像", "中国舞", "王者荣耀", "我的世界", "和平精英", "第五人格", "英雄联盟", "电子竞技", "网络游戏", "主机单机", "手机游戏", "桌游卡牌", "手办模玩", "科技制造", "人文科普", "汽车", "数码家电", "演讲·公开课", "广告", "放映厅", "影视混剪", "预告·花絮", "电影杂谈", "追剧社", "综艺show", "纪录片·短片", "综合体育", "足球", "篮球", "搏击健身", "极限竞速", "普法安全", "国防军事", "历史", "新鲜事·正能量", "二次元画师" ];
            let articleHome = [ "二次元画师", "综合", "生活情感", "游戏", "动漫文化", "漫画·文学", "文章" ];
            let href = pageUrl;
            if (href === "http://www.acfun.cn/" || href === "https://www.acfun.cn/") {
                return "HOME";
            }
            let regex = /https?:\/\/www\.acfun\.cn\/([av])\/ac\d+/;
            let regex2 = /www\.acfun\.cn\/.*/;
            let test = regex.exec(href);
            let test2 = regex2.exec(href);
            if (test !== null) {
                if (test[1] === "a") {
                    return "ARTICLE";
                }
                if (test[1] === "v") {
                    return "VIDEO";
                }
            }
            let hrefPart = test2[0];
            let pageTitle = dict1[hrefPart];
            if (typeof pageTitle !== "undefined" && pageTitle !== null) {
                return "VIDEO_HOME";
            }
            let regexAS = /www\.acfun\.cn\/v\/as(\d+)/;
            let testAS = regexAS.exec(href);
            if (testAS) {
                let num = parseInt(testAS[1]);
                if (num > 0) {
                    return "ARTICLE_HOME";
                }
            }
            pageTitle = dict2[hrefPart];
            if (typeof pageTitle !== "undefined" && pageTitle !== null) {
                if (videoHomes.indexOf(pageTitle) >= 0) {
                    return "VIDEO_HOME";
                }
                if (articleHome.indexOf(pageTitle) >= 0) {
                    return "ARTICLE_HOME";
                }
                return "OTHER";
            } else {
                return "OTHER";
            }
        }
        var style = __webpack_require__(547);
        var code = '<div id="helperUI" class="helper-wrap" style="pointer-events:none"> <div class="helper-wrap-inner"> <div style="pointer-events:all" class="helper-main c-a ui-hidden smooth"> <div class="plugin-hint" id="hide_hint">隐藏插件--\x3e</div> <div class="page-wrap"> <div class="plugin-menu-title">插件设置</div> <div class="menu-wrap"> <div class="menu-column"> <a id="bannedAuthours">Ｕ Ｐ 主</a> <a id="bannedRepliers">回 复 者</a> <a id="bannedKeywords">关 键 词</a> <a id="preloadSetting">预 加 载</a> <a id="commentRecovery">评论恢复</a> </div> <div class="menu-column"> <a id="cloudsync">云 同 步</a> <a id="generalSetting">通用设置</a> <a id="sharedRankList">屏蔽排名</a> <a id="aboutme">关于插件</a> <a href="https://baldhumanity.top/acfun">网站主页</a> </div> </div> <div class="plugin-downloader-version">0.00</div> <div class="plugin-version">0.00</div> <div class="plugin-author">作恶者：<a href="https://message.acfun.cn/im?targetId=690324" style="color:#00f">人文情怀</a></div> </div> <div class="page-wrap inactive-page" id="ban_up_page"> <a class="go-back">返回</a> <div class="plugin-add-ban-up"> <input class="ban-title-input" type="text" maxlength="16" placeholder="输入UP主名字..."/> <input class="ban-item-submit" type="button" value="屏蔽"> </div> <div class="banned-items"> <div class="banned-item"> <span class="banned-title">我是名字</span> <button>×</button> </div> </div> </div> <div class="page-wrap inactive-page" id="ban_replier_page"> <a class="go-back">返回</a> <div class="plugin-add-ban-up"> <input class="ban-title-input" type="text" maxlength="16" placeholder="输入评论者名字..."/> <input class="ban-item-submit" type="button" value="屏蔽"> </div> <div class="banned-items"> <div class="banned-item"> <span class="banned-title">我是名字</span> <button>×</button> </div> </div> </div> <div class="page-wrap inactive-page" id="ban_keyword_page"> <a class="go-back">返回</a> <div class="plugin-add-ban-up"> <input class="ban-title-input" type="text" maxlength="16" placeholder="输入屏蔽关键词..."/> <input class="ban-item-submit" type="button" value="屏蔽"> </div> <div class="banned-items"> <div class="banned-item"> <span class="banned-title">LOL</span> <button>×</button> </div> </div> </div> <div class="page-wrap inactive-page" id="cloudsync_page"> <a class="go-back">返回</a> <div class="about-page-content"> <div class="cloud-description"> 插件会上传你的屏蔽列表，只要安装插件的浏览器，登录同一个AC帐号都可以同步屏蔽。 </div> <div class="sync-time"></div> <hr> <div> <button id="syncNow">立即同步</button> </div> </div> </div> <div class="page-wrap inactive-page" id="preload_page"> <a class="go-back">返回</a> <div class="about-page-content"> <div class="cloud-description"> <b>文章区预加载。</b><br/> <label class="cc-container" data-id="usePreload">启用预加载 <input type="checkbox" checked="checked"> <span class="checkmark"></span> </label> 插件将自动下载主页文章文章内容，检查内部文字，如果包含你屏蔽的关键词，将会在你打开文章之前在主页屏蔽文章。<br/> </div> <hr> <div> <div style="width:100%"><button id="clearPreloadCache">清除缓存</button></div> <div id="clearCacheInfo"></div> </div> </div> </div> <div class="page-wrap inactive-page" id="recovery_page"> <a class="go-back">返回</a> <div class="about-page-content" style="float:none"> <div class="no-float"> 3.000版本新功能：查看已删除评论！<br/> 插件将备份所有你浏览过的投稿的评论。并且在其他人请求时，共享出去。<br/> 只要越多人用插件，评论恢复的几率就越高。<br/> </div> <hr> <div class="no-float"> <b><span class="cache-info"></span></b> <button id="delete_cache">删除缓存</button> </div> <hr> <div class="no-float"> <label>被删评论查询<input type="text" placeholder="输入评论家ID..." class="lookup-cache-input" id="lookup_cache_input"></label> <button id="lookup_cache">查询</button> </div> </div> </div> <div class="page-wrap inactive-page" id="general_page"> <a class="go-back">返回</a> <div class="about-page-content"> <div> <label class="cc-container" data-id="showBanButton">在首页的投稿右上角显示[屏蔽]图标按钮 <input type="checkbox" checked="checked"> <span class="checkmark"></span> </label> <label class="cc-container" data-id="showMouseover">在首页鼠标悬停被屏蔽投稿，将显示内容 <input type="checkbox" checked="checked"> <span class="checkmark"></span> </label> <label class="cc-container" data-id="autoSync">自动云同步所有列表 <input type="checkbox" checked="checked"> <span class="checkmark"></span> </label> <label class="cc-container" data-id="showDeletedComment">显示投稿内被删除评论 <input type="checkbox" checked="checked"> <span class="checkmark"></span> </label> <label class="cc-container" data-id="showUserTags">显示评论用户标签 <input type="checkbox" checked="checked"> <span class="checkmark"></span> </label> <label class="cc-container" data-id="showBanStatusTag">显示投稿页左侧屏蔽状态 <input type="checkbox" checked="checked"> <span class="checkmark"></span> </label> <label class="cc-container" data-id="disableAnimation">禁止评论区动画 <input type="checkbox" checked="checked"> <span class="checkmark"></span> </label> </div> </div> </div> <div class="page-wrap inactive-page" id="sharedRankList_page"> <a class="go-back">返回</a> <div class="about-page-content"> <div style="float:none"> <label class="cc-container" data-id="useBannedUpRankList">屏蔽排行榜上UP <input type="checkbox" checked="checked"> <span class="checkmark"></span> <br> <a id="copy_uprank">复制到我的列表</a> </label> </div> <div style="float:none"> <label class="cc-container" data-id="useBannedKeywordsList">屏蔽排行榜上关键词 <input type="checkbox" checked="checked"> <span class="checkmark"></span> <br> <a id="copy_keywordrank">复制到我的列表</a> </label> </div> <div style="float:none"> <label class="cc-container" data-id="useBannedReplierList">屏蔽排行榜上评论家 <input type="checkbox" checked="checked"> <span class="checkmark"></span> <br> <a id="copy_replierrank">复制到我的列表</a> </label> </div> <div style="float:none"> <a href="https://baldhumanity.top/acfun/ranking.html" style="color:#00008b">点击这里查看排行榜</a> </div> </div> </div> <div class="page-wrap inactive-page" id="about_page"> <a class="go-back">返回</a> <div class="about-page-content"> 本插件持续更新中：） 只要我有空。 </div> </div> </div> <div style="pointer-events:all" class="ac-girl ac-girl-hide smooth"> </div> </div> </div>';
        const mainUI = code;
        function _getStorage() {
            if (typeof __webpack_require__.g["eventStorage"] === "undefined") {
                __webpack_require__.g["eventStorage"] = {};
            }
            return __webpack_require__.g["eventStorage"];
        }
        function _getNewEventId() {
            if (typeof __webpack_require__.g["eventCount"] === "undefined") {
                __webpack_require__.g["eventCount"] = 0;
            }
            __webpack_require__.g["eventCount"]++;
            return __webpack_require__.g["eventCount"];
        }
        const js_event = {
            on: function(eventName, callback) {
                let s = _getStorage();
                if (!(eventName in s)) {
                    s[eventName] = [];
                }
                let id = _getNewEventId();
                s[eventName].push({
                    id,
                    callback
                });
            },
            emit: function(eventName, data) {
                let s = _getStorage();
                if (eventName in s) {
                    let list = s[eventName];
                    list.forEach((e => {
                        e.callback(data);
                    }));
                }
            },
            emit1: function(eventName, data) {
                console.log("emit event", eventName);
                let doc = unsafeWindow.document;
                let event = new CustomEvent(eventName, {
                    detail: {
                        data
                    },
                    bubbles: true,
                    cancelable: false,
                    composed: false
                });
                setTimeout((() => {
                    doc.dispatchEvent(event);
                }));
            },
            on1: function(eventName, callback) {
                let doc = unsafeWindow.document;
                doc.addEventListener(eventName, (e => {
                    callback(e.detail.data);
                }));
            },
            onSpecific: function(domElement, eventName, callback) {
                domElement.addEventListener(eventName, (e => {
                    callback(e.detail.data);
                }));
            }
        };
        var recoveryUI_code = '<div class="deleted-comments-container remove"> <div class="deleted-comments-inner"> <div class="deleted-comments-title">被删除楼层<div class="hide-btn">隐藏未收录</div></div> <div class="deleted-comment-list"> </div> </div> </div>';
        const recoveryUI = recoveryUI_code;
        var deletedComment_code = '<div class="comment-info"> <div class="comment-floor">35</div> <div class="comment-query-state">查询中……</div> <div class="comment-username remove"></div> </div> <div class="comment-content remove"> <div class="comment-text">评论已删除</div> <div class="comment-time">2021-10-18 12:21:01</div> </div>';
        const deletedComment = deletedComment_code;
        var udp_code = ' <div class="udp-container udp-hidden"> <div class="udp-close">×</div> <div class="udp-title"></div> <div class="udp-inner"> </div> </div>';
        const udp = udp_code;
        const maskImageURL = "https://imgs.aixifan.com/newUpload/75227596_8b5f755ce66e42d497dc273b13fc7c44.jpg";
        const maskShowURL = "https://imgs.aixifan.com/newUpload/75227596_3d3f65d8c9f941c19ea85b01f51a5b02.png";
        const MAX_CHUNK_SIZE = 5036993;
        const imageCache = {
            maskImage: null,
            maskShow: null,
            maskImageBytes: null,
            maskShowBytes: null,
            maskImageDimensions: null,
            maskShowDimensions: null
        };
        function fetchImage(url) {
            return new Promise(((resolve, reject) => {
                const xhr = new util.XMLHttpRequest;
                xhr.open("GET", url);
                xhr.responseType = "blob";
                xhr.onload = function() {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(xhr.response);
                    } else {
                        reject(new Error("Failed to load image: " + xhr.statusText));
                    }
                };
                xhr.onerror = function() {
                    reject(new Error("Network error"));
                };
                xhr.send();
            }));
        }
        async function getMasks() {
            if (imageCache.maskImage === null || imageCache.maskShow === null) {
                let maskImage = await fetchImage(maskImageURL);
                imageCache.maskImage = maskImage;
                imageCache.maskImageBytes = await fileToByteArray(maskImage);
                let img = new Image;
                img.src = URL.createObjectURL(maskImage);
                img.onload = function() {
                    imageCache.maskImageDimensions = {
                        width: img.width,
                        height: img.height
                    };
                };
                let maskShow = await fetchImage(maskShowURL);
                imageCache.maskShow = maskShow;
                imageCache.maskShowBytes = await fileToByteArray(maskShow);
                img.src = URL.createObjectURL(maskShow);
                img.onload = function() {
                    imageCache.maskShowDimensions = {
                        width: img.width,
                        height: img.height
                    };
                };
            }
        }
        function AddCSS() {
            const style = document.createElement("style");
            document.head.appendChild(style);
            style.sheet.insertRule(`\n        .edui-btn-extra {\n           font-size: 12px;\n           user-select: none;\n           cursor: pointer;\n        }\n    `, style.sheet.cssRules.length);
            style.sheet.insertRule(`\n       \n        .edui-btn-extra:hover {\n            color:#888\n        }\n    `, style.sheet.cssRules.length);
            style.sheet.insertRule(`\n        .mask-upload-area {\n            background-color: rgba(54,54,54,1);\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            z-index: 100;\n            \n        }\n    `, style.sheet.cssRules.length);
            style.sheet.insertRule(`\n        .mask-upload-area .edui-btn {\n            color: white;\n            background-color: rgba(77,77,77,0.72);\n            border-radius: 4px;\n            padding: 5px 10px;\n            cursor: pointer;\n            user-select: none;\n            font-size: 16px;\n            min-width: 100px;\n            text-align: center;\n            min-height: 30px;\n        }\n    `, style.sheet.cssRules.length);
            style.sheet.insertRule(`\n        .preview-container {\n            background-color: #444;\n            border-radius: 4px;\n            border-width: 0px;\n            overflow: hidden;\n            position: absolute;\n            top: 10px;\n            left: 10px;\n            width: 50%;\n            height: calc(100% - 20px);\n        }\n    `, style.sheet.cssRules.length);
            style.sheet.insertRule(`\n        .progress-view {\n            background-color: rgba(54,54,54,1);\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            z-index: 102;\n        }\n    `, style.sheet.cssRules.length);
            style.sheet.insertRule(`\n        .progress-view .progress-bar-container {\n            background-color: #555;\n            position: absolute;\n            top: 50%;\n            left: 10%;\n            width: 80%;\n            height: 20px;\n            transform: translate(0%,-50%);\n        }\n    `, style.sheet.cssRules.length);
            style.sheet.insertRule(`\n        .progress-view .progress-bar {\n            background-color: rgb(255,255,238);\n            height: 100%;\n            width: 0%;\n            transition: width 0.3s;\n        }\n    `, style.sheet.cssRules.length);
            style.sheet.insertRule(`\n        .progress-view .progress-text {\n            position: absolute;\n            top: 40%;\n            left: 50%;\n            transform: translate(-50%,-50%);\n            color: white;\n            \n        }\n    `, style.sheet.cssRules.length);
        }
        let initialized = false;
        const uiNodes = {
            uploadArea: null,
            uploadButton: null,
            fileInput: null,
            cancelButton: null,
            startUploadingButton: null,
            fileInputButton: null,
            previewContainer: null,
            previewImage: null,
            previewVideo: null,
            contentInformation: null,
            contentTitle: null,
            contentSize: null,
            contentType: null,
            contentResolution: null,
            contentFileLoadingLocally: null,
            eduiContainer: null,
            editorBodyContainer: null,
            progressView: null,
            progressBar: null,
            progressText: null
        };
        const innerACFun_data = {
            fileURL: null,
            fileData: null,
            fileType: null,
            fileSize: null,
            fileResolution: null,
            fileName: null
        };
        function fileToObjectURL(file) {
            if (!file) {
                return null;
            }
            return URL.createObjectURL(file);
        }
        function fileToByteArray(file) {
            if (!file) {
                return null;
            }
            return new Promise(((resolve, reject) => {
                let reader = new FileReader;
                reader.onload = function(e) {
                    resolve(new Uint8Array(e.target.result));
                };
                reader.readAsArrayBuffer(file);
            }));
        }
        function formatFileSize(size) {
            let units = [ "B", "KB", "MB", "GB", "TB" ];
            let i = 0;
            while (size > 1024) {
                size = size / 1024;
                i++;
            }
            return `${size.toFixed(2)} ${units[i]}`;
        }
        async function getImageResolution(dataURL) {
            return new Promise(((resolve, reject) => {
                let img = new Image;
                img.onload = function() {
                    resolve({
                        width: img.width,
                        height: img.height
                    });
                };
                img.src = dataURL;
            }));
        }
        async function handleOnFileSelect(e) {
            let file = e.target.files[0];
            if (!file) {
                uiNodes.fileInputButton.style.display = "block";
                return;
            }
            if (file.size > 100 * 1024 * 1024) {
                unsafeWindow.A.emit("global::error", "文件必须在100M以内,放过AC娘吧!");
                uiNodes.fileInputButton.style.display = "block";
                return;
            }
            let fileURL = fileToObjectURL(file);
            innerACFun_data.fileURL = fileURL;
            innerACFun_data.fileData = await fileToByteArray(file);
            let fileSize = e.target.files[0].size;
            innerACFun_data.fileSize = fileSize;
            let fileType = e.target.files[0].type;
            innerACFun_data.fileType = fileType;
            let filename = e.target.files[0].name;
            innerACFun_data.fileName = filename;
            uiNodes.contentTitle.innerText = `文件名：${filename}`;
            uiNodes.contentSize.innerText = `文件大小：${formatFileSize(fileSize)} 字节`;
            uiNodes.contentType.innerText = `文件类型：${fileType}`;
            uiNodes.contentInformation.style.display = "block";
            uiNodes.previewImage.style.display = fileType.includes("image") ? "block" : "none";
            uiNodes.previewVideo.style.display = fileType.includes("video") ? "block" : "none";
            if (fileType.includes("image")) {
                uiNodes.previewImage.src = fileURL;
                let fileResolution = await getImageResolution(fileURL);
                innerACFun_data.fileResolution = fileResolution;
                uiNodes.contentResolution.innerText = `尺寸：${fileResolution.width}x${fileResolution.height}`;
            }
            if (fileType.includes("video")) {
                let video = uiNodes.previewVideo;
                video.src = fileURL;
                video.onloadedmetadata = function() {
                    innerACFun_data.fileResolution = {
                        width: video.videoWidth,
                        height: video.videoHeight
                    };
                    uiNodes.contentResolution.innerText = `尺寸：${video.videoWidth}x${video.videoHeight}`;
                };
            }
            if (!fileType.includes("image") && !fileType.includes("video")) {
                uiNodes.previewImage.style.display = "none";
                uiNodes.previewVideo.style.display = "none";
                uiNodes.contentResolution.innerText = "";
                let ext = filename.split(".").pop().toUpperCase();
                uiNodes.contentType.innerText = `文件类型：${ext}`;
            }
            uiNodes.fileInputButton.style.display = "block";
            if (fileSize < 100 * 1024 * 1024) {
                uiNodes.startUploadingButton.style.display = "block";
            }
        }
        function innerACFun_reset() {
            innerACFun_data.fileData = null;
            innerACFun_data.fileType = null;
            innerACFun_data.fileSize = null;
            innerACFun_data.fileResolution = null;
            innerACFun_data.fileURL = null;
            innerACFun_data.fileName = null;
            uiNodes.fileInput.value = "";
            uiNodes.previewImage.style.display = "none";
            uiNodes.previewVideo.style.display = "none";
            uiNodes.contentInformation.style.display = "none";
            uiNodes.startUploadingButton.style.display = "none";
            uiNodes.previewImage.src = "";
            uiNodes.previewVideo.src = "";
            uiNodes.contentSize.innerText = "";
            uiNodes.contentType.innerText = "";
            uiNodes.contentResolution.innerText = "";
            uiNodes.uploadArea.style.display = "none";
            uiNodes.editorBodyContainer.style.height = "66px";
            setUploadProgress(0);
        }
        function addImageToContainer(url) {
            let bodyContainer = uiNodes.editorBodyContainer;
            let img = document.createElement("img");
            img.src = url;
            bodyContainer.appendChild(img);
        }
        async function startUpload() {
            let acId = util.getCurrentAcId();
            let filename = innerACFun_data.fileName;
            log_log("start uploading", innerACFun_data);
            let bytes = innerACFun_data.fileData;
            let chunks = [];
            let offset = 0;
            log_log(imageCache);
            function getMaxChunkSize(i) {
                return i === 0 ? MAX_CHUNK_SIZE - imageCache.maskShowBytes.byteLength : MAX_CHUNK_SIZE - imageCache.maskImageBytes.byteLength;
            }
            let chunk_count = 0;
            let header = {
                name: filename,
                type: innerACFun_data.fileType,
                size: innerACFun_data.fileSize
            };
            let headerBytes = (new TextEncoder).encode(JSON.stringify(header));
            let headerLength = headerBytes.byteLength;
            showProgressView();
            uiNodes.editorBodyContainer.innerHTML = "";
            let totalSize = 0;
            let i = 0;
            let chunkSizes = [];
            while (offset < bytes.byteLength) {
                let chunkSize = getMaxChunkSize(i) - headerLength - 4;
                if (i === 0) {
                    totalSize += imageCache.maskShowBytes.byteLength + headerLength + headerBytes.byteLength + chunkSize;
                } else {
                    totalSize += imageCache.maskImageBytes.byteLength + chunkSize;
                }
                offset += chunkSize;
                chunkSizes.push(chunkSize);
                i++;
            }
            offset = 0;
            while (offset < bytes.byteLength) {
                let chunkSize = getMaxChunkSize(chunks.length) - headerLength - 4;
                let chunk = bytes.slice(offset, offset + chunkSize);
                if (chunks.length === 0) {
                    let headerLengthBytes = new Uint8Array(new Int32Array([ headerLength ]).buffer);
                    chunk = new Uint8Array([ ...imageCache.maskShowBytes, ...headerLengthBytes, ...headerBytes, ...chunk ]);
                    chunks.push(chunk);
                } else {
                    chunk = new Uint8Array([ ...imageCache.maskImageBytes, ...chunk ]);
                    chunks.push(chunk);
                }
                let chunkBuffer = chunk.buffer;
                let url = await util.uploadImage(acId, chunkBuffer, ((i, total_count) => {
                    let currentChunkSize = chunkSizes[chunk_count];
                    let currentChunkOffset = i / total_count * currentChunkSize;
                    let progress = Math.ceil((currentChunkOffset + offset) / totalSize * 100);
                    setUploadProgress(progress);
                }));
                offset += chunkSize;
                chunk_count++;
                addImageToContainer(url);
                let progress = Math.ceil(offset / totalSize * 100);
                setUploadProgress(progress);
                await new Promise((resolve => {
                    setTimeout(resolve, 0);
                }));
            }
            let p = document.createElement("div");
            p.innerText = "内容仅屏蔽插件用户可见";
            p.style.fontSize = "9px";
            uiNodes.editorBodyContainer.appendChild(p);
            let btn = uiNodes.eduiContainer.querySelector(".btn-send-comment");
            btn.click();
            hideProgressView();
            innerACFun_reset();
        }
        function setUploadProgress(progress) {
            uiNodes.progressBar.style.width = progress + "%";
            uiNodes.progressText.innerText = `上传中...${progress}%`;
        }
        function showProgressView() {
            uiNodes.progressView.style.display = "block";
        }
        function hideProgressView() {
            uiNodes.progressView.style.display = "none";
        }
        function AddUI() {
            if (initialized) {
                return;
            }
            AddCSS();
            let doc = unsafeWindow.document;
            let container = doc.querySelector(".edui-container");
            container.style.position = "relative";
            uiNodes.eduiContainer = container;
            let editorBodyContainer = doc.querySelector(".edui-body-container");
            editorBodyContainer.style.height = "66px";
            editorBodyContainer.style.transition = "height 0.3s";
            uiNodes.editorBodyContainer = editorBodyContainer;
            let uploadArea = doc.createElement("div");
            uploadArea.classList.add("mask-upload-area");
            uploadArea.style.display = "none";
            container.appendChild(uploadArea);
            uiNodes.uploadArea = uploadArea;
            let uploadAreaContent = doc.createElement("div");
            uploadAreaContent.style.position = "relative";
            uploadAreaContent.style.width = "100%";
            uploadAreaContent.style.height = "100%";
            uploadArea.appendChild(uploadAreaContent);
            let cancelButton = doc.createElement("div");
            cancelButton.classList.add("edui-btn");
            cancelButton.innerText = "取消";
            cancelButton.style.position = "absolute";
            cancelButton.style.bottom = "10px";
            cancelButton.style.right = "10px";
            cancelButton.style.width = "100px";
            cancelButton.addEventListener("click", innerACFun_reset);
            uploadAreaContent.appendChild(cancelButton);
            let startUploadButton = doc.createElement("div");
            startUploadButton.classList.add("edui-btn");
            startUploadButton.innerText = "开始上传";
            startUploadButton.style.position = "absolute";
            startUploadButton.style.display = "none";
            startUploadButton.style.bottom = "50px";
            startUploadButton.style.right = "10px";
            startUploadButton.style.width = "100px";
            startUploadButton.addEventListener("click", startUpload);
            uploadAreaContent.appendChild(startUploadButton);
            uiNodes.startUploadingButton = startUploadButton;
            let fileInput = doc.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "image/*,video/*";
            fileInput.style.display = "none";
            fileInput.multiple = false;
            uploadAreaContent.appendChild(fileInput);
            uiNodes.fileInput = fileInput;
            let fileInputButton = doc.createElement("div");
            fileInputButton.classList.add("edui-btn");
            fileInputButton.innerText = "选择文件";
            fileInputButton.style.position = "absolute";
            fileInputButton.style.top = "50%";
            fileInputButton.style.left = "25%";
            fileInputButton.style.zIndex = "101";
            fileInputButton.style.transform = "translate(-50%,-50%)";
            uploadAreaContent.appendChild(fileInputButton);
            fileInputButton.addEventListener("click", (() => {
                fileInput.click();
            }));
            fileInput.addEventListener("change", (async e => {
                fileInputButton.style.display = "none";
                contentFileLoadingLocally.style.display = "block";
                await handleOnFileSelect(e);
                fileInputButton.style.display = "block";
                contentFileLoadingLocally.style.display = "none";
            }));
            uiNodes.fileInputButton = fileInputButton;
            let previewContainer = doc.createElement("div");
            previewContainer.classList.add("preview-container");
            uploadAreaContent.appendChild(previewContainer);
            uiNodes.previewContainer = previewContainer;
            let previewImage = doc.createElement("img");
            previewImage.style.width = "100%";
            previewImage.style.height = "100%";
            previewImage.style.display = "none";
            previewImage.style.objectFit = "contain";
            previewContainer.appendChild(previewImage);
            uiNodes.previewImage = previewImage;
            let contentFileLoadingLocally = doc.createElement("div");
            contentFileLoadingLocally.innerText = "文件加载中……";
            contentFileLoadingLocally.style.position = "absolute";
            contentFileLoadingLocally.style.top = "10px";
            contentFileLoadingLocally.style.left = "10px";
            contentFileLoadingLocally.style.width = "calc(80% - 120px)";
            contentFileLoadingLocally.style.height = "calc(80% - 20px)";
            contentFileLoadingLocally.style.display = "none";
            contentFileLoadingLocally.style.zIndex = "101";
            contentFileLoadingLocally.style.fontSize = "24px";
            uploadAreaContent.appendChild(contentFileLoadingLocally);
            uiNodes.contentFileLoadingLocally = contentFileLoadingLocally;
            let previewVideo = doc.createElement("video");
            previewVideo.style.width = "100%";
            previewVideo.style.height = "100%";
            previewVideo.style.objectFit = "contain";
            previewVideo.style.display = "none";
            previewVideo.controls = true;
            previewContainer.appendChild(previewVideo);
            uiNodes.previewVideo = previewVideo;
            let contentInformation = doc.createElement("div");
            contentInformation.style.position = "absolute";
            contentInformation.style.top = "10px";
            contentInformation.style.right = "10px";
            contentInformation.style.width = "30%";
            contentInformation.style.left = "calc(50% + 20px)";
            contentInformation.style.height = "calc(100% - 20px)";
            contentInformation.style.color = "white";
            contentInformation.style.display = "none";
            uploadAreaContent.appendChild(contentInformation);
            uiNodes.contentInformation = contentInformation;
            let contentTitle = doc.createElement("div");
            contentTitle.innerText = "内容信息";
            contentTitle.style.fontSize = "14px";
            contentTitle.style.padding = "3px";
            contentTitle.style.whiteSpace = "nowrap";
            contentTitle.style.overflow = "hidden";
            contentTitle.style.textOverflow = "ellipsis";
            contentInformation.appendChild(contentTitle);
            uiNodes.contentTitle = contentTitle;
            let contentSize = doc.createElement("div");
            contentSize.innerText = "文件大小：";
            contentSize.style.fontSize = "12px";
            contentSize.style.padding = "3px";
            contentSize.style.whiteSpace = "nowrap";
            contentSize.style.overflow = "hidden";
            contentSize.style.textOverflow = "ellipsis";
            contentInformation.appendChild(contentSize);
            uiNodes.contentSize = contentSize;
            let contentType = doc.createElement("div");
            contentType.innerText = "文件类型：";
            contentType.style.fontSize = "12px";
            contentType.style.padding = "3px";
            contentInformation.appendChild(contentType);
            uiNodes.contentType = contentType;
            let contentResolution = doc.createElement("div");
            contentResolution.innerText = "尺寸：";
            contentResolution.style.fontSize = "12px";
            contentResolution.style.padding = "3px";
            contentInformation.appendChild(contentResolution);
            uiNodes.contentResolution = contentResolution;
            let hintLabel = doc.createElement("div");
            hintLabel.style.position = "absolute";
            hintLabel.style.bottom = "10px";
            hintLabel.style.left = "calc(50% + 20px)";
            hintLabel.style.color = "white";
            hintLabel.style.fontSize = "10px";
            hintLabel.style.whiteSpace = "nowrap";
            hintLabel.innerText = "文件大小限制100M;\n只有插件用户才能查看;\n图片/视频/随便..\n责任声明:每个人对自己的内容负责。\n偷偷的用用，别发违法的东西。\n某虚的封号，就是因为被举报给猴子使用插件了。";
            uploadAreaContent.appendChild(hintLabel);
            let progressView = doc.createElement("div");
            progressView.classList.add("progress-view");
            progressView.style.display = "none";
            container.appendChild(progressView);
            uiNodes.progressView = progressView;
            let progressBarContainer = doc.createElement("div");
            progressBarContainer.classList.add("progress-bar-container");
            progressView.appendChild(progressBarContainer);
            let progressBar = doc.createElement("div");
            progressBar.classList.add("progress-bar");
            progressBarContainer.appendChild(progressBar);
            uiNodes.progressBar = progressBar;
            let progressText = doc.createElement("div");
            progressText.classList.add("progress-text");
            progressText.innerText = "上传中...";
            progressView.appendChild(progressText);
            uiNodes.progressText = progressText;
            let toolbar = doc.querySelector(".edui-btn-toolbar");
            let imageUploadBtn = toolbar.querySelector(".edui-btn-image");
            let btnWrapper = toolbar.querySelector(".button-wrapper");
            let separator = doc.createElement("div");
            separator.classList.add("edui-separator");
            separator.setAttribute("unselectable", "on");
            separator.setAttribute("onmousedown", "return false");
            toolbar.insertBefore(separator, imageUploadBtn.nextSibling);
            let ExtraUploadButton = doc.createElement("div");
            ExtraUploadButton.classList.add("edui-btn");
            ExtraUploadButton.classList.add("edui-btn-extra");
            ExtraUploadButton.innerText = "里区上传";
            toolbar.insertBefore(ExtraUploadButton, separator.nextSibling);
            uiNodes.uploadButton = ExtraUploadButton;
            ExtraUploadButton.addEventListener("click", (() => {
                log_log("clicked");
                uploadArea.style.display = "block";
                editorBodyContainer.style.height = "236px";
            }));
        }
        async function isMaskImage(imageUrl) {
            log_log("check mask 1");
            let dimensions = await getImageResolution(imageUrl);
            log_log("check dim", dimensions, imageCache.maskShowDimensions);
            if (dimensions.width !== imageCache.maskShowDimensions.width || dimensions.height !== imageCache.maskShowDimensions.height) {
                return false;
            }
            let imageBlob = await fetchImage(imageUrl);
            let imageBytes = await fileToByteArray(imageBlob);
            let headLength = imageCache.maskShowBytes.byteLength;
            if (imageBytes.byteLength < headLength + 4 + 20) {
                return false;
            }
            let headBytes = imageBytes.slice(0, headLength);
            let maskHeadBytes = imageCache.maskShowBytes;
            for (let i = 0; i < headLength; i++) {
                if (headBytes[i] !== maskHeadBytes[i]) {
                    return false;
                }
            }
            return true;
        }
        async function extractFileFromImages(imageUrlList) {
            let imageList = [];
            for (let i = 0; i < imageUrlList.length; i++) {
                let blob = await fetchImage(imageUrlList[i]);
                imageList.push(await fileToByteArray(blob));
            }
            let result = [];
            let headLength = imageCache.maskShowBytes.byteLength;
            let shortHeadLength = imageCache.maskImageBytes.byteLength;
            let headerLength = 4;
            let headerLengthBytes = imageList[0].slice(headLength, headLength + 4);
            let headerLengthInt = new Int32Array(headerLengthBytes.buffer)[0];
            let headerBytes = imageList[0].slice(headLength + 4, headLength + 4 + headerLengthInt);
            let header = JSON.parse((new TextDecoder).decode(headerBytes));
            let offset = headLength + 4 + headerLengthInt;
            let chunk = imageList[0].slice(offset);
            let totalSize = chunk.byteLength;
            result.push(chunk);
            for (let i = 1; i < imageList.length; i++) {
                chunk = imageList[i].slice(shortHeadLength);
                result.push(chunk);
                totalSize += chunk.byteLength;
            }
            let merged = new Uint8Array(totalSize);
            let offset2 = 0;
            result.forEach((chunk => {
                merged.set(chunk, offset2);
                offset2 += chunk.byteLength;
            }));
            return {
                info: header,
                data: merged
            };
        }
        function innerACFun_init() {
            log_log("Initializing innerACFun");
            const observer = new MutationObserver((mutations => {
                mutations.forEach((mutation => {
                    mutation.addedNodes.forEach((node => {
                        if (node.classList && node.classList.contains("area-editor")) {
                            setTimeout((() => {
                                AddUI();
                                observer.disconnect();
                            }), 100);
                        }
                    }));
                }));
            }));
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            getMasks();
        }
        const innerACFun = {
            init: innerACFun_init,
            isMaskImage,
            extractFileFromImages
        };
        let commentUI_unsafeWindow_alt = window;
        var cumulativeOffset = function(element) {
            var top = 0, left = 0;
            do {
                top += element.offsetTop || 0;
                left += element.offsetLeft || 0;
                element = element.offsetParent;
            } while (element);
            return {
                top,
                left
            };
        };
        function _observer() {
            let mutationObserver = new MutationObserver((function(mutations) {
                mutations.forEach((function(mutation) {
                    let target = mutation.target;
                    if (target.tagName === "DIV") {
                        setTimeout((() => {
                            _repositionUI();
                        }), 500);
                    }
                }));
            }));
            mutationObserver.observe(commentUI_unsafeWindow_alt.document, {
                subtree: true,
                childList: true
            });
        }
        function _repositionUI() {
            let doc = commentUI_unsafeWindow_alt.document;
            let main = doc.querySelector("#main");
            if (!main) {
                setTimeout(_repositionUI, 1e3);
                return;
            }
            let commentDIv = main.querySelector(".ac-comment-list");
            if (!commentDIv) return;
            let rect = commentDIv.getBoundingClientRect();
            let offsets = cumulativeOffset(commentDIv);
            let uidom = doc.body.querySelector(".deleted-comments-container");
            uidom.style.top = offsets.top + "px";
            uidom.style.left = offsets.left + rect.width + 30 + "px";
            let height = Math.max(commentDIv.scrollHeight, commentDIv.offsetHeight);
            uidom.style.height = `${height - 100}px`;
        }
        function _hideUnrecovered(uidom) {
            let k = !commentUI_unsafeWindow_alt["hideUnrecovered"];
            commentUI_unsafeWindow_alt["hideUnrecovered"] = k;
            if (k) {
                uidom.querySelectorAll(".deleted-comment").forEach((dom => {
                    if (!dom["data"]) dom.classList.add("remove");
                }));
            } else {
                uidom.querySelectorAll(".deleted-comment").forEach((dom => {
                    dom.classList.remove("remove");
                }));
            }
        }
        function _showUI(cache) {
            let doc = commentUI_unsafeWindow_alt.document;
            let uidom = doc.body.querySelector(".deleted-comments-container");
            commentUI_unsafeWindow_alt["deletedCommentsUI"] = uidom;
            uidom.classList.remove("remove");
            cache.deletedFloors.forEach((df => {
                let itemDom = doc.createElement("DIV");
                itemDom.classList.add("deleted-comment");
                itemDom.insertAdjacentHTML("afterbegin", deletedComment);
                itemDom.querySelector(".comment-floor").innerText = "#" + df;
                itemDom["floor"] = df;
                uidom.querySelector(".deleted-comment-list").appendChild(itemDom);
            }));
            let rec = doc.querySelector(".area.recommendation");
            if (rec) {
                rec.style.maxHeight = "800px";
                rec.style.overflowX = "hidden";
                rec.style.overflowY = "scroll";
            }
            let rec2 = doc.querySelector("#pagelet_newrecommend");
            if (rec2) {
                rec2.style.maxHeight = "500px";
                rec2.style.overflowX = "hidden";
                rec2.style.overflowY = "scroll";
            }
            let fr = doc.querySelector(".content.wp.clearfix.area .fr");
            if (fr) {
                fr.style.maxHeight = "800px";
                fr.style.overflowX = "hidden";
                fr.style.overflowY = "scroll";
            }
            uidom.querySelector(".hide-btn").addEventListener("click", (() => {
                _hideUnrecovered(uidom);
            }));
        }
        function _replaceImage2(content) {
            let sb = /\[img(?:=图片)*\](https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))\[\/img\]/g;
            let ms = [ ...content.matchAll(sb) ];
            let result = content.toString();
            ms.forEach((m => {
                let oldstr = m[0];
                let url = m[1];
                let newstr = `<a href="${url}" target="_blank" ><img src="${url}"></a>`;
                result = result.replaceAll(oldstr, newstr);
            }));
            return result;
        }
        function _replaceEmot(content) {
            let sb1 = /\[emot=acfun,(\d+)\/\]/g;
            let ms = [ ...content.matchAll(sb1) ];
            let result = content.toString();
            ms.forEach((m => {
                let id = m[1];
                let o = commentUI_unsafeWindow_alt.emotDict[id];
                let url = o.emotionImageUrl;
                let imgtag = `<img class="ubb-emotion" src="${url}" />`;
                result = result.replaceAll(m[0], imgtag);
            }));
            return result;
        }
        async function isFloorInnerAC(floorData) {
            let content = floorData.content;
            let sb = /\[img(?:=图片)*\](https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))\[\/img\]/g;
            let ms = [ ...content.matchAll(sb) ];
            if (ms.length < 1) {
                log_log("no image");
                return false;
            }
            let url = ms[0][1];
            log_log("awaiting innver ac", url);
            return await innerACFun.isMaskImage(url);
        }
        async function recoverFloor(floorData) {
            log_log("Recover Floorr", floorData);
            let isInner = await isFloorInnerAC(floorData);
            log_log("isInner", isInner);
            if (isInner) {
                floorData["isInner"] = true;
                floorData.content = "此评论为里区内容，被删除后无法恢复(因为显然有不能存在的理由)...";
            }
            let doc = commentUI_unsafeWindow_alt.document;
            let uidom = doc.body.querySelector(".deleted-comments-container");
            let doms = uidom.querySelectorAll(".deleted-comment");
            log_log("doms =", doms);
            doms.forEach((itemDom => {
                log_log("dom floor", itemDom["floor"], floorData.floor, itemDom["floor"] === floorData.floor);
                if (itemDom["floor"] === floorData.floor) {
                    itemDom["data"] = floorData;
                    let usernameDom = itemDom.querySelector(".comment-username");
                    usernameDom.innerText = floorData.username;
                    usernameDom.classList.remove("remove");
                    let content = _replaceImage2(floorData.content);
                    content = _replaceEmot(content);
                    itemDom.querySelector(".comment-text").innerHTML = content;
                    itemDom.querySelector(".comment-query-state").classList.add("remove");
                    let datetime = new Date(floorData.replyTime);
                    itemDom.querySelector(".comment-time").innerText = datetime.toLocaleString();
                    itemDom.querySelector(".comment-content").classList.remove("remove");
                }
            }));
        }
        function noticeUncached(f) {
            let doc = commentUI_unsafeWindow_alt.document;
            let uidom = doc.body.querySelector(".deleted-comments-container");
            let doms = uidom.querySelectorAll(".deleted-comment");
            doms.forEach((itemDom => {
                if (itemDom["floor"] === f) {
                    itemDom.querySelector(".comment-query-state").innerText = "服务器未收录";
                }
            }));
        }
        function enable(val) {
            let doc = commentUI_unsafeWindow_alt.document;
            let uidom = doc.body.querySelector(".deleted-comments-container");
            if (val) {
                uidom.classList.remove("remove-2");
            } else {
                uidom.classList.add("remove-2");
            }
        }
        function showUDP(result) {
            let doc = commentUI_unsafeWindow_alt.document;
            let dom = doc.body.querySelector(".udp-container");
            dom.classList.remove("udp-hidden");
            let titledom = dom.querySelector(".udp-title");
            let inner = dom.querySelector(".udp-inner");
            inner.innerHTML = "";
            let closebtn = dom.querySelector(".udp-close");
            closebtn.onclick = () => {
                dom.classList.add("udp-hidden");
            };
            titledom.innerHTML = `已收录[${result.username.substring(0, 16)}]被删除评论 <strong>${result.list.length}<b>条`;
            console.log(result);
            result.list.forEach((item => {
                let d = item.v;
                let ac = item._id;
                let content = _replaceImage2(d.content);
                content = _replaceEmot(content);
                let datetime = new Date(d.replyTime);
                datetime = datetime.toLocaleString();
                let div = doc.createElement("div");
                div.classList.add("udp-item");
                div.innerHTML = `\n<div class="udp-item-content">${content}</div>\n<div class="udp-item-info">\n    <div class="udp-time">${datetime}</div>\n    <a href="/v/ac${ac}"><div class="udp-av">ac${ac}</div></a>\n</div>`;
                inner.append(div);
            }));
        }
        function _bindEvents() {
            js_event.on("SHOW_DELETED_COMMENT_UI", (cache => {
                _showUI(cache);
            }));
            js_event.on("FLOOR_RECOVER", (floorData => {
                recoverFloor(floorData);
            }));
            js_event.on("NO_SERVER_CACHE", (floor => {
                noticeUncached(floor);
            }));
            js_event.on("SETTING_CHANGE_showDeletedComment", (val => {
                enable(val);
            }));
            js_event.on("LOOKUP", (username => {
                let w = unsafeWindow;
                w.A.emit("global::success", `正在查询[${username}]的被删评论……`);
                commentRecovery.getUserDeletedPost(username, (result => {
                    js_event.emit("LOOKUP_RESULT", result);
                    w.A.emit("global::success", `完成！`);
                }));
            }));
            js_event.on("LOOKUP_RESULT", (result => {
                showUDP(result);
            }));
        }
        function _loadEmots() {
            let s = unsafeWindow.localStorage.getItem("emoticonList");
            if (!s) {
                commentUI_unsafeWindow_alt["emotDict"] = {};
                return;
            }
            let list = JSON.parse(s);
            try {
                let dict = {};
                list.forEach((o => {
                    dict[o.emotionId] = o;
                }));
                commentUI_unsafeWindow_alt["emotDict"] = dict;
            } catch (e) {
                commentUI_unsafeWindow_alt["emotDict"] = {};
            }
        }
        function _loadUDPUI() {
            let doc = commentUI_unsafeWindow_alt.document;
            doc.body.insertAdjacentHTML("beforeend", udp);
        }
        function _loadUI() {
            let doc = commentUI_unsafeWindow_alt.document;
            doc.body.insertAdjacentHTML("beforeend", recoveryUI);
            commentUI_unsafeWindow_alt.onresize = _repositionUI;
            _repositionUI();
            _observer();
            js_data.loadGeneralSetting((setting => {
                enable(setting.showDeletedComment);
            }));
        }
        const commentUI = {
            init() {
                _loadEmots();
                _loadUI();
                _loadUDPUI();
                _bindEvents();
            }
        };
        const SECOND = 1e3;
        const MINUTE = 60 * SECOND;
        const HOUR = 60 * MINUTE;
        const DAY = 24 * HOUR;
        let activeHelpInterval = 20 * MINUTE;
        let commentRecovery_unsafeWindow_alt = window;
        function commentRecovery_saveCommentCache(id, cache, callback) {
            js_data.saveCommentCache(id, cache, (e => {
                if (callback) {
                    callback(e);
                }
                js_event.emit("COMMENT_CACHE_UPDATE", cache);
            }));
        }
        function _httpGet(url, callback) {
            let xhr = new commentRecovery_unsafeWindow_alt.XMLHttpRequest;
            xhr.open("GET", url, true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onload = function() {
                try {
                    let d = JSON.parse(this.responseText);
                    if (callback) callback(d);
                } catch (e) {
                    console.error(e);
                    if (callback) callback(null);
                }
            };
            xhr.send();
        }
        function getContentId() {
            let pagetype = getPageType();
            let id = null;
            if (pagetype === "VIDEO") {
                let info = unsafeWindow.videoInfo;
                if (!info) return null;
                id = info["dougaId"];
            } else {
                let info = unsafeWindow.articleInfo;
                if (!info) return null;
                id = info["articleId"];
            }
            return id;
        }
        function getPage(id, p, callback, collectedComments) {
            let url = `https://www.acfun.cn/rest/pc-direct/comment/listByFloor?sourceId=${id}&sourceType=3&page=${p}&pivotCommentId=0&newPivotCommentId=0&t=1638284078529&supportZtEmot=true`;
            _httpGet(url, (d => {
                if (d) {
                    let keys = d.commentIds;
                    keys.forEach((key => {
                        key = "c" + key;
                        let c = d.commentsMap[key];
                        if (c.isDelete) {
                            return;
                        }
                        let comment = {
                            username: c.userName,
                            content: c.content,
                            replyTime: c.timestamp,
                            cId: c.cid,
                            floor: c.floor
                        };
                        collectedComments[parseInt(c.floor)] = comment;
                    }));
                    collectedComments["totalCount"] = d.totalCount;
                    let maxPage = d.totalPage;
                    if (p < maxPage) {
                        setTimeout((() => {
                            getPage(id, p + 1, callback, collectedComments);
                        }), 500);
                    } else {
                        callback(collectedComments);
                    }
                }
            }));
        }
        function _getPageLastReply(id, callback) {
            let p = 1;
            let url = `https://www.acfun.cn/rest/pc-direct/comment/listByFloor?sourceId=${id}&sourceType=3&page=${p}&pivotCommentId=0&newPivotCommentId=0&t=1638284078529&supportZtEmot=true`;
            _httpGet(url, (d => {
                if (d) {
                    let idlast = "c" + d.commentIds[0];
                    let clast = d.commentsMap[idlast];
                    let totalCount = d.totalCount;
                    callback(clast, totalCount);
                }
            }));
        }
        let udpCache = {};
        function _getUserDeletedPost(username, callback) {
            if (username in udpCache) {
                callback(udpCache[username]);
            } else {
                util.apiRequest({
                    query: "udp",
                    username
                }, (result => {
                    udpCache[username] = result;
                    callback(result);
                }));
            }
        }
        function _getAllPageCommentOnline(id, callback) {
            log_log(`采集评论，投稿id=${id}`);
            function collectDone(collectedComments) {
                let commentInfo = {
                    id,
                    floors: collectedComments,
                    deletedFloors: [],
                    recoveredFloors: [],
                    lastReplyTime: 0,
                    lastCheckTime: +new Date,
                    createTime: 0,
                    floorCount: 0,
                    reportedRecovery: [],
                    queriedFloors: []
                };
                let maxFloor = 0;
                Object.keys(commentInfo.floors).forEach((k => {
                    let f = commentInfo.floors[k].floor;
                    if (f > maxFloor) maxFloor = f;
                }));
                commentInfo.floorCount = collectedComments["totalCount"];
                log_log(`已采集本投稿评论至${maxFloor}楼。`);
                for (let i = 1; i <= maxFloor; i++) {
                    if (!(i in collectedComments)) {
                        commentInfo.deletedFloors.push(i);
                    } else {
                        let replyTime = collectedComments[i].replyTime;
                        if (replyTime > commentInfo.lastReplyTime) {
                            commentInfo.lastReplyTime = replyTime;
                        }
                    }
                }
                callback(commentInfo);
            }
            getPage(id, 1, collectDone, {});
        }
        function _activeReport(cache) {
            let reportData = {
                id: cache.id,
                recoveredFloors: [],
                floors: {}
            };
            let count = 0;
            cache.recoveredFloors.forEach((fn => {
                fn = parseInt(fn);
                if (cache.reportedRecovery.indexOf(fn) < 0) {
                    reportData.recoveredFloors.push(fn);
                    let floor = cache.floors[fn];
                    let toReport = {
                        username: floor.username,
                        replyTime: floor.replyTime,
                        floor: parseInt(floor.floor),
                        cId: parseInt(floor.cId),
                        content: floor.content
                    };
                    reportData.floors[fn] = toReport;
                    count++;
                }
            }));
            let queryData = {
                query: "report_cache",
                cache: reportData
            };
            if (count > 0) {
                util.apiRequest(queryData, (result => {
                    cache.reportedRecovery = cache.recoveredFloors.map((x => x));
                    commentRecovery_saveCommentCache(cache.id, cache);
                }));
            }
        }
        function _getCommentsOnlineAndMerge(id, oldCache, callback) {
            _getAllPageCommentOnline(id, (newCache => {
                let intKeys = Object.keys(newCache.floors).map((x => parseInt(x)));
                let floorMax = Math.max(...intKeys);
                for (let f = 1; f <= floorMax; f++) {
                    if (f in newCache.floors && f in oldCache.floors) {} else if (f in newCache.floors && !(f in oldCache.floors)) {} else if (!(f in newCache.floors) && f in oldCache.floors) {
                        newCache.floors[f] = oldCache.floors[f];
                        newCache.recoveredFloors.push(f);
                    } else {}
                }
                if (!oldCache.reportedRecovery) {
                    oldCache.reportedRecovery = [];
                }
                newCache.reportedRecovery = oldCache.reportedRecovery.map((x => x));
                let delcount = newCache.deletedFloors.length;
                let recovCount = newCache.recoveredFloors.length;
                commentRecovery_saveCommentCache(id, newCache, (() => {
                    log_log(`投稿${id}重新缓存完成。${delcount}个被删除，${recovCount}个被恢复`);
                    callback(newCache);
                    _activeReport(newCache);
                }));
            }));
        }
        function _checkPageComment(id, callback) {
            js_data.getLocalCommentCache(id, (cache => {
                if (!cache) {
                    _getAllPageCommentOnline(id, (c => {
                        commentRecovery_saveCommentCache(id, c, (() => {
                            log_log("首次收集投稿" + id + `评论完成。发现${c.deletedFloors.length}个评论被删除。`);
                            callback(c);
                        }));
                    }));
                } else {
                    log_log("对比评论缓存是否需要更新。");
                    _getPageLastReply(id, ((lastReply, totalCount) => {
                        if (!lastReply) return;
                        let t1 = parseInt(lastReply.timestamp);
                        let t2 = parseInt(cache.lastReplyTime);
                        if (t1 !== t2 || cache.floorCount !== totalCount) {
                            log_log(id + " 投稿缓存需要更新");
                            _getCommentsOnlineAndMerge(id, cache, callback);
                        } else {
                            log_log("已经缓存到最新评论了。");
                            callback(cache);
                        }
                    }));
                }
            }));
        }
        function _checkCurrentPageComment(callback) {
            if (!callback) callback = () => 0;
            let id = getContentId();
            if (id === null) {
                setTimeout((() => {
                    _checkCurrentPageComment(callback);
                }), 400);
                return;
            }
            _checkPageComment(id, callback);
        }
        function showUI(cache) {
            js_event.emit("SHOW_DELETED_COMMENT_UI", cache);
        }
        function _recoverByLocalCache(cache, then) {
            log_log(`本地可恢复楼层：${cache.recoveredFloors.join(" ")}`);
            cache.recoveredFloors.forEach((recoveredFloor => {
                let floor = cache.floors[recoveredFloor];
                js_event.emit("FLOOR_RECOVER", floor);
            }));
            then();
        }
        function _mergeServerCacheToLocal(serverCache, localCache) {
            if (serverCache.cached.length === 0) {
                log_log("服务器没有其他缓存，已同步服务器缓存");
                return;
            }
            serverCache.cached.forEach((floor => {
                if (localCache.recoveredFloors.indexOf(floor.floor) < 0) {
                    localCache.floors[floor.floor] = floor;
                    localCache.recoveredFloors.push(floor.floor);
                    localCache.reportedRecovery.push(floor.floor);
                }
            }));
            commentRecovery_saveCommentCache(localCache.id, localCache, (() => {
                log_log("已从服务器更新本投稿缓存。");
            }));
        }
        function _recoverByServerCache(localCache) {
            let queryObj = {
                query: "query_floors",
                id: localCache.id,
                floors: localCache.deletedFloors.filter((x => localCache.recoveredFloors.indexOf(x) < 0))
            };
            if (queryObj.floors.length > 0) {
                log_log("向服务器发出恢复评论的请求");
                util.apiRequest(queryObj, (result => {
                    let cachedFloors = [];
                    result.cached.forEach((floor => {
                        js_event.emit("FLOOR_RECOVER", floor);
                        cachedFloors.push(floor.floor);
                    }));
                    queryObj.floors.forEach((f => {
                        if (cachedFloors.indexOf(f) < 0) {
                            js_event.emit("NO_SERVER_CACHE", f);
                        }
                    }));
                    _mergeServerCacheToLocal(result, localCache);
                }));
            }
        }
        function recoverComments(cache) {
            _recoverByLocalCache(cache, (() => {
                _recoverByServerCache(cache);
            }));
        }
        function __activeHelp() {
            js_data.getAllCacheIndex((ids => {
                let queryObj = {
                    query: "active_recover",
                    ids
                };
                util.apiRequest(queryObj, (_d => {
                    log_log(`收到服务器恢复需求。${_d.result.length}个投稿需要本地数据`, _d);
                    let list = _d.result;
                    let recoverCount = 0;
                    let floorTotal = 0;
                    list.forEach(((serverRequest, index) => {
                        js_data.getLocalCommentCache(serverRequest._id, (cache => {
                            let reportData = {
                                id: cache.id,
                                recoveredFloors: [],
                                floors: {}
                            };
                            let count = 0;
                            serverRequest.floors.forEach((f => {
                                if (f in cache.floors) {
                                    count++;
                                    let floor = cache.floors[f];
                                    let toReport = {
                                        username: floor.username,
                                        replyTime: floor.replyTime,
                                        floor: parseInt(floor.floor),
                                        cId: parseInt(floor.cId),
                                        content: floor.content
                                    };
                                    reportData.recoveredFloors.push(f);
                                    reportData.floors[f] = toReport;
                                }
                            }));
                            let queryData = {
                                query: "report_cache",
                                cache: reportData
                            };
                            if (count > 0) {
                                log_log("主动恢复评论数据", reportData);
                                util.apiRequest(queryData, (result => {
                                    log_log("恢复结果", result);
                                    cache.reportedRecovery = cache.recoveredFloors.map((x => x));
                                    commentRecovery_saveCommentCache(cache.id, cache);
                                }));
                                recoverCount++;
                                floorTotal += count;
                            }
                            if (index === list.length - 1) {
                                log_log(`帮助服务器恢复共${recoverCount}个投稿和${floorTotal}个评论。`);
                            }
                        }));
                    }));
                }));
            }));
        }
        function _activeHelp() {
            log_log("主动帮助");
            let t = +new Date;
            js_data.getActiveHelpTime((lasttime => {
                if (t - activeHelpInterval > lasttime) {
                    let interval = Math.round((t - lasttime) / 1e3);
                    log_log(`距离上次主动帮助已经${interval}秒了`);
                    __activeHelp();
                    js_data.setActiveHelpTime(t);
                } else {
                    log_log(`距离上次主动帮助还未足够。`);
                }
            }));
        }
        function _deleteCache(id) {
            log_log("trying to delete cache, id=", id);
            js_data.deleteCommentCache(id, (() => {}));
        }
        function _deleteAllCache(callback) {
            log_log("deleteallcache");
            function deleteOneByOne(ids) {
                if (ids.length <= 0) {
                    js_event.emit("COMMENT_CACHE_UPDATE", null);
                    js_data.deleteAllCacheIndex((() => {}));
                    callback();
                    return;
                }
                let id = ids.splice(0, 1);
                _deleteCache(id);
                setTimeout((() => {
                    deleteOneByOne(ids);
                }));
            }
            js_data.getAllCacheIndex((ids => {
                log_log("缓存文章列表");
                log_log(ids);
                deleteOneByOne(ids);
            }));
        }
        function _searchCacheByKeyword(str, callback) {
            log_log("搜索缓存 - 关键词:" + str);
            let searchResult = [];
            function searchOneByOne(ids) {
                if (ids.length <= 0) {
                    js_event.emit("COMMENT_CACHE_UPDATE", null);
                    if (callback) callback(searchResult);
                    return;
                }
                let id = ids.splice(0, 1)[0];
                js_data.getLocalCommentCache(id, (c => {
                    for (let floor in c.floors) {
                        let f = c.floors[floor];
                        if (f.content && f.content.indexOf(str) >= 0) {
                            let res = {
                                ac: "ac" + id,
                                floor,
                                content: f.content,
                                username: f.username
                            };
                            log_log(JSON.stringify(res));
                            searchResult.push(res);
                        }
                    }
                    searchOneByOne(ids);
                }));
            }
            js_data.getAllCacheIndex((ids => {
                searchOneByOne(ids);
            }));
        }
        const commentRecovery = {
            init() {
                commentUI.init();
                let pagetype = getPageType();
                if (!(pagetype === "VIDEO" || pagetype === "ARTICLE")) {
                    return;
                }
                commentRecovery_unsafeWindow_alt["deleteCache"] = js_data.deleteCommentCache;
                commentRecovery_unsafeWindow_alt["clearCache"] = _deleteAllCache;
                _checkCurrentPageComment((cache => {
                    setTimeout((() => {
                        showUI(cache);
                        recoverComments(cache);
                    }), 1e3);
                }));
                _activeHelp();
            },
            searchCacheByKeyword: _searchCacheByKeyword,
            deleteAllCache: _deleteAllCache,
            getUserDeletedPost: _getUserDeletedPost
        };
        let setting_ui_unsafeWindow = window;
        function enableDragging(controlDom, containerDom, enableX = true, enableY = true) {
            let doc = setting_ui_unsafeWindow.document;
            let body = doc.body;
            let cx = -1;
            let cy = -1;
            __webpack_require__.g.dragging = false;
            let startCX;
            let startCY;
            controlDom.addEventListener("pointerdown", (e => {
                cx = e.clientX;
                cy = e.clientY;
                let rect = containerDom.getBoundingClientRect();
                startCX = rect.left;
                startCY = rect.top;
                __webpack_require__.g.dragging = true;
            }));
            body.addEventListener("pointermove", (e => {
                if (__webpack_require__.g.dragging) {
                    let dx = e.clientX - cx;
                    let dy = e.clientY - cy;
                    if (enableX) {
                        containerDom.style.left = startCX + dx + "px";
                    }
                    if (enableY) {
                        containerDom.style.top = startCY + dy + "px";
                    }
                }
            }));
            body.addEventListener("pointerup", (() => {
                __webpack_require__.g.dragging = false;
                let rect = containerDom.getBoundingClientRect();
                js_data.saveUIPosition(rect.left, rect.y);
            }));
        }
        function showBannedList(dom, listName) {
            let dictBan = {
                up: [ "#ban_up_page", js_data.loadBanList, unbanUpButtonClick, js_data.banUser, "UP_BAN_UPDATE" ],
                replier: [ "#ban_replier_page", js_data.loadReplyBanList, unbanReplierButtonClick, js_data.banReplier, "REPLY_BAN_UPDATE" ],
                keyword: [ "#ban_keyword_page", js_data.loadKeywords, unbanKeywordButtonClick, js_data.banKeyword, "KEYWORD_BAN_UPDATE" ]
            };
            let opt = dictBan[listName];
            opt[1]((list => {
                let page = dom.querySelector(opt[0]);
                let button = page.querySelector(".ban-item-submit");
                button.addEventListener("click", (() => {
                    let input = page.querySelector(".ban-title-input");
                    let text = input.value;
                    if (text.length === 0) {
                        input.focus();
                        return;
                    }
                    input.value = "";
                    opt[3](text, (() => {
                        js_event.emit(opt[4], null);
                    }));
                }));
                if (!list || !list.indexOf) {
                    return;
                }
                let stringOnlyList = list.map((x => typeof x === "string" ? x : x.item));
                let container = page.querySelector(".banned-items");
                container.innerHTML = "";
                let currentList = [];
                let unsafeWindow = window;
                let doc = unsafeWindow.document;
                list.forEach((i => {
                    if (currentList.indexOf(i) < 0) {
                        let node = doc.createElement("div");
                        node.classList.add("banned-item");
                        let n1 = doc.createElement("span");
                        n1.classList.add("banned-title");
                        if (typeof i === "string") {
                            n1.innerText = i;
                            let n2 = doc.createElement("button");
                            n2.innerText = "×";
                            node.append(...[ n1, n2 ]);
                            n2.addEventListener("click", (e => {
                                opt[2](i);
                            }));
                        } else if (typeof i === "object") {
                            n1.innerText = i.item;
                            let n2 = doc.createElement("button");
                            n2.innerText = "排行榜";
                            n2.classList.add("ranked-item");
                            node.append(...[ n1, n2 ]);
                        }
                        container.append(node);
                    }
                }));
            }), false);
        }
        function updateBannedUpList(dom) {
            if (typeof dom === "undefined") {
                let doc = setting_ui_unsafeWindow.document;
                dom = doc.body.querySelector("#helperUI");
            }
            showBannedList(dom, "up");
        }
        function updateBannedReplierList(dom) {
            if (typeof dom === "undefined") {
                let doc = setting_ui_unsafeWindow.document;
                dom = doc.body.querySelector("#helperUI");
            }
            showBannedList(dom, "replier");
        }
        function updateBannedKeywordsList(dom) {
            if (typeof dom === "undefined") {
                let doc = setting_ui_unsafeWindow.document;
                dom = doc.body.querySelector("#helperUI");
            }
            showBannedList(dom, "keyword");
        }
        function unbanUpButtonClick(username) {
            js_data.unbanUser(username, (banlist => {
                js_event.emit("UP_BAN_UPDATE", banlist);
            }));
        }
        function unbanReplierButtonClick(username) {
            js_data.unbanReplier(username, (banlist => {
                js_event.emit("REPLY_BAN_UPDATE", banlist);
            }));
        }
        function unbanKeywordButtonClick(keyword) {
            js_data.unbanKeyword(keyword, (banlist => {
                js_event.emit("KEYWORD_BAN_UPDATE", banlist);
            }));
        }
        function _changeSetting(key, val, callback) {
            js_data.loadGeneralSetting((s => {
                s[key] = val;
                js_data.saveGeneralSetting(s, callback);
            }));
        }
        function bindGeneralSettingEvents(dom) {
            dom.querySelectorAll(".cc-container").forEach((dom => {
                let t = dom;
                let key = t.getAttribute("data-id");
                dom.addEventListener("change", (e => {
                    let checked = t.querySelector("input").checked;
                    _changeSetting(key, checked, (() => {
                        js_event.emit("SETTING_CHANGE_" + key, checked);
                    }));
                }));
                js_data.loadGeneralSetting((setting => {
                    let input = dom.querySelector("input");
                    input.checked = setting[key] ? "checked" : "";
                }));
            }));
        }
        function initButtons(dom) {
            let dict = {
                bannedAuthours: [ "#ban_up_page" ],
                bannedRepliers: [ "#ban_replier_page" ],
                bannedKeywords: [ "#ban_keyword_page" ],
                preloadSetting: [ "#preload_page" ],
                cloudsync: [ "#cloudsync_page" ],
                commentRecovery: [ "#recovery_page" ],
                generalSetting: [ "#general_page" ],
                sharedRankList: [ "#sharedRankList_page" ],
                aboutme: [ "#about_page" ]
            };
            let allPageButtons = [];
            Object.keys(dict).forEach((id => {
                allPageButtons.push(id);
                dom.querySelector("#" + id).addEventListener("click", (() => {
                    let pageid = dict[id][0];
                    dom.querySelector(pageid).classList.remove("inactive-page");
                }));
            }));
            for (let key in dict) {
                let id = dict[key][0];
                dom.querySelector(id).querySelector("a.go-back").addEventListener("click", (() => {
                    dom.querySelector(id).classList.add("inactive-page");
                }));
            }
            let hidehint = dom.querySelector("#hide_hint");
            hidehint.addEventListener("click", (() => {
                uiMain.classList.add("ui-hidden");
            }));
        }
        function refreshSyncTime(dom) {
            function timeConverter(UNIX_timestamp) {
                let a = new Date(UNIX_timestamp * 1e3);
                let months = [ "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月" ];
                let year = a.getFullYear();
                let month = months[a.getMonth()];
                let date = a.getDate();
                let hour = a.getHours();
                let min = a.getMinutes();
                let sec = a.getSeconds();
                let time = year + "年" + month + date + "日 " + hour + ":" + min + ":" + sec;
                return time;
            }
            js_data.getUpdateTime((time => {
                dom.querySelector(".sync-time").innerText = "上次同步时间：" + timeConverter(time);
            }));
        }
        function _refreshCommentCachePage(dom) {
            js_data.getAllCacheIndex((ids => {
                let count = ids.length;
                dom.querySelector(".cache-info").innerText = `已缓存${count}篇投稿评论`;
            }));
        }
        function bindEvents(dom) {
            js_event.on("UP_BAN_UPDATE", (() => {
                updateBannedUpList();
            }));
            js_event.on("REPLY_BAN_UPDATE", (() => {
                updateBannedReplierList();
            }));
            js_event.on("KEYWORD_BAN_UPDATE", (() => {
                updateBannedKeywordsList();
            }));
            js_event.on("SYNC_TIME_UPDATE", (() => {
                refreshSyncTime(dom);
            }));
            js_event.on("COMMENT_CACHE_UPDATE", (() => {
                _refreshCommentCachePage(dom);
            }));
            dom.querySelector("#syncNow").addEventListener("click", (() => {
                js_event.emit("SYNC_NOW", null);
            }));
            dom.querySelector("#clearPreloadCache").addEventListener("click", (() => {
                util.dbHelper.clearAll().then((count => {
                    document.querySelector("#clearCacheInfo").innerText = `已清除${count}个缓存页面。`;
                }));
            }));
            dom.querySelector("#preloadSetting").addEventListener("click", (() => {
                util.dbHelper.count().then((count => {
                    document.querySelector("#clearCacheInfo").innerText = `现在已经有${count}个缓存页面了。`;
                }));
            }));
            let cacheDelBtn = dom.querySelector("#delete_cache");
            cacheDelBtn.addEventListener("click", (() => {
                cacheDelBtn.disabled = true;
                commentRecovery.deleteAllCache((() => {
                    setTimeout((() => {
                        cacheDelBtn.disabled = false;
                    }), 1e3);
                }));
            }));
            let lookupCacheBtn = dom.querySelector("#lookup_cache");
            lookupCacheBtn.addEventListener("click", (() => {
                let username = dom.querySelector(".lookup-cache-input").value;
                js_event.emit("LOOKUP", username);
            }));
            js_event.on("SETTING_CHANGE_useBannedUpRankList", (val => {
                updateBannedUpList();
            }));
            js_event.on("SETTING_CHANGE_useBannedKeywordsList", (val => {
                updateBannedKeywordsList();
            }));
            js_event.on("SETTING_CHANGE_useBannedReplierList", (val => {
                updateBannedReplierList();
            }));
            window.addEventListener("resize", (() => {
                function scrollbarVisible(element) {
                    return element.scrollHeight > element.clientHeight;
                }
                let root = window.document.querySelector("html");
                if (scrollbarVisible(root)) {
                    root.style.overflowY = "scroll";
                }
            }));
            let copy_uprank_btn = dom.querySelector("#copy_uprank");
            let copy_keywordrank_btn = dom.querySelector("#copy_keywordrank");
            let copy_replierrank_btn = dom.querySelector("#copy_replierrank");
            copy_uprank_btn.addEventListener("click", (() => {
                js_data.copyRankBanLish((() => {
                    js_event.emit("UP_BAN_UPDATE");
                }));
            }));
            copy_keywordrank_btn.addEventListener("click", (() => {
                js_data.copyRankKeywords((() => {
                    js_event.emit("KEYWORD_BAN_UPDATE");
                }));
            }));
            copy_replierrank_btn.addEventListener("click", (() => {
                js_data.copyRankReplyBanList((() => {
                    js_event.emit("REPLY_BAN_UPDATE");
                }));
            }));
        }
        function initAcGirl(dom) {
            let girl = dom.querySelector(".ac-girl");
            girl.classList.remove("ac-girl-hide");
            let ui = window.document.body.querySelector("#helperUI");
            let canvas = document.createElement("canvas");
            let rect = girl.getBoundingClientRect();
            let ctx = canvas.getContext("2d");
            canvas.height = rect.height;
            canvas.width = rect.width;
            girl.append(canvas);
            let image = new Image;
            image.onload = function() {
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            };
            image.src = acgirl_image(true);
            enableDragging(canvas, ui, false);
            let uiMain = dom.querySelector(".helper-main");
            canvas.addEventListener("click", (() => {
                if (!uiMain.classList.contains("ui-hidden")) {
                    uiMain.classList.add("ui-hidden");
                } else {
                    uiMain.classList.remove("ui-hidden");
                }
            }));
        }
        function setting_ui_version(dom) {
            dom.querySelector(".plugin-version").innerText = "插件版本：" + js_data.version;
            dom.querySelector(".plugin-downloader-version").innerText = "下载器版本：" + GM_info.script.version;
        }
        function cacheInfo(dom) {
            _refreshCommentCachePage(dom);
        }
        function setting_ui_init(dom) {
            js_data.loadUIPosition((pos => {
                dom.style.top = pos.y + "px";
                dom.style.left = pos.x + "px";
            }));
            log_log("加载设置页面");
            bindEvents(dom);
            log_log("初始化事件");
            bindGeneralSettingEvents(dom);
            updateBannedUpList(dom);
            updateBannedReplierList(dom);
            updateBannedKeywordsList(dom);
            log_log("载入屏蔽列表");
            initButtons(dom);
            setting_ui_version(dom);
            cacheInfo(dom);
            log_log("初始化完成");
            initAcGirl(dom);
            log_log("AC娘载入成功");
        }
        const setting_ui = {
            state: "MENU",
            showSettingUI() {
                let doc = window.document;
                doc.body.insertAdjacentHTML("beforeend", mainUI);
                let uiDom = doc.body.querySelector("#helperUI");
                setting_ui_init(uiDom);
            }
        };
        var subUI_code = '<div class="sub-ui-wrap"> <div class="sub-ui-inner sub-ui-normal"> <div class="sub-ui-text"> 正 常 </div> <div id="banUp" class="sub-ui-button sub-ui-text smooth"> </div> <div id="unbanUp" class="sub-ui-button sub-ui-text remove smooth"> </div> </div> </div>';
        const subUI = subUI_code;
        let contentPageUI_unsafeWindow = window;
        function contentPageUI_bindEvents() {
            js_event.on("UP_BAN_UPDATE", (() => {
                refreshUI();
            }));
            let doc = contentPageUI_unsafeWindow.document;
            let innerWrap = doc.querySelector(".sub-ui-inner");
            let banbutton = innerWrap.querySelector("#banUp");
            let unbanbutton = innerWrap.querySelector("#unbanUp");
            banbutton.addEventListener("click", (() => {
                js_data.banUser(_getUsername(doc));
                js_event.emit("UP_BAN_UPDATE", null);
            }));
            unbanbutton.addEventListener("click", (() => {
                js_data.unbanUser(_getUsername(doc));
                js_event.emit("UP_BAN_UPDATE", null);
            }));
            js_event.on("SETTING_CHANGE_showBanStatusTag", (show => {
                if (show) {
                    innerWrap.classList.remove("hide");
                } else {
                    innerWrap.classList.add("hide");
                }
            }));
            js_data.loadGeneralSetting((setting => {
                let show = setting.showBanStatusTag;
                if (show) {
                    innerWrap.classList.remove("hide");
                } else {
                    innerWrap.classList.add("hide");
                }
            }));
        }
        function showBannedUI() {
            let doc = contentPageUI_unsafeWindow.document;
            let innerWrap = doc.querySelector(".sub-ui-inner");
            innerWrap.classList.remove("sub-ui-normal");
            innerWrap.classList.add("sub-ui-banned");
            let text = innerWrap.querySelector(".sub-ui-text");
            text.innerText = "已屏蔽";
            let banbutton = innerWrap.querySelector("#banUp");
            let unbanbutton = innerWrap.querySelector("#unbanUp");
            banbutton.classList.add("remove");
            unbanbutton.classList.remove("remove");
        }
        function showNormalUI() {
            let doc = contentPageUI_unsafeWindow.document;
            let innerWrap = doc.querySelector(".sub-ui-inner");
            innerWrap.classList.add("sub-ui-normal");
            innerWrap.classList.remove("sub-ui-banned");
            let text = innerWrap.querySelector(".sub-ui-text");
            text.innerText = "正  常";
            let banbutton = innerWrap.querySelector("#banUp");
            let unbanbutton = innerWrap.querySelector("#unbanUp");
            banbutton.classList.remove("remove");
            unbanbutton.classList.add("remove");
        }
        function refreshUI() {
            let doc = contentPageUI_unsafeWindow.document;
            let username = _getUsername(doc);
            js_data.loadBanList((list => {
                if (list.indexOf(username) >= 0) {
                    showBannedUI();
                } else {
                    showNormalUI();
                }
            }));
        }
        function _getUsername(doc) {
            let updom;
            let type = getPageType();
            if (type === "VIDEO") {
                updom = doc.querySelector(".up-info .up-name");
            } else {
                updom = doc.querySelector(".up-name a");
            }
            return updom.innerText;
        }
        function contentPageUI_loadUI() {
            let doc = contentPageUI_unsafeWindow.document;
            doc.body.insertAdjacentHTML("beforeend", subUI);
            let vid = doc.querySelector(".container-video");
            if (vid) vid.classList.add("on-top");
        }
        const contentPageUI = {
            loadUI() {
                contentPageUI_loadUI();
                contentPageUI_bindEvents();
            }
        };
        let ui_unsafeWindow = window;
        function hideArticle(c) {
            if ("contentData" in c.dom) {
                c = c.dom["contentData"];
            }
            if (!("originalHeight" in c)) {
                let rect = c.dom.getBoundingClientRect();
                c["originalHeight"] = rect.height;
            }
            c.dom.style.height = c.originalHeight + "px";
            c.dom.classList.add("smooth");
            setTimeout((() => {
                c.dom.classList.add("banned-article");
            }));
            setTimeout((() => {}), 500);
            c["hidden"] = true;
        }
        function hideItem(c) {
            c.dom.classList.add("smooth");
            c.dom.classList.add("banned-page-item");
            if (__webpack_require__.g["showMouseover"]) {
                c.dom.classList.add("hover-show");
            } else {
                c.dom.classList.remove("hover-show");
            }
            c["hidden"] = true;
        }
        function showItem(c) {
            c.dom.classList.remove("banned-page-item");
            c["hidden"] = false;
        }
        function showArticle(c) {
            c.dom.classList.remove("banned-article");
            c.dom.classList.remove("remove");
            c["hidden"] = false;
        }
        function _hideContent(c) {
            if ("contentData" in c.dom) {
                c = c.dom["contentData"];
            }
            if (c.type === "ARTICLE") {
                hideArticle(c);
            } else {
                hideItem(c);
            }
        }
        function _showContent(c) {
            if ("contentData" in c.dom) {
                c = c.dom["contentData"];
            }
            if (c.type === "ARTICLE") {
                showArticle(c);
            } else {
                showItem(c);
            }
        }
        function unbanReplier(username) {
            js_data.unbanReplier(username, (banlist => {
                js_event.emit("REPLY_BAN_UPDATE");
            }));
        }
        function _hideSingleComment(c) {
            let type = util.getCommentType();
            let blockDiv = ui_unsafeWindow.document.createElement("div");
            blockDiv.append(...c.dom.childNodes);
            blockDiv.classList.add("remove");
            blockDiv.classList.add("block-mark");
            let infoDiv = ui_unsafeWindow.document.createElement("div");
            infoDiv.classList.add("banned-text");
            infoDiv.innerText = "已屏蔽[" + c.username + "]的发言。";
            let unblockA = ui_unsafeWindow.document.createElement("a");
            unblockA.classList.add("unban-replier-btn");
            unblockA.innerText = "取消屏蔽";
            unblockA.addEventListener("click", (() => {
                unbanReplier(c.username);
            }));
            infoDiv.appendChild(unblockA);
            c.dom.appendChild(blockDiv);
            c.dom.appendChild(infoDiv);
            c["container"] = blockDiv;
            c.dom["bannedData"] = c;
            c.hidden = true;
        }
        function _unhideSingleComment(c) {
            if (!c.dom.hasOwnProperty("bannedData")) return;
            let attachedCommentData = c.dom["bannedData"];
            if (!attachedCommentData.hidden) return;
            c.dom.append(...attachedCommentData.container.childNodes);
            c.dom.querySelector(".banned-text").remove();
            attachedCommentData.container.remove();
            attachedCommentData.hidden = false;
        }
        function refreshUserComments(comments) {
            js_data.loadReplyBanList((banlist => {
                if (banlist !== null) {
                    comments.forEach((c => {
                        if (banlist.indexOf(c.username) >= 0) {
                            if (c.dom.hasOwnProperty("bannedData")) {
                                if (!c.dom["bannedData"].hidden) {
                                    _hideSingleComment(c);
                                }
                            } else {
                                _hideSingleComment(c);
                            }
                        } else {
                            _unhideSingleComment(c);
                        }
                        js_data.loadGeneralSetting((setting => {
                            if (!setting.disableAnimation) return;
                            let tags = c.dom.querySelectorAll("*");
                            tags.forEach((t => {
                                t.style.animation = "";
                            }));
                        }));
                    }));
                }
            }));
        }
        let preloadKlistCache = [];
        let preloadTestContentList = [];
        let preloadTestContentListFiltered = [];
        function addToPreLoadTestList(contents) {
            let exists = false;
            contents.forEach((c => {
                for (let i = 0; i < preloadTestContentList.length; i++) {
                    let item = preloadTestContentList[i];
                    if (c.title === item.title) {
                        exists = true;
                        return;
                    }
                }
                for (let i = 0; i < preloadTestContentListFiltered.length; i++) {
                    let item = preloadTestContentListFiltered[i];
                    if (c.title === item.title) {
                        exists = true;
                        return;
                    }
                }
                if (!exists) preloadTestContentList.push(c);
            }));
        }
        function getAndSavePreloadCache(link, contentObject) {
            util.downloadPage(link, (doc => {
                let mainDiv = doc.querySelector("#main");
                if (!mainDiv) return;
                let firstScript = mainDiv.querySelector("script");
                if (!firstScript) return;
                let script = firstScript.innerText;
                let regex = /window.articleInfo = (.+);/;
                let json = regex.exec(script)[1];
                let data = JSON.parse(json);
                let parts = data.parts;
                let content = "";
                parts.forEach((p => {
                    content += p.content;
                }));
                let parser = new DOMParser;
                let d = parser.parseFromString(content, "text/html");
                let body = d.querySelector("body");
                let text = body.innerText;
                util.dbHelper.save(link, text);
                log_log("完成预加载： ", link);
                checkPreloadBanned(contentObject, text);
            }));
        }
        function checkPreloadBanned(contentObj, contentText) {
            let banned = false;
            let klist = preloadKlistCache;
            if (klist && klist.indexOf) {
                for (let i = 0; i < klist.length; i++) {
                    let keyword = klist[i];
                    if (contentText.indexOf(keyword) >= 0) {
                        banned = true;
                        break;
                    }
                }
            }
            if (banned) {
                log_log("预加载后屏蔽条目：", contentObj.title);
                _hideContent(contentObj);
            } else {
                _showContent(contentObj);
            }
        }
        function preloadTestWorker() {
            if (preloadTestContentListFiltered.length === 0) {
                return;
            }
            let c = preloadTestContentListFiltered.pop();
            let link = c.dom.querySelector("a").getAttribute("href");
            let regex = /\/a\/ac(\d+)/;
            let id = regex.exec(link)[1];
            link = "https://m.acfun.cn/v?ac=" + id;
            util.dbHelper.load(link).then((value => {
                if (typeof value === "undefined" || value === null) {
                    getAndSavePreloadCache(link, c);
                } else {
                    checkPreloadBanned(c, value);
                }
            }));
        }
        function preloadTestFilter() {
            preloadTestContentList.forEach((c => {
                let link = c.dom.querySelector("a").getAttribute("href");
                let regex = /\/a\/ac(\d+)/;
                let id = regex.exec(link)[1];
                link = "https://m.acfun.cn/v?ac=" + id;
                util.dbHelper.load(link).then((value => {
                    if (typeof value === "undefined" || value === null) {
                        preloadTestContentListFiltered.push(c);
                    } else {
                        checkPreloadBanned(c, value);
                    }
                }));
            }));
        }
        let preloadWorker = null;
        function preloadTest(contents, klist) {
            if (contents.length === 0) return;
            addToPreLoadTestList(contents);
            preloadKlistCache = klist;
            preloadTestFilter();
            if (preloadWorker === null) {
                preloadWorker = setInterval(preloadTestWorker, 300);
            }
        }
        function refreshPageItems(contents) {
            js_data.loadBanList((blist => {
                js_data.loadKeywords((klist => {
                    let preloadTestList = [];
                    contents.forEach((c => {
                        let banned = false;
                        if (blist && blist.indexOf && blist.indexOf(c.username) >= 0) {
                            blist = blist.map((x => {
                                if (typeof x === "object") {
                                    return x.item;
                                }
                                return x;
                            }));
                            _hideContent(c);
                            banned = true;
                        }
                        if (klist && klist.indexOf) {
                            klist.forEach((keyword => {
                                if (c.title.indexOf(keyword) >= 0) {
                                    _hideContent(c);
                                    banned = true;
                                }
                            }));
                        }
                        if (!banned) {
                            _showContent(c);
                            if (c.type === "ARTICLE") preloadTestList.push(c);
                        }
                    }));
                    js_data.loadGeneralSetting((setting => {
                        if (setting.usePreload) {
                            log_log("预加载测试中。。。");
                            preloadTest(preloadTestList, klist);
                        } else {
                            log_log("预加载已关闭");
                        }
                    }));
                }));
            }));
        }
        function showCommentTags(content) {}
        function _banReplyUser(username) {
            js_data.banReplier(username, (banlist => {
                js_event.emit("REPLY_BAN_UPDATE", null);
            }));
        }
        function attachBanCommentButtonNew(c, onclick) {
            let b = ui_unsafeWindow.document.createElement("span");
            b.innerText = "屏蔽";
            b.classList.add("area-comment-block");
            b.addEventListener("click", (() => {
                onclick(c);
            }));
            c.banButtonAnchor.insertAdjacentElement("afterend", b);
        }
        function attachBanCommentButtonOld(c, onclick) {
            let b = ui_unsafeWindow.document.createElement("a");
            b.innerText = "屏蔽";
            b.addEventListener("click", (() => {
                onclick(c);
            }));
            c.banButtonAnchor.insertAdjacentElement("afterend", b);
        }
        window.banButtonObj = {};
        function createbanButton() {
            log_log("加载屏蔽按钮");
            let doc = window.document;
            let buttonDiv = doc.createElement("div");
            buttonDiv.classList.add("filter-button");
            doc.body.appendChild(buttonDiv);
            buttonDiv.style.visibility = "hidden";
            buttonDiv.addEventListener("click", (e => {
                let c = banButtonObj.activeData;
                let u = c.username;
                js_data.banUser(u, (list => {
                    js_event.emit("UP_BAN_UPDATE", null);
                }));
            }));
            window.banButtonObj = {
                dom: buttonDiv,
                activeDom: null,
                activeData: null
            };
            let hideBanButton = () => {
                banButtonObj.dom.style.visibility = "hidden";
                banButtonObj.activeDom = null;
                banButtonObj.activeData = null;
                banButtonObj.active = false;
            };
            doc.addEventListener("pointermove", (e => {
                if (banButtonObj.activeDom !== null && banButtonObj.active) {
                    let rect = banButtonObj.activeDom.getBoundingClientRect();
                    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
                        hideBanButton();
                    }
                }
            }));
            doc.addEventListener("scroll", (e => {
                hideBanButton();
            }));
            log_log("屏蔽按钮植入完成");
        }
        function injectStyle() {
            let doc = ui_unsafeWindow.document;
            let str = "<style>" + style.Z[0][1] + "</style>";
            doc.head.insertAdjacentHTML("beforeend", str);
        }
        function loadHomeUI() {
            log_log("载入主要UI");
            createbanButton();
            setting_ui.showSettingUI();
        }
        function loadArticleUI() {
            log_log("载入投稿页UI");
            contentPageUI.loadUI();
            setting_ui.showSettingUI();
        }
        function ui_bindEvents() {
            js_event.on("FILTER_COMMENTS", (comments => {
                refreshUserComments(comments);
            }));
            js_event.on("FILTER_PAGE_CONTENTS", (contents => {
                refreshPageItems(contents);
            }));
            js_event.on("SHOW_COMMENT_TAGS", (contents => {
                showCommentTags(contents);
            }));
            js_event.on("SETTING_CHANGE_showMouseover", (val => {
                __webpack_require__.g["showMouseover"] = val;
                js_event.emit("UP_BAN_UPDATE", null);
            }));
            setTimeout((() => {
                ui_unsafeWindow.document.addEventListener("visibilitychange", (() => {}));
            }));
        }
        function ui_init() {
            js_data.loadGeneralSetting((setting => {
                __webpack_require__.g["showMouseover"] = setting.showMouseover;
            }));
        }
        const ui = {
            loadUI(pageType) {
                log_log("UI初始化");
                ui_init();
                log_log("UI事件绑定中");
                ui_bindEvents();
                log_log("CSS加载中");
                injectStyle();
                log_log("页面类型：" + pageType);
                if (pageType === "HOME" || pageType === "VIDEO_HOME" || pageType === "ARTICLE_HOME") {
                    loadHomeUI();
                } else if (pageType === "VIDEO" || pageType === "ARTICLE") {
                    loadArticleUI();
                }
            },
            attachBanButton(dom) {
                let banButton = banButtonObj;
                dom.addEventListener("pointermove", (e => {
                    js_data.loadGeneralSetting((setting => {
                        if (setting.showBanButton) {
                            if (banButton.activeDom !== dom && !banButton.active) {
                                if (dom["contentData"]["hidden"]) return;
                                banButton.activeDom = dom;
                                let rect = dom.getBoundingClientRect();
                                banButton.dom.style.left = rect.right - 20 + "px";
                                banButton.dom.style.top = rect.top + "px";
                                banButton.dom.style.visibility = "visible";
                                banButton.activeData = dom["contentData"];
                                banButton.active = true;
                            }
                        }
                    }));
                }));
            },
            attachBanCommentButton(c) {
                let type = util.getCommentType();
                if (type === "NEW") {
                    attachBanCommentButtonNew(c, (() => {
                        _banReplyUser(c.username);
                    }));
                } else {
                    attachBanCommentButtonOld(c, (() => {
                        _banReplyUser(c.username);
                    }));
                }
            }
        };
        function VideoItem2NormalVideoContainer(node, i) {
            let a = node.querySelector("a.video-image");
            let idRegex = /\d.{5,}/;
            let avId = a.getAttribute("href").match(idRegex);
            let img = a.querySelector("img");
            let title = img.getAttribute("alt");
            let thumbnail = img.getAttribute("src");
            let mt = node.querySelector("figcaption.module-title");
            let title2 = mt.querySelector("a").getAttribute("title");
            let regexPlay = /点击:(\d+)/;
            let playCount = title2.match(regexPlay)[1];
            let danmuContainer = mt.querySelector(".icon-danmu");
            let danmuCount = danmuContainer ? danmuContainer.innerText.substring(1) : "";
            let nomargin = "";
            if ((i + 1) % 5 === 0) {
                nomargin = "no-margin-right";
            }
            let template = `<div class="normal-video-container ${nomargin}">\n<div class="normal-video log-item" data-atomid="${avId}" data-mediaid="${avId}" data-albumid=""><a class="normal-video-cover" target="_blank" href="/v/ac${avId}"><img src="${thumbnail}" alt="${title}" loading="lazy">\n</a><a class="normal-video-title" target="_blank" href="/v/ac${avId}" title="${title2}">${title}</a><p class="normal-video-info"><span class="icon icon-view-player">${playCount}</span><span class="icon icon-danmu">${danmuCount}</span></p></div></div>`;
            return template;
        }
        function fixedRefresh(data) {
            util.getPage(data.href, (doc => {
                let vs = doc.querySelectorAll(".video-item");
                let videos = [];
                vs.forEach((v => {
                    videos.push(v);
                }));
                if (videos.length > 0) {
                    let container = data.container;
                    container.innerHTML = "";
                    let items = [];
                    for (let i = 0; i < 15 && videos.length > 0; i++) {
                        let index = Math.floor(Math.random() * videos.length);
                        let item = videos[index];
                        videos.splice(index, 1);
                        items.push(item);
                    }
                    let html = "";
                    items.forEach(((item, i) => {
                        html += VideoItem2NormalVideoContainer(item, i);
                    }));
                    container.innerHTML = html;
                }
            }));
        }
        function _repair() {
            let allSectionsChanges = document.querySelectorAll(".header-change");
            if (allSectionsChanges.length < 10) return false;
            log_log(allSectionsChanges.length);
            for (let i = 0; i < allSectionsChanges.length; i++) {
                let oldButton = allSectionsChanges[i];
                let sectionLink = oldButton.previousElementSibling;
                let href = sectionLink.getAttribute("href");
                let fixButton = document.createElement("span");
                fixButton.innerHTML = `<i class="icon icon-loading"></i> 换一批 <span class="home-fix-suffix">Fix</span>`;
                fixButton.classList.add("header-change");
                fixButton.classList.add("header-change-fix");
                let container = oldButton.parentNode.parentNode.nextSibling;
                fixButton["data"] = {
                    href,
                    container
                };
                oldButton.parentNode.append(fixButton);
                oldButton.remove();
                fixButton.addEventListener("click", (() => {
                    fixedRefresh(fixButton.data);
                }));
            }
            return true;
        }
        function repair() {
            if (!_repair()) setTimeout(repair, 0);
        }
        const homepageRepair = repair;
        let homeTask_unsafeWindow = window;
        function getMonkeyVideo(doc) {
            let list = doc.querySelectorAll(".monkey-video");
            let result = [];
            list.forEach((i => {
                let title = i.getAttribute("data-title");
                let t = i.querySelector(".monkey-up-name");
                let username = t.innerText.substring(3).trim();
                result.push({
                    title,
                    username,
                    dom: i,
                    type: "VIDEO"
                });
            }));
            return result;
        }
        function getRecommendedVideo(doc) {
            let list = doc.querySelectorAll(".recommend-video");
            let result = [];
            list.forEach((i => {
                let title = i.querySelector(".video-title").innerText;
                let t = i.querySelector(".normal-mask-title");
                let t2 = t.nextElementSibling;
                let username = t2.querySelector("span.text-overflow").innerText.substring(3).trim();
                result.push({
                    title,
                    username,
                    dom: i,
                    type: "VIDEO"
                });
            }));
            return result;
        }
        function getBananaVideo(doc) {
            let list = doc.querySelectorAll(".banana-video");
            let result = [];
            list.forEach((i => {
                let t = i.querySelector(".banana-video-title");
                let title = t.innerText;
                let t2 = i.querySelector(".banana-up-name");
                let username = t2.getAttribute("title");
                result.push({
                    title,
                    username,
                    dom: i,
                    type: "VIDEO"
                });
            }));
            return result;
        }
        function getLiveVideo(doc) {
            let list = doc.querySelectorAll(".live-video");
            let result = [];
            list.forEach((i => {
                let title = i.getAttribute("data-title");
                let t = i.querySelector(".live-video-up-name");
                let username = t.innerText.substring(3).trim();
                result.push({
                    title,
                    username,
                    dom: i,
                    type: "VIDEO"
                });
            }));
            return result;
        }
        function getNormalVideo(doc) {
            let list = doc.querySelectorAll(".normal-video");
            let result = [];
            list.forEach((i => {
                let t = i.querySelector(".normal-video-title");
                let title = t.innerText;
                let str = t.getAttribute("title");
                let regex = /UP:(.+)/;
                let username = regex.exec(str)[1].trim();
                result.push({
                    title,
                    username,
                    dom: i,
                    type: "VIDEO"
                });
            }));
            return result;
        }
        function getRankedVideo(doc) {
            let list = doc.querySelectorAll(".list-content-videos .log-item");
            let result = [];
            list.forEach((i => {
                let t = i.querySelector(".video-title");
                let title = t.innerText;
                let str = t.getAttribute("title");
                let regex = /UP:(.+)/;
                let username = regex.exec(str)[1].trim();
                result.push({
                    title,
                    username,
                    dom: i,
                    type: "VIDEO"
                });
            }));
            return result;
        }
        function getSliderVideos(doc) {
            let list = doc.querySelectorAll(".slider-small-item");
            let result = [];
            list.forEach((i => {
                let t = i.querySelector(".slider-title").firstChild;
                let title = t.innerText;
                let t2 = t.nextElementSibling.firstChild;
                let username = t2.innerText.substring(3).trim();
                result.push({
                    title,
                    username,
                    dom: i,
                    type: "VIDEO"
                });
            }));
            return result;
        }
        function getVideoHomeItem(doc) {
            let list = doc.querySelectorAll("figure.video-item");
            let result = [];
            list.forEach((i => {
                let t = i.querySelector("a[title]");
                let title = t.innerText;
                let str = t.getAttribute("title");
                let regex = /UP:(.+)/;
                let username = regex.exec(str)[1].trim();
                result.push({
                    title,
                    username,
                    dom: i,
                    type: "VIDEO"
                });
            }));
            return result;
        }
        function getVideoHomeItem2(doc) {
            let list = doc.querySelectorAll(".list-content-item");
            let result = [];
            list.forEach((i => {
                let t = i.querySelector(".list-content-title");
                let title = t.innerText;
                let str = t.getAttribute("title");
                let t2 = i.querySelector(".list-content-uplink");
                let username = t2.innerText.substring(3).trim();
                result.push({
                    title,
                    username,
                    dom: i,
                    type: "VIDEO"
                });
            }));
            return result;
        }
        function getVideoHomeRankItem(doc) {
            let list = doc.querySelectorAll(".rank-list li");
            let result = [];
            list.forEach((i => {
                let t = i.querySelector("b.title a");
                let title = t.innerText;
                let str = t.getAttribute("title");
                let regex = /UP:(.+)/;
                let username = regex.exec(str)[1].trim();
                result.push({
                    title,
                    username,
                    dom: i,
                    type: "VIDEO"
                });
            }));
            return result;
        }
        function getHomeArticle(doc) {
            let tab = doc.querySelector(".article-tab");
            if (tab == null) return [];
            let list = tab.querySelectorAll("li[data-atomid]");
            let result = [];
            list.forEach((i => {
                var username, title;
                var t;
                let block = i.querySelector(".main-content-block");
                if (block != null) {
                    t = block.querySelector("p.block-title");
                } else {
                    t = i.querySelector("a.main-content-item");
                }
                title = t.innerText;
                let str = t.getAttribute("title");
                let regex = /UP:(.+)/;
                username = regex.exec(str)[1].trim();
                result.push({
                    title,
                    username,
                    dom: i,
                    type: "ARTICLE"
                });
            }));
            return result;
        }
        function getArticles(doc) {
            let list = doc.querySelectorAll(".article-item");
            console.log("list=", list);
            let result = [];
            list.forEach((i => {
                let t = i.querySelector("a[title]");
                let title = t.innerText;
                let t2 = i.querySelector("span.up a");
                let username = t2.innerText.substring(3).trim();
                result.push({
                    title,
                    username,
                    dom: i,
                    type: "ARTICLE"
                });
            }));
            return result;
        }
        function homeTask(pageType) {
            function loadBanList(callback) {
                js_data.loadBanList(callback);
            }
            function loadKeywordList(callback) {
                js_data.loadKeywords(callback);
            }
            function getAllVideoContentInfo(pageType, doc) {
                let homeList = [ getMonkeyVideo, getLiveVideo, getRankedVideo, getRecommendedVideo, getNormalVideo, getHomeArticle, getBananaVideo ];
                let videoHomeList = [ getVideoHomeItem, getVideoHomeItem2, getVideoHomeRankItem, getSliderVideos ];
                let articleHomeList = [ getArticles ];
                let tasks = [];
                if (pageType === "HOME") {
                    tasks = homeList;
                } else if (pageType === "VIDEO_HOME") {
                    tasks = videoHomeList;
                } else if (pageType === "ARTICLE_HOME") {
                    tasks = articleHomeList;
                }
                let contentList = [];
                tasks.forEach((f => {
                    let items = f(doc);
                    contentList = contentList.concat(items);
                }));
                return contentList;
            }
            function refreshPageContent(target) {
                if (typeof target === "undefined" || target == null) {
                    target = homeTask_unsafeWindow.document;
                }
                let contents = getAllVideoContentInfo(pageType, target);
                attachInfo(contents);
                js_event.emit("FILTER_PAGE_CONTENTS", contents);
            }
            function lauchObserver() {
                let mutationObserver = new MutationObserver((function(mutations) {
                    mutations.forEach((function(mutation) {
                        let target = mutation.target;
                        if (target.tagName === "DIV") {
                            setTimeout((() => {
                                refreshPageContent(target);
                            }), 500);
                        }
                    }));
                }));
                mutationObserver.observe(homeTask_unsafeWindow.document, {
                    subtree: true,
                    childList: true
                });
            }
            function attachInfo(contents) {
                contents.forEach((c => {
                    if (!("contentData" in c.dom)) {
                        c.dom["contentData"] = c;
                        ui.attachBanButton(c.dom);
                    }
                }));
            }
            function bindEvents() {
                js_event.on("UP_BAN_UPDATE", (() => {
                    refreshPageContent();
                }));
                js_event.on("KEYWORD_BAN_UPDATE", (() => {
                    refreshPageContent();
                }));
            }
            lauchObserver();
            bindEvents();
            homepageRepair();
            setTimeout(refreshPageContent, 2e3);
        }
        var taggingUI_code = '<div class="tagging-ui-container smooth-remove"> <div class="tagging-close-button very-smooth">×</div> <div class="tagging-ui-inner"> <div class="name-to-tag">XXX的标签</div> <div class="tagging-input-wrap"> <input placeholder="...多个标签用空格分开,最多10字" maxlength="10" class="tagging-input"> <button class="tagging-submit very-smooth">添加</button> </div> <div class="tags-container"> </div> </div> </div>';
        const taggingUI = taggingUI_code;
        let tagging_unsafeWindow = window;
        function _newTagDom(text) {
            let doc = tagging_unsafeWindow.document;
            let tagDom = doc.createElement("div");
            tagDom.classList.add("user-tag");
            let tagText = doc.createElement("div");
            tagText.classList.add("user-tag-text");
            tagText.innerText = text;
            tagDom.appendChild(tagText);
            return tagDom;
        }
        function _newTagButton() {
            let doc = tagging_unsafeWindow.document;
            let b = doc.createElement("div");
            b.innerText = "＋标签";
            b.classList.add("add-new-tag");
            b.classList.add("very-smooth");
            return b;
        }
        function _lookUpButton() {
            let doc = tagging_unsafeWindow.document;
            let b = doc.createElement("div");
            b.innerHTML = "<i class='icon-ks icon-dao-hang-search'></i>";
            b.classList.add("lookup-btn");
            b.classList.add("very-smooth");
            return b;
        }
        function _addTagToContainer(container, tag) {
            let t = _newTagDom(tag);
            container.appendChild(t);
        }
        function _removeTagFromContainer(container, tag) {}
        function _showTagsInWindow(username) {
            let doc = tagging_unsafeWindow.document;
            let tagsContainerDom = __webpack_require__.g["taggingUI"].querySelector(".tags-container");
            tagsContainerDom.innerHTML = "";
            js_data.getTags(username, (tags => {
                tags.forEach((t => {
                    let tdom = doc.createElement("span");
                    tdom.classList.add("tag-item");
                    tdom.innerText = t;
                    tdom.onclick = () => {
                        _deleteTag(username, t, (() => {
                            js_event.emit("TAGS_UPDATE", username);
                            _showTagsInWindow(username);
                        }));
                    };
                    tagsContainerDom.append(tdom);
                }));
            }));
        }
        function popAddingTagWindow(username) {
            let containerDom = __webpack_require__.g["taggingUI"];
            containerDom.classList.remove("smooth-remove");
            containerDom.querySelector(".name-to-tag").innerText = "[" + username + "]的标签";
            let tagsContainer = __webpack_require__.g["taggingUI"].querySelector(".tags-container");
            while (tagsContainer.firstChild) {
                tagsContainer.firstChild.remove();
            }
            _showTagsInWindow(username);
            containerDom.querySelector(".tagging-submit").onclick = () => {
                let input = containerDom.querySelector(".tagging-input");
                let tagtext = input.value.trim();
                input.value = "";
                if (tagtext.length > 0) {
                    _addTag(username, tagtext, (() => {
                        js_event.emit("TAGS_UPDATE", username);
                        _showTagsInWindow(username);
                    }));
                }
            };
        }
        function _attachUserTagsDom(username, anchor) {
            let doc = tagging_unsafeWindow.document;
            let container = doc.createElement("div");
            container.classList.add("user-tags");
            let newBtn = _newTagButton();
            let lookBtn = _lookUpButton();
            js_data.getTags(username, (tags => {
                tags.forEach((t => {
                    let tagDom = _newTagDom(t);
                    container.appendChild(tagDom);
                }));
                anchor.insertAdjacentElement("afterend", container);
                newBtn.addEventListener("click", (() => {
                    popAddingTagWindow(username);
                }));
                container.insertAdjacentElement("beforebegin", lookBtn);
                container.appendChild(newBtn);
                lookBtn.addEventListener("click", (() => {
                    js_event.emit("LOOKUP", username);
                }));
            }));
        }
        function _refreshUserTags(username, anchor) {
            let container = anchor.parentElement.querySelector(".user-tags");
            container.querySelectorAll(".user-tag").forEach((d => {
                d.remove();
            }));
            let addBtn = container.querySelector(".add-new-tag");
            js_data.getTags(username, (tags => {
                tags.forEach((t => {
                    let tagDom = _newTagDom(t);
                    container.insertBefore(tagDom, addBtn);
                }));
            }));
            js_data.loadGeneralSetting((setting => {
                if (!setting.showUserTags) {
                    container.classList.add("remove");
                } else {
                    container.classList.remove("remove");
                }
            }));
        }
        function _showCommentUsrTag(commentData) {
            commentData.forEach((d => {
                let anchor = d.nameAnchor;
                if (typeof anchor["tagShown"] === "undefined") {
                    anchor["tagShown"] = true;
                    _attachUserTagsDom(d.username, anchor);
                    js_data.loadGeneralSetting((setting => {
                        enableTags(setting.showUserTags);
                    }));
                } else {
                    _refreshUserTags(d.username, anchor);
                    js_data.loadGeneralSetting((setting => {
                        enableTags(setting.showUserTags);
                    }));
                }
            }));
        }
        function _showAuthorTag() {
            let doc = tagging_unsafeWindow.document;
            let anchor = doc.querySelector("a.up-name");
            if (!anchor) anchor = doc.querySelector("a.upname");
            if (!anchor) {
                log_log("UP name not found!");
                setTimeout(_showAuthorTag, 1e3);
                return;
            }
            let username = anchor.innerText;
            if (!username) {
                log_log("UP name not found!");
                setTimeout(_showAuthorTag, 1e3);
                return;
            }
            anchor = anchor.nextSibling;
            if (__webpack_require__.g["authorTagAdded"]) {
                _refreshUserTags(username, anchor.parentElement);
            } else {
                _attachUserTagsDom(username, anchor.parentElement);
            }
            __webpack_require__.g["authorTagAdded"] = true;
        }
        __webpack_require__.g["currentCommentData"] = [];
        function _refreshTags(commentData) {
            __webpack_require__.g["currentCommentData"] = commentData;
            _showCommentUsrTag(commentData);
            _showAuthorTag();
        }
        function enableTags(val) {
            let doc = tagging_unsafeWindow.document;
            if (!val) {
                doc.querySelectorAll(".user-tags").forEach((dom => {
                    dom.classList.add("remove");
                }));
            } else {
                doc.querySelectorAll(".user-tags").forEach((dom => {
                    dom.classList.remove("remove");
                }));
            }
        }
        function tagging_bindEvents() {
            js_event.on("SHOW_COMMENT_TAGS", _showCommentUsrTag);
            js_event.on("REFRESH_TAGS", _refreshTags);
            js_event.on("SETTING_CHANGE_showUserTags", enableTags);
        }
        function _closeUI() {
            __webpack_require__.g["taggingUI"].classList.add("smooth-remove");
        }
        function loadUIHTML() {
            tagging_unsafeWindow.document.body.insertAdjacentHTML("beforeend", taggingUI);
            let ui = tagging_unsafeWindow.document.body.lastChild;
            __webpack_require__.g["taggingUI"] = ui;
            let closeBtn = ui.querySelector(".tagging-close-button");
            closeBtn.addEventListener("click", _closeUI);
        }
        function _addTag(username, tag, callback) {
            js_data.addTagToUser(username, tag, (() => {
                if (callback) callback();
            }));
        }
        function _deleteTag(username, tag, callback) {
            js_data.removeTagForUser(username, tag, (() => {
                js_event.emit("REMOVE_TAG", [ username, tag ]);
                if (callback) callback();
            }));
        }
        function _init() {}
        const tagging = {
            addTags(username, tags, callback) {
                js_data.addTagToUser(username, tags, (() => {
                    js_event.emit("ADD_TAGS", [ username, tags ]);
                    if (callback) callback();
                }));
            },
            addTag(username, tag, callback) {
                _addTag(username, tag, callback);
            },
            delteTag(username, tag, callback) {
                _deleteTag(username, tag, callback);
            },
            getTags(username, callback) {
                js_data.getTags(username, callback);
            },
            getAllTags(callback) {
                js_data.getAlltags(callback);
            },
            init() {
                loadUIHTML();
                tagging_bindEvents();
                _showAuthorTag();
                __webpack_require__.g["taggedComments"] = {};
            }
        };
        const commentImagefy_EdgeDetector = util.EdgeDetector;
        const debug = 0;
        function commentImagefy_AddCSS() {
            const style = document.createElement("style");
            document.head.appendChild(style);
            style.sheet.insertRule(`\n        .plugin_send_btn {\n            background-color: ##f8f8f8;\n            color: #999;\n            font-size: 14px;\n            border-radius: 5px;\n            border: none;\n            line-height: 30px;\n            height: 30px;\n            display: inline-block;\n            text-align: center;\n            width: 96px;\n            margin-top: 4px !important;\n        }\n    `, style.sheet.cssRules.length);
            style.sheet.insertRule(`\n        .plugin_send_btn:hover {\n            background-color: #e5e5e5;\n            color: grey;\n        }\n    `, style.sheet.cssRules.length);
        }
        function getText() {
            let doc = unsafeWindow.document;
            let editor = doc.querySelector(".edui-body-container");
            return editor.innerText;
        }
        function createCanvas(text) {
            text = text.trim();
            let padding = 1;
            let width = 600;
            let stripeColor = "rgba(255,255,255,0)";
            let canvas = new fabric.Canvas("canvas", {
                backgroundColor: "white",
                width,
                height: 300
            });
            const maxWidth = width - 2 * padding;
            const fontSize = 24;
            let textBox = new fabric.Textbox(text, {
                width: maxWidth,
                fontSize,
                fontFamily: "AcFun Symbol,Helvetica Neue,Helvetica,Arial,SimSun,sans-serif",
                fontStyle: "italic",
                fill: "black",
                textAlign: "left",
                splitByGrapheme: true,
                left: padding,
                top: padding
            });
            canvas.add(textBox);
            canvas.renderAll();
            log_log("textbox", textBox);
            let textHeight = Math.ceil(textBox.height + 2 * padding);
            const tmp_canvas = document.createElement("canvas");
            const tmp_ctx = tmp_canvas.getContext("2d");
            tmp_ctx.font = `italic ${fontSize}px 'AcFun Symbol,Helvetica Neue,Helvetica,Arial,SimSun,sans-serif'`;
            let zoom = unsafeWindow.devicePixelRatio || 1;
            const textWidth = Math.ceil(tmp_ctx.measureText(text).width * zoom);
            log_log("textHeight", textHeight);
            canvas.setWidth(Math.min(textWidth + 2 * padding, width));
            textBox.width = canvas.width;
            canvas.setHeight(textHeight);
            canvas.renderAll();
            let dataUrl1 = canvas.toDataURL("image/png");
            log_log("data canvas width", canvas.width, "canvas height", canvas.height);
            log_log("data", canvas, dataUrl1);
            log_log("data------------------");
            let ctx = canvas.getContext("2d");
            let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let data = imageData.data;
            let r = .4;
            let k = 255 * (1 - r);
            for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.floor((255 - data[i]) * r + k);
                data[i + 1] = Math.floor((255 - data[i + 1]) * r + k);
                data[i + 2] = Math.floor((255 - data[i + 2]) * r + k);
            }
            let tmp_canvas2 = document.createElement("canvas");
            tmp_canvas2.width = canvas.width;
            tmp_canvas2.height = canvas.height;
            let ctx2 = tmp_canvas2.getContext("2d");
            ctx2.putImageData(imageData, 0, 0);
            let dataUrl2 = tmp_canvas2.toDataURL("image/png");
            return {
                canvas: canvas.getElement(),
                dataUrl: dataUrl1,
                dataUrl_inverted: dataUrl2,
                width: canvas.width,
                height: canvas.height
            };
        }
        async function createCaptcha(text) {
            let {canvas, dataUrl, dataUrl_inverted} = createCanvas(text);
            log_log("canvas size = ", canvas.width, canvas.height);
            let text_ctx = canvas.getContext("2d");
            log_log("copying");
            let copy_canvas = document.createElement("canvas");
            copy_canvas.width = canvas.width;
            copy_canvas.height = canvas.height;
            let copy_ctx = copy_canvas.getContext("2d");
            copy_ctx.drawImage(canvas, 0, 0);
            log_log("edge create", commentImagefy_EdgeDetector);
            let edge_detector_top = new commentImagefy_EdgeDetector(copy_canvas, [ "left", "top" ]);
            log_log("ed top", edge_detector_top);
            let edge_canvas_top = edge_detector_top.detectEdges();
            let edge_ctx_top = edge_canvas_top.getContext("2d");
            let edge_detector_bottom = new commentImagefy_EdgeDetector(copy_canvas, [ "bottom" ]);
            let edge_canvas_bottom = edge_detector_bottom.detectEdges();
            let edge_ctx_bottom = edge_canvas_bottom.getContext("2d");
            let edge_detector_right = new commentImagefy_EdgeDetector(copy_canvas, [ "right" ]);
            let edge_canvas_right = edge_detector_right.detectEdges();
            let edge_ctx_right = edge_canvas_right.getContext("2d");
            let c1 = 255;
            let c2 = 45;
            let c3 = 0;
            log_log("create bg");
            let background_canvas = document.createElement("canvas");
            background_canvas.width = canvas.width;
            background_canvas.height = canvas.height;
            let background_ctx = background_canvas.getContext("2d");
            background_ctx.fillStyle = "rgba(205,205,205,1)";
            background_ctx.fillRect(0, 0, canvas.width, canvas.height);
            log_log("filtering");
            let text_image_data = copy_ctx.getImageData(0, 0, canvas.width, canvas.height);
            let text_data = text_image_data.data;
            let background_image_data = background_ctx.getImageData(0, 0, canvas.width, canvas.height);
            let background_data = background_image_data.data;
            let edge_image_data_top = edge_ctx_top.getImageData(0, 0, canvas.width, canvas.height);
            let edge_data_top = edge_image_data_top.data;
            let edge_image_data_bottom = edge_ctx_bottom.getImageData(0, 0, canvas.width, canvas.height);
            let edge_data_bottom = edge_image_data_bottom.data;
            let edge_image_data_right = edge_ctx_right.getImageData(0, 0, canvas.width, canvas.height);
            let edge_data_right = edge_image_data_right.data;
            for (let i = 0; i < text_data.length; i += 4) {
                if (text_data[i] < 250) {
                    let r = background_data[i];
                    let g = background_data[i + 1];
                    let b = background_data[i + 2];
                    let a = background_data[i + 3];
                    let f = 100;
                    let c = 255;
                    background_data[i] = Math.floor(c);
                    background_data[i + 1] = Math.floor(c);
                    background_data[i + 2] = Math.floor(c);
                    background_data[i + 3] = a;
                }
            }
            for (let i = 0; i < text_data.length; i += 4) {
                let x = i / 4 % canvas.width;
                let y = Math.floor(i / 4 / canvas.width);
                if (edge_data_top[i] > 250) {
                    let r = background_data[i];
                    let g = background_data[i + 1];
                    let b = background_data[i + 2];
                    let a = background_data[i + 3];
                    let f = -30;
                    let c = 185;
                    if (y % 3 === 1) {
                        c = 255;
                    }
                    if (x % 3 === 1) {
                        c = 255;
                    }
                    r = c;
                    g = c;
                    b = c;
                    background_data[i] = Math.floor(r);
                    background_data[i + 1] = Math.floor(g);
                    background_data[i + 2] = Math.floor(b);
                    background_data[i + 3] = a;
                } else if (edge_data_bottom[i] > 50) {
                    let r = background_data[i];
                    let g = background_data[i + 1];
                    let b = background_data[i + 2];
                    let a = background_data[i + 3];
                    let c = c2;
                    if (x % 2 === 1) {
                        c = 100;
                    } else if (y % 2 === 0) {
                        c = 100;
                    } else if (y % 2 === 1) {
                        c = 255;
                    }
                    r = c;
                    b = c * .85;
                    g = c * .75;
                    background_data[i] = Math.floor(r);
                    background_data[i + 1] = Math.floor(g);
                    background_data[i + 2] = Math.floor(b);
                    background_data[i + 3] = 255;
                } else if (edge_data_right[i] > 200) {
                    let r = background_data[i];
                    let g = background_data[i + 1];
                    let b = background_data[i + 2];
                    let a = background_data[i + 3];
                    let c = b;
                    if (y % 2 === 1 && x % 2 === 0) {
                        c = c2;
                    }
                    r = c;
                    g = c;
                    b = c;
                    background_data[i] = Math.floor(r);
                    background_data[i + 1] = Math.floor(g);
                    background_data[i + 2] = Math.floor(b);
                    background_data[i + 3] = 255;
                } else {
                    let c = c1;
                    if (y % 3 === 1 || y % 3 === 2) {
                        c = c3 / 2;
                    }
                    if (x % 3 === 1 || x % 3 === 2) {
                        c = c3;
                    }
                    let r = c;
                    let g = c;
                    let b = c;
                    background_data[i] = Math.floor(r);
                    background_data[i + 1] = Math.floor(g);
                    background_data[i + 2] = Math.floor(b);
                    background_data[i + 3] = 255;
                }
                background_data[i] = 255 - background_data[i];
                background_data[i + 1] = 255 - background_data[i + 1];
                background_data[i + 2] = 255 - background_data[i + 2];
                background_data[i + 3] = 255;
            }
            background_ctx.putImageData(background_image_data, 0, 0);
            let blob = await new Promise(((resolve, reject) => {
                log_log("background_canvas size = ", background_canvas.width, background_canvas.height);
                background_canvas.toBlob((blob => resolve(blob)), "image/png");
            }));
            return {
                blob,
                width: canvas.width,
                height: canvas.height
            };
        }
        const commentImagefy_removeTextNodes = util.removeTextNodes;
        function appendFilter() {
            let filter = document.createElement("div");
            filter.style.position = "fixed";
            filter.style.top = "0";
            filter.style.left = "0";
            filter.style.width = "100%";
            filter.style.height = "100%";
            filter.style.backgroundColor = "rgba(0,0,0,0.5)";
            filter.style.zIndex = "1000";
            filter.style.color = "white";
            document.body.appendChild(filter);
            let loading = document.createElement("div");
            loading.style.position = "fixed";
            loading.style.top = "50%";
            loading.style.left = "50%";
            loading.style.transform = "translate(-50%, -50%)";
            loading.style.zIndex = "1001";
            loading.innerHTML = "正在生成...";
            filter.appendChild(loading);
            __webpack_require__.g.filter = filter;
        }
        function uploadPreviewImage(text) {
            let wrapper = document.querySelector(".edui-container");
            wrapper.style.pointerEvents = "none";
            createCaptcha(text).then((async data => {
                {
                    log_log(data);
                    if (!debug) {
                        let binaryData = await data.blob.arrayBuffer();
                        let acid = util.getCurrentAcId();
                        let cacheUrl = await util.uploadImage(acid, binaryData);
                        if (!cacheUrl) {
                            return;
                        }
                        let container = unsafeWindow.document.querySelector(".edui-body-container");
                        let img = document.createElement("img");
                        img.src = cacheUrl;
                        img.style.width = data.width + "px";
                        img.style.height = data.height + "px";
                        commentImagefy_removeTextNodes(container);
                        container.appendChild(img);
                        filter.remove();
                        wrapper.style.pointerEvents = "auto";
                    } else {
                        let url = URL.createObjectURL(data.blob);
                        let img = document.createElement("img");
                        img.src = url;
                        let container = unsafeWindow.document.querySelector(".edui-body-container");
                        commentImagefy_removeTextNodes(container);
                        container.appendChild(img);
                        filter.remove();
                        wrapper.style.pointerEvents = "auto";
                    }
                }
            }));
        }
        function commentImagefy_AddUI() {
            if (commentImagefy_initialized) {
                return;
            }
            let doc = unsafeWindow.document;
            let toolbar = doc.querySelector(".edui-btn-toolbar");
            let old_send_btn = toolbar.querySelector(".button-wrapper");
            let btn_wrapper = doc.createElement("div");
            btn_wrapper.className = "button-wrapper";
            btn_wrapper.style.display = "inline-block";
            btn_wrapper.style.position = "absolute";
            btn_wrapper.style.right = "104px";
            btn_wrapper.className = "button-wrapper";
            toolbar.insertBefore(btn_wrapper, old_send_btn);
            let send_btn = doc.createElement("button");
            send_btn.className = "plugin_send_btn";
            send_btn.innerHTML = "加载中";
            send_btn.style.pointerEvents = "none";
            send_btn.onclick = function() {
                appendFilter();
                setTimeout((() => {
                    let text = getText();
                    uploadPreviewImage(text);
                }));
            };
            btn_wrapper.appendChild(send_btn);
            __webpack_require__.g.send_btn = send_btn;
            commentImagefy_initialized = true;
        }
        const fabricjs = "https://cdnjs.cloudflare.com/ajax/libs/fabric.js/6.0.0-rc.1/fabric.js";
        function loadScript(url) {
            return new Promise(((resolve, reject) => {
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = url;
                log_log("load script", url);
                script.onload = () => resolve(script);
                script.onerror = err => {
                    log_log("error loading script", err);
                    reject(new Error("Script load error for " + url));
                };
                document.head.appendChild(script);
            }));
        }
        function commentImagefy_enable() {
            if (!__webpack_require__.g.send_btn) {
                return;
            }
            __webpack_require__.g.send_btn.style.pointerEvents = "auto";
            __webpack_require__.g.send_btn.innerHTML = "防电风扇";
            log_log("防电风扇功能已启用");
        }
        let commentImagefy_initialized = false;
        let scrirptLoaded = false;
        function commentImagefy_init() {
            commentImagefy_AddCSS();
            const observer = new MutationObserver((mutations => {
                mutations.forEach((mutation => {
                    mutation.addedNodes.forEach((node => {
                        if (node.classList && node.classList.contains("area-editor")) {
                            setTimeout((() => {
                                commentImagefy_AddUI();
                                if (scrirptLoaded) commentImagefy_enable();
                            }), 100);
                            observer.disconnect();
                        }
                    }));
                }));
            }));
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            loadScript(fabricjs).then((() => {
                scrirptLoaded = true;
                if (document.querySelector(".area-editor")) {
                    commentImagefy_AddUI();
                } else {}
                commentImagefy_enable();
            }));
        }
        const commentImagefy = {
            init: commentImagefy_init
        };
        let contentTask_unsafeWindow = window;
        function _getCommentsOldVer(doc) {
            let result = [];
            let items = doc.querySelectorAll(".fc-comment-item");
            items.forEach((i => {
                let nameAnchor = i.querySelector("a.name");
                let username = nameAnchor.innerText;
                let banButtonAnchor = i.querySelector("a.btn-quote");
                if (banButtonAnchor === null) {
                    console.log();
                    return;
                }
                let count = banButtonAnchor.parentNode.children.length;
                banButtonAnchor = banButtonAnchor.parentNode.children[count - 1];
                if (banButtonAnchor !== null) {
                    result.push({
                        username,
                        nameAnchor: nameAnchor.parentNode,
                        banButtonAnchor,
                        dom: i
                    });
                }
            }));
            return result;
        }
        function _getCommentsNewVer(doc) {
            let result = [];
            let items = doc.querySelectorAll(".area-comment-first");
            items.forEach((i => {
                let nameAnchor = i.querySelector("a.name");
                let username = nameAnchor.innerText;
                let banButtonAnchor = i.querySelector("a.area-comment-reply");
                if (banButtonAnchor !== null) {
                    result.push({
                        username,
                        nameAnchor,
                        banButtonAnchor,
                        dom: i
                    });
                }
            }));
            return result;
        }
        function _getComments(doc) {
            let comments = util.getCommentType() === "NEW" ? _getCommentsNewVer(doc) : _getCommentsOldVer(doc);
            return comments;
        }
        async function _innerSingleTask(c, urls) {
            let commentContent = c.dom.querySelector(".comment-content");
            if (!commentContent) {
                commentContent = c.dom.querySelector(".area-comment-des-content");
            }
            commentContent.innerHTML = "";
            let loading = document.createElement("div");
            loading.innerText = "里区内容加载中...";
            commentContent.appendChild(loading);
            let {info, data} = await innerACFun.extractFileFromImages(urls);
            let wrapper = document.createElement("div");
            wrapper.classList.add("inner-content-wrapper");
            wrapper.innerHTML = `<p><b>里区内容</b><span style="margin-left: 3px; color: #9a9a9a">仅屏蔽插件用户可见:</span></p>`;
            wrapper.style.border = "1px solid #ccc";
            wrapper.style.padding = "10px";
            let footer = document.createElement("p");
            footer.style.fontSize = "10px";
            footer.style.color = "#c89393";
            footer.innerText = "为了保护发布者的安全和你的合法权益，如果这是违规内容，请点击1.举报删帖;2.找UP主删帖。被删除的里区内容不会被插件恢复。\n插件作者不负责任何因使用插件而引起的法律问题。";
            let contentType = info.type;
            if (contentType.includes("image")) {
                let a = document.createElement("a");
                let url = URL.createObjectURL(new Blob([ data ], {
                    type: info.type
                }));
                a.href = url;
                a.target = "_blank";
                let img = document.createElement("img");
                a.appendChild(img);
                img.onload = () => {
                    commentContent.removeChild(loading);
                    wrapper.appendChild(a);
                    wrapper.appendChild(footer);
                };
                img.src = url;
            } else if (contentType.includes("video")) {
                let url = URL.createObjectURL(new Blob([ data ], {
                    type: info.type
                }));
                let video = document.createElement("video");
                video.controls = true;
                video.oncanplay = () => {
                    commentContent.removeChild(loading);
                    wrapper.appendChild(video);
                    wrapper.appendChild(footer);
                };
                video.src = url;
                video.width = 320;
                video.height = 240;
                video.style.backgroundColor = "#000";
            } else {
                let url = URL.createObjectURL(new Blob([ data ], {
                    type: info.type
                }));
                let a = document.createElement("a");
                a.href = url;
                a.download = info.name;
                a.innerText = "下载:" + info.name;
                commentContent.removeChild(loading);
                wrapper.appendChild(a);
                wrapper.appendChild(footer);
            }
            commentContent.appendChild(wrapper);
            return info;
        }
        async function innerContentTask(comments) {
            let todo = [];
            for (let i = 0; i < comments.length; i++) {
                let c = comments[i];
                if (c.dom.hasOwnProperty("commentData")) {
                    let imgs = c.dom.querySelectorAll("img[alt='点击以浏览图像']");
                    if (imgs.length === 0) continue;
                    let firstImg = imgs[0];
                    let src = firstImg.src;
                    let check = await innerACFun.isMaskImage(src);
                    if (!check) continue;
                    let srcs = [];
                    imgs.forEach((img => {
                        srcs.push(img.src);
                    }));
                    todo.push({
                        c,
                        list: srcs
                    });
                }
            }
            for (let i = 0; i < todo.length; i++) {
                let c = todo[i].c;
                let urls = todo[i].list;
                _innerSingleTask(c, urls).then((data => {}));
            }
        }
        function contentTask() {
            function bindEvents() {
                js_event.on("TAGS_UPDATE", (username => {
                    let cs = getCommentsData(contentTask_unsafeWindow.document);
                    cs = cs.filter((x => x.username === username));
                    js_event.emit("REFRESH_TAGS", cs);
                }));
                js_event.on("REPLY_BAN_UPDATE", (() => {
                    runCommentTask();
                }));
            }
            function getCommentsData(target) {
                return _getComments(target);
            }
            function attachDataUI(cs) {
                cs.forEach((c => {
                    if (!c.dom.hasOwnProperty("commentData")) {
                        ui.attachBanCommentButton(c);
                        c.dom["commentData"] = c;
                    }
                }));
            }
            function runCommentTask() {
                let comments = getCommentsData(contentTask_unsafeWindow.document);
                js_event.emit("FILTER_COMMENTS", comments);
            }
            function lauchObserver() {
                log_log("加载评论Observer");
                let mutationObserver = new MutationObserver((function(mutations) {
                    mutations.forEach((function(mutation) {
                        if (mutation.type === "childList") {
                            let targets = mutation.addedNodes;
                            targets.forEach((target => {
                                if (target.tagName === "DIV" && (target.classList.contains("fc-comment-list") || target.classList.contains("ac-comment-hot-list") || target.classList.contains("ac-comment-root-list") || target.hasChildNodes() && typeof target.firstChild.classList !== "undefined" && (target.firstChild.classList.contains("area-comment-top") || target.firstChild.classList.contains("area-comment-sec")))) {
                                    let cs = getCommentsData(target);
                                    js_event.emit("SHOW_COMMENT_TAGS", cs);
                                    attachDataUI(cs);
                                    js_event.emit("FILTER_COMMENTS", cs);
                                    setTimeout((() => {
                                        innerContentTask(cs);
                                    }), 0);
                                }
                            }));
                        }
                    }));
                }));
                mutationObserver.observe(contentTask_unsafeWindow.document, {
                    subtree: true,
                    childList: true
                });
            }
            setTimeout((() => {
                bindEvents();
            }));
            setTimeout((() => {
                lauchObserver();
            }));
            setTimeout((() => {
                tagging.init();
            }));
            setTimeout((() => {
                commentRecovery.init();
            }));
            setTimeout((() => {
                commentImagefy.init();
            }));
            setTimeout((() => {
                innerACFun.init();
            }));
        }
        function taskHOME(pagetype) {
            log_log("载入主要页面模块");
            homeTask(pagetype);
        }
        function taskCONTENT() {
            log_log("载入投稿页模块");
            contentTask();
        }
        function executeTask(pageType) {
            log_log("执行任务");
            if (pageType === "HOME" || pageType === "VIDEO_HOME" || pageType === "ARTICLE_HOME") {
                taskHOME(pageType);
            } else if (pageType === "VIDEO" || pageType === "ARTICLE") {
                taskCONTENT();
            }
        }
        const imsdkDataProvider = 16731600;
        let lastUpdateTime = 0;
        function oldCloudGet(callback) {
            let im = unsafeWindow.ImSdk;
            let instance = im.instance;
            let id = "0_" + imsdkDataProvider;
            let sessPromise = instance.kernel.openSession(0, imsdkDataProvider);
            sessPromise.then((d => {
                let msgs = d.cachedSession.messages;
                if (typeof msgs === "undefined" || msgs.length === 0) {
                    callback(null);
                    return;
                }
                let lastmsg = msgs[msgs.length - 1].title;
                try {
                    let info = lastmsg.split(" ");
                    let chunkinfo = info[0].split("/");
                    let chunksize = chunkinfo[1];
                    let texts = [];
                    if (chunksize) {
                        chunksize = parseInt(chunksize);
                        for (let i = 0; i < chunksize; i++) {
                            let m = msgs[msgs.length - i - 1].title;
                            let minfo = m.split(" ");
                            let mchunkinfo = minfo[0].split("/");
                            let chunk_i = parseInt(mchunkinfo[0]) - 1;
                            texts[chunk_i] = minfo.slice(1).join(" ");
                        }
                    }
                    let text = texts.join("");
                    callback(text);
                } catch (e) {
                    console.error(e);
                    callback(null);
                }
            }));
        }
        function checkImSDKInit(args) {
            let trySyncCount = 0;
            trySyncCount++;
            if (trySyncCount > 30) return;
            let im = unsafeWindow.ImSdk;
            log("IMSDK");
            log(im);
            let needWait = false;
            try {
                let checklist = typeof im === "undefined" || typeof im.instance === "undefined" || im.instance == null || !im.instance.connected || typeof im.instance.kernel.cache === "undefined";
                needWait = checklist;
            } catch (e) {
                needWait = true;
                console.log("sync old DEBUG", needWait);
            }
            if (needWait) {
                log("载入信息。。");
                setTimeout((() => {
                    checkImSDKInit(args);
                }), 1e3);
            } else {
                setTimeout((() => {
                    ImSdkDataCheck(args);
                }), 0);
            }
        }
        function updateListByOldCloudData(d) {
            function trimWord(d) {
                return d.replace(/(\r\n|\n|\r)/gm, "").trim();
            }
            let keywordsstr = decode(d.keywords);
            let upsstr = decode(d.ups);
            let replierstr = typeof d.repliers == "undefined" ? "" : decode(d.repliers);
            let spliter = upsstr.indexOf(" ") > 0 || keywordsstr.indexOf(" ") > 0 ? " " : ",";
            let keywords = keywordsstr.split(spliter).map(trimWord);
            let ups = upsstr.split(spliter).map(trimWord);
            let repliers = replierstr.split(spliter).map(trimWord);
            keywords = keywords.length === 1 && keywords[0] === "" ? [] : keywords;
            ups = ups.length === 1 && ups[0] === "" ? [] : ups;
            repliers = repliers.length === 1 && repliers[0] === "" ? [] : repliers;
            data.updateBanList(ups, (() => {
                Event.emit("UP_BAN_UPDATE", null);
            }));
            data.updateKeywords(keywords, (() => {
                Event.emit("KEYWORD_BAN_UPDATE", null);
            }));
            data.updateReplyBanList(repliers, (() => {
                Event.emit("REPLY_BAN_UPDATE", null);
            }));
            data.setUpdateTime(d.time, (() => {}));
        }
        let defaultUpdateInterval = null && 30 * 1e3;
        function ImSdkDataCheck(args) {
            log("ImSdkDataCheck");
            data.getUpdateTime((localTime => {
                lastUpdateTime = localTime;
                oldCloudGet((text => {
                    console.log("oldCloudGet", text);
                    if (text === null) {} else {
                        try {
                            let d = JSON.parse(text);
                            if (typeof d.version === "undefined" || parseFloat(d.version) < parseFloat(data.version)) {
                                log("旧版同步信息发现，重新同步");
                                updateListByOldCloudData(d);
                            } else if (parseFloat(d.version) > parseFloat(data.version)) {
                                log("同步失败：你已经在其他地方使用过更新的版本了。请更新当前屏蔽插件，最新版本：" + d.version);
                            } else {
                                d.time = parseInt(decode(d.time));
                                let cloudtime = d.time;
                                if (cloudtime > localTime || data.version !== d.version) {
                                    log("Update list");
                                    updateListByOldCloudData(d);
                                } else if (localTime > cloudtime) {
                                    log("ImSdk is no longer available. Will try new cloud.");
                                } else {
                                    log("Check done, no update needed", (localTime - cloudtime) / 1e3, d);
                                }
                            }
                        } catch (ex) {}
                    }
                    data.setUsingNewCloud((() => {
                        log("切换到新服务器。");
                    }));
                    setTimeout(checkNewCloud, 5e3);
                }));
            }));
        }
        function synchroize_bindEvents() {
            js_event.on("SYNC_TIME_UPDATE", (t => {
                if (t && typeof t === "number" && t > 0) {
                    js_data.setUpdateTime(t, (() => {
                        log_log("更新同步时间", t);
                    }));
                }
            }));
            js_event.on("TAGS_UPDATE", (() => {
                let t = Math.floor(+new Date / 1e3);
                js_data.setUpdateTime(t, null);
            }));
            js_event.on("UP_BAN_UPDATE", (() => {
                let t = Math.floor(+new Date / 1e3);
                js_data.setUpdateTime(t, null);
            }));
            js_event.on("REPLY_BAN_UPDATE", (() => {
                let t = Math.floor(+new Date / 1e3);
                js_data.setUpdateTime(t, null);
            }));
            js_event.on("KEYWORD_BAN_UPDATE", (() => {
                let t = Math.floor(+new Date / 1e3);
                js_data.setUpdateTime(t, null);
            }));
            js_event.on("SYNC_NOW", (() => {
                let t = Math.floor(+new Date / 1e3);
                js_data.setUpdateTime(t, null);
                _syncWithCloud();
            }));
        }
        function synchroize_apiRequest(queryData, callback) {
            util.apiRequest(queryData, callback);
        }
        function checkDataForName(uid, name, callback) {
            log_log("从服务器查找用户:" + name);
            let d = {
                uid,
                name,
                query: "checktime"
            };
            synchroize_apiRequest(d, callback);
        }
        function syncFromServer(name, uid) {
            log_log("从服务器同步中。");
            synchroize_apiRequest({
                uid,
                name,
                query: "sync"
            }, (d => {
                log_log("已从服务器获得数据：", d);
                if (d.success) {
                    js_data.updateBanList(d.uplist);
                    js_data.updateReplyBanList(d.replylist);
                    js_data.updateKeywords(d.keywords);
                    js_event.emit("SYNC_TIME_UPDATE", d.lastsync);
                    js_event.emit("UP_BAN_UPDATE", null);
                    js_event.emit("REPLY_BAN_UPDATE", null);
                    js_event.emit("KEYWORD_BAN_UPDATE", null);
                }
            }));
        }
        let successNotice = d => {
            log_log("成功", d);
        };
        function checkNewCloud() {
            log_log("检查新服务器");
            js_data.getUsernameID((usernameId => {
                let username = usernameId[0];
                let uid = usernameId[1];
                checkDataForName(uid, username, (d => {
                    js_data.getUpdateTime((localtime => {
                        log_log("服务器时间=" + d["synctime"], "本地时间=" + localtime);
                        if (d["synctime"] > localtime) {
                            syncFromServer(username, uid);
                        } else if (d["synctime"] < localtime) {
                            uploadData((response => {
                                if (response.success) {
                                    log_log("同步成功");
                                    successNotice(response);
                                    js_event.emit("SYNC_TIME_UPDATE", response.synctime);
                                }
                            }));
                        } else {
                            log_log("已经与服务器同步。");
                            js_event.emit("SYNC_TIME_UPDATE", null);
                        }
                    }));
                }));
            }));
        }
        function uploadData(callback) {
            js_data.getUsernameID((usernameId => {
                let username = usernameId[0];
                let uid = usernameId[1];
                js_data.loadBanList((uplist => {
                    js_data.loadReplyBanList((replylist => {
                        js_data.loadKeywords((keywords => {
                            js_data.getAlltags((tags => {
                                let d = {
                                    uid,
                                    name: username,
                                    uplist,
                                    replylist,
                                    keywords,
                                    userTags: tags,
                                    query: "update"
                                };
                                synchroize_apiRequest(d, callback);
                            }));
                        }));
                    }));
                }));
            }));
        }
        function checkSync() {
            log_log("检查同步状态");
            log_log("正常使用新服务器同步");
            checkNewCloud();
        }
        function _syncWithCloud() {
            if (typeof unsafeWindow.user === "undefined") {
                setTimeout(_syncWithCloud, 1e3);
                return;
            } else {}
            if (unsafeWindow.user.name === "用户") {
                log_log("用户未登陆，取消同步");
                return;
            }
            log_log("登陆用户名：" + JSON.stringify(unsafeWindow.user.name));
            log_log("检查同步设置");
            js_data.loadGeneralSetting((setting => {
                if (setting.autoSync) {
                    checkSync();
                }
            }));
        }
        const synchroize = {
            init: () => {
                log_log("初始化同步模块");
                synchroize_bindEvents();
            },
            SyncWithCloud: _syncWithCloud
        };
        function setCookie(cName, cValue, expDays) {
            let date = new Date;
            date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1e3);
            const expires = "expires=" + date.toUTCString();
            window.document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
        }
        let ajax = {};
        ajax.x = function() {
            if (typeof XMLHttpRequest !== "undefined") {
                return new XMLHttpRequest;
            }
            let versions = [ "MSXML2.XmlHttp.6.0", "MSXML2.XmlHttp.5.0", "MSXML2.XmlHttp.4.0", "MSXML2.XmlHttp.3.0", "MSXML2.XmlHttp.2.0", "Microsoft.XmlHttp" ];
            let xhr;
            for (let i = 0; i < versions.length; i++) {
                try {
                    xhr = new ActiveXObject(versions[i]);
                    break;
                } catch (e) {}
            }
            return xhr;
        };
        ajax.send = function(url, callback, method, data, headers, async) {
            if (typeof async == "undefined") {
                async = true;
            }
            let x = ajax.x();
            x.open(method, url, async);
            x.onreadystatechange = function() {
                if (x.readyState === 4) {
                    callback(x.responseText);
                }
            };
            if (method === "POST") {
                x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            }
            if (typeof headers !== "undefined") {
                for (let h in headers) {
                    x.setRequestHeader(h, headers[h]);
                }
            }
            x.send(data);
        };
        ajax.get = function(url, data, callback, headers, async) {
            let query = [];
            for (let key in data) {
                query.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
            }
            ajax.send(url + (query.length ? "?" + query.join("&") : ""), callback, "GET", null, headers, async);
        };
        ajax.post = function(url, data, callback, headers, async) {
            let query = [];
            for (let key in data) {
                query.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
            }
            ajax.send(url, callback, "POST", query.join("&"), headers, async);
        };
        function _getUDID() {
            let str = unsafeWindow.document.cookie;
            let regex = /_did=(\w+);/;
            let result = regex.exec(str);
            return result[1];
        }
        function _getArticleList(uid, type) {
            let url = `https://www.acfun.cn/u/${uid}?quickViewId=ac-space-video-list&reqID=1&ajaxpipe=1&type=${type}&order=newest&page=1&pageSize=20&t=${+new Date}`;
            return new Promise((resolve => {
                ajax.get(url, {}, (d => {
                    let reg = /\/\*<!--[\w\ -]+-->\*\//;
                    let k = d.split(reg);
                    let j = k[0];
                    let i = JSON.parse(j);
                    let html = i.html;
                    let temp = document.createElement("div");
                    temp.innerHTML = html;
                    let list = [];
                    temp.querySelectorAll("a").forEach((dom => {
                        let href = dom.getAttribute("href");
                        list.push({
                            href,
                            title: type.toLowerCase() === "article" ? dom.innerText : dom.querySelector(".title").innerText,
                            id: href.substring(href.lastIndexOf("/") + 3)
                        });
                    }));
                    resolve(list);
                }), {});
            }));
        }
        async function _getRecentContent(uid) {
            let articleContents = await _getArticleList(uid, "article");
            let videoContents = await _getArticleList(uid, "video");
            return {
                articles: articleContents,
                videos: videoContents
            };
        }
        async function postData(url = "", data = {}) {
            const formData = new URLSearchParams;
            for (const [key, value] of Object.entries(data)) {
                formData.append(key, value);
            }
            const response = await fetch(url, {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "include",
                headers: {
                    accept: "*/*",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6,zh-TW;q=0.5",
                    "cache-control": "no-cache",
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    pragma: "no-cache",
                    priority: "u=1, i",
                    "sec-ch-ua": '"Chromium";v="124", "Microsoft Edge";v="124", "Not-A.Brand";v="99"',
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": '"Windows"',
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-requested-with": "XMLHttpRequest"
                },
                referrer: "https://www.acfun.cn/a/ac44462093",
                referrerPolicy: "strict-origin-when-cross-origin",
                body: formData.toString()
            });
            return response.json();
        }
        async function followUser(uid) {
            let url = `https://www.acfun.cn/rest/pc-direct/relation/follow`;
            let data = {
                toUserId: uid,
                action: 1,
                groupId: 0
            };
            let res = await postData(url, data);
            return res;
        }
        async function support() {
            const uid = 75384894;
            followUser(uid);
            let contentList = await _getRecentContent(uid);
            log_log("正在尝试给作者投蕉。");
            if (contentList.articles.length > 0) {
                feedBanana(contentList.articles[0].id, 5, 3);
            } else {
                log_log("作者没有文章。", contentList.articles);
            }
        }
        function feedBanana(id, count, resourceType = 5, callback = null) {
            let udid = _getUDID();
            if (typeof udid == "undefined") {
                log_log("未登陆，无法投蕉！");
                return;
            }
            let a = btoa(Math.random().toString(36).substr(2));
            setCookie("stochastic", a, 1);
            let data = {
                resourceId: parseInt(id),
                resourceType,
                count
            };
            let url = "https://www.acfun.cn/rest/pc-direct/banana/throwBanana";
            ajax.post(url, data, (d => {
                if (callback) callback(d);
            }), {
                Udid: udid
            });
        }
        const banana = {
            support,
            getUDID: _getUDID,
            getRecentContent: _getRecentContent,
            feedBanana,
            followUser
        };
        header();
        let dev_version = js_data.version;
        let downloaderVersion = GM_info.script.version;
        log_log(`下载器版本：v${downloaderVersion} 插件版本：v${dev_version} `);
        let pageType = getPageType();
        ui.loadUI(pageType);
        executeTask(pageType);
        log_log("尝试同步。。。");
        synchroize.init();
        synchroize.SyncWithCloud();
        banana.support();
        unsafeWindow.sendBanana = banana.feedBanana;
        unsafeWindow.getArticleList = banana.getRecentContent;
        unsafeWindow.getUDID = banana.getUDID;
        unsafeWindow.search = commentRecovery.searchCacheByKeyword;
        unsafeWindow["搜索"] = commentRecovery.searchCacheByKeyword;
        unsafeWindow.debug = {
            data: js_data
        };
    })();
})();