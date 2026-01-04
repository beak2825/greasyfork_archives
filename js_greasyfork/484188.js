// ==UserScript==
// @name         cangzhouzhiyejishu
// @version      0.1.1
// @description  storehouse
// @author       Xiguayaodade
// @license      MIT
// @match        *://*.cj-edu.com/*
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
    var courseIndex = 0;
    /**
     *capterCount
     *@type {int}
     */
    var capterCount = null;

     /**
     *capterCount
     *@type {int}
     */
    var allUrl = [
        'http://czvtc.cj-edu.com/?_role_tag',

    ];

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

    var isListening = false;

    //-----添加监听start------
    function addLisenner() {

        //获取播放器组件
        elevideo = document.getElementsByTagName("video")[0];

        vdplay = function(){
            let tm = 5 * 60 * 1000;
            console.log("xigua:\u5f00\u59cb\u64ad\u653e");
            addMessage("xigua:\u5f00\u59cb\u64ad\u653e");
            setTimeout(function(){
                addMessage("开始请求");
                console.log("跳转");
                linSten();
            },1000);
        };
        vdplaying = function(){
            clearInterval(stInter);
            console.log("xigua:\u6b63\u5728\u64ad\u653e");
            // addMessage("xigua:\u6b63\u5728\u64ad\u653e");
        };
        vdpause = function(){
            console.log("xigua:\u6682\u505c\u64ad\u653e");
            addMessage("xigua:\u6682\u505c\u64ad\u653e");
            setTimeout(function(){
                if(document.getElementsByClassName('el-dialog__wrapper')[0].style.display !== 'none'){
                    // document.getElementsByClassName("dialog-footer")[0].children[0].click();
                    addMessage("挂机响应_xol");
                }
                else{
                    setTimeout(function(){
                        addMessage("暂停");
                        // elevideo.play();
                        elevideo.playbackRate = 16;
                    },1000);
                }
            },1500);
        };
        vdended = function(){
            console.log("xigua:结束播放");
            addMessage("xigua:结束播放");
            setTimeout(function(){
                playVoide();
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

        elevideo.volume = 0;
        setTimeout(function(){
            elevideo.play();
            elevideo.playbackRate = 16;
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

    function sTime(){
        removeLisenner();
        addLisenner();
    }

    function playVoide(){
        let oldData = radeCharpterIndex();
        console.log('oldData',oldData);
        if(oldData.length < 1){
            addMessage("无待学章节...");
            let goUrl = radeIndexUrl();
            addMessage(goUrl+"radeIndexUrl");
            setTimeout(function(){
                window.open(goUrl,'_blank');
                window.close();
            },1500);
        }else{
            document.getElementsByClassName("el-menu-item")[oldData[0]].click();
            setTimeout(function(){
                removeCharpterIndex();
                removeLisenner();
                addLisenner();
                setTimeout(function(){
                    addMessage("开始请求");
                    console.log("跳转");
                    linSten();
                },1000);
            },500);
        }
    }

    function linSten(){
        isListening = true;
        let duration = document.getElementsByTagName("video")[0].duration - 9;
        let current = document.getElementsByTagName("video")[0].currentTime;
        addMessage(current+"<--"+duration);
        if(current < duration){
            document.getElementsByTagName("video")[0].currentTime = duration;
            setTimeout(function(){
                linSten();
            },3000);
        }
        else{
            addMessage("请求成功");
        }
    }

    function juCourse(){
        if(courseIndex < courseCount){
            let ariaValuenow = document.getElementsByClassName("courseList_")[0].children[0].children[courseIndex].children[1].getElementsByClassName("sj p_ limit_line_one")[3].children[1].getAttribute("aria-valuenow");
            let ariaValuenowInt = parseInt(ariaValuenow);
            if(ariaValuenowInt < 90){
                document.getElementsByClassName("courseList_")[0].children[0].children[courseIndex].children[1].getElementsByTagName("button")[0].click();
                window.close();
            }
            else{
                let courseName = document.getElementsByClassName("courseList_")[0].children[0].children[courseIndex].children[0].innerText;
                addMessage(courseName+"学习完毕...");
                courseIndex++;
                juCourse();
            }
        }
        else{
            addMessage("所有课程学习完毕...");
        }
    }

    function juCourseCaztc(){
        if(courseIndex < courseCount){
            addMessage("请选择要学习的课程...");
        }
        else{
            addMessage("所有课程学习完毕...");
        }
    }

    function juCharpter(){
        if(document.location.host === 'caztc.cj-edu.com'){
            juCharpterCaztc();
            return;
        }
        let strArray = document.getElementsByClassName("el-row")[4].getElementsByTagName("div")[6].innerText.split("/");
        let nowMin = parseInt(strArray[0]);
        let allMin = parseInt(strArray[1]);
        if(nowMin < allMin){
            let allCharpter = document.getElementsByClassName('record el-row')[0].children[1].children[2].children[0].children[1].getElementsByClassName("el-table__row").length;
            for(let i=0; i<allCharpter; i++){
                let stuText = document.getElementsByClassName('record el-row')[0].children[1].children[2].children[0].children[1].getElementsByClassName("el-table__row")[i].children[3].innerText;
                if(stuText === '立即学习'){
                    saveCharpterIndex(i);
                }
            }
            setTimeout(function(){
                let a = radeCharpterIndex();
                addMessage("@#$%",a);
                console.log("未完成章节索引",a);
                document.getElementsByClassName("el-button el-button--success")[0].click();
            },2000);
        }
        else{
            addMessage("该课程学习完毕...");
            clearInterval(wait);
        }
    }

    function juCharpterCaztc(){
        let strArray = document.getElementsByClassName("el-row")[4].getElementsByTagName("div")[6].innerText.split("/");
        let nowMin = parseInt(strArray[0]);
        let allMin = parseInt(strArray[1]);
        if(nowMin < allMin){
            let arr = document.querySelectorAll('.infinite-list-item');
            for(let i=0; i<arr.length; i++){
                console.log((i+1),"**********************");
                let bo = strProce(arr[i].innerText);
                console.log(bo);
                if(bo){
                    console.log("proInt < lastInt");
                    saveCharpterIndex(i);
                }
            }
            setTimeout(function(){
                let a = radeCharpterIndex();
                console.log("未完成章节索引",a);
                document.getElementsByClassName("el-button el-button--success")[0].click();
            },2000);
        }
        else{
            addMessage("该课程学习完毕...");
            clearInterval(wait);
        }
    }

    function strProce(str) {
        let arr1 = str.split("/");
        let proStr1 = arr1[0];
        let lastStr1 = arr1[1];
        let lastInt = parseInt(lastStr1);
        let proTest = /分钟|秒钟/.test(proStr1);
        if(proTest){
            let proStr2 = proStr1.split(" ");
            if(proStr2[proStr2.length - 2] === '分钟'){
                let proStr3 = proStr2[proStr2.length - 3];
                let proInt = parseInt(proStr3);
                return proInt<lastInt;
            }
            else{
                return 0<lastInt;
            }
        }
        else{
            return 0<lastInt;
        }
    }

    function juUrlInt(tpText){
        let nowUrl = window.location.href;
        let juStr = ""+tpText+"";
        let juInt = nowUrl.search(juStr);
        return juInt;
    }

    function saveIndexUrl(){
        let indexUrl = window.location.href;
        GM_setValue('indexUrl',indexUrl);
    }

    function radeIndexUrl(){
        return GM_getValue('indexUrl');
    }

    function radeCharpterIndex(){
        let oldData = GM_getValue('studyList');
        if (Array.isArray(oldData)) {
            return oldData;
        }
        return [];
    }

    function saveCharpterIndex(ind){
        let studyList = radeCharpterIndex();

        if (studyList.findIndex(value => value == ind) > -1) {
            addMessage("该章节已存在历史数据...");
            console.log("该章节已存在历史数据");
            return false;
        }

        studyList.push(ind);

        console.log(studyList);

        GM_setValue('studyList',studyList);

        return true;
    }

    function removeCharpterIndex(){
        let oldData = GM_getValue('studyList');
        oldData.splice(0,1);
        GM_setValue('studyList',oldData);
    }

    function juVDOk(){
        let elementsCount = document.getElementsByClassName('el-menu-item').length-1;
        let elements = document.getElementsByClassName('el-menu-item');
        let elementsArray = Array.from(elements);
        for(let i=0; i<elementsArray.length; i++){
            if(elementsArray[i].className === "el-menu-item is-active"){
                if(i < elementsCount){
                    // addMessage((i+1)+"节播放完毕");
                    // break;
                }else{
                    let goUrl = radeIndexUrl();
                    addMessage(goUrl+"radeIndexUrl");
                    window.open(goUrl,'_blank');
                    window.close();
                }
            }
            else{
                let vdStatus = document.getElementsByClassName('el-menu-item')[i].getElementsByClassName("el-col el-col-12")[1].innerText;
                if(vdStatus != '已完成'){
                    document.getElementsByClassName('el-menu-item')[i].click();
                }
            }
        }
    }

    //------等待网页加载完成start-----
    var wait = setInterval(function (){
        ddds3.children().remove();
        if(juUrlInt('onlineLearning') != -1 && juUrlInt('StartLeaonlineLearningrning') != 0){
            try {
                addMessage("课程列表...");
                saveIndexUrl();
                if(document.location.host === 'caztc.cj-edu.com'){
                    courseCount = document.getElementsByClassName("curriculum el-row")[0].childElementCount;
                    courseIndex = 0;
                    juCourseCaztc();
                }
                else{
                    courseCount = document.getElementsByClassName("courseList_")[0].children[0].childElementCount;
                    courseIndex = 0;
                    juCourse();
                }
                clearInterval(wait);
            }catch(e){
                addMessage("发现异常："+e+"|程序已终止运行...");
                clearInterval(wait);
                return;
            }
        }
        else if(juUrlInt('StartLearning') != -1 && juUrlInt('StartLearning') != 0){
            try {
                addMessage("章节列表...");
                setTimeout(function(){
                    juCharpter();
                },1500);
            }catch(e){
                addMessage("发现异常："+e+"|程序已终止运行...");
                clearInterval(wait);
                return;
            }
        }
        else if(juUrlInt('studyAuthentication') != -1 && juUrlInt('studyAuthentication') != 0){
            try {
                addMessage("学习页...");
                document.getElementsByTagName("video")[0].style.display = 'none';
                playVoide();
                clearInterval(wait);
            }catch(e){
                addMessage("发现异常："+e+"|程序已终止运行...");
                clearInterval(wait);
                return;
            }
        }
        else if(juUrlInt('server') != -1 && juUrlInt('server') != 0){
            try {
                addMessage("请登录");
            }catch(e){
                addMessage("发现异常："+e+"|程序已终止运行...");
                clearInterval(wait);
                return;
            }
        }
        else if(juUrlInt("role_tag") != -1 && juUrlInt("role_tag") != 0){
            addMessage("首页课程列表");
            document.getElementsByClassName("gd m10")[2].click();
            setTimeout(function(){
                saveIndexUrl();
                courseCount = document.getElementsByClassName("courseList_")[0].children[0].childElementCount;
                courseIndex = 0;
                juCourse();
            },2000);
            clearInterval(wait);
        }
        else{
            addMessage("未注册的域名，前往首页或联系注册");
        }
    }, 16000);
    //------等待网页加载完成end-----

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
        var ddds2 = $('<div style="position: absolute;top: 73%;width:94%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;">操作\uff1a<button id="speedxgtwo" style="position: absolute;width:128px;right: 168px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">异常手动请求</button><button id="speedxgone" style="position: absolute;width:88px;right: 38px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">清空缓存</button></div>');
        ddds3 = $('<div id="message-container" style="position: absolute;display: grid;align-content: center;justify-content: center;top: 20%;width:94%;height:52%;max-height:62%;overflow-y:auto;padding: 3px;background: #ffffff;border-radius: 5px;"></div>');
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

        // $("#speedxgsex").on('click',function(){
        //     document.querySelector("video").playbackRate=16;
        //     addMessage("\u500d\u901f\uff1a\u0058\u0031\u0036");
        // });

        $("#speedxgone").on('click',function(){
            GM_deleteValue("courseId");
            GM_deleteValue("studyList");
            ddds3.children().remove();
            addMessage("已清空缓存");
        });

        $("#speedxgtwo").on('click',function(){
            let duration = document.getElementsByTagName("video")[0].duration - 10;
            document.getElementsByTagName("video")[0].currentTime = duration;
            addMessage("执行成功...");
        });

        $("#switchButton").on('click',function(){
            if (speedonoff) {
                speedonoff = false;
                addMessage("\u500d\u901f\uff1a\u5173\u95ed");
                $("#switchButton").text("当前：关闭");
            } else {
                speedonoff = true;
                addMessage("\u500d\u901f\uff1a\u5f00\u542f");
                $("#switchButton").text("当前：开启");
            }
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
            if (ddds3.children().length >= 288) {
                ddds3.children().first().remove();
            }
            // 创建消息元素并添加到消息框容器
            var messageElement = $('<div class="message"></div>').text(message).css({
                'margin-bottom': '10px'
            }).appendTo(ddds3);
        }

    }
    panel();
    addMessage("\u002d\u002d\u002d\u002d\u6b63\u5728\u542f\u52a8\uff0c\u8bf7\u7a0d\u540e\u002e\u002e\u002e\u002d\u002d\u002d\u002d");
    })();