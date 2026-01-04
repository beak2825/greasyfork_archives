// ==UserScript==
// @name         Remove Popular Channels Tab (Twitch)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  For removing the obnoxious and arbitrary "Popular Channels" tab on the left panel.
// @author       Lord Nazo
// @match        https://www.twitch.tv/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/388529/Remove%20Popular%20Channels%20Tab%20%28Twitch%29.user.js
// @updateURL https://update.greasyfork.org/scripts/388529/Remove%20Popular%20Channels%20Tab%20%28Twitch%29.meta.js
// ==/UserScript==

/* Why BTTV doesn't have this feature, I don't understand. */

$(document).ready(function() {

    // Using intervals to search for "Popular Channels"
    var checkForPopularTab = setInterval(function(){

        //console.log('Starting interval search...');
        if ($('div.tw-flex-grow-1.tw-full-width > div.tw-mg-b-2')) {
            $('div.tw-flex-grow-1.tw-full-width > div.tw-mg-b-2').remove();
            console.log('Removed \"Popular Channels\" tab.');
            clearInterval(checkForPopularTab);
        }

    }, 3000);

})