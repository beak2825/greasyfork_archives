// ==UserScript==
// @name         VIP视频在线解析视频
// @namespace    http://api.bbbbbb.me/jx/?url=
// @version      1.2
// @description  vip解析点击标题旁的解析
// @author       油条
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
// @match        *://film.sohu.com/album/*
// @match        *://*.acfun.cn/v/*
// @match        *://*.bilibili.com/video/*
// @match        *://*.bilibili.com/anime/*
// @match        *://vip.pptv.com/show/*
// @match        *://v.yinyuetai.com/video/*
// @match        *://v.yinyuetai.com/playlist/*
// @match        *://*.wasu.cn/Play/show/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @run-at       document-end
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/373576/VIP%E8%A7%86%E9%A2%91%E5%9C%A8%E7%BA%BF%E8%A7%A3%E6%9E%90%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/373576/VIP%E8%A7%86%E9%A2%91%E5%9C%A8%E7%BA%BF%E8%A7%A3%E6%9E%90%E8%A7%86%E9%A2%91.meta.js
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
    var reYJ = /1905/i;
    var rePP = /pptv/i;
    var reYYT = /yinyuetai/i;
    var vipBtn = '<a id="sonimeiVipBtn" style="cursor:pointer;text-decoration:none;color:#C8C8C8;padding:0 5px;">油条解析</a>';

    // 爱奇艺
    if(reAqy.test(videoSite)){
        var iqiyiTitle = $('.player-title');
        iqiyiTitle.after(vipBtn);
        $('#sonimeiVipBtn').css({'font-size':'24px','float':'left','display':'inline-block','height':'36px','max-width':'100%','line-height':'0px','margin':'16px 5px'});
        if($('#drama-series-title').length !== 0){
        	curWords = $('#drama-series-title').find('a').text();
        }else{
        	curWords = iqiyiTitle.text();
        }
    }
    // 乐视
    if(reLS.test(videoSite)){
        var lsTitle = $('.j-video-name');
        lsTitle.after(vipBtn);
        lsTitle.css('float','left');
        $('#sonimeiVipBtn').css({'font-size':'16px','display':'inline-block','height':'20px','line-height':'20px','margin':'0 5px'});
       	//if($('.Info').find('.title').find('h3').length !== 0){
        	//curWords = $('.Info').find('.title').find('h3').text();
        //}else{
        	//curWords = lsTitle.text();
        //}
    }
    // 腾讯
    if(reTX.test(videoSite)){
        var qqTitle = $('.mod_intro').find('.video_title');
        qqTitle.eq(0).after(vipBtn);
        $('#sonimeiVipBtn').css({'font-size':'26px','display':'inline-block','margin':'0 5px'});
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
        var tdTitle = $('#videoKw');
        tdTitle.parent('.fix').append(vipBtn);
        $('#sonimeiVipBtn').css({'font-size':'18px','display':'inline-block','height':'22px','line-height':'22px','margin':'14px 5px 0'});
    }
    // 芒果
    if(reMG.test(videoSite)){
        var mgTitle = $('.v-panel-title');
        mgTitle.after(vipBtn);
        mgTitle.css({'float':'left','margin-right':'0'});
        $('#sonimeiVipBtn').css({'font-size':'22px','display':'inline-block','height':'40px','line-height':'40px','margin':'0 5px'});
    	curWords = mgTitle.text();
    }
    // 搜狐
    if(reSH.test(videoSite)){
        var shTitle = $('.player-top-info-name');
        shTitle.append(vipBtn);
        shTitle.find('h2').css({'float':'left'});
        $('#sonimeiVipBtn').css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'36px','line-height':'36px','margin':'0 5px'});
        curWords = shTitle.find('h2').text();
    }
    // pptv
    if(rePP.test(videoSite)){
        var pptvTitle = $('.title_video').find('h3');
        pptvTitle.after(vipBtn);
        $('#sonimeiVipBtn').css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'36px','line-height':'36px','margin':'0 5px'});
        curWords = pptvTitle.text();
    }
    //优酷
	 if(reYk.test(videoSite)){
        var youkuTitle = $('#subtitle');
        if(youkuTitle.length !== 0){
        	youkuTitle.after(vipBtn);
	        $('#sonimeiVipBtn').css({'font-size':'26px','display':'inline-block','margin':'0 5px','vertical-align':'bottom'});
	        if($('.tvinfo').length !== 0){
	        	curWords = $('.tvinfo').find('h2').eq(0).find('a').text();
	        }else{
	        	curWords = $('.title').attr('title');
	        }
        }else{
        	$('.title').after(vipBtn);
        	$('#sonimeiVipBtn').css({'font-size':'26px','display':'inline-block','margin':'0 5px','vertical-align':'bottom'});
	       	if($('.tvinfo').length !== 0){
	        	curWords = $('.tvinfo').find('h3').eq(0).text();
	        }else{
	        	curWords = $('.title').attr('title');
	        }
        }
    }

    $('#sonimeiVipBtn').on('click',function(){
        curPlaySite = window.location.href;
        window.open( 'http://api.bbbbbb.me/jx/?url=' + curPlaySite);
    });
})();