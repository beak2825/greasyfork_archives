// ==UserScript==
// @name            AMQ Detailed Song Info
// @namespace       https://github.com/SlashNephy
// @version         0.7.2
// @author          SlashNephy
// @description     Display detailed information on the side panel of the song.
// @description:ja  曲のサイドパネルに詳細な情報を表示します。
// @homepage        https://scrapbox.io/slashnephy/AMQ_%E3%81%A7%E6%9B%B2%E3%81%AE%E3%82%B5%E3%82%A4%E3%83%89%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AB%E8%A9%B3%E7%B4%B0%E6%83%85%E5%A0%B1%E3%82%92%E8%A1%A8%E7%A4%BA%E3%81%99%E3%82%8B_UserScript
// @homepageURL     https://scrapbox.io/slashnephy/AMQ_%E3%81%A7%E6%9B%B2%E3%81%AE%E3%82%B5%E3%82%A4%E3%83%89%E3%83%91%E3%83%8D%E3%83%AB%E3%81%AB%E8%A9%B3%E7%B4%B0%E6%83%85%E5%A0%B1%E3%82%92%E8%A1%A8%E7%A4%BA%E3%81%99%E3%82%8B_UserScript
// @icon            https://animemusicquiz.com/favicon-32x32.png
// @supportURL      https://github.com/SlashNephy/userscripts/issues
// @match           https://animemusicquiz.com/*
// @require         https://cdn.jsdelivr.net/gh/TheJoseph98/AMQ-Scripts@b97377730c4e8553d2dcdda7fba00f6e83d5a18a/common/amqScriptInfo.js
// @connect         api.jikan.moe
// @connect         api.myanimelist.net
// @grant           unsafeWindow
// @grant           GM_xmlhttpRequest
// @grant           GM_getValue
// @grant           GM_setValue
// @license         MIT license
// @downloadURL https://update.greasyfork.org/scripts/451363/AMQ%20Detailed%20Song%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/451363/AMQ%20Detailed%20Song%20Info.meta.js
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

    async function fetchJikanAnimeById(id) {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
        return response.json();
    }

    const MalClientId = '6b13c8a22ad3a5e16dd52f548ba7d545';
    async function fetchMalAnimeScoreById(id) {
        const response = await fetch(`https://api.myanimelist.net/v2/anime/${id}?fields=mean`, {
            headers: {
                'X-MAL-CLIENT-ID': MalClientId,
            },
        });
        return response.json();
    }

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

    const scoreCache = new Map();
    const titleCache = new Map();
    const showDifficultyRow = new GM_Value('SHOW_DIFFICULTY_ROW', true);
    const showVintageRow = new GM_Value('SHOW_VINTAGE_ROW', true);
    const showFormatRow = new GM_Value('SHOW_FORMAT_ROW', true);
    const showRatingRow = new GM_Value('SHOW_RATING_ROW', true);
    const showSpotifyLink = new GM_Value('SHOW_SPOTIFY_LINK', true);
    const showYouTubeLink = new GM_Value('SHOW_YOUTUBE_LINK', true);
    const showAnnLink = new GM_Value('SHOW_ANN_LINK', true);
    const rows = [
        {
            id: 'difficulty-row',
            title: 'Difficulty',
            isEnabled() {
                return showDifficultyRow.get();
            },
            content(event) {
                return `${event.songInfo.animeDifficulty.toFixed(1)} / 100`;
            },
        },
        {
            id: 'vintage-row',
            title: 'Vintage',
            isEnabled() {
                return showVintageRow.get();
            },
            content(event) {
                return event.songInfo.vintage;
            },
        },
        {
            id: 'format-row',
            title: 'Format',
            isEnabled() {
                return showFormatRow.get();
            },
            content(event) {
                return event.songInfo.animeType;
            },
        },
        {
            id: 'rating-row',
            title: 'Rating',
            isEnabled() {
                return showRatingRow.get();
            },
            async content(event) {
                const { malId } = event.songInfo.siteIds;
                let score = scoreCache.get(malId);
                let title = titleCache.get(malId);
                if (score === undefined || title === undefined) {
                    try {
                        const result = await fetchJikanAnimeById(malId);
                        score = result.data.score;
                        title = result.data.title_japanese;
                    }
                    catch {
                        try {
                            const result = await fetchMalAnimeScoreById(malId);
                            score = result.mean;
                            title = result.alternative_titles.ja;
                        }
                        catch {
                            score = null;
                            title = null;
                        }
                    }
                    scoreCache.set(malId, score);
                    titleCache.set(malId, title);
                }
                if (title !== null && navigator.language === 'ja') {
                    const element = document.getElementById('qpAnimeName');
                    if (element !== null && title !== element.textContent?.trim()) {
                        element.innerHTML = `${title}<br/>(${element.textContent})`;
                        unsafeWindow.quiz.infoContainer.fitTextToContainer();
                    }
                }
                if (score === null) {
                    return `${event.songInfo.animeScore.toFixed(2)} / 10`;
                }
                return `${score.toFixed(2)} / 10 (MAL)`;
            },
        },
    ];
    const links = [
        {
            id: 'spotify-link',
            title: 'Spotify',
            target: '_blank',
            isEnabled() {
                return showSpotifyLink.get();
            },
            href(event) {
                return `spotify://search/${encodeURIComponent(event.songInfo.songName)}%20${encodeURIComponent(event.songInfo.artist)}/tracks`;
            },
        },
        {
            id: 'youtube-link',
            title: 'YouTube',
            target: '_blank',
            isEnabled() {
                return showYouTubeLink.get();
            },
            href(event) {
                return `https://www.youtube.com/results?search_query=${encodeURIComponent(event.songInfo.songName)}+${encodeURIComponent(event.songInfo.artist)}`;
            },
        },
        {
            id: 'ann-link',
            title: 'ANN',
            target: '_blank',
            isEnabled() {
                return showAnnLink.get();
            },
            href(event) {
                return `https://www.animenewsnetwork.com/encyclopedia/anime.php?id=${event.songInfo.annId}`;
            },
        },
    ];
    const handle = (event) => {
        const container = document.querySelector('#qpAnimeContainer #qpSongInfoContainer');
        if (!container) {
            throw new Error('container is not found.');
        }
        for (const row of rows) {
            if (row.isEnabled !== undefined && !row.isEnabled()) {
                continue;
            }
            const element = getOrCreateRow(container, row.id);
            const contentElement = element.querySelector('.row-content');
            if (contentElement !== null) {
                const content = row.content(event);
                if (content !== null && typeof content !== 'string') {
                    contentElement.textContent = 'Loading...';
                }
                Promise.resolve(content)
                    .then((c) => {
                    contentElement.textContent = c;
                })
                    .catch(console.error);
            }
            else {
                const content = row.content(event);
                Promise.resolve(content)
                    .then((c) => {
                    renderRow(element, {
                        ...row,
                        content: c,
                    });
                })
                    .catch(console.error);
            }
        }
        const element = getOrCreateLinkContainer(container, 'link-container');
        renderLinks(element, links
            .filter((link) => link.isEnabled === undefined || link.isEnabled())
            .map((link) => {
            const href = link.href(event);
            if (href === null) {
                return null;
            }
            return {
                ...link,
                href,
            };
        })
            .filter((x) => x !== null));
    };
    const getOrCreateRow = (container, id) => {
        const existing = document.getElementById(id);
        if (existing !== null) {
            return existing;
        }
        const element = document.createElement('div');
        element.id = id;
        const hider = container.querySelector('div#qpInfoHider');
        if (hider === null) {
            throw new Error('div#qpInfoHider is not found.');
        }
        if (!hider.classList.contains('custom-hider')) {
            hider.classList.add('custom-hider');
        }
        container.insertBefore(element, hider.previousElementSibling);
        return element;
    };
    const renderRow = (element, row) => {
        const h5 = document.createElement('h5');
        const b = document.createElement('b');
        const p = document.createElement('p');
        h5.append(b);
        element.append(h5);
        element.append(p);
        element.classList.add('row');
        p.classList.add('row-content');
        b.textContent = row.title;
        p.textContent = row.content;
    };
    const getOrCreateLinkContainer = (container, id) => {
        const existing = document.getElementById(id);
        if (existing !== null) {
            while (existing.lastElementChild !== null) {
                existing.removeChild(existing.lastElementChild);
            }
            return existing;
        }
        const element = document.createElement('div');
        element.id = id;
        const hider = container.querySelector('div#qpInfoHider');
        if (hider === null) {
            throw new Error('div#qpInfoHider is not found.');
        }
        if (!hider.classList.contains('custom-hider')) {
            hider.classList.add('custom-hider');
        }
        container.insertBefore(element, hider);
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
    unsafeWindow.detailedSongInfo = {
        register(item) {
            const container = 'content' in item ? rows : links;
            if (container.some((x) => x.id === item.id)) {
                return;
            }
            container.push(item);
        },
        unregister(item) {
            const container = 'content' in item ? rows : links;
            const index = container.findIndex((x) => x.id === item.id);
            if (index >= 0) {
                container.splice(index, 1);
            }
        },
        get rows() {
            return rows;
        },
        get links() {
            return links;
        },
    };
    onReady(() => {
        new Listener('answer results', handle).bindListener();
        AMQ_addScriptData({
            name: 'Detailed Song Info',
            author: 'SlashNephy &lt;spica@starry.blue&gt;',
            description: 'Display detailed information on the side panel of the song.',
        });
        AMQ_addStyle(`
    .custom-hider {
      padding: 50% 0;
    }
  `);
    });

})();
