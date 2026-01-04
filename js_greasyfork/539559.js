// ==UserScript==
// @name         Indeed - 募集停止の「いいえ」をまとめて押す
// @namespace    http://tampermonkey.net/
// @version      2025.07.25
// @description  Indeedの募集停止ダイアログの「いいえ」をまとめて押すボタンを既存ボタン群の左に追加（重複防止・完全安定版）
// @author       Kazumoto OHASHI
// @match        https://employers.indeed.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539559/Indeed%20-%20%E5%8B%9F%E9%9B%86%E5%81%9C%E6%AD%A2%E3%81%AE%E3%80%8C%E3%81%84%E3%81%84%E3%81%88%E3%80%8D%E3%82%92%E3%81%BE%E3%81%A8%E3%82%81%E3%81%A6%E6%8A%BC%E3%81%99.user.js
// @updateURL https://update.greasyfork.org/scripts/539559/Indeed%20-%20%E5%8B%9F%E9%9B%86%E5%81%9C%E6%AD%A2%E3%81%AE%E3%80%8C%E3%81%84%E3%81%84%E3%81%88%E3%80%8D%E3%82%92%E3%81%BE%E3%81%A8%E3%82%81%E3%81%A6%E6%8A%BC%E3%81%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addButton() {
        const dialogs = document.querySelectorAll('[role="dialog"]');
        dialogs.forEach(dialog => {

            const targets = Array.from(dialog.querySelectorAll('button, [role="button"], label')).filter(el => {
                const text = (el.innerText || el.textContent || "").trim().toLowerCase();
                return text === 'いいえ' || text === 'no';
            });

            if (targets.length === 0) return;

            // 少し待ってから重複確認して追加（MutationObserverの多重発火対策）
            setTimeout(() => {
                if (dialog.querySelector('#clickAllNoButton')) return;

                const button = document.createElement('button');
                button.id = 'clickAllNoButton';
                button.type = 'button';
                button.innerHTML = '<span>すべての「いいえ」を押す</span>';

                // 既存のキャンセルボタンのclassをコピー（常に正しいデザイン適用）
                const cancelButton = Array.from(dialog.querySelectorAll('button')).find(btn => {
                    const text = (btn.innerText || btn.textContent).trim();
                    return text === 'キャンセル' || text === 'Cancel';
                });

                if (cancelButton) {
                    button.className = cancelButton.className;
                } else {
                    // 万が一キャンセルが無い場合は旧スタイルにフォールバック
                    button.className = 'css-4xed5 e8ju0x50';
                }

                button.addEventListener('click', () => {
                    targets.forEach((el, i) => {
                        setTimeout(() => {
                            el.click();
                        }, i * 50);
                    });
                });

                const buttonsWrapper = dialog.querySelector('.css-1ccsvq7.e37uo190');
                if (buttonsWrapper) {
                    buttonsWrapper.prepend(button);
                } else {
                    dialog.appendChild(button);
                }
            }, 100);
        });
    }

    const observer = new MutationObserver(addButton);
    observer.observe(document.body, { childList: true, subtree: true });
})();
