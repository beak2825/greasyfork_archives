// ==UserScript==
// @name         UIWOW论坛纯净阅读模式
// @namespace    https://example.com
// @version      1.6
// @description  完美保留内容同时隐藏指定元素，解决重复显示问题
// @author       ml0975990
// @match        *://uiwow.com/*
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/531897/UIWOW%E8%AE%BA%E5%9D%9B%E7%BA%AF%E5%87%80%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/531897/UIWOW%E8%AE%BA%E5%9D%9B%E7%BA%AF%E5%87%80%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const config = {
        maxWidth: '900px',
        fontSize: '16px',
        lineHeight: '1.8',
        fontFamily: '"Microsoft YaHei", sans-serif',
        titleSize: '24px',
        authorColor: '#444',
        contentBg: '#fff',
        typeoptionBg: '#f8f8f8'
    };

    // 需要隐藏的元素选择器
    const HIDE_SELECTORS = [
        '.cm', '.modact', '.rate',
        '.psth.xs1.ple','.psth.xs1',
        '.quote', '.blockcode',
        '.pstatus', '.attachbox',
        'iframe', 'script', '.ad'
    ];

    // 主处理函数
    function initCleanMode() {
        // 创建纯净容器
        const container = document.createElement('div');
        container.id = 'clean-reader-container';

        // 添加标题
        const title = document.getElementById('thread_subject');
        if (title) {
            const titleClone = title.cloneNode(true);
            titleClone.className = 'clean-title';
            container.appendChild(titleClone);
        }

        // 处理内容区域
        processContentArea(container);

        // 应用全局样式
        applyGlobalStyles();

        // 替换页面内容
        document.body.innerHTML = '';
        document.body.appendChild(container);
        addControlButtons();
    }

    // 处理内容区域
    function processContentArea(container) {
        const processedTypeOptions = new Set();

        document.querySelectorAll('.plc, .typeoption').forEach(element => {
            if (element.classList.contains('plc')) {
                processPLCElement(element, container);
            }
            else if (element.classList.contains('typeoption') && !processedTypeOptions.has(element)) {
                processedTypeOptions.add(element);
                processTypeOption(element, container);
            }
        });
    }

    // 处理PLC元素
    function processPLCElement(plc, container) {
        const author = plc.querySelector('.authi .xw1, .pi strong');
        const content = plc.querySelector('.t_f, .t_fsz, .pcb');

        if (!content) return;

        const postDiv = document.createElement('div');
        postDiv.className = 'clean-post';

        // 添加作者信息
        if (author) {
            const authorDiv = document.createElement('div');
            authorDiv.className = 'clean-author';
            authorDiv.textContent = author.textContent.trim();
            postDiv.appendChild(authorDiv);
        }

        // 处理内容
        const contentDiv = document.createElement('div');
        contentDiv.className = 'clean-content';
        contentDiv.innerHTML = content.innerHTML;

        // 清理不需要的元素
        HIDE_SELECTORS.forEach(selector => {
            contentDiv.querySelectorAll(selector).forEach(el => el.remove());
        });

        postDiv.appendChild(contentDiv);
        container.appendChild(postDiv);
    }

    // 处理TypeOption元素
    function processTypeOption(typeoption, container) {
        const clone = typeoption.cloneNode(true);
        clone.className = 'typeoption-content';

        // 清理不需要的元素
        HIDE_SELECTORS.forEach(selector => {
            clone.querySelectorAll(selector).forEach(el => el.remove());
        });

        container.appendChild(clone);
    }

    // 应用全局样式
    function applyGlobalStyles() {
        GM_addStyle(`
            body {
                background: ${config.contentBg} !important;
                margin: 0 !important;
                padding: 20px 0 !important;
                font-family: ${config.fontFamily} !important;
            }

            #clean-reader-container {
                max-width: ${config.maxWidth};
                margin: 0 auto;
                padding: 0 20px;
            }

            .clean-title {
                display: block !important;
                font-size: ${config.titleSize} !important;
                margin: 0 auto 20px !important;
                padding: 0 !important;
                font-weight: bold !important;
                color: #333 !important;
                line-height: 1.4 !important;
            }

            .clean-post {
                margin-bottom: 30px;
                border-bottom: 1px solid #eee;
                padding-bottom: 20px;
            }

            .clean-content {
                font-size: ${config.fontSize} !important;
                line-height: ${config.lineHeight} !important;
                color: #333 !important;
            }

            .clean-author {
                font-weight: bold;
                color: ${config.authorColor};
                margin-bottom: 10px;
                font-size: ${config.fontSize};
            }

            .typeoption-content {
                background: ${config.typeoptionBg};
                padding: 15px;
                border-radius: 4px;
                margin: 15px 0;
                font-size: ${config.fontSize};
            }

            img {
                max-width: 100% !important;
                height: auto !important;
            }

            /* 隐藏原始页面所有内容 */
            body > *:not(#clean-reader-container) {
                display: none !important;
            }

            /* 确保隐藏所有指定元素 */
            ${HIDE_SELECTORS.join(',')} {
                display: none !important;
            }
        `);
    }

    // 添加控制按钮
    function addControlButtons() {
        const btnContainer = document.createElement('div');
        btnContainer.className = 'clean-controls';

        // 按钮样式
        const btnStyle = `
            padding: 5px 10px;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-left: 10px;
        `;

        // 打印按钮
        const printBtn = document.createElement('button');
        printBtn.textContent = '打印';
        printBtn.style.cssText = `${btnStyle} background: #4CAF50;`;
        printBtn.onclick = () => window.print();

        // 退出按钮
        const exitBtn = document.createElement('button');
        exitBtn.textContent = '退出';
        exitBtn.style.cssText = `${btnStyle} background: #f44336;`;
        exitBtn.onclick = () => location.reload();

        btnContainer.appendChild(printBtn);
        btnContainer.appendChild(exitBtn);
        document.body.appendChild(btnContainer);

        // 控制按钮容器样式
        GM_addStyle(`
            .clean-controls {
                position: fixed;
                right: 20px;
                top: 20px;
                z-index: 9999;
                display: flex;
            }
        `);
    }

    // 等待内容加载
    const readyCheck = setInterval(() => {
        if (document.querySelector('.plc, .typeoption')) {
            clearInterval(readyCheck);
            initCleanMode();
        }
    }, 300);
})();