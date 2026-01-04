// ==UserScript==
// @name         硅基流动API密钥批量创建器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在硅基流动平台自动批量创建API密钥
// @author       wyek1n
// @match        https://cloud.siliconflow.cn/account/ak*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537883/%E7%A1%85%E5%9F%BA%E6%B5%81%E5%8A%A8API%E5%AF%86%E9%92%A5%E6%89%B9%E9%87%8F%E5%88%9B%E5%BB%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/537883/%E7%A1%85%E5%9F%BA%E6%B5%81%E5%8A%A8API%E5%AF%86%E9%92%A5%E6%89%B9%E9%87%8F%E5%88%9B%E5%BB%BA%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面完全加载
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            function checkElement() {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error(`元素未找到: ${selector}`));
                } else {
                    setTimeout(checkElement, 100);
                }
            }

            checkElement();
        });
    }

    // 延时函数
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 点击新建API密钥按钮
    async function clickCreateAPIButton() {
        try {
            // 优先使用文本内容查找
            let button = Array.from(document.querySelectorAll('span')).find(
                span => span.textContent.includes('🔑 新建 API 密钥')
            );

            if (!button) {
                // 备用选择器
                button = document.querySelector('body > div > div.bg-transparent.flex-1.h-full.overflow-x-hidden > main > div > div.mb-4.flex.justify-between > button > span');
            }

            if (button) {
                // 点击按钮的父元素（实际的button）
                const actualButton = button.closest('button');
                if (actualButton) {
                    actualButton.click();
                    console.log('✅ 已点击新建API密钥按钮');
                    return true;
                }
            }

            throw new Error('未找到新建API密钥按钮');
        } catch (error) {
            console.error('❌ 点击新建API密钥按钮失败:', error);
            return false;
        }
    }

    // 智能等待确认按钮出现
    async function waitForConfirmButton(maxRetries = 20) {
        for (let i = 0; i < maxRetries; i++) {
            // 优先使用文本内容查找
            let confirmButton = Array.from(document.querySelectorAll('span')).find(
                span => span.textContent.trim() === '新建密钥'
            );

            if (!confirmButton) {
                // 备用选择器
                confirmButton = document.querySelector('body > div:nth-child(31) > div > div.ant-modal-wrap > div > div:nth-child(1) > div > div.ant-modal-footer > button.ant-btn.css-v71kjs.ant-btn-primary.ant-btn-color-primary.ant-btn-variant-solid > span');
            }

            if (confirmButton) {
                return confirmButton;
            }

            await sleep(100); // 每100ms检查一次
        }
        return null;
    }

    // 点击确认创建按钮
    async function clickConfirmButton() {
        try {
            // 智能等待弹窗出现
            const confirmButton = await waitForConfirmButton();

            if (confirmButton) {
                // 点击按钮的父元素（实际的button）
                const actualButton = confirmButton.closest('button');
                if (actualButton) {
                    actualButton.click();
                    console.log('✅ 已点击确认创建按钮');
                    return true;
                }
            }

            throw new Error('未找到确认创建按钮');
        } catch (error) {
            console.error('❌ 点击确认创建按钮失败:', error);
            return false;
        }
    }

    // 创建单个API密钥
    async function createSingleAPI(fastMode = false) {
        try {
            // 步骤1: 点击新建API密钥按钮
            const step1Success = await clickCreateAPIButton();
            if (!step1Success) {
                return false;
            }

            // 步骤2: 点击确认创建按钮（智能等待，无需固定延时）
            const step2Success = await clickConfirmButton();
            if (!step2Success) {
                return false;
            }

            // 等待API创建完成（快速模式下减少等待时间）
            await sleep(fastMode ? 800 : 1200);

            return true;
        } catch (error) {
            console.error('❌ 创建API密钥失败:', error);
            return false;
        }
    }

    // 批量创建API密钥
    async function batchCreateAPIs(count, fastMode = false) {
        let successCount = 0;
        let failCount = 0;
        const delayTime = fastMode ? 500 : 1500; // 快速模式下减少间隔

        for (let i = 1; i <= count; i++) {
            console.log(`🚀 开始创建第 ${i}/${count} 个API密钥...`);

            const success = await createSingleAPI(fastMode);

            if (success) {
                successCount++;
                console.log(`✅ 第 ${i} 个API密钥创建成功`);
            } else {
                failCount++;
                console.log(`❌ 第 ${i} 个API密钥创建失败`);
            }

            // 在创建之间添加延时，避免请求过于频繁
            if (i < count) {
                console.log(`⏳ 等待${delayTime/1000}秒后继续...`);
                await sleep(delayTime);
            }
        }

        // 显示最终结果
        const message = `🎉 创建完成！\n✅ 成功: ${successCount} 个\n❌ 失败: ${failCount} 个`;
        console.log(message);
        alert(message);
    }

    // 创建控制面板
    function createControlPanel() {
        // 检查是否已存在控制面板
        if (document.getElementById('api-creator-panel')) {
            return;
        }

        const panel = document.createElement('div');
        panel.id = 'api-creator-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: #fff;
            border: 2px solid #1890ff;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-family: Arial, sans-serif;
            min-width: 280px;
        `;

        panel.innerHTML = `
            <div style="margin-bottom: 15px; font-weight: bold; color: #1890ff; font-size: 16px;">
                🚀 API密钥快速创建器
            </div>
            <div style="margin-bottom: 10px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 500;">创建数量:</label>
                <input type="number" id="api-count" min="1" value="5"
                       style="width: 100%; padding: 8px; border: 1px solid #d9d9d9; border-radius: 4px; font-size: 14px;">
            </div>
            <div style="margin-bottom: 10px;">
                <button id="start-creation"
                        style="width: 100%; padding: 10px; background: #1890ff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: 500;">
                    🚀 快速创建
                </button>
            </div>
            <div style="margin-bottom: 10px;">
                <button id="close-panel"
                        style="width: 100%; padding: 8px; background: #f5f5f5; color: #666; border: 1px solid #d9d9d9; border-radius: 4px; cursor: pointer; font-size: 12px;">
                    关闭面板
                </button>
            </div>
        `;

        document.body.appendChild(panel);

        // 添加事件监听器
        document.getElementById('start-creation').addEventListener('click', async function() {
            const count = parseInt(document.getElementById('api-count').value);

            if (!count || count < 1) {
                alert('❌ 请输入有效的创建数量');
                return;
            }

            const estimatedTime = count * 1.3;
            const timeText = estimatedTime > 60
                ? `约${Math.round(estimatedTime/60)}分${Math.round(estimatedTime%60)}秒`
                : `约${Math.round(estimatedTime)}秒`;

            const confirmMessage = `确定要快速创建 ${count} 个API密钥吗？\n预计用时：${timeText}`;

            if (confirm(confirmMessage)) {
                // 禁用按钮防止重复点击
                this.disabled = true;
                this.textContent = '创建中...';
                this.style.background = '#ccc';

                try {
                    await batchCreateAPIs(count, true); // 直接使用快速模式
                } finally {
                    // 恢复按钮状态
                    this.disabled = false;
                    this.textContent = '🚀 快速创建';
                    this.style.background = '#1890ff';
                }
            }
        });

        document.getElementById('close-panel').addEventListener('click', function() {
            panel.remove();
        });

        // 让输入框支持回车键
        document.getElementById('api-count').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                document.getElementById('start-creation').click();
            }
        });
    }

    // 页面加载完成后初始化
    function init() {
        // 等待页面完全加载
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // 延时创建控制面板，确保页面元素都已加载
        setTimeout(() => {
            createControlPanel();
            console.log('🚀 硅基流动API密钥快速创建器已启动！');
        }, 2000);
    }

    // 启动脚本
    init();

})();