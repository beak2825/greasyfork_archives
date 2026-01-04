// ==UserScript==
// @name         Arial font on Pipedrive
// @namespace    http://www.sumit.co.il/
// @version      0.1
// @description  Change PipeDrive font to Arial
// @author       Effy Teva
// @include      https://officeguyltd.pipedrive.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445901/Arial%20font%20on%20Pipedrive.user.js
// @updateURL https://update.greasyfork.org/scripts/445901/Arial%20font%20on%20Pipedrive.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addGlobalStyle(css) {
        var head = document.getElementsByTagName('head')[0];
        if (!head)
            return;
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle("* { font-family: arial !important;}");
})();