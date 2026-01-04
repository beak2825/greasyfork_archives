// ==UserScript==
// @name         ShellShock Minimal Aimbot+Lines
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  AutoAim + ESP de línies
// @author       Zert
// @match        *://shellshock.io/*
// @match        *://*.shellshockers.*/*
// @grant        none
// @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/528275/ShellShock%20Minimal%20Aimbot%2BLines.user.js
// @updateURL https://update.greasyfork.org/scripts/528275/ShellShock%20Minimal%20Aimbot%2BLines.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Config
    const CONFIG = {
        aimbot: true,
        espLines: true,
        aimKey: 'AltRight' // Tecla per activar aimbot
    };

    // Variables del joc
    let players = [];
    let myPlayer, scene;

    // Detectar elements
    const updateGameData = () => {
        try {
            scene = scene || BABYLON.Engine.LastCreatedScene;
            players = Object.values(window).filter(v => v?.actor?.mesh && v !== myPlayer);
            myPlayer = Object.values(window).find(v => v?.actor?.mesh?.parent === scene.activeCamera);
        } catch(e) { console.error(e); }
    };

    // ESP Línies
    const drawLines = () => {
        if (!CONFIG.espLines || !myPlayer) return;
        
        players.forEach(p => {
            if (!p?.actor || p === myPlayer) return;
            
            if (!p.line) {
                p.line = BABYLON.MeshBuilder.CreateLines("line", {
                    points: [myPlayer.actor.mesh.position, p.actor.mesh.position],
                    updatable: true
                }, scene);
                p.line.material = new BABYLON.StandardMaterial("lineMat", scene);
                p.line.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
            }
            
            p.line = BABYLON.MeshBuilder.CreateLines("line", {
                points: [myPlayer.actor.mesh.position, p.actor.mesh.position],
                instance: p.line
            }, scene);
        });
    };

    // AutoAim
    const autoAim = () => {
        if (!CONFIG.aimbot || !players.length) return;
        
        const closest = players.reduce((closest, p) => {
            if (!p?.actor || p === myPlayer) return closest;
            
            const dist = BABYLON.Vector3.DistanceSquared(myPlayer.actor.mesh.position, p.actor.mesh.position);
            return dist < closest.dist ? {dist, player: p} : closest;
        }, {dist: Infinity, player: null});

        if (closest.player) {
            const delta = closest.player.actor.mesh.position.subtract(myPlayer.actor.mesh.position);
            myPlayer.yaw = Math.atan2(delta.x, delta.z);
            myPlayer.pitch = -Math.atan(delta.y / Math.sqrt(delta.x**2 + delta.z**2));
        }
    };

    // Bucle principal
    setInterval(() => {
        try {
            updateGameData();
            if (CONFIG.espLines) drawLines();
            if (CONFIG.aimbot) autoAim();
        } catch(e) { console.error(e); }
    }, 50);

})();