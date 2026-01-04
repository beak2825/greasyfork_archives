// ==UserScript==
// @name         不进入B站直播活动页
// @namespace    http://blog.playtbsxys.top
// @version      0.1
// @description  不进入直播活动页
// @author       xys20071111
// @match        *://live.bilibili.com/1*
// @match        *://live.bilibili.com/2*
// @match        *://live.bilibili.com/3*
// @match        *://live.bilibili.com/4*
// @match        *://live.bilibili.com/5*
// @match        *://live.bilibili.com/6*
// @match        *://live.bilibili.com/7*
// @match        *://live.bilibili.com/8*
// @match        *://live.bilibili.com/9*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464075/%E4%B8%8D%E8%BF%9B%E5%85%A5B%E7%AB%99%E7%9B%B4%E6%92%AD%E6%B4%BB%E5%8A%A8%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/464075/%E4%B8%8D%E8%BF%9B%E5%85%A5B%E7%AB%99%E7%9B%B4%E6%92%AD%E6%B4%BB%E5%8A%A8%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log(location.href.includes('live.bilibili.com') && !location.href.includes('blanc'))
    if (location.href.includes('live.bilibili.com') && !location.href.includes('blanc')) {
         const room = location.href.split('/').slice(-1)[0].split('?')[0]
         window.location.href = 'https://live.bilibili.com/blanc/' + room
    }
})();