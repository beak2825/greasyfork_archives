// ==UserScript==
// @name         OWoT User Indicator 2
// @namespace    owot_user_indicator2
// @version      beta1.7.5
// @description  OWoT User Indicator but better.
// @author       Helloim0_0
// @match        *://*.ourworldoftext.com/*
// @match        localhost:8080
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ourworldoftext.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523223/OWoT%20User%20Indicator%202.user.js
// @updateURL https://update.greasyfork.org/scripts/523223/OWoT%20User%20Indicator%202.meta.js
// ==/UserScript==

w.broadcastReceive(true);
var activePeople = {};
var activePeopleGlobal = {};
var typingPeople = {};
var typingPeopleGlobal = {};
var typingLastSent = 0;
var afk = false;
var isTyping = false;
var globalSocket, globalSocketSender;
var currentInfo = "";
var first = true;
var canSendGlobal = false;
var logs = [];
var lastMessages = {};
var defaults = {
    onlineEnabled: 1,
    typingEnabled: 1,
    filterAnons: 0,
    afkLogs: 1,
    selfLogs: 0,
    hideWorlds: {},
    hideAsk: 1,
    filterChat: 1,
    maxLogs: 100
};
var options = localStorage.owotui2 ? JSON.parse(localStorage.owotui2) : JSON.parse(JSON.stringify(defaults));
if (!options.hideWorlds) options.hideWorlds = {};
if (options.hideWorlds[state.worldModel.name] === undefined && options.hideAsk) {
    options.hideWorlds[state.worldModel.name] = confirm("Would you like to hide this world from everyone using this script?");
}
updateOptsVer();
localStorage.owotui2 = JSON.stringify(options);

var infoModal = new Modal();
infoModal.createForm();
infoModal.setFormTitle("Info:");
infoModal.submitFn = updateOnlineModal;

var infoList = document.createElement("div");
infoList.className = "chatfield";
infoList.style.fontFamily = "monospace, monospace";
infoModal.client.firstChild.insertBefore(infoList, infoModal.client.firstChild.children[1]);
var infoString = document.createElement("div");
infoList.appendChild(infoString);

var onlineModal = new Modal();
onlineModal.addTab("list", "List");
onlineModal.addTab("logs", "Logs");
onlineModal.addTab("opts", "Options");
onlineModal.createForm();
onlineModal.setFormTitle("Online users:");
var titleOnlineModal = onlineModal.client.firstChild.firstChild.firstChild;

var onlineList = document.createElement("div");
onlineList.className = "chatfield";
onlineList.style.fontFamily = "monospace, monospace";
var placement = onlineModal.client.firstChild;
placement.insertBefore(onlineList, placement.children[1]);
var onlineString = document.createElement("div");
onlineList.appendChild(onlineString);

onlineModal.focusTab("logs");
onlineModal.createForm();
onlineModal.setFormTitle("Logs:");
var logsList = document.createElement("div");
logsList.className = "chatfield";
logsList.style.fontFamily = "monospace, monospace";
placement = onlineModal.client.firstChild;
placement.insertBefore(logsList, placement.children[1]);
var logsString = document.createElement("div");
logsList.appendChild(logsString);

