// ==UserScript==
// @name         rating only
// @namespace    http://tampermonkey.net/
// @version      6.9
// @description  the only tag is rating
// @author       tuwuna
// @include      https://codeforces.com/contest/*
// @include      https://codeforces.com/problemset/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394759/rating%20only.user.js
// @updateURL https://update.greasyfork.org/scripts/394759/rating%20only.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (!document.getElementsByClassName('verdict-accepted').length) Array.from(document.getElementsByClassName('roundbox')).map(e => [e, Array.from(e.children).find(c => c.classList.contains('tag-box'))]).filter(p => p[1] && p[1].title != 'Difficulty' && p[1].title != 'Сложность').forEach(p => p[0].remove())
})();