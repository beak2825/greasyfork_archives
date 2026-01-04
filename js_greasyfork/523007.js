// ==UserScript==
// @name         知识星球文章保存为PDF
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license     MIT
// @description  将知识星球文章保存为PDF
// @author       Your name
// @match        https://articles.zsxq.com/*.html
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js
// @downloadURL https://update.greasyfork.org/scripts/523007/%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E6%96%87%E7%AB%A0%E4%BF%9D%E5%AD%98%E4%B8%BAPDF.user.js
// @updateURL https://update.greasyfork.org/scripts/523007/%E7%9F%A5%E8%AF%86%E6%98%9F%E7%90%83%E6%96%87%E7%AB%A0%E4%BF%9D%E5%AD%98%E4%B8%BAPDF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建下载按钮
    function createDownloadButton() {
        const button = document.createElement('button');
        button.innerHTML = '下载PDF';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            z-index: 9999;
        `;

        button.addEventListener('click', generatePDF);
        document.body.appendChild(button);
    }

    // 生成PDF的函数
    async function generatePDF() {
        // 获取文章标题
        const titleElement = document.querySelector('.title.title-mark');
        const title = titleElement ? titleElement.textContent.trim() : '文章';

        // 获取文章内容
        const contentElement = document.querySelector('.content.ql-editor');
        if (!contentElement) {
            alert('未找到文章内容！');
            return;
        }

        // 创建一个新的div用于PDF生成
        const pdfContent = contentElement.cloneNode(true);

        // 添加标题到内容顶部
        const titleDiv = document.createElement('h1');
        titleDiv.textContent = title;
        pdfContent.insertBefore(titleDiv, pdfContent.firstChild);

        // PDF配置选项
        const opt = {
            margin: [10, 10],
            filename: `${title}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        try {
            // 生成PDF
            await html2pdf().set(opt).from(pdfContent).save();
        } catch (error) {
            console.error('PDF生成失败：', error);
            alert('PDF生成失败，请稍后重试！');
        }
    }

    // 等待页面加载完成后添加按钮
    window.addEventListener('load', createDownloadButton);
})();
