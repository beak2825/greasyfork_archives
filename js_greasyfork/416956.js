// ==UserScript==
// @name         试客巴增加免费提现额度及资金修改
// @namespace    http://ziyuand.cn
// @version      0.9
// @description  增加免费提现额度!
// @author       SHERWIN
// @match       *.shike8888.com/user/personalCenter
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416956/%E8%AF%95%E5%AE%A2%E5%B7%B4%E5%A2%9E%E5%8A%A0%E5%85%8D%E8%B4%B9%E6%8F%90%E7%8E%B0%E9%A2%9D%E5%BA%A6%E5%8F%8A%E8%B5%84%E9%87%91%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/416956/%E8%AF%95%E5%AE%A2%E5%B7%B4%E5%A2%9E%E5%8A%A0%E5%85%8D%E8%B4%B9%E6%8F%90%E7%8E%B0%E9%A2%9D%E5%BA%A6%E5%8F%8A%E8%B5%84%E9%87%91%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // $('.funds-box').append('&nbsp;<p style="width:80px;height:40px;margin:0 auto;color:white;background-color:red; z-index:999;text-align:center;line-height:40px;"id="erdu" >增加额度</p>');
    //$('.user-content').append('<a href="#popover" id="openPopover" class="mui-btn mui-btn-primary mui-btn-block">打开弹出菜单</a><div id="popover" class="mui-popover"><ul class="mui-table-view"><li class="mui-table-view-cell"><a href="#">Item1</a></li><li class="mui-table-view-cell"><a href="#">Item2</a></li><li class="mui-table-view-cell"><a href="#">Item3</a></li><li class="mui-table-view-cell"><a href="#">Item4</a></li><li class="mui-table-view-cell"><a href="#">Item5</a></li></ul></div>');

    $('.user-content').append('<div class="bg-fff" style="padding: 0;"><div class="head-title flex-between" style="margin: 0 0.24rem;width: auto"><span>数据修改</span><span class="no-icon"></span></div><ul id="shujuxiugai" class="my-service-box"><li id="addedu"><i class="iconfont icon-maijiaxiubaoming"></i><p>额度增加</p></li><li id="money_use"><i class="iconfont icon-shangjinbenjinhuhuan"></i><p>余额修改</p></li><li id="reward"><i class="iconfont icon-zhekoushiyonglibao"></i><p>赏金修改</p></li><li id="indiana"><i class="iconfont icon-wodeyinhangka"></i><p>夺宝币修改</p></li><li id="free_quota_money"><i class="iconfont icon-huoquduobaobi"></i><p>额度修改</p></li><li id="user_name"><i class="iconfont icon-benjintixian"></i><p>用户名修改</p></li><li id="taobao_id"><i class="iconfont icon-huiyuanguanli1"></i><p>淘宝修改</p></li><li id="taobao_status"><i class="iconfont icon-zijinjilu"></i><p>淘宝状态</p></li><li id="phone"><i class="iconfont icon-huoquduobaobi"></i><p>手机修改</p></li><li id="taoqi_value"><i class="iconfont icon-benjintixian"></i><p>淘气值修改</p></li><li id="percent"><i class="iconfont icon-huiyuanguanli1"></i><p>资料完整度</p></li><li id="diyedit"><i class="iconfont icon-zijinjilu"></i><p>自定义修改</p></li></ul></div>');
    var jine;
    var qian='';
    var leixin='';
    var editdata,ids,diyedit,cishu;
     $.toAjax({
            url:"https://wx.shike8888.com/dailyTask/getDailyTask",
            type:"post",
            success:function (data) {
                var sign=data.data['sign'];
                if(sign!='2'){
                    signIn();
                }
            }
        });
        /*正常签到*/
    function signIn(){
    	$.ajax('/dailyTask/goSign', {
    		data: {sign_day:null},
    		dataType: 'json',
            type: 'post',
            success:function(ret){
            	if(ret.code == 1){//签到成功
            	 mui.toast('签到成功!',{ duration:'short', type:'div' })
            	}else if(ret.code == -3){
                     mui.toast('已签到!',{ duration:'short', type:'div' })
            	}
            }
         });
    }
    $('#shujuxiugai li').on("tap",function(event){
        ids= $(this).attr('id');
        console.log(ids);
        if(ids=='addedu'){
            jine=prompt("请输入增加额度");
            if(jine==''|| jine==null){
                mui.toast("未输入内容",{ duration:'short', type:'div' });
            }else{
                 zengjia(jine);
            }
        }else if(ids=='diyedit'){
            diyedit=prompt("请输入要修改参数");

            if(diyedit==''||diyedit==null){
               mui.toast("未输入内容",{ duration:'short', type:'div' });
                //var resedit=
                //var resdata= {id:cardids,reward:jine};
            }else{
                edit(diyedit,editdata);
            }
        }else{
            editdata=prompt("请输入修改后的值");
            if(editdata==''||editdata==null){
                  mui.toast("未输入内容",{ duration:'short', type:'div' });
                //var resdata= {id:cardids,reward:jine};
            }else{
               // editdata=prompt("请输入修改后的值");
                edit(ids,editdata);
            }


        }
    });

    //console.log(getRandomNumber(7));
    var cardids;

    function zengjia(jine){

        cardids=getRandomNumber(7);
        mui.ajax('/dailyTask/receiveFreeTicket',{
            data: {id:cardids,reward:jine},
            dataType: "json",
            type: "post",
            success:function(ret){
                mui.toast("成功增加"+jine+"元额度", function() {
                    location.reload();
                });
            }
        });


    };

    var resdatas;
    function edit(ids,editdata){

        mui.ajax('/newUserInfo/modifyUser', {
            dataType: 'json', //服务器返回json格式数据
            data:ids+"="+editdata,
            type: 'post', //HTTP请求类型
            success: function(ret) {
                var datas = ret.data;
                if(ret.code == 1){
                    mui.alert('修改成功！',function(){
                        location.reload();
                    });
                }else{
                    mui.alert(datas.msg,function(){
                        location.reload();
                    });
                }
            }
        });

        // location.reload();



    }

    var money=0;
    var tixian=0;
    var dakuan=0;
    $.post('https://wx.shike8888.com/userInfo/cashRecord?type=0',function(ret){
        // console.log(ret.data);
        //  console.log(ret.data.length);
        var len=ret.data.length;
        for (var i in ret.data){
            if(ret.data[i]['status']==3){
                money=ret.data[i]['money']+money;
                // console.log(ret.data[i]['money']);

            }else if(ret.data[i]['status']==1){
                tixian=ret.data[i]['money']+tixian;
            }else if(ret.data[i]['status']==2){
                dakuan=ret.data[i]['money']+dakuan;
            }

        }
        $('.return-money-box').after('<p style="color: #ff366f;">已提现总额：'+money+' 打款中：'+dakuan+' 提现中：'+tixian+"</p>");
    },'json');
    //判断是否异常
    $.post('https://wx.shike8888.com/userInfo/findUserInfo',function(ret){
        // console.log(ret.data);
        //  console.log(ret.data.length);
        var note=ret.data.user.note;
        if(note==''){
            $('.order-box').append('<p style="text-align:center; color:black;">  【状态正常】</p>');

        }else{

            $('.order-box').append('<p style="text-align:center; color:red;">  【状态异常：'+note+'】</p>');
        }

    },'json');

    function getRandomNumber(n) {
        var arr = new Array(n); //用于存放随机数
        var randomNumber = ''; //存放随机数
        for (var i = 0; i < arr.length; i++)
            arr[i] = parseInt(Math.random() * 10);
        var flag = 0;
        for (i = 0; i < arr.length - 1; i++) {
            for (var j = i + 1; j < arr.length; j++) {
                if (arr[i] == arr[j]) {
                    flag = 1;
                    break;
                }
            }
            if (flag) break;
        }
        for (i = 0; i < arr.length; i++) {
            randomNumber += arr[i];
        }
        return randomNumber;
    };






    // Your code here...
})();