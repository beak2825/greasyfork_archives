// ==UserScript==
// @name    鱼糕V2 钓饵统计器
// @version  3.6
// @description 智能实时统计鱼糕V2钓饵，统一元素等待机制，修复 ReferenceError。
// @author   Atail@神意之地
// @match    https://fish.ffmomola.com/ng/
// @icon     https://www.google.com/s2/favicons?sz=64@domain=ffmomola.com
// @grant    GM_notification
// @namespace https://greasyfork.org/users/437453
// @downloadURL https://update.greasyfork.org/scripts/529873/%E9%B1%BC%E7%B3%95V2%20%E9%92%93%E9%A5%B5%E7%BB%9F%E8%AE%A1%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/529873/%E9%B1%BC%E7%B3%95V2%20%E9%92%93%E9%A5%B5%E7%BB%9F%E8%AE%A1%E5%99%A8.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const fishingRecordsPageUrl = 'https://fish.ffmomola.com/ng/#/fishing';
    const tableBodySelector = 'tbody.MuiTableBody-root';
    const fishingRecordRowSelector = 'tr.MuiTableRow-root:not(.MuiTableRow-head)';
    const baitInfoCellIndex = 5;
    const baitLabelContainerSelector = 'div.MuiAvatar-root[aria-label]';

    // 钓饵统计Set
    let uniqueBaitNames = new Set();
    // 已处理的行Set，用于跟踪已处理的DOM行元素
    let processedRows = new Set();

    let tableBodyObserverInstance = null;
    let isTableBodyObserverSetup = false;

    // --- 辅助函数 ---
    const createNotification = (bait) => GM_notification({
        text: `[鱼糕V2] 钓饵 "${bait}" 已复制到剪贴板`,
        title: '提示',
        image: 'https://www.google.com/s2/favicons?sz=64@domain=ffmomola.com',
        timeout: 2000
    });

    /**
     * 处理单个钓鱼记录行，提取钓饵信息并添加到 uniqueBaitNames Set
     * @param {Element} recordRow 钓鱼记录的DOM行元素
     * @returns {boolean} 如果是新处理的行返回true，否则返回false
     */
    const processFishingRecordRow = (recordRow) => {
        if (processedRows.has(recordRow)) {
            return false;
        }
        processedRows.add(recordRow);

        const baitCell = recordRow.children[baitInfoCellIndex];
        if (baitCell) {
            const baitLabelContainer = baitCell.querySelector(baitLabelContainerSelector);
            if (baitLabelContainer) {
                const baitName = baitLabelContainer.getAttribute('aria-label');
                if (baitName && baitName !== '捕鱼人之识' && baitName !== '钓组') {
                    uniqueBaitNames.add(baitName);
                }
            }
        }
        return true;
    };

    /**
     * 扫描并显示钓饵统计
     * @param {boolean} clearBeforeScan 是否在扫描前清空所有现有统计数据
     */
    const scanAndDisplayBaitSummary = (clearBeforeScan = false) => {
        console.log(`[鱼糕V2] 正在扫描并显示钓饵统计 (清空模式: ${clearBeforeScan})`);

        const tableBodyElement = document.querySelector(tableBodySelector);
        if (!tableBodyElement) {
            console.warn("[鱼糕V2] 扫描时未找到 tbody.MuiTableBody-root 元素。");
            return;
        }

        if (clearBeforeScan) {
            console.log('[鱼糕V2] 清空现有统计数据以进行全新扫描。');
            uniqueBaitNames.clear();
            processedRows.clear();
        }

        const fishingRecordRows = tableBodyElement.querySelectorAll(fishingRecordRowSelector);
        let newRowsProcessedCount = 0;
        fishingRecordRows.forEach(row => {
            if (processFishingRecordRow(row)) {
                newRowsProcessedCount++;
            }
        });
        console.log(`[鱼糕V2] 本次扫描处理了 ${newRowsProcessedCount} 条新行。`);
        console.log(`[鱼糕V2] 当前总计找到 ${uniqueBaitNames.size} 种不同的钓饵。`);

        const targetContainerElement = tableBodyElement.closest('div.MuiPaper-root') || tableBodyElement.parentNode;
        if (!targetContainerElement) {
            console.error("[鱼糕V2] 未找到合适的插入目标容器，无法显示钓饵统计。");
            return;
        }

        const previousBaitTagsContainer = document.querySelector('div[data-script-version="鱼糕V2钓饵统计"]');
        if (previousBaitTagsContainer) {
            previousBaitTagsContainer.remove();
            console.log('[鱼糕V2] 已移除旧的钓饵统计容器。');
        }

        const baitTagsContainer = document.createElement('div');
        baitTagsContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 4px; padding: 8px';
        const fragment = document.createDocumentFragment();

        if (uniqueBaitNames.size === 0) {
            const noBaitTag = document.createElement('div');
            noBaitTag.textContent = "当前无钓饵数据";
            noBaitTag.style.cssText = `
                font-size: 14px;
                color: #aaa;
                padding: 0 12px;
            `;
            fragment.appendChild(noBaitTag);
        } else {
            const sortedBaitNames = Array.from(uniqueBaitNames).sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'));
            sortedBaitNames.forEach(bait => {
                const baitTagElement = document.createElement('div');
                baitTagElement.textContent = bait;
                baitTagElement.style.cssText = `
                    border-radius: 16px;
                    font-size: 14px;
                    height: 32px;
                    line-height: 32px;
                    color: #fff;
                    padding: 0 12px;
                    border: 1px solid #ffffff1f;
                    user-select: none;
                    background-color: #333333;
                    cursor: pointer;
                    transition: background-color 0.1s ease-in-out;
                `;
                baitTagElement.addEventListener('click', () => {
                    navigator.clipboard.writeText(bait).then(() => {
                        createNotification(bait);
                        const originalBackgroundColor = baitTagElement.style.backgroundColor;
                        baitTagElement.style.backgroundColor = '#555555';
                        setTimeout(() => {
                            baitTagElement.style.backgroundColor = originalBackgroundColor;
                        }, 500);
                    }).catch(err => {
                        console.error('[鱼糕V2] 复制到剪贴板失败: ', err);
                    });
                });
                fragment.appendChild(baitTagElement);
            });
        }

        baitTagsContainer.appendChild(fragment);
        baitTagsContainer.dataset.scriptVersion = '鱼糕V2钓饵统计';
        targetContainerElement.parentNode.insertBefore(baitTagsContainer, targetContainerElement);
        console.log('[鱼糕V2] 钓饵统计显示完毕。');
    };

    /**
     * 启动 tbody 的 MutationObserver，监听筛选操作
     */
    const setupTableBodyObserverForFilters = () => {
        const tableBodyElement = document.querySelector(tableBodySelector);
        if (!tableBodyElement) {
            console.error("[鱼糕V2] 尝试设置 tbody 观察者时未找到 tbody 元素。");
            return;
        }
        if (isTableBodyObserverSetup) {
            console.log('[鱼糕V2] tbody 观察者已设置，跳过重复设置。');
            return;
        }

        tableBodyObserverInstance = new MutationObserver((mutationsList, observer) => {
            // 在 MutationObserver 回调中，延迟执行，等待 DOM 稳定
            setTimeout(() => {
                // 此时用户执行了筛选，需要清空并重新扫描所有当前显示的行
                console.log('[鱼糕V2] 检测到 tbody 内容变化 (可能是筛选)，正在重新统计...');
                scanAndDisplayBaitSummary(true); // 强制清空并重新统计
            }, 100); // 稍微长一点的延迟，确保筛选后的 DOM 渲染稳定
        });

        tableBodyObserverInstance.observe(tableBodyElement, { childList: true });
        console.log(`[鱼糕V2] 成功启动 ${tableBodySelector} 的 MutationObserver，监听用户筛选操作。`);
        isTableBodyObserverSetup = true;
    };

    /**
     * 等待指定选择器元素出现，并可选择匹配文本内容
     * @param {string} selector 要等待的元素选择器 (例如 'tbody.MuiTableBody-root' 或 'button')
     * @param {number} timeout 最长等待时间（毫秒）
     * @param {string} [textContentMatch=''] 如果提供，元素必须包含此文本内容
     * @returns {Promise<Element|null>} 找到的元素或 null（超时）
     */
    const waitForElement = (selector, timeout = 5000, textContentMatch = '') => {
        return new Promise(resolve => {
            const startTime = Date.now();
            const checkElement = () => {
                const elements = document.querySelectorAll(selector);
                let foundElement = null;

                for (const element of elements) {
                    // 确保元素存在且可见
                    if (element && element.offsetParent !== null) {
                        // 如果有文本内容要求，检查是否包含该文本
                        if (textContentMatch) {
                            if (element.textContent.includes(textContentMatch)) {
                                foundElement = element;
                                break;
                            }
                        } else {
                            // 没有文本内容要求，只要找到可见元素即可
                            foundElement = element;
                            break;
                        }
                    }
                }

                if (foundElement) {
                    resolve(foundElement);
                    return;
                }

                if (Date.now() - startTime > timeout) {
                    console.log(`[鱼糕V2] 等待元素 ${selector} (文本: "${textContentMatch}") 超时 (${timeout}ms)。`);
                    resolve(null); // 超时未找到
                    return;
                }
                setTimeout(checkElement, 100); // 每100ms检查一次
            };
            checkElement();
        });
    };

    /**
     * 循环点击“加载更多”按钮直到其消失
     */
    const clickLoadMoreUntilGone = async () => {
        return new Promise(resolve => {
            const clickLoop = async () => {
                // 使用通用的 waitForElement 查找“加载更多”按钮
                const loadMoreButton = await waitForElement('button.MuiButtonBase-root, button.MuiButton-root', 1000, '加载更多');
                if (loadMoreButton) { // 检查按钮是否存在且可见
                    console.log('[鱼糕V2] 发现“加载更多”按钮，正在点击...');
                    loadMoreButton.click();
                    // 在点击后，等待一段时间让数据加载，然后递归调用
                    setTimeout(clickLoop, 500); // 0.5秒后再次检查
                } else {
                    console.log('[鱼糕V2] “加载更多”按钮未找到或已消失，所有记录可能已加载。');
                    resolve(); // 按钮消失，Promise 完成
                }
            };
            clickLoop();
        });
    };


    /**
     * 核心启动函数：按照逻辑顺序执行
     */
    const initializeAndProcessRecords = async () => {
        console.log('[鱼糕V2] 脚本核心流程启动。');

        // 第一步：等待 tbody.MuiTableBody-root 出现
        console.log('[鱼糕V2] 等待 tbody.MuiTableBody-root 元素出现...');
        // 使用通用 waitForElement，无需文本匹配
        const tableBodyElement = await waitForElement(tableBodySelector, 10000); // 最长等待10秒
        if (!tableBodyElement) {
            console.error("[鱼糕V2] 致命错误：tbody.MuiTableBody-root 元素在超时时间内未出现，脚本终止。");
            return;
        }
        console.log('[鱼糕V2] tbody.MuiTableBody-root 已出现。');

        // 第二步：尝试查找并点击“加载更多”按钮
        console.log('[鱼糕V2] 尝试查找“加载更多”按钮...');
        // 第一次查找，给足够时间让按钮刷新出来，并指定文本内容
        const initialLoadMoreButton = await waitForElement('button.MuiButtonBase-root, button.MuiButton-root', 5000, '加载更多'); // 给5秒时间查找初始按钮

        if (initialLoadMoreButton) {
            console.log('[鱼糕V2] 发现“加载更多”按钮，开始自动加载所有记录...');
            await clickLoadMoreUntilGone();
            console.log('[鱼糕V2] “加载更多”流程完成。');
        } else {
            console.log('[鱼糕V2] 未发现“加载更多”按钮，假定数据已全部加载或无更多数据。');
        }

        // 第三步：所有记录加载完毕（或无加载更多），执行第一次完整的钓饵统计
        console.log('[鱼糕V2] 执行首次完整钓饵统计。');
        scanAndDisplayBaitSummary(true); // 首次统计，清空并扫描所有当前已加载的行

        // 第四步：启动 tbody 的 MutationObserver，监听后续的筛选操作
        setupTableBodyObserverForFilters();
    };

    // --- 脚本入口 ---
    const startScript = () => {
        console.log('[鱼糕V2] 脚本入口开始');
        if (window.location.href.startsWith(fishingRecordsPageUrl)) {
            console.log('[鱼糕V2] 当前 URL 与钓鱼记录页面 URL 匹配。');
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initializeAndProcessRecords);
            } else {
                initializeAndProcessRecords();
            }
        } else {
            console.log(`[鱼糕V2] 当前 URL (${window.location.href}) 不是钓鱼记录页面 URL (${fishingRecordsPageUrl})，脚本将不会执行。`);
        }
    };

    startScript();
})();
