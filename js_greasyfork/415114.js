// ==UserScript==
// @name         ringtone for discord
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  discord PC only :/
// @author       You
// @match https://discord.com/*
// @match https://discordapp.com/*
// @match https://discord.gg/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415114/ringtone%20for%20discord.user.js
// @updateURL https://update.greasyfork.org/scripts/415114/ringtone%20for%20discord.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();Audio.prototype._play = Audio.prototype.play;
Audio.prototype.play = function() {
    this.src = this.src.replace(/84a1b4e11d634dbfa1e5dd97a96de3ad/g, 'b9411af07f154a6fef543e7e442e4da9');
    return this._play();
};// @include  https://discord.com/channels/@me/655765593814859787
