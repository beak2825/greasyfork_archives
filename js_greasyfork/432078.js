// ==UserScript==
// @name        Animepahe bookmark url fixer
// @namespace   https://greasyfork.org/users/412318
// @include     /^https?:\/\/pahe\.win\/a\/\d+/
// @include     /^https?:\/\/animepahe.(com|ru|org)/
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlhttpRequest
// @grant       GM_setValue
// @grant       GM.setValue
// @grant       GM_getValue
// @grant       GM.getValue
// @version     1.10
// @author      henrik9999
// @description This script fixes the "pahe.win" bookmark urls
// @downloadURL https://update.greasyfork.org/scripts/432078/Animepahe%20bookmark%20url%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/432078/Animepahe%20bookmark%20url%20fixer.meta.js
// ==/UserScript==
const animepahe = "https://animepahe.com";
const api = {};

if (typeof GM_xmlhttpRequest !== 'undefined') {
    api.GM_xmlhttpRequest = GM_xmlhttpRequest;
} else if (
    typeof GM !== 'undefined' &&
    typeof GM.xmlHttpRequest !== 'undefined'
) {
    api.GM_xmlhttpRequest = GM.xmlHttpRequest;
}

if (typeof GM_setValue !== 'undefined') {
    api.GM_setValue = GM_setValue;
} else if (
    typeof GM !== 'undefined' &&
    typeof GM.setValue !== 'undefined'
) {
    api.GM_setValue = GM.setValue;
}

if (typeof GM_getValue !== 'undefined') {
    api.GM_getValue = GM_getValue;
} else if (
    typeof GM !== 'undefined' &&
    typeof GM.getValue !== 'undefined'
) {
    api.GM_getValue = GM.getValue;
}

if (window.location.host === "pahe.win") {
    paheStart();
} else if (window.location.host === (new URL(animepahe)).host) {
    animepaheStart();
}

async function paheStart() {
    const id = parseInt(window.location.href.split("/")[4]);
    const episodeNumber = parseInt(window.location.href.split("/")[5]);

    const data = await getData();

    if (!data[id]) {
        showError("could not fix link");
        return;
    }

    await api.GM_setValue("redirect", {
        'title': data[id].title,
        'id': id,
        'episode': episodeNumber
    });

    window.location.href = animepahe;
}

async function animepaheStart() {
    var redirect = await api.GM_getValue("redirect");
    if (!redirect) return;
    await waitUntilExists('#navbarNavDropdown form.nav-search');

    await api.GM_setValue("redirect", null);

    getJSON('/api?m=search&l=8&q=' + redirect.title, function(animes) {
        if (!animes.data) {
            showError("could not find anime");
            return;
        }

        let session = null;
        for (const anime of animes.data) {
            if (anime.id === redirect.id) {
                session = anime.session;
                break;
            }
        }
        if (session) {
            if (!redirect.episode) {
                window.location = `${animepahe}/anime/${session}`;
            } else {
                const page = Math.ceil(redirect.episode / 30);

                getJSON(`/api?m=release&id=${session}&sort=episode_asc&page=${page}`, function(episodes) {
                    if (!episodes.data) {
                        window.location = `${animepahe}/anime/${session}`;
                        return;
                    }

                    let episodeSession = null;
                    for (const episode of episodes.data) {
                        if (episode.episode === redirect.episode) {
                            episodeSession = episode.session;
                            break;
                        }
                    }

                    if (episodeSession) {
                        window.location = `${animepahe}/play/${session}/${episodeSession}`;
                    } else {
                        window.location = `${animepahe}/anime/${session}`;
                    }
                });
            }
        } else {
            showError("could not find anime");
        }
    });
}

async function getJSON(url, callback) {
    return fetch(url, {
        "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "x-requested-with": "XMLHttpRequest"
        },
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    }).then(response => response.json()).then(data => callback(data))
}

function showError(message) {
    console.log(message);
    alert(message);
}

async function waitUntilExists(selector) {
    return new Promise(function check(resolve, reject) {
        let el = document.querySelector(selector);

        if (el) {
            return resolve(el);
        }

        setTimeout(function() {
            check(resolve, reject);
        }, 100);
    });
}

async function getData() {
    var cache = await api.GM_getValue("dataCache");
    var cacheTime = await api.GM_getValue("dataCacheTime");
    if (cache != null && Object.keys(cache).length && cacheTime != null && new Date().getTime() - parseInt(cacheTime) < 6 * 60 * 60 * 1000) {
        console.log("cache data");
        return cache;
    } else {
        console.log("new data");
        let data = await new Promise((resolve, reject) => {
            api.GM_xmlhttpRequest({
                method: "GET",
                url: 'https://raw.githubusercontent.com/henrik9999/animepahe-ids/main/data.json',
                onload: function(response) {
                    if (response.status === 200 && response.responseText) {
                        resolve(JSON.parse(response.responseText));
                    } else {
                        resolve({});
                    }
                }
            });
        })
        await api.GM_setValue("dataCacheTime", new Date().getTime());
        await api.GM_setValue("dataCache", data);
        return data;
    }
}