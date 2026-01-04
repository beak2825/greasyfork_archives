// ==UserScript==
// @name         新疆医学教育网答题专用
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  storehouse
// @author       Xiguayaodade
// @license      MIT
// @match        *://www.xjyxjyw.com/*
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
// @downloadURL https://update.greasyfork.org/scripts/504685/%E6%96%B0%E7%96%86%E5%8C%BB%E5%AD%A6%E6%95%99%E8%82%B2%E7%BD%91%E7%AD%94%E9%A2%98%E4%B8%93%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/504685/%E6%96%B0%E7%96%86%E5%8C%BB%E5%AD%A6%E6%95%99%E8%82%B2%E7%BD%91%E7%AD%94%E9%A2%98%E4%B8%93%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals jQuery, $, waitForKeyElements */

    unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest;
    unsafeWindow.GM_getValue = GM_getValue;
    unsafeWindow.GM_deleteValue = GM_deleteValue;

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


    function saveHomeUrl(){
        let homeUrl = window.location.href;
        GM_setValue('homeUrl',homeUrl);
    }

    function getHomeUrl(){
        return GM_getValue('homeUrl');
    }

    function searchChapter(){
        if(chapterId >= chapterCount){
            addMessage("所有章节学习完成");
        }
        else{
            if(document.getElementsByTagName('tbody')[0].children[chapterId].children[4].innerText === '进入学习 已学习'){
                addMessage("第"+(chapterId+1)+"章节学习完成");
                chapterId++;
                searchChapter();
                return;
            }
            // getExamPage(chapterId);
            test(chapterId);
        }
    }

    var elements = null;

    function getAnswer(){
        let oldData = GM_getValue('answerList');

        if(Array.isArray(oldData)){
            return oldData;
        }

        return [];
    }

    function getAnswerByName(xgExamName){
        if(xgExamName === '' || xgExamName === null || xgExamName === undefined){
            alert("考题id不可为空!");
            return false;
        }

        let data = getAnswer();

        let result = data.reduce((accumulator,obj) => {
            if(xgExamName in obj){
                return obj[xgExamName];
            }
            return accumulator;
        },undefined);

        if(!result){
            alert('没有此考试数据！');
            return 'A';
        }
        return result;
    }

    function saveAnswer(name,value){
        let answer = getAnswer();

        let existIndex = answer.findIndex(obj => name in obj);

        if (existIndex !== -1) {
            // 更新值为['1','2','3']
            answer[existIndex][name] = value;
        } else {
            // push新集合
            let tempMap = {};
            tempMap[name] = value;
            answer.push(tempMap);
        }

        GM_setValue('answerList',answer);
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
        var ddds4 = $('<div style="position: absolute;top: 85%;width:94%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;"><button id="toExam" style="display: none;position: absolute;width:69px;right: 313px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">去考试</button><button id="beginExam" style="display: none;position: absolute;width:98px;right: 213px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">开始答题</button><a href="http://8.130.116.135/?article/" style="position: absolute;right: 10px;text-decoration: none;color: pink;">\u003e\u003e\u003e\u8054\u7cfb\u003a\u0031\u0039\u0030\u0038\u0032\u0034\u0035\u0033\u0030\u0032\u0040\u0071\u0071\u002e\u0063\u006f\u006d</a></div>');

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

        $("#beginExam").on('click',function(){
            beginExam();
        });

        $("#toExam").on('click',function(){
            window.open("https://se.mhtall.com/cuggw/rs/olex_index",'_blank');
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

    panel();
    // 手动启动定时器
    function startTimer() {
        wait = setInterval(function (){
            // ddds3.children().first().remove();
            if(window.location.href.split('?')[0] === 'http://www.xjyxjyw.com/member/hs_btszpx.do'){
                addMessage("课程详情加载中。。。");
                chapterCount = document.getElementsByTagName('tbody')[0].childElementCount;
                setTimeout(function(){
                        searchChapter();
                },3000);
                
            }
            else{
                tipsWin().then((result) => {
                    addMessage("前往课程详情页");
                });
            }
            clearInterval(wait);
        }, 100);
    }

    function test(cid){
        let courseId = document.getElementsByTagName('tbody')[0].children[cid].getElementsByTagName('a')[1].href.split('=')[1];
        GM_xmlhttpRequest({
            url:'http://www.xjyxjyw.com/member/leyiexam_result.do',
            method: "POST",
            Cookie: document.cookie + '',
            data: 'backurl=&leyiQuestion.data='+'[{"name":"qab1e1a64d9d911ee89326c92bf3bb305","value":"D"},{"name":"qab19ec84d9d911ee89326c92bf3bb305","value":"D"},{"name":"qab196a29d9d911ee89326c92bf3bb305","value":"E"},{"name":"qab1a21b4d9d911ee89326c92bf3bb305","value":"B"},{"name":"qab191f23d9d911ee89326c92bf3bb305","value":"A"}]'+'&leyiQuestion.courseId='+courseId,
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "Referer": "http://www.xjyxjyw.com/member/leyiexam_quelist.do?leyiQuestion.courseId="+courseId,
            },
            onload: function(response) {
                try{
                    var parser = new DOMParser();
                    var htmlDoc = parser.parseFromString(response.responseText, 'text/html');
                    var targetElement1 = htmlDoc.getElementsByClassName('wen')[0];
                    var targetElement2 = targetElement1.getElementsByClassName('h4');
                    console.log(targetElement1);
                    let ju = 1;
                    for(let i=0;i<targetElement2.length;i++){
                        let statusLength = targetElement2[i].innerText.split('：').length;
                        console.log('statusLength'+statusLength);
                        let statusStr = targetElement2[i].innerText.split('：')[statusLength-1];
                        console.log('statusStr'+statusStr);
                    }

                    setTimeout(function(){
                        console.log('作答完成');
                        addMessage("第"+(chapterId+1)+"章节作答完成");
                        chapterId++;
                        searchChapter();
                    },398);
                }catch(e){
                    console.log('无答案');
                }
            }
        });
    }

    function getExamPage(cid){
        let leyidata = [];
        let courseId = document.getElementsByTagName('tbody')[0].children[cid].getElementsByTagName('a')[1].href.split('=')[1];
        GM_xmlhttpRequest({
            url:'http://www.xjyxjyw.com/member/leyiexam_quelist.do?leyiQuestion.courseId='+courseId,
            method: "POST",
            Cookie: document.cookie + '',
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "Referer": "http://www.xjyxjyw.com/member/hs_play3.do?id="+courseId,
            },
            onload: function(response) {
                try{
                    var parser = new DOMParser();
                    var htmlDoc = parser.parseFromString(response.responseText, 'text/html');
                    var targetElement1 = htmlDoc.querySelector("#form1").getElementsByClassName('wen')[0];
                    var questionCount = targetElement1.getElementsByTagName('input').length;
                    console.log(targetElement1);
                    for(let i=0;i<questionCount;i+=5){
                        let tempMap = {};
                        let qid = targetElement1.getElementsByTagName('input')[i].id
                        tempMap['name'] = qid;
                        tempMap['value'] = getAnswerByName(qid);
                        leyidata.push(tempMap);
                        console.log(leyidata);
                    }
                    setTimeout(function(){
                        addMessage('获取考卷完成');
                        answerPost(cid,leyidata,0)
                    },500);
                }catch(e){
                    alert('考卷获取失败'+courseId);
                }
            }
        });
    }

    function answerPost(leyicourseId,leyidata,awIndex){
        // let leyidata = [
        //     {"name":"qab23d8eed9d911ee89326c92bf3bb305","value":"A"},
        //     {"name":"qab222fc0d9d911ee89326c92bf3bb305","value":"A"},
        //     {"name":"qab24393fd9d911ee89326c92bf3bb305","value":"A"},
        //     {"name":"qab217237d9d911ee89326c92bf3bb305","value":"A"},
        //     {"name":"qab1dd541d9d911ee89326c92bf3bb305","value":"A"}
        // ];
        // let leyicourseId = '205102020';
        GM_xmlhttpRequest({
            url:'http://www.xjyxjyw.com/member/leyiexam_result.do',
            method: "POST",
            Cookie: document.cookie + '',
            data: 'backurl=&leyiQuestion.data='+JSON.stringify(leyidata)+'&leyiQuestion.courseId='+leyicourseId,
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "Referer": "http://www.xjyxjyw.com/member/leyiexam_quelist.do?leyiQuestion.courseId="+leyicourseId,
            },
            onload: function(response) {
                try{
                    var parser = new DOMParser();
                    var htmlDoc = parser.parseFromString(response.responseText, 'text/html');
                    var targetElement1 = htmlDoc.getElementsByClassName('wen')[0];
                    var targetElement2 = targetElement1.getElementsByClassName('h4');
                    console.log(targetElement1);
                    let ju = 1;
                    for(let i=0;i<targetElement2.length;i++){
                        let statusLength = targetElement2[i].innerText.split('：').length;
                        console.log('statusLength'+statusLength);
                        let statusStr = targetElement2[i].innerText.split('：')[statusLength-1];
                        console.log('statusStr'+statusStr);
                        if(statusStr === '错误'){
                            switch(awIndex)
                            {
                                case 0:
                                    leyidata[i].value = 'B';
                                    console.log("修改B"+i);
                                    break;
                                case 1:
                                    leyidata[i].value = 'C';
                                    console.log("修改C"+i);
                                    break;
                                case 2:
                                    leyidata[i].value = 'D';
                                    console.log("修改D"+i);
                                    break;
                                case 3:
                                    leyidata[i].value = 'E';
                                    console.log("修改E"+i);
                                    break;
                                case 4:
                                    leyidata[i].value = 'F';
                                    console.log("修改F"+i);
                                    break;
                                case 5:
                                    leyidata[i].value = 'G';
                                    console.log("修改G"+i);
                                    break;
                            }
                        }
                        else{
                            ++ju;
                            saveAnswer(leyidata[i].name,leyidata[i].value);
                        }
                    }

                    setTimeout(function(){
                        if(ju <= targetElement2.length){
                            console.log(leyidata);
                            ju=1;
                            answerPost(leyicourseId,leyidata,++awIndex);
                        }
                        else{
                            console.log('作答完成');
                            console.log(leyidata);
                        }
                    },1500);
                }catch(e){
                    console.log('无答案');
                }
            }
        });
    }

    // 手动停止定时器
    function stopTimer() {
        clearInterval(wait);
    }

    startTimer();

    function reloadPage(){
        setInterval(function (){
            window.location.reload()
        },1000*60*33);
    }


    function beginExam(){
        console.log("开始答题");
        try{
            ksPage = document.querySelector("body > div.paper_body");
            let ksName = ksPage.children[0].innerText;
            quesionCount = ksPage.getElementsByClassName('item_li').length;
            let coursOB = findLC(ksName);

            if(!coursOB){
                addMessage(coursOB);
                addMessage("题库没有找到该课程");
                return;
            }
            else{
                learningCourseId = coursOB.learningCourseId;
                learningUrl = coursOB.learningUrl;
                console.log("找到learningCourseId",learningCourseId);
                console.log("找到learningUrl",learningUrl);
            }

            testP();


            examDing();
        }catch(e){
            addMessage("请前往考试页");
            console.log("异常",e)
        }


    }




})();