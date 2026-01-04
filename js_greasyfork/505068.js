// ==UserScript==
// @name         检查并储存可访问帖子
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  我没用过 我不知道 不关我的事 不要抓我！！
// @author       CHATGPT
// @match        https://linux.do/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/505068/%E6%A3%80%E6%9F%A5%E5%B9%B6%E5%82%A8%E5%AD%98%E5%8F%AF%E8%AE%BF%E9%97%AE%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/505068/%E6%A3%80%E6%9F%A5%E5%B9%B6%E5%82%A8%E5%AD%98%E5%8F%AF%E8%AE%BF%E9%97%AE%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==

(function () {
    let postId = parseInt(localStorage.getItem('lastPostId'), 10) + 1 || 1;
    let storedCount = parseInt(localStorage.getItem('storedCount'), 10) || 0; // 当前已存储的帖子数
    let keyIndex = Math.floor(storedCount / 10000); // 计算当前键索引

    async function fetchData(postId) {
        try {
            const res = await fetch(`https://linux.do/t/${postId}.json`);
            const data = await res.json();
            if (!data || data.category_id === null || typeof data.visible === 'undefined' || typeof data.title === 'undefined') {
                console.log("数据不存在或者不完整", data);
                return null;
            }
            return data;
        } catch (error) {
            console.error("错误：", error);
            return null;
        }
    }

    async function processPost(postId) {
        const data = await fetchData(postId);
        if (data) {
            const key = `postData_${keyIndex}`; // 使用当前键索引
            const existingData = JSON.parse(localStorage.getItem(key) || "[]");

            const filteredData = {
                id: data.id,
                title: data.title,
                category: data.category_id,
                visible: data.visible,
            };

            existingData.push(filteredData);
            localStorage.setItem(key, JSON.stringify(existingData));
            localStorage.setItem('lastPostId', postId.toString()); // 更新存储的帖子计数
            storedCount++;
            localStorage.setItem('storedCount', storedCount.toString()); // 更新存储的帖子计数

            if (storedCount % 10000 === 0) {
                keyIndex++; // 每存储10000个帖子，键索引加1
            }
            console.log("储存成功", key);
            jumpToNextPage(postId);
        } else {
            console.log("储存失败");
        }
        if (postId < 185170) {
            await new Promise(resolve => setTimeout(resolve, 1500)); // 每个请求间隔500毫秒
            processPost(postId + 1);
        }
    }
    function jumpToNextPage(postId) {
        let nextUrl = `https://linux.do/t/topic/${postId}`;
        setTimeout(function() { // 设置延时以模拟阅读停留
            window.location.href = nextUrl;
        }, 1000); // 1秒后跳转到下一个页面
    }
    // 滚动到页面底部的函数
    function scrollToBottom() {
        let lastPosition = -1;
        let scrollInterval = setInterval(function() {
            // 检查页面是否已经到达底部或者滚动位置是否停止更新（即页面已滚动到底部，但内容未必加载完全）
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight || lastPosition === window.scrollY) {
                clearInterval(scrollInterval);
            } else {
                lastPosition = window.scrollY;
                window.scrollBy(0, 20); // 每次向下滚动30像素
            }
        }, 150); // 每150毫秒滚动一次
    }
    scrollToBottom();
    processPost(postId);

})();
