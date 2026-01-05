// ==UserScript==
// @name         Get rid of the nigger synergy userbar
// @namespace    Github
// @version      0.1
// @description  Changes the new userbars back to the old ones
// @author       Zexo
// @match        *://*.hackforums.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25469/Get%20rid%20of%20the%20nigger%20synergy%20userbar.user.js
// @updateURL https://update.greasyfork.org/scripts/25469/Get%20rid%20of%20the%20nigger%20synergy%20userbar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var interval = 0.25; // in seconds

// DON'T EDIT BELOW ///////////////////

function imgReplace() {
    var images = document.getElementsByTagName('img'),
        len = images.length, img, i;
    for (i = 0; i < len; i += 1) {
        img = images[i];
        img.src = img.src.replace('https://hackforums.net/images/modern_bl/groupimages/english/synergy.png', 'http://i1298.photobucket.com/albums/ag48/LegacySignatures/SGCUserbar_zps7d751f2e.png');
    }
}

setInterval(imgReplace, interval * 1000);
})();