// ==UserScript==
// @name         Discord Reaction Spammer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @author       You
// @match        *://discord.com/*
// @grant        none
// @description This script adds a button in Discord's text box that allows you to automatically add reactions to new messages in text channels for however long is specified. Note: If a channel does not allow reactions, some odd things might happen.
// @downloadURL https://update.greasyfork.org/scripts/405874/Discord%20Reaction%20Spammer.user.js
// @updateURL https://update.greasyfork.org/scripts/405874/Discord%20Reaction%20Spammer.meta.js
// ==/UserScript==

// Grab token to send messages

window.onload = (() => {
var frame = document.createElement('iframe');
    frame.style.display = "none"; // Ensure this is hosted on the same domain
    document.body.appendChild(frame)
    window.tkn = JSON.parse(frame.contentWindow.localStorage.token)
})();

// create all elements

const spamMenu = document.createElement("div");
const spamInput = document.createElement("input");
const spamButton = document.createElement("button");
const spamEnter = document.createElement("button");

spamMenu.className = "hiddenclass spamMenu";
spamButton.className = "hiddenclass spamButton";
spamInput.className = "hiddenclass spamInput";
spamEnter.className = "hiddenclass spamEnter";

const style = document.createElement("style");
style.classList.add("customstyles"); // to detect it later on
style.type = "text/css";
style.innerHTML =
  ".spamMenu { border-radius: 8px; background-color: #2f3136; height: 0px; width: 250px; overflow: hidden; z-index: 1; position: absolute; right: 0; bottom: calc(100% + 8px);  box-shadow: none; transition: all 0.2s; }" +
  ".spamInput { padding: 2px; width: 150px; height: 30px; background: #40444B; color: #dcddde; border: none; border-radius: 8px; position: absolute; overflow: hidden; margin-left: 48px; margin-top: 35px; }" +
  ".spamButton { letter-spacing: 0.4px; font-weight: bold; width: 50px; color: #CECECE; transition: all 0.2s ease-in; background:var(--bg-overlay-app-frame)} .spamButton:hover { color: #FFFFFF } " +
  ".spamEnter { background: #7289DA; color: white; border-radius: 8px; border: none; height: 32px; width: 60px; margin-top: 85px; margin-left: 95px; }" +
  ".spamMenuActive { box-shadow: 0 0 0 1px rgba(4,4,5,0.15), 0 8px 16px rgba(0,0,0,0.24); height: 150px; display: block; }" +
  ".spamButtonActive { color: #FFFFFF }";

// from https://stackoverflow.com/questions/1720320/how-to-dynamically-create-css-class-in-javascript-and-apply
// much better than the "system" I had previously

setInterval(() => {
  // main function that does the actual spamming

  function theBestSpammer(sec) {
    let emojiarray = ["😀", "😁", "😂", "🤣", "😃", "🥵", "🤑", "😎", "😲"];
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

  // detect if the styles have been added yet
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
    spamInput.addEventListener("keyup", function (event) {
      if (event.keyCode === 13) {
        spamEnter.click();
        document.querySelector('body').click();
      }
    });
    spamEnter.innerText = "Spam!";
    spamEnter.onclick = () => {
      theBestSpammer(
        parseInt(document.querySelector("input.hiddenclass").value)
      );
      spamButton.click();
    };
  }
}, 50);


