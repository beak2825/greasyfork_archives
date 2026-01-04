// ==UserScript==
// @name         hitbox.io IP Logger
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  See people's IP addresses in bonk.io
// @author       Aspect#8445
// @match        https://heav.io/*
// @match        https://hitbox.io/*
// @match        https://heav.io/*
// @match        https://hitbox.io/*
// @match        https://heav.io/*
// @match        https://hitbox.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hitbox.io
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/496026/hitboxio%20IP%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/496026/hitboxio%20IP%20Logger.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

window.onload = () => {
    window.RTCPeerConnection.prototype.addIceCandidate2 = window.RTCPeerConnection.prototype.addIceCandidate;
    window.RTCPeerConnection.prototype.addIceCandidate = function(...args) {
        if (!args[0].address.includes(".local")) {
            console.log(args[0].address,"IP");
        }
        else
        {
            console.log(args[0],"LOCAL? IP");
        }
        this.addIceCandidate2(...args);
    }
};