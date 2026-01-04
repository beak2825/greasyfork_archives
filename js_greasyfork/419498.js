// ==UserScript==
// @name          CSS: webapp.navionics.com
// @description   Remove useless panels from webapp.navionics.com UI
// @author        MK
// @namespace     max44
// @homepage      https://greasyfork.org/en/users/309172-max44
// @match         *://webapp.navionics.com/*
// @icon          https://webapp.navionics.com/favicon.ico
// @version       1.2.3
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/419498/CSS%3A%20webappnavionicscom.user.js
// @updateURL https://update.greasyfork.org/scripts/419498/CSS%3A%20webappnavionicscom.meta.js
// ==/UserScript==

(function() {
  var css = `
  #site-header1, #site-footer, .shown.android:not(.foo), .ol-attribution, .site-adv, .ol-overlaycontainer-stopevent {
    height: 0px !important;
    visibility: hidden !important;
    display: none !important;
  }

  #site-content-wrapper:not(.card-content):not(.foo) {
    padding-top: 0px !important;
    height: 100% !important;
  }

  html {
    margin-top: 0px !important;
  }

  /*Remove cookies dialog*/
  div.truste_overlay, div.truste_box_overlay {
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
    /*var heads = document.getElementsByTagName('head');
    if (heads.length > 0) {
      heads[0].appendChild(node);
    } else {
      // no head yet, stick it whereever
      document.documentElement.appendChild(node);
    }*/
    document.documentElement.appendChild(node);
  }
})();