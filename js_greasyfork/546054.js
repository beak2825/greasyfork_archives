// ==UserScript==
// @name         应用宝APK下载助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为应用宝添加直接下载按钮和复制下载链接功能，支持详情页和搜索页
// @author       你的名字
// @match        https://sj.qq.com/appdetail/*
// @match        https://sj.qq.com/search*
// @icon         https://sj.qq.com/favicon.ico
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/546054/%E5%BA%94%E7%94%A8%E5%AE%9DAPK%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/546054/%E5%BA%94%E7%94%A8%E5%AE%9DAPK%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 生成带下载参数的URL
    function getDownloadUrl(originalUrl) {
        // 移除可能已存在的参数
        const baseUrl = originalUrl.split('?')[0];
        return `${baseUrl}?landing_type=yybclient`;
    }

    // 创建通知提示
    function showNotification(message, type = 'info') {
        // 移除已存在的通知
        const oldNotify = document.querySelector('.yyb-download-notify');
        if (oldNotify) oldNotify.remove();

        const notify = document.createElement('div');
        notify.className = 'yyb-download-notify';
        notify.textContent = message;

        // 根据类型设置样式
        const styles = {
            info: 'background-color: #2196F3;',
            success: 'background-color: #4CAF50;',
            warning: 'background-color: #FF9800;',
            error: 'background-color: #F44336;'
        };

        notify.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 99999;
            padding: 12px 20px;
            color: white;
            border-radius: 4px;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            ${styles[type] || styles.info}
            transition: opacity 0.3s ease;
        `;

        document.body.appendChild(notify);

        // 3秒后自动消失
        setTimeout(() => {
            notify.style.opacity = '0';
            setTimeout(() => notify.remove(), 300);
        }, 3000);
    }

    // 在应用详情页添加按钮
    function addDetailPageButtons() {
        const currentUrl = window.location.href;
        const downloadUrl = getDownloadUrl(currentUrl);
        const hasDownloadParam = currentUrl.includes('?landing_type=yybclient');

        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            gap: 10px;
        `;

        if (!hasDownloadParam) {
            // 直接下载按钮
            const downloadBtn = document.createElement('button');
            downloadBtn.innerHTML = '📱 直接下载APK';
            downloadBtn.style.cssText = `
                padding: 10px 18px;
                background-color: #00C853;
                color: white;
                border: none;
                border-radius: 4px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 6px;
                transition: all 0.2s ease;
            `;

            downloadBtn.addEventListener('mouseover', () => {
                downloadBtn.style.backgroundColor = '#00A853';
                downloadBtn.style.transform = 'translateY(-1px)';
            });

            downloadBtn.addEventListener('mouseout', () => {
                downloadBtn.style.backgroundColor = '#00C853';
                downloadBtn.style.transform = 'translateY(0)';
            });

            downloadBtn.addEventListener('click', () => {
                window.location.href = downloadUrl;
                showNotification('正在跳转到下载页面...');
            });

            // 复制链接按钮
            const copyBtn = document.createElement('button');
            copyBtn.innerHTML = '🔗 复制下载链接';
            copyBtn.style.cssText = `
                padding: 10px 18px;
                background-color: #2196F3;
                color: white;
                border: none;
                border-radius: 4px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 6px;
                transition: all 0.2s ease;
            `;

            copyBtn.addEventListener('mouseover', () => {
                copyBtn.style.backgroundColor = '#1976D2';
                copyBtn.style.transform = 'translateY(-1px)';
            });

            copyBtn.addEventListener('mouseout', () => {
                copyBtn.style.backgroundColor = '#2196F3';
                copyBtn.style.transform = 'translateY(0)';
            });

            copyBtn.addEventListener('click', () => {
                GM_setClipboard(downloadUrl);
                showNotification('下载链接已复制到剪贴板', 'success');
            });

            buttonContainer.appendChild(downloadBtn);
            buttonContainer.appendChild(copyBtn);
            document.body.appendChild(buttonContainer);
        } else {
            // 已在下载模式
            const infoBtn = document.createElement('button');
            infoBtn.innerHTML = '✅ 下载模式已激活';
            infoBtn.style.cssText = `
                padding: 10px 18px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                font-size: 14px;
                font-weight: 500;
                cursor: default;
                display: flex;
                align-items: center;
                gap: 6px;
            `;

            buttonContainer.appendChild(infoBtn);
            document.body.appendChild(buttonContainer);

            // 检查是否有下载弹窗，如果没有则提示
            setTimeout(() => {
                if (!document.querySelector('iframe[src*="download"]')) {
                    showNotification('未检测到下载弹窗，可尝试复制链接在新窗口打开', 'warning');
                }
            }, 2000);
        }
    }

    // 在搜索结果页添加下载按钮
    function addSearchPageButtons() {
        // 找到所有应用卡片
        const appCards = document.querySelectorAll('.search-dl-btn');

        appCards.forEach(card => {
            // 获取应用详情页链接
            const detailLink = card.closest('.app-detail')?.querySelector('a')?.href;
            if (!detailLink || card.querySelector('.yyb-extra-btn')) return;

            const downloadUrl = getDownloadUrl(detailLink);

            // 创建下载按钮
            const downloadBtn = document.createElement('a');
            downloadBtn.className = 'yyb-extra-btn';
            downloadBtn.innerHTML = '直接下载';
            downloadBtn.href = downloadUrl;
            downloadBtn.target = '_blank';
            downloadBtn.style.cssText = `
                margin-left: 8px;
                padding: 4px 10px;
                background-color: #00C853;
                color: white;
                border-radius: 3px;
                font-size: 12px;
                text-decoration: none;
                transition: background-color 0.2s;
            `;

            downloadBtn.addEventListener('mouseover', () => {
                downloadBtn.style.backgroundColor = '#00A853';
            });

            downloadBtn.addEventListener('mouseout', () => {
                downloadBtn.style.backgroundColor = '#00C853';
            });

            downloadBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showNotification('正在打开下载页面...');
            });

            card.appendChild(downloadBtn);
        });
    }

    // 根据当前页面类型加载相应功能
    if (window.location.href.includes('appdetail')) {
        // 应用详情页
        addDetailPageButtons();
    } else if (window.location.href.includes('search')) {
        // 搜索结果页
        addSearchPageButtons();

        // 监听页面滚动，为动态加载的内容添加按钮
        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            // 避免频繁触发
            if (Math.abs(scrollTop - lastScrollTop) > 300) {
                addSearchPageButtons();
                lastScrollTop = scrollTop;
            }
        });
    }

})();
