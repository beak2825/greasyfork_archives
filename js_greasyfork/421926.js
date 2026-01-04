// ==UserScript==
// @name         试客巴折扣试用去灰色/批量抢购/增加试用金
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description 折扣试用页面去灰色
// @author       Sherwin
// @match        https://wx.shike8888.com/special/discount
// @run-at 		 document-end
// @grant    	 unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/421926/%E8%AF%95%E5%AE%A2%E5%B7%B4%E6%8A%98%E6%89%A3%E8%AF%95%E7%94%A8%E5%8E%BB%E7%81%B0%E8%89%B2%E6%89%B9%E9%87%8F%E6%8A%A2%E8%B4%AD%E5%A2%9E%E5%8A%A0%E8%AF%95%E7%94%A8%E9%87%91.user.js
// @updateURL https://update.greasyfork.org/scripts/421926/%E8%AF%95%E5%AE%A2%E5%B7%B4%E6%8A%98%E6%89%A3%E8%AF%95%E7%94%A8%E5%8E%BB%E7%81%B0%E8%89%B2%E6%89%B9%E9%87%8F%E6%8A%A2%E8%B4%AD%E5%A2%9E%E5%8A%A0%E8%AF%95%E7%94%A8%E9%87%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
        // $('title').after('<script src=" https://static-h5r-alicnd.shike8888.com/js/clipboard.min.js"></script>')
    $('.banner').append('<p style="width:80px;height:30px;margin:0 auto;color:red;background:yellow; z-index:999;text-align:center;line-height:30px;"id="qianggou" >批量抢购</p>');
        //获取当前点击商品aid


    $("div").scroll(function() {
        $('button').removeAttr('disabled','')
        $('button').attr("class","to-shop");

    });

    $.post('https://wx.shike8888.com/discount/list?searchType=1&page=0&size=100',function(ret){
        for(var s in ret.data){
            console.log('商品ID：'+ret.data[s]['act_id']+', 名称：'+ret.data[s]['product_name']+' 金额：'+ret.data[s]['margin']+' 剩余份数：'+ret.data[s]['now_having_num'])
        }
    },'json');
    // Your code here...
    $('#qianggou').on("tap",function(event){
        var goodsid=prompt("请输入商品ID(例：123,456,789)逗号为英文：");
 var idList = goodsid.split(',');

        for(var i in idList){
               submitid(idList[i]);
                }
    });
    function submitid(aid){
            $.ajax({
            url: '/discount/receive',
            data: {actId: aid},
            type: 'get',
            dataType: 'json',
            success: function(res){
                if(res.code === 1){
                    mui.toast('抢购成功！',function(){
                       // window.location.href = '/tryUse/newTrialTask?type=2';
                    })

                }else{
                    mui.toast(res.msg||'抢购失败，请重试');
                }
            },
            error: function(){
                mui.toast('抢购失败，请重试');
            }
        })


    }

 //-------------------------------------------增加试用金
var add;

    $.ajax({
        url: '/DiscountTryGift/discountMoneyInfo',
        type: 'get',
        dataType: 'json',
        success: function (data) {
           if(data.code == 1){
               //$('#discount_money').text(data.money);
                $('#qianggou').before('<p style="text-align:center; color:white;background:red; line-height:20px;margin:0;">可用折扣试用金:<b>'+data.money+'</b>&nbsp;&nbsp;&nbsp;领取次数:<b>'+data.count+'</b></p>');
              // $('#get_count').text(data.count);
           }
        }
    });




    $('.banner img').on("tap",function(event){

        add =prompt("请输入次数");
        if(add!==''){
            for (var i = 0; i < add*5; i++) {
                (function (t, data) {   // 注意这里是形参
                    setTimeout(function () {
                        var rad=random(5, 9);
                        linqu(randomString(rad));
                    },100 * t);   // 还是每300ms执行一次，不是累加的
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
            //data: {"orderId":aid,"money":'99999',"type":'3',"num":'10'},
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
        var str = '1234567890';
        var result = '';
        for (var i = length; i > 0; --i)
            result += str[Math.floor(Math.random() * str.length)];
        return result;
    };



    function random(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }





})();