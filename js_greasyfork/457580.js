// ==UserScript==
// @name         NewTab
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Permet d'ouvrir via un nouvel onglet les topics JVC.
// @author       PV
// @match        https://www.jeuxvideo.com/forums/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jeuxvideo.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457580/NewTab.user.js
// @updateURL https://update.greasyfork.org/scripts/457580/NewTab.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const links = document.querySelectorAll('.topic-title');
  for (const link of links) {
    link.setAttribute('target', '_blank');
  }
})();