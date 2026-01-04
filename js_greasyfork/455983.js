// ==UserScript==
// @name         Hello! I'm stupid man! [ Patched ]
// @namespace    -
// @version      0.1
// @description  just a funny script.. Sends a message when a player appears on the screen
// @author       Devil D. Nudo#7346
// @match        *://*.moomoo.io/*
// @match        *://moomoo.io/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/455983/Hello%21%20I%27m%20stupid%20man%21%20%5B%20Patched%20%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/455983/Hello%21%20I%27m%20stupid%20man%21%20%5B%20Patched%20%5D.meta.js
// ==/UserScript==

(function() {
    "use strict"

    class MsgPack {
        static decodeData(data) {
            if (!data || typeof MsgPack.decode !== 'function') return

            data = MsgPack.decode(new Uint8Array(data))

            return data
        }

        static encodeData(data) {
            if (!data || typeof MsgPack.encode !== 'function') return

            data = new Uint8Array(Array.from(MsgPack.encode(data)))

            return data
        }

        static getFormatedData() {
            if (!arguments.length) return

            const type = Array.prototype.slice.call(arguments, 0, 1)
            const content = Array.prototype.slice.call(arguments, 1)

            if (!content.length) {
                console.warn(type[0], "A strange packet with no data being sent")
            }

            const data = MsgPack.encode([type[0], [...content]])

            return data
        }
    }

    Function.prototype.call = new Proxy(Function.prototype.call, {
        apply(target, _this, args) {
            const data = target.apply(_this, args)

            if (args[1] && args[1].i) {
                const index = args[1].i

                if (index === 9) {
                    MsgPack.encode = args[0].encode
                }

                if (index === 15) {
                    MsgPack.decode = args[0].decode

                    Function.prototype.call = target
                }
            }

            return data
        }
    })

    class Config {
        get stupidMessage() {
            return "Hello [name]! I'm stupid man!"
        }
    }

    const config = new Config()

    class Socket {
        constructor(websocket = null) {
            this.websocket = websocket

            this.eventQueue = []
        }

        addEvent(event, callback) {
            if (!this.websocket) {
                return this.eventQueue.push({
                    event: event,
                    callback: callback
                })
            }

            this.websocket.addEventListener(event, callback)
        }

        send() {
            const data = MsgPack.getFormatedData(...arguments)

            this.websocket.send(data)
        }

        init(sourceThis, callback) {
            this.websocket = sourceThis

            for (const event of this.eventQueue) {
                this.addEvent(event.event, event.callback)
            }

            callback.call(this, this.websocket)
        }
    }

    class MyPlayer {
        constructor() {
            if (MyPlayer.instance) {
                return MyPlayer.instance
            }

            this.sid = null

            this.socket = new Socket()

            MyPlayer.instance = this
        }

        onSetupGame(content) {
            if (this.sid !== null) return

            this.sid = content[0]
        }

        onAddPlayer(content) {
            const info = [...content[0]]

            if (info[1] === this.sid) return

            const message = config.stupidMessage.replace(/\[\w+\]/, info[2])

            this.socket.send("ch", message)
        }

        onMessage(event) {
            const data = MsgPack.decodeData(event.data)
            const type = data[0]
            const content = [...data[1]]

            switch (type) {
                case "1": this.onSetupGame(content)
                    break

                case "2": this.onAddPlayer(content)
                    break
            }
        }
    }

    const myPlayer = new MyPlayer()

    window.WebSocket = class extends WebSocket {
        constructor(...args) {
            super(args)

            myPlayer.socket.init(this, function() {
                this.addEvent("message", myPlayer.onMessage.bind(myPlayer))
            })
        }
    }

    window.myPlayer = myPlayer
})()