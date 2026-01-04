// ==UserScript==
// @name         GoogleのAI概要をブロックする
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Googleの検索結果に表示されるAI概要をHTTPリクエストのブロックと要素の非表示により強力にブロックします。
// @author       You
// @match        *://*.google.com/*
// @grant        none
// @license MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/519018/Google%E3%81%AEAI%E6%A6%82%E8%A6%81%E3%82%92%E3%83%96%E3%83%AD%E3%83%83%E3%82%AF%E3%81%99%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/519018/Google%E3%81%AEAI%E6%A6%82%E8%A6%81%E3%82%92%E3%83%96%E3%83%AD%E3%83%83%E3%82%AF%E3%81%99%E3%82%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 指定した親要素の階層まで遡って非表示にする関数
    function hideAncestor(element, levels) {
        let parent = element;
        for (let i = 0; i < levels; i++) {
            if (parent) {
                parent = parent.parentElement;
            } else {
                return;
            }
        }
        if (parent) {
            parent.style.display = 'none';
        }
    }

    // 指定されたテキストを含む要素を探して親要素を非表示にする関数
    function hideParentBlock() {
        // <h1> 要素の処理
        const headings = document.querySelectorAll('h1');
        headings.forEach(heading => {
            if (heading.innerText.includes('AI による概要')) {
                const parent = heading.closest('div');
                if (parent) {
                    parent.style.display = 'none';
                }
            }
        });

        // <strong> 要素の処理（階層が深いケース）
        const strongElements = document.querySelectorAll('strong');
        strongElements.forEach(strong => {
            if (strong.innerText.includes('AI による概要')) {
                hideAncestor(strong, 8); // 8階層上の親要素を非表示にする
            }
        });
    }

    // XMLHttpRequestのオーバーライド
    const originalXHR = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function (method, url) {
        if (url.includes('/async/folsrch')) {
            console.log('Blocked XMLHttpRequest to:', url);
            return; // リクエストをキャンセル
        }
        return originalXHR.apply(this, arguments);
    };

    // fetchのオーバーライド
    const originalFetch = window.fetch;
    window.fetch = function (input, init) {
        const url = typeof input === 'string' ? input : input.url;
        if (url.includes('/async/folsrch')) {
            console.log('Blocked fetch to:', url);
            return Promise.reject(new Error('Blocked request to /async/folsrch'));
        }
        return originalFetch.apply(this, arguments);
    };

    // DOMの変更を監視して新しい要素にも対応
    const observer = new MutationObserver(hideParentBlock);

    // 初期ロード時と監視開始
    if (document.readyState === 'loading') {
        // ページのロード中
        document.addEventListener('DOMContentLoaded', () => {
            hideParentBlock();
            observer.observe(document.body, { childList: true, subtree: true });
        });
    } else {
        // 既にロードされている場合
        hideParentBlock();
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();
