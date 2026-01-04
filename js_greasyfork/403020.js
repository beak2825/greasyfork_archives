// ==UserScript==
// @name         Remove YouTube Comments Section
// @namespace    !rcs!
// @version      4.0
// @description  Removes the YouTube comments section
// @author       Me
// @include      *://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403020/Remove%20YouTube%20Comments%20Section.user.js
// @updateURL https://update.greasyfork.org/scripts/403020/Remove%20YouTube%20Comments%20Section.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //@match and @include don't work. maybe it's browser specific. screw it.
if(window.location.origin.includes("youtube")) {
       var msg = "Comments are hidden by the extension 'Remove Comments Section'"

       function remove() {
        if(document.getElementById("comments") !== undefined && document.getElementById("comments") !== null) {
            if(document.getElementById("comments").innerHTML != msg)
                document.getElementById("comments").innerHTML = msg
        }
    }
    remove()

    //YouTube might be slow...
    window.setInterval(remove,500)
}
})();