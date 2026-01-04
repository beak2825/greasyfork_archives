// ==UserScript==
// @name         [N合1 优化版] NoHopeL - Nodeloc 最快刷 阅读话题数/阅读时长/阅读帖子数 工具 （青铜 -> 黄金 -> 钻石 一路无忧！）
// @namespace    nohope-nl
// @version      2025-06-07
// @description  在任何时候用肉眼可见的速度增加 阅读话题数/阅读时长/阅读帖子数
// @author       Str
// @match        https://nodeloc.cc/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538720/%5BN%E5%90%881%20%E4%BC%98%E5%8C%96%E7%89%88%5D%20NoHopeL%20-%20Nodeloc%20%E6%9C%80%E5%BF%AB%E5%88%B7%20%E9%98%85%E8%AF%BB%E8%AF%9D%E9%A2%98%E6%95%B0%E9%98%85%E8%AF%BB%E6%97%B6%E9%95%BF%E9%98%85%E8%AF%BB%E5%B8%96%E5%AD%90%E6%95%B0%20%E5%B7%A5%E5%85%B7%20%EF%BC%88%E9%9D%92%E9%93%9C%20-%3E%20%E9%BB%84%E9%87%91%20-%3E%20%E9%92%BB%E7%9F%B3%20%E4%B8%80%E8%B7%AF%E6%97%A0%E5%BF%A7%EF%BC%81%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/538720/%5BN%E5%90%881%20%E4%BC%98%E5%8C%96%E7%89%88%5D%20NoHopeL%20-%20Nodeloc%20%E6%9C%80%E5%BF%AB%E5%88%B7%20%E9%98%85%E8%AF%BB%E8%AF%9D%E9%A2%98%E6%95%B0%E9%98%85%E8%AF%BB%E6%97%B6%E9%95%BF%E9%98%85%E8%AF%BB%E5%B8%96%E5%AD%90%E6%95%B0%20%E5%B7%A5%E5%85%B7%20%EF%BC%88%E9%9D%92%E9%93%9C%20-%3E%20%E9%BB%84%E9%87%91%20-%3E%20%E9%92%BB%E7%9F%B3%20%E4%B8%80%E8%B7%AF%E6%97%A0%E5%BF%A7%EF%BC%81%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function sleep(ms) {
        return new Promise((_) => setTimeout(_, ms))
    }
    async function getCSRF() {
        let req = await fetch('/session/csrf', { headers: {"x-requested-with": "XMLHttpRequest"} });
        let data = await req.json();
        return data.csrf;
    }
    function generateFakePosts() {
        let start = Math.floor(Math.random() * 300) + 1;
        let length = 6

        return Array.from({ length }, (_, i) => start + i);
    }
    function makeFakeTimings(pids, time) {
        return pids.map((id, index) => `timings%5B${id}%5D=${ index == pids.length - 1 ? 1000 : time}`).join('&');
    }
    let csrf = null;
    setInterval(async () => {
        csrf = await getCSRF();
    }, 60000);
    async function haha() {
        let startTime = Date.now();
        try {
            if (!csrf) csrf = await getCSRF();
            if (!csrf) throw new Error(`服务器未返回 CSRF Token`);

            // 阅读话题数，就是访问到 404 的会控制台 spam，但是不知道怎么解决
            await ( async () => {
                let tid = getRandomNumber(10000, 45000);

                let req = await fetch(`/t/${tid}/1.json?track_visit=true&forceLoad=true`, {
                    "headers": {
                        "accept": "application/json, text/javascript, */*; q=0.01",
                        "discourse-logged-in": "true",
                        "discourse-present": "true",
                        "discourse-track-view": "true",
                        "discourse-track-view-topic-id": tid,
                        "x-csrf-token": csrf,
                        "x-requested-with": "XMLHttpRequest"
                    }
                });
                req.body.cancel();

                if (req.status == '429') {
                    alert(`警告：已触发频率限制，你是否在多个标签页同时运行脚本？将暂停当前页面脚本执行 10 s：\n${await req.text()}`);
                    await sleep(10000);
                }
                if (req.status != '200' && req.status != '404') throw new Error(`服务器未返回正确状态码`);
            })();

            // 阅读帖子数 + 阅读时长
            await (async () => {
                let allTime = getRandomNumber(51000, 61000),
                    tid = getRandomNumber(10000, 45000),
                    posts = generateFakePosts(),
                    tid_time = allTime,
                    timings = makeFakeTimings(posts, allTime);

                let req = await fetch("/topics/timings", {
                    "headers": {
                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "x-requested-with": "XMLHttpRequest",
                        "x-csrf-token": csrf,
                        "x-silence-logger": "true", // 不要记录该请求的日志拿去分析 :(
                    },
                    "body": `${timings}&topic_time=${tid_time}&topic_id=${tid}`,
                    "method": "POST",
                });
                if (req.status == '429') {
                    alert(`警告：已触发频率限制，你是否在多个标签页同时运行脚本？将暂停当前页面脚本执行 10 s：\n${await req.text()}`);
                    await sleep(10000);
                }
                if (req.status != '200') throw new Error(`服务器未返回正确状态码`);
            })();
        } catch (error) {
            console.error(`执行出错`, error);
        }
        console.groupEnd();
        let endTime = Date.now();
        let processTime = endTime - startTime;

        let sleepMs = (1000 - processTime) >= 0 ? (1000 - processTime) : 0;
        setTimeout(() => haha(), sleepMs);
    }
    haha();
})();