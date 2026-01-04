// ==UserScript==
// @name         Bilibili直播网页全屏下方礼物栏删除
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  Bilibili网页全屏时删除下方礼物栏
// @author       You
// @match        https://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463007/Bilibili%E7%9B%B4%E6%92%AD%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E4%B8%8B%E6%96%B9%E7%A4%BC%E7%89%A9%E6%A0%8F%E5%88%A0%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/463007/Bilibili%E7%9B%B4%E6%92%AD%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E4%B8%8B%E6%96%B9%E7%A4%BC%E7%89%A9%E6%A0%8F%E5%88%A0%E9%99%A4.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

(function() {
    let waitLoad=setInterval(()=>{$('#full-screen-interactive-wrap > #gift-control-vm-new').remove();},2500)

})();