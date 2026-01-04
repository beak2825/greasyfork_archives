// ==UserScript==
// @name         ServerSearch
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Find roblox servers at the click of a button.
// @author       https://github.com/NotDSF
// @match        https://www.roblox.com/games/*
// @icon         https://www.google.com/s2/favicons?domain=roblox.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430402/ServerSearch.user.js
// @updateURL https://update.greasyfork.org/scripts/430402/ServerSearch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let Cookie = document.cookie.match(/rosearch=(?<json>{.*?});/);
    let Options = Cookie?.groups.json ? JSON.parse(Cookie?.groups.json) : {};
    let GameID = document.URL.match(/games\/(\d+)\//)[1];
    let GameOptions = Options[GameID] || {};

    function GetServers(Index) {
        return new Promise((resolve, reject) => {
            fetch(`https://www.roblox.com/games/getgameinstancesjson?placeId=${GameID}&startIndex=${Index}&_=1`, {
                method: "GET",
            })
            .then(res => res.text())
            .then(json => resolve(JSON.parse(json)))
            .catch(er => reject(er));
        });
    }

    function SaveOptions() {
        let Status     = document.getElementById("server-status");
        let MaxPing    = document.getElementById("ping-box").value;
        let MaxPlayers = document.getElementById("player-box").value;
        let CookieData = {};
        
        if (MaxPing.length) CookieData.MaxPing = MaxPing;
        if (MaxPlayers.length) CookieData.MaxPlayers = MaxPlayers;

        let StatusBackup = Status.innerHTML;
        
        Options[GameID] = CookieData;
        Status.innerHTML = "Saved options!";
        document.cookie = `rosearch=${JSON.stringify(Options)}; path=/games; expires=Fri, 31 Dec 9999 23:59:59 GMT;`;

        setTimeout(() => Status.innerHTML = StatusBackup, 2000);
    }

    let GameInstances = document.getElementById("game-instances");
    let ParentDiv     = document.createElement("div");
    let ContainerHead = document.createElement("div");

    ParentDiv.className = "stack";
    GameInstances.prepend(ParentDiv);

    // container header

    let Title = document.createElement("h3");
    Title.innerHTML = "ServerSearch";

    ContainerHead.className = "container-header";
    ContainerHead.prepend(Title);

    // container children

    let pingbox = document.createElement("textarea");
    pingbox.className = "dialog-input ng-valid ng-isolate-scope ng-touched ng-not-empty ng-dirty ng-valid-parse";
    pingbox.rows = 1;
    pingbox.style = "overflow: hidden; overflow-wrap: break-word; resize: none; height: 30px; margin-bottom: 5px; display: inherit; border-radius: 3px; width: 330px;";
    pingbox.placeholder = "Max Ping (Leave Blank For Default)";
    pingbox.innerHTML = GameOptions.MaxPing || "";
    pingbox.id = "ping-box";

    let maxPlayer = document.createElement("textarea");
    maxPlayer.className = "dialog-input ng-valid ng-isolate-scope ng-touched ng-not-empty ng-dirty ng-valid-parse";
    maxPlayer.rows = 1;
    maxPlayer.style = "overflow: hidden; overflow-wrap: break-word; resize: none; height: 30px; margin-bottom: 5px; display: inherit; border-radius: 3px; width: 330px;";
    maxPlayer.placeholder = "Max Players (Leave Blank For Default)";
    maxPlayer.innerHTML = GameOptions.MaxPlayers || "";
    maxPlayer.id = "player-box";
    
    let status = document.createElement("span");
    status.className = "section-content-off";
    status.id = "server-status";
    status.style = "display: inherit;";

    async function main() {
        if (!confirm("Are you sure you want to find the server?")) return;

        let Stats       = document.getElementsByClassName("game-stat game-stat-width");
        let MaxPing     = pingbox.value.length ? parseInt(pingbox.value) : 300;
        let MaxPlayers  = maxPlayer.value.length ? parseInt(maxPlayer.value) : 4;
        let MaxServerP  = parseInt(Stats[5].children[1].innerText);
        let ActiveP     = parseInt(Stats[0].children[1].innerText.replace(",", ""));
        let Iterator    = Math.floor(ActiveP / (MaxServerP * 9));
        let TimeNow     = Date.now();

        status.innerHTML = "Looking for servers...";

        while (true) {
            let Servers = await GetServers(Iterator);
            if (!Servers.Collection.length) {
                status.innerHTML = "Couldn't find any servers meeting your options, try editing your options!";
                break;
            }

            let LowerMatch = Servers.Collection.filter((server) => server.CurrentPlayers.length <= MaxPlayers && server.Ping <= MaxPing).shift();
            let ExactMatch = Servers.Collection.filter((server) => server.CurrentPlayers.length == MaxPlayers && server.Ping <= MaxPing).shift();

            if (ExactMatch) {
                status.innerHTML = `Found server! Players: ${ExactMatch.CurrentPlayers.length} Ping: ${ExactMatch.Ping} Index: ${Iterator} Took: ${(Date.now() - TimeNow) / 1000}s`;
                eval(ExactMatch.JoinScript);
                break;
            }

            if (LowerMatch) {
                status.innerHTML = `We couldn't find an exact match however we found a lower one! Players: ${LowerMatch.CurrentPlayers.length} Ping: ${LowerMatch.Ping} Index: ${Iterator} Took: ${(Date.now() - TimeNow) / 1000}s`;
                eval(LowerMatch.JoinScript);
                break;
            }

            status.innerHTML = `Index: ${Iterator}.`;
            Iterator += Math.floor(ActiveP / (MaxServerP * Servers.Collection.length));
        }
    }

    let fakeButton = document.createElement("span");
    fakeButton.className = "btn-secondary-md btn-more";
    fakeButton.innerHTML = "Find Server";
    fakeButton.onclick = main;
    fakeButton.style = "display: inherit; width: min-content; margin-bottom: 20px;";

    let fakeButton2 = document.createElement("span");
    fakeButton2.className = "btn-secondary-md btn-more";
    fakeButton2.innerHTML = "Save Options";
    fakeButton2.onclick = SaveOptions;
    fakeButton2.style = "display: inherit; width: min-content; margin-bottom: 5px;";

    ParentDiv.prepend(ContainerHead, maxPlayer, pingbox, fakeButton2, fakeButton, status);
})();
