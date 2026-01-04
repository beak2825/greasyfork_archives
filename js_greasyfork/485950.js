// ==UserScript==
// @name         虎扑帖子图片缩小-超轻量级
// @namespace    http://tampermonkey.net/
// @version      1.3
// @license      MIT
// @description  Stop social death when fishing
// @author       sdujava2011
// @match        *://bbs.hupu.com/*
// @icon         https://w1.hoopchina.com.cn/images/pc/old/favicon.ico
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://gist.githubusercontent.com/SDUhuaxia/c267468f211d4a2cf921548d456aa959/raw/8cb18ee9c3f7183ec21c417c72ee1ac2cf9cc9d7/waitForKeyElements.js#md5=tft8SDGCQ2aUyQo5PlkbTg==
// @downloadURL https://update.greasyfork.org/scripts/485950/%E8%99%8E%E6%89%91%E5%B8%96%E5%AD%90%E5%9B%BE%E7%89%87%E7%BC%A9%E5%B0%8F-%E8%B6%85%E8%BD%BB%E9%87%8F%E7%BA%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/485950/%E8%99%8E%E6%89%91%E5%B8%96%E5%AD%90%E5%9B%BE%E7%89%87%E7%BC%A9%E5%B0%8F-%E8%B6%85%E8%BD%BB%E9%87%8F%E7%BA%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals jQuery, $, waitForKeyElements */
    waitForKeyElements(".thread-img", function(){
        var imgs = document.querySelectorAll(".thread-img")
        var x;
        for (x = 0; x < imgs.length; x++) {
            $(imgs[x]).css({"width": "auto","max-width": "30%","height": "auto"})
        }
    });
    waitForKeyElements(".thread-content-detail", function(jNode){
        // 使用querySelectorAll()函数选择该div内部的所有img标签
        let imgElements = jNode.find("img");
        var i;
        for (i = 0; i < imgElements.length; i++) {
            if(!$(imgElements[i]).hasClass("hupu-custom-emoji") && !$(imgElements[i]).hasClass("thread-img")){
                $(imgElements[i]).css({"width": "auto","max-width": "30%","height": "auto"});
            }
        }
    });
})();