// ==UserScript==
// @name         AMQ AniList Status Viewer
// @namespace    RacoonSeki
// @version      1.1
// @description  Show anime status from AniList on AMQ using only the username
// @author       RacoonSeki
// @match        https://*.animemusicquiz.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535532/AMQ%20AniList%20Status%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/535532/AMQ%20AniList%20Status%20Viewer.meta.js
// ==/UserScript==

"use strict";

if (typeof Listener === "undefined") return;

const anilistGraphQL = "https://graphql.anilist.co";
const anilistUsername = "AniList username"; // Replace with your AniList username
let anilistUserId = null; // Store AniList User ID after fetching

function setup() {
    fetchUserId();
    injectCSS();

    new Listener("answer results", async (payload) => {
        $("#qpSongInfoLinkRow .anilist-status").remove();
        const animeId = payload.songInfo.siteIds?.aniListId;
        const statusContainer = $('<div class="anilist-status">Loading...</div>');
        $("#qpSongInfoLinkRow").append(statusContainer);

        if (!animeId) {
            statusContainer.text("No AniList ID");
            statusContainer.css("color", "gray");
            return;
        }

        await waitForUserId();
        fetchAnimeStatus(animeId, statusContainer);
    }).bindListener();
}

function fetchUserId() {
    fetch(anilistGraphQL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query: `
                query ($username: String) {
                    User(name: $username) {
                        id
                    }
                }
            `,
            variables: { username: anilistUsername }
        })
    })
    .then(response => response.json())
    .then(data => {
        anilistUserId = data.data?.User?.id || null;
        if (!anilistUserId) console.error("AniList: Failed to fetch User ID");
    })
    .catch(error => console.error("AniList API error (User ID):", error));
}

function waitForUserId() {
    return new Promise(resolve => {
        const interval = setInterval(() => {
            if (anilistUserId !== null) {
                clearInterval(interval);
                resolve();
            }
        }, 100);
    });
}

function fetchAnimeStatus(animeId, statusContainer) {
    fetch(anilistGraphQL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query: `
                query ($userId: Int, $animeId: Int) {
                    MediaList(userId: $userId, mediaId: $animeId) {
                        status
                    }
                }
            `,
            variables: {
                userId: anilistUserId,
                animeId: animeId
            }
        })
    })
    .then(response => response.json())
    .then(data => {
        let status = data.data?.MediaList?.status || "Not in List";
        statusContainer.html(`<b>${status}</b>`);
        statusContainer.addClass(status === "Not in List" ? "not-in-list" : "in-list");
    })
    .catch(error => {
        console.error("AniList API error:", error);
        statusContainer.text("AniList Status: Error fetching status");
        statusContainer.addClass("not-in-list");
    });
}

function injectCSS() {
    const style = document.createElement("style");
    style.textContent = `
        .anilist-status {
            margin-top: 3px;
            font-size: 12px;
            font-weight: bold;
        }
        .anilist-status.in-list {
            color: green;
        }
        .anilist-status.not-in-list {
            color: gray;
        }
    `;
    document.head.appendChild(style);
}

setup();
