// ==UserScript==
// @name         举名自动播放
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  打开视频播放页面后即可自动完成所有课程
// @author       JHB
// @match        *://*.jumingedu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489635/%E4%B8%BE%E5%90%8D%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/489635/%E4%B8%BE%E5%90%8D%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var t = 5000;
    let errorCount = 0;
    console.log("go");
    // window.addEventListener('load', function () {
    //     // 在这里编写你想要在页面所有资源加载完毕后执行的代码
    //     console.log('页面所有资源加载完毕！');
    //     function delayedFunction() {
    //         window.v = document.querySelector('video');
    //         // 添加监听事件，当播放器暂停时输出日志到控制台
    //         v.addEventListener('pause', function () {
    //             console.log((new Date()).getTime(), 'pause');
    //         });
    //         v.play();
    //         v.muted = true;
    //         console.log(v);
    //     }
    //     setTimeout(delayedFunction, 2000);
    // });
    var intervalId = setInterval(async function () {
        // console.log("go setInterval");
        try {
            window.ds = document.getElementsByClassName('directoryList')[0];
            window.v = document.querySelector('video');
            if (v.paused) {
                console.log('视频已暂停');
                Array.from(ds.children).some(element => {
                    var section = element.getElementsByClassName('section')[0];
                    if (element.getElementsByClassName('status')[0].textContent != '已学完') {
                        console.log('点击' + section.textContent);
                        element.click();
                        v.muted = true;
                        v.play();
                        return true;
                    }
                });
            } else {
                console.log('视频正在播放');
                // console.log('当前视频' + section.textContent);
            }

            if (window.ds) {
                // console.log("获取到课程列表");
                // console.log(classList);
            }
        } catch (err) {
            errorCount++;
            console.log(err);

            if (errorCount >= 3) {
                console.log('达到错误次数上限，退出循环');
                clearInterval(intervalId); // 清除定时器
            }
            // }
            // try {
            //     if ($('.signBtn').length && $('.signBtn').length > 0) {
            //         console.log("检测到签到对话框，尝试跳过");
            //         $(".signBtn").click();
            //     }
            // } catch (err) {
            //     console.log(err);
        }
    }, t);
})();
