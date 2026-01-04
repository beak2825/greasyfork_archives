// ==UserScript==
// @name         Youtube "inappropriate or offensive" Nag Screen Skipper
// @namespace    https://greasyfork.org/en/scripts/375457-youtube-inappropriate-or-offensive-nag-screen-skipper
// @version      0.0.1
// @description  Skips the "identified as inappropriate or offensive" screen.
// @author       Phlegomatic
// @match        https://www.youtube.com/verify_controversy?*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/375457/Youtube%20%22inappropriate%20or%20offensive%22%20Nag%20Screen%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/375457/Youtube%20%22inappropriate%20or%20offensive%22%20Nag%20Screen%20Skipper.meta.js
// ==/UserScript==


var BTN = document.getElementsByClassName("yt-uix-button");

for (var i = 0; i < BTN.length; i ++) {
    if(BTN[i].getAttribute('onclick')==";return true;"){
           BTN[i].click();
       }
}
