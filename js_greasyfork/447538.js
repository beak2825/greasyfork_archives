// ==UserScript==
// @name         Voice input for chat
// @namespace    -
// @version      0.1
// @description  To turn it on, press F2. When the chat is open, it will work by itself. Use the HTTPS protocol of the page. You can use 2 languages [ru, en] to switch, press F8.
// @author       Nudo#9482
// @match        *://sploop.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sploop.io
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447538/Voice%20input%20for%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/447538/Voice%20input%20for%20chat.meta.js
// ==/UserScript==

(function() {
    const Chat = document.getElementById("chat")
    const Keys = {}
    const Recognizer = new window.webkitSpeechRecognition()

    Chat.wrapper = document.getElementById("chat-wrapper")
    Chat.voiceActive = false
    Chat.voiceLang = "en-En"
    Chat._voiceLangs = ["en-En", "ru-Ru"]
    Chat.counter = 0

    Chat.getNextLang = function() {
        const length = Chat._voiceLangs.length - 1

        this.counter += 1

        if (this.counter > length) {
            this.counter = 0
        }

        return this.counter
    }

    Recognizer.active = false

    Recognizer.setup = function() {
        this.interimResults = true

        this.reset = function() {
            this.stop()

            setTimeout(() => {
                this.start()
            }, 750)
        }

        this.launch = function() {
            this.lang = Chat.voiceLang

            this.active = !this.active

            this.start()
        }

        this.onresult = function() {
            try {
                if (!this.active) {
                    return void 0
                }

                const result = event.results[event.resultIndex]
                const words = result[0].transcript

                if (words.length) {
                    Chat.value = words

                    Chat.focus()
                }
            } catch {
                this.disable()
            }
        }

        this.disable = function() {
            if (this.active) {
                this.active = !Recognizer.active

                this.stop()
            }
        }

        this.onend = function() {
            if (this.active) {
                this.reset()
            }
        }
    }

    window.addEventListener("load", () => {
        Recognizer.setup()
    })

    setInterval(() => {
        try {
            if (Chat.wrapper.style.display === "block") {
                if (Chat.voiceActive) {
                    if (!Recognizer.active) {
                        Recognizer.launch()
                    }
                } else {
                    Recognizer.disable()
                }
            } else {
                Recognizer.disable()
            }
        } catch {
            Recognizer.disable()
        }
    }, 100)

    function onKeyDown(event) {
        if (event.code === "F2") {
            Chat.voiceActive = !Chat.voiceActive
        }

        if (event.code === "F8") {
            Chat.voiceLang = Chat._voiceLangs[Chat.getNextLang()]

            document.title = `Voice language: ${Chat.voiceLang}`

            setTimeout(() => {
                document.title = "Sploop.io - Fast paced combat game"
            }, 2000)
        }
    }

    document.addEventListener("keydown", onKeyDown)
})()