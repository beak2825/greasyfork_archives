// ==UserScript==
// @name         Disable Websites' PCDN
// @namespace    http://tampermonkey.net/
// @version      2025-04-17-2
// @description  Disable websites to use PCDN to upload content
// @author       Dyneeshely
// @license      AGPL
// @match        https://*.bilibili.com/*
// @icon         https://img.catrol.cn/icons/projects/user-scripts/disable-pcdn.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491421/Disable%20Websites%27%20PCDN.user.js
// @updateURL https://update.greasyfork.org/scripts/491421/Disable%20Websites%27%20PCDN.meta.js
// ==/UserScript==
 
(function() {
    'use strict';

    console.log('🔵 Websites\' PCDN disabled!');
 
    delete window.RTCPeerConnection;
    delete window.mozRTCPeerConnection;
    delete window.webkitRTCPeerConnection;
    delete window.RTCDataChannel;
    delete window.DataChannel;
})();