// ==UserScript==
// @name trade.taobao.com 订单详情 处理
// @namespace http://login.taobao.com
// @version 0.14
// @description 初次使用请先在“添加和删除用户”页面中添加淘宝用户名和密码
// @author dongchao
// @iconURL http://www.xuebalib.cn/userjs/icon.ico
// @match https://trade.taobao.com/trade/detail/trade_order_detail.htm*
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @grant window.close

// @downloadURL https://update.greasyfork.org/scripts/29766/tradetaobaocom%20%E8%AE%A2%E5%8D%95%E8%AF%A6%E6%83%85%20%E5%A4%84%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/29766/tradetaobaocom%20%E8%AE%A2%E5%8D%95%E8%AF%A6%E6%83%85%20%E5%A4%84%E7%90%86.meta.js
// ==/UserScript==

(function() {
'use strict';
   // var url = "http://112.74.125.150/";
    var url = "https://haidaoteam.com/taobao/";
    //var url = "http://127.0.0.1:8000/";
    setTimeout(main,1000);
    function main(){
        var span_list = $(".misc-info-mod__content___fZXJX span");
        var order_id = span_list[0].innerText;
        var pay_id = span_list[1].innerText;
        var order_create_time = span_list[2].innerText;
        var order_status = $($($(".order-item")[0]).find("td")[2]).find("div span").text();
        
        $.ajax({
         type: "POST",
         url: url+"update_order_status",
         data: { order_id:order_id, pay_id:pay_id,order_create_time:order_create_time,order_status:order_status }
       }).done(function( msg ) {
         window.close();
       });
        console.log("span_list = " + span_list);
        console.log("order_id = " + order_id);
        console.log("pay_id = " + pay_id);
        console.log("order_create_time = " + order_create_time);
        console.log("order_status = " + order_status);
    }
})();