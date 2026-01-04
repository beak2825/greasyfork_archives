// ==UserScript==
// @name          CSS: earthquake.usgs.gov
// @description   Corrections to UI of earthquake.usgs.gov
// @author        MK
// @namespace     max44
// @homepage      https://greasyfork.org/en/users/309172-max44
// @match         *://earthquake.usgs.gov/*
// @icon          https://earthquake.usgs.gov/earthquakes/map/favicon.ico
// @version       1.0
// @license       MIT
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/451782/CSS%3A%20earthquakeusgsgov.user.js
// @updateURL https://update.greasyfork.org/scripts/451782/CSS%3A%20earthquakeusgsgov.meta.js
// ==/UserScript==

(function() {
  var css = `
  .leaflet-control {
    overflow-y: hidden !important;
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
