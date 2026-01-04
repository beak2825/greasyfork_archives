// ==UserScript==
// @name         unauthorized.tv keybindings
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  adds global keybindings for unauthorized.tv
// @author       moltencheesebear
// @include      https://www.unauthorized.tv/*
// @grant        none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/389122/unauthorizedtv%20keybindings.user.js
// @updateURL https://update.greasyfork.org/scripts/389122/unauthorizedtv%20keybindings.meta.js
// ==/UserScript==

(function() {
    'use strict';

function doc_keyUp(e) {
    var mp,toggle;
    mp = document.getElementsByTagName('video')[0].plyr;
//    console.log(e.keyCode);
    switch (e.keyCode) {

        case 70:
            //f
            mp.fullscreen.toggle();
            break;
        case 75: //k
            mp.togglePlay(toggle);
            break;
        default:
            break;
    }
}
document.addEventListener('keyup', doc_keyUp, false);

})();