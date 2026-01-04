// ==UserScript==
// @name        Remore Grid + mini anti kick
// @namespace   Violentmonkey Scripts
// @match       *://moomoo.io/*
// @match       *://sandbox.moomoo.io/*
// @grant       none
// @version     2.1
// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @require      https://unpkg.com/guify@0.12.0/lib/guify.min.js
// @require      https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/msgpack-lite/0.1.26/msgpack.min.js
// @require 	 https://greasyfork.org/scripts/478839-moomoo-io-packet-code/code/MooMooio%20Packet%20Code.js?version=1274028
// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @license      MIT
// @author      Zexus
// @description :3
// @downloadURL https://update.greasyfork.org/scripts/485906/Remore%20Grid%20%2B%20mini%20anti%20kick.user.js
// @updateURL https://update.greasyfork.org/scripts/485906/Remore%20Grid%20%2B%20mini%20anti%20kick.meta.js
// ==/UserScript==

(function() {

let oldLineTo = CanvasRenderingContext2D.prototype.lineTo;
let oldFillRect = CanvasRenderingContext2D.prototype.fillRect;

CanvasRenderingContext2D.prototype.lineTo = function() {
    if (this.globalAlpha != .06) oldLineTo.apply(this, arguments);
};

document.getElementById("enterGame").addEventListener('click', rwrw)
var RLC = 0
var MLC = 0
var KFC = 0

function rwrw() {
    console.log("Game Start")
    S = 1;
    M = 1;
    H = 1
}
var H = 1,
    M = 1,
    S = 1
setInterval(() => {
    RLC++
    S++
}, 1000);
setInterval(() => {
    if (RLC == 60) {
        MLC++
        RLC = 0
    }
    if (MLC == 60) {
        KFC++
        MLC = 0
    }
    if (S == 60) {
        M++
        S = 0
    }
    if (M == 60) {
        H++
        M = 0
    }
}, 0);
    const { msgpack } = window

    function AntiKick() {
        this.resetDelay = 500
        this.packetsLimit = 40

        this.ignoreTypes = [ "pp", "rmd" ]
        this.ignoreQueuePackets = [ "5", "c", "33", "2", "7", "13c" ]

        this.packetsStorage = new Map()
        this.tmpPackets = []
        this.packetsQueue = []

        this.lastSent = Date.now()

        this.onSend = function(data) {
            const binary = new Uint8Array(data)
            const parsed = msgpack.decode(binary)

            if (Date.now() - this.lastSent > this.resetDelay) {
                this.tmpPackets = []

                this.lastSent = Date.now()
            }

            if (!this.ignoreTypes.includes(parsed[0])) {
                if (this.packetsStorage.has(parsed[0])) {
                    const oldPacket = this.packetsStorage.get(parsed[0])

                    switch (parsed[0]) {
                        case "2":
                        case "33":
                            if (oldPacket[0] == parsed[1][0]) return true
                            break
                    }
                }

                if (this.tmpPackets.length > this.packetsLimit) {
                    if (!this.ignoreQueuePackets.includes(parsed[0])) {
                        this.packetsQueue.push(data)
                    }

                    return true
                }

                this.tmpPackets.push({
                    type: parsed[0],
                    data: parsed[1]
                })

                this.packetsStorage.set(parsed[0], parsed[1])
            }

            return false
        }
    }

    const antiKick = new AntiKick()

    let firstSend = false

    window.WebSocket.prototype.send = new Proxy(window.WebSocket.prototype.send, {
        apply: function(target, _this) {
            if (!firstSend) {
                _this.addEventListener("message", (event) => {
                    if (!antiKick.packetsQueue.length) return

                    const binary = new Uint8Array(event.data)
                    const parsed = msgpack.decode(binary)

                    if (parsed[0] === "33") {
                        _this.send(antiKick.packetsQueue[0])

                        antiKick.packetsQueue.shift()
                    }
                })

                firstSend = true
            }

            if (antiKick.onSend(arguments[2][0])) return

            return Reflect.apply(...arguments)
        }
    })
})();