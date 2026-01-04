// ==UserScript==
// @name         TMDB Watch Now Button
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds a "Watch Now" button with Vidfast and Vidlink links on TMDB movie and TV pages, leading directly to the streaming site's video player.
// @author       RestrictedWord
// @icon         https://cdn.discordapp.com/attachments/1117089952161857537/1405605821722656918/TMDB_Watch_Now_Button_Favicon.png?ex=689f6fee&is=689e1e6e&hm=ec9285f8166c9da5437c3403e9d45ed3f6bd2de68e7d81629bf124114545308f&
// @match        https://www.themoviedb.org/movie/*
// @match        https://www.themoviedb.org/tv/*
// @license      GPL3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545760/TMDB%20Watch%20Now%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/545760/TMDB%20Watch%20Now%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DEBUG = false;
    const log = (...args) => { if (DEBUG) console.log("[TMDB Watch Now]", ...args); };

    const injectStyles = () => {
        const css = `
            .tmdb-watch-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 99999;
                display: flex;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                font-family: sans-serif;
            }
            .tmdb-watch-label {
                background: #ff4444;
                color: white;
                font-weight: bold;
                padding: 10px 14px;
                font-size: 14px;
                display: flex;
                align-items: center;
            }
            .tmdb-watch-btn {
                padding: 10px 12px;
                font-size: 12px;
                font-weight: bold;
                color: white;
                text-decoration: none;
                display: flex;
                align-items: center;
                transition: background 0.25s;
            }
            .tmdb-fast { background: #4444ff; }
            .tmdb-fast:hover { background: #2222cc; }
            .tmdb-pro { background: #22aa22; }
            .tmdb-pro:hover { background: #1a881a; }
        `;
        document.head.appendChild(Object.assign(document.createElement("style"), { textContent: css }));
    };

    const createButton = ({ vidfastUrl, vidlinkUrl }) => {
        const container = document.createElement("div");
        container.className = "tmdb-watch-container";

        const label = Object.assign(document.createElement("div"), {
            className: "tmdb-watch-label",
            textContent: "▶ Watch Now!"
        });

        const fastBtn = Object.assign(document.createElement("a"), {
            className: "tmdb-watch-btn tmdb-fast",
            textContent: "Source 1",
            href: vidfastUrl,
            target: "_blank",
            rel: "noopener noreferrer"
        });

        const proBtn = Object.assign(document.createElement("a"), {
            className: "tmdb-watch-btn tmdb-pro",
            textContent: "Source 2",
            href: vidlinkUrl,
            target: "_blank",
            rel: "noopener noreferrer"
        });

        container.append(label, fastBtn, proBtn);
        document.body.appendChild(container);
        log("Button added:", { vidfastUrl, vidlinkUrl });
    };

    const getWatchUrls = () => {
        const parts = window.location.pathname.split("/").filter(Boolean);
        log("Path parts:", parts);

        let type, id, season = 1, episode = 1;

        if (parts[0] === "movie") {
            type = "movie";
            id = parts[1]?.split("-")[0];
        } else if (parts[0] === "tv") {
            type = "tv";
            id = parts[1]?.split("-")[0];
            if (parts[2] === "season" && parts[4] === "episode") {
                season = parts[3];
                episode = parts[5];
            }
        }

        if (!id) return null;

        const baseFast = "https://vidfast.pro";
        const basePro = "https://vidlink.pro";

        return (type === "movie")
            ? { vidfastUrl: `${baseFast}/movie/${id}`, vidlinkUrl: `${basePro}/movie/${id}` }
            : { vidfastUrl: `${baseFast}/tv/${id}/${season}/${episode}`, vidlinkUrl: `${basePro}/tv/${id}/${season}/${episode}` };
    };

    injectStyles();
    const urls = getWatchUrls();
    if (urls) createButton(urls);

})();