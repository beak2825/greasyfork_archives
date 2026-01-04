// ==UserScript==
// @name         T00ls文章下载器
// @namespace    https://www.apibug.com/
// @version      2.1
// @description  T00ls文章下载器-支持Markdown和PDF
// @author       Apibug
// @match        *://www.t00ls.com/*
// @match        *://t00ls.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542885/T00ls%E6%96%87%E7%AB%A0%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/542885/T00ls%E6%96%87%E7%AB%A0%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 立即执行，不等待任何事件

    // 使用浏览器打印功能生成PDF
    function generatePDFViaPrint() {
        const info = getArticleInfo();
        const content = getArticleContent();

        // 创建新窗口用于打印
        const printWindow = window.open('', '_blank');

        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${info.title}</title>
    <style>
        body {
            font-family: Arial, "Microsoft YaHei", sans-serif;
            line-height: 1.6;
            margin: 40px;
            color: #333;
        }
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }
        .meta {
            background: #f8f9fa;
            padding: 15px;
            border-left: 4px solid #007cff;
            margin: 20px 0;
        }
        .content {
            margin-top: 30px;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        @media print {
            body { margin: 20px; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <h1>${info.title}</h1>

    <div class="meta">
        <strong>作者：</strong>${info.author}<br>
        <strong>来源：</strong>T00ls论坛<br>
        <strong>链接：</strong>${window.location.href}
    </div>

    <div class="content">${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>

    <div class="no-print" style="position: fixed; top: 10px; right: 10px; background: #007cff; color: white; padding: 10px; border-radius: 5px;">
        <button onclick="window.print()" style="background: white; color: #007cff; border: none; padding: 8px 15px; border-radius: 3px; cursor: pointer; margin-right: 5px;">📄 打印/保存为PDF</button>
        <button onclick="window.close()" style="background: #dc3545; color: white; border: none; padding: 8px 15px; border-radius: 3px; cursor: pointer;">❌ 关闭</button>
    </div>
</body>
</html>`;

        printWindow.document.write(htmlContent);
        printWindow.document.close();

        // 等待内容加载后自动打开打印对话框
        setTimeout(() => {
            printWindow.focus();
            printWindow.print();
        }, 500);
    }

    // 创建下载按钮
    function createButton() {
        // 检查是否已存在
        if (document.getElementById('simple-t00ls-btn')) {
            return;
        }

        // 创建按钮容器
        const btn = document.createElement('div');
        btn.id = 'simple-t00ls-btn';
        btn.innerHTML = `
            <div style="
                position: fixed;
                top: 50px;
                right: 50px;
                z-index: 999999;
                background: white;
                padding: 15px;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                border: 2px solid #007cff;
                font-family: Arial, sans-serif;
            ">
                <div style="font-size: 14px; font-weight: bold; margin-bottom: 10px; text-align: center; color: #333;">
                    📄 T00ls下载器
                </div>
                <button onclick="downloadMarkdown()" style="
                    display: block;
                    width: 100%;
                    padding: 8px 12px;
                    margin: 3px 0;
                    background: #007cff;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 13px;
                ">📝 下载Markdown</button>
                <button onclick="downloadPDF()" style="
                    display: block;
                    width: 100%;
                    padding: 8px 12px;
                    margin: 3px 0;
                    background: #d73a49;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 13px;
                ">📄 生成PDF</button>
            </div>
        `;

        document.body.appendChild(btn);
        console.log('按钮已添加');
    }

    // 获取文章信息
    function getArticleInfo() {
        // 获取帖子标题 - 尝试多种选择器
        let title = '未知标题';
        const titleSelectors = [
            '#threadtitle h1',           // T00ls主要标题选择器
            '.threadtitle h1',
            'h1[id^="thread_subject"]',
            '.postmessage h1:first-child',
            'h1'
        ];

        for (let selector of titleSelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                title = element.textContent.trim();
                // 移除可能的前缀标签如 [原创]、[转载] 等
                title = title.replace(/^\[.*?\]\s*/, '');
                console.log('找到标题:', title, '使用选择器:', selector);
                break;
            }
        }

        // 如果还是没找到，从页面标题中提取
        if (title === '未知标题') {
            const pageTitle = document.title;
            if (pageTitle && pageTitle.includes(' - ')) {
                title = pageTitle.split(' - ')[0].trim();
                title = title.replace(/^\[.*?\]\s*/, '');
            }
        }

        // 获取作者
        let author = '未知作者';
        const authorSelectors = [
            '.postauthor .postinfo a',
            '.postauthor a',
            '.author a'
        ];

        for (let selector of authorSelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                author = element.textContent.trim();
                break;
            }
        }

        // 清理标题中的特殊字符，用于文件名
        const cleanTitle = title.replace(/[<>:"/\\|?*]/g, '_').substring(0, 100);

        return { title, author, cleanTitle };
    }

    // 获取文章内容
    function getArticleContent() {
        const contentSelectors = [
            '.postmessage',
            '.t_msgfont',
            '.message',
            '#postmessage_1',
            '.content'
        ];

        for (let selector of contentSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                console.log('找到内容元素，使用选择器:', selector);
                return element.innerText || element.textContent;
            }
        }

        return document.body.innerText;
    }

    // 下载Markdown
    window.downloadMarkdown = function() {
        try {
            const info = getArticleInfo();
            const content = getArticleContent();

            // 创建Markdown内容
            const markdown = `# ${info.title}\n\n` +
                           `> **作者：** ${info.author}\n` +
                           `> **来源：** T00ls论坛\n` +
                           `> **链接：** ${window.location.href}\n\n` +
                           `---\n\n${content}`;

            // 下载文件
            const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `${info.cleanTitle}.md`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error(error);
        }
    };

    // 生成PDF（使用浏览器打印功能）
    window.downloadPDF = function() {
        try {
            alert('即将打开新窗口，请在新窗口中点击"打印/保存为PDF"按钮，然后选择"保存为PDF"');
            setTimeout(() => {
                generatePDFViaPrint();
            }, 1000);
        } catch (error) {
            alert('PDF生成失败：' + error.message);
            console.error(error);
        }
    };

    // 多种方式确保按钮显示
    createButton();
    setTimeout(createButton, 500);
    setTimeout(createButton, 1000);
    setTimeout(createButton, 2000);

    // 监听页面变化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createButton);
    }

    window.addEventListener('load', createButton);

    console.log('Apibug-T00ls文章下载器加载完成');

})();
