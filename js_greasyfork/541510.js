// ==UserScript== 
// @name 解除复制限制1 
// @name:en 解除复制限制. 
// @name:zh-CN 解除复制限制 
// @namespace https://palerock.cn 
// @version 0.03 
// @description:en 解除复制限制en.. 
// @description:zh-CN 解除复制限制... 
// @require https://greasyfork.org/scripts/372672-everything-hook/code/Everything-Hook.js?version=659315 
// @include * 
// @author qi_liu 
// @match http://*/* 
// @run-at document-start
// @grant none 
// @description 解除复制限制 
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/541510/%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B61.user.js
// @updateURL https://update.greasyfork.org/scripts/541510/%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B61.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* -----------------------------------------------------------
     * 1. 彻底解除 user-select（包含所有伪类）
     * ----------------------------------------------------------- */
    const globalStyle = document.createElement('style');
    globalStyle.textContent = `
        * {
            user-select: text !important;
            -webkit-user-select: text !important;
            -ms-user-select: text !important;
        }
        ::selection {
            background: #b3d4fc !important;
            color: #000 !important;
        }
    `;
    document.documentElement.appendChild(globalStyle);

    /* -----------------------------------------------------------
     * 2. 拦截 addEventListener，屏蔽 copy/selectstart/keydown 等限制
     * ----------------------------------------------------------- */
    const blockEvents = ['copy','cut','paste','contextmenu','selectstart','dragstart','mousedown','keydown'];

    const rawAdd = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (blockEvents.includes(type)) {
            // 忽略网站强加的事件
            return;
        }
        return rawAdd.call(this, type, listener, options);
    };

    /* -----------------------------------------------------------
     * 3. 阻止网站对常见事件强行 preventDefault
     * ----------------------------------------------------------- */
    const rawPrevent = Event.prototype.preventDefault;
    Event.prototype.preventDefault = function() {
        if (blockEvents.includes(this.type)) {
            // 禁止阻止默认行为
            return;
        }
        return rawPrevent.apply(this, arguments);
    };

    /* -----------------------------------------------------------
     * 4. 移除 inline 事件，如 oncopy="return false;"
     * ----------------------------------------------------------- */
    function clearInline() {
        document.querySelectorAll('[oncopy],[oncut],[onpaste],[oncontextmenu],[onselectstart],[ondragstart],[onmousedown],[onkeydown]')
            .forEach(el => {
                el.removeAttribute('oncopy');
                el.removeAttribute('oncut');
                el.removeAttribute('onpaste');
                el.removeAttribute('oncontextmenu');
                el.removeAttribute('onselectstart');
                el.removeAttribute('ondragstart');
                el.removeAttribute('onmousedown');
                el.removeAttribute('onkeydown');
            });
    }

    /* -----------------------------------------------------------
     * 5. 移除 CSS 禁用选择，如 user-select:none / pointer-events:none
     * ----------------------------------------------------------- */
    function fixCss() {
        document.querySelectorAll('*').forEach(el => {
            const style = window.getComputedStyle(el);
            if (style.userSelect === 'none') {
                el.style.userSelect = 'text';
            }
            if (style.pointerEvents === 'none') {
                el.style.pointerEvents = 'auto';
            }
        });
    }

    /* -----------------------------------------------------------
     * 6. DOM 变化监听，自动修复（尤其是 SPA 页面）
     * ----------------------------------------------------------- */
    const observer = new MutationObserver(() => {
        clearInline();
        fixCss();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // 初次执行
    clearInline();
    fixCss();

})();
