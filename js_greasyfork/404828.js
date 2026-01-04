// ==UserScript==
// @name         TickTick Customizations
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://ticktick.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404828/TickTick%20Customizations.user.js
// @updateURL https://update.greasyfork.org/scripts/404828/TickTick%20Customizations.meta.js
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

    addGlobalStyle('#left-bottom-view { display: none !important; }');
})();