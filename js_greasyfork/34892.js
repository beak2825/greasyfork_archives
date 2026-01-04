// ==UserScript==
// @name         自用影视解析
// @namespace    http://huayu9527.com/
// @version      2.0.2
// @description  支持站点优酷、腾讯、乐视、爱奇艺、芒果、哔哩哔哩、音悦台等网站VIP或会员视频、可以使用直接解析以及更多接口解析。代码是前辈的、本人只是持续更新接口而已，大神勿怪！
// @author       花语（hy）
// @org-author   花语 https://greasyfork.org/zh-CN/scripts/32023
// @icon         http://huayu9527.com/favicon.ico
// @match        *://*.iqiyi.com/v_*
// @match        *://v.youku.com/*
// @match        *://*.le.com/*
// @match        *://v.qq.com/*
// @match        *://*.tudou.com/*
// @match        *://*.mgtv.com/*
// @match        *://film.sohu.com/*
// @match        *://*.acfun.cn/v/*
// @match        *://*.bilibili.com/video/*
// @match        *://vip.1905.com/play/*
// @match        *://v.pptv.com/*
// @match        *://v.yinyuetai.com/video/*
// @match        *://v.yinyuetai.com/playlist/*
// @match        *://*.fun.tv/vplay/*
// @match        *://*.wasu.cn/Play/show/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/34892/%E8%87%AA%E7%94%A8%E5%BD%B1%E8%A7%86%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/34892/%E8%87%AA%E7%94%A8%E5%BD%B1%E8%A7%86%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==
var debug = false;
var log_count = 1;
function slog(c1,c2,c3){
    c1 = c1?c1:'';
    c2 = c2?c2:'';
    c3 = c3?c3:'';
    if(debug) console.log('#'+ log_count++ +'-ScriptLog:',c1,c2,c3);
}

var theplayurl = window.location.href;

