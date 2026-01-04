// ==UserScript==
// @name         Venge.io HACKS NEW 2020 UNLIMTIED AMMO INF JUMP
// @version      0.2
// @description  Venge.io HACKS
// @author       Llama
// @match        https://venge.io/
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/662323
// @downloadURL https://update.greasyfork.org/scripts/435162/Vengeio%20HACKS%20NEW%202020%20UNLIMTIED%20AMMO%20INF%20JUMP.user.js
// @updateURL https://update.greasyfork.org/scripts/435162/Vengeio%20HACKS%20NEW%202020%20UNLIMTIED%20AMMO%20INF%20JUMP.meta.js
// ==/UserScript==

(async() => {
    while(!window.hasOwnProperty("Movement"))
        await new Promise(resolve => setTimeout(resolve, 1000));

    const update = Movement.prototype.update;
    Movement.prototype.update = function (t) {
        update.apply(this, [t]);
        this.setAmmoFull()
        this.player.throwCooldown = 0;
        this.lastThrowDate = 0;
        this.currentWeapon.spread = 0;
        this.currentWeapon.recoil = 0;
        this.currentWeapon.shootTime = .1;
        this.currentWeapon.isAutomatic = true;
        this.isLanded = true;
        this.bounceJumpTime = 0;
        this.isJumping = false;
        this.isHitting = false;
    };
})();