// ==UserScript==
// @name         ebonus
// @namespace    ebonus2x
// @version      1
// @description  Auto click on next video and auto click on bubble
// @author       MrRiven
// @match        https://ebonus.gg/earn-coins/watch
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39754/ebonus.user.js
// @updateURL https://update.greasyfork.org/scripts/39754/ebonus.meta.js
// ==/UserScript==

$(document).ready(function(){
    var coinsclicker = setInterval(function() {
        ClickNext();
        ClickOnBubble();
    }, 1000);

    window.ClickNext = function(){
        if ($(".coins_popup").length > 0) {
            console.log("clicked");
            $(".coins_popup").click();
        }
    };
    window.ClickOnBubble = function(){
        if ($(".sweet-alert.showSweetAlert.visible").length > 0) {
            console.log("clicked");
            $(".confirm").click();
        }
    };
});