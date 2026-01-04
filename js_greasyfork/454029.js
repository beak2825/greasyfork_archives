// ==UserScript==
// @name         腾讯视频暂停广告屏蔽
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  可以屏蔽腾讯视频暂停时的广告
// @author       五等份的商鞅
// @match        *://*/
// @match        *://*/*
// @match        *://*/*/*
// @match        *://*/*/*/*
// @match        *://*/*/*/*/*
// @icon         https://cas.pxc.jx.cn/lyuapServer/favicon.ico
// @grant        none
// @license     GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/454029/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E6%9A%82%E5%81%9C%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/454029/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E6%9A%82%E5%81%9C%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let tid=setInterval(
        function(){
            document.querySelector('.txp_zt').style.display='none'
            document.querySelector('.txp_zt').style.display==='none'&&clearInterval(tid)
        },3000)
})();