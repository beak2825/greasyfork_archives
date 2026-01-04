// ==UserScript==
// @name         天猫淘宝大返利
// @namespace    慕容锦绣-天猫淘宝大返利
// @version      0.0.1
// @description  try to take over the world!
// @author       慕容锦绣
// @include      *detail.tmall.com/item.htm*
// @include      *item.taobao.com/item.htm*
// @connect      socheap.store
// @connect      127.0.0.1
// @grant          GM_xmlhttpRequest
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/400866/%E5%A4%A9%E7%8C%AB%E6%B7%98%E5%AE%9D%E5%A4%A7%E8%BF%94%E5%88%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/400866/%E5%A4%A9%E7%8C%AB%E6%B7%98%E5%AE%9D%E5%A4%A7%E8%BF%94%E5%88%A9.meta.js
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
    var appkey = '5e9688782fc52';
    var secret = '152085123765700e427a3305bedafc10';
    var pid = 'mm_1093660133_1522850323_110244600500';
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
