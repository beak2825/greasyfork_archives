// ==UserScript==
// @name         AI Studio Build Focus Mode
// @name:zh-CN   AI Studio Build 专注模式
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Provides a clean "Focus Mode" for the Google AI Studio app builder with a toggle button.
// @description:zh-CN 为 Google AI Studio 应用构建器提供带控制开关的“专注模式”，仅显示预览面板。
// @author       yeahhe
// @license      MIT
// @match        https://aistudio.google.com/app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aistudio.google.com
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/547586/AI%20Studio%20Build%20Focus%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/547586/AI%20Studio%20Build%20Focus%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const FOCUS_MODE_KEY = 'aistudio_focus_mode_status';

    // --- SVG 图标定义 ---
    const ICON_ENTER_FOCUS = ``;
    const ICON_EXIT_FOCUS = ``;

    // --- 样式定义 ---
    const focusStyles = `
        body.focus-mode-active .applet-container {
            position: fixed !important; top: 0 !important; left: 0 !important;
            width: 100vw !important; height: 100vh !important;
            z-index: 99999 !important; padding: 0 !important; border: none !important;
        }
        body.focus-mode-active .applet-container iframe {
            width: 100% !important; height: 100% !important;
        }
        body.focus-mode-active > app-header,
        body.focus-mode-active ms-console-left-panel,
        body.focus-mode-active .console-left-panel,
        body.focus-mode-active ms-console-splitter,
        body.focus-mode-active .console-right-panel > .subheader,
        body.focus-mode-active .console-right-panel > .editor-container,
        body.focus-mode-active .safety-info-container {
            display: none !important; visibility: hidden !important;
        }
        body.focus-mode-active ms-console-content,
        body.focus-mode-active .console-right-panel {
            position: static !important; overflow: visible !important;
        }
    `;

    const buttonStyles = `
        #focus-mode-toggle-btn {
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 100000;
            width: 40px; /* 缩小尺寸 */
            height: 40px; /* 缩小尺寸 */
            background-color: rgba(0, 0, 0, 0.6);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0.6;
            transition: opacity 0.3s ease, transform 0.2s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        #focus-mode-toggle-btn:hover {
            opacity: 1;
            transform: scale(1.1);
        }
        #focus-mode-toggle-btn svg {
            width: 24px; /* SVG图标尺寸 */
            height: 24px; /* SVG图标尺寸 */
        }
    `;

    GM_addStyle(focusStyles + buttonStyles);

    // --- 逻辑部分 ---
    let toggleButton = null;

    function updateButtonState(isFocus) {
        if (!toggleButton) return;
        if (isFocus) {
            toggleButton.innerHTML = ICON_EXIT_FOCUS;
            toggleButton.title = '退出专注模式 (Exit Focus Mode)';
        } else {
            toggleButton.innerHTML = ICON_ENTER_FOCUS;
            toggleButton.title = '进入专注模式 (Enter Focus Mode)';
        }
    }

    function enableFocusMode() {
        document.body.classList.add('focus-mode-active');
        updateButtonState(true);
        GM_setValue(FOCUS_MODE_KEY, true);
        console.log('[Focus Mode] Enabled.');
    }

    function disableFocusMode() {
        document.body.classList.remove('focus-mode-active');
        updateButtonState(false);
        GM_setValue(FOCUS_MODE_KEY, false);
        console.log('[Focus Mode] Disabled.');
    }

    const intervalId = setInterval(() => {
        if (document.querySelector('.applet-container')) {
            clearInterval(intervalId);

            toggleButton = document.createElement('button');
            toggleButton.id = 'focus-mode-toggle-btn';
            document.body.appendChild(toggleButton);

            toggleButton.addEventListener('click', () => {
                if (document.body.classList.contains('focus-mode-active')) {
                    disableFocusMode();
                } else {
                    enableFocusMode();
                }
            });

            const initialState = GM_getValue(FOCUS_MODE_KEY, true);
            if (initialState) {
                enableFocusMode();
            } else {
                disableFocusMode();
            }
        }
    }, 500);

    setTimeout(() => {
        clearInterval(intervalId);
    }, 15000);

})();