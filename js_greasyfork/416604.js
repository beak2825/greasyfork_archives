// ==UserScript==
// @name         试客巴整点定时抢购
// @namespace    http://ziyuand.cn/
// @version      1.3
// @description  定时抢购
// @author       SHERWIN
// @match        https://wx.shike8888.com/activity/WinningDetail?aid=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416604/%E8%AF%95%E5%AE%A2%E5%B7%B4%E6%95%B4%E7%82%B9%E5%AE%9A%E6%97%B6%E6%8A%A2%E8%B4%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/416604/%E8%AF%95%E5%AE%A2%E5%B7%B4%E6%95%B4%E7%82%B9%E5%AE%9A%E6%97%B6%E6%8A%A2%E8%B4%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("开始定时");
    $('.goods_name').after('<p style="width:200px;height:40px;margin:0 auto;color:white;background-color:red; z-index:999;text-align:center;line-height:40px;"id="checkid" >提前点击</p>');
 $('title').after('<script src=" https://static-h5r-alicnd.shike8888.com/js/clipboard.min.js"></script>')
    //copy('.order_amount');

    $('#checkid').on("tap",function(event){
        check(aid);
    });
    if (typeof(aid) == "undefined"){
        var aid=getUrlParam('aid');
    }
var shopnames,safeday;
    var zhuangtai='';
    $.post('https://wx.shike8888.com/apply/searchInfo?aid='+aid,function(ret){
        //商品列表
        var dataList = ret.data;
        shopnames=dataList[0]['shopname'];
        for(var i=0;i<dataList.length;i++){
            console.log('店铺完整名称：'+dataList[i]['shopname']+' 关键词'+i+'：'+dataList[i]['keywords']);
            $('#images_detail').append('<p>店铺完整名称：'+dataList[i]['shopname']+' 关键词'+i+'：'+dataList[i]['keywords']+'</p>');
        }},'json');
    $.post('https://wx.shike8888.com/activity/getFlashDetail?act_id='+aid,function(ret){
        //商品列表
        console.log('保护期：'+ret.activityDto['safe_day']);
        safeday=ret.activityDto['safe_day'];
        $('#images_detail').append('<p>保护期：'+safeday+' 天</p>');
    },'json');
    var j=0;
    function miaosha(){
        for (var i=0;i<20;i++)
        {
            j++;
            console.log("开始执行第"+j+"次自动抢购");
            mui.toast("开始执行第"+j+"次自动抢购",{ duration:'short', type:'div' })
            var timestamp = (new Date()).getTime();
            var timestamps=timestamp-1000;
            $.ajax({
                url: '/exchange/addForExchange',
                type: 'POST',
                dataType: 'json',
                data: { aid: aid ,act_id:timestamps,src_id:timestamp},
                success:function(ret){
                    var clickNum = 0;
                    if (ret.code == 1) {
                        if( ret.is_competitor == 1){// 竞品打标商品
                            $('#competitor_btn').on('tap',function(){
                                window.location.href = "/apply/apply_searchGoods?aid=" + aid + '&a_type=' + 6+'&id=' + ret.order_id;
                            });
                        }else{
                            mui.alert('恭喜您！抢购成功！请赶紧去领取下单吧', function() {
                                location.href = '/tryUse/tryTask'
                            });
                            console.log('恭喜您！抢购成功！请赶紧去领取下单吧');
                        }
                    } else if(ret.code != -1){
                        mui.alert(ret.msg, function() {
                            location.reload();
                        });

                       mui.toast(ret.msg,{ duration:'short', type:'div' });
                         console.log(ret.msg);
                    }
                },
                error:function(){
                    var clickNum = 0;
                   // mui.alert("抢购失败，请重试！");
                     mui.toast("抢购失败，请重试！",{ duration:'short', type:'div' });
                }
            })
        };

    };

    var myVar =setInterval(function() {
        //$.post(' https://wx.shike8888.com/activity/getTime',function(t){
            //console.log(t.time);
            var webTime=new Date();
            var webHours=webTime.getHours ();
            var webMinutes=webTime.getMinutes();
            var webSeconds=webTime.getSeconds();
            if(webHours<='23'&& (webMinutes=='00'||webMinutes=='59')&& (webSeconds=='59'||webSeconds<'05')){
                console.log('现在时间：'+webHours+":"+webMinutes+":"+webSeconds);
                miaosha();
            }else if(webHours<='23'&& webMinutes=='59'&&webSeconds=='50'){
                console.log('现在时间：'+webHours+":"+webMinutes+":"+webSeconds);
                console.log('10秒后开始抢购');
                mui.toast('10秒后开始抢购',{ duration:'short', type:'div' });
            }else{
                console.log('现在时间：'+webHours+":"+webMinutes+":"+webSeconds);
            }

      //  },'json');

    }, 50);

    //get参数获取程序
    function getUrlParam (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    };


    function check(aid){

        var timestamp = (new Date()).getTime();
        var timestamps=timestamp-1000;
        $.ajax({
            url: '/exchange/addForExchange',
            type: 'POST',
            dataType: 'json',
            data: { aid: aid ,act_id:timestamps,src_id:timestamp},
            success:function(ret){
                if (ret.code != -1) {
                    console.log(ret.msg);
                    mui.toast(ret.msg,{ duration:'short', type:'div' })
                }
            },
            error:function(){
                console.log("查询失败，请重试！");
            }
        })

    }
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
                if(safe>0){
                 $('#checkid').before('<p style="text-align:center;" ><b>'+"防护期还剩："+safe+"天"+'</b></p>');
                    console.log("防护期还剩："+safe+"天");

                }else if(safe<=0){
                 $('#checkid').before('<p style="text-align:center;" ><b>'+"防护期已过"+Math.abs(safe)+"天"+'</b></p>');
                    console.log("防护期还剩："+safe+"天");
                }
            console.log("【店铺名称："+shopname+"】 ID："+aid+" 商品："+goodsname+" 订单id："+order+" 中奖时间："+recieve_start_time+' 状态:【'+zhuangtai+'】');
             $('#images_detail').before('<br><p style="text-align:center;" ><b> 中奖时间：'+recieve_start_time+'</b></p>');
             $('#images_detail').before('<p style="text-align:center;" ><b> 商品：'+goodsname+'</b></p>');
             $('#images_detail').before('<p style="text-align:center;" ><b> ID：'+aid+" 订单id："+order+'</b></p>');
             $('#images_detail').before('<p style="text-align:center;" ><b> 状态:【'+zhuangtai+'】</b></p>');

            
               
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
//点击价格复制aid
    $('.order_amount').on("tap",function(event){
        new Clipboard(this, {
            text: function() {
                 mui.toast('复制ID成功',{ duration:'short', type:'div' });
                return aid;
            }
        });
    });

     $.post('https://wx.shike8888.com/activity/getBaseDetail?act_id='+aid,function(res){

            $('#checkid').after('<br><p style="text-align:center;"><a id="tiaozhuan" style="font-size:0.4rem;color:#f10180;z-index:999;" href="'+res.activityDto['product_link']+'" target="_blank"><b>【点我打开链接】</b></a></p>');


            $("#tiaozhuan").off().on('tap',function(){
                console.log(this);
                window.location.href=product_link;

            });

        },'json');
})();