function updateOptsVer() {
    for (let i of ["onlineEnabled", "typingEnabled", "filterAnons", "afkLogs", "selfLogs", "hideAsk", "filterChat", "maxLogs"]) {
        if (typeof options[i] == "undefined") options[i] = defaults[i];
    }
    localStorage.owotui2 = JSON.stringify(options);
}
function submitOpts() {
    if (onlineModal.currentTabCtx.id != "opts") return;
    options.onlineEnabled = +onlineModal.cbList[0].cbElm.checked;
    options.typingEnabled = +onlineModal.cbList[1].cbElm.checked;
    options.filterAnons = +onlineModal.cbList[2].cbElm.checked;
    options.afkLogs = +onlineModal.cbList[3].cbElm.checked;
    options.selfLogs = +onlineModal.cbList[4].cbElm.checked;
    options.hideWorlds[state.worldModel.name] = +onlineModal.cbList[5].cbElm.checked;
    options.hideAsk = +onlineModal.cbList[6].cbElm.checked;
    options.filterChat = +onlineModal.cbList[7].cbElm.checked;
    options.maxLogs = parseInt(onlineModal.formInputs[0].input.value);
    localStorage.owotui2 = JSON.stringify(options);
    sendUpdate();
}
function restoreOpts() {
    if (onlineModal.currentTabCtx.id != "opts") return;
    onlineModal.cbList[0].cbElm.checked = options.onlineEnabled;
    onlineModal.cbList[1].cbElm.checked = options.typingEnabled;
    onlineModal.cbList[2].cbElm.checked = options.filterAnons;
    onlineModal.cbList[3].cbElm.checked = options.afkLogs;
    onlineModal.cbList[4].cbElm.checked = options.selfLogs;
    onlineModal.cbList[5].cbElm.checked = options.hideWorlds[state.worldModel.name];
    onlineModal.cbList[6].cbElm.checked = options.hideAsk;
    onlineModal.cbList[7].cbElm.checked = options.filterChat;
    onlineModal.formInputs[0].input.value = options.maxLogs;
}
onlineModal.focusTab("opts");
for (let string of ["Show you're online", "Show you're typing", "Filter anons from list", "Log AFK updates", "Log own updates", "Hide this world", "Ask to hide new worlds", "Automatically filter chat"]) {
    onlineModal.createCheckboxField();
    onlineModal.addCheckbox(string);
}
onlineModal.createForm();
onlineModal.addEntry("Max logs size", "text", "number");
onlineModal.onSubmit(submitOpts);
onlineModal.onClose(restoreOpts);
restoreOpts();
onlineModal.tabChangeFn = function (id) {
    if (["list", "logs"].includes(id.id)) {
        onlineModal.setSize();
        if (id.id == "list") updateOnlineModal(false);
    } else {
        onlineModal.setSize(300);
    }
}
onlineModal.focusTab("list");

for (let list of [onlineList, infoList, logsList]) {
    list.style.minWidth = "300px";
    list.style.maxWidth = "1500px";
    list.style.minHeight = "180px";
    list.style.maxHeight = "900px";
    list.style.width = "calc(70vw - 35px)";
    list.style.height = "calc(70vh - 105px)";
}

function updateOnlineModal(show = true) {
    var string = "";
    var list = (selectedChatTab == 1) ? activePeopleGlobal : activePeople;
    var people = Object.entries(list);
    var peopleCount = {};
    for (let person of people) {
        var username = person[0].split("/").slice(0, -1).join("\n");
        if (options.filterAnons && !username.length) continue;
        var socket = person[0].split("/").at(-1);
        if (socket == "null") continue;
        peopleCount[username || socket] = peopleCount[username || socket] + 1 || 1;
    }
    onlineString.innerHTML = "";
    for (let person of Object.entries(peopleCount)) {
        var personDiv = document.createElement("div");
        if (person[1] > 1) {
            var span1 = document.createElement("span");
            span1.innerText = `${person[0]} (`;
            var underline = document.createElement("span");
            underline.innerText = `${person[1]}`;
            underline.onclick = function () {
                updateInfoModal(person[0].replace('"', '\"'), true, true);
            }
            underline.style.textDecoration = "underline";
            var span2 = document.createElement("span");
            span2.innerText = ")";
            var newLine = document.createElement("br");
            for (let element of [span1, underline, span2, newLine]) {
                personDiv.appendChild(element);
            }
        } else {
            var span = document.createElement("span");
            span.innerHTML = html_tag_esc(person[0]) + getInfo(person[0], true);
            personDiv.appendChild(span);
        }
        onlineString.appendChild(personDiv);
    }
    if (!onlineString.childElementCount) onlineString.innerText = "Nobody else is online.";
    titleOnlineModal.textContent = `Online users (${(selectedChatTab == 1) ? "global" : "this page"}):`;
    if (show) onlineModal.open();
}
function updateInfoModal(user, show = true, saveCurr = false) {
    if (saveCurr) currentInfo = user;
    var info = getInfo(user, false);
    infoString.innerHTML = info || "User has left all worlds.";
    if (show) infoModal.open();
}
function getInfo(user, startTable) {
    var username = user;
    user = getUser(user);
    var info = "";
    if (typeof user != "undefined") {
        for (let client of user) {
            if (!client.sender) continue;
            if (username != client.sender) {
                if (startTable) info += " | ";
                info += client.sender;
            }
            info += " | ";
            info += `${html_tag_esc(client.id)} | `;
            var status = client.afk ? "AFK" : "Online";
            info += status;
            if (typeof client.world == "string") {
                var escWorld = html_tag_esc(client.world);
                var trimmedWorld = escWorld.length > 32 ? escWorld.slice(0, 29) + "..." : escWorld;
                info += ` | World: <a href="${location.origin}/${escWorld}"><u>/${trimmedWorld}</u></a>`;
            }
            if (client.sender == w.socketChannel) info += " (you)";
            info += "<br>";
        }
    }
    return info;
}
elm.usr_online.addEventListener("click", updateOnlineModal);

