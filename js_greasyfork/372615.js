// ==UserScript==
// @name        隐藏微信文章视频、音乐播放器
// @namespace   reation date:2018年9月26日；author:zhangtao
// @description 隐藏微信文章音乐播放器便于直接复制文章内容
// @version     1.1
// @grant       none
// @match        https://mp.weixin.qq.com/s?*
// @match        https://mp.weixin.qq.com/s/*
// @downloadURL https://update.greasyfork.org/scripts/372615/%E9%9A%90%E8%97%8F%E5%BE%AE%E4%BF%A1%E6%96%87%E7%AB%A0%E8%A7%86%E9%A2%91%E3%80%81%E9%9F%B3%E4%B9%90%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/372615/%E9%9A%90%E8%97%8F%E5%BE%AE%E4%BF%A1%E6%96%87%E7%AB%A0%E8%A7%86%E9%A2%91%E3%80%81%E9%9F%B3%E4%B9%90%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==
var css = document.createElement("style");
css.type = "text/css";
css.innerHTML = "iframe,.appmsg_card_context {display: none !important;};";
document.head.appendChild(css);