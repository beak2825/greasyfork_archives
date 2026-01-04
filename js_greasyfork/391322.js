// ==UserScript==
// @name         Jstris Custom SFX
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391322/Jstris%20Custom%20SFX.user.js
// @updateURL https://update.greasyfork.org/scripts/391322/Jstris%20Custom%20SFX.meta.js
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
    this.lock={url:"blank.wav",abs:1};
    this.ready={url:"blank.wav",abs:0,set:1};
    this.go={url:"blank.wav",abs:1,set:0};
    this.died={url:"blank.wav",abs:1,set:1};
    this.hold={url:"blank.wav",abs:1,set:0};
    this.move={url:"blank.wav",abs:1,set:0};
    this.linefall={url:"blank.wav",abs:1,set:0};
};