// ==UserScript==
// @name         天猫淘宝隐藏优惠券 大淘客 尤其618 双11
// @namespace    xsyhnb-天猫淘宝大淘客推广
// @version      0.0.2
// @description  try to take over the world!
// @author       javaduke
// @include      *detail.tmall.com/item.htm*
// @include      *item.taobao.com/item.htm*
// @connect      socheap.store
// @connect      127.0.0.1
// @grant          GM_xmlhttpRequest
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/404087/%E5%A4%A9%E7%8C%AB%E6%B7%98%E5%AE%9D%E9%9A%90%E8%97%8F%E4%BC%98%E6%83%A0%E5%88%B8%20%E5%A4%A7%E6%B7%98%E5%AE%A2%20%E5%B0%A4%E5%85%B6618%20%E5%8F%8C11.user.js
// @updateURL https://update.greasyfork.org/scripts/404087/%E5%A4%A9%E7%8C%AB%E6%B7%98%E5%AE%9D%E9%9A%90%E8%97%8F%E4%BC%98%E6%83%A0%E5%88%B8%20%E5%A4%A7%E6%B7%98%E5%AE%A2%20%E5%B0%A4%E5%85%B6618%20%E5%8F%8C11.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var localurl = window.location.href;
    //var host = 'http://localhost:8000'
    var host = 'http://a-tb.tk';
    var url = host+'/dataoke/getCoupon?url='+encodeURIComponent(localurl);
    var msg = '很抱歉！该商品没有优惠券！\n推荐查询同类带券商品！';
    urlhandler()

    function urlhandler(){
        if (localurl.search('tmall')>=0 || localurl.search('taobao')>=0){
            taobao()
        }
    }
    function taobao(){
       var url = host+'/api/tb/searchcoupon?url='+localurl;
        var btn_coupon = '<div style="margin-bottom:10px;" class="tb-btn-buy tb-btn-sku" id="xsyhnbcouponbtn"><a href="javascript:void(0);">查询优惠券</a></div>';
        var getmoreurl = host+'/api/similarsearch?itemid='+localurl.match(/id=(\d*)/)[1];
        var btn_getmore ='<div style="margin-bottom:10px;" class="tb-btn-basket tb-btn-add tb-btn-sku"><a target="_blank" href="'+getmoreurl+'">查询类似商品(大额券)</a></div>';
        var tag = $('div.tb-action');
        tag.prepend(btn_getmore);
        tag.prepend(btn_coupon);
    }
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
    $('#xsyhnbcouponbtn').click(getcoupon)
})();