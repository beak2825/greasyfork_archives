// ==UserScript==
// @name         网站样式增强
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  站点logo、样式调整，居家摸鱼必备
// @author       zherop@163.com
// @match        *://*/*
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant unsafeWindow
// @grant GM_openInTab
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/469523/%E7%BD%91%E7%AB%99%E6%A0%B7%E5%BC%8F%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/469523/%E7%BD%91%E7%AB%99%E6%A0%B7%E5%BC%8F%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var logoFile = 'https://cdn.efunds.com.cn/owch/upload/resources/image/2021/11/04/1040.png';
    var ico = 'https://www.efunds.com.cn/assets/images/favicon.ico';
    var logoURL = 'https://www.efunds.com.cn/';

    // 处理部分站点的样式
    function handleSiteStyle() {
       if(window.location.href.startsWith("https://xueqiu.com")) {
           // 雪球
           $('link[rel="shortcut icon"]').attr("href",ico)
           $(".nav__logo").css('background','url('+ logoFile +') no-repeat 50%');
           $(".nav__logo").css('background-size','100% 100%');
           $(".nav").css('background-color','#bebebe');
           $(".nav__logo").attr("href",logoURL)
       }
       if(window.location.href.startsWith("http://www.iwencai.com/")) {
           // i问财
           $(".wencai-logo-link").attr("href",logoURL);
           $(".wencai-logo").attr("src",logoFile);
           $('link[rel="icon"]').attr("href",ico);
       }
    }

    $(function(){
        // 处理网站样式
         handleSiteStyle();
    })
})();