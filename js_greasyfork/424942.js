// ==UserScript==
// @name         pddAutoBuy
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  拼多多自动购买
// @icon         https://lk-data-collection.oss-cn-qingdao.aliyuncs.com/winner/winnercoupang/Icon.png
// @author       Hunk
// @include      *://*yangkeduo.com/goods.html?*
// @include      *://*yangkeduo.com/order_checkout.html?*
// @require      http://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424942/pddAutoBuy.user.js
// @updateURL https://update.greasyfork.org/scripts/424942/pddAutoBuy.meta.js
// ==/UserScript==

(function() {
    //获取url中的数据
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]); return null;
    }
    var url = window.location.href;
    if(url.indexOf('goods.html')!=-1){
        //详情页确认
        var buy_sku_id=$.getUrlParam('buy_sku_id');
        var buy_num=$.getUrlParam('buy_num');
        var buy_money=$.getUrlParam('buy_money');
        var goods_id=$.getUrlParam('goods_id');
        if(buy_sku_id==null){
            return;
        }
        var all_data=window.rawData;
        var pdd_goods=all_data.store.initDataObj.goods;
        //获取group_id
        var group_id='';
        $(pdd_goods.groupTypes).each(function(i,item){
            group_id=item.groupID;
        });
        if(group_id==''){
            alert('group_id'+'获取失败');
        }
        //验证sku
        var sku_obj={};
        $(pdd_goods.skus).each(function(i,item){
            if(item.skuId==buy_sku_id){
                sku_obj=item;
            }
        });
        //验证价格
        //获取group_order_id
        var group_order_id=pdd_goods.neighborGroup.neighbor_data.combine_group.recommend_group.group_order_id;
        if(group_order_id==false){
            alert('group_order_id'+'获取失败');
        }
        //跳转下单页
        var check_url='http://yangkeduo.com/order_checkout.html?sku_id='+buy_sku_id+'&group_id='+group_id+'&goods_id='+goods_id+'&goods_number='+buy_num+'&page_from=0&group_order_id='+group_order_id+'&is_history_group=1&refer_page_element=local_group&source_channel=1&refer_page_name=goods_detail&refer_page_sn=10014'

        window.open(check_url,'_self');
    }
    if(url.indexOf('order_checkout.html')!=-1){
       setTimeout(function(){
        $('._3lq4F6w6 ').click();
       }, 1000);
    }



    console.log(url);return;
    $("#detail_json").val(JSON.stringify(detade));return;
})();