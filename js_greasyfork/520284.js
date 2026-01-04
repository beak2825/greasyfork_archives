// ==UserScript==
// @name         YouTube Engagement Panel Text Extractor
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  提取并复制 ytd-engagement-panel-section-list-renderer 标签下的文本
// @author       微信：civilpy
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520284/YouTube%20Engagement%20Panel%20Text%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/520284/YouTube%20Engagement%20Panel%20Text%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个容器来保持两个按钮在一起
    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.top = '50%'; // 设置为页面高度的50%
    buttonContainer.style.right = '10px'; // 距离右侧10像素
    buttonContainer.style.transform = 'translateY(-50%)'; // 垂直居中对齐
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'column';
    buttonContainer.style.alignItems = 'flex-end'; // 将子元素靠右对齐

    // 创建两个按钮
    const button1 = document.createElement('button');
    button1.innerText = '提取文字';
    button1.style.marginBottom = '10px'; // 给两个按钮之间添加一些间距
    
    const button2 = document.createElement('button');
    button2.innerText = '下载文案';
    button2.disabled = true; // 初始状态下禁用复制按钮
    button2.style.marginBottom = '10px'; // 给两个按钮之间添加一些间距

    // 创建导航到网站的按钮
    const button3 = document.createElement('button');
    button3.innerText = '我的网站';

    // 设置按钮点击事件，当点击时导航到指定的URL
    button3.addEventListener('click', function() {
        // 替换为你的实际网址
        window.location.href = 'https://intumu.com';
    });


    // 添加到容器
    buttonContainer.appendChild(button1);
    buttonContainer.appendChild(button2);
     buttonContainer.appendChild(button3);

    // 添加到页面
    document.body.appendChild(buttonContainer);

    let extractedText = '';

button1.addEventListener('click', () => {
    // 查找所有ytd-engagement-panel-section-list-renderer元素并提取其文本内容
    const elements = document.querySelectorAll('ytd-engagement-panel-section-list-renderer');
    
    // 提取文本并去除前后空白，过滤掉空行或仅有空白字符的行
    extractedText = Array.from(elements)
        .map(el => el.textContent.trim()) // 去除每段文字前后的空白字符
        .filter(line => line.replace(/\s+/g, '').length > 0) // 使用正则表达式替换所有空白字符，并检查是否为空字符串
        .join('\n'); // 将所有非空行用换行符连接起来

    console.log('已提取的文字:', extractedText); // 输出到控制台供调试

    // 启用复制按钮
    button2.disabled = false;
});

button2.addEventListener('click', () => {
    if (extractedText) {
        
        // 清洗文本，去掉空行
        const cleanedText = extractedText.split('\n').filter(line => line.trim() !== '').join('\n');
        // 获取当前时间戳
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // 替换非法文件名字符

        // 创建文件内容
        const fileContent = "分析总结以下文本：\n" + extractedText;

        // 创建隐藏的<a>元素用于下载
        const element = document.createElement('a');
        const blob = new Blob([fileContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        element.href = url;
        element.download = `${timestamp}.txt`; // 设置文件名为时间戳.txt

        // 将<a>元素添加到DOM中并触发点击事件
        document.body.appendChild(element);
        element.click();

        // 清理
        document.body.removeChild(element);
        URL.revokeObjectURL(url);

        console.log('文件已准备下载');
        alert('文件已准备下载');
    }
});
})();