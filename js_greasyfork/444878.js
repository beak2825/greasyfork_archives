"use strict";
// ==UserScript==
// @name         osu! beatmap browser
// @namespace    TempoOptimiser
// @version      0.3
// @description  keybindings for navigating osu! beatmaps
// @license      MIT; https://spdx.org/licenses/MIT.html
// @author       TempoOptimiser
// @match        https://old.ppy.sh/p/beatmaplist*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/444878/osu%21%20beatmap%20browser.user.js
// @updateURL https://update.greasyfork.org/scripts/444878/osu%21%20beatmap%20browser.meta.js
// ==/UserScript==
/*
Copyright 2022 TempoOptimiser

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
/*
keybindings:
    (a)udio
    (s)how details
    (d)ownload

    h - previous page
    j - down a song
    k - up a song
    l - next page
*/

const FROM_OTHER_PAGE = "FROM_OTHER_PAGE";
const WAS_PLAYING = "WAS_PLAYING";


const css = document.createElement("style");
css.innerText = `
.sel {
    zoom: 2;
}

.beatmap {
    display: block;
    margin: 4px auto;
}

.sel .bmlistt i {
    display: inline-block;
    height: 60px;
    line-height: 60px;
    text-decoration: none;
    font-size: 400%;
    color: rgba(255,255,255,.5);
}
`;
document.head.appendChild(css);


const listing = document.querySelector("div.beatmapListing");
let cur = listing.firstElementChild;

/** @type {Set<string>} */
const preloaded = new Set();

/**
 * @param {string} id
 */
function preload(id) {
    if (preloaded.has(id)) return;
    preloaded.add(id);
    const audio = new Audio();
    audio.src = STATIC_DOMAIN_BEATMAP + "/preview/" + id + ".mp3";
    audio.load();
}

/**
 * @param {Element | undefined} el
 */
function startHi(el = undefined) {
    if (el === undefined) {
        el = cur;
    }
    preload(el.id);
    // preload the six surrounding maps
    let toPreload = el.nextElementSibling;
    for (let i = 0; i < 3; i++) {
        if (toPreload === null) {
            break;
        }
        preload(toPreload.id);
        toPreload = toPreload.nextElementSibling;
    }
    toPreload = el.previousElementSibling;
    for (let i = 0; i < 3; i++) {
        if (toPreload === null) {
            break;
        }
        preload(toPreload.id);
        toPreload = toPreload.previousElementSibling;
    }
    $(el).find(".maintext").marquee({
        speed: 60
    });
    $(el).find(".initiallyHidden").stop().fadeTo(1, 100);
    $(el).find(".bmlist-options").clearQueue().stop().animate({
        width: 'show'
    }, 100);

    // added
    $(el).addClass("sel");
    el.scrollIntoView({ block: "center" });
}

/**
 * @param {Element | undefined} el
 */
function endHi(el = undefined) {
    if (el === undefined) {
        el = cur;
    }
    $(el).find(".initiallyHidden").fadeOut(400);
    $(el).find(".maintext").attr('stop', 1);
    $(el).find(".bmlist-options").clearQueue().stop().animate({
        width: 'hide'
    }, 100);

    // added
    $(el).removeClass("sel");
}

/**
 * @param {Element} next
 */
function updateSelected(next) {
    endHi();
    cur = next;
    startHi();
    if (!audio.paused) {
        audioPlayPause();
    }
}

/**
 * @param {boolean} prev
 */
function nextPage(prev) {
    const from = prev ? "Prev" : "Next";
    const link = $(`.pagination>a:contains(${from})`)[0];
    if (link === undefined) {
        return;
    }
    GM_setValue(FROM_OTHER_PAGE, from);
    if (!audio.paused) {
        GM_setValue(WAS_PLAYING, from);
    }
    
    link.click();
}

/**
 * @param {string | undefined} id
 */
function audioPlayPause(id = undefined) {
    if (id === undefined) {
        id = cur.id;
    }
    $('.bmlistt>.icon-pause').removeClass("icon-pause").addClass("icon-play");
    if (playBeatmapPreview(id))
        $(cur).find('.bmlistt>i').removeClass("icon-play").addClass("icon-pause");
}

function showDetails() {
    window.open("/s/" + cur.id);
}

function download() {
    window.location.href = "/d/" + cur.id;
}

function j() {
    const next = cur.nextElementSibling;
    if (next === null) {
        nextPage(false);
        return;
    }
    updateSelected(next);
}

function k() {
    const next = cur.previousElementSibling;
    if (next === null) {
        nextPage(true);
        return;
    }
    updateSelected(next);
}

document.addEventListener("keypress", (ev) => {
    if (ev.target instanceof HTMLInputElement) {
        return;
    }
    switch (ev.keyCode) {
        case 97: // a
            audioPlayPause();
            break;

        case 115: // s
            showDetails();
            break;

        case 100: // d
            download();
            break;

        case 104: // h
            nextPage(true);
            break;

        case 106: // j
            j();
            break;

        case 107: // k
            k();
            break;

        case 108: // l
            nextPage(false);
            break;

        default:
            break;
    }
});

const otherPage = GM_getValue(FROM_OTHER_PAGE, null);
if (otherPage === "Prev") {
    cur = listing.lastElementChild;
}
GM_setValue(FROM_OTHER_PAGE, null);

const wasPlaying = GM_getValue(WAS_PLAYING, false);
if (wasPlaying) {
    audioPlayPause();
}
GM_setValue(WAS_PLAYING, false);
startHi(cur);
window.addEventListener("load", () => {
    setTimeout(() => cur.scrollIntoView({ block: "center" }), 50);
})

// *undownloads your window*
unsafeWindow.downloadMap = () => {};
// *unclicks your beatmap*
$(".beatmap").off("click");

// preload everything
for (const el of [...listing.children]) {
    el.addEventListener("click", (e) => {
        if (e.currentTarget === cur) {
            showDetails();
        } else {
            updateSelected(e.currentTarget);
        }
    })
    if (el === cur) {
        continue;
    }
}