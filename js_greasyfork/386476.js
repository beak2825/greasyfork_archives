// ==UserScript==
// @name         War Theme
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  War theme for Jstris
// @author       Oki, Eddie
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386476/War%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/386476/War%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function(){

        //Jstris Block Skin Change
        loadSkin("https://i.imgur.com/u4SJJgE.png",32);

        //Jstris Custom Background Image
        document.head.getElementsByTagName("style")[0].innerHTML="";
        document.body.style.backgroundImage="url('https://i.imgur.com/NrFcoqT.jpg')";
        document.body.style.backgroundSize="100% 100%";
        document.getElementById("app").style.backgroundColor="rgba(0, 0, 0, 0)";
        document.getElementById("app").style.height="1000px";


        //Jstris SFX
        CustomSFXset.prototype = new BaseSFXset;
        loadSFX(new CustomSFXset);

    });
})();

function CustomSFXset(){
    this.volume=1;
    this.lock={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/scar-h.mp3",abs:1};
    this.ready={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/mw2ready.mp3",abs:1,set:1};
    this.go={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/MW2_go.mp3",abs:1,set:0};
    this.died={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/mw2died.mp3",abs:1,set:1};
    this.hold={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/scar-h_reload.mp3",abs:1,set:0};
    this.move={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/mw2select.mp3",abs:1,set:0};
    this.linefall={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/barrettcal50.mp3",abs:1,set:0};
};
