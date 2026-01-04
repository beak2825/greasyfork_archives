
// ==UserScript==
// @name        garyc.me sketch tweaks
// @namespace   garyc.me by quackbarc
// @description QoL tweaks and personal mods for garyc.me/sketch
// @homepage    https://github.com/quackbarc/garyc-sketch-tweaks
// @author      quac
// @version     1.6.5
// @match       https://garyc.me/sketch/*
// @match       http*://noz.rip/sketch/*
// @match       http*://noz.rip/sketch_bunker/*
// @icon        https://raw.githubusercontent.com/quackbarc/garyc-sketch-tweaks/master/crunge.png
// @license     MIT
// @run-at      document-body
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/475926/garycme%20sketch%20tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/475926/garycme%20sketch%20tweaks.meta.js
// ==/UserScript==

/* TODO:
    - animation speed setting..?
    - improve tag autocomplete caching..?
    - narrow down _purgeIntervals() to just the necessary intervals?
      cuz it might consequently affect other extensions.

    - sketch: update():
      - update the UI with updateUI(State.IDLE)
      - fix animation ending one line too early
      - fix animation using the moveTo/lineTo way of drawing

    - debug:
      - having the viewer open takes up a lot of CPU for some reason; i'm blaming pixi.
*/

/* / */

const GARYC_GALLERY_CLIENT      = "garyc.me/sketch/gallery.php";
const NOZ_GALLERY_CLIENT        = "noz.rip/sketch/gallery.php";
const NOZBUNKER_GALLERY_CLIENT  = "noz.rip/sketch_bunker/gallery.php";

const client = window.location.hostname + window.location.pathname;
const baseURL = client.startsWith("noz.rip/sketch_bunker/")
    ? "https://noz.rip/sketch_bunker"
    : "https://garyc.me/sketch";

var settings = {};

if(window.location.pathname.startsWith("/sketch")) {
    let db = new URLSearchParams(window.location.search).get("db");
    window.db = db && parseInt(db);    // db can be `null`
}

// Using a custom implementation of GM_addStyle instead of giving a @grant GM_addstyle;
// the latter limits our access to `window` properties very greatly.
// Implementation gracefully snagged from https://gist.github.com/arantius/3123124/ (MIT).
/**
 * @param {string} aCss The CSS to append to the page, specifically <head\>.
 */
function GM_addStyle(aCss) {
  'use strict';
  let head = document.getElementsByTagName('head')[0];
  if (head) {
    let style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.textContent = aCss;
    head.appendChild(style);
    return style;
  }
  return null;
}

async function _sleep(ms) {
    return new Promise(res => setTimeout(res, ms));
}

async function _waitForPageRevisit() {
    return new Promise(res => {
        document.addEventListener("visibilitychange", () => {
            if(document.visibilityState == "visible") {
                res();
            }
        }, {once: true});
    });
}

function _purgeIntervals() {
    const lastInterval = setTimeout(() => void 0, 0) - 1;
    for(let int = 0; int <= lastInterval; int++) {
        clearInterval(int);
    }
}

function _getSettings() {
    let defaultSettings = {
        cacheSize: 100,
        theme: "auto",
        noAnimation: false,
        doReplay: true,
        thumbQuality: "default",
        sketchQuality: "default",
        relativeTimestamps: true,
        showDatecards: true,    // on the UI, these would be called "time cards"
        saveAsCanvas: false,
        sketchSaveResolution: 1,
        showStats: true,
        supportApril2023: true,
    };
    if(window.location.hostname == "noz.rip") {
        defaultSettings = {
            ...defaultSettings,
            useArchiveAsBooruSource: true,
            samePageBooru: true,
            showingBooruMenu: false,
            // noz.rip has its own cache with a limited size; gotta be faithful with it.
            cacheSize: 10,
        };
    }

    let settings = {};
    let storedSettings = JSON.parse(localStorage.getItem("settings_sketch")) || {};
    for(const [setting, defaultValue] of Object.entries(defaultSettings)) {
        settings[setting] = storedSettings[setting] ?? defaultValue;
    }

    return settings;
}

function _saveSettings() {
    localStorage.setItem("settings_sketch", JSON.stringify(settings));
}

function _updateTheme() {
    switch(settings.theme) {
        case "auto": {
            let prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
            document.documentElement.setAttribute("theme", prefersDark ? "dark" : "light");
            break;
        }
        case "dark":
        case "light": {
            document.documentElement.setAttribute("theme", settings.theme);
            break;
        }
        default: {
            document.documentElement.setAttribute("theme", "light");
        }
    }
}

function _updateSketchQuality(quality) {
    const ctx = $("canvas")[0].getContext("2d");

    switch(quality) {
        case "spiky": {
            ctx.lineJoin = "miter";
            break;
        }
        case "default":
        default: {
            ctx.lineJoin = "round";
            break;
        }
    }
}

/* /: Main */

function main() {
    _purgeIntervals();
    settings = _getSettings();

    GM_addStyle(`
        /* dark theme */
        :root[theme="dark"] body {
            background-color: #111;
            color: #ccc;
        }
        :root[theme="dark"] #holder {
            background-color: #191919;
        }
        :root[theme="dark"] #holder img:not([src^=save]) {
            filter: invert(90%);
        }
        :root[theme="dark"] input[type="submit" i]:disabled button:disabled {
            background-color: #fff3;
            color: #fff8
        }
        :root[theme="dark"] h1 {
            color: #eee;
        }
        :root[theme="dark"] a {
            color: #5c99ff;
        }
        :root[theme="dark"] a:hover {
            color: #5c99ffcc;
        }
        :root[theme="dark"] a:visited {
            color: #8c1ae9;
        }
        :root[theme="dark"] a:visited:hover {
            color: #8c1ae9cc;
        }

        /* noz.rip */
        :root[theme="dark"] .panel {
            border-color: #888;
        }
        :root[theme="dark"] #holder svg {
            stroke: #e5e5e5;
        }

        /* userscript-created elements */
        :root {
            --z-index-dropdown: 10;
            --background-tag-suggestions: #fff;
            --background-tag-suggestions-selected: #eee;
        }
        :root[theme="dark"] {
            --background-tag-suggestions: #111;
            --background-tag-suggestions-selected: #222;
        }
    `);
    _updateTheme();
}

main();

/* /sketch/gallery.php */

const booruStates = {};
const cache = {};
let lastAlertPromise = null;
let lastAutocompletePromise = null;
let lastAutocompleteQuery = null;
let lastTagsValue = null;
let autocompleteSelected = null;
let cachedCanvasBlob = null;
let datecardDates = new Map();
window.details = null;

// enums

const BooruPostState = {
    POSTED: 1,
    ALREADY_POSTED: 2,
    PARSING_ERROR: 3,
}

const FooterState = {
    NORMAL: 0,
    END_OF_GALLERY: 1,
};

// miscellaneous methods

function _getAprilFoolsColor(id) {
    const index = [
        "#4B0082",  // purple
        "#0000FF",  // blue
        "#008000",  // dark green
        "#FFFF00",  // yellow
        "#FFA500",  // orange
        "#FF0000",  // red
    ];

    return index[id % 6];
}

function _getCurrentTag(tagsBar) {
    const cursorPos = tagsBar.selectionStart;
    // Match everything from the beginning of the tags value to the nth
    // character, and any word/part of word that comes immediately after it.
    // Using [^ \n] instead of just [^ ] just to match with what . captures.
    // Using {0,n} instead of {n} because I don't want match breakage
    //   (from an n that's bigger than the search string).
    const pattern = new RegExp(`^.{0,${cursorPos}}[^ \n]*`);

    const rawTags = tagsBar.value;
    const [rawTagsShort,] = rawTags.match(pattern);
    const tags = rawTagsShort.split(" ");
    const currentTag = tags.at(-1);

    return currentTag;
}

function toSVG(dat, linejoin="round") {
    const commands = [];
    for(const line of dat.split(" ")) {
        for(let ind = 0; ind + 4 <= line.length; ind += 4) {
            const [x, y] = [
                parseInt(line.slice(ind, ind+2), 36),
                parseInt(line.slice(ind+2, ind+4), 36)
            ];
            const command = ind == 0 ? `M${x},${y}` : `L${x},${y}`;
            commands.push(command);
        }
    }

    const path = commands.join("");
    const xml = [
        '<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">',
            '<path',
            `d="${path}"`,
            'fill="none"',
            'stroke="black"',
            'stroke-width="3px"',
            'stroke-miterlimit="10"',
            `stroke-linecap="butt"`,
            `stroke-linejoin="${linejoin}"/>`,
        '</svg>'
    ].join("\n");
    return xml;
}

// UI and public API methods

