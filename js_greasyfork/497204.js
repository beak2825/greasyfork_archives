// ==UserScript==
// @name         Exit YouTube Playlist
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Watch YouTube videos as standalone videos rather than as part of a playlist.
// @author       Bartosz Tobiasz
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @license      MIT License; https://mit-license.org/
// @downloadURL https://update.greasyfork.org/scripts/497204/Exit%20YouTube%20Playlist.user.js
// @updateURL https://update.greasyfork.org/scripts/497204/Exit%20YouTube%20Playlist.meta.js
// ==/UserScript==

function removeListParameterIfPresentAndRedirect() {
    const params = new URLSearchParams(window.location.search);
    if (params.has("v") && params.has("list")) {
        console.log("The page's URL contains the 'list' parameter.");
        params.delete("list");
        window.location.search = params;
    }
}

removeListParameterIfPresentAndRedirect();

navigation.addEventListener('navigate', () => setTimeout(removeListParameterIfPresentAndRedirect, 1000));