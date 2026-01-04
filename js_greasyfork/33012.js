// ==UserScript==
// @name        kanishka
// @namespace   chriskim06
// @description messing with kanishka
// @include     https://stackoverflow.com/questions/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/33012/kanishka.user.js
// @updateURL https://update.greasyfork.org/scripts/33012/kanishka.meta.js
// ==/UserScript==

document.querySelector('#question-header .question-hyperlink').text = 'Why does every new terminal start with "balls"?';