// ==UserScript==
// @name         Nickname.
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  .
// @author       surp331
// @match        fanix.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426887/Nickname.user.js
// @updateURL https://update.greasyfork.org/scripts/426887/Nickname.meta.js
// ==/UserScript==

setInterval(() => {
document.getElementsByClassName("nickname")[0].value = "!" + Math.round(Math.random() * 100000) + "e"
}, 7);