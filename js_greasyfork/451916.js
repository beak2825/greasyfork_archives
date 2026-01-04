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
// @downloadURL https://update.greasyfork.org/scripts/451916/Bonkio%20IP%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/451916/Bonkio%20IP%20Logger.meta.js
// ==/UserScript==
/* jshint esversion: 6 */


let iframe = document.getElementById("maingameframe");
let w = iframe.contentWindow;

// get ad box
let ad = document.getElementById("adboxverticalleftCurse");


let getPingInfo = function() {
    var pings = document.getElementById("pings");
    pings.innerHTML = "Pings to hosts will appear here";
    var names = w.document.getElementsByClassName("newbonklobby_playerentry_name");
    var pings_ = w.document.getElementsByClassName("newbonklobby_playerentry_pingtext");
    if (!pings_.length) {
        pings.innerHTML += `<br> No ping info found...`;
    } else {
        for (var i = 0; i != names.length; i++) {
            pings.innerHTML += `<br> ${names[i].textContent}'s ping to host: ${pings_[i].textContent}`;
        }
    }
}


function resetBox() {
    // delete the other box
    document.getElementById("adboxverticalCurse").innerHTML = '';
    ad.style.overflow = "auto";
    let btn = document.createElement("button");
    btn.innerText = "Reset";
    let btn2 = document.createElement("button");
    btn2.innerText = "Get ping info";
    ad.style.marginLeft = "10px";
    ad.innerHTML = '<h1 style="font-family: sans-serif; color: pink">Hello Seraf!</h1>';
    ad.appendChild(btn);
    ad.appendChild(btn2);
    btn.setAttribute("onclick", "window.__rASP()");
    btn2.setAttribute("id", "getpings");
    ad.innerHTML += `<p id="pings" style="font-family: monospace; color: green;">Pings to hosts will appear here</p>`
    ad.innerHTML += `<p style="font-family: monospace; color: white; user-select: text;">The player infos will appear below.</p>`
    document.getElementById("getpings").addEventListener ("click", getPingInfo, false);
}
window.__rASP = resetBox;

resetBox();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function addPlayerInfo(info) {
    var igchat = w.document.getElementsByClassName("ingamechatstatus");
    var lobbychat = w.document.getElementsByClassName("newbonklobby_chat_status");
    var player_noti = null;
    var username = "unknown"
    if (igchat.length) {
        player_noti = igchat[igchat.length-1].textContent;
        username = player_noti.split("has joined the game")[0].split('*')[1];
    } else if (lobbychat.length) {
        player_noti = lobbychat[lobbychat.length-1].textContent;
        username = player_noti.split("has joined the game")[0].split('*')[1].trim();
    }
    ad.innerHTML += `<p style="font-family: monospace; color: white; user-select: text;">Got ${username}'s info: ${info}</p>`;
    return username;
}


function addGeoLink(ip, username) {
    ad.innerHTML += `<a target ="_blank" style="font-family: monospace; color: white;" href=${"http://ip-api.com/json/".concat(ip)}>more info and geolocation on ${username} (opens in new tab)</a>`;

}

function addSdp(sdp, username) {
    ad.innerHTML += `<p style="font-family: monospace; color: green; user-select: text;">Got ${username}'s sdp info: ${sdp}</p>`;
    ad.innerHTML += `<p style="font-family: monospace; color: white; user-select: text;">----------------</p>`;
}


w.RTCPeerConnection.prototype.addIceCandidate2 = w.RTCPeerConnection.prototype.addIceCandidate;
w.RTCPeerConnection.prototype.addIceCandidate = function(...args) {
    if (!args[0].address.includes(".local")) {
        if (args[0].address != "159.69.125.43") {
            var username = addPlayerInfo(args[0].candidate);
            addGeoLink(args[0].address, username);
        }
    }
    document.getElementById("getpings").addEventListener ("click", getPingInfo, false);
    this.addIceCandidate2(...args);
}

