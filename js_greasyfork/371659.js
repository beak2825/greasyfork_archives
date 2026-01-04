// ==UserScript==
// @name         PS Friends List Commands
// @namespace    https://greasyfork.org/
// @version      0.9f
// @description  Add commands to have a friends list on Pokemon Showdown!
// @author       tmagicturtle
// @match        https://play.pokemonshowdown.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371659/PS%20Friends%20List%20Commands.user.js
// @updateURL https://update.greasyfork.org/scripts/371659/PS%20Friends%20List%20Commands.meta.js
// ==/UserScript==

(function() {
    'use strict';
    app.proxysend = app.send;
    app.send = function(data, room) {

        if(data=="/getfriends"){
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/action.php?act=getfriends", true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send();
            xhr.onload = function() {
                var results = this.responseText.substr(1);
                if (results.length === 0) { app.rooms[room].add("You don't have any friends. How sad."); } else {
                    app.rooms[room].add("Your friends: " + results);
                }
            };
            return;
        }

        if(data.startsWith("/addfriend")){
            if ((data=="/addfriend") || (data.length>30)){
                app.rooms[room].add("Usage: /addfriend [username]");
                return;
            }
            var username = data.substr(11);
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/action.php?act=addfriend", true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send("player="+username);
            xhr.onload = function() {
                var results = this.responseText;
                // If successful:
                if (results.startsWith("]")) {
                    results = results.substr(1);
                    if(results.includes("accepted")) {
                        app.send("/pm ladymonita, .mail "+username+", I accepted your friend request.");
                    } else {
                        app.send("/pm ladymonita, .mail "+username+", I sent you a friend request! If you want to accept, (1) install this userscript: https://greasyfork.org/en/scripts/371659-ps-friends-list-commands (2) refresh Showdown, then (3) send the command /addfriend "+app.user.attributes.userid);
                    }
                }
                app.rooms[room].add(results);
            };
            return;
        }

        if(data.startsWith("/removefriend")){
            if ((data=="/removefriend") || (data.length>33)){
                app.rooms[room].add("Usage: /removefriend [username]");
                return;
            }
            var username = data.substr(14);
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/action.php?act=removefriend", true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send("player="+username);
            xhr.onload = function() {
                var results = this.responseText;
                // If successful:
                if (results.startsWith("]")) {
                    results = results.substr(1);
                }
                app.rooms[room].add(results);
            };
            return;
        }

        app.proxysend(data, room);
    };
})();