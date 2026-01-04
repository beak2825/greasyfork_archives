// ==UserScript==
// @name     Add Drive Link
// @version  1.0
// @grant    none
// @description leave blank
// @license MIT
// @match https://vanced-youtube.neocities.org/2011/
// @namespace https://greasyfork.org/users/1090996
// @downloadURL https://update.greasyfork.org/scripts/469605/Add%20Drive%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/469605/Add%20Drive%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the new list item node
    var listItem = document.createElement('li');
    listItem.setAttribute('class', 'gbt');
    listItem.innerHTML = '<a class="gbzt" id="gb_23" onclick="gbar.qs(this);gbar.logger.il(1,{t:23})" href="http://mail.google.com/mail/?hl=en&amp;tab=wm"><span class="gbtb2"></span><span class="gbts">Drive</span></a><div></div>';

    // Find the existing parent node to append the new item to
    var parentNode = document.querySelector('.gbi');
    if (parentNode) {
        parentNode.appendChild(listItem);
    }
})();