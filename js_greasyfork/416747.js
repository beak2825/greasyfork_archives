// ==UserScript==
// @name         试客巴夺宝币兑换
// @namespace    http://ziyuand.cn/
// @version      1.8
// @description  整点夺宝币自动兑换
// @author       SHERWIN
// @match        https://wx.shike8888.com/activity/ExchangeDetail*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416747/%E8%AF%95%E5%AE%A2%E5%B7%B4%E5%A4%BA%E5%AE%9D%E5%B8%81%E5%85%91%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/416747/%E8%AF%95%E5%AE%A2%E5%B7%B4%E5%A4%BA%E5%AE%9D%E5%B8%81%E5%85%91%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var shopnames,safeday;
    var aid = getQueryString('aid');
    $('.goods_name').after('<br><p style="width:80px;height:40px;margin:0 auto;color:white;background-color:red; z-index:999;text-align:center;line-height:40px;"id="jianlou" >提前点击</p>');
    $('#jianlou').on("tap",function(event){gettoken(aid);});
    console.log("开始定时");
    //获取get参数
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    } ;


    //console.log('点击批量申请开始设置ID');

    setInterval(function() {
        var Time=new Date();
        var Hours=Time.getHours ();
        var Minutes=Time.getMinutes();
        var Seconds=Time.getSeconds();
        console.log('现在时间：'+Hours+":"+Minutes+":"+Seconds);
        if((Hours=='10'||Hours=='11'||Hours=='17'||Hours=='18')&&( Minutes=='00'|| Minutes=='59')&&(Seconds=='59'||Seconds=='00'||Seconds<'5')){
            // console.log('现在时间：'+Hours+":"+Minutes+":"+Seconds);
            //gettoken(aid);
            mui.ajax("/exchange/createToken",{
                data:{"aid":aid},
                dataType:"json",
                type:"post",
                success:function (data) {
                    if(data.code==1){
                        // token=data.data
                        applystart(data.data,aid);
                    }else {
                        mui.alert(data.msg);
                    }
                }
            })
        }
        if(Minutes=='59'&&Seconds=='50'){
            // console.clear();
            //console.log('现在时间：'+Hours+":"+Minutes+":"+Seconds);
            console.log('10秒后开始申请');
        };
    }, 50);


    var cishu=0;

    function applystart(token,aid){
        cishu++;
        var timestamp = (new Date()).getTime();
        var timestamps=timestamp-1000;
        mui.ajax("/exchange/addForExchange", {
            data: { "aid":aid,"token":token,act_id:timestamps,src_id:timestamp},
            dataType: "json",
            type: "post",
            success: function(ret) {
                if (ret.code == 1) {
                    console.log(cishu+'商品ID：'+aid+' 抢购成功');
                    mui.toast(cishu+'商品ID：'+aid+' 抢购成功');
                }else {
                    console.log(cishu+'商品ID：'+aid+ret.msg);
                    mui.toast(cishu+'商品ID：'+aid+ret.msg);
                }
            }
        });

    }

    function gettoken(aids){
        console.log(aids);
        mui.ajax("/exchange/createToken",{
            data:{"aid":aids},
            dataType:"json",
            type:"post",
            success:function (data) {
                if(data.code==1){
                    // token=data.data
                    applystart(data.data,aids);
                }else {
                    mui.alert(data.msg);
                }
            }
        })
    }

    $.post('https://wx.shike8888.com/apply/searchInfo?aid='+aid,function(ret){
        //商品列表
        var dataList = ret.data;
        shopnames=dataList[0]['shopname']
        $('#images_detail').append('<p>店铺完整名称：'+shopnames+'</p>');
        for(var i=0;i<dataList.length;i++){
            console.log('店铺完整名称：'+dataList[i]['shopname']+' 关键词'+i+'：'+dataList[i]['keywords']);

            $('#images_detail').append('<p>关键词'+i+'：'+dataList[i]['keywords']+'</p>');
        }},'json');

    $.post('https://wx.shike8888.com/activity/getFlashDetail?act_id='+aid,function(ret){
        //商品列表
        console.log('保护期：'+ret.activityDto['safe_day']);
        safeday=ret.activityDto['safe_day'];
        $('#images_detail').append('<p>保护期：'+safeday+' 天</p>');
    },'json');
    $.post('https://wx.shike8888.com/activity/getBaseDetail?act_id='+aid,function(ret){
        //商品列表
        console.log('保护期：'+ret.activityDto['safe_day']);
        safeday=ret.activityDto['safe_day'];
        $('#images_detail').append('<p>保护期：'+safeday+' 天</p>');
    },'json');


    var urltimestamp = (new Date()).getTime();
    //var listType;
    for(var type=1;type<=7;type++){
        getlist(type);
    }
    var listTypes;

    //var url='https://wx.shike8888.com/tryUserManage/myTry/orderList?pageNo=1&pageSize=100&listType='+listType+'&_='+urltimestamp;//待领取
    function getlist(listType){
        $.post('https://wx.shike8888.com/tryUserManage/myTry/orderList?pageNo=1&pageSize=100&listType='+listType+'&_='+urltimestamp,function(ret){
            var goodslist = ret.data.list;
            listTypes=listType;

            for(var l in goodslist){

                var aid=goodslist[l]['act_id'];
                var  goodsname=goodslist[l]['product_name'];
                var order=goodslist[l]['order_id'];
                //console.log(aid+goodsname+order);
                //recieve_start_time=goodsID[j]['recieve_start_time'];
                var recieve_start_time=timestampToTime(goodslist[l]['show_time']);
                //console.log(goodslist[l]['show_time']);
                var starttime=goodslist[l]['show_time'];
                var shopurl='https://wx.shike8888.com/apply/searchInfo?aid='+aid;
                getShop(shopurl,aid,goodsname,order,recieve_start_time,listTypes,starttime);
                //console.log(listTypes);


            }
        },'json');
    };
    var zhuangtai='';
    function getShop(url,aid,goodsname,order,recieve_start_time,status,starttime){
        //console.log(status);

        $.post(url,function(res){

            var shopname = res.data[0]['shopname'];
            if(shopname==shopnames){
                console.log("----------------------店铺相关订单----------------------------");
                switch (status) {
                    case 1:
                        zhuangtai='待领取';
                        //console.log("-----------------待领取-----------------");
                        break;
                    case 2:
                        zhuangtai='待发货';
                        //console.log("-----------------待发货-----------------");
                        break;
                    case 3:
                        zhuangtai='收货评价';
                        //console.log("-----------------收货评价-----------------");
                        break;
                    case 4:
                        zhuangtai='待审核评价';
                        //console.log("-----------------待审核评价-----------------");
                        break;
                    case 5:
                        zhuangtai='待复制评价';
                        //console.log("-----------------待复制评价-----------------");
                        break;
                    case 6:
                        zhuangtai='待确评价';
                        //console.log("-----------------待确评价-----------------");
                        break;
                    case 7:
                        zhuangtai='已完成';
                        //console.log("-----------------已完成-----------------");
                        break;
                    default:
                        // 已取消
                        zhuangtai='已取消';
                        break;
                };

                var nowtimestamp = (new Date()).getTime();
                //console.log(nowtimestamp);
                //  alert(nowtimestamp);
                // alert(starttime);
                var issafe=nowtimestamp-starttime;
                //alert(issafe);
                var cha=parseInt(issafe/(24*60*60*1000));
                // alert(safeday);
                var  safe=safeday-cha;
                //console.log(safe);
                // alert(safe);
                console.log("【店铺名称："+shopname+"】 ID："+aid+" 商品："+goodsname+" 订单id："+order+" 中奖时间："+recieve_start_time+' 状态:【'+zhuangtai+'】');
                $('#images_detail').before('<br><p style="text-align:center;" ><b> 中奖时间：'+recieve_start_time+'</b></p>');
                $('#images_detail').before('<p style="text-align:center;" ><b> 商品：'+goodsname+'</b></p>');
                $('#images_detail').before('<p style="text-align:center;" ><b> ID：'+aid+" 订单id："+order+'</b></p>');
                $('#images_detail').before('<p style="text-align:center;" ><b> 状态:【'+zhuangtai+'】</b></p>');


                console.log("防护期还剩："+safe+"天");

                if(safe>0){
               $('#jianlou').before('<p style="text-align:center;" ><b>'+"防护期还剩："+safe+"天"+'</b></p>');
                    console.log("防护期还剩："+safe+"天");

                }else if(safe<=0){
                 $('#jianlou').before('<p style="text-align:center;" ><b>'+"防护期已过："+Math.abs(safe)+"天"+'</b></p>');
                    console.log("防护期已过："+Math.abs(safe)+"天");
                }}
        },'json');

    };
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
  //点击价格复制aid
 var flag;
    $('.order_amount').on("tap",function(event){
            flag = copyText(aid); //传递文本
        mui.toast(flag ? "复制成功！" : "复制失败！",{ duration:'short', type:'div' });
    });

     function copyText(text) {
        var textarea = document.createElement("input");//创建input对象
        var currentFocus = document.activeElement;//当前获得焦点的元素
        document.body.appendChild(textarea);//添加元素
        textarea.value = text;
        textarea.focus();
        if(textarea.setSelectionRange)
            textarea.setSelectionRange(0, textarea.value.length);//获取光标起始位置到结束位置
        else
            textarea.select();
        try {
            var flag = document.execCommand("copy");//执行复制
        } catch(eo) {
            flag = false;
        }
        document.body.removeChild(textarea);//删除元素
        currentFocus.focus();
        return flag;
    }
     $.post('https://wx.shike8888.com/activity/getBaseDetail?act_id='+aid,function(res){

            $('#jianlou').after('<br><p style="text-align:center;"><a id="tiaozhuan" style="font-size:0.4rem;color:#f10180;z-index:999;" href="'+res.activityDto['product_link']+'" target="_blank"><b>【点我打开链接】</b></a></p>');


            $("#tiaozhuan").off().on('tap',function(){
                console.log(this);
                window.location.href=product_link;

            });

        },'json');
})();