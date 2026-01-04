// ==UserScript==
// @name             扇贝单词增强
// @name:en          Shanbay Enhance
// @description      扇贝单词功能增强，带来更好的背单词体验。❤单词总结释义遮挡❤隐藏例句翻译❤自定义单词例句字体❤自定义功能快捷键❤专注模式/深色模式
// @description:en   More function for Shanbay.
// @version          0.1.9
// @author           ZiuChen
// @namespace        https://greasyfork.org/zh-CN/users/605474
// @icon             https://fastly.jsdelivr.net/gh/ZiuChen/ZiuChen@main/avatar.jpg
// @source           https://github.com/ZiuChen/Shanbay-Enhance.git
// @supportURL       https://github.com/ZiuChen/Shanbay-Enhance.git
// @match            https://www.shanbay.com/*
// @match            https://web.shanbay.com/wordsweb/*
// @require          https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @require          https://cdn.bootcdn.net/ajax/libs/toastr.js/latest/js/toastr.min.js
// @license          MIT
// @downloadURL https://update.greasyfork.org/scripts/437942/%E6%89%87%E8%B4%9D%E5%8D%95%E8%AF%8D%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/437942/%E6%89%87%E8%B4%9D%E5%8D%95%E8%AF%8D%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==


/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./package.json":
/***/ ((module) => {

module.exports = JSON.parse('{"name":"shanbay-enhance","version":"0.1.9","description":"More function for Shanbay.","main":"userscript.js","scripts":{"dev":"webpack --mode development --config config/webpack.config.dev.js","build":"webpack --mode production --config config/webpack.config.prod.js"},"repository":{"type":"git","url":"https://github.com/ZiuChen/Shanbay-Enhance.git"},"author":"ZiuChen","license":"MIT","bugs":{"url":"https://github.com/ZiuChen/Shanbay-Enhance/issues"},"homepage":"https://github.com/ZiuChen/Shanbay-Enhance#readme","devDependencies":{"@babel/core":"^7.16.7","babel-loader":"^8.2.3","userscript-metadata-webpack-plugin":"^0.1.1","webpack":"^5.65.0","webpack-cli":"^4.9.1","webpack-livereload-plugin":"^3.0.2","webpack-merge":"^5.8.0"},"dependencies":{}}');

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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

;// CONCATENATED MODULE: ./src/style/CommonStyle.js
const style =
/* CSS */
`
/* switch  */
.switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 34px;
}

.switch input {display:none;}

.slider {
    position: absolute;
    cursor: pointer;
    height: 25px;
    width: 45px;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
}

.slider:before {
    position: absolute;
    content: "";
    height: 19px;
    width: 19px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    -webkit-transition: .3s;
    transition: .3s;
}

input:checked + .slider {
    background-color: #209e85;
}

input:focus + .slider {
    box-shadow: 0 0 1px #209e85;
}

input:checked + .slider:before {
    -webkit-transform: translateX(20px);
    -ms-transform: translateX(20px);
    transform: translateX(20px);
}

.slider.round {
    border-radius: 34px;
}

.slider.round:before {
    border-radius: 50%;
}

/* toastr position */
.toastr-center {
    top: 50%;
    left: 50%;
    margin-top: -30px;
    margin-left: -150px;
}

/* config input text */
input[type=text] {
    width: 220px;
    border: 1px solid #ccc;
    background-color: #fff;
    height: 30px;
    margin-top: 4px;
    line-height: 30px;
}

input[id=config-fonts-choice-tmp] {
    margin-left: 10px;
}

input[id=config-fonts-selector] {
    width: 450px;
}

button[class~=short-keys] {
    height: 25px;
    padding-right: 5px;
    padding-left: 5px;
    margin-top: 5px;
    margin-right: 10px;
    cursor: pointer;
    border: 1px solid #ccc;
}

button:focus {
    background-color: #ccc;
}

button[class~=settingbutton] {
    height: 25px;
    padding-right: 5px;
    padding-left: 5px;
    margin-top: 5px;
    margin-right: 20px;
    cursor: pointer;
    border: 1px solid #ccc;
}

.short-keys-wrap {
    width: 1000px;
}

/* hide translation */
.hideTrans {
    color: #cccccc;
    background-color: #cccccc;
}

.removeTrans {
    display: none;
}

.showTrans {
    color: black;
    background-color: ;
}

`;
/* harmony default export */ const CommonStyle = (style);
;// CONCATENATED MODULE: ./src/common/LoadUrl.js


function LoadUrl() {
  const cssUrl = [{
    name: `toastr`,
    url: `https://cdn.bootcdn.net/ajax/libs/toastr.js/latest/toastr.min.css`
  }];
  cssUrl.forEach(item => {
    $("head").append(`<link href="${item.url}" rel="stylesheet">`);
  });
  $("head").append(`<style class="common-style">${CommonStyle}<style>`);
}

/* harmony default export */ const common_LoadUrl = (LoadUrl);
;// CONCATENATED MODULE: ./src/common/SendRequest.js
async function sendRequest(url, callBack, options) {
  let res = await fetch(url, options).then(response => {
    return response.blob();
  }).then(blob => {
    return new Promise(resolve => {
      let reader = new FileReader();

      reader.onload = () => {
        let htmlData = reader.result;
        htmlData = new window.DOMParser().parseFromString(htmlData, "text/html");
        resolve(htmlData);
      };

      reader.readAsText(blob, "GBK");
    });
  }).then(response => {
    return callBack(response);
  }).catch(error => {
    console.error(error);
  });
  return res;
}

/* harmony default export */ const SendRequest = (sendRequest);
;// CONCATENATED MODULE: ./src/common/Config.js
const {
  version
} = __webpack_require__("./package.json");

const fonts = ["", "宋体", "华文中宋", "思源宋体 CN", "微软雅黑", "等线", "仿宋"];
const exampleHideType = ["隐藏并占位", "隐藏并移除", "不隐藏"];
const fontToggleSelectors = [{
  name: "学习页单词",
  selector: ".index_word__3nhJU",
  enable: true
}, {
  name: "详情页单词",
  selector: ".VocabPronounce_word__17Tma",
  enable: true
}, {
  name: "单词小结",
  selector: ".StudySummaryItem_studySummaryItem__k2ME0",
  enable: true
}, {
  name: "提示例句",
  selector: ".index_hint__2Z39O",
  enable: true
}, {
  name: "单词词义",
  selector: ".BayTrans_paraphrase__2JMIz",
  enable: true
}, {
  name: "单词例句",
  selector: ".BayTrans_exampleBox__3CsaJ",
  enable: true
}, {
  name: "真题词义",
  selector: ".index_name__1gkfJ",
  enable: true
}, {
  name: "真题例句",
  selector: ".index_left__2SYuy",
  enable: true
}, {
  name: "学习页选项",
  selector: ".index_btnBox__pXO_l",
  enable: false
}, {
  name: "音标",
  selector: ".Pronounce_phonetic__1bcqt, .index_phonetic__o-RcB",
  enable: false
}, {
  name: "模块前说明文本（单词解释/真题例句）",
  selector: ".span1",
  enable: false
}];
const shortcutKeys = [{
  id: "config-keycode-word-pronunce-uk",
  name: "单词发音（英）",
  able: true,
  showKeys: ["Numpad0", "UNSET"],
  keyCodes: [96, 0]
}, {
  id: "config-keycode-word-pronunce-us",
  name: "单词发音（美）",
  able: true,
  showKeys: ["Numpad3", "UNSET"],
  keyCodes: [99, 0]
}, {
  id: "config-keycode-example-pronunce",
  name: "例句发音",
  able: true,
  showKeys: ["Numpad4", "UNSET"],
  keyCodes: [100, 0]
}, {
  id: "config-keycode-example-pronunce-real-question",
  name: "真题例句发音",
  able: true,
  showKeys: ["Numpad5", "UNSET"],
  keyCodes: [101, 0]
}, {
  id: "config-keycode-summary-toggle",
  name: "小结释义遮挡",
  able: true,
  showKeys: ["Enter", "UNSET"],
  keyCodes: [13, 0]
}, {
  id: "config-keycode-collins-toggle",
  name: "切换柯林斯词典",
  able: true,
  showKeys: ["Numpad6", "UNSET"],
  keyCodes: [102, 0]
}, {
  id: "config-keycode-toggle-example",
  name: "显示/隐藏例句翻译",
  able: true,
  showKeys: ["Enter", "UNSET"],
  keyCodes: [13, 0]
}];
const config = [{
  content: "深色模式：",
  id: "config-darkmode",
  default: false,
  type: "show",
  name: "choice"
}, {
  content: "单词总结释义遮挡：",
  id: "config-summary",
  default: true,
  type: "show",
  name: "choice"
}, {
  content: "单词总结自动发音：",
  id: "config-silp-pronunce",
  default: true,
  type: "show",
  name: "choice"
}, {
  content: "部分字体修改：",
  id: "config-fonts",
  default: true,
  type: "show",
  name: "choice-question",
  info: "开启后，单词、释义、例句的字体将会被修改"
}, {
  content: "选择使用的字体：",
  id: "config-fonts-choice",
  default: "宋体",
  type: "show",
  name: "select"
}, {
  content: "修改选择器：",
  id: "config-fonts-selector",
  default: JSON.stringify(fontToggleSelectors),
  type: "show",
  name: "input",
  info: "自定义修改页面中哪些元素的字体，务必以最小化形式填回。"
}, {
  content: "快捷键增强：",
  id: "config-shortkey",
  default: "true",
  type: "show",
  name: "choice-question",
  info: "开启后，左键点击以编辑快捷键，右键点击以移除快捷键"
}, {
  content: "自定义快捷键：",
  id: "config-shortkey-keycode",
  default: JSON.stringify(shortcutKeys),
  type: "show",
  name: "select"
}, {
  content: "例句翻译隐藏：",
  id: "config-example-hide",
  default: "隐藏并占位",
  type: "show",
  name: "radio"
}, {
  content: "移除笔记栏：",
  id: "config-note-remove",
  default: true,
  type: "show",
  name: "choice"
}, {
  content: "自动进入专注模式：",
  id: "config-focus-mode",
  default: false,
  type: "show",
  name: "choice"
}, {
  content: "检查更新提示：",
  id: "config-update",
  default: true,
  type: "show",
  name: "choice"
}];
/* harmony default export */ const Config = ({
  version: version,
  config: config,
  shortcutKeys: shortcutKeys,
  fontToggleSelectors: fontToggleSelectors,
  fonts: fonts,
  exampleHideType: exampleHideType
});
;// CONCATENATED MODULE: ./src/common/Log.js
function log(msg) {
  console.log(`%c[Shanbay Enhance] ${msg}`, "color: #209e85");
}

/* harmony default export */ const Log = (log);
;// CONCATENATED MODULE: ./src/common/InitializeConfig.js



function initializeConfig() {
  Config.config.forEach(item => {
    if (localStorage.getItem(item.id) === null) localStorage.setItem(item.id, item.default);

    if (item.id === "config-shortkey-keycode") {
      let currentShortcutKeys = JSON.parse(localStorage.getItem("config-shortkey-keycode"));
      let defaultShortcutKeys = Config.shortcutKeys;
      let defaultFuntions = defaultShortcutKeys.map(defaultKey => {
        return defaultKey.id;
      });
      let currentFuntions = currentShortcutKeys.map(currentKey => {
        return currentKey.id;
      });
      let removedFunctions = currentFuntions.filter(currentFunction => {
        return defaultFuntions.indexOf(currentFunction) === -1;
      });
      let newFunctions = defaultFuntions.filter(defaultFuntion => {
        return currentFuntions.indexOf(defaultFuntion) === -1;
      }); // remove removed functions

      currentShortcutKeys.forEach((currentKey, index) => {
        if (removedFunctions.indexOf(currentKey.id) !== -1) {
          Log("remove shortKey config");
          currentShortcutKeys.splice(index, 1);
        }
      }); // add new functions

      defaultShortcutKeys.forEach((defaultKey, index) => {
        if (newFunctions.indexOf(defaultKey.id) !== -1) {
          Log("add new shortKey config");
          currentShortcutKeys.splice(index, 0, defaultKey);
        }
      });
      localStorage.setItem("config-shortkey-keycode", JSON.stringify(currentShortcutKeys));
    }
  });
}

/* harmony default export */ const InitializeConfig = (initializeConfig);
;// CONCATENATED MODULE: ./src/common/CheckUpdate.js




const ScriptID = "437942";
const GreasyUrl = `https://greasyfork.org/zh-CN/scripts/${ScriptID}`;

async function CheckUpdate() {
  Log(`script loaded: ${Config.version}`);
  if (window.location.hash !== "#/study/entry") return;
  InitializeConfig();
  SendRequest(GreasyUrl, obj => {
    return obj.querySelectorAll(".script-show-version>span")[1].textContent;
  }).then(res => {
    let weightRemote = 0;
    let weightNow = 0;
    res.split(".").reverse().forEach((value, index) => {
      weightRemote += (index + 1) * Math.pow(100, index + 1) * value;
    });
    Config.version.split(".").reverse().forEach((value, index) => {
      weightNow += (index + 1) * Math.pow(100, index + 1) * value;
    });

    if (weightRemote > weightNow) {
      Log("need update");
      toastr.options = {
        timeOut: 999999999,
        onclick: () => {
          location.href = `${GreasyUrl}/code/${ScriptID}.user.js`;
        }
      };
      toastr.warning(`有新版本：${res}，点击更新脚本。`, `Shanbay Enhance`);
    } else {
      Log("version Checked");
      if (localStorage.getItem("config-update") !== "true") return;
      toastr.options = {
        timeOut: 1000
      };
      toastr.success(`版本已是最新：${Config.version}`, `Shanbay Enhance`);
    }
  });
}

/* harmony default export */ const common_CheckUpdate = (CheckUpdate);
;// CONCATENATED MODULE: ./src/function/FocusMode.js
function focusMode() {
  if (localStorage.getItem("config-focus-mode") === "false") {
    $(".Nav_nav__3kyeO").show();
    $(".Footer_footerWrap__L4iuD").show();
    $(".Layout_page__2Wedt").css("padding-bottom", "");
  } else if (localStorage.getItem("config-focus-mode") === "true") {
    $(".Nav_nav__3kyeO").hide();
    $(".Footer_footerWrap__L4iuD").hide();
    $(".Layout_page__2Wedt").css("padding-bottom", "0px");

    if (window.location.hash === "#/study/entry") {
      toastr.options = {
        onclick: () => {
          location.hash = "#/setting";
        }
      };
      toastr.info("专注模式已开启", "Shanbay Enhance");
    }
  }
}

/* harmony default export */ const FocusMode = (focusMode);
;// CONCATENATED MODULE: ./src/style/DarkStyle.js
const darkStyle =
/* CSS */
`
    /* Nav Bar */
    .Nav_nav__3kyeO {
        background-color: rgb(31, 125, 105);
    }

    .Nav_nav__3kyeO .Nav_container__sBZA1 .Nav_itemsWrapper__3FUxo .Nav_item__TffFb {
        text-decoration-color: initial;
        color: rgb(187, 222, 212);
    }

    .searchContainer {
        background-color: transparent;
        border-color: rgba(49, 52, 54, 0.7);
    }

    .searchContainer .input {
        outline-color: initial;
        border-color: initial;
        background-color: transparent;
        color: rgb(236, 232, 226);
    }

    .Nav_nav__3kyeO .Nav_container__sBZA1 .Nav_rightWrapper__1myNk .Nav_hotkey__35TKx {
        color: rgb(236, 232, 226);
    }

    .index_loginWrap__9lXnS .index_shortInfo__2I1h4 .index_nickName__H__xF {
        color: rgb(236, 232, 226);
    }

    /* Second Nav Bar */
    .SubNav_subnav__1HR8R .SubNav_container__1zXeP .SubNav_itemsWrapper__1mM4u .SubNav_item__167K_.SubNav_active__MC6yN {
        color: rgb(109, 224, 199);
        border-bottom-color: rgb(40, 164, 138);
    }

    .SubNav_subnav__1HR8R .SubNav_container__1zXeP .SubNav_itemsWrapper__1mM4u .SubNav_item__167K_ {
        text-decoration-color: initial;
        color: rgb(170, 162, 149);
        border-bottom-color: transparent;
    }

    /* Page */
    .index_appLoading__8ds2m {
        background-color: rgb(31, 33, 34);
    }

    .Layout_page__2Wedt {
        background-color: rgb(31, 33, 34);
    }

    body {
        color: rgba(236, 232, 226, 0.85);
        background-color: rgb(25, 26, 27);
    }

    .study-page {
        color: rgba(236, 232, 226, 0.85);
        background-color: rgb(25, 26, 27);
    }

    .index_content__1XOlo, .index_title__1zZFT {
        color: rgb(236, 232, 226);
    }

    .index_title__1zZFT {
        border-right-color: rgb(59, 63, 65);
    }

    .index_option__1CVr2 {
        border-color: rgb(59, 63, 65);
    }

    .index_option__1CVr2.index_green__2lFgU:hover {
        background-color: rgb(31, 125, 105);
    }

    .index_option__1CVr2.index_red__VSPTN:hover {
        background-color: rgb(157, 12, 18);
    }

    .index_progress__1aCBt {
        border-color: rgb(57, 62, 63);
    }

    .index_opt__V_oeM:nth-child(1) {
        color: rgb(236, 232, 226) !important;
        background-color: rgb(31, 125, 105) !important;
    }

    .index_opt__V_oeM:nth-child(2) {
        color: rgb(192, 185, 175) !important;
        background-color: rgb(31, 32, 33) !important;
    }

    .index_opt__V_oeM:nth-child(3) {
        color: rgb(236, 232, 226) !important;
        background-color: rgb(197, 120, 11) !important;
    }

    .index_hint__2Z39O {
        color: rgb(192, 185, 175);
        background-color: rgb(35, 36, 38);
        border-color: rgb(59, 63, 65);
    }

    .index_hint__2Z39O .highlight {
        color: rgb(192, 185, 175);
    }

    /* Content Page */
    .index_wrap__2PaUx {
        background-image: initial;
        background-color: rgb(25, 26, 27);
    }

    .index_main__3lz1F {
        color: rgb(203, 197, 188);
    }

    .index_name__1gkfJ {
        color: rgb(203, 197, 188);
    }

    .index_name__AwHP3 {
        background-color: rgb(31, 33, 34);
    }

    .index_from__6aBoj, .index_name__AwHP3 {
        color: rgb(190, 183, 172);
    }

    .AppletTip_appletTip__2U_Sv {
        color: rgb(198, 163, 100);
        background-color: rgb(63, 54, 9);
        border-color: rgb(106, 74, 13);
    }

    .Message_message__w-TNe.alert {
        color: rgb(198, 163, 100);
        border-color: rgb(106, 74, 13);
        border-top-color: rgb(106, 74, 13);
        border-right-color: rgb(106, 74, 13);
        border-bottom-color: rgb(106, 74, 13);
        border-left-color: rgb(106, 74, 13);
        background-color: rgb(63, 54, 9);
    }

    .index_tabs__1CVfU .index_switch__3XPdt .index_active__1bHoy {
        border-color: rgb(59, 63, 65) rgb(59, 63, 65) rgb(49, 52, 54);
        border-top-color: rgb(59, 63, 65);
        border-right-color: rgb(59, 63, 65);
        border-bottom-color: rgb(49, 52, 54);
        border-left-color: rgb(59, 63, 65);
        color: rgb(88, 218, 189);
    }

    .index_tabs__1CVfU .index_switch__3XPdt .index_tab__37Cha {
        border-color: transparent transparent rgb(59, 63, 65) !important;
        border-top-color: transparent !important;
        border-right-color: transparent;
        border-bottom-color: rgb(59, 63, 65) !important;
        border-left-color: transparent !important;
    }

    .index_tabs__1CVfU .index_switch__3XPdt {
        border-bottom-color: rgb(59, 63, 65);
    }

    .BayTrans_container__PDsgF .BayTrans_paraphrase__2JMIz {
        color: rgb(203, 197, 188);
    }

    h1, h2, h3, h4, h5, h6 {
        color: rgba(236, 232, 226, 0.85);
    }

    /* Spell Page */
    .index_mask__2HUE0 {
        background-color: rgb(25, 26, 27);
    }

    .index_wrapper__2tUTe .index_footer__cTylk input {
        border-color: rgb(56, 61, 62);
        background-color: rgb(29, 30, 31);
        caret-color: rgb(88, 218, 189);
    }

    .index_wrapper__2tUTe .index_main__1_DrK {
        background-color: rgb(25, 26, 27);
    }

    /* Summary Page */
    .StudySummaryItem_studySummaryItem__k2ME0 {
        border-color: rgb(63, 69, 70);
    }

    .StudySummaryItem_studySummaryItem__k2ME0.wrong {
        background-color: rgb(55, 23, 22);
    }

    .StudySummaryItem_studySummaryItem__k2ME0.right {
        background-color: rgb(42, 60, 24);
    }

    input:checked + .slider {
        background-color: rgb(31, 125, 105);
    }

    /* Search Page */
    .Layout_page__2Wedt .Layout_main__2_zw8 {
        background-color: rgb(25, 26, 27);
    }

    /* Word Study Page */
    .index_title__nQoBd {
        color: rgb(203, 197, 188);
    }

    .DailyTask_item__3qF5E .DailyTask_num__1GeJP {
        color: rgb(203, 197, 188);
    }

    .Book_book__2zLyg .Book_right__1bR8n .Book_title__32iYk .Book_name__1-4Q1 {
        color: rgb(203, 197, 188);
    }

    .Book_book__2zLyg .Book_right__1bR8n .Book_timeWrapper__1RYvh .Book_time__1RNcG {
        color: rgb(203, 197, 188);
    }

    .index_status__15KG5 {
        background-color: rgb(28, 29, 30);
    }

    .Book_book__2zLyg .Book_right__1bR8n .Book_prog__2AVmh {
        background-color: rgb(33, 35, 37);
    }

    .index_author__125n7, .index_content__2necR, .index_translation__2qOVy {
        color: rgb(203, 197, 188);
    }

    /* Book Page */
    .index_container__2E1XM {
        background-color: rgb(25, 26, 27);
    }

    .index_container__YmQjX .index_bookBox__Pb-ea {
        background-color: rgb(28, 29, 30);
    }

    .index_container__2u7Lc .index_listBox__3Xp7y .index_bookBox__2iInd {
        background-color: rgb(28, 29, 30);
    }

    .index_progress__3dDPY {
        background-color: rgb(31, 33, 34);
    }

    .index_container__2u7Lc .index_listBox__3Xp7y .index_bookBox__2iInd .index_content__2fjn3 .index_handleBox__6gJAw .index_handle__1c1p9 {
        background-color: rgb(20, 55, 49);
        color: rgb(88, 218, 189);
    }

    /* New Words Page */
    .Nav_list-item__1GYMX.is-expanded {
        background-color: rgb(28, 29, 30);
    }
    .Nav_list-item__1GYMX {
        background-color: rgb(28, 29, 30);
    }

    .ListEmptyTip_listEmptyTip__35OIc {
        background-color: rgb(28, 29, 30);
    }

    .ChoicesSelect_choicesSelect__21-Ji .ChoicesSelect_select__acw6- {
        background-color: rgb(25, 26, 27);
    }

    .CollectionExamBooter_collectionExamBooter__2Mt8z {
        background-color: rgb(31, 32, 33);
    }

    .CollectionExamBooter_collectionExamBooter__2Mt8z .CollectionExamBooter_beginBtn__tC0NS {
        display: block;
        width: 100%;
        margin-top: 18px;
        height: 46px;
        border-radius: 4px;
        background-color: #28bea0;
        font-size: 18px;
        font-weight: 500;
        color: #fff;
    }

    .index_pageCollection__3Rh5y .index_batchUploadBtn__37bsL {
        border-color: rgb(38, 153, 128);
        background-color: rgb(25, 26, 27);
        color: rgb(88, 218, 189);
    }

    /* Setting Page */
    .SettingContainer_item__3RKJY .SettingContainer_title__1IBOy {
        color: rgb(203, 197, 188);
    }

    .SettingContainer_item__3RKJY select {
        border-color: rgb(63, 69, 70);
        background-color: rgb(25, 26, 27);
    }

    input[type="text"] {
        border-color: rgb(63, 69, 70);
        background-color: rgb(25, 26, 27);
    }

    button[class~="short-keys"] {
        border-color: rgb(63, 69, 70);
        background-color: rgb(25, 26, 27);
    }
    button[class~="settingbutton"] {
        border-color: rgb(63, 69, 70);
        background-color: rgb(25, 26, 27);
    }
`;
/* harmony default export */ const DarkStyle = (darkStyle);
;// CONCATENATED MODULE: ./src/function/ToggleDarkMode.js


function toggleDarkMode() {
  if (localStorage.getItem("config-darkmode") === "false") {
    $("head .dark-style").remove();
  } else if (localStorage.getItem("config-darkmode") === "true") {
    $("head").append(`<style class="dark-style">${DarkStyle}<style>`);
  }
}

/* harmony default export */ const ToggleDarkMode = (toggleDarkMode);
;// CONCATENATED MODULE: ./src/common/ConfigOperation.js


const checkString = "Shanbay Enhance Setting";

async function importConfig() {
  let input = document.createElement("input");
  input.type = "file";
  input.click();
  $(input).change(e => {
    let reader = new FileReader();

    reader.onload = res => {
      let target = res.target;

      if (target.result.indexOf(`${checkString}`) === -1) {
        toastr.error("请检查设置文件是否正确", "Shanbay Enhance");
        Log("Import aborted");
        $(input).val("");
        return;
      }

      let data = JSON.parse(target.result);
      data.forEach((config, index) => {
        if (index === 0) return;
        localStorage.setItem(config.id, config.value);
      });
      toastr.success("成功导入设置，即将刷新", "Shanbay Enhance");
      Log("Settings have been imported");
      setTimeout("location.reload()", 1000);
    };

    reader.readAsText(e.target.files[0], "utf-8");
  });
}

function exportConfig() {
  let version = Config.version;
  let timeStamp = new Date().valueOf();
  let currentConfig = [{
    check: `${checkString}`,
    version: version,
    timeStamp: timeStamp
  }];
  Config.config.forEach(config => {
    let currentConfigObj = {};
    currentConfigObj.id = config.id;
    currentConfigObj.value = localStorage.getItem(config.id);
    currentConfig.push(currentConfigObj);
  });
  currentConfig = JSON.stringify(currentConfig);
  let blob = new Blob([currentConfig], {
    type: "text/json"
  }),
      a = document.createElement("a");
  a.download = `[Shanbay Enhance] setting.json`;
  a.href = window.URL.createObjectURL(blob);
  toastr.success("成功导出设置", "Shanbay Enhance");
  setTimeout(() => {
    a.click();
  }, 1000);
  Log("Settings Exported");
}

function restoreConfig() {
  toastr.success("成功恢复初始设置，即将刷新", "Shanbay Enhance");
  setTimeout(() => {
    localStorage.clear();
    location.reload();
  }, 1000);
  Log("Settings have been reset");
}

/* harmony default export */ const ConfigOperation = ({
  importConfig: importConfig,
  exportConfig: exportConfig,
  restoreConfig: restoreConfig
});
;// CONCATENATED MODULE: ./src/common/LoadConfig.js






function loadConfig() {
  // Config Initialize
  InitializeConfig();
  if (window.location.hash !== "#/setting") return; // Update Setting List

  $(".SettingContainer_item__3RKJY").wrapAll(`<div class="defaultSettings"></div>`);
  $(".SettingContainer_setting__2aBZV").append(`<div class="scriptSettings"></div>`);
  $(".SettingContainer_setting__2aBZV").css("overflow", "auto");
  $(".SettingContainer_setting__2aBZV").css("height", "660px");
  Config.config.forEach(item => {
    function getOptions() {
      let options = "";
      let checked = "";
      if (localStorage.getItem(item.id) === "true") checked = "checked"; // Key-value is not Boolean but String

      if (item.name === "choice") {
        options += `<span class="SettingContainer_title__1IBOy">${item.content}`;
        options += `</span>`;
        options += `<input type="checkbox" id="${item.id}" ${checked}>`;
      }

      if (item.name === "choice-question") {
        options += `<span class="SettingContainer_title__1IBOy">${item.content}`;
        options += `<span class="SettingContainer_questionWrap__1nE7J">?<span class="SettingContainer_question__VM3MF">${item.info}</span></span>`;
        options += `</span>`;
        options += `<input type="checkbox" id="${item.id}" ${checked}>`;
      }

      if (item.name === "select") {
        options += `<span class="SettingContainer_title__1IBOy">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                ${item.content}</span>`;

        if (item.id === "config-fonts-choice") {
          options += `<select id="${item.id}">`;
          Config.fonts.forEach((font, index) => {
            let selected = "";
            if (localStorage.getItem("config-fonts-choice") === font) selected = "selected";
            options += `<option value="${index}" ${selected}>${font}</option>`;
          });
          options += `</select>`;
          options += `<input type="text" id="config-fonts-choice-tmp" placeholder="自定义字体">`;
        } else if (item.id === "config-shortkey-keycode") {
          let shortcutKeys;

          if (localStorage.getItem("config-shortkey-keycode") === null) {
            shortcutKeys = Config.shortcutKeys;
          } else shortcutKeys = JSON.parse(localStorage.getItem("config-shortkey-keycode"));

          options += `<span class="short-keys-wrap">`;
          shortcutKeys.forEach(key => {
            options += `${key.name}：`;
            key.showKeys.forEach((showKey, index) => {
              options += `<button class="short-keys ${key.id}" key="${key.keyCodes[index]}">${showKey}</button>`;
            });
          });
          options += `</span>`;
        }
      } else if (item.id === "config-fonts-selector") {
        options += `<span class="SettingContainer_title__1IBOy">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                ${item.content}`;
        options += `<span class="SettingContainer_questionWrap__1nE7J">?<span class="SettingContainer_question__VM3MF">${item.info}</span></span>`;
        options += `</span>`;
        options += `<input type="text" id="config-fonts-selector" placeholder="自定义选择器" value="">`;
      }

      if (item.name === "radio") {
        options += `<span class="SettingContainer_title__1IBOy">${item.content}</span>`;
        options += `<div>`;
        Config.exampleHideType.forEach((type, index) => {
          let checked = "";
          if (localStorage.getItem("config-example-hide") === type) checked = "checked";
          options += `<label><input type="radio" name="config-example-hide" value="${type}" ${checked}>${type}</label>`;
        });
      }

      return options;
    }

    if (item.type === "unshow") return;
    $(".scriptSettings").append(
    /* html */
    `
            <div class="SettingContainer_item__3RKJY">
                ${getOptions()}
            </div>`);
  });
  $(".scriptSettings").append(
  /* html */
  `
    <div class="SettingContainer_item__3RKJY">
        <span class="SettingContainer_title__1IBOy">设置选项：</span>
        <span class="SettingContainer_minititle">导出当前设置：</span>
        <button type="checkbox" class="settingbutton export-setting">Export</button>
        <span class="SettingContainer_minititle">导入已有设置：</span>
        <button type="checkbox" class="settingbutton import-setting">Import</button>
        <span class="SettingContainer_minititle">恢复初始设置：</span>
        <button type="checkbox" class="settingbutton restore-setting">Restore</button>
    </div>`);
  $(".settingbutton").click(e => {
    let operation = e.target.classList[1];
    if (operation.indexOf("export") !== -1) ConfigOperation.exportConfig();
    if (operation.indexOf("import") !== -1) ConfigOperation.importConfig();
    if (operation.indexOf("restore") !== -1) ConfigOperation.restoreConfig();
  });
  if (localStorage.getItem("config-fonts") === "false") $("#config-fonts-choice").parent().hide();
  $("#config-fonts-selector").val(localStorage.getItem("config-fonts-selector"));
  if ($("#config-fonts-choice")[0].options.selectedIndex === 0) $("#config-fonts-choice-tmp").val(localStorage.getItem("config-fonts-choice"));
  if (localStorage.getItem("config-shortkey") === "false") $(".short-keys-wrap").parent().hide();

  function leftClickCallBack(e) {
    toastr.options = {
      timeOut: 999999999,
      preventDuplicates: true
    };
    toastr.info("请按下任意键以设置快捷键", "Shanbay Enhance");
    $(document).keydown(keydownEvent => {
      // TODO: move to change() duplicated key varify lacked
      let KeyCodesConfigs = JSON.parse(localStorage.getItem("config-shortkey-keycode"));
      KeyCodesConfigs.forEach(KeyCodesConfig => {
        if (KeyCodesConfig.id === e.target.classList[1]) {
          if (KeyCodesConfig.keyCodes.indexOf(keydownEvent.keyCode) !== -1) {
            toastr.clear();
            toastr.options = {
              timeOut: 1000,
              preventDuplicates: true
            };
            toastr.error("快捷键重复", "Shanbay Enhance");
            return;
          }

          let index = KeyCodesConfig.keyCodes.indexOf(parseInt(e.target.attributes["key"].value));
          KeyCodesConfig.showKeys[index] = keydownEvent.code;
          KeyCodesConfig.keyCodes[index] = keydownEvent.keyCode;
          toastr.clear();
          $(e.target).trigger("change", {
            type: "shortKey-add",
            event: {
              clickEvent: e,
              keyDownEvent: keydownEvent
            }
          });
        }
      });
      localStorage.setItem("config-shortkey-keycode", JSON.stringify(KeyCodesConfigs));
      $(document).off("keydown");
    });
  }

  function rightClickCallBack(e) {
    e.preventDefault();
    $(e.target).trigger("change", {
      type: "shortKey-remove",
      event: {
        clickEvent: e
      }
    });
    let KeyCodesConfigs = JSON.parse(localStorage.getItem("config-shortkey-keycode"));
    KeyCodesConfigs.forEach(KeyCodesConfig => {
      if (KeyCodesConfig.id === e.target.classList[1]) {
        let index = KeyCodesConfig.showKeys.indexOf(e.target.innerText);
        KeyCodesConfig.showKeys[index] = "UNSET";
        KeyCodesConfig.keyCodes[index] = 0;
        localStorage.setItem("config-shortkey-keycode", JSON.stringify(KeyCodesConfigs));
      }
    });
  }

  $(".short-keys").click(e => {
    leftClickCallBack(e);
  });
  $(".short-keys").contextmenu(e => {
    // contextmenu handler
    rightClickCallBack(e);
  });
  $(".scriptSettings").change((e, data) => {
    localStorage.setItem(e.target.id, e.target.checked);

    if (e.target.id === "config-fonts-choice") {
      localStorage.setItem(e.target.id, Config.fonts[e.target.options.selectedIndex]);
    }

    if (e.target.id === "config-fonts-choice-tmp") {
      localStorage.setItem("config-fonts-choice", e.target.value);
      $("#config-fonts-choice-tmp").css("font-family", e.target.value);
    }

    if (e.target.id === "config-darkmode") {
      ToggleDarkMode();
    }

    if (e.target.id === "config-focus-mode") {
      FocusMode();
    }

    if (e.target.id === "config-fonts" && localStorage.getItem("config-fonts") === "false") {
      $("#config-fonts-choice").parent().hide();
      $("#config-fonts-selector").parent().hide();
    } else if (e.target.id === "config-fonts" && localStorage.getItem("config-fonts") === "true") {
      $("#config-fonts-choice").parent().show();
      $("#config-fonts-selector").parent().show();
    }

    if (e.target.id === "config-fonts-selector") {
      localStorage.setItem("config-fonts-selector", $("#config-fonts-selector").val());
    }

    if (e.target.id === "config-shortkey" && localStorage.getItem("config-shortkey") === "false") {
      $(".short-keys-wrap").parent().hide();
    } else if (e.target.id === "config-shortkey" && localStorage.getItem("config-shortkey") === "true") {
      $(".short-keys-wrap").parent().show();
    }

    if (e.target.classList[0] === "short-keys") {
      let clickEvent = data.event.clickEvent;
      let keyDownEvent = data.event.keyDownEvent;
      let newTag = ``;

      if (data.type === "shortKey-add") {
        newTag = `<button class="short-keys ${clickEvent.target.classList[1]}" key="${keyDownEvent.keyCode}">${keyDownEvent.code}</button>`;
      } else if (data.type === "shortKey-remove") {
        newTag = `<button class="short-keys ${clickEvent.target.classList[1]}" key="0">UNSET</button>`;
      }

      $(clickEvent.target).replaceWith(newTag);
      $(".short-keys").off(); // remove all listening

      $(".short-keys").click(e => {
        // Add listening again
        leftClickCallBack(e);
      });
      $(".short-keys").contextmenu(e => {
        rightClickCallBack(e);
      });
    }

    if (e.target.name === "config-example-hide") {
      localStorage.setItem("config-example-hide", e.target.defaultValue);
    }

    toastr.options = {
      timeOut: 1000,
      preventDuplicates: true
    };
    toastr.success("设置已更新", "Shanbay Enhance");
  });
}

/* harmony default export */ const LoadConfig = (loadConfig);
;// CONCATENATED MODULE: ./src/function/SummaryTranslation.js
function executeToggle(passIn, withFor) {
  if (withFor === 1) {
    for (let i = 0; i < passIn.length; i++) {
      $(passIn[i]).find("div").toggleClass("hideTrans");
    }
  } else $(passIn).find("div").toggleClass("hideTrans");
}

function toggleSummaryTranslation() {
  let wordList = $(".StudySummaryItem_content__3j9YG");

  if (localStorage.getItem("config-summary") === "true") {
    localStorage.setItem("config-summary", "false");
    executeToggle(wordList, 1);
  } else {
    localStorage.setItem("config-summary", "true");
    executeToggle(wordList, 1);
  }
}

function hideSummaryTranslation() {
  let checked = "";
  if (localStorage.getItem("config-summary") === "true") checked = "checked"; // Key-value is not Boolean but String

  const statusSwitch =
  /* html */
  `
        <div class="span" style="margin-right: 10px;">释义遮挡</div>
        <label class="switch">
            <input type="checkbox" ${checked}>
            <div class="slider round"></div>
        </label>`;
  let wordList = $(".StudySummaryItem_content__3j9YG");

  if (localStorage.getItem("config-summary") === "true") {
    executeToggle(wordList, 1);
  }

  $($(".StudySummary_studySummary__32y_I .row").get(0)).append(statusSwitch);
  $(".slider").click(function () {
    toggleSummaryTranslation();
  });

  for (let i = 0; i < wordList.length; i++) {
    $(wordList[i]).mouseenter(() => {
      if (localStorage.getItem("config-summary") === "false") return;
      executeToggle(wordList[i], 0);
    });
    $(wordList[i]).mouseleave(() => {
      if (localStorage.getItem("config-summary") === "false") return;
      executeToggle(wordList[i], 0);
    });
  }
}

/* harmony default export */ const SummaryTranslation = ({
  toggleSummaryTranslation,
  hideSummaryTranslation
});
;// CONCATENATED MODULE: ./src/function/FontToggle.js
function fontToggle() {
  if (localStorage.getItem("config-fonts") === "false") return;
  let selectors = JSON.parse(localStorage.getItem("config-fonts-selector"));
  let fontToggle =
  /* CSS */
  `
        .fontToggle {
            font-family: ${localStorage.getItem("config-fonts-choice")};
        }
    `;
  $("head").append(`<style class="fontToggle">${fontToggle}</style>`);
  selectors.forEach(selector => {
    if (selector.enable === false) return;
    $(selector.selector).addClass("fontToggle");
  });
}

/* harmony default export */ const FontToggle = (fontToggle);
;// CONCATENATED MODULE: ./src/function/NoteRemove.js
function noteRemove() {
  if (localStorage.getItem("config-note-remove") === "false") return;
  $(`h6:contains("笔记")`).parent().parent().hide();
}

/* harmony default export */ const NoteRemove = (noteRemove);
;// CONCATENATED MODULE: ./src/function/HideTranslation.js
function hideTranslation() {
  if (localStorage.getItem("config-example-hide") === "不隐藏") return;
  let en = $(".index_sentenceEn__1Qjgx"); // real question

  let cn = $(".index_sentenceCn__XJD1u");
  let example = $(".index_left__2LkyW p");

  if (localStorage.getItem("config-example-hide") === "隐藏并移除") {
    for (let i = 0; i < $(".index_sentenceEn__1Qjgx").length; i++) {
      $(en[i]).attr("title", $(cn[i]).text());
      $(en[i]).css("cursor", "pointer");
      $(en[i]).click(() => {
        $(cn[i]).toggleClass("removeTrans");
      });
    }

    $(example[0]).attr("title", $(example[1]).text());
    $(example[0]).css("cursor", "pointer");
    $(example[0]).click(() => {
      $(example[1]).toggleClass("removeTrans");
    });
    $($(".index_left__2LkyW p")[1]).toggleClass("removeTrans");
    $(".index_sentenceCn__XJD1u").toggleClass("removeTrans");
  }

  if (localStorage.getItem("config-example-hide") === "隐藏并占位") {
    for (let i = 0; i < $(".index_sentenceEn__1Qjgx").length; i++) {
      $(cn[i]).toggleClass("hideTrans");
      $(cn[i]).mouseenter(e => {
        $(e.target).toggleClass("hideTrans");
      });
      $(cn[i]).mouseleave(e => {
        $(e.target).toggleClass("hideTrans");
      });
    }

    $(example[1]).toggleClass("hideTrans");
    $(example[1]).mouseenter(e => {
      $(e.target).toggleClass("hideTrans");
    });
    $(example[1]).mouseleave(e => {
      $(e.target).toggleClass("hideTrans");
    });
  }
}

/* harmony default export */ const HideTranslation = (hideTranslation);
;// CONCATENATED MODULE: ./src/function/KeyDownFunctions.js
function wordPronunceUS() {
  // US
  $(".index_trump__3bTaM:last").click();
  $(".Pronounce_audio__3xdMh:last").click();
}

function wordPronunceUK() {
  // UK
  $(".index_trump__3bTaM:first").click();
  $(".Pronounce_audio__3xdMh:first").click();
}

function examplePronunce() {
  $(".index_icon__1IK2K").click();
}

function examplePronunceRealQuestion() {
  $(".index_audio__1mSVg:first > img").click();
}

function summaryToggle() {
  $(".slider").trigger("click");
}

function collinsToggle() {
  if ($(".index_tab__37Cha.index_active__1bHoy").html() === "扇贝单词") {
    // to Collins Dictionary
    $(".index_tabNavs__3tWev:eq(0) > p:eq(1)").click();
  } else if ($(".index_tab__37Cha.index_active__1bHoy").html() === "柯林斯词典") {
    // to Shanbay Dictionary
    $(".index_tabNavs__3tWev:eq(0) > p:eq(0)").click();
  }
}

function toggleExample() {
  // hide and remove
  if (localStorage.getItem("config-example-hide") === "隐藏并移除") {
    $($(".index_left__2LkyW p")[1]).toggleClass("removeTrans");
    $(".index_sentenceCn__XJD1u").toggleClass("removeTrans");
  } // hide and reserved


  if (localStorage.getItem("config-example-hide") === "隐藏并占位") {
    $($(".index_left__2LkyW p")[1]).toggleClass("hideTrans");
    $(".index_sentenceCn__XJD1u").toggleClass("hideTrans");
  }
}

/* harmony default export */ const KeyDownFunctions = ({
  "word-pronunce-uk": wordPronunceUK,
  "word-pronunce-us": wordPronunceUS,
  "example-pronunce": examplePronunce,
  "example-pronunce-real-question": examplePronunceRealQuestion,
  "summary-toggle": summaryToggle,
  "collins-toggle": collinsToggle,
  "toggle-example": toggleExample
});
;// CONCATENATED MODULE: ./src/common/KeyDownObserver.js


function executeFuntions(keyCode, type) {
  if (localStorage.getItem("config-shortkey") === "false") return;
  let shortcutKeys = JSON.parse(localStorage.getItem("config-shortkey-keycode"));
  shortcutKeys.forEach(config => {
    if (config.id.indexOf(type) !== -1) {
      config.keyCodes.forEach(code => {
        if (code === keyCode) {
          KeyDownFunctions[type]();
          return;
        } else return;
      });
    }
  });
}

function keyDownObserver() {
  $(document).off("keydown"); // Unbind all events first

  $(document).on("keydown", e => {
    executeFuntions(e.keyCode, "word-pronunce-uk");
    executeFuntions(e.keyCode, "word-pronunce-us");
    executeFuntions(e.keyCode, "example-pronunce");
    executeFuntions(e.keyCode, "example-pronunce-real-question");
    executeFuntions(e.keyCode, "summary-toggle");
    executeFuntions(e.keyCode, "collins-toggle");
    executeFuntions(e.keyCode, "toggle-example");
  });
}

/* harmony default export */ const KeyDownObserver = (keyDownObserver);
;// CONCATENATED MODULE: ./src/function/SlipPronunce.js
function slipPronunce() {
  if (localStorage.getItem("config-silp-pronunce") === "false") return;
  let tds = $(".StudySummaryItem_studySummaryItem__k2ME0");
  tds.each(index => {
    let item = $(tds[index]);
    let sound = item.find(".StudySummaryItem_sound__htCqt img");
    item.on("mouseenter", () => {
      sound.trigger("click");
    });
  });
}

/* harmony default export */ const SlipPronunce = (slipPronunce);
;// CONCATENATED MODULE: ./src/common/Observer.js










const commonConditions = ["study-page", "index_hint", "StudyPage_nextBtn", "StudySummary"];

function Observer() {
  const OuterTargetNode = document.getElementsByClassName("Layout_main__2_zw8")[0];
  if (typeof OuterTargetNode === "undefined") return;

  const OuterCallback = mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length === 0 || mutation.addedNodes[0].className === undefined) return;
      let currentState = mutation.addedNodes[0].className;

      if (currentState.indexOf("SettingContainer_setting") !== -1) {
        LoadConfig();
        FocusMode();
      }

      if (currentState.indexOf("row") !== -1) {
        NoteRemove();
        HideTranslation();
      }

      if (currentState.indexOf("StudySummary") !== -1) {
        SummaryTranslation.hideSummaryTranslation();
        SlipPronunce();
      }

      if (currentState.indexOf("study-page") !== -1) {
        KeyDownObserver();
      }

      commonConditions.forEach(condition => {
        if (currentState.indexOf(condition) !== -1) {
          FontToggle();
          FocusMode();
        }
      });
      if (mutation.addedNodes[0].childNodes.length === 0 || mutation.addedNodes[0].childNodes[0].className === undefined) return;

      if (mutation.addedNodes[0].childNodes[0].className.indexOf("wordBox") !== -1) {
        FontToggle();
        FocusMode();
      }
    });
  };

  const ExecuteFunctions = () => {
    if (window.location.hash === "#/study/entry") common_CheckUpdate();
    if (window.location.hash === "#/study?type=book") FocusMode();
    if (window.location.hash === "#/setting") LoadConfig();

    if (window.location.hash.indexOf("#/detail") !== -1) {
      FontToggle();
      NoteRemove();
      HideTranslation();
    }

    ToggleDarkMode();
    FocusMode();
  };

  const OuterObserver = new MutationObserver(OuterCallback);
  OuterObserver.observe(OuterTargetNode, {
    childList: true,
    subtree: true
  });
  ExecuteFunctions();
}

/* harmony default export */ const common_Observer = (Observer);
;// CONCATENATED MODULE: ./src/index.js



window.onload = () => {
  common_LoadUrl();
  common_Observer();
};
})();

/******/ })()
;