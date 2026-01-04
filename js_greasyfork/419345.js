// ==UserScript==
// @name          CSS: cyberyozh.com
// @description   Corrections to UI of cyberyozh.com: font style
// @author        MK
// @namespace     max44
// @homepage      https://greasyfork.org/en/users/309172-max44
// @include       https://cyberyozh.com/*
// @include       http://cyberyozh.com/*
// @icon          https://cyberyozh.com/favicon.ico
// @version       1.1.2
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/419345/CSS%3A%20cyberyozhcom.user.js
// @updateURL https://update.greasyfork.org/scripts/419345/CSS%3A%20cyberyozhcom.meta.js
// ==/UserScript==

(function() {
  var css = `
  body, a {
    font-weight: normal !important;
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