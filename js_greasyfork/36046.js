// ==UserScript==
// @name         Facebook Page Suggestion removal
// @namespace    http://tampermonkey.net/
// @version      0.2-paunoseucu
// @description  Stop suggesting me crap, Zucc!
// @author       You
// @match        http*://*.facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36046/Facebook%20Page%20Suggestion%20removal.user.js
// @updateURL https://update.greasyfork.org/scripts/36046/Facebook%20Page%20Suggestion%20removal.meta.js
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

   addGlobalStyle('div#pagelet_ego_pane, .ego_section { display: none; }');
})();