// ==UserScript==
// @name        Continuation Mode
// @match       https://sketchful.io/
// @grant       none
// @version     1.0
// @author      Bell
// @description Keeps the drawings from the previous turns
// jshint esversion: 6
// @namespace https://greasyfork.org/users/281093
// @downloadURL https://update.greasyfork.org/scripts/406990/Continuation%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/406990/Continuation%20Mode.meta.js
// ==/UserScript==

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function parseSystemMessage(string) {
    if (string.startsWith("The word was:"))
        freezeCanvas();
    else if (string.endsWith("is drawing now!"))
        unfreezeCanvas();
}

const checkChat = (mutations) => {
    mutations.forEach(mutation => {
        if (!mutation.addedNodes[0] || !mutation.addedNodes[0].classList.contains("chatAdmin"))
            return;
        parseSystemMessage(mutation.addedNodes[0].textContent);
    });
};

const chat = document.querySelector("#gameChatList");
const chatObserver = new MutationObserver(checkChat);
chatObserver.observe(chat, {
    childList: true
});

function freezeCanvas() {
    ctx.fillRect = () => {};
}

function unfreezeCanvas() {
    ctx.fillRect = ctx.constructor.prototype.fillRect;
}