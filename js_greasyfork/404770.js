// ==UserScript==
// @name         Plex Scrollbar Hide
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://127.0.0.1:32400/web/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404770/Plex%20Scrollbar%20Hide.user.js
// @updateURL https://update.greasyfork.org/scripts/404770/Plex%20Scrollbar%20Hide.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

    //addGlobalStyle('.PrePlayPageContent-prePlayPageContent-1fFCHQ::-webkit-scrollbar { display: none !important; }');
    addGlobalStyle('.Scroller-vertical-VScFLT::-webkit-scrollbar { display: none !important; }');
})();