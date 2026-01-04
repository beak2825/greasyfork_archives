// ==UserScript==
// @name         MOOMOO.IO HAT MACRO + AUTO BUY!!!
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  With the press of a key you can auto Buy/Equip a Hat! As well as bigger store, better map and better colors, as well as much more!!!!!
// @author       Cody Webb
// @match                 *://moomoo.io/*
// @match                 *://sandbox.moomoo.io/*
// @match                 *://dev.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404583/MOOMOOIO%20HAT%20MACRO%20%2B%20AUTO%20BUY%21%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/404583/MOOMOOIO%20HAT%20MACRO%20%2B%20AUTO%20BUY%21%21%21.meta.js
// ==/UserScript==
(function() {

    document.getElementById("storeHolder").style = "height: 1500px; width: 450px;";
    document.getElementById("gameName").style.color = "red";
    document.getElementById("setupCard").style.color = "red";
    document.getElementById("gameName").innerHTML = "MooMoo.io <br>HAT MOD";
    document.getElementById('adCard').remove();
    document.getElementById("leaderboard").append('HAT MOD');
    document.getElementById("leaderboard").style.color = "#990000";
    document.getElementById("allianceButton").style.color = "#990000";
    document.getElementById("chatButton").style.color = "#990000";
    document.getElementById("storeButton").style.color = "#990000";
    $("#mapDisplay").css("background", "url('https://i.imgur.com/fgFsQJp.png')");
    document.getElementById("diedText").innerHTML = "OOOF, U DIED!!!!";
    $("#adCard").css({display: "none"});
    $("#gameCanvas").css('cursor', 'url(http://cur.cursors-4u.net/user/use-1/use153.cur), default');
    $("#moomooio_728x90_home").parent().css({display: "none"});


   var hatList = {
       Unequip: 0,
       WinterCap: 15,
       BullHelmet: 7,
       SoldierHelmet: 6,
       TankGear: 40,
       TurretGear: 53,
       FlipperHat: 31,
       BoosterHat: 12,
       BarbarianArmor: 26,
       EmpHelmet: 22,
       ThiefGear: 52,
       SamuraiArmor: 20,
       AssassinGear: 56,
       BushidoArmor: 16,
       PigHead: 29
   };

    function buyAndEquip(name) {
        var target2 = hatList.name;
        storeBuy(target2);
        storeEquip(target2);
    }


    if (document.activeElement.id !== 'chatBox'){
        document.addEventListener('keydown', function(e) {
            switch (e.keyCode) {
                case 16: buyAndEquip('Unequip'); break; // Shift
                case 82: buyAndEquip('BullHelmet'); break; // R
                case 90: buyAndEquip('TankGear'); break; // Z
                case 71: buyAndEquip('SoldierHelmet'); break; // G
                case 66: buyAndEquip('BoosterHat'); break; // B
                case 89: buyAndEquip('FlipperHat'); break; // Y
                case 78: buyAndEquip('WinterCap'); break; // N
                case 74: buyAndEquip('EmpHelmet'); break; // J
                case 84: buyAndEquip('TurretGear'); break; // T
                case 88: buyAndEquip('ThiefGear'); break; // K
                case 76: buyAndEquip('BarbarianArmor'); break; // H
                case 85: buyAndEquip('SamuraiArmor'); break; // U
                case 73: buyAndEquip('AssassinGear'); break; // I
                case 79: buyAndEquip('BushidoArmor'); break; // O
                case 80: buyAndEquip('PigHead'); break; // P

            }
        });

}})();