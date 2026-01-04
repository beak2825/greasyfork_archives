// ==UserScript==
// @name         Add GitHub DeepWiki Button
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add a DeepWiki button to GitHub repository navigation
// @author       heakjo
// @match        https://github.com/*/*
// @grant        none
// @run-at      document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @downloadURL https://update.greasyfork.org/scripts/545929/Add%20GitHub%20DeepWiki%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/545929/Add%20GitHub%20DeepWiki%20Button.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 配置
    const config = {
        maxRetries: 10,
        retryDelay: 500,
        observerConfig: {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        }
    };

    // 日志函数
    function log(message) {
        console.log('[DeepWiki Button]', message);
    }

    // 等待元素出现的函数
    function waitForElement(selector, callback, retryCount = 0) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
            return;
        }

        if (retryCount < config.maxRetries) {
            setTimeout(() => {
                waitForElement(selector, callback, retryCount + 1);
            }, config.retryDelay);
        } else {
            log(`Element not found after ${config.maxRetries} retries: ${selector}`);
        }
    }

    // 添加DeepWiki按钮的主函数
    function addDeepWikiButton() {
        // 尝试多个可能的选择器
        const selectors = [
            'a[data-tab-item="i7insights-tab"]',  // 原始选择器
            'a[data-selected-links^="repo_graphs"]',  // 备用选择器1
            'nav[aria-label="Repository"] a[href$="/pulse"]',  // 备用选择器2
            'nav[aria-label="Repository"] a[href$="/insights"]',  // 备用选择器3
            '.UnderlineNav-item[href$="/insights"]',  // 备用选择器4
            '.js-responsive-underlinenav-item[href$="/insights"]'  // 备用选择器5
        ];

        let insightsButton = null;
        let usedSelector = '';

        // 尝试每个选择器
        for (const selector of selectors) {
            insightsButton = document.querySelector(selector);
            if (insightsButton) {
                usedSelector = selector;
                break;
            }
        }

        if (!insightsButton) {
            log('Insights button not found with any selector');
            return false;
        }

        log(`Found Insights button using selector: ${usedSelector}`);

        // 检查是否已经添加了DeepWiki按钮
        const existingButton = document.querySelector('a[data-tab-item="deepwiki-tab"]');
        if (existingButton) {
            log('DeepWiki button already exists');
            return true;
        }

        // 获取用户名和仓库名
        const currentUrl = window.location.href;
        const urlParts = currentUrl.split('/');
        const username = urlParts[3];
        const repoName = urlParts[4];

        if (!username || !repoName) {
            log('Could not extract username or repo name from URL');
            return false;
        }

        // 创建DeepWiki按钮
        const deepWikiUrl = `https://deepwiki.com/${username}/${repoName}`;
        const deepWikiButtonHtml = `
            <li data-view-component="true" class="d-inline-flex">
                <a href="${deepWikiUrl}" data-tab-item="deepwiki-tab" data-selected-links="" data-pjax="#repo-content-pjax-container" data-turbo-frame="repo-content-turbo-frame" data-analytics-event="{&quot;category&quot;:&quot;Underline navbar&quot;,&quot;action&quot;:&quot;Click tab&quot;,&quot;label&quot;:&quot;DeepWiki&quot;,&quot;target&quot;:&quot;UNDERLINE_NAV.TAB&quot;}" data-view-component="true" class="UnderlineNav-item no-wrap js-responsive-underlinenav-item">
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-book UnderlineNav-octicon d-none d-sm-inline">
                        <path d="M0 1.75A.75.75 0 0 1 .75 1h4.25a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75H.75a.75.75 0 0 1-.75-.75ZM6.5 1.75a.75.75 0 0 1 .75-.75h8a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-8a.75.75 0 0 1-.75-.75Z"></path>
                    </svg>
                    <span data-content="DeepWiki">DeepWiki</span>
                </a>
            </li>
        `;

        // 插入按钮
        try {
            insightsButton.parentElement.insertAdjacentHTML('afterend', deepWikiButtonHtml);
            log('DeepWiki button added successfully');
            return true;
        } catch (error) {
            log('Error adding DeepWiki button:', error);
            return false;
        }
    }

    // 设置MutationObserver来监听DOM变化
    function setupObserver() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    // 检查是否有新的导航元素被添加
                    const hasNavChanges = Array.from(mutation.addedNodes).some(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            return node.querySelector && (
                                node.querySelector('nav[aria-label="Repository"]') ||
                                node.querySelector('.UnderlineNav') ||
                                node.querySelector('.js-responsive-underlinenav-item')
                            );
                        }
                        return false;
                    });

                    if (hasNavChanges) {
                        log('DOM change detected, attempting to add DeepWiki button');
                        setTimeout(addDeepWikiButton, 100); // 小延迟确保DOM完全更新
                    }
                }
            }
        });

        // 开始观察整个文档
        observer.observe(document.body, config.observerConfig);
        log('MutationObserver setup complete');
    }

    // 初始化函数
    function init() {
        log('Initializing DeepWiki button script');

        // 立即尝试添加按钮
        addDeepWikiButton();

        // 设置MutationObserver
        setupObserver();

        // 监听GitHub的导航事件
        document.addEventListener('pjax:end', () => {
            log('pjax:end event detected');
            setTimeout(addDeepWikiButton, 100);
        });

        document.addEventListener('turbo:render', () => {
            log('turbo:render event detected');
            setTimeout(addDeepWikiButton, 100);
        });

        document.addEventListener('turbo:load', () => {
            log('turbo:load event detected');
            setTimeout(addDeepWikiButton, 100);
        });

        // 监听hash变化（单页应用导航）
        window.addEventListener('hashchange', () => {
            log('hashchange event detected');
            setTimeout(addDeepWikiButton, 100);
        });
    }

    // 等待DOM ready后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();