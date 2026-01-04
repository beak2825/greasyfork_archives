// ==UserScript==
// @name        kanishka 2
// @namespace   chriskim06
// @description messing with kanishka again
// @include     https://www.w3schools.com/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/33229/kanishka%202.user.js
// @updateURL https://update.greasyfork.org/scripts/33229/kanishka%202.meta.js
// ==/UserScript==

var x = document.querySelector('.w3-right.w3-hide-small.w3-wide.toptext');
if (x) {
    x.innerText = 'You should be using MDN';
}