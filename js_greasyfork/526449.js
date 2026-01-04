// ==UserScript==
// @name         ModularGrid Manufacturer Exception Filter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add brand exclusion filtering to ModularGrid module browser
// @author       Your name
// @match        https://modulargrid.net/e/modules/browser*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526449/ModularGrid%20Manufacturer%20Exception%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/526449/ModularGrid%20Manufacturer%20Exception%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SELECTORS = {
        MARKETPLACE: '#SearchMarketplace',
        VENDOR: '#SearchVendor',
        SUBMIT_BOX: '.submit-box',
        CHECKBOXES: '#form-search .grid.last-row .input.cb',
        MODULES: '.box-module',
        VENDOR_LINK: '.lnk-vendor',
        MODULE_COUNT: '.browser .count',
        RESET_BUTTON: '#btn-reset-search',
        BRAND_EXCLUSION: '.brand-exclusion'
    };

    const STYLES = {
        CHECKBOX_CONTAINER: {
            display: 'flex',
            gap: '20px',
            marginTop: '10px'
        },
        HIDDEN_SPAN: {
            visibility: 'hidden',
            position: 'absolute',
            whiteSpace: 'nowrap'
        },
        ADDITIONAL_FILTER: {
            marginBottom: '5px'
        },
        ADDITIONAL_WRAPPER: {
            marginTop: '5px'
        }
    };

    class ModuleFilter {
        constructor() {
            this.init = this.init.bind(this);
            this.applyAllFilters = this.applyAllFilters.bind(this);
            this.resetFilters = this.resetFilters.bind(this);
            
            this.init();
        }

        init() {
            const elements = this.getRequiredElements();
            if (!elements) return;

            const { marketplaceContainer, submitBox, checkboxes } = elements;
            
            const exclusionContainer = this.createMainContainer();
            const additionalFiltersWrapper = this.createAdditionalFiltersWrapper();
            const mainFilter = this.createMainFilter(additionalFiltersWrapper);
            
            exclusionContainer.appendChild(this.createLabel());
            exclusionContainer.appendChild(mainFilter);
            exclusionContainer.appendChild(additionalFiltersWrapper);

            this.insertFilter(exclusionContainer, marketplaceContainer);
            this.setupCheckboxes(checkboxes, submitBox);
            this.setupResetButton();
        }

        appendElements(parent, elements) {
            elements.forEach(element => {
                if (element) parent.appendChild(element);
            });
        }

        getRequiredElements() {
            const marketplaceSelect = document.querySelector(SELECTORS.MARKETPLACE);
            const marketplaceContainer = marketplaceSelect?.closest('.input.select');
            const submitBox = document.querySelector(SELECTORS.SUBMIT_BOX);
            const checkboxes = Array.from(document.querySelectorAll(SELECTORS.CHECKBOXES));

            if (!marketplaceContainer || !submitBox || !checkboxes.length) {
                console.warn('Required elements not found');
                return null;
            }

            return { marketplaceContainer, submitBox, checkboxes };
        }

        createMainContainer() {
            const container = document.createElement('div');
            container.className = 'input select';
            return container;
        }

        createLabel() {
            const label = document.createElement('label');
            label.textContent = 'Exclude Manufacturer';
            return label;
        }

        createAdditionalFiltersWrapper() {
            const wrapper = document.createElement('div');
            Object.assign(wrapper.style, STYLES.ADDITIONAL_WRAPPER);
            return wrapper;
        }

        createMainFilter(additionalFiltersWrapper) {
            const inputAppend = document.createElement('div');
            inputAppend.className = 'input input-append';

            const select = this.createDropdown();
            const addButton = this.createButton('+', () => this.addNewFilter(additionalFiltersWrapper));

            inputAppend.appendChild(select);
            inputAppend.appendChild(addButton);
            this.adjustSelectWidth(select, { min: 100, max: 300, exact: null });
            select.addEventListener('change', () => this.applyAllFilters());

            return inputAppend;
        }

        createDropdown() {
            const select = document.createElement('select');
            select.className = 'brand-exclusion';

            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.text = '-';
            select.appendChild(defaultOption);

            const manufacturerSelect = document.querySelector(SELECTORS.VENDOR);
            if (manufacturerSelect) {
                Array.from(manufacturerSelect.options)
                    .filter(opt => opt.value !== '')
                    .forEach(opt => {
                        const option = document.createElement('option');
                        option.value = opt.value;
                        option.text = opt.text;
                        select.appendChild(option);
                    });
            }

            return select;
        }

        createButton(text, onClick) {
            const button = document.createElement('button');
            button.textContent = text;
            button.className = 'btn';
            button.type = 'button';
            
            button.addEventListener('click', (e) => {
                try {
                    onClick(e);
                } catch (error) {
                    console.warn('Button click handler failed:', error);
                }
            });
            
            return button;
        }

        addNewFilter(container) {
            const inputAppend = document.createElement('div');
            inputAppend.className = 'input input-append';
            Object.assign(inputAppend.style, STYLES.ADDITIONAL_FILTER);

            const select = this.createDropdown();
            const removeButton = this.createButton('×', () => {
                inputAppend.remove();
                this.applyAllFilters();
            });

            inputAppend.appendChild(select);
            inputAppend.appendChild(removeButton);
            container.appendChild(inputAppend);

            this.adjustSelectWidth(select, { min: 100, max: 300, exact: null });
            select.addEventListener('change', () => this.applyAllFilters());
        }

        adjustSelectWidth(select, { min = 100, max = 300, exact = null } = {}) {
            const span = document.createElement('span');
            Object.assign(span.style, { ...STYLES.HIDDEN_SPAN, font: window.getComputedStyle(select).font });
            document.body.appendChild(span);

            const maxWidth = Array.from(select.options).reduce((max, option) => {
                span.textContent = option.text;
                return Math.max(max, span.offsetWidth);
            }, 0);

            span.remove();
            const calculatedWidth = Math.min(Math.max(maxWidth + 30, min), max);
            select.style.width = exact ? `${exact}px` : `${calculatedWidth}px`;
        }

        setupCheckboxes(checkboxes, submitBox) {
            const container = document.createElement('div');
            Object.assign(container.style, STYLES.CHECKBOX_CONTAINER);

            checkboxes.forEach(checkbox => {
                checkbox.remove();
                container.appendChild(checkbox);
            });

            submitBox.parentNode.insertBefore(container, submitBox.nextSibling);
        }

        setupResetButton() {
            const resetButton = document.querySelector(SELECTORS.RESET_BUTTON);
            if (!resetButton) return;

            const originalClick = resetButton.onclick;
            resetButton.onclick = (e) => {
                if (originalClick) originalClick.call(resetButton, e);
                this.resetFilters();
            };
        }

        insertFilter(filter, referenceNode) {
            referenceNode.parentNode.insertBefore(filter, referenceNode.nextSibling);
        }

        applyAllFilters() {
            const excludedBrandIds = Array.from(document.querySelectorAll(SELECTORS.BRAND_EXCLUSION))
                .map(select => select.value)
                .filter(Boolean);

            excludedBrandIds.length ? this.hideExcludedModules(excludedBrandIds) : this.showAllModules();
        }

        showAllModules() {
            document.querySelectorAll(SELECTORS.MODULES)
                .forEach(module => module.style.display = '');
            this.updateModuleCount();
        }

        hideExcludedModules(excludedBrandIds) {
            let visibleCount = 0;
            document.querySelectorAll(SELECTORS.MODULES).forEach(module => {
                const manufacturerLink = module.querySelector(SELECTORS.VENDOR_LINK);
                if (manufacturerLink) {
                    const vendorId = manufacturerLink.href.split('/').pop();
                    module.style.display = excludedBrandIds.includes(vendorId) ? 'none' : '';
                    if (module.style.display === '') visibleCount++;
                }
            });
            this.updateModuleCount();
        }

        updateModuleCount() {
            const countElement = document.querySelector(SELECTORS.MODULE_COUNT);
            if (countElement) {
                const visibleCount = document.querySelectorAll(`${SELECTORS.MODULES}[style="display: ;"]`).length;
                countElement.textContent = `${visibleCount} module${visibleCount !== 1 ? 's' : ''}`;
            }
        }

        resetFilters() {
            document.querySelectorAll(SELECTORS.BRAND_EXCLUSION)
                .forEach(filter => filter.value = '');
            this.showAllModules();
        }
    }

    function initializeFilter() {
        try {
            new ModuleFilter();
        } catch (error) {
            console.warn('ModuleFilter initialization failed:', error);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFilter);
    } else {
        setTimeout(initializeFilter, 100);
    }
})();