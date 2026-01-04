// ==UserScript==
// @name         试客巴批量夺宝币兑换
// @namespace    http://ziyuand.cn
// @version      1.8
// @description  批量夺宝币兑换
// @author       SHERWIN
// @match        https://wx.shike8888.com/activity/goExchange
// @match        https://wx.shike8888.com/activity/goExchange*
// @match        https://wx.shike8888.com/
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/417868/%E8%AF%95%E5%AE%A2%E5%B7%B4%E6%89%B9%E9%87%8F%E5%A4%BA%E5%AE%9D%E5%B8%81%E5%85%91%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/417868/%E8%AF%95%E5%AE%A2%E5%B7%B4%E6%89%B9%E9%87%8F%E5%A4%BA%E5%AE%9D%E5%B8%81%E5%85%91%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('.isExchange_modal').remove() ;
    var numList;
    var isclick=false;
    var products = [];
    var href =window.location.href;
    if(href.indexOf("goExchange") != -1){
        $('#nav').append('<br><div><p style="width:100px;height:40px;margin:0 auto;color:white;background-color:red; z-index:999;text-align:center;line-height:40px;"id="shenqin" >批量定时兑换</p><div>');

        $.post('https://wx.shike8888.com/exchange/getAll?type=0&category=0&order=1&time_type=1&status=3',function(ret){
            // console.log("------------------------11点场-------------------------");
            //商品列表
            //var dataList = ret.data;
            for(var i in ret.data){
                // console.log('商品ID：'+ret.data[i]['act_id']+', 名称：'+ret.data[i]['product_name']);
                getshopname(ret.data[i]['act_id'],ret.data[i]['product_name'],"11点场")
            }},'json');

        $.post('https://wx.shike8888.com/exchange/getAll?type=0&category=0&order=1&time_type=2&status=3',function(ret){
            // console.log("------------------------18点场-------------------------");
            //商品列表
            //var dataList = ret.data;
            for(var i in ret.data){
                // console.log('商品ID：'+ret.data[i]['act_id']+', 名称：'+ret.data[i]['product_name']);
                getshopname(ret.data[i]['act_id'],ret.data[i]['product_name'],"18点场")
            }},'json');
    }else if(href=="https://wx.shike8888.com/"){

        // $('#custom_module').before('<br><div><p style="width:100px;height:40px;margin:0 auto;color:white;background-color:red; z-index:999;text-align:center;line-height:40px;"id="shenqin" >批量定时兑换</p><p style="width:100px;height:40px;margin:0 auto;color:white;background-color:deeppink; z-index:999;text-align:center;line-height:40px;"id="hand" >手动批量</p><div>');
        $('<span id="shenqin"><img src="https://static-image-user-cdn.shike8888.com/s/20210318/535aa2e91b26d31292138e7c87323fec.png"></span ><br><span style="color:#ff366f">批量兑换</span>').replaceAll(".clearfix li:eq(9) a");

    }
    $('#shenqin').on("tap",function(event){

        if(isclick==false){
            getid();
        }else if(isclick==true){
            //for (var t in products){
            //applystart(products[t]['token'],products[t]['product_id']);
            //console.log(applystart(products[t]['token'],products[t]['product_id']));
            //}
            for (var s in numList){
                gettoken(numList[s]);
            };
            console.log(isclick);
        }
    });

    //var t=0;


    //console.log('点击批量申请开始设置ID');
    function getid(){
        isclick=true;
        var goodsid=prompt("请输入商品ID(例：123,456,789)逗号为英文：");
        numList = goodsid.split(',');


        if(goodsid.text==""){
            getid();
            console.log('请输入商品id');
        }else{
            //gettoken(numList);
            console.clear();console.log(numList);
            console.log("定时申请已准备就绪，将在11点、18点自动申请");
            mui.toast('定时申请已准备就绪，将在11点、18点自动申请',{ duration:'short', type:'div' })
            setInterval(function() {
                var Time=new Date();
                var Hours=Time.getHours ();
                var Minutes=Time.getMinutes();
                var Seconds=Time.getSeconds();
                console.log('现在时间：'+Hours+":"+Minutes+":"+Seconds);
                if((Hours=='10'||Hours=='11'||Hours=='17'||Hours=='18')&& (Minutes=='00'|| Minutes=='59')&&(Seconds>'56' || Seconds<'5')){
                    //if(Hours=='14'&& Minutes=='07'&&(Seconds>'56' || Seconds<'5')){
                    console.log('现在时间：'+Hours+":"+Minutes+":"+Seconds);
                    //for (var t in products){
                    //applystart(products[t]['token'],products[t]['product_id']);
                    //console.log(applystart(products[t]['token'],products[t]['product_id']));

                    // }
                    for (var s in numList){
                        gettoken(numList[s]);
                    };
                }
                if(Minutes=='59'&&Seconds=='50'){
                    console.clear();
                    console.log('现在时间：'+Hours+":"+Minutes+":"+Seconds);
                    console.log('10秒后开始申请');
                    mui.toast('10秒后开始申请',{ duration:'short', type:'div' })
                };
            }, 100);

        }
    };

    function gettoken(aids){
        mui.ajax("/exchange/createToken",{
            data:{"aid":aids},
            dataType:"json",
            type:"post",
            success:function (data) {
                if(data.code==1){
                    //token=data.data
                    applystart(data.data,aids);
                    //products.push({product_id:aids,token: data.data});
                    console.log(products);
                }else {
                    mui.alert(data.msg);
                }
            }
        })


    };
    var cishu=0;

    function applystart(token,aid){
        console.log("TOKEN:"+token+"商品ID："+aid);
        cishu++;
        var timestamp = (new Date()).getTime();
        var timestamps=timestamp;
        mui.ajax("/exchange/addForExchange", {
            data: { "aid":aid,"token":token,act_id:timestamps,src_id:timestamp},
            dataType: "json",
            type: "post",
            success: function(ret) {
                if (ret.code == 1) {
                    console.log(cishu+'商品ID：'+aid+' 抢购成功');
                    mui.toast(cishu+'商品ID：'+aid+' 抢购成功',{ duration:'short', type:'div' })
                }else {
                    console.log(cishu+'商品ID：'+aid+ret.msg);
                    mui.toast(cishu+'商品ID：'+aid+ret.msg,{ duration:'short', type:'div' })
                }
            }
        });

    }

    console.log('【已自动获取防护期，未显示防护期则为不在防护期内！】');
    var list,isdefine;
    var timestamp = (new Date()).getTime();
    var myDate = new Date();
    var nowyear=myDate.getFullYear();    //获取完整的年份(4位,1970-????)
    var month=myDate.getMonth();       //获取当前月份(0-11,0代表1月)
    var nowmonth=month+1;
    var nowdate=myDate.getDate();
    var nowtimes=nowyear+'-'+nowmonth+'-'+nowdate;
    if (typeof(GM_getValue("times")) != "undefined" ){
        console.log(GM_getValue("times"));
        if( GM_getValue("times")!=nowtimes){
            isdefine=false;
            GM_setValue("times",nowyear+'-'+nowmonth+'-'+nowdate);
        }
    }else{
        GM_setValue("times",nowyear+'-'+nowmonth+'-'+nowdate);
    }
    // GM_setValue("first",'true');

    if (typeof(GM_getValue("first")) != "undefined" ){
        isdefine=true;
        //console.log(isdefine);
    }else{
        isdefine=false;
        //console.log(isdefine);
        GM_setValue("first",'true');
    }
    for(var s=1;s<=7;s++){
        getAll(s);
    }
    //getAll();

    var lists=[];
    function getAll(s){
        // console.log(s);
        $.toAjax({
            url:'https://wx.shike8888.com/tryUserManage/myTry/orderList',
            data:{pageNo: 1,pageSize: 200,yf_type: 0,listType: s,'_=':timestamp},
            success:function (res) {
                list=res.data.list;
                lists[s]=list;
                //console.log('list1:'+list1);
                GM_setValue("list"+s,list);
                GM_setValue("first",'false');
            },
            error:function (err) {}
        });
    }
    var shop;
    function getshopname(aid,product_name,canci){
        $.post('https://wx.shike8888.com/activity/getBaseDetail?act_id='+aid,function(ret){
            //商品列表
            var dataList = ret.activityDto;
            shop=dataList['shopname'];
            var margin=dataList['margin'];
            var safe_day=dataList['safe_day'];
            //console.log(shopnames);
            var string = replaceShopNameStr(shop);
            //console.log(string);
            console.log(canci+' 【'+shop+'】 商品ID：'+aid+', 名称：'+product_name+' 金额：'+margin);
            // $('#shuchu').append('<p id="'+aid+'" >【'+shop+'】名称：'+product_name+' 金额：'+margin+'</p>');

            //$('<b>'+shop+'</b>').replaceAll("#product_list li b:eq("+k+")");
            for(var a=1;a<=7;a++){
                // var getlist=GM_getValue("list"+a);
                var getlist=lists[a];
                //console.log(getlist);
                //$('#shuchu').append('<p>【'+getlist+'】</p>');
                for(var l in getlist){
                    var shopname=getlist[l]['shopname'];
                    var starttime=getlist[l]['show_time'];
                    var productname=getlist[l]['product_name'];
                    // console.log(shopname);
                    if(shopname!=string){
                        // console.log('【'+shopname+'】 商品ID：'+aid+', 名称：'+product_name+' 金额：'+margin);
                    }else{
                        var nowtimestamp = (new Date()).getTime();
                        var issafe=nowtimestamp-starttime;
                        //console.log(issafe)
                        var  safe=safe_day-parseInt(issafe/(24*60*60*1000));
                        var nowt=timestampToTime(starttime);
                        if(safe>0){
                            //$('#checkid').before('<p style="text-align:center;" ><b>'+"防护期还剩："+safe+"天"+'</b></p>');
                            //console.log("防护期还剩："+safe+"天");
                            //console.log('【'+shop+'】 ID：'+aid+', 名称：'+product_name+' 金额：'+margin+' 防护期剩余：【'+safe+"】天");
                            console.log("%c%s","color: red; background: yellow; font-size: 14px;",'【'+shop+'】 防护期剩余：【'+safe+"】天");
                            //$('#shuchu').append('<p  style="color:white;background:red;">【'+shop+'】 防护期剩余：【'+safe+"】天</p>");
                            // $('#shuchu').append('<p>--------------------------------------------------------</p>');
                            // var listclass='#nav2 li:eq(1) a';
                            //$('<b></b>').replaceAll("#nav2 li:eq(1) a");
                        }else if(safe<=0){
                            //
                            //console.log('【'+shop+'】 ID：'+aid+', 名称：'+product_name+' 金额：'+margin+' 【防护期已过】');
                            //console.log("防护期还剩："+safe+"天");
                            // console.log('【'+shop+'】 【防护期已过】');
                        }
                    }

                    // console.log('店铺名：'+shopname+'  订单时间：'+starttime);
                }}
        },'json');
    };
    //间隔一个字转换为*，例恒源祥旗舰店，转化为恒*祥*舰*
    function replaceShopNameStr(string){
        var sNStr = "";
        for (var i = 0; i < string.length; i++) {
            sNStr = i%2==0?sNStr+=string.charAt(i):sNStr+="*";
        }
        return  sNStr;
    }

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
    applyNum();
    //获取是否有兑换资格
    function applyNum(){
        $.ajax({
            url: '/exchange/canSureEX',
            dataType: 'json',
            type: 'post',
            success: function(ret) {
                if(ret.code==1){
                    var data = ret.data;
                    arr = data.split(',');
                    //弹框提示
                    /*额度不满足----直接跳走*/
                    if(arr[0]==0){
                        mui.toast('本月兑换限额已满，请保持申请! 将根据你本月申请量，调整下月限额。',{ duration:'short', type:'div' })
                        return;
                    }

                    if(ret.hour-16<0){
                        /*昨日申请已达要求  ------弹一次*/
                        if(arr[2]==arr[1]){
                            if($.cookie("isClose") != 'yes'){
                                mui.toast('恭喜您获得兑换资格！',{ duration:'short', type:'div' });
                            }
                            return;
                        }
                        /*昨日申请未达要求*/
                        /*18未达到要求*/
                        if(arr[3]-arr[1]<0){
                            mui.toast('很抱歉，您未获得本场兑换资格！还需申请'+(arr[1]-arr[3])+'个商品可参与18点兑换！',{ duration:'short', type:'div' });
                            /*mui.alert("很抱歉，您未获得本场兑换资格！还需申请"+(arr[1]-arr[3])+"个商品可参与18点兑换！");*/
                            return;
                        }else {

                            mui.toast('您未获得11点场兑换资格！请参与18点场兑换！',{ duration:'short', type:'div' });
                        }
                    }else  {
                        /*18未达到要求----直接跳走**/
                        /*昨日申请已达要求  ------弹一次*/
                        if(arr[2]==arr[1]){
                            if(arr[4]-arr[1]<0){
                                mui.toast('恭喜您获得今日兑换资格！还需申请'+(arr[1]-arr[4])+'个商品可参与明日兑换！！',{ duration:'short', type:'div' });
                                /*mui.alert("恭喜您获得今日兑换资格！还需申请"+(arr[1]-arr[4])+"个商品可参与明日兑换！");*/
                                return;
                            }else {
                                mui.toast('恭喜您获得今日兑换资格！今日申请已满'+arr[1]+'个，可参与明日兑换！',{ duration:'short', type:'div' });
                            }
                        }
                        if(arr[3]-arr[1]<0){
                            if(arr[4]-arr[1]<0){
                                mui.toast('很抱歉，您未获得今日兑换资格！还需申请'+(arr[1]-arr[4])+'个商品可参与明日兑换！',{ duration:'short', type:'div' });
                                return;
                            }else {
                                mui.toast('很抱歉，您未获得今日兑换资格！今日申请已满'+arr[1]+'个，可参与明日兑换！',{ duration:'short', type:'div' });
                                return;
                            }
                        }else {
                            if(arr[4]-arr[1]<0){
                                mui.toast('很抱歉，您未获得今日11点场兑换资格！可参与18点场的兑换，还需申请'+(arr[1]-arr[4])+'个商品可参与明日兑换！',{ duration:'short', type:'div' });
                            }else {
                                mui.toast('您未获得11点场兑换资格！可参与今日18点场和明日的兑换！',{ duration:'short', type:'div' });

                            }

                        }

                    }
                }
            }
        });
    }
})();