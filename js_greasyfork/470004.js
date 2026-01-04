// ==UserScript==
// @name         Sigmally Mod (Macros, Client)
// @version      5
// @description  Sigmally Mod for Sigmally.com | Macros, Themes, Client, Autorespawn and much more!
// @author       Cursed
// @match        *://sigmally.com/*
// @icon         https://i.ibb.co/M7CsXZW/SigMod4.png
// @run-at       document-end
// @license      MIT
// @namespace    https://discord.gg/gHmhpCaPfP
// @require      https://greasyfork.org/scripts/470003-game-engine/code/Game%20Engine.js?version=1214473
// @downloadURL https://update.greasyfork.org/scripts/470004/Sigmally%20Mod%20%28Macros%2C%20Client%29.user.js
// @updateURL https://update.greasyfork.org/scripts/470004/Sigmally%20Mod%20%28Macros%2C%20Client%29.meta.js
// ==/UserScript==

(function() {
    const gt = window.gt;
    let version = 5;
    let logo = "https://i.ibb.co/Hn9qnjm/Sigmod-Logo.png";

    'use strict';
    if(localStorage.getItem("SigmodSettings")) localStorage.removeItem("SigmodSettings");

    let bl = [];
    let modSettings = localStorage.getItem("sig_modSettings");
    if (!modSettings) {
        modSettings = {
            keyBindingsRapidFeed: "w",
            keyBindingsdoubleSplit: "d",
            keyBindingsTripleSplit: "f",
            keyBindingsQuadSplit: "g",
            keyBindingsFreezePlayer: "s",
            keyBindingsToggleMenu: "v",
            keyBindingsSwitchChat: "t",
            mapColor: null,
            nameColor: null,
            borderColor: null,
            mapImageURL: "",
            Theme: "Dark",
            addedThemes: [],
            savedNames: [],
            AutoRespawn: false,
            tag: 0,
            showClientChat: false,
            chatBGcolor: "#2a3052",
            chatTextColor: "#ffffff",
            showNews: true,
        };
        localStorage.setItem("sig_modSettings", JSON.stringify(modSettings));
    } else {
        modSettings = JSON.parse(modSettings);
    }

    function getGameMode() {
        const gameMode = document.getElementById("gamemode")
        const options = Object.values(gameMode.querySelectorAll("option"))
        const selectedOption = options.filter((option) => option.value === gameMode.value)[0]
        const serverName = selectedOption.textContent.split(" ")[0]

        return serverName
    }

    function isMainMenuClosed() {
        const __line2 = document.getElementById("__line2")
        const menuWrapper = document.getElementById("menu-wrapper")

        return __line2.classList.contains("line--hidden") && menuWrapper.style.display === "none"
    }

    function hexToRGBA (hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    class Client {
        constructor() {
            this.ws = new gt.GTSocket({
                url: "wss://sigmally-mod.marco077x.repl.co",
                packetType: "msgpack",
                hideMsgpack: true
            });
            this.id = "";
            this.playerId = Math.floor(Math.random() * 1e15);

            this.miniMapXOffset = null
            this.miniMapYOffset = null
            this.lastSentMiniMapData = Date.now()
            this.miniMapUsersData = []

            this.chatData = [];
            this.Username = "User";
            this.specialUsers = [];

            this.currentTag = 0;

            this.lastSentPing = 0
            this.ping = 0

            this.settingsShown = false;
            this.chatIsDown = false;
            this.unreadedMessages = 0;
            this.notification = document.getElementById("notification");

            this.init();
        }

        get style() {
            return `
         #client-chat {
            position: fixed;
            bottom: 10px;
            left: 10px;
            z-index: 2147483647;
            overflow: hidden;
            width: 435px;
            height: 250px;
            border-radius: 2px;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            transform-origin: bottom;
            transition: all .3s ease;
        }

        #client-messages {
            display: flex;
            flex-direction: column;
            max-height: 200px;
            overflow-y: auto;
            direction: rtl;
        }

        .message {
            direction: ltr;
            margin: 2px 0 0 5px;
        }

        #client-messages::-webkit-scrollbar {
             width: 10px;
        }
        #client-messages::-webkit-scrollbar-track {
             background: #222;
             border-radius: 5px;
        }
        #client-messages::-webkit-scrollbar-thumb {
             background-color: #333;
             border-radius: 5px;
        }
        #client-messages::-webkit-scrollbar-thumb:hover {
             background: #444;
        }

        #chatInputContainer {
            display: flex;
            align-items: center;
            padding: 5px;
            background: rgba(68, 68, 68, 0.5);
        }

        #chatSendInput {
            flex-grow: 1;
            border: none;
            background: transparent;
            color: #fff;
            padding: 5px;
            outline: none;
        }

        #sendButton {
            background: #e37955;
            border: none;
            border-radius: 5px;
            padding: 5px 10px;
            color: #fff;
            transition: all 0.3s;
            cursor: pointer;
        }

        #sendButton:hover {
            background: #cc603b;
        }

        .chatOptions {
            position: fixed;
            bottom: 10px;
            left: 450px;
            z-index: 2147483647;
        }

        .chatButton {
            background: #e37955;
            border: 0;
            border-radius: 5px;
            padding: 5px 10px;
            color: #fff;
            transition: all 0.3s;
        }

        .chatButton:hover {
            background: #cc603b;
        }

        .chatButton:active {
            scale: 0.95;
        }

        .chatText {
            color: #ffffff;
            font-weight: 500;
            -webkit-text-stroke: 0.5px #000;
            text-stroke: 0.5px #000;
        }

        #tag {
            width: 50px;
            margin-left: 5px
        }

        .ClientChatTitle {
            position: absolute;
            top: 5px;
            right: 5px;
            pointer-events: none;
            -webkit-text-stroke: 0.5px #000;
            text-stroke: 0.5px #000;
            color: #7400FF;
            font-size: 16px;
            font-weight: 500;
        }

        #sendButton {
            display: flex;
            align-items: center;
            gap: 5px;
        }

        #notification {
          position: absolute;
          top: -10px;
          right: -10px;
          background-color: #3EDF6F;
          color: #ffffff;
          font-size: 12px;
          font-weight: bold;
          padding: 2px 7px;
          border-radius: 50px;
          transform: rotate(15deg);
          font-weight: 500;
        }

        .chatSettings {
            position: absolute;
            top: 30px;
            right: 36px;
            border: none;
            background-color: transparent;
            transition: all .3s ease;
        }
        .chatSettings:hover {
            transform: scale(.9)
        }

        .chatDown {
            position: absolute;
            top: 30px;
            right: 5px;
            width: 30px;
        }

        .chatSettingsDiv {
            z-index: 99996;
            position: absolute;
            bottom: 45px;
            left: 450px;
            height: 215px;
            width: 150px;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 10px;
            transition: all .3s ease;
        }


        /* Mod Style */

        :root {
             --default-mod-color: #2E2D80;
        }

        input[type=range] {
            -webkit-appearance: none;
            height: 22px;
            background: transparent;
            cursor: pointer;
        }

        input[type=range]::-webkit-slider-runnable-track {
            -webkit-appearance: none;
            background: #542499;
            height: 4px;
            border-radius: 6px;
        }
        input[type=range]::-webkit-slider-thumb {
            appearance: none;
            background: #6B32BD;
            height: 16px;
            width: 16px;
            position: relative;
            top: -5px;
            border-radius: 50%;
        }

        input:focus, select:focus, button:focus{
             outline: none;
        }
         .flex {
             display: flex;
        }
         .centerX {
             display: flex;
             justify-content: center;
        }
         .centerY {
             display: flex;
             align-items: center;
        }
         .centerXY {
             display: flex;
             align-items: center;
             justify-content: center
        }
         .f-column {
             display: flex;
             flex-direction: column;
        }
         #sig-mod-settings {
             border-radius: 4px;
             border: 2px solid #2E2D80;
             width: 440px;
             box-shadow: inset 0 0 10px #424190, 0 0 10px #424190;
             height: 355px;
        }
         .tabs_navigation {
             display: flex;
             justify-content: space-around;
        }
         .keybinding {
             max-width: 20px;
             text-align: center;
             margin-right: 5px;
             outline: none;
             color: #fff;
             background-color: #111;
             border: 0px solid #fff;
             font-weight: 500;
             border-bottom: 2px solid var(--default-mod-color);
             position: relative;
             border-top-right-radius: 4px;
             border-top-left-radius: 4px;
             transition: all .3s ease;
        }
         .keybinding:hover {
             background-color: #333;
        }
         .hidden {
             display: none;
        }
         #text-block,#left_ad_block,#ad_bottom,.ad-block,.ad-block-left,.ad-block-right {
             display: none;
        }
         .SettingsTitle{
             font-size: 32px;
             color: #EEE;
             margin-left: 10px;
        }
         .CloseBtn{
             width: 46px;
             background-color: transparent;
        }
         .text {
             user-select: none;
             font-weight: 500;
             text-align: left;
        }
         .titleImg{
             width: 50px;
             height: 50px;
             border-radius: 20px;
             object-fit: cover;
        }
         .modContainer {
             display: flex;
             justify-content: space-between;
        }
         .modButton{
             background-color: #333;
             border-radius: 5px;
             color: #fff;
             transition: all .3s;
             outline: none;
             padding: 5px;
             font-size: 13px;
             border: none;
        }
         .modButton:hover {
             background-color: #222
        }
         .tabbtn {
             background-color: #111;
             border-bottom: 2px solid var(--default-mod-color);
             border-radius: 0;
             position: relative;
             border-top-right-radius: 2px;
             border-top-left-radius: 2px;
             box-shadow: 0 4px 10px -4px var(--default-mod-color);
        }
         .tabbtn::before {
             content: "";
             position: absolute;
             left: 0;
             bottom: 0;
             width: 100%;
             height: 0;
             background: linear-gradient(to top, var(--default-mod-color), transparent);
             transition: height 0.3s ease;
        }
         .tabbtn:hover::before {
             height: 30%;
        }
         .modInput {
             background-color: #111;
             border: none;
             border-bottom: 2px solid var(--default-mod-color);
             border-radius: 0;
             position: relative;
             border-top-right-radius: 4px;
             border-top-left-radius: 4px;
             font-family: arial;
             font-weight: 500;
             padding: 4px;
             box-shadow: 0 4px 10px -4px var(--default-mod-color);
             color: #fff;
        }
         .SettingsButton{
             border: none;
             outline: none;
             margin-right: 10px;
             transition: all .3s ease;
        }
         .SettingsButton:hover {
             scale: 1.1;
        }
         .colorInput{
             background-color: transparent;
             width: 33px;
             height: 35px;
             border-radius: 50%;
             border: none;
        }
         .colorInput::-webkit-color-swatch {
             border-radius: 50%;
             border: 1px solid #000;
        }
        .whiteBorder_colorInput::-webkit-color-swatch {
            border-color: #fff;
        }
         #dclinkdiv {
             display: flex;
             flex-direction: row;
        }
         .dclinks {
             width: calc(50% - 5px);
             height: 36px;
             display: flex;
             justify-content: center;
             align-items: center;
             background-color: rgba(88, 101, 242, 1);
             border-radius: 6px;
             margin: 0 auto;
             color: #fff;
        }
         #settings {
             display: flex;
             flex-direction: column;
        }
         #cm_close__settings {
             width: 50px;
             transition: all .3s ease;
        }
         #cm_close__settings svg:hover {
             scale: 1.1;
        }
         #cm_close__settings svg {
             transition: all .3s ease;
        }
         .modTitleText {
             text-align: center;
             font-size: 16px;
        }
         #settings > .checkbox-grid {
             width: 232px;
        }
         .ModSettings {
             display: flex;
             justify-content: center;
        }
         .settingsTitle {
             margin-bottom: 6px;
             text-decoration: underline;
             font-size: 16px font-weight: 600
        }
         .tab {
             display: none;
        }
         .modItem {
             display: flex;
             justify-content: center;
             align-items: center;
             flex-direction: column;
        }
         .tab-content {
             margin: 10px;
        }
         .w-100 {
             width: 100%
        }
         .btnRS {
             margin: 0 5px;
             width: 50%
        }

        #savedNames {
            background-color: #222;
            padding: 5px;
            border-top-left-radius: 5px;
            overflow-y: scroll;
            width: 200px;
            height: 170px;
            display: flex;
            border-bottom: 2px solid var(--default-mod-color);
            box-shadow: 0 4px 20px -4px var(--default-mod-color);
        }
        #savedNames::-webkit-scrollbar, .themes::-webkit-scrollbar, .modKeybindings::-webkit-scrollbar {
             width: 10px;
        }
         #savedNames::-webkit-scrollbar-track, .themes::-webkit-scrollbar-track, .modKeybindings::-webkit-scrollbar-track {
             background: #222;
             border-radius: 5px;
        }
         #savedNames::-webkit-scrollbar-thumb, .themes::-webkit-scrollbar-thumb, .modKeybindings::-webkit-scrollbar-thumb {
             background-color: #555;
             border-radius: 5px;
        }
         #savedNames::-webkit-scrollbar-thumb:hover, .themes::-webkit-scrollbar-thumb:hover, .modKeybindings::-webkit-scrollbar-thumb:hover {
             background: #666;
        }

        .themes {
            display: flex;
            flex-direction: row;
            width: 100%;
            height: 220px;
            background: #000;
            border-radius: 5px;
            overflow-y: scroll;
            gap: 10px;
            padding: 5px;
            flex-wrap: wrap;
            justify-content: center;
        }

        .themeContent {
          width: 50px;
          height: 50px;
          border: 2px solid #222;
          border-radius: 50%;
          background-position: center;
        }


        .theme {
            height: 75px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            cursor: pointer;
        }
         .delName {
             font-weight: 500;
             background: #e17e7e;
             height: 20px;
             border: none;
             border-radius: 5px;
             font-size: 10px;
             margin-left: 5px;
             color: #fff;
             display: flex;
             justify-content: center;
             align-items: center;
             width: 20px;
        }
         .NameDiv {
             display: flex;
             background: #151515;
             border-radius: 5px;
             margin: 5px;
             padding: 3px 8px;
             height: 34px;
             align-items: center;
             justify-content: space-between;
             cursor: pointer;
             box-shadow: 0 4px 10px -4px var(--default-mod-color);
        }
        .NameLabel {
            cursor: pointer;
            font-weight: 500;
            text-align: center;
            color: #fff;
        }
        .resetButton {
            width: 25px;
            height: 25px;
            background-image: url("https://raw.githubusercontent.com/Sigmally/SigMod/main/images/reset.svg");
            background-color: transparent;
            border: none;
        }
        .modAlert {
            position: absolute;
            top: 50px;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 99998;
            background: #57C876;
            padding: 10px;
            border-radius: 10px;
            text-align: center;
            transition: all .3s ease-out;
        }
        .modAlert > .text {
            color: #fff;
        }

        .donate {
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 99995;
            background: #3F3F3F;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            padding: 10px;
            color: #fff;
        }


        .themeEditor {
            z-index: 100000;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, .85);
            color: #fff;
            padding: 10px;
            border-radius: 10px;
            box-shadow: 0 0 10px #fff;
            width: 400px;
        }

        .theme_editor_header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
        }

        .theme-editor-tab {
            display: flex;
            justify-content: center;
            align-items: start;
            flex-direction: column;
            margin-top: 10px
        }

        .themes_preview {
            width: 50px;
            height: 50px;
            border: 2px solid #fff;
            border-radius: 2px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .modKeybindings {
            display: flex;
            flex-direction: column;
            overflow-y: scroll;
            max-height: 170px;
        }
        .modKeybindings > label {
            margin-right: 5px;
        }

        .mod_news {
            z-index: 999999;
            position: absolute;
            top: 50px;
            left: 50px;
            box-shadow: inset 0 0 10px #000;
            color: #fff;
            padding: 10px;
            border-radius: 10px;
            max-width: 380px;
            overflow: hidden;
        }

        .mod_news_background {
          object-position: center;
          object-fit: cover;
          position: absolute;
          top: 0;
          left: 0;
          filter: blur(4px);
          width: 100%;
          height: 100%;
          z-index: -1;
        }

        .mod_news_header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }


        #signInBtn, #nick, #tag, #gamemode, #option_0, #option_1, #option_2 {
            background: rgba(0, 0, 0, 0.4);
            color: #fff;
        }
        .skin-select__icon-text {
            color: #fff;
        }
        `;
        }

        sendLog(msg) {
            const logMessage = {
                type: "log",
                content: msg,
                name: this.Username,
                gamemode: getGameMode()
            };
            this.ws.send(logMessage);
        }

        onServerMessage(event) {
            const data = this.ws.decodePacket(event.data)

            if (data.type === "log-back") {
                console.log(data.content);
            }

            if (data.type === "minimap-data") {
                this.miniMapUsersData = data.content
            }

            if (data.type === "new-chat-message") {
                const content = data.content;
                const msgUser = content.nickname;
                const msgContent = content.text;
                const tag = content.tag;
                const id = content.playerId;
                if (tag === this.currentTag) {
                    this.chatData.push(msgUser, msgContent);
                    this.updateChat(id, msgUser, msgContent);
                }
            }

            if (data.type === "auth") {
                this.specialUsers = data.content;
            }

            if (data.type === "get-ping") {
                this.ping = Date.now() - this.lastSentPing

                // console.log(`Client ping: ${this.ping}ms`) turn on if you want to know the ping of the Client.
            }
        }



        createTagElement() {
            const nick = document.querySelector("#nick");
            const tagElement = document.createElement("input");
            tagElement.classList.add("form-control");
            tagElement.placeholder = "tag";
            tagElement.setAttribute("id", "tag");
            tagElement.setAttribute("maxLength", 3);
            tagElement.value = "0";
            const pnick = nick.parentElement;
            pnick.style.display = "flex";

            document.getElementById("play-btn").addEventListener("click", () => {
                this.currentTag = tagElement.value;
                document.getElementById("client-chat-title").innerText = `SigMod Client Chat | Tag: ${this.currentTag}`;
                modSettings.tag = this.currentTag;
                localStorage.setItem("sig_modSettings", JSON.stringify(modSettings));
                this.ws.send({
                    type: "update-tag",
                    content: this.currentTag
                })
            })

            nick.insertAdjacentElement("afterend", tagElement);
        }

        updateTag(message) {
            const content = message.content
            const tag = content.tag;
            const members = content.members;

            console.log(tag, members)
        }


        sendData(type, content) {
            const msg = {
                type: type,
                content: content
            }
            this.ws.send(msg)
        }

        createClientChat() {
            const chat = document.createElement("div");
            chat.id = "client-chat";
            chat.classList.add("client_chat_div")

            chat.innerHTML = `
                <span id="client-chat-title" class="chatText ClientChatTitle">SigMod Client Chat | Tag: ${this.currentTag}</span>
                <div id="client-messages"></div>
                <div id="chatInputContainer">
                    <input id="chatSendInput" placeholder="message..." value="" maxlength="100"/>
                    <button id="sendButton" class="chatButton">
                        Send
                        <img src="https://raw.githubusercontent.com/Sigmally/SigMod/main/images/send.svg" width="20" height="20" draggable="false"/>
                    </button>
                </div>
            `;

            const chatOptions = document.createElement("div");
            chatOptions.innerHTML = `
                <button class="chatButton" id="mainBtn">Main</button>
                <button class="chatButton" id="partyBtn">Party</button>
            `;


            chatOptions.classList.add("chatOptions");

            document.body.append(chatOptions);
            document.body.append(chat);

            const send = document.getElementById("sendButton");
            send.addEventListener("click", () => {
                this.sendMsg();
            })

            const chatSendInput = document.getElementById("chatSendInput");
            chatSendInput.addEventListener("keydown", (e) => {
                e.stopPropagation();
                if(e.code == "Enter") {
                    this.sendMsg();
                    setTimeout(() => {
                        chatSendInput.blur();
                    }, 10)
                }
            })
            chatSendInput.addEventListener("click", () => {
                const noti = document.getElementById("notifications");
                if(document.getElementById("notification")) {
                    document.getElementById("notification").remove();
                    this.unreadedMessages = 0;
                }
            })

            document.addEventListener("keydown", (e) => {
                if(e.code == "Enter") {
                    chatSendInput.focus();
                    if(document.getElementById("notification")) {
                        document.getElementById("notification").remove();
                        this.unreadedMessages = 0;
                    }
                }
            })
        }

        switchChat() {
            const mainBtn = document.getElementById("mainBtn");
            const partyBtn = document.getElementById("partyBtn");
            const chatBlock = document.getElementById("chat_block");
            const clientChat = document.getElementById("client-chat");
            const showChat = document.getElementById("showChat");

            mainBtn.addEventListener("click", () => {
                chatBlock.style.display = "block";
                clientChat.style.display = "none";
                if(!showChat.checked) showChat.click()
                modSettings.showClientChat = false;
                localStorage.setItem("sig_modSettings", JSON.stringify(modSettings))
            })
            partyBtn.addEventListener("click", () => {
                chatBlock.style.display = "none";
                clientChat.style.display = "flex";
                if(document.getElementById("notification")) {
                    document.getElementById("notification").remove();
                    this.unreadedMessages = 0;
                }
                if(showChat.checked) showChat.click()
                modSettings.showClientChat = true;
                localStorage.setItem("sig_modSettings", JSON.stringify(modSettings))
            })

        }

        updateChat(id, user, message) {
            const chatContainer = document.getElementById("client-messages");
            const formattedMessage = `<span class="chatText message" style="font-size: 16px;">${user}: ${message}</span>`;
            chatContainer.innerHTML += formattedMessage;

            const messageCount = chatContainer.children.length;
            const messageLimit = 50;
            if (messageCount > messageLimit) {
                const messagesToRemove = messageCount - messageLimit;
                for (let i = 0; i < messagesToRemove; i++) {
                    chatContainer.removeChild(chatContainer.firstChild);
                    this.chatData.splice(0, 2);
                }
            }

            chatContainer.scrollTop = chatContainer.scrollHeight;

            if(id == this.playerId) return
            this.unreadedMessages++;
            if (this.unreadedMessages === 0) return;

            const partyBtn = document.getElementById("partyBtn");
            const notification = this.notification;

            if (notification) {
                notification.textContent = this.unreadedMessages;
            } else {
                const notificationElement = document.createElement("span");
                notificationElement.id = "notification";
                notificationElement.textContent = this.unreadedMessages;
                partyBtn.appendChild(notificationElement);
            }
        }

        sendMsg() {
            const username = document.getElementById("nick").value;
            let msg = document.querySelector("#chatSendInput").value;
            let tag = this.currentTag;
            let id = this.playerId;
            const msgContent = { nick: username, message: msg, tag: tag, playerId: id };

            if(msg == "") return
            const settings = document.querySelector(".chatSettings");
            const chatDown = document.querySelector(".chatDown");
            const sendButton = document.getElementById("sendButton");
            const client_messages = document.getElementById("client-messages");
            if(!this.chatIsDown) {
                document.getElementById("client-chat").style.height = "250px";
                document.getElementById("client-chat-title").style.display = "block";
                chatDown.style.rotate = "0deg";
                chatDown.style.top = "30px";
                settings.style.display = "block";
                sendButton.style.display = "block";
                client_messages.style.display = "flex";

                this.chatIsDown = false;
            }
            this.sendData("chat-message", msgContent);
            document.getElementById("chatSendInput").value = "";
        }

        chatOptions() {
            let chatIsDown = this.chatIsDown;
            const sendButton = document.getElementById("sendButton");
            const settings = document.createElement("button");
            const client_messages = document.getElementById("client-messages");
            settings.innerHTML = "<img src='https://raw.githubusercontent.com/Sigmally/SigMod/main/images/settings.png' />"
            settings.classList.add("chatSettings")
            document.getElementById("client-chat").append(settings)
            settings.addEventListener("click", this.chatSettings)

            const chatDown = document.createElement("button");
            chatDown.innerHTML = "↓";
            chatDown.addEventListener("click", () => {
                if(!chatIsDown) {
                    document.getElementById("client-chat").style.height = "40px";
                    document.getElementById("client-chat-title").style.display = "none";
                    chatDown.style.rotate = "180deg";
                    chatDown.style.top = "6px";
                    settings.style.display = "none";
                    sendButton.style.display = "none";
                    client_messages.style.display = "none";
                    const chatstngs = document.getElementById("ClientChatSettings")
                    if(chatstngs) {
                        chatstngs.remove();
                        this.settingsShown = false;
                    }

                    chatIsDown = true;
                } else {
                    document.getElementById("client-chat").style.height = "250px";
                    document.getElementById("client-chat-title").style.display = "block";
                    chatDown.style.rotate = "0deg";
                    chatDown.style.top = "30px";
                    settings.style.display = "block";
                    sendButton.style.display = "block";
                    client_messages.style.display = "flex";

                    chatIsDown = false;
                }
            })
            chatDown.classList.add("chatDown", "modButton")
            document.getElementById("client-chat").append(chatDown)
        }

        chatSettings() {
            if(!this.settingsShown) {
                const settings = document.createElement("div");
                settings.classList.add("chatSettingsDiv", "client_chat_div");
                settings.id = "ClientChatSettings";

                settings.innerHTML = `
                <span class="text chatText">More coming soon</span>
                <label class="centerXY text chatText">
                    Background: <input type="color" id="changeChatBg" class="colorInput" value="${modSettings.chatBGcolor}"/>
                </label>
                <label class="centerXY text chatText">
                    Text: <input type="color" id="changeChatColor" class="colorInput" value="${modSettings.chatTextColor}"/>
                </label>
                `;
                settings.style.backgroundColor = hexToRGBA(modSettings.chatBGcolor, 0.4);

                document.body.append(settings)

                setTimeout(() => {
                    const changeBg = document.getElementById("changeChatBg")
                    changeBg.addEventListener("input", () => {
                        const clientChatDivs = document.getElementsByClassName("client_chat_div");
                        for (let i = 0; i < clientChatDivs.length; i++) {
                            const rgbaColor = hexToRGBA(changeBg.value, 0.4);
                            clientChatDivs[i].style.backgroundColor = rgbaColor;
                        }

                        modSettings.chatBGcolor = changeBg.value;
                        localStorage.setItem("sig_modSettings", JSON.stringify(modSettings));
                    });
                    const changeChatColor = document.getElementById("changeChatColor")
                    changeChatColor.addEventListener("input", () => {
                        const chatText = document.getElementsByClassName("chatText");
                        for(let i=0; i < chatText.length; i++) {
                            chatText[i].style.color = changeChatColor.value;
                        }

                        modSettings.chatTextColor = changeChatColor.value;
                        localStorage.setItem("sig_modSettings", JSON.stringify(modSettings));
                    });
                });

                this.settingsShown = true;
            } else {
                if(document.getElementById("ClientChatSettings")) document.getElementById("ClientChatSettings").remove();
                this.settingsShown = false;
            }
        }

        init() {
            const chatBlock = document.getElementById("chat_block");
            const showChat = document.getElementById("showChat");

            //style
            const styleTag = document.createElement("style")
            styleTag.innerHTML = this.style;
            document.head.append(styleTag)


            setTimeout(() => {
                this.Username = uData.fullName || document.getElementById("nick").value || "User";
                this.id = uData.id || "";
            }, 1500)

            this.ws.connect(() => {
                this.ws.on("on-message", "message", this.onServerMessage.bind(this));
                setTimeout(() => {
                    this.sendLog(`${this.Username} connected to Client.`);
                    this.ws.send({ type: "auth" })
                }, 1600)
                setInterval(() => {
                    this.lastSentPing = Date.now()
                    this.ws.send({
                        type: "get-ping"
                    })
                }, 5000)
            });

            setTimeout(() => {
                const changeBg = document.getElementById("changeChatBg");
                const changeChatColor = document.getElementById("changeChatColor");

                this.switchChat();
                this.chatOptions()
                const gameMode = document.getElementById("gamemode")
                gameMode.addEventListener("change", (event) => {
                    this.ws.send({
                        type: "server-changed",
                        content: getGameMode()
                    })
                });

                const clientChat = document.getElementById("client-chat");
                if (localStorage.getItem("sig_modSettings")) {
                    const modSettings = JSON.parse(localStorage.getItem("sig_modSettings"));
                    if (modSettings.tag) {
                        this.currentTag = modSettings.tag;
                        document.getElementById("tag").value = this.currentTag;
                        document.getElementById("client-chat-title").innerText = `SigMod Client Chat | Tag: ${this.currentTag}`;
                    }
                    if(!modSettings.showClientChat) {
                        chatBlock.style.display = "block";
                        clientChat.style.display = "none";
                        if(showChat.checked) showChat.click();
                    } else {
                        chatBlock.style.display = "none";
                        clientChat.style.display = "flex";
                        if(!showChat.checked) showChat.click();
                    }


                    if(changeBg || changeChatColor) {
                        changeBg.value = modSettings.chatBGcolor;
                        changeChatColor.value = modSettings.chatTextColor;
                    }

                    const clientChatDivs = document.getElementsByClassName("client_chat_div");
                    for (let i = 0; i < clientChatDivs.length; i++) {
                        const rgbaColor = hexToRGBA(modSettings.chatBGcolor, 0.4);
                        clientChatDivs[i].style.backgroundColor = rgbaColor;
                    }

                    const chatText = document.getElementsByClassName("chatText");
                    for(let i=0; i < chatText.length; i++) {
                        chatText[i].style.color = modSettings.chatTextColor;
                    }
                }
            });
            this.createTagElement();
            this.createClientChat();
            setTimeout(() => {
                for(let i = 0; i < bl.length; i++) {
                    if(document.getElementById("nick").value.includes(bl[i])){
                        alert("You are banned from Sigmally Mod.");
                        location.href = "https://google.com";
                    }
                }
            }, 3000)
        }
    }

    const client = new Client();

    function keypress(key, keycode) {
        const keyDownEvent = new KeyboardEvent("keydown", { key: key, code: keycode });
        const keyUpEvent = new KeyboardEvent("keyup", { key: key, code: keycode });

        window.dispatchEvent(keyDownEvent);
        window.dispatchEvent(keyUpEvent);
    }


    function mod() {
        this.welcomeUser = document.createElement("span");
        this.splitKey = {
            keyCode: 32,
            code: "Space",
            cancelable: true,
            composed: true,
            isTrusted: true,
            which: 32,
        }
        this.createMenu();
    }

    mod.prototype = {
        respawnTime: Date.now(),
        respawnCooldown: 1000,
        move(cx, cy) {
            const mouseMoveEvent = new MouseEvent("mousemove", { clientX: cx, clientY: cy });
            const canvas = document.querySelector("canvas");
            canvas.dispatchEvent(mouseMoveEvent);
        },
        center(sx, sy) {
            const mouseMoveEvent = new MouseEvent("mousemove", { clientX: sx, clientY: sy });
            const canvas = document.getElementById("canvas");
            canvas.dispatchEvent(mouseMoveEvent);
        },

        getColors() {
            const mapColor = document.getElementById("mapColor");
            const mapImage = document.getElementById("mapImage");
            const originalFillRect = CanvasRenderingContext2D.prototype.fillRect;

            function ChangeMapColor() {
                CanvasRenderingContext2D.prototype.fillRect = function (x, y, width, height) {
                    if ((width + height) / 2 === (window.innerWidth + window.innerHeight) / 2) {
                        this.fillStyle = mapColor.value;
                    }
                    originalFillRect.apply(this, arguments);
                };
                modSettings.mapColor = mapColor.value;
                localStorage.setItem("sig_modSettings", JSON.stringify(modSettings));
            }
            mapColor.addEventListener("input", ChangeMapColor);

            function ChangeMapImage() {
                const canvas = document.getElementById("canvas");
                const ctx = canvas.getContext("2d");
                const img = new Image();
                let pattern;

                img.onload = function () {
                    const tempCanvas = document.createElement("canvas");
                    const tempCtx = tempCanvas.getContext("2d");
                    tempCanvas.width = img.width;
                    tempCanvas.height = img.height;
                    tempCtx.drawImage(img, 0, 0);
                    pattern = ctx.createPattern(tempCanvas, "repeat");
                    fillCanvas();
                };

                function fillCanvas() {
                    const fillRect = CanvasRenderingContext2D.prototype.fillRect;
                    CanvasRenderingContext2D.prototype.fillRect = function (x, y, width, height) {
                        this.fillStyle = pattern;
                        fillRect.apply(this, arguments);
                    };
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
                img.src = mapImage.value;
                modSettings.mapImageURL = mapImage.value;
                localStorage.setItem("sig_modSettings", JSON.stringify(modSettings));
            }

            document.getElementById("setMapImage").addEventListener("click", () => {
                if(mapImage.value == "") return

                const canvas = document.getElementById("canvas");
                const ctx = canvas.getContext("2d");
                const img = new Image();
                let pattern;

                img.onload = function() {
                    const tempCanvas = document.createElement("canvas");
                    const tempCtx = tempCanvas.getContext("2d");
                    tempCanvas.width = img.width;
                    tempCanvas.height = img.height;
                    tempCtx.drawImage(img, 0, 0);
                    pattern = ctx.createPattern(tempCanvas, "repeat");
                    fillCanvas();
                };

                function fillCanvas() {
                    const fillRect = CanvasRenderingContext2D.prototype.fillRect;
                    CanvasRenderingContext2D.prototype.fillRect = function(x, y, width, height) {
                        this.fillStyle = pattern;
                        fillRect.apply(this, arguments);
                    };
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }

                img.src = mapImage.value;
                modSettings.mapImageURL = mapImage.value;
                localStorage.setItem("sig_modSettings", JSON.stringify(modSettings));
            });

            const mapColorReset = document.getElementById("mapColorReset");
            mapColorReset.addEventListener("click", () => {
                modSettings.mapColor = null;
                localStorage.setItem("sig_modSettings", JSON.stringify(modSettings));

                const mapColor = document.getElementById("mapColor");
                mapColor.value = "";
            });

            const removeButton = document.getElementById("removeMapImage");

            removeButton.addEventListener("click", () => {
                if (mapImage.value == "" || modSettings.mapImageURL === "") return;
                if (confirm("You need to reload the page to remove the background image. Reload?")) {
                    modSettings.mapImageURL = "";
                    localStorage.setItem("sig_modSettings", JSON.stringify(modSettings));
                    location.reload();
                }
            });


            if (localStorage.getItem("sig_modSettings")) {
                function ChangeMapColor() {
                    CanvasRenderingContext2D.prototype.fillRect = function (x, y, width, height) {
                        if ((width + height) / 2 === (window.innerWidth + window.innerHeight) / 2) {
                            this.fillStyle = modSettings.mapColor;
                        }
                        originalFillRect.apply(this, arguments);
                    };
                }
                ChangeMapColor();

                function ChangeMapImage() {
                    const canvas = document.getElementById("canvas");
                    const ctx = canvas.getContext("2d");
                    const img = new Image();
                    let pattern;

                    img.onload = function () {
                        const tempCanvas = document.createElement("canvas");
                        const tempCtx = tempCanvas.getContext("2d");
                        tempCanvas.width = img.width;
                        tempCanvas.height = img.height;
                        tempCtx.drawImage(img, 0, 0);
                        pattern = ctx.createPattern(tempCanvas, "repeat");
                        fillCanvas();
                    };

                    function fillCanvas() {
                        const fillRect = CanvasRenderingContext2D.prototype.fillRect;
                        CanvasRenderingContext2D.prototype.fillRect = function (x, y, width, height) {
                            this.fillStyle = pattern;
                            fillRect.apply(this, arguments);
                        };
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                    }
                    img.src = modSettings.mapImageURL;
                }
                mapImage.value = modSettings.mapImageURL;
                ChangeMapImage();
            }
        },

        setColors() {
            // - NAME - //
            const nameColorValue = document.getElementById("nameColor");
            const fillText = CanvasRenderingContext2D.prototype.fillText;

            nameColorValue.addEventListener("input", () => {
                CanvasRenderingContext2D.prototype.fillText = function(text, x, y) {
                    if (text === document.getElementById("nick").value && this.playerId == this.playerId) {
                        const width = this.measureText(text).width;

                        this.fillStyle = nameColorValue.value;
                    }

                    return fillText.apply(this, arguments);
                };
                modSettings.nameColor = nameColorValue.value
                localStorage.setItem("sig_modSettings", JSON.stringify(modSettings))
            })

            if (localStorage.getItem("sig_modSettings")) {
                const nameColor = document.getElementById("nameColor");

                CanvasRenderingContext2D.prototype.fillText = function(text, x, y) {
                    if (text === document.getElementById("nick").value) {
                        const width = this.measureText(text).width;

                        this.fillStyle = modSettings.nameColor;
                    }

                    return fillText.apply(this, arguments);
                };

                nameColor.value = modSettings.nameColor;
            }


            const nameColorReset = document.getElementById("nameColorReset");
            nameColorReset.addEventListener("click", () => {
                CanvasRenderingContext2D.prototype.fillText = function(text, x, y) {
                    if (text === document.getElementById("nick").value) {
                        const width = this.measureText(text).width;
                        const fontSize = 8;

                        this.fillStyle = "#ffffff";
                    }

                    return fillText.apply(this, arguments);
                };
                nameColorValue.value = "#ffffff"
                modSettings.nameColor = null;
                localStorage.setItem("sig_modSettings", JSON.stringify(modSettings))
            });

            if(modSettings.nameColor == null) nameColorValue.value = "#ffffff";


            // - BORDER - //
            const borderColorinput = document.getElementById("borderColor");
            const borderColorReset = document.getElementById("borderColorReset");

            const moveTo = CanvasRenderingContext2D.prototype.moveTo;
            borderColorinput.addEventListener("input", () => {
                CanvasRenderingContext2D.prototype.moveTo = function(x, y) {
                    this.strokeStyle = borderColorinput.value;
                    return moveTo.apply(this, arguments)
                }
                modSettings.borderColor = borderColorinput.value;
                localStorage.setItem("sig_modSettings", JSON.stringify(modSettings))
            })

            borderColorReset.addEventListener("click", () => {
                CanvasRenderingContext2D.prototype.moveTo = function(x, y) {
                    this.strokeStyle = ""
                    return moveTo.apply(this, arguments)
                }
                modSettings.borderColor = "";
                localStorage.setItem("sig_modSettings", JSON.stringify(modSettings));
            })

            if(modSettings.borderColor !== null) {
                CanvasRenderingContext2D.prototype.moveTo = function(x, y) {
                    this.strokeStyle = modSettings.borderColor;
                    return moveTo.apply(this, arguments)
                }
            }
        },

        menu() {
            let Tab1;
            let Tab2;
            let Tab3;
            let Tab4;
            let Tab5;
            const welcomeuser = this.welcomeUser;
            const ModSettings = document.createElement("div");
            const KeyBindings = document.createElement("div");
            function openTab(tab) {
                let tabSelected = document.getElementById(tab);
                let allTabs = document.getElementsByClassName("tab");

                for (let i = 0; i < allTabs.length; i++) {
                    allTabs[i].style.display = "none";
                }

                tabSelected.style.display = "flex";
            }


            const settings = document.querySelector("#cm_modal__settings > .ctrl-modal__overlay > .ctrl-modal__modal");
            const DefaultSettings = document.querySelector("#settings > .checkbox-grid");
            const settingsTitle = settings.querySelector(".ctrl-modal__header > .ctrl-modal__title");

            settingsTitle.innerHTML = `<img src="${logo}" style="border-radius: 5px" width="44"/> SigMod Settings`
            settingsTitle.style.textAlign = "left";
            settings.setAttribute("id", "sig-mod-settings");

            const settingsHeader = settings.querySelector(".ctrl-modal__header");
            const menuTabs = document.createElement("div");
            menuTabs.classList.add("tabs_navigation");
            menuTabs.innerHTML = `
                  <button class="modButton tabbtn" id="modHome">Home</button>
                  <button class="modButton tabbtn" id="GameOptions">Game Options</button>
                  <button class="modButton tabbtn" id="NameOptions">Name options</button>
                  <button class="modButton tabbtn" id="modThemes">Themes</button>
                  <button class="modButton tabbtn" id="modInfo">Info</button>
                `;
            settingsHeader.insertAdjacentElement("afterend", menuTabs);

            const gameSettings = document.querySelector("#settings");
            const defaultSettingsTitle = document.createElement("span");
            defaultSettingsTitle.textContent = "Basic Settings";
            defaultSettingsTitle.classList.add("text", "settingsTitle");
            gameSettings.insertAdjacentElement("afterbegin", defaultSettingsTitle);

            welcomeuser.textContent = `Welcome Guest, to SigMod!`;
            welcomeuser.classList.add("text");
            welcomeuser.style = "margin: 10px 0; text-align: center; font-size: 16px;";

            const bsettings = document.querySelector("#sig-mod-settings > .ctrl-modal__content > .menu__item");
            bsettings.classList.add("tab")
            bsettings.style = "display: flex; flex-direction: column; margin: 0";
            bsettings.insertAdjacentElement("afterbegin", welcomeuser);
            Tab1 = bsettings;
            Tab1.setAttribute("id", "Tab1")

            Tab2 = document.createElement("div");
            Tab2.classList.add("centerX");
            Tab2.innerHTML = `
                    <div class="tab-content f-column" style="width: 75%">
                        <div class="flex" style="justify-content: space-around;">
                            <div class="modItem">
                                <span class="text">Map Color</span>
                                <div class="centerXY">
                                    <input type="color" value="#ffffff" id="mapColor" class="colorInput" />
                                    <button class="resetButton" id="mapColorReset"></button>
                                </div>
                            </div>
                            <div class="modItem">
                                <span class="text">Name Color</span>
                                <div class="centerXY">
                                    <input type="color" value="#ffffff" id="nameColor" class="colorInput" />
                                    <button class="resetButton" id="nameColorReset"></button>
                                </div>
                            </div>
                            <div class="modItem">
                                <span class="text">Border Colors</span>
                                <div class="centerXY">
                                    <input type="color" value="#ffffff" id="borderColor" class="colorInput" />
                                    <button class="resetButton" id="borderColorReset"></button>
                                 </div>
                            </div>
                        </div>

                        <div class="centerXY f-column">
                            <span class="text">Map image:</span>
                            <div class="f-column" style="margin-top: 5px;">
                                <input type="text" placeholder="background Image URL" id="mapImage" class="modInput" value="" />
                                <div class="centerX" style="margin-top: 10px;">
                                    <button class="modButton btnRS" id="removeMapImage">Remove</button>
                                    <button class="modButton btnRS" id="setMapImage">Set</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            Tab2.classList.add("tab", "hidden");
            Tab2.setAttribute("id", "Tab2");

            Tab3 = document.createElement("div");
            Tab3.innerHTML = `
                <div class="tab-content">
                    <span class="text">Save names</span>
                    <div class="flex">
                        <div class="f-column" style="margin-top: 5px;">
                            <div>
                                <input placeholder="Name" class="modInput" style="width: 124px" id="saveNameValue" />
                                <button class="modButton" style="margin-left: 5px" id="saveName">Add</button>
                            </div>
                            <div style="margin-top: auto;">
                                <button class="modButton" onclick="window.open('https://nickfinder.com', '_blank')">Nickfinder</button>
                                <button class="modButton" onclick="window.open('https://www.stylishnamemaker.com', '_blank')">Stylish Name</button>
                            </div>
                        </div>
                        <div class="f-column" style="margin-left: 10px">
                            <span class="Sett">saved:</span>
                            <div class="modItem">
                                <div id="savedNames" class="f-column"></div>
                            </div>
                        </div>
                    </div>
                </div>
                `;
            Tab3.classList.add("tab", "hidden", "centerX");
            Tab3.setAttribute("id", "Tab3");

            Tab4 = document.createElement("div");
            Tab4.innerHTML = `
                    <div class="tab-content themes" id="themes">
                        <div class="theme" id="createTheme">
                            <div class="themeContent" style="background: url('https://sigmally.com/assets/images/icon/plus.svg'); background-size: 50% auto; background-repeat: no-repeat; background-position: center;"></div>
                            <div class="themeName text" style="color: #fff">Create</div>
                        </div>
                    </div>
                `;
            Tab4.classList.add("tab", "hidden", "centerX");
            Tab4.setAttribute("id", "Tab4");

            Tab5 = document.createElement("div");
            Tab5.innerHTML = `<p class="text" style="margin: 5px;">SigMod V${version} | <a href="https://youtube.com/@sigmallyCursed" target="_blank">Cursed YT</a> | <a href="https://youtube.com/@sigmally" target="_blank">Official Sigmally YT</a></p>`;
            Tab5.classList.add("tab", "hidden");
            Tab5.setAttribute("id", "Tab5");

            document.getElementById("modHome").addEventListener("click", () => {
                openTab("Tab1");
            });
            document.getElementById("GameOptions").addEventListener("click", () => {
                openTab("Tab2");
            });
            document.getElementById("NameOptions").addEventListener("click", () => {
                openTab("Tab3");
            });
            document.getElementById("modThemes").addEventListener("click", () => {
                openTab("Tab4");
            });
            document.getElementById("modInfo").addEventListener("click", () => {
                openTab("Tab5");
            });


            const tabContent = document.querySelector("#sig-mod-settings > .ctrl-modal__content");
            tabContent.append(Tab2)
            tabContent.append(Tab3)
            tabContent.append(Tab4)
            tabContent.append(Tab5)

            KeyBindings.classList.add("modKeybindings")
            KeyBindings.innerHTML = `
                    <span class="text settingsTitle">KeyBindings</span>
                    <label class="flex">
                      <input type="text" name="keyBindingsRapidFeed" id="modinput1" class="keybinding" value="${modSettings.keyBindingsRapidFeed}" maxlength="1" onfocus="this.select()">
                      <span class="text">- Rapid Feed</span>
                    </label>
                    <label class="flex">
                      <input type="text" name="keyBindingsdoubleSplit" id="modinput2" class="keybinding" value="${modSettings.keyBindingsdoubleSplit}" maxlength="1" onfocus="this.select()">
                      <span class="text">- Double Split</span>
                    </label>
                    <label class="flex">
                      <input type="text" name="keyBindingsTripleSplit" id="modinput3" class="keybinding" value="${modSettings.keyBindingsTripleSplit}" maxlength="1" onfocus="this.select()">
                      <span class="text">- Triple Split</span>
                    </label>
                    <label class="flex">
                      <input type="text" name="keyBindingsQuadSplit" id="modinput4" class="keybinding" value="${modSettings.keyBindingsQuadSplit}" maxlength="1" onfocus="this.select()">
                      <span class="text">- Quad Split</span>
                    </label>
                    <label class="flex">
                      <input type="text" name="keyBindingsFreezePlayer" id="modinput5" class="keybinding" value="${modSettings.keyBindingsFreezePlayer}" maxlength="1" onfocus="this.select()">
                      <span class="text">- Freeze Player</span>
                    </label>
                    <label class="flex">
                      <input type="text" name="keyBindingsToggleMenu" id="modinput6" class="keybinding" value="${modSettings.keyBindingsToggleMenu}" maxlength="1" onfocus="this.select()">
                      <span class="text">- Toggle Menu</span>
                    </label>
                    <label class="flex">
                      <input type="text" name="keyBindingsSwitchChat" id="modinput7" class="keybinding" value="${modSettings.keyBindingsSwitchChat}" maxlength="1" onfocus="this.select()">
                      <span class="text">- Switch Chat</span>
                    </label>
                `;

            bsettings.append(ModSettings);
            ModSettings.append(gameSettings)
            ModSettings.append(KeyBindings);

            ModSettings.classList.add("ModSettings")


            document.querySelector("#cm_close__settings svg").setAttribute("width", "22")
            document.querySelector("#cm_close__settings svg").setAttribute("height", "24")
        },

        Themes() {
            const elements = [
                "#menu",
                ".top-users__inner",
                "#left-menu",
                ".menu-links",
                ".menu--stats-mode",
                "#cm_modal__settings > .ctrl-modal__overlay > .ctrl-modal__modal"
            ];

            const themeEditor = document.createElement("div");
            themeEditor.classList.add("themeEditor", "hidden");

            themeEditor.innerHTML = `
                <div class="theme_editor_header">
                    <h3>Theme Editor</h3>
                    <button class="btn CloseBtn" id="closeThemeEditor">
                        <svg width="22" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.6001 14.4L14.4001 1.59998M14.4001 14.4L1.6001 1.59998" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </button>
                </div>
                <hr />
                <main class="theme_editor_content">
                    <div class="centerXY" style="justify-content: flex-end;gap: 10px">
                        <span class="text">Select Theme Type: </span>
                        <select class="form-control" style="background: #222; color: #fff; width: 150px" id="theme-type-select">
                            <option>Static Color</option>
                            <option>Gradient</option>
                            <option>Image / Gif</option>
                        </select>
                    </div>

                    <div id="theme_editor_color" class="theme-editor-tab">
                        <div class="centerXY">
                            <label for="theme-editor-bgcolorinput" class="text">Background color:</label>
                            <input type="color" value="#000000" class="colorInput whiteBorder_colorInput" id="theme-editor-bgcolorinput"/>
                        </div>
                        <div class="centerXY">
                            <label for="theme-editor-colorinput" class="text">Text color:</label>
                            <input type="color" value="#000000" class="colorInput whiteBorder_colorInput" id="theme-editor-colorinput"/>
                        </div>
                        <div style="background-color: #000000" class="themes_preview" id="color_preview">
                            <span class="text" style="color: #fff; font-size: 9px;">preview</span>
                        </div>
                        <div class="centerY" style="gap: 10px; margin-top: 10px;">
                            <input type="text" class="form-control" style="background: #222; color: #fff;" maxlength="15" placeholder="Theme name..." id="colorThemeName"/>
                            <button class="btn btn-success" id="saveColorTheme">Save</button>
                        </div>
                    </div>


                    <div id="theme_editor_gradient" class="theme-editor-tab" style="display: none;">
                        <div class="centerXY">
                            <label for="theme-editor-gcolor1" class="text">Color 1:</label>
                            <input type="color" value="#000000" class="colorInput whiteBorder_colorInput" id="theme-editor-gcolor1"/>
                        </div>
                        <div class="centerXY">
                            <label for="theme-editor-g_color" class="text">Color 2:</label>
                            <input type="color" value="#ffffff" class="colorInput whiteBorder_colorInput" id="theme-editor-g_color"/>
                        </div>
                        <div class="centerXY">
                            <label for="theme-editor-gcolor2" class="text">Text Color:</label>
                            <input type="color" value="#ffffff" class="colorInput whiteBorder_colorInput" id="theme-editor-gcolor2"/>
                        </div>

                        <div class="centerXY" style="gap: 10px">
                            <label for="gradient-type" class="text">Gradient Type:</label>
                            <select id="gradient-type" class="form-control" style="background: #222; color: #fff; width: 120px;">
                                <option value="linear">Linear</option>
                                <option value="radial">Radial</option>
                            </select>
                        </div>

                        <div id="theme-editor-gradient_angle" class="centerY" style="gap: 10px; width: 100%">
                            <label for="g_angle" class="text" id="gradient_angle_text" style="width: 115px;">Angle (0deg):</label>
                            <input type="range" id="g_angle" value="0" min="0" max="360">
                        </div>

                        <div style="background: linear-gradient(0deg, #000, #fff)" class="themes_preview" id="gradient_preview">
                            <span class="text" style="color: #fff; font-size: 9px;">preview</span>
                        </div>
                        <div class="centerY" style="gap: 10px; margin-top: 10px;">
                            <input type="text" class="form-control" style="background: #222; color: #fff;" placeholder="Theme name..." id="GradientThemeName"/>
                            <button class="btn btn-success" id="saveGradientTheme">Save</button>
                        </div>
                    </div>



                    <div id="theme_editor_image" class="theme-editor-tab" style="display: none">
                        <div class="centerXY">
                            <input type="text" id="theme-editor-imagelink" placeholder="Image / GIF URL (https://i.ibb.co/k6hn4v0/Galaxy-Example.png)" class="form-control" style="background: #222; color: #fff"/>
                        </div>
                        <div class="centerXY" style="margin: 5px; gap: 5px;">
                            <label for="theme-editor-textcolorImage" class="text">Text Color: </label>
                            <input type="color" class="colorInput whiteBorder_colorInput" value="#ffffff" id="theme-editor-textcolorImage"/>
                        </div>

                        <div style="background: url('https://i.ibb.co/k6hn4v0/Galaxy-Example.png'); background-position: center; background-size: cover;" class="themes_preview" id="image_preview">
                            <span class="text" style="color: #fff; font-size: 9px;">preview</span>
                        </div>
                        <div class="centerY" style="gap: 10px; margin-top: 10px;">
                            <input type="text" class="form-control" style="background: #222; color: #fff;" placeholder="Theme name..." id="imageThemeName"/>
                            <button class="btn btn-success" id="saveImageTheme">Save</button>
                        </div>
                    </div>
                </main>
            `;

            document.body.append(themeEditor);

            setTimeout(() => {
                const themeTypeSelect = document.getElementById("theme-type-select");
                const colorTab = document.getElementById("theme_editor_color");
                const gradientTab = document.getElementById("theme_editor_gradient");
                const imageTab = document.getElementById("theme_editor_image");
                const gradientAngleDiv = document.getElementById("theme-editor-gradient_angle");

                themeTypeSelect.addEventListener("change", function() {
                    const selectedOption = themeTypeSelect.value;
                    switch (selectedOption) {
                        case "Static Color":
                            colorTab.style.display = "flex";
                            gradientTab.style.display = "none";
                            imageTab.style.display = "none";
                            break;
                        case "Gradient":
                            colorTab.style.display = "none";
                            gradientTab.style.display = "flex";
                            imageTab.style.display = "none";
                            break;
                        case "Image / Gif":
                            colorTab.style.display = "none";
                            gradientTab.style.display = "none";
                            imageTab.style.display = "flex";
                            break;
                        default:
                            colorTab.style.display = "flex";
                            gradientTab.style.display = "none";
                            imageTab.style.display = "none";
                    }
                });

                const colorInputs = document.querySelectorAll("#theme_editor_color .colorInput");
                colorInputs.forEach(input => {
                    input.addEventListener("input", function() {
                        const bgColorInput = document.getElementById("theme-editor-bgcolorinput").value;
                        const textColorInput = document.getElementById("theme-editor-colorinput").value;

                        applyColorTheme(bgColorInput, textColorInput);
                    });
                });

                const gradientInputs = document.querySelectorAll("#theme_editor_gradient .colorInput");
                gradientInputs.forEach(input => {
                    input.addEventListener("input", function() {
                        const gColor1 = document.getElementById("theme-editor-gcolor1").value;
                        const gColor2 = document.getElementById("theme-editor-g_color").value;
                        const gTextColor = document.getElementById("theme-editor-gcolor2").value;
                        const gAngle = document.getElementById("g_angle").value;
                        const gradientType = document.getElementById("gradient-type").value;

                        applyGradientTheme(gColor1, gColor2, gTextColor, gAngle, gradientType);
                    });
                });

                const imageInputs = document.querySelectorAll("#theme_editor_image .colorInput");
                imageInputs.forEach(input => {
                    input.addEventListener("input", function() {
                        const imageLinkInput = document.getElementById("theme-editor-imagelink").value;
                        const textColorImageInput = document.getElementById("theme-editor-textcolorImage").value;

                        let img;
                        if(imageLinkInput == "") {
                            img = "https://i.ibb.co/k6hn4v0/Galaxy-Example.png"
                        } else {
                            img = imageLinkInput;
                        }
                        applyImageTheme(img, textColorImageInput);
                    });
                });
                const image_preview = document.getElementById("image_preview");
                const image_link = document.getElementById("theme-editor-imagelink");

                let isWriting = false;
                let timeoutId;

                image_link.addEventListener("input", () => {
                    if (!isWriting) {
                        isWriting = true;
                    } else {
                        clearTimeout(timeoutId);
                    }

                    timeoutId = setTimeout(() => {
                        const imageLinkInput = image_link.value;
                        const textColorImageInput = document.getElementById("theme-editor-textcolorImage").value;

                        let img;
                        if (imageLinkInput === "") {
                            img = "https://i.ibb.co/k6hn4v0/Galaxy-Example.png";
                        } else {
                            img = imageLinkInput;
                        }

                        applyImageTheme(img, textColorImageInput);
                        isWriting = false;
                    }, 1000);
                });


                const gradientTypeSelect = document.getElementById("gradient-type");
                const angleInput = document.getElementById("g_angle");

                gradientTypeSelect.addEventListener("change", function() {
                    const selectedType = gradientTypeSelect.value;
                    gradientAngleDiv.style.display = selectedType === "linear" ? "flex" : "none";

                    const gColor1 = document.getElementById("theme-editor-gcolor1").value;
                    const gColor2 = document.getElementById("theme-editor-g_color").value;
                    const gTextColor = document.getElementById("theme-editor-gcolor2").value;
                    const gAngle = document.getElementById("g_angle").value;

                    applyGradientTheme(gColor1, gColor2, gTextColor, gAngle, selectedType);
                });


                angleInput.addEventListener("input", function() {
                    const gradient_angle_text = document.getElementById("gradient_angle_text");
                    gradient_angle_text.innerText = `Angle (${angleInput.value}deg): `;
                    const gColor1 = document.getElementById("theme-editor-gcolor1").value;
                    const gColor2 = document.getElementById("theme-editor-g_color").value;
                    const gTextColor = document.getElementById("theme-editor-gcolor2").value;
                    const gAngle = document.getElementById("g_angle").value;
                    const gradientType = document.getElementById("gradient-type").value;

                    applyGradientTheme(gColor1, gColor2, gTextColor, gAngle, gradientType);
                });

                function applyColorTheme(bgColor, textColor) {
                    const previewDivs = document.querySelectorAll("#theme_editor_color .themes_preview");
                    previewDivs.forEach(previewDiv => {
                        previewDiv.style.backgroundColor = bgColor;
                        const textSpan = previewDiv.querySelector("span.text");
                        textSpan.style.color = textColor;
                    });
                }

                function applyGradientTheme(gColor1, gColor2, gTextColor, gAngle, gradientType) {
                    const previewDivs = document.querySelectorAll("#theme_editor_gradient .themes_preview");
                    previewDivs.forEach(previewDiv => {
                        const gradient = gradientType === "linear"
                        ? `linear-gradient(${gAngle}deg, ${gColor1}, ${gColor2})`
                        : `radial-gradient(circle, ${gColor1}, ${gColor2})`;
                        previewDiv.style.background = gradient;
                        const textSpan = previewDiv.querySelector("span.text");
                        textSpan.style.color = gTextColor;
                    });
                }

                function applyImageTheme(imageLink, textColor) {
                    const previewDivs = document.querySelectorAll("#theme_editor_image .themes_preview");
                    previewDivs.forEach(previewDiv => {
                        previewDiv.style.backgroundImage = `url('${imageLink}')`;
                        const textSpan = previewDiv.querySelector("span.text");
                        textSpan.style.color = textColor;
                    });
                }



                const createTheme = document.getElementById("createTheme");
                createTheme.addEventListener("click", () => {
                    themeEditor.style.display = "block";
                });

                const closeThemeEditor = document.getElementById("closeThemeEditor");
                closeThemeEditor.addEventListener("click", () => {
                    themeEditor.style.display = "none";
                });

                let themesDiv = document.getElementById("themes")

                const saveColorThemeBtn = document.getElementById("saveColorTheme");
                const saveGradientThemeBtn = document.getElementById("saveGradientTheme");
                const saveImageThemeBtn = document.getElementById("saveImageTheme");

                saveColorThemeBtn.addEventListener("click", () => {
                    const name = document.getElementById("colorThemeName").value;
                    const bgColorInput = document.getElementById("theme-editor-bgcolorinput").value;
                    const textColorInput = document.getElementById("theme-editor-colorinput").value;

                    if(name == "") return

                    const theme = {
                        name: name,
                        background: bgColorInput,
                        text: textColorInput
                    };

                    const themeCard = document.createElement("div");
                    themeCard.classList.add("theme");
                    let themeBG;
                    if (theme.background.includes("http")) {
                        themeBG = `background: url(${theme.background})`;
                    } else {
                        themeBG = `background: ${theme.background}`;
                    }
                    themeCard.innerHTML = `
                        <div class="themeContent" style="${themeBG}; background-size: cover; background-position: center"></div>
                        <div class="themeName text" style="color: #fff">${theme.name}</div>
                    `;

                    themeCard.addEventListener("click", () => {
                        toggleTheme(theme);
                    });

                    themeCard.addEventListener('contextmenu', (ev) => {
                        ev.preventDefault();
                        if(confirm("Do you want to delete this Theme?")) {
                            themeCard.remove();
                            const themeIndex = modSettings.addedThemes.findIndex((addedTheme) => addedTheme.name === theme.name);
                            if (themeIndex !== -1) {
                                modSettings.addedThemes.splice(themeIndex, 1);
                                localStorage.setItem("sig_modSettings", JSON.stringify(modSettings));
                            }
                        }
                    });

                    themesDiv.appendChild(themeCard);

                    modSettings.addedThemes.push(theme)
                    localStorage.setItem("sig_modSettings", JSON.stringify(modSettings));

                    themeEditor.style.display = "none";
                    themesDiv.scrollTop = themesDiv.scrollHeight;
                });

                saveGradientThemeBtn.addEventListener("click", () => {
                    const name = document.getElementById("GradientThemeName").value;
                    const gColor1 = document.getElementById("theme-editor-gcolor1").value;
                    const gColor2 = document.getElementById("theme-editor-g_color").value;
                    const gTextColor = document.getElementById("theme-editor-gcolor2").value;
                    const gAngle = document.getElementById("g_angle").value;
                    const gradientType = document.getElementById("gradient-type").value;

                    if(name == "") return

                    let gradient_radial_linear = () => {
                        if(gradientType == "linear") {
                            return `${gradientType}-gradient(${gAngle}deg, ${gColor1}, ${gColor2})`
                        } else if (gradientType == "radial") {
                            return `${gradientType}-gradient(circle, ${gColor1}, ${gColor2})`
                        }
                    }
                    const theme = {
                        name: name,
                        background: gradient_radial_linear(),
                        text: gTextColor,
                    };

                    const themeCard = document.createElement("div");
                    themeCard.classList.add("theme");
                    let themeBG;
                    if (theme.background.includes("http")) {
                        themeBG = `background: url(${theme.background})`;
                    } else {
                        themeBG = `background: ${theme.background}`;
                    }
                    themeCard.innerHTML = `
                        <div class="themeContent" style="${themeBG}; background-size: cover; background-position: center"></div>
                        <div class="themeName text" style="color: #fff">${theme.name}</div>
                    `;

                    themeCard.addEventListener("click", () => {
                        toggleTheme(theme);
                    });

                    themeCard.addEventListener('contextmenu', (ev) => {
                        ev.preventDefault();
                        if(confirm("Do you want to delete this Theme?")) {
                            themeCard.remove();
                            const themeIndex = modSettings.addedThemes.findIndex((addedTheme) => addedTheme.name === theme.name);
                            if (themeIndex !== -1) {
                                modSettings.addedThemes.splice(themeIndex, 1);
                                localStorage.setItem("sig_modSettings", JSON.stringify(modSettings));
                            }
                        }
                    });

                    themesDiv.appendChild(themeCard);

                    modSettings.addedThemes.push(theme)
                    localStorage.setItem("sig_modSettings", JSON.stringify(modSettings));

                    themeEditor.style.display = "none";
                    themesDiv.scrollTop = themesDiv.scrollHeight;
                });

                saveImageThemeBtn.addEventListener("click", () => {
                    const name = document.getElementById("imageThemeName").value;
                    const imageLink = document.getElementById("theme-editor-imagelink").value;
                    const textColorImageInput = document.getElementById("theme-editor-textcolorImage").value;

                    if(name == "" || imageLink == "") return

                    const theme = {
                        name: name,
                        background: imageLink,
                        text: textColorImageInput
                    };

                    const themeCard = document.createElement("div");
                    themeCard.classList.add("theme");
                    let themeBG;
                    if (theme.background.includes("http")) {
                        themeBG = `background: url(${theme.background})`;
                    } else {
                        themeBG = `background: ${theme.background}`;
                    }
                    themeCard.innerHTML = `
                        <div class="themeContent" style="${themeBG}; background-size: cover; background-position: center"></div>
                        <div class="themeName text" style="color: #fff">${theme.name}</div>
                    `;

                    themeCard.addEventListener("click", () => {
                        toggleTheme(theme);
                    });

                    themeCard.addEventListener('contextmenu', (ev) => {
                        ev.preventDefault();
                        if(confirm("Do you want to delete this Theme?")) {
                            themeCard.remove();
                            const themeIndex = modSettings.addedThemes.findIndex((addedTheme) => addedTheme.name === theme.name);
                            if (themeIndex !== -1) {
                                modSettings.addedThemes.splice(themeIndex, 1);
                                localStorage.setItem("sig_modSettings", JSON.stringify(modSettings));
                            }
                        }
                    });

                    themesDiv.appendChild(themeCard);

                    modSettings.addedThemes.push(theme)
                    localStorage.setItem("sig_modSettings", JSON.stringify(modSettings));

                    themeEditor.style.display = "none";
                    themesDiv.scrollTop = themesDiv.scrollHeight;
                });
            });









            const b_inner = document.querySelector(".body__inner");
            let bodyColorElements = b_inner.querySelectorAll(
                ".body__inner > :not(.body__inner), #s-skin-select-icon-text"
            );

            const toggleColor = (element, background, text) => {
                let image = `url("${background}")`;
                if (background.includes("http")) {
                    element.style.background = image;
                    element.style.backgroundPosition = "center";
                    element.style.backgroundSize = "cover";
                } else {
                    element.style.background = background;
                }
                element.style.color = text;
            };

            const openSVG = document.querySelector("#clans_and_settings > Button > svg");
            const openSVGPath = document.querySelector("#clans_and_settings > Button > svg > path");
            const newPath = openSVG.setAttribute("fill", "#fff")
            const closeSVGPath = document.querySelector("#cm_close__settings > svg > path");
            openSVG.setAttribute("width", "36")
            openSVG.setAttribute("height", "36")

            const toggleTheme = (theme) => {
                if (theme.text === "#FFFFFF") {
                    openSVGPath.setAttribute("fill", "#fff")
                    closeSVGPath.setAttribute("stroke", "#fff")
                } else {
                    closeSVGPath.setAttribute("stroke", "#222");
                    openSVG.setAttribute("fill", "#222");
                }

                const backgroundColor = theme.background;
                const textColor = theme.text;

                elements.forEach((element) => {
                    const el = document.querySelector(element);
                    toggleColor(el, backgroundColor, textColor);
                });

                bodyColorElements.forEach((element) => {
                    element.style.color = textColor;
                });

                modSettings.Theme = theme.name;
                localStorage.setItem("sig_modSettings", JSON.stringify(modSettings));
            };

            let themes = {
                defaults: [
                    {
                        name: "Dark",
                        background: "#151515",
                        text: "#FFFFFF"
                    },
                    {
                        name: "White",
                        background: "#ffffff",
                        text: "#000000"
                    },
                ],
                orderly: [
                    {
                        name: "THC",
                        background: "linear-gradient(160deg, #9BEC7A, #117500)",
                        text: "#000000"
                    },
                    {
                        name: "4 AM",
                        background: "linear-gradient(160deg, #8B0AE1, #111)",
                        text: "#FFFFFF"
                    },
                    {
                        name: "OTO",
                        background: "linear-gradient(160deg, #A20000, #050505)",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Gaming",
                        background: "https://i.ibb.co/DwKkQfh/BG-1-lower-quality.jpg",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Shapes",
                        background: "https://i.ibb.co/h8TmVyM/BG-2.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Blue",
                        background: "https://i.ibb.co/9yQBfWj/BG-3.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Blue - 2",
                        background: "https://i.ibb.co/7RJvNCX/BG-4.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Purple",
                        background: "https://i.ibb.co/vxY15Tv/BG-5.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Orange Blue",
                        background: "https://i.ibb.co/99nfFBN/BG-6.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Gradient",
                        background: "https://i.ibb.co/hWMLwLS/BG-7.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Sky",
                        background: "https://i.ibb.co/P4XqDFw/BG-9.png",
                        text: "#000000"
                    },
                    {
                        name: "Sunset",
                        background: "https://i.ibb.co/0BVbYHC/BG-10.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Galaxy",
                        background: "https://i.ibb.co/MsssDKP/Galaxy.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Planet",
                        background: "https://i.ibb.co/KLqWM32/Planet.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "colorful",
                        background: "https://i.ibb.co/VqtB3TX/colorful.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Sunset - 2",
                        background: "https://i.ibb.co/TLp2nvv/Sunset.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Epic",
                        background: "https://i.ibb.co/kcv4tvn/Epic.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Galaxy - 2",
                        background: "https://i.ibb.co/smRs6V0/galaxy.png",
                        text: "#FFFFFF"
                    },
                    {
                        name: "Cloudy",
                        background: "https://i.ibb.co/MCW7Bcd/cloudy.png",
                        text: "#000000"
                    },
                ]
            };

            function createThemeCard(theme) {
                const themeCard = document.createElement("div");
                themeCard.classList.add("theme");
                let themeBG;
                if (theme.background.includes("http")) {
                    themeBG = `background: url(${theme.background})`;
                } else {
                    themeBG = `background: ${theme.background}`;
                }
                themeCard.innerHTML = `
                  <div class="themeContent" style="${themeBG}; background-size: cover; background-position: center"></div>
                  <div class="themeName text" style="color: #fff">${theme.name}</div>
                `;

                themeCard.addEventListener("click", () => {
                    toggleTheme(theme);
                });

                if (modSettings.addedThemes.includes(theme)) {
                    themeCard.addEventListener('contextmenu', function(ev) {
                        ev.preventDefault();
                        if (confirm("Do you want to delete this Theme?")) {
                            themeCard.remove();
                            const themeIndex = modSettings.addedThemes.findIndex((addedTheme) => addedTheme.name === theme.name);
                            if (themeIndex !== -1) {
                                modSettings.addedThemes.splice(themeIndex, 1);
                                localStorage.setItem("sig_modSettings", JSON.stringify(modSettings));
                            }
                        }
                    }, false);
                }

                return themeCard;
            }

            const themesContainer = document.getElementById("themes");

            themes.defaults.forEach((theme) => {
                const themeCard = createThemeCard(theme);
                themesContainer.append(themeCard);
            });

            const orderlyThemes = [...themes.orderly, ...modSettings.addedThemes];
            orderlyThemes.sort((a, b) => a.name.localeCompare(b.name));
            orderlyThemes.forEach((theme) => {
                const themeCard = createThemeCard(theme);
                themesContainer.appendChild(themeCard);
            });


            const savedTheme = modSettings.Theme;
            if (savedTheme) {
                let selectedTheme;
                selectedTheme = themes.defaults.find((theme) => theme.name === savedTheme);
                if (!selectedTheme) {
                    selectedTheme = themes.orderly.find((theme) => theme.name === savedTheme) || modSettings.addedThemes.find((theme) => theme.name === savedTheme);
                }

                if (selectedTheme) {
                    toggleTheme(selectedTheme);
                }
            }
        },

        smallMods() {
            let user;
            const welcomeuser = this.welcomeUser;
            setTimeout(() => {
                user = uData.givenName || "Guest";
                welcomeuser.textContent = `Welcome ${user}, to SigMod!`
            }, 1500)

            const gameSettings = document.querySelector(".checkbox-grid");
            gameSettings.innerHTML += `
                <li>
                  <div class="pretty p-svg p-round p-smooth">
                    <input type="checkbox" id="showNames">
                    <div class="state p-success">
                      <svg class="svg svg-icon" viewBox="0 0 20 20">
                        <path d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z" style="stroke: white;fill:white;"></path>
                      </svg>
                      <label>Names</label>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="pretty p-svg p-round p-smooth">
                    <input type="checkbox" id="showSkins">
                    <div class="state p-success">
                      <svg class="svg svg-icon" viewBox="0 0 20 20">
                        <path d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z" style="stroke: white;fill:white;"></path>
                      </svg>
                      <label>Skins</label>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="pretty p-svg p-round p-smooth">
                    <input type="checkbox" id="autoRespawn">
                    <div class="state p-success">
                      <svg class="svg svg-icon" viewBox="0 0 20 20">
                        <path d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z" style="stroke: white;fill:white;"></path>
                      </svg>
                      <label>Auto Respawn</label>
                    </div>
                  </div>
                </li>
                `;

            let autoRespawn = document.getElementById("autoRespawn");
            let autoRespawnEnabled = false;
            autoRespawn.addEventListener("change", () => {
                if(!autoRespawnEnabled) {
                    modSettings.AutoRespawn = true;
                    localStorage.setItem("sig_modSettings", JSON.stringify(modSettings))
                    autoRespawnEnabled = true;
                } else {
                    modSettings.AutoRespawn = false;
                    localStorage.setItem("sig_modSettings", JSON.stringify(modSettings))
                    autoRespawnEnabled = false;
                }
            });

            if(localStorage.getItem("sig_modSettings")) {
                if(modSettings.AutoRespawn) {
                    autoRespawn.checked = true;
                    autoRespawnEnabled = true;
                }
            }

            const gameTitle = document.getElementById("title");
            gameTitle.innerHTML = 'Sigmally<span style="display: block; font-size: 14px; font-family: Comic Sans MS ">Mod by <a href="https://www.youtube.com/@sigmallyCursed/" target="_blank">Cursed</a></span>';

            const nickName = document.getElementById("nick");
            nickName.maxLength = 50;
        },

        saveNames() {
            let savedNames = modSettings.savedNames;
            let savedNamesOutput = document.getElementById("savedNames");
            let saveNameBtn = document.getElementById("saveName");
            let saveNameInput = document.getElementById("saveNameValue");

            const createNameDiv = (name) => {
                let nameDiv = document.createElement("div");
                nameDiv.classList.add("NameDiv");

                let nameLabel = document.createElement("label");
                nameLabel.classList.add("NameLabel");
                nameLabel.innerText = name;

                let delName = document.createElement("button");
                delName.innerText = "X";
                delName.classList.add("delName");

                nameDiv.addEventListener("click", () => {
                    navigator.clipboard.writeText(nameLabel.innerText).then(() => {
                        const copiedAlert = document.createElement("div");
                        copiedAlert.innerHTML = `
                                <span class="text">Added Nickname to clipboard!</span>
                            `;
                        copiedAlert.classList.add("modAlert");
                        setTimeout(() => {
                            copiedAlert.style.opacity = 0;
                            setTimeout(() => {
                                copiedAlert.remove();
                            }, 300)
                        }, 500)
                        document.querySelector(".body__inner").append(copiedAlert)
                    });
                });

                delName.addEventListener("click", () => {
                    if (confirm("Are you sure you want to delete the name '" + nameLabel.innerText + "'?")) {
                        console.log("deleted name: " + nameLabel.innerText);
                        nameDiv.remove();
                        savedNames = savedNames.filter((n) => n !== nameLabel.innerText);
                        modSettings.savedNames = savedNames;
                        localStorage.setItem("sig_modSettings", JSON.stringify(modSettings));
                    }
                });

                nameDiv.appendChild(nameLabel);
                nameDiv.appendChild(delName);
                return nameDiv;
            };

            saveNameBtn.addEventListener("click", () => {
                if (saveNameInput.value == "") {
                    console.log("empty name");
                } else {
                    setTimeout(() => {
                        saveNameInput.value = "";
                    }, 10);

                    if (savedNames.includes(saveNameInput.value)) {
                        console.log("You already have this name saved!");
                        return;
                    }

                    let nameDiv = createNameDiv(saveNameInput.value);
                    savedNamesOutput.appendChild(nameDiv);

                    savedNames.push(saveNameInput.value);
                    modSettings.savedNames = savedNames;
                    localStorage.setItem("sig_modSettings", JSON.stringify(modSettings));
                }
            });

            if (savedNames.length > 0) {
                savedNames.forEach((name) => {
                    let nameDiv = createNameDiv(name);
                    savedNamesOutput.appendChild(nameDiv);
                });
            }
        },

        Macros() {
            const KEY_SPLIT = this.splitKey;
            let ff = null;
            let keydown = false;
            let open = false;


            document.addEventListener("keyup", (e) => {
                if (e.key == modSettings.keyBindingsRapidFeed && keydown) {
                    clearInterval(ff);
                    keydown = false;
                }
            });
            document.addEventListener("keydown", (e) => {
                if (document.activeElement instanceof HTMLInputElement) return;

                if (e.key == "Tab") {
                    e.preventDefault();
                }

                if (e.key == modSettings.keyBindingsToggleMenu) {
                    if (!open) {
                        _cm_settings_open();
                        open = true;
                    } else {
                        document.querySelector("#cm_close__settings").click();
                        open = false;
                    }
                }

                if (e.key === modSettings.keyBindingsSwitchChat) {
                    if (modSettings.showClientChat) {
                        document.getElementById("mainBtn").click();
                    } else {
                        document.getElementById("partyBtn").click();
                    }
                }

                if (e.key == modSettings.keyBindingsFreezePlayer) {
                    const CX = window.innerWidth / 2;
                    const CY = window.innerHeight / 2;

                    this.center(CX, CY);
                }

                if (e.key == modSettings.keyBindingsRapidFeed && !keydown) {
                    keydown = true;
                    function fastMass() {
                        let x = 15;
                        while (x--) {
                            keypress("w", "KeyW");
                        }
                    }
                    ff = setInterval(fastMass, 50);
                }
                if (e.key == modSettings.keyBindingsdoubleSplit) {
                    window.dispatchEvent(new KeyboardEvent("keydown", KEY_SPLIT));
                    window.dispatchEvent(new KeyboardEvent("keyup", KEY_SPLIT));
                    setTimeout(() => {
                        window.dispatchEvent(new KeyboardEvent("keydown", KEY_SPLIT));
                        window.dispatchEvent(new KeyboardEvent("keyup", KEY_SPLIT));
                    }, 50);
                    return;
                }

                if (e.key == modSettings.keyBindingsTripleSplit) {
                    window.dispatchEvent(new KeyboardEvent("keydown", KEY_SPLIT));
                    window.dispatchEvent(new KeyboardEvent("keyup", KEY_SPLIT));
                    setTimeout(() => {
                        window.dispatchEvent(new KeyboardEvent("keydown", KEY_SPLIT));
                        window.dispatchEvent(new KeyboardEvent("keyup", KEY_SPLIT));
                        setTimeout(() => {
                            window.dispatchEvent(new KeyboardEvent("keydown", KEY_SPLIT));
                            window.dispatchEvent(new KeyboardEvent("keyup", KEY_SPLIT));
                        }, 50)
                    }, 50)
                    return;
                }

                if (e.key == modSettings.keyBindingsQuadSplit) {
                    window.dispatchEvent(new KeyboardEvent("keydown", KEY_SPLIT));
                    window.dispatchEvent(new KeyboardEvent("keyup", KEY_SPLIT));
                    setTimeout(() => {
                        window.dispatchEvent(new KeyboardEvent("keydown", KEY_SPLIT));
                        window.dispatchEvent(new KeyboardEvent("keyup", KEY_SPLIT));
                        setTimeout(() => {
                            window.dispatchEvent(new KeyboardEvent("keydown", KEY_SPLIT));
                            window.dispatchEvent(new KeyboardEvent("keyup", KEY_SPLIT));
                            setTimeout(() => {
                                window.dispatchEvent(new KeyboardEvent("keydown", KEY_SPLIT));
                                window.dispatchEvent(new KeyboardEvent("keyup", KEY_SPLIT));
                            }, 50)
                        }, 50)
                    }, 50)
                    return;
                }
            });
        },

        setInputActions() {
            const macroInputs = ["modinput1", "modinput2", "modinput3", "modinput4", "modinput5", "modinput6", "modinput7"];

            macroInputs.forEach((modkey) => {
                const modInput = document.getElementById(modkey);

                document.addEventListener("keydown", (event) => {
                    if (document.activeElement !== modInput) return;

                    if (event.key === "Backspace") {
                        modInput.value = "";
                        let propertyName = modInput.name;
                        modSettings[propertyName] = "";
                        localStorage.setItem("sig_modSettings", JSON.stringify(modSettings));
                        return;
                    }

                    modInput.value = event.key.toLowerCase();

                    if (modInput.value !== "" && (macroInputs.filter((item) => item === modInput.value).length > 1 || macroInputs.some((otherKey) => {
                        const otherInput = document.getElementById(otherKey);
                        return otherInput !== modInput && otherInput.value === modInput.value;
                    }))) {
                        alert("You can't use 2 keybindings at the same time.");
                        setTimeout(() => {modInput.value = ""})
                        return;
                    }


                    let propertyName = modInput.name;
                    modSettings[propertyName] = modInput.value;

                    localStorage.setItem("sig_modSettings", JSON.stringify(modSettings));
                });
            });

        },

        mainMenu() {
            let menucontent = document.querySelector(".menu-center-content");
            menucontent.style.margin = "auto";

            const discordlinks = document.createElement("div");
            discordlinks.setAttribute("id", "dclinkdiv")
            discordlinks.innerHTML = `
                <a href="https://discord.gg/4j4Rc4dQTP" target="_blank" class="dclinks">
                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.4566 5.35132C21.7154 8.83814 22.8309 12.7712 22.4139 17.299C22.4121 17.3182 22.4026 17.3358 22.3876 17.3473C20.6771 18.666 19.0199 19.4663 17.3859 19.9971C17.3732 20.0011 17.3596 20.0009 17.347 19.9964C17.3344 19.992 17.3234 19.9835 17.3156 19.9721C16.9382 19.4207 16.5952 18.8393 16.2947 18.2287C16.2774 18.1928 16.2932 18.1495 16.3287 18.1353C16.8734 17.9198 17.3914 17.6615 17.8896 17.3557C17.9289 17.3316 17.9314 17.2725 17.8951 17.2442C17.7894 17.1617 17.6846 17.0751 17.5844 16.9885C17.5656 16.9725 17.5404 16.9693 17.5191 16.9801C14.2844 18.5484 10.7409 18.5484 7.46792 16.9801C7.44667 16.9701 7.42142 16.9735 7.40317 16.9893C7.30317 17.0759 7.19817 17.1617 7.09342 17.2442C7.05717 17.2725 7.06017 17.3316 7.09967 17.3557C7.59792 17.6557 8.11592 17.9198 8.65991 18.1363C8.69517 18.1505 8.71192 18.1928 8.69442 18.2287C8.40042 18.8401 8.05742 19.4215 7.67292 19.9729C7.65617 19.9952 7.62867 20.0055 7.60267 19.9971C5.97642 19.4663 4.31917 18.666 2.60868 17.3473C2.59443 17.3358 2.58418 17.3174 2.58268 17.2982C2.23418 13.3817 2.94442 9.41613 5.53717 5.35053C5.54342 5.33977 5.55292 5.33137 5.56392 5.32638C6.83967 4.71165 8.20642 4.25939 9.63491 4.00111C9.66091 3.99691 9.68691 4.00951 9.70041 4.03365C9.87691 4.36176 10.0787 4.78252 10.2152 5.12637C11.7209 4.88489 13.2502 4.88489 14.7874 5.12637C14.9239 4.78987 15.1187 4.36176 15.2944 4.03365C15.3007 4.02167 15.3104 4.01208 15.3221 4.00623C15.3339 4.00039 15.3471 3.99859 15.3599 4.00111C16.7892 4.26018 18.1559 4.71244 19.4306 5.32638C19.4419 5.33137 19.4511 5.33977 19.4566 5.35132ZM10.9807 12.798C10.9964 11.6401 10.1924 10.6821 9.18316 10.6821C8.18217 10.6821 7.38592 11.6317 7.38592 12.798C7.38592 13.9639 8.19792 14.9136 9.18316 14.9136C10.1844 14.9136 10.9807 13.9639 10.9807 12.798ZM17.6261 12.798C17.6419 11.6401 16.8379 10.6821 15.8289 10.6821C14.8277 10.6821 14.0314 11.6317 14.0314 12.798C14.0314 13.9639 14.8434 14.9136 15.8289 14.9136C16.8379 14.9136 17.6261 13.9639 17.6261 12.798Z" fill="white"></path>
                    </svg>
                    <span>Sigmally Discord</span>
                </a>
                <a href="https://discord.gg/4j4Rc4dQTP" target="_blank" class="dclinks">
                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.4566 5.35132C21.7154 8.83814 22.8309 12.7712 22.4139 17.299C22.4121 17.3182 22.4026 17.3358 22.3876 17.3473C20.6771 18.666 19.0199 19.4663 17.3859 19.9971C17.3732 20.0011 17.3596 20.0009 17.347 19.9964C17.3344 19.992 17.3234 19.9835 17.3156 19.9721C16.9382 19.4207 16.5952 18.8393 16.2947 18.2287C16.2774 18.1928 16.2932 18.1495 16.3287 18.1353C16.8734 17.9198 17.3914 17.6615 17.8896 17.3557C17.9289 17.3316 17.9314 17.2725 17.8951 17.2442C17.7894 17.1617 17.6846 17.0751 17.5844 16.9885C17.5656 16.9725 17.5404 16.9693 17.5191 16.9801C14.2844 18.5484 10.7409 18.5484 7.46792 16.9801C7.44667 16.9701 7.42142 16.9735 7.40317 16.9893C7.30317 17.0759 7.19817 17.1617 7.09342 17.2442C7.05717 17.2725 7.06017 17.3316 7.09967 17.3557C7.59792 17.6557 8.11592 17.9198 8.65991 18.1363C8.69517 18.1505 8.71192 18.1928 8.69442 18.2287C8.40042 18.8401 8.05742 19.4215 7.67292 19.9729C7.65617 19.9952 7.62867 20.0055 7.60267 19.9971C5.97642 19.4663 4.31917 18.666 2.60868 17.3473C2.59443 17.3358 2.58418 17.3174 2.58268 17.2982C2.23418 13.3817 2.94442 9.41613 5.53717 5.35053C5.54342 5.33977 5.55292 5.33137 5.56392 5.32638C6.83967 4.71165 8.20642 4.25939 9.63491 4.00111C9.66091 3.99691 9.68691 4.00951 9.70041 4.03365C9.87691 4.36176 10.0787 4.78252 10.2152 5.12637C11.7209 4.88489 13.2502 4.88489 14.7874 5.12637C14.9239 4.78987 15.1187 4.36176 15.2944 4.03365C15.3007 4.02167 15.3104 4.01208 15.3221 4.00623C15.3339 4.00039 15.3471 3.99859 15.3599 4.00111C16.7892 4.26018 18.1559 4.71244 19.4306 5.32638C19.4419 5.33137 19.4511 5.33977 19.4566 5.35132ZM10.9807 12.798C10.9964 11.6401 10.1924 10.6821 9.18316 10.6821C8.18217 10.6821 7.38592 11.6317 7.38592 12.798C7.38592 13.9639 8.19792 14.9136 9.18316 14.9136C10.1844 14.9136 10.9807 13.9639 10.9807 12.798ZM17.6261 12.798C17.6419 11.6401 16.8379 10.6821 15.8289 10.6821C14.8277 10.6821 14.0314 11.6317 14.0314 12.798C14.0314 13.9639 14.8434 14.9136 15.8289 14.9136C16.8379 14.9136 17.6261 13.9639 17.6261 12.798Z" fill="white"></path>
                    </svg>
                    <span>SigModz Discord</span>
                </a>
                `;
            document.getElementById("discord_link").remove();
            document.getElementById("menu").appendChild(discordlinks)

            document.querySelector("#cm_modal__settings .ctrl-modal__modal").style.padding = "20px"
        },

        respawn() {
            const __line2 = document.getElementById("__line2")
            const c = document.getElementById("continue_button")
            const p = document.getElementById("play-btn")

            if (__line2.classList.contains("line--hidden")) return

            this.respawnTime = null

            setTimeout(() => {
                c.click()

                setTimeout(() => {
                    p.click()

                    this.respawnTime = Date.now()
                }, 200)
            }, 200)
        },

        donate() {
            // Link: https://Sigmally.sell.app/product/donation
            const Donate = document.createElement("div");
            Donate.classList.add("donate")
            Donate.innerHTML = `
                <span class="text" style="text-align: center;">Donate to get custom color!</span>
                <div style="margin-top: 5px;">
                    <button class="modButton" id="donateBtn" style="background: #3BE15E; width: 200px;">Donate</button>
                    <button class="modButton" id="closeDonate" style="background: #333;">Close</button>
                </div>
            `;

            setTimeout(() => {
                document.getElementById("closeDonate").addEventListener("click", () => {
                    Donate.remove();
                });
                document.getElementById("donateBtn").addEventListener("click", () => {
                    window.open("https://Sigmally.sell.app/product/donation");
                })
            })

            document.body.append(Donate);
        },

        news() {
            const newsMenu = document.createElement("div");
            newsMenu.classList.add("mod_news");
            newsMenu.innerHTML = `
                <img src="https://raw.githubusercontent.com/Sigmally/SigMod/main/images/some_bg.svg" class="mod_news_background" draggable="false">
                <div class="mod_news_header">
                    <h3 class="text">SigMod V${version} | What's new?</h3>
                    <img src="${logo}" width="50" height="48" />
                </div>
                <hr />
                <p>
                   Hi, this is a new version of SigMod, New Features and fixes but you have to keep some things in mind while using this mod.
                </p>
                New features / fixed:
                <ul>
                    <li>
                        Minimap: Show others on minimap who are using the mod. Only people who are in the same tag can see each other. (Default / Mod tag is 0)
                    </li>
                    <li>
                        Splits: Added small delays to split macro so it's not splitting instantly.
                    </li>
                    <li>
                        Autorespawn: It's saving if you have autorespawn on or off so you don't have to enable it everytime you get on sigmally.
                    </li>
                    <li>
                        Themes: Added a Theme Editor so you can add your own themes (static color, gradient, image / gif)
                    </li>
                    <li>
                        Client Chat: If you click on the arrow to make the client chat invisible it's hiding the settings for chat too.
                    </li>
                    <li>
                        Custom Name color: Everyone who donated will get a custom Name color by his / her choice ^^
                    </li>
                </ul>

                <p>There are still some bugs with Client minimap, might be fixed soon. If you find any other bugs or need help, ask me on discord: czrsd or cursd#0126</p>
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div>
                        <button onclick="window.open('https://Sigmally.sell.app/product/donation')" class="btn btn-success">Donate</button>
                    </div>
                    <div class="centerY">
                        <label style="margin-right: 10px" class="text">
                            <input type="checkbox" id="showNewsAgain"/>
                            don't show again
                        </label>
                        <button id="ok_mod_news" class="btn btn-success">OK</button>
                    </div>
                </div>
            `;
            document.body.append(newsMenu);

            if(localStorage.getItem("sig_modSettings")) {
                if (!modSettings.showNews) {
                    newsMenu.remove();
                } else {
                    const showAgain = document.getElementById("showNewsAgain");

                    const ok = document.getElementById("ok_mod_news");
                    ok.addEventListener("click", () => {
                        if(!showAgain.checked) {
                            modSettings.showNews = true;
                        } else {
                            modSettings.showNews = false;
                        }
                        localStorage.setItem("sig_modSettings", JSON.stringify(modSettings));
                        newsMenu.remove();
                    })
                }
            }
        },

        createMenu() {
            this.smallMods();
            this.menu();
            this.news();

            this.donate();

            setTimeout(() => {
                this.Macros();
                this.Themes();
                this.saveNames();
                this.setInputActions();
                this.getColors();
                this.setColors();
                this.mainMenu();

                setInterval(() => {
                    if (document.getElementById("autoRespawn").checked && modSettings.AutoRespawn && this.respawnTime && Date.now() - this.respawnTime >= this.respawnCooldown) {
                        this.respawn();
                    }
                })
            })
        }
    }
    window.setInterval = new Proxy(setInterval, {
        apply(target, _this, args) {
            if (args[1] === (1000 / 7)) {
                args[1] = 0
            }

            return target.apply(_this, args)
        }
    });
    new mod();


    const { arc, fillText, fillRect, drawImage } = CanvasRenderingContext2D.prototype


    CanvasRenderingContext2D.prototype.fillText = new Proxy(fillText, {
        apply(target, _this, args) {
            const [text, x, y] = args;

            for (let i = 0; i < client.specialUsers.length; i++) {
                const s_u = client.specialUsers[i];
                if (text === s_u) {
                    _this.fillStyle = "#dc1818";
                    break;
                }
            }

            return target.apply(_this, args);
        }
    });



    const playBtn = document.getElementById("play-btn")
    const border = {}
    const miniMap = new gt.GTCanvas({
        id: "client-minimap",
        width: 200,
        height: 200
    })

    let viewportScale = 1
    let miniMapReseted = false

    miniMap.appendTo(document.body)

    miniMap.view.style.set({
        pointerEvents: "none",
        position: "absolute",
        float: "right",
        bottom: "0px",
        right: "0px",
        zIndex: "9999999"
    })

    function resizeMiniMap() {
        viewportScale = Math.max(window.innerWidth / 1920, window.innerHeight / 1080)

        miniMap.width = miniMap.height = 200 * viewportScale
    }

    resizeMiniMap()

    window.addEventListener("resize", resizeMiniMap)

    CanvasRenderingContext2D.prototype.drawImage = new Proxy(drawImage, {
        apply(target, _this, args) {
            const [ img, x, y, width, height ] = args

            if (!isMainMenuClosed() && !miniMapReseted) {
                client.ws.send({
                    type: "update-minimap",
                    content: [ null, null, null, null, null ]
                })

                miniMap.context.clear()

                miniMapReseted = true

                return target.apply(_this, args)
            }

            if (img?.src && isMainMenuClosed()) {
                if (typeof img.src === 'string') {
                    miniMap.context.clear();

                    for (const miniMapData of client.miniMapUsersData) {
                        if (!border.width) break
                        if(miniMapData[0] == null && miniMapData[1] == null) {
                            miniMap.context.clear();
                        }

                        if (miniMapData[2] === null) continue

                        const fullX = miniMapData[0] + border.width / 2
                        const fullY = miniMapData[1] + border.width / 2
                        const x = (fullX / border.width) * miniMap.width
                        const y = (fullY / border.width) * miniMap.height

                        miniMap.context.begin(x, y)
                            .setFillColor("red")
                            .circle(2)
                            .end()

                        const minDist = (y - 15.5)
                        const nameYOffset = minDist <= 1 ? -(4.5) : 10

                        miniMap.context.begin(x, y - nameYOffset)
                            .setFillColor("#fff")
                            .setAlign("center")
                            .setFont("9px Ubuntu")
                            .text(miniMapData[2])
                            .end()
                    }
                }
            }

            return target.apply(_this, args)
        }
    })

    function bytesToHex(r, g, b) {
        return ("#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1))
    }

    const __buf = new DataView(new ArrayBuffer(8))

    function Reader(view, offset, littleEndian) {
        this._e = littleEndian;
        if (view)
            this.repurpose(view, offset);
    }

    Reader.prototype = {
        reader: true,
        repurpose: function(view, offset) {
            this.view = view;
            this._o = offset || 0;
        },
        getUint8: function() {
            return this.view.getUint8(this._o++, this._e);
        },
        getInt8: function() {
            return this.view.getInt8(this._o++, this._e);
        },
        getUint16: function() {
            return this.view.getUint16((this._o += 2) - 2, this._e);
        },
        getInt16: function() {
            return this.view.getInt16((this._o += 2) - 2, this._e);
        },
        getUint32: function() {
            return this.view.getUint32((this._o += 4) - 4, this._e);
        },
        getInt32: function() {
            return this.view.getInt32((this._o += 4) - 4, this._e);
        },
        getFloat32: function() {
            return this.view.getFloat32((this._o += 4) - 4, this._e);
        },
        getFloat64: function() {
            return this.view.getFloat64((this._o += 8) - 8, this._e);
        },
        getStringUTF8: function(decode=true) {
            var s = "", b;
            while ((b = this.view.getUint8(this._o++)) !== 0)
                s += String.fromCharCode(b);
            return decode ? decodeURIComponent(escape(s)) : s;
        },
        raw: function(len=0) {
            const buf = this.view.buffer.slice(this._o, this._o + len);
            this._o += len;
            return buf;
        },
    }

    const oldSend = WebSocket.prototype.send
    const C = new Uint8Array(256)
    const R = new Uint8Array(256)

    let cells = new Map()
    let activeCellX = null
    let activeCellY = null
    let handshake = null
    let socket = null

    playBtn.addEventListener("click", () => {
        cells = new Map()
        activeCellX = null
        activeCellY = null
    })

    class Cell {
        constructor({ id }) {
            this.id = id

            this.x = void 0
            this.y = void 0
        }

        setData({ id, x, y }) {
            this.id = id
            this.x = x
            this.y = y
        }
    }

    WebSocket.prototype.send = function(data) {
        if (!socket) {
            socket = this

            socket.id = Math.random()

            socket.addEventListener("close", () => {
                socket = null
                handshake = false
            })

            socket.sendPacket = function(packet) {
                if (packet.build) {
                    return socket.send(packet.build())
                }

                socket.send(packet)
            }

            socket.addEventListener("message", (event) => {
                const reader = new Reader(new DataView(event.data), 0, true)

                if (!handshake) {
                    const ver = reader.getStringUTF8(false)
                    C.set(new Uint8Array(reader.raw(256)))

                    for (const i in C) R[C[i]] = ~~i

                    handshake = true

                    return
                }

                const r = reader.getUint8()

                switch (R[r]) {
                    case 0x10: {
                        let killer, killed, id, node, x, y, s, flags, cell, updColor, updName, updSkin, count, color, name, skin

                        count = reader.getUint16()

                        for (let i = 0; i < count; i++) {
                            killer = reader.getUint32()
                            killed = reader.getUint32()
                        }

                        while (true) {
                            id = reader.getUint32()

                            if (id === 0) break

                            x = reader.getInt16()
                            y = reader.getInt16()
                            s = reader.getUint16()
                            flags = reader.getUint8()
                            updColor = !!(flags & 0x02)
                            updSkin = !!(flags & 0x04)
                            updName = !!(flags & 0x08)
                            color = updColor ? bytesToHex(reader.getUint8(), reader.getUint8(), reader.getUint8()) : null
                            skin = updSkin ? reader.getStringUTF8() : null
                            name = updName ? reader.getStringUTF8() : null

                            if (!cells.get(id)) break

                            activeCellX = x
                            activeCellY = y

                            if (miniMapReseted) {
                                miniMapReseted = false
                            }

                            client.ws.send({
                                type: "update-minimap",
                                content: [ activeCellX, activeCellY, document.getElementById("nick").value, client.currentTag ]
                            })
                        }
                    } break

                    case 0x14: {
                        cells = new Map()
                    } break

                    case 0x20: {
                        const id = reader.getUint32()

                        cells.set(id, new Cell({ id }))
                    } break

                    case 0x40: {
                        border.left = reader.getFloat64()
                        border.top = reader.getFloat64()
                        border.right = reader.getFloat64()
                        border.bottom = reader.getFloat64()

                        border.width = border.right - border.left
                        border.height = border.bottom - border.top
                        border.centerX = (border.left + border.right) / 2
                        border.centerY = (border.top + border.bottom) / 2
                    } break
                }
            })
        }

        return oldSend.apply(this, arguments)
    }
})();