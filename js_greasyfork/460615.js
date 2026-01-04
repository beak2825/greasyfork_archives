// ==UserScript==
// @name         MAKE PLAYER BIG AGAIN
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  asd
// @author       You
// @match        http://demo.ovenplayer.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ovenplayer.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460615/MAKE%20PLAYER%20BIG%20AGAIN.user.js
// @updateURL https://update.greasyfork.org/scripts/460615/MAKE%20PLAYER%20BIG%20AGAIN.meta.js
// ==/UserScript==

(function() {
    'use strict';

    for (var elem of document.getElementsByClassName("col-12 col-md-6")) {
        elem.setAttribute("style","width:100%");
    }

})();