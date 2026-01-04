// ==UserScript==
// @name        bitchute
// @namespace   btc1
// @include     https://www.bitchute.com/*
// @run-at document-start
// @version     1
// @grant       none
// @description fix bitchute videos on seamonkey and palemoon
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442211/bitchute.user.js
// @updateURL https://update.greasyfork.org/scripts/442211/bitchute.meta.js
// ==/UserScript==
if(window.location.hostname == 'www.bitchute.com') {
   document.addEventListener("beforescriptexecute",
    function(e) {
      if(e.target.src == 'https://cdnjs.cloudflare.com/ajax/libs/plyr/3.6.9/plyr.polyfilled.min.js') {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/plyr/3.6.8/plyr.polyfilled.min.js';
        s.async = false;
        e.target.parentNode.insertBefore(s, e.target.nextSibling);
        e.preventDefault();
        e.stopPropagation();
      };
    }
   , true);
};