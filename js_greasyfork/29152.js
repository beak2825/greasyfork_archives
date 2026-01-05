// ==UserScript==
// @name         从Google搜索结果中删除'卡饭教程'等垃圾结果
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  从Google搜索结果中删除'卡饭教程'等
// @author       RandyO
// @include /^https?\:\/\/encrypted.google.[^\/]+/
// @include /^https?\:\/\/www.google.[^\/]+/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29152/%E4%BB%8EGoogle%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%B8%AD%E5%88%A0%E9%99%A4%27%E5%8D%A1%E9%A5%AD%E6%95%99%E7%A8%8B%27%E7%AD%89%E5%9E%83%E5%9C%BE%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/29152/%E4%BB%8EGoogle%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%B8%AD%E5%88%A0%E9%99%A4%27%E5%8D%A1%E9%A5%AD%E6%95%99%E7%A8%8B%27%E7%AD%89%E5%9E%83%E5%9C%BE%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var regs = [
        /kafan\.cn/,
        /dongnanshan\.com/,
        /so\.(.)+\.(com|cn)/,
        /hdnkm\.com/,
        /baba100\.com/,
        /link\.nalc\.com\.cn/,
        /www\.yiper\.cn/,
        /www\.xuyich\.com/,
        /hk\.kuaiso\.com/,
        /findeen\.com/,
        /jingyan\.baidu\.com/,
        /jqhnt\.com\.cn/,
        /www\.993113\.cn/,
        /bainei\.com/
    ];
    var divgs = Array.from(document.querySelectorAll('div.g'));
    divgs.forEach(function(div){
        var aNode = div.querySelector('a');
        var href = aNode.getAttribute('href');
        regs.forEach(function(reg){
            if(reg.test(href)){
                div.parentNode.removeChild(div);
            }
        });
    });
})();