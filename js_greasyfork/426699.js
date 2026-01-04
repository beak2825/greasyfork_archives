// ==UserScript==
// @name         试客巴折扣试用金增加
// @namespace    http://ziyuand.cn
// @version      0.4
// @description  折扣试用金增加
// @author       SHERWIN
// @match        https://wx.shike8888.com/user/myDiscountGift
// @icon         https://www.google.com/s2/favicons?domain=shike8888.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426699/%E8%AF%95%E5%AE%A2%E5%B7%B4%E6%8A%98%E6%89%A3%E8%AF%95%E7%94%A8%E9%87%91%E5%A2%9E%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/426699/%E8%AF%95%E5%AE%A2%E5%B7%B4%E6%8A%98%E6%89%A3%E8%AF%95%E7%94%A8%E9%87%91%E5%A2%9E%E5%8A%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var add;

    $.ajax({
        url: '/DiscountTryGift/discountMoneyInfo',
        type: 'get',
        dataType: 'json',
        success: function (data) {
           if(data.code == 1){
               //$('#discount_money').text(data.money);
                $('.mui-table-view').before('<p style="text-align:center; color:white;background:red; line-height:20px;margin:0;">可用折扣试用金:<b>'+data.money+'</b>&nbsp;&nbsp;&nbsp;领取次数:<b>'+data.count+'</b></p>');
              // $('#get_count').text(data.count);
           }
        }
    });




    $('.banner').on("tap",function(event){

        add =prompt("请输入次数");
        if(add!==''){
            for (var i = 0; i < add*5; i++) {
                (function (t, data) {   // 注意这里是形参
                    setTimeout(function () {
                        var rad=random(5, 9);
                        linqu(randomString(rad));
                    },300 * t);   // 还是每300ms执行一次，不是累加的
                })(i)   // 注意这里是实参，这里把要用的参数传进去
            }

        }else{
            mui.alert("请输入次数", function() {
                location.reload();
            });
        }


    })
    function linqu(aid){
        $.ajax({
            url: '/DiscountTryGift/updateDiscountMoney',
            type: 'post',
            dataType: 'json',
           // data: {"orderId":aid,"money":'99999',"type":'3',"num":'10'},
            success: function(res){
                if(res.code === 1){
                       mui.toast(aid+'领取成功！',{ duration:'short', type:'div' })
                    console.log(aid+'领取成功！')
                }else{
                    mui.alert(res.msg);
                }
            }
        });}
    var orderid=randomString(6);

    function randomString(length) {
        var str = '1234567890123456789';
        var result = '';
        for (var i = length; i > 0; --i)
            result += str[Math.floor(Math.random() * str.length)];
        return result;
    };



    function random(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    // Your code here...
})();