// ==UserScript==
// @name         百度知道反图片文字
// @namespace    http://TouHou.DieMoe.net/
// @version      0.2
// @description  通过自动刷新避免看见图片字体，去你妈的word-replace。
// @author       DieMoe
// @run-at        document-body
// @match        *://zhidao.baidu.com/question/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40732/%E7%99%BE%E5%BA%A6%E7%9F%A5%E9%81%93%E5%8F%8D%E5%9B%BE%E7%89%87%E6%96%87%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/40732/%E7%99%BE%E5%BA%A6%E7%9F%A5%E9%81%93%E5%8F%8D%E5%9B%BE%E7%89%87%E6%96%87%E5%AD%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var elements = document.querySelectorAll('.word-replace');
    Array.prototype.forEach.call(elements, function(el, i){
        window.location.href="";
    });
})();