// ==UserScript==
// @name         🍉国投湄洲湾电力🍉
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  学习助手
// @author       Xiguayaodade
// @license      MIT
// @match        *://cloud.bjgzyd.com/*
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
// @icon         https://www.google.com/s2/favicons?sz=64&domain=o-learn.cn
// @connect      icodef.com
// @connect      localhost
// @antifeature  free  限时免费
// @require      https://update.greasyfork.org/scripts/499395/1403559/jquery_360%E2%80%94%E2%80%94copy.js
// @downloadURL https://update.greasyfork.org/scripts/512593/%F0%9F%8D%89%E5%9B%BD%E6%8A%95%E6%B9%84%E6%B4%B2%E6%B9%BE%E7%94%B5%E5%8A%9B%F0%9F%8D%89.user.js
// @updateURL https://update.greasyfork.org/scripts/512593/%F0%9F%8D%89%E5%9B%BD%E6%8A%95%E6%B9%84%E6%B4%B2%E6%B9%BE%E7%94%B5%E5%8A%9B%F0%9F%8D%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* globals jQuery, $, waitForKeyElements */

    var ddds3 = null;
    var addMessage = null;

    unsafeWindow.GM_getValue = GM_getValue
    unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest

    Window.onbeforeunload = null;//禁用阻塞弹窗“您的更改未保存”

    let btn1=GM_registerMenuCommand ("\u4f5c\u8005\uff1a\ud83c\udf49\u897f\u74dc\u8981\u5927\u7684\ud83c\udf49", function(){
        confirm("Hello,\u611f\u8c22\u4f7f\u7528\ud83c\udf49\u897f\u74dc\u5237\u8bfe\u52a9\u624b\ud83c\udf49\uff01\u591a\u591a\u53cd\u9988\u54e6");
        GM_unregisterMenuCommand(btn1);
    }, "");
    let btn2=GM_registerMenuCommand ("\u4ed8\u8d39\u5185\u5bb9", function(){
        alert("\u9650\u65f6\u514d\u8d39\uff0c\u5168\u529b\u5f00\u53d1\u4e2d...");
    }, "p");

    const parentOpenURL = [
        '',//课程列表详表url
    ];

    var hrefList = [
        '/epepcs/exam/personal-homepage',//首页
        '/epepcs/100009/login',//教育登录
        '/epepcs/exam/learn/course',//课程列表简表
        '/epepcs/exam/learn',//学习汇总
        '/epepcs/exam/learn/course/detail',//学习page
    ];
    let nowPage = window.location.pathname;

    if(!hrefList.includes(nowPage)){
        return;
    }

    var overlay;
    function startSetInt(){
        document.getElementsByTagName('button')[document.getElementsByTagName('button').length-1].click();
        nowPage = window.location.pathname;
        try{
            switch(nowPage){
                case hrefList[0]:
                    ddds3.children().remove();
                    addMessage("首页，请进入要学习的课程");
                    setTimeout(function(){
                        startSetInt();
                    },1000);
                    break;
                case hrefList[1]:
                    ddds3.children().remove();
                    addMessage("请登录");
                    setTimeout(function(){
                        startSetInt();
                    },1000);
                    break;
                case hrefList[2]:
                    ddds3.children().remove();
                    addMessage("课程列表简表，开始接管");
                    setTimeout(function(){
                        document.querySelector('#tab-2').click();
                        setTimeout(function(){
                            courseCount = document.getElementsByClassName('learn_course_catalog_courseware').length;
                            serchCourse();
                        },2000);
                    },1500);
                    break;
                case hrefList[3]:
                    ddds3.children().remove();
                    addMessage("学习汇总，请进入要学习的课程");
                    setTimeout(function(){
                        startSetInt();
                    },1000);
                    break;
                case hrefList[4]:
                    ddds3.children().remove();
                    addMessage("学习页");

                    setTimeout(function(){
                        startTimer();
                    },1000);
                    break;
                default:
                    ddds3.children().remove();
                    addMessage("此页面不在接管范围");
                    setTimeout(function(){
                        startSetInt();
                    },1000);
            }
        }catch(e){
            addMessage(e);
        }
    }

    var courseCount = 0;
    var courseIndex = 0;
    function serchCourse(){
        if(courseIndex >= courseCount){
            addMessage("所有课程学习完毕！");
        }
        else{
            let ariaNow = parseInt(document.getElementsByClassName('learn_course_catalog_courseware')[courseIndex].getElementsByClassName('el-progress el-progress--circle')[0].ariaValueNow);
            if(ariaNow < 99){
                document.getElementsByClassName('learn_course_catalog_courseware')[courseIndex].getElementsByClassName('el-button el-button--success el-button--small')[0].click();
                courseIndex = 0;
                startTimer();
                return;
            }
            courseIndex++;
            serchCourse();
        }
    }

    var studying;

    function studyLisen(){
        ddds3.children().remove();
        nowPage = window.location.pathname;
        if(nowPage === hrefList[4]){
            try{
                let timeStatus = document.querySelector('.text-right').innerText;
                if(timeStatus != '已完成'){
                    addMessage("学习中...");
                    document.getElementsByTagName('button')[document.getElementsByTagName('button').length-1].click();
                    addMessage("学习中...");
                }
                else{
                    addMessage("学习完毕...");
                    stopTimer();
                    setTimeout(function(){
                        setTimeout(function(){
                            document.getElementsByClassName('el-button el-button--primary el-button--medium')[0].click();
                            startSetInt();
                        },1500);
                    },1000);
                }
            }catch(e){
                addMessage("继续学习："+e);
            }
        }
        else{
            ddds3.children().remove();
            addMessage("等待加载进入学习，点击按钮可重启");
        }
    }

    // 开始定时器
    function startTimer() {
        // 如果定时器尚未启动，启动它
        if (!studying) {
            studying = setInterval(studyLisen, 3000); // 每1000毫秒（1秒）执行一次
            console.log("定时器已启动");
        }
    }

    // 停止定时器
    function stopTimer() {
        if (studying) {
            clearInterval(studying); // 停止定时器
            studying = null; // 重置定时器 ID
            console.log("定时器已停止");
        }
    }

    panel();
    addMessage("正在启动》》》");
    addMessage(window.location.href);

    tipsWin().then((result) => {
        if(!result){
            startSetInt();
        }else{
            ddds3.children().remove();
            addMessage("取消-刷新页面即可重启");
        }
    });

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
        <p id="timeCount">10秒后执行脚本?</p>
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
                // ddds3.children().remove();
                // addMessage("刷新页面即可重启");
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

            ju(10);

            function closePopup() {
                popup.style.display = 'none';
            }
        });

    }

    function panel(){
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
        var ddds4 = $('<div style="position: absolute;top: 85%;width:94%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;"><button id="beginExam" style="position: absolute;width:139px;right: 216px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">清空缓存并重启</button><a href="http://8.130.116.135/?article/" style="position: absolute;right: 10px;text-decoration: none;color: pink;">\u003e\u003e\u003e\u8054\u7cfb\u003a\u0031\u0039\u0030\u0038\u0032\u0034\u0035\u0033\u0030\u0032\u0040\u0071\u0071\u002e\u0063\u006f\u006d</a></div>');

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
            width: 422px;
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
            addMessage('重启中..');
            startSetInt();
            GM_deleteValue('courseIndex');
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
})();