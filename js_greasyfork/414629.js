// ==UserScript==
// @name        Neptune
// @namespace   Violentmonkey Scripts
// @include        https://*neptun*/*hallgato*/*
// @include        https://*neptun*/*Hallgatoi*/*
// @include        https://*neptun*/*oktato*/*
// @include        https://*hallgato*.*neptun*/*
// @include        https://*oktato*.*neptun*/*
// @include        https://netw*.nnet.sze.hu/hallgato/*
// @include        https://nappw.dfad.duf.hu/hallgato/*
// @include        https://host.sdakft.hu/*
// @include        https://neptun.ejf.hu/ejfhw/*
// @grant       none
// @version     1.0
// @author      -
// @description 10/25/2020, 3:01:34 PM
// @downloadURL https://update.greasyfork.org/scripts/414629/Neptune.user.js
// @updateURL https://update.greasyfork.org/scripts/414629/Neptune.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
  document.getElementsByClassName("main_header_r")[0].style.backgroundImage = "url(https://i.imgur.com/2HVmKTd.png)";
  document.getElementsByClassName("main_header_l")[0].style.backgroundImage = "url(https://i.imgur.com/uYyLXru.jpg)";
  document.getElementsByClassName("NeptunChooserSelected")[0].style.backgroundImage = "url(https://i.imgur.com/GwjZXem.png)";
}, false);