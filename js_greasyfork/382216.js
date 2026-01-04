// ==UserScript==
// @name         Jadisco.pl YT
// @namespace    http://xayan.dev/jadisco
// @version      0.1
// @description  Change Twitch stream to YT live on jadisco.pl
// @author       Xayan
// @match        https://jadisco.pl/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382216/Jadiscopl%20YT.user.js
// @updateURL https://update.greasyfork.org/scripts/382216/Jadiscopl%20YT.meta.js
// ==/UserScript==

window.onload = function() {
    'use strict';

    document.getElementById('jd-player').setAttribute("src", "https://www.youtube.com/embed/live_stream?channel=UCYN3DEMx3v31t5_ll3R0a5Q&autoplay=1");
};