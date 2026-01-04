// ==UserScript==
// @name         Guide Language Fix
// @namespace    https://coding.net/u/sffxzzp
// @version      0.2
// @description  A script that modify steam community guide's language tags from radio to checkbox.
// @author       sffxzzp
// @match        *://steamcommunity.com/sharedfiles/editguide/?appid=*
// @icon         https://store.steampowered.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/34677/Guide%20Language%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/34677/Guide%20Language%20Fix.meta.js
// ==/UserScript==

(function() {
    var tags = document.getElementsByName("tags[]");
    for (var i=0; i<tags.length; i++) {
        tags[i].type="checkbox";
    }
})();