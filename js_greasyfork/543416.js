// ==UserScript==
// @name         115网盘转存独立版
// @author       wangzijian0@vip.qq.com
// @description  115网盘分享者分享页面恢复转存按钮。
// @version      1.0.1.20250723
// @icon         https://github.githubassets.com/assets/mona-loading-default-c3c7aad1282f.gif
// @match        *://115cdn.com/*
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/users/1453515

// @downloadURL https://update.greasyfork.org/scripts/543416/115%E7%BD%91%E7%9B%98%E8%BD%AC%E5%AD%98%E7%8B%AC%E7%AB%8B%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/543416/115%E7%BD%91%E7%9B%98%E8%BD%AC%E5%AD%98%E7%8B%AC%E7%AB%8B%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const createSaveMenu = () => {
        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.id = 'custom-save-menu';
        menu.style.cssText = `
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            z-index: 999;
            min-width: 120px;
            background-color: #fff;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            border-radius: 4px;
        `;
        menu.innerHTML = `
            <div class="cell-icon">
                <ul>
                    <li>
                        <a href="javascript:;" class="fast-save-link">
                            <i class="icon-operate ifo-fastsaveto"></i>
                            <span>一键转存</span>
                        </a>
                    </li>
                </ul>
            </div>
        `;
        document.body.appendChild(menu);
        return menu;
    };

    const addSaveButton = () => {
        const menuContainer = document.getElementById('js-menu');
        const downloadButton = document.querySelector('a[btn="download"]');
        if (!menuContainer || !downloadButton) return;

        document.querySelectorAll('#custom-save-button').forEach(btn => btn.remove());

        const saveButton = document.createElement('a');
        saveButton.id = 'custom-save-button';
        saveButton.setAttribute('href', 'javascript:;');
        saveButton.setAttribute('btn', 'save');
        saveButton.setAttribute('data-custom', 'true');
        saveButton.className = 'button';
        saveButton.style.position = 'relative';
        saveButton.innerHTML = `
            <i class="icon-operate ifo-saveto"></i>
            <span>转存</span>
            <i class="ibco-arrow-solid"></i>
        `;

        let saveMenu = document.getElementById('custom-save-menu') || createSaveMenu();
        const fastSaveLink = saveMenu.querySelector('.fast-save-link');

        menuContainer.insertBefore(saveButton, downloadButton);

        const handleMouseEnter = () => {
            if (saveButton.classList.contains('btn-disabled')) return;
            
            const rect = saveButton.getBoundingClientRect();
            saveMenu.style.display = 'block';
            saveMenu.style.top = `${rect.bottom + window.scrollY}px`;
            saveMenu.style.left = `${rect.left + window.scrollX}px`;
        };

        const handleMouseLeave = () => {
            setTimeout(() => {
                if (!saveMenu.matches(':hover') && !saveButton.matches(':hover')) {
                    saveMenu.style.display = 'none';
                }
            }, 100);
        };

        saveButton.addEventListener('mouseenter', handleMouseEnter);
        saveButton.addEventListener('mouseleave', handleMouseLeave);
        saveMenu.addEventListener('mouseleave', () => saveMenu.style.display = 'none');

        fastSaveLink.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            saveMenu.style.display = 'none';
            const enterDownloadBox = document.getElementById('enter_download_box');
            if (enterDownloadBox) enterDownloadBox.style.display = 'block';
        });

        saveButton.addEventListener('click', (e) => {
            if (!e.target.closest('.fast-save-link')) {
                const nativeSaveButton = document.querySelector('a[btn="save"]:not([data-custom])');
                if (nativeSaveButton) {
                    nativeSaveButton.dispatchEvent(new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true
                    }));
                }
            }
        });
    };

    const checkAndAddSaveButton = () => {
        const menuContainer = document.getElementById('js-menu');
        if (!menuContainer) return;

        const existingCustomButton = document.getElementById('custom-save-button');
        if (existingCustomButton) {
            existingCustomButton.style.display = '';
            return;
        }

        const nativeSaveButton = document.querySelector('a[btn="save"]:not([data-custom])');
        if (!nativeSaveButton || nativeSaveButton.style.display === 'none') {
            addSaveButton();
        }
    };

    const initObserver = () => {
        const targetNode = document.getElementById('js-warp');
        if (!targetNode) return;

        const observer = new MutationObserver(() => checkAndAddSaveButton());
        observer.observe(targetNode, { childList: true, subtree: true });
        return observer;
    };

    window.addEventListener('load', () => {
        checkAndAddSaveButton();
        initObserver();
        setInterval(checkAndAddSaveButton, 1000);
    });
})();
