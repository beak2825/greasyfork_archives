// ==UserScript==
// @name         Aperture Tech, NGA-page
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://bbs.ngacn.cc/read*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368357/Aperture%20Tech%2C%20NGA-page.user.js
// @updateURL https://update.greasyfork.org/scripts/368357/Aperture%20Tech%2C%20NGA-page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var table = document.getElementsByClassName("forumbox postbox");
    for (var i = table.length -1; i > 0; i--) {
        table[i].rows[0].cells[0].remove();
    }

    var head = document.getElementsByClassName("c1");
    head[0].remove();
})();