// ==UserScript==
// @name        KvR autolinks
// @namespace   Violentmonkey Scripts
// @match       https://www.kvraudio.com/forum/viewtopic.php
// @grant       none
// @version     0.666
// @author      farlukar
// @description Changes kvraudio forum autolinks back to plain text
// @downloadURL https://update.greasyfork.org/scripts/421585/KvR%20autolinks.user.js
// @updateURL https://update.greasyfork.org/scripts/421585/KvR%20autolinks.meta.js
// ==/UserScript==

window.addEventListener('load', function() {


    var autolinks = document.querySelectorAll("a.kvr-auto-linked");

    for (var i = autolinks.length - 1; i >= 0; i--) {
        var a = autolinks[i];
        var span = document.createElement("span");
        span.appendChild(a.firstChild);
        a.parentNode.insertBefore(span, a);
        a.parentNode.removeChild(a);
    }


}, false);