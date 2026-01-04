// ==UserScript==
// @name         Your auto chat...
// @namespace    -
// @version      0.2
// @description  Create your own personal automated chat. To open the menu, click on the new button next to the chat button. To create a message, enter it in the input field where the timer is shown, then click on the "Create" button. To delete a message, click on the "Delete" button. You can change existing messages, just click on the text in them and change.
// @author       Nudo#7346
// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moomoo.io
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/448838/Your%20auto%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/448838/Your%20auto%20chat.meta.js
// ==/UserScript==

// Shit code is our everything!

(function() {
    const Config = {}

    Config.random = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    Config.stopStupidProcesses = function(event) {
        if (!this.hasOwnProperty("socket")) {
            return void 0
        }

        if (event.data.toLowerCase() === "e") {
            this.socket.send(new Uint8Array(Array.from(Config.msgpack.encode(["7", [1]]))))
        }

        this.socket.send(new Uint8Array(Array.from(Config.msgpack.encode(["33", [null]]))))
    }

    class Message {
        constructor(id, message, position) {
            this.id = id
            this.text = message
            this.position = position
        }

        send() {
            if (!Config.hasOwnProperty("socket")) {
                return void 0
            }

            const message = document.querySelector(`#storageInvInput[data-iid="${this.id}"]`).value

            this.text = message

            Config.messageManager.messages[this.id].text = this.text

            window.localStorage.setItem("__srg", JSON.stringify(Config.messageManager.messages))

            Config.socket.send(new Uint8Array(Array.from(Config.msgpack.encode(["ch", [message]]))))
        }
    }

    class MessageManager {
        constructor() {
            this.messages = {}
            this.savedMessages = {}
            this.limit = 99
            this.lastMessage = Date.now()
            this.updateSpeed = 3000
            this.currentMessage = 0
        }

        get newID() {
            return Config.random(1e9, 10e9)
        }

        addSavedMessage() {
            this.savedMessages = window.localStorage.__srg

            if (typeof this.savedMessages === 'undefined') {
                return void 0
            }

            let messages = Object.values(JSON.parse(this.savedMessages))
            messages = messages.sort((a, b) => a.position - b.position)

            for (const i in messages) {
                const message = messages[i]

                this.add(message.text, message.id)
            }
        }

        add(message, oldID) {
            const messages = Object.values(this.messages)

            if (messages.length >= this.limit || message.match(/[а-яА-Я]/)) {
                return void 0
            }

            const id = typeof oldID === 'undefined' ? this.newID : oldID
            const position = messages.length + 1

            this.messages[id] = new Message(id, message, position)

            Config.createMessageItem(id, message, position)

            this.savedMessages = window.localStorage.__srg

            window.localStorage.setItem("__srg", JSON.stringify(this.messages))

            return this.messages[id]
        }

        remove(id) {
            const position = this.messages[id].position - 1
            let messages = Object.values(this.messages)

            for (let i = position; i < messages.length; i++) {
                messages = messages.sort((a, b) => a.position - b.position)

                this.messages[messages[i].id].position -= 1

                document.getElementById(`position-${messages[i].id}`).textContent = `${this.messages[messages[i].id].position}.`
            }

            Config.removeMessageItem(id)

            delete this.messages[id]

            this.savedMessages = window.localStorage.__srg

            window.localStorage.setItem("__srg", JSON.stringify(this.messages))

            return this.messages
        }

        clear(clearStorage) {
            this.messages = {}

            const storageHolder = document.getElementById("storageHolder")

            storageHolder.innerHTML = `
            <div class="storageItem">No Auto Message Yet</div>
            `

            if (clearStorage) {
                window.localStorage.removeItem("__srg")
            }

            return this.messages
        }

        setUpdateSpeed(speed) {
            speed = speed[1]

            if (!speed.length) {
                return void 0
            }

            speed = parseInt(speed)

            if (speed < 0) {
                speed = 0
            }

            this.updateSpeed = speed

            return this.updateSpeed
        }

        init() {
            setInterval(() => {
                try {
                    const storageInput = document.getElementById("storageInput")
                    const storageButtonM = document.querySelector(".storageButtonM")

                    if (storageInput.value === "__srg:clear" || storageInput.value.startsWith("__srg:speed=") || storageInput.value.startsWith("__srg:sp=")) {
                        storageButtonM.textContent = "Execute"
                    } else {
                        storageButtonM.textContent = "Create"
                    }

                    if (!this.lastMessage || Date.now() - this.lastMessage >= this.updateSpeed) {
                        let messages = Object.values(this.messages)

                        messages = messages.sort((a, b) => a.position - b.position)

                        this.lastMessage = Date.now()

                        if (!messages.length) {
                            return void 0
                        }

                        if (this.currentMessage >= messages.length) {
                            this.currentMessage = 0
                        }

                        messages[this.currentMessage].send()

                        this.currentMessage += 1
                    } else {
                        const storageInput = document.getElementById("storageInput")

                        storageInput.placeholder = `${this.updateSpeed - (Date.now() - this.lastMessage)}ms`
                    }
                } catch {}
            })
        }
    }

    Config.messageManager = new MessageManager()

    Config.messageManager.init()

    window.cfg = Config

    window.addEventListener("load", () => {
        const gameUI = document.getElementById("gameUI")
        const html = `
        <div id="storageButton" class="uiElement gameButton">
		  <i class="material-icons" style="font-size:40px;vertical-align:middle">post_add</i>
        </div>

        <div id="storageMenu" style="display: none;">
		  <div id="storageHolder">
            <div class="storageItem">No Auto Message Yet</div>
          </div>
		  <div id="storageManager">
            <input type="text" id="storageInput" maxlength="30" placeholder="unique message">
            <div class="storageButtonM" style="width: 140px;">Create</div>
          </div>
	    </div>

        <style>
        .removeMsgBtn {
          float: right;
          font-size: 24px;
          text-align: right;
          cursor: pointer;
          color: #80eefc;
        }

        .removeMsgBtn:hover {
          color: #72d3e0;
        }

        .storageItem {
          font-size: 24px;
          color: #fff;
          padding: 5px;
        }

        .storageButtonM {
          pointer-events: all;
          cursor: pointer;
          margin-top: 10px;
          font-size: 24px;
          color: #fff;
          padding: 5px;
          background-color: rgba(0, 0, 0, 0.25);
          -webkit-border-radius: 4px;
          -moz-border-radius: 4px;
          border-radius: 4px;
          text-align: center;
          display: inline-block;
        }

        #storageInput {
          pointer-events: all;
          font-size: 24px;
          color: #fff;
          background-color: rgba(0, 0, 0, 0.25);
          -webkit-border-radius: 4px;
          -moz-border-radius: 4px;
          border-radius: 4px;
          padding: 5px;
          display: inline-block;
          outline: none;
          border-color: none;
          border: 0;
          -webkit-box-shadow: none;
          box-shadow: none;
          width: 200px;
          margin-right: 7px;
        }

        #storageInvInput {
          pointer-events: all;
          font-size: 24px;
          color: rgba(255, 255, 255, 0.6);
          background-color: rgba(0, 0, 0, 0);
          outline: none;
          border-color: none;
          border: 0;
          -webkit-box-shadow: none;
          box-shadow: none;
          width: 184px;
        }

        #storageHolder {
          pointer-events: all;
          height: 200px;
          max-height: calc(100vh - 260px);
          overflow-y: scroll;
          -webkit-overflow-scrolling: touch;
          width: 350px;
          display: inline-block;
          text-align: left;
          padding: 10px;
          background-color: rgba(0, 0, 0, 0.25);
          -webkit-border-radius: 4px;
          -moz-border-radius: 4px;
          border-radius: 4px;
        }

        #storageMenu {
          display: none;
          width: 100%;
          position: absolute;
          text-align: center;
          top: 50%;
          transform: translateY(-50%);
          -ms-transform: translateY(-50%);
          -moz-transform: translateY(-50%);
          -webkit-transform: translateY(-50%);
          -o-transform: translateY(-50%);
        }

        #storageButton {
          right: 450px;
        }

        @media only screen and (max-width: 768px) {
          #storageButton {
            top: inherit;
            left: 60px;
          }

          .storageItem, #storageInput, .storageButtonM, .removeMsgBtn, #storageInvInput {
            font-size: 18px;
          }
        }
        </style>
        `

        gameUI.insertAdjacentHTML("beforeend", html)

        const storageButton = document.getElementById("storageButton")
        const storageMenu = document.getElementById("storageMenu")
        const storageInput = document.getElementById("storageInput")
        const storageHolder = document.getElementById("storageHolder")
        const storageButtonM = document.querySelector(".storageButtonM")
        const gameActionBtns = ["allianceButton", "storeButton", "chatButton"]
        const gameActionMenus = ["chatHolder", "allianceMenu", "storeMenu"]

        storageButton.addEventListener("click", () => {
            const action = {
                "block": "none",
                "none": "block"
            }

            for (const menu of gameActionMenus) {
                document.getElementById(menu).style.display = "none"
            }

            storageMenu.style.display = action[storageMenu.style.display]
        })

        Config.removeMessageItem = function(id) {
            const removeMsgBtns = document.querySelectorAll(".removeMsgBtn")

            for (const btn of removeMsgBtns) {
                if (btn.dataset.id === id.toString()) {
                    btn.parentNode.remove()
                }
            }

            if (removeMsgBtns.length === 1) {
                storageHolder.innerHTML = `
                <div class="storageItem">No Auto Message Yet</div>
                `
            }
        }

        Config.createMessageItem = function(id, message, position) {
            const removeMsgBtns = document.querySelectorAll(".removeMsgBtn")

            if (!removeMsgBtns.length) {
                storageHolder.innerHTML = ""
            }

            const messagePosition = position

            storageHolder.innerHTML += `
              <div class="storageItem" data-siid="${id}">
                <span id="position-${id}" style="color: rgba(255, 255, 255, 0.6)">${messagePosition}.</span>
                <input type="text" id="storageInvInput" value="${message}" maxlength="30" placeholder="3000ms" data-iid="${id}">
                <div class="removeMsgBtn" data-id="${id}">Remove</div>
              </div>
            `

            const storageInvInputs = document.querySelectorAll("#storageInvInput")

            for (const input of storageInvInputs) {
                input.addEventListener("input", (event) => {
                    Config.stopStupidProcesses(event)
                })
            }
        }

        storageButtonM.addEventListener("click", (event) => {
            let value = storageInput.value

            if (value === "__srg:clear") {
                storageHolder.innerHTML = ""
                storageInput.value = ""

                return Config.messageManager.clear(true)
            }

            if (value.startsWith("__srg:speed=")) {
                const speed = value.split("=")

                storageInput.value = ""

                return Config.messageManager.setUpdateSpeed(speed)
            }

            if (!value.length) {
                return void 0
            }

            if (value.length >= Config.messageManager.limit) {
                value = value.slice(0, 30)
            }

            storageInput.value = ""

            Config.messageManager.add(value)
        })

        storageHolder.addEventListener("click", (event) => {
            const target = event.target

            if (target.className === "removeMsgBtn") {
                Config.messageManager.remove(target.dataset.id)
            }
        })

        storageInput.addEventListener("input", (event) => {
            Config.stopStupidProcesses(event)
        })

        document.addEventListener("keydown", (event) => {
            if (event.code === "Enter" || event.code === "Escape") {
                storageMenu.style.display = "none"
            }
        })

        for (const btn of gameActionBtns) {
            document.getElementById(btn).addEventListener("click", (event) => {
                storageMenu.style.display = "none"
            })
        }

        Config.messageManager.addSavedMessage()
    })

    Config.msgpack = {}

    Function.prototype.call = new Proxy(Function.prototype.call, {
        apply(target, _this, args) {
            const data = target.apply(_this, args)

            if (args[1] && args[1].i) {
                const i = args[1].i

                if (i === 9) {
                    Config.msgpack.encode = args[0].encode
                }

                if (i === 15) {
                    Config.msgpack.decode = args[0].decode
                    Function.prototype.call = target
                }
            }

            return data
        }
    })

    const set = Object.getOwnPropertyDescriptor(WebSocket.prototype, "onmessage").set;
    Object.defineProperty(WebSocket.prototype, "onmessage", {
        set(callback) {
            return set.call(this, new Proxy(callback, {
                apply(target, _this, args) {
                    Config.socket = _this

                    return target.apply(_this, args)
                }
            }))
        }
    })
})()