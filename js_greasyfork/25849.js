// ==UserScript==
// @name         Leij Extension Powerful and Useful! For Alis.io
// @namespace    Alis Leij Mods
// @version      1.5
// @description  MODS FOR ALIS & OTHER !
// @author       Leij
// @icon         http://i.imgur.com/ZVoMm7j.jpg
// @include      http://alis.io*
// @match        http://alis.io/*
// @run-at      document-end
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @grant       GM_getResourceURL
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/25849/Leij%20Extension%20Powerful%20and%20Useful%21%20For%20Alisio.user.js
// @updateURL https://update.greasyfork.org/scripts/25849/Leij%20Extension%20Powerful%20and%20Useful%21%20For%20Alisio.meta.js
// ==/UserScript==
//Fonction de démarrage
window.onload = function() {
    var welcome = "Don't Forget To Subscribe To Leij !";
    alert(welcome);
    $(" title ").replaceWith("<title>Agar Gods.io ?</title>");
    $(" center ").replaceWith("<p>Instructions:</p><br><p>Use <strong>N</strong> to active the hack !</p><p>Use <strong>1</strong> to toggle the hack !</p><p>Use <strong>2</strong> to teleport at your mouse !</p><p>Use <strong>3</strong> to change your mass !</p><p>Use <strong>4</strong> to toggle mass of virus !</p><p>Use <strong>P</strong> to active the bonus !</p>");
    $(" #overlays2 ").append("<div style='position: fixed; top: 45px; left: 14px; width: 250px; color: #fff; background-color: rgba(0, 0, 0, .3);'><div style='margin-left: 10px;'><p>Instructions:</p><br><p>Use <strong>N</strong> to active the hack !</p><p>Use <strong>1</strong> to toggle the hack !</p><p>Use <strong>2</strong> to teleport at your mouse !</p><p>Use <strong>3</strong> to change your mass !</p><p>Use <strong>4</strong> to toggle mass of virus !</p><p>Use <strong>P</strong> to active the bonus !</p></div></div>");
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