// ==UserScript==
// @name            屏蔽Bugly的完善账号信息弹窗
// @namespace       https://github.com/sdokio
// @version         1.0.1
// @author          Tom Lee @1852372658@qq.com
// @description     屏蔽烦人的Bugly完善账号信息弹窗
// @license         MIT

// @match           https://bugly.qq.com/*
// @run-at          document-start

// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/532998/%E5%B1%8F%E8%94%BDBugly%E7%9A%84%E5%AE%8C%E5%96%84%E8%B4%A6%E5%8F%B7%E4%BF%A1%E6%81%AF%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/532998/%E5%B1%8F%E8%94%BDBugly%E7%9A%84%E5%AE%8C%E5%96%84%E8%B4%A6%E5%8F%B7%E4%BF%A1%E6%81%AF%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const popupClassName = 'ant-modal-root';

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    if (node.classList.contains(popupClassName)) {
                        node.style.display = 'none';
                        if (node.parentNode) {
                            node.parentNode.remove();
                            console.log('烦人的Bugly弹窗已经移除!!!');
                        }
                    }
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
