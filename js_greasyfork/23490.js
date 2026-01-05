// ==UserScript==
// @name        FastPokeMap cleaner
// @description Remove header and footer to FastPokeMap
// @namespace   FPMHide
// @include     *://fastpokemap.se/*
// @version     3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/23490/FastPokeMap%20cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/23490/FastPokeMap%20cleaner.meta.js
// ==/UserScript==
// http://www.geekatori.com
(function () {
  'use strict';
  document.getElementById('map').style.height = '100vh';
  var adRoom =  document.querySelector('.adroom');
  var desktopHeader = document.querySelector('.desktop-header');
  var mobileHeader = document.querySelector('.mobile-header');
  var menu = document.querySelector('.slicknav_menu');

  adRoom.parentNode.removeChild(adRoom);
  desktopHeader.parentNode.removeChild(desktopHeader);
  mobileHeader.parentNode.removeChild(mobileHeader);
  menu.parentNode.removeChild(menu);
}) ();
