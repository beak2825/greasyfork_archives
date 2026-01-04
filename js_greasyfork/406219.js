// ==UserScript==
// @name        Focus Chat
// @namespace   https://greasyfork.org/users/281093
// @match       https://sketchful.io/
// @grant       none
// @version     1.1
// @author      Bell
// @description Focuses the chat when you type if you aren't drawing
// @downloadURL https://update.greasyfork.org/scripts/406219/Focus%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/406219/Focus%20Chat.meta.js
// ==/UserScript==

document.addEventListener("keydown", focusChat, false);

function focusChat(e) {
    if (document.querySelector("#gameSettings").style.display !== "none") return;
    !isDrawing() && !e.ctrlKey && document.querySelector("#gameChatInput").focus();
}

function isDrawing() {
    return document.querySelector("#gameTools").style.display !== "none" &&
           document.querySelector("body > div.game").style.display !== "none" &&
           document.activeElement !== document.querySelector("#gameChatInput");
}