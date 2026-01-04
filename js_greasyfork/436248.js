// ==UserScript==
// @name         [UPDATED JUNE2022] Roblox Small Server Joiner
// @namespace    https://popcat.click
// @version      2.1
// @description  Adds a button to automatically find and join the smallest roblox server possible
// @author       https://github.com/ahmadinator
// @match        https://web.roblox.com/games/*
// @match        https://www.roblox.com/games/*
// @match        https://roblox.com/games/*
// @icon         https://www.google.com/s2/favicons?domain=roblox.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436248/%5BUPDATED%20JUNE2022%5D%20Roblox%20Small%20Server%20Joiner.user.js
// @updateURL https://update.greasyfork.org/scripts/436248/%5BUPDATED%20JUNE2022%5D%20Roblox%20Small%20Server%20Joiner.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

(function() {
    'use strict';

    let gameIdString = window.location.pathname.split('/')[2];
    let totalServersGoneThrough = 0
    let debounce = false;

    let button = document.createElement("button");
    button.classList.add("btn-secondary-md");
    button.innerText = "Join Small Server";
    let label = document.createElement("span");
    label.classList.add("text");

    function endDebounce() {
        debounce = false; button.disabled = false;
    }
    function getRoblox(nPC) {
        let limit = "&limit=100"
        if (nPC == undefined) { nPC = ""; limit = "?limit=100";}
        return fetch('https://games.roblox.com/v1/games/' + gameIdString + '/servers/Public' + nPC + limit)
                .then(res => res.json())
    }

    function join(gameInstances) { // find and join the server with least amount of players from the last page cursor
        let bestServer = 0;
        let e = 0;
        console.log("join called")
        for (let server of gameInstances.data) {
            console.log("in loop")
            e += 1;
            let serverPlayerCount = server.playing;
            let maxPlayers = server.maxPlayers;
            let serverId = server.id;

            if (bestServer == 0) {
                bestServer = [serverPlayerCount, serverId];
            }

            if (serverPlayerCount < bestServer[0]) {
                bestServer = [serverPlayerCount, serverId];
            }

            if (e == gameInstances.data.length) { // finished looping through all servers, make player join best one
                try {
                    window.Roblox.GameLauncher.joinGameInstance(parseInt(gameIdString), bestServer[1]);
                    console.log(gameIdString, bestServer)
                    alert('Found and joining server with ' + bestServer[0] + " player(s).");
                } catch (err) {
                    alert('Error while trying to join a server, please try again | ' + String(err));
                }
                totalServersGoneThrough = 0
                endDebounce()
            }
        }
    }
    // ignore spaghetti code below pls
    let outNextPageCursor;
    function round(out) {
        let serverDataExists = false;
        if (out.data != null) {
            if (out.data.length > 0) {
                serverDataExists = true
            }
        }

        if (serverDataExists) {
            outNextPageCursor = out.nextPageCursor
            totalServersGoneThrough += out.data.length
            label.innerText = "Total Servers Gone Through: " + String(totalServersGoneThrough);
        }

        if ((out.nextPageCursor == null && !serverDataExists) || (outNextPageCursor != null && serverDataExists)) {
            let cursor = "?cursor="+outNextPageCursor
            if (outNextPageCursor == undefined) { cursor = ""; }
            getRoblox(cursor).then((out2) => { round(out2); })
            return
        }

        if (outNextPageCursor == null && serverDataExists) {
            join(out);
        }
    }

    function main() {
        //alert("Finding server");
        if (debounce) {return};
        getRoblox().then((out) => { round(out); });
        debounce = true; button.disabled = true;
    }

    button.onclick = main;
    document.getElementById("game-instances").prepend(label);
    document.getElementById("game-instances").prepend(button);
})();