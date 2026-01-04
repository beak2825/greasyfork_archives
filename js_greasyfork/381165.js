// ==UserScript==
// @name         Gay ass hat changer 2.0
// @namespace    https://greasyfork.org/es/users/282883-uwu-unu
// @version      2.0
// @description  Ez hat changing
// @author       Gay ass
// @match        http://moomoo.io/*
// @match        http://dev.moomoo.io/*
// @match        http://sandbox.moomoo.io/*
// @match        *://*.moomoo.io/*
// @connect      moomoo.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381165/Gay%20ass%20hat%20changer%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/381165/Gay%20ass%20hat%20changer%2020.meta.js
// ==/UserScript==

(function() {
    'use strict';
$('#gameName').html('<div id="gameName">MooMoo.io</div>');
$("#youtuberOf").hide();
$("#followText").hide();
$("#twitterFollow").hide();
$("#youtubeFollow").hide();
$("#adCard").hide();
$("#mobileInstructions").hide();
$("#promoImgHolder").hide();
$("#downloadButtonContainer").hide();
$("#mobileDownloadButtonContainer").hide();
$(".downloadBadge").hide();
$('.menuText').hide();
$('.menuHeader').hide();
$('#adCard').remove();
$("div[style*='inline-block']").css('display', 'block');
$('#mapDisplay').css({
		'background': 'url("https://cdn.discordapp.com/attachments/374333551858155530/376303720540930048/moomooio-background.png")'
});


var Bull = 7;
var Tank = 40;
var Booster = 12;
var Soldier = 6;
var Turret = 53;
var Samurai = 20;
var Flipper = 31;
var Emp = 22;
var Barb = 26;

document.addEventListener('keydown', function(e) {
    if (document.activeElement.id == 'chatBox') return;
    switch (e.keyCode) {
        case 96: storeEquip(0); break;
        case 66: storeEquip(Bull); break;
        case 18: storeEquip(Turret); break;
        case 104: storeEquip(Booster); break;
        case 71: storeEquip(Soldier); break;
        case 67: storeEquip(Tank); break;
        case 99: storeEquip(Samurai); break;
        case 100: storeEquip(Flipper); break;
        case 16: storeEquip(Emp); break;
        case 82: storeEquip(Barb); break;
    }
});

document.addEventListener('keydown', function(e) {
    if (document.activeElement.id == 'chatBox') return;
    switch (e.keyCode) {
        case 66: storeBuy(Bull); break;
        case 18: storeBuy(Turret); break;
        case 104: storeBuy(Booster); break;
        case 71: storeBuy(Soldier); break;
        case 67: storeBuy(Tank); break;
        case 99: storeBuy(Samurai); break;
        case 100: storeBuy(Flipper); break;
        case 16: storeBuy(Emp); break;
        case 82: storeBuy(Barb); break;
    }
});

})();