// ==UserScript==
// @name         SHOWROOM シアターモード切替ボタン
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  SHOWROOMの視聴ページに「シアターモード」ボタンを追加し、映像をウィンドウ全体に表示して視聴に集中できるようにします。
// @author       Gemini
// @match        https://www.showroom-live.com/r/*
// @grant        GM_addStyle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=showroom-live.com
// @downloadURL https://update.greasyfork.org/scripts/539628/SHOWROOM%20%E3%82%B7%E3%82%A2%E3%82%BF%E3%83%BC%E3%83%A2%E3%83%BC%E3%83%89%E5%88%87%E6%9B%BF%E3%83%9C%E3%82%BF%E3%83%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/539628/SHOWROOM%20%E3%82%B7%E3%82%A2%E3%82%BF%E3%83%BC%E3%83%A2%E3%83%BC%E3%83%89%E5%88%87%E6%9B%BF%E3%83%9C%E3%82%BF%E3%83%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // シアターモード（全画面風表示）を適用するためのCSS
    const theaterModeCss = `
        /* メインの映像ラッパーを画面いっぱいに固定 */
        .room-video-wrapper {
            position: fixed !important;
            top: 55px !important; /* ヘッダーの高さ分だけ下げる */
            left: 0 !important;
            width: 100vw !important;
            height: calc(100vh - 55px) !important; /* ヘッダーを除いたビューポートの高さ */
            background-color: black !important;
            z-index: 9999 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 0 !important;
            overflow: hidden !important;
        }

        /* 映像コンテナをラッパーいっぱいに広げる */
        .room-video-wrapper .st-loading.room-video {
            width: 100% !important;
            height: 100% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        /* 映像のアスペクト比を維持して表示 */
        .room-video-wrapper .st-loading.room-video video {
            width: 100% !important;
            height: 100% !important;
            max-width: 100% !important;
            max-height: 100% !important;
            object-fit: contain !important;
        }

        /* 映像上の設定アイコンなどを右下に配置 */
        .room-video-wrapper .st-settings {
          position: absolute !important;
          top: auto !important;
          bottom: 10px !important;
          right: 10px !important;
          left: auto !important;
          width: auto !important;
          height: auto !important;
          background-color: transparent !important;
          z-index: 10000 !important;
        }

        .room-video-wrapper .video-settings-bg {
          display: none !important;
        }

        /* 不要なUI要素を非表示にする */
        .st-comment__box.comment-form,
        section.st-log.comment-log,
        section.st-log.gift-log,
        section.st-log.ranking-list,
        div.st-gift_box.gift-box,
        div.st-fan__status,
        section.st-userprofile,
        ul.st-banners,
        section.st-event.event-box,
        section.mission-list,
        section.st-onlivelist,
        nav.st-activate,
        div.st-header__sidebar {
            display: none !important;
        }

        /* ページ全体のスクロールを無効化 */
        body, html {
            overflow: hidden !important;
        }

        /* メインレイアウトのコンテナを調整 */
        .l-main, .room-wrapper {
            padding-top: 0 !important;
            height: 100vh !important;
            width: 100vw !important;
            overflow: hidden !important;
        }
    `;

    let isTheaterMode = false;
    let styleElement = null;

    function createToggleButton() {
        // ボタンが既に存在する場合は何もしない
        if (document.getElementById('theater-mode-toggle-button')) {
            return;
        }

        const button = document.createElement('button');
        button.id = 'theater-mode-toggle-button';
        button.textContent = 'シアターモード';

        // ボタンのスタイルを設定
        Object.assign(button.style, {
            position: 'fixed',
            top: '60px',
            right: '20px',
            zIndex: '10001',
            padding: '8px 16px',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            border: '1px solid #ccc',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            lineHeight: '1.5'
        });

        // ボタンのクリックイベント
        button.addEventListener('click', () => {
            isTheaterMode = !isTheaterMode;
            if (isTheaterMode) {
                // CSSを適用
                styleElement = GM_addStyle(theaterModeCss);
                button.textContent = '通常表示';
                button.style.backgroundColor = 'rgba(0, 123, 255, 0.8)';
            } else {
                // 適用したCSSを削除
                if (styleElement) {
                    styleElement.remove();
                    styleElement = null;
                }
                button.textContent = 'シアターモード';
                button.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
            }
        });

        document.body.appendChild(button);
    }

    // ページの読み込みを監視し、特定の要素が表示されたらボタンを作成
    const observer = new MutationObserver((mutations, obs) => {
        // ルームヘッダーが表示されたら、ページが読み込まれたと判断
        if (document.querySelector('.room-header')) {
            createToggleButton();
            // 一度ボタンを作成したら監視を停止しても良い
            // obs.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();