// ==UserScript==
// @name         淘宝优惠券
// @namespace    https://imewchen.com/
// @version      0.1.1
// @description  从券多多查找淘宝优惠券。脚本非官方出品。
// @author       MewChen
// @include      http*://item.taobao.com/*
// @include      http*://detail.tmall.com/*
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32565/%E6%B7%98%E5%AE%9D%E4%BC%98%E6%83%A0%E5%88%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/32565/%E6%B7%98%E5%AE%9D%E4%BC%98%E6%83%A0%E5%88%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function() {
        var str_host       = window.location.host;
        var str_host_name  = 'taobao';
        var str_goods_name = '';//$(document).attr('title');

        if(str_host.indexOf('taobao.com')==-1) str_host_name = 'tmall';
        if(str_host_name=='taobao'){
            str_goods_name = $('.tb-main-title').text();
        }else{
            str_goods_name = $('meta[name=keywords]').attr('content');
        }
        str_goods_name=$.trim(str_goods_name);
        var btn_quan_taobao = '<a style="display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 16px;font-weight: normal;height:26px;line-height:26px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;margin-left:10px;font-family: \'Hiragino Sans GB\',\'microsoft yahei\',sans-serif;" href="http://www.quanduoduo.com/index/result?keywords='+ encodeURI(str_goods_name) +'" target="_blank">优惠券</a>';
        var btn_quan_tmall = '<div class="tb-action" style="margin-top:0"><a style="display: inline-block;padding: 6px 12px;margin-bottom: 0; font-family: \'Microsoft Yahei\';font-size: 16px;font-weight: normal;height:26px;line-height:26px;width:156px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;" href="http://www.quanduoduo.com/index/result?keywords='+ encodeURI(str_goods_name) +'" target="_blank">优惠券</a></div>';
        if(str_host_name=='taobao'){
            $('.tb-action').append(btn_quan_taobao);
        }else{
            $('.tb-sku').append(btn_quan_tmall);
        }
    });
})();