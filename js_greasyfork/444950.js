// ==UserScript==
// @name         禁用视频、直播网站的P2P上传功能（B站等）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  通过在直播页面禁用RTC来禁止P2P功能
// @author       小忍Alter
// @license      MIT
// @match        https://live.bilibili.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444950/%E7%A6%81%E7%94%A8%E8%A7%86%E9%A2%91%E3%80%81%E7%9B%B4%E6%92%AD%E7%BD%91%E7%AB%99%E7%9A%84P2P%E4%B8%8A%E4%BC%A0%E5%8A%9F%E8%83%BD%EF%BC%88B%E7%AB%99%E7%AD%89%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/444950/%E7%A6%81%E7%94%A8%E8%A7%86%E9%A2%91%E3%80%81%E7%9B%B4%E6%92%AD%E7%BD%91%E7%AB%99%E7%9A%84P2P%E4%B8%8A%E4%BC%A0%E5%8A%9F%E8%83%BD%EF%BC%88B%E7%AB%99%E7%AD%89%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    delete window.RTCDataChannel;
    delete window.DataChannel;
    delete window.RTCPeerConnection;
    delete window.mozRTCPeerConnection;
    delete window.webkitRTCPeerConnection;
})();