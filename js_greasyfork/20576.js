// ==UserScript==
// @name        Home Button
// @namespace   gaiaonline
// @description add the home button back to Gaia's nav
// @include     http://www.gaiaonline.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/20576/Home%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/20576/Home%20Button.meta.js
// ==/UserScript==

var nav = document.querySelector('#nav');
var home = document.createElement('li');
var divider = document.createElement('li');
divider.classList.add('megamenu-divider');
nav.insertBefore(divider, nav.children[0]);
home.classList.add('megamenu-standard-menu', 'megamenu-menu-home');
home.innerHTML = '<a class="megamenu-section-trigger" href="/">Home</a>';
nav.insertBefore(home,nav.children[0]);