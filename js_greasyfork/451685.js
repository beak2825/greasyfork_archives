// ==UserScript==
// @name            AMQ Clear Answer
// @namespace       https://github.com/SlashNephy
// @version         1.1.1
// @author          SlashNephy
// @description     Add a feature to clear text in the answer column with Delete key.
// @description:ja  Delete キーを押下することで解答欄のテキストをクリアする機能を追加します。
// @homepage
// @homepageURL
// @icon            https://animemusicquiz.com/favicon-32x32.png
// @supportURL      https://github.com/SlashNephy/userscripts/issues
// @match           https://animemusicquiz.com/*
// @require         https://cdn.jsdelivr.net/gh/TheJoseph98/AMQ-Scripts@b97377730c4e8553d2dcdda7fba00f6e83d5a18a/common/amqScriptInfo.js
// @grant           unsafeWindow
// @license         MIT license
// @downloadURL https://update.greasyfork.org/scripts/451685/AMQ%20Clear%20Answer.user.js
// @updateURL https://update.greasyfork.org/scripts/451685/AMQ%20Clear%20Answer.meta.js
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

    const handleKeydown = (event) => {
        const target = event.target;
        if (target === null) {
            return;
        }
        if (event.key === 'Delete') {
            target.value = '';
        }
    };
    onReady(() => {
        for (const input of document.querySelectorAll('input.flatTextInput')) {
            input.addEventListener('keydown', handleKeydown);
        }
        AMQ_addScriptData({
            name: 'Clear Answer',
            author: 'SlashNephy &lt;spica@starry.blue&gt;',
            description: 'Add a feature to clear text in the answer column with delete key.',
        });
    });

})();
