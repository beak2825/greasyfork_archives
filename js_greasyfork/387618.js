// ==UserScript==
// @name         java123-java书籍列表中的链接在新窗口打开
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  java书籍列表中的链接在新窗口打开
// @author       yankj12
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @match        *://www.java1234.com/a/javabook/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387618/java123-java%E4%B9%A6%E7%B1%8D%E5%88%97%E8%A1%A8%E4%B8%AD%E7%9A%84%E9%93%BE%E6%8E%A5%E5%9C%A8%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/387618/java123-java%E4%B9%A6%E7%B1%8D%E5%88%97%E8%A1%A8%E4%B8%AD%E7%9A%84%E9%93%BE%E6%8E%A5%E5%9C%A8%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

var Book = function(name) {
    this.name = name;
};

// Object.prototype  参考下面链接
// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/prototype

(function() {
    'use strict';
    //var a = $("div.listbox a");
    $("div.listbox a").each(function(){
        //console.log($(this).text());
        // 为a标签添加属性<a target="_blank" href="#"></a>
        //_blank是最常见的链接方式，表示超链接的目标地址在新建窗口中打开；
        //_self表示“相同窗口”。点击链接后，地址栏不变；
        //_top表示整页窗口；
        //_parent表示父窗口。
        $(this).attr('target', '_blank');
    });

    $("dl.tbox a").each(function(){
        //console.log($(this).text());
        $(this).attr('target', '_blank');
    });

    if(window.localStorage){
	    console.log('浏览器支持localStorage');
    }
    if(window.sessionStorage){
	    console.log('浏览器支持sessionStorage');
	}
    // 获取书籍列表中的书籍简要信息
    $("div.listbox li").each(function(){
        //console.log($(this).text());
        var coverImgSrc = $(this).children('a.preview').children().attr('src');
        console.log(coverImgSrc);    //    /uploads/allimg/190718/1-1ZGQ01IC05-lp.jpg
        var category = $(this).children('b').text();
        console.log(category);
        //
        var bookLink = $(this).children('a.title');
        var title = bookLink.text().split(' ')[0];
        var bookSrc = bookLink.attr('href');
        console.log(title + ',' + bookSrc);

    });
})();