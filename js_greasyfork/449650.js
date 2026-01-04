// ==UserScript==
// @name            AMQ Result Exporter
// @namespace       https://github.com/SlashNephy
// @version         0.5.2
// @author          SlashNephy
// @description     Export song results to your Google Spreadsheet!
// @description:ja  Google スプレッドシートに AMQ のリザルト (正誤、タイトル、難易度...) を送信します。
// @homepage        https://scrapbox.io/slashnephy/AMQ_%E3%81%AE%E3%83%AA%E3%82%B6%E3%83%AB%E3%83%88%E3%82%92_Google_%E3%82%B9%E3%83%97%E3%83%AC%E3%83%83%E3%83%89%E3%82%B7%E3%83%BC%E3%83%88%E3%81%AB%E9%80%81%E4%BF%A1%E3%81%99%E3%82%8B_UserScript
// @homepageURL     https://scrapbox.io/slashnephy/AMQ_%E3%81%AE%E3%83%AA%E3%82%B6%E3%83%AB%E3%83%88%E3%82%92_Google_%E3%82%B9%E3%83%97%E3%83%AC%E3%83%83%E3%83%89%E3%82%B7%E3%83%BC%E3%83%88%E3%81%AB%E9%80%81%E4%BF%A1%E3%81%99%E3%82%8B_UserScript
// @icon            https://animemusicquiz.com/favicon-32x32.png
// @supportURL      https://github.com/SlashNephy/userscripts/issues
// @match           https://animemusicquiz.com/*
// @require         https://cdn.jsdelivr.net/gh/TheJoseph98/AMQ-Scripts@b97377730c4e8553d2dcdda7fba00f6e83d5a18a/common/amqScriptInfo.js
// @connect         script.google.com
// @connect         raw.githubusercontent.com
// @grant           GM_xmlhttpRequest
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           unsafeWindow
// @license         MIT license
// @downloadURL https://update.greasyfork.org/scripts/449650/AMQ%20Result%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/449650/AMQ%20Result%20Exporter.meta.js
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

    const isReady = () => !!unsafeWindow.setupDocumentDone;

    class PlayerAnswerTimeManager {
        #songStartTime = 0;
        #playerTimes = [];
        #firstPlayers = [];
        constructor() {
            if (!isReady()) {
                throw new Error('AMQ is not ready.');
            }
            new Listener('play next song', () => {
                this.#songStartTime = Date.now();
                this.#playerTimes = [];
                this.#firstPlayers = [];
            }).bindListener();
            new Listener('player answered', (playerIds) => {
                const time = Date.now() - this.#songStartTime;
                if (this.#firstPlayers.length === 0) {
                    this.#firstPlayers.push(...playerIds);
                }
                for (const id of playerIds) {
                    this.#playerTimes[id] = time;
                }
            }).bindListener();
            new Listener('Join Game', ({ quizState }) => {
                if (quizState.songTimer > 0) {
                    this.#songStartTime = Date.now() - quizState.songTimer * 1000;
                }
            }).bindListener();
        }
        query(playerId) {
            return this.#playerTimes[playerId] ?? null;
        }
        isFirst(playerId) {
            return this.#firstPlayers.includes(playerId);
        }
    }

    async function fetchArmEntries(branch = 'master') {
        const response = await fetch(`https://raw.githubusercontent.com/SlashNephy/arm-supplementary/${branch}/dist/arm.json`);
        return response.json();
    }

    const executeGmXhr = async (request) => new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            ...request,
            onload: (response) => {
                resolve(response);
            },
            onerror: (error) => {
                reject(error);
            },
        });
    });

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

    const gasUrl = new GM_Value('GAS_URL', '');
    const dryRun = new GM_Value('DRY_RUN', false);
    const executeGas = async (rows) => {
        const url = gasUrl.get();
        if (url === '') {
            throw new Error('Please set GAS_URL from the Storage tab in Tampermonkey dashboard.');
        }
        if (dryRun.get()) {
            return;
        }
        await executeGmXhr({
            url,
            method: 'POST',
            data: JSON.stringify(rows),
            headers: {
                'User-Agent': 'amq-result-exporter (+https://github.com/SlashNephy/userscripts/raw/master/src/amq-result-exporter.ts)',
                'Content-Type': 'application/json',
            },
        });
    };
    onReady(async () => {
        const armEntries = await fetchArmEntries();
        const playerAnswerTimes = new PlayerAnswerTimeManager();
        new Listener('answer results', (event) => {
            const { quiz, quizVideoController } = unsafeWindow;
            const self = Object.values(quiz.players).find((p) => p.isSelf && p._inGame);
            if (!self) {
                return;
            }
            const players = Object.values(event.players)
                .sort((a, b) => {
                if (a.answerNumber !== undefined && b.answerNumber !== undefined) {
                    return a.answerNumber - b.answerNumber;
                }
                const p1name = quiz.players[a.gamePlayerId]?._name;
                if (p1name === undefined) {
                    return 0;
                }
                const p2name = quiz.players[b.gamePlayerId]?._name;
                if (p2name === undefined) {
                    return 0;
                }
                return p1name.localeCompare(p2name);
            })
                .map((p) => ({
                status: p.listStatus,
                id: p.gamePlayerId,
                name: quiz.players[p.gamePlayerId]?._name,
                score: p.score,
                correctGuesses: quiz.gameMode !== 'Standard' && quiz.gameMode !== 'Ranked' ? p.correctGuesses : p.score,
                correct: p.correct,
                answer: quiz.players[p.gamePlayerId]?.avatarSlot.$answerContainerText.text(),
                guessTime: playerAnswerTimes.query(p.gamePlayerId),
                active: !quiz.players[p.gamePlayerId]?.avatarSlot._disabled,
                position: p.position,
                positionSlot: p.positionSlot,
            }));
            const selfResult = players.find((p) => p.id === self.gamePlayerId);
            const selfAnswer = selfResult?.answer?.replace('...', '').replace(/ \(\d+ms\)$/, '') ?? '';
            const rows = [
                Date.now(),
                parseInt($('#qpCurrentSongCount').text(), 10),
                quiz.gameMode,
                selfResult?.correct ?? false,
                selfAnswer,
                selfResult?.guessTime ?? 0,
                event.songInfo.animeNames.romaji,
                event.songInfo.animeNames.english,
                [...new Set(event.songInfo.altAnimeNames.concat(event.songInfo.altAnimeNamesAnswers))].join('\n'),
                event.songInfo.animeDifficulty.toFixed(1),
                event.songInfo.type === 3
                    ? 'Insert Song'
                    : event.songInfo.type === 2
                        ? `Ending ${event.songInfo.typeNumber}`
                        : `Opening ${event.songInfo.typeNumber}`,
                event.songInfo.vintage,
                event.songInfo.animeType,
                event.songInfo.animeScore,
                event.songInfo.siteIds.malId,
                armEntries.find((e) => e.mal_id === event.songInfo.siteIds.malId)?.annict_id ?? '',
                event.songInfo.songName,
                event.songInfo.artist,
                event.songInfo.animeGenre.join('\n'),
                event.songInfo.animeTags.join('\n'),
                '',
                '',
                parseFloat(quizVideoController.moePlayers[quizVideoController.currentMoePlayerId]?.$player[0]?.duration.toFixed(2) ?? '0'),
                quizVideoController.moePlayers[quizVideoController.currentMoePlayerId]?.startPoint ?? '',
                event.players.filter((player) => player.correct).length,
                Object.values(quiz.players).filter((player) => !player.avatarSlot._disabled).length,
                players
                    .filter((p) => p.correct)
                    .map((p) => p.name)
                    .join('\n'),
                players.map((p) => p.name).join('\n'),
                selfResult?.status ?? 0,
                players
                    .filter((p) => p.status)
                    .map((p) => p.name)
                    .join('\n'),
                event.songInfo.siteIds.aniListId,
            ];
            executeGas(rows).catch(console.error);
        }).bindListener();
        AMQ_addScriptData({
            name: 'Result Exporter',
            author: 'SlashNephy &lt;spica@starry.blue&gt;',
            description: 'Export song results to Google Spreadsheet!',
        });
    });

})();
