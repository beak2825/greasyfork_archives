// ==UserScript==
// @name         Hack kc.zhixueyun.com
// @author       caixiaomao
// @namespace    http://tampermonkey.net/
// @version      2.0.6
// @description  允许同时学习多个课程
// @match        https://kc.zhixueyun.com/*
// @grant        none
// @license      MIT License
// @require      https://greasyfork.org/scripts/460824-wshook-js/code/wsHookjs.js?version=1154735
// @downloadURL https://update.greasyfork.org/scripts/460769/Hack%20kczhixueyuncom.user.js
// @updateURL https://update.greasyfork.org/scripts/460769/Hack%20kczhixueyuncom.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    wsHook.before = function(data, url, wsObject) {
        console.log("Sending message to " + url + " : " + data);
    };

    // Make sure your program calls `wsClient.onmessage` event handler somewhere.
    wsHook.after = function(messageEvent, url, wsObject) {
        let data = messageEvent.data;
        console.log("Received message from " + url + " : " + data);
        if(data.includes("1002") || data.includes("1003")) {
            console.log("检测到防多开，修改数据！")
            messageEvent.data = "3";
        }
        return messageEvent;
    };
    
})();