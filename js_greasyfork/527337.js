// ==UserScript==
// @name         JavDB 番号磁链批量获取
// @namespace    http://tampermonkey.net/
// @version      0.4.0 // 版本号更新
// @description  Magnet Link Batch Retrieval with prioritize Chinese Subtitles and Uncensored
// @author       0x0413
// @match        https://javdb.com/*
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.deleteValue
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @connect      javdb.com
// @downloadURL https://update.greasyfork.org/scripts/527337/JavDB%20%E7%95%AA%E5%8F%B7%E7%A3%81%E9%93%BE%E6%89%B9%E9%87%8F%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/527337/JavDB%20%E7%95%AA%E5%8F%B7%E7%A3%81%E9%93%BE%E6%89%B9%E9%87%8F%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义正则
    // 中字正则：匹配中文、中字、字幕、[hdc]系列、或包含特定缩写（如 uc, c, ch, cu, zh）且后面不是字母的情况
    const RE_CHINESE_SUB = /中文|中字|字幕|\[[a-z]?hdc[a-z]?\]|[-_\s]+(uc|c|ch|cu|zh)(?![a-z])/i;
    // 破解正则：匹配无码、流出、破解、解密版、uncensored、破一-鿆版、或包含特定缩写（如 cu, u, uc）且后面不是字母的情况
    const RE_UNCENSORED = /无码|無碼|流出|破解|解密版|uncensored|破[一-鿆]版|[-_\s]+(cu|u|uc)(?![a-z])/i;

    // 全局变量，存储优先选择状态
    let prioritizeChineseSub = false;
    let prioritizeUncensored = false;

    // 数据持久化管理 (简化 Util 和 Storage 为一个统一的 Storage 对象)
    class Storage {
        static async getValue(key, defaultValue = null) {
            try {
                if (typeof GM !== 'undefined' && GM.getValue) {
                    return await GM.getValue(key, defaultValue);
                } else if (typeof GM_getValue !== 'undefined') {
                    // Fallback for older GM_ functions, but GM.getValue is preferred
                    return GM_getValue(key, defaultValue);
                }
                return defaultValue;
            } catch (err) {
                console.error(`Failed to get value for key ${key}:`, err);
                return defaultValue;
            }
        }

        static async setValue(key, value) {
            try {
                if (typeof GM !== 'undefined' && GM.setValue) {
                    await GM.setValue(key, value);
                } else if (typeof GM_setValue !== 'undefined') {
                    // Fallback for older GM_ functions
                    GM_setValue(key, value);
                }
                return true;
            } catch (err) {
                console.error(`Failed to set value for key ${key}:`, err);
                return false;
            }
        }

        static async deleteValue(key) {
            try {
                if (typeof GM !== 'undefined' && GM.deleteValue) {
                    await GM.deleteValue(key);
                } else if (typeof GM_deleteValue !== 'undefined') {
                    // Fallback for older GM_ functions
                    GM_deleteValue(key);
                }
                return true;
            } catch (err) {
                console.error(`Failed to delete value for key ${key}:`, err);
                return false;
            }
        }
    }

    // 创建一个固定在右上角的容器
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '40px';
    container.style.right = '10px';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'flex-end';
    container.style.gap = '8px'; // 按钮和复选框之间的间距
    document.body.appendChild(container);

    // 创建主按钮
    const button = document.createElement('button');
    button.textContent = '复制所有页面番号磁链';
    button.style.backgroundColor = '#1a1a1a';
    button.style.color = '#ffffff';
    button.style.padding = '8px 16px';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.fontSize = '14px';
    button.style.fontWeight = '600';
    button.style.cursor = 'pointer';
    button.style.transition = 'all 0.3s ease';
    container.appendChild(button);

    // 添加悬停效果
    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = '#333333';
    });
    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = '#1a1a1a';
    });

    // 添加进度显示样式
    const updateButtonProgress = (text, isProcessing = false) => {
        button.textContent = text;
        if (isProcessing) {
            button.style.backgroundColor = '#2c5282';
            button.style.color = '#ffffff';
        } else {
            button.style.backgroundColor = '#1a1a1a';
            button.style.color = '#ffffff';
        }
    };

    // 辅助函数：创建带标签的复选框
    function createCheckbox(labelText, storageKey, initialValue, onChangeCallback) {
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.backgroundColor = '#1a1a1a';
        wrapper.style.padding = '6px 10px';
        wrapper.style.borderRadius = '4px';
        wrapper.style.color = '#ffffff';
        wrapper.style.fontSize = '13px';
        wrapper.style.whiteSpace = 'nowrap'; // 防止文字换行

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `javdb_checkbox_${storageKey}`;
        checkbox.style.marginRight = '8px';
        checkbox.style.cursor = 'pointer';
        checkbox.checked = initialValue;

        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = labelText;
        label.style.cursor = 'pointer';

        checkbox.addEventListener('change', async () => {
            await Storage.setValue(storageKey, checkbox.checked);
            onChangeCallback(checkbox.checked);
        });

        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);
        container.appendChild(wrapper);

        return checkbox;
    }

    // 初始化并创建复选框
    async function initializeCheckboxes() {
        prioritizeChineseSub = await Storage.getValue('prioritizeChineseSub', false);
        prioritizeUncensored = await Storage.getValue('prioritizeUncensored', false);

        createCheckbox('优先获取 [中字]', 'prioritizeChineseSub', prioritizeChineseSub, (checked) => {
            prioritizeChineseSub = checked;
        });
        createCheckbox('优先获取 [破解]', 'prioritizeUncensored', prioritizeUncensored, (checked) => {
            prioritizeUncensored = checked;
        });
    }

    initializeCheckboxes();

    // 延时函数
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    // 请求队列管理
    class RequestQueue {
        constructor(concurrency = 3) {
            this.concurrency = concurrency;
            this.running = 0;
            this.queue = [];
        }

        async add(task) {
            if (this.running >= this.concurrency) {
                await new Promise(resolve => this.queue.push(resolve));
            }
            this.running++;
            try {
                return await task();
            } finally {
                this.running--;
                if (this.queue.length > 0) {
                    const next = this.queue.shift();
                    next();
                }
            }
        }
    }

    // 使用GM_xmlhttpRequest获取页面内容
    function fetchPage(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                timeout: 30000,
                onload: response => {
                    if (response.status >= 200 && response.status < 300) {
                        resolve(response.responseText);
                    } else {
                        reject(new Error(`HTTP ${response.status}: ${response.statusText} for ${url}`));
                    }
                },
                onerror: error => reject(error),
                ontimeout: () => reject(new Error(`Request timeout for ${url}`))
            });
        });
    }

    /**
     * 根据优先级选择最佳磁力链接
     * @param {NodeList} magnetLinks 磁力链接的DOM元素列表
     * @param {boolean} prioritizeUncensored 是否优先选择破解版
     * @param {boolean} prioritizeChineseSub 是否优先选择中字版
     * @returns {string} 最佳磁力链接，未找到则返回空字符串
     */
    function selectBestMagnet(magnetLinks, prioritizeUncensored, prioritizeChineseSub) {
        let bestMagnet = '';
        let bestScore = -1; // 评分越高优先级越高

        // 定义评分规则
        // 0: 默认（无优先级匹配）
        // 1: 中字匹配
        // 2: 破解匹配
        // 3: 破解 + 中字 匹配 (因为 2+1)

        for (const linkElement of magnetLinks) {
            const linkText = linkElement.textContent;
            const magnetUrl = linkElement.href.split('&dn=')[0]; // 只取磁力链接本身，不包含文件名参数

            let currentScore = 0;
            let isUncensoredMatch = false;
            let isChineseSubMatch = false;

            if (prioritizeUncensored && RE_UNCENSORED.test(linkText)) {
                currentScore += 2; // 破解优先级更高
                isUncensoredMatch = true;
            }
            if (prioritizeChineseSub && RE_CHINESE_SUB.test(linkText)) {
                currentScore += 1;
                isChineseSubMatch = true;
            }

            // 如果当前链接的评分高于之前的最佳评分，则更新
            if (currentScore > bestScore) {
                bestScore = currentScore;
                bestMagnet = magnetUrl;
            }

            // 如果已经找到了最高优先级的组合（同时满足破解和中字），则可以直接返回
            if (bestScore === 3 && prioritizeUncensored && prioritizeChineseSub) {
                return bestMagnet;
            }
        }

        // 如果没有找到符合优先级的链接，或者没有设置优先级，则返回第一个链接作为默认
        if (bestMagnet === '' && magnetLinks.length > 0) {
             // 如果没有任何符合优先级的链接被选中，或者没有设置任何优先级，则选择第一个链接
            // 如果 bestMagnet 仍然是空字符串，意味着没有通过 score 选到任何一个，
            // 此时应该回退到磁链列表中的第一个。
            return magnetLinks[0].href.split('&dn=')[0];
        }

        return bestMagnet;
    }


    // 获取单个页面的所有视频代码和磁力链接
    async function getPageCodes(url, queue, updateProgress) {
        const maxRetries = 3;
        const delayBetweenRequests = 1000; // 1秒延时
        const results = [];
        const failedItems = [];

        try {
            // 从缓存中获取数据
            const cacheKey = `cache_${url}_${prioritizeUncensored ? 'U' : ''}${prioritizeChineseSub ? 'C' : ''}`; // 缓存键加入优先级设置
            const cachedData = await Storage.getValue(cacheKey);
            if (cachedData) {
                console.log(`Using cached data for ${url} (Filters: U=${prioritizeUncensored}, C=${prioritizeChineseSub})`);
                // updateProgress(cachedData.length); // 缓存数据不需要更新每项进度
                return cachedData;
            }

            // 获取页面内容并解析
            const text = await queue.add(() => fetchPage(url));
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');

            // 获取所有视频项
            const items = doc.querySelectorAll('.item');

            // 遍历每个视频项
            for (const item of items) {
                // 获取视频代码
                const codeElement = item.querySelector('.video-title strong');
                const code = codeElement ? codeElement.textContent.trim() : '';

                // 获取视频详情页链接
                const detailLink = item.querySelector('a.box');
                if (detailLink && code) {
                    // 构建完整的详情页URL
                    const detailUrl = new URL(detailLink.href, url).href;
                    let magnet = '';
                    let success = false;

                    // 重试机制
                    for (let retry = 0; retry < maxRetries && !success; retry++) {
                        try {
                            if (retry > 0) {
                                await sleep(delayBetweenRequests * retry); // 重试时增加延时
                            }

                            // 获取详情页内容
                            const detailText = await queue.add(() => fetchPage(detailUrl));
                            const detailDoc = parser.parseFromString(detailText, 'text/html');

                            // 获取所有磁力链接
                            const magnetLinks = detailDoc.querySelectorAll('.magnet-name a[href^="magnet:"]');
                            if (magnetLinks.length > 0) {
                                // 使用 selectBestMagnet 函数选择最佳磁力链接
                                magnet = selectBestMagnet(magnetLinks, prioritizeUncensored, prioritizeChineseSub);
                                success = true;
                            }
                        } catch (err) {
                            console.error(`重试 ${retry + 1}/${maxRetries} 获取磁力链接失败 (URL: ${detailUrl}):`, err);
                            if (retry === maxRetries - 1) {
                                failedItems.push({ code, url: detailUrl, error: err.message });
                            }
                        }
                    }

                    // 将结果添加到数组中
                    results.push(`${code}\n${magnet || '未找到磁力链接'}\n-------------------`);
                    // 实时更新进度
                    updateProgress(1);
                }

                // 添加请求间隔，避免请求过快
                await sleep(delayBetweenRequests);
            }

            // 如果有失败项，记录到控制台
            if (failedItems.length > 0) {
                console.warn('以下项目未能成功获取磁力链接:', failedItems);
            }

            // 缓存结果
            await Storage.setValue(cacheKey, results);

            return results;
        } catch (err) {
            console.error('获取页面失败:', err);
            throw err;
        }
    }

    // 获取分页列表中的所有页面链接
    function getAllPageUrls() {
        const pageLinks = document.querySelectorAll('.pagination-list .pagination-link');
        const urls = Array.from(pageLinks).map(link => link.href);
        const uniqueUrls = [...new Set(urls)]; // 去除重复的URL
        return uniqueUrls;
    }

    // 按钮点击事件处理
    button.addEventListener('click', async function() {
        // 禁用按钮并显示进度
        button.disabled = true;
        updateButtonProgress('正在获取中...', true);
        try {
            // 创建请求队列
            const queue = new RequestQueue(3); // 建议并发数不要太高，避免被封IP

            // 获取所有分页URL
            const urls = getAllPageUrls();
            const currentUrl = window.location.href;
            // 确保当前页面URL也包含在内，并放在最前面
            if (!urls.includes(currentUrl)) {
                urls.unshift(currentUrl);
            }

            // 获取所有页面的结果
            const allResults = [];
            const totalPages = urls.length;
            let processedItems = 0;
            console.log(`总共需要处理 ${totalPages} 页`);

            let currentPage = 0;
            const updateItemProgress = (count) => {
                processedItems += count;
                updateButtonProgress(`已获取 ${processedItems} 个视频信息 (处理第 ${currentPage}/${totalPages} 页)...`, true);
            };

            for (let i = 0; i < totalPages; i++) {
                currentPage = i + 1;
                const url = urls[i];
                console.log(`正在处理第 ${currentPage}/${totalPages} 页: ${url}`);
                const results = await getPageCodes(url, queue, updateItemProgress);
                allResults.push(...results);
            }

            // 合并所有结果并复制到剪贴板
            const text = allResults.join('\n');
            await navigator.clipboard.writeText(text);
            alert(`已成功复制 ${allResults.length} 个结果！`);
        } catch (err) {
            console.error('获取失败:', err);
            alert('获取失败，请查看控制台了解详情。');
        } finally {
            // 恢复按钮状态
            button.disabled = false;
            button.textContent = '复制所有页面番号磁链';
        }
    });
})();