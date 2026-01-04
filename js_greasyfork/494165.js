// ==UserScript==
// @name        NHentai Jump on Page Turn Fix
// @namespace   Violentmonkey Scripts
// @match       *://nhentai.net/g/*
// @grant       none
// @version     1.0
// @author      -
// @description Creates div with class advertisement to not make javascript throw exception.
// @downloadURL https://update.greasyfork.org/scripts/494165/NHentai%20Jump%20on%20Page%20Turn%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/494165/NHentai%20Jump%20on%20Page%20Turn%20Fix.meta.js
// ==/UserScript==
(function() {
  var contentDiv = document.getElementById("content");
  var advertisementDiv = document.createElement('div');
  advertisementDiv.classList.add('advertisement');
  contentDiv.appendChild(advertisementDiv);
})();