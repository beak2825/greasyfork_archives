// ==UserScript==
// @name         Force Connect + WS Sender
// @namespace    https://greasyfork.org/en/users/476081-pashka
// @author       Nuro
// @description  Join full servers in moomoo.io
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @grant       none
// @run-at      document-start
// @version 0.1.1
// @namespace https://greasyfork.org/users/577135
// @downloadURL https://update.greasyfork.org/scripts/460985/Force%20Connect%20%2B%20WS%20Sender.user.js
// @updateURL https://update.greasyfork.org/scripts/460985/Force%20Connect%20%2B%20WS%20Sender.meta.js
// ==/UserScript==
 
let servers,
    elemSet = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML').set;
Object.defineProperty(window, 'vultr', {
    set: (data) => {
        data.servers.forEach(server => server.games.forEach(game => game.playerCount = 0 - game.playerCount));
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