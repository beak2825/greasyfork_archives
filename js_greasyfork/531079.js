// ==UserScript==
// @name         ADT⇄ABC Converter Button
// @namespace    http://mogobon.github.io/
// @version      1.5
// @description  ADTの問題URLを検知して対応するABCで開くボタンを追加⇄ADTへ戻るボタンを追加
// @author       もごぼん
// @match        https://*/*
// @match        https://atcoder.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atcoder.jp
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531079/ADT%E2%87%84ABC%20Converter%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/531079/ADT%E2%87%84ABC%20Converter%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 設定キーの定義
    const CONFIG_KEY = "adt-converter-config";

    // デフォルト設定
    const DEFAULT_CONFIG = {
        showDuringContest: false // コンテスト中も表示する（デフォルトはOFF）
    };

    // 設定を取得する関数
    function getConfig() {
        const val = GM_getValue(CONFIG_KEY, "{}");
        let config;
        try {
            config = JSON.parse(val);
        } catch {
            console.warn("無効な設定が見つかりました", val);
            config = {};
        }
        return { ...DEFAULT_CONFIG, ...config };
    }

    // 設定を保存する関数
    function saveConfig(config) {
        GM_setValue(CONFIG_KEY, JSON.stringify(config));
    }

    // スタイルを追加する関数
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* ホバーエリア（ボタンの表示トリガー） */
            .adt-hover-area {
                position: fixed;
                top: 0;
                right: 0;
                width: 40px;
                height: 140px;
                z-index: 9998;
            }

            /* ボタン共通スタイル */
            .adt-button {
                position: fixed;
                right: -105px; /* 初期状態ではより右側に配置 */
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                font-weight: bold;
                font-size: 16px;
                border: none;
                border-radius: 8px 0 0 8px;
                padding: 12px 18px;
                cursor: pointer;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                z-index: 9999;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0.9;
                min-width: 100px;
                /* テキスト選択を防止 */
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
            }

            /* ABCで開くボタン (緑) */
            .adt-converter-button {
                top: 80px;
                background-color: #4CAF50;
                transform: translateY(-3px);
                border-left: 5px solid #2E7D32; /* 左端だけ濃い緑のボーダー */
            }

            /* ホバー時にボタンを表示 */
            .adt-hover-area:hover ~ .adt-button,
            .adt-button:hover {
                right: 0; /* ホバー時に画面端にくっつける */
            }

            .adt-converter-button:hover {
                background-color: #3c9040;
                transform: translateY(0);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                opacity: 1;
            }

            .adt-converter-button:active {
                transform: translateY(1px);
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
            }

            /* ADTに戻るボタン (青) */
            .adt-back-button {
                top: 80px;
                background-color: #2196F3;
                transform: translateY(-3px);
                border-left: 5px solid #0D47A1; /* 左端だけ濃い青のボーダー */
            }

            .adt-back-button:hover {
                background-color: #1976D2;
                transform: translateY(0);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                opacity: 1;
            }

            .adt-back-button:active {
                transform: translateY(1px);
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
            }

            /* 通知スタイル */
            .adt-notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                z-index: 10001;
                animation: fadeInOut 2s ease;
                pointer-events: none;
            }

            /* アニメーション */
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateY(20px); }
                20% { opacity: 1; transform: translateY(0); }
                80% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(20px); }
            }

            /* モバイル対応 */
            @media (max-width: 480px) {
                .adt-button {
                    font-size: 14px;
                    padding: 10px 15px;
                }

                .adt-notification {
                    bottom: 10px;
                    right: 10px;
                    left: 10px;
                    padding: 10px;
                    width: calc(100% - 40px);
                }

                .adt-hover-area:hover ~ .adt-button,
                .adt-button:hover {
                    right: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // URL変換ロジック
    function convertUrl(adtUrl) {
        const parts = adtUrl.split("/tasks/", 2);
        if (parts.length < 2) return adtUrl;
        const [prefix, taskPart] = parts;

        // 問題一覧ページの場合はそのまま返す
        if (!taskPart || taskPart === "") return adtUrl;

        const abcId = taskPart.split("_", 1)[0];
        return `https://atcoder.jp/contests/${abcId}/tasks/${taskPart}`;
    }

    // AtCoder公式サイトに同じタブで移動
    function moveToAtCoder() {
        try {
            const currentUrl = window.location.href;
            const convertedUrl = convertUrl(currentUrl);

            // URLが変換されなかった場合
            if (convertedUrl === currentUrl) {
                return;
            }

            // 最後に訪問したADTのURLを保存
            GM_setValue('lastAdtUrl', currentUrl);

            // 同じタブで移動
            window.location.href = convertedUrl;
        } catch (error) {
            console.error('URL変換エラー:', error);
        }
    }

    // ADTページへ戻る
    function moveToAdt() {
        try {
            const lastAdtUrl = GM_getValue('lastAdtUrl', '');

            if (!lastAdtUrl) {
                return;
            }

            // ADTに戻るときはリセット
            GM_setValue('lastAdtUrl', '');

            // 同じタブで移動
            window.location.href = lastAdtUrl;
        } catch (error) {
            console.error('ADTページへの移動エラー:', error);
        }
    }

    // すべてのボタンとホバーエリアを削除
    function removeAllButtons() {
        const elements = document.querySelectorAll('.adt-button, .adt-hover-area');
        elements.forEach(element => {
            if (document.body.contains(element)) {
                element.remove();
            }
        });
    }

    // 通知を表示する関数
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'adt-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 2000);
    }

    // ABCで開くボタンを追加
    function addAbcButton() {
        // 既存のすべてのボタンを削除
        removeAllButtons();

        // ホバーエリア（ボタンを表示するためのトリガー）
        const hoverArea = document.createElement('div');
        hoverArea.className = 'adt-hover-area';
        document.body.appendChild(hoverArea);

        // ボタン
        const button = document.createElement('button');
        button.className = 'adt-button adt-converter-button';
        button.textContent = 'ABCで開く';
        button.title = 'ABCで開く';
        button.addEventListener('click', moveToAtCoder);
        document.body.appendChild(button);
    }

    // ADTに戻るボタンを追加
    function addAdtButton() {
        // 既存のすべてのボタンを削除
        removeAllButtons();

        // ホバーエリア（ボタンを表示するためのトリガー）
        const hoverArea = document.createElement('div');
        hoverArea.className = 'adt-hover-area';
        document.body.appendChild(hoverArea);

        // ボタン
        const button = document.createElement('button');
        button.className = 'adt-button adt-back-button';
        button.textContent = 'ADTに戻る';
        button.title = 'ADTに戻る';
        button.addEventListener('click', moveToAdt);
        document.body.appendChild(button);
    }
    // ページがADTかどうかを判定
    function isAdtPage() {
        const url = window.location.href.toLowerCase();
        // 基本的にはADTのURLを含む
        const isAdtUrl = (url.includes('adt')) && url.includes('tasks');
        // 問題一覧ページは除外する（/tasks で終わるか、/tasks/ で終わる場合）
        const isProblemListPage = url.match(/\/tasks\/?$/);

        // 問題一覧ページでなく、ADTのURLを含む場合のみtrue
        return isAdtUrl && !isProblemListPage;

    }

    // ページがABCかどうかを判定
    function isAbcPage() {
        const href = location.href;
        const abcRegex = /^https:\/\/atcoder\.jp\/contests\/abc\d{3}\/tasks\/abc\d{3}_[a-z]/;
        return abcRegex.test(href);
    }


     // ページに応じてボタンを追加
    function AddButton() {
        const config = getConfig();

        if (isAdtPage()) {
            addAbcButton();
        } else if (isAbcPage()) {
            addAdtButton();
        }
    }
   // 現在のコンテストが進行中かどうかを判定する関数
    function isActiveContest() {
        try {
            // 残り時間のテキストがあるかどうかで判定
            const pageContent = document.body.textContent || '';
            return pageContent.includes('残り時間');
        } catch (error) {
            console.error('コンテスト判定エラー:', error);
            return false;
        }
    }
     // 初期化
    function init() {
        // 現在の設定を取得
        const config = getConfig();
        addStyles();
        AddButton();


        // コンテスト中で表示設定がOFFの場合はボタンを表示しない
        if (!config.showDuringContest && isActiveContest()) {
            removeAllButtons();
            return;
        }
    }

    // DOMが読み込まれたら初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();