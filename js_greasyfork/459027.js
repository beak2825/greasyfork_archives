// ==UserScript==
// @name         Color bolds
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Makes bolds gold on RYM
// @author       jermrellum
// @match        https://rateyourmusic.com/artist/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rateyourmusic.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459027/Color%20bolds.user.js
// @updateURL https://update.greasyfork.org/scripts/459027/Color%20bolds.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var recs = document.getElementsByClassName("disco_mainline_recommended");

    for(var i=0; i<recs.length; i++)
    {
        recs[i].children[0].style.color = "gold";
    }
})();