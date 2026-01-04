// ==UserScript==
// @name         Zombs.io Swear Script
// @namespace    http://tampermonkey.net/
// @version      0.1.02
// @description  This is a dumb script that deathrain originally made, i just re-made it. its a swear script
// @author       You
// @match        http://zombs.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425040/Zombsio%20Swear%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/425040/Zombsio%20Swear%20Script.meta.js
// ==/UserScript==
let chat=document.getElementsByClassName('hud-chat-input')[0];function z(){if(chat.value.includes("u")){chat.value=chat.value.replace("u","&#117;")}if(chat.value.includes("i")){chat.value=chat.value.replace("i","&#105;")}if(chat.value.includes("a")){chat.value=chat.value.replace("a","&#97;")}if(chat.value.includes("o")){chat.value=chat.value.replace("o","&#111;")}if(chat.value.includes("U")){chat.value=chat.value.replace("U", "&#85;")}if(chat.value.includes("I")){chat.value=chat.value.replace("I","&#73;")}if(chat.value.includes("A")){chat.value=chat.value.replace("A","&#65l")}if(chat.value.includes("O")){chat.value=chat.value.replace("O","&#79;")}}window.addEventListener('keydown', z);