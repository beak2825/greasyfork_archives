// ==UserScript==
// @name         b站一键删除消息中心通知（更新可选择性删除）
// @namespace    http://tampermonkey.net/
// @version      2.1.0
// @description  适配新版B站消息中心，可自定义保留顶部通知数量
// @author       szhclear
// @match        https://message.bilibili.com/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue

// @downloadURL https://update.greasyfork.org/scripts/475941/b%E7%AB%99%E4%B8%80%E9%94%AE%E5%88%A0%E9%99%A4%E6%B6%88%E6%81%AF%E4%B8%AD%E5%BF%83%E9%80%9A%E7%9F%A5%EF%BC%88%E6%9B%B4%E6%96%B0%E5%8F%AF%E9%80%89%E6%8B%A9%E6%80%A7%E5%88%A0%E9%99%A4%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/475941/b%E7%AB%99%E4%B8%80%E9%94%AE%E5%88%A0%E9%99%A4%E6%B6%88%E6%81%AF%E4%B8%AD%E5%BF%83%E9%80%9A%E7%9F%A5%EF%BC%88%E6%9B%B4%E6%96%B0%E5%8F%AF%E9%80%89%E6%8B%A9%E6%80%A7%E5%88%A0%E9%99%A4%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 自定义一次运行的最大次数
    const MAX_COUNT = 999;

    // 等待网页加载完毕
    window.addEventListener('load', function() {
        // 创建控制容器
        let container = document.createElement('div');
        container.id = "sp-ac-container";
        container.style.position = "fixed";
        container.style.right = "20px";
        container.style.top = "105px";
        container.style.zIndex = "999999";
        container.style.padding = "15px";
        container.style.borderRadius = "8px";
        container.style.background = "rgba(0, 0, 0, 0.8)";
        container.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.5)";
        container.style.color = "#fff";
        container.style.fontFamily = "sans-serif";
        container.style.backdropFilter = "blur(10px)";
        container.style.border = "1px solid rgba(255, 255, 255, 0.15)";
        container.style.width = "280px";
        container.style.maxHeight = "90vh";
        container.style.overflowY = "auto";

        // 控制面板
        container.innerHTML =
            '<div style="text-align: center; margin-bottom: 15px;">' +
                '<div style="display: inline-flex; align-items: center; background: rgba(0, 161, 214, 0.2); padding: 5px 15px; border-radius: 20px; margin-bottom: 10px;">' +
                    '<div style="width: 24px; height: 24px; background: #00a1d6; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; margin-right: 8px;">B</div>' +
                    '<div style="font-weight: bold; color: #00a1d6; font-size: 16px;">B站通知清理工具</div>' +
                '</div>' +
            '</div>' +
            '<div style="margin-bottom: 15px;">' +
                '<label style="display: block; margin-bottom: 8px; font-size: 14px; color: #a0a0c0;">保留顶部通知数量：</label>' +
                '<div style="display: flex; align-items: center;">' +
                    '<input type="number" id="preserveCount" min="0" value="0" ' +
                        'style="flex: 1; padding: 10px 12px; border: 1px solid #2d2d4d; ' +
                        'border-radius: 6px; background: rgba(20, 20, 30, 0.7); color: #fff; font-size: 14px;">' +
                    '<div style="margin-left: 10px; font-size: 12px; color: #8888aa;">0=全部删除</div>' +
                '</div>' +
            '</div>' +
            '<div style="display: flex; justify-content: center; margin-bottom: 15px;">' +
                '<button id="deleteAllBtn" style="' +
                    'width: 100%;' +
                    'padding: 12px;' +
                    'font-size: 16px;' +
                    'background: linear-gradient(135deg, #00a1d6, #0087b4);' +
                    'color: white;' +
                    'border: none;' +
                    'border-radius: 6px;' +
                    'cursor: pointer;' +
                    'font-weight: bold;' +
                    'box-shadow: 0 4px 10px rgba(0,0,0,0.3);' +
                    'transition: all 0.3s;' +
                '">' +
                    '开始删除通知' +
                '</button>' +
            '</div>' +
            '<div id="progress" style="' +
                'padding: 12px;' +
                'background: rgba(30, 30, 45, 0.6);' +
                'border-radius: 6px;' +
                'font-size: 13px;' +
                'text-align: center;' +
                'margin-bottom: 10px;' +
            '">' +
                '<div id="statusText" style="font-size: 14px; margin-bottom: 5px;">准备就绪</div>' +
                '<div id="countText" style="font-size: 12px; color: #8888aa; margin-bottom: 10px;">保留顶部: 0 条通知</div>' +
                '<div style="height: 8px; background: rgba(0, 0, 0, 0.3); border-radius: 4px; overflow: hidden;">' +
                    '<div id="progressBar" style="height: 100%; background: linear-gradient(90deg, #00a1d6, #00c1a4); border-radius: 4px; width: 0%; transition: width 0.3s;"></div>' +
                '</div>' +
            '</div>' +
            '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 10px;">' +
                '<div style="background: rgba(40, 40, 60, 0.5); border-radius: 6px; padding: 10px; text-align: center;">' +
                    '<div id="deletedCount" style="font-size: 20px; font-weight: bold; color: #00a1d6;">0</div>' +
                    '<div style="font-size: 11px; color: #8888aa;">已删除</div>' +
                '</div>' +
                '<div style="background: rgba(40, 40, 60, 0.5); border-radius: 6px; padding: 10px; text-align: center;">' +
                    '<div id="skippedCount" style="font-size: 20px; font-weight: bold; color: #00a1d6;">0</div>' +
                    '<div style="font-size: 11px; color: #8888aa;">已跳过</div>' +
                '</div>' +
                '<div style="background: rgba(40, 40, 60, 0.5); border-radius: 6px; padding: 10px; text-align: center;">' +
                    '<div id="errorCount" style="font-size: 20px; font-weight: bold; color: #00a1d6;">0</div>' +
                    '<div style="font-size: 11px; color: #8888aa;">错误</div>' +
                '</div>' +
            '</div>' +
            '<div style="margin-top: 15px; font-size: 10px; color: #666688; text-align: center; padding-top: 10px; border-top: 1px solid rgba(255, 255, 255, 0.05);">' +
                '设置自动保存，刷新页面后仍然有效' +
            '</div>';

        document.body.appendChild(container);

        // 添加样式
        GM_addStyle(
            '#deleteAllBtn:hover {' +
                'background: linear-gradient(135deg, #0087b4, #006e95) !important;' +
                'transform: translateY(-2px);' +
                'box-shadow: 0 6px 14px rgba(0,0,0,0.4) !important;' +
            '}' +
            '#deleteAllBtn:active {' +
                'transform: translateY(0) !important;' +
            '}' +
            '#preserveCount:focus {' +
                'outline: none;' +
                'border-color: #00a1d6 !important;' +
                'box-shadow: 0 0 0 3px rgba(0, 161, 214, 0.3) !important;' +
            '}' +
            '#sp-ac-container::-webkit-scrollbar {' +
                'width: 6px;' +
            '}' +
            '#sp-ac-container::-webkit-scrollbar-track {' +
                'background: rgba(0,0,0,0.1);' +
            '}' +
            '#sp-ac-container::-webkit-scrollbar-thumb {' +
                'background: #00a1d6;' +
                'border-radius: 3px;' +
            '}'
        );

        // 加载设置
        const preserveCountInput = document.getElementById('preserveCount');
        const savedPreserveCount = GM_getValue('biliPreserveCount', 0);
        preserveCountInput.value = savedPreserveCount;

        // 保存设置
        preserveCountInput.addEventListener('change', function() {
            const value = parseInt(this.value) || 0;
            GM_setValue('biliPreserveCount', value);
            document.getElementById('countText').textContent = `保留顶部: ${value} 条通知`;
        });

        // 初始化
        document.getElementById('countText').textContent = `保留顶部: ${savedPreserveCount} 条通知`;

        document.getElementById('deleteAllBtn').addEventListener('click', startDeletion);

        async function startDeletion() {
            const btn = document.getElementById('deleteAllBtn');
            const statusText = document.getElementById('statusText');
            const countText = document.getElementById('countText');
            const preserveCountInput = document.getElementById('preserveCount');
            const progressBar = document.getElementById('progressBar');
            const deletedCountEl = document.getElementById('deletedCount');
            const skippedCountEl = document.getElementById('skippedCount');
            const errorCountEl = document.getElementById('errorCount');

            // 获取保留数量
            let preserveCount = parseInt(preserveCountInput.value);
            if (isNaN(preserveCount)) preserveCount = 0;
            preserveCount = Math.max(0, preserveCount);

            // 保存设置
            GM_setValue('biliPreserveCount', preserveCount);
            countText.textContent = `保留顶部: ${preserveCount} 条通知`;

            // 禁用按钮
            btn.disabled = true;
            btn.textContent = "删除中...";
            btn.style.opacity = "0.7";
            btn.style.cursor = "not-allowed";

            statusText.textContent = "开始删除...";
            statusText.style.color = "#fff";

            // 重置统计
            let deletedCount = 0;
            let skippedCount = 0;
            let errorCount = 0;
            deletedCountEl.textContent = "0";
            skippedCountEl.textContent = "0";
            errorCountEl.textContent = "0";

            try {
                for (let i = 0; i < MAX_COUNT; i++) {
                    // 更新进度条
                    const progressPercent = Math.min(100, Math.floor(i / MAX_COUNT * 100));
                    progressBar.style.width = `${progressPercent}%`;

                    // 获取所有删除按钮
                    const deleteButtons = document.querySelectorAll('.interaction-item__btn.invisible.delete');

                    if (!deleteButtons || deleteButtons.length === 0) {
                        statusText.textContent = "未找到更多通知";
                        break;
                    }

                    // 计算要删除的索引（跳过前preserveCount个）
                    const indexToDelete = preserveCount;

                    if (indexToDelete >= deleteButtons.length) {
                        statusText.textContent = `已完成 (保留 ${preserveCount} 条)`;
                        break;
                    }

                    // 获取要删除的按钮
                    const deleteBtn = deleteButtons[indexToDelete];

                    // 点击删除按钮
                    try {
                        deleteBtn.click();
                        await sleep(300);

                        // 获取确认按钮
                        const confirmBtn = document.querySelector('.b-modal-confirm');
                        if (confirmBtn) {
                            confirmBtn.click();
                            deletedCount++;
                            deletedCountEl.textContent = deletedCount;
                            statusText.textContent = `正在删除通知 ${i+1}/${MAX_COUNT}`;
                            statusText.style.color = "#00a1d6";
                        } else {
                            errorCount++;
                            errorCountEl.textContent = errorCount;
                            statusText.textContent = "未找到确认按钮";
                            statusText.style.color = "#f44336";
                        }
                    } catch (e) {
                        errorCount++;
                        errorCountEl.textContent = errorCount;
                        console.error("删除过程中出错:", e);
                        statusText.textContent = `错误: ${e.message || "未知错误"}`;
                        statusText.style.color = "#f44336";
                    }

                    await sleep(500);
                }

                if (deletedCount > 0) {
                    statusText.textContent = `删除完成!`;
                    statusText.style.color = "#4caf50";
                    progressBar.style.width = "100%";
                    progressBar.style.background = "#00c853";
                } else {
                    statusText.textContent = "没有需要删除的通知";
                    statusText.style.color = "#ff9800";
                    progressBar.style.width = "100%";
                    progressBar.style.background = "#ff9800";
                }
            } catch (e) {
                console.error("删除过程中出错:", e);
                statusText.textContent = "操作出错，请重试";
                statusText.style.color = "#f44336";
                progressBar.style.background = "#f44336";
            } finally {
                // 恢复按钮状态
                btn.disabled = false;
                btn.textContent = "开始删除通知";
                btn.style.opacity = "1";
                btn.style.cursor = "pointer";
            }
        }

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    });
})();