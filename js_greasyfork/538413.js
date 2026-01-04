// ==UserScript==
// @name         Large Type Display
// @namespace    http://googleyixia.com/
// @version      1.1.3
// @description  全屏以大号字体显示选中的文本。快捷键(默认Alt+D,可自定义)触发。按Esc或点击蒙版退出。
// @author       Byron (and AI assistant)
// @match        *://*/*
// @icon         data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">Aa</text></svg>
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license      CC BY-NC-SA 4.0
// @downloadURL https://update.greasyfork.org/scripts/538413/Large%20Type%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/538413/Large%20Type%20Display.meta.js
// ==/UserScript==

(function() {
    'use_strict';

    let overlayElement = null;
    let currentShortcutKey = 'D';
    const MODIFIER_KEY = 'altKey';

    const MIN_FONT_SIZE_PX = 42; // <-- 最小字体大小更新为 42px

    // 样式
    GM_addStyle(`
        .large-type-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.75);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2147483647;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
            padding: 20px;
            box-sizing: border-box;
        }
        .large-type-overlay.visible {
            opacity: 1;
            visibility: visible;
        }
        .large-type-text {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            color: white;
            text-align: center;
            line-height: 1.5; /* <-- 行间距从 1.2 增加到 1.5 */
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            max-width: 90%;
            overflow-wrap: break-word;
            word-wrap: break-word;
            overflow-y: auto;
            max-height: calc(100vh - 80px);
        }
        .large-type-text span {
             word-break: break-all;
        }
    `);

    function getSelectedText() {
        let text = "";
        if (window.getSelection) {
            text = window.getSelection().toString();
        } else if (document.selection && document.selection.type != "Control") {
            text = document.selection.createRange().text;
        }
        return text.trim();
    }

    function createOverlay() {
        overlayElement = document.createElement('div');
        overlayElement.id = 'large-type-overlay-container';
        overlayElement.className = 'large-type-overlay';

        const textElement = document.createElement('div');
        textElement.className = 'large-type-text';
        textElement.id = 'large-type-content';

        overlayElement.appendChild(textElement);
        document.body.appendChild(overlayElement);

        overlayElement.addEventListener('click', function(event) {
            if (event.target === overlayElement) {
                hideLargeType();
            }
        });
    }

    function showLargeType(textToShow) {
        const selectedText = textToShow;
        if (!selectedText) {
            return;
        }

        if (!overlayElement) {
            createOverlay();
        }

        const textContentElement = overlayElement.querySelector('#large-type-content');
        textContentElement.innerHTML = '';
        const span = document.createElement('span');
        span.textContent = selectedText;
        textContentElement.appendChild(span);

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const textLength = selectedText.length;

        const overlayPaddingTotal = 40;
        const textContainerMaxWidth = (viewportWidth - overlayPaddingTotal) * 0.9;
        const textContainerMaxHeight = viewportHeight - overlayPaddingTotal;
        const targetRenderWidth = textContainerMaxWidth * 0.98;
        const targetRenderHeight = textContainerMaxHeight * 0.95;

        let fontSizePx;

        if (textLength <= 15) {
            let initialSizeByHeight = targetRenderHeight * 0.7;
            if (textLength === 1) initialSizeByHeight = targetRenderHeight * 0.8;
            else if (textLength <= 3) initialSizeByHeight = targetRenderHeight * 0.75;
            let initialSizeByWidth = targetRenderWidth / (Math.max(1, textLength) * 0.55);
            fontSizePx = Math.min(initialSizeByHeight, initialSizeByWidth);
        } else {
            let initialVwEquivalent = 8; // 对于较长文本，此基准可能需要配合新的最小字号进行观察调整
            if (textLength < 30) initialVwEquivalent = 10;
            else if (textLength < 60) initialVwEquivalent = 8;
            else if (textLength < 100) initialVwEquivalent = 7;
            else initialVwEquivalent = 6;
            fontSizePx = (initialVwEquivalent / 100) * viewportWidth;
        }

        fontSizePx = Math.max(MIN_FONT_SIZE_PX, Math.min(fontSizePx, viewportHeight * 0.85));
        textContentElement.style.fontSize = fontSizePx + 'px';

        let loops = 0;
        const maxLoops = 100;
        while (loops < maxLoops && (textContentElement.scrollWidth > targetRenderWidth || textContentElement.scrollHeight > targetRenderHeight)) {
            fontSizePx -= Math.max(1, fontSizePx * 0.05);
            if (fontSizePx < MIN_FONT_SIZE_PX) {
                fontSizePx = MIN_FONT_SIZE_PX;
                textContentElement.style.fontSize = fontSizePx + 'px';
                break;
            }
            textContentElement.style.fontSize = fontSizePx + 'px';
            loops++;
        }

        overlayElement.classList.add('visible');
        document.addEventListener('keydown', handleEscapeKey);
    }

    function hideLargeType() {
        if (overlayElement) {
            if (overlayElement.classList.contains('visible')) {
                overlayElement.classList.remove('visible');
                setTimeout(() => {
                    if (overlayElement) {
                        overlayElement.remove();
                        overlayElement = null;
                    }
                }, 200);
            } else {
                overlayElement.remove();
                overlayElement = null;
            }
            document.removeEventListener('keydown', handleEscapeKey);
        }
    }

    function handleEscapeKey(event) {
        if (event.key === "Escape") {
            hideLargeType();
        }
    }

    function handleShortcut(event) {
        if (event[MODIFIER_KEY] && event.code === 'Key' + currentShortcutKey.toUpperCase() && !event.ctrlKey && !event.shiftKey && !event.metaKey) {
            event.preventDefault();
            event.stopImmediatePropagation();

            const selectedText = getSelectedText();
            if (selectedText) {
                 showLargeType(selectedText);
            }
        }
    }

    async function loadShortcut() {
        currentShortcutKey = await GM_getValue('largeTypeShortcutKey', 'D');
    }

    async function saveShortcut(key) {
        await GM_setValue('largeTypeShortcutKey', key);
        currentShortcutKey = key;
        alert(`快捷键已设置为: Alt + ${currentShortcutKey.toUpperCase()}`);
    }

    function changeShortcut() {
        const newKey = prompt(`请输入新的快捷键字母 (例如 D, L, M)，当前为 Alt + ${currentShortcutKey.toUpperCase()}:`, currentShortcutKey);
        if (newKey && newKey.trim().length === 1 && /^[a-zA-Z]$/.test(newKey.trim())) {
            saveShortcut(newKey.trim().toUpperCase());
        } else if (newKey !== null) {
            alert("无效的按键。请输入单个字母。");
        }
    }

    async function init() {
        await loadShortcut();
        document.addEventListener('keydown', handleShortcut, true);
        GM_registerMenuCommand("设置 大号文本显示 快捷键", changeShortcut, "L");
    }

    init();

})();