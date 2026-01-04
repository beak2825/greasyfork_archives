// ==UserScript==
// @name         NES Theme
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  NES theme for Jstris
// @author       HOWLING
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386480/NES%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/386480/NES%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function(){

        //Jstris Block Skin Change
        loadSkin("https://i.imgur.com/TV52fTd.png",32);

        //Jstris SFX
        CustomSFXset.prototype = new BaseSFXset;
        loadSFX(new CustomSFXset);

    });
})();

function CustomSFXset(){
    this.volume=1;
    this.lock={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/NES_lock.wav",abs:1};
    this.ready={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/NES_ready.wav",abs:1,set:1};
    this.go={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/NES_go.wav",abs:1,set:0};
    this.died={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/NES_died.wav",abs:1,set:1};
    this.hold={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/NES_hold.wav",abs:1,set:0};
    this.move={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/NES_move.wav",abs:1,set:0};
    this.linefall={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/NES_linefall.mp3",abs:1,set:0};
    this.comboTones={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/NES_combo.mp3",abs:1,set:2,duration:1000,spacing:500,cnt:13};
};
