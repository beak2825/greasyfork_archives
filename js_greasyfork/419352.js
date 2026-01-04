// ==UserScript==
// @name          CSS: internationalwealth.info
// @description   Corrections to UI of internationalwealth.info: font style
// @author        MK
// @namespace     max44
// @homepage      https://greasyfork.org/en/users/309172-max44
// @include       https://internationalwealth.info/*
// @include       http://internationalwealth.info/*
// @icon          https://internationalwealth.info/favicon-32x32.png
// @version       1.1.2
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/419352/CSS%3A%20internationalwealthinfo.user.js
// @updateURL https://update.greasyfork.org/scripts/419352/CSS%3A%20internationalwealthinfo.meta.js
// ==/UserScript==

(function() {
  var css = `
  p, a {
    font-weight: normal !important;
  }
  /*ul, ol, li {
    font-size: 15px !important;
  }*/
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