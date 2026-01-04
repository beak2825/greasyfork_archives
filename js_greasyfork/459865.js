// ==UserScript==
// @name         Glar.io hack chat
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Glar.io online chat
// @author       Dekudo#1414
// @match        *://glar.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=glar.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459865/Glario%20hack%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/459865/Glario%20hack%20chat.meta.js
// ==/UserScript==

+~(async () => {
    const socket = new WebSocket("wss://Glario-chat.codedayer78.repl.co");
    const isChat = () => document.activeElement.tagName === "INPUT";

    let nickname;

    const inter = setInterval(() => {
        if(document.getElementById("lobby-layout").style.display === "block") {
            nickname = document.getElementById("login-input").value;
            clearInterval(inter);
        }
    }, 100)

    const start = () => new Promise(resolve => {
        document.getElementById("login-button").addEventListener("click", () => {
            console.log("started")
            return resolve();
        })
    })

    await start();
    let message = new Array();
    let msg;

    window.addEventListener("keyup", () => {
        if(!isChat()) return;

        const chat = document.activeElement.value;

        message.push(chat);
    })

    window.addEventListener("keyup", event => {
        if(event.code === "Enter" && message[1]) {
            msg = message[message.length - 1];

            if(!msg.startsWith("/g ")) return;

            msg = msg.substring(3, Infinity);

            if(!msg) return new Error("Error! You must enter message");

            socket.send(`[Dekudo chat] \< ${nickname} \>  : ${msg}`);

            message = new Array();
        }
    })

    const div = `
    <div class="chat-container"></div>

    <style>
        .chat-container {
            margin: 0;
            top: 5%;
            left: 50%;
            margin-right: -50%;
            transform: translate(-50%, -50%);
            position: absolute;
            justify-content: center;
            color: #fff;
            font-size: 18px;
        }

        .chat-br {
            margin-top: 0.5px;
        }

        .mess {
          font-family: "Fira Sans", sans-serif;
          user-select: none;
        }
    </style>
    `

    document.body.insertAdjacentHTML("beforeend", div)

    socket.onmessage = msg => {
        const id = Math.floor(Math.random() * 999999);

        document.querySelector(".chat-container").innerHTML += `
           <center id="cnt"> <span class="mess"> <strong id="d_${id}"> </strong> </span> </center> <br class="chat-br">
        `

       document.getElementById(`d_${id}`).insertAdjacentText("beforeend", msg.data);
    }

	setInterval(() => {
		document.querySelector(".chat-container").innerHTML = ``;
	}, 10000);

    setInterval(async () => {
        const mess = document.querySelector(".mess");

        let opacity = 9;

        setInterval(() => {
            opacity--;

            if(!mess) return;

            if(opacity < 0) {
                mess.remove();
                return;
            }

            mess.style.opacity = `.${opacity}`
        }, 100);
    }, 5000)

    setInterval(() => {
        message = new Array();
    }, 7000)
})();