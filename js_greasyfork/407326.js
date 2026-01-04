// ==UserScript==
// @name        Adjust mobile view of newsmth.net
// @namespace   daimon2k
// @author      daimon2k
// @match       *://*.newsmth.net/*
// @grant       none
// @version     0.4
// @run-at      document-end
// @description 7/18/2020, 10:41:56 PM
// @downloadURL https://update.greasyfork.org/scripts/407326/Adjust%20mobile%20view%20of%20newsmthnet.user.js
// @updateURL https://update.greasyfork.org/scripts/407326/Adjust%20mobile%20view%20of%20newsmthnet.meta.js
// ==/UserScript==


(function() {
  var css = '.a-left {display:none !important}';
  css += '.a-content {font-size: 330% !important;}';
  css += '#top_head {display: none !important;}';
  css += '#sogou_banner {display: none !important;}';

  loadStyle(css)
  function loadStyle(css) {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.rel = 'stylesheet';
    style.appendChild(document.createTextNode(css));
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(style);
  }
  
  hideSidebar()
  function hideSidebar() {
    document.getElementsByClassName('ico-pos-hide')[0].click()
  }
})();