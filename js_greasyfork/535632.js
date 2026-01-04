// ==UserScript==
// @name         GitHub 新标签页打开
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  GitHub链接新标签页打开（现代化样式版）
// @author       Buggo404
// @match        https://github.com/*
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @copyright    2023, Buggo404
// @homepageURL  https://github.com/Buggo404
// @supportURL   https://github.com/Buggo404/github-newtab-links/issues
// @downloadURL https://update.greasyfork.org/scripts/535632/GitHub%20%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/535632/GitHub%20%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建现代化下拉框
    const createSelector = () => {
        const container = document.createElement('div');
        container.className = 'd-flex';
        container.style.alignItems = 'center';
        container.style.gap = '10px';
        container.style.marginRight = '20px';

        const label = document.createElement('span');
        label.className = 'f6';
        label.style.color = 'var(--color-fg-muted)';
        label.style.fontWeight = '500';
        label.textContent = '打开方式：';

        const selectWrapper = document.createElement('div');
        selectWrapper.style.position = 'relative';
        selectWrapper.style.display = 'inline-flex';
        selectWrapper.style.alignItems = 'center';

        const select = document.createElement('select');
        select.className = 'modern-select';
        select.value = GM_getValue('newTabMode', 'enabled');
        select.style.cursor = 'pointer';

        const options = [
            { text: '🌐 新页面打开', value: 'enabled' },
            { text: '📌 当前页打开', value: 'disabled' }
        ];

        options.forEach(opt => {
            const option = new Option(opt.text, opt.value);
            select.add(option);
        });

        // 创建自定义下拉箭头
        const customArrow = document.createElement('div');
        customArrow.className = 'select-arrow';
        customArrow.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                <path d="M4 6L8 10L12 6" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
        `;

        select.addEventListener('change', (e) => {
            GM_setValue('newTabMode', e.target.value);
            handleLinks();
        });

        selectWrapper.appendChild(select);
        selectWrapper.appendChild(customArrow);
        container.appendChild(selectWrapper);

        return container;
    };

    // 处理链接逻辑（保持不变）
    const handleLinks = () => {
        // 确保每次使用最新保存的设置
        const mode = GM_getValue('newTabMode', 'enabled');
        console.log('应用链接设置:', mode === 'enabled' ? '新页面打开' : '当前页打开');
        
        // 确保下拉框显示正确的值
        const selectBox = document.querySelector('.modern-select');
        if (selectBox && selectBox.value !== mode) {
            selectBox.value = mode;
        }
        
        document.querySelectorAll('a').forEach(link => {
            if (mode === 'enabled') {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            } else {
                link.removeAttribute('target');
                link.removeAttribute('rel');
            }
        });
    };

    // 插入控件（逻辑优化）
    const insertSelector = () => {
        const nav = document.querySelector('.AppHeader-user');
        const existing = document.querySelector('#newTabSelector');
        if (nav && !existing) {
            const container = createSelector();
            container.id = 'newTabSelector';
            nav.before(container);
        }
    };

    // 动态内容观察器（保持不变）
    const observer = new MutationObserver(() => {
        handleLinks();
        insertSelector();
    });

    // 初始化样式和功能
    const init = () => {
        GM_addStyle(`
            /* 现代化下拉框样式 */
            .modern-select {
                appearance: none;
                background: var(--color-canvas-subtle);
                border: 1px solid var(--color-border-default);
                border-radius: 8px;
                padding: 6px 32px 6px 12px;
                font-size: 13px;
                color: var(--color-fg-default);
                transition: all 0.2s ease;
                min-width: 120px;
                box-shadow: 0 1px 2px var(--color-shadow-small);
            }

            .modern-select:hover {
                background: var(--color-neutral-muted);
                border-color: var(--color-accent-emphasis);
            }

            .modern-select:focus {
                outline: none;
                box-shadow: 0 0 0 3px var(--color-accent-focus);
            }

            /* 自定义下拉箭头 */
            .select-arrow {
                position: absolute;
                right: 10px;
                pointer-events: none;
                color: var(--color-fg-muted);
                transition: transform 0.2s;
            }

            .modern-select:focus ~ .select-arrow,
            .modern-select:hover ~ .select-arrow {
                color: var(--color-accent-fg);
            }

            .modern-select option {
                background: var(--color-canvas-default);
                color: var(--color-fg-emphasized, #000);
                padding: 8px;
            }

            /* 确保下拉选项在hover时有明显的对比度 */
            .modern-select option:hover,
            .modern-select option:focus,
            .modern-select option:checked {
                background-color: var(--color-neutral-muted, #eaeef2);
                color: var(--color-fg-emphasized, #000);
            }
        `);

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 确保在DOMContentLoaded之后每次切换页面时都应用正确的设置
        window.addEventListener('load', () => {
            // 页面完全加载后再次应用设置，确保可靠性
            setTimeout(handleLinks, 500);
        });
        
        handleLinks();
        insertSelector();
    };

    // 启动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();