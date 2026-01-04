// ==UserScript==
// @name         🍉医药职工🍉
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  storehouse
// @author       Xiguayaodade
// @license      MIT
// @match        *://yzd.o-learn.cn/*
// @match        *://jxjyseiglearning.o-learn.cn/*
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
// @downloadURL https://update.greasyfork.org/scripts/512129/%F0%9F%8D%89%E5%8C%BB%E8%8D%AF%E8%81%8C%E5%B7%A5%F0%9F%8D%89.user.js
// @updateURL https://update.greasyfork.org/scripts/512129/%F0%9F%8D%89%E5%8C%BB%E8%8D%AF%E8%81%8C%E5%B7%A5%F0%9F%8D%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals jQuery, $, waitForKeyElements */
    unsafeWindow.GM_getValue = GM_getValue
    unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest

    Window.onbeforeunload = null;//禁用阻塞弹窗“您的更改未保存”

    // 检查当前窗口是否为顶层窗口
    //     if (window.self !== window.top) {
    //          return;
    //     }else{

    //     }

    let btn1=GM_registerMenuCommand ("\u4f5c\u8005\uff1a\ud83c\udf49\u897f\u74dc\u8981\u5927\u7684\ud83c\udf49", function(){
        confirm("Hello,\u611f\u8c22\u4f7f\u7528\ud83c\udf49\u897f\u74dc\u5237\u8bfe\u52a9\u624b\ud83c\udf49\uff01\u591a\u591a\u53cd\u9988\u54e6");
        GM_unregisterMenuCommand(btn1);
    }, "");
    let btn2=GM_registerMenuCommand ("\u4ed8\u8d39\u5185\u5bb9", function(){
        alert("\u9650\u65f6\u514d\u8d39\uff0c\u5168\u529b\u5f00\u53d1\u4e2d...");
    }, "p");

    var ddds3 = null;
    var addMessage = null;

    var chapterCount = 0;
    var chapterId = 0;
    var sectionCount = 0;
    var sectionId = 0;
    var tipsTag = null;

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
    function addLisenner(){

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

            },3689)
        };
        vdended = function(){
            console.log("xigua:结束播放");
            addMessage("xigua:结束播放");
            setTimeout(function(){
                tipsTag = document.getElementsByClassName('el-message-box is-draggable');
                if(tipsTag.length === 1){
                    tipsTag[0].getElementsByTagName('button')[1].click();
                }

                sectionId++;
                serchSectionStatus();
            },3689)
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

        elevideo.volume = 0.3;
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
        var ddds4 = $('<div style="position: absolute;top: 85%;width:94%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;"><button id="beginExam" style="position: absolute;width:139px;right: 216px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">手动验证</button><a href="http://8.130.116.135/?article/" style="position: absolute;right: 10px;text-decoration: none;color: pink;">\u003e\u003e\u003e\u8054\u7cfb\u003a\u0031\u0039\u0030\u0038\u0032\u0034\u0035\u0033\u0030\u0032\u0040\u0071\u0071\u002e\u0063\u006f\u006d</a></div>');

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
            if(window.location.href.split('?')[0].toString() === 'https://l.shou.org.cn/study/assignment-preview.aspx' || window.location.href.split('?')[0].toString() === 'https://l.shou.org.cn/study/assignment/preview.aspx'){
                if(document.querySelector("#navigateToAnswer") != null){
                    addMessage("请稍等...");
                    let t = Math.floor(Math.random() * 4);
                    setTimeout(function(){
                        addMessage("验证成功");
                        qrCodeDialog.find("#navigateToAnswer").parent().show();
                        setTimeout(function(){
                            document.querySelector("#navigateToAnswer").click();
                        },2000);
                    },t * 1000);
                }
                else if(window.location.href.split('?')[0].toString() === 'https://l.shou.org.cn/study/assignment/preview.aspx'){
                    addMessage("请稍等...");
                    let t = Math.floor(Math.random() * 4);
                    setTimeout(function(){
                        ddds3.children().remove();
                        addMessage("验证成功");
                        setItem('qrcode_validateResult_' + data.userNo, 1, new Date().getTime() + 7200000);// 两小时有效
                        setTimeout(function(){
                            data.qrCodeDialog.dialog("close");
                        },2000);
                    },t * 1000);
                }
                else{
                    addMessage("当前状态不可用");
                }
            }
            else{
                addMessage("此功能只用于识别二维码");
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

    var wait = null;
    var overlay;
    function startSetInt(){
        wait = setInterval(function (){
            // ddds3.children().remove();
            if(window.location.href.split('/')[9] === 'courseware'){
                try{
                    tipsWin().then((result) => {
                        if(!result){
                            panel();
                            ddds3.children().remove();
                            addMessage("启动-studying");
                            setTimeout(function(){
                                tipsTag = document.getElementsByClassName('el-message-box is-draggable');
                                if(tipsTag.length === 1){
                                    tipsTag[0].getElementsByTagName('button')[1].click();
                                }

                                sectionCount = document.getElementsByClassName('three-text-wrap').length;
                                setTimeout(function(){
                                    serchSectionStatus();
                                },1000);
                            },1000);
                        }else{
                            addMessage("取消");
                        }
                    });
                }catch(e){
                    addMessage(e);
                }
            }

            if(window.location.href.split('/')[9] === 'homework'){
                try{
                    tipsWin().then((result) => {
                        if(!result){
                            panel();
                            ddds3.children().remove();
                            addMessage("启动-homework");
                            setTimeout(function(){
                                queryHomeworkLastHistoryDetail();
                            },1000);
                        }else{
                            addMessage("取消");
                        }
                    });
                }catch(e){
                    addMessage(e);
                }
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

    var sectionNowTag = null;
    var ariaValueNow = 0;
    var sectionNowTitle = '';
    var sectionType = ''
    function serchSectionStatus(){
        if(sectionId >= sectionCount){
            addMessage(sectionId+'--'+sectionCount);
            addMessage('检索结束');
            return;
        }

        sectionNowTag = document.getElementsByClassName('three-text-wrap')[sectionId];
        ariaValueNow = parseInt(sectionNowTag.children[0].ariaValueNow);
        sectionNowTitle = sectionNowTag.children[2].innerText;
        sectionType = sectionNowTag.children[1].getElementsByTagName('use')[0].href.animVal;
        addMessage('继续1');
        if(ariaValueNow < 100){
            addMessage('继续2'+sectionType);
            addMessage(sectionNowTitle+"-未完成:"+ariaValueNow+"/100");

            if(sectionType === '#icon-video_backup_lock'){//未完成mp4
                sectionNowTag.click();'#icon-video_backup_lock'

                setTimeout(function(){
                    removeLisenner();
                    addLisenner();
                },1963);
                return;
            }

            if(sectionType === '#icon-document_lock'){//未完成ppt
                sectionNowTag.click();

                setTimeout(function(){
                    sectionId++;
                    serchSectionStatus();
                },2963);
                return;
            }

            if(sectionType === '#icon-work_lock'){//未完成作业需直接提交
                sectionNowTag.click();
                addMessage(sectionNowTitle+"作业-无作业记录:("+ariaValueNow+"/100)");
                setTimeout(function(){
                    document.getElementsByClassName('btn')[0].children[0].click();
                    setTimeout(function(){
                        questionCount = document.getElementsByClassName('topic-container').length;

                        setTimeout(function(){
                            queryHomeworkLastHistoryDetail();
                        },1500);
                    },3000);
                },1689);
                return;
            }
            return;
        }

        addMessage('继续3');
        //已完成mp4&&ppt&&课文朗读
        if(sectionType === '#icon-video_backup_lock' || sectionType === '#icon-document_lock' || sectionType === '#icon-link_backup_lock' || sectionType === '#icon-picture_lock'){
            addMessage(sectionNowTitle+"-完成:("+ariaValueNow+"/100)");
            sectionId++;
            serchSectionStatus();
            return;
        }

        if(sectionType === '#icon-work_lock'){//已完成作业需检索合格

            sectionNowTag.click();
            setTimeout(function(){
                if(document.getElementsByClassName('point-tag')[0] === undefined){
                    addMessage(sectionNowTitle+"作业-无作业记录:("+ariaValueNow+"/100)");
                    setTimeout(function(){
                        document.getElementsByClassName('btn')[0].children[0].click();
                        ddds3.children().remove();
                        addMessage("首次提交...");
                        setTimeout(function(){
                            homework();
                        },2500);
                    },2500);
                    return;
                }

                let examSort = parseInt(document.getElementsByClassName('point-tag')[0].children[0].innerText.split('：')[1]);
                if(examSort < 95){
                    addMessage(sectionNowTitle+"-未合格（存在提交记录）:("+examSort+"/100)");
                    document.getElementsByClassName('btn')[0].children[0].click();
                    ddds3.children().remove();
                    addMessage("正在连接题库...");
                    setTimeout(function(){
                        homework();
                    },3000);
                }
                else{
                    addMessage(sectionNowTitle+"-已合格:("+examSort+"/100)");
                    sectionId++;
                    serchSectionStatus();
                }
                return;
            },1689);
        }

    }

    function homework(){
        ddds3.children().remove();
        queryHomeworkLastHistoryDetail();
    }

    function sleep(ms){
        return new Promise(resolve => setTimeout(resolve,ms));
    }

    function getCookie(name){
        const cookieArr = document.cookie.split(";"); // 分割所有 cookies
        for (let i = 0; i < cookieArr.length; i++) {
            const cookiePair = cookieArr[i].trim(); // 去除前后的空格
            // 检查当前 cookie 是否为我们想要的 cookie
            if (cookiePair.startsWith(name + "=")) {
                return cookiePair.split("=")[1]; // 返回 cookie 的值
            }
        }
        return null; // 如果没有找到则返回 null
    }

    var answerlocal = [];
    function queryHomeworkLastHistoryDetail(){
        //获取答案（需已提交）
        $.ajax({
            type : 'post',
            url : 'https://yzd.o-learn.cn/courseware/homework/app/user/student/homework/queryHomeworkLastHistoryDetail?courseId='+window.location.href.split('/')[6]+'&homeworkId='+window.location.href.split('/')[11],
            contentType : "application/json; charset=utf-8",
            headers: {
                'Authorization': 'Bearer '+ getCookie('xxpt_access_token')
            },
            cookie : document.cookie,
            timeout: 8000,
            success : function(answerResult) {
                let answerJSON = JSON.parse(answerResult);
                if(window.location.href.split('/')[10] != 'do'){
                    document.getElementsByClassName("btn-wrap")[0].children[0].click();
                }
                if(answerJSON.message === "加载作业详情成功"){
                    addMessage("开始答题...");
                    let tepmsata = answerJSON.questionObj;
                    tepmsata.danxuanList.forEach(obj => {
                        answerlocal.push(obj);
                    });
                    tepmsata.duoxuanList.forEach(obj => {
                        answerlocal.push(obj);
                    });
                    tepmsata.panduanList.forEach(obj => {
                        answerlocal.push(obj);
                    });
                    tepmsata.wendaList.forEach(obj => {
                        answerlocal.push(obj);
                    });
                    questionCount = document.getElementsByClassName('topic-container').length;


                    setTimeout(function(){
                        beginExam();
                    },3000);
                }
                else{
                    addMessage('xigua:'+answerJSON.message);//没有提交记录
                    submitHomework();
                }
            },
            error: function(res) {
                console.log("请求失败：",res.responseText); // 其他错误提示
                addMessage("请求失败："+res.responseText);
            }
        });
    }

    var questionCount = 0;
    var questionIndex = 0;
    function beginExam(){
        if(questionIndex < questionCount){
            let qTitle = document.getElementsByClassName('topic-container')[questionIndex].getElementsByClassName('topic-title html-content')[0].innerText;
            getAnswer(qTitle);
        }
        else{
            addMessage("作答完毕");

            setTimeout(function(){
                document.getElementsByClassName('btn-wrap')[0].children[0].click();
                setTimeout(function(){
                    document.getElementsByClassName('menu-item')[1].click();
                    setTimeout(function(){
                        tipsTag = document.getElementsByClassName('el-message-box is-draggable');
                        if(tipsTag.length === 1){
                            tipsTag[0].getElementsByTagName('button')[1].click();
                        }

                        sectionCount = document.getElementsByClassName('three-text-wrap').length;
                        setTimeout(function(){
                            serchSectionStatus();
                        },1000);
                    },3333);
                },5000);
            },3000);
        }
    }

    function getAnswer(qTitle){
        console.log(answerlocal);
        let result = answerlocal.reduce((accumulator,obj) => {
            if(obj.title.replace(/\s+/g, '') === qTitle.replace(/\s+/g, '')){
                return obj.topicItemList;
            }
            return accumulator;
        },undefined);

        if(!result){
            alert('没有此试题数据！');
            return ;
        }

        optioncount = result.length;
        answerdata = result;
        answerBean(0);
    }

    var answerdata = null;
    var optioncount = 4;
    function answerBean(index){
        addMessage("answerBean开始,optioncount:"+optioncount+",index:"+index);
        if(index < optioncount){
            if(answerdata[index].isAnswer === 'true'){
                let htmlOpationCount = document.getElementsByClassName('topic-container')[questionIndex].getElementsByClassName('radio-wrap').length;
                isTrueAnswer(0,answerdata[index].content,htmlOpationCount,index,);
            }
            else{
                answerBean(++index,answerdata);
            }
        }
        else{
            addMessage((questionIndex+1)+"题local结束"+index);
            questionIndex++;
            beginExam();
        }
    }

    function isTrueAnswer(rdioIndex,trueanswer,rdioCount,index){
        if(rdioIndex < rdioCount){
            let rdiotext = document.getElementsByClassName('topic-container')[questionIndex].getElementsByClassName('radio-wrap')[rdioIndex].children[1].innerText;
            if(trueanswer === rdiotext){
                $('<div class="message"></div>').text((questionIndex+1)+"题选项:"+rdiotext+","+rdioIndex).css({
                    'margin-bottom': '10px',
                    'color':'red'
                }).appendTo(ddds3);

                localIndx = rdioIndex;
                radioOk(rdioIndex,index);
            }
            else{
                isTrueAnswer(++rdioIndex,trueanswer,rdioCount,index);
            }
        }
        else{
            addMessage(rdioIndex+"项radio结束");
            questionIndex++;
            beginExam();
        }
    }

    var localIndx = 0;

    function radioOk(rdioIndex,index){
        let cname = document.getElementsByClassName('topic-container')[questionIndex].getElementsByClassName('radio-wrap')[rdioIndex].children[0].className;
        if(cname != 'el-radio-button is-active' && cname != 'el-checkbox-button is-checked'){
            document.getElementsByClassName('topic-container')[questionIndex].getElementsByClassName('radio-wrap')[rdioIndex].children[0].click();
        }else{
            addMessage('已选中');
        }
        setTimeout(function(){
            answerBean(++index);
        },333);
    }

    var sbmitAnswerdata = {
        "danxuanUserAnswerList":[],//{"id":"e6ff9f1a9b9b48228e72de3224ea7384","uanswer":"B"}
        "duoxuanUserAnswerList":[],//{"id":"63f540d9ca264c709088e0c9fee655fc","uanswer":["A","C"]}
        "panduanUserAnswerList":[],//{"id":"ed265a55fe8649a0a152ba6e4d5e2638","uanswer":"F"}
        "wendaUserAnswerList":[]
    };
    function submitHomework(){
        $.ajax({
            type : 'post',
            url : 'https://yzd.o-learn.cn/courseware/homework/app/user/student/homework/submitHomework?courseId='+window.location.href.split('/')[6]+'&homeworkId='+window.location.href.split('/')[11],
            contentType : "application/json; charset=utf-8",
            headers: {
                'Authorization': 'Bearer '+ getCookie('xxpt_access_token')
            },
            data: sbmitAnswerdata,
            cookie : document.cookie,
            timeout: 8000,
            success : function(answerResult) {
                let answerJSON = JSON.parse(answerResult);
                console.log('submitHomework',answerResult);
                console.log('submitHomework',answerJSON);
                setTimeout(function(){
                    window.location.reload();
                },3000);
            },
            error: function(res) {
                console.log("请求失败：",res.responseText); // 其他错误提示
            }
        });
    }

    function saveHomeworkUserAnswer(){
        $.ajax({
            type : 'post',
            url : 'https://yzd.o-learn.cn/courseware/homework/app/user/student/homework/saveHomeworkUserAnswer?courseId='+window.location.href.split('/')[6]+'&homeworkId='+window.location.href.split('/')[11]+'&userAnswerJSONString='+JSON.stringify(sbmitAnswerdata),
            contentType : "multipart/form-data",
            headers: {
                'Authorization': 'Bearer '+ getCookie('xxpt_access_token')
            },
            cookie : document.cookie,
            timeout: 8000,
            success : function(answerResult) {
                let answerJSON = JSON.parse(answerResult);
                console.log('saveHomeworkUserAnswer',answerResult);
                console.log('saveHomeworkUserAnswer',answerJSON);
            },
            error: function(res) {
                console.log("请求失败：",res.responseText); // 其他错误提示
            }
        });
    }

})();