// ==UserScript==
// @name            AMQ Song Guess Rate
// @namespace       https://github.com/SlashNephy
// @version         0.3.2
// @author          SlashNephy
// @description     Display guess rates per song in side panel of the song. (Requires AMQ Detailed Song Info plugin: version 0.3.0 or higher)
// @description:ja  曲のサイドパネルに曲ごとの正答率を表示します。(0.3.0 以降の AMQ Detailed Song Info プラグインが必要です。)
// @homepage        https://scrapbox.io/slashnephy/AMQ_%E3%81%A7%E6%9B%B2%E3%81%94%E3%81%A8%E3%81%AE%E6%AD%A3%E7%AD%94%E7%8E%87%E3%82%92%E8%A1%A8%E7%A4%BA%E3%81%99%E3%82%8B_UserScript
// @homepageURL     https://scrapbox.io/slashnephy/AMQ_%E3%81%A7%E6%9B%B2%E3%81%94%E3%81%A8%E3%81%AE%E6%AD%A3%E7%AD%94%E7%8E%87%E3%82%92%E8%A1%A8%E7%A4%BA%E3%81%99%E3%82%8B_UserScript
// @icon            https://animemusicquiz.com/favicon-32x32.png
// @supportURL      https://github.com/SlashNephy/userscripts/issues
// @match           https://animemusicquiz.com/*
// @require         https://cdn.jsdelivr.net/gh/TheJoseph98/AMQ-Scripts@b97377730c4e8553d2dcdda7fba00f6e83d5a18a/common/amqScriptInfo.js
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           unsafeWindow
// @grant           GM_deleteValue
// @grant           GM_listValues
// @license         MIT license
// @downloadURL https://update.greasyfork.org/scripts/451779/AMQ%20Song%20Guess%20Rate.user.js
// @updateURL https://update.greasyfork.org/scripts/451779/AMQ%20Song%20Guess%20Rate.meta.js
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
        if (timeout !== undefined) {
            timer = window.setTimeout(() => {
                clearInterval(interval);
                clearTimeout(timer);
                reject(new Error('timeout'));
            }, timeout);
        }
    });

    class LocalizableString {
        localization;
        constructor(localization) {
            this.localization = localization;
        }
        static _orEmpty(a, b) {
            return a !== undefined && a.length > 0 ? a : b;
        }
        toString() {
            switch (navigator.language) {
                case 'ja':
                    return LocalizableString._orEmpty(this.localization.ja, this.localization.en);
                default:
                    return this.localization.en;
            }
        }
        format(...args) {
            return this.toString().replace(/{(\d+)}/g, (_, index) => args[index]?.toString() ?? 'undefined');
        }
        toError() {
            return new Error(this.toString());
        }
    }

    const message = new LocalizableString({
        en: 'Detailed Song Info could not be detected, either Detailed Song Info is not installed or this UserScript is loaded before Detailed Song Info.',
        ja: 'Detailed Song Info を検出できませんでした。Detailed Song Info がインストールされていないか、この UserScript が Detailed Song Info よりも先に読み込まれています。',
    });
    const getDetailedSongInfo = async () => awaitFor(() => unsafeWindow.detailedSongInfo !== undefined, 10000)
        .then(() => unsafeWindow.detailedSongInfo)
        .catch(() => {
        throw message.toError();
    });

    const onReady = (callback) => {
        if (document.getElementById('startPage')) {
            return;
        }
        awaitFor(() => document.getElementById('loadingScreen')?.classList.contains('hidden') === true)
            .then(callback)
            .catch(console.error);
    };

    const makeSha256HexDigest = async (message) => {
        const data = new TextEncoder().encode(message);
        const buffer = await crypto.subtle.digest('SHA-256', data);
        const arrayBuffer = Array.from(new Uint8Array(buffer));
        return arrayBuffer.map((b) => b.toString(16).padStart(2, '0')).join('');
    };

    class GM_Value {
        key;
        defaultValue;
        constructor(key, defaultValue, initialize = true) {
            this.key = key;
            this.defaultValue = defaultValue;
            const value = GM_getValue(key, null);
            if (initialize && value === null) {
                GM_setValue(key, defaultValue);
            }
        }
        get() {
            return GM_getValue(this.key, this.defaultValue);
        }
        set(value) {
            GM_setValue(this.key, value);
        }
        delete() {
            GM_deleteValue(this.key);
        }
        pop() {
            const value = this.get();
            this.delete();
            return value;
        }
    }

    const increment = async (key, isCorrect) => {
        const hashKey = await makeSha256HexDigest(key);
        const value = new GM_Value(hashKey, { correct: 0, total: 0 });
        const count = value.get();
        count.total++;
        if (isCorrect) {
            count.correct++;
        }
        value.set(count);
        return count;
    };
    const migrate = async () => {
        const regex = /^[\da-f]{64}$/;
        const oldKeys = GM_listValues().filter((k) => regex.exec(k) === null);
        await Promise.all(oldKeys.map(async (key) => {
            const hashKey = await makeSha256HexDigest(key);
            const value = new GM_Value(hashKey, { correct: 0, total: 0 });
            const count = value.get();
            const oldValue = new GM_Value(hashKey, { correct: 0, total: 0 }, false);
            const oldCount = oldValue.get();
            count.total += oldCount.total;
            count.correct += oldCount.correct;
            value.set(count);
            oldValue.delete();
        }));
    };
    onReady(() => {
        getDetailedSongInfo()
            .then(({ register }) => {
            register({
                id: 'guess-rate-row',
                title: 'Guess Rate',
                async content(event) {
                    const self = Object.values(unsafeWindow.quiz.players).find((p) => p.isSelf && p._inGame);
                    if (!self) {
                        return null;
                    }
                    const isCorrect = event.players.find((p) => p.gamePlayerId === self.gamePlayerId)?.correct === true;
                    const count = await increment(`${event.songInfo.songName}_${event.songInfo.artist}`, isCorrect);
                    return `${count.correct} / ${count.total} (${((count.correct / count.total) * 100).toFixed(1)} %)`;
                },
            });
        })
            .catch(console.error);
        migrate().catch(console.error);
        AMQ_addScriptData({
            name: 'Song Guess Rate',
            author: 'SlashNephy &lt;spica@starry.blue&gt;',
            description: 'Display guess rates per song in side panel of the song. (Requires AMQ Detailed Song Info plugin: version 0.3.0 or higher)',
        });
    });

})();
