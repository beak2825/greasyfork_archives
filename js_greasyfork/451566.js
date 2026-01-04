// ==UserScript==
// @name            AMQ Hide Annoying Dialog
// @namespace       https://github.com/SlashNephy
// @version         0.2.1
// @author          SlashNephy
// @description     Hide annoying message dialogs when disconnecting and reconnecting.
// @description:ja  コネクションの切断や再接続時の邪魔なメッセージダイアログを非表示にします。
// @homepage        https://scrapbox.io/slashnephy/AMQ_%E3%81%A7%E9%82%AA%E9%AD%94%E3%81%AA%E3%83%A1%E3%83%83%E3%82%BB%E3%83%BC%E3%82%B8%E3%83%80%E3%82%A4%E3%82%A2%E3%83%AD%E3%82%B0%E3%82%92%E9%9D%9E%E8%A1%A8%E7%A4%BA%E3%81%AB%E3%81%99%E3%82%8B_UserScript
// @homepageURL     https://scrapbox.io/slashnephy/AMQ_%E3%81%A7%E9%82%AA%E9%AD%94%E3%81%AA%E3%83%A1%E3%83%83%E3%82%BB%E3%83%BC%E3%82%B8%E3%83%80%E3%82%A4%E3%82%A2%E3%83%AD%E3%82%B0%E3%82%92%E9%9D%9E%E8%A1%A8%E7%A4%BA%E3%81%AB%E3%81%99%E3%82%8B_UserScript
// @icon            https://animemusicquiz.com/favicon-32x32.png
// @supportURL      https://github.com/SlashNephy/userscripts/issues
// @match           https://animemusicquiz.com/*
// @require         https://cdn.jsdelivr.net/gh/TheJoseph98/AMQ-Scripts@b97377730c4e8553d2dcdda7fba00f6e83d5a18a/common/amqScriptInfo.js
// @grant           unsafeWindow
// @license         MIT license
// @downloadURL https://update.greasyfork.org/scripts/451566/AMQ%20Hide%20Annoying%20Dialog.user.js
// @updateURL https://update.greasyfork.org/scripts/451566/AMQ%20Hide%20Annoying%20Dialog.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const awaitFor = async (predicate, timeout) => new Promise((resolve, reject) => {
        let timer;
        const interval = window.setInterval(() => {
            if (predicate()) {
                clearInterval(interval);
                clearTimeout(timer);
                resolve();
            }
        }, 500);
    });

    const onReady = (callback) => {
        if (document.getElementById('startPage')) {
            return;
        }
        awaitFor(() => document.getElementById('loadingScreen')?.classList.contains('hidden') === true)
            .then(callback)
            .catch(console.error);
    };

    onReady(() => {
        const originalDisplayMessage = displayMessage;
        unsafeWindow.displayMessage = (title, message, callback, isOutsideDismiss, disableSwal) => {
            if (title === 'Disconnected from server' || title === 'Successfully  Reconnected') {
                return;
            }
            originalDisplayMessage(title, message, callback ?? (() => { }), isOutsideDismiss ?? true, disableSwal ?? false);
        };
        AMQ_addScriptData({
            name: 'Hide Annoying Dialog',
            author: 'SlashNephy &lt;spica@starry.blue&gt;',
            description: 'Hide annoying message dialogs when disconnecting and reconnecting.',
        });
    });

})();
