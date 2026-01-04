// ==UserScript==
// @name         自动展开豆瓣读书页面 内容简介 作者简介 目录
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动展开豆瓣读书页面 内容简介 作者简介 目录.
// @author       RozwelGustab
// @match        https://book.douban.com/subject/*
// @match        http://book.douban.com/subject/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375042/%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%E9%A1%B5%E9%9D%A2%20%E5%86%85%E5%AE%B9%E7%AE%80%E4%BB%8B%20%E4%BD%9C%E8%80%85%E7%AE%80%E4%BB%8B%20%E7%9B%AE%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/375042/%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%E9%A1%B5%E9%9D%A2%20%E5%86%85%E5%AE%B9%E7%AE%80%E4%BB%8B%20%E4%BD%9C%E8%80%85%E7%AE%80%E4%BB%8B%20%E7%9B%AE%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var reg_short=/^dir_\S*_short$/;
    var reg_full=/^dir_\S*_full$/;
    var all_indent=document.querySelectorAll(".related_info>div.indent");
    for(var i=0;i<all_indent.length;i++){
        var indent=all_indent[i];
        var full=indent.querySelector('.all.hidden');
        var short=indent.querySelector('.short');
        if(full!=null&&short!=null){
            full.style="display:inline";
            short.style="display:none";
            continue;
        }
        if(reg_short.test(indent.id)){
            indent.style="display:none";
            continue;
        }
        if(reg_full.test(indent.id)){
            indent.style="display:inline";
            continue;
        }
    }
})();