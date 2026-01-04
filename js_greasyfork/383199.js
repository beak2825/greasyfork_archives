// ==UserScript==
// @name 52pojie自动签到
// @namespace Violentmonkey Scripts
// @match *://www.52pojie.cn/*
// @match *://52pojie.cn/*
// @run-at document-idle
// @grant GM_xmlhttpRequest
// @version 0.0.1.20190517134736
// @description 52pojie自动签到脚本
// @downloadURL https://update.greasyfork.org/scripts/383199/52pojie%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/383199/52pojie%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==
(function () {
    'use strict';
    var keyName = "52pojie-attend-date";
    function attend() {
        var todayStr = new Date().toLocaleDateString();
        var storeStr = localStorage.getItem(keyName);
        if (storeStr === undefined || storeStr === null || todayStr != storeStr) {
            GM_xmlhttpRequest({
                method: "GET",
                url: window.location.origin + '/home.php?mod=task&do=apply&id=2',
                onload: function (response) {
                    if (response.status === 200 && (response.responseText.indexOf("任务已完成") !== -1 || response.responseText.indexOf("已申请过此任务") !== -1)) {
                        localStorage.setItem(keyName, todayStr);
                        console.log('attend at ' + new Date().toLocaleString());
                    } else {
                        console.log('attend failed. status=' + response.status);
                    }
                }
            });
        }

    }
    attend();
    setInterval(attend, 6 * 60 * 60 * 1000);
})();
