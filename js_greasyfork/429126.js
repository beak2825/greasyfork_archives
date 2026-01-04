// ==UserScript==
// @name         百度文库显示全文防止跳转(已失效，待更新)
// @namespace    https://greasyfork.org/zh-CN
// @version      1.1
// @description  防止点击【显示全文】后自动跳转到充值页面
// @author       dorleone
// @include      https://wenku.baidu.com/view/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429126/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E6%98%BE%E7%A4%BA%E5%85%A8%E6%96%87%E9%98%B2%E6%AD%A2%E8%B7%B3%E8%BD%AC%28%E5%B7%B2%E5%A4%B1%E6%95%88%EF%BC%8C%E5%BE%85%E6%9B%B4%E6%96%B0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/429126/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E6%98%BE%E7%A4%BA%E5%85%A8%E6%96%87%E9%98%B2%E6%AD%A2%E8%B7%B3%E8%BD%AC%28%E5%B7%B2%E5%A4%B1%E6%95%88%EF%BC%8C%E5%BE%85%E6%9B%B4%E6%96%B0%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onbeforeunload = function(){
       return false;
    }
})();