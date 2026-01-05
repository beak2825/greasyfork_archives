// ==UserScript==
// @name         spectate cycle
// @version      0.1
// @description  press right to cycle through spectate next position
// @author       You
// @match        http://chopcoin.io/*
// @grant        none
// @namespace https://greasyfork.org/users/17934
// @downloadURL https://update.greasyfork.org/scripts/15720/spectate%20cycle.user.js
// @updateURL https://update.greasyfork.org/scripts/15720/spectate%20cycle.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

window.addEventListener("keydown", dealWithKeyboard, false);

function dealWithKeyboard(e) {
    if (e.keyCode == "39") document.getElementById('spectate').click();
}