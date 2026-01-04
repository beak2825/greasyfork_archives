// ==UserScript==
// @name         FixBugScrollToHidden
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  try to take over the world!
// @author       MerryJane
// @match        https://www.fxp.co.il/showthread.php?t=*
// @match        https://www.fxp.co.il/showthread.php?p=*
// @match        https://www.fxp.co.il/usernote.php?u=*

// @match        https://www.fxp.co.il/forumdisplay.php?t=*
// @match        https://www.fxp.co.il/chat.php
// @match        https://www.fxp.co.il/chat.php?pmid=*
// @match        https://www.fxp.co.il/private_chat.php?do=showpm&pmid=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422417/FixBugScrollToHidden.user.js
// @updateURL https://update.greasyfork.org/scripts/422417/FixBugScrollToHidden.meta.js
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

    addGlobalStyle('.postcontent { overflow: hidden; }');
    addGlobalStyle('.signature { margin-top: 1.2em; }');
    addGlobalStyle('.lastedited { padding-top: 0.5em; }');
})();