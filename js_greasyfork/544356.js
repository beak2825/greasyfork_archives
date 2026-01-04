// ==UserScript==
// @name         4_Mixed
// @namespace    http://tampermonkey.net/
// @version      1
// @description  整合3功能
// @author       Moz
// @match        https://gs.amazon.com.tw/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/544356/4_Mixed.user.js
// @updateURL https://update.greasyfork.org/scripts/544356/4_Mixed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =================================================================================
    // 0. 全域設定與狀態管理
    // =================================================================================
    const KEYS = { add: 'scriptEnabled_Add', remove: 'scriptEnabled_Remove', edit: 'scriptEnabled_Edit' };
    let states = {
        add: GM_getValue(KEYS.add, false),
        remove: GM_getValue(KEYS.remove, false),
        edit: GM_getValue(KEYS.edit, false)
    };
    const STYLE_IDS = { add: 'style-script-add', remove: 'style-script-remove', edit: 'style-script-edit' };
    let editFeatureObserver = null;


    // =================================================================================
    // 1, 2, 3. 功能模組 (add, remove, edit)
    // =================================================================================
    const addFeature = {
        enable: function() {
            const style = `@import url('https://fonts.googleapis.com/css2?family=Huninn&display=swap'); .pre-nav-background-desktop { position: relative !important; } .custom-top-bar-date-info { position: absolute !important; right: 1.5em; top: 50%; transform: translateY(-50%); font-family: 'Huninn', sans-serif !important; font-size: 14px !important; color: #333333; white-space: nowrap; }`;
            this.injectStyle(style, STYLE_IDS.add); this.run();
        },
        disable: function() { const dateInfo = document.querySelector('.custom-top-bar-date-info'); if (dateInfo) dateInfo.remove(); this.removeStyle(STYLE_IDS.add); },
        run: function() {
             const targetContainer = document.querySelector('.pre-nav-background-desktop'); if (!targetContainer || targetContainer.querySelector('.custom-top-bar-date-info')) return;
             const today = new Date(); const year = today.getFullYear(); const getDayOfYear = (date) => { const start = new Date(date.getFullYear(), 0, 0); const diff = date - start; return Math.floor(diff / (1000 * 60 * 60 * 24)); }; const getWeekNumber = (date) => Math.ceil(getDayOfYear(date) / 7); const getDaysRemainingInYear = () => { const endOfYear = new Date(year, 11, 31); return Math.floor((endOfYear - today) / (1000 * 60 * 60 * 24)); }; const getYearProgressPercentage = () => { const totalDays = ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) ? 366 : 365; return ((getDayOfYear(today) / totalDays) * 100).toFixed(2); };
             const finalString = [`${year}年${today.getMonth() + 1}月${today.getDate()}日`, `第 ${getWeekNumber(today)} 週`, `距離聖誕節還剩 ${getDaysRemainingInYear()} 天`, `今年已過${getYearProgressPercentage()}%`].join('   ||   ');
             const dateInfoDiv = document.createElement('div'); dateInfoDiv.className = 'custom-top-bar-date-info'; dateInfoDiv.textContent = finalString; targetContainer.appendChild(dateInfoDiv);
        },
        injectStyle: (css, id) => { if (document.getElementById(id)) return; const style = document.createElement('style'); style.id = id; style.textContent = css; document.head.appendChild(style); },
        removeStyle: (id) => { const style = document.getElementById(id); if (style) style.remove(); }
    };
    const removeFeature = {
        selectorsToHide: ['#sc-content-container > div > div > div.border-color-squid-ink.padding-left-zero.padding-right-zero.padding-top-zero.padding-bottom-zero.border-left-zero.border-right-zero.border-top-zero.border-bottom-zero.flex-container.flex-align-items-stretch.flex-align-content-flex-start.flex-full-width.amsg-2018.fonts-loaded.border-color-squid-ink.design-Sell > div > div.border-color-squid-ink.padding-left-zero.padding-right-zero.padding-top-zero.padding-bottom-zero.border-left-zero.border-right-zero.border-top-zero.border-bottom-zero.flex-container.flex-align-items-stretch.flex-align-content-flex-start.flex-full-width.amsg-2018.fonts-loaded.border-color-squid-ink.design-Sell > div.background-color-siren.bg-no-repeat.border-color-squid-ink.padding-left-minibase.padding-right-xmini.padding-top-small.padding-bottom-xsmall.border-left-zero.border-right-zero.border-top-zero.border-bottom-zero.flex-container.flex-align-items-stretch.flex-align-content-flex-start.flex-justify-content.flex-justify-content-space-between.flex-full-width.amsg-2018.fonts-loaded.border-color-squid-ink.design-Sell', '#sc-content-container > div > div > div.border-color-squid-ink.padding-left-zero.padding-right-zero.padding-top-zero.padding-bottom-zero.border-left-zero.border-right-zero.border-top-zero.border-bottom-zero.flex-container.flex-align-items-stretch.flex-align-content-flex-start.flex-full-width.amsg-2018.fonts-loaded.border-color-squid-ink.design-Sell > div > div.border-color-squid-ink.padding-left-zero.padding-right-zero.padding-top-zero.padding-bottom-zero.border-left-zero.border-right-zero.border-top-zero.border-bottom-zero.flex-container.flex-align-items-stretch.flex-align-content-flex-start.flex-full-width.amsg-2018.fonts-loaded.border-color-squid-ink.design-Sell > div:nth-child(5) > div > div.border-color-squid-ink.padding-left-xxlarge.padding-right-xxlarge.padding-top-base.padding-bottom-xlarge.border-left-zero.border-right-zero.border-top-zero.border-bottom-zero.flex-container.flex-align-items-stretch.flex-align-content-flex-start.flex-full-width.amsg-2018.fonts-loaded.border-color-squid-ink.design-Sell', '#sc-content-container > div > div > div.border-color-squid-ink.padding-left-zero.padding-right-zero.padding-top-zero.padding-bottom-zero.border-left-zero.border-right-zero.border-top-zero.border-bottom-zero.flex-container.flex-align-items-stretch.flex-align-content-flex-start.flex-full-width.amsg-2018.fonts-loaded.border-color-squid-ink.design-Sell > div > div.border-color-squid-ink.padding-left-zero.padding-right-zero.padding-top-zero.padding-bottom-zero.border-left-zero.border-right-zero.border-top-zero.border-bottom-zero.flex-container.flex-align-items-stretch.flex-align-content-flex-start.flex-full-width.amsg-2018.fonts-loaded.border-color-squid-ink.design-Sell > div.background-color-horizon.border-color-prime-morning.padding-left-xxlarge.padding-right-xxlarge.padding-top-base.padding-bottom-xxlarge.border-left-zero.border-right-zero.border-top-zero.border-bottom-zero.flex-container.flex-align-items-stretch.flex-align-content-flex-start.flex-full-width.amsg-2018.fonts-loaded.border-color-prime-morning.design-Sell.has-wave > div', '#sc-content-container > div > div > div.border-color-squid-ink.padding-left-zero.padding-right-zero.padding-top-zero.padding-bottom-zero.border-left-zero.border-right-zero.border-top-zero.border-bottom-zero.flex-container.flex-align-items-stretch.flex-align-content-flex-start.flex-full-width.amsg-2018.fonts-loaded.border-color-squid-ink.design-Sell > div > div.border-color-squid-ink.padding-left-zero.padding-right-zero.padding-top-zero.padding-bottom-zero.border-left-zero.border-right-zero.border-top-zero.border-bottom-zero.flex-container.flex-align-items-stretch.flex-align-content-flex-start.flex-full-width.amsg-2018.fonts-loaded.border-color-squid-ink.design-Sell > div.background-color-gradient-horizon-180deg.border-color-squid-ink.padding-left-xxlarge.padding-right-xxlarge.padding-top-base.padding-bottom-xsmall.border-left-zero.border-right-zero.border-top-zero.border-bottom-zero.flex-container.flex-align-items-stretch.flex-align-content-flex-start.flex-full-width.amsg-2018.fonts-loaded.border-color-squid-ink.design-Sell', '#sc-content-container > div > div > div.border-color-squid-ink.padding-left-zero.padding-right-zero.padding-top-zero.padding-bottom-zero.border-left-zero.border-right-zero.border-top-zero.border-bottom-zero.flex-container.flex-align-items-stretch.flex-align-content-flex-start.flex-full-width.amsg-2018.fonts-loaded.border-color-squid-ink.design-Sell > div > div.border-color-squid-ink.padding-left-zero.padding-right-zero.padding-top-zero.padding-bottom-zero.border-left-zero.border-right-zero.border-top-zero.border-bottom-zero.flex-container.flex-align-items-stretch.flex-align-content-flex-start.flex-full-width.amsg-2018.fonts-loaded.border-color-squid-ink.design-Sell > div.border-color-squid-ink.padding-left-xxlarge.padding-right-xxlarge.padding-top-base.padding-bottom-zero.border-left-zero.border-right-zero.border-top-zero.border-bottom-zero.flex-container.flex-align-items-stretch.flex-align-content-flex-start.flex-full-width.amsg-2018.fonts-loaded.border-color-squid-ink.design-Sell > div > div.border-color-squid-ink.padding-left-zero.padding-right-zero.padding-top-base.padding-bottom-zero.border-left-zero.border-right-zero.border-top-zero.border-bottom-zero.flex-container.flex-align-items-stretch.flex-align-content-flex-start.flex-full-width.amsg-2018.fonts-loaded.border-color-squid-ink.design-Sell', '#sc-content-container > div > div > div.border-color-squid-ink.padding-left-zero.padding-right-zero.padding-top-zero.padding-bottom-zero.border-left-zero.border-right-zero.border-top-zero.border-bottom-zero.flex-container.flex-align-items-stretch.flex-align-content-flex-start.flex-full-width.amsg-2018.fonts-loaded.border-color-squid-ink.design-Sell > div > div.border-color-squid-ink.padding-left-zero.padding-right-zero.padding-top-zero.padding-bottom-zero.border-left-zero.border-right-zero.border-top-zero.border-bottom-zero.flex-container.flex-align-items-stretch.flex-align-content-flex-start.flex-full-width.amsg-2018.fonts-loaded.border-color-squid-ink.design-Sell > div:nth-child(12) > div.border-color-squid-ink.padding-left-xxlarge.padding-right-xxlarge.padding-top-base.padding-bottom-xsmall.border-left-zero.border-right-zero.border-top-zero.border-bottom-zero.flex-container.flex-align-items-stretch.flex-align-content-flex-start.flex-full-width.amsg-2018.fonts-loaded.border-color-squid-ink.design-Sell', '#sc-content-container > div > div > div.border-color-squid-ink.padding-left-zero.padding-right-zero.padding-top-zero.padding-bottom-zero.border-left-zero.border-right-zero.border-top-zero.border-bottom-zero.flex-container.flex-align-items-stretch.flex-align-content-flex-start.flex-full-width.amsg-2018.fonts-loaded.border-color-squid-ink.design-Sell > div > div.border-color-squid-ink.padding-left-zero.padding-right-zero.padding-top-zero.padding-bottom-zero.border-left-zero.border-right-zero.border-top-zero.border-bottom-zero.flex-container.flex-align-items-stretch.flex-align-content-flex-start.flex-full-width.amsg-2018.fonts-loaded.border-color-squid-ink.design-Sell > div.border-color-squid-ink.padding-left-xxlarge.padding-right-xxlarge.padding-top-base.padding-bottom-zero.border-left-zero.border-right-zero.border-top-zero.border-bottom-zero.flex-container.flex-align-items-stretch.flex-align-content-flex-start.flex-full-width.amsg-2018.fonts-loaded.border-color-squid-ink.design-Sell', '#sc-content-container > div > div > div.border-color-squid-ink.padding-left-zero.padding-right-zero.padding-top-zero.padding-bottom-zero.border-left-zero.border-right-zero.border-top-zero.border-bottom-zero.flex-container.flex-align-items-stretch.flex-align-content-flex-start.flex-full-width.amsg-2018.fonts-loaded.border-color-squid-ink.design-Sell > div > div.border-color-squid-ink.padding-left-zero.padding-right-zero.padding-top-zero.padding-bottom-zero.border-left-zero.border-right-zero.border-top-zero.border-bottom-zero.flex-container.flex-align-items-stretch.flex-align-content-flex-start.flex-full-width.amsg-2018.fonts-loaded.border-color-squid-ink.design-Sell > div:nth-child(12) > div.background-color-squid-ink.border-color-squid-ink.padding-left-zero.padding-right-zero.padding-top-base.padding-bottom-zero.border-left-zero.border-right-zero.border-top-zero.border-bottom-zero.flex-container.flex-align-items-stretch.flex-align-content-flex-start.flex-full-width.amsg-2018.fonts-loaded.border-color-squid-ink.design-Sell', '#sc-content-container > div > div > div.border-color-squid-ink.padding-left-zero.padding-right-zero.padding-top-zero.padding-bottom-zero.border-left-zero.border-right-zero.border-top-zero.border-bottom-zero.flex-container.flex-align-items-stretch.flex-align-content-flex-start.flex-full-width.amsg-2018.fonts-loaded.border-color-squid-ink.design-Sell > div > div.border-color-squid-ink.padding-left-zero.padding-right-zero.padding-top-zero.padding-bottom-zero.border-left-zero.border-right-zero.border-top-zero.border-bottom-zero.flex-container.flex-align-items-stretch.flex-align-content-flex-start.flex-full-width.amsg-2018.fonts-loaded.border-color-squid-ink.design-Sell > div:nth-child(12) > div.background-color-horizon.border-color-squid-ink.padding-left-xxlarge.padding-right-xxlarge.padding-top-base.padding-bottom-xxlarge.border-left-zero.border-right-zero.border-top-zero.border-bottom-zero.flex-container.flex-align-items-stretch.flex-align-content-flex-start.flex-full-width.amsg-2018.fonts-loaded.border-color-squid-ink.design-Sell', '#sc-content-container > div > div > div.border-color-squid-ink.padding-left-zero.padding-right-zero.padding-top-zero.padding-bottom-zero.border-left-zero.border-right-zero.border-top-zero.border-bottom-zero.flex-container.flex-align-items-stretch.flex-align-content-flex-start.flex-full-width.amsg-2018.fonts-loaded.border-color-squid-ink.design-Sell > div > div.border-color-squid-ink.padding-left-zero.padding-right-zero.padding-top-zero.padding-bottom-zero.border-left-zero.border-right-zero.border-top-zero.border-bottom-zero.flex-container.flex-align-items-stretch.flex-align-content-flex-start.flex-full-width.amsg-2018.fonts-loaded.border-color-squid-ink.design-Sell > div.border-color-squid-ink.padding-left-xxlarge.padding-right-xxlarge.padding-top-xsmall.padding-bottom-zero.border-left-zero.border-right-zero.border-top-zero.border-bottom-zero.flex-container.flex-align-items-stretch.flex-align-content-flex-start.flex-full-width.amsg-2018.fonts-loaded.border-color-squid-ink.design-Sell', '#sc-content-container > div > div > div.border-color-squid-ink.padding-left-zero.padding-right-zero.padding-top-zero.padding-bottom-zero.border-left-zero.border-right-zero.border-top-zero.border-bottom-zero.flex-container.flex-align-items-stretch.flex-align-content-flex-start.flex-full-width.amsg-2018.fonts-loaded.border-color-squid-ink.design-Sell > div > div.border-color-squid-ink.padding-left-zero.padding-right-zero.padding-top-zero.padding-bottom-zero.border-left-zero.border-right-zero.border-top-zero.border-bottom-zero.flex-container.flex-align-items-stretch.flex-align-content-flex-start.flex-full-width.amsg-2018.fonts-loaded.border-color-squid-ink.design-Sell > div:nth-child(12) > div.background-color-squid-ink.border-color-squid-ink.padding-left-xxlarge.padding-right-xxlarge.padding-top-zero.padding-bottom-base.border-left-zero.border-right-zero.border-top-zero.border-bottom-zero.flex-container.flex-align-items-stretch.flex-align-content-flex-start.flex-full-width.amsg-2018.fonts-loaded.border-color-squid-ink.design-Sell', '#sc-content-container > div > div > div.border-color-squid-ink.padding-left-zero.padding-right-zero.padding-top-zero.padding-bottom-zero.border-left-zero.border-right-zero.border-top-zero.border-bottom-zero.flex-container.flex-align-items-stretch.flex-align-content-flex-start.flex-full-width.amsg-2018.fonts-loaded.border-color-squid-ink.design-Sell > div > div.background-color-squid-ink-dark.border-color-squid-ink-dark.padding-left-xxlarge.padding-right-xxlarge.padding-top-base.padding-bottom-base.border-left-zero.border-right-zero.border-top-zero.border-bottom-zero.flex-container.flex-align-items-stretch.flex-align-content-flex-start.flex-full-width.amsg-2018.fonts-loaded.border-color-squid-ink-dark.design-Sell'],
        enable: function() { const css = `${this.selectorsToHide.join(',\n')} { display: none !important; }`; this.injectStyle(css, STYLE_IDS.remove); },
        disable: function() { this.removeStyle(STYLE_IDS.remove); },
        injectStyle: (css, id) => { if (document.getElementById(id)) return; const style = document.createElement('style'); style.id = id; style.textContent = css; document.head.appendChild(style); },
        removeStyle: (id) => { const style = document.getElementById(id); if (style) style.remove(); }
    };
    const editFeature = {
        rainbowColors: ['#d78585', '#e6a779', '#e4d48a', '#8dbb9d', '#86a8d1', '#9897c8', '#c09cb9'],
        enable: function() {
            let dynamicStyles = ''; this.rainbowColors.forEach((color, index) => { dynamicStyles += `.rainbow-wrapper-${index}::first-letter { color: ${color} !important; } .nav-item-color-${index}.has-children-open::after, .nav-item-color-${index}.current::after, .nav-item-color-${index}:hover::after { background-color: ${color} !important; } .nav-item-color-${index} ul li a:hover::after { background-color: ${color} !important; }`; });
            this.injectStyle(dynamicStyles, STYLE_IDS.edit); this.run();
        },
        disable: function() { if (editFeatureObserver) { editFeatureObserver.disconnect(); editFeatureObserver = null; } this.removeStyle(STYLE_IDS.edit); this.cleanup(); },
        run: function() {
            const applyEffect = () => { try { document.querySelectorAll('nav.nav-type-main > ul > li.has-children').forEach((li, index) => { if (index >= this.rainbowColors.length) return; li.classList.add(`nav-item-color-${index}`); const mainLink = li.querySelector(':scope > a'); if (mainLink) this.wrapText(mainLink, index); li.querySelectorAll('ul li a').forEach(subLink => this.wrapText(subLink, index)); }); } catch (error) { console.error('修改功能出錯:', error); } };
            if (!editFeatureObserver) { let debounceTimer; editFeatureObserver = new MutationObserver(() => { clearTimeout(debounceTimer); debounceTimer = setTimeout(applyEffect, 200); }); const targetNode = document.body; if (targetNode) { editFeatureObserver.observe(targetNode, { childList: true, subtree: true }); } }
            applyEffect();
        },
        wrapText: function(linkElement, index) { if (linkElement.querySelector(`[class^="rainbow-wrapper-"]`)) return; const originalText = linkElement.textContent.trim(); if (!originalText) return; const wrapperSpan = document.createElement('span'); wrapperSpan.className = `rainbow-wrapper-${index}`; wrapperSpan.textContent = originalText; linkElement.innerHTML = ''; linkElement.appendChild(wrapperSpan); },
        cleanup: function() { document.querySelectorAll('[class*="nav-item-color-"]').forEach(el => { el.className = el.className.replace(/nav-item-color-\d+/g, '').trim(); }); document.querySelectorAll('[class*="rainbow-wrapper-"]').forEach(span => { const parent = span.parentElement; if (parent) { parent.textContent = span.textContent; } }); },
        injectStyle: (css, id) => { if (document.getElementById(id)) return; const style = document.createElement('style'); style.id = id; style.textContent = css; document.head.appendChild(style); },
        removeStyle: (id) => { const style = document.getElementById(id); if (style) style.remove(); }
    };

    // =================================================================================
    // 4. 控制面板 UI
    // =================================================================================
    function createControlPanel() {
        GM_addStyle(`
            /* 1. 將 LOGO 的父容器設為定位錨點，這是最關鍵的一步 */
            .nav-menu-logo-wrapper {
                position: relative !important;
            }

            /* 2. 將面板設為相對於錨點的絕對定位 */
            #master-control-panel {
                position: absolute;
                display: flex;
                gap: 8px;
                /* 3. 精準的座標定位：在父容器的左側、垂直置中 */
                top: 20%;
                right: 25%; /* 關鍵：將面板的右邊緣對齊父容器的左邊緣 */
                margin-right: 18px; /* 在面板和 LOGO 之間創建 18px 的間距 */
                transform: translateY(-50%); /* 垂直置中修正 */
            }
            .control-item-label { cursor: pointer; }
            .control-input { display: none; }
            .control-circle {
                display: block; width: 14px; height: 14px; border-radius: 50%;
                background-color: #cccccc; border: 1px solid #a0a0a0;
                transition: all 0.2s ease-in-out;
                box-shadow: inset 0 1px 2px rgba(0,0,0,0.15);
            }
            .control-circle:hover { transform: scale(1.1); }
            /* 4. 使用 CSS 變數來設定啟用顏色和光暈 */
            .control-input:checked + .control-circle {
                 --glow-color: transparent; /* 預設光暈顏色 */
                 box-shadow: inset 0 1px 2px rgba(0,0,0,0.1), 0 0 8px var(--glow-color);
            }
            .control-input.toggle-add:checked + .control-circle { --glow-color: #d75e5e; background-color: #d75e5e; border-color: #b94b4b; }
            .control-input.toggle-remove:checked + .control-circle { --glow-color: #e69a5a; background-color: #e69a5a; border-color: #c9804b; }
            .control-input.toggle-edit:checked + .control-circle { --glow-color: #64b380; background-color: #64b380; border-color: #509769; }
        `);
        const panel = document.createElement('div'); panel.id = 'master-control-panel';
        const controls = [ { key: 'add', label: '顯示日期資訊' }, { key: 'remove', label: '移除廣告區塊' }, { key: 'edit', label: '啟用彩虹導航' }];
        controls.forEach(control => {
            const label = document.createElement('label'); label.className = 'control-item-label'; label.htmlFor = `toggle-${control.key}`;
            const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.id = `toggle-${control.key}`; checkbox.className = `control-input toggle-${control.key}`; checkbox.checked = states[control.key];
            const circle = document.createElement('span'); circle.className = 'control-circle'; circle.title = control.label;
            label.appendChild(checkbox); label.appendChild(circle); panel.appendChild(label);
            checkbox.addEventListener('change', (e) => {
                const isEnabled = e.target.checked; states[control.key] = isEnabled; GM_setValue(KEYS[control.key], isEnabled); toggleFeature(control.key, isEnabled);
            });
        });
        return panel;
    }

    // =================================================================================
    // 5. 主執行邏輯
    // =================================================================================
    function toggleFeature(key, isEnabled) {
        const featureMap = { add: addFeature, remove: removeFeature, edit: editFeature };
        if (isEnabled) { featureMap[key].enable(); } else { featureMap[key].disable(); }
    }

    function initialize() {
        Object.keys(states).forEach(key => { if (states[key]) { toggleFeature(key, true); } });
    }

    const initInterval = setInterval(() => {
        // **最終的目標容器**
        const logoWrapper = document.querySelector('.nav-menu-logo-wrapper');
        if (logoWrapper) {
            clearInterval(initInterval);
            if (!document.getElementById('master-control-panel')) {
                const controlPanel = createControlPanel();
                // **將面板作為第一個子元素，注入到 LOGO 容器中**
                logoWrapper.prepend(controlPanel);
                initialize();
            }
        }
    }, 300);

})();