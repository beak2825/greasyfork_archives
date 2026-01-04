// ==UserScript==
// @name         黑白直播优化
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  删除右侧弹幕栏，视频区域居中、放大，隐藏比分显示
// @author       yt
// @match        *://www.heibaizhibo.com/live/*
// @match        *://www.heibaitiyu.com/live/*
// @match        *://www.365heibai.com/live/*
// @match        *://www.hbzb666.com/live/*
// @match        *://www.heibai999.com/live/*
// @match        *://www.hbzb999.com/live/*
// @require      http://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/426943/%E9%BB%91%E7%99%BD%E7%9B%B4%E6%92%AD%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/426943/%E9%BB%91%E7%99%BD%E7%9B%B4%E6%92%AD%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
/* globals $*/

(function() {
    'use strict';
    window.onload = function() {
        //删除右侧弹幕栏
        $('.boxright1').remove();

        //视频区域居中
        $('.boxleft1').css('margin-right', '0px');

        //视频区域放大
        $('.video-box').css('height', '900px');

        //隐藏比分显示
        $('.score').remove();
    }
})();