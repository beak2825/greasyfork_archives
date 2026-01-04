// ==UserScript==
// @name         Wechat article desktop layout
// @name:zh-CN   微信文章桌面排版
// @name:en      Wechat article desktop layout
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description:en     Expand the article width to fit the screen.
// @description:zh-CN  使文章撑满整个屏幕。消除手机排版横向文字过少的问题。
// @author       thundermikey
// @match        https://mp.weixin.qq.com/s/*
// @grant        none
// @source       https://github.com/ThunderMikey/wechat-article-desktop-layout
// @description 使文章撑满整个屏幕。消除手机排版横向文字过少的问题。Expand the article width to fit the screen.
// @downloadURL https://update.greasyfork.org/scripts/388428/Wechat%20article%20desktop%20layout.user.js
// @updateURL https://update.greasyfork.org/scripts/388428/Wechat%20article%20desktop%20layout.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // max width of the main article body
    // pass "none" to fit the screen width
    // e.g. set_max_width("none");
    set_max_width("1200px");

    // hide QR code which might obstruct the article
    hide_qr_code();
})();

function set_max_width(maxWidth){
    var richMediaContent = document.querySelector("#page-content > div");
    richMediaContent.style.maxWidth=maxWidth;
};

function hide_qr_code(){
    document.querySelector("#js_pc_qr_code").style.visibility="hidden";
};