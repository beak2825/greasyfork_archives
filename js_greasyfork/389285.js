// ==UserScript==
// @name         虾米旧版链接替换
// @description  虾米旧版链接替换。
// @version      0.1
// @author       You
// @namespace https://greasyfork.org/zh-CN/scripts/389285
// @include      http*://emumo.xiami.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389285/%E8%99%BE%E7%B1%B3%E6%97%A7%E7%89%88%E9%93%BE%E6%8E%A5%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/389285/%E8%99%BE%E7%B1%B3%E6%97%A7%E7%89%88%E9%93%BE%E6%8E%A5%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $('a').each(function(){
        var href = $(this).attr('href');
        if(href){
            href = href.replace('www.xiami.com','emumo.xiami.com');
            $(this).attr('href',href);
        }
    });
})();