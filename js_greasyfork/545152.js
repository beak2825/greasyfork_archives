// ==UserScript==
// @name         Comiket Web Catalog 终极解锁脚本
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  弹窗移除，没会员也一样看
// @author       Gemini (Final Lockdown Version)
// @match        https://int.webcatalog.circle.ms/*
// @grant        unsafeWindow
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/545152/Comiket%20Web%20Catalog%20%E7%BB%88%E6%9E%81%E8%A7%A3%E9%94%81%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/545152/Comiket%20Web%20Catalog%20%E7%BB%88%E6%9E%81%E8%A7%A3%E9%94%81%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 可视化日志模块 (与 v0.5 相同) ---
    let logTimer;
    const showVisualLog = (message, type = 'info') => {
        let logDiv = document.getElementById('gm-visual-log-final');
        if (!logDiv) {
            logDiv = document.createElement('div');
            logDiv.id = 'gm-visual-log-final';
            Object.assign(logDiv.style, {
                position: 'fixed', bottom: '15px', right: '15px',
                padding: '10px 15px', borderRadius: '8px', fontSize: '14px',
                zIndex: '99999', opacity: '0', transition: 'opacity 0.5s',
                pointerEvents: 'none', color: '#fff', fontWeight: 'bold'
            });
            if (document.body) document.body.appendChild(logDiv);
            else document.addEventListener('DOMContentLoaded', () => document.body.appendChild(logDiv));
        }
        const colors = {
            success: 'rgba(34, 197, 94, 0.9)',
            info: 'rgba(59, 130, 246, 0.9)',
            warn: 'rgba(234, 179, 8, 0.9)'
        };
        logDiv.style.backgroundColor = colors[type] || colors.info;
        logDiv.textContent = message;
        logDiv.style.opacity = '1';
        clearTimeout(logTimer);
        logTimer = setTimeout(() => { logDiv.style.opacity = '0'; }, 4000);
    };

    // --- 模块一：持续状态强制 (核心升级) ---
    let firstInjectionDone = false;
    const enforcePlatinumState = () => {
        try {
            const nuxtAppEl = document.querySelector('#__nuxt');
            if (!nuxtAppEl || !nuxtAppEl.__vue_app__) return;

            const pinia = nuxtAppEl.__vue_app__.config.globalProperties.$pinia;
            if (!pinia || !pinia.state || !pinia.state.value) return;

            const authStore = pinia.state.value.auth;
            if (!authStore) return;

            // 核心逻辑：检查到状态不为白金时，就强制修改
            if (authStore.isPlatinum === false) {
                authStore.isPlatinum = true;
                console.log('%c[WCC Unlocker] State Enforced: isPlatinum -> true', 'color: #4CAF50; font-weight: bold;');

                // 只有在第一次成功注入或状态被重置后再次注入时才显示日志
                showVisualLog('白金状态已强制锁定！', 'success');
            }

            // 只要成功访问到authStore，就标记为完成过初次注入
            if (!firstInjectionDone) {
                firstInjectionDone = true;
                // 如果首次检查时已经是true，也给个提示
                if (authStore.isPlatinum === true) {
                     showVisualLog('白金状态已确认，持续守护中。', 'info');
                }
            }

        } catch (error) {
            // 静默处理错误，因为会持续重试
        }
    };

    // 启动一个持续运行的定时器，每秒检查5次（200毫秒一次）
    // 这将确保在MSAL跳转回来后，状态能被瞬间修正
    setInterval(enforcePlatinumState, 200);


    // --- 模块二：被动弹窗移除 (后备保险) ---
    const popupTitleText = '需要购买Platinum计划';
    const scrollLockElement = document.documentElement;

    const backupObserver = new MutationObserver(() => {
        const popupCard = Array.from(document.querySelectorAll('.v-card-title')).find(
            el => el.textContent.trim() === popupTitleText
        );
        if (popupCard) {
            const overlayToRemove = popupCard.closest('.v-overlay');
            if (overlayToRemove) {
                overlayToRemove.remove();
                console.warn('%c[WCC Unlocker] Fallback executed: Pop-up forcefully removed.', 'color: #FFC107;');
                showVisualLog('后备机制：已移除弹窗。', 'warn');
                if (scrollLockElement.style.overflow === 'hidden') {
                    scrollLockElement.style.overflow = '';
                }
            }
        }
    });

    window.addEventListener('load', () => {
         backupObserver.observe(document.body, { childList: true, subtree: true });
    });

})();