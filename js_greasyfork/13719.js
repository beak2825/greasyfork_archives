// ==UserScript==
// @name        KDS
// @description KDS utilities
// @namespace   https://greasyfork.org/users/11909
// @include     http://club.pchome.net/forum*
// @include     http://club.pchome.net/thread*
// @version     2015.11.09.03
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13719/KDS.user.js
// @updateURL https://update.greasyfork.org/scripts/13719/KDS.meta.js
// ==/UserScript==

;(function (window, document) {
  function showImage() {
    var imgs = document.querySelectorAll('.n3>a[rel]');
    var length = imgs.length;
    for (var i = 0; i < length; i++) {
      (function() {
        var img = imgs[i];
        img.parentNode.querySelector('img').onclick = function() {
          window.open(img.rel.replace('_128x128.', '.'));
        }
      }());
    }
  }
  
  function removeReply() {
    $('[id^=__Message]').each(function(){
      var current = $(this);
      if (/\bpm\b/.test(current.html().toLowerCase()))
        current.closest('div.item').remove();
    });
  }
  
  showImage();
  removeReply();
}(window, document));