// ==UserScript==
// @name         WatchPorn Auto Filter Preset Manager
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Visually select categories, save presets with file download/upload, glassmorphism UI theme, auto-remove promotional headers, seamless home page integration
// @author       6969RandomGuy6969
// @match        https://watchporn.to/*
// @icon         https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://watchporn.to/&size=256
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/541718/WatchPorn%20Auto%20Filter%20Preset%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/541718/WatchPorn%20Auto%20Filter%20Preset%20Manager.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'wp_saved_presets';
    const FAVORITES_KEY = 'wp_favorite_categories';
    const ACTIVE_PRESET_KEY = 'wp_active_preset';

    let filterButton = null;
    let categoryCheckboxes = [];

    // Determine if we're on search page or home page
    const isSearchPage = window.location.pathname.includes('/search/');
    const isHomePage = window.location.pathname === '/' || window.location.pathname === '';

    // Home Page Integration - Seamless Button Replacement
    if (isHomePage) {
        const CONFIG = {
            buttonText: "Filter Preset",
            searchUrl: "https://watchporn.to/search/",
            fallbackSelectors: [
                'a[href*="go.lnkpth.com"]',
                'a[href*="hotdates"]',
                'a[href*="dates"]',
                '.promo-link',
                '.affiliate-link'
            ]
        };

        // Inject seamless styles immediately
        function injectHomePageStyles() {
            if (document.getElementById('home-filter-styles')) return;

            const styleSheet = document.createElement('style');
            styleSheet.id = 'home-filter-styles';
            styleSheet.textContent = `
                .filter-preset-btn {
                    background: rgba(255, 255, 255, 0.1) !important;
                    backdrop-filter: blur(10px) !important;
                    border: 1px solid rgba(255, 255, 255, 0.2) !important;
                    border-radius: 8px !important;
                    padding: 8px 16px !important;
                    color: #fff !important;
                    text-decoration: none !important;
                    transition: all 0.3s ease !important;
                    font-weight: 500 !important;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;
                    display: inline-block !important;
                }

                .filter-preset-btn:hover {
                    background: rgba(255, 255, 255, 0.2) !important;
                    transform: translateY(-2px) !important;
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3) !important;
                }

                .filter-preset-container {
                    opacity: 0;
                    animation: fadeInSmooth 0.5s ease-in-out forwards;
                }

                @keyframes fadeInSmooth {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .promo-hiding {
                    opacity: 0 !important;
                    transition: opacity 0.2s ease-out !important;
                }
            `;
            (document.head || document.documentElement).appendChild(styleSheet);
        }

        function findPromoTarget() {
            // Try specific selector first
            let target = document.querySelector('a[href^="https://go.lnkpth.com/aff_f?h=SEJeqF"]');
            if (target) return target;

            // Try fallback selectors
            for (const selector of CONFIG.fallbackSelectors) {
                target = document.querySelector(selector);
                if (target) return target;
            }

            // Try finding by text content
            const links = document.querySelectorAll('a');
            for (const link of links) {
                const text = link.textContent.toLowerCase();
                if (text.includes('hot dates') || text.includes('dates') || text.includes('❤️')) {
                    return link;
                }
            }

            return null;
        }

        function createFallbackHomeButton() {
            const container = document.createElement('div');
            container.className = 'filter-preset-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
            `;

            const button = document.createElement('a');
            button.href = CONFIG.searchUrl;
            button.target = '_self';
            button.textContent = CONFIG.buttonText;
            button.className = 'filter-preset-btn';

            container.appendChild(button);
            document.body.appendChild(container);

            return button;
        }

        function replacePromoTarget(target) {
            target.classList.add('promo-hiding');

            setTimeout(() => {
                const container = document.createElement('div');
                container.className = 'filter-preset-container';

                const newButton = target.cloneNode(true);
                newButton.textContent = CONFIG.buttonText;
                newButton.href = CONFIG.searchUrl;
                newButton.target = '_self';
                newButton.className = (newButton.className || '') + ' filter-preset-btn';
                newButton.classList.remove('promo-hiding');

                container.appendChild(newButton);
                target.parentNode.replaceChild(container, target);

                console.log('✅ Filter Preset button created on home page');
            }, 200);
        }

function initHomePage() {
    injectHomePageStyles();

    // --- Add Filter Preset button next to Home link (NEW, standalone) ---
    const homeLinkLi = document.querySelector('a#item1')?.parentElement;
    if (homeLinkLi && !document.querySelector('#filter-preset-li')) {
        const li = document.createElement('li');
        li.id = 'filter-preset-li';

        const button = document.createElement('a');
        button.href = CONFIG.searchUrl;
        button.textContent = CONFIG.buttonText;
        button.className = 'filter-preset-btn';
        button.style.cursor = 'pointer';

        li.appendChild(button);
        homeLinkLi.parentNode.insertBefore(li, homeLinkLi.nextSibling);

        console.log('✅ Filter Preset button added next to Home link (independent)');

    }
}


        // Initialize home page functionality
        function homePageReady(fn) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', fn);
            } else {
                fn();
            }
        }

        homePageReady(() => {
            initHomePage();

            // Watch for dynamic content changes
            const observer = new MutationObserver((mutations) => {
                let shouldReinit = false;

                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === 1) {
                                const hasPromoLink = node.querySelector && (
                                    node.querySelector('a[href*="go.lnkpth.com"]') ||
                                    node.querySelector('a[href*="hotdates"]')
                                );
                                if (hasPromoLink) shouldReinit = true;
                            }
                        });
                    }
                });

                if (shouldReinit && !document.querySelector('.filter-preset-btn')) {
                    setTimeout(initHomePage, 100);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });

        // Backup initialization
        setTimeout(() => {
            if (!document.querySelector('.filter-preset-btn')) {
                console.log('🔄 Home page backup initialization triggered');
                initHomePage();
            }
        }, 2000);
    }

    // Search Page Functionality - Original Script
    if (isSearchPage) {
        // Function to remove promotional headers
        function removePromotionalHeaders() {
            const h1Elements = document.querySelectorAll('h1');
            h1Elements.forEach(h1 => {
                const text = h1.textContent.trim();
                if (text.toLowerCase().includes('videos in') && text.includes(',')) {
                    console.log('Removing promotional header:', text.substring(0, 50) + '...');
                    h1.remove();
                }
            });
        }

        function downloadFile(content, filename) {
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        function waitForCategories(callback) {
            const checkExist = setInterval(() => {
                const categories = document.querySelectorAll('input[id^="category_filter_"]');
                if (categories.length > 0) {
                    clearInterval(checkExist);
                    callback();
                }
            }, 200);
            setTimeout(() => clearInterval(checkExist), 10000);
        }

        function applyCategories(ids) {
            const checkboxes = document.querySelectorAll('input[id^="category_filter_"]');
            checkboxes.forEach(cb => {
                const shouldBeChecked = ids.includes(cb.id);
                if (cb.checked !== shouldBeChecked) cb.click();
            });
            requestAnimationFrame(() => triggerAjaxUpdate(ids));
        }

        function triggerAjaxUpdate(categoryIds = null) {
            let categoryParam = '';
            if (categoryIds) {
                categoryParam = categoryIds.map(id => id.replace('category_filter_', '')).join(',');
            } else {
                const checkedBoxes = document.querySelectorAll('input[id^="category_filter_"]:checked');
                categoryParam = Array.from(checkedBoxes).map(cb => cb.id.replace('category_filter_', '')).join(',');
            }

            const urlParams = new URLSearchParams(window.location.search);
            const query = urlParams.get('q') || '';
            const currentSort = document.querySelector('.sort strong')?.textContent || 'Most Relevant';

            let sortParam = 'relevance';
            if (currentSort.includes('Latest')) sortParam = 'post_date';
            else if (currentSort.includes('Most Viewed')) sortParam = 'video_viewed';
            else if (currentSort.includes('Top Rated')) sortParam = 'rating';
            else if (currentSort.includes('Longest')) sortParam = 'duration';
            else if (currentSort.includes('Most Commented')) sortParam = 'most_commented';
            else if (currentSort.includes('Most Favorited')) sortParam = 'most_favourited';

            const params = `q:${query};category_ids:${categoryParam};sort_by:${sortParam}`;
            const existingSortLink = document.querySelector('a[data-action="ajax"]');

            if (existingSortLink) {
                const tempLink = existingSortLink.cloneNode(true);
                tempLink.setAttribute('data-parameters', params);
                if (window.jQuery && typeof window.jQuery.fn.click === 'function') {
                    window.jQuery(tempLink).click();
                } else {
                    document.querySelector('form[action*="filter"] button[type="submit"]')?.click();
                }
            } else {
                document.querySelector('form[action*="filter"] button[type="submit"]')?.click();
            }

            setTimeout(() => {
                removePromotionalHeaders();
            }, 500);
        }

        function createFilterButton() {
            if (filterButton) return;

            const sortDiv = document.querySelector('.sort');
            if (!sortDiv) return;

            const filterDropdown = document.createElement('div');
            filterDropdown.className = 'wp-filter-dropdown';
            filterDropdown.innerHTML = `<div class="sort"><span></span><strong>Filters</strong></div>`;

            filterDropdown.querySelector('.sort').addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                categoryCheckboxes = Array.from(document.querySelectorAll('input[id^="category_filter_"]'));
                if (categoryCheckboxes.length > 0) createUI(categoryCheckboxes);
            });

            sortDiv.parentNode.insertBefore(filterDropdown, sortDiv);
            filterButton = filterDropdown;

            if (!document.getElementById('wp-persistent-styles')) {
                const style = document.createElement('style');
                style.id = 'wp-persistent-styles';
                style.textContent = `.wp-filter-dropdown{position:relative;display:inline-block;margin-right:10px}.wp-filter-dropdown .sort{position:relative;border-radius:15px;background-color:#212121;color:#fff;font-size:12px;font-weight:500;letter-spacing:0.3px;padding:8px 10px;margin:0 15px 0 0;min-width:140px;transition:background-color 0.3s,border-radius 0.3s;cursor:pointer}.wp-filter-dropdown .sort:hover{background-color:#276fdb}`;
                document.head.appendChild(style);
            }
        }

        function createUI(categoryCheckboxes) {
            const presets = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
            let activePreset = localStorage.getItem(ACTIVE_PRESET_KEY) || '';

            document.querySelector('.wp-overlay')?.remove();

            function showCustomAlert(message) {
                const alertOverlay = document.createElement('div');
                alertOverlay.className = 'wp-custom-dialog-overlay';
                alertOverlay.innerHTML = `
                    <div class="wp-custom-dialog">
                        <div class="wp-dialog-header"></div>
                        <div class="wp-dialog-message">${message}</div>
                        <div class="wp-dialog-buttons">
                            <button class="wp-dialog-btn wp-dialog-ok">OK</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(alertOverlay);
                setTimeout(() => alertOverlay.classList.add('show'), 10);

                alertOverlay.querySelector('.wp-dialog-ok').addEventListener('click', () => {
                    alertOverlay.classList.remove('show');
                    setTimeout(() => alertOverlay.remove(), 300);
                });
            }

            function showCustomConfirm(message, callback) {
                const confirmOverlay = document.createElement('div');
                confirmOverlay.className = 'wp-custom-dialog-overlay';
                confirmOverlay.innerHTML = `
                    <div class="wp-custom-dialog">
                        <div class="wp-dialog-header">Confirm</div>
                        <div class="wp-dialog-message">${message}</div>
                        <div class="wp-dialog-buttons">
                            <button class="wp-dialog-btn wp-dialog-cancel">Cancel</button>
                            <button class="wp-dialog-btn wp-dialog-confirm">Confirm</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(confirmOverlay);
                setTimeout(() => confirmOverlay.classList.add('show'), 10);

                confirmOverlay.querySelector('.wp-dialog-cancel').addEventListener('click', () => {
                    confirmOverlay.classList.remove('show');
                    setTimeout(() => confirmOverlay.remove(), 300);
                    callback(false);
                });

                confirmOverlay.querySelector('.wp-dialog-confirm').addEventListener('click', () => {
                    confirmOverlay.classList.remove('show');
                    setTimeout(() => confirmOverlay.remove(), 300);
                    callback(true);
                });
            }

            function showCustomPrompt(message, callback, defaultValue = '') {
                const promptOverlay = document.createElement('div');
                promptOverlay.className = 'wp-custom-dialog-overlay';
                promptOverlay.innerHTML = `
                    <div class="wp-custom-dialog">
                        <div class="wp-dialog-header"></div>
                        <div class="wp-dialog-message">${message}</div>
                        <input type="text" class="wp-dialog-input" value="${defaultValue}" placeholder="Enter value...">
                        <div class="wp-dialog-buttons">
                            <button class="wp-dialog-btn wp-dialog-cancel">Cancel</button>
                            <button class="wp-dialog-btn wp-dialog-ok">OK</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(promptOverlay);
                setTimeout(() => promptOverlay.classList.add('show'), 10);

                const input = promptOverlay.querySelector('.wp-dialog-input');
                input.focus();
                input.select();

                const handleOk = () => {
                    const value = input.value.trim();
                    promptOverlay.classList.remove('show');
                    setTimeout(() => promptOverlay.remove(), 300);
                    callback(value || null);
                };

                const handleCancel = () => {
                    promptOverlay.classList.remove('show');
                    setTimeout(() => promptOverlay.remove(), 300);
                    callback(null);
                };

                promptOverlay.querySelector('.wp-dialog-ok').addEventListener('click', handleOk);
                promptOverlay.querySelector('.wp-dialog-cancel').addEventListener('click', handleCancel);
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') handleOk();
                    if (e.key === 'Escape') handleCancel();
                });
            }

            const style = document.createElement('style');
            style.textContent = `.wp-overlay{position:fixed;top:0;left:0;right:0;bottom:0;backdrop-filter:blur(10px);background:rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;z-index:9999;opacity:0;transition:opacity 0.3s ease}.wp-overlay.show{opacity:1}.wp-panel{background:rgba(20,20,20,0.95);border:1px solid rgba(255,255,255,0.1);color:#e0e0e0;border-radius:12px;padding:24px;width:580px;max-height:80vh;display:flex;flex-direction:column;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;font-size:14px;box-shadow:0 20px 40px rgba(0,0,0,0.6);transform:translateY(20px);transition:transform 0.3s ease}.wp-overlay.show .wp-panel{transform:translateY(0)}.wp-panel button,.wp-panel select,.wp-panel input[type="text"]{border:1px solid rgba(255,255,255,0.15);border-radius:6px;padding:8px 12px;margin:3px 0;cursor:pointer;background:rgba(40,40,40,0.8);color:#e0e0e0;transition:all 0.2s ease;font-size:13px;font-weight:400;outline:none}.wp-panel button:hover{background:rgba(60,60,60,0.9);border-color:rgba(255,255,255,0.25)}.wp-panel button:active{transform:translateY(1px)}.wp-panel select:hover,.wp-panel input[type="text"]:hover{background:rgba(50,50,50,0.9);border-color:rgba(255,255,255,0.2)}.wp-panel input[type="text"]:focus,.wp-panel select:focus{background:rgba(50,50,50,0.95);border-color:rgba(100,150,200,0.6);box-shadow:0 0 0 2px rgba(100,150,200,0.2)}.wp-panel label{display:flex;align-items:center;margin-bottom:4px;padding:6px 8px;border-radius:4px;transition:background 0.15s ease;cursor:pointer;font-size:13px;width:calc(50% - 4px);box-sizing:border-box}.wp-panel label:hover{background:rgba(255,255,255,0.05)}.wp-panel input[type="checkbox"]{margin-right:10px;accent-color:#4A90E2}.wp-list{overflow-y:auto;max-height:280px;margin:12px 0;border:1px solid rgba(255,255,255,0.1);border-radius:8px;background:rgba(0,0,0,0.4);padding:12px}.wp-list::-webkit-scrollbar{width:6px}.wp-list::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.2);border-radius:3px}.wp-list::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,0.3)}.wp-list::-webkit-scrollbar-track{background:transparent}.wp-categories-grid{display:flex;flex-wrap:wrap;gap:4px;justify-content:space-between}.wp-footer{display:flex;justify-content:space-between;margin-top:auto;padding-top:16px;border-top:1px solid rgba(255,255,255,0.1);gap:8px}.wp-search-container{display:flex;gap:8px;margin-bottom:12px}.wp-search-input{flex:1;margin:0!important}.wp-select-visible-btn{white-space:nowrap;margin:0!important;color:#ffffff!important}.wp-preset-controls{display:flex;justify-content:space-between;margin-bottom:12px;gap:6px}.wp-preset-controls button{flex:1;margin:0;font-size:12px;padding:6px 8px}.wp-header{font-size:18px;font-weight:600;margin-bottom:18px;text-align:center;color:#ffffff}.wp-download-btn{position:relative!important;overflow:visible!important}.wp-download-btn:before{content:'';z-index:-1;position:absolute;display:block;width:110%;height:125%;top:-12.5%;left:-5%;transition:0.3s opacity ease-in-out;filter:blur(10px);opacity:0;background:linear-gradient(60deg,#f79533,#f37055,#ef4e7b,#a166ab,#5073b8,#1098ad,#07b39b,#6fba82)}.wp-download-btn:hover:before{opacity:1!important;transition:0.3s opacity ease-in-out;filter:blur(15px);background:linear-gradient(60deg,#f79533,#f37055,#ef4e7b,#a166ab,#5073b8,#1098ad,#07b39b,#6fba82)!important}.wp-custom-dialog-overlay{position:fixed;top:0;left:0;right:0;bottom:0;backdrop-filter:blur(10px);background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:10000;opacity:0;transition:opacity 0.3s ease}.wp-custom-dialog-overlay.show{opacity:1}.wp-custom-dialog{background:rgba(20,20,20,0.95);border:1px solid rgba(255,255,255,0.1);color:#e0e0e0;border-radius:12px;padding:24px;width:400px;max-width:90vw;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;box-shadow:0 20px 40px rgba(0,0,0,0.6);transform:translateY(20px);transition:transform 0.3s ease}.wp-custom-dialog-overlay.show .wp-custom-dialog{transform:translateY(0)}.wp-dialog-header{font-size:18px;font-weight:600;margin-bottom:16px;text-align:center;color:#ffffff}.wp-dialog-message{margin-bottom:20px;line-height:1.5;color:#e0e0e0;white-space:pre-line}.wp-dialog-input{width:100%;border:1px solid rgba(255,255,255,0.15);border-radius:6px;padding:8px 12px;margin:16px 0;background:rgba(40,40,40,0.8);color:#e0e0e0;font-size:14px;outline:none;box-sizing:border-box}.wp-dialog-input:focus{background:rgba(50,50,50,0.95);border-color:rgba(100,150,200,0.6);box-shadow:0 0 0 2px rgba(100,150,200,0.2)}.wp-dialog-buttons{display:flex;gap:10px;justify-content:flex-end}.wp-dialog-btn{border:1px solid rgba(255,255,255,0.15);border-radius:6px;padding:8px 16px;cursor:pointer;background:rgba(40,40,40,0.8);color:#e0e0e0;transition:all 0.2s ease;font-size:13px;font-weight:400;outline:none}.wp-dialog-btn:hover{background:rgba(60,60,60,0.9);border-color:rgba(255,255,255,0.25)}.wp-dialog-btn:active{transform:translateY(1px)}.wp-dialog-confirm{background:rgba(70,130,200,0.8)!important}.wp-dialog-confirm:hover{background:rgba(70,130,200,1)!important}`;
            document.head.appendChild(style);

            const overlay = document.createElement('div');
            overlay.className = 'wp-overlay';
            overlay.innerHTML = `
                <div class="wp-panel">
                    <div class="wp-header">WatchPorn Filter Manager</div>
                    <div class="wp-search-container">
                        <input type="text" placeholder="Search categories..." class="wp-search-input">
                        <button class="wp-select-visible-btn">Select All Visible</button>
                    </div>
                    <select class="wp-preset-select">
                        <option value="">Select a preset...</option>
                    </select>
                    <div class="wp-preset-controls">
                        <button class="wp-save-btn">Save</button>
                        <button class="wp-export-btn">Export</button>
                        <button class="wp-import-btn">Import</button>
                        <button class="wp-delete-btn">Delete</button>
                    </div>
                    <div class="wp-list">
                        <div class="wp-categories-grid"></div>
                    </div>
                    <div class="wp-footer">
                        <button class="wp-uncheck-btn">Uncheck All</button>
                        <button class="wp-download-btn">Download Auto Preview</button>
                        <button class="wp-close-btn">Close</button>
                    </div>
                </div>
            `;

            const panel = overlay.querySelector('.wp-panel');
            const searchInput = panel.querySelector('.wp-search-input');
            const presetSelect = panel.querySelector('.wp-preset-select');
            const form = panel.querySelector('.wp-categories-grid');

            let searchTimeout;

            function rebuildPresetSelect() {
                const currentPresets = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
                presetSelect.innerHTML = '<option value="">Select a preset...</option>';
                Object.keys(currentPresets).forEach(name => {
                    const opt = document.createElement('option');
                    opt.value = name;
                    opt.textContent = name;
                    if (name === activePreset) opt.selected = true;
                    presetSelect.appendChild(opt);
                });
            }

            function buildCategoryList() {
                const sorted = categoryCheckboxes.slice().sort((a, b) =>
                    (favorites.includes(b.id) - favorites.includes(a.id)) || (b.checked - a.checked)
                );

                form.innerHTML = '';
                const fragment = document.createDocumentFragment();

                sorted.forEach(checkbox => {
                    const labelText = checkbox.nextElementSibling?.textContent.trim() ||
                                    checkbox.id.replace('category_filter_', '');

                    const container = document.createElement('label');
                    container.innerHTML = `
                        <input type="checkbox" value="${checkbox.id}" ${checkbox.checked ? 'checked' : ''}>
                        <span>${labelText}</span>
                    `;

                    const cb = container.querySelector('input');
                    cb.addEventListener('change', () => {
                        const target = document.getElementById(cb.value);
                        if (target && target.checked !== cb.checked) target.click();
                        requestAnimationFrame(() => triggerAjaxUpdate());
                    });

                    fragment.appendChild(container);
                });
                form.appendChild(fragment);
            }

            rebuildPresetSelect();
            buildCategoryList();

            // All event listeners from original script...
            panel.querySelector('.wp-select-visible-btn').addEventListener('click', () => {
                form.querySelectorAll('label').forEach(label => {
                    if (label.style.display !== 'none') {
                        const cb = label.querySelector('input[type="checkbox"]');
                        if (cb && !cb.checked) cb.click();
                    }
                });
            });

            panel.querySelector('.wp-save-btn').addEventListener('click', () => {
                showCustomPrompt('Enter preset name:', (presetName) => {
                    if (presetName?.trim()) {
                        const currentPresets = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
                        const selected = Array.from(form.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
                        currentPresets[presetName.trim()] = selected;
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentPresets));
                        activePreset = presetName.trim();
                        localStorage.setItem(ACTIVE_PRESET_KEY, activePreset);
                        rebuildPresetSelect();
                        presetSelect.value = activePreset;
                        showCustomAlert(`Preset "${presetName.trim()}" saved successfully!`);
                    }
                });
            });

            panel.querySelector('.wp-export-btn').addEventListener('click', () => {
                const name = presetSelect.value;
                if (!name) {
                    showCustomAlert('Please select a preset to export.');
                    return;
                }
                const currentPresets = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
                if (currentPresets[name]) {
                    const exportData = {
                        name, categories: currentPresets[name], version: '2.0',
                        exportDate: new Date().toISOString()
                    };
                    const filename = `watchporn_preset_${name.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
                    downloadFile(JSON.stringify(exportData, null, 2), filename);
                    showCustomAlert(`Preset "${name}" exported successfully!\nFile: ${filename}`);
                }
            });

            panel.querySelector('.wp-import-btn').addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.txt';
                input.style.display = 'none';
                input.addEventListener('change', (event) => {
                    const file = event.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const importData = JSON.parse(e.target.result);
                            if (!importData.name || !importData.categories || !Array.isArray(importData.categories)) {
                                throw new Error('Invalid preset data');
                            }
                            const currentPresets = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
                            let importName = importData.name;
                            if (currentPresets[importName]) {
                                showCustomPrompt(`Preset "${importName}" already exists. Enter a new name:`, (newName) => {
                                    if (!newName) return;
                                    importName = newName;
                                    processImport();
                                }, importName + '_imported');
                            } else {
                                processImport();
                            }

                            function processImport() {
                                const validCategories = importData.categories.filter(id => document.getElementById(id));
                                if (validCategories.length === 0) {
                                    showCustomAlert('No valid categories found in this preset for the current page.');
                                    return;
                                }
                                if (validCategories.length < importData.categories.length) {
                                    const missing = importData.categories.length - validCategories.length;
                                    showCustomConfirm(`${missing} categories from this preset are not available on this page. Import anyway with ${validCategories.length} categories?`, (confirmed) => {
                                        if (confirmed) finishImport();
                                    });
                                } else {
                                    finishImport();
                                }

                                function finishImport() {
                                    currentPresets[importName] = validCategories;
                                    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentPresets));
                                    localStorage.setItem(ACTIVE_PRESET_KEY, importName);
                                    activePreset = importName;
                                    rebuildPresetSelect();
                                    presetSelect.value = activePreset;
                                    buildCategoryList();
                                    applyCategories(validCategories);
                                    showCustomAlert(`Preset "${importName}" imported and applied successfully with ${validCategories.length} categories!`);
                                }
                            }
                        } catch (error) {
                            showCustomAlert('Invalid preset file. Please check the file and try again.\nError: ' + error.message);
                        }
                    };
                    reader.readAsText(file);
                });
                document.body.appendChild(input);
                input.click();
                document.body.removeChild(input);
            });

            panel.querySelector('.wp-delete-btn').addEventListener('click', () => {
                const name = presetSelect.value;
                if (name) {
                    showCustomConfirm(`Delete preset "${name}"? This action cannot be undone.`, (confirmed) => {
                        if (confirmed) {
                            const currentPresets = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
                            delete currentPresets[name];
                            localStorage.setItem(STORAGE_KEY, JSON.stringify(currentPresets));
                            if (activePreset === name) {
                                activePreset = '';
                                localStorage.setItem(ACTIVE_PRESET_KEY, activePreset);
                            }
                            rebuildPresetSelect();
                            presetSelect.value = '';
                            showCustomAlert(`Preset "${name}" deleted successfully!`);
                        }
                    });
                } else {
                    showCustomAlert('Please select a preset to delete.');
                }
            });

            presetSelect.addEventListener('change', () => {
                const name = presetSelect.value;
                activePreset = name;
                localStorage.setItem(ACTIVE_PRESET_KEY, activePreset);
                if (name) {
                    const currentPresets = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
                    if (currentPresets[name]) {
                        form.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
                        currentPresets[name].forEach(id => {
                            const formCheckbox = form.querySelector(`input[value="${id}"]`);
                            if (formCheckbox) formCheckbox.checked = true;
                        });
                        applyCategories(currentPresets[name]);
                    }
                }
            });

            panel.querySelector('.wp-uncheck-btn').addEventListener('click', () => {
                form.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                    if (cb.checked) cb.click();
                });
            });

            panel.querySelector('.wp-download-btn').addEventListener('click', () => {
                const scriptUrl = 'https://update.sleazyfork.org/scripts/534164/Auto-play%20video%20thumbnails%20for%20sxyprn%2C%20watchporn%2C%20yesporn%2C%20theyarehuge.user.js';
                const tempLink = document.createElement('a');
                tempLink.href = scriptUrl;
                tempLink.download = 'auto-preview-script.user.js';
                tempLink.target = '_blank';
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
                setTimeout(() => {
                    showCustomAlert('Auto Preview script download initiated!\n\nIf the download didn\'t start automatically, the script will open in a new tab.');
                }, 500);
            });

            panel.querySelector('.wp-close-btn').addEventListener('click', () => {
                overlay.classList.remove('show');
                setTimeout(() => overlay.remove(), 300);
            });

            searchInput.addEventListener('input', () => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    const term = searchInput.value.toLowerCase();
                    form.querySelectorAll('label').forEach(label => {
                        const text = label.textContent.toLowerCase();
                        label.style.display = text.includes(term) ? 'flex' : 'none';
                    });
                }, 150);
            });

            document.body.appendChild(overlay);
            setTimeout(() => overlay.classList.add('show'), 10);

            // Auto-apply active preset if exists
            if (activePreset) {
                const currentPresets = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
                if (currentPresets[activePreset]) {
                    setTimeout(() => applyCategories(currentPresets[activePreset]), 1000);
                }
            }
        }

        // Enhanced initialization for search page
        function initializeSearchPage() {
            removePromotionalHeaders();

            waitForCategories(() => {
                const allCheckboxes = Array.from(document.querySelectorAll('input[id^="category_filter_"]'));
                if (allCheckboxes.length > 0) {
                    categoryCheckboxes = allCheckboxes;
                    createFilterButton();

                    // Re-create button on page changes (AJAX updates)
                    const observer = new MutationObserver((mutations) => {
                        mutations.forEach((mutation) => {
                            if (mutation.addedNodes.length > 0) {
                                // Check if sort elements were added/changed
                                const hasSortElements = Array.from(mutation.addedNodes).some(node =>
                                    node.nodeType === 1 && (node.querySelector?.('.sort') || node.classList?.contains('sort'))
                                );
                                if (hasSortElements && !document.querySelector('.wp-filter-dropdown')) {
                                    setTimeout(() => {
                                        filterButton = null; // Reset reference
                                        createFilterButton();
                                    }, 100);
                                }

                                // Check for new promotional headers and remove them
                                const hasNewHeaders = Array.from(mutation.addedNodes).some(node =>
                                    node.nodeType === 1 && (node.tagName === 'H1' || node.querySelector?.('h1'))
                                );
                                if (hasNewHeaders) {
                                    setTimeout(removePromotionalHeaders, 100);
                                }
                            }
                        });
                    });

                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });
                }
            });

            // Set up periodic cleanup for promotional headers
            setInterval(removePromotionalHeaders, 2000);
        }

        // Initialize search page when ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeSearchPage);
        } else {
            initializeSearchPage();
        }
    }

    // Universal initialization for any page not specifically handled
    if (!isSearchPage && !isHomePage) {
        console.log('🔧 WatchPorn Filter Manager loaded on:', window.location.pathname);
    }

})();