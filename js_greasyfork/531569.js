// ==UserScript==
// @name         Geospatial Browser 全画面表示
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Geospatial Browser に全画面表示ボタンを追加する UserScript
// @match        https://lightship.dev/account/geospatial-browser/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531569/Geospatial%20Browser%20%E5%85%A8%E7%94%BB%E9%9D%A2%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/531569/Geospatial%20Browser%20%E5%85%A8%E7%94%BB%E9%9D%A2%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // スタイルを作成する関数
    function createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .fullscreen-map {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                z-index: 9999 !important;
            }
            .fullscreen-toggle {
                position: relative;
                top: 10px;
                right: 10px;
                z-index: 1000;
                background-color: white;
                border: 2px solid #ccc;
                border-radius: 4px;
                padding: 5px;
                cursor: pointer;
                font-size: 20px;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-color 0.3s;
            }
            .fullscreen-toggle:hover {
                background-color: #f0f0f0;
            }
        `;
        document.head.appendChild(style);
    }

    // 全画面表示を切り替える関数
    function toggleFullscreen(mapElement, button) {
        mapElement.classList.toggle('fullscreen-map');
        button.textContent = mapElement.classList.contains('fullscreen-map') ? '↙' : '↗';
    }

    // 全画面切り替えボタンを作成する関数
    function createFullscreenButton(mapElement) {
        const button = document.createElement('button');
        button.className = 'fullscreen-toggle';
        button.textContent = '↗';
        button.title = '全画面表示切り替え';
        button.addEventListener('click', () => toggleFullscreen(mapElement, button));
        mapElement.appendChild(button);
        return button;
    }

    // 地図要素を監視し、読み込まれたらボタンを追加する関数
    function waitForMapElement(callback, maxAttempts = 100, interval = 200) {
        let attempts = 0;

        const checkElement = () => {
            const mapElement = document.querySelector('.mapboxgl-map')?.parentNode?.parentNode;
            if (mapElement) {
                callback(mapElement);
            } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(checkElement, interval);
            } else {
                console.log('地図要素が見つかりませんでした。');
            }
        };

        checkElement();
    }

    // ボタンを設定する関数
    function setupFullscreenButton(mapElement) {
        const button = createFullscreenButton(mapElement);

        // ESCキーで全画面表示を解除
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mapElement.classList.contains('fullscreen-map')) {
                toggleFullscreen(mapElement, button);
            }
        });

        console.log('地図全画面表示UserScriptが正常に設定されました');
    }

    // メイン関数
    function main() {
        createStyles();
        waitForMapElement(setupFullscreenButton);
    }

    // DOMの読み込み完了後にメイン関数を実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();