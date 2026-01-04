// ==UserScript==
// @name         Hexcells Custom Level Blur
// @namespace    http://bbb651.github.io
// @version      0.1
// @description  Blurs custom hexcells levels in the hexcellslevels subreddit to avoid spoilers.
// @author       bbb651
// @match        https://www.reddit.com/r/hexcellslevels/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395413/Hexcells%20Custom%20Level%20Blur.user.js
// @updateURL https://update.greasyfork.org/scripts/395413/Hexcells%20Custom%20Level%20Blur.meta.js
// ==/UserScript==

(function() {
    'use strict';

    [...document.getElementsByClassName("_34q3PgLsx9zIU5BiSOjFoM")]
    .filter(x => x.innerText.startsWith("Hexcells level"))
    .forEach(x => {x.style.filter = "blur(3px)";});

})();