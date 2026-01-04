// ==UserScript==
// @name         Bilibili API视频下载
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  获取B站视频的API信息并在新标签中打开视频下载页面
// @author       Zane
// @match        https://www.bilibili.com/video/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/516948/Bilibili%20API%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/516948/Bilibili%20API%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // API 配置
    const appId = "fywoibspohiqmuls";
    const appSecret = "vD22NbwPq3IeIkfDVKzxGtHYndqUeMwj";
    const apiUrl = "https://www.mxnzp.com/api/bilibili/video";

    // 获取当前视频URL并转换为Base64
    const bilibiliUrl = window.location.href;
    const base64Url = btoa(bilibiliUrl);

    // 创建按钮并设置样式为左下角
    const redirectButton = document.createElement("button");
    redirectButton.innerText = "下载视频";
    redirectButton.style.position = "fixed";
    redirectButton.style.bottom = "20px";
    redirectButton.style.left = "20px";
    redirectButton.style.zIndex = "1000";
    redirectButton.style.padding = "12px 20px";
    redirectButton.style.backgroundColor = "#007aff";
    redirectButton.style.color = "#ffffff";
    redirectButton.style.border = "none";
    redirectButton.style.borderRadius = "12px";
    redirectButton.style.fontSize = "14px";
    redirectButton.style.fontWeight = "500";
    redirectButton.style.boxShadow = "0px 4px 12px rgba(0, 0, 0, 0.1)";
    redirectButton.style.cursor = "pointer";
    redirectButton.style.transition = "opacity 0.3s";
    redirectButton.style.opacity = "0"; // 初始状态为隐藏
    document.body.appendChild(redirectButton);

    // 监听鼠标移动，靠近左下角时显示按钮
    document.addEventListener("mousemove", function(event) {
        const distanceX = event.clientX;
        const distanceY = window.innerHeight - event.clientY;

        // 若鼠标靠近页面左下角 100x100 像素区域，显示按钮
        if (distanceX < 100 && distanceY < 100) {
            redirectButton.style.opacity = "1";
        } else {
            redirectButton.style.opacity = "0";
        }
    });

    // 点击按钮时执行的操作
    redirectButton.addEventListener("click", function() {
        // 发送API请求
        GM_xmlhttpRequest({
            method: "GET",
            url: `${apiUrl}?url=${base64Url}&app_id=${appId}&app_secret=${appSecret}`,
            onload: function(response) {
                const data = JSON.parse(response.responseText);

                // 检查返回的数据
                if (data.code === 1 && data.data && data.data.list) {
                    const newUrl = data.data.list[0].url;
                    // 在新标签页打开视频下载页面
                    window.open(newUrl, '_blank');
                } else {
                    alert("未能获取下载链接，请稍后重试。");
                }
            },
            onerror: function(error) {
                console.error("请求失败：", error);
                alert("网络问题或API配置错误，请检查！");
            }
        });
    });
})();
