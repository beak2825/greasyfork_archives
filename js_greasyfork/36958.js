// ==UserScript==
// @name         Bloble.io NoobScript V3 ChatCommands Fragment
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  A fragment of code from NoobScript V3 - Chat commands.
// @author       NoobishHacker
// @match        http://bloble.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36958/Blobleio%20NoobScript%20V3%20ChatCommands%20Fragment.user.js
// @updateURL https://update.greasyfork.org/scripts/36958/Blobleio%20NoobScript%20V3%20ChatCommands%20Fragment.meta.js
// ==/UserScript==

window.UIList = window.UIList || [];
window.initFuncs = window.initFuncs || [];
window.statusItems = window.statusItems || [];
window.overrideSocketEvents = window.overrideSocketEvents || [];

window.chatCommands = window.chatCommands || {};

window.resetCamera = function () { // Override
    camX = camXS = camY = camYS = 0;
    cameraKeys = {
        l: 0,
        r: 0,
        u: 0,
        d: 0
    }

    if (socket && window.overrideSocketEvents && window.overrideSocketEvents.length) {
        window.overrideSocketEvents.forEach((item) => {
            socket.removeAllListeners(item.name)
            socket.on(item.name, item.func);

        });

    }
}

var muted = [];
window.overrideSocketEvents.push({
    name: "ch",
    description: "Chat Muter",
    func: function (a, d, c) {
        if (!muted[a])
            addChatLine(a, d, c)
    }

})

window.addChat = function (msg, from, color) {
    color = color || "#fff";
    var b = document.createElement("li");
    b.className = "chatother";
    b.innerHTML = '<span style="color:' + color + '">[' + from + ']</span> <span class="chatText">' + msg + "</span>";
    10 < chatList.childNodes.length && chatList.removeChild(chatList.childNodes[0]);
    chatList.appendChild(b)
}


window.chatCommands.mute = function (split) {
    if (!split[1]) {
        addChat('Please specify a username or "all" for 1rst arg.')
    } else if (split[1] === 'all') {
        users.forEach((user) => {
            muted[user.sid] = true;
        });
        addChat('Muted ' + users.length + ' users', 'Client');

    } else {
        var len = 0;
        users.forEach((user) => {
            if (user.name === split[1]) {
                muted[user.sid] = true;
                len++;
            }

        });
        addChat('Muted ' + len + ' users with the name ' + split[1], 'Client');
    }
}
window.chatCommands.unmute = function (split) {
    if (!split[1]) {
        addChat('Please specify a username or "all" for 1rst arg.')
    } else if (split[1] === 'all') {
        addChat('Unmuted ' + Object.keys(mute).length + ' users', 'Client');
        muted = {};
    } else {
        var len = 0;
        users.forEach((user) => {
            if (user.name === split[1]) {
                muted[user.sid] = false;
                len++;
            }
        });
        addChat('Unmuted ' + len + ' users with the name ' + split[1], 'Client');
    }
}
window.chatCommands.help = function (split) {
    var avail = Object.keys(window.chatCommands);
    addChat('There are ' + avail.length + ' commands available.', 'Client')
    addChat(avail.join(', '), 'Client');
}

window.chatCommands.playerlist = function (split) {
    var page = parseInt(split[1]) || 1;
    var total = Math.ceil(users.length / 5);
    addChat('There are ' + users.length + ' players. Page ' + page + ' out of ' + total, 'Client')
    var offset = page * 5;
    for (var i = 0; i < 5; i++) {
        if (!users[i + offset]) break;
        addChat(users[i + offset].name, 'Client', playerColors[users[i + offset].color])
    }
}


window.chatCommands.clear = function () {
    while (chatList.hasChildNodes()) {
        chatList.removeChild(chatList.lastChild);
    }
}
var modsShown = true;
window.chatCommands.toggle = function () {
    var element = document.getElementById('noobscriptUI')
    if (modsShown) {
        modsShown = false;
        element.style.display = 'none';
        addChat('Mod Menu disabled', 'Client')
    } else {
        modsShown = true;
        element.style.display = 'block';
        addChat('Mod Menu enabled', 'Client')
    }
}

var chatHist = [];
var chatHistInd = -1;
var prevText = '';



setTimeout(function () {
    var old = chatInput
    chatInput = old.cloneNode(true);
    old.parentNode.replaceChild(chatInput, old);
    chatInput.onclick = function () {
        toggleChat(!0)
    };

    chatInput.addEventListener("keyup", function (a) {
        var b = a.which || a.keyCode;
        if (b === 38) { // up
            if (chatHistInd === -1) {
                prevText = chatInput.value;
                chatHistInd = chatHist.length;
            }
            if (chatHistInd > 0) chatHistInd--;
            chatInput.value = prevText + (chatHist[chatHistInd] || '')

        } else if (b === 40) {
            if (chatHistInd !== -1) {

                if (chatHistInd < chatHist.length) chatHistInd++;
                else chatHistInd = -1;
                chatInput.value = prevText + (chatHist[chatHistInd] || '')
            }
        } else
        if (gameState && socket && 13 === (a.which || a.keyCode) && "" != chatInput.value) {
            var value = chatInput.value;
            chatInput.value = ""
            mainCanvas.focus()
        
            if (value.charAt(0) === '/') {

                var split = value.split(' ');
                var name = split[0].substr(1);
                if (window.chatCommands[name]) window.chatCommands[name](split);
                else {
                    addChat("Command '" + name + "' not found. Please do /help for a list of commands.")
                }
            } else {
                socket.emit("ch", value)
            }
            if (chatHist[chatHist.length - 1] !== value) {
                var ind = chatHist.indexOf(value);
                if (ind !== -1) {
                    chatHist.splice(ind, 1);
                }
                chatHist.push(value);
            }
            chatHistInd = -1;
        }
    })
},1000)

