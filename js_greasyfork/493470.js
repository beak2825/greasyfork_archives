// ==UserScript==
// @name         zyyjxjy
// @version      0.0.1
// @description  storehouse
// @author       Xiguayaodade
// @license      MIT
// @match        *://www.tcmjy.org/*
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
// @connect      update.greasyfork.org
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals jQuery, $, waitForKeyElements */

    unsafeWindow.GM_getValue = GM_getValue
    unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest

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
    var examAllCount = 0;
    var trueAnswrItem;

    //------等待网页加载完成start-----
    var wait = setInterval(function (){
        ddds3.children().remove();
        addMessage("注意：脚本自动答题期间请勿操作");
        if(getAnswer().length < 1){
            addMessage("获取云数据,请等待》。。。");
            GM_setValue('answerList',dataAW);
        }else{
            addMessage("DATA is OK!");
        }
        let nowUrl = window.location.href;
        if(nowUrl.substring(0,22) === 'qqq'){
            addMessage("首页");
        }
        else if(nowUrl.substring(0,39) === 'www'){
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
        else if(nowUrl.substring(0,32) === 'eee'){
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
        else if(nowUrl.substring(0,26) === 'https://www.tcmjy.org/exam'){
            try {
                addMessage("考试页...");
                trueAnswrItem = document.querySelector("#primaryLayout > div:nth-child(1) > div:nth-child(1) > div.exam-wrapper > div > div > div > div.flex-box > div.flex-1.exam-drawer-question > div > form").getElementsByClassName("choiceItem");
                examAllCount = trueAnswrItem.length;
                let wahtDo = document.querySelector("#primaryLayout > div:nth-child(1) > div:nth-child(1) > div.exam-wrapper > div > div > div > div > div.info > div > div:nth-child(1) > div.exam-box-continer").children[0].className;
                if(wahtDo === 'card'){
                    addMessage("请单击开始考试按钮...");
                    // examAnswerNew();
                }
                else if(document.getElementsByClassName("ant-alert-message")[0] === undefined){
                    addMessage("请单击重新考试按钮...");
                    // examAnswerRe();
                    // examAnswerNew();
                }
                else{
                    addMessage("请单击搜集，将自动抓取正确答案");
                    // examRadio();
                }
                clearInterval(wait);
            }catch(e){
                addMessage("发现异常："+e+"|程序已终止运行...");
                clearInterval(wait);
                return;
            }
        }
        else{
            addMessage("请前往考试页");
        }
    }, 2000);
    //------等待网页加载完成end-----

    function getInterData(){
        addMessage("数据加载中，请稍后");
        GM_xmlhttpRequest({
            url: "https://update.greasyfork.org/scripts/490098/1351814/AW.js",
            method: "GET",
            headers:{
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            onload: function(response) {
                try{
                    GM_setValue('answerList',response.response);
                    setTimeout(function(){
                        // window.location.reload();
                    },1500);
                }catch(e){
                    alert("xigua：服务器维护中！");
                }
            }
        })
    }

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

    function juTorF(rIndex){
        let a = trueAnswrItem[rIndex].className;
        if(a === 'choiceItem'){
            return false;
        }else{
            return true;
        }
    }

    function getAnswer(){
        let oldData = GM_getValue('answerList');
        if (Array.isArray(oldData)) {
            return oldData;
        }
        return [];
    }

    function saveAnswer(answer_key,answer){
        let answerList = getAnswer();
        let juge = answerList.some(obj => obj.hasOwnProperty(answer_key));

        if (juge) {
            addMessage("该答案已存在...");
            console.log("该答案已存在");
            return false;
        }

        let tempMap = {};
        tempMap[answer_key] = answer;

        answerList.push(tempMap);

        // console.log(answerList);

        GM_setValue('answerList',answerList);

        return true;
    }

    function examRadio(){
        if(radioIndex < examAllCount){
            let answer_key = trueAnswrItem[radioIndex].getAttribute('ques_key');
            if(juTorF(radioIndex)){
                let answerStr = trueAnswrItem[radioIndex].getElementsByClassName("true-answer")[0].innerText;
                let regex = /[A-Za-z]+/g;
                let answer = answerStr.match(regex)[0];
                console.log("第",(radioIndex+1),"题答案：",answer,"开始保存");
                if(saveAnswer(answer_key,answer)){
                    console.log("错题保存成功...");
                }else{
                    console.log("错题保存失败...");
                }
                radioIndex++;
                examRadio();
            }else{
                let trueAe = optionTrue(radioIndex);
                console.log("第",(radioIndex+1),"正确答案:",trueAe);
                if(saveAnswer(answer_key,trueAe)){
                    console.log("正确答案记录成功...");
                }else{
                    console.log("正确答案记录失败...");
                }
                radioIndex++;
                examRadio();
            }
        }else{
            console.log("搜集完毕，开始纠错");
            addMessage("搜集完毕，可以开始重新考试");
            toggleOverlay(false);
            // let as = getAnswer();
            // console.log(as);
            radioIndex = 0;
            setTimeout(function(){
                console.log('-------');
                // examAnswer();
            },1500);
        }
    }

    function examAnswerNew(){
        let as1 = getAnswer();
        if(radioIndex < examAllCount){
            let answer_key = trueAnswrItem[radioIndex].getAttribute('ques_key');

            let result = as1.reduce((accumulator, obj) => {
                if (answer_key in obj) {
                    return obj[answer_key];
                }
                return accumulator;
            }, undefined);


            if (result !== undefined) {
                console.log('result',result);
                switch(result)
                {
                    case 'A':
                        console.log("第"+(radioIndex+1)+"题选","A");
                        trueAnswrItem[radioIndex].getElementsByClassName("ant-radio-group ant-radio-group-outline")[0].children[0].click();
                        break;
                    case 'B':
                        console.log("第"+(radioIndex+1)+"题选","B");
                        trueAnswrItem[radioIndex].getElementsByClassName("ant-radio-group ant-radio-group-outline")[0].children[1].click();
                        break;
                    case 'C':
                        console.log("第"+(radioIndex+1)+"题选","C");
                        trueAnswrItem[radioIndex].getElementsByClassName("ant-radio-group ant-radio-group-outline")[0].children[2].click();
                        break;
                    case 'D':
                        console.log("第"+(radioIndex+1)+"题选","D");
                        trueAnswrItem[radioIndex].getElementsByClassName("ant-radio-group ant-radio-group-outline")[0].children[3].click();
                        break;
                    case 'E':
                        console.log("第"+(radioIndex+1)+"题选","E");
                        trueAnswrItem[radioIndex].getElementsByClassName("ant-radio-group ant-radio-group-outline")[0].children[4].click();
                        break;
                }
                radioIndex++;
                examAnswerNew();
            } else {
                console.log('未找到答案');
                trueAnswrItem[radioIndex].getElementsByClassName("ant-radio-group ant-radio-group-outline")[0].children[1].click();
                radioIndex++;
                examAnswerNew();
            }
        }else{
            addMessage("考试完毕，提交后如满分需刷新一次网页（以避免该平台BUG");
            console.log('as1',as1);
            toggleOverlay(false);

            setTimeout(function(){
                console.log('提交-------');
                // document.querySelector("#primaryLayout > div:nth-child(1) > div:nth-child(1) > div.exam-wrapper > div > div > div > div > div.flex-1.exam-drawer-question > div > form > div.btnGroup > div > button.ant-btn.ant-btn-primary").click();
                setTimeout(function(){
                    // document.querySelector("body > div:nth-child(24) > div > div.ant-modal-wrap > div > div.ant-modal-content > div > div > div.ant-modal-confirm-btns > button.ant-btn.ant-btn-primary").click();
                    setTimeout(function(){
                        console.log('开始搜集-------');
                        // radioIndex = 0;
                        // examRadio();
                    },5000);
                },1500);
            },2000);
        }
    }

    function examAnswerRe(){
        if(radioIndex < examAllCount){
            let answer_key = trueAnswrItem[radioIndex].getAttribute('ques_key');

            console.log("radioIndex",radioIndex);

            if(!juTorF(radioIndex)){
                let trueAe = optionTrue(radioIndex);
                console.log("第",(radioIndex+1),"正确答案:",trueAe);
                if(saveAnswer(answer_key,trueAe)){
                    console.log("正确答案记录成功...");
                }else{
                    console.log("无需重复记录...");
                }
                radioIndex++;
                examAnswerRe();
            }else{
                console.log("第",(radioIndex+1),"题答案错误无需记录");
                trueAnswrItem[radioIndex].getElementsByClassName("ant-radio-group ant-radio-group-outline")[0].children[0].click();
                radioIndex++;
                examAnswerRe();
            }
        }else{
            console.log("单项搜集完毕...");
            let as1 = getAnswer();
            console.log(as1);
        }
    }

    function examAnswer(){
        let as1 = getAnswer();
        if(radioIndex < examAllCount){
            let answer_key = trueAnswrItem[radioIndex].getAttribute('ques_key');
            if(juTorF(radioIndex)){
                let result = as1.reduce((accumulator, obj) => {
                    if (answer_key in obj) {
                        return obj[answer_key];
                    }
                    return accumulator;
                }, undefined);

                console.log('result',result);

                if (result !== undefined) {
                    console.log(result);
                    switch(result)
                    {
                        case 'A':
                            console.log("第"+(radioIndex+1)+"题选","A");
                            trueAnswrItem[radioIndex].getElementsByClassName("ant-radio-group ant-radio-group-outline")[0].children[0].click();
                            break;
                        case 'B':
                            console.log("第"+(radioIndex+1)+"题选","B");
                            trueAnswrItem[radioIndex].getElementsByClassName("ant-radio-group ant-radio-group-outline")[0].children[1].click();
                            break;
                        case 'C':
                            console.log("第"+(radioIndex+1)+"题选","C");
                            trueAnswrItem[radioIndex].getElementsByClassName("ant-radio-group ant-radio-group-outline")[0].children[2].click();
                            break;
                        case 'D':
                            console.log("第"+(radioIndex+1)+"题选","D");
                            trueAnswrItem[radioIndex].getElementsByClassName("ant-radio-group ant-radio-group-outline")[0].children[3].click();
                            break;
                        case 'E':
                            console.log("第"+(radioIndex+1)+"题选","E");
                            trueAnswrItem[radioIndex].getElementsByClassName("ant-radio-group ant-radio-group-outline")[0].children[4].click();
                            break;
                    }
                    radioIndex++;
                    examAnswer();
                } else {
                    console.log('未找到对应的对象');
                    addMessage("抱歉，第"+(radioIndex+1)+"题为找到答案");
                }
            }else{
                console.log("第"+(radioIndex+1)+"题正确无需重复作答");
                radioIndex++;
                examAnswer();
            }
        }else{
            console.log("纠错完毕");
            ddds3.children().remove();
            addMessage("已完成纠错，请提交，提交后需刷新一次网页（以避免该平台BUG）");
            console.log('as1',as1);
            toggleOverlay(false);
            //document.querySelector("body > div:nth-child(24) > div > div.ant-modal-wrap > div > div.ant-modal-content > div > div > div.ant-modal-confirm-btns > button.ant-btn.ant-btn-default").click();
        }
    }

    function optionTrue(radioIndex){
        var parentElement = trueAnswrItem[radioIndex].getElementsByClassName("ant-radio-group ant-radio-group-outline")[0];

        var childElement = trueAnswrItem[radioIndex].getElementsByClassName("ant-radio-group ant-radio-group-outline")[0].getElementsByClassName("ant-radio-wrapper ant-radio-wrapper-checked ant-radio-wrapper-in-form-item")[0];

        var children = Array.from(parentElement.children);

        var index = children.indexOf(childElement);
        switch(index)
            {
                case 0:
                    return 'A';
                case 1:
                    return 'B';
                case 2:
                    return 'C';
                case 3:
                    return 'D';
                case 4:
                    return 'E';
                case 5:
                    return 'F';
                default:
                    console.log("未知题型，需更新！");
                    return '未知';
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

    var overlay = null;
    function toggleOverlay(show) {
        if (show) {
            overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            overlay.style.zIndex = '9999';

            overlay.addEventListener('click', function(event) {
                event.stopPropagation();
                event.preventDefault();
            });

            document.body.appendChild(overlay);
        } else {
            if (overlay) {
                overlay.parentNode.removeChild(overlay);
                overlay = null;
            }
        }
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
        var ddds2 = $('<div style="position: absolute;top: 73%;width:94%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;">操作\uff1a<button id="goExam" style="position: absolute;width:80px;right: 248px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">开始考试</button><button id="reExam" style="position: absolute;width:80px;right: 154px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">重新考试</button><button id="goGetExam" style="position: absolute;width:48px;right: 100px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">搜集</button><button id="speedxgone" style="position: absolute;width:88px;right: 8px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">清空缓存</button></div>');
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

        $("#goExam").on('click',function(){
            toggleOverlay(true);
            ddds3.children().remove();
            addMessage("当前禁止点击，请不要关闭页面");
            addMessage("开始考试(10s~20s)，请耐心等待。。。");
            setTimeout(function(){
                radioIndex = 0;
                examAnswerNew();
            },800);
        });

        $("#reExam").on('click',function(){
            toggleOverlay(true);
            ddds3.children().remove();
            addMessage("当前禁止点击，请不要关闭页面");
            addMessage("开始重考(10s~20s)，请耐心等待。。。");
            setTimeout(function(){
                radioIndex = 0;
                examAnswer();
            },800);
        });

        $("#goGetExam").on('click',function(){
            toggleOverlay(true);
            ddds3.children().remove();
            addMessage("当前禁止点击，请不要关闭页面");
            addMessage("开始搜集，请稍后。。。");
            setTimeout(function(){
                try{
                    radioIndex = 0;
                    examRadio();
                }catch(e){
                    ddds3.children().remove();
                    addMessage("违规操作，请刷新后重试");
                    console.log(e);
                    toggleOverlay(false);
                }
            },800);
        });

        $("#speedxgone").on('click',function(){
            GM_deleteValue("courseId");
            GM_deleteValue("answerList");
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



    var dataAW = [{"b3JrlX3Q":"D"},{"eDqwWqZE":"A"},{"64E7bQ39":"C"},{"p4jVwg4l":"E"},{"QD8LYMDl":"C"},{"74rkYyZQ":"C"},{"m4mzV6ZN":"A"},{"e3AJKVDr":"C"},{"B3y8XLZ0":"B"},{"g4GGjk4O":"C"},{"AZ7YwPDk":"E"},{"x41m9941":"D"},{"OZaXaB4z":"E"},{"94nOb0ZK":"E"},{"v4NNJB4x":"B"},{"w3OwBw3e":"E"},{"VZMGQVDq":"A"},{"VZMGdoDq":"C"},{"g4GG1g4O":"B"},{"l49kPq3L":"E"},{"b3Jr9z3Q":"E"},{"QDBBzjD9":"D"},{"0DKyKjZQ":"B"},{"eDqwJAZE":"B"},{"QZVJvaZj":"D"},{"6DWBWe3G":"C"},{"64E7g939":"B"},{"x41mLM41":"C"},{"m4mzPnZN":"E"},{"v4NNVE4x":"C"},{"M3lwz6ZP":"A"},{"GDzzwLDN":"C"},{"j3kRanZW":"D"},{"b3Jrvz3Q":"C"},{"QDBBdjD9":"C"},{"y30mqKDJ":"A"},{"0DKyYjZQ":"B"},{"eDqwVAZE":"C"},{"QD8L7ADl":"E"},{"0ZvaYO4J":"E"},{"QD8LdjDl":"A"},{"R3xWyoZY":"E"},{"m4mzdnZN":"A"},{"eDqwq6ZE":"A"},{"WZRPOkDp":"A"},{"q3QKO04N":"A"},{"VD6yRW3p":"C"},{"R3xWXpZY":"E"},{"0Zva8N4J":"C"},{"6DWBOy3G":"E"},{"e3AJRlDr":"B"},{"MZgok8Zy":"D"},{"w3Owax3e":"E"},{"QDBmqj39":"B"},{"M3lw6WZP":"E"},{"WZRPdqDp":"A"},{"OZaXly4z":"B"},{"JZeGOlDd":"D"},{"GDzzVjDN":"E"},{"94nOmxZK":"D"},{"j3kRemZW":"A"},{"b3JrRR3Q":"E"},{"0DKyR8ZQ":"C"},{"OZaXm84z":"C"},{"0DKjEq3Q":"B"},{"7ZX0lOZb":"D"},{"7ZX0XNZb":"C"},{"GDzzQmDN":"A"},{"7ZXo2w4b":"B"},{"eDqlae3E":"D"},{"eDqwNXZE":"C"},{"p4jGNdZl":"B"},{"q3QrGkDN":"E"},{"y30mQxDJ":"A"},{"0DKyVMZQ":"D"},{"AD5maeDr":"D"},{"64EGd139":"D"},{"r4L76MDL":"E"},{"B3yNAmD0":"E"},{"VDozjq3B":"D"},{"JZeaQWZd":"E"},{"GZpY7M3J":"C"},{"b3Jr183Q":"A"},{"GZpY783J":"C"},{"0DKyeNZQ":"E"},{"a4wrlWDJ":"A"},{"p4jVyb4l":"A"},{"QD8L8rDl":"B"},{"0ZvaGa4J":"A"},{"64E7eQ39":"D"},{"e3AJLVDr":"C"},{"OZaXoB4z":"B"},{"a4PMRlZr":"A"},{"e3AJAoDr":"A"},{"MZga5jDy":"B"},{"yDdrvEZr":"A"},{"M3lw8jZP":"D"},{"l49koq3L":"E"},{"a4PManZr":"E"},{"MZgaqRDy":"C"},{"a4PejWZr":"C"},{"a4wp8QZJ":"B"},{"QD8x6QDl":"B"},{"b3JK0RDQ":"A"},{"q3Q89BZN":"B"},{"74rz9V4Q":"C"},{"0DKXJE4Q":"A"},{"6DWGweDG":"D"},{"Q3Yp8jZ9":"A"},{"AD5lXB3r":"C"},{"64EEy949":"A"},{"64EEq249":"B"},{"r4LeQRZL":"A"},{"53bzRQ3N":"B"},{"x41V69Z1":"D"},{"R3xgwdZY":"D"},{"74rzaj4Q":"D"},{"R3xgooZY":"D"},{"6DWGdjDG":"B"},{"Q3YpBBZ9":"C"},{"v4NXJE3x":"A"},{"g4Geky3O":"C"},{"AZ7bAB4k":"B"},{"WZRXLvDp":"B"},{"JZez6P3d":"B"},{"GDzJrLDN":"D"},{"G32EeLZa":"A"},{"e3Aoy94r":"D"},{"w3OrKmZe":"A"},{"yDdzQ1Zr":"A"},{"QDBjKlD9":"D"},{"GZpNQ5DJ":"D"},{"a4wpnQZJ":"D"},{"p4j0en3l":"B"},{"yDdz65Zr":"D"},{"0DKXbE4Q":"D"},{"eDqb694E":"C"},{"QZVnM0Zj":"A"},{"r4Le2QZL":"D"},{"VD6N2vDp":"B"},{"y30Vrj4J":"A"},{"l49xKyDL":"B"},{"Q3YpEpZ9":"C"},{"e3Ao2k4r":"D"},{"a4wpPXZJ":"C"},{"WZRXJkDp":"A"},{"VD6NXWDp":"B"},{"j3kb6nZW":"B"},{"a4PelzZr":"B"},{"b3JKRzDQ":"B"},{"QDBjRjD9":"C"},{"g4Ge0Q3O":"D"},{"M3lEaeDP":"C"},{"l49xRkDL":"A"},{"GZpNpQDJ":"B"},{"VZMe1MZq":"C"},{"M3lEWzDP":"A"},{"l49xRNDL":"D"},{"GDzJYmDN":"D"},{"QD8xRBDl":"D"},{"53bzVx3N":"B"},{"G32EvbZa":"C"},{"e3Aokv4r":"C"},{"VZMewlZq":"B"},{"r4LeJmZL":"C"},{"AZ7bQV4k":"D"},{"WZRXrPDp":"C"},{"JZezjl3d":"D"},{"G32EY7Za":"D"},{"MZgG0bZy":"D"},{"7ZXPLwZb":"B"},{"G32EwlZa":"D"},{"7ZXPMkZb":"C"},{"94nENeDK":"A"},{"64EEB149":"A"},{"x41VrgZ1":"B"},{"QDBjYAD9":"D"},{"l49xMrDL":"C"},{"e3Aoqv4r":"A"},{"QZVnLNZj":"B"},{"w3OrL0Ze":"B"},{"g4Geoe3O":"B"},{"VDoEAxZB":"C"},{"VDoEbPZB":"C"},{"a4PeyjZr":"C"},{"GZpNEJDJ":"C"},{"yDdzVmZr":"D"},{"b3JKk6DQ":"C"},{"M3lE7ODP":"B"},{"l49xgnDL":"D"},{"GZpNggDJ":"C"},{"QZVnaXZj":"D"},{"p4j0vg3l":"C"},{"JZezRQ3d":"B"},{"VDoEqLZB":"B"},{"R3xgGJZY":"C"},{"0ZvPBMDJ":"B"},{"64EEWz49":"A"},{"VZMeXoZq":"D"},{"a4PebnZr":"B"},{"b3JMnyZQ":"A"},{"eDqGlAZE":"A"},{"MZg2gP4y":"A"},{"l49Qyn4L":"A"},{"w3Oez94e":"A"},{"a4P9GjZr":"A"},{"94nJvY4K":"A"},{"VD6Kko4p":"A"},{"yDdGrL3r":"A"},{"b3JMLyZQ":"A"},{"B3yB0eD0":"A"},{"64EM7949":"A"},{"l49QKe4L":"A"},{"a4P9VzZr":"A"},{"e3Av7bDr":"A"},{"y30klJZJ":"A"},{"MZg2Yb4y":"A"},{"eDqGwAZE":"A"},{"e3Av8oDr":"A"},{"q3QzBQDN":"A"},{"94nJPo4K":"A"},{"B3yBzmD0":"B"},{"y30krEZJ":"C"},{"QDBxQAZ9":"B"},{"r4Lz5L3L":"D"},{"w3OeN94e":"D"},{"a4wWR64J":"E"},{"a4P9VjZr":"D"},{"r4LzPO3L":"D"},{"QDBxOMZ9":"D"},{"R3xA9rDY":"D"},{"GZpbzQDJ":"D"},{"l49QlN4L":"C"},{"64EM0z49":"D"},{"VDolQL4B":"B"},{"JZenPa3d":"D"},{"p4j8Gd3l":"D"},{"yDdGoL3r":"B"},{"VZMznM3q":"B"},{"JZenqk3d":"D"},{"7ZX5k53b":"B"},{"7ZX5aL3b":"B"},{"0ZvmoY4J":"C"},{"6DWMR1ZG":"D"},{"QDBxobZ9":"D"},{"VD6K7E4p":"B"},{"l49Qzy4L":"D"},{"M3lRjY4P":"C"},{"53bJrN3N":"D"},{"y30kmKZJ":"E"},{"53bJR03N":"E"},{"l49QOy4L":"B"},{"B3yBYeD0":"E"},{"Q3Y9gk39":"B"},{"7ZX5pk3b":"B"},{"0DKzdl3Q":"D"},{"a4P97WZr":"E"},{"AD58JJ3r":"B"},{"MZg2gL4y":"B"},{"a4P9jWZr":"D"},{"QZV28XZj":"B"},{"64EMWv49":"D"},{"Q3Y9N939":"E"},{"QDBxYAZ9":"C"},{"7ZX5Ww3b":"D"},{"j3koGk3W":"C"},{"WZRMNP4p":"C"},{"VZMzGQ3q":"D"},{"R3xAWoDY":"D"},{"l49QOr4L":"D"},{"m4mkq23N":"D"},{"AD58713r":"D"},{"JZenjl3d":"B"},{"yDdGXj3r":"D"},{"AZ7MABDk":"C"},{"0DKzJE3Q":"B"},{"M3lR9O4P":"B"},{"e3AvWyDr":"B"},{"m4mk773N":"D"},{"JZen2a3d":"B"},{"53bJ7y3N":"E"},{"VZMzKl3q":"C"},{"7ZX5ow3b":"E"},{"7ZX5o83b":"B"},{"Q3Y9wM39":"D"},{"a4wWX74J":"E"},{"a4wWJX4J":"C"},{"MZg2JX4y":"C"},{"QD8l9LDl":"E"},{"B3yB7VD0":"D"},{"q3Qzq1DN":"E"},{"0DKzkR3Q":"C"},{"QZV2eaZj":"C"},{"GZpbLbDJ":"D"},{"OZadXo4z":"B"},{"AD58mB3r":"C"},{"j3ko9n3W":"E"},{"0Zvmx04J":"B"},{"b3JM0XZQ":"C"},{"eDqGdqZE":"C"},{"0ZvLpNDJ":"D"},{"5MZg83y1":"C"},{"GZplANZJ":"A"},{"64EP1vD9":"D"},{"d53bJN3N":"C"},{"6DWnv63G":"B"},{"y30jVr4J":"C"},{"j3kwYp3W":"B"},{"q3QKE14N":"A"},{"MZgarLDy":"D"},{"jw3Og3eN":"C"},{"q3Q1g03N":"D"},{"QDBMwX39":"D"},{"AD5oVLZr":"B"},{"8R3xJV4Y":"C"},{"oQZVraZj":"B"},{"jw3Oeg4e":"C"},{"JM3l64Pl":"C"},{"M3ljEG4P":"A"},{"6DW8Ky4G":"A"},{"OZaYKnZz":"C"},{"g4Ggom4O":"A"},{"GZpl8JZJ":"D"},{"5MZg284y":"D"},{"dVD6vDp0":"A"},{"mr4LQZL7":"B"},{"a4PLe84r":"B"},{"GZpz6lDJ":"A"},{"VD6obo4p":"C"},{"JZeYLaZd":"B"},{"0ZvL6YDJ":"B"},{"94nqYeDK":"D"},{"VZMK5nDq":"A"},{"94nOyeZK":"C"},{"aJZe9WZd":"B"},{"QB3yvmD0":"C"},{"zG32JR3a":"D"},{"QB3yBwD0":"D"},{"y30j7r4J":"C"},{"a4PGdYDr":"B"},{"64E7Vz39":"D"},{"0ZvaqM4J":"D"},{"R3xWw0ZY":"A"},{"v64Ew139":"B"},{"aJZenX3d":"D"},{"wQD8lADl":"C"},{"yDdBz1Zr":"D"},{"AZ7edPDk":"C"},{"QD8vPQZl":"C"},{"94nNz24K":"D"},{"MZgYwLDy":"B"},{"WZRNBxZp":"C"},{"v4NkE7Zx":"D"},{"6DW8294G":"C"},{"G32mQGZa":"D"},{"MZga1LDy":"D"},{"w3OwWm3e":"B"},{"G32mGGZa":"C"},{"GZpYyJ3J":"D"},{"WZRPWxDp":"D"},{"g4GGXm4O":"A"},{"0Zvrr2ZJ":"D"},{"0DKkXnDQ":"A"},{"QDBYjl39":"B"},{"v4NzQV4x":"D"},{"e3AGeK4r":"B"},{"p4j5rmDl":"C"},{"7ZXWKb4b":"A"},{"w3O1P24e":"C"},{"VZMKPnDq":"D"},{"a4PGyYDr":"A"},{"w3O1L94e":"C"},{"r4L7rnDL":"D"},{"94nOdYZK":"D"},{"oVDoOvDB":"C"},{"q7ZXQ83b":"A"},{"OAZ7M1Dk":"B"},{"mr4LzQ3L":"B"},{"7GDzLZNM":"A"},{"Xl49k3LV":"A"},{"m4mjrEZN":"C"},{"JZe0pB4d":"A"},{"l49vpzZL":"A"},{"r4Ll8R4L":"A"},{"B3yzJeD0":"D"},{"a4wMgX3J":"B"},{"7ZX8XkZb":"B"},{"a4PGpPDr":"B"},{"w3O1g94e":"A"},{"Q3Ynb9D9":"C"},{"QDBMVA39":"D"},{"Q3YnP9D9":"A"},{"y30YQJDJ":"C"},{"eDqzoe4E":"D"},{"AZ7Y5BDk":"A"},{"v4NNvO4x":"A"},{"JZeGykDd":"A"},{"jm4mXdDN":"A"},{"XeDq9eDE":"D"},{"ka4PQjZr":"D"},{"y30mraDJ":"D"},{"b3Jr7w3Q":"A"},{"b3JrVj3Q":"A"},{"l49kK03L":"A"},{"eDqwPxZE":"C"},{"r4L7lRDL":"A"},{"v4NNgE4x":"A"},{"yDdrn8Zr":"C"},{"g4GGPP4O":"D"},{"m4mzGnZN":"D"},{"64E7L939":"D"},{"QDBBWKD9":"A"},{"0DKydNZQ":"B"},{"b3Jrgj3Q":"D"},{"QZVJ8KZj":"C"},{"OZaXNG4z":"A"},{"m4mz7EZN":"C"},{"JZeG0BDd":"D"},{"p4jV5m4l":"A"},{"QDBBYxD9":"C"},{"w3Ow1p3e":"A"},{"VD6yQO3p":"C"},{"74rkbmZQ":"D"},{"yDdrX8Zr":"D"},{"VDozq83B":"D"},{"j3kR0RZW":"A"},{"QDBBQlD9":"D"},{"WZRPNBDp":"B"},{"v4NNkJ4x":"B"},{"0DKy7jZQ":"A"},{"yDdrpEZr":"D"},{"AD5m7wDr":"C"},{"GDzzYPDN":"C"},{"v4NN0K4x":"C"},{"r4L7wMDL":"A"},{"QD8LejDl":"B"},{"p4jVAQ4l":"B"},{"v4NN9z4x":"B"},{"a4PMj8Zr":"A"},{"R3xWzdZY":"D"},{"b3Jrnj3Q":"D"},{"64E7WX39":"B"},{"Q3YYN239":"D"},{"a4wr05DJ":"D"},{"yDdrN8Zr":"D"},{"GZpYVM3J":"D"},{"a4PMjVZr":"C"},{"VDoz7J3B":"B"},{"64E7m239":"A"},{"74rkjVZQ":"A"},{"v4NNnK4x":"D"},{"R3xWBGZY":"D"},{"0Zvada4J":"A"},{"a4PMKlZr":"A"},{"j3kRB6ZW":"C"},{"g4GGzk4O":"D"},{"AD5mvwDr":"B"},{"94nOGxZK":"D"},{"M3lwWWZP":"D"},{"w3OwGz3e":"B"},{"q3QKqe4N":"D"},{"VDozQ83B":"A"},{"94nOvxZK":"B"},{"v4NN5V4x":"A"},{"e3AJGKDr":"B"},{"0DKyknZQ":"A"},{"a4PMGRZr":"D"},{"VDozpb3B":"C"},{"QD8LOADl":"A"},{"a4PMJzZr":"C"},{"B3y807Z0":"D"},{"7ZX0pmZb":"C"},{"QDBBnwD9":"C"},{"x41mGG41":"D"},{"6DWBPo3G":"C"},{"0ZvaAa4J":"D"},{"yDdrXEZr":"C"},{"QDBBkKD9":"B"},{"v4NN7z4x":"D"},{"Q3YYB239":"D"},{"53brAl3N":"B"},{"M3lwAWZP":"D"},{"R3xW7vZY":"D"},{"VD6yWN3p":"C"},{"6DWBj03G":"C"},{"p4jVBQ4l":"A"},{"MZgageDy":"B"},{"y30mlrDJ":"D"},{"yDdrN1Zr":"B"},{"6DWBn63G":"C"},{"a4wrGaDJ":"B"},{"b3Jr7G3Q":"D"},{"B3y8VwZ0":"A"},{"b3JrLz3Q":"B"},{"0DKynNZQ":"A"},{"JZeGggDd":"A"},{"e3AJzVDr":"B"},{"r4L7JWDL":"D"},{"QDBBkwD9":"D"},{"x41mPk41":"A"},{"7ZX09mZb":"B"},{"QD8LarDl":"E"},{"r4L7aMDL":"B"},{"94nO60ZK":"D"},{"64E7Or39":"D"},{"OZaXxo4z":"D"},{"l49kq03L":"A"},{"6DWo9lDG":"E"},{"r4L7EQDL":"E"},{"MZgaQeDy":"A"},{"OZaXpG4z":"C"},{"MZgal6Dy":"B"},{"v4NNRq4x":"D"},{"e3AJYoDr":"E"},{"QDBmqO39":"B"},{"yDdobw3r":"E"},{"VZMGyQDq":"A"},{"MZgaN8Dy":"A"},{"eDqw1XZE":"D"},{"M3lwbGZP":"D"},{"G32mKXZa":"D"},{"g4GGRQ4O":"E"},{"x41mR541":"D"},{"w3OwAw3e":"C"},{"VD6y5v3p":"B"},{"VDoz9b3B":"C"},{"AD5meBDr":"C"},{"AD5mPeDr":"E"},{"eDqwEXZE":"E"},{"0Zva0w4J":"D"},{"0DKyAnZQ":"C"},{"l49k8z3L":"C"},{"a4PMlRZr":"E"},{"64E7A539":"C"},{"y30mwPDJ":"D"},{"GZpYvg3J":"B"},{"VDozK13B":"C"},{"l49VENZL":"D"},{"x41mKG41":"D"},{"B3y8P7Z0":"C"},{"l49kqq3L":"A"},{"yDdrjEZr":"E"},{"G32md9Za":"D"},{"VDoz283B":"B"},{"VD6yaN3p":"D"},{"JZeG5pDd":"D"},{"q3QKQq4N":"B"},{"OZaXEN4z":"E"},{"B3y8eEZ0":"A"},{"Q3YYAM39":"C"},{"7ZX0NBZb":"D"},{"VD6yvK3p":"A"},{"53brOx3N":"A"},{"Q3YoXy49":"B"},{"94nOBpZK":"A"},{"M3lwp6ZP":"C"},{"r4L7XQDL":"C"},{"74rkBxZQ":"E"},{"MZgaBjDy":"D"},{"GDzzLPDN":"A"},{"GZpYm83J":"A"},{"a4PMAlZr":"E"},{"53brKl3N":"E"},{"a4wr9aDJ":"C"},{"y30mR1DJ":"B"},{"q3QKlz4N":"C"},{"6DWBA13G":"A"},{"QZVJGNZj":"A"},{"l49k5r3L":"C"},{"94nOQGZK":"A"},{"R3xWQmZY":"E"},{"AZ7Y1VDk":"B"},{"r4LqMoZL":"A"},{"w3Ow6g3e":"D"},{"l49kek3L":"C"},{"R3xWVoZY":"C"},{"QDBBvKD9":"E"},{"a4PMA8Zr":"D"},{"j3kbdnZW":"D"},{"MZgGRRZy":"A"},{"M3lE2eDP":"C"},{"AD5lnE3r":"A"},{"g4Ge1r3O":"C"},{"y30Ve14J":"D"},{"7ZXPv5Zb":"B"},{"94nEa9DK":"A"},{"B3ydRzZ0":"B"},{"eDqbxq4E":"D"},{"yDdzXrZr":"D"},{"VD6NzoDp":"C"},{"JZezJW3d":"C"},{"6DWGElDG":"D"},{"q3Q8QkZN":"C"},{"a4wp5VZJ":"D"},{"p4j0ld3l":"A"},{"w3OrBgZe":"B"},{"AZ7b6P4k":"D"},{"w3OrjxZe":"A"},{"w3OrVwZe":"D"},{"x41VObZ1":"A"},{"7ZXPMBZb":"D"},{"MZgGALZy":"A"},{"r4LeWnZL":"D"},{"q3Q8W1ZN":"D"},{"yDdzdwZr":"C"},{"JZezlW3d":"D"},{"y30VRo4J":"B"},{"OZaQvoZz":"A"},{"x41V2MZ1":"C"},{"QDBj2jD9":"B"},{"M3lEPGDP":"A"},{"VDoEJJZB":"B"},{"a4wpbaZJ":"A"},{"64EEJ749":"D"},{"0ZvPObDJ":"D"},{"l49x9rDL":"A"},{"Q3YpwMZ9":"B"},{"l49xMyDL":"B"},{"OZaQq8Zz":"B"},{"74rzWP4Q":"D"},{"b3JKVyDQ":"A"},{"l49xWeDL":"B"},{"y30V5E4J":"D"},{"w3Ory9Ze":"B"},{"q3Q81LZN":"C"},{"53bz7g3N":"A"},{"Q3YpyyZ9":"B"},{"M3lEVYDP":"D"},{"v4NXj83x":"D"},{"R3xgXVZY":"D"},{"eDqbge4E":"B"},{"64EE2949":"D"},{"QD8xMADl":"A"},{"y30VGK4J":"C"},{"VD6NqvDp":"D"},{"WZRXQWDp":"B"},{"v4NXxq3x":"C"},{"a4wpNYZJ":"A"},{"7ZXPROZb":"C"},{"QDBjogD9":"B"},{"y30VoP4J":"D"},{"GZpNxgDJ":"B"},{"y30VNP4J":"C"},{"a4PeKPZr":"D"},{"94nEKoDK":"C"},{"0DKXbl4Q":"C"},{"y30VWE4J":"D"},{"AZ7bGB4k":"D"},{"GDzJ5lDN":"D"},{"q3Q8MLZN":"C"},{"QDBjVOD9":"D"},{"M3lEvYDP":"D"},{"0ZvPknDJ":"C"},{"53bzpy3N":"C"},{"QDBjgOD9":"C"},{"0DKXRq4Q":"D"},{"eDqbgA4E":"C"},{"7ZXPl8Zb":"D"},{"GDzJnLDN":"D"},{"AD5lNB3r":"B"},{"VDoEnbZB":"D"},{"OZaQnyZz":"A"},{"0ZvP1bDJ":"B"},{"l49QVN4L":"B"},{"QDBxBjZ9":"A"},{"yDdGar3r":"E"},{"yDdGwr3r":"C"},{"AZ7MG8Dk":"D"},{"w3Oen24e":"A"},{"r4LzJm3L":"C"},{"AD58YJ3r":"D"},{"a4P9bnZr":"D"},{"AZ7MOxDk":"A"},{"yDdGa63r":"C"},{"q3Qzn0DN":"C"},{"QD8lkNDl":"A"},{"GZpbqNDJ":"B"},{"GZpbG5DJ":"A"},{"0ZvmzM4J":"D"},{"eDqG69ZE":"B"},{"QZV2aXZj":"C"},{"94nJqN4K":"E"},{"G32JY73a":"C"},{"AZ7M0BDk":"B"},{"yDdGNj3r":"B"},{"v4Nle73x":"A"},{"VZMzNn3q":"B"},{"a4P9LYZr":"B"},{"0ZvmEn4J":"B"},{"MZg2ob4y":"D"},{"G32JmR3a":"A"},{"QD8lLADl":"D"},{"j3koOB3W":"A"},{"y30kOPZJ":"E"},{"GZpbgNDJ":"B"},{"p4j89x3l":"E"},{"GDzm9m3N":"E"},{"M3lR0z4P":"A"},{"AD58v13r":"D"},{"53bJVx3N":"B"},{"OZad0l4z":"B"},{"l49QWe4L":"B"},{"v4Nl9O3x":"D"},{"VZMzYl3q":"A"},{"GZpbLQDJ":"B"},{"g4GyGr3O":"A"},{"yDdGR63r":"A"},{"g4Gydg3O":"C"},{"R3xAGJDY":"C"},{"b3JMLXZQ":"C"},{"eDqGd6ZE":"E"},{"w3OeGm4e":"E"},{"Q3Y9BB39":"B"},{"74r2aj4Q":"B"},{"QD8leLDl":"D"},{"QZV2g0Zj":"C"},{"QDBxWAZ9":"C"},{"g4Gy7m3O":"B"},{"MZg2KP4y":"B"},{"OZadgz4z":"E"},{"eDqGzeZE":"B"},{"y30kYoZJ":"E"},{"53bJjy3N":"D"},{"AZ7MY1Dk":"A"},{"6DWMBeZG":"E"},{"VDolzb4B":"B"},{"GZpbYbDJ":"C"},{"Q3Y9RM39":"D"},{"0DKz9o3Q":"B"},{"GZpbggDJ":"B"},{"AZ7MQVDk":"D"},{"a4P9KPZr":"B"},{"QZV2j0Zj":"A"},{"v4Nl7O3x":"E"},{"q3QzR1DN":"C"},{"p4j8nz3l":"C"},{"a4wWPp4J":"C"},{"OZadAl4z":"A"},{"OZadNn4z":"D"},{"VDolAx4B":"A"},{"eDqzN94E":"A"},{"G32o6lDa":"C"},{"y30Y1JDJ":"A"},{"AZ7EP8Dk":"D"},{"r4LlLR4L":"B"},{"AD5mkJDr":"C"},{"py30xK3J":"B"},{"ka4P9zZr":"A"},{"GDzG2y4N":"A"},{"j3kwx53W":"D"},{"l49layDL":"C"},{"eDqwB9ZE":"B"},{"QOZaoDzp":"C"},{"e3AGmK4r":"B"},{"0ZvLkYDJ":"D"},{"74r7QBZQ":"B"},{"e3AJ99Dr":"C"},{"b3Jr8A3Q":"B"},{"y30mXJDJ":"A"},{"r6DWrl3G":"B"},{"7AD5B4rv":"C"},{"GDzoJJ4N":"A"},{"JZe07B4d":"B"},{"M3lnvO4P":"B"},{"AD5o2LZr":"B"},{"7ZX8LLZb":"C"},{"7ZX8LwZb":"C"},{"l49k6e3L":"A"},{"53bryG3N":"C"},{"eDqwyLZE":"B"},{"JZeGoaDd":"A"},{"mr4LGoDL":"A"},{"q0DKvq3Q":"C"},{"LVZMzQ3q":"C"},{"py30kKZJ":"C"},{"jm4mnZNq":"D"},{"B3yW6L40":"D"},{"w3Oy064e":"D"},{"B3yWGL40":"D"},{"AD5w9XZr":"C"},{"eDqzN64E":"C"},{"yDd2EmZr":"A"},{"JZeYbaZd":"D"},{"l49krn3L":"D"},{"b3Jrb63Q":"B"},{"74rmmODQ":"C"},{"5yDd0wDr":"A"},{"2e3AvkDr":"A"},{"bQ3Y9j39":"C"},{"wj3knZWy":"A"},{"0Zvogw3J":"A"},{"QZVWwx3j":"B"},{"VZMYlVZq":"C"},{"yDd2qjZr":"D"},{"e3AMqy3r":"A"},{"g4GGbA4O":"D"},{"VZMGr6Dq":"A"},{"GDzzNlDN":"B"},{"m4mzy7ZN":"A"},{"R3xWkrZY":"D"},{"r4L7jLDL":"D"},{"p4jzzQ4l":"D"},{"Jb3JNn3Q":"B"},{"W94nJp4K":"B"},{"jm4mkn3N":"B"},{"r6DWMeZG":"D"},{"Xl49Qk4L":"A"},{"2e3Ak4r9":"B"},{"Yp4jn4lQ":"B"},{"5GZpbDJP":"D"},{"MZgKGKZy":"D"},{"94nNE24K":"B"},{"OZagQGDz":"B"},{"WZRYXv4p":"C"},{"g4GYey3O":"A"},{"MZgKdKZy":"B"},{"g4GYBy3O":"D"},{"yDd2YrZr":"C"},{"VD6ykp3p":"D"},{"94nOK0ZK":"B"},{"e3AJ5KDr":"A"},{"AD5mwXDr":"D"},{"AZ7YAnDk":"D"},{"MZgagKDy":"B"},{"b3JrGG3Q":"B"},{"a4wrXQDJ":"C"},{"MZgaJjDy":"C"},{"w3OwnQ3e":"B"},{"a4wrzWDJ":"D"},{"r4L7BMDL":"B"},{"94nOqmZK":"B"},{"GZpYw83J":"D"},{"e3AJ7VDr":"A"},{"AZ7Y70Dk":"D"},{"q3QKWe4N":"D"},{"64E7Q239":"B"},{"m4mzjEZN":"D"},{"GDzzG2DN":"A"},{"AD5mYeDr":"D"},{"G32mORZa":"D"},{"g4GGnk4O":"D"},{"M3lw0BZP":"B"},{"53brVq3N":"D"},{"b3JrV83Q":"D"},{"b3Jrd83Q":"A"},{"w3OwKz3e":"D"},{"7ZX0vNZb":"B"},{"g4GG7y4O":"B"},{"B3y8WLZ0":"C"},{"QZVJWxZj":"C"},{"eDqwAxZE":"A"},{"GZpYlj3J":"B"},{"p4jV9b4l":"D"},{"MZgapjDy":"D"},{"JZeGjgDd":"B"},{"MZgaAeDy":"A"},{"l49kGz3L":"D"},{"AD5mAXDr":"B"},{"7ZX0WbZb":"B"},{"QZVJWJZj":"D"},{"G32mokZa":"D"},{"x41mOM41":"C"},{"l49kMq3L":"C"},{"m4mzq6ZN":"C"},{"QD8LkrDl":"A"},{"m4mzAzZN":"A"},{"GZpYVl3J":"D"},{"w3Owz63e":"D"},{"JZeG2BDd":"A"},{"Q3YYaA39":"B"},{"eDqw7xZE":"A"},{"53br2N3N":"A"},{"OZaXLB4z":"C"},{"WZRPnmDp":"A"},{"7ZX07mZb":"A"},{"MZgabjDy":"D"},{"MZgabeDy":"A"},{"74rkaOZQ":"B"},{"e3AJyMDr":"C"},{"x41mWk41":"D"},{"QZVJ8xZj":"C"},{"QDBBWlD9":"D"},{"a4wrRaDJ":"B"},{"R3xWrdZY":"B"},{"l49kvz3L":"A"},{"y30mOKDJ":"D"},{"G32mLBZa":"B"},{"VDozbB3B":"C"},{"a4PM7lZr":"D"},{"e3AJgMDr":"C"},{"G32EyqZa":"D"},{"VZMJVb3q":"C"},{"94n2om4K":"A"},{"x41YEq41":"A"},{"eDqbJq4E":"C"},{"6DWGx1DG":"D"},{"74rmE6DQ":"D"},{"Q3Yp2MZ9":"D"},{"QDBGEx49":"A"},{"WZR2zBZp":"B"},{"l49mBj4L":"A"},{"94nEBGDK":"B"},{"0ZvrbAZJ":"D"},{"MZgX2M3y":"A"},{"p4jzNR4l":"A"},{"53bzm03N":"A"},{"m4mRP8ZN":"A"},{"MZgXk63y":"A"},{"a4P2z63r":"D"},{"MZgGMRZy":"C"},{"M3lEzjDP":"A"},{"R3xgVJZY":"A"},{"r4LdGV4L":"C"},{"Q3YzXpD9":"A"},{"QZVnPkZj":"D"},{"eDqmrmDE":"D"},{"64EKwN39":"A"},{"VDomOqZB":"C"},{"w3ORoxZe":"D"},{"p4j0aR3l":"D"},{"GZpNXvDJ":"D"},{"w3OrbwZe":"A"},{"QD8qr54l":"D"},{"a4w2LMDJ":"A"},{"QDBGPx49":"B"},{"WZR2MWZp":"D"},{"VD6jKWDp":"D"},{"AD5EqEDr":"B"},{"l49xe8DL":"A"},{"x41VLbZ1":"D"},{"b3JK9XDQ":"C"},{"yDdzA6Zr":"D"},{"VZMJkR3q":"B"},{"AD5ELdDr":"B"},{"g4G8yQZO":"B"},{"QD8qw74l":"A"},{"OZaw8yDz":"D"},{"0ZvrRbZJ":"A"},{"q3Q2GzDN":"D"},{"VDomVVZB":"B"},{"R3xgyJZY":"C"},{"r4LeXOZL":"A"},{"QDBjzbD9":"D"},{"VZMeqoZq":"A"},{"VDomGqZB":"D"},{"MZgX8M3y":"A"},{"53b1ajZN":"B"},{"y30KxxZJ":"C"},{"eDqmGNDE":"D"},{"y30Kk1ZJ":"B"},{"yDdWG53r":"C"},{"Q3Yz9pD9":"A"},{"l49mE84L":"A"},{"yDdze5Zr":"A"},{"0ZvPX0DJ":"D"},{"p4j0Rg3l":"C"},{"p4jzb54l":"C"},{"GZpabj3J":"C"},{"G32AJLZa":"B"},{"R3xvAp4Y":"C"},{"0ZvrmbZJ":"A"},{"yDdWb53r":"C"},{"WZR2wWZp":"D"},{"e3AwXl4r":"B"},{"QDBjdgD9":"B"},{"a4PemnZr":"D"},{"AZ7bxx4k":"D"},{"64EEg549":"C"},{"AD5lea3r":"D"},{"OZaQxNZz":"D"},{"VDoEwPZB":"C"},{"QD8xaMDl":"B"},{"GZpa0j3J":"A"},{"yDdWGe3r":"C"},{"j3k9og4W":"C"},{"eDqmaNDE":"D"},{"7ZX12O3b":"A"},{"QZVnPNZj":"A"},{"QDBjdbD9":"B"},{"WZRXOaDp":"D"},{"WZRX8aDp":"A"},{"VD6N6KDp":"D"},{"JZezNQ3d":"A"},{"AD5lGa3r":"B"},{"q3Q2yqDN":"D"},{"M3lYGvDP":"B"},{"G32ArkZa":"B"},{"m4mmXJ4N":"D"},{"R3xvJQ4Y":"D"},{"l49mQ84L":"A"},{"w3OKWz3e":"D"},{"g4GPpyZO":"C"},{"j3kA2R4W":"D"},{"y30WyrZJ":"C"},{"VDoQR8ZB":"B"},{"G32WG9Da":"B"},{"MZgAreDy":"B"},{"VZM08V4q":"D"},{"6DWdb64G":"D"},{"64ExY2D9":"D"},{"l49Wrz3L":"B"},{"a4PXrV4r":"B"},{"e3AyQK3r":"C"},{"GZpQel3J":"A"},{"a4PXqV4r":"D"},{"AD5YyXDr":"B"},{"VD6WnN4p":"B"},{"7ZXkdN4b":"A"},{"QDBlrlZ9":"D"},{"VZM09V4q":"B"},{"r4LBQM3L":"B"},{"6DWdQ64G":"C"},{"e3Ay0M3r":"C"},{"q3Qqve3N":"B"},{"b3Jdb84Q":"D"},{"eDq5yxDE":"A"},{"b3JdWG4Q":"C"},{"R3xJ604Y":"B"},{"AZ7nqB4k":"D"},{"R3x7wvZY":"C"},{"AZ7A6nDk":"C"},{"v4N9dVDx":"C"},{"r4LBpR3L":"B"},{"Q3YBjAD9":"D"},{"74raMVDQ":"C"},{"VDoQMJZB":"D"},{"p4jAMmDl":"C"},{"b3JdbG4Q":"C"},{"q3Qq0E3N":"B"},{"7ZXkwb4b":"B"},{"w3OKjp3e":"A"},{"v4N9wJDx":"B"},{"m4mAgz4N":"C"},{"yDdn81Zr":"C"},{"a4PXr84r":"C"},{"Q3YBvAD9":"D"},{"p4jAmmDl":"D"},{"B3y7lL40":"D"},{"b3JdWw4Q":"B"},{"74raNODQ":"C"},{"R3x70dZY":"B"},{"B3y79L40":"B"},{"R3x7ldZY":"D"},{"VD6WPp4p":"C"},{"JZeAMBZd":"D"},{"a4wQaa3J":"D"},{"GZpQMl3J":"D"},{"JZe9kkZd":"C"},{"M3lAkWDP":"B"},{"64Ex9XD9":"B"},{"v4N9KVDx":"D"},{"y30WyxZJ":"C"},{"j3kA1Y4W":"B"},{"OZaAnpZz":"D"},{"r4LGVnDL":"D"},{"VZM0rj4q":"C"},{"v4N9vzDx":"C"},{"p4jAYQDl":"C"},{"M3lAyGDP":"A"},{"AZ7A9PDk":"A"},{"QD8eKQ4l":"C"},{"a4wQBa3J":"D"},{"yDdnM1Zr":"B"},{"QDBlbxZ9":"A"},{"M3lAavDP":"C"},{"G32WBkDa":"C"},{"AD5YjeDr":"A"},{"MZgArKDy":"D"},{"94nvy24K":"A"},{"GDzWNJ4N":"C"},{"WZRVWvZp":"B"},{"r4LB0R3L":"C"},{"MZgAeKDy":"B"},{"x41W1931":"C"},{"53bAMEZN":"D"},{"MZgAnKDy":"B"},{"a4PXBV4r":"D"},{"l49Wdj3L":"D"},{"VZM0bR4q":"C"},{"QDBlJKZ9":"A"},{"VD6W0p4p":"D"},{"64Ex82D9":"D"},{"QZVgVx3j":"A"},{"7ZXkdb4b":"B"},{"0DKJwn3Q":"D"},{"G32WgXDa":"B"},{"0ZvQJw4J":"C"},{"q3QqVE3N":"C"},{"53bAeEZN":"D"},{"M3lAeGDP":"B"},{"GZpQaQ3J":"A"},{"yDdnWwZr":"D"},{"y30WjEZJ":"D"},{"l49WkN3L":"A"},{"VD6Wjl4p":"A"},{"G32W9lDa":"A"},{"QZVgQp3j":"C"},{"g4GP8eZO":"C"},{"w3OKR03e":"C"},{"JZeAaaZd":"C"},{"64ExK1D9":"B"},{"OZaAwzZz":"E"},{"7ZXka54b":"C"},{"GZpQLJ3J":"A"},{"64ExGvD9":"A"},{"AD5YxLDr":"B"},{"0DKJGE3Q":"B"},{"j3kA9k4W":"B"},{"b3Jd7A4Q":"D"},{"MZgAaPDy":"E"},{"AD5YE2Dr":"D"},{"j3kAy54W":"B"},{"m4mAL74N":"E"},{"VD6WMo4p":"D"},{"6DWdo94G":"C"},{"7ZXk1w4b":"A"},{"QZVgJp3j":"C"},{"0ZvQrn4J":"A"},{"GDzWRl4N":"A"},{"w3OKq93e":"A"},{"p4jAV1Dl":"C"},{"GZpQYJ3J":"A"},{"0DKJyq3Q":"C"},{"QDBlBOZ9":"B"},{"GZpQYQ3J":"C"},{"74ramqDQ":"E"},{"r4LBqL3L":"C"},{"m4mAmd4N":"E"},{"b3Jdpn4Q":"A"},{"VZM0on4q":"D"},{"y30WmoZJ":"A"},{"yDdnrwZr":"D"},{"a4PXMj4r":"E"},{"JZeAwWZd":"A"},{"GDzWaG4N":"B"},{"l49Wve3L":"A"},{"MZgAoPDy":"B"},{"Q3YBo9D9":"D"},{"7ZXk0w4b":"B"},{"j3kARk4W":"C"},{"6DWdYl4G":"D"},{"QD8eqB4l":"D"},{"53bA1yZN":"D"},{"a4PXVY4r":"A"},{"94nvRe4K":"C"},{"r4LBdo3L":"C"},{"e3AyJv3r":"E"},{"R3x7vVZY":"D"},{"eDq5meDE":"D"},{"VDoQzxZB":"D"},{"53bArgZN":"D"},{"yDdnrmZr":"A"},{"B3y7am40":"A"},{"l49WmN3L":"B"},{"QDBlYXZ9":"E"},{"WZRVoxZp":"C"},{"x41W0m31":"E"},{"B3y7Nd40":"A"},{"g4GPvmZO":"A"},{"a4wQr63J":"B"},{"7ZXk0L4b":"D"},{"QDBlBAZ9":"E"},{"w3OKw03e":"B"},{"x41WYg31":"B"},{"Q3YBzyD9":"E"},{"0DKJgq3Q":"C"},{"y30WKoZJ":"A"},{"QDBlGOZ9":"C"},{"eDq5weDE":"D"},{"v4N9N8Dx":"E"},{"AZ7A8aDk":"A"},{"a4PX2j4r":"B"},{"M3lALODP":"B"},{"0DKJyR3Q":"C"},{"p4jAzdDl":"C"},{"yDdnBjZr":"B"},{"y30WmJZJ":"D"},{"OZaAXzZz":"B"},{"a4wQ2V3J":"D"},{"OZaAznZz":"C"},{"0ZvQaY4J":"B"},{"74rakBDQ":"A"},{"q3QqKL3N":"B"},{"b3Jdr64Q":"A"},{"WZRVPPZp":"C"},{"WZRV2PZp":"D"},{"GDzWzG4N":"C"},{"v4N9M7Dx":"B"},{"M3lAwYDP":"B"},{"VDoQmvZB":"B"},{"w3OwPz3e":"E"},{"w3Owg63e":"A"},{"7ZX0VbZb":"D"},{"l49k1y3L":"D"},{"7ZXo284b":"A"},{"j3kRX6ZW":"A"},{"53brWQ3N":"C"},{"g4GGlj4O":"C"},{"a4wmvV3J":"C"},{"OZaX5o4z":"D"},{"yDdrgEZr":"C"},{"QZVJkKZj":"D"},{"WZRPlWDp":"A"},{"B3y8qzZ0":"A"},{"eDqwnNZE":"A"},{"q3QKkQ4N":"C"},{"G32mjRZa":"A"},{"VDozwB3B":"C"},{"VD6y9N3p":"B"},{"0DKy56ZQ":"A"},{"WZRPKaDp":"B"},{"yDdr96Zr":"B"},{"VDoLVv4B":"E"},{"74rkOOZQ":"D"},{"7ZX0LPZb":"E"},{"M3lwJjZP":"D"},{"WZRPAaDp":"B"},{"64E7X939":"B"},{"AD5mWBDr":"D"},{"QZVJPaZj":"A"},{"q3QKjB4N":"D"},{"VDozgb3B":"C"},{"y30m2aDJ":"D"},{"R3xW5GZY":"C"},{"0Zvap24J":"E"},{"m4mzxzZN":"B"},{"WZRP5vDp":"A"},{"6DWBq63G":"D"},{"yDdrl5Zr":"C"},{"j3kRlgZW":"E"},{"AD5mREDr":"A"},{"m4mzB8ZN":"B"},{"M3lwBzZP":"A"},{"AZ7Xra3k":"C"},{"b3JywnZQ":"D"},{"eDqlaA3E":"D"},{"y30BvK4J":"E"},{"a4PMwzZr":"A"},{"w3OwlQ3e":"A"},{"0DKye6ZQ":"B"},{"74rkLOZQ":"D"},{"y30m0rDJ":"A"},{"p4jVX54l":"E"},{"VZMGAoDq":"C"},{"R3xW1JZY":"A"},{"x41mn241":"C"},{"g4GGJr4O":"D"},{"e3AJakDr":"A"},{"JZeGdgDd":"D"},{"Q3YY2n39":"C"},{"JZeGWgDd":"A"},{"eDqw1JZE":"C"},{"m4mzEzZN":"A"},{"a4PMp8Zr":"A"},{"v4NNaz4x":"C"},{"AZ7YzeDk":"E"},{"6DWBlv3G":"A"},{"QD8LM7Dl":"E"},{"G32mn7Za":"A"},{"m4mz02ZN":"B"},{"53bzNG3N":"B"},{"r4LegQZL":"C"},{"WZRXaxDp":"A"},{"p4j0Jx3l":"C"},{"OZaQPzZz":"D"},{"R3xg6pZY":"A"},{"WZRXxWDp":"B"},{"6DWGzvDG":"C"},{"x41V5mZ1":"B"},{"53bzly3N":"C"},{"R3xgnoZY":"A"},{"94nExGDK":"B"},{"a4PeJnZr":"B"},{"a4Pe7PZr":"B"},{"R3xg70ZY":"D"},{"6DWGllDG":"C"},{"7ZXPlwZb":"A"},{"74rznx4Q":"D"},{"QZVnRNZj":"D"},{"JZezql3d":"D"},{"AZ7b0V4k":"C"},{"MZgGbXZy":"D"},{"Q3YpNBZ9":"B"},{"a4wpM6ZJ":"B"},{"MZgGjPZy":"A"},{"94nEYNDK":"B"},{"VDoE1VZB":"A"},{"x41VN5Z1":"C"},{"a4wpX7ZJ":"A"},{"j3kbvBZW":"D"},{"JZezvQ3d":"C"},{"6DWGjjDG":"C"},{"JZez0a3d":"B"},{"x41VvmZ1":"A"},{"l49xnkDL":"D"},{"e3AoYk4r":"D"},{"JZez1X3d":"C"},{"JZezyB3d":"A"},{"G32EBLZa":"A"},{"QD8xN7Dl":"D"},{"e3AoNl4r":"D"},{"M3lENjDP":"C"},{"b3JKnyDQ":"C"},{"j3kbKpZW":"D"},{"m4mR92ZN":"A"},{"64EEzr49":"D"},{"7ZXP7kZb":"D"},{"yDdznjZr":"C"},{"94nEvYDK":"D"},{"7ZXPk5Zb":"C"},{"R3xg90ZY":"A"},{"eDqb7L4E":"C"},{"B3ydWdZ0":"A"},{"64EEmv49":"A"},{"b3JKknDQ":"D"},{"QZVn5pZj":"D"},{"a4PeojZr":"A"},{"m4mRldZN":"A"},{"0DKX2j4Q":"D"},{"0ZvPjODJ":"D"},{"VDoEkbZB":"A"},{"GDzJjJDN":"D"},{"0ZvPVwDJ":"D"},{"a4wpOYZJ":"B"},{"GDzJOjDN":"A"},{"VZMembZq":"A"},{"R3xgOpZY":"D"},{"AZ7bNe4k":"D"},{"VDoE6VZB":"D"},{"MZgGR6Zy":"D"},{"QZVnqNZj":"A"},{"r4Lzqo3L":"B"},{"r4LzBn3L":"B"},{"6DWMPyZG":"D"},{"7ZX5vL3b":"B"},{"m4mkK73N":"A"},{"yDdGBm3r":"C"},{"b3JM7nZQ":"D"},{"q3Qz1kDN":"B"},{"7ZX5RB3b":"E"},{"R3xAzrDY":"C"},{"y30kjoZJ":"A"},{"p4j8Vn3l":"B"},{"94nJ2p4K":"B"},{"WZRMnO4p":"B"},{"m4mk923N":"C"},{"q3QzX0DN":"A"},{"b3JMgyZQ":"C"},{"0DKzdE3Q":"D"},{"VD6KWP4p":"B"},{"GDzmXl3N":"C"},{"94nJNN4K":"A"},{"GDzmzL3N":"B"},{"53bJxx3N":"C"},{"j3koKp3W":"D"},{"g4Gyzj3O":"D"},{"j3koWx3W":"D"},{"eDqG59ZE":"A"},{"GZpbVJDJ":"A"},{"WZRMex4p":"D"},{"VDol7x4B":"C"},{"GZpbzJDJ":"D"},{"VD6Kol4p":"A"},{"6DWM8lZG":"B"},{"R3xAMVDY":"D"},{"x41dObD1":"E"},{"QDBxObZ9":"D"},{"7ZX5bk3b":"D"},{"6DWMLyZG":"D"},{"QDBx7MZ9":"A"},{"74r2Wj4Q":"A"},{"53bJ9G3N":"E"},{"0DKzbE3Q":"A"},{"yDdGnj3r":"C"},{"a4wWQp4J":"D"},{"GZpbV5DJ":"B"},{"VZMzjn3q":"A"},{"r4LzWL3L":"A"},{"x41d8gD1":"B"},{"QDBxMOZ9":"C"},{"B3yBNmD0":"D"},{"6DWMolZG":"D"},{"a4wWrQ4J":"C"},{"WZRM2k4p":"E"},{"WZRMja4p":"A"},{"0ZvmK04J":"B"},{"VZMz163q":"C"},{"6DWM7jZG":"A"},{"74r2RB4Q":"C"},{"p4j8713l":"C"},{"a4wWG64J":"E"},{"G32Jwb3a":"D"},{"R3xAaVDY":"A"},{"QD8loBDl":"A"},{"p4j8Ld3l":"A"},{"53brNl3N":"B"},{"q3QKME4N":"B"},{"Q3YYLn39":"D"},{"GZpYGM3J":"D"},{"JZeGvXDd":"C"},{"WZRP7qDp":"B"},{"eDqw6XZE":"C"},{"GDzzdbDN":"C"},{"y30mWnDJ":"D"},{"QDBBlKD9":"B"},{"G32mW9Za":"D"},{"WZRPevDp":"C"},{"yDdrwEZr":"B"},{"0ZvaKO4J":"C"},{"a4wrJWDJ":"A"},{"QD8L5QDl":"C"},{"GZpYG83J":"D"},{"JZeGApDd":"D"},{"AZ7YyPDk":"D"},{"x41mv941":"B"},{"QD8LvQDl":"D"},{"53brdE3N":"B"},{"M3lw7GZP":"D"},{"G32mwXZa":"C"},{"eDqwAmZE":"D"},{"yDdraLZr":"C"},{"QDBB7wD9":"D"},{"VZMGnrDq":"D"},{"l49kW03L":"D"},{"j3kRAmZW":"C"},{"l49kG03L":"B"},{"VZMGjVDq":"B"},{"AZ7YePDk":"D"},{"AZ7YO1Dk":"C"},{"AD5mOBDr":"B"},{"7ZX0b8Zb":"B"},{"VD6y7O3p":"D"},{"6DWBLo3G":"B"},{"53brxq3N":"C"},{"0DKyb6ZQ":"C"},{"m4mzNzZN":"A"},{"GZpYQM3J":"D"},{"0ZvaMw4J":"C"},{"GZpYRl3J":"A"},{"v4NNzV4x":"A"},{"MZgaYMDy":"B"},{"eDqwdAZE":"C"},{"M3lwXBZP":"D"},{"m4mz96ZN":"A"},{"B3y8Y7Z0":"A"},{"JZeGqpDd":"B"},{"g4Ggaj4O":"A"},{"MZgY7PDy":"C"},{"oQDBxjZ9":"B"},{"QZV15p4j":"B"},{"a4PMYWZr":"D"},{"M3ln6z4P":"C"},{"VD6oAo4p":"D"},{"v4NNWO4x":"D"},{"VZMG8nDq":"B"},{"XeDq9ADE":"A"},{"W94np3KQ":"A"},{"AZ7Ew8Dk":"A"},{"QZV15X4j":"D"},{"eDqzoL4E":"B"},{"R3xWb0ZY":"C"},{"p4jVEz4l":"D"},{"B3y8MdZ0":"A"},{"674r2x4Q":"D"},{"QZVWnx3j":"C"},{"eDqAvxDE":"B"},{"v4NzLV4x":"A"},{"l49lJeDL":"B"},{"6DW8q94G":"A"},{"MZgYjPDy":"A"},{"6DWBJj3G":"D"},{"QD8LELDl":"B"},{"x41m6N41":"C"},{"QDBBJAD9":"D"},{"j3kR55ZW":"D"},{"2e3Amv3r":"B"},{"5MZg883y":"C"},{"oVDob3BA":"C"},{"oQZVa4j6":"B"},{"5yDdLDrA":"B"},{"QD8ozN3l":"C"},{"MZgY0PDy":"B"},{"0DKyQEZQ":"C"},{"VD6ynP3p":"A"},{"QDBBJXD9":"C"},{"OZaXbn4z":"A"},{"dg4Gyr3O":"B"},{"5GZpbbDJ":"B"},{"a0ZvO3Jb":"B"},{"Vq3QBDNk":"A"},{"j3kGNR3W":"C"},{"GZpl55ZJ":"C"},{"GZplPJZJ":"D"},{"OZaYWnZz":"D"},{"7ZX8ALZb":"D"},{"VDoojxDB":"B"},{"JZeGrkDd":"B"},{"AZ7Y6BDk":"B"},{"eDqw09ZE":"C"},{"l49kre3L":"B"},{"5GZp0QZJ":"A"},{"oQZV2aZj":"B"},{"QB3yw40n":"C"},{"7ZXWPb4b":"D"},{"b3J7KGDQ":"C"},{"GDzJ6WDN":"D"},{"eDqbVN4E":"B"},{"GDzaEj3N":"C"},{"QD8qJ54l":"B"},{"l49x2rDL":"B"},{"eDqm9mDE":"A"},{"eDqbVq4E":"B"},{"6DWGW1DG":"D"},{"VZMJzb3q":"D"},{"x41YX541":"C"},{"y30VqP4J":"C"},{"7ZX1nP3b":"B"},{"j3kbnBZW":"C"},{"Q3Yp5MZ9":"B"},{"OZaw2pDz":"C"},{"x41Yd541":"A"},{"94n2894K":"D"},{"a4w2wMDJ":"B"},{"GDzax23N":"C"},{"e3AwOA4r":"D"},{"VD6jmYDp":"A"},{"q3Q2bqDN":"B"},{"7ZX15O3b":"A"},{"B3yaBz30":"C"},{"a4Pem6Zr":"D"},{"B3ydEEZ0":"A"},{"QZVQrJ4j":"D"},{"b3JKvRDQ":"D"},{"7ZXPJBZb":"D"},{"M3lEpjDP":"C"},{"a4wpq7ZJ":"D"},{"GDzJwWDN":"A"},{"p4jzP54l":"B"},{"AZ78n93k":"B"},{"m4mmk94N":"C"},{"AZ78Me3k":"B"},{"QZVQYk4j":"B"},{"0DKgE8DQ":"D"},{"OZaQ5NZz":"D"},{"94nEpGDK":"A"},{"a4P2QR3r":"C"},{"g4G8q9ZO":"B"},{"v4NBlq4x":"B"},{"e3Awvl4r":"D"},{"a4w2vYDJ":"C"},{"a4wpEYZJ":"B"},{"y30Vq14J":"A"},{"0DKXYo4Q":"C"},{"v4NXVB3x":"D"},{"AZ78re3k":"D"},{"0DKXY84Q":"A"},{"l49xerDL":"A"},{"QZVnvNZj":"C"},{"74rmKWDQ":"D"},{"53b1ojZN":"B"},{"OZawdyDz":"D"},{"M3lYReDP":"A"},{"g4GP09ZO":"A"},{"eDq5MmDE":"B"},{"yDdnxeZr":"C"},{"G32W1XDa":"B"},{"OZaAeGZz":"D"},{"0ZvQlw4J":"D"},{"0DKJPM3Q":"D"},{"6DWdk04G":"C"},{"y30WXrZJ":"A"},{"AD5LKJ3r":"A"},{"GDzWKJ4N":"B"},{"OZaAbGZz":"D"},{"Q3YBJ2D9":"A"},{"GZpQyM3J":"A"},{"QDBlJlZ9":"A"},{"AZ7ApPDk":"D"},{"QD8egQ4l":"A"},{"QZVgVJ3j":"A"},{"94nv1m4K":"D"},{"m4mA1J4N":"D"},{"g4GPbPZO":"C"},{"B3y7jB40":"D"},{"QD8eQj4l":"D"},{"g4GPXyZO":"C"},{"QDBlblZ9":"C"},{"x41W6k31":"D"},{"0ZvQN24J":"D"},{"a4wQy53J":"C"},{"0DKJw63Q":"B"},{"64EwJz39":"B"},{"QZVgpx3j":"D"},{"GZpQyl3J":"A"},{"x41Wp931":"B"},{"yDdnk1Zr":"B"},{"0DKJPn3Q":"D"},{"7ZXkwP4b":"C"},{"j3kA5R4W":"B"},{"JZeAeBZd":"C"},{"94nve24K":"C"},{"e3AyVK3r":"D"},{"JZeAypZd":"A"},{"74raPVDQ":"A"},{"a4PXMY4r":"C"},{"e3Ayxy3r":"B"},{"q3Qq2k3N":"D"},{"VZM0Gl4q":"E"},{"l49Wkn3L":"C"},{"MZgAabDy":"A"},{"AZ7AX8Dk":"C"},{"QD8eLX4l":"C"},{"eDq5wLDE":"C"},{"b3Jdrn4Q":"A"},{"VZM0Jl4q":"B"},{"eDq579DE":"E"},{"MZgAXbDy":"E"},{"b3JdYy4Q":"B"},{"p4jAoxDl":"A"},{"y30WzjZJ":"C"},{"QZVgAj3j":"A"},{"eDq5E9DE":"B"},{"VD6WaE4p":"A"},{"AD5Ya1Dr":"A"},{"MZgA9LDy":"A"},{"GZpQAN3J":"B"},{"R3x7xmZY":"D"},{"QZVgA03j":"D"},{"r4LBam3L":"D"},{"WZRV6OZp":"C"},{"p4jA1xDl":"C"},{"MZgALXDy":"C"},{"G32Wz7Da":"D"},{"VDoQ21ZB":"C"},{"y30WajZJ":"D"},{"VD6WpE4p":"B"},{"x41Wz231":"B"},{"yDdnqrZr":"A"},{"yDdnJjZr":"D"},{"53bAvxZN":"C"},{"a4wQ6X3J":"A"},{"JZeA5lZd":"D"},{"0DKJal3Q":"A"},{"b3Jday4Q":"C"},{"VZM0LM4q":"D"},{"MZgAwXDy":"D"},{"w3OK723e":"D"},{"QD8edN4l":"D"},{"64ExarD9":"B"},{"QZVg9j3j":"C"},{"q3Qqe03N":"D"},{"l49WAe3L":"A"},{"B3y7Je40":"A"},{"eDq5E6DE":"D"},{"R3x7dmZY":"B"},{"m4mAv24N":"B"},{"53bAKxZN":"A"},{"Q3YBqkD9":"B"},{"M3lArzDP":"A"},{"Q3YBMkD9":"C"},{"7ZXkO54b":"A"},{"0DKJ5E3Q":"D"},{"e3Aybb3r":"B"},{"JZeAVlZd":"D"},{"y30WLEZJ":"D"},{"AZ7AaVDk":"A"},{"0ZvQpN4J":"C"},{"74raOPDQ":"A"},{"q3Qqg03N":"C"},{"a4PXpP4r":"A"},{"j3kAep4W":"A"},{"64ExorD9":"B"},{"74raLPDQ":"C"},{"l49WJy3L":"C"},{"x41Wa231":"B"},{"a4wQgX3J":"D"},{"OZaAr8Zz":"A"},{"QDBlwMZ9":"C"},{"GZpQo53J":"B"},{"a4PXWW4r":"D"},{"QDBlaMZ9":"C"},{"AZ7AgVDk":"C"},{"7ZXkXk4b":"D"},{"GDzWBm4N":"D"},{"0ZvQeN4J":"B"},{"l49Way3L":"A"},{"eDq5N6DE":"C"},{"v4N9yaDx":"D"},{"a4PX1P4r":"B"},{"6DWdKy4G":"A"},{"yDdnYrZr":"D"},{"QDBl0XZ9":"A"},{"G32Wa7Da":"B"},{"m4mAx24N":"C"},{"6DWdNy4G":"D"},{"0DKJ5l3Q":"D"},{"GZpQ5N3J":"C"},{"B3y7me40":"D"},{"g4GPrjZO":"D"},{"7ZXkOk4b":"B"},{"QD8ezN4l":"D"},{"AD5YP1Dr":"C"},{"r4LBkm3L":"D"},{"VDoQY1ZB":"C"},{"94nvmo4K":"D"},{"b3JdjA4Q":"D"},{"j3kAVx4W":"D"},{"p4jPRb3l":"E"},{"v4NLVK3x":"B"},{"QDBeEO39":"B"},{"0DKMvqZQ":"D"},{"Q3YQXj39":"B"},{"AD59ewDr":"D"},{"g4GBqeDO":"D"},{"B3y66dD0":"D"},{"b3Jzen3Q":"B"},{"l49pQNDL":"B"},{"x41kbM31":"E"},{"6DW5WoZG":"D"},{"l49jPqZL":"B"},{"x41xEgD1":"B"},{"7ZXn9mDb":"C"},{"l49joqZL":"B"},{"M3lQgYDP":"B"},{"a4PP9j4r":"E"},{"0DKMEjZQ":"C"},{"AZ7lx03k":"B"},{"B3yGb740":"E"},{"7ZXKnw4b":"E"},{"a4PPvj4r":"D"},{"94nz5N4K":"C"},{"Q3YQry39":"D"},{"74rv2q4Q":"A"},{"QZVw2a3j":"B"},{"w3O06gDe":"C"},{"l49ppnDL":"B"},{"yDdPPmDr":"C"},{"0Zvgvn3J":"A"},{"G32qrbZa":"A"},{"7ZXK584b":"C"},{"x41kAG31":"B"},{"GZp6rQDJ":"A"},{"VDoBOv3B":"C"},{"p4jrbd4l":"E"},{"VDoBVb3B":"C"},{"OZa75oDz":"A"},{"R3x2yo4Y":"C"},{"eDqrVA4E":"B"},{"y30gqKZJ":"D"},{"e3AmaV3r":"C"},{"x41kLG31":"E"},{"q3Qyj83N":"E"},{"eDqr8J4E":"B"},{"m4m8V6DN":"C"},{"53boPqDN":"A"},{"AZ7dna3k":"A"},{"64Elw1D9":"C"},{"j3kNEkZW":"A"},{"OZaG2zDz":"D"},{"0Zvgmn3J":"C"},{"p4jr8d4l":"B"},{"0DKMzqZQ":"B"},{"MZgdk83y":"D"},{"M3lgp6ZP":"D"},{"74rKwxZQ":"E"},{"l49jekZL":"B"},{"QDBEdj39":"E"},{"a4Pvwl3r":"A"},{"64EllvD9":"A"},{"QD8PJBDl":"B"},{"QDBePO39":"C"},{"m4mrkdZN":"C"},{"r4LLzo4L":"D"},{"eDqvGA4E":"C"},{"G32qbRZa":"C"},{"l49pEkDL":"C"},{"0DKmKNZQ":"D"},{"GDz0wPZN":"A"},{"G32xyB4a":"C"},{"MZgzBj4y":"B"},{"j3kpX6DW":"A"},{"v4NLYK3x":"B"},{"VD6LlOZp":"C"},{"0DKmNNZQ":"C"},{"QDBeeA39":"D"},{"m4mrr7ZN":"C"},{"r4LLLL4L":"B"},{"QDBeEA39":"D"},{"yDdPLmDr":"C"},{"JZep9W4d":"E"},{"94nzoN4K":"B"},{"6DWvMl3G":"A"},{"7ZXK5w4b":"C"},{"GZp6bQDJ":"A"},{"VD6gVv4p":"C"},{"r4LLMQ4L":"B"},{"y307vKZJ":"E"},{"VZMEyQZq":"C"},{"JZe7xXDd":"B"},{"QZV0PaDj":"C"},{"b3JevzZQ":"A"},{"WZRv8mZp":"A"},{"WZRvymZp":"C"},{"QZV0BPDj":"A"},{"QZV0BKDj":"D"},{"j3kNN5ZW":"A"},{"6DWvv93G":"C"},{"7ZXvaODb":"A"},{"0ZvBE0ZJ":"D"},{"Q3YWg949":"D"},{"b3J7V6DQ":"D"},{"QDBWrj49":"C"},{"l49Gdq3L":"C"},{"0ZvBlaZJ":"D"},{"0DKlk84Q":"A"},{"v4NeBaDx":"A"},{"7ZXvbNDb":"C"},{"a4PjJV3r":"B"},{"b3JGdwDQ":"C"},{"B3yKKz40":"C"},{"v4NezBDx":"A"},{"JZeP0Q4d":"D"},{"6DWjo13G":"C"},{"GZpVebDJ":"A"},{"v4NeqzDx":"C"},{"QD8GkQ3l":"D"},{"e3AWzK4r":"B"},{"0ZvBAwZJ":"A"},{"QDBWnx49":"A"},{"VDoqWqZB":"C"},{"l49GG83L":"A"},{"74rp7y3Q":"A"},{"94nXqG3K":"D"},{"GDzXRmZN":"C"},{"w3ONR2Ze":"B"},{"QD8GqN3l":"B"},{"7ZXv1kDb":"B"},{"yDdBXmZr":"C"},{"yDdNMEZr":"C"},{"7ZXvxmDb":"D"},{"b3JGx8DQ":"D"},{"m4mKOz3N":"A"},{"GDzXbJZN":"B"},{"GZpVqlDJ":"D"},{"g4G7K94O":"D"},{"64EW0N39":"D"},{"M3l99eDP":"B"},{"GDzX5jZN":"D"},{"B3yKzE40":"A"},{"Q3YNnMD9":"D"},{"7ZXv8BDb":"A"},{"GZpVaNDJ":"B"},{"7ZXW7w4b":"D"},{"eDqPeA3E":"D"},{"QZV8VPDj":"B"},{"JZePkg4d":"A"},{"p4jB2b4l":"D"},{"AD5zde4r":"A"},{"l49G903L":"D"},{"yDdNR8Zr":"B"},{"M3l9OWDP":"A"},{"B3yKxB40":"A"},{"AZ7G7PZk":"D"},{"QDBWnl49":"E"},{"MZggpKZy":"B"},{"OZaN0p3z":"B"},{"VZMj1R3q":"D"},{"VD6GBY4p":"D"},{"QD8G953l":"C"},{"0DKlbM4Q":"B"},{"x41lWqD1":"A"},{"MZggg6Zy":"B"},{"x41ll5D1":"D"},{"VZMjNb3q":"E"},{"x41l8bD1":"E"},{"r4LW9ODL":"A"},{"MZggoXZy":"E"},{"94nXRo3K":"D"},{"yDdNrrZr":"A"},{"j3k0bxDW":"D"},{"64EW8Q39":"D"},{"j3k016DW":"D"},{"Q3YNEnD9":"B"},{"B3yKRB40":"D"},{"7ZXvRNDb":"B"},{"GDzXkbZN":"D"},{"w3ONVzZe":"A"},{"R3x9GvDY":"B"},{"53bN2l3N":"B"},{"MZggveZy":"B"},{"0DKl7n4Q":"B"},{"VZMjpV3q":"A"},{"R3x9BdDY":"D"},{"j3k0KRDW":"A"},{"v4Ne0VDx":"D"},{"b3JGgwDQ":"D"},{"e3AWgA4r":"D"},{"64EWxN39":"B"},{"AD5zYd4r":"A"},{"QD8Ge53l":"C"},{"VDoqqVZB":"A"},{"AZ7GyeZk":"D"},{"QD8Gv73l":"D"},{"94nXNG3K":"D"},{"AD5zoa4r":"D"},{"6DWj813G":"C"},{"MZggYRZy":"D"},{"y30gLrZJ":"A"},{"e3AmqA3r":"D"},{"m4m8wEDN":"B"},{"r4L8oR4L":"D"},{"b3JejwZQ":"C"},{"a4ww6a4J":"B"},{"64Evk2Z9":"C"},{"94n5YmDK":"B"},{"QDBE0x39":"D"},{"a4ww9M4J":"A"},{"v4NLEJ3x":"B"},{"a4PvWV3r":"A"},{"B3yGXl40":"C"},{"eDqrEx4E":"A"},{"94n5W2DK":"C"},{"eDqrQm4E":"A"},{"GZprPjDJ":"C"},{"VD6LbYZp":"D"},{"x41k9q31":"B"},{"G32x6k4a":"A"},{"G32x7X4a":"A"},{"AD596XDr":"B"},{"QZV07xDj":"A"},{"7ZXnebDb":"D"},{"GZprolDJ":"C"},{"OZa7WpDz":"D"},{"g4GM693O":"B"},{"p4jP653l":"A"},{"g4GMry3O":"C"},{"WZRvBBZp":"A"},{"AD59VdDr":"D"},{"AZ7lmP3k":"B"},{"e3AmEA3r":"D"},{"WZRv6vZp":"A"},{"q3QyYE3N":"A"},{"m4m82JDN":"D"},{"R3x2Ld4Y":"C"},{"QDBE0l39":"D"},{"MZgz9K4y":"A"},{"R3x2KQ4Y":"B"},{"74rKgWZQ":"A"},{"JZe7LyDd":"A"},{"Q3Y1bw39":"D"},{"GDz0A2ZN":"A"},{"p4jPom3l":"C"},{"a4wwka4J":"A"},{"a4PvdR3r":"B"},{"q3QyJq3N":"D"},{"j3kprYDW":"A"},{"7ZXnObDb":"B"},{"y30gzrZJ":"A"},{"MZgzwK4y":"B"},{"v4NLrV3x":"D"},{"QD8r2QZl":"B"},{"l49jAzZL":"A"},{"MZgz7M4y":"A"},{"GZprEjDJ":"C"},{"53boKEDN":"A"},{"0DKm5nZQ":"C"},{"VZME5RZq":"A"},{"VD6LAYZp":"B"},{"Q3Y16A39":"D"},{"6DW516ZG":"B"},{"p4jPqm3l":"D"},{"y30gLxZJ":"B"},{"0DKmAMZQ":"D"},{"y30g0xZJ":"B"},{"b3Je2wZQ":"B"},{"OZa79GDz":"D"},{"VDoG8JDB":"C"},{"eDqrQx4E":"C"},{"l49jAjZL":"C"},{"94n5AmDK":"D"},{"6DW5qLZG":"B"},{"MZgzjM4y":"D"},{"OZa7KpDz":"A"},{"a4Pv1V3r":"D"},{"VZMELVZq":"D"},{"B3yGyL40":"A"},{"j3kpQRDW":"D"},{"0DKm8MZQ":"C"},{"64Ev1NZ9":"C"},{"VDoGNqDB":"B"},{"e3AmBK3r":"C"},{"GDz0q2ZN":"C"},{"w3O0gpDe":"B"},{"eDqrpm4E":"C"},{"l49j8jZL":"C"},{"0Zvb5wZJ":"C"},{"0DKm8nZQ":"C"},{"r4L8NV4L":"C"},{"QD8rj5Zl":"C"},{"yDdLVeDr":"C"},{"w3O0LpDe":"C"},{"M3lgrGZP":"A"},{"M3lgmvZP":"C"},{"QZV0AxDj":"B"},{"QDBEwl39":"A"},{"GDz02JZN":"B"},{"53bogEDN":"B"},{"VD6LEWZp":"D"},{"QZV0mJDj":"C"},{"QZV05kDj":"C"},{"yDdLd5Dr":"D"},{"QD8rR7Zl":"B"},{"yDdLdeDr":"B"},{"MZgz064y":"D"},{"e3AmRl3r":"C"},{"OZa7PyDz":"A"},{"B3yGLz40":"C"},{"a4Pvl63r":"C"},{"j3kpqgDW":"D"},{"GDz0yjZN":"D"},{"WZRvlWZp":"A"},{"G32xvL4a":"A"},{"OZa7lyDz":"C"},{"a4wwxM4J":"D"},{"v4NLjq3x":"A"},{"R3x2Ep4Y":"A"},{"Q3Y1yp39":"C"},{"94n5l9DK":"C"},{"M3lgleZP":"D"},{"l49jgjZL":"A"},{"b3JekwZQ":"B"},{"b3JeqRZQ":"C"},{"7ZXnlODb":"D"},{"6DW5EvZG":"A"},{"GZpr8vDJ":"B"},{"94n5w9DK":"C"},{"yDdLl5Dr":"B"},{"v4NLRq3x":"D"},{"M3lgVeZP":"D"},{"MZgzl64y":"D"},{"w3O0axDe":"A"},{"7ZXnAPDb":"D"},{"j3kplgDW":"B"},{"0DKmWMZQ":"B"},{"QDBEVx39":"A"},{"GZpr8jDJ":"B"},{"l49j78ZL":"C"},{"VZMEwbZq":"A"},{"e3Amkl3r":"B"},{"eDqroN4E":"D"},{"y30gQ1ZJ":"B"},{"a4wwKY4J":"B"},{"0DKmR8ZQ":"C"},{"m4m8b9DN":"A"},{"x41kr531":"B"},{"53bolQDN":"B"},{"b3JeRRZQ":"A"},{"w3O08xDe":"C"},{"p4jPlR3l":"C"},{"GDz0VjZN":"B"},{"WZRvrWZp":"D"},{"AZ7lke3k":"A"},{"y30gR1ZJ":"D"},{"MZgz0M4y":"B"},{"a4PvoR3r":"D"},{"VZMERbZq":"C"},{"m4m8l9DN":"C"},{"a4Pvo63r":"B"},{"AD595EDr":"D"},{"QZV0lkDj":"D"},{"0DKmV8ZQ":"A"},{"QDBEgg39":"C"},{"53boXjDN":"C"},{"74rKQ6ZQ":"B"},{"r4L8bq4L":"D"},{"p4jPQ53l":"D"},{"l49jR8ZL":"A"},{"G32xRL4a":"A"},{"g4GM9Q3O":"A"},{"q3QyQz3N":"D"},{"eDqrgN4E":"B"},{"g4GMRQ3O":"C"},{"eDqrLm4E":"B"},{"7ZXnLODb":"A"},{"QDBERg39":"C"},{"GZprpvDJ":"B"},{"64EvB7Z9":"A"},{"VDoGjVDB":"C"},{"JZe7JPDd":"D"},{"0ZvbkbZJ":"C"},{"M3lAYYDP":"D"},{"g4GPGeZO":"E"},{"94nvON4K":"B"},{"QZVgJX3j":"A"},{"R3x7MrZY":"D"},{"eDqPjx3E":"D"},{"QDBYkO39":"D"},{"y30lya3J":"D"},{"yDdN6EZr":"D"},{"MZggbMZy":"A"},{"GZpVzgDJ":"A"},{"a4Pjb83r":"D"},{"eDqPkx3E":"C"},{"eDqPkm3E":"C"},{"QD8G573l":"B"},{"53bN5Q3N":"C"},{"WZReNa4p":"A"},{"R3xrBr4Y":"C"},{"64Emzv49":"C"},{"q3QWo84N":"B"},{"GDzXd2ZN":"A"},{"l49Glr3L":"B"},{"0DKlgE4Q":"D"},{"0DKlnn4Q":"C"},{"AZ7GA9Zk":"C"},{"a4w0QMZJ":"C"},{"g4G75Q4O":"D"},{"VDoqoPZB":"D"},{"MZgge8Zy":"B"},{"53bNRl3N":"C"},{"b3JGL8DQ":"A"},{"v4NenVDx":"A"},{"l49GMz3L":"C"},{"WZRenv4p":"A"},{"y30lAx3J":"C"},{"94nXvm3K":"B"},{"6DWjdL3G":"B"},{"v4Ne5qDx":"D"},{"yDdNo6Zr":"E"},{"VD6GyE4p":"C"},{"r4LW7mDL":"A"},{"7ZXv0kDb":"C"},{"MZggGLZy":"E"},{"q3QWVB4N":"A"},{"yDdNkLZr":"A"},{"WZRe9m4p":"A"},{"VDoqMBZB":"B"},{"yDdNxEZr":"A"},{"B3yKk740":"D"},{"QZV8xPDj":"B"},{"j3k0mmDW":"A"},{"OZaNRL3z":"C"},{"JZePgB4d":"C"},{"p4jB9m4l":"A"},{"GZpVwlDJ":"B"},{"e3AWyA4r":"C"},{"p4jBA54l":"D"},{"7ZXvvODb":"A"},{"VZMjjb3q":"B"},{"M3l97eDP":"A"},{"r4LWqODL":"C"},{"MZggoRZy":"D"},{"QZV8ejDj":"C"},{"j3k0RpDW":"D"},{"eDqPm63E":"A"},{"eDqA6LDE":"C"},{"eDqA6eDE":"D"},{"yDdBXwZr":"D"},{"0DKlPN4Q":"B"},{"MZggnjZy":"B"},{"g4G7Qk4O":"D"},{"AZ7Gp0Zk":"D"},{"a4w0eWZJ":"B"},{"QDBWNw49":"D"},{"eDqPOX3E":"B"},{"0DKl964Q":"D"},{"GZpVgMDJ":"A"},{"64EWn239":"A"},{"VD6GQp4p":"D"},{"r4LWJRDL":"D"},{"64EWz239":"D"},{"74rpbV3Q":"D"},{"QD8GAQ3l":"C"},{"p4jBJm4l":"D"},{"R3x9pQDY":"A"},{"B3yKgl40":"A"},{"53bN9j3N":"D"},{"R3x97QDY":"C"},{"GZpVVvDJ":"A"},{"r4LW5qDL":"A"},{"b3JG7RDQ":"D"},{"eDqPAq3E":"B"},{"a4PP9z4r":"A"},{"GDz06LZN":"B"},{"p4jPan3l":"E"},{"MZgzMj4y":"C"},{"QZV06PDj":"C"},{"B3yGE740":"C"},{"MZgddP3y":"D"},{"94nzze4K":"E"},{"VZMlln4q":"C"},{"AZ7dMa3k":"B"},{"AD59WBDr":"E"},{"a4wwqW4J":"C"},{"JZe7dgDd":"A"},{"v4NQQ7Dx":"A"},{"r4LLGo4L":"E"},{"R3xeAVDY":"B"},{"w3OEog4e":"D"},{"R3x2VG4Y":"C"},{"M3lgqBZP":"A"},{"e3Aeey3r":"A"},{"Q3YQQ939":"A"},{"q3QpyLZN":"C"},{"JZepnW4d":"D"},{"y307koZJ":"B"},{"6DWv9e3G":"B"},{"OZaGGnDz":"D"},{"7ZXKnL4b":"E"},{"VZMlkl4q":"A"},{"e3AeOv3r":"C"},{"eDqvaA4E":"C"},{"94n5b0DK":"B"},{"AZ7lR03k":"B"},{"w3OEM04e":"E"},{"x41xXMD1":"E"},{"j3kpnnDW":"D"},{"7ZXnJ8Db":"D"},{"eDqr2X4E":"D"},{"a4wdw6ZJ":"A"},{"G32qxbZa":"D"},{"QD8PlBDl":"D"},{"g4GBErDO":"A"},{"74rvEx4Q":"A"},{"a4PPzz4r":"B"},{"m4m8dnDN":"C"},{"6DW5geZG":"B"},{"VDoG9bDB":"D"},{"GZprd8DJ":"C"},{"GDzeel3N":"C"},{"VDoBGx3B":"A"},{"QZVw0X3j":"B"},{"b3Jze63Q":"A"},{"VZMlEl4q":"A"},{"b3JzMn3Q":"C"},{"0DKMzjZQ":"A"},{"QZVwYa3j":"B"},{"OZa7xBDz":"E"},{"OZa7aBDz":"C"},{"e3AmKV3r":"B"},{"G32xNB4a":"D"},{"eDqvrL4E":"E"},{"6DWvrl3G":"C"},{"M3lQGYDP":"A"},{"x41xdgD1":"E"},{"VDoBlv3B":"C"},{"p4jrNn4l":"C"},{"yDdLeLDr":"C"},{"VZMEqrZq":"A"},{"MZgz5j4y":"E"},{"VD6ggo4p":"D"},{"x41xxmD1":"D"},{"GZp6rJDJ":"A"},{"m4mrXdZN":"C"},{"R3xeJVDY":"D"},{"VD6gml4p":"B"},{"yDdP0wDr":"A"},{"VD6gKl4p":"E"},{"MZgd2b3y":"E"},{"OZaG8oDz":"C"},{"WZRgwk3p":"D"},{"m4mrYnZN":"D"},{"53bGqNDN":"A"},{"v4NL1E3x":"E"},{"VD6L5vZp":"C"},{"Q3Y10j39":"A"},{"GDz0LPZN":"A"},{"eDqvGe4E":"C"},{"y307kKZJ":"B"},{"64Eld9D9":"C"},{"q3QpGBZN":"B"},{"94n5BpDK":"C"},{"AZ7lL13k":"B"},{"MZgzN84y":"A"},{"94n5p0DK":"E"},{"w3O0bQDe":"D"},{"53bomqDN":"D"},{"g4GMjk3O":"B"},{"GZp66JDJ":"C"},{"M3lQQODP":"D"},{"l49pjnDL":"B"},{"y307goZJ":"A"},{"74rzkq4Q":"C"},{"74rvnj4Q":"A"},{"q3Q82BZN":"B"},{"a4PeGjZr":"C"},{"a4PeVjZr":"A"},{"q3Qpl1ZN":"A"},{"94nz0e4K":"E"},{"Q3YQ8939":"D"},{"b3Jz6n3Q":"C"},{"GDzeQG3N":"C"},{"GDzejL3N":"A"},{"QZVn1pZj":"A"},{"eDqble4E":"C"},{"AZ7d1a3k":"E"},{"7ZXKGw4b":"D"},{"r4LLrQ4L":"D"},{"G32EobZa":"D"},{"q3QpkLZN":"A"},{"VDoBrx3B":"B"},{"JZepKa4d":"D"},{"r4LLAL4L":"D"},{"AD5prL3r":"B"},{"0DKM6RZQ":"C"},{"64ElV9D9":"A"},{"G32r5B3a":"A"},{"a4PQLlZr":"D"},{"M3lELYDP":"A"},{"53bzry3N":"C"},{"l49pwnDL":"B"},{"QZVwGX3j":"C"},{"OZaGJnDz":"A"},{"64ElAvD9":"D"},{"eDqvYe4E":"A"},{"w3OEk04e":"D"},{"MZgdmb3y":"B"},{"l49BGkZL":"B"},{"53ba5qZN":"B"},{"l49xlnDL":"A"},{"MZgGYPZy":"E"},{"w3Or10Ze":"D"},{"VD6NMlDp":"E"},{"JZezGW3d":"E"},{"7ZXP08Zb":"B"},{"g4Ge8r3O":"D"},{"Q3YpzjZ9":"C"},{"6DWGYeDG":"A"},{"0Zvg9M3J":"D"},{"VDoBPL3B":"D"},{"53bGlGDN":"B"},{"WZRgJJ3p":"A"},{"94nzrN4K":"B"},{"B3y6omD0":"B"},{"p4jrpd4l":"B"},{"QD8P1BDl":"B"},{"y307noZJ":"D"},{"y307nKZJ":"D"},{"m4mrpnZN":"C"},{"VD6gYv4p":"B"},{"94no70ZK":"A"},{"e3AO5V4r":"C"},{"w3OMyQ4e":"A"},{"yDdz2mZr":"C"},{"WZRXNPDp":"C"},{"0ZvPEnDJ":"B"},{"p4j0Gd3l":"A"},{"QZVnepZj":"E"},{"q3Q8KkZN":"A"},{"a4wdKpZJ":"B"},{"l49pneDL":"E"},{"yDdP5jDr":"C"},{"v4NQJ7Dx":"E"},{"v4NQA7Dx":"C"},{"l49pYnDL":"A"},{"y307bJZJ":"D"},{"QZVwzp3j":"B"},{"6DWvml3G":"A"},{"74rvXq4Q":"D"},{"a4PPkj4r":"A"},{"Q3YQOy39":"B"},{"a4wdoVZJ":"A"},{"QZVwOp3j":"B"},{"R3xJzG4Y":"D"},{"eDqbzL4E":"D"},{"QD8xnBDl":"D"},{"w3Orq0Ze":"E"},{"eDqbwe4E":"B"},{"QDBjBOD9":"A"},{"l49xkkDL":"D"},{"JZezwX3d":"D"},{"JZepEk4d":"A"},{"QD8PYXDl":"A"},{"j3kNj5ZW":"C"},{"QDBe6A39":"E"},{"0DKM6qZQ":"A"},{"l49pYNDL":"A"},{"MZgdVb3y":"C"},{"a4PP6j4r":"B"},{"G32qkbZa":"B"},{"VD6gdl4p":"D"},{"0Zvgwn3J":"A"},{"6DWjly3G":"B"},{"QDBBaKD9":"E"},{"6DWBEL3G":"E"},{"VD6yqK3p":"B"},{"AZ7Yx1Dk":"C"},{"GZpYj83J":"D"},{"a4PMElZr":"C"},{"b3Jr1j3Q":"B"},{"64E7aX39":"C"},{"Q3YYyw39":"B"},{"a4PMl6Zr":"A"},{"AD5m11Dr":"E"},{"GZpL2QZJ":"B"},{"VDozY83B":"C"},{"7ZX0ONZb":"D"},{"q3QKJE4N":"E"},{"VDozrP3B":"E"},{"x41mbM41":"A"},{"Q3YYM239":"E"},{"JZeGLBDd":"D"},{"JZeGxXDd":"B"},{"QZVJAKZj":"C"},{"GDzz7JDN":"A"},{"AD5mVXDr":"D"},{"GZpYpj3J":"C"},{"0Zvay04J":"D"},{"JZeGKQDd":"E"},{"y30mnjDJ":"D"},{"AD5xq23r":"D"},{"JZeP5y4d":"B"},{"QZVeYp4j":"A"},{"94nOppZK":"A"},{"7ZX0Y8Zb":"C"},{"AD5mGwDr":"B"},{"6DWB0o3G":"C"},{"p4jV1Q4l":"B"},{"b3Jra83Q":"C"},{"g4GGaP4O":"C"},{"AZ7YanDk":"A"},{"b3Jrqw3Q":"E"},{"yDdrleZr":"A"},{"v4NNOa4x":"D"},{"VZMGqQDq":"B"},{"VD6y6v3p":"E"},{"QD8LmADl":"C"},{"0DKyrNZQ":"A"},{"QDBBXwD9":"D"},{"VZMGWrDq":"D"},{"VD6ylO3p":"D"},{"74rkAmZQ":"A"},{"QDBBvwD9":"D"},{"yDdrj8Zr":"B"},{"a4wrg5DJ":"E"},{"B3y8JBZ0":"D"},{"74rkgVZQ":"B"},{"94nOl9ZK":"E"},{"m4mzo8ZN":"D"},{"b3Jrmy3Q":"D"},{"x410XgD1":"D"},{"y30Bvo4J":"E"},{"MZgokbZy":"E"},{"AZ7YL1Dk":"E"},{"eDqbnA4E":"C"},{"74rzJy4Q":"C"},{"GZpNwNDJ":"A"},{"G32E0RZa":"B"},{"p4j0km3l":"C"},{"QD8xGLDl":"C"},{"AZ7bka4k":"A"},{"74rzdq4Q":"D"},{"Q3YpeAZ9":"C"},{"QD8xkMDl":"C"},{"eDqbP94E":"C"},{"QZVn1XZj":"B"},{"M3lEx6DP":"D"},{"QZVnyxZj":"C"},{"r4LexqZL":"A"},{"a4wpJ7ZJ":"A"},{"VZMe06Zq":"C"},{"MZgGx6Zy":"C"},{"R3xgqJZY":"C"},{"0DKXnl4Q":"A"},{"0ZvPzNDJ":"D"},{"AD5lYJ3r":"B"},{"GZpNzJDJ":"D"},{"y30V1J4J":"A"},{"yDdzVwZr":"B"},{"MZgGjbZy":"D"},{"GZpNEQDJ":"B"},{"VD6NnpDp":"C"},{"e3Ao8o4r":"A"},{"B3ydYeZ0":"A"},{"53bz9x3N":"B"},{"q3Q8q1ZN":"D"},{"R3xgrrZY":"A"},{"VDoEjvZB":"C"},{"AZ7b214k":"B"},{"0ZvPnODJ":"B"},{"MZgGy8Zy":"D"},{"q3Q8ozZN":"D"},{"eDqbON4E":"A"},{"a4Pex6Zr":"D"},{"OZaQ6yZz":"D"},{"m4mR69ZN":"C"},{"x41V7bZ1":"B"},{"QDBj7bD9":"B"},{"eDqbj64E":"C"},{"j3kbAxZW":"D"},{"x41VWNZ1":"A"},{"QZVng0Zj":"C"},{"y30VQo4J":"B"},{"a4wpKVZJ":"B"},{"6DWGXeDG":"C"},{"a4PegzZr":"D"},{"94nE0pDK":"D"},{"VZMepoZq":"B"},{"q3Q8nQZN":"B"},{"AD5lv13r":"A"},{"VD6Kyv4p":"C"},{"yDdGBw3r":"C"},{"QDBxnMZ9":"B"},{"B3yBgVD0":"D"},{"l49Qvn4L":"C"},{"OZadRN4z":"B"},{"JZenRQ3d":"C"},{"p4j8vg3l":"E"},{"a4P9JPZr":"E"},{"e3AvGvDr":"C"},{"GDzm5l3N":"A"},{"g4GyYe3O":"A"},{"eDqGleZE":"B"},{"QZV2qNZj":"D"},{"M3lROj4P":"E"},{"w3OeVw4e":"D"},{"y30kNjZJ":"C"},{"74r2bP4Q":"D"},{"b3JMVAZQ":"D"},{"VD6KBP4p":"A"},{"j3koAx3W":"E"},{"B3yBKdD0":"D"},{"AZ7My8Dk":"C"},{"v4NlNE3x":"C"},{"QD8l0MDl":"A"},{"VZMzBM3q":"A"},{"QDBxlXZ9":"B"},{"G32JWG3a":"E"},{"53bJAG3N":"B"},{"G32J5l3a":"C"},{"b3JMBnZQ":"A"},{"v4Nlk83x":"D"},{"74r2Gq4Q":"E"},{"a4wWN74J":"E"},{"GDzmkW3N":"C"},{"QD8lANDl":"A"},{"g4GyKA3O":"B"},{"74r2jB4Q":"C"},{"q3QzMLDN":"B"},{"w3Oey04e":"B"},{"JZenaW3d":"E"},{"g4Gynj3O":"E"},{"0DKznl3Q":"C"},{"94nJVo4K":"B"},{"p4j8Jx3l":"B"},{"r4Lzwn3L":"E"},{"a4P9jYZr":"D"},{"0ZvmMY4J":"C"},{"j3kok53W":"D"},{"AD58AL3r":"B"},{"74r7OPZQ":"D"},{"Vq3QbkDN":"C"},{"7ZX0B5Zb":"B"},{"VDozJL3B":"D"},{"x418emD1":"C"},{"v4Nkp7Zx":"B"},{"zx41Eg41":"C"},{"AZ7elPDk":"D"},{"6DWn563G":"D"},{"Q3YnqkD9":"D"},{"b3JBay3Q":"D"},{"yDd2VmZr":"B"},{"VDozdL3B":"A"},{"6DWByj3G":"A"},{"QD8L6LDl":"C"},{"a0ZvvnZJ":"D"},{"R3xred4Y":"D"},{"74rjvV4Q":"D"},{"QZV1904j":"A"},{"94nqWYDK":"C"},{"e3AMEy3r":"A"},{"yDdr8mZr":"C"},{"oQDBPOZ9":"B"},{"q0DKzj3Q":"B"},{"VD6zgpDp":"B"},{"94nqLoDK":"C"},{"OZaYV8Zz":"C"},{"b3JBYA3Q":"B"},{"g4Gg6m4O":"A"},{"j3kwr53W":"B"},{"Q3YYkB39":"A"},{"53br8G3N":"A"},{"yDdr8jZr":"B"},{"M3lwyOZP":"C"},{"QOZado4z":"C"},{"eDqAbxDE":"B"},{"VZMYeVZq":"C"},{"GDzoeJ4N":"D"},{"VZMKaMDq":"B"},{"QDBMaM39":"B"},{"MZgYLXDy":"C"},{"yDd2dmZr":"C"},{"QDBB9XD9":"A"},{"a4PMrYZr":"C"},{"Xl49BkZL":"B"},{"wj3kon3W":"C"},{"bWZRk3pB":"D"},{"Ya4wQ3JE":"B"},{"l49vxzZL":"B"},{"G32wqXDa":"C"},{"x41vx9Z1":"C"},{"64Eml249":"A"},{"MZgaOKDy":"C"},{"WZRPqmDp":"C"},{"94nOX2ZK":"D"},{"QZVJMPZj":"D"},{"OZaXYp4z":"C"},{"MZgav8Dy":"D"},{"0Zvaow4J":"D"},{"MZgaKKDy":"A"},{"y30m5rDJ":"A"},{"7ZX0WPZb":"D"},{"R3xWqoZY":"D"},{"VD6yOv3p":"B"},{"Q3YYwj39":"C"},{"6DWBVe3G":"B"},{"VZMGBrDq":"C"},{"VZMG1jDq":"B"},{"R3xWpvZY":"D"},{"0DKyl6ZQ":"C"},{"x41m5941":"C"},{"74rkRVZQ":"B"},{"M3lwnvZP":"C"},{"6DWBd03G":"D"},{"AD5mzeDr":"D"},{"QD8LGjDl":"D"},{"0DKykMZQ":"D"},{"g4GGg94O":"B"},{"q3QKBB4N":"C"},{"0ZvaQ24J":"C"},{"OZaXAL4z":"B"},{"7ZX0vbZb":"C"},{"a4PMnlZr":"D"},{"QZVJjPZj":"B"},{"g4GGKP4O":"D"},{"eDqw5XZE":"B"},{"0DKyJ6ZQ":"A"},{"e3AJMADr":"A"},{"QZVJqaZj":"A"},{"eDqwkJZE":"A"},{"l49kzq3L":"A"},{"OZaXqB4z":"B"},{"w3ORMpZe":"D"},{"0ZvPW0DJ":"C"},{"r4LdMq4L":"C"},{"64EKd739":"C"},{"VD6N5KDp":"D"},{"b3JpwR4Q":"A"},{"yDdze6Zr":"B"},{"e3Aopo4r":"D"},{"GZpNXgDJ":"C"},{"QDBGxg49":"A"},{"GDzamj3N":"A"},{"74rm26DQ":"A"},{"R3xvjp4Y":"D"},{"y30KgxZJ":"C"},{"6DWY9vZG":"D"},{"53bzLQ3N":"A"},{"MZgGN6Zy":"B"},{"JZew9yDd":"B"},{"y30Kv1ZJ":"D"},{"QDBGqg49":"B"},{"g4G8EQZO":"D"},{"VD6jVWDp":"D"},{"64EKM739":"A"},{"VDoEgPZB":"A"},{"0DKgmMDQ":"A"},{"l49mjj4L":"D"},{"6DWYrLZG":"D"},{"74rm6WDQ":"D"},{"GZpabv3J":"A"},{"MZgGNRZy":"D"},{"QZVQ0J4j":"B"},{"b3Jpew4Q":"D"},{"0DKgz8DQ":"C"},{"b3JpMR4Q":"A"},{"MZgX263y":"C"},{"M3lYKeDP":"D"},{"G32AbLZa":"D"},{"G32EjqZa":"B"},{"GZpNdgDJ":"B"},{"e3AyPA3r":"D"},{"GDzW124N":"D"},{"l49WXz3L":"D"},{"w3OKX63e":"D"},{"WZRVbvZp":"C"},{"WZRVEqZp":"D"},{"0DKJBn3Q":"A"},{"w3OKJ63e":"D"},{"eDq5MxDE":"D"},{"GZpQ1j3J":"C"},{"m4mAaE4N":"A"},{"b3JdJG4Q":"A"},{"G32WmbDa":"B"},{"q3QWaz4N":"A"},{"eDqPlq3E":"D"},{"w3ON96Ze":"C"},{"y30jro4J":"D"},{"VD6GWY4p":"D"},{"yDdNNeZr":"B"},{"QD8GoM3l":"C"},{"0ZvBzAZJ":"C"},{"M3l9AvDP":"B"},{"G32llL4a":"C"},{"GZpVzvDJ":"D"},{"b3JG7XDQ":"B"},{"74rpmP3Q":"B"},{"v4Nzn74x":"D"},{"6DWjQe3G":"B"},{"QDBWpw49":"D"},{"a4Pjxl3r":"C"},{"AD5zJd4r":"C"},{"OZaNAp3z":"B"},{"Q3YNNpD9":"C"},{"j3k0kgDW":"A"},{"a4w0M7ZJ":"A"},{"64EW7r39":"B"},{"VZMje63q":"C"},{"G32l1B4a":"A"},{"AZ7Gq0Zk":"B"},{"l49GNq3L":"B"},{"64EWpX39":"A"},{"GZpVQjDJ":"D"},{"QDBWlx49":"B"},{"y30lj13J":"B"},{"QDBWMb49":"B"},{"eDqPl63E":"C"},{"GZpVLNDJ":"B"},{"VDoqm1ZB":"C"},{"G32lEG4a":"E"},{"94nNGN4K":"D"},{"OZag0zDz":"B"},{"QZV8oaDj":"B"},{"7ZXvwmDb":"A"},{"QD8Ggr3l":"A"},{"VD6GeN4p":"C"},{"0ZvBx2ZJ":"D"},{"a4w0N5ZJ":"C"},{"j3k0OmDW":"D"},{"94nXxx3K":"D"},{"g4G7dP4O":"D"},{"G32lP94a":"B"},{"OZaN1G3z":"A"},{"yDdNp1Zr":"D"},{"94nXX93K":"A"},{"64EWQ739":"D"},{"AD5zAE4r":"E"},{"53bNdQ3N":"A"},{"VD6GoK4p":"C"},{"QDBWBM49":"C"},{"l49Gmy3L":"E"},{"l49Gxe3L":"A"},{"a4wGP64J":"D"},{"Q3YNvjD9":"D"},{"l49GXk3L":"D"},{"v4NedKDx":"A"},{"0ZvB1aZJ":"C"},{"QD8GVr3l":"B"},{"QZV8xKDj":"A"},{"QZV8RKDj":"B"},{"yDdNa1Zr":"C"},{"v4Ne7JDx":"C"},{"p4jBn54l":"A"},{"OZaNNy3z":"D"},{"QZV8akDj":"B"},{"x41VmgZ1":"D"},{"p4jbBn4l":"B"},{"QD8PMLDl":"D"},{"53bGnyDN":"E"},{"7ZXKq54b":"C"},{"g4Geve3O":"A"},{"v4NXBE3x":"D"},{"6DWvXj3G":"D"},{"v4N85K3x":"C"},{"OZaQzzZz":"C"},{"WZRXoPDp":"E"},{"e3Aowk4r":"E"},{"GZp6kbDJ":"D"},{"VZMeKlZq":"D"},{"53bGWGDN":"D"},{"QZVwbX3j":"A"},{"AZ7dJa3k":"B"},{"GZp69QDJ":"D"},{"OZaGjoDz":"C"},{"64EwQQ39":"D"},{"g4Gege3O":"D"},{"m4mRzdZN":"D"},{"a4PeMjZr":"E"},{"eDqbwA4E":"D"},{"MZgd6L3y":"D"},{"QDBeAA39":"D"},{"GZp6vJDJ":"D"},{"VD6gvo4p":"A"},{"QDBe8O39":"A"},{"M3lQdYDP":"D"},{"R3xeboDY":"C"},{"m4mX76DN":"B"},{"yDd0BEDr":"D"},{"q3Q8rkZN":"C"},{"a4wpmVZJ":"B"},{"b3JKynDQ":"C"},{"GDzJRGDN":"D"},{"B3yd8mZ0":"D"},{"MZgGa8Zy":"E"},{"r4LedQZL":"B"},{"QDBe5A39":"C"},{"r4LLgL4L":"D"},{"Q3YQA939":"C"},{"p4jrj14l":"A"},{"VD6g1l4p":"D"},{"QZVrWPZj":"C"},{"GZp0z8ZJ":"C"},{"eDqbze4E":"C"},{"y30VYo4J":"B"},{"v4NXk83x":"B"},{"7ZXPowZb":"D"},{"R3xgvoZY":"C"},{"AD5pRJ3r":"C"},{"0ZvgnM3J":"B"},{"QZVwK03j":"A"},{"e3AeYy3r":"D"},{"eDqvWL4E":"D"},{"0DKMORZQ":"A"},{"QZVwzX3j":"C"},{"b3Jz663Q":"C"},{"7ZXK6w4b":"C"},{"m4mrJdZN":"C"},{"94nzkN4K":"C"},{"a4PPOj4r":"D"},{"GDzx5PZN":"C"},{"WZRzYmZp":"A"},{"94nEqNDK":"C"},{"AD5lx23r":"D"},{"yDdzowZr":"A"},{"v4NXM83x":"D"},{"r4Le7oZL":"D"},{"VDoEzvZB":"B"},{"p4j0Vd3l":"C"},{"l49xkNDL":"D"},{"94nE2pDK":"B"},{"VZMeJQZq":"B"},{"74rKrVZQ":"A"},{"QDBELx39":"A"},{"7ZXnePDb":"C"},{"yDdLq1Dr":"A"},{"M3lgvvZP":"B"},{"w3O0v6De":"B"},{"GZpr5lDJ":"A"},{"AZ7lw93k":"D"},{"l49jJzZL":"C"},{"b3JeYGZQ":"C"},{"b3JejGZQ":"D"},{"j3kpxYDW":"D"},{"QZV07JDj":"C"},{"VZMEPRZq":"D"},{"x41ky931":"C"},{"yDdLJ1Dr":"D"},{"QZV0XJDj":"D"},{"53boYjDN":"C"},{"WZRv1BZp":"C"},{"m4m8WJDN":"A"},{"yDdLEeDr":"C"},{"7ZXnVPDb":"C"},{"a4PvyR3r":"A"},{"VD6LxpZp":"B"},{"g4GMo93O":"A"},{"G32ma9Za":"C"},{"0Zva9b4J":"D"},{"a4PMmzZr":"C"},{"b3JrAj3Q":"B"},{"a4wrEQDJ":"B"},{"R3xWoJZY":"E"},{"0DKy1lZQ":"A"},{"w3Owbg3e":"A"},{"VZMGMrDq":"B"},{"m4mze6ZN":"C"},{"eDqwpxZE":"C"},{"G32mRLZa":"C"},{"VDozPV3B":"B"},{"QZVJKkZj":"C"},{"0ZvaXO4J":"A"},{"QZVJBPZj":"B"},{"R3xWRGZY":"E"},{"94nOj2ZK":"C"},{"0ZvakA4J":"C"},{"AD5mraDr":"C"},{"B3y8reZ0":"B"},{"q3QKAB4N":"D"},{"53brLN3N":"B"},{"B3y8bwZ0":"B"},{"B3y8E7Z0":"C"},{"AZ7Yj0Dk":"D"},{"q3QKP84N":"A"},{"QDBBLlD9":"E"},{"b3Jr2G3Q":"C"},{"w3OwO23e":"E"},{"B3y81wZ0":"A"},{"WZRP8kDp":"B"},{"0DKyNNZQ":"B"},{"y30m9aDJ":"E"},{"AZ7YKnDk":"C"},{"MZgaLeDy":"E"},{"Q3YYbA39":"B"},{"53brpj3N":"B"},{"Q3YpVjZ9":"A"},{"x41VBMZ1":"B"},{"53bz203N":"D"},{"MZgGlbZy":"C"},{"b3JK0XDQ":"D"},{"G32EPqZa":"A"},{"QZVn80Zj":"D"},{"R3xgzrZY":"D"},{"JZezAk3d":"C"},{"QDBjVAD9":"B"},{"y30Vo14J":"B"},{"6DWGL1DG":"A"},{"e3AoW94r":"B"},{"y30V5J4J":"A"},{"m4mRj7ZN":"B"},{"j3kbmgZW":"B"},{"yDdzR5Zr":"B"},{"53bzx03N":"B"},{"QDBjkMD9":"D"},{"yDdzBmZr":"D"},{"r4LeboZL":"C"},{"AD5lR23r":"D"},{"6DWGy6DG":"B"},{"w3OrxxZe":"A"},{"a4PennZr":"A"},{"yDdzprZr":"B"},{"e3Aozb4r":"B"},{"VDoEX1ZB":"B"},{"b3JKdADQ":"A"},{"VD6NkoDp":"B"},{"74rzjB4Q":"C"},{"y30VjJ4J":"C"},{"r4LelLZL":"C"},{"l49xgNDL":"B"},{"x41VRgZ1":"A"},{"r4LeRoZL":"C"},{"y30V8r4J":"A"},{"g4GeNQ3O":"C"},{"p4j0xR3l":"B"},{"0DKXno4Q":"D"},{"QD8xANDl":"A"},{"m4mR77ZN":"C"},{"j3kbG5ZW":"B"},{"a4PeyYZr":"D"},{"VZMe5lZq":"C"},{"R3xgEVZY":"D"},{"g4Ge9e3O":"D"},{"Q3YplyZ9":"B"},{"QDBjROD9":"A"},{"53bzyE3N":"B"},{"7ZXPxOZb":"C"},{"WZRMax4p":"C"},{"JZenGX3d":"C"},{"QDBxWXZ9":"E"},{"WZRMPk4p":"D"},{"74r2xy4Q":"C"},{"GDzmoG3N":"B"},{"GZpbwNDJ":"C"},{"l49QGe4L":"D"},{"AD58zL3r":"A"},{"M3lR7O4P":"C"},{"w3Oe104e":"C"},{"AZ7MXaDk":"A"},{"R3xABmDY":"E"},{"R3xA70DY":"A"},{"q3QzaLDN":"A"},{"64EMnr49":"B"},{"M3lRWJ4P":"D"},{"6DWMa9ZG":"A"},{"eDqGALZE":"B"},{"a4wWMV4J":"E"},{"m4mkO83N":"B"},{"64EML549":"B"},{"G32JL73a":"C"},{"0ZvmLn4J":"A"},{"j3kowk3W":"C"},{"b3JMynZQ":"D"},{"b3JMyzZQ":"B"},{"v4Nlna3x":"A"},{"0ZvmdN4J":"D"},{"j3ko053W":"A"},{"MZg2OP4y":"E"},{"94nJ7e4K":"A"},{"53bJdg3N":"D"},{"eDqGAeZE":"D"},{"WZRMYP4p":"D"},{"QDBxmjZ9":"C"},{"53bJ203N":"C"},{"0DKz7o3Q":"B"},{"QZV2jjZj":"D"},{"R3xAp0DY":"D"},{"M3lRAJ4P":"C"},{"a4PLPV4r":"D"},{"b3JBk63Q":"D"},{"j3kGbR3W":"D"},{"GDzGMm4N":"D"},{"R3xadmDY":"B"},{"94nqAeDK":"D"},{"e3AJ09Dr":"D"},{"e3AJdyDr":"B"},{"oQDBjD9n":"A"},{"OZaY9lZz":"D"},{"WZRPEJDp":"A"},{"7ZX0y5Zb":"A"},{"dVD6ml3p":"B"},{"5yDd0LDr":"C"},{"dv4NEDx2":"D"},{"d53bN3Nw":"B"},{"a4PLeV4r":"B"},{"w3OyE64e":"A"},{"y30YajDJ":"A"},{"QDBMgA39":"A"},{"GDzz8yDN":"B"},{"dVD6Kv4p":"C"},{"0DKkMnDQ":"D"},{"OZagGGDz":"B"},{"v4NkaaZx":"B"},{"a4PG1WDr":"B"},{"m4m5W74N":"D"},{"QZVJy0Zj":"D"},{"6DWYY0ZG":"D"},{"Ya4wWQ4J":"A"},{"r6DWeZGy":"A"},{"b3J7zGDQ":"D"},{"y30YzEDJ":"A"},{"0DK0WR4Q":"C"},{"GDzGAl4N":"D"},{"a4PGoYDr":"C"},{"r4L7QnDL":"A"},{"x41mqm41":"A"},{"VDomm8ZB":"A"},{"XeDqGAZE":"A"},{"q7ZX8ZbE":"A"},{"yDdBP1Zr":"A"},{"M3ljQG4P":"C"},{"q3QKn84N":"D"},{"eDqwPXZE":"C"},{"QZVJMKZj":"B"},{"e3AJlkDr":"D"},{"7ZX07NZb":"C"},{"yDdr11Zr":"A"},{"WZRPVqDp":"D"},{"y30mlnDJ":"D"},{"0DKyGnZQ":"D"},{"7ZX0MmZb":"B"},{"q3QKX84N":"B"},{"VD6yBN3p":"C"},{"B3y87BZ0":"D"},{"yDdr2eZr":"A"},{"GZpYq83J":"C"},{"74rkJxZQ":"A"},{"QDBBOjD9":"D"},{"QZVJLPZj":"C"},{"AZ7Y0nDk":"B"},{"QZVJgKZj":"C"},{"7ZX0kNZb":"C"},{"B3yavl30":"D"},{"b3JpNw4Q":"A"},{"QD8x77Dl":"D"},{"j3kbaBZW":"B"},{"x41VAbZ1":"B"},{"7ZXPJOZb":"B"},{"j3k9zg4W":"A"},{"0ZvrvAZJ":"B"},{"a4P2963r":"D"},{"w3ORexZe":"B"},{"53b1qQZN":"D"},{"6DWYMvZG":"D"},{"q3Q8jQZN":"B"},{"v4NBbq4x":"A"},{"b3JKvXDQ":"B"},{"JZezxQ3d":"D"},{"a4PX8R4r":"C"},{"AD5YBXDr":"B"},{"x41EJN41":"A"},{"MZgAEMDy":"D"},{"VDoQeJZB":"A"},{"l49Wdz3L":"C"},{"VD6mXP3p":"B"},{"y30WXnZJ":"B"},{"l49Wr03L":"A"},{"94nv2N4K":"C"},{"b3Je9jZQ":"E"},{"64EvX9Z9":"C"},{"g4GBBmDO":"C"},{"GZp62bDJ":"D"},{"7ZXnYmDb":"E"},{"74rKomZQ":"C"},{"l49pQkDL":"A"},{"b3JzMz3Q":"D"},{"G32xjR4a":"D"},{"M3lgzBZP":"C"},{"0ZvbXaZJ":"B"},{"VDoGgBDB":"C"},{"b3Jzz63Q":"C"},{"q3QpbkZN":"B"},{"QZVwrp3j":"C"},{"MZgd8b3y":"B"},{"0DKmrNZQ":"E"},{"p4jrP14l":"D"},{"GDzexG3N":"C"},{"QDBexO39":"E"},{"yDdPGLDr":"D"},{"l49j2qZL":"A"},{"JZe7NgDd":"C"},{"WZRggx3p":"D"},{"94nz8p4K":"A"},{"eDqr2J4E":"B"},{"0ZvgbY3J":"D"},{"74rvKB4Q":"C"},{"QZVw2p3j":"E"},{"GZp6bbDJ":"C"},{"v4NQbEDx":"C"},{"B3yG1w40":"B"},{"g4GMJk3O":"A"},{"7ZXnmmDb":"D"},{"GZprj8DJ":"E"},{"QDBEyw39":"A"},{"GZprm8DJ":"E"},{"y3077JZJ":"A"},{"a4PPvY4r":"E"},{"e3AeXk3r":"D"},{"0ZvgRO3J":"A"},{"WZRvOkZp":"E"},{"Q3Y15n39":"D"},{"R3x25G4Y":"A"},{"Q3Y12n39":"A"},{"QD8PrXDl":"C"},{"OZaG7zDz":"A"},{"w3OrRgZe":"C"},{"74r6px4Q":"A"},{"r4LL2n4L":"B"},{"53bGBgDN":"D"},{"j3kN8kZW":"A"},{"GDzJaLDN":"B"},{"94nznY4K":"B"},{"b3JN7j3Q":"B"},{"AZ7b814k":"E"},{"G32q2GZa":"C"},{"OZaGEnDz":"C"},{"7ZXKNL4b":"D"},{"e3AeAy3r":"E"},{"l49xlNDL":"B"},{"VD6g2P4p":"C"},{"94nzQe4K":"A"},{"g4GBAmDO":"C"},{"x41xMgD1":"C"},{"w3OEYg4e":"C"},{"QDBPWjZ9":"B"},{"j3kEk64W":"A"},{"AZ7bYa4k":"B"},{"y30Vmo4J":"E"},{"a4PeMzZr":"D"},{"QZVwl03j":"C"},{"MZgdyL3y":"D"},{"B3y6nVD0":"A"},{"64El2zD9":"B"},{"y307JEZJ":"A"},{"MZgd6P3y":"C"},{"GDzePl3N":"B"},{"R3xe1rDY":"A"},{"b3JzEn3Q":"E"},{"0Zvg8n3J":"D"},{"53bGOyDN":"D"},{"VZMlvQ4q":"B"},{"OZa2gB3z":"D"},{"Q3YQlB39":"B"},{"0DKM2EZQ":"D"},{"a4PPaY4r":"B"},{"m4mro7ZN":"D"},{"GZp6WQDJ":"C"},{"QD8PBBDl":"C"},{"0DKMLqZQ":"E"},{"yDdPmwDr":"B"},{"p4jrdd4l":"E"},{"0DKM1jZQ":"A"},{"G32qQRZa":"D"},{"JZeprX4d":"D"},{"6DWrao3G":"A"},{"7ZXKl54b":"A"},{"Q3YQVB39":"A"},{"yDdP7mDr":"A"},{"R3xeorDY":"A"},{"AZ7dV83k":"D"},{"R3xe8VDY":"C"},{"x41xoMD1":"D"},{"eDq97JDE":"B"},{"g4GqYk3O":"C"},{"a4PeGYZr":"B"},{"M3lEnYDP":"E"},{"0DKXjq4Q":"B"},{"0DKXyq4Q":"C"},{"M3lQxJDP":"C"},{"VDoBnL3B":"C"},{"a4PjoP3r":"B"}];
    })();