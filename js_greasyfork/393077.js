// ==UserScript==
// @name         Moomoo Force Server
// @namespace    Nebula
// @version      1.2.0
// @description  Allows forcing a connection to a server.
// @author       iXeL
// @match        *://moomoo.io/*
// @match        *://45.77.0.81/*
// @match        *://dev.moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/393077/Moomoo%20Force%20Server.user.js
// @updateURL https://update.greasyfork.org/scripts/393077/Moomoo%20Force%20Server.meta.js
// ==/UserScript==

window.history.replaceState = () => {};
window.history.pushState = () => {};

const force = getParam("force-connect", window.location.search);
const party = getParam("server", window.location.search);
const ip = /\d+:\d+:\d+/.exec(party);
console.log(force, party, ip);
if (force !== null && party !== null && ip && ip[0]){
    window.location = window.location.origin + window.location.pathname + `?force-connect=${ip[0]}`;
}

WebSocket = class extends WebSocket {
    constructor(...args){
        if (force !== null && /\d+:\d+:\d+/.test(force)){
            const allServers = [];
            const servers = window.vultr.servers;
            let len = servers.length;
            let server;
            let games;
            let gameLen;
            while (len--) {
                server = servers[len];
                games = server.games;
                gameLen = games.length;
                while (gameLen--) {
                    allServers.push({id: `${server.region}:${server.index}:${gameLen}`, ip: server.ip, gameIndex: gameLen});
                }
            }
            const s = (function (id) {
                let len = allServers.length;
                while (len--) {
                    if (allServers[len].id === id) return allServers[len];
                }
                return false;
            })(force);
            args[0] = args[0].replace(/ip_[a-z0-9]+/, `ip_${s.ip}`).replace(/\?gameIndex=\d+/, `?gameIndex=${s.gameIndex}`);
        }
        super(...args);
    }
};

function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}