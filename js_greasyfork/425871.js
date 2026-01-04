// ==UserScript==
// @name         去除中国体育直播间小礼物刷屏
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Remove the special effects of small gifts in the zhibo live room
// @author       auko
// @match        http://v.zhibo.tv/*
// @match        https://v.zhibo.tv/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/425871/%E5%8E%BB%E9%99%A4%E4%B8%AD%E5%9B%BD%E4%BD%93%E8%82%B2%E7%9B%B4%E6%92%AD%E9%97%B4%E5%B0%8F%E7%A4%BC%E7%89%A9%E5%88%B7%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/425871/%E5%8E%BB%E9%99%A4%E4%B8%AD%E5%9B%BD%E4%BD%93%E8%82%B2%E7%9B%B4%E6%92%AD%E9%97%B4%E5%B0%8F%E7%A4%BC%E7%89%A9%E5%88%B7%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    Show.createGiftDiv = ()=>{console.log('阻止刷屏成功')};
})();