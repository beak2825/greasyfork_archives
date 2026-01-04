// ==UserScript==
// @name         Spotify Muter
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Automatically mute spotify when an ad comes on
// @author       JPBBerry
// @match        https://open.spotify.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405755/Spotify%20Muter.user.js
// @updateURL https://update.greasyfork.org/scripts/405755/Spotify%20Muter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var spotifyUtils = {
        get adPlaying() {
            return document.title.startsWith("Advertisement") || (document.title.startsWith("Spotify") && document.title.endsWith("Spotify"))
        },
        get muteElm () {
            return document.querySelector(".volume-bar__icon")
        },
        get muted () {
            return this.muteElm.getAttribute("aria-label") === "Unmute"
        },
        mute () {
            if (!this.muted) this.muteElm.click()
        },
        unmute () {
            if (this.muted) this.muteElm.click()
        }
    }

    new MutationObserver(function () {
        if (spotifyUtils.adPlaying) spotifyUtils.mute()
        else spotifyUtils.unmute()
    }).observe(document.querySelector("title"), { childList: true })

    window.spotifyUtils = spotifyUtils
})();