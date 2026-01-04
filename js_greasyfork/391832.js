// ==UserScript==
// @name         Cold Clear Theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Theme for Cold Clear Bot
// @author       MinusKelvin, Eddie
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391832/Cold%20Clear%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/391832/Cold%20Clear%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function(){

        //Jstris Block Skin Change
        loadSkin("https://i.imgur.com/RHK7lzy.png",83);
        loadGhostSkin("https://i.imgur.com/te8fijn.png",83);


        //Jstris SFX
        CustomSFXset.prototype = new BaseSFXset;
        loadSFX(new CustomSFXset);

    });
})();

function CustomSFXset(){
    this.volume=1;
    this.lock={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/CC_lock.ogg",abs:1};
    this.ready={url:"blank.wav",abs:1,set:1};
    this.go={url:"blank.wav",abs:1,set:0};
    this.died={url:"blank.wav",abs:1,set:1};
    this.hold={url:"blank.wav",abs:1,set:0};
    this.move={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/CC_move.ogg",abs:1,set:0};
    this.linefall={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/CC_linefall.ogg",abs:1,set:0};
    };