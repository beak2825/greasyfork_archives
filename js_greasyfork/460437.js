// ==UserScript==
// @name         微软文字转语音-精简
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @license      AGPL-3.0
// @description  微软文字转语音-精简页面，适配新版
// @author       AiniyoMua
// @home-url     https://greasyfork.org/zh-CN/scripts/460437
// @homepageURL  https://greasyfork.org/zh-CN/scripts/460437
// @supportURL   https://greasyfork.org/zh-CN/scripts/460437/feedback
// @match        *://speech.microsoft.com/audiocontentcreation
// @match        *://speech.microsoft.com/audiocontentcreation/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgY2xhc3M9Imljb24iIHZpZXdCb3g9IjAgMCAxMDI2IDEwMjQiPjxwYXRoIGZpbGw9IiNGMjY1MjIiIGQ9Ik00ODYgMkgydjQ4NGg0ODR6Ii8+PHBhdGggZmlsbD0iIzhEQzYzRiIgZD0iTTEwMjAgMkg1MzZ2NDg0aDQ4NHoiLz48cGF0aCBmaWxsPSIjMDBBRUVGIiBkPSJNNDg2IDUzNkgydjQ4NGg0ODR6Ii8+PHBhdGggZmlsbD0iI0ZGQzIwRSIgZD0iTTEwMjAgNTM2SDUzNnY0ODRoNDg0eiIvPjwvc3ZnPg==
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/460437/%E5%BE%AE%E8%BD%AF%E6%96%87%E5%AD%97%E8%BD%AC%E8%AF%AD%E9%9F%B3-%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/460437/%E5%BE%AE%E8%BD%AF%E6%96%87%E5%AD%97%E8%BD%AC%E8%AF%AD%E9%9F%B3-%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==
// ██ 注意 注意 ██：在本脚本 设置>通用>运行时期 里选择 document-start 以获得无感知脚本加载体验
// ██ 注意 注意 ██：在本脚本 设置>通用>运行时期 里选择 document-start 以获得无感知脚本加载体验
//新版工具页面：speech.microsoft.com/audiocontentcreation
//旧版工具页面：azure.microsoft.com/zh-cn/products/cognitive-services/text-to-speech/
(function() {
const css = `
/* 屏蔽页面推广 */
.acc.landing > div:nth-child(1) > div:nth-child(2){display: none !important;}
/* 屏蔽页面推广 */
.acc.landing > div:nth-child(1) > div:nth-child(3){display: none !important;}
/* 屏蔽页面推广 */
.acc.landing > div:nth-child(1) > div:nth-child(7){display: none !important;}
/* 屏蔽页面推广 */
.acc.landing > div:nth-child(1) > div:nth-child(8) > div{display: none !important;}
/* 底部 */
div.landing-footer{display: none !important;}
/* 屏蔽页面推广 */
.acc.landing > div:nth-child(1) > section{display: none !important;}
/* 调整工具padd */
span.acc-tuning-wrapper > div:nth-child(1) {padding-top: 20px !important;padding-bottom: 0px !important;}
/* 调整顶栏高度 */
div.float-left > span {line-height: 2rem !important;}
div.float-right > span {line-height: 2rem !important;}
div.top-navbar-container {height: 2rem !important;}
div.float-right > span:nth-child(9) > button{height: 2rem !important;}
div.float-right > span:nth-child(11) > a > i {height: 2rem !important;}
/* 底部有空白，不知道怎么去除 */
html{height:99vh !important;}
/* 底部有空白，不知道怎么去除 */
.acc.landing .acc-tuning-wrapper .acc-panel-frame, .acc.landing .acc-tuning-wrapper .loading {height: calc(100vh - 3em) !important;}
/* 另一个底部空白元素 */
div.section-tutorials{display:none !important;}
`
GM_addStyle(css);
})();