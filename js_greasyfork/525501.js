// ==UserScript==
// @name            解除复制限制
// @name:zh         解除复制限制
// @name:en         Unlock Copy Restrictions
// @name:ja         コピー制限解除
// @name:ko         복사 제한 해제
// @name:es         Desbloquear restricciones de copia
// @namespace       gura8390/copy/2
// @version         1.8.1
// @license         MIT
// @icon            https://img.icons8.com/nolan/64/password1.png
// @description     解除网页复制限制并提供可视化控制
// @description:zh  解除网页复制限制并提供可视化控制
// @description:en  Unlock web copy restrictions with visual control
// @description:ja  ウェブのコピー制限を解除し、視覚的な制御を提供。
// @description:ko  웹 페이지의 복사 제한을 해제하고 시각적 제어를 제공하며
// @description:es Desbloquea restricciones de copia en la web y proporciona control visual
// @author          lbihhe
// @match           *://*/*
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand
// @grant           GM_xmlhttpRequest
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/525501/%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/525501/%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
/*!
MIT License

Copyright (c) [2024] [gura8390]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

    // =====================
    // 1. 多语言本地化配置
    // =====================
    const locales = {
        en: {
            menu_toggle_script: "🔄 Toggle Script State",
            menu_toggle_button: "👁️ Toggle Button Display",
            btn_unlock: "🔓 Unlock Restrictions",
            btn_lock: "🔒 Restore Defaults",
            toast_unlocked: "✔️ Copy restrictions unlocked!",
            toast_locked: "✔️ Restrictions restored!"
        },
        zh: {
            menu_toggle_script: "🔄 切换脚本状态",
            menu_toggle_button: "👁️ 切换按钮显示",
            btn_unlock: "🔓 解除限制",
            btn_lock: "🔒 恢复原状",
            toast_unlocked: "✔️ 复制限制已解除！",
            toast_locked: "✔️ 限制已恢复！"
        },
        ja: {
            menu_toggle_script: "🔄 スクリプト状態を切り替え",
            menu_toggle_button: "👁️ ボタン表示を切り替え",
            btn_unlock: "🔓 制限解除",
            btn_lock: "🔒 デフォルトに戻す",
            toast_unlocked: "✔️ コピー制限が解除されました！",
            toast_locked: "✔️ 制限が復元されました！"
        },
        ko: {
            menu_toggle_script: "🔄 스크립트 상태 전환",
            menu_toggle_button: "👁️ 버튼 표시 전환",
            btn_unlock: "🔓 제한 해제",
            btn_lock: "🔒 기본값 복원",
            toast_unlocked: "✔️ 복사 제한이 해제되었습니다!",
            toast_locked: "✔️ 제한이 복원되었습니다!"
        },
        es: {
            menu_toggle_script: "🔄 Cambiar estado del script",
            menu_toggle_button: "👁️ Cambiar visualización del botón",
            btn_unlock: "🔓 Desbloquear restricciones",
            btn_lock: "🔒 Restaurar valores predeterminados",
            toast_unlocked: "✔️ ¡Restricciones de copia desbloqueadas!",
            toast_locked: "✔️ ¡Restricciones restauradas!"
        }
    };

    const lang = navigator.language.toLowerCase();
    let userLang = 'en';
    if (lang.startsWith('zh')) userLang = 'zh';
    else if (lang.startsWith('ja')) userLang = 'ja';
    else if (lang.startsWith('ko')) userLang = 'ko';
    else if (lang.startsWith('es')) userLang = 'es';
    const t = locales[userLang];

// =============================
// 2. 解除复制限制的核心逻辑
// =============================
const CONFIG = {
    ENABLED: 'copy_enabled',
    SHOW_BUTTON: 'show_button'
};

let unlockStyle = null;
let floatButton = null;
const stopPropagation = e => e.stopPropagation();
const eventsList = ['contextmenu', 'copy', 'selectstart'];

const initConfig = () => {
    // 强制初始化为布尔值
    if (typeof GM_getValue(CONFIG.ENABLED) !== 'boolean') {
        GM_setValue(CONFIG.ENABLED, true);
    }
    if (typeof GM_getValue(CONFIG.SHOW_BUTTON) !== 'boolean') {
        GM_setValue(CONFIG.SHOW_BUTTON, true);
    }
};

const toggleButtonDisplay = show => {
    if (show) {
        if (!floatButton) {
            floatButton = createFloatButton();
            // 确保添加到可视区域
            document.documentElement.appendChild(floatButton);
        }
    } else {
        if (floatButton) {
            floatButton.remove();
            floatButton = null;
        }
    }
};

const registerMenu = () => {
    GM_registerMenuCommand(t.menu_toggle_script, () => {
        const current = GM_getValue(CONFIG.ENABLED);
        GM_setValue(CONFIG.ENABLED, !current);
        location.reload();
    });

    GM_registerMenuCommand(t.menu_toggle_button, () => {
        const newState = !GM_getValue(CONFIG.SHOW_BUTTON);
        GM_setValue(CONFIG.SHOW_BUTTON, newState);
        toggleButtonDisplay(newState);
    });
};

const unlockCopy = () => {
    if (!unlockStyle) {
        unlockStyle = document.createElement('style');
        unlockStyle.id = 'copy-unlocker-style';
        unlockStyle.textContent = '*{user-select:auto!important;-webkit-user-select:auto!important;-moz-user-select:auto!important;-ms-user-select:auto!important;}';
        document.head.appendChild(unlockStyle);
    }
    eventsList.forEach(event => document.body.addEventListener(event, stopPropagation, true));
};

const restoreCopy = () => {
    if (unlockStyle) {
        unlockStyle.remove();
        unlockStyle = null;
    }
    eventsList.forEach(event => document.body.removeEventListener(event, stopPropagation, true));
};

const showSuccessToast = (msg, bgColor = '#4CAF50') => {
    const toast = document.createElement('div');
    toast.textContent = msg;
    toast.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 9999;
        opacity: 0;
        animation: fadeSlideIn 0.6s forwards, fadeOut 0.6s 2.5s forwards;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
    if (!document.getElementById('toast-animations')) {
        const style = document.createElement('style');
        style.id = 'toast-animations';
        style.textContent = `
            @keyframes fadeSlideIn {
                0% { transform: translateY(100%); opacity: 0; }
                100% { transform: translateY(0); opacity: 1; }
            }
            @keyframes fadeOut {
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
};

const createFloatButton = () => {
    const btn = document.createElement('button');
    btn.id = 'copy-unlocker-btn';
    const updateLabel = () => {
        btn.textContent = GM_getValue(CONFIG.ENABLED) ? t.btn_lock : t.btn_unlock;
    };
    updateLabel();

    // 增强样式兼容性
    btn.style.cssText = `
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        z-index: 2147483647 !important;
        padding: 12px 17px !important;
        background: linear-gradient(45deg, #00c6ff, #0072ff) !important;
        color: #fff !important;
        border: none !important;
        border-radius: 10px !important;
        cursor: pointer !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
        font-family: system-ui, sans-serif !important;
        font-size: 16px !important;
        margin: 0 !important;
        line-height: 1.5 !important;
    `;

    // 防止网站样式覆盖
    btn.setAttribute('style', btn.style.cssText);

    btn.addEventListener('click', () => {
        const enabled = GM_getValue(CONFIG.ENABLED);
        GM_setValue(CONFIG.ENABLED, !enabled);
        if (!enabled) {
            unlockCopy();
            showSuccessToast(t.toast_unlocked);
        } else {
            restoreCopy();
            showSuccessToast(t.toast_locked, '#F44336');
        }
        updateLabel();
    });

    return btn;
};

// ================================================
// 3. 针对 doc88.com 的特殊优化处理
// ================================================
let path = "";
const website_rule_doc88 = {
    regexp: /doc88\.com/,
    init: () => {
        const style = document.createElement('style');
        style.textContent = '#left-menu { display: none !important; }';
        document.head.appendChild(style);
        GM_xmlhttpRequest({
            url: 'https://res3.doc88.com/resources/js/modules/main-v2.min.js',
            onload: (r) => (path = (r.responseText.match(/\("#cp_textarea"\)\.val\(([\w.]+)\)/) || [])[1])
        });
        if (typeof unsafeWindow.copyText === 'function') {
            path = (unsafeWindow.copyText.toString().match(/<textarea[^>]*>'\+([\w.]+)\+<\/textarea>/) || [])[1];
        }
    }
};

if (website_rule_doc88.regexp.test(location.href)) {
    website_rule_doc88.init();
}

// ================================================
// 4. 针对百度文库的特殊处理
// ================================================
const website_rule_wenku = {
    regexp: /wenku\.baidu\.com\/(view|link|aggs).*/,
    canvasDataGroup: [],
    init: function() {
        // 添加打印相关样式（可选）
        const style = document.createElement("style");
        style.textContent = `@media print { body{ display:block; } }`;
        document.head.appendChild(style);

        // 获取 canvas 的原始 2D 上下文原型（避免使用 __proto__）
        const originObject = {
            context2DPrototype: Object.getPrototypeOf(unsafeWindow.document.createElement("canvas").getContext("2d"))
        };

        // 劫持 document.createElement，当创建 canvas 时覆盖 fillText 方法，捕获绘制文字
        document.createElement = new Proxy(document.createElement, {
            apply: function(target, thisArg, argumentsList) {
                const element = Reflect.apply(target, thisArg, argumentsList);
                if (argumentsList[0] === "canvas") {
                    const tmpData = {
                        canvas: element,
                        data: []
                    };
                    const context = element.getContext("2d");
                    const originalFillText = originObject.context2DPrototype.fillText;
                    context.fillText = function(...args) {
                        tmpData.data.push(args);
                        return originalFillText.apply(this, args);
                    };
                    website_rule_wenku.canvasDataGroup.push(tmpData);
                }
                return element;
            }
        });

        // 伪造 VIP 信息，劫持全局 pageData
        let pageData = {};
        Object.defineProperty(unsafeWindow, "pageData", {
            set: (v) => { pageData = v; },
            get: function() {
                if (!pageData.vipInfo) pageData.vipInfo = {};
                pageData.vipInfo.global_svip_status = 1;
                pageData.vipInfo.global_vip_status = 1;
                pageData.vipInfo.isVip = 1;
                pageData.vipInfo.isWenkuVip = 1;
                return pageData;
            }
        });
    }
};

if (website_rule_wenku.regexp.test(location.href)) {
    website_rule_wenku.init();
}

// ===============================
// 5. 主执行函数
// ===============================
const main = () => {
    initConfig();
    registerMenu();

    // 根据配置应用初始状态
    GM_getValue(CONFIG.ENABLED) ? unlockCopy() : restoreCopy();
    toggleButtonDisplay(GM_getValue(CONFIG.SHOW_BUTTON));

    // 确保按钮在动态内容加载后仍存在
    new MutationObserver(() => {
        if (GM_getValue(CONFIG.SHOW_BUTTON) && !floatButton) {
            toggleButtonDisplay(true);
        }
    }).observe(document.body, { childList: true, subtree: true });
};

// 解决 @run-at document-start 导致的 DOM 未加载问题
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
} else {
    main();
}

})();
