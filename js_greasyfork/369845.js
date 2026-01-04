// ==UserScript==
// @name       TTN notify on change
// @namespace  http://mathemaniac.org/
// @version    1.0.1
// @description  Notifies when the content changes on TTN.
// @match        https://www.treesnetwork.com/*
// @copyright  2018, Sebastian Paaske Tørholm
// @require    https://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/369845/TTN%20notify%20on%20change.user.js
// @updateURL https://update.greasyfork.org/scripts/369845/TTN%20notify%20on%20change.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

$(function () {
    var last_name = undefined;
    function checkForChange() {
        var title = $('div span span[class*="name"]').text();
        if (! last_name) last_name = title;

        if (title !== last_name) {
            last_name = title;
            if (document.hidden && title !== "Off The Air" && title !== "The Trees Network") {
                var n = new Notification("Now playing on TTN: " + title, { "tag": "ttn_now_playing", "requireInteraction": true, "silent": false } );
            }
        }
    }
    setInterval(checkForChange, 1000);
});

