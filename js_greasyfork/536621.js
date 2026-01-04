// ==UserScript==
// @name         高考培训
// @namespace    http://tampermonkey.net/
// @version      2025-05-20
// @description  高考培训刷视频
// @author       You
// @match        https://kwstudy.neea.edu.cn/Staff/ShowVideo/?staffCourseProgressSID=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neea.edu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536621/%E9%AB%98%E8%80%83%E5%9F%B9%E8%AE%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/536621/%E9%AB%98%E8%80%83%E5%9F%B9%E8%AE%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let log = console.log;
    let original_updateProgress = updateProgress;
    updateProgress = function(...args){
        log("updateProgress==>", ...args);
        log("playerVideo=====>", playerVideo, playerVideo.duration);
        original_updateProgress(...args);
    }
    // 显示弹出信息
    function showPopupMessage(message, duration) {
        var popup = document.createElement('div');
        popup.innerText = message;
        popup.style.display = 'block';
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = '#f9f9f9';
        popup.style.padding = '20px'; // 增加内边距，防止字体超出边界
        popup.style.border = '1px solid #ccc';
        popup.style.color = 'red';
        popup.style.fontSize = '50px'; // 设置字体大小为50像素
        popup.style.maxWidth = '80%'; // 设置最大宽度，防止过长的文本导致元素过宽
        popup.style.textAlign = 'center'; // 文本居中显示
        popup.style.lineHeight = '1.2'; // 设置行高为1.2
        document.body.appendChild(popup);

        // 删除弹出信息
        setTimeout(function() {
            popup.parentNode.removeChild(popup);
        }, duration);
    }

    function main(){
        // 此处放需要等网页完全加载后运行的代码
        console.log('页面及所有资源加载完成');
        let fail_msg = "刷课失败，请按键盘【G】键重试！";
        try{
            let t = 3;
            let progress = Math.floor(playerVideo.duration);
            if(progress > 0) {
                playerVideo.play();
                updateProgress(progress);
                //showPopupMessage(`刷课成功，请【刷新】页面后，点击播放看完最后【${t}】秒！`, 86400 * 1000);
                showPopupMessage(`刷课成功，可以关闭当前页面，学习下一个视频！`, 86400 * 1000);
            } else {
                showPopupMessage(fail_msg, 86400 * 1000);
            }

            //playerVideo.play();
        } catch(e) {
            log(fail_msg, e);
            showPopupMessage(fail_msg, 86400 * 1000);
        }
    }

    document.addEventListener("keydown", function(event) {
        console.log("keydown", event.code);
        if (event.code === "KeyG") {
            main();
        }
    });

    if (document.readyState === "complete") {
        // DOM 已经加载完成
        main();
    } else {
        // DOM 还未加载完成
        window.addEventListener("load", main, { once: true });
    }

})();