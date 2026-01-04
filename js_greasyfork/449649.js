// ==UserScript==
// @name            AMQ Private Session
// @namespace       https://github.com/SlashNephy
// @version         0.3.1
// @author          SlashNephy
// @description     Set invisible status automatically on login.
// @description:ja  ログイン時に Invisible ステータスを設定します。
// @homepage        https://scrapbox.io/slashnephy/AMQ_%E3%81%AE%E3%83%AD%E3%82%B0%E3%82%A4%E3%83%B3%E7%8A%B6%E6%B3%81%E3%82%92%E9%9A%A0%E3%81%99_UserScript
// @homepageURL     https://scrapbox.io/slashnephy/AMQ_%E3%81%AE%E3%83%AD%E3%82%B0%E3%82%A4%E3%83%B3%E7%8A%B6%E6%B3%81%E3%82%92%E9%9A%A0%E3%81%99_UserScript
// @icon            https://animemusicquiz.com/favicon-32x32.png
// @supportURL      https://github.com/SlashNephy/userscripts/issues
// @match           https://animemusicquiz.com/*
// @require         https://cdn.jsdelivr.net/gh/TheJoseph98/AMQ-Scripts@b97377730c4e8553d2dcdda7fba00f6e83d5a18a/common/amqScriptInfo.js
// @grant           unsafeWindow
// @license         MIT license
// @downloadURL https://update.greasyfork.org/scripts/449649/AMQ%20Private%20Session.user.js
// @updateURL https://update.greasyfork.org/scripts/449649/AMQ%20Private%20Session.meta.js
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
        document.addEventListener('DOMNodeInserted', () => {
            switch (unsafeWindow.socialTab.socialStatus?.currentStatus) {
                case unsafeWindow.socialTab.socialStatus?.STATUS_IDS.INVISIBLE:
                case undefined:
                    return;
                default:
                    unsafeWindow.socialTab.socialStatus?.changeSocialStatus(unsafeWindow.socialTab.socialStatus.STATUS_IDS.INVISIBLE);
            }
        });
        AMQ_addScriptData({
            name: 'Private Session',
            author: 'SlashNephy &lt;spica@starry.blue&gt;',
            description: 'Set invisible status automatically.',
        });
    });

})();
