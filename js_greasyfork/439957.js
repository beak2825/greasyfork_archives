// ==UserScript==
// @name         autoOpen
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Script for open each new contest thread.
// @author       kwk
// @match        https://lolz.guru/forums/contests/
// @icon         https://www.google.com/s2/favicons?domain=github.com
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439957/autoOpen.user.js
// @updateURL https://update.greasyfork.org/scripts/439957/autoOpen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var dates = document.querySelectorAll('[id^="thread"]');
    for (var i = 0; i < dates.length; i++) {
        var alreadyIn = dates[i].innerHTML;
        if (alreadyIn.search('alreadyParticipate') == -1 && alreadyIn.search('fa fa-bullseye mainc Tooltip') == -1) {
            setTimeout(function (i) {
                var num = dates[i].attributes.id.nodeValue;
                var splits = num.split('-');
                GM_openInTab('https://lolz.guru/threads/' + splits[1]);
            }, 1 * i, i);
        }
    }
})();