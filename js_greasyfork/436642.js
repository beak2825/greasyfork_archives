// ==UserScript==
// @name         Survivio Aimbot
// @version      1.0.1
// @icon         https://raw.githubusercontent.com/iBLiSSIN/SurvivMods/main/icons/icon-v1.png
// @description  testing 
// @author      vnbpm
// @license MIT
// @match        *://surviv.io/*
// @match        *://surviv2.io/*
// @match        *://2dbattleroyale.com/*
// @match        *://2dbattleroyale.org/*
// @match        *://piearesquared.info/*
// @match        *://thecircleisclosing.com/*
// @match        *://archimedesofsyracuse.info/*
// @match        *://secantsecant.com/*
// @match        *://parmainitiative.com/*
// @match        *://nevelskoygroup.com/*
// @match        *://kugahi.com/*
// @match        *://chandlertallowmd.com/*
// @match        *://ot38.club/*
// @match        *://kugaheavyindustry.com/*
// @match        *://drchandlertallow.com/*
// @match        *://rarepotato.com/*
// @grant        none
// @namespace https://greasyfork.org/users/703117
// @downloadURL https://update.greasyfork.org/scripts/436642/Survivio%20Aimbot.user.js
// @updateURL https://update.greasyfork.org/scripts/436642/Survivio%20Aimbot.meta.js
// ==/UserScript==
                unsafeWindow.VengeTard = {kill: true, esp: true};
                unsafeWindow.VengeTard.tick = function() {
                    if (unsafeWindow.VengeTard.kill) {
                        var closest;
                        var rec;
 
                        var players = players;
                        for (var i = 0; i < players.length; i++) {
                            var target = players[i];
                            var t = unsafeWindow.VengeTard.movement.entity.getPosition();
                            let calcDist = Math.sqrt( (target.position.y-t.y)**2 + (target.position.x-t.x)**2 + (target.position.z-t.z)**2 );
                            if (calcDist < rec || !rec) {
                                closest = target;
                                rec = calcDist;
                            }
                        }
 
                        // if (window.closestp) hack(); "iMpRoved ANTiChEat"
                        unsafeWindow.closestp = closest;
                        let rayCastList = pc.app.systems.rigidbody.raycastAll(unsafeWindow.VengeTard.movement.entity.getPosition(), closestp.getPosition()).map(x=>x.entity.tags._list.toString())
                        let rayCastCheck = rayCastList.length === 1 && rayCastList[0] === "Player";
                        if (closest && rayCastCheck) {
                            t = unsafeWindow.VengeTard.movement.entity.getPosition()
                                , e = Utils.lookAt(closest.position.x, closest.position.z, t.x, t.z);
 
                            // Oh fuck oh shit they found Math.random we're fucked
                            unsafeWindow.VengeTard.movement.lookX = e * 57.29577951308232 + Math.random()/10 - Math.random()/10;
                            unsafeWindow.VengeTard.movement.lookY = -1 * (getXDire(closest.position.x, closest.position.y, closest.position.z, t.x, t.y+0.9, t.z)) * 57.29577951308232;
                            unsafeWindow.VengeTard.movement.leftMouse = true;
                            unsafeWindow.VengeTard.movement.setShooting(unsafeWindow.VengeTard.movement.lastDelta);
                        } else {
                           unsafeWindow.VengeTard.movement.leftMouse = false;
                        }
                    }
                };
 
                (async() => {
                    while(!unsafeWindow.hasOwnProperty("Movement"))
                        await new Promise(resolve => setTimeout(resolve, 1000));
 
                    var updateHooked = false;
                    const update = Movement.prototype.update;
                    Movement.prototype.update = function (t) {
                        if (!updateHooked) {
                            unsafeWindow.VengeTard.movement = this;
                            updateHooked = true;
                        }
                        unsafeWindow.VengeTard.tick();
                        update.apply(this, [t]);
 
                    };
                })();