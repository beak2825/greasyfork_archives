// ==UserScript==
// @name         test1.9.2
// @namespace    test1.9.2
// @description  审核过程的错误提示, Error tips during the review process
// @homepageURL  https://greasyfork.org/scripts/test
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @version      1.9.2
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
// @downloadURL https://update.greasyfork.org/scripts/411499/test192.user.js
// @updateURL https://update.greasyfork.org/scripts/411499/test192.meta.js
// ==/UserScript==

var url = window.location.href;
var cou = 0;//审核过快次数
var count = 0;//审核次数
var sh_button = null;//审核按钮
var fe_button = null;//刷新按钮
var start_button = null;//开始按钮
var sh_timer = null;//审核计时器
var fe_timer = null;//刷新计时器
var timer = null;
var flag = false;//刷新限制

var s_stamp = null;//上一次时间戳
var e_stamp = null;//下一次时间戳

var first_stamp = null;
var last_stamp = null;

(function(){
    run();
})();

function run(){
    if (url.indexOf("tags/audit/video") >= 0) {
        shButton();
        feInterval();
        s_stamp = (new Date()).valueOf();
        first_stamp = (new Date()).valueOf();
        last_stamp = first_stamp;
        timer = setInterval(function() {
            fe_button = $("div.tags-audit-search-wrapper.tags-audit-search.ant-card.ant-card-bordered > div > div > div.left > div.search-options > button.btn-refresh")[0];
            if(undefined != fe_button && null != fe_button){
                //console.log("刷新按钮事件绑定");
                fe_button.addEventListener("click",function(){//监听刷新按钮点击事件
                    if(flag){//刷新频繁时
                        alert("刷新太过频繁。");
                        return;
                    }
                    flag = true;//每点一次刷新把标识设置为true
                    // cou = 0;
                    // shClearInterval();
                    shButton();//重新获取审核按钮 添加事件等
                },false);
                clearInterval(timer);
            }
        }, 100);
    }
}

function shButton(){//获取审核按钮 添加监听事件 每点击一下 cou+1
    sh_button = $("div.tags-audit-search-wrapper.tags-audit-search.ant-card.ant-card-bordered > div > div > div.right > button");
    if(null == sh_timer){
        shInterval();//每隔10s 把cou重置为0
        for(var i = 0 ; i < sh_button.length ; i++){
            sh_button[i].addEventListener("click",shEventFN,false);
        }
    }
}

function shInterval(){
    sh_timer = setInterval(function() {
        var time = (last_stamp - first_stamp);
        if(time < 0){
            time = 0;
        }
        //console.log("审核按钮重置");
        console.log("过去10秒内共审核：" + count + "单\n" + "共用时：" + time + "毫秒\n" + "审核过快单数：" + cou);
        cou = 0;
        count = 0;
        first_stamp = (new Date()).valueOf();
    }, 1000 * 10);
}

function feInterval(){
    fe_timer = setInterval(function() {
        //console.log("刷新按钮重置");
        flag = false;
    }, 1000);
}

function shClearInterval(){
    if(null != sh_timer){
        clearInterval(sh_timer);
        //console.log("审核计时器结束。。。。");
        sh_timer = null;
        if(null != sh_button){
                for(var i = 0 ; i < sh_button.length ; i++){
                sh_button[i].removeEventListener("click",shEventFN,false);
            }
            sh_button = null;
        }
    }
}

function feClearInterval(){
    if(null != fe_timer){
        //console.log("刷新计时器结束。。。。");
        clearInterval(fe_timer);
        fe_timer = null;
    }
}

function shEventFN(){//监听事件函数
    e_stamp = (new Date()).valueOf();
    last_stamp = (new Date()).valueOf();
    count++;
    if((e_stamp - s_stamp) <= 5000 ){
        cou++;
        if((e_stamp - s_stamp) <= 500){
            alert("两单间隔小于0.5秒");
        }
    }
    s_stamp = e_stamp;
    if(cou >= 2){//当到达限制次数时
        alert("10秒之内点单超过2单");
    };
}


