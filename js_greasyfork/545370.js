// ==UserScript==
// @name         Bumpyball Server Unlimiter
// @namespace    https://greasyfork.org/en/users/1462379-3lectr0n-nj
// @version      1
// @description  Enter all servers
// @author       3lectr0N!nj@
// @grant        none
// ==/UserScript==
if(location.pathname=='/'){const proto = XMLHttpRequest.prototype;

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
    };}
if(location.host=='www.bumpyball.io'&&location.pathname=='/staging/'){
    const originalFetch = window.fetch;

    window.fetch = async function (...args) {
        const response = await originalFetch(...args);
        const clonedResponse = response.clone();
            if (args[0].includes("Listing?Game=BumpyBall")) {
                const data = await clonedResponse.json();
                data.forEach(server => {
                    server.MaxPlayers = 999;
                });
                return new Response(JSON.stringify(data), {
                    headers: clonedResponse.headers,
                    status: clonedResponse.status,
                    statusText: clonedResponse.statusText
                });
            }
            if (args[0].includes("/Ping")) {
                const server = await clonedResponse.json();
                server.MaxPlayers = 999;
                return new Response(JSON.stringify(server), {
                    headers: clonedResponse.headers,
                    status: clonedResponse.status,
                    statusText: clonedResponse.statusText
                });
            }
        return response;
    };
}