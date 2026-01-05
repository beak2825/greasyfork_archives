// ==UserScript==
// @name Steam Linkfilter Bypass
// @version 0.1
// @description Bypasses the steam link filter
// @match https://steamcommunity.com/linkfilter/*
// @run-at document-start
// @namespace https://greasyfork.org/users/3865
// @downloadURL https://update.greasyfork.org/scripts/3608/Steam%20Linkfilter%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/3608/Steam%20Linkfilter%20Bypass.meta.js
// ==/UserScript==

var URL = document.URL;
var str = URL.split("url=");
window.location = str[1]; 