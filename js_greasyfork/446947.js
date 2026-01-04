// ==UserScript==
// @name         [DEPRECATED] Roblox Ascending Server List
// @namespace    https://popcat.click/xqcL
// @version      1
// @description  Adds a list to the servers tab that shows servers with a low player count
// @author       https://github.com/ahmadinator
// @match        https://web.roblox.com/games/*
// @match        https://www.roblox.com/games/*
// @match        https://roblox.com/games/*
// @icon         https://www.google.com/s2/favicons?domain=roblox.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446947/%5BDEPRECATED%5D%20Roblox%20Ascending%20Server%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/446947/%5BDEPRECATED%5D%20Roblox%20Ascending%20Server%20List.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

(function() {
    'use strict';

    let gameIdString = window.location.pathname.split('/')[2];
    let totalServersGoneThrough = 0
    let MaxServersToShow = 10
    let debounce = false;
    let servers = []

    //create the list
    let div = document.createElement("div");
    div.classList.add("stack");
    let divHeader = document.createElement("div");
    divHeader.classList.add("container-header");
    div.append(divHeader);
    let headerText = document.createElement("h3");
    headerText.innerText = "Servers in ascending order";
    divHeader.append(headerText);
    let label = document.createElement("span");
    label.classList.add("text");
    let whitespace = document.createTextNode("\u00A0\u00A0\u00A0");
    divHeader.append(whitespace);

    let inputLabel = document.createElement("label");
    inputLabel.innerText = "Max Servers To Show: ";
    label.setAttribute("for", "maxServerInput");
    divHeader.append(inputLabel);
    let maxServersToShowInput = document.createElement("input");
    maxServersToShowInput.classList.add("input-field", "new-input-field");
    maxServersToShowInput.id = "maxServerInput";
    maxServersToShowInput.setAttribute("type", "number");
    maxServersToShowInput.setAttribute("value", "10");
    divHeader.append(maxServersToShowInput);

    function changed() {
        let newVal = Number(maxServersToShowInput.value)
        if (newVal != "" && Number.isInteger(newVal) && newVal != 0) { MaxServersToShow = newVal };
    }
    maxServersToShowInput.addEventListener("input", changed);

    let refreshButton = document.createElement("button");
    refreshButton.innerText = "Refresh";
    refreshButton.classList.add("btn-more", "rbx-refresh", "refresh-link-icon", "btn-control-xs", "btn-min-width");
    divHeader.append(refreshButton);
    let listUl = document.createElement("ul");
    listUl.classList.add("section", "stack-list", "rbx-game-server-item-container");
    div.append(listUl);

    function endDebounce() {
        debounce = false; refreshButton.disabled = false;
    }
    function getRoblox(nPC) {
        let limit = "&limit=100"
        if (nPC == undefined || nPC == "") { nPC = ""; limit = "?limit=100";}
        return fetch('https://games.roblox.com/v1/games/' + gameIdString + '/servers/Public' + nPC + limit)
                .then(res => res.json())
    }

    function doneGettingServers() { // find and join the server with least amount of players from the last page cursor
        let e = 0
        for (let server of servers) {
            if (e >= MaxServersToShow) { break }
            let listLi = document.createElement("li");
            listLi.classList.add("stack-row", "rbx-game-server-item");
            let leftDiv = document.createElement("div");
            leftDiv.classList.add("section-left", "rbx-game-server-details");
            listLi.append(leftDiv);
            let maxPlayersDiv = document.createElement("div");
            maxPlayersDiv.classList.add("text-info", "rbx-game-status", "rbx-game-server-status");
            maxPlayersDiv.innerText = String(server[0]) + " of " + String(server[1]) + " people max"
            leftDiv.append(maxPlayersDiv);
            let pingSpan = document.createElement("span");
            pingSpan.classList.add("text-info", "rbx-game-status", "rbx-game-server-status");
            pingSpan.innerText = " Ping: " + String(server[4])
            leftDiv.append(pingSpan);
            let fpsSpan = document.createElement("span");
            fpsSpan.classList.add("text-info", "rbx-game-status", "rbx-game-server-status");
            fpsSpan.innerText = "  FPS: " + String(server[3])
            leftDiv.append(fpsSpan);

            let playerAvatarsDiv = document.createElement("div");
            playerAvatarsDiv.classList.add("section-right", "rbx-game-server-players");
            listLi.append(playerAvatarsDiv);

             for (let i = 0; i < server[0]; i++) {
                let imgSpan = document.createElement("span"); // cant get avatars cuz of api so now just default bacon
                imgSpan.classList.add("thumbnail-2d-container", "avatar-card-image", "avatar", "avatar-headshot-sm", "player-avatar");
                playerAvatarsDiv.append(imgSpan);
                let img = document.createElement("img");
                img.setAttribute("src", "https://tr.rbxcdn.com/f3e7bddf5e667382c7247406749f5f00/150/150/AvatarHeadshot/Png");
                imgSpan.append(img);
            }

            if (server[3] < 29) { fpsSpan.style.color = "red"; } else { fpsSpan.style.color = "yellow"; }
            if (server[3] > 55) { fpsSpan.style.color = "green"; }

            if (server[4] < 100) { pingSpan.style.color = "green"; } else { pingSpan.style.color = "yellow"; }
            if (server[4] > 500) { pingSpan.style.color = "red"; }

            let joinServerButton = document.createElement("button");
            joinServerButton.classList.add("btn-full-width", "btn-control-xs", "rbx-game-server-join", "btn-primary-md", "btn-min-width");
            joinServerButton.innerText = "Join";
            leftDiv.append(joinServerButton);

            function joinServer() {
                try {
                    window.Roblox.GameLauncher.joinGameInstance(parseInt(gameIdString), server[2]);
                } catch (err) {
                    alert('Error while trying to join the server, please try again | ' + String(err));
                }
            }
            joinServerButton.onclick = joinServer;

            endDebounce();
            listUl.append(listLi);
            e += 1;
        }
    }
    // ignore spaghetti
    let outNextPageCursor;
    function round(out) {
        let serverDataExists = false;
        if (out.data != null) {
            if (out.data.length > 0) {
                serverDataExists = true;
            }
        }

        if (serverDataExists) {
            outNextPageCursor = out.nextPageCursor;

            for (let server of out.data) {
                if (server.playing != undefined) {
                    servers.unshift([server.playing, server.maxPlayers, server.id, Math.round(server.fps), server.ping]);
                }
            }

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
            doneGettingServers(); // done getting servers, now create elements
        }
    }

    function main() {
        //alert("Fetching servers");
        if (debounce) {return;}
        listUl.textContent = "";
        servers = []
        totalServersGoneThrough = 0
        getRoblox().then((out) => { round(out); });
        debounce = true; refreshButton.disabled = true;
    }

    refreshButton.onclick = main;
    document.getElementById("game-instances").prepend(div);
    document.getElementById("game-instances").prepend(label);
})();