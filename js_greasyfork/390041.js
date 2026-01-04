// ==UserScript==
// @name         电子发烧友不登录浏览更多
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  点击标题的展开全文就可全文阅读
// @author       YQMCU
// @match        http://www.elecfans.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390041/%E7%94%B5%E5%AD%90%E5%8F%91%E7%83%A7%E5%8F%8B%E4%B8%8D%E7%99%BB%E5%BD%95%E6%B5%8F%E8%A7%88%E6%9B%B4%E5%A4%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/390041/%E7%94%B5%E5%AD%90%E5%8F%91%E7%83%A7%E5%8F%8B%E4%B8%8D%E7%99%BB%E5%BD%95%E6%B5%8F%E8%A7%88%E6%9B%B4%E5%A4%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('.article-title:first').append($('<button>').text('展开全文').on('click',function(){
        $('.simditor-body').css('height','100%');
    }));

    // Your code here...
})();