// ==UserScript==
// @name         林木教育解除答题页面复制限制
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  功能单一，脚本简单
// @author       zishiluojin
// @include      *://wx.linmujiaoyu.com/test/*
// @downloadURL https://update.greasyfork.org/scripts/414843/%E6%9E%97%E6%9C%A8%E6%95%99%E8%82%B2%E8%A7%A3%E9%99%A4%E7%AD%94%E9%A2%98%E9%A1%B5%E9%9D%A2%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/414843/%E6%9E%97%E6%9C%A8%E6%95%99%E8%82%B2%E8%A7%A3%E9%99%A4%E7%AD%94%E9%A2%98%E9%A1%B5%E9%9D%A2%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload=function(){
        document.onselectstart=null
        document.oncontextmenu=null
        document.onkeydown=null
    }
})();