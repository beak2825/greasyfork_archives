// ==UserScript==
// @name        还原对于选中复制限制
// @name:en     Remove the limitation on copy and selection
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.1
// @author      wray
// @license     GPLV3
// @description 还原对于选中复制限制,通杀大部分网站
// @description:en Remove the limitation on copy and selection. suitable for almost all websites
// @downloadURL https://update.greasyfork.org/scripts/498605/%E8%BF%98%E5%8E%9F%E5%AF%B9%E4%BA%8E%E9%80%89%E4%B8%AD%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/498605/%E8%BF%98%E5%8E%9F%E5%AF%B9%E4%BA%8E%E9%80%89%E4%B8%AD%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function () {
    /**
     * 还原所有修改
     */
    const fixAll = function () {
        function fixChanges() {
            // 修复选中限制
            const styleTag = document.createElement('style');
            styleTag.innerHTML = '* {user-select: auto !important;}';
            document.head.appendChild(styleTag);
            // 修复按键限制
            ['onkeyup', 'onkeydown', 'onkeypress', 'onmousedown', 'onselectstart', 'oncontextmenu'].forEach(event => {
                window[event] = null;
                document[event] = null;
            });
            // 清空计时器
            window.clearInterval(fixChangesInterval);
        }
        const fixChangesInterval = window.setInterval(fixChanges, window.Math.ceil(Math.random() * 128));
    };
    window.onload = fixAll;
    window.addEventListener('popstate', fixAll);
    window.addEventListener('hashchange', fixAll);
})();
