// ==UserScript==
// @name         Linux.do 精确书签提取器
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  基于实际HTML结构的精确书签提取器
// @author       You
// @match        https://linux.do/u/*/activity/bookmarks*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540537/Linuxdo%20%E7%B2%BE%E7%A1%AE%E4%B9%A6%E7%AD%BE%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/540537/Linuxdo%20%E7%B2%BE%E7%A1%AE%E4%B9%A6%E7%AD%BE%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let bookmarksData = [];
    let isExtracting = false;

    // 创建简洁的控制面板
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'precise-extractor-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            background: #fff;
            border: 2px solid #28a745;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
        `;

        panel.innerHTML = `
            <div style="margin-bottom: 10px; font-weight: bold; color: #28a745;">
                🎯 精确书签提取器
            </div>
            <div id="precise-status" style="margin-bottom: 10px; color: #666; font-size: 12px;">
                准备就绪
            </div>
            <div style="margin-bottom: 15px;">
                已提取: <span id="precise-count">0</span> 个书签
            </div>
            <button id="precise-extract" style="width: 100%; padding: 8px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; margin-bottom: 5px;">
                提取当前页面
            </button>
            <button id="precise-scroll" style="width: 100%; padding: 8px; background: #007cba; color: white; border: none; border-radius: 4px; cursor: pointer; margin-bottom: 5px;">
                滚动并提取全部
            </button>
            <button id="precise-export" style="width: 100%; padding: 8px; background: #ffc107; color: black; border: none; border-radius: 4px; cursor: pointer; margin-bottom: 5px;" disabled>
                导出JSON
            </button>
            <button id="precise-close" style="width: 100%; padding: 8px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">
                关闭
            </button>
        `;

        document.body.appendChild(panel);

        // 绑定事件
        document.getElementById('precise-extract').onclick = extractCurrentPage;
        document.getElementById('precise-scroll').onclick = extractWithScroll;
        document.getElementById('precise-export').onclick = exportData;
        document.getElementById('precise-close').onclick = () => panel.remove();
    }

    // 精确提取单个书签数据
    function extractPreciseBookmark(element) {
        try {
            const result = {
                title: '',
                url: '',
                category: '',
                tags: '',
                excerpt: '',
                extractedAt: new Date().toISOString()
            };

            // 提取标题和链接
            const titleLink = element.querySelector('a.title');
            if (titleLink) {
                result.url = titleLink.href;
                const titleSpan = titleLink.querySelector('span[dir="auto"]');
                result.title = titleSpan ? titleSpan.textContent.trim() : titleLink.textContent.trim();
            }

            // 提取分类
            const categoryElement = element.querySelector('.badge-category__name');
            if (categoryElement) {
                result.category = categoryElement.textContent.trim();
            }

            // 提取标签
            const tagElements = element.querySelectorAll('.discourse-tag');
            const tags = Array.from(tagElements).map(tag => tag.textContent.trim());
            result.tags = tags.join(', ');

            // 提取摘要内容
            const excerptElement = element.querySelector('.post-excerpt');
            if (excerptElement) {
                // 获取纯文本内容，去除HTML标签
                let excerptText = excerptElement.textContent || excerptElement.innerText || '';
                // 清理多余的空白字符
                excerptText = excerptText.replace(/\s+/g, ' ').trim();
                // 限制长度
                result.excerpt = excerptText.substring(0, 1000);
            }

            // 验证数据完整性
            if (result.title && result.url) {
                console.log('✅ 成功提取:', result.title);
                return result;
            } else {
                console.log('❌ 数据不完整:', { title: result.title, url: result.url });
                return null;
            }

        } catch (error) {
            console.error('❌ 提取出错:', error);
            return null;
        }
    }

    // 提取当前页面
    function extractCurrentPage() {
        updateStatus('正在提取当前页面...');

        // 查找所有书签元素
        const bookmarkElements = document.querySelectorAll('td.main-link.topic-list-data');
        console.log(`找到 ${bookmarkElements.length} 个书签元素`);

        let newCount = 0;

        bookmarkElements.forEach((element, index) => {
            const data = extractPreciseBookmark(element);
            if (data) {
                // 检查是否已存在（避免重复）
                const exists = bookmarksData.some(bookmark => bookmark.url === data.url);
                if (!exists) {
                    bookmarksData.push(data);
                    newCount++;
                }
            }
        });

        updateStatus(`提取完成: 新增 ${newCount} 个，总计 ${bookmarksData.length} 个`);
        updateCount();
        enableExport();
    }

    // 滚动并提取全部
    async function extractWithScroll() {
        if (isExtracting) return;

        isExtracting = true;
        document.getElementById('precise-scroll').disabled = true;

        updateStatus('开始滚动提取...');

        let scrollCount = 0;
        let lastHeight = document.body.scrollHeight;
        let noChangeCount = 0;
        const maxScrolls = 50;

        while (scrollCount < maxScrolls && noChangeCount < 3) {
            // 提取当前页面
            extractCurrentPage();

            // 滚动到底部
            window.scrollTo(0, document.body.scrollHeight);
            updateStatus(`滚动中... (${scrollCount + 1}/${maxScrolls})`);

            // 等待加载
            await sleep(3000);

            // 检查页面高度变化
            const newHeight = document.body.scrollHeight;
            if (newHeight === lastHeight) {
                noChangeCount++;
            } else {
                noChangeCount = 0;
                lastHeight = newHeight;
            }

            scrollCount++;
        }

        updateStatus(`滚动提取完成！共 ${bookmarksData.length} 个书签`);
        document.getElementById('precise-scroll').disabled = false;
        isExtracting = false;
    }

    // 导出数据
    function exportData() {
        if (bookmarksData.length === 0) {
            alert('没有数据可导出！');
            return;
        }

        // 创建导出数据
        const exportData = {
            extractedAt: new Date().toISOString(),
            totalCount: bookmarksData.length,
            bookmarks: bookmarksData
        };

        // 生成文件名
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
        const filename = `linux-do-bookmarks-${timestamp}.json`;

        // 下载文件
        const jsonStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        updateStatus(`已导出: ${filename}`);
    }

    // 辅助函数
    function updateStatus(message) {
        const statusEl = document.getElementById('precise-status');
        if (statusEl) statusEl.textContent = message;
        console.log('[精确提取器]', message);
    }

    function updateCount() {
        const countEl = document.getElementById('precise-count');
        if (countEl) countEl.textContent = bookmarksData.length;
    }

    function enableExport() {
        const exportBtn = document.getElementById('precise-export');
        if (exportBtn && bookmarksData.length > 0) {
            exportBtn.disabled = false;
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 初始化
    function init() {
        // 检查页面
        if (!window.location.href.includes('/activity/bookmarks')) {
            console.log('不在书签页面');
            return;
        }

        // 等待页面加载完成
        setTimeout(() => {
            createControlPanel();
            console.log('🎯 精确书签提取器已加载');

            // 自动进行一次测试提取
            setTimeout(() => {
                const testElements = document.querySelectorAll('td.main-link.topic-list-data');
                updateStatus(`检测到 ${testElements.length} 个书签元素`);
            }, 1000);

        }, 2000);
    }

    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
