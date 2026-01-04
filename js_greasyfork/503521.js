// ==UserScript==
// @name         教师培训
// @namespace    http://tampermonkey.net/yerdos
// @version      0.4
// @description  获取视频 ID 并发送数据包，发送完成后弹窗汇报结果
// @author       Yerdos0993
// @match        https://www.edueva.org/TMPlay/NavPlayback*
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/503521/%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/503521/%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前页面的 URL
    const currentUrl = window.location.href;
    console.log("当前 URL:", currentUrl);

    // 提取视频 ID
    const match = currentUrl.match(/\/(\d+)$/);
    if (!match) {
        console.log("未找到视频 ID");
        return;
    }
    const videoId = match[1];
    console.log("提取到的视频 ID:", videoId);

    // 获取当前时间
    const now = new Date();
    // 提前 3 小时
    const enterTime = new Date(now.getTime() - 3 * 60 * 60 * 1000);

    // 格式化时间字符串为 "YYYY-MM-DD HH:MM:SS"
    const year = enterTime.getFullYear();
    const month = String(enterTime.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以需要加1
    const day = String(enterTime.getDate()).padStart(2, '0');
    const hours = String(enterTime.getHours()).padStart(2, '0');
    const minutes = String(enterTime.getMinutes()).padStart(2, '0');
    const seconds = String(enterTime.getSeconds()).padStart(2, '0');

    const formattedEnterTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    console.log("格式化后的打开时间:", formattedEnterTime);

    // 构建请求参数
    const timestamp = Date.now(); // 当前时间的时间戳
    const url = `https://www.edueva.org/TMPlay/AddPlayback?_= ${timestamp}&recordId=${videoId}&enterTime=${encodeURIComponent(formattedEnterTime)}`;

    // 获取当前页面的 cookies
    const cookies = document.cookie;

    // 发送请求
    fetch(url, {
        method: 'GET',
        headers: {
            'Cookie': cookies,
            'Referer': currentUrl,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0',
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => response.text())
    .then(data => {
        console.log("数据包发送成功:", data);
        GM_notification({
            text: "数据包发送成功!",
            title: "成功",
            timeout: 5000 // 5秒后自动关闭
        });
    })
    .catch(error => {
        console.error("发送数据包时出错:", error);
        GM_notification({
            text: "发送数据包时出错: " + error.message,
            title: "错误",
            timeout: 5000 // 5秒后自动关闭
        });
    });
})();
