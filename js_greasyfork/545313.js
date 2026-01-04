// ==UserScript==
// @license MIT
// @name         网页引用生成器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动生成网页引用的参考文献格式
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545313/%E7%BD%91%E9%A1%B5%E5%BC%95%E7%94%A8%E7%94%9F%E6%88%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/545313/%E7%BD%91%E9%A1%B5%E5%BC%95%E7%94%A8%E7%94%9F%E6%88%90%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建浮动按钮
    function createFloatingButton() {
        const button = document.createElement('button');
        button.innerHTML = '📚 生成引用';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: #4CAF50;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        `;
        
        // 悬停效果
        button.addEventListener('mouseenter', () => {
            button.style.background = '#45a049';
            button.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.background = '#4CAF50';
            button.style.transform = 'scale(1)';
        });
        
        button.addEventListener('click', generateCitation);
        document.body.appendChild(button);
    }

    // 提取网页标题
    function getTitle() {
        // 尝试多种方式获取标题
        const titleSelectors = [
            'h1',
            '[data-test="headline"]',
            '.title',
            '.headline',
            '.article-title',
            '.post-title',
            'title'
        ];
        
        for (const selector of titleSelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                return element.textContent.trim();
            }
        }
        
        // 如果都没找到，使用页面标题
        return document.title || '无标题';
    }

    // 提取文章日期
    function getDate() {
        // 常见的日期选择器
        const dateSelectors = [
            'time[datetime]',
            '[datetime]',
            '.date',
            '.publish-date',
            '.article-date',
            '.post-date',
            '[data-test="timestamp"]',
            '.timestamp',
            'meta[property="article:published_time"]',
            'meta[name="date"]',
            'meta[name="publishdate"]'
        ];
        
        for (const selector of dateSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                let dateText = element.getAttribute('datetime') || 
                              element.getAttribute('content') || 
                              element.textContent;
                
                if (dateText) {
                    // 尝试解析日期
                    const date = new Date(dateText.trim());
                    if (!isNaN(date.getTime())) {
                        return formatDate(date);
                    }
                }
            }
        }
        
        // 如果找不到日期，尝试从URL中提取
        const urlDateMatch = window.location.pathname.match(/(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
        if (urlDateMatch) {
            const [, year, month, day] = urlDateMatch;
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        
        // 如果都找不到，返回当前日期
        return formatDate(new Date());
    }

    // 格式化日期为 YYYY-MM-DD
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // 提取网站名
    function getSiteName() {
        // 尝试从meta标签获取
        const siteNameMeta = document.querySelector('meta[property="og:site_name"]') ||
                           document.querySelector('meta[name="application-name"]') ||
                           document.querySelector('meta[name="site_name"]');
        
        if (siteNameMeta && siteNameMeta.content) {
            return siteNameMeta.content;
        }
        
        // 从hostname提取
        const hostname = window.location.hostname;
        
        // 移除常见前缀
        let siteName = hostname.replace(/^(www\.|m\.|mobile\.)/, '');
        
        // 特殊网站处理
        const siteMap = {
            'zhihu.com': '知乎',
            'weibo.com': '微博',
            'bilibili.com': '哔哩哔哩',
            'jianshu.com': '简书',
            'csdn.net': 'CSDN',
            'cnblogs.com': '博客园',
            'segmentfault.com': 'SegmentFault',
            'github.com': 'GitHub',
            'stackoverflow.com': 'Stack Overflow',
            'baidu.com': '百度',
            'google.com': 'Google'
        };
        
        for (const [domain, name] of Object.entries(siteMap)) {
            if (siteName.includes(domain)) {
                return name;
            }
        }
        
        // 首字母大写
        return siteName.split('.')[0].charAt(0).toUpperCase() + siteName.split('.')[0].slice(1);
    }

    // 生成引用
    function generateCitation() {
        const title = getTitle();
        const date = getDate();
        const siteName = getSiteName();
        const url = window.location.href;
        
        // 按照要求的格式：网页文章标题. 文章日期. 网站名. 网址
        const citation = `${title}. ${date}. ${siteName}. ${url}`;
        
        // 创建弹窗显示引用
        showCitationModal(citation, {title, date, siteName, url});
    }

    // 显示引用弹窗
    function showCitationModal(citation, details) {
        // 创建模态框
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 20000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 10px;
            max-width: 600px;
            width: 90%;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;
        
        modalContent.innerHTML = `
            <h3 style="margin-top: 0; color: #333;">生成的引用格式</h3>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
                <textarea readonly style="width: 100%; height: 80px; border: none; background: transparent; font-family: monospace; resize: none;">${citation}</textarea>
            </div>
            <details style="margin: 15px 0;">
                <summary style="cursor: pointer; font-weight: bold;">查看提取的信息</summary>
                <div style="margin-top: 10px; font-size: 14px; color: #666;">
                    <p><strong>标题:</strong> ${details.title}</p>
                    <p><strong>日期:</strong> ${details.date}</p>
                    <p><strong>网站:</strong> ${details.siteName}</p>
                    <p><strong>网址:</strong> ${details.url}</p>
                </div>
            </details>
            <div style="text-align: right; margin-top: 20px;">
                <button id="copyBtn" style="background: #2196F3; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 10px;">复制</button>
                <button id="closeBtn" style="background: #666; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">关闭</button>
            </div>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // 复制功能
        modalContent.querySelector('#copyBtn').addEventListener('click', () => {
            const textarea = modalContent.querySelector('textarea');
            textarea.select();
            navigator.clipboard.writeText(citation).then(() => {
                const btn = modalContent.querySelector('#copyBtn');
                btn.textContent = '已复制!';
                btn.style.background = '#4CAF50';
                setTimeout(() => {
                    btn.textContent = '复制';
                    btn.style.background = '#2196F3';
                }, 2000);
            });
        });
        
        // 关闭功能
        const closeModal = () => {
            document.body.removeChild(modal);
        };
        
        modalContent.querySelector('#closeBtn').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        // ESC键关闭
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        });
    }

    // 页面加载完成后创建按钮
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createFloatingButton);
    } else {
        createFloatingButton();
    }

    // 添加快捷键支持 (Ctrl+Shift+C)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            generateCitation();
        }
    });

})();