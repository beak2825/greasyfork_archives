// ==UserScript==
// @name         Remove "Media bez wyboru" z Fakt.pl
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  like the title says
// @author       Zbyszek
// @match        *://www.fakt.pl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421534/Remove%20%22Media%20bez%20wyboru%22%20z%20Faktpl.user.js
// @updateURL https://update.greasyfork.org/scripts/421534/Remove%20%22Media%20bez%20wyboru%22%20z%20Faktpl.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById('media-bez-wyboru').remove();
    document.body.style.overflow = 'auto';
})();