// ==UserScript==
// @name         Remove Old Browser Alert
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes the pesky blue alert at the top of the screen telling you to switch to YouTube's new layout.
// @author       eM-Krow/Stop! You Violated The Law!
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396044/Remove%20Old%20Browser%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/396044/Remove%20Old%20Browser%20Alert.meta.js
// ==/UserScript==

let oldBrowserAlert = document.getElementById("old-browser-alert");
oldBrowserAlert.parentNode.removeChild(oldBrowserAlert);