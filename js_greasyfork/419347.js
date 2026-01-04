// ==UserScript==
// @name          CSS: startpage.com
// @description   Corrections to UI of startpage.com
// @author        MK
// @namespace     max44
// @homepage      https://greasyfork.org/en/users/309172-max44
// @match         *://*.startpage.com/*
// @version       2.0
// @license       MIT
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/419347/CSS%3A%20startpagecom.user.js
// @updateURL https://update.greasyfork.org/scripts/419347/CSS%3A%20startpagecom.meta.js
// ==/UserScript==

(function() {
  var css = `
  /* Bigger gap between search results */
  div.result {
    padding: 15px 0; !important;
  }
  /* Smaller gaps inside search result */
  a.result-title > h2 {
    margin: 3px 0 6px 0 !important;
  }
  /* Smaller font size of URL */
  .result > .upper > a {
    font-size: 12.5px !important;
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
