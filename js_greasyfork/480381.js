// ==UserScript==
// @name         ayjsryzxxx
// @version      0.0.3
// @description  storehouse
// @author       Xiguayaodade
// @license      MIT
// @match        *://gp.chinahrt.com/*
// @match        *://videoadmin.chinahrt.com/*
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
// @require      https://update.greasyfork.org/scripts/499395/1403559/jquery_360%E2%80%94%E2%80%94copy.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals jQuery, $, waitForKeyElements */
    unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest


    var speedonoff = false;
    var speedIn = null;
    var ddds3 = null;
    var addMessage = null;
    var login = null;

    let btn1=GM_registerMenuCommand ("\u4f5c\u8005\uff1a\ud83c\udf49\u897f\u74dc\u8981\u5927\u7684\ud83c\udf49", function(){
        confirm("Hello,\u611f\u8c22\u4f7f\u7528\ud83c\udf49\u897f\u74dc\u5237\u8bfe\u52a9\u624b\ud83c\udf49\uff01\u591a\u591a\u53cd\u9988\u54e6");
        GM_unregisterMenuCommand(btn1);
    }, "");
    let btn2=GM_registerMenuCommand ("\u4ed8\u8d39\u5185\u5bb9", function(){
        alert("\u9650\u65f6\u514d\u8d39\uff0c\u5168\u529b\u5f00\u53d1\u4e2d...");
    }, "p");

    // 检查当前窗口是否为顶层窗口
    if (window.self !== window.top) {
        return; // 如果不是顶层窗口，则不执行脚本
    }

    //存储当前课程数量
    var courseCount = 0;
    //存储当前课程索引
    var courseId = 1;
    //存储当前课程章节数量
    var chapterCount = 0;
    //存储当前课程章节索引
    var chapterId = 1;
    //存储课后练习/考试小题数量
    var questionCount = 0;
    //存放播放器组件
    var elevideo;
    //课后练习选择框索引
    var rediosIndex = 0;
    var COURSES = "courses";
    var nowUrl = null;


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
    var addLisenner = function(){

        //获取播放器组件
        elevideo = document.getElementsByTagName("video")[0];

        vdplay = function(){
            let tm = 5 * 60 * 1000;
            console.log("xigua:\u5f00\u59cb\u64ad\u653e");
            addMessage("xigua:\u5f00\u59cb\u64ad\u653e");
            speedIn = setInterval(function(){
                speedff();
            },tm);
        };
        vdplaying = function(){
            console.log("xigua:\u6b63\u5728\u64ad\u653e");
            addMessage("xigua:\u6b63\u5728\u64ad\u653e");
        };
        vdpause = function(){
            clearInterval(speedIn);
            console.log("xigua:\u6682\u505c\u64ad\u653e");
            addMessage("xigua:\u6682\u505c\u64ad\u653e");
            setTimeout(function(){
                if(document.getElementsByClassName("layui-layer layui-layer-dialog")[0] != null){
                    document.getElementsByClassName("layui-layer layui-layer-dialog")[0].getElementsByClassName("layui-layer-btn layui-layer-btn-")[0].getElementsByClassName("layui-layer-btn0")[0].click();
                }
            },1500);
        };
        vdended = function(){
            clearInterval(speedIn);
            console.log("xigua:结束播放，开始下一章");
            addMessage("xigua:结束播放，开始下一章");
            removeCourse(0);
            setTimeout(function(){
                readOldData();
            },1500);
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
            addMessage("执行：play()!!!");
            elevideo.play();
        },6666);
    }
    //-----添加监听end------

    //-----移除监听start---
    var removeLisenner = function(){
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

    //-----倍速start-----
    var speedff = function(){
        if(speedonoff){
            let vdText = document.getElementsByClassName("video-progress clearfix not-start")[0].getElementsByClassName("text")[0].getElementsByTagName("span")[1].innerText;
            if(parseFloat(vdText) <= 70){
                setTimeout(function(){
                    document.querySelector("video").playbackRate=16;
                    console.log("X16");
                    setTimeout(function(){
                        document.querySelector("video").playbackRate=1;
                        console.log("X1");
                    },800);
                },1000);
            }
        }else{
            addMessage("断点倍速状态：关闭");
        }
    }
    //-----倍速end-----


    function getCourses() {
        var value = GM_getValue(COURSES);
        if (Array.isArray(value)) {
            return value;
        }
        return [];
    }

    function getCoursesOk() {
        var value = GM_getValue("courseOk");
        if (Array.isArray(value)) {
            return value;
        }
        return [];
    }

    function addCourse(duc) {
        if (!duc.title || !duc.url) {
            console.error(duc);
            console.log("失败");
            return false;
        }

        var oldData = getCourses();

        if (oldData.findIndex(value => value.url == duc.url) > -1) {
            console.log("该章节已存在历史数据");
            return false;
        }

        oldData.push({title: duc.title, url: duc.url});

        GM_setValue(COURSES, oldData);

        return true;
    }

    function removeCourse(index) {
        var courses = getCourses();

        if (Number.isNaN(index)) {
            for (let i = courses.length; i >= 0; i--) {
                const element = courses[i];
                var jsonHref = element.url;
                var jsonSectionId = jsonHref.match(/sectionId=([^&]*)/)[1];
                var jsonCourseId = jsonHref.match(/courseId=([^&]*)/)[1];
                var jsonTrainplanId = jsonHref.match(/trainplanId=([^&]*)/)[1];

                var href = window.location.href;
                var sectionId = href.match(/sectionId=([^&]*)/)[1];
                var courseId = href.match(/courseId=([^&]*)/)[1];
                var trainplanId = href.match(/trainplanId=([^&]*)/)[1];

                if (jsonCourseId == courseId && jsonSectionId == sectionId && jsonTrainplanId == trainplanId) {
                    courses.splice(i, 1);
                }
            }
        } else {
            courses.splice(index, 1);
        }

        GM_setValue(COURSES, courses);
    }

    //------读取历史数据并跳转start------
    function readOldData(){
        addMessage("读取历史数据并跳转");
        console.log("读取历史数据并跳转");
        let oldData = getCourses();
        if(oldData.length > 0){
            addMessage("============================");
            console.log(oldData);
            addMessage("即将学习："+oldData[0].title);
            setTimeout(function(){
                window.open(oldData[0].url);
                setTimeout(function(){
                    window.close();
                },1000);
            },1000);
        }else{
            addMessage("当前课程无未完成章节，即将前往课程列表");
            console.log("当前课程无未完成章节，即将前往课程列表");
            setTimeout(function(){
                if(nowUrl.substring(0,52) === 'https://gp.chinahrt.com//index.html#/v_courseDetails'){
                    let courseInformation = document.querySelector("article")?.__vue__?._data?.pageData?.course;
                    GM_setValue("courseOk",courseInformation.id);
                    window.open(GM_getValue("courseListHref"));
                    setTimeout(function(){
                        window.close();
                    },2500);
                }else{
                    window.open(GM_getValue("courseListHref"), "_self");
                }
            },2500);
        }
    }
    //------读取历史数据并跳转end------

    //------检索未完成章节start------
    var search = function(){
        var totalData = document.querySelector("article")?.__vue__?._data;
        if (!totalData) {
            return;
        }
        var pageTotalData = totalData?.pageData;
        if (!pageTotalData) {
            return;
        }

        var chapters = pageTotalData?.course?.chapter_list;

        if (chapters && chapters.length > 0) {
            for (let i = 0; i < chapters.length; i++) {
                const chapter = chapters[i];
                var sections = chapter?.section_list;
                if (sections && sections.length > 0) {
                    for (let j = 0; j < sections.length; j++) {
                        const section = sections[j];
                        var url = window.location.protocol + "//" + window.location.host + window.location.pathname + "#/v_video?platformId=" + totalData.platformId + "&trainplanId=" + totalData.trainplanId + "&courseId=" + totalData.courseId + "&sectionId=" + section.id;
                        let se = {
                            title: section.name,
                            url: url,
                            status: section.study_status +"("+ section.studyTimeStr +")"
                        }
                        console.log("章节信息:{名称："+se.title+"}{地址："+se.url+"}{状态："+se.status+"}");
                        if(se.status.substring(0,3) !== '已学完'){
                            addCourse(se);
                            addMessage(se.title.substring(0,15)+"--"+se.status+"}");
                        }
                    }
                }
            }
        }
        setTimeout(function(){
            readOldData();
        },1000);
    }
    //------检索未完成章节end------

    //------检索未完成课程start------
    var searchUnEnd = function(){
        chapterCount = document.querySelectorAll("section")[1]?.__vue__?._data?.listData;
        if(chapterCount.length > 0 && chapterId <= chapterCount.length){
            let allCourseOk = getCoursesOk();
            if (allCourseOk.findIndex(value => value == chapterCount[chapterId-1].courseId) > -1) {
                addMessage(chapterCount[chapterId-1].courseName+"==已学习完毕,检索下一科");
                console.log(chapterCount[chapterId-1].courseName+"==已学习完毕,检索下一科");
                chapterId++;
                searchUnEnd();
            }else{
                addMessage(chapterCount[chapterId-1].courseName+"==学习中,即将进入");
                console.log(chapterCount[chapterId-1].courseName+"==学习中,即将进入");
                setTimeout(function(){
                    document.getElementsByClassName("course-list cb")[0].getElementsByTagName("li")[chapterId-1].getElementsByTagName("div")[0].getElementsByClassName("pr")[0].getElementsByTagName("span")[0].click();
                    setTimeout(function(){
                        window.close();
                    },1000);
                },2000);
            }
        }else{
            addMessage("所有课程学习完毕！");
            console.log("所有课程学习完毕！");
            GM_setValue("loginStatu",false);
        }
    }
    //------检索未完成课程end------


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
        var ddds2 = $('<div style="position: absolute;top: 73%;width:94%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;">\u65ad\u70b9\u500d\u901f\uff1a<button id="switchButton" style="position: absolute;width:98px;right: 200px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">当前：关闭</button><button id="speedxgone" style="position: absolute;width:88px;right: 58px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">清空缓存</button></div>');
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
            width: 422px;
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
            container.css({ width: 422 });
        });

        // $("#speedxgsex").on('click',function(){
        //     document.querySelector("video").playbackRate=16;
        //     addMessage("\u500d\u901f\uff1a\u0058\u0031\u0036");
        // });

        $("#speedxgone").on('click',function(){
            GM_deleteValue("courseId");
            GM_deleteValue(COURSES);
            GM_deleteValue("loginStatu");
            ddds3.children().remove();
            addMessage("已清空缓存");
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

        // login控件
        login = function(){
            ddds3.children().remove();
            let loginForm = $('<div id="loginForm"><div><input type="text" id="xgusername" placeholder="账号"></div><div><input type="password" id="xgpassword" placeholder="密码"></div><button id="xgsubmit" style="width:88px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">登录</button></div>');
            loginForm.appendTo(ddds3);
            $("#xgsubmit").on('click',function(){
                let username = $("#xgusername").val();
                let password = $("#xgpassword").val();
                if(username === '' || username === null || password === '' || password === null){
                    alert("用户名或密码不能为空!");
                }
                else{
                    console.log(username,password);
                    toLogin(username,password);
                }
            });
        }

    }

    function toLogin(use,pwd){
        var formData = "username="+use+"&password="+pwd;
        GM_xmlhttpRequest({
            url: "http://8.130.116.135/?member/login/",
            method: "POST",
            headers:{
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            data: formData,
            onload: function(response) {
                try{
                    var str = response.responseText;
                    var match = str.match(/\(([^)]+)\)/);
                    var content = match[1].substring(1,6);
                    if(content === "登录成功！"){
                        console.log(content);
                        ddds3.children().remove();
                        GM_setValue("loginStatu",true);
                        wait();
                    }
                    else if(match[1] === "/static/upload/image/20180412/1523501459462835.jpg"){
                        alert("获取到指纹，无需登录");
                        GM_setValue("loginStatu",true);
                        ddds3.children().remove();
                        wait();
                    }
                    else{
                        console.log("error:",match[1]);
                        alert("error:"+match[1]);
                    }
                }catch(e){
                    alert("xigua：服务器维护中！");
                }
            }
        })
    }

    panel();
    addMessage("\u002d\u002d\u002d\u002d\u6b63\u5728\u542f\u52a8\uff0c\u8bf7\u7a0d\u540e\u002e\u002e\u002e\u002d\u002d\u002d\u002d");
    setTimeout(function(){
        let loginStatu = GM_getValue("loginStatu");
        if(true){
            wait();
        }
        else{
            alert("xigua:请登录");
            login();
        }
    },2000);
    //------等待网页加载完成start-----
    var wait = function (){
        // setInterval(
        nowUrl = window.location.href;
        if(nowUrl.substring(0,54) === 'https://gp.chinahrt.com//index.html#/v_selected_course'){
            ddds3.children().first().remove();
            addMessage("课程列表");
            console.log("课程列表");
            GM_setValue("courseListHref",window.location.href);
            document.getElementsByClassName("taxonomic-rank cb mt10")[0].getElementsByClassName("right fr mr10")[0].getElementsByTagName("li")[1].getElementsByTagName("label")[0].click();
            setTimeout(function(){
                searchUnEnd();
            },2000);
        }else if(nowUrl.substring(0,44) === 'https://gp.chinahrt.com//index.html#/v_video'){
            ddds3.children().first().remove();
            addMessage("视频播放页(外框架)，请稍后...");
            console.log("视频播放页(外框架)，请稍后...");
            setTimeout(function(){
                window.open(document.getElementById('iframe').src, "_self");
            },3000);
        }else if(nowUrl.substring(0,52) === 'https://gp.chinahrt.com//index.html#/v_courseDetails'){
            ddds3.children().first().remove();
            addMessage("章节列表");
            console.log("章节列表");
            search();
        }else if(nowUrl.substring(0,46) === 'https://videoadmin.chinahrt.com/videoPlay/play'){
            ddds3.children().first().remove();
            addMessage("视频播放页(内框架)");
            console.log("视频播放页(内框架)");

            let nowCourse = getCourses();
            if(nowCourse.length > 0){
                addMessage("当前课程:"+nowCourse[0].title);
                console.log("当前课程:"+nowCourse[0].title);

                removeLisenner();
                setTimeout(function(){
                    addMessage("即将开始播放");
                    console.log("即将开始播放");
                    addLisenner();
                },1500);
            }else{
                addMessage("所有章节已完成，前往下一科目");
                console.log("所有章节已完成，前往下一科目");
                setTimeout(function(){
                    window.open(GM_getValue("courseListHref"), "_self");
                },2500);
            }
        }else{
            ddds3.children().first().remove();
            addMessage("请前往课程列表");
            console.log("请前往课程列表");
            setInterval(function(){
                window.location.reload();
            },8000);
        }
        // clearInterval(wait);
    }
    // , 5000);
    //------等待网页加载完成end-----

})();