// ==UserScript==
// @name         【天猫、淘宝】购物隐藏优惠券超值！24节气重大节日各种优惠券抢先领取 一键查询优惠券免费领取，购买前领券享超值优惠
// @namespace   【天猫、淘宝】购物隐藏优惠券超值！24节气重大节日各种优惠券抢先领取 一键查询优惠券免费领取，购买前领券享超值优惠
// @version      0.5.9
// @description  一个按钮轻松查询你想购买的商品是否有优惠券，查询有优惠券可立即领取购物省35%以上。
// @author       dongxiao
// @include      *detail.tmall.com/item.htm*
// @include      *item.taobao.com/item.htm*
// @connect      socheap.store
// @connect      127.0.0.1
// @grant          GM_xmlhttpRequest
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/408193/%E3%80%90%E5%A4%A9%E7%8C%AB%E3%80%81%E6%B7%98%E5%AE%9D%E3%80%91%E8%B4%AD%E7%89%A9%E9%9A%90%E8%97%8F%E4%BC%98%E6%83%A0%E5%88%B8%E8%B6%85%E5%80%BC%EF%BC%8124%E8%8A%82%E6%B0%94%E9%87%8D%E5%A4%A7%E8%8A%82%E6%97%A5%E5%90%84%E7%A7%8D%E4%BC%98%E6%83%A0%E5%88%B8%E6%8A%A2%E5%85%88%E9%A2%86%E5%8F%96%20%E4%B8%80%E9%94%AE%E6%9F%A5%E8%AF%A2%E4%BC%98%E6%83%A0%E5%88%B8%E5%85%8D%E8%B4%B9%E9%A2%86%E5%8F%96%EF%BC%8C%E8%B4%AD%E4%B9%B0%E5%89%8D%E9%A2%86%E5%88%B8%E4%BA%AB%E8%B6%85%E5%80%BC%E4%BC%98%E6%83%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/408193/%E3%80%90%E5%A4%A9%E7%8C%AB%E3%80%81%E6%B7%98%E5%AE%9D%E3%80%91%E8%B4%AD%E7%89%A9%E9%9A%90%E8%97%8F%E4%BC%98%E6%83%A0%E5%88%B8%E8%B6%85%E5%80%BC%EF%BC%8124%E8%8A%82%E6%B0%94%E9%87%8D%E5%A4%A7%E8%8A%82%E6%97%A5%E5%90%84%E7%A7%8D%E4%BC%98%E6%83%A0%E5%88%B8%E6%8A%A2%E5%85%88%E9%A2%86%E5%8F%96%20%E4%B8%80%E9%94%AE%E6%9F%A5%E8%AF%A2%E4%BC%98%E6%83%A0%E5%88%B8%E5%85%8D%E8%B4%B9%E9%A2%86%E5%8F%96%EF%BC%8C%E8%B4%AD%E4%B9%B0%E5%89%8D%E9%A2%86%E5%88%B8%E4%BA%AB%E8%B6%85%E5%80%BC%E4%BC%98%E6%83%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*
    使用说明：
   （大淘客每个月都要更新pid的绑定，自己注意一下时间）
    */
    //================需要修改的内容======================//
    var appkey = '5f2850acaf082';
    var secret = '9fc418899bacf7769c22867d821c8511';
    var pid = 'mm_30046899_5976644_39694625';
    //没有找到优惠券的时候会提示一下，可根据自己需要修改
    var msg = '很抱歉！该商品没有查询优惠券！'
    //===================================================//

    function getcoupon(){
        GM_xmlhttpRequest({
         method:'get',
         url:url,
         onload:function(res){
             var resdata = JSON.parse(res.responseText).result
             if(resdata.code==1){
                 if(resdata.is_coupon){
                     window.location.href = resdata.url_coupon;
                 }
                 else{
                     alert(msg);
                     window.location.href=resdata.url_good;
                 }
             }
             else{
                 alert(msg);
             }

         }
     })
    }
    var localurl = window.location.href;
    var btn_coupon = '<div id="xsyhnbcouponbtn" style="margin-bottom:10px;" class="tb-btn-buy tb-btn-sku"><a href="javascript:void(0);">查询优惠券</a></div>';
    //var host = 'http://127.0.0.1:8000';
    var host = 'https://www.socheap.store';
    var url = host+'/dataoke/getCoupon?appkey='+appkey+'&secret='+secret+'&pid='+pid+'&url='+encodeURIComponent(localurl);
    var getmoreurl = host+'/api/similarsearch?itemid='+localurl.match(/id=(\d*)/)[1];
    var btn_getmore ='<div style="margin-bottom:10px;" class="tb-btn-basket tb-btn-add tb-btn-sku"><a target="_blank" href="'+getmoreurl+'">查询类似商品(大额券)</a></div>';
    var tag = $('div.tb-action');
    tag.prepend(btn_getmore);
    tag.prepend(btn_coupon);
    $('#xsyhnbcouponbtn').click(getcoupon)
    // Your code here...
})();