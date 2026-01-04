// ==UserScript==
// @name         b站分P视频时间计算器
// @namespace    http://tampermonkey.net/
// @version      2024-11-12
// @author       You
// @description  ...
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504155/b%E7%AB%99%E5%88%86P%E8%A7%86%E9%A2%91%E6%97%B6%E9%97%B4%E8%AE%A1%E7%AE%97%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/504155/b%E7%AB%99%E5%88%86P%E8%A7%86%E9%A2%91%E6%97%B6%E9%97%B4%E8%AE%A1%E7%AE%97%E5%99%A8.meta.js
// ==/UserScript==
// noinspection DuplicatedCode

(function () {
    'use strict';

    let currentBV = null; // Variable to store the current BV number
    let videoData = null; // Variable to store the fetched data

    async function fetchData() {
        try {
            const bv = window.location.pathname.match(/\/video\/(BV\w+)/)[1];

            // If the BV number hasn't changed, return the existing data
            if (bv === currentBV && videoData !== null) {
                return videoData;
            }

            currentBV = bv; // Update the current BV number
            const apiUrl = `https://api.bilibili.com/x/player/pagelist?bvid=${bv}`;
            const response = await fetch(apiUrl);
            const result = await response.json();
            videoData = result.data; // Store the fetched data
            console.log('bv', bv);
            return videoData;
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    }

    // 更新按钮的显示内容并处理视频数据
    async function updateButtonAndHandleData(btn) {
        const data = await fetchData();

        if (data.length <= 1) {
            btn.innerText = "不是分P";
            setTimeout(() => btn.hidden = true, 1200);
        } else {
            btn.hidden = false;
            await calculateTime(btn, data); // 计算时间
        }
    }

    // 计算视频时间
    async function calculateTime(btn, data) {
        let totalSeconds = 0;
        const urlParams = new URLSearchParams(window.location.search);
        let p = urlParams.get('p') ? parseInt(urlParams.get('p'), 10) : 1;
        console.log("p为", p, "总集数为", data.length);
        for (let i = p - 1; i < data.length; i++) {
            totalSeconds += data[i].duration;
        }
        let hours = Math.floor(totalSeconds / 3600);
        let minutes = Math.floor((totalSeconds % 3600) / 60);
        let seconds = totalSeconds % 60;
        let formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        if (hours < 2) {
            btn.innerText = `${formattedTime}\n还有不到2小时,稳啦`;
        } else {
            btn.innerText = formattedTime;
        }
    }

    window.addEventListener("load", async () => {
        const btn = document.createElement('button');
        btn.innerText = '计算时间';
        btn.style.cssText = 'position: fixed; right: 10px; top: 300px; width: 70px; padding: 5px;';
        document.body.appendChild(btn);
        btn.onclick = () => calculateTime(btn, videoData);

        // 页面加载时处理视频数据并更新按钮
        await updateButtonAndHandleData(btn);

        // 监听 popstate 事件，处理 URL 变化
        window.addEventListener('popstate', async () => {
            await updateButtonAndHandleData(btn);
        });

        // 重写 pushState，手动触发 popstate 事件
        const originalPushState = history.pushState;
        history.pushState = async (...args) => {
            originalPushState.apply(history, args);
            window.dispatchEvent(new PopStateEvent('popstate')); // 手动触发 popstate 事件
        };
    });
})();
