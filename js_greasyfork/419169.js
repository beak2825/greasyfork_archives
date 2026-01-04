// ==UserScript==
// @name        Strip 4chan DeRefer
// @author      iralakaelah
// @description Strips the "de-referer" from 4chan links
// @include     http*://*.4chan.org/*
// @include     http*://*.4channel.org/*
// @include     http*://4chan.org/*
// @include     http*://4channel.org/*
// @version     1.04
// @run-at      document-start
// @namespace https://greasyfork.org/en/scripts/419169-strip-4chan-derefer
// @homepage  https://greasyfork.org/en/scripts/
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/419169/Strip%204chan%20DeRefer.user.js
// @updateURL https://update.greasyfork.org/scripts/419169/Strip%204chan%20DeRefer.meta.js
// ==/UserScript==
window.addEventListener('load', function() {
var dereferLinks = document.querySelectorAll ("a[href*='derefer']"); for (var J = dereferLinks.length - 1; J >= 0; --J) { var drLink = dereferLinks[J]; drLink.href = drLink.textContent; }
  }, false);