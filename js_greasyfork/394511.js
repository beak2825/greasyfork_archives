// ==UserScript==
// @name         eBonus.gg for all (LOL, Fornite, overwatch, etc..)
// @namespace    Mr. Funny Guy
// @version      2.7
// @description  This is just click helper to verify if the videos are playing and getting coins correctly.
// @author       Mr. Funny Guy (Watch Dailymotion: https://www.dailymotion.com/funvideoclips )
// @match        https://ebonus.gg/earn-coins/watch/overwatch
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394511/eBonusgg%20for%20all%20%28LOL%2C%20Fornite%2C%20overwatch%2C%20etc%29.user.js
// @updateURL https://update.greasyfork.org/scripts/394511/eBonusgg%20for%20all%20%28LOL%2C%20Fornite%2C%20overwatch%2C%20etc%29.meta.js
// ==/UserScript==

setInterval(function() {
                  window.location.reload();
                }, 170000);

$(document).ready(function(){
    var coinsclicker = setInterval(function() {
        ClickNext();
        ClickOnBubble();
    }, 5000);

    window.ClickNext = function(){
        if ($(".sweet-alert.showSweetAlert.visible").length > 0) {
            console.log("clicked");
            $(".confirm").click();
        }
    };
    window.ClickOnBubble = function(){
        if ($(".coins_popup.circle").length > 0) {
            console.log("clicked");
            $(".confirm").click();
        }
    };
});

setInterval(click, 70000);

