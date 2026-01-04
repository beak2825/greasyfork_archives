// ==UserScript==
// @name         高等继续教育网自动刷题，支持【单选题、多选题、简答题、填空题、在线考试】，已停更，永久免费，不保证百分百可用
// @namespace    https://greasyfork.org/zh-CN/users/1216832-nightjarjar
// @version      0.1.6
// @description  高等继续教育网自动刷题，适用于 http*://*.jxjypt.cn/*
// @author       nightjarjar
// @icon         https://www.jxjypt.cn/indexpage/images/icon.ico
// @match        http*://*.jxjypt.cn/paper/start*
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/479903/%E9%AB%98%E7%AD%89%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E8%87%AA%E5%8A%A8%E5%88%B7%E9%A2%98%EF%BC%8C%E6%94%AF%E6%8C%81%E3%80%90%E5%8D%95%E9%80%89%E9%A2%98%E3%80%81%E5%A4%9A%E9%80%89%E9%A2%98%E3%80%81%E7%AE%80%E7%AD%94%E9%A2%98%E3%80%81%E5%A1%AB%E7%A9%BA%E9%A2%98%E3%80%81%E5%9C%A8%E7%BA%BF%E8%80%83%E8%AF%95%E3%80%91%EF%BC%8C%E5%B7%B2%E5%81%9C%E6%9B%B4%EF%BC%8C%E6%B0%B8%E4%B9%85%E5%85%8D%E8%B4%B9%EF%BC%8C%E4%B8%8D%E4%BF%9D%E8%AF%81%E7%99%BE%E5%88%86%E7%99%BE%E5%8F%AF%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/479903/%E9%AB%98%E7%AD%89%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E8%87%AA%E5%8A%A8%E5%88%B7%E9%A2%98%EF%BC%8C%E6%94%AF%E6%8C%81%E3%80%90%E5%8D%95%E9%80%89%E9%A2%98%E3%80%81%E5%A4%9A%E9%80%89%E9%A2%98%E3%80%81%E7%AE%80%E7%AD%94%E9%A2%98%E3%80%81%E5%A1%AB%E7%A9%BA%E9%A2%98%E3%80%81%E5%9C%A8%E7%BA%BF%E8%80%83%E8%AF%95%E3%80%91%EF%BC%8C%E5%B7%B2%E5%81%9C%E6%9B%B4%EF%BC%8C%E6%B0%B8%E4%B9%85%E5%85%8D%E8%B4%B9%EF%BC%8C%E4%B8%8D%E4%BF%9D%E8%AF%81%E7%99%BE%E5%88%86%E7%99%BE%E5%8F%AF%E7%94%A8.meta.js
// ==/UserScript==



(function () {
    'use strict';

    // 创建按钮
    let button = document.createElement('button');
    button.innerHTML = '解锁完整功能';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.padding = '10px';
    button.style.cursor = 'pointer';
    button.style.borderRadius = '10px';
    button.style.background = 'black';
    button.style.color = 'orange';
    button.style.fontSize = '20px';
    button.style.fontWeight = 'bold';
    button.style.border = 'solid 2px orange';

    button.addEventListener('click', function () {
        showContactModal(`
        <p style="text-align: center; font-size: 20px; font-weight: bold;">联系方式</p>
        完整版脚本：<a href="https://greasyfork.org/zh-CN/scripts/479768-fill-answer-and-simulate-click-multi-select-support">Fill Answer and Simulate Click (Multi-Select Support)</a>
        <p style="text-align: center;font-size: 16px;color: lightgray;"><a href="mailto:nightjarjar@outlook.com">nightjarjar@outlook.com</a></p>
        `);
    });

    // 将按钮添加到页面
    document.body.appendChild(button);

    // 获取所有的问题项（li元素）
    let questionItems = document.querySelectorAll('li[id^="question_li_"]');

    // 遍历每个问题项
    questionItems.forEach(function(item) {
        // 获取“展开解析”的链接元素
        let expandLink = item.querySelector('.zkjx');

        // 模拟点击“展开解析”
        if (expandLink) {
            expandLink.click();
        }
    });

    // 提示消息
    showContactModal(`
        <p>已为您展开答案解析</p>
        <p>解锁完整功能，请点击右上方，
            <span style="
                display: inline-block;
                padding: 10px;
                border-radius: 10px;
                background: black;
                color: orange;
                font-size: 20px;
                font-weight: bold;
                border: 2px solid orange;
            ">解锁完整功能</span>
        </p>
    `);

    // 显示联系方式的模态框
    function showContactModal(innerHTML, autoCloseTimeout) {
        // 创建模态框容器
        let modalContainer = document.createElement('div');
        modalContainer.style.position = 'fixed';
        modalContainer.style.top = '0';
        modalContainer.style.left = '0';
        modalContainer.style.width = '100%';
        modalContainer.style.height = '100%';
        modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modalContainer.style.display = 'flex';
        modalContainer.style.alignItems = 'center';
        modalContainer.style.justifyContent = 'center';

        // 创建联系方式内容
        let contactContent = document.createElement('div');
        contactContent.style.backgroundColor = '#fff';
        contactContent.style.padding = '20px';
        contactContent.style.borderRadius = '10px';
        // '<p>联系方式：</p><p>Email: your.email@example.com</p><p>电话：123-456-7890</p>'
        contactContent.innerHTML = innerHTML;

        // 将联系方式内容添加到模态框容器
        modalContainer.appendChild(contactContent);

        // 将模态框容器添加到页面
        document.body.appendChild(modalContainer);

        // 如果 autoCloseTimeout 大于 0，则在 autoCloseTimeout 毫秒后自动关闭模态框
        if (autoCloseTimeout > 0) {
            setTimeout(function () {
                document.body.removeChild(modalContainer);
            }, autoCloseTimeout);
        }

        // 点击模态框外部关闭模态框
        modalContainer.addEventListener('click', function (event) {
            if (event.target === modalContainer) {
                document.body.removeChild(modalContainer);
            }
        });
    }
})();
