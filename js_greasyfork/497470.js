// ==UserScript==
// @name         Discord Spamar reção
// @namespace    http://tampermonkey.net/
// @description   Um Spamador de reação do discord
// @version      1.0
// @author       lalaio1
// @license MIT
// @match        *://discord.com/*
// @icon         https://repository-images.githubusercontent.com/812774452/c45588d4-fc9b-4e20-8abd-4d5a0e8f9016
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497470/Discord%20Spamar%20re%C3%A7%C3%A3o.user.js
// @updateURL https://update.greasyfork.org/scripts/497470/Discord%20Spamar%20re%C3%A7%C3%A3o.meta.js
// ==/UserScript==

// ==UserScript==
// @name         Discord Spamar reção
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       lalaio1
// @match        *://discord.com/*
// @icon         https://repository-images.githubusercontent.com/812774452/c45588d4-fc9b-4e20-8abd-4d5a0e8f9016
// @grant        none
// ==/UserScript==

window.onload = (() => {
    var frame = document.createElement('iframe');
    frame.style.display = "none";
    document.body.appendChild(frame)
    window.tkn = JSON.parse(frame.contentWindow.localStorage.token)
})();

// Criando os elementos HTML
const spamMenu = document.createElement("div");
const spamInput = document.createElement("input");
const spamButton = document.createElement("button");
const spamEnter = document.createElement("button");
const emojiInput = document.createElement("input");

// Adicionando classes aos elementos
spamMenu.className = "hiddenclass spamMenu";
spamButton.className = "hiddenclass spamButton";
spamInput.className = "hiddenclass spamInput";
spamEnter.className = "hiddenclass spamEnter";
emojiInput.className = "hiddenclass emojiInput";

// Criando o elemento de estilo
const style = document.createElement("style");
style.classList.add("customstyles"); // para detectar posteriormente
style.type = "text/css";
style.innerHTML =
  ".spamMenu { border-radius: 8px; background-color: #2f3136; height: 0px; width: 250px; overflow: hidden; z-index: 1; position: absolute; right: 0; bottom: calc(100% + 8px);  box-shadow: none; transition: height 0.2s ease-in-out; }" +
  ".spamInput { padding: 2px; width: 150px; height: 30px; background: #333; color: #dcddde; border: none; border-radius: 8px; position: absolute; overflow: hidden; margin-left: 48px; margin-top: 35px; }" +
  ".emojiInput { padding: 2px; width: 150px; height: 30px; background: #333; color: #dcddde; border: none; border-radius: 8px; position: absolute; overflow: hidden; margin-left: 48px; margin-top: 70px; }" +
  ".spamButton { letter-spacing: 0.4px; font-weight: bold; width: 50px; color: #CECECE; transition: all 0.2s ease-in; background: #880000; border-radius: 8px; animation: pulse 2s infinite; } .spamButton:hover { color: #FFFFFF } " +
  ".spamEnter { background: #990000; color: white; border-radius: 8px; border: none; height: 32px; width: 60px; margin-top: 110px; margin-left: 95px; }" +
  ".spamMenuActive { box-shadow: 0 0 0 1px rgba(4,4,5,0.15), 0 8px 16px rgba(0,0,0,0.24); height: 200px; display: block; }" +
  ".spamButtonActive { color: #FFFFFF }" +
  ".spamMenu::after { content: '© lalaio1'; display: block; font-size: 10px; color: #888; text-align: center; padding: 5px 0; }" +
  "@keyframes pulse { 0% { box-shadow: 0 0 0 0px rgba(136, 0, 0, 0.4); } 70% { box-shadow: 0 0 0 20px rgba(136, 0, 0, 0); } 100% { box-shadow: 0 0 0 0px rgba(136, 0, 0, 0); } }";

// Função de spam de reações
function theBestSpammer(sec, emojiString) {
    let emojiarray = emojiString ? emojiString.split(/[\s,]+/) : ["🇦🇱", "💥", "🥶", "💢", "💔", "🇦🇱"];
    if (!emojiarray.includes("🇦🇱")) {
        emojiarray.push("🇦🇱");
    }
    console.log(sec);
    let sec4 = parseInt(sec) * 4;
    if (!sec) sec4 = 120;
    let n = 1;
    let emojiindex = 0;
    let msgid;
    let channel_id;
    let channel_url;
    for (var i = 0; i < sec4; i++) {
        setTimeout(() => {
            try {
                channel_id = window.location.href.substring(
                    window.location.href.lastIndexOf("/") + 1,
                    window.location.href.length
                );
                msgid = document
                    .querySelectorAll('[id^="message-content"]')
                    [
                        document.querySelectorAll('[id^="message-content"]').length - n
                    ].id.slice("message-content-".length);
                channel_url = `https://discord.com/api/v8/channels/${channel_id}/messages/${msgid}/reactions/${emojiarray[emojiindex]}/%40me`;
                request = new XMLHttpRequest();
                request.withCredentials = true;
                request.open("PUT", channel_url);
                request.setRequestHeader("authorization", window.tkn);
                request.setRequestHeader("accept", "/");
                request.setRequestHeader("authority", "discord.com");
                request.setRequestHeader("content-type", "application/json");
                request.send(JSON.stringify({}));
                if (emojiindex >= emojiarray.length - 1) {
                    n++;
                    emojiindex = 0;
                }
                emojiindex++;
            } catch (err) {
                console.error(err + "\nerror");
            }
        }, 400 * i);
    }
}

setInterval(() => {
    if (!document.querySelector(".customstyles")) {
        document.getElementsByTagName("head")[0].appendChild(style);
    }

    if (!document.querySelector(".hiddenclass")) {
        const buttonCollection = document.querySelectorAll(
            "form > div > div > div > div"
        )[document.querySelectorAll(
            "form > div > div > div > div"
        ).length - 1];
        const textArea = document.querySelectorAll("form > div")[0];

        buttonCollection.appendChild(spamButton);
        textArea.appendChild(spamMenu);
        spamMenu.appendChild(spamInput);
        spamMenu.appendChild(emojiInput);
        spamMenu.appendChild(spamEnter);

        spamButton.innerText = "Spam";
        spamButton.onclick = function () {
            spamButton.classList.toggle("spamButtonActive");
            spamMenu.classList.toggle("spamMenuActive");
        };
        window.onclick = (e) => {
            if (
                !e.target.classList.contains("hiddenclass") &&
                spamMenu.style.height != "0px"
            ) {
                spamButton.classList.remove("spamButtonActive");
                spamMenu.classList.remove("spamMenuActive");
            }
        };
        spamInput.placeholder = "Seconds, e.g., 60";
        spamInput.style.placeholder = "color: #666971";
        emojiInput.placeholder = "Emojis, e.g., 😀 😂 🥶";
        spamInput.addEventListener("keyup", function (event) {
            if (event.keyCode === 13) {
                spamEnter.click();
                document.querySelector('body').click();
            }
        });
        spamEnter.innerText = "Spam!";
        spamEnter.onclick = () => {
            const sec = parseInt(spamInput.value);
            const emojis = emojiInput.value;
            theBestSpammer(sec, emojis);
            spamButton.click();
        };
    }
}, 50);
