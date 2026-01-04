// ==UserScript==
// @name          CSS: windy.com
// @description   Corrections to UI of windy.com
// @author        MK
// @namespace     max44
// @homepage      https://greasyfork.org/en/users/309172-max44
// @match         *://*.windy.com/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=windy.com
// @version       1.0
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/534161/CSS%3A%20windycom.user.js
// @updateURL https://update.greasyfork.org/scripts/534161/CSS%3A%20windycom.meta.js
// ==/UserScript==

(function() {
    'use strict';

  //Workaround: This document requires 'TrustedHTML' assignment
  if (window.trustedTypes && trustedTypes.createPolicy) {
    if (!trustedTypes.defaultPolicy) {
      const passThroughFn = (x) => x;
      trustedTypes.createPolicy('default', {
        createHTML: passThroughFn,
        createScriptURL: passThroughFn,
        createScript: passThroughFn,
      });
    }
  }

  var css = `
  /*Hide go premium button*/
  #desktop-premium-icon, .premium-button {
    display: none !important;
  }

  /*Hide premium map selectors*/
  .map-selector a.clickable:has(.premium-flag) {
    display: none !important;
  }

  /*Hide premium features*/
  .data-table .extended,
  #detail-box-desktop > div:has(.premium-flag),
  #plugin-detail .height-tides, #plugin-detail .legend-sst {
    display: none !important;
  }

  /*Hide watermark*/
  .premium-calendar #map-container::after {
    background-image: none !important;
  }

  /*Hide startup articles*/
  [data-plugin="startup-articles"] {
    display: none !important;
  }

  /*Make logo smaller*/
  #device-mobile #logo {
    left: 0 !important;
    margin-left: 10px !important;
    top: 0px !important;
  }
  .animated-windy-logo .w-sprite {
    width: 16px !important;
    height: 16px !important;
    background-size: 864px 16px !important;
  }
  .animated-windy-logo .text {
    width: 55px !important;
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