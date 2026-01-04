// ==UserScript==
// @name         EksiSozluk Fav Counter Disable
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Fav sayaçlarını inline biçimlendirmeyle gizler.
// @author       nejdetckenobi
// @match        https://eksisozluk.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/370035/EksiSozluk%20Fav%20Counter%20Disable.user.js
// @updateURL https://update.greasyfork.org/scripts/370035/EksiSozluk%20Fav%20Counter%20Disable.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle('.favorite-count {display: none;}');
})();