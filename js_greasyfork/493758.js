// ==UserScript==
// @name         自动课程学习与完成监控
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动点击课程学习链接，并监控课程完成状态，包括异常处理和用户配置选项
// @author       Fly Fly
// @match        https://jypx.gxrcpx.com/*
// @grant        window.close
// @grant        unsafeWindow
// @grant        GM_openInTab
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493758/%E8%87%AA%E5%8A%A8%E8%AF%BE%E7%A8%8B%E5%AD%A6%E4%B9%A0%E4%B8%8E%E5%AE%8C%E6%88%90%E7%9B%91%E6%8E%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/493758/%E8%87%AA%E5%8A%A8%E8%AF%BE%E7%A8%8B%E5%AD%A6%E4%B9%A0%E4%B8%8E%E5%AE%8C%E6%88%90%E7%9B%91%E6%8E%A7.meta.js
// ==/UserScript==

(function (win) {
    'use strict';


    // 用户可配置部分
    const TIMEOUT_RESET = 3600000; // 1小时后重置，单位毫秒
    const COMPLETION_THRESHOLD = 100; // 完成阈值
    const BASE_DELAY_BETWEEN_ACTIONS = 5000; // 基本延迟时间（毫秒）
    const RANDOM_DELAY_ADDITION = 5000; // 随机附加延迟时间（毫秒）


    function myStartLesson(lessonId, coursewareId, lessonkey, tclessonId) {
        console.log("开始学习课程", lessonId, coursewareId, lessonkey, tclessonId);
        var winName = 'classroomWin';
        var url = "https://jypx.gxrcpx.com:443/app/lms/student/Learn/enter.do?lessonId=" + lessonId + "&coursewareId=" + coursewareId + "&lessonGkey=" + lessonkey + "&tclessonId=" + tclessonId + "&lessonOrigin=trainclass";
        win.classroomWindow = myOpenFullWindowCenter(url, winName, 'true', '您正在学习，请在学习结束后，点击[确认]按钮，刷新本页面');
        // console.log('classroomWin 窗口已打开', win.classroomWindow);
    }
    // console.log(window.startLesson)
    // window.startLesson = startLesson;
    // console.log(window.startLesson)


    /* 打开一个可设置滚动条的全屏窗口 可以回调刷新窗口*/
    function myOpenFullWindowCenter(url, winName, scrollbars, title) {
        console.log('打开视频窗口', url, winName, scrollbars, title);
        // if (typeof (classroomWin) != 'undefined') {
        //     classroomWin.close();
        // }
        // var width = window.screen.availWidth;
        // var height = window.screen.availHeight;
        // var xposition = 0;
        // var yposition = 0;
        // xposition = (window.screen.availWidth - width) / 2;
        // yposition = (window.screen.availHeight - height) / 2;
        // var theproperty = "";
        // if (yposition > 30) yposition = 30;
        // theproperty = "width=" + width + ","
        //     + "height=" + height + ","
        //     + "location=no,"
        //     + "menubar=0,"
        //     + "resizable=no,"
        //     + "status=0,"
        //     + "titlebar=0,"
        //     + "toolbar=no,"
        //     + "hotkeys=0,Direction=no,Resizeable=no"
        //     + "screenx=" + xposition + ","
        //     + "screeny=" + yposition + ","
        //     + "left=" + xposition + ","
        //     + "top=" + yposition;
        // if (scrollbars == 'false')
        //     theproperty += ",scrollbars=no";
        // else
        //     theproperty += ",scrollbars=yes";
        // classroomWin = window.open(url, winName, theproperty);
        var op = GM_openInTab(url, { active: true, insert: true, setParent: false });
        console.log('打开视频窗口完成', op);
        win.closeSon = op.close;
        console.log('closeSon', op.close);
        // if (typeof (title) != 'undefined') {
        //     $.confirm({
        //         'title': '请确认',
        //         'message': title,
        //         'buttons': {
        //             '确定': {
        //                 'class': 'blue',
        //                 'action': function () {
        //                     //...refresh...hide
        //                     //$.confirm.refresh();
        //                     window.location.reload();
        //                     //window.location.href=window.location.href;
        //                 }
        //             }
        //             //'取消'	: {
        //             //	'class'	: 'gray',
        //             //	'action': function(){
        //             //		$.confirm.hide();
        //             //	}
        //             //}
        //         }
        //     });
        // }
    }


    win.startLesson = myStartLesson;
    win._openFullWindowCenter = myOpenFullWindowCenter;
    console.log(win.startLesson);
    console.log(win._openFullWindowCenter);

    function closeClassroomWindow() {
        console.log('关闭 classroomWin 窗口', win.closeSon);
        // win.closeSon();
        return;
        console.log('关闭 classroomWin 窗口', win.classroomWindow);
        if (win.classroomWindow) {
            win.classroomWindow.close(); // 关闭窗口
            win.classroomWindow = null; // 清空引用
            console.log('classroomWin 窗口已关闭');
        } else {
            console.log('没有找到 classroomWin 窗口的引用');
        }
    }

    function randomDelay() {
        return BASE_DELAY_BETWEEN_ACTIONS + Math.random() * RANDOM_DELAY_ADDITION;
    }

    function isLessonPage() {
        return !!document.getElementById('video-container');
    }

    function markVideoPlaying() {
        const timestamp = Date.now();
        localStorage.setItem('videoPlaying', timestamp);
    }

    function checkAndResetVideoPlaying() {
        const timestamp = parseInt(localStorage.getItem('videoPlaying'), 10);
        if (Date.now() - timestamp > TIMEOUT_RESET) {
            localStorage.removeItem('videoPlaying');
            localStorage.removeItem('videoCompleted');
            window.location.reload();
            return false;
        }
        return true;
    }

    function closePageAndNotify() {
        var player = jwplayer();
        if (player) {
            player.on('ready', function () {
                try {
                    player.setMute(true); // 设置视频静音
                    player.seek(0); // 拉到视频开头
                    player.play(); // 开始播放视频
                    // 开启倍速
                    try {
                        player.setPlaybackRate(2);
                    }
                    catch (error) {
                        console.error('设置倍速时发生错误：', error);
                    }
                    console.log('注册视频完成监听。');
                    player.on('complete', () => {
                        console.log('视频播放完成, 设置视频完成标志并关闭页面。');
                        localStorage.setItem('videoCompleted', 'true');
                        // ... 浏览器限制js中无法关闭窗口 索性不关闭了
                        // win.close();
                    });
                    markVideoPlaying();
                } catch (error) {
                    console.error('处理视频时发生错误：', error);
                }
            });
        } else {
            console.log("player 未找到")
        }
    }



    function waitForVideoCompletion() {
        // var confirmButton = document.querySelector('#confirmButtons .button.blue');
        if (localStorage.getItem('videoCompleted') === 'true') {
            console.log('视频完成，点击确认按钮，刷新页面');
            localStorage.removeItem('videoCompleted');
            localStorage.removeItem('videoPlaying');
            closeClassroomWindow();
            // confirmButton.click();
            window.location.reload();
        } else if (checkAndResetVideoPlaying()) {
            console.log('等待视频完成');
            setTimeout(waitForVideoCompletion, randomDelay());
        }
    }

    function checkIfNoConfirmButton() {
        var confirmButton = document.querySelector('#confirmButtons .button.blue');
        if (!confirmButton) {
            console.log('确认按钮不存在，清理localStorage并刷新页面');
            localStorage.removeItem('videoCompleted');
            localStorage.removeItem('videoPlaying');
            window.location.reload();
        }
    }



    function clickStartLearning() {
        const items = Array.from(document.querySelectorAll('.lesson .cont .item')).filter(item => {
            let percentText = item.querySelector('.percent');
            if (percentText) {
                let percent = parseFloat(percentText.innerText.replace('已学习', '').replace('%', ''));
                return percent < COMPLETION_THRESHOLD;
            }
            return false;
        });

        function processItem(index) {
            if (index >= items.length) return;
            let item = items[index];
            let link = item.querySelector('.link');
            if (link) {
                try {
                    link.click();
                    console.log('Clicked on link for item: ', item);
                    waitForVideoCompletion();
                } catch (error) {
                    console.error('点击课程链接时发生错误：', error);
                }
            }
        }

        if (items.length > 0) {
            processItem(0); // 开始处理第一个课程
        }
    }

    function init() {
        if (isLessonPage()) {
            console.log("播放页面")
            closePageAndNotify();
        } else if (localStorage.getItem('videoPlaying')) {
            console.log("等待播放完成")
            checkIfNoConfirmButton();
            waitForVideoCompletion();
        } else {
            console.log("开始学习")
            clickStartLearning();
        }
    }
    window.addEventListener('load', init);
})(unsafeWindow);
