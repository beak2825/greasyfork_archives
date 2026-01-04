// ==UserScript==
// @name         奈飞星去广告
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  去掉棋牌广告和播放器顶端二维码，弹窗半透明化，白色主题下显示LOGO全部内容
// @author       AN drew
// @match        *://*.nfstar.net/*
// @match        *://*.nfstar.co/*
// @match        *://*.nfstar.vip/*
// @match        *://*.nfstar.video/*
// @match        *://*.nfxhd.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/419360/%E5%A5%88%E9%A3%9E%E6%98%9F%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/419360/%E5%A5%88%E9%A3%9E%E6%98%9F%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //去掉棋牌广告和播放器顶端二维码
    setInterval(function(){
        $('img.img-responsive:not([class*=xs])').closest('div').hide();
        $('.bottom_fixed').hide();
    },100);


    //弹窗半透明化
    GM_addStyle('.layui-layer.layui-layer-page{background:rgba(255,255,255,0.5)}'+
                '.layui-layer.layui-layer-page.layui-layer-rim{background:rgba(255,255,255,0.5)}'+
                '.myui-msg__form.ajax_login.layui-layer-wrap{background:rgba(255,255,255,0.5)}'+
                '.layui-layer-ico.layui-layer-close.layui-layer-close2{filter:opacity(0.9)}'+
                'strong{color:black}'+
                '.myui-msg__form.ajax_login p, .myui-msg__form.ajax_login a{color:black}'+
                'input.form-control, input.btn{color:black}'+
                '.btn.btn-block.btn-warm{color:#ffffffe6}'+
                '.btn.btn-block.btn-info{color:#ffffffe6}');


    /*
    //白色主题下显示LOGO全部内容
    setInterval(function(){
        if($("link[name='default']").attr('href').indexOf('mytheme-color3.css') > -1 || $("link[name='default']").attr('href').indexOf('mytheme-color.css') > -1)
        {
            $('.logo .img-responsive.hidden-xs').css({'filter': 'invert(0.2)'});
        }
        else
        {
            $('.logo .img-responsive.hidden-xs').css({'filter': 'none'});
        }
    },500);
    */
})();