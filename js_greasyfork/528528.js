// ==UserScript==
// @name         ID検索簡易化
// @namespace    ID検索簡易化
// @version      2.1
// @description  おんjでID検索の簡易化。
// @author       Wai
// @match        *://hayabusa.open2ch.net/test/read.cgi/livejupiter/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528528/ID%E6%A4%9C%E7%B4%A2%E7%B0%A1%E6%98%93%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/528528/ID%E6%A4%9C%E7%B4%A2%E7%B0%A1%E6%98%93%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createSearchButton(idElement) {
        const idValue = idElement.getAttribute('val');
        const boardUrl = 'https://find.open2ch.net/?bbs=livejupiter&t=f&q=' + idValue;

        // すでにボタンがある場合は追加しない
        if (idElement.parentNode.querySelector('.searchButton')) {
            return;
        }

        const searchButton = document.createElement('button');
        searchButton.textContent = '検索';
        searchButton.style.marginRight = '5px';
        searchButton.classList.add('searchButton');
        searchButton.addEventListener('click', function() {
            window.open(boardUrl, '_blank');
        });

        idElement.parentNode.insertBefore(searchButton, idElement);
    }

    function processIdElements(elements) {
        elements.forEach(createSearchButton);
    }

    // 初期ページのID要素を処理
    processIdElements(document.querySelectorAll('span._id'));

    // DOMの変更を監視
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const idElements = node.querySelectorAll('span._id');
                        processIdElements(idElements);
                    }
                });
            }
        });
    });

    // 監視を開始
    observer.observe(document.body, { childList: true, subtree: true });
})();