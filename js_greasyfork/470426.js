// ==UserScript==
// @name         Add Drive to Google
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds Drive link to YouTube header menu
// @author       Your Name
// @match        https://vanced-youtube.neocities.org/2011/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470426/Add%20Drive%20to%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/470426/Add%20Drive%20to%20Google.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the new <li> element for Drive
    var driveNode = document.createElement('li');
    driveNode.className = 'gbt';
    driveNode.innerHTML = '<a class="gbzt" id="gb_23" onclick="gbar.qs(this);gbar.logger.il(1,{t:23})" href="http://mail.google.com/mail/?hl=en&amp;tab=wm"><span class="gbtb2"></span><span class="gbts">Drive</span></a>';

    // Find the target nodes
    var gmailNode = document.querySelector('li.gbt a.gbzt#gb_23[href="http://mail.google.com/mail/?hl=en&tab=wm"]');
    var moreNode = document.querySelector('li.gbt a.gbgt#gbztm[href="http://www.google.com/intl/en/options/"]');

    // Insert the Drive node under the Gmail node and before the More node
    if (gmailNode && moreNode) {
        var parent = moreNode.parentNode.parentNode;
        parent.insertBefore(driveNode, moreNode.parentNode);
    }
})();