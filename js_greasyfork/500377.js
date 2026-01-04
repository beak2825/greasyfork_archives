// ==UserScript==
// @name         删除掘金划词后<AI提问>、<解释代码>按钮
// @namespace    http://tampermonkey.net/
// @version      2024-07-12-2
// @description  仅让<AI提问>、<解释代码>按钮不再出现
// @author       muyuanjin
// @match        https://juejin.cn/post/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500377/%E5%88%A0%E9%99%A4%E6%8E%98%E9%87%91%E5%88%92%E8%AF%8D%E5%90%8E%3CAI%E6%8F%90%E9%97%AE%3E%E3%80%81%3C%E8%A7%A3%E9%87%8A%E4%BB%A3%E7%A0%81%3E%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/500377/%E5%88%A0%E9%99%A4%E6%8E%98%E9%87%91%E5%88%92%E8%AF%8D%E5%90%8E%3CAI%E6%8F%90%E9%97%AE%3E%E3%80%81%3C%E8%A7%A3%E9%87%8A%E4%BB%A3%E7%A0%81%3E%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the context menu element
    function removeContextMenu() {
        const contextMenu = document.querySelector('.context-menu');
        if (contextMenu) {
            contextMenu.remove();
        }
    }

    // Observe the body for changes and remove the context menu if it appears
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                removeContextMenu();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial check in case the element is already present
    removeContextMenu();
})();