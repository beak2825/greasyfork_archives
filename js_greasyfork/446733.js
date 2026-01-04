// ==UserScript==
// @name         FuckYTShorts
// @namespace    https://github.com/dollhaus/Snippets
// @version      0.1
// @description  Redirects "shorts" to the canonical "watch?v=" url.
// @author       dollhaus
// @license      The Unlicense: Do whatever the fuck you want with this code, it is public domain.
// @match        https://youtube.com/*
// @run-at       document-start
// @include      *youtube.com*
// @downloadURL https://update.greasyfork.org/scripts/446733/FuckYTShorts.user.js
// @updateURL https://update.greasyfork.org/scripts/446733/FuckYTShorts.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = window.location.pathname.split('/');
    var shortsident = url[1];
    if (shortsident == 'shorts')
    {
        var videoID = url[2];
        window.location.replace('https://youtube.com/watch?v=' + videoID);
    }
})();