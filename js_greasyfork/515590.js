// ==UserScript==
// @name         东奥教育集团|专业技术人员继续教育培训|过弹窗限制
// @namespace    过弹窗限制，自动化挂机
// @license      CC BY-NC-SA
// @version      2023.8.5
// @description  【bug+aluyunjiesmile】只能过数字验证码
// @author       aluyunjie
// @match        https://jxjycwweb.dongao.cn/cwweb/videoShow/video/videoPlay*
// @icon         https://study.dongao.cn/study/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/515590/%E4%B8%9C%E5%A5%A5%E6%95%99%E8%82%B2%E9%9B%86%E5%9B%A2%7C%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%9F%B9%E8%AE%AD%7C%E8%BF%87%E5%BC%B9%E7%AA%97%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/515590/%E4%B8%9C%E5%A5%A5%E6%95%99%E8%82%B2%E9%9B%86%E5%9B%A2%7C%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%9F%B9%E8%AE%AD%7C%E8%BF%87%E5%BC%B9%E7%AA%97%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==
var play_interval;
var pos = 0;
var pos_interval;
var lastTimePoint;
var status
function loadPage() {
    var result = doLMSInitialize();
    status = doLMSGetValue("cmi.core.lesson_status");
    //var status="incomplete";
    if (status == "not attempted") {
        // 如果为未尝试，设置课程为非完成
        doLMSSetValue("cmi.core.lesson_status", "incomplete");
        //不包含分数故设置为""
        doLMSSetValue("cmi.core.score.raw", "");
        //模式设置：正常
        doLMSSetValue("cmi.core.lesson_mode", "normal");
        play_interval = setInterval(function () {
            if (player.getState() == 4) {
                player.play(true);
                clearInterval(play_interval);
            }
        },200)
    }
    else if (status == "completed") {
        doLMSSetValue("cmi.core.lesson_mode", "review");
        play_interval = setInterval(function () {
            if (player.getState() == 4) {
                player.play(true);
                clearInterval(play_interval);
            }
        },200)
        $(".sp-zz").hide();
        $("#menu li").bind();
        $(".page-con input").bind();
    }else if(status =="incomplete"){
        play_interval = setInterval(function () {
            if (player.getState() == 4) {
                $("body").append("<div id='continue'><div class='con_msg'><div class='msg'>是否继续学习？</div></div><div id='confirm'>是</div><div id='cancel'>否</div></div>");
                $.blockUI({
                    message: $("#continue"),
                    css: {border: '#666666', width: '0px', height: '0px', top: '50%', left: '50%', cursor: '', textAlign: 'left' },
                    overlayCSS: {cursor: ''}
                });
                $("#confirm").click(function () {
 
                    $.unblockUI();
                    player.setPosition(pos);
                    //lastTimePoint = pos;
                    player.play(true);
 
                    //pos_interval = setInterval(function () {
                    //                        player.play(false);
                    //						console.log(player.getPosition());
                    //                        player.setPosition(pos);
                    //                        if (Math.abs(player.getPosition() - pos) < 5) {
                    //                            player.play(true);
                    //                            clearInterval(pos_interval);
                    //                        }
                    //                    }, 200);
 
                    $("#continue").remove();
                });
                $("#cancel").click(function () {
                    $.unblockUI();
                    player.play(true);
                    $("#continue,.mark").remove();
                });
                clearInterval(play_interval);
 
            }
        }, 200);
        pos = doLMSGetValue("cmi.core.lesson_location");
        lastTimePoint = pos;
    }else if(status==""||status=="undefined"||status==null){
        play_interval = setInterval(function () {
            if (player.getState() == 4) {
                player.play(true);
                clearInterval(play_interval);
            }
        },200)
    }
 
 
    doLMSSetValue("cmi.core.exit", "");
}
/*
 *结束
 */
function doQuit() {
    doLMSSetValue("cmi.core.lesson_location", player.getPosition());//播放器当前显示时间
    // doLMSSetValue("cmi.core.session_time", $.convertDigital(player.getRealTime()));//在播放器上停留时间
    doLMSSetValue("cmi.core.session_time",  player.getPosition()+50000);//在播放器上停留时间
 
    doLMSSetValue("cmi.core.entry", "resume");
    doLMSSetValue("cmi.core.exit", "logout");
 
 
    // doLMSSetValue("cmi.core.lesson_status", "completed");
    //var total_time = doLMSGetValue("cmi.core.total_time");
    //if (player.getDuration()<=$.convertTime(total_time)) {
    // doLMSSetValue("cmi.core.lesson_status", "completed");
    //}
 
 
    doLMSCommit();
    doLMSFinish();
}
 
setInterval(function () {
    //alert("123");
 
    var currentTime = player.getPosition();
    //alert(currentTime - lastTimePoint);
    //alert(currentTime);
    if(status =="incomplete")
    {
        if(currentTime - lastTimePoint > 35000000) {
            player.setPosition(lastTimePoint )
        } else {
            lastTimePoint = currentTime;
        }
    }
    // doLMSSetValue("cmi.core.session_time", $.convertDigital(player.getRealTime()));
    doLMSSetValue("cmi.core.session_time",  player.getPosition()+50000);
    doLMSSetValue("cmi.core.lesson_location", currentTime);
    //player.player_time = 0;
    doLMSCommit();
    player.PlaybackRate=10.0;
 
}, 10000);
 
$(window).load(function () {
    loadPage();
});
$(window).unload(function () {
    doQuit();
});
 
 
(function() {
    'use strict';
 
    setInterval(function(){
        //关闭弹窗
        listenView.handler.closeBox($('.pop_box_content'));
    },5000)
    // Your code here...
})();
 