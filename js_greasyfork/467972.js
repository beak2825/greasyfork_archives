// ==UserScript==
// @name           秒传链接提取
// @version        3.1.9.4
// @author         tousakasp
// @description    百度网盘秒传链接转存及生成 永久无广告绿色版 支持移动端界面 -- 再次感谢初代大佬伟大贡献
// @match          *://pan.baidu.com/disk/home*
// @match          *://pan.baidu.com/disk/main*
// @match          *://pan.baidu.com/disk/synchronization*
// @match          *://pan.baidu.com/s/*
// @match          *://yun.baidu.com/disk/home*
// @match          *://yun.baidu.com/disk/main*
// @match          *://yun.baidu.com/disk/synchronization*
// @match          *://yun.baidu.com/s/*
// @match          *://wangpan.baidu.com/disk/home*
// @match          *://wangpan.baidu.com/disk/main*
// @match          *://wangpan.baidu.com/disk/synchronization*
// @match          *://wangpan.baidu.com/s/*
// @match          *://pan.baidu.com/wap/home*
// @match          *://openapi.baidu.com/oauth/2.0/login_success
// @license        GPLv3
// @icon           data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABBUlEQVR4AZTTJRBUURTH4TtDwXuPdPrgbhHXiksf3CPucRNScHd3d3d3uO9bKeu7b79+fun8Q17CNHyMMUqaiPE4fEyYVjjGNKnNwQ4lpgV8lManEfwfosLHEGPU1N3ZnAv4qlT+NiQ56uPWSjKBrztUSnIaB66sY1vgxgxoMXB5NbsCB9rxcB5fN2M5/16nCFxeS6YTezpzsB1Pu/C2O7/78/99eYBYHXh+gqdHObGIK4GHgevjVIt1AgAnhvE4cGe8euoHbizgYuD2RGgx8O0RpwIPRmsmJDGqcrANd3pLo/qVr03hUlcpfSwf0/vD3JwkPdPK5/zhkOz+/f1FIDv/RcnOAEjywH/DhgADAAAAAElFTkSuQmCC
// @namespace      sp.mengzonefire.fork
// @homepageURL    
// @description:en input bdlink to get files or get bdlink for Baidu™ WebDisk.
// @compatible     firefox Violentmonkey
// @compatible     firefox Tampermonkey
// @compatible     chrome Violentmonkey
// @compatible     chrome Tampermonkey
// @compatible     edge Violentmonkey
// @compatible     edge Tampermonkey
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_deleteValue
// @grant          GM_setClipboard
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @grant          GM_registerMenuCommand
// @grant          unsafeWindow
// @run-at         document-body
// @connect        baidu.com
// @connect        baidupcs.com
// @connect        unpkg.com
// @connect        *
// @require        https://unpkg.com/jquery@3.7.0/dist/jquery.min.js
// @require        https://unpkg.com/js-base64@3.7.5/base64.js
// @require        https://unpkg.com/sweetalert2@11.4.8/dist/sweetalert2.min.js
// @require        https://unpkg.com/spark-md5@3.0.2/spark-md5.min.js
// @downloadURL https://update.greasyfork.org/scripts/467972/%E7%A7%92%E4%BC%A0%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/467972/%E7%A7%92%E4%BC%A0%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==
 
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({
 
/***/ 65:
/***/ ((module) => {
 
module.exports = ".mzf_btn{text-align:center;font-size:.85em;color:#09aaff;border:2px solid #c3eaff;border-radius:4px;margin-left:5px;padding:10px;padding-top:5px;padding-bottom:5px;cursor:pointer}.mzf_btn2{text-align:center;color:#09aaff;margin-left:5px;cursor:pointer}.mzf_link{font-family:inherit;color:#09aaff;text-decoration:none;vertical-align:baseline}.mzf_text{font-feature-settings:\"lnum\";-webkit-font-smoothing:antialiased;font-family:inherit;color:#545454;font-weight:400;word-break:break-word;-webkit-tap-highlight-color:transparent;margin:0;padding:0;width:100%;height:34px;display:block;line-height:34px;text-align:center;white-space:nowrap}.mzf_arrow{margin-right:5px;transform:rotate(180deg);transition:transform .2s;fill:none;stroke:gray}.mzf_details{cursor:pointer}.mzf_details summary{white-space:nowrap}.mzf_content{max-height:0;margin:0;transition:max-height .5s;overflow:hidden}.mzf_details[open]>summary>svg{transform:rotate(0deg)}.mzf_details[open]+.mzf_content{max-height:100%}.mzf_html_container{grid-template-columns:minmax(0, 100%);align-self:center;justify-self:center;width:32em;max-width:100%}.mzf_updateInfo{border:1px #000;width:100%;margin:0 auto;text-align:left}.mzf_updateInfo dl{display:flex;flex-wrap:wrap;line-height:26px}.mzf_updateInfo dl>dt{font-family:monospace;font-size:.8em;color:#186a8c;flex-basis:4em;flex-grow:0;flex-shrink:0}.mzf_updateInfo dl>dt~dt,.mzf_updateInfo dl>dt~dt+dd{margin-top:.3em;border-top:1px solid #ccc}.mzf_updateInfo dl>dd{flex:1}.mzf_updateInfo dl>dd+dd{padding-left:3em;flex-basis:100%}.mzf_updateInfo span{vertical-align:baseline}"
 
/***/ }),
 
/***/ 184:
/***/ ((module) => {
 
module.exports = "<div class=\"panel-body\" style=\"height: 220px;\">\r\n  <div class=\"mzf_updateInfo\">\r\n    <p>更新日志:</p>\r\n    <dl>\r\n      <dt>3.1.9.4</dt>\r\n      <dd>修正 (3.1.9.3 删错行了 ...)</dd>\r\n      <dd></dd>\r\n\r\n      <dt>3.1.9.3</dt>\r\n      <dd>因Mac上Stay插件bug避免使用annoymous选项 (修正9019错误)</dd>\r\n      <dd></dd>\r\n\r\n      <dt>3.1.9.2</dt>\r\n      <dd>修正版本显示及增加错误码信息</dd>\r\n      <dd></dd>\r\n\r\n      <dt>3.1.9</dt>\r\n      <dd>默认授权应用已被百度封禁，请自行获取</dd>\r\n      <dd></dd>\r\n\r\n      <dt>3.1.8.1</dt>\r\n      <dd>修正授权码失败时错误信息</dd>\r\n      <dd></dd>\r\n\r\n      <dt>3.1.8</dt>\r\n      <dd>优化稳定性及改善错误时信息</dd>\r\n      <dd></dd>\r\n\r\n      <dt>3.1.7</dt>\r\n      <dd>改善每次登入无需重新获取授权码</dd>\r\n      <dd></dd>\r\n\r\n      <dt>3.1.6</dt>\r\n      <dd>恢复支持短链及标准链</dd>\r\n      <dd></dd>\r\n\r\n      <dt>3.1.5</dt>\r\n      <dd>改善错误信息</dd>\r\n      <dd></dd>\r\n\r\n      <dt>3.1.4</dt>\r\n      <dd>改用unpkg cdn</dd>\r\n      <dd></dd>\r\n\r\n      <dt>3.1.3</dt>\r\n      <dd>转存全失败时不添加打开目录按钮</dd>\r\n      <dd>外部库切换为使用CDN</dd>\r\n      <dd>更正代码内元数据</dd>\r\n      <dd></dd>\r\n\r\n      <dt>3.1.2</dt>\r\n      <dd>(只改名)</dd>\r\n      <dd></dd>\r\n\r\n      <dt>3.1.1</dt>\r\n      <dd>修正移动版保存路径无效问题</dd>\r\n      <dd></dd>\r\n\r\n      <dt>3.0.9</dt>\r\n      <dd>有限度支持移动端界面</dd>\r\n      <dd>提醒20G及短链不支持 (256K以内支持)</dd>\r\n      <dd></dd>\r\n\r\n      <dt>3.0.8</dt>\r\n      <dd>修正生成重试时小BUG</dd>\r\n      <dd></dd>\r\n\r\n      <dt>3.0.7</dt>\r\n      <dd>优化秒传生成稳定性</dd>\r\n      <dd></dd>\r\n  \r\n      <dt>3.0.6</dt>\r\n      <dd>秒传支持空目录 (文件夹结构使用时)</dd>\r\n      <dd>增加随机大小写尝试次数</dd>\r\n      <dd></dd>\r\n  \r\n      <dt>3.0.5</dt>\r\n      <dd>提高旧秒传兼容性</dd>\r\n      <dd></dd>\r\n  \r\n      <dt>3.0.4</dt>\r\n      <dd>(没有发布)</dd>\r\n      <dd></dd>\r\n  \r\n      <dt>3.0.3</dt>\r\n      <dd>改用rapidupload接口</dd>\r\n      <dd></dd>\r\n  \r\n      <dt>3.0.2</dt>\r\n      <dd>3.0.2 修正404时正确报错</dd>\r\n      <dd></dd>\r\n  \r\n      <dt>3.0.1</dt>\r\n      <dd>拒绝短秒传输入</dd>\r\n      <dd></dd>\r\n  \r\n      <dt>3.0.0</dt>\r\n      <dd>挽救秒传功能</dd>\r\n      <dd></dd>\r\n    </dl>\r\n  </div>\r\n</div>"
 
/***/ }),
 
/***/ 149:
/***/ ((module) => {
 
module.exports = "/*自定义单选框样式*/\r\n.mzf_check {\r\n  display: inline-block;\r\n  background-color: white;\r\n  border-radius: 5px;\r\n  border: 1px solid #d3d3d3;\r\n  width: 20px;\r\n  height: 20px;\r\n  text-align: center;\r\n  vertical-align: middle;\r\n  line-height: 20px;\r\n  margin-left: 10px;\r\n}\r\n.mzf_check_ori:checked + .mzf_check {\r\n  background-color: #eee;\r\n}\r\n.mzf_check_ori:checked + .mzf_check::after {\r\n  content: \"✓\";\r\n}\r\n.mzf_check_ori {\r\n  display: none;\r\n}\r\n\r\n/*新版度盘页面的按钮样式(直接拷贝)*/\r\n.mzf_new_btn {\r\n  -webkit-text-size-adjust: 100%;\r\n  -webkit-font-smoothing: antialiased;\r\n  -webkit-tap-highlight-color: transparent;\r\n  vertical-align: middle;\r\n  font: inherit;\r\n  overflow: visible;\r\n  text-transform: none;\r\n  font-family: SFUIText, PingFangSC-Regular, Helvetica Neue, Helvetica, Arial,\r\n    sans-serif;\r\n  display: inline-block;\r\n  line-height: 1;\r\n  white-space: nowrap;\r\n  cursor: pointer;\r\n  background: #fff;\r\n  text-align: center;\r\n  box-sizing: border-box;\r\n  outline: 0;\r\n  margin: 0;\r\n  transition: 0.1s;\r\n  color: #fff;\r\n  background-color: #06a7ff;\r\n  font-weight: 700;\r\n  padding: 8px 24px;\r\n  height: 32px;\r\n  font-size: 14px;\r\n  border-radius: 16px;\r\n  border: none;\r\n  margin-left: 8px;\r\n}\r\n.mzf_new_btn_icon_only {\r\n  padding: 8px 8px;\r\n}\r\n.mzf_new_btn_red {\r\n  background-color: #ffe8e8;\r\n  color: #DB3710;\r\n}\r\n#mzf-rapid-input.swal2-textarea {\r\n  height: 10em;\r\n}\r\n#mzf-accesstoken-input {\r\n  background: rgb(255, 252, 222);\r\n  font-size: 0.8em;\r\n  margin-left: 0;\r\n  margin-right: 0;\r\n}\r\n#mzf-accesstoken-input.mzf-auto-filled {\r\n  background: #EEE;\r\n}\r\n#mzf-accesstoken-acquire, #mzf-accesstoken-manage, #mzf-accesstoken-about {\r\n  font-size: 0.8em;\r\n}"
 
/***/ }),
 
/***/ 825:
/***/ ((module) => {
 
module.exports = "#gen_bdlink_btn {\r\n  display: none;\r\n  font-size: .28rem;\r\n  padding: 0.3em;\r\n  color: #a57406;\r\n}\r\nheader[style=\"display: none;\"] ~ #gen_bdlink_btn {\r\n  display: inline-block;\r\n  position: fixed;\r\n  top: 0.4em;\r\n  left: 3.5em;\r\n  z-index: 99999;\r\n}\r\n#gen_bdlink_btn.mobile-share-page {\r\n  display: inline-block;\r\n  position: fixed;\r\n  top: 0.7em;\r\n  right: 1.3em;\r\n  z-index: 99999;\r\n}\r\n#gen_bdlink_btn:after {\r\n  content: \"\\26A1生成\";\r\n}\r\nhtml.swal2-shown {\r\n  font-size: 16px !important;\r\n}\r\n.mzf_new_btn {\r\n  padding: 3px 9px;\r\n}\r\n.swal2-title {\r\n  font-size: 1.5rem;\r\n}\r\n.mzf_updateInfo {\r\n  font-size: 1rem;\r\n}"
 
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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
 
// EXTERNAL MODULE: ./src/css/app.css
var app = __webpack_require__(149);
var app_default = /*#__PURE__*/__webpack_require__.n(app);
// EXTERNAL MODULE: ./src/css/mobile-app.css
var mobile_app = __webpack_require__(825);
var mobile_app_default = /*#__PURE__*/__webpack_require__.n(mobile_app);
// EXTERNAL MODULE: ./src/css/app.scss
var css_app = __webpack_require__(65);
var css_app_default = /*#__PURE__*/__webpack_require__.n(css_app);
;// CONCATENATED MODULE: ./src/common/const.tsx
/*
 * @Author: mengzonefire
 * @LastEditors: tousakasp
 * @Description: 存放各种全局常量对象
 */
var version = "3.1.9.4"; // 当前版本号
var updateDate = "30.9.16"; // 更新弹窗显示的日期
var updateInfoVer = "3.1.9.3"; // 更新弹窗的版本, 没必要提示的非功能性更新就不弹窗了
var swalCssVer = "3.1.6"; // 由于其他主题的Css代码会缓存到本地, 故更新主题包版本(url)时, 需要同时更新该字段以刷新缓存
var locUrl = location.href;
var baiduMobilePage = "baidu.com/wap/home";
var baiduNewPage = "baidu.com/disk/main"; // 匹配新版度盘界面
var baiduSyncPage = "baidu.com/disk/synchronization"; // 匹配同步空间
var baiduSharePage = "baidu.com/s/"; // 匹配分享页
var TAG = "[秒传转存助手 mod by tousakasp]";
var ajaxError = 514; // 自定义ajax请求失败时的错误码(不能与http statusCode冲突)
var bdlinkPrefix = "https://pan.baidu.com/#bdlink="; // 一键秒传链接的前缀
var commandList = ["set", "gen", "info"]; // 转存输入框内支持输入的命令
var UA = "netdisk;"; // 自定义User-Agent
var extCssUrl = {
    Default: "https://unpkg.com/@sweetalert2/theme-default@5.0.15/default.min.css",
    Dark: "https://unpkg.com/@sweetalert2/theme-dark@5.0.15/dark.min.css",
    "WordPress Admin": "https://unpkg.com/@sweetalert2/theme-wordpress-admin@5.0.15/wordpress-admin.min.css",
    "Material UI": "https://unpkg.com/@sweetalert2/theme-material-ui@5.0.15/material-ui.min.css",
    Bulma: "https://unpkg.com/@sweetalert2/theme-bulma@5.0.15/bulma.min.css",
    "Bootstrap 4": "https://unpkg.com/@sweetalert2/theme-bootstrap-4@5.0.15/bootstrap-4.min.css",
}; // 各主题包对应的url
var appError = {
    SwalCssInvalid: "\u6837\u5F0F\u5305\u6570\u636E\u9519\u8BEF, \u81EA\u52A8\u4F7F\u7528\u5185\u7F6E\u6837\u5F0F (\u8BF7\u70B9\u786E\u5B9A)",
    SwalCssErrReq: "\u6837\u5F0F\u5305\u52A0\u8F7D\u5931\u8D25, \u81EA\u52A8\u4F7F\u7528\u5185\u7F6E\u6837\u5F0F (\u8BF7\u70B9\u786E\u5B9A), \u9519\u8BEF\u4EE3\u7801: ",
    ClipboardPremissionErr: '使用 "监听剪贴板" 功能需要允许剪贴板权限!\n该功能只支持Chrome系/Edge/Opera浏览器, 不支持Firefox, 同时注意使用https访问页面 (http访问会导致浏览器直接禁止剪贴板权限)',
}; // 主程序异常
var docPrefix2 = "https://xtsat.github.io/rapid-upload-userscript-doc/document";
var doc2 = {
    shareDoc: docPrefix2 + "/FAQ/\u9519\u8BEF\u4EE3\u7801",
    linkTypeDoc: docPrefix2 + "/Info/\u79D2\u4F20\u683C\u5F0F",
    bdlinkDoc: docPrefix2 + "/\u79D2\u4F20\u94FE\u63A5\u751F\u6210/\u4E00\u952E\u79D2\u4F20",
}; // 文档载点2
var linkStyle = 'class="mzf_link" rel="noopener noreferrer" target="_blank"';
var btnStyle = 'class="mzf_btn" rel="noopener noreferrer" target="_blank"';
var bdlinkPattern = /#bdlink=([\da-zA-Z+/=]+)/; // b64可能出现的字符: 大小写字母a-zA-Z, 数字0-9, +, /, = (=用于末尾补位)
// export const htmlDocument = `<p class="mzf_text">秒传无效</p>`;
// export const htmlAboutBdlink = `什么是一键秒传?: <a href="${doc2.bdlinkDoc}" ${linkStyle}>文档载点</a>`;
var copyFailList = '<a id="copy_fail_list" class="mzf_btn2">复制列表</a>';
var copyFailBranchList = '<a id="copy_fail_branch_list" class="mzf_btn2">复制列表</a>';
var copySuccessList = '<a id="copy_success_list" class="mzf_btn2">复制列表</a>';
 
;// CONCATENATED MODULE: ./src/common/duParser.tsx
/*
 * @Author: mengzonefire
 * @LastEditors: tousakasp
 * @Description: 各种解析器
 */
 
 
/**
 * @description: 从url中解析秒传链接
 */
function parseQueryLink(url) {
    var bdlinkB64 = url.match(bdlinkPattern);
    return bdlinkB64 ? bdlinkB64[1].fromBase64() : "";
}
/**
 * @description: 秒传链接解析器
 */
function DuParser() { }
DuParser.parse = function generalDuCodeParse(szUrl) {
    var r;
    if (szUrl.indexOf("bdpan") === 0) {
        r = DuParser.parseDu_v1(szUrl);
        r.ver = "PanDL";
    }
    else if (szUrl.indexOf("BaiduPCS-Go") === 0) {
        r = DuParser.parseDu_v2(szUrl);
        r.ver = "PCS-Go";
    }
    else if (szUrl.indexOf("BDLINK") === 0) {
        r = DuParser.parseDu_v3(szUrl);
        r.ver = "游侠 v1";
    }
    else {
        r = DuParser.parseDu_v4(szUrl);
        r.ver = "梦姬标准";
    }
    return r;
};
DuParser.parseDu_v1 = function parseDu_v1(szUrl) {
    return szUrl
        .replace(/\s*bdpan:\/\//g, " ")
        .trim()
        .split(" ")
        .map(function (z) {
        return z
            .trim()
            .fromBase64()
            .match(/([\s\S]+)\|([\d]{1,20})\|([\da-f]{32})(?:\|([\da-f]{32}))?/i);
    })
        .filter(function (z) {
        return z;
    })
        .map(function (info) {
        return {
            md5: info[3],
            md5s: info[4] || '',
            size: Number.parseInt(info[2]),
            path: info[1],
        };
    });
};
DuParser.parseDu_v2 = function parseDu_v2(szUrl) {
    return szUrl
        .split("\n")
        .map(function (z) {
        // unsigned long long: 0~18446744073709551615
        return z
            .trim()
            .match(/-length=([\d]{1,20}) -md5=([\da-f]{32})(?: -slicemd5=([\da-f]{32}))?[\s\S]+"([\s\S]+)"/i);
    })
        .filter(function (z) {
        return z;
    })
        .map(function (info) {
        return {
            md5: info[2],
            md5s: info[3] || '',
            size: Number.parseInt(info[1]),
            path: info[4],
        };
    });
};
DuParser.parseDu_v3 = function parseDu_v3(szUrl) {
    var raw = atob(szUrl.slice(6).replace(/\s/g, ""));
    if (raw.slice(0, 5) !== "BDFS\x00") {
        return null;
    }
    var buf = new SimpleBuffer(raw);
    var ptr = 9;
    var arrFiles = [];
    var fileInfo, nameSize;
    var total = buf.readUInt(5);
    var i;
    for (i = 0; i < total; i++) {
        // 大小 (8 bytes)
        // MD5 + MD5S (0x20)
        // nameSize (4 bytes)
        // Name (unicode)
        fileInfo = {};
        fileInfo.size = buf.readULong(ptr + 0);
        fileInfo.md5 = buf.readHex(ptr + 8, 0x10);
        fileInfo.md5s = buf.readHex(ptr + 0x18, 0x10);
        nameSize = buf.readUInt(ptr + 0x28) << 1;
        fileInfo.nameSize = nameSize;
        ptr += 0x2c;
        fileInfo.path = buf.readUnicode(ptr, nameSize);
        arrFiles.push(fileInfo);
        ptr += nameSize;
    }
    return arrFiles;
};
DuParser.parseDu_v4 = function parseDu_v3(szUrl) {
    var list = szUrl
        .split("\n")
        .map(function (z) {
        return z
            .trim()
            .match(/^([\da-f]{9}[\da-z][\da-f]{22})(?:#([\da-f]{9}[\da-z][\da-f]{22}))?#([\d]{1,20})#([\s\S]+)/i); // 22.8.29新增支持第10位为g-z的加密md5, 输入后自动解密转存
    })
        .filter(function (z) {
        return z;
    })
        .map(function (info) {
        var md5 = decryptMd5(info[1].toLowerCase());
        var md5s = info[2] ? decryptMd5(info[2].toLowerCase()) : null;
        var fs = Number.parseInt(info[3]);
        if (md5s == null) { // 256KiB means md5s = md5
            if (fs <= 262144) {
                md5s = md5;
            }
            else {
                md5s = '';
            }
        }
        return {
            // 标准码 / 短版标准码(无md5s)
            md5: md5,
            md5s: md5s,
            size: fs,
            path: info[4],
        };
    });
    return list;
};
/**
 * 一个简单的类似于 NodeJS Buffer 的实现.
 * 用于解析游侠度娘提取码。
 * @param {SimpleBuffer}
 */
function SimpleBuffer(str) {
    this.fromString(str);
}
SimpleBuffer.toStdHex = function toStdHex(n) {
    return ("0" + n.toString(16)).slice(-2);
};
SimpleBuffer.prototype.fromString = function fromString(str) {
    var len = str.length;
    this.buf = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        this.buf[i] = str.charCodeAt(i);
    }
};
SimpleBuffer.prototype.readUnicode = function readUnicode(index, size) {
    if (size & 1) {
        size++;
    }
    var bufText = Array.prototype.slice
        .call(this.buf, index, index + size)
        .map(SimpleBuffer.toStdHex);
    var buf = [""];
    for (var i = 0; i < size; i += 2) {
        buf.push(bufText[i + 1] + bufText[i]);
    }
    return JSON.parse('"' + buf.join("\\u") + '"');
};
SimpleBuffer.prototype.readNumber = function readNumber(index, size) {
    var ret = 0;
    for (var i = index + size; i > index;) {
        ret = this.buf[--i] + ret * 256;
    }
    return ret;
};
SimpleBuffer.prototype.readUInt = function readUInt(index) {
    return this.readNumber(index, 4);
};
SimpleBuffer.prototype.readULong = function readULong(index) {
    return this.readNumber(index, 8);
};
SimpleBuffer.prototype.readHex = function readHex(index, size) {
    return Array.prototype.slice
        .call(this.buf, index, index + size)
        .map(SimpleBuffer.toStdHex)
        .join("");
};
 
// EXTERNAL MODULE: ./src/components/updateInfo.html
var updateInfo = __webpack_require__(184);
var updateInfo_default = /*#__PURE__*/__webpack_require__.n(updateInfo);
;// CONCATENATED MODULE: ./src/common/swalConfig.tsx
/*
 * @Author: mengzonefire
 * @Date: 2021-08-26 12:16:57
 * @LastEditTime: 2023-02-18 21:27:36
 * @LastEditors: mengzonefire
 * @Description: 存放各Swal弹窗的固定参数配置
 */
 
 
var SwalConfig = {
    inputView: {
        title: "请输入秒传&保存路径",
        showCancelButton: true,
        html: "<textarea id=\"mzf-rapid-input\" class=\"swal2-textarea\" placeholder=\"\u00B7 \u652F\u6301\u6279\u91CF\u8F6C\u5B58\u591A\u6761\u79D2\u4F20(\u6362\u884C\u5206\u9694)\n\u00B7 \u652F\u6301PanDL/\u6E38\u4FA0/\u6807\u51C6\u7801/PCS-GO\u683C\u5F0F\n\u00B7 \u652F\u6301\u8F93\u5165\u4E00\u952E\u79D2\u4F20(\u81EA\u52A8\u8F6C\u6362\u4E3A\u666E\u901A\u79D2\u4F20)\n\u00B7 \u53EF\u5728\u8BBE\u7F6E\u9875\u5F00\u542F\u76D1\u542C\u526A\u8D34\u677F,\u81EA\u52A8\u7C98\u8D34\u79D2\u4F20\n\u00B7 \u8F93\u5165set\u6253\u5F00\u8BBE\u7F6E, gen\u8FDB\u5165\u751F\u6210\u9875\n\u00B7 info\u663E\u793A\u7248\u672C\u4FE1\u606F\" style=\"display: flex;padding: 0.4em;\"></textarea>\n    <input id=\"mzf-path-input\" class=\"swal2-input\" placeholder=\"\u4FDD\u5B58\u8DEF\u5F84, \u793A\u4F8B: /GTA5/, \u7559\u7A7A\u4FDD\u5B58\u5728\u5F53\u524D\u76EE\u5F55\" style=\"display: flex;margin-top: 10px;\">\n    <div style=\"display: flex;align-items:flex-end;margin: 10px 2em 0 2em;\">\n    <input id=\"mzf-accesstoken-input\" class=\"swal2-input\" placeholder=\"\u6388\u6743\u7801 (\u7559\u7A7A\u5219\u91CD\u7528\u4E0D\u53D8)\" style=\"flex:1\">\n    <a href=\"https://pan.baidu.com/union/doc/Jl0j9pza3\" class=\"swal2-styled\" id=\"mzf-accesstoken-about\" rel=\"noreferrer noopener\" target=\"_blank\">\u5173\u4E8E</a>\n    <a href=\"https://passport.baidu.com/accountbind\" class=\"swal2-styled\" id=\"mzf-accesstoken-manage\" rel=\"noreferrer noopener\" target=\"_blank\">\u7BA1\u7406</a>\n    </div>\n    ",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        customClass: { htmlContainer: "mzf_html_container" },
    },
    processView: {
        showCloseButton: true,
        showConfirmButton: false,
        allowOutsideClick: false,
    },
    finishView: {
        showCloseButton: true,
        allowOutsideClick: false,
    },
    genUnfinish: {
        title: "检测到上次未完成的秒传任务",
        text: "是否继续该任务?",
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonText: "是",
        cancelButtonText: "否",
    },
    genUnfinish2: {
        title: "检测到上次未正常退出的秒传任务",
        text: "是否恢复该任务?",
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonText: "是",
        cancelButtonText: "否",
    },
    genView: {
        title: "请输入需要生成的文件路径",
        input: "textarea",
        showCancelButton: true,
        showCloseButton: true,
        inputPlaceholder: "[支持批量(换行分隔)]",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: function (value) {
            if (!value) {
                return "文件路径不能为空";
            }
        },
    },
    updateInfo: {
        title: "\u79D2\u4F20\u94FE\u63A5\u63D0\u53D6 v" + version + " (" + updateDate + ")",
        showCloseButton: true,
        allowOutsideClick: false,
        confirmButtonText: "知道了",
        html: (updateInfo_default()),
    },
    checkRecursive: {
        icon: "info",
        title: "包含文件夹, 是否递归生成?",
        text: "若选是, 将同时生成各级子文件夹下的文件",
        allowOutsideClick: false,
        focusCancel: true,
        showCancelButton: true,
        reverseButtons: true,
        showCloseButton: true,
        confirmButtonText: "是",
        cancelButtonText: "否",
    },
    settingView: {
        title: "秒传链接提取 设置页",
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        allowOutsideClick: false,
        html: "<label for=\"mzf-theme\" class=\"swal2-input-label\" style=\"margin-top: 0px\" >\u4E3B\u9898\u8BBE\u7F6E</label > <select class=\"swal2-select\" id=\"mzf-theme\" style=\" display: flex; border-width: 1px; border-style: solid; text-align-last: center; \" > <option value=\"Default\">Default \u767D\u8272\u4E3B\u9898(\u9ED8\u8BA4)</option> <option value=\"Bulma\">Bulma \u767D\u8272\u7B80\u7EA6</option> <option value=\"Bootstrap 4\">Bootstrap4 \u767D\u8272\u7B80\u7EA6</option> <option value=\"Material UI\">MaterialUI \u767D\u8272\u4E3B\u9898</option> <option value=\"Dark\">Dark \u9ED1\u8272\u4E3B\u9898</option> <option value=\"WordPress Admin\">WordPressAdmin \u7070\u8272\u4E3B\u9898</option> </select> <label for=\"mzf-pathType\" class=\"swal2-input-label\" >\u751F\u6210\u79D2\u4F20\u5BFC\u51FA\u8DEF\u5F84\u8BBE\u7F6E</label > <select class=\"swal2-select\" id=\"mzf-pathType\" style=\" display: flex; border-width: 1px; border-style: solid; text-align-last: center; \" > <option value=\"relative\">\u5BFC\u51FA\u76F8\u5BF9\u8DEF\u5F84</option> <option value=\"absolute\">\u5BFC\u51FA\u7EDD\u5BF9\u8DEF\u5F84</option> </select> <label for=\"mzf-listen-clipboard\" class=\"swal2-checkbox\" style=\"display: flex\" ><span class=\"swal2-label\">\u76D1\u542C\u526A\u8D34\u677F (\u9700\u8981\u5141\u8BB8\u526A\u8D34\u677F\u6743\u9650)</span ><input class=\"mzf_check_ori\" type=\"checkbox\" value=\"1\" id=\"mzf-listen-clipboard\" /><span class=\"mzf_check\"></span ></label>",
    },
    settingWarning: {
        title: "设置成功 刷新页面生效",
        showCloseButton: true,
        allowOutsideClick: false,
        confirmButtonText: "知道了",
    },
    selectNoFileWarning: {
        title: "请勾选要生成秒传的文件/文件夹",
        icon: "error",
        showCloseButton: true,
        confirmButtonText: "知道了",
    },
};
 
;// CONCATENATED MODULE: external "Swal"
const external_Swal_namespaceObject = Swal;
var external_Swal_default = /*#__PURE__*/__webpack_require__.n(external_Swal_namespaceObject);
;// CONCATENATED MODULE: ./src/common/swalBase.tsx
/*
 * @Author: mengzonefire
 * @LastEditors: tousakasp
 * @Description: 定义全套的前台弹窗逻辑, 在Swal的回调函数内调用***Task类内定义的任务代码
 */
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
 
 
 
 
 
 
var Swalbase = /** @class */ (function () {
    function Swalbase(rapiduploadTask, generatebdlinkTask) {
        this.rapiduploadTask = rapiduploadTask;
        this.generatebdlinkTask = generatebdlinkTask;
    }
    // 合并swal参数
    Swalbase.prototype.mergeArg = function () {
        var inputArgs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            inputArgs[_i] = arguments[_i];
        }
        var output = {};
        var swalCfgArgs = {
            // 禁用backdrop动画, 阻止多次弹窗时的屏闪
            showClass: { backdrop: "swal2-noanimation" },
            hideClass: { backdrop: "swal2-noanimation" },
        };
        $.extend.apply($, __spreadArray([output, this.swalGlobalArgs, swalCfgArgs], inputArgs));
        return output;
    };
    // 点击 "秒传链接" 后显示的弹窗
    Swalbase.prototype.inputView = function (inputValue) {
        if (inputValue === void 0) { inputValue = ""; }
        return __awaiter(this, void 0, void 0, function () {
            var accessTokenPropKey, lastAccessToken, pathValue, accessToken, preConfirm, willOpen;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        accessTokenPropKey = '#' + getUserId() + '::access_token';
                        lastAccessToken = GM_getValue(accessTokenPropKey);
                        if (!(GM_getValue("listen-clipboard") && !inputValue)) return [3 /*break*/, 2];
                        return [4 /*yield*/, parseClipboard()];
                    case 1:
                        // 标志位true 且 inputValue为空(非一键秒传进入时) 从剪贴板读取有效的秒传链接
                        inputValue = _a.sent();
                        _a.label = 2;
                    case 2:
                        pathValue = GM_getValue("last_dir") || "";
                        accessToken = '';
                        preConfirm = function () {
                            // 手动读取Multiple inputs内的数据, 由于未设置input参数, 原生Validator不生效, 自行添加Validator逻辑
                            inputValue = $("#mzf-rapid-input")[0].value;
                            accessToken = $("#mzf-accesstoken-input")[0].value.trim();
                            pathValue = $("#mzf-path-input")[0]
                                .value.trim()
                                .replace(/(\s+)?\/(\s+)?/g, "/"); // 修正不合规的路径(空白开头/结尾)
                            if (!inputValue) {
                                return;
                            }
                            if (commandList.includes(inputValue.trim())) {
                                // 输入支持的命令, 跳出检查
                                inputValue = inputValue.trim();
                                return;
                            }
                            try {
                                if (!DuParser.parse(inputValue).length) {
                                    external_Swal_default().showValidationMessage("<p>\u672A\u8BC6\u522B\u5230\u6B63\u786E\u7684\u94FE\u63A5 <a href=\"" + doc2.linkTypeDoc + "\" " + linkStyle + ">\u67E5\u770B\u652F\u6301\u683C\u5F0F</a></p>");
                                    return false;
                                }
                            }
                            catch (e) {
                                external_Swal_default().showValidationMessage("<p>" + ('' + e) + "</p>");
                                return false;
                            }
                            if (pathValue.match(illegalPathPattern)) {
                                external_Swal_default().showValidationMessage('保存路径不能含有字符\\":*?<>|, 示例：/GTA5/');
                                return false;
                            }
                            if (!accessToken && !lastAccessToken) {
                                external_Swal_default().showValidationMessage('请填写授权码');
                                return false;
                            }
                        };
                        willOpen = function () {
                            var requestId = '' + Date.now();
                            var responsePrefix = "accessToken:" + requestId + ":";
                            GM_setValue("accessTokenRequest", "request:" + requestId);
                            $("#mzf-accesstoken-input").data('request-id', requestId);
                            $("#swal2-html-container")
                                .css("font-size", "1rem")
                                .css("display", "grid")
                                .css("margin", "0");
                            if (lastAccessToken) {
                                $("#mzf-accesstoken-input")[0].classList.add('mzf-auto-filled');
                            }
                            $("#mzf-rapid-input")[0].value = inputValue;
                            $("#mzf-path-input")[0].value = pathValue;
                            $("#mzf-rapid-input").on("input", function (event) {
                                var result = parseQueryLink(event.target.value);
                                if (DuParser.parse(result).length)
                                    event.target.value = result;
                            }); // 绑定输入框事件, 输入一键秒传后尝试转换为普通秒传
                            $("#mzf-accesstoken-input").on("input", function (event) {
                                if (event.target.value.startsWith('https://openapi.baidu.com/oauth/2.0/login_success#')) {
                                    try {
                                        var m = new URL(event.target.value).hash.match(/&access_token=([^ =&]+)&/);
                                        if (m) {
                                            event.target.value = m[1];
                                        }
                                    }
                                    catch (e) { }
                                }
                            });
                            function pollAccessToken() {
                                var val = GM_getValue("accessTokenRequest");
                                if (val && val.startsWith(responsePrefix)) {
                                    accessToken = val.substring(responsePrefix.length);
                                    $("#mzf-accesstoken-input")[0].value = accessToken;
                                    GM_setValue("accessTokenRequest", "");
                                    GM_setValue(accessTokenPropKey, accessToken);
                                    return;
                                }
                                var elem = $("#mzf-accesstoken-input");
                                if (elem.length === 1 && elem.data('request-id') === requestId) {
                                    setTimeout(pollAccessToken, 100);
                                }
                            }
                            pollAccessToken();
                        };
                        external_Swal_default().fire(this.mergeArg(SwalConfig.inputView, {
                            preConfirm: preConfirm,
                            willOpen: willOpen,
                        })).then(function (result) {
                            if (result.isConfirmed) {
                                if (accessToken) {
                                    GM_setValue(accessTokenPropKey, accessToken);
                                }
                                if (!inputValue)
                                    return;
                                if (inputValue === "set")
                                    _this.settingView();
                                else if (inputValue === "gen")
                                    _this.genView();
                                else if (inputValue === "info")
                                    _this.updateInfo(function () { });
                                else {
                                    _this.rapiduploadTask.reset();
                                    _this.rapiduploadTask.accessToken = accessToken || lastAccessToken;
                                    _this.rapiduploadTask.fileInfoList = DuParser.parse(inputValue);
                                    GM_setValue("last_dir", pathValue);
                                    if (!pathValue) {
                                        // 路径留空
                                        _this.rapiduploadTask.isDefaultPath = true;
                                        var nowPath = location.href.match(/path=(.+?)(?:&|$)/);
                                        if (nowPath) {
                                            pathValue = decodeURIComponent(nowPath[1]);
                                        }
                                        else {
                                            nowPath = location.href.match(/\/\/pan\.baidu\.com\/wap\/home#\/dir\/(.+?)(?:&|$)/);
                                            if (nowPath) {
                                                pathValue = decodeURIComponent(nowPath[1]);
                                            }
                                            else {
                                                pathValue = "/";
                                            }
                                        }
                                    }
                                    if (pathValue.charAt(0) !== "/")
                                        pathValue = "/" + pathValue; // 补齐路径前缀斜杠
                                    if (pathValue.charAt(pathValue.length - 1) !== "/")
                                        pathValue += "/"; // 补全路径结尾的斜杠
                                    if (locUrl.includes(baiduSyncPage) &&
                                        !pathValue.includes(syncPathPrefix))
                                        pathValue = syncPathPrefix + pathValue; // 补全同步页路径前缀
                                    console.log("\u79D2\u4F20\u6587\u4EF6\u4FDD\u5B58\u5230: " + pathValue); // debug
                                    _this.rapiduploadTask.savePath = pathValue;
                                    _this.processView(false);
                                }
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    // 转存/生成过程中的弹窗
    Swalbase.prototype.processView = function (isGen) {
        var _this = this;
        var swalArg;
        if (isGen) {
            swalArg = {
                title: "秒传生成中",
                html: "<p>正在生成第 <file_num>0</file_num> 个</p><p><gen_prog>正在获取文件列表...</gen_prog></p>",
                willOpen: function () {
                    external_Swal_default().showLoading();
                },
            };
        }
        else {
            swalArg = {
                title: "文件转存中",
                html: "正在转存第 <file_num>0</file_num> 个",
                willOpen: function () {
                    external_Swal_default().showLoading();
                    _this.saveFileWork();
                },
            };
        }
        external_Swal_default().fire(this.mergeArg(SwalConfig.processView, swalArg));
    };
    Swalbase.prototype.getBdlinks = function (bdcode, with_path, absolute_path_mode) {
        var bdlinks = bdcode.split('\n');
        if (!with_path) {
            // 去除秒传链接中的目录结构(仅保留文件名)
            bdlinks = bdlinks.map(function (lnk) { return lnk.replace(/^([0-9A-Za-z]{32}#(?:[0-9A-Za-z]{32}#)?\d+#).*\/([^/]*)$/, "$1$2"); });
            bdlinks = bdlinks.filter(function (lnk) { return lnk.match(/^0{32}#(?:0{32}#)?0#/) == null; });
        }
        else if (!absolute_path_mode) {
            // 去除前置的路径以及路径开头的'/', 将绝对路径转换为相对路径 (默认执行)
            var localPathPrefix_1 = "";
            var nowPath = location.href.match(/path=(.+?)(?:&|$)/);
            if (nowPath)
                localPathPrefix_1 = decodeURIComponent(nowPath[1]);
            bdlinks = bdlinks.map(function (lnk) {
                var parts = lnk.split('#');
                if (parts[parts.length - 1].startsWith(localPathPrefix_1 + '/')) {
                    parts[parts.length - 1] = parts[parts.length - 1].substring(localPathPrefix_1.length);
                    parts[parts.length - 1] = parts[parts.length - 1].replace(/^\/+/, "");
                }
                return parts.join('#');
            });
        }
        else {
            // 保留完整的文件路径(绝对路径)
        }
        return bdlinks;
    };
    // 转存/生成秒传完成的弹窗
    Swalbase.prototype.finishView = function (isGen) {
        var _this = this;
        var fileInfoList = isGen
            ? this.generatebdlinkTask.fileInfoList
            : this.rapiduploadTask.fileInfoList;
        var action = isGen ? "生成" : "转存";
        var parseResult = parsefileInfo(fileInfoList);
        this.parseResult = parseResult;
        var checkboxArg = {
            input: "checkbox",
            inputValue: GM_getValue("with_path"),
            inputPlaceholder: "导出文件夹目录结构",
        }; // 全部失败不显示此checkbox, 22.5.22: 全部失败也显示
        var html = (parseResult.htmlInfo && isGen ? "<br>" : "") +
            parseResult.htmlInfo; // 添加失败列表, 生成模式下添加顶部空行分隔
        var htmlFooter = "";
        if (htmlFooter)
            htmlFooter = "<br>" + htmlFooter; // 添加底部空行分隔
        var successAny = fileInfoList.length - parseResult.failList.length > 0;
        var swalArg = __assign(__assign({ title: action + "\u5B8C\u6BD5 \u5171" + fileInfoList.length + "\u4E2A, \u5931\u8D25" + parseResult.failList.length + "\u4E2A!", confirmButtonText: isGen ? "复制秒传代码" : "确认", showDenyButton: isGen, denyButtonText: "复制一键秒传", denyButtonColor: "#ecae3c", reverseButtons: true, html: html + htmlFooter }, (isGen && checkboxArg)), { willOpen: function () {
                if (isGen) {
                    GM_setValue("unClose", true); // 生成模式设置结果窗口未关闭的标记
                }
                else if (successAny && !isGen) {
                    _this.addOpenDirBtn(); // 转存模式时添加 "打开目录" 按钮
                }
            }, 
            // 秒传生成的 "复制一键秒传" 按钮回调
            preDeny: function () {
                var with_path = $("#swal2-checkbox")[0].checked;
                GM_setValue("with_path", with_path);
                GM_setClipboard(
                // 转换为一键秒传
                bdlinkPrefix + _this.getBdlinks(parseResult.bdcode, with_path, GM_getValue("pathType") == "absolute").join('\n').toBase64());
                external_Swal_default().getDenyButton().innerText = "复制成功,点击右上关闭";
                var footer = external_Swal_default().getFooter();
                // footer.innerHTML = htmlAboutBdlink;
                footer.style.display = "flex";
                return false;
            }, preConfirm: function () {
                if (isGen) {
                    // 生成模式, "复制秒传代码"按钮
                    var with_path = $("#swal2-checkbox")[0].checked;
                    GM_setValue("with_path", with_path);
                    GM_setClipboard(_this.getBdlinks(parseResult.bdcode, with_path, GM_getValue("pathType") == "absolute").join('\n'));
                    external_Swal_default().getConfirmButton().innerText = "复制成功,点击右上关闭";
                    return false;
                }
                else {
                    // 转存模式, "确定" 按钮
                    if (!isGen) {
                        refreshList(); // 调用刷新文件列表的方法
                    }
                    return undefined;
                }
            } });
        external_Swal_default().fire(this.mergeArg(SwalConfig.finishView, swalArg)).then(function (result) {
            if (result.isDismissed || result.dismiss === (external_Swal_default()).DismissReason.close) {
                GM_deleteValue("unfinish"); // 点击了右上角的关闭按钮, 清除任务进度数据
                GM_setValue("unClose", false);
            }
        });
    };
    // 生成文件夹秒传, 是否递归生成提示
    Swalbase.prototype.checkRecursive = function () {
        var _this = this;
        external_Swal_default().fire(this.mergeArg(SwalConfig.checkRecursive)).then(function (result) {
            if (result.isConfirmed) {
                _this.generatebdlinkTask.recursive = true;
            }
            else if (result.dismiss === (external_Swal_default()).DismissReason.cancel)
                _this.generatebdlinkTask.recursive = false;
            else
                return;
            _this.processView(true);
            _this.generatebdlinkTask.scanFile(0);
        });
    };
    // 设置页
    Swalbase.prototype.settingView = function () {
        var _this = this;
        var willOpen = function () {
            $("#swal2-html-container")
                .css("font-size", "1rem")
                .css("display", "grid")
                .css("margin", "0");
            $("#mzf-theme")[0].value = GM_getValue("swalThemes") || "Default";
            $("#mzf-pathType")[0].value = GM_getValue("pathType") || "relative";
            $("#mzf-listen-clipboard")[0].checked = Boolean(GM_getValue("listen-clipboard"));
        };
        var preConfirm = function () { return __awaiter(_this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // 设置主题
                        GM_setValue("swalThemes", $("#mzf-theme")[0].value);
                        // 设置生成秒传导出路径(相对/绝对)
                        GM_setValue("pathType", $("#mzf-pathType")[0].value);
                        if (!$("#mzf-listen-clipboard")[0].checked) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, navigator.clipboard.readText()];
                    case 2:
                        _a.sent();
                        GM_setValue("listen-clipboard", $("#mzf-listen-clipboard")[0].checked);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        showAlert(appError.ClipboardPremissionErr);
                        return [2 /*return*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        external_Swal_default().fire(this.mergeArg(SwalConfig.settingView, {
            willOpen: willOpen,
            preConfirm: preConfirm,
        })).then(function (result) {
            if (result.isConfirmed)
                external_Swal_default().fire(_this.mergeArg(SwalConfig.settingWarning));
        });
    };
    // 生成页 (输入路径列表进行秒传生成)
    Swalbase.prototype.genView = function () {
        var _this = this;
        external_Swal_default().fire(this.mergeArg(SwalConfig.genView)).then(function (result) {
            if (result.isConfirmed) {
                _this.generatebdlinkTask.reset();
                result.value.split("\n").forEach(function (filePath) {
                    if (filePath.charAt(0) !== "/")
                        filePath = "/" + filePath; // 补齐路径前缀斜杠
                    if (locUrl.includes(baiduSyncPage) &&
                        !filePath.includes(syncPathPrefix))
                        filePath = syncPathPrefix + filePath; // 补全同步页路径前缀
                    _this.generatebdlinkTask.fileInfoList.push({
                        path: filePath,
                    });
                });
                _this.processView(true); // 显示进度弹窗
                _this.genFileWork(false, true); // 跳过获取选择文件列表和扫描文件夹的步骤
                _this.generatebdlinkTask.generateBdlink(0); // 开始生成任务
            }
        });
    };
    // 生成秒传未完成任务提示
    Swalbase.prototype.genUnfinish = function (onConfirm, onCancel) {
        external_Swal_default().fire(this.mergeArg(GM_getValue("unClose")
            ? SwalConfig.genUnfinish2
            : SwalConfig.genUnfinish)).then(function (result) {
            if (result.isConfirmed)
                onConfirm();
            else if (result.dismiss === (external_Swal_default()).DismissReason.cancel)
                onCancel();
        });
    };
    // 生成秒传, 未选择任何文件的提示
    Swalbase.prototype.selectNoFileWarning = function () {
        external_Swal_default().fire(this.mergeArg(SwalConfig.selectNoFileWarning));
    };
    // 更新信息页
    Swalbase.prototype.updateInfo = function (onConfirm) {
        external_Swal_default().fire(this.mergeArg(SwalConfig.updateInfo)).then(function (result) {
            if (result.isConfirmed)
                onConfirm();
        });
    };
    // 以下的方法都是任务操作逻辑, 不是弹窗逻辑
    Swalbase.prototype.saveFileWork = function () {
        var _this = this;
        this.rapiduploadTask.onFinish = function () { return _this.finishView(false); };
        this.rapiduploadTask.onProcess = function (i, fileInfoList) {
            external_Swal_default().getHtmlContainer().querySelector("file_num").textContent = i + 1 + " / " + fileInfoList.length;
        };
        this.rapiduploadTask.start(); // 开始转存任务
    };
    Swalbase.prototype.genFileWork = function (isUnfinish, isGenView) {
        var _this = this;
        if (this.generatebdlinkTask.isSharePage)
            this.generatebdlinkTask.selectList = getShareFileList();
        else if (!isGenView)
            this.generatebdlinkTask.selectList = getSelectedFileList();
        if (
        // 未选择文件 + 无未完成的生成任务 + 不在生成页 -> 弹出未选择生成文件的警告弹出
        !this.generatebdlinkTask.selectList.length &&
            !isGenView &&
            !isUnfinish) {
            this.selectNoFileWarning();
            return;
        }
        this.generatebdlinkTask.onProcess = function (i, fileInfoList) {
            external_Swal_default().getHtmlContainer().querySelector("file_num").textContent = i + 1 + " / " + fileInfoList.length;
            external_Swal_default().getHtmlContainer().querySelector("gen_prog").textContent = "0%";
        };
        this.generatebdlinkTask.onProgress = function (e, text) {
            if (text === void 0) { text = ""; }
            if (text) {
                // 显示自定义文本
                external_Swal_default().getHtmlContainer().querySelector("gen_prog").textContent = text;
                return;
            }
            if (!e || typeof e.total !== "number")
                return; // 参数数据不正确 跳过
            external_Swal_default().getHtmlContainer().querySelector("gen_prog").textContent = ((e.loaded / e.total) * 100).toFixed(0) + "%";
        };
        if (this.generatebdlinkTask.isSharePage) {
            this.generatebdlinkTask.onHasNoDir = function () {
                _this.processView(true);
                _this.generatebdlinkTask.scanShareFile(0);
            };
        }
        else {
            this.generatebdlinkTask.onHasNoDir = function () {
                _this.processView(true);
                _this.generatebdlinkTask.generateBdlink(0);
            };
            this.generatebdlinkTask.onHasDir = function () { return _this.checkRecursive(); };
        }
        this.generatebdlinkTask.onFinish = function () { return _this.finishView(true); };
        if (!isUnfinish && !isGenView)
            this.generatebdlinkTask.start(); // 执行新任务初始化
    };
    Swalbase.prototype.checkUnfinish = function () {
        var _this = this;
        if (GM_getValue("unfinish")) {
            this.genUnfinish(function () {
                _this.processView(true);
                _this.genFileWork(true, false);
                var unfinishInfo = GM_getValue("unfinish");
                _this.generatebdlinkTask.fileInfoList = unfinishInfo.file_info_list;
                unfinishInfo.isCheckMd5
                    ? _this.generatebdlinkTask.checkMd5(unfinishInfo.file_id)
                    : _this.generatebdlinkTask.generateBdlink(unfinishInfo.file_id);
            }, // 确认继续未完成任务
            function () {
                GM_deleteValue("unfinish");
                _this.genFileWork(false, false);
            } // 不继续未完成任务, 清除数据, 开启新任务
            );
        }
        else {
            this.genFileWork(false, false);
        } // 没有未完成任务, 直接开启新任务
    };
    // 添加 "打开目录" 按钮
    Swalbase.prototype.addOpenDirBtn = function () {
        if (this.rapiduploadTask.isDefaultPath)
            return; // 转存路径留空, 跳出
        var _dir = (this.rapiduploadTask.savePath || "").replace(/\/$/, ""); // 去除路径结尾的"/"
        if (_dir.charAt(0) !== "/")
            _dir = "/" + _dir; // 补齐路径开头的"/"
        var cBtn = external_Swal_default().getConfirmButton();
        var btn = cBtn.cloneNode();
        btn.textContent = "打开目录";
        btn.style.backgroundColor = "#ecae3c";
        var nowPath = location.href.match(/(path=(.+?))(?:&|$)/);
        btn.onclick = function () {
            if (nowPath) {
                location.href = location.href.replace(
                // 仅替换path参数, 不修改其他参数
                nowPath[1], "path=" + encodeURIComponent(_dir));
            }
            else {
                var connectChar = location.href.includes("?") ? "&" : "?"; // 确定参数的连接符
                location.href += connectChar + "path=" + encodeURIComponent(_dir);
            } // 没有找到path参数, 直接添加
            external_Swal_default().close();
        };
        if ((nowPath ? nowPath[2] : "%2F") != encodeURIComponent(_dir))
            // 当前已在转存目录时不添加按钮
            cBtn.before(btn);
    };
    return Swalbase;
}());
/* harmony default export */ const swalBase = (Swalbase);
 
;// CONCATENATED MODULE: ./src/common/ajax.tsx
/*
 * @Author: mengzonefire
 * @Date: 2021-08-27 14:48:24
 * @LastEditTime: 2023-02-14 04:10:09
 * @LastEditTime: 2023-09-16
 * @LastEditors: mengzonefire
 * @LastEditors: tousakasp
 * @Description: 自封装JQ ajax方法
 */
var ajax_assign = (undefined && undefined.__assign) || function () {
    ajax_assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return ajax_assign.apply(this, arguments);
};
 
var DEBUG = false;
function ajax(config, callback, failback, retry) {
    if (retry === void 0) { retry = {
        max: 0,
        delay: 0,
        accepts: function () { return true; }
    }; }
    function execute(retryLeft) {
        GM_xmlhttpRequest(ajax_assign(ajax_assign({}, config), { onload: function (r) {
                // console.log(r); // debug
                if (Math.floor(r.status / 100) === 2) {
                    if (DEBUG) {
                        console.info("%s version: %s 接口返回: %s", TAG, version, JSON.stringify(r.response)); // user debug
                    }
                    if (retryLeft <= 0 || retry.accepts(r.status, r.response)) {
                        callback(r);
                    }
                    else {
                        scheduleRetry();
                    }
                }
                else {
                    if (retryLeft <= 0 || retry.accepts(r.status, null)) {
                        failback(r.status);
                    }
                    else {
                        scheduleRetry();
                    }
                }
            }, onerror: function () {
                if (retryLeft <= 0 || retry.accepts(ajaxError, null)) {
                    failback(ajaxError);
                }
                else {
                    scheduleRetry();
                }
            } }));
        function scheduleRetry() {
            console.info("\u91CD\u8BD5 " + config.url);
            setTimeout(function () { return execute(retryLeft - 1); }, retry.delay);
        }
    }
    execute(retry.max);
}
 
;// CONCATENATED MODULE: ./src/baidu/common/rapiduploadTask.tsx
/*
 * @Author: mengzonefire
 * @LastEditors: tousakasp
 * @Description: 百度网盘 秒传转存任务实现
 */
 
 
 
var RapiduploadTask = /** @class */ (function () {
    function RapiduploadTask() {
    }
    RapiduploadTask.prototype.reset = function () {
        this.accessToken = "";
        this.bdstoken = getBdstoken();
        console.log("bdstoken\u72B6\u6001: " + (this.bdstoken ? "获取成功" : "获取失败")); // debug
        this.fileInfoList = [];
        this.savePath = "";
        this.isDefaultPath = false;
        this.onFinish = function () { };
        this.onProcess = function () { };
    };
    RapiduploadTask.prototype.start = function () {
        this.saveFileV2(0);
    };
    /**
     * @description: 转存秒传 接口2
     * @param {number} i
     */
    RapiduploadTask.prototype.saveFileV2 = function (i) {
        var _this = this;
        if (i >= this.fileInfoList.length) {
            this.onFinish(this.fileInfoList);
            return;
        }
        this.onProcess(i, this.fileInfoList);
        var file = this.fileInfoList[i];
        var onFailed = function (statusCode) {
            file.errno = statusCode;
            _this.saveFileV2(i + 1);
        };
        if (file.path.endsWith("/") && file.size === 0) {
            createDir.call(this, file.path.replace(/\/+$/, ''), function (data) {
                data = data.response;
                file.errno = data.errno;
                _this.saveFileV2(i + 1);
            }, onFailed);
            return;
        }
        // 文件名为空
        if (file.path === "/") {
            file.errno = -7;
            this.saveFileV2(i + 1);
            return;
        }
        rapiduploadCreateFile.call(this, file, function (data) {
            data = data.response;
            file.errno = 2 === data.errno ? 114 : data.errno;
            file.errno = 31190 === file.errno ? 404 : file.errno;
            _this.saveFileV2(i + 1);
        }, onFailed);
    };
    return RapiduploadTask;
}());
/* harmony default export */ const rapiduploadTask = (RapiduploadTask);
function createDir(path, onResponsed, onFailed) {
    ajax({
        url: "" + createdir_url + (this.bdstoken ? "&bdstoken=" + this.bdstoken : ""),
        method: "POST",
        responseType: "json",
        data: convertData({
            block_list: JSON.stringify([]),
            path: this.savePath + path,
            isdir: 1,
            rtype: 3,
        }),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    }, function (data) {
        if (data.response.errno != null && 0 !== data.response.errno) {
            onFailed(data.response.errno);
        }
        else {
            onResponsed(data);
        }
    }, onFailed);
}
// 此接口测试结果如下: 错误md5->返回"errno": 31190, 正确md5+错误size->返回"errno": 2
// 此外, 即使md5和size均正确, 连续请求时依旧有小概率返回"errno": 2, 故建议加入retry策略
// header内添加"Content-Type": "application/x-www-form-urlencoded"，默认type为text导致随机#2
// openapi 接口无需重试不用写法
function rapiduploadCreateFile(file, onResponsed, onFailed) {
    var _this = this;
    var contentMd5 = file.md5.toLowerCase();
    var retryPolicy = {
        max: 1,
        delay: 500,
        accepts: function (statusCode, response) {
            if (statusCode == 200) {
                if (response != null && response.errno === 2) {
                    return false;
                }
                return true;
            }
            var statusClass = Math.floor(statusCode / 100);
            if (statusClass <= 3)
                return true;
            if (statusCode === 403 || statusCode === 404)
                return true;
            return false;
        }
    };
    ajax({
        url: create_url + "&access_token=" + encodeURIComponent(this.accessToken) + (this.bdstoken ? "&bdstoken=" + this.bdstoken : ""),
        method: "POST",
        responseType: "json",
        data: convertData({
            block_list: JSON.stringify([contentMd5]),
            path: this.savePath + file.path.replace(illegalPathPattern, "_").replace(/\.rar$/, '.RAR'),
            size: file.size,
            isdir: 0,
            rtype: 0, // rtype=3覆盖文件, rtype=0则返回报错, 不覆盖文件, 默认为rtype=1 (自动重命名, 1和2是两种不同的重命名策略)
        }),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    }, function (data) {
        // console.log(data.response); // debug
        if (31039 === data.response.errno && 31039 != file.errno) {
            file.errno = 31039;
            file.path = suffixChange(file.path);
            rapiduploadCreateFile.call(_this, file, onResponsed, onFailed);
        }
        else if (0 !== data.response.errno) {
            onFailed(data.response.errno);
        }
        else
            onResponsed(data);
    }, onFailed, retryPolicy);
}
 
;// CONCATENATED MODULE: ./src/baidu/common/generatebdlinkTask.tsx
/*
 * @Author: mengzonefire
 * @LastEditors: tousakasp
 * @Description: 百度网盘 秒传生成任务实现
 */
 
 
 
 
// import { createFileV2 } from "./rapiduploadTask";
// import SparkMD5 from "spark-md5";
 
var listMinDelayMsec = 1000;
var retryDelaySec = 30;
var standardRetry = {
    max: 3,
    delay: 1000,
    accepts: function (statusCode, response) {
        if (statusCode == 200) {
            if (response != null) {
                if (response.errno === 2 || response.errno === -6 || response.errno === 514) {
                    return false;
                }
            }
            return true;
        }
        var statusClass = Math.floor(statusCode / 100);
        if (statusClass <= 3)
            return true;
        if (statusCode === 403) // assume unrecoverable
            return true;
        return false;
    }
};
// 普通生成:
var GeneratebdlinkTask = /** @class */ (function () {
    function GeneratebdlinkTask() {
    }
    GeneratebdlinkTask.prototype.reset = function () {
        this.isSharePage = false;
        this.recursive = false;
        this.savePath = "";
        this.bdstoken = getBdstoken(); // 此处bdstoken不可删除, 会在下方createFileV2方法调用
        this.dirList = [];
        this.selectList = [];
        this.fileInfoList = [];
        this.onFinish = function () { };
        this.onProcess = function () { };
        this.onProgress = function () { };
        this.onHasDir = function () { };
        this.onHasNoDir = function () { };
    };
    /**
     * @description: 执行新任务的初始化步骤 扫描选择的文件列表
     */
    GeneratebdlinkTask.prototype.start = function () {
        if (this.isSharePage) {
            this.logid = getLogid();
            this.surl = getSurl();
            if (!this.surl) {
                showAlert("surl获取失败");
                return;
            }
            this.parseShareFileList();
            this.onHasNoDir();
        }
        else {
            this.parseMainFileList();
            if (this.dirList.length)
                this.onHasDir();
            else
                this.onHasNoDir();
        }
    };
    GeneratebdlinkTask.prototype.scanShareFile = function (i, page, retryAllowed) {
        var _this = this;
        if (page === void 0) { page = 1; }
        if (retryAllowed === void 0) { retryAllowed = 5; }
        if (i >= this.dirList.length) {
            this.generateBdlink(0);
            return;
        }
        this.onProgress(false, "\u6B63\u5728\u83B7\u53D6\u6587\u4EF6\u5217\u8868, \u7B2C" + (i + 1) + "\u4E2A");
        var shareid = unsafeWindow.yunData ? unsafeWindow.yunData.shareid : unsafeWindow.locals.shareid;
        var uk = unsafeWindow.yunData ? unsafeWindow.yunData.share_uk : unsafeWindow.locals.share_uk;
        ajax({
            url: sharelist_url + "&dir=" + encodeURIComponent(this.dirList[i]) + "&logid=" + this.logid + "&shareid=" + shareid + "&uk=" + uk + "&page=" + page,
            method: "GET",
            responseType: "json",
        }, function (data) {
            data = data.response;
            if (!data.errno) {
                if (!data.list.length) {
                    // 返回列表为空, 即此文件夹文件全部扫描完成
                    if (page === 1) {
                        _this.fileInfoList.push({
                            path: _this.dirList[i] + '/',
                            size: 0,
                            fs_id: '',
                            md5: '00000000000000000000000000000000',
                        });
                    }
                    setTimeout(function () {
                        _this.scanShareFile(i + 1);
                    }, listMinDelayMsec);
                }
                else {
                    _this.parseShareFileList(data.list);
                    if (data.list.length >= listLimit) {
                        setTimeout(function () {
                            _this.scanShareFile(i, page + 1); // 下一页
                        }, listMinDelayMsec);
                    }
                    else {
                        setTimeout(function () {
                            _this.scanShareFile(i + 1);
                        }, listMinDelayMsec);
                    }
                }
            }
            else {
                _this.fileInfoList.push({
                    path: _this.dirList[i],
                    isdir: 1,
                    errno: data.errno,
                }); // list接口访问失败, 添加失败信息
                setTimeout(function () {
                    _this.scanShareFile(i + 1);
                }, listMinDelayMsec);
            }
        }, function (statusCode) {
            if (statusCode === 400 && retryAllowed > 0) { // rate limit
                _this.onProgress(false, retryDelaySec + "\u79D2\u540E\u91CD\u8BD5 ...");
                setTimeout(function () {
                    _this.scanShareFile(i, page, retryAllowed - 1);
                }, listMinDelayMsec + retryDelaySec * 1000);
            }
            else {
                _this.fileInfoList.push({
                    path: _this.dirList[i],
                    errno: statusCode,
                });
                setTimeout(function () {
                    _this.scanShareFile(i + 1);
                }, listMinDelayMsec);
            }
        });
    };
    /**
     * @description: 选择的列表包含文件夹, 获取文件夹下的子文件
     * @param {number} i 条目index
     * @param {number} start 列表接口检索起点(即翻页参数)
     */
    GeneratebdlinkTask.prototype.scanFile = function (i, start, retryAllowed) {
        var _this = this;
        if (start === void 0) { start = 0; }
        if (retryAllowed === void 0) { retryAllowed = 5; }
        if (i >= this.dirList.length) {
            this.generateBdlink(0);
            return;
        }
        ajax({
            url: "" + list_url + encodeURIComponent(this.dirList[i]) + "&recursion=" + (this.recursive ? 1 : 0) + "&start=" + start,
            method: "GET",
            responseType: "json",
        }, // list接口自带递归参数recursion
        function (data) {
            data = data.response;
            if (!data.errno) {
                if (!data.list.length) {
                    // 返回列表为空, 即此文件夹文件全部扫描完成
                    if (start === 0) {
                        _this.fileInfoList.push({
                            path: _this.dirList[i] + '/',
                            size: 0,
                            fs_id: '',
                            md5: '00000000000000000000000000000000',
                        });
                    }
                    setTimeout(function () {
                        _this.scanFile(i + 1);
                    }, listMinDelayMsec);
                }
                else {
                    data.list.forEach(function (item) {
                        if (!item.isdir) {
                            _this.fileInfoList.push({
                                path: item.path,
                                size: item.size,
                                fs_id: item.fs_id,
                                md5: "",
                            }); // 筛选文件(isdir=0)
                        }
                    });
                    if (data.has_more) {
                        setTimeout(function () {
                            _this.scanFile(i, start + listLimit); // 从下一个起点继续检索列表
                        }, listMinDelayMsec);
                    }
                    else {
                        setTimeout(function () {
                            _this.scanFile(i + 1);
                        }, listMinDelayMsec);
                    }
                }
            }
            else {
                _this.fileInfoList.push({
                    path: _this.dirList[i],
                    isdir: 1,
                    errno: data.errno,
                }); // list接口访问失败, 添加失败信息
                setTimeout(function () {
                    _this.scanFile(i + 1);
                }, listMinDelayMsec);
            }
        }, function (statusCode) {
            if (statusCode === 400 && retryAllowed > 0) { // rate limit
                _this.onProgress(false, retryDelaySec + "\u79D2\u540E\u91CD\u8BD5 ...");
                setTimeout(function () {
                    _this.scanFile(i, start, retryAllowed - 1);
                }, listMinDelayMsec + retryDelaySec * 1000);
            }
            else {
                _this.fileInfoList.push({
                    path: _this.dirList[i],
                    errno: statusCode,
                });
                setTimeout(function () {
                    _this.scanFile(i + 1);
                }, listMinDelayMsec);
            }
        });
    };
    /**
     * @description: 顺序执行生成任务
     * @param {number} i
     */
    GeneratebdlinkTask.prototype.generateBdlink = function (i) {
        // 保存任务进度数据, 分享页生成不保存
        if (!this.isSharePage)
            GM_setValue("unfinish", {
                file_info_list: this.fileInfoList,
                file_id: i,
            });
        // 生成完成
        if (i >= this.fileInfoList.length) {
            this.onFinish(this.fileInfoList);
            return;
        }
        var file = this.fileInfoList[i];
        if (file.fs_id === '') {
            this.generateBdlink(i + 1);
        }
        else {
            //  刷新弹窗内的任务进度
            this.onProcess(i, this.fileInfoList);
            // 跳过扫描失败的目录路径
            if (file.errno && file.isdir) {
                this.generateBdlink(i + 1);
                return;
            }
            // 普通生成步骤
            this.isSharePage ? this.getShareDlink(i) : this.getDlink(i);
        }
    };
    /**
     * @description: 获取文件信息: size, md5(可能错误), fs_id
     * @param {number} i
     */
    GeneratebdlinkTask.prototype.getFileInfo = function (i) {
        var _this = this;
        var file = this.fileInfoList[i];
        ajax({
            url: meta_url + encodeURIComponent(file.path),
            responseType: "json",
            method: "GET",
        }, function (data) {
            data = data.response;
            if (!data.error_code) {
                if (data.list[0].isdir) {
                    file.isdir = 1;
                    file.errno = 900;
                    _this.generateBdlink(i + 1);
                    return;
                }
                file.size = data.list[0].size;
                file.fs_id = data.list[0].fs_id;
                file.md5 = "";
                _this.getDlink(i);
            }
            else {
                file.errno = data.error_code;
                _this.generateBdlink(i + 1);
            }
        }, function (statusCode) {
            file.errno = statusCode === 404 ? 909 : statusCode;
            _this.generateBdlink(i + 1);
        }, standardRetry);
    };
    /**
     * @description: 获取分享页的文件dlink(下载直链)
     * @param {number} i
     */
    GeneratebdlinkTask.prototype.getShareDlink = function (i) {
        var _this = this;
        var sign, timestamp, file = this.fileInfoList[i], onFailed = function (errno) {
            file.errno = errno;
            _this.getShareDlink(i + 1);
            // md5为空只在分享单个文件时出现, 故无需考虑获取多文件md5(跳转generateBdlink), 直接跳转checkMd5即可
        };
        function getTplconfig(file) {
            var _this = this;
            ajax({
                url: tpl_url + "&surl=" + this.surl + "&logid=" + this.logid,
                responseType: "json",
                method: "GET",
            }, function (data) {
                data = data.response;
                // 请求正常
                if (!data.errno) {
                    sign = data.data.sign;
                    timestamp = data.data.timestamp;
                    getDlink.call(_this, file);
                    return;
                }
                // 请求报错
                onFailed(data.errno);
            }, onFailed, standardRetry);
        }
        function getDlink(file) {
            var _this = this;
            ajax({
                url: sharedownload_url + "&sign=" + sign + "&timestamp=" + timestamp,
                responseType: "json",
                method: "POST",
                data: convertData({
                    extra: getExtra(),
                    logid: this.logid,
                    fid_list: JSON.stringify([file.fs_id]),
                    primaryid: unsafeWindow.yunData ? unsafeWindow.yunData.shareid : unsafeWindow.locals.shareid,
                    uk: unsafeWindow.yunData ? unsafeWindow.yunData.share_uk : unsafeWindow.locals.share_uk,
                    product: "share",
                    encrypt: 0,
                }),
            }, function (data) {
                data = data.response;
                // 请求正常
                if (!data.errno) {
                    if (_this.isDownload) {
                        _this.directFileDownload(i, data.list[0].dlink);
                    }
                    else {
                        _this.acquireFileMd5(i, data.list[0].dlink);
                    }
                    return;
                }
                // 请求报错
                onFailed(data.errno);
            }, onFailed, standardRetry);
        }
        getTplconfig.call(this, file);
    };
    /**
     * @description: 获取文件dlink(下载直链)
     * @param {number} i
     */
    GeneratebdlinkTask.prototype.getDlink = function (i) {
        var _this = this;
        var file = this.fileInfoList[i];
        // 使用生成页时仅有path没有fs_id, 跳转到获取fs_id
        if (!file.fs_id) {
            this.getFileInfo(i);
            return;
        }
        ajax({
            url: meta_url2 + JSON.stringify([String(file.fs_id)]),
            responseType: "json",
            method: "GET",
            headers: { "User-Agent": UA },
        }, function (data) {
            data = data.response;
            // 请求正常
            if (!data.errno) {
                _this.acquireFileMd5(i, data.info[0].dlink);
                return;
            }
            // 请求报错
            file.errno = data.errno;
            _this.generateBdlink(i + 1);
        }, function (statusCode) {
            file.errno = statusCode;
            _this.generateBdlink(i + 1);
        }, standardRetry);
    };
    /**
     * @description: get MD5
     * @param {number} i
     * @param {string} dlink
     */
    GeneratebdlinkTask.prototype.acquireFileMd5 = function (i, dlink) {
        var _this = this;
        var file = this.fileInfoList[i];
        //let dlSize = file.size < 262144 ? 1 : 262143; //slice-md5: 文件前256KiB的md5, size<256KiB则直接取md5即可, 无需下载文件数据
        var dlSize = 1;
        ajax({
            url: dlink,
            method: "GET",
            responseType: "arraybuffer",
            headers: {
                Range: "bytes=0-" + dlSize,
                "User-Agent": UA,
            },
            onprogress: this.onProgress,
        }, function (data) {
            _this.onProgress({ loaded: 100, total: 100 }); // 100%
            _this.parseDownloadData(i, data);
        }, function (statusCode) {
            if (statusCode === 404)
                file.errno = 909;
            else
                file.errno = statusCode;
            _this.generateBdlink(i + 1);
        }, standardRetry);
    };
    /**
     * @description: 解析直链请求返回的数据
     * @param {number} i
     * @param {any} data
     */
    GeneratebdlinkTask.prototype.parseDownloadData = function (i, data) {
        var _this = this;
        var file = this.fileInfoList[i];
        console.log("dl_url: " + data.finalUrl); // debug
        // 下载直链重定向到此域名, 判定为文件和谐
        if (data.finalUrl.includes("issuecdn.baidupcs.com")) {
            file.errno = 1919;
            this.generateBdlink(i + 1);
            return;
        }
        // 从下载接口获取md5, 此步骤可确保获取到正确md5
        var fileMd5 = data.responseHeaders.match(/content-md5: ([\da-f]{32})/i);
        if (fileMd5)
            file.md5 = fileMd5[1];
        else if (file.size <= 3900000000 && !file.retry_996 && !this.isSharePage) {
            // 默认下载接口未拿到md5, 尝试使用旧下载接口, 旧接口请求文件size大于3.9G会返回403
            // 分享页的生成任务不要调用旧接口
            file.retry_996 = true;
            this.acquireFileMd5(i, pcs_url + ("&path=" + encodeURIComponent(file.path)));
            return;
        }
        else {
            // 两个下载接口均未拿到md5, 失败跳出
            file.errno = 996;
            this.generateBdlink(i + 1);
            return;
        }
        var interval = this.fileInfoList.length > 1 ? 2000 : 1000;
        setTimeout(function () {
            _this.generateBdlink(i + 1);
        }, interval);
    };
    /**
     * @description: "极速生成" 可能得到错误md5, 故执行验证步骤, 若验证不通过则执行普通生成
     * @param {number} i
     */
    GeneratebdlinkTask.prototype.checkMd5 = function (i) {
        var _this = this;
        if (i >= this.fileInfoList.length) {
            this.onFinish(this.fileInfoList);
            return;
        }
        var file = this.fileInfoList[i];
        // 跳过扫描失败的目录路径
        if (file.errno && file.isdir) {
            this.checkMd5(i + 1);
            return;
        }
        this.onProcess(i, this.fileInfoList);
        this.onProgress(false, "极速生成中...");
        this.isSharePage ? this.getShareDlink(i) : this.getDlink(i);
        // this.isSharePage ? this.getShareDlink(i) : this.getDlink(i);
        // 23.4.27: 错误md5在文件上传者账号使用此接口正常转存, 在其他账号则报错#404(#31190), 导致生成秒传完全无法验证, 故弃用meta内的md5
        // 23.5.4: 发现错误md5只要改成大写, 在上传者账号就能正常返回#31190, 而正确md5则大小写都能正常转存, 故重新启用此验证过程
        // 主要是因为频繁请求直链接口获取正确md5会导致#9019错误(即账号被限制), 对大批量生成秒传有很大影响, 极速生成功能使用此验证则可以节约请求以避免此问题
        // 为避免百度后面又改接口导致生成错误秒传问题, 这个接口特性我会写个定时脚本每天测试一次, 出了问题就能即使更新
        // 目前发现是通过秒传拿到的文件再生成秒传不会有这问题, 上传的文件或通过分享转存的别人上传的文件则会有
        rapiduploadCreateFile.call(this, file, function (data) {
            data = data.response;
            if (0 === data.errno)
                _this.checkMd5(i + 1); // md5验证成功
            else if (31190 === data.errno) {
                // md5验证失败, 执行普通生成, 仅在此处保存任务进度, 生成页不保存进度
                if (!_this.isSharePage)
                    GM_setValue("unfinish", {
                        file_info_list: _this.fileInfoList,
                        file_id: i,
                        isCheckMd5: true,
                    });
                _this.isSharePage ? _this.getShareDlink(i) : _this.getDlink(i);
            }
            else {
                // 接口访问失败
                file.errno = data.errno;
                _this.checkMd5(i + 1);
            }
        }, function (statusCode) {
            file.errno = statusCode;
            _this.checkMd5(i + 1);
        }, 0, true);
    };
    /**
     * @description: 用于解析度盘主页的文件列表数据
     */
    GeneratebdlinkTask.prototype.parseMainFileList = function () {
        for (var _i = 0, _a = this.selectList; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.isdir)
                this.dirList.push(item.path);
            else
                this.fileInfoList.push({
                    path: item.path,
                    size: item.size,
                    fs_id: item.fs_id,
                    md5: "",
                });
        }
    };
    /**
     * @description: 用于解析分享页的文件列表数据
     */
    GeneratebdlinkTask.prototype.parseShareFileList = function (list) {
        if (list === void 0) { list = this.selectList; }
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var item = list_1[_i];
            var path = void 0;
            if ("app_id" in item)
                path = item.isdir ? item.path : item.server_filename;
            else
                path = item.path;
            if ("/" !== path.charAt(0))
                path = "/" + path; // 补齐路径开头的斜杠
            if (item.isdir)
                this.dirList.push(path);
            else
                this.fileInfoList.push({
                    path: path,
                    size: item.size,
                    fs_id: item.fs_id,
                    md5: item.md5 && decryptMd5(item.md5.toLowerCase()),
                });
        }
    };
    return GeneratebdlinkTask;
}());
/* harmony default export */ const generatebdlinkTask = (GeneratebdlinkTask);
 
;// CONCATENATED MODULE: ./src/baidu/common/const.tsx
/*
 * @Author: mengzonefire
 * @LastEditors: tousakasp
 * @Description: 存放各种全局常量对象
 */
 
 
 
var host = location.host;
var listLimit = 10000;
var syncPathPrefix = "/_pcs_.workspace";
var create_url = "https://" + host + "/rest/2.0/xpan/file?method=create";
var createdir_url = "https://" + host + "/api/create?a=commit&clienttype=0&app_id=250528&web=1";
var precreate_url = "https://" + host + "/api/precreate";
var list_url = "https://" + host + "/rest/2.0/xpan/multimedia?method=listall&order=name&limit=" + listLimit + "&path=";
var meta_url = "https://pcs.baidu.com/rest/2.0/pcs/file?app_id=778750&method=meta&path=";
var meta_url2 = "https://" + host + "/api/filemetas?dlink=1&fsids=";
var tpl_url = "https://" + host + "/share/tplconfig?fields=sign,timestamp&channel=chunlei&web=1&app_id=250528&clienttype=0";
var sharedownload_url = "https://" + host + "/api/sharedownload?channel=chunlei&clienttype=12&web=1&app_id=250528";
var sharelist_url = "https://" + host + "/share/list?showempty=0&num=" + listLimit + "&channel=chunlei&web=1&app_id=250528&clienttype=0";
var syncdownload_url = "https://" + host + "/api/download";
var pcs_url = "https://pcs.baidu.com/rest/2.0/pcs/file?app_id=778750&method=download";
var illegalPathPattern = /[\\":*?<>|]/g; // 匹配路径中的非法字符
var getBdstoken; // 获取bdstoken的实现
function setGetBdstoken(func) {
    getBdstoken = func;
}
var getUserId;
function setGetUserId(func) {
    getUserId = func;
}
var refreshList; // 刷新文件列表的实现
function setRefreshList(func) {
    refreshList = func;
}
var getSelectedFileList; // 获取选中的文件列表的实现
function setGetSelectedFileList(func) {
    getSelectedFileList = func;
}
var getShareFileList;
function setGetShareFileList(func) {
    getShareFileList = func;
}
var swalInstance = new swalBase(new rapiduploadTask(), new generatebdlinkTask());
function baiduErrno(errno) {
    switch (errno) {
        case 31045:
        case -6:
            return "认证失败, 请重新登入, 刷新页面";
        case -7:
            return "转存路径含有非法字符, 请改名后重试";
        case -8:
            return "路径下存在同名文件";
        case -9:
            return "验证已过期, 请刷新页面";
        case 400:
            return "请求错误";
        case 9019:
            return "请重新获取授权码";
        case 20010:
            return "授权应用已被禁用，请更改应用再次授权";
        case 403:
            return "接口限制访问";
        case 404:
        case 31190:
            return "转存失败, 秒传未生效";
        case 114:
            return "转存失败";
        case 514:
            return "请求失败, 常见百度问题, 请稍后重试";
        case 1919:
            return "文件已被和谐";
        case 996:
            return "md5获取失败";
        case 2:
            return "转存失败, 参数错误";
        case -10:
            return "网盘容量已满";
        case 500:
        case 502:
        case 503:
            return "服务器错误, 请稍后重试";
        case 31066:
        case 909:
            return "路径不存在/云端文件已损坏";
        case 900:
            return "路径为文件夹, 不支持生成秒传";
        case 31039:
            return "转存失败, 秒传文件名冲突";
        case 110:
            return "请先登录百度账号";
        case 9013:
            return "账号被限制, 尝试 更换账号 或 等待一段时间再重试";
        default:
            return "不明错误";
    }
} // 自定义百度api返回errno的报错
 
;// CONCATENATED MODULE: ./src/common/utils.tsx
/*
 * @Author: mengzonefire
 * @LastEditors: tousakasp
 * @Description: 存放工具函数
 */
var utils_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var utils_generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
 
 
 
/**
 * @description: 弹出一个文本提示框
 * @param {string} text
 */
function showAlert(text) {
    alert(TAG + ":\n" + text);
}
/**
 * @description: 解析文件信息, 返回转存结果列表html, 秒传链接, 失败文件个数, 成功的文件信息列表, 失败的文件信息列表
 * @param {Array} fileInfoList 文件信息数据列表
 */
function parsefileInfo(fileInfoList) {
    var bdcode = "";
    var successInfo = "";
    var failedInfo = "";
    var successList = [];
    var failList = [];
    var failCodeDic = {};
    fileInfoList.forEach(function (item) {
        item.path = item.path.replace(syncPathPrefix, ""); // 移除同步页前缀
        // 成功文件
        if (0 === item.errno || undefined === item.errno) {
            successInfo += "<p>" + item.path + "</p>";
            bdcode += item.md5 + "#" + item.size + "#" + item.path + "\n";
            successList.push(item);
        }
        // 失败文件
        else {
            failList.push(item);
            if (String(item.errno) in failCodeDic)
                failCodeDic[String(item.errno)].push(item);
            else
                failCodeDic[String(item.errno)] = [item];
        }
    });
    var _loop_1 = function (failCode) {
        var failBranchInfo = "";
        var failBranchList = failCodeDic[failCode];
        failBranchList.forEach(function (item) {
            failBranchInfo += "<p>" + item.path + "</p>";
        });
        failedInfo += "<details class=\"mzf_details mzf_details_branch\"><summary><svg class=\"mzf_arrow\" width=\"16\" height=\"7\"><polyline points=\"0,0 8,7 16,0\"/></svg><b>" + baiduErrno(Number(failCode)) + " (#" + Number(failCode) + "):</b>" + copyFailBranchList + "</summary></details><div class=\"mzf_content\">" + failBranchInfo + "</div>";
    };
    for (var failCode in failCodeDic) {
        _loop_1(failCode);
    }
    if (failedInfo)
        failedInfo = "<details class=\"mzf_details\"><summary><svg class=\"mzf_arrow\" width=\"16\" height=\"7\"><polyline points=\"0,0 8,7 16,0\"/></svg><b>\u5931\u8D25\u6587\u4EF6\u5217\u8868(\u70B9\u8FD9\u91CC\u770B\u5931\u8D25\u539F\u56E0):</b>" + copyFailList + "</summary></details><div class=\"mzf_content\">" + failedInfo + "</div>";
    if (successInfo)
        successInfo = "<details class=\"mzf_details\"><summary><svg class=\"mzf_arrow\" width=\"16\" height=\"7\"><polyline points=\"0,0 8,7 16,0\"/></svg><b>\u6210\u529F\u6587\u4EF6\u5217\u8868(\u70B9\u51FB\u5C55\u5F00):</b>" + copySuccessList + "</summary></details><div class=\"mzf_content\">" + successInfo + "</div>";
    bdcode = bdcode.trim();
    return {
        htmlInfo: successInfo && failedInfo
            ? successInfo + "<p><br /></p>" + failedInfo
            : successInfo + failedInfo,
        bdcode: bdcode,
        successList: successList,
        failList: failList,
    };
}
/**
 * @description: 获取分享页的文件列表
 */
function utils_getShareFileList() {
    var bdListInstance = unsafeWindow.require("system-core:context/context.js")
        .instanceForSystem.list;
    var selectList = bdListInstance.getSelected();
    if (!selectList.length)
        selectList = bdListInstance.getCurrentList();
    return selectList;
}
/**
 * @description: 获取选择的文件列表(旧版界面)
 */
function getSelectedFileListLegacy() {
    return unsafeWindow
        .require("system-core:context/context.js")
        .instanceForSystem.list.getSelected();
}
/**
 * @description: 获取选择的文件列表(新版界面)
 * 我从这里抄的, 谢谢你: https://greasyfork.org/zh-CN/scripts/436446
 */
function getSelectedFileListNew() {
    return document.querySelector(".nd-main-list, .nd-new-main-list").__vue__
        .selectedList;
}
/**
 * @description: 将data键值对转换为query字符串
 * @param {any} data
 * @return {string} query
 */
function convertData(data) {
    var query = [];
    for (var key in data) {
        query.push(key + "=" + encodeURIComponent(data[key]));
    }
    ;
    return query.join('&');
}
/**
 * @description: 从剪贴板获取字符串数据
 * @return {string} bdlink
 */
function parseClipboard() {
    return utils_awaiter(this, void 0, void 0, function () {
        var bdlink, error_1;
        return utils_generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, navigator.clipboard.readText()];
                case 1:
                    bdlink = _a.sent();
                    if (!DuParser.parse(bdlink).length)
                        return [2 /*return*/, ""];
                    return [2 /*return*/, bdlink];
                case 2:
                    error_1 = _a.sent();
                    showAlert(appError.ClipboardPremissionErr);
                    return [2 /*return*/, ""];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * @description: 解密已加密的md5
 * @param {string} md5 (加密)
 * @return {string} md5 (解密)
 */
function decryptMd5(md5) {
    if (!((parseInt(md5[9]) >= 0 && parseInt(md5[9]) <= 9) ||
        (md5[9] >= "a" && md5[9] <= "f")))
        return decrypt(md5);
    else
        return md5;
    function decrypt(encryptMd5) {
        var key = (encryptMd5[9].charCodeAt(0) - "g".charCodeAt(0)).toString(16);
        var key2 = encryptMd5.slice(0, 9) + key + encryptMd5.slice(10);
        var key3 = "";
        for (var a = 0; a < key2.length; a++)
            key3 += (parseInt(key2[a], 16) ^ (15 & a)).toString(16);
        var md5 = key3.slice(8, 16) +
            key3.slice(0, 8) +
            key3.slice(24, 32) +
            key3.slice(16, 24);
        return md5;
    }
}
/**
 * @description: 用于解决#31039报错
 * @param {string} path 原文件路径
 * @return {string} 修改文件后缀的路径
 */
function suffixChange(path) {
    var suffix = path.substring(path.lastIndexOf(".") + 1); // 获取后缀
    return path.substring(0, path.length - suffix.length) + reverseStr(suffix);
}
/**
 * @description: 逆转字符串大小写
 * @param {string} str 输入字符串
 * @return {string} 处理后的字符串
 */
function reverseStr(str) {
    var newStr = "";
    for (var i = 0; i < str.length; i++) {
        var reverseChar = void 0;
        if (str.charAt(i) >= "a")
            reverseChar = str.charAt(i).toUpperCase();
        else if (str.charAt(i) >= "A")
            reverseChar = str.charAt(i).toLowerCase();
        else
            reverseChar = str.charAt(i);
        newStr += reverseChar;
    }
    return newStr;
}
// 下方四个function用于分享页生成秒传
// 依旧是从这里抄的: https://greasyfork.org/zh-CN/scripts/436446
function getCookie(name) {
    var arr = document.cookie.replace(/\s/g, "").split(";");
    for (var i = 0, l = arr.length; i < l; i++) {
        var tempArr = arr[i].split("=");
        if (tempArr[0] === name) {
            return decodeURIComponent(tempArr[1]);
        }
    }
    return "";
}
function getLogid() {
    return btoa(getCookie("BAIDUID")); // BAIDUID is asciii
}
function getSurl() {
    var reg = /(s\/|surl=)([a-zA-Z0-9_-]+)/;
    if (reg.test(location.href)) {
        return location.href.match(reg)[2];
    }
    return "";
}
function getExtra() {
    var seKey = decodeURIComponent(getCookie("BDCLND"));
    return "{" + '"sekey":"' + seKey + '"' + "}";
}
function isMobileVer() {
    return document.location.pathname === '/wap/home' || document.querySelector('script[src^="https://hm.baidu.com/h.js"]:not([async])') != null;
}
 
;// CONCATENATED MODULE: ./src/baidu/newPage/loader.tsx
/*
 * @Author: mengzonefire
 * @LastEditors: tousakasp
 * @Description: 新版度盘界面loader入口: https://pan.baidu.com/disk/main
 */
 
 
 
var htmlTagNew = "div.nd-file-list-toolbar__actions"; // 新版界面秒传按钮的html父对象
var htmlTagNew2 = "div.wp-s-agile-tool-bar__header"; // 22.5.24: 新版界面新增的一个父对象
var htmlBtnRapidNew = // 新版界面秒传按钮的html元素
 '<button id="bdlink_btn" class="mzf_new_btn"></i><span>秒传</span></button>';
var htmlBtnGenNew = // 新版界面秒传生成按钮的html元素
 '<button id="gen_bdlink_btn" class="mzf_new_btn"></i><span>生成秒传</span></button>';
function installNew() {
    console.info("%s version: %s DOM方式安装 (new-ui)", TAG, version);
    swalInstance.swalGlobalArgs = {
        heightAuto: false,
        scrollbarPadding: false,
    }; // 添加swal参数以防止新版界面下的body样式突变
    setRefreshList(function () {
        document
            .querySelector(".nd-main-list, .nd-new-main-list")
            .__vue__.reloadList();
    });
    setGetShareFileList(utils_getShareFileList);
    setGetSelectedFileList(getSelectedFileListNew);
    setGetBdstoken(function () {
        return document.querySelector(".nd-main-list, .nd-new-main-list").__vue__.yunData
            .bdstoken;
    });
    setGetUserId(function () { return '' + document.querySelector(".nd-main-list, .nd-new-main-list").__vue__.yunData.uk; });
    $(document).on("click", "#bdlink_btn", function () {
        swalInstance.inputView();
    }); // 绑定转存秒传按钮事件
    $(document).on("click", "#gen_bdlink_btn", function () {
        swalInstance.generatebdlinkTask.reset();
        swalInstance.checkUnfinish();
    }); // 绑定生成秒传按钮事件
    addBtn();
}
function addBtn() {
    // 轮询添加按钮, 防止新版页面重复init时, 将按钮覆盖
    var target = $(htmlTagNew);
    if (!target.length)
        target = $(htmlTagNew2);
    if (target.length && !$("#bdlink_btn").length) {
        target.append(htmlBtnRapidNew, htmlBtnGenNew);
    }
    setTimeout(addBtn, 500);
}
 
;// CONCATENATED MODULE: ./src/baidu/legacyPage/loader.tsx
/*
 * @Author: mengzonefire
 * @Date: 2022-10-20 10:36:43
 * @LastEditTime: 2022-12-24 10:57:23
 * @LastEditors: mengzonefire
 * @Description: 旧版度盘界面loader入口: https://pan.baidu.com/disk/home?stayAtHome=true
 */
 
 
 
var htmlTagLegacy = "div.tcuLAu"; // 旧版界面秒传按钮的html父对象
var htmlBtnRapidLegacy = // 旧版界面秒传按钮的html元素
 '<a class="g-button g-button-blue" id="bdlink_btn" title="秒传链接" style="display: inline-block;""><span class="g-button-right"><em class="icon icon-disk" title="秒传链接提取"></em><span class="text" style="width: auto;">秒传链接</span></span></a>';
var htmlBtnGenLegacy = // 旧版界面秒传生成按钮的html元素
 '<a class="g-button" id="gen_bdlink_btn"><span class="g-button-right"><em class="icon icon-share"></em><span class="text" style="width: auto;">生成秒传</span></span></a>';
function installLegacy() {
    console.info("%s version: %s DOM方式安装", TAG, version);
    setRefreshList(function () {
        // 旧版界面, 调用原生方法刷新文件列表, 无需重新加载页面
        unsafeWindow
            .require("system-core:system/baseService/message/message.js")
            .trigger("system-refresh");
    });
    setGetShareFileList(utils_getShareFileList);
    setGetSelectedFileList(getSelectedFileListLegacy);
    setGetBdstoken(function () { return unsafeWindow.locals.get("bdstoken"); });
    setGetUserId(function () { return unsafeWindow.locals.get("uk"); });
    loader_addBtn(); // DOM添加秒传按钮
    addGenBtn(); // DOM添加生成按钮
    $(document).on("click", "#bdlink_btn", function () {
        swalInstance.inputView();
    }); // 绑定秒传按钮事件
    $(document).on("click", "#gen_bdlink_btn", function () {
        swalInstance.generatebdlinkTask.reset();
        swalInstance.checkUnfinish();
    }); // 绑定生成按钮事件
}
function getSystemContext() {
    return unsafeWindow.require("system-core:context/context.js")
        .instanceForSystem;
}
function addGenBtn() {
    var listTools = getSystemContext().Broker.getButtonBroker("listTools");
    if (listTools && listTools.$box)
        $(listTools.$box).children("div").after(htmlBtnGenLegacy);
    else
        setTimeout(addGenBtn, 300);
}
function loader_addBtn() {
    if ($(htmlTagLegacy).length)
        $(htmlTagLegacy).append(htmlBtnRapidLegacy);
    else
        setTimeout(loader_addBtn, 100);
}
 
;// CONCATENATED MODULE: ./src/baidu/syncPage/loader.tsx
/*
 * @Author: mengzonefire
 * @LastEditors: tousakasp
 * @Description: 同步空间loader入口: https://pan.baidu.com/disk/synchronization#
 */
 
 
 
var loader_htmlTagNew = "div.nd-btn-group > span";
var loader_htmlBtnRapidNew = '<button id="bdlink_btn" type="button" class="u-button is-round is-has-icon" style="background: #06a7ff;color: #fff;"><span><i class="iconfont icon-copy"></i><span class=" nd-file-list-toolbar-action-item-text">秒传</span></span></button>';
// const htmlBtnGenNew =
//   '<button id="gen_bdlink_btn" type="button" class="u-button is-round is-has-icon" style="margin-left: 8px;background: #06a7ff;color: #fff;"><span><i class="iconfont icon-copy"></i><span class=" nd-file-list-toolbar-action-item-text">生成秒传</span></span></button>';
function installSync() {
    console.info("%s version: %s DOM方式安装", TAG, version);
    swalInstance.swalGlobalArgs = {
        heightAuto: false,
        scrollbarPadding: false,
    };
    setRefreshList(function () {
        document
            .querySelector(".nd-main-list, .nd-new-main-list")
            .__vue__.reloadList();
    });
    setGetShareFileList(utils_getShareFileList);
    setGetSelectedFileList(getSelectedFileListNew);
    setGetBdstoken(function () {
        return document.querySelector(".nd-main-list, .nd-new-main-list").__vue__.yunData
            .bdstoken;
    });
    setGetUserId(function () { return '' + document.querySelector(".nd-main-list, .nd-new-main-list").__vue__.yunData.uk; });
    $(document).on("click", "#bdlink_btn", function () {
        swalInstance.inputView();
    }); // 绑定转存秒传按钮事件
    $(document).on("click", "#gen_bdlink_btn", function () {
        swalInstance.generatebdlinkTask.reset();
        swalInstance.checkUnfinish();
    }); // 绑定生成秒传按钮事件
    syncPage_loader_addBtn();
}
function syncPage_loader_addBtn() {
    // 轮询添加按钮, 防止新版页面重复init时, 将按钮覆盖
    var target = $(loader_htmlTagNew);
    if (target.length && !$("#bdlink_btn").length)
        target.append(loader_htmlBtnRapidNew);
    // target.append(htmlBtnRapidNew, htmlBtnGenNew);
    // 同步页中的文件使用另一种的接口获取dlink, 故暂不添加生成功能
    setTimeout(syncPage_loader_addBtn, 500);
}
 
;// CONCATENATED MODULE: ./src/baidu/sharePage/loader.tsx
/*
 * @Author: mengzonefire
 * @LastEditors: tousakasp
 * @Description: 文件分享页loader入口: https://pan.baidu.com/s/xxx
 */
 
 
 
var htmlBtnGenShare = // 分享页的秒传生成按钮html元素
 '<a id="gen_bdlink_btn_sharePage" title="生成秒传" class="g-button g-button-blue-large" style="margin-right: 5px;margin-left: 5px;"> <span class="g-button-right"> <em class="icon icon-share" style="color:#ffffff" title="生成秒传"></em> <span class="text" style="width: auto;">生成秒传</span> </span> </a>';
var htmlTagSahre = "[node-type=qrCode]";
function installShare() {
    console.info("%s version: %s DOM方式安装", TAG, version);
    setGetBdstoken(function () { return unsafeWindow.locals.get("bdstoken"); });
    setGetUserId(function () { return unsafeWindow.locals.get("uk"); });
    setGetShareFileList(utils_getShareFileList);
    sharePage_loader_addBtn();
    $(document).on("click", "#gen_bdlink_btn_sharePage", function () {
        swalInstance.generatebdlinkTask.reset();
        swalInstance.generatebdlinkTask.isSharePage = true;
        swalInstance.genFileWork(false, false);
    }); // 绑定生成按钮事件
}
function sharePage_loader_addBtn() {
    if ($(htmlTagSahre).length) {
        $(htmlTagSahre).before(htmlBtnGenShare);
    }
    else
        setTimeout(sharePage_loader_addBtn, 100);
}
 
;// CONCATENATED MODULE: ./src/baidu/mobilePage/loader.tsx
 
 
 
var mobilePage_loader_htmlBtnRapidNew = // 新版界面秒传按钮的html元素
 '<button id="bdlink_btn" class="mzf_new_btn"></i><span>秒传</span></button>';
function installMobile() {
    console.info("%s version: %s MobileVer方式安装", TAG, version);
    swalInstance.swalGlobalArgs = {
        heightAuto: false,
        scrollbarPadding: false,
    }; // 添加swal参数以防止新版界面下的body样式突变
    setRefreshList(function () { return document.location.reload(); });
    setGetShareFileList(utils_getShareFileList);
    setGetSelectedFileList(function () {
        var fileList = $('.main-container > .multifile > .file-list')[0].__vue__.allFileList;
        return fileList.filter(function (item) { return !!item.selected; });
    });
    setGetBdstoken(function () { return unsafeWindow.locals.bdstoken; });
    setGetUserId(function () { return unsafeWindow.locals.uk; });
    $(document).on("click", "#bdlink_btn", function () {
        swalInstance.inputView();
    }); // 绑定转存秒传按钮事件
    $(document).on("click", "#gen_bdlink_btn", function () {
        swalInstance.generatebdlinkTask.reset();
        swalInstance.checkUnfinish();
    }); // 绑定生成秒传按钮事件
    mobilePage_loader_addBtn();
}
function mobilePage_loader_addBtn() {
    // 轮询添加按钮, 防止新版页面重复init时, 将按钮覆盖
    var target = $(".main-container > header");
    if (target.length && !$("#bdlink_btn").length)
        target.append(mobilePage_loader_htmlBtnRapidNew);
    var target2 = $(".main-container");
    if (target2.length && !$("#gen_bdlink_btn").length)
        target2.append('<span id="gen_bdlink_btn" class="wapfont none-pointer"><span>');
    setTimeout(mobilePage_loader_addBtn, 500);
}
 
;// CONCATENATED MODULE: ./src/baidu/mobileSharePage/loader.tsx
 
 
function installMobileShare() {
    console.info("%s version: %s MobileVer方式安装", TAG, version);
    swalInstance.swalGlobalArgs = {
        heightAuto: false,
        scrollbarPadding: false,
    }; // 添加swal参数以防止新版界面下的body样式突变
    setRefreshList(function () { return document.location.reload(); });
    setGetShareFileList(function () {
        var fileList = $('.main-container > .multifile > .file-list')[0].__vue__.allFileList;
        return Array.from(fileList).map(function (item) {
            return Object.assign({}, item, {
                category: item.category * 1,
                fs_id: item.fs_id * 1,
                isdir: item.isdir * 1,
                local_ctime: item.local_ctime * 1,
                local_mtime: item.local_mtime * 1,
                server_ctime: item.server_ctime * 1,
                server_mtime: item.server_mtime * 1,
                size: item.size * 1,
            });
        });
    });
    setGetBdstoken(function () { return unsafeWindow.locals.bdstoken; });
    setGetUserId(function () { return unsafeWindow.locals.uk; });
    $(document).on("click", "#gen_bdlink_btn", function () {
        swalInstance.generatebdlinkTask.reset();
        swalInstance.generatebdlinkTask.isSharePage = true;
        swalInstance.checkUnfinish();
    }); // 绑定生成秒传按钮事件
    mobileSharePage_loader_addBtn();
}
function mobileSharePage_loader_addBtn() {
    // 轮询添加按钮, 防止新版页面重复init时, 将按钮覆盖
    var target = $(".main-container");
    if (target.length && !$("#gen_bdlink_btn").length)
        target.append('<span id="gen_bdlink_btn" class="wapfont none-pointer mobile-share-page"><span>');
    setTimeout(mobileSharePage_loader_addBtn, 500);
}
 
;// CONCATENATED MODULE: ./src/baidu/loader.tsx
/*
 * @Author: mengzonefire
 * @LastEditors: tousakasp
 * @Description: 主函数入口
 */
 
 
 
 
 
 
 
 
 
 
function loaderBaidu() {
    // remove dead keys left behind by 3.1.6
    GM_listValues().forEach(function (key) {
        if (key.match(/^[^#][^:]+::access_token$/)) {
            GM_deleteValue(key);
        }
    });
    var load = function () {
        if (locUrl.includes(baiduNewPage)) {
            installNew();
        }
        else if (locUrl.includes(baiduSharePage)) {
            if (isMobileVer()) {
                installMobileShare();
            }
            else {
                installShare();
            }
        }
        else if (locUrl.includes(baiduSyncPage)) {
            installSync();
        }
        else if (isMobileVer() && locUrl.includes(baiduMobilePage)) {
            installMobile();
        }
        else {
            installLegacy();
        }
        // 进入页面后的弹窗任务
        var bdlink = parseQueryLink(locUrl); // 解析url中的秒传链接
        if (bdlink) {
            // 解析到秒传链接, 弹出转存窗口
            swalInstance.inputView(bdlink);
        }
        else if (!GM_getValue(updateInfoVer + "_no_first"))
            // 检查是否首次运行, 若是则弹出更新信息窗口
            swalInstance.updateInfo(function () {
                GM_setValue(updateInfoVer + "_no_first", true);
            });
        // 预先绑定好按钮事件
        $(document).on("click", "#copy_fail_list", function (btn) {
            var listText = "";
            for (var _i = 0, _a = swalInstance.parseResult.failList; _i < _a.length; _i++) {
                var item = _a[_i];
                listText += item.path + "\n";
            }
            GM_setClipboard(listText);
            btn.target.innerText = "复制成功";
        }); // 失败文件列表复制
        $(document).on("click", "#copy_success_list", function (btn) {
            var listText = "";
            for (var _i = 0, _a = swalInstance.parseResult.successList; _i < _a.length; _i++) {
                var item = _a[_i];
                listText += item.path + "\n";
            }
            GM_setClipboard(listText);
            btn.target.innerText = "复制成功";
        }); // 成功文件列表复制
        $(document).on("click", "#copy_fail_branch_list", function (btn) {
            var ele = $(btn.target);
            GM_setClipboard(ele
                .parents("details.mzf_details_branch")
                .next()[0]
                .innerText.replace(/\n\n/g, "\n"));
            btn.target.innerText = "复制成功";
        }); // 失败文件分支列表复制
        try {
            // 添加油猴插件菜单按钮
            GM_registerMenuCommand("🕮 版本信息", function () {
                swalInstance.updateInfo(function () { });
            });
            GM_registerMenuCommand("⚙ 工具设置", function () {
                swalInstance.settingView();
            });
            GM_registerMenuCommand("⚡生成秒传(输入文件路径)", function () {
                swalInstance.genView();
            });
        }
        catch (_) {
            console.info("%s version: %s 插件菜单添加失败, 使用的插件不支持GM_registerMenuCommand", TAG, version);
        }
    };
    // 绑定入口函数到dom事件
    var giveUpTime = Date.now() + 30000;
    function tryLoad() {
        if (["interactive", "complete"].includes(document.readyState)) {
            load();
        }
        else if (giveUpTime > Date.now()) {
            setTimeout(tryLoad, 100);
        }
        else {
            console.warn('插件添加失败');
        }
    }
    tryLoad();
}
 
;// CONCATENATED MODULE: ./src/common/injectStyle.tsx
/*
 * @Author: mengzonefire
 * @LastEditors: tousakasp
 * @Description: 样式注入模块
 */
 
 
 
 
 
 
 
/**
 * @description: 注入脚本样式
 */
function injectStyle() {
    // 注入自定义样式
    GM_addStyle((app_default()));
    GM_addStyle((css_app_default()));
    if (isMobileVer()) {
        GM_addStyle((mobile_app_default()));
    }
    var swalThemes = GM_getValue("swalThemes") || "Default"; // sweetAlert的主题(css), 默认为Default
    var ThemesCss = GM_getValue("" + swalCssVer + swalThemes); // 从缓存获取非默认主题的css代码
    if (ThemesCss) {
        GM_addStyle(ThemesCss);
    }
    else {
        getThemesCss(swalThemes); // 未找到缓存, fallback到下载css代码
        return;
    }
    loaderBaidu();
}
/**
 * @description: 下载并注入对应主题的css样式代码, 会将css代码缓存本地
 * @param {string} swalThemes 主题包名
 */
function getThemesCss(swalThemes) {
    ajax({
        url: extCssUrl[swalThemes],
        method: "GET",
    }, function (data) {
        var ThemesCss = data.responseText;
        if (ThemesCss.length < 100) {
            showAlert(appError.SwalCssInvalid +
                ("\n\u9519\u8BEF\u6570\u636E:" + swalThemes + " InvalidCss:\n" + ThemesCss));
            GM_setValue("swalThemes", "Default");
            loaderBaidu();
            return;
        } // 返回data数据长度过小, 判定为无效样式代码
        GM_setValue("" + swalCssVer + swalThemes, ThemesCss); // 缓存css代码
        GM_addStyle(ThemesCss); // 注入css
        loaderBaidu();
    }, function (statusCode) {
        showAlert(appError.SwalCssErrReq + ("#" + statusCode));
        GM_setValue("swalThemes", "Default");
        loaderBaidu();
    });
}
 
;// CONCATENATED MODULE: external "Base64"
const external_Base64_namespaceObject = Base64;
;// CONCATENATED MODULE: ./src/app.tsx
 
 
/**
 * @description: 主函数入口
 */
function app_app() {
    external_Base64_namespaceObject.Base64.extendString();
    injectStyle();
}
function acquireAccessToken() {
    if (document.location.pathname === "/oauth/2.0/login_success") {
        var request = GM_getValue("accessTokenRequest");
        if (request.startsWith("request:")) {
            var requestId = request.substring(8);
            var match = document.location.hash.match(/&access_token=([^ =&]+)&/);
            if (match) {
                if (confirm("检测到授权码，是否采用？ (也可以手动复制此窗口url粘贴至授权码输入栏)")) {
                    GM_setValue("accessTokenRequest", "accessToken:" + requestId + ":" + match[1]);
                    //console.info("access-token = " + match[1]);
                }
            }
        }
    }
}
// 广告拦截插件会导致脚本报错跳出, 网页卡死, 故加入异常处理
try {
    if (document.location.host === "openapi.baidu.com") {
        acquireAccessToken();
    }
    else {
        app_app();
    }
}
catch (error) {
    console.log(error);
}
 
})();
 
/******/ })()
;