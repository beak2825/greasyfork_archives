// ==UserScript==
// @name         BILIBILI BV自动转换AV
// @author       萌萌哒丶九灬书
// @description  BV2AV - 你的AV号转换助手|BV转AV|清理无用后缀|不刷新界面|支持多P视频|支持跳转评论
// @namespace    https://space.bilibili.com/1501743
// @license      GNU General Public License v3.0
// @version      0.0.6
// @create       2020-03-24
// @lastmodified 2020-07-11
// @include      /^https?:\/\/www\.bilibili\.com\/video\/[AaBbVv]+/
// @mainpage     https://greasyfork.org/zh-CN/scripts/398536/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398536/BILIBILI%20BV%E8%87%AA%E5%8A%A8%E8%BD%AC%E6%8D%A2AV.user.js
// @updateURL https://update.greasyfork.org/scripts/398536/BILIBILI%20BV%E8%87%AA%E5%8A%A8%E8%BD%AC%E6%8D%A2AV.meta.js
// ==/UserScript==

(function() {
    'use strict';
    (window.aid==undefined)?(''):(history.replaceState(null, null, `https://www.bilibili.com/video/av${window.aid}${(Number(window.p)==0 || window.p==undefined)?(''):('?p='+(Number(window.p)+1))}${(window.location.hash.substr('#', 6)=='#reply')?(window.location.hash):('')}`));
})();