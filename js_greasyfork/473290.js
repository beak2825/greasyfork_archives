// ==UserScript==
// @name         棉花糖通用学习平台
// @namespace    http://tampermonkey.net/
// @version      0.2.8
// @description  仅凭连接访问，专业版
// @author       Xiguayaodade
// @license      MIT
// @match        *://learning.mhtall.com/*
// @match        *://se.mhtall.com/*
// @match        *://jlufe.mhtall.com/*
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
// @connect      learning.mhtall.com
// @antifeature  free  限时免费
// @require      https://update.greasyfork.org/scripts/499395/1403559/jquery_360%E2%80%94%E2%80%94copy.js
// @downloadURL https://update.greasyfork.org/scripts/473290/%E6%A3%89%E8%8A%B1%E7%B3%96%E9%80%9A%E7%94%A8%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/473290/%E6%A3%89%E8%8A%B1%E7%B3%96%E9%80%9A%E7%94%A8%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals jQuery, $, waitForKeyElements */

    unsafeWindow.GM_setValue = GM_setValue
    unsafeWindow.GM_getValue = GM_getValue
    unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest
    unsafeWindow.GM_deleteValue = GM_deleteValue

    // 检查当前窗口是否为顶层窗口
    if (window.self !== window.top) {
        return; // 如果不是顶层窗口，则不执行脚本
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
    var studyTime = 0;
    var totalTime = 0;
    var elementsArray = 0;
    var timeStr = null;
    var search = null;
    var searchVD = null;
    var searchFC = null;
    var coursIndex = 0;
    var allCours = 0;

    var nowUrl = "";
    /**
     * 请求地址
     * @type {string}
     */
    var href = 'https://learning.mhtall.com/rest/user/course/lesson/onexit?';
    /**
     * 获取cookie
     * @returns {*}
     */
    function getCookie(){
        return document.cookie;
    }
    /**
     * 获取course_id
     * @returns {*}
     */
    function courseId(url){
        const queryString = url.split('?')[1];
        const urlParams = new URLSearchParams(queryString);
        const course_id = urlParams.get('course_id');
        return course_id;
    }
    /**
     * 获取course_uuid
     * @returns {*}
     */
    function courseUuid(url){
        const queryString = url.split('?')[1];
        const urlParams = new URLSearchParams(queryString);
        const course_uuid = urlParams.get('course_uuid');
        return course_uuid;
    }
    /**
     * 获取course_code
     * @returns {*}
     */
    function courseCode(url){
        const queryString = url.split('?')[1];
        const urlParams = new URLSearchParams(queryString);
        const course_code = urlParams.get('course_code');
        return course_code;
    }
    /**
     * 获取lesson_id
     * @returns {*}
     */
    function lessonId(){
        return document.getElementsByClassName("chapter-course js-chapter-course")[sectionId-1].children[0].getAttribute("lesson-id");
    }
    /**
     * 获取video_position
     * @returns {*}
     */
    function videoPosition(){
        return document.getElementsByClassName("chapter-course js-chapter-course")[sectionId-1].children[0].getAttribute("video-position");
    }
    /**
     * 获取video_duration
     * @returns {*}
     */
    function getVdDuration(){
        timeStr = document.getElementsByClassName("course-list-header")[sectionId-1].getElementsByClassName("tt-suffix js-tt-suffix")[0].innerText;
        let a = timeStr.substring(7,9)
        let b = timeStr.substring(10,12)
        var videoDuration = (parseInt(a)*60) + parseInt(b)
        return videoDuration;
    }

    function saveHomeUrl(){
        let homeUrl = window.location.href;
        GM_setValue('homeUrl',homeUrl);
    }

    function getHomeUrl(){
        return GM_getValue('homeUrl');
    }

    function searchCours(){
        // https://se.mhtall.com/cuggw/rs/index
        if(coursIndex >= allCours){
            addMessage("所有课程学习完成");
        }
        else{
            let gradesStr1 = document.children[0].getElementsByTagName('tbody')[0].children[coursIndex].children[4].children[0].children[0].children[1].innerText.split(':')[1];
            let gradesStr2 = document.children[0].getElementsByTagName('tbody')[0].children[coursIndex].children[4].children[0].children[0].children[1].innerText.split(':')[2];
            // let gradesStr3 = document.children[0].getElementsByTagName('tbody')[0].children[coursIndex].children[4].children[0].children[0].children[1].innerText.split(':')[3];
            let grades1 = parseInt(gradesStr1);
            let grades2 = parseInt(gradesStr2);
            // let grades3 = parseInt(gradesStr3);+":"+grades3 && grades3 >= 90
            if(!GM_getValue('aotuTest')){
                grades2 = 100;
            }
            addMessage(grades1+":"+grades2);
            if(grades1 >= 80 && grades2 >= 90){
                addMessage("INDEX："+coursIndex+"|完成");
                coursIndex++;
                searchCours();
                setTimeout(function(){
                    window.close();
                },6000);
            }
            else{
                addMessage("INDEX："+coursIndex+"|未完成");
                allCours = 0;
                document.children[0].getElementsByTagName('tbody')[0].children[coursIndex].children[3].getElementsByTagName('button')[0].click();
                setTimeout(function(){
                    window.close();
                },6000);
            }
        }
    }

    search = function(){
        if(chapterId <= chapterCount){
            sectionCount = document.getElementsByClassName("task-part-list")[1].getElementsByClassName("task-part-item")[chapterId-1].getElementsByClassName("task-task-list").length;
            if(sectionCount > 1){
                addMessage("\u7b2c"+chapterId+"\u7ae0\u672a\u5b8c\u6210\uff0c\u5f00\u59cb\u5b66\u4e60\u3002");
                document.getElementsByClassName("task-part-list")[1].getElementsByClassName("task-part-item")[chapterId-1].getElementsByClassName("task-task-list")[0].getElementsByClassName("task-task-item task-item-jump")[0].click();
                setTimeout(function(){
                    window.close();
                },5000);
            }else{
                addMessage("\u7b2c"+chapterId+"\u7ae0\u5df2\u5b8c\u6210\uff0c\u68c0\u7d22\u7b2c\u4e00\u7ae0\u3002");
                sectionCount = 0;
                chapterId++;
                search();
            }
        }else{
            if(!GM_getValue('aotuTest')){
                addMessage("课程完成，10秒后回主页");
                setTimeout(function(){
                    window.open(getHomeUrl(), "_self");
                },10000);
            }else{
                addMessage("\u8bfe\u7a0b\u5df2\u5b8c\u6210\uff0c检查练习\uff01");
                document.querySelector("#js_tab").children[3].click();
                setTimeout(function(){
                    let practiceCount = document.querySelector("#js_exercise_tab > ul > table > tbody").childElementCount;
                    searchPractice(1,practiceCount);
                },1000);
            }

        }
    }

    var elements = null;
    searchVD = function(){
        elements = document.getElementsByClassName("title course-title js-course-title");
        nowUrl = window.location.href;
        elementsArray = Array.from(elements);
        for(let i=0; i<elementsArray.length; i++){
            if(elementsArray[i].className === "title course-title js-course-title course-active"){
                sectionId = i + 1;
                break;
            }
        }
        if(sectionId <= elementsArray.length){
            addMessage("\u5f53\u524d\u64ad\u653e\u7b2c"+sectionId+"\u4e2a\u89c6\u9891\u3002");
            document.getElementsByTagName("video")[0].volume = 0;
            document.getElementsByTagName("video")[0].play();
            let timeStr0 = document.getElementsByClassName("course-list-header")[sectionId-1].getElementsByClassName("tt-suffix js-tt-suffix")[0].innerText
            var searchJD = setInterval(function(){
                timeStr = document.getElementsByClassName("course-list-header")[sectionId-1].getElementsByClassName("tt-suffix js-tt-suffix")[0].innerText;
                if(parseInt(timeStr.substring(1,3)) >= parseInt(timeStr0.substring(7,9))){
                    if(parseInt(timeStr.substring(4,6)) >= parseInt(timeStr0.substring(10,12))){
                        addMessage("\u7b2c"+sectionId+"\u4e2a\u89c6\u9891\u64ad\u653e\u5b8c\u6210\u3002");
                        if(sectionId == elementsArray.length){
                            ddds3.children().remove();
                            addMessage("\u5f53\u524d\u79d1\u76ee\u5df2\u5b8c\u524d\u5f80\u4e0b\u4e00\u79d1\uff01");
                            clearInterval(searchJD);
                            // window.open("https://se.mhtall.com/cuggw/rs/index", "_blank");
                            window.open(getHomeUrl(), "_blank");
                        }else{
                            setTimeout(function(){
                                document.getElementsByClassName("course-list-header")[sectionId].click();
                                clearInterval(searchJD);
                                setTimeout(function(){
                                    searchVD();
                                },800);
                            },100);
                        }
                    }else{
                        addMessage("\u7b2c"+sectionId+"\u4e2a\u5373\u5c06\u5b8c\u6210\uff0c\u8bf7\u7a0d\u540e...");
                    }
                }else{
                    // addMessage("\u7b2c"+sectionId+"\u4e2a\u89c6\u9891\u5b66\u4e60\u4e2d\uff0c\u8bf7\u7b49\u5f85\u3002");
                    try{
                        GM_xmlhttpRequest({
                            url: href+"course_id="+courseId(nowUrl)+"&course_uuid="+courseUuid(nowUrl)+"&course_code="+courseCode(nowUrl)+"&client_type=99&lesson_id="+lessonId()+"&finish_len=11&video_position="+videoPosition()+"&video_duration="+getVdDuration(),
                            method: "GET",
                            Cookie: getCookie(),
                            onload: function(response) {
                                // addMessage("response"+response.responseText);
                            }
                        })
                    }
                    catch(e){
                        addMessage(e+"异常退出");
                    }
                }
            },168);
        }else{
            ddds3.children().remove();
            addMessage("\u5f53\u524d\u79d1\u76ee\u5df2\u5b8c\u524d\u5f80\u4e0b\u4e00\u79d1\uff01");
            clearInterval(searchJD);
            // window.open("https://se.mhtall.com/cuggw/rs/index", "_blank");
            window.open(getHomeUrl(), "_blank");
        }
    }

    function searchPractice(index,count){
        if(index < count){
            let scouerStr = document.querySelector("#js_exercise_tab > ul > table > tbody").children[index].children[8].innerText;
            let scouer = parseInt(scouerStr);
            if(scouer < 90){
                document.querySelector("#js_exercise_tab > ul > table > tbody").children[index].children[0].children[0].click();
                setTimeout(function(){
                    window.close();
                },5000);
            }
            else{
                addMessage(index+"完成");
                searchPractice(++index,count);
            }
        }
        else{
            addMessage("练习已完成，检查测评");
            document.querySelector("#js_tab").children[4].click();
            setTimeout(function(){
                let assessmentCount = document.querySelector("#js_exercise_testing_tab > ul > table > tbody").childElementCount;
                searchAssessment(1,assessmentCount);
            },1000);
        }
    }

    function searchAssessment(index,count){
        if(index < count){
            let scouerStr = document.querySelector("#js_exercise_testing_tab > ul > table > tbody").children[index].children[8].innerText;
            let scouer = parseInt(scouerStr);
            if(scouer < 90){
                document.querySelector("#js_exercise_testing_tab > ul > table > tbody").children[index].children[0].children[0].click();
                setTimeout(function(){
                    window.close();
                },1000);
            }
            else{
                addMessage(index+"完成");
                searchAssessment(++index,count);
            }
        }
        else{
            addMessage("测评已完成10秒后回主页");
            setTimeout(function(){
                window.open(getHomeUrl(), "_self");
            },10000);
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
        // var ddds1 = $('<div style="position: absolute;top: 85%;width:90%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;">\u70b9\u51fb\u542f\u52a8\uff1a<button id="beginExam" style="position: absolute;width:48px;right: 10px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">开始答题</button></div>');
        // var ddds5 = $('<div style="position: absolute;top: 35%;width:90%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;">\u70b9\u51fb\u542f\u52a8\uff1a<button id="stopxg" style="position: absolute;width:48px;right: 10px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">暂停</button></div>');
        //var ddds2 = $('<div style="position: absolute;top: 85%;width:90%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;">\u89c6\u9891\u500d\u901f\uff1a<button id="speedxg" style="position: absolute;width:48px;right: 10px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">X16</button></div>');
        ddds3 = $('<div id="message-container" style="position: absolute;display: grid;align-content: center;justify-content: center;top: 20%;width:94%;height:62%;max-height:62%;overflow-y:auto;padding: 3px;background: #ffffff;border-radius: 5px;"></div>');
        var ddds4 = $('<div style="position: absolute;top: 85%;width:94%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;"><button id="gmdel" style="position: absolute;width:28px;right: 375px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">DEL</button><button id="toExam" style="position: absolute;width:69px;right: 303px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">去考试</button><button id="beginExam" style="position: absolute;width:98px;right: 203px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">开始答题</button><button id="btnShouJi" style="position: absolute;width:49px;right: 150px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">收集</button><button id="btnAotu" style="position: absolute;width:129px;right: 10px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">自动答题：关闭</button></div>');

        container.append(titleBar);
        // content.append(ddds1);
        // content.append(ddds5);
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
            container.css({ width: 422 });
        });

        ddds3.on('mousewheel', function(event) {
            event.preventDefault();
            var scrollTop = ddds3.scrollTop();
            ddds3.scrollTop(scrollTop + event.originalEvent.deltaY);
        });

        $("#btnAotu").on('click',function(){
            if(!GM_getValue('aotuTest')){
                GM_setValue('aotuTest',true);
                $("#btnAotu").text("自动答题：开启");
            }
            else{
                GM_setValue('aotuTest',false);
                $("#btnAotu").text("自动答题：关闭");
            }
        });

        $("#beginExam").on('click',function(){
            beginExam();
        });

        $("#gmdel").on('click',function(){
            GM_deleteValue('mhtAnswerList');
        });

        $("#toExam").on('click',function(){
            if(window.location.host === 'se.mhtall.com'){
                window.open("https://se.mhtall.com/cuggw/rs/olex_index",'_blank');
                return;
            }
            window.open("https://"+window.location.host+"/"+window.location.host.split('.',1)+"/rs/olex_index",'_blank');
        });

        $("#btnShouJi").on('click',function(){
            toggleOverlay(true);
            ddds3.children().remove();
            addMessage("当前禁止点击，请不要关闭页面");
            addMessage("开始搜集，请稍后。。。");
            setTimeout(function(){
                try{
                    ksPage = document.querySelector("body > div.paper_body");
                    quesionCount = ksPage.getElementsByClassName('item_li').length;
                    radioIndex = 0;
                    shouJi();
                }catch(e){
                    ddds3.children().remove();
                    addMessage("违规操作，请刷新后重试");
                    console.log(e);
                    toggleOverlay(false);
                }
            },800);
        });

        addMessage = function(message){
            if (ddds3.children().length >= 15) {
                ddds3.children().first().remove();
            }
            var messageElement = $('<div class="message"></div>').text(message).css({
                'margin-bottom': '10px'
            }).appendTo(ddds3);
        }

    }

    function getAnswer(){
        let oldData = GM_getValue('mhtAnswerList');
        if (Array.isArray(oldData)) {
            return oldData;
        }
        return [];
    }

    function saveAnswer(answer_key,answer){
        let mhtAnswerList = getAnswer();
        let juge = mhtAnswerList.some(obj => obj.hasOwnProperty(answer_key));

        if (juge) {
            addMessage("该答案已存在...");
            console.log("该答案已存在");
            return false;
        }

        let tempMap = {};
        tempMap[answer_key] = answer;

        mhtAnswerList.push(tempMap);

        // console.log(mhtAnswerList);

        GM_setValue('mhtAnswerList',mhtAnswerList);

        return true;
    }

    var answer_key;

    function shouJi(){
        if(radioIndex < quesionCount){
            ksPage = document.querySelector("body > div.paper_body");

            //获取当前题目
            answer_key = ksPage.getElementsByClassName('item_li')[radioIndex].children[0].innerText.split('、')[1];
            //获取当前题目选项总数
            opCount = ksPage.getElementsByClassName('item_li')[radioIndex].children[1].childElementCount;
            console.log(quesionCount,radioIndex,opCount,answer_key);

            //获取答案
            nowXuanSJ(0,opCount);

        }else{
            addMessage("搜集完毕");
            toggleOverlay(false);
            // let as = getAnswer();
            // console.log(as);
            radioIndex = 0;
        }
    }

    panel();
    addMessage("\u002d\u002d\u002d\u002d\u6b63\u5728\u542f\u52a8\uff0c\u8bf7\u7a0d\u540e\u002e\u002e\u002e\u002d\u002d\u002d\u002d");
    if(!GM_getValue('aotuTest')){
        GM_setValue('aotuTest',false);
    }else{
        $("#btnAotu").text("自动答题：开启");
    }

    function tipsWin(){
        return new Promise((resolve, reject) => {

            var popup = document.createElement('div');
            popup.id = 'customPopup';
            popup.style.display = 'none';
            popup.style.position = 'fixed';
            popup.style.top = '50%';
            popup.style.left = '50%';
            popup.style.transform = 'translate(-50%, -50%)';
            popup.style.backgroundColor = '#fff';
            popup.style.padding = '20px';
            popup.style.border = '1px solid #ccc';
            popup.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
            popup.style.zIndex = '9999';
            popup.innerHTML = `
        <p id="timeCount">5秒后执行脚本?</p>
        <button id="confirmButton">是</button>
        <button id="cancelButton">否</button>
       `;

            document.body.appendChild(popup);

            var confirmButton = document.getElementById('confirmButton');
            var cancelButton = document.getElementById('cancelButton');
            var confirmed = false;
            let juNext = false;

            popup.style.display = 'block';

            confirmButton.addEventListener('click', function() {
                confirmed = true;
                closePopup();
                resolve(false);
            });

            cancelButton.addEventListener('click', function() {
                ddds3.children().remove();
                addMessage("刷新页面即可重启");
                addMessage("需要考试请点击“去考试”按钮，跳转后选择对应考试");
                confirmed = true;
                closePopup();
                resolve(true);
            });

            function ju(time){
                if(!confirmed){
                    if(time < 1){
                        popup.innerHTML = ` <p>时间到了! 脚本启动.</p>`;
                        setTimeout(function() {
                            closePopup();
                            resolve(false);
                            // setTimeout(function(){
                            //     // 手动启动定时器
                            //     startTimer();
                            //     window.open("https://jlufe.mhtall.com/jlufe/rs/roll_course");"_self"
                            //     window.close();
                            // },1000);
                        }, 1000);
                    }
                    document.getElementById('timeCount').innerText = time+'秒后执行脚本?'
                    setTimeout(function(){
                        ju(--time)
                    },1000);

                }
            }

            ju(5);

            function closePopup() {
                popup.style.display = 'none';
            }
        });

    }

    var wait = null;
    var overlay;

    // 手动启动定时器
    function startTimer() {
        wait = setInterval(function (){
            ddds3.children().first().remove();
            if(window.location.href.substring(0,51) === "https://learning.mhtall.com/play/course_detail.html"){
                addMessage("\u7ae0\u8282\u5217\u8868");

                tipsWin().then((result) => {
                    if(!result){
                        document.getElementsByClassName("tabs-tt")[5].click();
                        setTimeout(function(){
                            chapterCount = document.getElementsByClassName("task-part-list")[1].getElementsByClassName("task-part-item").length;
                            search();
                        },1000);
                    }else{
                        addMessage("取消");
                    }
                });

            }else if(window.location.href.substring(0,44) === "https://learning.mhtall.com/play/player.html"){
                addMessage("\u64ad\u653e\u9875");
                setTimeout(function(){
                    sectionCount = document.getElementsByClassName("title course-title js-course-title").length;
                    searchVD();
                    reloadPage();
                },1900);
            }
            else if(window.location.href === "https://se.mhtall.com/cuggw/rs/index"){
                addMessage("首页,可关闭此标签页");
                addMessage("如未自动跳转请查看浏览器地址栏将阻止弹窗设为允许");
                addMessage("将“阻止弹窗”设为允许后，刷新页面即可");
                addMessage("需要考试请点击“去考试”按钮，跳转后选择对应考试");
                saveHomeUrl();

                tipsWin().then((result) => {
                    if(!result){
                        setTimeout(function(){
                            window.open("https://se.mhtall.com/cuggw/rs/roll_course");"_self"
                            window.close();
                        },1000);
                    }else{
                        addMessage("取消");
                    }
                });

            }
            else if(window.location.href === 'https://jlufe.mhtall.com/jlufe/rs/index'){
                addMessage("首页,可关闭此标签页");
                addMessage("如未自动跳转请查看浏览器地址栏将阻止弹窗设为允许");
                addMessage("将“阻止弹窗”设为允许后，刷新页面即可");
                saveHomeUrl();

                tipsWin().then((result) => {
                    if(!result){
                        setTimeout(function(){
                            window.open("https://jlufe.mhtall.com/jlufe/rs/roll_course");"_self"
                            window.close();
                        },1000);
                    }else{
                        addMessage("取消");
                    }
                });

            }
            else if(window.location.href === "https://se.mhtall.com/hbun/rs/index"){
                addMessage("河北民族师范学院首页,可关闭此标签页");
                addMessage("如未自动跳转请查看浏览器地址栏将阻止弹窗设为允许");
                addMessage("将“阻止弹窗”设为允许后，刷新页面即可");
                saveHomeUrl();

                tipsWin().then((result) => {
                    if(!result){
                        setTimeout(function(){
                            window.open("https://se.mhtall.com/hbun/rs/roll_course");"_self"
                            window.close();
                        },1000);
                    }else{
                        addMessage("取消");
                    }
                });

            }
            else if(window.location.href === "https://se.mhtall.com/hrbeu/rs/index"){
                addMessage("哈尔滨工程大学首页,可关闭此标签页");
                addMessage("如未自动跳转请查看浏览器地址栏将阻止弹窗设为允许");
                addMessage("将“阻止弹窗”设为允许后，刷新页面即可");
                saveHomeUrl();

                tipsWin().then((result) => {
                    if(!result){
                        setTimeout(function(){
                            window.open("https://se.mhtall.com/hrbeu/rs/roll_course");"_self"
                            window.close();
                        },1000);
                    }else{
                        addMessage("取消");
                    }
                });

            }
            else if(window.location.href === "https://se.mhtall.com/cuggw/rs/roll_course"){
                addMessage("课程表1");
                // document.getElementsByClassName("el-submenu is-opened")[0].getElementsByClassName("el-menu")[0].children[4].click();
                tipsWin().then((result) => {
                    if(!result){
                        setTimeout(function(){
                            allCours = document.children[0].getElementsByTagName('tbody')[0].childElementCount;
                            searchCours();
                            clearInterval(wait);
                        },1900);
                    }else{
                        addMessage("取消");
                    }
                });

            }
            else if(window.location.href === "https://se.mhtall.com/hbun/rs/roll_course"){
                addMessage("课程表2");
                // document.getElementsByClassName("el-submenu is-opened")[0].getElementsByClassName("el-menu")[0].children[4].click();
                tipsWin().then((result) => {
                    if(!result){
                        allCours = document.children[0].getElementsByTagName('tbody')[0].childElementCount;
                        searchCours();
                        clearInterval(wait);
                    }else{
                        addMessage("取消");
                    }
                });
            }
            else if(window.location.href === "https://jlufe.mhtall.com/jlufe/rs/roll_course"){
                addMessage("课程表3");
                // document.getElementsByClassName("el-submenu is-opened")[0].getElementsByClassName("el-menu")[0].children[4].click();
                tipsWin().then((result) => {
                    if(!result){
                        setTimeout(function(){
                            allCours = document.children[0].getElementsByTagName('tbody')[0].childElementCount;
                            searchCours();
                            clearInterval(wait);
                        },1000);
                    }else{
                        addMessage("取消");
                    }
                });
            }
            else if(window.location.href === "https://se.mhtall.com/hrbeu/rs/roll_course"){
                addMessage("课程表4");
                // document.getElementsByClassName("el-submenu is-opened")[0].getElementsByClassName("el-menu")[0].children[4].click();
                tipsWin().then((result) => {
                    if(!result){
                        setTimeout(function(){
                            allCours = document.children[0].getElementsByTagName('tbody')[0].childElementCount;
                            searchCours();
                            clearInterval(wait);
                        },1000);
                    }else{
                        addMessage("取消");
                    }
                });
            }
            else if(window.location.href.split('/',7).join(',') === "https:,,learning.mhtall.com,rest,course,exercise,info"){
                addMessage("练习与测评");
                let tj = 17;
                let jr = 20;
                if(document.querySelector("#div_item > h5:nth-child(9)").innerText === '统计'){
                    tj = 12;
                    jr = 15;
                }
                if(parseInt(document.querySelector("#div_item > div:nth-child("+tj+")").innerText.split('：')[1]) >= 90){
                    addMessage("100分，退出");
                    setTimeout(function(){
                        window.close();
                    },5000);
                    clearInterval(wait);
                    return;
                }
                document.querySelector("#div_item > div:nth-child("+jr+") > button").click();
                setTimeout(function(){
                    document.querySelector("#layui-m-layer0 > div.layui-m-layermain > div > div > div.layui-m-layerbtn > span:nth-child(2)").click();
                },1000);
            }
            else if(window.location.href.split('/',7).join(',') === "https:,,learning.mhtall.com,rest,course,exercise,item"){
                let nowTitle = document.querySelector("head > title").innerText;
                addMessage(nowTitle);
                try{
                    radioIndex = parseInt(document.querySelector("#div_item > div:nth-child(3) > h4").innerText.split('、')[0]);
                }catch(e){
                    clearInterval(wait);
                }
                examAllCount = document.querySelector("body > div:nth-child(1) > div:nth-child(4)").querySelectorAll('.button_short').length;
                examAnswerNew();
            }
            else if(window.location.href.split('?',1).join(',') === 'https://jlufe.mhtall.com/jlufe/rs/olex_index' || window.location.href.split('?',1).join(',') === 'https://se.mhtall.com/cuggw/rs/olex_index'){
                addMessage("选择考试");
            }
            else if(window.location.href.split('?',1).join(',') === 'https://se.mhtall.com/cuggw/rs/olex_exam' || window.location.href.split('?',1).join(',') === 'https://jlufe.mhtall.com/jlufe/rs/olex_exam'){
                addMessage("考试页，请点击开始答题");
            }
            else if(window.location.href.split('=',1).join(',') === 'https://se.mhtall.com/cuggw/rs/olex_course_list?batch_id' || window.location.href.split('=',1).join(',') === 'https://jlufe.mhtall.com/jlufe/rs/olex_course_list?batch_id'){
                addMessage("考试列表，请选择要考试的课程");

                GM_xmlhttpRequest({
                    url: window.location.href.split('olex_course_list',1)[0]+'student/score_info?os=web',
                    method: "GET",
                    Cookie: document.cookie + 'JSESSIONID=1A4951B64EF2B97AD3CDEC76D3E0A493',
                    onload: function(response) {
                        console.log(response.response);
                        let courseData = JSON.parse(response.response).data;
                        saveCourseData(courseData);
                        console.log(JSON.parse(response.response));

                    }
                })

            }
            else{
                addMessage("登录即可");
            }
            clearInterval(wait);
        }, 100);
    }

    function getCourseData(){
        let oldData = GM_getValue('courseData');
        if (Array.isArray(oldData)) {
            return oldData;
        }
        return [];
    }

    function saveCourseData(data){
        let courseData = getCourseData();

        if(courseData.length < 1){
            console.log('无纪录，保存！');
            GM_setValue('courseData',data);
            return;
        }

        let juge;

        for(let i=0;i<data.length;i++){

            juge = courseData.some(obj => obj.courseCode === data[i].courseCode);

            if (juge) {
                console.log(data[i].courseCode,"已存在");
                continue;
            }

            console.log('新纪录，保存！',data[i].courseCode);
            courseData.push(data[i]);

            GM_setValue('courseData',courseData);
        }

    }

    // 手动停止定时器
    function stopTimer() {
        clearInterval(wait);
    }

    startTimer();

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

    function reloadPage(){
        setInterval(function (){
            window.location.reload()
        },1000*60*33);
    }

    var examAllCount;
    var radioIndex = 0;

    function testP(){
        GM_xmlhttpRequest({
            url: learningUrl,
            method: "GET",
            onload: function(response) {
                console.log(response);
            }
        })
    }

    function getAWOnline(nowQuesion){
        const encodedKeywords = encodeURIComponent(nowQuesion);
        GM_xmlhttpRequest({
            url:'https://learning.mhtall.com/rest/course/exercise/item/search/'+learningCourseId+'?keywords='+encodedKeywords,
            method: "GET",
            Cookie: document.cookie + 'JSESSIONID=1A4951B64EF2B97AD3CDEC76D3E0A493',
            onload: function(response) {
                try{
                    var parser = new DOMParser();
                    var htmlDoc = parser.parseFromString(response.responseText, 'text/html');
                    var targetElement1 = htmlDoc.getElementsByClassName('opt')[0];

                    console.log(parser);
                    console.log(htmlDoc);
                    console.log(nowQuesion);

                    //获取云端正确答案数量，用于判断单选或多选；（2为单选或判断，否则为多选）
                    var optionLength = targetElement1.getElementsByClassName('div_answer').length;
                    //获取选项内型，（1为图片，0为文本）
                    var optionType;
                    //获取正确选项元素
                    var targetElement2;
                    //获取正确答案
                    var answer1;


                    if(optionLength < 2){//单选
                        optionType = targetElement1.getElementsByClassName('div_answer')[0].childElementCount;
                        console.log('单选');
                        targetElement2 = targetElement1.getElementsByClassName('div_answer')[0];
                        if(optionType === 0){
                            answer1 = targetElement2.innerText.split('、')[1];
                        }
                        else{
                            answer1 = targetElement2.children[0].src.split('upload')[1];
                        }
                        answer11 = ('|'+ answer1);

                    }
                    else{//多选
                        answer1 = '';
                        for(let i=0;i<optionLength;i++){
                            optionType = targetElement1.getElementsByClassName('div_answer')[i].childElementCount;
                            console.log('多选');
                            targetElement2 = targetElement1.getElementsByClassName('div_answer');
                            if(optionType === 0 || optionType === undefined){
                                answer1 = answer1 + '|' + targetElement2[i].innerText.split('、')[1];
                            }
                            else{
                                answer1 = answer1 + '|' + targetElement2.children[i].src.split('upload')[1];
                            }
                        }
                        answer11 = answer1;

                    }

                    console.log(targetElement1);
                    console.log(targetElement2);
                    console.log(answer1);

                    saveAnswer(nowQuesion,answer11);

                    setTimeout(function(){
                        xuan(0,answer11);
                    },500);

                }catch(e){
                    console.log('e',e);
                    console.log('无答案');
                    answer11 = 'x';

                    addMessage((quesIndex+1)+"题无答案，请答题后采集");

                    setTimeout(function(){
                        quesIndex++;
                        examDing();
                    },500);
                }
            }
        })
    }

    function getAW(nq){
        let as1 = getAnswer();

        let result = as1.reduce((accumulator, obj) => {
            if (nq in obj) {
                return obj[nq];
            }
            return accumulator;
        }, undefined);

        if (result !== undefined) {
            console.log('result',result);
            let daan = result.split('|').slice(1);
            console.log('daan',daan);

            setTimeout(function(){
                xuan(0,daan);
            },500);
        } else {
            console.log('未找到答案');

            if(!coursOB){

                addMessage(coursOB);
                addMessage("题库没有找到该课程");
                addMessage((quesIndex+1)+"题无答案，请答题后采集");

                setTimeout(function(){
                    quesIndex++;
                    examDing();
                },500);
            }
            else{

                learningCourseId = coursOB.learningCourseId;
                learningUrl = coursOB.learningUrl;
                console.log("找到learningCourseId",learningCourseId);
                console.log("找到learningUrl",learningUrl);

                examOnline();
            }
        }

    }

    var ksPage
    var quesionCount;
    var quesIndex = 0;
    var answer11;
    var learningCourseId;
    var learningUrl;
    let coursOB;

    function beginExam(){
        console.log("开始答题");
        try{
            ksPage = document.querySelector("body > div.paper_body");
            let ksName = ksPage.children[0].innerText;
            quesionCount = ksPage.getElementsByClassName('item_li').length;
            coursOB = findLC(ksName);

            examDing();

            testP();

        }catch(e){
            addMessage("请前往考试页");
            console.log("异常",e)
        }


    }

    function findLC(cName){
        let ob = getCourseData().find(item => item.courseName === cName);
        return ob;
    }

    var opCount;
    var indexAnswer = '';

    function examOnline(){
        if(quesIndex < quesionCount){

            //获取当前题目
            let nowQuesion = ksPage.getElementsByClassName('item_li')[quesIndex].children[0].innerText.split('、')[1];
            //获取该题选项总数
            opCount = ksPage.getElementsByClassName('item_li')[quesIndex].children[1].childElementCount;
            //获取答案
            getAWOnline(nowQuesion);

        }else{
            addMessage("答题结束");
        }
    }

    function examDing(){
        if(quesIndex < quesionCount){

            console.log('-------'+quesIndex+'-------');

            //获取当前题目
            let nowQuesion = ksPage.getElementsByClassName('item_li')[quesIndex].children[0].innerText.split('、')[1];
            //获取该题选项总数
            opCount = ksPage.getElementsByClassName('item_li')[quesIndex].children[1].childElementCount;
            //获取答案
            getAW(nowQuesion);

        }else{
            addMessage("答题结束");
        }
    }

    function nowXuanSJ(index,opCount){

        console.log("index：",index,"opCount",opCount);
        if(index < opCount){
            //获取当前option是否已选择
            let isRadio = ksPage.getElementsByClassName('item_li')[radioIndex].children[1].children[index].children[0].checked;
            console.log("isRadio：",isRadio);

            if(isRadio){
                let answer2 = ksPage.getElementsByClassName('item_li')[radioIndex].children[1].children[index].innerText.split('、')[1];
                console.log("选择了：",answer2);
                indexAnswer = (indexAnswer +'|'+ answer2);
                nowXuanSJ(++index,opCount);
            }else{
                nowXuanSJ(++index,opCount);
            }

        }else{
            console.log((radioIndex+1),indexAnswer);

            if(indexAnswer === ''){
                console.log((radioIndex+1)+"题未选择，跳过");
                radioIndex++;
                shouJi();
                return;
            }

            if(saveAnswer(answer_key,indexAnswer)){
                console.log("正确答案记录成功...");
                indexAnswer = '';
            }else{
                console.log("正确答案记录失败...");
                indexAnswer = '';
            }
            radioIndex++;
            shouJi();
        }
    }

    function xuan(index,answerTrue){
        if(index < opCount){
            //获取当前option
            let answer2 = ksPage.getElementsByClassName('item_li')[quesIndex].children[1].children[index].innerText.split('、')[1];
            console.log('daan',answerTrue,'answer2',answer2);

            if (answerTrue.includes(answer2)) {
                console.log('选项匹配');
                ksPage.getElementsByClassName('item_li')[quesIndex].children[1].children[index].children[0].click();
                xuan(++index,answerTrue);
            } else {
                console.log('选项不匹配');
                xuan(++index,answerTrue);
            }

        }else{
            addMessage((quesIndex+1)+"题结束");
            setTimeout(function(){
                quesIndex++;
                examDing();
            },500);
        }
    }

    function getTrueAnswr(){
        let div_answer = document.querySelector("#div_item > div.div_answer").innerText.split('：')[1];
        return div_answer;
    }

    function examAnswerNew(){
        if(radioIndex <= examAllCount){

            let result = getTrueAnswr();


            if (result !== undefined) {
                console.log('result',result);

                inputRadio(0,result.length,result);

                setTimeout(function(){
                    // if(radioIndex == examAllCount){
                    //     addMessage("考试完毕，可以提交");
                    //     setTimeout(function(){
                    //         document.querySelector("body > div:nth-child(1) > div:nth-child(5) > button").click();
                    //         window.open(getHomeUrl(), "_blank");
                    //         setTimeout(function(){
                    //             document.querySelector("#layui-m-layer0 > div.layui-m-layermain > div > div > div.layui-m-layerbtn > span:nth-child(2)").click();
                    //             addMessage("测评已完成");
                    //         },1000);
                    //     },2000);
                    // }else{
                    //     document.querySelector("body > div:nth-child(1) > div:nth-child(4)").querySelectorAll('.button_short')[radioIndex].click();
                    // }
                    // setTimeout(function(){
                    //     examAnswerNew();
                    // },250);
                },983);
            } else {
                console.log('未找到模板，请联系更新');
            }
        }else{
            addMessage("考试完毕，可以提交");

            setTimeout(function(){

            },2000);
        }
    }

    function inputRadio(index,count,result){
        if(index < count){
            switch(result[index])
            {
                case 'A':
                    console.log("第"+(radioIndex)+"题选","A");
                    radioOk(0)
                    break;
                case 'B':
                    console.log("第"+(radioIndex)+"题选","B");
                    radioOk(1)
                    break;
                case 'C':
                    console.log("第"+(radioIndex)+"题选","C");
                    radioOk(2)
                    break;
                case 'D':
                    console.log("第"+(radioIndex)+"题选","D");
                    radioOk(3)
                    break;
                case 'E':
                    console.log("第"+(radioIndex)+"题选","E");
                    radioOk(4)
                    break;
            }
            setTimeout(function(){
                inputRadio(++index,count,result);
            },238);
        }
        else{
            addMessage("ok");
            if(radioIndex == examAllCount){
                addMessage("考试完毕，可以提交");
                setTimeout(function(){
                    document.querySelector("body > div:nth-child(1) > div:nth-child(5) > button").click();
                    window.open(getHomeUrl(), "_blank");
                    setTimeout(function(){
                        document.querySelector("#layui-m-layer0 > div.layui-m-layermain > div > div > div.layui-m-layerbtn > span:nth-child(2)").click();
                        addMessage("测评已完成");
                    },1000);
                },2000);
            }else{
                document.querySelector("body > div:nth-child(1) > div:nth-child(4)").querySelectorAll('.button_short')[radioIndex].click();
            }
        }
    }

    function radioOk(index){
        if(!document.querySelector("#div_item > div.opt").children[index].children[0].checked){
            document.querySelector("#div_item > div.opt").children[index].children[0].click();
        }
    }

    var czData = [
        {
            "learningCourseCode": "8DD87C2460ABE5D1-2018-S-20",
            "learningCourseId": "1903",
            "courseCode": "000001",
            "courseName": "思想道德修养与法律基础",
            "courseTypeName": "通识基础课",
            "creditHour": 2.5,
            "termNo": 1,
            "examNo": "20230",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "40",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">无</td><td align=center style=\"border:none\">100.0</td></tr></table>",
            "onlineCourse": "思想道德修养与法律基础",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3WzGynePtYBSsQ8u5rcajXWajj3eJxlGLixgtD193VqKSFWQLWXZFEhkeKHGdN8gqTje7rR9VikMQO4%2bpUNY1lYzmy8Ir11lPd7724eUf5lx%2bDWILOpGu%2bf%2bJB%2bT9VIR8R1XRaz9j%2bj2poM4aKc86ocNIG6Eiru1OwE033bTLgUiPCEjYwy82Rx6CvgzAFvU2ytJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 100,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "5FA9F953628112DD-2019-S-23",
            "learningCourseId": "10966",
            "courseCode": "000005",
            "courseName": "形势与政策",
            "courseTypeName": "通识基础课",
            "creditHour": 2.5,
            "termNo": 1,
            "examNo": "20230",
            "isPass": true,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": "是",
            "totalScore": "99",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">98.0</td><td align=center style=\"border:none\">100.0</td></tr></table>",
            "onlineCourse": "形势与政策",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3WzGynePtYBSsQ8u5rcajXWajj3eJxlGLixgtD193VqKSFWQLWXZFEhkeKHGdN8gqTje7rR9VikMQO4%2bpUNY1lYzmy8Ir11lPd7724eUf5lx%2bDWILOpGu%2bf%2bJB%2bT9VIR8ZroGWQiQMcLMfo3el5eA7RFatHdGODhBmXU16S%2fnp%2fa9tQpClIQgV1ICEW2nlwggytJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 100,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "0FA1D47C3E385913-2020-S-20",
            "learningCourseId": "12393",
            "courseCode": "000135",
            "courseName": "习近平新时代中国特色社会主义思想概论",
            "courseTypeName": "通识基础课",
            "creditHour": 2.5,
            "termNo": 1,
            "examNo": "20230",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "20",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">无</td><td align=center style=\"border:none\">50.0</td></tr></table>",
            "onlineCourse": "习近平新时代中国特色社会主义思想学习纲要",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3WzGynePtYBSsQ8u5rcajXWajj3eJxlGLixgtD193VqKSFWQLWXZFEhkeKHGdN8gqTje7rR9VikMQO4%2bpUNY1lYzmy8Ir11lPd7724eUf5lx%2bDWILOpGu%2bf%2bJB%2bT9VIR8UlkxvGhD5mmHqsM4qTi%2bhut39ScmQ37Iajwy6uaWXTPPCEjYwy82Rx6CvgzAFvU2ytJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 0,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "1473134FD896FAC4-2019-Z-23",
            "learningCourseId": "11085",
            "courseCode": "000136",
            "courseName": "心理健康",
            "courseTypeName": "通识基础课",
            "creditHour": 2,
            "termNo": 1,
            "examNo": "20230",
            "isPass": true,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": "是",
            "totalScore": "79",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">98.0</td><td align=center style=\"border:none\">50.0</td></tr></table>",
            "onlineCourse": "心理健康",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3WzGynePtYBSsQ8u5rcajXWajj3eJxlGLixgtD193VqKSFWQLWXZFEhkeKHGdN8gqTje7rR9VikMQO4%2bpUNY1lYzmy8Ir11lPd7724eUf5lx%2bDWILOpGu%2bf%2bJB%2bT9VIR8dNMcEigDcWiFp1EorEynPeTjirBQRAy8%2bw6sxVXM%2fnR9tQpClIQgV1ICEW2nlwggytJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 0,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "F4783DC42FA1644D-2019-S-51",
            "learningCourseId": "11303",
            "courseCode": "000006",
            "courseName": "大学计算机基础",
            "courseTypeName": "通识基础课",
            "creditHour": 1.5,
            "termNo": 1,
            "examNo": "20230",
            "isPass": true,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": "是",
            "totalScore": "78",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">96.0</td><td align=center style=\"border:none\">50.0</td></tr></table>",
            "onlineCourse": "大学计算机基础",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3WzGynePtYBSsQ8u5rcajXWajj3eJxlGLixgtD193VqKSFWQLWXZFEhkeKHGdN8gqTje7rR9VikMQO4%2bpUNY1lYzmy8Ir11lPd7724eUf5lx%2bDWILOpGu%2bf%2bJB%2bT9VIR8YfN%2f05Ha0Q5wll5gCC1WDMSMNa23b0F48LhSCHbr35tvZV9gTSd8u28TjK4uI6%2fgCtJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 0,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "6EFB883B3A067918-2018-S-23",
            "learningCourseId": "10792",
            "courseCode": "000045",
            "courseName": "程序设计基础",
            "courseTypeName": "专业主干课",
            "creditHour": 4,
            "termNo": 1,
            "examNo": "20230",
            "isPass": true,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": "是",
            "totalScore": "75",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">92.0</td><td align=center style=\"border:none\">50.0</td></tr></table>",
            "onlineCourse": "程序设计基础",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3WzGynePtYBSsQ8u5rcajXWajj3eJxlGLixgtD193VqKSFWQLWXZFEhkeKHGdN8gqTje7rR9VikMQO4%2bpUNY1lYzmy8Ir11lPd7724eUf5lx%2bDWILOpGu%2bf%2bJB%2bT9VIR8Ws9NSYzQuXbE9qUBKlpLArOfd8%2bZwCsNEUbafuiGH4X9tQpClIQgV1ICEW2nlwggytJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 0,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "64EBCCFE0964536A-2018-S-23",
            "learningCourseId": "10602",
            "courseCode": "000150",
            "courseName": "程序设计实践",
            "courseTypeName": "实践课程",
            "creditHour": 2,
            "termNo": 1,
            "examNo": "20230",
            "isPass": true,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": "是",
            "totalScore": "60",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">66.0</td><td align=center style=\"border:none\">50.0</td></tr></table>",
            "onlineCourse": "JAVA面向对象程序设计",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3WzGynePtYBSsQ8u5rcajXWajj3eJxlGLixgtD193VqKSFWQLWXZFEhkeKHGdN8gqTje7rR9VikMQO4%2bpUNY1lYzmy8Ir11lPd7724eUf5lx%2bDWILOpGu%2bf%2bJB%2bT9VIR8Y381VnH9cjuMBqRA6GE9e%2bqIWcsmzQeStCq%2bpJEW6uL9tQpClIQgV1ICEW2nlwggytJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 0,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "4115B95EB0262E8F-2019-S-23",
            "learningCourseId": "11093",
            "courseCode": "000002",
            "courseName": "中国近现代史纲要",
            "courseTypeName": "通识基础课",
            "creditHour": 2.5,
            "termNo": 2,
            "examNo": "20231",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "40",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">无</td><td align=center style=\"border:none\">100.0</td></tr></table>",
            "onlineCourse": "中国近现代史纲要",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3WzGynePtYBSsQ8u5rcajXWajj3eJxlGLixgtD193VqKSFWQLWXZFEhkeKHGdN8gqTje7rR9VikMQO4%2bpUNY1lanCemRvW0O0isnFL38QmBi%2bDWILOpGu%2bf%2bJB%2bT9VIR8fQK9kXhj7kWwBfSaoRON%2b%2bUiHrb4QxdtZSHR%2fZ%2fYt1g9tQpClIQgV1ICEW2nlwggytJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 100,
            "scoreTesting": 100,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "D93DA5689F31820E-2019-S-23",
            "learningCourseId": "11503",
            "courseCode": "000046",
            "courseName": "数据结构基础",
            "courseTypeName": "专业主干课",
            "creditHour": 4,
            "termNo": 2,
            "examNo": "20231",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "40",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">无</td><td align=center style=\"border:none\">100.0</td></tr></table>",
            "onlineCourse": "数据结构",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3WzGynePtYBSsQ8u5rcajXWajj3eJxlGLixgtD193VqKSFWQLWXZFEhkeKHGdN8gqTje7rR9VikMQO4%2bpUNY1lanCemRvW0O0isnFL38QmBi%2bDWILOpGu%2bf%2bJB%2bT9VIR8ViIyNaMfpzeMsLRqW4Ru36oCoxfeYXRIqg0p45UYiQj9tQpClIQgV1ICEW2nlwggytJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 100,
            "scoreTesting": 100,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "8B9624547A30467E-2019-Z-23",
            "learningCourseId": "11412",
            "courseCode": "000047",
            "courseName": "Java程序设计",
            "courseTypeName": "专业主干课",
            "creditHour": 3,
            "termNo": 2,
            "examNo": "20231",
            "isPass": true,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": "是",
            "totalScore": "94",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">90.0</td><td align=center style=\"border:none\">100.0</td></tr></table>",
            "onlineCourse": "Java程序设计",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3WzGynePtYBSsQ8u5rcajXWajj3eJxlGLixgtD193VqKSFWQLWXZFEhkeKHGdN8gqTje7rR9VikMQO4%2bpUNY1lanCemRvW0O0isnFL38QmBi%2bDWILOpGu%2bf%2bJB%2bT9VIR8WeXwgnXGvHAsmDb0Dw15vg2naApesd1Ojj2hQ4ywSrF9tQpClIQgV1ICEW2nlwggytJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 100,
            "scoreTesting": 100,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "CA9715E058804054-2018-S-23",
            "learningCourseId": "10611",
            "courseCode": "000061",
            "courseName": "数字电子技术",
            "courseTypeName": "专业主干课",
            "creditHour": 4,
            "termNo": 2,
            "examNo": "20231",
            "isPass": true,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": "是",
            "totalScore": "98",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">96.0</td><td align=center style=\"border:none\">100.0</td></tr></table>",
            "onlineCourse": "数字电子技术",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3WzGynePtYBSsQ8u5rcajXWajj3eJxlGLixgtD193VqKSFWQLWXZFEhkeKHGdN8gqTje7rR9VikMQO4%2bpUNY1lanCemRvW0O0isnFL38QmBi%2bDWILOpGu%2bf%2bJB%2bT9VIR8cg%2b4rqgp9t0M7kRfAIu%2bj%2bSwQOHXyeFJfXFSFjlzv3p9tQpClIQgV1ICEW2nlwggytJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 100,
            "scoreTesting": 100,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "ED7CCF03A4D3A4F5-2018-S-23",
            "learningCourseId": "10746",
            "courseCode": "000147",
            "courseName": "离散数学",
            "courseTypeName": "专业主干课",
            "creditHour": 4,
            "termNo": 2,
            "examNo": "20231",
            "isPass": true,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": "是",
            "totalScore": "90",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">84.0</td><td align=center style=\"border:none\">100.0</td></tr></table>",
            "onlineCourse": "离散数学",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3WzGynePtYBSsQ8u5rcajXWajj3eJxlGLixgtD193VqKSFWQLWXZFEhkeKHGdN8gqTje7rR9VikMQO4%2bpUNY1lanCemRvW0O0isnFL38QmBi%2bDWILOpGu%2bf%2bJB%2bT9VIR8X93oTkfQLFvq%2fS9Wv71cAwiWXh%2bl3Bhlqiok%2fGv8l3A9tQpClIQgV1ICEW2nlwggytJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 100,
            "scoreTesting": 100,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "59C3D83F068A0E63-2019-S-23",
            "learningCourseId": "11415",
            "courseCode": "000048",
            "courseName": "操作系统原理",
            "courseTypeName": "专业主干课",
            "creditHour": 4,
            "termNo": 2,
            "examNo": "20231",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "40",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">无</td><td align=center style=\"border:none\">99.2</td></tr></table>",
            "onlineCourse": "操作系统原理",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3WzGynePtYBSsQ8u5rcajXWajj3eJxlGLixgtD193VqKSFWQLWXZFEhkeKHGdN8gqTje7rR9VikMQO4%2bpUNY1lanCemRvW0O0isnFL38QmBi%2bDWILOpGu%2bf%2bJB%2bT9VIR8W%2f212zEsnrsFO39IVS8Yp3r8GhXnAW8iJJ1P5CsLGqI9tQpClIQgV1ICEW2nlwggytJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 98.3,
            "scoreTesting": 97.5,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "8F3A7089B34BA7ED-2018-S-23",
            "learningCourseId": "10631",
            "courseCode": "000003",
            "courseName": "马克思主义基本原理",
            "courseTypeName": "通识基础课",
            "creditHour": 3,
            "termNo": 3,
            "examNo": "20240",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "40",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">无</td><td align=center style=\"border:none\">99.2</td></tr></table>",
            "onlineCourse": "马克思主义基本原理概论",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3WzGynePtYBSsQ8u5rcajXWajj3eJxlGLixgtD193VqKSFWQLWXZFEhkeKHGdN8gqTje7rR9VikMQO4%2bpUNY1lZcQakgGVYQNqVzgEu0IAid%2bDWILOpGu%2bf%2bJB%2bT9VIR8afQ1DdGQy7aTqlMJXcYrZ0vh7P3eqsAzLCBFOk%2be4lb9tQpClIQgV1ICEW2nlwggytJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 98.3,
            "scoreTesting": 100,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "0EC7C0549E432D2F-2014-T-01",
            "learningCourseId": "847",
            "courseCode": "000007",
            "courseName": "大学英语(三)",
            "courseTypeName": "通识基础课",
            "creditHour": 3.5,
            "termNo": 3,
            "examNo": "20240",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "40",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">无</td><td align=center style=\"border:none\">100.0</td></tr></table>",
            "onlineCourse": "大学英语3",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3WzGynePtYBSsQ8u5rcajXWajj3eJxlGLixgtD193VqKSFWQLWXZFEhkeKHGdN8gqTje7rR9VikMQO4%2bpUNY1lZcQakgGVYQNqVzgEu0IAid%2bDWILOpGu%2bf%2bJB%2bT9VIR8RnWLNzVWrYy84xQWXVaa18DIVGj4yZm8w0BrLz19dk0RALrSHmyRKdruiOZLUMzACtJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 100,
            "scoreTesting": 100,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "276A9A9017462775-2018-S-23",
            "learningCourseId": "10226",
            "courseCode": "000049",
            "courseName": "计算机组成与结构",
            "courseTypeName": "专业主干课",
            "creditHour": 5,
            "termNo": 3,
            "examNo": "20240",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "40",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">无</td><td align=center style=\"border:none\">100.0</td></tr></table>",
            "onlineCourse": "计算机组成原理",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3WzGynePtYBSsQ8u5rcajXWajj3eJxlGLixgtD193VqKSFWQLWXZFEhkeKHGdN8gqTje7rR9VikMQO4%2bpUNY1lZcQakgGVYQNqVzgEu0IAid%2bDWILOpGu%2bf%2bJB%2bT9VIR8WbHeJDm%2f9wMHBnVJTk6IamafpG2GrvIiLIrvsRclxIN9tQpClIQgV1ICEW2nlwggytJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 100,
            "scoreTesting": 100,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "4C34F619C87B056F-2018-S-23",
            "learningCourseId": "10791",
            "courseCode": "000050",
            "courseName": "计算机网络原理",
            "courseTypeName": "专业主干课",
            "creditHour": 4,
            "termNo": 3,
            "examNo": "20240",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "40",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">无</td><td align=center style=\"border:none\">100.0</td></tr></table>",
            "onlineCourse": "计算机网络概论",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3WzGynePtYBSsQ8u5rcajXWajj3eJxlGLixgtD193VqKSFWQLWXZFEhkeKHGdN8gqTje7rR9VikMQO4%2bpUNY1lZcQakgGVYQNqVzgEu0IAid%2bDWILOpGu%2bf%2bJB%2bT9VIR8eM7pM8HMKL5Urt5jedQtQ%2fRGhcdoQKD%2f8zKYyFf2PhW9tQpClIQgV1ICEW2nlwggytJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 100,
            "scoreTesting": 100,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "F316882F90E65C07-2018-S-23",
            "learningCourseId": "10365",
            "courseCode": "000051",
            "courseName": "数据库原理",
            "courseTypeName": "专业主干课",
            "creditHour": 4,
            "termNo": 3,
            "examNo": "20240",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "40",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">无</td><td align=center style=\"border:none\">100.0</td></tr></table>",
            "onlineCourse": "数据库系统原理及应用",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3WzGynePtYBSsQ8u5rcajXWajj3eJxlGLixgtD193VqKSFWQLWXZFEhkeKHGdN8gqTje7rR9VikMQO4%2bpUNY1lZcQakgGVYQNqVzgEu0IAid%2bDWILOpGu%2bf%2bJB%2bT9VIR8SqqfRz%2bBloNRtNWfhzp0bwLP3aeLNcXW7galDuqtqlr9tQpClIQgV1ICEW2nlwggytJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 100,
            "scoreTesting": 100,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "CE0BEE75EF54DC67-2020-S-23",
            "learningCourseId": "11984",
            "courseCode": "000148",
            "courseName": ".NET程序设计",
            "courseTypeName": "专业主干课",
            "creditHour": 4,
            "termNo": 3,
            "examNo": "20240",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "40",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">无</td><td align=center style=\"border:none\">100.0</td></tr></table>",
            "onlineCourse": "ASP.NET程序设计",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3WzGynePtYBSsQ8u5rcajXWajj3eJxlGLixgtD193VqKSFWQLWXZFEhkeKHGdN8gqTje7rR9VikMQO4%2bpUNY1lZcQakgGVYQNqVzgEu0IAid%2bDWILOpGu%2bf%2bJB%2bT9VIR8XD7fzUakOMii%2fYAK514aSgGgs5RzJZM7YHrmriv36Ke9tQpClIQgV1ICEW2nlwggytJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 100,
            "scoreTesting": 100,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "C45403E5E156503E-2018-S-23",
            "learningCourseId": "10220",
            "courseCode": "000052",
            "courseName": "软件工程",
            "courseTypeName": "专业主干课",
            "creditHour": 4,
            "termNo": 3,
            "examNo": "20240",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "40",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">无</td><td align=center style=\"border:none\">100.0</td></tr></table>",
            "onlineCourse": "软件工程",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3WzGynePtYBSsQ8u5rcajXWajj3eJxlGLixgtD193VqKSFWQLWXZFEhkeKHGdN8gqTje7rR9VikMQO4%2bpUNY1lZcQakgGVYQNqVzgEu0IAid%2bDWILOpGu%2bf%2bJB%2bT9VIR8V47ulX%2fnlCW%2b8RGtNDssNlaz5x7f5ChIHFqWV92zTdY9tQpClIQgV1ICEW2nlwggytJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 100,
            "scoreTesting": 100,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "",
            "learningCourseId": "",
            "courseCode": "000151",
            "courseName": "软件工程实践",
            "courseTypeName": "实践课程",
            "creditHour": 2,
            "termNo": 3,
            "examNo": "20240",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "0",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(100%)</td></tr><tr><td align=center style=\"border:none\">无</td></tr></table>",
            "onlineCourse": "",
            "learningUrl": "",
            "learningRate": 0,
            "scoreLesson": 0,
            "scoreExercise": 0,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "A84218B077B27966-2019-S-23",
            "learningCourseId": "11594",
            "courseCode": "000004",
            "courseName": "毛泽东思想和中国特色社会主义理论体系概论",
            "courseTypeName": "通识基础课",
            "creditHour": 4,
            "termNo": 4,
            "examNo": "20241",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "0",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">无</td><td align=center style=\"border:none\">0.0</td></tr></table>",
            "onlineCourse": "毛泽东思想和中国特色社会主义理论体系概论",
            "learningUrl": "",
            "learningRate": 0,
            "scoreLesson": 0,
            "scoreExercise": 0,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "B1881485E83850A3-2015-T-01",
            "learningCourseId": "836",
            "courseCode": "000008",
            "courseName": "大学英语(四)",
            "courseTypeName": "通识基础课",
            "creditHour": 3.5,
            "termNo": 4,
            "examNo": "20241",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "0",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">无</td><td align=center style=\"border:none\">0.0</td></tr></table>",
            "onlineCourse": "大学英语4",
            "learningUrl": "",
            "learningRate": 0,
            "scoreLesson": 0,
            "scoreExercise": 0,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "1B93142D252BA8AA-2018-Z-08",
            "learningCourseId": "10382",
            "courseCode": "000053",
            "courseName": "网站设计与开发",
            "courseTypeName": "专业主干课",
            "creditHour": 4,
            "termNo": 4,
            "examNo": "20241",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "0",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">无</td><td align=center style=\"border:none\">0.0</td></tr></table>",
            "onlineCourse": "网页设计与制作",
            "learningUrl": "",
            "learningRate": 0,
            "scoreLesson": 0,
            "scoreExercise": 0,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "D731D83FE14F1DB3-2022-S-20",
            "learningCourseId": "12766",
            "courseCode": "000149",
            "courseName": "计算机安全",
            "courseTypeName": "专业主干课",
            "creditHour": 4,
            "termNo": 4,
            "examNo": "20241",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "0",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">无</td><td align=center style=\"border:none\">0.0</td></tr></table>",
            "onlineCourse": "计算机网络安全",
            "learningUrl": "",
            "learningRate": 0,
            "scoreLesson": 0,
            "scoreExercise": 0,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "64EBCCFE0964536A-2018-S-23",
            "learningCourseId": "10602",
            "courseCode": "000054",
            "courseName": "面向对象的程序设计",
            "courseTypeName": "实践课程",
            "creditHour": 4,
            "termNo": 4,
            "examNo": "20241",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "20",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">无</td><td align=center style=\"border:none\">50.0</td></tr></table>",
            "onlineCourse": "JAVA面向对象程序设计",
            "learningUrl": "",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 0,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "82A454AC745D99F8-2019-S-23",
            "learningCourseId": "11163",
            "courseCode": "000055",
            "courseName": "大型关系数据库",
            "courseTypeName": "实践课程",
            "creditHour": 4,
            "termNo": 4,
            "examNo": "20241",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "0",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">无</td><td align=center style=\"border:none\">0.0</td></tr></table>",
            "onlineCourse": "数据库技术与应用",
            "learningUrl": "",
            "learningRate": 0,
            "scoreLesson": 0,
            "scoreExercise": 0,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "26D4805236B6045E-2018-S-23",
            "learningCourseId": "10161",
            "courseCode": "000056",
            "courseName": "信息系统项目管理",
            "courseTypeName": "实践课程",
            "creditHour": 3,
            "termNo": 4,
            "examNo": "20241",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "0",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">无</td><td align=center style=\"border:none\">0.0</td></tr></table>",
            "onlineCourse": "管理信息系统",
            "learningUrl": "",
            "learningRate": 0,
            "scoreLesson": 0,
            "scoreExercise": 0,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "C2802A8C2ABBB8F2-2019-S-20",
            "learningCourseId": "11590",
            "courseCode": "000057",
            "courseName": "网络工程设计与系统集成",
            "courseTypeName": "实践课程",
            "creditHour": 3,
            "termNo": 4,
            "examNo": "20241",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "0",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">无</td><td align=center style=\"border:none\">0.0</td></tr></table>",
            "onlineCourse": "网络工程",
            "learningUrl": "",
            "learningRate": 0,
            "scoreLesson": 0,
            "scoreExercise": 0,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "",
            "learningCourseId": "",
            "courseCode": "000145",
            "courseName": "毕业实习",
            "courseTypeName": "实践课程",
            "creditHour": 4,
            "termNo": 4,
            "examNo": "20241",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "0",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(100%)</td></tr><tr><td align=center style=\"border:none\">无</td></tr></table>",
            "onlineCourse": "",
            "learningUrl": "",
            "learningRate": 0,
            "scoreLesson": 0,
            "scoreExercise": 0,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "",
            "learningCourseId": "",
            "courseCode": "000029",
            "courseName": "毕业设计",
            "courseTypeName": "毕业实践",
            "creditHour": 8,
            "termNo": 5,
            "examNo": "20250",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "0",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(100%)</td></tr><tr><td align=center style=\"border:none\">无</td></tr></table>",
            "onlineCourse": "",
            "learningUrl": "",
            "learningRate": 0,
            "scoreLesson": 0,
            "scoreExercise": 0,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "8DD87C2460ABE5D1-2018-S-20",
            "learningCourseId": "1903",
            "courseCode": "000001",
            "courseName": "思想道德修养与法律基础",
            "courseTypeName": "通识基础课",
            "creditHour": 2.5,
            "termNo": 1,
            "examNo": "20230",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "40",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">无</td><td align=center style=\"border:none\">100.0</td></tr></table>",
            "onlineCourse": "思想道德修养与法律基础",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3fPIAsGVxBUbzZ%2frJGMIi4AimgE%2btWPXApcpz3P%2fgyCJ2OnzJjFVZq9WDD9HH%2b18%2fCL4qtofqwbp3A9MBeZFIYwzmy8Ir11lPd7724eUf5lx%2bDWILOpGu%2bf%2bJB%2bT9VIR8R1XRaz9j%2bj2poM4aKc86ocNIG6Eiru1OwE033bTLgUiPCEjYwy82Rx6CvgzAFvU2ytJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 100,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "5FA9F953628112DD-2019-S-23",
            "learningCourseId": "10966",
            "courseCode": "000005",
            "courseName": "形势与政策",
            "courseTypeName": "通识基础课",
            "creditHour": 2.5,
            "termNo": 1,
            "examNo": "20230",
            "isPass": true,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": "是",
            "totalScore": "79",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">98.0</td><td align=center style=\"border:none\">50.0</td></tr></table>",
            "onlineCourse": "形势与政策",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3fPIAsGVxBUbzZ%2frJGMIi4AimgE%2btWPXApcpz3P%2fgyCJ2OnzJjFVZq9WDD9HH%2b18%2fCL4qtofqwbp3A9MBeZFIYwzmy8Ir11lPd7724eUf5lx%2bDWILOpGu%2bf%2bJB%2bT9VIR8ZroGWQiQMcLMfo3el5eA7RFatHdGODhBmXU16S%2fnp%2fa9tQpClIQgV1ICEW2nlwggytJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 0,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "0FA1D47C3E385913-2020-S-20",
            "learningCourseId": "12393",
            "courseCode": "000135",
            "courseName": "习近平新时代中国特色社会主义思想概论",
            "courseTypeName": "通识基础课",
            "creditHour": 2.5,
            "termNo": 1,
            "examNo": "20230",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "20",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">无</td><td align=center style=\"border:none\">50.0</td></tr></table>",
            "onlineCourse": "习近平新时代中国特色社会主义思想学习纲要",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3fPIAsGVxBUbzZ%2frJGMIi4AimgE%2btWPXApcpz3P%2fgyCJ2OnzJjFVZq9WDD9HH%2b18%2fCL4qtofqwbp3A9MBeZFIYwzmy8Ir11lPd7724eUf5lx%2bDWILOpGu%2bf%2bJB%2bT9VIR8UlkxvGhD5mmHqsM4qTi%2bhut39ScmQ37Iajwy6uaWXTPPCEjYwy82Rx6CvgzAFvU2ytJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 0,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "1473134FD896FAC4-2019-Z-23",
            "learningCourseId": "11085",
            "courseCode": "000136",
            "courseName": "心理健康",
            "courseTypeName": "通识基础课",
            "creditHour": 2,
            "termNo": 1,
            "examNo": "20230",
            "isPass": true,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": "是",
            "totalScore": "79",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">98.0</td><td align=center style=\"border:none\">50.0</td></tr></table>",
            "onlineCourse": "心理健康",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3fPIAsGVxBUbzZ%2frJGMIi4AimgE%2btWPXApcpz3P%2fgyCJ2OnzJjFVZq9WDD9HH%2b18%2fCL4qtofqwbp3A9MBeZFIYwzmy8Ir11lPd7724eUf5lx%2bDWILOpGu%2bf%2bJB%2bT9VIR8dNMcEigDcWiFp1EorEynPeTjirBQRAy8%2bw6sxVXM%2fnR9tQpClIQgV1ICEW2nlwggytJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 0,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "F4783DC42FA1644D-2019-S-51",
            "learningCourseId": "11303",
            "courseCode": "000006",
            "courseName": "大学计算机基础",
            "courseTypeName": "通识基础课",
            "creditHour": 1.5,
            "termNo": 1,
            "examNo": "20230",
            "isPass": true,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": "是",
            "totalScore": "78",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">96.0</td><td align=center style=\"border:none\">50.0</td></tr></table>",
            "onlineCourse": "大学计算机基础",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3fPIAsGVxBUbzZ%2frJGMIi4AimgE%2btWPXApcpz3P%2fgyCJ2OnzJjFVZq9WDD9HH%2b18%2fCL4qtofqwbp3A9MBeZFIYwzmy8Ir11lPd7724eUf5lx%2bDWILOpGu%2bf%2bJB%2bT9VIR8YfN%2f05Ha0Q5wll5gCC1WDMSMNa23b0F48LhSCHbr35tvZV9gTSd8u28TjK4uI6%2fgCtJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 0,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "3E590C715108938D-2018-Z-20",
            "learningCourseId": "2004",
            "courseCode": "000030",
            "courseName": "经济数学",
            "courseTypeName": "专业主干课",
            "creditHour": 6,
            "termNo": 1,
            "examNo": "20230",
            "isPass": true,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": "是",
            "totalScore": "74",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">90.0</td><td align=center style=\"border:none\">50.0</td></tr></table>",
            "onlineCourse": "经济数学",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3fPIAsGVxBUbzZ%2frJGMIi4AimgE%2btWPXApcpz3P%2fgyCJ2OnzJjFVZq9WDD9HH%2b18%2fCL4qtofqwbp3A9MBeZFIYwzmy8Ir11lPd7724eUf5lx%2bDWILOpGu%2bf%2bJB%2bT9VIR8Q1aKZJCtEbnMpNnljUmLCqt6YIXoifVzF%2bZGrt5o7uyPCEjYwy82Rx6CvgzAFvU2ytJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 0,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "B1541A72AF1E5A8B-2018-S-23",
            "learningCourseId": "10216",
            "courseCode": "000031",
            "courseName": "微观经济学",
            "courseTypeName": "专业主干课",
            "creditHour": 4,
            "termNo": 1,
            "examNo": "20230",
            "isPass": true,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": "是",
            "totalScore": "74",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">90.0</td><td align=center style=\"border:none\">50.0</td></tr></table>",
            "onlineCourse": "微观经济学",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3fPIAsGVxBUbzZ%2frJGMIi4AimgE%2btWPXApcpz3P%2fgyCJ2OnzJjFVZq9WDD9HH%2b18%2fCL4qtofqwbp3A9MBeZFIYwzmy8Ir11lPd7724eUf5lx%2bDWILOpGu%2bf%2bJB%2bT9VIR8ZR27lkiI3qR2dNpQCXWuCjjjwTl%2fnhMaxap1wyQ7rOP9tQpClIQgV1ICEW2nlwggytJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 0,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "F23CFE430E3949AA-2018-S-20",
            "learningCourseId": "1947",
            "courseCode": "000032",
            "courseName": "管理学B",
            "courseTypeName": "专业主干课",
            "creditHour": 4,
            "termNo": 1,
            "examNo": "20230",
            "isPass": true,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": "是",
            "totalScore": "78",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">96.0</td><td align=center style=\"border:none\">50.0</td></tr></table>",
            "onlineCourse": "管理学",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3fPIAsGVxBUbzZ%2frJGMIi4AimgE%2btWPXApcpz3P%2fgyCJ2OnzJjFVZq9WDD9HH%2b18%2fCL4qtofqwbp3A9MBeZFIYwzmy8Ir11lPd7724eUf5lx%2bDWILOpGu%2bf%2bJB%2bT9VIR8bBdF16Cb0JcHy%2bgzjgxvSOrdjN8sa05mCsZQoxG4PPnPCEjYwy82Rx6CvgzAFvU2ytJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 0,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "4115B95EB0262E8F-2019-S-23",
            "learningCourseId": "11093",
            "courseCode": "000002",
            "courseName": "中国近现代史纲要",
            "courseTypeName": "通识基础课",
            "creditHour": 2.5,
            "termNo": 2,
            "examNo": "20231",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "40",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">无</td><td align=center style=\"border:none\">100.0</td></tr></table>",
            "onlineCourse": "中国近现代史纲要",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3fPIAsGVxBUbzZ%2frJGMIi4AimgE%2btWPXApcpz3P%2fgyCJ2OnzJjFVZq9WDD9HH%2b18%2fCL4qtofqwbp3A9MBeZFIYynCemRvW0O0isnFL38QmBi%2bDWILOpGu%2bf%2bJB%2bT9VIR8fQK9kXhj7kWwBfSaoRON%2b%2bUiHrb4QxdtZSHR%2fZ%2fYt1g9tQpClIQgV1ICEW2nlwggytJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 100,
            "scoreTesting": 100,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "CCF391E8EC3969F7-2018-S-23",
            "learningCourseId": "10608",
            "courseCode": "000033",
            "courseName": "基础会计学A",
            "courseTypeName": "专业主干课",
            "creditHour": 4,
            "termNo": 2,
            "examNo": "20231",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "20",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">无</td><td align=center style=\"border:none\">50.0</td></tr></table>",
            "onlineCourse": "会计学原理",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3fPIAsGVxBUbzZ%2frJGMIi4AimgE%2btWPXApcpz3P%2fgyCJ2OnzJjFVZq9WDD9HH%2b18%2fCL4qtofqwbp3A9MBeZFIYynCemRvW0O0isnFL38QmBi%2bDWILOpGu%2bf%2bJB%2bT9VIR8Zi3UySUdv8iyteVq8MlRbeCLz2Aj6cZNS6ZPmwm%2blHo9tQpClIQgV1ICEW2nlwggytJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 0,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "2A0FD35E4E9BC5AE-2018-Z-23",
            "learningCourseId": "10223",
            "courseCode": "000034",
            "courseName": "经济法A",
            "courseTypeName": "专业主干课",
            "creditHour": 4,
            "termNo": 2,
            "examNo": "20231",
            "isPass": true,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": "是",
            "totalScore": "75",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">92.0</td><td align=center style=\"border:none\">50.0</td></tr></table>",
            "onlineCourse": "经济法",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3fPIAsGVxBUbzZ%2frJGMIi4AimgE%2btWPXApcpz3P%2fgyCJ2OnzJjFVZq9WDD9HH%2b18%2fCL4qtofqwbp3A9MBeZFIYynCemRvW0O0isnFL38QmBi%2bDWILOpGu%2bf%2bJB%2bT9VIR8QdNGqBjZgZlPt%2bIaKvLtj9IQfzR7zrPQ9WecB%2bZC27g9tQpClIQgV1ICEW2nlwggytJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 0,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "1F2C22BBB36C4B25-2018-Z-20",
            "learningCourseId": "2049",
            "courseCode": "000035",
            "courseName": "税法",
            "courseTypeName": "专业主干课",
            "creditHour": 4,
            "termNo": 2,
            "examNo": "20231",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "20",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">无</td><td align=center style=\"border:none\">50.0</td></tr></table>",
            "onlineCourse": "税法",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3fPIAsGVxBUbzZ%2frJGMIi4AimgE%2btWPXApcpz3P%2fgyCJ2OnzJjFVZq9WDD9HH%2b18%2fCL4qtofqwbp3A9MBeZFIYynCemRvW0O0isnFL38QmBi%2bDWILOpGu%2bf%2bJB%2bT9VIR8Q1RUqe1v5iuUjiOsOS8%2bv5oFLjURAtI%2b9wnrmg6PMAePCEjYwy82Rx6CvgzAFvU2ytJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 0,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "1353B65BA3EE5FB5-2019-S-23",
            "learningCourseId": "10963",
            "courseCode": "000026",
            "courseName": "中外音乐欣赏",
            "courseTypeName": "通识选修课",
            "creditHour": 4,
            "termNo": 2,
            "examNo": "20231",
            "isPass": true,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": "是",
            "totalScore": "73",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">88.0</td><td align=center style=\"border:none\">50.0</td></tr></table>",
            "onlineCourse": "中国古代音乐史",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3fPIAsGVxBUbzZ%2frJGMIi4AimgE%2btWPXApcpz3P%2fgyCJ2OnzJjFVZq9WDD9HH%2b18%2fCL4qtofqwbp3A9MBeZFIYynCemRvW0O0isnFL38QmBi%2bDWILOpGu%2bf%2bJB%2bT9VIR8fLPSr%2fLBh4HCnfsnyQ7eEodF5olnq%2fBHEpf98vKRurY9tQpClIQgV1ICEW2nlwggytJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 0,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "052AF49D5FE8B51B-2019-S-23",
            "learningCourseId": "11041",
            "courseCode": "000027",
            "courseName": "中国文化概论",
            "courseTypeName": "通识选修课",
            "creditHour": 4,
            "termNo": 2,
            "examNo": "20231",
            "isPass": true,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": "是",
            "totalScore": "76",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">94.0</td><td align=center style=\"border:none\">50.0</td></tr></table>",
            "onlineCourse": "中国文化概论",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3fPIAsGVxBUbzZ%2frJGMIi4AimgE%2btWPXApcpz3P%2fgyCJ2OnzJjFVZq9WDD9HH%2b18%2fCL4qtofqwbp3A9MBeZFIYynCemRvW0O0isnFL38QmBi%2bDWILOpGu%2bf%2bJB%2bT9VIR8Rn1QPe3b5Iu3f4rFUR5UwHpFX0beGc3XsjjNvQAqINA9tQpClIQgV1ICEW2nlwggytJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 0,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "10F0CC91D34DDC22-2020-Z-23",
            "learningCourseId": "12324",
            "courseCode": "000028",
            "courseName": "中国旅游地理",
            "courseTypeName": "通识选修课",
            "creditHour": 4,
            "termNo": 2,
            "examNo": "20231",
            "isPass": true,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": "是",
            "totalScore": "80",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">100.0</td><td align=center style=\"border:none\">50.0</td></tr></table>",
            "onlineCourse": "旅游地理学",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3fPIAsGVxBUbzZ%2frJGMIi4AimgE%2btWPXApcpz3P%2fgyCJ2OnzJjFVZq9WDD9HH%2b18%2fCL4qtofqwbp3A9MBeZFIYynCemRvW0O0isnFL38QmBi%2bDWILOpGu%2bf%2bJB%2bT9VIR8anP0gdCZoE7RBZ6fl9XntfMUDdTGNgzyvpVofCaFvFM9tQpClIQgV1ICEW2nlwggytJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 0,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "8F3A7089B34BA7ED-2018-S-23",
            "learningCourseId": "10631",
            "courseCode": "000003",
            "courseName": "马克思主义基本原理",
            "courseTypeName": "通识基础课",
            "creditHour": 3,
            "termNo": 3,
            "examNo": "20240",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "40",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">无</td><td align=center style=\"border:none\">99.2</td></tr></table>",
            "onlineCourse": "马克思主义基本原理概论",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3fPIAsGVxBUbzZ%2frJGMIi4AimgE%2btWPXApcpz3P%2fgyCJ2OnzJjFVZq9WDD9HH%2b18%2fCL4qtofqwbp3A9MBeZFIYxcQakgGVYQNqVzgEu0IAid%2bDWILOpGu%2bf%2bJB%2bT9VIR8afQ1DdGQy7aTqlMJXcYrZ0vh7P3eqsAzLCBFOk%2be4lb9tQpClIQgV1ICEW2nlwggytJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 98.3,
            "scoreTesting": 100,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "0EC7C0549E432D2F-2014-T-01",
            "learningCourseId": "847",
            "courseCode": "000007",
            "courseName": "大学英语(三)",
            "courseTypeName": "通识基础课",
            "creditHour": 3.5,
            "termNo": 3,
            "examNo": "20240",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "40",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">无</td><td align=center style=\"border:none\">100.0</td></tr></table>",
            "onlineCourse": "大学英语3",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3fPIAsGVxBUbzZ%2frJGMIi4AimgE%2btWPXApcpz3P%2fgyCJ2OnzJjFVZq9WDD9HH%2b18%2fCL4qtofqwbp3A9MBeZFIYxcQakgGVYQNqVzgEu0IAid%2bDWILOpGu%2bf%2bJB%2bT9VIR8RnWLNzVWrYy84xQWXVaa18DIVGj4yZm8w0BrLz19dk0RALrSHmyRKdruiOZLUMzACtJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 100,
            "scoreTesting": 100,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "0F3F3D3475F4DF74-2018-Z-23",
            "learningCourseId": "10122",
            "courseCode": "000036",
            "courseName": "财务会计A",
            "courseTypeName": "专业主干课",
            "creditHour": 4,
            "termNo": 3,
            "examNo": "20240",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "40",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">无</td><td align=center style=\"border:none\">100.0</td></tr></table>",
            "onlineCourse": "财务会计学",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3fPIAsGVxBUbzZ%2frJGMIi4AimgE%2btWPXApcpz3P%2fgyCJ2OnzJjFVZq9WDD9HH%2b18%2fCL4qtofqwbp3A9MBeZFIYxcQakgGVYQNqVzgEu0IAid%2bDWILOpGu%2bf%2bJB%2bT9VIR8Qg0cNjovBx%2fjJa9SWrbBw4Ysa5kU8qwtObccE1JmIUO9tQpClIQgV1ICEW2nlwggytJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 100,
            "scoreTesting": 100,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "0F3F3D3475F4DF74-2018-Z-23",
            "learningCourseId": "10122",
            "courseCode": "000037",
            "courseName": "公司财务C",
            "courseTypeName": "专业主干课",
            "creditHour": 4,
            "termNo": 3,
            "examNo": "20240",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "40",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">无</td><td align=center style=\"border:none\">100.0</td></tr></table>",
            "onlineCourse": "财务会计学",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3fPIAsGVxBUbzZ%2frJGMIi4AimgE%2btWPXApcpz3P%2fgyCJ2OnzJjFVZq9WDD9HH%2b18%2fCL4qtofqwbp3A9MBeZFIYxcQakgGVYQNqVzgEu0IAid%2bDWILOpGu%2bf%2bJB%2bT9VIR8Qg0cNjovBx%2fjJa9SWrbBw4Ysa5kU8qwtObccE1JmIUO9tQpClIQgV1ICEW2nlwggytJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 100,
            "scoreTesting": 100,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "DDE6371BB8FFD28B-2019-Z-20",
            "learningCourseId": "11593",
            "courseCode": "000038",
            "courseName": "成本会计",
            "courseTypeName": "专业主干课",
            "creditHour": 4,
            "termNo": 3,
            "examNo": "20240",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "40",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">无</td><td align=center style=\"border:none\">98.8</td></tr></table>",
            "onlineCourse": "成本会计",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3fPIAsGVxBUbzZ%2frJGMIi4AimgE%2btWPXApcpz3P%2fgyCJ2OnzJjFVZq9WDD9HH%2b18%2fCL4qtofqwbp3A9MBeZFIYxcQakgGVYQNqVzgEu0IAid%2bDWILOpGu%2bf%2bJB%2bT9VIR8T9tlhAs2jGjvMdhK6ZagJtAhFz0JznNRgfvXlXx2mW%2fPCEjYwy82Rx6CvgzAFvU2ytJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 97.5,
            "scoreTesting": 100,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "789E06EBEB186699-2018-Z-23",
            "learningCourseId": "10046",
            "courseCode": "000043",
            "courseName": "会计电算化A",
            "courseTypeName": "专业主干课",
            "creditHour": 4,
            "termNo": 3,
            "examNo": "20240",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "40",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">无</td><td align=center style=\"border:none\">99.2</td></tr></table>",
            "onlineCourse": "会计电算化",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token=yE2I4yZ5qrAnCLgbfVLK3fPIAsGVxBUbzZ%2frJGMIi4AimgE%2btWPXApcpz3P%2fgyCJ2OnzJjFVZq9WDD9HH%2b18%2fCL4qtofqwbp3A9MBeZFIYxcQakgGVYQNqVzgEu0IAid%2bDWILOpGu%2bf%2bJB%2bT9VIR8bPN3uV%2btDyrdi5jhgaJIjhVxW3proJFc7oR507gjI6x9tQpClIQgV1ICEW2nlwggytJPnVQKWnnIHthI2WEnQKmjKiYXaYiQg%2ftdMQEj7A4NRa6tRF9pXfRc57V2Hhhe0gATMidaxoCxFqhCbTcX02AD%2fbeFS9RLum7RupKu7CoE3CdtKCFChyb996czax2ng%3d%3d",
            "learningRate": 100,
            "scoreLesson": 100,
            "scoreExercise": 98.3,
            "scoreTesting": 97.5,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "A84218B077B27966-2019-S-23",
            "learningCourseId": "11594",
            "courseCode": "000004",
            "courseName": "毛泽东思想和中国特色社会主义理论体系概论",
            "courseTypeName": "通识基础课",
            "creditHour": 4,
            "termNo": 4,
            "examNo": "20241",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "0",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">无</td><td align=center style=\"border:none\">0.0</td></tr></table>",
            "onlineCourse": "毛泽东思想和中国特色社会主义理论体系概论",
            "learningUrl": "",
            "learningRate": 0,
            "scoreLesson": 0,
            "scoreExercise": 0,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "B1881485E83850A3-2015-T-01",
            "learningCourseId": "836",
            "courseCode": "000008",
            "courseName": "大学英语(四)",
            "courseTypeName": "通识基础课",
            "creditHour": 3.5,
            "termNo": 4,
            "examNo": "20241",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "0",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">无</td><td align=center style=\"border:none\">0.0</td></tr></table>",
            "onlineCourse": "大学英语4",
            "learningUrl": "",
            "learningRate": 0,
            "scoreLesson": 0,
            "scoreExercise": 0,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "8123092F1D8EBD5B-2018-Z-23",
            "learningCourseId": "2045",
            "courseCode": "000039",
            "courseName": "管理会计学",
            "courseTypeName": "专业主干课",
            "creditHour": 4,
            "termNo": 4,
            "examNo": "20241",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "0",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">无</td><td align=center style=\"border:none\">0.0</td></tr></table>",
            "onlineCourse": "管理会计学",
            "learningUrl": "",
            "learningRate": 0,
            "scoreLesson": 0,
            "scoreExercise": 0,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "818AD2CBEFC9071F-2018-S-23",
            "learningCourseId": "10166",
            "courseCode": "000040",
            "courseName": "高级财务会计",
            "courseTypeName": "专业主干课",
            "creditHour": 4,
            "termNo": 4,
            "examNo": "20241",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "0",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">无</td><td align=center style=\"border:none\">0.0</td></tr></table>",
            "onlineCourse": "高级财务会计",
            "learningUrl": "",
            "learningRate": 0,
            "scoreLesson": 0,
            "scoreExercise": 0,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "F45A4A1BB7D6FAA0-2018-Z-23",
            "learningCourseId": "11802",
            "courseCode": "000041",
            "courseName": "税务会计与纳税筹划",
            "courseTypeName": "专业主干课",
            "creditHour": 4,
            "termNo": 4,
            "examNo": "20241",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "0",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">无</td><td align=center style=\"border:none\">0.0</td></tr></table>",
            "onlineCourse": "税务会计",
            "learningUrl": "",
            "learningRate": 0,
            "scoreLesson": 0,
            "scoreExercise": 0,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "4C955E61F35D54BD-2018-Z-20",
            "learningCourseId": "2044",
            "courseCode": "000042",
            "courseName": "审计学",
            "courseTypeName": "专业主干课",
            "creditHour": 4,
            "termNo": 4,
            "examNo": "20241",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "0",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(60%)</td><td align=center style=\"border:none\">在线(40%)</td></tr><tr><td align=center style=\"border:none\">无</td><td align=center style=\"border:none\">0.0</td></tr></table>",
            "onlineCourse": "审计学",
            "learningUrl": "",
            "learningRate": 0,
            "scoreLesson": 0,
            "scoreExercise": 0,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "",
            "learningCourseId": "",
            "courseCode": "000146",
            "courseName": "毕业论文（设计）",
            "courseTypeName": "毕业实践",
            "creditHour": 8,
            "termNo": 5,
            "examNo": "20250",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "0",
            "scoreDetail": "<table border=0 cellpadding=0 cellspacing=0 width=\"100%\" style=\"border:none\"><tr><td align=center style=\"border:none\">卷(100%)</td></tr><tr><td align=center style=\"border:none\">无</td></tr></table>",
            "onlineCourse": "",
            "learningUrl": "",
            "learningRate": 0,
            "scoreLesson": 0,
            "scoreExercise": 0,
            "scoreTesting": 0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "8F3A7089B34BA7ED-2018-S-23",
            "learningCourseId": "10631",
            "courseCode": "000500",
            "courseName": "马克思主义基本原理概论",
            "courseTypeName": "基础课",
            "creditHour": 4.0,
            "termNo": 1,
            "examNo": "20230",
            "isPass": true,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": "是",
            "totalScore": "82",
            "scoreDetail": "\u003ctable border\u003d0 cellpadding\u003d0 cellspacing\u003d0 width\u003d\"100%\" style\u003d\"border:none\"\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e卷(50%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e在线(30%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e网考(20%)\u003c/td\u003e\u003c/tr\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e71.0\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e100.0\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e82.0\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e",
            "onlineCourse": "马克思主义基本原理概论",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token\u003d%2fIsVk6ohmlD58%2bQRX3uvGJNVwY11ogBFW5QPg8z9KiMqRj5fzBgkdPLnJDL2r3AFhPckGL2YPBWdd%2b%2bNw9B0%2fyisLYNZdv0gIiqAtKmjyE30QJhT9bF9PaXUMnKBm%2bPAzJU8%2bRw2kR1sQlNnapjmdCJyYKLrrm1W9SHupvz3v7GemcYaih8oVY1NhxzGSlmhESiW4bI90r%2b4Nvresn%2fG3%2f3Az8VAhuxBQjrxaszNd23FF4PhUMskFM94Jxa4fn9qSCr9%2bkhX0sYj6lxqlg4mZHD9p7NGIZ1HkqXrHWknrHjFdMIzVIVIvVNTph8RT7yU",
            "learningRate": 100.0,
            "scoreLesson": 100.0,
            "scoreExercise": 65.0,
            "scoreTesting": 97.5,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "5FA9F953628112DD-2019-S-23",
            "learningCourseId": "10966",
            "courseCode": "000502",
            "courseName": "形势与政策",
            "courseTypeName": "基础课",
            "creditHour": 3.0,
            "termNo": 1,
            "examNo": "20230",
            "isPass": true,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": "是",
            "totalScore": "86",
            "scoreDetail": "\u003ctable border\u003d0 cellpadding\u003d0 cellspacing\u003d0 width\u003d\"100%\" style\u003d\"border:none\"\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e卷(50%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e在线(30%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e网考(20%)\u003c/td\u003e\u003c/tr\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e73.0\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e100.0\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e98.0\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e",
            "onlineCourse": "形势与政策",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token\u003d%2fIsVk6ohmlD58%2bQRX3uvGJNVwY11ogBFW5QPg8z9KiMqRj5fzBgkdPLnJDL2r3AFhPckGL2YPBWdd%2b%2bNw9B0%2fyisLYNZdv0gIiqAtKmjyE30QJhT9bF9PaXUMnKBm%2bPAzJU8%2bRw2kR1sQlNnapjmdE1zslKLW%2bRA5M4QAy4%2btOxjGGU%2fkz8c9rXtwSYNyOFKESiW4bI90r%2b4Nvresn%2fG3%2f3Az8VAhuxBQjrxaszNd23FF4PhUMskFM94Jxa4fn9qSCr9%2bkhX0sYj6lxqlg4mZHD9p7NGIZ1HkqXrHWknrHjFdMIzVIVIvVNTph8RT7yU",
            "learningRate": 100.0,
            "scoreLesson": 100.0,
            "scoreExercise": 0.0,
            "scoreTesting": 0.0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "4115B95EB0262E8F-2019-S-23",
            "learningCourseId": "11093",
            "courseCode": "000505",
            "courseName": "中国近现代史纲要",
            "courseTypeName": "基础课",
            "creditHour": 4.0,
            "termNo": 1,
            "examNo": "20230",
            "isPass": true,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": "是",
            "totalScore": "84",
            "scoreDetail": "\u003ctable border\u003d0 cellpadding\u003d0 cellspacing\u003d0 width\u003d\"100%\" style\u003d\"border:none\"\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e卷(50%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e在线(30%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e网考(20%)\u003c/td\u003e\u003c/tr\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e71.0\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e100.0\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e90.0\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e",
            "onlineCourse": "中国近现代史纲要",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token\u003d%2fIsVk6ohmlD58%2bQRX3uvGJNVwY11ogBFW5QPg8z9KiMqRj5fzBgkdPLnJDL2r3AFhPckGL2YPBWdd%2b%2bNw9B0%2fyisLYNZdv0gIiqAtKmjyE30QJhT9bF9PaXUMnKBm%2bPAzJU8%2bRw2kR1sQlNnapjmdMGFhmrfbHXNQK0BXkj7eaitYLYSFvYAcxByt%2fYVqgJnESiW4bI90r%2b4Nvresn%2fG3%2f3Az8VAhuxBQjrxaszNd23FF4PhUMskFM94Jxa4fn9qSCr9%2bkhX0sYj6lxqlg4mZHD9p7NGIZ1HkqXrHWknrHjFdMIzVIVIvVNTph8RT7yU",
            "learningRate": 100.0,
            "scoreLesson": 100.0,
            "scoreExercise": 0.0,
            "scoreTesting": 0.0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "8DD87C2460ABE5D1-2018-S-20",
            "learningCourseId": "1903",
            "courseCode": "000430",
            "courseName": "思想道德修养与法律基础",
            "courseTypeName": "基础课",
            "creditHour": 4.0,
            "termNo": 1,
            "examNo": "20230",
            "isPass": true,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": "是",
            "totalScore": "83",
            "scoreDetail": "\u003ctable border\u003d0 cellpadding\u003d0 cellspacing\u003d0 width\u003d\"100%\" style\u003d\"border:none\"\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e卷(50%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e在线(30%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e网考(20%)\u003c/td\u003e\u003c/tr\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e73.0\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e100.0\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e82.0\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e",
            "onlineCourse": "思想道德修养与法律基础",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token\u003d%2fIsVk6ohmlD58%2bQRX3uvGJNVwY11ogBFW5QPg8z9KiMqRj5fzBgkdPLnJDL2r3AFhPckGL2YPBWdd%2b%2bNw9B0%2fyisLYNZdv0gIiqAtKmjyE30QJhT9bF9PaXUMnKBm%2bPAzJU8%2bRw2kR1sQlNnapjmdLFYUxpcJmoZyu0B%2b2GkKlHdzs4kFk0FUgcve%2bYOKP%2foESiW4bI90r%2b4Nvresn%2fG3%2f3Az8VAhuxBQjrxaszNd23FF4PhUMskFM94Jxa4fn9qSCr9%2bkhX0sYj6lxqlg4mZHD9p7NGIZ1HkqXrHWknrHjFdMIzVIVIvVNTph8RT7yU",
            "learningRate": 100.0,
            "scoreLesson": 100.0,
            "scoreExercise": 0.0,
            "scoreTesting": 0.0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "AF15C5E60C63C10D-2018-Z-01",
            "learningCourseId": "1982",
            "courseCode": "000604",
            "courseName": "大学英语2",
            "courseTypeName": "基础课",
            "creditHour": 5.0,
            "termNo": 1,
            "examNo": "20230",
            "isPass": true,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": "是",
            "totalScore": "85",
            "scoreDetail": "\u003ctable border\u003d0 cellpadding\u003d0 cellspacing\u003d0 width\u003d\"100%\" style\u003d\"border:none\"\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e卷(50%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e在线(30%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e网考(20%)\u003c/td\u003e\u003c/tr\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e82.0\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e100.0\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e70.0\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e",
            "onlineCourse": "大学英语2",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token\u003d%2fIsVk6ohmlD58%2bQRX3uvGJNVwY11ogBFW5QPg8z9KiMqRj5fzBgkdPLnJDL2r3AFhPckGL2YPBWdd%2b%2bNw9B0%2fyisLYNZdv0gIiqAtKmjyE30QJhT9bF9PaXUMnKBm%2bPAzJU8%2bRw2kR1sQlNnapjmdHZerRASpN1Vk%2fz56LvoMK2EDQsyQb%2fVm5Llf%2f1hAaPaESiW4bI90r%2b4Nvresn%2fG3%2f3Az8VAhuxBQjrxaszNd23FF4PhUMskFM94Jxa4fn9qSCr9%2bkhX0sYj6lxqlg4mZHD9p7NGIZ1HkqXrHWknrHjFdMIzVIVIvVNTph8RT7yU",
            "learningRate": 100.0,
            "scoreLesson": 100.0,
            "scoreExercise": 0.0,
            "scoreTesting": 0.0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "",
            "learningCourseId": "",
            "courseCode": "000618",
            "courseName": "入学教育",
            "courseTypeName": "实践类",
            "creditHour": 0.0,
            "termNo": 1,
            "examNo": "20230",
            "isPass": true,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": "是",
            "totalScore": "85",
            "scoreDetail": "\u003ctable border\u003d0 cellpadding\u003d0 cellspacing\u003d0 width\u003d\"100%\" style\u003d\"border:none\"\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e卷(100%)\u003c/td\u003e\u003c/tr\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e85.0\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e",
            "onlineCourse": "",
            "learningUrl": "",
            "learningRate": 0.0,
            "scoreLesson": 0.0,
            "scoreExercise": 0.0,
            "scoreTesting": 0.0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "0EC7C0549E432D2F-2014-T-01",
            "learningCourseId": "847",
            "courseCode": "000605",
            "courseName": "大学英语3",
            "courseTypeName": "基础课",
            "creditHour": 5.0,
            "termNo": 2,
            "examNo": "20231",
            "isPass": true,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": "是",
            "totalScore": "85",
            "scoreDetail": "\u003ctable border\u003d0 cellpadding\u003d0 cellspacing\u003d0 width\u003d\"100%\" style\u003d\"border:none\"\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e卷(50%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e在线(30%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e网考(20%)\u003c/td\u003e\u003c/tr\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e83.0\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e100.0\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e66.0\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e",
            "onlineCourse": "大学英语3",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token\u003d%2fIsVk6ohmlD58%2bQRX3uvGJNVwY11ogBFW5QPg8z9KiMqRj5fzBgkdPLnJDL2r3AFhPckGL2YPBWdd%2b%2bNw9B0%2fyisLYNZdv0gIiqAtKmjyE2qQ6%2bVu4hdhYYPq2RhqjEizJU8%2bRw2kR1sQlNnapjmdAQ%2fSSaknyB9kwnyPoxF0yRTEoziTlRQGH26APEfxx71ESiW4bI90r%2b4Nvresn%2fG3%2f3Az8VAhuxBQjrxaszNd23FF4PhUMskFM94Jxa4fn9qSCr9%2bkhX0sYj6lxqlg4mZHD9p7NGIZ1HkqXrHWknrHjFdMIzVIVIvVNTph8RT7yU",
            "learningRate": 100.0,
            "scoreLesson": 100.0,
            "scoreExercise": 0.0,
            "scoreTesting": 0.0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "038493533C7E4C68-2018-Z-20",
            "learningCourseId": "2050",
            "courseCode": "000427",
            "courseName": "宪法学",
            "courseTypeName": "专业基础课",
            "creditHour": 3.0,
            "termNo": 2,
            "examNo": "20231",
            "isPass": true,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": "是",
            "totalScore": "83",
            "scoreDetail": "\u003ctable border\u003d0 cellpadding\u003d0 cellspacing\u003d0 width\u003d\"100%\" style\u003d\"border:none\"\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e卷(50%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e在线(30%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e网考(20%)\u003c/td\u003e\u003c/tr\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e73.0\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e100.0\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e82.0\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e",
            "onlineCourse": "宪法学",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token\u003d%2fIsVk6ohmlD58%2bQRX3uvGJNVwY11ogBFW5QPg8z9KiMqRj5fzBgkdPLnJDL2r3AFhPckGL2YPBWdd%2b%2bNw9B0%2fyisLYNZdv0gIiqAtKmjyE2qQ6%2bVu4hdhYYPq2RhqjEizJU8%2bRw2kR1sQlNnapjmdPF2dvxWFyoyzXrkuex8zc36%2fZWc%2fZRK5QVF7lq%2fJscGESiW4bI90r%2b4Nvresn%2fG3%2f3Az8VAhuxBQjrxaszNd23FF4PhUMskFM94Jxa4fn9qSCr9%2bkhX0sYj6lxqlg4mZHD9p7NGIZ1HkqXrHWknrHjFdMIzVIVIvVNTph8RT7yU",
            "learningRate": 100.0,
            "scoreLesson": 100.0,
            "scoreExercise": 0.0,
            "scoreTesting": 0.0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "5842F4FAE61A92BB-2023-S-20",
            "learningCourseId": "12976",
            "courseCode": "000623",
            "courseName": "中国法律史",
            "courseTypeName": "专业基础课",
            "creditHour": 3.0,
            "termNo": 2,
            "examNo": "20231",
            "isPass": true,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": "是",
            "totalScore": "87",
            "scoreDetail": "\u003ctable border\u003d0 cellpadding\u003d0 cellspacing\u003d0 width\u003d\"100%\" style\u003d\"border:none\"\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e卷(50%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e在线(30%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e网考(20%)\u003c/td\u003e\u003c/tr\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e85.0\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e100.0\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e74.0\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e",
            "onlineCourse": "中国法律史",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token\u003d%2fIsVk6ohmlD58%2bQRX3uvGJNVwY11ogBFW5QPg8z9KiMqRj5fzBgkdPLnJDL2r3AFhPckGL2YPBWdd%2b%2bNw9B0%2fyisLYNZdv0gIiqAtKmjyE2qQ6%2bVu4hdhYYPq2RhqjEizJU8%2bRw2kR1sQlNnapjmdDI8jvd7QOLUCp6BISx1gS0nYZkoASQI3m0juTKeR1n5ESiW4bI90r%2b4Nvresn%2fG3%2f3Az8VAhuxBQjrxaszNd23FF4PhUMskFM94Jxa4fn9qSCr9%2bkhX0sYj6lxqlg4mZHD9p7NGIZ1HkqXrHWknrHjFdMIzVIVIvVNTph8RT7yU",
            "learningRate": 100.0,
            "scoreLesson": 100.0,
            "scoreExercise": 0.0,
            "scoreTesting": 0.0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "77925D41F9AF3032-2018-Z-23",
            "learningCourseId": "10342",
            "courseCode": "000405",
            "courseName": "法理学",
            "courseTypeName": "专业基础课",
            "creditHour": 5.0,
            "termNo": 2,
            "examNo": "20231",
            "isPass": true,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": "是",
            "totalScore": "83",
            "scoreDetail": "\u003ctable border\u003d0 cellpadding\u003d0 cellspacing\u003d0 width\u003d\"100%\" style\u003d\"border:none\"\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e卷(50%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e在线(30%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e网考(20%)\u003c/td\u003e\u003c/tr\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e70.0\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e100.0\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e88.0\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e",
            "onlineCourse": "法理学",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token\u003d%2fIsVk6ohmlD58%2bQRX3uvGJNVwY11ogBFW5QPg8z9KiMqRj5fzBgkdPLnJDL2r3AFhPckGL2YPBWdd%2b%2bNw9B0%2fyisLYNZdv0gIiqAtKmjyE2qQ6%2bVu4hdhYYPq2RhqjEizJU8%2bRw2kR1sQlNnapjmdCTTTEYvWOyjvhVrQmhYvkJOsSiXRlxoHljSG8NIGDH0ESiW4bI90r%2b4Nvresn%2fG3%2f3Az8VAhuxBQjrxaszNd23FF4PhUMskFM94Jxa4fn9qSCr9%2bkhX0sYj6lxqlg4mZHD9p7NGIZ1HkqXrHWknrHjFdMIzVIVIvVNTph8RT7yU",
            "learningRate": 100.0,
            "scoreLesson": 100.0,
            "scoreExercise": 0.0,
            "scoreTesting": 0.0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "9D7CC6416BFC465D-2019-S-20",
            "learningCourseId": "11397",
            "courseCode": "000350",
            "courseName": "民法总论",
            "courseTypeName": "专业基础课",
            "creditHour": 3.0,
            "termNo": 2,
            "examNo": "20231",
            "isPass": true,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": "是",
            "totalScore": "84",
            "scoreDetail": "\u003ctable border\u003d0 cellpadding\u003d0 cellspacing\u003d0 width\u003d\"100%\" style\u003d\"border:none\"\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e卷(50%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e在线(30%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e网考(20%)\u003c/td\u003e\u003c/tr\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e71.0\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e100.0\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e90.0\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e",
            "onlineCourse": "民法总论",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token\u003d%2fIsVk6ohmlD58%2bQRX3uvGJNVwY11ogBFW5QPg8z9KiMqRj5fzBgkdPLnJDL2r3AFhPckGL2YPBWdd%2b%2bNw9B0%2fyisLYNZdv0gIiqAtKmjyE2qQ6%2bVu4hdhYYPq2RhqjEizJU8%2bRw2kR1sQlNnapjmdELkVeBq1VFW4bJujOOue952cgKDY0qZoVDx4twwfFnvESiW4bI90r%2b4Nvresn%2fG3%2f3Az8VAhuxBQjrxaszNd23FF4PhUMskFM94Jxa4fn9qSCr9%2bkhX0sYj6lxqlg4mZHD9p7NGIZ1HkqXrHWknrHjFdMIzVIVIvVNTph8RT7yU",
            "learningRate": 100.0,
            "scoreLesson": 100.0,
            "scoreExercise": 0.0,
            "scoreTesting": 0.0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "B05563A4E622192E-2020-S-31",
            "learningCourseId": "11934",
            "courseCode": "000157",
            "courseName": "刑法总论",
            "courseTypeName": "专业基础课",
            "creditHour": 5.0,
            "termNo": 3,
            "examNo": "20240",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "30",
            "scoreDetail": "\u003ctable border\u003d0 cellpadding\u003d0 cellspacing\u003d0 width\u003d\"100%\" style\u003d\"border:none\"\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e卷(50%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e在线(30%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e网考(20%)\u003c/td\u003e\u003c/tr\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e无\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e100.0\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e无\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e",
            "onlineCourse": "刑法总论",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token\u003d%2fIsVk6ohmlD58%2bQRX3uvGJNVwY11ogBFW5QPg8z9KiMqRj5fzBgkdPLnJDL2r3AFhPckGL2YPBWdd%2b%2bNw9B0%2fyisLYNZdv0gIiqAtKmjyE3Jd0Zn1moszTMlwYhdatNZzJU8%2bRw2kR1sQlNnapjmdJ4cUxy%2b2beGuH79NCKkH3%2bZHAf01kFTxTgefzC7fO3gESiW4bI90r%2b4Nvresn%2fG3%2f3Az8VAhuxBQjrxaszNd23FF4PhUMskFM94Jxa4fn9qSCr9%2bkhX0sYj6lxqlg4mZHD9p7NGIZ1HkqXrHWknrHjFdMIzVIVIvVNTph8RT7yU",
            "learningRate": 100.0,
            "scoreLesson": 100.0,
            "scoreExercise": 0.0,
            "scoreTesting": 0.0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "2A0FD35E4E9BC5AE-2018-Z-23",
            "learningCourseId": "10223",
            "courseCode": "000627",
            "courseName": "经济法学",
            "courseTypeName": "专业主干课",
            "creditHour": 3.0,
            "termNo": 3,
            "examNo": "20240",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "31",
            "scoreDetail": "\u003ctable border\u003d0 cellpadding\u003d0 cellspacing\u003d0 width\u003d\"100%\" style\u003d\"border:none\"\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e卷(50%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e在线(30%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e网考(20%)\u003c/td\u003e\u003c/tr\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e无\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e100.0\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e4.0\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e",
            "onlineCourse": "经济法",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token\u003d%2fIsVk6ohmlD58%2bQRX3uvGJNVwY11ogBFW5QPg8z9KiMqRj5fzBgkdPLnJDL2r3AFhPckGL2YPBWdd%2b%2bNw9B0%2fyisLYNZdv0gIiqAtKmjyE3Jd0Zn1moszTMlwYhdatNZzJU8%2bRw2kR1sQlNnapjmdH32N2ttTib2LNepCjRwS7U62tOiHtRZ1%2fdEHjapZV7QESiW4bI90r%2b4Nvresn%2fG3%2f3Az8VAhuxBQjrxaszNd23FF4PhUMskFM94Jxa4fn9qSCr9%2bkhX0sYj6lxqlg4mZHD9p7NGIZ1HkqXrHWknrHjFdMIzVIVIvVNTph8RT7yU",
            "learningRate": 100.0,
            "scoreLesson": 100.0,
            "scoreExercise": 0.0,
            "scoreTesting": 0.0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "E1078525C0C8B89E-2019-S-20",
            "learningCourseId": "11253",
            "courseCode": "000078",
            "courseName": "劳动与社会保障法",
            "courseTypeName": "专业主干课",
            "creditHour": 4.0,
            "termNo": 3,
            "examNo": "20240",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "30",
            "scoreDetail": "\u003ctable border\u003d0 cellpadding\u003d0 cellspacing\u003d0 width\u003d\"100%\" style\u003d\"border:none\"\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e卷(50%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e在线(30%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e网考(20%)\u003c/td\u003e\u003c/tr\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e无\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e100.0\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e无\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e",
            "onlineCourse": "劳动与社会保障法",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token\u003d%2fIsVk6ohmlD58%2bQRX3uvGJNVwY11ogBFW5QPg8z9KiMqRj5fzBgkdPLnJDL2r3AFhPckGL2YPBWdd%2b%2bNw9B0%2fyisLYNZdv0gIiqAtKmjyE3Jd0Zn1moszTMlwYhdatNZzJU8%2bRw2kR1sQlNnapjmdLFSccAhRkpvsu%2bkrJPQMMoBEiO8XIuTOhxIS%2bxDg7SBESiW4bI90r%2b4Nvresn%2fG3%2f3Az8VAhuxBQjrxaszNd23FF4PhUMskFM94Jxa4fn9qSCr9%2bkhX0sYj6lxqlg4mZHD9p7NGIZ1HkqXrHWknrHjFdMIzVIVIvVNTph8RT7yU",
            "learningRate": 100.0,
            "scoreLesson": 100.0,
            "scoreExercise": 0.0,
            "scoreTesting": 0.0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "4FFE57D02474C828-2019-T-23",
            "learningCourseId": "11465",
            "courseCode": "000115",
            "courseName": "行政法与行政诉讼法",
            "courseTypeName": "专业主干课",
            "creditHour": 5.0,
            "termNo": 3,
            "examNo": "20240",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "30",
            "scoreDetail": "\u003ctable border\u003d0 cellpadding\u003d0 cellspacing\u003d0 width\u003d\"100%\" style\u003d\"border:none\"\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e卷(50%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e在线(30%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e网考(20%)\u003c/td\u003e\u003c/tr\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e无\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e100.0\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e无\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e",
            "onlineCourse": "行政法与行政诉讼法",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token\u003d%2fIsVk6ohmlD58%2bQRX3uvGJNVwY11ogBFW5QPg8z9KiMqRj5fzBgkdPLnJDL2r3AFhPckGL2YPBWdd%2b%2bNw9B0%2fyisLYNZdv0gIiqAtKmjyE3Jd0Zn1moszTMlwYhdatNZzJU8%2bRw2kR1sQlNnapjmdGRkjHjmQ7HR2aSzBvUs0vO6xb4ZcRnqtYFQgLmFBLnnESiW4bI90r%2b4Nvresn%2fG3%2f3Az8VAhuxBQjrxaszNd23FF4PhUMskFM94Jxa4fn9qSCr9%2bkhX0sYj6lxqlg4mZHD9p7NGIZ1HkqXrHWknrHjFdMIzVIVIvVNTph8RT7yU",
            "learningRate": 100.0,
            "scoreLesson": 100.0,
            "scoreExercise": 0.0,
            "scoreTesting": 0.0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "7B768C45A64C3C3B-2018-S-23",
            "learningCourseId": "10165",
            "courseCode": "000192",
            "courseName": "公司法",
            "courseTypeName": "专业主干课",
            "creditHour": 5.0,
            "termNo": 3,
            "examNo": "20240",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "30",
            "scoreDetail": "\u003ctable border\u003d0 cellpadding\u003d0 cellspacing\u003d0 width\u003d\"100%\" style\u003d\"border:none\"\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e卷(50%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e在线(30%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e网考(20%)\u003c/td\u003e\u003c/tr\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e无\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e100.0\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e无\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e",
            "onlineCourse": "公司法",
            "learningUrl": "https://learning.mhtall.com/rest/user/login3?token\u003d%2fIsVk6ohmlD58%2bQRX3uvGJNVwY11ogBFW5QPg8z9KiMqRj5fzBgkdPLnJDL2r3AFhPckGL2YPBWdd%2b%2bNw9B0%2fyisLYNZdv0gIiqAtKmjyE3Jd0Zn1moszTMlwYhdatNZzJU8%2bRw2kR1sQlNnapjmdEB%2bMlSfN7mNKXv0pyspU7Rkv2WXXyd5v3FawPdvsSMyESiW4bI90r%2b4Nvresn%2fG3%2f3Az8VAhuxBQjrxaszNd23FF4PhUMskFM94Jxa4fn9qSCr9%2bkhX0sYj6lxqlg4mZHD9p7NGIZ1HkqXrHWknrHjFdMIzVIVIvVNTph8RT7yU",
            "learningRate": 100.0,
            "scoreLesson": 100.0,
            "scoreExercise": 0.0,
            "scoreTesting": 0.0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "623CD5FCE4D9630C-2018-S-20",
            "learningCourseId": "10361",
            "courseCode": "000061",
            "courseName": "国际经济法",
            "courseTypeName": "专业主干课",
            "creditHour": 5.0,
            "termNo": 4,
            "examNo": "20241",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "0",
            "scoreDetail": "\u003ctable border\u003d0 cellpadding\u003d0 cellspacing\u003d0 width\u003d\"100%\" style\u003d\"border:none\"\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e卷(50%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e在线(30%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e网考(20%)\u003c/td\u003e\u003c/tr\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e无\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e0.0\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e无\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e",
            "onlineCourse": "国际经济法学",
            "learningUrl": "",
            "learningRate": 0.0,
            "scoreLesson": 0.0,
            "scoreExercise": 0.0,
            "scoreTesting": 0.0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "0A4172B2CDCF035C-2018-Z-23",
            "learningCourseId": "2042",
            "courseCode": "000160",
            "courseName": "民事诉讼法",
            "courseTypeName": "专业主干课",
            "creditHour": 5.0,
            "termNo": 4,
            "examNo": "20241",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "0",
            "scoreDetail": "\u003ctable border\u003d0 cellpadding\u003d0 cellspacing\u003d0 width\u003d\"100%\" style\u003d\"border:none\"\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e卷(50%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e在线(30%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e网考(20%)\u003c/td\u003e\u003c/tr\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e无\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e0.0\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e无\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e",
            "onlineCourse": "民事诉讼法",
            "learningUrl": "",
            "learningRate": 0.0,
            "scoreLesson": 0.0,
            "scoreExercise": 0.0,
            "scoreTesting": 0.0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "B39897389484E056-2018-S-23",
            "learningCourseId": "10366",
            "courseCode": "000161",
            "courseName": "刑事诉讼法",
            "courseTypeName": "专业主干课",
            "creditHour": 5.0,
            "termNo": 4,
            "examNo": "20241",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "0",
            "scoreDetail": "\u003ctable border\u003d0 cellpadding\u003d0 cellspacing\u003d0 width\u003d\"100%\" style\u003d\"border:none\"\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e卷(50%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e在线(30%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e网考(20%)\u003c/td\u003e\u003c/tr\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e无\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e0.0\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e无\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e",
            "onlineCourse": "刑事诉讼法",
            "learningUrl": "",
            "learningRate": 0.0,
            "scoreLesson": 0.0,
            "scoreExercise": 0.0,
            "scoreTesting": 0.0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "",
            "learningCourseId": "",
            "courseCode": "000634",
            "courseName": "法律职业伦理",
            "courseTypeName": "专业主干课",
            "creditHour": 3.0,
            "termNo": 4,
            "examNo": "20241",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "0",
            "scoreDetail": "\u003ctable border\u003d0 cellpadding\u003d0 cellspacing\u003d0 width\u003d\"100%\" style\u003d\"border:none\"\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e卷(50%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e在线(30%)\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e网考(20%)\u003c/td\u003e\u003c/tr\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e无\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e0.0\u003c/td\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e无\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e",
            "onlineCourse": "",
            "learningUrl": "",
            "learningRate": 0.0,
            "scoreLesson": 0.0,
            "scoreExercise": 0.0,
            "scoreTesting": 0.0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "",
            "learningCourseId": "",
            "courseCode": "000619",
            "courseName": "毕业教育",
            "courseTypeName": "实践类",
            "creditHour": 0.0,
            "termNo": 5,
            "examNo": "20250",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "0",
            "scoreDetail": "\u003ctable border\u003d0 cellpadding\u003d0 cellspacing\u003d0 width\u003d\"100%\" style\u003d\"border:none\"\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e卷(100%)\u003c/td\u003e\u003c/tr\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e无\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e",
            "onlineCourse": "",
            "learningUrl": "",
            "learningRate": 0.0,
            "scoreLesson": 0.0,
            "scoreExercise": 0.0,
            "scoreTesting": 0.0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "",
            "learningCourseId": "",
            "courseCode": "000620",
            "courseName": "毕业实习",
            "courseTypeName": "实践类",
            "creditHour": 4.0,
            "termNo": 5,
            "examNo": "20250",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "0",
            "scoreDetail": "\u003ctable border\u003d0 cellpadding\u003d0 cellspacing\u003d0 width\u003d\"100%\" style\u003d\"border:none\"\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e卷(100%)\u003c/td\u003e\u003c/tr\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e无\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e",
            "onlineCourse": "",
            "learningUrl": "",
            "learningRate": 0.0,
            "scoreLesson": 0.0,
            "scoreExercise": 0.0,
            "scoreTesting": 0.0,
            "isUnifyType": false,
            "unifyTypeString": ""
        },
        {
            "learningCourseCode": "",
            "learningCourseId": "",
            "courseCode": "000015",
            "courseName": "毕业论文",
            "courseTypeName": "毕业实践",
            "creditHour": 6.0,
            "termNo": 5,
            "examNo": "20250",
            "isPass": false,
            "isMakeup": 0,
            "examDefer": 0,
            "examMiss": 0,
            "courseRetake": 0,
            "isRequire": 1,
            "studentSelectionId": 0,
            "learningOpen": true,
            "passString": " ",
            "totalScore": "0",
            "scoreDetail": "\u003ctable border\u003d0 cellpadding\u003d0 cellspacing\u003d0 width\u003d\"100%\" style\u003d\"border:none\"\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e卷(100%)\u003c/td\u003e\u003c/tr\u003e\u003ctr\u003e\u003ctd align\u003dcenter style\u003d\"border:none\"\u003e无\u003c/td\u003e\u003c/tr\u003e\u003c/table\u003e",
            "onlineCourse": "",
            "learningUrl": "",
            "learningRate": 0.0,
            "scoreLesson": 0.0,
            "scoreExercise": 0.0,
            "scoreTesting": 0.0,
            "isUnifyType": false,
            "unifyTypeString": ""
        }

    ];


})();