// ==UserScript==
// @name        获取 B 站视频封面
// @namespace   Get bilibili video cover
// @match       *://www.bilibili.com/video/*
// @match       *://m.bilibili.com/video/*
// @grant       GM_registerMenuCommand
// @grant       GM_openInTab
// @version     1.1
// @author      -
// @description 在脚本菜单里，点一下直接显示封面
// @downloadURL https://update.greasyfork.org/scripts/407076/%E8%8E%B7%E5%8F%96%20B%20%E7%AB%99%E8%A7%86%E9%A2%91%E5%B0%81%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/407076/%E8%8E%B7%E5%8F%96%20B%20%E7%AB%99%E8%A7%86%E9%A2%91%E5%B0%81%E9%9D%A2.meta.js
// ==/UserScript==

GM_registerMenuCommand('获取此视频封面', ()=>{
  GM_openInTab(document.querySelector('meta[itemprop="image"]').getAttribute('content'))
})