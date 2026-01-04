// ==UserScript==
// @name        Ostar De-blurrer
// @description Disables the annoying "blur" effect when logging in to bankotsar.co.il
// @namespace   https://www.bankotsar.co.il/
// @include     https://www.bankotsar.co.il/wps/portal/*
// @version     1
// @grant       none
// @author      Sagie Maoz <n0nick@php.net>
// @downloadURL https://update.greasyfork.org/scripts/406539/Ostar%20De-blurrer.user.js
// @updateURL https://update.greasyfork.org/scripts/406539/Ostar%20De-blurrer.meta.js
// ==/UserScript==

var style = document.createElement('style');
style.innerHTML = '.blur { filter: none; transition: none; }';
document.body.appendChild(style);