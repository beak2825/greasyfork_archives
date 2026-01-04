// ==UserScript==
// @name            AMQ sanime Link
// @namespace       https://github.com/SlashNephy
// @version         0.2.1
// @author          SlashNephy
// @description     Display links to sanime and "i(lyl)2m" in the player list.
// @description:ja  プレイヤーリストに sanime や "i(lyl)2m" へのリンクを表示します。
// @homepage        https://scrapbox.io/slashnephy/AMQ_%E3%81%A7_sanime_%E3%82%84_i(lyl)2m_%E3%81%B8%E3%81%AE%E3%83%AA%E3%83%B3%E3%82%AF%E3%82%92%E8%A1%A8%E7%A4%BA%E3%81%99%E3%82%8B_UserScript
// @homepageURL     https://scrapbox.io/slashnephy/AMQ_%E3%81%A7_sanime_%E3%82%84_i(lyl)2m_%E3%81%B8%E3%81%AE%E3%83%AA%E3%83%B3%E3%82%AF%E3%82%92%E8%A1%A8%E7%A4%BA%E3%81%99%E3%82%8B_UserScript
// @icon            https://animemusicquiz.com/favicon-32x32.png
// @supportURL      https://github.com/SlashNephy/userscripts/issues
// @match           https://animemusicquiz.com/*
// @require         https://cdn.jsdelivr.net/gh/TheJoseph98/AMQ-Scripts@b97377730c4e8553d2dcdda7fba00f6e83d5a18a/common/amqScriptInfo.js
// @grant           unsafeWindow
// @license         MIT license
// @downloadURL https://update.greasyfork.org/scripts/451806/AMQ%20sanime%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/451806/AMQ%20sanime%20Link.meta.js
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

    const links = [
        {
            id: 'sanime-link',
            title: 'sanime',
            target: '_blank',
            href(lists) {
                const users = [];
                for (const list of lists) {
                    if (list.username === null) {
                        continue;
                    }
                    switch (list.type) {
                        case 1:
                            users.push(`anilist:${list.username.toLowerCase()}`);
                            break;
                    }
                }
                if (users.length === 0) {
                    return null;
                }
                return `https://sanime.rinsuki.net/show?users=${users.join(',')}`;
            },
        },
        {
            id: 'sanime2-link',
            title: 'sanime2',
            target: '_blank',
            href(lists) {
                const users = [];
                for (const list of lists) {
                    if (list.username === null) {
                        continue;
                    }
                    switch (list.type) {
                        case 1:
                            users.push(`anilist%3A${list.username.toLowerCase()}`);
                            break;
                    }
                }
                if (users.length === 0) {
                    return null;
                }
                return `https://sanime.sno2wman.net/?users=${users.join('%2C')}`;
            },
        },
        {
            id: 'illyyllm-link',
            title: 'illyyllm',
            target: '_blank',
            href(lists) {
                const users = [];
                for (const list of lists) {
                    if (list.username === null) {
                        continue;
                    }
                    switch (list.type) {
                        case 1:
                            users.push(list.username);
                            break;
                    }
                }
                if (users.length === 0) {
                    return null;
                }
                return `https://i-love-love-you-you-love-love-me.vercel.app/?anilist=${users.join(',')}`;
            },
        },
    ];
    const handle = (playerNames) => {
        if (playerNames.length > 20) {
            return;
        }
        const container = getOrCreateLinkContainer('anime-list-links');
        fetchPlayerAnimeLists(playerNames)
            .then((animeLists) => {
            renderLinks(container, links
                .map((link) => ({
                ...link,
                href: link.href(animeLists),
            }))
                .filter((x) => x.href !== null));
        })
            .catch(console.error);
    };
    const handleGameStarting = (event) => {
        const playerNames = event.players.map((p) => p.name);
        handle(playerNames);
    };
    const handleAnswerResults = () => {
        const playerNames = Object.values(unsafeWindow.quiz.players).map((p) => p._name);
        handle(playerNames);
    };
    const cache = {
        playerNames: [],
        lists: [],
    };
    const fetchPlayerAnimeLists = async (playerNames) => new Promise((resolve) => {
        if (contentEquals(cache.playerNames, playerNames)) {
            resolve(cache.lists);
            return;
        }
        const lists = [];
        const listener = new Listener('player profile', (event) => {
            lists.push({
                type: event.list.listId,
                username: event.list.listUser,
            });
            if (lists.length === playerNames.length) {
                listener.unbindListener();
                cache.playerNames = playerNames;
                cache.lists = lists;
                resolve(lists);
            }
        });
        listener.bindListener();
        for (const playerName of playerNames) {
            unsafeWindow.socket.sendCommand({
                type: 'social',
                command: 'player profile',
                data: {
                    name: playerName,
                },
            });
        }
    });
    const contentEquals = (a, b) => {
        const setA = new Set(a);
        const setB = new Set(b);
        return setA.size === setB.size && a.every((x) => setB.has(x));
    };
    const getOrCreateLinkContainer = (id) => {
        const existing = document.getElementById(id);
        if (existing !== null) {
            while (existing.lastElementChild !== null) {
                existing.removeChild(existing.lastElementChild);
            }
            return existing;
        }
        const element = document.createElement('div');
        element.id = id;
        const container = document.getElementById('qpStandingItemContainer');
        if (container === null) {
            throw new Error('#qpStandingItemContainer is not found.');
        }
        const target = container.querySelector('div#qpScoreBoardEntryContainer');
        if (target === null) {
            throw new Error('div#qpScoreBoardEntryContainer is not found.');
        }
        container.insertBefore(element, target.nextElementSibling);
        return element;
    };
    const renderLinks = (element, ls) => {
        const b = document.createElement('b');
        element.append(b);
        const lastIndex = ls.length - 1;
        for (const [index, link] of ls.entries()) {
            const a = document.createElement('a');
            b.append(a);
            a.href = link.href;
            a.textContent = link.title;
            if (link.target !== undefined) {
                a.target = link.target;
            }
            if (index !== lastIndex) {
                b.append(' - ');
            }
        }
    };
    onReady(() => {
        new Listener('Game Starting', handleGameStarting).bindListener();
        new Listener('answer results', handleAnswerResults).bindListener();
        AMQ_addScriptData({
            name: 'sanime Link',
            author: 'SlashNephy &lt;spica@starry.blue&gt;',
            description: 'Display links to sanime and "i(lyl)2m" in the player list.',
        });
    });

})();
