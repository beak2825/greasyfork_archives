// ==UserScript==
// @name         Trollbox Ping
// @namespace    trollboxping
// @version      1.1
// @description  Pings you when somones says your name on Trollbox.
// @author       1024x2
// @match        *://*.windows93.net/trollbox/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370279/Trollbox%20Ping.user.js
// @updateURL https://update.greasyfork.org/scripts/370279/Trollbox%20Ping.meta.js
// ==/UserScript==

function handleMsg(event) {
  if (event.target.parentNode.id == "trollbox_scroll") {
    if (event.target.children[2].innerText.includes(pseudo.replace(/​/g, "")) && event.target.children[1].innerText != "→" &&
        event.target.children[1].innerText != "←" && event.target.children[1].innerText != "~") {
      new Audio("https://canary.discordapp.com/assets/dd920c06a01e5bb8b09678581e29d56f.mp3").play();
      event.target.children[2].style.backgroundColor = "rgba(255, 255, 0, 0.25)";
    }
  }
}

document.getElementById("trollbox_scroll").addEventListener("DOMNodeInserted", handleMsg);