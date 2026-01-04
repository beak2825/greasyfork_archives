// ==UserScript==
// @name         Switch Bug Team Model
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Bug Team，好用、爱用 ♥
// @author       wandouyu
// @match        *://chat.voct.dev/*
// @match        *://chatgpt.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533388/Switch%20Bug%20Team%20Model.user.js
// @updateURL https://update.greasyfork.org/scripts/533388/Switch%20Bug%20Team%20Model.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let dropdownElement = null;
    let isDropdownVisible = false;
    let insertionAttempted = false;
    const SCRIPT_PREFIX = "模型切换器:";
    const DEBOUNCE_DELAY = 300;
    
    const modelMap = {
        "o3 ": "o3",
        "o4-mini-high": "o4-mini-high",
        "o4-mini": "o4-mini",
        "gpt-4.5": "gpt-4-5",
        "gpt-4o": "gpt-4o",
        "gpt-4o-mini": "gpt-4o-mini",
        "gpt-4o (tasks)": "gpt-4o-jawbone",
        "gpt-4": "gpt-4"
    };
    const modelDisplayNames = Object.keys(modelMap);
    const modelIds = Object.values(modelMap);

    GM_addStyle(`
        .model-switcher-container {
            position: relative;
            display: inline-block;
            margin-left: 4px;
            margin-right: 4px;
            align-self: center;
        }

        #model-switcher-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 36px;
            min-width: 36px;
            padding: 0 12px;
            border-radius: 9999px;
            border: 1px solid var(--token-border-light, #E5E5E5);
            font-size: 14px;
            font-weight: 500;
            color: var(--token-text-secondary, #666666);
            background-color: var(--token-main-surface-primary, #FFFFFF);
            cursor: pointer;
            white-space: nowrap;
            transition: background-color 0.2s ease;
            box-sizing: border-box;
        }

        #model-switcher-button:hover {
            background-color: var(--token-main-surface-secondary, #F7F7F8);
        }

        #model-switcher-dropdown {
            position: fixed;
            display: block;
            background-color: var(--token-main-surface-primary, white);
            border: 1px solid var(--token-border-medium, #E5E5E5);
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            z-index: 1050;
            min-width: 180px;
            overflow-y: auto;
            padding: 4px 0;
        }

        .model-switcher-item {
            display: block;
            padding: 8px 16px;
            color: var(--token-text-primary, #171717);
            text-decoration: none;
            white-space: nowrap;
            cursor: pointer;
            font-size: 14px;
        }

        .model-switcher-item:hover {
            background-color: var(--token-main-surface-secondary, #F7F7F8);
        }

        .model-switcher-item.active {
            font-weight: bold;
        }
    `);

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function getCurrentModelInfo() {
        const params = new URLSearchParams(window.location.search);
        const currentModelIdFromUrl = params.get('model');

        let effectiveModelId = modelIds[0];
        let currentIndex = 0;

        if (currentModelIdFromUrl) {
            const foundIndex = modelIds.indexOf(currentModelIdFromUrl);
            if (foundIndex !== -1) {
                effectiveModelId = currentModelIdFromUrl;
                currentIndex = foundIndex;
            }
        }

        const currentDisplayName = modelDisplayNames[currentIndex];
        return { currentId: effectiveModelId, displayName: currentDisplayName, index: currentIndex };
    }

    function createModelSwitcher() {
        const container = document.createElement('div');
        container.className = 'model-switcher-container';
        container.id = 'model-switcher-container';

        const button = document.createElement('button');
        button.id = 'model-switcher-button';
        button.type = 'button';

        const dropdown = document.createElement('div');
        dropdown.className = 'model-switcher-dropdown';
        dropdown.id = 'model-switcher-dropdown';

        const initialModelInfo = getCurrentModelInfo();
        button.textContent = initialModelInfo.displayName;

        modelDisplayNames.forEach((name, index) => {
            const modelId = modelIds[index];
            const item = document.createElement('a');
            item.className = 'model-switcher-item';
            item.textContent = name;
            item.dataset.modelId = modelId;
            item.href = '#';

            if (initialModelInfo.currentId === modelId) {
                item.classList.add('active');
            }

            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const selectedModelId = e.target.dataset.modelId;
                const currentModelIdNow = getCurrentModelInfo().currentId;

                if (currentModelIdNow !== selectedModelId) {
                    const url = new URL(window.location.href);
                    url.searchParams.set('model', selectedModelId);
                    console.log(`${SCRIPT_PREFIX} 切换目标: ${name} (${selectedModelId})`);
                    window.location.href = url.toString();
                    // hideDropdown();
                } else {
                    console.log(`${SCRIPT_PREFIX} 模型无需切换`);
                    hideDropdown();
                }
            });
            dropdown.appendChild(item);
        });

        button.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown();
        });

        container.appendChild(button);
        dropdownElement = dropdown;
        return container;
    }

    function showDropdown() {
        if (!dropdownElement || isDropdownVisible) return;

        const button = document.getElementById('model-switcher-button');
        if (!button) {
            console.error(`${SCRIPT_PREFIX} 找不到添加的模型切换器按钮，无法定位下拉菜单。`);
            return;
        }

        if (!dropdownElement.parentElement) {
            document.body.appendChild(dropdownElement);
        }
        isDropdownVisible = true;

        const buttonRect = button.getBoundingClientRect();
        const dropdownHeight = dropdownElement.offsetHeight;
        const dropdownWidth = dropdownElement.offsetWidth;
        const spaceAbove = buttonRect.top;
        const spaceBelow = window.innerHeight - buttonRect.bottom;
        const margin = 5;
        let top, left = buttonRect.left;
        if (spaceBelow >= dropdownHeight + margin || spaceBelow >= spaceAbove) {
            top = buttonRect.bottom + margin;
        } else {
            top = buttonRect.top - dropdownHeight - margin;
        }
        top = Math.max(margin, Math.min(top, window.innerHeight - dropdownHeight - margin));
        left = Math.max(margin, Math.min(left, window.innerWidth - dropdownWidth - margin));
        dropdownElement.style.top = `${top}px`;
        dropdownElement.style.left = `${left}px`;

        document.addEventListener('click', handleClickOutside, true);
        window.addEventListener('resize', debouncedHideDropdown);
        window.addEventListener('scroll', debouncedHideDropdownOnScroll, true);
    }

    function hideDropdown() {
        if (!dropdownElement || !isDropdownVisible) return;
        if (dropdownElement.parentElement) {
            dropdownElement.remove();
        }
        isDropdownVisible = false;
        document.removeEventListener('click', handleClickOutside, true);
        window.removeEventListener('resize', debouncedHideDropdown);
        window.removeEventListener('scroll', debouncedHideDropdownOnScroll, true);
    }
    const debouncedHideDropdown = debounce(hideDropdown, 150);
    const debouncedHideDropdownOnScroll = debounce(hideDropdown, 150);

    function toggleDropdown() {
        if (isDropdownVisible) {
            hideDropdown();
        } else {
            showDropdown();
        }
    }

    function handleClickOutside(event) {
        const button = document.getElementById('model-switcher-button');
        if (dropdownElement && dropdownElement.parentNode && button &&
            !button.contains(event.target) && !dropdownElement.contains(event.target)) {
             hideDropdown();
        }
    }

    function updateSwitcherState() {
        const button = document.getElementById('model-switcher-button');
        if (!button) return;

        const currentInfo = getCurrentModelInfo();

        if (button.textContent !== currentInfo.displayName) {
            button.textContent = currentInfo.displayName;
            console.log(`${SCRIPT_PREFIX} 按钮文本更新为: ${currentInfo.displayName}`);
        }

        if (dropdownElement) {
            const items = dropdownElement.querySelectorAll('.model-switcher-item');
            let changed = false;
            items.forEach((item) => {
                const modelId = item.dataset.modelId;
                const shouldBeActive = (currentInfo.currentId === modelId);
                if (item.classList.contains('active') !== shouldBeActive) {
                    if (shouldBeActive) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                    changed = true;
                }
            });
            if (changed) {
                 console.log(`${SCRIPT_PREFIX} 下拉菜单激活状态已更新`);
            }
        }
    }

    function checkAndInsertSwitcher() {
        const composerSelector = 'form[data-type="unified-composer"]';
        const toolbarContainer = document.querySelector(composerSelector);

        if (!toolbarContainer) {
            const existingSwitcher = document.getElementById('model-switcher-container');
            if (existingSwitcher && !existingSwitcher.closest(composerSelector)) {
                console.log(`${SCRIPT_PREFIX} 切换器存在于预期容器之外，移除。`);
                existingSwitcher.remove();
                insertionAttempted = false;
                hideDropdown();
            }
            return;
        }

        const existingSwitcher = document.getElementById('model-switcher-container');
        const targetSelector = 'div[style*="--vt-composer-attach-file-action"]';
        const insertionTarget = toolbarContainer.querySelector(targetSelector);

        if (existingSwitcher) {
            if (!toolbarContainer.contains(existingSwitcher)) {
                 console.log(`${SCRIPT_PREFIX} 切换器存在但不在预期容器内，移动它...`);
                 if (insertionTarget) {
                     insertionTarget.insertAdjacentElement('afterend', existingSwitcher);
                 } else {
                     toolbarContainer.appendChild(existingSwitcher);
                     console.log(`${SCRIPT_PREFIX} 未找到附件按钮，切换器移动到工具栏末尾`);
                 }
            }
            updateSwitcherState();
            insertionAttempted = true;
        } else {
            if (insertionTarget) {
                console.log(`${SCRIPT_PREFIX} 找到插入点 (${targetSelector})，尝试插入切换器...`);
                const switcherContainer = createModelSwitcher();
                insertionTarget.insertAdjacentElement('afterend', switcherContainer);
                console.log(`${SCRIPT_PREFIX} 成功插入至附件上传按钮之后`);
                insertionAttempted = true;
            } else {
                 console.warn(`${SCRIPT_PREFIX} 在工具栏内未找到附件上传按钮 (${targetSelector})，尝试添加到工具栏末尾`);
                 const switcherContainer = createModelSwitcher();
                 toolbarContainer.appendChild(switcherContainer);
                 console.log(`${SCRIPT_PREFIX} 成功插入至工具栏末尾`);
                 insertionAttempted = true;
            }
        }

        const currentSwitcherExists = !!document.getElementById('model-switcher-container');
        if (insertionAttempted && !currentSwitcherExists) {
            console.log(`${SCRIPT_PREFIX} 切换器容器似乎已被移除, 将在下次检查时尝试重新插入`);
            insertionAttempted = false;
            hideDropdown();
        }
    }

    const debouncedCheckAndInsert = debounce(checkAndInsertSwitcher, DEBOUNCE_DELAY);

    const observer = new MutationObserver((mutationsList, obs) => {
        debouncedCheckAndInsert();
    });

    console.log(`${SCRIPT_PREFIX} 正在监控 DOM 变化`);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log(`${SCRIPT_PREFIX} 计划在 500ms 后进行首次检查`);
    setTimeout(debouncedCheckAndInsert, 500);

})();