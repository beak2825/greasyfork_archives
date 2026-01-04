// ==UserScript==
// @name         youutbeらいぶ#を追加
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  ・。・→＃・。・
// @author       You
// @match        https://www.youtube.com/live_chat*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521449/youutbe%E3%82%89%E3%81%84%E3%81%B6%E3%82%92%E8%BF%BD%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/521449/youutbe%E3%82%89%E3%81%84%E3%81%B6%E3%82%92%E8%BF%BD%E5%8A%A0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // エンターキーが押されたときに実行する処理
    document.addEventListener('keydown', function (event) {
        // エンターキーが押された場合
        if (event.key === 'Enter') {
            console.log("Enter key pressed");
            // 現在フォーカスされている要素を取得（コメント入力欄）
            const activeElement = document.activeElement;
            console.log("Active element:", activeElement);

            // コメント入力欄かどうかを確認
            if (activeElement && activeElement.tagName === 'DIV' && activeElement.contentEditable === 'true') {
                console.log("Detected input field");
                event.preventDefault(); // エンターキーのデフォルト動作を無効化

                // 入力されたテキストを取得
                const currentText = activeElement.innerText;
                console.log("Current text:", currentText);

                // コメントが空の場合は何もしない
                if (!currentText.trim()) {
                    console.log("Empty comment, skipping...");
                    return;
                }

                // コメントの先頭に「#」を追加（すでに「#」があればそのまま）
                if (!currentText.startsWith('#')) {
                    activeElement.innerText = `#${currentText}`;

                    // **inputイベントを手動で発生させて変更を通知**
                    const inputEvent = new Event('input', { bubbles: true });
                    activeElement.dispatchEvent(inputEvent);
                }

                // 少し待機してから送信
                setTimeout(() => {
                    // コメントを送信するボタンを探す
                    const sendButton = document.querySelector(
                        'yt-live-chat-message-input-renderer #send-button button'
                    );

                    // コメント送信ボタンが存在する場合はクリック
                    if (sendButton) {
                        console.log("Send button found, clicking...");
                        sendButton.click();
                    } else {
                        console.error('送信ボタンが見つかりませんでした。');
                    }
                }, 5); // 100ms待機
            }
        }
    });
})();
