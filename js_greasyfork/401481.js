// ==UserScript==
// @name         学银在线助手/自动刷课
// @namespace    http://apcbat.top/
// @version      1.4
// @description  学银在线刷课，自动点击下一页
// @author       Apcbat
// @match        http://*.xueyinonline.com/mycourse/studentstudy?*
// @grant        none
// @supportURL   apcbat@qq.com
// @contributionURL http://donate.apcbat.top/
// @license      Apache Licence 2.0
// @icon         http://donate.apcbat.top/xyzx/logo.ico
// @downloadURL https://update.greasyfork.org/scripts/401481/%E5%AD%A6%E9%93%B6%E5%9C%A8%E7%BA%BF%E5%8A%A9%E6%89%8B%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/401481/%E5%AD%A6%E9%93%B6%E5%9C%A8%E7%BA%BF%E5%8A%A9%E6%89%8B%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==
var t;
var started=false;
var button,btnDonate,divD,divTip,divPlay;

(function() {
    'use strict';

    var div= $("<div style='background-color:#FFF;position: fixed;left: 0;top: 50%;z-index: 99999;padding: 16px;transform: translateY(-50%);text-align: center;border-radius: 0 8px 8px 0;box-shadow: 0 0 4px #000000b3;box-sizing: border-box;'><strong>学银在线助手</strong><br><br></div>");
    button=$("<button style='border: none; background-color:#2196F3; color: #fff; padding: 8px; border-radius: 8px;width: 100px;'>点击开启</button>");
    button.click(function(){toggle();});
    btnDonate=$("<br><br><button style='border: none; background-color:#FF5722; color: #fff; padding: 8px; border-radius: 8px;width: 100px;'>捐　　赠</button>");

    divD=$("<div style='background-color:#FFF;display: none;position: fixed;top: 50%;left: 50%;padding: 16px; text-align: center;border-radius: 8px;transform: translate(-50%, -50%);box-shadow: 0 0 4px #000000b3;box-sizing: border-box;font-size:1.4em'>"+
           "<p><strong>感谢您的捐赠:)</strong></p><p><br><img src='http://donate.apcbat.top/AliPay.webp' width='200px' /> <img src='http://donate.apcbat.top/WeChat.webp' width='200px' /> </p>"+
           "<p><br><button style='border: none; background-color:#2196F3; color: #fff; padding: 8px; border-radius: 8px;width: 100px;z-index: 999999;'>关闭</button></p></div>");
    divPlay=$("<div style='background-color:#FFF;display: none;position: fixed;top: 50%;left: 50%;padding: 16px; text-align: center;border-radius: 8px;transform: translate(-50%, -50%);box-shadow: 0 0 4px #000000b3;box-sizing: border-box;'>"+
           "<strong>已自动播放！如需暂停请先点击右侧按钮暂停此插件:)</strong></div>")
    btnDonate.click(function(){
            divD.fadeIn();
    });
    divD.find("button").click(function(){closeDonate();});
    divTip=$("<div style='z-index:9999999;display: none;position: fixed;top: 0;width: 100%;text-align: center;color: #fff;line-height: 50px;background: #2196F3;'></div>");

    div.append(button,btnDonate);
    $("body").append(div,divD,divTip,divPlay);
})();

function toggle(){
    started=!started;
    if (started){
        button.text("点击暂停");
        tip("已开启，请不要离开此页面，否则上课时常可能不会被记录!",3000);
        tik();
        t = setInterval(function(){
            tik();
        }, 3000);
    }else {
        button.text("点击开启");
        tip("已关闭，感谢您的使用:)",2000);
        clearInterval(t);
    }
}

function tip(msg,delay){
    divTip.text(msg);
    divTip.fadeIn();
    divTip.delay(delay).fadeOut();
}

var first=true;
function tik(){
    if(!started) return;

    var ff=$("iframe").contents().find("iframe");
    var i;
    for(i=0;i<ff.length;i++){
        var f=isFinshed(ff[i],i);
        if(!f) break;
    }
    if(i==ff.length){
        tip("本节已完成:)",1500);
        first=true;
        $(".tabtags .orientationright").click();
    }else{
        var video=$(ff[i]).contents().find("video")[0];
        if(typeof(video) == "undefined") return;
        if(video.paused){
            log("paused");
            if(!first){
                divPlay.fadeIn();
                divPlay.delay(3000).fadeOut();
            }
            first=false;
            $(ff[i]).contents().find(".vjs-big-play-button").click();
        }
    }
}

function isFinshed(frame,index){
   var fff=$(frame).contents();

    var cur=fff.find(".vjs-current-time-display").text();
    var total=fff.find(".vjs-duration-display").text();

    var ff = $("iframe").contents();

    var finish=$(ff.find(".ans-attach-ct")[index]).hasClass("ans-job-finished");

    if(cur=="0:00"&&finish) return true;

    return finish&&cur==total;
}

function log(msg){
    console.log(msg);
}

function closeDonate(){
    divD.fadeOut();
}

