// ==UserScript==
// @name         Bilibili Live P2P Block
// @namespace    http://github.com/RibomBalt
// @version      2025-06-19
// @description  block p2p webrtc on bilibili live
// @author       RibomBalt
// @match        *://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/539929/Bilibili%20Live%20P2P%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/539929/Bilibili%20Live%20P2P%20Block.meta.js
// ==/UserScript==

(function() {
    'use strict';
    delete window.RTCPeerConnection;
    delete window.mozRTCPeerConnection;
    delete window.webkitRTCPeerConnection;
    console.log('[Greasky Fork] Bilibili P2P Block script loaded. P2P connections are blocked.');
})();