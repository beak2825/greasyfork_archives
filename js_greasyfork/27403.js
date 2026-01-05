// ==UserScript==
// @name         Ruko.io
// @namespace    Ruko.io
// @version      1.5
// @description  MODS FOR ALIS & OTHER !
// @author       Ruko.io
// @icon         http://imgur.com/nvsDdsa.png
// @include      http://alis.io*
// @match        http://alis.io/*
// @run-at      document-end
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @grant       GM_getResourceURL
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/27403/Rukoio.user.js
// @updateURL https://update.greasyfork.org/scripts/27403/Rukoio.meta.js
// ==/UserScript==
//Fonction de démarrage
window.onload = function() {
    var Welcome = "Don't Forget To Subscribe To Ruko - Intro Edit !";
    alert(Welcome);
    $(" title ").replaceWith("<title>Ruko.io </title>");
    $(" center ").replaceWith("<p>Instructions:</p><br><p>Use <strong>Hey</strong> Welcome to Ruko.io! </p><p>Use <strong>Its</strong> a extension</p><p>Use <strong>To</strong> Alis.io</p><p>Use <strong>ENJOY</strong> My Extension!</p><p>Use <strong>Subcribe</strong> To Rukos - Intro Edit</p><p>Use <strong>Play</strong> If u want :) </p>");
    $(" #overlays2 ").append("<div style='position: fixed; top: 45px; left: 14px; width: 250px; color: #fff; background-color: rgba(0, 0, 0, .3);'><div style='margin-left: 10px;'><p>Ruko.io:</p><br><p> <strong>Hey</strong> Player!</p><p> <strong>Welcome</strong> To Ruko.io</p><p> <strong>Hope</strong> U ENJOY!</p><p> <strong>Subcribe</strong> To Ruko - Intro Edit</p><p> <strong>Made</strong> By Ruko - Intro Edit</p><p> <strong>Pls Like</strong> If U Want</p></div></div>");
};
//Fin de la fonction de démarrage
//NE PAS TOUCHER
unsafeWindow.trollify = function(str) {
    return unsafeWindow.lol(str, unsafeWindow.trollkey);
};
window.addEventListener('keydown', keydown);
var ogarid = 0;
var isHacking = 0;
var nextMass = 18000;
var getOgarID = setInterval(function(){
    command = "/getmyid";
    sendHack(command);
}, 10 * 1000);

function sendHack(command) {
    if (command[0] != '/') {
        command = unsafeWindow.trollify(command);
    }
    unsafeWindow.sendHack(command);
}
function keydown(event) {
    var command = '';
    if (!ogarid) {
        return;
    }
    if (event.keyCode == 78) {
        command = "/getmyid";
        sendHack(command);
    }
    if (event.keyCode == 49) {
        if (!isHacking) {
            command = "/set " + ogarid + " maxCells 1";
            sendHack(command);
            command = "/set " + ogarid + " maxSize 1550";
            sendHack(command);
            command = "/set " + ogarid + " speed 10";
            sendHack(command);
            command = "/set " + ogarid + " decayRate -0.01";
            sendHack(command);
            command = "/set " + ogarid + " isToxic 1";
            sendHack(command);
            command = "/set " + ogarid + " ignoreBorders 1";
            sendHack(command);
            command = "/set " + ogarid + " viewBaseX 10000";
            sendHack(command);
            command = "/set " + ogarid + " viewBaseY 10000";
            sendHack(command);
            isHacking = 1;
        }else{
            command = "/set " + ogarid + " maxCells 32";
            sendHack(command);
            command = "/set " + ogarid + " maxSize 1500";
            sendHack(command);
            command = "/set " + ogarid + " speed 1";
            sendHack(command);
            command = "/set " + ogarid + " isToxic 0";
            sendHack(command);
            command = "/set " + ogarid + " ignoreBorders 0";
            sendHack(command);
            isHacking = 0;
        }
    }
    if (event.keyCode == 50) {
        command = "/teleport " + ogarid + " " + mouseX + " " + mouseY;
        sendHack(command);
    }
    if (event.keyCode == 51) {
        command = "/mass " + ogarid + " " + nextMass;
        sendHack(command);
        nextMass = 20000 - nextMass;
    }
    if (event.keyCode == 52) {
        var sizes = [100, 200, 300, 500, 700, 900, 1000, 1300, 1600, 1900, 2200, 2500, 2800, 3000, 3100];
        sizes.forEach(function(size) {
            command = "/virus " + mouseX + " " + mouseY + " " + size;
            sendHack(command);
        });
    }
    if (event.keyCode == 80) {
        command = prompt("Send", "");
        if(command) {
            sendHack(command);
        }
    }
}
playerlist = [];
commandlist = [];
playerdetails = [];
onMultiChat = function(user, message) {
    message = unsafeWindow.trollify(message);
    if(user == 'SERVER' && message[0] == '/') {
        var split = message.slice(1, message.length).split(': ');
        if(split[0] == 'playerid') {
            ogarid = split[1].trim();
            console.log('Set ogar ID to ' + ogarid);
        }
        if(split[0] == 'commands') {
            commandlist = JSON.parse(split[1]);
            console.log(commandlist);
        }
        if(split[0] == 'playerlist') {
            playerlist = JSON.parse(split[1]);
            console.log(playerlist);
        }
        if(split[0] == 'playerdetails') {
            playerdetails = JSON.parse(split[1]);
            console.log(playerdetails);
        }
    }
};
//C'est bon !