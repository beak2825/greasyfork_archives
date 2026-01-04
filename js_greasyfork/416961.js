// ==UserScript==
// @name         试客巴一键抽奖
// @namespace    http://ziyuand.cn
// @version      0.7
// @description  一键抽奖
// @author       You
// @match        https://wx.shike8888.com/user/dailyTask
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416961/%E8%AF%95%E5%AE%A2%E5%B7%B4%E4%B8%80%E9%94%AE%E6%8A%BD%E5%A5%96.user.js
// @updateURL https://update.greasyfork.org/scripts/416961/%E8%AF%95%E5%AE%A2%E5%B7%B4%E4%B8%80%E9%94%AE%E6%8A%BD%E5%A5%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function drawLottery(){
        $.ajax('/dailyTask/drawLottery', {
            dataType: 'json',
            type: 'get',
            success:function(ret){
                if(ret.code == 1){
                    var stopwz = ret.data;
                    //console.log(stopwz);
                    switch (stopwz) {
                        case 0:
                            // 待领取
                            $('.poster').append("<p style='text-align:center;'>7天巴粉<br></p>");
                            mui.toast("7天巴粉",{ duration:'short', type:'div' });

                            break;
                        case 1:
                            // 待领取
                            $('.poster').append("<p style='text-align:center;'>10元免手续费<br></p>");
                            mui.toast("10元免手续费",{ duration:'short', type:'div' });

                            break;
                        case 2:
                            // 待发货
                            $('.poster').append("<p style='text-align:center;'>20元必中券<br></p>");
                            mui.toast("20元必中券",{ duration:'short', type:'div' });
                            break;
                        case 3:
                            // 收货评价
                            $('.poster').append("<p style='text-align:center;'>7天会员<br></p>");
                            mui.toast("7天会员",{ duration:'short', type:'div' });
                            break;
                        case 4:
                            // 待审核评价
                            $('.poster').append("<p style='text-align:center;'>1个夺宝币<br></p>");
                            mui.toast("1个夺宝币",{ duration:'short', type:'div' });

                            break;
                        case 5:
                            // 待复制评价
                            $('.poster').append("<p style='text-align:center;'>谢谢参与<br></p>");
                            mui.toast("谢谢参与",{ duration:'short', type:'div' });

                            break;
                        case 6:
                            // 待确评价
                            $('.poster').append("<p style='text-align:center;'>3个夺宝币<br></p>");
                            mui.toast("3个夺宝币",{ duration:'short', type:'div' });

                            break;
                        default:
                            // 已取消
                            $('.poster').append("<p style='text-align:center;'>5个夺宝币<br></p>");
                            mui.toast("5个夺宝币",{ duration:'short', type:'div' });

                            break;};
                    //lottery.speed = 100;
                    // dailyTaskInit();//每日任务初始化
                    //roll(stopwz); //转圈过程不响应click事件，会将click置为false
                    // click = true; //一次抽奖完成后，设置click为true，可继续抽奖
                    return false;
                }else{
                    alertBox.modalBox(['确定'],null,'<p style="text-align:center;">'+ret.msg+'</p>');
                    return false;
                }
            }
        });

    };
    $('.poster').append('<p style="width:200px;height:40px;margin:0 auto;color:white;background-color:red; z-index:999;text-align:center;line-height:40px;"id="yijianchoujian" >一键抽奖</p><br>');

    $('#yijianchoujian').on("tap",function(event){
        $.toAjax({
            url:"https://wx.shike8888.com/dailyTask/getDailyTask",
            type:"post",
            success:function (data) {
                var lottery_count=data.data['lottery_count'];

                if(lottery_count>0){
                    for(var i=0;i<lottery_count;i++){
                        drawLottery();
                    }
                }
                var sign=data.data['sign'];
                if(sign!='2'){
                    signIn();
                }

            }
        });

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

    // Your code here...
})();