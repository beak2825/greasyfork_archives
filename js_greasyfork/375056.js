// ==UserScript==
// @name         Sniperbot
// @namespace    Snipe
// @version      0.1
// @description  Snipe names kind of
// @author       You
// @match        https://account.mojang.com/me/renameProfile/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375056/Sniperbot.user.js
// @updateURL https://update.greasyfork.org/scripts/375056/Sniperbot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let time = prompt("in how many seconds you want the site to click the change name button?");
    time = time*1000
    setTimeout(
    function() {
      document.getElementById("changeButton").click();
    }, time);
})();