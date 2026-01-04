// ==UserScript==
// @name         Suroi Chat
// @namespace    http://tampermonkey.net/
// @version      2024-03-22
// @description  A simple chat feature for suroi.io
// @author       616c616e
// @match        https://suroi.io/*
// @match        http://suroi.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=suroi.io
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/490531/Suroi%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/490531/Suroi%20Chat.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const old_websocket = WebSocket;
    class new_websocket{
        constructor(url){
            //only if play
            if(url.includes("/play?")){
                var ws = new old_websocket(url);
            }
            else{
                return new old_websocket(url);
            }
            window.ws_url = ws.url;
            console.log("successfully got current ws url", window.ws_url);
            return ws;
        }
    }
    WebSocket = new_websocket;

    function addMsg(jsondata){
        if(jsondata.gameid == window.ws_url.split("gameID=")[1].split("&")[0] &&
           jsondata.region == window.ws_url.split("wss://")[1].split("/play?")[0]){
            var curr_msgs = document.querySelectorAll("#messages-container > .chat-message");
            if(curr_msgs.length > 30){
                curr_msgs[0].remove();
            }
            let new_msg = document.createElement("span");
            new_msg.style.display = "block";
            let bold = document.createElement("b");
            bold.innerText = jsondata.user;
            new_msg.appendChild(bold);
            new_msg.appendChild(
                document.createTextNode(": " + jsondata.content)
            );
            new_msg.setAttribute("class", "chat-message");
            new_msg.style.fontSize = "15px";
            document.querySelector("#messages-container").appendChild(new_msg);
            new_msg.scrollIntoView();
            setTimeout(function(){
                new_msg.remove();
            }.bind(this), 45000);
        }
    }

    function sendMsg(msg){
        window.chat_socket.send(JSON.stringify({
            user: document.getElementById("username-input").value,
            content: msg.replaceAll("\n", ""),
            gameid: window.ws_url.split("gameID=")[1].split("&")[0],
            region: window.ws_url.split("wss://")[1].split("/play?")[0]
        }));
    }

    setInterval(function(){
        if(!window.chat_socket){
            console.log("Chat socket not open, connecting...");
            window.chat_socket = new WebSocket("wss://suroihax.glitch.me/chat");
            window.chat_socket.addEventListener("close", function(evt){
                window.chat_socket = null;
            });
            window.chat_socket.addEventListener("message", function(msg){
                try{
                    addMsg(JSON.parse(msg.data));
                } catch(e){console.log(e)}
            });
        }
    }, 1000);

    window.addEventListener("load", function(){
        let chat_container = document.createElement("div");
        chat_container.style.zIndex = "99999999";
        chat_container.style.position = "absolute";
        chat_container.style.right = (document.querySelector("#weapons-container").getBoundingClientRect().width + 20).toString() + "px";
        chat_container.style.bottom = "10px";
        chat_container.id = "chat-container";
        chat_container.innerHTML = `
    <div id="messages-container"></div>
    <textarea placeholder="[Enter] Send a message" id="chat-textbox" rows="1" cols="30" maxlength="64"></textarea>
    <style>
        #chat-textbox{
            resize: none;
            overflow: hidden;
            background: transparent;
            border: none;
            color: white;
            background-color: rgba(0,0,0,0.5);
            margin: 5px;
        }
        #messages-container{
            max-height: 150px;
            overflow: auto;
            scrollbar-width: thin;
        }
        #messages-container::-webkit-scrollbar-track{
            opacity 0%;
        }
        #messages-container::-webkit-scrollbar-thumb {
            background: grey;
            opacity: 50%
            border-radius: 10px;
        }
        #chat-textbox::placeholder{
            color: white;
        }
        #chat-container{
            overflow-wrap: break-word;
            padding: 10px;
            background-color: rgba(0,0,0,0.4);
        }
        .chat-message{
            margin: 5px;
        }
        body{
            overflow: hidden;
        }
    </style>
    `;
        document.body.appendChild(chat_container);
        document.querySelector("#chat-textbox").addEventListener("keydown", function(e){
            this.value = this.value.replaceAll("\n", "");
            if(e.key == "Enter"){
                if(this.value){
                    try{
                        sendMsg(this.value);
                    } catch{}
                }
                this.blur();
                document.querySelector("#game-ui").focus();
                this.value = "";
                e.preventDefault();
            }
            if(e.key == "Escape"){
                this.blur();
                document.querySelector("#game-ui").focus();
            }
            e.stopPropagation();
        });
        document.querySelector("#messages-container").style.maxWidth = document.querySelector("#chat-textbox").getBoundingClientRect().width.toString() + "px";
        chat_container.addEventListener("wheel", function(e){
            e.stopPropagation();
        })
    });

    window.addEventListener("keydown", function(e){
        if(e.key == "Enter"){
            document.querySelector("#chat-textbox").focus();
            e.preventDefault();
        }
    })

    window.addEventListener("resize", function(e){
        document.querySelector("#chat-container").style.right = (document.querySelector("#weapons-container").getBoundingClientRect().width + 20).toString() + "px";
        document.querySelector("#messages-container").style.maxWidth = document.querySelector("#chat-textbox").getBoundingClientRect().width.toString() + "px";
    });
})();