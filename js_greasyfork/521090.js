// ==UserScript==
// @name         【敬谊平台】Jingyi TV 阻止关闭页面
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  阻止上传文件期间关闭网页，防止文件断传。
// @author       明灯花月夜
// @match        https://cma.jingyi.tv/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521090/%E3%80%90%E6%95%AC%E8%B0%8A%E5%B9%B3%E5%8F%B0%E3%80%91Jingyi%20TV%20%E9%98%BB%E6%AD%A2%E5%85%B3%E9%97%AD%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/521090/%E3%80%90%E6%95%AC%E8%B0%8A%E5%B9%B3%E5%8F%B0%E3%80%91Jingyi%20TV%20%E9%98%BB%E6%AD%A2%E5%85%B3%E9%97%AD%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';



 // 监听页面关闭事件
    window.addEventListener('beforeunload', function(e) {

            // 设置返回值以显示浏览器默认的确认对话框
            (e || window.event).returnValue = '是否要离开此页面，你的上传可能还未保存';
            // 对于Firefox需要设置returnValue
            return '是否要离开此页面，你的上传可能还未保存';

    });
})();
