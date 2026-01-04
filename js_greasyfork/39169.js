// ==UserScript==
// @name         （免广告版本）VIP视频在线解析，接口每日更新,一键免费看爱奇艺、优酷、搜狐、腾讯、芒果、AB站等Vip影视哦zz
// @namespace    http://asvideo.top/
// @version      2.38
// @description  操作简单，接口每日更新
// @author       爱尚解析
// @match        *://v.youku.com/v_show/*
// @match        *://*.iqiyi.com/v_*
// @match        *://*.iqiyi.com/dianying/*
// @match        *://*.le.com/ptv/vplay/*
// @match        *://v.qq.com/x/cover/*
// @match        *://v.qq.com/x/page/*
// @match        *://*.tudou.com/listplay/*
// @match        *://*.tudou.com/albumplay/*
// @match        *://*.tudou.com/programs/view/*
// @match        *://*.mgtv.com/b/*
// @match        *://*.sohu.com/*
// @match        *://*.acfun.cn/v/*
// @match        *://*.bilibili.com/video/*
// @match        *://*.bilibili.com/anime/*
// @match        *://v.pptv.com/show/*
// @match        *://v.yinyuetai.com/video/*
// @match        *://v.yinyuetai.com/playlist/*
// @match        *://*.wasu.cn/Play/show/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @run-at       document-end
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/39169/%EF%BC%88%E5%85%8D%E5%B9%BF%E5%91%8A%E7%89%88%E6%9C%AC%EF%BC%89VIP%E8%A7%86%E9%A2%91%E5%9C%A8%E7%BA%BF%E8%A7%A3%E6%9E%90%EF%BC%8C%E6%8E%A5%E5%8F%A3%E6%AF%8F%E6%97%A5%E6%9B%B4%E6%96%B0%2C%E4%B8%80%E9%94%AE%E5%85%8D%E8%B4%B9%E7%9C%8B%E7%88%B1%E5%A5%87%E8%89%BA%E3%80%81%E4%BC%98%E9%85%B7%E3%80%81%E6%90%9C%E7%8B%90%E3%80%81%E8%85%BE%E8%AE%AF%E3%80%81%E8%8A%92%E6%9E%9C%E3%80%81AB%E7%AB%99%E7%AD%89Vip%E5%BD%B1%E8%A7%86%E5%93%A6zz.user.js
// @updateURL https://update.greasyfork.org/scripts/39169/%EF%BC%88%E5%85%8D%E5%B9%BF%E5%91%8A%E7%89%88%E6%9C%AC%EF%BC%89VIP%E8%A7%86%E9%A2%91%E5%9C%A8%E7%BA%BF%E8%A7%A3%E6%9E%90%EF%BC%8C%E6%8E%A5%E5%8F%A3%E6%AF%8F%E6%97%A5%E6%9B%B4%E6%96%B0%2C%E4%B8%80%E9%94%AE%E5%85%8D%E8%B4%B9%E7%9C%8B%E7%88%B1%E5%A5%87%E8%89%BA%E3%80%81%E4%BC%98%E9%85%B7%E3%80%81%E6%90%9C%E7%8B%90%E3%80%81%E8%85%BE%E8%AE%AF%E3%80%81%E8%8A%92%E6%9E%9C%E3%80%81AB%E7%AB%99%E7%AD%89Vip%E5%BD%B1%E8%A7%86%E5%93%A6zz.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var curPlaySite = '';
    var curWords = '';
    var videoSite = window.location.href;
    var reYk = /youku/i;
    var reAqy = /iqiyi/i;
    var reLS = /le/i;
    var reTX = /qq/i;
    var reTD = /tudou/i;
    var reMG = /mgtv/i;
    var reSH = /sohu/i;
    var reAF = /acfun/i;
    var reBL = /bilibili/i;
    var reYJ = /1905/i;
    var rePP = /pptv/i;
    var reYYT = /yinyuetai/i;
    var vipBtn = '<a id="asvideoBtn" style="cursor:pointer;text-decoration:none;color:red;padding:0 5px;border:1px solid red;">一键vip解析</a>';
    
  // 优酷
    if(reYk.test(videoSite)){
        vipBtn
        var youkuTitle = $('#headq');
        if(youkuTitle.length !== 0){
        	youkuTitle.after(vipBtn);
	        $('#asvideoBtn').css({'font-size':'17px','display':'inline-block','height':'22px','line-height':'22px','margin':'0 5px','vertical-align':'bottom'});
	       
	        if($('.tvinfo').length !== 0){
	        	curWords = $('.tvinfo').find('h3').eq(0).text();
	        }else{
	        	curWords = $('.title').attr('title');
	        }
	        
        }else{
        	$('.tags').after(vipBtn);
        	$('#asvideoBtn').css({'font-size':'17px','display':'inline-block','height':'22px','line-height':'22px','margin':'0 5px','vertical-align':'bottom'});
	        
	       	if($('.tvinfo').length !== 0){
	        	curWords = $('.tvinfo').find('h3').eq(0).text();
	        }else{
	        	curWords = $('.title').attr('title');
	        }
	       
        }
    }
    // 爱奇艺
    if(reAqy.test(videoSite)){
        var iqiyiTitle = $('#widget-videotitle');
        iqiyiTitle.parent('.mod-play-tit').append(vipBtn);
        $('#asvideoBtn').css({'font-size':'17px','display':'inline-block','height':'24px','line-height':'24px','margin':'0 5px'});
       
        if($('#drama-series-title').length !== 0){
        	curWords = $('#drama-series-title').find('a').text();
        }else{
        	curWords = iqiyiTitle.text();
        }
        
    }
    // 乐视
    if(reLS.test(videoSite)){
        var lsTitle = $('.briefIntro_tit');
        lsTitle.after(vipBtn);
        lsTitle.css('float','left');
        $('#asvideoBtn').css({'font-size':'16px','display':'inline-block','height':'20px','line-height':'20px','margin':'0 5px'});
       
       	if($('.Info').find('.title').find('h3').length !== 0){
        	curWords = $('.Info').find('.title').find('h3').text();
        }else{
        	curWords = lsTitle.text();
        }
      
    }
    // 腾讯
    if(reTX.test(videoSite)){
        var qqTitle = $('.mod_intro').find('.video_title');
        qqTitle.eq(0).after(vipBtn);
        $('#asvideoBtn').css({'font-size':'24px','display':'inline-block','height':'36px','line-height':'36px','margin':'0 5px'});
        
        if($('.player_title').length !== 0 && $('.player_title').find('a').length === 0){
        	curWords = $('.player_title').text();
        }else{
        	curWords = $('._base_title').text();
        }
        if(curWords === ''){
        	curWords = $('.player_title').text();
        }
        
    }
    // 土豆
    if(reTD.test(videoSite)){
        var tdTitle = $('.td-playbase__title');
        tdTitle.parent('.fix').append(vipBtn);
        $('#asvideoBtn').css({'font-size':'18px','display':'inline-block','height':'22px','line-height':'22px','margin':'14px 5px 0'});
    }
    // 芒果
    if(reMG.test(videoSite)){
        var mgTitle = $('.v-panel-title');
        mgTitle.after(vipBtn);
        mgTitle.css({'float':'left','margin-right':'0'});
        $('#asvideoBtn').css({'font-size':'22px','display':'inline-block','height':'40px','line-height':'40px','margin':'0 5px'});
        
    	curWords = mgTitle.text();
        
    }
    
    // 搜狐
    if(reSH.test(videoSite)){
        var shTitle = $('.crumbs');
        shTitle.append(vipBtn);
        shTitle.find('h2').css({'float':'left'});
        $('#asvideoBtn').css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'36px','line-height':'36px','margin':'0 5px'});
        
        curWords = shTitle.find('h2').text();
       
    }
    // A站
    if(reAF.test(videoSite)){
        var acTitle = $('.head').find('.title');
        acTitle.append(vipBtn);
        $('#asvideoBtn').css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'20px','line-height':'20px','margin':'0 5px'});
    }
    // B站
    if(reBL.test(videoSite)){
        var biliTitle = $('.v-title').find('h1');
        biliTitle.after(vipBtn);
        biliTitle.css({'float':'left','margin-right':'0'});
        $('#asvideoBtn').css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'36px','line-height':'36px','margin':'0 5px'});
    }
    // pptv
    if(rePP.test(videoSite)){
        var pptvTitle = $('.hd-logo fl');
        pptvTitle.after(vipBtn);
        $('#asvideoBtn').css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'36px','line-height':'36px','margin':'0 5px'});
  
        curWords = pptvTitle.text();
       
    }
    // 音悦台
    if(reYYT.test(videoSite)){
        var yytTitle = $('.videoName');
        yytTitle.append(vipBtn);
        $('#asvideoBtn').css({'font-weight':'bold','font-size':'14px','display':'inline-block','height':'32px','line-height':'32px','margin':'0 5px'});
    }
    $('#asvideoBtn').on('click',function(){
        curPlaySite = window.location.href;
        window.location.href = 'http://asvideo.top/sousou.php?url=' + curPlaySite;
    });
})();