// ==UserScript==
// @name        移除网站置灰，自用
// @namespace   移除网站置灰
// @match       *://*.weibo.com/*
// @match       *://*.baidu.com/*
// @match       *://*.bilibili.com/*
// @match       *://*.taobao.com/*
// @match       *://*.jd.com/*
// @grant       none
// @version     1.0
// @author      fbz
// @license MIT
// @description 2022/12/2 10:27:48
// @downloadURL https://update.greasyfork.org/scripts/455823/%E7%A7%BB%E9%99%A4%E7%BD%91%E7%AB%99%E7%BD%AE%E7%81%B0%EF%BC%8C%E8%87%AA%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/455823/%E7%A7%BB%E9%99%A4%E7%BD%91%E7%AB%99%E7%BD%AE%E7%81%B0%EF%BC%8C%E8%87%AA%E7%94%A8.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
(function(){
  const css = `
    *{
      filter:none !important;
    }
  `
  /*添加样式*/
  function addStyle(css) {
    if (!css) return
    var head = document.querySelector('head');
    var style = document.createElement("style");
    style.type = 'text/css'
    style.innerHTML = css
    head.appendChild(style)
  }

  addStyle(css) // 添加样式

})()