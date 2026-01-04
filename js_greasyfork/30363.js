// ==UserScript==
// @name         疯狂影视搜索
// @namespace    http://ifkdy.com/
// @version      1.0
// @description  在豆瓣电影，预告片世界，时光电影的网页里，添加电影搜索按钮！
// @author       ifkdy
// @grant        GM_addStyle
// @match        *://movie.douban.com/subject/*
// @match        *://www.yugaopian.cn/movie/*
// @match        *://movie.mtime.com/*
// @require      https://lib.baomitu.com/jquery/1.8.3/jquery.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/30363/%E7%96%AF%E7%8B%82%E5%BD%B1%E8%A7%86%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/30363/%E7%96%AF%E7%8B%82%E5%BD%B1%E8%A7%86%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle("@charset utf-8;#mtimeSearchBtn{margin-left: 5px;padding:5px 10px;font-size:25px;color:#fff;background: #127bab;}#mtimeSearchBtn:hover{text-decoration: none;}#yugaopianSearchBtn{margin-left:5px;letter-spacing:1px;padding:5px 10px;line-height:27px;font-family: '微软雅黑','黑体';background: #7cd37c;color:#fff;font-size:14px;}#yugaopianSearchBtn:hover{background: #57c857;}#doubanSearchBtn{border-radius:2px;letter-spacing:1px;color:#ca6445;font-weight:normal;background: #fae9da;font-size:16px;padding:5px 10px;line-height:28px;}#doubanSearchBtn:hover{color: #d9896a;background: #fcefe3;}");
    var reDouban = /douban/i;
    var reYugaopian = /yugaopian/i;
    var reMtime = /mtime/i;
    var curUrl = window.location.href;
    var curWords = '';
    function trim(str){
	    return str.replace(/(^\s*)|(\s*$)/g, "");
	}
	var fkdyUrl = 'http://ifkdy.com/search?key=';
    var dbSearchBtn = '<a id="doubanSearchBtn" target="_blank">搜索本片</a>';
    var ygpSearchBtn = '<a id="yugaopianSearchBtn" target="_blank">搜索本片</a>';
    var mtSearchBtn = '<a id="mtimeSearchBtn" target="_blank">搜索本片</a>';
    if(reDouban.test(curUrl)){
        var doubanTitle = $('#content').find('h1');
        doubanTitle.append(dbSearchBtn);
       	curWords = trim($('title').text().split('(')[0]);
        $('#doubanSearchBtn').attr('href','http://ifkdy.com/search?key=' + curWords + '&p=1');
    }
    if(reYugaopian.test(curUrl)){
        $('.movie-name').css('float','left').after(ygpSearchBtn);
       	curWords = trim($('.movie-name').attr('title'));
        $('#yugaopianSearchBtn').attr('href','http://ifkdy.com/search?key=' + curWords + '&p=1');
    }
    if(reMtime.test(curUrl)){
    	if($('.db_head').length>0){
    		var curMtitle = $('.db_head').find('h1');
    		curMtitle.next('p').after(mtSearchBtn);
	       	curWords = trim(curMtitle.text());
	        $('#mtimeSearchBtn').attr('href','http://ifkdy.com/search?key=' + curWords + '&p=1');
    	}
    }
})();