// ==UserScript==
// @name         Kibi Voice
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391295/Kibi%20Voice.user.js
// @updateURL https://update.greasyfork.org/scripts/391295/Kibi%20Voice.meta.js
// ==/UserScript==


(function() {
    'use strict';
    window.addEventListener('load', function(){
        //Jstris SFX
        CustomSFXset.prototype = new BaseSFXset;
        loadSFX(new CustomSFXset);

    });
})();


function CustomSFXset(){
    this.volume=1;
    this.lock={url:"https://cdn.discordapp.com/attachments/572300822621323264/634223387102937129/move1.mp3",abs:1};
    this.ready={url:"https://cdn.discordapp.com/attachments/572300822621323264/634223390944788480/ready.mp3",abs:1,set:0};
    this.go={url:"https://cdn.discordapp.com/attachments/572300822621323264/634223379213451264/go.mp3",abs:1,set:0};
    this.died={url:"https://cdn.discordapp.com/attachments/572300822621323264/634223395092955146/topout.mp3",abs:1,set:1};
    this.hold={url:"https://cdn.discordapp.com/attachments/572300822621323264/634223383285858304/hold.mp3",abs:1,set:0};
    this.move={url:"https://cdn.discordapp.com/attachments/572300822621323264/634223375195308032/drop.mp3",abs:1,set:0};
    this.linefall={url:"https://cdn.discordapp.com/attachments/572300822621323264/634223375195308032/drop.mp3",abs:1,set:0};
    this.comboTones={url:"https://cdn.discordapp.com/attachments/572300822621323264/634228659288277003/voicecombo1.mp3",abs:1,set:2,duration:1000,spacing:100,cnt:7};
}