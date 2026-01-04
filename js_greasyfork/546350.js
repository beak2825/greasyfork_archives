// ==UserScript==
// @name         山东教师教育网(当前视频快速学习api版)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @author       桥风
// @license       MIT
// @description  只抓取当前页面视频并模拟学习进度
// @match        *://player.qlteacher.com/learning/*/*
// @match        *://player.qlteacher.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/546350/%E5%B1%B1%E4%B8%9C%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%E7%BD%91%28%E5%BD%93%E5%89%8D%E8%A7%86%E9%A2%91%E5%BF%AB%E9%80%9F%E5%AD%A6%E4%B9%A0api%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546350/%E5%B1%B1%E4%B8%9C%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%E7%BD%91%28%E5%BD%93%E5%89%8D%E8%A7%86%E9%A2%91%E5%BF%AB%E9%80%9F%E5%AD%A6%E4%B9%A0api%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const baseUrl = "https://player.qlteacher.com/api/learning";

    // 获取 courseId 和 videoId（从 URL 提取）
    function getIdsFromUrl() {
        const match = location.pathname.match(/learning\/([^/]+)\/([^/]+)/);
        if (!match) return {};
        return { courseId: match[1], videoId: match[2] };
    }

    // 获取 token
    function getAccessToken() {
        try {
            const tokenObj = JSON.parse(localStorage.getItem("qlt_token"));
            return tokenObj?.access_token || "";
        } catch (e) {
            console.error("获取 access_token 失败:", e);
            return "";
        }
    }

    // 封装请求
    function apiRequest(url, method = "GET", data = null) {
        const accessToken = getAccessToken();
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                url,
                method,
                headers: {
                    "content-type": "application/json",
                    "Authorization": "Bearer " + accessToken
                },
                withCredentials: true,
                data: data ? JSON.stringify(data) : null,
                onload: res => {
                    try {
                        resolve(JSON.parse(res.responseText));
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: err => reject(err)
            });
        });
    }

    // 获取视频详情
    async function getActivityInfo(courseId, videoId) {
        const url = `${baseUrl}/${courseId}/activity/${videoId}`;
        const res = await apiRequest(url);
        return {
            actToken: res.data.actToken,
            duration: res.data.duration,//已学时长
            length: res.data.activity.length,// 视频总时长
            standard: res.data.activity.standard // 学习标准时长

        };
    }


    // 模拟逐步播放
    async function simulateProgress(courseId, videoId, actToken,duration, length, standard) {
        //let progress = 0;
        // 每次增加多少秒（建议 15 秒或 20 秒）
        const step = 30;
        const remainingDuration = standard - duration; // 剩余时长= 标准时长 - 已学时长
        let progress = duration; // 从已学时长开始
        console.log(`▶ 开始模拟视频 ${videoId}, 总时长=${length}s, 标准时长=${standard}，剩余时长=${remainingDuration}s`);

        const timer = setInterval(async () => {
            progress += step;
            if (progress >= standard) {
                progress = -1;  // 播放到结尾就停止，-1代表结尾
            }

            const url = `${baseUrl}/${courseId}/duration/video/${videoId}/${actToken}/${progress}`;
            try {
                const res = await apiRequest(url, "PUT", {});
                console.log(`上报 ${progress} 秒:`, res);

                // 播放到结尾就停止
                if (progress === -1) {
                    clearInterval(timer);
                    console.log(`✅ 当前视频 ${videoId} 模拟完成`);
                    alert("🎉 当前视频学习完成");
                }
            } catch (e) {
                console.error(`上报 ${progress} 秒失败:`, e);
                clearInterval(timer);
            }
        },1000);    // 每秒上报一次
    }


    // 主程序
    async function main() {
        try {
            const { courseId, videoId } = getIdsFromUrl();
            if (!courseId || !videoId) {
                alert("未能识别 courseId / videoId，请确认在视频播放页面运行");
                return;
            }

            console.log("🚀 开始学习，courseId:", courseId, " videoId:", videoId);

            const { actToken, duration,length, standard} = await getActivityInfo(courseId, videoId);
            await simulateProgress(courseId, videoId, actToken, duration,length, standard);

        } catch (e) {
            console.error("运行出错:", e);
            alert("运行出错: " + e.message);
        }
    }


    // 页面按钮
    function createButton() {
        const btn = document.createElement("div");
        btn.innerText = "🚀 当前视频学习";
        btn.style.cssText = `
            position: fixed;
            left: 20px;
            top: 200px;
            padding: 10px 18px;
            background: #dc3545;
            color: white;
            font-weight: bold;
            border-radius: 8px;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            z-index: 999999;
        `;
        btn.onclick = main;
        document.body.appendChild(btn);
    }

    window.addEventListener("load", () => {
        setTimeout(createButton, 1500);
    });

})();
