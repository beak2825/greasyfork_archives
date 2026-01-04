// ==UserScript==
// @name              [Diep.io] Lobby Crowdsourcing Script
// @namespace    http://tampermonkey.net/
// @version           4830483
// @description     Script to help my Discord bot Angel on displaying lobbies.
// @author             _Vap
// @match             *://diep.io/*
// @run-at            document-idle
// @icon               data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license          dont copy
// @grant             none
// @downloadURL https://update.greasyfork.org/scripts/485004/%5BDiepio%5D%20Lobby%20Crowdsourcing%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/485004/%5BDiepio%5D%20Lobby%20Crowdsourcing%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var lastUpdate = 0;
    var lastWS = '';
    function send() {
        var time = new Date().getTime();
        let ws = ui.host;
        let players = window.xhttp = ui.players;
        let count = players.length;
        let mode = localStorage.gamemode;
        if (time - lastUpdate >= 60000 || lastWS != ws) {
            lastUpdate = time;
            lastWS = ws;
            fetch("https://accelerator-api.glitch.me/update", {
                method: "POST",
                mode: "cors",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ws: ws,
                    gamemode: mode,
                    playerCount: count,
                    playerList: players,
                    timestamp: Math.floor(new Date().getTime() / 1000)
                })
            }).then(res => console.log("Lobby data sent to the API. | " + res.status));
        }
    }

    var old = ui.render;
    ui.render = function()  {
        var ret = old.apply(this);
        if (ui.screen == "home") {
            send();
        }
        return ret;
    }
})();