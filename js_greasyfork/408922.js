// ==UserScript==
// @name         Jak pal miniroyal
// @version      6.9
// @author       Marquinhos
// @match        *://miniroyale2.io/*
// @description MiniRoyale2 jak
// @namespace https://greasyfork.org/users/679145
// @downloadURL https://update.greasyfork.org/scripts/408922/Jak%20pal%20miniroyal.user.js
// @updateURL https://update.greasyfork.org/scripts/408922/Jak%20pal%20miniroyal.meta.js
// ==/UserScript==
(function() {
   'use strict';
   var settings = {};
   settings.aimbot = true;
   settings.esp = true;
   var utilities = {};
   utilities.getEntityByName = function(name) {
      return Object.values(pc.app._entityIndex).find(entity => {
         return entity.name == name
      });
   }
   utilities.getEntitiesByName = function(name) {
      return Object.values(pc.app._entityIndex).filter(entity => {
         return entity.name == name
      });
   }
   utilities.getEntityByProperty = function(property, value) {
      return Object.values(pc.app._entityIndex).find(entity => {
         return entity[property] == value
      });
   }
   utilities.getEntitiesByProperty = function(property, value) {
      return Object.values(pc.app._entityIndex).filter(entity => {
         return entity[property] == value
      });
   }
   utilities.dist3d = function(v1, v2) {
      var dx = v1.x - v2.x;
      var dy = v1.y - v2.y;
      var dz = v1.z - v2.z;
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
   }
   const tick = function() {
      try {
         if (typeof Profile == "function") {
            Profile.prototype.getSkins = function() {
               this.setSkins({
                  "success": true,
                  "skins": [{
                     "name": "Biker",
                     "quantity": 9999
                  }, {
                     "name": "BusinessMan",
                     "quantity": 9999
                  }, {
                     "name": "Criminal",
                     "quantity": 9999
                  }, {
                     "name": "Hazmat",
                     "quantity": 9999
                  }, {
                     "name": "Homeless",
                     "quantity": 9999
                  }, {
                     "name": "Hunter",
                     "quantity": 9999
                  }, {
                     "name": "Islander",
                     "quantity": 9999
                  }, {
                     "name": "RiotCop",
                     "quantity": 9999
                  }, {
                     "name": "Sheriff",
                     "quantity": 9999
                  }, {
                     "name": "Soldier",
                     "quantity": 9999
                  }]
               });
            }
         }
         var me = utilities.getEntityByName("Player");
         var movement = me.script.movement;
         var weapon = movement.currentWeaponDetails;
         var enemies = Object.values(pc.app._entityIndex).filter(entity => {
            return entity.name == "Enemy" && entity.script.enemy.username && entity.team !== me.script.movement.team
         });
         if (me) {
            if (typeof Chat == "function") {
               Chat.prototype.sendMessage = function() {
                  try {
                     if (!this.entity.enabled) return !1;
                     var t = this.chatInput.script.input.getValue();
                     var args = t.split(" ");
                     if (args[0] == "/tp") {
                        if (usernames.includes(args[1].toLowerCase()) && !args[2]) {
                           me.rigidbody.teleport(enemies.find(e => e.script.enemy.username.toLowerCase() == args[1].toLowerCase()).position);
                           this.addMessage("Teleport", args[1]);
                           this.chatInput.script.input.setValue("")
                           return !1;
                        }
                        if (args[1] && args[2] && args[3]) {
                           me.rigidbody.teleport(args[1], args[2], args[3]);
                           this.addMessage("Teleport", `${args[1]}, ${args[2]}, ${args[3]}`);
                           this.chatInput.script.input.setValue("")
                           return !1;
                        }
                     }
                     if (args[0] == "/aimbot") {
                        settings.aimbot = !settings.aimbot;
                        this.addMessage("Aimbot", settings.aimbot);
                        this.chatInput.script.input.setValue("")
                        return !1;
                     }
                     if (args[0] == "/esp") {
                        settings.esp = !settings.esp;
                        this.addMessage("ESP", settings.esp);
                        this.chatInput.script.input.setValue("")
                        return !1;
                     }
                     if (args[0] == "/nuke" && enemies) {
                        enemies.forEach(enemy => {
                           var p = enemy.position;
                           pc.controls.network.setExplosion(p.x, p.y, p.z);
                        });
                        this.addMessage("Nuke", "Boom !");
                        this.chatInput.script.input.setValue("")
                        return !1;
                     }
                     t && (this.app.fire("Event:SendChat", t), this.chatInput.script.input.setValue(""))
                  } catch (e) {}
               }
            }
            if (typeof PlayerNames == "function") {
               PlayerNames.prototype.isVisible = function() {
                  return false;
               }
            }
         }
         if (movement) {
            movement.jump = function() {
               this.disablePeek(), this.isCrouching = !1, this.isJumping = 2, this.app.tween(this.animation).to({
                  jumpAngle: -11
               }, .15, pc.BackOut).start(), this.isLanded = !1, this.airTime = Date.now(), this.jumpingTime = this.fullTimestamp + this.jumpDuration, this.dynamicGravity = 0;
               var i = Math.floor(this.timestamp % 2) + 1;
               this.entity.sound.play("Jump-" + i)
            }
            movement.setMovement = function() {
               if (!this.isMovementAllowed()) return !1;
               var s = this.cameraEntity.forward,
                  t = this.cameraEntity.right;
               this.allForce.x = 0, this.allForce.z = 0;
               var i = 0,
                  e = 0,
                  h = !1,
                  r = !1;
               if (this.wasReleased("W") && (this.forwardCount = 0, this.leftCount = 0, this.entity.sound.stop("HeavyBreath")), (this.wasReleased("A") || this.wasReleased("D")) && (this.leftCount = 0), this.isPressed("Z") && (this.isFocusing = !0, this.shootingTime = -1), this.wasReleased("Z") && (this.isFocusing = !1), this.jumpingTime + this.jumpLandTime < this.fullTimestamp && (this.isForward = !1, this.isBackward = !1, this.isLeft = !1, this.isRight = !1), (this.isPressed("W") && !this.inControl || this.keyboard.up) && (this.isForward = !0), (this.isPressed("A") && !this.inControl || this.keyboard.left) && (this.isLeft = !0), (this.isPressed("D") && !this.inControl || this.keyboard.right) && (this.isRight = !0), (this.isPressed("S") && !this.inControl || this.keyboard.down) && (this.isBackward = !0), this.isForward && (i += s.x, e += s.z, h = !0, r = !0, this.isCrouching ? this.forwardCount += .5 : this.forwardCount++), this.isLeft && (i -= t.x, e -= t.z, h = !0, this.leftCount++), this.isRight && (i += t.x, e += t.z, h = !0, this.leftCount--), this.isBackward && (i -= s.x, e -= s.z, h = !0, this.isCrouching ? this.forwardCount -= .5 : this.forwardCount--), this.inControl ? (this.keyboard.shift && (this.isShifting = !0, this.isCrouching = !1, this.isFocusing = !1, this.disablePeek()), this.keyboard.jump && this.jump(), this.keyboard.reload && this.reload(), this.keyboard.peek_left ? this.isPeekingLeft = !0 : this.isPeekingLeft = !1, this.keyboard.peek_right ? this.isPeekingRight = !0 : this.isPeekingRight = !1, this.keyboard.crouch ? this.isCrouching = !0 : this.isCrouching = !1) : (this.wasPressed("SHIFT") && (this.isShifting = !0, this.isCrouching = !1, this.isFocusing = !1, this.disablePeek()), this.wasReleased("SHIFT") && (this.isShifting = !1), this.wasPressed("R") && this.reload(), this.isPressed("SPACE") && this.jump(), this.wasPressed("C") && this.crouch(), this.wasPressed("X") && "battle-royale" == pc.currentMode && this.useNeedle(), this.wasPressed("Q") && (this.isPeekingLeft = !0, this.peekLeft()), this.wasReleased("Q") && (this.isPeekingLeft = !1), this.wasPressed("E") && (this.isPeekingRight = !0, this.peekRight()), this.wasReleased("E") && (this.isPeekingRight = !1), this.wasReleased("F") && (this.doRaycast(!0), this.doAction()), this.wasReleased("V"), !this.isThrowingStarted && this.isShooting && "Grenade" == this.currentWeaponDetails.type && this.startThrowing(), this.isThrowingStarted && !this.isShooting && "Grenade" == this.currentWeaponDetails.type && this.throwGrenade(), this.wasPressed("1") && this.setWeapon(this.inventory.getItemByIndex(1)), this.wasPressed("2") && this.setWeapon(this.inventory.getItemByIndex(2)), this.wasPressed("3") && this.setWeapon(this.inventory.getItemByIndex(3)), this.wasPressed("4") && this.setWeapon(this.inventory.getItemByIndex(4)), this.wasPressed("5") && this.setWeapon(this.inventory.getItemByIndex(5)), this.wasPressed("TAB") && "capture-the-flag" == pc.currentMode && (this.isInBase ? this.interface.toggleBuyMenu() : this.interface.showAlert("You can only select weapons in-base.", "error", "flag"))), 0 !== i && 0 !== e) {
                  var n = this.power;
                  this.isCrouching && (n *= .4), this.isFocusing && (n *= .8), "Handgun" == this.attachment.type && (n *= 1.2), this.isShifting || (n *= 1.35), this.isJumping > 0 && (n *= 1.05), this.currentSpeed = n / this.animationSpeed;
                  var a = this.lastCurrentPower;
                  h && this.height < 1.5 && (this.forceX = i, this.forceZ = e, this.lastCurrentPower = n), r || (a *= .7, this.currentSpeed = .7 * this.currentSpeed), this.isVaccinate > 0 && (a *= .6), this.currentHealth < 60 && (a *= .95), this.currentDate - this.lastDamageTime < 1e3 && (a *= .85), this.currentDate - this.lastShootTime < 300 && (a *= .5);
                  var o = this.currentSpeed * this.vibrationFactor;
                  this.isFocusing || this.isCrouching ? this.runVibration = 0 : this.runVibration = .2 * Math.cos(this.timestamp / o), this.runVibration = pc.math.lerp(this.runVibration, 0, .05), this.force.set(this.forceX, 0, this.forceZ).normalize().scale(a), this.allForce.x = this.force.x, this.allForce.z = this.force.z, this.currentVibration++
               } else this.currentSpeed = 0;
               h || (this.currentSpeed = 0), this.forwardCount > 300 && this.currentSpeed >= .5 && (this.entity.sound.slot("HeavyBreath").isPlaying || this.entity.sound.play("HeavyBreath")), this.currentVelocity = this.entity.rigidbody.linearVelocity.length(), this.checkRescueMode(), this.setCrosshair(this.currentSpeed)
            };
         }
         if (weapon) {
            weapon.currentAmmo = Infinity;
            weapon.spread = 0;
            weapon.automatic = true;
            weapon.shootRate = 0;
            weapon.recoil = 0;
         }
         if (enemies) {
            var usernames = [];
            let i = 0;
            enemies.forEach(enemy => {
               usernames.push(enemy.script.enemy.username.toLowerCase());
               if (enemy.script.enemy.isDeath) enemies.splice(i, 1);
               if (settings.esp && !enemy.script.enemy.isDeath) {
                  let start = new pc.Vec3(enemy.position.x, enemy.position.y, enemy.position.z);
                  let end = new pc.Vec3(me.position.x, me.position.y, me.position.z);
                  let color = new pc.Color(1, 0, 0);
                  pc.app.renderLine(start, end, color);
                  enemy.children[2].enabled = true;
                  enemy.children[2].model.material.depthTest = false;
                  enemy.children[2].model.material._opacity = 0.5;
               } else {
                  enemy.children[2].enabled = false;
               }
               enemy.children[2].model.material.update();
               enemy.distance = utilities.dist3d(me.position, enemy.position);
               i++;
            });
            enemies.sort((a, b) => (a.distance > b.distance) ? 1 : -1);
            movement.fireBullet = function() {
               var t, p;
               if (enemies[0] && settings.aimbot) {
                  p = enemies[0].position;
                  p.y += 0.6;
                  t = p;
               } else {
                  t = this.raycast.to
               }
               var e = this.currentWeaponDetails.spread,
                  i = .8 * this.currentWeaponDetails.damage + Math.random() * this.currentWeaponDetails.damage;
               i = Math.min(i, this.currentWeaponDetails.damage),
                  i = Math.floor(i),
                  this.currentWeaponDetails.bigScope && !this.isFocusing ? (t.x += 60 * Math.random() - 60 * Math.random(), t.y += 60 * Math.random() - 60 * Math.random(), t.z += 60 * Math.random() - 60 * Math.random()) : this.currentWeaponDetails.isShotgun ? (t.x += (40 * Math.random() - 40 * Math.random()) * e, t.y += (40 * Math.random() - 40 * Math.random()) * e, t.z += (40 * Math.random() - 40 * Math.random()) * e) : this.isFocusing ? (t.x += (1 * this.currentRecoilForce * Math.random() - 1 * this.currentRecoilForce * Math.random()) * e, t.y += (1 * this.currentRecoilForce * Math.random() - 1 * this.currentRecoilForce * Math.random()) * e, t.z += (1 * this.currentRecoilForce * Math.random() - 1 * this.currentRecoilForce * Math.random()) * e) : (t.x += (10 * this.currentRecoilForce * Math.random() - 10 * this.currentRecoilForce * Math.random()) * e, t.y += (10 * this.currentRecoilForce * Math.random() - 10 * this.currentRecoilForce * Math.random()) * e, t.z += (10 * this.currentRecoilForce * Math.random() - 10 * this.currentRecoilForce * Math.random()) * e),
                  this.app.fire("Bullet:Fire", this.hash, this.raycast.muzzle, t, this.raycast.muzzle, i),
                  this.shotgunBullets--
            }
         }
         if (typeof Network == "function") {
            Network.prototype.kicked = function(t) {
               t.length > 0 && (alert("You have been kicked, but ɹaɹoldxa ʇauɹaʇu!'s mod saved you ;) !"))
            }
         }
      } catch (e) {}
      window.requestAnimationFrame(tick);
   }
   window.requestAnimationFrame(tick);
})();
