// ==UserScript==
// @name           Kongregate Palacsinta Chat Bot
// @namespace      GilGames
// @description    Read the kongregate chat messages, send them to the server and automate the responses
// @include        https://www.kongregate.com/games/*
// @version        0.0.2.11
// @downloadURL https://update.greasyfork.org/scripts/35839/Kongregate%20Palacsinta%20Chat%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/35839/Kongregate%20Palacsinta%20Chat%20Bot.meta.js
// ==/UserScript==
WriteLog("TEST");

var latestHash = "";

function InitializeAndStart() {

    WriteLog("GilGames Chat Watcher V 1.0 initializing.");

    // This method will check new messages and will handle 
    // any command which should be showed as a response to this message
    checkNewMessages();
}


function checkNewMessages() {
    // check for any new element being inserted here,
    // or a particular node being modified

    var textBoxes = document.getElementsByClassName("chat-message");

    if (textBoxes.length > 0) {
        var messageWrapper = textBoxes[textBoxes.length - 1].children[0];
        var messageContainer = messageWrapper.childNodes;

        var isWhisper = "0";

        if (messageWrapper.className.indexOf("whisper") !== -1)
            isWhisper = "1";


        var localDate = messageContainer[0].innerHTML;
        var user = messageContainer[1].innerHTML;
        var message = messageContainer[3].innerHTML;
        var hashCode = HashCode(localDate + user + message);

        if (isWhisper === "1") {
            message = message.substring(0, message.indexOf("&nbsp;"));
        }

        if (latestHash !== hashCode) {
            SendMessageToServer(message, user, isWhisper);
            latestHash = hashCode;
        }

    }

    // call the function again after 100 milliseconds
    setTimeout(checkNewMessages, 50);
}

//----------------------------------------------------------------------------------

function SendMessageToServer(message, sender, isprivate) {

    var formData = new FormData();

    message = message.replace("<a href=\"", "").replace("/a>", "");

    formData.append("message", message);
    formData.append("sender", sender);
    formData.append("isprivate", isprivate);

    var request = new XMLHttpRequest();
    request.open('POST', "http://kongchat.gilgames.net/Site/DataProcessor.ashx?Type=ChatMessage");
    request.responseType = 'text';


    request.onload = function () {
        HandleMessageResponse(request.response);
    };

    request.send(formData);
}

function HandleMessageResponse(serverResponse) {

    // Commands:
    // Message - right after the command will come what should be submitted as a message!

    var messageCommand = "message"; // right after the command will come what should be submitted as message!
    var errorCommand = "error";

    if (serverResponse === "OK") {
        // Nothing to do, task is done and handled. Nice work people!
        return;
    }
    else if (serverResponse.substring(0, messageCommand.length).toLowerCase() == errorCommand) {
        // Uhoh. Error. Print the error message.
        WriteLog(serverResponse);
    }
    else if (serverResponse.substring(0, messageCommand.length).toLowerCase() == messageCommand) {
        SendMessage(serverResponse.substring(messageCommand.length));
    }
}

//----------------------------------------------------------------------------------

function SendMessage(messageToSent) {

    var chatBox = document.getElementsByClassName("chat_input");
    chatBox[1].focus();
    chatBox[1].value = messageToSent;


    var ev = document.createEvent('KeyboardEvent');
    ev.initKeyEvent('keypress', true, true, null, false, false, false, false, 13, 0);
    chatBox[1].dispatchEvent(ev);
}

//----------------------------------------------------------------------------------

function HashCode(message) {

    var hash = 0,
        i, chr;
    if (message.length === 0) return hash;

    for (i = 0; i < message.length; i++) {
        chr = message.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }

    return hash;
}

function WriteLog(log) {
    console.log("[PalaBot] " + log);
}

//----------------------------------------------------------------------------------


InitializeAndStart();