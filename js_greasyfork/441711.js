// ==UserScript==
// @name         RoSearcher
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Find roblox servers at the click of a button.
// @author       https://github.com/NotDSF
// @match        https://*.roblox.com/games/*
// @icon         https://www.google.com/s2/favicons?domain=roblox.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441711/RoSearcher.user.js
// @updateURL https://update.greasyfork.org/scripts/441711/RoSearcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let Cookie = document.cookie.match(/rosearch=(?<json>{.*?});/);
    let Options = Cookie?.groups.json ? JSON.parse(Cookie?.groups.json) : {};
    
    let Version = "0.5";
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

    fetch("https://raw.githubusercontent.com/NotDSF/RoSearcher/main/script-version")
        .then(res => res.text())
        .then(body => {
            if (body.trim() !== Version) {
                if (confirm("A new version of RoSearch is available, would you like to download it?")) {
                    document.location.href = "https://greasyfork.org/en/scripts/430402-rosearcher";
                }
            }
        })
        .catch(er => {
            alert("RoSearcher Error: " + er.toString());
            throw er;
        });

    let GameInstances = document.getElementById("game-instances");
    let ParentDiv     = document.createElement("div");
    let ContainerHead = document.createElement("div");

    ParentDiv.className = "stack";
    GameInstances.prepend(ParentDiv);

    // container header

    let Title = document.createElement("h3");
    Title.innerHTML = "RoSearch";

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
        
        console.log(MaxPing, MaxPlayers, Iterator);
        status.innerHTML = "Looking for servers...";

        while (true) {
            let Servers = await GetServers(Iterator);
            let Matched = Servers.Collection.filter((server) => server.CurrentPlayers.length <= MaxPlayers && server.Ping <= MaxPing).shift();

            if (Matched) {
                status.innerHTML = `Found server! Players: ${Matched.CurrentPlayers.length} Ping: ${Matched.Ping} Index: ${Iterator}`;
                eval(Matched.JoinScript);
                break;
            }

            status.innerHTML = `Index: ${Iterator}.`;
            Iterator += Math.floor(ActiveP / (MaxServerP * 9));
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