function _tileAnchorOverride(event) {
    event.preventDefault();

    const a = event.currentTarget;
    const idMatch = a.href.match(/#(\d+)/)
    const [hashID, id] = idMatch;
    window.history.pushState(window.history.state, "", hashID);
    show(parseInt(id));
}

function _navAnchorOverride(event) {
    event.preventDefault();

    const a = event.currentTarget;
    const idMatch = a.href.match(/#(\d+)/)
    const id = parseInt(idMatch[1]);
    show(id);
}

function _getThumbSize(qualityName) {
    switch(qualityName) {
        case "awful":
            return 4;
        case "oldDefault":
            return 20;
        case "raster":
            return 20.1;
        case "hq":
            return 40;
        case "default":
        default:
            return 100;
    };
}

function _getNozSVGAsset(type) {
    // These COULD be put on separate files for cacheability
    switch(type) {
        case "top": {
            return (`
                <svg
                    fill="none"
                    stroke="black"
                    stroke-width="30"
                    stroke-linejoin="round"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 300 300"
                    width="300" height="300">
                        <circle cx="150" cy="150" r="135"></circle>
                        <path d="${[
                            "M 95,75 L 205,225 z",
                            "M 205,75 L 95,225 z"
                        ].join(" ")}">
                        </path>
                </svg>
            `);
        }
        case "left": {
            return (`
                <svg
                    fill="none"
                    stroke="black"
                    stroke-width="20"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 300 300"
                    width="300" height="300">
                        <path d="${[
                            "M 180,30 L 16,150 L 180,270",
                            "V 200 H 290 V 100 H 180 V 30 z"
                        ].join(" ")}">
                        </path>
                </svg>
            `);
        }
        case "right": {
            return (`
                <svg
                    fill="none"
                    stroke="black"
                    stroke-width="20"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 300 300"
                    width="300" height="300">
                        <path d="${[
                            "M 120,30 L 284,150 L 120,270",
                            "V 200 H 10 V 100 H 120 V 30 z",
                        ].join(" ")}">
                        </path>
                </svg>
            `);
        }
        default: {
            throw Error(`unknown asset type "${type}"`);
        }
    }
}

function getTile(id) {
    let imgURL;
    if(client == NOZBUNKER_GALLERY_CLIENT) {
        imgURL = `getIMG.php?id=${id}`;
    } else {
        let size = _getThumbSize(settings.thumbQuality);
        let dbParam = window.db != null ? `&db=${window.db}` : "";
        imgURL = `https://garyc.me/sketch/getIMG.php?format=png${dbParam}&id=${id}&size=${size}`;
    }

    const tile = $([
        `<a href="#${id}">`,
        `<img src="${imgURL}" style="`,
            `padding: 5px;`,
            `width: 160px;`,
            `height: 120px;`,
        `"></a>`,
    ].join(""));
    tile.click(_tileAnchorOverride);

    return tile;
}

function createDateCard(dt) {
    let weekday = dt.toLocaleString("default", {weekday: "long"});
    let date = dt.toLocaleString("default", {month: "long", day: "numeric", year: "numeric"});
    return $(`
        <div class="datecard">
            <div>
                ${weekday}<br>${date}
            </div>
        </div>
    `);
}

function currentURL() {
    const client = window.location.hostname + window.location.pathname;
    if(window.db != null) {
        return `https://${client}?db=${window.db}#${window.current}`;
    } else {
        return `https://${client}#${window.current}`;
    }
}

function currentArchiveURL() {
    if(window.db != null) {
        return null;
    } else {
        return `https://noz.rip/sketch_bunker/gallery.php?maxid=${window.current}#${window.current}`;
    }
}

function updateDetails(options={}) {
    if(window.current == null) {
        return;
    }

    const defaultOptions = {
        message: null,
        showFullTimestamp: false,
    };
    const mergedOptions = {...defaultOptions, ...options};
    const {message, showFullTimestamp} = mergedOptions;

    const unavailable = (window.dat == "wait" || window.dat == "wait ");    // thanks drawData();
    let elems = [];

    if(message != null) {
        elems.push(message);
    } else if(unavailable) {
        elems.push("(unavailable)");
    } else {
        let ink = Math.floor(window.dat.length / 65535 * 100);
        let inkText = `${ink}% ink used`;
        elems.push(inkText);
    }

    // This build custom HTML for the URL, unlike currentURL(), which only
    // returns it as a string.
    let client = window.location.hostname + window.location.pathname;
    let current = `<span class="id">#${window.current}</span>`;
    let url = (
        window.db != null
        ? `https://${client}?db=${window.db}${current}`
        : `https://${client}${current}`
    );
    elems.push(url);

    const hasSketchDetails = window.details.origin || (window.details.timestamp != null);  // for timestamp=0 ig
    if(hasSketchDetails) {
        let origin = window.details.origin;
        let date = new Date(window.details.timestamp * 1000);
        let timestamp = date
            .toLocaleString("default", {
                weekday: "short",
                month: "long",
                day: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        let timestampTooltip = date
            .toLocaleString("default", {
                weekday: "short",
                month: "long",
                day: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                timeZoneName: "short",
            });
        if(settings.relativeTimestamps) {
            const today = new Date();
            const yesterday = new Date(today - 86_400_000);
            const dateOptions = {
                weekday: "short",
                month: "long",
                day: "2-digit",
                year: "numeric",
            };
            timestamp = timestamp
                .replace(today.toLocaleString("default", dateOptions), "Today")
                .replace(yesterday.toLocaleString("default", dateOptions), "Yesterday");

            const weekdayMin = new Date();
            weekdayMin.setDate(today.getDate() - 6);
            weekdayMin.setHours(0, 0, 0, 0);

            if(date >= weekdayMin) {
                timestamp = timestamp
                    .replace(
                        date.toLocaleString("default", dateOptions),
                        date.toLocaleString("default", {weekday: "long"})
                    );
            }
        }

        let timestampHTML = `<span title="${timestampTooltip}">${timestamp}</span>`;
        if(showFullTimestamp) {
            timestampHTML = `<span>${timestampTooltip}</span>`;
        }

        let detailsText = `from ${origin} • ${timestampHTML}`;
        if(origin == null) {
            detailsText = timestampHTML;
        }
        let detailsHTML = `<span class="extra">${detailsText}</span>`

        elems.push(detailsHTML);
    }

    switch(client) {
        case NOZ_GALLERY_CLIENT: {
            const left = $(`<div id="details-left"></div>`);
            const right = $(`<div id="details-right"></div>`);

            const [booruForm, booruToggle] = createBooruFormUI(window.current);

            $("#details").empty();
            $("#details").append(left, right);
            left.append(elems.join("<br>"));
            right.append(booruForm, booruToggle);
            break;
        }
        default: {
            $("#details").empty();
            $("#details").append(elems.join("<br>"));
        }
    }

    $(".extra span[title]").click(() => detailsFullTimestamp());
}

async function detailsAlert(msg) {
    if(document.visibilityState == "hidden") {
        await _waitForPageRevisit();
    }

    updateDetails({message: msg});
    let alertPromise = lastAlertPromise = _sleep(3000);
    await alertPromise;
    if(alertPromise === lastAlertPromise) {
        updateDetails();
    }
}

async function detailsFullTimestamp() {
    updateDetails({showFullTimestamp: true});
    let alertPromise = lastAlertPromise = _sleep(3000);
    await alertPromise;
    if(alertPromise === lastAlertPromise) {
        updateDetails();
    }
}

function createStats() {
    const stats = $(`<span id="stats">...</span>`);
    return stats;
}

function updateStats(json) {
    const {sketches, artists, peekers} = json;
    let es_were = sketches == 1 ? " was" : "es were";
    let different_artists = artists == 1 ? " artist" : "different artists";
    let were = peekers == 1 ? "was" : "were";
    let people = peekers == 1 ? "person" : "people";

    $("#stats").html(
        "In the past 5 minutes, "
        + `<b>${sketches}</b> sketch${es_were} swapped by `
        + `<b>${artists}</b> ${different_artists}. There ${were} also `
        + `<b>${peekers}</b> ${people} who only peeked.`
    );
}

function createGalleryButtons(id) {
    let topAsset, leftAsset, rightAsset;
    switch(window.location.hostname) {
        case "noz.rip": {
            topAsset = _getNozSVGAsset("top");
            leftAsset = _getNozSVGAsset("left");
            rightAsset = _getNozSVGAsset("right");
            break;
        }
        default: {
            topAsset = `<img src="https://garyc.me/sketch/top.png">`;
            leftAsset = `<img src="https://garyc.me/sketch/left.png">`;
            rightAsset = `<img src="https://garyc.me/sketch/right.png">`;
        }
    }

    let leftID = Math.max(window.min, id + 1);
    let rightID = Math.min(window.max, id - 1);

    var top = `<a href="#0" onclick="hide()" class="top">${topAsset}</a>`;
    var leftReg = `<a href="#${leftID}" class="left">${leftAsset}</a>`;
    var leftMax = `<div class="left"></div>`;
    var rightReg = `<a href="#${rightID}" class="right">${rightAsset}</a>`;
    var rightMin = `<div class="right"></div>`;
    var left = id >= window.max ? leftMax : leftReg;
    var right = id <= window.min ? rightMin : rightReg;

    return {
        top: top,
        left: left,
        right: right,
    };
}

function updateGalleryButtons() {
    if(window.current == null) {
        return;
    }

    const {top, left, right} = createGalleryButtons(window.current);
    $(".top").replaceWith(top);
    $(".left").replaceWith(left);
    $(".right").replaceWith(right);
}

function saveBooruChanges(id, form) {
    if(!booruStates.hasOwnProperty(id)) {
        booruStates[id] = {
            booruPostID: null,
            booruPostStatus: null,
            uploading: false,
            tags: null,
            rating: null,
        };
    }

    const tagsBar = form.find("input[name='tags']");
    const ratingSelect = form.find("select#rating");

    const state = booruStates[id];
    state.tags = tagsBar.val();
    state.rating = ratingSelect.val();
}

async function getDateCards(endID, size) {
    if(size <= 0) {
        return [];
    }

    let fromID = endID - size + 1;
    let toID = endID;
    let lastTimestamp = new Date();

    var ret = [];

    const fetchIDFrom = Math.ceil(fromID / 100) * 100;
    const fetchIDTo = Math.ceil(toID / 100) * 100;
    for(let fetchID = fetchIDTo; fetchID >= fetchIDFrom; fetchID -= 100) {
        let html = await fetch(`https://garyc.me/sketch/getMore.php?start=${fetchID}&db=${db || ""}`)
            .then(r => r.text());

        // Parsing HTML with regex instead of making a document fragment,
        // since one, it's cleaner to write than the alternative, and two,
        // we won't get 404s from thumbnails of sketches that don't exist.

        const htmlRegex = /class='timestamp'.+?>(?<timestamp>\d*)<\/div><a href=['"](?<href>#\d+)/g;
        for(const match of html.matchAll(htmlRegex)) {
            if(!match.groups.timestamp) {
                continue;
            }

            let timestamp = new Date(match.groups.timestamp * 1000);
            let href = match.groups.href;
            let id = parseInt(href.replace("#", ""));

            if(lastTimestamp.toDateString() != timestamp.toDateString()) {
                ret.push([timestamp, createDateCard(timestamp), id]);
            }

            lastTimestamp = timestamp;
        }
    }

    return ret;
}

async function getDateCardMapping(last, size) {
    let datecards = {};
    for(const [timestamp, datecard, id] of await getDateCards(last, size)) {
        let date = timestamp.toDateString();
        datecards[id] = [datecard, date];
    }
    return datecards;
}

async function saveCanvas() {
    if(window.current == null) {
        return;
    }

    // Render the entire sketch first before saving
    window.setData(window.dat);

    const scale = settings.sketchSaveResolution;

    let downloadFn = window.db == null
        ? `${window.current}`
        : `${window.db}#${window.current}`;

    if(scale != 1) {
        downloadFn = `${downloadFn}_${scale}x`
        await scaleCanvas(scale);
    }

    const sketch = window.sketch[0];
    let blob = await new Promise((res, rej) => sketch.toBlob(blob => res(blob)));
    let url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = downloadFn;
    a.click();

    URL.revokeObjectURL(url);

    if(scale != 1) {
        await scaleCanvas(1);
    }
}

function saveSVG() {
    if(window.current == null) {
        return;
    }

    const linejoin = settings.sketchQuality == "spiky" ? "miter" : "round";
    const svg = toSVG(window.dat, linejoin);

    const blob = new Blob([svg], {type: "image/svg+xml"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = `${window.current}.svg`;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
}

async function scaleCanvas(size) {
    const width = (800 * size) | 0;
    const height = (600 * size) | 0;

    // Once the canvas has its width/height properties tampered with,
    // everything about it would reset.
    // Restore canvas state right after.
    $("#sketch").attr({
        width: `${width}px`,
        height: `${height}px`
    });

    graphics.setTransform(0, 0, size, size);
    _updateSketchQuality(settings.sketchQuality);

    // Give PIXI some time to re-render the whole sketch before we return
    await new Promise((res, rej) => {
        app.ticker.addOnce(res);
        // While the ticker already fires .update() under a clock,
        // we still wanna try firing it ourselves just to be REALLY sure
        app.ticker.update();
    });
}

// Booru and tag autocomplete methods (for noz.rip/booru)

async function selfUploadToBooru(id, form) {
    // Form can only be serialized before it gets disabled.
    const formSerial = form.serialize();

    saveBooruChanges(id, form);
    const booruState = booruStates[id];

    booruState.uploading = true;
    updateDetails();

    let resp = await fetch(
        "/booru/upload",
        {
            method: "POST",
            body: new URLSearchParams(formSerial),
        }
    );

    const uploadSuccessful = resp.redirected;  // not the best way of detecting this. try a URL regex?
    const loggedOut = resp.status == 403;
    const booruServerError = resp.status >= 500 && resp.status <= 599;

    if(loggedOut) {
        booruState.uploading = false;
        detailsAlert("can't upload; logged out of booru");
        return;
    }
    if(booruServerError) {
        booruState.uploading = false;
        detailsAlert("booru's having hiccups. try again later?");
        return;
    }

    if(uploadSuccessful) {
        const match = resp.url.match(/\/view\/(\d+)/);
        const postID = parseInt(match[1]);
        booruState.booruPostID = postID;
        booruState.booruPostStatus = BooruPostState.POSTED;
    }
    else {
        // Until I find a way to properly check for errors and hash duplicates through the wire,
        // this will have to do.

        const idPattern = /data-post-id='(\d+)'/;

        const text = await resp.text();
        const match = text.match(idPattern);
        if(!match) {
            const doc = new DOMParser().parseFromString(text, "text/html");

            const xEmptyErrorElem = $(doc).find("section[id^=Error_with] .blockbody");
            const generalErrorElem = $(doc).find("section[id^=Error] .blockbody");

            const isXEmptyError = xEmptyErrorElem.length > 0;
            const isGeneralError = generalErrorElem.length > 0;
            if(isXEmptyError) {
                booruState.uploading = false;
                detailsAlert("can't upload; unavailable sketch");
                return;
            }
            else if(isGeneralError) {
                const errorMessage = generalErrorElem.text();

                booruState.uploading = false;
                detailsAlert(`booru error: ${errorMessage}`);
                return;
            }
            else {
                console.error("Unexpected response from Shimmie:", doc);
                booruState.booruPostStatus = BooruPostState.PARSING_ERROR;
            }
        }
        else {
            const postID = parseInt(match[1]);
            booruState.booruPostID = postID;
            booruState.booruPostStatus = BooruPostState.ALREADY_POSTED;
        }
    }

    booruState.uploading = false;
    if(window.current == id) {
        updateDetails();
    }
}

async function hideTagSuggestions() {
    $("#tagSuggestions").hide();
    lastAutocompletePromise = null;
    lastAutocompleteQuery = null;
    autocompleteSelected = null;
}

async function updateTagSuggestions() {
    const tagsBar = $("input[name='tags']");
    const tagsBarElement = tagsBar[0];

    const currentTag = _getCurrentTag(tagsBarElement);
    if(!currentTag) {
        hideTagSuggestions();
        return;
    }

    $("#tagSuggestions").hide();

    let autocompletePromise = lastAutocompletePromise = _sleep(200);
    await autocompletePromise;
    if(autocompletePromise !== lastAutocompletePromise) {
        return;
    }

    const baseURL = "https://noz.rip/booru/api/internal/autocomplete";
    const url = baseURL + "?s=" + currentTag;
    // Endpoint doesn't send caching instructions;
    // we're on our own here
    const cacheType = "reload";

    let p = fetch(url, {cache: cacheType}).catch(err => err);
    let fetchPromise = lastAutocompletePromise = p;
    const resp = await fetchPromise;
    if(fetchPromise !== lastAutocompletePromise) {
        return;
    }
    lastAutocompletePromise = null;

    // Network issue; ignore
    if(resp instanceof TypeError) {
        return;
    }

    if(!resp.ok) {
        await autocompleteError(resp);
        return;
    }

    const json = await resp.json();
    await autocompleteDropdown(json, currentTag);
}

async function autocompleteError(response) {
    $("#tagSuggestions").show();
    $("#tagSuggestions").html(`
        <tr role="option" class="tagInfo">
            <td colspan="2">
                (something went wrong: ${response.status} ${response.statusText})
            </td>
        </tr>
    `);
}

async function autocompleteDropdown(json, query) {
    const tagElements = [];
    let tags = Object.entries(json);
    if(json instanceof Array) {
        // For queries with zero results. Damn this API is terrible
        tags = json;
    }

    if(tags.length == 0) {
        const element = $(`
            <tr role="option" class="tagInfo">
                <td colspan="2">
                    (new tag: ${query})
                </td>
            </tr>
        `);
        tagElements.push(element);
        $("#tagSuggestions").show();
        $("#tagSuggestions").html(tagElements);
    }

    const lastSelectedIndex = tags.findIndex(([name, count]) => name == autocompleteSelected);
    const selectedIsKept = lastSelectedIndex >= 0;

    if(tags.length >= 1 && selectedIsKept) {
        autocompleteSelected = autocompleteSelected;
    }
    else if(tags.length >= 1 && !selectedIsKept) {
        autocompleteSelected = tags[0][0];
    }
    else if(tags.length == 0) {
        autocompleteSelected = null;
    }

    const maxTagCount = 20;
    for(let i = 0; i < Math.min(tags.length, maxTagCount); i++) {
        const [name, result] = tags[i];
        const {count} = result;
        const element = $(`
            <tr role="option" name="${name}">
                <td class="tagName">${name}</td>
                <td class="tagCount">${count}</td>
            </tr>
        `);

        // Don't lose focus off the tags bar.
        element.on("pointerdown", function(event) {
            const focusingTagsBar = $("input[name='tags']").has(":focus");
            return !focusingTagsBar;
        });
        element.on("pointerup", () => addTag(name, query));

        element.on("pointerover", () => autocompleteSelect(name));
        element.attr("aria-selected", (name == autocompleteSelected).toString());
        tagElements.push(element);
    }

    if(tags.length > maxTagCount) {
        const remainingTags = tags.slice(maxTagCount);
        const element = $(`
            <tr role="option" class="tagInfo">
                <td colspan="2">
                    (${remainingTags.length} more...)
                </td>
            </tr>
        `);
        tagElements.push(element);
    }

    $("#tagSuggestions").show();
    $("#tagSuggestions").html(tagElements);
}

function autocompleteSelect(name) {
    const option = $(`#tagSuggestions [name="${name}"]`);
    const optionExists = option.length >= 1;
    if(!optionExists) {
        console.debug(`"${name}" doesn't exist in visible tags, ignoring that`);
        return;
    }

    const optionLast = $(`#tagSuggestions [aria-selected]`);
    optionLast.attr("aria-selected", "false");
    option.attr("aria-selected", "true");

    autocompleteSelected = name;
}

function addTag(name, query) {
    const tagsBar = $("#booruForm input[name=tags]");
    const rawTags = tagsBar.val();
    const index = tagsBar.prop("selectionStart");

    const [section,] = rawTags.match(new RegExp(`.{0,${index}}[^ ]*`));
    let sectionTags = section.split(" ");
    sectionTags[sectionTags.length - 1] = name;
    sectionTags = sectionTags.join(" ");

    const newIndex = sectionTags.length + 1;
    const newTags = sectionTags + " " + rawTags.slice(section.length).trimLeft(" ");
    tagsBar.prop("value", newTags);
    tagsBar.prop("selectionStart", newIndex);
    tagsBar.prop("selectionEnd", newIndex);

    tagsBar.focus();
    hideTagSuggestions();
}

// overrides

function gallery_update() {
    if(autodrawpos >= 0) {
        for(var i = 0; i < 8; i++) {
            if(autodrawpos == lines.length) {
                autodrawpos = -1;
                break;
            }
            var line = lines[autodrawpos++];
            if(line.moveTo) {
                graphics.moveTo(line.x1, line.y1);
            }
            graphics.lineTo(line.x2, line.y2);
        }
    }
}

async function refresh() {
    $("#refresh").prop("disabled", true);
    $("#refresh").val("checking...");

    function enableRefresh() {
        $("#refresh").prop("disabled", false);
        $("#refresh").val("refresh");
    }

    $.ajax({
        url: `https://garyc.me/sketch/getStats.php?details&db=${db || ""}`,
        dataType: "json",
        success: function(json) {
            updateStats(json);
            const newMax = json.maxID;

            // noz.rip: `window.max` can be fetched from a $.ajax() on init,
            // but it's saved as a string. Firing this request a bit after
            // the $.ajax() call SHOULD fix that on time.

            const init = window.max == null || typeof window.max == "string";
            if(init) {
                window.max = newMax;
                window.min = json.minID;
                updateGalleryButtons();
                return enableRefresh();
            }

            if(window.max == newMax) {
                return enableRefresh();
            }

            for(let id = window.max + 1; id <= newMax; id++) {
                $("#tiles").prepend(
                    $(getTile(id))
                      .hide()
                      .show(1000)
                );
            }

            if(settings.showDatecards) {
                // Max values are -1'd so that IDs ending with 00 are NOT
                // equal to IDs ending with 01; the latter's where
                // `addMore.php`'s thumbnails start.
                let lastMax100 = Math.floor((window.max - 1) / 100);
                let newMax100 = Math.floor((newMax - 1) / 100);
                if(newMax100 > lastMax100) {
                    // Size is +1'd so the previous sketch gets a datecard
                    // when the current day changes.
                    addDateCards(newMax, newMax - window.max + 1);
                }
            }

            const viewingLatestSketch = window.current == window.max;
            window.max = newMax;
            window.min = json.minID;

            if(viewingLatestSketch) {
                updateGalleryButtons();
            }

            enableRefresh();
        },
        error: function(req) {
            enableRefresh();
        },
    });
}

async function nozBunker_refresh() {
    if(window.customMax != null) {
        return;
    }

    $("#refresh").prop("disabled", true);
    $("#refresh").val("checking...");

    function enableRefresh() {
        $("#refresh").prop("disabled", false);
        $("#refresh").val("refresh");
    }

    $.ajax({
        url: `https://noz.rip/sketch_bunker/getMaxID.php`,
        dataType: "text",
        success: function(resp) {
            const newMax = parseInt(resp);
            if(window.max == newMax) {
                return enableRefresh();
            }

            for(let id = window.max + 1; id <= newMax; id++) {
                $("#tiles").prepend(
                    $(getTile(id))
                      .hide()
                      .show(1000)
                );
            }

            const viewingLatestSketch = window.current == window.max;
            window.max = newMax;

            if(viewingLatestSketch) {
                updateGalleryButtons();
            }

            enableRefresh();
        },
        error: function(req) {
            enableRefresh();
        },
    });
}

function gallery_drawData(data) {
    reset();

    var parts = data.split(" ");
    var ox = 0;
    var oy = 0;
    for(var i = 0; i < parts.length; i++) {
        var part = parts[i];
        for(var j = 0; j < part.length; j += 4) {
            var x = dec(part.substr(j, 2));
            var y = dec(part.substr(j+2, 2));
            if(j >= 4) {
                lines.push({
                    moveTo: (j == 4),
                    x1: ox,
                    y1: oy,
                    x2: x,
                    y2: y,
                });
            }
            ox = x;
            oy = y;
        }
    }

    // dunno what this extra space is for but that's what was
    // on the original client
    window.dat = data.trim() + " ";

    autodrawpos = 0;
}

function gallery_reset() {
    let fillColor = 0xFFFFFF;

    // April Fools' 2023 color support
    if(settings.supportApril2023 && window.details) {
        const {id, timestamp} = window.details;
        const aprilFools2023 = (timestamp >= 1680332400) && (timestamp < 1680418800);
        if(aprilFools2023) {
            const color = _getAprilFoolsColor(id);
            const colorInt = parseInt(color.slice(1), 16);
            fillColor = colorInt;
        }
    }

    graphics.clear();

    graphics.beginFill(fillColor);
    graphics.drawRect(0, 0, 800, 600);
    graphics.endFill();

    graphics.lineStyle(3, 0x000000);
    graphics.moveTo(0,0);

    dat = "";
    lines = [];
    cachedCanvasBlob = null;

    if([NOZ_GALLERY_CLIENT, NOZBUNKER_GALLERY_CLIENT].includes(client)) {
        window.autodraw = false;
    }
    else {
        window.autodrawpos = -1;
    }
}

function show(id) {
    // show() via page init passes the ID as a string (from URL hash).
    // can't change that since it's fired from an event listener.
    id = parseInt(id);
    if(Number.isNaN(id)) return;

    if(id == 0) return;
    // prevents showing the same sketch again.
    if(id == window.current) return;

    if(client == NOZ_GALLERY_CLIENT) {
        hideTagSuggestions();
    }

    const hashID = `#${id}`
    const historyState = window.history.state;
    const showingFromHash = window.location.hash == hashID;
    if(window.current == null && !showingFromHash) {
        window.history.pushState(historyState, "", hashID);
    }
    else {
        window.history.replaceState(historyState, "", hashID);
    }

    window.current = id;

    // html building
    // TODO: don't rebuild this everytime this function's called

    const {top, left, right} = createGalleryButtons(id);

    let saveParts = [];
    let saveSVGParts = [];

    let saveAnchorStart;
    if(settings.saveAsCanvas) {
        saveAnchorStart = '<a class="save" title="Save (PNG)">'
    } else {
        let sizeParam = settings.sketchSaveResolution * 100;
        let dbParam = window.db != null ? `&db=${window.db}` : "";
        let downloadFn = window.db == null ? `${id}` : `${window.db}#${id}`;
        saveAnchorStart = [
            `<a`,
                ` href="${baseURL}/getIMG.php?format=png${dbParam}&id=${id}&size=${sizeParam}"`,
                ` download="${downloadFn}.png"`,
                ` class="save"`,
                ` title="Save (PNG)"`,
            `>`
        ].join("");
    }

    saveParts.push(
        saveAnchorStart,
        `<img src="save.png" style="width: 25px; height: 25px; position: relative;">`,
        `</a>`,
    );

    if(client == NOZ_GALLERY_CLIENT) {
        saveSVGParts.push(
            '<a class="saveSVG" title="Save (SVG)">',
            `<img src="svg.png" style="width: 25px; height: 25px; position: relative;">`,
            '</a>',
        );
    }

    var saves = [`<div class="saves">`, ...saveParts, ...saveSVGParts, `</div>`].join("");
    var bottom = `<div id="details">...</div>`;

    $("#holder").addClass("active");
    $("#holder").empty();
    $("#holder").append([top, left, sketch, right, bottom, saves]);
    $("#tiles").css({opacity: "75%"});

    $("a.left").click(_navAnchorOverride);
    $("a.right").click(_navAnchorOverride);
    if(settings.saveAsCanvas) {
        $(".save").click(() => saveCanvas());
    }
    if(window.location.hostname == "noz.rip") {
        $(".saveSVG").click(() => saveSVG());
    }

    // clear alerts and other cached properties from the last shown sketch
    lastAlertPromise = null;

    sketch.show();
    sketch.on("click", () => {
        const animating = [NOZ_GALLERY_CLIENT, NOZBUNKER_GALLERY_CLIENT].includes(client)
            ? window.autodraw
            : window.autodrawpos >= 0;

        if(!animating && settings.doReplay) {
            drawData(window.dat);
        } else {
            setData(window.dat);
        }
    });
    reset();
    get(id);
}

function hide() {
    $("#tiles").css({opacity: "100%"});
    $("#holder").removeClass("active");
    window.current = null;
    window.details = null;
    reset();

    // Prevent back-forward soft-lock from navigating to gallery.php (w/o hash)
    const firedFromHash = (!window.location.hash || window.location.hash == "#0");
    if(!firedFromHash) {
        window.history.pushState(window.history.state, "", "#0");
    }

    if(client == NOZ_GALLERY_CLIENT) {
        hideTagSuggestions();
    }
}

function addToCache(id, details) {
    details.data = details.data.trim();
    cache['#' + id] = details;
    let keys = Object.keys(cache);
    let tail = keys[0];
    if(keys.length > settings.cacheSize) {
        delete cache[tail];
    }
}

async function get(id) {
    function success(details) {
        let dat = details.data;
        window.dat = dat;
        window.details = details;
        updateDetails();

        if(dat == "wait") return;
        if(settings.noAnimation) {
            setData(dat);
        } else {
            drawData(dat);
        }
    }

    if(cache.hasOwnProperty("#" + id)) {
        return success(cache["#" + id]);
    }

    $.ajax({
        url: `${baseURL}/get.php?db=${db || ""}&id=${id}&details`,
        dataType: "text",
        success: function(resp) {
            // Despite being a JSON endpoint, "wait" still gets sent as plain
            // text without quotes.
            let details;
            if(resp == "wait") {
                details = {
                    id: id,
                    data: "wait",
                    timestamp: null,
                    origin: null,
                };
            } else {
                try {
                    details = JSON.parse(resp);
                }
                catch(err) {
                    // If we're here, then this is just plain data.
                    details = {
                        id: id,
                        data: resp,
                        timestamp: null,
                        origin: null,
                    };
                }
            }

            if(window.dat.trim() == details.data.trim()) {
                // We already loaded this sketch; don't load it again.
                return;
            }

            addToCache(id, details);
            if(window.current == id) {
                success(details);
            }
        },
        error: function(req) {
            $("#details").html("network error.");
        },
    });
}

async function addDateCards(last, size) {
    if(!settings.showDatecards) {
        return;
    }

    for(const [timestamp, datecard, id] of await getDateCards(last, size)) {
        let date = timestamp.toDateString();

        if(datecardDates.has(date)) {
            const datecardID = datecardDates.get(date);
            const datecardNeedsUpdate = id > datecardID;
            if(!datecardNeedsUpdate) {
                continue;
            }

            const a = $(`#tiles a[href='#${datecardID}']`);
            const oldDatecard = a.prev();
            oldDatecard.remove();
        }

        const a = $(`#tiles a[href='#${id}']`);
        if(a.length > 0) {
            a.before(datecard);
            datecardDates.set(date, id);
        }
    }
}

async function addMore(n=100) {
    let limit;
    if(client == NOZBUNKER_GALLERY_CLIENT) {
        limit = 1;
    } else {
        const hardLimit = 1;
        const lastPossible = Math.max(hardLimit, window.min);
        limit = lastPossible;
    }

    let newtiles = [];
    let last = window.max - ($("#tiles").children("a").length) + 1;
    let target = Math.max(last - n, limit);

    for(let id = last - 1; id >= target; id--) {
        newtiles.push(getTile(id));
    }

    const footerState = target == limit
        ? FooterState.END_OF_GALLERY
        : FooterState.NORMAL;
    if(footerState == FooterState.END_OF_GALLERY && !(last == target)) {
        const tilesEnd = createGalleryFooter(footerState);
        $("#tilesEnd").replaceWith(tilesEnd);
    }

    $("#tiles").append(newtiles);

    if(client != NOZBUNKER_GALLERY_CLIENT) {
        addDateCards(last - 1, n);
    }
}

function addMoreTop(n=100) {
    if(client != NOZBUNKER_GALLERY_CLIENT) {
        return;
    }

    let newtiles = [];
    let last = window.max;
    let target = Math.min(last + n, window.archiveMax);

    for(let id = target; id > window.max; id--) {
        newtiles.push(getTile(id));
    }

    window.max = target;
    $("#tiles").prepend(newtiles);
    $("#status").html(`Showing sketches up to #${target}`);
    if(target == window.archiveMax) {
        $("#loadmoretop").prop("disabled", true);
    }

    const viewingLatestSketch = window.current == last;
    if(viewingLatestSketch) {
        updateGalleryButtons();
    }
}

function createBooruFormUI(id) {
    const cookies = document.cookie.split(";");
    const shimUser = cookies.some((c) => c.trim().startsWith("shm_user="));
    const shimSess = cookies.some((c) => c.trim().startsWith("shm_session="));
    const hasBooruCredentials = shimUser && shimSess;
    if(!hasBooruCredentials) {
        return [null, null];
    }

    const sketch = cache["#" + id];
    const unavailable = (sketch.data == "wait" || sketch.data == "wait ");  // thanks drawData();
    if(unavailable) {
        return [null, null];
    }

    if(window.db) {
        const warning = $(
            `<button disabled>
                booru doesn't support custom DBs
            </button>
        `);
        return [null, warning];
    }

    const showButton = $("<button>show booru menu</button>");
    const form = $(`
        <form
            id="booruForm"
            target="_blank"
            action="/booru/upload"
            method="POST"
            enctype="multipart/form-data"
            style="display: none;">
            <input type="hidden" name="sketchid" value="${id}">
            <input type="hidden" name="source" value="${currentArchiveURL()}">
            <span id="postStatus"></span>
            <div id="tagsContainer">
                <table id="tagSuggestions" role="listbox"></table>
                <input
                    type="text"
                    name="tags"
                    required
                    placeholder="tagme"
                    autocomplete="off"
                    class="autocomplete_tags">
            </div>
            <div id="booruButtons">
                <!-- Select isn't natively part of the form; post-processing is done to make
                     ratings actually get sent. -->
                <select id="rating">
                    <option value="?" selected>Unrated</option>
                    <option value="s">Safe</option>
                    <option value="q">Questionable</option>
                    <option value="e">Explicit</option>
                </select>
                <button type="submit">post to booru</button>
                <button type="button" id="hideBooru">hide</button>
            </div>
        </form>
    `);

    // UI and property assignment

    const tagsBar = form.find("input[name='tags']");
    const ratingSelect = form.find("select#rating");
    const postStatus = form.find("#postStatus");
    const sourceField = form.find("input[name='source']");

    postStatus.hide();
    sourceField.prop("disabled", !settings.useArchiveAsBooruSource);

    const booruState = booruStates[id];
    if(booruState) {
        tagsBar.val(booruState.tags);
        ratingSelect.val(booruState.rating);

        const formInputs = form.find(`input, button, select`);
        formInputs.prop("disabled", booruState.uploading);
    }

    const booruPostStatus =  settings.samePageBooru && booruState && booruState.booruPostStatus;
    if(booruPostStatus) {
        const otherFormElements = form.children(`*:not(#booruButtons, #postStatus)`);
        const otherButtons = form.find(`#booruButtons *:not(#hideBooru)`);
        otherFormElements.hide();
        otherButtons.hide();

        const postURL = `https://noz.rip/booru/post/view/${booruState.booruPostID}`;
        const postIDHTML = [
            `<a href=${postURL} target="_blank">`,
                `/${booruState.booruPostID}`,
            `</a>`
        ].join("");

        switch(booruState.booruPostStatus) {
            case BooruPostState.POSTED: {
                postStatus.html(`sketch uploaded: ${postIDHTML}`);
                break;
            }
            case BooruPostState.ALREADY_POSTED: {
                postStatus.html(`sketch was already uploaded! ${postIDHTML}`);
                break;
            }

            default: {
                console.error("Unexpected booru post state:", booruState.booruPostStatus);
            }
            case BooruPostState.PARSING_ERROR: {
                postStatus.html(`something went wrong! check console for details.`);

                const submit = form.find("button[type=submit]");
                submit.html("try again");
                submit.show();
                break;
            }
        }

        postStatus.show();
    }

    if(settings.showingBooruMenu) {
        form.show();
        showButton.hide();
    }

    // Autocomplete-related

    const tagSuggestions = form.find("#tagSuggestions");
    tagSuggestions.hide();
    tagsBar.on("input", function() {
        updateTagSuggestions();
    });
    tagsBar.on("keydown", function(event) {
        switch(event.key) {
            case "Tab":
            case "Enter": {
                const dropdownClosed = tagSuggestions.is(":hidden");
                const hasModifiers = (
                    event.ctrlKey
                    || event.altKey
                    || event.metaKey
                    || event.shiftKey
                );
                if(dropdownClosed || hasModifiers) {
                    return;
                }

                // Prevent form submission or loss of tags bar focus
                event.preventDefault();

                tagSuggestions.hide();

                const currentTag = _getCurrentTag(this);
                const newTag = autocompleteSelected || currentTag;
                addTag(newTag, currentTag);

                break;
            }

            case "ArrowUp":
            case "ArrowDown": {
                const dropdownClosed = tagSuggestions.is(":hidden");
                if(dropdownClosed) {
                    return;
                }

                // Prevent text caret from moving to the beginning/end of the tags bar
                event.preventDefault();

                const visibleTagElems = tagSuggestions.children(":not(.tagInfo)");
                const visibleTags = Array.from(visibleTagElems).map(
                    (element) => element.querySelector(".tagName").innerHTML
                );
                if(visibleTags.length == 0 || visibleTags.length == 1) {
                    return;
                }

                let selectedIndex = visibleTags.findIndex((tag) => tag == autocompleteSelected);
                if(selectedIndex == -1) {
                    selectedIndex = 0;
                }

                const dir = event.key == "ArrowUp" ? -1 : 1;
                const ind = selectedIndex;
                const length = visibleTagElems.length;
                const selectedIndexNew = (((ind + dir) % length) + length) % length;
                const selectedNew = visibleTags[selectedIndexNew];
                autocompleteSelect(selectedNew);

                break;
            }

            case "Escape": {
                const dropdownClosed = tagSuggestions.is(":hidden");
                if(dropdownClosed) {
                    return;
                }

                // Don't know what this should be preventing specifically, but
                // just in case
                event.preventDefault();

                hideTagSuggestions();
            }
        }
    });
    tagsBar.on("blur", function(event) {
        hideTagSuggestions();
    });
    $(document).on("selectionchange", function() {
        if(!tagsBar.is(":focus")) {
            return;
        }

        const tagsBarElement = tagsBar[0];

        // Don't catch text caret movements from text input.
        const tagsValue = tagsBar.val();
        const tagsValueChanged = lastTagsValue != tagsValue;
        if(tagsValueChanged) {
            const currentTag = _getCurrentTag(tagsBarElement);
            lastTagsValue = tagsValue;
            lastAutocompleteQuery = currentTag;
            return;
        }

        // Text selections should hide #tagSuggestions (we're only catching text caret movement).
        const selectionStart = $("#booruForm input[name=tags]").prop("selectionStart");
        const selectionEnd = $("#booruForm input[name=tags]").prop("selectionEnd");
        const selectingText = selectionStart != selectionEnd;
        if(selectingText) {
            hideTagSuggestions();
            return;
        }

        const currentTag = _getCurrentTag(tagsBarElement);
        const currentTagChanged = lastAutocompleteQuery != currentTag;
        if(currentTagChanged) {
            lastAutocompleteQuery = currentTag;
            updateTagSuggestions();
        }
    });

    // Event listeners

    function toggleForm(showing){
        settings.showingBooruMenu = showing;
        form.toggle(showing);
        showButton.toggle(!showing);
        _saveSettings();
    }

    const hideButton = form.find("#booruButtons #hideBooru");
    showButton.click(() => toggleForm(true));
    hideButton.click(() => toggleForm(false));

    tagsBar.on("change", () => saveBooruChanges(id, form));
    ratingSelect.on("change", () => saveBooruChanges(id, form));

    form.submit(async function(event) {
        const form = $(this);
        const ratingSelect = form.find("select");
        const rating = ratingSelect.val();

        const tagsBar = form.find("input[name='tags']");
        let tags = tagsBar.val();
        let newtags = tags
            .replace(/\s+$/gi, "")
            + (
                tags.match(/\s?rating:./gi)
                ? ""
                : ` rating:${rating}`
            );
        tagsBar.val(newtags.trim());

        if(settings.samePageBooru) {
            event.preventDefault();

            // In the case of retries, clear the existing post status.
            if(booruState && booruState.booruPostStatus) {
                booruState.booruPostStatus = null;
            }

            selfUploadToBooru(id, form);
        }
    });

    return [form, showButton];
}

function createPreferencesUI() {
    const button = $("<button>userscript preferences</button>");
    const preferences = $(`<fieldset id="preferences" style="display: none"></fieldset>`);
    preferences.html(`
        <legend>Preferences</legend>
        <fieldset id="preferences-gallery">
            <legend>Gallery</legend>
            <div class="preference">
                <label for="theme">Theme:</label>
                <select id="theme" name="theme">
                    <option value="auto" selected>System default</option>
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                </select>
            </div>
            <div class="preference">
                <label for="thumbquality">Thumbnail quality:</label>
                <select id="thumbquality" name="thumbquality">
                    <option value="default" selected>Default</option>
                    <option value="hq">Downscaled</option>
                    <option value="raster">Rasterized</option>
                    <option value="oldDefault">Old default</option>
                    <option value="awful">What</option>
                </select>
            </div>
            <div class="preference">
                <label for="showstats">Show the "past 5 minutes" stats bar:</label>
                <input type="checkbox" id="showstats">
            </div>
            <div class="preference">
                <label for="showdatecards">Show time cards:</label>
                <input type="checkbox" id="showdatecards">
                <br>
                <i>(cards might not show up for newer sketches due to an API limitation)</i>
            </div>
        </fieldset>
        <fieldset id="preferences-sketches">
            <legend>Sketches</legend>
            <div class="preference">
                <label for="skipanimation">Auto-skip sketch animation:</label>
                <input type="checkbox" id="skipanimation">
            </div>
            <div class="preference">
                <label for="doreplay">Enable sketch animation replay:</label>
                <input type="checkbox" id="doreplay">
                <br>
                <i>(by clicking on the sketch player or pressing Space)</i>
            </div>
            <div class="preference">
                <label for="sketchquality">Sketch quality:</label>
                <select id="sketchquality" name="sketchquality">
                    <option value="default" selected>No spikes (default)</option>
                    <option value="spiky">Spiky (old)</option>
                </select>
            </div>
            <div class="preference">
                <label for="sketchsaveresolution">Sketch save resolution:</label>
                <select id="sketchsaveresolution" name="sketchsaveresolution">
                    <option value="1" selected>1x</option>
                    <option value="2" title="haha, kinda like the artist">2x</option>
                    <!-- There's an artist in GaryC that usually goes by "2x". -->
                    <option value="4">4x</option>
                </select>
                <br>
                <i>(only works for sketch player quality saves)</i>
            </div>
            <div class="preference">
                <label for="saveascanvas">Save sketches in sketch player quality:</label>
                <input type="checkbox" id="saveascanvas">
                <br>
                <i>(useful if you don't like how screentones look in saves)</i>
            </div>
        </fieldset>
        <fieldset id="preferences-advanced">
            <legend>Advanced</legend>
            <div class="preference">
                <label for="cachesize">Sketch cache size:</label>
                <input type="number" id="cachesize" min="0">
            </div>
            <div class="preference">
                <label for="relativetimestamps">Show sketch timestamps as relative:</label>
                <input type="checkbox" id="relativetimestamps">
            </div>
            <div class="preference">
                <label for="supportapril2023">Add color to sketches from April Fools' 2023:</label>
                <input type="checkbox" id="supportapril2023">
            </div>
        </fieldset>
    `);

    button.click(() => preferences.slideToggle(200));

    preferences.find("#theme").val(settings.theme);
    preferences.find("#cachesize").val(settings.cacheSize);
    preferences.find("#skipanimation").prop("checked", settings.noAnimation);
    preferences.find("#doreplay").prop("checked", settings.doReplay);
    preferences.find("#thumbquality").val(settings.thumbQuality);
    preferences.find("#sketchquality").val(settings.sketchQuality);
    preferences.find("#relativetimestamps").prop("checked", settings.relativeTimestamps);
    preferences.find("#showdatecards").prop("checked", settings.showDatecards);
    preferences.find("#saveascanvas").prop("checked", settings.saveAsCanvas);
    preferences.find("#sketchsaveresolution").val(settings.sketchSaveResolution);
    preferences.find("#showstats").prop("checked", settings.showStats);
    preferences.find("#supportapril2023").prop("checked", settings.supportApril2023);

    preferences.find("#cachesize").change(function(e) {
        settings.cacheSize = e.target.value;
        _saveSettings();
    });
    preferences.find("#skipanimation").change(function(e) {
        settings.noAnimation = e.target.checked;
        _saveSettings();
    });
    preferences.find("#doreplay").change(function(e) {
        settings.doReplay = e.target.checked;
        _saveSettings();
    });
    preferences.find("#theme").change(function(e) {
        settings.theme = e.target.value;
        _updateTheme();
        _saveSettings();
    });
    preferences.find("#thumbquality").change(function(e) {
        settings.thumbQuality = e.target.value;
        _saveSettings();

        let size = _getThumbSize(settings.thumbQuality);
        $("a > img").each(function(ind, img) {
            img.src = img.src.replace(
                /size=[\d.]+/,
                `size=${size}`
            );
        });
    });
    preferences.find("#sketchquality").change(function(e) {
        settings.sketchQuality = e.target.value;
        _updateSketchQuality(settings.sketchQuality);
        _saveSettings();
    });
    preferences.find("#relativetimestamps").change(function(e) {
        settings.relativeTimestamps = e.target.checked;
        _saveSettings();
    });
    preferences.find("#showdatecards").change(function(e) {
        settings.showDatecards = e.target.checked;
        _saveSettings();

        if(e.target.checked) {
            addDateCards(window.max, $("#tiles").children().length - 1);
        } else {
            $(".datecard").remove();
            datecardDates.clear();
        }
    });
    preferences.find("#saveascanvas").change(function(e) {
        settings.saveAsCanvas = e.target.checked;
        _saveSettings();
    });
    preferences.find("#sketchsaveresolution").change(function(e) {
        settings.sketchSaveResolution = parseInt(e.target.value);
        _saveSettings();
    });
    preferences.find("#showstats").change(function(e) {
        settings.showStats = e.target.checked;
        _saveSettings();

        $("#stats").toggle(settings.showStats);
    });
    preferences.find("#supportapril2023").change(function(e) {
        settings.supportApril2023 = e.target.checked;
        _saveSettings();
    });

    switch(client) {
        case NOZ_GALLERY_CLIENT: {
            applyNozPreferences(preferences);
            break;
        }
        case NOZBUNKER_GALLERY_CLIENT: {
            applyBunkerPreferences(preferences);
            break;
        }
    }

    return [button, preferences];
}

function applyNozPreferences(preferences) {
    const preferencesSketches = preferences.find("#preferences-sketches");
    const preferencesBooru = $(`
        <fieldset id="preferences-booru">
            <legend>Booru</legend>
            <div class="preference">
                <label for="samepagebooru">Post to booru without opening a new tab:</label>
                <input type="checkbox" id="samepagebooru">
            </div>
            <div class="preference">
                <label for="archiveassource">Add archive link as booru source:</label>
                <input type="checkbox" id="archiveassource">
            </div>
        </fieldset>
    `);
    preferencesSketches.after(preferencesBooru);

    preferences.find("#samepagebooru").prop("checked", settings.samePageBooru);
    preferences.find("#archiveassource").prop("checked", settings.useArchiveAsBooruSource);

    preferences.find("#samepagebooru").change(function(e) {
        settings.samePageBooru = e.target.checked;

        // Updates the booru menu
        if(window.current != null) {
            updateDetails();
        }

        _saveSettings();
    });
    preferences.find("#archiveassource").change(function(e) {
        settings.useArchiveAsBooruSource = e.target.checked;
        _saveSettings();
    });
}

function applyBunkerPreferences(preferences) {
    const toremove = [
        preferences.find("#thumbquality"),
        preferences.find("#showdatecards"),
        preferences.find("#showstats"),
    ];
    for(const pref of toremove) {
        pref.parent().remove();
    }
}

function createGalleryFooter(footerState=FooterState.NORMAL) {
    const tilesEnd = $(`<footer id="tilesEnd"></footer>`);

    switch(footerState) {
        case FooterState.END_OF_GALLERY: {
            tilesEnd.html(`
                and then there were none.
                <button>back to top</button>
            `);
            tilesEnd.find("button").on("click", () => document.documentElement.scrollIntoView());
            break;
        }

        case FooterState.NORMAL:
        default: {
            tilesEnd.html(`
                <button>load more</button>
            `);
            tilesEnd.find("button").on("click", () => addMore(100));
            break;
        }
    }

    return tilesEnd;
}

function createLoadMoreTopButton() {
    const button = $(`<button id="loadmoretop">load more</button>`);

    button.click(() => addMoreTop(100));
    return button;
}

function createBunkerStatus() {
    const status = $(`<span id="status"></span>`);
    return status;
}

async function personalKeybinds(e) {
    if(window.current == null) {
        return;
    }
    if(document.activeElement.nodeName == "INPUT") {
        return;
    }

    switch(e.key.toLowerCase()) {
        case " ": {
            // space -- skip/replay animation
            if(!(e.ctrlKey || e.altKey || e.metaKey || e.shiftKey)) {
                e.preventDefault();
                sketch.click();
            }
            break;
        }
        case "c": {
            const selection = document.getSelection();
            const selecting = selection.type == "Range";
            if(selecting) {
                break;
            }

            // ctrl+C -- copying URL to clipboard
            if(e.ctrlKey && !(e.altKey || e.metaKey || e.shiftKey)) {
                e.preventDefault();

                if(!navigator.clipboard) {
                    await detailsAlert("no clipboard permissions!");
                    return false;
                }

                await navigator.clipboard.writeText(currentURL());
                await detailsAlert("copied url");
            }

            // ctrl+shift+C -- copying canvas image to clipboard
            if(e.ctrlKey && e.shiftKey && !(e.altKey || e.metaKey)) {
                e.preventDefault();

                if(!window.ClipboardItem) {
                    await detailsAlert("no permission to copy canvas");
                    return false;
                }
                if(!navigator.clipboard) {
                    await detailsAlert("no clipboard permissions!");
                    return false;
                }

                let blob = cachedCanvasBlob || await new Promise((resolve) => {
                    document.querySelector("#sketch").toBlob(blob => resolve(blob))
                });

                const animating = [NOZ_GALLERY_CLIENT, NOZBUNKER_GALLERY_CLIENT].includes(client)
                    ? window.autodraw
                    : window.autodrawpos >= 0;
                if(!animating) {
                    cachedCanvasBlob = blob;
                }

                try {
                    await navigator.clipboard.write([new ClipboardItem({[blob.type]: blob})]);
                }
                catch (e) {
                    // .write will raise a DOMException if the document lost focus.
                    // that should be the only user-made error to expect during the copying anyway.
                    await detailsAlert("failed to copy canvas. try again?")
                    throw e;
                }

                await detailsAlert("copied canvas");
            }
            break;
        }
        case "s": {
            // ctrl+S -- downloads/saves a sketch
            if(e.ctrlKey && !(e.altKey || e.metaKey || e.shiftKey)) {
                e.preventDefault();
                $(".save").click();
            }
        }
    }
}


function _gallery_commonStyles() {
    GM_addStyle(`
        body {
            margin: 10px 10px;
        }

        input[type=text] {
            margin: 0px 4px;
        }

        input[type=submit], button {
            margin: 5px 4px;
        }

        #stats,
        #status {
            display: inline-block;
            font-family: "Helvetica", "Arial", sans-serif;
            margin: 0px 4px;
        }

        #status {
            font-style: italic;
        }

        canvas {
            /* prevent canvas from showing up for a split second on page boot */
            display: none;
            /* re-add garyc.me border on noz.rip */
            border: 1px black solid;
        }

        #tiles {
            font-family: monospace;
        }

        #details {
            box-sizing: border-box;
            padding: 10px 60px;
            width: 100%;
            height: 100%;
            overflow: auto;

            text-align: left;
            font-size: 18px;
            font-family: monospace;
        }

        #details .id {
            font-weight: bold;
        }

        #details .extra {
            opacity: 80%;
            font-style: italic;
        }

        #details .extra span[title]:hover {
            text-decoration: underline dotted;
        }

        #holder {
            display: none;
            z-index: 1;
            background-color: white;
            box-shadow: 0px 0px 10px #00000077;
            position: fixed;

            /* fixes garyc.me's centering management */
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        #holder img {
            user-select: none;
        }

        #tilesEnd {
            padding: 10px;
            text-align: center;
            font-family: monospace;
        }

        /* preferences */
        #preferences {
            max-width: 350px;
            margin: 5px; /* match that of #tiles */
            font-family: monospace;
        }
        #preferences fieldset {
            border-left: none;
            border-right: none;
            border-bottom: none;
        }
        #preferences .preference {
            padding: 4px;
        }
        #preferences .preference i {
            opacity: 50%;
        }

        /* grid styles for holder */
        #holder.active {
            display: grid;
        }
        #holder {
            width: auto;
            justify-items: center;
            padding: 0px 2px;
            grid-template-columns: 100px 808px 100px;
            grid-template-rows: 100px 577px 25px 100px;
            grid-template-areas:
                "x x x"
                "l c r"
                "l c s"
                "d d d";
        }
        #holder > .top {grid-area: x;}
        #holder > .left {grid-area: l;}
        #holder > canvas {grid-area: c;}
        #holder > .right {
            grid-area: r;
            /* prevent overflowing to .saves */
            overflow: hidden;
            height: 100%;
        }
        #holder > #details {grid-area: d;}
        #holder > .saves {
            box-sizing: border-box;
            width: 100%;
            padding-left: 5px;
            grid-area: s;
            justify-self: start;
        }

        /* datecards */
        .datecard {
            display: inline-block;
            vertical-align: middle;
            width: 160px;
            height: 120px;

            box-sizing: border-box;
            border: 2px solid #ccd;
            margin: 5px;
        }
        .datecard div {
            display: flex;
            width: 100%;
            height: 100%;
            padding: 10px;

            align-items: center;
            justify-content: center;
            box-sizing: border-box;
        }
        a img {
            /* aligns sketch thumbnails with the cards */
            vertical-align: middle;
        }

        /* just some stylistic choices */
        #tiles {
            transition: opacity 0.2s ease;
        }
        #holder a {
            cursor: pointer;
        }
        #holder img:hover {
            opacity: 80%;
        }
    `);
}

function _gallery_commonNozStyles() {
    GM_addStyle(`
        /* #holder svg styles */

        #holder svg {
            width: 100%;
            height: 100%;
            padding: 10px;
            box-sizing: border-box;
        }
        #holder .top,
        #holder .left,
        #holder .right {
            height: 100%;
            width: 100%;
        }

        /* alignment of close button */
        #holder .top {
            display: flex;
            flex-direction: column-reverse;
            align-items: flex-end;

            padding-right: 50px;
            box-sizing: border-box;
        }
        #holder .top svg {
            height: 60px;
            width: 60px;
        }

        /* stylistic choices */

        #holder .top:hover,
        #holder .left:hover,
        #holder .right:hover {
            opacity: 80%;
        }
    `);
}

function _gallery_commonOverrides() {
    document.addEventListener("keydown", personalKeybinds.bind(this));

    // On garyc.me, this uses the scrolling behavior the site used to have;
    // i.e. thumbnails will only get added at the *bottom* of the page.
    $(window).off("scroll");
    $(window).on("scroll", function(e) {
        let pageHeight = document.documentElement.scrollHeight;
        let pageScroll = window.scrollY + window.innerHeight;
        let bottom = pageHeight - pageScroll <= 1;  // == 1 is for garyc.me
        if(bottom) {
            addMore(100);
        }
    });

    $(document).off("keydown");
    $(document).on("keydown", function(e) {
        if(document.activeElement.nodeName == "INPUT") {
            return;
        }

        switch(e.key) {
            case "Escape": {
                if(e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return;
                if(window.current != null) {
                    hide();
                    // Prevent abortion of page load when the viewer is still open.
                    // The user only wants to exit the viewer in this case.
                    e.preventDefault();
                }
            }

            // ArrowLeft and ArrowRight no longer
            // update window.current.

            case "ArrowLeft": {
                if(e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return;
                if(window.current == null) return;
                if(window.current >= window.max) return;
                if(window.current < window.min) {
                    show(window.min);
                    return false;
                }
                show(window.current + 1);
                return false;
            }

            case "ArrowRight": {
                if(e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return;
                if(window.current == null || window.current > window.max) {
                    show(window.max);
                    return false;
                }
                if(window.current <= window.min) return;
                show(window.current - 1);
                return false;
            }
        }
    });

    window.addEventListener("hashchange", function(e) {
        if(!window.location.hash) {
            hide();
        }

        let id = parseInt(window.location.hash.slice(1));
        // prevent show() from firing again
        if(id == window.current) return;
        if(id == 0) {
            hide();
        } else {
            show(id);
        }
    });
}

function _gallery_commonDOMOverrides() {
    // remove text nodes that causes buttons to be spaced out.
    // the spacing will get re-added as css.
    let text_nodes = Array
        .from(document.body.childNodes)
        .filter(e => e.nodeType == Node.TEXT_NODE);
    $(text_nodes).remove();

    const [button, preferences] = createPreferencesUI();
    $("input[type=submit]:last-of-type").after(button);
    $("#tiles").before(preferences);

    const tilesEnd = createGalleryFooter();
    $("#tiles").after(tilesEnd);
}


if(window.location.pathname == "/sketch/gallery.php" && window.location.hostname == "garyc.me") {
    _gallery_commonStyles();

    window.update = gallery_update;
    window.refresh = refresh;
    setInterval(window.update, 1000/30);
    setInterval(window.refresh, 15000);

    window.reset = gallery_reset;
    window.drawData = gallery_drawData;
    window.show = show;
    window.hide = hide;
    window.get = get;
    window.addMore = addMore;

    _gallery_commonOverrides();

    // garyc.me doesn't even HAVE a <body> tag;
    // DOM manipulation can only happen after DOMContentLoaded.

    document.addEventListener("DOMContentLoaded", function() {
        window.current = null;

        _gallery_commonDOMOverrides();

        // clear the script tag and the extra newline that causes
        // misalignment of new sketches
        document.getElementById("tiles").innerHTML = "";
        // add a little init text for the stats
        document.getElementById("stats").innerHTML = "...";

        // remove inline css for the style overrides
        $("#holder").css({
            top: "",
            left: "",
            margin: "",
            position: "",
            width: "",
        });
        $("#sketch").css({
            border: "",
        });
    });

    // these are assigned on another `.ready` event;
    // overwrite them on another one
    $(document).ready(function() {
        $("#sketch").attr({
            tabindex: "0",
            // fix canvas not being 798x598
            width: "800px",
            height: "600px",
        });
        $("#sketch").css({
            // constrain actual size to 800x600 in case the canvas gets scaled up
            width: "800px",
            height: "600px",
        });

        _updateSketchQuality(settings.sketchQuality);
    });
}

if(window.location.pathname == "/sketch/gallery.php" && window.location.hostname == "noz.rip") {
    _gallery_commonStyles();
    _gallery_commonNozStyles();
    GM_addStyle(`
        /* noz.rip-specific #details styles */

        #details {
            display: flex;
            gap: 30px;

            height: min-content;
            max-height: 100%;
        }

        #details #details-left {
            flex: 0 1 auto;
            overflow: auto;
        }

        #details #details-right {
            flex: 1 0 auto;

            display: flex;
            flex-direction: column;
            align-items: flex-end;
            justify-content: flex-end;
        }

        #details form {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            text-align: right;
        }

        #details form input[type="text"] {
            min-width: min-content;
            width: 100%;
            max-width: 400px;
            height: 2em;
            padding: 0px 5px;
            box-sizing: border-box;
        }

        /* tag autocomplete styles */

        #details {
            overflow: visible;
        }

        #tagsContainer {
            width: 100%;
            max-width: 400px;

            /* Position #tagSuggestions' parent so #tagSuggestions can be
            absolutely positioned to it */
            position: relative;
        }

        #tagSuggestions {
            position: absolute;
            right: calc(100% + 10px);
            bottom: 0px;

            display: block;
            user-select: none;
            z-index: var(--z-index-dropdown);
            background-color: var(--background-tag-suggestions);
            box-shadow: 0px 0px 10px #00000077;
            margin: 0;
            padding: 10px;
            width: max-content;

            /* Ditch default border spacing */
            border-spacing: 0;
        }

        #tagSuggestions td {
            /* Alternative to border-spacing in #tagSuggestions where the <tr>
            background would actually fill in the spacing gaps */
            padding: 0 5px;
        }

        #tagSuggestions tr[aria-selected="true"] {
            background-color: var(--background-tag-suggestions-selected);
            text-decoration: underline;
        }

        #tagSuggestions tr.tagInfo {
            text-align: center;
            font-style: italic;
        }
        #tagSuggestions tr.tagInfo:not(:only-child) td {
            padding: 5px;
        }
        #tagSuggestions .tagName {
            text-align: right;
        }
        #tagSuggestions .tagCount {
            text-align: left;
            font-style: italic;
            opacity: 50%;
        }
    `);

    // noz.rip has the JS code AFTER the <body> tag.
    // Same case with the jQuery import, so DOM manipulation
    // can only be executed after DOMContentLoaded.
    // One of these days, I'm just gonna snap.

    document.addEventListener("DOMContentLoaded", function() {
        _purgeIntervals();

        // noz.rip doesn't have a stats bar but this works surprisingly fine.
        window.refresh = refresh;
        setInterval(window.refresh, 15000);

        window.reset = gallery_reset;
        window.show = show;
        window.hide = hide;
        window.get = get;
        window.addMore = addMore;

        _gallery_commonOverrides();

        window.max = null;
        window.min = null;
        window.current = null;
        // turn window.max into a Number;
        // the window.max fetched via $.ajax() is saved as a string.
        window.refresh();

        // use the new show();
        // setupOverlay override cancels the old show() from being used
        window.setupOverlay = (() => void 0);
        let hash = window.location.hash.slice(1);
        if(hash) {
            window.show(hash);
        }

        _gallery_commonDOMOverrides();

        const stats = $("#stats");
        const statsExists = stats.length >= 1;
        if(!statsExists) {
            const preferencesButton = $("button + a").prev();
            const stats = createStats();
            stats.toggle(settings.showStats);
            preferencesButton.after(stats);
        }

        // remove inline css for the style overrides
        $("#holder").css({
            position: "",
            width: "",
            height: "",
            backgroundColor: "",
            display: "",
        });
        $("#sketch").css({
            // remove white background of the canvas
            background: "",
            // remove absolute positioning of the canvas
            position: "",
            top: "",
            left: "",
            transform: "",
            // replace box-shadow with border; caused dark mode to show
            // white edges around the canvas
            boxShadow: "",
            // constrain actual size to 800x600 in case the canvas gets scaled up
            width: "800px",
            height: "600px",
        });

        $("#sketch").attr({
            tabindex: "0",
            width: "800px",
            height: "600px",
        });

        _updateSketchQuality(settings.sketchQuality);
    });
}

if(window.location.pathname == "/sketch_bunker/gallery.php" && window.location.hostname == "noz.rip") {
    _gallery_commonStyles();
    _gallery_commonNozStyles();

    // Use .customMax instead of noz.rip's .custom_max for the sake of naming consistency.
    // I advise contributors to use this one too for the same reason.
    window.customMax = null;
    const customMax = new URLSearchParams(window.location.search).get("maxid");
    const cm = parseInt(customMax);
    if(!Number.isNaN(cm)) {
        window.customMax = cm;
    }

    // Hide <tiles> for this site's addMore() monkeypatch
    const style = document.createElement("style");
    style.innerHTML = (`
        #tiles {
            display: none;
        }
    `);
    document.head.appendChild(style);

    // noz.rip/sketch_bunker/ ALSO has the body after the JS tag.
    // There will be bloodshed.

    document.addEventListener("DOMContentLoaded", function() {
        _purgeIntervals();

        window.refresh = nozBunker_refresh;
        setInterval(window.refresh, 15000);

        window.reset = gallery_reset;
        window.show = show;
        window.hide = hide;
        window.get = get;
        window.addMore = addMore;

        _gallery_commonOverrides();

        window.min = 1;
        window.max = window.customMax || window.max;
        window.archiveMax = null;
        window.current = null;

        for(const script of $("#tiles ~ script")) {
            const maxMatch = $(script).html().match(/max=(?<max>\d+)/);
            if(maxMatch) {
                window.archiveMax = parseInt(maxMatch.groups.max);
                break;
            }
        }

        // use the new show();
        // setupOverlay override cancels the old show() from being used
        window.setupOverlay = (() => void 0);
        let hash = window.location.hash.slice(1);
        if(hash) {
            window.show(hash);
        }

        // DOM manipulation

        _gallery_commonDOMOverrides();

        // addMore() can't be monkeypatched in time before it gets first fired.
        // Guess we have to do some dirty work "behind-the-scenes".
        $("#tiles").empty();
        style.remove();
        addMore();

        if(window.archiveMax && (window.archiveMax > window.max)) {
            const loadmoreTop = createLoadMoreTopButton();
            const status = createBunkerStatus();

            const preferencesButton = $("button + #holder").prev();
            preferencesButton.after(status);
            $("#refresh").after(loadmoreTop);
            $("#refresh").hide();

            status.html(`Showing sketches up to #${window.max}`);
        }

        // remove inline css for the style overrides
        $("#holder").css({
            position: "",
            width: "",
            height: "",
            backgroundColor: "",
            display: "",
        });

        $("#sketch").css({
            // remove absolute positioning of the canvas
            position: "",
            top: "",
            left: "",
            transform: "",
            // replace box-shadow with border; caused dark mode to show
            // white edges around the canvas
            boxShadow: "",
            // constrain actual size to 800x600 in case the canvas gets scaled up
            width: "800px",
            height: "600px",
        });

        $("#sketch").attr({
            tabindex: "0",
            width: "800px",
            height: "600px",
        });

        $("#refresh").prop("disabled", !!window.customMax);

        _updateSketchQuality(settings.sketchQuality);
    });
}


/* /sketch/ */

const SwapState = {
    IDLE: 0,
    SWAPPING: 1,
    PEEKING_FROM_SWAP: 2,
    PEEKING: 3,
    WAITING_PEEK: 4,
    DONE_FROM_SWAP: 5,
    DONE: 6,
}

function _setProgress(n) {
    n = Math.min(Math.max(n, 0), 3);
    let width = Math.round(n / 3 * 100);
    $("#progress").attr({"aria-valuenow": n});
    $("#progressBar").width(`${width}%`);
}

function updateUI(state) {
    let dat;
    if(window.location.hostname == "noz.rip") {
        dat = window.arrdat.join(" ");
    } else {
        dat = window.dat;
    }

    const ink = Math.floor(dat.length / window.limit * 100);

    switch(state) {
        case SwapState.IDLE: {
            $("#ink").html(`Ink used: ${ink}%`);
            $("#reset").prop("disabled", false);
            $("#undo").prop("disabled", dat.length == 0);
            $("#swap").prop("disabled", ink < 1);
            $("#peek").prop("disabled", ink >= 1);
            $("#swap").val("swap");
            _setProgress(0);
            break;
        }
        case SwapState.SWAPPING: {
            $("#ink").html(`Ink used: ${ink}%`);
            $("#reset").prop("disabled", true);
            $("#undo").prop("disabled", true);
            $("#swap").prop("disabled", true);
            $("#peek").prop("disabled", true);
            $("#swap").val("swapping...");
            _setProgress(1);
            break;
        }
        case SwapState.PEEKING_FROM_SWAP: {
            $("#swap").val("swapping...");
        }
        case SwapState.PEEKING_FROM_SWAP:
        case SwapState.PEEKING: {
            $("#ink").html(`Ink used: ${ink}%`);
            $("#reset").prop("disabled", true);
            $("#undo").prop("disabled", true);
            $("#swap").prop("disabled", true);
            $("#peek").prop("disabled", true);
            _setProgress(2);
            break;
        }
        case SwapState.WAITING_PEEK: {
            $("#ink").html(`Ink used: ${ink}%`);
            $("#reset").prop("disabled", true);
            $("#undo").prop("disabled", true);
            $("#swap").prop("disabled", true);
            $("#peek").prop("disabled", true);
            $("#swap").val("waiting for other sketch to be drawn...");
            _setProgress(2);
            break;
        }
        case SwapState.DONE_FROM_SWAP: {
            $("#swap").val("swapped!");
        }
        case SwapState.DONE_FROM_SWAP:
        case SwapState.DONE: {
            $("#ink").html(`Ink used: ${ink}%`);
            $("#reset").prop("disabled", false);
            $("#undo").prop("disabled", true);
            $("#swap").prop("disabled", true);
            $("#peek").prop("disabled", true);
            _setProgress(3);
            break;
        }
    }
}

function resetUI() {
    updateUI(SwapState.IDLE);
    window.locked = false;
}

// overrides

function resetCanvas() {
    graphics.clear();
    graphics.beginFill(0xFFFFFF);
    graphics.drawRect(0,0,800,600);
    graphics.endFill();
    graphics.lineStyle(3, 0x000000);
}

function sketch_setData(data) {
    window.dat = `${data.trim()} `;

    // using normal reset() would've left the wrong buttons enabled
    // every time as if ink really was 0%.
    resetCanvas();
    resetUI();

    const parts = data.split(" ");
    for(var i = 0; i < parts.length; i++) {
        let part = parts[i];
        for(var j = 0; j < part.length; j += 4) {
            var x = dec(part.substr(j, 2));
            var y = dec(part.substr(j+2, 2));
            if(j == 0) {
                graphics.moveTo(x, y);
            } else {
                graphics.lineTo(x, y);
            }
        }
    }
}

function noz_sketch_setData(arrdata) {
    window.arrdat = arrdata = arrdata.filter((part) => part != "");

    // using normal reset() would've left the wrong buttons enabled
    // every time as if ink really was 0%.
    resetCanvas();
    resetUI();

    for(var h = 0; h < arrdata.length; h++) {
        const arrpart = arrdata[h];
        const parts = arrpart.split(" ");
        for(var i = 0; i < parts.length; i++) {
            let part = parts[i];
            for(var j = 0; j < part.length; j += 4) {
                var x = dec(part.substr(j, 2));
                var y = dec(part.substr(j+2, 2));
                if(j == 0) {
                    graphics.moveTo(x, y);
                } else {
                    graphics.lineTo(x, y);
                }
            }
        }
    }
}

function sketch_reset() {
    window.dat = "";
    window.lines = [];
    window.autodrawpos = -1;
    resetCanvas();
    resetUI();
}

function noz_sketch_reset(manual) {
    if(manual) {
        window.backupdat = {
            arrdat: window.arrdat,
            screentoningPoints: window.screentoningPoints,
        };
        window.screentoningPoints = {};
        saveIncomplete(false);
    }

    if(window.locked) {
        window.backupdat = {};
    }

    window.dat = "";
    window.arrdat = [];
    window.autodrawpos = -1;
    resetCanvas();
    resetUI();
}

function swap() {
    // lock the client *before* the swap request, gary
    updateUI(SwapState.SWAPPING);
    window.locked = true;

    $.ajax({
        url: `swap.php?db=${db || ""}&v=32`,
        method: "POST",
        data: window.dat,
        error: function() {
            alert("There was an error swapping.");
            resetUI();
        },
        success: function(n) {
            n = parseInt(n);
            if(n < 0) {
                alert(`On cooldown; please wait ${-n} more seconds before swapping again.`);
                resetUI();
                return;
            }
            window.swapID = n;

            updateUI(SwapState.PEEKING_FROM_SWAP);
            attemptSwap();
        },
    });
}

function noz_swap() {
    updateUI(SwapState.SWAPPING);
    window.locked = true;

    let dat = window.arrdat.join(" ") + " ";

    $.ajax({
        url: `https://garyc.me/sketch/swap.php?db=${db || ""}&v=32`,
        method: "POST",
        data: dat,
        error: function() {
            alert("There was an error swapping.");
            resetUI();
        },
        success: function(n) {
            n = parseInt(n);
            if(n < 0) {
                alert(`On cooldown; please wait ${n} more seconds before swapping again.`);
                resetUI();
                return;
            }

            window.swapID = n;
            window.backupdat = {};
            window.screentoningPoints = {};
            saveIncomplete(false);
            attemptSwap();
        },
    });
}

function attemptSwap() {
    getStats();

    $.ajax({
        url: `https://garyc.me/sketch/get.php?id=${swapID}&db=${db || ""}`,
        method: "GET",
        error: function() {
            setTimeout(attemptSwap, 2000);
        },
        success: function(result) {
            if(result == "wait") {
                updateUI(SwapState.WAITING_PEEK);
                setTimeout(attemptSwap, 2000);
                return;
            }

            switch(window.location.hostname) {
                case "noz.rip":
                    drawData([result]);
                    break;
                default:
                    drawData(result);
                    break;
            }
            getStats();
            updateUI(SwapState.DONE_FROM_SWAP);
        }
    });
}

function getLatest() {
    updateUI(SwapState.PEEKING);
    window.locked = true;

    $.ajax({
        url: `https://garyc.me/sketch/get.php?db=${db || ""}`,
        method: "GET",
        error: function() {
            alert("There was an error getting the latest sketch.");
            resetUI();
        },
        success: function(result) {
            switch(window.location.hostname) {
                case "noz.rip":
                    drawData([result]);
                    break;
                default:
                    drawData(result);
                    break;
            }
            getStats();
            updateUI(SwapState.DONE);
        }
    });
}


if(window.location.pathname == "/sketch/") {
    GM_addStyle(`
        /* save button */
        img[src="save.png"] {
            /* shift 5px to the right.
               i don't feel like making this button statically positioned
               because there's whitespace text preceding it, and leaving or
               relying on that might result in inconsistent positioning from,
               say, font size changes...
               doesn't seem easy to take out either in a userscript context,
               unless i maybe go with regex, which i'm not insane enough to
               tackle right now. */
            left: 815px;
        }

        /* flash UI mimicking */
        td input {
            width: 100%;
            height: 30px;
        }
        img[src="save.png"] {
            opacity: .8;
        }
        img[src="save.png"]:hover {
            opacity: 1;
        }

        /* progress bar */
        td.swapContainer {
            display: flex;
            align-items: center;
        }
        td.swapContainer #swap {
            flex: 2;
            min-width: min-content;
        }
        td.swapContainer #progress {
            flex: 3;
            background-color: #f9f9f9;
            border: 1px solid #767676;
            border-radius: 4px;
            height: 16px;
            margin-top: 4px;
            margin-left: 10px;
        }
        #progressBar {
            height: 100%;
            background-color: #a1ef55;
            border-radius: 3px;
            transition: width 0.15s ease;
        }

        /* personal tweaks */
        td {
            padding: 3px;
        }
    `);

    // both noz.rip and garyc.me's JS happen at the document body,
    // inject when that finishes loading

    document.addEventListener("DOMContentLoaded", function() {
        setInterval(window.getStats, 30000);

        window.reset = sketch_reset;
        window.setData = sketch_setData;
        window.swap = swap;
        window.attemptSwap = attemptSwap;
        window.getLatest = getLatest;

        // Fix ink limit from 50KiB to 64KiB, the largest amount of data that
        // garyc.me can take in without truncating it.
        window.limit = 64 * 1024;

        // mark parent of swap button and add progress bar
        // don't wanna use native <progress> due to lack of its styling
        // support on firefox
        const container = $("#swap").parent();
        container.addClass("swapContainer");
        container.append(`
            <div id="progress"
                 role="progressbar"
                 aria-label="swap progress"
                 aria-valuenow="0"
                 aria-valuemin="0"
                 aria-valuemax="3">
                <div id="progressBar" style="width: 0%"></div>
            </div>
        `);

        $("img[src='save.png']").css({
            left: "",
        });

        _updateSketchQuality(settings.sketchQuality);
    });
}

if(window.location.pathname == "/sketch/" && window.location.hostname == "garyc.me") {
    document.addEventListener("DOMContentLoaded", function() {
        setInterval(window.update, 1000/30);
    });
}

if(window.location.pathname == "/sketch/" && window.location.hostname == "noz.rip") {
    document.addEventListener("DOMContentLoaded", function() {
        // not sure how i'd monkeypatch update() here;
        // it uses requestAnimationFrame instead of setInterval
        setInterval(() => saveIncomplete(true), 10000);

        window.reset = noz_sketch_reset;
        window.setData = noz_sketch_setData;
        window.swap = noz_swap;
    });
}