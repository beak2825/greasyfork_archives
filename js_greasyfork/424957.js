// ==UserScript==
// @name         11st拼多多采购回传
// @namespace    http://tampermonkey.net/
// @version      1
// @description  11st
// @author       Hunk
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @include      *://*yangkeduo.com/goods.html?*
// @include      *://*yangkeduo.com/order_checkout.html?*
// @require      http://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/424957/11st%E6%8B%BC%E5%A4%9A%E5%A4%9A%E9%87%87%E8%B4%AD%E5%9B%9E%E4%BC%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/424957/11st%E6%8B%BC%E5%A4%9A%E5%A4%9A%E9%87%87%E8%B4%AD%E5%9B%9E%E4%BC%A0.meta.js
// ==/UserScript==

(function() {
    //获取url中的数据
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]); return null;
    }
    var url = window.location.href;
    //判断首页存入
    if(url.indexOf('goods.html')!=-1){
        //如果存在ogd则写入
        var ogd_id=$.getUrlParam('ogd_id');
        if(ogd_id!=null){
            GM_setValue('ogd_id',ogd_id);
        }
    }
    //确认页取出回传
    if(url.indexOf('order_checkout.html')!=-1){
        if(GM_getValue('ogd_id')!=null){
            //获取页面数据
            var send_data={};
            var img='';
            $('._3LsDErt_ img').each(function(){
                img=$(this).attr('src');
            });
            send_data['img']=img;
            //获取商品名
            send_data['title']=$('._34vsO1hu').text();
            //获取规格
            var sku_data=[];
            $('._2RVVQKlC').each(function(){
                sku_data.push($(this).text());
            });
            send_data['sku']=sku_data;
            //获取单价
            send_data['price']=$('._3k5-w2bi').text();
            //获取购买数量
            send_data['num']=$.getUrlParam('goods_number');
            send_data['ogd_id']=GM_getValue('ogd_id');
            GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://operate.hagoto.com/admin/interface_api/sendPddBuyInfo",
                    dataType: "json",
                    data: JSON.stringify(send_data),
                    headers: {
                        "Content-Type": "application/json"
                    },
                    onload: function(result) {
                        if(result.readyState==4&&result.status==200){
                            var dataJson = JSON.parse(result.response);
                            if(dataJson.msg=='回传成功'){
                                GM_setValue('ogd_id',null);
                            }
                            alert(dataJson.msg);
                        }
                    }
                })
        }
    }
})();