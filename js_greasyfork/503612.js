// ==UserScript==
// @name         Auto Confirm New Chat for Gemini
// @namespace    https://qestir.hatenablog.com/
// @version      1.1
// @description  Google Geminiで「新しいチャットを作成」ダイアログを自動で確認し、通知を表示します。
// @match        https://gemini.google.com/*
// @grant        none
// @license GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/503612/Auto%20Confirm%20New%20Chat%20for%20Gemini.user.js
// @updateURL https://update.greasyfork.org/scripts/503612/Auto%20Confirm%20New%20Chat%20for%20Gemini.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 通知を表示する関数
    function showNotification(message, success = true) {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '10px 20px';
        notification.style.backgroundColor = success ? 'green' : 'red';
        notification.style.color = 'white';
        notification.style.fontSize = '14px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '1000';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 5000); // 5秒後に自動で消える
    }

    // ポップアップ内の「チャットを新規作成」ボタンを探しクリックする関数
    function clickConfirmButton() {
        try {
            const confirmButton = document.querySelector('button[data-test-id="confirm-button"]');
            if (confirmButton) {
                confirmButton.click();
                showNotification('自動クリックに成功しました');
                return true; // ボタンがクリックされたらtrueを返す
            }
        } catch (error) {
            console.error('エラーが発生しました:', error);
            showNotification('自動クリックに失敗しました。詳細はコンソールを確認してください。', false);
        }
        return false; // ボタンが見つからないかエラーが発生した場合はfalseを返す
    }

    // ページの読み込み完了時にボタンの存在をチェック
    window.addEventListener('load', () => {
        clickConfirmButton();
    });

    // 一定間隔でボタンをチェック
    setInterval(() => {
        clickConfirmButton();
    }, 1000); // 1秒ごとにチェック

})();
