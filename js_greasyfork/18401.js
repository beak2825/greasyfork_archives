// ==UserScript==
// @name        eldiario
// @namespace   manobastardo
// @include     http://www.eldiario.es*
// @version     1
// @grant       none
// @description eldiario remove user distinction
// @downloadURL https://update.greasyfork.org/scripts/18401/eldiario.user.js
// @updateURL https://update.greasyfork.org/scripts/18401/eldiario.meta.js
// ==/UserScript==

var wait = setInterval(function() {
    var elements = $(".comment-item-v2-user_type");
   if (elements.length) {
       elements.removeClass("comment-item-v2-user_type");
      clearInterval(wait);
   }
}, 100);