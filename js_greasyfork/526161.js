// ==UserScript==
// @name         校管家AI帮写按钮
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在“AI帮写”按钮左侧添加一个按钮，用于自动生成评价并复制到剪切板
// @author       您的昵称
// @match        https://tms06.xiaogj.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/526161/%E6%A0%A1%E7%AE%A1%E5%AE%B6AI%E5%B8%AE%E5%86%99%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/526161/%E6%A0%A1%E7%AE%A1%E5%AE%B6AI%E5%B8%AE%E5%86%99%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待目标页面元素加载完成
    function waitForElement() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE && node.matches('.comm-item')) {
                        observer.disconnect();
                        addCustomButton();
                        return;
                    }
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // 超时机制
        setTimeout(() => {
            observer.disconnect();
            alert('超时：目标元素未找到');
            console.log('超时：目标元素未找到');
        }, 10000000);
    }

    // 添加自定义按钮
    function addCustomButton() {
        const aiHelpWriteButton = document.querySelector('a.operation-link.select-template-btn');
        if (!aiHelpWriteButton || document.getElementById('customGenerateReview')) return;

        const customButton = document.createElement('button');
        customButton.id = 'customGenerateReview';
        customButton.textContent = '自动生成评价';
        customButton.style.cssText = `
            margin-right: 10px;
            padding: 5px 10px;
            background-color: #2878E8;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        `;

        // 点击事件
        customButton.addEventListener('click', generateReview);

        // 插入按钮
        aiHelpWriteButton.parentNode.insertBefore(customButton, aiHelpWriteButton);
        alert('自动生成评价并复制按钮已添加,个人服务器,生成较慢');
        console.log('自动生成评价并复制按钮已添加');
    }

    // 生成评价
    function generateReview() {
        const studentName = getStudentName();
        const courseContent = getCourseContent();
        if (!studentName || !courseContent) {
            alert('学生姓名或上课内容为空，无法生成评价！');
            return;
        }

        alert(`学生姓名: ${studentName}, 上课内容: ${courseContent}`);
        console.log(`学生姓名: ${studentName}, 上课内容: ${courseContent}`);
        callGenerateReviewAPI(studentName, courseContent);
    }

    // 获取学生姓名
    function getStudentName() {
        const studentNameElement = document.querySelector('.comm-item-left .name');
        return studentNameElement ? studentNameElement.textContent.trim() : '';
    }

    // 获取上课内容
    function getCourseContent() {
        const courseContentElement = document.querySelector('.field-item.full .textarea-virtual');
        return courseContentElement ? courseContentElement.textContent.trim() : '';
    }

    function callGenerateReviewAPI(studentName="同学", courseContent="编程") {
        alert(`发送请求到 API，生成评价...`);

        const apiUrl = 'http://8.130.118.164:11434/api/generate'; // 使用 /api/generate 端点

        const prompt = `模拟编程教师，根据学生姓名 ${studentName} 和 上课内容 ${courseContent} 对学生进行详细点评，字数200字左右，语气委婉且专业。要求:不需要分段`;

        GM_xmlhttpRequest({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                model: 'deepseek-r1:8b', // 修改为 "llama3.2"
                prompt: prompt,   // 直接传递 prompt
                stream: false     // 关闭流式传输
            }),
            onload: function(response) {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    if (data.response) {  // /api/generate 的返回字段是 "response"
                        //alert('API 返回数据成功，准备复制评价到剪切板...');
                        console.log('API 返回数据成功');
                        copyToClipboard(data.response); // 复制生成的评价到剪切板
                        //alert('评价生成并复制到剪切板成功！');
                    } else {
                        alert('Ollama 生成失败，请检查返回数据！');
                    }
                } else {
                    alert('请求 Ollama 失败，请检查 Ollama 服务器是否可用！');
                }
            },
            onerror: function() {
                alert('无法连接 Ollama，请确保 Ollama 服务器可访问！');
            }
        });
    }

    // 复制到剪切板
    function copyToClipboard(reviewContent) {
        console.log("生成的评价：", reviewContent);  // 打印生成的评价内容
        GM_setClipboard(reviewContent, 'text'); // 使用 Tampermonkey 的 GM_setClipboard 函数复制内容
        alert('✅ 已复制评价到剪切板');
        console.log('✅ 已复制评价到剪切板');
    }

    // 启动脚本
    waitForElement();
})();
