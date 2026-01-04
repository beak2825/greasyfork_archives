// ==UserScript==
// @name         Neopets Fix Noticeboard
// @namespace    http://tampermonkey.net/
// @version      2025-05-28
// @description  Lets you publish a notice in the Neopets noticeboard
// @author       lalienlcatl
// @match        https://www.neopets.com/addnotice.phtml
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537553/Neopets%20Fix%20Noticeboard.user.js
// @updateURL https://update.greasyfork.org/scripts/537553/Neopets%20Fix%20Noticeboard.meta.js
// ==/UserScript==

(function() {
    document.querySelectorAll("form").forEach(function(e) {
        if(e.action == "https://www.neopets.com/noticeboard_preview.phtml") {
            e.action = "https://www.neopets.com/process_addnotice.phtml";
            e.querySelector("input[type=submit]").value = "Post Now";
        }
    });
})();