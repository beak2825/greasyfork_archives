// ==UserScript==
// @name         AntiKickSystem
// @namespace    https://github.com/Nudo-o
// @version      1
// @description  At least this system should protect you from the kick system
// @author       @nudoo
// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472054/AntiKickSystem.user.js
// @updateURL https://update.greasyfork.org/scripts/472054/AntiKickSystem.meta.js
// ==/UserScript==

(function() {
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
})()