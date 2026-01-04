// ==UserScript==
// @name         Krunker Stuffed Up Example
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Skid Lamer
// @match        *://krunker.io/*
// @run-at       document-start
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/398759/Krunker%20Stuffed%20Up%20Example.user.js
// @updateURL https://update.greasyfork.org/scripts/398759/Krunker%20Stuffed%20Up%20Example.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let defined =object =>void 0!==object&&object;
    let wait = setInterval(_ => {
        let world = window.gg; // WTF krunker why is this now a window global? - you fucking idiots
        if (defined(world)) {
            if (defined(world.update)) {
                const update_orig = world.update;
                world.update = function() {
                    let rv = update_orig.apply(this, arguments);

                    for (let i=0; i < this.players.list.length; ++i) {
                        const player = this.players.list[i];
                        if (player && player.active) {
                            if (player.renderYou) {//you are the player

                                if (player.armMeshes.length) {
                                    const mesh = player.armMeshes[0];
                                    const material = mesh.material;
                                    material.alphaTest = 1;
                                    material.depthTest = false;
                                    material.fog = false;
                                    material.emissive.r = 1;
                                    //material.emissive.g = 1;
                                    material.emissive.b = 1;
                                    material.wireframe = true;
                                }

                            }
                            else {
                                //player.upperBody.renderOrder = 1;
                                //player.lowerBody.renderOrder = 1;
                            }
                        }
                    }

                    return rv;
                }
                clearInterval(wait);
            }
        }
    }, 100);
})();