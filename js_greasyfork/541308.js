// ==UserScript==
// @name              Hitomi - Page Count Filter
// @name:en           Hitomi - Page Count Filter
// @name:ja           Hitomi - ページ数フィルター
// @name:ko           Hitomi - 페이지 수 필터
// @name:zh-TW        Hitomi - 頁數過濾器
// @name:zh-CN        Hitomi - 页数过滤器
//
// @description        Adds a floating button at the bottom right that opens a dialog to set the page range.
// @description:en     Adds a floating button at the bottom right that opens a dialog to set the page range.
// @description:ja     右下に浮遊ボタンを追加し、クリックでページ数範囲を設定するダイアログを開きます。
// @description:ko     오른쪽 하단에 떠 있는 버튼을 추가하고 클릭 시 페이지 수 범위를 설정하는 대화 상자를 엽니다.
// @description:zh-TW  於右下角添加一個懸浮按鈕，點擊後可設定頁數範圍的對話框。
// @description:zh-CN  在右下角添加一个悬浮按钮，点击后弹出设置页数范围的对话框。
//
// @namespace          http://tampermonkey.net/
// @version            4.3
// @author             You (-Refined by AI)
// @match              https://hitomi.la/*
// @grant              none
// @run-at             document-idle
// @downloadURL https://update.greasyfork.org/scripts/541308/Hitomi%20-%20Page%20Count%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/541308/Hitomi%20-%20Page%20Count%20Filter.meta.js
// ==/UserScript==