function openSocket() {
    var protocol = location.protocol == "https:" ? "wss://" : "ws://";
    var url = location.host.replace(/^gsapi\./, "");
    globalSocket = new ReconnectingWebSocket(protocol + url + "/e_g./blank/ws/");
    globalSocket.onmessage = function (e) {
        var data = JSON.parse(e.data);
        if (data.kind == "cmd") updateCmd(data, 1);
        if (data.kind != "channel") return;
        globalSocketSender = data.sender;
        globalSocket.send(`{"kind":"cmd_opt"}`);
        canSendGlobal = true;
        sendUpdate(true);
    }
}
openSocket();

function getUser(name) {
    var list = (selectedChatTab == 1) ? activePeopleGlobal : activePeople;
    var user = Object.entries(list).filter(x => {
        var splitName = x[0].split("/").slice(0, -1).join("/");
        var socket = x[0].split("/").at(-1);
        var isUser = splitName == name || socket == name;
        return isUser;
    });
    if (!user.length) return undefined;
    return user.map(x => x[1]);
}
function typingString(people) {
    if (!people.length) return "Nobody else is typing.";
    if (people.length == 1) return people[0] + " is typing...";
    if (people.length < 4) return people.slice(0, -1).join(", ") + " and " + people.at(-1) + " are typing...";
    return "Several people are typing...";
}
function refreshTyping() {
    var list = (selectedChatTab == 1) ? typingPeopleGlobal : typingPeople;
    var people = Object.entries(list).filter(x => x[1].sender != w.socketChannel);
    var people2 = {};
    people.forEach(x => {
        var name = x[0].split("/").slice(0, -1).join("/");
        var socket = x[1].sender.slice(0, 6);
        var id = typeof x[1].id != "undefined" ? x[1].id : "?";
        people2[name ? `${name} (${id})` : `${socket}... (${id})`] = true;
    })
    people2 = Object.keys(people2);
    chat_typing.innerText = typingString(people2);
}

function addLog(string, doEsc = true) {
    if (doEsc) string = html_tag_esc(string);
    logs.unshift(string);
    logs = logs.slice(0, options.maxLogs);
    logsString.innerHTML = logs.join("<br>");
}
function blockSelfLog(name) {
    return !options.selfLogs || name != state.userModel.username;
}

