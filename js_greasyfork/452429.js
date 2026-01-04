// ==UserScript==
// @name         广东省教师继续教育-视频自动播放
// @namespace    com.foreach.tempermonkey
// @version      1.0
// @description  视频自动播放
// @author       foreach
// @match        https://jsxx.gdedu.gov.cn/study/course/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452429/%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2-%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/452429/%E5%B9%BF%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2-%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("页面加载时间:"+new Date().toLocaleString())
    mylayerFn.orginBtns = mylayerFn.btns;
    mylayerFn.btns = function(param){
        if(param.content == '您已完成这个活动'){
            console.log("您已完成这个活动，5s后自动跳转下一个视频");
            setTimeout(function(){ goNext(); }, 5000);
            return;
        }

        if(param.content.indexOf("停留很长时间") > 0){
            console.log("屏蔽停留时间过长提示，将登录续期并继续播放");
            $.ajax({
                url: '/ncts/resetSession',
                success: function(data){
                    if(data.responseCode == '00'){
                        console.log("登录续期成功，继续播放视频");
                        setA();
                        player.videoPlay();
                    }else{
                        console.log("登录续期失败，刷新页面");
                        location.reload();
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown){
                    console.log("登录续期异常，刷新页面");
                    location.reload();
                }
            });

            return;
        }

        mylayerFn.orginBtns(param);

    }
    console.log("已封装提示弹窗");

    mylayerFn.originOpen = mylayerFn.open;
    mylayerFn.open = function(param){
        mylayerFn.originOpen(param);
        if(param.title == '请作答'){
            console.log("5s后自动关闭答题窗");
            setTimeout(function(){
                $('#questionDiv').stopTime('C'); //终止登录超时弹窗
                $('.mylayer-closeico').trigger('click');
                player.videoPlay();
            }, 5000);
        }
    }
    console.log("已封装答题弹窗");

    console.log("禁止观看时长超时弹窗");
    $('#playerDiv').stopTime('B');
    $('#playerDiv').everyTime('900s', 'resetSession',function(){
        $.ajax({
            url: '/ncts/resetSession',
            success: function(data){
                if(data.responseCode == '00'){
                    console.log("登录续期成功");
                }else{
                    console.log("登录续期失败，刷新页面");
                    location.reload();
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
                console.log("登录续期异常，刷新页面");
                location.reload();
            }
        });
    })

    console.log("5s后开始播放");
    setTimeout(function(){ player.videoPlay(); }, 5000);
    //为确保正常开始，多触发一次
    setTimeout(function(){ player.videoPlay(); }, 6000);
    console.log("每60s触发一次播放，避免计时暂停");
    function videoPlayConfirm(){
        setTimeout(function()
                   {
            player.videoPlay();
            videoPlayConfirm();
        }, 60000);
    };
    videoPlayConfirm()

    var statusMsg=$(".g-study-prompt").text();
    if(statusMsg.indexOf("您已完成观看")>0){
        console.log("您已完成观看，5s后自动跳转下一个视频");
        setTimeout(function(){ goNext(); }, 5000);
    } else {
        timeCheckInterval=interval+30
        console.log("系统每"+interval+"秒上报一次时间，插件将每"+timeCheckInterval+"秒检查一次上报情况，若发现时间上报失败，刷新页面");
        var lastViewTime=statusMsg.match('您已观看(.*)分钟')[1];
        console.log("当前已观看时间为"+lastViewTime+"分钟");
        function autoReload(){
            setTimeout(function()
                       {
                statusMsg=$(".g-study-prompt").text();
                if(statusMsg.indexOf("您已完成观看")>0){
                    console.log("您已完成观看，5s后自动跳转下一个视频");
                    setTimeout(function(){ goNext(); }, 5000);
                    return;
                }
                var viewTime=statusMsg.match('您已观看(.*)分钟')[1];
                var need2Reload=lastViewTime==viewTime;
                console.log(
                    "当前已观看时间为"+viewTime+"分钟，上次已经观看时间为"+lastViewTime+"分钟"+
                    (need2Reload?"时间上报异常，即将刷新页面":"时间上报正常，无需刷新页面")
                );
                if(need2Reload){
                    location.reload();
                    return;
                }
                lastViewTime=viewTime;
                autoReload();
            }, timeCheckInterval*1000);
        };
        autoReload()
}
})();