// ==UserScript==
// @name Kusa.pics 自动生成
// @namespace http://tampermonkey.net/
// @version 1.1
// @description 在kusa.pics的Generate按钮右侧，添加“自动循环生成”按钮,激活后可以持续循环生成图片
// @author CWBeta
// @icon: https://www.google.com/s2/favicons?domain=maples.im
// @match https://kusa.pics/*
// @match http://kusa.pics/*
// @grant none
// @namespace https://greasyfork.org/users/670174
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545149/Kusapics%20%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/545149/Kusapics%20%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建自动生成按钮
    function createAutoGenerateButton() {
        const button = document.createElement('button');
        button.id = 'auto-generate-btn';
        button.title = '自动生成'; // 添加提示文字
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                <path d="M21 3v5h-5"></path>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                <path d="M3 21v-5h5"></path>
            </svg>
        `;

        button.style.cssText = `
            background: white;
            border: 2px solid #e5e7eb;
            border-radius: 10px;
            cursor: pointer;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            color: #6b7280;
            width: 36px;
            height: 36px;
            margin-left: 8px;
            vertical-align: top;
        `;

        // 添加旋转动画的CSS
        if (!document.getElementById('auto-generate-styles')) {
            const style = document.createElement('style');
            style.id = 'auto-generate-styles';
            style.textContent = `
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .auto-generate-spinning svg {
                    animation: spin 1s linear infinite;
                }
            `;
            document.head.appendChild(style);
        }

        // 悬停效果（仅在非激活状态时生效）
        button.addEventListener('mouseenter', () => {
            if (!isAutoGenerating) {
                button.style.backgroundColor = '#f9fafb';
                button.style.borderColor = '#d1d5db';
                button.style.transform = 'scale(1.05)';
            }
        });

        button.addEventListener('mouseleave', () => {
            if (!isAutoGenerating) {
                button.style.backgroundColor = 'white';
                button.style.borderColor = '#e5e7eb';
                button.style.transform = 'scale(1)';
            }
        });

        return button;
    }

    // 查找Generate按钮
    function findGenerateButton() {
        const buttons = document.querySelectorAll('button');
        for (let button of buttons) {
            const spanElement = button.querySelector('span');
            if (spanElement && spanElement.textContent.trim() === 'Generate') {
                return button;
            }
        }
        return null;
    }

    // 将自动生成按钮插入到Generate按钮旁边
    function insertAutoGenerateButton() {
        const generateBtn = findGenerateButton();
        if (generateBtn && !document.getElementById('auto-generate-btn')) {
            const autoBtn = createAutoGenerateButton();

            // 找到Generate按钮的父容器
            const parent = generateBtn.parentElement;

            // 检查父容器是否是flex布局，如果不是则设置为flex
            const parentStyle = window.getComputedStyle(parent);
            if (parentStyle.display !== 'flex') {
                parent.style.display = 'flex';
                parent.style.alignItems = 'center';
                parent.style.gap = '8px';
            }

            // 在Generate按钮后插入自动生成按钮
            generateBtn.insertAdjacentElement('afterend', autoBtn);

            // 添加点击事件
            autoBtn.addEventListener('click', () => {
                if (isAutoGenerating) {
                    stopAutoGenerate();
                } else {
                    startAutoGenerate();
                }
            });

            console.log('自动生成按钮已添加到Generate按钮旁边');
            return true;
        }
        return false;
    }

    // 自动生成逻辑
    let isAutoGenerating = false;
    let autoGenerateInterval;

    function startAutoGenerate() {
        if (isAutoGenerating) return;

        isAutoGenerating = true;
        const autoBtn = document.getElementById('auto-generate-btn');

        // 更新按钮样式为激活状态（绿色 + 旋转动画）
        autoBtn.style.backgroundColor = '#10b981';
        autoBtn.style.borderColor = '#059669';
        autoBtn.style.color = 'white';
        autoBtn.style.transform = 'scale(1)'; // 确保不会被hover效果影响
        autoBtn.classList.add('auto-generate-spinning');

        // 开始自动生成循环
        function generateLoop() {
            const generateBtn = findGenerateButton();
            if (generateBtn && !generateBtn.disabled) {
                generateBtn.click();
                console.log('自动点击了Generate按钮');

                // 等待按钮变为disabled状态，然后等待重新启用
                const checkButtonState = setInterval(() => {
                    if (generateBtn.disabled) {
                        // 按钮被禁用，等待重新启用
                        const waitForEnable = setInterval(() => {
                            if (!generateBtn.disabled && isAutoGenerating) {
                                clearInterval(waitForEnable);
                                // 延迟1秒后继续下一次生成
                                setTimeout(generateLoop, 1000);
                            } else if (!isAutoGenerating) {
                                clearInterval(waitForEnable);
                            }
                        }, 500);
                        clearInterval(checkButtonState);
                    } else if (!isAutoGenerating) {
                        clearInterval(checkButtonState);
                    }
                }, 100);
            } else if (isAutoGenerating) {
                // 如果没找到按钮或按钮被禁用，1秒后重试
                setTimeout(generateLoop, 1000);
            }
        }

        generateLoop();
    }

    function stopAutoGenerate() {
        isAutoGenerating = false;
        const autoBtn = document.getElementById('auto-generate-btn');

        // 恢复按钮原始样式并停止旋转
        autoBtn.style.backgroundColor = 'white';
        autoBtn.style.borderColor = '#e5e7eb';
        autoBtn.style.color = '#6b7280';
        autoBtn.style.transform = 'scale(1)';
        autoBtn.classList.remove('auto-generate-spinning');

        console.log('停止自动生成');
    }

    // 初始化
    function init() {
        // 等待页面加载完成后尝试插入按钮
        function tryInsertButton() {
            if (insertAutoGenerateButton()) {
                console.log('Kusa.pics 自动生成脚本已加载');
            } else {
                // 如果没找到Generate按钮，继续尝试
                setTimeout(tryInsertButton, 1000);
            }
        }

        setTimeout(tryInsertButton, 1000);

        // 监听页面变化，防止页面动态加载导致按钮丢失
        const observer = new MutationObserver(() => {
            if (!document.getElementById('auto-generate-btn')) {
                insertAutoGenerateButton();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();