// ==UserScript==
// @name          CSS: pictoa.com (mobile)
// @description   Minor corrections to UI of pictoa.com for mobile devices
// @author        MK
// @namespace     max44
// @homepage      https://greasyfork.org/en/users/309172-max44
// @include       https://www.pictoa.com/*
// @include       http://www.pictoa.com/*
// @icon          https://www.pictoa.com/favicon.ico
// @version       1.1
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/433859/CSS%3A%20pictoacom%20%28mobile%29.user.js
// @updateURL https://update.greasyfork.org/scripts/433859/CSS%3A%20pictoacom%20%28mobile%29.meta.js
// ==/UserScript==

(function() {
  var css = `
  .thumbnails-pagination {
    padding-top: 25px !important;
    padding-bottom: 25px !important;
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