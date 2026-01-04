// ==UserScript==
// @name        国家中小学智慧平台教材下载器
// @namespace    http://tampermonkey.net/
// @version      2025-07-14
// @description  账号登录国家中小学智慧平台后，打开对应教材阅读界面，添加下载按钮
// @author       You
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542534/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E5%B9%B3%E5%8F%B0%E6%95%99%E6%9D%90%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/542534/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E5%B9%B3%E5%8F%B0%E6%95%99%E6%9D%90%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待PDF查看器加载完成
    function waitForPDFViewer() {
        if (window.PDFViewerApplication && window.PDFViewerApplication.pdfDocument) {
            addDownloadButton();
        } else {
            setTimeout(waitForPDFViewer, 500);
        }
    }

    // 添加下载按钮
    function addDownloadButton() {
        // 创建下载按钮
        const button = document.createElement('button');
        button.textContent = '&#128229; 下载PDF';
        button.style.position = 'fixed';
        button.style.top = '20px';
        button.style.right = '20px';
        button.style.zIndex = '9999';
        button.style.padding = '10px 15px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

        // 添加悬停效果
        button.onmouseover = function() {
            button.style.backgroundColor = '#45a049';
        };

        button.onmouseout = function() {
            button.style.backgroundColor = '#4CAF50';
        };

        // 添加点击事件
        button.onclick = async function() {
            try {
                // 禁用按钮防止重复点击
                button.disabled = true;
                button.textContent = '下载中...';

                // 获取PDF数据并下载
                const data = await window.PDFViewerApplication.pdfDocument._transport.getData();
                const blob = new Blob([data], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);

                // 创建下载链接
                const a = document.createElement('a');
                a.href = url;
                a.download = getPDFFilename() || 'document.pdf';
                document.body.appendChild(a);
                a.click();

                // 清理
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                // 恢复按钮状态
                button.disabled = false;
                button.textContent = '&#128229; 下载PDF';

                // 显示下载成功提示
                showNotification('下载已开始');
            } catch (error) {
                console.error('PDF下载失败:', error);
                button.disabled = false;
                button.textContent = '&#128229; 下载PDF';
                showNotification('下载失败: ' + error.message, true);
            }
        };

        // 将按钮添加到页面
        document.body.appendChild(button);

        // 显示提示
        showNotification('PDF下载按钮已添加');
    }

    // 获取PDF文件名
    function getPDFFilename() {
        try {
            // 尝试从URL获取文件名
            const url = window.location.href;
            const filenameMatch = url.match(/\/([^/?#]+)\.pdf/i);
            if (filenameMatch && filenameMatch[1]) {
                return decodeURIComponent(filenameMatch[1]) + '.pdf';
            }

            // 尝试从PDF元数据获取标题
            if (window.PDFViewerApplication && window.PDFViewerApplication.metadata) {
                const metadata = window.PDFViewerApplication.metadata.get('info');
                if (metadata && metadata.Title) {
                    return metadata.Title + '.pdf';
                }
            }

            return null;
        } catch (error) {
            console.warn('无法获取PDF文件名:', error);
            return null;
        }
    }

    // 显示通知提示
    function showNotification(message, isError = false) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.zIndex = '9999';
        notification.style.padding = '10px 15px';
        notification.style.borderRadius = '4px';
        notification.style.color = 'white';
        notification.style.backgroundColor = isError ? '#f44336' : '#2196F3';
        notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';

        document.body.appendChild(notification);

        // 淡入效果
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);

        // 3秒后淡出并移除
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // 启动脚本
    waitForPDFViewer();
})();