// ==UserScript==
// @name         MusicBrainz Import from Music Forest
// @namespace    https://github.com/y-young
// @version      2024.5.5
// @description  Import releases from Music Forest into MusicBrainz.
// @author       y-young
// @licence      MIT; https://opensource.org/licenses/MIT
// @supportURL   https://github.com/y-young/userscripts/labels/mb-import-from-music-forest
// @match        https://www.minc.or.jp/music/list*
// @match        https://www.minc.or.jp/product/list*
// @icon         https://www.minc.or.jp/favicon.ico
// @require      https://cdn.jsdelivr.net/gh/murdos/musicbrainz-userscripts@e84565918e728252753a6e24d350b995dfae2953/lib/mbimport.js
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/434464/MusicBrainz%20Import%20from%20Music%20Forest.user.js
// @updateURL https://update.greasyfork.org/scripts/434464/MusicBrainz%20Import%20from%20Music%20Forest.meta.js
// ==/UserScript==

/*
 * Usage:
 *   Open a modal that contains release information,
 *   find "MusicBrainz Import from Music Forest" in right-click menu
 *   and click "Import into MusicBrainz".
 *
 * Things to check before submission:
 *   - Album language and script type, default to "Japanese"
 *   - Release country, default to "Japan"
 */

"use strict";

/*
 * Parse Catalog No
 * "ABCD-12345" -> [{ catno: "ABCD-12345" }]
 * "ABCD-12345/6" -> [{ catno: "ABCD-12345" }, { catno: "ABCD-12346" }]
 * "ABCD-59/60" -> [{ catno: "ABCD-59" }, { catno: "ABCD-60" }]
 */
function parseCatNo(catNoStr) {
    const parts = catNoStr.split("/");
    const first = parts[0];
    const catNos = [{ catno: first }];
    const endStr = parts[1];
    if (endStr) {
        const end = parseInt(endStr);
        const start = parseInt(first.slice(0 - endStr.length));
        for (let i = start + 1; i <= end; ++i) {
            catNos.push({
                catno: first.slice(0, 0 - i.toString().length) + i.toString(),
            });
        }
    }
    return catNos;
}

/*
 * Parse Release Date
 * "2021/1/1" -> { year: "2021", month: "1", day: "1" }
 */
function parseDate(date) {
    const data = date.split("/");
    if (data.length !== 3) {
        return {
            year: "",
            month: "",
            day: "",
        };
    }
    return {
        year: data[0],
        month: data[1],
        day: data[2],
    };
}

function parseDiscFormat(discFormat) {
    if (!discFormat) {
        return "";
    }
    const match = discFormat.innerText.match(/\b(CD|DVD)/);
    return match ? match[1] : "";
}

/*
 * Parse track duration
 * `1:33:33` -> "1:33:33"
 * `3'33"` -> "3:33"
 * `33"` -> "0:33"
 */
function parseDuration(duration) {
    let data = duration.split("'");
    let hours = "";
    let minutes = "";
    if (data.length > 2) {
        hours = data[0];
        data = data.slice(1);
    }
    if (data.length > 1) {
        minutes = data[0];
        data = data.slice(1);
    } else {
        minutes = "0";
    }
    const seconds = data[0].slice(0, -1);
    return (hours ? hours + ":" : "") + minutes + ":" + seconds;
}

function parseArtistCredit(artists) {
    return artists.split("<br>").reduce((result, artist, index, array) => {
        result.push({
            artist_name: artist,
            joinphrase: index < array.length - 1 ? " & " : "",
        });
        return result;
    }, []);
}

function parseISRC(isrc) {
    isrc = isrc.trim();
    return isrc === "-" ? "" : isrc;
}

function parseTrackList(trackList) {
    const rows = trackList.querySelectorAll("tr:not(.header)");
    const tracks = [];
    rows.forEach((row) => {
        const cols = Array.from(row.children).map((col, index) =>
            index === 5 ? col.innerHTML : col.innerText
        );
        const medly = cols[1];
        // Skip parts of a medly, e.g: JECN-358/9
        if (medly !== "0") {
            return;
        }
        const title = cols[2];
        const duration = parseDuration(cols[4]);
        const artist_credit = parseArtistCredit(cols[5]);
        const isrc = parseISRC(cols[6]);
        tracks.push({
            title,
            duration,
            artist_credit,
            isrc,
        });
    });
    return tracks;
}

function resolveReleaseArtist(catno) {
    const rows = Array.from(
        document.querySelectorAll("table#cd-list tr:not(.header)")
    );
    const row = rows.find((row) => row.children[1].innerText.trim() === catno);
    return parseArtistCredit(row.children[4].innerText);
}

function parseModalContent() {
    const modal = document.querySelector("div#cd_detail");
    if (!modal.classList.contains("in")) {
        alert("Please open a modal first.");
        return;
    }

    const title = modal.querySelector("h4.modal-title").innerText;
    const metaItems = Array.from(
        modal.querySelectorAll("div.detail_data div.col-sm-3")
    ).map((item) => item.innerText);
    const catno = metaItems[0].substr(3);
    const labels = parseCatNo(catno);
    const date = parseDate(metaItems[1].substr(4));
    const barcode = metaItems[4].substr(4);
    const artist_credit = resolveReleaseArtist(catno);

    const discFormats = modal.querySelectorAll(
        "div.disk_data div.col-sm-2:first-child"
    );
    const trackLists = modal.querySelectorAll("table.cd-detail2-track-list");
    const discs = [];
    trackLists.forEach((trackList, index) => {
        const format = parseDiscFormat(discFormats[index]);
        const tracks = parseTrackList(trackList);
        discs.push({
            format,
            tracks,
        });
    });
    const release = {
        title,
        artist_credit,
        type: "album",
        status: "official",
        language: "jpn",
        script: "Jpan",
        ...date,
        country: "JP",
        barcode,
        labels,
        discs,
        urls: [],
    };
    return release;
}

function importToMB() {
    const release = parseModalContent();
    if (!release) {
        return;
    }
    const note = `

---------------
${location.href}
Imported from Music Forest using https://github.com/y-young/userscripts#import-from-music-forest`;
    const parameters = MBImport.buildFormParameters(release, note);
    const formHtml = MBImport.buildFormHTML(parameters);
    const form = document.createElement("div");
    form.className = "clearfix";
    form.style.display = "none";
    form.innerHTML = formHtml;
    const modal = document.querySelector("div#cd_detail");
    modal.querySelector("div.modal-body").prepend(form);
    form.querySelector("button[type='submit']").click();
}

function submitISRCs() {
    const release = parseModalContent();
    if (!release) {
        return;
    }
    const params = new URLSearchParams();
    release.discs.forEach((disc, discIndex) => {
        disc.tracks.forEach((track, trackIndex) => {
            params.append(`isrc${discIndex + 1}-${trackIndex + 1}`, track.isrc);
        });
    });
    window.open("https://magicisrc.kepstin.ca/?" + params.toString());
}

GM_registerMenuCommand("Import into MusicBrainz", importToMB);
GM_registerMenuCommand("Submit ISRCs", submitISRCs);
