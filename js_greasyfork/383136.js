// ==UserScript==
// @name         Tribalwars Premium Exchange Flasher
// @namespace    minecraft.net( ͡° ͜ʖ ͡°)
// @version      0.2
// @description  try to take over the world!
// @author       Mathias
// @match        https://*.tribalwars.net/game.php?village=*&screen=market&mode=exchange*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383136/Tribalwars%20Premium%20Exchange%20Flasher.user.js
// @updateURL https://update.greasyfork.org/scripts/383136/Tribalwars%20Premium%20Exchange%20Flasher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("body").after("<div class=\"notice\"></div>");
    $(".notice").hide().css("position", "fixed").css("top", "0").css("left", "0").css("width", "100%").css("height", "100%").css("background-color", "#fff");

    function splash() {
     $(".notice").show().animate({opacity:0.5}, 300).fadeOut(300).css({"opacity": 1});
    }

    let target = document.querySelector('#premium_exchange_stock_wood');
    let target2 = document.querySelector('#premium_exchange_stock_stone');
    let target3 = document.querySelector('#premium_exchange_stock_iron');
    let observer = new MutationObserver(function(mutations) {
        splash();
    });
    let config = { attributes: true, childList: true, characterData: true };
    observer.observe(target, config);
    observer.observe(target2, config);
    observer.observe(target3, config);
})();