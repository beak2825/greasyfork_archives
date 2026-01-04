// ==UserScript==
// @name         豆瓣电影的标题处添加搜索
// @namespace    douban
// @version      2020.0102
// @description  豆瓣电影的标题处添加搜索按钮
// @author       S
// @grant        GM_addStyle
// @match        *://movie.douban.com/subject/*
// @require      https://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/394550/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E7%9A%84%E6%A0%87%E9%A2%98%E5%A4%84%E6%B7%BB%E5%8A%A0%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/394550/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E7%9A%84%E6%A0%87%E9%A2%98%E5%A4%84%E6%B7%BB%E5%8A%A0%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(
                 "@charset utf-8;"
                +"#doubanSearchBtn{border-radius:2px; letter-spacing:1px; color:#ca6445; font-weight:normal; background:#fae9da; font-size:16px; padding:5px 10px; line-height:28px; margin-right: 10px;}"
                +"#doubanSearchBtn:hover{color:#d9896a; background:#fcefe3;}"
                +"#doubanSearchBtnYTB{border-radius:2px; font-weight:normal; background-color:#f00; color:#fff; font-family:fantasy; font-size:17px; padding:5px 10px; line-height:28px;}"
                +"#doubanSearchBtnYTB:hover{color:#ffeae2;}"
                );
    var reDouban = /douban/i;
    var curUrl = window.location.href;
    var curWords = '';
    function trim(str){
	    return str.replace(/(^\s*)|(\s*$)/g, "");
	}
    var dbSearchBtn = '<a id="doubanSearchBtn" target="_blank">搜索本片</a>';
    var dbSearchBtnYTB = '<a id="doubanSearchBtnYTB" target="_blank">YouTube</a>';
    if(reDouban.test(curUrl)){
        var doubanTitle = $('#content').find('h1');
        doubanTitle.append(dbSearchBtn);
        doubanTitle.append(dbSearchBtnYTB);
       	curWords = trim($('title').text().split('(')[0]);
        $('#doubanSearchBtn').attr('href','https://cse.google.com/cse?cx=016236319849230842297:frfwdedclgc&q=' + curWords);
        $('#doubanSearchBtnYTB').attr('href','https://www.youtube.com/results?search_query=' + curWords);
    }
})();