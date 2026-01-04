// ==UserScript==
// @name         Swear script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  lets toy swear in zombs
// @author       deathrain
// @match        *://zombs.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424104/Swear%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/424104/Swear%20script.meta.js
// ==/UserScript==UUUUPP
 
var chat = $("hud-chat-input");
function ChatSwear() {
    if (chat.value.includes("fuck")) {
        chat.value = chat.value.replace("fuck", "f&#117ck");
    }
    if (chat.value.includes("FUCK")) {
        chat.value = chat.value.replace("FUCK", "F&#85CK");
    }
    if (chat.value.includes("ass")) {
        chat.value = chat.value.replace("ass", "&#97ss");
    }
    if (chat.value.includes("ASS")) {
        chat.value = chat.value.replace("ASS", "&#65SS");
    }
    if (chat.value.includes("bitch")) {
        chat.value = chat.value.replace("bitch", "b&#105tch");
    }
    if (chat.value.includes("BITCH")) {
        chat.value = chat.value.replace("BITCH", "B&#73TCH");
    }
    if (chat.value.includes("cunt")) {
        chat.value = chat.value.replace("cunt", "c&#117nt");
    }
    if (chat.value.includes("CUNT")) {
        chat.value = chat.value.replace("CUNT", "C&#85NT");
    }
    if (chat.value.includes("shit")) {
        chat.value = chat.value.replace("shit", "sh&#105t");
    }
    if (chat.value.includes("SHIT")) {
        chat.value = chat.value.replace("SHIT", "SH&#73T");
    }
}
document.addEventListener("keydown", ChatSwear);