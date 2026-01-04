// ==UserScript==
// @name         linux.do点赞
// @namespace    
// @version      2024-02-29
// @description  点赞专用
// @author       
// @match        https://linux.do/*
// @icon         https://linux.do/uploads/default/optimized/1X/3a18b4b0da3e8cf96f7eea15241c3d251f28a39b_2_180x180.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489043/linuxdo%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/489043/linuxdo%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickLikeButtons() {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.title === '点赞此帖子') {
                button.click();
            }
        });
    }

    let debounceTimer;
    function observePageChanges() {
        const observer = new MutationObserver(() => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                clickLikeButtons();
            }, 500); // 延迟500毫秒执行
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'complete') {
        observePageChanges();
    } else {
        window.addEventListener('load', observePageChanges);
    }

})();
