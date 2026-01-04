// ==UserScript==
// @name Baidu/Google搜索界面优化（AC-baidu-重定向双列优化）
// @namespace ouka2020
// @version 0.6.12
// @author Ouka2020
// @description 此脚本为"AC-baidu-重定向双列优化"的样式增强脚本，使用本脚本前需安装"AC-baidu-重定向双列优化"。
// @match *://ipv6.baidu.com/*
// @match *://www.baidu.com/*
// @match *://www1.baidu.com/*
// @match *://encrypted.google.com/search*
// @match *://*.google.com/search*
// @match *://*.google.com/webhp*
// @exclude *://*.google.com/sorry*
// @exclude *://zhidao.baidu.com/*
// @exclude *://*.zhidao.baidu.com/*
// @grant GM_addStyle
// @updateNote v0.6.12 优化打包内容。
// @updateNote v0.6.11 修正Google搜索无结果。
// @updateNote v0.6.10 修改黑暗模式下，Google文字块底色为白色的问题。
// @downloadURL https://update.greasyfork.org/scripts/425366/BaiduGoogle%E6%90%9C%E7%B4%A2%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96%EF%BC%88AC-baidu-%E9%87%8D%E5%AE%9A%E5%90%91%E5%8F%8C%E5%88%97%E4%BC%98%E5%8C%96%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/425366/BaiduGoogle%E6%90%9C%E7%B4%A2%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96%EF%BC%88AC-baidu-%E9%87%8D%E5%AE%9A%E5%90%91%E5%8F%8C%E5%88%97%E4%BC%98%E5%8C%96%EF%BC%89.meta.js
// ==/UserScript==

/* Created by TPMK, vite-plugin-monkey at 2024-01-18T14:29:29.299Z */

(function () {
  'use strict';

  var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  const googleCss = "#main #cnt,#cnt #center_col,#cnt #foot{width:95vw!important;margin:2px 12px!important}#rso>div:not(.g){grid-template-columns:unset;grid-template-areas:unset}";
  const baiduCss = "body #container.sam_newgrid #content_left{width:96vw}";
  if (/google/.test(window.location.host)) {
    _GM_addStyle(googleCss);
  }
  if (/baidu/.test(window.location.host)) {
    _GM_addStyle(baiduCss);
  }

})();