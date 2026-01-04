// ==UserScript==
// @name         Script Execution Blocker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  特定のWebページでスクリプトの実行をブロック
// @author       Your Name
// @match        http://drrrkari.com/room/   // 対象のURLを指定
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529364/Script%20Execution%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/529364/Script%20Execution%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 特定のスクリプトをブロック
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.tagName === 'SCRIPT') {
                    const scriptSrc = node.src || '';

                    // ブロックしたいスクリプトの条件
                    if (scriptSrc.includes('unwanted-script.js')) {
                        console.log(`Blocked script: ${scriptSrc}`);
                        node.remove();
                    }
                }
            });
        });
    });

    // DOMの監視を開始
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // 特定の操作を制限
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'S') {
            e.preventDefault();
            alert('保存は禁止されています。');
        }
    });
})();
