// ==UserScript==
// @license MIT
// @name         替换localhost为IP
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  用IP替换localhost，一般是本机IP。
// @match        http://localhost/*
// @match        https://localhost/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480662/%E6%9B%BF%E6%8D%A2localhost%E4%B8%BAIP.user.js
// @updateURL https://update.greasyfork.org/scripts/480662/%E6%9B%BF%E6%8D%A2localhost%E4%B8%BAIP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var savedIPAddress = localStorage.getItem("customIPAddress");
    var ipAddress = savedIPAddress || prompt("Please enter your local IP address:");

    if (ipAddress) {
        localStorage.setItem("customIPAddress", ipAddress);
        var newURL = window.location.href.replace('localhost', ipAddress.trim());
        window.location.href = newURL;
    }
})();