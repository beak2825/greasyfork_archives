// ==UserScript==
// @name         购物test
// @namespace    http://52jdquan.top/
// @version      3.13
// @description  京东优惠券直接领取,领取后可直接下单抵扣,价格超实惠。京东优惠券每天更新,京东购物先领券,比双11更低!
// @include      *://search.jd.com/*
// @include      *://list.jd.com/*
// @include      *://item.jd.com/*
// @include      http*://item.taobao.com/*
// @include      http*://detail.tmall.com/*
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38800/%E8%B4%AD%E7%89%A9test.user.js
// @updateURL https://update.greasyfork.org/scripts/38800/%E8%B4%AD%E7%89%A9test.meta.js
// ==/UserScript==

(function() {
  'use strict';
  $(document).ready(function() {
      var str_host       = window.location.host;
      var str_host_name  = 'jd';
      var str_host_name1  = 'taobao';
      var str_goods_name = '';//$(document).attr('title');
      var str_jdgoods_name = '';//$(document).attr('title');
      var str_goods_name1 = '';//$(document).attr('title');
      var str_jdgoods_name1 = '';//$(document).attr('title');
           if(str_host.indexOf('taobao.com')==-1) str_host_name1 = 'tmall';
      if(str_host_name1=='taobao'){
          str_goods_name1 = $('.tb-main-title').text();
          //str_goods_name = str_goods_name.substr(0,30);
      }else{
          str_goods_name1 = $('meta[name=keywords]').attr('content');
          //str_goods_name = str_goods_name.substring(0,6);
      }
      
      str_goods_name1=$.trim(str_goods_name1);
      str_jdgoods_name1 = str_goods_name1;
      //str_goods_name = str_goods_name.substring(0,10);
      var btn_quan_taobao1 = '<a style="display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: normal;height:26px;line-height:26px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;margin-left:10px" href="http://52tbquan.top/index.php?r=searchlist&kwd='+ encodeURI(str_goods_name1) +'&page=0&page_size=16'+'">获取优惠券</a>';
     
      var btn_quan_tmall =   '<div class="tb-action" style="margin-top:0"><a style="display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: normal;height:26px;line-height:26px;width:156px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;" href="http://52tbquan.top/index.php?r=searchlist&kwd='+ encodeURI(str_goods_name1) +'">获取优惠券</a></div>';
      
      var faNode1 = document.querySelector("div#J_Title p.tb-subtitle, div.tb-detail-hd");
      if(str_host_name1=='taobao'){
          $('.tb-action').append(btn_quan_taobao1);
      }else{
          $('.tb-sku').append(btn_quan_tmall);
      }
      if(str_host_name=='jd'){
          str_goods_name = $('.sku-name').text();
          
      }
      str_goods_name=$.trim(str_goods_name);
      str_jdgoods_name = str_goods_name.substring(0,15);
      var btn_quan_jd = '<a style="display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: normal;height:26px;line-height:26px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;margin-left:10px" href="http://52jdquan.top/?ah=total&kw='+ encodeURI(str_goods_name) +'" target="_blank">获取优惠券</a>';
      var btn_quan_taobao = '<a style="display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: normal;height:26px;line-height:26px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;margin-left:10px" href="http://52tbquan.top/index.php?r=searchlist&kwd='+ encodeURI(str_jdgoods_name) +'" target="_blank">淘宝同款</a>';
      
      var faNode = document.querySelector("div#J_Title p.tb-subtitle, div.tb-detail-hd");
      if(str_host_name=='jd'){
          $('.choose-btns').append(btn_quan_taobao);
          $('.choose-btns').append(btn_quan_jd);
      }
  });
})();