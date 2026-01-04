// ==UserScript==
// @name        删除S1论坛B站播放器
// @namespace   Violentmonkey Scripts
// @match       *://*.saraba1st.com/2b/*
// @grant       none
// @version     1.5
// @author      jがすdygk
// @description 2020/2/22 下午3:22:01
// @downloadURL https://update.greasyfork.org/scripts/396726/%E5%88%A0%E9%99%A4S1%E8%AE%BA%E5%9D%9BB%E7%AB%99%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/396726/%E5%88%A0%E9%99%A4S1%E8%AE%BA%E5%9D%9BB%E7%AB%99%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==

Array.from(document.querySelectorAll('iframe')).map(el => { if(el.src.includes('bilibili')){ el.outerHTML = el.src.replace("player.html?aid=","av").replace("player.bilibili.com","www.bilibili.com"); }}) //据说代码缩到一行执行速度更快（