// ==UserScript==
// @name          CSS: pictoa.com
// @description   Minor corrections to UI of pictoa.com
// @author        MK
// @namespace     max44
// @homepage      https://greasyfork.org/en/users/309172-max44
// @match         *://www.pictoa.com/*
// @icon          https://www.pictoa.com/favicon.ico
// @version       1.2
// @license       MIT
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/419503/CSS%3A%20pictoacom.user.js
// @updateURL https://update.greasyfork.org/scripts/419503/CSS%3A%20pictoacom.meta.js
// ==/UserScript==

(function() {
  var css = `
  #gallery #player {
    min-height: 950px !important;
  }
  #left {
    margin-right: 425px !important;
  }
  #right {
    width: 425px !important;
  }
  .thumb-nav-img {
    width: 100px !important;
    height: 100px !important;
  }
  .thumb-nav-img img {
    min-width: 100px !important;
    min-height: 73px !important;
    max-width: 100% !important;
    max-height: 100% !important;
    object-fit: contain !important;
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