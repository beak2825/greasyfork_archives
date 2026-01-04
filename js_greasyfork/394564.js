// ==UserScript==
// @name         MLS Photo Resizer
// @version      1.0
// @description  Resizes large photos on flexmls so they fit on screen.
// @author       Spencer Ayers-Hale
// @match        www.flexmls.com/cgi-bin/mainmenu.cgi
// @grant        none
// @namespace https://greasyfork.org/users/431693
// @downloadURL https://update.greasyfork.org/scripts/394564/MLS%20Photo%20Resizer.user.js
// @updateURL https://update.greasyfork.org/scripts/394564/MLS%20Photo%20Resizer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById("mainimage").style.width = "85%";
})();