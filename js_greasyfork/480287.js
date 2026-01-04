// ==UserScript==
// @name         xigualnzyys
// @version      0.0.7
// @description  storehouse
// @author       Xiguayaodade
// @license      MIT
// @match        *://www.lnlpa.cn/*
// @match        *://www.lnszyys.com/*
// @grant        GM_info
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @namespace    http://tampermonkey.net/
// @homepage     http://8.130.116.135/?article/
// @source       http://8.130.116.135/?article/
// @icon         https://picx.zhimg.com/v2-ce62b58ab2c7dc67d6cabc3508db5795_l.jpg?source=32738c0c
// @connect      icodef.com
// @connect      localhost
// @connect      8.130.116.135
// @connect      aip.baidubce.com
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals jQuery, $, waitForKeyElements */

    var ddds3 = null;
    var addMessage = null;

    /**
     *播放器
     *@type {dom}
     */
    var elevideo;
    /**
     *var courseId = GM_getValue("courseId");
     *@type {int}
     */
    var courseId = 1;
    /**
     *courseCount
     *@type {int}
     */
    var courseCount = null;
    /**
     *courseIndex
     *@type {int}
     */
    var courseIndex = null;
    /**
     *capterCount
     *@type {int}
     */
    var capterCount = null;

    var stInter = null;

    let btn1=GM_registerMenuCommand ("\u4f5c\u8005\uff1a\ud83c\udf49\u897f\u74dc\u8981\u5927\u7684\ud83c\udf49", function(){
        confirm("Hello,\u611f\u8c22\u4f7f\u7528\ud83c\udf49\u897f\u74dc\u5237\u8bfe\u52a9\u624b\ud83c\udf49\uff01\u591a\u591a\u53cd\u9988\u54e6");
        GM_unregisterMenuCommand(btn1);
    }, "");
    let btn2=GM_registerMenuCommand ("\u4ed8\u8d39\u5185\u5bb9", function(){
        alert("\u9650\u65f6\u514d\u8d39\uff0c\u5168\u529b\u5f00\u53d1\u4e2d...");
    }, "p");

    var bootstrapCSS = document.createElement("link");
    bootstrapCSS.rel = "stylesheet";
    bootstrapCSS.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-alpha1/dist/css/bootstrap.min.css";
    document.head.appendChild(bootstrapCSS);

    var bootstrapJS = document.createElement("script");
    bootstrapJS.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-alpha1/dist/js/bootstrap.min.js";
    document.body.appendChild(bootstrapJS);

    //----解决重复监听start----
    //视频开始的公共方法
    var vdplay = null;
    //视频正在播放的公共方法
    var vdplaying = null;
    //视频暂停的公共方法
    var vdpause = null;
    //视频结束的公共方法
    var vdended = null;
    //监听音量的公共方法
    var vdvolume = null;
    //----解决重复监听end----

    //-----添加监听start------
    function addLisenner() {

        //获取播放器组件
        elevideo = document.getElementsByTagName("video")[0];

        vdplay = function(){
            let tm = 5 * 60 * 1000;
            console.log("xigua:\u5f00\u59cb\u64ad\u653e");
            addMessage("xigua:\u5f00\u59cb\u64ad\u653e");
        };
        vdplaying = function(){
            clearInterval(stInter);
            console.log("xigua:\u6b63\u5728\u64ad\u653e");
            addMessage("xigua:\u6b63\u5728\u64ad\u653e");
        };
        vdpause = function(){
            console.log("xigua:\u6682\u505c\u64ad\u653e");
            addMessage("xigua:\u6682\u505c\u64ad\u653e");
            setTimeout(function(){
                if(document.getElementsByClassName('el-dialog__wrapper')[0].style.display !== 'none'){
                    document.getElementsByClassName("dialog-footer")[0].children[0].click();
                    addMessage("挂机响应_xol");
                }
                else{
                    setTimeout(function(){
                        addMessage("禁止暂停");
                        elevideo.play();
                    },1000);
                }
            },1500);
        };
        vdended = function(){
            console.log("xigua:结束播放");
            addMessage("xigua:结束播放");
            setTimeout(function(){
                window.location.reload();
                // playVoide();
            },2000)
        };
        vdvolume = function(){
            if(elevideo.volume < 1 && elevideo.volume > 0){
                let vlum = elevideo.volume.toString();
                console.log("xigua:当前音量（"+vlum.substring(2,4)+"%)");
                addMessage("xigua:当前音量（"+vlum.substring(2,4)+"%)");
            }else if(elevideo.volume == 0){
                console.log("xigua:当前音量（0%)");
                addMessage("xigua:当前音量（0%)");
            }else{
                console.log("xigua:当前音量（100%)");
                addMessage("xigua:当前音量（100%)");
            }
        }

        elevideo.addEventListener('play',vdplay);
        elevideo.addEventListener('playing',vdplaying);
        elevideo.addEventListener('pause',vdpause);
        elevideo.addEventListener('ended',vdended);
        elevideo.addEventListener('volumechange',vdvolume);

        setTimeout(function(){
            elevideo.play();
            elevideo.volume = 0;
        },2000);
    }
    //-----添加监听end------

    //-----移除监听start---
    function removeLisenner(){
        if(vdplay != null){
            elevideo.removeEventListener("play", vdplay);
        }
        if(vdplaying != null){
            elevideo.removeEventListener("playing", vdplaying);
        }
        if(vdpause != null){
            elevideo.removeEventListener("pause", vdpause);
        }
        if(vdended != null){
            elevideo.removeEventListener("ended", vdended);
        }
        if(vdended != null){
            elevideo.removeEventListener("ended", vdended);
        }
        if(vdvolume != null){
            elevideo.removeEventListener("volumechange",vdvolume);
        }
    }
    //-----移除监听end---

    function sTime(){
        removeLisenner();
        addLisenner();
    }

    function playVoide(){
        capterCount = document.getElementsByClassName('chapterList')[0].children.length;
        addMessage("xigua:共"+capterCount+"章");
        for(let i=0;i<=capterCount;i++){
            if(i >= capterCount){
                addMessage("xigua:课程学习完毕");
                let uRLList = GM_getValue("uRLList");
                console.log("xigua:",uRLList);
                window.open(uRLList,"_self");
                break;
            }
            let prevClassTxt = document.getElementsByClassName('chapterList')[0].children[i]._prevClass;
            if(prevClassTxt === 'avideoF' || prevClassTxt === 'active avideoF'){

                // addMessage("xigua:第"+(i+1)+"章完成");
            }
            else{
                addMessage("xigua:第"+(i+1)+"章未完成");
                document.getElementsByClassName('chapterList')[0].children[i].click();
                stInter = setInterval(sTime,1000);
                break;
            }
        }
    }

    function juzyk(){
        courseCount = document.getElementsByClassName("courseUl")[0].childElementCount;
        if(courseId <= courseCount){
            addMessage("当前第"+courseId+"科，共"+courseCount+"科");
            console.log("当前第"+courseId+"科，共"+courseCount+"科");
            let courseStatu = document.getElementsByClassName("courseUl")[0].children[courseId-1].children[1].children[2].innerText;
            if(courseStatu === '未听完'){
                // GM_setValue("courseId", (courseId+1));
                addMessage("第"+courseId+"科未听完");
                console.log("第"+courseId+"科未听完");
                setTimeout(function(){
                    document.getElementsByClassName("courseUl")[0].children[courseId-1].children[0].click();
                    setTimeout(function(){
                        window.location.reload();
                    },1500);
                },1000);
            }
            else{
                addMessage("第"+courseId+"科已完成");
                console.log("第"+courseId+"科已完成");
                courseId++;
                juzyk();
            }
        }else{
            GM_deleteValue("courseId");
            addMessage("专业课学习完成!");
            console.log("专业课学习完成!");
            document.getElementsByClassName("gxk")[0].click();
            setTimeout(function(){
                courseId = 1;
                jugxk();
            },1000);
        }
    }

    function jugxk(){
        courseCount = document.getElementsByClassName("courseUl")[0].childElementCount;
        if(courseId <= courseCount){
            addMessage("当前第"+courseId+"科，共"+courseCount+"科");
            console.log("当前第"+courseId+"科，共"+courseCount+"科");
            let courseStatu = document.getElementsByClassName("courseUl")[0].children[courseId-1].children[1].children[2].innerText;
            if(courseStatu === '未听完'){
                // GM_setValue("courseId", (courseId+1));
                addMessage("第"+courseId+"科未听完");
                console.log("第"+courseId+"科未听完");
                setTimeout(function(){
                    document.getElementsByClassName("courseUl")[0].children[courseId-1].children[0].click();
                    setTimeout(function(){
                        window.location.reload();
                    },1500);
                },1000);
            }
            else{
                addMessage("第"+courseId+"科已完成");
                console.log("第"+courseId+"科已完成");
                // GM_setValue("courseId", (courseId+1));
                courseId++;
                jugxk();
            }
        }else{
            GM_deleteValue("courseId");
            addMessage("公需课学习完成,清空缓存,退出!");
            console.log("公需课学习完成,清空缓存,退出!");
        }
    }

    var radioIndex = 0;
    var checkboxIndex = 0;
    var radioCount = 0;
    var checkboxCount = 0;

    //------等待网页加载完成start-----
    var wait = setInterval(function (){
        ddds3.children().remove();
        let nowUrl = window.location.href;
        if(nowUrl.substring(0,22) === 'http://www.lnszyys.com'){
            addMessage("首页");
        }
        else if(nowUrl.substring(0,39) === 'http://www.lnlpa.cn/UserView/CourseList'){
            try {
                addMessage("课程列表...");
                GM_setValue("uRLList",nowUrl);
                if(document.getElementsByClassName('el-dialog__wrapper')[0].style.display !== 'none'){
                    document.getElementsByClassName('el-icon-close')[0].click();
                    addMessage("关闭弹窗...");
                }
                juzyk();
                clearInterval(wait);
            }catch(e){
                addMessage("发现异常："+e+"|程序已终止运行...");
                clearInterval(wait);
                return;
            }
        }
        else if(nowUrl.substring(0,32) === 'http://www.lnlpa.cn/CourseDetail'){
            try {
                addMessage("学习页...");
                playVoide();
                clearInterval(wait);
            }catch(e){
                addMessage("发现异常："+e+"|程序已终止运行...");
                clearInterval(wait);
                return;
            }
        }
        else if(nowUrl.substring(0,30) === 'http://www.lnlpa.cn/OnlineTest'){
            try {
                addMessage("考试页...");
                if(document.querySelector(".radioList") != null){
                    radioCount = document.querySelector(".questionList").children[0].children[1].childElementCount;
                }
                if(document.querySelector(".checkboxList") != null){
                    checkboxCount = document.querySelector(".questionList").children[1].children[1].childElementCount;
                }
                examRadio();
                // examCheckbox();
                clearInterval(wait);
            }catch(e){
                addMessage("发现异常："+e+"|程序已终止运行...");
                clearInterval(wait);
                return;
            }
        }
        else{
            addMessage("请前往课程列表");
        }
    }, 2500);
    //------等待网页加载完成end-----

    function goTest(){
        let nowUrl = window.location.href;
        if(nowUrl.substring(0,30) === 'http://www.lnlpa.cn/OnlineTest'){
            try {
                ddds3.children().remove();
                addMessage("开始考试...");
                if(document.querySelector(".radioList") != null){
                    radioCount = document.querySelector(".questionList").children[0].children[1].childElementCount;
                }
                if(document.querySelector(".checkboxList") != null){
                    checkboxCount = document.querySelector(".questionList").children[1].children[1].childElementCount;
                }
                examRadio();
            }catch(e){
                addMessage("发现异常："+e+"|程序已终止运行...");
                clearInterval(wait);
                return;
            }
        }
        else{
            ddds3.children().remove();
            addMessage("请进入考试页再使用此功能...");
        }
    }

    function wkAnswer(wkType,answor){
        if(wkType === '单选题：'){
            console.log("单选\u7b2c"+(radioIndex+1)+"\u9898");
            addMessage("单选\u7b2c"+(radioIndex+1)+"\u9898");
            let answerPrint;
            try{
                answerPrint = answor.match(/[A-E]/g)[0];
            }
            catch(e){
                addMessage("请查看参考答案："+answor);
            }
            console.log("answerPrint",answerPrint);
            addMessage(answerPrint);
            switch(answerPrint)
            {
                case 'A':
                    document.querySelector(".questionList").children[0].children[1].children[radioIndex].children[1].children[0].click();
                    break;
                case 'B':
                    document.querySelector(".questionList").children[0].children[1].children[radioIndex].children[1].children[1].click();
                    break;
                case 'C':
                    document.querySelector(".questionList").children[0].children[1].children[radioIndex].children[1].children[2].click();
                    break;
                case 'D':
                    document.querySelector(".questionList").children[0].children[1].children[radioIndex].children[1].children[3].click();
                    break;
                case 'E':
                    document.querySelector(".questionList").children[0].children[1].children[radioIndex].children[1].children[4].click();
                    break;
            }
            radioIndex++;
        }
        if(wkType === '多选题：'){
            console.log("多选\u7b2c"+(checkboxIndex+1)+"\u9898");
            addMessage("多选\u7b2c"+(checkboxIndex+1)+"\u9898");
            let answerPrint;
            let duoxuan = /\[(.*?)\]/.exec(answor)[1];
            if(duoxuan === null){
                let str1 = answor.split('。')[0];
                answerPrint = str1.match(/[A-E]/g);
            }
            else{
                answerPrint = duoxuan.split('');
            }
            console.log("---------------------",answerPrint);
            addMessage(answerPrint);
            answerPrint.forEach((answer, index) => {
                setTimeout(() => {
                    let clickTarget;
                    switch(answer) {
                        case 'A':
                            console.log("---------------------"+checkboxIndex);
                            clickTarget = document.querySelector(".questionList").children[1].children[1].children[checkboxIndex].children[1].children[0];
                            break;
                        case 'B':
                            console.log("---------------------"+checkboxIndex);
                            clickTarget = document.querySelector(".questionList").children[1].children[1].children[checkboxIndex].children[1].children[1];
                            break;
                        case 'C':
                            console.log("---------------------"+checkboxIndex);
                            clickTarget = document.querySelector(".questionList").children[1].children[1].children[checkboxIndex].children[1].children[2];
                            break;
                        case 'D':
                            console.log("---------------------"+checkboxIndex);
                            clickTarget = document.querySelector(".questionList").children[1].children[1].children[checkboxIndex].children[1].children[3];
                            break;
                        case 'E':
                            console.log("---------------------"+checkboxIndex);
                            clickTarget = document.querySelector(".questionList").children[1].children[1].children[checkboxIndex].children[1].children[4];
                            break;
                        case 'F':
                            clickTarget = document.querySelector(".questionList").children[1].children[1].children[checkboxIndex].children[1].children[5];
                            break;
                        case 'G':
                            clickTarget = document.querySelector(".questionList").children[1].children[1].children[checkboxIndex].children[1].children[6];
                            break;
                        case 'H':
                            clickTarget = document.querySelector(".questionList").children[1].children[1].children[checkboxIndex].children[1].children[7];
                            break;
                        case 'I':
                            clickTarget = document.querySelector(".questionList").children[1].children[1].children[checkboxIndex].children[1].children[8];
                            break;
                        default:
                            console.log("当前多选题选择过多，系统需更新！");
                            addMessage("当前多选题选择过多，系统需更新！");
                            return;
                    }
                    if (clickTarget) {
                        clickTarget.click();
                        console.log("点击" + answer);
                    }
                }, index * 50); // 将每次点击的延迟设置为 500ms * 索引
            });
            setTimeout(function(){
                checkboxIndex++;
            },3000);
        }
        setTimeout(function(){
            examRadio();
        },3500);
    }

    var examRadioText = '单选题：';
    var examCheckboxText = '多选题：';

    function examRadio(){
        if(radioIndex < radioCount){
            let qusetionStr = document.querySelector(".questionList").children[0].children[1].children[radioIndex].innerText;
            let newQusetionStr = qusetionStr.replace(/\n/g, '');
            console.log(radioIndex,examRadioText,newQusetionStr);
            wait1(examRadioText,newQusetionStr);
        }else{
            console.log("单选题作答完毕");
            radioIndex = 0;
            radioCount = 0;
            examCheckbox();
        }
    }

    function examCheckbox(){
        if(checkboxIndex < checkboxCount){
            console.log("多选题开始作答");
            let qusetionStr = document.querySelector(".questionList").children[1].children[1].children[checkboxIndex].innerText;
            let newQusetionStr = qusetionStr.replace(/\n/g, '');
            console.log(checkboxIndex,examCheckboxText,newQusetionStr);
            wait1(examCheckboxText,newQusetionStr);
        }else{
            console.log("多选题作答完毕");
            checkboxIndex = 0;
            addMessage("作答完毕,请手动提交");
        }
    }

    function wait2(){
        const apiKey = "";
        const sk = '';

        // 构建请求URL
        const url = 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=&client_secret=';

        // 构建请求数据
        const data = {
            nlu_type: "text",
            query: ""
        };

        GM_xmlhttpRequest({
            url: url,
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(data),
            onload: function(response) {
                var data = JSON.parse(response.responseText);
                console.log("access_token:",data.access_token);
            },
            onerror: function(response) {
                console.error("请求失败:", response);
            }
        });
    }

    function wait1(wkType,con){

        const url = 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro?access_token=24.d66a8e57726a305c45d0b4bf07751eea.2592000.1707580474.282335-46883328';

        const qusetionData = wkType+con;

        const data ={
            "messages": [{"role": "user","content": qusetionData}],
            "system": "我想让你充当一个参考答案，并且你只会回复正确答案的编号，例如：[A]、[C]、[ABC]、[BDE]，不要包含其他任何内容，如答案解析或选项分析，除非我指示或要求你这么做。"
        }

        GM_xmlhttpRequest({
            url: url,
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(data),
            onload: function(response) {
                var data = JSON.parse(response.responseText);
                let answor = data.result;
                console.log(data);
                console.log(answor);
                wkAnswer(wkType,answor);
            },
            onerror: function(response) {
                console.error("请求失败:", response);
            }
        });
    }

    const panel = function(){
        var container = $('<div id="gm-interface"></div>');
        var titleBar = $('<div id="gm-title-bar">\ud83c\udf49\u897f\u74dc\u7f51\u8bfe\u52a9\u624b\ud83c\udf49</div>');
        var minimizeButton = $('<div title="\u6536\u8d77" style="display:black"><svg id="gm-minimize-button" class="bi bi-dash-square" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path fill-rule="evenodd" d="M3.5 8a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.5-.5z"/></svg></div>');
        var maxButton = $('<div title="\u5c55\u5f00" style="display:none"><svg id="gm-minimize-button" class="bi bi-plus-square" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"/><path fill-rule="evenodd" d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"/><path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/></svg></div>');
        var content = $('<div id="gm-content"></div>');
        var tips = $('<div class="tip" style="display:none;">\u957f\u6309\u62d6\u62fd</div>');
        var scrollText = $('<marquee>').text('\u4e7e\u5764\u672a\u5b9a\uff0c\u4f60\u6211\u7686\u662f\u9ed1\u9a6c----\u4f5c\u8005\uff1a\u897f\u74dc\u8981\u5927\u7684\uff08\u611f\u8c22\u652f\u6301\uff01\uff09').css({
            'position': 'absolute',
            'top': '15%',
            'left': '50%',
            'transform': 'translate(-50%, -50%)',
            'width': '90%',
            'height': '25px',
            'font-size': '16px',
            'line-height': '1.5',
            'white-space': 'nowrap'
        }).appendTo(content);
        //var ddds1 = $('<div style="position: absolute;top: 20%;width:90%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;">\u70b9\u51fb\u542f\u52a8\uff1a<button id="startxg" style="position: absolute;width:48px;right: 10px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">\u542f\u52a8</button></div>');
        //var ddds5 = $('<div style="position: absolute;top: 35%;width:90%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;">\u70b9\u51fb\u542f\u52a8\uff1a<button id="stopxg" style="position: absolute;width:48px;right: 10px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">暂停</button></div>');
        var ddds2 = $('<div style="position: absolute;top: 73%;width:94%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;">操作\uff1a<button id="goTest" style="position: absolute;width:88px;right: 138px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">开始考试</button><button id="speedxgone" style="position: absolute;width:88px;right: 38px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">清空缓存</button></div>');
        ddds3 = $('<div id="message-container" style="position: absolute;display: ;align-content: center;justify-content: center;top: 20%;width:94%;height:52%;max-height:9999%;overflow-y:auto;padding: 3px;background: #ffffff;border-radius: 5px;"></div>');
        var ddds4 = $('<div style="position: absolute;top: 85%;width:94%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;"><a href="http://8.130.116.135/?article/" style="position: absolute;right: 10px;text-decoration: none;color: pink;">\u003e\u003e\u003e\u8054\u7cfb\u003a\u0031\u0039\u0030\u0038\u0032\u0034\u0035\u0033\u0030\u0032\u0040\u0071\u0071\u002e\u0063\u006f\u006d</a></div>');

        container.append(titleBar);
        //content.append(ddds1);
        //content.append(ddds5);
        content.append(ddds2);
        content.append(ddds3);
        content.append(ddds4);
        container.append(content);
        container.append(maxButton);
        container.append(minimizeButton);
        $('body').append(container);
        $('body').append(tips);

        GM_addStyle(`
        #gm-interface {
            position: fixed;
            top: 50%;
            left: 50%;
            border-radius: 5px;
            background-color: white;
            z-index: 9999;
        }

        #gm-title-bar {
            padding: 5px;
            background-color: #ffc0c0;
            border: 1px solid black;
            border-radius: 5px;
            cursor: grab;
        }

        #gm-minimize-button {
            position: absolute;
            top: 2px;
            right: 2px;
            width: 30px;
            height: 30px;
            border-radius: 5px;
            padding: 0;
            font-weight: bold;
            background-color: #ffc0c0;
            cursor: pointer;
        }

        #gm-content {
            padding: 10px;
            border: 1px solid black;
            border-radius: 2px 2px 5px 5px;
            background-color: #ffe5e5;
            width: 400px;
            height: 300px;
        }
        .tip{
            font-family: "黑体";
            color: black;
            -webkit-transform: scale(0.8);
            position:absolute;
            padding: 6px 5px;
            background-color:#ffe8f0;
            border-radius: 4px;
            z-index: 9999;
        }
    `);

        titleBar.on('mousemove',function(e){
            tips.attr("style", "display:black;");
            var top = e.pageY+5;
            var left = e.pageX+5;
            tips.css({
                'top' : top + 'px',
                'left': left+ 'px'
            });
        });

        titleBar.on('mouseout',function(){
            tips.hide();
        });

        titleBar.on('mousedown', function(e) {
            var startX = e.pageX - container.offset().left + window.scrollX;
            var startY = e.pageY - container.offset().top + window.scrollY;

            $(document).on('mousemove', function(e) {
                e.preventDefault();
                var newX = e.pageX - startX;
                var newY = e.pageY - startY;
                container.css({ left: newX, top: newY });
            });

            $(document).on('mouseup', function() {
                $(document).off('mousemove');
                $(document).off('mouseup');
            });
        });


        minimizeButton.on('click', function() {
            minimizeButton.attr("style", "display:none;");
            maxButton.attr("style", "display:black;");
            content.slideToggle(0);
            container.css({ width: 200 });
        });

        maxButton.on('click', function() {
            minimizeButton.attr("style", "display:black;");
            maxButton.attr("style", "display:none;");
            content.slideToggle(0);
            container.css({ width: 400 });
        });

        $("#goTest").on('click',function(){
            goTest();
        });

        $("#speedxgone").on('click',function(){
            GM_deleteValue("courseId");
            ddds3.children().remove();
            addMessage("已清空缓存");
            addMessage("调用wait1()");
            console.log("调用wait1()");
            wait1();
        });

        $("#switchButton").on('click',function(){
            // if (speedonoff) {
            //     speedonoff = false;
            //     addMessage("\u500d\u901f\uff1a\u5173\u95ed");
            //     $("#switchButton").text("当前：关闭");
            // } else {
            //     speedonoff = true;
            //     addMessage("\u500d\u901f\uff1a\u5f00\u542f");
            //     $("#switchButton").text("当前：开启");
            // }
        });

        // 监听鼠标滚轮事件，实现消息框滚动
        ddds3.on('mousewheel', function(event) {
            event.preventDefault();
            var scrollTop = ddds3.scrollTop();
            ddds3.scrollTop(scrollTop + event.originalEvent.deltaY);
        });

        // 添加新消息
        addMessage = function(message){
            // 检查消息数量，移除最早的一条消息
            // if (ddds3.children().length >= 288) {
            //     ddds3.children().first().remove();
            // }
            // 创建消息元素并添加到消息框容器
            var messageElement = $('<div class="message"></div>').text(message).css({
                'margin-bottom': '10px'
            }).appendTo(ddds3);
        }

    }
    panel();
    addMessage("\u002d\u002d\u002d\u002d\u6b63\u5728\u542f\u52a8\uff0c\u8bf7\u7a0d\u540e\u002e\u002e\u002e\u002d\u002d\u002d\u002d");
    })();