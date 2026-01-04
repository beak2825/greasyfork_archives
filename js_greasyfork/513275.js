// ==UserScript==
// @name         石家庄铁道大学继续教育平台自动刷课助手
// @namespace    http://jxjy.stdu.edu.cn/student/
// @version      1.1
// @description  实现的自动刷课功能，自动播放视频、自动跳转章节、记录学习时长
// @author       HRz
// @match        http://jxjy.stdu.edu.cn/student/*
// @match        http://220.194.70.38/student/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513275/%E7%9F%B3%E5%AE%B6%E5%BA%84%E9%93%81%E9%81%93%E5%A4%A7%E5%AD%A6%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/513275/%E7%9F%B3%E5%AE%B6%E5%BA%84%E9%93%81%E9%81%93%E5%A4%A7%E5%AD%A6%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let shua_type = /BootStrap_Video/.test(window.location.href) ? "video" : "ppt";

    // 学习时长记录函数
    function recordStudyTime() {
        let jilu_btn = document.querySelector("#btn_jldqsj0"); // 记录学习时长的按钮
        if (jilu_btn) {
            jilu_btn.click(); // 强制点击记录学习时长
            console.log("学习时长已记录");
        }
    }

    // 视频处理函数：确保看完后跳转，并记录学习时长
    function shua_video() {
        let video = document.querySelector('video');
        if (video) {
            // 自动播放视频
            video.play();

            // 每3分钟强制记录一次学习时长
            let intervalId = setInterval(recordStudyTime, 3 * 60 * 1000); // 3分钟

            // 监听视频结束事件
            video.addEventListener('ended', function() {
                console.log("视频播放结束，等待30秒记录学习时长");

                clearInterval(intervalId); // 清除定时器

                // 在等待30秒内再次记录学习时长
                let delayInterval = setInterval(recordStudyTime, 10 * 1000); // 每10秒记录一次，确保记录

                // 30秒后跳转到下一节
                setTimeout(function() {
                    clearInterval(delayInterval); // 清除30秒内的记录定时器
                    console.log("30秒等待结束，跳转到下一节");
                    document.querySelector('#nextChapter').click(); // 跳转到下一章节
                }, 30 * 1000); // 30秒
            });

            // 如果视频暂停，自动恢复播放
            video.addEventListener('pause', function() {
                if (GM_getValue('do')) {
                    video.play();
                    console.log("视频已暂停，自动恢复播放");
                }
            });
        }
    }

    // PPT处理函数：确保停留足够时间并记录学习时长
    function shua_ppt() {
        const minPageTime = 2 * 60 * 1000; // 每页最少停留2分钟
        let total_time = parseInt(document.querySelector("#Lbl_spsc").innerText);
        let had_time = $("#lbl_zsc")[0] ? parseInt($("#lbl_zsc")[0].innerText) : 0;
        let need_time = (total_time - had_time) * 60 + 10;

        let jilu_btn = document.querySelector("#btn_jldqsj0");
        if (jilu_btn) {
            // 开始记录学习时间
            jilu_btn.click();
            console.log("开始记录PPT学习时长");

            setTimeout(function() {
                jilu_btn.click(); // 结束记录
                document.querySelector("#nextChapter").click(); // 跳转到下一节
                console.log("PPT刷完，跳转到下一节");
            }, Math.max(need_time * 1000, minPageTime)); // 确保停留足够时间
        } else {
            document.querySelector("#nextChapter").click(); // 无需刷PPT，直接跳转
            console.log("无需刷PPT，跳转到下一节");
        }
    }

    // 自动刷课控制
    function startShuaKe() {
        if (shua_type === "video") {
            shua_video();
        } else {
            shua_ppt();
        }
    }

    // 检测是否有视频/PPT加载
    let checkInterval = setInterval(function() {
        if (document.querySelector('video') || document.querySelector("#btn_jldqsj0")) {
            clearInterval(checkInterval); // 停止检查
            startShuaKe(); // 自动开始刷课
            console.log("自动开始刷课");
        }
    }, 1000); // 每秒检查一次

    // 自动刷课按钮面板
    let panelHTML = `
    <div style="position: fixed; top: 100px; left: 20px; background: rgba(0, 0, 0, 0.8); color: white; padding: 10px; border-radius: 5px; z-index: 1000;">
        <a href="#" id="toggle_shuake" style="color: white;">开始刷课</a>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', panelHTML);

    // 切换刷课状态按钮
    let isBrushing = GM_getValue('do', false); // 默认不刷课
    document.getElementById('toggle_shuake').addEventListener('click', function() {
        isBrushing = !isBrushing;
        GM_setValue('do', isBrushing);
        this.innerText = isBrushing ? "取消刷课" : "开始刷课";
        console.log(isBrushing ? "刷课已启动" : "刷课已停止");
        if (isBrushing) {
            startShuaKe(); // 如果点击开始刷课，立即启动刷课逻辑
        }
    });
})();
