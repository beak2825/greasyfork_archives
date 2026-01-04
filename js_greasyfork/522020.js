// ==UserScript==
// @name         文字助手-2025新年贺岁版
// @version      2.1
// @description  解锁强制复制，取消所有网站【禁止复制】和【禁止粘贴】限制，支持【免费OCR识别】
// @author       诸葛
// @license      MIT
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/1271291
// @downloadURL https://update.greasyfork.org/scripts/522020/%E6%96%87%E5%AD%97%E5%8A%A9%E6%89%8B-2025%E6%96%B0%E5%B9%B4%E8%B4%BA%E5%B2%81%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/522020/%E6%96%87%E5%AD%97%E5%8A%A9%E6%89%8B-2025%E6%96%B0%E5%B9%B4%E8%B4%BA%E5%B2%81%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*****************************************************************************
     *                        0. 配置与全局变量
     *****************************************************************************/
    const DISABLED_EVENTS = [
        'contextmenu', 'selectstart',
        'copy', 'cut', 'paste',
        'keydown', 'keypress', 'keyup',
        'mousedown', 'mouseup'
    ];
    const OCR_BUTTON_HIDE_KEY = 'ocrButtonHidePermanently';
    const UNLOCK_ENABLED_KEY = 'unlockFeatureEnabled'; // 是否启用解锁的标记

    // OCR按钮 & 弹窗引用
    let ocrBtn = null;
    let popup = null;

    // 用于捕获阶段事件移除
    const captureHandlers = {};

    // 在脚本开始时，先读取标记，决定是否启用解锁
    let isEnabled = (localStorage.getItem(UNLOCK_ENABLED_KEY) === 'true');

    /*****************************************************************************
     *                        1. 如果标记已开启，则立即拦截事件
     *****************************************************************************/
    if (isEnabled) {
        // 在最早（document-start）阶段拦截，效果最好
        enableUnlockCore();
    }

    /**
     * 核心启用函数：真正拦截事件
     * 只在 document-start 阶段执行才能 100% 覆盖网站脚本
     */
    function enableUnlockCore() {
        const originalAdd = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            if (DISABLED_EVENTS.includes(type)) {
                return; // 拦截
            }
            return originalAdd.call(this, type, listener, options);
        };

        const originalRemove = EventTarget.prototype.removeEventListener;
        EventTarget.prototype.removeEventListener = function(type, listener, options) {
            return originalRemove.call(this, type, listener, options);
        };

        // 清空 document/window 上的 onXXX 事件
        DISABLED_EVENTS.forEach(evt => {
            document['on' + evt] = null;
            window['on' + evt] = null;
        });

        // 在捕获阶段阻断各类事件
        DISABLED_EVENTS.forEach(evt => {
            const handler = function(e) {
                e.stopPropagation();
                e.stopImmediatePropagation();
            };
            captureHandlers[evt] = handler;
            document.addEventListener(evt, handler, true);
        });

        console.log('【解锁功能】已在 document-start 阶段启用');
    }

    /**
     * 关闭核心功能
     * 仅在刷新页面后才会彻底复原到未启用状态
     */
    function disableUnlockCore() {
        // 尝试移除捕获阶段监听器
        Object.keys(captureHandlers).forEach(evt => {
            const handler = captureHandlers[evt];
            document.removeEventListener(evt, handler, true);
        });
        console.log('【解锁功能】已关闭核心逻辑（下次刷新生效）');
    }

    /*****************************************************************************
     *   2. DOM 加载完成后，插入控制按钮 & OCR按钮（若已启用）
     *****************************************************************************/
    function onDOMReady() {
        createControlButtons();

        // 如果功能已启用，并且OCR没有被永久关闭，则显示OCR按钮
        if (isEnabled && localStorage.getItem(OCR_BUTTON_HIDE_KEY) !== 'true') {
            createOcrButton();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onDOMReady);
    } else {
        onDOMReady();
    }

    /*****************************************************************************
     *                3. “启用/关闭”控制按钮 & 刷新流程
     *****************************************************************************/
    function createControlButtons() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.left = '20px';
        container.style.top = '50%';
        container.style.transform = 'translateY(-50%)';
        container.style.zIndex = 999998;
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';

        if (!isEnabled) {
            // 若当前为关闭状态，显示“启用功能”按钮
            const enableBtn = document.createElement('button');
            enableBtn.textContent = '启用功能';
            styleButton(enableBtn, '#17a2b8'); // 蓝绿色
            enableBtn.addEventListener('click', () => {
                if (isEnabled) {
                    showMessage('功能已是开启状态，无需重复开启');
                    return;
                }
                localStorage.setItem(UNLOCK_ENABLED_KEY, 'true');
                showMessage('功能已启用，页面将刷新以生效', 2000);
                setTimeout(() => {
                    location.reload();
                }, 2000);
            });
            container.appendChild(enableBtn);
        } else {
            // 若当前为启用状态，显示“关闭功能”按钮
            const disableBtn = document.createElement('button');
            disableBtn.textContent = '关闭功能';
            styleButton(disableBtn, '#6c757d'); // 灰色
            disableBtn.addEventListener('click', () => {
                if (!isEnabled) {
                    showMessage('功能已是关闭状态，无需重复关闭');
                    return;
                }
                localStorage.setItem(UNLOCK_ENABLED_KEY, 'false');
                showMessage('功能已关闭，页面将刷新以生效', 2000);
                // 先局部disable
                disableUnlockCore();
                setTimeout(() => {
                    location.reload();
                }, 2000);
            });
            container.appendChild(disableBtn);
        }

        document.body.appendChild(container);
    }

    // 给按钮统一加点样式
    function styleButton(btn, bgColor) {
        btn.style.padding = '10px 16px';
        btn.style.borderRadius = '6px';
        btn.style.border = 'none';
        btn.style.backgroundColor = bgColor;
        btn.style.color = '#fff';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '14px';
        btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
    }

    /*****************************************************************************
     *               4. 文字助手按钮 & 弹窗
     *****************************************************************************/
    function createOcrButton() {
        if (ocrBtn) return;
        ocrBtn = document.createElement('button');
        ocrBtn.textContent = '文字助手';
        styleButton(ocrBtn, '#28a745'); // 绿色
        ocrBtn.style.position = 'fixed';
        ocrBtn.style.left = '20px';
        ocrBtn.style.top = '50%';
        ocrBtn.style.transform = 'translateY(-50%)';
        ocrBtn.style.zIndex = 999999;
        ocrBtn.style.marginTop = '80px'; // 与控制按钮错开一点
        ocrBtn.addEventListener('click', showOcrPopup);
        document.body.appendChild(ocrBtn);
    }

    function removeOcrButton() {
        if (ocrBtn) {
            ocrBtn.remove();
            ocrBtn = null;
        }
        closePopup();
    }

    function showOcrPopup() {
        if (popup) {
            popup.style.display = 'block';
            return;
        }

        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.3)';
        overlay.style.zIndex = 1000000;

        popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.left = '50%';
        popup.style.top = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.width = '320px';
        popup.style.backgroundColor = '#fff';
        popup.style.borderRadius = '8px';
        popup.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        popup.style.padding = '20px';
        popup.style.textAlign = 'center';

        const text = document.createElement('p');
        text.textContent = '文字助手暂未完全开发，这里提供免费OCR链接供使用。';
        text.style.margin = '0 0 20px 0';
        popup.appendChild(text);

        const btnContainer = document.createElement('div');
        btnContainer.style.display = 'flex';
        btnContainer.style.justifyContent = 'space-between';
        btnContainer.style.gap = '10px';

        // 使用助手
        const useBtn = document.createElement('button');
        useBtn.textContent = '使用助手';
        styleButton(useBtn, '#007bff');
        useBtn.style.flex = '1';
        useBtn.addEventListener('click', () => {
            window.open('https://hiroi-sora.lanzoul.com/s/umi-ocr', '_blank');
            closePopup();
        });
        btnContainer.appendChild(useBtn);

        // 本次关闭
        const closeOnceBtn = document.createElement('button');
        closeOnceBtn.textContent = '本次关闭';
        styleButton(closeOnceBtn, '#6c757d');
        closeOnceBtn.style.flex = '1';
        closeOnceBtn.addEventListener('click', () => {
            removeOcrButton();
            closePopup();
        });
        btnContainer.appendChild(closeOnceBtn);

        // 永久关闭
        const closeForeverBtn = document.createElement('button');
        closeForeverBtn.textContent = '永久关闭';
        styleButton(closeForeverBtn, '#dc3545');
        closeForeverBtn.style.flex = '1';
        closeForeverBtn.addEventListener('click', () => {
            localStorage.setItem(OCR_BUTTON_HIDE_KEY, 'true');
            removeOcrButton();
            closePopup();
        });
        btnContainer.appendChild(closeForeverBtn);

        popup.appendChild(btnContainer);
        overlay.appendChild(popup);
        document.body.appendChild(overlay);
    }

    function closePopup() {
        if (popup) {
            popup.remove();
            popup = null;
        }
        const overlay = document.querySelector('div[style*="background-color: rgba(0,0,0,0.3)"]');
        if (overlay) overlay.remove();
    }

    /*****************************************************************************
     *               5. 全局提示函数 (默认3秒自动消失)
     *****************************************************************************/
    function showMessage(msg, duration = 3000) {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.2)';
        overlay.style.zIndex = 1000002;

        const box = document.createElement('div');
        box.style.position = 'fixed';
        box.style.left = '50%';
        box.style.top = '50%';
        box.style.transform = 'translate(-50%, -50%)';
        box.style.minWidth = '200px';
        box.style.backgroundColor = '#fff';
        box.style.borderRadius = '8px';
        box.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        box.style.padding = '16px';
        box.style.textAlign = 'center';

        const p = document.createElement('p');
        p.textContent = msg;
        p.style.margin = '0 0 12px 0';
        box.appendChild(p);

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        styleButton(closeBtn, '#007bff');
        closeBtn.style.padding = '5px 10px';
        closeBtn.addEventListener('click', () => {
            overlay.remove();
        });
        box.appendChild(closeBtn);

        overlay.appendChild(box);
        document.body.appendChild(overlay);

        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.remove();
            }
        }, duration);
    }
})();
