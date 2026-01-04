// ==UserScript==
// @name         移除百度热榜
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  移除百度热榜，有需求留言
// @author       lalalalala
// @match        https://*.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423712/%E7%A7%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E7%83%AD%E6%A6%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/423712/%E7%A7%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E7%83%AD%E6%A6%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var cur=0;
    var removeHot = function(){
        $('[title="百度热榜"]').parent().parent().remove();
        if(cur<10){
            cur+=1;
            setTimeout(removeHot,1000);
        }

    }
    removeHot();
    // Your code here...
})();