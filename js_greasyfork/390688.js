// ==UserScript==
// @name         SomaFM
// @namespace    https://lyler.xyz
// @version      0.1
// @description  Clean up SomaFM UI
// @author       Lyle Hanson
// @match       https://somafm.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390688/SomaFM.user.js
// @updateURL https://update.greasyfork.org/scripts/390688/SomaFM.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById('motd').style = 'display: none;';
    var noise = document.querySelectorAll(
        '.BegathonMessage',
    )
    // Remove noise elements
    for (var i = 0; i < noise.length; i++) {
        noise[i].style.display = "none";
    }
})();