function sendUpdate(globalOnly) {
    if (!options.onlineEnabled || !w.socketChannel) return;
    var message = {
        type: "hl_update",
        id: w.clientId,
        sender: w.socketChannel,
        afk: afk,
    };
    if (!globalOnly) w.broadcastCommand(JSON.stringify(message), true);
    if (!canSendGlobal) return;
    if (!options.hideWorlds[state.worldModel.name]) message.world = state.worldModel.name;
    if (first) message.first = true;
    globalSocket.send(JSON.stringify({
        kind: "cmd",
        include_username: true,
        data: JSON.stringify(message)
    }));
    first = false;
}
function sendTyping(typing) {
    if (!options.typingEnabled) return;
    typingLastSent = Date.now();
    var message = JSON.stringify({
        type: "hl_typing",
        id: w.clientId,
        sender: w.socketChannel,
        typing: typing,
    });
    if (selectedChatTab == 1) {
        return globalSocket.send(JSON.stringify({
            kind: "cmd",
            include_username: true,
            data: message
        }));
    }
    w.broadcastCommand(message, true);
}
function updateCmd(cmdData, field) {
    var activeList = field ? activePeopleGlobal : activePeople;
    var typingList = field ? typingPeopleGlobal : typingPeople;
    try {
        var data = JSON.parse(cmdData.data);
    } catch (e) {
        return;
    }
    if (!/^-?\d+$/g.test(data.id) || !/^[\da-f]{14}$/g.test(data.sender) || (options.filterAnons && cmdData.username === undefined)) return;
    var name = cmdData.username ? cmdData.username + "/" + data.sender : "/" + data.sender;
    var name2 = cmdData.username ? cmdData.username : data.sender;
    if (data.type == "hl_update") {
        delete data.type;
        if (!data.first && options.afkLogs && activeList[name]?.afk !== data.afk && !blockSelfLog(name2)) {
            addLog(`${name2} is now ${data.afk ? "AFK" : "online"}`);
        }
        if (data.first && data.sender != w.socketChannel && !blockSelfLog(name2)) {
            var escWorld = html_tag_esc(data.world);
            var trimmedWorld = escWorld.length > 32 ? escWorld.slice(0, 29) + "..." : escWorld;
            addLog(`${html_tag_esc(name2)} joined${data.world ? ` <a href="${location.origin}/${escWorld}"><u>/${trimmedWorld}</u></a>` : ""}`, false);
        }
        data.time = Date.now();
        activeList[name] = data;
        updateOnlineModal(false);
        if (currentInfo == name2) updateInfoModal(name2, false);
    }
    else if (data.type == "hl_exit") {
        if (!activeList[name]) return;
        if (!blockSelfLog(name2)) {
            var escWorld = html_tag_esc(data.world);
            var trimmedWorld = escWorld.length > 32 ? escWorld.slice(0, 29) + "..." : escWorld;
            addLog(`${html_tag_esc(name2)} left${data.world ? ` <a href="${location.origin}/${escWorld}"><u>/${trimmedWorld}</u></a>` : ""}`, false);
        }
        delete activeList[name];
        updateOnlineModal(false);
        if (currentInfo == name2) updateInfoModal(name2, false);
    }
    else if (data.type == "hl_typing") {
        if (!typingList[name] && data.typing) {
            data.time = Date.now();
            typingList[name] = data;
            refreshTyping();
        }
        else if (typingList[name] && !data.typing) {
            delete typingList[name];
            refreshTyping();
        }
    }
}
w.on("cmd", function (cmdData) {
    updateCmd(cmdData, 0);
});

window.addEventListener("blur", function enableAFK() {
    afk = true;
    sendUpdate(true);
});
window.addEventListener("focus", function disableAFK() {
    afk = false;
    sendUpdate(true);
});
window.addEventListener("beforeunload", function sendExit(e) {
    var name = state.userModel.username + "/" + w.socketChannel;
    if (!options.onlineEnabled && !activePeopleGlobal[name]) return;
    var message = {
        type: "hl_exit",
        sender: w.socketChannel,
        id: w.clientId
    };
    if (!options.hideWorlds[state.worldModel.name]) message.world = state.worldModel.name;
    globalSocket.send(JSON.stringify({
        kind: "cmd",
        include_username: true,
        data: JSON.stringify(message)
    }));
});

