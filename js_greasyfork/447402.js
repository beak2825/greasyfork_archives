// ==UserScript==
// @name         Global Chat
// @namespace    -
// @version      0.1
// @description  You can chat with other players from all servers! When you write something in the chat sploop.io then it is shown in the global chat. (This script does not allow you to communicate with everyone, but allows you to communicate with all users of this script)
// @author       Nudo
// @match        *://sploop.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sploop.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447402/Global%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/447402/Global%20Chat.meta.js
// ==/UserScript==

(function() {
    const SERVER = "globalchatserver.stopitplz.repl.co"
    const WSSERVER = `ws${location.protocol.slice(4, 5) || ""}://${SERVER}`

    let socket = null

    function sendMessage(data) {
        if (!socket) {
            return void 0
        }

        if (socket.readyState !== 1) {
            return void 0
        }

        socket.send(JSON.stringify([localStorage.nickname || "noname", data]))
    }

    function serverSetup() {
        socket = new WebSocket(WSSERVER)
        socket.binaryType = "arraybuffer"

        socket.onopen = () => {
            sendMessage("connected")
        }

        socket.onmessage = (message) => {
            const data = JSON.parse(message.data)

            onMessage(data)
        }
    }

    function onMessage(data) {
        Menu.addMessage(data[0], data[1], data[2])
    }

    window.addEventListener("load", () => serverSetup())

    const Menu = {}

    Menu.html = `
    <div class="global-chat-holder">
      <container class="chat-wrapper"></container>
    </div>

    <style>
    .chat-wrapper main {
      color: #fff;
      margin: 3px;
      font-size: 14px;
    }

    .chat-wrapper {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      max-height: 400px;
    }

    .chat-wrapper::-webkit-scrollbar {
      width: 0;
    }

    .global-chat-holder {
      position: absolute;
      top: 5px;
      left: 5px;
      pointer-events: none;
      z-index: 999999;
    }
    </style>
    `

    Menu.addMessage = function(nickname, message, color) {
        if (!message.length) {
            return void 0
        }

        const wrapper = document.querySelector(".chat-wrapper")

        message = antiSpam(message)

        wrapper.innerHTML += `
        <main class="text-shadowed-3" style="color: ${color || "#fff"}">
        ${nickname}: ${message}
        </main>
        `

        wrapper.scrollTo(0, wrapper.scrollHeight)
    }

    const canvas = document.getElementById("game-canvas")

    canvas.insertAdjacentHTML("beforebegin", Menu.html)

    window.addEventListener("keydown", (event) => {
        if (event.code === "Enter") {
            const chatValue = document.getElementById("chat").value

            sendMessage(chatValue)
        }
    })

    function antiSpamLetters(message) {
        let letterCounter = {}

        for (let i = 0; i < message.length; i++) {
            if (!message[i - 1]) {
                continue
            }

            if (letterCounter[message[i]] == null) {
                letterCounter[message[i]] = 0
            }

            if (message[i].toLowerCase() === message[i - 1].toLowerCase()) {
                letterCounter[message[i]] += 1
            }
        }

        for (const letter in letterCounter) {
            if (letterCounter[letter] >= 5) {
                message = "spam"
            }
        }

        return message
    }

    function antiSpamSymbols(message) {
        let symbolCounter = {}

        const symbols = ["@", "!", "#", "$", "%", "&"]

        for (const symbol of symbols) {
            if (message.match(symbol)) {
                for (const letter of message) {
                    if (symbolCounter[letter] == null) {
                        symbolCounter[letter] = 0
                    }

                    if (letter === symbol) {
                        symbolCounter[letter] += 1
                    }
                }
            }
        }

        for (const symbol in symbolCounter) {
            if (symbolCounter[symbol] >= 5) {
                message = "spam"
            }
        }

        return message
    }

    function antiSpam(message) {
        message = antiSpamLetters(message)
        message = antiSpamSymbols(message)

        return message
    }
})()