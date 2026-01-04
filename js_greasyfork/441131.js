// ==UserScript==
// @name         Youtube without fact checking
// @version      0.3
// @description  Hide youtube "clarification"/"context" window aka "fact checking"
// @author       Anonymous8888
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/en/users/884441-anonymous8888
// @downloadURL https://update.greasyfork.org/scripts/441131/Youtube%20without%20fact%20checking.user.js
// @updateURL https://update.greasyfork.org/scripts/441131/Youtube%20without%20fact%20checking.meta.js
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

   addGlobalStyle("ytd-info-panel-container-renderer { display: none !important; }")
   addGlobalStyle("ytd-clarification-renderer { display: none !important; }")

})();