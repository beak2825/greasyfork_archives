// ==UserScript==
// @name         Discord Reaction Spammer for Nintendo Ninji
// @namespace    http://tampermonkey.net/
// @version      0.3
// @author       You
// @match        *://discord.com/*
// @match        https://discordbotclient.jtmaveryk.repl.co/*
// @grant        none
// @description This script adds a button in Discord's text box that allows you to automatically add reactions to new messages in text channels for however long is specified. Note: If a channel does not allow reactions, some odd things might happen.
// @downloadURL https://update.greasyfork.org/scripts/422246/Discord%20Reaction%20Spammer%20for%20Nintendo%20Ninji.user.js
// @updateURL https://update.greasyfork.org/scripts/422246/Discord%20Reaction%20Spammer%20for%20Nintendo%20Ninji.meta.js
// ==/UserScript==
var token;
    window.onload = (function() {
        let popup;
        popup = window.open('');
        if (!popup) return alert('Popup blocked! Please allow popups and try again.');
        popup.document.write("Getting token...");
        window.dispatchEvent(new Event('beforeunload'));
        window.tkn = JSON.parse(popup.localStorage.token);
        popup.close();
        token = window.tkn;
    })();
setInterval(() => {
    function theBestSpammer(sec) {
        let emojiarray = ["<:CatIggy:814172264584708117>","<:IggyKoopa:814168454042091600>"]
        console.log(sec)
        let sec4 = parseInt(sec) * 4
        if (!sec) sec4 = 120
        let n = 1
        let emojiindex = 0;
        let msgid;
        let channel_id;
        let channel_url
        for (var i = 0; i<sec4; i++) {
            setTimeout(() => {
                try {
                    channel_id = (window.location.href.substring(
                    window.location.href.lastIndexOf("/") + 1,
                    window.location.href.length));
                    msgid = document.querySelectorAll(".message-2qnXI6")[document.querySelectorAll(".message-2qnXI6").length - n].id.substr("chat-messages-".length)
                    channel_url = `https://discord.com/api/v8/channels/${channel_id}/messages/${msgid}/reactions/${emojiarray[emojiindex]}/%40me`
                    request = new XMLHttpRequest();
                    request.withCredentials = true;
                    request.open("PUT", channel_url);
                    request.setRequestHeader("authorization", token);
                    request.setRequestHeader("accept", "/");
                    request.setRequestHeader("authority", "discord.com");
                    request.setRequestHeader("content-type", "application/json");
                    request.send(JSON.stringify({}));
                    if (emojiindex >= emojiarray.length - 1) {
                        n++
                        emojiindex = 0
                    }
                    emojiindex++
                } catch(err) {
                    console.error(err + "\nerror")
                }
            }, 250 * i)
        }
    }
    if (!document.querySelector(".hiddenclass")) {
        var buttonCollection = document.querySelector(".buttons-3JBrkn")
    var textArea = document.querySelector(".channelTextArea-rNsIhG.channelTextArea-2VhZ6z")
    var spamMenu = document.createElement("div")
    var spamInput = document.createElement("input")
    var spamButton = document.createElement("button")
    var spamEnter = document.createElement("button")
    spamButton.className = "hiddenclass buttonWrapper-1ZmCpA button-38aScr colorBrand-3pXr91 grow-q77ONN noFocus-2C7BQj"
    spamButton.style = "letter-spacing: 0.4px; font-weight: bold; width: 50px; color: #CECECE; transition: all 0.2s ease-in;"
    spamButton.innerText = "Spam"
    spamButton.onmouseover = function() {this.style.color = "#FFFFFF"}
    spamButton.onmouseout = function() {if (this.classList.contains("active") != true) {this.style.color = "#CECECE"}}
    spamButton.onclick = function() {
        if (spamMenu.style.height === "0px") {
            spamMenu.style.display = "block"
            setTimeout(() => {
                spamMenu.style.height = "150px"
                spamMenu.style.boxShadow = "0 0 0 1px rgba(4,4,5,0.15), 0 8px 16px rgba(0,0,0,0.24)"
            }, 100);
            spamButton.classList.add("active")
        } else {
            spamMenu.style.height = "0px"
            spamMenu.style.boxShadow = "none"
            setTimeout(() => {
                spamMenu.style.display = "none"
            }, 200);
            spamButton.classList.remove("active")
        }
    }
    window.onclick = e => {
        if (e.target.classList.contains("hiddenclass") == false && spamMenu.style.height != "0px") {
            spamMenu.style.height = "0px"
            spamMenu.style.boxShadow = "none"
            setTimeout(() => {
                spamMenu.style.display = "none"
            }, 200);
            spamButton.classList.remove("active")
            spamButton.style.color = "#CECECE"
        }
    }
    spamMenu.classList.add("hiddenclass")
    spamInput.classList.add("hiddenclass")
    spamMenu.style = "border-radius: 8px; background-color: #2f3136; height: 0px; width: 250px; overflow: hidden; z-index: 1; position: absolute; right: 0; bottom: calc(100% + 8px); box-shadow: none; transition: all 0.2s;"
    spamInput.style = "padding: 2px; width: 150px; height: 30px; background: #40444B; color: #dcddde; border: none; border-radius: 8px; position: absolute; overflow: hidden; margin-left: 48px; margin-top: 35px;"
    spamInput.placeholder = "Seconds, e.g., 60"
    spamInput.style.placeholder = "color: #666971"
    spamInput.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            spamEnter.click();
        }
    })
    spamEnter.classList.add("hiddenclass")
    spamEnter.style = "background: #7289DA; color: white; border-radius: 8px; border: none; height: 32px; width: 60px; margin-top: 85px; margin-left: 95px;"
    spamEnter.innerText = "Spam!"
    spamEnter.onclick = () => {theBestSpammer(parseInt(document.querySelector("input[class=\"hiddenclass\"]").value)); spamButton.click()}
    buttonCollection.appendChild(spamButton)
    textArea.appendChild(spamMenu)
    spamMenu.appendChild(spamInput)
    spamMenu.appendChild(spamEnter)
    }
}, 50)