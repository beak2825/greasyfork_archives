// ==UserScript==
// @name         SAGE to CNPeReading Direct PDF Button
// @namespace    https://greasyfork.org/zh-CN/users/1335433
// @version      2.0
// @description  在SAGE期刊新版页面的文章工具栏中，添加一个指向“中图易阅通”平台的直接PDF下载按钮。
// @author       wakewon
// @match        https://journals.sagepub.com/doi/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545715/SAGE%20to%20CNPeReading%20Direct%20PDF%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/545715/SAGE%20to%20CNPeReading%20Direct%20PDF%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 获取文章DOI
    const getDOI = () => {
        let doiMeta = document.querySelector('meta[name="dc.Identifier"][scheme="doi"]');
        if (doiMeta && doiMeta.content) return doiMeta.content;

        doiMeta = document.querySelector('meta[name="publication_doi"]');
        if (doiMeta && doiMeta.content) return doiMeta.content;

        const pathParts = window.location.pathname.split('/');
        const doiIndex = pathParts.indexOf('doi');
        if (doiIndex !== -1 && doiIndex + 2 < pathParts.length) {
            const doiFromPath = pathParts.slice(doiIndex + 1).join('/');
             if (doiFromPath && doiFromPath.includes('/')) {
                return doiFromPath;
            }
        }

        console.warn('SAGE to CNPeReading: DOI could not be reliably extracted.');
        return null;
    };

    // 2. 创建并注入新按钮的函数
    const createAndInjectButton = () => {
        const buttonId = 'cnpereading-pdf-script-container';
        // 检查按钮是否已存在，防止重复添加
        if (document.getElementById(buttonId)) {
            return;
        }

        const doi = getDOI();
        if (!doi) {
            console.error('SAGE to CNPeReading: DOI not found, cannot create button.');
            return;
        }

        // *** 使用中图易阅通下载链接 ***
        const newPdfUrl = `https://sage.cnpereading.com/paragraph/download/?doi=${doi}`;

        // 寻找一个稳定的位置来放置我们的按钮。
        const anchor = document.querySelector('.core-nav-wrapper .core-sections-menu');

        if (!anchor) {
            // 如果页面结构变化导致找不到锚点，则优雅地退出
            return;
        }

        // 创建按钮的容器 div，并模仿原有 class 以便匹配样式
        const buttonContainer = document.createElement('div');
        buttonContainer.id = buttonId;
        buttonContainer.className = 'collateral-middle';

        // 创建链接 (a 标签)
        const newButton = document.createElement('a');
        newButton.href = newPdfUrl;
        newButton.target = '_blank';
        newButton.title = '通过中图易阅通下载PDF';

        // 创建内部结构，模仿原生按钮，并明确指出平台
        newButton.innerHTML = `🚀 <span class="link-text">中图易阅通PDF</span>`;

        // 添加样式，使其醒目且融入工具栏
        Object.assign(newButton.style, {
            cursor: 'pointer',
            color: '#007bff', // 蓝色，与“中图”平台风格更接近
            fontWeight: 'bold',
            textDecoration: 'none'
        });

        newButton.onmouseover = () => { newButton.style.textDecoration = 'underline'; };
        newButton.onmouseout = () => { newButton.style.textDecoration = 'none'; };

        buttonContainer.appendChild(newButton);

        // 将新按钮插入到“Contents”按钮的正后方
        anchor.insertAdjacentElement('afterend', buttonContainer);

        console.log(`SAGE to CNPeReading: Injected button for DOI: ${doi}`);
    };

    // 3. 使用 MutationObserver 监视页面动态变化
    const observer = new MutationObserver(() => {
        createAndInjectButton();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 页面加载完成后立即执行一次
    createAndInjectButton();

    // 在一段时间后停止监视，以节省资源
    setTimeout(() => {
        observer.disconnect();
    }, 20000);

})();