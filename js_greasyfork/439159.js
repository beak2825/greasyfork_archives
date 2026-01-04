// ==UserScript==
// @name         FuckJVC
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  Retrouvez toutes les pubs. Faites le plein de pubs et de pubs. Découvrez aussi tous nos pubs et pubs, nos pubs et toutes nos pubs.
// @author       Mraiih
// @match        *://www.jeuxvideo.com/*
// @icon         https://www.jeuxvideo.com/favicon.png
// @grant        none
// @license      Beerware
// @downloadURL https://update.greasyfork.org/scripts/439159/FuckJVC.user.js
// @updateURL https://update.greasyfork.org/scripts/439159/FuckJVC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Retirer les pubs en header
    var ad_header = document.getElementsByClassName("layout__row layout__adHeader");
    var ary = Array.from(ad_header);
    ary.forEach(function(e) { e.hidden = true; });

    // Retirer la section bon plan
    var sections = document.getElementsByTagName("section");
    ary = Array.from(sections);
    ary.filter(i => i.firstElementChild.innerText == "BON PLANS HIGH TECH")
        .forEach(function(e) { e.hidden = true; });
})();