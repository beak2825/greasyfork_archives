// ==UserScript==
// ==UserScript==
// @name         快速领取淘宝内部优惠券
// @namespace    http://www.tehui22.com/
// @version      0.4
// @description  快速领取淘宝商品的优惠券
// @include      http*://item.taobao.com/*
// @include      http*://detail.tmall.com/*
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @author       过河不拆桥
// @downloadURL https://update.greasyfork.org/scripts/370132/%E5%BF%AB%E9%80%9F%E9%A2%86%E5%8F%96%E6%B7%98%E5%AE%9D%E5%86%85%E9%83%A8%E4%BC%98%E6%83%A0%E5%88%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/370132/%E5%BF%AB%E9%80%9F%E9%A2%86%E5%8F%96%E6%B7%98%E5%AE%9D%E5%86%85%E9%83%A8%E4%BC%98%E6%83%A0%E5%88%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 快速领取淘宝内部优惠券!!!
    $(document).ready(function() {
      var str_host       = window.location.host;
      var str_host_name  = 'taobao';
      var str_goods_name = '';//$(document).attr('title');
      if(str_host.indexOf('taobao.com')==-1) str_host_name = 'tm';
      if(str_host_name=='taobao'){
          str_goods_name = $('.tb-main-title').text();
      }else{
          str_goods_name = $('meta[name=keywords]').attr('content');
      }
      str_goods_name=$.trim(str_goods_name);

     var btn_quan_taobao = '<a style="display: inline-block;font-size: 40px;font-weight: normal;height:40px;line-height:40px;text-align: " href="http://wx.52dw.net/app/index.php?i=1&c=entry&m=tiger_newhu&do=cqlist&zn=1&tm=&pid=mm_106881913_39490080_148052789&key='+ encodeURI(str_goods_name) +'" target="_blank">点我查优惠券</a>';
     var btn_quan_tmall =  '<div class="tb-action" style="margin-top:0"><a style="display: inline-block;padding:;font-size: 40px;font-weight: normal;height:40px;line-height:40px;width:200px;text-align: " href="http://wx.52dw.net/app/index.php?i=1&c=entry&m=tiger_newhu&do=cqlist&zn=1&tm=&pid=mm_106881913_39490080_148052789&key='+ encodeURI(str_goods_name) +'">点我</a></div>';
      var faNode = document.querySelector("div#J_Title p.tb-subtitle, div.tb-detail-hd");
      if(str_host_name=='taobao'){
          $('.tb-action').append(btn_quan_taobao);
          $('.tb-action').append(btn_search_taobao);

      }else{
          $('.tb-sku').append(btn_quan_tmall);
          $('.tb-sku').append(btn_search_tmall);
      }
    });
})();