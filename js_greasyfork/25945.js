// ==UserScript==
// @name         Steam Community - Enhanced Steam Dropdown Mover
// @namespace    Royalgamer06
// @version      0.1
// @description  Moves the Enhanced Steam dropdown into the steam profile dropdown (and simultaneously makes it compatible with custom Steam skins).
// @author       Royalgamer06
// @include      /https?\:\/\/(steamcommunity|store\.steampowered)\.com.*/
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25945/Steam%20Community%20-%20Enhanced%20Steam%20Dropdown%20Mover.user.js
// @updateURL https://update.greasyfork.org/scripts/25945/Steam%20Community%20-%20Enhanced%20Steam%20Dropdown%20Mover.meta.js
// ==/UserScript==
var checker = setInterval(function() {
    if (document.getElementById("es_pulldown")) {
        clearInterval(checker);
        var c = document.querySelector("#es_popup > .popup_menu").children;
        while (c.length > 0) {
            document.querySelector("#account_dropdown > .popup_menu").appendChild(c[0]);
        }
        document.getElementById("es_pulldown").parentElement.removeChild(document.getElementById("es_pulldown"));
        document.getElementById("es_popup").parentElement.removeChild(document.getElementById("es_popup"));
    }
}, 1);