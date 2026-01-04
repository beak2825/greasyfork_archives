// ==UserScript==
// @name         淘宝天猫内部优惠券 一键领取  购物前领一下 直接省钱20%以上 2018.2.17更新zz
// @namespace    https://quan.jbsou.cn/
// @version      1.8
// @description  一个按钮查找淘宝内部优惠券，领取内部优惠券。直接领取优惠券购买。优惠20%以上！
// @author       Timi
// @include      http*://item.taobao.com/*
// @include      http*://detail.tmall.com/*
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39171/%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E5%86%85%E9%83%A8%E4%BC%98%E6%83%A0%E5%88%B8%20%E4%B8%80%E9%94%AE%E9%A2%86%E5%8F%96%20%20%E8%B4%AD%E7%89%A9%E5%89%8D%E9%A2%86%E4%B8%80%E4%B8%8B%20%E7%9B%B4%E6%8E%A5%E7%9C%81%E9%92%B120%25%E4%BB%A5%E4%B8%8A%202018217%E6%9B%B4%E6%96%B0zz.user.js
// @updateURL https://update.greasyfork.org/scripts/39171/%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E5%86%85%E9%83%A8%E4%BC%98%E6%83%A0%E5%88%B8%20%E4%B8%80%E9%94%AE%E9%A2%86%E5%8F%96%20%20%E8%B4%AD%E7%89%A9%E5%89%8D%E9%A2%86%E4%B8%80%E4%B8%8B%20%E7%9B%B4%E6%8E%A5%E7%9C%81%E9%92%B120%25%E4%BB%A5%E4%B8%8A%202018217%E6%9B%B4%E6%96%B0zz.meta.js
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
      var btn_quan_taobao = '<a style="display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: normal;height:26px;line-height:26px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;margin-left:10px" href="http://quan.jbsou.cn/index.php?r=searchlist&kwd='+ encodeURI(str_goods_name) +'&page=0&page_size=16'+'">获取优惠券</a>';
      var btn_quan_tmall = '<div class="tb-action" style="margin-top:0"><a style="display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: normal;height:26px;line-height:26px;width:156px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;" href="http://quan.jbsou.cn/index.php?r=searchlist&kwd='+ encodeURI(str_goods_name) +'&page=0&page_size=16'+'">获取优惠券</a></div>';
      if(str_host_name=='taobao'){
          $('.tb-action').append(btn_quan_taobao);
      }else{
          $('.tb-sku').append(btn_quan_tmall);
      }
  });
})();