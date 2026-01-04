// ==UserScript==
// @name         Add calendar add drive links 
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add custom nodes to YouTube header
// @author       Your Name
// @match        https://vanced-youtube.neocities.org/2011/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470075/Add%20calendar%20add%20drive%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/470075/Add%20calendar%20add%20drive%20links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the first node
    var driveNode = document.createElement('li');
    driveNode.className = 'gbt';
    driveNode.innerHTML = '<a class="gbzt" id="gb_23" onclick="gbar.qs(this);gbar.logger.il(1,{t:23})" href="http://mail.google.com/mail/?hl=en&amp;tab=wm"><span class="gbtb2"></span><span class="gbts">Drive</span></a>';

    // Create the second node
    var calendarNode = document.createElement('li');
    calendarNode.className = 'gbt';
    calendarNode.innerHTML = '<a class="gbzt" id="gb_23" onclick="gbar.qs(this);gbar.logger.il(1,{t:23})" href="http://mail.google.com/mail/?hl=en&amp;tab=wm"><span class="gbtb2"></span><span class="gbts">Calendar</span></a>';

    // Get the parent node to insert the new nodes
    var parentNode = document.querySelector('#gbz');
    if (parentNode) {
        // Append the new nodes to the parent node
        parentNode.appendChild(driveNode);
        parentNode.appendChild(calendarNode);
    }
})();