// ==UserScript==
// @name         Stylish Font for miniblox.io
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  stylish font
// @author       Vicky_arut
// @match        https://miniblox.io/*
// @grant        none
// @license      Redistribution prohibited
// @downloadURL https://update.greasyfork.org/scripts/510220/Stylish%20Font%20for%20minibloxio.user.js
// @updateURL https://update.greasyfork.org/scripts/510220/Stylish%20Font%20for%20minibloxio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // フォントスタイルの設定
    const fontStyle = `
        * {
            font-family: 'Comic Sans MS', sans-serif !important;

        }
    `; //color: #333333 !important; font-size: 16px !important;

    // 新しいstyle要素を作成して追加
    const addFontStyle = () => {
        const style = document.createElement('style');
        style.innerHTML = fontStyle;
        document.head.appendChild(style);
    };

    // MutationObserverでページの変更を検知してフォントを適用
    const observer = new MutationObserver(() => {
        addFontStyle();
    });

    // ページ全体を監視
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 最初にフォントを適用
    addFontStyle();
})();