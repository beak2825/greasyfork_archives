// ==UserScript==
// @name         嗶哩輕小說電腦網頁顯示滾動條
// @namespace    user
// @version      1.0
// @description  移除隱藏滾動條 CSS，Shift+S切換，提示訊息，狀態記憶
// @match        *://tw.linovelib.com/*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/546404/%E5%97%B6%E5%93%A9%E8%BC%95%E5%B0%8F%E8%AA%AA%E9%9B%BB%E8%85%A6%E7%B6%B2%E9%A0%81%E9%A1%AF%E7%A4%BA%E6%BB%BE%E5%8B%95%E6%A2%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/546404/%E5%97%B6%E5%93%A9%E8%BC%95%E5%B0%8F%E8%AA%AA%E9%9B%BB%E8%85%A6%E7%B6%B2%E9%A0%81%E9%A1%AF%E7%A4%BA%E6%BB%BE%E5%8B%95%E6%A2%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ENABLE_KEY = 'tm_scrollbar_enabled';
    let enabled = GM_getValue(ENABLE_KEY, true);

    function removeHiddenScrollbarCSS() {
        for (const sheet of document.styleSheets) {
            let rules;
            try { rules = sheet.cssRules; } catch(e) { continue; }
            if (!rules) continue;
            const toRemove = [];
            for (let i = 0; i < rules.length; i++) {
                const rule = rules[i];
                if (rule.selectorText && rule.selectorText.includes('::-webkit-scrollbar')) {
                    if (rule.style && rule.style.display === 'none') toRemove.push(i);
                }
            }
            for (let i = toRemove.length - 1; i >= 0; i--) sheet.deleteRule(toRemove[i]);
        }
    }

    function applyScrollbar() {
        if (enabled) removeHiddenScrollbarCSS();
    }

    function toast(msg) {
        const t = document.createElement('div');
        t.textContent = msg;
        Object.assign(t.style, {
            position: 'fixed', bottom: '72px', left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.75)', color: '#fff', padding: '6px 12px',
            borderRadius: '8px', fontSize: '14px', zIndex: 2147483647
        });
        document.documentElement.appendChild(t);
        setTimeout(() => t.remove(), 1500);
    }

    function toggle() {
        enabled = !enabled;
        GM_setValue(ENABLE_KEY, enabled);
        applyScrollbar();
        toast(enabled ? '✅ 滾動條已啟用' : '❌ 滾動條已停用');
    }

    // Shift+S 快捷鍵
    document.addEventListener('keydown', (e) => {
        const tag = (e.target && e.target.tagName) || '';
        const typing = ['INPUT','TEXTAREA','SELECT'].includes(tag) || (e.target && e.target.isContentEditable);
        if (e.shiftKey && e.key.toLowerCase() === 's' && !typing) toggle();
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyScrollbar);
    } else {
        applyScrollbar();
    }

})();
