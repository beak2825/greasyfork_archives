// ==UserScript==
// @name         RYM Release Rating Center Fix
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fixes the off-center rating on releases on artist pages
// @author       nate
// @match        https://rateyourmusic.com/artist/*
// @icon         https://www.google.com/s2/favicons?domain=rateyourmusic.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429963/RYM%20Release%20Rating%20Center%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/429963/RYM%20Release%20Rating%20Center%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle('.disco_cat_inner { float: none; }');
})();