// ==UserScript==
// @name         Surviv.io CustomCSS & BugFix
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  A script meant for streamers, adding a nice little "Streamer Mode" effect to the game.
// @author       DamienVesper
// @match        *://surviv.io/*
// @match        *://surviv2.io/*
// @match        *://2dbattleroyale.com/*
// @match        *://2dbattleroyale.org/*
// @match        *://piearesquared.info/*
// @match        *://thecircleisclosing.com/*
// @match        *://parmainitiative.com/*
// @match        *://ot38.club/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387543/Survivio%20CustomCSS%20%20BugFix.user.js
// @updateURL https://update.greasyfork.org/scripts/387543/Survivio%20CustomCSS%20%20BugFix.meta.js
// ==/UserScript==

(function() {
    /*
    LEGAL
     - All code licensed under the Apache 2.0 License. Code copyright 2019 by DamienVesper. All rights reserved.
     - All code reproductions must include the below insigna.
     - Any reproductions of this and other related works that are found to be in violence of this code will be reported and removed.
                         ____                                            _
     |\   \      /      |    |                                          |_|
     | \   \    /       |____|  __   __   __   __   __    __ __   __ __      __   __
     | /    \  /        |      |  | |  | |  | |  | |  |  |  |  | |  |  | |  |  | |  |
     |/      \/         |      |    |__| |__| |    |__|_ |  |  | |  |  | |  |  | |__|
                                            |                                       |
                                          __|                                     __|
    */

    'use strict';

    setInterval(function() {
        //Squad BugFix
        if(document.querySelector(`#btn-start-team`)) document.querySelector(`#btn-start-team`).style.display = `block`;

        //Surviv-Related Ads AdBlock
        let a = document.querySelectorAll(`#ad-block-left *`);
        for(let i = 0; i < a.length; i++) a[i].remove();
        let b = document.querySelectorAll(`#news-block *`);
        for(let i = 0; i < b.length; i++) b[i].remove();

        //Streamer Mode / Blur Effect
        document.querySelector(`#ad-block-left`).style.height = `325px`;
        document.querySelector(`#ad-block-left`).style.overflowY = `hidden`;

        let blurElements = document.querySelectorAll(`.account-player-name, .featured-streamer > a, #featured-youtuber a`)
        for(let i = 0; i < blurElements.length; i++) blurElements[i].style.filter = `blur(5px)`;

        let removeShadowElements = document.querySelectorAll(`#news-block, #social-share-block, #start-menu, #team-menu`);
        for(let i = 0; i < removeShadowElements.length; i++) removeShadowElements[i].style.boxShadow = ``;

        document.querySelector(`#background`).style.filter = `blur(2.5px)`;
    });
})();