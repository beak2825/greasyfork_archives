// ==UserScript==
// @name         Hide ads on gogoanime.io
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Ads are ok when they're not porny clickbait
// @author       You
// @match        https://ww5.gogoanime.io/*
// @match        https://gogoanime.se/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/370581/Hide%20ads%20on%20gogoanimeio.user.js
// @updateURL https://update.greasyfork.org/scripts/370581/Hide%20ads%20on%20gogoanimeio.meta.js
// ==/UserScript==
/* jshint -W097 */
/* global GM_addStyle */
/* jshint asi: true, multistr: true */

(function() {
    var styles = '\
[id^=BB_],\
.mgbox,\
div[id^=BB_],\
iframe[id^=dsq-app]:nth-child(2),\
.content_right {\
    display: none !important;\
}\
'
    GM_addStyle(styles)
})();