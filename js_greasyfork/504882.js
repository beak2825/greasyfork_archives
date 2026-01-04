// ==UserScript==
// @name         Anti Projectile.
// @namespace    https://sandbox.moomoo.io/
// @version      v1.5
// @description  Anti bow insta && Anti projectile sync.
// @author       Bianos Sozinho, Discord: istisna.bianos
// @match        *://*.moomoo.io/*
// @require      https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @icon         https://moomoo.io/img/favicon.png?v=1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504882/Anti%20Projectile.user.js
// @updateURL https://update.greasyfork.org/scripts/504882/Anti%20Projectile.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let msgpack_lite = window.msgpack, possibleBowInsta = false, enemy, enemyangle, moving = false, ownPlayer = {}, projectiles = [], packetLimitazition = {max: 120, count: 0}, mill, socket, mouseX, mouseY, mouseAngle, height, width, resize, OriginalWebSocket = window.WebSocket;
    window.WebSocket = function(...args) {
        socket = new OriginalWebSocket(...args);
        socket.addEventListener('message', (event) => {
            let decoded = msgpack_lite.decode(new Uint8Array(event.data));
            let hooked;
            if (decoded.length > 1 && Array.isArray(decoded[1])) {
                hooked = [decoded[0], ...decoded[1]];
            } else {
                hooked = decoded
            }

            if(hooked[0] === "io-init") {
                let cvs = document.getElementById("gameCanvas");
                width = cvs.clientWidth;
                height = cvs.clientHeight;
                $(window).resize(function() {
                    width = cvs.clientWidth;
                    height = cvs.clientHeight;
                });
                resize = function() {
                    width = cvs.clientWidth;
                    height = cvs.clientHeight;
                }
                cvs.addEventListener("mousemove", e => {
                    mouseX = e.clientX;
                    mouseY = e.clientY;
                    mouseAngle = Math.atan2(mouseY - (height / 2), mouseX - (width / 2));
                });
            }
            if(hooked[0] == "C") {
                if(ownPlayer.sid == null || ownPlayer.sid == undefined) {
                    ownPlayer.sid = hooked[1];
                }
            }
            if (hooked[0] == "a") {
                enemy = [];
                if(!possibleBowInsta) projectiles = [];
                for (let i = 0; i < hooked[1].length / 13; i++) {
                    let playerInfo = hooked[1].slice(13 * i, 13 * i + 13);
                    if (playerInfo[0] == ownPlayer.sid) {
                        ownPlayer.x = playerInfo[1];
                        ownPlayer.y = playerInfo[2];
                        ownPlayer.weaponIndex = playerInfo[5];
                    } else if(playerInfo[7] != ownPlayer.team || playerInfo[7] === null) {
                        enemy.push(playerInfo);
                    }
                }
                if(enemy) {
                    let nearEnemy = enemy.sort((a, b) => Math.sqrt(Math.pow((ownPlayer.y - a[2]), 2) + Math.pow((ownPlayer.x - a[1]), 2)) - Math.sqrt(Math.pow((ownPlayer.y - b[2]), 2) + Math.pow((ownPlayer.x - b[1]), 2)))[0];
                    if(nearEnemy) enemyangle = Math.atan2(nearEnemy[2] - ownPlayer.y, nearEnemy[1] - ownPlayer.x);
                }
                if(moving && !possibleBowInsta) {
                    setTimeout(() => {
                        sendMessage("a", null);
                        moving = false;
                    }, 300);
                }
            }
            if (hooked[0] == "X") {
                projectiles.push({sid: hooked[8], x: hooked[1], y: hooked[2], type: hooked[6]});
                let choosedProjectiles = [0, 2, 5];
                let filteredProjectiles = projectiles.filter(proj => choosedProjectiles.includes(proj.type));
                if(filteredProjectiles[0].type == 0) {
                    possibleBowInsta = true;
                }
                let musket = filteredProjectiles.some(proj => proj.type == 2 && filteredProjectiles.length >= 2);
                if(musket) {
                    sendMessage("6", "ranged sync homo");
                    place(mill, enemyangle);
                }
                let hasType2 = filteredProjectiles.some(proj => proj.type == 2);
                if(filteredProjectiles.length >= 2 && hasType2 && ![9, 12].includes(ownPlayer.weaponIndex)) {
                    place(mill, enemyangle);
                    sendMessage("a", enemyangle + 35);
                    sendMessage("6", "ranged insta homo");
                    moving = true;
                    possibleBowInsta = false;
                }
            }

            update();
        });
        return socket;
    };
    let sendMessage = (function(type, ...args) {
        if (packetLimitazition.count < packetLimitazition.max) {
            const message = [type, args];
            const encodedMessage = msgpack_lite.encode(message);
            const byteArray = new Uint8Array(encodedMessage);
            socket.send(byteArray);
            packetLimitazition.count++;
        }
    });
    function place(id, rad) {
        sendMessage("G", id, null);
        sendMessage("d", 1, rad);
        sendMessage("d", 0, rad);
    };

    function isElementVisible(e) {
        return (e.offsetParent !== null);
    }
    function update() {
        for (let i=26;i<29;i++){
            if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
                mill = i - 16;
            }
        }
    }
})();