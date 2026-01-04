// ==UserScript==
// @name         Steins;Gate 0 watcher
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Change widths
// @author       You
// @match        http://steinsgatezero.net/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/370577/Steins%3BGate%200%20watcher.user.js
// @updateURL https://update.greasyfork.org/scripts/370577/Steins%3BGate%200%20watcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle('\
#content {\
    padding: 0;\
}\
#primary {\
    width: auto;\
}\
#secondary,\
.addthis-smartlayers {\
    display:none;\
}\
.entry-content {\
    padding: 0;\
}\
');
})();