// ==UserScript==
// @name         Add Drive before more
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds Drive link to YouTube header menu
// @author       harry
// @match        https://vanced-youtube.neocities.org/2011/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470425/Add%20Drive%20before%20more.user.js
// @updateURL https://update.greasyfork.org/scripts/470425/Add%20Drive%20before%20more.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the new <li> element for Drive
    var driveNode = document.createElement('li');
    driveNode.className = 'gbt';
    driveNode.innerHTML = '<a class="gbzt" id="gb_23" onclick="gbar.qs(this);gbar.logger.il(1,{t:23})" href="http://mail.google.com/mail/?hl=en&amp;tab=wm"><span class="gbtb2"></span><span class="gbts">Drive</span></a>';

    // Find the target <li> element
    var targetNode = document.querySelector('li.gbt a.gbzt#gbztm[href="http://www.google.com/intl/en/options/"]');

    // Insert the Drive node before the target node
    if (targetNode) {
        var parent = targetNode.parentNode.parentNode;
        parent.insertBefore(driveNode, targetNode.parentNode);
    }
})();