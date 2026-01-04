// ==UserScript==
// @name         Fucking Bilibili Author Info
// @author       Amamiya
// @icon         https://www.bilibili.com/favicon.ico
// @version      1.0
// @description  去除bilibili专栏复制文本后的作者信息
// @match        https://www.bilibili.com/read/*
// @grant        none
// @namespace https://greasyfork.org/users/801480
// @downloadURL https://update.greasyfork.org/scripts/472241/Fucking%20Bilibili%20Author%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/472241/Fucking%20Bilibili%20Author%20Info.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('beforecopy', function(e) {
        var selection = window.getSelection();
        var copiedText = selection.toString();
        // 使用 Clipboard API 将文本设置到剪贴板
        navigator.clipboard.writeText(copiedText)
            .then(function() {
                console.log('Text copied to clipboard successfully');
            })
            .catch(function(error) {
                console.error('Failed to copy text to clipboard:', error);
            });
        e.preventDefault();
    });
})();