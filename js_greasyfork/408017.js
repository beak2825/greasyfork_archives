// ==UserScript==
// @name         淘宝 京东 拼多 优惠券
// @namespace  https://v2ray.aiz5.com/public/tb.js
// @version      0.2.3
// @description  淘宝 京东 拼多 优惠券 装上插件 买时就是最优惠价格!
// @author     arno
// @antifeature  淘宝 京东 拼多 优惠券 
// @match    *://*.tmall.com/*
// @match    *://*.taobao.com/*
// @match    *://*.jd.com/*
// @match    *://*.yangkeduo.com/*
// @grant        none
// @antifeature referral-link
// @license
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/408017/%E6%B7%98%E5%AE%9D%20%E4%BA%AC%E4%B8%9C%20%E6%8B%BC%E5%A4%9A%20%E4%BC%98%E6%83%A0%E5%88%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/408017/%E6%B7%98%E5%AE%9D%20%E4%BA%AC%E4%B8%9C%20%E6%8B%BC%E5%A4%9A%20%E4%BC%98%E6%83%A0%E5%88%B8.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var host = "https://tk.iyan.club";
  var stylestr =
    "<style>.wandhi_tab{border:1px solid #f40;border-collapse:collapse;}" +
    ".wandhi_tab thead{font-size:14px;text-align:center;}" +
    ".wandhi_tab tr th{padding:10px 20px;text-align:center;}" +
    ".wandhi_tab tr td{padding:10px 20px;text-align:center;font-size:14px;}" +
    ".wandhi_tab tr td a{ text-decoration:none;}" +
    ".wandhi_tab_taobao{margin-bottom:15px;}" +
    ".wandhi_tab_taobao thead{background-color:#f40;color:#FFF;}" +
    ".wandhi_tab_taobao tr td{border:1px solid #e6602d;color:#e6602d;}" +
    ".wandhi_tab_taobao tr td a{color:#e6602d;}" +
    ".wandhi_tab_tmall {margin-bottom:15px;}" +
    ".wandhi_tab_tmall thead{background-color:#ff0036;color:#FFF;}" +
    ".wandhi_tab_tmall tr td{border:1px solid #ff0036;color:#ff0036;}" +
    ".wandhi_tab_tmall tr td a{color:#ff0036;}</style>";

  function getCouponsStr(data) {
    //var list = [{name:'优惠券',price:'20',effective: '2020-09-09',id:111,url:'1111'}];
    var list = data.coupon || [];
    var couponsStr = "";
    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      couponsStr +=
        "<tr><td>" +
        item.name +
        "</td><td>" +
        item.price +
        "</td><td>" +
        item.effective +
        "</td><td><b onclick=\"window.open('https://tk.iyan.club/public/link.html?url=" +
          encodeURIComponent(item.url) +
        '\')" style="cursor:pointer" data-spm-anchor-id="' +
        item.id +
        '">领取</b></td></tr>';
    }
    if (!couponsStr) {
      couponsStr = '<tr><td  colspan="4" >没有优惠券</td></tr>';
    }
    var str =
      '<table class="wandhi_tab wandhi_tab_tmall" id="wandhi_table">' +
      '<thead><tr><th><b style="cursor:pointer">优惠券</b></th><th>券</th><th>有 效 期</th><th>操作</th></tr></thead>' +
      "<tbody>" +
      couponsStr +
      "</tbody></table>";
    if (!data.isme && data.url) {
      $(".tb-btn-buy").html(
        '<a id="J__LinkBuy" href="#" rel="nofollow" data-addfastbuy="true" title="点击此按钮，到下一步确认购买信息。" role="button">立即购买<span class="ensureText">确认</span></a>'
      );
      $(".tb-btn-buy").click(function () {
        var url='https://tk.iyan.club/public/link.html?url=' + encodeURIComponent(data.url || '')
          location.replace(url);
      });
      $(".tb-btn-basket").html(
        '<a href="#" rel="nofollow" id="J__LinkBasket" role="button"><i></i>加入购物车<span class="ensureText">确认</span></a>'
      );
      $(".tb-btn-basket").click(function () {
        var url='https://tk.iyan.club/public/link.html?url=' + encodeURIComponent(data.url || '')
          location.replace(url);
      });
    }
    return str;
  }
  var loadStr =
    '<div id="wandhi_div">' +
    '<table class="wandhi_tab wandhi_tab_tmall" id="wandhi_table">' +
    '<thead><tr><th><b style="cursor:pointer">优惠券加载中。。。</b></th></tr></thead></table></div>';

  var $ = null;
  (function () {
    if (typeof window.jQuery == "undefined") {
      var GM_Head =
          document.getElementsByTagName("head")[0] || document.documentElement,
        GM_JQ = document.createElement("script");

      GM_JQ.src = "https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js";
      GM_JQ.type = "text/javascript";
      GM_JQ.async = true;

      GM_Head.insertBefore(GM_JQ, GM_Head.firstChild);
    }
    GM_wait();
  })();
  // Check if jQuery's loaded
  function GM_wait() {
    console.log("window.jQuery");
    if (typeof window.jQuery == "undefined") {
      window.setTimeout(GM_wait, 1000);
    } else {
      console.log("window.jQuery", window.jQuery);
      $ = window.$ || window.jQuery.noConflict(true);
      $("head").append(stylestr);
      $(".tb-action").prepend(loadStr);
      init();
    }
  }
  //获取url中的参数
  function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
  }
  function init() {
    var url = location.href;
    if (
      url.indexOf("detail.tmall.com/item.htm") !== -1 ||
      url.indexOf("item.taobao.com/item.htm") !== -1
    ) {
      // 淘宝
      var id = getUrlParam("id");
      console.log(id);
    }
    var data = { url: url };
    $.ajax({
      type: "POST",
      url: host + "/coupons",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(data),
      //   async:false,
      cache: false,
      success: function (d) {
        console.log("up", d);
        var data = JSON.parse(d);
        if (data.code === 1) {
          
          if (data.type == "jd") {
            if (!data.data.isme) {
             var url= data.data.url
            location.replace(url);
            return;
          }
            var extension_id = getUrlParam("extension_id");
            if (!extension_id) {
              $("#InitCartUrl").attr("href", data.data.url);
            }
          } else if (data.type == "taobao") {
            var str = getCouponsStr(data.data);
            $("#wandhi_div").html(str);
          }
        } else {
          var str = getCouponsStr(data.data);
          $("#wandhi_div").html(str);
        }
      },
      error: function (html) {},
    });
  }

  // Your code here...
})();
