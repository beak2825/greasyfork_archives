// ==UserScript==
// @name         获取微信公众号历史消息链接
// @version      0.5
// @description  Get History Msg Links for WeChat
// @namespace    http://www.cnblogs.com/Chary/
// @author       CharyGao
// @match        http://mp.weixin.qq.com/s?*
// @match        https://mp.weixin.qq.com/s?*
// @match        https://mp.weixin.qq.com/s?*
// @match        http://mp.weixin.qq.com/s/*
// @match        file:///*
// @grant        GM_addStyle
// @run-at       document-start
// @require     https://cdn.bootcss.com/jquery/3.3.1/jquery.js
// @icon         https://res.wx.qq.com/zh_CN/htmledition/v2/images/favicon31e225.ico
// @downloadURL https://update.greasyfork.org/scripts/370729/%E8%8E%B7%E5%8F%96%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E5%8E%86%E5%8F%B2%E6%B6%88%E6%81%AF%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/370729/%E8%8E%B7%E5%8F%96%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E5%8E%86%E5%8F%B2%E6%B6%88%E6%81%AF%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

GM_addStyle('span.weui_media_hd{width:100px!important;float:left!important;} ' +
    '#down_url_links{white-space:nowrap!important;background-color:orange!important;} ' +
    //'#img-content{position:fixed!important;z-index:100!important;top:20px!important;left:2%!important;height:95%!important;width:96%!important;overflow:scroll!important;}' +
    //'.img_loading{margin-left: auto;margin-right: auto;display: block;} .rich_media_area_primary_inner{max-width: 90%!important;}'+
    '#js_pc_qr_code{visibility:hidden!important;}' +
    '#page-content{background-color:rgba(0,0,0,0)!important;}' +
    '#js_profile_qrcode_img{height:100px!important;width:100px!important;}'// +'img{width:auto!important;height:auto!important;display: block!important;margin-left: auto!important;margin-right: auto!important;}'
);//直接下载所有图片
(function ($) {
    'use strict';
    $(function () {

        $('img').each(function(){
        var dataSrc = $(this).attr('data-src');
        var width = $(this).attr('data-w');
        if (dataSrc){
             $(this).attr('_width', width+'px');
            $(this).removeAttr('src');
            $(this).attr('style', "vertical-align: baseline; font-weight: inherit; font-family: SimSun, Arial; font-style: inherit; margin-top: 28px; margin-right: auto; margin-left: auto; border-width: 0px; border-style: initial; border-color: initial; display: block; max-width: 640px; width: 600px !important; height: auto !important; visibility: visible !important;");
            $(this).data('src',dataSrc);
            $(this).attr('data-fail',0);
            $(this).data('class','');
        }
    });


        if ($('#down_url')) {
            $('#down_url').remove();
        };
        $(document.body).prepend('<div id="down_url" ></div>');
        $('#down_url').append('links count: , ' + $('h4.weui_media_title').length + '<br>');

        $('#js_view_source').href = window.msg_source_url;
        $('#js_view_source').target = '_blank';

        $('h4.weui_media_title').each(function (i) {
            var link_href = $(this).attr('hrefs');

            if (link_href) {
                var down_link = '<div id="down_url_links">' + i + ' , ' + link_href + ' , ' + $(this).text() + '</div>';
                $('#down_url').append(down_link);
            }
        }

        );
    });
})(window.jQuery.noConflict(true));