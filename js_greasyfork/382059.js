// ==UserScript==
// @name         Select & Delete
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  deletes selected elements. shift+click: select or deselect, ctrl+click: delete.
// @author       listfilterjay
// @match        *://*/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/382059/Select%20%20Delete.user.js
// @updateURL https://update.greasyfork.org/scripts/382059/Select%20%20Delete.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickCheck(e) {
        if(e.shiftKey||e.ctrlKey) {
            e.preventDefault(); // prevents links from opening.
            e.stopPropagation(); // prevents events from affecting parent elements.
            if(e.shiftKey) {
                console.log("shift");
                if(jQuery(this).hasClass("delete-select")) {
                    jQuery(this).removeClass("delete-select");
                }else {
                    jQuery(this).addClass("delete-select");
                }
            }
            if(e.ctrlKey) {
                console.log("ctrl");
                if(jQuery(this).hasClass("delete-select")) {
                    jQuery(this).remove();
                }
            }
        }
    }
    jQuery("*").click(clickCheck);

    // defintion of css for the red border around selected elements.
    const selectCss =
`<style type="text/css">
    .delete-select {
        border: 2px red solid !important;
    }
</style>`;
    jQuery(document.body).append(selectCss);
    console.log("select & delete script is active.");

})();