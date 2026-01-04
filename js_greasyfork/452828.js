// ==UserScript==
// @name         MPP Chat Mod
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Chat modification for multiplayerpiano.com
// @author       aeiou
// @include      /^https?://www\.multiplayerpiano\.com*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452828/MPP%20Chat%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/452828/MPP%20Chat%20Mod.meta.js
// ==/UserScript==

var gChatMutes = (localStorage.pianoMutes ? localStorage.pianoMutes : "").split(',').filter(v => v);
var channelId;
var idsInRoom = [];
var participantsInRoom = [];
var namesInRoom = [];
var colorsInRoom = [];

MPP.chat.receive = function(msg, noChange) {
    if (noChange) {
        defaultMsgReceive(msg);
        return;
    }
    var originalColor = hexToRgb(msg.p.color);
    var red = Math.floor((255 - originalColor.r) / 2 + originalColor.r);
    var green = Math.floor((255 - originalColor.g) / 2 + originalColor.g);
    var blue = Math.floor((255 - originalColor.b) / 2 + originalColor.b);
    msg.p.color = rgbToHex(red, green, blue);
    msg.p.name = timestampFromMs(msg.t) + ' | [' + msg.p._id + '] | ' + msg.p.name;
    defaultMsgReceive(msg);
}

function playerJoin(name, _id, id, color) {
    MPP.chat.receive({a:'joined the room', t:Date.now(), p:{_id:_id, name:name, color:color}});
}
function playerUpdate(name, _id, id, color) {
    MPP.chat.receive({a:'changed their name to ' + name, t:Date.now(), p:{_id:_id, name:namesInRoom[idsInRoom.indexOf(_id)], color:color}});
}
function playerLeave(name, _id, id, color) {
    MPP.chat.receive({a:'left the room', t:Date.now(), p:{_id:_id, name:name, color:color}});
}
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
function timestampFromMs(milliseconds) {
    var date = new Date(milliseconds)
    var hours = date.getHours().toString();
    var minutes = date.getMinutes().toString();
    if (hours.length === 1) {
        hours = '0' + hours;
    }
    if (minutes.length === 1) {
        minutes = '0' + minutes;
    }
    return hours + ':' + minutes;
}

function defaultMsgReceive(msg) {
    if(gChatMutes.indexOf(msg.p._id) != -1) return;
    var li = $('<li><span class="name"/><span class="message"/>');
    li.find(".name").text(msg.p.name + ":");
    li.find(".message").text(msg.a);
    li.css("color", msg.p.color || "white");
    $("#chat ul").append(li);
    var eles = $("#chat ul li").get();
    for(var i = 1; i <= 50 && i <= eles.length; i++) {
        eles[eles.length - i].style.opacity = 1.0 - (i * 0.03);
    }
    if(eles.length > 50) {
        eles[0].style.display = "none";
    }
    if(eles.length > 512) {
        $(eles[0]).remove();
    }
    // scroll to bottom if not "chatting" or if not scrolled up
    if(!$("#chat").hasClass("chatting")) {
        MPP.chat.scrollToBottom();
    } else {
        var ele = $("#chat ul").get(0);
        if(ele.scrollTop > ele.scrollHeight - ele.offsetHeight - 50) MPP.chat.scrollToBottom();
    }
}

MPP.client.on('ch', function(msg) {
    var isNewRoom = channelId !== msg.ch._id;
    channelId = msg.ch._id;
    var newIdsInRoom = [];
    var newNamesInRoom = [];
    var newColorsInRoom = [];
    var newParticipantsInRoom = [];
    for (var i = 0; i < msg.ppl.length; i++) {
        newIdsInRoom.push(msg.ppl[i]._id);
        newNamesInRoom.push(msg.ppl[i].name);
        newColorsInRoom.push(msg.ppl[i].color);
        newParticipantsInRoom.push(msg.ppl[i].id);
        if (!isNewRoom && !idsInRoom.includes(msg.ppl[i]._id)) {
            playerJoin(msg.ppl[i].name, msg.ppl[i]._id, msg.ppl[i].id, msg.ppl[i].color);
        }
    }
    for (var j = 0; j < idsInRoom.length; j++) {
        if (!isNewRoom && !newIdsInRoom.includes(idsInRoom[j])) {
            playerLeave(namesInRoom[j], idsInRoom[j], participantsInRoom[j], colorsInRoom[j]);
        }
    }
    idsInRoom = newIdsInRoom;
    namesInRoom = newNamesInRoom;
    colorsInRoom = newColorsInRoom;
    participantsInRoom = newParticipantsInRoom;
});
MPP.client.on('p', function(msg) {
    if (!idsInRoom.includes(msg._id)) {
        playerJoin(msg.name, msg._id, msg.id, msg.color);
        idsInRoom.push(msg._id);
        namesInRoom.push(msg.name);
        colorsInRoom.push(msg.color);
        participantsInRoom.push(msg.id);
    }
    if (namesInRoom[idsInRoom.indexOf(msg._id)] !== msg.name) {
        playerUpdate(msg.name, msg._id, msg.id, msg.color);
        namesInRoom[idsInRoom.indexOf(msg._id)] = msg.name;
    }
});
MPP.client.on('bye', function(msg) {
    for (var i = 0; i < idsInRoom.length; i++) {
        if (idsInRoom[i] === msg._id) {
            playerLeave(msg.name, msg._id, msg.id, msg.color);
            idsInRoom.splice(i, 1);
            namesInRoom.splice(i, 1);
            colorsInRoom.splice(i, 1);
            participantsInRoom.splice(i, 1);
        }
    }
});