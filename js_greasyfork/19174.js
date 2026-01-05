// ==UserScript==
// @name         HTML5 na emsc2.tv
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  zmienia player na emsc2.tv na wersje html5
// @author       You
// @match        http://emsc2.tv/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19174/HTML5%20na%20emsc2tv.user.js
// @updateURL https://update.greasyfork.org/scripts/19174/HTML5%20na%20emsc2tv.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById('emsc-player').src = 'http://player.twitch.tv/?channel=emstarcraft&html5';

})();