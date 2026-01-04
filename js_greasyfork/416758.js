// ==UserScript==
// @name         试客巴单品捡漏
// @namespace    http://ziyuand.cn
// @version      0.8
// @description  单品捡漏
// @author       sherwin
// @match        https://wx.shike8888.com/activity/toPickDetail*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416758/%E8%AF%95%E5%AE%A2%E5%B7%B4%E5%8D%95%E5%93%81%E6%8D%A1%E6%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/416758/%E8%AF%95%E5%AE%A2%E5%B7%B4%E5%8D%95%E5%93%81%E6%8D%A1%E6%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('脚本开始加载，已开启定时捡漏');
     mui.toast('脚本开始加载，已开启定时捡漏',{ duration:'short', type:'div' })
    $('.goods_name').after('<br><p style="width:80px;height:40px;margin:0 auto;color:white;background-color:red; z-index:999;text-align:center;line-height:40px;"id="jianlou" >提前点击</p>');
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


    var shopnames,safeday;
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    } ;

    var aid = getQueryString('aid');
    console.log("当前商品ID："+aid);
    function freeReceive(aids){
        Promise.all([
            creatPromise('/sorder/receiveGoods',{act_id: aids})
        ]).then(function(result){
            $('#apply_sub').attr('disabled',false);
        },function(){
            $('#apply_sub').attr('disabled',false);
        });
    };
    //异步函数
    function creatPromise(url,data){
        return new Promise(function(resolve,reject){
            $.post(url,data,function(result){
                resolve(result);
            },'json')
        });
    };
    $('#jianlou').on("tap",function(event){ freeReceive(aid);});
    setInterval(function() {
        var Time=new Date();
        var Hours=Time.getHours ();
        var Minutes=Time.getMinutes();
        var Seconds=Time.getSeconds();
        if(Hours=='22'&& Minutes=='30'&& (Seconds=='00'||Seconds<'10')){
            for(var j = 0; j < 10; j++) {
                freeReceive(aid);
                console.log('第'+j+'次抢购');

            };
        }
    }, 50);

    var zhuangtai='';
    $.post('https://wx.shike8888.com/apply/searchInfo?aid='+aid,function(ret){
        //商品列表
        var dataList = ret.data;
        shopnames=dataList[0]['shopname'];
        for(var i=0;i<dataList.length;i++){
            console.log('店铺完整名称：'+dataList[i]['shopname']+' 关键词'+i+'：'+dataList[i]['keywords']);
            $('#images_detail').append('<p>店铺完整名称：'+dataList[i]['shopname']+' 关键词'+i+'：'+dataList[i]['keywords']+'</p>');
        }},'json');
    $.post('https://wx.shike8888.com/activity/getPickDetail?act_id='+aid,function(ret){
        //商品列表
        console.log('保护期：'+ret.datail['safe_day']);
        safeday=ret.datail['safe_day'];
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
                // console.log(goodslist[l]['show_time']);
                var starttime=goodslist[l]['show_time'];
                var shopurl='https://wx.shike8888.com/apply/searchInfo?aid='+aid;
                getShop(shopurl,aid,goodsname,order,recieve_start_time,listTypes,starttime);
                //console.log(listTypes);


            }
        },'json');
    };

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
                var issafe=nowtimestamp-starttime;
                //console.log()
                var  safe=safeday-parseInt(issafe/(24*60*60*1000));
                console.log("【店铺名称："+shopname+"】 ID："+aid+" 商品："+goodsname+" 订单id："+order+" 中奖时间："+recieve_start_time+' 状态:【'+zhuangtai+'】');
                $('#images_detail').before('<br><p style="text-align:center;" ><b> 中奖时间：'+recieve_start_time+'</b></p>');
                $('#images_detail').before('<p style="text-align:center;" ><b> 商品：'+goodsname+'</b></p>');
                $('#images_detail').before('<p style="text-align:center;" ><b> ID：'+aid+" 订单id："+order+'</b></p>');
                $('#images_detail').before('<p style="text-align:center;" ><b> 状态:【'+zhuangtai+'】</b></p>');

                $('.goods_name').after('<br><p style="text-align:center;" ><b>'+"防护期还剩："+safe+"天"+'</b></p>');
                console.log("防护期还剩："+safe+"天");
                if(safe>=0){
                    //clearInterval(myVar);
                }
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

         $.post('https://wx.shike8888.com/activity/getBaseDetail?act_id='+aid,function(res){

            $('#jianlou').after('<br><p style="text-align:center;"><a id="tiaozhuan" style="font-size:0.4rem;color:#f10180;z-index:999;" href="'+res.activityDto['product_link']+'" target="_blank"><b>【点我打开链接】</b></a></p>');


            $("#tiaozhuan").off().on('tap',function(){
                console.log(this);
                window.location.href=product_link;

            });

        },'json');
    // Your code here...
})();