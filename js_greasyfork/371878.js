// ==UserScript==
// @name         Automatically Reveal Political Posts on Peepeth
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically reveal posts that use the #politics hashtag on Peepeth.
// @author       ashtron
// @match        https://peepeth.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371878/Automatically%20Reveal%20Political%20Posts%20on%20Peepeth.user.js
// @updateURL https://update.greasyfork.org/scripts/371878/Automatically%20Reveal%20Political%20Posts%20on%20Peepeth.meta.js
// ==/UserScript==

(function() {
    'use strict';

var alerts = document.getElementsByClassName('politicsShow');

    for (var i = 0; i < alerts.length; i++) {
        alerts[i].click();
    }
})();