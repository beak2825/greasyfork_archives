// ==UserScript==
// @name          CSS: marinetraffic.com
// @description   Corrections to UI of marinetraffic.com
// @author        MK
// @namespace     max44
// @homepage      https://greasyfork.org/en/users/309172-max44
// @match         *://*.marinetraffic.com/*
// @icon          https://www.marinetraffic.com/favicon_n.ico
// @version       1.2
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/419350/CSS%3A%20marinetrafficcom.user.js
// @updateURL https://update.greasyfork.org/scripts/419350/CSS%3A%20marinetrafficcom.meta.js
// ==/UserScript==

(function() {
  var css = `
  #skyscraper_container_front, .top-banner {
    display: none !important;
  }

  .MuiGrid-root.MuiGrid-item > .MuiGrid-root.MuiGrid-container > .MuiGrid-root.MuiGrid-item > .MuiStack-root {
    padding: 0px !important;
  }

  .smartbanner-android, #app .MuiContainer-root > .MuiGrid-root.MuiGrid-container > .MuiGrid-root.MuiGrid-item > .MuiGrid-root.MuiGrid-container > .MuiGrid-root.MuiGrid-item > .MuiStack-root {
    display: none !important;
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