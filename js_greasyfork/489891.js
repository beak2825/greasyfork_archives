// ==UserScript==
// @name         Arras.io Token tool
// @namespace    http://tampermonkey.net/
// @version      v1.1
// @description  This script adds 2 functions to set/get your Arras Token, you may use these in the console (accessed by pressing F12 or CTRL+Shift+I). Use "setToken(token)" to set your Token. Use "getToken()" to print out the current Token. NOTE: the token parameter must be a string.
// @author       ItzFlowerGMD
// @match        https://arras.io/*
// @icon         https://arras.io/favicon/2048x2048.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489891/Arrasio%20Token%20tool.user.js
// @updateURL https://update.greasyfork.org/scripts/489891/Arrasio%20Token%20tool.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function setToken(token) {
        localStorage.setItem("arras.io", token);
        console.log("Token updated Token to: " + token + "\nReload the page to take effect.");
    }
    function getToken() {
        console.log("Current Token: " + localStorage.getItem("arras.io"));
    }
    window.setToken = setToken;
    window.getToken = getToken;
})();