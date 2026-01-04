// ==UserScript==
// @name            Hide Text on Twitter
// @name:ja         Twitter TLからテキストを消すやつ
// @namespace       http://tampermonkey.net/
// @version         1.1.2
// @description     Hide text from your TL to make viewing illustrations more comfortable
// @description:ja  タイムラインからテキストをすべて非表示します。イラスト閲覧が快適になります。
// @author          Nogaccho
// @match           https://twitter.com/*
// @match           https://x.com/*
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/485892/Hide%20Text%20on%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/485892/Hide%20Text%20on%20Twitter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let filterEnabled = true;
    let scrollTimeout;// スクロールイベントのタイムアウトを制御する変数

    // 要素が画面内にあるかどうかを判定する関数
    const isVisible = (elem) => {
        const rect = elem.getBoundingClientRect();
        const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
        return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
    };

    const updateVisibleTweets = () => {
        document.querySelectorAll('article').forEach(tweet => {
            if (!isVisible(tweet)) return;

            if (!filterEnabled) {
                tweet.style.display = ''; 
                const textElements = tweet.querySelectorAll('div[dir="auto"]');
                textElements.forEach(element => {
                    element.style.display = ''; 
                });
                return;
            }

            const hasMediaLink = tweet.innerHTML.includes('https://pbs.twimg.com/media/');
            const textElements = tweet.querySelectorAll('div[dir="auto"]');

            if (hasMediaLink) {
                const hasTextContent = Array.from(textElements).some(element => element.textContent.trim() !== '');
                if (hasTextContent) {
                    textElements.forEach(element => {
                        element.style.display = 'none';
                    });
                }
            } else {
                tweet.style.display = 'none';
            }
        });
    };

    // 更新を遅延させる関数
    const delayedUpdate = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateVisibleTweets, 50);
    };

    // ON/OFF切り替えボタンを作成する関数
    const createToggleButton = () => {
        const toggleButton = document.createElement('input');
        toggleButton.type = 'checkbox';
        toggleButton.checked = true;
        toggleButton.style.position = 'fixed';
        toggleButton.style.top = '10px';
        toggleButton.style.right = '10px';
        toggleButton.style.zIndex = '1000';
        toggleButton.style.width = '20px';
        toggleButton.style.height = '20px';
        toggleButton.style.borderRadius = '100px'; // 角丸の設定
        toggleButton.style.border = '2px solid #555'; // 枠線の色と太さ
        toggleButton.style.backgroundColor = '#fff'; // 背景色
        toggleButton.style.cursor = 'pointer'; // カーソルをポインターに設定

        toggleButton.addEventListener('change', () => {
            filterEnabled = toggleButton.checked;
            updateVisibleTweets(); 
        });

        document.body.appendChild(toggleButton);
    };

    createToggleButton();

    window.addEventListener('scroll', delayedUpdate);

    // DOMの変更を監視するオブザーバー
    const observer = new MutationObserver(delayedUpdate);
    const config = { childList: true, subtree: true };

    const targetNode = document.querySelector('div[data-testid="primaryColumn"]') || document.body;

    setTimeout(() => {
        observer.observe(targetNode, config);// Twitterのタイムラインの変化を監視
        updateVisibleTweets();
    }, 2500);// リロード後、フィルタ機能に2.5秒遅延をかける（ツイートを読み込む前にフィルタをかけるとバグるため）
})();
