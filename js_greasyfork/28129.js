// ==UserScript==
// @name         Karnage NoAim
// @namespace    Karnage
// @version      1.0
// @description  An aimbot for Varnage.io (Use at your own discretion)
// @author       dannytech
// @match        http://vertix.io/*
// @grant        none
// ==/UserScript==

// You are 100% responsible if you get caught using this script, so don't try to go after me.

(function() {
    'use strict';

    // Common variables
    var targetId;
    var mouse;
    var isOn = !window.localStorage.getItem("aimbot");
    console.log("NoAim is", isOn ? "on" : "off");

    // Add our listener
    window.addEventListener("mousemove", function(values) {
        mouse = {
            x: values.clientX,
            y: values.clientY
        };
        // console.log((mouse.x / window.innerWidth) * 2 - 1, (mouse.y / window.innerHeight) * 2 - 1); // 0 is center
    });

    // Patch the listener so nothing else can be added
    const addListener = window.addEventListener;
    var mouseMove;
    window.addEventListener = function(type, listener) {
        if(type !== "mousemove") addListener(type, listener);
        else mouseMove = listener;
    };

    // Add toggles for features
    window.addEventListener("keypress", function(keypress) {
        // If the toggle key was pressed
        if(keypress.which === 66) { // B
        window.localStorage.setItem("aimbot", !window.localStorage.getItem("aimbot"));
            if(!window.localStorage.getItem("aimbot")) { // It is now enabled
                window.removeEventListener("mousemove", mouseMove);
                console.log("NoAim on");
            } else { // It is now disabled
                addListener("mousemove", mouseMove);
                console.log("NoAim off");
            }
        }
    });

    setInterval(function() {
        // Aimbot disabled
        if(!isOn) return;

        // If the game is loaded and the user is in a lobby
        if(player && players.length > 0) {
            // Find the mouse position in game values
            var mousex = ((player.viewDist / window.innerWidth) * mouse.x) + player.x;
            var mousez = ((player.viewDist / window.innerHeight) * mouse.y) + player.z;

            // Find the positions of every other player, and how far away they are
            var otherPlayers = [];
            players.forEach(function(curPlayer) {
                // If the player isn't us, isn't on our team, and is alive, add them
                if(curPlayer.sid !== player.sid && curPlayer.alive && (curPlayer.team === null || curPlayer.team != player.team)) {
                    otherPlayers.push({
                        // dist: Math.sqrt(Math.pow(Math.abs(mousex - curPlayer.x), 2) + (Math.abs(mousez - curPlayer.z), 2)), // We calculate the distance away they are (the hypotenuse) using the pythagorean theorem
                        dist: Math.abs(player.x - curPlayer.x) + Math.abs(player.z - curPlayer.z),
                        x: curPlayer.x,
                        z: curPlayer.z,
                        name: curPlayer.name,
                        sid: curPlayer.sid
                    });
                }
            });

            // Find out which player is closest
            otherPlayers.sort(function(player1, player2) {
                if(player1.dist < player2.dist) return -1;
                else if(player1.dist > player2.dist) return 1;
                else if(player1.dist == player2.dist) return 0;
            });
            var targetPlayer = otherPlayers[0];
            if(targetPlayer) {
                // Set the current target
                if(targetId != targetPlayer.sid) {
                    console.log("Targeting", targetPlayer.name);
                    targetId = targetPlayer.sid;
                }

                // Aim
                MOUSE_X = (targetPlayer.x - player.x) / player.viewDist;
                MOUSE_Y = (targetPlayer.z - player.z) / player.viewDist;
            }
        }
    }, 5);
})();