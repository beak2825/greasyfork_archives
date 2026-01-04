// ==UserScript==
// @name         知乎自定义
// @namespace    zhihu_edit
// @version      1.3
// @description  去除知乎回答页的翻页Header
// @author       zxk2099
// @match        *://www.zhihu.com/*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461852/%E7%9F%A5%E4%B9%8E%E8%87%AA%E5%AE%9A%E4%B9%89.user.js
// @updateURL https://update.greasyfork.org/scripts/461852/%E7%9F%A5%E4%B9%8E%E8%87%AA%E5%AE%9A%E4%B9%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //删除标题控件
    document.querySelector('.isLogin').remove();

    //滚动隐藏
    var lastScrollTop = 0;
    document.addEventListener('scroll', function() {
        var currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        document.querySelector('[data-za-module="TopNavBar"]').style.cssText = currentScrollTop < lastScrollTop ? "width: 100%; top: 0px" : "display:none";
        lastScrollTop = currentScrollTop;
    });
    
    //document.querySelector('.Question-sideColumnAdContainer').remove();
    
    //下载回答为md文件
    //var s = document.querySelector('[class^="RichText"][class*="CopyrightRichText-richText"]').innerHTML;
    //var s1 = s.replace(new RegExp("<p [a-zA-Z0-9-_]*=\"[a-zA-Z0-9-_]*?\"( [a-zA-Z0-9-_]*=\"[a-zA-Z0-9-_]*?\")?>",'g'),"");
    //var s2 = s1.replace(new RegExp("<p ([a-zA-Z0-9-_]*)=\"[a-zA-Z0-9-_]*\">",'g'),""); //js不需要，Typora需要
    //var s3 = s1.replace("/<\/p>/g","<br>");
    //var s4 = s3.replace("/<b>/g","**");
    //var s5 = s4.replace("/<\/b>/g","**");
    //console.log(s5);

    
})();