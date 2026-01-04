// ==UserScript==
// @name         湖南人才市场公共教育网(考试)
// @namespace    http://tampermonkey.net/
// @version      0.0.5
// @description  考试辅助...
// @author       Xiguayaodade
// @license      MIT
// @match        *://admin.hnpxw.org/*
// @noframes
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
// @match        https://admin.hnpxw.org/learner/examine/openPaper.do?examID=108&pageNum=0&type=0&jtoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MTc4MzQwMTM5MTgsInBheWxvYWQiOiJ7XCJ1c2VySWRcIjozMjQwNCxcImxvZ2luTmFtZVwiOlwieWluZ3ppOTIwNDA1XCJ9In0.UKOqnYKTZkRYASDWlMH2YtkTr34kXY8d3hlD8BL9nBk&url=https%3A%2F%2Fhnpxw.org%2FuserStudy%3Fname%3DExam
// @icon         https://picx.zhimg.com/v2-ce62b58ab2c7dc67d6cabc3508db5795_l.jpg?source=32738c0c
// @connect      icodef.com
// @connect      localhost
// @require      https://update.greasyfork.org/scripts/499395/1403559/jquery_360%E2%80%94%E2%80%94copy.js
// @downloadURL https://update.greasyfork.org/scripts/496825/%E6%B9%96%E5%8D%97%E4%BA%BA%E6%89%8D%E5%B8%82%E5%9C%BA%E5%85%AC%E5%85%B1%E6%95%99%E8%82%B2%E7%BD%91%28%E8%80%83%E8%AF%95%29.user.js
// @updateURL https://update.greasyfork.org/scripts/496825/%E6%B9%96%E5%8D%97%E4%BA%BA%E6%89%8D%E5%B8%82%E5%9C%BA%E5%85%AC%E5%85%B1%E6%95%99%E8%82%B2%E7%BD%91%28%E8%80%83%E8%AF%95%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals jQuery, $, waitForKeyElements */
    unsafeWindow.GM_getValue = GM_getValue
    unsafeWindow.GM_deleteValue = GM_deleteValue
    unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest

    // 检查当前窗口是否为顶层窗口
    if (window.self === window.top) {
        if(window.location.href.split('?')[0].toString() != 'https://admin.hnpxw.org/learner/examine/openPaper.do'){
            return;// 如果是顶层窗口，则不执行脚本
        }
    }

    // 创建一个新的 script 标签
    var script = document.createElement('script');
    script.textContent = 'console.log("Script injected by Tampermonkey!");';

    // 将 script 标签插入到页面的 head 中
    document.head.appendChild(script);

    let btn1=GM_registerMenuCommand ("\u4f5c\u8005\uff1a\ud83c\udf49\u897f\u74dc\u8981\u5927\u7684\ud83c\udf49", function(){
        confirm("Hello,\u611f\u8c22\u4f7f\u7528\ud83c\udf49\u897f\u74dc\u5237\u8bfe\u52a9\u624b\ud83c\udf49\uff01\u591a\u591a\u53cd\u9988\u54e6");
        GM_unregisterMenuCommand(btn1);
    }, "");
    let btn2=GM_registerMenuCommand ("\u4ed8\u8d39\u5185\u5bb9", function(){
        alert("\u9650\u65f6\u514d\u8d39\uff0c\u5168\u529b\u5f00\u53d1\u4e2d...");
    }, "p");

    var ddds3 = null;
    var addMessage = null;

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
        ddds3 = $('<div id="message-container" style="position: absolute;display: grid;align-content: baseline;justify-content: center;top: 20%;width:94%;height:62%;max-height:62%;overflow-y:auto;padding: 3px;background: #ffffff;border-radius: 5px;"></div>');
        var ddds4 = $('<div style="position: absolute;top: 85%;width:94%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;"><button id="saveExam" style="position: absolute;width:69;right: 356px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">录入</button><button id="beginExam" style="position: absolute;width:69;right: 306px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">考试</button><button id="delExam" style="position: absolute;width:69;right: 256px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">删除</button><a href="http://8.130.116.135/?article/" style="position: absolute;right: 10px;text-decoration: none;color: pink;">\u003e\u003e\u003e\u8054\u7cfb\u003a\u0031\u0039\u0030\u0038\u0032\u0034\u0035\u0033\u0030\u0032\u0040\u0071\u0071\u002e\u0063\u006f\u006d</a></div>');

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


        $("#beginExam").on('click',function(){
            ddds3.children().remove();
            let examName = $('<div id="tableForm"><div><input type="text" id="xgExamName" placeholder="请输入考试课程名称"></div><button id="xgSelect" style="width:88px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">开始</button></div>');
            examName.appendTo(ddds3);

            $("#xgSelect").on('click',function(){
                let ju = getAnswerByName();
                if(!ju){
                    return;
                }

                ddds3.children().remove();
                addMessage('开始答题：'+ju);
                document.querySelector("#insertPaper").children[1].children[0].children[2].click();
                let danxuanCount = document.querySelector("#insertPaper").children[2].getElementsByClassName('e_juan02daan').length;
                nowAnswer = ju;
                beginExam(danxuanCount);
            });

            pintOldData();
        });

        $('#saveExam').on('click',function(){
            ddds3.children().remove();
            let tableForm = $('<div id="tableForm"><div><input type="text" id="xgExamName" placeholder="请输入考试课程名称"></div><div><textarea type="text" id="xgAnswer" placeholder="请输入答案集"></textarea></div><button id="xgSave" style="width:88px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">保存</button></div>');
            tableForm.appendTo(ddds3);

            $("#xgSave").on('click',function(){
                let xgExamName = $("#xgExamName").val();
                let xgAnswer = $("#xgAnswer").val();
                if(xgExamName === '' || xgExamName === null || xgExamName === undefined){
                    alert("考试课程不可为空!");
                }
                else if(xgAnswer === '' || xgAnswer === null || xgAnswer === undefined){
                    alert("答案集不可为空!");
                }
                else{
                    console.log(xgAnswer);
                    let aw = xgAnswer.split(',');
                    saveAnswer(xgExamName,aw);
                    alert('保存成功：（'+JSON.stringify(aw)+'），刷新页面即可自启动');
                }
            });

            pintOldData();
        });

        $("#delExam").on('click',function(){
            ddds3.children().remove();
            // GM_deleteValue('answerList');
            addMessage("未获取删除权限");
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

    function pintOldData(){
        addMessage('保存记录：');
        getAnswer().forEach(obj => {
            for (let key in obj) {
                addMessage(key);
            }
        });
    }

    function getAnswerByName(){
        let xgExamName = $("#xgExamName").val();

        if(xgExamName === '' || xgExamName === null || xgExamName === undefined){
            alert("考试课程不可为空!");
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
            addMessage('没有此考试数据！');
            return false;
        }
        return result;
    }

    function getAnswer(){
        let oldData = GM_getValue('answerList');

        if(Array.isArray(oldData)){
            return oldData;
        }

        return [];
    }

    function saveAnswer(name,content){
        let answer = getAnswer();

        let existIndex = answer.findIndex(obj => name in obj);

        if (existIndex !== -1) {
            // 更新值为['1','2','3']
            answer[existIndex][name] = content;
        } else {
            // push新集合
            let tempMap = {};
            tempMap[name] = content;
            answer.push(tempMap);
        }

        GM_setValue('answerList',answer);
    }

    panel();
    addMessage("》》》》》辅助工具");


    var wait = null;
    var overlay;
    function startSetInt(){
        wait = setInterval(function (){
            ddds3.children().remove();
            addMessage("考试");
            if(window.location.href.split('?')[0].toString() === 'https://admin.hnpxw.org/learner/examine/openPaper.do'){
                try{
                    tipsWin().then((result) => {
                        if(!result){
                            // ddds3.children().remove();
                            addMessage("启动");
                            setTimeout(function(){

                            },1000);
                        }else{
                            addMessage("取消");
                        }
                    });
                }catch(e){
                    addMessage(e);
                }
            }
            else{
                addMessage("当前状态无法使用");
            }
            stopTimer();
        }, 900);
    }

    // 手动停止定时器
    function stopTimer() {
        clearInterval(wait);
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

    startSetInt();

    var nowAnswer = null;
    var questionIndex = 1;
    var answerIndex = 0;
    function beginExam(count){
        if(questionIndex < count){
            console.log();
            inputRadio(0,nowAnswer[answerIndex],count,2);
        }
        else{
            addMessage('单选结束');
            console.log('单选结束');
            nowAnswer.splice(0,count/2);
            console.log(nowAnswer);
            questionIndex = 1;
            answerIndex = 0;

            document.querySelector("#insertPaper").children[1].children[0].children[3].click();
            let duoxuanCount = document.querySelector("#insertPaper").children[3].getElementsByClassName('e_juan02daan').length;

            setTimeout(function(){
                beginExamTow(duoxuanCount);
            },1000);
        }
    }

    function beginExamTow(count){

        if(questionIndex < count){
            inputRadio(0,nowAnswer[answerIndex],count,3);
        }
        else{
            addMessage('多选结束');
            nowAnswer.splice(0,count/2);
            questionIndex = 1;
            answerIndex = 0;

            document.querySelector("#insertPaper").children[1].children[0].children[4].click();
            let panduanCount = document.querySelector("#insertPaper").children[3].getElementsByClassName('e_juan02daan').length;

            setTimeout(function(){
                beginExamThree(panduanCount);
            },1000);
        }
    }

    function beginExamThree(count){

        if(questionIndex < count){
            inputRadio(0,nowAnswer[answerIndex],count,4);
        }
        else{
            addMessage('判断结束');
            addMessage('答题完毕END');
            nowAnswer.splice(0,count/4);
            questionIndex = 1;
            answerIndex = 0;
        }
    }

    function inputRadio(index,answer,count,page){
        let tempAW = answer;
        let tempCount = count;
        let tempPage = page;
        console.log(index,answer,count,page);
        if(index < tempAW.length){
            switch(answer[index])
            {
                case 'A':
                    console.log("第"+(answerIndex+1)+"题选","A");
                    radioOk(0,page);
                    break;
                case 'B':
                    console.log("第"+(answerIndex+1)+"题选","B");
                    radioOk(1,page);
                    break;
                case 'C':
                    console.log("第"+(answerIndex+1)+"题选","C");
                    radioOk(2,page);
                    break;
                case 'D':
                    console.log("第"+(answerIndex+1)+"题选","D");
                    radioOk(3,page);
                    break;
                case 'E':
                    console.log("第"+(answerIndex+1)+"题选","E");
                    radioOk(4,page);
                    break;
                case '√':
                    console.log("第"+(answerIndex+1)+"题选","是");
                    radioOk(0,page);
                    break;
                case '×':
                    console.log("第"+(answerIndex+1)+"题选","否");
                    radioOk(1,page);
                    break;
            }

            setTimeout(function(){
                inputRadio(++index,tempAW,tempCount,tempPage)
            },200);
        }else{
            console.log("第"+(answerIndex+1)+"题结束");
            addMessage("第"+(answerIndex+1)+"题结束"+nowAnswer[answerIndex]);
            setTimeout(function(){
                questionIndex+=2;
                answerIndex++;

                switch(page)
                {
                    case 2:
                        beginExam(count);
                        break;
                    case 3:
                        beginExamTow(count);
                        break;
                    case 4:
                        beginExamThree(count);
                        break;
                }
            },333);
        }
    }

    function radioOk(index,page){
        if(!document.querySelector("#insertPaper").children[page].getElementsByClassName('e_juan02daan')[questionIndex].getElementsByTagName('input')[index].checked){
            document.querySelector("#insertPaper").children[page].getElementsByClassName('e_juan02daan')[questionIndex].getElementsByTagName('input')[index].click();
        }
        else{
            console.log('无需重复选择');
            addMessage('无需重复选择');
        }
    }
})();