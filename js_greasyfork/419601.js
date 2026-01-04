// ==UserScript==
// @name          CSS: privat24.privatbank.ua - payment templates
// @description   Corrections to UI of privat24.privatbank.ua to make the list of payment templates visible
// @author        MK
// @namespace     max44
// @homepage      https://greasyfork.org/en/users/309172-max44
// @include       https://privat24.privatbank.ua/*
// @include       http://privat24.privatbank.ua/*
// @icon          https://next.privat24.ua/img/pwa/android/logo_192.png
// @version       1.0.1
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/419601/CSS%3A%20privat24privatbankua%20-%20payment%20templates.user.js
// @updateURL https://update.greasyfork.org/scripts/419601/CSS%3A%20privat24privatbankua%20-%20payment%20templates.meta.js
// ==/UserScript==

(function() {
  var css = `
  /* Make iframe visible */
  #frame {
    min-height: 2000px !important;
    overflow-y: scroll !important;
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

    //Make iframe scrollable
    var iframe = document.getElementById ("frame");
    var frameDoc = iframe.contentWindow.document;
    frameDoc.documentElement.style.overflow = "yes";
  }
})();