// ==UserScript==
// @name         Add Drive to YouTube Header
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds Drive link to YouTube header menu
// @author       Your Name
// @match        https://vanced-youtube.neocities.org/2011/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470423/Add%20Drive%20to%20YouTube%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/470423/Add%20Drive%20to%20YouTube%20Header.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the new <li> element
    var driveNode = document.createElement('li');
    driveNode.className = 'gbt';
    driveNode.innerHTML = '<a class="gbzt" id="gb_23" onclick="gbar.qs(this);gbar.logger.il(1,{t:23})" href="http://mail.google.com/mail/?hl=en&amp;tab=wm"><span class="gbtb2"></span><span class="gbts">Drive</span></a>';

    // Find the Gmail <li> element
    var gmailNode = document.querySelector('li.gbt a.gbzt#gb_23[href="http://mail.google.com/mail/?hl=en&tab=wm"]');

    // Insert the new node after the Gmail node
    if (gmailNode) {
        var parent = gmailNode.parentNode.parentNode;
        parent.insertBefore(driveNode, parent.children[parent.children.length - 1].nextSibling);
    }
})();