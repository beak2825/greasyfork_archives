// ==UserScript==
// @name         华医网定制
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  批量收藏课程
// @author       小智
// @match        https://cme28.91huayi.com/*
// @grant        none
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/536589/%E5%8D%8E%E5%8C%BB%E7%BD%91%E5%AE%9A%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/536589/%E5%8D%8E%E5%8C%BB%E7%BD%91%E5%AE%9A%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个按钮
    const button = document.createElement('button');
    button.textContent = '批量收藏课程'; // 设置按钮文本
    button.style.position = 'fixed'; // 设置按钮位置
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '9999'; // 确保按钮在页面最上层
    button.style.backgroundColor = 'blue'; // 设置按钮背景颜色
    button.style.color = 'white'; // 设置按钮文字颜色
    button.style.padding = '10px'; // 设置按钮内边距
    button.style.border = 'none'; // 去掉按钮边框
    button.style.borderRadius = '5px'; // 设置按钮圆角

    // 添加点击事件处理程序
    button.addEventListener('click', async () => {
        try {
            // 获取当前页面的所有Cookie
            const cookies = document.cookie;

            // 打印Cookie到控制台
            console.log('当前页面的Cookie:', cookies);

            // 定义所有要发送的请求参数
            const requests = [
                { courseId: '4fd25a23-c4bc-434b-a321-1dd3227f7c3c', coaId: '77f48e6c-47f1-4fe5-82db-b2cf00de6dd7', isCollect: '0' },
                { courseId: 'f5f25cef-dab2-4019-ad03-43691015772d', coaId: '94eaa3e0-5d4d-4c12-b78d-b287012c7b56', isCollect: '0' },
                { courseId: '50f52b5d-53e1-46c3-8c4c-8864c42c82b1', coaId: 'b0d8b0c6-2bf7-4f1b-8801-b2c2009fb55e', isCollect: '0' },
                { courseId: '72a165f2-fa8e-457b-8e07-21e4d2d3cb08', coaId: '5ea8a240-e390-4757-bd17-b2c2009fb0b2', isCollect: '0' },
                { courseId: '69fb1b4f-c476-43c3-bad8-06a1aba32189', coaId: 'd4cad0c1-e277-4ea0-80ed-b2a000fdaec6', isCollect: '0' },
                { courseId: '7191367e-728a-48e1-9974-299763a5ccbd', coaId: '09c430fd-b832-40ec-9c87-b287012cb693', isCollect: '0' },
                { courseId: 'c9c8f0a6-44f1-412f-9ad4-95c8cb582b96', coaId: 'b349d59a-9136-42fd-be44-b2df00a1ab47', isCollect: '0' },
                { courseId: 'c1c8b203-852d-4c91-9d1e-f4e3442f4339', coaId: 'b15ba84a-7f74-404f-ba47-b287012c7e6c', isCollect: '0' },
                { courseId: '1f194330-42bd-40dd-bbd6-22897656110e', coaId: 'f08efe1c-c8eb-43bc-8bb7-b2cf00de724a', isCollect: '0' }
            ];

            // 用于存储操作结果
            let results = '';

            // 逐个发送请求
            for (const { courseId, coaId, isCollect } of requests) {
                const response = await fetch('https://cme28.91huayi.com/ashx/updateCourseCollect.ashx', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded', // 表单数据格式
                        'Cookie': cookies // 将Cookie放入请求头
                    },
                    body: `courseId=${courseId}&coaId=${coaId}&isCollect=${isCollect}` // POST请求的参数
                });

                const data = await response.json();
                console.log('服务器返回的数据:', data);

                if (data.code === 0) {
                    results += `课程ID为 ${courseId} 的课程已收藏！\n`;
                } else {
                    results += `课程ID为 ${courseId} 的课程收藏失败，错误信息: ${data.msg}\n`;
                }

                // 每次请求之间间隔1秒
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            // 显示所有操作结果
            alert(results);
            // 刷新网页
            window.location.reload();
        } catch (error) {
            console.error('批量收藏课程失败:', error);
            alert('批量收藏课程失败，请稍后再试！');
        }
    });

    // 将按钮添加到页面中
    document.body.appendChild(button);
})();