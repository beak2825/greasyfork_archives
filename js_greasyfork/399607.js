// ==UserScript==
// @name         中关村企业统一申报服务平台
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  移除页面浮窗
// @author       Human
// @match        http://120.52.185.156:28068/*
// @grant        document-end
// @downloadURL https://update.greasyfork.org/scripts/399607/%E4%B8%AD%E5%85%B3%E6%9D%91%E4%BC%81%E4%B8%9A%E7%BB%9F%E4%B8%80%E7%94%B3%E6%8A%A5%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/399607/%E4%B8%AD%E5%85%B3%E6%9D%91%E4%BC%81%E4%B8%9A%E7%BB%9F%E4%B8%80%E7%94%B3%E6%8A%A5%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(!$){
        var s = document.createElement ("script");
        s.src = "http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js";
        s.async = false;
        document.documentElement.appendChild (s);
    }

    $(document).ready(function(){
        const {pathname} = window.location
        if(pathname.includes('index.do')){
            const src = $('#ad1 img').attr('src');
            if(src) $('.header_content .logo').append(`<img style="width: 100px;" src="${src}">`);
        }else{
            const html = $('#ad1 span:nth-child(2)').text();
            if(html) $('header').append(`<div style="font-size:12px !important;position:absolute;right:0;top:0;width:450px;padding:4px;background: rgba(255,255,255,0.8)">${html}</div>`)
        }
        $('#ad1').remove();
    });
})();
