// ==UserScript==
// @name        Remove extra content when copying
// @name:en     Remove extra content when copying
// @name:zh-CN  去除网页复制小尾巴
// @name:zh-TW  去除網頁複製小尾巴
// @name:ja     コピーされたページからの冗長なコンテンツの削除
// @description        Remove extra content when you copy something from a webpage. Pass to kill most of the site
// @description:en     Remove extra content when you copy something from a webpage. Pass to kill most of the site
// @description:zh-CN  去除网页复制所出现得小尾巴,通杀大部分网站
// @description:zh-TW  去除複製網頁時所出現的多餘内容，對大部分網站有效
// @description:ja     ウェブページから何かをコピーしたときに、余分なコンテンツを削除する。サイトの大部分を殺すためのパス
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.03
// @author      wray-lee
// @license     MIT

// @downloadURL https://update.greasyfork.org/scripts/459656/Remove%20extra%20content%20when%20copying.user.js
// @updateURL https://update.greasyfork.org/scripts/459656/Remove%20extra%20content%20when%20copying.meta.js
// ==/UserScript==
(function() {
    'use strict';
//去除网页小尾巴
    [...document.querySelectorAll('*')].forEach(item=>{
    item.oncopy = function(e) {
        e.stopPropagation();
    }
});
}())