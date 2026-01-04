// ==UserScript==
// @name         Discord Remixed Ringtone
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enables the Discord remixed ringtone.
// @author       Professional Amateur
// @match        https://discord.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/424252/Discord%20Remixed%20Ringtone.user.js
// @updateURL https://update.greasyfork.org/scripts/424252/Discord%20Remixed%20Ringtone.meta.js
// ==/UserScript==

/// I hope it works out

Audio.prototype._play = Audio.prototype.play;
Audio.prototype.play = function() {
    this.src = this.src.replace(/84a1b4e11d634dbfa1e5dd97a96de3ad/g, 'b9411af07f154a6fef543e7e442e4da9');
    return this._play();
};