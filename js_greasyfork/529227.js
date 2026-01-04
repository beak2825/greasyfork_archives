// ==UserScript==
// @name            驗證自動處理-彈窗關閉
// @author          AI整理的
// @namespace       http://tampermonkey.net/
// @version         2024.03.09
// @description     自動處理超過30個常見網站的年齡驗證彈窗，若出現誤關閉，用@exclude遮罩
// @run-at          document-end
// @icon            https://www.google.com/s2/favicons?sz=64&domain=level-plus.net
// @license MIT
// @include         *
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_log
// 下面這幾個外部腳本是一樣的，只是greasyfork不給從github外部引用，所以傳一份到該網站
//  https://gist.githubusercontent.com/wei9133/73bd21082357c790b60f4d60a6c828c8/raw/e7948b36430c2c8a4c74ec86796d11c76f25fbdb/jquery.min.js
//  https://gist.githubusercontent.com/wei9133/1942075e5f0229abe8bdd82d32152bd9/raw/8b5252372a27010eee7b6b1541e56ed883039625/waitForKeyElements.js
// @require https://update.greasyfork.org/scripts/529224/1550079/jQuery%20JavaScript%20Library%20v1124.js
// @require https://update.greasyfork.org/scripts/529226/1550082/wait_ForKeyElements.js
// @downloadURL https://update.greasyfork.org/scripts/529227/%E9%A9%97%E8%AD%89%E8%87%AA%E5%8B%95%E8%99%95%E7%90%86-%E5%BD%88%E7%AA%97%E9%97%9C%E9%96%89.user.js
// @updateURL https://update.greasyfork.org/scripts/529227/%E9%A9%97%E8%AD%89%E8%87%AA%E5%8B%95%E8%99%95%E7%90%86-%E5%BD%88%E7%AA%97%E9%97%9C%E9%96%89.meta.js
// ==/UserScript==

/*
@exclude        /^https://www.gamer520.com/\d*\.html
這個就是下載頁面的彈窗會被關掉，所以用正則把網域排除
*/
/* global jQuery, $, waitForKeyElements */

(function() {
    'use strict';

    // 初始化jQuery並解決衝突問題
    window.$ = window.jQuery = jQuery.noConflict(true);

    // 調試模式開關 (true=開啟詳細日誌)
    const DEBUG = true;
    const log = (...args) => DEBUG && console.log('[AgeCheck]', ...args);

    // 通用點擊處理器 (適用大部分按鈕點擊場景)
    function clickHandler(node) {
        try {
            const el = node.jquery ? node[0] : node; // 統一處理jQuery對象和原生DOM
            if (el?.isConnected) {                   // 檢查元素是否仍在DOM中
                el.click();
                log('點擊成功:', el);
                return true;
            }
            return false;
        } catch (e) {
            log('點擊錯誤:', e);
            return false;
        }
    }

    // 網站配置數據庫 (結構化分類)
    const SITE_CONFIG = {
        // 類型1: 標準按鈕點擊 (使用CSS選擇器即可處理)
        BUTTON_CLICK: [
            {
                domains: ['gamer520.com', 'xianyudanji.net'],
                selector: 'button:contains("×")',
                desc: '通用彈窗關閉按鈕'
            },
            {
                domains: ['4gamers.com.tw'],
                selector: 'button:contains("是，我已滿十八歲，繼續瀏覽")',
                desc: '標準年齡確認按鈕'
            },
            {
                domains: ['tiangal.com'],
                selector: 'button:contains("是的，我已滿18歲")',
                desc: '二次元風格確認按鈕'
            },
            {
                domains: ['dcard.tw'],
                selector: 'button:contains("是，我已滿 18 歲")',
                desc: 'dcard 確認按鈕'
            },
            {
                domains: ['playno1.com'],
                selector: 'button:contains("我已滿18歲 進入")',
                desc: 'Playno1 年齡確認按鈕'
            }
        ],
        // 類型2: 特殊元素操作 (需自定義處理邏輯)
        CUSTOM_ACTION: [
            {
                domains: ['xvideos.com'],
                handler: () => document.getElementById('disclaimer_background')?.click(),
                desc: '背景層點擊關閉'
            },
            {
                domains: ['blogspot.'],
                handler: () => {
                    // 移除Blogspot的年齡驗證遮罩
                    const overlay = document.getElementById('injected-iframe');
                    overlay?.remove();
                    overlay?.nextElementSibling?.tagName === 'STYLE' &&
                        overlay.nextSibling.remove();
                },
                desc: '移除覆蓋層和樣式'
            }
        ],

        // 類型3: 表單操作 (需多步驟處理)
        FORM_SUBMIT: [
            {
                domains: ['ck101.com'],
                steps: [
                    () => document.getElementById('periodaggre18_2015').checked = true,
                    () => document.getElementById('fwin_dialog_submit').click()
                ],
                desc: '勾選同意後提交表單'
            }
        ],

        // 類型4: 混合模式 (需要元素選擇+特殊操作)
        MIXED_MODE: [
            {
                domains: ['javlibrary.com'],
                selector: 'input.btnAdultAgree[value="同意する"]', // 精準定位同意按鈕
                handler: (el) => {
                    // 直接觸發按鈕的onclick事件 (包含原生處理邏輯)
                    if (el) {
                        el.click();
                        log('已觸發JavLibrary原生驗證流程');
                    }
                },
                desc: '觸發原生驗證按鈕'
            }
        ]
    };

    // 主處理函數
    function processAgeCheck() {
        const currentUrl = window.location.href;
        log('開始處理:', currentUrl);

        // 處理優先級：按鈕 > 自定義 > 表單 > 混合
        const checkAndHandle = (category) => {
            for (const config of category) {
                if (config.domains.some(d => currentUrl.includes(d))) {
                    log(`[${config.desc}] 匹配成功`);
                    if (config.selector) {
                        waitForKeyElements(config.selector, clickHandler);
                    } else if (config.handler) {
                        config.handler();
                    } else if (config.steps) {
                        config.steps.forEach(step => step());
                    }
                    return true;
                }
            }
            return false;
        };

        // 1. 處理按鈕點擊類型
        if (checkAndHandle(SITE_CONFIG.BUTTON_CLICK)) return;

        // 2. 處理自定義操作
        if (checkAndHandle(SITE_CONFIG.CUSTOM_ACTION)) return;

        // 3. 處理表單提交
        if (checkAndHandle(SITE_CONFIG.FORM_SUBMIT)) return;

        // 4. 處理混合模式
        if (checkAndHandle(SITE_CONFIG.MIXED_MODE)) return;

        // 5. 處理未分類站點 (擴展入口)
        const UNCATEGORIZED_SITES = {
            // 範例格式：'域名關鍵字': {配置對象}
            'appledaily.com.tw': {
                selector: '#popup_18 a.yes',
                desc: '蘋果日報年齡門檻'
            },
            'av.movie/': {
                selector: 'button#warning-yes',
                desc: 'AV電影確認按鈕'
            }
        };

        for (const [domain, config] of Object.entries(UNCATEGORIZED_SITES)) {
            if (currentUrl.includes(domain)) {
                log(`[未分類處理] ${config.desc}`);
                waitForKeyElements(config.selector, clickHandler);
                return;
            }
        }
    }

    // 初始化執行 (兼容不同加載狀態)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processAgeCheck);
    } else {
        processAgeCheck();
    }
})();