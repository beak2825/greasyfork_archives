// ==UserScript==
// @name         rutracker auto sort by seed
// @match        https://rutracker.org/forum/tracker.php*nm=*
// @version      1.0
// @description  Automatically sort search results by seaders
// @grant        none
// @author       nermolaev
// @run-at       document-idle
// @namespace https://greasyfork.org/users/711109
// @downloadURL https://update.greasyfork.org/scripts/417313/rutracker%20auto%20sort%20by%20seed.user.js
// @updateURL https://update.greasyfork.org/scripts/417313/rutracker%20auto%20sort%20by%20seed.meta.js
// ==/UserScript==

(function() {
    let el = document.querySelector(".seed-leech");
    el.dispatchEvent(new MouseEvent('mousedown'));
    el.dispatchEvent(new MouseEvent('mouseup'));
})();