var harmfulRegex = /fuck|penis|dick|suck|suicide|kill|\bdie\b|nigg|bitch|porn|ass|nude|xxx|cp|pedo|whore|naked|sexy|\bsex\b|rape|gore|🍆|💦|murder|child|onion|mutilate/gi;
var cpRegex = /penis|dick|suck|porn|ass|nude|xxx|cp|pedo|naked|sexy|\bsex\b|rape|🍆|💦|child|onion/gi;
function getFurthestPoints(string) {
    var points = [...string].map(x => x.codePointAt(0)).sort((x, y) => x - y);
    return [points[0], points[points.length - 1]];
}
function getDifferentCharsCount(string) {
    var points = new Set([...string].map(x => x.codePointAt(0)));
    return points.size;
}
function getDifferentCharsRatio(string, lowest, highest) {
    var ratio = getDifferentCharsCount(string) / string.length;
    return ratio >= lowest && ratio <= highest;
}
function getSingleCharRatio(string, char, lowest, highest) {
    var ratio = [...string].filter(x => x == char).length / string.length;
    return ratio >= lowest && ratio <= highest;
}
function isAllEqual(array) {
    for (let i = 1; i < array.length; i++) {
        if (array[0] !== array[i]) return false;
    }
    return true;
}
function hasChinese(string) {
    for (let i of [...string]) {
        var point = i.codePointAt(0);
        if ((point >= 0x4e00 || point == 0x3002) && point <= 0x9fff) return true;
    }
    return false;
}
function isProbableCJKSpam(string) {
    var furthestPoints = getFurthestPoints(string);
    var isCJKa = furthestPoints[1] - furthestPoints[0] > 64000 && /[\ue000-\uf8ff]/.test(string);
    if (isCJKa) return true;
    var isCJKb = hasChinese(string) && getDifferentCharsRatio(string, 0.96, 1);
    return isCJKb;
}
function hasBraille(string) {
    for (let i of [...string]) {
        var point = i.codePointAt(0);
        if (point >= 0x2800 && point <= 0x28ff) return true;
    }
    return false;
}
function isProbableBraillePaste(string) {
    if (!hasBraille(string)) return false;
    var isBrailleA = getDifferentCharsCount(string) >= 30;
    if (isBrailleA) return true;
    var isBrailleB = getSingleCharRatio(string, "\u2800", 0.5, 1) || getSingleCharRatio(string, "\u28ff", 0.5, 1); // mostly empty or full blocks
    return isBrailleB;
}
function getHarmfulWordDensity(string) {
	var words = string.split(" ");
	var wordCount = words.length;
	var harmfulCount = 0;
	for (let word of words) {
		harmfulCount += harmfulRegex.test(word);
	}
	return harmfulCount / wordCount;
}
function getDifferentHarmfulCount(string) {
	var harmful = new Set(string.match(harmfulRegex));
	return harmful.size;
}
function getDifferentCPCount(string) {
	var cp = new Set(string.match(cpRegex));
	return cp.size;
}
function hasOnionLink(string) {
    if (!string.includes("http")) return false;
    if (string.includes("onion")) return true;
    var linkPart = string.slice(string.indexOf("http"));
    var differentChars = new Set(linkPart.match(/[a-z\d]/g)).size;
    return differentChars >= 15;
}
function isProbableThreat(string) {
    var words = string.split(" ");
    var isThreatA = getDifferentHarmfulCount(string) >= 3;
    var isThreatB = getHarmfulWordDensity(string) > 1 / 2 ** ((Math.min(words.length, 30) - 3) / 10); // I DONT KNOW WHAT THIS THRESHOLD IS IT JUST (probably) WORKS OKAY
    var isThreatC = getDifferentCPCount(string) >= 3;
    return (isThreatA && isThreatB) || isThreatC;
}
function isStariannaNick(string) {
    for (let copypaste of copypasteNicks) {
        if (string.toLowerCase().includes(copypaste)) return true;
    }
    var stariannaNickA = string.match(harmfulRegex)?.length >= 2;
    var stariannaNickB = hasOnionLink(string);
    return stariannaNickA || stariannaNickB;
}
function hasNonDigits(string) {
    return /[^\d-\.\s]/.test(string);
}
function noDigits(string) {
    return string.replace(/[\d-\.]/g, "").trim();
}
var spamMessages = [
    'i am using owot spammer hax',
    '"thank you for informing us of this situation, if this cyber attacker refuses to cease these attacks they will be reported to local authorities." 5 reports. This is the end for the Starianna Child Porn spamming bots.'
];
var copypasteNicks = [
    "pays his rent with", "is racist and hates", "shut yo ugly ass the",
    "i will fucking kill", "wants to kill an ani", "stfu you nasty bitch",
    "starianna did nothing wrong", "unmute all starianna bots now", "fuck you little piece of shit",
    "shoot your eyes ears", "lololololol fuck you", "i hope you fucking die",
    "fuck u all starianna", "fuck you all i bet your parents", "now you all will be taught",
    "hell horrifying sinful", "stop censoring child porn", "you are a stupid retarded",
    "looking ass dumb ass", "i love sexy child porn", "stop hating starianna",
    "stfu you smell like", "owot children extermination", "even though it's onion-only"
];
w.on("chatmod", function (e) {
    var data = e.dataObj ? e.dataObj : e;
    if (!options.filterChat) return;
    if (data.message.length >= 20 && isProbableCJKSpam(data.message)) {
        console.log("Filtered potential CJK spam: " + data.message);
        return e.hide = true;
    }
    if (data.message.length >= 20 && isProbableBraillePaste(data.message)) {
        console.log("Filtered potential braille paste: " + data.message);
        return e.hide = true;
    }
    if (isProbableThreat(data.message)) {
        console.log("Filtered potential Sabrina/Starianna hate speech: " + data.message);
        return e.hide = true;
    }
    if (!lastMessages[data.id]?.data) lastMessages[data.id] = {data: [], messages: []};
    var last = lastMessages[data.id];
    if (data.message == last.filtering || spamMessages.includes(data.message) || isStariannaNick(e.nickname)) {
        return e.hide = true;
    }
    last.data.push(data);
    last.messages.push(data.message);
    last.data = last.data.slice(-12);
    last.messages = last.messages.slice(-12);
    last.filtering = "";
    var log8 = Math.log2(data.message.length) / 3;
    var messageAmount = Math.max(6 - Math.floor(log8), 2); // IT JUST WORKS OKAY IM GOOD
    var messagesToCheck = last.messages.slice(-messageAmount);
    var enoughMessages = last.data[messageAmount - 1];
    if (enoughMessages && isAllEqual(messagesToCheck)) {
        removeMessages(e, data, last);
    };
    messagesToCheck = last.messages.slice(-messageAmount * 2).map(msg => noDigits(msg));
    enoughMessages = last.data[Math.floor(messageAmount * 1.5) - 1];
    if (enoughMessages && hasNonDigits(data.message) && isAllEqual(messagesToCheck)) {
        removeMessages(e, data, last);
    };
});
ws_functions.chathistory = function(data) {
    w.emit("chathistory", data);
    var global_prev = data.global_chat_prev;
    var page_prev = data.page_chat_prev;
    for(var g = 0; g < global_prev.length; g++) {
        var chat = global_prev[g];
        if (chat.hide) continue;
        var type = chatType(chat.registered, chat.nickname, chat.realUsername);
        addChat(chat.location, chat.id, type, chat.nickname,
                chat.message, chat.realUsername, chat.op, chat.admin, chat.staff, chat.color, chat.date, chat);
    }
    for(var p = 0; p < page_prev.length; p++) {
        var chat = page_prev[p];
        if (chat.hide) continue;
        var type = chatType(chat.registered, chat.nickname, chat.realUsername);
        addChat(chat.location, chat.id, type, chat.nickname,
                chat.message, chat.realUsername, chat.op, chat.admin, chat.staff, chat.color, chat.date, chat);
    }
}
w.on("chathistory", function (e) {
    for (let i of e.page_chat_prev) {
        w.emit("chatmod", i);
    }
    for (let i of e.global_chat_prev) {
        w.emit("chatmod", i);
    }
});
function chatbarListener() {
    var currentlyTyping = !!elm.chatbar.value.length && !elm.chatbar.value.startsWith("/");
    if (Date.now() > typingLastSent + 2000 || isTyping != currentlyTyping) {
        isTyping = currentlyTyping;
        sendTyping(currentlyTyping);
    }
}
elm.chatbar.addEventListener("input", chatbarListener);
window.sendChat = function () {
    var chatText = elm.chatbar.value;
    elm.chatbar.value = "";
    chatbarListener();
    var opts = {};
    if(defaultChatColor != null) {
        opts.color = "#" + ("00000" + defaultChatColor.toString(16)).slice(-6);
    }
    api_chat_send(chatText, opts);
}
function removeMessages(e, data, last) {
    e.hide = true;
    last.data.forEach(x => {
        removeChatByIdAndDate(x.id, x.date);
    });
    last.filtering = data.message;
}

