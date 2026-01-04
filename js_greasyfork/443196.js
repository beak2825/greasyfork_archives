// ==UserScript==
// @name         荣耀蓝光全网VIP视频全能搜索
// @namespace    http://app.lmvideos.cn/
// @version      1.2
// @description  荣耀蓝光新晋民间最受欢迎的影视资源聚合搜索网站，目前支持在豆瓣电影，时光电影,爱奇艺，腾讯视频，优酷视频的网页里，添加电影搜索按钮！
// @author       荣耀搜索
// @grant        GM_addStyle
// @match        *://movie.douban.com/subject/*
// @match        *://movie.mtime.com/*
// @match        *://www.iqiyi.com/*
// @match        *://v.qq.com/x/*
// @match        *://v.youku.com/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/443196/%E8%8D%A3%E8%80%80%E8%93%9D%E5%85%89%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E5%85%A8%E8%83%BD%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/443196/%E8%8D%A3%E8%80%80%E8%93%9D%E5%85%89%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E5%85%A8%E8%83%BD%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle("@charset utf-8;#SearchBtn{margin-left:5px;letter-spacing:1px;padding:5px 10px;line-height:27px;font-family:'微软雅黑','黑体';background:#00a96c;color:#fff;font-size:16px;border: 2px solid #00a96c;}#SearchBtn:hover{background:#ffffff;color:#000;}");
    GM_addStyle("@charset utf-8;#PlayBtn{margin-left:5px;letter-spacing:1px;padding:5px 10px;line-height:27px;font-family:'微软雅黑','黑体';background:#ff0000;color:#fff;font-size:16px;border: 2px solid #ff0000;}#PlayBtn:hover{background:#ffffff;color:#000;cursor:pointer;}");
    var reDouban = /douban/i;
    var reIqiyi = /iqiyi/i;
    var reMtime = /mtime/i;
	var reVqq = /qq/i;
	var reYouku = /youku/i;
    var curUrl = window.location.href;
    var curWords = '';
    var playOn ='';
    function trim(str){
	    return str.replace(/(\s*)|(\s*$)/g, "");
	}
	var e6601Url = 'http://app.lmvideos.cn/vod/search.html?wd=';
    var addSearchBtn = '<a id="SearchBtn" target="_blank">荣耀搜片</a>';
     var addPlayBtn = '<a id="PlayBtn" target="_blank">荣耀VIP播放</a>';
    if(reDouban.test(curUrl)){
        var doubanTitle = $('#content').find('h1');
        doubanTitle.append(addSearchBtn);
       	curWords = trim($('title').text().split('(')[0]);
        $('#SearchBtn').attr('href',e6601Url + curWords );
    }
    if(reMtime.test(curUrl)){
    	if($('.db_head').length>0){
    		var curMtitle = $('.db_head').find('h1');
    		curMtitle.next('p').after(addSearchBtn);
	       	curWords = trim(curMtitle.text());
	        $('#SearchBtn').attr('href',e6601Url + curWords );
    	}
    }
	 if(reIqiyi.test(curUrl)){
		 var iqiyiTitle = $('.mod-play-tits').find('h1');
        iqiyiTitle.append(addSearchBtn).append(addPlayBtn);
       	curWords = trim($("[name='irAlbumName']").attr("content"));
        $('#SearchBtn').attr('href',e6601Url + curWords );
    }
	if(reVqq.test(curUrl)){
		 var vsqqTitle = $('.mod_intro').find('h1');
        vsqqTitle.append(addSearchBtn).append(addPlayBtn);
       	curWords = trim($('.player_title').find('a').text());
        $('#SearchBtn').attr('href',e6601Url + curWords );
    }
	if(reYouku.test(curUrl)){
		 var youkuTitle = $('#module_basic_phonewatch');
        youkuTitle.append(addSearchBtn).append(addPlayBtn);
       	curWords = trim($("[name='title']").attr("content"));
        $('#SearchBtn').attr('href','http://app.lmvideos.cn/vod/search.html?wd=' + curWords );
    }

   $('#PlayBtn').on('click',function(){
        playOn = window.location.href;
        window.location.href = 'http://app.lmvideos.cn/vod/search.html?wd=' + playOn;
    });
})();