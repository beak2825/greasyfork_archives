// ==UserScript==
// @name         MetaLife Ad Blocker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide ads on MetaLife
// @author       You
// @match        https://app.metalife.co.jp/spaces/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542260/MetaLife%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/542260/MetaLife%20Ad%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 広告スクリプトを無効化
    const adScript = document.querySelector('script[src*="adsbygoogle.js"]');
    if (adScript) {
        adScript.remove();
    }

    // 広告要素を非表示にする（仮にclassやidが分かっている場合）
    const adElements = document.querySelectorAll('ins.adsbygoogle');
    adElements.forEach(ad => {
        ad.style.display = 'none';
    });

    // 広告が読み込まれるのを防ぐためにMutationObserverを使用
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.tagName === 'INS' && node.classList.contains('adsbygoogle')) {
                    node.style.display = 'none';
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();