// ==UserScript==
// @name         Display Bandcamp Hidden Tracks
// @version      1.0
// @description  Displays the number of hidden tracks on a Bandcamp album
// @author       doujin n
// @namespace    Violentmonkey Scripts
// @match        https://*.bandcamp.com/album/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536305/Display%20Bandcamp%20Hidden%20Tracks.user.js
// @updateURL https://update.greasyfork.org/scripts/536305/Display%20Bandcamp%20Hidden%20Tracks.meta.js
// ==/UserScript==

(function() {
    const meta = document.querySelector("meta[property='og:type']");
    if (!meta || meta.content !== "album") return;

    const num_tracks = parseInt(document.querySelector("meta[property='og:description']").content.match(/(\d+) track album/)[1]);
    const visible_tracks = Array.from(document.querySelectorAll(".track_number")).map(track => parseInt(track.textContent.slice(0, -1)));
    const num_hidden_tracks = num_tracks - Math.max(0, ...visible_tracks);

    if (num_hidden_tracks > 0) {
        const hidden_text = document.createElement("span");
        hidden_text.textContent = `Hidden tracks: ${num_hidden_tracks}`;
        document.querySelector("#name-section").appendChild(hidden_text);
    }
})();