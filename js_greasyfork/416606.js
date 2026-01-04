// ==UserScript==
// @name         试客巴批量自动捡漏
// @namespace    http://ziyuand.cn/
// @version      1.3
// @description  晚上22:30分自动批量捡漏
// @author       SHERWIN
// @match       *.shike8888.com/user/specialLeak*
// @match       https://wx.shike8888.com/user/specialLeak
// @match       https://wx.shike8888.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416606/%E8%AF%95%E5%AE%A2%E5%B7%B4%E6%89%B9%E9%87%8F%E8%87%AA%E5%8A%A8%E6%8D%A1%E6%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/416606/%E8%AF%95%E5%AE%A2%E5%B7%B4%E6%89%B9%E9%87%8F%E8%87%AA%E5%8A%A8%E6%8D%A1%E6%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var href =window.location.href;
    var isclick=false;
    if (href.indexOf("specialLeak") != -1){
        $('.goods_list').before('<br><p style="width:80px;height:40px;margin:0 auto;color:white;background-color:red; text-align:center;line-height:40px;"id="jianlou" >批量捡漏</p>');
        console.log("脚本开始运行，如未设置商品ID请先点击头部批量捡漏按钮设置ID");
        $.post('/activity/pickActivity',function(ret){
            //商品列表
            var dataList = ret.data.activity;
            for(var i=0;i<dataList.length;i++){
                console.log('商品ID：'+dataList[i]['act_id']+", 商品价格："+dataList[i]['margin']+"；商品名称："+dataList[i]['product_name']);};},'json');
    }else if(href=="https://wx.shike8888.com/"){

        $('<span id="jianlou"><img src="https://static-image-user-cdn.shike8888.com/s/20210318/4e294a0ee0638eca5c8464a62da680a5.png"></span ><br><span style="color:#ff366f">批量捡漏</span>').replaceAll("#nav2 li:eq(2) a");



    }


    var numList='';
    $('#jianlou').on("tap",function(event){
          if(isclick==false){
                 getid();
            }else if(isclick==true){
                for(var s in numList){
                        freeReceive(numList[s]);
                        console.log('第'+s+'次抢购');
                        mui.toast('第'+s+'次抢购',{ duration:'short', type:'div' })
                }
            }
    });

    function getid(){
        var goodsid=prompt("请输入商品ID(例：123,456,789)：");
        if(goodsid.text==""||goodsid==null){
            getid();
            console.log('请输入商品id');
        }else{
            mui.toast('已开启定时捡漏，脚本将于22:30:00执行自动捡漏',{ duration:'short', type:'div' })
            numList = goodsid.split(',');
            console.log('已开启定时捡漏，脚本将于22:30:00执行自动捡漏');
            //console.log(numList);
            // console.log(numList.length);
            setInterval(function() {
                var Time=new Date();
                var Hours=Time.getHours ();
                var Minutes=Time.getMinutes();
                var Seconds=Time.getSeconds();
                console.log('现在时间：'+Hours+":"+Minutes+":"+Seconds);
                if(Hours='22'&& Minutes=='30'&& (Seconds=='00'||Seconds<'10') && numList!=''){
                    //console.log('现在时间：'+Hours+":"+Minutes+":"+Seconds);
                    for(var j in numList) {
                        freeReceive(numList[j]);
                        console.log('第'+j+'次抢购');
                        mui.toast('第'+j+'次抢购',{ duration:'short', type:'div' })
                    };
                }
            }, 50);
        }
    };

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






})();