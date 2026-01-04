// ==UserScript==
// @name         foes.io - ..:: BOT SPAMMER ::.. - By Kynan#9733
// @namespace    http://foes.io/*
// @version      6.9
// @description  Bot Spamer for foes.io, Hold 'Control' to start spamming!
// @author       Kynan#9733
// @match        https://foes.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389755/foesio%20-%20%3A%3A%20BOT%20SPAMMER%20%3A%3A%20-%20By%20Kynan9733.user.js
// @updateURL https://update.greasyfork.org/scripts/389755/foesio%20-%20%3A%3A%20BOT%20SPAMMER%20%3A%3A%20-%20By%20Kynan9733.meta.js
// ==/UserScript==

document.addEventListener("keydown", function(a) {
    if (a.keyCode == 17) {
    window.onload = function () {setInterval(enterGame(0))}
    window.open("https://foes.io")
    window.onload = function () {setInterval(enterGame(0))}
    }
}, false);