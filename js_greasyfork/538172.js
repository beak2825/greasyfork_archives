// ==UserScript==
// @name         GitHub Project Filter Formatter with Saved Filters
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Adds fuzzy search button inside input and frequently used filters toolbar above GitHub project filter input.
// @author       xiaohaoxing
// @match        https://github.com/orgs/.*/projects/.*
// @match        https://github.com/*/*/projects/*
// @grant        none
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538172/GitHub%20Project%20Filter%20Formatter%20with%20Saved%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/538172/GitHub%20Project%20Filter%20Formatter%20with%20Saved%20Filters.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const INPUT_ID = 'filter-bar-component-input';
    const BUTTON_ID = 'tampermonkey-format-title-button';
    const BUTTON_TEXT = '模糊';
    const SAVE_BUTTON_ID = 'tampermonkey-save-filter-button';
    const SAVE_BUTTON_TEXT = '⭐';
    const DROPDOWN_ID = 'tampermonkey-saved-filters-dropdown';
    const TOOLBAR_ID = 'tampermonkey-filter-toolbar';
    const WRAPPER_CLASS = 'tampermonkey-input-wrapper';
    const MIN_INPUT_TEXT_AREA_WIDTH = 50;
    const STORAGE_KEY = 'github-project-saved-filters';

    let filterInput = null;
    let formatButton = null;
    let saveButton = null;
    let savedFiltersDropdown = null;
    let toolbar = null;
    let inputWrapper = null;
    let resizeObserver = null;

    function getSavedFilters() {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    }

    function saveFilter(name, value) {
        const filters = getSavedFilters();
        const newFilter = { name, value, id: Date.now() };
        filters.push(newFilter);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
        updateDropdown();
        return newFilter;
    }

    function deleteFilter(id) {
        const filters = getSavedFilters();
        const updated = filters.filter(f => f.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        updateDropdown();
    }

    function showManageFiltersDialog() {
        const filters = getSavedFilters();
        if (filters.length === 0) {
            alert('没有保存的筛选条件');
            return;
        }

        let message = '已保存的筛选条件：\n\n';
        filters.forEach((filter, index) => {
            message += `${index + 1}. ${filter.name}\n   值: ${filter.value}\n\n`;
        });
        message += '\n输入要删除的筛选条件编号（1-' + filters.length + '），或点击取消：';

        const input = prompt(message);
        if (input) {
            const index = parseInt(input) - 1;
            if (index >= 0 && index < filters.length) {
                const filterToDelete = filters[index];
                if (confirm(`确定要删除"${filterToDelete.name}"吗？`)) {
                    deleteFilter(filterToDelete.id);
                    alert('筛选条件已删除');
                }
            } else {
                alert('无效的编号');
            }
        }
    }

    function applyFilter(value) {
        const currentDomInput = document.getElementById(INPUT_ID);
        if (!currentDomInput) return;
        filterInput = currentDomInput;
        
        const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set ||
                            Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
        if (valueSetter) {
            valueSetter.call(filterInput, value);
        } else {
            filterInput.value = value;
        }
        const inputEvent = new Event('input', { bubbles: true, cancelable: true });
        filterInput.dispatchEvent(inputEvent);
        filterInput.focus();
    }

    function createSaveButton() {
        const existingButton = document.getElementById(SAVE_BUTTON_ID);
        if (existingButton) {
            return existingButton;
        }

        const button = document.createElement('button');
        button.id = SAVE_BUTTON_ID;
        button.textContent = SAVE_BUTTON_TEXT;
        button.type = 'button';
        button.title = '保存当前筛选条件';
        button.className = 'btn btn-sm';
        button.style.fontSize = '12px';
        button.style.lineHeight = '18px';
        button.style.height = '28px';

        // Override specific styles to ensure consistency
        button.style.display = 'inline-flex';
        button.style.alignItems = 'center';
        button.style.gap = '4px';
        button.style.marginLeft = '0';
        button.style.padding = '4px 8px';
        button.style.minWidth = 'auto';
        button.style.fontWeight = '500';

        // Add hover effects
        button.addEventListener('mouseenter', () => {
            button.classList.add('btn-hover');
        });
        button.addEventListener('mouseleave', () => {
            button.classList.remove('btn-hover');
        });

        button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            
            const currentDomInput = document.getElementById(INPUT_ID);
            if (!currentDomInput) return;
            filterInput = currentDomInput;
            
            if (filterInput.value.trim() !== '') {
                const filterName = prompt('请输入筛选条件的名称：', filterInput.value.substring(0, 20));
                if (filterName && filterName.trim()) {
                    saveFilter(filterName.trim(), filterInput.value);
                    alert('筛选条件已保存！');
                }
            } else {
                alert('请先输入筛选条件');
            }
        });

        return button;
    }

    function createDropdown() {
        const existingDropdown = document.getElementById(DROPDOWN_ID);
        if (existingDropdown) {
            return existingDropdown;
        }

        const dropdown = document.createElement('select');
        dropdown.id = DROPDOWN_ID;
        dropdown.className = 'form-select select-sm';
        
        // Override specific styles
        dropdown.style.minWidth = '120px';
        dropdown.style.maxWidth = '200px';
        dropdown.style.marginRight = '8px'; // Small gap between dropdown and button
        dropdown.style.height = '28px';
        dropdown.style.fontSize = '12px';
        dropdown.style.lineHeight = '18px';
        dropdown.style.paddingLeft = '12px';
        dropdown.style.paddingRight = '32px';
        dropdown.style.border = '1px solid var(--color-border-default, rgba(31, 35, 40, 0.15))';
        dropdown.style.borderRadius = '6px';
        dropdown.style.backgroundColor = 'var(--color-canvas-default, #ffffff)';
        dropdown.style.color = 'var(--color-fg-default, #24292f)';
        dropdown.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg width=\'16\' height=\'16\' viewBox=\'0 0 16 16\' fill=\'%23586069\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M4.427 7.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 7H4.604a.25.25 0 00-.177.427z\'/%3E%3C/svg%3E")';
        dropdown.style.backgroundRepeat = 'no-repeat';
        dropdown.style.backgroundPosition = 'right 8px center';
        dropdown.style.backgroundSize = '16px';
        dropdown.style.appearance = 'none';
        dropdown.style.cursor = 'pointer';

        // Add hover effect
        dropdown.addEventListener('mouseenter', () => {
            dropdown.style.borderColor = 'var(--color-border-muted, rgba(31, 35, 40, 0.3))';
            dropdown.style.backgroundColor = 'var(--color-canvas-subtle, #f6f8fa)';
        });
        dropdown.addEventListener('mouseleave', () => {
            dropdown.style.borderColor = 'var(--color-border-default, rgba(31, 35, 40, 0.15))';
            dropdown.style.backgroundColor = 'var(--color-canvas-default, #ffffff)';
        });

        // Add focus styles
        dropdown.addEventListener('focus', () => {
            dropdown.style.outline = '2px solid var(--color-accent-fg, #0969da)';
            dropdown.style.outlineOffset = '-1px';
        });
        dropdown.addEventListener('blur', () => {
            dropdown.style.outline = 'none';
        });

        dropdown.addEventListener('change', (event) => {
            const selectedValue = event.target.value;
            if (!selectedValue) return;

            if (selectedValue === 'manage') {
                // Show management dialog
                showManageFiltersDialog();
            } else {
                const selectedId = parseInt(selectedValue);
                const filters = getSavedFilters();
                const filter = filters.find(f => f.id === selectedId);
                
                if (filter) {
                    applyFilter(filter.value);
                }
            }
            
            dropdown.value = '';
        });

        updateDropdown(dropdown);
        return dropdown;
    }

    function updateDropdown(dropdown) {
        dropdown = dropdown || document.getElementById(DROPDOWN_ID);
        if (!dropdown) return;

        const filters = getSavedFilters();
        dropdown.innerHTML = '';

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = filters.length > 0 ? '常用筛选...' : '无保存的筛选';
        dropdown.appendChild(defaultOption);

        filters.forEach(filter => {
            const option = document.createElement('option');
            option.value = filter.id;
            option.textContent = filter.name;
            option.title = filter.value;
            dropdown.appendChild(option);
        });

        // Add manage option if there are saved filters
        if (filters.length > 0) {
            const separator = document.createElement('option');
            separator.disabled = true;
            separator.textContent = '────────';
            dropdown.appendChild(separator);

            const manageOption = document.createElement('option');
            manageOption.value = 'manage';
            manageOption.textContent = '🗑️ 管理筛选条件';
            manageOption.style.fontStyle = 'italic';
            dropdown.appendChild(manageOption);
        }

        dropdown.style.display = filters.length > 0 ? 'block' : 'none';
    }

    function createFormatButton() {
        const existingButton = document.getElementById(BUTTON_ID);
        if (existingButton) {
            return existingButton;
        }

        const button = document.createElement('button');
        button.id = BUTTON_ID;
        button.textContent = BUTTON_TEXT;
        button.type = 'button';
        button.title = '转换为模糊搜索格式';
        button.className = 'btn-sm';

        // Style for button inside input with GitHub native look
        button.style.position = 'absolute';
        button.style.top = '50%';
        button.style.right = '28px';
        button.style.transform = 'translateY(-50%)';
        button.style.zIndex = '10';
        button.style.padding = '3px 8px';
        button.style.fontSize = '12px';
        button.style.height = '24px';
        button.style.lineHeight = '1';
        button.style.display = 'inline-flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.border = '1px solid var(--color-border-default, rgba(31, 35, 40, 0.15))';
        button.style.borderRadius = '6px';
        button.style.backgroundColor = 'var(--color-btn-bg, #f6f8fa)';
        button.style.color = 'var(--color-fg-default, #24292f)';
        button.style.cursor = 'pointer';
        button.style.fontWeight = '500';
        button.style.whiteSpace = 'nowrap';
        button.style.transition = 'background-color 0.2s, border-color 0.2s';

        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = 'var(--color-btn-hover-bg, #f3f4f6)';
            button.style.borderColor = 'var(--color-border-muted, rgba(31, 35, 40, 0.3))';
        });
        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = 'var(--color-btn-bg, #f6f8fa)';
            button.style.borderColor = 'var(--color-border-default, rgba(31, 35, 40, 0.15))';
        });

        button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const currentDomInput = document.getElementById(INPUT_ID);
            if (!currentDomInput) return;
            filterInput = currentDomInput;

            if (filterInput.value.trim() !== '') {
                const originalValue = filterInput.value;
                const newValue = `title:*${originalValue}*`;
                applyFilter(newValue);
            }
        });
        return button;
    }

    function createToolbar() {
        const existingToolbar = document.getElementById(TOOLBAR_ID);
        if (existingToolbar) {
            return existingToolbar;
        }

        const toolbar = document.createElement('div');
        toolbar.id = TOOLBAR_ID;
        toolbar.style.display = 'flex';
        toolbar.style.alignItems = 'center';
        toolbar.style.marginBottom = '4px';
        toolbar.style.gap = '0';
        toolbar.style.paddingLeft = '0';
        toolbar.style.paddingRight = '0';
        toolbar.style.width = 'auto';

        return toolbar;
    }

    function adjustLayout() {
        if (!filterInput || !inputWrapper || !formatButton) return;

        // Ensure input fills the wrapper and has box-sizing: border-box
        filterInput.style.width = '100%';
        filterInput.style.boxSizing = 'border-box';

        // Temporarily show button to measure its width if it was hidden
        const wasButtonHidden = formatButton.style.display === 'none';
        if (wasButtonHidden) {
            formatButton.style.visibility = 'hidden';
            formatButton.style.display = 'inline-flex';
        }

        const buttonActualWidth = formatButton.offsetWidth;

        if (wasButtonHidden) {
            formatButton.style.display = 'none';
            formatButton.style.visibility = 'visible';
        }

        const wrapperInnerWidth = inputWrapper.clientWidth -
                                 (parseFloat(getComputedStyle(inputWrapper).paddingLeft) || 0) -
                                 (parseFloat(getComputedStyle(inputWrapper).paddingRight) || 0);

        const spaceForButtonAndGap = buttonActualWidth + 16; // Button width + gap from right edge

        // Check if there's enough space for the button AND a minimum text area
        if (buttonActualWidth > 0 && (wrapperInnerWidth - spaceForButtonAndGap) >= MIN_INPUT_TEXT_AREA_WIDTH) {
            filterInput.style.paddingRight = `${spaceForButtonAndGap}px`;
            formatButton.style.display = 'inline-flex';
        } else {
            // Not enough space, hide button and reset padding
            filterInput.style.paddingRight = '8px';
            formatButton.style.display = 'none';
        }
    }

    function setupInputAndButton() {
        const currentDomInput = document.getElementById(INPUT_ID);

        if (!currentDomInput) {
            // Input disappeared, cleanup
            if (resizeObserver && inputWrapper) {
                resizeObserver.unobserve(inputWrapper);
            }
            if (formatButton && formatButton.parentNode) formatButton.parentNode.removeChild(formatButton);
            if (toolbar && toolbar.parentNode) toolbar.parentNode.removeChild(toolbar);
            if (inputWrapper && inputWrapper.parentNode && inputWrapper.classList.contains(WRAPPER_CLASS)) {
                const originalParent = inputWrapper.parentNode;
                if (filterInput && document.body.contains(filterInput) && filterInput.parentElement !== originalParent) {
                    originalParent.insertBefore(filterInput, inputWrapper);
                    filterInput.style.paddingRight = '';
                    filterInput.style.width = '';
                }
                originalParent.removeChild(inputWrapper);
            }
            filterInput = null;
            inputWrapper = null;
            formatButton = null;
            toolbar = null;
            saveButton = null;
            savedFiltersDropdown = null;
            return;
        }

        filterInput = currentDomInput;

        // Setup input wrapper for fuzzy button
        if (filterInput.parentElement && filterInput.parentElement.classList.contains(WRAPPER_CLASS)) {
            inputWrapper = filterInput.parentElement;
        } else {
            inputWrapper = document.createElement('div');
            inputWrapper.classList.add(WRAPPER_CLASS);
            inputWrapper.style.position = 'relative';

            // Mimic original input's display
            const originalInputComputedStyle = getComputedStyle(filterInput);
            inputWrapper.style.display = originalInputComputedStyle.display;
            
            if (originalInputComputedStyle.display === 'block' || originalInputComputedStyle.display === 'flex') {
                inputWrapper.style.width = '100%';
            } else if (originalInputComputedStyle.display === 'inline-block') {
                if (originalInputComputedStyle.width !== 'auto' && !originalInputComputedStyle.width.includes('%')) {
                    inputWrapper.style.width = originalInputComputedStyle.width;
                }
            }
            
            if (filterInput.parentElement && getComputedStyle(filterInput.parentElement).display.includes('flex')) {
                inputWrapper.style.flexGrow = originalInputComputedStyle.flexGrow;
                inputWrapper.style.flexShrink = originalInputComputedStyle.flexShrink;
                inputWrapper.style.flexBasis = originalInputComputedStyle.flexBasis;
            }

            if (filterInput.parentNode) {
                filterInput.parentNode.insertBefore(inputWrapper, filterInput);
                inputWrapper.appendChild(filterInput);
            } else {
                console.warn("[Tampermonkey] Filter input has no parent, cannot wrap.");
                return;
            }
        }

        // Add fuzzy button to input wrapper
        if (!formatButton || !inputWrapper.contains(formatButton)) {
            formatButton = createFormatButton();
            inputWrapper.appendChild(formatButton);
        }

        // Setup toolbar above input
        // Find the filter-bar-module__Filter_0--v8FnK div which is the form container
        let formContainer = filterInput.closest('[id="filter-bar-component"]');
        if (!formContainer) {
            console.warn("[Tampermonkey] Could not find filter-bar-component");
            return;
        }

        // Find the parent that contains the entire filter section
        let filterContainer = formContainer.closest('.tokenized-filter-input-module__Box--w5A7b');
        if (!filterContainer) {
            // Try alternative selector for the filter container
            filterContainer = formContainer.parentElement;
            if (!filterContainer) {
                console.warn("[Tampermonkey] Could not find tokenized filter container");
                return;
            }
        }

        // Create or find toolbar
        if (!toolbar || !document.body.contains(toolbar)) {
            toolbar = createToolbar();
            
            // Insert toolbar before the filter container
            if (filterContainer.parentNode) {
                filterContainer.parentNode.insertBefore(toolbar, filterContainer);
            } else {
                console.warn("[Tampermonkey] Could not insert toolbar");
                return;
            }
        }

        // Add dropdown and save button to toolbar
        if (!savedFiltersDropdown || !toolbar.contains(savedFiltersDropdown)) {
            savedFiltersDropdown = createDropdown();
            toolbar.appendChild(savedFiltersDropdown);
        }

        if (!saveButton || !toolbar.contains(saveButton)) {
            saveButton = createSaveButton();
            toolbar.appendChild(saveButton);
        }

        // Initial layout adjustment
        adjustLayout();

        // Observe wrapper for size changes
        if (typeof ResizeObserver !== 'undefined') {
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
            resizeObserver = new ResizeObserver(entries => {
                requestAnimationFrame(adjustLayout);
            });
            if (inputWrapper) {
                resizeObserver.observe(inputWrapper);
            }
        }

        // Update dropdown visibility
        updateDropdown();
    }

    const mutationObserver = new MutationObserver(() => {
        const currentInput = document.getElementById(INPUT_ID);
        if (currentInput) {
            if (!inputWrapper || !inputWrapper.contains(currentInput) || !formatButton || !inputWrapper.contains(formatButton) || !toolbar || !document.body.contains(toolbar)) {
                setupInputAndButton();
            }
        } else if (filterInput) {
            setupInputAndButton(); // This will trigger the cleanup logic
        }
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    setTimeout(setupInputAndButton, 1000);

})();