(function () {
    'use strict';

    // --- 配置区 ---
    const DEFAULT_MIN_PAGES = 1;
    const DEFAULT_MAX_PAGES = 800;
    // --- 配置区结束 ---

    let currentMinPages = DEFAULT_MIN_PAGES;
    let currentMaxPages = DEFAULT_MAX_PAGES;

    /**
     * 创建并注入全新的UI（一个悬浮按钮和一个<dialog>对话框）
     */
    function createFilterUI() {
        // 1. 创建悬浮触发按钮
        const triggerButton = document.createElement('button');
        triggerButton.id = 'hf-open-dialog-btn';
        triggerButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            <span>过滤</span>`;
        document.body.appendChild(triggerButton);

        // 2. 创建 <dialog> 对话框
        const dialog = document.createElement('dialog');
        dialog.id = 'hf-filter-dialog';
        dialog.innerHTML = `
            <div class="hf-dialog-content">
                <h3>页数范围过滤</h3>
                <p>请输入要显示的页数范围，留空表示不限制。</p>
                <div class="hf-input-group">
                    <input type="tel" pattern="[0-9]*" id="hf-min-pages" placeholder="最小页数">
                    <span>-</span>
                    <input type="tel" pattern="[0-9]*" id="hf-max-pages" placeholder="最大页数">
                </div>
                <div class="hf-button-group">
                    <button id="hf-apply-btn" class="hf-btn-primary">应用</button>
                    <button id="hf-close-btn" class="hf-btn-secondary">关闭</button>
                </div>
                <div id="hf-status"></div>
            </div>
        `;
        document.body.appendChild(dialog);

        // 3. 注入 CSS 样式
        const style = document.createElement('style');
        style.innerHTML = `
            /* --- 悬浮按钮样式 --- */
            #hf-open-dialog-btn {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 99998;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background-color: #3a87ad;
                color: white;
                border: none;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                cursor: pointer;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 2px;
                transition: transform 0.2s, background-color 0.2s;
            }
            #hf-open-dialog-btn:hover {
                background-color: #2c6a8a;
                transform: scale(1.05);
            }
            #hf-open-dialog-btn span { font-size: 12px; }

            /* --- Dialog 对话框样式 --- */
            #hf-filter-dialog {
                width: 90vw;
                max-width: 320px;
                border: 1px solid #ddd;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                padding: 0; /* 我们在内部容器控制padding */
                margin: auto;
            }
            #hf-filter-dialog::backdrop { /* 对话框蒙层样式 */
                background-color: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(2px);
            }
            #hf-filter-dialog .hf-dialog-content {
                padding: 20px;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
            #hf-filter-dialog h3 { margin: 0 0 8px; font-size: 1.2em; text-align: center; color: #333; }
            #hf-filter-dialog p { margin: 0 0 16px; font-size: 0.9em; color: #666; text-align: center; }

            #hf-filter-dialog .hf-input-group { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
            #hf-filter-dialog .hf-input-group input {
                width: 100%;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 8px;
                font-size: 1em;
                text-align: center;
                -moz-appearance: textfield;
            }
            #hf-filter-dialog .hf-input-group input::-webkit-outer-spin-button,
            #hf-filter-dialog .hf-input-group input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

            #hf-filter-dialog .hf-button-group { display: flex; gap: 10px; }
            #hf-filter-dialog button {
                width: 100%;
                padding: 12px;
                border-radius: 8px;
                border: none;
                font-size: 1em;
                font-weight: bold;
                cursor: pointer;
                transition: opacity 0.2s;
            }
            #hf-filter-dialog button:hover { opacity: 0.85; }
            #hf-filter-dialog .hf-btn-primary { background-color: #3a87ad; color: white; }
            #hf-filter-dialog .hf-btn-secondary { background-color: #e0e0e0; color: #333; }

            #hf-status { margin-top: 15px; text-align: center; font-size: 0.8em; color: #777; min-height: 1.2em; }
        `;
        document.head.appendChild(style);

        // 4. 绑定事件
        triggerButton.addEventListener('click', () => dialog.showModal());
        document.getElementById('hf-close-btn').addEventListener('click', () => dialog.close());
        document.getElementById('hf-apply-btn').addEventListener('click', () => {
            const minInput = document.getElementById('hf-min-pages');
            const maxInput = document.getElementById('hf-max-pages');

            minInput.value = minInput.value.replace(/[^0-9]/g, '');
            maxInput.value = maxInput.value.replace(/[^0-9]/g, '');

            let newMin = parseInt(minInput.value, 10) || 1;
            let newMax = parseInt(maxInput.value, 10) || Infinity;

            if (newMin > newMax) {
                [newMin, newMax] = [newMax, newMin];
                minInput.value = newMin;
                maxInput.value = (newMax === Infinity) ? '' : newMax;
            }

            saveSettings(newMin, newMax);
            applyFilterNow();
            dialog.close(); // 应用后自动关闭
        });
    }

    // ... (saveSettings, loadSettings, applyFilterNow, main 函数与之前版本相同) ...
    // ... 将版本 3.5 的 saveSettings, loadSettings, applyFilterNow, main 函数完整复制到这里 ...
    function saveSettings(min, max) {
        currentMinPages = min;
        currentMaxPages = max;
        localStorage.setItem('hf_min_pages', min);
        localStorage.setItem('hf_max_pages', max === Infinity ? '' : max);
    }

    function loadSettings() {
        const savedMin = localStorage.getItem('hf_min_pages');
        const savedMax = localStorage.getItem('hf_max_pages');
        currentMinPages = parseInt(savedMin, 10) || DEFAULT_MIN_PAGES;
        currentMaxPages = parseInt(savedMax, 10) || Infinity;

        const minInput = document.getElementById('hf-min-pages');
        if (minInput) minInput.value = currentMinPages > 1 ? currentMinPages : '';
        const maxInput = document.getElementById('hf-max-pages');
        if (maxInput) maxInput.value = (currentMaxPages === Infinity) ? '' : currentMaxPages;
    }

    function applyFilterNow() {
        const statusElement = document.getElementById('hf-status');
        const galleryItems = document.querySelectorAll('.gallery-content > div[class]');

        if (galleryItems.length === 0) {
            if (statusElement) statusElement.textContent = '未找到作品';
            return;
        }

        let visibleCount = 0;
        let totalCount = 0;
        galleryItems.forEach(item => {
            const h1 = item.querySelector('h1.lillie');
            if (!h1) return;

            totalCount++;
            item.style.display = '';

            let pages = -1;
            const firstNode = h1.childNodes[0];
            if (firstNode && firstNode.nodeType === Node.TEXT_NODE) {
                const match = firstNode.textContent.trim().match(/^\((\d+)\)$/);
                if (match) pages = parseInt(match[1], 10);
            }

            if (pages === -1) {
                const pageInfoTd = Array.from(item.querySelectorAll('td')).find(td => /pages/i.test(td.textContent));
                if(pageInfoTd) {
                    const match = pageInfoTd.textContent.match(/(\d+)\s*pages/i);
                    if (match) pages = parseInt(match[1], 10);
                }
            }

            if (pages !== -1) {
                if (pages < currentMinPages || pages > currentMaxPages) {
                    item.style.display = 'none';
                } else {
                    visibleCount++;
                }
            } else {
                visibleCount++;
            }
        });

        if (statusElement) statusElement.textContent = `显示 ${visibleCount} / ${totalCount} 项`;
    }

    function main() {
        createFilterUI(); // 注意，这里调用的是新函数
        loadSettings();

        let initialFilterDone = false;
        const tryInitialFilter = (retries = 0) => {
            if (document.querySelector('.gallery-content')) {
                applyFilterNow();
                initialFilterDone = true;
            } else if (retries < 20) {
                setTimeout(() => tryInitialFilter(retries + 1), 500);
            }
        };
        tryInitialFilter();

        const observer = new MutationObserver((mutations) => {
            if (!initialFilterDone) return;
            const hasNewNodes = mutations.some(mutation => mutation.addedNodes.length > 0);
            if (hasNewNodes) {
                clearTimeout(observer.timer);
                observer.timer = setTimeout(applyFilterNow, 300);
            }
        });

        const contentParent = document.querySelector('.container') || document.body;
        observer.observe(contentParent, { childList: true, subtree: true });
    }

    if (document.body) {
        main();
    } else {
        window.addEventListener('DOMContentLoaded', main, { once: true });
    }

})();