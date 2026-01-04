// ==UserScript==
// @name         ClanChatSaver
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Script created for saving the clan chat into an HTML file. ***Make sure to load chat before using button. Once chat is loaded, click "save clan chat" and select which chat and a name
// @author       JustinR17
// @match        https://www.warzone.com/MultiPlayer?ChatRoom=*
// @grant        none
// @require      http://cdn.jsdelivr.net/g/filesaver.js
// @require
// @downloadURL https://update.greasyfork.org/scripts/390235/ClanChatSaver.user.js
// @updateURL https://update.greasyfork.org/scripts/390235/ClanChatSaver.meta.js
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
    var playerCol = curMsg.querySelectorAll("div[id^='ujs_LeftCol']")[0].innerText;
    var messageCol = curMsg.querySelectorAll("div[id^='ujs_Message']")[1];
    var fgColour = messageCol.style.color;
    var bgColour = curMsg.querySelectorAll("div[id^='ujs_BubbleImage']")[1].style.borderImageSource.slice(-16).substring(0, 6);
    if (bgColour == "Bubble") {
        bgColour = "white";
    }
    if (playerCol == "Player Name") {
        playerCol = "";
    }
    var output = "<tr><td style='background-color: " + bgColour + "; color: " + fgColour + "; padding: 10px; text-align: center;'>";
    output += playerCol + "</td><td style='background-color: " + bgColour + "; color: " + fgColour + "; padding: 10px'>"
    output += messageCol.innerText + "</td></tr>"
    return output;
}

function doSave() {
    var chatFinal = prompt("Enter a file name: ", "chat");
    if (chatFinal == null) {
        return;
    }
    var date = new Date();
    chatFinal = date.getFullYear() + ("0" + date.getMonth().toString()).slice(-2) + ("0" + date.getDay().toString()).slice(-2) + "-" + chatFinal;

    var output = startFile(chatFinal);
    var chat = document.getElementById("ujs_ChatContainer_2");
    var childNodes = chat.childNodes;
    for (var i = 0; i < chat.childNodes.length; i++) {
        var curMsg = childNodes[i];
        output += formatMessage(curMsg);
    }
    output += endFile();
    saveFile(output, chatFinal);
}

function getModalButton() {
    return '<button type="button" class="btn btn-primary" id="saveChatButton">Save Clan Chat</button>';
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