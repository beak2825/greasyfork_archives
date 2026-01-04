// ==UserScript==
// @name         チャベリで使えるScript
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  ダークモードとライトモードを切り替えるボタンとドラッグ可能なトラックバーを追加し、画面のどこにでも移動可能。位置と状態を保持。ダークモード時はすべての文字を白に統一。
// @author       G
// @match        https://www.chaberi.com/room/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/536485/%E3%83%81%E3%83%A3%E3%83%99%E3%83%AA%E3%81%A7%E4%BD%BF%E3%81%88%E3%82%8BScript.user.js
// @updateURL https://update.greasyfork.org/scripts/536485/%E3%83%81%E3%83%A3%E3%83%99%E3%83%AA%E3%81%A7%E4%BD%BF%E3%81%88%E3%82%8BScript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ダークモードのCSS（すべての文字色を白に統一）
    const darkModeCSS = `
        html, body, * {
            background-color: #000000 !important;
            color: #ffffff !important;
        }
        .navbar, .navbar-default, .navbar-fixed-top {
            background-color: #1a1a1a !important;
            color: #ffffff !important;
            border-color: #333333 !important;
        }
        .navbar-nav > li > a {
            color: #ffffff !important;
        }
        .navbar-nav > li > a:hover {
            background-color: #333333 !important;
            color: #ffffff !important;
        }
        .main_container, #main {
            background-color: #000000 !important;
            color: #ffffff !important;
        }
        .footer, .input-group {
            background-color: #1a1a1a !important;
            color: #ffffff !important;
        }
        .form-control {
            background-color: #333333 !important;
            color: #ffffff !important;
            border-color: #555555 !important;
        }
        .btn-default {
            background-color: #444444 !important;
            color: #ffffff !important;
            border-color: #666666 !important;
        }
        .btn-default:hover {
            background-color: #555555 !important;
            color: #ffffff !important;
        }
        .modal-content {
            background-color: #1a1a1a !important;
            color: #ffffff !important;
        }
        .modal-header, .modal-footer {
            background-color: #333333 !important;
            border-color: #555555 !important;
            color: #ffffff !important;
        }
        a, a:hover, a:focus {
            color: #ffffff !important;
        }
        .term_area, .term_area span {
            color: #ffffff !important;
        }
        .term_area:before {
            background: #ffffff !important;
            color: #ffffff !important;
        }
        .progress-bar {
            background-color: #444444 !important;
            color: #ffffff !important;
        }
        #message, #main > div, .members {
            background-color: #000000 !important;
            color: #ffffff !important;
        }
        #leftad, #rightad, #room_top_ad {
            background-color: #000000 !important;
        }
    `;

    // ボタンとトラックバーのスタイル
    const styleCSS = `
        #darkModeContainer {
            position: fixed;
            z-index: 10000;
            display: flex;
            align-items: center;
            user-select: none;
        }
        #trackbar {
            width: 15px;
            height: 30px;
            background-color: #666666;
            cursor: move;
            border-radius: 2px 0 0 2px;
        }
        #trackbar:hover {
            background-color: #777777;
        }
        #trackbar:active {
            cursor: grabbing;
        }
        #darkModeToggle {
            padding: 8px 12px;
            background-color: #444444;
            color: #ffffff !important;
            border: none;
            border-radius: 0 4px 4px 0;
            cursor: pointer;
            font-size: 14px;
        }
        #darkModeToggle:hover {
            background-color: #555555;
            color: #ffffff !important;
        }
    `;

    // スタイルシートを作成
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.id = 'darkModeStyles';
    document.head.appendChild(styleSheet);

    // コンテナを作成（トラックバーとボタンを含む）
    const container = document.createElement('div');
    container.id = 'darkModeContainer';
    document.body.appendChild(container);

    // トラックバーを作成
    const trackbar = document.createElement('div');
    trackbar.id = 'trackbar';
    container.appendChild(trackbar);

    // トグルボタンを作成
    const toggleButton = document.createElement('button');
    toggleButton.id = 'darkModeToggle';
    toggleButton.innerText = 'ダークモード: ON';
    container.appendChild(toggleButton);

    // ローカルストレージから状態と位置を取得
    let isDarkMode = GM_getValue('darkMode', true);
    let containerPosition = GM_getValue('containerPosition', { top: 10, left: window.innerWidth - 130 });

    // コンテナの初期位置を設定
    container.style.top = `${containerPosition.top}px`;
    container.style.left = `${containerPosition.left}px`;

    // スタイルを適用する関数
    function applyMode() {
        styleSheet.innerText = styleCSS + (isDarkMode ? darkModeCSS : '');
        toggleButton.innerText = `ダークモード: ${isDarkMode ? 'ON' : 'OFF'}`;
    }

    // 初期モードを適用
    applyMode();

    // ボタンクリックでモードを切り替え
    toggleButton.addEventListener('click', (e) => {
        if (e.button === 0) {
            isDarkMode = !isDarkMode;
            GM_setValue('darkMode', isDarkMode);
            applyMode();
        }
    });

    // ドラッグ機能の実装
    let isDragging = false;
    let initialX, initialY;

    trackbar.addEventListener('mousedown', (e) => {
        if (e.button === 0) {
            initialX = e.clientX - parseFloat(container.style.left || 0);
            initialY = e.clientY - parseFloat(container.style.top || 0);
            isDragging = true;
            e.preventDefault();
            e.stopPropagation();
            window.getSelection().removeAllRanges(); // テキスト選択を解除
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            let newX = e.clientX - initialX;
            let newY = e.clientY - initialY;

            // ウィンドウ内に制限
            newX = Math.max(0, Math.min(newX, window.innerWidth - container.offsetWidth));
            newY = Math.max(0, Math.min(newY, window.innerHeight - container.offsetHeight));

            container.style.left = `${newX}px`;
            container.style.top = `${newY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            // 位置を保存
            GM_setValue('containerPosition', {
                top: parseFloat(container.style.top),
                left: parseFloat(container.style.left)
            });
        }
    });

    // ウィンドウリサイズ時に調整
    window.addEventListener('resize', () => {
        let newLeft = Math.min(parseFloat(container.style.left || containerPosition.left), window.innerWidth - container.offsetWidth);
        let newTop = Math.min(parseFloat(container.style.top || containerPosition.top), window.innerHeight - container.offsetHeight);
        container.style.left = `${newLeft}px`;
        container.style.top = `${newTop}px`;
        GM_setValue('containerPosition', { top: newTop, left: newLeft });
    });
})();