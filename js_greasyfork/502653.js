// ==UserScript==
// @name         Extend Selection
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  按F2扩展当前选中的文字范围
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502653/Extend%20Selection.user.js
// @updateURL https://update.greasyfork.org/scripts/502653/Extend%20Selection.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 处理键盘按下事件
    document.addEventListener('keydown', function(e) {
        if (e.key === "F2") {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const startContainer = range.startContainer;
                const endContainer = range.endContainer;

                // 向上扩展选区
                if (startContainer.parentNode) {
                    range.setStartBefore(startContainer.parentNode);
                }

                // 向下扩展选区
                if (endContainer.parentNode) {
                    range.setEndAfter(endContainer.parentNode);
                }

                // 更新选区
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    });
})();