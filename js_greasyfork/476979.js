// ==UserScript==
// @name        Moomoo.io - 1.8.0 AntiKickSystem
// @author      Seryo
// @description It shields you from the kick system by performing a kind of dash to prevent you from getting kicked.
// @version     1
// @match       *://*.moomoo.io/*
// @namespace   https://greasyfork.org/users/1190411
// @icon        https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b/cursor12.png
// @require     https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/476979/Moomooio%20-%20180%20AntiKickSystem.user.js
// @updateURL https://update.greasyfork.org/scripts/476979/Moomooio%20-%20180%20AntiKickSystem.meta.js
// ==/UserScript==

(() => {
    const { msgpack } = window;
    const antiKick = {
        resetDelay: 500,
        packetsLimit: 40,
        ignoreTypes: new Set(["10", "0"]),
        ignoreQueuePackets: new Set(["G", "d", "a", "D", "K", "c"]),
        packetsStorage: new Map(),
        tmpPackets: [],
        packetsQueue: [],
        lastSent: Date.now(),
        onSend(data) {
            const parsed = msgpack.decode(new Uint8Array(data));
            if (Date.now() - this.lastSent > this.resetDelay) {
                this.tmpPackets.length = 0;
                this.lastSent = Date.now();
            }
            if (!this.ignoreTypes.has(parsed[0])) {
                const oldPacket = this.packetsStorage.get(parsed[0]);
                if (oldPacket && (parsed[0] === "D" || parsed[0] === "a") && oldPacket[0] === parsed[1][0]) {
                    return true;
                }
                if (this.tmpPackets.length > this.packetsLimit) {
                    if (!this.ignoreQueuePackets.has(parsed[0])) {
                        this.packetsQueue.push(data);
                    }
                    return true;
                }
                this.tmpPackets.push({ type: parsed[0], data: parsed[1] });
                this.packetsStorage.set(parsed[0], parsed[1]);
            }
            return false;
        }
    };

    let firstSend = false;

    window.WebSocket.prototype.send = new Proxy(window.WebSocket.prototype.send, {
        apply(target, _this, args) {
            if (!firstSend) {
                _this.addEventListener("message", (event) => {
                    if (!antiKick.packetsQueue.length) return;
                    const parsed = msgpack.decode(new Uint8Array(event.data));
                    if (parsed[0] === "a") {
                        _this.send(antiKick.packetsQueue.shift());
                    }
                });
                firstSend = true;
            }
            if (antiKick.onSend(args[0])) return;
            return Reflect.apply(target, _this, args);
        }
    });
})();