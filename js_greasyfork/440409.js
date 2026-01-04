// ==UserScript==
// @name  Detect Low Player Servers
// @description  A userscript that detects servers with a low amount of players in them, but also not 0 players.
// @author TheThreeBowlingBulbs
// @match  *://arras.io/*
// @version 1.0.1
// @namespace https://greasyfork.org/users/812261
// @downloadURL https://update.greasyfork.org/scripts/440409/Detect%20Low%20Player%20Servers.user.js
// @updateURL https://update.greasyfork.org/scripts/440409/Detect%20Low%20Player%20Servers.meta.js
// ==/UserScript==

// Modify setBar for client limit
let setBar = 5;

async function detector() {
    let fetchN = await fetch('https://ak7oqfc2u4qqcu6i.uvwx.xyz:2222/status');
    let fetchC = await fetch('https://ak7oqfc2u4qqcu6i.uvwx.xyz:2222/clientCount');
    let server = await fetchN.json();
    let client = await fetchC.json();
    let clientCount = client.clients;
    let sum = 0;
    let servers = server.status;
    console.log(servers);

    for (let c in servers) {
        if (servers[c].clients > setBar) {
            sum = sum + servers[c].clients;
        }
        if (servers[c].clients > 0 && servers[c].clients < setBar) {
            console.table(servers[c]);
        }

    }
    console.log(clientCount - sum);
}
detector();