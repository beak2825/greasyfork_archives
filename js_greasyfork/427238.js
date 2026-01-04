// ==UserScript==
// @name         批量整点抢购/获取防护期/去灰色
// @namespace    http://ziyuand.cn
// @version      3.5
// @description  s批量整点抢购/获取防护期/去灰色
// @author       SHERWIN
// @match        https://wx.shike8888.com/double11/double11Hall
// @match        https://wx.shike8888.com/
// @match        https://wx.shike8888.com/#
// @icon         https://wx.shike8888.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/427238/%E6%89%B9%E9%87%8F%E6%95%B4%E7%82%B9%E6%8A%A2%E8%B4%AD%E8%8E%B7%E5%8F%96%E9%98%B2%E6%8A%A4%E6%9C%9F%E5%8E%BB%E7%81%B0%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/427238/%E6%89%B9%E9%87%8F%E6%95%B4%E7%82%B9%E6%8A%A2%E8%B4%AD%E8%8E%B7%E5%8F%96%E9%98%B2%E6%8A%A4%E6%9C%9F%E5%8E%BB%E7%81%B0%E8%89%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //$('title').after('<script src=" https://static-h5r-alicnd.shike8888.com/js/clipboard.min.js"></script>');
    var href =window.location.href;
    var flag;
    if (href.indexOf("double11") != -1){
        $('li').click(function(e){
            $('.goods_info input').removeAttr("disabled");
            $('.goods_info input').attr("class","free_grab");
        });
            $( '<ul class="mui-table-view"><li class="mui-table-view-cell mui-collapse"><a class="mui-navigate-right" href="#">整点抢购商品输出面板</a><div class="mui-collapse-content" id="shuchu"></div></li></ul>').replaceAll(".line-2");
        copyele();
    }else if(href=="https://wx.shike8888.com/"||href=="https://wx.shike8888.com/#"){
        var isclick=false;
        var shopnames,safeday;
        var products = [];
        var goodsid,idList;
        console.log("脚本加载成功");
        //$('.nav').append('&nbsp;<p style="width:80px;height:40px;margin:0 auto;color:white;background-color:red; z-index:999;text-align:center;line-height:40px;"id="qiang" >批量抢购</p><br>');
        $('<span id="qianggou"><img src="https://static-image-user-cdn.shike8888.com/s/20210122/56728d5832d25aa2cf6fbfff483de3c7.png"></span><br><span style="color:#ff366f">批量抢购</span>').replaceAll(".change-log a");
        $( '<ul class="mui-table-view"><li class="mui-table-view-cell mui-collapse"><a class="mui-navigate-right" href="#">整点抢购商品输出面板</a><div class="mui-collapse-content" id="shuchu"></div></li></ul>').replaceAll("#custom_module");
        //$('#nav2').after('<ul class="mui-table-view"><li class="mui-table-view-cell mui-collapse"><a class="mui-navigate-right" style="text-align:center;">面板1</a><div class="mui-collapse-content" id="shuchu"></div></li></ul>');
        //点击价格复制aid
       copyele();

        $('#qianggou').on("tap",function(event){
            if(isclick==false){
                dingshi();
            }else if(isclick==true){
                //for (var t in products){
                //applystart(products[t]['token'],products[t]['product_id']);
                //console.log(applystart(products[t]['token'],products[t]['product_id']));
                //}
                for(var i in idList){
                    miaosha(idList[i]);
                }
            }
        });
        function dingshi(){
            isclick=true;
            goodsid=prompt("请输入商品ID(例：123,456,789)逗号为英文：");
            $('#nav2').append("<p style='text-align:center;color:red;'>【开始定时抢购】</p>");
            if(goodsid==''|| goodsid==null){
                dingshi();
                mui.toast('请输入商品ID',{ duration:'short', type:'div' })

            }else{
                mui.toast("开始定时");
                idList = goodsid.split(',');
                setInterval(function() {
                    var Time=new Date();
                    var Hours=Time.getHours ();
                    var Minutes=Time.getMinutes();
                    var Seconds=Time.getSeconds();
                    if(Hours<='23'&& Minutes=='00'&& (Seconds=='00'||Seconds<'05')){
                        console.log('现在时间：'+Hours+":"+Minutes+":"+Seconds);
                        for(var i in idList){
                            miaosha(idList[i]);
                        }
                    }else if(Hours<='23'&& Minutes=='59'&&Seconds=='50'){
                        console.log('现在时间：'+Hours+":"+Minutes+":"+Seconds);
                        console.log('10秒后开始抢购');
                        mui.toast('10秒后开始抢购',{ duration:'short', type:'div' });
                    }else{
                        console.log('现在时间：'+Hours+":"+Minutes+":"+Seconds);
                    }
                }, 50);
            }

        }

        var j=0;
        function miaosha(aid){
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
                                $('#nav2').append("<p style='text-align:center;color:red;'>【恭喜您！商品："+ ret.products_name+"抢购成功！】</p>");
                                //mui.alert('恭喜您！抢购成功！请赶紧去领取下单吧', function() {
                                // location.href = '/tryUse/tryTask'
                                //});
                            }
                        } else if(ret.code != -1){
                            mui.alert(ret.msg, function() {
                                location.reload();
                            })
                        }
                    },
                    error:function(){
                        var clickNum = 0;
                        mui.alert("抢购失败，请重试！");
                    }
                })
            };

        };


    }
    console.log('【已自动获取防护期，未显示防护期则为不在防护期内！】');
   $('#shuchu').append('<p  style="color:white;background:red;">【未显示防护期则不在防护期内！点击名称复制商品ID】</p>');
    var lists=[];
    var list,isdefine;
    var timestamp = (new Date()).getTime();
    var myDate = new Date();
    var nowyear=myDate.getFullYear();    //获取完整的年份(4位,1970-????)
    var month=myDate.getMonth();       //获取当前月份(0-11,0代表1月)
    var nowmonth=month+1;
    var nowdate=myDate.getDate();
    var nowtimes=nowyear+'-'+nowmonth+'-'+nowdate;

    getAll();
    function getAll(){
     for(var s=1;s<=7;s++){
       $.toAjax({
            url:'https://wx.shike8888.com/tryUserManage/myTry/orderList',
            data:{pageNo: 1,pageSize: 200,yf_type: 0,listType: s,'_=':timestamp},
            success:function (res) {
                //list=res.data.list;
                //lists[s]=list;
                lists.push(res.data.list);
                console.log(lists)
                if (lists.length == 7){
                  goodslist();
                }
            },
            error:function (err) {}
        });
    }
    }

    function goodslist(){
        var nowTime=new Date();
        var nowHours=nowTime.getHours();
        var nextHours=nowHours+1;
        $('mui-scroll li:eq('+nextHours+')').attr("class","timePeriod-item mui-control-item mui-active");
        $.post('https://wx.shike8888.com/activity/getLightingTasks',function(ret){
            console.log(nowHours);
            for (var k in ret.data.list ){
                var num=ret.data.list[k]['exchange_num'];
                var numList = ret.data.list[k]['exchange_num'].split(',');
                if (numList[nextHours]>0){
                    //getshopname(ret.data.list[k]['act_id']);
                        getshopname(ret.data.list[k]['act_id'],ret.data.list[k]['product_name'],ret.data.list[k]['margin'],k);
                    //console.log(k);
                }
            }
        },'json');
    }
    var shop;
    function getshopname(aid,product_name,margin,k){
        $.post('https://wx.shike8888.com/activity/getBaseDetail?act_id='+aid,function(ret){
            //商品列表
            var dataList = ret.activityDto;
            shop=dataList['shopname'];

            var safe_day=dataList['safe_day'];
            //console.log(shop);
            var string = replaceShopNameStr(shop);
           // console.log(string);
            console.log('【'+shop+'】 商品ID：'+aid+', 名称：'+product_name+' 金额：'+margin);
            $('#shuchu').append('<p id="'+aid+'" >【'+shop+'】名称：'+product_name+' 金额：'+margin+'</p>');
            //$('<b>'+shop+'</b>').replaceAll("#product_list li b:eq("+k+")");
            for (var a=0;a<=lists.length; a++){

                // var getlist=GM_getValue("list"+a);
                var getlist=lists[a];
                //console.log(lists);
               // console.log(lists[6]);
                //$('#shuchu').append('<p>【'+getlist+'】</p>');
                for(var l in lists[a]){
                    var shopname=lists[a][l]['shopname'];
                    var starttime=lists[a][l]['show_time'];
                    var productname=lists[a][l]['product_name'];
                   // console.log(getlist[l]);
                   // console.log(shopname);
                   // console.log(starttime);
                   // console.log(productname);
                     //console.log(string);
                    if(shopname!=string){
                        // console.log('【'+shopname+'】 商品ID：'+aid+', 名称：'+product_name+' 金额：'+margin);
                    }else{
                        var nowtimestamp = (new Date()).getTime();
                        var issafe=nowtimestamp-starttime;
                        //console.log(issafe)
                        var safe=safe_day-parseInt(issafe/(24*60*60*1000));
                        var nowt=timestampToTime(starttime);
                        if(safe>0){
                            //$('#checkid').before('<p style="text-align:center;" ><b>'+"防护期还剩："+safe+"天"+'</b></p>');
                            //console.log("防护期还剩："+safe+"天");
                            //console.log('【'+shop+'】 ID：'+aid+', 名称：'+product_name+' 金额：'+margin+' 防护期剩余：【'+safe+"】天");
                            console.log("%c%s","color: red; background: yellow; font-size: 14px;",'【'+shop+'】 防护期剩余：【'+safe+"】天");
                            $('#shuchu').append('<p  style="color:white;background:red;">【'+shop+'】 防护期剩余：【'+safe+"】天</p>");
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
    //复制程序
    function copyele(){
     $('#shuchu').on("tap","p",function(event){
            console.log( $(this).attr('id'));
            var str1= $(this).attr("id")+',';
            flag = copyText(str1); //传递文本
            mui.toast(flag ? "复制成功！" : "复制失败！",{ duration:'short', type:'div' });
        });


    }
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
            flag = document.execCommand("copy");//执行复制
        }catch(eo) {
            flag = false;
        }
        document.body.removeChild(textarea);//删除元素
        currentFocus.focus();
        return flag;
    }

    // Your code here...
})();