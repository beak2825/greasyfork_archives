// ==UserScript==
// @name         Royal Road Keyboard Navigation
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Arrow key navigation
// @author       HiEv
// @license      MIT
// @match        https://www.royalroad.com/fictions/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=royalroad.com
// @grant        none
// @require      http://code.jquery.com/jquery-3.7.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/468247/Royal%20Road%20Keyboard%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/468247/Royal%20Road%20Keyboard%20Navigation.meta.js
// ==/UserScript==

/*
    global $
*/

(function() {
    'use strict';

    $(document).on("keyup", function (event) {
        if (($("input:focus").length === 0) && ($("textarea:focus").length === 0) && ($("div[contenteditable='true']:focus").length == 0)) { // Prevent triggering when in an input element
            var links, i;
            if (event.key === "ArrowLeft") { // Go to previous page
                links = $(".pagination a");
                for (i = 0; i < links.length; i++) {
                    if (links[i].innerHTML === "‹ Previous") {
                        links[i].click();
                        break;
                    }
                }
                // console.log("Previous link not found.");
            }
            if (event.key === "ArrowRight") { // Go to next page
                links = $(".pagination a");
                for (i = 0; i < links.length; i++) {
                    // console.log(links[i].innerHTML);
                    if (links[i].innerHTML === "Next ›") {
                        links[i].click();
                        break;
                    }
                }
                // console.log("Next link not found.");
            }
        }
    });
})();