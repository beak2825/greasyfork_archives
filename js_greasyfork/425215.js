// ==UserScript==
// @name         Venge.io Hacks By CommanderPuli
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Infinite Jump, Infinite ammo, Zero Recoil and custom fov for Venge.io!
// @author       You
// @match        https://venge.io/
// @icon         https://www.google.com/s2/favicons?domain=venge.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425215/Vengeio%20Hacks%20By%20CommanderPuli.user.js
// @updateURL https://update.greasyfork.org/scripts/425215/Vengeio%20Hacks%20By%20CommanderPuli.meta.js
// ==/UserScript==



// with this script, you get infinite ammo, fully custom fov, and infinite jump!

    // change this to what u want ur fov to be:
    var customFov = 103;


(function() {



    'use strict';
alert("Injected Hacks By The Krunkador")

    document.onkeypress = function (e) {
    e = e || window.event;
    console.log("lol")
        Movement.prototype.setMovementAnimation = function(t) {
        if (this.player.isDeath)
            return !1;
        var i = Math.sin(this.forwardCount / this.movementAnimationSpeed) * this.movementAnimationFactor * this.movementSpeed * this.animation.movementFactor * this.animation.movementFactorStatic * pc.settings.weaponBobbing,
            e = Math.cos(this.forwardCount / this.movementAnimationSpeed) * this.movementAnimationFactor * this.movementSpeed * this.animation.movementFactor * pc.settings.weaponBobbing,
            s = Math.cos(this.forwardCount / this.movementSwingSpeed) * Math.sin(this.forwardCount / this.movementSwingSpeed) * this.movementSwingFactor * 2 * this.movementSpeed * this.animation.movementFactor * this.animation.movementFactorStatic * pc.settings.weaponBobbing,
            n = Math.cos(this.forwardCount / this.movementSwingSpeed) * this.movementSwingFactor * this.movementSpeed * pc.settings.weaponBobbing;
        !this.isFocusing && this.movementSpeed > .8 ? this.animation.movementPositionZ = pc.math.lerp(this.animation.movementPositionZ, -.04, .08) : this.animation.movementPositionZ = pc.math.lerp(this.animation.movementPositionZ, 0, .1),
            this.isJumping ? (i = 0,
                e = 0,
                s = 0,
                this.animation.jumpHeight = pc.math.lerp(this.animation.jumpHeight, this.deltaHeight, .15)) : this.animation.jumpHeight = pc.math.lerp(this.animation.jumpHeight, 0, .1);
        var o = this.weaponPositionEntity,
            a = 1,
            h = this.defaultFov,
            r = this.defaultNonFov;
        this.isFocusing && this.isReloading < this.timestamp && this.currentWeapon.isFocusable ? (o = this.focusPositionEntity,
                a = .1,
                h = this.currentWeapon.focusFov,
                r = this.currentWeapon.focusFov,
                this.isFocused || (this.directionSenseX = 5),
                this.isFocused || this.currentWeapon.focus(),
                this.isFocused = !0) : this.isFocused = !1,
            this.isShooting > this.timestamp && (a = pc.math.lerp(a, 0, .1));
        var p = this.animation.jumpHeight * this.animation.jumpHeight * .01;
        p = Math.min(p, .08);
        var m = .4;
        "Shotgun" == this.currentWeapon.type && (m = .8);
        var c = this.handEntity.getLocalPosition().lerp(this.handEntity.getLocalPosition(), o.getLocalPosition(), m);
        "Sniper" == this.currentWeapon.type && this.isFocusing && this.now() - this.focusStartTime > 60 ? (this.currentWeapon.modelEntity.enabled = !1,
                this.currentWeapon.armEntity.enabled = !1) : (this.currentWeapon.modelEntity.enabled = !0,
                this.currentWeapon.armEntity.enabled = !0),
            this.handEntity.setLocalPosition(c),
            this.movementHolder.setLocalPosition(.1 * s * a + this.animation.bounceZ + this.animation.movementPositionZ, (i + p) * a + this.animation.landAngle * a, .2 * -s * a),
            this.takePoint.setLocalEulerAngles(this.animation.takeX, this.animation.takeY, this.animation.takeZ);
        var u = this.animation.cameraBounce;
        if (this.isFocusing && (u = 0),
            this.movementHolder.setLocalEulerAngles(u + this.animation.movementAngleX + this.animation.shootSwing + this.directionSenseX + s * this.movementAngleFactor * a + this.animation.jumpAngle * a * this.randomDirection, this.animation.movementAngleY + i + s * this.movementAngleFactor * a, this.animation.movementAngleZ + this.directionSenseZ + this.animation.jumpAngle * a),
            this.headEntity.setLocalEulerAngles(.2 * -this.animation.jumpAngle * a - this.animation.cameraShootBounce, 0, 0),
            this.weaponCenter.setLocalEulerAngles(this.animation.horizantalSpread + this.animation.weaponAngleX, -i * i + .1 * this.senseX + n + 20 * this.animation.bounceX + this.animation.weaponAngleY, this.animation.bounceAngle + this.animation.activeBounce + this.animation.weaponAngleZ + 80 * e * a),
            this.weaponFront.setLocalEulerAngles(0, 0, n + s * s * 2),
            this.isLeft ? (this.forwardCount += 1.25 * t,
                this.movementSpeed = 1) : this.isBackward || this.isRight ? (this.forwardCount -= 1.25 * t,
                this.movementSpeed = 1) : this.isForward ? (this.forwardCount += t,
                this.movementSpeed = 1) : this.currentSpeed > .1 && (this.forwardCount += t,
                this.movementSpeed = pc.math.lerp(this.movementSpeed, 0, .1)),
            this.isShooting < this.timestamp) {
            var l = 1;
            this.isFocusing && (l = .12),
                this.isLeft ? this.directionSenseX = pc.math.lerp(this.directionSenseX, -25 * l, .07) : this.isRight && (this.directionSenseX = pc.math.lerp(this.directionSenseX, 17 * l, .07)),
                this.isBackward && (this.directionSenseZ = pc.math.lerp(this.directionSenseZ, .8, .1))
        }
        if (this.directionSenseX *= pc.settings.weaponLeaning,
            this.directionSenseZ *= pc.settings.weaponLeaning,
            this.directionSenseX = pc.math.lerp(this.directionSenseX, 0, .1),
            this.directionSenseZ = pc.math.lerp(this.directionSenseZ, 0, .05),
            this.currentSpeed = this.entity.rigidbody.linearVelocity.length(),
            this.currentFov = pc.math.lerp(customFov, h, .4),
            this.currentNonFov = pc.math.lerp(this.currentNonFov, r, .4),
            this.cameraEntity.camera.fov = this.currentFov + this.animation.fov,
            this.cameraNonFOVEntity.camera.fov = this.currentNonFov + this.animation.fov,
            this.isForward || this.isBackward || (this.movementSpeed = pc.math.lerp(this.movementSpeed, 0, .05)),
            this.isLeft || this.isRight || (this.movementSpeed = pc.math.lerp(this.movementSpeed, 0, .01)),
            this.isJumping ? this.lastHeight > this.currentHeight ? this.deltaHeight += t * this.jumpHeightSpeed : this.deltaHeight -= t * this.jumpHeightSpeed : this.deltaHeight = pc.math.lerp(this.deltaHeight, 0, .01),
            this.now() - this.lastFootDate > this.footSpeed && this.currentSpeed > 1 && this.isLanded) {
            var d = this.groundMaterial + "-Run-" + (this.footCount + 1),
                y = this.currentSpeed;
            this.entity.sound.slots[d].pitch = 1 + .1 * Math.random(),
                this.entity.sound.slots[d].volume = .2 + .2 * Math.random() + .3 * this.footForce,
                this.entity.sound.play(d),
                (this.isLeft || this.isRight || this.isBackward) && (y += 50),
                y += 20 * this.footForce,
                this.lastFootDate = this.now() - y,
                this.footForce = pc.math.lerp(this.footForce, 0, .2),
                this.footCount = Math.floor(5 * Math.random())
        }
        pc.isFinished || this.locked || "Melee" != this.currentWeapon.type && (pc.settings.hideArms || (this.interface.crosshairEntity.enabled = !this.isFocusing),
                this.interface.focusBulletsEntity.enabled = this.isFocusing),
            "Sniper" == this.currentWeapon.type ? this.now() - this.focusStartTime > 60 && (this.currentWeapon.scopeOverlay.enabled = this.isFocusing) : this.isZoomEffectEnabled
    },
    Movement.prototype.playEffortSound = function(t) {
        var i = Math.floor(1.4 * Math.random()) + 1,
            e = "Throw-" + i;
        t && (e = "Grunt-" + i),
            this.app.fire("Character:Sound", e, .1 * Math.random())
    }
                    Movement.prototype.setShakeAnimation = function(t) {

            }
          Movement.prototype.setAmmoFull = function() {
        this.currentWeapon.ammo = 100000
            this.app.fire("Overlay:SetAmmo", !0)
    }
        Movement.prototype.jump = function() {

    if (this.jumpingTime = this.timestamp + this.jumpDuration,
    this.isJumping = !0,
    this.isLanded = !1,
    this.airTime = this.now(),
    this.randomDirection = Math.random() > .5 ? -1 : 1,
    this.previousVelocity,
    this.now() - this.lastImpactTime > 3e3) {
        var t = "Jump-" + (Math.round(1 * Math.random()) + 1);
        this.app.fire("Character:Sound", t, .1 * Math.random()),
        this.entity.sound.play("Only-Jump"),
        this.entity.sound.slots["Only-Jump"].pitch = .1 * Math.random() + 1.1
    }
    if (this.dynamicGravity = 0,
    this.app.fire("Overlay:Jump", !0),
    this.player.fireNetworkEvent("j"),
    this.isShooting > this.timestamp)
        return !1;
    this.app.tween(this.animation).to({
        jumpAngle: -11
    }, .15, pc.BackOut).start()
}
};


    
})();