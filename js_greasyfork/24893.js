// ==UserScript==
// @name         Lichess Forum Embed Images
// @namespace    https://en.lichess.org/@/print
// @version      0.1
// @description  Turn image URLs into embeded images.
// @author       Print
// @match        *://*.lichess.org/forum/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24893/Lichess%20Forum%20Embed%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/24893/Lichess%20Forum%20Embed%20Images.meta.js
// ==/UserScript==

(function() {
    'use strict';

var img = document.getElementsByTagName("a");
for (var i = 0, l = img.length; i < l; i++) {
  var imgno = img[i];
  var reg = new RegExp(/.*\.(png|svg|jpg|jpeg|gif|webp|tiff)/i);
  if (reg.test(imgno.href)){
    console.log(imgno.href);
    imgno.innerHTML = "<img src="+imgno.href+" width='100%'>";
  }
}


})();