// ==UserScript==
// @name            AMQ i18n Titles
// @namespace       https://github.com/SlashNephy
// @version         0.1.3
// @author          SlashNephy
// @description     Display localized anime titles. (Currently support only Japanese.)
// @description:ja  選択肢やドロップダウンに表示されているアニメのタイトルを日本語に置換します。
// @homepage        https://scrapbox.io/slashnephy/AMQ_%E3%81%A7%E3%82%A2%E3%83%8B%E3%83%A1%E3%81%AE%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E3%82%92%E3%83%AD%E3%83%BC%E3%82%AB%E3%83%A9%E3%82%A4%E3%82%BA%E3%81%99%E3%82%8B_UserScript
// @homepageURL     https://scrapbox.io/slashnephy/AMQ_%E3%81%A7%E3%82%A2%E3%83%8B%E3%83%A1%E3%81%AE%E3%82%BF%E3%82%A4%E3%83%88%E3%83%AB%E3%82%92%E3%83%AD%E3%83%BC%E3%82%AB%E3%83%A9%E3%82%A4%E3%82%BA%E3%81%99%E3%82%8B_UserScript
// @icon            https://animemusicquiz.com/favicon-32x32.png
// @supportURL      https://github.com/SlashNephy/userscripts/issues
// @match           https://animemusicquiz.com/*
// @require         https://cdn.jsdelivr.net/gh/TheJoseph98/AMQ-Scripts@b97377730c4e8553d2dcdda7fba00f6e83d5a18a/common/amqScriptInfo.js
// @connect         raw.githubusercontent.com
// @grant           unsafeWindow
// @grant           GM_xmlhttpRequest
// @license         MIT license
// @downloadURL https://update.greasyfork.org/scripts/462342/AMQ%20i18n%20Titles.user.js
// @updateURL https://update.greasyfork.org/scripts/462342/AMQ%20i18n%20Titles.meta.js
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

    async function fetchAnimeTitles(branch = 'master') {
        const response = await fetch(`https://raw.githubusercontent.com/SlashNephy/anime-titles-map/${branch}/dist/japanese.json`);
        return response.json();
    }

    const localizeTitle = (titles, target) => Object.entries(titles)
        .find(([k]) => k.toLowerCase() === target.toLowerCase())
        ?.at(1)
        ?.at(0);
    onReady(async () => {
        const titles = await fetchAnimeTitles();
        const { setName } = QuizMultipleChoiceAnswerOption.prototype;
        QuizMultipleChoiceAnswerOption.prototype.setName = function (name) {
            setName.call(this, name);
            const localized = localizeTitle(titles, name.english) ?? localizeTitle(titles, name.romaji);
            if (localized) {
                this.$text.text(localized);
            }
        };
        AMQ_addScriptData({
            name: 'i18n Titles',
            author: 'SlashNephy &lt;spica@starry.blue&gt;',
            description: 'Display localized anime titles. (Currently support only Japanese.)',
        });
    });

})();
