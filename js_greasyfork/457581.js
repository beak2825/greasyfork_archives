// ==UserScript==
// @name         Ouvrir les topics dans un nouvel onglet
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Permet d'ouvrir via un nouvel onglet les topics JVC.
// @author       PV
// @match        https://www.jeuxvideo.com/forums/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jeuxvideo.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457581/Ouvrir%20les%20topics%20dans%20un%20nouvel%20onglet.user.js
// @updateURL https://update.greasyfork.org/scripts/457581/Ouvrir%20les%20topics%20dans%20un%20nouvel%20onglet.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const links = document.querySelectorAll('.topic-title');
  for (const link of links) {
    link.setAttribute('target', '_blank');
  }
})();