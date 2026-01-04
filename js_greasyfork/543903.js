// ==UserScript==
// @name         Moyou Link
// @namespace    sigma425
// @version      0.1
// @description  Convert 3-4 digit numbers to task links on moyou.snuke.org
// @author       sigma425
// @match        https://moyou.snuke.org/task/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543903/Moyou%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/543903/Moyou%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 3桁から4桁の整数を検索する正規表現
    const numberPattern = /\b(\d{3,4})\b/g;
    
    // テキストノードを走査して数字をリンクに変換する関数
    function convertNumbersToLinks(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            if (numberPattern.test(text)) {
                const parent = node.parentNode;
                const wrapper = document.createElement('span');
                wrapper.innerHTML = text.replace(numberPattern, (match, number) => {
                    // 現在のページの数字と同じ場合はリンクにしない
                    const currentTaskId = window.location.pathname.match(/\/task\/(\d+)/);
                    if (currentTaskId && currentTaskId[1] === number) {
                        return match;
                    }
                    return `<a href="https://moyou.snuke.org/task/${number}" style="color: #0066cc; text-decoration: underline;">${number}</a>`;
                });
                
                // 元のテキストノードを新しい要素で置き換え
                parent.insertBefore(wrapper, node);
                parent.removeChild(node);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // リンクやスクリプトタグ内は処理をスキップ
            if (node.tagName === 'A' || node.tagName === 'SCRIPT' || node.tagName === 'STYLE') {
                return;
            }
            
            // 子ノードを再帰的に処理
            const children = Array.from(node.childNodes);
            children.forEach(child => convertNumbersToLinks(child));
        }
    }
    
    // DOMが読み込まれた後に実行
    function init() {
        // hint部分とcomment部分を対象に処理
        const hintElement = document.getElementById('hint');
        const commentElement = document.getElementById('comment');
        
        if (hintElement) {
            convertNumbersToLinks(hintElement);
        }
        
        if (commentElement) {
            convertNumbersToLinks(commentElement);
        }
        
        // 動的に追加されるコンテンツを監視
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        convertNumbersToLinks(node);
                    }
                });
            });
        });
        
        // hint要素とcomment要素の変更を監視
        if (hintElement) {
            observer.observe(hintElement, { childList: true, subtree: true });
        }
        if (commentElement) {
            observer.observe(commentElement, { childList: true, subtree: true });
        }
    }
    
    // ページが読み込まれたら実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();