// ==UserScript==
// @name         Vertix.io Fireball Mod
// @namespace    d
// @version      0.1
// @description  Make the arsonist from Vertix.io shoot fireballs by pressing shift
// @author       MirrorTurtle92
// @match        http://vertix.io/*
// @match        http://www.vertix.io/*
// @downloadURL https://update.greasyfork.org/scripts/37159/Vertixio%20Fireball%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/37159/Vertixio%20Fireball%20Mod.meta.js
// ==/UserScript==
document.getElementById("mainTitleText").style.color = "#5693ce";

var para2 = document.createElement("p");
var node2 = document.createTextNode("Fireball mod for arsonist");
para2.appendChild(node2);
var element2 = document.getElementById("mainTitleText");
element2.appendChild(para2);

document.addEventListener("keydown", function(a) {
    if (a.keyCode == 16) {

        playerSwapWeapon(player, 1);
        setTimeout(shootBullet(player), 10);
        playerSwapWeapon(player, 1);
        setTimeout(shootBullet(player), 10);
        playerSwapWeapon(player, 1);
        setTimeout(shootBullet(player), 10);
        playerSwapWeapon(player, 1);
        setTimeout(shootBullet(player), 10);
        playerSwapWeapon(player, 1);
        setTimeout(shootBullet(player), 10);
        playerSwapWeapon(player, 1);
        setTimeout(shootBullet(player), 10);
        playerSwapWeapon(player, 1);
        setTimeout(shootBullet(player), 10);
        playerSwapWeapon(player, 1);
        setTimeout(shootBullet(player), 10);
        playerSwapWeapon(player, 1);
        setTimeout(shootBullet(player), 10);
        playerSwapWeapon(player, 1);
        setTimeout(shootBullet(player), 10);
        playerSwapWeapon(player, 1);
        setTimeout(shootBullet(player), 10);
        playerSwapWeapon(player, 1);
        setTimeout(shootBullet(player), 10);
        playerSwapWeapon(player, 1);
        setTimeout(shootBullet(player), 10);
        playerSwapWeapon(player, 1);
        setTimeout(shootBullet(player), 10);
        playerSwapWeapon(player, 1);
        setTimeout(shootBullet(player), 10);
        playerSwapWeapon(player, 1);
        setTimeout(shootBullet(player), 10);
        playerSwapWeapon(player, 1);
        setTimeout(shootBullet(player), 10);
        playerSwapWeapon(player, 1);
        setTimeout(shootBullet(player), 10);
        playerSwapWeapon(player, 1);
        setTimeout(shootBullet(player), 10);
        playerSwapWeapon(player, 1);
        setTimeout(shootBullet(player), 10);

    }
});