window.updateUserCount = function () {
    var count = w.userCount;
    if(count == void 0) {
        elm.usr_online.innerText = "";
        return;
    }
    var unit = "user";
    var units = "users";
    var current_unit;
    if(count == 1) {
        current_unit = unit;
    } else {
        current_unit = units;
    }
    elm.usr_online.innerHTML = "<u>" + count + " " + current_unit + " online</u>";
}

if (!Permissions.can_chat(state.userModel, state.worldModel)) {
    w.doAnnounce("You can access OWoTUI2 through the menu.", "owotui2");
    window.menu.addOption("OWoTUI2", updateOnlineModal);
}

var chat_lower = byId("chat_lower");
chat_lower.style.display = "";
var chat_div = document.createElement("div");
chat_div.style.display = "flex";
chat_lower.insertBefore(chat_div, elm.chatbar);
chat_div.appendChild(elm.chatbar);
chat_div.appendChild(elm.chatsend);
var chat_typing = document.createElement("span");
chat_typing.style.display = "flex";
chat_typing.innerText = "Nobody else is typing.";
chat_typing.style.fontSize = "0.8em";
chat_typing.style.margin = "3px";
chat_typing.style.marginBottom = "0px";
chat_lower.insertBefore(chat_typing, chat_div);

var updateBlob = URL.createObjectURL(new Blob(["setInterval(function() {self.postMessage('')}, 10000);"]));
new Worker(updateBlob).onmessage = function() {
    sendUpdate();
}
setInterval(function () {
    var removedPeople = false;
    var removedTyping = false;
    for (let person of Object.entries(activePeople)) {
        if (Date.now() - person[1].time > 30000) {
            delete activePeople[person[0]];
            removedPeople = true;
        }
    }
    for (let person of Object.entries(activePeopleGlobal)) {
        if (Date.now() - person[1].time > 30000) {
            var name = person[0].split("/").slice(0, -1).join("/") || person[0].split("/").at(-1);
            var data = person[1];
            var escWorld = html_tag_esc(data.world);
            var trimmedWorld = escWorld.length > 32 ? escWorld.slice(0, 29) + "..." : escWorld;
            if (!blockSelfLog(name)) {
                addLog(`${html_tag_esc(name)} left${data.world ? ` <a href="${location.origin}/${escWorld}"><u>/${trimmedWorld}</u></a>` : ""}`, false);
            }
            delete activePeopleGlobal[person[0]];
            removedPeople = true;
        }
    }
    for (let person of Object.entries(typingPeople)) {
        if (Date.now() - person[1].time > 5000) {
            delete typingPeople[person[0]];
            removedTyping = true;
        }
    }
    for (let person of Object.entries(typingPeopleGlobal)) {
        if (Date.now() - person[1].time > 5000) {
            delete typingPeopleGlobal[person[0]];
            removedTyping = true;
        }
    }
    if (removedPeople) {
        updateOnlineModal(false);
        updateInfoModal(currentInfo, false);
    }
    if (removedTyping) refreshTyping();
}, 1000);