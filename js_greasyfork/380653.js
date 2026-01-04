// ==UserScript==
// @name         Remove Bitmex Trollbox
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This Script removes the Bitmex Trollbox
// @author       Franciscojose
// @match        https://www.bitmex.com/app/trade/XBTUSD
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380653/Remove%20Bitmex%20Trollbox.user.js
// @updateURL https://update.greasyfork.org/scripts/380653/Remove%20Bitmex%20Trollbox.meta.js
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

addGlobalStyle('.chatWidgetWrapper {display: none}')
})();

// This is an working-Update from Christopher Engel's Script.