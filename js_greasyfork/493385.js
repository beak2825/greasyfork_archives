// ==UserScript==
// @name         Mute radio (Habblet Client)
// @namespace    http://tampermonkey.net/
// @version      2024-04-24
// @description  Automatically mutes the radio when entering
// @author       Luann
// @match        https://www.habblet.city/hotelv2
// @icon         https://www.google.com/s2/favicons?sz=64&domain=habblet.city
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493385/Mute%20radio%20%28Habblet%20Client%29.user.js
// @updateURL https://update.greasyfork.org/scripts/493385/Mute%20radio%20%28Habblet%20Client%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let player2 = document.getElementById('player2');
                player2.muted = true;
                $("#playerButton").attr('data-enable', '0');
})();