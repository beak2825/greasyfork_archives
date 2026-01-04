// ==UserScript==
// @name         Change Room Limit to 2 on Specific Words３
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Changes room limit to 2 when specific words are mentioned in the chat and presses the change button, but only if not already set to 2.
// @author       AoiRabitto
// @match        http://drrrkari.com/room/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524228/Change%20Room%20Limit%20to%202%20on%20Specific%20Words%EF%BC%93.user.js
// @updateURL https://update.greasyfork.org/scripts/524228/Change%20Room%20Limit%20to%202%20on%20Specific%20Words%EF%BC%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 監視する特定の言葉
    const specificWords = ["主", "規約", "ルール"];

    // チャットメッセージを監視
    function monitorMessages() {
        const chatArea = document.getElementById("talks");
        if (!chatArea) {
            console.error("チャットエリアが見つかりませんでした");
            return;
        }

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const messageText = node.querySelector('.bubble > p.body');
                            if (messageText && specificWords.some(word => messageText.textContent.includes(word))) {
                                console.log(`特定の言葉が発言されました: ${messageText.textContent}`);
                                changeRoomLimit();
                            }
                        }
                    });
                }
            });
        });

        observer.observe(chatArea, { childList: true, subtree: true });
    }

    // 部屋の人数制限を2に変更
    function changeRoomLimit() {
        // 定員のドロップダウンを取得
        const roomLimitDropdown = document.querySelector('select[name="room_limit"]');
        // 最初の変更ボタン
        const firstSaveButton = document.querySelector('input[name="save2"]');
        // 最後の変更ボタン
        const lastSaveButton = document.querySelector('input[name="save3"]');

        // 現在の定員が既に2名の場合はスキップ
        if (roomLimitDropdown.value === "2") {
            console.log("部屋の定員は既に2名です。変更をスキップします。");
            return;
        }

        if (roomLimitDropdown && firstSaveButton && lastSaveButton) {
            // 定員を2に設定
            roomLimitDropdown.value = "2";

            // change イベントを発火
            const event = new Event("change");
            roomLimitDropdown.dispatchEvent(event);

            // 最初の変更ボタンをクリック
            firstSaveButton.click();

            // 最後の変更ボタンをクリック
            lastSaveButton.click();

            console.log("部屋の定員を2名に変更しました。");
        }
    }

    // ページがロードされたときに監視を開始
    window.addEventListener("load", () => {
        console.log("スクリプトが開始されました");
        monitorMessages(); // チャットメッセージの監視を開始
    });
})();

function clickLastChangeButton() {
    const lastChangeButton = document.querySelector('input[name="save3"]');
    if (lastChangeButton) {
        lastChangeButton.click();
    }
}
