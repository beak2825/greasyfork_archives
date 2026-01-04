// ==UserScript==
// @name         Insta Kill
// @namespace    http://tampermonkey.net/
// @version      1.2.3
// @description  Insta Kill Nice Bro
// @author       You
// @match        http://*/*
// @icon         https://th.bing.com/th/id/R.b57dc29da163e0cf186e61c23a3c10cb?rik=GYLZXJC0N72lJg&pid=ImgRaw&r=0
// @grant        none
// @license      me 
// @downloadURL https://update.greasyfork.org/scripts/464174/Insta%20Kill.user.js
// @updateURL https://update.greasyfork.org/scripts/464174/Insta%20Kill.meta.js
// ==/UserScript==

// Instakill:

var autoinsta = true;
var instaType = 1

function Equip(id, type) {
    MooMoo.sendPacket("13c" , 0, id, type)
}
var isReloaded = true

function instaMusket1() {
    let nearestEnemyAngle = activePlayerManager.getClosestEnemyAngle();
    MooMoo.sendPacket("c", 0, null)
    isReloaded = false
    let primary = MooMoo.myPlayer.inventory.primary;
    MooMoo.sendPacket("13c" , 0, 7, 0)
    MooMoo.sendPacket("13c", 0, 0, 1)
    MooMoo.sendPacket("13c", 0, 21, 1)
    MooMoo.sendPacket("5", MooMoo.myPlayer.inventory.primary, true);
    MooMoo.myPlayer.hit(nearestEnemyAngle);
}

function instaMusket2() {
    let secondary = MooMoo.myPlayer.inventory.secondary;
    setTimeout(() => {
        MooMoo.sendPacket("13c", 0, 53, 0)
        MooMoo.sendPacket("5", MooMoo.myPlayer.inventory.secondary, true);
        let nearestEnemyAngle = activePlayerManager.getClosestEnemyAngle();
        MooMoo.myPlayer.hit(nearestEnemyAngle);
    }, 75);
    setTimeout(() => {
        MooMoo.sendPacket("13c", 0, 6, 0)
    }, 150)
}

function instaMusketReload() {
    let primary = MooMoo.myPlayer.inventory.primary;
    let secondary = MooMoo.myPlayer.inventory.secondary;
    setTimeout(() => {
        MooMoo.sendPacket("5", MooMoo.myPlayer.inventory.secondary, true);
    }, 300);
    setTimeout(() => {
        MooMoo.sendPacket("5", MooMoo.myPlayer.inventory.primary, true);
    }, 2500);
    setTimeout(() => {
        MooMoo.sendPacket("13c", 0, 12, 0)
        MooMoo.sendPacket("13c", 0, 0, 1)
        MooMoo.sendPacket("13c", 0, 11, 1)
    }, 3500);
    setTimeout(() => {
        isReloaded = true
    }, 4000)
}

function instaSpike1() {
    MooMoo.sendPacket("c", 0, null)
    isReloaded = false
    let primary = MooMoo.myPlayer.inventory.primary;
    MooMoo.sendPacket("13c" , 0, 7, 0)
    MooMoo.sendPacket("13c", 0, 0, 1)
    MooMoo.sendPacket("13c", 0, 21, 1)
    MooMoo.sendPacket("5", MooMoo.myPlayer.inventory.primary, true);
    let nearestEnemyAngle = activePlayerManager.getClosestEnemyAngle();
    MooMoo.myPlayer.hit(nearestEnemyAngle);
}

function instaSpike2() {
    setTimeout(() => {
        MooMoo.sendPacket("13c", 0, 53, 0)
        let spike = MooMoo.myPlayer.inventory.spike;
        let nearestEnemyAngle = activePlayerManager.getClosestEnemyAngle();
        MooMoo.myPlayer.place(spike, nearestEnemyAngle + anglechange(35));
        MooMoo.myPlayer.place(spike, nearestEnemyAngle + anglechange(315));
    }, 100);
    setTimeout(() => {
        MooMoo.sendPacket("13c", 0, 6, 0)
    }, 150)
}

function instaSpikeReload() {
    let primary = MooMoo.myPlayer.inventory.primary;
    setTimeout(() => {
        MooMoo.sendPacket("5", MooMoo.myPlayer.inventory.primary, true);
    }, 200);
    setTimeout(() => {
        MooMoo.sendPacket("13c" , 0, 7, 0)
        MooMoo.sendPacket("13c", 0, 0, 1)
        MooMoo.sendPacket("13c", 0, 21, 1)
    }, 500);
    setTimeout(() => {
        isReloaded = true
    }, 1000)
}
