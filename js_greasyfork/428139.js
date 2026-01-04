// ==UserScript==
// @name        Sneaky Observer
// @namespace   Violentmonkey Scripts
// @match       https://sketchful.io/
// @grant       none
// @version     1.0
// @author      -
// @description 7/5/2020, 11:07:36 PM
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/428139/Sneaky%20Observer.user.js
// @updateURL https://update.greasyfork.org/scripts/428139/Sneaky%20Observer.meta.js
// ==/UserScript==
/* jshint esversion: 8 */
let players = JSON.parse(sessionStorage.getItem("players")) || [];
let you;
// let queuedPlayers = [];
// let guessed = false;

const checkChat = (mutations) => {
    mutations.forEach(mutation => {
        if (!mutation.addedNodes[0]) return;
        if (mutation.addedNodes[0].classList.contains("chatAdmin"))
            parseSystemMessage(mutation.addedNodes[0].textContent);
    });
};

const chat = document.querySelector("#gameChatList");
const chatObserver = new MutationObserver(checkChat);
chatObserver.observe(chat, {
    childList: true
});

const gameObserver = new MutationObserver(mutations => {
    guessed = false;
    if (gameParent.style.display === "none") return;
    setTimeout(() => {
        for (let playerNode of gamePlayerList.childNodes) {
            addPlayer(playerNode);
        }
    }, 150);
});

const gamePlayerList = document.querySelector("#gamePlayersList");
const gameParent = document.querySelector(".game");
gameObserver.observe(gameParent, {
    attributes: true
});

function parseSystemMessage(message) {
    if (message.endsWith("joined the room!") ) {
        setTimeout(() => {
            addPlayer(gamePlayerList.lastChild);
        }, 100);
    } // else {
    //     welcomePlayer(message);
    // }
}

function addPlayer(playerNode) {
	if (!playerNode) return;
    let nameNode = playerNode.querySelector(".gameAvatarName") || 
                   playerNode.querySelector(".gameSettingsAvatarName");
    let newPlayer = {
        name: nameNode.textContent,
        id: /\d+/.exec(playerNode.id)[0]
    };
    if (you && newPlayer.id == you) return;
    else if (chat.childElementCount <= 3 && !you) {
        you = newPlayer.id;
        return;
    }
    for (let player of players) {
        if (player.id === newPlayer.id) {
            if (player.name !== newPlayer.name) 
                appendMsg(`${newPlayer.name} is ${player.name}`, "#9300FF");
            return;
        }
    }
    // if (nameNode.style.color !== "black" && nameNode.style.color !== "teal" && nameNode.style.color !== "#ccc") {
    //     alert("Mod");  
    //     // console.log(nameNode.style.color);
    //     // console.log("Moderator joined, leaving");
    //     // document.querySelector("#exitModalButton").click();
    // }
    players.push(newPlayer);
    sessionStorage.setItem("players", JSON.stringify(players));
    // console.log(players);
    // if (guessed) {
    //     queuedPlayers.push(newPlayer.name);
    // } else if (players[0].name !== newPlayer.name) {
    //     sendChat("welc " + newPlayer.name);
    // }
}

function appendMsg(text, color) {
    let msg = document.createElement("LI");
    msg.classList.add("chatAdmin");
    msg.style.fontWeight = "600";
    msg.style.color = color;
    msg.textContent = text;
    chat.appendChild(msg);
    msg.scrollIntoView();
}

// function welcomePlayer(message) {
//     if (message === "You guessed the word!") {
//         guessed = true;
//     } else if (message.includes("word was:")) {
//         guessed = false;
//         queuedWelcome();
//     }
    // if (!queuedPlayers.length) return;
    // queuedPlayers.forEach(player => {
    //     if (message.includes(player) && message.includes("guessed")) {
    //         sendChat("welc " + player);
    //     }
    // })
    // console.log(guessed);
// }

// function queuedWelcome() {
//     if (!queuedPlayers.length) return;  
//     sendChat("welc " + queuedPlayers.join(', '));
//     queuedPlayers = [];
// }
