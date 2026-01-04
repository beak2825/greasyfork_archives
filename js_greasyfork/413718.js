// ==UserScript==
// @name         天猫淘宝一键领券
// @namespace    一键领券
// @version      1.0.1
// @description  省钱秘籍
// @author       辛巴·17·申公豹·花呗🉐️老爹
// @include      *detail.tmall.com/item.htm*
// @include      *item.taobao.com/item.htm*
// @connect      socheap.store
// @connect      127.0.0.1
// @grant          GM_xmlhttpRequest
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/413718/%E5%A4%A9%E7%8C%AB%E6%B7%98%E5%AE%9D%E4%B8%80%E9%94%AE%E9%A2%86%E5%88%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/413718/%E5%A4%A9%E7%8C%AB%E6%B7%98%E5%AE%9D%E4%B8%80%E9%94%AE%E9%A2%86%E5%88%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';
  
    var appkey = '5f8c0b8e164c7';
    var secret = '82daa2ea7d18202171f01e979c6cb72a';
    var pid = 'mm_258290010_1987150099_110795650024';

    var msg = '很抱歉！该商品没有优惠券！'
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
    var host = 'http://127.0.0.1:8000';
    //var host = 'https://www.socheap.store';
    var url = host+'/dataoke/getCoupon?appkey='+appkey+'&secret='+secret+'&pid='+pid+'&url='+encodeURIComponent(localurl);
    var getmoreurl = host+'/api/similarsearch?itemid='+localurl.match(/id=(\d*)/)[1];
    var btn_getmore ='<div style="margin-bottom:10px;" class="tb-btn-basket tb-btn-add tb-btn-sku"><a target="_blank" href="'+getmoreurl+'">查询类似商品(大额券)</a></div>';
    var tag = $('div.tb-action');
    tag.prepend(btn_getmore);
    tag.prepend(btn_coupon);
    $('#xsyhnbcouponbtn').click(getcoupon)
    // Your code here...
})();