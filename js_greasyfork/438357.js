// ==UserScript==
// @name          CSS: next.ua
// @description   Corrections to UI of next.ua
// @author        MK
// @namespace     max44
// @homepage      https://greasyfork.org/en/users/309172-max44
// @include       https://www.next.ua/*
// @icon          https://www.next.co.uk/Images/Next/favicon.ico
// @version       1.0.2
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/438357/CSS%3A%20nextua.user.js
// @updateURL https://update.greasyfork.org/scripts/438357/CSS%3A%20nextua.meta.js
// ==/UserScript==

(function() {
  var css = `
  /*Height of bank confirmation iframe*/
  iframe.wp-cl-iframe {
    height: 1200px !important;
  }
  `;

  if (typeof GM_addStyle != 'undefined') {
    GM_addStyle(css);
  } else if (typeof PRO_addStyle != 'undefined') {
    PRO_addStyle(css);
  } else if (typeof addStyle != 'undefined') {
    addStyle(css);
  } else {
    var node = document.createElement('style');
    node.type = 'text/css';
    node.appendChild(document.createTextNode(css));
    document.documentElement.appendChild(node);
  }
})();