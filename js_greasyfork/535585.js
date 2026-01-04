// ==UserScript==
// @name         右上の通知が居座る。クリックした時のみ消える。
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Prevents notifications in Milky Way Idle from disappearing automatically, only hides on click.
// @author       Osyaburiman
// @match        https://www.milkywayidle.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535585/%E5%8F%B3%E4%B8%8A%E3%81%AE%E9%80%9A%E7%9F%A5%E3%81%8C%E5%B1%85%E5%BA%A7%E3%82%8B%E3%80%82%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF%E3%81%97%E3%81%9F%E6%99%82%E3%81%AE%E3%81%BF%E6%B6%88%E3%81%88%E3%82%8B%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/535585/%E5%8F%B3%E4%B8%8A%E3%81%AE%E9%80%9A%E7%9F%A5%E3%81%8C%E5%B1%85%E5%BA%A7%E3%82%8B%E3%80%82%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF%E3%81%97%E3%81%9F%E6%99%82%E3%81%AE%E3%81%BF%E6%B6%88%E3%81%88%E3%82%8B%E3%80%82.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // クリックによる非表示を追跡するフラグ
    let isClickTriggered = false;

    // 通知の自動非表示を防ぐ
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                // クリックによる非表示でない場合のみ、隠すクラスの追加を阻止
                if (!isClickTriggered &&
                    target.classList.contains('Notification_notification__3l8oP') &&
                    target.classList.contains('Notification_hidden__3w7ag')) {
                    target.classList.remove('Notification_hidden__3w7ag');
                }
            }
        });
    });

    // 通知コンテナを監視
    const notificationsContainer = document.querySelector('.GamePage_notifications__1xT_i');
    if (notificationsContainer) {
        observer.observe(notificationsContainer, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });
    }

    // クリックで通知を非表示にする
    document.addEventListener('click', (event) => {
        const notification = event.target.closest('.Notification_notification__3l8oP');
        if (notification) {
            // クリックによる非表示を許可
            isClickTriggered = true;
            notification.classList.add('Notification_hidden__3w7ag');
            // フラグをリセット（次のMutationObserverのサイクルで影響しないように）
            setTimeout(() => {
                isClickTriggered = false;
            }, 0);
        }
    });
})();