// ==UserScript==
// @name         iThome Arrow Key Pager
// @namespace    https://github.com/livinginpurple
// @version      2025.11.27.15
// @description  Navigate iThome pages using Left (←) and Right (→) arrow keys.
// @description:zh-TW 使用方向鍵前往上一頁(←)、下一頁(→)
// @license      WTFPL
// @author       livinginpurple (Refactored by Gemini)
// @match        **://ithelp.ithome.com.tw/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/393224/iThome%20Arrow%20Key%20Pager.user.js
// @updateURL https://update.greasyfork.org/scripts/393224/iThome%20Arrow%20Key%20Pager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        SELECTORS: {
            PREV: '.fa-angle-left',
            NEXT: '.fa-angle-right'
        },
        IGNORED_TAGS: ['INPUT', 'TEXTAREA', 'SELECT']
    };

    /**
     * 執行頁面跳轉
     * @param {string} selector CSS 選擇器
     * @param {string} direction 除錯用的方向名稱
     */
    const navigate = (selector, direction) => {
        const targetIcon = document.querySelector(selector);
        const clickableLink = targetIcon?.closest('a') || targetIcon;
        if (clickableLink) {
            clickableLink.click();
        } else {
            alert(`No ${direction} page!`);
        }
    };

    /**
     * 處理鍵盤事件
     * @param {KeyboardEvent} event
     */
    const handleKeydown = (event) => {
        if (event.altKey || event.ctrlKey || event.shiftKey || event.metaKey) return;
        const activeElement = document.activeElement;
        if (activeElement && (
            CONFIG.IGNORED_TAGS.includes(activeElement.tagName) ||
            activeElement.isContentEditable
        )) {
            return;
        }

        switch (event.key) {
            case 'ArrowLeft':
                navigate(CONFIG.SELECTORS.PREV, 'Previous');
                break;
            case 'ArrowRight':
                navigate(CONFIG.SELECTORS.NEXT, 'Next');
                break;
        }
    };

    document.addEventListener('keydown', handleKeydown);
    console.log(`${GM_info.script.name} loaded.`);
})();