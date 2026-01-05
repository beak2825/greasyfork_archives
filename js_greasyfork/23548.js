// ==UserScript==
// @name         斗鱼-鱼秀全屏
// @namespace    https://yuxiu.douyu.com/*
// @version      0.2
// @description  鱼秀伪全屏
// @author       You
// @match        https://yuxiu.douyu.com/*
// @grant        none
// @require         http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/23548/%E6%96%97%E9%B1%BC-%E9%B1%BC%E7%A7%80%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/23548/%E6%96%97%E9%B1%BC-%E9%B1%BC%E7%A7%80%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //alert($(window).height()+"-"+$(window).width());
    $('head').append("<style type='text/css'>.hide{display:none;} .pmz{padding:0 !important;margin:0 !important;} .ful{height:100% ! important;width:100% ! important;} .objsize{ position:absolute;top:2px;left:0;height:"+($(window).height())+"px;width:+"+$(window).width()+"px;}</style>");
    var isful=false;
    $('.yx-client').attr('href','javascript:void(1);').attr('id','fullcreen').find('span').text('全屏');
    $('#fullcreen').click(function(){
        if(isful){
            $('.show-layout-main').removeClass('pmz');
            $('#douyu_show_room_flash_proxy').removeClass('ful');
            $('.show-layout-gift-box').show();
            $('.show-layout-chat').show();
            $('.show-layout-stage').removeClass('pmz');
            $('.show-video-fix').show();
            $('.show-video-holder').removeClass('objsize');
            $('.show-layout-anchor').removeClass('hide');
            isful =!isful;
        }else{
            $('.show-video-holder').addClass('objsize');
            $('.show-layout-main').addClass('pmz');
            $('#douyu_show_room_flash_proxy').addClass('ful');
            $('.show-layout-gift-box').hide();
            $('.show-layout-chat').hide();
            $('.show-layout-stage').addClass('pmz');
            $('.show-video-fix').hide();
            $('.show-layout-anchor').addClass('hide');
            isful =!isful;
        }
    });
})();