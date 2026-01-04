// ==UserScript==
// @name         Auto Image Unfolder for UnionPeer
// @namespace    https://greasyfork.org/en/users/68133-nevertheless
// @version      1.06
// @description  Automatically reveals hidden images so that you don't have to click "+" sign on each image to see it
// @author       Nevertheless
// @match        *://*.unionpeer.com/*
// @match        *://*.unionpeer.net/*
// @match        *://*.uniondht.org/*
// @match        *://*.erzsebet.org/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/38332/Auto%20Image%20Unfolder%20for%20UnionPeer.user.js
// @updateURL https://update.greasyfork.org/scripts/38332/Auto%20Image%20Unfolder%20for%20UnionPeer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const allClickable = document.querySelectorAll('.folded.clickable:not(.unfolded)');
    const clickableCount = document.querySelectorAll('.folded.clickable:not(.unfolded)').length;

    for (let i = 0; i < clickableCount; i+=1) {
        setInterval(function() {
        }, 1000);
        allClickable[i].click();
    }

    var torrentTitle = document.getElementsByTagName("var")[0].firstElementChild.alt;
    $('.catTitle').html(torrentTitle);

})();