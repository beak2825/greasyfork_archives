// ==UserScript==
// @name         电脑上查看微信文章时直接下载所有图片
// @version      0.6
// @description  Preload Images for WeChat
// @namespace    shoaly
// @author       shoaly
// @match        http://mp.weixin.qq.com/s?*
// @match        https://mp.weixin.qq.com/s?*
// @match        https://mp.weixin.qq.com/s?*
// @match        http://mp.weixin.qq.com/s/*
// @grant        GM_addStyle
// @run-at       document-start
// @require     https://cdn.bootcss.com/jquery/2.1.4/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/26278/%E7%94%B5%E8%84%91%E4%B8%8A%E6%9F%A5%E7%9C%8B%E5%BE%AE%E4%BF%A1%E6%96%87%E7%AB%A0%E6%97%B6%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD%E6%89%80%E6%9C%89%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/26278/%E7%94%B5%E8%84%91%E4%B8%8A%E6%9F%A5%E7%9C%8B%E5%BE%AE%E4%BF%A1%E6%96%87%E7%AB%A0%E6%97%B6%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD%E6%89%80%E6%9C%89%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==


GM_addStyle('img{width:100% !important;height:auto !important}');

(function($) {
    'use strict';
    $(function(){
        $('img').each(function(){
        var dataSrc = $(this).attr('data-src');
        
        if (dataSrc){
            $(this).attr('src', dataSrc);
            $(this).attr('_src', dataSrc);
            $(this).removeAttr('data-src');
            
        }
    });
    
    });
})(jQuery.noConflict(true));


