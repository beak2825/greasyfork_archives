// ==UserScript==
// @name MotherlessAds
// @namespace Violentmonkey Scripts
// @grant none
// @include http://motherless.com/*
// @include http://*.motherless.com/*
// @run-at document-idle
// @description Remove Motherless Ads
// @version 0.1
// @downloadURL https://update.greasyfork.org/scripts/23888/MotherlessAds.user.js
// @updateURL https://update.greasyfork.org/scripts/23888/MotherlessAds.meta.js
// ==/UserScript==

clearInner(document.querySelector('.view-right'));

function clearInner(node) {
  while (node.hasChildNodes()) {
    clear(node.firstChild);
  }
}

function clear(node) {
  while (node.hasChildNodes()) {
    clear(node.firstChild);
  }
  node.parentNode.removeChild(node);
}

