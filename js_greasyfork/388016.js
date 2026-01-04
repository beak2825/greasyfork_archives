// ==UserScript==
// @name         Gra usun pasek
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://espritgames.com/pl/wladcasmokow/go/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388016/Gra%20usun%20pasek.user.js
// @updateURL https://update.greasyfork.org/scripts/388016/Gra%20usun%20pasek.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;

    $('#languages_footer').html('');
    $('#colophon').html('');
})();