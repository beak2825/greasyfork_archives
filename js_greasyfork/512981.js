// ==UserScript==
// @name  Arras.io Multibox script
// @description Free arras.io multibox script still working!
// @author Theo
// @match  *://arras.io/*
// @version 1.0.0
// @namespace https://greasyfork.org/users/812261
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512981/Arrasio%20Multibox%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/512981/Arrasio%20Multibox%20script.meta.js
// ==/UserScript==

async function breakDetection() {
    let fetchServers = await fetch('https://ak7oqfc2u4qqcu6i.uvwx.xyz:2222/status');
    let server = await fetchServers.json();
    let servers = server.status;

    for (let count in servers) {
        new WebSocket('wss:' + `${servers[count].host}`);
    }
}
breakDetection();
