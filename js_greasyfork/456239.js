// ==UserScript==
// @name         Bonk.io IP Logger (ChojuKai)
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  See people's IP addresses in bonk.io!
// @author       ChojuKai YouTube
// @match        *://bonk.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bonk.io
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/456239/Bonkio%20IP%20Logger%20%28ChojuKai%29.user.js
// @updateURL https://update.greasyfork.org/scripts/456239/Bonkio%20IP%20Logger%20%28ChojuKai%29.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

window.onload = () => {
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
        ad.innerHTML = '<h1 style="font-family: sans-serif; color: white">IP Box</h1>';
        ad.appendChild(btn);
        btn.setAttribute("onclick", "window.__rASP()");
        ad.innerHTML += `<p style="font-family: monospace; color: green; user-select: text;">Addresses will appear here. Some addresses may be incorrect, if you get a static IP, they're likely on a VPN or you got the wrong address.</p>`
    }
    window.__rASP = resetBox;

    resetBox();

    function addIp(addr) {
        ad.innerHTML += `<p style="font-family: monospace; color: white; user-select: text;">Got IP address: ${addr}</p>`;
    }

    w.RTCPeerConnection.prototype.addIceCandidate2 = w.RTCPeerConnection.prototype.addIceCandidate;
    w.RTCPeerConnection.prototype.addIceCandidate = function(...args) {
        if (!args[0].address.includes(".local")) {
            addIp(args[0].address);
        }
        this.addIceCandidate2(...args);
    }
};