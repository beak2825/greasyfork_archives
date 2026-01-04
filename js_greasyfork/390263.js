// ==UserScript==
// @name         GameChatSaver
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Script created for saving the team/public chat for a game into an HTML file. ***Make sure to load chat before using button. Once chat is loaded, click "save game chat" and select which chat and a name
// @author       JustinR17
// @match        https://www.warzone.com/MultiPlayer?GameID=*
// @require      http://cdn.jsdelivr.net/g/filesaver.js
// @require
// @downloadURL https://update.greasyfork.org/scripts/390263/GameChatSaver.user.js
// @updateURL https://update.greasyfork.org/scripts/390263/GameChatSaver.meta.js
// ==/UserScript==

function saveFile(value, name) {
    var fileBlob = new Blob([value], { type: "text/plain;charset=utf-8" });
    saveAs(fileBlob, name + ".html");
}

function startFile(chat) {
    return "<table style='background-color: black;'><thead>" + chat + "</thead>";
}

function endFile() {
    return "</table>";
}

function formatMessage(curMsg) {
    var playerCol = curMsg.querySelectorAll("div[id^='ujs_LeftCol']")[0];
    var messageCol = curMsg.querySelectorAll("div[id^='ujs_MessageLabel']")[1];

    var fgColour = messageCol.style.color;
    var bgColour = curMsg.querySelectorAll("div[id^='ujs_RightCol']")[1].style.borderImageSource.slice(-16).substring(0, 6);
    if (bgColour == "Bubble") {
        bgColour = "white";
    }

    var playerName = playerCol.querySelectorAll("div[id^='ujs_PlayerNameLabel']")[0].innerText;
    var playerDate = playerCol.querySelectorAll("div[id^='ujs_TimestampLabel']")[0].innerText;

    if (playerName == "Player Name") {
        playerName = "";
    }
    var output = "<tr><td style='background-color: " + bgColour + "; color: " + fgColour + "; padding: 10px; text-align: center;'>";
    output += playerName + "<br>" + playerDate + "</td><td style='background-color: " + bgColour + "; color: " + fgColour + "; padding: 10px'>"
    output += messageCol.innerText + "</td></tr>"
    return output;
}

function formatTurn(curMsg) {
    var output = "<tr><td style='background-color: white; color: black; padding: 10px; text-align: center'>";
    var turn = curMsg.querySelectorAll("div[id^='ujs_TurnLabel']")[0].innerText;
    output += turn + "</td></tr>"
    return output;
}

function doSave() {
    var whichChat = prompt("Type 'team' for team chat and 'public' for public chat", "team");
    if (whichChat == null) {
        return;
    }
    var chatFinal = prompt("Enter a file name: ", document.getElementById("ujs_GameNameLabel").innerText + "-TeamChat");
    if (chatFinal == null) {
        return;
    }

    var date = new Date();
    chatFinal = date.getFullYear() + ("0" + date.getMonth().toString()).slice(-2) + ("0" + date.getDay().toString()).slice(-2) + "-" + chatFinal;

    var output = startFile(chatFinal);
    var chat = document.getElementById("ujs_Content_6");
    if (whichChat.toLowerCase() == "team") {
        chat = document.getElementById("ujs_Content_6");
    } else if (whichChat.toLowerCase() == "public") {
        chat = document.getElementById("ujs_Content_5");
    } else {
        return;
    }

    var childNodes = chat.childNodes;
    for (var i = 0; i < chat.childNodes.length; i++) {
        var curMsg = childNodes[i];
        if (curMsg.id.indexOf("ujs_CenteredContainer") != -1) {
            continue;
        } else if (curMsg.id.indexOf("ujs_ChatTurnSeperator") != -1) {
            output += formatTurn(curMsg);
        } else {
            output += formatMessage(curMsg);
        }
    }
    output += endFile();
    saveFile(output, chatFinal);
}

function getModalButton() {
    return '<button type="button" class="btn btn-primary" id="saveChatButton">Save Game Chat</button>';
}

function initiateSave() {
    var modalButton = document.createElement("div");
    modalButton.innerHTML = getModalButton();

    var navBox = document.getElementsByClassName("navbar-nav")[0];
    navBox.appendChild(modalButton);

    var el = document.getElementById("saveChatButton");
    if (el.addEventListener) {
        el.addEventListener("click", doSave, false);
    } else if (el.attachEvent) {
        el.attachEvent('onclick', doSave);
    }
}

(function() {
    'use strict';
    initiateSave();
})();