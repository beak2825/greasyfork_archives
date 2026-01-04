// ==UserScript==
// @name         佛历-佛菩萨高僧纪念倒数日（每天显示3次）
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  只有4kb,打开任意网页右上角自动显示最近的佛菩萨高僧大德纪念日倒数日，每天显示3次，每次10秒。
// @author       极简实用
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      AGPL
// @downloadURL https://update.greasyfork.org/scripts/519527/%E4%BD%9B%E5%8E%86-%E4%BD%9B%E8%8F%A9%E8%90%A8%E9%AB%98%E5%83%A7%E7%BA%AA%E5%BF%B5%E5%80%92%E6%95%B0%E6%97%A5%EF%BC%88%E6%AF%8F%E5%A4%A9%E6%98%BE%E7%A4%BA3%E6%AC%A1%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/519527/%E4%BD%9B%E5%8E%86-%E4%BD%9B%E8%8F%A9%E8%90%A8%E9%AB%98%E5%83%A7%E7%BA%AA%E5%BF%B5%E5%80%92%E6%95%B0%E6%97%A5%EF%BC%88%E6%AF%8F%E5%A4%A9%E6%98%BE%E7%A4%BA3%E6%AC%A1%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前日期
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD 格式

    // 获取已经查看的次数
    let viewCount = GM_getValue(today, 0);

    // 设置每日限制（3次）
    const dailyLimit = 3;

    // 如果已经达到限制，则不再显示弹出窗口
    if (viewCount >= dailyLimit) {
        console.log("今天已达到查看次数上限。");
        return;
    }

    // 创建弹出窗口的HTML，并设置样式
    const popupWindow = document.createElement('div');
    popupWindow.style.position = 'fixed';
    popupWindow.style.top = '10px';
    popupWindow.style.right = '10px';
    popupWindow.style.width = '300px';
    popupWindow.style.height = '275px';
    popupWindow.style.background = 'white';
    popupWindow.style.border = '1px solid #ccc';
    popupWindow.style.boxShadow = '2px 2px 10px rgba(0,0,0,0.5)';
    popupWindow.style.zIndex = '9999';
    popupWindow.style.display = 'none';
    popupWindow.style.overflow = 'hidden';
    document.body.appendChild(popupWindow);

    // 获取新浪网站内容
    GM_xmlhttpRequest({
        method: "GET",
        url: "http://fo.sina.com.cn/",
        onload: function(response) {
            if (response.status === 200) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');

                // 查找第一个 class 为 "ft_item" 的 li 元素
                const item = doc.querySelector('li.ft_item'); // 只取第一个

                let content = '';

                // 检查是否找到了内容
                if (!item) {
                    content = '没有找到对应的内容';
                } else {
                    const image = item.querySelector('img') ? item.querySelector('img').src : ''; // 获取图片链接

                    // 移除类名为 "fth_left" 的 span 元素
                    const spans = item.querySelectorAll('span.fth_left');
                    spans.forEach(span => span.remove());

                    // 获取文本内容并去除多余空白
                    const text = item.textContent.trim();

                    // 构建显示内容
                    content += '<div style="text-align:center; font-size:16px; font-family:\'微软雅黑\', sans-serif; margin-bottom: 10px;">';
                    if (image) {
                        content += `<img src="${image}" style="max-width:100%; height:auto;" alt="Image" />`; // 显示图片
                    }
                    content += `<div>${text}</div>`; // 添加文本
                    content += '</div>';
                }

                // 将内容插入到弹出窗口中
                popupWindow.innerHTML = content;
                popupWindow.style.display = 'block'; // 显示弹出窗口

                // 增加查看次数
                viewCount++;
                GM_setValue(today, viewCount); // 保存当前查看次数

                // 设置10秒后自动关闭弹出窗口
                setTimeout(function() {
                    popupWindow.style.display = 'none'; // 隐藏弹出窗口
                }, 10000); // 10000毫秒 = 10秒
            } else {
                console.error("无法加载新浪网站内容，状态码：" + response.status);
                popupWindow.innerHTML = '加载内容失败，状态码：' + response.status;
                popupWindow.style.display = 'block';
            }
        },
        onerror: function() {
            console.error("请求出错");
            popupWindow.innerHTML = '请求出错，请稍后重试';
            popupWindow.style.display = 'block';
        }
    });

    // 关闭弹出窗口（点击关闭）
    popupWindow.addEventListener('click', function() {
        this.style.display = 'none';
    });
})();