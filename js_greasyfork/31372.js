// ==UserScript==
// @name         酷绘-VIP会员视频免费看
// @namespace    kuhuiv.com
// @version      3.2.9
// @description  各大视频网站VIP会员视频免费看，支持各大视频网站，操作更加便捷
// @author       作者：阿辉
// @match        *://v.youku.com/v_show/*
// @match        *://*.iqiyi.com/v_*
// @match        *://*.iqiyi.com/dianying/*
// @match        *://*.le.com/ptv/vplay/*
// @match        *://v.qq.com/x/cover/*
// @match        *://v.qq.com/x/page/*
// @match        *://*.wasu.cn/Play/show/id/*
// @match        *://*.mgtv.com/b/*
// @match        *://film.sohu.com/album/*
// @match        *://tv.sohu.com/v/*
// @match        *://*.acfun.cn/v/*
// @match        *://*.bilibili.com/video/*
// @match        *://*.bilibili.com/bangumi/*
// @match        *://v.pptv.com/show/*
// @match        *://vip.1905.com/play/*
// @match        *://www.miguvideo.com/mgs/website/prd/detail.html?cid=*
// @match        *://v.yinyuetai.com/video/*
// @match        *://v.yinyuetai.com/playlist/*
// @match        *://huihev.com/*
// @require      https://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @run-at       document-end
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/31372/%E9%85%B7%E7%BB%98-VIP%E4%BC%9A%E5%91%98%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/31372/%E9%85%B7%E7%BB%98-VIP%E4%BC%9A%E5%91%98%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B.meta.js
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
    var reWS = /wasu/i;
    var reMG = /mgtv/i;
    var reSH = /film.sohu/i;
    var reSHTV = /tv.sohu/i;
    var reAF = /acfun/i;
    var reBL = /bilibili/i;
    var rePP = /pptv/i;
    var rem19 = /1905/i;
    var remigu = /migu/i;
    var reYYT = /yinyuetai/i;
    var rekuhuiv = /kuhuiv/i;
    var vipBtn = '<a id="huuiBtn" style="cursor:pointer;text-decoration:none;color:#FF6600;padding:0 5px;border:1px solid #FF6600;">VIP看你想看</a>';
    var mSearchBtn = '<a id="huuiSearchBtn" target="_blank" style="cursor:pointer;text-decoration:none;color:#FF6600;padding:0 5px;border:1px solid #FF6600;">最新大片</a>';
    // youku
    if(reYk.test(videoSite)){
        var youkuTitle = $('#playerBox');
        youkuTitle.after(mSearchBtn).after(vipBtn);
        $('#huuiBtn').css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'26px','line-height':'26px','margin':'2px 5px'});
        $('#huuiSearchBtn').css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'26px','line-height':'26px','margin':'2px 5px'});
        curWords = youkuTitle.text();
        $('#huuiSearchBtn').attr('href','http://www.huihev.com/?987' );
    }
    // IQIYI
    if(reAqy.test(videoSite)){
        var iqiyiTitle = $('#realFlashbox');
        iqiyiTitle.after(mSearchBtn).after(vipBtn);
        $('#huuiBtn').css({'font-weight':'bold','font-size':'14px','display':'inline-block','height':'30px','line-height':'30px','margin':'0 5px','position':'fixed','z-index':'999999','top':'250px','left':'0px'});
        $('#huuiSearchBtn').css({'font-weight':'bold','font-size':'14px','display':'inline-block','height':'30px','line-height':'30px','margin':'0 5px','position':'fixed','z-index':'999998','top':'300px','left':'0px'});
        curWords = iqiyiTitle.text();
        $('#huuiSearchBtn').attr('href','http://www.huihev.com/?987' );
    }
    // LETV
    if(reLS.test(videoSite)){
        var lsTitle = $('.column_width');
        lsTitle.after(mSearchBtn).after(vipBtn);
        $('#huuiBtn').css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'26px','line-height':'26px','margin':'5px 5px'});
        $('#huuiSearchBtn').css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'26px','line-height':'26px','margin':'5px 5px'});
        curWords = lsTitle.text();
        $('#huuiSearchBtn').attr('href','http://www.huihev.com/?987' );
    }
    // QQ
    if(reTX.test(videoSite)){
        var qqTitle = $('.video_score');
        qqTitle.eq(0).after(mSearchBtn).after(vipBtn);
        $('#huuiBtn').css({'font-size':'16px','display':'inline-block','height':'30px','line-height':'30px','margin':'0 5px'});
        $('#huuiSearchBtn').css({'font-size':'16px','display':'inline-block','height':'30px','line-height':'30px','margin':'0 5px'});
        if($('.player_title').length !== 0 && $('.player_title').find('a').length === 0){
        	curWords = $('.player_title').text();
        }else{
        	curWords = $('._base_title').text();
        }
        $('#huuiSearchBtn').attr('href','http://www.huihev.com/?987' );
    }
    // wasu
    if(reWS.test(videoSite)){
        var wsTitle = $('.play_site');
        wsTitle.after(mSearchBtn).after(vipBtn);
        $('#huuiBtn').css({'font-weight':'bold','font-size':'14px','display':'inline-block','height':'22px','line-height':'22px','margin':'2px 5px'});
        $('#huuiSearchBtn').css({'font-weight':'bold','font-size':'14px','display':'inline-block','height':'22px','line-height':'22px','margin':'2px 5px'});
        curWords = wsTitle.text();
        $('#huuiSearchBtn').attr('href','http://www.huihev.com/?987' );
    }
    // MGTV
    if(reMG.test(videoSite)){
        var mgTitle = $('.c-player-v3');
        mgTitle.after(mSearchBtn).after(vipBtn);
        $('#huuiBtn').css({'font-size':'16px','display':'inline-block','height':'26px','line-height':'26px','margin':'2px 5px'});
        $('#huuiSearchBtn').css({'font-size':'16px','display':'inline-block','height':'26px','line-height':'26px','margin':'2px 5px'});
    	curWords = mgTitle.text();
        $('#huuiSearchBtn').attr('href','http://www.huihev.com/?987' );
    }
    // SOUHU
    if(reSH.test(videoSite)){
        var shTitle = $('.player-top-info-name');
        shTitle.append(vipBtn).append(mSearchBtn);
        shTitle.find('h2').css({'float':'left'});
        $('#huuiBtn').css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'30px','line-height':'30px','margin':'0 5px'});
        $('#huuiSearchBtn').css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'30px','line-height':'30px','margin':'0 5px'});
        curWords = shTitle.find('h2').text();
        $('#huuiSearchBtn').attr('href','http://www.huihev.com/?987' );
    }
    // SOUHUTV
    if(reSHTV.test(videoSite)){
        var shtvTitle = $('body');
        shtvTitle.append(vipBtn).append(mSearchBtn);
        $('#huuiBtn').css({'font-weight':'bold','font-size':'14px','display':'inline-block','height':'30px','line-height':'30px','margin':'0 5px','position':'fixed','z-index':'999999','top':'250px','left':'0px'});
        $('#huuiSearchBtn').css({'font-weight':'bold','font-size':'14px','display':'inline-block','height':'30px','line-height':'30px','margin':'0 5px','position':'fixed','z-index':'999998','top':'300px','left':'0px'});
        curWords = shtvTitle.text();
        $('#huuiSearchBtn').attr('href','http://www.huihev.com/?987' );
    }
    // acfun
    if(reAF.test(videoSite)){
        var afTitle = $('.crumbs');
        afTitle.append(vipBtn).append(mSearchBtn);
        $('#huuiBtn').css({'font-weight':'bold','font-size':'12px','display':'inline-block','height':'18px','line-height':'18px','margin':'0 5px'});
        $('#huuiSearchBtn').css({'font-weight':'bold','font-size':'12px','display':'inline-block','height':'18px','line-height':'18px','margin':'0 5px'});
        curWords = afTitle.text();
        $('#huuiSearchBtn').attr('href','http://www.huihev.com/?987' );
    }
    // bilibili
    if(reBL.test(videoSite)){
        var biliTitle = $('h1');
        biliTitle.after(mSearchBtn).after(vipBtn);
        $('#huuiBtn').css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'28px','line-height':'28px','margin':'0 5px'});
        $('#huuiSearchBtn').css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'28px','line-height':'28px','margin':'0 5px'});
        curWords = biliTitle.text();
        $('#huuiSearchBtn').attr('href','http://www.huihev.com/?987' );
    }
    // pptv
    if(rePP.test(videoSite)){
        var pptvTitle = $('.g-1408-hd');
        pptvTitle.after(mSearchBtn).after(vipBtn);
        $('#huuiBtn').css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'30px','line-height':'30px','margin':'0 5px'});
        $('#huuiSearchBtn').css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'30px','line-height':'30px','margin':'0 5px'});
        curWords = pptvTitle.text();
        $('#huuiSearchBtn').attr('href','http://www.huihev.com/?987' );
    }
    // m19
    if(rem19.test(videoSite)){
        var m19Title = $('.nav-title');
        m19Title.after(mSearchBtn).after(vipBtn);
        $('#huuiBtn').css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'30px','line-height':'30px','margin':'0 5px'});
        $('#huuiSearchBtn').css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'30px','line-height':'30px','margin':'0 5px'});
        curWords = m19Title.text();
        $('#huuiSearchBtn').attr('href','http://www.huihev.com/?987' );
    }
    // migu
    if(remigu.test(videoSite)){
        var miguTitle = $('.video_title');
        miguTitle.after(mSearchBtn).after(vipBtn);
        $('#huuiBtn').css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'30px','line-height':'30px','margin':'0 5px'});
        $('#huuiSearchBtn').css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'30px','line-height':'30px','margin':'0 5px'});
        curWords = miguTitle.text();
        $('#huuiSearchBtn').attr('href','http://www.huihev.com/?987' );
    }
    // yinyuetai
    if(reYYT.test(videoSite)){
        var yytTitle = $('.videoName');
        yytTitle.append(vipBtn);
        $('#huuiBtn').css({'font-weight':'bold','font-size':'14px','display':'inline-block','height':'28px','line-height':'28px','margin':'0 5px'});
    }
    $('#huuiBtn').on('click',function(){
        curPlaySite = window.location.href;
        window.location.href = 'http://appjx.huihev.com/appjx/svipjx/liulanqichajian/browserplugin/appjxwen/?' + curPlaySite;
    });
})();