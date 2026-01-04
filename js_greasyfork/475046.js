// ==UserScript==
// @name         Dark Chatbot
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Darkens emotes
// @author       Khar
// @license      MIT
// @match        https://*.character.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rentry.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475046/Dark%20Chatbot.user.js
// @updateURL https://update.greasyfork.org/scripts/475046/Dark%20Chatbot.meta.js
// ==/UserScript==

(function () {
var css = "em { color: grey !important; } del { text-decoration: none !important; } del::before { content: '~'; } del::after { content: '~' }";
var head = document.getElementsByTagName("head")[0];
var style = document.createElement("style");
style.setAttribute("type", 'text/css');
style.innerHTML = css;
head.appendChild(style);
})();