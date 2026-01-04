// ==UserScript==
// @name         You + Google Menu
// @version      1.0
// @description  Adds a custom node to the Google menu
// @author       Your Name
// @match        https://vanced-youtube.neocities.org/2011/
// @run-at       document_end
// @license      MIT
// @namespace https://greasyfork.org/users/1090996
// @downloadURL https://update.greasyfork.org/scripts/470867/You%20%2B%20Google%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/470867/You%20%2B%20Google%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the new node
    var newNode = document.createElement('li');
    newNode.className = 'gbt';
    newNode.innerHTML = '<a onclick="gbar.qs(this)" class="gbzt" id="gb_2" href="http://www.google.com/imghp?hl=en&amp;tab=wi"><span class="gbtb2"></span><span class="gbts">+You</span></a>';

    // Find the reference node to insert before
    var referenceNode = document.querySelector('li.gbt a#gb_1');

    // Insert the new node before the reference node
    if (referenceNode && referenceNode.parentNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode);
    }
})();