// ==UserScript==
// @name         Voice Mod Beta
// @namespace    -
// @version      1.0
// @description  In order for everything to work correctly, you need to play on the HTTPS protocol. Allow access to the microphone! This is a beta version, so there are probably bugs here. See the commands in greasyfork description!
// @author       Nudo#3310
// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moomoo.io
// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447453/Voice%20Mod%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/447453/Voice%20Mod%20Beta.meta.js
// ==/UserScript==
(function() {
    const Client = {}

    class Socket {
        constructor(socket) {
            this.source = socket
        }

        isOpen() {
            if (this.source.readyState !== 1) {
                return false
            }

            return true
        }

        send(data) {
            if (!this.isOpen()) {
                return void 0
            }

            const item = Array.prototype.slice.call(arguments, 0, 1)
            const action = Array.prototype.slice.call(arguments, 1)

            data = new Uint8Array(Array.from(msgpack.encode([item[0], action])))

            this.source.send(data)
        }
    }

    // just beta version sorry xD I was too lazy to do it normally >
    let primary = 0
    let secondary = 0
    let foodType = 0
    let spikeType = 0
    // <

    // just beta version sorry xD I was too lazy to do it normally >
    function isVisible(element) {
        if (!element) {
            return void 0
        }

        return element.offsetParent !== null
    }
    // <

    WebSocket.prototype.oldSend = WebSocket.prototype.send
    WebSocket.prototype.send = function() {
        if (typeof Client.socket === 'undefined') {
            if (!this) {
                return void 0
            }

            Client.socket = new Socket(this)
        }

        // just beta version sorry xD I was too lazy to do it normally >
        for (let i = 0; i < 9; i++)
            if (isVisible(document.getElementById("actionBarItem" + i.toString()))) primary = i
        for (let i = 9; i < 16; i++)
            if (isVisible(document.getElementById("actionBarItem" + i.toString()))) secondary = i
        for (let i = 16; i < 19; i++)
            if (isVisible(document.getElementById("actionBarItem" + i.toString()))) foodType = i - 16
        for (let i = 22; i < 26; i++)
            if (isVisible(document.getElementById("actionBarItem" + i.toString()))) spikeType = i - 16
        // <

        this.oldSend.apply(this, arguments)
    }

    const Utils = {}

    Utils.toRaq = function(angle) {
        return angle * 0.01745329251
    }

    const Game = {}

    Game.move = function(angle, raq = true) {
        Client.socket.send("33", raq ? Utils.toRaq(angle) : angle)
    }

    Game.hit = function(type, angle) {
        Client.socket.send("c", type, angle)
    }

    Game.take = function(id, type = true) {
        Client.socket.send("5", id, type)
    }

    Game.place = function(id, angle) {
        this.take(id, null)
        this.hit(true)
        this.hit(false)
        this.take(primary)
    }

    Game.equip = function(id) {
        Client.socket.send("13c", 0, id, 0)
    }

    Game.chat = function(string) {
        Client.socket.send("ch", string)
    }

    Game.voiceChat = false

    const recognizer = new window.webkitSpeechRecognition()

    recognizer.executeCommands = {
        "left": () => {
            Game.move(180)
        },
        "right": () => {
            Game.move(0)
        },
        "up": () => {
            Game.move(270)
        },
        "down": () => {
            Game.move(90)
        },
        "stop": () => {
            Game.move(null, false)
        },
        "attack": () => {
            Game.hit(true)
            Game.hit(false)
        },
        "heal": () => {
            Game.place(foodType)
        },
        "place spike": () => {
            console.log(spikeType)
            Game.place(spikeType)
        },
        "equip apple cap": () => {
            Game.equip(50)
        },
        "voice chat": () => {
            Game.voiceChat = !Game.voiceChat
        }
    }

    function fixedCommand(command) {
        if (command === "play spike") {
            command = "place spike"
        } else if (command === "top") {
            command = "up"
        } else if (command === "bottom") {
            command = "down"
        } else if (command === "equip apple cab") {
            command = "equip apple cap"
        }

        return command
    }


    function onRecognizerResult(received, _this) {
        if (typeof Client.socket === 'undefined') {
            return void 0
        }

        received = received.toLowerCase()

        received = fixedCommand(received)

        if (!_this.executeCommands[received] && !Game.voiceChat) {
            Game.chat(`NotFound: ${received}`)

            return void 0
        }

        if (Game.voiceChat) {
            if (received === "voice chat") {
                Game.chat(`VoiceCmd: ${received}`)

                _this.executeCommands["voice chat"]()
            } else {
                Game.chat(received)
            }
        } else {
            Game.chat(`VoiceCmd: ${received}`)

            _this.executeCommands[received](_this)
        }
    }

    recognizer.setup = function() {
        this.interimResults = true
        this.lang = "en-EN"

        this.reset = function() {
            this.stop()

            setTimeout(() => {
                this.start()
            }, 750)
        }

        this.onresult = function() {
            const result = event.results[event.resultIndex]

            if (result.isFinal) {
                const words = result[0].transcript

                onRecognizerResult(words, this)
            }
        }

        this.onend = function() {
            this.reset()
        }

        this.start()
    }

    window.addEventListener("load", () => {
        recognizer.setup()
    })
})()