// ==UserScript==
// @name        Prevent middle click Javascript void tab
// @namespace   https://greasyfork.org/users/697378-reiver
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      Reiver
// @description Stops web browser from opening blank javascript:void(0) tabs when middle clicking on Javascipt links.
// @downloadURL https://update.greasyfork.org/scripts/414209/Prevent%20middle%20click%20Javascript%20void%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/414209/Prevent%20middle%20click%20Javascript%20void%20tab.meta.js
// ==/UserScript==

$(document).on('auxclick', 'a[href^="javascript:"]', function (e) {
    if (e.button == 1) {
        e.preventDefault();
    }
});