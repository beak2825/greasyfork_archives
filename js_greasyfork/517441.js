// ==UserScript==
// @name         livecamrips优化
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  设置 "vjs-big-play-button" 类按钮的 z-index 和 position，并删除所有 <script> 标签
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517441/livecamrips%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/517441/livecamrips%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function modifyButtonStyles() {
        const buttons = document.querySelectorAll('.vjs-big-play-button');
        buttons.forEach(button => {
            button.style.zIndex = '9999999999999999';
            button.style.position = 'absolute';
            console.log('Modified style for button:', button);
        });
    }

    function removeAllScripts() {
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
            script.remove();
            console.log('Removed script:', script);
        });
    }

    // 初始执行一次
    modifyButtonStyles();
    removeAllScripts();

    // 监听页面变化，例如通过 AJAX 加载的新内容
    const observer = new MutationObserver(mutations => {
        mutations.forEach(() => {
            modifyButtonStyles();
            removeAllScripts();
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
