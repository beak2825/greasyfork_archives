// ==UserScript==
// @name         🎃Discord Halloween Ringtone
// @namespace    xd
// @version      1.0.0
// @description  Enables the Discord Halloween ringtone.
// @author       levisurely
// @license      Apache-2.0
// @match        https://discord.com/*
// @match        https://ptb.discord.com/*
// @match        https://canary.discord.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/450476/%F0%9F%8E%83Discord%20Halloween%20Ringtone.user.js
// @updateURL https://update.greasyfork.org/scripts/450476/%F0%9F%8E%83Discord%20Halloween%20Ringtone.meta.js
// ==/UserScript==
//lev#9999 On Discord
//discord.gg/tmYQr99wTa

Audio.prototype._play = Audio.prototype.play;
Audio.prototype.play = function() {
    this.src = this.src.replace(/84a1b4e11d634dbfa1e5dd97a96de3ad/g, 'bceeb2ba92c01584dcaafc957f769bae');
    return this._play();
};