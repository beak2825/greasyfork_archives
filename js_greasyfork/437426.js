// ==UserScript==
// @name         学习强国
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  学习强国自用
// @author       nkyuiu
// @license      nkyuiu
// @match        *://pc.xuexi.cn/*
// @match        pc.xuexi.cn/*
// @match        *://xuexi.cn/*
// @match        xuexi.cn/*
// @match        *://www.xuexi.cn/*
// @match        www.xuexi.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437426/%E5%AD%A6%E4%B9%A0%E5%BC%BA%E5%9B%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/437426/%E5%AD%A6%E4%B9%A0%E5%BC%BA%E5%9B%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var strHref = window.location.href;
    var strLogin = "pc.xuexi.cn/points/login.html";
    var strMyStudy = "pc.xuexi.cn/points/my-study.html";
    var strMyPoints = "pc.xuexi.cn/points/my-points.html";
    var strExamIndex = "pc.xuexi.cn/points/exam-index.html";
    var strExamPractice = "pc.xuexi.cn/points/exam-practice.html";
    var strExamWeeklyList = "pc.xuexi.cn/points/exam-weekly-list.html";
    var strExamWeeklyDetail = "pc.xuexi.cn/points/exam-weekly-detail.html";
    var strExamPaperList = "pc.xuexi.cn/points/exam-paper-list.html";
    var strExamPaperDetail = "pc.xuexi.cn/points/exam-paper-detail.html";
    var strLgpageDetail = "xuexi.cn/lgpage/detail/index.html";
    var strVideo="xuexi.cn/4426aa87b0b64ac671c96379a3a8bd26/db086044562a57b441c24f2af1c8e101.html#1novbsbi47k-5"
    var strText="xuexi.cn/cc72a0454287bdedb7e2c156db55e818/71eb7214c6c0c1f5e6ec6e29564decb4.html";

    var dicUrl = {
        "我要" : strText,
        "视听" : strVideo,
        "每日" : strExamPractice,
        "每周" : strExamWeeklyList,
        "专项" : strExamPaperList,
    }
    //window.setTimeout(doit(), 6 * 1000);
    //window.onload = doit();
    beginAfterComplete(doit);

    function doit(){

        //alert('doit');
        //console.log("doit");
        //

        // 看文章
        if (IsTarget(strText)) {
            // 待完善
            beginAfterComplete(beginText);
        }

        // 看视频
        else if (IsTarget(strVideo)) {
            // 待完善
            beginAfterComplete(beginVideo);
        }

        // 文章页,视频页 定时自动关闭
        else if(IsTarget(strLgpageDetail)){
            //TestAlert(document.querySelector(".prism-big-play-btn").className);
            
            // 文章播报
            var btnBroadcast = document.querySelector(".voice-lang-switch");
            if (btnBroadcast!=null && btnBroadcast.innerText=="播报"){
                btnBroadcast.click();
            }
            scrollToBottom();

            /* 播放视频 */
            // window.setInterval(function(){

            //  var btn = document.querySelector(".prism-big-play-btn");
            //  //<div class="prism-big-play-btn" id="aliplayer-srC4b5AwMN_component_B19EDDDE-13F5-4135-818F-DBEE3DF27B40" style="position: absolute; left: 30px; bottom: 80px; display: block;"><div class="outter"></div></div>
            //  if (btn.className=='prism-big-play-btn pause' || btn.className=="prism-big-play-btn") {
      //               console.log("detail");
            //      document.querySelector(".prism-big-play-btn").click();
            //  }
            // }, 3 * 1000);


             closeTimeout(90);
        }

        // 登录界面自动滑到底
        else if(IsTarget(strLogin)){
            scrollToBottom();
        }

        // 登录成功后跳转到我的积分页面
        else if(IsTarget(strMyStudy)){
            window.open("http://"+strMyPoints,"_self");
        }

        // 我的积分页面 主要操作
        else if(IsTarget(strMyPoints)){
            //window.open("http://"+strExamPractice);
            beginAfterComplete(beginMyPoints);
        }

        // 每日答题 每周答题 专项答题  答题完毕返回我的积分页面
        else if (IsTarget(strExamPractice) || IsTarget(strExamWeeklyDetail) || IsTarget(strExamPaperDetail)) {
            var intID = window.setInterval(function() {
                var tempBtn = document.querySelector(".ant-btn").innerText;
                    if(tempBtn =='再来一组' || tempBtn =='查看解析'){
                    window.clearInterval(intID);
                    openTimeout("http://"+strMyPoints,"_self",5);
                }
            }, 3000);

        }

        // 专项答题页面操作
        else if (IsTarget(strExamPaperList)) {
            beginAfterComplete(beginExamPaper);
        }

        // 每周答题页面操作
        else if (IsTarget(strExamWeeklyList)){
            // 待完善
            alert("strExamWeeklyList");
        }
    }

    function beginAfterComplete(argument) {
        var intID = window.setInterval(function() {
                if(document.readyState=='complete'){
                window.clearInterval(intID);
                argument();
            }
        }, 2000);
    }

    function TestAlert(string){
        //alert(string);
    }

    function beginMyPoints() {

        var points = document.querySelectorAll("span.my-points-points")[1].innerText;
        if (points > 39) {
            alert("学习完毕");
            return 0;
        }

        var tasks = [];
        var content = document.querySelector(".my-points-content").children;

        var dicTasks = ["每日答题", "专项答题", "我要选读文章", "每周答题"];
        for (var i = content.length - 1; i >= 0; i--) {
            if (content[i].querySelector(".big").innerText != "已完成") {
                var tempTask = content[i].querySelector(".my-points-card-title").innerText;
                // 每周一 做一次每周答题
                if (new Date().getDay() !=1 && tempTask=="每周答题") {continue;}
                if (dicTasks.includes(tempTask)) {
                    tasks.push(content[i].querySelector("p").innerText);
                }
            }
        }
        //var id = getRdm(0,task.length);
        //var title = task[id].substr(0,2);
        var title = tasks[0].substr(0,2);
        TestAlert(title);
        openTimeout("http://"+strText,"_self",3);
        switch(title){
            case "我要":
                openTimeout("http://"+strText,"_self",3);
                break;
            case "视听":
                openTimeout("http://"+strVideo,"_self",3);
                break;
            case "每日":
                openTimeout("http://"+strExamPractice,"_self",3);
                break;
            case "专项":
                openTimeout("http://"+strExamPaperList,"_self",3);
                break;
            case "每周":
                openTimeout("http://"+strExamWeeklyList,"_self",3);
                break;
            default:
                openTimeout("http://"+strMyPoints,"_self",3);
        }
    }

    function beginText() {
        // body...
        TestAlert("beginText");
        var text = document.querySelectorAll("span.text");
        TestAlert(text.length);
        var index = [14,14+getRdm(1,8),23,23+getRdm(1,8),32,32+getRdm(1,8),41,41+getRdm(1,8)];
        var intID = window.setInterval(function () {
            if(index.length>0){
                text[index[0]].click();
                index.shift();
            }else{
                window.clearInterval(intID);
                openTimeout("http://"+strMyPoints,"_self",5);
            }
        },80 * 1000);
    }

    function beginVideo() {

        TestAlert("beginVideo");
        var btns=[];
        var btn = [0,1,2,3,4,5,6,7,9,10,11];
        var text=[];
        var index = [0,1,2,3,4,5,6];
        var intID = window.setInterval(function() {
            btns = document.querySelectorAll("div.tab-item.center-item");
            if(btns.length>15){
                //window.clearInterval(intID);
                //TestAlert(btns.length);
                var temp = getRdm(0,btn.length-1);
                btns[btn[temp]].click();
                btn.splice(temp,1);

                window.setTimeout(function () {
                    text = document.querySelectorAll(".textWrapper");
                    if(index.length>0){
                        var event = document.createEvent('MouseEvents');
                        event.initEvent('mousedown', true, false);
                        document.querySelector(".textWrapper").dispatchEvent(event);
                        //document.querySelector(".textWrapper").click();
                        index.shift();
                    }else{
                        openTimeout("http://"+strMyPoints,"_self",5);
                    }
                }, 5 * 1000);
            }
        }, 15 * 1000);

        //setTimeout(function(){btn[new Date().getDay()-1].click();}, 3 * 1000);




    }

    function beginExamPaper(){
        let strhref = 'https://pc.xuexi.cn/points/exam-paper-detail.html?id=';
        let buttons = document.querySelectorAll(".ant-btn.button.ant-btn-primary");

        for (var i = buttons.length - 1; i >= 0; i--) {
            if (buttons[i].innerText == "开始答题") {
                buttons[i].click();
                //let tempHref = buttons[i+1].parentNode.querySelector(".solution").href;
                //let id = 1 + parseInt(tempHref.slice(53));
                //alert(strhref+(id+1));
                //window.open(strhref+id,"_self");
                break;
            }
        }
    }

    // 几秒后打开网页
    function openTimeout(href,name,time) {
        setTimeout(function(){window.open(href,name)}, time * 1000);
    }

    // 几秒后关闭网页
    function closeTimeout(time) {
        setTimeout(function(){window.close()}, time * 1000);
    }

    // 判断herf是否包含str
    function IsTarget(str){
        return strHref.indexOf(str) != -1
    }

    // 滚动到末尾函数
    function scrollToBottom(){
        (function () {
            var y = document.body.scrollTop;
            var step = 500;
            window.scroll(0, y);
            function f() {
                if (y < document.body.scrollHeight) {
                    y += step;
                    window.scroll(0, y);
                    setTimeout(f, 50);
                }
                else {
                    window.scroll(0, y);
                    document.title += "scroll-done";
                }
            }
            setTimeout(f, 1000);
        })();
    }

    // 获取两个数之间的随机整数
    function getRdm(start, end) {
        return Math.floor(Math.random() * (end - start) + start)
    }

    // Your code here...
})();