(function() {
    'use strict';
    GM_addStyle('#TManays{z-index:99999; position:absolute; left:0px; top:0px; width:170px; height:auto; border:0; margin:0;}'+
                '#TMul{position:fixed; left:-156px; top:145px;width:140px; background-color:#555; opacity:0.8; border:3px solid #555; list-style:none; margin:0; padding:5px;}'+
                '#TMul li{margin:0; padding:3px;} '+
                '#TMul li a{font-size:15px; margin:0; padding:3px; color:white;} '+
                '#TMGobtn{position:fixed; left:0; top:100px;cursor:pointer;outline:none; width:70px; height:40px; border-width:2px 4px 2px 0px; border-color:#008B00; background-color:#008B00; border-style:solid; font:12px "微软雅黑"; color:#FFFFFF; margin:0; padding:0;} '+
                '#TMbtn{position:fixed; left:0; top:145px;cursor:pointer;outline:none; width:70px; height:40px; border-width:2px 4px 2px 0px; border-color:#008B00; background-color:#008B00; border-style:solid; font:12px "微软雅黑"; color:#FFFFFF; margin:0; padding:0;}');
    function btnTg(){
		var btn=document.getElementById("TMbtn");
		var ul=document.getElementById("TMul");
		if(btn.style.left===""||parseInt(btn.style.left)<10){btn.style.left=156+"px";ul.style.left=0; btn.innerText="折叠 ◀";}else{btn.style.left=0;ul.style.left=-156+"px"; btn.innerText="VIP破解 ▶";}
	}

	function preload_all(){
		if(theplayurl.indexOf('iqiyi') > 0) preload_iqiyi();
	}

    function preload_iqiyi(){
        slog('albumId',Q.PageInfo.playPageInfo.albumId);
        if(Q.PageInfo.playPageInfo.albumId !== undefined ){
            var s = document.createElement("script"), el = document.getElementsByTagName("script")[0];
            s.async = false;
            s.src = document.location.protocol + "//cache.video.qiyi.com/jp/avlist/"+ Q.PageInfo.playPageInfo.albumId +"/1/50/";
            el.parentNode.insertBefore(s, el);
        }
	}
	function prego_all(){
		if(theplayurl.indexOf('iqiyi') > 0) prego_iqiyi();
	}
    function prego_iqiyi(){
		var ele = document.querySelectorAll('li[class="item selected"] > span').length ? document.querySelectorAll('li[class="item selected"] > span')[1] : document.querySelectorAll('li[class="item no selected"] > span')[1];
        if(ele !== undefined ){
            var pd = ele.parentNode.getAttribute('data-pd');
            if(pd > 0){
                var vinfo = tvInfoJs.data.vlist[pd-1];
                if(vinfo.vurl.length > 0){
                    theplayurl = vinfo.vurl;
                }
            }
        }
    }
    function btnGo(){
        prego_all();
        window.open('https://www.zwbing.com/Video/VipAnalysis/?url='+theplayurl, "_blank");
    }
    preload_all();
    var div=document.createElement("div");
    div.innerHTML='<div id="TManays">'+
  '<ul id="TMul">'+
        '<li><a href="http://api.zuilingxian.com/jiexi.php?url='+theplayurl+'" target="_blank">新崛起解析1</a></li>'+
        '<li><a href="http://api.niubijiexi.com/jiexi.php?url='+theplayurl+'" target="_blank">新崛起解析2</a></li>'+
        '<li><a href="http://g.o.t.o.tutulai.cn/?url='+theplayurl+'" target="_blank">无名解析1</a></li>'+
        '<li><a href="http://jiexi.92fz.cn/player/vip.php?url='+theplayurl+'" target="_blank">无名解析2</a></li>'+
        '<li><a href="http://www.85105052.com/index/qqvod.php?url='+theplayurl+'" target="_blank">无名小站1</a></li>'+
        '<li><a href="http://www.16891699.com/index.php?url='+theplayurl+'" target="_blank">无名小站2</a></li>'+
        '<li><a href="http://www.82190555.com/index/qqvod.php?url='+theplayurl+'" target="_blank">无名小站3</a></li>'+
        '<li><a href="ttp://jqaaa.com/jx.php?url='+theplayurl+'" target="_blank">金桥解析</a></li>'+
        '<li><a href="http://mzlitv.iego.cn/jx/?url='+theplayurl+'" target="_blank">Mzli解析</a></li>'+
        '<li><a href="http://api.koflv.cn/url.php?url='+theplayurl+'" target="_blank">蚂蚁解析</a></li>'+
        '<li><a href="http://62jz.com/?url='+theplayurl+'" target="_blank">62jx解析</a></li>'+
        '<li><a href="http://vip.pohaier.com/kkflv/index.php?url='+theplayurl+'" target="_blank">酷云解析</a></li>'+
        '<li><a href="http://jx.2012net.com/index.php?url='+theplayurl+'" target="_blank">QQqun解析</a></li>'+
        '<li><a href="http://api.zj0763.com/index.php?url='+theplayurl+'" target="_blank">指尖解析</a></li>'+
        '<li><a href="http://j.zz22x.com/jx/?url='+theplayurl+'" target="_blank">花园解析</a></li>'+
        '<li><a href="http://www.s8zy.cn/xnflv/index.php?url='+theplayurl+'" target="_blank">乐乐解析</a></li>'+
        '<li><a href="http://jiexi.hbpo.pw/index.php?url='+theplayurl+'" target="_blank">树圈云解析</a></li>'+
        '<li><a href="http://y.mt2t.com/lines?url='+theplayurl+'" target="_blank">云播放解析</a></li>'+
        '<li><a href="http://014670.cn/jx/qy.php?url='+theplayurl+'" target="_blank">强强解析</a></li>'+
        '<li><a href="http://lesafo.cn/cos/cos.php?url='+theplayurl+'" target="_blank">九月sept</a></li>'+
        '<li><a href="http://ac.zuilingxian.com/2080sp/?url='+theplayurl+'" target="_blank">zuilingxian</a></li>'+
        '<li><a href="http://y.qin52.com/xnflv/index.php?url='+theplayurl+'" target="_blank">qin52解析</a></li>'+
        '<li><a href="http://beaacc.com/api.php?url='+theplayurl+'" target="_blank">beac解析</a></li>'+
        '<li><a href="http://api.wlzhan.com/sudu/?url='+theplayurl+'" target="_blank">速度牛解析</a></li>'+
        '<li><a href="http://api.pucms.com/index.php?url='+theplayurl+'" target="_blank">品优解析</a></li>'+
        '<li><a href="http://api.1008net.com/v.php?url='+theplayurl+'" target="_blank">1008解析</a></li>'+
        '<li><a href="http://www.vipjiexi.com/yun.php?url='+theplayurl+'" target="_blank">52解析</a></li>'+
        '<li><a href="http://tool.mkblog.cn/yinyuetai/index.php?vid='+theplayurl+'" target="_blank">音悦台MV解析</a></li>'+
   '</ul>'+
	'<button id="TMGobtn">默认VIP</button>'+
	'<button id="TMbtn">VIP破解 ▶</button>'+
  '</div>';
    document.body.appendChild(div);
    document.querySelector("#TMGobtn").addEventListener("click",btnGo,false);
    document.querySelector("#TMbtn").addEventListener("click",btnTg,false);
})();


// 以下为标题边显示


