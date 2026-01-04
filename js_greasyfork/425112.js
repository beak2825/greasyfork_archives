// ==UserScript==
// @name         HPJAV Enhance
// @namespace    https://github.com/isTianXin/GMScript/
// @version      1.1
// @description  Enhance hpjav.tv
// @author       sancunguangyin
// @match        *://hpjav.tv/hot
// @match        *://hpjav.tv/category/*
// @grant        GM_openInTab
// @grant        GM_info
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/425112/HPJAV%20Enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/425112/HPJAV%20Enhance.meta.js
// ==/UserScript==

'use strict';

const OPEN_ALL_TORRENT_LINKS_BUTTON = "openAllLinks";

const SCRIPT_HANDLER_TAMPERMONKEY = 'tampermonkey';

let isTampermonkey = () => {
    return (GM_info || { scriptHandler: '' }).scriptHandler.toLowerCase() === SCRIPT_HANDLER_TAMPERMONKEY;
}

let getAdaptivedDocument = () => {
    //Tampermonkey will get first iframe, may be a bug
    if (isTampermonkey()) {
        return window.parent.document;
    }
    return window.document;
}

let adaptivedDocument = getAdaptivedDocument();

let getTorrentFunkLink = (key) => {
    return `https://www.torrentfunk.com/all/torrents/${key}.html`;
}

let parseVideoName = (text) => {
    if (!text) {
        return null;
    }
    let names = text.split(" ");
    if (!names || !names[0]) {
        return null;
    }
    if (!names[1]) {
        return names[0];
    }
    let first = names[0];
    // like ipz-127 300mium-665
    if (/\w+-\d+/.test(first)) {
        return first;
    }
    let second = names[1];
    // like ipz, s-cute, 300miun
    if (/^\w+(-([A-Za-z])+)?$/.test(first)) {
        return first + '-' + second;
    }
    return first;
};

let replaceDateTextWithTorrentFunkLink = (card) => {
    if (!card) {
        return;
    }
    let name = parseVideoName(card.querySelector("a").innerText);
    if (!name) {
        return;
    }
    let torrentFunkLink = getTorrentFunkLink(name);
    let date = card.lastChild.wholeText;
    card.lastChild.remove();
    let jumpLink = `<a href=${torrentFunkLink} class="torrent-link" target="_blank">${date}</a>`;
    card.insertAdjacentHTML("beforeend", jumpLink);
}
let insertTorrentFunkLink = () => {
    let cards = Array.from(adaptivedDocument.querySelectorAll("div > div.entry-title"));
    if (!cards) {
        return;
    }
    cards.forEach(replaceDateTextWithTorrentFunkLink);
}
let openAllTorrentFunkLinks = () => {
    Array.from(adaptivedDocument.querySelectorAll("a.torrent-link"))
        .map(item => item.href)
        .forEach(
            item => {
                if (!item) {
                    return;
                }
                setTimeout(() => {
                    GM_openInTab(item, { insert: false });
                }, 50);
            }
        );
}
let insertOpenAllButton = () => {
    let buttons = adaptivedDocument.querySelector("div.category-count > span");
    let btn = `<a class="btn btn-sm btn-default" id="${OPEN_ALL_TORRENT_LINKS_BUTTON}" rel="nofollow">Open All Torrent Links</a>`;
    buttons.insertAdjacentHTML("afterbegin", btn);
}
let start = () => {
    insertTorrentFunkLink();
    insertOpenAllButton();
}
/**
 * @param {integer} interval
 */
let startWithInterval = (interval) => {
    window.setTimeout(start, interval);
}

startWithInterval(1000);

adaptivedDocument.onclick = e => {
    //openAll onclick
    if (e.target.id === OPEN_ALL_TORRENT_LINKS_BUTTON) {
        let clicked = false;
        if (!clicked) {
            openAllTorrentFunkLinks();
            clicked = true;
        }
        setTimeout(() => clicked = false, 1000);
    }
};

