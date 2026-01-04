// ==UserScript==
// @name         Waze Utility Buttons
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Wazeエディターからイベントページと国土交通省道路情報ページへリダイレクトするためのボタンを追加します。
// @author       Aoi
// @match        https://www.waze.com/*/editor?env=row*
// @grant        none
// @license      MIT
// @icon         https://www.waze.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/496710/Waze%20Utility%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/496710/Waze%20Utility%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create a draggable button
    function createDraggableButton(iconUrl, clickUrl, storageKey, defaultPosition) {
        // 位置をlocalStorageから取得
        const storedPosition = JSON.parse(localStorage.getItem(storageKey)) || defaultPosition;

        // ボタンを作成
        var button = document.createElement('button');
        var icon = document.createElement('img');
        icon.src = iconUrl;
        icon.style.width = '24px';
        icon.style.height = '24px';
        icon.style.verticalAlign = 'middle';
        icon.style.backgroundColor = 'transparent'; // アイコンの背景を透明に設定

        button.appendChild(icon);
        button.style.position = 'fixed';
        button.style.top = storedPosition.top;
        button.style.right = storedPosition.right;
        button.style.left = storedPosition.left || 'auto'; // Handle left position
        button.style.zIndex = '1000';
        button.style.padding = '10px';
        button.style.backgroundColor = 'transparent'; // ボタンの背景を透明に設定
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        // ボタンがクリックされた時の処理
        button.onclick = function() {
            window.open(clickUrl, '_blank');
        };

        // ドラッグ移動を可能にする
        button.onmousedown = function(event) {
            event.preventDefault();
            let shiftX = event.clientX - button.getBoundingClientRect().left;
            let shiftY = event.clientY - button.getBoundingClientRect().top;

            document.onmousemove = function(event) {
                button.style.right = 'auto';
                button.style.left = event.pageX - shiftX + 'px';
                button.style.top = event.pageY - shiftY + 'px';
            };

            document.onmouseup = function() {
                document.onmousemove = null;
                document.onmouseup = null;

                // 位置をlocalStorageに保存
                localStorage.setItem(storageKey, JSON.stringify({
                    top: button.style.top,
                    right: button.style.right,
                    left: button.style.left
                }));
            };
        };

        button.ondragstart = function() {
            return false;
        };

        // ボタンをページに追加
        document.body.appendChild(button);
    }

    // Create Waze Event Button
    createDraggableButton(
        'https://web-assets.waze.com/robin/assets/wazer-40bff0961bb0fc36516a39cf8d1831d91e20d3f68f2bf32f299a2cf234df79e7.png',
        'https://www.waze.com/ja/events',
        'wazeEventButtonPosition',
        { top: '490px', right: '12px' }
    );

    // Create Road Info Button
    createDraggableButton(
        'https://www.mlit.go.jp/common/001378742.jpg',
        'https://www.road-info-prvs.mlit.go.jp/roadinfo/pc/',
        'wazeRoadInfoButtonPosition',
        { top: '450px', right: '12px' }
    );

})();
