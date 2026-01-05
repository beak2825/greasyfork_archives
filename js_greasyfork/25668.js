// ==UserScript==
// @name         Scrap.tf Easy Banking
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @author       You
// @match        https://scrap.tf/weapons/*
// @grant        none
// @description Script as to set up a weapons trade with Scrap.tf bot
// @downloadURL https://update.greasyfork.org/scripts/25668/Scraptf%20Easy%20Banking.user.js
// @updateURL https://update.greasyfork.org/scripts/25668/Scraptf%20Easy%20Banking.meta.js
// ==/UserScript==

var items_left = $('.item').length;
document.getElementsByClassName('notice-message')[0].innerHTML += items_left;
function reDir(curr,dest) {
    if (window.location.href == "https://scrap.tf/weapons/" + curr) {
        window.location.href = "https://scrap.tf/weapons/" + dest;
    }
}

if (items_left <= 100) {
    reDir(1,2);
    reDir(2,3);
    reDir(3,4);
    reDir(4,5);
    reDir(5,12);
    reDir(12,14);
    reDir(14,15);
    reDir(15,16);
    reDir(16,17);
    reDir(17,26);
    reDir(26,27);
    reDir(27,28);
    reDir(28,29);
    reDir(29,30);
} else {
    $('#buy-container div').not('.inv-hint').not('.inv-hint2').addClass("best-box");
    for (var i = 1; i < 73; i++) {
        var rng = Math.floor(Math.random()*500) + 5;
        var checker = $('.best-box :nth-child(' + rng + ')');
        var checker2 = $('.best-box :nth-child(' + rng + ')').hasClass("token");
        if (checker2 === false) {
            $('.best-box :nth-child(' + rng +')').addClass('selected-item');
        }
    }
    ScrapTF.Weapons.BuyWithMetal();
    setTimeout( function() {
        ScrapTF.TradeOffers.Run();
        setTimeout("location.reload(true);", 60000);
    }, 10000);
}