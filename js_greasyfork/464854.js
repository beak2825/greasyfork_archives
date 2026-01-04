// ==UserScript==
// @name         join full server with SLASHER
// @namespace    https://greasyfork.org/en/users/476081-pashka
// @author       SLASHER
// @description  Join full servers 40/40 etc 
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @grant       none
// @run-at      document-start
// @version 1.01
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464854/join%20full%20server%20with%20SLASHER.user.js
// @updateURL https://update.greasyfork.org/scripts/464854/join%20full%20server%20with%20SLASHER.meta.js
// ==/UserScript==

let servers,
    elemSet = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML').set;
Object.defineProperty(window, 'vultr', {
    set: (data) => {
        data.servers.forEach(server => server.games.forEach(moomoo => moomoo.playerCount = 0 - moomoo.playerCount));
        servers = data
    },
    get: () => servers
});
Object.defineProperty(Element.prototype, 'innerHTML', {
    set(data) {
        this.id === 'serverBrowser' && (data = data.replace(/-(\d)/g, '$1'))
        return elemSet.call(this, data);
    }
});
localStorage.moofoll = !0;