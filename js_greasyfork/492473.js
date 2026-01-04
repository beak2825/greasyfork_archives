// ==UserScript==
// @name         qhts
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  storehouse
// @author       Xiguayaodade
// @license      MIT
// @match        *://www.tcm512.com/*
// @grant        GM_info
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_listValues
// @grant        GM_deleteValue
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
// @antifeature  free  限时免费
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals jQuery, $, waitForKeyElements */

    // 检查当前窗口是否为顶层窗口
    if (window.self !== window.top) {
        
    }else{
        return; // 如果是顶层窗口，则不执行脚本
    }

    var ddds3 = null;
    var addMessage = null;

    let btn1=GM_registerMenuCommand ("\u4f5c\u8005\uff1a\ud83c\udf49\u897f\u74dc\u8981\u5927\u7684\ud83c\udf49", function(){
        confirm("Hello,\u611f\u8c22\u4f7f\u7528\ud83c\udf49\u897f\u74dc\u5237\u8bfe\u52a9\u624b\ud83c\udf49\uff01\u591a\u591a\u53cd\u9988\u54e6");
        GM_unregisterMenuCommand(btn1);
    }, "");
    let btn2=GM_registerMenuCommand ("\u4ed8\u8d39\u5185\u5bb9", function(){
        alert("\u9650\u65f6\u514d\u8d39\uff0c\u5168\u529b\u5f00\u53d1\u4e2d...");
    }, "p");

    var chapterCount = 0;
    var chapterId = 1;
    var sectionCount = 0;
    var sectionId = 1;
    var search = null;
    var searchVD = null;
    var searchFC = null;
    let uL = null;
    var courseCount = 0;
    var courseIndex = 0;


    //----解决重复监听start----
    //视频组件
    var elevideo = null;
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

    var isListening = false;

    //-----添加监听start------
    function addLisenner() {

        //获取播放器组件
        elevideo = document.getElementsByTagName("video")[0];

        vdplay = function(){
            console.log("xigua:\u5f00\u59cb\u64ad\u653e");
            addMessage("xigua:\u5f00\u59cb\u64ad\u653e");
        };
        vdpause = function(){
            console.log("xigua:\u6682\u505c\u64ad\u653e");
            addMessage("xigua:\u6682\u505c\u64ad\u653e");
            setTimeout(function(){
                let x = document.getElementsByClassName('creatGroupBox')[0].style.display;
                if(x != '' && x != 'none'){
                    addMessage("xigua:滑块认证");
                    setTimeout(function(){
                        moveLabel();
                    },500);
                }else{
                    addMessage("xigua:手动暂停");
                }
            },1500);
        };
        vdended = function(){
            console.log("xigua:结束播放");
            addMessage("xigua:结束播放");
            setTimeout(function(){
                //总课程数
                courseCount = document.getElementsByClassName('new_bg').length;
                selectStudying(0,courseCount);
            },5000)
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

        elevideo.volume = 0.5;
        setTimeout(function(){
            elevideo.play();
        },1500);
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


    search = function(){
        if(chapterId <= chapterCount){
            if(sectionId <= sectionCount){
                addMessage("\u5171"+chapterCount+"\u7ae0\uff0c\u5f53\u524d\u7b2c"+chapterId+"\u7ae0\u7b2c"+sectionId+"\u8282\uff0c\u5171"+sectionCount+"\u8282\u3002");
                var xxjd = document.getElementsByClassName("subject-catalog subject-catalog-new")[0].getElementsByTagName("li")[chapterId-1].getElementsByClassName("item current-hover")[sectionId-1].getElementsByClassName("iconfont m-right")[1].innerText;
                if(xxjd === '重新学习'){
                    addMessage("\u7b2c"+chapterId+"\u7ae0\u7b2c"+sectionId+"\u8282\u5df2\u5b8c\u6210\uff0c\u68c0\u7d22\u4e0b\u4e00\u8282\u3002");
                    sectionId++;
                    search();
                }else{
                    addMessage("\u7b2c"+chapterId+"\u7ae0\u7b2c"+sectionId+"\u8282\u672a\u5b8c\u6210\uff0c\u5373\u5c06\u8fdb\u5165\u5b66\u4e60\u3002");
                    setTimeout(function(){
                        document.getElementsByClassName("subject-catalog subject-catalog-new")[0].getElementsByTagName("li")[chapterId-1].getElementsByClassName("item current-hover")[sectionId-1].getElementsByClassName("iconfont m-right")[1].click();
                    },1000);
                }
            }else{
                addMessage("\u5f53\u524d\u7ae0\u8282\u5df2\u5b8c\u6210\uff0c\u68c0\u7d22\u4e0b\u4e00\u7ae0\u3002");
                sectionId = 1;
                chapterId++;
                if(chapterId <= chapterCount){
                    sectionCount = document.getElementsByClassName("subject-catalog subject-catalog-new")[0].getElementsByTagName("li")[chapterId-1].getElementsByClassName("item current-hover").length;
                }
                search();
            }
        }else{
            addMessage("\u5b66\u4e60\u5b8c\u6210\uff0c\u9000\u51fa\uff01");
        }
    }

    searchVD = function(){
        if(document.getElementsByTagName('video')[0].ended){
            //总课程数
            courseCount = document.getElementsByClassName('new_bg').length;
            selectStudying(0,courseCount);
        }else{
            document.getElementsByTagName('video')[0].play();
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
        //var ddds2 = $('<div style="position: absolute;top: 50%;width:90%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;">\u89c6\u9891\u500d\u901f\uff1a<button id="speedxg" style="position: absolute;width:48px;right: 10px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">X16</button></div>');
        ddds3 = $('<div id="message-container" style="position: absolute;display: grid;align-content: center;justify-content: center;top: 20%;width:94%;height:62%;max-height:62%;overflow-y:auto;padding: 3px;background: #ffffff;border-radius: 5px;"></div>');
        var ddds4 = $('<div style="position: absolute;top: 85%;width:94%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;"><a href="http://8.130.116.135/?article/" style="position: absolute;right: 10px;text-decoration: none;color: pink;">\u003e\u003e\u003e\u8054\u7cfb\u003a\u0031\u0039\u0030\u0038\u0032\u0034\u0035\u0033\u0030\u0032\u0040\u0071\u0071\u002e\u0063\u006f\u006d</a></div>');

        container.append(titleBar);
        //content.append(ddds1);
        //content.append(ddds5);
        //content.append(ddds2);
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

        ddds3.on('mousewheel', function(event) {
            event.preventDefault();
            var scrollTop = ddds3.scrollTop();
            ddds3.scrollTop(scrollTop + event.originalEvent.deltaY);
        });

        addMessage = function(message){
            if (ddds3.children().length >= 288) {
                ddds3.children().first().remove();
            }
            var messageElement = $('<div class="message"></div>').text(message).css({
                'margin-bottom': '10px'
            }).appendTo(ddds3);
        }

    }

    panel();
    addMessage("\u002d\u002d\u002d\u002d\u6b63\u5728\u542f\u52a8\uff0c\u8bf7\u7a0d\u540e\u002e\u002e\u002e\u002d\u002d\u002d\u002d");

    var wait = setInterval(function (){
        ddds3.children().remove();
        addMessage(window.location.href);
        if(window.location.href.substring(0,65) === 'https://www.tcm512.com/pages_jsp/mobile/courseLearn.html?courseId' || window.location.href.substring(0,64) === 'http://www.tcm512.com/pages_jsp/mobile/courseLearn.html?courseId'){
            try{
                //总课程数
                courseCount = document.getElementsByClassName('new_bg').length;
                selectStudying(0,courseCount);
                clearInterval(wait);
            }catch(e){
                addMessage(e);
                addMessage("请登录");
            }
        }
        else if(window.location.href === 'https://www.tcm512.com/pages_jsp/sk_8zhongxin/s81_study_log.jsp' || window.location.href === 'http://www.tcm512.com/pages_jsp/sk_8zhongxin/s81_study_log.jsp'){
            try{
                addMessage("学习的课程");
                clearInterval(wait);
            }catch(e){
                addMessage(e);
                addMessage("请登录");
            }
        }
        else if(window.location.href.substring(0,55) === 'https://www.tcm512.com/pages_jsp/mobile/courseExam.html' || window.location.href.substring(0,54) === 'http://www.tcm512.com/pages_jsp/mobile/courseExam.html'){
            try{
                addMessage("请开始考试");
                clearInterval(wait);
            }catch(e){
                addMessage(e);
                addMessage("请登录");
            }
        }
        else if(window.location.href.substring(0,57) === 'https://www.tcm512.com/pages_jsp/mobile/courseAnswer.html' || window.location.href.substring(0,56) === 'http://www.tcm512.com/pages_jsp/mobile/courseAnswer.html'){
            try{
                addMessage("题库异步加载...");
                setTimeout(function(){
                    exam();
                    clearInterval(wait);
                },2500);
            }catch(e){
                addMessage(e);
                addMessage("请登录");
            }
        }
        else{
            addMessage("请登录");
        }
    }, 2000);


    function selectStudying(index,count){
        if(index < count){
            let studystate = document.getElementsByClassName('new_bg')[index].getElementsByClassName('studystate')[0].innerText;

            if(studystate === '未学' || studystate === '学习中'){
                addMessage(index+"|未完成");
                //选择课程
                document.getElementsByClassName('new_bg')[index].click();
                setTimeout(function(){
                    removeLisenner();
                    addLisenner();
                },1500);
            }

            if(studystate === '已学完'){
                addMessage(index+"|学习完毕");
                selectStudying(++index,count)
            }
        }
        else{
            addMessage("|所有课程学习完毕");
        }
    }

    function moveLabel(){

        // 获取要模拟长按和拖动的元素
        var element = document.getElementById('label');

        // 模拟鼠标按下事件
        var mouseDownEvent = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            view: null,
            clientX: element.getBoundingClientRect().left,
            clientY: element.getBoundingClientRect().top
        });

        // 模拟鼠标移动事件
        var mouseMoveEvent = new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            view: null,
            clientX: element.getBoundingClientRect().left + 256,
            clientY: element.getBoundingClientRect().top
        });

        // 模拟鼠标松开事件
        var mouseUpEvent = new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            view: null,
            clientX: element.getBoundingClientRect().left + 10,
            clientY: element.getBoundingClientRect().top
        });

        // 模拟长按事件
        element.dispatchEvent(mouseDownEvent);

        setTimeout(function(){
            element.dispatchEvent(mouseMoveEvent);
        },2000);

    }

    function exam(){
        //获取答案
        getAnswerList();
    }

    var answerList;
    var questionCount;
    var questionIndex = 0;
    function getAnswerList(){
        $.post("/xxpt/getTestQuestion.do",{subid:localStorage.getItem("sid"),batchId:localStorage.getItem("batchId")},function(data) {
            if (data.code === 20000){
                answerList = data.data.testQuestionlist;
                console.log(answerList);
                questionCount = document.querySelector("#qusData").childElementCount;
                examAction();
            }
            else{
                addMessage(data.message);
            }
        },"json");
    }

    function examAction(){
        if(questionIndex < questionCount){
            document.querySelector("body > div.tibox").children[questionIndex].click()
            let dataId = parseInt(getTidByIndex(questionIndex));

            let result = answerList.reduce((index,awObj) => {
                if (dataId === awObj.t_id) {
                    console.log('dataId === awObj.t_id');
                    return awObj.epr_acswer.split('#');
                }
                return index;
            }, undefined);

            if (result !== undefined) {

                console.log('result',result);
                inputRadio(0,result.length,result);

            } else {
                console.log('未找到答案');
            }

        }
        else{
            console.log("答题结束");
        }
    }

    function getTidByIndex(tIndex){
        return document.querySelector("#qusData").children[tIndex].dataset.id;
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

    function inputRadio(index,count,result){
        if(index < count){
            switch(result[index])
            {
                case 'A':
                    console.log("第"+(questionIndex+1)+"题选","A");
                    radioOk(1)
                    break;
                case 'B':
                    console.log("第"+(questionIndex+1)+"题选","B");
                    radioOk(2)
                    break;
                case 'C':
                    console.log("第"+(questionIndex+1)+"题选","C");
                    radioOk(3)
                    break;
                case 'D':
                    console.log("第"+(questionIndex+1)+"题选","D");
                    radioOk(4)
                    break;
                case 'E':
                    console.log("第"+(questionIndex+1)+"题选","E");
                    radioOk(5)
                    break;
            }
            setTimeout(function(){
                inputRadio(index+1,count,result);
            },200);
        }
        else{
            document.querySelector("#next").click();
            setTimeout(function(){
                addMessage((questionIndex+1)+"ok");
                questionIndex++;
                examAction();
            },500);
        }
    }

    function radioOk(index){
        if(document.querySelector("#qusData").children[questionIndex].children[1].children[index].className != 'option choose'){
            document.querySelector("#qusData").children[questionIndex].children[1].children[index].click();
        }
    }

})();