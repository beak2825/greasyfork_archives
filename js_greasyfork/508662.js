// ==UserScript==
// @name         Cryzen cheat
// @namespace    http://tampermonkey.net/
// @version      2024-09-15
// @description  You cheatr!!
// @author       You
// @match        https://cryzen.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cryzen.io
// @grant        none
// @licence      Mit
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/508662/Cryzen%20cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/508662/Cryzen%20cheat.meta.js
// ==/UserScript==

Object.defineProperty(Object.prototype, 'gameState', {
    set(val) {
        window._debugWorld = val;

        var Check = setInterval(() => {
            if (window._debugWorld.gameWorld && window._debugWorld.gameWorld.server && !window.Dawg) {
                clearInterval(Check);
                window.Dawg = {
                    settings: {
                        // Combat
                        RapidFire: false,
                        RapidFireRate: 0,
                        NoReload: true,
                        // Visuals
                        Chams: true
                    },
                    game: window._debugWorld.gameWorld,
                    math: {
                        getDirection2D(x1, y1, x2, y2) {
                            return Math.atan2(y1 - y2, x1 - x2);
                        },
                        getDistance3D(x1, y1, z1, x2, y2, z2) {
                            const deltaX = x1 - x2;
                            const deltaY = y1 - y2;
                            const deltaZ = z1 - z2;
                            return Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
                        },
                        calcXRotation(x1, y1, z1, x2, y2, z2) {
                            const height = Math.abs(y1 - y2);
                            const distance = this.getDistance3D(x1, y1, z1, x2, y2, z2);
                            return Math.asin(height / distance) * (y1 > y2 ? -1 : 1);
                        },
                    },
                };

                // Get all players
                Dawg.GetAllPlayers = () => {
                    const Players = window._debugWorld.gameWorld.server.players;
                    const Results = [];
                    Object.keys(Players).forEach((Player) => {
                        Results.push(Players[Player]);
                    })

                    return Results;
                }

                var Update = setInterval(() => {
                    // Chams
                    Dawg.GetAllPlayers().forEach((Player) => {
                        const PlayerMesh = Player.model.children[0].children[0];
                        PlayerMesh.material.depthTest = !Dawg.settings.Chams;
                        PlayerMesh.material.transparent = Dawg.settings.Chams;
                    })

                    // Rapid Fire
                    if (Dawg.settings.RapidFire) {
                        if (window._debugWorld.gameWorld.player && window._debugWorld.gameWorld.player.shooter && window._debugWorld.gameWorld.player.shooter.currPlayerWeapon && window._debugWorld.gameWorld.player.shooter.currPlayerWeapon.lastShootFireRateMs)
                            window._debugWorld.gameWorld.player.shooter.currPlayerWeapon.lastShootFirerateMs = Dawg.settings.RapidFireRate;
                    }

                    // No Reload
                    if (Dawg.settings.NoReload) {
                        if (window._debugWorld.gameWorld.player && window._debugWorld.gameWorld.player.shooter && window._debugWorld.gameWorld.player.shooter.currPlayerWeapon)
                            window._debugWorld.gameWorld.player.shooter.currPlayerWeapon.currAmmo = 37;
                    }
                })
            }
        })
    },
    get() {
        return window._debugWorld;
    }
})