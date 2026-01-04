// ==UserScript==
// @name         FOFA IP and Domain Extractor (Dark Tabbed) - Auto Refresh
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Extract IP:port and domains with dark themed tabbed interface, auto-refresh on pagination
// @author       zephyrus
// @match        https://fofa.info/result*
// @match        https://*.fofa.info/result*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_notification
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538391/FOFA%20IP%20and%20Domain%20Extractor%20%28Dark%20Tabbed%29%20-%20Auto%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/538391/FOFA%20IP%20and%20Domain%20Extractor%20%28Dark%20Tabbed%29%20-%20Auto%20Refresh.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom CSS styles (same as before)
    GM_addStyle(`
        .fofa-extractor-container {
            margin: 20px auto;
            font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
            width: 450px;
        }
        .fofa-tab-container {
            display: flex;
            flex-direction: column;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            background: #2d2d2d;
        }
        .fofa-tab-header {
            display: flex;
            background: #1e1e1e;
            border-bottom: 1px solid #3a3a3a;
            justify-content: space-between;
            align-items: center;
            padding-right: 15px;
        }
        .fofa-tabs {
            display: flex;
        }
        .fofa-tab {
            padding: 10px 20px;
            cursor: pointer;
            font-weight: 500;
            color: #aaa;
            transition: all 0.3s;
            border-right: 1px solid #3a3a3a;
            position: relative;
        }
        .fofa-tab:last-child {
            border-right: none;
        }
        .fofa-tab.active {
            color: #05f2f2;
            background: #2d2d2d;
        }
        .fofa-tab.active:after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            right: 0;
            height: 2px;
            background: #05f2f2;
        }
        .fofa-tab-badge {
            display: inline-block;
            padding: 2px 6px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            font-size: 12px;
            margin-left: 8px;
            color: #ddd;
        }
        .fofa-tab-content {
            display: none;
            background: #2d2d2d;
            padding: 15px;
        }
        .fofa-tab-content.active {
            display: block;
        }
        .fofa-content-box {
            max-height: 400px;
            overflow-y: auto;
            padding: 12px;
            background: #252525;
            border-radius: 4px;
            line-height: 1.6;
            white-space: pre;
            font-size: 13px;
            color: #e0e0e0;
            border: 1px solid #3a3a3a;
            font-family: 'Consolas', 'Monaco', monospace;
        }
        .fofa-toolbar {
            display: flex;
            align-items: center;
            color: #aaa;
            font-size: 13px;
            gap: 10px;
        }
        .fofa-copy-btn {
            padding: 6px 14px;
            background: #05f2f2;
            color: #111;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.2s;
            font-weight: 500;
        }
        .fofa-copy-btn:hover {
            background: #05e0e0;
        }
        .fofa-copy-btn.copied {
            background: #05a2a2;
            color: #fff;
        }
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #1e1e1e;
        }
        ::-webkit-scrollbar-thumb {
            background: #05f2f2;
            border-radius: 4px;
        }
        @media (max-width: 768px) {
            .fofa-extractor-container {
                width: 90%;
            }
            .fofa-tab-header {
                flex-wrap: wrap;
            }
            .fofa-tab {
                flex: 1 0 auto;
                text-align: center;
                padding: 8px 12px;
            }
        }
    `);

    // 主提取函数
    const extractData = () => {
        const items = Array.from(document.querySelectorAll(".hsxa-meta-data-item"));
        const domains = new Set();
        const ips = new Set();

        items.forEach(item => {
            // Extract domain with port
            const domainLink = item.querySelector(".hsxa-host a");
            const domain = domainLink?.textContent.trim().replace(/^https?:\/\//, "");
            const portElement = item.querySelector(".hsxa-port");
            const port = portElement ? atob(portElement.href.match(/qbase64=([^&]+)/)?.[1]).match(/port="([^"]+)"/)?.[1] : "";

            if (domain && port) {
                domains.add(`${domain}:${port}`);
            }

            // Extract IP with port
            const ipElement = item.querySelector(".hsxa-jump-a");
            const ip = ipElement ? atob(ipElement.href.match(/qbase64=([^&]+)/)?.[1]).match(/ip="([^"]+)"/)?.[1] : "";

            if (ip && port) {
                ips.add(`${ip}:${port}`);
            }
        });

        return {
            domains: Array.from(domains).sort(),
            ips: Array.from(ips).sort()
        };
    };

    // 创建标签页界面
    const createTabbedInterface = (ips, domains) => {
        const container = document.createElement('div');
        container.className = 'fofa-tab-container';

        // 创建标签头
        const tabHeader = document.createElement('div');
        tabHeader.className = 'fofa-tab-header';

        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'fofa-tabs';

        const ipTab = document.createElement('div');
        ipTab.className = 'fofa-tab active';
        ipTab.dataset.tab = 'ip';
        ipTab.innerHTML = `IP列表 <span class="fofa-tab-badge">${ips.length}</span>`;

        const domainTab = document.createElement('div');
        domainTab.className = 'fofa-tab';
        domainTab.dataset.tab = 'domain';
        domainTab.innerHTML = `域名列表 <span class="fofa-tab-badge">${domains.length}</span>`;

        tabsContainer.appendChild(ipTab);
        tabsContainer.appendChild(domainTab);
        tabHeader.appendChild(tabsContainer);

        // 创建工具栏
        const toolbar = document.createElement('div');
        toolbar.className = 'fofa-toolbar';

        const countInfo = document.createElement('div');
        countInfo.textContent = `IP: ${ips.length} | 域名: ${domains.length}`;

        const copyBtn = document.createElement('button');
        copyBtn.className = 'fofa-copy-btn';
        copyBtn.textContent = '复制当前';
        copyBtn.onclick = () => {
            const activeTab = container.querySelector('.fofa-tab.active').dataset.tab;
            const content = activeTab === 'ip' ? ips.join('\n') : domains.join('\n');
            GM_setClipboard(content);
            copyBtn.textContent = '已复制!';
            copyBtn.classList.add('copied');
            setTimeout(() => {
                copyBtn.textContent = '复制当前';
                copyBtn.classList.remove('copied');
            }, 2000);
        };

        toolbar.appendChild(countInfo);
        toolbar.appendChild(copyBtn);
        tabHeader.appendChild(toolbar);

        container.appendChild(tabHeader);

        // 创建标签内容
        const contentContainer = document.createElement('div');
        contentContainer.className = 'fofa-tab-contents';

        // IP 标签内容
        const ipContent = document.createElement('div');
        ipContent.className = 'fofa-tab-content active';
        ipContent.id = 'ip-tab';

        const ipContentBox = document.createElement('div');
        ipContentBox.className = 'fofa-content-box';
        ipContentBox.textContent = ips.join('\n');
        ipContent.appendChild(ipContentBox);

        // 域名标签内容
        const domainContent = document.createElement('div');
        domainContent.className = 'fofa-tab-content';
        domainContent.id = 'domain-tab';

        const domainContentBox = document.createElement('div');
        domainContentBox.className = 'fofa-content-box';
        domainContentBox.textContent = domains.join('\n');
        domainContent.appendChild(domainContentBox);

        contentContainer.appendChild(ipContent);
        contentContainer.appendChild(domainContent);
        container.appendChild(contentContainer);

        // 添加标签切换功能
        const tabs = container.querySelectorAll('.fofa-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // 更新活动标签
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // 更新活动内容
                const tabName = tab.dataset.tab;
                container.querySelectorAll('.fofa-tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                container.querySelector(`#${tabName}-tab`).classList.add('active');
            });
        });

        return container;
    };

    // 插入结果到页面
    const insertResults = () => {
        // 检查是否已经插入
        let extractorContainer = document.getElementById('fofa-extractor-container');

        // 如果结果列表不存在，移除提取器（如果有）
        if (!document.querySelector('.hsxa-meta-data-item')) {
            if (extractorContainer) {
                extractorContainer.remove();
            }
            return;
        }

        const { domains, ips } = extractData();

        // 如果没有数据，也移除提取器
        if (domains.length === 0 && ips.length === 0) {
            if (extractorContainer) {
                extractorContainer.remove();
            }
            return;
        }

        const targetElement = document.querySelector('div.contentContainer.resultIndex > div:nth-child(1) > div.relatedSearch');
        if (!targetElement) return;

        // 如果提取器已存在，更新内容
        if (extractorContainer) {
            const newContainer = createTabbedInterface(ips, domains);
            extractorContainer.replaceWith(newContainer);
            extractorContainer = newContainer;
            extractorContainer.id = 'fofa-extractor-container';
        } else {
            // 否则创建新的提取器
            extractorContainer = document.createElement('div');
            extractorContainer.id = 'fofa-extractor-container';
            extractorContainer.className = 'fofa-extractor-container';
            extractorContainer.appendChild(createTabbedInterface(ips, domains));
            targetElement.parentNode.insertBefore(extractorContainer, targetElement);
        }
    };

    // 使用 MutationObserver 监听结果列表的变化
    const observeResults = () => {
        const resultsContainer = document.querySelector('.hsxa-meta-table-list');
        if (!resultsContainer) {
            // 如果结果容器不存在，稍后重试
            setTimeout(observeResults, 500);
            return;
        }

        const observer = new MutationObserver((mutations) => {
            // 检查是否有子节点变化或属性变化（翻页时可能会重置整个容器）
            const needsUpdate = mutations.some(mutation =>
                mutation.type === 'childList' ||
                (mutation.type === 'attributes' && mutation.attributeName === 'class')
            );

            if (needsUpdate) {
                // 延迟执行以确保DOM完全更新
                setTimeout(insertResults, 300);
            }
        });

        // 开始观察结果容器
        observer.observe(resultsContainer, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });

        // 初始执行一次
        insertResults();
    };

    // 页面加载完成后开始观察
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(observeResults, 500);
    } else {
        window.addEventListener('DOMContentLoaded', () => {
            setTimeout(observeResults, 500);
        });
    }

    // 添加一个按钮点击事件监听器，因为FOFA可能在点击分页按钮时使用AJAX
    document.addEventListener('click', (e) => {
        if (e.target.closest('.ant-pagination-item, .ant-pagination-prev, .ant-pagination-next')) {
            // 分页按钮被点击，稍后检查更新
            setTimeout(insertResults, 1000);
        }
    });
})();