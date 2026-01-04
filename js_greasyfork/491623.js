// ==UserScript==
// @name        好看视频阻止自动播放
// @namespace   Violentmonkey Scripts
// @match       *://haokan.baidu.com/*
// @grant       none
// @version     1.0
// @author      清洄KAKA
// @license     MIT
// @description  关闭好看视频自动连播
// @downloadURL https://update.greasyfork.org/scripts/491623/%E5%A5%BD%E7%9C%8B%E8%A7%86%E9%A2%91%E9%98%BB%E6%AD%A2%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/491623/%E5%A5%BD%E7%9C%8B%E8%A7%86%E9%A2%91%E9%98%BB%E6%AD%A2%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==
// 获取所有的视频元素
document.querySelector('.art-switch-btn').click();
