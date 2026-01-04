// ==UserScript==
// @name         YouTube Shorts Metapanel Remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide metapanel items in YouTube Shorts
// @author       You
// @match        https://www.youtube.com/shorts*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529654/YouTube%20Shorts%20Metapanel%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/529654/YouTube%20Shorts%20Metapanel%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // MutationObserverの設定を行う関数
    function setupObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(() => {
                // ytReelMetapanelViewModelMetapanelItemクラスを持つ要素を探して非表示にする
                const metapanelItems = document.querySelectorAll('.ytReelMetapanelViewModelMetapanelItem');
                metapanelItems.forEach(item => {
                    if (item) {
                        item.style.display = 'none';
                    }
                });
            });
        });

        // body要素の変更を監視
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // ページ読み込み完了時にObserverを設定
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupObserver);
    } else {
        setupObserver();
    }
})();