// ==UserScript==
// @name        hide channels escape room 2022
// @namespace   http://tampermonkey.net/
// @version     0.0.1
// @description Hides widget bot channels
// @author		GMiclotte
// @include		https://e.widgetbot.io/channels/*
// @inject-into page
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/454995/hide%20channels%20escape%20room%202022.user.js
// @updateURL https://update.greasyfork.org/scripts/454995/hide%20channels%20escape%20room%202022.meta.js
// ==/UserScript==

function init() {
    // hide channels
    const channels = document.getElementsByClassName('channels');
    if (channels[0]) {
        channels[0].style.display = 'none';
    } else {
        setTimeout(init, 250);
    }
}

init();