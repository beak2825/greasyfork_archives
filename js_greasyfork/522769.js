// ==UserScript==
// @name         雪のアニメーション
// @namespace    https://www.example.com/
// @version      0.1
// @description  ページに雪のアニメーションを追加します。
// @author       Rabbit
// @match        *://drrrkari.com/room/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522769/%E9%9B%AA%E3%81%AE%E3%82%A2%E3%83%8B%E3%83%A1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/522769/%E9%9B%AA%E3%81%AE%E3%82%A2%E3%83%8B%E3%83%A1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 雪を降らせるための関数
    function createSnow() {
        const snowContainer = document.createElement('div');
        snowContainer.style.position = 'absolute';
        snowContainer.style.top = '0';
        snowContainer.style.left = '0';
        snowContainer.style.width = '100vw';
        snowContainer.style.height = '100vh';
        snowContainer.style.pointerEvents = 'none';
        snowContainer.style.zIndex = '9999';
        document.body.appendChild(snowContainer);

        const snowflakeCount = 100;  // 雪の数
        const maxSize = 10;  // 雪の最大サイズ
        const minSize = 2;  // 雪の最小サイズ

        // 雪を作成する関数
        for (let i = 0; i < snowflakeCount; i++) {
            const snowflake = document.createElement('div');
            snowflake.style.position = 'absolute';
            snowflake.style.backgroundColor = '#FFF';
            snowflake.style.borderRadius = '50%';
            snowflake.style.animation = `fall ${Math.random() * 10 + 5}s linear infinite`; // アニメーション時間を長く設定
            snowflake.style.left = `${Math.random() * 100}vw`;
            snowflake.style.top = `${Math.random() * 100}vh`;
            snowflake.style.width = `${Math.random() * (maxSize - minSize) + minSize}px`;
            snowflake.style.height = snowflake.style.width;

            // アニメーションの追加
            snowflake.style.animationName = 'fall';
            snowflake.style.animationTimingFunction = 'linear';
            snowflake.style.animationIterationCount = 'infinite';
            snowflake.style.animationDuration = `${Math.random() * 10 + 5}s`; // アニメーション時間を長く設定
            snowflake.style.animationDelay = `${Math.random() * 3}s`;

            snowContainer.appendChild(snowflake);
        }
    }

    // CSSアニメーション
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes fall {
            0% {
                transform: translateY(-100px);
            }
            100% {
                transform: translateY(100vh);
            }
        }
    `;
    document.head.appendChild(style);

    // 雪を降らせる
    createSnow();
})();
