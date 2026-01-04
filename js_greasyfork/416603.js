// ==UserScript==
// @name         试客巴单品自动申请
// @namespace    http://ziyuand.cn/
// @version      0.9
// @description  免验证自动申请
// @author       SHERWIN
// @match       *.shike8888.com/activity/toDetail?aid=*
// @match        https://wx.shike8888.com/activity/toDetail?aid=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416603/%E8%AF%95%E5%AE%A2%E5%B7%B4%E5%8D%95%E5%93%81%E8%87%AA%E5%8A%A8%E7%94%B3%E8%AF%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/416603/%E8%AF%95%E5%AE%A2%E5%B7%B4%E5%8D%95%E5%93%81%E8%87%AA%E5%8A%A8%E7%94%B3%E8%AF%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var aid = getQueryString('aid');
    //获取get参数
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    } ;
     $('title').after('<script src=" https://static-h5r-alicnd.shike8888.com/js/clipboard.min.js"></script>');
    //点击价格复制aid
    $('.order_amount').on("tap",function(event){
        new Clipboard(this, {
            text: function() {
                 mui.toast('复制ID成功',{ duration:'short', type:'div' });
                return aid;
            }
        });
    });
    $('.jianglitubiao').before('<p style="width:200px;height:30px;margin:0 auto;color:white;background-color:red; z-index:999;text-align:center;line-height:30px;"id="apply" >点击申请</p><br>');
    $('#apply').on("tap",function(event){
        apply();
    });
    function apply(){
        var data = {act_id:aid,type:"2"};
        $.toAjax({
            url:"/apply/insertNewApply",
            data:data,
            type:"post",
            success:function (data) {
                if (data.code == 1) {
                    // window.location.href="/apply/applySuccess?applyId="+data.applyId;
                    console.log('申请成功！');
                    mui.toast('申请成功！')

                }else{
                    mui.toast(data.msg)
                }
            }
        });
    }

    var shopnames,safeday;
    $.post('https://wx.shike8888.com/apply/searchInfo?aid='+aid,function(ret){
        //商品列表
        var dataList = ret.data;
        $('#apply').before('<p style="text-align:center; color:#f10180;"id="shopnames" >店铺完整名称：【'+dataList[0]['shopname']+"】</p><br>");
        shopnames=dataList[0]['shopname'];
        for(var i=0;i<dataList.length;i++){
            console.log('店铺完整名称：'+dataList[i]['shopname']+' 关键词'+i+'：'+dataList[i]['keywords']);
            $('.floorTitle:first').after('<p >关键词'+i+'：'+dataList[i]['keywords']+"</p>");
        }},'json');


    $.post('https://wx.shike8888.com/activity/getBaseDetail?act_id='+aid,function(ret){
        //商品列表
        console.log('保护期：'+ret.activityDto['safe_day']);
        safeday=ret.activityDto['safe_day'];
        $('.floorTitle:first').after('<p ><b>保护期：'+safeday+' 天</b></p>');
            $('#apply').after('<br><p style="text-align:center;"><a id="tiaozhuan" style="font-size:0.4rem;color:#f10180;z-index:999;" href="'+ret.activityDto['product_link']+'" target="_blank"><b>【点我打开链接】</b></a></p>');


            $("#tiaozhuan").off().on('tap',function(){
                console.log(this);
                window.location.href=product_link;

            });



    },'json');

 $('.jianglitubiao').append('<p style="text-align:center;" ><b>----------------相关订单----------------</b></p>');
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
                //console.log(starttime);
                //  alert(nowtimestamp);
                // alert(starttime);
                var issafe=nowtimestamp-starttime;
               // console.log(issafe);
                var cha=parseInt(issafe/(24*60*60*1000));
               //console.log(safeday);
                var  safe=safeday-cha;
               //console.log(safe);
                // alert(safe);
                 if(safe>0){
                 $('#shopnames').before('<p style="text-align:center;" ><b>'+"防护期还剩："+safe+"天"+'</b></p>');
                    console.log("防护期还剩："+safe+"天");

                }else if(safe<=0){
                 $('#shopnames').before('<p style="text-align:center;" ><b>'+"防护期已过"+Math.abs(safe)+"天"+'</b></p>');
                    console.log("防护期还剩："+safe+"天");
                }
                console.log("【店铺名称："+shopname+"】 ID："+aid+" 商品："+goodsname+" 订单id："+order+" 中奖时间："+recieve_start_time+' 状态:【'+zhuangtai+'】');
               
                $('.jianglitubiao').append('<p style="text-align:center;" ><b>中奖时间：'+recieve_start_time+'</b></p>');
                $('.jianglitubiao').append('<p style="text-align:center;" ><b>商品：'+goodsname+'</b></p>');
                $('.jianglitubiao').append('<p style="text-align:center;" ><b>ID：'+aid+" 订单id："+order+'</b></p>');
                $('.jianglitubiao').append('<p style="text-align:center;" ><b>状态:【'+zhuangtai+'】</b></p>');

               
                //clearInterval(myVar);
            }else{
                //console.log(zhuangtai+'订单中未找到本店铺相关订单');
            }
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
})();