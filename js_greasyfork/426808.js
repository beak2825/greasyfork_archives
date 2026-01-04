// ==UserScript==
// @name         新-试客巴折扣试用金增加
// @namespace    http://ziyuand.cn
// @version      0.9
// @description  折扣试用金增加
// @author       SHERWIN
// @match        https://wx.shike8888.com/user/myDiscountGift
// @icon         https://www.google.com/s2/favicons?domain=shike8888.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426808/%E6%96%B0-%E8%AF%95%E5%AE%A2%E5%B7%B4%E6%8A%98%E6%89%A3%E8%AF%95%E7%94%A8%E9%87%91%E5%A2%9E%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/426808/%E6%96%B0-%E8%AF%95%E5%AE%A2%E5%B7%B4%E6%8A%98%E6%89%A3%E8%AF%95%E7%94%A8%E9%87%91%E5%A2%9E%E5%8A%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var add;
    var dikou=0;
    $.ajax({
        url: '/DiscountTryGift/discountMoneyInfo',
        type: 'get',
        dataType: 'json',
        success: function (data) {
            if(data.code == 1){
                $.ajax({
                    url: 'https://wx.shike8888.com/DiscountTryGift/list',
                    type: 'get',
                    dataType: 'json',
                    success: function (datas) {
                        if(datas.code == 1){
                            for(var c in datas.data){
                                if(datas.data[c]['type']=='1'){

                                    dikou=datas.data[c]['money']+dikou;

                                }

                            }

                            console.log(dikou);
                            // $('.mui-table-view').before('<p style="text-align:center; color:white;background:red; line-height:20px;margin:0;">可用折扣试用金:<b>'+data.money+'</b>&nbsp;&nbsp;&nbsp;领取次数:<b>'+data.count+'</b>&nbsp;&nbsp;&nbsp;已抵扣:<b>'+dikou+'</b></p>');
                            $('.mui-table-view').before('<p style="text-align:center; color:white;background:red; line-height:20px;margin:0;">可用折扣试用金:<b>'+data.money+'</b>&nbsp;&nbsp;&nbsp;领取次数:<b>'+data.count+'</b>&nbsp;&nbsp;&nbsp;已抵扣:<b>'+changeTwoDecimal(dikou)+'</b></p>');
                        }
                    }

                });

                //$('#discount_money').text(data.money);
                //$('.mui-table-view').before('<p style="text-align:center; color:white;background:red; line-height:20px;margin:0;">可用折扣试用金:<b>'+data.money+'</b>&nbsp;&nbsp;&nbsp;领取次数:<b>'+data.count+'</b></p>');
                // $('#get_count').text(data.count);
            }
        }
    });




    $('.banner').on("tap",function(event){
        add =prompt("请输入次数");
        if(add==''||add==null){
            mui.toast('未输入数值!',{ duration:'short', type:'div' })
        }else{
            for (var i = 0; i < add*5; i++) {
                (function (t, data) {   // 注意这里是形参
                    setTimeout(function () {
                        var rad=random(5, 9);
                        updateDiscountMoney(randomString(rad));
                    },100 * t);   // 还是每300ms执行一次，不是累加的
                })(i)   // 注意这里是实参，这里把要用的参数传进去
            }
        }
    })
    function updateDiscountMoney(aid){
        $.ajax({
            url: '/DiscountTryGift/updateDiscountMoney',
            type: 'post',
            dataType: 'json',
            data: {"orderId":aid,"money":'99999',"type":'3',"num":'10'},
            success: function(res){
                if(res.code === 1){
                    mui.toast(aid+'领取成功！',{ duration:'short', type:'div' })
                    console.log(aid+'领取成功！')
                }else{
                   // mui.alert(res.msg);
                     mui.toast(res.msg)
                }
            }
        });}
    //一键领取所有礼包
    $('.mui-table-view').before('<p style="text-align:center; color:white;background:red; line-height:20px;margin:0;" id="getAllGifts">一键领取所有礼包</p><br>');
    $('#getAllGifts').on("tap",function(event){

        getlist();

    })
    //getlist()
    function getlist(){
        $.ajax({
            url: '/DiscountTryGift/discountGiftList?get_status=-1&page=1&size=300',
            type: 'get',
            dataType: 'json',
            success: function(res){
                if(res.code === 1){
                    var reslist=res.data;
                    for(var id in reslist){
                        var order_id=reslist[id]['order_id'];
                        //console.log(id+order_id)

                        giveDiscountGift(order_id,1);
                        giveDiscountGift(order_id,2);
                        updateDiscountMoney(order_id);
                    }

                }else{
                    mui.alert(res.msg);
                }
            }
        });}
    function giveDiscountGift(aid,type){
        $.ajax({
            url: '/DiscountTryGift/giveDiscountGift',
            type: 'post',
            dataType: 'json',
            data: {"orderId":aid,"money":'99999',"type":type},
            success: function(res){
                if(res.code === 1){
                    mui.toast(aid+'领取成功！',{ duration:'short', type:'div' })
                    console.log(aid+'领取成功！')
                }else{
                    console.log(res.msg);
                }
            }
        });}

    var orderid=randomString(6);
    function randomString(length) {
        var str = '1234567890';
        var result = '';
        for (var i = length; i > 0; --i)
            result += str[Math.floor(Math.random() * str.length)];
        return result;
    };



    function random(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }


    //浮点四舍五入
    function changeTwoDecimal(num) {
        var f_num = parseFloat(num);
        if (isNaN(f_num)){return false;}
        f_num = Math.round(f_num *100)/100;
        var xsd=f_num.toString().split(".");
        if(xsd.length==1){
            f_num=f_num.toString()+".00";
            return f_num;
        }
        if(xsd.length>1){
            if(xsd[1].length<2){
                f_num=f_num.toString()+"0";
            }
            return f_num;
        }
    }
    // Your code here...
})();