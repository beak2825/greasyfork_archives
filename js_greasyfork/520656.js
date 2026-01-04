// ==UserScript==
// @name         Haxball headless 30 players
// @namespace    http://tampermonkey.net/
// @version      2024-12-13.1
// @description  create 30 player haxball lobby
// @author       You
// @match        https://www.haxball.com/headless
// @icon         https://www.google.com/s2/favicons?sz=64&domain=haxball.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520656/Haxball%20headless%2030%20players.user.js
// @updateURL https://update.greasyfork.org/scripts/520656/Haxball%20headless%2030%20players.meta.js
// ==/UserScript==


(function() {
    'use strict';
    window.onHBLoaded = ()=>{
        let HBInit = window.HBInit;
        var room = HBInit({
            roomName: "peter griffin",
            maxPlayers: 30,
            noPlayer: true,
            password:"password",
            // Remove host player (recommended!)
        });
        room.setDefaultStadium("Big");
        room.setScoreLimit(5);
        room.setTimeLimit(0);
        function updateAdmins() {
            // Get all players
            var players = room.getPlayerList();
            if ( players.length == 0 ) return; // No players left, do nothing.
            if ( players.find((player) => player.admin) != null ) return; // There's an admin left so do nothing.
            room.setPlayerAdmin(players[0].id, true); // Give admin to the first non admin player in the list
        }


        room.onPlayerJoin = function(player) {
            room.sendChat("Hey lois");
            updateAdmins();

        }
        room.onPlayerLeave = function(player) {
            updateAdmins();
        }
    }

    // Your code here...
})();