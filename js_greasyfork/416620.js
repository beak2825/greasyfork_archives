// ==UserScript==
// @name         试客巴订单页获取店铺名称及商品ID
// @namespace    http://ziyuand.cn/
// @version      2.1
// @description  订单页获取店铺名称及商品ID
// @author       You
// @match        https://wx.shike8888.com/tryUse/
// @match        https://wx.shike8888.com/tryUse/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416620/%E8%AF%95%E5%AE%A2%E5%B7%B4%E8%AE%A2%E5%8D%95%E9%A1%B5%E8%8E%B7%E5%8F%96%E5%BA%97%E9%93%BA%E5%90%8D%E7%A7%B0%E5%8F%8A%E5%95%86%E5%93%81ID.user.js
// @updateURL https://update.greasyfork.org/scripts/416620/%E8%AF%95%E5%AE%A2%E5%B7%B4%E8%AE%A2%E5%8D%95%E9%A1%B5%E8%8E%B7%E5%8F%96%E5%BA%97%E9%93%BA%E5%90%8D%E7%A7%B0%E5%8F%8A%E5%95%86%E5%93%81ID.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var product_name='';
    var timestamp = (new Date()).getTime();
    var goodsID='';
    var goodsShop='';
    var goodsname='';
    var order='';
    var shopurl='';
    var j=0;
    var url1='https://wx.shike8888.com/tryUserManage/myTry/orderList?pageNo=1&pageSize=200&listType=1&_='+timestamp;//待领取
    var url2='https://wx.shike8888.com/tryUserManage/myTry/orderList?pageNo=1&pageSize=200&listType=2&_='+timestamp;//待发货
    var url3='https://wx.shike8888.com/tryUserManage/myTry/orderList?pageNo=1&pageSize=200&listType=3&_='+timestamp;//待收货评价
    var url4='https://wx.shike8888.com/tryUserManage/myTry/orderList?pageNo=1&pageSize=200&listType=4&_='+timestamp;//待审核评价
    var url5='https://wx.shike8888.com/tryUserManage/myTry/orderList?pageNo=1&pageSize=200&listType=5&_='+timestamp;//待复制评价
    var url6='https://wx.shike8888.com/tryUserManage/myTry/orderList?pageNo=1&pageSize=200&listType=6&_='+timestamp;//待确认评价
    var url7='https://wx.shike8888.com/tryUserManage/myTry/orderList?pageNo=1&pageSize=200&listType=7&_='+timestamp;//试用完成，返款成功
    var url8='https://wx.shike8888.com/tryUserManage/myTry/orderList?pageNo=1&pageSize=200&listType=8&_='+timestamp;//已取消

    var shopname='';
    var recieve_start_time='',real_paymoney=0;
    function getID(url){

        $.post(url,function(ret){
            goodsID = ret.data.list;
            for(j;j<goodsID.length;j++){
                //console.log(goodsID.length);
                var aid=goodsID[j]['act_id'];
                goodsname=goodsID[j]['product_name'];
                order=goodsID[j]['order_id'];
                // recieve_start_time=goodsID[j]['recieve_start_time'];
                recieve_start_time=timestampToTime(goodsID[j]['show_time']);
                shopurl='https://wx.shike8888.com/apply/searchInfo?aid='+aid;
                var shaitu=goodsID[j]['print_praise'];
                getShop(shopurl,aid,goodsname,order,recieve_start_time,shaitu);
                real_paymoney=goodsID[j]['real_paymoney']+real_paymoney;
            }
            console.log('金额合计：'+real_paymoney.toFixed(2));

        },'json');
    };

    //时间戳转换为日期
    function timestampToTime(timestamp) {
        var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var  D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
        var  h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
        var  m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
        var  s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
        return Y + M + D + h + m + s;
    }

    function getShop(url,aid,goodsname,order,recieve_start_time,shaitu){
        var is_shaitu;
        $.post(url,function(res){
            shopname = res.data[0]['shopname'];
            if(shaitu=='1'){
                is_shaitu='需晒图';
            }else{
                is_shaitu='';
            }
            console.log("【店铺名称："+shopname+"】 商品ID："+aid+" 商品名称："+goodsname+" 订单id："+order+" 中奖时间："+recieve_start_time+' '+is_shaitu);
            //console.log("评价提交页面：https://wx.shike8888.com/tryUse/receiveEvaluatePage?id="+order);
            // console.log("评价完成提交页面：https://wx.shike8888.com/tryUse/taobaoEvaluatePage?id="+order);
            // console.log("付款截图提交页面：https://wx.shike8888.com/tryUse/get_fourStep?id="+order+"&act_type=15&type=1");
            // console.log("付款产品详情页面：https://wx.shike8888.com/activity/getBaseDetail?act_id="+aid);

            // console.log("--------------------------------------");
            goodsID='';
            goodsShop='';
            goodsname='';
            shopurl='';
            j=0;
            order='';
        },'json');
    };

    var goodsid='';
    var orderid='';


    $('.table-view li').on("tap",function(event){
        //console.clear();
        goodsID='';
        goodsShop='';
        goodsname='';
        shopurl='';
        j=0;
        order='';
        real_paymoney=0

        var status = $(this).attr('data-status');

        switch (status) {
            case '1':
                // 待领取
                console.log("-----------------待领取-----------------");
                getID(url1);
                pinjia(event,status);
                break;
            case '2':
                // 待发货
                console.log("-----------------待发货-----------------");
                getID(url2);
                pinjia(event,status);
                break;
            case '3':
                // 收货评价
                console.log("-----------------收货评价-----------------");
                getID(url3);

                pinjia(event,status);
                break;
            case '4':
                // 待审核评价
                console.log("-----------------待审核评价-----------------");
                getID(url4);
                pinjia(event,status);
                break;
            case '5':
                // 待复制评价
                console.log("-----------------待复制评价-----------------");
                getID(url5);
                break;
            case '6':
                // 待确评价
                console.log("-----------------待确评价-----------------");
                getID(url6);
                pinjia(event,status);

                break;
            case '7':
                // 已完成
                console.log("-----------------已完成-----------------");
                getID(url7);

                break;
            default:
                // 已取消
                console.log("-----------------已取消-----------------");
                getID(url8);
                break;
        };

    });
    //console.log("评价提交页面：https://wx.shike8888.com/tryUse/receiveEvaluatePage?id="+order);
    // console.log("评价完成提交页面：https://wx.shike8888.com/tryUse/taobaoEvaluatePage?id="+order);
    // console.log("付款截图提交页面：https://wx.shike8888.com/tryUse/get_fourStep?id="+order+"&act_type=15&type=1");
    // console.log("付款产品详情页面：https://wx.shike8888.com/activity/getBaseDetail?act_id="+aid);

    //跳转评价页面
    function pinjia(event,status){
        $('.order-item-bottom div p span').on("tap",function(event){
            var thisid = $(event.target).attr('id');
            var goodsid=thisid.substring(5);
            console.log(goodsid);
            get_orderid(goodsid,status);
        });

    }
    function get_orderid(goodsid,status){
        $.toAjax({
            url:"/tryUserManage/myTry/orderList",
            data:{pageNo:1,pageSize: 200,listType:status},
            success:function (res) {
                if (res.code == 1){
                    var goodslists=res.data.list;
                    var len=res.data.list.length;
                    //console.log(len);
                    for(var i=0;i<=len;i++){
                        var goodsactid=goodslists[i]['act_id']
                        if(goodsactid==goodsid){
                            orderid=goodslists[i]['order_id'];
                            console.log(orderid);
                            if(status=='2'||status=='3'||status=='1'){
                                window.location.href = "https://wx.shike8888.com/tryUse/receiveEvaluatePage?id="+orderid;


                            }else if(status=='6'||status=='4'){
                                window.location.href = "https://wx.shike8888.com/tryUse/taobaoEvaluatePage?id="+orderid;

                            }

                        };

                    };

                };

            },
            error:function (err) {
            }
        });

    };


    var finishmonkey=0;
    $.post(url7,function(ret){
        goodsID = ret.data.list;
        for(j;j<goodsID.length;j++){
            finishmonkey=goodsID[j]['real_paymoney']+finishmonkey;
        }
        console.log('金额合计：'+finishmonkey);
        $('.return-money-box:eq(1)').append(' 已完成：'+finishmonkey.toFixed(2));
    },'json');

    var money=0;
    var tixian=0;
    var dakuan=0;
    $.post('https://wx.shike8888.com/userInfo/cashRecord?type=0',function(ret){
        //console.log(ret.data);
        // console.log(ret.data.length);
        var len=ret.data.length;
        for (var i in ret.data){
            if(ret.data[i]['status']==3){
                money=ret.data[i]['money']+money;
                //console.log(ret.data[i]['money']);

            }else if(ret.data[i]['status']==1){
                tixian=ret.data[i]['money']+tixian;
            }else if(ret.data[i]['status']==2){
                dakuan=ret.data[i]['money']+dakuan;
            }

        }
        $('.return-money-box').before('<p class="return-money-box" id="heji">已提现总额：'+money+' 打款中：'+dakuan+' 提现中：'+tixian+'</p>');
    },'json');
    $('.classify-box').append('<span style="color:red" id="cancle_order"> 取消订单</span>');
    $('#cancle_order').on("tap",function(event){
        var order_id=prompt("输入订单ID：order_id");
        console.log(order_id);
        if(order_id!=false || order_id != null){
            var act_id=prompt("输入活动ID：act_id");
            console.log(act_id);
            if(act_id!=false|| act_id != null){
                var msg = "您真的确定取消订单吗？\n\n请确认！";
                if (confirm(msg)==true){
                    cancle_order(order_id,act_id);
                }else{
                    return false;
                }


            }
        }
    })
    function cancle_order(order_id,act_id){

        $.toAjax({
            url:"/sorder/giveUpOrder",
            data:{order_id: order_id, act_id: act_id},
            type:"post",
            success:function (res) {
                if (res.code == 1) {
                    // window.location.href = '/tryUse/myTask';
                    //mui.alert('已取消订单！');

                    mui.toast('已取消订单！',{ duration:'short', type:'div' })
                }else {
                    //mui.alert(res.msg);
                    mui.toast(res.msg,{ duration:'short', type:'div' })
                }
            }
        });
    };
    receiveRewards();
function receiveRewards(){
    $.ajax('/dailyTask/receiveRewards', {
        data:{type:4},
        dataType: 'json',
        type: 'post',
        success:function(ret){
            if(ret.code == 1){
                mui.toast('<p>恭喜获得<span>'+ret.data+'</span>夺宝币</p>',{ duration:'short', type:'div' })
            }
        }
    });
};


})();