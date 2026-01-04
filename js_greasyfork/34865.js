// ==UserScript==
// @name         视频解析
// @namespace    By 海
// @version      1.1
// @description  在视频标题旁上显示“vip解析”按钮和“搜索电影”按钮，在线播放vip视频；支持优酷vip，腾讯vip，爱奇艺vip，芒果vip，乐视vip等常用视频...
// @author       xuxx
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
// @downloadURL https://update.greasyfork.org/scripts/34865/%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/34865/%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var curPlaySite = window.location.href;
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
    var vipBtn = '<a id="goudidiaoVipBtn" target="_blank" style="cursor:pointer;text-decoration:none;color:red;padding:0 5px;border:1px solid red;">vip解析</a>';
    var mSearchBtn = '<a id="goudidiaoSearchBtn" target="_blank" style="cursor:pointer;text-decoration:none;color:red;padding:0 5px;border:1px solid red;">搜索电影</a>';
    var cracks=[
        {id:1,name:"强强解析",url:"http://www.014670.cn/jx/qy.php?url=",title:"首选"},
        {id:2,name:"高低调",url:"http://goudidiao.com/?url="},

    ];
    var btn=["b1","b2","b3"];
    // 优酷
    if(reYk.test(videoSite)){
        var youkuTitle = $('#subtitle');
        curPlaySite = window.location.href;
        if(youkuTitle.length !== 0){

            cracks.forEach(function(item){
                var bttn='<a id="goudidiaoVipBtn'+item.id+'" target="_blank" style="cursor:pointer;text-decoration:none;color:red;padding:0 5px;border:1px solid red;">免费线路'+item.id+'</a>';
                youkuTitle.parent('.title').append( bttn);
                $("#goudidiaoVipBtn"+item.id+"").css({'font-size':'17px','display':'inline-block','height':'22px','line-height':'22px','margin':'0 5px','vertical-align':'bottom'});
                $("#goudidiaoVipBtn"+item.id+"").attr('href',item.url+curPlaySite+"" );
            });
            youkuTitle.parent('.title').append(mSearchBtn);
            // $('#goudidiaoVipBtn').css({'font-size':'17px','display':'inline-block','height':'22px','line-height':'22px','margin':'0 5px','vertical-align':'bottom'});
            $('#goudidiaoSearchBtn').css({'font-size':'17px','display':'inline-block','height':'22px','line-height':'22px','margin':'0 5px','vertical-align':'bottom'});
            if($('.tvinfo').length !== 0){
                curWords = $('.tvinfo').find('h3').eq(0).text();
            }else{
                curWords = $('.title').attr('title');
            }
            $('#goudidiaoSearchBtn').attr('href','http://ifkdy.com/?q=' + curWords + '&p=1');
        }else{
            cracks.forEach(function(item){
                var bttn='<a id="goudidiaoVipBtn'+item.id+'" target="_blank" style="cursor:pointer;text-decoration:none;color:red;padding:0 5px;border:1px solid red;">免费线路'+item.id+'</a>';
                $('.title').append( bttn);
                $("#goudidiaoVipBtn"+item.id+"").css({'font-size':'17px','display':'inline-block','height':'22px','line-height':'22px','margin':'0 5px','vertical-align':'bottom'});
                $("#goudidiaoVipBtn"+item.id+"").attr('href',item.url+curPlaySite+"" );
            });
            $('.title').append(mSearchBtn);
            //$('#goudidiaoVipBtn').css({'font-size':'17px','display':'inline-block','height':'22px','line-height':'22px','margin':'0 5px','vertical-align':'bottom'});
            $('#goudidiaoSearchBtn').css({'font-size':'17px','display':'inline-block','height':'22px','line-height':'22px','margin':'0 5px','vertical-align':'bottom'});
            if($('.tvinfo').length !== 0){
                curWords = $('.tvinfo').find('h3').eq(0).text();
            }else{
                curWords = $('.title').attr('title');
            }
            $('#goudidiaoSearchBtn').attr('href','http://ifkdy.com/?q=' + curWords + '&p=1');
        }
    }
    // 爱奇艺
    if(reAqy.test(videoSite)){
        var iqiyiTitle = $('#widget-videotitle');
            cracks.forEach(function(item){
            var bttn='<a id="goudidiaoVipBtn'+item.id+'" target="_blank" style="cursor:pointer;text-decoration:none;color:red;padding:0 5px;border:1px solid red;">免费线路'+item.id+'</a>';
            iqiyiTitle.parent('.mod-play-tit').append(bttn);
            $("#goudidiaoVipBtn"+item.id+"").css({'font-size':'17px','display':'inline-block','height':'24px','line-height':'24px','margin':'0 5px'});
            $("#goudidiaoVipBtn"+item.id+"").attr('href',item.url+curPlaySite+"" );
        });
         iqiyiTitle.parent('.mod-play-tit').append(mSearchBtn);
               //$('#goudidiaoVipBtn').css({'font-size':'17px','display':'inline-block','height':'24px','line-height':'24px','margin':'0 5px'});
        $('#goudidiaoSearchBtn').css({'font-size':'17px','display':'inline-block','height':'24px','line-height':'24px','margin':'0 5px'});
        if($('#drama-series-title').length !== 0){
            curWords = $('#drama-series-title').find('a').text();
        }else{
            curWords = iqiyiTitle.text();
        }
        $('#goudidiaoSearchBtn').attr('href','http://ifkdy.com/?q=' + curWords + '&p=1');
    }
    // 乐视
    if(reLS.test(videoSite)){
        var lsTitle = $('.j-video-name');
        lsTitle.css('float','left');
        cracks.forEach(function(item){
            var bttn='<a id="goudidiaoVipBtn'+item.id+'" target="_blank" style="cursor:pointer;text-decoration:none;color:red;padding:0 5px;border:1px solid red;">免费线路'+item.id+'</a>';
            lsTitle.append( bttn);
            $("#goudidiaoVipBtn"+item.id+"").css({'font-size':'16px','display':'inline-block','height':'20px','line-height':'20px','margin':'0 5px'});
            $("#goudidiaoVipBtn"+item.id+"").attr('href',item.url+curPlaySite+"" );
        });
        lsTitle.append(mSearchBtn);
        //$('#goudidiaoVipBtn').css({'font-size':'16px','display':'inline-block','height':'20px','line-height':'20px','margin':'0 5px'});
        $('#goudidiaoSearchBtn').css({'font-size':'16px','display':'inline-block','height':'20px','line-height':'20px','margin':'0 5px'});
        if($('.Info').find('.title').find('h3').length !== 0){
            curWords = $('.Info').find('.title').find('h3').text();
        }else{
            curWords = lsTitle.text();
        }
        $('#goudidiaoSearchBtn').attr('href','http://ifkdy.com/?q=' + curWords + '&p=1');
    }
    // 腾讯
    if(reTX.test(videoSite)){
        var qqTitle = $('.mod_intro').find('.video_title');
        cracks.forEach(function(item){
            var bttn='<a id="goudidiaoVipBtn'+item.id+'" target="_blank" style="cursor:pointer;text-decoration:none;color:red;padding:0 5px;border:1px solid red;">免费线路'+item.id+'</a>';
            qqTitle.eq(0).append( bttn);
            $("#goudidiaoVipBtn"+item.id+"").css({'font-size':'24px','display':'inline-block','height':'36px','line-height':'36px','margin':'0 5px'});
            $("#goudidiaoVipBtn"+item.id+"").attr('href',item.url+curPlaySite+"" );
        });
        qqTitle.eq(0).append(mSearchBtn);
        //$('#goudidiaoVipBtn').css({'font-size':'24px','display':'inline-block','height':'36px','line-height':'36px','margin':'0 5px'});
        $('#goudidiaoSearchBtn').css({'font-size':'24px','display':'inline-block','height':'36px','line-height':'36px','margin':'0 5px'});
        if($('.player_title').length !== 0 && $('.player_title').find('a').length === 0){
            curWords = $('.player_title').text();
        }else{
            curWords = $('._base_title').text();
        }
        if(curWords === ''){
            curWords = $('.player_title').text();
        }
        $('#goudidiaoSearchBtn').attr('href','http://ifkdy.com/?q=' + curWords+ '&p=1');
    }
    // 土豆
    if(reTD.test(videoSite)){
        var tdTitle = $('#videoKw');
        tdTitle.parent('.fix');
        cracks.forEach(function(item){
            var bttn='<a id="goudidiaoVipBtn'+item.id+'" target="_blank" style="cursor:pointer;text-decoration:none;color:red;padding:0 5px;border:1px solid red;">免费线路'+item.id+'</a>';
            tdTitle.append( bttn);
            $("#goudidiaoVipBtn"+item.id+"").css({'font-size':'18px','display':'inline-block','height':'22px','line-height':'22px','margin':'14px 5px 0'});
            $("#goudidiaoVipBtn"+item.id+"").attr('href',item.url+curPlaySite+"" );
        });
        //$('#goudidiaoVipBtn').css({'font-size':'18px','display':'inline-block','height':'22px','line-height':'22px','margin':'14px 5px 0'});
    }
    // 芒果
    if(reMG.test(videoSite)){
        var mgTitle = $('.v-panel-title');
        mgTitle.css({'float':'left','margin-right':'0'});
        cracks.forEach(function(item){
            var bttn='<a id="goudidiaoVipBtn'+item.id+'" target="_blank" style="cursor:pointer;text-decoration:none;color:red;padding:0 5px;border:1px solid red;">免费线路'+item.id+'</a>';
            mgTitle.append( bttn);
            $("#goudidiaoVipBtn"+item.id+"").css({'font-size':'22px','display':'inline-block','height':'40px','line-height':'40px','margin':'0 5px'});
            $("#goudidiaoVipBtn"+item.id+"").attr('href',item.url+curPlaySite+"" );
        });
        mgTitle.append(mSearchBtn);
        //$('#goudidiaoVipBtn').css({'font-size':'22px','display':'inline-block','height':'40px','line-height':'40px','margin':'0 5px'});
        $('#goudidiaoSearchBtn').css({'font-size':'22px','display':'inline-block','height':'40px','line-height':'40px','margin':'0 5px'});
        curWords = mgTitle.text();
        $('#goudidiaoSearchBtn').attr('href','http://ifkdy.com/?q=' + curWords + '&p=1');
    }
    // 搜狐
    if(reSH.test(videoSite)){
        var shTitle = $('.player-top-info-name');
        shTitle.find('h2').css({'float':'left'});
        cracks.forEach(function(item){
            var bttn='<a id="goudidiaoVipBtn'+item.id+'" target="_blank" style="cursor:pointer;text-decoration:none;color:red;padding:0 5px;border:1px solid red;">免费线路'+item.id+'</a>';
            shTitle.append( bttn);
            $("#goudidiaoVipBtn"+item.id+"").css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'36px','line-height':'36px','margin':'0 5px'});
            $("#goudidiaoVipBtn"+item.id+"").attr('href',item.url+curPlaySite+"" );
        });
        shTitle.append(mSearchBtn);
        // $('#goudidiaoVipBtn').css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'36px','line-height':'36px','margin':'0 5px'});
        $('#goudidiaoSearchBtn').css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'36px','line-height':'36px','margin':'0 5px'});
        curWords = shTitle.find('h2').text();
        $('#goudidiaoSearchBtn').attr('href','http://ifkdy.com/?q=' + curWords + '&p=1');
    }
    // acfun
    if(reAF.test(videoSite)){
        var acTitle = $('.head').find('.title');
        // acTitle.append(vipBtn);
        cracks.forEach(function(item){
            var bttn='<a id="goudidiaoVipBtn'+item.id+'" target="_blank" style="cursor:pointer;text-decoration:none;color:red;padding:0 5px;border:1px solid red;">免费线路'+item.id+'</a>';
            acTitle.append( bttn);
            $("#goudidiaoVipBtn"+item.id+"").css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'20px','line-height':'20px','margin':'0 5px'});
            $("#goudidiaoVipBtn"+item.id+"").attr('href',item.url+curPlaySite+"" );
        });
        //$('#goudidiaoVipBtn').css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'20px','line-height':'20px','margin':'0 5px'});
    }
    // bilibili
    if(reBL.test(videoSite)){
        var biliTitle = $('.v-title').find('h1');
        // biliTitle.append(vipBtn);
        biliTitle.css({'float':'left','margin-right':'0'});
        cracks.forEach(function(item){
            var bttn='<a id="goudidiaoVipBtn'+item.id+'" target="_blank" style="cursor:pointer;text-decoration:none;color:red;padding:0 5px;border:1px solid red;">免费线路'+item.id+'</a>';
            biliTitle.append( bttn);
            $("#goudidiaoVipBtn"+item.id+"").css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'36px','line-height':'36px','margin':'0 5px'});
            $("#goudidiaoVipBtn"+item.id+"").attr('href',item.url+curPlaySite+"" );
        });
        //$('#goudidiaoVipBtn').css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'36px','line-height':'36px','margin':'0 5px'});
    }
    // pptv
    if(rePP.test(videoSite)){
        var pptvTitle = $('.title_video').find('h3');
        cracks.forEach(function(item){
            var bttn='<a id="goudidiaoVipBtn'+item.id+'" target="_blank" style="cursor:pointer;text-decoration:none;color:red;padding:0 5px;border:1px solid red;">免费线路'+item.id+'</a>';
            pptvTitle.append( bttn);
            $("#goudidiaoVipBtn"+item.id+"").css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'36px','line-height':'36px','margin':'0 5px'});
            $("#goudidiaoVipBtn"+item.id+"").attr('href',item.url+curPlaySite+"" );
        });
        pptvTitle.append(mSearchBtn);
        // $('#goudidiaoVipBtn').css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'36px','line-height':'36px','margin':'0 5px'});
        $('#goudidiaoSearchBtn').css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'36px','line-height':'36px','margin':'0 5px'});
        curWords = pptvTitle.text();
        $('#goudidiaoSearchBtn').attr('href','http://ifkdy.com/?q=' + curWords + '&p=1');
    }
    // 音悦台
    if(reYYT.test(videoSite)){
        var yytTitle = $('.videoName');
        yytTitle.append(vipBtn);
        $('#goudidiaoVipBtn').css({'font-weight':'bold','font-size':'14px','display':'inline-block','height':'32px','line-height':'32px','margin':'0 5px'});
    }
    $('#goudidiaoVipBtn').on('click',function(){
        curPlaySite = window.location.href;
        window.location.href = 'http://goudidiao.com/?url=' + curPlaySite;
    });
})();