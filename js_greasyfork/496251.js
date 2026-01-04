// ==UserScript==
// @name         教师发展网
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  仅凭连接访问，专业版
// @author       Xiguayaodade
// @license      MIT
// @match        *://ifang.hnteacher.net/*
// @match        *://se.mhtall.com/*
// @match        *://jlufe.mhtall.com/*
// @match        *://teacher.hunan.smartedu.cn/*
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
// @noframes
// @namespace    http://tampermonkey.net/
// @homepage     http://8.130.116.135/?article/
// @source       http://8.130.116.135/?article/
// @icon         https://picx.zhimg.com/v2-ce62b58ab2c7dc67d6cabc3508db5795_l.jpg?source=32738c0c
// @connect      icodef.com
// @connect      localhost
// @connect      learning.mhtall.com
// @antifeature  free  限时免费
// @require      https://update.greasyfork.org/scripts/499395/1403559/jquery_360%E2%80%94%E2%80%94copy.js
// @downloadURL https://update.greasyfork.org/scripts/496251/%E6%95%99%E5%B8%88%E5%8F%91%E5%B1%95%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/496251/%E6%95%99%E5%B8%88%E5%8F%91%E5%B1%95%E7%BD%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals jQuery, $, waitForKeyElements */

    unsafeWindow.GM_setValue = GM_setValue
    unsafeWindow.GM_getValue = GM_getValue
    unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest
    unsafeWindow.GM_deleteValue = GM_deleteValue

    // 创建一个新的 script 标签
    var script = document.createElement('script');
    script.textContent = 'window.alert = function(){};';

    // 将 script 标签插入到页面的 head 中
    document.head.appendChild(script);

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
    var chapterId = 0;
    var sectionCount = 0;
    var sectionId = 0;
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

    function saveChapterUrl(){
        let chapterUrl = window.location.href;
        GM_setValue('chapterUrl',chapterUrl);
    }

    function getChapterUrl(){
        return GM_getValue('chapterUrl');
    }

    function searchCours(){
        if(chapterId < chapterCount){
            sectionCount = document.querySelector("#courseList").children[chapterId].getElementsByTagName('li').length;
            if(sectionId < sectionCount){
                let contentStr = document.querySelector("#courseList").children[chapterId].getElementsByTagName('li')[0].innerText;
                if(contentStr != '该章节暂无课程信息，请返回课程列表选课或刷新后重试。请点击刷新!'){
                    let fenzi = parseInt(document.querySelector("#courseList").children[chapterId].getElementsByTagName('li')[sectionId].children[1].children[0].innerText);
                    let fenmu = parseInt(document.querySelector("#courseList").children[chapterId].getElementsByTagName('li')[sectionId].children[1].innerText.split('/')[1]);
                    if(fenzi < fenmu){
                        setTimeout(function(){
                            addMessage("学习"+(chapterId+1)+"章"+(sectionId+1)+"节");
                            addMessage("10S后关闭此页");
                            document.querySelector("#courseList").children[chapterId].getElementsByTagName('li')[sectionId].children[0].click();
                            setTimeout(function(){
                                window.close();
                            },1000 * 10);
                        },1500);
                    }else{
                        sectionId++;
                        searchCours();
                    }
                }
                else{
                    sectionId = 0;
                    chapterId++;
                    searchCours();
                }
            }else{
                sectionId = 0;
                chapterId++;
                searchCours();
            }
        }else{

        }
    }

    search = function(){
        if(tempTime >= studyTime){
            addMessage("课程完成"+tempTime+"/"+studyTime+"，10秒后回主页");
            setTimeout(function(){
                window.open(getHomeUrl(),'_self');
            },10000);
            return;
        }
        if(chapterId < chapterCount){
            sectionCount = document.querySelector("#courseList").children[chapterId].getElementsByTagName('li').length;
            searchSection();
        }else{
            if(tempTime < studyTime){
                addMessage(tempTime+"/"+studyTime);
                addMessage("课程进度未达标，检索未完成章节");
                chapterId = 0;
                sectionId = 0;
                searchCours();
                return;
            }
            else{
                addMessage("课程完成"+tempTime+"/"+studyTime+"，10秒后回主页");
                setTimeout(function(){
                    window.open(getHomeUrl(), "_self");
                },10000);
            }
        }
    }

    function searchSection(){
        if(sectionId < sectionCount){
            let contentStr = document.querySelector("#courseList").children[chapterId].getElementsByTagName('li')[0].innerText;
            if(contentStr != '该章节暂无课程信息，请返回课程列表选课或刷新后重试。请点击刷新!'){
                let fenzi = parseInt(document.querySelector("#courseList").children[chapterId].getElementsByTagName('li')[sectionId].children[1].children[0].innerText);

                tempTime = tempTime + fenzi;
                sectionId++;
                search();
            }
            else{
                sectionId = 0;
                chapterId++;
                search();
            }
        }else{
            sectionId = 0;
            chapterId++;
            search();
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
        var ddds4 = $('<div style="position: absolute;top: 85%;width:94%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;"><button id="setFlag" style="position: absolute;width:116px;right: 169px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">学习目标</button><button id="delData" style="position: absolute;width:129px;right: 20px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">清空缓存</button></div>');

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

        $("#delData").on('click',function(){
            ddds3.children().remove();
            GM_deleteValue('courseIndex');
            addMessage("已清空缓存");
        });

        $("#setFlag").on('click',function(){
            ddds3.children().remove();
            let examName = $('<div id="tableForm"><div><input type="text" id="shizisy" placeholder="数字素养学习目标（分钟）"></div><div><input type="text" id="shidets" placeholder="师德提升学习目标（分钟）"></div><button id="xgSave" style="width:88px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">保存</button></div>');
            examName.appendTo(ddds3);

            $("#xgSave").on('click',function(){
                let szTime = parseInt($("#shizisy").val());
                let sdTime = parseInt($("#shidets").val());
                setXueXiTime(szTime,sdTime);
                alert("保存成功"+szTime+"，"+sdTime);
            });
        })

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

    var answer_key

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
                            
                        }, 1000);
                    }
                    else{
                        document.getElementById('timeCount').innerText = time+'秒后执行脚本?';
                    }
                    
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

    function getCourseIndex(){
        let oldData = GM_getValue('courseIndex');
        if (Array.isArray(oldData)) {
            return oldData;
        }
        return [];
    }

    function setCourseIndex(indexList){

        GM_setValue('courseIndex',indexList);

        return true;
    }

    function sdORsz(){
        let dORz = document.querySelector("#PageHead > div > h2 > font").innerText.includes('数字');
        let szTime;
        if(dORz){
            szTime = getShuZi();
            addMessage("数字素养目标:"+szTime+"分钟");
            return szTime;
        }
        else{
            szTime = getShiDe();
            addMessage("师德提升目标:"+szTime+"分钟");
            return szTime;
        }
    }

    function setXueXiTime(sz,sd){
        GM_setValue('shuzisy',sz);
        GM_setValue('shidets',sd);
    }

    function getShuZi(){
        let oldTime = GM_getValue('shuzisy');
        if(!oldTime){
            GM_setValue('shuzisy',800);
            return 800;
        }
        return oldTime;
    }

    function getShiDe(){
        let oldTime = GM_getValue('shidets');
        if(!oldTime){
            GM_setValue('shidets',1000);
            return 1000;
        }
        return oldTime;
    }


    var wait = null;
    var overlay;

    // 手动启动定时器
    function startTimer() {
        wait = setInterval(function (){
            ddds3.children().first().remove();
            if(window.location.href.split('?')[0] === 'https://ifang.hnteacher.net/HTML/WorkShops/workshop-courses.html' || window.location.href.split('?')[0] === 'https://teacher.hunan.smartedu.cn/ifang/HTML/WorkShops/workshop-courses.html'){
                addMessage("选课页");
                saveHomeUrl();
                tipsWin().then((result) => {
                    if(!result){
                        studyTime = (sdORsz()/60).toFixed;
                        setTimeout(function(){
                            addMessage("启动");
                            allCours = document.querySelector("#courseList").childElementCount;
                            if(allCours <= 0){
                                addMessage("无待学课程");
                                stopTimer();
                                return;
                            }

                            if(getCourseIndex()[0] === 'x'){
                                addMessage("课程学习完毕，清除缓存刷新即可重启");
                                return;
                            }
                            else if(getCourseIndex().length < 1){
                                addMessage("新记录");
                                let indexList = [];
                                for(let i=0;i<allCours;i++){
                                    indexList.push(i);
                                }
                                setTimeout(function(){
                                    setCourseIndex(indexList);
                                    xuanKe(0,allCours);
                                },1000);
                            }
                            else{
                                addMessage("读取记录");
                                xuanKe(0,allCours);
                            }

                        },1000);
                    }else{
                        addMessage("取消");
                    }
                });

            }
            else if(window.location.href.split('?')[0] === 'https://ifang.hnteacher.net/HTML/WorkShops/workshop-course-details.html' || window.location.href.split('?')[0] === 'https://teacher.hunan.smartedu.cn/ifang/HTML/WorkShops/workshop-course-details.html'){
                addMessage("章节列表");
                saveChapterUrl();
                tipsWin().then((result) => {
                    if(!result){
                        studyTime = sdORsz();
                        setTimeout(function(){
                            addMessage("启动");
                            chapterCount = document.querySelector("#courseList").childElementCount;

                            search();
                        },1000);
                    }else{
                        addMessage("取消");
                    }
                });
            }
            else if(window.location.href.split('?')[0] === 'https://ifang.hnteacher.net/HTML/WorkShops/workshop-course-play.html' || window.location.href.split('?')[0] === 'https://teacher.hunan.smartedu.cn/ifang/HTML/WorkShops/workshop-course-play.html'){
                addMessage("学习页");

                tipsWin().then((result) => {
                    if(!result){
                        setTimeout(function(){
                            addMessage("启动");
                            let cTime = parseInt(document.querySelector("#_ctime").innerText);
                            if(document.querySelector("#ZyTreeView").childElementCount < 1){
                                listenTime(cTime);
                            }
                            else{

                                if(document.querySelector("#_easyui_tree_2").innerText[1] === '.'){
                                    document.querySelector("#_easyui_tree_2").click();
                                    setTimeout(function(){
                                        document.getElementsByTagName('video')[0].volume = 0;
                                        listenTimeSD(cTime);
                                    },5000);
                                }
                                else if(document.querySelector("#_easyui_tree_3").innerText[1] === '.'){
                                    document.querySelector("#_easyui_tree_3").click();
                                    setTimeout(function(){
                                        document.getElementsByTagName('video')[0].volume = 0;
                                        listenTimeSD(cTime);
                                    },5000);
                                }
                                else if(document.querySelector("#_easyui_tree_4").innerText[1] === '.'){
                                    document.querySelector("#_easyui_tree_4").click();
                                    setTimeout(function(){
                                        document.getElementsByTagName('video')[0].volume = 0;
                                        listenTimeSD(cTime);
                                    },5000);
                                }

                            }
                        },1000);
                    }else{
                        addMessage("取消");
                    }
                });
            }
            else{
                addMessage("请先前往选课界面");
                addMessage("tips:");
                $('<div class="message"></div>').text('点击学习目标可设置学习时长（分钟）').css({
                    'margin-bottom': '10px',
                    'color':'red'
                }).appendTo(ddds3);
                addMessage("选课界面若无自动跳转，请检查浏览器地址栏");
                addMessage("提示选择允许跳转与重定向");
            }
           stopTimer();
        }, 2000);
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

    var cIndex = 0;
    function xuanKe(index,count){
        if(index < count){
            if(!document.querySelector("#courseList").getElementsByTagName('input')[index].checked){
                document.querySelector("#courseList").getElementsByTagName('input')[index].click();

                setTimeout(function(){
                    cLCount = document.querySelector("#courseList2").childElementCount;
                    cIndex = index;
                    xuanKeTow(0,cLCount);
                },3000);
            }else{
                addMessage("无需选课");
                tempTime = 0;
                setTimeout(function(){
                    xuanKe(++cIndex,allCours);
                },1000);
            }
        }
        else{
            addMessage("已完成选课course");
            setTimeout(function(){
                let oldCourseIndex = getCourseIndex();
                console.log(oldCourseIndex);
                let a = oldCourseIndex[0];
                oldCourseIndex.shift();

                if(oldCourseIndex.length < 1){
                    oldCourseIndex.push('x');
                }

                console.log(a);
                setCourseIndex(oldCourseIndex);
                if(a >= count || a === undefined || a === 'x'){
                    addMessage("请清空缓存刷新重启");
                    return;
                }
                if(document.querySelector("#courseList").getElementsByTagName('input')[a].checked){
                    document.querySelector("#courseList").children[a].querySelector('a').click();
                }
                else{
                    GM_deleteValue('courseIndex');
                    setTimeout(function(){
                        window.location.reload();
                    },1000);
                }
            },1000);
        }
    }

    var cLCount = 0;
    var tempTime = 0;
    function xuanKeTow(index,count){
        if(index < count){
            if(tempTime < studyTime){
                tempTime = tempTime + parseFloat(document.querySelector("#courseList2").children[index].getElementsByTagName('span')[0].innerText.split('：')[3]);

                document.querySelector("#courseList2").children[index].getElementsByTagName('input')[0].click();
                addMessage("已选:"+tempTime+"小时");
                xuanKeTow(++index,count)
            }
            else{
                addMessage("已完成选课time,");


                document.querySelector("#btn_sub").click();
                tempTime = 0;
                setTimeout(function(){
                    xuanKe(++cIndex,allCours);
                },2000);
            }
        }
        else{
            addMessage("已完成选课count");

            document.querySelector("#btn_sub").click();
            tempTime = 0;
            setTimeout(function(){
                xuanKe(++cIndex,allCours);
            },1000);
        }
    }

    var min = 0;
    function listenTime(ctime){
        min = parseInt(document.querySelector("#min").innerText);
        // addMessage(ctime+"/"+min);
        if(ctime <= min){
            addMessage("学习已达标,等待上传学习记录（约30S）");
            setTimeout(function(){
                window.open(getChapterUrl(),'_self');
            },1000 * 30);
        }
        else{
            ddds3.children().remove();
            addMessage("学习未达标");
            setTimeout(function(){
                listenTime(ctime)
            },1000 * 30);
        }
    }

    function listenTimeSD(ctime){
        min = parseInt(document.querySelector("#min").innerText);
        // addMessage(ctime+"/"+min);
        if(ctime <= min){
            addMessage("学习已达标,等待上传学习记录（约30S）");
            setTimeout(function(){
                window.open(getChapterUrl(),'_self');
            },1000 * 30);
        }
        else{
            ddds3.children().remove();
            addMessage("学习未达标");
            if(document.getElementsByTagName('video')[0].pause){
                document.getElementsByTagName('video')[0].play();
            }
            setTimeout(function(){
                listenTimeSD(ctime)
            },1000 * 30);
        }
    }

})();