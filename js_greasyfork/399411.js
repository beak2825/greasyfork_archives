// ==UserScript==
// @name         Open myMCPS in same tab
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Instead of opening myMCPS classroom in a new tab, forcing you to close the log in, this one opens in the same page.
// @author       Om Jha
// @match        https://classroom.mcpsmd.org/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399411/Open%20myMCPS%20in%20same%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/399411/Open%20myMCPS%20in%20same%20tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var links = document.getElementsByTagName('a');
    for (var i = 0; i < links.length; i++) {
        links[i].removeAttribute('target');
    }
})();