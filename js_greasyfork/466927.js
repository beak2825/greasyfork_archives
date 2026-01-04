// ==UserScript==
// @name        屌人用的bilibili直播全屏隐藏边栏
// @namespace   Violentmonkey Scripts
// @match       https://live.bilibili.com/*
// @grant       none
// @version     1.0.0
// @author      AndyF
// @description 给一个不用 Stylish/Stylus 的屌朋友写的
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466927/%E5%B1%8C%E4%BA%BA%E7%94%A8%E7%9A%84bilibili%E7%9B%B4%E6%92%AD%E5%85%A8%E5%B1%8F%E9%9A%90%E8%97%8F%E8%BE%B9%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/466927/%E5%B1%8C%E4%BA%BA%E7%94%A8%E7%9A%84bilibili%E7%9B%B4%E6%92%AD%E5%85%A8%E5%B1%8F%E9%9A%90%E8%97%8F%E8%BE%B9%E6%A0%8F.meta.js
// ==/UserScript==

var link = document.createElement("link");
link.rel = "stylesheet";
link.type = "text/css";
link.href = "https://userstyles.world/api/style/9980.user.css";
document.getElementsByTagName("head")[0].appendChild(link);