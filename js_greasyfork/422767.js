// ==UserScript==
// @name         屏蔽 bilibili p2p 上传和下载
// @namespace    mscststs
// @version      0.1
// @description  屏蔽 bilibili 直播的 p2p 上传和下载
// @author       mscststs
// @grant 		unsafeWindow
// @match        https://live.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422767/%E5%B1%8F%E8%94%BD%20bilibili%20p2p%20%E4%B8%8A%E4%BC%A0%E5%92%8C%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/422767/%E5%B1%8F%E8%94%BD%20bilibili%20p2p%20%E4%B8%8A%E4%BC%A0%E5%92%8C%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // window.navigator.getUserMedia = window.webkitGetUserMedia = window.msGetUserMedia = null
    // window.MediaSource = window.WebKitMediaSource = null
    // window.RTCPeerConnection = window.webkitRTCPeerConnection = window.mozRTCPeerConnection = null
    window.RTCDataChannel = window.DataChannel = null
})();