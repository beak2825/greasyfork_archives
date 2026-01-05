// ==UserScript==
// @name  PLITT
// @version    1.0
// @namespace  ryenus.toys
// @include    http://www.google.tld/*
// @include    https://www.google.tld/*
// @include    http://www.google.co.tld/*
// @include    https://www.google.co.tld/*
// @include    http://www.google.com.tld/*
// @include    https://www.google.com.tld/*
// @description allow visiting search result without the redirection overhead
// @downloadURL https://update.greasyfork.org/scripts/3323/PLITT.user.js
// @updateURL https://update.greasyfork.org/scripts/3323/PLITT.meta.js
// ==/UserScript==

(function(d, t) {
  if (! (d.forms[0] && d.forms[0].action.match(/search/))) return;
  d.addEventListener('DOMSubtreeModified', function() {
    if (t == 0) t = setTimeout(function() {
      var r = d.getElementsByClassName('r'), n = r.length;
      if (n > d.getElementsByClassName('plitt').length) {
        while(n--) {
          var l = r[n].lastChild;
          l.insertAdjacentHTML("beforebegin",
            "<a href='" + l.href + "' target='_blank' class='plitt'>[#]</a> ");
        }
      }
      t = 0;
    }, 500);
  }, false);
})(document, 0);
