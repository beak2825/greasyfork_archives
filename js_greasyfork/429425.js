// ==UserScript==
// @name         图标 - iconfont
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  快速选择图标
// @author       ItSky71
// @match        https://www.iconfont.cn/collections/detail?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/429425/%E5%9B%BE%E6%A0%87%20-%20iconfont.user.js
// @updateURL https://update.greasyfork.org/scripts/429425/%E5%9B%BE%E6%A0%87%20-%20iconfont.meta.js
// ==/UserScript==

(function($) {
    'use strict';


    let cssStyle = '.block-radius-btn-group .radius-btn-cart{background-color:cornflowerblue;}.maskmagix{width:100vw;height:100vh;background-color:#f0f0f0;opacity:0.7;z-index:1000;position:absolute;top:0;left:0;display:flex;justify-content:center;align-items:center;}';
    cssStyle += '.maskmagix > .iconfont{font-size:100px;font-weight:bolder;animation: rotate 1.3s linear infinite;}@keyframes rotate{from{transform: rotate(0deg)}to{transform: rotate(359deg)}}.total{color:red;font-size:100px;position:absolute;top:0;left:41%;}'
    GM_addStyle(cssStyle);
    $(document).on('click', '.block-radius-btn-group:first-child > .radius-btn-cart', function(){
        $('body').css('overflow', 'hidden').append('<div class="maskmagix"><span class="iconfont">&#xe80d;</span></div>');
        //$('.block-sub-banner').append('<p class="total"><b class="current"></b>/<b>'+$('.collection-detail > ul.block-icon-list > li').length+'</b></p>');
        setTimeout(function(){
            $('.collection-detail > ul.block-icon-list > li').each(function(i){
                $(this).find('> .icon-cover > .icon-gouwuche1').click();
                $('.current').text(i+1);
                console.log(i+1);
                if (i+1 === $('ul.block-icon-list > li').length) {
                    $('body').css('overflow', 'auto');
                    $('.maskmagix').remove();
                }
            });
        },3000);
    });
    setTimeout(function(){
        let btnHtml = '<span class="radius-btn radius-btn-cart"><span class="iconfont radius-btn-inner">&#xe897;</span></span>';
        $('.block-radius-btn-group:first-child').prepend(btnHtml);
    }, 5000);
})($);