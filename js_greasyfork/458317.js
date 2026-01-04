// ==UserScript==
// @name        Fix Tildes|Character.ai
// @namespace   An CSS user script
// @license     MIT
// @match       https://beta.character.ai/*
// @grant       none
// @version     1.1
// @author      Guranon and some others
// @description 1/16/2023, 8:55:02 AM
// @downloadURL https://update.greasyfork.org/scripts/458317/Fix%20Tildes%7CCharacterai.user.js
// @updateURL https://update.greasyfork.org/scripts/458317/Fix%20Tildes%7CCharacterai.meta.js
// ==/UserScript==

(function () {
var head = document.getElementsByTagName("head")[0];
var style = document.createElement("style");
var css = "del { text-decoration: none !important; } del::before { content: '~'; } del::after { content: '~' }";
style.setAttribute("type", 'text/css');
style.innerHTML = css;
head.appendChild(style);
})();

