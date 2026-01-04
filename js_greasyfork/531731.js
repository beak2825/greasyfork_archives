// ==UserScript==
// @name         FreeWheel Github PR增强
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  --
// @author       zhouyan
// @match        https://github.freewheel.tv/*
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531731/FreeWheel%20Github%20PR%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/531731/FreeWheel%20Github%20PR%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 版本计划 (版本号: 发布日期)
    const VERSION_SCHEDULE = {
        '7.8': new Date('2025-02-18'),
        '7.8.1': new Date('2025-03-25'),
        '7.9': new Date('2025-04-22'),
        '7.9.1': new Date('2025-05-20'),
        '7.10': new Date('2025-06-17'),
        '7.10.1': new Date('2025-07-15'),
        '7.11': new Date('2025-08-12'),
        '7.11.1': new Date('2025-09-09'),
        '7.12': new Date('2025-10-09')
    };

    // 配置
    const CONFIG = {
        maxRetries: 3,          // 最大重试次数
        delayMultiplier: 500,   // 延迟乘数
        branchPrefix: 'V_'      // 分支前缀
    };

    // 根据当前日期计算目标分支
    function calculateTargetBranch() {
        const today = new Date();
        let targetVersion = null;
        let targetDate = null;

        // 查找下一个即将发布的版本
        for (const [version, date] of Object.entries(VERSION_SCHEDULE)) {
            // 计算发布前一周的周五（分支开始变更）
            const branchChangeDate = new Date(date);
            while (branchChangeDate.getDay() !== 5) { // 调整到前一个周五
                branchChangeDate.setDate(branchChangeDate.getDate() - 1);
            }

            if (today >= branchChangeDate) {
                targetVersion = version;
                targetDate = date;
            } else {
                // 已经过了最后一个相关版本
                break;
            }
        }

        // 如果在第一个分支变更日期之前，使用第一个版本
        if (!targetVersion) {
            const firstVersion = Object.keys(VERSION_SCHEDULE)[0];
            return `${CONFIG.branchPrefix}${firstVersion.replace(/\./g, '_')}`;
        }

        // 如果在最后一个发布日期之后，使用最后一个版本
        const lastVersion = Object.keys(VERSION_SCHEDULE)[Object.keys(VERSION_SCHEDULE).length - 1];
        const lastDate = VERSION_SCHEDULE[lastVersion];
        if (today > lastDate) {
            return `${CONFIG.branchPrefix}${lastVersion.replace(/\./g, '_')}`;
        }

        // 格式化版本号（例如 "7.8.1" 变成 "V_7_8_1"）
        return `${CONFIG.branchPrefix}${targetVersion.replace(/\./g, '_')}`;
    }

 // 按照规范格式化PR标题
    function formatPRTitle(title) {
        if (!title) return title;

        // 尝试按空格或连字符分割为三部分
        const splitIndex = Math.min(
            title.indexOf(' ') > 0 ? title.indexOf(' ') : Infinity,
            title.indexOf('-') > 0 ? title.indexOf('-') : Infinity
        );

        if (splitIndex !== Infinity && splitIndex > 0) {
            const firstPart = title.substring(0, splitIndex);
            const remaining = title.substring(splitIndex + 1);

            // 尝试分割第二部分
            const secondSplitIndex = Math.min(
                remaining.indexOf(' ') > 0 ? remaining.indexOf(' ') : Infinity,
                remaining.indexOf('-') > 0 ? remaining.indexOf('-') : Infinity
            );

            let secondPart = '';
            let restPart = remaining;

            if (secondSplitIndex !== Infinity && secondSplitIndex > 0) {
                secondPart = remaining.substring(0, secondSplitIndex);
                restPart = remaining.substring(secondSplitIndex + 1);
            }

            // 检查第一部分是否为纯字母，第二部分是否为纯数字
            const isFirstPartLetters = /^[A-Za-z]+$/.test(firstPart);
            const isSecondPartNumbers = /^\d+$/.test(secondPart);

            if (isFirstPartLetters && isSecondPartNumbers) {
                // 格式: 大写字母部分 + - + 数字部分 + 空格 + 剩余部分
                return `${firstPart.toUpperCase()}-${secondPart} ${restPart}`;
            }
        }

        // 如果不符合字母-数字模式，则从URL提取前缀
        const currentUrl = window.location.href;
        const lastColonIndex = currentUrl.lastIndexOf(':');

        if (lastColonIndex > 0) {
            const afterColon = currentUrl.substring(lastColonIndex + 1);
            const splitCharIndex = Math.min(
                afterColon.indexOf('_') > 0 ? afterColon.indexOf('_') : Infinity,
                afterColon.indexOf(' ') > 0 ? afterColon.indexOf(' ') : Infinity
            );

            if (splitCharIndex !== Infinity && splitCharIndex > 0) {
                const prefix = afterColon.substring(0, splitCharIndex);
                return `${prefix} ${title}`;
            }
        }

        // 如果所有条件都不满足，返回原标题
        return title;
    }

    // 初始化标题格式化按钮（修改后的UI样式）
    function initTitleFormatButton() {
        const titleHeader = document.getElementById('pull_request_title_header');
        if (!titleHeader || document.getElementById('gh-format-title-button')) return;

        const titleInput = titleHeader.nextElementSibling.querySelector('input');
        if (!titleInput) return;

        // 创建按钮容器（修改为右对齐）
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.alignItems = 'center';
        buttonContainer.style.width = '100%';
        buttonContainer.style.marginBottom = '8px';

        // 克隆标题元素以保持原有样式
        const titleClone = titleHeader.cloneNode(true);
        titleClone.style.marginBottom = '0';

        // 创建格式化按钮（使用与Set Base按钮相同的样式）
        const formatButton = document.createElement('button');
        formatButton.innerHTML = `
            <span class="Button-content">
                <span class="Button-label">Format Title</span>
            </span>
        `;

        formatButton.id = 'gh-format-title-button';
        formatButton.className = 'Button--secondary Button--small Button';
        formatButton.style.marginLeft = '8px';

        formatButton.addEventListener('click', function(e) {
            e.preventDefault();
            const currentTitle = titleInput.value;
            const formattedTitle = formatPRTitle(currentTitle);
            if (formattedTitle !== currentTitle) {
                titleInput.value = formattedTitle;
                showFeedback('标题已格式化!');

                // 触发变更事件
                const event = new Event('input', { bubbles: true });
                titleInput.dispatchEvent(event);
            }
        });

        // 重建标题区域结构
        const newHeaderContainer = document.createElement('div');
        newHeaderContainer.style.width = '100%';

        buttonContainer.appendChild(titleClone);
        buttonContainer.appendChild(formatButton);
        newHeaderContainer.appendChild(buttonContainer);

        // 替换原有标题区域
        titleHeader.parentNode.replaceChild(newHeaderContainer, titleHeader);
    }

    // 获取按钮文本（基于目标分支）
    function getButtonText(targetBranch) {
        return `Set Base to ${targetBranch}`;
    }

    function initSetBaseRefButton() {
        const headRefSelector = document.getElementById('head-ref-selector');
        const targetBranch = calculateTargetBranch();
        const buttonText = getButtonText(targetBranch);

        if (!headRefSelector || document.getElementById('gh-set-base-ref-button')) return;

        // 创建按钮
        const button = document.createElement('button');
        button.innerHTML = `
            <span class="Button-content">
                <span class="Button-label">${buttonText}</span>
            </span>
        `;

        button.id = 'gh-set-base-ref-button';
        button.className = 'Button--secondary Button--small Button';
        button.style.marginLeft = '8px';

        button.addEventListener('click', async function(e) {
            e.stopPropagation();
            e.preventDefault();

            let retryCount = 0;
            let success = false;

            while (retryCount < CONFIG.maxRetries && !success) {
                try {
                    retryCount++;
                    await attemptSetBaseBranch(targetBranch);
                    success = true;
                } catch (error) {
                    console.warn(`尝试 ${retryCount} 失败:`, error);
                    if (retryCount >= CONFIG.maxRetries) {
                        showFeedback(`错误: ${error.message}`, true);
                        console.error('所有尝试都失败了:', error);
                    } else {
                        await delay(CONFIG.delayMultiplier * retryCount);
                    }
                }
            }
        });

        headRefSelector.parentNode.insertBefore(button, headRefSelector.nextSibling);
    }

    async function attemptSetBaseBranch(targetBranch) {
        const baseRefSelector = document.getElementById('base-ref-selector');
        if (!baseRefSelector) throw new Error('找不到基础分支选择器');

        const baseSummary = baseRefSelector.querySelector('summary');
        if (!baseSummary) throw new Error('找不到下拉触发器');

        // 关闭任何打开的菜单
        if (baseSummary.getAttribute('aria-expanded') === 'true') {
            baseSummary.click();
            await delay(300);
        }

        // 打开菜单
        baseSummary.click();

        // 等待菜单加载
        const menu = await waitForElement('.SelectMenu-modal', null, 2000);
        if (!menu) throw new Error('下拉菜单加载失败');

        // 查找搜索输入框
        const searchInput = await waitForElement('.SelectMenu-filter .SelectMenu-input', null, 1500);
        if (!searchInput) throw new Error('找不到搜索输入框');

        // 聚焦并输入分支名称
        searchInput.focus();
        searchInput.value = targetBranch;

        // 触发输入事件
        const inputEvent = new Event('input', { bubbles: true });
        searchInput.dispatchEvent(inputEvent);

        // 等待结果
        await delay(800);

        // 查找目标项
        const targetItem = findTargetItem(targetBranch);
        if (!targetItem) throw new Error(`过滤后找不到分支 "${targetBranch}"`);

        // 点击选择
        targetItem.click();
        showFeedback(`基础分支已设置为 ${targetBranch}!`);
    }

    function findTargetItem(targetBranch) {
        const items = document.querySelectorAll('.SelectMenu-list .SelectMenu-item');
        for (let item of items) {
            const itemText = item.querySelector('.SelectMenu-item-text')?.textContent.trim() ||
                            item.querySelector('.css-truncate-overflow')?.textContent.trim();
            if (itemText === targetBranch) {
                return item;
            }
        }
        return null;
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function waitForElement(selector, condition, timeout = 3000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            const check = () => {
                try {
                    const elements = document.querySelectorAll(selector);
                    for (let element of elements) {
                        if (!condition || condition(element)) {
                            resolve(element);
                            return;
                        }
                    }

                    if (Date.now() - startTime > timeout) {
                        resolve(null);
                        return;
                    }

                    setTimeout(check, 100);
                } catch (error) {
                    reject(error);
                }
            };

            check();
        });
    }

    function showFeedback(message, isError = false) {
        let feedback = document.getElementById('gh-feedback-message');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.id = 'gh-feedback-message';
            feedback.style.position = 'fixed';
            feedback.style.bottom = '20px';
            feedback.style.right = '20px';
            feedback.style.padding = '10px 20px';
            feedback.style.borderRadius = '6px';
            feedback.style.zIndex = '9999';
            feedback.style.fontFamily = '-apple-system, BlinkMacSystemFont, sans-serif';
            feedback.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.15)';
            document.body.appendChild(feedback);
        }

        feedback.textContent = message;
        feedback.style.backgroundColor = isError ? '#f85149' : '#2ea043';
        feedback.style.color = 'white';
        feedback.style.opacity = '1';

        setTimeout(() => {
            feedback.style.opacity = '0';
        }, 3000);
    }

    function main() {
        const initWithRetry = (attempt = 1) => {
            try {
                initSetBaseRefButton();
                initTitleFormatButton();
            } catch (error) {
                if (attempt <= 3) {
                    console.warn(`初始化尝试 ${attempt} 失败，正在重试...`);
                    setTimeout(() => initWithRetry(attempt + 1), 500 * attempt);
                } else {
                    console.error('3次尝试后初始化失败:', error);
                }
            }
        };

        initWithRetry();

        const observer = new MutationObserver(function() {
            if (!document.getElementById('gh-set-base-ref-button') ||
                !document.getElementById('gh-format-title-button')) {
                initWithRetry();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 启动
    if (document.readyState === 'complete') {
        main();
    } else {
        window.addEventListener('load', main);
    }
})();