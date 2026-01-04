// ==UserScript==
// @name         新-试客巴折扣试用去灰色/批量抢购/增加试用金
// @namespace    http://tampermonkey.net/
// @version      0.9.1
// @description 折扣试用页面去灰色
// @author       Sherwin
// @match        https://wx.shike8888.com/special/discount
// @run-at 		 document-end
// @grant    	 unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/426807/%E6%96%B0-%E8%AF%95%E5%AE%A2%E5%B7%B4%E6%8A%98%E6%89%A3%E8%AF%95%E7%94%A8%E5%8E%BB%E7%81%B0%E8%89%B2%E6%89%B9%E9%87%8F%E6%8A%A2%E8%B4%AD%E5%A2%9E%E5%8A%A0%E8%AF%95%E7%94%A8%E9%87%91.user.js
// @updateURL https://update.greasyfork.org/scripts/426807/%E6%96%B0-%E8%AF%95%E5%AE%A2%E5%B7%B4%E6%8A%98%E6%89%A3%E8%AF%95%E7%94%A8%E5%8E%BB%E7%81%B0%E8%89%B2%E6%89%B9%E9%87%8F%E6%8A%A2%E8%B4%AD%E5%A2%9E%E5%8A%A0%E8%AF%95%E7%94%A8%E9%87%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // $('title').after('<script src=" https://static-h5r-alicnd.shike8888.com/js/clipboard.min.js"></script>')
    $('.banner').append('<p style="width:80px;height:30px;margin:0 auto;color:red;background:yellow; z-index:999;text-align:center;line-height:30px;"id="qianggou" >批量抢购</p>');
    //获取当前点击商品aid
    $('.banner').before( '<ul class="mui-table-view"><li class="mui-table-view-cell mui-collapse"><a class="mui-navigate-right" href="#">输出面板</a><div class="mui-collapse-content" id="shuchu"></div></li></ul>');

    for(var s=1;s<=7;s++){
        getAll(s);
    }
    //getAll();
    var list;
    var lists=[];
    function getAll(s){
        // console.log(s);
        $.toAjax({
            url:'https://wx.shike8888.com/tryUserManage/myTry/orderList',
            data:{pageNo: 1,pageSize: 200,yf_type: 0,listType: s,'_=':timestamp},
            success:function (res) {
                list=res.data.list;
                lists[s]=list;
            },
            error:function (err) {}
        });
    }
    $("div").scroll(function() {
        $('button').removeAttr('disabled','')
        $('button').attr("class","to-shop");

    });
    $('#list').on("tap",function(event){
        $('li').on("tap","img",function(e){
            var index=$("li img").index(this);
            console.log("当前下标为："+index);   //注意：这里的下标从零开始
            window.location.href='https://wx.shike8888.com/user/discountDetail?aid='+aid_list[index];

        });
    });

    var flag,act_id,product_name,margin,now_having_num,safe_day;
    copyele();
    var aid_list=[]
    $.post('https://wx.shike8888.com/discount/list?searchType=1&page=0&size=100',function(ret){
        for(var s in ret.data){
            // console.log('商品ID：'+ret.data[s]['act_id']+', 名称：'+ret.data[s]['product_name']+' 金额：'+ret.data[s]['margin']+' 剩余份数：'+ret.data[s]['now_having_num'])
            //$('#shuchu').append('<img src="'+ret.data[s]['picture_url']+'" style="width:20%;">');
            //$('#shuchu').append('<p id="'+ret.data[s]['act_id']+'">【'+ret.data[s]['product_name']+'】 金额：'+ret.data[s]['margin']+'【剩余：'+ret.data[s]["now_having_num"]+'】</p>');
            // $('#shuchu').append('<p id="'+ret.data[s]['act_id']+'">-----------------------------------------------------------</p>');
            act_id=ret.data[s]['act_id'];
            aid_list.push(act_id)
            product_name=ret.data[s]['product_name'];
            margin=ret.data[s]['margin'];
            now_having_num=ret.data[s]['now_having_num'];
            getdetail(act_id,product_name,margin,now_having_num);

        }

        console.log(aid_list)

        var script=$('<script>var aid_lists=['+aid_list+'];$("li").on("tap","img",function(e){var index=$("li img").index(this);console.log("当前下标为："+index);window.location.href="https://wx.shike8888.com/user/discountDetail?aid="aid_lists[index];});<\/script>');
        $('body').append(script);
    },'json');

    $( function(){} )
    var shop,now_having;
    var timestamp = (new Date()).getTime();
    function getdetail(act_id,product_name,margin,now_having_num){
        $.post('https://wx.shike8888.com/discount/detail?actId='+act_id,function(res){
            var dataList = res.activityDto;
            safe_day=dataList['safe_day'];
            shop=dataList['shopname'];
            var string = replaceShopNameStr(shop);
            if(now_having_num==0){
                now_having=
                    console.log("【"+shop+'】 商品ID：'+act_id+', 名称：'+product_name+' 金额：'+margin+" 防护期："+safe_day+"天"+' 剩余份数：'+'%c%s','color: red; background: yellow; font-size: 14px;','已抢完！');
            }else
            {

                console.log("【"+shop+'】 商品ID：'+act_id+', 名称：'+product_name+' 金额：'+margin+" 防护期："+safe_day+"天"+' 剩余份数：'+now_having_num);
            }



            //$('#shuchu').append('<img src="'+ret.data[s]['picture_url']+'" style="width:20%;">');
            //$('#shuchu').append('<p id="'+ret.data[s]['act_id']+'">【'+ret.data[s]['product_name']+'】 金额：'+ret.data[s]['margin']+'【剩余：'+ret.data[s]["now_having_num"]+'】</p>');
            // $('#shuchu').append('<p id="'+ret.data[s]['act_id']+'">-----------------------------------------------------------</p>');

            for(var a=1;a<=7;a++){
                var getlist=lists[a];
                for(var l in getlist){
                    var shopname=getlist[l]['shopname'];
                    var starttime=getlist[l]['show_time'];
                    var productname=getlist[l]['product_name'];
                    // console.log(shopname);
                    if(shopname!=string){

                    }else{
                        var nowtimestamp = (new Date()).getTime();
                        var issafe=nowtimestamp-starttime;
                        //console.log(issafe)
                        var  safe=safe_day-parseInt(issafe/(24*60*60*1000));
                        var nowt=timestampToTime(starttime);
                        if(safe>0){

                            console.log('%c%s','color: red; background: yellow; font-size: 14px;','【'+shop+'】 防护期剩余：【'+safe+"】天");

                        }else if(safe<=0){

                        }
                    }

                }}
        },'json');



    }
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
    // Your code here...
    var goodsid,idList;
    var istap='false';
    $('#qianggou').on("tap",function(event){
        if(istap=='false'){
            istap='true';
            goodsid=prompt("请输入商品ID(例：123,456,789)逗号为英文：");
            idList = goodsid.split(',');
            for(var i in idList){
                submitid(idList[i]);
            }
        }else{
            idList = goodsid.split(',');
            for(var s in idList){
                submitid(idList[s]);
            }
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
    var dikou=0;
    $.ajax({
        url: '/DiscountTryGift/discountMoneyInfo',
        type: 'get',
        dataType: 'json',
        success: function (data) {
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

                        // console.log(dikou);
                        // $('#qianggou').before('<p style="text-align:center; color:white;background:red; line-height:20px;margin:0;">可用折扣试用金:<b>'+data.money+'</b>&nbsp;&nbsp;&nbsp;领取次数:<b>'+data.count+'</b>&nbsp;&nbsp;&nbsp;已抵扣:<b>'+dikou+'</b></p>');
                        $('#qianggou').before('<p id="zekou" style="text-align:center; color:white;background:red; line-height:20px;margin:0;">可用折扣试用金:<b>'+data.money+'</b>&nbsp;&nbsp;领取次数:<b>'+data.count+'</b>&nbsp;&nbsp;已抵扣:<b>'+changeTwoDecimal(dikou)+'</b></p>');
                    }
                }

            });
        }
    });




    $('.banner img').on("tap",function(event){

        add =prompt("请输入次数");
        if(add==''||add==null){
            mui.toast('未输入数值!',{ duration:'short', type:'div' })
        }else{
            for (var i = 0; i < add*5; i++) {
                (function (t, data) {   // 注意这里是形参
                    setTimeout(function () {
                        var rad=random(5, 9);
                        linqu(randomString(rad));
                    },100 * t);   // 还是每300ms执行一次，不是累加的
                })(i)   // 注意这里是实参，这里把要用的参数传进去
            }
        }



    })
    function linqu(aid){
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
    //复制程序
    function copyele(){
        $('#shuchu').on("tap","p",function(event){
            console.log( $(this).attr('id'));
            var str1= $(this).attr("id")+',';
            flag = copyText(str1); //传递文本
            mui.toast(flag ? "复制成功！" : "复制失败！");
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



})();