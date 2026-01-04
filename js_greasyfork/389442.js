// ==UserScript==
// @name         Rail-Sim.de Avatar replacer
// @namespace    http://cirno-chan.de
// @version      0.22
// @description  Load source instead downscaled avatar images
// @author       Chirimu
// @include      https://rail-sim.de/forum/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389442/Rail-Simde%20Avatar%20replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/389442/Rail-Simde%20Avatar%20replacer.meta.js
// ==/UserScript==

(function() {

var links = document.getElementsByTagName("img");
for(var i = 0, l = links.length; i < l; i++) {
    var link = links[i];
    link.src = link.src.replace(/-128/i, '');
    link.src = link.src.replace(/-96/i, '');
    link.srcset = link.srcset.replace(/-128/i, '');
    link.srcset = link.srcset.replace(/-96.jpeg 2x/i, '.jpeg');
}
})();