// ==UserScript==
// @name         eBonus.gg Pro
// @namespace    BEAN
// @version      1.1
// @description  Auto click Next the video and play next.
// @author       BEAN
// @match        https://ebonus.gg/earn-coins/watch/lol
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394602/eBonusgg%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/394602/eBonusgg%20Pro.meta.js
// ==/UserScript==
 
setInterval(function() {
                  window.location.reload();
                }, 170000);
 
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