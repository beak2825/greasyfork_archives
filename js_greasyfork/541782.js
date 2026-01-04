// ==UserScript==
// @name         为什么不让我复制？
// @namespace    http://tampermonkey.net/
// @version      2.3.2
// @description  恢复被网站禁用的复制功能，例如飞书、钉钉、百度文库等。支持ctrl+c、command+c复制。注意默认不启动，且只能解锁纯文本，解锁后仍然会出现弹窗，但可以正常复制内容。使用时请遵守相关法律法规及网站规定，尊重版权和知识产权。
// @author       HuSheng
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license      GPL-2.0-only
// @downloadURL https://update.greasyfork.org/scripts/541782/%E4%B8%BA%E4%BB%80%E4%B9%88%E4%B8%8D%E8%AE%A9%E6%88%91%E5%A4%8D%E5%88%B6%EF%BC%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/541782/%E4%B8%BA%E4%BB%80%E4%B9%88%E4%B8%8D%E8%AE%A9%E6%88%91%E5%A4%8D%E5%88%B6%EF%BC%9F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const original = {
        addEventListener: EventTarget.prototype.addEventListener,
        preventDefault: Event.prototype.preventDefault,
        stopPropagation: Event.prototype.stopPropagation,
        stopImmediatePropagation: Event.prototype.stopImmediatePropagation
    };

    let enabled = false;
    let selectableStyle = null;

    // 注册菜单命令
    GM_registerMenuCommand("启用/关闭 (默认为关闭)", function () {
        enabled = !enabled;
        if (enabled) {
            overrideEvents();
            enableSelectable();
        } else {
            restoreEvents();
            disableSelectable();
        }
        updateTitle();
    });

    function enableSelectable() {
        if (selectableStyle) {
            return;
        }
        selectableStyle = document.createElement('style');
        selectableStyle.textContent = `
            * {
                user-select: text !important;
                -webkit-user-select: text !important;
            }
        `;
        document.documentElement.appendChild(selectableStyle);
    }

    function disableSelectable() {
        if (selectableStyle) {
            selectableStyle.remove();
            selectableStyle = null;
        }
    }

    function updateTitle() {
        if (!document.title) return;
        const prefix = '（✅已解锁） ';
        if (enabled) {
            if (!document.title.startsWith(prefix)) {
                document.title = prefix + document.title.replace(/^（✅已解锁）\s*/, '');
            }
        } else {
            document.title = document.title.replace(/^（✅已解锁）\s*/, '');
        }
    }

    const titleObserver = new MutationObserver(() => {
        if (enabled) {
            updateTitle();
        }
    });
    titleObserver.observe(document.querySelector('title') || document.head, {
        subtree: true,
        characterData: true,
        childList: true
    });

    // 覆盖事件
    function overrideEvents() {
        EventTarget.prototype.addEventListener = function (type, listener, options) {
            if (type === 'copy') {
                return;
            }

            if (type === 'keydown') {
                const listenerStr = listener.toString();
                if (listenerStr.includes('keyCode:67') ||
                    listenerStr.includes('keyCode===67') ||
                    listenerStr.includes('key:"c"') ||
                    (listenerStr.includes('ctrlKey') && listenerStr.includes('67')) ||
                    (listenerStr.includes('metaKey') && listenerStr.includes('67'))) {
                    return;
                }
            }
            original.addEventListener.call(this, type, listener, options);
        };

        Event.prototype.preventDefault = function () {
            if (this.type === 'copy' || (this.type === 'keydown' && this.keyCode === 67 && (this.ctrlKey || this.metaKey))) {
                return;
            }
            original.preventDefault.call(this);
        };

        Event.prototype.stopPropagation = function () {
            if (this.type === 'copy' || (this.type === 'keydown' && this.keyCode === 67 && (this.ctrlKey || this.metaKey))) {
                return;
            }
            original.stopPropagation.call(this);
        };

        Event.prototype.stopImmediatePropagation = function () {
            if (this.type === 'copy' || (this.type === 'keydown' && this.keyCode === 67 && (this.ctrlKey || this.metaKey))) {
                return;
            }
            original.stopImmediatePropagation.call(this);
        };
    }

    // 还原事件
    function restoreEvents() {
        EventTarget.prototype.addEventListener = original.addEventListener;
        Event.prototype.preventDefault = original.preventDefault;
        Event.prototype.stopPropagation = original.stopPropagation;
        Event.prototype.stopImmediatePropagation = original.stopImmediatePropagation;
    }

    const savedListeners = [];

})();
