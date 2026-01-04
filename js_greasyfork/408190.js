// ==UserScript==
// @name         天猫 淘宝 隐藏优惠券
// @namespace    天猫淘宝隐藏优惠券
// @version      0.01
// @description  天猫 淘宝 隐藏 优惠券!
// @author       xiaomi
// @include      *detail.tmall.com/item.htm*
// @include      *item.taobao.com/item.htm*
// @connect      2yh.shop
// @connect      127.0.0.1
// @grant        httpRequest
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/408190/%E5%A4%A9%E7%8C%AB%20%E6%B7%98%E5%AE%9D%20%E9%9A%90%E8%97%8F%E4%BC%98%E6%83%A0%E5%88%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/408190/%E5%A4%A9%E7%8C%AB%20%E6%B7%98%E5%AE%9D%20%E9%9A%90%E8%97%8F%E4%BC%98%E6%83%A0%E5%88%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*
    使用说明：
    1. 修改顶部@name、@namespace、@author内容，修改内容可参考原来的内容。
    2. 根据自己大淘客应用的信息修改下面appkey、secret和pid的值。（注意：大淘客每个月都要更新pid的绑定，自己注意一下时间）
    3. 按上面两点修改内容，就可以删掉这部分备注了。
    4. 然后就可开心的在网上推广你的油猴脚本了。
    5. 最后就可以开心的躺着等收益啦！
    */
    //================需要修改的内容======================//
    var appkey = '5f2850acaf082';
    var secret = '9fc418899bacf7769c22867d821c8511';
    var pid = 'mm_30046899_5976644_39694625';
    //没有找到优惠券的时候会提示一下，可根据自己需要修改
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
    //var host = 'https://www.2yh.shop';
    var url = host+'/dataoke/getCoupon?appkey='+appkey+'&secret='+secret+'&pid='+pid+'&url='+encodeURIComponent(localurl);
    var getmoreurl = host+'/api/similarsearch?itemid='+localurl.match(/id=(\d*)/)[1];
    var btn_getmore ='<div style="margin-bottom:10px;" class="tb-btn-basket tb-btn-add tb-btn-sku"><a target="_blank" href="'+getmoreurl+'">查询类似商品(大额券)</a></div>';
    var tag = $('div.tb-action');
    tag.prepend(btn_getmore);
    tag.prepend(btn_coupon);
    $('#xsyhnbcouponbtn').click(getcoupon)
    // Your code here...
})();