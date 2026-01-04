// ==UserScript==
// @name         RONCEPOURPRE - Confirmation pour poster
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  should you REALLY post this
// @author       .1019
// @match        https://roncepourpre.forumactif.com/*
// @icon         https://www.google.com/s2/favicons?domain=forumactif.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429226/RONCEPOURPRE%20-%20Confirmation%20pour%20poster.user.js
// @updateURL https://update.greasyfork.org/scripts/429226/RONCEPOURPRE%20-%20Confirmation%20pour%20poster.meta.js
// ==/UserScript==

let submitForm = document.querySelector('form[action="/post"]');

if(submitForm) {

    submitForm.setAttribute("onsubmit", "return confirm('Voulez-vous vraiment poster ce que vous avez écrit ? Vraiment ? Sûr.e sûr.e ? Hein ??')");
}