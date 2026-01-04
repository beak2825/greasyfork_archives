// ==UserScript==
// @name         读秀搜索页显示ssid
// @namespace    duxiu.ssid
// @version      0.1
// @description  在书名上方显示ssid
// @author       sanmxhj
// @include      *search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394972/%E8%AF%BB%E7%A7%80%E6%90%9C%E7%B4%A2%E9%A1%B5%E6%98%BE%E7%A4%BAssid.user.js
// @updateURL https://update.greasyfork.org/scripts/394972/%E8%AF%BB%E7%A7%80%E6%90%9C%E7%B4%A2%E9%A1%B5%E6%98%BE%E7%A4%BAssid.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var imgclass = document.getElementsByClassName("divImg");
    for (var i=0; i<imgclass.length; i++) {
        var ssidDiv = document.getElementById("ssid"+i);
        var ssid=ssidDiv.value
        var ssDiv = document.createElement("div");
        ssDiv.innerHTML = '<p id="myssid"><font color="magenta" size="4"><b>SS: ' + ssid + '</b></font></p>';
        ssidDiv.parentNode.insertBefore(ssDiv, ssidDiv);
    }
})();