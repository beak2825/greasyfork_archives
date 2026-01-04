// ==UserScript==
// @name         【天猫、淘宝】猫淘宝隐藏优惠券领取,使用简单不多打扰
// @namespace   【天猫、淘宝】猫淘宝隐藏优惠券领取,在想怎么找淘宝隐藏优惠券?在这里
// @version      0.2
// @description  简单不打扰，一个按钮轻松查询,有优惠券可立即领取购物省30%以上。
// @author       gamemt
// @icon         https://i.loli.net/2020/07/12/BHTe7dGvaC5wV1M.png
// @include      *detail.tmall.com/item.htm*
// @include      *item.taobao.com/item.htm*
// @grant          GM_xmlhttpRequest
// @connect      socheap.store
// @connect      taobaokeapi.com
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/406929/%E3%80%90%E5%A4%A9%E7%8C%AB%E3%80%81%E6%B7%98%E5%AE%9D%E3%80%91%E7%8C%AB%E6%B7%98%E5%AE%9D%E9%9A%90%E8%97%8F%E4%BC%98%E6%83%A0%E5%88%B8%E9%A2%86%E5%8F%96%2C%E4%BD%BF%E7%94%A8%E7%AE%80%E5%8D%95%E4%B8%8D%E5%A4%9A%E6%89%93%E6%89%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/406929/%E3%80%90%E5%A4%A9%E7%8C%AB%E3%80%81%E6%B7%98%E5%AE%9D%E3%80%91%E7%8C%AB%E6%B7%98%E5%AE%9D%E9%9A%90%E8%97%8F%E4%BC%98%E6%83%A0%E5%88%B8%E9%A2%86%E5%8F%96%2C%E4%BD%BF%E7%94%A8%E7%AE%80%E5%8D%95%E4%B8%8D%E5%A4%9A%E6%89%93%E6%89%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var appkey = '5f0b092fe2fcd';
    var secret = '3da6170076fabf042bd3add0fb9abd54';
    var pid = 'mm_109215233_39936826_150642284';
    var msg = '很抱歉！该商品没有查询优惠券！'
    function getcoupon(){
        GM_xmlhttpRequest({
         method:'get',
         url:url,
         onload:function(res){
             var resdata = JSON.parse(res.responseText).result;
             if(resdata.data.coupon_remain_count>=1){
                 window.location.href = resdata.data.coupon_click_url;
             }
             else{
                 window.location.href = resdata.data.item_url;
                 }
         }
     })
    }
    var localurl = window.location.href;
    var btn_coupon = '<div id="xsyhnbcouponbtn" style="margin-bottom:10px;" class="tb-btn-buy tb-btn-sku" ><a href="javascript:void(0);">查询优惠券</a></div>';
    var tbid =location.search.split('id=')[1].split('&')[0]
    var url = "https://api.taobaokeapi.com/?usertoken=360b94a47e27412b95aebb2c9de3f6ba&method=taobao.tbk.privilege.get&item_id="+tbid+"&adzone_id=150642284&site_id=39936826"
    var getmoreurl = 'http://woyo.app';
    var btn_getmore ='<div style="margin-bottom:10px;" class="tb-btn-basket tb-btn-add tb-btn-sku"><a target="_blank" href="'+getmoreurl+'">更多优惠商品推荐</a></div>';
    var tag = $('div.tb-action');
    tag.prepend(btn_getmore);
    tag.prepend(btn_coupon);
    $('#xsyhnbcouponbtn').click(getcoupon)
    // Your code here...
})();