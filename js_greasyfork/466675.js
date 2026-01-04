// ==UserScript==
// @name         Supercarstadium, Ip Puller
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  Pulls Ips, In Supercarstadium
// @author       SayWHAt90
// @match        *://supercarstadium.com/*
// @icon         
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/466675/Supercarstadium%2C%20Ip%20Puller.user.js
// @updateURL https://update.greasyfork.org/scripts/466675/Supercarstadium%2C%20Ip%20Puller.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

window.onload = () => {
    let iframe = document.getElementById("maingameframe");
    let w;
    if (iframe) w = iframe.contentWindow;
    else w = window;

    // get ad box
    let ad = document.getElementById("adboxverticalleftCurse");
    if (!ad) {
        ad = document.createElement("div");
        ad.setAttribute("style", "padding: 50px; margin: auto;");
        document.body.appendChild(ad);
    }
    setInterval(() => {
        ad.style.display = "block";
    }, 100);
    function resetBox() {
        // delete the other box
        try { document.getElementById("adboxverticalCurse").innerHTML = ''; } catch(e) {};
        ad.style.overflow = "auto";
        let btn = document.createElement("button");
        btn.innerText = "Reset";
        ad.style.marginLeft = "10px";
        ad.innerHTML = '<h1 style="font-family: sans-serif; color: red">IP Puller</h1>';
        ad.appendChild(btn);
        btn.setAttribute("onclick", "window.__rASP()");
        ad.innerHTML += `<p style="font-family: monospace; color: green; user-select: text;">Static Ips will not change no matter what. Dynamic Ips can change</p>`
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