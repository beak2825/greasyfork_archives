// ==UserScript==
// @name         Replace old banners!
// @namespace    https://v3rmillion.net/
// @version      0.1
// @description  Let's bring back the old icons <3
// @author       https://v3rmillion.net/member.php?action=profile&uid=289487
// @include        *://*.v3rmillion.net/*
// @include        *://v3rmillion.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382569/Replace%20old%20banners%21.user.js
// @updateURL https://update.greasyfork.org/scripts/382569/Replace%20old%20banners%21.meta.js
// ==/UserScript==

(function() {
    window.onload = function () {
      var images = document.getElementsByTagName('img'),
      len = images.length, img, i;
      for (i = 0; i < len; i += 1) {
           img = images[i];
           if(img.src.includes('/Redesigned')){
               img.src = img.src.replace('/Redesigned', '');
           };
      }
   }
})();