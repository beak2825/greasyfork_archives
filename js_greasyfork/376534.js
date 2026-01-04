// ==UserScript==
// @name         for hkpic
// @namespace    https://greasyfork.org/zh-CN/scripts/376534-for-hkpic
// @version      0.8
// @description  for hkpic: 1.去除延迟加载图片  2.为分页的链接地址加上按最新发布排序  3.为标签"討論區"的链接地址加上按最新发布排序
// @author       xmlspy
// @match        http://hkpic.net/*
// @match        http://hkbbcc.net/*
// @match        http://174.138.175.178/*
// @match        http://bi-si1.xyz/*
// @match        http://198.24.143.234/*
// @match        http://hk-bc.xyz/*
// @match        http://bi-si2.xyz/*
// @match        http*://www.dsndsht23.com/*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/2.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/376534/for%20hkpic.user.js
// @updateURL https://update.greasyfork.org/scripts/376534/for%20hkpic.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 1.去除延迟加载图片
    $('img[id^="aimg_"]').each(function(index,element){
        $(element).attr('src',$(element).attr('file'));
        $(element).attr('lazyloaded',true);
    });

    // 2.为分页的链接地址加上按最新发布排序
    $.each($("a[href*='forum.php?mod=forumdisplay']"),function(index,a){
        var href = a.href.replace('forum.php?mod=forumdisplay','forum.php?mod=forumdisplay&orderby=dateline');
        a.href = href;
    });

    // 3.为标签"討論區"的链接地址加上按最新发布排序
    $.each($(".pg>a"),function(index,a){
        if(a.href.includes("?")){
            a.href = a.href+'&orderby=dateline';
        }else{
            a.href = a.href+'?orderby=dateline';
        }
    });
})();