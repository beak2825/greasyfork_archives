// ==UserScript==
// @name         hao123广告屏蔽
// @namespace   https://github.com/zhangyunxing/xing
// @version      0.1.5
// @description  enter something useful
// @author       zhangyunxing
// @match        https://www.hao123.com/*
// @match        https://pos.baidu.com/*
// @require      http://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/410996/hao123%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/410996/hao123%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==
  
(function() {
    'use strict';
    var loadTime = 1000;		// 延迟加载广告的加载时间
    var slowLoadTime = 2500;	// 高延迟加载广告的加载时间
    var refreshTime = 1000;		// 反复加载广告的检测刷新时间
    // 去除hao123页面的广告
    if(location.href.indexOf('hao123') > 0){
           $('.topbe-content').remove();
            $('#topbeWrapper').remove();
            $('#shortcut-box').remove();
            $("#_u3554099_0").remove();
            $('#hotsearch-box').remove();
            $('#notice').remove();
            $('#coolsites_wrapper').remove(); 
            $('.cproad1').remove(); 
            //$("li.wm ").remove();
            $('code').remove();
            $('#lefttip').remove();//删除左侧悬浮小广告
            $('.haohuimai').remove();//删除好会买广告
            $('#navrecommend-hjw').remove(); //删除游戏广告
        	//$('div  iframe').remove();
          console.log('固定广告删除 ');
    }
     // 去除推广iframe中的广告
    if(location.href.indexOf('pos.baidu') > 0){
        //location.href='';
       // $("body").remove();
        $("html").remove();
       // window.opener = null;
       //  window.close();
         console.log('推广广告删除 ');
    };
    
    setTimeout(function(){
            // 横幅广告
            $("li.wm ").remove();
         console.log('延迟广告删除');
        }, loadTime);
        setInterval(function(){
            // 条目中的广告
        $("li.wm ").remove();
        $('.siye').remove();
        }, refreshTime);
})();

window.onload=function(){
    $("li.wm ").remove();
                        };