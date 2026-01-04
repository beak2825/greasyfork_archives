// ==UserScript==
// @name         test
// @namespace    test
// @description  审核过程的错误提示, Error tips during the review process
// @homepageURL  https://greasyfork.org/scripts/test
// @version      1.9.1
// @exclude      https://global-oss.zmqdez.com/front_end/index.html#/country
// @include      https://global-oss*
// @grant        GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @connect      oapi.dingtalk.com
// @connect      jinshuju.net
// @run-at       document-idle
// @author       zhousanfu
// @copyright    2020 zhousanfu@hellofun.cn
// @downloadURL https://update.greasyfork.org/scripts/411462/test.user.js
// @updateURL https://update.greasyfork.org/scripts/411462/test.meta.js
// ==/UserScript==

//$(function(){
//    alert('jquery onload');
//});

var url = window.location.href;
var cou = 0;//审核按钮点击次数 10s
var sh_button = '';//审核按钮
var sh_timer = null;//审核计时器
var fe_timer = null;//刷新计时器
var flag = false;//刷新限制
var f_stamp = 0;
var l_stamp = 0;

if (url.indexOf("dingtao/test") >= 0) {
    var fe_button = $("button.fresh-btn")[0];
    shButton();
    feInterval();
    f_stamp = (new Date()).valueOf();
    fe_button.addEventListener("click",function(){//监听刷新按钮点击事件
        var timestamp = (new Date()).valueOf();
        console.log(timestamp);
        if(flag){//刷新频繁时
            alert("刷新太过频繁");
            return;
        }
        flag = true;//每点一次刷新把标识设置为true
        // cou = 0;
        // shClearInterval();
        shButton();//重新获取审核按钮 添加事件等
    },false);
}

function shButton(){//获取审核按钮 添加监听事件 每点击一下 cou+1
    sh_button = $("div.button-content > button");
    if(null == sh_timer){
        shInterval();//每隔10s 把cou重置为0
        for(var i = 0 ; i < sh_button.length ; i++){
            sh_button[i].addEventListener("click",shEventFN,false);
        }
    }
}

function shInterval(){
    sh_timer = setInterval(function() {
        console.log("审核按钮重置");
        cou = 0;
    }, 1000 * 10);
}

function feInterval(){
    fe_timer = setInterval(function() {
        console.log("刷新按钮重置");
        flag = false;
    }, 500);
}

function shClearInterval(){
    if(null != sh_timer){
        clearInterval(sh_timer);
        sh_timer = null;
        for(var i = 0 ; i < sh_button.length ; i++){
            sh_button[i].removeEventListener("click",shEventFN,false);
        }
    }
}

function feClearInterval(){
    if(null != fe_timer){
        clearInterval(fe_timer);
        fe_timer = null;
    }
}

function shEventFN(){
    var l_stamp = (new Date()).valueOf();
    if((l_stamp - f_stamp) <= 3000 ){
        cou++;
    }
    f_stamp = l_stamp;
    if(cou >= 3){//当到达限制次数时
        alert("10秒内提交3个");
        console.log("aaaaaaaaaaaaaaaaa");
    };
}

