// ==UserScript==
// @name         BiliLive Exp++
// @namespace    https://std4453.github.io/
// @locale       zh-CN
// @version      1.0
// @description  刷经验不用开直播页面哦
// @author       std4453
// @match        http*://link.bilibili.com/p/center/*
// @grant        GM_log
// @connect      api.live.bilibili.com
// @iconURL      http://live.bilibili.com/favicon.ico
// @icon64URL    http://live.bilibili.com/favicon.ico
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/38474/BiliLive%20Exp%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/38474/BiliLive%20Exp%2B%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var DEBUG = false;

    var userOnlineHeart = "http://api.live.bilibili.com/User/userOnlineHeart";
    var heartBeatB = "http://api.live.bilibili.com/feed/v1/feed/heartBeat?_=";
    var interval = 30000;

    var fetch = (url, method) => {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.withCredentials = true;
            xhr.onload = e => {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) resolve(xhr.responseText, url);
                    else eject(new Error(xhr.statusText));
                }
            };
            xhr.onerror = reject;
            xhr.send(null);
        });
    };

    var send = (url, method) => {
        fetch(url, method).then(text => {
            if (DEBUG) console.log("Loaded " + url + ", get" + text);
        }, err => {
            if (DEBUG) {
                console.error("Unable to load " + url + ", got error:");
                console.error(err);
            }
        });
    };

    var sendHeartBeat = () => {
        if (DEBUG) GM_log("Sending heartbeat...");
        send(userOnlineHeart, "POST");
        send(heartBeatB + ((new Date()).getTime()), "GET");
        if (DEBUG) GM_log("Heartbeat sent.");
    };

    setInterval(sendHeartBeat, interval);
    GM_log("BiliLive Exp++ initialized!");
})();