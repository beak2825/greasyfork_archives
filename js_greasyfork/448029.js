// ==UserScript==
// @name         RBLU
// @author       0vC4
// @version      1.1
// @description  RocketBall Limit Unlocker
// @namespace    https://greasyfork.org/users/670183-exnonull
// @match        http://www.pucks.io/*
// @match        https://www.pucks.io/*
// @match        http://www.bumpyball.io/*
// @match        https://www.bumpyball.io/*
// @icon         https://www.google.com/s2/favicons?domain=bumpyball.io
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448029/RBLU.user.js
// @updateURL https://update.greasyfork.org/scripts/448029/RBLU.meta.js
// ==/UserScript==

(() => {
    const proto = XMLHttpRequest.prototype;

    if (!proto._open) proto._open = proto.open;
    proto.open = function () {
        const [method, url] = arguments;
        Object.assign(this, {method, url});
        return this._open.apply(this, arguments);
    };

    if (!proto._send) proto._send = proto.send;
    proto.send = function (body) {
        if (this.url.match(/Listing\?Game=BumpyBall/)) {
            this._lnd = this.onload;
            this.onload = function (e) {
                const table = JSON.parse(new TextDecoder().decode(this.response));
                table.forEach(server => {
                    server.MaxPlayers = 999;
                });

                Object.defineProperty(this, 'response', {
                  enumerable: true,
                  configurable: true,
                  writable: true,
                  value: new TextEncoder().encode(JSON.stringify(table)).buffer
                });
                this._lnd(e);
            };
        }
        if (this.url.match(/\/Ping/)) {
            this._lnd = this.onload;
            this.onload = function (e) {
                const server = JSON.parse(new TextDecoder().decode(this.response));
                server.MaxPlayers = 999;

                Object.defineProperty(this, 'response', {
                  enumerable: true,
                  configurable: true,
                  writable: true,
                  value: new TextEncoder().encode(JSON.stringify(server)).buffer
                });
                this._lnd(e);
            };
        }
        return this._send.apply(this, arguments)
    };
})();
// 0vC4#7152