// ==UserScript==
// @name         MusicBrainz Import from THBWiki
// @namespace    https://github.com/y-young
// @version      2021.10.25
// @description  Import releases from THBWiki into MusicBrainz.
// @author       y-young
// @licence      MIT; https://opensource.org/licenses/MIT
// @supportURL   https://github.com/y-young/userscripts/labels/mb-import-from-thbwiki
// @match        https://thwiki.cc/*
// @icon         https://thwiki.cc/favicon.ico
// @require      https://cdn.jsdelivr.net/gh/murdos/musicbrainz-userscripts@e84565918e728252753a6e24d350b995dfae2953/lib/mbimport.js
// @downloadURL https://update.greasyfork.org/scripts/434465/MusicBrainz%20Import%20from%20THBWiki.user.js
// @updateURL https://update.greasyfork.org/scripts/434465/MusicBrainz%20Import%20from%20THBWiki.meta.js
// ==/UserScript==

/*
 * Usage:
 *   Open a THBWiki album page and click "Import into MB" button on the right side of the title.
 *
 * Things to check before submission:
 *   - Album language and script type, default to "Japanese"
 *   - Release country, default to "Japan"
 *   - Link type of the URL, default to "discography page" but could be "standalone site"
 *   - Mark the link as "ended" if it's broken
 *   - Artist credit of the tracks, you might want to separate doujin groups in a colaborative album
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
 * "2021-1-1" -> { year: "2021", month: "1", day: "1" }
 */
function parseDate(date) {
    const data = date.split("-");
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

function parseArtistCredit(artists) {
    return artists.split("\n").reduce((result, artist, index, array) => {
        result.push({
            artist_name: artist,
            joinphrase: index < array.length - 1 ? " & " : "",
        });
        return result;
    }, []);
}

function parseType(type) {
    switch (type) {
        case "EP":
            return "EP";
        case "单曲":
            return "single";
        default:
            return "album";
    }
}

function parseSecondaryTypes(types) {
    const secondaryTypes = [];
    if (types.includes("精选集")) {
        secondaryTypes.push("Compilation");
    }
    return secondaryTypes;
}

function parseTrackList(table) {
    const rows = table.querySelectorAll("tr");
    const tracks = [];
    rows.forEach((row) => {
        //if (!row.querySelector("td.infoRD") && !row.querySelector("td.infoYD") && !row.querySelector("td.infoYL") && !row.querySelector("td.infoP") && !row.querySelector("td.infoO")) {
        if (!row.querySelector("td.title")) {
            return;
        }
        const title = row.querySelector("td.title").innerText;
        const duration = row.querySelector("td.time").innerText;
        tracks.push({
            title,
            duration,
        });
    });
    return tracks;
}

function parseDiscs() {
    const tables = document.querySelectorAll("table.musicTable");
    const discs = [];
    tables.forEach((table) => {
        discs.push({
            format: "CD",
            tracks: parseTrackList(table),
        });
    });
    return discs;
}

function parseAlbum() {
    const release = {
        type: "album",
        status: "official",
        language: "jpn",
        script: "Jpan",
        country: "JP",
        urls: [],
        labels: [],
    };
    const metaItems = Array.from(
        document.querySelectorAll("table.doujininfo tr")
    );
    metaItems.forEach((item) => {
        let label = item.querySelector("td.label");
        let text = item.querySelectorAll("td")[1];
        if (!label || !text) {
            return;
        }
        label = label.innerText.trim();
        text = text.innerText.trim();

        switch (label) {
            case "名称":
            case "Title":
            case "タイトル":
                release.title = text;
                break;
            case "制作方":
            case "Producer":
            case "メーカー":
                release.artist_credit = parseArtistCredit(text);
                break;
            case "首发日期":
            case "Release":
            case "発売日": {
                const date = parseDate(text.match(/\d{4}-\d{2}-\d{2}/)[0]);
                release.year = date.year;
                release.month = date.month;
                release.day = date.day;
                break;
            }
            case "类型":
            case "Type":
            case "種別":
                release.type = parseType(text);
                release.secondary_types = parseSecondaryTypes(text);
                break;
            case "编号":
            case "Catalog ID":
            case "型番":
                release.labels.push({ catno: text });
                break;
            case "官网页面":
            case "Website":
            case "公式サイト":
                text.split("\n").forEach((url) => {
                    if (url === "（已经失效）") {
                        return;
                    }
                    release.urls.push({
                        url,
                        link_type: "288",
                    });
                });
                break;
        }
    });
    release.discs = parseDiscs();

    const note = `

---------------
${location.href}
Imported from THBWiki using https://github.com/y-young/userscripts#import-from-thbwiki`;
    const parameters = MBImport.buildFormParameters(release, note);
    const formHtml = MBImport.buildFormHTML(parameters);
    const form = document.createElement("div");
    form.innerHTML = formHtml;
    document.getElementById("mw-indicator-0").append(form);
}

if (document.querySelector("div.page-content-header.album-type.doujin-album")) {
    parseAlbum();
}
