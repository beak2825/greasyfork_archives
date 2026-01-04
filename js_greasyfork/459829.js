// ==UserScript==
// @name         Remove dots
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove dots indicating transfer availability from squad page
// @author       Stefan Milenkovic
// @match        https://trophymanager.com/club/*/squad/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=trophymanager.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459829/Remove%20dots.user.js
// @updateURL https://update.greasyfork.org/scripts/459829/Remove%20dots.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let dots = document.querySelectorAll('#player_table td:last-child > img');
    for (let i = 0; i < dots.length; ++i) {
        dots[i].style.display = "none";
}
})();