// ==UserScript==
// @name         正在学在线
// @namespace    http://tampermonkey.net/
// @version      0.0.8
// @description  仅凭连接访问
// @author       Xiguayaodade
// @license      MIT
// @match        *://www.icce.shu.edu.cn/*
// @match        *://newsso.shu.edu.cn/*
// @match        *://www.learnin.com.cn/*
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
// @require      https://update.greasyfork.org/scripts/499395/1403559/jquery_360%E2%80%94%E2%80%94copy.js
// @downloadURL https://update.greasyfork.org/scripts/494938/%E6%AD%A3%E5%9C%A8%E5%AD%A6%E5%9C%A8%E7%BA%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/494938/%E6%AD%A3%E5%9C%A8%E5%AD%A6%E5%9C%A8%E7%BA%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals jQuery, $, waitForKeyElements */

    unsafeWindow.GM_getValue = GM_getValue
    unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest

    // 检查当前窗口是否为顶层窗口
    if (window.self !== window.top) {
        return; // 如果是顶层窗口，则不执行脚本
    }

    if(window.location.href.split('/',4).toString() === 'https:,,newsso.shu.edu.cn,login'){
        return;
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
                elevideo.play();
            },1500);
        };
        vdended = function(){
            console.log("xigua:结束播放");
            addMessage("xigua:结束播放");
            setTimeout(function(){
                if(window.location.href.split('/')[9] === 'learn'){
                    studyingPage();
                }
                else{
                    let videoCount = document.querySelector("#app > div > div.polyv-playback-page-container > div.global-playback-wrapper-container > div > div.catalog-panel > div.live-video-list > div > div.el-scrollbar__wrap > div").childElementCount;
                    studying(0,videoCount);
                }
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

        elevideo.volume = 0.1;
        setTimeout(function(){
            elevideo.play();
        },1000);
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
        var ddds4 = $('<div style="position: absolute;top: 85%;width:94%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;"><button id="deloldData" style="position: absolute;width:69px;right: 313px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">清空缓存</button><button id="beginExam" style="position: absolute;width:69px;right: 216px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">考试</button><a href="http://8.130.116.135/?article/" style="position: absolute;right: 10px;text-decoration: none;color: pink;">\u003e\u003e\u003e\u8054\u7cfb\u003a\u0031\u0039\u0030\u0038\u0032\u0034\u0035\u0033\u0030\u0032\u0040\u0071\u0071\u002e\u0063\u006f\u006d</a></div>');

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
            top: 10%;
            left: 70%;
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

        $("#deloldData").on('click',function(){
            ddds3.children().remove();
            // 获取所有存储的键
            const keys = GM_listValues();

            // 循环遍历并删除每个键值对
            keys.forEach(key => {
                GM_deleteValue(key);
            });
            addMessage("已清空缓存");
        });

        $("#beginExam").on('click',function(){
            ddds3.children().remove();
            if(window.location.href.split('/',8).toString() === 'https:,,www.learnin.com.cn,user,#,user,student,course'){
                let btn1 = document.querySelector("#app > div > div.page-student-course-topic-do-container > div.do-topic-header > div > div.function-btn.align-right").children[0].innerText;
                let btn2 = document.querySelector("#app > div > div.page-student-course-topic-do-container > div.do-topic-header > div > div.function-btn.align-right").children[1].innerText;

                if(btn1 === '保存并离开' && btn2 === '提交作业'){
                    addMessage("连接题库中...");


                    examIndex = 0;
                    if(document.querySelector("#app > div > div.page-student-course-topic-do-container > div.do-topic-body.store-topic > div > div > div.do-store-topic-content > div > div.group-item-body") != null){
                        getTitle();
                        examPageCount = document.querySelector("#app > div > div.page-student-course-topic-do-container > div.do-topic-body.store-topic > div > div > div.do-store-topic-content").childElementCount;
                        examAllCount = document.querySelector("#app > div > div.page-student-course-topic-do-container > div.do-topic-body.store-topic > div > div > div.do-store-topic-content > div > div.group-item-body").childElementCount;

                        setTimeout(() => {
                            addMessage("开始答题");
                            toggleOverlay(true);
                            beginExam();
                        },1000);
                    }else{
                        getTitleEng();
                        examAllCount = document.querySelector("#app > div > div.page-student-course-topic-do-container > div.do-topic-body.card-topic > div > div > div.student-topic-stem-sheet > div.topic-stem-sheet-text > div > div.el-scrollbar__wrap > div > div > div > div.answer-content-wrapper > div").childElementCount;

                        setTimeout(() => {
                            addMessage("开始答题");
                            toggleOverlay(true);
                            beginExamEng();
                        },1000);
                    }
                }
                else{
                    addMessage("此功能只在作业内生效");
                }
            }
            else{
                addMessage("此功能只在作业内生效");
            }
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

    var wait;

    function startSetInt(){
        wait = setInterval(function (){
            ddds3.children().remove();
            // addMessage(window.location.href);
            if(window.location.href.split('/',4).toString() === 'https:,,newsso.shu.edu.cn,login'){
                try{
                    addMessage("登录页，请登录");
                }catch(e){
                    addMessage(e);
                    addMessage("请登录");
                }
            }
            else if(window.location.href.split('/',5).toString() === 'https:,,www.icce.shu.edu.cn,Home,StudentIndex'){
                try{
                    addMessage("首页，请前往课程信息");
                    // window.open('https://cjxyol2.hebeinu.edu.cn/online/course/list','_blank');
                    clearInterval(wait);
                }catch(e){
                    addMessage(e);
                    addMessage("请登录");
                }
            }
            else if(window.location.href.split('/',5).toString() === 'https:,,www.icce.shu.edu.cn,StudentPortal,StudentSchedule'){
                try{
                    addMessage("课程表,请选择要学习的课程");
                    clearInterval(wait);
                }catch(e){
                    addMessage(e);
                    addMessage("请登录");
                }
            }
            else if(window.location.href.split('/')[9] === 'space'){
                try{

                    addMessage("章节列表");
                    let prHref = window.location.href;
                    GM_setValue('prHref',prHref);
                    document.querySelector("#courseSpaceStep2 > div:nth-child(1) > a").click();

                    setTimeout(function(){
                        if(document.querySelector("#tab-finished") != null){
                            document.querySelector("#tab-finished").click();
                            setTimeout(function(){
                                let liveCount = document.querySelector("#pane-finished").childElementCount;

                                serchLive(0,liveCount);
                            },500);
                        }
                        else{
                            document.querySelector("#app > div > div.page-student-course-space > div.page-header > div > div > div > div.track-wrap > div > div > div > div.logo-wrap > div.title.ellipsis").click();
                            setTimeout(function(){
                                document.querySelector("#courseSpaceStep4 > div.chapter-content > div > div.chapter-addition-statistics-to-study > a").click();
                            },1500);
                        }
                    },500);

                    clearInterval(wait);
                }catch(e){
                    addMessage(e);
                    addMessage("...请登录");
                }
            }
            else if(window.location.href.split('/')[9] === 'learn'){
                try{
                    addMessage("学习页");
                    // chapterCount = document.querySelector("#resType2List > tbody").childElementCount - 1;
                    if(document.getElementsByTagName('video')[0] === undefined){
                        if(document.querySelector("#app > div > div.page-student-course-outline-learn > div.learn-body > div.learn-main-content").children[0].className === 'layout-hint-index'){
                            addMessage("前往下一节");
                            document.querySelector("#app > div > div.page-student-course-outline-learn > div.learn-header > div.nav-btn > div.next-chapter.align-right > button").click();
                        }
                        else if(document.querySelector("#app > div > div.page-student-course-outline-learn > div.learn-body > div.learn-main-content > div > div.layout-body > div > div.cont-box > div > div.section-content-addition-document-preview-live-done > div.common-course-live-play-back > div > button") != null){
                            addMessage("直播回回放");
                            // document.querySelector("#app > div > div.page-student-course-outline-learn > div.learn-body > div.learn-main-content > div > div.layout-body > div > div.cont-box > div > div.section-content-addition-document-preview-live-done > div.common-course-live-play-back > div > button").click();
                            document.querySelector("#app > div > div.page-student-course-outline-learn > div.learn-header > div.nav-btn > div.next-chapter.align-right > button").click();
                        }
                        else{
                            addMessage("PPT与作业");
                            setTimeout(function(){
                                document.querySelector("#app > div > div.page-student-course-outline-learn > div.learn-header > div.nav-btn > div.next-chapter.align-right > button").click();
                            },3000);
                        }
                    }else{
                        studyingPage();
                        clearInterval(wait);
                    }
                }catch(e){
                    addMessage(e);
                    addMessage("请登录");
                }
            }
            else if(window.location.href.split('/')[9] === 'polyvCoursePlayBack'){
                try{
                    addMessage("直播回放");
                    let videoCount = document.querySelector("#app > div > div.polyv-playback-page-container > div.global-playback-wrapper-container > div > div.catalog-panel > div.live-video-list > div > div.el-scrollbar__wrap > div").childElementCount;
                    studying(0,videoCount);
                    clearInterval(wait);
                }catch(e){
                    addMessage(e);
                    addMessage("请登录");
                }
            }
            else if(window.location.href.split('/',8).toString() === 'https:,,www.learnin.com.cn,user,#,user,student,course'){
                try{
                    let btn1 = document.querySelector("#app > div > div.page-student-course-topic-do-container > div.do-topic-header > div > div.function-btn.align-right").children[0].innerText;
                    let btn2 = document.querySelector("#app > div > div.page-student-course-topic-do-container > div.do-topic-header > div > div.function-btn.align-right").children[1].innerText;

                    if(btn1 === '保存并离开' && btn2 === '提交作业'){
                        addMessage("连接题库中...");


                        examIndex = 0;
                        if(document.querySelector("#app > div > div.page-student-course-topic-do-container > div.do-topic-body.store-topic > div > div > div.do-store-topic-content > div > div.group-item-body") != null){
                            getTitle();
                            examPageCount = document.querySelector("#app > div > div.page-student-course-topic-do-container > div.do-topic-body.store-topic > div > div > div.do-store-topic-content").childElementCount;
                            examAllCount = document.querySelector("#app > div > div.page-student-course-topic-do-container > div.do-topic-body.store-topic > div > div > div.do-store-topic-content > div > div.group-item-body").childElementCount;

                            setTimeout(() => {
                                addMessage("开始答题");
                                toggleOverlay(true);
                                beginExam();
                            },1000);
                        }else{
                            getTitleEng();
                            examPageCount = document.querySelector("#app > div > div.page-student-course-topic-do-container > div.do-topic-body.store-topic > div > div > div.do-store-topic-content").childElementCount;

                            examAllCount = document.querySelector("#app > div > div.page-student-course-topic-do-container > div.do-topic-body.card-topic > div > div > div.student-topic-stem-sheet > div.topic-stem-sheet-text > div > div.el-scrollbar__wrap > div > div > div > div.answer-content-wrapper > div").childElementCount;

                            setTimeout(() => {
                                addMessage("开始答题(ENG)");
                                toggleOverlay(true);
                                beginExamEng();
                            },1000);
                        }
                    }
                    if(btn1 === '关闭' && btn2 === '继续答题' || btn2 === '重新答题'){
                        addMessage("错题页");
                        addMessage("连接题库中，请稍后...");
                        setTimeout(() => {
                            toggleOverlay(true);
                            getAnswer();
                        },1000);
                    }

                    clearInterval(wait);
                }catch(e){
                    addMessage(e);
                    addMessage("请登录");
                }
            }
            else{
                addMessage("请登录");
            }
        }, 3698);
    }

    startSetInt();

    function serchLive(index,count){
        if(index < count){
            let tableCount = document.querySelector("#pane-finished").children[index].children[1].children[0].childElementCount;
            let btnClassName = document.querySelector("#pane-finished").children[index].children[1].children[1].getElementsByTagName('button')[0].className;
            if(tableCount < 2 && btnClassName != 'el-button live-play-back-disabled-btn el-button--primary el-button--small is-round'){
                let titleLive = document.querySelector("#pane-finished").children[index].children[0].children[0].innerText;
                addMessage(titleLive);
                setTimeout(function(){
                    document.querySelector("#pane-finished").children[index].children[1].children[1].getElementsByTagName('button')[0].click();
                    addMessage("5秒后关闭窗口");
                    setTimeout(function(){
                        window.close();
                    },3000);
                },1000);
            }
            else{
                serchLive(++index,count);
            }
        }
        else{
            addMessage("直播学习完毕");
            document.querySelector("#app > div > div.page-student-course-space > div.page-header > div > div > div > div.track-wrap > div > div > div > div.logo-wrap > div.title.ellipsis").click();
            setTimeout(function(){
                document.querySelector("#courseSpaceStep4 > div.chapter-content > div > div.chapter-addition-statistics-to-study > a").click();
            },1500);
        }
    }

    function studying(index,count){
        if(index < count){
            let vdStatu = document.querySelector("#app > div > div.polyv-playback-page-container > div.global-playback-wrapper-container > div > div.catalog-panel > div.live-video-list > div > div.el-scrollbar__wrap > div").children[index].children[1].className;
            if(vdStatu != 'video-playback-state done'){
                document.querySelector("#app > div > div.polyv-playback-page-container > div.global-playback-wrapper-container > div > div.catalog-panel > div.live-video-list > div > div.el-scrollbar__wrap > div").children[index].children[2].click();
                setTimeout(function(){
                    if(document.getElementsByTagName('video')[0] != undefined){
                        removeLisenner();
                        addLisenner();
                    }
                },1000);
            }
            else{
                studying(++index,count)
            }
        }
        else{
            addMessage("直播回放完成");
            window.open(GM_getValue('prHref'),'_self');
            setTimeout(function(){
                window.location.reload();
            },2000);
        }

    }

    function studyingPage(){
        let stu1 = document.querySelector("#app > div > div.page-student-course-outline-learn > div.learn-body > div.learn-main-content > div > div.layout-body > div > div.cont-box > div > div > div.video-hint > div:nth-child(2)").getElementsByTagName('span')[1].innerText;
        let stu2 = document.querySelector("#app > div > div.page-student-course-outline-learn > div.learn-body > div.learn-main-content > div > div.layout-body > div > div.cont-box > div > div > div.video-hint > div:nth-child(2)").getElementsByTagName('span')[2].innerText;
        let cName = document.querySelector("#app > div > div.page-student-course-outline-learn > div.learn-header > div.chapter-section-title.ellipsis > span").innerText;
        if(stu1 <= stu2){
            addMessage(cName+"|学习完成");
            setTimeout(function(){
                document.querySelector("#app > div > div.page-student-course-outline-learn > div.learn-header > div.nav-btn > div.next-chapter.align-right > button").click();
                startSetInt();
            },800)
        }
        else{
            addMessage(cName+"|学习未完成");
            setTimeout(function(){
                removeLisenner();
                addLisenner();
            },3689);
        }
    }

    var parser = new DOMParser();
    function getStatus(){
        let ul = window.location.href;
        GM_xmlhttpRequest({
            url: ul,
            method: "GET",
            Cookie: '',
            onload: function(response) {
                let htmlDoc = parser.parseFromString(response.responseText, 'text/html');
                let targetElement = htmlDoc.querySelector('#resType2List > tbody').children[chapterId].children[3].innerText;
                console.log(targetElement);
                let st = parseInt(targetElement);
                if(st >= 100){
                    window.location.reload();
                }else{
                    setTimeout(function(){
                        studyStatus();
                    },5000);
                }
            }
        })
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

    function getAnswer(){
        $.ajax({
            url: 'https://www.learnin.com.cn/app/user/student/course/space/topic/appStudentCourseTopic/loadTopicData',
            method: 'POST',
            data: {'courseId': window.location.href.split('/')[8],'topicId': window.location.href.split('/')[10]},
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1"));
            },
            Cookie: document.cookie,
            success: function(response){
                let awRes = JSON.parse(response).topic.topicItems;
                console.log(awRes);
                let timeWait = 1000 * 2;
                if(awRes.length > 6){
                    timeWait = 1000 * 3;
                }

                for(let i=0; i<awRes.length; i++){
                    if(!awRes[i].childList){
                        awRes.forEach(obj => {
                            console.log(obj.id);
                            saveAnswer(obj.id,obj.answer);
                        });
                    }else{
                        awRes[i].childList.forEach(obj => {
                            console.log(obj.questionTitle);
                            if(obj.optionList === undefined){
                                saveAnswer(obj.questionTitle,obj.referenceAnswer);
                            }
                            else{
                                saveAnswer(obj.questionTitle,obj.optionList);
                            }
                        });
                    }
                }
                
                setTimeout(function(){
                    toggleOverlay(false);
                    addMessage('题库加载完毕');
                    addMessage('1.点击‘继续作答’刷新试卷。2.点击‘考试’开始答题');
                },timeWait);
            },
            error: function(){
                console.log('题库加载失败');
            }
        });
    }

    function getTitleEng(){
        $.ajax({
            url: 'https://www.learnin.com.cn/app/user/student/course/space/topic/appStudentCourseTopic/loadRedoTopicData',
            method: 'POST',
            data: {'courseId': window.location.href.split('/')[8],'topicId': window.location.href.split('/')[10]},
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1"));
            },
            Cookie: document.cookie,
            success: function(response){
                let awRes = JSON.parse(response).topic.topicItems;
                console.log(awRes);
                questionTitleList = awRes;
            },
            error: function(){
                console.log('题库加载失败');
            }
        })
    }

    function getTitle(page = 0){
        $.ajax({
            url: 'https://www.learnin.com.cn/app/user/student/course/space/topic/appStudentCourseTopic/loadRedoTopicData',
            method: 'POST',
            data: {'courseId': window.location.href.split('/')[8],'topicId': window.location.href.split('/')[10]},
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*\=\s*([^;]*).*$)|^.*$/, "$1"));
            },
            Cookie: document.cookie,
            success: function(response){
                console.log(response);
                let awRes = JSON.parse(response).topic.topicItems[page].childList;
                console.log(awRes);
                questionTitleList = awRes;
            },
            error: function(){
                console.log('题库加载失败');
            }
        });
    }

    function getLocalAnswer(){
        let oldData = GM_getValue('answerList');
        if (Array.isArray(oldData)) {
            return oldData;
        }
        return [];
    }


    function saveAnswer(qT,qL){
        let answerList = getLocalAnswer();
        let juge = answerList.some(obj => obj.hasOwnProperty(qT));

        if (juge) {
            console.log("答案已存在",qT);
            return false;
        }

        let tempMap = {};
        tempMap[qT] = qL;

        answerList.push(tempMap);

        console.log("保存答案",qT);

        GM_setValue('answerList',answerList);

        return true;
    }

    var radioIndex = 0;
    var checkboxIndex = 0;
    var radioCount = 0;
    var checkboxCount = 0;
    var examIndex = 0;
    var examAllCount = 0;
    var examPageIndex = 0;
    var examPageCount = 0;
    var questionTitleList;

    function beginExamEng(){
        let asLocal = getLocalAnswer();

        if(examIndex < examAllCount){
            let qusTitle = questionTitleList[examIndex].id;

            let result = asLocal.reduce((accumulator, obj) => {
                if (qusTitle in obj) {
                    return obj[qusTitle];
                }
                return accumulator;
            }, undefined);

            console.log('result1',result,examIndex);

            if (result !== undefined) {

                addMessage('onlineDATA:'+result);

                isTrueAnswerEng(0,result.length,result);

            } else {

                addMessage('result---undefind');
                let randomIndex = Math.floor(Math.random() * 4);
                document.querySelector("#app > div > div.page-student-course-topic-do-container > div.do-topic-body.card-topic > div > div > div.student-topic-stem-sheet > div.topic-stem-sheet-text > div > div.el-scrollbar__wrap > div > div > div > div.answer-content-wrapper > div").children[examIndex].children[0].children[1].children[randomIndex].click();
                examIndex++;
                setTimeout(function(){
                    beginExamEng();
                },100);
            }
        }else{
            console.log("答题结束");
            // ddds3.children().remove();
            addMessage("已完成答题，请提交");
            console.log('asLocal',asLocal);
            toggleOverlay(false);
        }
    }

    function beginExam(){
        let asLocal = getLocalAnswer();

        if(examIndex < examAllCount){
            let qusTitle = questionTitleList[examIndex].questionTitle;

            let result = asLocal.reduce((accumulator, obj) => {
                if (qusTitle in obj) {
                    return obj[qusTitle];
                }
                return accumulator;
            }, undefined);

            console.log('result1',result,examIndex);

            if (result !== undefined) {

                addMessage('onlineDATA:'+result);

                if(Array.isArray(result)){
                    console.log('类型选择题');
                    isTrueAnswer(0,result.length,result);
                    // inputRadio(0,result.length,result);
                    // examIndex++;
                    // beginExam();
                }else{
                    console.log('类型非选择');
                    inputQuestion(result);
                }
            } else {

                addMessage('result---undefind');
                // document.querySelector("#app > div > div.page-student-course-topic-do-container > div.do-topic-body.store-topic > div > div > div.do-store-topic-content").children[examPageIndex].getElementsByClassName('store-question-item-container')[examIndex].getElementsByClassName('question-option-list')[0].children[1].children[0].click();
                examIndex++;
                setTimeout(function(){
                    beginExam();
                },100);
            }
        }else{
            toggleOverlay(false);
            examPageIndex++;
            if(examPageIndex < examPageCount){
                getTitle(examPageIndex);
                examIndex = 0;
                examAllCount = document.querySelector("#app > div > div.page-student-course-topic-do-container > div.do-topic-body.store-topic > div > div > div.do-store-topic-content").children[examPageIndex].children[1].childElementCount;
                setTimeout(() => {
                    beginExam();
                },1000);
            }
            else{
                console.log("答题结束");
                // ddds3.children().remove();
                addMessage("已完成答题，请提交");
                console.log('asLocal',asLocal);
                toggleOverlay(false);
            }
        }
    }

    function isTrueAnswerEng(index,count,answerList){
        if(index < count){

            inputRadioEng(answerList[index]);

            setTimeout(function(){
                isTrueAnswerEng(++index,count,answerList);
            },200);
        }
        else{
            addMessage("ok");
            examIndex++;
            setTimeout(function(){
                beginExamEng();
            },200);
        }
    }

    function isTrueAnswer(index,count,answerList){
        if(index < count){

            if(answerList[index].isAnswer){

                inputRadio(index);

                setTimeout(function(){
                    isTrueAnswer(++index,count,answerList);
                },200);

            }
            else{
                isTrueAnswer(++index,count,answerList);
            }

        }
        else{
            addMessage("ok");
            examIndex++;
            setTimeout(function(){
                beginExam();
            },200);
        }
    }

    function inputQuestion(answerdata){
        document.querySelector("#app > div > div.page-student-course-topic-do-container > div.do-topic-body.store-topic > div > div > div.do-store-topic-content").children[examPageIndex].getElementsByClassName('store-question-item-container')[examIndex].getElementsByClassName('am-engine')[0].click();
        setTimeout(function(){
            document.querySelector("#app > div > div.page-student-course-topic-do-container > div.do-topic-body.store-topic > div > div > div.do-store-topic-content").children[examPageIndex].getElementsByClassName('store-question-item-container')[examIndex].getElementsByClassName('am-engine')[0].children[0].innerText = answerdata;

            setTimeout(function(){
                let outhml = document.querySelector("#app > div > div.page-student-course-topic-do-container > div.do-topic-body.store-topic > div > div > div.do-store-topic-content").children[examPageIndex].getElementsByClassName('store-question-item-container')[examIndex].getElementsByClassName('am-engine')[0].outerHTML;
                setTimeout(function(){
                    document.querySelector("#app > div > div.page-student-course-topic-do-container > div.do-topic-body.store-topic > div > div > div.do-store-topic-content").children[examPageIndex].getElementsByClassName('store-question-item-container')[examIndex].getElementsByClassName('resource-edit-box')[0].setAttribute('value',outhml);
                    addMessage("ok");
                    examIndex++;
                    setTimeout(function(){
                        beginExam();
                    },200);
                },200);
            },200);
        },800);
    }

    function inputRadioEng(index){
            switch(index)
            {
                case 'A':
                    console.log("第"+(examIndex+1)+"题选","A");
                    radioOkEng(0)
                    break;
                case 'B':
                    console.log("第"+(examIndex+1)+"题选","B");
                    radioOkEng(1)
                    break;
                case 'C':
                    console.log("第"+(examIndex+1)+"题选","C");
                    radioOkEng(2)
                    break;
                case 'D':
                    console.log("第"+(examIndex+1)+"题选","D");
                    radioOkEng(3)
                    break;
                case 'E':
                    console.log("第"+(examIndex+1)+"题选","E");
                    radioOkEng(4)
                    break;
            }
    }

    function inputRadio(index){
            switch(index)
            {
                case 0:
                    console.log("第"+(examIndex+1)+"题选","A");
                    radioOk(0)
                    break;
                case 1:
                    console.log("第"+(examIndex+1)+"题选","B");
                    radioOk(1)
                    break;
                case 2:
                    console.log("第"+(examIndex+1)+"题选","C");
                    radioOk(2)
                    break;
                case 3:
                    console.log("第"+(examIndex+1)+"题选","D");
                    radioOk(3)
                    break;
                case 4:
                    console.log("第"+(examIndex+1)+"题选","E");
                    radioOk(4)
                    break;
            }
    }

    function radioOkEng(index){
        if(document.querySelector("#app > div > div.page-student-course-topic-do-container > div.do-topic-body.card-topic > div > div > div.student-topic-stem-sheet > div.topic-stem-sheet-text > div > div.el-scrollbar__wrap > div > div > div > div.answer-content-wrapper > div").children[examIndex].children[0].children[1].children[index].className != 'topic-answer-option-tag selected'){
            document.querySelector("#app > div > div.page-student-course-topic-do-container > div.do-topic-body.card-topic > div > div > div.student-topic-stem-sheet > div.topic-stem-sheet-text > div > div.el-scrollbar__wrap > div > div > div > div.answer-content-wrapper > div").children[examIndex].children[0].children[1].children[index].click();
        }
    }

    function radioOk(index){
        if(document.querySelector("#app > div > div.page-student-course-topic-do-container > div.do-topic-body.store-topic > div > div > div.do-store-topic-content").children[examPageIndex].getElementsByClassName('store-question-item-container')[examIndex].getElementsByClassName('question-option-list')[0].children[1].children[0].className != 'option-index active can-do'){
            document.querySelector("#app > div > div.page-student-course-topic-do-container > div.do-topic-body.store-topic > div > div > div.do-store-topic-content").children[examPageIndex].getElementsByClassName('store-question-item-container')[examIndex].getElementsByClassName('question-option-list')[0].children[index].children[0].click();
        }
    }

})();