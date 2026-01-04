// ==UserScript==
// @name         qaru.site invert text
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Reverse answer text if you have adblock
// @author       Dmatrix
// @match        http://qaru.site/questions/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372422/qarusite%20invert%20text.user.js
// @updateURL https://update.greasyfork.org/scripts/372422/qarusite%20invert%20text.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function reverse() {
        $('.answer-row').each(function() {
        $(this).children().first().attr("class","")
      })
    }

    $(document).ready(function() {
        setTimeout(reverse, 1000)
    });
})();