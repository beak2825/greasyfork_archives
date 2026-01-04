// ==UserScript==
// @name         AC-Rotate
// @namespace    https://ruku.tellpro.net/
// @version      2025-05-29
// @description  ACが斜めに回転します（labelクラスすべて）
// @author       ruku
// @match        https://atcoder.jp/contests/*/submissions/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atcoder.jp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537633/AC-Rotate.user.js
// @updateURL https://update.greasyfork.org/scripts/537633/AC-Rotate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 回転スタイルの定義を追加
    const style = document.createElement("style");
    style.textContent = `
    @keyframes rotateDiagonal {
        0% {
            transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
        }
        100% {
            transform: rotateX(3600deg) rotateY(3600deg) rotateZ(3600deg);
        }
    }

    .diagonal-rotate {
        display: inline-block;
        animation: rotateDiagonal 5s linear infinite;
        transform-style: preserve-3d;
    }
    `;
    document.head.appendChild(style);

    // labelクラスを持つすべての要素に斜め回転スタイルを適用
    document.querySelectorAll('.label').forEach(el => {
        el.classList.add('diagonal-rotate');
    });
})();
