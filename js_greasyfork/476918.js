// ==UserScript==
// @name              MusicBrainz Batch Query AcoustID
// @namespace         https://github.com/y-young/userscripts
// @version           2023.10.8
// @description       Batch query AcoustID of recordings on release and collection page.
// @author            y-young
// @license           MIT; https://opensource.org/licenses/MIT
// @supportURL        https://github.com/y-young/userscripts/labels/mb-batch-query-acoustid
// @include           https://musicbrainz.org/collection/*
// @include           https://musicbrainz.org/release/*
// @icon              https://musicbrainz.org/static/images/favicons/apple-touch-icon-72x72.png
// @run-at            document-idle
// @grant             GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/476918/MusicBrainz%20Batch%20Query%20AcoustID.user.js
// @updateURL https://update.greasyfork.org/scripts/476918/MusicBrainz%20Batch%20Query%20AcoustID.meta.js
// ==/UserScript==

"use strict";

const ACOUSTID_STYLES = `
    margin-left: 5px;
    width: 18px;
    text-align: center;
    aspect-ratio: 1;
    background: #d83434;
    color: white;
    display: inline-block;
`;

const NOTICE_STYLES = `
    display: inline;
    font-size: 0.7em;
    margin-left: 10px;
    color: #969696;
    font-weight: normal;
`;
const LOADING_NOTICE = `<span class="loading-message">Loading AcoustIDs</span>`;

function getGidFromUrl(url) {
    const path = new URL(url).pathname.split("/");
    return path[2];
}

function queryTable(table) {
    const rows = Array.from(table.querySelectorAll("tr.odd, tr.even"));
    const params = new URLSearchParams({ format: "json", batch: 1 });
    const recordings = Object.fromEntries(
        rows
            .map((row) => row.querySelector("td a[href^='/recording']"))
            .filter((link) => link)
            .map((link) => [getGidFromUrl(link.href), link])
    );

    const mbids = Object.keys(recordings);
    if (!mbids.length) {
        alert("No recording found.");
        return;
    }
    mbids.forEach((mbid) => params.append("mbid", mbid));
    const CONTAINER_CLASS = "query-acoustid-track";

    setLoadingStatus(LOADING_NOTICE);
    let acoustIdsCount = 0;
    fetch("https://api.acoustid.org/v2/track/list_by_mbid", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
    })
        .then((response) => response.json())
        .then((response) => {
            response.mbids.forEach(({ mbid, tracks }) => {
                acoustIdsCount += tracks.length;
                const html = tracks
                    .map(
                        (track, index) =>
                            `<a href="https://acoustid.org/track/${
                                track.id
                            }" style="${ACOUSTID_STYLES}" target="_blank">${
                                index + 1
                            }</a>`
                    )
                    .join("");
                const cell = recordings[mbid].parentElement;
                const existingContainer = cell.querySelector(
                    `span.${CONTAINER_CLASS}`
                );
                if (existingContainer) {
                    cell.removeChild(existingContainer);
                }
                recordings[mbid].insertAdjacentHTML(
                    "afterend",
                    `<span class="${CONTAINER_CLASS}">${html}</div>`
                );
            });
            setLoadingStatus(
                `Loaded ${acoustIdsCount} AcoustID${
                    acoustIdsCount > 1 ? "s" : ""
                }`
            );
        })
        .catch((error) => {
            alert("Failed to query AcoustID: " + error);
            console.error(error);
            setLoadingStatus("");
        });
}

function queryAllTables() {
    const tables = document.querySelectorAll("table.tbl");
    if (!tables) {
        alert("No tracklist found.");
        return;
    }
    tables.forEach((table) => {
        queryTable(table);
    });
}

function setLoadingStatus(html) {
    const header =
        document.querySelector("div.releaseheader") ||
        document.querySelector("div.collectionheader");
    const title = header.querySelector("h1");
    const CONTAINER_ID = "query-acoustid-notice";
    const existingContainer = title.querySelector(`div#${CONTAINER_ID}`);
    if (existingContainer) {
        title.removeChild(existingContainer);
    }
    const container = `<div id="${CONTAINER_ID}" style="${NOTICE_STYLES}">${html}</div>`;
    title.insertAdjacentHTML("beforeend", container);
}

GM_registerMenuCommand("Query AcoustID", queryAllTables);
