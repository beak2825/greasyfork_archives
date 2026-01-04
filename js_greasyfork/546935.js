// ==UserScript==
// @name         重庆公需科目学习自动刷课 (兼容AliPlayer+目录连播)
// @namespace    *://cqrl.21tb.com/
// @version      2.0
// @description  自动静音播放、自动下一节（兼容阿里云播放器 + 播放列表）
// @author       Td + ChatGPT
// @license MIT
// @match        https://cqrl.21tb.com/els/html/courseStudyItem/courseStudyItem.learn.do?courseId=*
// @match        https://cqrl.21tb.com/nms-frontend/index.html*
// @icon         https://cqrl.21tb.com/nms-frontend/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546935/%E9%87%8D%E5%BA%86%E5%85%AC%E9%9C%80%E7%A7%91%E7%9B%AE%E5%AD%A6%E4%B9%A0%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%20%28%E5%85%BC%E5%AE%B9AliPlayer%2B%E7%9B%AE%E5%BD%95%E8%BF%9E%E6%92%AD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546935/%E9%87%8D%E5%BA%86%E5%85%AC%E9%9C%80%E7%A7%91%E7%9B%AE%E5%AD%A6%E4%B9%A0%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%20%28%E5%85%BC%E5%AE%B9AliPlayer%2B%E7%9B%AE%E5%BD%95%E8%BF%9E%E6%92%AD%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("[脚本] 已加载，当前 URL:", location.href);

    // ================= 工具函数 =================
    function queryInAllDocuments(selector) {
        let results = document.querySelectorAll(selector);
        if (results.length > 0) return results;

        let iframes = document.querySelectorAll("iframe");
        for (let iframe of iframes) {
            try {
                let doc = iframe.contentDocument || iframe.contentWindow.document;
                let res = doc.querySelectorAll(selector);
                if (res.length > 0) return res;
            } catch (e) {}
        }
        return [];
    }

    function getCurrentLesson() {
        let list = queryInAllDocuments("div.first-line");
        for (let el of list) {
            if (el.className.includes("active")) {
                return el;
            }
        }
        return null;
    }

    function autoNextSection() {
        let current = getCurrentLesson();
        if (!current) return;

        let currentLi = current.closest("li.section-item");
        if (!currentLi) return;

        if (currentLi.querySelector(".finish-tig")) {
            let next = currentLi.nextElementSibling;
            while (next && !next.classList.contains("section-item")) {
                next = next.nextElementSibling;
            }

            if (next) {
                console.log("[脚本] 当前节已完成，点击下一节：", next.innerText.trim());
                let nextBtn = next.querySelector(".first-line");
                if (nextBtn) nextBtn.click();
            }
        }
    }

    // ================= 列表页自动点击未完成课程 =================
    function clickUnfinishedCourse() {
        let courses = document.querySelectorAll("div.text-item.cursor");
        if (!courses || courses.length === 0) {
            console.log("[脚本] 没找到课程列表。");
            return;
        }

        for (let course of courses) {
            let statusSpan = course.querySelector(".info-num span:nth-child(2)");
            if (statusSpan && statusSpan.textContent.includes("已完成")) continue;

            console.log("[脚本] 点击未完成课程:", course.innerText.trim());
            course.click();
            return;
        }

        console.log("[脚本] 没有未完成的课程。");
    }

    // ================= 学习页自动播放逻辑 =================
    function studyPageLogic() {
        console.log("[脚本] 等待课程 iframe...");

        const timer = setInterval(() => {
            const iframe = document.getElementById("aliPlayerFrame");
            if (!iframe) return;

            clearInterval(timer);
            console.log("[脚本] 找到课程 iframe，开始控制播放...");

            setInterval(() => {
                try {
                    const playerDoc = iframe.contentDocument || iframe.contentWindow.document;

                    // 自动点击播放按钮
                    let playBtn = playerDoc.querySelector(".prism-play-btn");
                    if (playBtn && !playBtn.classList.contains("playing")) playBtn.click();

                    // 强制静音 + 自动播放 + 倍速
                    let video = playerDoc.querySelector("video");
                    if (video) {
                        if (!video.muted) video.muted = true;
                        if (video.paused) video.play().catch(()=>{});
                        if (video.playbackRate !== 2) {
                            video.playbackRate = 2;
                            console.log("[脚本] 已设置为 2 倍速播放。");
                        }
                    }
                } catch (e) {
                    console.log("[脚本] 操作 iframe 出错:", e);
                }

                // 检查下一节
                autoNextSection();

                let rate = localStorage.getItem("studyRate");
                if (rate && (rate === "100" || rate === "100.0" || rate === "100.00")) {
                    console.log("[脚本] 本节完成，准备关闭或进入下一节...");
                    if (window.opener) {
                        window.opener.location.reload();
                    }
                    // 关闭当前窗口
                    window.close();
                    console.log("[脚本] 父窗口已刷新，当前窗口已关闭。");
                }
            }, 5000);
        }, 2000);
    }

    // ================= URL 判断 =================
    if (location.href.includes("/nms-frontend/index.html")) {
        console.log("[脚本] 当前为课程列表页，执行点击未完成课程...");
        setTimeout(clickUnfinishedCourse, 2000);
    } else if (location.href.includes("/courseStudyItem.learn.do")) {
        console.log("[脚本] 当前为课程学习页，执行自动播放逻辑...");
        studyPageLogic();
    }

})();
