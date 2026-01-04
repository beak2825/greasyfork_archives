// ==UserScript==
// @name         WHU搜索导航
// @namespace    http://so.whuer.cn/
// @version      beta
// @description  在优酷、土豆、爱奇艺、腾讯视频等主流视频网站播放页面，添加视频解析按钮。
// @author       WHUER
// @grant        GM_addStyle
// @match        *://v.youku.com/v_show/*
// @match        *://video.tudou.com/*
// @match        *://www.iqiyi.com/*
// @match        *://v.qq.com/x/cover/*
// @match        *://tv.sohu.com/*
// @match        *://www.le.com/ptv/vplay/*
// @match        *://www.mgtv.com/*
// @match        *://www.wasu.cn/Play/show/id/*
// @match        *://www.fun.tv/vplay/*
// @match        *://www.1905.com/video/play/*
// @match        *://vip.1905.com/play/*
// @match        *://v.pptv.com/show/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/34498/WHU%E6%90%9C%E7%B4%A2%E5%AF%BC%E8%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/34498/WHU%E6%90%9C%E7%B4%A2%E5%AF%BC%E8%88%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle("@charset utf-8;#Btn{border-radius:2px;letter-spacing:1px;color:#fff;font-weight:normal;background: #caa361;font-size:16px;padding:2px 4px;line-height:18px;}#Btn:hover{color: #caa361;background: #fff;}");
    var reqq = /qq/i;
    var resohu = /sohu/i;
    var rewasu = /wasu/i;
	var refun = /fun/i;
	var repptv = /pptv/i;
    var url = window.location.href;
    //alert(url);
    var requrl = 'http://so.whuer.cn/video?url=' + url;
    var analysisBtn = '<a id="Btn" target="_blank">VIP解析本片</a>';
	var Title = "";
	if(reqq.test(url)){
		Title = $('.container_inner').find('h1');
	}else if(resohu.test(url)){
		Title = $('#crumbsBar').find('h2');
	}else if(rewasu.test(url)){
		Title = $('.l').find('h3');
	}else if(refun.test(url)){
		Title = $('.headline').find('span');
	}else if(repptv.test(url)){
		Title = $('.hd').find('h3');
	}else{
		Title = $('body').find('h1');
	}
    //alert(Title);
    Title.append(analysisBtn);
    $('#Btn').attr('href',requrl);
})();