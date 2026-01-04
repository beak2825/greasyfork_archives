// ==UserScript==
// @name         Gamee hack
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       DarkKeks
// @match        https://www.gameeapp.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34912/Gamee%20hack.user.js
// @updateURL https://update.greasyfork.org/scripts/34912/Gamee%20hack.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ch = $('.challenge-btn').first();
    var hc = ch.clone();
    ch.before(hc);
    $('.challenge-btn:lt(2)').css({'transform': "translateY(-100%)"});
    hc.removeClass("share-telegram");
    hc.html("Hack!");
    hc.unbind();
    hc.click(() => {
        var sc = prompt("Score to set");
        window.gameeUI.saveScore(parseInt(sc));
    });
})();