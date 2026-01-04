// ==UserScript==
// @name         idk
// @namespace    https://twojastrona.pl/
// @version      5.0
// @description   Script for vectaria This script have Copyright
// @author       x_Rediex
// @license      Copyright (c) 2025 x_Rediex. All Rights Reserved.
// @match        https://vectaria.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538104/idk.user.js
// @updateURL https://update.greasyfork.org/scripts/538104/idk.meta.js
// ==/UserScript==

// Copyright (c) 2025 x_Rediex
// All Rights Reserved.
// This script is protected by copyright law.
// Any unauthorized reproduction, distribution, modification,
// or publication of this code is strictly prohibited.
// You may not copy, share, upload, or reuse any part of this script
// without explicit written permission from the author (x_Rediex).


window.WebSocket = new Proxy(WebSocket, {
  construct: function(target, args, newTarget) {
    let [address, options] = args;
    let wsObj = new target(...[address, options]);
    if (address !== 'wss://ws.vectaria.io') {
        window.gamesocket = wsObj;
    }
    return wsObj;
  }
});

let FLIGHT = false;
let GHOST = false;

function getStatus() {
    return `Creative Mode ${FLIGHT ? 'ON' : 'OFF'} (keybind f); Ghost Mode ${GHOST ? 'ON' : 'OFF'} (keybind n)`;
}

window.addEventListener('keydown', function (e) {
    if (window.gamesocket && window.gamesocket.readyState === WebSocket.OPEN && e.key === 'f') {
        FLIGHT = !FLIGHT;
        if (FLIGHT) {
            gamesocket.dispatchEvent(new MessageEvent('message', { data: '{"key":38,"data":[3,{"mode":2}]}' }));
            gamesocket.dispatchEvent(new MessageEvent('message', { data: `{"key":38,"data":[1,{"msg":"${getStatus()}","type": 3}]}` }));
        } else if (GHOST) {
            gamesocket.dispatchEvent(new MessageEvent('message', { data: '{"key":38,"data":[3,{"mode":3}]}' }));
            gamesocket.dispatchEvent(new MessageEvent('message', { data: `{"key":38,"data":[1,{"msg":"${getStatus()}","type": 3}]}` }));
        }
        else {
            gamesocket.dispatchEvent(new MessageEvent('message', { data: '{"key":38,"data":[3,{"mode":1}]}' }));
            gamesocket.dispatchEvent(new MessageEvent('message', { data: `{"key":38,"data":[1,{"msg":"${getStatus()}","type": 3}]}` }));
        }

    }
});

window.addEventListener('keydown', function (e) {
    if (window.gamesocket && window.gamesocket.readyState === WebSocket.OPEN && e.key === 'n') {
        GHOST = !GHOST;
        if (GHOST) {
            gamesocket.dispatchEvent(new MessageEvent('message', { data: '{"key":38,"data":[3,{"mode":3}]}' }));
            gamesocket.dispatchEvent(new MessageEvent('message', { data: `{"key":38,"data":[1,{"msg":"${getStatus()}","type": 3}]}` }));
        } else if (FLIGHT) {
            gamesocket.dispatchEvent(new MessageEvent('message', { data: '{"key":38,"data":[3,{"mode":2}]}' }));
            gamesocket.dispatchEvent(new MessageEvent('message', { data: `{"key":38,"data":[1,{"msg":"${getStatus()}","type": 3}]}` }));
        }
        else {
            gamesocket.dispatchEvent(new MessageEvent('message', { data: '{"key":38,"data":[3,{"mode":1}]}' }));
            gamesocket.dispatchEvent(new MessageEvent('message', { data: `{"key":38,"data":[1,{"msg":"${getStatus()}","type": 3}]}` }));
        }

    }
});