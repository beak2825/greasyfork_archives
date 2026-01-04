// ==UserScript==
// @name         大连理工大学自动评教
// @namespace    https://dinglz.cn/
// @version      1.0
// @description  大连理工大学自动评教，仅用于加快填写速度，务必人工复核填写内容是否符合预期！
// @author       dinglz
// @match        http://jxgl.dlut.edu.cn/evaluation-student-frontend/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538651/%E5%A4%A7%E8%BF%9E%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/538651/%E5%A4%A7%E8%BF%9E%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建提示框
    function createToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px 30px;
            border-radius: 8px;
            font-size: 16px;
            z-index: 100000;
            text-align: center;
            line-height: 1.5;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            animation: fadeIn 0.3s ease;
        `;

        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translate(-50%, -60%); }
                to { opacity: 1; transform: translate(-50%, -50%); }
            }
            @keyframes fadeOut {
                from { opacity: 1; transform: translate(-50%, -50%); }
                to { opacity: 0; transform: translate(-50%, -60%); }
            }
        `;
        document.head.appendChild(style);

        toast.innerHTML = message;
        document.body.appendChild(toast);

        // 3秒后自动消失
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // 创建按钮
    function createButton() {
        // 检查是否已经存在按钮
        if (document.getElementById('auto-fill-button')) {
            return;
        }

        const button = document.createElement('button');
        button.id = 'auto-fill-button';
        button.textContent = '自动填写问卷';
        button.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 99999;
            padding: 15px 30px;
            background-color: #409EFF;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 18px;
            font-weight: bold;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;

        // 添加悬停效果
        button.addEventListener('mouseover', () => {
            button.style.transform = 'scale(1.05)';
            button.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
        });

        button.addEventListener('mouseout', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        });

        button.addEventListener('click', autoFill);
        document.body.appendChild(button);
    }

    // 自动填写函数
    function autoFill() {
        // 获取所有问题项
        const items = document.querySelectorAll('.item');

        items.forEach((item, index) => {
            const questionNumber = index + 1;
            const radioGroups = item.querySelectorAll('.el-radio-group');

            if (radioGroups.length > 0) {
                // 根据题号选择不同的选项
                let targetIndex = 0; // 默认选择第一个

                if (questionNumber >= 9 && questionNumber <= 10) {
                    // 9-10题选择最后一个选项
                    targetIndex = radioGroups.length - 1;
                }

                // 获取目标单选按钮
                const targetRadio = radioGroups[targetIndex].querySelector('.el-radio');
                if (targetRadio) {
                    targetRadio.click();
                }
            }
        });

        // 处理文本输入框
        const textarea = document.querySelector('.el-textarea__inner');
        if (textarea) {
            textarea.value = '无';
            // 触发input事件以确保Vue能够检测到变化
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
        }

        // 显示提示框
        createToast('请注意检查内容是否符合您的预期<br>powered by dinglz');
    }

    // 使用MutationObserver监听DOM变化
    function observeDOM() {
        const observer = new MutationObserver((mutations) => {
            if (document.querySelector('.survey-description')) {
                createButton();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 页面加载完成后开始监听
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observeDOM);
    } else {
        observeDOM();
    }

    // 立即检查一次
    if (document.querySelector('.survey-description')) {
        createButton();
    }
})(); 