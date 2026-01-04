// ==UserScript==
// @name         Feedly Scrollbar Hide
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://feedly.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404763/Feedly%20Scrollbar%20Hide.user.js
// @updateURL https://update.greasyfork.org/scripts/404763/Feedly%20Scrollbar%20Hide.meta.js
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

    addGlobalStyle('.LeftnavList::-webkit-scrollbar { display: none !important; }');
})();