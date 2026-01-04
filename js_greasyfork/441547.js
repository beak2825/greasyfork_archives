// ==UserScript==
// @name        Deepl Interface cleanup
// @namespace   Violentmonkey Scripts
// @match       https://www.deepl.com/translator
// @grant       none
// @version     0.4.1
// @author      Geekatori
// @license     GNU GPLv3
// @description Remove ads and custumers quote.
// @downloadURL https://update.greasyfork.org/scripts/441547/Deepl%20Interface%20cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/441547/Deepl%20Interface%20cleanup.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

(function() {
  var css = `
    #lmt_pro_ad_container,
    #dl_quotes_container,
    #iosAppAdPortal,
    #headlessui-portal-root,
    .showSeoText .eSEOtericText {
      display: none;
    }
    .dl_translator_page_container {
      min-height: 1px;
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