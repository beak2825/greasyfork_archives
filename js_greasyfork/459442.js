// ==UserScript==
// @name         Krew.io Cheats
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Krew.io hacks
// @author       You
// @match        https://krew.io
// @match        https://www.krew.io
// @icon         https://i.ytimg.com/vi/BXIQDSGqJoU/maxresdefault.jpg
// @grant        none
// @run-at       document-end
// @locale       *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459442/Krewio%20Cheats.user.js
// @updateURL https://update.greasyfork.org/scripts/459442/Krewio%20Cheats.meta.js
// ==/UserScript==

(function () {
    "use strict";

    function x() {

        let filter = ["fck", "fuck", "fkk", "n1gga", "btch", "fcker", "mothefkcer", "http", "www", "io"];
        let chat_timeout = 2;
        let HTML = document || body;
        let DBG = [0, 0];
        let check;

        let overlay = HTML.createElement("div");
        overlay.innerHTML = overlayHTML;
        HTML.body.appendChild(overlay);

        document.getElementById('checkbox_enable_chat_troll').addEventListener('change', function () {
            if (this.checked) {
                let last_message = '';
                check = setInterval(function () {
                    let div = document.querySelector("#chat-history").querySelectorAll('.global-chat.text-white');
                    let lastChatDiv = div[div.length - 1];
                    if (lastChatDiv && lastChatDiv.innerText !== last_message) {
                        let new_date = Date.now();
                        if (new_date - DBG[1] >= chat_timeout * 1000) {
                            DBG[1] = new_date;
                            last_message = lastChatDiv.innerText;
                            let messageparts = last_message.split(':');
                            if (messageparts.length > 1) {
                                let filteredMessage = messageparts[1].trim().split(" ").map(function (datatext) {
                                    if (filter.indexOf(datatext) !== -1) {
                                        return "|".repeat(datatext.length);
                                    } else {
                                        return datatext;
                                    }
                                }).join(" ");
                                send_packet_msg(filteredMessage);
                            }
                        }
                    }
                }, Math.floor(Math.random() * 191) + 110);
            } else {
                clearInterval(check);
            }
        });

        const send_packet_msg = data => {
            document.getElementById("chat-message").value = data;
            document.getElementById("chat-message").dispatchEvent(new KeyboardEvent('keypress', { 'which': 13, 'keyCode': 13 }));
        }

    }

    let overlayHTML = `
    <div id="a">
    <div id="a1">
        <h2 id="header">Menu</h2>
        <div id="css_line"></div>
        <div id="container">
            <input type="checkbox" id="checkbox_enable_chat_troll" name="chat_troll_parent" />
            <label id="checkbox_enable_chat_troll_font" for="chat_troll_parent">Chat troll</label>

        </div>
    </div>
    <div id="menu_footer">Made by Dewey 4 you.</div>
</div>

<style>
    #menu_footer {
        color: white;
        position: absolute;
        bottom: 7px;
        margin-left: 20px;
        text-align: center;
        font-size: 15px;
    }
    #container {
        position: absolute;
        top: 80px;
        left: 15px;
    }
    #a {
        z-index: 10;
        position: absolute;
        bottom: 40%;
        left: 10px;
        background: #28282b;
        width: 200px;
        height: 300px;
        border-radius: 6px;
    }
    #a1 {
        padding: 15px;
        margin-bottom: 5px;
    }
    #header {
        font-family: sans-serif;
        font-size: 3vh;
        background: white;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    #checkbox_enable_chat_troll {
        width: 20px;
        height: 20px;
    }
    #checkbox_enable_chat_troll_font {
        color: white;
        display: inline-block;
        vertical-align: middle;
        margin-top: -14px;
    }

    #css_line {
        background: white;
        border-radius: 5px;
        width: 170px;
        height: 5px;
    }
</style>
  `;
    setTimeout(x, 1000);
})();