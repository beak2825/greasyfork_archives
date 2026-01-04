// ==UserScript==
// @name        AB - Mark Sneedex Releases
// @description Tags the best releases on animebytes according to https://sneedex.moe/
// @namespace   TalkingJello@animebytes.tv
// @match       *://animebytes.tv/*
// @grant       GM_addElement
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @version     1.2
// @author      TalkingJello
// @icon        http://animebytes.tv/favicon.ico
// @connect     sneedex.moe
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/455045/AB%20-%20Mark%20Sneedex%20Releases.user.js
// @updateURL https://update.greasyfork.org/scripts/455045/AB%20-%20Mark%20Sneedex%20Releases.meta.js
// ==/UserScript==

// Thanks to garret who made the nyaa script https://tilde.club/~garret/userscripts/nyaablue.user.js
// which I stole sneedex related code from

const DEX = "https://sneedex.moe"
const CACHE_TIME = 1000*60*60*2; // 2 hours
const COMPARISON_REGEX = /'(https:\/\/slow.pics\/c\/[^']*)/gim
const TORRENT_ID_REGEX = /&torrentid=(\d+)/i

function log(...rest) {
    console.log("[Mark Sneedex Releases]", ...rest)
}

function gmFetchJson(opts, timeout = 10000) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            ...opts,
            timeout,
            ontimeout: function() {
                reject(new Error(`Request timed out after ${timeout}ms`));
            },
            onerror: function(err) {
                reject(err ? err : new Error('Failed to fetch'))
            },
            onload: function(response) {
                console.log('onload', response)
                resolve(JSON.parse(response.responseText));
            }
        })
    });
}

async function fetchSneedex(route) {
    // cache check
    const lastUpdate = GM_getValue(`cache_last_update_${route}`)
    if (typeof lastUpdate === "number" && Date.now() < lastUpdate + CACHE_TIME) {
        const cached = GM_getValue(`cache_map_2_${route}`)
        if (typeof cached === "object") {
            log(`cache hit for route ${route}`);
            return cached
        }
    }

    // fetch api
    log(`fetching sneedex api for route ${route}`);
    const res = await gmFetchJson({
        headers: {
            "Accept": "application/json",
            "User-Agent": "ab-mark-sneedex-releases.user.js"
        },
        method: "GET",
        url: DEX + route
    });
    const linkMap = {};
    res.forEach(entry => {
        entry.permLinks.forEach(l => {
            const match = entry.comparisons.match(COMPARISON_REGEX);
            linkMap[l] = {
                id: entry.entryID,
                notes: entry.notes.replace(/<br>/gmi, '\n'),
                comparisons: match ? match.map(l => l.substring(1)) : []
            }
        });
    })
    GM_setValue(`cache_map_2_${route}`, linkMap)
    GM_setValue(`cache_last_update_${route}`, Date.now())
    return linkMap
}

// Thanks to https://github.com/momentary0/AB-Userscripts/blob/master/torrent-highlighter/src/tfm_torrent_highlighter.user.js#L470
// for the handy selectors
function torrentsOnPage() {
    const torrentPageTorrents = [...document.querySelectorAll(
        '.group_torrent>td>a[href*="&torrentid="]'
    )].map(a => ({
        a,
        seperator: a.href.includes('torrents.php') ? ' | ' : ' / '
    }));
    const searchResultTorrents = [...document.querySelectorAll(
        '.torrent_properties>a[href*="&torrentid="]'
    )].map(a => ({
        a,
        seperator: ' | '
    }));
    /*const bbcodeTorrents = [...document.querySelectorAll(
        ':not(.group_torrent)>:not(.torrent_properties)>a[href*="/torrent/"]:not([title])',
    )].map(a => ({
        a,
        seperator: a.href.includes('torrents.php') ? ' | ' : ' / '
    }));*/

    return [...torrentPageTorrents, ...searchResultTorrents]
}

function insertTag(parent, {title, src, alt, onclick}) {
    const img = GM_addElement(parent, 'img', {
        src,
        alt,
        title
    });
    img.addEventListener('click', onclick)
}

function insertTorrentTab(torrentId, tabName, tabId, content) {
    // Select
    const select = $(`<li><a href="#${torrentId}/${tabId}">${tabName}</a></li>`)
    const a = select.find('a')
    a.click(() => switchTabs(a));
    $(`#tabs_${torrentId}`).append(select);

    // Tab it self
    const container = $(`<div id="${torrentId}_${tabId}" style="display: none;"></div>`)
    container.append(content)
    $(`#tabs_${torrentId}`).parent().append(container)

    // Load from url hash on page load
    let e = window.location.hash;
    if (e) {
        e = e.substr(1).split("/")
    }
    if (e[1] === tabId) {
        switchTabs(a)
    }
}

(async function () {
    try {
        const linkMap = await fetchSneedex("/api/public/ab")
        const torrents = torrentsOnPage();

        torrents.forEach(t => {
            const entry = linkMap[t.a.href];
            if (!entry) {
                return;
            }
            log('matched', entry)

            // Insert tag
            t.a.append(t.seperator);
            let parent = t.a;
            if (t.a.classList.contains('userscript-highlight')) {
                // highlight already ran
                parent = document.createElement('span');
                parent.className = "userscript-highlight torrent-field";
                parent.dataset.sneedex = "Sneedex";
                parent.dataset.field = "Sneedex";
                t.a.append(parent);
            }

            insertTag(parent, {
                dataAttr: "data-sneedex",
                title: "This release is sneedex approved!" + (entry.notes ? ` Sneedex Notes:\n${entry.notes}` : ''),
                src: "https://ptpimg.me/n40di4.png",
                alt: "Sneedex Choice!",
                onclick: (e) => {
                    e.preventDefault()
                    e.stopImmediatePropagation()
                    window.open(`${DEX}/?${entry.id}`, '_blank').focus()
                }
            });

            // sneedex tab
            const tab = $(`<div></div>`)
            tab.append(`<div style="margin-bottom: 16px;"><h2><a target="_blank" href="${DEX}/?${entry.id}">Sneedex.moe Entry</a></h2><span>Click to open the entry on the website</span></div>`)

            if (entry.notes) {
                const span = $(`<span style="white-space: pre-wrap;"></span>`);
                span.text(entry.notes)
                const div = $('<div style="margin-bottom: 16px;"></div>')
                div.append(`<h2>Notes</h2>`, span)
                tab.append(div)
            }

            if (Array.isArray(entry.comparisons) && entry.comparisons.length > 0) {
                const div = $('<div style="margin-bottom: 16px;"></div>')
                div.append(`<h2>Comparisons</h2>`)
                entry.comparisons.forEach(link => {
                    div.append(`<a target="_blank" href="${link}">${link}</a>`, "<br>")
                })
                tab.append(div)
            }

            const torrentId = t.a.href.match(TORRENT_ID_REGEX)[1]
            insertTorrentTab(torrentId, "Sneedex", "sneedex", tab)
        });
    } catch (err) {
        alert(`Failed to fetch sneedex for best releases - ${err.message ? err.message : err}`);
    }
})();