// ==UserScript==
// @name         VIP视频在线解析
// @namespace    http://goudidiao.com/
// @version      1.3.6
// @description  在视频标题旁上显示“vip解析”按钮和“搜索电影”按钮，在线播放vip视频；支持优酷vip，腾讯vip，爱奇艺vip，芒果vip，乐视vip等常用视频...
// @author       goudidiao
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
    var vipBtn = '<a id="goudidiaoVipBtn" style="cursor:pointer;text-decoration:none;color:red;padding:0 5px;border:1px solid red;">vip解析</a>';
    var mSearchBtn = '<a id="goudidiaoSearchBtn" target="_blank" style="cursor:pointer;text-decoration:none;color:red;padding:0 5px;border:1px solid red;">搜索电影</a>';
    // 优酷
    if(reYk.test(videoSite)){
        var youkuTitle = $('#subtitle');
        if(youkuTitle.length !== 0){
        	youkuTitle.parent('.title').after(mSearchBtn).after(vipBtn);
	        $('#goudidiaoVipBtn').css({'font-size':'17px','display':'inline-block','height':'22px','line-height':'22px','margin':'0 5px','vertical-align':'bottom'});
	        $('#goudidiaoSearchBtn').css({'font-size':'17px','display':'inline-block','height':'22px','line-height':'22px','margin':'0 5px','vertical-align':'bottom'});
	        if($('.tvinfo').length !== 0){
	        	curWords = $('.tvinfo').find('h3').eq(0).text();
	        }else{
	        	curWords = $('.title').attr('title');
	        }
	        $('#goudidiaoSearchBtn').attr('href','http://ifkdy.com/?q=' + curWords + '&p=1');
        }else{
        	$('.title').after(mSearchBtn).after(vipBtn);
        	$('#goudidiaoVipBtn').css({'font-size':'17px','display':'inline-block','height':'22px','line-height':'22px','margin':'0 5px','vertical-align':'bottom'});
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
        iqiyiTitle.parent('.mod-play-tit').append(vipBtn).append(mSearchBtn);
        $('#goudidiaoVipBtn').css({'font-size':'17px','display':'inline-block','height':'24px','line-height':'24px','margin':'0 5px'});
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
        lsTitle.after(mSearchBtn).after(vipBtn);
        lsTitle.css('float','left');
        $('#goudidiaoVipBtn').css({'font-size':'16px','display':'inline-block','height':'20px','line-height':'20px','margin':'0 5px'});
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
        qqTitle.eq(0).after(mSearchBtn).after(vipBtn);
        $('#goudidiaoVipBtn').css({'font-size':'24px','display':'inline-block','height':'36px','line-height':'36px','margin':'0 5px'});
        $('#goudidiaoSearchBtn').css({'font-size':'24px','display':'inline-block','height':'36px','line-height':'36px','margin':'0 5px'});
        if($('.player_title').length !== 0 && $('.player_title').find('a').length === 0){
        	curWords = $('.player_title').text();
        }else{
        	curWords = $('._base_title').text();
        }
        if(curWords === ''){
        	curWords = $('.player_title').text();
        }
        $('#goudidiaoSearchBtn').attr('href','http://ifkdy.com/?q=' + curWords + '&p=1');
    }
    // 土豆
    if(reTD.test(videoSite)){
        var tdTitle = $('#videoKw');
        tdTitle.parent('.fix').append(vipBtn);
        $('#goudidiaoVipBtn').css({'font-size':'18px','display':'inline-block','height':'22px','line-height':'22px','margin':'14px 5px 0'});
    }
    // 芒果
    if(reMG.test(videoSite)){
        var mgTitle = $('.v-panel-title');
        mgTitle.after(mSearchBtn).after(vipBtn);
        mgTitle.css({'float':'left','margin-right':'0'});
        $('#goudidiaoVipBtn').css({'font-size':'22px','display':'inline-block','height':'40px','line-height':'40px','margin':'0 5px'});
        $('#goudidiaoSearchBtn').css({'font-size':'22px','display':'inline-block','height':'40px','line-height':'40px','margin':'0 5px'});
    	curWords = mgTitle.text();
        $('#goudidiaoSearchBtn').attr('href','http://ifkdy.com/?q=' + curWords + '&p=1');
    }
    // 搜狐
    if(reSH.test(videoSite)){
        var shTitle = $('.player-top-info-name');
        shTitle.append(vipBtn).append(mSearchBtn);
        shTitle.find('h2').css({'float':'left'});
        $('#goudidiaoVipBtn').css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'36px','line-height':'36px','margin':'0 5px'});
        $('#goudidiaoSearchBtn').css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'36px','line-height':'36px','margin':'0 5px'});
        curWords = shTitle.find('h2').text();
        $('#goudidiaoSearchBtn').attr('href','http://ifkdy.com/?q=' + curWords + '&p=1');
    }
    // acfun
    if(reAF.test(videoSite)){
        var acTitle = $('.head').find('.title');
        acTitle.append(vipBtn);
        $('#goudidiaoVipBtn').css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'20px','line-height':'20px','margin':'0 5px'});
    }
    // bilibili
    if(reBL.test(videoSite)){
        var biliTitle = $('.v-title').find('h1');
        biliTitle.after(vipBtn);
        biliTitle.css({'float':'left','margin-right':'0'});
        $('#goudidiaoVipBtn').css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'36px','line-height':'36px','margin':'0 5px'});
    }
    // pptv
    if(rePP.test(videoSite)){
        var pptvTitle = $('.title_video').find('h3');
        pptvTitle.after(mSearchBtn).after(vipBtn);
        $('#goudidiaoVipBtn').css({'font-weight':'bold','font-size':'16px','display':'inline-block','height':'36px','line-height':'36px','margin':'0 5px'});
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