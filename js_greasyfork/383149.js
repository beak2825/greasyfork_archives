// ==UserScript==
// @name PTHome自动签到
// @namespace Violentmonkey Scripts
// @match *://www.pthome.net/*
// @run-at document-idle
// @grant GM_xmlhttpRequest
// @version 0.0.1.20190517134736
// @description PTHome自动签到脚本
// @downloadURL https://update.greasyfork.org/scripts/383149/PTHome%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/383149/PTHome%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==
(function () {
    'use strict';
    var keyName = "pthome-attend-date";
    function attend() {
        var todayStr = new Date().toLocaleDateString();
        var storeStr = localStorage.getItem(keyName);
        if (storeStr === undefined || storeStr === null || todayStr != storeStr) {
            GM_xmlhttpRequest({
                method: "GET",
                url: window.location.origin + '/attendance.php',
                onload: function (response) {
                    if (response.status === 200 && (response.responseText.indexOf("您今天已经签到过了") !== -1 || response.responseText.indexOf("签到成功") !== -1)) {
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