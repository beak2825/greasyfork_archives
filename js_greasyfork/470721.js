// ==UserScript==
// @name         Add plus Node
// @namespace    your-namespace
// @version      1.0
// @description  Adds a custom node to the specified location on the website
// @match        https://vanced-youtube.neocities.org/2011/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/470721/Add%20plus%20Node.user.js
// @updateURL https://update.greasyfork.org/scripts/470721/Add%20plus%20Node.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the custom node
    var customNode = document.createElement('li');
    customNode.className = 'gbt';
    customNode.innerHTML = '<a onclick="gbar.qs(this)" class="gbzt" id="gb_2" href="http://www.google.com/imghp?hl=en&amp;tab=wi"><span class="gbtb2"></span><span class="gbts">+You</span></a>';

    // Find the target node
    var targetNode = document.querySelector('li.gbt a#gb_1');

    // Insert the custom node above the target node
    if (targetNode && targetNode.parentNode) {
        targetNode.parentNode.insertBefore(customNode, targetNode.parentNode.firstChild);
    }
})();
