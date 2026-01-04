// ==UserScript==
// @name          公需课考试题目导出工具
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动提取网页考试题目并添加导出按钮
// @author       YourName
// @match        *://127.0.0.1:5500/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526498/%E5%85%AC%E9%9C%80%E8%AF%BE%E8%80%83%E8%AF%95%E9%A2%98%E7%9B%AE%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/526498/%E5%85%AC%E9%9C%80%E8%AF%BE%E8%80%83%E8%AF%95%E9%A2%98%E7%9B%AE%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /****************** 配置区域 ******************/
    const config = {
        // DOM选择器配置
        examItemSelector: '.exam-list .exam-item',
        questionSelector: '.question',
        optionsContainerSelector: 'ul',
        optionItemSelector: 'li',

        // 按钮样式配置
        buttonStyle: {
            position: 'fixed',
            right: '20px',
            top: '20px',
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            zIndex: 9999,
            boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
        },

        // 文件名配置
        fileNamePrefix: '考试题目_',

        // 格式配置
        autoAddOptionPrefix: true,
        optionPrefixRegex: /^[A-Z]\.\s/,
        questionMissingText: '(问题内容缺失)',
        optionsMissingText: '(无选项)'
    };

    /****************** 工具函数 ******************/
    function createExportButton() {
        const btn = document.createElement('button');
        btn.id = 'tm-export-btn';
        btn.textContent = '导出题目';

        // 应用样式
        Object.assign(btn.style, config.buttonStyle);

        // 添加悬停效果
        btn.addEventListener('mouseover', () => {
            btn.style.backgroundColor = '#45a049';
        });
        btn.addEventListener('mouseout', () => {
            btn.style.backgroundColor = '#4CAF50';
        });

        return btn;
    }

    function generateFileName() {
        return `${config.fileNamePrefix}${new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(/[/:\s]/g, '-')}.txt`;
    }

    /****************** 核心逻辑 ******************/
    function exportQuestions() {
        const examItems = document.querySelectorAll(config.examItemSelector);
        if (!examItems.length) {
            alert('未找到题目内容，请确认当前页面有效');
            return;
        }

        let content = "";

        examItems.forEach((examItem, questionIndex) => {
            // 处理问题
            const questionElement = examItem.querySelector(config.questionSelector);
            const questionText = questionElement?.textContent?.trim()
                || `${config.questionMissingText} (第${questionIndex + 1}题)`;
            content += `问题 ${questionIndex + 1}: ${questionText}\n`;

            // 处理选项
            const optionsContainer = examItem.querySelector(config.optionsContainerSelector);
            if (!optionsContainer) {
                content += config.optionsMissingText + '\n\n';
                return;
            }

            const optionElements = optionsContainer.querySelectorAll(config.optionItemSelector);
            if (!optionElements.length) {
                content += config.optionsMissingText + '\n\n';
                return;
            }

            // 处理选项内容
            optionElements.forEach((option, optionIndex) => {
                let optionText = option.textContent?.trim() || '(空选项)';

                if (config.autoAddOptionPrefix) {
                    const hasPrefix = config.optionPrefixRegex.test(optionText);
                    if (!hasPrefix) {
                        const prefix = String.fromCharCode(65 + optionIndex);
                        optionText = `${prefix}. ${optionText}`;
                    }
                }

                content += `${optionText}\n`;
            });

            content += '\n';
        });

        // 创建下载
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = generateFileName();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /****************** 初始化 ******************/
    function init() {
        // 添加导出按钮
        const exportBtn = createExportButton();
        exportBtn.addEventListener('click', exportQuestions);
        document.body.appendChild(exportBtn);

        // 防止重复注入
        window.tmExportButtonLoaded = true;
    }

    // 等待DOM加载完成
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();