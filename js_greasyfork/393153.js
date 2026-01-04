// ==UserScript==
// @name        No Wandering
// @name:zh-CN  阻止摸鱼
// @namespace   yuandi42
// @version     0.0.1
// @grant       none
// @include     *.bilibili.com*
// @include     *hentaihand.com*
// @description Prevent  wandering. Show a dialog when you try to visit a new page, and the action is prevented.
// @description:zh-CN 防止漫游。在尝试访问新页面时弹框报警。离开摸鱼，拥抱效率！
// @downloadURL https://update.greasyfork.org/scripts/393153/No%20Wandering.user.js
// @updateURL https://update.greasyfork.org/scripts/393153/No%20Wandering.meta.js
// ==/UserScript==

(function () {
    
    alert("Go to study please, asshole:(");
    window.close();window.location = "about:blank";
})()