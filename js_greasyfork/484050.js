// ==UserScript==
// @name         批量处理图片链接插件
// @author       观察君
// @namespace    http://www.futa404.org/
// @version      1.3
// @description  批量处理图片链接的插件，微博图片外链失效，批量处理添加图片镜像缓存服务，图片链接处理后一键复制。
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/484050/%E6%89%B9%E9%87%8F%E5%A4%84%E7%90%86%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/484050/%E6%89%B9%E9%87%8F%E5%A4%84%E7%90%86%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储处理后的图片链接
    let processedLinks = [];

    // 在页面加载完成后执行
    window.addEventListener('load', function() {
        addBatchProcessingButton();
    });

    // 添加批量处理按钮
    function addBatchProcessingButton() {
        const batchProcessingButton = document.createElement('button');
        batchProcessingButton.textContent = '批量处理图片链接';
        batchProcessingButton.style.position = 'fixed';
        batchProcessingButton.style.top = 'calc(66% - 25px)';
        batchProcessingButton.style.right = '10px';
        batchProcessingButton.style.padding = '5px';
        batchProcessingButton.style.width = '120px'; // 调整按钮宽度
        batchProcessingButton.style.backgroundColor = '#3498db';
        batchProcessingButton.style.color = '#fff';
        batchProcessingButton.style.border = 'none';
        batchProcessingButton.style.borderRadius = '3px';
        batchProcessingButton.style.cursor = 'pointer';
        batchProcessingButton.addEventListener('click', showBatchProcessingPopup);
        document.body.appendChild(batchProcessingButton);
    }

    // 显示批量处理弹窗框
    
    function showBatchProcessingPopup() {
        const popupContainer = document.createElement('div');
        popupContainer.style.position = 'fixed';
        popupContainer.style.top = '50%';
        popupContainer.style.left = '50%';
        popupContainer.style.transform = 'translate(-50%, -50%)';
        popupContainer.style.maxWidth = '90%';
        popupContainer.style.width = 'auto';
        popupContainer.style.padding = '20px';
        popupContainer.style.backgroundColor = '#fff';
        popupContainer.style.border = '1px solid #ddd';
        popupContainer.style.zIndex = '9999';
        popupContainer.style.overflow = 'auto'; // 添加滚动条

        // 创建选择域名的下拉列表
        const domainSelect = document.createElement('select');
        domainSelect.style.marginBottom = '10px';
        const domains = [
            'https://i0.wp.com/',
            'https://i1.wp.com/',
            'https://i2.wp.com/',
            'https://i3.wp.com/',
            'https://cdn.cdnjson.com/'
        ];
        domains.forEach(domain => {
            const option = document.createElement('option');
            option.value = domain;
            option.textContent = domain;
            domainSelect.appendChild(option);
        });
        popupContainer.appendChild(domainSelect);

        // 创建文本区域用于粘贴图片链接
        const textarea = document.createElement('textarea');
        textarea.style.width = '100%';
        textarea.style.height = '150px';
        textarea.style.resize = 'vertical';
        textarea.placeholder = '粘贴图片链接，每行一个';
        popupContainer.appendChild(textarea);

        // 创建处理按钮
        const processButton = document.createElement('button');
        processButton.textContent = '开始处理';
        processButton.style.marginTop = '10px';
        processButton.style.padding = '10px';
        processButton.style.backgroundColor = '#2ecc71';
        processButton.style.color = '#fff';
        processButton.style.border = 'none';
        processButton.style.borderRadius = '3px';
        processButton.style.cursor = 'pointer';
        processButton.addEventListener('click', function() {
            const selectedDomain = domainSelect.value;
            processedLinks = processImageLinks(textarea.value.split('\n'), selectedDomain);
            displayProcessedLinks(processedLinks, popupContainer);
        });
        popupContainer.appendChild(processButton);

        // 创建复制按钮
        const copyButton = document.createElement('button');
        copyButton.textContent = '一键复制链接';
        copyButton.style.marginTop = '10px';
        copyButton.style.padding = '10px';
        copyButton.style.backgroundColor = '#e67e22';
        copyButton.style.color = '#fff';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '3px';
        copyButton.style.cursor = 'pointer';
        copyButton.addEventListener('click', function() {
            copyToClipboard(processedLinks.join('\n'));
        });
        popupContainer.appendChild(copyButton);

        // 创建关闭按钮
        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.marginTop = '10px';
        closeButton.style.padding = '10px';
        closeButton.style.backgroundColor = '#e74c3c';
        closeButton.style.color = '#fff';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '3px';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', function() {
            document.body.removeChild(popupContainer);
        });
        popupContainer.appendChild(closeButton);

        // 添加弹窗框到页面
        document.body.appendChild(popupContainer);
    }

    // 处理图片链接
    function processImageLinks(links, selectedDomain) {
        // 替换链接的逻辑
        return links.map(link => {
            // 使用正则表达式进行替换
            return link.replace(/^(https?:\/\/)/, selectedDomain);
        });
    }

    // 显示处理后的链接
    function displayProcessedLinks(processedLinks, container) {
        const resultContainer = document.createElement('div');
        resultContainer.style.marginTop = '20px';

        // 创建标题
        const title = document.createElement('h3');
        title.textContent = '批量处理后的图片链接:';
        resultContainer.appendChild(title);

        // 创建列表
        const list = document.createElement('ul');
        processedLinks.forEach(processedLink => {
            const listItem = document.createElement('li');
            listItem.textContent = processedLink;
            list.appendChild(listItem);
        });
        resultContainer.appendChild(list);

        // 将结果添加到弹窗框中
        container.appendChild(resultContainer);
    }

    // 复制到剪贴板
    function copyToClipboard(text) {
        const el = document.createElement('textarea');
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        alert('链接已复制到剪贴板！');
    }
})();
