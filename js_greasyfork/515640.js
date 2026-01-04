// ==UserScript==
// @name         Musicbrainz Artist SAMBL Button
// @description  Adds a SAMBL Button to compatible artists
// @version      2025-9-12
// @author       Lioncat6
// @license      MIT
// @namespace    https://github.com/Lioncat6/MusicBrainz-UserScripts/
// @homepageURL  https://github.com/Lioncat6/MusicBrainz-UserScripts/
// @supportURL   https://github.com/Lioncat6/MusicBrainz-UserScripts/issues
// @match        https://musicbrainz.org/artist/*
// @match        https://beta.musicbrainz.org/artist/*
// @icon         https://sambl.lioncat6.com/assets/images/favicon.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515640/Musicbrainz%20Artist%20SAMBL%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/515640/Musicbrainz%20Artist%20SAMBL%20Button.meta.js
// ==/UserScript==

(function() {
    "use strict";
    let artistName = document.getElementsByClassName("artistheader")[0].getElementsByTagName("h1")[0];
    let mbid = document.location.pathname.split("/artist/")[1].split("/")[0];
    let spIcons = document.getElementsByClassName("spotify-favicon");
    if (spIcons) {
        let spids = "";
        let spId = "";
        for (let icon of spIcons) {
            let spUrl = icon.getElementsByTagName("a")[0];
            if (spUrl) {
                spUrl = spUrl.href;
            } else {
                spUrl = "";
            }
            if (spUrl.match(/\/artist\/([^/?]+)/)) {
                spId = spUrl.match(/\/artist\/([^/?]+)/)[1];
                if (spids == "") {
                    spids = spId;
                } else {
                    spids = spids + "," + spId;
                }
            }
        }
        let url = `https://sambl.lioncat6.com/artist/?spid=${spids}&artist_mbid=${mbid}`;
        
        if (spIcons.length > 1) {
            url = `https://sambl.lioncat6.com/artist/?spids=${spids}&artist_mbid=${mbid}`;
        }
        if (spId = "" || !spId) {
            url = `https://sambl.lioncat6.com/search/?query=${artistName.innerText}`;
        }
        let htmlToInsert = `<a href="${url}" target="_blank"><img src="https://sambl.lioncat6.com/assets/images/favicon.svg" alt="SAMBL Icon" style="width: 18px; transform: scale(1.8) translate(6px, 2.5px);"></a>`;
        artistName.innerHTML = artistName.innerHTML + htmlToInsert;
    }
})();
