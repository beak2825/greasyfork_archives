// ==UserScript==
// @name        Wykop Refresh
// @namespace   https://greasyfork.org/pl/scripts/458691-wykop-refresh
// @match       https://wykop.pl/*
// @grant       none
// @version     1.0
// @author      CML
// @description Kliknięcie logo odświeża stronę.
// @license     CC-BY-NC-SA-4.0
// @icon        https://wykop.pl/static/img/favicons/manifest-icon-192.png
// @downloadURL https://update.greasyfork.org/scripts/458691/Wykop%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/458691/Wykop%20Refresh.meta.js
// ==/UserScript==

var logo = document.querySelector('header.header > .left > a.logotype[data-v-5182b5f6]');
logo.addEventListener('click', reload, false);

function reload () { window.location.href=window.location.href; }
function refresh () { window.location.reload(); }
