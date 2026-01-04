// ==UserScript==
// @name        Newgrounds - Remove takeover tuesday section
// @namespace   Violentmonki
// @match       https://www.newgrounds.com/*
// @grant       none
// @version     1.0
// @author      NEWGROUNDS_DIED_IN_2015
// @description This script will remove the fucking stupid takeover section from the frontpage. Supporter became bloat yay!!11!
// @downloadURL https://update.greasyfork.org/scripts/525191/Newgrounds%20-%20Remove%20takeover%20tuesday%20section.user.js
// @updateURL https://update.greasyfork.org/scripts/525191/Newgrounds%20-%20Remove%20takeover%20tuesday%20section.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const takeoverInner = document.querySelector('#takeover-inner');
    if (takeoverInner) {
        takeoverInner.remove();
    }
    const frontageTakeover = document.querySelector('#frontpage-takeover');
    if (frontageTakeover) {
        frontageTakeover.remove();
    }
})();