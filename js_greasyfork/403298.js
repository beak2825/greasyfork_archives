// ==UserScript==
// @name         天猫、淘宝、京东、拼多多优惠券返利
// @namespace    天猫、淘宝、京东、拼多多优惠券返利
// @version      0.1
// @description  主流电商平台，查询优惠券返利，方便好用，能省的钱必须省！
// @author       Chris
// @include      *item.taobao.com/item.htm*
// @include      *detail.tmall.com/item.htm*
// @include      *uland.taobao.com/coupon*
// @include      *item.jd.com*
// @grant        none
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/403298/%E5%A4%A9%E7%8C%AB%E3%80%81%E6%B7%98%E5%AE%9D%E3%80%81%E4%BA%AC%E4%B8%9C%E3%80%81%E6%8B%BC%E5%A4%9A%E5%A4%9A%E4%BC%98%E6%83%A0%E5%88%B8%E8%BF%94%E5%88%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/403298/%E5%A4%A9%E7%8C%AB%E3%80%81%E6%B7%98%E5%AE%9D%E3%80%81%E4%BA%AC%E4%B8%9C%E3%80%81%E6%8B%BC%E5%A4%9A%E5%A4%9A%E4%BC%98%E6%83%A0%E5%88%B8%E8%BF%94%E5%88%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
var local = window.location.host;
start();
function start() {
  if (local.indexOf("uland") >= 0) {
    uland();
  } else if (local.indexOf("tmall") >= 0 || local.indexOf("taobao") >= 0) {
    tbao();
  }
}
function tbao() {
  var nbtn =
    `<div style="margin-top:10px;" class="tb-btn-buy tb-btn-sku" id="nbtn">
       <a href="javascript:;">优惠券返利机器人</a>
     </div>`;
  var ads =
    `<div id="ads" style="display:none;">
       <img src="https://supcache.wyqrks.com/data/shop.lpz08.store/pang.jpg" style="width:145px;position:absolute;left:0;z-index:999999999" />
     </div>`;
  var intro =
    `<div id="intro" class="tb-btn-add" style="height:130px;margin-top:10px;box-sizing:border-box;border-radius: 2px;background-color:rgb(243, 9, 9);;position:absolute;z-index:999999998;font-size:18px;color:#f5f6fa;font-weight:500;padding: 20px 10px 0px">
        一.微信扫码添加返利机器人
        <br/>
        二.发送宝贝链接即可查询优惠券返利
        <br/>
        三.天猫、淘宝、京东、拼夕夕均可查
     </div>`;
  var coupons =
    `<div style="margin-top:10px;" class="tb-btn-basket tb-btn-add tb-btn-sku" id="nbtn">
       <a href="http://shop.lpz08.store">更多优惠券</a>
     </div>`;
  var flag = true;
  $("div.tb-action").append(nbtn);
  $("div.tb-action").append(coupons);
  $("div.tb-action").after(ads);
  $("#ads").append(intro);

  $("#nbtn").on("click", function () {
    if (flag) {
      $("#ads").stop().fadeIn();
      $("#intro").stop().animate({ left: "145px" }, 1000);
      flag = false;
    } else {
      $("#ads").stop().fadeOut();
      $("#intro").stop().animate({ left: "0px" }, 1000);
      flag = true;
    }
  });
}

function uland() {
  var dapang =
      `<div style="position:fixed;top:30%;right:0;">
         <p style="width:215px;color:#e74c3c;font-size:20px;font-weight:700;text-align:center;">下单后发送订单编号给我，还有购物返利,<br>更省钱哦！</p>
         <img src="https://supcache.wyqrks.com/data/shop.lpz08.store/pang.jpg" style="width:50%;">
       </div>`;
  $("body").append(dapang);
}

})();