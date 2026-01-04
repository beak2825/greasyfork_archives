// ==UserScript==
// @name        标点云后台 用户详情页跳转用户订单
// @namespace   Violentmonkey Scripts
// @match       https://*.admin.biaodianyun.cn/admin/admin/#/user/*
// @grant       none
// @version     1.0
// @author      -
// @description 2023/2/7 19:39:31
// @license     MIT
// @require     https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/459594/%E6%A0%87%E7%82%B9%E4%BA%91%E5%90%8E%E5%8F%B0%20%E7%94%A8%E6%88%B7%E8%AF%A6%E6%83%85%E9%A1%B5%E8%B7%B3%E8%BD%AC%E7%94%A8%E6%88%B7%E8%AE%A2%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/459594/%E6%A0%87%E7%82%B9%E4%BA%91%E5%90%8E%E5%8F%B0%20%E7%94%A8%E6%88%B7%E8%AF%A6%E6%83%85%E9%A1%B5%E8%B7%B3%E8%BD%AC%E7%94%A8%E6%88%B7%E8%AE%A2%E5%8D%95.meta.js
// ==/UserScript==

setTimeout(function() {
  let urlid;
  let url;
  urlid = window.location.href; /* 获取完整URL */
  let indexsss = urlid.lastIndexOf("=")
  var resolvesss = urlid.substring(indexsss + 1, urlid.length);
  url = 'https://q61.admin.biaodianyun.cn/admin/admin/#/order/allorder/goodsorder?uid='+resolvesss;

  $("p.title:first span:first").append('<a id="biaodianyundd" href="" >【查看所有订单】</a>');
  $("#biaodianyundd").css("color","BLUE");
  $("#biaodianyundd").attr("href",url);

}, 1200);

document.addEventListener('click', event => {
  if (!event.target.matches('.info .name')) {
    return;
  }


  let urlid;
  let url;
  urlid = window.location.href; /* 获取完整URL */
  let indexsss = urlid.lastIndexOf("=")
  var resolvesss = urlid.substring(indexsss + 1, urlid.length);
  url = 'https://q61.admin.biaodianyun.cn/admin/admin/#/order/allorder/goodsorder?uid='+resolvesss;
  console.log(url)
   window.location.href=url;

}, {passive: true});