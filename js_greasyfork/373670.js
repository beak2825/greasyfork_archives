// ==UserScript==
// @name         Laravel Firefox Forum Fix
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Just fixes the forum covering up the sidebar - Credits to Cronix (see https://laracasts.com/discuss/channels/site-improvements/firefox-and-laracastscomdiscuss )
// @author       Axeia
// @match        https://laracasts.com/discuss/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373670/Laravel%20Firefox%20Forum%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/373670/Laravel%20Firefox%20Forum%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //Fix the forumn column overlapping the sidebar.
    var style = document.createElement('style');
    var styleContent = document.createTextNode('.column {max-width: 880px !important}');
    style.appendChild(styleContent );
    var caput = document.getElementsByTagName('head');
    caput[0].appendChild(style);
})();