// ==UserScript==
// @name         Bonk.io IP Logger
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  See people's IP addresses in bonk.io
// @author       Aspect#8445 & Burzum
// @match        *://bonk.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bonk.io
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/451649/Bonkio%20IP%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/451649/Bonkio%20IP%20Logger.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);


let iframe = document.getElementById("maingameframe");
let w = iframe.contentWindow;

// get ad box
let ad = document.getElementById("adboxverticalleftCurse");
function resetBox() {
    // delete the other box
    document.getElementById("adboxverticalCurse").innerHTML = '';
    ad.style.overflow = "auto";
    let btn = document.createElement("button");
    btn.innerText = "Reset";
    ad.style.marginLeft = "10px";
    ad.innerHTML = '<h1 style="font-family: sans-serif; color: pink">Hello Seraf!</h1>';
    ad.appendChild(btn);
    btn.setAttribute("onclick", "window.__rASP()");
    ad.innerHTML += `<p style="font-family: monospace; color: white; user-select: text;">The player infos will appear below.</p>`
}
window.__rASP = resetBox;

resetBox();

function addPlayerInfo(info) {
    var chat = w.document.getElementsByClassName("ingamechatstatus");
    var username = "unknown"
    if (chat.length) {
        var player_noti = chat[chat.length-1].textContent;
        username = player_noti.split("has joined the game")[0].split('*')[1];
    }
    ad.innerHTML += `<p style="font-family: monospace; color: white; user-select: text;">Got ${username}'s info: ${info}</p>`;
    return username;
}

function addGeoLink(ip, username) {
    ad.innerHTML += `<a style="font-family: monospace; color: white;" href=${"http://ip-api.com/json/".concat(ip)}>more info and geolocation on ${username} (open in new tab)</a>`;

}



w.RTCPeerConnection.prototype.addIceCandidate2 = w.RTCPeerConnection.prototype.addIceCandidate;
w.RTCPeerConnection.prototype.addIceCandidate = function(...args) {
    if (!args[0].address.includes(".local")) {
        if (args[0].address != "159.69.125.43") {
            var username = addPlayerInfo(args[0].candidate);
            addGeoLink(args[0].address, username);
        }
    }
    this.addIceCandidate2(...args);
}

